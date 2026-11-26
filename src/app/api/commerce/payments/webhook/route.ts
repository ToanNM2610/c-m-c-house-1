import crypto from 'crypto';
import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { apiSuccess, apiError } from '@/lib/api-response';
import { requireCommerceEnabled } from '@/lib/commerce-guard';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const block = await requireCommerceEnabled();
  if (block) return block;

  try {
    const rawBody = await req.text();
    const cs = await prisma.commerceSettings.findUnique({ where: { id: 'commerce-settings' } }).catch(() => null);
    if (!cs?.webhookSecret) {
      return apiError('Chưa cấu hình chữ ký Webhook cổng thanh toán', 403);
    }

    const signature = req.headers.get('x-signature') || req.headers.get('x-webhook-signature') || '';
    const expected = crypto.createHmac('sha256', cs.webhookSecret).update(rawBody).digest('hex');

    if (!signature || signature.length !== expected.length || !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) {
      return apiError('Chữ ký Webhook không hợp lệ', 401);
    }

    const payload = JSON.parse(rawBody);
    const { orderCode, amount, transactionRef, provider = 'SEPAY' } = payload;
    if (!orderCode) return apiError('Thiếu orderCode', 400);

    const updated = await prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({ where: { orderCode } });
      if (!order) throw new Error('Order not found');

      if (Number(amount) < order.totalAmount) {
        throw new Error('Số tiền chuyển khoản chưa khớp tổng đơn hàng');
      }

      await tx.paymentTransaction.create({
        data: {
          orderId: order.id,
          method: 'ONLINE',
          amount: Number(amount),
          status: 'PAID',
          referenceCode: transactionRef || null,
          provider,
          verifiedBy: `webhook:${provider}`,
          verifiedAt: new Date(),
        },
      });

      return tx.order.update({
        where: { id: order.id },
        data: {
          paymentStatus: 'PAID',
          paymentRef: transactionRef || undefined,
          paidAt: new Date(),
        },
      });
    });

    return apiSuccess({ orderCode: updated.orderCode, paymentStatus: updated.paymentStatus });
  } catch (error: any) {
    return apiError(error?.message || 'Webhook xử lý thất bại', 400);
  }
}
