import { NextRequest } from 'next/server';
import { apiSuccess } from '@/lib/api-response';
import { getSessionCookieOptions } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(_req: NextRequest) {
  const cookieOptions = getSessionCookieOptions();
  const response = apiSuccess({ message: 'Đăng xuất thành công' });

  response.cookies.set({
    name: cookieOptions.name,
    value: '',
    httpOnly: cookieOptions.httpOnly,
    sameSite: cookieOptions.sameSite,
    path: cookieOptions.path,
    maxAge: 0,
    expires: new Date(0),
    secure: cookieOptions.secure,
  });

  return response;
}

