import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { apiSuccess, apiError } from '@/lib/api-response';
import { requireModuleAuth } from '@/lib/auth';
import { recordAuditLog } from '@/lib/audit';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const auth = await requireModuleAuth(req, 'vouchers');
  if ('errorResponse' in auth) return auth.errorResponse;

  try {
    const vouchers = await prisma.voucher.findMany({ orderBy: { createdAt: 'desc' } });
    return apiSuccess(vouchers);
  } catch (error) {
    console.error('Error listing vouchers:', error);
    return apiError('Không thể tải danh sách mã khuyến mãi', 500);
  }
}

export async function POST(req: NextRequest) {
  const auth = await requireModuleAuth(req, 'vouchers');
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
      expiresAt,
      isActive = true,
    } = body;

    if (!code || !nameVi || typeof discountValue !== 'number') {
      return apiError('Vui lòng nhập mã code, tên chương trình và mức giảm', 400);
    }

    const cleanCode = String(code).trim().toUpperCase().replace(/[^A-Z0-9_-]/g, '');
    const created = await prisma.voucher.create({
      data: {
        code: cleanCode,
        nameVi: String(nameVi).trim(),
        nameEn: nameEn || null,
        discountType,
        discountValue: Math.max(0, Math.round(discountValue)),
        maxDiscount: maxDiscount ? Math.round(Number(maxDiscount)) : null,
        minOrderAmount: Math.max(0, Math.round(Number(minOrderAmount) || 0)),
        usageLimit: usageLimit ? Math.round(Number(usageLimit)) : null,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        isActive: Boolean(isActive),
      },
    });

    await recordAuditLog({
      action: 'VOUCHER_CREATE',
      module: 'CRM',
      recordId: created.id,
      details: cleanCode,
      user: auth.user,
      req,
    });

    return apiSuccess(created, { message: `Đã tạo mã ${cleanCode}` }, 201);
  } catch (error: any) {
    console.error('Error creating voucher:', error);
    return apiError(error?.message || 'Lỗi tạo mã khuyến mãi', 400);
  }
}

export async function PATCH(req: NextRequest) {
  const auth = await requireModuleAuth(req, 'vouchers');
  if ('errorResponse' in auth) return auth.errorResponse;

  try {
    const body = await req.json();
    const { id, isActive, nameVi, discountValue, minOrderAmount, usageLimit } = body;
    if (!id) return apiError('Thiếu id voucher', 400);

    const updated = await prisma.voucher.update({
      where: { id },
      data: {
        isActive: typeof isActive === 'boolean' ? isActive : undefined,
        nameVi: nameVi ?? undefined,
        discountValue: typeof discountValue === 'number' ? Math.round(discountValue) : undefined,
        minOrderAmount: typeof minOrderAmount === 'number' ? Math.round(minOrderAmount) : undefined,
        usageLimit: usageLimit !== undefined ? (usageLimit ? Math.round(Number(usageLimit)) : null) : undefined,
      },
    });

    return apiSuccess(updated, { message: 'Đã cập nhật mã khuyến mãi' });
  } catch (error: any) {
    return apiError(error?.message || 'Lỗi cập nhật voucher', 400);
  }
}

export async function DELETE(req: NextRequest) {
  const auth = await requireModuleAuth(req, 'vouchers');
  if ('errorResponse' in auth) return auth.errorResponse;

  try {
    const id = new URL(req.url).searchParams.get('id');
    if (!id) return apiError('Thiếu id', 400);
    await prisma.voucher.delete({ where: { id } });
    return apiSuccess({ id }, { message: 'Đã xóa mã khuyến mãi' });
  } catch (error: any) {
    return apiError(error?.message || 'Lỗi xóa voucher', 400);
  }
}
