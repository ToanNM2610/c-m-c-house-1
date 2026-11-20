import { NextRequest } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { apiSuccess, apiError } from '@/lib/api-response';
import { requireAuth } from '@/lib/auth';
import { logAction } from '@/lib/logger';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const list = await prisma.pageSeo.findMany({
      orderBy: { route: 'asc' },
    });
    return apiSuccess(list);
  } catch (error) {
    console.error('Error fetching PageSeo:', error);
    return apiError('Lỗi tải dữ liệu SEO', 500);
  }
}

export async function PUT(req: NextRequest) {
  const auth = await requireAuth(req, ['SUPER_ADMIN', 'SEO_MANAGER']);
  if ('errorResponse' in auth) return auth.errorResponse;

  try {
    const body = await req.json();
    const { id, route, metaTitleVi, metaTitleEn, metaDescVi, metaDescEn, h1Vi, h1En, ogImage, canonicalUrl, noIndex } = body;

    if (!route || !metaTitleVi || !metaDescVi) {
      return apiError('Đường dẫn, Tiêu đề SEO (VI) và Mô tả SEO (VI) không được để trống', 400);
    }

    const updated = await prisma.pageSeo.upsert({
      where: { route },
      update: {
        metaTitleVi,
        metaTitleEn: metaTitleEn || null,
        metaDescVi,
        metaDescEn: metaDescEn || null,
        h1Vi: h1Vi || null,
        h1En: h1En || null,
        ogImage: ogImage || null,
        canonicalUrl: canonicalUrl || null,
        noIndex: Boolean(noIndex),
      },
      create: {
        route,
        metaTitleVi,
        metaTitleEn: metaTitleEn || null,
        metaDescVi,
        metaDescEn: metaDescEn || null,
        h1Vi: h1Vi || null,
        h1En: h1En || null,
        ogImage: ogImage || null,
        canonicalUrl: canonicalUrl || null,
        noIndex: Boolean(noIndex),
      },
    });

    await logAction({
      level: 'INFO',
      action: 'SEO_UPDATE',
      actor: auth.user.username,
      details: `Updated SEO configuration for route: ${route}`,
    });

    revalidatePath('/', 'layout');
    return apiSuccess(updated, 'Cập nhật cấu hình SEO thành công');
  } catch (error) {
    console.error('Error updating PageSeo:', error);
    return apiError('Lỗi cập nhật cấu hình SEO', 500);
  }
}

