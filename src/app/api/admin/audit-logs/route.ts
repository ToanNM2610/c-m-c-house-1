import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { apiSuccess, apiError } from '@/lib/api-response';
import { requireAuth } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const auth = await requireAuth(req, ['SUPER_ADMIN']);
  if ('errorResponse' in auth) return auth.errorResponse;

  try {
    const { searchParams } = new URL(req.url);
    const mod = searchParams.get('module');
    const q = searchParams.get('q')?.trim();

    const where: Record<string, unknown> = {};
    if (mod && mod !== 'ALL') where.module = mod;
    if (q) {
      where.OR = [
        { action: { contains: q, mode: 'insensitive' } },
        { username: { contains: q, mode: 'insensitive' } },
        { details: { contains: q, mode: 'insensitive' } },
      ];
    }

    const logs = await prisma.auditLog.findMany({
      where,
      take: 150,
      orderBy: { createdAt: 'desc' },
    });

    return apiSuccess(logs);
  } catch (error) {
    console.error('Error reading AuditLog:', error);
    return apiError('Không thể tải nhật ký kiểm toán hệ thống', 500);
  }
}
