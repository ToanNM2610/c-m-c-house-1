import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { apiSuccess, apiError } from '@/lib/api-response';
import { requireModuleAuth } from '@/lib/auth';
import { recordAuditLog } from '@/lib/audit';

export const dynamic = 'force-dynamic';

function buildOrderCode() {
  const now = new Date();
  const y = String(now.getFullYear()).slice(-2);
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `CCH-${y}${m}${d}-${rand}`;
}

export async function GET(req: NextRequest) {
  const auth = await requireModuleAuth(req, 'orders');
  if ('errorResponse' in auth) return auth.errorResponse;

  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const source = searchParams.get('source');
    const q = searchParams.get('q')?.trim();

    const where: Record<string, unknown> = {};
    if (status && status !== 'ALL') where.orderStatus = status;
    if (source && source !== 'ALL') where.source = source;
    if (q) {
      where.OR = [
        { orderCode: { contains: q, mode: 'insensitive' } },
        { customerName: { contains: q, mode: 'insensitive' } },
        { customerPhone: { contains: q, mode: 'insensitive' } },
      ];
    }

    const orders = await prisma.order.findMany({
      where,
      include: {
        items: true,
        payments: { orderBy: { createdAt: 'desc' } },
        shipments: { orderBy: { createdAt: 'desc' } },
      },
      orderBy: { createdAt: 'desc' },
      take: 150,
    });

    return apiSuccess(orders);
  } catch (error) {
    console.error('Error listing orders:', error);
    return apiError('Không thể tải danh sách đơn hàng', 500);
  }
}

export async function POST(req: NextRequest) {
  const auth = await requireModuleAuth(req, 'orders');
  if ('errorResponse' in auth) return auth.errorResponse;

  try {
    const body = await req.json();
    const {
      source = 'ZALO',
      fulfillmentType = 'DELIVERY',
      customerName,
      customerPhone,
      customerEmail,
      shippingAddress,
      scheduledTime,
      customerNote,
      paymentMethod = 'VIETQR',
      paymentStatus = 'UNPAID',
      shippingFee = 0,
      discountAmount = 0,
      items,
    } = body;

    if (!customerName || !customerPhone || !Array.isArray(items) || items.length === 0) {
      return apiError('Vui lòng nhập tên khách, số điện thoại và ít nhất 1 món', 400);
    }

    const created = await prisma.$transaction(async (tx) => {
      const orderCode = buildOrderCode();
      let subtotal = 0;
      let costTotal = 0;
      const orderItemsData: any[] = [];

      for (const reqItem of items) {
        const menu = await tx.menuItem.findUnique({ where: { id: reqItem.menuItemId } });
        if (!menu) throw new Error(`Không tìm thấy món ${reqItem.menuItemId}`);
        const qty = Math.max(1, Math.round(Number(reqItem.quantity) || 1));
        const unitPrice =
          menu.salePriceVnd && menu.salePriceVnd < (menu.priceVnd || menu.price)
            ? menu.salePriceVnd
            : Math.round(menu.priceVnd || menu.price || 0);
        const costPrice = Math.round(menu.costPriceVnd || 0);
        const lineTotal = unitPrice * qty;
        subtotal += lineTotal;
        costTotal += costPrice * qty;

        orderItemsData.push({
          menuItemId: menu.id,
          itemNameVi: menu.vietnameseTitle || menu.nameVi || menu.name || menu.id,
          itemNameEn: menu.nameEn || null,
          unitPrice,
          costPrice,
          quantity: qty,
          itemNote: reqItem.itemNote || null,
          lineTotal,
        });

        // Reserve stock immediately if tracked
        if (menu.trackInventory) {
          const available = (menu.stockQuantity || 0) - (menu.stockReserved || 0);
          if (available < qty) {
            throw new Error(`Món "${menu.vietnameseTitle || menu.nameVi}" chỉ còn ${available} phần trong kho`);
          }
          await tx.menuItem.update({
            where: { id: menu.id },
            data: { stockReserved: { increment: qty } },
          });
          await tx.stockMovement.create({
            data: {
              menuItemId: menu.id,
              type: 'RESERVE',
              quantity: -qty,
              beforeQty: menu.stockQuantity,
              afterQty: menu.stockQuantity,
              note: `Giữ chỗ đơn ${orderCode}`,
              referenceId: orderCode,
              actorUsername: auth.user.username,
            },
          });
        }
      }

      const cs = await tx.commerceSettings.findUnique({ where: { id: 'commerce-settings' } }).catch(() => null);
      const vatPct = cs?.vatPercent || 0;
      const safeShip = Math.max(0, Math.round(Number(shippingFee) || 0));
      const safeDisc = Math.max(0, Math.round(Number(discountAmount) || 0));
      const taxable = Math.max(0, subtotal - safeDisc);
      const taxAmount = Math.round((taxable * vatPct) / 100);
      const totalAmount = taxable + safeShip + taxAmount;

      // Auto-upsert Customer 360° by phone
      const cleanPhone = String(customerPhone).trim();
      let customer = await tx.customer.findUnique({ where: { phone: cleanPhone } }).catch(() => null);
      if (!customer) {
        customer = await tx.customer.create({
          data: {
            phone: cleanPhone,
            email: customerEmail || null,
            fullName: String(customerName).trim(),
            segment: 'NEW',
          },
        });
      }

      const order = await tx.order.create({
        data: {
          orderCode,
          customerId: customer.id,
          source,
          fulfillmentType,
          scheduledTime: scheduledTime || null,
          customerName: String(customerName).trim(),
          customerPhone: cleanPhone,
          customerEmail: customerEmail || null,
          shippingAddress: shippingAddress || null,
          customerNote: customerNote || null,
          subtotal,
          shippingFee: safeShip,
          discountAmount: safeDisc,
          taxAmount,
          costTotal,
          totalAmount,
          paymentMethod,
          paymentStatus,
          paidAt: paymentStatus === 'PAID' ? new Date() : null,
          orderStatus: 'CONFIRMED',
          items: { create: orderItemsData },
          payments: {
            create: {
              method: paymentMethod,
              amount: totalAmount,
              status: paymentStatus === 'PAID' ? 'PAID' : 'PENDING',
              verifiedBy: paymentStatus === 'PAID' ? auth.user.username : null,
              verifiedAt: paymentStatus === 'PAID' ? new Date() : null,
            },
          },
          shipments:
            fulfillmentType === 'DELIVERY'
              ? {
                  create: {
                    carrier: 'SELF_DELIVERY',
                    status: 'READY',
                    shippingFee: safeShip,
                  },
                }
              : undefined,
        },
        include: { items: true, payments: true, shipments: true },
      });

      return order;
    });

    await recordAuditLog({
      action: 'ORDER_CREATE_MANUAL',
      module: 'OMS',
      recordId: created.id,
      details: `${created.orderCode} source=${created.source} total=${created.totalAmount}`,
      user: auth.user,
      req,
    });

    return apiSuccess(created, { message: `Đã tạo đơn ${created.orderCode}` }, 201);
  } catch (error: any) {
    console.error('Error creating manual order:', error);
    return apiError(error?.message || 'Lỗi tạo đơn hàng thủ công', 400);
  }
}

export async function PATCH(req: NextRequest) {
  const auth = await requireModuleAuth(req, 'orders');
  if ('errorResponse' in auth) return auth.errorResponse;

  try {
    const body = await req.json();
    const {
      id,
      orderStatus,
      paymentStatus,
      paymentRef,
      adminNote,
      cancelReason,
      carrier,
      trackingCode,
      shipmentStatus,
    } = body;

    if (!id) return apiError('Thiếu mã đơn hàng (id)', 400);

    const updated = await prisma.$transaction(async (tx) => {
      const existing = await tx.order.findUnique({
        where: { id },
        include: { items: true, shipments: true, payments: true },
      });
      if (!existing) throw new Error('Không tìm thấy đơn hàng');

      const updateData: Record<string, unknown> = {};
      if (adminNote !== undefined) updateData.adminNote = adminNote;
      if (cancelReason !== undefined) updateData.cancelReason = cancelReason;
      if (paymentRef !== undefined) updateData.paymentRef = paymentRef;

      if (paymentStatus && paymentStatus !== existing.paymentStatus) {
        updateData.paymentStatus = paymentStatus;
        if (paymentStatus === 'PAID' && !existing.paidAt) {
          updateData.paidAt = new Date();
        }
        await tx.paymentTransaction.create({
          data: {
            orderId: existing.id,
            method: existing.paymentMethod,
            amount: existing.totalAmount,
            status: paymentStatus === 'PAID' ? 'PAID' : paymentStatus === 'REFUNDED' ? 'REFUNDED' : 'PENDING',
            referenceCode: paymentRef || null,
            verifiedBy: auth.user.username,
            verifiedAt: paymentStatus === 'PAID' ? new Date() : null,
          },
        });
      }

      if (orderStatus && orderStatus !== existing.orderStatus) {
        updateData.orderStatus = orderStatus;

        // Release reserved / restore stock if transitioning to CANCELLED or RETURNED
        if (
          (orderStatus === 'CANCELLED' || orderStatus === 'RETURNED') &&
          existing.orderStatus !== 'CANCELLED' &&
          existing.orderStatus !== 'RETURNED'
        ) {
          for (const item of existing.items) {
            if (!item.menuItemId) continue;
            const m = await tx.menuItem.findUnique({ where: { id: item.menuItemId } });
            if (!m || !m.trackInventory) continue;

            if (existing.orderStatus === 'COMPLETED') {
              await tx.menuItem.update({
                where: { id: m.id },
                data: { stockQuantity: { increment: item.quantity } },
              });
              await tx.stockMovement.create({
                data: {
                  menuItemId: m.id,
                  type: 'IN',
                  quantity: item.quantity,
                  beforeQty: m.stockQuantity,
                  afterQty: m.stockQuantity + item.quantity,
                  note: `Hoàn kho đơn ${existing.orderCode} (${orderStatus})`,
                  referenceId: existing.orderCode,
                  actorUsername: auth.user.username,
                },
              });
            } else {
              const dec = Math.min(m.stockReserved || 0, item.quantity);
              await tx.menuItem.update({
                where: { id: m.id },
                data: { stockReserved: { decrement: dec } },
              });
              await tx.stockMovement.create({
                data: {
                  menuItemId: m.id,
                  type: 'RELEASE',
                  quantity: dec,
                  beforeQty: m.stockQuantity,
                  afterQty: m.stockQuantity,
                  note: `Hủy giữ chỗ đơn ${existing.orderCode}`,
                  referenceId: existing.orderCode,
                  actorUsername: auth.user.username,
                },
              });
            }
          }
        }

        // Finalize deduction & award loyalty + update customer spend when transitioning to COMPLETED
        if (orderStatus === 'COMPLETED' && existing.orderStatus !== 'COMPLETED') {
          for (const item of existing.items) {
            if (!item.menuItemId) continue;
            const m = await tx.menuItem.findUnique({ where: { id: item.menuItemId } });
            if (!m) continue;
            const updates: Record<string, unknown> = {
              orderCount: { increment: item.quantity },
            };
            if (m.trackInventory) {
              const decReserve = Math.min(m.stockReserved || 0, item.quantity);
              const nextStock = Math.max(0, (m.stockQuantity || 0) - item.quantity);
              updates.stockReserved = { decrement: decReserve };
              updates.stockQuantity = nextStock;
              await tx.stockMovement.create({
                data: {
                  menuItemId: m.id,
                  type: 'OUT',
                  quantity: -item.quantity,
                  beforeQty: m.stockQuantity,
                  afterQty: nextStock,
                  note: `Xuất bán đơn ${existing.orderCode}`,
                  referenceId: existing.orderCode,
                  actorUsername: auth.user.username,
                },
              });
            }
            await tx.menuItem.update({ where: { id: m.id }, data: updates });
          }

          if (existing.customerId) {
            const pointsEarned = Math.floor((existing.totalAmount || 0) / 10000);
            await tx.customer.update({
              where: { id: existing.customerId },
              data: {
                totalSpent: { increment: existing.totalAmount },
                orderCount: { increment: 1 },
                loyaltyPoints: { increment: pointsEarned },
              },
            });
            if (pointsEarned > 0) {
              await tx.loyaltyTransaction.create({
                data: {
                  customerId: existing.customerId,
                  points: pointsEarned,
                  type: 'EARN',
                  reason: `Tích điểm đơn ${existing.orderCode}`,
                  orderId: existing.id,
                  actor: auth.user.username,
                },
              });
            }
          }
        }
      }

      if (carrier !== undefined || trackingCode !== undefined || shipmentStatus !== undefined) {
        const latestShip = existing.shipments[0];
        if (latestShip) {
          await tx.shipment.update({
            where: { id: latestShip.id },
            data: {
              carrier: carrier ?? undefined,
              trackingCode: trackingCode ?? undefined,
              status: shipmentStatus ?? undefined,
              shippedAt: shipmentStatus === 'IN_TRANSIT' ? new Date() : undefined,
              deliveredAt: shipmentStatus === 'DELIVERED' ? new Date() : undefined,
            },
          });
        } else {
          await tx.shipment.create({
            data: {
              orderId: existing.id,
              carrier: carrier || 'SELF_DELIVERY',
              trackingCode: trackingCode || null,
              status: shipmentStatus || 'READY',
              shippingFee: existing.shippingFee,
            },
          });
        }
      }

      return tx.order.update({
        where: { id: existing.id },
        data: updateData,
        include: { items: true, payments: true, shipments: true },
      });
    });

    await recordAuditLog({
      action: 'ORDER_UPDATE',
      module: 'OMS',
      recordId: id,
      details: `status=${orderStatus || '-'} pay=${paymentStatus || '-'}`,
      user: auth.user,
      req,
    });

    return apiSuccess(updated, { message: 'Cập nhật đơn hàng thành công' });
  } catch (error: any) {
    console.error('Error updating order:', error);
    return apiError(error?.message || 'Lỗi cập nhật đơn hàng', 400);
  }
}
