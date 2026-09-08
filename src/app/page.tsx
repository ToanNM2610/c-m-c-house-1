"use client";

import React, { useRef, useEffect, useState, useMemo } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  ArrowUpRight,
  Compass,
  Clock,
  MapPin,
  Phone,
  Sparkles as SparkleIcon,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useCanvas } from "@/context/CanvasContext";

const EASE_AWWWARDS = [0.76, 0, 0.24, 1] as const;

/**
 * SplitText kinetic typography
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
              duration: 0.9,
              delay: delay + index * 0.03,
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
 * 3 Thẻ không gian nổi bật (Phần 2: Bản Giao Hưởng Bờ Suối)
 */
const FEATURED_CARDS = [
  {
    id: "card-1",
    tagVi: "CHƯƠNG I • MẶT NƯỚC",
    tagEn: "CHAPTER I • BROOK",
    titleVi: "Bờ Suối Thung Lũng",
    titleEn: "Valley Pebble Stream",
    descVi:
      "Dòng suối thanh bình len lỏi qua từng tảng đá cuội rêu phong ngàn năm, ngân nga thanh âm róc rách xoa dịu tâm hồn.",
    descEn:
      "A serene pebble stream winding past mossy stones, whispering soothing melodies that calm the soul.",
    image: "/uploads/gallery/1788250253551-943009233.jpg",
    link: "/space",
  },
  {
    id: "card-2",
    tagVi: "CHƯƠNG II • LỬA & GỖ",
    tagEn: "CHAPTER II • FIRE & WOOD",
    titleVi: "Hạt Rạng Củi Thủ Công",
    titleEn: "Artisan Wood-Fired Roast",
    descVi:
      "Hạt Robusta mộc đất đỏ bazan Đắk Nông rang chậm trên than củi gỗ cà phê già, cô đọng trọn vẹn vị mộc nguyên sơ.",
    descEn:
      "Highland volcanic Robusta cherries roasted slowly over aged coffee wood embers, preserving raw rustic essence.",
    image: "/uploads/gallery/1788250253554-875120458.jpg",
    link: "/menu",
  },
  {
    id: "card-3",
    tagVi: "CHƯƠNG III • THÁNH ĐƯỜNG",
    tagEn: "CHAPTER III • BOTANICAL",
    titleVi: "Mùa Hoa Cẩm Cù",
    titleEn: "Hoya Blossom Bloom",
    descVi:
      "Hàng trăm loài hoa cẩm cù bản địa đơm hoa hình ngôi sao sáp, tỏa hương thơm thanh khiết đón ánh bình minh Tây Nguyên.",
    descEn:
      "Indigenous wax-flower clusters blooming in the morning sun, radiating subtle tranquility throughout the valley.",
    image: "/uploads/gallery/1788250253557-29323827.jpg",
    link: "/space",
  },
];

export default function HomePage() {
  const { lang } = useLanguage();
  const { setScrollProgress } = useCanvas();
  const [isMounted, setIsMounted] = useState(false);

  const horizontalSectionRef = useRef<HTMLDivElement>(null);
  const horizontalTrackRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll();

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    // Truyền tiến độ cuộn trang (0 -> 1) cho khối 3D phóng to mượt mà
    setScrollProgress(Math.min(Math.max(latest, 0), 1));
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // GSAP Horizontal Pinned Scroll cho Desktop
  useEffect(() => {
    if (typeof window === "undefined" || !isMounted) return;

    gsap.registerPlugin(ScrollTrigger);
    const section = horizontalSectionRef.current;
    const track = horizontalTrackRef.current;

    if (!section || !track) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px)", () => {
        const getScrollAmount = () => track.scrollWidth - window.innerWidth;

        gsap.to(track, {
          x: () => -getScrollAmount(),
          ease: "none",
          scrollTrigger: {
            trigger: section,
            pin: true,
            scrub: 1.0,
            start: "top top",
            end: () => `+=${getScrollAmount()}`,
            invalidateOnRefresh: true,
          },
        });
      });
    }, horizontalSectionRef);

    return () => {
      ctx.revert();
    };
  }, [isMounted]);

  return (
    <div className="relative w-full max-w-[100vw] bg-transparent text-[#F4EFEA] font-sans overflow-x-hidden selection:bg-[#D4AF37] selection:text-[#0C0705]">
      
      {/* ========================================================= */}
      {/* PHẦN 1: KINETIC HERO (100vh)                              */}
      {/* ========================================================= */}
      <section className="min-h-screen w-full flex flex-col justify-between items-center py-20 px-4 sm:px-8 relative text-center pointer-events-none">
        {/* Badge đỉnh Hero */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE_AWWWARDS }}
          className="pointer-events-auto pt-6"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] sm:text-xs font-mono uppercase tracking-[0.25em] text-[#D4AF37] border border-[#D4AF37]/30 bg-[#0A0908]/90 shadow-lg">
            <SparkleIcon size={12} className="text-[#D4AF37]" />
            <span>ECO SANCTUARY</span>
            <span className="text-[#D4AF37]/40">•</span>
            <span>11.99° N, 107.69° E</span>
          </span>
        </motion.div>

        {/* Tiêu đề khổng lồ CẨM CÙ HOUSE */}
        <div className="flex flex-col items-center my-auto py-8 max-w-5xl mx-auto pointer-events-auto">
          <h1
            data-cursor-diff
            className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-serif font-bold tracking-[0.12em] sm:tracking-[0.18em] uppercase text-[#F4EFEA] drop-shadow-[0_10px_35px_rgba(0,0,0,0.95)]"
          >
            <SplitTextReveal text="CẨM CÙ" delay={0.15} />
            <span className="block mt-1 sm:mt-2">
              <SplitTextReveal text="HOUSE" delay={0.35} />
            </span>
          </h1>

          {/* Subtitle chuẩn yêu cầu */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.65, ease: EASE_AWWWARDS }}
            className="max-w-2xl mx-auto mt-6 text-sm sm:text-lg md:text-xl font-serif italic text-[#FFE1B3]/90 tracking-wide leading-relaxed"
          >
            Artisan Coffee &amp; Botanical Sanctuary • Gia Nghĩa, Đắk Nông
          </motion.p>

          {/* 2 nút CTA viền mỏng: "Xem Thực Đơn" và "Khám Phá Không Gian" */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.85, ease: EASE_AWWWARDS }}
            className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mt-10"
          >
            <Link
              href="/menu"
              className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full border border-[#D4AF37]/50 bg-[#0A0908]/85 text-[#F4EFEA] hover:text-[#0A0908] hover:bg-[#D4AF37] hover:border-[#D4AF37] transition-all duration-300 text-xs font-mono uppercase tracking-widest shadow-lg"
            >
              <span>{lang === "en" ? "View Menu" : "Xem Thực Đơn"}</span>
              <ArrowUpRight size={14} />
            </Link>

            <Link
              href="/space"
              className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full border border-[#D4AF37]/35 bg-[#0A0908]/85 text-[#F4EFEA]/90 hover:text-[#FFE1B3] hover:border-[#D4AF37] hover:bg-[#D4AF37]/10 transition-all duration-300 text-xs font-mono uppercase tracking-widest shadow-lg"
            >
              <span>{lang === "en" ? "Explore Sanctuary" : "Khám Phá Không Gian"}</span>
              <ArrowRight size={14} />
            </Link>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.0, delay: 1.1 }}
          className="flex flex-col items-center gap-2 pointer-events-auto pb-6"
        >
          <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.3em] text-[#D4AF37]/80">
            {lang === "en" ? "Scroll to explore" : "Cuộn để cảm nhận"}
          </span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-[#D4AF37]/60 to-transparent" />
        </motion.div>
      </section>

      {/* ========================================================= */}
      {/* PHẦN 2: BẢN GIAO HƯỞNG BỜ SUỐI (GSAP Horizontal Scroll)   */}
      {/* ========================================================= */}
      <section
        ref={horizontalSectionRef}
        className="relative w-full overflow-hidden bg-[#0C0705]/95 border-t border-b border-[#D4AF37]/20 py-20 md:py-0 z-10"
      >
        <div
          ref={horizontalTrackRef}
          className="flex flex-col md:flex-row md:h-screen items-center px-6 md:px-20 gap-10 md:gap-20 w-full md:w-max"
        >
          {/* Header Mở đầu */}
          <div className="shrink-0 max-w-md md:w-[420px] text-left space-y-4">
            <span className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.25em] text-[#D4AF37]">
              <Compass size={14} />
              <span>BẢN GIAO HƯỞNG BỜ SUỐI</span>
            </span>
            <h2
              data-cursor-diff
              className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#F4EFEA] leading-tight"
            >
              Thanh Âm Của <br />
              <span className="italic font-light text-[#D4AF37]">Đá Và Nước</span>
            </h2>
            <p className="text-xs sm:text-sm font-light text-[#F4EFEA]/80 leading-relaxed">
              {lang === "en"
                ? "An acoustic sanctuary where pristine water whispers past volcanic boulders and wood-fired coffee scents fill the patio."
                : "Không gian sinh thái mộc mạc nép mình bên dòng suối Đắk Nông. Nơi mỗi phiến đá và ngọn cây đều thở nhịp sống tĩnh lặng."}
            </p>
            <div className="pt-2">
              <Link
                href="/space"
                className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#D4AF37] hover:text-[#FFE1B3] transition-colors group"
              >
                <span>{lang === "en" ? "Discover all spots" : "Xem toàn bộ không gian"}</span>
                <ArrowRight size={14} className="group-hover:translate-x-1.5 transition-transform" />
              </Link>
            </div>
          </div>

          {/* 3 Thẻ không gian nổi bật: 16:9 cinematic Next/Image */}
          {FEATURED_CARDS.map((card, idx) => (
            <div
              key={card.id}
              className="shrink-0 w-full sm:w-[380px] md:w-[460px] bg-[#120805]/95 border border-[#D4AF37]/25 rounded-2xl p-5 md:p-6 shadow-2xl flex flex-col justify-between group transition-all duration-300 hover:border-[#D4AF37]/60"
            >
              {/* Hình ảnh bo góc tỉ lệ điện ảnh (16:9) */}
              <div className="w-full relative aspect-[16/9] rounded-xl overflow-hidden mb-5 bg-black/60">
                <Image
                  src={card.image}
                  alt={card.titleVi}
                  fill
                  sizes="(max-width: 768px) 100vw, 460px"
                  priority={idx === 0}
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
              </div>

              {/* Thông tin thẻ */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-[11px] font-mono text-[#D4AF37] tracking-widest uppercase">
                  <span>{lang === "en" ? card.tagEn : card.tagVi}</span>
                  <span>0{idx + 1} / 03</span>
                </div>

                <h3 className="text-xl sm:text-2xl font-serif font-semibold text-[#F4EFEA] group-hover:text-[#FFE1B3] transition-colors">
                  {lang === "en" ? card.titleEn : card.titleVi}
                </h3>

                <p className="text-xs sm:text-sm font-light text-[#F4EFEA]/75 leading-relaxed">
                  {lang === "en" ? card.descEn : card.descVi}
                </p>

                <div className="pt-2">
                  <Link
                    href={card.link}
                    className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-[#D4AF37] hover:underline"
                  >
                    <span>{lang === "en" ? "Explore" : "Khám phá"}</span>
                    <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
            </div>
          ))}

          {/* Điểm kết thúc horizontal track */}
          <div className="shrink-0 w-full md:w-[260px] flex flex-col items-center justify-center p-8 text-center border border-dashed border-[#D4AF37]/30 rounded-2xl bg-[#120805]/90">
            <span className="text-3xl font-serif text-[#D4AF37] italic mb-2">~</span>
            <p className="text-xs font-mono uppercase tracking-widest text-[#F4EFEA]/80 mb-4">
              {lang === "en" ? "Taste the stillness" : "Nếm vị tĩnh lặng"}
            </p>
            <Link
              href="/menu"
              className="px-5 py-2.5 rounded-full text-xs font-mono uppercase tracking-widest bg-[#D4AF37] text-[#0C0705] font-semibold hover:bg-[#FFE1B3] transition-colors"
            >
              {lang === "en" ? "See Menu" : "Xem Thực Đơn"}
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* PHẦN 3: FOOTER REVEAL (Parallax Uncover)                  */}
      {/* ========================================================= */}
      <footer className="w-full bg-[#0E0604] border-t border-[#D4AF37]/20 text-[#F4EFEA] py-16 sm:py-20 px-6 sm:px-12 font-sans relative z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 items-start">
          {/* Cột 1: Thông tin ngắn & Tọa độ */}
          <div className="space-y-4">
            <h3 className="text-2xl sm:text-3xl font-serif font-bold tracking-wider text-[#F4EFEA]">
              CẨM CÙ HOUSE
            </h3>
            <p className="text-xs font-light text-[#F4EFEA]/75 leading-relaxed max-w-sm">
              Artisan Coffee &amp; Botanical Sanctuary nép mình bên dòng suối tự nhiên.
              Chốn dừng chân mộc mạc và an yên giữa cao nguyên Gia Nghĩa.
            </p>
            <div className="flex items-center gap-2 text-xs font-mono text-[#D4AF37] pt-1">
              <Compass size={14} />
              <span>11.99° N, 107.69° E • Gia Nghĩa, Đắk Nông</span>
            </div>
          </div>

          {/* Cột 2: Điều hướng & Liên kết trực tiếp */}
          <div className="space-y-3">
            <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#D4AF37] block mb-2">
              ĐIỀU HƯỚNG
            </span>
            <ul className="space-y-2.5 text-xs font-light text-[#F4EFEA]/80">
              <li>
                <Link href="/about" className="hover:text-[#D4AF37] transition-colors">
                  Giới Thiệu • Tuyên Ngôn Triết Lý
                </Link>
              </li>
              <li>
                <Link href="/space" className="hover:text-[#D4AF37] transition-colors">
                  Không Gian Bên Bờ Suối
                </Link>
              </li>
              <li>
                <Link href="/menu" className="hover:text-[#D4AF37] transition-colors">
                  Thực Đơn Mộc
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#D4AF37] transition-colors">
                  Liên Hệ &amp; Bản Đồ 3D
                </Link>
              </li>
            </ul>
          </div>

          {/* Cột 3: Giờ mở cửa & Hotline */}
          <div className="space-y-3">
            <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#D4AF37] block mb-2">
              GIỜ MỞ CỬA &amp; ĐỊA CHỈ
            </span>
            <div className="space-y-2 text-xs font-light text-[#F4EFEA]/80">
              <div className="flex items-center gap-2">
                <Clock size={13} className="text-[#D4AF37] shrink-0" />
                <span>T2 - T5 (07:00 - 18:00) | T6 - CN (07:00 - 22:00)</span>
              </div>
              <div className="flex items-start gap-2 pt-1">
                <MapPin size={13} className="text-[#D4AF37] shrink-0 mt-0.5" />
                <span>Hẻm 437 Hùng Vương, P. Nghĩa Trung, TP Gia Nghĩa, Đắk Nông</span>
              </div>
              <div className="flex items-center gap-2 pt-1">
                <Phone size={13} className="text-[#D4AF37] shrink-0" />
                <a href="tel:0382851688" className="hover:text-[#D4AF37] underline">
                  038 285 1688
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Dòng bản quyền phi thương mại */}
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-[#F4EFEA]/45 gap-3">
          <span>Bản quyền phi thương mại © 2026 Cẩm Cù House. Tất cả các quyền được bảo lưu.</span>
          <span className="text-[#D4AF37]/60">GIA NGHĨA • ĐẮK NÔNG • VIỆT NAM</span>
        </div>
      </footer>
    </div>
  );
}
