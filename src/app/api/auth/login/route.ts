import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { apiSuccess, apiError } from '@/lib/api-response';
import {
  verifyPassword,
  createPersistedAdminSession,
  getSessionCookieOptions,
  hashPassword,
} from '@/lib/auth';
import { ensureDatabaseSeeded } from '@/lib/ensure-seed';
import { verifyTotpCode } from '@/lib/totp';
import { recordAuditLog } from '@/lib/audit';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, password, totpCode } = body;

    if (!username || !password) {
      return apiError('Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu', 400);
    }

    const cleanUsername = String(username).trim();

    try {
      await ensureDatabaseSeeded();
    } catch (seedErr) {
      console.warn('ensureDatabaseSeeded warning in login:', seedErr);
    }

    let user = await prisma.adminUser.findUnique({
      where: { username: cleanUsername },
    });

    if (!user && cleanUsername === 'admin') {
      try {
        const initialPass = process.env.INITIAL_ADMIN_PASSWORD || process.env.ADMIN_INITIAL_PASSWORD || 'CamCu@House2026';
        const passwordHash = hashPassword(initialPass);
        user = await prisma.adminUser.create({
          data: {
            username: 'admin',
            passwordHash,
            fullName: 'Chủ quán Cẩm Cù House',
            role: 'SUPER_ADMIN',
            isActive: true,
          },
        });
      } catch (createErr) {
        console.warn('Auto-create default admin failed:', createErr);
      }
    }

    if (!user) {
      await recordAuditLog({
        action: 'LOGIN_FAILED',
        module: 'AUTH',
        details: `Unknown username: ${cleanUsername}`,
        req,
      });
      return apiError('Sai tên đăng nhập hoặc mật khẩu', 401);
    }

    const isMatch = verifyPassword(String(password), user.passwordHash);
    if (!isMatch) {
      await recordAuditLog({
        action: 'LOGIN_FAILED',
        module: 'AUTH',
        recordId: user.id,
        details: `Invalid password attempt for ${user.username}`,
        user,
        req,
      });
      return apiError('Sai tên đăng nhập hoặc mật khẩu', 401);
    }

    if (!user.isActive) {
      return apiError('Tài khoản này đã bị khóa', 403);
    }

    // 2FA TOTP Verification if enabled on AdminUser
    if (user.totpEnabled && user.totpSecret) {
      const cleanCode = String(totpCode || '').trim();
      if (!cleanCode) {
        return NextResponse.json({
          success: false,
          require2FA: true,
          message: 'Vui lòng nhập mã xác thực 2 lớp (2FA TOTP).',
        });
      }

      let isTotpValid = verifyTotpCode(user.totpSecret, cleanCode);

      // Check one-time recovery codes if TOTP didn't match
      if (!isTotpValid && user.totpRecoveryCodes) {
        try {
          const codes: string[] = JSON.parse(user.totpRecoveryCodes);
          const idx = codes.findIndex((c) => c.toUpperCase() === cleanCode.toUpperCase());
          if (idx !== -1) {
            isTotpValid = true;
            codes.splice(idx, 1);
            await prisma.adminUser.update({
              where: { id: user.id },
              data: { totpRecoveryCodes: JSON.stringify(codes) },
            });
          }
        } catch {
          // ignore
        }
      }

      if (!isTotpValid) {
        await recordAuditLog({
          action: 'LOGIN_2FA_FAILED',
          module: 'AUTH',
          recordId: user.id,
          details: `Invalid 2FA code for ${user.username}`,
          user,
          req,
        });
        return apiError('Mã xác thực 2FA không hợp lệ hoặc đã hết hạn', 401);
      }
    }

    const { token } = await createPersistedAdminSession(user, req);
    const cookieOptions = getSessionCookieOptions();

    await recordAuditLog({
      action: 'LOGIN_SUCCESS',
      module: 'AUTH',
      recordId: user.id,
      details: `Signed in role=${user.role}`,
      user,
      req,
    });

    const response = apiSuccess({
      id: user.id,
      username: user.username,
      fullName: user.fullName,
      role: user.role,
      isActive: user.isActive,
      totpEnabled: user.totpEnabled ?? false,
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
    const dbUrl = process.env.DATABASE_URL || '';
    if (!dbUrl || dbUrl.includes('dummy:dummy@localhost') || error?.code === 'P1001' || error?.code === 'P1000') {
      return apiError(
        'Hệ thống chưa kết nối CSDL PostgreSQL (thiếu hoặc sai biến môi trường DATABASE_URL trên Vercel). Vui lòng thêm DATABASE_URL trong Vercel Project Settings.',
        500
      );
    }
    return apiError('Lỗi xác thực hệ thống. Vui lòng kiểm tra kết nối CSDL và thử lại sau.', 500);
  }
}
