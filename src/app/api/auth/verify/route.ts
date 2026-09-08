import { NextResponse } from "next/server";
import crypto from "crypto";

const RATE_LIMIT_MAP = new Map<string, { attempts: number; lockUntil: number }>();

export async function POST(req: Request) {
  try {
    // Get client IP for rate limiting
    const ip = req.headers.get("x-forwarded-for") || "unknown";

    // Check rate limit
    const record = RATE_LIMIT_MAP.get(ip);
    if (record) {
      if (Date.now() < record.lockUntil) {
        return NextResponse.json({ error: "Quá nhiều lần thử. Vui lòng thử lại sau 15 phút." }, { status: 429 });
      }
      // Reset if lock time passed
      if (Date.now() > record.lockUntil && record.attempts >= 5) {
        RATE_LIMIT_MAP.delete(ip);
      }
    }

    const { pin } = await req.json();

    if (!pin) {
      return NextResponse.json({ error: "Vui lòng nhập mã PIN" }, { status: 400 });
    }

    const salt = process.env.SALT_KEY;
    const expectedHash = process.env.ADMIN_PIN_HASH;

    if (!salt || !expectedHash) {
      console.error("Missing SALT_KEY or ADMIN_PIN_HASH in environment");
      return NextResponse.json({ error: "Cấu hình bảo mật chưa hoàn thiện." }, { status: 500 });
    }

    const hash = crypto.createHash("sha256").update(pin + salt).digest("hex");

    if (hash === expectedHash) {
      // Success! Clear rate limit
      RATE_LIMIT_MAP.delete(ip);

      // Create response and set cookie
      const response = NextResponse.json({ success: true });
      response.cookies.set({
        name: "camcu_auth_session",
        value: "authenticated",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24, // 24 hours
        path: "/",
      });

      return response;
    } else {
      // Failed attempt
      const currentRecord = RATE_LIMIT_MAP.get(ip) || { attempts: 0, lockUntil: 0 };
      currentRecord.attempts += 1;
      
      if (currentRecord.attempts >= 5) {
        currentRecord.lockUntil = Date.now() + 15 * 60 * 1000; // 15 minutes
      }
      
      RATE_LIMIT_MAP.set(ip, currentRecord);

      const remaining = 5 - currentRecord.attempts;
      
      if (remaining <= 0) {
        return NextResponse.json({ error: "Tài khoản bị khóa tạm thời 15 phút do nhập sai quá nhiều lần." }, { status: 429 });
      }

      return NextResponse.json({ error: `Mã PIN không chính xác. Bạn còn ${remaining} lần thử.` }, { status: 401 });
    }
  } catch (error) {
    console.error("Auth error:", error);
    return NextResponse.json({ error: "Lỗi hệ thống" }, { status: 500 });
  }
}
