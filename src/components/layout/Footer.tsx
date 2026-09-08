"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { MapPin, Phone, Mail, Clock, Compass, ArrowUpRight } from "lucide-react";

const GOOGLE_MAPS_URL =
  "https://maps.google.com/?cid=10605553198031545365&q=C%E1%BA%A9m+C%C3%B9+House";

// Social Icons
const TiktokIcon = ({ size = 24, className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5v3a3 3 0 0 1-3-3v11a7 7 0 0 1-7-7z" />
  </svg>
);

const FacebookIcon = ({ size = 24, className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const YoutubeIcon = ({ size = 24, className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
    <path d="m10 15 5-3-5-3z" />
  </svg>
);

export default function Footer() {
  const pathname = usePathname() || "";
  const { t } = useLanguage();

  if (pathname.startsWith("/admin") || pathname.startsWith("/wp-admin")) {
    return null;
  }

  return (
    <footer className="w-full bg-[#0C0D0B]/95 text-[#FDFBF7] pt-16 pb-12 px-6 sm:px-12 font-sans border-t border-[#222520] relative z-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 sm:gap-12">
        {/* CỘT 1: THƯƠNG HIỆU */}
        <div className="space-y-4">
          <Link href="/" className="inline-block">
            <span className="font-serif text-3xl font-bold text-[#FDFBF7] tracking-tight hover:text-[#C88A4B] transition-colors">
              Cẩm Cù House
            </span>
            <span className="block text-xs font-sans uppercase tracking-[0.25em] text-[#C88A4B] mt-0.5">
              Coffee &amp; Food • Gia Nghĩa
            </span>
          </Link>

          <p className="text-xs sm:text-sm font-light text-[#FDFBF7]/70 leading-relaxed">
            {t("footer.slogan")}
          </p>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1A1D17] border border-[#222520] text-[11px] font-mono text-[#C88A4B]">
            <Compass size={13} />
            <span>{t("footer.coords")}</span>
          </div>

          <div className="flex items-center gap-4 pt-2">
            <a
              href="https://www.facebook.com/share/1DVLMySW8H/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-[#1A1D17] border border-[#222520] flex items-center justify-center text-[#FDFBF7]/80 hover:text-[#C88A4B] hover:border-[#C88A4B] transition-all"
              aria-label="Facebook"
            >
              <FacebookIcon size={18} />
            </a>
            <a
              href="https://www.tiktok.com/@camcuhousedaknong"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-[#1A1D17] border border-[#222520] flex items-center justify-center text-[#FDFBF7]/80 hover:text-[#C88A4B] hover:border-[#C88A4B] transition-all"
              aria-label="TikTok"
            >
              <TiktokIcon size={18} />
            </a>
            <a
              href="https://youtube.com/@Cam_Cu_House"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-[#1A1D17] border border-[#222520] flex items-center justify-center text-[#FDFBF7]/80 hover:text-[#C88A4B] hover:border-[#C88A4B] transition-all"
              aria-label="YouTube"
            >
              <YoutubeIcon size={18} />
            </a>
          </div>
        </div>

        {/* CỘT 2: ĐIỀU HƯỚNG NHANH */}
        <div className="space-y-4">
          <h4 className="font-serif text-lg font-semibold text-[#FDFBF7] tracking-wide border-b border-[#222520] pb-2">
            {t("footer.explore")}
          </h4>
          <ul className="space-y-2.5 text-xs sm:text-sm font-light text-[#FDFBF7]/75">
            <li>
              <Link href="/" className="hover:text-[#C88A4B] transition-colors">
                {t("nav.home")}
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-[#C88A4B] transition-colors">
                {t("nav.about")}
              </Link>
            </li>
            <li>
              <Link href="/space" className="hover:text-[#C88A4B] transition-colors">
                {t("nav.space")}
              </Link>
            </li>
            <li>
              <Link href="/menu" className="hover:text-[#C88A4B] transition-colors">
                {t("nav.menu")}
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-[#C88A4B] transition-colors">
                {t("nav.contact")}
              </Link>
            </li>
          </ul>
        </div>

        {/* CỘT 3: THỜI GIAN & LIÊN HỆ */}
        <div className="space-y-4">
          <h4 className="font-serif text-lg font-semibold text-[#FDFBF7] tracking-wide border-b border-[#222520] pb-2">
            {t("footer.contactHours")}
          </h4>
          <div className="space-y-3 text-xs sm:text-sm font-light text-[#FDFBF7]/75">
            <div className="flex items-start gap-2.5">
              <Clock size={15} className="text-[#C88A4B] shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-[#FDFBF7]">{t("contact.hoursTitle")}:</p>
                <p className="text-xs text-[#FDFBF7]/60">{t("footer.hours1")}</p>
                <p className="text-xs text-[#FDFBF7]/60">{t("footer.hours2")}</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 pt-1">
              <Phone size={15} className="text-[#C88A4B] shrink-0" />
              <div className="flex items-center gap-2">
                <a href="tel:0382851688" className="hover:text-[#C88A4B] transition-colors">
                  038 285 1688
                </a>
                <span>/</span>
                <a href="tel:0774659000" className="hover:text-[#C88A4B] transition-colors">
                  077 465 9000
                </a>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <Mail size={15} className="text-[#C88A4B] shrink-0" />
              <a href="mailto:thuynhu8788@gmail.com" className="hover:text-[#C88A4B] transition-colors break-all">
                thuynhu8788@gmail.com
              </a>
            </div>
          </div>
        </div>

        {/* CỘT 4: ĐỊA CHỈ & BẢN ĐỒ THU NHỎ */}
        <div className="space-y-4">
          <h4 className="font-serif text-lg font-semibold text-[#FDFBF7] tracking-wide border-b border-[#222520] pb-2">
            {t("footer.location")}
          </h4>
          <div className="flex items-start gap-2.5 text-xs sm:text-sm font-light text-[#FDFBF7]/75">
            <MapPin size={16} className="text-[#C88A4B] shrink-0 mt-0.5" />
            <p>{t("contact.addressDesc")}</p>
          </div>

          <div className="pt-2">
            <a
              href={GOOGLE_MAPS_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1A1D17] hover:bg-[#C88A4B] hover:text-[#0C0D0B] transition-all text-xs font-medium text-[#FDFBF7] border border-[#222520]"
            >
              <span>{t("footer.viewMap")}</span>
              <ArrowUpRight size={14} />
            </a>
          </div>
        </div>
      </div>

      {/* BẢN QUYỀN */}
      <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-[#222520] flex flex-col sm:flex-row items-center justify-between text-xs text-[#FDFBF7]/50 gap-3">
        <p>{t("footer.rights")}</p>
        <p className="text-[11px] font-mono text-[#C88A4B]">
          {t("footer.awwwards")}
        </p>
      </div>
    </footer>
  );
}
