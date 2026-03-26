import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = req.headers.get("x-razorpay-signature");

    if (!signature) {
      return NextResponse.json({ error: "Missing signature." }, { status: 400 });
    }

    // Task 2: Verify Razorpay webhook signature
    const secret = process.env.RAZORPAY_KEY_SECRET!;
    const expectedSig = crypto
      .createHmac("sha256", secret)
      .update(body)
      .digest("hex");

    if (expectedSig !== signature) {
      console.error("Webhook signature mismatch");
      return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
    }

    const event = JSON.parse(body);
    console.log("Razorpay webhook event:", event.event);

    // Handle payment captured
    if (event.event === "payment.captured") {
      const payment = event.payload.payment.entity;
      console.log("Payment captured:", payment.id, "Order:", payment.order_id);
      // DB save will be wired in Task 27 (Phase 4)
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Webhook handler error:", err);
    return NextResponse.json({ error: "Webhook processing failed." }, { status: 500 });
  }
}
