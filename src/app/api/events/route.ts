import { NextRequest } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { apiSuccess, apiError } from '@/lib/api-response';
import { getSessionUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const events = await prisma.eventPost.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return apiSuccess(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    return apiError('Không thể tải danh sách sự kiện', 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getSessionUser(req);
    if (!user) {
      return apiError('Yêu cầu xác thực tài khoản quản trị', 401);
    }

    const body = await req.json();
    const {
      title,
      titleEn,
      subtitle,
      subtitleEn,
      dateOrSchedule,
      dateOrScheduleEn,
      description,
      descriptionEn,
      badge,
      badgeEn,
      imageUrl,
    } = body;

    if (!title || !dateOrSchedule) {
      return apiError('Thiếu tiêu đề hoặc thời gian tổ chức', 400);
    }

    const created = await prisma.eventPost.create({
      data: {
        title,
        titleEn: titleEn || '',
        subtitle: subtitle || '',
        subtitleEn: subtitleEn || '',
        dateOrSchedule,
        dateOrScheduleEn: dateOrScheduleEn || '',
        description: description || '',
        descriptionEn: descriptionEn || '',
        badge: badge || 'Sự kiện',
        badgeEn: badgeEn || 'Event',
        imageUrl: imageUrl || null,
        active: true,
      },
    });

    revalidatePath('/', 'layout');
    return apiSuccess(created, { message: 'Thêm sự kiện thành công' }, 201);
  } catch (error: any) {
    console.error('Error adding event:', error);
    return apiError(error.message || 'Lỗi thêm sự kiện', 500);
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const user = await getSessionUser(req);
    if (!user) {
      return apiError('Yêu cầu xác thực tài khoản quản trị', 401);
    }

    const body = await req.json();
    const {
      id,
      active,
      title,
      titleEn,
      subtitle,
      subtitleEn,
      dateOrSchedule,
      dateOrScheduleEn,
      description,
      descriptionEn,
      badge,
      badgeEn,
      imageUrl,
    } = body;

    if (!id) {
      return apiError('Thiếu mã sự kiện (id)', 400);
    }

    const dataToUpdate: Record<string, unknown> = {};
    if (typeof active === 'boolean') dataToUpdate.active = active;
    if (title) dataToUpdate.title = title;
    if (titleEn !== undefined) dataToUpdate.titleEn = titleEn;
    if (subtitle !== undefined) dataToUpdate.subtitle = subtitle;
    if (subtitleEn !== undefined) dataToUpdate.subtitleEn = subtitleEn;
    if (dateOrSchedule) dataToUpdate.dateOrSchedule = dateOrSchedule;
    if (dateOrScheduleEn !== undefined) dataToUpdate.dateOrScheduleEn = dateOrScheduleEn;
    if (description !== undefined) dataToUpdate.description = description;
    if (descriptionEn !== undefined) dataToUpdate.descriptionEn = descriptionEn;
    if (badge) dataToUpdate.badge = badge;
    if (badgeEn !== undefined) dataToUpdate.badgeEn = badgeEn;
    if (imageUrl !== undefined) dataToUpdate.imageUrl = imageUrl || null;

    const updated = await prisma.eventPost.update({
      where: { id },
      data: dataToUpdate,
    });

    revalidatePath('/', 'layout');
    return apiSuccess(updated, { message: 'Cập nhật sự kiện thành công' });
  } catch (error: any) {
    console.error('Error updating event:', error);
    return apiError(error.message || 'Lỗi cập nhật sự kiện', 500);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const user = await getSessionUser(req);
    if (!user) {
      return apiError('Yêu cầu xác thực tài khoản quản trị', 401);
    }

    const { searchParams } = new URL(req.url);
    let id = searchParams.get('id');
    if (!id) {
      try {
        const body = await req.json();
        id = body?.id;
      } catch {}
    }

    if (!id) {
      return apiError('Thiếu mã sự kiện cần xóa (id)', 400);
    }

    const existing = await prisma.eventPost.findUnique({ where: { id } });
    if (!existing) {
      return apiError('Không tìm thấy sự kiện cần xóa', 404);
    }

    await prisma.eventPost.delete({
      where: { id },
    });

    revalidatePath('/', 'layout');
    return apiSuccess({ id, title: existing.title }, 'Đã xóa sự kiện thành công');
  } catch (error: any) {
    console.error('Error deleting event:', error);
    return apiError(error.message || 'Lỗi khi xóa sự kiện', 500);
  }
}
