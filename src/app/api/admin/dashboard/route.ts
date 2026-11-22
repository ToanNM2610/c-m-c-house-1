import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const auth = await requireAuth(req);
  if ('errorResponse' in auth) {
    return auth.errorResponse;
  }

  try {
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
      recentInquiries,
      recentReviews,
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
      prisma.reservationInquiry.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
      }).catch(() => []),
      prisma.customerReview.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
      }).catch(() => []),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        unreadInquiries: unreadReservations + unreadContacts,
        pendingReviews: pendingReviews + pendingComments,
        activeMenuItems,
        totalMenuItems,
        visiblePhotos: visibleGalleryPlates || 30,
        totalPhotos: totalGalleryPlates || 30,
        publishedPosts,
        activePages: activePages || 7,
        recentInquiries,
        recentReviews,
      },
    }, {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  } catch (error) {
    console.error('Error fetching admin dashboard metrics:', error);
    return NextResponse.json(
      { success: false, error: 'Không thể tải thống kê thời gian thực' },
      { status: 500 }
    );
  }
}
