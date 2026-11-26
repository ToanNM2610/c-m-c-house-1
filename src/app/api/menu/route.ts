import { NextRequest } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { apiSuccess, apiError } from '@/lib/api-response';
import { getSessionUser } from '@/lib/auth';
import { canViewCostPrice } from '@/lib/rbac';
import { logAction } from '@/lib/logger';
import { recordAuditLog } from '@/lib/audit';

export const dynamic = 'force-dynamic';

function safeJsonParse(raw: string | null | undefined) {
  if (!raw) return undefined;
  try {
    return JSON.parse(raw);
  } catch {
    return undefined;
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get('categoryId');
    const inStock = searchParams.get('inStock');

    const user = await getSessionUser(req).catch(() => null);
    const showCostPrice = user ? canViewCostPrice(user.role) : false;

    const where: Record<string, unknown> = {};
    if (categoryId) where.categoryId = categoryId;
    if (inStock !== null) where.inStock = inStock === 'true';

    const items = await prisma.menuItem.findMany({
      where,
      orderBy: [{ categoryId: 'asc' }, { sortOrder: 'asc' }, { id: 'asc' }],
    });

    const parsed = items.map((m) => ({
      ...m,
      costPriceVnd: showCostPrice ? m.costPriceVnd : undefined,
      variants: safeJsonParse(m.variants),
      variantsEn: safeJsonParse(m.variantsEn),
      moodTags: safeJsonParse(m.moodTags),
      ingredients: safeJsonParse(m.ingredients),
    }));

    return apiSuccess(parsed);
  } catch (error) {
    console.error('Error fetching menu items:', error);
    return apiError('Không thể tải danh sách thực đơn', 500);
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const user = await getSessionUser(req);
    if (!user) {
      return apiError('Yêu cầu xác thực tài khoản quản trị', 401);
    }

    const body = await req.json();

    // Support Category Bulk Actions
    if (body.bulkAction && body.categoryId) {
      const { bulkAction, categoryId } = body;
      const bulkData: Record<string, unknown> = {};
      if (bulkAction === 'available_all') {
        bulkData.isAvailable = true;
        bulkData.inStock = true;
      } else if (bulkAction === 'unavailable_all') {
        bulkData.isAvailable = false;
        bulkData.inStock = false;
      } else if (bulkAction === 'show_all') {
        bulkData.isVisible = true;
      } else if (bulkAction === 'hide_all') {
        bulkData.isVisible = false;
      } else if (bulkAction === 'allow_ordering_all') {
        bulkData.allowOrdering = true;
      } else if (bulkAction === 'disable_ordering_all') {
        bulkData.allowOrdering = false;
      }

      await prisma.menuItem.updateMany({
        where: categoryId === 'all' ? {} : { categoryId },
        data: bulkData,
      });

      await recordAuditLog({
        action: `MENU_BULK_${String(bulkAction).toUpperCase()}`,
        module: 'PIM',
        recordId: categoryId,
        user,
        req,
      });

      revalidatePath('/', 'layout');
      return apiSuccess({ bulkAction, categoryId }, { message: 'Đã cập nhật hàng loạt thành công' });
    }

    const {
      id,
      inStock,
      isAvailable,
      isVisible,
      allowOrdering,
      price,
      salePriceVnd,
      costPriceVnd,
      sku,
      originRegion,
      tastingNotes,
      servingSize,
      trackInventory,
      lowStockThreshold,
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
    if (typeof isAvailable === 'boolean') {
      dataToUpdate.isAvailable = isAvailable;
      dataToUpdate.inStock = isAvailable;
    } else if (typeof inStock === 'boolean') {
      dataToUpdate.inStock = inStock;
      dataToUpdate.isAvailable = inStock;
    }
    if (typeof isVisible === 'boolean') dataToUpdate.isVisible = isVisible;
    if (typeof allowOrdering === 'boolean') dataToUpdate.allowOrdering = allowOrdering;
    if (typeof trackInventory === 'boolean') dataToUpdate.trackInventory = trackInventory;
    if (typeof lowStockThreshold === 'number') dataToUpdate.lowStockThreshold = Math.max(0, Math.round(lowStockThreshold));
    if (sku !== undefined) dataToUpdate.sku = sku || null;
    if (originRegion !== undefined) dataToUpdate.originRegion = originRegion || null;
    if (tastingNotes !== undefined) dataToUpdate.tastingNotes = tastingNotes || null;
    if (servingSize !== undefined) dataToUpdate.servingSize = servingSize || null;
    if (salePriceVnd !== undefined) {
      dataToUpdate.salePriceVnd = salePriceVnd === null || salePriceVnd === '' ? null : Math.max(0, Math.round(Number(salePriceVnd)));
    }
    if (costPriceVnd !== undefined && canViewCostPrice(user.role)) {
      dataToUpdate.costPriceVnd = Math.max(0, Math.round(Number(costPriceVnd)));
    }
    if (customGlbUrl !== undefined) dataToUpdate.customGlbUrl = customGlbUrl;
    if (photoUrl !== undefined) dataToUpdate.photoUrl = photoUrl;
    if (name !== undefined) {
      dataToUpdate.name = name;
      dataToUpdate.nameVi = name;
    }
    if (nameEn !== undefined) dataToUpdate.nameEn = nameEn;
    if (vietnameseTitle !== undefined) {
      dataToUpdate.vietnameseTitle = vietnameseTitle;
      dataToUpdate.nameVi = vietnameseTitle;
    }
    if (description !== undefined) {
      dataToUpdate.description = description;
      dataToUpdate.descVi = description;
    }
    if (descriptionEn !== undefined) {
      dataToUpdate.descriptionEn = descriptionEn;
      dataToUpdate.descEn = descriptionEn;
    }
    if (highlight !== undefined) {
      dataToUpdate.highlight = highlight;
      dataToUpdate.badgeVi = highlight;
    }
    if (highlightEn !== undefined) {
      dataToUpdate.highlightEn = highlightEn;
      dataToUpdate.badgeEn = highlightEn;
    }
    if (editorialNote !== undefined) {
      dataToUpdate.editorialNote = editorialNote;
      dataToUpdate.editorialNoteVi = editorialNote;
    }
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
        dataToUpdate.priceVnd = Math.round(price);
        dataToUpdate.priceDisplay = priceDisplay || `${price.toLocaleString('vi-VN')}đ`;
      }
    }

    const updated = await prisma.menuItem.update({
      where: { id },
      data: dataToUpdate,
    });

    revalidatePath('/', 'layout');

    await logAction({
      level: 'INFO',
      category: 'CMS',
      action: 'MENU_UPDATE',
      actor: user.username,
      details: `Updated menu item: ${id}`,
    });
    await recordAuditLog({
      action: 'MENU_UPDATE',
      module: 'PIM',
      recordId: id,
      details: JSON.stringify(Object.keys(dataToUpdate)),
      user,
      req,
    });

    return apiSuccess(
      {
        ...updated,
        costPriceVnd: canViewCostPrice(user.role) ? updated.costPriceVnd : undefined,
        variants: safeJsonParse(updated.variants),
        variantsEn: safeJsonParse(updated.variantsEn),
      },
      { message: 'Cập nhật món thành công' }
    );
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
      salePriceVnd,
      costPriceVnd,
      sku,
      originRegion,
      tastingNotes,
      servingSize,
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
    const maxSort = await prisma.menuItem.count();
    const created = await prisma.menuItem.create({
      data: {
        id,
        categoryId,
        sortOrder: maxSort + 1,
        nameVi: vietnameseTitle || name || '',
        name: name || vietnameseTitle,
        nameEn: nameEn || null,
        vietnameseTitle,
        descVi: description || '',
        description: description || '',
        descriptionEn: descriptionEn || null,
        descEn: descriptionEn || null,
        priceVnd: Math.round(price),
        salePriceVnd: salePriceVnd ? Math.round(Number(salePriceVnd)) : null,
        costPriceVnd: canViewCostPrice(user.role) && costPriceVnd ? Math.round(Number(costPriceVnd)) : 0,
        price,
        priceDisplay: `${price.toLocaleString('vi-VN')}đ`,
        sku: sku || null,
        originRegion: originRegion || null,
        tastingNotes: tastingNotes || null,
        servingSize: servingSize || null,
        highlight: highlight || null,
        highlightEn: highlightEn || null,
        editorialNote: editorialNote || null,
        editorialNoteEn: editorialNoteEn || null,
        inStock: true,
        isAvailable: true,
        isVisible: true,
        orderCount: 0,
      },
    });

    revalidatePath('/', 'layout');

    await logAction({
      level: 'INFO',
      category: 'CMS',
      action: 'MENU_CREATE',
      actor: user.username,
      details: `Created menu item: ${id} (${vietnameseTitle})`,
    });
    await recordAuditLog({
      action: 'MENU_CREATE',
      module: 'PIM',
      recordId: id,
      details: vietnameseTitle,
      user,
      req,
    });

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
      return apiError('Thiếu mã món (id)', 400);
    }

    await prisma.menuItem.delete({ where: { id } });
    revalidatePath('/', 'layout');

    await recordAuditLog({
      action: 'MENU_DELETE',
      module: 'PIM',
      recordId: id,
      user,
      req,
    });

    return apiSuccess({ id }, { message: 'Đã xóa món khỏi thực đơn' });
  } catch (error: any) {
    console.error('Error deleting menu item:', error);
    return apiError(error.message || 'Lỗi xóa món', 500);
  }
}
