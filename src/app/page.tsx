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
  MapPin,
  Clock,
  Phone,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const FEATURED_SIGNATURES = [
  {
    id: "cf-3",
    name: "Cà phê muối",
    price: "28.000 VNĐ",
    tag: "Best-seller",
    desc: "Lớp kem muối béo nhẹ mằn mặn đánh bông tươi mới hòa cùng cà phê đen rang mộc.",
    image: "/uploads/gallery/1788250253554-875120458.jpg",
  },
  {
    id: "tr-5",
    name: "Trà đào cam sả",
    price: "30.000 VNĐ",
    tag: "Best-seller",
    desc: "Hương sả the mát quyện cùng vị chua thanh của cam vàng và vị ngọt giòn của đào.",
    image: "/uploads/gallery/1788250253564-115851131.jpg",
  },
  {
    id: "cf-5",
    name: "Cà phê kem trứng",
    price: "30.000 VNĐ",
    tag: "Signature",
    desc: "Kem trứng gà tươi đánh bông sánh mịn phủ lên cà phê nóng đậm đà thơm bùi.",
    image: "/uploads/gallery/1788250253560-200373033.jpg",
  },
  {
    id: "tr-10",
    name: "Hoa đu đủ mật ong",
    price: "28.000 VNĐ",
    tag: "Signature",
    desc: "Đặc sản thảo mộc quý của núi rừng Tây Nguyên chưng mật ong, thanh giọng bổ phế.",
    image: "/uploads/gallery/1788250253562-580915883.jpg",
  },
];

const ATMOSPHERE_3 = [
  {
    title: "Góc Vườn Thực Vật",
    desc: "Nơi hoa cẩm cù bản địa nở rộ đón gió cao nguyên trong lành.",
    image: "/uploads/gallery/1788250253557-29323827.jpg",
  },
  {
    title: "Hiên Gỗ Đón Nắng Sớm",
    desc: "Không gian mộc mạc nhìn ra rặng thông reo mỗi sớm mai.",
    image: "/uploads/gallery/1788250253554-875120458.jpg",
  },
  {
    title: "Bờ Suối Đá Róc Rách",
    desc: "Tiếng nước suối chảy trong veo qua phiến đá rêu phong ngàn năm.",
    image: "/uploads/gallery/1788250253551-943009233.jpg",
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
    <div className="w-full bg-[#FDFBF7] text-[#222222]">
      
      {/* ========================================================= */}
      {/* 2. HERO SECTION                                           */}
      {/* ========================================================= */}
      <section className="relative min-h-[85vh] sm:min-h-[90vh] flex items-center justify-center px-6 sm:px-12 py-16 overflow-hidden">
        {/* Khung hình lớn ấm cúng về hiên nhà và bờ suối */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/uploads/gallery/1788250253554-875120458.jpg"
            alt="Cẩm Cù House - Coffee & Food bên bờ suối Gia Nghĩa"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#FDFBF7]/95 via-[#FDFBF7]/85 to-[#FDFBF7]/40 sm:to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#FDFBF7] via-transparent to-[#FDFBF7]/30" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="max-w-2xl space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#2D4A3E]/10 border border-[#2D4A3E]/20 text-xs font-semibold text-[#2D4A3E]">
              <Sparkles size={14} className="text-[#C88A4B]" />
              <span>WARM BOTANICAL SANCTUARY • GIA NGHĨA</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold text-[#2D4A3E] leading-[1.12] tracking-tight">
              Cẩm Cù House <br />
              <span className="font-normal italic text-[#C88A4B]">
                - Coffee &amp; Food
              </span>
            </h1>

            <p className="text-base sm:text-xl font-light text-[#222222]/85 leading-relaxed">
              Chốn dừng chân mộc mạc bên bờ suối đá Gia Nghĩa.
            </p>

            {/* Nút bấm theo đề bài: "Khám Phá Thực Đơn" (#C88A4B) và "Ghé Quán Ngay" (#2D4A3E) */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Link
                href="/menu"
                className="px-7 py-3.5 rounded-full bg-[#C88A4B] hover:bg-[#B3763A] text-white text-sm font-medium shadow-md hover:shadow-lg transition-all duration-200 active:scale-98 flex items-center gap-2"
              >
                <span>Khám Phá Thực Đơn</span>
                <ArrowRight size={16} />
              </Link>

              <Link
                href="/contact"
                className="px-7 py-3.5 rounded-full bg-[#2D4A3E] hover:bg-[#1F342B] text-white text-sm font-medium shadow-md hover:shadow-lg transition-all duration-200 active:scale-98"
              >
                <span>Ghé Quán Ngay</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 3. ABOUT US HIGHLIGHT (BỐ CỤC 2 CỘT)                      */}
      {/* ========================================================= */}
      <section className="py-20 sm:py-28 px-6 sm:px-12 max-w-7xl mx-auto border-t border-[#EAE6DF]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Cột 1: 1 ảnh tách cà phê ấm bên suối */}
          <div className="lg:col-span-6 relative aspect-[4/3] rounded-3xl overflow-hidden shadow-lg border border-[#EAE6DF]">
            <Image
              src="/uploads/gallery/1788250253560-200373033.jpg"
              alt="Tách cà phê ấm bên bờ suối Cẩm Cù House"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover hover:scale-104 transition-transform duration-700 ease-out"
            />
          </div>

          {/* Cột 2: Giới thiệu ngắn 3 dòng + nút "Đọc thêm" */}
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#C88A4B] font-semibold">
              GIỚI THIỆU • ABOUT US
            </span>

            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#2D4A3E] leading-tight">
              Tách Cà Phê Ấm Bên Lòng Suối Tự Nhiên
            </h2>

            {/* 3 dòng giới thiệu cô đọng */}
            <div className="space-y-3 text-sm sm:text-base font-light text-[#222222]/85 leading-relaxed">
              <p>
                Cẩm Cù House ra đời từ tình yêu với dòng suối róc rách và thảm
                thực vật hoa cẩm cù bản địa hoang sơ của Gia Nghĩa.
              </p>
              <p>
                Chúng tôi gìn giữ trọn vẹn từng phiến đá cuội tự nhiên và ngọn gió
                núi trong lành, không san ủi hay làm biến đổi địa hình.
              </p>
              <p>
                Mỗi tách cà phê rang củi mộc mạc được chắt chiu bằng sự chân thành,
                chờ đón bạn ghé lại tìm lại sự thư thái thảnh thơi.
              </p>
            </div>

            <div className="pt-2">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-[#2D4A3E] text-[#2D4A3E] hover:bg-[#2D4A3E] hover:text-white text-xs sm:text-sm font-medium transition-colors"
              >
                <span>Đọc thêm</span>
                <ChevronRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 4. ATMOSPHERE PREVIEW (GRID 3 ẢNH GÓC VƯỜN, HIÊN GỖ, SUỐI) */}
      {/* ========================================================= */}
      <section className="py-20 bg-[#F7F4EE] px-6 sm:px-12 border-t border-b border-[#EAE6DF]">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#C88A4B] font-semibold">
                KHÔNG GIAN NỔI BẬT
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#2D4A3E] mt-1">
                Góc Vườn, Hiên Gỗ &amp; Bờ Suối
              </h2>
            </div>
            <Link
              href="/space"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-[#2D4A3E] hover:text-[#C88A4B] transition-colors"
            >
              <span>Xem toàn bộ không gian</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          {/* Grid 3 ảnh */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {ATMOSPHERE_3.map((spot, idx) => (
              <div
                key={idx}
                className="card-warm overflow-hidden bg-white group flex flex-col"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden">
                  <Image
                    src={spot.image}
                    alt={spot.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                </div>
                <div className="p-5 space-y-2">
                  <h3 className="font-serif text-lg font-bold text-[#2D4A3E] group-hover:text-[#C88A4B] transition-colors">
                    {spot.title}
                  </h3>
                  <p className="text-xs font-light text-[#222222]/75 leading-relaxed">
                    {spot.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 5. FEATURED DRINKS (4 MÓN SIGNATURE TIÊU BIỂU)           */}
      {/* ========================================================= */}
      <section className="py-20 sm:py-28 px-6 sm:px-12 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-14">
          <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#C88A4B] font-semibold">
            MÓN SIGNATURE TIÊU BIỂU
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2D4A3E]">
            Thức Uống Đặc Trưng Được Yêu Thích
          </h2>
          <p className="text-xs sm:text-sm font-light text-[#222222]/75">
            Bốn hương vị gắn liền với linh hồn và bản sắc của Cẩm Cù House.
          </p>
        </div>

        {/* 4 thẻ món tiêu biểu */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURED_SIGNATURES.map((item) => (
            <div
              key={item.id}
              className="card-warm overflow-hidden flex flex-col p-4 bg-white group"
            >
              <div className="relative aspect-square w-full rounded-xl overflow-hidden mb-3 bg-[#FDFBF7]">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                />
                <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-[#2D4A3E] text-white text-[10px] font-semibold uppercase">
                  {item.tag}
                </span>
              </div>

              <div className="space-y-1.5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-baseline justify-between gap-1">
                    <h3 className="font-serif text-lg font-bold text-[#2D4A3E] group-hover:text-[#C88A4B] transition-colors">
                      {item.name}
                    </h3>
                    <span className="font-sans text-sm font-bold text-[#C88A4B] shrink-0">
                      {item.price}
                    </span>
                  </div>
                  <p className="text-xs font-light text-[#222222]/75 leading-relaxed mt-1 line-clamp-2">
                    {item.desc}
                  </p>
                </div>
                <div className="pt-2 border-t border-[#EAE6DF]/60 text-right">
                  <Link
                    href="/menu"
                    className="text-[11px] font-medium text-[#2D4A3E] hover:text-[#C88A4B] inline-flex items-center gap-1"
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
            className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-[#2D4A3E] hover:bg-[#1F342B] text-white text-xs sm:text-sm font-medium shadow-sm transition-all"
          >
            <span>Khám phá toàn bộ thực đơn</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 6. CUSTOMER REVIEWS (SLIDER TRÍCH DẪN THỰC TẾ, 5 SAO)    */}
      {/* ========================================================= */}
      <section className="py-20 bg-[#F7F4EE] px-6 sm:px-12 border-t border-b border-[#EAE6DF]">
        <div className="max-w-4xl mx-auto space-y-8 text-center">
          <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#C88A4B] font-semibold">
            CẢM NHẬN KHÁCH HÀNG
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#2D4A3E]">
            Những Lời Nhắn Ấm Áp
          </h2>

          {/* Slider thẻ cảm nhận */}
          <div className="bg-white p-8 sm:p-12 rounded-3xl border border-[#EAE6DF] shadow-xs relative">
            <div className="flex items-center justify-center gap-1 text-[#C88A4B] mb-4">
              {[...Array(REVIEWS[currentReview].stars)].map((_, i) => (
                <Star key={i} size={18} className="fill-[#C88A4B]" />
              ))}
            </div>

            <p className="font-serif italic text-base sm:text-xl text-[#222222]/90 leading-relaxed max-w-2xl mx-auto">
              &ldquo;{REVIEWS[currentReview].comment}&rdquo;
            </p>

            <div className="mt-6 pt-4 border-t border-[#EAE6DF]/60">
              <p className="font-serif font-bold text-base text-[#2D4A3E]">
                {REVIEWS[currentReview].name}
              </p>
              <p className="text-xs text-[#222222]/60">
                {REVIEWS[currentReview].role}
              </p>
            </div>

            {/* Nút lướt trước / sau */}
            <div className="flex items-center justify-center gap-3 mt-6">
              <button
                onClick={prevReview}
                aria-label="Cảm nhận trước"
                className="w-9 h-9 rounded-full border border-[#EAE6DF] flex items-center justify-center text-[#2D4A3E] hover:bg-[#2D4A3E] hover:text-white transition-colors cursor-pointer"
              >
                <ChevronLeft size={16} />
              </button>
              <div className="flex gap-1.5">
                {REVIEWS.map((_, i) => (
                  <span
                    key={i}
                    onClick={() => setCurrentReview(i)}
                    className={`w-2 h-2 rounded-full cursor-pointer transition-all ${
                      currentReview === i ? "w-6 bg-[#2D4A3E]" : "bg-[#EAE6DF]"
                    }`}
                  />
                ))}
              </div>
              <button
                onClick={nextReview}
                aria-label="Cảm nhận tiếp"
                className="w-9 h-9 rounded-full border border-[#EAE6DF] flex items-center justify-center text-[#2D4A3E] hover:bg-[#2D4A3E] hover:text-white transition-colors cursor-pointer"
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
