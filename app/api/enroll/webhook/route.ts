import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { Resend } from "resend";
import { connectDB } from "@/lib/mongodb";
import { Enrollment, User, Batch } from "@/lib/models";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = req.headers.get("x-razorpay-signature");

    if (!signature) {
      return NextResponse.json({ error: "Missing signature." }, { status: 400 });
    }

    const expectedSig = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(body)
      .digest("hex");

    if (expectedSig !== signature) {
      console.error("Webhook signature mismatch");
      return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
    }

    const event = JSON.parse(body);

    if (event.event === "payment.captured") {
      const payment = event.payload.payment.entity;
      const notes = payment.notes || {};

      await connectDB();

      // Task 27: Save enrollment to DB
      const existingEnrollment = await Enrollment.findOne({
        razorpayOrderId: payment.order_id,
      });

      if (!existingEnrollment) {
        // Try to link to a registered user
        const user = await User.findOne({ email: notes.email?.toLowerCase() });

        // Get batch info for the package
        const batch = await Batch.findOne({ packageId: notes.packageId, isActive: true });

        await Enrollment.create({
          razorpayOrderId: payment.order_id,
          razorpayPaymentId: payment.id,
          userId: user?._id || undefined,
          name: notes.name || "Unknown",
          email: notes.email?.toLowerCase() || "",
          phone: notes.phone || "",
          age: notes.age ? parseInt(notes.age) : undefined,
          package: notes.package || "",
          packageId: notes.packageId || "",
          amount: payment.amount / 100, // convert paise to rupees
          currency: payment.currency || "INR",
          status: "paid",
        });

        // Task 28: Confirmation email to student
        await sendStudentEmail(notes, payment, batch);

        // Task 29: Admin notification email
        await sendAdminEmail(notes, payment);
      } else {
        // Update existing pending enrollment to paid
        existingEnrollment.razorpayPaymentId = payment.id;
        existingEnrollment.status = "paid";
        await existingEnrollment.save();
      }
    }

    if (event.event === "payment.failed") {
      const payment = event.payload.payment.entity;
      await connectDB();
      await Enrollment.findOneAndUpdate(
        { razorpayOrderId: payment.order_id },
        { status: "failed" }
      );
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Webhook handler error:", err);
    return NextResponse.json({ error: "Webhook processing failed." }, { status: 500 });
  }
}

async function sendStudentEmail(
  notes: Record<string, string>,
  payment: Record<string, unknown>,
  batch: { days?: string[]; timeStart?: string; timeEnd?: string; coachName?: string } | null
) {
  const batchInfo = batch
    ? `${(batch.days || []).join(", ")} · ${batch.timeStart}–${batch.timeEnd} · Coach: ${batch.coachName}`
    : "Batch details will be shared shortly";

  await resend.emails.send({
    from: "Braj Cricket Academy <onboarding@resend.dev>",
    to: [notes.email],
    subject: `Enrollment Confirmed — ${notes.package} 🏏`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#1a1a1a;">
        <div style="background:linear-gradient(135deg,#C5A059,#8B6914);padding:32px;border-radius:12px 12px 0 0;">
          <h1 style="margin:0;color:#fff;font-size:26px;letter-spacing:0.05em;">BRAJ. CRICKET ACADEMY</h1>
          <p style="margin:8px 0 0;color:rgba(255,255,255,0.8);font-size:14px;">Enrollment Confirmed ✓</p>
        </div>
        <div style="background:#f9f7f2;padding:32px;border-radius:0 0 12px 12px;border:1px solid #e8e0d0;">
          <p style="font-size:16px;margin:0 0 20px;">Hi <strong>${notes.name}</strong>,</p>
          <p style="margin:0 0 24px;color:#555;line-height:1.65;">
            Welcome to Braj Cricket Academy! Your enrollment for <strong>${notes.package}</strong> is confirmed.
            We're excited to have you join us.
          </p>
          <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
            <tr><td style="padding:10px 0;border-bottom:1px solid #e8e0d0;font-weight:600;width:140px;color:#8B6914;">Package</td><td style="padding:10px 0;border-bottom:1px solid #e8e0d0;">${notes.package}</td></tr>
            <tr><td style="padding:10px 0;border-bottom:1px solid #e8e0d0;font-weight:600;color:#8B6914;">Amount Paid</td><td style="padding:10px 0;border-bottom:1px solid #e8e0d0;">₹${(Number(payment.amount) / 100).toLocaleString("en-IN")}</td></tr>
            <tr><td style="padding:10px 0;border-bottom:1px solid #e8e0d0;font-weight:600;color:#8B6914;">Payment ID</td><td style="padding:10px 0;border-bottom:1px solid #e8e0d0;font-size:12px;color:#888;">${payment.id}</td></tr>
            <tr><td style="padding:10px 0;border-bottom:1px solid #e8e0d0;font-weight:600;color:#8B6914;">Batch Schedule</td><td style="padding:10px 0;border-bottom:1px solid #e8e0d0;">${batchInfo}</td></tr>
            <tr><td style="padding:10px 0;font-weight:600;color:#8B6914;">Location</td><td style="padding:10px 0;">Braj Sports Complex, Mathura, UP — 281001</td></tr>
          </table>
          <div style="background:#fff3cd;border:1px solid #ffc107;border-radius:8px;padding:16px;margin-bottom:24px;">
            <p style="margin:0;font-size:13px;color:#856404;"><strong>📋 What to bring on Day 1:</strong><br/>
            White cricket shoes · Personal bat (if available) · Water bottle · Academy fee receipt (this email)</p>
          </div>
          <p style="margin:0;font-size:13px;color:#888;">
            Questions? Call us at <a href="tel:+919876543210" style="color:#C5A059;">+91 98765 43210</a> or
            reply to this email.
          </p>
        </div>
      </div>
    `,
  });
}

async function sendAdminEmail(
  notes: Record<string, string>,
  payment: Record<string, unknown>
) {
  await resend.emails.send({
    from: "Braj Cricket Academy <onboarding@resend.dev>",
    to: [process.env.CONTACT_RECEIVER_EMAIL!],
    subject: `🏏 New Enrollment — ${notes.package} — ${notes.name}`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
        <div style="background:linear-gradient(135deg,#C5A059,#8B6914);padding:28px 32px;border-radius:12px 12px 0 0;">
          <h1 style="margin:0;color:#fff;font-size:22px;">New Enrollment Received</h1>
        </div>
        <div style="background:#f9f7f2;padding:32px;border-radius:0 0 12px 12px;border:1px solid #e8e0d0;">
          <table style="width:100%;border-collapse:collapse;">
            <tr><td style="padding:10px 0;border-bottom:1px solid #e8e0d0;font-weight:600;width:140px;color:#8B6914;">Name</td><td style="padding:10px 0;border-bottom:1px solid #e8e0d0;">${notes.name}</td></tr>
            <tr><td style="padding:10px 0;border-bottom:1px solid #e8e0d0;font-weight:600;color:#8B6914;">Email</td><td style="padding:10px 0;border-bottom:1px solid #e8e0d0;">${notes.email}</td></tr>
            <tr><td style="padding:10px 0;border-bottom:1px solid #e8e0d0;font-weight:600;color:#8B6914;">Phone</td><td style="padding:10px 0;border-bottom:1px solid #e8e0d0;">${notes.phone || "—"}</td></tr>
            <tr><td style="padding:10px 0;border-bottom:1px solid #e8e0d0;font-weight:600;color:#8B6914;">Age</td><td style="padding:10px 0;border-bottom:1px solid #e8e0d0;">${notes.age || "—"}</td></tr>
            <tr><td style="padding:10px 0;border-bottom:1px solid #e8e0d0;font-weight:600;color:#8B6914;">Package</td><td style="padding:10px 0;border-bottom:1px solid #e8e0d0;">${notes.package}</td></tr>
            <tr><td style="padding:10px 0;border-bottom:1px solid #e8e0d0;font-weight:600;color:#8B6914;">Amount</td><td style="padding:10px 0;border-bottom:1px solid #e8e0d0;font-weight:700;color:#2e7d32;">₹${(Number(payment.amount) / 100).toLocaleString("en-IN")}</td></tr>
            <tr><td style="padding:10px 0;border-bottom:1px solid #e8e0d0;font-weight:600;color:#8B6914;">Payment ID</td><td style="padding:10px 0;border-bottom:1px solid #e8e0d0;font-size:12px;color:#888;">${payment.id}</td></tr>
            <tr><td style="padding:10px 0;font-weight:600;color:#8B6914;">Order ID</td><td style="padding:10px 0;font-size:12px;color:#888;">${payment.order_id}</td></tr>
          </table>
        </div>
      </div>
    `,
  });
}
