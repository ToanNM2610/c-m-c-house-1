import { NextRequest } from 'next/server';
import { apiSuccess, apiError } from '@/lib/api-response';
import { getSessionUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const user = await getSessionUser(req);
    if (!user) {
      return apiError('Chưa đăng nhập hoặc phiên làm việc đã hết hạn', 401);
    }

    return apiSuccess({
      id: user.id,
      username: user.username,
      fullName: user.fullName,
      role: user.role,
      isActive: user.isActive,
    });
  } catch (error) {
    console.error('Error fetching current user:', error);
    return apiError('Lỗi kiểm tra phiên đăng nhập', 500);
  }
}

