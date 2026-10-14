import fs from "fs";
import path from "path";

const projectRoot = path.resolve(__dirname, "..");
const publicDir = path.join(projectRoot, "public");
const srcDir = path.join(projectRoot, "src");

interface ImageRef {
  file: string;
  line: number;
  url: string;
  exists: boolean;
}

const foundRefs: ImageRef[] = [];

function scanFile(filePath: string) {
  const content = fs.readFileSync(filePath, "utf-8");
  const lines = content.split("\n");

  const regex = /["'](\/(uploads|images|space)\/[^"']+\.(jpg|jpeg|png|webp|svg|gif|avif))["']/g;

  lines.forEach((line, index) => {
    let match;
    while ((match = regex.exec(line)) !== null) {
      const url = match[1];
      const localPath = path.join(publicDir, url.replace(/^\//, ""));
      const exists = fs.existsSync(localPath);
      foundRefs.push({
        file: path.relative(projectRoot, filePath),
        line: index + 1,
        url,
        exists,
      });
    }
  });
}

function traverseDir(dir: string) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== "node_modules" && entry.name !== ".next") {
        traverseDir(fullPath);
      }
    } else if (/\.(tsx|ts|jsx|js|json|css)$/.test(entry.name)) {
      scanFile(fullPath);
    }
  }
}

traverseDir(srcDir);

console.log("=== BÁO CÁO QUÉT ẢNH TOÀN DỰ ÁN ===");
console.log(`Tổng số lượt tham chiếu ảnh tìm thấy: ${foundRefs.length}`);

const broken = foundRefs.filter((r) => !r.exists);
console.log(`Số ảnh lỗi (404): ${broken.length}`);

if (broken.length > 0) {
  console.log("\nDANH SÁCH ẢNH LỖI:");
  broken.forEach((b) => {
    console.log(`- [${b.file}:${b.line}] ${b.url}`);
  });
} else {
  console.log("✓ Không phát hiện ảnh nào bị lỗi 404!");
}

// Kiểm tra 30 ảnh trong SPACE_ITEMS
import { SPACE_ITEMS } from "../src/data/space";
console.log(`\n=== KIỂM TRA 30 ẢNH KHÔNG GIAN SUỐI (SPACE_ITEMS) ===`);
let spaceBroken = 0;
SPACE_ITEMS.forEach((item, idx) => {
  const local = path.join(publicDir, item.image.replace(/^\//, ""));
  if (!fs.existsSync(local)) {
    console.log(`- [LỖI] Space #${idx + 1} (${item.title}): ${item.image} không tồn tại!`);
    spaceBroken++;
  }
});
if (spaceBroken === 0) {
  console.log(`✓ Toàn bộ 30/30 ảnh không gian suối tồn tại đầy đủ.`);
}
