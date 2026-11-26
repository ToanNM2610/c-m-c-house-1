import { prisma } from '@/lib/prisma';
import { apiSuccess, apiError } from '@/lib/api-response';
import { requireCommerceEnabled } from '@/lib/commerce-guard';

export const dynamic = 'force-dynamic';

export async function GET() {
  const block = await requireCommerceEnabled();
  if (block) return block;

  try {
    const zones = await prisma.shippingZone.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    });
    return apiSuccess(zones);
  } catch {
    return apiError('Không thể tải phí giao hàng', 500);
  }
}
