import { NextRequest } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { apiSuccess, apiError } from '@/lib/api-response';
import { getSessionUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const item = await prisma.menuItem.findUnique({
      where: { id: params.id },
      include: { category: true },
    });

    if (!item) {
      return apiError('Không tìm thấy món', 404);
    }

    return apiSuccess({
      ...item,
      variants: item.variants ? JSON.parse(item.variants) : undefined,
      variantsEn: item.variantsEn ? JSON.parse(item.variantsEn) : undefined,
      moodTags: item.moodTags ? JSON.parse(item.moodTags) : undefined,
      ingredients: item.ingredients ? JSON.parse(item.ingredients) : undefined,
    });
  } catch (error) {
    console.error('Error fetching menu item by id:', error);
    return apiError('Lỗi lấy thông tin món', 500);
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getSessionUser(req);
    if (!user) {
      return apiError('Yêu cầu xác thực tài khoản quản trị', 401);
    }

    const body = await req.json();
    const {
      inStock,
      price,
      priceDisplay,
      customGlbUrl,
      photoUrl,
      variantId,
      name,
      nameEn,
      vietnameseTitle,
      description,
      descriptionEn,
      highlight,
      highlightEn,
      editorialNote,
      editorialNoteEn,
      variantsEn,
    } = body;

    const existing = await prisma.menuItem.findUnique({ where: { id: params.id } });
    if (!existing) {
      return apiError('Không tìm thấy món trong thực đơn', 404);
    }

    const dataToUpdate: Record<string, unknown> = {};
    if (typeof inStock === 'boolean') dataToUpdate.inStock = inStock;
    if (customGlbUrl !== undefined) dataToUpdate.customGlbUrl = customGlbUrl;
    if (photoUrl !== undefined) dataToUpdate.photoUrl = photoUrl;
    if (name !== undefined) dataToUpdate.name = name;
    if (nameEn !== undefined) dataToUpdate.nameEn = nameEn;
    if (vietnameseTitle !== undefined) dataToUpdate.vietnameseTitle = vietnameseTitle;
    if (description !== undefined) dataToUpdate.description = description;
    if (descriptionEn !== undefined) dataToUpdate.descriptionEn = descriptionEn;
    if (highlight !== undefined) dataToUpdate.highlight = highlight;
    if (highlightEn !== undefined) dataToUpdate.highlightEn = highlightEn;
    if (editorialNote !== undefined) dataToUpdate.editorialNote = editorialNote;
    if (editorialNoteEn !== undefined) dataToUpdate.editorialNoteEn = editorialNoteEn;
    if (variantsEn !== undefined) {
      dataToUpdate.variantsEn = typeof variantsEn === 'string' ? variantsEn : JSON.stringify(variantsEn);
    }

    if (typeof price === 'number') {
      if (variantId && existing.variants) {
        try {
          const variants = JSON.parse(existing.variants);
          const idx = variants.findIndex((v: { id: string }) => v.id === variantId);
          if (idx !== -1) {
            variants[idx].price = price;
            dataToUpdate.variants = JSON.stringify(variants);
          }
        } catch {
          // ignore
        }
      } else {
        dataToUpdate.price = price;
        dataToUpdate.priceDisplay = priceDisplay || `${price.toLocaleString('vi-VN')}đ`;
      }
    }

    const updated = await prisma.menuItem.update({
      where: { id: params.id },
      data: dataToUpdate,
    });

    revalidatePath('/', 'layout');
    return apiSuccess({
      ...updated,
      variants: updated.variants ? JSON.parse(updated.variants) : undefined,
      variantsEn: updated.variantsEn ? JSON.parse(updated.variantsEn) : undefined,
    }, { message: 'Cập nhật món thành công' });
  } catch (error: any) {
    console.error('Error updating menu item:', error);
    return apiError(error.message || 'Lỗi cập nhật món', 500);
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getSessionUser(req);
    if (!user) {
      return apiError('Yêu cầu xác thực tài khoản quản trị', 401);
    }

    await prisma.menuItem.delete({
      where: { id: params.id },
    });
    revalidatePath('/', 'layout');
    return apiSuccess({ deletedId: params.id }, { message: 'Xóa món thành công' });
  } catch (error: any) {
    console.error('Error deleting menu item:', error);
    return apiError(error.message || 'Lỗi xóa món', 500);
  }
}
