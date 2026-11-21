import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { apiSuccess, apiError } from '@/lib/api-response';
import { logAction } from '@/lib/logger';

export const dynamic = 'force-dynamic';

export async function POST(
  req: NextRequest,
  { params }: { params: { orderCode: string } }
) {
  try {
    const { orderCode } = params;

    if (!orderCode) {
      return apiError('Mã đơn hàng không hợp lệ', 400);
    }

    const order = await prisma.order.findUnique({
      where: { orderCode },
    });

    if (!order) {
      return apiError('Không tìm thấy đơn hàng tương ứng', 404);
    }

    if (order.paymentStatus === 'PAID') {
      return apiSuccess({
        orderCode: order.orderCode,
        paymentStatus: 'PAID',
      }, 'Đơn hàng này đã được xác nhận thanh toán trước đó.');
    }

    const updated = await prisma.order.update({
      where: { orderCode },
      data: {
        paymentStatus: 'PENDING_VERIFY',
      },
    });

    await logAction({
      level: 'INFO',
      category: 'SYSTEM',
      action: 'CUSTOMER_CONFIRMED_TRANSFER',
      details: `Khách hàng bấm xác nhận chuyển khoản cho đơn hàng ${orderCode} (${order.totalAmount} đ)`,
    });

    return apiSuccess({
      orderCode: updated.orderCode,
      paymentStatus: updated.paymentStatus,
    }, 'Đã ghi nhận thông báo chuyển khoản của bạn. Cẩm Cù House sẽ kiểm tra biến động số dư và xác nhận ngay!');
  } catch (error) {
    console.error('[Verify Transfer API Error]:', error);
    return apiError('Lỗi cập nhật trạng thái chuyển khoản', 500);
  }
}
