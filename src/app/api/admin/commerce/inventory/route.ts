import { NextRequest } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { apiSuccess, apiError } from '@/lib/api-response';
import { requireModuleAuth } from '@/lib/auth';
import { canViewCostPrice } from '@/lib/rbac';
import { recordAuditLog } from '@/lib/audit';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const auth = await requireModuleAuth(req, 'inventory');
  if ('errorResponse' in auth) return auth.errorResponse;

  try {
    const showCost = canViewCostPrice(auth.user.role);

    const [items, movements] = await Promise.all([
      prisma.menuItem.findMany({
        orderBy: [{ categoryId: 'asc' }, { sortOrder: 'asc' }, { id: 'asc' }],
        select: {
          id: true,
          categoryId: true,
          sku: true,
          nameVi: true,
          vietnameseTitle: true,
          name: true,
          priceVnd: true,
          salePriceVnd: true,
          costPriceVnd: true,
          price: true,
          productType: true,
          trackInventory: true,
          stockQuantity: true,
          stockReserved: true,
          lowStockThreshold: true,
          isAvailable: true,
          inStock: true,
          allowOrdering: true,
          isVisible: true,
        },
      }),
      prisma.stockMovement.findMany({
        take: 100,
        orderBy: { createdAt: 'desc' },
        include: {
          menuItem: {
            select: { nameVi: true, vietnameseTitle: true, sku: true },
          },
        },
      }),
    ]);

    const safeItems = items.map((item) => ({
      ...item,
      displayName: item.vietnameseTitle || item.nameVi || item.name || item.id,
      costPriceVnd: showCost ? item.costPriceVnd : undefined,
      availableToSell: Math.max(0, (item.stockQuantity || 0) - (item.stockReserved || 0)),
      isLowStock: Boolean(item.trackInventory && item.stockQuantity <= item.lowStockThreshold),
    }));

    return apiSuccess({
      items: safeItems,
      movements,
      canViewCostPrice: showCost,
    });
  } catch (error) {
    console.error('Error fetching inventory:', error);
    return apiError('Không thể tải dữ liệu kho hàng', 500);
  }
}

export async function POST(req: NextRequest) {
  const auth = await requireModuleAuth(req, 'inventory');
  if ('errorResponse' in auth) return auth.errorResponse;

  try {
    const body = await req.json();
    const {
      menuItemId,
      type, // 'IN' | 'OUT' | 'ADJUST'
      quantity,
      note,
      trackInventory,
      lowStockThreshold,
      sku,
      costPriceVnd,
    } = body;

    if (!menuItemId) {
      return apiError('Thiếu mã sản phẩm (menuItemId)', 400);
    }

    const result = await prisma.$transaction(async (tx) => {
      const existing = await tx.menuItem.findUnique({ where: { id: menuItemId } });
      if (!existing) throw new Error('Không tìm thấy sản phẩm trong kho');

      const updates: Record<string, unknown> = {};
      if (typeof trackInventory === 'boolean') updates.trackInventory = trackInventory;
      if (typeof lowStockThreshold === 'number') updates.lowStockThreshold = Math.max(0, Math.round(lowStockThreshold));
      if (sku !== undefined) updates.sku = sku || null;
      if (costPriceVnd !== undefined && canViewCostPrice(auth.user.role)) {
        updates.costPriceVnd = Math.max(0, Math.round(Number(costPriceVnd)));
      }

      const qtyInt = Math.round(Number(quantity) || 0);
      const beforeQty = existing.stockQuantity || 0;
      let afterQty = beforeQty;

      if (type && ['IN', 'OUT', 'ADJUST'].includes(type)) {
        if (type === 'IN') {
          if (qtyInt <= 0) throw new Error('Số lượng nhập kho phải > 0');
          afterQty = beforeQty + qtyInt;
        } else if (type === 'OUT') {
          if (qtyInt <= 0) throw new Error('Số lượng xuất kho phải > 0');
          afterQty = Math.max(0, beforeQty - qtyInt);
        } else if (type === 'ADJUST') {
          if (qtyInt < 0) throw new Error('Tồn kho điều chỉnh không được âm');
          afterQty = qtyInt;
        }

        updates.stockQuantity = afterQty;
        updates.trackInventory = true;

        await tx.stockMovement.create({
          data: {
            menuItemId,
            type,
            quantity: type === 'OUT' ? -qtyInt : type === 'ADJUST' ? afterQty - beforeQty : qtyInt,
            beforeQty,
            afterQty,
            note: note || null,
            actorUsername: auth.user.username,
          },
        });
      }

      const updated = await tx.menuItem.update({
        where: { id: menuItemId },
        data: updates,
      });

      return updated;
    });

    await recordAuditLog({
      action: `INVENTORY_${type || 'CONFIG'}`,
      module: 'INVENTORY',
      recordId: menuItemId,
      details: `qty=${quantity ?? 'n/a'} note=${note || ''}`,
      user: auth.user,
      req,
    });

    revalidatePath('/', 'layout');
    return apiSuccess(
      {
        ...result,
        costPriceVnd: canViewCostPrice(auth.user.role) ? result.costPriceVnd : undefined,
      },
      { message: 'Cập nhật kho hàng thành công' }
    );
  } catch (error: any) {
    console.error('Error updating inventory:', error);
    return apiError(error?.message || 'Lỗi cập nhật kho hàng', 400);
  }
}
