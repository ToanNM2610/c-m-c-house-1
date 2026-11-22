import { NextRequest } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { apiSuccess, apiError } from '@/lib/api-response';
import { requireAuth } from '@/lib/auth';
import { logAction } from '@/lib/logger';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const pageKey = searchParams.get('pageKey');

    if (pageKey) {
      const config = await prisma.pageConfig.findUnique({
        where: { pageKey },
      });
      if (!config) {
        return apiError(`Không tìm thấy cấu hình cho trang '${pageKey}'`, 404);
      }
      return apiSuccess(config);
    }

    const configs = await prisma.pageConfig.findMany({
      orderBy: { pageKey: 'asc' },
    });
    return apiSuccess(configs);
  } catch (error) {
    console.error('Error fetching page configs:', error);
    return apiError('Lỗi tải cấu hình trang', 500);
  }
}

export async function PATCH(req: NextRequest) {
  const auth = await requireAuth(req, ['SUPER_ADMIN', 'EDITOR']);
  if ('errorResponse' in auth) return auth.errorResponse;

  try {
    const body = await req.json();
    const { pageKey, enabled, seoTitleVi, seoTitleEn, seoDescVi, seoDescEn, sections } = body;

    if (!pageKey) {
      return apiError('Thiếu pageKey', 400);
    }

    const updateData: Record<string, unknown> = {};
    if (typeof enabled === 'boolean') updateData.enabled = enabled;
    if (seoTitleVi !== undefined) updateData.seoTitleVi = seoTitleVi;
    if (seoTitleEn !== undefined) updateData.seoTitleEn = seoTitleEn;
    if (seoDescVi !== undefined) updateData.seoDescVi = seoDescVi;
    if (seoDescEn !== undefined) updateData.seoDescEn = seoDescEn;
    if (sections !== undefined) updateData.sections = sections;

    const updated = await prisma.pageConfig.upsert({
      where: { pageKey },
      update: updateData,
      create: {
        pageKey,
        enabled: typeof enabled === 'boolean' ? enabled : true,
        seoTitleVi: seoTitleVi || 'Cẩm Cù House',
        seoTitleEn: seoTitleEn || 'Cẩm Cù House',
        seoDescVi: seoDescVi || 'Cẩm Cù House - Quán cà phê sinh thái bên bờ suối Gia Nghĩa',
        seoDescEn: seoDescEn || 'Cẩm Cù House - Streamside Eco-Sanctuary Café Dong Gia Nghia',
        sections: sections || [],
      },
    });

    // Mirror to SiteContent showPage* toggle if applicable
    if (typeof enabled === 'boolean') {
      const contentFieldMap: Record<string, string> = {
        about: 'showPageAbout',
        space: 'showPageSpace',
        menu: 'showPageMenu',
        reviews: 'showPageReviews',
        news: 'showPageNews',
        contact: 'showPageContact',
      };
      const field = contentFieldMap[pageKey];
      if (field) {
        try {
          await prisma.siteContent.updateMany({
            where: { id: 'default' },
            data: { [field]: enabled },
          });
        } catch (e) {
          console.warn(`Could not mirror page toggle to SiteContent for ${pageKey}`, e);
        }
      }
    }

    revalidatePath('/', 'layout');

    await logAction({
      level: 'INFO',
      category: 'CMS',
      action: 'PAGE_CONFIG_UPDATE',
      actor: auth.user.username,
      details: `Updated PageConfig for pageKey=${pageKey}`,
    });

    return apiSuccess(updated, 'Cập nhật cấu hình trang thành công');
  } catch (error) {
    console.error('Error updating page config:', error);
    return apiError('Lỗi cập nhật cấu hình trang', 500);
  }
}
