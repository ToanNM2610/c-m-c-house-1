import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { apiSuccess, apiError } from '@/lib/api-response';
import {
  getCustomerSessionUser,
  hashCustomerPassword,
  verifyCustomerPassword,
} from '@/lib/customerAuth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const customer = await getCustomerSessionUser(req);

    if (!customer) {
      return apiError('Yêu cầu đăng nhập tài khoản khách hàng', 401);
    }

    return apiSuccess(customer);
  } catch (error) {
    console.error('[Customer Profile Me API Error]:', error);
    return apiError('Lỗi truy xuất hồ sơ tài khoản', 500);
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const current = await getCustomerSessionUser(req);
    if (!current) {
      return apiError('Yêu cầu đăng nhập tài khoản khách hàng', 401);
    }

    const body = await req.json();
    const { fullName, phone, avatarUrl, currentPassword, newPassword } = body;

    const updateData: any = {};

    if (fullName && typeof fullName === 'string' && fullName.trim().length >= 2) {
      updateData.fullName = fullName.trim();
    }

    if (phone !== undefined) {
      if (phone === null || phone === '') {
        updateData.phone = null;
      } else {
        const cleanPhone = String(phone).replace(/\s+/g, '');
        const phoneRegex = /^(0|\+84)(3|5|7|8|9)[0-9]{8}$/;
        if (!phoneRegex.test(cleanPhone)) {
          return apiError('Số điện thoại không hợp lệ (10 số)', 400);
        }
        updateData.phone = cleanPhone;
      }
    }

    if (avatarUrl !== undefined) {
      updateData.avatarUrl = avatarUrl;
    }

    // Password change flow
    if (newPassword) {
      if (!currentPassword) {
        return apiError('Vui lòng nhập mật khẩu hiện tại để đổi mật khẩu mới', 400);
      }
      if (typeof newPassword !== 'string' || newPassword.length < 6) {
        return apiError('Mật khẩu mới cần tối thiểu 6 ký tự', 400);
      }

      const dbUser = await prisma.customer.findUnique({
        where: { id: current.id },
      });

      if (!dbUser || !verifyCustomerPassword(currentPassword, dbUser.passwordHash)) {
        return apiError('Mật khẩu hiện tại không chính xác', 400);
      }

      updateData.passwordHash = hashCustomerPassword(newPassword);
    }

    const updated = await prisma.customer.update({
      where: { id: current.id },
      data: updateData,
      select: {
        id: true,
        email: true,
        fullName: true,
        phone: true,
        avatarUrl: true,
        isActive: true,
        totalSpent: true,
        orderCount: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return apiSuccess(updated, 'Cập nhật thông tin tài khoản thành công!');
  } catch (error) {
    console.error('[Customer Update Me API Error]:', error);
    return apiError('Lỗi cập nhật hồ sơ khách hàng', 500);
  }
}

