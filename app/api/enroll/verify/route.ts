import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import { auth } from "@/auth";
import { connectDB } from "@/lib/mongodb";
import { Enrollment, User, Batch } from "@/lib/models";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: NextRequest) {
  try {
    const { paymentId, orderId, expectedAmount, notes } = await req.json();

    if (!paymentId || !orderId) {
      return NextResponse.json({ error: "Missing paymentId or orderId." }, { status: 400 });
    }

    // Fetch the payment directly from Razorpay to verify server-side
    const payment = await razorpay.payments.fetch(paymentId);

    if (payment.order_id !== orderId) {
      return NextResponse.json({ error: "Payment verification failed." }, { status: 400 });
    }

    if (payment.status !== "captured") {
      return NextResponse.json({ error: "Payment not completed." }, { status: 400 });
    }

    if (expectedAmount && Number(payment.amount) !== expectedAmount * 100) {
      return NextResponse.json({ error: "Payment amount mismatch." }, { status: 400 });
    }

    // Save enrollment to DB (webhook may not fire on localhost)
    if (notes?.email) {
      await connectDB();

      const existing = await Enrollment.findOne({ razorpayOrderId: orderId });
      if (!existing) {
        const session = await auth();
        const user = session?.user?.id && session.user.id !== "admin"
          ? { _id: session.user.id }
          : await User.findOne({ email: notes.email?.toLowerCase() });

        const batch = await Batch.findOne({ packageId: notes.packageId, isActive: true });

        await Enrollment.create({
          razorpayOrderId: orderId,
          razorpayPaymentId: paymentId,
          userId: user?._id || undefined,
          name: notes.name || "Unknown",
          email: notes.email?.toLowerCase() || "",
          phone: notes.phone || "",
          age: notes.age ? parseInt(notes.age) : undefined,
          package: notes.package || "",
          packageId: notes.packageId || "",
          amount: Number(payment.amount) / 100,
          currency: payment.currency || "INR",
          status: "paid",
        });

        // Update batch enrolled count
        if (batch) {
          await Batch.findByIdAndUpdate(batch._id, { $inc: { enrolled: 1 } });
        }
      }
    }

    return NextResponse.json({
      verified: true,
      paymentId: payment.id,
      amount: payment.amount,
      status: payment.status,
    });
  } catch (err) {
    console.error("Payment verification error:", err);
    return NextResponse.json({ error: "Verification failed. Please contact support." }, { status: 500 });
  }
}
