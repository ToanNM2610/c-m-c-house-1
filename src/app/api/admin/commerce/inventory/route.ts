import { NextRequest } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { apiSuccess, apiError } from '@/lib/api-response';
import { requireAuth } from '@/lib/auth';
import { logAction } from '@/lib/logger';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const auth = await requireAuth(req, ['SUPER_ADMIN', 'EDITOR']);
  if ('errorResponse' in auth) return auth.errorResponse;

  try {
    const items = await prisma.menuItem.findMany({
      include: {
        category: {
          select: {
            id: true,
            nameVi: true,
            nameEn: true,
          },
        },
      },
      orderBy: [{ categoryId: 'asc' }, { name: 'asc' }],
    });

    return apiSuccess(items);
  } catch (error) {
    console.error('[Admin Inventory GET Error]:', error);
    return apiError('Lỗi tải danh mục kho & sản phẩm', 500);
  }
}

export async function PATCH(req: NextRequest) {
  const auth = await requireAuth(req, ['SUPER_ADMIN', 'EDITOR']);
  if ('errorResponse' in auth) return auth.errorResponse;

  try {
    const body = await req.json();
    const {
      id,
      inStock,
      allowOrdering,
      trackInventory,
      stockQuantity,
      sku,
      productType,
      optionGroups,
    } = body;

    if (!id) {
      return apiError('Vui lòng chỉ định mã ID sản phẩm', 400);
    }

    const existing = await prisma.menuItem.findUnique({
      where: { id },
    });

    if (!existing) {
      return apiError('Không tìm thấy sản phẩm trong thực đơn', 404);
    }

    const updateData: any = {};
    if (inStock !== undefined) updateData.inStock = Boolean(inStock);
    if (allowOrdering !== undefined) updateData.allowOrdering = Boolean(allowOrdering);
    if (trackInventory !== undefined) updateData.trackInventory = Boolean(trackInventory);
    if (stockQuantity !== undefined) updateData.stockQuantity = Math.max(0, parseInt(stockQuantity, 10) || 0);
    if (sku !== undefined) updateData.sku = sku ? String(sku).trim() : null;
    if (productType !== undefined) updateData.productType = productType;
    if (optionGroups !== undefined) updateData.optionGroups = optionGroups;

    const updated = await prisma.menuItem.update({
      where: { id },
      data: updateData,
    });

    revalidatePath('/', 'layout');

    await logAction({
      level: 'INFO',
      category: 'CMS',
      action: 'UPDATE_INVENTORY_SETTINGS',
      actor: auth.user.username,
      details: `Cập nhật tồn kho & cấu hình món "${existing.name}": Còn hàng=${updated.inStock}, Cho phép đặt=${updated.allowOrdering}, Quản lý kho=${updated.trackInventory}, Số lượng=${updated.stockQuantity}`,
    });

    return apiSuccess(updated, 'Cập nhật kho và cấu hình món thành công!');
  } catch (error) {
    console.error('[Admin Inventory PATCH Error]:', error);
    return apiError('Lỗi cập nhật cấu hình kho sản phẩm', 500);
  }
}

