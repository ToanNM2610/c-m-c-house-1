import { NextRequest } from 'next/server';
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
    console.error('Error fetching gallery plates:', error);
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
    const { id, titleVi, locationVi, descriptionVi, chapter, imageUrl, customGlbUrl } = body;

    if (!id) {
      return apiError('Thiếu mã ảnh (id, vd: FIG. 01)', 400);
    }

    const dataToUpdate: Record<string, unknown> = {};
    if (titleVi !== undefined) dataToUpdate.titleVi = titleVi;
    if (locationVi !== undefined) dataToUpdate.locationVi = locationVi;
    if (descriptionVi !== undefined) dataToUpdate.descriptionVi = descriptionVi;
    if (typeof chapter === 'number') {
      dataToUpdate.chapter = chapter;
      const chapterTitles: Record<number, string> = {
        1: 'Chương I: Lối Nhỏ Vào Vườn',
        2: 'Chương II: Bên Bờ Suối Mát',
        3: 'Chương III: Hương Vị Xanh Sạch',
        4: 'Chương IV: Chiều Buông & Đêm Cuối Tuần',
      };
      dataToUpdate.chapterTitleVi = chapterTitles[chapter] || `Chương ${chapter}`;
    }
    if (imageUrl !== undefined) dataToUpdate.imageUrl = imageUrl;
    if (customGlbUrl !== undefined) dataToUpdate.customGlbUrl = customGlbUrl;

    const updated = await prisma.spatialFigure.update({
      where: { id },
      data: dataToUpdate,
    });

    return apiSuccess(updated, { message: `Cập nhật ${id} thành công` });
  } catch (error: any) {
    console.error('Error updating gallery plate:', error);
    return apiError(error.message || 'Lỗi cập nhật ảnh không gian', 500);
  }
}

