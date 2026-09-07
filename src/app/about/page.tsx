"use client";

import React, { useRef } from "react";
import dynamic from "next/dynamic";
import { motion, useScroll, useTransform } from "framer-motion";
import { Coffee, Sprout, HeartHandshake, Compass, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

const AboutPointCloud = dynamic(() => import("@/components/3d/AboutPointCloud"), {
  ssr: false,
});

const EASE_AWWWARDS = [0.76, 0, 0.24, 1] as const;

/**
 * Text Masking Reveal Component: Các dòng chữ trồi lên từ mask ẩn
 */
function MaskedTextLine({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <div className={`overflow-hidden ${className}`}>
      <motion.div
        initial={{ y: "115%", opacity: 0 }}
        whileInView={{ y: "0%", opacity: 1 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.9, delay, ease: EASE_AWWWARDS }}
      >
        {children}
      </motion.div>
    </div>
  );
}

export default function AboutPage() {
  const { lang, t } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Hiệu ứng Parallax cho ảnh: Trôi chậm hơn tốc độ cuộn chuột
  const parallaxY1 = useTransform(scrollYProgress, [0, 1], ["0%", "-18%"]);
  const parallaxY2 = useTransform(scrollYProgress, [0, 1], ["0%", "-28%"]);

  return (
    <div ref={containerRef} className="relative min-h-screen bg-[#0C0705] text-[#F4EFEA] font-sans overflow-x-hidden selection:bg-[#D4AF37] selection:text-[#0C0705] pt-28 pb-36">
      
      {/* ========================================================= */}
      {/* SECTION 1: EDITORIAL SPLIT-SCREEN HERO                    */}
      {/* ========================================================= */}
      <section className="max-w-7xl mx-auto px-6 sm:px-12 py-16 md:py-24 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center min-h-[85vh]">
        {/* Cột Trái (7 Cols): Typography cực lớn & Text Masking */}
        <div className="lg:col-span-7 space-y-8 z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#D4AF37]/30 bg-black/40 text-[10px] sm:text-xs font-mono uppercase tracking-[0.25em] text-[#D4AF37]">
            <Compass size={13} />
            <span>ORIGIN CHRONICLES • EST. 2026</span>
          </div>

          <div className="space-y-2">
            <MaskedTextLine delay={0.1}>
              <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-serif font-bold text-[#F4EFEA] tracking-tight leading-[1.05]">
                CÂU CHUYỆN
              </h1>
            </MaskedTextLine>
            <MaskedTextLine delay={0.25}>
              <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-serif italic font-light text-[#D4AF37] tracking-tight leading-[1.05]">
                MỘC MẠC
              </h1>
            </MaskedTextLine>
          </div>

          <MaskedTextLine delay={0.4}>
            <p className="text-sm sm:text-lg md:text-xl font-light text-[#F4EFEA]/80 leading-relaxed max-w-xl">
              {lang === "en"
                ? "Born from the quiet stream banks of Gia Nghia, Dak Nong — a sanctuary dedicated to slow coffee, organic architecture, and wild Hoya blossoms."
                : "Bắt đầu từ một góc suối hoang sơ tại Gia Nghĩa, Đắk Nông — nơi chúng tôi gác lại sự ồn ã phố thị để giữ lấy trọn vẹn hương vị hạt cà phê rang củi và loài hoa cẩm cù bản địa."}
            </p>
          </MaskedTextLine>

          <MaskedTextLine delay={0.55}>
            <div className="pt-4 flex items-center gap-6">
              <Link
                href="/space"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#FFE1B3] text-[#0C0705] font-semibold text-xs font-mono uppercase tracking-widest hover:scale-105 transition-transform"
              >
                <span>{lang === "en" ? "Explore Space" : "Khám Phá Không Gian"}</span>
                <ArrowRight size={14} />
              </Link>
              <div className="text-[11px] font-mono text-[#D4AF37]/80">
                <span>11°58&apos;33&quot;N 107°42&apos;11&quot;E</span>
              </div>
            </div>
          </MaskedTextLine>
        </div>

        {/* Cột Phải (5 Cols): Khối 3D Point Cloud Hoa Cẩm Cù */}
        <div className="lg:col-span-5 h-[420px] sm:h-[520px] relative flex items-center justify-center">
          <div className="absolute inset-0 bg-radial from-[#D4AF37]/10 to-transparent blur-2xl pointer-events-none" />
          <AboutPointCloud />
          
          <div className="absolute bottom-4 right-4 text-right pointer-events-none">
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#D4AF37]/60 block">
              HOYA CARNOSA POINT CLOUD
            </span>
            <span className="text-[11px] text-[#F4EFEA]/50 font-serif italic">
              3,400 Interactive Particles
            </span>
          </div>
        </div>
      </section>


      {/* ========================================================= */}
      {/* SECTION 2: EDITORIAL PARALLAX IMAGE COMPOSITION           */}
      {/* ========================================================= */}
      <section className="max-w-7xl mx-auto px-6 sm:px-12 py-24 border-t border-b border-[#D4AF37]/15">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          {/* Card Parallax 1 */}
          <motion.div
            style={{ y: parallaxY1 }}
            className="md:col-span-7 relative group rounded-2xl overflow-hidden border border-[#D4AF37]/25 shadow-2xl bg-black/40"
          >
            <div className="aspect-[16/10] overflow-hidden">
              <img
                src="/uploads/gallery/1788250253551-943009233.jpg"
                alt="Bờ suối Cẩm Cù House"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                loading="lazy"
              />
            </div>
            <div className="p-6 bg-[#120805]/90 backdrop-blur-md flex justify-between items-center border-t border-[#D4AF37]/20">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#D4AF37] block mb-1">
                  ĐỊA THẾ TỰ NHIÊN
                </span>
                <h3 className="text-lg font-serif font-bold text-[#F4EFEA]">
                  Bờ Suối Đá Uốn Lượn Thung Lũng
                </h3>
              </div>
              <span className="text-2xl font-serif text-[#D4AF37] italic font-light">01</span>
            </div>
          </motion.div>

          {/* Card Parallax 2 (Offset bên phải) */}
          <motion.div
            style={{ y: parallaxY2 }}
            className="md:col-span-5 relative group rounded-2xl overflow-hidden border border-[#D4AF37]/25 shadow-2xl bg-black/40"
          >
            <div className="aspect-[4/5] overflow-hidden">
              <img
                src="/uploads/gallery/1788250253554-875120458.jpg"
                alt="Hiên nhà mộc mạc đón nắng"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                loading="lazy"
              />
            </div>
            <div className="p-6 bg-[#120805]/90 backdrop-blur-md flex justify-between items-center border-t border-[#D4AF37]/20">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#D4AF37] block mb-1">
                  KIẾN TRÚC MỘC
                </span>
                <h3 className="text-lg font-serif font-bold text-[#F4EFEA]">
                  Hiên Gỗ Đón Nắng Sớm
                </h3>
              </div>
              <span className="text-2xl font-serif text-[#D4AF37] italic font-light">02</span>
            </div>
          </motion.div>
        </div>
      </section>


      {/* ========================================================= */}
      {/* SECTION 3: TRIẾT LÝ SỐNG & HÀNH TRÌNH (TIMELINE)          */}
      {/* ========================================================= */}
      <section className="max-w-6xl mx-auto px-6 sm:px-12 py-28">
        <div className="text-center max-w-2xl mx-auto mb-20 space-y-4">
          <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#D4AF37]">
            TRIẾT LÝ NGUYÊN BẢN
          </span>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-[#F4EFEA]">
            Ba Giá Trị <span className="italic font-light text-[#D4AF37]">Cốt Lõi</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Cột 1 */}
          <div className="p-8 rounded-2xl bg-black/40 backdrop-blur-md border border-[#D4AF37]/20 hover:border-[#D4AF37]/60 transition-all duration-500 space-y-4 group">
            <div className="w-12 h-12 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] group-hover:scale-110 transition-transform">
              <Sprout size={22} />
            </div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#D4AF37]">
              CHẶNG 01 • KHỞI NGUỒN
            </span>
            <h3 className="text-xl font-serif font-semibold text-[#F4EFEA]">
              Tôn Trọng Địa Hình Tự Nhiên
            </h3>
            <p className="text-xs font-light text-[#F4EFEA]/75 leading-relaxed">
              Không san bằng đồi dốc hay can thiệp thô bạo vào lòng suối. Toàn bộ hiên quán và bậc đá được dựng thuận theo thế đất nguyên sơ.
            </p>
          </div>

          {/* Cột 2 */}
          <div className="p-8 rounded-2xl bg-black/40 backdrop-blur-md border border-[#D4AF37]/20 hover:border-[#D4AF37]/60 transition-all duration-500 space-y-4 group">
            <div className="w-12 h-12 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] group-hover:scale-110 transition-transform">
              <Coffee size={22} />
            </div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#D4AF37]">
              CHẶNG 02 • BẢN SẮC
            </span>
            <h3 className="text-xl font-serif font-semibold text-[#F4EFEA]">
              Cà Phê Rang Củi Thô Mộc
            </h3>
            <p className="text-xs font-light text-[#F4EFEA]/75 leading-relaxed">
              Từ chối mọi hương liệu nhân tạo. Hạt cà phê được sấy tự nhiên và rang chậm trên củi gỗ cà phê già cho hương thơm mộc ấm áp nồng nàn.
            </p>
          </div>

          {/* Cột 3 */}
          <div className="p-8 rounded-2xl bg-black/40 backdrop-blur-md border border-[#D4AF37]/20 hover:border-[#D4AF37]/60 transition-all duration-500 space-y-4 group">
            <div className="w-12 h-12 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] group-hover:scale-110 transition-transform">
              <HeartHandshake size={22} />
            </div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#D4AF37]">
              CHẶNG 03 • KẾT NỐI
            </span>
            <h3 className="text-xl font-serif font-semibold text-[#F4EFEA]">
              Chốn Chữa Lành Tâm Hồn
            </h3>
            <p className="text-xs font-light text-[#F4EFEA]/75 leading-relaxed">
              Cẩm Cù House không chạy theo sự ồn ào vội vã. Đây là khoảng lặng để bạn tìm lại nhịp thở chậm rãi của chính mình giữa thiên nhiên.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}
