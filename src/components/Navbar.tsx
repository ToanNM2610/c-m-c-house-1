"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  PhoneCall, 
  Menu as MenuIcon, 
  X, 
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
    topBanner: "🌿 Chào mừng đến với Cẩm Cù House, Giờ mở cửa: T2 - T5 (07:00 - 18:00) | T6 - CN (07:00 - 22:00)",
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

  // Không hiển thị Navbar khách hàng trên trang Admin
  if (pathname?.startsWith("/admin")) return null;

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-[#FDFBF7]/95 dark:bg-[#0F1A14]/95 backdrop-blur-md border-b border-[var(--border)] shadow-[0_2px_12px_rgba(0,0,0,0.06)] transition-colors duration-200">
      {/* Top Announcement Bar: 1 dòng duy nhất 13px, trạng thái mở cửa + giờ hôm nay */}
      <div className="w-full bg-[var(--surface)] text-[var(--text)] text-[13px] py-1.5 px-4 border-b border-[var(--border)] transition-colors duration-200">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2.5 text-[13px] font-medium text-center truncate">
          <span className={`w-2 h-2 rounded-full shrink-0 ${getDotClass()}`} />
          <span className="font-semibold">{i18nStatus.shortBadge}</span>
          <span className="text-[var(--text-muted)]">•</span>
          <span>
            {storeStatus.isOpen
              ? (locale === "en" ? `Closes at ${storeStatus.closingTime} today` : `Đóng lúc ${storeStatus.closingTime} hôm nay`)
              : (locale === "en" ? "Opens at 07:00 today" : "Mở lúc 07:00 hôm nay")}
          </span>
          <span className="hidden sm:inline text-[var(--text-muted)]">•</span>
          <span className="hidden sm:inline text-[var(--accent-green)] font-semibold">
            {i18nStatus.scheduleText}
          </span>
        </div>
      </div>

      {/* Main Header Container */}
      <div className="h-16 sm:h-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand / Logo: Playfair 24px */}
        <Link href="/" className="flex items-center gap-2.5 sm:gap-3 shrink-0 min-w-0 group btn-press-sm">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[var(--surface-2)] flex items-center justify-center text-[var(--accent-green)] group-hover:bg-[var(--accent-clay)] group-hover:text-[#1B120E] transition-all duration-300 shadow-sm shrink-0">
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-current animate-pulse" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-serif text-[24px] font-bold text-[var(--text)] tracking-tight group-hover:text-[var(--accent-clay)] transition-colors truncate leading-tight">
              Cẩm Cù House
            </span>
          </div>
        </Link>

        {/* Desktop Navigation - Centered Pill */}
        <nav className="hidden lg:inline-flex flex-row items-center gap-1 p-1.5 rounded-full bg-[var(--surface)] border border-[var(--border)] backdrop-blur-md max-w-max mx-auto shrink-0 shadow-sm">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            const label = locale === "en" ? item.labelEn : item.labelVi;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative inline-flex items-center justify-center whitespace-nowrap shrink-0 px-4 py-2 text-sm font-semibold rounded-full transition-all duration-200 btn-press-sm ${
                  isActive
                    ? "text-[var(--text)] font-bold"
                    : "text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-2)]/60 rounded-full"
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="activeNavPillDesktop"
                    className="absolute inset-0 bg-[var(--surface-2)] rounded-full shadow-sm border border-[var(--border)] -z-10"
                    transition={{ type: "spring", stiffness: 450, damping: 32 }}
                  />
                )}
                <span className="relative z-10 whitespace-nowrap">
                  {label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Actions Deck: Theme & VN/EN Language Switcher (plus Mobile Hamburger on mobile) */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0 pr-1 sm:pr-2">
          {/* 1. Theme Toggle Button (Light / Dark) */}
          <ThemeToggle />

          {/* 2. Bilingual Language Switcher (VN | EN) with Smooth Animated Slider */}
          <div className="inline-flex items-center bg-[var(--surface-2)] rounded-full p-0.5 sm:p-1 text-xs font-bold text-[var(--text-muted)] border border-[var(--border)] shadow-inner relative shrink-0">
            <button
              type="button"
              onClick={() => setLocale("vi")}
              className={`relative px-2.5 sm:px-3 py-1 rounded-full transition-colors duration-200 z-10 btn-press-sm text-[11px] sm:text-xs font-semibold ${
                locale === "vi"
                  ? "text-[var(--text)] font-bold"
                  : "text-[var(--text-muted)] hover:text-[var(--text)]"
              }`}
              aria-label="Tiếng Việt"
            >
              {locale === "vi" && (
                <motion.span
                  layoutId="activeLangPillDesktop"
                  className="absolute inset-0 bg-[var(--surface)] rounded-full shadow-sm border border-[var(--border)] -z-10"
                  transition={{ type: "spring", stiffness: 450, damping: 32 }}
                />
              )}
              VN
            </button>
            <button
              type="button"
              onClick={() => setLocale("en")}
              className={`relative px-2.5 sm:px-3 py-1 rounded-full transition-colors duration-200 z-10 btn-press-sm text-[11px] sm:text-xs font-semibold ${
                locale === "en"
                  ? "text-[var(--text)] font-bold"
                  : "text-[var(--text-muted)] hover:text-[var(--text)]"
              }`}
              aria-label="English"
            >
              {locale === "en" && (
                <motion.span
                  layoutId="activeLangPillDesktop"
                  className="absolute inset-0 bg-[var(--surface)] rounded-full shadow-sm border border-[var(--border)] -z-10"
                  transition={{ type: "spring", stiffness: 450, damping: 32 }}
                />
              )}
              EN
            </button>
          </div>

          {/* 3. Mobile Hamburger Menu Button (lg:hidden) */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="btn-press lg:hidden w-9 h-9 sm:w-10 sm:h-10 min-w-[36px] min-h-[36px] flex items-center justify-center rounded-full bg-[var(--surface-2)] text-[var(--text)] hover:bg-[var(--surface)] transition-colors border border-[var(--border)] shrink-0"
            aria-label="Mở menu điều hướng"
          >
            {mobileMenuOpen ? <X className="w-4 h-4 text-rose-500" /> : <MenuIcon className="w-4 h-4 text-[var(--accent-green)]" />}
          </button>
        </div>
      </div>

      {/* Full-screen Mobile Burger Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="lg:hidden fixed inset-0 z-[100] bg-[#121A15]/98 backdrop-blur-2xl px-6 py-6 sm:py-8 flex flex-col justify-between overflow-y-auto"
          >
            {/* Top Bar inside Fullscreen Menu: Logo & Close Button */}
            <div className="flex items-center justify-between border-b border-stone-800/80 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-[#3E5C46] flex items-center justify-center text-white shadow-md">
                  <Sparkles className="w-4 h-4 text-emerald-200 animate-pulse" />
                </div>
                <div className="flex flex-col">
                  <span className="font-serif text-lg font-bold text-white tracking-wide">
                    Cẩm Cù House
                  </span>
                  <span className="text-[10px] text-stone-400 font-medium">
                    coffee & Food • Gia Nghĩa
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="btn-press w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center border border-white/20 transition-all active:scale-95"
                aria-label="Đóng menu"
              >
                <X className="w-5 h-5 text-rose-400" />
              </button>
            </div>

            {/* Center Navigation Links - Large Elegant Typography */}
            <nav className="flex flex-col gap-3 py-6 my-auto">
              {NAV_ITEMS.map((item, idx) => {
                const isActive = pathname === item.href;
                const label = locale === "en" ? item.labelEn : item.labelVi;
                return (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * idx, duration: 0.3 }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center justify-between py-2.5 text-2xl sm:text-3xl font-serif font-bold transition-all ${
                        isActive
                          ? "text-emerald-300 translate-x-2"
                          : "text-stone-300 hover:text-white"
                      }`}
                    >
                      <span>{label}</span>
                      {isActive && (
                        <span className="text-xs font-sans tracking-widest text-emerald-400 uppercase font-semibold">
                          • Đang xem
                        </span>
                      )}
                    </Link>
                  </motion.div>
                );
              })}
            </nav>

            {/* Bottom Utilities in Fullscreen Menu */}
            <div className="flex flex-col gap-3 pt-4 border-t border-stone-800/80">
              <div className="flex items-center justify-between text-xs text-stone-400">
                <span className="flex items-center gap-1.5 font-medium">
                  <Compass className="w-3.5 h-3.5 text-emerald-400" />
                  <span>11.99° N, 107.69° E • Gia Nghĩa</span>
                </span>
                <span className="text-emerald-400 font-semibold">{i18nStatus.shortBadge}</span>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <a
                  href={`tel:${settings.hotline1.replace(/\s+/g, "")}`}
                  className="btn-press flex items-center justify-center gap-2 py-3 rounded-xl bg-[#3E5C46] text-white text-xs font-bold shadow-md"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Gọi {settings.hotline1}</span>
                </a>
                <a
                  href="https://maps.google.com/?q=Hem+437+Hung+Vuong+Nghia+Trung+Gia+Nghia+Dak+Nong"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-press flex items-center justify-center gap-2 py-3 rounded-xl bg-white/10 text-white text-xs font-bold border border-white/20"
                >
                  <Navigation className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Chỉ Đường</span>
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
