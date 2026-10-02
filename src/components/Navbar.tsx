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
} from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import { useStoreStatus } from "@/lib/openingHours";

const NAV_LINKS = [
  { href: "/", label: "Trang Chủ" },
  { href: "/about", label: "Giới Thiệu" },
  { href: "/space", label: "Không Gian Suối" },
  { href: "/menu", label: "Thực Đơn" },
  { href: "/contact", label: "Chỉ Đường & Liên Hệ" },
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
  const [lang, setLang] = useState<"VN" | "EN">("VN");
  const storeStatus = useStoreStatus();

  const [settings, setSettings] = useState({
    isOpen: true,
    statusText: "Quán đang mở cửa đón khách",
    hoursWeekday: "07:00 - 18:00",
    hoursWeekend: "07:00 - 22:00",
    hotline1: "038 285 1688",
    topBanner: "🌿 Chào mừng đến với Cẩm Cù House • Giờ mở cửa: T2 - T5 (07:00 - 18:00) | T6 - CN (07:00 - 22:00)",
  });
  const [announcements, setAnnouncements] = useState<SharedAnnouncement[]>([]);

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

  // Status badge color helpers
  const getDotColor = () => {
    if (storeStatus.badgeType === "open") return "bg-emerald-400";
    if (storeStatus.badgeType === "closing_soon") return "bg-amber-400";
    return "bg-rose-400";
  };

  const getPillDotColor = () => {
    if (storeStatus.badgeType === "open") return "bg-emerald-500";
    if (storeStatus.badgeType === "closing_soon") return "bg-amber-500";
    return "bg-rose-500";
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-[#F9F8F3]/95 dark:bg-[#121A15]/95 backdrop-blur-md border-b border-stone-200/80 dark:border-stone-800/80 shadow-[0_2px_12px_rgba(37,51,38,0.04)] transition-colors duration-300">
      {/* Top Announcement Bar */}
      <div className="w-full bg-[#2D4233] dark:bg-[#16231A] text-stone-200 text-[11px] sm:text-xs py-1.5 px-4 border-b border-stone-800/20 dark:border-stone-800/60">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-hidden truncate">
            <span className="bg-[#3E5C46] px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider text-emerald-200 shrink-0">
              {pinnedNews ? "Bảng Tin Quán" : "Giờ Mở Cửa (GMT+7)"}
            </span>
            <span className="truncate font-medium">
              {pinnedNews
                ? `${pinnedNews.title}: ${pinnedNews.content}`
                : storeStatus.badgeText}
            </span>
          </div>

          <div className="hidden md:flex items-center gap-3 shrink-0 text-stone-300">
            <span className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${getDotColor()} ${storeStatus.isOpen ? "animate-pulse" : ""}`} />
              <span className="font-semibold text-white">
                {storeStatus.shortBadge}
              </span>
            </span>
            <span>•</span>
            <span className="text-stone-300 font-medium">
              {storeStatus.scheduleText}
            </span>
          </div>
        </div>
      </div>

      {/* Main Header Container */}
      <div className="h-16 sm:h-20 w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <Link href="/" className="flex items-center gap-3 shrink-0 group">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#3E5C46]/10 dark:bg-[#88B795]/15 flex items-center justify-center text-[#3E5C46] dark:text-[#88B795] group-hover:bg-[#3E5C46] group-hover:text-white dark:group-hover:bg-[#88B795] dark:group-hover:text-[#121A15] transition-all duration-300 shadow-sm">
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-current animate-pulse" />
          </div>
          <div className="flex flex-col">
            <span className="font-serif text-lg sm:text-2xl font-bold text-[#3E5C46] dark:text-[#F5F4EE] tracking-tight group-hover:text-[#2D4233] dark:group-hover:text-[#88B795] transition-colors">
              Cẩm Cù House
            </span>
            <span className="text-[10px] sm:text-xs text-stone-600 dark:text-stone-400 font-medium tracking-wide">
              coffee &amp; Food • Gia Nghĩa
            </span>
          </div>
          
          {/* Quick Realtime Hours Pill */}
          <div className="hidden xl:flex items-center gap-1.5 ml-2 px-3 py-1 bg-stone-100 dark:bg-[#1E2B22] rounded-full text-stone-700 dark:text-stone-300 text-xs border border-stone-200/60 dark:border-stone-700/60 shadow-sm transition-colors">
            <Clock className="w-3.5 h-3.5 text-[#396663] dark:text-[#88B795]" />
            <span className="flex items-center gap-1.5">
              <span className={`w-1.5 h-1.5 rounded-full ${getPillDotColor()} ${storeStatus.isOpen ? "animate-pulse" : ""}`} />
              <span className="font-semibold">{storeStatus.shortBadge}</span>
            </span>
          </div>
        </Link>

        {/* Desktop Navigation - Centered */}
        <nav className="hidden lg:flex items-center gap-1 p-1 bg-stone-100/90 dark:bg-[#1E2B22]/90 rounded-full border border-stone-200/70 dark:border-stone-700/60 shadow-inner">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 ${
                  isActive
                    ? "bg-[#3E5C46] dark:bg-[#2D4233] text-white shadow-sm font-bold"
                    : "text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white hover:bg-stone-200/60 dark:hover:bg-white/10"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Actions Deck */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Theme Toggle Button (Light / Dark) */}
          <ThemeToggle />

          {/* Language Toggle */}
          <div className="hidden sm:inline-flex items-center bg-stone-100 dark:bg-[#1E2B22] rounded-full p-0.5 text-xs font-semibold text-stone-600 dark:text-stone-300 border border-stone-200/60 dark:border-stone-700/60">
            <button
              type="button"
              onClick={() => setLang("VN")}
              className={`px-2.5 py-1 rounded-full transition-all ${
                lang === "VN"
                  ? "bg-white dark:bg-[#2D4233] text-[#3E5C46] dark:text-[#F5F4EE] shadow-sm font-bold"
                  : "hover:text-stone-900 dark:hover:text-white"
              }`}
            >
              VN
            </button>
            <button
              type="button"
              onClick={() => setLang("EN")}
              className={`px-2.5 py-1 rounded-full transition-all ${
                lang === "EN"
                  ? "bg-white dark:bg-[#2D4233] text-[#3E5C46] dark:text-[#F5F4EE] shadow-sm font-bold"
                  : "hover:text-stone-900 dark:hover:text-white"
              }`}
            >
              EN
            </button>
          </div>

          {/* Hotline CTA */}
          <a
            href={`tel:${settings.hotline1.replace(/\s+/g, "")}`}
            className="inline-flex items-center justify-center gap-2 px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-full bg-[#3E5C46] hover:bg-[#2D4233] text-white text-xs sm:text-sm font-semibold transition-all shadow-[0_4px_14px_rgba(62,92,70,0.25)] hover:-translate-y-0.5 shrink-0"
          >
            <PhoneCall className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-bounce" />
            <span className="hidden sm:inline">Gọi Hotline:</span>
            <span>{settings.hotline1}</span>
          </a>

          {/* Admin link */}
          <a
            href="https://admin.camcuhouse.online"
            title="Quản trị viên (admin.camcuhouse.online)"
            className="w-9 h-9 sm:w-10 sm:h-10 min-w-[36px] min-h-[36px] rounded-full bg-[#3E5C46] hover:bg-[#2D4233] text-white flex items-center justify-center shrink-0 shadow-sm transition-transform hover:scale-105"
          >
            <User className="w-4 h-4" />
          </a>

          {/* Mobile Menu Button (Min 44px) */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden w-10 h-10 min-w-[40px] min-h-[40px] flex items-center justify-center rounded-full bg-stone-100 dark:bg-[#1E2B22] text-stone-800 dark:text-stone-200 hover:bg-stone-200 dark:hover:bg-[#2A3B30] transition-colors border border-stone-200 dark:border-stone-700/60"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-[#F9F8F3] dark:bg-[#121A15] border-b border-stone-200 dark:border-stone-800 px-6 py-5 flex flex-col gap-3.5 shadow-xl overflow-hidden"
          >
            {/* Realtime Status Bar in Mobile Drawer */}
            <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-800 text-xs text-stone-600 dark:text-stone-300">
              <span className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${getPillDotColor()} ${storeStatus.isOpen ? "animate-pulse" : ""}`} />
                <span className="font-bold text-stone-900 dark:text-white">
                  {storeStatus.badgeText}
                </span>
              </span>
              <span className="hidden sm:flex items-center gap-1 font-semibold text-[#3E5C46] dark:text-[#88B795]">
                <MapPin className="w-3.5 h-3.5" />
                Gia Nghĩa
              </span>
            </div>

            {/* Mobile Nav Links */}
            <div className="flex flex-col gap-1 pt-1">
              {NAV_LINKS.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-4 py-3 min-h-[44px] flex items-center rounded-xl text-sm font-semibold transition-all ${
                      isActive
                        ? "bg-[#3E5C46] text-white"
                        : "text-stone-800 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800/60"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>

            {/* Theme Toggle & Language in Mobile */}
            <div className="pt-3 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs text-stone-500 dark:text-stone-400 font-medium">Giao diện:</span>
                <ThemeToggle showLabel />
              </div>
              <div className="inline-flex items-center bg-stone-100 dark:bg-[#1E2B22] rounded-full p-0.5 text-xs font-semibold text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-700/60">
                <button
                  type="button"
                  onClick={() => setLang("VN")}
                  className={`px-3 py-1.5 rounded-full ${lang === "VN" ? "bg-white dark:bg-[#2D4233] text-[#3E5C46] dark:text-white shadow-sm font-bold" : ""}`}
                >
                  VN
                </button>
                <button
                  type="button"
                  onClick={() => setLang("EN")}
                  className={`px-3 py-1.5 rounded-full ${lang === "EN" ? "bg-white dark:bg-[#2D4233] text-[#3E5C46] dark:text-white shadow-sm font-bold" : ""}`}
                >
                  EN
                </button>
              </div>
            </div>

            {/* Action buttons */}
            <div className="pt-2 flex flex-col sm:flex-row gap-2">
              <a
                href={`tel:${settings.hotline1.replace(/\s+/g, "")}`}
                className="w-full min-h-[44px] flex items-center justify-center gap-2 py-3 rounded-full bg-[#3E5C46] text-white text-sm font-semibold shadow-md active:scale-95 transition-transform"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Gọi Hotline: {settings.hotline1}</span>
              </a>
              <a
                href="https://maps.google.com/?q=Hem+437+Hung+Vuong+Nghia+Trung+Gia+Nghia+Dak+Nong"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full min-h-[44px] flex items-center justify-center gap-2 py-3 rounded-full bg-stone-100 dark:bg-[#1E2B22] text-[#3E5C46] dark:text-[#88B795] text-sm font-semibold hover:bg-stone-200 dark:hover:bg-[#25362B] border border-stone-200 dark:border-stone-700/60"
              >
                <MapPin className="w-4 h-4 text-[#396663] dark:text-[#88B795]" />
                <span>Mở Google Maps</span>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
