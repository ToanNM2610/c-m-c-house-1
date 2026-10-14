"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CAMCU_CONFIG, getStoreStatus } from "@/config/camcuData";
import { HoyaStarIcon, OrganicWaveDivider } from "./OrganicElements";

const NAV_LINKS = [
  { href: "/", labelVn: "Trang Chủ", labelEn: "Home" },
  { href: "/cau-chuyen", labelVn: "Câu Chuyện", labelEn: "Our Story" },
  { href: "/khong-gian", labelVn: "Không Gian Suối", labelEn: "Stream Space" },
  { href: "/thuc-don", labelVn: "Thực Đơn", labelEn: "Menu" },
  { href: "/lien-he", labelVn: "Chỉ Đường & Liên Hệ", labelEn: "Visit Us" },
];

export function MorningHeader() {
  const pathname = usePathname();
  const [status, setStatus] = useState(() => getStoreStatus());
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [lang, setLang] = useState<"VN" | "EN">("VN");
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setStatus(getStoreStatus()), 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let prevY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 36);
      setHidden(y > 140 && y > prevY);
      prevY = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-transform duration-500 ${
        hidden && !mobileOpen ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      {/* 1. Thanh trên cùng 13px - Nơi duy nhất hiển thị trạng thái (Mục A7.1) */}
      <div className="border-b border-[var(--line)] bg-[var(--mist)]/95 text-[13px] font-medium text-[var(--forest)] backdrop-blur-md [data-theme='dark']_&:text-[var(--ink)]">
        <div className="mx-auto flex max-w-[1240px] items-center justify-between px-5 py-2 lg:px-12">
          <p className="flex items-center gap-2">
            <span
              className={`h-2 w-2 rounded-full ${
                status.isOpen ? "bg-[var(--clay)]" : "bg-[var(--ink-muted)]"
              }`}
            />
            <span>
              {status.isOpen
                ? `Đang mở cửa · Đóng lúc ${status.closeLabel} hôm nay · 23°C`
                : "Đã đóng cửa · Mở lúc 07:00 sáng mai · 23°C"}
            </span>
          </p>
          <p className="h6-label hidden md:block">
            {CAMCU_CONFIG.location.coordinates.display} · {CAMCU_CONFIG.location.altitude}
          </p>
        </div>
      </div>

      {/* 2. Thanh điều hướng chính (Mục A7.2) */}
      <div
        className={`transition-all duration-500 ${
          scrolled
            ? "border-b border-[var(--line)] bg-[var(--cream)]/90 text-[var(--ink)] shadow-sm backdrop-blur-xl"
            : "bg-transparent text-[#FAF6EE]"
        }`}
      >
        <div className="mx-auto flex h-20 max-w-[1240px] items-center justify-between px-5 lg:px-12">
          <Link href="/" className="flex items-center gap-3">
            <HoyaStarIcon size={28} />
            <span className="font-[var(--font-fraunces)] text-[26px] font-medium tracking-tight">
              Cẩm{"\u00A0"}Cù House
            </span>
          </Link>

          <nav className="hidden items-center gap-7 lg:flex" aria-label="Điều hướng chính">
            {NAV_LINKS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="relative flex items-center gap-2 py-2 text-[16px] font-medium transition-opacity hover:opacity-80"
                >
                  {isActive && (
                    <span
                      aria-hidden="true"
                      className="h-2 w-2 rounded-full bg-[var(--clay)]"
                    />
                  )}
                  <span>{lang === "VN" ? item.labelVn : item.labelEn}</span>
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setLang(lang === "VN" ? "EN" : "VN")}
              className="flex h-12 min-w-[48px] items-center justify-center rounded-full border border-current/25 px-3.5 text-[13px] font-semibold"
              aria-label="Đổi ngôn ngữ VN / EN"
            >
              {lang}
            </button>

            <button
              type="button"
              onClick={toggleTheme}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-current/25"
              aria-label="Đổi chế độ Sáng / Đêm bên suối"
            >
              {theme === "light" ? "☀" : "☾"}
            </button>

            <a
              href={`tel:${CAMCU_CONFIG.contact.hotlinePrimary.replace(/\s+/g, "")}`}
              className="btn-clay-pill"
            >
              <span>Gọi ngay</span>
              <span aria-hidden="true">→</span>
            </a>

            <button
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-current/25 lg:hidden"
              aria-label="Mở menu"
            >
              {mobileOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>
      </div>

      {/* 3. Menu Mobile toàn màn hình nền kem, 5 liên kết Fraunces 40px (Mục A7.3) */}
      {mobileOpen && (
        <div className="fixed inset-0 z-30 flex flex-col justify-between bg-[var(--cream)] px-6 pb-24 pt-36 text-[var(--ink)] lg:hidden">
          <nav className="flex flex-col gap-4">
            {NAV_LINKS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="font-[var(--font-fraunces)] text-[40px] font-medium leading-tight text-[var(--ink)] hover:text-[var(--clay)]"
              >
                {lang === "VN" ? item.labelVn : item.labelEn}
              </Link>
            ))}
          </nav>

          <div className="grid grid-cols-3 gap-3 border-t border-[var(--line)] pt-5">
            <a
              href={`tel:${CAMCU_CONFIG.contact.hotlinePrimary.replace(/\s+/g, "")}`}
              className="rounded-full bg-[var(--clay)] py-3.5 text-center font-semibold text-white"
            >
              Gọi
            </a>
            <a
              href={CAMCU_CONFIG.contact.zaloUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-[var(--forest)] py-3.5 text-center font-semibold"
            >
              Zalo
            </a>
            <Link
              href="/lien-he"
              onClick={() => setMobileOpen(false)}
              className="rounded-full border border-[var(--forest)] py-3.5 text-center font-semibold"
            >
              Chỉ đường
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

export function MorningFooter() {
  return (
    <div className="mt-16">
      <OrganicWaveDivider fill="var(--forest)" />
      <footer className="bg-[var(--forest)] pb-20 pt-14 text-[#FAF6EE] md:pb-12">
        <div className="mx-auto max-w-[1240px] px-5 lg:px-12">
          {/* Khẩu hiệu Fraunces 40px (Mục A7.7) */}
          <p className="font-[var(--font-fraunces)] text-[clamp(28px,4vw,40px)] font-medium leading-snug text-[#FAF6EE]">
            “Chốn Dừng Chân Mộc{"\u00A0"}Mạc{" "}
            <span className="italic text-[var(--sun)]">Bên Bờ Suối Đá</span>”
          </p>

          {/* 4 cột chữ 16px */}
          <div className="mt-12 grid grid-cols-1 gap-10 border-y border-[#FAF6EE]/15 py-12 text-[16px] md:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="h6-label text-[var(--sun)]">Thương hiệu & Tọa độ</p>
              <p className="mt-3 font-[var(--font-fraunces)] text-2xl">
                Cẩm{"\u00A0"}Cù House
              </p>
              <p className="mt-2 text-[#FAF6EE]/80">
                {CAMCU_CONFIG.location.coordinates.display} · Cao độ{" "}
                {CAMCU_CONFIG.location.altitude}
              </p>
            </div>

            <div>
              <p className="h6-label text-[var(--sun)]">Điều hướng</p>
              <ul className="mt-3 space-y-2.5">
                {NAV_LINKS.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="hover:text-[var(--sun)]">
                      {l.labelVn}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="h6-label text-[var(--sun)]">Giờ mở cửa & Hotline</p>
              <p className="mt-3">{CAMCU_CONFIG.hours.monToThu.label}</p>
              <p className="mt-1">{CAMCU_CONFIG.hours.friToSun.label}</p>
              <p className="mt-4 font-semibold text-[var(--sun)]">
                Hotline / Zalo: {CAMCU_CONFIG.contact.hotlinePrimary}
              </p>
              <p className="mt-1 text-[#FAF6EE]/80">
                Số phụ: {CAMCU_CONFIG.contact.hotlineSecondary}
              </p>
            </div>

            <div>
              <p className="h6-label text-[var(--sun)]">Địa chỉ & Kết nối</p>
              <p className="mt-3 leading-relaxed text-[#FAF6EE]/90">
                {CAMCU_CONFIG.location.address}
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <a href="#facebook" className="underline underline-offset-4">Facebook</a>
                <a href="#tiktok" className="underline underline-offset-4">TikTok</a>
                <a href="#youtube" className="underline underline-offset-4">YouTube</a>
                <a
                  href="https://maps.google.com/?q=11.99,107.69"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-4"
                >
                  Google Maps
                </a>
              </div>
            </div>
          </div>

          {/* Chữ "Cẩm Cù House" khổng lồ mờ .08 ở đáy (Mục A7.7) */}
          <div
            aria-hidden="true"
            className="mt-10 select-none text-center font-[var(--font-fraunces)] text-[clamp(48px,13vw,180px)] font-medium leading-none text-[#FAF6EE] opacity-[0.08]"
          >
            Cẩm{"\u00A0"}Cù House
          </div>

          <div className="mt-6 flex flex-col items-center justify-between gap-4 text-[15px] text-[#FAF6EE]/75 sm:flex-row">
            <p>© {new Date().getFullYear()} Cẩm{"\u00A0"}Cù House · Gia{"\u00A0"}Nghĩa, Đắk{"\u00A0"}Nông.</p>
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="rounded-full border border-[#FAF6EE]/25 px-5 py-2 hover:bg-[#FAF6EE]/10"
            >
              ↑ Lên đầu trang
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
