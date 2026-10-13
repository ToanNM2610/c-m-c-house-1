import { NextResponse } from "next/server";
import rawBackupData from "@/data/backup/camcu_raw_backup.json";

export async function GET() {
  try {
    const reviews = rawBackupData.reviews || [];
    const totalCount = reviews.length;
    const avgRating =
      totalCount > 0
        ? Number(
            (
              reviews.reduce((acc, r) => acc + (r.rating || 5), 0) / totalCount
            ).toFixed(1)
          )
        : 5.0;

    const isGoogleSource = reviews.every((r) => r.source === "google");

    return NextResponse.json({
      success: true,
      reviews,
      stats: {
        averageRating: avgRating,
        totalReviews: totalCount,
        source: isGoogleSource ? "google" : "manual",
        sourceLabelVi: isGoogleSource
          ? "Đánh giá từ Google Maps"
          : "Lời khách ghé quán",
        sourceLabelEn: isGoogleSource
          ? "Verified Google Reviews"
          : "Guest Reflections",
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Lỗi tải đánh giá" },
      { status: 500 }
    );
  }
}
