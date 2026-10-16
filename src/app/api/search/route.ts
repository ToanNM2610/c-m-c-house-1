import { NextRequest, NextResponse } from "next/server";
import { searchMenuItemsFromDb, searchGalleryItemsFromDb } from "@/lib/search";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || searchParams.get("query") || "";
    const type = searchParams.get("type") || "all"; // 'all' | 'menu' | 'space'
    const category = searchParams.get("category") || undefined;

    let menuResults: any[] = [];
    let spaceResults: any[] = [];

    if (type === "all" || type === "menu") {
      menuResults = await searchMenuItemsFromDb(query, { category });
    }

    if (type === "all" || type === "space") {
      spaceResults = await searchGalleryItemsFromDb(query, { category });
    }

    return NextResponse.json({
      success: true,
      query,
      type,
      totalMatches: menuResults.length + spaceResults.length,
      menu: menuResults,
      space: spaceResults,
    });
  } catch (error) {
    console.error("[API Search Error]:", error);
    return NextResponse.json(
      { success: false, error: "Lỗi trong quá trình tìm kiếm." },
      { status: 500 }
    );
  }
}
