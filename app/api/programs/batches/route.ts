import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Batch } from "@/lib/models";

export async function GET() {
  try {
    await connectDB();
    const batches = await Batch.find({ isActive: true }).sort({ packageId: 1, timeStart: 1 }).lean();

    // Group by packageId
    const grouped: Record<string, typeof batches> = {};
    for (const b of batches) {
      if (!grouped[b.packageId]) grouped[b.packageId] = [];
      grouped[b.packageId].push(b);
    }

    return NextResponse.json({ batches: grouped });
  } catch {
    return NextResponse.json({ batches: {} });
  }
}
