import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { apiSuccess, apiError } from '@/lib/api-response';
import { requireAuth } from '@/lib/auth';
import { sendOrderEmail } from '@/lib/mailer';
import { logAction } from '@/lib/logger';

export const dynamic = 'force-dynamic';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await requireAuth(req, ['SUPER_ADMIN', 'EDITOR']);
  if ('errorResponse' in auth) return auth.errorResponse;

  try {
    const { id } = params;

    const order = await prisma.order.findFirst({
      where: {
        OR: [{ id }, { orderCode: id }],
      },
      include: {
        items: true,
      },
    });

    if (!order) {
      return apiError('Không tìm thấy thông tin đơn hàng', 404);
    }

    const body = await req.json().catch(() => ({}));
    const targetEmail = body?.targetEmail ? String(body.targetEmail).trim() : null;

    const emailToSend = targetEmail || order.customerEmail;
    if (!emailToSend) {
      return apiError('Đơn hàng không có email khách hàng. Vui lòng nhập địa chỉ email nhận', 400);
    }

    const result = await sendOrderEmail(order, {
      customRecipient: emailToSend,
      toAdmin: false,
    });

    if (result.status === 'FAILED') {
      return apiError(`Gửi email thất bại: ${result.error || 'Lỗi SMTP'}`, 500);
    }

    await logAction({
      level: 'INFO',
      category: 'CMS',
      action: 'RESEND_ORDER_EMAIL',
      actor: auth.user.username,
      details: `Gửi lại email thông tin đơn hàng #${order.orderCode} tới ${emailToSend}`,
    });

    return apiSuccess(
      { sentTo: emailToSend },
      `Đã gửi lại email xác nhận đơn hàng #${order.orderCode} tới ${emailToSend}`
    );
  } catch (error) {
    console.error('[Resend Order Email Error]:', error);
    return apiError('Lỗi khi gửi lại email đơn hàng', 500);
  }
}
