import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const files = formData.getAll("files") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files uploaded" }, { status: 400 });
    }

    // Ensure the uploads directory exists
    const uploadDir = path.join(process.cwd(), "public/uploads");
    try {
      await fs.access(uploadDir);
    } catch {
      await fs.mkdir(uploadDir, { recursive: true });
    }

    const uploadedUrls: string[] = [];

    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Create a unique filename
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const ext = path.extname(file.name) || ".jpg";
      const filename = `${uniqueSuffix}${ext}`;
      const filePath = path.join(uploadDir, filename);

      await fs.writeFile(filePath, buffer);
      
      // The public URL to access the file
      uploadedUrls.push(`/uploads/${filename}`);
    }

    return NextResponse.json({ urls: uploadedUrls });
  } catch (error) {
    console.error("Error uploading files:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
