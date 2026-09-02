import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "src/data/posts.json");
const UPLOAD_DIR = path.join(process.cwd(), "public/uploads/posts");

interface Post {
  id: string;
  title: string;
  coverImage: string;
  date: string;
  summary: string;
  content: string;
  category: string;
  status: string;
  author: string;
  seoKeyword?: string;
  seoTitle?: string;
  seoDescription?: string;
}

// Hàm hỗ trợ đọc dữ liệu JSON
async function readPostsData(): Promise<Post[]> {
  try {
    const data = await fs.readFile(DATA_FILE, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Lỗi đọc file JSON:", error);
    return [];
  }
}

// Hàm hỗ trợ ghi dữ liệu JSON
async function writePostsData(data: Post[]) {
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), "utf8");
}

export async function GET() {
  const posts = await readPostsData();
  return NextResponse.json({ posts });
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const title = formData.get("title") as string;
    const date = formData.get("date") as string;
    const summary = formData.get("summary") as string;
    const content = formData.get("content") as string;
    const category = formData.get("category") as string || "Chuyện Nhà";
    const status = formData.get("status") as string || "publish";
    const seoKeyword = formData.get("seoKeyword") as string || "";
    const seoTitle = formData.get("seoTitle") as string || "";
    const seoDescription = formData.get("seoDescription") as string || "";
    const coverImageFile = formData.get("coverImage") as File | string | null;

    if (!title || !date || !content) {
      return NextResponse.json({ error: "Thiếu trường bắt buộc." }, { status: 400 });
    }

    let coverImageUrl = "";

    if (coverImageFile && typeof coverImageFile === "object") {
      // Đảm bảo thư mục upload tồn tại
      try {
        await fs.access(UPLOAD_DIR);
      } catch {
        await fs.mkdir(UPLOAD_DIR, { recursive: true });
      }

      const bytes = await coverImageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uniqueId = Date.now().toString() + "-" + Math.round(Math.random() * 1e9);
      const ext = path.extname(coverImageFile.name) || ".jpg";
      const filename = `${uniqueId}${ext}`;
      const filePath = path.join(UPLOAD_DIR, filename);

      await fs.writeFile(filePath, buffer);
      coverImageUrl = `/uploads/posts/${filename}`;
    } else if (typeof coverImageFile === "string") {
      coverImageUrl = coverImageFile;
    }

    const currentPosts = await readPostsData();
    const newPost: Post = {
      id: Date.now().toString(),
      title,
      date,
      summary: summary || "",
      content,
      category,
      status,
      author: "admin",
      seoKeyword,
      seoTitle,
      seoDescription,
      coverImage: coverImageUrl || ""
    };

    const updatedPosts = [newPost, ...currentPosts];
    await writePostsData(updatedPosts);

    return NextResponse.json({ success: true, post: newPost });
  } catch (error) {
    console.error("Lỗi tạo bài viết:", error);
    return NextResponse.json({ error: "Lỗi hệ thống khi tạo bài viết." }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const formData = await req.formData();
    const id = formData.get("id") as string;
    const title = formData.get("title") as string;
    const date = formData.get("date") as string;
    const summary = formData.get("summary") as string;
    const content = formData.get("content") as string;
    const category = formData.get("category") as string || "Chuyện Nhà";
    const status = formData.get("status") as string || "publish";
    const seoKeyword = formData.get("seoKeyword") as string || "";
    const seoTitle = formData.get("seoTitle") as string || "";
    const seoDescription = formData.get("seoDescription") as string || "";
    const coverImageFile = formData.get("coverImage") as File | string | null;

    if (!id || !title || !date || !content) {
      return NextResponse.json({ error: "Thiếu trường bắt buộc." }, { status: 400 });
    }

    const currentPosts = await readPostsData();
    const postIndex = currentPosts.findIndex(p => p.id === id);

    if (postIndex === -1) {
      return NextResponse.json({ error: "Không tìm thấy bài viết." }, { status: 404 });
    }

    let coverImageUrl = currentPosts[postIndex].coverImage;

    if (coverImageFile && typeof coverImageFile === "object") {
      // Đảm bảo thư mục upload tồn tại
      try {
        await fs.access(UPLOAD_DIR);
      } catch {
        await fs.mkdir(UPLOAD_DIR, { recursive: true });
      }

      const bytes = await coverImageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uniqueId = Date.now().toString() + "-" + Math.round(Math.random() * 1e9);
      const ext = path.extname(coverImageFile.name) || ".jpg";
      const filename = `${uniqueId}${ext}`;
      const filePath = path.join(UPLOAD_DIR, filename);

      await fs.writeFile(filePath, buffer);
      
      // Xóa ảnh cũ nếu là ảnh cục bộ
      if (coverImageUrl.startsWith('/uploads/posts/')) {
        const oldFilePath = path.join(process.cwd(), 'public', coverImageUrl);
        fs.unlink(oldFilePath).catch(err => console.error("Không thể xóa file cũ:", err));
      }

      coverImageUrl = `/uploads/posts/${filename}`;
    } else if (typeof coverImageFile === "string") {
      coverImageUrl = coverImageFile; // Nhận cả chuỗi rỗng để xóa ảnh
    }

    currentPosts[postIndex] = {
      ...currentPosts[postIndex],
      title,
      date,
      summary: summary || "",
      content,
      category,
      status,
      seoKeyword,
      seoTitle,
      seoDescription,
      coverImage: coverImageUrl
    };

    await writePostsData(currentPosts);

    return NextResponse.json({ success: true, post: currentPosts[postIndex] });
  } catch (error) {
    console.error("Lỗi cập nhật bài viết:", error);
    return NextResponse.json({ error: "Lỗi hệ thống khi cập nhật bài viết." }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { id, ids } = await req.json();
    if (!id && (!ids || ids.length === 0)) return NextResponse.json({ error: "Thiếu ID bài viết cần xóa." }, { status: 400 });

    const currentPosts = await readPostsData();
    let updatedPosts = [...currentPosts];
    const targetIds = ids || [id];

    for (const targetId of targetIds) {
      const postToDelete = updatedPosts.find(p => p.id === targetId);
      if (postToDelete && postToDelete.coverImage.startsWith('/uploads/posts/')) {
        const filePath = path.join(process.cwd(), 'public', postToDelete.coverImage);
        try {
          await fs.unlink(filePath);
        } catch (err) {
          console.error("Không thể xóa file vật lý:", err);
        }
      }
    }

    updatedPosts = updatedPosts.filter(p => !targetIds.includes(p.id));
    await writePostsData(updatedPosts);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Lỗi xóa bài viết:", error);
    return NextResponse.json({ error: "Lỗi hệ thống khi xóa bài viết." }, { status: 500 });
  }
}
