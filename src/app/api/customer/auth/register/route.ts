import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { apiSuccess, apiError } from '@/lib/api-response';
import {
  hashCustomerPassword,
  createCustomerSessionToken,
  getCustomerSessionCookieOptions,
} from '@/lib/customerAuth';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, fullName, phone } = body;

    if (!email || typeof email !== 'string') {
      return apiError('Vui lòng cung cấp địa chỉ email hợp lệ', 400);
    }
    const cleanEmail = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      return apiError('Địa chỉ email không đúng định dạng', 400);
    }

    if (!password || typeof password !== 'string' || password.length < 6) {
      return apiError('Mật khẩu cần tối thiểu 6 ký tự', 400);
    }

    if (!fullName || typeof fullName !== 'string' || fullName.trim().length < 2) {
      return apiError('Vui lòng nhập họ và tên (tối thiểu 2 ký tự)', 400);
    }

    let cleanPhone: string | null = null;
    if (phone && typeof phone === 'string') {
      cleanPhone = phone.replace(/\s+/g, '');
      const phoneRegex = /^(0|\+84)(3|5|7|8|9)[0-9]{8}$/;
      if (!phoneRegex.test(cleanPhone)) {
        return apiError('Số điện thoại không hợp lệ (10 số)', 400);
      }
    }

    // Check duplicate email
    const existing = await prisma.customer.findUnique({
      where: { email: cleanEmail },
    });

    if (existing) {
      return apiError('Email này đã được sử dụng. Vui lòng đăng nhập hoặc dùng email khác.', 409);
    }

    const passwordHash = hashCustomerPassword(password);

    const customer = await prisma.customer.create({
      data: {
        email: cleanEmail,
        passwordHash,
        fullName: fullName.trim(),
        phone: cleanPhone,
        isActive: true,
      },
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

    const token = createCustomerSessionToken(customer);
    const cookieOpts = getCustomerSessionCookieOptions();

    const response = apiSuccess(
      { customer },
      'Đăng ký tài khoản thành công! Chào mừng bạn đến với Cẩm Cù House.'
    );

    response.cookies.set(cookieOpts.name, token, {
      httpOnly: cookieOpts.httpOnly,
      sameSite: cookieOpts.sameSite,
      path: cookieOpts.path,
      maxAge: cookieOpts.maxAge,
      secure: cookieOpts.secure,
    });

    return response;
  } catch (error) {
    console.error('[Customer Register API Error]:', error);
    return apiError('Lỗi trong quá trình đăng ký tài khoản', 500);
  }
}

