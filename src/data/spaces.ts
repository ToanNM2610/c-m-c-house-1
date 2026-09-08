export type SpaceCategory = "stream" | "veranda" | "flower" | "festive" | "peaceful";
export type AspectRatio = "tall" | "wide" | "square";

export interface SpacePhoto {
  id: string;
  src: string;
  titleVi: string;
  titleEn: string;
  category: SpaceCategory;
  aspectRatio: AspectRatio;
}

// Generate 30 photos
const generatePhotos = (): SpacePhoto[] => {
  const photos: SpacePhoto[] = [];
  
  const categories: { cat: SpaceCategory; titleVi: string; titleEn: string }[] = [
    { cat: "stream", titleVi: "Bờ Suối Thung Lũng", titleEn: "Valley Stream" },
    { cat: "veranda", titleVi: "Hiên Gỗ Đón Nắng", titleEn: "Sunlit Veranda" },
    { cat: "flower", titleVi: "Góc Hoa Cẩm Cù", titleEn: "Hoya Corner" },
    { cat: "festive", titleVi: "Góc Đèn Lồng Rực Rỡ", titleEn: "Festive Lanterns" },
    { cat: "peaceful", titleVi: "Góc Nhỏ An Yên", titleEn: "Peaceful Nook" },
  ];

  for (let i = 1; i <= 30; i++) {
    const catIndex = (i - 1) % categories.length;
    const cat = categories[catIndex];
    let aspect: AspectRatio = "wide";
    
    // Mix aspect ratios for masonry
    if (i % 3 === 0) aspect = "tall";
    else if (i % 5 === 0) aspect = "square";

    photos.push({
      id: `sp-${i}`,
      src: `/images/spaces/1 (${i}).jpg`,
      titleVi: `${cat.titleVi} ${Math.ceil(i/5)}`,
      titleEn: `${cat.titleEn} ${Math.ceil(i/5)}`,
      category: cat.cat,
      aspectRatio: aspect,
    });
  }
  
  return photos;
};

export const SPACE_PHOTOS = generatePhotos();
