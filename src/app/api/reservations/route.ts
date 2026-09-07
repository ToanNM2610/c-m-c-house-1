import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const dataFilePath = path.join(process.cwd(), "src/data/reservations.json");

async function getReservations() {
  try {
    const data = await fs.readFile(dataFilePath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

async function saveReservations(items: any[]) {
  await fs.writeFile(dataFilePath, JSON.stringify(items, null, 2), "utf8");
}

export async function GET() {
  const reservations = await getReservations();
  return NextResponse.json({ reservations });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone, email, date, time, guests, note } = body;

    if (!name || !phone) {
      return NextResponse.json({ error: "Thiếu thông tin tên và số điện thoại" }, { status: 400 });
    }

    const reservations = await getReservations();
    const newReservation = {
      id: `res-${Date.now()}`,
      name,
      phone,
      email: email || "",
      date: date || new Date().toISOString().split("T")[0],
      time: time || "09:00",
      guests: guests || 2,
      note: note || "",
      status: "pending",
      createdAt: new Date().toISOString()
    };

    reservations.unshift(newReservation);
    await saveReservations(reservations);

    return NextResponse.json({ success: true, item: newReservation });
  } catch (error) {
    return NextResponse.json({ error: "Lỗi lưu yêu cầu đặt bàn" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ error: "Thiếu ID hoặc trạng thái" }, { status: 400 });
    }

    const reservations = await getReservations();
    const index = reservations.findIndex((r: any) => r.id === id);
    if (index === -1) {
      return NextResponse.json({ error: "Không tìm thấy yêu cầu" }, { status: 404 });
    }

    reservations[index] = { ...reservations[index], status };
    await saveReservations(reservations);

    return NextResponse.json({ success: true, item: reservations[index] });
  } catch (error) {
    return NextResponse.json({ error: "Lỗi cập nhật yêu cầu" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ error: "Thiếu ID" }, { status: 400 });
    }

    let reservations = await getReservations();
    reservations = reservations.filter((r: any) => r.id !== id);
    await saveReservations(reservations);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Lỗi xóa yêu cầu" }, { status: 500 });
  }
}
