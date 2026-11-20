import { NextRequest } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { apiSuccess, apiError } from '@/lib/api-response';
import { requireAuth } from '@/lib/auth';
import { logAction } from '@/lib/logger';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const list = await prisma.highlightStory.findMany({
      orderBy: { orderIndex: 'asc' },
    });
    return apiSuccess(list);
  } catch (error) {
    console.error('Error fetching highlight stories:', error);
    return apiError('Lỗi tải danh sách câu chuyện nổi bật', 500);
  }
}

export async function POST(req: NextRequest) {
  const auth = await requireAuth(req, ['SUPER_ADMIN', 'EDITOR']);
  if ('errorResponse' in auth) return auth.errorResponse;

  try {
    const body = await req.json();
    const {
      title,
      titleEn,
      category = 'Không gian',
      categoryEn,
      date = '2024 - Nay',
      dateEn,
      summary,
      summaryEn,
      content,
      contentEn,
      imageUrl,
      badge,
      badgeEn,
      orderIndex = 0,
      published = true,
    } = body;

    if (!title || !summary || !content) {
      return apiError('Tiêu đề, Tóm tắt và Nội dung chi tiết không được để trống', 400);
    }

    const created = await prisma.highlightStory.create({
      data: {
        title,
        titleEn: titleEn || null,
        category,
        categoryEn: categoryEn || null,
        date,
        dateEn: dateEn || null,
        summary,
        summaryEn: summaryEn || null,
        content,
        contentEn: contentEn || null,
        imageUrl: imageUrl || null,
        badge: badge || null,
        badgeEn: badgeEn || null,
        orderIndex: Number(orderIndex),
        published: Boolean(published),
      },
    });

    await logAction({
      level: 'INFO',
      action: 'STORY_CREATE',
      actor: auth.user.username,
      details: `Created story: ${title}`,
    });

    revalidatePath('/', 'layout');
    return apiSuccess(created, 'Thêm câu chuyện thành công');
  } catch (error) {
    console.error('Error creating highlight story:', error);
    return apiError('Lỗi tạo câu chuyện nổi bật', 500);
  }
}

export async function PUT(req: NextRequest) {
  const auth = await requireAuth(req, ['SUPER_ADMIN', 'EDITOR']);
  if ('errorResponse' in auth) return auth.errorResponse;

  try {
    const body = await req.json();
    const {
      id,
      title,
      titleEn,
      category,
      categoryEn,
      date,
      dateEn,
      summary,
      summaryEn,
      content,
      contentEn,
      imageUrl,
      badge,
      badgeEn,
      orderIndex,
      published,
    } = body;

    if (!id) return apiError('Thiếu ID câu chuyện', 400);

    const updated = await prisma.highlightStory.update({
      where: { id },
      data: {
        title,
        titleEn: titleEn !== undefined ? (titleEn || null) : undefined,
        category,
        categoryEn: categoryEn !== undefined ? (categoryEn || null) : undefined,
        date,
        dateEn: dateEn !== undefined ? (dateEn || null) : undefined,
        summary,
        summaryEn: summaryEn !== undefined ? (summaryEn || null) : undefined,
        content,
        contentEn: contentEn !== undefined ? (contentEn || null) : undefined,
        imageUrl: imageUrl !== undefined ? (imageUrl || null) : undefined,
        badge: badge !== undefined ? (badge || null) : undefined,
        badgeEn: badgeEn !== undefined ? (badgeEn || null) : undefined,
        orderIndex: orderIndex !== undefined ? Number(orderIndex) : undefined,
        published: typeof published === 'boolean' ? published : undefined,
      },
    });

    await logAction({
      level: 'INFO',
      action: 'STORY_UPDATE',
      actor: auth.user.username,
      details: `Updated story: ${updated.title}`,
    });

    revalidatePath('/', 'layout');
    return apiSuccess(updated, 'Cập nhật câu chuyện thành công');
  } catch (error) {
    console.error('Error updating highlight story:', error);
    return apiError('Lỗi cập nhật câu chuyện', 500);
  }
}

export async function DELETE(req: NextRequest) {
  const auth = await requireAuth(req, ['SUPER_ADMIN', 'EDITOR']);
  if ('errorResponse' in auth) return auth.errorResponse;

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) return apiError('Thiếu ID câu chuyện cần xoá', 400);

    const deleted = await prisma.highlightStory.delete({
      where: { id },
    });

    await logAction({
      level: 'INFO',
      action: 'STORY_DELETE',
      actor: auth.user.username,
      details: `Deleted story: ${deleted.title}`,
    });

    revalidatePath('/', 'layout');
    return apiSuccess(deleted, 'Xoá câu chuyện thành công');
  } catch (error) {
    console.error('Error deleting highlight story:', error);
    return apiError('Lỗi xoá câu chuyện', 500);
  }
}

