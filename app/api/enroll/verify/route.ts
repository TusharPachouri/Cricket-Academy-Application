import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: NextRequest) {
  try {
    const { paymentId, orderId, expectedAmount } = await req.json();

    if (!paymentId || !orderId) {
      return NextResponse.json({ error: "Missing paymentId or orderId." }, { status: 400 });
    }

    // Fetch the payment directly from Razorpay to verify server-side
    const payment = await razorpay.payments.fetch(paymentId);

    // Confirm the payment belongs to this order
    if (payment.order_id !== orderId) {
      console.error("Payment order mismatch", { paymentId, orderId, actualOrder: payment.order_id });
      return NextResponse.json({ error: "Payment verification failed." }, { status: 400 });
    }

    // Confirm payment is captured (not just authorized)
    if (payment.status !== "captured") {
      console.error("Payment not captured", { paymentId, status: payment.status });
      return NextResponse.json({ error: "Payment not completed." }, { status: 400 });
    }

    // Confirm the amount matches (amount from Razorpay is in paise)
    if (expectedAmount && payment.amount !== expectedAmount * 100) {
      console.error("Payment amount mismatch", { expected: expectedAmount * 100, actual: payment.amount });
      return NextResponse.json({ error: "Payment amount mismatch." }, { status: 400 });
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
