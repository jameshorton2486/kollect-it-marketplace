import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

let resendClient: Resend | null = null;
function getResend() {
  if (!resendClient && process.env.RESEND_API_KEY) {
    resendClient = new Resend(process.env.RESEND_API_KEY);
  }
  return resendClient;
}

export async function POST(request: NextRequest) {
  try {
    const { email, firstName } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const resend = getResend();
    if (!resend) {
      // In dev or when key missing, skip send but report success to avoid user-facing failure
      console.warn("[newsletter] RESEND_API_KEY not set; skipping email send");
      return NextResponse.json({ success: true, skipped: true });
    }

    // Send welcome email with PDF link
    await resend.emails.send({
      from: process.env.EMAIL_FROM || "Kollect-It <noreply@kollect-it.com>",
      to: email,
      subject: "Your Free Collector's Guide to Caring for Antique Books",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: 'EB Garamond', Georgia, serif; line-height: 1.6; color: #2B2B2B; background-color: #F8F7F4; margin: 0; padding: 0;">
            <div style="max-width: 600px; margin: 40px auto; background-color: #FFFFFF; border-radius: 12px; overflow: hidden; box-shadow: 0 6px 16px rgba(0,0,0,0.12);">
              <!-- Header -->
              <div style="background-color: #2B2B2B; color: #FFFFFF; padding: 40px 30px; text-align: center;">
                <h1 style="margin: 0; font-size: 28px; font-weight: 400; letter-spacing: 2px;">
                  KOLLECT<span style="color: #B1874C; padding: 0 4px;">•</span>IT
                </h1>
              </div>

              <!-- Content -->
              <div style="padding: 40px 30px;">
                <h2 style="font-size: 24px; font-weight: 400; color: #2B2B2B; margin: 0 0 20px 0;">
                  ${firstName ? `Welcome, ${firstName}!` : "Welcome to Kollect-It!"}
                </h2>

                <p style="font-size: 16px; margin-bottom: 20px;">
                  Thank you for subscribing to our collector's community. As promised, here's your free guide to caring for antique books.
                </p>

                <p style="font-size: 16px; margin-bottom: 30px;">
                  This comprehensive PDF includes:
                </p>

                <ul style="font-size: 16px; margin-bottom: 30px; padding-left: 20px;">
                  <li style="margin-bottom: 10px;">Proper storage techniques to prevent damage</li>
                  <li style="margin-bottom: 10px;">Cleaning and maintenance best practices</li>
                  <li style="margin-bottom: 10px;">How to handle rare and delicate volumes</li>
                  <li style="margin-bottom: 10px;">Environmental controls (temperature, humidity, light)</li>
                  <li style="margin-bottom: 10px;">Insurance and documentation tips</li>
                </ul>

                <!-- CTA Button -->
                <div style="text-align: center; margin: 40px 0;">
            <a href="${process.env.NEXTAUTH_URL || "https://kollect-it.com"}/downloads/collectors-guide-antique-books.pdf"
              style="display: inline-block; background-color: #B1874C; color: #1F2A2E; padding: 16px 32px; text-decoration: none; font-weight: 600; border-radius: 12px; font-size: 16px; letter-spacing: 0.5px;">
                    Download Your Guide
                  </a>
                </div>

                <div style="border-top: 1px solid #E6E1D7; margin: 30px 0; padding-top: 30px;">
                  <p style="font-size: 14px; color: #6B7280; margin-bottom: 15px;">
                    <strong>What's next?</strong>
                  </p>
                  <p style="font-size: 14px; color: #6B7280; margin-bottom: 10px;">
                    • Browse our curated collection of authenticated antiques<br>
                    • Receive expert insights on collecting and preservation<br>
                    • Get early access to new arrivals and exclusive offers
                  </p>
                </div>
              </div>

              <!-- Footer -->
              <div style="background-color: #F8F7F4; padding: 30px; text-align: center; border-top: 1px solid #E6E1D7;">
                <p style="font-size: 14px; color: #6B7280; margin: 0 0 15px 0;">
                  <strong>Authenticated • Expert-Curated • Transparent Pricing</strong>
                </p>
                <p style="font-size: 12px; color: #6B7280; margin: 0;">
                  © ${new Date().getFullYear()} Kollect-It. All rights reserved.
                </p>
                <p style="font-size: 12px; color: #6B7280; margin: 10px 0 0 0;">
                  <a href="${process.env.NEXTAUTH_URL || "https://kollect-it.com"}/unsubscribe?email=${encodeURIComponent(email)}"
                     style="color: #6B7280; text-decoration: underline;">
                    Unsubscribe
                  </a>
                </p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    // Optional: Add to your email marketing platform
    // await addToMailingList(email, firstName);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Newsletter subscription error:", error);
    return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 });
  }
}
