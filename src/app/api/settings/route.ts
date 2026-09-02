import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "src/data/settings.json");

async function readSettingsData() {
  try {
    const data = await fs.readFile(DATA_FILE, "utf8");
    return JSON.parse(data);
  } catch (error) {
    return {};
  }
}

async function writeSettingsData(data: any) {
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), "utf8");
}

export async function GET() {
  const settings = await readSettingsData();
  return NextResponse.json(settings);
}

export async function POST(req: Request) {
  try {
    const body = await req.json(); // { type: 'appearance' | 'translations' | 'smtp', data: {} }
    const currentSettings = await readSettingsData();
    
    if (body.type && body.data) {
      currentSettings[body.type] = { ...currentSettings[body.type], ...body.data };
      await writeSettingsData(currentSettings);
      return NextResponse.json({ success: true, settings: currentSettings });
    }
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: "Lỗi cập nhật cài đặt" }, { status: 500 });
  }
}
