import fs from 'fs';
import path from 'path';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌿 Starting Gallery Photo Import from ./hinh cam cu 2 ...');

  const sourceDir = path.join(process.cwd(), 'hinh cam cu 2');
  if (!fs.existsSync(sourceDir)) {
    console.error(`❌ Source directory not found: ${sourceDir}`);
    process.exit(1);
  }

  const destDir = path.join(process.cwd(), 'public', 'uploads', 'gallery');
  fs.mkdirSync(destDir, { recursive: true });

  const rawFiles = fs.readdirSync(sourceDir);
  const supportedExts = ['.jpg', '.jpeg', '.png', '.webp', '.avif'];
  const skippedFiles: string[] = [];
  const validFiles: string[] = [];

  for (const file of rawFiles) {
    const ext = path.extname(file).toLowerCase();
    if (supportedExts.includes(ext)) {
      validFiles.push(file);
    } else {
      skippedFiles.push(file);
    }
  }

  // Natural numeric sorting: 1 (1).jpg, 1 (2).jpg, ..., 1 (30).jpg, t8.jpg
  validFiles.sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

  console.log(`📸 Found ${validFiles.length} browser-compatible photos in "${sourceDir}"`);
  if (skippedFiles.length > 0) {
    console.warn(`⚠️ Skipped ${skippedFiles.length} unsupported files:`, skippedFiles);
  }

  // 1. Copy each file to public/uploads/gallery/fig-XX.<ext>
  const copiedAssets: {
    figId: string;
    filename: string;
    url: string;
    fileSize: number;
    mimeType: string;
  }[] = [];

  for (let i = 0; i < validFiles.length; i++) {
    const srcFile = validFiles[i];
    const srcPath = path.join(sourceDir, srcFile);
    const ext = path.extname(srcFile).toLowerCase();
    const figNum = String(i + 1).padStart(2, '0');
    const figId = `FIG. ${figNum}`;
    const destFilename = `fig-${figNum}${ext}`;
    const destPath = path.join(destDir, destFilename);

    fs.copyFileSync(srcPath, destPath);
    const stat = fs.statSync(destPath);
    const mimeType =
      ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg' : ext === '.png' ? 'image/png' : 'image/webp';

    copiedAssets.push({
      figId,
      filename: destFilename,
      url: `/uploads/gallery/${destFilename}`,
      fileSize: stat.size,
      mimeType,
    });

    console.log(
      `  ✓ [${figId}] Copied "${srcFile}" -> "public/uploads/gallery/${destFilename}" (${Math.round(stat.size / 1024)} KB)`
    );
  }

  // 2. Fetch existing spatial figures
  const existingFigures = await prisma.spatialFigure.findMany({
    orderBy: { id: 'asc' },
  });

  console.log(`\n🔄 Synchronizing with SQLite SpatialFigure (${existingFigures.length} existing records) ...`);

  for (let i = 0; i < copiedAssets.length; i++) {
    const asset = copiedAssets[i];
    if (i < existingFigures.length) {
      // Update existing record with real image URL
      const current = existingFigures[i];
      await prisma.spatialFigure.update({
        where: { id: current.id },
        data: {
          imageUrl: asset.url,
        },
      });
      console.log(`  ✓ Updated ${current.id} ("${current.titleVi}") -> ${asset.url}`);
    } else {
      // Create new figure record if count > 30 (e.g. FIG. 31)
      const newFig = await prisma.spatialFigure.create({
        data: {
          id: asset.figId,
          chapter: 4,
          chapterTitleVi: 'Chương IV — Chiều Buông & Đêm Cuối Tuần',
          chapterTitleEn: 'Chapter IV — Twilight & Weekend Nights',
          titleVi: 'Khoảnh Khắc Tĩnh Lặng Bên Bờ Suối',
          titleEn: 'Serene Evening by the Streamside',
          locationVi: 'Bờ suối Cẩm Cù House, Gia Nghĩa',
          locationEn: 'Streamside at Cẩm Cù House, Gia Nghia',
          descriptionVi:
            'Khoảnh khắc chuyển giao giữa hoàng hôn và đêm buông, ánh đèn vàng ấm áp lan tỏa khắp mặt suối róc rách.',
          descriptionEn:
            'The gentle transition between dusk and twilight, where warm lantern light reflects on the flowing water.',
          imageUrl: asset.url,
          aspectRatio: '4/3',
        },
      });
      console.log(`  ✓ Created extra plate ${newFig.id} ("${newFig.titleVi}") -> ${asset.url}`);
    }
  }

  // If fewer than existing, clean up remaining
  if (copiedAssets.length < existingFigures.length) {
    const leftovers = existingFigures.slice(copiedAssets.length);
    for (const left of leftovers) {
      await prisma.spatialFigure.delete({ where: { id: left.id } });
      console.log(`  🗑️ Removed leftover empty placeholder: ${left.id}`);
    }
  }

  // 3. Register all copied photos in MediaAsset table (CMS Media Library)
  console.log(`\n📚 Registering ${copiedAssets.length} photos into MediaAsset table (CMS Library) ...`);
  for (const asset of copiedAssets) {
    const fig = await prisma.spatialFigure.findUnique({ where: { id: asset.figId } });
    const altVi = fig?.titleVi || `Góc ảnh không gian Cẩm Cù House ${asset.figId}`;
    const altEn = fig?.titleEn || `Cẩm Cù House streamside view ${asset.figId}`;

    const existingAsset = await prisma.mediaAsset.findFirst({
      where: { url: asset.url },
    });

    if (existingAsset) {
      await prisma.mediaAsset.update({
        where: { id: existingAsset.id },
        data: {
          filename: asset.filename,
          fileType: asset.mimeType,
          fileSize: asset.fileSize,
          altVi,
          altEn,
        },
      });
    } else {
      await prisma.mediaAsset.create({
        data: {
          url: asset.url,
          folder: 'gallery',
          filename: asset.filename,
          fileType: asset.mimeType,
          fileSize: asset.fileSize,
          altVi,
          altEn,
        },
      });
    }
  }
  console.log(`  ✓ All ${copiedAssets.length} photos registered in MediaAsset table!`);

  // 4. Update SiteContent brandStoryImageUrl if empty or invalid
  const content = await prisma.siteContent.findUnique({ where: { id: 'default' } });
  if (content && (!content.brandStoryImageUrl || content.brandStoryImageUrl.trim() === '')) {
    await prisma.siteContent.update({
      where: { id: 'default' },
      data: {
        brandStoryImageUrl: copiedAssets[0]?.url || '/uploads/gallery/fig-01.jpg',
      },
    });
    console.log(`\n🎨 Set SiteContent.brandStoryImageUrl to ${copiedAssets[0]?.url}`);
  }

  console.log(`\n🎉 Gallery import completed successfully! Total imported: ${copiedAssets.length} photos.`);
}

main()
  .catch((e) => {
    console.error('Import error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

