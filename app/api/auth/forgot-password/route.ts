import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/lib/models";
import PasswordReset from "@/lib/models/PasswordReset";
import { rateLimit, getClientIp } from "@/lib/rateLimit";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const { allowed, retryAfter } = rateLimit(`forgot:${ip}`);
  if (!allowed) {
    return NextResponse.json(
      { error: `Too many attempts. Try again in ${retryAfter}s.` },
      { status: 429 }
    );
  }

  try {
    const { email } = await req.json();
    if (!email) return NextResponse.json({ error: "Email is required." }, { status: 400 });

    await connectDB();
    const user = await User.findOne({ email: email.toLowerCase().trim() });

    // Always return success to prevent email enumeration
    if (!user) return NextResponse.json({ success: true });

    // Delete any existing OTPs for this email
    await PasswordReset.deleteMany({ email: email.toLowerCase() });

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    await PasswordReset.create({ email: email.toLowerCase(), otp, expiresAt });

    await resend.emails.send({
      from: "Braj Cricket Academy <onboarding@resend.dev>",
      to: [email],
      subject: "Your Password Reset OTP — Braj Cricket Academy",
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:0 auto;">
          <div style="background:linear-gradient(135deg,#C5A059,#8B6914);padding:28px 32px;border-radius:12px 12px 0 0;">
            <h1 style="margin:0;color:#fff;font-size:22px;letter-spacing:0.05em;">BRAJ. CRICKET ACADEMY</h1>
          </div>
          <div style="background:#f9f7f2;padding:32px;border-radius:0 0 12px 12px;border:1px solid #e8e0d0;">
            <p style="margin:0 0 16px;font-size:15px;color:#333;">Hi ${user.name},</p>
            <p style="margin:0 0 24px;font-size:14px;color:#555;line-height:1.6;">
              Use the OTP below to reset your password. It expires in <strong>15 minutes</strong>.
            </p>
            <div style="text-align:center;background:#fff;border:2px dashed #C5A059;border-radius:12px;padding:24px;margin-bottom:24px;">
              <p style="margin:0 0 8px;font-size:12px;color:#888;letter-spacing:0.1em;text-transform:uppercase;">Your OTP</p>
              <p style="margin:0;font-size:42px;font-weight:700;color:#8B6914;letter-spacing:0.15em;">${otp}</p>
            </div>
            <p style="margin:0;font-size:12px;color:#888;">If you didn't request this, ignore this email. Your account is safe.</p>
          </div>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Forgot password error:", err);
    return NextResponse.json({ error: "Failed to send OTP. Please try again." }, { status: 500 });
  }
}
