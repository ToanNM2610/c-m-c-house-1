import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { apiSuccess, apiError } from '@/lib/api-response';
import { getCustomerSessionUser } from '@/lib/customerAuth';
import { sendOrderEmail } from '@/lib/mailer';

export const dynamic = 'force-dynamic';

function generateOrderCode(): string {
  const now = new Date();
  const yy = String(now.getFullYear()).slice(-2);
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const randomSuffix = Math.floor(1000 + Math.random() * 9000).toString();
  return `CCH-${yy}${mm}${dd}-${randomSuffix}`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      customerName,
      customerPhone,
      customerEmail,
      shippingAddress,
      fulfillmentType = 'DELIVERY',
      scheduledTime,
      customerNote,
      paymentMethod = 'VIETQR',
      voucherCode,
      shippingZoneId,
      items,
    } = body;

    // 1. Basic validation
    if (!customerName || typeof customerName !== 'string' || customerName.trim().length < 2) {
      return apiError('Vui lòng nhập họ và tên khách hàng (tối thiểu 2 ký tự)', 400);
    }

    const cleanPhone = (customerPhone || '').replace(/\s+/g, '');
    const phoneRegex = /^(0|\+84)(3|5|7|8|9)[0-9]{8}$/;
    if (!cleanPhone || !phoneRegex.test(cleanPhone)) {
      return apiError('Số điện thoại không hợp lệ. Vui lòng nhập số điện thoại Việt Nam (10 số)', 400);
    }

    if (!Array.isArray(items) || items.length === 0) {
      return apiError('Giỏ hàng trống. Vui lòng chọn ít nhất 1 món để đặt hàng', 400);
    }

    // 2. Commerce Settings Check
    const settings = await prisma.commerceSettings.findFirst();
    if (settings && !settings.commerceEnabled) {
      return apiError('Hệ thống đặt món trực tuyến đang tạm ngưng phục vụ. Quý khách vui lòng gọi Hotline 038 285 1688 để được hỗ trợ.', 400);
    }

    if (fulfillmentType === 'DELIVERY' && settings && !settings.enableDelivery) {
      return apiError('Dịch vụ giao hàng tận nơi đang tạm ngưng', 400);
    }
    if (fulfillmentType === 'PICKUP' && settings && !settings.enablePickup) {
      return apiError('Dịch vụ nhận món tại quán đang tạm ngưng', 400);
    }
    if (fulfillmentType === 'DINE_IN_BBQ' && settings && !settings.enableDineInBbq) {
      return apiError('Dịch vụ thưởng thức tại suối & BBQ đang tạm ngưng đặt trước', 400);
    }

    if (paymentMethod === 'COD' && settings && !settings.enableCod) {
      return apiError('Phương thức thanh toán tiền mặt (COD) đang tạm ngưng', 400);
    }
    if (paymentMethod === 'VIETQR' && settings && !settings.enableVietQr) {
      return apiError('Phương thức thanh toán VietQR đang tạm ngưng', 400);
    }

    if (fulfillmentType === 'DELIVERY' && (!shippingAddress || shippingAddress.trim().length < 5)) {
      return apiError('Vui lòng cung cấp địa chỉ giao hàng cụ thể', 400);
    }

    // 3. Customer Session Link
    const currentCustomer = await getCustomerSessionUser(req);
    const customerId = currentCustomer ? currentCustomer.id : null;

    // 4. Validate and calculate Items strictly from PostgreSQL
    const itemIds = items.map((i: any) => i.menuItemId).filter(Boolean);
    const menuItems = await prisma.menuItem.findMany({
      where: { id: { in: itemIds } },
    });

    const menuItemMap = new Map(menuItems.map((m) => [m.id, m]));

    let calculatedSubtotal = 0;
    const orderItemsData: any[] = [];
    const stockUpdates: Array<{ id: string; decrement: number }> = [];

    for (const item of items) {
      const dbItem = menuItemMap.get(item.menuItemId);
      if (!dbItem) {
        return apiError(`Món có mã "${item.menuItemId}" không tồn tại trong thực đơn`, 400);
      }

      if (!dbItem.inStock || !dbItem.allowOrdering) {
        return apiError(`Món "${dbItem.name}" hiện đang hết hàng hoặc tạm ngưng phục vụ`, 400);
      }

      const quantity = Math.max(1, parseInt(item.quantity, 10) || 1);

      if (dbItem.trackInventory && dbItem.stockQuantity < quantity) {
        return apiError(
          `Món "${dbItem.name}" không đủ số lượng trong kho (chỉ còn ${dbItem.stockQuantity} phần)`,
          400
        );
      }

      // Calculate Option price deltas
      let optionsPriceDelta = 0;
      const optionsSnapshot: any[] = [];

      if (Array.isArray(item.selectedOptions)) {
        for (const opt of item.selectedOptions) {
          const delta = Math.max(0, parseInt(opt.priceDelta, 10) || 0);
          optionsPriceDelta += delta;
          optionsSnapshot.push({
            groupNameVi: opt.groupNameVi || '',
            groupNameEn: opt.groupNameEn || '',
            labelVi: opt.labelVi || '',
            labelEn: opt.labelEn || '',
            priceDelta: delta,
          });
        }
      }

      const unitPrice = Math.round(dbItem.price + optionsPriceDelta);
      const lineTotal = unitPrice * quantity;
      calculatedSubtotal += lineTotal;

      orderItemsData.push({
        menuItemId: dbItem.id,
        itemNameVi: dbItem.vietnameseTitle || dbItem.name,
        itemNameEn: dbItem.nameEn || dbItem.name,
        unitPrice,
        quantity,
        selectedOptions: optionsSnapshot.length > 0 ? optionsSnapshot : undefined,
        itemNote: item.itemNote ? String(item.itemNote).slice(0, 200) : null,
        lineTotal,
      });

      if (dbItem.trackInventory) {
        stockUpdates.push({ id: dbItem.id, decrement: quantity });
      }
    }

    // 5. Calculate Shipping Fee
    let calculatedShippingFee = 0;

    if (fulfillmentType === 'DELIVERY') {
      const defaultFreeThreshold = settings?.defaultFreeShipThreshold || 300000;
      let zoneFee = 25000;
      let freeShipThreshold = defaultFreeThreshold;

      if (shippingZoneId) {
        const zone = await prisma.shippingZone.findUnique({
          where: { id: shippingZoneId },
        });
        if (zone && zone.isActive) {
          zoneFee = zone.fee;
          if (zone.freeShipThreshold !== null && zone.freeShipThreshold !== undefined) {
            freeShipThreshold = zone.freeShipThreshold;
          }
        }
      }

      if (calculatedSubtotal >= freeShipThreshold) {
        calculatedShippingFee = 0;
      } else {
        calculatedShippingFee = zoneFee;
      }
    }

    // 6. Calculate Voucher Discount
    let calculatedDiscount = 0;
    let appliedVoucherId: string | null = null;
    let validVoucherCode: string | null = null;

    if (voucherCode && typeof voucherCode === 'string') {
      const cleanVoucher = voucherCode.trim().toUpperCase();
      const voucher = await prisma.voucher.findUnique({
        where: { code: cleanVoucher },
      });

      if (voucher && voucher.isActive) {
        const now = new Date();
        const isStarted = !voucher.startsAt || now >= new Date(voucher.startsAt);
        const isNotExpired = !voucher.expiresAt || now <= new Date(voucher.expiresAt);
        const hasUsageLeft = voucher.usageLimit === null || voucher.usedCount < voucher.usageLimit;
        const meetsMinOrder = calculatedSubtotal >= voucher.minOrderAmount;

        if (isStarted && isNotExpired && hasUsageLeft && meetsMinOrder) {
          appliedVoucherId = voucher.id;
          validVoucherCode = voucher.code;

          if (voucher.discountType === 'PERCENT') {
            calculatedDiscount = Math.round((calculatedSubtotal * voucher.discountValue) / 100);
            if (voucher.maxDiscount && calculatedDiscount > voucher.maxDiscount) {
              calculatedDiscount = voucher.maxDiscount;
            }
          } else if (voucher.discountType === 'FIXED') {
            calculatedDiscount = Math.min(calculatedSubtotal, voucher.discountValue);
          } else if (voucher.discountType === 'FREE_SHIP') {
            calculatedDiscount = Math.min(calculatedShippingFee, voucher.discountValue || calculatedShippingFee);
          }
        }
      }
    }

    const calculatedTotalAmount = Math.max(
      0,
      calculatedSubtotal + calculatedShippingFee - calculatedDiscount
    );

    const orderCode = generateOrderCode();

    // 7. Atomic Prisma Transaction
    const newOrder = await prisma.$transaction(async (tx) => {
      // Create Order & Items
      const created = await tx.order.create({
        data: {
          orderCode,
          customerId,
          fulfillmentType,
          scheduledTime: scheduledTime || null,
          customerName: customerName.trim(),
          customerPhone: cleanPhone,
          customerEmail: customerEmail ? customerEmail.trim() : null,
          shippingAddress: shippingAddress ? shippingAddress.trim() : null,
          customerNote: customerNote ? customerNote.trim() : null,
          subtotal: calculatedSubtotal,
          shippingFee: calculatedShippingFee,
          discountAmount: calculatedDiscount,
          totalAmount: calculatedTotalAmount,
          voucherCode: validVoucherCode,
          paymentMethod,
          paymentStatus: 'UNPAID',
          orderStatus: 'PENDING',
          items: {
            create: orderItemsData,
          },
        },
        include: {
          items: true,
        },
      });

      // Stock Decrement & orderCount increment
      for (const update of stockUpdates) {
        await tx.menuItem.update({
          where: { id: update.id },
          data: {
            stockQuantity: { decrement: update.decrement },
            orderCount: { increment: update.decrement },
          },
        });
      }

      // Voucher usage increment
      if (appliedVoucherId) {
        await tx.voucher.update({
          where: { id: appliedVoucherId },
          data: { usedCount: { increment: 1 } },
        });
      }

      // Customer stats update
      if (customerId) {
        await tx.customer.update({
          where: { id: customerId },
          data: {
            totalSpent: { increment: calculatedTotalAmount },
            orderCount: { increment: 1 },
          },
        });
      }

      return created;
    });

    // 8. Async Non-blocking Email Notification
    sendOrderEmail(newOrder).catch((err) => {
      console.error('[Async Order Email Notification Failed]:', err);
    });

    return apiSuccess({
      id: newOrder.id,
      orderCode: newOrder.orderCode,
      totalAmount: newOrder.totalAmount,
      subtotal: newOrder.subtotal,
      shippingFee: newOrder.shippingFee,
      discountAmount: newOrder.discountAmount,
      paymentMethod: newOrder.paymentMethod,
      orderStatus: newOrder.orderStatus,
      paymentStatus: newOrder.paymentStatus,
    }, 'Đặt hàng thành công!');
  } catch (error) {
    console.error('[Create Order API Error]:', error);
    return apiError('Không thể hoàn tất đặt hàng. Vui lòng thử lại sau', 500);
  }
}

