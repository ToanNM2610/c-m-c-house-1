import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { apiSuccess, apiError } from '@/lib/api-response';
import { requireCommerceEnabled } from '@/lib/commerce-guard';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const block = await requireCommerceEnabled();
  if (block) return block;

  try {
    const body = await req.json();
    const cleanCode = String(body.code || '').trim().toUpperCase();
    const subtotal = Math.max(0, Math.round(Number(body.subtotal) || 0));

    if (!cleanCode) return apiError('Vui lòng nhập mã giảm giá', 400);

    const voucher = await prisma.voucher.findUnique({ where: { code: cleanCode } });
    if (!voucher || !voucher.isActive) {
      return apiError('Mã giảm giá không tồn tại hoặc đã ngừng áp dụng', 404);
    }
    const now = new Date();
    if (voucher.startsAt && voucher.startsAt > now) {
      return apiError('Mã giảm giá chưa tới thời gian áp dụng', 400);
    }
    if (voucher.expiresAt && voucher.expiresAt < now) {
      return apiError('Mã giảm giá đã hết hạn', 400);
    }
    if (voucher.usageLimit !== null && voucher.usedCount >= voucher.usageLimit) {
      return apiError('Mã giảm giá đã hết lượt sử dụng', 400);
    }
    if (subtotal < voucher.minOrderAmount) {
      return apiError(`Đơn tối thiểu ${voucher.minOrderAmount.toLocaleString('vi-VN')}đ để dùng mã này`, 400);
    }

    let discountAmount = 0;
    if (voucher.discountType === 'PERCENT') {
      discountAmount = Math.round((subtotal * voucher.discountValue) / 100);
      if (voucher.maxDiscount && discountAmount > voucher.maxDiscount) {
        discountAmount = voucher.maxDiscount;
      }
    } else if (voucher.discountType === 'FIXED') {
      discountAmount = Math.min(subtotal, voucher.discountValue);
    }

    return apiSuccess({
      code: voucher.code,
      nameVi: voucher.nameVi,
      discountType: voucher.discountType,
      discountAmount,
      isFreeShip: voucher.discountType === 'FREE_SHIP',
    });
  } catch {
    return apiError('Lỗi kiểm tra mã giảm giá', 500);
  }
}
