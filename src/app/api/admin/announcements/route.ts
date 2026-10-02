import { NextRequest, NextResponse } from "next/server";
import { getAnnouncements, addAnnouncement, deleteAnnouncement } from "@/data/store";

export async function GET() {
  try {
    const announcements = getAnnouncements();
    return NextResponse.json({
      success: true,
      announcements,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Lỗi tải danh sách bảng tin" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, content, type = "event", isHighlighted = false } = body;

    if (!title || !content) {
      return NextResponse.json(
        { success: false, error: "Vui lòng nhập đầy đủ tiêu đề và nội dung" },
        { status: 400 }
      );
    }

    const newAnnouncement = addAnnouncement({
      title,
      content,
      type,
      isHighlighted,
    });

    return NextResponse.json({
      success: true,
      message: "Đã thêm tin thông báo mới thành công",
      announcement: newAnnouncement,
      announcements: getAnnouncements(),
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Lỗi tạo thông báo mới" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    let id = searchParams.get("id");

    if (!id) {
      const body = await request.json().catch(() => ({}));
      id = body.id;
    }

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Thiếu ID bản tin cần xóa" },
        { status: 400 }
      );
    }

    const isDeleted = deleteAnnouncement(id);

    return NextResponse.json({
      success: isDeleted,
      message: isDeleted ? "Đã xóa bản tin thành công" : "Không tìm thấy bản tin cần xóa",
      announcements: getAnnouncements(),
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Lỗi xóa thông báo" },
      { status: 500 }
    );
  }
}
