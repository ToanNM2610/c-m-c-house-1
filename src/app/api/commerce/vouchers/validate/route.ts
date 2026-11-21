import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { apiSuccess, apiError } from '@/lib/api-response';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { code, subtotal } = body;

    if (!code || typeof code !== 'string') {
      return apiError('Vui lòng nhập mã ưu đãi hợp lệ', 400);
    }

    const orderSubtotal = Math.max(0, Number(subtotal) || 0);
    const cleanCode = code.trim().toUpperCase();

    const voucher = await prisma.voucher.findUnique({
      where: { code: cleanCode },
    });

    if (!voucher || !voucher.isActive) {
      return apiError('Mã ưu đãi không tồn tại hoặc đã tạm dừng áp dụng', 404);
    }

    const now = new Date();

    if (voucher.startsAt && now < new Date(voucher.startsAt)) {
      return apiError('Mã ưu đãi chưa đến thời gian áp dụng', 400);
    }

    if (voucher.expiresAt && now > new Date(voucher.expiresAt)) {
      return apiError('Mã ưu đãi đã hết hạn sử dụng', 400);
    }

    if (voucher.usageLimit !== null && voucher.usedCount >= voucher.usageLimit) {
      return apiError('Mã ưu đãi đã hết số lượt sử dụng', 400);
    }

    if (orderSubtotal < voucher.minOrderAmount) {
      return apiError(
        `Đơn hàng cần đạt tối thiểu ${voucher.minOrderAmount.toLocaleString('vi-VN')} đ để áp dụng mã này`,
        400
      );
    }

    let discountAmount = 0;

    if (voucher.discountType === 'PERCENT') {
      discountAmount = Math.round((orderSubtotal * voucher.discountValue) / 100);
      if (voucher.maxDiscount && discountAmount > voucher.maxDiscount) {
        discountAmount = voucher.maxDiscount;
      }
    } else if (voucher.discountType === 'FIXED') {
      discountAmount = Math.min(orderSubtotal, voucher.discountValue);
    } else if (voucher.discountType === 'FREE_SHIP') {
      // Free-shipping vouchers discount the shipping fee up to discountValue or full
      discountAmount = voucher.discountValue || 0;
    }

    discountAmount = Math.max(0, discountAmount);
    const newTotal = Math.max(0, orderSubtotal - discountAmount);

    return apiSuccess({
      valid: true,
      voucher: {
        id: voucher.id,
        code: voucher.code,
        nameVi: voucher.nameVi,
        nameEn: voucher.nameEn,
        discountType: voucher.discountType,
        discountValue: voucher.discountValue,
        maxDiscount: voucher.maxDiscount,
        minOrderAmount: voucher.minOrderAmount,
      },
      discountAmount,
      newTotal,
    }, 'Áp dụng mã ưu đãi thành công');
  } catch (error) {
    console.error('[Voucher Validation API Error]:', error);
    return apiError('Lỗi kiểm tra mã ưu đãi', 500);
  }
}

