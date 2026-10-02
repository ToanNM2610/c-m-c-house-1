import { NextRequest, NextResponse } from "next/server";
import { getMenuOverrides, updateMenuItemOverride, batchUpdateMenuOverrides } from "@/data/store";
import { MENU_ITEMS } from "@/data/menu";

export async function GET() {
  try {
    const overrides = getMenuOverrides();

    const mergedItems = MENU_ITEMS.map((item) => {
      const ov = overrides[item.id];
      return {
        ...item,
        inStock: ov ? ov.inStock : item.inStock ?? true,
        price: ov && typeof ov.price === "number" ? ov.price : item.price,
      };
    });

    return NextResponse.json({
      success: true,
      overrides,
      items: mergedItems,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Lỗi tải danh mục thực đơn" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Check if batch update
    if (body.overrides && typeof body.overrides === "object") {
      const updatedOverrides = batchUpdateMenuOverrides(body.overrides);
      return NextResponse.json({
        success: true,
        message: "Cập nhật danh sách món thành công",
        overrides: updatedOverrides,
      });
    }

    const { id, inStock, price } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Thiếu ID món cần cập nhật" },
        { status: 400 }
      );
    }

    const updated = updateMenuItemOverride(id, {
      ...(typeof inStock === "boolean" ? { inStock } : {}),
      ...(typeof price === "number" ? { price } : {}),
    });

    return NextResponse.json({
      success: true,
      message: `Đã cập nhật món #${id}`,
      item: { id, ...updated },
      overrides: getMenuOverrides(),
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Lỗi lưu trạng thái món ăn" },
      { status: 500 }
    );
  }
}
