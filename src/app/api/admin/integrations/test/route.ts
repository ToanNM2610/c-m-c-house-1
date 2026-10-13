import { NextRequest, NextResponse } from "next/server";
import { testIntegrationConnection } from "@/lib/google-apis";
import { getIntegration, saveIntegration, logIntegrationAudit } from "@/data/store";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { key } = body;

    if (!key) {
      return NextResponse.json(
        { success: false, error: "Thiếu khóa cần kiểm tra kết nối" },
        { status: 400 }
      );
    }

    const item = getIntegration(key);
    if (!item) {
      return NextResponse.json(
        { success: false, error: `Không tìm thấy khóa "${key}"` },
        { status: 404 }
      );
    }

    const result = await testIntegrationConnection(key);

    // Update status in store
    saveIntegration(
      key,
      item.value,
      item.name,
      item.isSecret,
      result.success ? "connected" : "error",
      result.message
    );

    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "127.0.0.1";
    logIntegrationAudit("admin", "test", key, ip);

    return NextResponse.json({
      success: result.success,
      message: result.message,
      status: result.success ? "connected" : "error",
      statusMessage: result.message,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Lỗi thực hiện kiểm tra kết nối" },
      { status: 500 }
    );
  }
}
