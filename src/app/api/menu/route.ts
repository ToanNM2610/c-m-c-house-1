import { NextResponse } from "next/server";
import { MENU_ITEMS, MENU_CATEGORIES } from "@/data/menu";

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      categories: MENU_CATEGORIES,
      items: MENU_ITEMS,
      total: MENU_ITEMS.length,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Lỗi tải dữ liệu thực đơn" },
      { status: 500 }
    );
  }
}
