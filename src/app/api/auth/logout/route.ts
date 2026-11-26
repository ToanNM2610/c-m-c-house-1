import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { apiSuccess } from '@/lib/api-response';
import { getSessionCookieOptions, getSessionUser, verifySessionToken } from '@/lib/auth';
import { recordAuditLog } from '@/lib/audit';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const user = await getSessionUser(req).catch(() => null);
  const rawToken = req.cookies.get('camcu_admin_session')?.value;
  if (rawToken) {
    const payload = verifySessionToken(rawToken);
    if (payload?.sessionId) {
      await prisma.adminSession.deleteMany({ where: { id: payload.sessionId } }).catch(() => {});
    }
  }
  if (user) {
    await recordAuditLog({
      action: 'LOGOUT',
      module: 'AUTH',
      recordId: user.id,
      user,
      req,
    });
  }

  const cookieOptions = getSessionCookieOptions();
  const response = apiSuccess({ loggedOut: true });
  response.cookies.set({
    name: cookieOptions.name,
    value: '',
    httpOnly: cookieOptions.httpOnly,
    sameSite: cookieOptions.sameSite,
    path: cookieOptions.path,
    maxAge: 0,
    secure: cookieOptions.secure,
  });

  return response;
}
