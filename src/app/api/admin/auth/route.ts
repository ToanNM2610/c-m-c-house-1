import { NextRequest, NextResponse } from "next/server";
import {
  verifyAdminPin,
  getTotpConfig,
  enableTotp,
  disableTotp,
  verifyRecoveryCode,
} from "@/data/store";
import {
  generateTotpSecret,
  verifyTotpCode,
  generateRecoveryCodes,
  getTotpUri,
} from "@/lib/totp";

// 5-fail lockout tracking in memory
interface FailTracker {
  count: number;
  lockedUntil: number;
}
const failMap = new Map<string, FailTracker>();

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "127.0.0.1"
  );
}

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const now = Date.now();
    const tracker = failMap.get(ip) || { count: 0, lockedUntil: 0 };

    // Check if locked
    if (tracker.lockedUntil > now) {
      const waitMinutes = Math.ceil((tracker.lockedUntil - now) / 60000);
      return NextResponse.json(
        {
          success: false,
          error: `Tài khoản tạm khóa do 5 lần nhập sai. Vui lòng thử lại sau ${waitMinutes} phút.`,
          isLocked: true,
        },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { pin, totpCode } = body;

    if (!pin) {
      return NextResponse.json(
        { success: false, error: "Vui lòng nhập mã PIN" },
        { status: 400 }
      );
    }

    const isPinValid = verifyAdminPin(pin);

    if (!isPinValid) {
      tracker.count++;
      if (tracker.count >= 5) {
        tracker.lockedUntil = now + 15 * 60 * 1000; // 15 mins lockout
        failMap.set(ip, tracker);
        return NextResponse.json(
          {
            success: false,
            error: "Nhập sai quá 5 lần. Tài khoản bị tạm khóa 15 phút.",
            isLocked: true,
          },
          { status: 429 }
        );
      }
      failMap.set(ip, tracker);
      const remaining = 5 - tracker.count;
      return NextResponse.json(
        {
          success: false,
          error: `Mã PIN không chính xác (còn ${remaining} lần thử)`,
        },
        { status: 401 }
      );
    }

    // PIN is valid, check if 2FA is enabled
    const totpConfig = getTotpConfig();
    if (totpConfig.totpEnabled) {
      if (!totpCode) {
        // Prompt for 2FA TOTP code
        return NextResponse.json({
          success: false,
          require2FA: true,
          message: "Vui lòng nhập mã xác thực 2FA (TOTP hoặc mã khôi phục)",
        });
      }

      // Verify TOTP or Recovery Code
      const cleanCode = String(totpCode).trim();
      const isTotpValid = verifyTotpCode(totpConfig.totpSecret, cleanCode);
      const isRecoveryValid = !isTotpValid && verifyRecoveryCode(cleanCode);

      if (!isTotpValid && !isRecoveryValid) {
        return NextResponse.json(
          {
            success: false,
            require2FA: true,
            error: "Mã 2FA hoặc mã khôi phục không chính xác",
          },
          { status: 401 }
        );
      }
    }

    // Success: reset fail tracker
    failMap.delete(ip);

    const response = NextResponse.json({
      success: true,
      message: "Xác thực danh tính thành công",
    });

    // Set 7-day session cookie
    response.cookies.set("camcu_admin_auth", "authenticated_session_2610", {
      path: "/",
      httpOnly: false,
      maxAge: 60 * 60 * 24 * 7,
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

/**
 * 2FA Status & Setup API
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, secret, code } = body;

    if (action === "status") {
      const config = getTotpConfig();
      return NextResponse.json({
        success: true,
        totpEnabled: config.totpEnabled,
      });
    }

    if (action === "setup") {
      const newSecret = generateTotpSecret();
      const recoveryCodes = generateRecoveryCodes(5);
      const uri = getTotpUri(newSecret);

      return NextResponse.json({
        success: true,
        secret: newSecret,
        uri,
        recoveryCodes,
      });
    }

    if (action === "verify_enable") {
      if (!secret || !code) {
        return NextResponse.json(
          { success: false, error: "Thiếu mã xác nhận hoặc khóa bí mật" },
          { status: 400 }
        );
      }

      const isValid = verifyTotpCode(secret, String(code).trim());
      if (!isValid) {
        return NextResponse.json(
          { success: false, error: "Mã xác thực 6 số không đúng. Vui lòng kiểm tra lại đồng hồ thiết bị." },
          { status: 400 }
        );
      }

      const recoveryCodes = body.recoveryCodes || generateRecoveryCodes(5);
      enableTotp(secret, recoveryCodes);

      return NextResponse.json({
        success: true,
        message: "Đã kích hoạt bảo mật 2 lớp 2FA (TOTP) thành công!",
      });
    }

    if (action === "disable") {
      disableTotp();
      return NextResponse.json({
        success: true,
        message: "Đã tắt xác thực 2 lớp 2FA",
      });
    }

    return NextResponse.json({ success: false, error: "Action không hợp lệ" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Lỗi xử lý 2FA" }, { status: 500 });
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
