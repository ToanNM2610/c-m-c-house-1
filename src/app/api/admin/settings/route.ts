import { NextRequest, NextResponse } from "next/server";
import { getStoreSettings, updateStoreSettings, changeAdminPassword } from "@/data/store";

export async function GET() {
  try {
    const settings = getStoreSettings();
    // Do not return raw passwordHash or credentials to client
    const { passwordHash, ...safeSettings } = settings;
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

    // Check if requesting password change
    if (body.action === "change_password") {
      const { oldPassword, newPassword } = body;
      if (!oldPassword || !newPassword) {
        return NextResponse.json(
          { success: false, error: "Vui lòng nhập đầy đủ mật khẩu cũ và mật khẩu mới" },
          { status: 400 }
        );
      }

      const result = changeAdminPassword(oldPassword, newPassword);
      if (!result.success) {
        return NextResponse.json(
          { success: false, error: result.error || "Mật khẩu cũ không chính xác hoặc mật khẩu mới chưa đủ 12 ký tự" },
          { status: 400 }
        );
      }

      return NextResponse.json({
        success: true,
        message: "Đổi mật khẩu quản trị thành công",
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

    const { passwordHash, ...safeUpdated } = updated;

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
