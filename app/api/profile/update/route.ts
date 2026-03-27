import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/lib/models";

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session || !session.user.id || session.user.id === "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { name, phone } = await req.json();

  if (!name || typeof name !== "string" || name.trim().length < 2) {
    return NextResponse.json({ error: "Name must be at least 2 characters." }, { status: 400 });
  }
  if (phone && !/^\+?[\d\s\-()]{7,15}$/.test(phone)) {
    return NextResponse.json({ error: "Invalid phone number." }, { status: 400 });
  }

  await connectDB();

  const user = await User.findByIdAndUpdate(
    session.user.id,
    { name: name.trim(), phone: phone?.trim() || undefined },
    { new: true, runValidators: true }
  ).lean();

  if (!user) return NextResponse.json({ error: "User not found." }, { status: 404 });

  return NextResponse.json({ success: true });
}
