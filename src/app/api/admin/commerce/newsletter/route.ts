import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { apiSuccess, apiError } from '@/lib/api-response';
import { requireAuth } from '@/lib/auth';
import { logAction } from '@/lib/logger';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const auth = await requireAuth(req, ['SUPER_ADMIN', 'EDITOR']);
  if ('errorResponse' in auth) return auth.errorResponse;

  try {
    const { searchParams } = new URL(req.url);
    const format = searchParams.get('format');
    const search = searchParams.get('search')?.trim();

    const where: any = {};
    if (search) {
      where.email = { contains: search, mode: 'insensitive' };
    }

    const subscribers = await prisma.newsletterSubscriber.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    if (format === 'csv') {
      const header = 'ID,Email,Locale,IsActive,CreatedAt\n';
      const rows = subscribers
        .map(
          (s) =>
            `"${s.id}","${s.email}","${s.locale}","${s.isActive}","${new Date(s.createdAt).toISOString()}"`
        )
        .join('\n');
      const csvContent = '\uFEFF' + header + rows;

      return new NextResponse(csvContent, {
        status: 200,
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': 'attachment; filename="camcu-newsletter-subscribers.csv"',
          'Cache-Control': 'no-store',
        },
      });
    }

    return apiSuccess({
      subscribers,
      total: subscribers.length,
    });
  } catch (error) {
    console.error('[Admin Newsletter GET Error]:', error);
    return apiError('Lỗi tải danh sách người đăng ký bản tin', 500);
  }
}

export async function DELETE(req: NextRequest) {
  const auth = await requireAuth(req, ['SUPER_ADMIN', 'EDITOR']);
  if ('errorResponse' in auth) return auth.errorResponse;

  try {
    const { searchParams } = new URL(req.url);
    let id = searchParams.get('id');

    if (!id) {
      const body = await req.json().catch(() => ({}));
      id = body.id || body.email;
    }

    if (!id) {
      return apiError('Vui lòng cung cấp ID hoặc email cần xóa', 400);
    }

    await prisma.newsletterSubscriber.deleteMany({
      where: {
        OR: [{ id }, { email: id.toLowerCase() }],
      },
    });

    await logAction({
      level: 'INFO',
      category: 'CMS',
      action: 'DELETE_NEWSLETTER_SUBSCRIBER',
      actor: auth.user.username,
      details: `Xóa người đăng ký nhận bản tin: ${id}`,
    });

    return apiSuccess(null, 'Đã xóa người đăng ký nhận tin thành công.');
  } catch (error) {
    console.error('[Admin Newsletter DELETE Error]:', error);
    return apiError('Lỗi xóa người đăng ký bản tin', 500);
  }
}

