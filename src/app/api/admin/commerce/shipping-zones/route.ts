import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { apiSuccess, apiError } from '@/lib/api-response';
import { requireModuleAuth } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const auth = await requireModuleAuth(req, 'vouchers');
  if ('errorResponse' in auth) return auth.errorResponse;

  try {
    const zones = await prisma.shippingZone.findMany({ orderBy: { sortOrder: 'asc' } });
    return apiSuccess(zones);
  } catch (error) {
    return apiError('Không thể tải khu vực vận chuyển', 500);
  }
}

export async function POST(req: NextRequest) {
  const auth = await requireModuleAuth(req, 'vouchers');
  if ('errorResponse' in auth) return auth.errorResponse;

  try {
    const body = await req.json();
    const created = await prisma.shippingZone.create({
      data: {
        nameVi: body.nameVi || 'Nội thành Gia Nghĩa',
        nameEn: body.nameEn || null,
        fee: Math.max(0, Math.round(Number(body.fee) || 0)),
        freeShipThreshold: body.freeShipThreshold ? Math.round(Number(body.freeShipThreshold)) : null,
        estimatedTimeVi: body.estimatedTimeVi || '30–45 phút',
        estimatedTimeEn: body.estimatedTimeEn || '30–45 mins',
        isActive: body.isActive !== false,
      },
    });
    return apiSuccess(created, { message: 'Đã thêm khu vực giao hàng' }, 201);
  } catch (error: any) {
    return apiError(error?.message || 'Lỗi tạo khu vực giao hàng', 400);
  }
}

export async function PATCH(req: NextRequest) {
  const auth = await requireModuleAuth(req, 'vouchers');
  if ('errorResponse' in auth) return auth.errorResponse;

  try {
    const body = await req.json();
    if (!body.id) return apiError('Thiếu id', 400);
    const updated = await prisma.shippingZone.update({
      where: { id: body.id },
      data: {
        nameVi: body.nameVi ?? undefined,
        fee: typeof body.fee === 'number' ? Math.round(body.fee) : undefined,
        freeShipThreshold: body.freeShipThreshold !== undefined ? (body.freeShipThreshold ? Math.round(Number(body.freeShipThreshold)) : null) : undefined,
        isActive: typeof body.isActive === 'boolean' ? body.isActive : undefined,
      },
    });
    return apiSuccess(updated, { message: 'Đã cập nhật khu vực giao hàng' });
  } catch (error: any) {
    return apiError(error?.message || 'Lỗi cập nhật', 400);
  }
}

export async function DELETE(req: NextRequest) {
  const auth = await requireModuleAuth(req, 'vouchers');
  if ('errorResponse' in auth) return auth.errorResponse;

  try {
    const id = new URL(req.url).searchParams.get('id');
    if (!id) return apiError('Thiếu id', 400);
    await prisma.shippingZone.delete({ where: { id } });
    return apiSuccess({ id }, { message: 'Đã xóa khu vực giao hàng' });
  } catch (error: any) {
    return apiError(error?.message || 'Lỗi xóa', 400);
  }
}
