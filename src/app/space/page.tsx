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

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1 },
  }),
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

interface SpacePhoto {
  id: string;
  categoryVi: string;
  categoryEn: string;
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
    categoryVi: "Bờ suối ngoài trời",
    categoryEn: "Outdoor Streamside",
    titleVi: "Bờ Suối Đá Thung Lũng",
    titleEn: "Valley Pebble Brook",
    descVi: "Dòng suối trong vắt len lỏi qua bãi đá cuội rêu phong ngàn năm, tiếng nước chảy róc rách xua tan mọi âu lo.",
    descEn: "Crystal-clear stream weaving over ancient mossy rocks.",
    image: "/uploads/gallery/1788250253551-943009233.jpg",
    aspect: "aspect-[4/3]",
  },
  {
    id: "sp-2",
    categoryVi: "Hiên gỗ mộc",
    categoryEn: "Timber Veranda",
    titleVi: "Hiên Gỗ Đón Nắng Sớm",
    titleEn: "Sunlit Timber Veranda",
    descVi: "Góc hiên gỗ mộc ấm cúng đón trọn vạt nắng đầu ngày, ngát hương cà phê mới rang bên suối.",
    descEn: "Warm timber porch capturing morning light and coffee aroma.",
    image: "/uploads/gallery/1788250253554-875120458.jpg",
    aspect: "aspect-[3/4]",
  },
  {
    id: "sp-3",
    categoryVi: "Góc hoa cẩm cù",
    categoryEn: "Hoya Garden",
    titleVi: "Thánh Đường Hoa Cẩm Cù",
    titleEn: "Indigenous Hoya Haven",
    descVi: "Hàng trăm loài hoa cẩm cù bản địa đơm bông hình ngôi sao sáp ngọc bích tỏa hương dịu mát tự nhiên.",
    descEn: "Clusters of wax flowers blooming with delicate fragrance.",
    image: "/uploads/gallery/1788250253557-29323827.jpg",
    aspect: "aspect-square",
  },
  {
    id: "sp-4",
    categoryVi: "Bờ suối ngoài trời",
    categoryEn: "Outdoor Streamside",
    titleVi: "Bàn Đá Dưới Tán Râm",
    titleEn: "Canopy Shaded Table",
    descVi: "Góc ngồi lý tưởng dưới tán lá rừng xanh mát để đọc sách, trò chuyện và lắng nghe chim hót.",
    descEn: "Shaded forest clearing to read, talk, and relax.",
    image: "/uploads/gallery/1788250253560-200373033.jpg",
    aspect: "aspect-[4/5]",
  },
  {
    id: "sp-5",
    categoryVi: "Hiên gỗ mộc",
    categoryEn: "Timber Veranda",
    titleVi: "Bàn Làm Việc Yên Tĩnh Bên Cửa",
    titleEn: "Quiet Workspace by the Window",
    descVi: "Bàn gỗ tự nhiên với ánh sáng chan hòa, ổ cắm từng bàn và wifi tốc độ cao giúp bạn làm việc tập trung.",
    descEn: "Rustic desk, power outlet and fast wifi for focused, mindful work.",
    image: "/uploads/gallery/1788250253562-580915883.jpg",
    aspect: "aspect-[16/9]",
  },
  {
    id: "sp-6",
    categoryVi: "Bờ suối ngoài trời",
    categoryEn: "Outdoor Streamside",
    titleVi: "Hoàng Hôn Nhuộm Đỏ Suối",
    titleEn: "Sunset Over Stream",
    descVi: "Ánh chiều tà buông xuống thung lũng tạo nên khung cảnh nên thơ tuyệt mỹ bên bờ suối đá.",
    descEn: "Amber dusk settling peacefully over the river valley.",
    image: "/uploads/gallery/1788250253564-115851131.jpg",
    aspect: "aspect-[4/3]",
  },
  {
    id: "sp-7",
    categoryVi: "Bờ suối ngoài trời",
    categoryEn: "Outdoor Streamside",
    titleVi: "Lối Đi Ven Suối Thơ Mộng",
    titleEn: "Pebble Stream Path",
    descVi: "Những bậc đá tự nhiên uốn lượn theo bờ nước rợp bóng thông và cây xanh cao nguyên.",
    descEn: "Natural stepping stones winding gracefully beside the brook.",
    image: "/uploads/gallery/1788250253566-618481408.jpg",
    aspect: "aspect-[3/4]",
  },
  {
    id: "sp-8",
    categoryVi: "Góc hoa cẩm cù",
    categoryEn: "Hoya Garden",
    titleVi: "Khu Vườn Hoa Cẩm Cù Nở Rộ",
    titleEn: "Blooming Hoya Sanctuary",
    descVi: "Vườn hoa cẩm cù đón gió cao nguyên, không gian check-in chụp ảnh yêu thích của nhiều du khách.",
    descEn: "Lush botanical backdrop with blooming hoya wax flowers.",
    image: "/uploads/gallery/1788250253568-69250175.jpg",
    aspect: "aspect-square",
  },
];

const FILTER_KEYS = ["All", "Stream", "Timber", "Hoya"] as const;

export default function SpacePage() {
  const { t, lang } = useLanguage();
  const [activeTab, setActiveTab] = useState<string>("All");
  const [selectedPhoto, setSelectedPhoto] = useState<SpacePhoto | null>(null);

  const getCategoryEn = (key: string) => {
    switch (key) {
      case "Stream": return "Outdoor Streamside";
      case "Timber": return "Timber Veranda";
      case "Hoya": return "Hoya Garden";
      default: return "All";
    }
  }

  const filteredPhotos = SPACE_PHOTOS.filter((photo) => {
    if (activeTab === "All") return true;
    return photo.categoryEn === getCategoryEn(activeTab);
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
      {/* 1. BANNER */}
      <section className="relative py-28 sm:py-36 px-6 sm:px-12 flex items-center justify-center text-center overflow-hidden border-b border-[#222520]">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="relative z-10 max-w-3xl mx-auto space-y-4"
        >
          <motion.span variants={fadeUp} custom={0} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1A1D17] border border-[#222520] text-xs font-mono text-[#C88A4B]">
            <Compass size={14} />
            <span>{t("space.heroTag")}</span>
          </motion.span>

          <motion.h1 variants={fadeUp} custom={1} className="font-serif text-4xl sm:text-6xl font-bold text-[#FDFBF7] tracking-tight">
            {t("space.heroTitle")}
          </motion.h1>

          <motion.p variants={fadeUp} custom={2} className="text-base sm:text-lg font-light text-[#FDFBF7]/80 leading-relaxed">
            {t("space.heroDesc")}
          </motion.p>
        </motion.div>
      </section>

      {/* 2. FILTER TABS */}
      <section className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-center relative z-10">
        <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 p-1.5 rounded-full bg-[#1A1D17] border border-[#222520]">
          {FILTER_KEYS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer ${
                activeTab === tab
                  ? "bg-[#C88A4B] text-[#0C0D0B] font-bold shadow-xs"
                  : "text-[#FDFBF7]/70 hover:text-[#FDFBF7]"
              }`}
            >
              {t(`space.filter${tab}`)}
            </button>
          ))}
        </div>
      </section>

      {/* 3. MASONRY GRID */}
      <section className="pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.05 }}
          variants={staggerContainer}
          className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 sm:gap-8 space-y-6 sm:space-y-8"
        >
          {filteredPhotos.map((photo, idx) => (
            <motion.div
              key={photo.id}
              variants={fadeUp}
              custom={idx}
              onClick={() => setSelectedPhoto(photo)}
              className="break-inside-avoid group relative rounded-2xl border border-white/10 shadow-2xl overflow-hidden cursor-pointer bg-[#0C0D0B] mb-6 sm:mb-8"
            >
              <div className={`relative w-full overflow-hidden ${photo.aspect} bg-[#1A1D17]`}>
                <Image
                  src={photo.image}
                  alt={photo.titleVi}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                  priority={idx < 2}
                  className="object-cover group-hover:scale-[1.02] transition-transform duration-500 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                
                <div className="absolute bottom-0 left-0 right-0 p-5 space-y-1.5 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#C88A4B] font-semibold block drop-shadow-md">
                    {lang === "en" ? photo.categoryEn : photo.categoryVi}
                  </span>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#FDFBF7] drop-shadow-md">
                    {lang === "en" ? photo.titleEn : photo.titleVi}
                  </h3>
                  <p className="text-xs font-light text-[#FDFBF7]/80 leading-relaxed line-clamp-2 drop-shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-75">
                    {lang === "en" ? photo.descEn : photo.descVi}
                  </p>
                  <div className="pt-2 flex items-center gap-1.5 text-xs font-medium text-[#C88A4B] opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-150">
                    <Eye size={13} />
                    <span>{t("space.viewPhoto")}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* 4. AMENITIES */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-[#222520] relative z-10">
        <div className="w-full space-y-12">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={staggerContainer}
            className="text-center max-w-2xl mx-auto space-y-3"
          >
            <motion.span variants={fadeUp} custom={0} className="text-xs font-mono uppercase tracking-[0.25em] text-[#C88A4B] font-semibold block">
              {t("space.amenitiesTag")}
            </motion.span>
            <motion.h2 variants={fadeUp} custom={1} className="font-serif text-3xl sm:text-4xl font-bold text-[#FDFBF7]">
              {t("space.amenitiesTitle")}
            </motion.h2>
            <motion.p variants={fadeUp} custom={2} className="text-sm font-light text-[#FDFBF7]/70">
              {t("space.amenitiesDesc")}
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {[1, 2, 3, 4].map((n, idx) => {
              const icons = [Wifi, Briefcase, Car, Trees];
              const emojis = ["📶", "🔌", "🅿️", "🌳"];
              const Icon = icons[idx];
              return (
                <motion.div
                  key={idx}
                  variants={fadeUp}
                  custom={idx}
                  className="card-dark p-6 rounded-3xl text-center flex flex-col items-center justify-center space-y-3 hover:border-[#C88A4B] transition-colors"
                >
                  <div className="w-14 h-14 rounded-2xl bg-[#1A1D17] border border-[#222520] flex items-center justify-center text-2xl">
                    <span>{emojis[idx]}</span>
                  </div>
                  <h3 className="font-serif font-bold text-base text-[#FDFBF7]">
                    {t(`space.am${n}Title`)}
                  </h3>
                  <p className="text-xs font-light text-[#FDFBF7]/70 leading-relaxed">
                    {t(`space.am${n}Desc`)}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* 5. LIGHTBOX MODAL */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedPhoto(null)}
            className="fixed inset-0 z-[9999] bg-[#0C0D0B]/90 flex items-center justify-center p-4 sm:p-8 cursor-pointer"
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl w-full bg-[#141612] rounded-3xl overflow-hidden shadow-2xl border border-[#222520] cursor-default"
            >
              <button
                onClick={() => setSelectedPhoto(null)}
                aria-label="Close popup"
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
                      {lang === "en" ? selectedPhoto.categoryEn : selectedPhoto.categoryVi}
                    </span>
                    <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#FDFBF7]">
                      {lang === "en" ? selectedPhoto.titleEn : selectedPhoto.titleVi}
                    </h3>
                    <p className="text-xs sm:text-sm font-light text-[#FDFBF7]/80 leading-relaxed pt-2">
                      {lang === "en" ? selectedPhoto.descEn : selectedPhoto.descVi}
                    </p>
                  </div>
                  <div className="pt-4 border-t border-[#222520] text-xs text-[#C88A4B]">
                    {t("space.lightboxFooter")}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
