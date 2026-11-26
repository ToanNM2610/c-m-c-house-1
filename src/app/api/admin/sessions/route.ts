import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { apiSuccess, apiError } from '@/lib/api-response';
import { requireAuth, verifySessionToken } from '@/lib/auth';
import { recordAuditLog } from '@/lib/audit';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const auth = await requireAuth(req);
  if ('errorResponse' in auth) return auth.errorResponse;

  try {
    const rawToken = req.cookies.get('camcu_admin_session')?.value;
    const currentPayload = rawToken ? verifySessionToken(rawToken) : null;

    const where =
      auth.user.role === 'SUPER_ADMIN'
        ? { expiresAt: { gt: new Date() } }
        : { userId: auth.user.id, expiresAt: { gt: new Date() } };

    const sessions = await prisma.adminSession.findMany({
      where,
      include: {
        user: {
          select: { id: true, username: true, fullName: true, role: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const formatted = sessions.map((s) => ({
      id: s.id,
      userId: s.userId,
      username: s.user?.username,
      fullName: s.user?.fullName,
      role: s.user?.role,
      ipAddress: s.ipAddress,
      userAgent: s.userAgent,
      createdAt: s.createdAt,
      expiresAt: s.expiresAt,
      isCurrent: currentPayload?.sessionId === s.id,
    }));

    return apiSuccess(formatted);
  } catch (error) {
    console.error('Error listing AdminSession:', error);
    return apiError('Không thể tải danh sách phiên đăng nhập', 500);
  }
}

export async function DELETE(req: NextRequest) {
  const auth = await requireAuth(req);
  if ('errorResponse' in auth) return auth.errorResponse;

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return apiError('Thiếu mã phiên (id)', 400);

    const target = await prisma.adminSession.findUnique({ where: { id } });
    if (!target) return apiError('Không tìm thấy phiên làm việc', 404);

    if (auth.user.role !== 'SUPER_ADMIN' && target.userId !== auth.user.id) {
      return apiError('Không có quyền thu hồi phiên đăng nhập của người khác', 403);
    }

    await prisma.adminSession.delete({ where: { id } });
    await recordAuditLog({
      action: 'SESSION_REVOKE',
      module: 'AUTH',
      recordId: id,
      details: `Revoked session for user ${target.userId}`,
      user: auth.user,
      req,
    });

    return apiSuccess({ id }, { message: 'Đã thu hồi phiên đăng nhập thành công' });
  } catch (error) {
    console.error('Error revoking session:', error);
    return apiError('Lỗi thu hồi phiên đăng nhập', 500);
  }
}
