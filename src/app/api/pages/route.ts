import { NextRequest } from 'next/server';
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

    await logAction({
      level: 'INFO',
      action: 'PAGE_CREATE',
      actor: auth.user.username,
      details: `Created static page: ${cleanSlug}`,
    });

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

    await logAction({
      level: 'INFO',
      action: 'PAGE_UPDATE',
      actor: auth.user.username,
      details: `Updated static page: ${updated.slug}`,
    });

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
    const id = searchParams.get('id');

    if (!id) return apiError('Thiếu ID trang cần xoá', 400);

    const deleted = await prisma.staticPage.delete({
      where: { id },
    });

    await logAction({
      level: 'INFO',
      action: 'PAGE_DELETE',
      actor: auth.user.username,
      details: `Deleted static page: ${deleted.slug}`,
    });

    return apiSuccess(deleted, 'Xoá trang tĩnh thành công');
  } catch (error) {
    console.error('Error deleting static page:', error);
    return apiError('Lỗi xoá trang tĩnh', 500);
  }
}

