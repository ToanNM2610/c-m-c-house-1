import { NextRequest } from 'next/server';
import { apiSuccess, apiError } from '@/lib/api-response';
import { getSessionCookieOptions } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(_req: NextRequest) {
  try {
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
  } catch (error: any) {
    console.error('Logout error:', error);
    return apiError('Lỗi khi đăng xuất phiên làm việc', 500);
  }
}

