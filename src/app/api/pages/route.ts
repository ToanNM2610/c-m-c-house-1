import { NextRequest } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { apiSuccess, apiError } from '@/lib/api-response';
import { requireAuth } from '@/lib/auth';
import { logAction } from '@/lib/logger';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const list = await prisma.staticPage.findMany({
      orderBy: { slug: 'asc' },
    });
    return apiSuccess(list);
  } catch (error) {
    console.error('Error fetching static pages:', error);
    return apiError('Lỗi tải danh sách trang tĩnh', 500);
  }
}

export async function POST(req: NextRequest) {
  const auth = await requireAuth(req, ['SUPER_ADMIN', 'EDITOR']);
  if ('errorResponse' in auth) return auth.errorResponse;

  try {
    const body = await req.json();
    const { slug, title, titleEn, content, contentEn, metaTitle, metaDescription, published = true } = body;

    if (!slug || !title || !content) {
      return apiError('Đường dẫn (Slug), Tiêu đề và Nội dung bài viết không được để trống', 400);
    }

    const cleanSlug = slug.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');

    const existing = await prisma.staticPage.findUnique({
      where: { slug: cleanSlug },
    });

    if (existing) {
      return apiError(`Đã tồn tại trang có slug '${cleanSlug}'`, 409);
    }

    const created = await prisma.staticPage.create({
      data: {
        slug: cleanSlug,
        title,
        titleEn: titleEn || null,
        content,
        contentEn: contentEn || null,
        metaTitle: metaTitle || null,
        metaDescription: metaDescription || null,
        published: Boolean(published),
      },
    });

    await prisma.legalPage.upsert({
      where: { slug: cleanSlug },
      update: {
        titleVi: title,
        titleEn: titleEn || title,
        contentVi: content,
        contentEn: contentEn || content,
        seoTitleVi: metaTitle || null,
        seoDescVi: metaDescription || null,
        published: Boolean(published),
      },
      create: {
        slug: cleanSlug,
        titleVi: title,
        titleEn: titleEn || title,
        contentVi: content,
        contentEn: contentEn || content,
        seoTitleVi: metaTitle || null,
        seoDescVi: metaDescription || null,
        published: Boolean(published),
      },
    }).catch(() => {});

    await logAction({
      level: 'INFO',
      action: 'PAGE_CREATE',
      actor: auth.user.username,
      details: `Created static page: ${cleanSlug}`,
    });

    revalidatePath('/', 'layout');
    return apiSuccess(created, 'Tạo trang tĩnh thành công');
  } catch (error) {
    console.error('Error creating static page:', error);
    return apiError('Lỗi tạo trang tĩnh', 500);
  }
}

export async function PUT(req: NextRequest) {
  const auth = await requireAuth(req, ['SUPER_ADMIN', 'EDITOR']);
  if ('errorResponse' in auth) return auth.errorResponse;

  try {
    const body = await req.json();
    const { id, slug, title, titleEn, content, contentEn, metaTitle, metaDescription, published } = body;

    if (!id) return apiError('Thiếu ID trang tĩnh', 400);

    const updated = await prisma.staticPage.update({
      where: { id },
      data: {
        slug: slug ? slug.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '') : undefined,
        title,
        titleEn: titleEn !== undefined ? (titleEn || null) : undefined,
        content,
        contentEn: contentEn !== undefined ? (contentEn || null) : undefined,
        metaTitle: metaTitle !== undefined ? (metaTitle || null) : undefined,
        metaDescription: metaDescription !== undefined ? (metaDescription || null) : undefined,
        published: typeof published === 'boolean' ? published : undefined,
      },
    });

    await prisma.legalPage.upsert({
      where: { slug: updated.slug },
      update: {
        titleVi: updated.title,
        titleEn: updated.titleEn || updated.title,
        contentVi: updated.content,
        contentEn: updated.contentEn || updated.content,
        seoTitleVi: updated.metaTitle,
        seoDescVi: updated.metaDescription,
        published: updated.published,
      },
      create: {
        slug: updated.slug,
        titleVi: updated.title,
        titleEn: updated.titleEn || updated.title,
        contentVi: updated.content,
        contentEn: updated.contentEn || updated.content,
        seoTitleVi: updated.metaTitle,
        seoDescVi: updated.metaDescription,
        published: updated.published,
      },
    }).catch(() => {});

    await logAction({
      level: 'INFO',
      action: 'PAGE_UPDATE',
      actor: auth.user.username,
      details: `Updated static page: ${updated.slug}`,
    });

    revalidatePath('/', 'layout');
    return apiSuccess(updated, 'Cập nhật trang tĩnh thành công');
  } catch (error) {
    console.error('Error updating static page:', error);
    return apiError('Lỗi cập nhật trang tĩnh', 500);
  }
}

export async function DELETE(req: NextRequest) {
  const auth = await requireAuth(req, ['SUPER_ADMIN', 'EDITOR']);
  if ('errorResponse' in auth) return auth.errorResponse;

  try {
    const { searchParams } = new URL(req.url);
    let id = searchParams.get('id');
    if (!id) {
      try {
        const body = await req.json();
        id = body?.id;
      } catch {}
    }

    if (!id) return apiError('Thiếu ID trang tĩnh cần xóa', 400);

    const existing = await prisma.staticPage.findUnique({ where: { id } });
    if (!existing) {
      return apiError('Không tìm thấy trang tĩnh cần xóa', 404);
    }

    const deleted = await prisma.staticPage.delete({
      where: { id },
    });

    await logAction({
      level: 'INFO',
      action: 'PAGE_DELETE',
      actor: auth.user.username,
      details: `Deleted static page: ${deleted.slug}`,
    });

    revalidatePath('/', 'layout');
    return apiSuccess(deleted, 'Xóa trang tĩnh thành công');
  } catch (error: any) {
    console.error('Error deleting static page:', error);
    return apiError(error?.message || 'Lỗi khi xóa trang tĩnh', 500);
  }
}

