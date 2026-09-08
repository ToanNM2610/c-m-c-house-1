"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Compass, X, ArrowRight, Eye, Sparkles } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface SpaceSpot {
  id: string;
  url: string;
  titleVi: string;
  titleEn: string;
  tagVi: string;
  tagEn: string;
  descVi: string;
  descEn: string;
  aspect: string;
}

const SPACE_SPOTS: SpaceSpot[] = [
  {
    id: "spot-1",
    url: "/uploads/gallery/1788250253554-875120458.jpg",
    titleVi: "Hiên Gỗ Đón Nắng",
    titleEn: "Morning Sun Timber Veranda",
    tagVi: "HIÊN MỘC",
    tagEn: "TIMBER PATIO",
    descVi:
      "Từng vạt nắng sớm xiên qua tán cây, chiếu rọi bàn gỗ mộc bên tách cà phê rang củi ấm nồng.",
    descEn:
      "Early morning rays filtering through broad leaves onto handcrafted timber tables.",
    aspect: "aspect-[4/5]",
  },
  {
    id: "spot-2",
    url: "/uploads/gallery/1788250253560-200373033.jpg",
    titleVi: "Bàn Đá Dưới Tán Râm",
    titleEn: "Stone Table Under Highland Canopy",
    tagVi: "TÁN RÂM",
    tagEn: "CANOPY SHADE",
    descVi:
      "Góc ngồi dưới bóng mát đại ngàn râm mát, nơi lý tưởng để đọc sách, nhâm nhi ly trà mộc và ngắm suối.",
    descEn:
      "Shaded rocky nook to read, sip herbal tea, and listen to the murmuring mountain stream.",
    aspect: "aspect-square",
  },
  {
    id: "spot-3",
    url: "/uploads/gallery/1788250253557-29323827.jpg",
    titleVi: "Góc Hoa Cẩm Cù",
    titleEn: "Native Hoya Sanctuary Corner",
    tagVi: "VƯỜN HOA",
    tagEn: "BOTANICAL",
    descVi:
      "Thánh đường thực vật nơi hàng trăm giò hoa cẩm cù bản địa đơm hoa hình ngôi sao sáp ngọc bích.",
    descEn:
      "Botanical collection of native wax flower blooms diffusing delicate natural fragrance.",
    aspect: "aspect-[3/4]",
  },
  {
    id: "spot-4",
    url: "/uploads/gallery/1788250253564-115851131.jpg",
    titleVi: "Hoàng Hôn Buông Suối",
    titleEn: "Sunset Over Stream Waters",
    tagVi: "HOÀNG HÔN",
    tagEn: "DUSK HORIZON",
    descVi:
      "Khi ánh tà dương nhuộm đỏ ráng mây thung lũng, mặt suối lấp lánh sắc vàng ấm cúng và thơ mộng.",
    descEn:
      "Dusk washing over the valley stream in amber tones as lanterns warm up the retreat.",
    aspect: "aspect-[16/9]",
  },
  {
    id: "spot-5",
    url: "/uploads/gallery/1788250253551-943009233.jpg",
    titleVi: "Bờ Suối Thung Lũng",
    titleEn: "Pebble Stream Valley",
    tagVi: "BỜ SUỐI",
    tagEn: "VALLEY BROOK",
    descVi:
      "Dòng nước nguồn mát lành từ đỉnh đồi bazan Đắk Nông len qua bãi đá cuội rêu phong ngàn năm.",
    descEn:
      "Cool highland stream water flowing smoothly over ancient mossy boulders.",
    aspect: "aspect-[4/3]",
  },
  {
    id: "spot-6",
    url: "/uploads/gallery/1788250253566-618481408.jpg",
    titleVi: "Khoảng Lặng Giữa Rừng",
    titleEn: "Forest Solitude",
    tagVi: "TĨNH TẠI",
    tagEn: "TRANQUILITY",
    descVi:
      "Chốn tĩnh lặng chỉ có tiếng gió reo và hơi thở tinh khôi của núi rừng Tây Nguyên.",
    descEn:
      "Tranquil clearing surrounded by fresh highland air and soothing forest sounds.",
    aspect: "aspect-[3/4]",
  },
];

export default function SpacePage() {
  const { lang } = useLanguage();
  const [selectedSpot, setSelectedSpot] = useState<SpaceSpot | null>(null);

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
    <div className="relative min-h-screen bg-transparent text-[#F4EFEA] font-sans overflow-x-hidden selection:bg-[#D4AF37] selection:text-[#0A0908]">
      
      {/* ========================================================= */}
      {/* PHẦN 1: GIỚI THIỆU CẢNH QUAN                              */}
      {/* ========================================================= */}
      <section className="pt-32 sm:pt-40 pb-14 px-6 sm:px-12 max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-[#D4AF37]/20 relative z-10">
        <div className="space-y-4 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#D4AF37]/30 bg-[#0A0908]/90 text-[10px] sm:text-xs font-mono uppercase tracking-[0.25em] text-[#D4AF37] shadow-sm">
            <Compass size={13} />
            <span>KHÔNG GIAN SINH THÁI THÔ MỘC</span>
          </div>

          <h1
            data-cursor-diff
            className="text-4xl sm:text-6xl md:text-7xl font-serif font-bold tracking-tight text-[#F4EFEA] leading-[1.08]"
          >
            KHÔNG GIAN <br />
            <span className="italic font-light text-[#D4AF37]">Bên Bờ Suối</span>
          </h1>
        </div>

        <div className="max-w-md space-y-3 text-xs sm:text-sm font-light text-[#F4EFEA]/80 leading-relaxed">
          <p className="font-serif italic text-sm sm:text-base text-[#FFE1B3]/90">
            &ldquo;Tiếng suối chảy róc rách, hương hoa cẩm cù và gió cao nguyên.&rdquo;
          </p>
          <div className="flex items-center gap-2 text-[11px] font-mono text-[#D4AF37]/85 pt-1">
            <Sparkles size={12} />
            <span>Chạm vào từng bức ảnh để xem góc nhìn toàn cảnh</span>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* PHẦN 2: THƯ VIỆN ẢNH (Masonry Grid - Next/Image Tối Ưu)   */}
      {/* ========================================================= */}
      <section className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-8 py-16">
        <div className="columns-1 sm:columns-2 md:columns-3 gap-6 space-y-6">
          {SPACE_SPOTS.map((spot, idx) => (
            <div
              key={spot.id}
              onClick={() => setSelectedSpot(spot)}
              className="break-inside-avoid group relative rounded-2xl overflow-hidden border border-[#D4AF37]/20 hover:border-[#D4AF37]/70 transition-all duration-300 bg-[#120805]/95 shadow-xl cursor-pointer"
            >
              {/* Khung ảnh tối ưu Next/Image */}
              <div className={`w-full relative overflow-hidden ${spot.aspect} bg-black/60`}>
                <Image
                  src={spot.url}
                  alt={spot.titleVi}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  priority={idx === 0}
                  loading={idx === 0 ? "eager" : "lazy"}
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
              </div>

              {/* Overlay Chú Thích */}
              <div className="p-5 bg-gradient-to-t from-[#0E0604] via-[#0E0604]/90 to-transparent flex flex-col justify-end transition-all duration-300">
                <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-widest text-[#D4AF37] mb-1.5">
                  <span>{lang === "en" ? spot.tagEn : spot.tagVi}</span>
                </div>

                <h3 className="text-lg sm:text-xl font-serif font-bold text-[#F4EFEA] group-hover:text-[#FFE1B3] transition-colors mb-1">
                  {lang === "en" ? spot.titleEn : spot.titleVi}
                </h3>

                <p className="text-xs font-light text-[#F4EFEA]/75 line-clamp-2 leading-relaxed">
                  {lang === "en" ? spot.descEn : spot.descVi}
                </p>

                <div className="pt-3 flex items-center gap-1.5 text-[10px] font-mono text-[#D4AF37] group-hover:translate-x-1 transition-transform">
                  <Eye size={12} />
                  <span>{lang === "en" ? "View full" : "Xem chi tiết"}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* LIGHTBOX PHÓNG TO CHI TIẾT */}
      <AnimatePresence>
        {selectedSpot && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedSpot(null)}
            className="fixed inset-0 z-[99999] bg-[#0A0908]/95 flex items-center justify-center p-4 sm:p-8 cursor-pointer"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-5xl w-full bg-[#120805] border border-[#D4AF37]/40 rounded-3xl overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.9)] cursor-default"
            >
              <button
                onClick={() => setSelectedSpot(null)}
                aria-label="Close modal"
                className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/70 border border-[#D4AF37]/40 flex items-center justify-center text-[#F4EFEA] hover:text-[#D4AF37] transition-colors"
              >
                <X size={18} />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-12">
                <div className="md:col-span-8 relative aspect-[4/3] md:aspect-auto md:min-h-[460px] overflow-hidden bg-black">
                  <Image
                    src={selectedSpot.url}
                    alt={selectedSpot.titleVi}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 60vw"
                  />
                </div>
                <div className="md:col-span-4 p-6 sm:p-8 flex flex-col justify-between space-y-6">
                  <div className="space-y-3">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#D4AF37] block">
                      {lang === "en" ? selectedSpot.tagEn : selectedSpot.tagVi}
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#F4EFEA]">
                      {lang === "en" ? selectedSpot.titleEn : selectedSpot.titleVi}
                    </h3>
                    <p className="text-xs sm:text-sm font-light text-[#F4EFEA]/80 leading-relaxed pt-2">
                      {lang === "en" ? selectedSpot.descEn : selectedSpot.descVi}
                    </p>
                  </div>

                  <div className="pt-6 border-t border-[#D4AF37]/20 space-y-3">
                    <div className="text-[11px] font-mono text-[#D4AF37]">
                      11.99° N, 107.69° E • Gia Nghĩa, Đắk Nông
                    </div>
                    <Link
                      href="/contact"
                      className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#F4EFEA] hover:text-[#D4AF37] transition-colors"
                    >
                      <span>Đường ghé chơi quán</span>
                      <ArrowRight size={13} />
                    </Link>
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
