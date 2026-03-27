import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectDB } from "@/lib/mongodb";
import { Enrollment, Batch } from "@/lib/models";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();

  // Find latest paid enrollment
  const query = session.user.id !== "admin"
    ? { $or: [{ userId: session.user.id }, { email: session.user.email?.toLowerCase() }], status: "paid" }
    : { email: session.user.email?.toLowerCase(), status: "paid" };

  const enrollment = await Enrollment.findOne(query).sort({ createdAt: -1 }).lean();
  if (!enrollment) return NextResponse.json({ enrollment: null, batch: null });

  const batch = await Batch.findOne({ packageId: enrollment.packageId, isActive: true }).lean();

  return NextResponse.json({ enrollment, batch });
}
