"use client";

import { useState, useEffect } from "react";
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
  Compass,
  Headphones,
  ShieldCheck,
  Copy,
  Check,
  ExternalLink
} from "lucide-react";
import { getVietnamTime } from "@/lib/openingHours";

export default function ContactPage() {
  const { locale, dict } = useLanguage();
  const isEn = locale === "en";

  const [copiedNumber, setCopiedNumber] = useState<string | null>(null);
  const [isWeekendGroup, setIsWeekendGroup] = useState(false);

  useEffect(() => {
    const vnDate = getVietnamTime();
    const day = vnDate.getDay();
    // 0: Sunday, 5: Friday, 6: Saturday
    setIsWeekendGroup(day === 0 || day === 5 || day === 6);
  }, []);

  const handleCopy = (num: string) => {
    const cleanNum = num.replace(/\s+/g, "");
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(cleanNum);
      setCopiedNumber(num);
      setTimeout(() => setCopiedNumber(null), 2200);
    }
  };

  return (
    <div className="bg-[var(--bg)] min-h-screen text-[var(--text)] font-sans selection:bg-[var(--surface-2)] selection:text-[var(--text)] transition-colors duration-200">
      <main className="pt-24 md:pt-28">
        {/* 1. Header / Đầu Trang */}
        <section className="w-full max-w-[1200px] mx-auto px-5 sm:px-10 pt-6 sm:pt-10 pb-8 sm:pb-12">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="max-w-[900px] flex flex-col gap-3">
              <span className="badge-unified">
                {dict.contact.badge}
              </span>

              <StaggerText
                as="h1"
                lines={[dict.contact.title]}
                stagger={0.1}
                className="font-serif text-[clamp(40px,6vw,76px)] font-bold text-[var(--text)] tracking-tight leading-[1.15] text-balance"
              />

              <div className="mt-2">
                <StaggerParagraph
                  text={dict.contact.subtitle}
                  className="text-[17px] leading-[1.7] text-[var(--text-muted)] max-w-[65ch] font-medium"
                  delay={0.15}
                />
              </div>
            </div>

            {/* Khối tọa độ bên phải */}
            <div className="shrink-0 flex items-center gap-3.5 card-unified !p-4 bg-[var(--surface)] border border-[var(--border)] shadow-sm">
              <div className="w-11 h-11 rounded-full bg-[var(--surface-2)] flex items-center justify-center text-[var(--accent-green)] shrink-0">
                <Compass className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-[12px] uppercase tracking-[0.12em] font-semibold text-[var(--accent-green)]">
                  {dict.contact.coordinatesTitle}
                </span>
                <span className="font-serif text-[18px] font-bold text-[var(--text)]">
                  11.99° N, 107.69° E
                </span>
                <span className="text-[13px] text-[var(--text-muted)]">
                  Gia Nghĩa, Đắk Nông
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Lưới 2 cột cân bằng (hệ card thống nhất) */}
        <section className="section-unified">
          <div className="container-unified">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
              {/* CỘT TRÁI: Địa chỉ, Giờ mở cửa, Hotline */}
              <div className="flex flex-col gap-6">
                {/* Card 1: Địa chỉ & kết nối */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4 }}
                  className="card-unified flex flex-col gap-4"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-[var(--surface-2)] text-[var(--accent-green)] flex items-center justify-center shrink-0">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div className="flex flex-col">
                      <span className="badge-unified mb-1">
                        {dict.contact.addressTitle}
                      </span>
                      <h2 className="font-serif text-[20px] font-bold text-[var(--text)] leading-snug">
                        {dict.common.addressFull}
                      </h2>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[var(--border)] flex items-start gap-3">
                    <Car className="w-5 h-5 text-[var(--accent-green)] shrink-0 mt-0.5" />
                    <p className="text-[15px] sm:text-[16px] font-medium text-[var(--text-muted)] leading-relaxed">
                      <strong className="text-[var(--text)] font-semibold">
                        {isEn ? "Easy Vehicle Access:" : "Lối vào thuận tiện:"}
                      </strong>{" "}
                      {dict.common.carParkingNote}
                    </p>
                  </div>
                </motion.div>

                {/* Card 2: Giờ mở cửa (2 ô: Thứ 2–5, Thứ 6–CN; giờ Playfair 28px; ô hôm nay viền xanh) */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.05 }}
                  className="card-unified flex flex-col gap-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-[var(--surface-2)] text-[var(--accent-green)] flex items-center justify-center shrink-0">
                      <Clock className="w-6 h-6" />
                    </div>
                    <div className="flex flex-col">
                      <span className="badge-unified mb-1">
                        {dict.contact.openingHoursTitle}
                      </span>
                      <h2 className="font-serif text-[20px] font-bold text-[var(--text)] leading-snug">
                        {isEn
                          ? "Daily Schedule & Service Rhythm"
                          : "Khung Giờ Mở Cửa & Đón Tiếp"}
                      </h2>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[var(--border)]">
                    {/* Ô Thứ 2 - Thứ 5 */}
                    <div
                      className={`p-4 rounded-2xl border transition-all ${
                        !isWeekendGroup
                          ? "border-[var(--accent-green)] bg-[var(--surface-2)] shadow-sm"
                          : "border-[var(--border)] bg-[var(--bg)]/40"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[12px] text-[var(--accent-clay)] uppercase font-bold tracking-wider">
                          {isEn ? "Mon – Thu" : "Thứ 2 – Thứ 5"}
                        </span>
                        {!isWeekendGroup && (
                          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[var(--accent-green)]/15 text-[var(--accent-green)] border border-[var(--accent-green)]/30">
                            {isEn ? "Today" : "Hôm nay"}
                          </span>
                        )}
                      </div>
                      <span className="font-serif text-[28px] text-[var(--text)] font-bold block leading-none my-1">
                        07:00 – 18:00
                      </span>
                      <p className="text-[15px] font-medium text-[var(--text-muted)] mt-1.5 leading-snug">
                        {isEn ? "Daytime tranquil sanctuary" : "Không gian tĩnh dưỡng ban ngày"}
                      </p>
                    </div>

                    {/* Ô Thứ 6 - Chủ Nhật */}
                    <div
                      className={`p-4 rounded-2xl border transition-all ${
                        isWeekendGroup
                          ? "border-[var(--accent-green)] bg-[var(--surface-2)] shadow-sm"
                          : "border-[var(--border)] bg-[var(--bg)]/40"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[12px] text-[var(--accent-green)] uppercase font-bold tracking-wider">
                          {isEn ? "Fri – Sun" : "Thứ 6 – Chủ Nhật"}
                        </span>
                        {isWeekendGroup && (
                          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[var(--accent-green)]/15 text-[var(--accent-green)] border border-[var(--accent-green)]/30">
                            {isEn ? "Today" : "Hôm nay"}
                          </span>
                        )}
                      </div>
                      <span className="font-serif text-[28px] text-[var(--accent-green)] font-bold block leading-none my-1">
                        07:00 – 22:00
                      </span>
                      <p className="text-[15px] font-medium text-[var(--text-muted)] mt-1.5 leading-snug">
                        {isEn ? "Evening tea & riverside music" : "Trà thơm, lửa trại & nhạc bên suối"}
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* Card 3: Hotline đón tiếp (2 số, nút sao chép) */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  className="card-unified flex flex-col gap-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-[var(--surface-2)] text-[var(--accent-clay)] flex items-center justify-center shrink-0">
                      <Headphones className="w-6 h-6" />
                    </div>
                    <div className="flex flex-col">
                      <span className="badge-unified mb-1">
                        {dict.contact.hotlineTitle}
                      </span>
                      <h2 className="font-serif text-[20px] font-bold text-[var(--text)] leading-snug">
                        {isEn ? "Direct Hotline & Booking Support" : "Hotline Đón Tiếp & Hỗ Trợ Đường Đi"}
                      </h2>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-[var(--border)]">
                    {/* Hotline 1 (Zalo) */}
                    <div className="p-3.5 rounded-2xl bg-[var(--bg)]/50 border border-[var(--border)] flex items-center justify-between gap-3">
                      <a href="tel:0382851688" className="flex flex-col group">
                        <span className="text-[13px] text-[var(--text-muted)]">Hotline 1 (Zalo)</span>
                        <span className="text-[17px] font-bold text-[var(--accent-clay)] group-hover:underline">
                          038 285 1688
                        </span>
                      </a>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleCopy("038 285 1688")}
                          aria-label="Sao chép số Hotline 1"
                          className="p-2 rounded-full bg-[var(--surface-2)] hover:bg-[var(--accent-clay)] hover:text-[#1B120E] text-[var(--text-muted)] transition-colors"
                          title={isEn ? "Copy phone number" : "Sao chép số"}
                        >
                          {copiedNumber === "038 285 1688" ? (
                            <Check className="w-4 h-4 text-[var(--accent-green)]" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                        <a
                          href="tel:0382851688"
                          aria-label="Gọi Hotline 1"
                          className="p-2 rounded-full bg-[var(--accent-clay)] text-[#1B120E] hover:bg-[#D98A68] transition-colors"
                        >
                          <PhoneCall className="w-4 h-4" />
                        </a>
                      </div>
                    </div>

                    {/* Hotline 2 */}
                    <div className="p-3.5 rounded-2xl bg-[var(--bg)]/50 border border-[var(--border)] flex items-center justify-between gap-3">
                      <a href="tel:0774659000" className="flex flex-col group">
                        <span className="text-[13px] text-[var(--text-muted)]">Hotline 2</span>
                        <span className="text-[17px] font-bold text-[var(--accent-clay)] group-hover:underline">
                          077 465 9000
                        </span>
                      </a>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleCopy("077 465 9000")}
                          aria-label="Sao chép số Hotline 2"
                          className="p-2 rounded-full bg-[var(--surface-2)] hover:bg-[var(--accent-clay)] hover:text-[#1B120E] text-[var(--text-muted)] transition-colors"
                          title={isEn ? "Copy phone number" : "Sao chép số"}
                        >
                          {copiedNumber === "077 465 9000" ? (
                            <Check className="w-4 h-4 text-[var(--accent-green)]" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                        <a
                          href="tel:0774659000"
                          aria-label="Gọi Hotline 2"
                          className="p-2 rounded-full bg-[var(--accent-clay)] text-[#1B120E] hover:bg-[#D98A68] transition-colors"
                        >
                          <PhoneCall className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-[var(--border)] text-[15px] font-medium text-[var(--text-muted)]">
                    <span>
                      {isEn ? "International:" : "Quốc tế:"}{" "}
                      <strong className="text-[var(--text)] font-semibold">+84 38 285 1688</strong>
                    </span>
                    <a
                      href="mailto:thuynhu8788@gmail.com"
                      className="text-[var(--accent-clay)] hover:underline flex items-center gap-1.5 font-medium"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>thuynhu8788@gmail.com</span>
                    </a>
                  </div>
                </motion.div>
              </div>

              {/* CỘT PHẢI: Chỉ đường & Định vị, Kênh truyền thông, Bãi đỗ rộng rãi */}
              <div className="flex flex-col gap-6">
                {/* Card 4: Chỉ đường & Định vị (Bản đồ bo 16px, nút Mở Google Maps cam) */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4 }}
                  className="card-unified flex flex-col gap-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-[var(--accent-clay)] text-[#1B120E] flex items-center justify-center shrink-0">
                      <Navigation className="w-6 h-6" />
                    </div>
                    <div className="flex flex-col">
                      <span className="badge-unified mb-1">
                        {isEn ? "Online Navigation" : "Dẫn Đường Trực Tuyến"}
                      </span>
                      <h2 className="font-serif text-[20px] font-bold text-[var(--text)] leading-snug">
                        {isEn ? "Directions & Map to Sanctuary" : "Chỉ Đường & Định Vị Tới Quán"}
                      </h2>
                    </div>
                  </div>

                  <p className="text-[15px] sm:text-[16px] font-medium text-[var(--text-muted)] leading-relaxed">
                    {isEn
                      ? "Located at Alley 437 Hung Vuong, Nghia Trung Ward, Gia Nghia City. Wide concrete paved road, safe for all vehicles directly to our spacious yard."
                      : "Quán tọa lạc tại Hẻm 437 Hùng Vương, Phường Nghĩa Trung, TP. Gia Nghĩa. Tuyến đường bê tông bằng phẳng, xe ô tô vào tận bãi đỗ trong khuôn viên quán."}
                  </p>

                  {/* Bản đồ nhúng bo 16px, lọc tối ở chế độ tối */}
                  <div className="w-full aspect-[16/10] sm:aspect-[16/9] rounded-[16px] overflow-hidden border border-[var(--border)] shadow-inner bg-[var(--bg)] relative group">
                    <iframe
                      title="Bản đồ Google Maps Cẩm Cù House"
                      src="https://www.google.com/maps?q=11.9912,107.6888&hl=vi&z=15&output=embed"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      className="w-full h-full rounded-[16px] dark:invert-[0.92] dark:hue-rotate-180 dark:contrast-[0.9] dark:brightness-[0.85] dark:grayscale-[0.15] transition-all duration-300"
                    />
                    <div className="absolute inset-0 pointer-events-none rounded-[16px] border border-transparent dark:border-[var(--accent-green)]/10" />
                  </div>

                  <div className="pt-1">
                    <a
                      href="https://maps.google.com/?q=Hem+437+Hung+Vuong+Nghia+Trung+Gia+Nghia+Dak+Nong"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary w-full flex items-center justify-center gap-2"
                    >
                      <Navigation className="w-4 h-4" />
                      <span>{dict.common.openGoogleMaps}</span>
                      <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                    </a>
                  </div>
                </motion.div>

                {/* Card 5: Kênh truyền thông (Facebook, TikTok, YouTube dạng 3 nút ngang) */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.05 }}
                  className="card-unified flex flex-col gap-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-[var(--surface-2)] text-[var(--accent-green)] flex items-center justify-center shrink-0">
                      <Share2 className="w-6 h-6" />
                    </div>
                    <div className="flex flex-col">
                      <span className="badge-unified mb-1">
                        {isEn ? "Community Channels" : "Kênh Truyền Thông Quán"}
                      </span>
                      <h2 className="font-serif text-[20px] font-bold text-[var(--text)] leading-snug">
                        {isEn ? "Connect & Follow Cẩm Cù House" : "Kết Nối Cùng Cẩm Cù House"}
                      </h2>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-[var(--border)]">
                    <a
                      href="https://www.facebook.com/share/1DVLMySW8H/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3.5 rounded-2xl bg-[var(--bg)]/50 hover:bg-[var(--surface-2)] border border-[var(--border)] transition-all flex items-center justify-center gap-2.5 group"
                    >
                      <Share2 className="w-4 h-4 text-[var(--accent-green)] group-hover:scale-110 transition-transform" />
                      <span className="text-[14px] sm:text-[15px] font-semibold text-[var(--text)]">Facebook</span>
                    </a>

                    <a
                      href="https://www.tiktok.com/@camcuhousedaknong"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3.5 rounded-2xl bg-[var(--bg)]/50 hover:bg-[var(--surface-2)] border border-[var(--border)] transition-all flex items-center justify-center gap-2.5 group"
                    >
                      <span className="font-bold text-xs text-[var(--accent-green)] group-hover:scale-110 transition-transform">TT</span>
                      <span className="text-[14px] sm:text-[15px] font-semibold text-[var(--text)]">TikTok</span>
                    </a>

                    <a
                      href="https://youtube.com/@Cam_Cu_House"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3.5 rounded-2xl bg-[var(--bg)]/50 hover:bg-[var(--surface-2)] border border-[var(--border)] transition-all flex items-center justify-center gap-2.5 group"
                    >
                      <span className="font-bold text-xs text-[var(--accent-clay)] group-hover:scale-110 transition-transform">YT</span>
                      <span className="text-[14px] sm:text-[15px] font-semibold text-[var(--text)]">YouTube</span>
                    </a>
                  </div>
                </motion.div>

                {/* Card 6: Bãi đỗ rộng rãi & Chỉ dẫn cụ thể (2 gạch đầu dòng, chữ phụ 15-16px) */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  className="card-unified flex flex-col gap-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-[var(--surface-2)] text-[var(--accent-green)] flex items-center justify-center shrink-0">
                      <Car className="w-6 h-6" />
                    </div>
                    <div className="flex flex-col">
                      <span className="badge-unified mb-1">
                        {isEn ? "Travel & Parking Amenities" : "Tiện Ích Đỗ Xe & Cung Đường"}
                      </span>
                      <h2 className="font-serif text-[20px] font-bold text-[var(--text)] leading-snug">
                        {isEn ? "Spacious Yard & Road Guidance" : "Bãi Đỗ Rộng Rãi & Chỉ Dẫn Cụ Thể"}
                      </h2>
                    </div>
                  </div>

                  <div className="space-y-3 pt-2 border-t border-[var(--border)] text-[15px] sm:text-[16px] font-medium text-[var(--text-muted)] leading-relaxed">
                    <div className="flex items-start gap-3">
                      <ShieldCheck className="w-5 h-5 text-[var(--accent-green)] shrink-0 mt-0.5" />
                      <p>
                        <strong className="text-[var(--text)] font-semibold">
                          {isEn ? "Bãi đỗ xe ô tô miễn phí:" : "Bãi đỗ xe ô tô miễn phí:"}
                        </strong>{" "}
                        {isEn
                          ? "Accommodates 4-to-16-seater vehicles comfortably, wide turning radius with 24/7 security."
                          : "Sức chứa thoải mái cho xe 4 – 16 chỗ, sân quay đầu rộng rãi, có camera an ninh quan sát."}
                      </p>
                    </div>

                    <div className="flex items-start gap-3">
                      <Compass className="w-5 h-5 text-[var(--accent-clay)] shrink-0 mt-0.5" />
                      <p>
                        <strong className="text-[var(--text)] font-semibold">
                          {isEn ? "Từ Quốc Lộ 14:" : "Từ Quốc Lộ 14:"}
                        </strong>{" "}
                        {isEn
                          ? "Turn into Alley 437 Hung Vuong (300m paved concrete road along tree canopy directly into the cafe gate)."
                          : "Rẽ vào Hẻm 437 Hùng Vương (khoảng 300m đường bê tông bằng phẳng, rợp bóng mát vào tận cổng quán)."}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Khối kêu gọi cuối (Final CTA) */}
        <section className="section-unified !pt-0">
          <div className="container-unified">
            <div className="card-accent rounded-[20px] p-7 sm:p-10 border border-[var(--border)] flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
              <div className="max-w-2xl">
                <span className="badge-unified mb-2 block w-fit mx-auto md:mx-0">
                  {isEn ? "Warm Highland Welcome" : "Hẹn Gặp Bạn Bên Bờ Suối"}
                </span>
                <h2 className="font-serif text-[clamp(26px,3vw,36px)] font-bold text-[var(--text)] leading-tight mb-2">
                  {isEn ? "Visit Cẩm Cù House in Gia Nghia" : "Ghé Cẩm Cù House, Lắng Nghe Suối Reo"}
                </h2>
                <p className="text-[15px] sm:text-[16px] text-[var(--text-muted)] font-medium">
                  {dict.common.addressFull}
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center md:justify-end gap-3 shrink-0">
                <a
                  href="tel:0382851688"
                  className="btn-primary inline-flex items-center gap-2"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>{dict.common.callHotline}</span>
                </a>
                <a
                  href="https://maps.google.com/?q=Hem+437+Hung+Vuong+Nghia+Trung+Gia+Nghia+Dak+Nong"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary inline-flex items-center gap-2"
                >
                  <Navigation className="w-4 h-4" />
                  <span>{dict.common.getDirections}</span>
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
