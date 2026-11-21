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
    const vouchers = await prisma.voucher.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return apiSuccess(vouchers);
  } catch (error) {
    console.error('[Admin Vouchers GET Error]:', error);
    return apiError('Lỗi tải danh sách mã ưu đãi', 500);
  }
}

export async function POST(req: NextRequest) {
  const auth = await requireAuth(req, ['SUPER_ADMIN', 'EDITOR']);
  if ('errorResponse' in auth) return auth.errorResponse;

  try {
    const body = await req.json();
    const {
      code,
      nameVi,
      nameEn,
      discountType = 'PERCENT',
      discountValue,
      maxDiscount,
      minOrderAmount = 0,
      usageLimit,
      startsAt,
      expiresAt,
      isActive = true,
    } = body;

    if (!code || typeof code !== 'string') {
      return apiError('Vui lòng nhập mã ưu đãi (ví dụ: CAMCU10, FREESHIP)', 400);
    }

    const cleanCode = code.trim().toUpperCase().replace(/\s+/g, '');

    if (!nameVi || typeof nameVi !== 'string' || nameVi.trim().length < 2) {
      return apiError('Vui lòng nhập tên chương trình ưu đãi', 400);
    }

    const cleanDiscountValue = Math.max(0, parseInt(discountValue, 10) || 0);
    if (cleanDiscountValue <= 0) {
      return apiError('Giá trị ưu đãi phải lớn hơn 0', 400);
    }

    // Check duplicate code
    const existing = await prisma.voucher.findUnique({
      where: { code: cleanCode },
    });

    if (existing) {
      return apiError(`Mã ưu đãi "${cleanCode}" đã tồn tại trên hệ thống`, 409);
    }

    const created = await prisma.voucher.create({
      data: {
        code: cleanCode,
        nameVi: nameVi.trim(),
        nameEn: nameEn ? nameEn.trim() : null,
        discountType: ['PERCENT', 'FIXED', 'FREE_SHIP'].includes(discountType) ? discountType : 'PERCENT',
        discountValue: cleanDiscountValue,
        maxDiscount: maxDiscount ? Math.max(0, parseInt(maxDiscount, 10)) : null,
        minOrderAmount: Math.max(0, parseInt(minOrderAmount, 10) || 0),
        usageLimit: usageLimit !== undefined && usageLimit !== null && usageLimit !== '' ? Math.max(0, parseInt(usageLimit, 10)) : null,
        startsAt: startsAt ? new Date(startsAt) : null,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        isActive: Boolean(isActive),
      },
    });

    await logAction({
      level: 'INFO',
      category: 'CMS',
      action: 'CREATE_VOUCHER',
      actor: auth.user.username,
      details: `Tạo mã ưu đãi mới: ${created.code} (${created.discountType} - ${created.discountValue})`,
    });

    return apiSuccess(created, 'Tạo mã ưu đãi thành công!');
  } catch (error) {
    console.error('[Admin Vouchers POST Error]:', error);
    return apiError('Lỗi tạo mã ưu đãi', 500);
  }
}

export async function PUT(req: NextRequest) {
  const auth = await requireAuth(req, ['SUPER_ADMIN', 'EDITOR']);
  if ('errorResponse' in auth) return auth.errorResponse;

  try {
    const body = await req.json();
    const {
      id,
      code,
      nameVi,
      nameEn,
      discountType,
      discountValue,
      maxDiscount,
      minOrderAmount,
      usageLimit,
      startsAt,
      expiresAt,
      isActive,
    } = body;

    if (!id) {
      return apiError('Mã ID voucher không hợp lệ', 400);
    }

    const existing = await prisma.voucher.findUnique({
      where: { id },
    });

    if (!existing) {
      return apiError('Không tìm thấy mã ưu đãi tương ứng', 404);
    }

    const updateData: any = {};

    if (code) {
      const cleanCode = code.trim().toUpperCase().replace(/\s+/g, '');
      if (cleanCode !== existing.code) {
        const duplicate = await prisma.voucher.findUnique({
          where: { code: cleanCode },
        });
        if (duplicate) {
          return apiError(`Mã ưu đãi "${cleanCode}" đã tồn tại`, 409);
        }
        updateData.code = cleanCode;
      }
    }

    if (nameVi !== undefined) updateData.nameVi = String(nameVi).trim();
    if (nameEn !== undefined) updateData.nameEn = nameEn ? String(nameEn).trim() : null;
    if (discountType !== undefined && ['PERCENT', 'FIXED', 'FREE_SHIP'].includes(discountType)) {
      updateData.discountType = discountType;
    }
    if (discountValue !== undefined) {
      updateData.discountValue = Math.max(0, parseInt(discountValue, 10) || 0);
    }
    if (maxDiscount !== undefined) {
      updateData.maxDiscount = maxDiscount ? Math.max(0, parseInt(maxDiscount, 10)) : null;
    }
    if (minOrderAmount !== undefined) {
      updateData.minOrderAmount = Math.max(0, parseInt(minOrderAmount, 10) || 0);
    }
    if (usageLimit !== undefined) {
      updateData.usageLimit = usageLimit !== null && usageLimit !== '' ? Math.max(0, parseInt(usageLimit, 10)) : null;
    }
    if (startsAt !== undefined) {
      updateData.startsAt = startsAt ? new Date(startsAt) : null;
    }
    if (expiresAt !== undefined) {
      updateData.expiresAt = expiresAt ? new Date(expiresAt) : null;
    }
    if (isActive !== undefined) {
      updateData.isActive = Boolean(isActive);
    }

    const updated = await prisma.voucher.update({
      where: { id },
      data: updateData,
    });

    await logAction({
      level: 'INFO',
      category: 'CMS',
      action: 'UPDATE_VOUCHER',
      actor: auth.user.username,
      details: `Cập nhật mã ưu đãi: ${updated.code}`,
    });

    return apiSuccess(updated, 'Cập nhật mã ưu đãi thành công!');
  } catch (error) {
    console.error('[Admin Vouchers PUT Error]:', error);
    return apiError('Lỗi cập nhật mã ưu đãi', 500);
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
      return apiError('Vui lòng chỉ định ID mã ưu đãi cần xóa', 400);
    }

    const existing = await prisma.voucher.findUnique({
      where: { id },
    });

    if (!existing) {
      return apiError('Không tìm thấy mã ưu đãi cần xóa', 404);
    }

    await prisma.voucher.delete({
      where: { id },
    });

    await logAction({
      level: 'WARN',
      category: 'CMS',
      action: 'DELETE_VOUCHER',
      actor: auth.user.username,
      details: `Xóa mã ưu đãi: "${existing.code}" (#${existing.id})`,
    });

    return apiSuccess(null, `Đã xóa mã ưu đãi ${existing.code} thành công.`);
  } catch (error) {
    console.error('[Admin Vouchers DELETE Error]:', error);
    return apiError('Lỗi xóa mã ưu đãi', 500);
  }
}
