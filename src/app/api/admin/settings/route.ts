import { NextRequest, NextResponse } from "next/server";
import { getStoreSettings, updateStoreSettings, changeAdminPin } from "@/data/store";

export async function GET() {
  try {
    const settings = getStoreSettings();
    // Do not return raw adminPin to public
    const { adminPin, ...safeSettings } = settings;
    return NextResponse.json({
      success: true,
      settings: safeSettings,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Lỗi tải thông tin cài đặt cửa hàng" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Check if requesting PIN change
    if (body.action === "change_pin") {
      const { oldPin, newPin } = body;
      if (!oldPin || !newPin) {
        return NextResponse.json(
          { success: false, error: "Vui lòng nhập đầy đủ mã PIN cũ và mã PIN mới" },
          { status: 400 }
        );
      }

      const changed = changeAdminPin(oldPin, newPin);
      if (!changed) {
        return NextResponse.json(
          { success: false, error: "Mã PIN cũ không chính xác hoặc mã PIN mới không hợp lệ (tối thiểu 4 số)" },
          { status: 400 }
        );
      }

      return NextResponse.json({
        success: true,
        message: "Đổi mã PIN bảo mật thành công",
      });
    }

    // Standard settings update
    const {
      isOpen,
      statusText,
      hoursWeekday,
      hoursWeekend,
      hotline1,
      hotline2,
      address,
      topBanner,
    } = body;

    const updated = updateStoreSettings({
      ...(typeof isOpen === "boolean" ? { isOpen } : {}),
      ...(statusText ? { statusText } : {}),
      ...(hoursWeekday ? { hoursWeekday } : {}),
      ...(hoursWeekend ? { hoursWeekend } : {}),
      ...(hotline1 ? { hotline1 } : {}),
      ...(hotline2 ? { hotline2 } : {}),
      ...(address ? { address } : {}),
      ...(topBanner ? { topBanner } : {}),
    });

    const { adminPin, ...safeUpdated } = updated;

    return NextResponse.json({
      success: true,
      message: "Cập nhật cài đặt cửa hàng thành công",
      settings: safeUpdated,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Lỗi lưu cài đặt cửa hàng" },
      { status: 500 }
    );
  }
}
