import { NextRequest, NextResponse } from "next/server";
import rawBackupData from "@/data/backup/camcu_raw_backup.json";

// In-memory overrides store: { [sectionKey: string]: { vi: Record<string, any>; en: Record<string, any> } }
let sectionOverrides: Record<string, { vi?: Record<string, string>; en?: Record<string, string> }> = {};

export async function GET() {
  try {
    const rawBlocks = (rawBackupData as any).content_blocks || { vi: {}, en: {} };
    const mergedBlocks = {
      vi: { ...rawBlocks.vi },
      en: { ...rawBlocks.en },
    };

    // Apply any active overrides
    Object.entries(sectionOverrides).forEach(([section, override]) => {
      if (override.vi) {
        mergedBlocks.vi[section] = { ...(mergedBlocks.vi[section] || {}), ...override.vi };
      }
      if (override.en) {
        mergedBlocks.en[section] = { ...(mergedBlocks.en[section] || {}), ...override.en };
      }
    });

    return NextResponse.json({
      success: true,
      content: mergedBlocks,
      sections: Object.keys(rawBlocks.vi || {}),
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Lỗi tải khối nội dung" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { section, key, value_vi, value_en } = body;

    if (!section || !key) {
      return NextResponse.json({ success: false, error: "Thiếu section hoặc key" }, { status: 400 });
    }

    if (!sectionOverrides[section]) {
      sectionOverrides[section] = { vi: {}, en: {} };
    }

    if (value_vi !== undefined) {
      if (!sectionOverrides[section].vi) sectionOverrides[section].vi = {};
      sectionOverrides[section].vi![key] = value_vi;
    }

    if (value_en !== undefined) {
      if (!sectionOverrides[section].en) sectionOverrides[section].en = {};
      sectionOverrides[section].en![key] = value_en;
    }

    return NextResponse.json({
      success: true,
      message: "Cập nhật nội dung thành công",
      updated: { section, key, value_vi, value_en },
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Lỗi lưu khối nội dung" }, { status: 500 });
  }
}
