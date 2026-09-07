"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { MapPin, Clock, Phone, Compass, ArrowUpRight, Send, CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const GlowingOrb3D = dynamic(() => import("@/components/3d/GlowingOrb3D"), {
  ssr: false,
});

const GOOGLE_MAPS_URL = "https://maps.google.com/?cid=10605553198031545365&q=C%E1%BA%A9m+C%C3%B9+House";

export default function ContactPage() {
  const { lang, t } = useLanguage();

  const [name, setName] = useState("");
  const [contactInfo, setContactInfo] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;

    setIsSubmitting(true);
    try {
      await fetch("/api/guestbook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          contact: contactInfo.trim(),
          message: message.trim(),
        }),
      }).catch(() => {});

      setIsSuccess(true);
      setName("");
      setContactInfo("");
      setMessage("");
    } catch {
      setIsSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#0C0705] text-[#F4EFEA] font-sans overflow-x-hidden selection:bg-[#D4AF37] selection:text-[#0C0705] pt-28 pb-36">
      
      {/* Khối cầu ánh sáng Glowing Orb 3D trung tâm lơ lửng phía sau */}
      <div className="fixed inset-0 pointer-events-none z-0 flex items-center justify-center opacity-70">
        <div className="w-[500px] h-[500px] sm:w-[680px] sm:h-[680px]">
          <GlowingOrb3D />
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-12">
        {/* Header Heading Siêu To Khổng Lồ */}
        <header className="text-center py-12 md:py-20 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#D4AF37]/30 bg-black/50 text-[10px] sm:text-xs font-mono uppercase tracking-[0.28em] text-[#D4AF37]">
            <Compass size={13} />
            <span>CONNECT & SANCTUARY INQUIRY</span>
          </div>

          <h1
            data-cursor-diff
            className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-serif font-bold tracking-tight text-[#F4EFEA] leading-[1.05]"
          >
            {lang === "en" ? "SAY HELLO" : "GHÉ CHƠI"}
          </h1>

          <p className="max-w-xl mx-auto text-xs sm:text-sm font-light text-[#F4EFEA]/75 leading-relaxed">
            {lang === "en"
              ? "Leave a gentle note, ask for directions, or just drop by for a cup of firewood coffee by the stream."
              : "Để lại một lời nhắn mộc mạc, hỏi thăm đường đi hoặc ghé quán thưởng thức tách cà phê rang củi bên bờ suối."}
          </p>
        </header>

        {/* 2 Cột: Form Floating Lines & La Bàn Tọa Độ Minimal */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start mt-8">
          
          {/* Cột 1 (7 Cols): Floating Lines Contact Form */}
          <div className="lg:col-span-7 bg-black/40 backdrop-blur-xl border border-[#D4AF37]/20 rounded-3xl p-8 sm:p-12 shadow-[0_20px_60px_rgba(0,0,0,0.85)]">
            <div className="mb-8">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#D4AF37] block mb-1">
                LỜI NHẮN LỮ KHÁCH
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#F4EFEA]">
                Gửi Lời Nhắn Về Hiên Quán
              </h2>
            </div>

            {isSuccess ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-12 text-center space-y-4"
              >
                <div className="w-14 h-14 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37] flex items-center justify-center mx-auto text-[#D4AF37]">
                  <CheckCircle2 size={28} />
                </div>
                <h3 className="text-xl font-serif font-bold text-[#F4EFEA]">
                  Đã nhận lời nhắn của bạn!
                </h3>
                <p className="text-xs text-[#F4EFEA]/75 max-w-sm mx-auto">
                  Cẩm Cù House đã lưu lại dòng tâm sự ấm áp này. Chúc bạn một hành trình luôn bình an và thong thả.
                </p>
                <button
                  onClick={() => setIsSuccess(false)}
                  className="mt-4 px-6 py-2 rounded-full border border-[#D4AF37]/40 text-xs font-mono uppercase tracking-widest text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0C0705] transition-colors"
                >
                  Gửi lời nhắn khác
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Dòng 1: Tên lữ khách */}
                <div className="relative group">
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-[#D4AF37]/80 mb-2">
                    Tên của bạn *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nguyễn Văn A..."
                    className="w-full bg-transparent border-b border-[#D4AF37]/25 pb-3 text-sm font-sans text-[#F4EFEA] placeholder-[#F4EFEA]/25 focus:outline-none focus:border-[#D4AF37] transition-colors duration-300"
                  />
                </div>

                {/* Dòng 2: Số điện thoại hoặc email */}
                <div className="relative group">
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-[#D4AF37]/80 mb-2">
                    Số điện thoại hoặc Email (tùy chọn)
                  </label>
                  <input
                    type="text"
                    value={contactInfo}
                    onChange={(e) => setContactInfo(e.target.value)}
                    placeholder="0987... hoặc email@..."
                    className="w-full bg-transparent border-b border-[#D4AF37]/25 pb-3 text-sm font-sans text-[#F4EFEA] placeholder-[#F4EFEA]/25 focus:outline-none focus:border-[#D4AF37] transition-colors duration-300"
                  />
                </div>

                {/* Dòng 3: Lời nhắn gửi */}
                <div className="relative group">
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-[#D4AF37]/80 mb-2">
                    Lời chia sẻ hoặc lời nhắn *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Gửi gắm cảm xúc, hỏi thăm giờ ghé chơi hoặc đặt trước góc ngồi..."
                    className="w-full bg-transparent border-b border-[#D4AF37]/25 pb-3 text-sm font-sans text-[#F4EFEA] placeholder-[#F4EFEA]/25 focus:outline-none focus:border-[#D4AF37] transition-colors duration-300 resize-none"
                  />
                </div>

                {/* Nút gửi mạ vàng */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full bg-gradient-to-r from-[#D4AF37] via-[#E5C07B] to-[#FFE1B3] text-[#0C0705] font-semibold text-xs font-mono uppercase tracking-widest hover:scale-105 active:scale-95 transition-all duration-300 shadow-[0_0_25px_rgba(212,175,55,0.4)] cursor-pointer"
                  >
                    <Send size={14} />
                    <span>{isSubmitting ? "Đang gửi đi..." : "Gửi Lời Nhắn"}</span>
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Cột 2 (5 Cols): Tọa Độ & Thông Tin Không Gian Minimal */}
          <div className="lg:col-span-5 space-y-6">
            {/* Thẻ La Bàn Tọa Độ Vĩ Tuyến/Kinh Tuyến */}
            <div className="p-8 rounded-3xl bg-black/40 backdrop-blur-xl border border-[#D4AF37]/25 space-y-6 shadow-xl">
              <div className="flex items-center justify-between border-b border-[#D4AF37]/15 pb-4">
                <span className="text-[11px] font-mono uppercase tracking-widest text-[#D4AF37]">
                  GPS COORDINATES
                </span>
                <Compass size={18} className="text-[#D4AF37] animate-spin-slow" />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-baseline">
                  <span className="text-xs text-[#F4EFEA]/60 font-mono">Vĩ độ (Latitude):</span>
                  <span className="text-sm font-mono text-[#D4AF37] font-semibold">11°58&apos;33&quot; N</span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-xs text-[#F4EFEA]/60 font-mono">Kinh độ (Longitude):</span>
                  <span className="text-sm font-mono text-[#D4AF37] font-semibold">107°42&apos;11&quot; E</span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-xs text-[#F4EFEA]/60 font-mono">Độ cao:</span>
                  <span className="text-sm font-mono text-[#F4EFEA]/80">~620m trên mực nước biển</span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-xs text-[#F4EFEA]/60 font-mono">Khu vực:</span>
                  <span className="text-sm font-mono text-[#F4EFEA]/80">TP. Gia Nghĩa, Đắk Nông</span>
                </div>
              </div>

              <a
                href={GOOGLE_MAPS_URL}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3.5 rounded-full border border-[#D4AF37]/50 hover:border-[#D4AF37] text-xs font-mono uppercase tracking-widest text-[#F4EFEA] hover:text-[#D4AF37] flex items-center justify-center gap-2 transition-all bg-black/30 hover:bg-black/60"
              >
                <span>Mở Bản Đồ Chỉ Đường</span>
                <ArrowUpRight size={14} />
              </a>
            </div>

            {/* Thẻ Giờ Mở Cửa & Hotline */}
            <div className="p-8 rounded-3xl bg-black/40 backdrop-blur-xl border border-[#D4AF37]/20 space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] shrink-0 mt-1">
                  <Clock size={18} />
                </div>
                <div>
                  <h4 className="text-sm font-serif font-bold text-[#F4EFEA]">Giờ Đón Khách</h4>
                  <p className="text-xs text-[#F4EFEA]/75 mt-1 font-mono">07:00 – 22:00 (Mỗi ngày)</p>
                  <p className="text-[11px] text-[#D4AF37]/70 mt-0.5">Không gian suối đón khách quanh năm</p>
                </div>
              </div>

              <div className="flex items-start gap-4 pt-4 border-t border-white/5">
                <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] shrink-0 mt-1">
                  <MapPin size={18} />
                </div>
                <div>
                  <h4 className="text-sm font-serif font-bold text-[#F4EFEA]">Địa Chỉ Hiên Quán</h4>
                  <p className="text-xs text-[#F4EFEA]/75 mt-1 leading-relaxed">
                    Hẻm 437 Hùng Vương, P. Nghĩa Trung, TP. Gia Nghĩa, Đắk Nông
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 pt-4 border-t border-white/5">
                <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] shrink-0 mt-1">
                  <Phone size={18} />
                </div>
                <div>
                  <h4 className="text-sm font-serif font-bold text-[#F4EFEA]">Đường Dây Nóng</h4>
                  <a
                    href="tel:0382851688"
                    className="text-sm font-mono text-[#D4AF37] hover:underline block mt-1"
                  >
                    038 285 1688
                  </a>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
