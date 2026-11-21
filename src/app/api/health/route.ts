import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "camcu-cafe",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    timezone: "Asia/Ho_Chi_Minh",
  });
}
