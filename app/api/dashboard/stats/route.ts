import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectDB } from "@/lib/mongodb";
import { Enrollment, User } from "@/lib/models";

export async function GET() {
  const session = await auth();
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  const [
    totalEnrollments,
    paidEnrollments,
    pendingEnrollments,
    failedEnrollments,
    totalUsers,
    revenueAgg,
    packageAgg,
    recentEnrollments,
  ] = await Promise.all([
    Enrollment.countDocuments(),
    Enrollment.countDocuments({ status: "paid" }),
    Enrollment.countDocuments({ status: "pending" }),
    Enrollment.countDocuments({ status: "failed" }),
    User.countDocuments({ isActive: true }),
    Enrollment.aggregate([
      { $match: { status: "paid" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]),
    Enrollment.aggregate([
      { $match: { status: "paid" } },
      { $group: { _id: "$package", count: { $sum: 1 }, revenue: { $sum: "$amount" } } },
      { $sort: { count: -1 } },
    ]),
    Enrollment.find({ status: "paid" })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean(),
  ]);

  return NextResponse.json({
    stats: {
      totalEnrollments,
      paidEnrollments,
      pendingEnrollments,
      failedEnrollments,
      totalUsers,
      totalRevenue: revenueAgg[0]?.total ?? 0,
    },
    packageBreakdown: packageAgg,
    recentEnrollments,
  });
}
