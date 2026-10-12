"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import GoogleReviewsSection from "@/components/GoogleReviewsSection";
import Footer from "@/components/Footer";
import LightboxModal from "@/components/LightboxModal";
import StaggerText, { StaggerParagraph } from "@/components/motion/StaggerText";
import MaskRevealImage from "@/components/motion/MaskRevealImage";
import KenBurnsImage from "@/components/motion/KenBurnsImage";
import { useStoreStatus } from "@/lib/openingHours";
import { useLanguage } from "@/context/LanguageContext";
import { getStoreStatusI18n } from "@/lib/translations";
import {
  Compass,
  Star,
  DollarSign,
  Leaf,
  ArrowUpRight,
  ArrowRight,
  UtensilsCrossed,
  Thermometer,
  Coffee,
  PhoneCall,
  MapPin,
  CheckCircle2,
  Flower2,
  Waves,
  Sparkles,
  Clock,
  Maximize2,
  Flame,
  Wind
} from "lucide-react";

import {
  getSharedData,
  KEYS,
  SharedAnnouncement,
} from "@/lib/syncStore";
import {
  CAMCU_SETTINGS_KEY,
  getStoredData,
} from "@/utils/storage";

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
  duration = 1.4,
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
      // easeOutQuart
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

  const [settings, setSettings] = useState({
    isOpen: true,
    statusText: "Quán đang mở cửa đón khách",
    hoursWeekday: "07:00 - 18:00",
    hoursWeekend: "07:00 - 22:00",
    hotline1: "038 285 1688",
    topBanner: "🌿 Chào mừng đến với Cẩm Cù House • Giờ mở cửa: T2 - T5 (07:00 - 18:00) | T6 - CN (07:00 - 22:00)",
  });
  const [announcements, setAnnouncements] = useState<SharedAnnouncement[]>([]);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Soft Parallax offset: di chuyển chậm hơn chữ phía trước 1 nhịp nhẹ (tối đa translateY 12-14px)
  const heroParallaxOffset = Math.min(Math.round(scrollY * 0.04), 14);

  const [introDone, setIntroDone] = useState(false);

  useEffect(() => {
    const handleIntroDone = () => setIntroDone(true);
    document.addEventListener("camcu:intro-done", handleIntroDone);
    if (
      typeof window !== "undefined" &&
      (sessionStorage.getItem("cc_intro") === "1" ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches)
    ) {
      setIntroDone(true);
    }
    return () => document.removeEventListener("camcu:intro-done", handleIntroDone);
  }, []);

  useEffect(() => {
    // 1. Immediately hydrate from Shared Storage & Cookie (survives F5)
    const storedSettings = getStoredData<typeof settings | null>(CAMCU_SETTINGS_KEY, null);
    if (storedSettings) {
      setSettings((prev) => ({ ...prev, ...storedSettings }));
    }

    const storedAnnouncements = getSharedData<SharedAnnouncement[]>(KEYS.ANNOUNCEMENTS, []);
    setAnnouncements(storedAnnouncements);

    // Real-time synchronization listener across tabs & windows
    const handleSync = (e: Event) => {
      const custom = e as CustomEvent;
      if (custom.detail?.key === KEYS.ANNOUNCEMENTS) {
        setAnnouncements(custom.detail.value || []);
      }
    };
    const handleStorage = (e: StorageEvent) => {
      if (e.key === KEYS.ANNOUNCEMENTS) {
        const next = getSharedData<SharedAnnouncement[]>(KEYS.ANNOUNCEMENTS, []);
        setAnnouncements(next);
      }
    };

    window.addEventListener("camcu_sync_update", handleSync);
    window.addEventListener("storage", handleStorage);

    // 2. Fetch server updates (fallback if no local cookie is present)
    async function loadData() {
      try {
        const [settingsRes, annRes] = await Promise.all([
          fetch("/api/admin/settings").catch(() => null),
          fetch("/api/admin/announcements").catch(() => null),
        ]);

        if (settingsRes && settingsRes.ok) {
          const sData = await settingsRes.json();
          if (sData.settings) {
            setSettings((prev) => ({ ...prev, ...sData.settings }));
          }
        }

        if (annRes && annRes.ok) {
          const aData = await annRes.json();
          if (aData.announcements && Array.isArray(aData.announcements)) {
            const clientCookie = getSharedData<SharedAnnouncement[] | null>(KEYS.ANNOUNCEMENTS, null);
            if (clientCookie === null) {
              setAnnouncements(aData.announcements);
            }
          }
        }
      } catch (e) {
        // Fallback gracefully
      }
    }
    loadData();

    return () => {
      window.removeEventListener("camcu_sync_update", handleSync);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  const pinnedNews =
    announcements.find((a) => a.isPinned || a.isHighlighted) || announcements[0] || null;

  const handleOpenLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <div className="bg-[#F9F8F3] dark:bg-[#121A15] min-h-screen text-[#1B281D] dark:text-[#F5F4EE] font-sans selection:bg-[#3E5C46] selection:text-white transition-colors duration-300 overflow-x-hidden w-full max-w-full">
      <main className="pt-20 sm:pt-28 overflow-x-hidden">
        {/* Dynamic Announcement Banner from Shared Cookie Store: Render only if pinnedNews exists */}
        {pinnedNews && (
          <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-3 pb-2">
            <div className="bg-[#2D4233] dark:bg-[#16231A] text-white p-3.5 sm:p-5 rounded-2xl shadow-md border border-[#3E5C46]/50 dark:border-stone-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
              <div className="flex items-start sm:items-center gap-3">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/10 text-amber-300 flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 animate-pulse" />
                </div>
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-800 text-emerald-200 text-[10px] font-bold uppercase tracking-wider">
                      {pinnedNews.category === "event" || pinnedNews.type === "event"
                        ? (isEn ? "Special Event" : "Sự Kiện")
                        : pinnedNews.category === "special" || pinnedNews.type === "special"
                        ? (isEn ? "Specialty" : "Món Đặc Sản")
                        : dict.common.noticeBoard}
                    </span>
                    <span className="text-sm sm:text-base font-bold text-white truncate">
                      {pinnedNews.title}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-stone-200 mt-0.5 line-clamp-1">
                    {pinnedNews.content}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                <Link
                  href="/menu"
                  className="btn-press px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full bg-[#F9F8F3] text-[#2D4233] text-xs font-bold hover:bg-white transition-all shadow-sm"
                >
                  {dict.common.viewMenu}
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* HERO SECTION - WARM CREAM BEIGE / DARK FOREST NATURE */}
        <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-3 sm:pt-8 pb-12 sm:pb-16 text-center w-full">
          {/* Eyebrow Coordinate Badge & Headlines (Stagger 1: 50ms) */}
          <div className="animate-fade-up-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-200/80 dark:bg-[#1E2B22] text-[10px] tracking-wider uppercase font-semibold text-[#3E5C46] dark:text-[#88B795] mb-2 sm:mb-4 shadow-sm border border-stone-300/60 dark:border-stone-700/60">
              <Compass className="w-3 h-3 text-[#396663] dark:text-[#88B795]" />
              <span>{dict.common.coordinates}</span>
            </div>

            {/* Hero Headlines (Fade-up từng dòng stagger 0.1s) */}
            <div className="mb-2 sm:mb-4">
              <StaggerText
                as="h1"
                lines={[dict.home.heroTitleLine1, dict.home.heroTitleLine2]}
                stagger={0.1}
                className="text-2xl sm:text-5xl lg:text-6xl font-serif font-bold text-[#2D4233] dark:text-[#F5F4EE] tracking-tight leading-snug sm:leading-tight max-w-4xl mx-auto"
                lineClassName="leading-tight"
              />
            </div>

            {/* Subtitle Description (Fade-up dòng giới thiệu) */}
            <div className="max-w-2xl mx-auto mb-3 sm:mb-6 px-2">
              <StaggerParagraph
                text={dict.home.heroDescription}
                className="text-stone-600 dark:text-stone-300 text-xs sm:text-base leading-relaxed line-clamp-3 sm:line-clamp-none"
                delay={0.2}
              />
            </div>
          </div>

          {/* 3 Trust Badges & CTA Buttons (Stagger 2: 120ms) */}
          <div className="animate-fade-up-2">
            {/* 3 Trust Badges: Exactly single horizontal row */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 my-2 sm:my-4">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white dark:bg-stone-900/60 shadow-sm border border-stone-200/80 dark:border-stone-700/50 text-[11px] font-semibold text-stone-700 dark:text-stone-300">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                {dict.home.badgeRecommended}
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white dark:bg-stone-900/60 shadow-sm border border-stone-200/80 dark:border-stone-700/50 text-[11px] font-semibold text-stone-700 dark:text-stone-300">
                <DollarSign className="w-3.5 h-3.5 text-[#3E5C46] dark:text-[#88B795]" />
                {dict.home.badgePrice}
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white dark:bg-stone-900/60 shadow-sm border border-stone-200/80 dark:border-stone-700/50 text-[11px] font-semibold text-stone-700 dark:text-stone-300">
                <Leaf className="w-3.5 h-3.5 text-[#396663] dark:text-[#88B795]" />
                {dict.home.badgeOrganic}
              </span>
            </div>

            {/* CTA Buttons: Clear Hierarchy */}
            <div className="w-full max-w-md mx-auto sm:max-w-none flex flex-col gap-2 sm:gap-3.5 mb-6 sm:mb-8">
              {/* Row 1: Primary Actions */}
              <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center sm:justify-center sm:gap-3.5 w-full">
                <Link
                  href="/space"
                  className="btn-press inline-flex items-center justify-center gap-1.5 min-h-[42px] sm:min-h-[44px] px-3 sm:px-7 py-2.5 rounded-full bg-[#2D4233] dark:bg-[#25362B] text-white text-xs sm:text-sm font-bold hover:bg-[#1E2B22] transition-all shadow-[0_4px_16px_rgba(45,66,51,0.25)]"
                >
                  <ArrowUpRight className="w-4 h-4 text-emerald-300" />
                  <span className="truncate">{dict.common.exploreStream}</span>
                </Link>
                <Link
                  href="/menu"
                  className="btn-press inline-flex items-center justify-center gap-1.5 min-h-[42px] sm:min-h-[44px] px-3 sm:px-7 py-2.5 rounded-full bg-white dark:bg-[#1E2B22] text-[#2D4233] dark:text-[#F5F4EE] text-xs sm:text-sm font-bold hover:bg-stone-50 dark:hover:bg-[#28392E] border border-stone-300/80 dark:border-stone-700/60 transition-all shadow-sm"
                >
                  <UtensilsCrossed className="w-4 h-4 text-[#3E5C46] dark:text-[#88B795]" />
                  <span className="truncate">{dict.common.viewMenu}</span>
                </Link>
              </div>

              {/* Row 2: Secondary Utilities */}
              <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center sm:justify-center sm:gap-3 w-full">
                <a
                  href={`tel:${settings.hotline1.replace(/\s+/g, "")}`}
                  className="btn-press inline-flex items-center justify-center gap-1.5 min-h-[38px] sm:min-h-[42px] px-2.5 sm:px-6 py-2 rounded-full bg-[#3E5C46] dark:bg-[#283C2F] hover:bg-[#2D4233] text-white text-xs sm:text-sm font-semibold transition-all shadow-sm border border-[#2D4233]/40 truncate"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-emerald-200 shrink-0" />
                  <span className="truncate">Hotline: {settings.hotline1}</span>
                </a>
                <a
                  href="https://maps.google.com/?q=Hem+437+Hung+Vuong+Nghia+Trung+Gia+Nghia+Dak+Nong"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-press inline-flex items-center justify-center gap-1.5 min-h-[38px] sm:min-h-[42px] px-2.5 sm:px-6 py-2 rounded-full bg-stone-100 dark:bg-[#1A261E] hover:bg-stone-200 dark:hover:bg-[#28392E] text-stone-700 dark:text-stone-300 text-xs sm:text-sm font-semibold transition-all border border-stone-300/60 dark:border-stone-700/60 truncate"
                >
                  <MapPin className="w-3.5 h-3.5 text-[#7D5E4A] dark:text-[#E8A87C] shrink-0" />
                  <span className="truncate">{dict.common.getDirections}</span>
                </a>
              </div>
            </div>
          </div>

          {/* Visual Hero Card & Atmospheric Meter (Stagger 3: 200ms) - Parallax nhẹ khi cuộn, clip-path mở dần & Zoom chậm Ken Burns */}
          <div className="animate-fade-up-3">
            <motion.div
              initial={{ clipPath: "inset(10% 6% 10% 6% round 24px)", opacity: 0.8 }}
              whileInView={{ clipPath: "inset(0% 0% 0% 0% round 24px)", opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] as const, delay: 0.15 }}
              onClick={() => handleOpenLightbox(0)}
              style={{ transform: `translateY(${heroParallaxOffset}px)` }}
              className="group relative cursor-pointer max-w-5xl mx-auto aspect-[16/10] sm:aspect-[16/9] md:h-[480px] rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl sm:shadow-2xl border-2 sm:border-4 border-white dark:border-stone-700/60 transform-gpu transition-transform duration-100 ease-out will-change-transform mb-5 sm:mb-8"
            >
              <KenBurnsImage
                src="/uploads/gallery/1788250253551-943009233.jpg"
                alt={dict.home.heroCardTitle}
                overlayGradient={false}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/85 via-stone-950/20 to-transparent flex items-end justify-between p-4 sm:p-8">
                <div className="text-left text-white max-w-xl">
                  <span className="text-[10px] sm:text-xs uppercase font-bold tracking-wider text-emerald-300">
                    {dict.home.streamEcoSpace}
                  </span>
                  <p className="text-base sm:text-2xl font-serif font-bold mt-0.5 sm:mt-1 drop-shadow-sm">
                    {dict.home.heroCardTitle}
                  </p>
                  <p className="text-[11px] sm:text-sm text-stone-200 mt-0.5 sm:mt-1 line-clamp-1 sm:line-clamp-2">
                    {dict.home.heroCardDesc}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-white/20 backdrop-blur-md text-white text-[11px] sm:text-xs font-semibold group-hover:bg-[#3E5C46] transition-colors shrink-0">
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span className="hidden xs:inline">{dict.common.viewLarger}</span>
                </div>
              </div>
            </motion.div>

            {/* Real-time Atmospheric Meter Badge & Natural Climate Gauge */}
            <div className="inline-flex flex-wrap items-center justify-center gap-2 sm:gap-3 px-3.5 sm:px-5 py-1.5 sm:py-2 rounded-full bg-white/90 dark:bg-[#1E2B22] backdrop-blur-sm border border-stone-200/80 dark:border-stone-700/60 shadow-xs text-stone-600 dark:text-stone-300 text-[11px] sm:text-xs transition-colors">
              <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="flex items-center gap-1">
                  <Thermometer className="w-3.5 h-3.5" /> 23°C • {isEn ? "Gentle Breeze" : "Gió Mát Nhẹ"}
                </span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1.5 font-medium text-stone-700 dark:text-stone-200">
                <Waves className="w-3.5 h-3.5 text-[#396663] dark:text-teal-400" />
                <span>{isEn ? "Crystal Stream Echo" : "Suối Reo Trong Lành"}</span>
              </div>
              <span className="hidden sm:inline">•</span>
              <div className="hidden sm:flex items-center gap-1 font-semibold text-[#2D4233] dark:text-[#88B795]">
                <Clock className="w-3.5 h-3.5" />
                <span>{isEn ? `07:00 – ${storeStatus.closingTime || "18:00"} Today` : `07:00 – ${storeStatus.closingTime || "18:00"} Hôm Nay`}</span>
              </div>
            </div>
          </div>
        </section>

        {/* INTRO SECTION: ARTISTIC STORY & BENTO VISUAL COLLAGE */}
        <section id="story-intro" className="container-unified section-unified border-b border-[#F3EBD8]/10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
            {/* Left Column: Artistic Narrative & Highlight Metrics (7 cols on lg) */}
            <div className="lg:col-span-7 flex flex-col gap-5 sm:gap-6">
              {/* Badge */}
              <div className="badge-unified w-fit">
                <Leaf className="w-3.5 h-3.5 text-[#88B795]" />
                <span>{dict.home.introBadge}</span>
              </div>

              {/* Title */}
              <h2 className="font-serif text-[clamp(28px,3.8vw,48px)] font-bold text-[#F3EBD8] tracking-tight leading-[1.2]">
                {dict.home.introTitle}
              </h2>

              {/* Story Paragraph */}
              <p className="text-[15px] sm:text-[16px] text-[#F3EBD8]/75 leading-relaxed max-w-[65ch]">
                {dict.home.introDesc}
              </p>

              {/* 3 Highlight Metrics Grid with Live Counters & Distinct Icons */}
              <div className="grid grid-cols-3 gap-2.5 sm:gap-4 pt-2">
                <div className="card-unified !p-3 sm:!p-4 flex flex-col justify-center">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Compass className="w-3.5 h-3.5 text-[#88B795]" />
                    <span className="text-[11px] sm:text-xs text-[#F3EBD8]/70 font-semibold">{isEn ? "Elevation" : "Cao độ"}</span>
                  </div>
                  <span className="font-serif text-xl sm:text-2xl lg:text-3xl font-bold text-[#88B795] tracking-tight">
                    <MetricCounter target={800} suffix="m+" />
                  </span>
                  <span className="text-[11px] sm:text-xs text-[#F3EBD8]/70 font-medium mt-0.5 sm:mt-1 line-clamp-1">
                    {dict.home.introMetric1Label}
                  </span>
                </div>

                <div className="card-unified !p-3 sm:!p-4 flex flex-col justify-center">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Flame className="w-3.5 h-3.5 text-[#CC7755]" />
                    <span className="text-[11px] sm:text-xs text-[#F3EBD8]/70 font-semibold">{isEn ? "Natural" : "Mộc mạc"}</span>
                  </div>
                  <span className="font-serif text-xl sm:text-2xl lg:text-3xl font-bold text-[#CC7755] tracking-tight">
                    <MetricCounter target={100} suffix="%" />
                  </span>
                  <span className="text-[11px] sm:text-xs text-[#F3EBD8]/70 font-medium mt-0.5 sm:mt-1 line-clamp-1">
                    {dict.home.introMetric2Label}
                  </span>
                </div>

                <div className="card-unified !p-3 sm:!p-4 flex flex-col justify-center">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Wind className="w-3.5 h-3.5 text-[#88B795]" />
                    <span className="text-[11px] sm:text-xs text-[#F3EBD8]/70 font-semibold">{isEn ? "Purity" : "Trong lành"}</span>
                  </div>
                  <span className="font-serif text-xl sm:text-2xl lg:text-3xl font-bold text-[#88B795] tracking-tight">
                    <MetricCounter target={0} suffix="" /> <span className="text-xs sm:text-sm font-normal text-[#F3EBD8]/70">{isEn ? "dust" : "khói bụi"}</span>
                  </span>
                  <span className="text-[11px] sm:text-xs text-[#F3EBD8]/70 font-medium mt-0.5 sm:mt-1 line-clamp-1">
                    {dict.home.introMetric3Label}
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2">
                <Link
                  href="/about"
                  className="btn-press inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#16231A] text-[#F3EBD8] text-xs sm:text-sm font-bold hover:bg-[#CC7755] hover:text-white border border-[#F3EBD8]/10 transition-all group"
                >
                  <span>{dict.home.introCta}</span>
                  <ArrowRight className="w-4 h-4 text-[#CC7755] group-hover:text-white group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Right Column: Bento Artistic Dual Photo Frame with Parallax Floating */}
            <div className="lg:col-span-5 relative mt-4 lg:mt-0">
              {/* Primary Large Photo: Natural Pebble Stream */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative rounded-3xl overflow-hidden aspect-[4/3] sm:aspect-[16/11] shadow-2xl border-2 sm:border-4 border-white dark:border-[#1E2B22] bg-stone-100 dark:bg-stone-800 group"
              >
                <img
                  src="/uploads/gallery/1788250253562-580915883.jpg"
                  alt={dict.home.introPhotoMainCaption}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out transform-gpu"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/75 via-transparent to-transparent flex items-end p-4 sm:p-5">
                  <div className="flex items-center gap-1.5 text-xs text-white/95 font-medium drop-shadow-sm">
                    <Waves className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
                    <span className="truncate">{dict.home.introPhotoMainCaption}</span>
                  </div>
                </div>
              </motion.div>

              {/* Secondary Overlapping Photo: Steaming Salt Coffee / Parallax hover floating */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                whileHover={{ y: -8, scale: 1.03 }}
                className="absolute -bottom-6 -right-2 sm:-bottom-8 sm:-right-4 w-1/2 sm:w-5/12 rounded-2xl overflow-hidden aspect-[4/3] shadow-[0_16px_36px_rgba(0,0,0,0.35)] border-2 sm:border-4 border-white dark:border-[#1E2B22] bg-stone-100 dark:bg-stone-800 group transform-gpu transition-all duration-300"
              >
                <img
                  src="/uploads/gallery/1788250253554-875120458.jpg"
                  alt={dict.home.introPhotoSubCaption}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent flex items-end p-2.5 sm:p-3">
                  <div className="flex items-center gap-1 text-[10px] sm:text-xs text-amber-200 font-semibold truncate">
                    <Coffee className="w-3 h-3 text-amber-300 shrink-0" />
                    <span className="truncate">{isEn ? "Firewood Coffee" : "Cà phê mộc"}</span>
                  </div>
                </div>
              </motion.div>

              {/* Nature Badge Floating Indicator */}
              <div className="absolute -top-3 -left-2 sm:-top-4 sm:-left-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 dark:bg-[#1E2B22]/95 backdrop-blur-md border border-stone-200/80 dark:border-stone-700/60 shadow-lg text-[10px] sm:text-xs font-bold text-[#2D4233] dark:text-[#88B795]">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>100% Pure Highland Air</span>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 1: 4 PILLARS - VÌ SAO CHỌN CẨM CÙ HOUSE */}
        <section className="container-unified section-unified">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#16231A] border border-[#F3EBD8]/10 text-[#88B795] text-[12px] font-semibold uppercase tracking-[0.12em] mb-3">
                <Flower2 className="w-3.5 h-3.5" />
                <span>{isEn ? "Highland Authenticity" : "Nét Đẹp Bản Địa"}</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#F3EBD8] font-bold tracking-tight">
                {dict.home.pillarsHeading}
              </h2>
            </div>
            <p className="text-[15px] sm:text-[16px] text-[rgba(243,235,216,0.72)] max-w-md leading-relaxed">
              {dict.home.pillarsSubheading}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1: Hương vị truyền thống */}
            <div className="card-unified flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#1B281D] text-[#CC7755] border border-[#F3EBD8]/10 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                  <Coffee className="w-6 h-6" />
                </div>
                <h3 className="text-[20px] sm:text-[22px] font-bold text-[#F3EBD8] mb-2 group-hover:text-[#CC7755] transition-colors">
                  {dict.home.pillar2Title}
                </h3>
                <p className="text-[15px] sm:text-[16px] text-[rgba(243,235,216,0.72)] leading-relaxed mb-5">
                  {dict.home.pillar2Desc}
                </p>
              </div>
              <span className="inline-flex items-center w-fit px-3 py-1 rounded-full text-[12px] uppercase tracking-[0.12em] font-semibold bg-[#1B281D] text-[#CC7755] border border-[#F3EBD8]/10">
                {isEn ? "Artisanal Roasting" : "Hương vị truyền thống"}
              </span>
            </div>

            {/* Card 2: Thiên nhiên 100% */}
            <div className="card-unified flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#1B281D] text-[#88B795] border border-[#F3EBD8]/10 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                  <Waves className="w-6 h-6" />
                </div>
                <h3 className="text-[20px] sm:text-[22px] font-bold text-[#F3EBD8] mb-2 group-hover:text-[#CC7755] transition-colors">
                  {dict.home.pillar1Title}
                </h3>
                <p className="text-[15px] sm:text-[16px] text-[rgba(243,235,216,0.72)] leading-relaxed mb-5">
                  {dict.home.pillar1Desc}
                </p>
              </div>
              <span className="inline-flex items-center w-fit px-3 py-1 rounded-full text-[12px] uppercase tracking-[0.12em] font-semibold bg-[#1B281D] text-[#88B795] border border-[#F3EBD8]/10">
                {isEn ? "100% Pure Nature" : "Thiên nhiên 100%"}
              </span>
            </div>

            {/* Card 3: Hoa Cẩm Cù Nở Rộ */}
            <div className="card-unified flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#1B281D] text-[#88B795] border border-[#F3EBD8]/10 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                  <Flower2 className="w-6 h-6" />
                </div>
                <h3 className="text-[20px] sm:text-[22px] font-bold text-[#F3EBD8] mb-2 group-hover:text-[#CC7755] transition-colors">
                  {isEn ? "Blooming Hoya Flowers" : "Hoa Cẩm Cù Nở Rộ"}
                </h3>
                <p className="text-[15px] sm:text-[16px] text-[rgba(243,235,216,0.72)] leading-relaxed mb-5">
                  {isEn
                    ? "Star-shaped hoya blossoms symbolizing resilience across the high plateau, framing every pathway along our deck."
                    : "Loài hoa Hoya hình ngôi sao biểu trưng cho sức sống dẻo dai của đất trời cao nguyên, phủ kín lối đi quanh hiên nhà."}
                </p>
              </div>
              <span className="inline-flex items-center w-fit px-3 py-1 rounded-full text-[12px] uppercase tracking-[0.12em] font-semibold bg-[#1B281D] text-[#88B795] border border-[#F3EBD8]/10">
                {isEn ? "Cafe Emblem" : "Biểu tượng quán"}
              </span>
            </div>

            {/* Card 4: Bảo tồn tự nhiên */}
            <div className="card-unified flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#1B281D] text-[#88B795] border border-[#F3EBD8]/10 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                  <Leaf className="w-6 h-6" />
                </div>
                <h3 className="text-[20px] sm:text-[22px] font-bold text-[#F3EBD8] mb-2 group-hover:text-[#CC7755] transition-colors">
                  {dict.home.pillar4Title}
                </h3>
                <p className="text-[15px] sm:text-[16px] text-[rgba(243,235,216,0.72)] leading-relaxed mb-5">
                  {dict.home.pillar4Desc}
                </p>
              </div>
              <span className="inline-flex items-center w-fit px-3 py-1 rounded-full text-[12px] uppercase tracking-[0.12em] font-semibold bg-[#1B281D] text-[#88B795] border border-[#F3EBD8]/10">
                {isEn ? "Nature Preserved" : "Bảo tồn tự nhiên"}
              </span>
            </div>
          </div>
        </section>

        {/* SECTION 2: SPACE PREVIEWS (Multi-Device Responsive Grid with Lightbox) */}
        <section className="container-unified section-unified">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#16231A] border border-[#F3EBD8]/10 text-[#88B795] text-[12px] font-semibold uppercase tracking-[0.12em] mb-3">
                <Waves className="w-3.5 h-3.5" />
                <span>{isEn ? "Open Stream Space" : "Không Gian Mở Bên Bờ Suối"}</span>
              </div>
              <StaggerText
                as="h2"
                lines={[isEn ? "Scenic Photo Spots & Natural Serenity" : "Góc Check-in & Thư Thái Tự Nhiên"]}
                className="font-serif text-3xl sm:text-4xl text-[#F3EBD8] font-bold tracking-tight"
              />
            </div>
            <Link
              href="/space"
              className="btn-press-sm inline-flex items-center gap-2 text-sm font-semibold text-[#88B795] hover:text-[#CC7755] transition-colors"
            >
              <span className="link-hover-underline">{isEn ? "View all 30+ photo angles" : "Xem toàn bộ 30+ góc ảnh không gian"}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Grid 4 columns on Desktop, 2 on Tablet, 1-2 on Mobile - Reveal bằng Mask kéo màn che từ trái sang phải */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {HOME_SPACE_PREVIEWS.map((photo, idx) => (
              <div
                key={photo.url}
                onClick={() => handleOpenLightbox(idx)}
                className="group relative cursor-pointer rounded-[20px] overflow-hidden aspect-[4/3] bg-[#16231A] border border-[#F3EBD8]/10 hover:border-[#F3EBD8]/25 transition-all duration-300 hover:-translate-y-[2px] active:scale-[0.98] transform-gpu"
              >
                <MaskRevealImage
                  src={photo.url}
                  alt={photo.title}
                  aspectRatio="aspect-[4/3]"
                  delay={0.08 * idx}
                />
                <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-t from-stone-950/85 via-stone-950/30 to-transparent flex flex-col justify-end p-4 text-white">
                  <span className="text-[12px] font-semibold uppercase tracking-wider text-[#88B795] mb-0.5 transform transition-transform duration-300 group-hover:-translate-y-0.5">
                    {photo.subtitle}
                  </span>
                  <h3 className="font-serif text-[17px] font-bold text-[#F3EBD8] line-clamp-1 group-hover:text-[#CC7755] transition-colors">
                    {photo.title}
                  </h3>
                  <p className="text-[14px] text-[rgba(243,235,216,0.72)] line-clamp-1 mt-0.5 transition-transform duration-300 group-hover:-translate-y-0.5">
                    {photo.caption}
                  </p>
                </div>

                <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-black/50 text-white/80 group-hover:text-white group-hover:bg-[#3E5C46] flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 shadow-md">
                  <Maximize2 className="w-3.5 h-3.5" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 3: AUTHENTIC GOOGLE MAPS REVIEWS & TESTIMONIALS */}
        <GoogleReviewsSection isEn={isEn} />

        {/* SECTION 4: INVITATION & DIRECTIONS CTA */}
        <section className="container-unified section-unified">
          <div className="card-unified flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="max-w-2xl">
              <span className="text-[#88B795] text-[12px] uppercase tracking-[0.12em] font-semibold">
                {isEn ? "Warmest Hospitality" : "Chào Đón Bạn Ghé Thăm"}
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold mt-2 mb-4 leading-tight text-[#F3EBD8]">
                {isEn ? "Visit Cam Cu House & Savor Coffee by the Stream" : "Ghé Cẩm Cù House Thưởng Thức Cà Phê Bên Bờ Suối"}
              </h2>
              <p className="text-[15px] sm:text-[16px] text-[rgba(243,235,216,0.72)] leading-relaxed mb-6">
                {dict.common.addressFull}. {i18nStatus.scheduleText}.
              </p>
              <div className="flex flex-wrap items-center gap-4 text-xs text-emerald-100">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                  {isEn ? "Direct car access" : "Đường ô tô vào tận nơi"}
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                  {isEn ? "Free spacious parking" : "Chỗ đỗ xe rộng rãi miễn phí"}
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                  {isEn ? "High-speed WiFi" : "Wifi cáp quang tốc độ cao"}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 shrink-0 w-full lg:w-auto">
              <a
                href={`tel:${settings.hotline1.replace(/\s+/g, "")}`}
                className="btn-press inline-flex items-center justify-center gap-2 min-h-[44px] px-8 py-4 rounded-full bg-[#1B281D] hover:bg-[#121A15] text-white border border-emerald-400/40 font-bold text-sm transition-all shadow-lg hover:-translate-y-0.5"
              >
                <PhoneCall className="w-5 h-5 text-emerald-300" />
                <span>
                  {isEn ? "Call Hotline:" : "Gọi Hotline:"} {settings.hotline1}
                </span>
              </a>
              <a
                href="https://maps.google.com/?q=Hem+437+Hung+Vuong+Nghia+Trung+Gia+Nghia+Dak+Nong"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-press inline-flex items-center justify-center gap-2 min-h-[44px] px-8 py-4 rounded-full bg-[#2D4233] text-white font-semibold text-sm hover:bg-[#1f2e23] border border-white/20 transition-all shadow-md hover:-translate-y-0.5"
              >
                <MapPin className="w-5 h-5 text-emerald-300" />
                <span>{dict.common.getDirections}</span>
              </a>
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
