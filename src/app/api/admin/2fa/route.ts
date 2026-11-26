import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { apiSuccess, apiError } from '@/lib/api-response';
import { requireAuth } from '@/lib/auth';
import {
  generateTotpSecret,
  verifyTotpCode,
  generateRecoveryCodes,
  getTotpUri,
} from '@/lib/totp';
import { recordAuditLog } from '@/lib/audit';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const auth = await requireAuth(req);
  if ('errorResponse' in auth) return auth.errorResponse;

  try {
    const user = await prisma.adminUser.findUnique({
      where: { id: auth.user.id },
      select: { id: true, username: true, totpEnabled: true, totpSecret: true },
    });
    if (!user) return apiError('Không tìm thấy tài khoản', 404);

    return apiSuccess({
      totpEnabled: user.totpEnabled,
      hasSecret: Boolean(user.totpSecret),
    });
  } catch (error) {
    console.error('Error reading 2FA status:', error);
    return apiError('Không thể đọc trạng thái 2FA', 500);
  }
}

export async function POST(req: NextRequest) {
  const auth = await requireAuth(req);
  if ('errorResponse' in auth) return auth.errorResponse;

  try {
    const body = await req.json();
    const { action, code, secret } = body;

    if (action === 'setup') {
      const newSecret = generateTotpSecret();
      const otpauthUri = getTotpUri(newSecret, `${auth.user.username}@camcuhouse.online`, 'Cẩm Cù House Admin');
      return apiSuccess({ secret: newSecret, otpauthUri });
    }

    if (action === 'enable') {
      if (!secret || !code) {
        return apiError('Vui lòng cung cấp secret và mã 6 số để kích hoạt 2FA', 400);
      }
      const isValid = verifyTotpCode(String(secret), String(code));
      if (!isValid) {
        return apiError('Mã xác thực 6 số không đúng, vui lòng kiểm tra đồng hồ thiết bị và thử lại', 400);
      }
      const recoveryCodes = generateRecoveryCodes(5);
      await prisma.adminUser.update({
        where: { id: auth.user.id },
        data: {
          totpSecret: String(secret),
          totpEnabled: true,
          totpRecoveryCodes: JSON.stringify(recoveryCodes),
        },
      });
      await recordAuditLog({
        action: '2FA_ENABLED',
        module: 'AUTH',
        recordId: auth.user.id,
        user: auth.user,
        req,
      });
      return apiSuccess({ totpEnabled: true, recoveryCodes }, { message: 'Đã bật bảo mật 2 lớp (2FA TOTP)' });
    }

    if (action === 'disable') {
      await prisma.adminUser.update({
        where: { id: auth.user.id },
        data: {
          totpSecret: null,
          totpEnabled: false,
          totpRecoveryCodes: null,
        },
      });
      await recordAuditLog({
        action: '2FA_DISABLED',
        module: 'AUTH',
        recordId: auth.user.id,
        user: auth.user,
        req,
      });
      return apiSuccess({ totpEnabled: false }, { message: 'Đã tắt bảo mật 2 lớp (2FA)' });
    }

    return apiError('Thao tác 2FA không hợp lệ', 400);
  } catch (error) {
    console.error('Error in 2FA route:', error);
    return apiError('Lỗi xử lý cấu hình 2FA', 500);
  }
}
