"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Coffee,
  Sparkles,
  Star,
  Compass,
  Heart,
  ChevronRight,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const BEST_SELLERS = [
  {
    id: "bs-1",
    name: "Cà Phê Mộc Rang Củi",
    price: "35.000đ",
    desc: "100% Robusta Đắk Nông rang chậm trên than củi cà phê già, đậm đà sánh mịn và thoảng hương khói ấm áp.",
    image: "/uploads/gallery/1788250253560-200373033.jpg",
    tag: "Best-seller",
  },
  {
    id: "bs-2",
    name: "Cà Phê Muối Kem Béo",
    price: "38.000đ",
    desc: "Lớp kem muối béo nhẹ mằn mặn tươi mới hòa quyện cùng cà phê rang mộc nguyên bản.",
    image: "/uploads/gallery/1788250253554-875120458.jpg",
    tag: "Best-seller",
  },
  {
    id: "bs-3",
    name: "Trà Thảo Mộc Hoa Cẩm Cù",
    price: "42.000đ",
    desc: "Hoa cẩm cù sấy lạnh kết hợp cúc rừng Tây Nguyên và cỏ ngọt thanh khiết xoa dịu tâm trí.",
    image: "/uploads/gallery/1788250253562-580915883.jpg",
    tag: "Signature",
  },
  {
    id: "bs-4",
    name: "Sinh Tố Bơ Sáp Đắk Nông",
    price: "45.000đ",
    desc: "Bơ sáp dẻo quánh đặc sản đất đỏ bazan béo ngậy tự nhiên, xay cùng sữa hạt thanh lành.",
    image: "/uploads/gallery/1788250253570-358232239.jpg",
    tag: "Đặc sản",
  },
  {
    id: "bs-5",
    name: "Cold Brew Suối Nguồn",
    price: "45.000đ",
    desc: "Cà phê ủ lạnh 24 giờ với nước suối thanh mát, nốt hương cam rừng và mật mía ngọt dịu.",
    image: "/uploads/gallery/1788250253564-115851131.jpg",
    tag: "Best-seller",
  },
  {
    id: "bs-6",
    name: "Nước Ép Chanh Dây Đồi",
    price: "35.000đ",
    desc: "Chanh dây tươi hái từ đồi Gia Nghĩa, chua thanh ngọt mát, bừng tỉnh giác quan sau chặng đường dài.",
    image: "/uploads/gallery/1788250253572-915114239.jpg",
    tag: "Tươi mát",
  },
];

const ATMOSPHERE_SPOTS = [
  {
    title: "Hiên Gỗ Đón Nắng Sớm",
    desc: "Bàn gỗ mộc hướng ra rặng thông đón từng vạt nắng bình minh ấm áp.",
    image: "/uploads/gallery/1788250253554-875120458.jpg",
  },
  {
    title: "Bàn Đá Bên Suối Róc Rách",
    desc: "Tọa độ lý tưởng để thưởng thức ly cà phê bên tiếng suối reo trong trẻo.",
    image: "/uploads/gallery/1788250253551-943009233.jpg",
  },
  {
    title: "Thánh Đường Hoa Cẩm Cù",
    desc: "Góc vườn ngát hương hoa cẩm cù bản địa đơm bông hình ngôi sao sáp.",
    image: "/uploads/gallery/1788250253557-29323827.jpg",
  },
  {
    title: "Hoàng Hôn Dưới Tán Cây",
    desc: "Khi ráng chiều buông xuống thung lũng, ánh đèn vàng ấm áp thắp sáng không gian.",
    image: "/uploads/gallery/1788250253564-115851131.jpg",
  },
];

const TESTIMONIALS = [
  {
    name: "Minh Anh",
    role: "Lữ khách từ TP.HCM",
    comment:
      "Không gian bên bờ suối thực sự yên bình và chữa lành. Cà phê rang củi có mùi khói nhẹ rất đặc trưng, không đâu có được.",
    stars: 5,
  },
  {
    name: "Tuấn Hùng",
    role: "Khách ghé thăm Đắk Nông",
    comment:
      "Quán giữ được vẻ mộc mạc nguyên sơ của suối đá và rừng cây. Đội ngũ phục vụ chân thành, ấm áp như người nhà.",
    stars: 5,
  },
  {
    name: "Thảo Vy",
    role: "Nhiếp ảnh gia tự do",
    comment:
      "Góc nào của Cẩm Cù House chụp ảnh cũng mang chất điện ảnh rất thơ. Trà hoa cẩm cù thanh nhẹ, cực kỳ dễ chịu!",
    stars: 5,
  },
];

export default function HomePage() {
  const { lang } = useLanguage();

  return (
    <div className="w-full bg-[#FDFBF7] text-[#222222]">
      
      {/* ========================================================= */}
      {/* 1. HERO SECTION: SÁNG RÕ, ẤM CÚNG VỀ HIÊN NHÀ & BỜ SUỐI  */}
      {/* ========================================================= */}
      <section className="relative min-h-[88vh] sm:min-h-[92vh] flex items-center justify-center px-6 sm:px-12 py-16 overflow-hidden">
        {/* Ảnh nền ấm áp với lớp phủ sáng nhẹ nhàng */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/uploads/gallery/1788250253554-875120458.jpg"
            alt="Cẩm Cù House coffee & Food bên bờ suối"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center scale-102"
          />
          {/* Lớp phủ chuyển màu sáng ấm (Soft Warm Botanical Gradient) */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#FDFBF7]/95 via-[#FDFBF7]/80 to-[#FDFBF7]/40 sm:to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#FDFBF7] via-transparent to-[#FDFBF7]/30" />
        </div>

        {/* Nội dung Hero */}
        <div className="relative z-10 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="lg:col-span-8 space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#2D4A3E]/10 border border-[#2D4A3E]/20 text-xs font-semibold text-[#2D4A3E]">
              <Sparkles size={14} className="text-[#C88A4B]" />
              <span>BOTANICAL SANCTUARY • GIA NGHĨA, ĐẮK NÔNG</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold text-[#2D4A3E] leading-[1.12] tracking-tight">
              Cẩm Cù House <br />
              <span className="font-normal italic text-[#C88A4B]">
                coffee &amp; Food
              </span>
            </h1>

            <p className="text-base sm:text-xl font-light text-[#222222]/85 max-w-2xl leading-relaxed">
              Hòa mình vào thiên nhiên bên bờ suối đá Gia Nghĩa. Nơi thời gian
              ngưng đọng bên hương cà phê rang củi mộc và tiếng suối róc rách
              chữa lành.
            </p>

            {/* 2 NÚT CTA THEO ĐỀ BÀI */}
            <div className="pt-4 flex flex-wrap items-center gap-4">
              <Link
                href="/menu"
                className="px-7 py-3.5 rounded-full bg-[#C88A4B] hover:bg-[#B3763A] text-white text-sm font-medium shadow-md hover:shadow-lg transition-all duration-200 active:scale-98 flex items-center gap-2"
              >
                <span>Khám phá Thực đơn</span>
                <ArrowRight size={16} />
              </Link>

              <Link
                href="/contact"
                className="px-7 py-3.5 rounded-full border-2 border-[#2D4A3E] text-[#2D4A3E] hover:bg-[#2D4A3E] hover:text-white text-sm font-medium transition-all duration-200 active:scale-98"
              >
                <span>Đặt bàn ngay</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 2. ABOUT US HIGHLIGHT (BỐ CỤC 2 CỘT)                      */}
      {/* ========================================================= */}
      <section className="py-20 sm:py-28 px-6 sm:px-12 max-w-7xl mx-auto border-t border-[#EAE6DF]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Cột 1: Ảnh góc quán đón nắng sớm */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-6 relative"
          >
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-lg border border-[#EAE6DF]">
              <Image
                src="/uploads/gallery/1788250253551-943009233.jpg"
                alt="Góc bờ suối đá đón nắng sớm tại Cẩm Cù House"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover hover:scale-104 transition-transform duration-700 ease-out"
              />
            </div>
            {/* Huy hiệu nổi bật */}
            <div className="absolute -bottom-6 -right-4 sm:bottom-6 sm:-right-6 bg-white p-4 rounded-2xl shadow-xl border border-[#EAE6DF] max-w-[200px] hidden sm:block">
              <p className="text-xs font-serif font-bold text-[#2D4A3E]">
                Thanh Âm Tự Nhiên
              </p>
              <p className="text-[11px] text-[#222222]/70 mt-1">
                Suối đá róc rách ngàn năm &amp; tán rừng râm mát.
              </p>
            </div>
          </motion.div>

          {/* Cột 2: Câu chuyện mộc mạc bên bờ suối */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-6 space-y-5"
          >
            <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#C88A4B] font-semibold">
              VỀ CHÚNG TÔI • OUR STORY
            </span>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2D4A3E] leading-tight">
              Tìm Về Khoảng Lặng <br />
              <span className="italic font-normal text-[#C88A4B]">
                Bên Bờ Suối Đá
              </span>
            </h2>

            <p className="text-sm sm:text-base font-light text-[#222222]/80 leading-relaxed">
              Cẩm Cù House không đơn thuần là một quán cà phê, mà là chốn dừng
              chân chữa lành được kiến tạo với tinh thần tôn trọng thiên nhiên
              tuyệt đối. Chúng tôi không san ủi dốc đồi, giữ nguyên từng hòn đá
              cuội bên bờ suối và gìn giữ thảm hoa cẩm cù bản địa trĩu cành.
            </p>

            <p className="text-sm sm:text-base font-light text-[#222222]/80 leading-relaxed">
              Tại đây, mỗi tách cà phê Robusta đều được rang mộc trên than củi già
              theo phương pháp thủ công, đem đến trải nghiệm đậm đà, mộc mạc và
              thuần khiết nhất.
            </p>

            <div className="pt-2">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 text-sm font-medium text-[#2D4A3E] hover:text-[#C88A4B] transition-colors group"
              >
                <span>Xem thêm câu chuyện</span>
                <ChevronRight
                  size={18}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 3. ATMOSPHERE PREVIEW (KHÔNG GIAN NỔI BẬT)                */}
      {/* ========================================================= */}
      <section className="py-20 bg-[#F7F4EE] px-6 sm:px-12 border-t border-b border-[#EAE6DF]">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#C88A4B] font-semibold">
                KHÔNG GIAN ĐẶC SẮC
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2D4A3E] mt-2">
                Những Góc Check-in Thơ Mộng
              </h2>
            </div>
            <Link
              href="/space"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-[#2D4A3E] text-[#2D4A3E] hover:bg-[#2D4A3E] hover:text-white text-xs sm:text-sm font-medium transition-colors"
            >
              <span>Xem toàn bộ không gian</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          {/* Grid 4 ảnh các góc nổi bật */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {ATMOSPHERE_SPOTS.map((spot, idx) => (
              <div
                key={idx}
                className="group card-warm overflow-hidden flex flex-col bg-white"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden">
                  <Image
                    src={spot.image}
                    alt={spot.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover group-hover:scale-106 transition-transform duration-500 ease-out"
                  />
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between space-y-2">
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
      {/* 4. FEATURED MENU (LƯỚI THẺ MÓN BÁN CHẠY)                 */}
      {/* ========================================================= */}
      <section className="py-20 sm:py-28 px-6 sm:px-12 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
          <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#C88A4B] font-semibold">
            THỰC ĐƠN TUYỂN CHỌN
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2D4A3E]">
            Món Bán Chạy Được Yêu Thích
          </h2>
          <p className="text-sm font-light text-[#222222]/75">
            Thức uống pha chế từ nguyên liệu xanh sạch, nước suối thanh khiết và
            nông sản Đắk Nông mộc mạc.
          </p>
        </div>

        {/* Lưới thẻ món ăn (Cards 6 món) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {BEST_SELLERS.map((item) => (
            <div
              key={item.id}
              className="card-warm overflow-hidden flex flex-col p-4 bg-white group"
            >
              {/* Ảnh vuông bo góc mềm mại */}
              <div className="relative aspect-square w-full rounded-xl overflow-hidden mb-4 bg-[#FDFBF7]">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                />
                <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#2D4A3E] text-white text-[10px] font-semibold tracking-wider uppercase shadow-sm">
                  {item.tag}
                </span>
              </div>

              {/* Thông tin món */}
              <div className="space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-baseline justify-between gap-2">
                    <h3 className="font-serif text-xl font-bold text-[#2D4A3E] group-hover:text-[#C88A4B] transition-colors">
                      {item.name}
                    </h3>
                    <span className="font-sans text-base font-bold text-[#C88A4B] shrink-0">
                      {item.price}
                    </span>
                  </div>
                  <p className="text-xs font-light text-[#222222]/75 leading-relaxed mt-2 line-clamp-2">
                    {item.desc}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#EAE6DF]/60 flex items-center justify-between text-xs">
                  <span className="text-[#2D4A3E]/70 font-medium">Pha chế thủ công</span>
                  <Link
                    href="/menu"
                    className="text-[#C88A4B] font-medium hover:underline flex items-center gap-1"
                  >
                    <span>Chi tiết</span>
                    <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/menu"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#2D4A3E] hover:bg-[#1F342B] text-white text-sm font-medium shadow-md transition-all duration-200"
          >
            <span>Khám phá toàn bộ thực đơn</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 5. TESTIMONIALS (ĐÁNH GIÁ KHÁCH HÀNG)                     */}
      {/* ========================================================= */}
      <section className="py-20 bg-[#F7F4EE] px-6 sm:px-12 border-t border-[#EAE6DF]">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#C88A4B] font-semibold">
              ĐÁNH GIÁ &amp; CẢM NHẬN
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2D4A3E]">
              Khách Hàng Nói Gì Về Cẩm Cù
            </h2>
            <div className="flex items-center justify-center gap-2 text-sm text-[#C88A4B] font-medium pt-1">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#C88A4B]/10 border border-[#C88A4B]/30">
                <Star size={14} className="fill-[#C88A4B] text-[#C88A4B]" />
                <span className="font-bold">100% Khách Hàng Đề Xuất</span>
              </span>
            </div>
          </div>

          {/* 3 Thẻ Testimonials */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((review, idx) => (
              <div
                key={idx}
                className="bg-white p-7 rounded-2xl border border-[#EAE6DF] shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-4"
              >
                {/* 5 Sao vàng ấm */}
                <div className="flex items-center gap-1 text-[#C88A4B]">
                  {[...Array(review.stars)].map((_, i) => (
                    <Star key={i} size={16} className="fill-[#C88A4B]" />
                  ))}
                </div>

                <p className="text-sm font-light italic text-[#222222]/85 leading-relaxed">
                  &ldquo;{review.comment}&rdquo;
                </p>

                <div className="pt-4 border-t border-[#EAE6DF] flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#2D4A3E]/10 border border-[#2D4A3E]/20 flex items-center justify-center text-[#2D4A3E] font-serif font-bold text-sm">
                    {review.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-serif font-bold text-sm text-[#2D4A3E]">
                      {review.name}
                    </p>
                    <p className="text-[11px] text-[#222222]/60">
                      {review.role}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
