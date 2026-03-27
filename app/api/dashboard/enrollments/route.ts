import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectDB } from "@/lib/mongodb";
import { Enrollment } from "@/lib/models";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  const { searchParams } = new URL(req.url);
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
  const limit = 20;
  const search = searchParams.get("search") ?? "";
  const status = searchParams.get("status") ?? "";

  const query: Record<string, unknown> = {};
  if (status && status !== "all") query.status = status;
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
      { phone: { $regex: search, $options: "i" } },
    ];
  }

  const [enrollments, total] = await Promise.all([
    Enrollment.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Enrollment.countDocuments(query),
  ]);

  return NextResponse.json({ enrollments, total, page, pages: Math.ceil(total / limit) });
}
