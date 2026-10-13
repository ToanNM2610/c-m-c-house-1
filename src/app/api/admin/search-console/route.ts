import { NextRequest, NextResponse } from "next/server";
import { fetchSearchConsoleData, SearchConsoleReportData } from "@/lib/google-apis";

// 10-minute cache for Google Search Console API responses
interface CachedReport {
  timestamp: number;
  data: SearchConsoleReportData;
}
const reportCache = new Map<number, CachedReport>();
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const daysParam = parseInt(searchParams.get("days") || "7", 10);
    const days = [7, 28, 90].includes(daysParam) ? daysParam : 7;
    const forceRefresh = searchParams.get("refresh") === "1";

    const cached = reportCache.get(days);
    const now = Date.now();

    if (!forceRefresh && cached && now - cached.timestamp < CACHE_TTL_MS) {
      return NextResponse.json({
        success: true,
        cached: true,
        cacheAgeSeconds: Math.round((now - cached.timestamp) / 1000),
        data: cached.data,
      });
    }

    const data = await fetchSearchConsoleData(days);

    if (data.connected) {
      reportCache.set(days, { timestamp: now, data });
    }

    return NextResponse.json({
      success: true,
      cached: false,
      data,
    });
  } catch (error) {
    console.error("[Search Console API]", error);
    return NextResponse.json(
      { success: false, error: "Lỗi tải dữ liệu Google Search Console" },
      { status: 500 }
    );
  }
}
