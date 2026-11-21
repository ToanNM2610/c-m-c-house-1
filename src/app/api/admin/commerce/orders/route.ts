import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { apiSuccess, apiError } from '@/lib/api-response';
import { requireAuth } from '@/lib/auth';
import { logAction } from '@/lib/logger';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const auth = await requireAuth(req, ['SUPER_ADMIN', 'EDITOR']);
  if ('errorResponse' in auth) return auth.errorResponse;

  try {
    const { searchParams } = new URL(req.url);
    const orderStatus = searchParams.get('orderStatus');
    const paymentStatus = searchParams.get('paymentStatus');
    const fulfillmentType = searchParams.get('fulfillmentType');
    const search = searchParams.get('search')?.trim();
    const dateFrom = searchParams.get('dateFrom');
    const dateTo = searchParams.get('dateTo');
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.max(1, Math.min(100, parseInt(searchParams.get('limit') || '20', 10)));
    const skip = (page - 1) * limit;

    const where: any = {};

    if (orderStatus && orderStatus !== 'ALL') {
      where.orderStatus = orderStatus;
    }

    if (paymentStatus && paymentStatus !== 'ALL') {
      where.paymentStatus = paymentStatus;
    }

    if (fulfillmentType && fulfillmentType !== 'ALL') {
      where.fulfillmentType = fulfillmentType;
    }

    if (search) {
      where.OR = [
        { orderCode: { contains: search, mode: 'insensitive' } },
        { customerName: { contains: search, mode: 'insensitive' } },
        { customerPhone: { contains: search, mode: 'insensitive' } },
        { customerEmail: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (dateFrom || dateTo) {
      where.createdAt = {};
      if (dateFrom) {
        where.createdAt.gte = new Date(dateFrom);
      }
      if (dateTo) {
        const to = new Date(dateTo);
        to.setHours(23, 59, 59, 999);
        where.createdAt.lte = to;
      }
    }

    const [total, orders, pendingCount, paidRevenue] = await Promise.all([
      prisma.order.count({ where }),
      prisma.order.findMany({
        where,
        include: {
          items: true,
          customer: {
            select: {
              id: true,
              fullName: true,
              email: true,
              phone: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.order.count({
        where: { orderStatus: 'PENDING' },
      }),
      prisma.order.aggregate({
        _sum: { totalAmount: true },
        where: { paymentStatus: 'PAID' },
      }),
    ]);

    return apiSuccess({
      orders,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      summary: {
        totalOrders: total,
        pendingOrdersCount: pendingCount,
        totalPaidRevenue: paidRevenue._sum.totalAmount || 0,
      },
    });
  } catch (error) {
    console.error('[Admin Commerce Orders GET Error]:', error);
    return apiError('Lỗi truy vấn danh sách đơn hàng', 500);
  }
}

export async function PATCH(req: NextRequest) {
  const auth = await requireAuth(req, ['SUPER_ADMIN', 'EDITOR']);
  if ('errorResponse' in auth) return auth.errorResponse;

  try {
    const body = await req.json();
    const { id, orderStatus, paymentStatus, adminNote, cancelReason } = body;

    if (!id) {
      return apiError('Vui lòng cung cấp mã ID đơn hàng', 400);
    }

    const existing = await prisma.order.findUnique({
      where: { id },
      include: { items: true },
    });

    if (!existing) {
      return apiError('Không tìm thấy đơn hàng cần cập nhật', 404);
    }

    const updateData: any = {};
    if (adminNote !== undefined) updateData.adminNote = adminNote;
    if (cancelReason !== undefined) updateData.cancelReason = cancelReason;

    // Handle status transitions and inventory restoration
    const isNowCancelled = orderStatus === 'CANCELLED' && existing.orderStatus !== 'CANCELLED';
    const isUncancelling = existing.orderStatus === 'CANCELLED' && orderStatus && orderStatus !== 'CANCELLED';

    if (orderStatus) updateData.orderStatus = orderStatus;
    if (paymentStatus) {
      updateData.paymentStatus = paymentStatus;
      if (paymentStatus === 'PAID' && !existing.paidAt) {
        updateData.paidAt = new Date();
      }
    }

    const updated = await prisma.$transaction(async (tx) => {
      // 1. If cancelling an active order, restore inventory
      if (isNowCancelled) {
        for (const item of existing.items) {
          if (item.menuItemId) {
            const dbItem = await tx.menuItem.findUnique({ where: { id: item.menuItemId } });
            if (dbItem && dbItem.trackInventory) {
              await tx.menuItem.update({
                where: { id: dbItem.id },
                data: {
                  stockQuantity: { increment: item.quantity },
                  orderCount: { decrement: item.quantity },
                },
              });
            }
          }
        }
      }

      // 2. If reactivating a cancelled order, re-decrement inventory
      if (isUncancelling) {
        for (const item of existing.items) {
          if (item.menuItemId) {
            const dbItem = await tx.menuItem.findUnique({ where: { id: item.menuItemId } });
            if (dbItem && dbItem.trackInventory) {
              await tx.menuItem.update({
                where: { id: dbItem.id },
                data: {
                  stockQuantity: { decrement: item.quantity },
                  orderCount: { increment: item.quantity },
                },
              });
            }
          }
        }
      }

      return tx.order.update({
        where: { id },
        data: updateData,
        include: { items: true },
      });
    });

    await logAction({
      level: 'INFO',
      category: 'CMS',
      action: 'UPDATE_COMMERCE_ORDER',
      actor: auth.user.username,
      details: `Cập nhật đơn hàng #${existing.orderCode}: trạng thái [${existing.orderStatus} -> ${updated.orderStatus}], thanh toán [${existing.paymentStatus} -> ${updated.paymentStatus}]`,
    });

    return apiSuccess(updated, 'Cập nhật trạng thái đơn hàng thành công!');
  } catch (error) {
    console.error('[Admin Commerce Orders PATCH Error]:', error);
    return apiError('Lỗi cập nhật đơn hàng', 500);
  }
}

