import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import { rateLimit, getClientIp } from "@/lib/rateLimit";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: NextRequest) {
  // Task 3: Rate limiting — max 5 order creations per IP per minute
  const ip = getClientIp(req);
  const { allowed, retryAfter } = rateLimit(`enroll:${ip}`);
  if (!allowed) {
    return NextResponse.json(
      { error: `Too many requests. Please try again in ${retryAfter} seconds.` },
      { status: 429, headers: { "Retry-After": String(retryAfter) } }
    );
  }

  try {
    const { amount, currency = "INR", receipt, notes } = await req.json();

    if (!amount || typeof amount !== "number" || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount." }, { status: 400 });
    }

    // Razorpay receipt max length is 40 characters
    const safeReceipt = (receipt || `braj_${Date.now()}`).slice(0, 40);

    const order = await razorpay.orders.create({
      amount: amount * 100, // paise
      currency,
      receipt: safeReceipt,
      notes,
    });

    return NextResponse.json({ orderId: order.id, amount: order.amount, currency: order.currency });
  } catch (err) {
    // Task 7: Log internally, return generic message to client
    console.error("Razorpay order error:", err);
    return NextResponse.json({ error: "Failed to create payment order. Please try again." }, { status: 500 });
  }
}
