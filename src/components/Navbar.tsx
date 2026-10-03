"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Clock, 
  PhoneCall, 
  User, 
  Menu as MenuIcon, 
  X, 
  MapPin, 
  Sparkles,
  Compass,
  Navigation,
} from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import { useStoreStatus } from "@/lib/openingHours";
import { useLanguage } from "@/context/LanguageContext";
import { getStoreStatusI18n } from "@/lib/translations";

const NAV_ITEMS = [
  { href: "/", labelVi: "Trang Chủ", labelEn: "Home" },
  { href: "/about", labelVi: "Câu Chuyện", labelEn: "Our Story" },
  { href: "/space", labelVi: "Không Gian Suối", labelEn: "Stream Sanctuary" },
  { href: "/menu", labelVi: "Thực Đơn", labelEn: "Menu" },
  { href: "/contact", labelVi: "Chỉ Đường & Liên Hệ", labelEn: "Directions & Contact" },
];

import {
  getSharedData,
  KEYS,
  SharedAnnouncement,
} from "@/lib/syncStore";
import {
  CAMCU_SETTINGS_KEY,
  getStoredData,
} from "@/utils/storage";

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { locale, setLocale, dict } = useLanguage();
  const storeStatus = useStoreStatus();
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

  // Close mobile drawer upon route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

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

    // 2. Fetch server updates (fallback if no client cookie is present)
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

  // Status badge color & breathing pulse ring helpers
  const getDotClass = () => {
    if (storeStatus.badgeType === "open") return "bg-emerald-400 animate-pulse-ring-emerald";
    if (storeStatus.badgeType === "closing_soon") return "bg-amber-400 animate-pulse-ring-amber";
    return "bg-rose-400 animate-pulse-ring-rose";
  };

  const getPillDotClass = () => {
    if (storeStatus.badgeType === "open") return "bg-emerald-500 animate-pulse-ring-emerald";
    if (storeStatus.badgeType === "closing_soon") return "bg-amber-500 animate-pulse-ring-amber";
    return "bg-rose-500 animate-pulse-ring-rose";
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-[#F9F8F3]/95 dark:bg-[#121A15]/95 backdrop-blur-md border-b border-stone-200/80 dark:border-stone-800/80 shadow-[0_2px_12px_rgba(37,51,38,0.04)] transition-colors duration-300">
      {/* Top Announcement Bar */}
      <div className="w-full bg-[#2D4233] dark:bg-[#16231A] text-stone-200 text-[11px] sm:text-xs py-1 px-3 sm:px-4 border-b border-stone-800/20 dark:border-stone-800/60 transition-colors duration-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4 overflow-hidden">
          {/* Mobile Display: Clean left-right balance without horizontal overflow */}
          <div className="flex md:hidden items-center justify-between w-full text-[11px]">
            <span className="flex items-center gap-1.5 font-semibold text-white truncate">
              <span className={`w-2 h-2 rounded-full shrink-0 ${getDotClass()}`} />
              <span className="truncate">{i18nStatus.shortBadge}</span>
            </span>
            <span className="text-stone-300 text-[10px] sm:text-[11px] font-medium shrink-0 ml-2">
              {storeStatus.isOpen
                ? (locale === "en" ? `Closes at ${storeStatus.closingTime}` : `Đóng lúc ${storeStatus.closingTime}`)
                : (locale === "en" ? "Opens at 07:00" : "Mở lúc 07:00")}
            </span>
          </div>

          {/* Desktop Display: Pinned Announcement / Detailed Schedule */}
          <div className="hidden md:flex items-center gap-2 overflow-hidden truncate">
            <span className="bg-[#3E5C46] px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider text-emerald-200 shrink-0">
              {pinnedNews ? dict.common.noticeBoard : dict.common.openingHoursGMT}
            </span>
            <span className="truncate font-medium">
              {pinnedNews
                ? `${pinnedNews.title}: ${pinnedNews.content}`
                : i18nStatus.badgeText}
            </span>
          </div>

          <div className="hidden md:flex items-center gap-3 shrink-0 text-stone-300">
            <span className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${getDotClass()}`} />
              <span className="font-semibold text-white">
                {i18nStatus.shortBadge}
              </span>
            </span>
            <span>•</span>
            <span className="text-stone-300 font-medium">
              {i18nStatus.scheduleText}
            </span>
          </div>
        </div>
      </div>

      {/* Main Header Container - Fixed Height & No Horizontal Overflow */}
      <div className="h-14 sm:h-20 w-full px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4 overflow-hidden">
        {/* Brand / Logo */}
        <Link href="/" className="flex items-center gap-2 sm:gap-3 shrink-0 min-w-0 group btn-press-sm">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#3E5C46]/10 dark:bg-[#88B795]/15 flex items-center justify-center text-[#3E5C46] dark:text-[#88B795] group-hover:bg-[#3E5C46] group-hover:text-white dark:group-hover:bg-[#88B795] dark:group-hover:text-[#121A15] transition-all duration-300 shadow-sm shrink-0">
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-current animate-pulse" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-serif text-base sm:text-2xl font-bold text-[#3E5C46] dark:text-[#F5F4EE] tracking-tight group-hover:text-[#2D4233] dark:group-hover:text-[#88B795] transition-colors truncate">
              Cẩm Cù House
            </span>
            <span className="text-[9px] sm:text-xs text-stone-600 dark:text-stone-400 font-medium tracking-wide truncate hidden xs:block">
              {locale === "en" ? "coffee & Food • Gia Nghia" : "coffee & Food • Gia Nghĩa"}
            </span>
          </div>
          
          {/* Quick Realtime Hours Pill (Desktop only) */}
          <div className="hidden xl:flex items-center gap-1.5 ml-2 px-3 py-1 bg-stone-100 dark:bg-[#1E2B22] rounded-full text-stone-700 dark:text-stone-300 text-xs border border-stone-200/60 dark:border-stone-700/60 shadow-sm transition-colors">
            <Clock className="w-3.5 h-3.5 text-[#396663] dark:text-[#88B795]" />
            <span className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${getPillDotClass()}`} />
              <span className="font-semibold">{i18nStatus.shortBadge}</span>
            </span>
          </div>
        </Link>

        {/* Desktop Navigation - Centered Pill */}
        <nav className="hidden lg:inline-flex flex-row items-center gap-1 sm:gap-1.5 md:gap-2 p-1.5 rounded-full bg-stone-900/60 dark:bg-stone-900/80 border border-stone-800/60 backdrop-blur-md max-w-max mx-auto shrink-0">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            const label = locale === "en" ? item.labelEn : item.labelVi;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`inline-flex items-center justify-center whitespace-nowrap shrink-0 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium rounded-full transition-all duration-200 btn-press-sm ${
                  isActive
                    ? "bg-[#2D4233] text-white rounded-full shadow-sm font-bold"
                    : "text-stone-300 hover:text-white hover:bg-stone-800/40 rounded-full"
                }`}
              >
                <span className="whitespace-nowrap">{label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Actions Deck: Exactly 3 neat controls on mobile (Theme, VN/EN, Hamburger) */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {/* 1. Theme Toggle Button (Light / Dark) */}
          <ThemeToggle />

          {/* 2. Bilingual Language Switcher (VN | EN) with Smooth Animated Slider */}
          <div className="inline-flex items-center bg-stone-100 dark:bg-[#1E2B22] rounded-full p-0.5 sm:p-1 text-xs font-bold text-stone-600 dark:text-stone-300 border border-stone-200/80 dark:border-stone-700/60 shadow-inner relative shrink-0">
            <button
              type="button"
              onClick={() => setLocale("vi")}
              className={`relative px-2 sm:px-3 py-1 rounded-full transition-colors duration-200 z-10 btn-press-sm text-[11px] sm:text-xs ${
                locale === "vi"
                  ? "text-white"
                  : "text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200"
              }`}
              aria-label="Tiếng Việt"
            >
              {locale === "vi" && (
                <motion.span
                  layoutId="activeLangPillDesktop"
                  className="absolute inset-0 bg-[#3E5C46] dark:bg-[#2D4233] rounded-full shadow-sm -z-10"
                  transition={{ type: "spring", stiffness: 450, damping: 32 }}
                />
              )}
              VN
            </button>
            <button
              type="button"
              onClick={() => setLocale("en")}
              className={`relative px-2 sm:px-3 py-1 rounded-full transition-colors duration-200 z-10 btn-press-sm text-[11px] sm:text-xs ${
                locale === "en"
                  ? "text-white"
                  : "text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200"
              }`}
              aria-label="English"
            >
              {locale === "en" && (
                <motion.span
                  layoutId="activeLangPillDesktop"
                  className="absolute inset-0 bg-[#3E5C46] dark:bg-[#2D4233] rounded-full shadow-sm -z-10"
                  transition={{ type: "spring", stiffness: 450, damping: 32 }}
                />
              )}
              EN
            </button>
          </div>

          {/* Hotline CTA (Desktop & Tablet only to prevent mobile overflow) */}
          <a
            href={`tel:${settings.hotline1.replace(/\s+/g, "")}`}
            className="btn-press hidden xl:inline-flex items-center justify-center gap-2 px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-full bg-[#3E5C46] hover:bg-[#2D4233] text-white text-xs sm:text-sm font-semibold transition-all shadow-[0_4px_14px_rgba(62,92,70,0.25)] hover:-translate-y-0.5 shrink-0"
          >
            <PhoneCall className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-bounce" />
            <span>{settings.hotline1}</span>
          </a>

          {/* Admin link (Desktop only) */}
          <a
            href="https://admin.camcuhouse.online"
            title={dict.common.admin}
            className="btn-press hidden sm:flex w-9 h-9 sm:w-10 sm:h-10 min-w-[36px] min-h-[36px] rounded-full bg-[#3E5C46] hover:bg-[#2D4233] text-white items-center justify-center shrink-0 shadow-sm"
          >
            <User className="w-4 h-4" />
          </a>

          {/* 3. Mobile Hamburger Menu Button (Min 40-44px touch target) */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="btn-press lg:hidden w-9 h-9 sm:w-10 sm:h-10 min-w-[36px] min-h-[36px] flex items-center justify-center rounded-full bg-stone-100 dark:bg-[#1E2B22] text-stone-800 dark:text-stone-200 hover:bg-stone-200 dark:hover:bg-[#2A3B30] transition-colors border border-stone-200 dark:border-stone-700/60 shrink-0"
            aria-label="Mở menu điều hướng"
          >
            {mobileMenuOpen ? <X className="w-4 h-4 text-rose-500" /> : <MenuIcon className="w-4 h-4 text-[#3E5C46] dark:text-[#88B795]" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu with Backdrop */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileMenuOpen(false)}
              className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm top-14 sm:top-20"
            />

            {/* Slide Down Drawer Menu */}
            <motion.div
              initial={{ opacity: 0, y: -8, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -8, height: 0 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="lg:hidden fixed top-14 sm:top-20 left-0 w-full z-50 bg-[#F9F8F3] dark:bg-[#121A15] border-b border-stone-200 dark:border-stone-800 px-5 py-5 flex flex-col gap-4 shadow-2xl max-h-[calc(100vh-60px)] overflow-y-auto"
            >
              {/* Realtime Status Bar with Coordinates in Drawer */}
              <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-800 text-xs text-stone-600 dark:text-stone-300">
                <span className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${getPillDotClass()}`} />
                  <span className="font-bold text-stone-900 dark:text-white truncate">
                    {i18nStatus.badgeText}
                  </span>
                </span>
                <span className="flex items-center gap-1 font-semibold text-[#3E5C46] dark:text-[#88B795] shrink-0">
                  <MapPin className="w-3.5 h-3.5" />
                  Gia Nghĩa
                </span>
              </div>

              {/* Navigation Links with Active Indicator */}
              <nav className="flex flex-col gap-1.5">
                {NAV_ITEMS.map((item) => {
                  const isActive = pathname === item.href;
                  const label = locale === "en" ? item.labelEn : item.labelVi;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`btn-press px-4 py-3 min-h-[46px] flex items-center justify-between rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${
                        isActive
                          ? "bg-[#3E5C46] text-white shadow-sm font-bold"
                          : "text-stone-800 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800/60"
                      }`}
                    >
                      <span className="whitespace-nowrap">{label}</span>
                      {isActive && <span className="w-2 h-2 rounded-full bg-emerald-300 shrink-0" />}
                    </Link>
                  );
                })}
              </nav>

              {/* Coordinates Pill */}
              <div className="p-3 rounded-xl bg-stone-100 dark:bg-[#1E2B22] border border-stone-200/80 dark:border-stone-700/60 flex items-center gap-2.5 text-xs text-stone-600 dark:text-stone-300">
                <Compass className="w-4 h-4 text-[#3E5C46] dark:text-[#88B795] shrink-0" />
                <span className="font-medium truncate">{dict.common.coordinates} • Đắk Nông</span>
              </div>

              {/* Action Buttons: Hotline & Directions */}
              <div className="pt-1 flex flex-col gap-2.5">
                <a
                  href={`tel:${settings.hotline1.replace(/\s+/g, "")}`}
                  className="btn-press w-full min-h-[48px] flex items-center justify-center gap-2 py-3.5 rounded-full bg-[#3E5C46] text-white text-sm font-bold shadow-md active:scale-95 transition-transform"
                >
                  <PhoneCall className="w-4 h-4 animate-bounce" />
                  <span>
                    {locale === "en" ? "Call Hotline:" : "Gọi Hotline Trực Tiếp:"} {settings.hotline1}
                  </span>
                </a>
                <a
                  href="https://maps.google.com/?q=Hem+437+Hung+Vuong+Nghia+Trung+Gia+Nghia+Dak+Nong"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-press w-full min-h-[44px] flex items-center justify-center gap-2 py-3 rounded-full bg-stone-100 dark:bg-[#1E2B22] text-[#3E5C46] dark:text-[#88B795] text-sm font-semibold hover:bg-stone-200 dark:hover:bg-[#25362B] border border-stone-200 dark:border-stone-700/60"
                >
                  <Navigation className="w-4 h-4 text-[#396663] dark:text-[#88B795]" />
                  <span>{dict.common.openGoogleMaps}</span>
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
