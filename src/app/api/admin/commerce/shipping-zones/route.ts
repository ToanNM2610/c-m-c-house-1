import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { apiSuccess, apiError } from '@/lib/api-response';
import { requireAuth } from '@/lib/auth';
import { logAction } from '@/lib/logger';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const auth = await requireAuth(req, ['SUPER_ADMIN', 'EDITOR']);
  if ('errorResponse' in auth) return auth.errorResponse;

  try {
    const zones = await prisma.shippingZone.findMany({
      orderBy: { sortOrder: 'asc' },
    });

    return apiSuccess(zones);
  } catch (error) {
    console.error('[Admin Shipping Zones GET Error]:', error);
    return apiError('Lỗi tải danh sách khu vực giao hàng', 500);
  }
}

export async function POST(req: NextRequest) {
  const auth = await requireAuth(req, ['SUPER_ADMIN', 'EDITOR']);
  if ('errorResponse' in auth) return auth.errorResponse;

  try {
    const body = await req.json();
    const {
      nameVi,
      nameEn,
      fee = 0,
      freeShipThreshold,
      estimatedTimeVi,
      estimatedTimeEn,
      sortOrder = 0,
      isActive = true,
    } = body;

    if (!nameVi || typeof nameVi !== 'string' || nameVi.trim().length < 2) {
      return apiError('Vui lòng nhập tên khu vực giao hàng (tối thiểu 2 ký tự)', 400);
    }

    const created = await prisma.shippingZone.create({
      data: {
        nameVi: nameVi.trim(),
        nameEn: nameEn ? nameEn.trim() : null,
        fee: Math.max(0, parseInt(fee, 10) || 0),
        freeShipThreshold: freeShipThreshold !== null && freeShipThreshold !== undefined && freeShipThreshold !== '' ? Math.max(0, parseInt(freeShipThreshold, 10)) : null,
        estimatedTimeVi: estimatedTimeVi ? estimatedTimeVi.trim() : null,
        estimatedTimeEn: estimatedTimeEn ? estimatedTimeEn.trim() : null,
        sortOrder: parseInt(sortOrder, 10) || 0,
        isActive: Boolean(isActive),
      },
    });

    await logAction({
      level: 'INFO',
      category: 'CMS',
      action: 'CREATE_SHIPPING_ZONE',
      actor: auth.user.username,
      details: `Tạo khu vực giao hàng: "${created.nameVi}" (${created.fee.toLocaleString('vi-VN')} đ)`,
    });

    return apiSuccess(created, 'Tạo khu vực giao hàng thành công!');
  } catch (error) {
    console.error('[Admin Shipping Zones POST Error]:', error);
    return apiError('Lỗi tạo khu vực giao hàng', 500);
  }
}

export async function PUT(req: NextRequest) {
  const auth = await requireAuth(req, ['SUPER_ADMIN', 'EDITOR']);
  if ('errorResponse' in auth) return auth.errorResponse;

  try {
    const body = await req.json();
    const {
      id,
      nameVi,
      nameEn,
      fee,
      freeShipThreshold,
      estimatedTimeVi,
      estimatedTimeEn,
      sortOrder,
      isActive,
    } = body;

    if (!id) {
      return apiError('Mã ID khu vực không hợp lệ', 400);
    }

    const existing = await prisma.shippingZone.findUnique({
      where: { id },
    });

    if (!existing) {
      return apiError('Không tìm thấy khu vực giao hàng tương ứng', 404);
    }

    const updateData: any = {};
    if (nameVi !== undefined) updateData.nameVi = String(nameVi).trim();
    if (nameEn !== undefined) updateData.nameEn = nameEn ? String(nameEn).trim() : null;
    if (fee !== undefined) updateData.fee = Math.max(0, parseInt(fee, 10) || 0);
    if (freeShipThreshold !== undefined) {
      updateData.freeShipThreshold = freeShipThreshold !== null && freeShipThreshold !== '' ? Math.max(0, parseInt(freeShipThreshold, 10)) : null;
    }
    if (estimatedTimeVi !== undefined) updateData.estimatedTimeVi = estimatedTimeVi ? String(estimatedTimeVi).trim() : null;
    if (estimatedTimeEn !== undefined) updateData.estimatedTimeEn = estimatedTimeEn ? String(estimatedTimeEn).trim() : null;
    if (sortOrder !== undefined) updateData.sortOrder = parseInt(sortOrder, 10) || 0;
    if (isActive !== undefined) updateData.isActive = Boolean(isActive);

    const updated = await prisma.shippingZone.update({
      where: { id },
      data: updateData,
    });

    await logAction({
      level: 'INFO',
      category: 'CMS',
      action: 'UPDATE_SHIPPING_ZONE',
      actor: auth.user.username,
      details: `Cập nhật khu vực giao hàng: "${updated.nameVi}"`,
    });

    return apiSuccess(updated, 'Cập nhật khu vực giao hàng thành công!');
  } catch (error) {
    console.error('[Admin Shipping Zones PUT Error]:', error);
    return apiError('Lỗi cập nhật khu vực giao hàng', 500);
  }
}

export async function DELETE(req: NextRequest) {
  const auth = await requireAuth(req, ['SUPER_ADMIN', 'EDITOR']);
  if ('errorResponse' in auth) return auth.errorResponse;

  try {
    const { searchParams } = new URL(req.url);
    let id = searchParams.get('id');

    if (!id) {
      const body = await req.json().catch(() => ({}));
      id = body.id;
    }

    if (!id) {
      return apiError('Vui lòng chỉ định ID khu vực cần xóa', 400);
    }

    const existing = await prisma.shippingZone.findUnique({
      where: { id },
    });

    if (!existing) {
      return apiError('Không tìm thấy khu vực cần xóa', 404);
    }

    await prisma.shippingZone.delete({
      where: { id },
    });

    await logAction({
      level: 'WARN',
      category: 'CMS',
      action: 'DELETE_SHIPPING_ZONE',
      actor: auth.user.username,
      details: `Xóa khu vực giao hàng: "${existing.nameVi}" (#${existing.id})`,
    });

    return apiSuccess(null, 'Đã xóa khu vực giao hàng thành công.');
  } catch (error) {
    console.error('[Admin Shipping Zones DELETE Error]:', error);
    return apiError('Lỗi xóa khu vực giao hàng', 500);
  }
}
