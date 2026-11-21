import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { apiSuccess, apiError } from '@/lib/api-response';
import { getCustomerSessionUser } from '@/lib/customerAuth';
import { logAction } from '@/lib/logger';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const customer = await getCustomerSessionUser(req);
    if (!customer) {
      return apiError('Yêu cầu đăng nhập tài khoản khách hàng', 401);
    }

    const orders = await prisma.order.findMany({
      where: {
        OR: [
          { customerId: customer.id },
          { customerEmail: customer.email },
          ...(customer.phone ? [{ customerPhone: customer.phone }] : []),
        ],
      },
      include: {
        items: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return apiSuccess(orders);
  } catch (error) {
    console.error('[Customer Orders GET API Error]:', error);
    return apiError('Lỗi tải danh sách lịch sử đơn hàng', 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const customer = await getCustomerSessionUser(req);
    if (!customer) {
      return apiError('Yêu cầu đăng nhập tài khoản khách hàng', 401);
    }

    const body = await req.json();
    const { action, orderCode, cancelReason } = body;

    if (!orderCode) {
      return apiError('Vui lòng cung cấp mã đơn hàng', 400);
    }

    const order = await prisma.order.findUnique({
      where: { orderCode },
      include: { items: true },
    });

    if (!order) {
      return apiError('Không tìm thấy thông tin đơn hàng', 404);
    }

    // Security check: verify customer ownership
    const isOwner =
      order.customerId === customer.id ||
      (order.customerEmail && order.customerEmail.toLowerCase() === customer.email.toLowerCase()) ||
      (customer.phone && order.customerPhone === customer.phone);

    if (!isOwner) {
      return apiError('Bạn không có quyền thao tác trên đơn hàng này', 403);
    }

    if (action === 'CANCEL') {
      if (order.orderStatus !== 'PENDING') {
        return apiError(
          'Chỉ có thể hủy đơn hàng khi quán chưa bắt đầu chuẩn bị (trạng thái Chờ xác nhận). Vui lòng liên hệ Hotline 038 285 1688 để được hỗ trợ.',
          400
        );
      }

      const updated = await prisma.$transaction(async (tx) => {
        // Restore inventory for items that track inventory
        for (const item of order.items) {
          if (item.menuItemId) {
            const dbItem = await tx.menuItem.findUnique({
              where: { id: item.menuItemId },
            });
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

        // Adjust customer totalSpent and orderCount
        if (order.customerId) {
          await tx.customer.update({
            where: { id: order.customerId },
            data: {
              totalSpent: { decrement: order.totalAmount },
              orderCount: { decrement: 1 },
            },
          });
        }

        return tx.order.update({
          where: { orderCode },
          data: {
            orderStatus: 'CANCELLED',
            cancelReason: cancelReason ? String(cancelReason).slice(0, 300) : 'Khách hàng chủ động hủy qua trang cá nhân',
          },
        });
      });

      await logAction({
        level: 'INFO',
        category: 'SYSTEM',
        action: 'CUSTOMER_CANCELLED_ORDER',
        details: `Khách hàng ${customer.fullName} (#${customer.id}) đã hủy đơn hàng #${orderCode}`,
      });

      return apiSuccess({
        orderCode: updated.orderCode,
        orderStatus: updated.orderStatus,
        cancelReason: updated.cancelReason,
      }, 'Hủy đơn hàng thành công');
    }

    if (action === 'REORDER') {
      // Return normalized cart items for reordering
      const reorderItems = order.items.map((item) => ({
        menuItemId: item.menuItemId,
        nameVi: item.itemNameVi,
        nameEn: item.itemNameEn,
        unitPrice: item.unitPrice,
        basePrice: item.unitPrice,
        quantity: item.quantity,
        selectedOptions: item.selectedOptions,
        itemNote: item.itemNote,
      }));

      return apiSuccess({
        reorderItems,
        orderCode: order.orderCode,
      }, 'Dữ liệu đơn hàng đã sẵn sàng để thêm vào giỏ hàng');
    }

    return apiError('Hành động không hợp lệ (action phải là CANCEL hoặc REORDER)', 400);
  } catch (error) {
    console.error('[Customer Orders POST Action API Error]:', error);
    return apiError('Lỗi xử lý thao tác trên đơn hàng', 500);
  }
}

