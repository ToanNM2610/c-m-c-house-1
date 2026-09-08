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
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

/* ===== Animation Variants ===== */
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.12 },
  }),
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

/* ===== Data ===== */
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

const EXPERIENCES = [
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

  const nextReview = () => setCurrentReview((p) => (p + 1) % REVIEWS.length);
  const prevReview = () => setCurrentReview((p) => (p - 1 + REVIEWS.length) % REVIEWS.length);

  return (
    <div className="w-full text-[#FDFBF7]">
      {/* ============================================================ */}
      {/* 1. HERO — Transparent to reveal 3D Organic Wireframe behind  */}
      {/* ============================================================ */}
      <section className="relative min-h-[90vh] sm:min-h-screen flex items-center justify-center px-6 sm:px-12 py-20 overflow-hidden">
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#0C0D0B]/30 via-transparent to-[#0C0D0B]/85 pointer-events-none" />

        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="relative z-10 max-w-5xl mx-auto w-full text-center space-y-8"
        >
          <motion.div variants={fadeUp} custom={0} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1A1D17]/80 border border-[#222520] text-xs font-mono font-medium text-[#C88A4B]">
            <Sparkles size={14} />
            <span>BOTANICAL RETREAT • BỜ SUỐI ĐÁ GIA NGHĨA</span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            custom={1}
            className="font-serif text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tight text-[#FDFBF7] leading-[1.06]"
          >
            CẨM CÙ HOUSE
          </motion.h1>

          <motion.p
            variants={fadeUp}
            custom={2}
            className="text-base sm:text-xl font-light text-[#FDFBF7]/80 max-w-2xl mx-auto leading-relaxed"
          >
            Chốn dừng chân mộc mạc bên bờ suối đá Gia Nghĩa.
          </motion.p>

          <motion.div variants={fadeUp} custom={3} className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/menu"
              className="px-8 py-3.5 rounded-full border border-[#C88A4B] text-[#C88A4B] hover:bg-[#C88A4B] hover:text-[#0C0D0B] text-xs sm:text-sm font-semibold tracking-wider uppercase transition-all duration-300 shadow-md active:scale-[0.98]"
            >
              Khám phá Thực Đơn
            </Link>
            <Link
              href="/space"
              className="px-8 py-3.5 rounded-full border border-[#FDFBF7]/40 text-[#FDFBF7] hover:border-[#2D4A3E] hover:bg-[#2D4A3E] text-xs sm:text-sm font-semibold tracking-wider uppercase transition-all duration-300 active:scale-[0.98]"
            >
              Không Gian
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* ============================================================ */}
      {/* 2. TRẢI NGHIỆM — 3 thẻ ảnh 16:9 với stagger reveal          */}
      {/* ============================================================ */}
      <section className="py-24 px-6 sm:px-12 max-w-7xl mx-auto relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12"
        >
          <div className="space-y-2">
            <motion.span variants={fadeUp} custom={0} className="text-xs font-mono uppercase tracking-[0.25em] text-[#C88A4B] font-semibold block">
              TRẢI NGHIỆM ĐẮK NÔNG
            </motion.span>
            <motion.h2 variants={fadeUp} custom={1} className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#FDFBF7]">
              Hòa Nhịp Cùng Thiên Nhiên
            </motion.h2>
          </div>
          <motion.div variants={fadeUp} custom={2}>
            <Link href="/space" className="inline-flex items-center gap-2 text-xs sm:text-sm text-[#C88A4B] hover:underline">
              <span>Xem toàn bộ góc không gian</span>
              <ArrowRight size={14} />
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {EXPERIENCES.map((item, idx) => (
            <motion.div
              key={idx}
              variants={fadeUp}
              custom={idx}
              className="card-dark overflow-hidden flex flex-col group"
            >
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
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ============================================================ */}
      {/* 3. MÓN TIÊU BIỂU — 4 signature cards                       */}
      {/* ============================================================ */}
      <section className="py-24 px-6 sm:px-12 max-w-7xl mx-auto relative z-10 border-t border-[#222520]">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer}
          className="text-center max-w-2xl mx-auto space-y-3 mb-14"
        >
          <motion.span variants={fadeUp} custom={0} className="text-xs font-mono uppercase tracking-[0.25em] text-[#C88A4B] font-semibold block">
            MÓN SIGNATURE TIÊU BIỂU
          </motion.span>
          <motion.h2 variants={fadeUp} custom={1} className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#FDFBF7]">
            Thức Uống Đặc Trưng Được Yêu Thích
          </motion.h2>
          <motion.p variants={fadeUp} custom={2} className="text-xs sm:text-sm font-light text-[#FDFBF7]/70">
            Bốn hương vị kết tinh từ hạt cà phê Đắk Nông và thảo mộc đại ngàn.
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={staggerContainer}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {FEATURED_SIGNATURES.map((item, idx) => (
            <motion.div
              key={item.id}
              variants={fadeUp}
              custom={idx}
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
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-12 text-center"
        >
          <Link
            href="/menu"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-full border border-[#C88A4B] text-[#C88A4B] hover:bg-[#C88A4B] hover:text-[#0C0D0B] text-xs sm:text-sm font-semibold uppercase tracking-wider transition-all"
          >
            <span>Khám phá toàn bộ thực đơn</span>
            <ArrowRight size={14} />
          </Link>
        </motion.div>
      </section>

      {/* ============================================================ */}
      {/* 4. CUSTOMER REVIEWS — Slider with star ratings               */}
      {/* ============================================================ */}
      <section className="py-24 px-6 sm:px-12 max-w-4xl mx-auto relative z-10 border-t border-[#222520]">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={staggerContainer}
          className="space-y-8 text-center"
        >
          <motion.span variants={fadeUp} custom={0} className="text-xs font-mono uppercase tracking-[0.25em] text-[#C88A4B] font-semibold block">
            CẢM NHẬN KHÁCH HÀNG
          </motion.span>
          <motion.h2 variants={fadeUp} custom={1} className="font-serif text-3xl sm:text-4xl font-bold text-[#FDFBF7]">
            Những Lời Nhắn Ấm Áp
          </motion.h2>

          <motion.div variants={fadeUp} custom={2} className="card-dark p-8 sm:p-12 relative">
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
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
}
