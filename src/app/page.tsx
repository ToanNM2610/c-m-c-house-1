"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import GoogleReviewsSection from "@/components/GoogleReviewsSection";
import Footer from "@/components/Footer";
import LightboxModal from "@/components/LightboxModal";
import RotatingSeal from "@/components/ui/RotatingSeal";
import StampPhoto from "@/components/ui/StampPhoto";
import ContourLines from "@/components/ui/ContourLines";
import { useStoreStatus } from "@/lib/openingHours";
import { useLanguage } from "@/context/LanguageContext";
import { getStoreStatusI18n } from "@/lib/translations";
import { trackEvent } from "@/lib/analytics";
import {
  Compass,
  ArrowRight,
  PhoneCall,
  MapPin,
  CheckCircle2,
  Waves,
  Clock,
  Sparkles,
  Coffee,
  Leaf,
  Flower2,
  ShieldCheck,
} from "lucide-react";

const HOME_SPACE_PREVIEWS = [
  {
    url: "/uploads/gallery/1788250253554-875120458.jpg",
    title: "Ban Công Suối Đón Gió Chiều",
    caption: "Bàn tròn thư thái bên lan can mộc mạc nhìn xuống bờ suối đón gió chiều mát rượi.",
    subtitle: "Hiên Gỗ Ven Suối",
    category: "wooden-terrace",
  },
  {
    url: "/uploads/gallery/1788250253562-580915883.jpg",
    title: "Tán Cây Xanh Mát Bên Dòng Suối",
    caption: "Hơi nước mát lạnh và bóng mát thiên nhiên nguyên bản bên mép nước suối đá.",
    subtitle: "Bờ Suối Tự Nhiên",
    category: "stream",
  },
  {
    url: "/uploads/gallery/1788250253557-29323827.jpg",
    title: "Băng Ghế Mộc Bên Vườn Hoa Vàng",
    caption: "Ghế gỗ và nón lá thơ mộng dưới tán hoa chuông vàng rực rỡ bên triền đồi.",
    subtitle: "Góc Check-in & Cảnh Quan",
    category: "checkin",
  },
  {
    url: "/uploads/gallery/1788250253574-977351820.jpg",
    title: "Ban Công Cờ Đỏ Bay Cao Giữa Đại Ngàn",
    caption: "Lá cờ đỏ sao vàng tung bay kiêu hãnh giữa không gian núi rừng Gia Nghĩa.",
    subtitle: "Check-in Cao Nguyên",
    category: "checkin",
  },
];

function MetricCounter({
  target,
  suffix = "",
  duration = 1.6,
}: {
  target: number;
  suffix?: string;
  duration?: number;
}) {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    if (!hasStarted) return;
    let startTime: number | null = null;
    let animationFrame: number;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      const ease = 1 - Math.pow(1 - progress, 4);
      setCount(Math.round(ease * target));
      if (progress < 1) {
        animationFrame = requestAnimationFrame(step);
      }
    };

    animationFrame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationFrame);
  }, [hasStarted, target, duration]);

  return (
    <motion.span
      onViewportEnter={() => setHasStarted(true)}
      viewport={{ once: true, margin: "-10px" }}
      className="inline-block"
    >
      {count}
      {suffix}
    </motion.span>
  );
}

export default function HomePage() {
  const storeStatus = useStoreStatus();
  const { locale, dict } = useLanguage();
  const isEn = locale === "en";
  const i18nStatus = getStoreStatusI18n(storeStatus, locale);

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const handleOpenLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <div className="bg-[var(--paper)] text-[var(--ink)] min-h-screen selection:bg-[var(--basalt)] selection:text-white transition-colors overflow-x-hidden">
      <main className="overflow-x-hidden">
        {/* =========================================================================
            8.1.1 HERO (TOÀN MÀN HÌNH, NỀN ẢNH + LỚP TỐI, CHỮ CẨM CÙ PARALLAX)
           ========================================================================= */}
        <section className="relative min-h-[92vh] lg:min-h-screen flex flex-col justify-between pt-28 sm:pt-36 pb-12 sm:pb-16 overflow-hidden bg-[#1C1612] text-[#F4ECDD]">
          {/* Ảnh nền phủ lớp tối tương phản cao rgba(20,14,10,0.65) */}
          <div className="absolute inset-0 pointer-events-none select-none z-0">
            <Image
              src="/uploads/gallery/1788250253551-943009233.jpg"
              alt="Cẩm Cù House bên bờ suối đá"
              fill
              priority
              className="object-cover opacity-35 filter brightness-90 contrast-105"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#1C1612]/80 via-[#1C1612]/60 to-[#1C1612]" />
            <ContourLines opacity={0.12} className="text-[#F4ECDD]" />
          </div>

          {/* Chữ khổng lồ "CẨM CÙ" Display XXL mờ .12 nằm giữa các lớp parallax */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0 overflow-hidden">
            <span className="font-serif text-[20vw] font-bold text-[#F4ECDD] opacity-[0.08] tracking-widest whitespace-nowrap -translate-y-8">
              CẨM CÙ
            </span>
          </div>

          {/* Nội dung Hero: 2 Cột */}
          <div className="container-unified relative z-10 my-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
              {/* Cột trái (7 cols): Tọa độ mono + H1 CẨM CÙ HOUSE + Khẩu hiệu Fraunces nghiêng màu flower */}
              <div className="lg:col-span-7 flex flex-col gap-4 sm:gap-6 text-left">
                {/* Nhãn tọa độ mono */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#2A201A] border border-[rgba(244,236,221,0.15)] font-mono text-[11px] sm:text-[12px] uppercase tracking-widest text-[var(--flower)] w-fit shadow-xs">
                  <Compass className="w-3.5 h-3.5 text-[var(--flower)]" />
                  <span>11.99° N · 107.69° E · ĐỘ CAO 800M+</span>
                </div>

                {/* H1 CẨM CÙ HOUSE */}
                <div className="flex flex-col gap-1 sm:gap-2">
                  <h1 className="font-serif text-[clamp(44px,7vw,104px)] font-bold text-[#F4ECDD] tracking-tight leading-[1.05]">
                    CẨM CÙ HOUSE
                  </h1>
                  <p className="font-serif text-[clamp(22px,3.5vw,42px)] italic font-semibold text-[var(--flower)] leading-[1.2]">
                    Chốn Dừng Chân Mộc Mạc Bên Bờ Suối Đá
                  </p>
                </div>

                {/* Mô tả 18px */}
                <p className="text-[17px] sm:text-[18px] text-[#C7BBA8] leading-[1.7] max-w-[58ch]">
                  {dict.home.heroDescription}
                </p>

                {/* 2 Nút: Khám Phá Góc Suối (chính) / Xem Thực Đơn (phụ) */}
                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <Link
                    href="/space"
                    className="btn-primary min-h-[48px] px-7 text-[15px] font-semibold"
                  >
                    <span>{dict.common.exploreStream}</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>

                  <Link
                    href="/menu"
                    onClick={() => trackEvent("view_menu")}
                    className="btn-secondary min-h-[48px] px-7 text-[15px] font-semibold !border-[rgba(244,236,221,0.35)] !text-[#F4ECDD] hover:!bg-[#F4ECDD] hover:!text-[#1C1612]"
                  >
                    <span>{dict.common.viewMenu}</span>
                  </Link>
                </div>
              </div>

              {/* Cột phải (5 cols): Ảnh chính trong khung vòm nghiêng nhẹ + Tem tròn xoay */}
              <div className="lg:col-span-5 relative flex items-center justify-center">
                <div className="relative w-full max-w-[380px] sm:max-w-[420px] aspect-[3/4] frame-arch border-2 sm:border-4 border-[rgba(244,236,221,0.18)] shadow-2xl rotate-[-1.5deg] hover:rotate-0 transition-transform duration-500 overflow-hidden bg-[#2A201A]">
                  <Image
                    src="/uploads/gallery/1788250253551-943009233.jpg"
                    alt="Chòi gỗ mộc mạc bên bờ suối Cẩm Cù House"
                    fill
                    sizes="(max-width: 768px) 100vw, 420px"
                    priority
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1C1612]/80 via-transparent to-transparent flex items-end p-5">
                    <span className="font-mono text-xs text-[var(--flower)] uppercase tracking-wider">
                      KHÔNG GIAN SUỐI ĐÁ TỰ NHIÊN
                    </span>
                  </div>
                </div>

                {/* Tem tròn xoay đặt đè cạnh góc ảnh vòm */}
                <div className="absolute -bottom-6 -right-3 sm:-bottom-8 sm:-right-6 z-20">
                  <RotatingSeal size={120} className="text-[#F4ECDD]" />
                </div>
              </div>
            </div>
          </div>

          {/* Dưới cùng Hero: Thanh pill kính mờ (trạng thái · giờ hôm nay · Hotline · Chỉ đường) */}
          <div className="container-unified relative z-10 pt-8">
            <div className="inline-flex flex-wrap items-center justify-center sm:justify-start gap-3 sm:gap-5 px-5 py-2.5 rounded-full bg-[#2A201A]/90 backdrop-blur-md border border-[rgba(244,236,221,0.14)] font-mono text-[12px] sm:text-[13px] text-[#F4ECDD] shadow-lg mx-auto lg:mx-0">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full animate-pulse ${storeStatus.isOpen ? "bg-[#5E7A3E]" : "bg-[var(--basalt)]"}`} />
                <span className="font-semibold text-[var(--flower)]">
                  {storeStatus.isOpen ? "ĐANG MỞ CỬA" : "ĐÃ ĐÓNG CỬA"}
                </span>
              </div>
              <span className="text-[rgba(244,236,221,0.3)]">•</span>
              <div className="flex items-center gap-1.5 text-[#C7BBA8]">
                <Clock className="w-3.5 h-3.5 text-[var(--stream)]" />
                <span>
                  {isEn ? `07:00 – ${storeStatus.closingTime} Today` : `07:00 – ${storeStatus.closingTime} Hôm nay`}
                </span>
              </div>
              <span className="text-[rgba(244,236,221,0.3)] hidden sm:inline">•</span>
              <a href="tel:0382851688" className="hover:text-[var(--basalt)] flex items-center gap-1.5 font-semibold">
                <PhoneCall className="w-3.5 h-3.5 text-[var(--basalt)]" />
                <span>038 285 1688</span>
              </a>
              <span className="text-[rgba(244,236,221,0.3)] hidden md:inline">•</span>
              <a
                href="https://maps.google.com/?q=Hem+437+Hung+Vuong+Nghia+Trung+Gia+Nghia+Dak+Nong"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[var(--stream)] flex items-center gap-1.5 text-[#C7BBA8]"
              >
                <MapPin className="w-3.5 h-3.5 text-[var(--stream)]" />
                <span>Chỉ đường</span>
              </a>
            </div>
          </div>
        </section>

        {/* =========================================================================
            8.1.2 DẢI CHỮ CHẠY (MARQUEE NỀN BAZAN, CHỮ KEM MONO)
           ========================================================================= */}
        <section className="w-full bg-[var(--basalt)] text-[#FFFFFF] py-3.5 overflow-hidden border-y border-[var(--basalt)] select-none">
          <div className="animate-marquee-track flex whitespace-nowrap font-mono text-[13px] sm:text-[14px] font-bold tracking-[0.16em] uppercase">
            {[...Array(6)].map((_, i) => (
              <span key={i} className="flex items-center mx-4">
                <span>ROBUSTA RANG CỦI</span>
                <span className="mx-3 opacity-60">·</span>
                <span>SUỐI ĐÁ</span>
                <span className="mx-3 opacity-60">·</span>
                <span>800M+</span>
                <span className="mx-3 opacity-60">·</span>
                <span>100% ĐỀ XUẤT HÀI LÒNG</span>
                <span className="mx-3 opacity-60">·</span>
                <span>GIÁ BÌNH DÂN 20K–45K</span>
                <span className="mx-3 opacity-60">·</span>
                <span>NGUYÊN LIỆU XANH SẠCH</span>
                <span className="mx-3 opacity-60">·</span>
              </span>
            ))}
          </div>
        </section>

        {/* =========================================================================
            8.1.3 GIỚI THIỆU: "Nơi thời gian lắng lại cùng tiếng suối róc rách" (5/7)
           ========================================================================= */}
        <section className="container-unified section-unified border-b border-[var(--line)]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Trái (5 cols): Chữ + Nút "Đọc trọn vẹn câu chuyện →" */}
            <div className="lg:col-span-5 flex flex-col gap-5 sm:gap-6">
              <div className="badge-unified w-fit">
                <Leaf className="w-3.5 h-3.5 text-[var(--stream)]" />
                <span>{dict.home.introBadge}</span>
              </div>

              <h2 className="font-serif text-[clamp(28px,3.8vw,48px)] font-bold text-[var(--ink)] tracking-tight leading-[1.15]">
                {dict.home.introTitle}
              </h2>

              <p className="text-[16px] sm:text-[17px] text-[var(--ink-muted)] leading-[1.7] max-w-[58ch]">
                {dict.home.introDesc}
              </p>

              <div>
                <Link
                  href="/about"
                  className="btn-secondary inline-flex items-center gap-2 group"
                >
                  <span>{dict.home.introCta}</span>
                  <ArrowRight className="w-4 h-4 text-[var(--basalt)] group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Phải (7 cols): 2 Ảnh chồng (Một vòm + Một tem ảnh) */}
            <div className="lg:col-span-7 relative flex justify-center lg:justify-end items-center">
              {/* Ảnh 1: Khung vòm chính bên suối đá */}
              <div className="relative w-full max-w-[420px] aspect-[4/5] frame-arch border-2 border-[var(--line)] shadow-xl overflow-hidden bg-[var(--paper-2)]">
                <Image
                  src="/uploads/gallery/1788250253562-580915883.jpg"
                  alt="Dòng suối đá Cẩm Cù House"
                  fill
                  sizes="(max-width: 768px) 100vw, 420px"
                  className="object-cover"
                />
              </div>

              {/* Ảnh 2: Tem ảnh chồng lên (StampPhoto) xoay 2 độ */}
              <div className="absolute -bottom-6 -left-2 sm:-bottom-8 sm:left-4 w-[220px] sm:w-[280px] z-10">
                <StampPhoto
                  src="/uploads/gallery/1788250253554-875120458.jpg"
                  alt="Ly cà phê rang củi mộc"
                  title="Cà phê rang củi"
                  coordinates="800M+ ĐẮK NÔNG"
                  rotate="left"
                />
              </div>
            </div>
          </div>

          {/* Dưới: 3 Chỉ số khổng lồ (Fraunces 96px, đếm số) "800m+ / 100% / 0 khói bụi" kèm nhãn mono */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-16 sm:pt-24 mt-8 border-t border-[var(--line)]">
            <div className="flex flex-col items-start">
              <span className="font-serif text-[clamp(56px,8vw,96px)] font-bold text-[var(--basalt)] tracking-tight leading-none">
                <MetricCounter target={800} suffix="m+" />
              </span>
              <span className="font-mono text-[13px] font-semibold uppercase tracking-wider text-[var(--ink-muted)] mt-2">
                {dict.home.introMetric1Label}
              </span>
            </div>

            <div className="flex flex-col items-start">
              <span className="font-serif text-[clamp(56px,8vw,96px)] font-bold text-[var(--basalt)] tracking-tight leading-none">
                <MetricCounter target={100} suffix="%" />
              </span>
              <span className="font-mono text-[13px] font-semibold uppercase tracking-wider text-[var(--ink-muted)] mt-2">
                {dict.home.introMetric2Label}
              </span>
            </div>

            <div className="flex flex-col items-start">
              <div className="font-serif text-[clamp(56px,8vw,96px)] font-bold text-[var(--basalt)] tracking-tight leading-none flex items-baseline gap-2">
                <MetricCounter target={0} suffix="" />
                <span className="text-xl sm:text-2xl font-serif text-[var(--ink-muted)] font-normal">khói bụi</span>
              </div>
              <span className="font-mono text-[13px] font-semibold uppercase tracking-wider text-[var(--ink-muted)] mt-2">
                {dict.home.introMetric3Label}
              </span>
            </div>
          </div>
        </section>

        {/* =========================================================================
            8.1.4 VÌ SAO CHỌN CẨM CÙ HOUSE? (4 THẺ XẾP CHỒNG DÍNH - STICKY STACK)
           ========================================================================= */}
        <section className="container-unified section-unified">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div>
              <div className="badge-unified mb-3">
                <Flower2 className="w-3.5 h-3.5 text-[var(--stream)]" />
                <span>{isEn ? "Highland Authenticity" : "Nét Đẹp Bản Địa"}</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[var(--ink)] tracking-tight">
                {dict.home.pillarsHeading}
              </h2>
            </div>
            <p className="text-[16px] text-[var(--ink-muted)] max-w-md leading-relaxed">
              {dict.home.pillarsSubheading}
            </p>
          </div>

          {/* 4 Thẻ xếp chồng dính (Sticky stack 01–04) */}
          <div className="flex flex-col gap-6 relative">
            {/* Thẻ 01: Nền paper-2 */}
            <div className="sticky top-28 w-full rounded-[28px] p-8 sm:p-12 bg-[var(--paper-2)] text-[var(--ink)] border border-[var(--line)] shadow-lg transition-transform">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[var(--card)] text-[var(--basalt)] flex items-center justify-center border border-[var(--line)] shadow-xs">
                    <Coffee className="w-6 h-6" />
                  </div>
                  <span className="font-mono text-xs uppercase tracking-widest text-[var(--stream)] font-bold">
                    {isEn ? "ARTISANAL ROASTING" : "HƯƠNG VỊ TRUYỀN THỐNG"}
                  </span>
                </div>
                <span className="font-serif text-5xl sm:text-6xl font-bold text-[var(--basalt)] opacity-80">
                  01
                </span>
              </div>
              <h3 className="font-serif text-2xl sm:text-4xl font-bold mb-3">
                {dict.home.pillar2Title}
              </h3>
              <p className="text-[16px] sm:text-[18px] text-[var(--ink-muted)] max-w-3xl leading-relaxed">
                {dict.home.pillar2Desc}
              </p>
            </div>

            {/* Thẻ 02: Nền stream tối */}
            <div className="sticky top-32 w-full rounded-[28px] p-8 sm:p-12 bg-[var(--stream)] text-white border border-[rgba(255,255,255,0.15)] shadow-xl transition-transform">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-white/10 text-emerald-200 flex items-center justify-center border border-white/20">
                    <Waves className="w-6 h-6" />
                  </div>
                  <span className="font-mono text-xs uppercase tracking-widest text-emerald-200 font-bold">
                    {isEn ? "100% PURE NATURE" : "THIÊN NHIÊN NGUYÊN BẢN"}
                  </span>
                </div>
                <span className="font-serif text-5xl sm:text-6xl font-bold text-white opacity-80">
                  02
                </span>
              </div>
              <h3 className="font-serif text-2xl sm:text-4xl font-bold mb-3 text-white">
                {dict.home.pillar1Title}
              </h3>
              <p className="text-[16px] sm:text-[18px] text-emerald-100/90 max-w-3xl leading-relaxed">
                {dict.home.pillar1Desc}
              </p>
            </div>

            {/* Thẻ 03: Nền bazan */}
            <div className="sticky top-36 w-full rounded-[28px] p-8 sm:p-12 bg-[var(--basalt)] text-white border border-[rgba(255,255,255,0.15)] shadow-2xl transition-transform">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-white/10 text-white flex items-center justify-center border border-white/20">
                    <Flower2 className="w-6 h-6" />
                  </div>
                  <span className="font-mono text-xs uppercase tracking-widest text-white/90 font-bold">
                    {isEn ? "HOYA FLOWER EMBLEM" : "BIỂU TƯỢNG HOA CẨM CÙ"}
                  </span>
                </div>
                <span className="font-serif text-5xl sm:text-6xl font-bold text-white opacity-80">
                  03
                </span>
              </div>
              <h3 className="font-serif text-2xl sm:text-4xl font-bold mb-3 text-white">
                {isEn ? "Blooming Hoya Flowers" : "Hoa Cẩm Cù Nở Rộ"}
              </h3>
              <p className="text-[16px] sm:text-[18px] text-white/90 max-w-3xl leading-relaxed">
                {isEn
                  ? "Star-shaped hoya blossoms symbolizing resilience across the high plateau, framing every pathway along our deck."
                  : "Loài hoa Hoya hình ngôi sao biểu trưng cho sức sống dẻo dai của đất trời cao nguyên, phủ kín lối đi quanh hiên nhà."}
              </p>
            </div>

            {/* Thẻ 04: Nền charcoal */}
            <div className="sticky top-40 w-full rounded-[28px] p-8 sm:p-12 bg-[#1C1612] text-[#F4ECDD] border border-[rgba(244,236,221,0.14)] shadow-2xl transition-transform">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#2A201A] text-[var(--stream)] flex items-center justify-center border border-[rgba(244,236,221,0.14)]">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <span className="font-mono text-xs uppercase tracking-widest text-[var(--flower)] font-bold">
                    {isEn ? "NATURE PRESERVED" : "BẢO TỒN DÒNG NƯỚC SUỐI"}
                  </span>
                </div>
                <span className="font-serif text-5xl sm:text-6xl font-bold text-[var(--flower)] opacity-80">
                  04
                </span>
              </div>
              <h3 className="font-serif text-2xl sm:text-4xl font-bold mb-3 text-[#F4ECDD]">
                {dict.home.pillar4Title}
              </h3>
              <p className="text-[16px] sm:text-[18px] text-[#C7BBA8] max-w-3xl leading-relaxed">
                {dict.home.pillar4Desc}
              </p>
            </div>
          </div>
        </section>

        {/* =========================================================================
            8.1.5 GÓC CHECK-IN & THƯ THÁI TỰ NHIÊN (4 ẢNH VÒM LỚN SO LE CAO THẤP)
           ========================================================================= */}
        <section className="container-unified section-unified border-b border-[var(--line)]">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div>
              <div className="badge-unified mb-3">
                <Waves className="w-3.5 h-3.5" />
                <span>{isEn ? "Open Stream Space" : "Không Gian Mở Bên Bờ Suối"}</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[var(--ink)] tracking-tight">
                {isEn ? "Scenic Photo Spots & Natural Serenity" : "Góc Check-in & Thư Thái Tự Nhiên"}
              </h2>
            </div>
            <Link
              href="/space"
              className="inline-flex items-center gap-2 font-mono text-sm font-semibold text-[var(--basalt)] hover:underline"
            >
              <span>{isEn ? "View all 30+ photo angles →" : "Xem toàn bộ 30+ góc ảnh →"}</span>
            </Link>
          </div>

          {/* 4 Ảnh vòm lớn so le cao thấp */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-end">
            {HOME_SPACE_PREVIEWS.map((photo, idx) => {
              // So le cao thấp: lẻ ngắn hơn, chẵn dài hơn
              const heightClass = idx % 2 === 0 ? "h-[420px]" : "h-[360px]";
              return (
                <div
                  key={photo.url}
                  onClick={() => handleOpenLightbox(idx)}
                  className="group relative cursor-pointer flex flex-col gap-3 select-none"
                >
                  <div className={`w-full ${heightClass} frame-arch border-2 border-[var(--line)] overflow-hidden bg-[var(--paper-2)] relative shadow-md transition-transform duration-500 group-hover:-translate-y-2`}>
                    <Image
                      src={photo.url}
                      alt={photo.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 300px"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1C1612]/75 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                      <span className="font-mono text-xs text-white uppercase tracking-wider">
                        BẤM ĐỂ XEM LỚN
                      </span>
                    </div>
                  </div>

                  {/* Tên ảnh dạng tem dưới ảnh */}
                  <div className="px-1 flex flex-col">
                    <span className="font-serif text-[17px] font-bold text-[var(--ink)] group-hover:text-[var(--basalt)] transition-colors truncate">
                      {photo.title}
                    </span>
                    <span className="font-mono text-[11px] text-[var(--ink-muted)] uppercase tracking-wider">
                      {photo.subtitle}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* =========================================================================
            8.1.6 CẢM NHẬN KHÁCH (KHỐI --CHARCOAL, 4.9, TRÍCH DẪN 36PX, AVATAR STRIP)
           ========================================================================= */}
        <GoogleReviewsSection isEn={isEn} />

        {/* =========================================================================
            8.1.7 CHÀO ĐÓN BẠN GHÉ THĂM (CTA CUỐI TRÊN NỀN ẢNH VÒM, 3 GẠCH TIỆN ÍCH)
           ========================================================================= */}
        <section className="container-unified section-unified">
          <div className="relative rounded-[32px] overflow-hidden bg-[#1C1612] text-[#F4ECDD] p-8 sm:p-14 lg:p-16 border border-[rgba(244,236,221,0.14)] shadow-2xl">
            {/* Ảnh vòm trang trí nền */}
            <div className="absolute inset-0 pointer-events-none select-none opacity-20">
              <Image
                src="/uploads/gallery/1788250253551-943009233.jpg"
                alt="Chòi gỗ bên suối"
                fill
                className="object-cover"
              />
            </div>
            <ContourLines opacity={0.1} className="text-[#F4ECDD]" />

            <div className="relative z-10 max-w-3xl">
              <span className="font-mono text-[12px] uppercase tracking-widest text-[var(--flower)] font-semibold">
                {isEn ? "WARMEST HOSPITALITY" : "CHÀO ĐÓN BẠN GHÉ THĂM"}
              </span>

              <h2 className="font-serif text-[clamp(28px,4vw,52px)] font-bold mt-3 mb-5 leading-tight text-[#F4ECDD]">
                {isEn
                  ? "Visit Cẩm Cù House & Savor Coffee by the Stream"
                  : "Ghé Cẩm Cù House Thưởng Thức Cà Phê Bên Bờ Suối"}
              </h2>

              <p className="text-[16px] sm:text-[18px] text-[#C7BBA8] leading-relaxed mb-8">
                {dict.common.addressFull}. {i18nStatus.scheduleText}.
              </p>

              {/* 3 Gạch tiện ích */}
              <div className="flex flex-wrap items-center gap-6 text-[14px] text-[var(--stream)] font-medium mb-10">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[var(--stream)]" />
                  <span>{isEn ? "Direct car access" : "Đường ô tô vào tận nơi"}</span>
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[var(--stream)]" />
                  <span>{isEn ? "Free spacious parking" : "Chỗ đỗ xe rộng rãi miễn phí"}</span>
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[var(--stream)]" />
                  <span>{isEn ? "High-speed WiFi" : "Wifi cáp quang tốc độ cao"}</span>
                </span>
              </div>

              {/* 2 Nút: Hotline + Chỉ đường */}
              <div className="flex flex-wrap items-center gap-4">
                <a
                  href="tel:0382851688"
                  className="btn-primary min-h-[48px] px-8 text-[15px] font-semibold"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>Hotline: 038 285 1688</span>
                </a>
                <a
                  href="https://maps.google.com/?q=Hem+437+Hung+Vuong+Nghia+Trung+Gia+Nghia+Dak+Nong"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary min-h-[48px] px-8 text-[15px] font-semibold !border-[rgba(244,236,221,0.3)] !text-[#F4ECDD] hover:!bg-[#F4ECDD] hover:!text-[#1C1612]"
                >
                  <MapPin className="w-4 h-4 text-[var(--stream)]" />
                  <span>{dict.common.getDirections}</span>
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Lightbox Modal */}
      <LightboxModal
        isOpen={lightboxOpen}
        photos={HOME_SPACE_PREVIEWS}
        initialIndex={lightboxIndex}
        onClose={() => setLightboxOpen(false)}
      />

      <Footer />
    </div>
  );
}
