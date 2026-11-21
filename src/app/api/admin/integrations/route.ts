import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export const dynamic = 'force-dynamic';
import {
  getAllIntegrations,
  saveIntegration,
  deleteIntegration,
  getDecryptedIntegrationValue,
  logIntegrationAudit,
  getIntegrationAuditLogs,
} from "@/data/store";
import { maskSecret } from "@/lib/crypto";
import { revalidateIntegrationsCache } from "@/lib/integrations";
import { testIntegrationConnection } from "@/lib/google-apis";
import { requireAuth } from "@/lib/auth";

// Rate limiting in memory (max 15 modification requests per 60 seconds per IP)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const limit = rateLimitMap.get(ip);
  if (!limit || limit.resetAt < now) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 60000 });
    return true;
  }
  if (limit.count >= 15) {
    return false;
  }
  limit.count++;
  return true;
}

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "127.0.0.1"
  );
}

// Zod schemas
const SaveIntegrationSchema = z.object({
  key: z.string().min(1, "Key không được để trống"),
  value: z.string(),
  name: z.string().optional(),
  isSecret: z.boolean().optional(),
});

const DeleteIntegrationSchema = z.object({
  key: z.string().min(1, "Key không được để trống"),
});

export async function GET(request: NextRequest) {
  const auth = await requireAuth(request, ['SUPER_ADMIN', 'EDITOR']);
  if ('errorResponse' in auth) {
    return auth.errorResponse;
  }

  try {
    const rawList = getAllIntegrations();
    // Mask all secret values before returning to browser.
    // Server MUST NEVER return raw unmasked secrets.
    const safeList = rawList.map((item) => {
      if (item.isSecret) {
        const decrypted = getDecryptedIntegrationValue(item.key);
        return {
          ...item,
          value: maskSecret(decrypted),
          hasValue: Boolean(decrypted && decrypted.trim().length > 0),
        };
      }
      return {
        ...item,
        hasValue: Boolean(item.value && item.value.trim().length > 0),
      };
    });

    const auditLogs = getIntegrationAuditLogs();

    return NextResponse.json({
      success: true,
      integrations: safeList,
      auditLogs,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Lỗi tải danh sách tích hợp" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const auth = await requireAuth(request, 'SUPER_ADMIN');
  if ('errorResponse' in auth) {
    return auth.errorResponse;
  }

  const ip = getClientIp(request);
  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { success: false, error: "Quá nhiều yêu cầu thay đổi. Vui lòng thử lại sau 1 phút." },
      { status: 429 }
    );
  }

  try {
    const body = await request.json();
    const parsed = SaveIntegrationSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message || "Dữ liệu không hợp lệ" },
        { status: 400 }
      );
    }

    const { key, value, name, isSecret } = parsed.data;

    // Key-specific validation
    if (key === "ga4_measurement_id" && value.trim()) {
      if (!/^G-[A-Z0-9]+$/i.test(value.trim())) {
        return NextResponse.json(
          { success: false, error: "GA4 Measurement ID phải có dạng G-XXXXXXXXXX (ví dụ G-ABC1234567)" },
          { status: 400 }
        );
      }
    }

    if (key === "ga4_property_id" && value.trim()) {
      if (!/^\d+$/.test(value.trim())) {
        return NextResponse.json(
          { success: false, error: "GA4 Property ID phải là một chuỗi số (ví dụ: 456789123)" },
          { status: 400 }
        );
      }
    }

    if (key === "google_service_account_json" && value.trim()) {
      try {
        const json = JSON.parse(value.trim());
        if (!json.client_email || !json.private_key) {
          return NextResponse.json(
            { success: false, error: "JSON Service Account thiếu client_email hoặc private_key hợp lệ." },
            { status: 400 }
          );
        }
      } catch {
        return NextResponse.json(
          { success: false, error: "Định dạng JSON của Service Account không đúng chuẩn." },
          { status: 400 }
        );
      }
    }

    // Save
    const updated = saveIntegration(key, value.trim(), name, isSecret);

    // Auto-test connection to set status
    const testResult = await testIntegrationConnection(key);
    saveIntegration(
      key,
      value.trim(),
      name,
      isSecret,
      testResult.success ? "connected" : "error",
      testResult.message
    );

    // Write audit log (NEVER logs secret values!)
    logIntegrationAudit(auth.user.username, "update", key, ip);

    // Trigger immediate Next.js ISR/Cache revalidation for public site
    revalidateIntegrationsCache();

    return NextResponse.json({
      success: true,
      message: `Đã lưu thành công khóa "${updated.name}"!`,
      status: testResult.success ? "connected" : "error",
      statusMessage: testResult.message,
    });
  } catch (error) {
    console.error("[Integrations API Error]", error);
    return NextResponse.json(
      { success: false, error: "Lỗi hệ thống khi lưu khóa tích hợp" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const auth = await requireAuth(request, 'SUPER_ADMIN');
  if ('errorResponse' in auth) {
    return auth.errorResponse;
  }

  const ip = getClientIp(request);
  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { success: false, error: "Quá nhiều yêu cầu. Vui lòng thử lại sau 1 phút." },
      { status: 429 }
    );
  }

  try {
    const body = await request.json();
    const parsed = DeleteIntegrationSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message || "Dữ liệu không hợp lệ" },
        { status: 400 }
      );
    }

    const { key } = parsed.data;

    deleteIntegration(key);
    logIntegrationAudit(auth.user.username, "delete", key, ip);
    revalidateIntegrationsCache();

    return NextResponse.json({
      success: true,
      message: `Đã xóa/làm trống khóa tích hợp "${key}" thành công.`,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Lỗi khi xóa khóa tích hợp" },
      { status: 500 }
    );
  }
}
