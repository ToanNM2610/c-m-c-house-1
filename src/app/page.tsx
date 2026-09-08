"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Star,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Compass,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const FEATURED_SIGNATURES = [
  {
    id: "cf-3",
    name: "Cà phê muối",
    price: "28.000 VNĐ",
    tag: "Best-seller",
    desc: "Lớp kem muối béo nhẹ mằn mặn đánh bông tươi mới hòa cùng cốt cà phê Robusta rang củi đậm đà.",
    image: "/uploads/gallery/1788250253554-875120458.jpg",
  },
  {
    id: "tr-5",
    name: "Trà đào cam sả",
    price: "30.000 VNĐ",
    tag: "Best-seller",
    desc: "Hương sả the mát quyện cùng vị chua thanh của cam vàng và vị ngọt giòn của miếng đào tươi.",
    image: "/uploads/gallery/1788250253564-115851131.jpg",
  },
  {
    id: "cf-5",
    name: "Cà phê kem trứng",
    price: "30.000 VNĐ",
    tag: "Signature",
    desc: "Kem trứng gà tươi đánh bông sánh mịn phủ lên cà phê nóng thơm nức mũi, không tanh, béo bùi ngất ngây.",
    image: "/uploads/gallery/1788250253560-200373033.jpg",
  },
  {
    id: "tr-10",
    name: "Hoa đu đủ mật ong",
    price: "28.000 VNĐ",
    tag: "Signature",
    desc: "Đặc sản thảo mộc quý của núi rừng Tây Nguyên chưng mật ong hoa cà phê, thanh giọng bổ phế.",
    image: "/uploads/gallery/1788250253562-580915883.jpg",
  },
];

const EXPERIENCES_16_9 = [
  {
    title: "Bờ Suối Đá Róc Rách Ngàn Năm",
    subtitle: "DÒNG NƯỚC TỰ NHIÊN",
    desc: "Dòng suối nguồn trong vắt len lỏi qua bãi đá cuội rêu phong, nơi tiếng nước chảy xoa dịu tâm trí.",
    image: "/uploads/gallery/1788250253551-943009233.jpg",
  },
  {
    title: "Hiên Gỗ Mộc Đón Nắng Sớm",
    subtitle: "KHÔNG GIAN NẮNG MAI",
    desc: "Mái hiên gỗ mộc nương tựa bóng cây, đón trọn vạt nắng đầu ngày và hương cà phê mới rang thơm nồng.",
    image: "/uploads/gallery/1788250253554-875120458.jpg",
  },
  {
    title: "Rang Củi Thủ Công Nguyên Bản",
    subtitle: "HƯƠNG KHÓI GỖ ĐỒI",
    desc: "Hạt cà phê Robusta Đắk Nông chín đỏ được rang từng mẻ nhỏ trên ngọn lửa than củi gỗ cà phê già.",
    image: "/uploads/gallery/1788250253560-200373033.jpg",
  },
];

const REVIEWS = [
  {
    name: "Lê Minh Tuấn",
    role: "Khách du lịch Đắk Nông",
    comment:
      "Cà phê muối ở đây ngon xuất sắc, vị béo mặn vừa vặn. Ngồi bên bờ suối nghe tiếng nước chảy xoa dịu mọi mệt mỏi.",
    stars: 5,
  },
  {
    name: "Nguyễn Hoài Thương",
    role: "Khách ghé từ Buôn Ma Thuột",
    comment:
      "Quán giữ được nét mộc tự nhiên rất đáng quý. Món hoa đu đủ mật ong thơm dịu, nhân viên đón tiếp chân tình ấm áp.",
    stars: 5,
  },
  {
    name: "Trần Đăng Khoa",
    role: "Freelance Designer",
    comment:
      "Không gian làm việc yên tĩnh, có ổ cắm và wifi nhanh. Trà đào cam sả thanh mát, ngắm vườn cẩm cù rất nhiều cảm hứng!",
    stars: 5,
  },
];

export default function HomePage() {
  const { lang } = useLanguage();
  const [currentReview, setCurrentReview] = useState(0);

  const nextReview = () => {
    setCurrentReview((prev) => (prev + 1) % REVIEWS.length);
  };
  const prevReview = () => {
    setCurrentReview((prev) => (prev - 1 + REVIEWS.length) % REVIEWS.length);
  };

  return (
    <div className="w-full text-[#FDFBF7]">
      {/* ========================================================= */}
      {/* 1. HERO SECTION - Để hở nền cho Organic Faceted Wireframe */}
      {/* ========================================================= */}
      <section className="relative min-h-[90vh] sm:min-h-screen flex items-center justify-center px-6 sm:px-12 py-20 overflow-hidden">
        {/* Lớp gradient mờ nhẹ không che phủ WebGL */}
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#0C0D0B]/40 via-transparent to-[#0C0D0B]/90 pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto w-full text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-6 flex flex-col items-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1A1D17]/80 border border-[#222520] text-xs font-mono font-medium text-[#C88A4B]">
              <Sparkles size={14} />
              <span>AWWWARDS 3D BOTANICAL RETREAT • GIA NGHĨA</span>
            </div>

            {/* Tiêu đề lớn Playfair Display */}
            <h1 className="font-serif text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tight text-[#FDFBF7] leading-[1.08]">
              CẨM CÙ HOUSE
            </h1>

            {/* Slogan */}
            <p className="text-base sm:text-xl font-light text-[#FDFBF7]/80 max-w-2xl mx-auto leading-relaxed">
              Chốn dừng chân mộc mạc bên bờ suối đá Gia Nghĩa.
            </p>

            {/* 2 nút CTA viền mỏng theo yêu cầu */}
            <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/menu"
                className="px-8 py-3.5 rounded-full border border-[#C88A4B] text-[#C88A4B] hover:bg-[#C88A4B] hover:text-[#0C0D0B] text-xs sm:text-sm font-semibold tracking-wider uppercase transition-all duration-300 shadow-md active:scale-98"
              >
                Khám phá Thực Đơn
              </Link>

              <Link
                href="/space"
                className="px-8 py-3.5 rounded-full border border-[#FDFBF7]/40 text-[#FDFBF7] hover:border-[#2D4A3E] hover:bg-[#2D4A3E] text-xs sm:text-sm font-semibold tracking-wider uppercase transition-all duration-300 active:scale-98"
              >
                Không Gian
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 2. SECTION TRẢI NGHIỆM (THẺ ẢNH TỶ LỆ 16:9)              */}
      {/* ========================================================= */}
      <section className="py-24 px-6 sm:px-12 max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div className="space-y-2">
            <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#C88A4B] font-semibold">
              TRẢI NGHIỆM ĐẮK NÔNG
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#FDFBF7]">
              Hòa Nhịp Cùng Thiên Nhiên
            </h2>
          </div>
          <Link
            href="/space"
            className="inline-flex items-center gap-2 text-xs sm:text-sm text-[#C88A4B] hover:underline"
          >
            <span>Xem toàn bộ góc không gian</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* 3 Thẻ ảnh tỷ lệ 16:9 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {EXPERIENCES_16_9.map((item, idx) => (
            <div
              key={idx}
              className="card-dark overflow-hidden flex flex-col group"
            >
              {/* Ảnh tỷ lệ 16:9 */}
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#1A1D17]">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
              </div>

              <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-mono tracking-widest text-[#C88A4B] uppercase block">
                    {item.subtitle}
                  </span>
                  <h3 className="font-serif text-xl font-bold text-[#FDFBF7] group-hover:text-[#C88A4B] transition-colors mt-1">
                    {item.title}
                  </h3>
                  <p className="text-xs font-light text-[#FDFBF7]/70 leading-relaxed mt-2">
                    {item.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#222520] flex items-center justify-between text-xs text-[#C88A4B]">
                  <span>Khám phá thêm</span>
                  <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================= */}
      {/* 3. MÓN TIÊU BIỂU (FEATURED SIGNATURE DRINKS)              */}
      {/* ========================================================= */}
      <section className="py-24 px-6 sm:px-12 max-w-7xl mx-auto relative z-10 border-t border-[#222520]">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-14">
          <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#C88A4B] font-semibold">
            MÓN SIGNATURE TIÊU BIỂU
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#FDFBF7]">
            Thức Uống Đặc Trưng Được Yêu Thích
          </h2>
          <p className="text-xs sm:text-sm font-light text-[#FDFBF7]/70">
            Bốn hương vị kết tinh từ hạt cà phê Đắk Nông và thảo mộc đại ngàn.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURED_SIGNATURES.map((item) => (
            <div
              key={item.id}
              className="card-dark p-4 flex flex-col group overflow-hidden"
            >
              <div className="relative aspect-square w-full rounded-xl overflow-hidden mb-3 bg-[#1A1D17]">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                />
                <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-[#2D4A3E] text-[#FDFBF7] text-[10px] font-semibold tracking-wider uppercase">
                  {item.tag}
                </span>
              </div>

              <div className="space-y-1.5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-baseline justify-between gap-1">
                    <h3 className="font-serif text-lg font-bold text-[#FDFBF7] group-hover:text-[#C88A4B] transition-colors">
                      {item.name}
                    </h3>
                    <span className="font-mono text-sm font-bold text-[#C88A4B] shrink-0">
                      {item.price}
                    </span>
                  </div>
                  <p className="text-xs font-light text-[#FDFBF7]/70 leading-relaxed mt-1 line-clamp-2">
                    {item.desc}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#222520] text-right">
                  <Link
                    href="/menu"
                    className="text-[11px] font-medium text-[#C88A4B] hover:underline inline-flex items-center gap-1"
                  >
                    <span>Xem menu</span>
                    <ArrowRight size={11} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/menu"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-full border border-[#C88A4B] text-[#C88A4B] hover:bg-[#C88A4B] hover:text-[#0C0D0B] text-xs sm:text-sm font-semibold uppercase tracking-wider transition-all"
          >
            <span>Khám phá toàn bộ thực đơn</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 4. CUSTOMER REVIEWS (SLIDER 5 SAO ẤM ÁP)                  */}
      {/* ========================================================= */}
      <section className="py-24 px-6 sm:px-12 max-w-4xl mx-auto relative z-10 border-t border-[#222520]">
        <div className="space-y-8 text-center">
          <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#C88A4B] font-semibold">
            CẢM NHẬN KHÁCH HÀNG
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#FDFBF7]">
            Những Lời Nhắn Ấm Áp
          </h2>

          <div className="card-dark p-8 sm:p-12 relative">
            <div className="flex items-center justify-center gap-1 text-[#C88A4B] mb-4">
              {[...Array(REVIEWS[currentReview].stars)].map((_, i) => (
                <Star key={i} size={18} className="fill-[#C88A4B]" />
              ))}
            </div>

            <p className="font-serif italic text-base sm:text-xl text-[#FDFBF7]/90 leading-relaxed max-w-2xl mx-auto">
              &ldquo;{REVIEWS[currentReview].comment}&rdquo;
            </p>

            <div className="mt-6 pt-4 border-t border-[#222520]">
              <p className="font-serif font-bold text-base text-[#FDFBF7]">
                {REVIEWS[currentReview].name}
              </p>
              <p className="text-xs text-[#C88A4B]">
                {REVIEWS[currentReview].role}
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 mt-6">
              <button
                onClick={prevReview}
                aria-label="Cảm nhận trước"
                className="w-9 h-9 rounded-full border border-[#222520] flex items-center justify-center text-[#FDFBF7] hover:border-[#C88A4B] hover:text-[#C88A4B] transition-colors cursor-pointer"
              >
                <ChevronLeft size={16} />
              </button>
              <div className="flex gap-1.5">
                {REVIEWS.map((_, i) => (
                  <span
                    key={i}
                    onClick={() => setCurrentReview(i)}
                    className={`w-2 h-2 rounded-full cursor-pointer transition-all ${
                      currentReview === i ? "w-6 bg-[#C88A4B]" : "bg-[#222520]"
                    }`}
                  />
                ))}
              </div>
              <button
                onClick={nextReview}
                aria-label="Cảm nhận tiếp"
                className="w-9 h-9 rounded-full border border-[#222520] flex items-center justify-center text-[#FDFBF7] hover:border-[#C88A4B] hover:text-[#C88A4B] transition-colors cursor-pointer"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
