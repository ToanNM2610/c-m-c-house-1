import { NextRequest } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { apiSuccess, apiError } from '@/lib/api-response';
import { getSessionUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const plates = await prisma.spatialFigure.findMany({
      orderBy: { id: 'asc' },
    });
    return apiSuccess(plates);
  } catch (error) {
    console.error('Error fetching spatial plates:', error);
    return apiError('Không thể tải thư viện 30 ảnh', 500);
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
      titleVi,
      titleEn,
      locationVi,
      locationEn,
      descriptionVi,
      descriptionEn,
      chapter,
      chapterTitleEn,
      imageUrl,
      customGlbUrl,
    } = body;

    if (!id) {
      return apiError('Thiếu mã ảnh (id, vd: FIG. 01)', 400);
    }

    const dataToUpdate: Record<string, unknown> = {};
    if (titleVi !== undefined) dataToUpdate.titleVi = titleVi;
    if (titleEn !== undefined) dataToUpdate.titleEn = titleEn;
    if (locationVi !== undefined) dataToUpdate.locationVi = locationVi;
    if (locationEn !== undefined) dataToUpdate.locationEn = locationEn;
    if (descriptionVi !== undefined) dataToUpdate.descriptionVi = descriptionVi;
    if (descriptionEn !== undefined) dataToUpdate.descriptionEn = descriptionEn;

    if (typeof chapter === 'number') {
      dataToUpdate.chapter = chapter;
      const chapterTitlesVi: Record<number, string> = {
        1: 'Chương I: Lối Nhỏ Vào Vườn',
        2: 'Chương II: Bên Bờ Suối Mát',
        3: 'Chương III: Hương Vị Xanh Sạch',
        4: 'Chương IV: Chiều Buông & Đêm Cuối Tuần',
      };
      const chapterTitlesEnMap: Record<number, string> = {
        1: 'Chapter I: The Wax Flower Path',
        2: 'Chapter II: Beside the Cool Stream',
        3: 'Chapter III: Wholesome Pure Flavors',
        4: 'Chapter IV: Twilight & Weekend Nights',
      };
      dataToUpdate.chapterTitleVi = chapterTitlesVi[chapter] || `Chương ${chapter}`;
      if (!chapterTitleEn) {
        dataToUpdate.chapterTitleEn = chapterTitlesEnMap[chapter] || `Chapter ${chapter}`;
      }
    }
    if (chapterTitleEn !== undefined) dataToUpdate.chapterTitleEn = chapterTitleEn;
    if (imageUrl !== undefined) dataToUpdate.imageUrl = imageUrl;
    if (customGlbUrl !== undefined) dataToUpdate.customGlbUrl = customGlbUrl;

    const updated = await prisma.spatialFigure.update({
      where: { id },
      data: dataToUpdate,
    });

    revalidatePath('/', 'layout');

    return apiSuccess(updated, { message: `Cập nhật ${id} thành công` });
  } catch (error: any) {
    console.error('Error updating spatial plate:', error);
    return apiError(error.message || 'Lỗi cập nhật ảnh không gian', 500);
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
      return apiError('Thiếu mã ảnh không gian cần gỡ (id, vd: FIG. 01)', 400);
    }

    const existing = await prisma.spatialFigure.findUnique({ where: { id } });
    if (!existing) {
      return apiError('Không tìm thấy ảnh không gian tương ứng', 404);
    }

    // Reset image URL to empty string (fallback graphic mode)
    const updated = await prisma.spatialFigure.update({
      where: { id },
      data: { imageUrl: '', customGlbUrl: null },
    });

    revalidatePath('/', 'layout');
    return apiSuccess(updated, `Đã gỡ bỏ ảnh không gian ${id} thành công`);
  } catch (error: any) {
    console.error('Error deleting spatial plate:', error);
    return apiError(error.message || 'Lỗi khi gỡ ảnh không gian', 500);
  }
}



