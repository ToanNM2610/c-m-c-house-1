"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Wifi,
  Briefcase,
  Car,
  Trees,
  X,
  Eye,
  Compass,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

type FilterArea =
  | "Tất cả"
  | "Bờ suối ngoài trời"
  | "Hiên gỗ mộc"
  | "Góc hoa cẩm cù";

interface SpacePhoto {
  id: string;
  category: FilterArea;
  titleVi: string;
  titleEn: string;
  descVi: string;
  descEn: string;
  image: string;
  aspect: string;
}

const SPACE_PHOTOS: SpacePhoto[] = [
  {
    id: "sp-1",
    category: "Bờ suối ngoài trời",
    titleVi: "Bờ Suối Đá Thung Lũng",
    titleEn: "Valley Pebble Brook",
    descVi: "Dòng suối trong vắt len lỏi qua bãi đá cuội rêu phong ngàn năm, tiếng nước chảy róc rách xua tan mọi âu lo.",
    descEn: "Crystal-clear stream weaving over ancient mossy rocks.",
    image: "/uploads/gallery/1788250253551-943009233.jpg",
    aspect: "aspect-[4/3]",
  },
  {
    id: "sp-2",
    category: "Hiên gỗ mộc",
    titleVi: "Hiên Gỗ Đón Nắng Sớm",
    titleEn: "Sunlit Timber Veranda",
    descVi: "Góc hiên gỗ mộc ấm cúng đón trọn vạt nắng đầu ngày, ngát hương cà phê mới rang bên suối.",
    descEn: "Warm timber porch capturing morning light and coffee aroma.",
    image: "/uploads/gallery/1788250253554-875120458.jpg",
    aspect: "aspect-[3/4]",
  },
  {
    id: "sp-3",
    category: "Góc hoa cẩm cù",
    titleVi: "Thánh Đường Hoa Cẩm Cù",
    titleEn: "Indigenous Hoya Haven",
    descVi: "Hàng trăm loài hoa cẩm cù bản địa đơm bông hình ngôi sao sáp ngọc bích tỏa hương dịu mát tự nhiên.",
    descEn: "Clusters of wax flowers blooming with delicate fragrance.",
    image: "/uploads/gallery/1788250253557-29323827.jpg",
    aspect: "aspect-square",
  },
  {
    id: "sp-4",
    category: "Bờ suối ngoài trời",
    titleVi: "Bàn Đá Dưới Tán Râm",
    titleEn: "Canopy Shaded Table",
    descVi: "Góc ngồi lý tưởng dưới tán lá rừng xanh mát để đọc sách, trò chuyện và lắng nghe chim hót.",
    descEn: "Shaded forest clearing to read, talk, and relax.",
    image: "/uploads/gallery/1788250253560-200373033.jpg",
    aspect: "aspect-[4/5]",
  },
  {
    id: "sp-5",
    category: "Hiên gỗ mộc",
    titleVi: "Bàn Làm Việc Yên Tĩnh Bên Cửa",
    titleEn: "Quiet Workspace by the Window",
    descVi: "Bàn gỗ tự nhiên với ánh sáng chan hòa, ổ cắm từng bàn và wifi tốc độ cao giúp bạn làm việc tập trung.",
    descEn: "Rustic desk, power outlet and fast wifi for focused, mindful work.",
    image: "/uploads/gallery/1788250253562-580915883.jpg",
    aspect: "aspect-[16/9]",
  },
  {
    id: "sp-6",
    category: "Bờ suối ngoài trời",
    titleVi: "Hoàng Hôn Nhuộm Đỏ Suối",
    titleEn: "Sunset Over Stream",
    descVi: "Ánh chiều tà buông xuống thung lũng tạo nên khung cảnh nên thơ tuyệt mỹ bên bờ suối đá.",
    descEn: "Amber dusk settling peacefully over the river valley.",
    image: "/uploads/gallery/1788250253564-115851131.jpg",
    aspect: "aspect-[4/3]",
  },
  {
    id: "sp-7",
    category: "Bờ suối ngoài trời",
    titleVi: "Lối Đi Ven Suối Thơ Mộng",
    titleEn: "Pebble Stream Path",
    descVi: "Những bậc đá tự nhiên uốn lượn theo bờ nước rợp bóng thông và cây xanh cao nguyên.",
    descEn: "Natural stepping stones winding gracefully beside the brook.",
    image: "/uploads/gallery/1788250253566-618481408.jpg",
    aspect: "aspect-[3/4]",
  },
  {
    id: "sp-8",
    category: "Góc hoa cẩm cù",
    titleVi: "Khu Vườn Hoa Cẩm Cù Nở Rộ",
    titleEn: "Blooming Hoya Sanctuary",
    descVi: "Vườn hoa cẩm cù đón gió cao nguyên, không gian check-in chụp ảnh yêu thích của nhiều du khách.",
    descEn: "Lush botanical backdrop with blooming hoya wax flowers.",
    image: "/uploads/gallery/1788250253568-69250175.jpg",
    aspect: "aspect-square",
  },
];

const FILTER_TABS: FilterArea[] = [
  "Tất cả",
  "Bờ suối ngoài trời",
  "Hiên gỗ mộc",
  "Góc hoa cẩm cù",
];

const AMENITIES = [
  {
    icon: Wifi,
    emoji: "📶",
    title: "Wifi tốc độ cao",
    desc: "Phủ sóng internet cáp quang ổn định toàn bộ khu vực trong nhà và bờ suối",
  },
  {
    icon: Briefcase,
    emoji: "🔌",
    title: "Ổ cắm điện từng bàn",
    desc: "Bố trí chu đáo sẵn sàng cho laptop, máy ảnh và điện thoại làm việc cả ngày",
  },
  {
    icon: Car,
    emoji: "🅿️",
    title: "Chỗ đậu xe máy/ô tô thoải mái",
    desc: "Bãi đỗ xe rộng rãi, an ninh, bằng phẳng và thuận tiện quay đầu xe ô tô",
  },
  {
    icon: Trees,
    emoji: "🌳",
    title: "Khu vực ngoài trời ven suối thoáng mát",
    desc: "Không khí tự nhiên trong lành, rợp bóng mát cây xanh đại ngàn",
  },
];

export default function SpacePage() {
  const { lang } = useLanguage();
  const [activeTab, setActiveTab] = useState<FilterArea>("Tất cả");
  const [selectedPhoto, setSelectedPhoto] = useState<SpacePhoto | null>(null);

  const filteredPhotos = SPACE_PHOTOS.filter((photo) => {
    if (activeTab === "Tất cả") return true;
    return photo.category === activeTab;
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedPhoto(null);
    };
    if (selectedPhoto) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [selectedPhoto]);

  return (
    <div className="w-full text-[#FDFBF7]">
      {/* ========================================================= */}
      {/* 1. BANNER TIÊU ĐỀ KHÔNG GIAN                              */}
      {/* ========================================================= */}
      <section className="relative py-28 sm:py-36 px-6 sm:px-12 flex items-center justify-center text-center overflow-hidden border-b border-[#222520]">
        <div className="relative z-10 max-w-3xl mx-auto space-y-4">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1A1D17] border border-[#222520] text-xs font-mono text-[#C88A4B]">
            <Compass size={14} />
            <span>THÁNH ĐƯỜNG BÊN SUỐI ĐÁ</span>
          </span>

          <h1 className="font-serif text-4xl sm:text-6xl font-bold text-[#FDFBF7] tracking-tight">
            Không Gian &amp; Trải Nghiệm
          </h1>

          <p className="text-base sm:text-lg font-light text-[#FDFBF7]/80 leading-relaxed">
            Dạo bước qua từng góc hiên gỗ, suối đá cuội và khu vườn hoa cẩm cù rực
            rỡ. Mỗi góc nhỏ tại Cẩm Cù House đều mang đến sự thư thái tuyệt đối.
          </p>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 2. BỘ LỌC KHU VỰC (FILTER TABS)                           */}
      {/* ========================================================= */}
      <section className="py-8 px-6 sm:px-12 max-w-7xl mx-auto flex justify-center relative z-10">
        <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 p-1.5 rounded-full bg-[#1A1D17] border border-[#222520]">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer ${
                activeTab === tab
                  ? "bg-[#C88A4B] text-[#0C0D0B] font-bold shadow-xs"
                  : "text-[#FDFBF7]/70 hover:text-[#FDFBF7]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </section>

      {/* ========================================================= */}
      {/* 3. THƯ VIỆN MASONRY GRID & LIGHTBOX                      */}
      {/* ========================================================= */}
      <section className="pb-24 px-6 sm:px-12 max-w-7xl mx-auto relative z-10">
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          {filteredPhotos.map((photo, idx) => (
            <div
              key={photo.id}
              onClick={() => setSelectedPhoto(photo)}
              className="break-inside-avoid group card-dark overflow-hidden cursor-pointer relative"
            >
              {/* Ảnh tối ưu qua Next/Image */}
              <div className={`relative w-full overflow-hidden ${photo.aspect} bg-[#1A1D17]`}>
                <Image
                  src={photo.image}
                  alt={photo.titleVi}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  priority={idx < 2}
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
              </div>

              {/* Thông tin góc quán */}
              <div className="p-5 space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#C88A4B] font-semibold block">
                  {photo.category}
                </span>

                <h3 className="font-serif text-xl font-bold text-[#FDFBF7] group-hover:text-[#C88A4B] transition-colors">
                  {lang === "en" ? photo.titleEn : photo.titleVi}
                </h3>

                <p className="text-xs font-light text-[#FDFBF7]/70 leading-relaxed line-clamp-2">
                  {lang === "en" ? photo.descEn : photo.descVi}
                </p>

                <div className="pt-2 flex items-center gap-1.5 text-xs font-medium text-[#C88A4B] group-hover:translate-x-1 transition-transform">
                  <Eye size={13} />
                  <span>Xem ảnh lớn</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================= */}
      {/* 4. TIỆN ÍCH THỰC TẾ (4 BIỂU TƯỢNG RÕ NÉT)                */}
      {/* ========================================================= */}
      <section className="py-24 px-6 sm:px-12 border-t border-[#222520] relative z-10">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#C88A4B] font-semibold">
              TIỆN NGHI CHU ĐÁO
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#FDFBF7]">
              Tiện Ích &amp; Dịch Vụ
            </h2>
            <p className="text-sm font-light text-[#FDFBF7]/70">
              Được chuẩn bị tươm tất để bạn có trải nghiệm trọn vẹn và thoải mái nhất.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {AMENITIES.map((amenity, idx) => (
              <div
                key={idx}
                className="card-dark p-6 rounded-3xl text-center flex flex-col items-center justify-center space-y-3 hover:border-[#C88A4B] transition-colors"
              >
                <div className="w-14 h-14 rounded-2xl bg-[#1A1D17] border border-[#222520] flex items-center justify-center text-2xl">
                  <span>{amenity.emoji}</span>
                </div>
                <h3 className="font-serif font-bold text-base text-[#FDFBF7]">
                  {amenity.title}
                </h3>
                <p className="text-xs font-light text-[#FDFBF7]/70 leading-relaxed">
                  {amenity.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 5. LIGHTBOX MODAL PHÓNG TO ẢNH                           */}
      {/* ========================================================= */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedPhoto(null)}
            className="fixed inset-0 z-[9999] bg-[#0C0D0B]/90 flex items-center justify-center p-4 sm:p-8 cursor-pointer"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl w-full bg-[#141612] rounded-3xl overflow-hidden shadow-2xl border border-[#222520] cursor-default"
            >
              <button
                onClick={() => setSelectedPhoto(null)}
                aria-label="Đóng popup"
                className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-[#0C0D0B]/80 border border-[#222520] flex items-center justify-center text-[#FDFBF7] hover:text-[#C88A4B] transition-colors shadow-md cursor-pointer"
              >
                <X size={18} />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-12">
                <div className="md:col-span-7 relative aspect-[4/3] md:aspect-auto md:min-h-[420px] bg-black">
                  <Image
                    src={selectedPhoto.image}
                    alt={selectedPhoto.titleVi}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 60vw"
                  />
                </div>
                <div className="md:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-6">
                  <div className="space-y-3">
                    <span className="text-xs font-mono uppercase tracking-widest text-[#C88A4B] font-semibold block">
                      {photoCategoryLabel(selectedPhoto.category)}
                    </span>
                    <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#FDFBF7]">
                      {lang === "en" ? selectedPhoto.titleEn : selectedPhoto.titleVi}
                    </h3>
                    <p className="text-xs sm:text-sm font-light text-[#FDFBF7]/80 leading-relaxed pt-2">
                      {lang === "en" ? selectedPhoto.descEn : selectedPhoto.descVi}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#222520] text-xs text-[#C88A4B]">
                    Cẩm Cù House • Bờ suối đá Gia Nghĩa, Đắk Nông
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function photoCategoryLabel(cat: FilterArea) {
  return cat;
}
