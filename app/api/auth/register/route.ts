import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/lib/models";
import { rateLimit, getClientIp } from "@/lib/rateLimit";

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const { allowed, retryAfter } = rateLimit(`register:${ip}`);
  if (!allowed) {
    return NextResponse.json(
      { error: `Too many attempts. Try again in ${retryAfter}s.` },
      { status: 429 }
    );
  }

  try {
    const { firstName, lastName, email, password, phone } = await req.json();

    if (!firstName || !email || !password) {
      return NextResponse.json({ error: "First name, email and password are required." }, { status: 400 });
    }
    if (password.length < 8 || !/\d/.test(password)) {
      return NextResponse.json({ error: "Password must be at least 8 characters and contain a number." }, { status: 400 });
    }

    await connectDB();

    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    await User.create({
      name: `${firstName.trim()} ${lastName?.trim() || ""}`.trim(),
      email: email.toLowerCase().trim(),
      passwordHash,
      phone: phone?.trim(),
      role: "user",
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Register error:", err);
    return NextResponse.json({ error: "Registration failed. Please try again." }, { status: 500 });
  }
}
