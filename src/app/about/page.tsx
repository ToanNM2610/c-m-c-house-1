"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Compass, ArrowRight, Sprout, Coffee, HeartHandshake } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

const EASE_AWWWARDS = [0.76, 0, 0.24, 1] as const;

export default function AboutPage() {
  const { lang } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Parallax mượt mà cho các bức ảnh điện ảnh
  const parallaxY1 = useTransform(scrollYProgress, [0, 1], ["0%", "-15%"]);
  const parallaxY2 = useTransform(scrollYProgress, [0, 1], ["0%", "-25%"]);
  const parallaxY3 = useTransform(scrollYProgress, [0, 1], ["0%", "-18%"]);

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen bg-transparent text-[#F4EFEA] font-sans overflow-x-hidden selection:bg-[#D4AF37] selection:text-[#0A0908]"
    >
      {/* Hiệu ứng luồng sáng tự nhiên (Volumetric God Rays) mờ ảo chiếu từ đỉnh */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.08)_0%,transparent_70%)] blur-3xl" />
        <div className="absolute top-1/3 -left-40 w-[600px] h-[600px] bg-[radial-gradient(ellipse_at_center,rgba(197,168,128,0.04)_0%,transparent_70%)] blur-3xl" />
      </div>

      <div className="relative z-10">
        {/* ========================================================= */}
        {/* 1. HERO SECTION: DÒNG CHỮ SIÊU TO KHỔNG LỒ                */}
        {/* ========================================================= */}
        <section className="min-h-screen w-full flex flex-col justify-between items-center py-28 sm:py-36 px-6 sm:px-12 text-center">
          {/* Tagline tinh tế */}
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE_AWWWARDS }}
            className="pt-6"
          >
            <span className="inline-flex items-center gap-2 text-[10px] sm:text-xs font-mono uppercase tracking-[0.35em] text-[#D4AF37]">
              <Compass size={13} />
              <span>CẨM CÙ SANCTUARY • GIA NGHĨA, ĐẮK NÔNG</span>
            </span>
          </motion.div>

          {/* Dòng chữ siêu to khổng lồ chiếm trọn tâm điểm */}
          <div className="max-w-6xl mx-auto my-auto py-12 space-y-4 sm:space-y-6">
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.1, delay: 0.2, ease: EASE_AWWWARDS }}
              data-cursor-diff
              className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-serif font-light tracking-tight text-[#F4EFEA] leading-[1.06]"
            >
              TỪ BỎ ỒN ÀO.
            </motion.h1>

            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.1, delay: 0.35, ease: EASE_AWWWARDS }}
              data-cursor-diff
              className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-serif italic font-light text-[#D4AF37] tracking-tight leading-[1.06]"
            >
              TÌM VỀ NGUYÊN BẢN.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.0, delay: 0.55, ease: EASE_AWWWARDS }}
              className="max-w-2xl mx-auto mt-6 sm:mt-10 text-xs sm:text-base md:text-lg font-light text-[#F4EFEA]/75 leading-relaxed tracking-wide"
            >
              {lang === "en"
                ? "Nestled in the wilderness of Gia Nghia — where hurried footsteps slow down, replaced by bubbling mountain springs, ancient timber verandas, and firewood-roasted coffee."
                : "Giữa thung lũng Gia Nghĩa, Đắk Nông — Nơi bước chân vội vã nhường chỗ cho tiếng suối róc rách, hiên gỗ mộc và mùi cà phê rang củi ấm nồng."}
            </motion.p>
          </div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.0, delay: 0.8 }}
            className="flex flex-col items-center gap-2 text-[10px] font-mono uppercase tracking-[0.3em] text-[#D4AF37]/70 pb-4"
          >
            <span>Cuộn để cảm nhận</span>
            <div className="w-[1px] h-10 bg-gradient-to-b from-[#D4AF37]/50 to-transparent" />
          </motion.div>
        </section>


        {/* ========================================================= */}
        {/* 2. CHƯƠNG KỂ CHUYỆN ĐIỆN ẢNH (CINEMATIC SCROLL PARALLAX)  */}
        {/* ========================================================= */}
        <section className="max-w-6xl mx-auto px-6 sm:px-12 py-24 space-y-32 sm:space-y-44">
          
          {/* Câu chuyện 01: Dòng suối đá */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 sm:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 1.0, ease: EASE_AWWWARDS }}
              className="md:col-span-7 relative group rounded-2xl overflow-hidden border border-white/10 shadow-[0_25px_60px_rgba(0,0,0,0.8)] bg-black/50"
            >
              <motion.div style={{ y: parallaxY1 }} className="aspect-[16/11] overflow-hidden relative">
                <img
                  src="/uploads/gallery/1788250253551-943009233.jpg"
                  alt="Bờ suối đá Cẩm Cù House"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
                />
                <div className="absolute inset-0 opacity-10 mix-blend-overlay pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 1.0, delay: 0.2, ease: EASE_AWWWARDS }}
              className="md:col-span-5 space-y-4"
            >
              <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#D4AF37]">
                CHƯƠNG 01 • TIẾNG NƯỚC RÓC RÁCH
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#F4EFEA] leading-snug">
                Dòng Suối Thung Lũng Ngàn Năm
              </h2>
              <p className="text-xs sm:text-sm font-light text-[#F4EFEA]/75 leading-relaxed">
                Quán được dựng ngay cạnh con suối tự nhiên uốn lượn qua các phiến đá cuội. 
                Không có tiếng còi xe, không có sự xô bồ, chỉ có nhịp chảy róc rách xua tan mọi mỏi mệt trong tâm trí bạn.
              </p>
            </motion.div>
          </div>

          {/* Câu chuyện 02: Hạt cà phê mộc rang củi */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 sm:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 1.0, ease: EASE_AWWWARDS }}
              className="md:col-span-5 space-y-4 order-2 md:order-1"
            >
              <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#D4AF37]">
                CHƯƠNG 02 • LỬA & GỖ CÀ PHÊ
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#F4EFEA] leading-snug">
                Rang Củi Thủ Công Tại Hiên
              </h2>
              <p className="text-xs sm:text-sm font-light text-[#F4EFEA]/75 leading-relaxed">
                Chúng tôi tôn sùng phương pháp rang mộc truyền thống trên than củi gỗ cà phê già.
                Từng mẻ hạt Robusta Đắk Nông chín mọng đọng lại hương khói dịu và vị đậm đà nguyên bản nhất của vùng đất đỏ bazan.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 1.0, delay: 0.2, ease: EASE_AWWWARDS }}
              className="md:col-span-7 relative group rounded-2xl overflow-hidden border border-white/10 shadow-[0_25px_60px_rgba(0,0,0,0.8)] bg-black/50 order-1 md:order-2"
            >
              <motion.div style={{ y: parallaxY2 }} className="aspect-[16/11] overflow-hidden relative">
                <img
                  src="/uploads/gallery/1788250253554-875120458.jpg"
                  alt="Hiên mộc rang củi"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
                />
                <div className="absolute inset-0 opacity-10 mix-blend-overlay pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />
              </motion.div>
            </motion.div>
          </div>

          {/* Câu chuyện 03: Thánh đường hoa Cẩm Cù */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 sm:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 1.0, ease: EASE_AWWWARDS }}
              className="md:col-span-7 relative group rounded-2xl overflow-hidden border border-white/10 shadow-[0_25px_60px_rgba(0,0,0,0.8)] bg-black/50"
            >
              <motion.div style={{ y: parallaxY3 }} className="aspect-[16/11] overflow-hidden relative">
                <img
                  src="/uploads/gallery/1788250253557-29323827.jpg"
                  alt="Hoa Cẩm Cù nở rộ"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
                />
                <div className="absolute inset-0 opacity-10 mix-blend-overlay pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 1.0, delay: 0.2, ease: EASE_AWWWARDS }}
              className="md:col-span-5 space-y-4"
            >
              <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#D4AF37]">
                CHƯƠNG 03 • HOA NGÔI SAO SÁP
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#F4EFEA] leading-snug">
                Thánh Đường Cẩm Cù Bản Địa
              </h2>
              <p className="text-xs sm:text-sm font-light text-[#F4EFEA]/75 leading-relaxed">
                Loài hoa cẩm cù (Hoya carnosa) với những cánh hoa như đúc bằng sáp ngọc bích nở rộ mỗi mùa nắng sớm, 
                tỏa hương thơm dịu mát ôm trọn cả hiên nhà.
              </p>
            </motion.div>
          </div>

        </section>


        {/* ========================================================= */}
        {/* 3. TRIẾT LÝ SỐNG: TỐI GIẢN & THƯ THÁI                      */}
        {/* ========================================================= */}
        <section className="max-w-6xl mx-auto px-6 sm:px-12 py-28 border-t border-white/10">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-[11px] font-mono uppercase tracking-[0.3em] text-[#D4AF37]">
              TRIẾT LÝ PHI THƯƠNG MẠI
            </span>
            <h2 className="text-3xl sm:text-5xl font-serif font-light text-[#F4EFEA]">
              Tĩnh Lặng Giữa Đại Ngàn
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-black/30 border border-white/5 space-y-4">
              <div className="w-10 h-10 rounded-full bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37]">
                <Sprout size={20} />
              </div>
              <h3 className="text-lg font-serif font-semibold text-[#F4EFEA]">
                Thuận Theo Thiên Nhiên
              </h3>
              <p className="text-xs font-light text-[#F4EFEA]/70 leading-relaxed">
                Không can thiệp cơ giới, giữ nguyên địa hình dốc đồi và dòng chảy tự nhiên của suối.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-black/30 border border-white/5 space-y-4">
              <div className="w-10 h-10 rounded-full bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37]">
                <Coffee size={20} />
              </div>
              <h3 className="text-lg font-serif font-semibold text-[#F4EFEA]">
                Chất Mộc Tuyệt Đối
              </h3>
              <p className="text-xs font-light text-[#F4EFEA]/70 leading-relaxed">
                Nói không với phụ gia và hóa chất. Cà phê chỉ có hương hạt rang và than củi mộc mạc.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-black/30 border border-white/5 space-y-4">
              <div className="w-10 h-10 rounded-full bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37]">
                <HeartHandshake size={20} />
              </div>
              <h3 className="text-lg font-serif font-semibold text-[#F4EFEA]">
                Chốn Về Bình Yên
              </h3>
              <p className="text-xs font-light text-[#F4EFEA]/70 leading-relaxed">
                Mỗi lữ khách ghé thăm đều là bạn tri kỷ cùng chia sẻ tình yêu thiên nhiên Tây Nguyên.
              </p>
            </div>
          </div>

          <div className="mt-20 text-center">
            <Link
              href="/space"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full border border-[#D4AF37]/40 text-xs font-mono uppercase tracking-widest text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0A0908] transition-all duration-300"
            >
              <span>Dạo bước không gian suối đá</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
}
