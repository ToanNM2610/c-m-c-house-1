import { SPACE_ITEMS, SpaceItem } from "@/data/space";

export const EXPECTED_SPACE_PHOTOS = 30;
export const PHOTOS_PER_STAGE = 6;

export interface SpatialPhoto {
  id: string;
  orderNumber: string;
  src: string;
  titleVi: string;
  titleEn: string;
  captionVi: string;
  captionEn: string;
  altVi: string;
  altEn: string;
  category: string[];
  tag?: string;
}

export interface SpatialStage {
  stageNumber: string;
  rangeLabel: string;
  photos: SpatialPhoto[];
}

export interface SpatialGalleryState {
  connected: boolean;
  statusLabel: string;
  stages: SpatialStage[];
  photos: SpatialPhoto[];
  totalCount: number;
}

export function groupIntoSpatialStages(photos: SpatialPhoto[]): SpatialStage[] {
  const stages: SpatialStage[] = [];
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

/**
 * Nạp trực tiếp 30 ảnh không gian chuẩn hóa
 */
export function getSpatialGalleryState(spaceList: SpaceItem[] = SPACE_ITEMS): SpatialGalleryState {
  if (!spaceList || spaceList.length === 0) {
    return {
      connected: false,
      statusLabel: "Chưa kết nối",
      stages: [],
      photos: [],
      totalCount: 0,
    };
  }

  const normalizedPhotos: SpatialPhoto[] = spaceList.slice(0, EXPECTED_SPACE_PHOTOS).map((item, idx) => {
    const orderNum = String(idx + 1).padStart(2, "0");
    const title = item.title || `Không gian #${orderNum}`;
    const caption = item.description || item.subtitle || "";

    return {
      id: item.id || `space-${orderNum}`,
      orderNumber: orderNum,
      src: item.image,
      titleVi: title,
      titleEn: title,
      captionVi: caption,
      captionEn: caption,
      altVi: `Cẩm Cù House - ${title}`,
      altEn: `Cẩm Cù House - ${title}`,
      category: Array.isArray(item.category) ? item.category : [String(item.category)],
      tag: item.tag,
    };
  });

  return {
    connected: true,
    statusLabel: "Đã kết nối",
    stages: groupIntoSpatialStages(normalizedPhotos),
    photos: normalizedPhotos,
    totalCount: normalizedPhotos.length,
  };
}

