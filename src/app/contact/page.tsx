"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { MapPin, Clock, Phone, Compass, ArrowUpRight, Send, CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const Contact3DScene = dynamic(() => import("@/components/3d/Contact3DScene"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[480px] flex items-center justify-center bg-[#0A0908]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border border-[#D4AF37]/30 border-t-[#D4AF37] rounded-full animate-spin" />
        <p className="text-[11px] font-mono text-[#D4AF37]/70 uppercase tracking-widest">
          Khởi tạo Quả Địa Cầu 3D...
        </p>
      </div>
    </div>
  ),
});

const GOOGLE_MAPS_URL = "https://maps.google.com/?cid=10605553198031545365&q=C%E1%BA%A9m+C%C3%B9+House";

export default function ContactPage() {
  const { lang } = useLanguage();

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
    <div className="relative min-h-screen bg-[#0A0908] text-[#F4EFEA] font-sans overflow-x-hidden selection:bg-[#D4AF37] selection:text-[#0A0908] pt-32 pb-36">
      
      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-12">
        {/* ========================================================= */}
        {/* 1. HEADER: LỜI TỰ TÌNH CỦA CHỦ QUÁN                       */}
        {/* ========================================================= */}
        <header className="py-12 md:py-16 max-w-4xl space-y-6">
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
        {/* 2. CHIA ĐÔI MÀN HÌNH: FORM TỐI GIẢN & QUẢ ĐỊA CẦU 3D      */}
        {/* ========================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start mt-4">
          
          {/* CỘT 1 (6 Cols): FORM GỬI LỜI NHẮN DẠNG FLOATING LINES */}
          <div className="lg:col-span-6 space-y-8">
            <div className="border-b border-white/10 pb-4">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#D4AF37] block mb-1">
                SỔ LƯU BÚT LỮ KHÁCH
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-light text-[#F4EFEA]">
                Gửi Lời Nhắn Về Hiên Quán
              </h2>
            </div>

            {isSuccess ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-12 space-y-4"
              >
                <div className="w-12 h-12 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37] flex items-center justify-center text-[#D4AF37]">
                  <CheckCircle2 size={24} />
                </div>
                <h3 className="text-xl font-serif font-medium text-[#F4EFEA]">
                  Đã lưu lại lời nhắn của bạn!
                </h3>
                <p className="text-xs text-[#F4EFEA]/70 max-w-md leading-relaxed">
                  Cẩm Cù House đã nhận được dòng tâm tình này. Cảm ơn bạn và mong sớm được đón tiếp bạn bên bờ suối.
                </p>
                <button
                  onClick={() => setIsSuccess(false)}
                  className="mt-4 text-xs font-mono uppercase tracking-widest text-[#D4AF37] hover:underline"
                >
                  ← Gửi lời nhắn khác
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-10">
                {/* Dòng 1: Tên lữ khách */}
                <div className="relative group">
                  <label className="block text-[10px] font-mono uppercase tracking-widest text-[#D4AF37]/70 mb-2">
                    Tên của bạn *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Bạn tên là gì..."
                    className="w-full bg-transparent border-b border-white/20 pb-3 text-sm font-sans text-[#F4EFEA] placeholder-[#F4EFEA]/20 focus:outline-none focus:border-[#D4AF37] transition-colors duration-300"
                  />
                </div>

                {/* Dòng 2: Số điện thoại hoặc email */}
                <div className="relative group">
                  <label className="block text-[10px] font-mono uppercase tracking-widest text-[#D4AF37]/70 mb-2">
                    Cách liên hệ lại (Số điện thoại / Email - tùy chọn)
                  </label>
                  <input
                    type="text"
                    value={contactInfo}
                    onChange={(e) => setContactInfo(e.target.value)}
                    placeholder="Để lại số điện thoại hoặc email nếu cần phản hồi..."
                    className="w-full bg-transparent border-b border-white/20 pb-3 text-sm font-sans text-[#F4EFEA] placeholder-[#F4EFEA]/20 focus:outline-none focus:border-[#D4AF37] transition-colors duration-300"
                  />
                </div>

                {/* Dòng 3: Lời nhắn */}
                <div className="relative group">
                  <label className="block text-[10px] font-mono uppercase tracking-widest text-[#D4AF37]/70 mb-2">
                    Lời nhắn gửi *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Chia sẻ đôi dòng tâm sự, hỏi thăm đường đi hay góc bàn bên bờ suối..."
                    className="w-full bg-transparent border-b border-white/20 pb-3 text-sm font-sans text-[#F4EFEA] placeholder-[#F4EFEA]/20 focus:outline-none focus:border-[#D4AF37] transition-colors duration-300 resize-none"
                  />
                </div>

                {/* Nút gửi tối giản */}
                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#0A0908] bg-[#D4AF37] hover:bg-[#FFE1B3] px-8 py-3.5 rounded-full font-semibold transition-colors duration-300 cursor-pointer shadow-lg"
                  >
                    <Send size={13} />
                    <span>{isSubmitting ? "Đang gửi..." : "Gửi Về Cẩm Cù House"}</span>
                  </button>
                </div>
              </form>
            )}

            {/* Thông tin tọa độ & liên hệ vắn tắt */}
            <div className="pt-8 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#D4AF37] block">
                  ĐỊA CHỈ HIÊN QUÁN
                </span>
                <p className="font-light text-[#F4EFEA]/80 leading-relaxed">
                  Hẻm 437 Hùng Vương, Phường Nghĩa Trung, TP. Gia Nghĩa, Đắk Nông
                </p>
                <a
                  href={GOOGLE_MAPS_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-mono text-[#D4AF37] hover:underline pt-1"
                >
                  <span>Chỉ đường trên Google Maps</span>
                  <ArrowUpRight size={11} />
                </a>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#D4AF37] block">
                  GIỜ MỞ CỬA & HOTLINE
                </span>
                <p className="font-light text-[#F4EFEA]/80">07:00 – 22:00 (Mỗi ngày)</p>
                <a
                  href="tel:0382851688"
                  className="block font-mono text-[#D4AF37] hover:underline pt-1"
                >
                  038 285 1688
                </a>
              </div>
            </div>
          </div>

          {/* CỘT 2 (6 Cols): WEBGL 3D EARTH GLOBE VỚI BEACON ĐẮK NÔNG */}
          <div className="lg:col-span-6 sticky top-28">
            <div className="w-full h-[460px] sm:h-[560px] rounded-3xl overflow-hidden border border-white/10 bg-black/60 shadow-[0_20px_60px_rgba(0,0,0,0.9)] relative">
              <Contact3DScene />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
