import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ reservations: [] });
}

export async function POST() {
  return NextResponse.json({ success: true, message: "Đã ghi nhận lời nhắn." });
}
