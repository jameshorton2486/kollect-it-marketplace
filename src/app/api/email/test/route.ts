import { NextResponse } from 'next/server';
import { Resend } from 'resend';

// Validate Resend configuration
if (!process.env.RESEND_API_KEY) {
  throw new Error('RESEND_API_KEY is not defined');
}

if (!process.env.EMAIL_FROM) {
  throw new Error('EMAIL_FROM is not defined');
}

if (!process.env.ADMIN_EMAIL) {
  throw new Error('ADMIN_EMAIL is not defined');
}

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Email Test Endpoint
 * Sends a test email to verify Resend configuration
 *
 * SECURITY: Only available in development mode
 *
 * Usage: GET /api/email/test
 */
export async function GET(request: Request) {
  // Security: Only allow in development or with admin auth
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { error: 'Email test endpoint is not available in production' },
      { status: 403 }
    );
  }

  try {
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM!,
      to: process.env.ADMIN_EMAIL!,
      subject: 'Kollect-It Email Test - Configuration Successful! ✅',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
              }
              .header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 30px;
                border-radius: 8px;
                text-align: center;
                margin-bottom: 30px;
              }
              .content {
                background: #f9fafb;
                padding: 30px;
                border-radius: 8px;
                border: 1px solid #e5e7eb;
              }
              .success-badge {
                background: #10b981;
                color: white;
                padding: 8px 16px;
                border-radius: 20px;
                display: inline-block;
                font-weight: 600;
                margin-bottom: 20px;
              }
              .info-item {
                margin: 15px 0;
                padding: 12px;
                background: white;
                border-left: 4px solid #667eea;
                border-radius: 4px;
              }
              .info-label {
                font-weight: 600;
                color: #6b7280;
                font-size: 12px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
              }
              .info-value {
                color: #1f2937;
                font-size: 14px;
                margin-top: 4px;
              }
              .footer {
                margin-top: 30px;
                padding-top: 20px;
                border-top: 1px solid #e5e7eb;
                text-align: center;
                color: #6b7280;
                font-size: 12px;
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h1 style="margin: 0;">📧 Email Configuration Test</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">Kollect-It Marketplace</p>
            </div>

            <div class="content">
              <div class="success-badge">✅ Configuration Working</div>

              <p>This is a test email from your Kollect-It marketplace application.</p>

              <p><strong>If you received this email, your Resend configuration is working correctly!</strong></p>

              <div class="info-item">
                <div class="info-label">Sent At</div>
                <div class="info-value">${new Date().toISOString()}</div>
              </div>

              <div class="info-item">
                <div class="info-label">Environment</div>
                <div class="info-value">${process.env.NODE_ENV}</div>
              </div>

              <div class="info-item">
                <div class="info-label">From Address</div>
                <div class="info-value">${process.env.EMAIL_FROM}</div>
              </div>

              <div class="info-item">
                <div class="info-label">To Address</div>
                <div class="info-value">${process.env.ADMIN_EMAIL}</div>
              </div>

              <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">

              <h3 style="color: #1f2937; margin-top: 0;">What's Next?</h3>
              <ul style="color: #4b5563; line-height: 1.8;">
                <li>Your email system is ready for production</li>
                <li>Order confirmations will be sent to customers</li>
                <li>Admin notifications will arrive for new orders</li>
                <li>All email templates are configured and working</li>
              </ul>
            </div>

            <div class="footer">
              <p>This is an automated test email from Kollect-It Marketplace</p>
              <p>Generated with <a href="https://same.new" style="color: #667eea; text-decoration: none;">Same</a></p>
            </div>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: 'Test email sent successfully',
      messageId: data?.id,
      sentTo: process.env.ADMIN_EMAIL,
      sentFrom: process.env.EMAIL_FROM,
    });
  } catch (error) {
    console.error('Email test error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to send test email',
        details: 'Check your RESEND_API_KEY, EMAIL_FROM, and ADMIN_EMAIL environment variables',
      },
      { status: 500 }
    );
  }
}
