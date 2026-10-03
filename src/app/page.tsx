"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LightboxModal from "@/components/LightboxModal";
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
  Wind,
  Droplets,
  Coffee,
  PhoneCall,
  MapPin,
  CheckCircle2,
  Flower2,
  Waves,
  Sparkles,
  Clock,
  Maximize2
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
    <div className="bg-[#F9F8F3] dark:bg-[#121A15] min-h-screen text-[#1B281D] dark:text-[#F5F4EE] font-sans selection:bg-[#3E5C46] selection:text-white transition-colors duration-300">
      <Navbar />

      <main className="pt-24 sm:pt-28">
        {/* Dynamic Announcement Banner from Shared Cookie Store: Render only if pinnedNews exists */}
        {pinnedNews && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-2">
            <div className="bg-[#2D4233] dark:bg-[#16231A] text-white p-4 sm:p-5 rounded-2xl shadow-md border border-[#3E5C46]/50 dark:border-stone-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start sm:items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-white/10 text-amber-300 flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5 animate-pulse" />
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-800 text-emerald-200 text-[10px] font-bold uppercase tracking-wider">
                      {pinnedNews.category === "event" || pinnedNews.type === "event"
                        ? (isEn ? "Special Event" : "Sự Kiện")
                        : pinnedNews.category === "special" || pinnedNews.type === "special"
                        ? (isEn ? "Specialty" : "Món Đặc Sản")
                        : dict.common.noticeBoard}
                    </span>
                    <span className="text-sm sm:text-base font-bold text-white">
                      {pinnedNews.title}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-stone-200 mt-1 line-clamp-2 sm:line-clamp-1">
                    {pinnedNews.content}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                <Link
                  href="/menu"
                  className="px-4 py-2 rounded-full bg-[#F9F8F3] text-[#2D4233] text-xs font-bold hover:bg-white transition-all shadow-sm"
                >
                  {dict.common.viewMenu}
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* HERO SECTION - WARM CREAM BEIGE / DARK FOREST NATURE */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10 pb-16 text-center">
          {/* Eyebrow Coordinate Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-stone-200/80 dark:bg-[#1E2B22] text-xs font-semibold uppercase tracking-widest text-[#3E5C46] dark:text-[#88B795] mb-6 shadow-sm border border-stone-300/60 dark:border-stone-700/60">
            <Compass className="w-3.5 h-3.5 text-[#396663] dark:text-[#88B795]" />
            <span>{dict.common.coordinates}</span>
          </div>

          {/* Hero Headlines */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-[#2D4233] dark:text-[#F5F4EE] tracking-tight leading-tight max-w-4xl mx-auto mb-4">
            {dict.home.heroTitleLine1} <br />
            <span className="italic font-normal text-[#7D5E4A] dark:text-[#E8A87C] text-2xl sm:text-4xl lg:text-5xl block mt-2">
              {dict.home.heroTitleLine2}
            </span>
          </h1>

          {/* Subtitle Description */}
          <p className="text-stone-600 dark:text-stone-300 text-base sm:text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
            {dict.home.heroDescription}
          </p>

          {/* Trust Badges */}
          <div className="flex flex-wrap items-center justify-center gap-3 text-xs sm:text-sm font-medium text-stone-700 dark:text-stone-300 mb-8">
            <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white dark:bg-[#1E2B22] shadow-sm border border-stone-200/80 dark:border-stone-700/60">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              {dict.home.badgeRecommended}
            </span>
            <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white dark:bg-[#1E2B22] shadow-sm border border-stone-200/80 dark:border-stone-700/60">
              <DollarSign className="w-4 h-4 text-[#3E5C46] dark:text-[#88B795]" />
              {dict.home.badgePrice}
            </span>
            <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white dark:bg-[#1E2B22] shadow-sm border border-stone-200/80 dark:border-stone-700/60">
              <Leaf className="w-4 h-4 text-[#396663] dark:text-[#88B795]" />
              {dict.home.badgeOrganic}
            </span>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3.5 mb-10">
            <Link
              href="/space"
              className="inline-flex items-center justify-center gap-2 min-h-[44px] px-7 py-3 rounded-full bg-[#3E5C46] text-white text-sm font-semibold hover:bg-[#2D4233] transition-all shadow-[0_6px_20px_rgba(62,92,70,0.25)] hover:-translate-y-0.5"
            >
              <span>{dict.common.exploreStream}</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
            <Link
              href="/menu"
              className="inline-flex items-center justify-center gap-2 min-h-[44px] px-7 py-3 rounded-full bg-white dark:bg-[#1E2B22] text-[#2D4233] dark:text-[#F5F4EE] text-sm font-semibold hover:bg-stone-50 dark:hover:bg-[#28392E] border border-stone-300/80 dark:border-stone-700/60 transition-all shadow-sm hover:-translate-y-0.5"
            >
              <UtensilsCrossed className="w-4 h-4 text-[#3E5C46] dark:text-[#88B795]" />
              <span>{dict.common.viewMenu}</span>
            </Link>
            <a
              href="tel:0382851688"
              className="inline-flex items-center justify-center gap-2 min-h-[44px] px-6 py-3 rounded-full bg-[#F4EFEA] dark:bg-[#1E2B22] hover:bg-[#EAE2D9] text-[#2D4233] dark:text-[#88B795] text-sm font-semibold transition-all shadow-sm border border-stone-300/60 dark:border-stone-700/60 hover:-translate-y-0.5"
            >
              <PhoneCall className="w-4 h-4 text-[#3E5C46] dark:text-[#88B795]" />
              <span>Hotline: {settings.hotline1}</span>
            </a>
            <a
              href="https://maps.google.com/?q=Hem+437+Hung+Vuong+Nghia+Trung+Gia+Nghia+Dak+Nong"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 min-h-[44px] px-6 py-3 rounded-full bg-stone-100 dark:bg-[#1E2B22] hover:bg-stone-200 dark:hover:bg-[#28392E] text-stone-700 dark:text-stone-300 text-sm font-semibold transition-all border border-stone-300/60 dark:border-stone-700/60"
            >
              <MapPin className="w-4 h-4 text-[#7D5E4A] dark:text-[#E8A87C]" />
              <span>{dict.common.getDirections}</span>
            </a>
          </div>

          {/* Real-time Atmospheric Meter Badge & Store Status (GMT+7 Live Status) */}
          <div className="inline-flex flex-wrap items-center justify-center gap-3 px-5 py-2.5 rounded-full bg-white/90 dark:bg-[#1E2B22] backdrop-blur-sm border border-stone-200/80 dark:border-stone-700/60 shadow-sm text-stone-600 dark:text-stone-300 text-xs mb-10 transition-colors">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span
                  className={`animate-ping absolute inline-flex h-full w-full rounded-full ${
                    storeStatus.badgeType === "open"
                      ? "bg-emerald-400"
                      : storeStatus.badgeType === "closing_soon"
                      ? "bg-amber-400"
                      : "bg-rose-400"
                  } opacity-75`}
                />
                <span
                  className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                    storeStatus.badgeType === "open"
                      ? "bg-emerald-500"
                      : storeStatus.badgeType === "closing_soon"
                      ? "bg-amber-500"
                      : "bg-rose-500"
                  }`}
                />
              </span>
              <span className="font-semibold text-stone-800 dark:text-stone-100">
                {i18nStatus.badgeText}
              </span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-3 font-semibold text-[#2D4233] dark:text-[#88B795]">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> {i18nStatus.scheduleText}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Thermometer className="w-3.5 h-3.5" /> {dict.home.tempText}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Wind className="w-3.5 h-3.5" /> {dict.home.windText}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Droplets className="w-3.5 h-3.5" /> {dict.home.waterText}
              </span>
            </div>
          </div>

          {/* Hero Stream Photo Frame (Authentic High-Res Cafe Stream Photo) */}
          <div
            onClick={() => handleOpenLightbox(0)}
            className="group relative cursor-pointer max-w-5xl mx-auto h-72 sm:h-96 md:h-[500px] rounded-3xl overflow-hidden shadow-2xl border-4 border-white dark:border-stone-700/60"
          >
            <img
              src="/uploads/gallery/1788250253551-943009233.jpg"
              alt={dict.home.heroCardTitle}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/20 to-transparent flex items-end justify-between p-6 sm:p-10">
              <div className="text-left text-white">
                <span className="text-xs uppercase font-semibold tracking-wider text-emerald-300">
                  {dict.home.streamEcoSpace}
                </span>
                <p className="text-lg sm:text-2xl font-serif font-bold mt-1">
                  {dict.home.heroCardTitle}
                </p>
                <p className="text-xs sm:text-sm text-stone-200 mt-1 max-w-xl">
                  {dict.home.heroCardDesc}
                </p>
              </div>

              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-semibold group-hover:bg-[#3E5C46] transition-colors">
                <Maximize2 className="w-3.5 h-3.5" />
                <span>{dict.common.viewLarger}</span>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 1: 4 PILLARS - VÌ SAO CHỌN CẨM CÙ HOUSE */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#3E5C46]/10 dark:bg-[#88B795]/15 text-[#3E5C46] dark:text-[#88B795] text-xs font-semibold mb-3">
                <Flower2 className="w-3.5 h-3.5" />
                <span>{isEn ? "Highland Authenticity" : "Nét Đẹp Bản Địa"}</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#3E5C46] dark:text-[#F5F4EE] font-bold tracking-tight">
                {dict.home.pillarsHeading}
              </h2>
            </div>
            <p className="text-sm sm:text-base text-stone-700 dark:text-stone-300 max-w-md">
              {dict.home.pillarsSubheading}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1 */}
            <div className="bg-white/90 dark:bg-[#1E2B22] backdrop-blur-sm shadow-sm rounded-2xl p-6 border border-stone-200/60 dark:border-stone-700/60 hover:shadow-md transition-all flex flex-col justify-between">
              <div className="w-12 h-12 rounded-2xl bg-[#3E5C46]/10 dark:bg-[#88B795]/15 text-[#3E5C46] dark:text-[#88B795] flex items-center justify-center mb-4">
                <Coffee className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-[#1B281D] dark:text-white mb-2">
                {dict.home.pillar2Title}
              </h3>
              <p className="text-sm text-stone-700 dark:text-stone-300 leading-relaxed mb-4">
                {dict.home.pillar2Desc}
              </p>
              <span className="text-xs font-semibold text-[#3E5C46] dark:text-[#88B795]">
                {isEn ? "Artisanal Roasting" : "Hương vị truyền thống"}
              </span>
            </div>

            {/* Card 2 */}
            <div className="bg-white/90 dark:bg-[#1E2B22] backdrop-blur-sm shadow-sm rounded-2xl p-6 border border-stone-200/60 dark:border-stone-700/60 hover:shadow-md transition-all flex flex-col justify-between">
              <div className="w-12 h-12 rounded-2xl bg-[#396663]/10 dark:bg-[#396663]/25 text-[#396663] dark:text-[#88B795] flex items-center justify-center mb-4">
                <Waves className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-[#1B281D] dark:text-white mb-2">
                {dict.home.pillar1Title}
              </h3>
              <p className="text-sm text-stone-700 dark:text-stone-300 leading-relaxed mb-4">
                {dict.home.pillar1Desc}
              </p>
              <span className="text-xs font-semibold text-[#396663] dark:text-[#88B795]">
                {isEn ? "100% Pure Nature" : "Thiên nhiên 100%"}
              </span>
            </div>

            {/* Card 3 */}
            <div className="bg-white/90 dark:bg-[#1E2B22] backdrop-blur-sm shadow-sm rounded-2xl p-6 border border-stone-200/60 dark:border-stone-700/60 hover:shadow-md transition-all flex flex-col justify-between">
              <div className="w-12 h-12 rounded-2xl bg-amber-600/10 text-amber-700 dark:text-amber-400 flex items-center justify-center mb-4">
                <Flower2 className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-[#1B281D] dark:text-white mb-2">
                {isEn ? "Blooming Hoya Flowers" : "Hoa Cẩm Cù Nở Rộ"}
              </h3>
              <p className="text-sm text-stone-700 dark:text-stone-300 leading-relaxed mb-4">
                {isEn
                  ? "Star-shaped hoya blossoms symbolizing resilience across the high plateau, framing every pathway along our deck."
                  : "Loài hoa Hoya hình ngôi sao biểu trưng cho sức sống dẻo dai của đất trời cao nguyên, phủ kín lối đi quanh hiên nhà."}
              </p>
              <span className="text-xs font-semibold text-amber-700 dark:text-amber-400">
                {isEn ? "Cafe Emblem" : "Biểu tượng quán"}
              </span>
            </div>

            {/* Card 4 */}
            <div className="bg-white/90 dark:bg-[#1E2B22] backdrop-blur-sm shadow-sm rounded-2xl p-6 border border-stone-200/60 dark:border-stone-700/60 hover:shadow-md transition-all flex flex-col justify-between">
              <div className="w-12 h-12 rounded-2xl bg-[#7D5E4A]/10 text-[#7D5E4A] dark:text-[#E8A87C] flex items-center justify-center mb-4">
                <Leaf className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-[#1B281D] dark:text-white mb-2">
                {dict.home.pillar4Title}
              </h3>
              <p className="text-sm text-stone-700 dark:text-stone-300 leading-relaxed mb-4">
                {dict.home.pillar4Desc}
              </p>
              <span className="text-xs font-semibold text-[#7D5E4A] dark:text-[#E8A87C]">
                {isEn ? "Nature Preserved" : "Bảo tồn tự nhiên"}
              </span>
            </div>
          </div>
        </section>

        {/* SECTION 2: SPACE PREVIEWS (Multi-Device Responsive Grid with Lightbox) */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#3E5C46]/10 dark:bg-[#88B795]/15 text-[#3E5C46] dark:text-[#88B795] text-xs font-semibold mb-3">
                <Waves className="w-3.5 h-3.5" />
                <span>{isEn ? "Open Stream Space" : "Không Gian Mở Bên Bờ Suối"}</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#3E5C46] dark:text-[#F5F4EE] font-bold tracking-tight">
                {isEn ? "Scenic Photo Spots & Natural Serenity" : "Góc Check-in & Thư Thái Tự Nhiên"}
              </h2>
            </div>
            <Link
              href="/space"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#3E5C46] dark:text-[#88B795] hover:text-[#2D4233] dark:hover:text-emerald-300 transition-colors"
            >
              <span>{isEn ? "View all 30+ photo angles" : "Xem toàn bộ 30+ góc ảnh không gian"}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Grid 4 columns on Desktop, 2 on Tablet, 1-2 on Mobile */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {HOME_SPACE_PREVIEWS.map((photo, idx) => (
              <div
                key={photo.url}
                onClick={() => handleOpenLightbox(idx)}
                className="group relative cursor-pointer rounded-2xl overflow-hidden aspect-[4/3] bg-stone-100 dark:bg-stone-800 shadow-sm hover:shadow-xl border border-stone-200/70 dark:border-stone-700/60 transition-all duration-300 hover:-translate-y-1"
              >
                <img
                  src={photo.url}
                  alt={photo.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/85 via-stone-950/30 to-transparent flex flex-col justify-end p-4 text-white">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300 mb-0.5">
                    {photo.subtitle}
                  </span>
                  <h3 className="font-serif text-sm sm:text-base font-bold text-white line-clamp-1 group-hover:text-emerald-200 transition-colors">
                    {photo.title}
                  </h3>
                  <p className="text-[11px] text-stone-200/90 line-clamp-1 mt-0.5">
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

        {/* SECTION 3: TESTIMONIALS */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#3E5C46]/10 dark:bg-[#88B795]/15 text-[#3E5C46] dark:text-[#88B795] text-xs font-semibold mb-3">
              <Star className="w-3.5 h-3.5 fill-[#3E5C46] text-[#3E5C46] dark:fill-[#88B795] dark:text-[#88B795]" />
              <span>{isEn ? "Guest Reviews" : "Đánh Giá Từ Khách Hàng"}</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#3E5C46] dark:text-[#F5F4EE] font-bold tracking-tight">
              {isEn ? "Reflections from Visiting Guests" : "Cảm Nhận Từ Lữ Khách Ghé Chơi"}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/90 dark:bg-[#1E2B22] backdrop-blur-sm shadow-sm rounded-2xl p-6 border border-stone-200/60 dark:border-stone-700/60 flex flex-col justify-between">
              <div className="flex items-center gap-1 text-amber-500 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-stone-700 dark:text-stone-300 text-sm leading-relaxed mb-6 italic">
                {isEn
                  ? "&ldquo;The riverside space is stunning and so relaxing. Salt coffee here is rich and creamy, sitting by the murmuring water all afternoon never gets old.&rdquo;"
                  : "&ldquo;Không gian bờ suối quá đẹp và thư thái. Cà phê muối ở đây cực kỳ thơm béo, ngồi nhâm nhi nghe tiếng nước chảy cả buổi không biết chán.&rdquo;"}
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#3E5C46]/15 dark:bg-[#88B795]/20 flex items-center justify-center font-bold text-[#3E5C46] dark:text-[#88B795]">
                  H
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#1B281D] dark:text-white">Hoàng Nam</h4>
                  <p className="text-xs text-stone-500 dark:text-stone-400">
                    {isEn ? "Visitor from HCMC" : "Khách du lịch TP.HCM"}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/90 dark:bg-[#1E2B22] backdrop-blur-sm shadow-sm rounded-2xl p-6 border border-stone-200/60 dark:border-stone-700/60 flex flex-col justify-between">
              <div className="flex items-center gap-1 text-amber-500 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-stone-700 dark:text-stone-300 text-sm leading-relaxed mb-6 italic">
                {isEn
                  ? "&ldquo;The access road is smooth, 7-seater cars drive right into the yard comfortably. Rustic ambience, lovely photo corners with hoya flowers.&rdquo;"
                  : "&ldquo;Đường vào rất dễ đi, xe ô tô 7 chỗ chạy vào tận sân thoải mái. Quán mộc mạc, nhiều góc chụp ảnh với hoa cẩm cù rất xinh xắn.&rdquo;"}
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#396663]/15 dark:bg-[#396663]/30 flex items-center justify-center font-bold text-[#396663] dark:text-emerald-300">
                  T
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#1B281D] dark:text-white">Thanh Thảo</h4>
                  <p className="text-xs text-stone-500 dark:text-stone-400">
                    {isEn ? "Local resident of Gia Nghia" : "Khách địa phương Gia Nghĩa"}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/90 dark:bg-[#1E2B22] backdrop-blur-sm shadow-sm rounded-2xl p-6 border border-stone-200/60 dark:border-stone-700/60 flex flex-col justify-between">
              <div className="flex items-center gap-1 text-amber-500 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-stone-700 dark:text-stone-300 text-sm leading-relaxed mb-6 italic">
                {isEn
                  ? "&ldquo;Wild papaya flower tea is very special, soothing and health-promoting. Breakfast dishes like beef stew with bread are also delicious and reasonably priced.&rdquo;"
                  : "&ldquo;Trà hoa đu đủ rất đặc biệt, uống mát lành tốt cho sức khỏe. Đồ ăn sáng như bò kho bánh mì cũng rất ngon và giá cả hợp lý.&rdquo;"}
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-600/15 flex items-center justify-center font-bold text-amber-700 dark:text-amber-400">
                  M
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#1B281D] dark:text-white">Minh Trí</h4>
                  <p className="text-xs text-stone-500 dark:text-stone-400">
                    {isEn ? "Weekend Guest" : "Ghé thăm cuối tuần"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 4: INVITATION & DIRECTIONS CTA */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="bg-[#3E5C46] dark:bg-[#18261D] rounded-3xl p-8 sm:p-12 lg:p-16 text-white shadow-xl flex flex-col lg:flex-row items-center justify-between gap-8 border border-white/10">
            <div className="max-w-2xl">
              <span className="text-emerald-200 text-xs uppercase tracking-wider font-semibold">
                {isEn ? "Warmest Hospitality" : "Chào Đón Bạn Ghé Thăm"}
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold mt-2 mb-4 leading-tight">
                {isEn ? "Visit Cam Cu House & Savor Coffee by the Stream" : "Ghé Cẩm Cù House Thưởng Thức Cà Phê Bên Bờ Suối"}
              </h2>
              <p className="text-stone-200 text-sm sm:text-base leading-relaxed mb-6">
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
                className="inline-flex items-center justify-center gap-2 min-h-[44px] px-8 py-4 rounded-full bg-white text-[#3E5C46] font-bold text-sm hover:bg-stone-100 transition-all shadow-lg hover:-translate-y-0.5"
              >
                <PhoneCall className="w-5 h-5 text-[#3E5C46]" />
                <span>
                  {isEn ? "Call Hotline:" : "Gọi Hotline:"} {settings.hotline1}
                </span>
              </a>
              <a
                href="https://maps.google.com/?q=Hem+437+Hung+Vuong+Nghia+Trung+Gia+Nghia+Dak+Nong"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 min-h-[44px] px-8 py-4 rounded-full bg-[#2D4233] text-white font-semibold text-sm hover:bg-[#1f2e23] border border-white/20 transition-all shadow-md hover:-translate-y-0.5"
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
