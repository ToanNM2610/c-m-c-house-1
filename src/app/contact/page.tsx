"use client";

import { useState, useEffect } from "react";
import Footer from "@/components/Footer";
import { trackEvent } from "@/lib/analytics";
import { useLanguage } from "@/context/LanguageContext";
import { motion } from "framer-motion";
import {
  MapPin,
  Clock,
  PhoneCall,
  Mail,
  Navigation,
  Car,
  Compass,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  Share2
} from "lucide-react";
import { getVietnamTime } from "@/lib/openingHours";
import RotatingSeal from "@/components/ui/RotatingSeal";
import ContourLines from "@/components/ui/ContourLines";

interface DaySchedule {
  dayId: number; // 0 = Sun, 1 = Mon, ..., 6 = Sat
  nameVn: string;
  nameEn: string;
  hours: string;
}

const SCHEDULE_DAYS: DaySchedule[] = [
  { dayId: 1, nameVn: "Thứ Hai", nameEn: "Monday", hours: "07:00 – 18:00" },
  { dayId: 2, nameVn: "Thứ Ba", nameEn: "Tuesday", hours: "07:00 – 18:00" },
  { dayId: 3, nameVn: "Thứ Tư", nameEn: "Wednesday", hours: "07:00 – 18:00" },
  { dayId: 4, nameVn: "Thứ Năm", nameEn: "Thursday", hours: "07:00 – 18:00" },
  { dayId: 5, nameVn: "Thứ Sáu", nameEn: "Friday", hours: "07:00 – 22:00" },
  { dayId: 6, nameVn: "Thứ Bảy", nameEn: "Saturday", hours: "07:00 – 22:00" },
  { dayId: 0, nameVn: "Chủ Nhật", nameEn: "Sunday", hours: "07:00 – 22:00" },
];

export default function ContactPage() {
  const { locale, dict } = useLanguage();
  const isEn = locale === "en";

  const [copiedNumber, setCopiedNumber] = useState<string | null>(null);
  const [currentDayId, setCurrentDayId] = useState<number>(1);

  useEffect(() => {
    const vnDate = getVietnamTime();
    setCurrentDayId(vnDate.getDay());
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
    <div className="bg-[var(--paper)] min-h-screen text-[var(--ink)] font-sans selection:bg-[var(--basalt)] selection:text-white transition-colors duration-200">
      <main className="pt-28 md:pt-36">
        {/* 1. ĐẦU TRANG */}
        <section className="relative w-full max-w-[1280px] mx-auto px-5 sm:px-10 pb-12 sm:pb-16 overflow-hidden">
          <ContourLines className="text-[var(--ink)] opacity-[0.06] top-0 right-0 w-[500px] h-[500px]" />

          <div className="relative z-10 max-w-[960px]">
            {/* Tọa độ mono */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--paper-2)] border border-[var(--line)] text-[12px] font-mono tracking-widest uppercase text-[var(--basalt)] mb-4">
              <Compass className="w-3.5 h-3.5" />
              <span>11.99° N · 107.69° E · ĐỘ CAO 800M+</span>
            </div>

            {/* H1 "Từ Gia Nghĩa, Cẩm Cù House Chờ Đón Bạn" */}
            <h1 className="font-serif text-[clamp(36px,5.5vw,72px)] font-bold tracking-tight leading-[1.08] text-balance mb-4 text-[var(--ink)]">
              {isEn
                ? "From Gia Nghia, Cẩm Cù House Awaits You"
                : "Từ Gia Nghĩa, Cẩm Cù House Chờ Đón Bạn"}
            </h1>

            {/* Địa chỉ đầy đủ cỡ Fraunces 32px ngay dưới */}
            <p className="font-serif text-[clamp(20px,2.5vw,32px)] font-medium leading-[1.3] text-[var(--basalt)]">
              {dict.common.addressFull}
            </p>
          </div>
        </section>

        {/* 2. BỐ CỤC 2 CỘT */}
        <section className="w-full max-w-[1280px] mx-auto px-5 sm:px-10 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* CỘT TRÁI (7 cột): Bản đồ lớn bo 28px + Lọc ấm/tối + Nút Mở Google Maps bazan */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              <div className="card-unified !p-4 sm:!p-6 flex flex-col gap-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[var(--paper-2)] text-[var(--basalt)] flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="font-mono text-[11px] uppercase tracking-wider text-[var(--basalt)] block">
                        GOOGLE MAPS NAVIGATION
                      </span>
                      <h2 className="font-serif text-[22px] font-bold text-[var(--ink)]">
                        {isEn ? "Directions & Satellite Map" : "Bản Đồ Chỉ Đường Trực Tuyến"}
                      </h2>
                    </div>
                  </div>
                  <span className="hidden sm:inline-block font-mono text-[11px] text-[var(--ink-muted)]">
                    GPS: 11.9912, 107.6888
                  </span>
                </div>

                {/* Bản đồ lớn bo 28px */}
                <div className="w-full aspect-[4/3] sm:aspect-[16/10] rounded-[28px] overflow-hidden border border-[var(--line)] relative group shadow-sm bg-[var(--paper-2)]">
                  <iframe
                    title="Bản đồ Google Maps Cẩm Cù House"
                    src="https://www.google.com/maps?q=11.9912,107.6888&hl=vi&z=15&output=embed"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="w-full h-full rounded-[28px] sepia-[0.18] contrast-[1.02] brightness-[0.98] dark:invert-[0.92] dark:hue-rotate-180 dark:contrast-[0.9] dark:brightness-[0.85] dark:grayscale-[0.15] dark:sepia-0 transition-all duration-300"
                  />
                  <div className="absolute inset-0 pointer-events-none rounded-[28px] border border-[var(--line)]" />
                </div>

                {/* Nút "Mở Google Maps" bazan */}
                <div className="pt-2">
                  <a
                    href="https://maps.google.com/?q=Hem+437+Hung+Vuong+Nghia+Trung+Gia+Nghia+Dak+Nong"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackEvent("click_directions")}
                    className="btn-primary w-full flex items-center justify-center gap-2.5 text-[16px] py-4"
                  >
                    <Navigation className="w-5 h-5" />
                    <span>{dict.common.openGoogleMaps}</span>
                    <ExternalLink className="w-4 h-4 opacity-75" />
                  </a>
                </div>
              </div>
            </div>

            {/* CỘT PHẢI (5 cột): Giờ mở cửa bảng 7 ngày, Hotline 2 số cỡ lớn, Kênh truyền thông */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              {/* Card Giờ mở cửa: Bảng 7 ngày */}
              <div className="card-unified !p-6 flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[var(--paper-2)] text-[var(--stream)] flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-mono text-[11px] uppercase tracking-wider text-[var(--stream)] block">
                      SCHEDULE & OPENING HOURS
                    </span>
                    <h2 className="font-serif text-[22px] font-bold text-[var(--ink)]">
                      {isEn ? "Opening Hours (7 Days)" : "Lịch Mở Cửa (7 Ngày Trong Tuần)"}
                    </h2>
                  </div>
                </div>

                {/* Bảng 7 ngày */}
                <div className="divide-y divide-[var(--line)] pt-2 border-t border-[var(--line)]">
                  {SCHEDULE_DAYS.map((item) => {
                    const isToday = item.dayId === currentDayId;
                    return (
                      <div
                        key={item.dayId}
                        className={`py-2.5 px-3 rounded-xl flex items-center justify-between text-[15px] transition-colors ${
                          isToday
                            ? "bg-[rgba(226,174,59,0.20)] border border-[var(--flower)] font-semibold"
                            : "hover:bg-[var(--paper-2)]/50"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className={`${isToday ? "text-[var(--ink)] font-bold" : "text-[var(--ink-muted)]"}`}>
                            {isEn ? item.nameEn : item.nameVn}
                          </span>
                          {isToday && (
                            <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-[var(--flower)] text-[var(--charcoal)] font-bold uppercase tracking-wider">
                              {isEn ? "Today" : "Hôm nay"}
                            </span>
                          )}
                        </div>
                        <span className={`font-mono text-[14px] ${isToday ? "text-[var(--basalt)] font-bold" : "text-[var(--ink)]"}`}>
                          {item.hours}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Card Hotline: 2 số cỡ lớn, nút sao chép + Zalo */}
              <div className="card-unified !p-6 flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[var(--paper-2)] text-[var(--basalt)] flex items-center justify-center shrink-0">
                    <PhoneCall className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-mono text-[11px] uppercase tracking-wider text-[var(--basalt)] block">
                      DIRECT ASSISTANCE & ZALO
                    </span>
                    <h2 className="font-serif text-[22px] font-bold text-[var(--ink)]">
                      {isEn ? "Hotline & Direct Contact" : "Hotline & Hỗ Trợ Đón Tiếp"}
                    </h2>
                  </div>
                </div>

                <div className="flex flex-col gap-3 pt-2 border-t border-[var(--line)]">
                  {/* Hotline 1 (Zalo) */}
                  <div className="p-4 rounded-2xl bg-[var(--paper-2)] border border-[var(--line)] flex items-center justify-between gap-3">
                    <div className="flex flex-col">
                      <span className="font-mono text-[11px] text-[var(--ink-muted)] uppercase tracking-wider">
                        Hotline 1 (Zalo)
                      </span>
                      <a
                        href="tel:0382851688"
                        onClick={() => trackEvent("click_call")}
                        className="font-serif text-[24px] sm:text-[26px] font-bold text-[var(--basalt)] tracking-tight hover:underline leading-tight"
                      >
                        038 285 1688
                      </a>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleCopy("038 285 1688")}
                        aria-label="Sao chép số Hotline 1"
                        className="p-2.5 rounded-full bg-[var(--card)] hover:bg-[var(--basalt)] hover:text-white text-[var(--ink-muted)] border border-[var(--line)] transition-colors"
                        title={isEn ? "Copy phone number" : "Sao chép số"}
                      >
                        {copiedNumber === "038 285 1688" ? (
                          <Check className="w-4 h-4 text-[var(--moss)]" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                      <a
                        href="tel:0382851688"
                        onClick={() => trackEvent("click_call")}
                        aria-label="Gọi Hotline 1"
                        className="p-2.5 rounded-full bg-[var(--basalt)] text-white hover:opacity-90 transition-opacity"
                      >
                        <PhoneCall className="w-4 h-4" />
                      </a>
                    </div>
                  </div>

                  {/* Hotline 2 */}
                  <div className="p-4 rounded-2xl bg-[var(--paper-2)] border border-[var(--line)] flex items-center justify-between gap-3">
                    <div className="flex flex-col">
                      <span className="font-mono text-[11px] text-[var(--ink-muted)] uppercase tracking-wider">
                        Hotline 2
                      </span>
                      <a
                        href="tel:0774659000"
                        onClick={() => trackEvent("click_call")}
                        className="font-serif text-[24px] sm:text-[26px] font-bold text-[var(--basalt)] tracking-tight hover:underline leading-tight"
                      >
                        077 465 9000
                      </a>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleCopy("077 465 9000")}
                        aria-label="Sao chép số Hotline 2"
                        className="p-2.5 rounded-full bg-[var(--card)] hover:bg-[var(--basalt)] hover:text-white text-[var(--ink-muted)] border border-[var(--line)] transition-colors"
                        title={isEn ? "Copy phone number" : "Sao chép số"}
                      >
                        {copiedNumber === "077 465 9000" ? (
                          <Check className="w-4 h-4 text-[var(--moss)]" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                      <a
                        href="tel:0774659000"
                        onClick={() => trackEvent("click_call")}
                        aria-label="Gọi Hotline 2"
                        className="p-2.5 rounded-full bg-[var(--basalt)] text-white hover:opacity-90 transition-opacity"
                      >
                        <PhoneCall className="w-4 h-4" />
                      </a>
                    </div>
                  </div>

                  {/* Mail & Quốc tế */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 text-[14px] text-[var(--ink-muted)] font-mono">
                    <span>Quốc tế: +84 38 285 1688</span>
                    <a
                      href="mailto:thuynhu8788@gmail.com"
                      className="text-[var(--stream)] hover:underline inline-flex items-center gap-1.5"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>thuynhu8788@gmail.com</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Card Kênh truyền thông: Facebook, TikTok, YouTube dạng 3 nút tròn */}
              <div className="card-unified !p-6 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-mono text-[11px] uppercase tracking-wider text-[var(--stream)] block">
                      SOCIAL MEDIA
                    </span>
                    <h2 className="font-serif text-[20px] font-bold text-[var(--ink)]">
                      {isEn ? "Social Channels" : "Kênh Truyền Thông Quán"}
                    </h2>
                  </div>

                  {/* 3 nút tròn */}
                  <div className="flex items-center gap-3">
                    <a
                      href="https://www.facebook.com/share/1DVLMySW8H/"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Facebook Cẩm Cù House"
                      className="w-12 h-12 rounded-full border border-[var(--line)] bg-[var(--paper-2)] hover:bg-[var(--basalt)] hover:text-white hover:border-[var(--basalt)] transition-all flex items-center justify-center text-[var(--ink)] shadow-sm"
                    >
                      <Share2 className="w-5 h-5" />
                    </a>
                    <a
                      href="https://www.tiktok.com/@camcuhousedaknong"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="TikTok Cẩm Cù House"
                      className="w-12 h-12 rounded-full border border-[var(--line)] bg-[var(--paper-2)] hover:bg-[var(--basalt)] hover:text-white hover:border-[var(--basalt)] transition-all flex items-center justify-center text-[var(--ink)] font-bold text-xs shadow-sm"
                    >
                      TT
                    </a>
                    <a
                      href="https://youtube.com/@Cam_Cu_House"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="YouTube Cẩm Cù House"
                      className="w-12 h-12 rounded-full border border-[var(--line)] bg-[var(--paper-2)] hover:bg-[var(--basalt)] hover:text-white hover:border-[var(--basalt)] transition-all flex items-center justify-center text-[var(--ink)] font-bold text-xs shadow-sm"
                    >
                      YT
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. CÁCH ĐẾN QUÁN (Các bước đánh số 1–3 nối bằng đường nét đứt) */}
        <section className="w-full max-w-[1280px] mx-auto px-5 sm:px-10 pb-20">
          <div className="card-unified !p-8 sm:!p-12 relative overflow-hidden">
            <div className="max-w-[720px] mb-10">
              <span className="font-mono text-[12px] uppercase tracking-widest text-[var(--basalt)] font-semibold block mb-2">
                DIRECTIONS & ROUTE GUIDANCE
              </span>
              <h2 className="font-serif text-[clamp(28px,3.5vw,44px)] font-bold text-[var(--ink)] leading-tight">
                {isEn ? "3 Simple Steps to Reach Our Haven" : "Cách Đến Quán Trong 3 Bước Thuận Tiện"}
              </h2>
              <p className="text-[16px] text-[var(--ink-muted)] mt-2 leading-relaxed">
                {isEn
                  ? "A peaceful journey from central Gia Nghia City directly into the shady forest canopy and natural stream yard."
                  : "Cung đường di chuyển an toàn, rợp mát bóng cây và thuận lợi cho mọi phương tiện di chuyển."}
              </p>
            </div>

            {/* Các bước 1-3 với đường nét đứt nối */}
            <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 pt-4">
              {/* Đường nét đứt nối trên desktop */}
              <div className="hidden md:block absolute top-[52px] left-[15%] right-[15%] h-[2px] border-t-2 border-dashed border-[var(--line)] z-0 pointer-events-none" />

              {/* Bước 1 */}
              <div className="relative z-10 flex flex-col items-start gap-4">
                <div className="w-14 h-14 rounded-full bg-[var(--paper)] border-2 border-[var(--basalt)] text-[var(--basalt)] font-serif font-bold text-[22px] flex items-center justify-center shadow-sm">
                  01
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="font-mono text-[12px] uppercase text-[var(--stream)] font-bold tracking-wider">
                    {isEn ? "From Highway 14" : "Từ Quốc Lộ 14"}
                  </span>
                  <h3 className="font-serif text-[20px] font-bold text-[var(--ink)]">
                    {isEn ? "Turn into Alley 437 Hung Vuong" : "Rẽ vào Hẻm 437 Hùng Vương"}
                  </h3>
                  <p className="text-[15px] text-[var(--ink-muted)] leading-relaxed">
                    {isEn
                      ? "Located right in Nghia Trung Ward, easy to spot with welcoming road signs on both sides."
                      : "Trục đường chính Phường Nghĩa Trung, biển chỉ dẫn rõ ràng và thông thoáng."}
                  </p>
                </div>
              </div>

              {/* Bước 2 */}
              <div className="relative z-10 flex flex-col items-start gap-4">
                <div className="w-14 h-14 rounded-full bg-[var(--paper)] border-2 border-[var(--basalt)] text-[var(--basalt)] font-serif font-bold text-[22px] flex items-center justify-center shadow-sm">
                  02
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="font-mono text-[12px] uppercase text-[var(--stream)] font-bold tracking-wider">
                    {isEn ? "300m Paved Concrete" : "300m Đường Bê Tông"}
                  </span>
                  <h3 className="font-serif text-[20px] font-bold text-[var(--ink)]">
                    {isEn ? "Shady Canopy to the Gate" : "Đường Phẳng Rợp Bóng Mát"}
                  </h3>
                  <p className="text-[15px] text-[var(--ink-muted)] leading-relaxed">
                    {isEn
                      ? "300 meters of flat, smooth concrete road along the gentle valley canopy straight to our entrance."
                      : "Khoảng 300m đường bê tông bằng phẳng, rợp bóng mát cây xanh dẫn thẳng vào cổng quán."}
                  </p>
                </div>
              </div>

              {/* Bước 3 */}
              <div className="relative z-10 flex flex-col items-start gap-4">
                <div className="w-14 h-14 rounded-full bg-[var(--paper)] border-2 border-[var(--basalt)] text-[var(--basalt)] font-serif font-bold text-[22px] flex items-center justify-center shadow-sm">
                  03
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="font-mono text-[12px] uppercase text-[var(--stream)] font-bold tracking-wider">
                    {isEn ? "Spacious Parking Yard" : "Bãi Đỗ Xe Rộng Rãi"}
                  </span>
                  <h3 className="font-serif text-[20px] font-bold text-[var(--ink)]">
                    {isEn ? "Comfortable 4-16 Seats Parking" : "Đỗ Xe 4–16 Chỗ Thuận Tiện"}
                  </h3>
                  <p className="text-[15px] text-[var(--ink-muted)] leading-relaxed">
                    {isEn
                      ? "Spacious turning yard for 4 to 16-seater cars, motorbikes with 24/7 security camera."
                      : "Sân quay đầu rộng rãi, bãi xe ô tô miễn phí an toàn có camera an ninh quan sát."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. CTA CUỐI: Display "Hẹn gặp bạn bên bờ suối", Hotline + Chỉ đường */}
        <section className="w-full bg-[var(--charcoal)] text-[#FDFBF7] py-20 relative overflow-hidden">
          <ContourLines className="text-[var(--paper)] opacity-[0.08] top-0 left-0 w-full h-full" />

          <div className="relative z-10 max-w-[1280px] mx-auto px-5 sm:px-10 flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="max-w-[700px] text-center md:text-left">
              <span className="font-mono text-[12px] uppercase tracking-widest text-[var(--flower)] font-semibold block mb-3">
                {isEn ? "WARM HIGHLAND GREETING" : "LỜI CHÀO TỪ CAO NGUYÊN"}
              </span>
              <h2 className="font-serif text-[clamp(32px,5vw,56px)] font-bold leading-tight tracking-tight mb-4 text-[#FDFBF7]">
                {isEn ? "See You by the Stream" : "Hẹn gặp bạn bên bờ suối"}
              </h2>
              <p className="text-[17px] text-[#C7BBA8] leading-relaxed">
                {dict.common.addressFull}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 shrink-0">
              <a
                href="tel:0382851688"
                onClick={() => trackEvent("click_call")}
                className="btn-primary inline-flex items-center gap-2 text-[16px] px-8 py-4 shadow-lg"
              >
                <PhoneCall className="w-5 h-5" />
                <span>{dict.common.callHotline}</span>
              </a>

              <a
                href="https://maps.google.com/?q=Hem+437+Hung+Vuong+Nghia+Trung+Gia+Nghia+Dak+Nong"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent("click_directions")}
                className="inline-flex items-center gap-2 text-[16px] px-8 py-4 rounded-full border-[1.5px] border-[#FDFBF7] text-[#FDFBF7] hover:bg-[#FDFBF7] hover:text-[var(--charcoal)] font-semibold transition-all"
              >
                <Navigation className="w-5 h-5" />
                <span>{dict.common.getDirections}</span>
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
