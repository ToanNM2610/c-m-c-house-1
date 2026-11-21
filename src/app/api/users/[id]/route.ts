import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { apiSuccess, apiError } from '@/lib/api-response';
import { getSessionUser, hashPassword, createSessionToken, getSessionCookieOptions } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const currentUser = await getSessionUser(req);
    if (!currentUser) {
      return apiError('Yêu cầu đăng nhập tài khoản quản trị', 401);
    }

    const user = await prisma.adminUser.findUnique({
      where: { id: params.id },
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

    if (!user) {
      return apiError('Không tìm thấy tài khoản', 404);
    }

    return apiSuccess(user);
  } catch (error) {
    console.error('Error fetching admin user by id:', error);
    return apiError('Lỗi lấy thông tin tài khoản', 500);
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const currentUser = await getSessionUser(req);
    if (!currentUser) {
      return apiError('Yêu cầu đăng nhập tài khoản quản trị', 401);
    }

    const target = await prisma.adminUser.findUnique({
      where: { id: params.id },
    });

    if (!target) {
      return apiError('Không tìm thấy tài khoản cần chỉnh sửa', 404);
    }

    const body = await req.json();
    const { fullName, username, role, isActive, password } = body;

    // Safety checks if editing role or active status
    if (role !== undefined || isActive !== undefined) {
      if (currentUser.role !== 'SUPER_ADMIN') {
        return apiError('Chỉ có Super Admin mới có quyền đổi vai trò hoặc khóa/mở khóa tài khoản', 403);
      }

      // Check if target is currently an active Super Admin
      if (target.role === 'SUPER_ADMIN' && target.isActive) {
        const activeSuperAdminCount = await prisma.adminUser.count({
          where: { role: 'SUPER_ADMIN', isActive: true },
        });

        // Prevent deactivating last active super admin
        if (isActive === false && activeSuperAdminCount <= 1) {
          return apiError('Không thể khóa tài khoản Super Admin duy nhất đang hoạt động trong hệ thống', 400);
        }

        // Prevent demoting last active super admin
        if (role !== 'SUPER_ADMIN' && activeSuperAdminCount <= 1) {
          return apiError('Không thể hạ quyền tài khoản Super Admin duy nhất trong hệ thống', 400);
        }
      }
    }

    // Regular users can only edit their own name, username, or password
    if (currentUser.role !== 'SUPER_ADMIN' && currentUser.id !== target.id) {
      return apiError('Bạn chỉ có thể chỉnh sửa thông tin tài khoản của chính mình', 403);
    }

    const dataToUpdate: Record<string, unknown> = {};

    if (fullName !== undefined) {
      const cleanName = String(fullName).trim();
      if (!cleanName || cleanName.length < 2) {
        return apiError('Họ và tên hiển thị phải có tối thiểu 2 ký tự', 400);
      }
      dataToUpdate.fullName = cleanName;
    }

    if (username !== undefined) {
      const cleanUsername = String(username).trim().toLowerCase();
      const usernameRegex = /^[a-z0-9._-]{3,32}$/;
      if (!usernameRegex.test(cleanUsername)) {
        return apiError('Tên đăng nhập không hợp lệ (từ 3–32 ký tự, chỉ gồm chữ thường, số, dấu chấm, gạch dưới hoặc gạch ngang)', 400);
      }

      if (cleanUsername !== target.username) {
        const existing = await prisma.adminUser.findUnique({
          where: { username: cleanUsername },
        });
        if (existing && existing.id !== target.id) {
          return apiError(`Tên đăng nhập "${cleanUsername}" đã được sử dụng bởi một tài khoản khác`, 409);
        }
        dataToUpdate.username = cleanUsername;
      }
    }

    if (role !== undefined && currentUser.role === 'SUPER_ADMIN') {
      dataToUpdate.role = ['SUPER_ADMIN', 'EDITOR', 'SEO_MANAGER'].includes(role) ? role : 'EDITOR';
    }

    if (isActive !== undefined && currentUser.role === 'SUPER_ADMIN') {
      if (currentUser.id === target.id && isActive === false) {
        return apiError('Không thể tự khóa tài khoản của chính mình', 400);
      }
      dataToUpdate.isActive = Boolean(isActive);
    }

    if (password !== undefined && String(password).trim() !== '') {
      const pwd = String(password);
      if (pwd.length < 8) {
        return apiError('Mật khẩu mới phải có tối thiểu 8 ký tự', 400);
      }
      dataToUpdate.passwordHash = hashPassword(pwd);
    }

    const updatedUser = await prisma.adminUser.update({
      where: { id: params.id },
      data: dataToUpdate,
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

    const response = apiSuccess(updatedUser, { message: 'Cập nhật tài khoản thành công' });

    // Self-Edit Session Sync: refresh/re-sign session cookie if logged-in user edited their own account
    if (currentUser.id === target.id) {
      const newToken = createSessionToken({
        id: updatedUser.id,
        username: updatedUser.username,
        fullName: updatedUser.fullName,
        role: updatedUser.role,
      });
      const cookieOptions = getSessionCookieOptions();
      response.cookies.set({
        name: cookieOptions.name,
        value: newToken,
        httpOnly: cookieOptions.httpOnly,
        sameSite: cookieOptions.sameSite,
        path: cookieOptions.path,
        maxAge: cookieOptions.maxAge,
        secure: cookieOptions.secure,
      });
    }

    return response;
  } catch (error: any) {
    console.error('Error updating admin user:', error);
    return apiError(error?.message || 'Không thể cập nhật tài khoản', 500);
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const currentUser = await getSessionUser(req);
    if (!currentUser) {
      return apiError('Yêu cầu đăng nhập tài khoản quản trị', 401);
    }

    if (currentUser.role !== 'SUPER_ADMIN') {
      return apiError('Chỉ có Super Admin mới có quyền xóa tài khoản', 403);
    }

    // Prevent self deletion
    if (currentUser.id === params.id) {
      return apiError('Không thể tự xóa tài khoản của chính mình', 400);
    }

    const target = await prisma.adminUser.findUnique({
      where: { id: params.id },
    });

    if (!target) {
      return apiError('Không tìm thấy tài khoản cần xóa', 404);
    }

    // Prevent deleting the last Super Admin
    if (target.role === 'SUPER_ADMIN') {
      const superAdminCount = await prisma.adminUser.count({
        where: { role: 'SUPER_ADMIN' },
      });

      if (superAdminCount <= 1) {
        return apiError('Không thể xóa tài khoản Super Admin cuối cùng trong hệ thống', 400);
      }
    }

    await prisma.adminUser.delete({
      where: { id: params.id },
    });

    return apiSuccess({ deletedId: params.id, username: target.username }, `Đã xóa tài khoản "${target.username}" thành công`);
  } catch (error: any) {
    console.error('Error deleting admin user:', error);
    return apiError(error?.message || 'Không thể xóa tài khoản', 500);
  }
}

