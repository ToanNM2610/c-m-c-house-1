import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const dataFilePath = path.join(process.cwd(), "src/data/users.json");

async function getUsers() {
  try {
    const data = await fs.readFile(dataFilePath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

async function saveUsers(users: any) {
  await fs.writeFile(dataFilePath, JSON.stringify(users, null, 2));
}

export async function GET() {
  const users = await getUsers();
  return NextResponse.json({ users });
}

export async function POST(request: Request) {
  const body = await request.json();
  const { username, fullName, email, password, role } = body;

  if (!username || !email || !role) {
    return NextResponse.json({ error: "Thiếu trường bắt buộc" }, { status: 400 });
  }

  const users = await getUsers();
  const newUser = {
    id: `u${Date.now()}`,
    username,
    fullName,
    email,
    role,
    avatar: `https://placehold.co/100x100/292524/a8a29e?text=${username.charAt(0).toUpperCase()}`,
    postCount: 0
  };

  users.push(newUser);
  await saveUsers(users);
  
  return NextResponse.json({ success: true, user: newUser });
}

export async function PUT(request: Request) {
  const body = await request.json();
  const { id, username, fullName, email, role } = body;

  if (!id) {
    return NextResponse.json({ error: "Thiếu ID" }, { status: 400 });
  }

  const users = await getUsers();
  const index = users.findIndex((u: any) => u.id === id);
  if (index === -1) {
    return NextResponse.json({ error: "Không tìm thấy user" }, { status: 404 });
  }

  users[index] = { ...users[index], username, fullName, email, role };
  await saveUsers(users);

  return NextResponse.json({ success: true });
}

export async function DELETE(request: Request) {
  const { id, ids } = await request.json();
  let users = await getUsers();

  if (ids && Array.isArray(ids)) {
    users = users.filter((u: any) => !ids.includes(u.id));
  } else if (id) {
    users = users.filter((u: any) => u.id !== id);
  } else {
    return NextResponse.json({ error: "Thiếu ID để xóa" }, { status: 400 });
  }

  await saveUsers(users);
  return NextResponse.json({ success: true });
}
