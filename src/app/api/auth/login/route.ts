import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { apiSuccess, apiError } from '@/lib/api-response';
import { verifyPassword, createSessionToken, getSessionCookieOptions, hashPassword } from '@/lib/auth';
import { ensureDatabaseSeeded } from '@/lib/ensure-seed';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, password } = body;

    if (!username || !password) {
      return apiError('Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu', 400);
    }

    const cleanUsername = String(username).trim();

    // Ensure database schema and default admin are seeded if fresh/empty
    try {
      await ensureDatabaseSeeded();
    } catch (seedErr) {
      console.warn('ensureDatabaseSeeded warning in login:', seedErr);
    }

    let user = await prisma.adminUser.findUnique({
      where: { username: cleanUsername },
    });

    // Fallback: If no user found and username is admin, auto-bootstrap default Super Admin
    if (!user && cleanUsername === 'admin') {
      try {
        const initialPass = process.env.INITIAL_ADMIN_PASSWORD || 'admin123';
        const passwordHash = hashPassword(initialPass);
        user = await prisma.adminUser.create({
          data: {
            username: 'admin',
            passwordHash,
            fullName: 'Quản trị viên Cẩm Cù House',
            role: 'SUPER_ADMIN',
            isActive: true,
          },
        });
      } catch (createErr) {
        console.warn('Auto-create default admin failed:', createErr);
      }
    }

    if (!user) {
      return apiError('Sai tên đăng nhập hoặc mật khẩu', 401);
    }

    const isMatch = verifyPassword(String(password), user.passwordHash);
    if (!isMatch) {
      return apiError('Sai tên đăng nhập hoặc mật khẩu', 401);
    }

    if (!user.isActive) {
      return apiError('Tài khoản này đã bị khóa', 403);
    }

    const token = createSessionToken(user);
    const cookieOptions = getSessionCookieOptions();

    const response = apiSuccess({
      id: user.id,
      username: user.username,
      fullName: user.fullName,
      role: user.role,
    });

    response.cookies.set({
      name: cookieOptions.name,
      value: token,
      httpOnly: cookieOptions.httpOnly,
      sameSite: cookieOptions.sameSite,
      path: cookieOptions.path,
      maxAge: cookieOptions.maxAge,
      secure: cookieOptions.secure,
    });

    return response;
  } catch (error: any) {
    console.error('Error in login handler:', error);
    return apiError('Lỗi xác thực hệ thống. Vui lòng kiểm tra kết nối CSDL và thử lại sau.', 500);
  }
}

