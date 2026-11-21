import { NextResponse } from "next/server";
import { getStatus } from "@/lib/status";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const status = getStatus();
    return NextResponse.json({
      success: true,
      status,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Lỗi kiểm tra trạng thái hoạt động" },
      { status: 500 }
    );
  }
}
