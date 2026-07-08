import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Name, email, and message are required.' }, { status: 400 });
    }

    const recipient = process.env.SMTP_TO  || 'info@eastorlandolocksmith.com';

    const nodemailer = await import('nodemailer');

    const transporter = nodemailer.default.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER || '',
        pass: process.env.SMTP_PASS || '',
      },
    });

    await transporter.sendMail({
      from: `"${name}" <${process.env.SMTP_USER || 'noreply@eastorlandolocksmith.com'}>`,
      replyTo: email,
      to: recipient,
      subject: `Contact Form: ${name} - East Orlando Locksmith`,
      html: `
        <div style="font-family:sans-serif;max-width:500px">
          <h2>New Contact Form Submission</h2>
          <table style="width:100%;border-collapse:collapse">
            <tr><td style="padding:8px;font-weight:700;border-bottom:1px solid #ddd">Name</td><td style="padding:8px;border-bottom:1px solid #ddd">${name}</td></tr>
            <tr><td style="padding:8px;font-weight:700;border-bottom:1px solid #ddd">Email</td><td style="padding:8px;border-bottom:1px solid #ddd">${email}</td></tr>
            ${phone ? `<tr><td style="padding:8px;font-weight:700;border-bottom:1px solid #ddd">Phone</td><td style="padding:8px;border-bottom:1px solid #ddd">${phone}</td></tr>` : ''}
          </table>
          <h3 style="margin-top:20px">Message:</h3>
          <p style="background:#f5f5f5;padding:16px;border-radius:8px">${message}</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Contact form error:', err);
    return NextResponse.json({ error: 'Failed to send message. Please try again later.' }, { status: 500 });
  }
}
