import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { apiSuccess, apiError } from '@/lib/api-response';
import {
  verifyCustomerPassword,
  createCustomerSessionToken,
  getCustomerSessionCookieOptions,
} from '@/lib/customerAuth';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || typeof email !== 'string' || !password || typeof password !== 'string') {
      return apiError('Vui lòng nhập đầy đủ email và mật khẩu', 400);
    }

    const cleanEmail = email.trim().toLowerCase();

    const customer = await prisma.customer.findUnique({
      where: { email: cleanEmail },
    });

    if (!customer) {
      return apiError('Email hoặc mật khẩu không chính xác', 401);
    }

    if (!customer.isActive) {
      return apiError('Tài khoản đã bị tạm ngưng. Vui lòng liên hệ hotline 038 285 1688 để được hỗ trợ.', 403);
    }

    const isValid = verifyCustomerPassword(password, customer.passwordHash);
    if (!isValid) {
      return apiError('Email hoặc mật khẩu không chính xác', 401);
    }

    const safeCustomer = {
      id: customer.id,
      email: customer.email,
      fullName: customer.fullName,
      phone: customer.phone,
      avatarUrl: customer.avatarUrl,
      isActive: customer.isActive,
      totalSpent: customer.totalSpent,
      orderCount: customer.orderCount,
      createdAt: customer.createdAt,
      updatedAt: customer.updatedAt,
    };

    const token = createCustomerSessionToken(safeCustomer);
    const cookieOpts = getCustomerSessionCookieOptions();

    const response = apiSuccess(
      { customer: safeCustomer },
      'Đăng nhập thành công! Chào mừng bạn quay trở lại.'
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
    console.error('[Customer Login API Error]:', error);
    return apiError('Lỗi đăng nhập tài khoản', 500);
  }
}
