import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST() {
  try {
    const user = process.env.GMAIL_USER || 'tn9573845@gmail.com';
    const pass = process.env.GMAIL_APP_PASSWORD || 'wdyfzkucgsubbagu';

    if (!user || !pass) {
      return NextResponse.json({ error: 'Missing email configuration' }, { status: 500 });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: user,
        pass: pass,
      },
    });

    const currentTime = new Date().toLocaleString('vi-VN');

    const mailOptions = {
      from: user,
      to: user,
      subject: '🚨 [BÁO ĐỘNG ĐỎ] Phát hiện hành vi soi mã nguồn Cẩm Cù House!',
      text: `Hệ thống vừa phát hiện hành vi khả nghi cố gắng mở DevTools hoặc sử dụng chuột phải trên website.\nThời gian phát hiện: ${currentTime}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; background-color: #1A0F0A; color: #F3E8DB; border-radius: 8px;">
          <h2 style="color: #C5A880;">🚨 Báo Động An Ninh Hệ Thống</h2>
          <p>Hệ thống vừa phát hiện hành vi khả nghi cố gắng mở DevTools, xem mã nguồn hoặc sử dụng chuột phải trên website Cẩm Cù House.</p>
          <p><strong>Thời gian phát hiện:</strong> <span style="color: #FFE1B3;">${currentTime}</span></p>
          <hr style="border-color: #C5A880; opacity: 0.3;" />
          <p style="font-size: 12px; color: #F3E8DB; opacity: 0.7;">Đây là email gửi tự động từ hệ thống SecurityShield của Cẩm Cù House. Vui lòng không trả lời email này.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true, message: 'Alert sent successfully' }, { status: 200 });
  } catch (error) {
    console.error('Lỗi khi gửi email cảnh báo:', error);
    return NextResponse.json({ error: 'Failed to send alert' }, { status: 500 });
  }
}
