import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { apiSuccess, apiError } from '@/lib/api-response';
import { requireAuth } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const auth = await requireAuth(req, 'SUPER_ADMIN');
  if ('errorResponse' in auth) return auth.errorResponse;

  try {
    const { searchParams } = new URL(req.url);
    const level = searchParams.get('level');
    const limit = Math.min(Number(searchParams.get('limit')) || 50, 200);

    const where: { level?: string } = {};
    if (level && ['INFO', 'WARN', 'ERROR', 'SECURITY'].includes(level)) {
      where.level = level;
    }

    const logs = await prisma.systemLog.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    return apiSuccess(logs);
  } catch (error) {
    console.error('Error fetching system logs:', error);
    return apiError('Lỗi tải nhật ký hệ thống', 500);
  }
}

