import { NextRequest, NextResponse } from "next/server";
import { getGalleryPhotos, addGalleryPhoto, deleteGalleryPhoto } from "@/data/store";

export async function GET() {
  try {
    const photos = getGalleryPhotos();
    return NextResponse.json({
      success: true,
      photos,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Lỗi tải thư viện ảnh" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, url, category = "suoi" } = body;

    if (!title || !url) {
      return NextResponse.json(
        { success: false, error: "Vui lòng nhập đầy đủ tiêu đề và đường dẫn ảnh" },
        { status: 400 }
      );
    }

    const newPhoto = addGalleryPhoto({ title, url, category });

    return NextResponse.json({
      success: true,
      message: "Thêm ảnh vào thư viện thành công",
      photo: newPhoto,
      photos: getGalleryPhotos(),
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Lỗi thêm ảnh vào thư viện" },
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
        { success: false, error: "Thiếu ID ảnh cần xóa" },
        { status: 400 }
      );
    }

    const isDeleted = deleteGalleryPhoto(id);

    return NextResponse.json({
      success: isDeleted,
      message: isDeleted ? "Đã xóa ảnh khỏi thư viện" : "Không tìm thấy ảnh",
      photos: getGalleryPhotos(),
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Lỗi xóa ảnh" },
      { status: 500 }
    );
  }
}
