"use client";

import React, { useRef, useEffect, useState, Suspense, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { Preload } from "@react-three/drei";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Coffee,
  Compass,
  Sparkles as SparkleIcon,
  Clock,
  Phone,
  MapPin,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import CelestialCore from "@/components/3d/CelestialCore";
import LiquidDistortionImage from "@/components/ui/LiquidDistortionImage";

// Bezier curve chuẩn Awwwards: Snappy nhưng vô cùng mềm mại
const EASE_AWWWARDS = [0.76, 0, 0.24, 1] as const;

/**
 * Hook phát hiện màn hình di động (< 768px)
 */
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return isMobile;
}

/**
 * Component SplitText tạo hiệu ứng lướt lên từng chữ cái từ mask ẩn (Kinetic Hero)
 */
function SplitTextReveal({
  text,
  className = "",
  delay = 0.2,
}: {
  text: string;
  className?: string;
  delay?: number;
}) {
  const characters = useMemo(() => text.split(""), [text]);

  return (
    <span className={`inline-block overflow-hidden ${className}`}>
      {characters.map((char, index) => (
        <span
          key={index}
          className="inline-block overflow-hidden align-top"
          style={{ whiteSpace: char === " " ? "pre" : "normal" }}
        >
          <motion.span
            initial={{ y: "120%", opacity: 0 }}
            animate={{ y: "0%", opacity: 1 }}
            transition={{
              duration: 1.0,
              delay: delay + index * 0.035,
              ease: EASE_AWWWARDS,
            }}
            className="inline-block"
          >
            {char === " " ? "\u00A0" : char}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

/**
 * Danh sách thẻ câu chuyện cuộn ngang (Horizontal Stories)
 */
const STORY_CARDS = [
  {
    id: "story-1",
    tagVi: "CHƯƠNG I • DÒNG CHẢY",
    tagEn: "CHAPTER I • THE BROOK",
    titleVi: "Bản Giao Hưởng Bờ Suối",
    titleEn: "The Stream Symphony",
    descVi:
      "Dòng suối cuội thanh bình len lỏi qua từng tảng đá rêu phong ngàn năm, ngân nga thanh âm róc rách xoa dịu mọi muộn phiền của lữ khách phương xa.",
    descEn:
      "A serene pebble stream winding past mossy stones, whispering soothing melodies that wash away all everyday burdens.",
    image: "/uploads/gallery/1788250253551-943009233.jpg",
    accent: "#D4AF37",
  },
  {
    id: "story-2",
    tagVi: "CHƯƠNG II • LỬA VÀ RỪNG",
    tagEn: "CHAPTER II • FIRE & TIMBER",
    titleVi: "Hạt Mộc Rang Củi Thủ Công",
    titleEn: "Artisan Wood-Fired Beans",
    descVi:
      "Những hạt Robusta trĩu cành từ đất đỏ bazan Đắk Nông, ủ hương và rang chậm trên ngọn lửa củi cà phê để cô đọng trọn vẹn vị mộc nguyên sơ.",
    descEn:
      "Selected volcanic soil Robusta cherries, patiently roasted over coffee wood embers to preserve their raw rustic essence.",
    image: "/uploads/gallery/1788250253554-875120458.jpg",
    accent: "#E5C07B",
  },
  {
    id: "story-3",
    tagVi: "CHƯƠNG III • THÁNH ĐƯỜNG",
    tagEn: "CHAPTER III • BOTANICAL",
    titleVi: "Mùa Hoa Cẩm Cù Nở Rộ",
    titleEn: "The Hoya Sanctuary Bloom",
    descVi:
      "Không gian mở đón nắng sớm Tây Nguyên, nơi hàng trăm loài hoa cẩm cù bản địa đơm hoa hình ngôi sao sáp, tỏa hương thơm ngát giữa tán rừng râm mát.",
    descEn:
      "An open botanical shelter where hundreds of indigenous Hoya wax flowers blossom under morning light, radiating tranquil fragrance.",
    image: "/uploads/gallery/1788250253557-29323827.jpg",
    accent: "#FFE1B3",
  },
];

/**
 * Danh sách thức uống tuyển chọn (Menu Highlights)
 */
const MENU_HIGHLIGHTS = [
  {
    id: "menu-1",
    nameVi: "Cà Phê Mộc Rang Củi",
    nameEn: "Wood-Fired Roasted Coffee",
    price: "35.000đ",
    priceUsd: "$1.40",
    tagVi: "ĐẬM ĐÀ NGUYÊN BẢN",
    tagEn: "PURE & ROBUST",
    descVi:
      "100% Robusta Đắk Nông chọn lọc thủ công, rang mộc trên than củi cà phê già. Lớp crema dày sánh mịn cùng hương khói ấm áp sâu lắng.",
    descEn:
      "Handpicked highland Robusta roasted over dry coffee wood. Thick velvety crema with warm, lingering smoky aromatics.",
    image: "/uploads/gallery/1788250253560-200373033.jpg",
    offset: "mt-0 md:mt-0",
  },
  {
    id: "menu-2",
    nameVi: "Trà Thảo Mộc Hoa Cẩm Cù",
    nameEn: "Botanical Hoya Blossom Tea",
    price: "42.000đ",
    priceUsd: "$1.70",
    tagVi: "THANH NHÃ THANH NHIỆT",
    tagEn: "REFRESHING & CALM",
    descVi:
      "Sự hòa quyện giữa cánh hoa cẩm cù sấy lạnh, cỏ ngọt tự nhiên và hoa cúc rừng Tây Nguyên. Mang lại vị ngọt dịu và sự thư thái tinh khiết.",
    descEn:
      "Freeze-dried Hoya blossoms infused with organic wild chamomile and stevia leaves, evoking a pure, refreshing herbal sweetness.",
    image: "/uploads/gallery/1788250253562-580915883.jpg",
    offset: "mt-8 md:mt-24",
  },
  {
    id: "menu-3",
    nameVi: "Cold Brew Suối Nguồn",
    nameEn: "Crystal Spring Cold Brew",
    price: "45.000đ",
    priceUsd: "$1.80",
    tagVi: "Ủ LẠNH 24 GIỜ",
    tagEn: "24-HOUR STEEPED",
    descVi:
      "Cà phê chiết xuất lạnh 24 giờ với nước suối thanh khiết. Nốt hương cam rừng nhiệt đới, hậu vị mật mía dịu êm bừng tỉnh giác quan.",
    descEn:
      "Slowly cold-steeped for 24 hours with spring water, unlocking subtle notes of wild citrus and gentle molasses sweetness.",
    image: "/uploads/gallery/1788250253564-115851131.jpg",
    offset: "mt-4 md:mt-12",
  },
];

/**
 * =======================================================================
 * TRANG CHỦ CHÍNH: ULTRA PREMIUM WEBGL 3D SANCTUARY
 * =======================================================================
 */
export default function UltraPremiumHomePage() {
  const { lang, t, formatPrice } = useLanguage();
  const [isMounted, setIsMounted] = useState(false);
  const isMobile = useIsMobile();
  const scrollProgressRef = useRef<number>(0);

  // Tham chiếu GSAP Horizontal Scroll
  const horizontalSectionRef = useRef<HTMLDivElement>(null);
  const horizontalTrackRef = useRef<HTMLDivElement>(null);

  // Framer Motion Scroll Tracking
  const { scrollYProgress } = useScroll();

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    scrollProgressRef.current = Math.min(Math.max(latest, 0), 1);
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Thiết lập GSAP ScrollTrigger Pinned Horizontal Scroll cho Desktop
  useEffect(() => {
    if (typeof window === "undefined") return;

    gsap.registerPlugin(ScrollTrigger);

    const section = horizontalSectionRef.current;
    const track = horizontalTrackRef.current;

    if (!section || !track) return;

    // Chỉ kích hoạt Pin Scroll khi màn hình >= 768px (Desktop)
    let ctx: gsap.Context | null = null;

    const mm = gsap.matchMedia();

    mm.add("(min-width: 768px)", () => {
      const getScrollAmount = () => {
        return track.scrollWidth - window.innerWidth;
      };

      const tween = gsap.to(track, {
        x: () => -getScrollAmount(),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          pin: true,
          scrub: 1.1,
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
  }, [isMounted]);

  return (
    <div className="relative w-full max-w-[100vw] bg-[#0C0705] text-[#F4EFEA] font-sans overflow-x-hidden selection:bg-[#D4AF37] selection:text-[#0C0705]">
      {/* ========================================================= */}
      {/* 1. FIXED WEBGL 3D BACKGROUND LAYER (Z-0)                  */}
      {/* ========================================================= */}
      <div className="fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden">
        {isMounted && (
          <Canvas
            className="w-full h-full pointer-events-none"
            camera={{ position: [0, 0, isMobile ? 6.5 : 5.2], fov: 52 }}
            dpr={[1, 2]}
            gl={{
              powerPreference: "high-performance",
              alpha: true,
              antialias: true,
            }}
          >
            <fog attach="fog" args={["#0C0705", 8, 45]} />
            <ambientLight intensity={0.4} />
            <pointLight position={[5, 8, 5]} intensity={1.5} color="#FFE1B3" />
            <pointLight position={[-5, -6, -3]} intensity={0.8} color="#C5A880" />

            <Suspense fallback={null}>
              <CelestialCore
                scrollProgressRef={scrollProgressRef}
                isMobile={isMobile}
              />
              <Preload all />
            </Suspense>
          </Canvas>
        )}

        {/* Lớp gradient điện ảnh và sương mù hữu cơ */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0C0705]/80 via-transparent to-[#0C0705]/95 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,#0C0705_95%)] opacity-85 pointer-events-none" />
      </div>

      {/* ========================================================= */}
      {/* 2. CÁC SECTION NỘI DUNG CHÍNH (Z-10)                      */}
      {/* ========================================================= */}
      <div className="relative z-10 w-full">
        {/* ======================================================= */}
        {/* SECTION 1: KINETIC HERO (100vh)                         */}
        {/* ======================================================= */}
        <section className="min-h-screen w-full flex flex-col justify-between items-center py-20 px-4 sm:px-8 relative text-center pointer-events-none">
          {/* Badge thương hiệu đỉnh Hero */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0, ease: EASE_AWWWARDS }}
            className="pointer-events-auto pt-4 sm:pt-6"
          >
            <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-[10px] sm:text-xs font-mono uppercase tracking-[0.28em] text-[#D4AF37] border border-[#D4AF37]/30 bg-black/40 backdrop-blur-md shadow-[0_0_25px_rgba(212,175,55,0.15)]">
              <SparkleIcon size={12} className="text-[#D4AF37] animate-pulse" />
              <span>ARTISAN COFFEE & BOTANICAL SANCTUARY</span>
              <SparkleIcon size={12} className="text-[#D4AF37] animate-pulse" />
            </span>
          </motion.div>

          {/* Tiêu đề SplitText cực lớn ở giữa màn hình */}
          <div className="flex flex-col items-center my-auto py-10 max-w-5xl mx-auto pointer-events-auto">
            <h1
              data-cursor-diff
              className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-serif font-bold tracking-[0.14em] sm:tracking-[0.22em] uppercase text-[#F4EFEA] drop-shadow-[0_10px_40px_rgba(0,0,0,0.95)]"
            >
              <SplitTextReveal text="CẨM CÙ" delay={0.2} />
              <span className="block mt-1 sm:mt-2">
                <SplitTextReveal text="HOUSE" delay={0.45} />
              </span>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.0, delay: 0.8, ease: EASE_AWWWARDS }}
              className="max-w-2xl mx-auto mt-6 sm:mt-8 text-sm sm:text-lg md:text-xl font-serif italic text-[#F4EFEA]/85 font-light tracking-wide leading-relaxed drop-shadow-md"
            >
              {lang === "en"
                ? "A rustic haven nestled by crystal stream waters — Where time gently stands still."
                : "Chốn dừng chân mộc mạc bên dòng suối đá — Nơi thời gian tĩnh lặng trôi."}
            </motion.p>

            {/* Cụm 2 nút CTA sang trọng */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 1.0, ease: EASE_AWWWARDS }}
              className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mt-8 sm:mt-10"
            >
              <Link
                href="/menu"
                data-cursor-magnetic
                className="group relative inline-flex items-center gap-2.5 px-7 sm:px-9 py-3.5 sm:py-4 rounded-full bg-gradient-to-r from-[#D4AF37] via-[#E5C07B] to-[#FFE1B3] text-[#0C0705] font-semibold text-xs sm:text-sm uppercase tracking-widest transition-all duration-500 shadow-[0_0_30px_rgba(212,175,55,0.4)] hover:shadow-[0_0_45px_rgba(212,175,55,0.7)] hover:scale-105 active:scale-95 cursor-pointer font-sans"
              >
                <Coffee size={16} />
                <span>{lang === "en" ? "Explore Menu" : "Xem Thực Đơn"}</span>
                <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/space"
                data-cursor-magnetic
                className="group inline-flex items-center gap-2.5 px-7 sm:px-9 py-3.5 sm:py-4 rounded-full border border-[#D4AF37]/50 hover:border-[#D4AF37] text-[#F4EFEA] hover:text-[#FFE1B3] font-medium text-xs sm:text-sm uppercase tracking-widest transition-all duration-500 bg-black/40 hover:bg-black/60 backdrop-blur-md cursor-pointer font-sans shadow-lg hover:scale-105 active:scale-95"
              >
                <span>{lang === "en" ? "Our Sanctuary" : "Khám Phá Không Gian"}</span>
                <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform text-[#D4AF37]" />
              </Link>
            </motion.div>
          </div>

          {/* Scroll Indicator dạng đường line động kéo dài xuống */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 1.2 }}
            className="flex flex-col items-center gap-3 pointer-events-auto pb-6"
          >
            <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.3em] text-[#D4AF37]/80">
              {lang === "en" ? "Scroll to immerse" : "Cuộn để chìm đắm"}
            </span>
            <div className="relative w-[1px] h-14 bg-[#D4AF37]/20 overflow-hidden">
              <motion.div
                animate={{ y: ["-100%", "100%"] }}
                transition={{
                  repeat: Infinity,
                  duration: 2.0,
                  ease: "easeInOut",
                }}
                className="w-full h-8 bg-gradient-to-b from-transparent via-[#D4AF37] to-transparent"
              />
            </div>
          </motion.div>
        </section>


        {/* ======================================================= */}
        {/* SECTION 2: BẢN GIAO HƯỞNG CỦA ĐÁ VÀ NƯỚC                */}
        {/* (GSAP ScrollTrigger Horizontal Pinned Section)          */}
        {/* ======================================================= */}
        <section
          ref={horizontalSectionRef}
          className="relative w-full overflow-hidden bg-[#0C0705]/90 border-t border-b border-[#D4AF37]/15 py-20 md:py-0"
        >
          <div
            ref={horizontalTrackRef}
            className="flex flex-col md:flex-row md:h-screen items-center px-6 md:px-20 gap-12 md:gap-24 w-full md:w-max"
          >
            {/* Header Mở đầu của Section */}
            <div className="shrink-0 max-w-md md:w-[420px] text-left space-y-5">
              <span className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.25em] text-[#D4AF37]">
                <Compass size={14} />
                <span>SANCTUARY CHRONICLES</span>
              </span>
              <h2
                data-cursor-diff
                className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#F4EFEA] leading-tight tracking-wide"
              >
                Bản Giao Hưởng <br />
                <span className="italic font-light text-[#D4AF37]">Của Đá và Nước</span>
              </h2>
              <p className="text-xs sm:text-sm font-light text-[#F4EFEA]/75 leading-relaxed">
                {lang === "en"
                  ? "A journey into the heart of Gia Nghia's wilderness, where each corner reflects the rhythm of volcanic earth and untamed crystal waters."
                  : "Hành trình bước vào trái tim thiên nhiên Gia Nghĩa, nơi mỗi phiến đá và ngọn cỏ đều thở nhịp điệu của đất đỏ bazan và dòng suối nguồn thuần khiết."}
              </p>
              <div className="pt-2">
                <Link
                  href="/space"
                  className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#D4AF37] hover:text-[#FFE1B3] transition-colors group"
                >
                  <span>{lang === "en" ? "Explore Full Gallery" : "Xem Toàn Bộ Góc Không Gian"}</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1.5 transition-transform" />
                </Link>
              </div>
            </div>

            {/* 3 Thẻ Hình Ảnh Cuộn Ngang với WebGL Image Distortion */}
            {STORY_CARDS.map((card, idx) => (
              <div
                key={card.id}
                className="shrink-0 w-full sm:w-[380px] md:w-[460px] bg-black/40 backdrop-blur-xl border border-[#D4AF37]/25 rounded-2xl p-4 md:p-6 shadow-[0_20px_50px_rgba(0,0,0,0.8)] flex flex-col justify-between group transition-all duration-500 hover:border-[#D4AF37]/60"
              >
                {/* Khung ảnh WebGL Liquid Distortion */}
                <div className="w-full overflow-hidden rounded-xl mb-6">
                  <LiquidDistortionImage
                    src={card.image}
                    alt={card.titleVi}
                    aspectRatio="aspect-[4/3]"
                  />
                </div>

                {/* Thông tin câu chuyện */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-[11px] font-mono text-[#D4AF37]/90 tracking-widest uppercase">
                    <span>{lang === "en" ? card.tagEn : card.tagVi}</span>
                    <span>0{idx + 1} / 03</span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-serif font-semibold text-[#F4EFEA] group-hover:text-[#FFE1B3] transition-colors">
                    {lang === "en" ? card.titleEn : card.titleVi}
                  </h3>

                  <p className="text-xs sm:text-sm font-light text-[#F4EFEA]/75 leading-relaxed">
                    {lang === "en" ? card.descEn : card.descVi}
                  </p>
                </div>
              </div>
            ))}

            {/* Điểm kết thúc cuộn ngang */}
            <div className="shrink-0 w-full md:w-[280px] flex flex-col items-center justify-center p-8 text-center border border-dashed border-[#D4AF37]/30 rounded-2xl bg-black/25 backdrop-blur-md">
              <span className="text-3xl font-serif text-[#D4AF37] italic mb-3">~</span>
              <p className="text-xs font-mono uppercase tracking-widest text-[#F4EFEA]/80 mb-4">
                {lang === "en" ? "Ready to taste the stillness?" : "Sẵn sàng đón nhận vị tĩnh lặng?"}
              </p>
              <Link
                href="/menu"
                className="px-6 py-2.5 rounded-full text-xs font-mono uppercase tracking-widest bg-[#D4AF37] text-[#0C0705] font-semibold hover:bg-[#FFE1B3] transition-colors"
              >
                {lang === "en" ? "See Drinks" : "Góc Thức Uống"}
              </Link>
            </div>
          </div>
        </section>


        {/* ======================================================= */}
        {/* SECTION 3: HƯƠNG VỊ NGUYÊN BẢN (ASYMMETRICAL MENU GRID) */}
        {/* ======================================================= */}
        <section className="w-full max-w-7xl mx-auto py-28 md:py-36 px-4 sm:px-8">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 md:mb-24 border-b border-[#D4AF37]/20 pb-8">
            <div className="space-y-3">
              <span className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.25em] text-[#D4AF37]">
                <Coffee size={14} />
                <span>ARTISAN FLAVORS</span>
              </span>
              <h2
                data-cursor-diff
                className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-[#F4EFEA] tracking-wide"
              >
                Hương Vị <span className="italic font-light text-[#D4AF37]">Nguyên Bản</span>
              </h2>
            </div>
            <p className="max-w-md text-xs sm:text-sm font-light text-[#F4EFEA]/70 leading-relaxed">
              {lang === "en"
                ? "Every drop brewed with mountain spring water and roasted beans gathered from highland plantations, honoring simple purity."
                : "Mỗi giọt cà phê chiết xuất từ nước suối thượng nguồn cùng hạt mộc Tây Nguyên, tôn vinh nét mộc mạc tinh khôi."}
            </p>
          </div>

          {/* Lưới Thức Uống Bất Đối Xứng (Asymmetrical Parallax Grid) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 items-start">
            {MENU_HIGHLIGHTS.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 50, filter: "blur(8px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{
                  duration: 0.9,
                  delay: idx * 0.18,
                  ease: EASE_AWWWARDS,
                }}
                className={`group flex flex-col bg-black/40 backdrop-blur-xl border border-[#D4AF37]/20 rounded-2xl p-5 md:p-6 transition-all duration-500 hover:border-[#D4AF37]/60 shadow-xl ${item.offset}`}
              >
                {/* Ảnh với hiệu ứng gợn sóng nước khi hover */}
                <div className="w-full overflow-hidden rounded-xl mb-5 aspect-[4/5]">
                  <LiquidDistortionImage
                    src={item.image}
                    alt={item.nameVi}
                    aspectRatio="aspect-[4/5]"
                  />
                </div>

                {/* Thông tin món mộc */}
                <div className="space-y-3 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-widest text-[#D4AF37] mb-1.5">
                      <span>{lang === "en" ? item.tagEn : item.tagVi}</span>
                      <span className="text-[#F4EFEA] font-medium text-xs sm:text-sm font-mono">
                        {lang === "en" ? item.priceUsd : item.price}
                      </span>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#F4EFEA] group-hover:text-[#FFE1B3] transition-colors">
                      {lang === "en" ? item.nameEn : item.nameVi}
                    </h3>
                  </div>

                  <p className="text-xs font-light text-[#F4EFEA]/75 leading-relaxed pt-2 border-t border-white/5">
                    {lang === "en" ? item.descEn : item.descVi}
                  </p>

                  <div className="pt-2">
                    <Link
                      href="/menu"
                      className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider text-[#D4AF37] hover:underline"
                    >
                      <span>{lang === "en" ? "Order details" : "Xem chi tiết"}</span>
                      <ArrowRight size={12} />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <Link
              href="/menu"
              data-cursor-magnetic
              className="inline-flex items-center gap-3 px-8 py-4 rounded-full border border-[#D4AF37]/40 bg-black/40 backdrop-blur-md text-[#F4EFEA] hover:text-[#0C0705] hover:bg-[#D4AF37] transition-all duration-300 text-xs font-mono uppercase tracking-widest shadow-lg hover:scale-105 active:scale-95"
            >
              <span>{lang === "en" ? "Discover Full Seasonal Menu" : "Khám Phá Toàn Bộ Thực Đơn Mộc"}</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </section>


        {/* ======================================================= */}
        {/* SECTION 4: INFINITE KINETIC MARQUEE                     */}
        {/* ======================================================= */}
        <section className="w-full py-16 md:py-24 overflow-hidden border-t border-b border-[#D4AF37]/15 bg-[#0C0705]/80 select-none">
          {/* Dải Marquee 1: Chạy từ phải sang trái */}
          <div className="flex w-max space-x-8 animate-marquee">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="flex items-center space-x-8 whitespace-nowrap text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-serif font-bold uppercase tracking-[0.16em] text-transparent [-webkit-text-stroke:1px_rgba(212,175,55,0.45)] hover:[-webkit-text-stroke:1px_#FFE1B3] transition-colors"
              >
                <span>THIÊN NHIÊN</span>
                <span className="text-2xl text-[#D4AF37]/50 font-sans">•</span>
                <span>TĨNH TẠI</span>
                <span className="text-2xl text-[#D4AF37]/50 font-sans">•</span>
                <span>CÀ PHÊ MỘC</span>
                <span className="text-2xl text-[#D4AF37]/50 font-sans">•</span>
                <span>HOA CẨM CÙ</span>
                <span className="text-2xl text-[#D4AF37]/50 font-sans">•</span>
                <span>BỜ SUỐI ĐÁ</span>
                <span className="text-2xl text-[#D4AF37]/50 font-sans">•</span>
              </div>
            ))}
          </div>

          {/* Dải Marquee 2: Chạy từ trái sang phải (ngược chiều) */}
          <div className="flex w-max space-x-8 animate-marquee-reverse mt-6 sm:mt-10">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="flex items-center space-x-8 whitespace-nowrap text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-serif italic font-light uppercase tracking-[0.2em] text-[#D4AF37]/35 hover:text-[#D4AF37]/70 transition-colors"
              >
                <span>BOTANICAL SANCTUARY</span>
                <span className="text-xl text-[#D4AF37]/40 font-sans">•</span>
                <span>WOOD ROASTED</span>
                <span className="text-xl text-[#D4AF37]/40 font-sans">•</span>
                <span>STREAM WATER</span>
                <span className="text-xl text-[#D4AF37]/40 font-sans">•</span>
                <span>ECO RETREAT</span>
                <span className="text-xl text-[#D4AF37]/40 font-sans">•</span>
                <span>SLOW LIVING</span>
                <span className="text-xl text-[#D4AF37]/40 font-sans">•</span>
              </div>
            ))}
          </div>
        </section>


        {/* ======================================================= */}
        {/* SECTION 5: FOOTER PARALLAX UNCOVER (REVEAL EFFECT)      */}
        {/* ======================================================= */}
        <div className="relative z-20 bg-[#0C0705] shadow-[0_50px_100px_rgba(0,0,0,0.95)]">
          {/* Vùng đệm tạo chiều sâu trước khi mở ra Footer */}
          <div className="h-16 w-full bg-gradient-to-b from-transparent to-[#0C0705]" />
        </div>

        {/* Footer Cố định lộ ra bên dưới (Uncover Stage Effect) */}
        <footer className="sticky bottom-0 z-10 w-full bg-gradient-to-b from-[#120805] to-[#080403] border-t border-[#D4AF37]/25 text-[#F4EFEA] py-16 sm:py-24 px-6 sm:px-12 font-sans overflow-hidden">
          {/* Nền ánh kim mờ */}
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 sm:gap-16 relative z-10">
            {/* Cột 1: Thương hiệu */}
            <div className="space-y-4 md:col-span-1">
              <Link
                href="/"
                data-cursor-diff
                className="text-2xl sm:text-3xl font-serif font-bold tracking-wider text-[#F4EFEA] hover:text-[#D4AF37] transition-colors"
              >
                CẨM CÙ HOUSE
              </Link>
              <p className="text-xs font-light text-[#F4EFEA]/75 leading-relaxed max-w-sm">
                {lang === "en"
                  ? "An artisan coffee and botanical sanctuary on the gentle streams of Gia Nghia, Dak Nong."
                  : "Chốn dừng chân mộc mạc bên dòng suối Đắk Nông. Thưởng thức hương cà phê rang củi và ngắm hoa cẩm cù nở."}
              </p>
              <div className="flex items-center gap-2 text-[11px] font-mono text-[#D4AF37] pt-2">
                <Compass size={13} />
                <span>11°58&apos;33&quot;N 107°42&apos;11&quot;E</span>
              </div>
            </div>

            {/* Cột 2: Điều hướng */}
            <div className="space-y-3">
              <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#D4AF37] block mb-3">
                {lang === "en" ? "SANCTUARY" : "KHÁM PHÁ"}
              </span>
              <ul className="space-y-2.5 text-xs font-light text-[#F4EFEA]/80">
                <li>
                  <Link href="/about" className="hover:text-[#D4AF37] transition-colors">
                    {lang === "en" ? "Our Story" : "Câu Chuyện Cẩm Cù"}
                  </Link>
                </li>
                <li>
                  <Link href="/space" className="hover:text-[#D4AF37] transition-colors">
                    {lang === "en" ? "Botanical Space" : "Không Gian Suối Đá"}
                  </Link>
                </li>
                <li>
                  <Link href="/menu" className="hover:text-[#D4AF37] transition-colors">
                    {lang === "en" ? "Artisan Menu" : "Thực Đơn Mộc"}
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-[#D4AF37] transition-colors">
                    {lang === "en" ? "Contact & Visit" : "Đường Đến Quán"}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Cột 3: Giờ đón khách & Địa chỉ */}
            <div className="space-y-3">
              <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#D4AF37] block mb-3">
                {lang === "en" ? "HOURS & LOCATION" : "THỜI GIAN & ĐỊA ĐIỂM"}
              </span>
              <div className="space-y-2 text-xs font-light text-[#F4EFEA]/80">
                <div className="flex items-center gap-2">
                  <Clock size={13} className="text-[#D4AF37] shrink-0" />
                  <span>07:00 – 22:00 (Mỗi ngày)</span>
                </div>
                <div className="flex items-start gap-2 pt-1">
                  <MapPin size={13} className="text-[#D4AF37] shrink-0 mt-0.5" />
                  <span>Hẻm 437 Hùng Vương, P. Nghĩa Trung, TP. Gia Nghĩa, Đắk Nông</span>
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <Phone size={13} className="text-[#D4AF37] shrink-0" />
                  <span>038 285 1688</span>
                </div>
              </div>
            </div>

            {/* Cột 4: Lời cảm ơn & Cổng Quản trị */}
            <div className="space-y-3">
              <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#D4AF37] block mb-3">
                {lang === "en" ? "MEMOIR" : "LỜI NHẮN"}
              </span>
              <p className="text-xs font-serif italic text-[#F4EFEA]/75 leading-relaxed">
                &ldquo;Cảm ơn bạn đã ghé thăm chốn bình yên này. Chúc bạn một ngày thanh thản như mặt suối sớm mai.&rdquo;
              </p>
              <div className="pt-3">
                <Link
                  href="/admin"
                  className="inline-flex items-center gap-1.5 text-[10px] font-mono text-[#F4EFEA]/45 hover:text-[#D4AF37] transition-colors"
                >
                  <span>Cổng Quản Trị Hệ Thống</span>
                  <ArrowRight size={10} />
                </Link>
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-[#F4EFEA]/40 gap-4">
            <span>© 2026 CẨM CÙ HOUSE • GIA NGHĨA, ĐẮK NÔNG. ALL RIGHTS RESERVED.</span>
            <span className="text-[#D4AF37]/60">CRAFTED FOR SLOW & MINDFUL LIVING</span>
          </div>
        </footer>
      </div>

      {/* Keyframe Animation cho Marquee vô tận */}
      <style jsx global>{`
        @keyframes marquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        @keyframes marquee-reverse {
          0% {
            transform: translateX(-50%);
          }
          100% {
            transform: translateX(0%);
          }
        }
        .animate-marquee {
          animation: marquee 35s linear infinite;
        }
        .animate-marquee-reverse {
          animation: marquee-reverse 35s linear infinite;
        }
      `}</style>
    </div>
  );
}
