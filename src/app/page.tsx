"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import SafeImage from "@/components/ui/SafeImage";
import CustomerReviewsSection from "@/components/home/CustomerReviewsSection";
import Footer from "@/components/Footer";
import LightboxModal from "@/components/LightboxModal";
import StarHoya from "@/components/ui/StarHoya";
import { useStoreStatus } from "@/lib/openingHours";
import { useLanguage } from "@/context/LanguageContext";
import { trackEvent } from "@/lib/analytics";
import {
  Compass,
  ArrowRight,
  PhoneCall,
  Navigation,
  Clock,
  Waves,
  ShieldCheck,
  Coffee,
  Sparkles,
  ChevronDown
} from "lucide-react";

const HOME_BENTO_PHOTOS = [
  {
    url: "/uploads/gallery/1788250253554-875120458.jpg",
    title: "Ban Công Suối Đón Gió Chiều",
    code: "[01/30]",
    col: "lg:col-span-8 lg:row-span-2 aspect-[16/10] lg:aspect-auto",
  },
  {
    url: "/uploads/gallery/1788250253562-580915883.jpg",
    title: "Tán Cây Xanh Mát Bên Dòng Suối",
    code: "[02/30]",
    col: "lg:col-span-4 aspect-[4/3]",
  },
  {
    url: "/uploads/gallery/1788250253557-29323827.jpg",
    title: "Băng Ghế Mộc Bên Vườn Hoa Vàng",
    code: "[03/30]",
    col: "lg:col-span-4 aspect-[4/3]",
  },
  {
    url: "/uploads/gallery/1788250253574-977351820.jpg",
    title: "Ban Công Cờ Đỏ Bay Cao Giữa Đại Ngàn",
    code: "[04/30]",
    col: "lg:col-span-6 aspect-[16/10]",
  },
  {
    url: "/uploads/gallery/1788250253576-148814823.jpg",
    title: "Hiên Trà Gỗ Rợp Bóng Mát Trưa Hè",
    code: "[05/30]",
    col: "lg:col-span-6 aspect-[16/10]",
  },
];

const WHY_CHOOSE_PANELS = [
  {
    num: "01",
    tag: "[ĐỘC BẢN]",
    title: "Suối Đá Tự Nhiên & Rừng Nguyên Bản",
    desc: "Tọa lạc ngay cạnh dòng suối tự nhiên với những tảng đá bazan rêu phong hàng trăm năm. Tiếng suối róc rách và làn sương mát lành xua tan mọi mỏi mệt phố thị.",
    bg: "bg-[var(--bg)]",
    img: "/uploads/gallery/1788250253562-580915883.jpg",
  },
  {
    num: "02",
    tag: "[ĐẬM ĐÀ]",
    title: "Robusta Đắk Nông Rang Củi Mộc",
    desc: "Từng mẻ cà phê được tuyển chọn từ thổ nhưỡng bazan màu mỡ, rang thủ công bằng củi lửa rừng cho hương thơm nồng nàn nguyên thủy, thuần khiết không hương liệu.",
    bg: "bg-[var(--pine)]",
    img: "/uploads/gallery/1788250253551-943009233.jpg",
  },
  {
    num: "03",
    tag: "[AN LÀNH]",
    title: "Thức Uống Xanh & Điểm Tâm Mộc",
    desc: "Thực đơn 67 món đa dạng từ trà thảo mộc mật ong rừng, sinh tố bơ cao nguyên đến các món ăn nhẹ như bò kho bánh mì, mì tôm trứng chuẩn vị gia đình.",
    bg: "bg-[var(--bg)]",
    img: "/uploads/gallery/1788250253554-875120458.jpg",
  },
  {
    num: "04",
    tag: "[THUẬN TIỆN]",
    title: "Bãi Đỗ Ô Tô Rộng & Đường Trải Nhựa",
    desc: "Chỉ cách trung tâm TP. Gia Nghĩa vài phút chạy xe. Tuyến đường bê tông phẳng phiu, bãi đỗ xe ô tô 4–16 chỗ thoải mái, có camera an ninh 24/7.",
    bg: "bg-[var(--pine)]",
    img: "/uploads/gallery/1788250253574-977351820.jpg",
  },
];

function WordScrubReveal({ text }: { text: string }) {
  const containerRef = useRef<HTMLHeadingElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 85%", "end 50%"],
  });

  const words = text.split(" ");

  return (
    <h2
      ref={containerRef}
      className="font-display font-extrabold text-[clamp(32px,5.5vw,72px)] uppercase tracking-tight leading-[1.08] text-balance max-w-5xl"
    >
      {words.map((word, i) => {
        const start = i / words.length;
        const end = (i + 1) / words.length;
        return (
          <WordSpan key={i} word={word} progress={scrollYProgress} range={[start, end]} />
        );
      })}
    </h2>
  );
}

function WordSpan({
  word,
  progress,
  range,
}: {
  word: string;
  progress: any;
  range: [number, number];
}) {
  // Chữ chưa sáng vẫn >= 3:1 (kem .35), chữ đã sáng kem đặc / rõ (Mục C8)
  const opacity = useTransform(progress, range, [0.55, 1]);

  return (
    <motion.span style={{ opacity }} className="inline-block mr-[0.3em] text-[var(--ink)]">
      {word}
    </motion.span>
  );
}

function MetricCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    if (!hasStarted) return;
    let start: number | null = null;
    let rafId: number;

    const animate = (timestamp: number) => {
      if (!start) start = timestamp;
      const p = Math.min((timestamp - start) / 1600, 1);
      const ease = 1 - Math.pow(1 - p, 4);
      setCount(Math.round(ease * target));
      if (p < 1) {
        rafId = requestAnimationFrame(animate);
      }
    };

    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [hasStarted, target]);

  return (
    <motion.span
      onViewportEnter={() => setHasStarted(true)}
      viewport={{ once: true, margin: "-20px" }}
      className="tabular-nums"
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

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const heroTitleLetters = "CẨM CÙ HOUSE".split("");

  return (
    <div className="bg-[var(--bg)] text-[var(--ink)] min-h-screen selection:bg-[var(--ember)] selection:text-[#0A0E0C] overflow-x-hidden">
      <main className="overflow-x-hidden">
        {/* =========================================================================
            1. HERO (TOÀN MÀN HÌNH - SECTION 8.1.1)
           ========================================================================= */}
        <section className="hero-dark-surface relative min-h-screen flex flex-col justify-between pt-28 sm:pt-36 pb-12 sm:pb-16 overflow-hidden bg-[#0A0E0C] text-[#F2EDE4]">
          {/* Chữ ghost CẨM CÙ HOUSE độ mờ .16 */}
          <div
            aria-hidden="true"
            className="hero-ghost-text absolute bottom-4 left-1/2 -translate-x-1/2 w-full max-w-[1200px] flex justify-center pointer-events-none select-none"
          >
            <svg viewBox="0 0 1200 120" className="w-full h-auto max-h-[160px] overflow-visible" fill="currentColor">
              <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fontWeight="800">CẨM{"\u00A0"}CÙ HOUSE</text>
            </svg>
          </div>

          {/* Ảnh nền phủ tối + Ken Burns sương mờ */}
          <div className="absolute inset-0 pointer-events-none select-none z-0">
            <SafeImage
              src="/uploads/gallery/1788250253551-943009233.jpg"
              alt="Cẩm Cù House đại ngàn điện ảnh"
              fill
              priority
              className="object-cover opacity-35 filter brightness-90 contrast-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0E0C] via-[#0A0E0C]/60 to-[#0A0E0C]/80" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(255,106,43,0.12)_0%,transparent_70%)]" />
          </div>

          {/* Lưới kỹ thuật 1px mờ */}
          <div className="absolute inset-0 pointer-events-none z-0 opacity-15">
            <div className="w-full h-full border-b border-[var(--line)] grid grid-cols-4 lg:grid-cols-12" />
          </div>

          {/* Nội dung Hero */}
          <div className="w-full max-w-[1360px] mx-auto px-5 sm:px-10 relative z-10 my-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-end">
              {/* Cột trái (7 cols): Tọa độ + Khẩu hiệu + 2 Nút */}
              <div className="lg:col-span-8 flex flex-col gap-6 text-left">
                {/* Nhãn tọa độ mono */}
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#0A0E0C]/80 border border-[var(--line-on-dark)] font-mono text-[11px] sm:text-[12px] uppercase tracking-widest text-[var(--ink-on-dark)] w-fit">
                  <Compass className="w-3.5 h-3.5 text-[var(--ember-on-dark)]" />
                  <span>[11.99° N · 107.69° E · ĐỘ CAO 800M+]</span>
                </div>

                {/* Slogan với cụm cuối Fraunces italic ember */}
                <div className="flex flex-col gap-3">
                  <h2 className="font-display font-extrabold text-[clamp(28px,5vw,56px)] uppercase tracking-tight text-[var(--ink-on-dark)] leading-[1.1] text-balance">
                    Chốn Dừng Chân Mộc Mạc{" "}
                    <span className="font-serif italic font-normal text-[var(--ember-on-dark)] text-accent-ember lowercase" style={{ color: "#FF6A2B" }}>
                      bên bờ suối đá
                    </span>
                  </h2>

                  <p className="text-[16px] sm:text-[18px] max-w-[55ch] leading-relaxed" style={{ color: "var(--ink-muted-on-dark)" }}>
                    {isEn
                      ? "Immerse in pure highland tranquility by the cool mossy boulders, wood-fired Robusta coffee, and whispering forest stream."
                      : "Thả mình giữa tiếng suối reo róc rách, hương cà phê Robusta rang củi nồng nàn và làn sương sớm tinh khôi của đại ngàn Đắk Nông."}
                  </p>
                </div>

                {/* 2 Nút: Khám Phá Góc Suối / Xem Thực Đơn */}
                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <Link
                    href="/space"
                    className="inline-flex items-center gap-2.5 px-8 py-4 bg-[var(--ember-on-dark)] text-[#0A0E0C] font-sans font-bold text-[15px] uppercase tracking-wider clip-chamfer-14 hover:opacity-90 active:scale-95 transition-all shadow-lg"
                  >
                    <span style={{ color: "#0A0E0C" }}>{isEn ? "EXPLORE STREAM SANCTUARY" : "KHÁM PHÁ GÓC SUỐI"}</span>
                    <ArrowRight className="w-4 h-4 text-[#0A0E0C]" />
                  </Link>

                  <Link
                    href="/menu"
                    className="inline-flex items-center gap-2.5 px-8 py-4 bg-transparent border border-[var(--line-on-dark)] text-[var(--ink-on-dark)] font-sans font-bold text-[15px] uppercase tracking-wider clip-chamfer-14 hover:bg-[#F2EDE4]/10 transition-all"
                  >
                    <span>{isEn ? "VIEW 50+ MENU ITEMS" : "XEM THỰC ĐƠN 50+ MÓN"}</span>
                  </Link>
                </div>
              </div>

              {/* Cột phải (4 cols): Thẻ kính mờ góc vát (Trạng thái, Giờ hôm nay, Nhiệt độ, Gọi + Chỉ đường) */}
              <div className="lg:col-span-4 flex flex-col gap-4">
                <div className="bg-[#131B17]/90 backdrop-blur-md border border-[var(--line-on-dark)] clip-chamfer-14 p-6 flex flex-col gap-5 shadow-2xl">
                  {/* Trạng thái mở cửa + Nhiệt độ */}
                  <div className="flex items-center justify-between pb-4 border-b border-[var(--line-on-dark)]">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-[var(--ember-on-dark)]" />
                      <span className="font-mono text-[12px] uppercase font-bold text-[var(--ink-on-dark)]">
                        {isEn ? "OPERATING HOURS" : "GIỜ HOẠT ĐỘNG"}
                      </span>
                    </div>
                    <span className="font-mono text-[12px] text-[var(--ember-on-dark)] font-bold">
                      23°C · ĐẮK NÔNG
                    </span>
                  </div>

                  {/* Giờ phục vụ hôm nay */}
                  <div className="flex flex-col gap-1">
                    <span className="font-mono text-[11px] uppercase tracking-wider" style={{ color: "var(--ink-muted-on-dark)" }}>
                      LỊCH ĐÓN KHÁCH HÔM NAY:
                    </span>
                    <span className="font-display font-extrabold text-[24px] text-[var(--ink-on-dark)]">
                      07:00 – {storeStatus.closingTime || "18:00"}
                    </span>
                  </div>

                  {/* 2 Nút nhanh: Gọi Hotline + Chỉ đường */}
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <a
                      href="tel:0382851688"
                      onClick={() => trackEvent("click_call")}
                      className="py-3 px-3 bg-[var(--ember-on-dark)] text-[#0A0E0C] font-mono text-[11px] font-bold uppercase rounded-sm flex items-center justify-center gap-1.5 hover:opacity-90 transition-opacity"
                    >
                      <PhoneCall className="w-3.5 h-3.5 text-[#0A0E0C]" />
                      <span style={{ color: "#0A0E0C" }}>GỌI NGAY</span>
                    </a>

                    <a
                      href="https://maps.google.com/?q=Hem+437+Hung+Vuong+Nghia+Trung+Gia+Nghia+Dak+Nong"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => trackEvent("click_directions")}
                      className="py-3 px-3 bg-[#0A0E0C]/70 border border-[var(--line-on-dark)] hover:border-[var(--ember-on-dark)] text-[var(--ink-on-dark)] font-mono text-[11px] font-bold uppercase rounded-sm flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Navigation className="w-3.5 h-3.5 text-[var(--mist-on-dark)]" />
                      <span>CHỈ ĐƯỜNG</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Chữ Display "CẨM CÙ HOUSE" khổng lồ tràn ngang đáy màn hình (Section 8.1.1) */}
          <div className="w-full relative z-10 pt-8 border-t border-[var(--line)] overflow-hidden select-none">
            <h1 className="font-display font-black text-[clamp(44px,12.5vw,180px)] uppercase tracking-tighter leading-none text-center whitespace-nowrap text-[var(--ink-on-dark)] opacity-90">
              {heroTitleLetters.map((char, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, filter: "blur(8px)" }}
                  animate={{ opacity: 1, filter: "blur(0px)" }}
                  transition={{ delay: 0.15 + index * 0.04, duration: 0.6 }}
                  className="inline-block"
                >
                  {char === " " ? "\u00A0" : char}
                </motion.span>
              ))}
            </h1>
          </div>
        </section>

        {/* =========================================================================
            2. DẢI CHỮ CHẠY MARQUEE HAI CHIỀU NGƯỢC NHAU (SECTION 8.1.2)
           ========================================================================= */}
        <section className="w-full bg-[var(--ember)] text-[var(--ember-ink)] py-4 overflow-hidden select-none font-mono text-[13px] sm:text-[14px] font-black uppercase tracking-widest border-y border-[var(--line)]">
          {/* Hàng 1: Trôi sang trái */}
          <div className="flex gap-6 w-max animate-marquee">
            {Array.from({ length: 6 }).map((_, i) => (
              <span key={i} className="flex items-center gap-6">
                <span>ROBUSTA RANG CỦI</span>
                <span>·</span>
                <span>SUỐI ĐÁ TỰ NHIÊN</span>
                <span>·</span>
                <span>ĐỘ CAO 800M+</span>
                <span>·</span>
                <span>100% ĐỀ XUẤT HÀI LÒNG</span>
                <span>·</span>
                <span>GIÁ BÌNH DÂN 20K–45K</span>
                <span>·</span>
                <span>NGUYÊN LIỆU XANH SẠCH</span>
                <span>·</span>
              </span>
            ))}
          </div>
        </section>

        {/* =========================================================================
            3. TUYÊN NGÔN TỪNG TỪ SÁNG DẦN THEO CUỘN (SECTION 8.1.3)
           ========================================================================= */}
        <section className="w-full py-28 sm:py-40 bg-[var(--bg)] text-[var(--ink)] relative overflow-hidden transition-colors">
          <div className="w-full max-w-[1360px] mx-auto px-5 sm:px-10">
            <div className="flex flex-col gap-10">
              <div className="inline-flex items-center gap-2 font-mono text-[12px] uppercase tracking-widest text-[var(--ember)]">
                <span>[03] TUYÊN NGÔN KHÔNG GIAN</span>
                <span>·</span>
                <span>TIẾNG SUỐI CAO NGUYÊN</span>
              </div>

              {/* Từng từ sáng dần theo cuộn */}
              <WordScrubReveal text="Nơi thời gian lắng lại cùng tiếng suối róc rách, sương giăng triền đồi và hương cà phê mộc ấm nồng." />

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-8 pt-8 border-t border-[var(--line)]">
                <p className="text-[16px] sm:text-[18px] text-[var(--ink-muted)] max-w-[55ch] leading-relaxed">
                  {isEn
                    ? "Leave behind city dust and noise. Step into an authentic rustic sanctuary nestled right beside natural stone brook, embraced by cool mist and sincere Highland hospitality."
                    : "Gác lại những ồn ào và khói bụi thị thành. Đến với Cẩm Cù House là bước vào không gian suối mát trong veo, nhâm nhi tách cà phê rang củi bên tiếng nước chảy thanh bình."}
                </p>

                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 font-mono text-[13px] font-bold uppercase tracking-wider text-[var(--ember)] hover:underline shrink-0"
                >
                  <span>ĐỌC TRỌN VẸN CÂU CHUYỆN</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            4. CHỈ SỐ KHỔNG LỒ (SECTION 8.1.4)
           ========================================================================= */}
        <section className="w-full py-20 bg-[var(--bg-2)] border-y border-[var(--line)] relative transition-colors">
          <div className="w-full max-w-[1360px] mx-auto px-5 sm:px-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-0 divide-y md:divide-y-0 md:divide-x divide-[var(--line)]">
              {/* Chỉ số 1 */}
              <div className="flex flex-col gap-3 py-6 md:py-0 md:px-8 first:pl-0">
                <span className="font-mono text-[11px] uppercase tracking-widest text-[var(--ember)] font-bold">
                  [ĐỘ CAO ĐẮK NÔNG]
                </span>
                <span className="font-display font-black text-[clamp(72px,8vw,140px)] leading-none text-[var(--ink)]">
                  <MetricCounter target={800} suffix="m+" />
                </span>
                <p className="text-[14px] text-[var(--ink-muted)] font-medium">
                  Khí hậu mát mẻ quanh năm bên triền suối nguyên sinh Gia Nghĩa.
                </p>
              </div>

              {/* Chỉ số 2 */}
              <div className="flex flex-col gap-3 py-6 md:py-0 md:px-8">
                <span className="font-mono text-[11px] uppercase tracking-widest text-[var(--ember)] font-bold">
                  [ĐÁNH GIÁ THỰC TẾ]
                </span>
                <span className="font-display font-black text-[clamp(72px,8vw,140px)] leading-none text-[var(--ember)]">
                  <MetricCounter target={100} suffix="%" />
                </span>
                <p className="text-[14px] text-[var(--ink-muted)] font-medium">
                  Du khách hài lòng và đề xuất trải nghiệm khi đến Đắk Nông.
                </p>
              </div>

              {/* Chỉ số 3 */}
              <div className="flex flex-col gap-3 py-6 md:py-0 md:px-8 last:pr-0">
                <span className="font-mono text-[11px] uppercase tracking-widest text-[var(--forest)] font-bold">
                  [MÔI TRƯỜNG SINH THÁI]
                </span>
                <span className="font-display font-black text-[clamp(72px,8vw,140px)] leading-none text-[var(--ink)]">
                  <MetricCounter target={0} suffix=" KHÓI BỤI" />
                </span>
                <p className="text-[14px] text-[var(--ink-muted)] font-medium">
                  Tách biệt hoàn toàn khỏi còi xe, hòa vào thiên nhiên trong lành.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            5. VÌ SAO CHỌN CẨM CÙ HOUSE (4 PANEL TOÀN MÀN HÌNH - SECTION 8.1.5)
           ========================================================================= */}
        <section className="w-full py-28 sm:py-36 bg-[var(--bg)] text-[var(--ink)] relative overflow-hidden transition-colors">
          <div className="w-full max-w-[1360px] mx-auto px-5 sm:px-10 mb-16">
            <div className="flex flex-col gap-2">
              <span className="font-mono text-[12px] uppercase tracking-widest text-[var(--ember)]">
                [04] VÌ SAO CHỌN CHÚNG TÔI
              </span>
              <h2 className="font-display font-black text-[clamp(36px,6vw,72px)] uppercase tracking-tight text-[var(--ink)] leading-none">
                BỐN GIÁ TRỊ <span className="font-serif italic font-normal text-[var(--ember)] lowercase">nguyên bản</span>
              </h2>
            </div>
          </div>

          {/* 4 Panel xếp trượt ngang / ghim (Section 8.1.5) */}
          <div className="w-full max-w-[1360px] mx-auto px-5 sm:px-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {WHY_CHOOSE_PANELS.map((panel, idx) => {
                const isPine = panel.bg.includes("pine");
                return (
                  <div
                    key={panel.num}
                    className={`p-8 sm:p-12 border border-[var(--line)] clip-chamfer-14 flex flex-col justify-between gap-8 ${panel.bg} transition-all hover:border-[var(--ember)]/60`}
                  >
                    <div className="flex flex-col gap-6">
                      <div className="flex items-center justify-between">
                        <span
                          className="font-display font-black text-[64px] sm:text-[80px] leading-none"
                          style={{ color: isPine ? "var(--ember-on-dark)" : "var(--ember)" }}
                        >
                          {panel.num}
                        </span>
                        <span
                          className="font-mono text-[12px] uppercase tracking-widest font-bold"
                          style={{ color: isPine ? "var(--mist-on-dark)" : "var(--forest)" }}
                        >
                          {panel.tag}
                        </span>
                      </div>

                      <h3
                        className="font-display font-bold text-[26px] sm:text-[32px] uppercase leading-tight"
                        style={{ color: isPine ? "#F2EDE4" : "var(--ink)" }}
                      >
                        {panel.title}
                      </h3>

                      <p
                        className="text-[15px] sm:text-[16px] leading-relaxed"
                        style={{ color: isPine ? "#F2EDE4" : "var(--ink-muted)" }}
                      >
                        {panel.desc}
                      </p>
                    </div>

                  {/* Ảnh minh họa cắt chéo */}
                  <div className="relative aspect-[16/9] w-full overflow-hidden clip-chamfer-14 border border-[var(--line)]">
                    <SafeImage
                      src={panel.img}
                      alt={panel.title}
                      fill
                      className="object-cover transition-transform duration-700 hover:scale-105"
                    />
                  </div>
                </div>
              );
            })}
            </div>
          </div>
        </section>

        {/* =========================================================================
            6. GÓC CHECK-IN & THƯ THÁI TỰ NHIÊN (BENTO 12 CỘT - SECTION 8.1.6)
           ========================================================================= */}
        <section className="w-full py-28 sm:py-36 bg-[var(--bg-2)] border-y border-[var(--line)] relative overflow-hidden transition-colors">
          <div className="w-full max-w-[1360px] mx-auto px-5 sm:px-10 mb-14">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
              <div className="flex flex-col gap-2">
                <span className="font-mono text-[12px] uppercase tracking-widest text-[var(--ember)]">
                  [05] KHÔNG GIAN CHECK-IN
                </span>
                <h2 className="font-display font-black text-[clamp(32px,5.5vw,64px)] uppercase tracking-tight text-[var(--ink)] leading-none">
                  GÓC SUỐI <span className="font-serif italic font-normal text-[var(--ember)] lowercase">thơ mộng</span>
                </h2>
              </div>

              <Link
                href="/space"
                className="inline-flex items-center gap-2 font-mono text-[13px] font-bold uppercase tracking-wider text-[var(--ember)] hover:underline shrink-0"
              >
                <span>XEM TOÀN BỘ 30+ GÓC ẢNH</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Lưới Bento 12 Cột */}
          <div className="w-full max-w-[1360px] mx-auto px-5 sm:px-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-6">
              {HOME_BENTO_PHOTOS.map((item, index) => (
                <div
                  key={item.url}
                  onClick={() => {
                    setLightboxIndex(index);
                    setLightboxOpen(true);
                  }}
                  className={`relative group overflow-hidden clip-chamfer-14 border border-[var(--line)] cursor-pointer bg-[var(--card)] ${item.col}`}
                >
                  <SafeImage
                    src={item.url}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  {/* Overlay ember 15% khi hover */}
                  <div className="absolute inset-0 bg-[var(--ember)]/0 group-hover:bg-[var(--ember)]/15 transition-colors duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0E0C]/90 via-[#0A0E0C]/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />

                  {/* Nhãn mono & Tên ảnh */}
                  <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-2 text-white">
                    <div className="flex flex-col">
                      <span className="font-mono text-[10px] text-[var(--ember)] tracking-widest uppercase">
                        {item.code}
                      </span>
                      <span className="font-bold text-[15px] sm:text-[16px] leading-snug">
                        {item.title}
                      </span>
                    </div>
                    <span className="font-mono text-[11px] text-white/80 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity uppercase">
                      XEM →
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* =========================================================================
            7. CẢM NHẬN KHÁCH HÀNG (SECTION 8.1.7)
           ========================================================================= */}
        <CustomerReviewsSection lang={isEn ? "EN" : "VN"} />

        {/* =========================================================================
            8. CTA CUỐI: GHÉ CẨM CÙ HOUSE (SECTION 8.1.8)
           ========================================================================= */}
        <section className="relative w-full py-32 sm:py-44 bg-[#0A0E0C] text-[#F4EEE2] overflow-hidden text-center border-t border-[var(--line-on-dark)]">
          <div className="absolute inset-0 pointer-events-none select-none z-0">
            <SafeImage
              src="/uploads/gallery/1788250253557-29323827.jpg"
              alt="Hẹn gặp bạn bên bờ suối"
              fill
              className="object-cover opacity-25 filter brightness-75 contrast-125"
            />
            <div className="absolute inset-0 bg-black/45" />
            <div className="absolute inset-0 bg-gradient-to-b from-[#0A0E0C]/55 via-transparent to-[#0A0E0C]/55" />
          </div>

          <div className="w-full max-w-[1000px] mx-auto px-5 sm:px-10 relative z-10 flex flex-col items-center gap-6">
            <div className="w-12 h-12 rounded-sm border border-[var(--line-on-dark)] bg-[#131B17] flex items-center justify-center text-[var(--ember)] mb-2">
              <StarHoya size={24} strokeWidth={2} />
            </div>

            <h2 className="font-display font-black text-[clamp(36px,8vw,96px)] uppercase tracking-tight text-[#F4EEE2] leading-none">
              GHÉ CẨM CÙ HOUSE
            </h2>

            <p className="font-serif italic text-[20px] sm:text-[26px] text-[var(--ember)] max-w-xl">
              Thưởng thức cà phê bên bờ suối róc rách giữa đại ngàn Đắk Nông
            </p>

            <p className="text-[15px] sm:text-[16px] text-[rgba(244,238,226,0.85)] max-w-lg">
              Hẻm 437 Hùng Vương, Phường Nghĩa Trung, TP. Gia Nghĩa · Độ cao 800m+
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <a
                href="tel:0382851688"
                onClick={() => trackEvent("click_call")}
                className="inline-flex items-center gap-2.5 px-8 py-4 bg-[var(--ember)] text-[var(--btn-primary-text)] font-sans font-bold text-[15px] uppercase tracking-wider clip-chamfer-14 hover:opacity-90 active:scale-95 transition-all shadow-xl"
              >
                <PhoneCall className="w-4 h-4" />
                <span>GỌI HOTLINE 038 285 1688</span>
              </a>

              <a
                href="https://maps.google.com/?q=Hem+437+Hung+Vuong+Nghia+Trung+Gia+Nghia+Dak+Nong"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent("click_directions")}
                className="inline-flex items-center gap-2.5 px-8 py-4 bg-transparent border border-[#F4EEE2] text-[#F4EEE2] font-sans font-bold text-[15px] uppercase tracking-wider clip-chamfer-14 hover:bg-[#F4EEE2]/15 hover:text-[#F4EEE2] transition-all"
              >
                <Navigation className="w-4 h-4" />
                <span>CHỈ ĐƯỜNG GOOGLE MAPS</span>
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* Lightbox Modal */}
      <LightboxModal
        isOpen={lightboxOpen}
        photos={HOME_BENTO_PHOTOS}
        initialIndex={lightboxIndex}
        onClose={() => setLightboxOpen(false)}
      />

      <Footer />
    </div>
  );
}
