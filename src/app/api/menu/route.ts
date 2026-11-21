import { NextRequest } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { apiSuccess, apiError } from '@/lib/api-response';
import { getSessionUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get('categoryId');
    const inStock = searchParams.get('inStock');

    const where: Record<string, unknown> = {};
    if (categoryId) where.categoryId = categoryId;
    if (inStock !== null) where.inStock = inStock === 'true';

    const items = await prisma.menuItem.findMany({
      where,
      orderBy: { orderCount: 'desc' },
    });

    const parsed = items.map((m) => ({
      ...m,
      variants: m.variants ? JSON.parse(m.variants) : undefined,
      variantsEn: m.variantsEn ? JSON.parse(m.variantsEn) : undefined,
      moodTags: m.moodTags ? JSON.parse(m.moodTags) : undefined,
      ingredients: m.ingredients ? JSON.parse(m.ingredients) : undefined,
    }));

    return apiSuccess(parsed);
  } catch (error) {
    console.error('Error fetching menu items:', error);
    return apiError('Không thể tải danh sách thực đơn', 500);
  }
}

// Support both body.id and RESTful calls
export async function PATCH(req: NextRequest) {
  try {
    const user = await getSessionUser(req);
    if (!user) {
      return apiError('Yêu cầu xác thực tài khoản quản trị', 401);
    }

    const body = await req.json();
    const {
      id,
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

    if (!id) {
      return apiError('Thiếu mã món (id)', 400);
    }

    const existing = await prisma.menuItem.findUnique({ where: { id } });
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
      where: { id },
      data: dataToUpdate,
    });

    revalidatePath('/', 'layout');

    return apiSuccess({
      ...updated,
      variants: updated.variants ? JSON.parse(updated.variants) : undefined,
      variantsEn: updated.variantsEn ? JSON.parse(updated.variantsEn) : undefined,
    }, { message: 'Cập nhật món thành công' });
  } catch (error: any) {
    console.error('Error patching menu item:', error);
    return apiError(error.message || 'Lỗi cập nhật món', 500);
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
      categoryId,
      vietnameseTitle,
      name,
      nameEn,
      price,
      description,
      descriptionEn,
      highlight,
      highlightEn,
      editorialNote,
      editorialNoteEn,
    } = body;

    if (!categoryId || !vietnameseTitle || typeof price !== 'number') {
      return apiError('Vui lòng cung cấp danh mục, tên món và giá hợp lệ', 400);
    }

    const id = body.id || `custom-${Date.now()}`;
    const created = await prisma.menuItem.create({
      data: {
        id,
        categoryId,
        name: name || vietnameseTitle,
        nameEn: nameEn || null,
        vietnameseTitle,
        description: description || '',
        descriptionEn: descriptionEn || null,
        price,
        priceDisplay: `${price.toLocaleString('vi-VN')}đ`,
        highlight: highlight || null,
        highlightEn: highlightEn || null,
        editorialNote: editorialNote || null,
        editorialNoteEn: editorialNoteEn || null,
        inStock: true,
        orderCount: 0,
      },
    });

    revalidatePath('/', 'layout');

    return apiSuccess(created, { message: 'Thêm món mới thành công' }, 201);
  } catch (error: any) {
    console.error('Error adding menu item:', error);
    return apiError(error.message || 'Lỗi thêm món', 500);
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
      return apiError('Thiếu mã món cần xóa (id)', 400);
    }

    const existing = await prisma.menuItem.findUnique({ where: { id } });
    if (!existing) {
      return apiError('Không tìm thấy món cần xóa', 404);
    }

    await prisma.menuItem.delete({
      where: { id },
    });

    revalidatePath('/', 'layout');
    return apiSuccess({ deletedId: id, name: existing.vietnameseTitle }, 'Đã xóa món khỏi thực đơn thành công');
  } catch (error: any) {
    console.error('Error deleting menu item:', error);
    return apiError(error.message || 'Lỗi khi xóa món khỏi thực đơn', 500);
  }
}
