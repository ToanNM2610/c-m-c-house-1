import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import {
  verifyAdminCredentials,
  isFirstLoginRequired,
  setupInitialPassword,
  changeAdminPassword,
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

// Active session token store
const activeSessions = new Set<string>();

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "127.0.0.1"
  );
}

export function isValidSession(token: string): boolean {
  if (!token) return false;
  return activeSessions.has(token);
}

export async function GET(request: NextRequest) {
  const needsFirstLogin = isFirstLoginRequired();
  const totpConfig = getTotpConfig();
  const sessionCookie = request.cookies.get("camcu_admin_auth")?.value;
  const isAuthenticated = Boolean(sessionCookie && isValidSession(sessionCookie));

  return NextResponse.json({
    success: true,
    isAuthenticated,
    needsFirstLogin,
    totpEnabled: totpConfig.totpEnabled,
  });
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
          error: `Tài khoản tạm khóa do 5 lần nhập sai liên tiếp. Vui lòng thử lại sau ${waitMinutes} phút.`,
          isLocked: true,
        },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { password, pin, totpCode, action, newPassword, confirmPassword } = body;
    const credential = (password || pin || "").trim();

    // Action 1: First-time password setup
    if (action === "setup_initial" || isFirstLoginRequired()) {
      if (!newPassword && !credential) {
        return NextResponse.json({
          success: false,
          needsFirstLogin: true,
          message: "Lần đầu truy cập: Vui lòng thiết lập mật khẩu quản trị an toàn (tối thiểu 12 ký tự).",
        });
      }

      const passToSet = newPassword || credential;
      if (confirmPassword && passToSet !== confirmPassword) {
        return NextResponse.json(
          { success: false, error: "Mật khẩu xác nhận không trùng khớp." },
          { status: 400 }
        );
      }

      const setupRes = setupInitialPassword(passToSet);
      if (!setupRes.success) {
        return NextResponse.json(
          { success: false, error: setupRes.error || "Mật khẩu không hợp lệ." },
          { status: 400 }
        );
      }

      // Generate secure session token and prompt to enable 2FA
      const sessionToken = crypto.randomBytes(32).toString("hex");
      activeSessions.add(sessionToken);

      const response = NextResponse.json({
        success: true,
        isInitialSetupDone: true,
        require2FASetup: true,
        message: "Thiết lập mật khẩu thành công! Vui lòng tiến hành kích hoạt 2FA TOTP để hoàn tất bảo vệ tài khoản.",
      });

      response.cookies.set("camcu_admin_auth", sessionToken, {
        path: "/",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7, // 7 days
        sameSite: "lax",
      });

      return response;
    }

    // Action 2: Standard Login
    if (!credential) {
      return NextResponse.json(
        { success: false, error: "Vui lòng nhập mật khẩu quản trị viên." },
        { status: 400 }
      );
    }

    const isCredentialValid = verifyAdminCredentials(credential);

    if (!isCredentialValid) {
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
          error: `Mật khẩu không chính xác (còn ${remaining} lần thử).`,
        },
        { status: 401 }
      );
    }

    // Password valid, check 2FA
    const totpConfig = getTotpConfig();
    if (totpConfig.totpEnabled) {
      if (!totpCode) {
        return NextResponse.json({
          success: false,
          require2FA: true,
          message: "Vui lòng nhập mã xác thực 6 số từ Google Authenticator (hoặc mã khôi phục).",
        });
      }

      const cleanCode = String(totpCode).trim();
      const isTotpValid = verifyTotpCode(totpConfig.totpSecret, cleanCode);
      const isRecoveryValid = !isTotpValid && verifyRecoveryCode(cleanCode);

      if (!isTotpValid && !isRecoveryValid) {
        tracker.count++;
        failMap.set(ip, tracker);
        return NextResponse.json(
          {
            success: false,
            require2FA: true,
            error: "Mã xác thực 2FA hoặc mã khôi phục không chính xác.",
          },
          { status: 401 }
        );
      }
    }

    // Success: reset fail tracker
    failMap.delete(ip);

    // Invalidate old session tokens and generate a fresh random cryptographically secure token
    const sessionToken = crypto.randomBytes(32).toString("hex");
    activeSessions.add(sessionToken);

    const response = NextResponse.json({
      success: true,
      message: "Đăng nhập thành công",
    });

    response.cookies.set("camcu_admin_auth", sessionToken, {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
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
 * 2FA Status & Setup API & Password change
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, secret, code, oldPassword, newPassword } = body;

    if (action === "status") {
      const config = getTotpConfig();
      const needsFirstLogin = isFirstLoginRequired();
      return NextResponse.json({
        success: true,
        totpEnabled: config.totpEnabled,
        needsFirstLogin,
      });
    }

    if (action === "change_password") {
      const changeRes = changeAdminPassword(oldPassword || "", newPassword || "");
      if (!changeRes.success) {
        return NextResponse.json(
          { success: false, error: changeRes.error || "Không thể đổi mật khẩu." },
          { status: 400 }
        );
      }
      return NextResponse.json({
        success: true,
        message: "Đổi mật khẩu quản trị thành công!",
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
          { success: false, error: "Mã xác thực 6 số không đúng. Vui lòng kiểm tra lại ứng dụng Authenticator." },
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
    return NextResponse.json({ success: false, error: "Lỗi xử lý bảo mật" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const cookie = request.cookies.get("camcu_admin_auth")?.value;
  if (cookie) {
    activeSessions.delete(cookie);
  }

  const response = NextResponse.json({
    success: true,
    message: "Đã đăng xuất phiên làm việc",
  });

  response.cookies.delete("camcu_admin_auth");
  return response;
}
