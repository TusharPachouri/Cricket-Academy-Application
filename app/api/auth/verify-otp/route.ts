import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import PasswordReset from "@/lib/models/PasswordReset";
import { rateLimit, getClientIp } from "@/lib/rateLimit";

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const { allowed, retryAfter } = rateLimit(`verify-otp:${ip}`);
  if (!allowed) {
    return NextResponse.json(
      { error: `Too many attempts. Try again in ${retryAfter}s.` },
      { status: 429 }
    );
  }

  try {
    const { email, otp } = await req.json();

    if (!email || !otp)
      return NextResponse.json({ error: "Email and OTP are required." }, { status: 400 });

    await connectDB();

    const record = await PasswordReset.findOne({
      email: email.toLowerCase(),
      otp,
      expiresAt: { $gt: new Date() },
    });

    if (!record)
      return NextResponse.json({ error: "Invalid or expired OTP. Please try again." }, { status: 400 });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Verify OTP error:", err);
    return NextResponse.json({ error: "Verification failed. Please try again." }, { status: 500 });
  }
}
