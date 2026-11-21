import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { apiSuccess, apiError } from '@/lib/api-response';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const zones = await prisma.shippingZone.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    });

    return apiSuccess(zones);
  } catch (error) {
    console.error('[Shipping Zones Public API Error]:', error);
    return apiError('Không thể tải danh sách khu vực giao hàng', 500);
  }
}
