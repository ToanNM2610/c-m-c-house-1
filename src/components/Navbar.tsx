"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
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
    topBanner: "",
    topBannerEnabled: true,
  });
  const [announcements, setAnnouncements] = useState<SharedAnnouncement[]>([]);

  // Scroll behavior: scroll progress bar 2px, header shrink & auto-hide on scroll down, show on scroll up
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentY = window.scrollY;
          const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
          const progress = maxScroll > 0 ? Math.min(Math.max(currentY / maxScroll, 0), 1) : 0;
          setScrollProgress(progress);

          setIsScrolled(currentY > 30);

          if (currentY > 120) {
            if (currentY > lastScrollY.current + 6) {
              // Scrolling down
              setIsVisible(false);
            } else if (currentY < lastScrollY.current - 6) {
              // Scrolling up
              setIsVisible(true);
            }
          } else {
            setIsVisible(true);
          }

          lastScrollY.current = currentY;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile drawer upon route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const storedSettings = getStoredData<typeof settings | null>(CAMCU_SETTINGS_KEY, null);
    if (storedSettings) {
      setSettings((prev) => ({ ...prev, ...storedSettings }));
    }

    const storedAnnouncements = getSharedData<SharedAnnouncement[]>(KEYS.ANNOUNCEMENTS, []);
    setAnnouncements(storedAnnouncements);

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
      } catch (e) {}
    }
    loadData();

    return () => {
      window.removeEventListener("camcu_sync_update", handleSync);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  const getDotClass = () => {
    if (storeStatus.badgeType === "open") return "bg-emerald-400 animate-pulse";
    if (storeStatus.badgeType === "closing_soon") return "bg-amber-400 animate-pulse";
    return "bg-rose-400 animate-pulse";
  };

  // Không hiển thị Navbar khách hàng trên trang Admin
  if (pathname?.startsWith("/admin")) return null;

  return (
    <>
      {/* 1. Thanh tiến độ cuộn 2px (sage -> clay) */}
      <div
        className="fixed top-0 left-0 right-0 h-[2px] z-[60] bg-gradient-to-r from-[var(--accent-green)] to-[var(--accent-clay)] origin-left pointer-events-none transition-transform duration-75"
        style={{ transform: `scaleX(${scrollProgress})` }}
        aria-hidden="true"
      />

      {/* 2. Main Header: Thu nhỏ + mờ kính khi cuộn, ẩn khi cuộn xuống, hiện khi cuộn lên */}
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          isVisible ? "translate-y-0" : "-translate-y-full"
        } ${
          isScrolled
            ? "bg-[var(--bg)]/95 backdrop-blur-md shadow-md border-b border-[var(--border)]"
            : "bg-[var(--bg)]/90 backdrop-blur-sm border-b border-[var(--border)]"
        }`}
      >
        {/* Top Announcement Bar: 1 dòng duy nhất 13px (trạng thái mở cửa + giờ hôm nay) */}
        <div className="w-full bg-[var(--surface)] text-[var(--text)] text-[13px] py-1.5 px-4 border-b border-[var(--border)] transition-colors duration-200">
          <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 text-[13px] font-medium text-center truncate">
            <span className={`w-2 h-2 rounded-full shrink-0 ${getDotClass()}`} />
            <span className="font-semibold text-[var(--text)]">{i18nStatus.shortBadge}</span>
            <span className="text-[var(--text-muted)]">•</span>
            <span className="text-[var(--text)]">
              {storeStatus.isOpen
                ? (locale === "en" ? `Closes at ${storeStatus.closingTime} today` : `Đóng lúc ${storeStatus.closingTime} hôm nay`)
                : (locale === "en" ? "Opens at 07:00 tomorrow" : "Mở cửa lúc 07:00 ngày mai")}
            </span>
            <span className="hidden sm:inline text-[var(--text-muted)]">•</span>
            <span className="hidden sm:inline text-[var(--accent-green)] font-semibold">
              {i18nStatus.scheduleText}
            </span>
            {settings.topBanner && settings.topBannerEnabled !== false && (
              <>
                <span className="hidden md:inline text-[var(--text-muted)]">•</span>
                <span className="hidden md:inline text-[var(--accent-clay)] font-medium truncate max-w-sm">
                  {settings.topBanner}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Header Content Bar */}
        <div
          className={`w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-2 sm:gap-4 transition-all duration-300 ${
            isScrolled ? "h-16" : "h-16 sm:h-20"
          }`}
        >
          {/* Brand Logo: Playfair 24px */}
          <Link href="/" className="flex items-center gap-2.5 sm:gap-3 shrink-0 min-w-0 group btn-press-sm">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[var(--surface-2)] flex items-center justify-center text-[var(--accent-green)] group-hover:bg-[var(--accent-clay)] group-hover:text-[#1B120E] transition-all duration-300 shadow-sm shrink-0">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-current" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-serif text-[24px] font-bold text-[var(--text)] tracking-tight group-hover:text-[var(--accent-clay)] transition-colors truncate leading-tight">
                Cẩm Cù House
              </span>
            </div>
          </Link>

          {/* Desktop Navigation - 5 mục dạng pill */}
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

          {/* Action Tools: Theme Toggle & Language Switcher */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0 pr-1 sm:pr-2">
            <ThemeToggle />

            {/* Bilingual Switcher: VN | EN */}
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

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="btn-press lg:hidden w-10 h-10 min-w-[40px] min-h-[40px] flex items-center justify-center rounded-full bg-[var(--surface-2)] text-[var(--text)] hover:bg-[var(--surface)] transition-colors border border-[var(--border)] shrink-0"
              aria-label="Mở menu điều hướng"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-rose-500" /> : <MenuIcon className="w-5 h-5 text-[var(--accent-green)]" />}
            </button>
          </div>
        </div>

        {/* Full-screen Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="lg:hidden fixed inset-0 z-[100] bg-[var(--bg)]/98 backdrop-blur-2xl px-6 py-6 sm:py-8 flex flex-col justify-between overflow-y-auto"
            >
              {/* Header inside mobile menu */}
              <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-[var(--surface-2)] flex items-center justify-center text-[var(--accent-green)] shadow-md">
                    <Sparkles className="w-4 h-4 text-current" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-serif text-lg font-bold text-[var(--text)] tracking-wide">
                      Cẩm Cù House
                    </span>
                    <span className="text-[11px] text-[var(--text-muted)] font-medium">
                      coffee & Food • Gia Nghĩa
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn-press w-10 h-10 rounded-full bg-[var(--surface-2)] text-[var(--text)] flex items-center justify-center border border-[var(--border)] transition-all"
                  aria-label="Đóng menu"
                >
                  <X className="w-5 h-5 text-rose-500" />
                </button>
              </div>

              {/* Navigation Links */}
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
                            ? "text-[var(--accent-clay)] translate-x-2"
                            : "text-[var(--text)] hover:text-[var(--accent-clay)]"
                        }`}
                      >
                        <span>{label}</span>
                        {isActive && (
                          <span className="text-xs font-sans tracking-widest text-[var(--accent-green)] uppercase font-semibold">
                            • Đang xem
                          </span>
                        )}
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>

              {/* Footer inside mobile menu */}
              <div className="flex flex-col gap-3 pt-4 border-t border-[var(--border)]">
                <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
                  <span className="flex items-center gap-1.5 font-medium">
                    <Compass className="w-3.5 h-3.5 text-[var(--accent-green)]" />
                    <span>11.99° N, 107.69° E • Gia Nghĩa</span>
                  </span>
                  <span className="text-[var(--accent-green)] font-semibold">{i18nStatus.shortBadge}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <a
                    href={`tel:${settings.hotline1.replace(/\s+/g, "")}`}
                    className="btn-primary flex items-center justify-center gap-2 py-3 rounded-full text-xs font-bold"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>Gọi Hotline</span>
                  </a>
                  <a
                    href="https://maps.google.com/?q=Hem+437+Hung+Vuong+Nghia+Trung+Gia+Nghia+Dak+Nong"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary flex items-center justify-center gap-2 py-3 rounded-full text-xs font-bold"
                  >
                    <Navigation className="w-3.5 h-3.5 text-[var(--accent-green)]" />
                    <span>Chỉ Đường</span>
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
