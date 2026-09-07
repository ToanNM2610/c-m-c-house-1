"use client";

import React, { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, AnimatePresence } from "framer-motion";
import { Compass, Sparkles, X, ArrowRight, Eye } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import LiquidDistortionImage from "@/components/ui/LiquidDistortionImage";

interface SanctuarySpot {
  id: string;
  url: string;
  titleVi: string;
  titleEn: string;
  tagVi: string;
  tagEn: string;
  descVi: string;
  descEn: string;
}

const SANCTUARY_SPOTS: SanctuarySpot[] = [
  {
    id: "spot-1",
    url: "/uploads/gallery/1788250253551-943009233.jpg",
    titleVi: "Bờ Suối Đá Thanh Bình",
    titleEn: "Crystal Stream Shore",
    tagVi: "GÓC BỜ SUỐI",
    tagEn: "STREAM-SIDE",
    descVi: "Nơi dòng suối ngàn năm róc rách chảy qua những tảng đá rêu phong phủ bóng cây cổ thụ.",
    descEn: "Where crystal waters weave past ancient mossy rocks under broad leafy canopies.",
  },
  {
    id: "spot-2",
    url: "/uploads/gallery/1788250253554-875120458.jpg",
    titleVi: "Hiên Nhà Đón Nắng Sớm",
    titleEn: "Morning Sun Veranda",
    tagVi: "HIÊN MỘC",
    tagEn: "TIMBER PATIO",
    descVi: "Từng vạt nắng sớm xiên qua rặng cây, chiếu sáng bàn gỗ mộc bên tách cà phê rang củi ấm nồng.",
    descEn: "Golden sunrise streaks filtering through highland pines onto rustic wooden tabletops.",
  },
  {
    id: "spot-3",
    url: "/uploads/gallery/1788250253557-29323827.jpg",
    titleVi: "Thánh Đường Hoa Cẩm Cù",
    titleEn: "Botanical Hoya Haven",
    tagVi: "VƯỜN THỰC VẬT",
    tagEn: "BOTANICAL",
    descVi: "Hàng trăm loài hoa cẩm cù bản địa đơm hoa hình ngôi sao sáp, tỏa hương thơm ngát giữa đại ngàn.",
    descEn: "Hundreds of indigenous Hoya wax flower clusters radiating gentle fragrance throughout the sanctuary.",
  },
  {
    id: "spot-4",
    url: "/uploads/gallery/1788250253560-200373033.jpg",
    titleVi: "Bàn Gỗ Dưới Tán Râm",
    titleEn: "Shaded Forest Table",
    tagVi: "GÓC ĐỌC SÁCH",
    tagEn: "READING NOOK",
    descVi: "Khoảng trời tĩnh lặng tuyệt đối để nhâm nhi ly trà hoa và lắng nghe tiếng chim chuyền cành.",
    descEn: "An absolute pocket of tranquility to sip herbal tea and listen to birdsong in the valley.",
  },
  {
    id: "spot-5",
    url: "/uploads/gallery/1788250253562-580915883.jpg",
    titleVi: "Dòng Suối Thung Lũng",
    titleEn: "Valley Brook Current",
    tagVi: "MẶT NƯỚC",
    tagEn: "WATERSCAPE",
    descVi: "Dòng nước mát lành từ đại ngàn Đắk Nông, là khởi nguồn của năng lượng chữa lành tự nhiên.",
    descEn: "Cool pristine flow from Dak Nong highlands, the purest source of natural restoration.",
  },
  {
    id: "spot-6",
    url: "/uploads/gallery/1788250253564-115851131.jpg",
    titleVi: "Hoàng Hôn Xuống Cẩm Cù",
    titleEn: "Twilight Horizon",
    tagVi: "HOÀNG HÔN",
    tagEn: "SUNSET",
    descVi: "Khi ánh chiều tà nhuộm đỏ ráng mây, không gian chìm vào ánh đèn vàng ấm cúng và huyền ảo.",
    descEn: "As dusk paints the valley sky in amber, warm lantern glows light up the rustic timber roof.",
  },
  {
    id: "spot-7",
    url: "/uploads/gallery/1788250253566-618481408.jpg",
    titleVi: "Góc Tĩnh Lặng Giữa Rừng",
    titleEn: "Solitude In Wilderness",
    tagVi: "CHỐN TĨNH",
    tagEn: "SERENITY",
    descVi: "Nơi chỉ có tiếng gió reo và hơi thở của đất rừng bazan thuần khiết.",
    descEn: "A timeless sanctuary enveloped only by mountain breeze and volcanic soil warmth.",
  },
];

export default function SpacePage() {
  const { lang } = useLanguage();
  const [selectedSpot, setSelectedSpot] = useState<SanctuarySpot | null>(null);

  const horizontalSectionRef = useRef<HTMLDivElement>(null);
  const horizontalTrackRef = useRef<HTMLDivElement>(null);

  // Lắng nghe phím ESC để đóng Lightbox
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

  // Thiết lập GSAP Horizontal Scroll Pin trên Desktop
  useEffect(() => {
    if (typeof window === "undefined") return;

    gsap.registerPlugin(ScrollTrigger);

    const section = horizontalSectionRef.current;
    const track = horizontalTrackRef.current;
    if (!section || !track) return;

    const mm = gsap.matchMedia();

    mm.add("(min-width: 768px)", () => {
      const getScrollAmount = () => track.scrollWidth - window.innerWidth;

      const tween = gsap.to(track, {
        x: () => -getScrollAmount(),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          pin: true,
          scrub: 1.2,
          start: "top top",
          end: () => `+=${getScrollAmount()}`,
          invalidateOnRefresh: true,
        },
      });

      return () => {
        tween.kill();
      };
    });

    return () => {
      mm.revert();
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-[#0C0705] text-[#F4EFEA] font-sans overflow-x-hidden selection:bg-[#D4AF37] selection:text-[#0C0705]">
      
      {/* ========================================================= */}
      {/* 1. INTRO EDITORIAL HEADER                                 */}
      {/* ========================================================= */}
      <section className="pt-32 sm:pt-40 pb-16 px-6 sm:px-12 max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-[#D4AF37]/20">
        <div className="space-y-4 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#D4AF37]/30 bg-black/40 text-[10px] sm:text-xs font-mono uppercase tracking-[0.25em] text-[#D4AF37]">
            <Compass size={13} />
            <span>ARCHITECTURAL & BOTANICAL IMMERSION</span>
          </div>

          <h1
            data-cursor-diff
            className="text-4xl sm:text-6xl md:text-7xl font-serif font-bold tracking-tight text-[#F4EFEA] leading-[1.08]"
          >
            KHÔNG GIAN <br />
            <span className="italic font-light text-[#D4AF37]">Bên Bờ Suối</span>
          </h1>
        </div>

        <div className="max-w-md space-y-3 text-xs sm:text-sm font-light text-[#F4EFEA]/75 leading-relaxed">
          <p>
            {lang === "en"
              ? "Cuộn chuột để dạo bước qua từng góc suối đá, hiên gỗ và vườn hoa Cẩm Cù tại Gia Nghĩa, Đắk Nông."
              : "Cuộn chuột để dạo bước qua từng góc suối đá, hiên gỗ và vườn hoa Cẩm Cù tại Gia Nghĩa, Đắk Nông."}
          </p>
          <div className="flex items-center gap-2 text-[11px] font-mono text-[#D4AF37]">
            <Sparkles size={12} />
            <span>Chạm hoặc rê chuột lên ảnh để cảm nhận sóng nước WebGL</span>
          </div>
        </div>
      </section>


      {/* ========================================================= */}
      {/* 2. GSAP PINNED HORIZONTAL WALKTHROUGH                     */}
      {/* ========================================================= */}
      <section
        ref={horizontalSectionRef}
        className="relative w-full overflow-hidden bg-[#0C0705] py-16 md:py-0"
      >
        <div
          ref={horizontalTrackRef}
          className="flex flex-col md:flex-row md:h-screen items-center px-6 md:px-20 gap-8 md:gap-16 w-full md:w-max"
        >
          {SANCTUARY_SPOTS.map((spot, idx) => (
            <div
              key={spot.id}
              onClick={() => setSelectedSpot(spot)}
              data-cursor-text={lang === "en" ? "EXPLORE" : "XEM THÊM"}
              className="shrink-0 w-full sm:w-[420px] md:w-[480px] group relative rounded-2xl overflow-hidden border border-[#D4AF37]/25 hover:border-[#D4AF37] transition-all duration-500 bg-black/40 shadow-2xl cursor-pointer"
            >
              {/* Ảnh với WebGL Liquid Wave Distortion */}
              <div className="w-full aspect-[4/5] overflow-hidden">
                <LiquidDistortionImage
                  src={spot.url}
                  alt={spot.titleVi}
                  aspectRatio="aspect-[4/5]"
                />
              </div>

              {/* Magnetic Caption Reveal Overlay */}
              <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-[#0C0705] via-[#0C0705]/85 to-transparent flex flex-col justify-end transition-all duration-500">
                <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-widest text-[#D4AF37] mb-2">
                  <span>{lang === "en" ? spot.tagEn : spot.tagVi}</span>
                  <span>0{idx + 1} / 0{SANCTUARY_SPOTS.length}</span>
                </div>

                <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#F4EFEA] group-hover:text-[#FFE1B3] transition-colors mb-2">
                  {lang === "en" ? spot.titleEn : spot.titleVi}
                </h3>

                <p className="text-xs font-light text-[#F4EFEA]/70 leading-relaxed line-clamp-2">
                  {lang === "en" ? spot.descEn : spot.descVi}
                </p>

                <div className="pt-3 flex items-center gap-1.5 text-[11px] font-mono text-[#D4AF37] group-hover:translate-x-1 transition-transform">
                  <Eye size={13} />
                  <span>{lang === "en" ? "Click to view full dimension" : "Bấm để chiêm ngưỡng trọn vẹn"}</span>
                  <ArrowRight size={12} />
                </div>
              </div>
            </div>
          ))}

          {/* Card kết thúc cuộn ngang */}
          <div className="shrink-0 w-full md:w-[320px] flex flex-col items-center justify-center p-8 text-center border border-dashed border-[#D4AF37]/30 rounded-2xl bg-black/30">
            <span className="text-4xl font-serif text-[#D4AF37] italic mb-4">❖</span>
            <h4 className="text-xl font-serif text-[#F4EFEA] mb-2">
              {lang === "en" ? "Ready for a Taste?" : "Muốn Thưởng Thức?"}
            </h4>
            <p className="text-xs font-light text-[#F4EFEA]/70 mb-6 max-w-xs">
              {lang === "en"
                ? "Experience our firewood-roasted artisan coffee on the stream shore."
                : "Thưởng thức ly cà phê rang củi bên tiếng suối reo đại ngàn."}
            </p>
            <Link
              href="/menu"
              className="px-8 py-3 rounded-full text-xs font-mono uppercase tracking-widest bg-gradient-to-r from-[#D4AF37] to-[#FFE1B3] text-[#0C0705] font-semibold hover:scale-105 transition-transform"
            >
              {lang === "en" ? "Explore Menu" : "Xem Thực Đơn"}
            </Link>
          </div>
        </div>
      </section>


      {/* ========================================================= */}
      {/* 3. LIGHTBOX PHÓNG TO CHI TIẾT                             */}
      {/* ========================================================= */}
      <AnimatePresence>
        {selectedSpot && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedSpot(null)}
            className="fixed inset-0 z-[99999] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 sm:p-8 cursor-pointer"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-5xl w-full bg-[#120805] border border-[#D4AF37]/40 rounded-3xl overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.9)] cursor-default"
            >
              <button
                onClick={() => setSelectedSpot(null)}
                className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/60 border border-[#D4AF37]/40 flex items-center justify-center text-[#F4EFEA] hover:text-[#D4AF37] transition-colors"
              >
                <X size={18} />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-12">
                <div className="md:col-span-8 aspect-[4/3] md:aspect-auto overflow-hidden bg-black">
                  <img
                    src={selectedSpot.url}
                    alt={selectedSpot.titleVi}
                    className="w-full h-full object-cover"
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
                      11°58&apos;33&quot;N 107°42&apos;11&quot;E • TP. Gia Nghĩa
                    </div>
                    <Link
                      href="/contact"
                      className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#F4EFEA] hover:text-[#D4AF37] transition-colors"
                    >
                      <span>{lang === "en" ? "Directions to visit" : "Đường ghé chơi quán"}</span>
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
