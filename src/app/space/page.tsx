"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Wifi,
  Car,
  Trees,
  Dog,
  Briefcase,
  X,
  Eye,
  Sparkles,
  Compass,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface SpaceItem {
  id: string;
  category: "Sân Vườn / Ngoài Trời" | "Trong Nhà Ấm Cúng" | "Bàn Làm Việc";
  titleVi: string;
  titleEn: string;
  descVi: string;
  descEn: string;
  image: string;
  aspect: string;
}

const SPACE_GALLERY: SpaceItem[] = [
  {
    id: "sp-1",
    category: "Sân Vườn / Ngoài Trời",
    titleVi: "Bờ Suối Đá Thung Lũng",
    titleEn: "Valley Pebble Brook",
    descVi: "Dòng suối trong vắt len lỏi qua bãi đá cuội rêu phong ngàn năm, nơi tiếng nước ngân nga xua tan mọi âu lo.",
    descEn: "Crystal-clear stream weaving over ancient mossy rocks.",
    image: "/uploads/gallery/1788250253551-943009233.jpg",
    aspect: "aspect-[4/3]",
  },
  {
    id: "sp-2",
    category: "Trong Nhà Ấm Cúng",
    titleVi: "Hiên Gỗ Đón Nắng Sớm",
    titleEn: "Sunlit Timber Veranda",
    descVi: "Góc hiên gỗ mộc ấm cúng đón trọn vạt nắng đầu ngày, ngát hương cà phê mới rang.",
    descEn: "Warm timber porch capturing morning light and coffee aroma.",
    image: "/uploads/gallery/1788250253554-875120458.jpg",
    aspect: "aspect-[3/4]",
  },
  {
    id: "sp-3",
    category: "Sân Vườn / Ngoài Trời",
    titleVi: "Thánh Đường Hoa Cẩm Cù",
    titleEn: "Indigenous Hoya Haven",
    descVi: "Hàng trăm loài hoa cẩm cù bản địa đơm bông hình ngôi sao sáp ngọc bích tỏa hương dịu mát.",
    descEn: "Clusters of wax flowers blooming with delicate fragrance.",
    image: "/uploads/gallery/1788250253557-29323827.jpg",
    aspect: "aspect-square",
  },
  {
    id: "sp-4",
    category: "Sân Vườn / Ngoài Trời",
    titleVi: "Bàn Đá Dưới Tán Râm",
    titleEn: "Canopy Shaded Table",
    descVi: "Góc ngồi lý tưởng dưới tán lá rừng xanh mát để đọc sách, trò chuyện và lắng nghe chim hót.",
    descEn: "Shaded forest clearing to read, talk, and relax.",
    image: "/uploads/gallery/1788250253560-200373033.jpg",
    aspect: "aspect-[4/5]",
  },
  {
    id: "sp-5",
    category: "Bàn Làm Việc",
    titleVi: "Bàn Làm Việc Yên Tĩnh Bên Cửa",
    titleEn: "Quiet Workspace by the Window",
    descVi: "Bàn gỗ tự nhiên với ánh sáng chan hòa, ổ cắm từng bàn và wifi tốc độ cao giúp bạn làm việc tập trung.",
    descEn: "Rustic desk, power outlet and fast wifi for focused, mindful work.",
    image: "/uploads/gallery/1788250253562-580915883.jpg",
    aspect: "aspect-[16/9]",
  },
  {
    id: "sp-6",
    category: "Sân Vườn / Ngoài Trời",
    titleVi: "Hoàng Hôn Nhuộm Đỏ Suối",
    titleEn: "Sunset Over Stream",
    descVi: "Ánh chiều tà buông xuống thung lũng tạo nên khung cảnh nên thơ tuyệt mỹ bên bờ suối.",
    descEn: "Amber dusk settling peacefully over the river valley.",
    image: "/uploads/gallery/1788250253564-115851131.jpg",
    aspect: "aspect-[4/3]",
  },
  {
    id: "sp-7",
    category: "Sân Vườn / Ngoài Trời",
    titleVi: "Lối Đi Ven Suối Thơ Mộng",
    titleEn: "Pebble Stream Path",
    descVi: "Những bậc đá tự nhiên uốn lượn theo bờ nước rợp bóng cây xanh cao nguyên.",
    descEn: "Natural stepping stones winding gracefully beside the brook.",
    image: "/uploads/gallery/1788250253566-618481408.jpg",
    aspect: "aspect-[3/4]",
  },
  {
    id: "sp-8",
    category: "Trong Nhà Ấm Cúng",
    titleVi: "Gian Phòng Trầm Ấm",
    titleEn: "Cozy Indoor Ambience",
    descVi: "Không gian trong nhà êm đềm với nội thất gỗ mộc, mùi hương cà phê và âm nhạc acoustic du dương.",
    descEn: "Gentle timber interiors filled with comforting coffee aroma.",
    image: "/uploads/gallery/1788250253568-69250175.jpg",
    aspect: "aspect-square",
  },
];

const AMENITIES = [
  {
    icon: Wifi,
    emoji: "📶",
    title: "Wifi tốc độ cao",
    desc: "Đường truyền cáp quang ổn định toàn bộ khuôn viên quán",
  },
  {
    icon: Briefcase,
    emoji: "🔌",
    title: "Ổ cắm điện từng bàn",
    desc: "Bố trí sẵn sàng cho laptop, điện thoại làm việc cả ngày",
  },
  {
    icon: Car,
    emoji: "🅿️",
    title: "Chỗ đậu xe máy/ô tô thoải mái",
    desc: "Bãi đỗ xe rộng rãi, an ninh và thuận tiện quay đầu ô tô",
  },
  {
    icon: Trees,
    emoji: "🌳",
    title: "Khu vực ngoài trời ven suối thoáng mát",
    desc: "Không khí tự nhiên trong lành, rợp bóng mát cây xanh",
  },
];

type FilterTab = "Tất cả" | "Sân Vườn / Ngoài Trời" | "Trong Nhà Ấm Cúng" | "Bàn Làm Việc";
const TABS: FilterTab[] = ["Tất cả", "Sân Vườn / Ngoài Trời", "Trong Nhà Ấm Cúng", "Bàn Làm Việc"];

export default function SpacePage() {
  const { lang } = useLanguage();
  const [activeTab, setActiveTab] = useState<FilterTab>("Tất cả");
  const [selectedSpot, setSelectedSpot] = useState<SpaceItem | null>(null);

  const filteredGallery = SPACE_GALLERY.filter((item) => {
    if (activeTab === "Tất cả") return true;
    return item.category === activeTab;
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedSpot(null);
    };
    if (selectedSpot) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [selectedSpot]);

  return (
    <div className="w-full bg-[#FDFBF7] text-[#222222]">
      
      {/* ========================================================= */}
      {/* 1. BANNER: KHÔNG GIAN & TRẢI NGHIỆM                      */}
      {/* ========================================================= */}
      <section className="relative py-24 sm:py-32 px-6 sm:px-12 flex items-center justify-center text-center overflow-hidden border-b border-[#EAE6DF]">
        <div className="absolute inset-0 z-0">
          <Image
            src="/uploads/gallery/1788250253551-943009233.jpg"
            alt="Không gian suối đá Cẩm Cù House"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#FDFBF7]/90 via-[#FDFBF7]/85 to-[#FDFBF7]" />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto space-y-4">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#2D4A3E]/10 border border-[#2D4A3E]/20 text-xs font-semibold text-[#2D4A3E]">
            <Compass size={14} className="text-[#C88A4B]" />
            <span>THÁNH ĐƯỜNG BÊN SUỐI ĐÁ</span>
          </span>

          <h1 className="font-serif text-4xl sm:text-6xl font-bold text-[#2D4A3E] tracking-tight">
            Không Gian &amp; Trải Nghiệm
          </h1>

          <p className="text-base sm:text-lg font-light text-[#222222]/80 leading-relaxed">
            Dạo bước qua từng góc hiên gỗ, suối đá cuội và khu vườn hoa cẩm cù rực
            rỡ. Mỗi góc nhỏ tại Cẩm Cù House đều mang đến sự thư thái tuyệt đối.
          </p>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 2. BỘ LỌC PHÂN LOẠI (FILTER TABS)                         */}
      {/* ========================================================= */}
      <section className="py-8 px-6 sm:px-12 max-w-7xl mx-auto flex justify-center">
        <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 p-1.5 rounded-full bg-[#EAE6DF]/60 border border-[#EAE6DF]">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer ${
                activeTab === tab
                  ? "bg-[#2D4A3E] text-white shadow-xs font-semibold"
                  : "text-[#222222]/70 hover:text-[#2D4A3E]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </section>

      {/* ========================================================= */}
      {/* 3. THƯ VIỆN MASONRY GRID (NEXT/IMAGE + LIGHTBOX)         */}
      {/* ========================================================= */}
      <section className="pb-24 px-6 sm:px-12 max-w-7xl mx-auto">
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          {filteredGallery.map((spot, idx) => (
            <div
              key={spot.id}
              onClick={() => setSelectedSpot(spot)}
              className="break-inside-avoid group card-warm overflow-hidden bg-white cursor-pointer relative"
            >
              {/* Khung ảnh Next/Image */}
              <div className={`relative w-full overflow-hidden ${spot.aspect} bg-[#FDFBF7]`}>
                <Image
                  src={spot.image}
                  alt={spot.titleVi}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  priority={idx < 2}
                  className="object-cover group-hover:scale-105 transition-transform duration-600 ease-out"
                />
              </div>

              {/* Chú thích thông tin */}
              <div className="p-5 space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#C88A4B] font-semibold block">
                  {spot.category}
                </span>

                <h3 className="font-serif text-xl font-bold text-[#2D4A3E] group-hover:text-[#C88A4B] transition-colors">
                  {lang === "en" ? spot.titleEn : spot.titleVi}
                </h3>

                <p className="text-xs font-light text-[#222222]/75 leading-relaxed line-clamp-2">
                  {lang === "en" ? spot.descEn : spot.descVi}
                </p>

                <div className="pt-2 flex items-center gap-1 text-xs font-medium text-[#2D4A3E] group-hover:translate-x-1 transition-transform">
                  <Eye size={13} />
                  <span>Xem ảnh lớn</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================= */}
      {/* 4. TIỆN ÍCH & DỊCH VỤ (HÀNG ICON RÕ NÉT)                  */}
      {/* ========================================================= */}
      <section className="py-20 bg-[#F7F4EE] px-6 sm:px-12 border-t border-[#EAE6DF]">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#C88A4B] font-semibold">
              TIỆN NGHI CHU ĐÁO
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#2D4A3E]">
              Tiện Ích &amp; Dịch Vụ
            </h2>
            <p className="text-sm font-light text-[#222222]/75">
              Được chuẩn bị tươm tất để bạn có trải nghiệm trọn vẹn và thoải mái
              nhất.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {AMENITIES.map((amenity, idx) => {
              const IconComp = amenity.icon;
              return (
                <div
                  key={idx}
                  className="bg-white p-6 rounded-2xl border border-[#EAE6DF] shadow-xs text-center flex flex-col items-center justify-center space-y-3 hover:border-[#C88A4B] transition-colors"
                >
                  <div className="w-14 h-14 rounded-2xl bg-[#2D4A3E]/10 border border-[#2D4A3E]/20 flex items-center justify-center text-2xl">
                    <span>{amenity.emoji}</span>
                  </div>
                  <h3 className="font-serif font-bold text-base text-[#2D4A3E]">
                    {amenity.title}
                  </h3>
                  <p className="text-xs font-light text-[#222222]/70 leading-relaxed">
                    {amenity.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* LIGHTBOX MODAL */}
      <AnimatePresence>
        {selectedSpot && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedSpot(null)}
            className="fixed inset-0 z-[9999] bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 sm:p-8 cursor-pointer"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl w-full bg-[#FDFBF7] rounded-3xl overflow-hidden shadow-2xl border border-[#EAE6DF] cursor-default"
            >
              <button
                onClick={() => setSelectedSpot(null)}
                aria-label="Đóng popup"
                className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-white/90 border border-[#EAE6DF] flex items-center justify-center text-[#222222] hover:text-[#2D4A3E] transition-colors shadow-md"
              >
                <X size={18} />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-12">
                <div className="md:col-span-7 relative aspect-[4/3] md:aspect-auto md:min-h-[420px] bg-black">
                  <Image
                    src={selectedSpot.image}
                    alt={selectedSpot.titleVi}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 60vw"
                  />
                </div>
                <div className="md:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-6">
                  <div className="space-y-3">
                    <span className="text-xs font-mono uppercase tracking-widest text-[#C88A4B] font-semibold block">
                      {selectedSpot.category}
                    </span>
                    <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#2D4A3E]">
                      {lang === "en" ? selectedSpot.titleEn : selectedSpot.titleVi}
                    </h3>
                    <p className="text-xs sm:text-sm font-light text-[#222222]/80 leading-relaxed pt-2">
                      {lang === "en" ? selectedSpot.descEn : selectedSpot.descVi}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#EAE6DF] text-xs text-[#2D4A3E]/70">
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
