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
  Volume2
} from "lucide-react";

const NAV_LINKS = [
  { href: "/", label: "Trang Chủ" },
  { href: "/about", label: "Giới Thiệu" },
  { href: "/space", label: "Không Gian Suối" },
  { href: "/menu", label: "Thực Đơn" },
  { href: "/contact", label: "Chỉ Đường & Liên Hệ" },
];

import {
  CAMCU_SETTINGS_KEY,
  CAMCU_ANNOUNCEMENTS_KEY,
  getStoredData,
} from "@/utils/storage";

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [lang, setLang] = useState<"VN" | "EN">("VN");

  const [settings, setSettings] = useState({
    isOpen: true,
    statusText: "Quán đang mở cửa đón khách",
    hoursWeekday: "07:00 - 18:00",
    hoursWeekend: "07:00 - 22:00",
    hotline1: "038 285 1688",
    topBanner: "🌿 Chào mừng đến với Cẩm Cù House • Giờ mở cửa: T2 - T5 (07:00 - 18:00) | T6 - CN (07:00 - 22:00)",
  });
  const [latestAnnouncement, setLatestAnnouncement] = useState<{ title: string; content: string } | null>(null);

  useEffect(() => {
    // 1. Immediately hydrate from LocalStorage & Shared Cookie to survive F5
    const storedSettings = getStoredData<typeof settings | null>(CAMCU_SETTINGS_KEY, null);
    if (storedSettings) {
      setSettings((prev) => ({ ...prev, ...storedSettings }));
    }

    const storedAnnouncements = getStoredData<Array<{ title: string; content: string }>>(
      CAMCU_ANNOUNCEMENTS_KEY,
      []
    );
    if (storedAnnouncements.length > 0) {
      setLatestAnnouncement(storedAnnouncements[0]);
    }

    // 2. Fetch server updates
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
          if (aData.announcements && aData.announcements.length > 0) {
            setLatestAnnouncement(aData.announcements[0]);
          }
        }
      } catch (e) {
        // Fallback gracefully
      }
    }
    loadData();
  }, []);

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-[#F9F8F3]/95 backdrop-blur-md border-b border-stone-200/80 shadow-[0_2px_12px_rgba(37,51,38,0.04)] transition-all">
      {/* Top Announcement Bar */}
      <div className="w-full bg-[#2D4233] text-stone-200 text-[11px] sm:text-xs py-1.5 px-4 border-b border-stone-800/20">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-hidden truncate">
            <span className="bg-[#3E5C46] px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider text-emerald-200 shrink-0">
              Bảng Tin Quán
            </span>
            <span className="truncate font-medium">
              {latestAnnouncement
                ? `${latestAnnouncement.title}: ${latestAnnouncement.content}`
                : settings.topBanner}
            </span>
          </div>

          <div className="hidden md:flex items-center gap-3 shrink-0 text-stone-300">
            <span className="flex items-center gap-1.5">
              <span
                className={`w-2 h-2 rounded-full ${
                  settings.isOpen ? "bg-emerald-400 animate-pulse" : "bg-rose-400"
                }`}
              />
              <span className="font-semibold text-white">
                {settings.isOpen ? "Cửa hàng Đang mở" : "Cửa hàng Tạm nghỉ"}
              </span>
            </span>
            <span>•</span>
            <span>
              T2-T5: {settings.hoursWeekday} | T6-CN: {settings.hoursWeekend}
            </span>
          </div>
        </div>
      </div>

      {/* Main Header Container */}
      <div className="h-16 sm:h-20 w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <Link href="/" className="flex items-center gap-3 shrink-0 group">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#3E5C46]/10 flex items-center justify-center text-[#3E5C46] group-hover:bg-[#3E5C46] group-hover:text-white transition-all duration-300 shadow-sm">
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-current animate-pulse" />
          </div>
          <div className="flex flex-col">
            <span className="font-serif text-lg sm:text-2xl font-bold text-[#3E5C46] tracking-tight group-hover:text-[#2D4233] transition-colors">
              Cẩm Cù House
            </span>
            <span className="text-[10px] sm:text-xs text-stone-600 font-medium tracking-wide">
              coffee &amp; Food • Gia Nghĩa
            </span>
          </div>
          {/* Quick Hours Pill */}
          <div className="hidden xl:flex items-center gap-1.5 ml-2 px-3 py-1 bg-stone-100 rounded-full text-stone-600 text-xs border border-stone-200/60 shadow-sm">
            <Clock className="w-3.5 h-3.5 text-[#396663]" />
            <span className="flex items-center gap-1.5">
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  settings.isOpen ? "bg-emerald-500" : "bg-rose-500"
                }`}
              />
              <span>{settings.isOpen ? "Đang mở cửa" : "Tạm nghỉ"}</span>
            </span>
          </div>
        </Link>

        {/* Desktop Navigation - Centered */}
        <nav className="hidden lg:flex items-center gap-1 p-1 bg-stone-100/90 rounded-full border border-stone-200/70 shadow-inner">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 ${
                  isActive
                    ? "bg-[#3E5C46] text-white shadow-sm"
                    : "text-stone-600 hover:text-stone-900 hover:bg-stone-200/60"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Actions Deck */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Language Toggle */}
          <div className="hidden sm:inline-flex items-center bg-stone-100 rounded-full p-0.5 text-xs font-semibold text-stone-600 border border-stone-200/60">
            <button
              type="button"
              onClick={() => setLang("VN")}
              className={`px-2.5 py-1 rounded-full transition-all ${
                lang === "VN"
                  ? "bg-white text-[#3E5C46] shadow-sm font-bold"
                  : "hover:text-stone-900"
              }`}
            >
              VN
            </button>
            <button
              type="button"
              onClick={() => setLang("EN")}
              className={`px-2.5 py-1 rounded-full transition-all ${
                lang === "EN"
                  ? "bg-white text-[#3E5C46] shadow-sm font-bold"
                  : "hover:text-stone-900"
              }`}
            >
              EN
            </button>
          </div>

          {/* Hotline CTA */}
          <a
            href={`tel:${settings.hotline1.replace(/\s+/g, "")}`}
            className="inline-flex items-center justify-center gap-2 px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-full bg-[#3E5C46] text-white text-xs sm:text-sm font-semibold hover:bg-[#2D4233] transition-all shadow-[0_4px_14px_rgba(62,92,70,0.25)] hover:-translate-y-0.5 shrink-0"
          >
            <PhoneCall className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-bounce" />
            <span className="hidden sm:inline">Gọi Hotline:</span>
            <span>{settings.hotline1}</span>
          </a>

          {/* Admin link */}
          <a
            href="https://admin.camcuhouse.online"
            title="Quản trị viên (admin.camcuhouse.online)"
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#3E5C46] hover:bg-[#2D4233] text-white flex items-center justify-center shrink-0 shadow-sm transition-transform hover:scale-105"
          >
            <User className="w-4 h-4" />
          </a>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-full bg-stone-100 text-stone-800 hover:bg-stone-200 transition-colors border border-stone-200"
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
            className="lg:hidden bg-[#F9F8F3] border-b border-stone-200 px-6 py-5 flex flex-col gap-3 shadow-xl overflow-hidden"
          >
            <div className="flex items-center justify-between pb-3 border-b border-stone-200 text-xs text-stone-600">
              <span className="flex items-center gap-1.5">
                <span
                  className={`w-2 h-2 rounded-full ${
                    settings.isOpen ? "bg-emerald-500" : "bg-rose-500"
                  }`}
                />
                <span className="font-bold text-stone-800">
                  {settings.isOpen ? "Cửa hàng Đang mở" : "Cửa hàng Tạm nghỉ"}
                </span>
              </span>
              <span className="flex items-center gap-1 font-semibold text-[#3E5C46]">
                <MapPin className="w-3.5 h-3.5" />
                Gia Nghĩa, Đắk Nông
              </span>
            </div>

            <div className="flex flex-col gap-1.5 pt-2">
              {NAV_LINKS.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                      isActive
                        ? "bg-[#3E5C46] text-white"
                        : "text-stone-800 hover:bg-stone-100"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>

            <div className="pt-3 border-t border-stone-200 flex flex-col sm:flex-row gap-2">
              <a
                href={`tel:${settings.hotline1.replace(/\s+/g, "")}`}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-full bg-[#3E5C46] text-white text-sm font-semibold shadow-md"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Gọi Hotline: {settings.hotline1}</span>
              </a>
              <a
                href="https://maps.google.com/?q=Hem+437+Hung+Vuong+Nghia+Trung+Gia+Nghia+Dak+Nong"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-3 rounded-full bg-stone-100 text-[#3E5C46] text-sm font-semibold hover:bg-stone-200"
              >
                <MapPin className="w-4 h-4 text-[#396663]" />
                <span>Mở Google Maps</span>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
