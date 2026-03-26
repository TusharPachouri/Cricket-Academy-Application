import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";
import { rateLimit, getClientIp } from "@/lib/rateLimit";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  // Task 3: Rate limiting
  const ip = getClientIp(req);
  const { allowed, retryAfter } = rateLimit(`contact:${ip}`);
  if (!allowed) {
    return NextResponse.json(
      { error: `Too many requests. Please try again in ${retryAfter} seconds.` },
      { status: 429, headers: { "Retry-After": String(retryAfter) } }
    );
  }

  try {
    const body = await req.json();
    const { firstName, lastName, email, phone, message, _hp } = body;

    // Task 5: Honeypot check — bots fill hidden fields, humans don't
    if (_hp) {
      // Silently return 200 to fool the bot
      return NextResponse.json({ success: true });
    }

    if (!firstName || !email || !message) {
      return NextResponse.json(
        { error: "First name, email and message are required." },
        { status: 400 }
      );
    }

    const { data, error } = await resend.emails.send({
      from: "Braj Cricket Academy <onboarding@resend.dev>",
      to: [process.env.CONTACT_RECEIVER_EMAIL ?? "brajcricketacademy@gmail.com"],
      replyTo: email,
      subject: `New enquiry from ${firstName} ${lastName}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #1a1a1a;">
          <div style="background: linear-gradient(135deg, #C5A059, #8B6914); padding: 32px; border-radius: 12px 12px 0 0;">
            <h1 style="margin: 0; color: #fff; font-size: 24px; letter-spacing: 0.05em;">BRAJ. CRICKET ACADEMY</h1>
            <p style="margin: 8px 0 0; color: rgba(255,255,255,0.75); font-size: 13px;">New contact form submission</p>
          </div>
          <div style="background: #f9f7f2; padding: 32px; border-radius: 0 0 12px 12px; border: 1px solid #e8e0d0;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #e8e0d0; font-weight: 600; width: 130px; color: #8B6914;">Name</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #e8e0d0;">${firstName} ${lastName}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #e8e0d0; font-weight: 600; color: #8B6914;">Email</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #e8e0d0;"><a href="mailto:${email}" style="color: #C5A059;">${email}</a></td>
              </tr>
              ${phone ? `
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #e8e0d0; font-weight: 600; color: #8B6914;">Phone</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #e8e0d0;">${phone}</td>
              </tr>` : ""}
              <tr>
                <td colspan="2" style="padding: 20px 0 8px; font-weight: 600; color: #8B6914;">Message</td>
              </tr>
              <tr>
                <td colspan="2" style="padding: 0;">
                  <div style="background: #fff; border: 1px solid #e8e0d0; border-radius: 8px; padding: 16px; line-height: 1.65; color: #333;">
                    ${message.replace(/\n/g, "<br/>")}
                  </div>
                </td>
              </tr>
            </table>
          </div>
        </div>
      `,
    });

    // Task 7: Only log internally, never expose Resend error details to client
    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json({ error: "Failed to send message. Please try again." }, { status: 500 });
    }

    return NextResponse.json({ success: true, id: data?.id });
  } catch (err) {
    console.error("Contact API error:", err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
