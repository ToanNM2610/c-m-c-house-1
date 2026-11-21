import { NextRequest } from 'next/server';
import { apiSuccess } from '@/lib/api-response';
import { getCustomerSessionCookieOptions } from '@/lib/customerAuth';

export const dynamic = 'force-dynamic';

export async function POST() {
  const cookieOpts = getCustomerSessionCookieOptions();

  const response = apiSuccess(null, 'Đã đăng xuất tài khoản thành công.');

  response.cookies.set(cookieOpts.name, '', {
    httpOnly: cookieOpts.httpOnly,
    sameSite: cookieOpts.sameSite,
    path: cookieOpts.path,
    maxAge: 0,
    expires: new Date(0),
    secure: cookieOpts.secure,
  });

  return response;
}

