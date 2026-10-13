import { NextRequest, NextResponse } from "next/server";
import { submitSitemapToGoogle } from "@/lib/google-apis";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const sitemapUrl = body.sitemapUrl || "https://camcuhouse.online/sitemap.xml";

    const result = await submitSitemapToGoogle(sitemapUrl);
    return NextResponse.json({
      success: result.success,
      message: result.message,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Lỗi kết nối khi gửi sitemap đến Google" },
      { status: 500 }
    );
  }
}
