import { NextRequest } from 'next/server';
import { prisma } from './prisma';
import { AdminUserSafe } from '@/types';

export async function recordAuditLog({
  action,
  module,
  recordId,
  details,
  user,
  req,
}: {
  action: string;
  module: string;
  recordId?: string | null;
  details?: string | null;
  user?: AdminUserSafe | { id?: string; username?: string } | null;
  req?: NextRequest;
}) {
  const ipAddress =
    req?.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req?.headers.get('x-real-ip') ||
    null;

  try {
    await prisma.auditLog.create({
      data: {
        action,
        module,
        recordId: recordId || null,
        details: details || null,
        userId: user?.id || null,
        username: user?.username || 'system',
        ipAddress,
      },
    });
  } catch (err) {
    console.warn('AuditLog write warning:', err);
  }
}
