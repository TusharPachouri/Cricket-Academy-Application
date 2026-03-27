import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/lib/models";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const { isActive } = await req.json();

  if (typeof isActive !== "boolean") {
    return NextResponse.json({ error: "Invalid payload." }, { status: 400 });
  }

  await connectDB();
  await User.findByIdAndUpdate(id, { isActive });

  return NextResponse.json({ success: true });
}
