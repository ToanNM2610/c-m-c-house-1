"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
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
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  Loader2
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { SpaceCategory, SpacePhoto } from "@/data/spaces";
import { useGallery } from "@/hooks/useGallery";
import { MaskHeading, StaggerContainer, StaggerItem } from "@/components/motion/ScrollReveal";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1 },
  }),
};

const kineticReveal = {
  hidden: { y: "100%", opacity: 0 },
  visible: (i: number) => ({
    y: "0%",
    opacity: 1,
    transition: {
      duration: 0.8,
      delay: i * 0.08,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  }),
};

const cardFanOut = {
  hidden: (i: number) => ({
    opacity: 0,
    y: 36,
    rotateZ: i === 0 ? -2 : i === 1 ? 0 : 2,
  }),
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    rotateZ: 0,
    transition: {
      duration: 0.75,
      delay: i * 0.12,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  }),
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const FILTER_KEYS: { key: SpaceCategory | "all"; labelVi: string; labelEn: string }[] = [
  { key: "all", labelVi: "Tất Cả", labelEn: "All" },
  { key: "stream", labelVi: "Bờ Suối Đá", labelEn: "Rocky Stream" },
  { key: "veranda", labelVi: "Hiên Gỗ & Chòi", labelEn: "Wooden Verandas" },
  { key: "flower", labelVi: "Vườn Hoa Cẩm Cù", labelEn: "Botanical & Flowers" },
  { key: "festive", labelVi: "Góc Sắc Màu", labelEn: "Festive Corners" },
  { key: "peaceful", labelVi: "Chốn Tĩnh Lặng", labelEn: "Peaceful Nooks" },
];

export default function SpacePage() {
  const { t, lang } = useLanguage();
  const [activeTab, setActiveTab] = useState<SpaceCategory | "all">("all");
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);
  
  const { images, isLoading } = useGallery();

  // Map Admin Gallery Images to SpacePhoto format
  const dynamicPhotos = useMemo<SpacePhoto[]>(() => {
    const exactMap: Record<string, { category: SpaceCategory; titleVi: string; titleEn: string }> = {
      "1 (1)": { category: "stream", titleVi: "Bờ Suối Thung Lũng", titleEn: "Valley Stream Bank" },
      "1 (4)": { category: "stream", titleVi: "Hàng Rào Ven Suối", titleEn: "Stream-side Wooden Fence" },
      "1 (5)": { category: "stream", titleVi: "Góc Suối Đá Rì Rào", titleEn: "Whispering Rock Stream" },
      "1 (15)": { category: "stream", titleVi: "Lối Xuống Suối Mát", titleEn: "Cool Stream Pathway" },
      "1 (18)": { category: "stream", titleVi: "Bàn Đá Tự Nhiên Bên Suối", titleEn: "Natural Stone Table by Stream" },
      "1 (19)": { category: "stream", titleVi: "Lòng Suối Đá Cuội", titleEn: "Pebble Stream Bed" },

      "1 (2)": { category: "veranda", titleVi: "Hiên Gỗ Đón Nắng Sớm", titleEn: "Sunlit Wooden Veranda" },
      "1 (9)": { category: "veranda", titleVi: "Chòi Nghỉ Lợp Mái Lá", titleEn: "Thatched Rustic Gazebo" },
      "1 (10)": { category: "veranda", titleVi: "Băng Ghế Gỗ Dài", titleEn: "Long Wooden Bench" },
      "1 (14)": { category: "veranda", titleVi: "Cầu Gỗ Dẫn Vào Quán", titleEn: "Wooden Entrance Bridge" },
      "1 (16)": { category: "veranda", titleVi: "Chòi Mộc Dưới Tán Râm", titleEn: "Shaded Wooden Hut" },
      "1 (28)": { category: "veranda", titleVi: "Góc Hiên Nhà Cổ Kính", titleEn: "Vintage Veranda Corner" },
      "1 (29)": { category: "veranda", titleVi: "Khung Cửa Gỗ Mộc", titleEn: "Rustic Timber Frame" },

      "1 (3)": { category: "flower", titleVi: "Tách Cà Phê Bên Chậu Cẩm Cù", titleEn: "Coffee by Hoya Bloom" },
      "1 (8)": { category: "flower", titleVi: "Ban Công Hoa Ngắm Đồi", titleEn: "Hillside Flower Balcony" },
      "1 (20)": { category: "flower", titleVi: "Giàn Hoa Đào Rực Rỡ", titleEn: "Blooming Cherry Terrace" },
      "1 (21)": { category: "flower", titleVi: "Dải Hoa Rực Nắng", titleEn: "Sun-kissed Flower Beds" },
      "1 (24)": { category: "flower", titleVi: "Khóm Cẩm Cù Đang Nở", titleEn: "Blooming Hoya Cluster" },
      "1 (27)": { category: "flower", titleVi: "Góc Vườn Xanh Mướt", titleEn: "Lush Botanical Nook" },
      "1 (30)": { category: "flower", titleVi: "Mái Nhà Hoa Rủ", titleEn: "Flowery Overhang Roof" },

      "1 (6)": { category: "festive", titleVi: "Góc Nón Lá & Đèn Lồng", titleEn: "Conical Hats & Lanterns Corner" },
      "1 (7)": { category: "festive", titleVi: "Dải Cờ Đỏ Bay Trong Gió", titleEn: "Crimson Festive Flags" },
      "1 (11)": { category: "festive", titleVi: "Lối Đi Rực Rỡ Sắc Lễ Hội", titleEn: "Vibrant Festive Walkway" },
      "1 (13)": { category: "festive", titleVi: "Không Gian Văn Hóa Bản Địa", titleEn: "Indigenous Cultural Display" },
      "1 (17)": { category: "festive", titleVi: "Dãy Đèn Lồng Thổ Cẩm", titleEn: "Brocade Lantern Trail" },
      "1 (25)": { category: "festive", titleVi: "Gian Trưng Bày Đậm Chất Tây Nguyên", titleEn: "Highland Heritage Corner" },

      "1 (12)": { category: "peaceful", titleVi: "Góc Trầm Lặng Đọc Sách", titleEn: "Quiet Reading Nook" },
      "1 (22)": { category: "peaceful", titleVi: "Bàn Gỗ Tĩnh Lặng Dưới Tán Cây", titleEn: "Peaceful Tree-shaded Table" },
      "1 (23)": { category: "peaceful", titleVi: "Khoảng Sân Yên Bình Buổi Chiều", titleEn: "Peaceful Afternoon Courtyard" },
      "1 (26)": { category: "peaceful", titleVi: "Góc Trú Chân Mộc Mạc", titleEn: "Rustic Hideaway" },
      "1 (31)": { category: "peaceful", titleVi: "Không Gian Trò Chuyện Riêng Tư", titleEn: "Private Conversation Corner" }
    };

    return images.map((img, index) => {
      // Auto assign diverse aspect ratios for Masonry grid
      const aspect = index % 2 === 0 ? "tall" : "square";
      
      let mapKey = img.caption || "";
      if (mapKey === "t8") mapKey = "1 (31)"; // Normalize fallback
      
      const mappedData = exactMap[mapKey];
      
      if (mappedData) {
        return {
          id: img.id,
          src: img.url,
          titleVi: mappedData.titleVi,
          titleEn: mappedData.titleEn,
          category: mappedData.category,
          aspectRatio: aspect
        };
      }

      // Fallback if not found in exactMap
      const cats: SpaceCategory[] = ["stream", "veranda", "flower", "festive", "peaceful"];
      const category = cats[index % cats.length];
      return {
        id: img.id,
        src: img.url,
        titleVi: `Không gian ${index + 1}`,
        titleEn: `Space ${index + 1}`,
        category: category,
        aspectRatio: aspect
      };
    });
  }, [images]);

  // Carousel State
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  
  // Use first 5 photos for carousel (or less if not enough photos)
  const carouselPhotos = useMemo(() => dynamicPhotos.slice(0, 5), [dynamicPhotos]);

  // Carousel Auto-play
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && carouselPhotos.length > 0) {
      interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % carouselPhotos.length);
      }, 4500);
    }
    return () => clearInterval(interval);
  }, [isPlaying, carouselPhotos.length]);

  const filteredPhotos = dynamicPhotos.filter((photo) => {
    if (activeTab === "all") return true;
    return photo.category === activeTab;
  });

  // Lightbox Navigation
  const handlePrev = useCallback(() => {
    if (selectedPhotoIndex === null) return;
    setSelectedPhotoIndex((prev) => (prev! > 0 ? prev! - 1 : filteredPhotos.length - 1));
  }, [selectedPhotoIndex, filteredPhotos.length]);

  const handleNext = useCallback(() => {
    if (selectedPhotoIndex === null) return;
    setSelectedPhotoIndex((prev) => (prev! < filteredPhotos.length - 1 ? prev! + 1 : 0));
  }, [selectedPhotoIndex, filteredPhotos.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedPhotoIndex === null) return;
      if (e.key === "Escape") setSelectedPhotoIndex(null);
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };
    if (selectedPhotoIndex !== null) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [selectedPhotoIndex, handlePrev, handleNext]);

  // LOADING STATE
  if (isLoading) {
    return (
      <div className="w-full min-h-screen text-[#FDFBF7] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="animate-spin text-[#C88A4B]" size={48} />
        <p className="text-[#FDFBF7]/70 font-mono text-sm tracking-widest uppercase">
          {lang === "en" ? "Loading Spaces..." : "Đang tải không gian..."}
        </p>
      </div>
    );
  }

  // EMPTY STATE
  if (dynamicPhotos.length === 0) {
    return (
      <div className="w-full min-h-screen text-[#FDFBF7] flex flex-col items-center justify-center space-y-4">
        <Compass className="text-[#C88A4B]" size={48} />
        <p className="text-[#FDFBF7]/70 font-mono text-sm tracking-widest uppercase">
          {lang === "en" ? "Gallery is currently empty." : "Thư viện hiện đang trống."}
        </p>
      </div>
    );
  }

  return (
    <div className="w-full text-[#FDFBF7]">
      {/* 1. HERO SHOWCASE TỰ ĐỘNG THAY ĐỔI ẢNH */}
      <section className="relative w-full max-w-7xl mx-auto h-[40vh] max-h-[300px] md:max-h-[360px] overflow-hidden rounded-2xl bg-[#0C0D0B] border border-[#222520] mt-6 sm:mt-8 px-4 sm:px-6 lg:px-8">
        <AnimatePresence mode="sync">
          {carouselPhotos.length > 0 && (
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              <Image
                src={carouselPhotos[currentSlide].src}
                alt={carouselPhotos[currentSlide].titleVi}
                fill
                priority
                className="object-cover"
                sizes="100vw"
              />
              {/* Cinematic Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0C0D0B] via-[#0C0D0B]/60 to-transparent opacity-90" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hero Content */}
        <div className="absolute inset-0 flex flex-col justify-end items-center text-center pb-12 sm:pb-16 px-4 z-10 pointer-events-none">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1A1D17]/80 backdrop-blur-sm border border-[#222520] text-[10px] font-mono text-[#C88A4B] mb-3"
          >
            <Compass size={12} />
            <span>{t("space.heroTag")}</span>
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-serif text-2xl md:text-3xl font-bold text-[#FDFBF7] tracking-tight drop-shadow-xl max-w-xl"
          >
            {t("space.heroTitle")}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-xs sm:text-sm font-light text-[#FDFBF7]/85 max-w-md mt-3 drop-shadow-md"
          >
            {t("space.heroDesc")}
          </motion.p>
        </div>

        {/* Carousel Controls */}
        {carouselPhotos.length > 1 && (
          <div className="absolute bottom-4 sm:bottom-6 left-0 right-0 flex justify-center items-center gap-4 z-20">
            <div className="flex gap-1.5">
              <button 
                onClick={() => setCurrentSlide((prev) => (prev > 0 ? prev - 1 : carouselPhotos.length - 1))}
                className="w-8 h-8 rounded-full bg-[#0C0D0B]/50 hover:bg-[#C88A4B] text-[#FDFBF7] hover:text-[#0C0D0B] border border-white/10 flex items-center justify-center transition-all backdrop-blur-md"
              >
                <ChevronLeft size={14} />
              </button>
              <button 
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-8 h-8 rounded-full bg-[#0C0D0B]/50 hover:bg-[#C88A4B] text-[#FDFBF7] hover:text-[#0C0D0B] border border-white/10 flex items-center justify-center transition-all backdrop-blur-md"
              >
                {isPlaying ? <Pause size={12} /> : <Play size={12} className="ml-1" />}
              </button>
              <button 
                onClick={() => setCurrentSlide((prev) => (prev + 1) % carouselPhotos.length)}
                className="w-8 h-8 rounded-full bg-[#0C0D0B]/50 hover:bg-[#C88A4B] text-[#FDFBF7] hover:text-[#0C0D0B] border border-white/10 flex items-center justify-center transition-all backdrop-blur-md"
              >
                <ChevronRight size={14} />
              </button>
            </div>
            <div className="text-[10px] font-mono font-medium tracking-widest text-[#FDFBF7]/80">
              [ {String(currentSlide + 1).padStart(2, '0')} / {String(carouselPhotos.length).padStart(2, '0')} ]
            </div>
          </div>
        )}
      </section>

      {/* 2. FILTER TABS (FADE-IN CỐ ĐỊNH) */}
      <section className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{ transform: "translate3d(0,0,0)" }}
          className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 p-1.5 rounded-3xl sm:rounded-full bg-[#1A1D17] border border-[#222520]"
        >
          {FILTER_KEYS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 sm:px-5 py-2 rounded-full text-[11px] sm:text-xs md:text-sm font-medium transition-all duration-300 cursor-pointer ${
                activeTab === tab.key
                  ? "bg-[#C88A4B] text-[#0C0D0B] font-bold shadow-md"
                  : "text-[#FDFBF7]/70 hover:text-[#FDFBF7] hover:bg-white/5"
              }`}
            >
              {lang === "en" ? tab.labelEn : tab.labelVi}
              {tab.key === "all" && ` (${dynamicPhotos.length})`}
            </button>
          ))}
        </motion.div>
      </section>

      {/* 3. MASONRY GRID (STAGGERED CASCADE WATERFALL & SCALE 0.95 -> 1.0) */}
      <section className="pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <AnimatePresence mode="wait">
          {filteredPhotos.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-20 text-[#FDFBF7]/50 font-mono text-sm uppercase tracking-widest"
            >
              {lang === "en" ? "No photos found in this category." : "Không có ảnh nào trong chuyên mục này."}
            </motion.div>
          ) : (
            <div
              key={activeTab}
              className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 gap-2.5 sm:gap-3 md:gap-4 space-y-2.5 sm:space-y-3 md:space-y-4"
            >
              {filteredPhotos.map((photo, idx) => {
                // Determine aspect ratio class
                const aspectClass = 
                  photo.aspectRatio === "tall" ? "aspect-[4/5]" : "aspect-square";
                  
                return (
                  <motion.div
                    key={photo.id}
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.08, margin: "0px 0px -30px 0px" }}
                    transition={{
                      duration: 0.55,
                      delay: (idx % 5) * 0.08, // Staggered cascade theo cột
                      ease: [0.25, 1, 0.5, 1],
                    }}
                    style={{ transform: "translate3d(0,0,0)", willChange: "transform, opacity" }}
                    onClick={() => setSelectedPhotoIndex(idx)}
                    className="break-inside-avoid group relative rounded-xl border border-white/10 shadow-md overflow-hidden cursor-pointer bg-[#0C0D0B] mb-2.5 sm:mb-3 md:mb-4 hover:shadow-xl hover:shadow-[#C88A4B]/10 transition-all duration-300"
                  >
                    <div className={`relative w-full overflow-hidden ${aspectClass} bg-[#1A1D17]`}>
                      <Image
                        src={photo.src}
                        alt={photo.titleVi}
                        fill
                        loading="lazy"
                        sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                        className="object-cover group-hover:scale-[1.03] transition-transform duration-[0.6s] ease-out"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                      
                      <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 space-y-1 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end">
                        <h3 className="font-serif text-xs sm:text-sm font-bold text-[#FDFBF7] drop-shadow-md leading-tight tracking-wider line-clamp-2">
                          {lang === "en" ? photo.titleEn : photo.titleVi}
                        </h3>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </AnimatePresence>
      </section>

      {/* 4. AMENITIES */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-[#222520] relative z-10">
        <div className="w-full space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <motion.span
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1, margin: "100px 0px" }}
              transition={{ duration: 0.5 }}
              className="text-xs font-mono uppercase tracking-[0.25em] text-[#C88A4B] font-semibold block"
            >
              {t("space.amenitiesTag")}
            </motion.span>
            <MaskHeading as="h2" className="font-serif text-3xl sm:text-4xl font-bold text-[#FDFBF7]">
              {t("space.amenitiesTitle")}
            </MaskHeading>
            <p className="text-sm font-light text-[#FDFBF7]/70">
              {t("space.amenitiesDesc")}
            </p>
          </div>

          <StaggerContainer
            amount={0.15}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {[1, 2, 3, 4].map((n, idx) => {
              const emojis = ["📶", "🔌", "🅿️", "🌳"];
              return (
                <StaggerItem
                  key={idx}
                  className="card-dark p-6 rounded-3xl text-center flex flex-col items-center justify-center space-y-3 border border-white/5 hover:border-[#C88A4B]/40 hover:shadow-[0_0_20px_rgba(200,138,75,0.15)] transition-all duration-500 cursor-pointer"
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
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </div>
      </section>

      {/* 5. LIGHTBOX MODAL FULLSCREEN */}
      <AnimatePresence>
        {selectedPhotoIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setSelectedPhotoIndex(null)}
            className="fixed inset-0 z-[9999] bg-black/85 backdrop-blur-sm flex flex-col items-center justify-center p-4 sm:p-6"
          >
            {/* Modal Box */}
            <div 
              onClick={(e) => e.stopPropagation()} 
              className="relative w-full max-w-md md:max-w-lg lg:max-w-xl mx-auto flex flex-col items-center"
            >
              
              {/* Close Button Top Right */}
              <button
                onClick={() => setSelectedPhotoIndex(null)}
                className="absolute -top-10 -right-2 sm:-right-8 w-8 h-8 md:w-9 md:h-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 flex items-center justify-center text-[#FDFBF7] transition-all z-50"
                aria-label="Close"
              >
                <X size={16} />
              </button>

              {/* Main Image Frame */}
              <div className="relative w-full h-[50vh] max-h-[55vh] md:max-h-[60vh] rounded-3xl overflow-hidden border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.7)] bg-[#0C0D0B]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedPhotoIndex}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                    className="relative w-full h-full"
                  >
                    <Image
                      src={filteredPhotos[selectedPhotoIndex].src}
                      alt={filteredPhotos[selectedPhotoIndex].titleVi}
                      fill
                      className="object-contain"
                      sizes="(max-width: 768px) 90vw, 600px"
                      priority
                    />
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Left/Right Navigation */}
              {filteredPhotos.length > 1 && (
                <>
                  <button 
                    onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                    className="absolute left-2 sm:-left-12 top-1/2 -translate-y-1/2 w-8 h-8 md:w-9 md:h-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 flex items-center justify-center text-[#FDFBF7] transition-all z-20 shadow-lg backdrop-blur-md"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleNext(); }}
                    className="absolute right-2 sm:-right-12 top-1/2 -translate-y-1/2 w-8 h-8 md:w-9 md:h-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 flex items-center justify-center text-[#FDFBF7] transition-all z-20 shadow-lg backdrop-blur-md"
                  >
                    <ChevronRight size={16} />
                  </button>
                </>
              )}

              {/* Caption Bar */}
              <div className="w-full mt-4 bg-[#141414]/90 backdrop-blur-md border border-white/10 rounded-2xl p-3.5 text-center shadow-lg">
                <div className="flex items-center justify-center gap-1.5 mb-1 text-[10px] sm:text-xs font-mono uppercase tracking-widest text-[#C88A4B]">
                  <Compass size={12} />
                  <span>
                    {lang === "en" ? FILTER_KEYS.find(k => k.key === filteredPhotos[selectedPhotoIndex].category)?.labelEn : FILTER_KEYS.find(k => k.key === filteredPhotos[selectedPhotoIndex].category)?.labelVi}
                  </span>
                  <span className="opacity-50 mx-1">•</span>
                  <span>
                    {String(selectedPhotoIndex + 1).padStart(2, '0')} / {String(filteredPhotos.length).padStart(2, '0')}
                  </span>
                </div>
                <h3 className="font-serif text-sm md:text-base font-medium text-[#FDFBF7] line-clamp-1">
                  {lang === "en" ? filteredPhotos[selectedPhotoIndex].titleEn : filteredPhotos[selectedPhotoIndex].titleVi}
                </h3>
              </div>
              
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

