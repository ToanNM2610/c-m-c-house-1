import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { apiSuccess, apiError } from '@/lib/api-response';
import { requireCommerceEnabled } from '@/lib/commerce-guard';
import { getCustomerSessionUser } from '@/lib/customerAuth';
import { generateVietQrUrl } from '@/lib/vietqr';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const block = await requireCommerceEnabled();
  if (block) return block;

  try {
    const body = await req.json();
    const {
      fulfillmentType = 'DELIVERY',
      scheduledTime,
      customerName,
      customerPhone,
      customerEmail,
      shippingAddress,
      shippingZoneId,
      customerNote,
      paymentMethod = 'VIETQR',
      voucherCode,
      items,
      honeypot,
    } = body;

    if (honeypot) {
      return apiError('Yêu cầu không hợp lệ', 400);
    }

    if (!customerName || !customerPhone || !Array.isArray(items) || items.length === 0) {
      return apiError('Vui lòng điền họ tên, số điện thoại và chọn ít nhất 1 món', 400);
    }

    const sessionCustomer = await getCustomerSessionUser(req).catch(() => null);

    const created = await prisma.$transaction(async (tx) => {
      const orderCode = `CCH-${new Date().toISOString().slice(2, 10).replace(/-/g, '')}-${Math.random()
        .toString(36)
        .substring(2, 6)
        .toUpperCase()}`;

      let subtotal = 0;
      let costTotal = 0;
      const orderItemsData: any[] = [];

      for (const reqItem of items) {
        const menu = await tx.menuItem.findUnique({ where: { id: reqItem.menuItemId } });
        if (!menu || !menu.isVisible || !menu.isAvailable || !menu.allowOrdering) {
          throw new Error(`Món "${reqItem.menuItemId}" hiện không khả dụng`);
        }

        const qty = Math.max(1, Math.min(50, Math.round(Number(reqItem.quantity) || 1)));
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
          selectedOptions: reqItem.selectedOptions || null,
          itemNote: reqItem.itemNote || null,
          lineTotal,
        });

        if (menu.trackInventory) {
          const available = (menu.stockQuantity || 0) - (menu.stockReserved || 0);
          if (available < qty) {
            throw new Error(`Món "${menu.vietnameseTitle || menu.nameVi}" chỉ còn ${available} phần`);
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
            },
          });
        }
      }

      const cs = await tx.commerceSettings.findUnique({ where: { id: 'commerce-settings' } }).catch(() => null);
      let shippingFee = 0;
      if (fulfillmentType === 'DELIVERY' && shippingZoneId) {
        const zone = await tx.shippingZone.findUnique({ where: { id: shippingZoneId } });
        if (zone && zone.isActive) {
          const freeAt = zone.freeShipThreshold ?? cs?.defaultFreeShipThreshold ?? 300000;
          shippingFee = subtotal >= freeAt ? 0 : zone.fee;
        }
      }

      let discountAmount = 0;
      let appliedVoucherCode: string | null = null;
      if (voucherCode) {
        const cleanVoucher = String(voucherCode).trim().toUpperCase();
        const v = await tx.voucher.findUnique({ where: { code: cleanVoucher } });
        const now = new Date();
        if (
          v &&
          v.isActive &&
          (!v.startsAt || v.startsAt <= now) &&
          (!v.expiresAt || v.expiresAt >= now) &&
          (v.usageLimit === null || v.usedCount < v.usageLimit) &&
          subtotal >= v.minOrderAmount
        ) {
          appliedVoucherCode = v.code;
          if (v.discountType === 'PERCENT') {
            discountAmount = Math.round((subtotal * v.discountValue) / 100);
            if (v.maxDiscount && discountAmount > v.maxDiscount) discountAmount = v.maxDiscount;
          } else if (v.discountType === 'FIXED') {
            discountAmount = Math.min(subtotal, v.discountValue);
          } else if (v.discountType === 'FREE_SHIP') {
            shippingFee = 0;
          }
          await tx.voucher.update({
            where: { id: v.id },
            data: { usedCount: { increment: 1 } },
          });
        }
      }

      const vatPct = cs?.vatPercent || 0;
      const taxable = Math.max(0, subtotal - discountAmount);
      const taxAmount = Math.round((taxable * vatPct) / 100);
      const totalAmount = taxable + shippingFee + taxAmount;

      const cleanPhone = String(customerPhone).trim();
      let customer =
        sessionCustomer ||
        (await tx.customer.findUnique({ where: { phone: cleanPhone } }).catch(() => null));
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
          source: 'WEB',
          fulfillmentType,
          scheduledTime: scheduledTime || null,
          customerName: String(customerName).trim(),
          customerPhone: cleanPhone,
          customerEmail: customerEmail || null,
          shippingAddress: shippingAddress || null,
          customerNote: customerNote || null,
          subtotal,
          shippingFee,
          discountAmount,
          taxAmount,
          costTotal,
          totalAmount,
          voucherCode: appliedVoucherCode,
          paymentMethod,
          paymentStatus: 'UNPAID',
          orderStatus: 'PENDING',
          items: { create: orderItemsData },
          payments: {
            create: {
              method: paymentMethod,
              amount: totalAmount,
              status: 'PENDING',
            },
          },
        },
        include: { items: true },
      });

      const vietQrUrl =
        paymentMethod === 'VIETQR' && cs
          ? generateVietQrUrl({
              bankId: cs.bankId || 'MB',
              accountNo: cs.bankAccountNo || '0382851688',
              accountName: cs.bankAccountName || 'CAM CU HOUSE',
              amount: totalAmount,
              memo: orderCode,
              template: cs.vietQrTemplate || 'compact2',
            })
          : null;

      return { order, vietQrUrl };
    });

    return apiSuccess(created, { message: `Đặt đơn thành công: ${created.order.orderCode}` }, 201);
  } catch (error: any) {
    console.error('Error creating storefront order:', error);
    return apiError(error?.message || 'Không thể tạo đơn hàng', 400);
  }
}
