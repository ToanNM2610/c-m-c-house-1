"use client";

import React from "react";
import dynamic from "next/dynamic";
import { Compass, ArrowUpRight, Phone, Mail, MapPin, Sparkles } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

import Contact3DScene from "@/components/3d/Contact3DScene";

const GOOGLE_MAPS_URL = "https://maps.google.com/?cid=10605553198031545365&q=C%E1%BA%A9m+C%C3%B9+House";
const ZALO_URL = "https://zalo.me/0382851688";
const HOTLINE_TEL = "tel:0382851688";
const EMAIL_MAILTO = "mailto:hello@camcuhouse.online";

export default function ContactPage() {
  const { lang } = useLanguage();

  return (
    <div className="relative min-h-screen bg-transparent text-[#F4EFEA] font-sans overflow-x-hidden selection:bg-[#D4AF37] selection:text-[#0A0908] pt-32 pb-36">
      
      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-12">
        {/* ========================================================= */}
        {/* 1. HEADER: TỰ TÌNH CỦA CHỦ QUÁN                           */}
        {/* ========================================================= */}
        <header className="py-10 md:py-14 max-w-4xl space-y-6">
          <div className="inline-flex items-center gap-2 text-[10px] sm:text-xs font-mono uppercase tracking-[0.35em] text-[#D4AF37]">
            <Compass size={13} />
            <span>THE BEACON • GIA NGHĨA, ĐẮK NÔNG (11.98° N, 107.70° E)</span>
          </div>

          <h1
            data-cursor-diff
            className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-serif font-light tracking-tight text-[#F4EFEA] leading-[1.05]"
          >
            TỪ GIA NGHĨA, <br />
            <span className="italic font-light text-[#D4AF37]">TÔI CHỜ ĐÓN BẠN.</span>
          </h1>

          <p className="text-sm sm:text-lg font-light text-[#F4EFEA]/80 leading-relaxed max-w-2xl">
            {lang === "en"
              ? "Wherever you may journey from on this Earth, Cẩm Cù House keeps a quiet timber patio and a warm cup of firewood coffee waiting for your soul."
              : "Dù bạn đến từ đâu trên quả địa cầu này, Cẩm Cù House luôn dành sẵn một góc hiên nhà và một tách cà phê mộc cho tâm hồn bạn."}
          </p>
        </header>


        {/* ========================================================= */}
        {/* 2. CHIA ĐÔI: LIÊN HỆ TRỰC TIẾP & QUẢ ĐỊA CẦU 3D          */}
        {/* ========================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center mt-6">
          
          {/* CỘT 1 (6 Cols): DIRECT CONTACT (KHÔNG FORM, CLICK LÀ KẾT NỐI) */}
          <div className="lg:col-span-6 space-y-12">
            
            <div className="border-b border-white/10 pb-4">
              <span className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.35em] text-[#D4AF37]">
                KẾT NỐI VỚI CHÚNG TÔI • DIRECT CONTACT
              </span>
            </div>

            {/* DÒNG 1: SỐ ĐIỆN THOẠI & ZALO SIÊU TO */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#F4EFEA]/40 flex items-center gap-2">
                <Phone size={12} className="text-[#D4AF37]" />
                <span>HOTLINE & ZALO TRỰC TIẾP</span>
              </span>

              <a
                href={ZALO_URL}
                target="_blank"
                rel="noreferrer"
                data-cursor-diff
                className="group inline-block text-3xl sm:text-5xl md:text-6xl font-serif font-light tracking-wide text-[#F4EFEA] hover:text-[#D4AF37] transition-all duration-300"
              >
                <span>038 285 1688</span>
                <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-[1px] bg-[#D4AF37]" />
              </a>

              <div className="pt-1 flex items-center gap-4 text-xs font-mono text-[#D4AF37]/80">
                <a
                  href={HOTLINE_TEL}
                  className="hover:underline flex items-center gap-1 text-[11px]"
                >
                  <span>Gọi trực tiếp</span>
                  <ArrowUpRight size={12} />
                </a>
                <span className="text-white/20">•</span>
                <a
                  href={ZALO_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:underline flex items-center gap-1 text-[11px]"
                >
                  <span>Nhắn qua Zalo</span>
                  <ArrowUpRight size={12} />
                </a>
              </div>
            </div>

            {/* DÒNG 2: HÒM THƯ ĐIỆN TỬ SIÊU TO */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#F4EFEA]/40 flex items-center gap-2">
                <Mail size={12} className="text-[#D4AF37]" />
                <span>HÒM THƯ ĐIỆN TỬ</span>
              </span>

              <a
                href={EMAIL_MAILTO}
                data-cursor-diff
                className="group inline-block text-2xl sm:text-4xl md:text-5xl font-serif font-light tracking-wide text-[#F4EFEA] hover:text-[#D4AF37] transition-all duration-300 break-all"
              >
                <span>hello@camcuhouse.online</span>
                <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-[1px] bg-[#D4AF37]" />
              </a>

              <p className="text-[11px] font-mono text-[#F4EFEA]/50">
                Nhấp vào để gửi email trực tiếp cho chúng tôi
              </p>
            </div>

            {/* DÒNG 3: ĐỊA CHỈ NHỎ TINH TẾ & BẢN ĐỒ CHỈ ĐƯỜNG */}
            <div className="pt-4 border-t border-white/10 space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#F4EFEA]/40 flex items-center gap-2">
                <MapPin size={12} className="text-[#D4AF37]" />
                <span>ĐỊA CHỈ HIÊN QUÁN</span>
              </span>

              <a
                href={GOOGLE_MAPS_URL}
                target="_blank"
                rel="noreferrer"
                className="group block space-y-1 hover:text-[#D4AF37] transition-colors"
              >
                <div className="text-xl sm:text-2xl font-serif text-[#F4EFEA] group-hover:text-[#D4AF37]">
                  Bờ suối Gia Nghĩa, Đắk Nông
                </div>
                <div className="text-xs font-light text-[#F4EFEA]/70 leading-relaxed">
                  Hẻm 437 Hùng Vương, Phường Nghĩa Trung, TP. Gia Nghĩa
                </div>
                <div className="inline-flex items-center gap-1.5 text-[11px] font-mono text-[#D4AF37] group-hover:translate-x-1 transition-transform pt-1">
                  <span>Mở ứng dụng Google Maps</span>
                  <ArrowUpRight size={12} />
                </div>
              </a>
            </div>

            {/* Thời gian đón khách */}
            <div className="text-xs font-mono text-[#F4EFEA]/60 flex items-center gap-2 pt-2">
              <Sparkles size={13} className="text-[#D4AF37]" />
              <span>Đón khách: 07:00 – 22:00 mỗi ngày • Không gian suối đá quanh năm</span>
            </div>

          </div>

          {/* CỘT 2 (6 Cols): WEBGL 3D EARTH GLOBE VỚI BEACON ĐẮK NÔNG */}
          <div className="lg:col-span-6 sticky top-28">
            <div className="w-full h-[460px] sm:h-[560px] rounded-3xl overflow-hidden border border-white/10 bg-black/60 shadow-[0_25px_70px_rgba(0,0,0,0.95)] relative">
              <Contact3DScene />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
