import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { runAntiSpamGuard, commitSubmission } from "@/lib/antiSpam";
import rawBackupData from "@/data/backup/camcu_raw_backup.json";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    let reviews: any[] = await prisma.customerReview.findMany({
      where: { status: 'APPROVED' },
      orderBy: { createdAt: 'desc' },
    });

    if (!reviews || reviews.length === 0) {
      // Fallback to guest comments
      const guestComments = await prisma.guestComment.findMany({
        where: { status: 'APPROVED' },
        orderBy: { createdAt: 'desc' },
      });

      if (guestComments.length > 0) {
        reviews = guestComments.map(c => ({
          id: c.id,
          authorName: c.authorName,
          rating: c.rating,
          contentVi: c.content,
          contentEn: null,
          replyVi: null,
          replyEn: null,
          status: c.status,
          isFeatured: c.isFeatured,
          createdAt: c.createdAt,
          updatedAt: c.updatedAt,
        }));
      }
    }

    const fallbackReviews = (rawBackupData.reviews || []).map((r: any, idx: number) => ({
      id: `fallback-${idx}`,
      authorName: r.authorName,
      rating: r.rating || 5,
      contentVi: r.content,
      contentEn: null,
      replyVi: null,
      replyEn: null,
      status: 'APPROVED',
      isFeatured: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    const displayReviews = reviews.length > 0 ? reviews : fallbackReviews;
    const totalCount = displayReviews.length;
    const avgRating =
      totalCount > 0
        ? Number(
            (
              displayReviews.reduce((acc, r) => acc + (r.rating || 5), 0) / totalCount
            ).toFixed(1)
          )
        : 5.0;

    return NextResponse.json({
      success: true,
      reviews: displayReviews,
      stats: {
        averageRating: avgRating,
        totalReviews: totalCount,
        source: 'database',
        sourceLabelVi: "Cảm nhận khách ghé quán",
        sourceLabelEn: "Verified Guest Reviews",
      },
    });
  } catch (error) {
    console.error('GET /api/reviews error:', error);
    return NextResponse.json(
      { success: false, error: "Lỗi tải đánh giá" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Anti-spam guard
    const antiSpamResult = await runAntiSpamGuard(request, body, {
      nameField: 'authorName',
      contentField: 'contentVi',
    });

    if (!antiSpamResult.passed) {
      if (antiSpamResult.isHoneypotBot) {
        return NextResponse.json({
          success: true,
          message: 'Đánh giá của bạn đã được ghi nhận và đang chờ duyệt.',
        });
      }
      return antiSpamResult.response;
    }

    const { authorName, rating, contentVi, contentEn } = body;
    if (!authorName || (!contentVi && !body.content)) {
      return NextResponse.json(
        { success: false, error: 'Vui lòng cung cấp họ tên và nội dung đánh giá.' },
        { status: 400 }
      );
    }

    const review = await prisma.customerReview.create({
      data: {
        authorName: authorName.trim(),
        rating: Math.min(5, Math.max(1, Number(rating) || 5)),
        contentVi: (contentVi || body.content || '').trim(),
        contentEn: contentEn ? contentEn.trim() : null,
        status: 'PENDING',
        isFeatured: false,
      },
    });

    commitSubmission(antiSpamResult.ip);

    return NextResponse.json({
      success: true,
      message: 'Cảm ơn bạn! Đánh giá đã được gửi và sẽ hiển thị sau khi ban quản trị phê duyệt.',
      review,
    });
  } catch (error: any) {
    console.error('POST /api/reviews error:', error);
    return NextResponse.json(
      { success: false, error: 'Không thể gửi đánh giá. Vui lòng thử lại sau.' },
      { status: 500 }
    );
  }
}
