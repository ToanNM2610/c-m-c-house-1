import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { canViewFinanceMetrics } from '@/lib/rbac';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const auth = await requireAuth(req);
  if ('errorResponse' in auth) {
    return auth.errorResponse;
  }

  try {
    const showFinance = canViewFinanceMetrics(auth.user.role);

    const [
      unreadReservations,
      unreadContacts,
      pendingReviews,
      pendingComments,
      activeMenuItems,
      totalMenuItems,
      visibleGalleryPlates,
      totalGalleryPlates,
      publishedPosts,
      activePages,
      pendingOrdersCount,
      completedOrders,
      allNonCancelledOrders,
      lowStockItems,
      recentInquiries,
      recentReviews,
      recentPendingOrders,
      commerceSettings,
    ] = await Promise.all([
      prisma.reservationInquiry.count({ where: { status: 'NEW' } }).catch(() => 0),
      prisma.contactSubmission.count({ where: { status: 'NEW' } }).catch(() => 0),
      prisma.customerReview.count({ where: { status: 'PENDING' } }).catch(() => 0),
      prisma.guestComment.count({ where: { status: 'PENDING' } }).catch(() => 0),
      prisma.menuItem.count({ where: { isAvailable: true, inStock: true } }).catch(() => 0),
      prisma.menuItem.count().catch(() => 0),
      prisma.galleryPlate.count({ where: { isVisible: true } }).catch(() => 0),
      prisma.galleryPlate.count().catch(() => 0),
      prisma.post.count({ where: { published: true } }).catch(() => 0),
      prisma.pageConfig.count({ where: { enabled: true } }).catch(() => 7),
      prisma.order.count({ where: { orderStatus: 'PENDING' } }).catch(() => 0),
      prisma.order
        .findMany({
          where: { orderStatus: 'COMPLETED' },
          select: { subtotal: true, totalAmount: true, discountAmount: true, costTotal: true },
        })
        .catch(() => []),
      prisma.order.count({ where: { orderStatus: { not: 'CANCELLED' } } }).catch(() => 0),
      prisma.menuItem
        .findMany({
          where: { trackInventory: true },
          select: { id: true, nameVi: true, vietnameseTitle: true, stockQuantity: true, stockReserved: true, lowStockThreshold: true },
        })
        .then((list) => list.filter((i) => i.stockQuantity <= i.lowStockThreshold))
        .catch(() => []),
      prisma.reservationInquiry
        .findMany({ take: 5, orderBy: { createdAt: 'desc' } })
        .catch(() => []),
      prisma.customerReview
        .findMany({ take: 5, orderBy: { createdAt: 'desc' } })
        .catch(() => []),
      prisma.order
        .findMany({
          where: { orderStatus: { in: ['PENDING', 'CONFIRMED'] } },
          take: 5,
          orderBy: { createdAt: 'desc' },
          select: { id: true, orderCode: true, customerName: true, customerPhone: true, totalAmount: true, orderStatus: true, source: true, createdAt: true },
        })
        .catch(() => []),
      prisma.commerceSettings.findUnique({ where: { id: 'commerce-settings' } }).catch(() => null),
    ]);

    const grossRevenue = completedOrders.reduce((acc, o) => acc + (o.subtotal || 0), 0);
    const netRevenue = completedOrders.reduce((acc, o) => acc + (o.totalAmount || 0), 0);
    const totalOrders = await prisma.order.count().catch(() => 0);
    const conversionRate = totalOrders > 0 ? Math.round((completedOrders.length / totalOrders) * 100) : 0;

    return NextResponse.json(
      {
        success: true,
        data: {
          unreadInquiries: unreadReservations + unreadContacts,
          pendingReviews: pendingReviews + pendingComments,
          activeMenuItems,
          totalMenuItems,
          visiblePhotos: visibleGalleryPlates || 30,
          totalPhotos: totalGalleryPlates || 30,
          publishedPosts,
          activePages: typeof activePages === 'number' ? activePages : 7,
          commerceEnabled: Boolean(commerceSettings?.commerceEnabled ?? false),
          enableCustomerPortal: Boolean(commerceSettings?.enableCustomerPortal ?? false),
          pendingOrdersCount,
          lowStockCount: lowStockItems.length,
          grossRevenue: showFinance ? grossRevenue : null,
          netRevenue: showFinance ? netRevenue : null,
          completedOrdersCount: completedOrders.length,
          activeOrdersCount: allNonCancelledOrders,
          conversionRate,
          recentInquiries,
          recentReviews,
          recentPendingOrders,
          lowStockItems: lowStockItems.slice(0, 6),
        },
        kpis: {
          reservations: { unread: unreadReservations + unreadContacts },
          orders: { pending: pendingOrdersCount },
        },
      },
      {
        headers: {
          'Cache-Control': 'no-store, max-age=0',
        },
      }
    );
  } catch (error) {
    console.error('Error fetching admin dashboard metrics:', error);
    return NextResponse.json(
      { success: false, error: 'Không thể tải thống kê thời gian thực' },
      { status: 500 }
    );
  }
}
