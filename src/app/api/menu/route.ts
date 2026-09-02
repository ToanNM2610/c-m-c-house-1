import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const dataFilePath = path.join(process.cwd(), "src/data/menu.json");

async function getMenu() {
  try {
    const data = await fs.readFile(dataFilePath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

async function saveMenu(menu: any) {
  await fs.writeFile(dataFilePath, JSON.stringify(menu, null, 2));
}

export async function GET() {
  const menu = await getMenu();
  return NextResponse.json({ menu });
}

export async function POST(request: Request) {
  const body = await request.json();
  const { name, price, category, inStock } = body;

  if (!name || !price || !category) {
    return NextResponse.json({ error: "Thiếu thông tin bắt buộc" }, { status: 400 });
  }

  const menu = await getMenu();
  const newItem = {
    id: `m${Date.now()}`,
    name,
    price,
    category,
    inStock: inStock !== undefined ? inStock : true
  };

  menu.push(newItem);
  await saveMenu(menu);
  
  return NextResponse.json({ success: true, item: newItem });
}

export async function PUT(request: Request) {
  const body = await request.json();
  const { id, name, price, category, inStock } = body;

  if (!id) {
    return NextResponse.json({ error: "Thiếu ID" }, { status: 400 });
  }

  const menu = await getMenu();
  const index = menu.findIndex((item: any) => item.id === id);
  if (index === -1) {
    return NextResponse.json({ error: "Không tìm thấy món" }, { status: 404 });
  }

  menu[index] = { ...menu[index], name, price, category, inStock };
  await saveMenu(menu);

  return NextResponse.json({ success: true });
}

export async function DELETE(request: Request) {
  const { id, ids } = await request.json();
  let menu = await getMenu();

  if (ids && Array.isArray(ids)) {
    menu = menu.filter((item: any) => !ids.includes(item.id));
  } else if (id) {
    menu = menu.filter((item: any) => item.id !== id);
  } else {
    return NextResponse.json({ error: "Thiếu ID để xóa" }, { status: 400 });
  }

  await saveMenu(menu);
  return NextResponse.json({ success: true });
}
