import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectDB } from "@/lib/mongodb";
import { User, Enrollment } from "@/lib/models";

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

  const query: Record<string, unknown> = { role: "user" };
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
      { phone: { $regex: search, $options: "i" } },
    ];
  }

  const [users, total] = await Promise.all([
    User.find(query)
      .select("-passwordHash")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    User.countDocuments(query),
  ]);

  // Get latest enrollment per user
  const emails = users.map(u => u.email);
  const enrollments = await Enrollment.find({
    email: { $in: emails },
    status: "paid",
  })
    .sort({ createdAt: -1 })
    .lean();

  const enrollmentByEmail: Record<string, { package: string; createdAt: Date }> = {};
  for (const e of enrollments) {
    if (!enrollmentByEmail[e.email]) {
      enrollmentByEmail[e.email] = { package: e.package, createdAt: e.createdAt };
    }
  }

  const result = users.map(u => ({
    ...u,
    activePackage: enrollmentByEmail[u.email]?.package ?? null,
    enrolledAt: enrollmentByEmail[u.email]?.createdAt ?? null,
  }));

  return NextResponse.json({ students: result, total, page, pages: Math.ceil(total / limit) });
}
