"use client";

import React from "react";
import { motion } from "framer-motion";
import { Compass, Sprout, Coffee, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

const EASE_AWWWARDS = [0.76, 0, 0.24, 1] as const;

export default function AboutPage() {
  const { lang } = useLanguage();

  return (
    <div className="relative min-h-screen bg-transparent text-[#F4EFEA] font-sans overflow-x-hidden selection:bg-[#D4AF37] selection:text-[#0A0908]">
      
      {/* ========================================================= */}
      {/* PHẦN 1: TUYÊN NGÔN TRIẾT LÝ (Chiếm trọn màn hình 100vh)   */}
      {/* ========================================================= */}
      <section className="min-h-screen w-full flex flex-col justify-between items-center py-24 sm:py-32 px-6 sm:px-12 text-center relative z-10">
        {/* Tagline */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE_AWWWARDS }}
          className="pt-6"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] sm:text-xs font-mono uppercase tracking-[0.3em] text-[#D4AF37] border border-[#D4AF37]/30 bg-[#0A0908]/90 shadow-md">
            <Compass size={13} />
            <span>TRIẾT LÝ KHỞI TẠO • GIA NGHĨA, ĐẮK NÔNG</span>
          </span>
        </motion.div>

        {/* Dòng Typography chiếm trọn màn hình */}
        <div className="max-w-6xl mx-auto my-auto py-10 space-y-4 sm:space-y-6">
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0, delay: 0.15, ease: EASE_AWWWARDS }}
            data-cursor-diff
            className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-serif font-light tracking-tight text-[#F4EFEA] leading-[1.05]"
          >
            TỪ BỎ ỒN ÀO.
          </motion.h1>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0, delay: 0.3, ease: EASE_AWWWARDS }}
            data-cursor-diff
            className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-serif italic font-light text-[#D4AF37] tracking-tight leading-[1.05]"
          >
            TÌM VỀ NGUYÊN BẢN.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.5, ease: EASE_AWWWARDS }}
            className="max-w-2xl mx-auto mt-6 sm:mt-10 text-xs sm:text-base md:text-lg font-light text-[#F4EFEA]/80 leading-relaxed tracking-wide"
          >
            {lang === "en"
              ? "Leave behind city haste. Retreat to ancient mossy rocks, highland pine breezes, and a warm cup of wood-roasted Robusta by the mountain brook."
              : "Rời khỏi những xô bồ phố thị, ghé lại góc hiên mộc bên suối để tìm về sự tĩnh lặng thuần khiết trong từng giọt cà phê rang củi."}
          </motion.p>
        </div>

        {/* Scroll cue */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.0, delay: 0.8 }}
          className="flex flex-col items-center gap-2 text-[10px] font-mono uppercase tracking-[0.3em] text-[#D4AF37]/80 pb-4"
        >
          <span>Cuộn để khám phá 3 giá trị mộc</span>
          <div className="w-[1px] h-10 bg-gradient-to-b from-[#D4AF37]/50 to-transparent" />
        </motion.div>
      </section>

      {/* ========================================================= */}
      {/* PHẦN 2: BA GIÁ TRỊ MỘC (3 cột trên PC, 1 cột trên Mobile)  */}
      {/* ========================================================= */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 sm:px-12 py-24 sm:py-32 border-t border-[#D4AF37]/20">
        <div className="text-center max-w-2xl mx-auto mb-16 sm:mb-20 space-y-3">
          <span className="text-[11px] font-mono uppercase tracking-[0.3em] text-[#D4AF37]">
            GIÁ TRỊ CỐT LÕI
          </span>
          <h2 className="text-3xl sm:text-5xl font-serif font-light text-[#F4EFEA]">
            Ba Giá Trị Mộc
          </h2>
          <p className="text-xs sm:text-sm font-light text-[#F4EFEA]/70 leading-relaxed">
            Nguyên tắc bất biến trong kiến tạo không gian và phục vụ tách cà phê tại Cẩm Cù House.
          </p>
        </div>

        {/* Layout 3 cột trên PC, 1 cột trên Mobile */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10">
          {/* Cột 1: Thuận theo tự nhiên */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1, ease: EASE_AWWWARDS }}
            className="p-8 sm:p-10 rounded-2xl bg-[#120805]/95 border border-[#D4AF37]/20 hover:border-[#D4AF37]/60 transition-all duration-300 space-y-5 shadow-xl flex flex-col justify-between group"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] group-hover:scale-110 transition-transform">
                <Sprout size={22} />
              </div>
              <span className="text-[10px] font-mono text-[#D4AF37] tracking-widest uppercase block">
                GIÁ TRỊ 01
              </span>
              <h3 className="text-xl sm:text-2xl font-serif font-semibold text-[#F4EFEA] group-hover:text-[#FFE1B3] transition-colors">
                Thuận Theo Tự Nhiên
              </h3>
              <p className="text-xs sm:text-sm font-light text-[#F4EFEA]/75 leading-relaxed">
                Không san ủi dốc đá, giữ nguyên lòng suối ngàn năm và bảo tồn thảm thực vật bản địa Đắk Nông. Mỗi nhành cây, viên đá cuội đều được nâng niu vẹn nguyên.
              </p>
            </div>
            <div className="pt-4 border-t border-white/5 text-[11px] font-mono text-[#D4AF37]/70">
              Địa hình nguyên bản • Tự nhiên che chở
            </div>
          </motion.div>

          {/* Cột 2: Cà phê xanh sạch */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2, ease: EASE_AWWWARDS }}
            className="p-8 sm:p-10 rounded-2xl bg-[#120805]/95 border border-[#D4AF37]/20 hover:border-[#D4AF37]/60 transition-all duration-300 space-y-5 shadow-xl flex flex-col justify-between group"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] group-hover:scale-110 transition-transform">
                <Coffee size={22} />
              </div>
              <span className="text-[10px] font-mono text-[#D4AF37] tracking-widest uppercase block">
                GIÁ TRỊ 02
              </span>
              <h3 className="text-xl sm:text-2xl font-serif font-semibold text-[#F4EFEA] group-hover:text-[#FFE1B3] transition-colors">
                Cà Phê Xanh Sạch
              </h3>
              <p className="text-xs sm:text-sm font-light text-[#F4EFEA]/75 leading-relaxed">
                Robusta mộc sấy tự nhiên từ nông hộ địa phương, rang củi thủ công trên than củi gỗ cà phê già. Tuyệt đối không hương liệu phụ gia hay chất bảo quản.
              </p>
            </div>
            <div className="pt-4 border-t border-white/5 text-[11px] font-mono text-[#D4AF37]/70">
              100% Robusta Đắk Nông • Rang củi mộc
            </div>
          </motion.div>

          {/* Cột 3: Khoảng lặng chữa lành */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.3, ease: EASE_AWWWARDS }}
            className="p-8 sm:p-10 rounded-2xl bg-[#120805]/95 border border-[#D4AF37]/20 hover:border-[#D4AF37]/60 transition-all duration-300 space-y-5 shadow-xl flex flex-col justify-between group"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] group-hover:scale-110 transition-transform">
                <Sparkles size={22} />
              </div>
              <span className="text-[10px] font-mono text-[#D4AF37] tracking-widest uppercase block">
                GIÁ TRỊ 03
              </span>
              <h3 className="text-xl sm:text-2xl font-serif font-semibold text-[#F4EFEA] group-hover:text-[#FFE1B3] transition-colors">
                Khoảng Lặng Chữa Lành
              </h3>
              <p className="text-xs sm:text-sm font-light text-[#F4EFEA]/75 leading-relaxed">
                Chốn dừng chân an yên, không xô bồ, không bán hàng ồn ã. Nơi bạn có thể ngồi hàng giờ ngắm hoa cẩm cù nở, lắng nghe tiếng suối và tìm lại nhịp điệu nội tâm.
              </p>
            </div>
            <div className="pt-4 border-t border-white/5 text-[11px] font-mono text-[#D4AF37]/70">
              Không xô bồ • Nơi tâm trí bình yên
            </div>
          </motion.div>
        </div>

        {/* CTA chuyển tiếp sang Không Gian */}
        <div className="mt-20 text-center">
          <Link
            href="/space"
            className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full border border-[#D4AF37]/40 bg-[#0A0908]/85 text-xs font-mono uppercase tracking-widest text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0A0908] transition-all duration-300 shadow-lg"
          >
            <span>Khám Phá Không Gian Bờ Suối</span>
            <ArrowRight size={13} />
          </Link>
        </div>
      </section>
    </div>
  );
}
