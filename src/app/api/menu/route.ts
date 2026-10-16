import { NextRequest, NextResponse } from "next/server";
import { MENU_ITEMS, MENU_CATEGORIES } from "@/data/menu";
import { searchMenuItemsLocally } from "@/lib/search";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || searchParams.get("search") || "";
    const category = searchParams.get("category") || undefined;

    let items = MENU_ITEMS;
    if (query || category) {
      items = searchMenuItemsLocally(MENU_ITEMS, query, category);
    }

    return NextResponse.json({
      success: true,
      categories: MENU_CATEGORIES,
      items,
      total: items.length,
      query: query || undefined,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Lỗi tải dữ liệu thực đơn" },
      { status: 500 }
    );
  }
}
