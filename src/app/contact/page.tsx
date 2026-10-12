"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StaggerText, { StaggerParagraph } from "@/components/motion/StaggerText";
import { useLanguage } from "@/context/LanguageContext";
import { motion } from "framer-motion";
import {
  MapPin,
  Clock,
  PhoneCall,
  Mail,
  Navigation,
  Car,
  Share2,
  Trees,
  Compass,
  Headphones,
  ShieldCheck
} from "lucide-react";

function AnimatedDigit({ to, duration = 1.0 }: { to: number; duration?: number }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start = 0;
    const stepTime = Math.max(Math.floor((duration * 1000) / (to || 1)), 25);
    const timer = setInterval(() => {
      start += 1;
      if (start <= to) {
        setVal(start);
      } else {
        clearInterval(timer);
      }
    }, stepTime);
    return () => clearInterval(timer);
  }, [to, duration]);

  return <span>{String(val).padStart(2, "0")}</span>;
}

export default function ContactPage() {
  const { locale, dict } = useLanguage();
  const isEn = locale === "en";

  return (
    <div className="bg-[#F9F8F3] dark:bg-[#121A15] min-h-screen text-[#1B281D] dark:text-[#F5F4EE] font-sans selection:bg-[#3E5C46] selection:text-white transition-colors duration-200">
      <main className="pt-20">
        {/* Top Ambient Banner */}
        <section className="animate-fade-up-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-14 pb-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-[900px] flex flex-col gap-2">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-stone-100 dark:bg-[#1E2B22] w-fit text-[#3E5C46] dark:text-[#88B795] text-xs font-semibold border border-stone-200 dark:border-stone-700/60">
                <Trees className="w-3.5 h-3.5 text-[#396663] dark:text-teal-400" />
                <span>{dict.contact.badge}</span>
              </div>
              <StaggerText
                as="h1"
                lines={[dict.contact.title]}
                stagger={0.1}
                className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#3E5C46] dark:text-[#F3EBD8] tracking-tight max-w-[900px] text-balance"
              />
              <div className="mt-1">
                <StaggerParagraph
                  text={dict.contact.subtitle}
                  className="text-base sm:text-lg text-stone-700 dark:text-[#F3EBD8]/75 max-w-2xl leading-relaxed font-medium"
                  delay={0.15}
                />
              </div>
            </div>

            {/* Quick Coordinate Badge */}
            <div className="hidden lg:flex items-center gap-3 bg-white/90 dark:bg-[#1E2B22] backdrop-blur-sm p-4 rounded-2xl border border-stone-200 dark:border-stone-700/60 shadow-sm">
              <div className="w-10 h-10 rounded-full bg-[#396663]/15 dark:bg-teal-900/30 flex items-center justify-center text-[#396663] dark:text-teal-400">
                <Compass className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] text-stone-500 dark:text-stone-400 uppercase tracking-wider font-semibold">
                  {dict.contact.coordinatesTitle}
                </span>
                <span className="text-sm text-[#3E5C46] dark:text-[#88B795] font-bold">
                  11.99° N, 107.69° E
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* 2-Column Balanced Core Section */}
        <section className="section-unified">
          <div className="container-unified">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Detailed Information */}
              <div className="lg:col-span-6 flex flex-col gap-6">
                {/* Card 1: Address Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.05 }}
                  className="card-unified flex flex-col gap-4"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#2D4233] text-[#88B795] flex items-center justify-center shrink-0">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div className="flex flex-col">
                      <span className="badge-unified mb-1">
                        {dict.contact.addressTitle}
                      </span>
                      <h3 className="font-serif text-[18px] font-medium text-[#F3EBD8] leading-snug">
                        {dict.common.addressFull}
                      </h3>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#F3EBD8]/10 text-[#F3EBD8]/75 flex items-start gap-3">
                    <Car className="w-5 h-5 text-[#88B795] shrink-0 mt-0.5" />
                    <p className="text-[15px] sm:text-[16px] font-medium text-[#F3EBD8]/75 leading-relaxed">
                      <strong className="text-[#F3EBD8] font-semibold">
                        {isEn ? "Easy Vehicle Access:" : "Lối vào thuận tiện:"}
                      </strong>{" "}
                      {dict.common.carParkingNote}
                    </p>
                  </div>
                </motion.div>

                {/* Card 2: Hours Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  className="card-unified flex flex-col gap-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#2D4233] text-[#88B795] flex items-center justify-center shrink-0">
                      <Clock className="w-6 h-6" />
                    </div>
                    <div className="flex flex-col">
                      <span className="badge-unified mb-1">
                        {dict.contact.openingHoursTitle}
                      </span>
                      <h3 className="font-serif text-[20px] sm:text-[22px] font-bold text-[#F3EBD8] leading-snug">
                        {isEn
                          ? "Breakfast, mountain lunch & specialty coffee"
                          : "Phục vụ điểm tâm, bữa chính & specialty coffee"}
                      </h3>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-[#F3EBD8]/10">
                    <div className="flex flex-col gap-1">
                      <span className="text-[12px] text-[#CC7755] uppercase font-bold tracking-wider">
                        {isEn ? "Mon – Thu" : "Thứ 2 – Thứ 5"}
                      </span>
                      <span className="font-serif text-2xl text-[#F3EBD8] font-bold">
                        <AnimatedDigit to={7} />:00 – <AnimatedDigit to={18} />:00
                      </span>
                      <span className="text-[15px] font-medium text-[#F3EBD8]/75">
                        {isEn ? "Daytime tranquil sanctuary" : "Không gian tĩnh dưỡng ban ngày"}
                      </span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[12px] text-[#88B795] font-bold uppercase tracking-wider">
                        {isEn ? "Fri – Sun" : "Thứ 6 – Chủ Nhật"}
                      </span>
                      <span className="font-serif text-2xl text-[#88B795] font-bold">
                        <AnimatedDigit to={7} />:00 – <AnimatedDigit to={22} />:00
                      </span>
                      <span className="text-[15px] font-medium text-[#F3EBD8]/75">
                        {isEn ? "Evening tea & riverside music" : "Trà thơm, lửa trại & nhạc bên suối"}
                      </span>
                    </div>
                  </div>
                </motion.div>

                {/* Card 3: Hotline Reception & Mail */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.15 }}
                  className="card-unified flex flex-col gap-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#422216] text-[#CC7755] flex items-center justify-center shrink-0">
                      <Headphones className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="badge-unified mb-1">
                        {dict.contact.hotlineTitle}
                      </span>
                      <h3 className="font-serif text-[20px] sm:text-[22px] font-bold text-[#F3EBD8] leading-snug">
                        {isEn ? "Dedicated support on every channel" : "Trực máy hỗ trợ chu đáo mọi khung giờ"}
                      </h3>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-[#F3EBD8]/10">
                    <a
                      href="tel:0382851688"
                      className="btn-press p-3.5 rounded-xl bg-[#121A15] hover:bg-[#1E2B22] border border-[#F3EBD8]/10 transition-colors flex items-center justify-between group"
                    >
                      <div className="flex flex-col">
                        <span className="text-[13px] text-[#F3EBD8]/70">Hotline 1 (Zalo)</span>
                        <span className="text-base font-bold text-[#CC7755]">038 285 1688</span>
                      </div>
                      <PhoneCall className="w-4 h-4 text-[#CC7755] group-hover:scale-110 transition-transform" />
                    </a>

                    <a
                      href="tel:0774659000"
                      className="btn-press p-3.5 rounded-xl bg-[#121A15] hover:bg-[#1E2B22] border border-[#F3EBD8]/10 transition-colors flex items-center justify-between group"
                    >
                      <div className="flex flex-col">
                        <span className="text-[13px] text-[#F3EBD8]/70">Hotline 2</span>
                        <span className="text-base font-bold text-[#CC7755]">077 465 9000</span>
                      </div>
                      <PhoneCall className="w-4 h-4 text-[#CC7755] group-hover:scale-110 transition-transform" />
                    </a>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-[#F3EBD8]/10 text-[15px] font-medium text-[#F3EBD8]/75">
                    <span>{isEn ? "International:" : "Quốc tế:"} <strong className="text-[#F3EBD8] font-semibold">+84 38 285 1688</strong></span>
                    <a
                      href="mailto:thuynhu8788@gmail.com"
                      className="text-[#CC7755] hover:underline flex items-center gap-1.5 font-medium"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>thuynhu8788@gmail.com</span>
                    </a>
                  </div>
                </motion.div>
              </div>

              {/* Right Column: Direction CTA & Social Channels */}
              <div className="lg:col-span-6 flex flex-col gap-6">
                {/* Card 4: Google Maps Primary CTA Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  className="card-unified flex flex-col gap-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-[#CC7755] text-white flex items-center justify-center shrink-0 shadow-sm">
                      <Navigation className="w-6 h-6" />
                    </div>
                    <div className="flex flex-col">
                      <span className="badge-unified mb-1">
                        {isEn ? "Online Navigation" : "Dẫn Đường Trực Tuyến"}
                      </span>
                      <h3 className="font-serif text-[20px] sm:text-[22px] font-bold text-[#F3EBD8] leading-snug">
                        {isEn ? "Directions & Map to Sanctuary" : "Chỉ Đường & Định Vị Tới Quán"}
                      </h3>
                    </div>
                  </div>

                  <p className="text-[15px] sm:text-[16px] font-medium text-[#F3EBD8]/75 leading-relaxed">
                    {isEn
                      ? "Located at Alley 437 Hung Vuong, Nghia Trung Ward, Gia Nghia City. Wide concrete paved road, safe for all vehicles directly to our spacious yard."
                      : "Quán tọa lạc tại Hẻm 437 Hùng Vương, Phường Nghĩa Trung, TP. Gia Nghĩa. Tuyến đường bê tông sạch sẽ, bằng phẳng, ô tô vào tận bãi đỗ xe trong khuôn viên quán."}
                  </p>

                  {/* Embedded Interactive Google Map with dark mode filter */}
                  <div className="w-full aspect-[16/10] sm:aspect-[16/8] rounded-xl overflow-hidden border border-[#F3EBD8]/10 shadow-inner bg-[#121A15] relative group">
                    <iframe
                      title="Bản đồ Google Maps Cẩm Cù House"
                      src="https://www.google.com/maps?q=11.9912,107.6888&hl=vi&z=15&output=embed"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      className="w-full h-full dark:invert-[0.92] dark:hue-rotate-180 dark:contrast-[0.9] dark:brightness-[0.85] dark:grayscale-[0.15] transition-all duration-300"
                    />
                    <div className="absolute inset-0 pointer-events-none rounded-xl dark:bg-emerald-950/10 border border-transparent dark:border-emerald-500/10" />
                  </div>

                  <div className="pt-2">
                    <a
                      href="https://maps.google.com/?q=Hem+437+Hung+Vuong+Nghia+Trung+Gia+Nghia+Dak+Nong"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-press w-full py-3.5 px-6 rounded-full bg-[#CC7755] text-white text-[14px] font-bold hover:bg-[#b86645] transition-all flex items-center justify-center gap-2 shadow-md"
                    >
                      <Navigation className="w-4 h-4" />
                      <span>{dict.common.openGoogleMaps}</span>
                    </a>
                  </div>
                </motion.div>

                {/* Card 5: Social Channels Deck */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.15 }}
                  className="card-unified flex flex-col gap-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#2D4233] text-[#88B795] flex items-center justify-center shrink-0">
                      <Share2 className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="badge-unified mb-1">
                        {isEn ? "Community Channels" : "Kênh Truyền Thông Quán"}
                      </span>
                      <h3 className="font-serif text-[20px] font-bold text-[#F3EBD8]">
                        {isEn ? "Connect & Follow Cam Cu House" : "Kết Nối Cùng Cẩm Cù House"}
                      </h3>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                    <a
                      href="https://www.facebook.com/share/1DVLMySW8H/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-press p-3.5 rounded-xl bg-[#121A15] hover:bg-[#1E2B22] border border-[#F3EBD8]/10 transition-colors flex items-center gap-3 shadow-sm"
                    >
                      <Share2 className="w-4 h-4 text-[#88B795]" />
                      <span className="text-[14px] font-semibold text-[#F3EBD8]">Facebook</span>
                    </a>

                    <a
                      href="https://www.tiktok.com/@camcuhousedaknong"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-press p-3.5 rounded-xl bg-[#121A15] hover:bg-[#1E2B22] border border-[#F3EBD8]/10 transition-colors flex items-center gap-3 shadow-sm"
                    >
                      <span className="font-bold text-xs text-[#88B795]">TT</span>
                      <span className="text-[14px] font-semibold text-[#F3EBD8]">TikTok</span>
                    </a>

                    <a
                      href="https://youtube.com/@Cam_Cu_House"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-press p-3.5 rounded-xl bg-[#121A15] hover:bg-[#1E2B22] border border-[#F3EBD8]/10 transition-colors flex items-center gap-3 shadow-sm"
                    >
                      <span className="text-[#CC7755] font-bold text-xs">YT</span>
                      <span className="text-[14px] font-semibold text-[#F3EBD8]">YouTube</span>
                    </a>
                  </div>
                </motion.div>

                {/* Card 6: Parking & Travel Guidance */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                  className="card-unified flex flex-col gap-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#2D4233] text-[#88B795] flex items-center justify-center shrink-0">
                      <Car className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="badge-unified mb-1">
                        {isEn ? "Travel & Parking Amenities" : "Tiện Ích Đỗ Xe & Cung Đường"}
                      </span>
                      <h3 className="font-serif text-[20px] font-bold text-[#F3EBD8]">
                        {isEn ? "Spacious Yard & Road Guidance" : "Bãi Đỗ Rộng Rãi & Chỉ Dẫn Cụ Thể"}
                      </h3>
                    </div>
                  </div>

                  <div className="space-y-3 pt-2 text-[15px] font-medium text-[#F3EBD8]/75 leading-relaxed">
                    <div className="flex items-start gap-2.5">
                      <ShieldCheck className="w-4 h-4 text-[#88B795] shrink-0 mt-1" />
                      <p>
                        <strong className="text-[#F3EBD8] font-semibold">
                          {isEn ? "Free parking yard:" : "Bãi đỗ xe ô tô miễn phí:"}
                        </strong>{" "}
                        {isEn
                          ? "Accommodates 4-to-16-seater vehicles comfortably, wide turning radius with 24/7 security."
                          : "Sức chứa thoải mái cho xe 4 – 16 chỗ, sân quay đầu rộng rãi, có camera an ninh quan sát."}
                      </p>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <Compass className="w-4 h-4 text-[#CC7755] shrink-0 mt-1" />
                      <p>
                        <strong className="text-[#F3EBD8] font-semibold">
                          {isEn ? "From Highway 14:" : "Từ Quốc Lộ 14:"}
                        </strong>{" "}
                        {isEn
                          ? "Turn into Alley 437 Hung Vuong (300m paved concrete road along tree canopy directly into the cafe gate)."
                          : "Rẽ vào Hẻm 437 Hùng Vương (khoảng 300m đường bê tông bằng phẳng, rợp bóng mát vào tận cổng quán)."}
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between text-[15px] font-medium text-[#F3EBD8]/70 border-t border-[#F3EBD8]/10">
                    <span className="flex items-center gap-1.5">
                      <Trees className="w-3.5 h-3.5 text-[#88B795]" />
                      {isEn ? "Highland eco-stream sanctuary" : "Không gian sinh thái mộc mạc"}
                    </span>
                    <span className="font-semibold text-[#88B795]">
                      {isEn ? "Support 24/7" : "Hỗ trợ đoàn đông"}
                    </span>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
