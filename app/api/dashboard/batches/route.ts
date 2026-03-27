import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectDB } from "@/lib/mongodb";
import { Batch } from "@/lib/models";

export async function GET() {
  const session = await auth();
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();
  const batches = await Batch.find().sort({ createdAt: -1 }).lean();
  return NextResponse.json({ batches });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { name, packageId, packageName, days, timeStart, timeEnd, coachName, capacity } = body;

  if (!name || !packageId || !packageName || !days?.length || !timeStart || !timeEnd || !coachName) {
    return NextResponse.json({ error: "All fields are required." }, { status: 400 });
  }

  await connectDB();
  const batch = await Batch.create({
    name, packageId, packageName, days, timeStart, timeEnd, coachName,
    capacity: capacity ?? 20, enrolled: 0, isActive: true,
  });

  return NextResponse.json({ batch }, { status: 201 });
}
