import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { apiSuccess, apiError } from '@/lib/api-response';
import { requireModuleAuth } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const auth = await requireModuleAuth(req, 'analytics');
  if ('errorResponse' in auth) return auth.errorResponse;

  try {
    const { searchParams } = new URL(req.url);
    const range = searchParams.get('range') || '30d';
    const fromParam = searchParams.get('from');
    const toParam = searchParams.get('to');
    const format = searchParams.get('format');

    const now = new Date();
    let startDate = new Date(now.getTime() - 30 * 86400000);
    let endDate = now;

    if (range === 'today') {
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    } else if (range === '7d') {
      startDate = new Date(now.getTime() - 7 * 86400000);
    } else if (range === 'custom' && fromParam) {
      startDate = new Date(fromParam);
      if (toParam) {
        endDate = new Date(toParam);
        endDate.setHours(23, 59, 59, 999);
      }
    }

    const [orders, menuItems] = await Promise.all([
      prisma.order.findMany({
        where: { createdAt: { gte: startDate, lte: endDate } },
        include: { items: true },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.menuItem.findMany({
        orderBy: [{ orderCount: 'desc' }, { id: 'asc' }],
        select: {
          id: true,
          vietnameseTitle: true,
          nameVi: true,
          categoryId: true,
          priceVnd: true,
          stockQuantity: true,
          trackInventory: true,
          orderCount: true,
        },
      }),
    ]);

    const completed = orders.filter((o) => o.orderStatus === 'COMPLETED');
    const cancelledOrReturned = orders.filter((o) => ['CANCELLED', 'RETURNED'].includes(o.orderStatus));

    const grossRevenue = completed.reduce((sum, o) => sum + (o.subtotal || 0), 0);
    const totalDiscounts = completed.reduce((sum, o) => sum + (o.discountAmount || 0), 0);
    const netRevenue = completed.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
    const totalCost = completed.reduce((sum, o) => sum + (o.costTotal || 0), 0);
    const estimatedProfit = netRevenue - totalCost;

    // Channel Mix (WEB vs ZALO vs HOTLINE)
    const channelStats: Record<string, { orders: number; revenue: number }> = {
      WEB: { orders: 0, revenue: 0 },
      ZALO: { orders: 0, revenue: 0 },
      HOTLINE: { orders: 0, revenue: 0 },
    };
    for (const o of completed) {
      const ch = o.source || 'WEB';
      if (!channelStats[ch]) channelStats[ch] = { orders: 0, revenue: 0 };
      channelStats[ch].orders += 1;
      channelStats[ch].revenue += o.totalAmount || 0;
    }

    // Top selling products from completed order items
    const productSalesMap = new Map<string, { id: string; name: string; qty: number; revenue: number }>();
    for (const o of completed) {
      for (const item of o.items) {
        const key = item.menuItemId || item.itemNameVi;
        const curr = productSalesMap.get(key) || { id: key, name: item.itemNameVi, qty: 0, revenue: 0 };
        curr.qty += item.quantity;
        curr.revenue += item.lineTotal;
        productSalesMap.set(key, curr);
      }
    }
    const topProducts = Array.from(productSalesMap.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);

    // Slow-moving tracked inventory items
    const slowMovingItems = menuItems
      .filter((m) => m.trackInventory && m.stockQuantity > 0 && !productSalesMap.has(m.id))
      .slice(0, 10)
      .map((m) => ({
        id: m.id,
        name: m.vietnameseTitle || m.nameVi,
        stockQuantity: m.stockQuantity,
        soldInPeriod: 0,
      }));

    if (format === 'csv') {
      const header = ['MaDon', 'NgayTao', 'Nguon', 'KhachHang', 'SDT', 'TrangThai', 'ThanhToan', 'DoanhThuGop', 'GiamGia', 'DoanhThuThuan', 'GiaVonCOGS'];
      const rows = orders.map((o) => [
        o.orderCode,
        o.createdAt.toISOString(),
        o.source,
        `"${(o.customerName || '').replace(/"/g, '""')}"`,
        o.customerPhone,
        o.orderStatus,
        o.paymentStatus,
        o.subtotal,
        o.discountAmount,
        o.totalAmount,
        o.costTotal,
      ]);
      const csv = '\uFEFF' + [header.join(','), ...rows.map((r) => r.join(','))].join('\n');
      return new NextResponse(csv, {
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="camcu-revenue-report-${new Date().toISOString().slice(0, 10)}.csv"`,
        },
      });
    }

    return apiSuccess({
      range,
      startDate,
      endDate,
      summary: {
        totalOrders: orders.length,
        completedOrders: completed.length,
        cancelledOrReturnedOrders: cancelledOrReturned.length,
        cancelRatePercent: orders.length > 0 ? Math.round((cancelledOrReturned.length / orders.length) * 100) : 0,
        grossRevenue,
        totalDiscounts,
        netRevenue,
        totalCost,
        estimatedProfit,
      },
      channelStats,
      topProducts,
      slowMovingItems,
      recentCompletedOrders: completed.slice(0, 20),
    });
  } catch (error) {
    console.error('Error generating business analytics:', error);
    return apiError('Không thể tải báo cáo kinh doanh', 500);
  }
}
