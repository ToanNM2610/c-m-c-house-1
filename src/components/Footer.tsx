"use client";

import Link from "next/link";
import { 
  MapPin, 
  Clock, 
  PhoneCall, 
  Mail, 
  Share2, 
  Sparkles, 
  Navigation,
  ArrowUp
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function Footer() {
  const { locale, dict } = useLanguage();
  const isEn = locale === "en";

  return (
    <footer className="w-full bg-[#121A15] text-[#F3EBD8] pt-[72px] pb-6 border-t border-[#F3EBD8]/10 relative overflow-hidden">
      <div className="container-unified mb-12">
        {/* 4-Column Grid: 1.4fr 1fr 1fr 1.2fr, gap 48px on desktop, 1 col gap 32px on mobile */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr] gap-8 lg:gap-[48px]">
          {/* Col 1: Logo + Description (16px, max 38ch) + Coordinates */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-[#2D4233] text-[#88B795] flex items-center justify-center shrink-0 shadow-sm">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="font-serif text-2xl font-bold text-[#F3EBD8] tracking-tight">
                Cẩm Cù House
              </span>
            </div>
            <p className="text-[16px] text-[#F3EBD8]/75 leading-relaxed max-w-[38ch]">
              {isEn
                ? "An eco-friendly coffee & dining sanctuary nestled beside a cool natural stream in the Dak Nong highlands."
                : "Khu ẩm thực & cà phê sinh thái bên dòng suối mát lành miền cao nguyên Đắk Nông. Chốn dừng chân mộc mạc."}
            </p>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#16231A] rounded-full text-[#88B795] text-[13px] font-medium w-fit border border-[#F3EBD8]/10">
              <MapPin className="w-3.5 h-3.5 text-[#88B795]" />
              <span>11.99° N, 107.69° E • Gia Nghĩa</span>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div className="flex flex-col gap-3.5">
            <span className="text-[12px] font-bold text-[#88B795] tracking-[0.14em] uppercase">
              {dict.contact.quickLinksTitle}
            </span>
            <nav className="flex flex-col gap-3 text-[16px] text-[#F3EBD8]/80">
              <Link href="/" className="hover:text-[#CC7755] hover:underline transition-colors w-fit">
                {dict.nav.home}
              </Link>
              <Link href="/about" className="hover:text-[#CC7755] hover:underline transition-colors w-fit">
                {dict.nav.about}
              </Link>
              <Link href="/space" className="hover:text-[#CC7755] hover:underline transition-colors w-fit">
                {dict.nav.space}
              </Link>
              <Link href="/menu" className="hover:text-[#CC7755] hover:underline transition-colors w-fit">
                {dict.nav.menu}
              </Link>
              <Link href="/contact" className="hover:text-[#CC7755] hover:underline transition-colors w-fit">
                {dict.nav.contact}
              </Link>
            </nav>
          </div>

          {/* Col 3: Opening Hours */}
          <div className="flex flex-col gap-3.5">
            <span className="text-[12px] font-bold text-[#88B795] tracking-[0.14em] uppercase">
              {dict.contact.openingHoursTitle}
            </span>
            <div className="flex flex-col gap-2.5 text-[15px] sm:text-[16px] text-[#F3EBD8]/80">
              <div className="flex items-center gap-2 font-semibold text-[#F3EBD8]">
                <Clock className="w-4 h-4 text-[#88B795]" />
                <span>{isEn ? "Service Hours" : "Thời gian phục vụ"}</span>
              </div>
              <p className="text-[14px] text-[#F3EBD8]/70 leading-snug">
                <strong className="text-[#F3EBD8] font-medium">{isEn ? "Mon - Thu:" : "Thứ 2 - Thứ 5:"}</strong><br />
                07:00 – 18:00
              </p>
              <p className="text-[14px] text-[#F3EBD8]/70 leading-snug">
                <strong className="text-[#88B795] font-medium">{isEn ? "Fri - Sun:" : "Thứ 6 - Chủ Nhật:"}</strong><br />
                07:00 – 22:00
              </p>
            </div>
          </div>

          {/* Col 4: Address, Hotline, Email, Social */}
          <div className="flex flex-col gap-3.5">
            <span className="text-[12px] font-bold text-[#88B795] tracking-[0.14em] uppercase">
              {dict.contact.addressTitle}
            </span>
            <p className="text-[15px] text-[#F3EBD8]/75 leading-relaxed">
              {dict.common.addressFull}
            </p>

            <div className="flex flex-col gap-1 text-[15px] sm:text-[16px]">
              <a href="tel:0382851688" className="hover:text-[#CC7755] hover:underline transition-colors flex items-center gap-2 text-[#F3EBD8]">
                <PhoneCall className="w-4 h-4 text-[#CC7755]" />
                <span>038 285 1688 (Zalo)</span>
              </a>
              <a href="tel:0774659000" className="hover:text-[#CC7755] hover:underline transition-colors flex items-center gap-2 text-[#F3EBD8]">
                <PhoneCall className="w-4 h-4 text-[#CC7755]" />
                <span>077 465 9000</span>
              </a>
            </div>

            <a 
              href="mailto:thuynhu8788@gmail.com" 
              className="text-[14px] text-[#F3EBD8]/75 hover:text-[#CC7755] hover:underline flex items-center gap-2"
            >
              <Mail className="w-4 h-4 text-[#88B795]" />
              <span>thuynhu8788@gmail.com</span>
            </a>

            {/* Social Icons 44x44px touch target, gap 12px */}
            <div className="flex items-center gap-3 pt-1">
              <a
                href="https://youtube.com/@Cam_Cu_House"
                target="_blank"
                rel="noopener noreferrer"
                title="YouTube"
                className="w-11 h-11 rounded-full bg-[#16231A] border border-[#F3EBD8]/10 flex items-center justify-center text-red-400 hover:bg-[#CC7755] hover:text-white transition-all shadow-sm"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
              <a
                href="https://www.tiktok.com/@camcuhousedaknong"
                target="_blank"
                rel="noopener noreferrer"
                title="TikTok"
                className="w-11 h-11 rounded-full bg-[#16231A] border border-[#F3EBD8]/10 flex items-center justify-center text-[#F3EBD8] hover:bg-[#CC7755] hover:text-white transition-all shadow-sm"
              >
                <span className="font-bold text-xs">TT</span>
              </a>
              <a
                href="https://www.facebook.com/share/1DVLMySW8H/"
                target="_blank"
                rel="noopener noreferrer"
                title="Facebook"
                className="w-11 h-11 rounded-full bg-[#16231A] border border-[#F3EBD8]/10 flex items-center justify-center text-[#F3EBD8] hover:bg-[#CC7755] hover:text-white transition-all shadow-sm"
              >
                <Share2 className="w-4 h-4" />
              </a>
              <a
                href="https://maps.google.com/?q=Hem+437+Hung+Vuong+Nghia+Trung+Gia+Nghia+Dak+Nong"
                target="_blank"
                rel="noopener noreferrer"
                title={dict.common.openGoogleMaps}
                className="w-11 h-11 rounded-full bg-[#16231A] border border-[#F3EBD8]/10 flex items-center justify-center text-[#88B795] hover:bg-[#CC7755] hover:text-white transition-all shadow-sm"
              >
                <Navigation className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="container-unified pt-6 border-t border-[#F3EBD8]/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[14px] text-[#F3EBD8]/60 relative z-10">
        <p className="text-left">{dict.common.allRightsReserved}</p>

        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="btn-press inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#16231A] hover:bg-[#2D4233] text-[#F3EBD8] hover:text-white transition-all text-[13px] font-semibold border border-[#F3EBD8]/10 shadow-sm"
        >
          <ArrowUp className="w-3.5 h-3.5 text-[#88B795]" />
          <span>{isEn ? "Back to top" : "Lên đầu trang"}</span>
        </button>

        <p className="text-right text-[#88B795]/90 font-medium">
          {dict.common.curatedByNature}
        </p>
      </div>

      {/* Giant Architectural Cropped Typography at Footer Bottom: Opacity .10-.14, bottom half clipped, no overflow, no occlusion */}
      <div className="w-full overflow-hidden select-none pointer-events-none mt-8 h-[8vw] min-h-[50px] max-h-[110px] relative flex justify-center items-start opacity-[0.12]">
        <p className="font-serif text-center font-bold text-[12vw] leading-none tracking-[0.06em] whitespace-nowrap text-[#F3EBD8] -translate-y-[15%]">
          CẨM CÙ HOUSE
        </p>
      </div>
    </footer>
  );
}
