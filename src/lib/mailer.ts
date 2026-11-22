import nodemailer from 'nodemailer';
import { prisma } from './prisma';
import { getAntiSpamConfig } from './antiSpam';

// Outbound Gmail circuit breaker (maxGmailPerHour: default 15)
const hourlyMailTimestamps: number[] = [];

export async function checkMailCircuitBreaker(): Promise<{ allowed: boolean; error?: string }> {
  try {
    const antiSpam = await getAntiSpamConfig();
    const maxPerHour = antiSpam?.maxGmailPerHour || 15;
    const oneHourAgo = Date.now() - 60 * 60 * 1000;

    // Clean old timestamps older than 1 hour
    while (hourlyMailTimestamps.length > 0 && hourlyMailTimestamps[0] < oneHourAgo) {
      hourlyMailTimestamps.shift();
    }

    if (hourlyMailTimestamps.length >= maxPerHour) {
      const errorMsg = `Outbound Gmail circuit breaker triggered: Đã đạt ngưỡng tối đa ${maxPerHour} email/giờ`;
      console.warn(`[mailer] ${errorMsg}`);
      return { allowed: false, error: errorMsg };
    }

    return { allowed: true };
  } catch (err) {
    console.error('[mailer] Error checking circuit breaker:', err);
    return { allowed: true };
  }
}

export function recordSentMail(): void {
  hourlyMailTimestamps.push(Date.now());
}

export function getMailRateLastHour(): number {
  const oneHourAgo = Date.now() - 60 * 60 * 1000;
  while (hourlyMailTimestamps.length > 0 && hourlyMailTimestamps[0] < oneHourAgo) {
    hourlyMailTimestamps.shift();
  }
  return hourlyMailTimestamps.length;
}

interface ContactPayload {
  id: string;
  fullName: string;
  phone: string;
  email?: string | null;
  subject?: string | null;
  message: string;
  createdAt: Date | string;
}

interface MailerResult {
  status: 'SENT' | 'FAILED' | 'DISABLED' | 'NOT_CONFIGURED';
  sentTo?: string;
  error?: string;
}

/**
 * Creates a Nodemailer transporter using Gmail SMTP credentials from GmailConfig
 */
async function getTransporter() {
  const config = await prisma.gmailConfig.findUnique({
    where: { id: 'default' },
  });

  if (!config) {
    return { error: 'Gmail configuration not found in database', config: null, transporter: null };
  }

  if (!config.isEnabled) {
    return { error: 'Gửi Gmail đang tạm tắt trong cài đặt hệ thống', config, transporter: null, isDisabled: true };
  }

  const senderEmail = config.senderEmail?.trim();
  const appPassword = config.appPassword?.replace(/\s+/g, ''); // Strip any accidental spaces in app password

  if (!senderEmail || !appPassword) {
    return {
      error: 'Chưa cấu hình Sender Gmail hoặc Google App Password',
      config,
      transporter: null,
      isNotConfigured: true,
    };
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: senderEmail,
      pass: appPassword,
    },
    connectionTimeout: 5000,
    greetingTimeout: 5000,
    socketTimeout: 10000,
  });

  return { config, transporter };
}

/**
 * Generates editorial botanical HTML template for contact notification
 */
function generateNotificationHtml(payload: ContactPayload, senderName: string): string {
  const dateFormatted = new Date(payload.createdAt).toLocaleString('vi-VN', {
    timeZone: 'Asia/Ho_Chi_Minh',
    hour12: false,
    dateStyle: 'full',
    timeStyle: 'medium',
  });

  return `
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Thông Báo Lời Nhắn Mới — Cẩm Cù House</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F6F3EC; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #2D3748;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #F6F3EC; padding: 32px 16px;">
    <tr>
      <td align="center">
        <table width="600" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; width: 100%; background-color: #FFFFFF; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06); border: 1px solid #E2E8F0;">
          
          <!-- Botanical Header -->
          <tr>
            <td style="background-color: #1E3A2B; padding: 32px 28px; text-align: center; border-bottom: 3px solid #C49B63;">
              <div style="font-size: 11px; font-weight: 700; letter-spacing: 3px; color: #C49B63; text-transform: uppercase; margin-bottom: 6px;">
                STREAMSIDE BOTANICAL SANCTUARY
              </div>
              <h1 style="margin: 0; font-size: 24px; font-weight: 800; color: #FFFFFF; letter-spacing: 1px; font-family: Georgia, serif;">
                CẨM CÙ HOUSE
              </h1>
              <div style="font-size: 13px; color: #A3B899; margin-top: 4px;">
                Hẻm 437 Hùng Vương, Phường Nghĩa Trung, TP. Gia Nghĩa, Đắk Nông
              </div>
            </td>
          </tr>

          <!-- Notification Title Banner -->
          <tr>
            <td style="background-color: #F9F6F0; padding: 18px 28px; border-bottom: 1px solid #EAE3D2;">
              <div style="display: flex; align-items: center; justify-content: space-between;">
                <div>
                  <span style="font-size: 11px; font-weight: 700; color: #2E5A3C; text-transform: uppercase; letter-spacing: 1px; background-color: #E2ECE5; padding: 4px 10px; border-radius: 9999px;">
                    🌿 LỜI NHẮN MỚI TỪ WEBSITE
                  </span>
                  <div style="font-size: 13px; color: #718096; margin-top: 8px;">
                    Thời gian tiếp nhận: <strong>${dateFormatted}</strong>
                  </div>
                </div>
              </div>
            </td>
          </tr>

          <!-- Main Content Body -->
          <tr>
            <td style="padding: 28px;">
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 24px;">
                <tr>
                  <td width="130" style="padding: 10px 0; font-size: 13px; font-weight: 700; color: #4A5568; border-bottom: 1px dashed #E2E8F0;">
                    Họ và tên:
                  </td>
                  <td style="padding: 10px 0; font-size: 15px; font-weight: 600; color: #1A202C; border-bottom: 1px dashed #E2E8F0;">
                    ${payload.fullName}
                  </td>
                </tr>
                <tr>
                  <td width="130" style="padding: 10px 0; font-size: 13px; font-weight: 700; color: #4A5568; border-bottom: 1px dashed #E2E8F0;">
                    Số điện thoại:
                  </td>
                  <td style="padding: 10px 0; font-size: 15px; font-weight: 600; color: #2E5A3C; border-bottom: 1px dashed #E2E8F0;">
                    <a href="tel:${payload.phone}" style="color: #2E5A3C; text-decoration: none; font-weight: 700;">
                      ${payload.phone}
                    </a>
                  </td>
                </tr>
                <tr>
                  <td width="130" style="padding: 10px 0; font-size: 13px; font-weight: 700; color: #4A5568; border-bottom: 1px dashed #E2E8F0;">
                    Email khách hàng:
                  </td>
                  <td style="padding: 10px 0; font-size: 14px; color: #1A202C; border-bottom: 1px dashed #E2E8F0;">
                    ${
                      payload.email
                        ? `<a href="mailto:${payload.email}" style="color: #3182CE; text-decoration: none;">${payload.email}</a>`
                        : '<span style="color: #A0AEC0; font-style: italic;">Không cung cấp</span>'
                    }
                  </td>
                </tr>
                <tr>
                  <td width="130" style="padding: 10px 0; font-size: 13px; font-weight: 700; color: #4A5568; border-bottom: 1px dashed #E2E8F0;">
                    Chủ đề quan tâm:
                  </td>
                  <td style="padding: 10px 0; font-size: 14px; font-weight: 600; color: #D69E2E; border-bottom: 1px dashed #E2E8F0;">
                    ${payload.subject || 'Tư vấn chung'}
                  </td>
                </tr>
              </table>

              <!-- Message Block -->
              <div style="background-color: #F8FAF9; border-left: 4px solid #2E5A3C; padding: 18px 20px; border-radius: 4px; margin-bottom: 24px;">
                <div style="font-size: 12px; font-weight: 700; color: #2E5A3C; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">
                  Nội Dung Lời Nhắn:
                </div>
                <div style="font-size: 14px; line-height: 1.6; color: #2D3748; white-space: pre-wrap;">${payload.message.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>
              </div>

              <!-- Action Callout -->
              <div style="text-align: center; margin-top: 28px; padding-top: 20px; border-top: 1px solid #EDF2F7;">
                <a href="${payload.phone ? `tel:${payload.phone}` : 'https://camcuhouse.vn/admin'}" style="display: inline-block; background-color: #2E5A3C; color: #FFFFFF; font-size: 14px; font-weight: 700; text-decoration: none; padding: 12px 28px; border-radius: 6px; letter-spacing: 0.5px;">
                  📞 Gọi Lại Cho Khách Hàng Ngay
                </a>
              </div>
            </td>
          </tr>

          <!-- Botanical Footer -->
          <tr>
            <td style="background-color: #F1ECE1; padding: 20px 28px; text-align: center; border-top: 1px solid #E2D9C8;">
              <div style="font-size: 12px; color: #718096; line-height: 1.5;">
                Email này được tự động điều phối bởi hệ thống Cẩm Cù House Website.<br>
                Hệ Thống Quản Trị: <a href="https://camcuhouse.vn/admin" style="color: #2E5A3C; font-weight: 600; text-decoration: none;">camcuhouse.vn/admin</a>
              </div>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

/**
 * Dispatches contact notification email to configured active recipients
 */
export async function sendContactNotification(payload: ContactPayload): Promise<MailerResult> {
  try {
    const { config, transporter, isDisabled, isNotConfigured, error } = await getTransporter();

    if (isDisabled) {
      return { status: 'DISABLED', error: 'Chức năng gửi Gmail đang tạm tắt' };
    }

    if (isNotConfigured || !transporter || !config) {
      return { status: 'NOT_CONFIGURED', error: error || 'Chưa cấu hình Gmail SMTP' };
    }

    // Outbound circuit breaker check (maxGmailPerHour)
    const breaker = await checkMailCircuitBreaker();
    if (!breaker.allowed) {
      return { status: 'DISABLED', error: breaker.error };
    }

    // Retrieve active recipients
    const recipients = await prisma.gmailRecipient.findMany({
      where: { isActive: true },
    });

    if (!recipients || recipients.length === 0) {
      return { status: 'NOT_CONFIGURED', error: 'Không có người nhận Gmail nào đang hoạt động' };
    }

    // Filter recipients by subject preference
    const matchedRecipients = recipients.filter((r) => {
      if (r.receiveSubjects === 'ALL' || !r.receiveSubjects) return true;
      const subjects = r.receiveSubjects.split(',').map((s) => s.trim().toLowerCase());
      const currentSubject = (payload.subject || 'tư vấn chung').trim().toLowerCase();
      return subjects.some((sub) => currentSubject.includes(sub) || sub.includes(currentSubject));
    });

    if (matchedRecipients.length === 0) {
      return {
        status: 'NOT_CONFIGURED',
        error: `Không có người nhận nào đăng ký nhận chủ đề "${payload.subject || 'Tư vấn chung'}"`,
      };
    }

    const recipientEmails = matchedRecipients.map((r) => r.email).join(', ');
    const senderName = config.senderName || 'Cẩm Cù House — Thông Báo Website';
    const senderEmail = config.senderEmail;

    const html = generateNotificationHtml(payload, senderName);
    const plainText = `
[CẨM CÙ HOUSE] THÔNG BÁO LỜI NHẮN MỚI TỪ WEBSITE
--------------------------------------------------
Họ và tên: ${payload.fullName}
Số điện thoại: ${payload.phone}
Email: ${payload.email || 'Không cung cấp'}
Chủ đề: ${payload.subject || 'Tư vấn chung'}
Thời gian: ${new Date(payload.createdAt).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })}

Nội dung lời nhắn:
${payload.message}
--------------------------------------------------
    `.trim();

    // Send to recipients
    await transporter.sendMail({
      from: `"${senderName}" <${senderEmail}>`,
      to: recipientEmails,
      replyTo: payload.email ? payload.email : senderEmail,
      subject: `[Lời nhắn mới] ${payload.fullName} - ${payload.subject || 'Tư vấn chung'} (${payload.phone})`,
      text: plainText,
      html: html,
    });

    // Record outbound mail for circuit breaker
    recordSentMail();

    // Optional Auto-Reply to Customer
    if (config.autoReplyEnabled && payload.email) {
      try {
        const autoReplySubject = config.autoReplySubject || 'Cẩm Cù House đã nhận được lời nhắn của bạn';
        const autoReplyBody = config.autoReplyBody || 'Cảm ơn bạn đã liên hệ Cẩm Cù House. Chúng tôi sẽ phản hồi sớm nhất.';

        await transporter.sendMail({
          from: `"${senderName}" <${senderEmail}>`,
          to: payload.email,
          subject: autoReplySubject,
          text: `${autoReplyBody}\n\nTrân trọng,\nCẩm Cù House — Cà phê sinh thái bên suối`,
          html: `
            <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #E2E8F0; border-radius: 8px; background-color: #FAF8F5;">
              <h2 style="color: #1E3A2B; margin-top: 0;">Cẩm Cù House — Bờ Suối Mát</h2>
              <p style="font-size: 15px; line-height: 1.6; color: #2D3748;">Xin chào <strong>${payload.fullName}</strong>,</p>
              <div style="font-size: 14px; line-height: 1.6; color: #4A5568; white-space: pre-wrap; margin: 16px 0;">${autoReplyBody}</div>
              <hr style="border: 0; border-top: 1px solid #E2E8F0; margin: 24px 0;" />
              <p style="font-size: 12px; color: #718096; line-height: 1.5;">
                Địa chỉ: Hẻm 437 Hùng Vương, Phường Nghĩa Trung, TP. Gia Nghĩa, Đắk Nông<br>
                Hotline: 038 285 1688 | Website: camcuhouse.online
              </p>
            </div>
          `,
        });
      } catch (autoErr) {
        console.warn('Auto-reply failed to dispatch:', autoErr);
      }
    }

    return {
      status: 'SENT',
      sentTo: recipientEmails,
    };
  } catch (err: any) {
    console.error('Error sending contact notification email:', err);
    return {
      status: 'FAILED',
      error: err?.message || 'Lỗi không xác định khi kết nối SMTP Gmail',
    };
  }
}

/**
 * Tests Gmail SMTP settings by sending a test message
 */
export async function sendTestEmail(targetEmail?: string): Promise<{ success: boolean; message: string; details?: any }> {
  try {
    const { config, transporter, isDisabled, isNotConfigured, error } = await getTransporter();

    if (isDisabled) {
      return { success: false, message: 'Chức năng gửi Gmail hiện đang tắt trong cài đặt.' };
    }

    if (isNotConfigured || !transporter || !config) {
      return { success: false, message: error || 'Chưa cấu hình Sender Email hoặc App Password.' };
    }

    // Verify SMTP connection first
    await transporter.verify();

    const recipient = targetEmail?.trim() || config.senderEmail;
    const senderName = config.senderName || 'Cẩm Cù House — Thông Báo Website';

    const testInfo = await transporter.sendMail({
      from: `"${senderName}" <${config.senderEmail}>`,
      to: recipient,
      subject: `[Test Kết Nối] Cẩm Cù House Gmail SMTP Kiểm Tra Thành Công`,
      text: `Xin chào!\n\nĐây là email kiểm tra hệ thống kết nối Gmail SMTP từ Cẩm Cù House Website.\nThời gian: ${new Date().toLocaleString('vi-VN')}\n\nHệ thống đã sẵn sàng nhận thông báo từ khách hàng!`,
      html: `
        <div style="font-family: Georgia, serif; max-width: 550px; margin: 0 auto; padding: 24px; border: 1px solid #C49B63; border-radius: 8px; background-color: #F6F3EC;">
          <h2 style="color: #1E3A2B; margin-top: 0;">CẨM CÙ HOUSE — THỬ NGHIỆM GMAIL SMTP</h2>
          <p style="color: #2E5A3C; font-weight: bold;">✔ Kết nối Google App Password thành công!</p>
          <p style="font-size: 14px; color: #4A5568; line-height: 1.6;">
            Email này xác nhận tài khoản <strong>${config.senderEmail}</strong> đã kết nối an toàn với máy chủ Google Mail và đã sẵn sàng tự động chuyển tiếp lời nhắn của khách hàng.
          </p>
          <div style="font-size: 12px; color: #718096; margin-top: 20px; border-top: 1px solid #E2D9C8; padding-top: 12px;">
            Gửi tới: ${recipient} | Thời gian: ${new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })}
          </div>
        </div>
      `,
    });

    return {
      success: true,
      message: `Đã gửi email thử nghiệm thành công tới ${recipient}!`,
      details: testInfo,
    };
  } catch (err: any) {
    console.error('SMTP Test Error:', err);
    return {
      success: false,
      message: `Lỗi kết nối Gmail SMTP: ${err?.message || 'Vui lòng kiểm tra lại Google App Password hoặc Sender Email'}`,
      details: err,
    };
  }
}

/**
 * Sends a direct reply from Staff to Customer inquiry
 */
export async function sendAdminReplyEmail(params: {
  to: string;
  customerName: string;
  replySubject: string;
  replyBody: string;
  originalMessage?: string;
}): Promise<{ success: boolean; message: string }> {
  try {
    const { config, transporter, isDisabled, isNotConfigured, error } = await getTransporter();

    if (isDisabled || isNotConfigured || !transporter || !config) {
      return { success: false, message: error || 'Chưa bật hoặc chưa cấu hình Gmail SMTP' };
    }

    const senderName = config.senderName || 'Cẩm Cù House';
    const senderEmail = config.senderEmail;

    await transporter.sendMail({
      from: `"${senderName}" <${senderEmail}>`,
      to: params.to,
      subject: params.replySubject || 'Phản hồi từ Cẩm Cù House',
      text: `${params.replyBody}\n\n---\nLời nhắn ban đầu:\n${params.originalMessage || ''}`,
      html: `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #E2E8F0; border-radius: 8px; background-color: #FAF8F5;">
          <h2 style="color: #1E3A2B; margin-top: 0;">Cẩm Cù House</h2>
          <p style="font-size: 15px; color: #2D3748;">Kính gửi <strong>${params.customerName}</strong>,</p>
          <div style="font-size: 14px; line-height: 1.7; color: #2D3748; white-space: pre-wrap; margin: 20px 0; background: #FFFFFF; padding: 16px; border-radius: 6px; border: 1px solid #EDF2F7;">
${params.replyBody.replace(/</g, '&lt;').replace(/>/g, '&gt;')}
          </div>
          ${
            params.originalMessage
              ? `
          <div style="font-size: 12px; color: #718096; border-left: 3px solid #CBD5E0; padding-left: 12px; margin-top: 20px;">
            <strong>Lời nhắn trước đó của bạn:</strong><br>
            ${params.originalMessage.replace(/</g, '&lt;').replace(/>/g, '&gt;')}
          </div>`
              : ''
          }
          <hr style="border: 0; border-top: 1px solid #E2E8F0; margin: 24px 0;" />
          <p style="font-size: 12px; color: #718096; line-height: 1.5;">
            <strong>Cẩm Cù House — Cà phê sinh thái bên bờ suối</strong><br>
            Hẻm 437 Hùng Vương, Phường Nghĩa Trung, TP. Gia Nghĩa, Đắk Nông<br>
            Hotline: 038 285 1688 | Website: camcuhouse.online
          </p>
        </div>
      `,
    });

    return { success: true, message: `Đã gửi phản hồi thành công tới ${params.to}` };
  } catch (err: any) {
    console.error('Error sending admin reply email:', err);
    return { success: false, message: err?.message || 'Lỗi khi gửi email phản hồi' };
  }
}

/**
 * Format currency VND helper
 */
function formatVnd(amount: number): string {
  return (amount || 0).toLocaleString('vi-VN') + ' đ';
}

/**
 * Generates editorial HTML template for order confirmation / notification
 */
function generateOrderNotificationHtml(order: any, isCustomerCopy = false): string {
  const dateFormatted = new Date(order.createdAt || Date.now()).toLocaleString('vi-VN', {
    timeZone: 'Asia/Ho_Chi_Minh',
    hour12: false,
    dateStyle: 'full',
    timeStyle: 'medium',
  });

  const fulfillmentMap: Record<string, string> = {
    DELIVERY: 'Giao hàng tận nơi',
    PICKUP: 'Nhận tại quán (Take-away)',
    DINE_IN_BBQ: 'Thưởng thức tại suối & BBQ',
  };

  const paymentMethodMap: Record<string, string> = {
    VIETQR: 'Chuyển khoản VietQR',
    COD: 'Thanh toán tiền mặt khi nhận hàng (COD)',
    VNPAY: 'Cổng VNPAY',
    MOMO: 'Ví MoMo',
    CARD: 'Thẻ tín dụng / Ghi nợ',
  };

  const paymentStatusMap: Record<string, string> = {
    UNPAID: 'Chưa thanh toán',
    PENDING_VERIFY: 'Đang chờ xác minh chuyển khoản',
    PAID: 'Đã thanh toán',
    REFUNDED: 'Đã hoàn tiền',
    FAILED: 'Thất bại',
  };

  const itemsHtml = (order.items || [])
    .map(
      (item: any) => `
    <tr>
      <td style="padding: 10px 0; border-bottom: 1px solid #EAE3D2;">
        <div style="font-size: 14px; font-weight: 700; color: #1E3A2B;">${item.itemNameVi}</div>
        ${
          item.selectedOptions && Array.isArray(item.selectedOptions) && item.selectedOptions.length > 0
            ? `<div style="font-size: 12px; color: #718096; margin-top: 2px;">
                ${item.selectedOptions.map((o: any) => `${o.labelVi || o.name || ''} (+${formatVnd(o.priceDelta || 0)})`).join(', ')}
               </div>`
            : ''
        }
        ${item.itemNote ? `<div style="font-size: 12px; color: #C49B63; font-style: italic;">Ghi chú: ${item.itemNote}</div>` : ''}
      </td>
      <td style="padding: 10px 0; font-size: 14px; color: #4A5568; text-align: center; border-bottom: 1px solid #EAE3D2;">
        x${item.quantity}
      </td>
      <td style="padding: 10px 0; font-size: 14px; font-weight: 600; color: #2D3748; text-align: right; border-bottom: 1px solid #EAE3D2;">
        ${formatVnd(item.lineTotal || (item.unitPrice * item.quantity))}
      </td>
    </tr>
  `
    )
    .join('');

  return `
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="utf-8">
  <title>Đơn Hàng ${order.orderCode} — Cẩm Cù House</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F6F3EC; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #2D3748;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #F6F3EC; padding: 32px 16px;">
    <tr>
      <td align="center">
        <table width="600" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; width: 100%; background-color: #FFFFFF; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06); border: 1px solid #E2E8F0;">
          
          <!-- Botanical Header -->
          <tr>
            <td style="background-color: #1E3A2B; padding: 32px 28px; text-align: center; border-bottom: 3px solid #C49B63;">
              <div style="font-size: 11px; font-weight: 700; letter-spacing: 3px; color: #C49B63; text-transform: uppercase; margin-bottom: 6px;">
                STREAMSIDE BOTANICAL SANCTUARY
              </div>
              <h1 style="margin: 0; font-size: 24px; font-weight: 800; color: #FFFFFF; letter-spacing: 1px; font-family: Georgia, serif;">
                CẨM CÙ HOUSE
              </h1>
              <div style="font-size: 13px; color: #A3B899; margin-top: 4px;">
                Hẻm 437 Hùng Vương, Phường Nghĩa Trung, TP. Gia Nghĩa, Đắk Nông
              </div>
            </td>
          </tr>

          <!-- Banner Title -->
          <tr>
            <td style="background-color: #F9F6F0; padding: 18px 28px; border-bottom: 1px solid #EAE3D2;">
              <span style="font-size: 12px; font-weight: 700; color: #2E5A3C; text-transform: uppercase; letter-spacing: 1px; background-color: #E2ECE5; padding: 4px 10px; border-radius: 9999px;">
                ${isCustomerCopy ? '🌿 XÁC NHẬN ĐƠN HÀNG THÀNH CÔNG' : '🛒 THÔNG BÁO ĐƠN HÀNG MỚI'}
              </span>
              <div style="font-size: 18px; font-weight: 800; color: #1E3A2B; margin-top: 8px;">
                Mã đơn: <span style="color: #8D361D;">${order.orderCode}</span>
              </div>
              <div style="font-size: 13px; color: #718096; margin-top: 4px;">
                Thời gian: <strong>${dateFormatted}</strong>
              </div>
            </td>
          </tr>

          <!-- Customer Info -->
          <tr>
            <td style="padding: 24px 28px 12px 28px;">
              <h3 style="margin: 0 0 12px 0; font-size: 15px; font-weight: 700; color: #1E3A2B; text-transform: uppercase; letter-spacing: 0.5px;">
                Thông Tin Nhận Hàng
              </h3>
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="font-size: 14px;">
                <tr>
                  <td width="130" style="padding: 6px 0; color: #718096;">Khách hàng:</td>
                  <td style="padding: 6px 0; font-weight: 600; color: #1A202C;">${order.customerName}</td>
                </tr>
                <tr>
                  <td width="130" style="padding: 6px 0; color: #718096;">Số điện thoại:</td>
                  <td style="padding: 6px 0; font-weight: 600; color: #2E5A3C;">
                    <a href="tel:${order.customerPhone}" style="color: #2E5A3C; text-decoration: none;">${order.customerPhone}</a>
                  </td>
                </tr>
                ${
                  order.customerEmail
                    ? `<tr>
                  <td width="130" style="padding: 6px 0; color: #718096;">Email:</td>
                  <td style="padding: 6px 0; color: #2D3748;">${order.customerEmail}</td>
                </tr>`
                    : ''
                }
                <tr>
                  <td width="130" style="padding: 6px 0; color: #718096;">Hình thức:</td>
                  <td style="padding: 6px 0; font-weight: 600; color: #8D361D;">${fulfillmentMap[order.fulfillmentType] || order.fulfillmentType}</td>
                </tr>
                ${
                  order.shippingAddress
                    ? `<tr>
                  <td width="130" style="padding: 6px 0; color: #718096;">Địa chỉ giao:</td>
                  <td style="padding: 6px 0; color: #2D3748;">${order.shippingAddress}</td>
                </tr>`
                    : ''
                }
                ${
                  order.scheduledTime
                    ? `<tr>
                  <td width="130" style="padding: 6px 0; color: #718096;">Thời gian hẹn:</td>
                  <td style="padding: 6px 0; color: #2D3748; font-weight: 600;">${order.scheduledTime}</td>
                </tr>`
                    : ''
                }
                ${
                  order.customerNote
                    ? `<tr>
                  <td width="130" style="padding: 6px 0; color: #718096;">Ghi chú:</td>
                  <td style="padding: 6px 0; color: #718096; font-style: italic;">${order.customerNote}</td>
                </tr>`
                    : ''
                }
              </table>
            </td>
          </tr>

          <!-- Items Table -->
          <tr>
            <td style="padding: 12px 28px;">
              <h3 style="margin: 0 0 12px 0; font-size: 15px; font-weight: 700; color: #1E3A2B; text-transform: uppercase; letter-spacing: 0.5px;">
                Chi Tiết Món
              </h3>
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <thead>
                  <tr style="border-bottom: 2px solid #2E5A3C;">
                    <th align="left" style="padding: 8px 0; font-size: 12px; font-weight: 700; color: #718096; text-transform: uppercase;">Món</th>
                    <th align="center" style="padding: 8px 0; font-size: 12px; font-weight: 700; color: #718096; text-transform: uppercase;">SL</th>
                    <th align="right" style="padding: 8px 0; font-size: 12px; font-weight: 700; color: #718096; text-transform: uppercase;">Thành tiền</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHtml}
                </tbody>
              </table>
            </td>
          </tr>

          <!-- Summary Breakdown -->
          <tr>
            <td style="padding: 12px 28px 24px 28px;">
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="font-size: 14px;">
                <tr>
                  <td style="padding: 6px 0; color: #718096;">Tạm tính:</td>
                  <td align="right" style="padding: 6px 0; color: #2D3748; font-weight: 600;">${formatVnd(order.subtotal)}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #718096;">Phí giao hàng:</td>
                  <td align="right" style="padding: 6px 0; color: #2D3748; font-weight: 600;">
                    ${order.shippingFee > 0 ? formatVnd(order.shippingFee) : '<span style="color: #2E5A3C;">Miễn phí</span>'}
                  </td>
                </tr>
                ${
                  order.discountAmount > 0
                    ? `<tr>
                  <td style="padding: 6px 0; color: #8D361D;">Giảm giá (${order.voucherCode || 'Ưu đãi'}):</td>
                  <td align="right" style="padding: 6px 0; color: #8D361D; font-weight: 700;">-${formatVnd(order.discountAmount)}</td>
                </tr>`
                    : ''
                }
                <tr style="border-top: 2px solid #E2E8F0;">
                  <td style="padding: 12px 0 6px 0; font-size: 16px; font-weight: 800; color: #1E3A2B;">TỔNG THANH TOÁN:</td>
                  <td align="right" style="padding: 12px 0 6px 0; font-size: 18px; font-weight: 800; color: #8D361D;">
                    ${formatVnd(order.totalAmount)}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 4px 0; color: #718096; font-size: 13px;">Phương thức:</td>
                  <td align="right" style="padding: 4px 0; color: #2D3748; font-size: 13px; font-weight: 600;">
                    ${paymentMethodMap[order.paymentMethod] || order.paymentMethod}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 4px 0; color: #718096; font-size: 13px;">Trạng thái thanh toán:</td>
                  <td align="right" style="padding: 4px 0; font-size: 13px; font-weight: 700; color: ${order.paymentStatus === 'PAID' ? '#2E5A3C' : '#D97706'};">
                    ${paymentStatusMap[order.paymentStatus] || order.paymentStatus}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #F1ECE1; padding: 20px 28px; text-align: center; border-top: 1px solid #E2D9C8;">
              <div style="font-size: 12px; color: #718096; line-height: 1.5;">
                Hotline hỗ trợ: <strong style="color: #2E5A3C;">038 285 1688</strong> (Zalo) | <strong style="color: #2E5A3C;">077 465 9000</strong><br>
                Cẩm Cù House — Hẻm 437 Hùng Vương, Phường Nghĩa Trung, TP. Gia Nghĩa, Đắk Nông
              </div>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

/**
 * Sends order confirmation email to customer and notification to store admin
 */
export async function sendOrderEmail(
  order: any,
  options?: { toCustomer?: boolean; toAdmin?: boolean; customRecipient?: string }
): Promise<MailerResult> {
  try {
    const { config, transporter, isDisabled, isNotConfigured, error } = await getTransporter();

    if (isDisabled || isNotConfigured || !transporter || !config) {
      return { status: isDisabled ? 'DISABLED' : 'NOT_CONFIGURED', error: error || 'Chưa cấu hình Gmail SMTP' };
    }

    const breaker = await checkMailCircuitBreaker();
    if (!breaker.allowed) {
      return { status: 'DISABLED', error: breaker.error };
    }

    const senderName = config.senderName || 'Cẩm Cù House';
    const senderEmail = config.senderEmail;

    // 1. If custom recipient requested
    if (options?.customRecipient) {
      await transporter.sendMail({
        from: `"${senderName}" <${senderEmail}>`,
        to: options.customRecipient,
        subject: `[Đơn hàng #${order.orderCode}] Xác nhận chi tiết đơn hàng — Cẩm Cù House`,
        html: generateOrderNotificationHtml(order, true),
      });
      recordSentMail();
      return { status: 'SENT', sentTo: options.customRecipient };
    }

    let sentEmails: string[] = [];

    // 2. Send to Customer if email is present
    if (options?.toCustomer !== false && order.customerEmail) {
      try {
        await transporter.sendMail({
          from: `"${senderName}" <${senderEmail}>`,
          to: order.customerEmail,
          subject: `[Cẩm Cù House] Xác nhận đơn hàng #${order.orderCode} (${formatVnd(order.totalAmount)})`,
          html: generateOrderNotificationHtml(order, true),
        });
        recordSentMail();
        sentEmails.push(order.customerEmail);
      } catch (custErr) {
        console.warn('[mailer] Could not send confirmation to customer email:', custErr);
      }
    }

    // 3. Send to Admin / Staff Notification
    if (options?.toAdmin !== false) {
      try {
        // Retrieve recipient from SiteSettings or StoreSettings
        const siteSettings = await prisma.siteSettings.findFirst();
        const storeSettings = await prisma.storeSettings.findFirst();

        const adminTarget = siteSettings?.email || storeSettings?.email || senderEmail;
        if (adminTarget) {
          await transporter.sendMail({
            from: `"${senderName}" <${senderEmail}>`,
            to: adminTarget,
            subject: `[Đơn hàng mới] #${order.orderCode} - ${order.customerName} (${formatVnd(order.totalAmount)})`,
            html: generateOrderNotificationHtml(order, false),
          });
          recordSentMail();
          sentEmails.push(adminTarget);
        }
      } catch (adminErr) {
        console.warn('[mailer] Could not send notification to store admin:', adminErr);
      }
    }

    return {
      status: 'SENT',
      sentTo: sentEmails.join(', '),
    };
  } catch (err: any) {
    console.error('Error sending order email:', err);
    return {
      status: 'FAILED',
      error: err?.message || 'Lỗi khi gửi email đơn hàng',
    };
  }
}

