import { NextRequest, NextResponse } from "next/server";
import { verifyAdminPin } from "@/data/store";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { pin } = body;

    if (!pin) {
      return NextResponse.json(
        { success: false, error: "Vui lòng nhập mã PIN" },
        { status: 400 }
      );
    }

    const isValid = verifyAdminPin(pin);

    if (!isValid) {
      return NextResponse.json(
        { success: false, error: "Mã PIN không chính xác" },
        { status: 401 }
      );
    }

    const response = NextResponse.json({
      success: true,
      message: "Xác thực mã PIN thành công",
    });

    // Set cookie
    response.cookies.set("camcu_admin_auth", "authenticated_session_2610", {
      path: "/",
      httpOnly: false, // Accessible to client-side auth state
      maxAge: 60 * 60 * 24 * 7, // 7 days
      sameSite: "lax",
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Lỗi hệ thống khi xác thực" },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  const response = NextResponse.json({
    success: true,
    message: "Đã đăng xuất phiên làm việc",
  });

  response.cookies.delete("camcu_admin_auth");
  return response;
}
