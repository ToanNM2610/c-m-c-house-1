import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { apiSuccess, apiError } from '@/lib/api-response';
import { requireAuth } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const auth = await requireAuth(req, ['SUPER_ADMIN', 'EDITOR']);
  if ('errorResponse' in auth) return auth.errorResponse;

  try {
    // 1. Overall stats
    const [
      totalOrders,
      paidOrdersCount,
      pendingCount,
      completedCount,
      cancelledCount,
      revenueResult,
      totalCustomers,
      totalSubscribers,
    ] = await Promise.all([
      prisma.order.count(),
      prisma.order.count({ where: { paymentStatus: 'PAID' } }),
      prisma.order.count({ where: { orderStatus: 'PENDING' } }),
      prisma.order.count({ where: { orderStatus: 'COMPLETED' } }),
      prisma.order.count({ where: { orderStatus: 'CANCELLED' } }),
      prisma.order.aggregate({
        _sum: { totalAmount: true },
        where: {
          OR: [
            { paymentStatus: 'PAID' },
            { orderStatus: { in: ['CONFIRMED', 'PREPARING', 'SHIPPING', 'COMPLETED'] } },
          ],
        },
      }),
      prisma.customer.count({ where: { isActive: true } }),
      prisma.newsletterSubscriber.count({ where: { isActive: true } }),
    ]);

    const totalRevenue = revenueResult._sum.totalAmount || 0;
    const aov = paidOrdersCount > 0 ? Math.round(totalRevenue / paidOrdersCount) : 0;

    // 2. Fulfillment distribution
    const fulfillmentGroups = await prisma.order.groupBy({
      by: ['fulfillmentType'],
      _count: { id: true },
    });
    const fulfillmentDistribution: Record<string, number> = {
      DELIVERY: 0,
      PICKUP: 0,
      DINE_IN_BBQ: 0,
    };
    for (const group of fulfillmentGroups) {
      fulfillmentDistribution[group.fulfillmentType] = group._count.id;
    }

    // 3. Payment Method distribution
    const paymentMethodGroups = await prisma.order.groupBy({
      by: ['paymentMethod'],
      _count: { id: true },
    });
    const paymentMethodDistribution: Record<string, number> = {
      VIETQR: 0,
      COD: 0,
      VNPAY: 0,
      MOMO: 0,
      CARD: 0,
    };
    for (const group of paymentMethodGroups) {
      paymentMethodDistribution[group.paymentMethod] = group._count.id;
    }

    // 4. Payment Status distribution
    const paymentStatusGroups = await prisma.order.groupBy({
      by: ['paymentStatus'],
      _count: { id: true },
    });
    const paymentStatusDistribution: Record<string, number> = {
      UNPAID: 0,
      PENDING_VERIFY: 0,
      PAID: 0,
      REFUNDED: 0,
      FAILED: 0,
    };
    for (const group of paymentStatusGroups) {
      paymentStatusDistribution[group.paymentStatus] = group._count.id;
    }

    // 5. Top Best-Selling Items
    const topOrderItems = await prisma.orderItem.groupBy({
      by: ['menuItemId', 'itemNameVi'],
      _sum: {
        quantity: true,
        lineTotal: true,
      },
      orderBy: {
        _sum: {
          quantity: 'desc',
        },
      },
      take: 10,
    });

    const bestSellers = topOrderItems.map((item) => ({
      menuItemId: item.menuItemId,
      name: item.itemNameVi,
      soldQuantity: item._sum.quantity || 0,
      totalRevenue: item._sum.lineTotal || 0,
    }));

    // 6. Recent Revenue Trend (Last 14 days)
    const fourteenDaysAgo = new Date();
    fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);
    fourteenDaysAgo.setHours(0, 0, 0, 0);

    const recentOrders = await prisma.order.findMany({
      where: {
        createdAt: { gte: fourteenDaysAgo },
        orderStatus: { not: 'CANCELLED' },
      },
      select: {
        totalAmount: true,
        paymentStatus: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'asc' },
    });

    const dailyTrendMap: Record<string, { date: string; revenue: number; orderCount: number }> = {};
    for (let i = 0; i <= 14; i++) {
      const d = new Date(fourteenDaysAgo);
      d.setDate(d.getDate() + i);
      const key = d.toISOString().split('T')[0];
      dailyTrendMap[key] = { date: key, revenue: 0, orderCount: 0 };
    }

    for (const ord of recentOrders) {
      const dateKey = new Date(ord.createdAt).toISOString().split('T')[0];
      if (dailyTrendMap[dateKey]) {
        dailyTrendMap[dateKey].revenue += ord.totalAmount;
        dailyTrendMap[dateKey].orderCount += 1;
      }
    }

    const revenueTrend = Object.values(dailyTrendMap);

    return apiSuccess({
      metrics: {
        totalRevenue,
        totalOrders,
        paidOrdersCount,
        pendingCount,
        completedCount,
        cancelledCount,
        aov,
        totalCustomers,
        totalSubscribers,
      },
      distribution: {
        fulfillment: fulfillmentDistribution,
        paymentMethod: paymentMethodDistribution,
        paymentStatus: paymentStatusDistribution,
      },
      bestSellers,
      revenueTrend,
    });
  } catch (error) {
    console.error('[Admin Commerce Analytics Error]:', error);
    return apiError('Lỗi tính toán chỉ số báo cáo thương mại', 500);
  }
}
