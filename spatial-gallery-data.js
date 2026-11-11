/**
 * SpatialGalleryData - Quản lý & bảo toàn 30 ảnh không gian của Cẩm Cù House
 * Nguồn đối chiếu duy nhất: camcu_raw_backup.json
 */

export const EXPECTED_SPACE_PHOTOS = 30;
export const PHOTOS_PER_STAGE = 6;

export async function loadSpatialGalleryData(backupUrl = "/camcu_raw_backup.json") {
  try {
    let rawData = null;

    // Hỗ trợ cả môi trường Browser (fetch) và môi trường Node.js (fs)
    if (typeof window !== "undefined" && typeof fetch === "function") {
      const response = await fetch(backupUrl, { cache: "no-cache" });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      rawData = await response.json();
    } else {
      // Môi trường Node / SSR
      try {
        const fs = await import("fs");
        const path = await import("path");
        const filePath = path.resolve(process.cwd(), backupUrl.replace(/^\//, ""));
        if (fs.existsSync(filePath)) {
          const content = fs.readFileSync(filePath, "utf-8");
          rawData = JSON.parse(content);
        } else {
          const rootFallback = path.resolve(process.cwd(), "camcu_raw_backup.json");
          if (fs.existsSync(rootFallback)) {
            rawData = JSON.parse(fs.readFileSync(rootFallback, "utf-8"));
          }
        }
      } catch {
        if (typeof fetch === "function" && backupUrl.startsWith("http")) {
          const res = await fetch(backupUrl);
          if (res.ok) rawData = await res.json();
        }
      }
    }

    const rawPhotos = Array.isArray(rawData?.space_items)
      ? rawData.space_items
      : Array.isArray(rawData?.spacePhotos)
        ? rawData.spacePhotos
        : Array.isArray(rawData?.gallery)
          ? rawData.gallery
          : Array.isArray(rawData?.images)
            ? rawData.images
            : [];

    if (rawPhotos.length === 0) {
      return {
        connected: false,
        statusLabel: "Chưa kết nối",
        stages: [],
        totalCount: 0,
      };
    }

    const normalizedPhotos = rawPhotos.slice(0, EXPECTED_SPACE_PHOTOS).map((photo, idx) => {
      const orderNum = String(idx + 1).padStart(2, "0");
      const title = photo.title ?? photo.titleVi ?? photo.title_vi ?? `Không gian #${orderNum}`;
      const caption = photo.description ?? photo.captionVi ?? photo.caption_vi ?? photo.descriptionVi ?? photo.subtitle ?? "";

      return {
        id: photo.id ?? `space-${orderNum}`,
        orderNumber: orderNum,
        src: photo.image ?? photo.src ?? photo.url ?? "",
        titleVi: title,
        titleEn: photo.titleEn ?? photo.title_en ?? title,
        captionVi: caption,
        captionEn: photo.descriptionEn ?? photo.captionEn ?? photo.caption_en ?? caption,
        altVi: photo.altVi ?? photo.alt_vi ?? photo.alt ?? `Cẩm Cù House - ${title}`,
        altEn: photo.altEn ?? photo.alt_en ?? photo.alt ?? `Cẩm Cù House - ${title}`,
      };
    });

    return {
      connected: true,
      statusLabel: "Đã kết nối",
      stages: groupIntoSpatialStages(normalizedPhotos),
      totalCount: normalizedPhotos.length,
    };
  } catch {
    return {
      connected: false,
      statusLabel: "Chưa kết nối",
      stages: [],
      totalCount: 0,
    };
  }
}

function groupIntoSpatialStages(photos) {
  const stages = [];
  for (let i = 0; i < photos.length; i += PHOTOS_PER_STAGE) {
    const chunk = photos.slice(i, i + PHOTOS_PER_STAGE);
    const stageIndex = Math.floor(i / PHOTOS_PER_STAGE) + 1;
    const startNum = String(i + 1).padStart(2, "0");
    const endNum = String(Math.min(i + PHOTOS_PER_STAGE, photos.length)).padStart(2, "0");

    stages.push({
      stageNumber: String(stageIndex).padStart(2, "0"),
      rangeLabel: `${startNum} — ${endNum}`,
      photos: chunk,
    });
  }
  return stages;
}

