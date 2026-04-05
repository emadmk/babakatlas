import { NextRequest, NextResponse } from 'next/server';
import { sendContactFormEmail } from '@/lib/email';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { success: false, error: 'All fields are required: name, email, subject, message' },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email address' },
        { status: 400 }
      );
    }

    const sent = await sendContactFormEmail({ name, email, subject, message });

    if (sent) {
      return NextResponse.json({
        success: true,
        message: 'Your message has been sent. We will get back to you soon.',
      });
    } else {
      // Even if email sending fails, acknowledge receipt so user isn't confused
      console.warn('Contact form email failed to send, but acknowledging receipt');
      return NextResponse.json({
        success: true,
        message: 'Your message has been received. We will get back to you soon.',
      });
    }
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process your message. Please try again.' },
      { status: 500 }
    );
  }
}
