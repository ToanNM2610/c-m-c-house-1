import { NextRequest, NextResponse } from "next/server";
import { submitSitemapToGoogle } from "@/lib/google-apis";

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const sitemapUrl = body.sitemapUrl || "https://camcuhouse.online/sitemap.xml";

    const result = await submitSitemapToGoogle(sitemapUrl);
    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.message || "Lỗi khi gửi sitemap đến Google",
          message: result.message,
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: result.message,
    });
  } catch (error: any) {
    console.error("Submit sitemap error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Lỗi kết nối khi gửi sitemap đến Google", message: "Lỗi kết nối khi gửi sitemap đến Google" },
      { status: 500 }
    );
  }
}
