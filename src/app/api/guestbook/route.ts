import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const dataFilePath = path.join(process.cwd(), "src/data/guestbook.json");

async function getGuestbook() {
  try {
    const data = await fs.readFile(dataFilePath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

async function saveGuestbook(items: any[]) {
  await fs.writeFile(dataFilePath, JSON.stringify(items, null, 2), "utf8");
}

export async function GET() {
  const entries = await getGuestbook();
  return NextResponse.json({ entries });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, from, message } = body;

    if (!name || !message) {
      return NextResponse.json({ error: "Thiếu tên hoặc lời nhắn" }, { status: 400 });
    }

    const entries = await getGuestbook();
    const newEntry = {
      id: `gb-${Date.now()}`,
      name: name.trim(),
      from: from ? from.trim() : "Lữ khách phương xa",
      message: message.trim(),
      isFavorite: false,
      createdAt: new Date().toISOString()
    };

    entries.unshift(newEntry);
    await saveGuestbook(entries);

    return NextResponse.json({ success: true, item: newEntry });
  } catch (error) {
    return NextResponse.json({ error: "Lỗi lưu lời nhắn lưu bút" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, isFavorite } = body;

    if (!id) {
      return NextResponse.json({ error: "Thiếu ID" }, { status: 400 });
    }

    const entries = await getGuestbook();
    const index = entries.findIndex((e: any) => e.id === id);
    if (index === -1) {
      return NextResponse.json({ error: "Không tìm thấy lời nhắn" }, { status: 404 });
    }

    entries[index] = {
      ...entries[index],
      isFavorite: isFavorite !== undefined ? isFavorite : !entries[index].isFavorite
    };
    await saveGuestbook(entries);

    return NextResponse.json({ success: true, item: entries[index] });
  } catch (error) {
    return NextResponse.json({ error: "Lỗi cập nhật lời nhắn" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ error: "Thiếu ID" }, { status: 400 });
    }

    let entries = await getGuestbook();
    entries = entries.filter((e: any) => e.id !== id);
    await saveGuestbook(entries);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Lỗi xóa lời nhắn" }, { status: 500 });
  }
}
