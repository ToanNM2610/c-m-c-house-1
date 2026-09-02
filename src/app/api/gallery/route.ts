import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "src/data/gallery.json");
const UPLOAD_DIR = path.join(process.cwd(), "public/uploads/gallery");

interface GalleryImage {
  id: string;
  url: string;
  caption: string;
}

// Hàm hỗ trợ đọc dữ liệu JSON
async function readGalleryData(): Promise<GalleryImage[]> {
  try {
    const data = await fs.readFile(DATA_FILE, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Lỗi đọc file JSON:", error);
    return [];
  }
}

// Hàm hỗ trợ ghi dữ liệu JSON
async function writeGalleryData(data: GalleryImage[]) {
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), "utf8");
}

export async function GET() {
  const images = await readGalleryData();
  return NextResponse.json({ images });
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const files = formData.getAll("files") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "Không có file nào được tải lên." }, { status: 400 });
    }

    // Đảm bảo thư mục upload tồn tại
    try {
      await fs.access(UPLOAD_DIR);
    } catch {
      await fs.mkdir(UPLOAD_DIR, { recursive: true });
    }

    const currentImages = await readGalleryData();
    const newImages: GalleryImage[] = [];

    for (const file of files) {
      if (!file.type.startsWith("image/")) continue;

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uniqueId = Date.now().toString() + "-" + Math.round(Math.random() * 1e9);
      const ext = path.extname(file.name) || ".jpg";
      const filename = `${uniqueId}${ext}`;
      const filePath = path.join(UPLOAD_DIR, filename);

      await fs.writeFile(filePath, buffer);

      const newImage: GalleryImage = {
        id: uniqueId,
        url: `/uploads/gallery/${filename}`,
        caption: file.name.split('.')[0]
      };
      
      newImages.push(newImage);
    }

    // Cập nhật Database JSON
    const updatedImages = [...newImages, ...currentImages];
    await writeGalleryData(updatedImages);

    return NextResponse.json({ success: true, newImages, allImages: updatedImages });
  } catch (error) {
    console.error("Lỗi tải ảnh:", error);
    return NextResponse.json({ error: "Lỗi hệ thống khi tải ảnh." }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: "Thiếu ID ảnh cần xóa." }, { status: 400 });

    const currentImages = await readGalleryData();
    const imageToDelete = currentImages.find(img => img.id === id);

    if (!imageToDelete) {
      return NextResponse.json({ error: "Không tìm thấy ảnh." }, { status: 404 });
    }

    // Xóa file vật lý nếu ảnh đó nằm trong thư mục uploads (không phải ảnh placeholder)
    if (imageToDelete.url.startsWith('/uploads/gallery/')) {
      const filename = path.basename(imageToDelete.url);
      const filePath = path.join(UPLOAD_DIR, filename);
      try {
        await fs.access(filePath);
        await fs.unlink(filePath);
      } catch (e) {
        console.warn("Không thể xóa file vật lý hoặc file không tồn tại:", filePath);
      }
    }

    // Cập nhật Database JSON
    const updatedImages = currentImages.filter(img => img.id !== id);
    await writeGalleryData(updatedImages);

    return NextResponse.json({ success: true, allImages: updatedImages });
  } catch (error) {
    console.error("Lỗi xóa ảnh:", error);
    return NextResponse.json({ error: "Lỗi hệ thống khi xóa ảnh." }, { status: 500 });
  }
}
