"use client";

import React, { useState, useEffect } from "react";
import {
  Compass,
  ArrowUpRight,
  Phone,
  Mail,
  MapPin,
  Clock,
  Sparkles,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const GOOGLE_MAPS_URL =
  "https://maps.google.com/?cid=10605553198031545365&q=C%E1%BA%A9m+C%C3%B9+House";

export default function ContactPage() {
  const { lang } = useLanguage();
  const [digitalTime, setDigitalTime] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setDigitalTime(
        now.toLocaleTimeString("vi-VN", {
          timeZone: "Asia/Ho_Chi_Minh",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        })
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full min-h-screen lg:h-screen lg:max-h-screen lg:overflow-hidden flex flex-col justify-between bg-transparent text-[#F4EFEA] font-sans selection:bg-[#D4AF37] selection:text-[#0A0908] pt-24 sm:pt-28 pb-8 px-6 sm:px-12 z-10">
      
      <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col justify-center">
        
        {/* TOP STATUS BADGE */}
        <div className="flex items-center gap-3 mb-6 sm:mb-8">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[10px] sm:text-xs font-mono uppercase tracking-[0.25em] text-[#D4AF37] border border-[#D4AF37]/30 bg-[#0A0908]/90 shadow-sm">
            <Compass size={12} className="text-[#D4AF37]" />
            <span>BEACON • 11.99° N, 107.69° E</span>
          </span>

          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-mono text-[#F4EFEA]/70 border border-white/10 bg-[#0A0908]/80">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>GIA NGHĨA {digitalTime ? `${digitalTime} (GMT+7)` : ""}</span>
          </span>
        </div>

        {/* 2-COLUMN LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
          
          {/* CỘT TRÁI (7 Cols): TYPOGRAPHY & NỘI DUNG TỰ TÌNH */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8">
            <div className="space-y-4">
              <h1
                data-cursor-diff
                className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-light tracking-tight text-[#F4EFEA] leading-[1.06]"
              >
                TỪ GIA NGHĨA, <br />
                <span className="italic font-light text-[#D4AF37]">
                  TÔI CHỜ ĐÓN BẠN.
                </span>
              </h1>

              <p className="text-xs sm:text-sm md:text-base font-light text-[#F4EFEA]/85 leading-relaxed max-w-xl">
                {lang === "en"
                  ? "Wherever you may journey from across the globe, Cẩm Cù House always keeps a quiet timber veranda and a warm cup of coffee waiting for you."
                  : "Dù bạn đến từ bất kỳ đâu trên thế giới, Cẩm Cù House luôn dành sẵn một góc hiên nhà và một tách cà phê ấm."}
              </p>
            </div>

            {/* DIRECT ACTION LINKS */}
            <div className="pt-2 space-y-5 border-t border-[#D4AF37]/20 max-w-xl">
              
              {/* DÒNG 1: HOTLINE CHẠM LÀ GỌI */}
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 py-1">
                <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-widest text-[#D4AF37] flex items-center gap-1.5">
                  <Phone size={12} />
                  <span>Hotline trực tiếp:</span>
                </span>
                <div className="flex items-center gap-3">
                  <a
                    href="tel:0382851688"
                    className="text-lg sm:text-xl font-serif font-light text-[#F4EFEA] hover:text-[#D4AF37] transition-colors underline decoration-[#D4AF37]/40 underline-offset-4"
                  >
                    038 285 1688
                  </a>
                  <span className="text-white/20">/</span>
                  <a
                    href="tel:0774659000"
                    className="text-lg sm:text-xl font-serif font-light text-[#F4EFEA] hover:text-[#D4AF37] transition-colors underline decoration-[#D4AF37]/40 underline-offset-4"
                  >
                    077 465 9000
                  </a>
                </div>
              </div>

              {/* DÒNG 2: THƯ ĐIỆN TỬ */}
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 py-1">
                <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-widest text-[#D4AF37] flex items-center gap-1.5">
                  <Mail size={12} />
                  <span>Thư điện tử:</span>
                </span>
                <a
                  href="mailto:thuynhu8788@gmail.com"
                  className="text-base sm:text-lg font-serif font-light text-[#F4EFEA] hover:text-[#D4AF37] transition-colors underline decoration-[#D4AF37]/40 underline-offset-4"
                >
                  thuynhu8788@gmail.com
                </a>
              </div>

              {/* DÒNG 3: ĐỊA CHỈ & GOOGLE MAPS */}
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 py-1">
                <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-widest text-[#D4AF37] flex items-center gap-1.5 shrink-0">
                  <MapPin size={12} />
                  <span>Địa chỉ:</span>
                </span>
                <a
                  href={GOOGLE_MAPS_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs sm:text-sm font-light text-[#F4EFEA]/90 hover:text-[#D4AF37] transition-colors sm:text-right group inline-flex items-center gap-1"
                >
                  <span>Hẻm 437 Hùng Vương, Phường Nghĩa Trung, TP Gia Nghĩa, Đắk Nông</span>
                  <ArrowUpRight size={13} className="text-[#D4AF37] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0" />
                </a>
              </div>

              {/* DÒNG 4: GIỜ MỞ CỬA */}
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 py-1">
                <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-widest text-[#D4AF37] flex items-center gap-1.5 shrink-0">
                  <Clock size={12} />
                  <span>Giờ mở cửa:</span>
                </span>
                <span className="text-xs sm:text-sm font-mono text-[#F4EFEA]/80 sm:text-right">
                  T2 - T5 (07:00 - 18:00) | T6 - CN (07:00 - 22:00)
                </span>
              </div>

            </div>
          </div>

          {/* CỘT PHẢI (5 Cols): HUD KHÔNG GIAN 3D ĐẮK NÔNG */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center pointer-events-none">
            <div className="w-full max-w-sm p-6 rounded-2xl bg-[#0A0908]/85 border border-[#D4AF37]/25 shadow-2xl space-y-4 text-center">
              <div className="inline-flex items-center gap-1.5 text-[11px] font-mono text-[#D4AF37]">
                <Sparkles size={13} />
                <span>3D REALTIME GLOBE BEACON</span>
              </div>
              <p className="text-xs font-light text-[#F4EFEA]/75 leading-relaxed">
                Quả địa cầu 3D đang xoay chậm rãi theo nhịp ánh sáng thực tế.
                Điểm sáng nhấp nháy định vị tọa độ Cẩm Cù House tại thung lũng Gia Nghĩa.
              </p>
              <div className="pt-2 border-t border-white/10 text-[11px] font-mono text-[#D4AF37]/80">
                11.99° N • 107.69° E • Cao độ 650m
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* BOTTOM TICKER FOOTER */}
      <div className="max-w-7xl mx-auto w-full pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-[#F4EFEA]/40 gap-2">
        <span>CẨM CÙ HOUSE • GIA NGHĨA, ĐẮK NÔNG</span>
        <span className="text-[#D4AF37]/60">BẢN QUYỀN PHI THƯƠNG MẠI © 2026</span>
      </div>

    </div>
  );
}
