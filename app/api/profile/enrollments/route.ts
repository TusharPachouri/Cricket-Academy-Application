import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectDB } from "@/lib/mongodb";
import { Enrollment } from "@/lib/models";

export async function GET() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  // Find by userId (registered user) or by email (guest enrollment)
  const query = session.user.id !== "admin"
    ? { $or: [{ userId: session.user.id }, { email: session.user.email?.toLowerCase() }] }
    : { email: session.user.email?.toLowerCase() };

  const enrollments = await Enrollment.find(query)
    .sort({ createdAt: -1 })
    .lean();

  return NextResponse.json({ enrollments });
}
