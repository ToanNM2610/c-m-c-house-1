import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { apiSuccess, apiError } from '@/lib/api-response';
import { requireCommerceEnabled } from '@/lib/commerce-guard';

export const dynamic = 'force-dynamic';

export async function GET(_req: NextRequest, { params }: { params: { orderCode: string } }) {
  const block = await requireCommerceEnabled();
  if (block) return block;

  try {
    const order = await prisma.order.findUnique({
      where: { orderCode: params.orderCode.toUpperCase() },
      include: { items: true, shipments: true },
    });
    if (!order) return apiError('Không tìm thấy đơn hàng', 404);
    return apiSuccess(order);
  } catch {
    return apiError('Lỗi tra cứu đơn hàng', 500);
  }
}
