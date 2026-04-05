import { NextRequest, NextResponse } from 'next/server';
import { sendTestEmail } from '@/lib/email';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const to = body.to || process.env.SMTP_USER || 'admin@atlasadaptive.com';

    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      return NextResponse.json(
        { success: false, error: 'SMTP not configured. Set SMTP_USER and SMTP_PASS in your .env file.' },
        { status: 503 }
      );
    }

    const sent = await sendTestEmail(to);

    if (sent) {
      return NextResponse.json({
        success: true,
        message: `Test email sent to ${to}`,
      });
    } else {
      return NextResponse.json(
        { success: false, error: 'Failed to send test email. Check your SMTP configuration.' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Test email error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send test email' },
      { status: 500 }
    );
  }
}
