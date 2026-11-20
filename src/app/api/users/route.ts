import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { apiSuccess, apiError } from '@/lib/api-response';
import { getSessionUser, hashPassword } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const currentUser = await getSessionUser(req);
    if (!currentUser) {
      return apiError('Yêu cầu đăng nhập tài khoản quản trị', 401);
    }

    const users = await prisma.adminUser.findMany({
      select: {
        id: true,
        username: true,
        fullName: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: 'asc' },
    });

    return apiSuccess(users);
  } catch (error) {
    console.error('Error fetching admin users:', error);
    return apiError('Không thể tải danh sách tài khoản', 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const currentUser = await getSessionUser(req);
    if (!currentUser) {
      return apiError('Yêu cầu đăng nhập tài khoản quản trị', 401);
    }

    if (currentUser.role !== 'SUPER_ADMIN') {
      return apiError('Chỉ có Super Admin mới có quyền tạo tài khoản nhân viên mới', 403);
    }

    const body = await req.json();
    const { username, password, fullName, role } = body;

    if (!username || !password || !fullName) {
      return apiError('Vui lòng điền đầy đủ Họ tên, Tên đăng nhập và Mật khẩu', 400);
    }

    const cleanUsername = String(username).trim().toLowerCase();
    if (cleanUsername.length < 3) {
      return apiError('Tên đăng nhập phải có ít nhất 3 ký tự', 400);
    }

    if (!/^[a-z0-9_.-]+$/.test(cleanUsername)) {
      return apiError('Tên đăng nhập chỉ chứa chữ cái thường không dấu, số, dấu gạch dưới, gạch ngang hoặc dấu chấm', 400);
    }

    if (String(password).length < 6) {
      return apiError('Mật khẩu phải có độ dài tối thiểu 6 ký tự', 400);
    }

    const validRole = ['SUPER_ADMIN', 'EDITOR', 'SEO_MANAGER'].includes(role) ? role : 'EDITOR';

    const existing = await prisma.adminUser.findUnique({
      where: { username: cleanUsername },
    });

    if (existing) {
      return apiError(`Tên đăng nhập "${cleanUsername}" đã tồn tại trên hệ thống`, 400);
    }

    const passwordHash = hashPassword(String(password));
    const newUser = await prisma.adminUser.create({
      data: {
        username: cleanUsername,
        passwordHash,
        fullName: String(fullName).trim(),
        role: validRole,
        isActive: true,
      },
      select: {
        id: true,
        username: true,
        fullName: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return apiSuccess(newUser, undefined, 201);
  } catch (error) {
    console.error('Error creating admin user:', error);
    return apiError('Không thể tạo tài khoản mới', 500);
  }
}

