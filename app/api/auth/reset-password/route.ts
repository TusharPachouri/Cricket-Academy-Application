import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/lib/models";
import PasswordReset from "@/lib/models/PasswordReset";
import { rateLimit, getClientIp } from "@/lib/rateLimit";

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const { allowed, retryAfter } = rateLimit(`reset:${ip}`);
  if (!allowed) {
    return NextResponse.json({ error: `Too many attempts. Try again in ${retryAfter}s.` }, { status: 429 });
  }

  try {
    const { email, otp, password } = await req.json();

    if (!email || !otp || !password)
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });

    if (password.length < 8 || !/\d/.test(password))
      return NextResponse.json({ error: "Password must be at least 8 chars with a number." }, { status: 400 });

    await connectDB();

    const record = await PasswordReset.findOne({
      email: email.toLowerCase(),
      otp,
      expiresAt: { $gt: new Date() },
    });

    if (!record)
      return NextResponse.json({ error: "Invalid or expired OTP." }, { status: 400 });

    const passwordHash = await bcrypt.hash(password, 12);
    await User.updateOne({ email: email.toLowerCase() }, { passwordHash });
    await PasswordReset.deleteMany({ email: email.toLowerCase() });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Reset password error:", err);
    return NextResponse.json({ error: "Reset failed. Please try again." }, { status: 500 });
  }
}
