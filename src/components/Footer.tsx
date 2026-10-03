"use client";

import Link from "next/link";
import { 
  MapPin, 
  Clock, 
  PhoneCall, 
  Mail, 
  Share2, 
  Sparkles, 
  Navigation 
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function Footer() {
  const { locale, dict } = useLanguage();
  const isEn = locale === "en";

  return (
    <footer className="w-full bg-[#1B281D] text-stone-300 pt-16 pb-10 border-t border-stone-800 shadow-xl">
      <div className="w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
        {/* Col 1: Brand Info */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-[#3E5C46] text-white flex items-center justify-center shrink-0 shadow-sm">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="font-serif text-2xl font-bold text-white tracking-tight">
              Cẩm Cù House
            </span>
          </div>
          <p className="text-sm text-stone-400 leading-relaxed">
            {isEn
              ? "An eco-friendly coffee & dining sanctuary nestled beside a cool natural stream in the Dak Nong highlands. A rustic haven honoring nature and bringing tranquility to the soul."
              : "Khu ẩm thực & cà phê sinh thái bên dòng suối mát lành miền cao nguyên Đắk Nông. Chốn dừng chân mộc mạc gìn giữ tự nhiên và mang lại sự an yên cho tâm hồn."}
          </p>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-stone-800/80 rounded-full text-emerald-300 text-xs font-medium w-fit border border-stone-700">
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            <span>11.99° N, 107.69° E • Gia Nghĩa</span>
          </div>
        </div>

        {/* Col 2: Navigation */}
        <div className="flex flex-col gap-3">
          <span className="text-xs font-bold text-emerald-400 tracking-wider uppercase">
            {dict.contact.quickLinksTitle}
          </span>
          <nav className="flex flex-col gap-2.5 text-sm text-stone-300">
            <Link href="/" className="hover:text-white hover:translate-x-1 transition-all">
              {dict.nav.home}
            </Link>
            <Link href="/about" className="hover:text-white hover:translate-x-1 transition-all">
              {dict.nav.about}
            </Link>
            <Link href="/space" className="hover:text-white hover:translate-x-1 transition-all">
              {dict.nav.space}
            </Link>
            <Link href="/menu" className="hover:text-white hover:translate-x-1 transition-all">
              {dict.nav.menu}
            </Link>
            <Link href="/contact" className="hover:text-white hover:translate-x-1 transition-all">
              {dict.nav.contact}
            </Link>
            <Link href="/admin" className="hover:text-white hover:translate-x-1 transition-all text-xs text-stone-400">
              {dict.common.admin}
            </Link>
          </nav>
        </div>

        {/* Col 3: Hours & Hotlines */}
        <div className="flex flex-col gap-3">
          <span className="text-xs font-bold text-emerald-400 tracking-wider uppercase">
            {dict.contact.openingHoursTitle}
          </span>
          <div className="text-sm text-stone-300 flex flex-col gap-1.5 bg-stone-800/60 p-4 rounded-2xl border border-stone-700/60">
            <div className="flex items-center gap-1.5 font-semibold text-white">
              <Clock className="w-4 h-4 text-emerald-400" />
              <span>{isEn ? "Service Hours" : "Thời gian phục vụ"}</span>
            </div>
            <p className="text-xs text-stone-400 mt-1">
              <strong className="text-stone-200">{isEn ? "Mon - Thu:" : "Thứ 2 - Thứ 5:"}</strong> 07:00 - 18:00
            </p>
            <p className="text-xs text-stone-400">
              <strong className="text-stone-200">{isEn ? "Fri - Sun:" : "Thứ 6 - Chủ Nhật:"}</strong> 07:00 - 22:00
            </p>
          </div>

          <div className="mt-1 flex flex-col gap-1.5">
            <span className="text-xs font-semibold text-stone-400">{dict.contact.hotlineTitle}</span>
            <div className="flex flex-col gap-1 text-sm font-bold text-emerald-300">
              <a href="tel:0382851688" className="hover:text-emerald-200 flex items-center gap-2">
                <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
                <span>038 285 1688 (Zalo)</span>
              </a>
              <a href="tel:0774659000" className="hover:text-emerald-200 flex items-center gap-2">
                <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
                <span>077 465 9000</span>
              </a>
            </div>
          </div>
        </div>

        {/* Col 4: Address & Social */}
        <div className="flex flex-col gap-3">
          <span className="text-xs font-bold text-emerald-400 tracking-wider uppercase">
            {dict.contact.addressTitle}
          </span>
          <p className="text-sm text-stone-400 leading-relaxed">
            {dict.common.addressFull}
          </p>
          <p className="text-xs text-emerald-300 font-medium bg-emerald-950/40 p-2.5 rounded-xl border border-emerald-800/40">
            {dict.common.carParkingNote}
          </p>

          <a 
            href="mailto:thuynhu8788@gmail.com" 
            className="text-xs text-stone-400 hover:text-stone-200 flex items-center gap-1.5 pt-1"
          >
            <Mail className="w-3.5 h-3.5 text-emerald-400" />
            <span>thuynhu8788@gmail.com</span>
          </a>

          {/* Social Links */}
          <div className="flex items-center gap-2.5 pt-2">
            <a
              href="https://youtube.com/@Cam_Cu_House"
              target="_blank"
              rel="noopener noreferrer"
              title="YouTube"
              className="w-9 h-9 rounded-full bg-stone-800 border border-stone-700 flex items-center justify-center text-red-500 hover:bg-[#3E5C46] hover:text-white transition-all shadow-sm hover:scale-105"
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
              className="w-9 h-9 rounded-full bg-stone-800 border border-stone-700 flex items-center justify-center text-stone-200 hover:bg-[#3E5C46] hover:text-white transition-all shadow-sm hover:scale-105"
            >
              <span className="font-bold text-xs">TT</span>
            </a>
            <a
              href="https://www.facebook.com/share/1DVLMySW8H/"
              target="_blank"
              rel="noopener noreferrer"
              title="Facebook"
              className="w-9 h-9 rounded-full bg-stone-800 border border-stone-700 flex items-center justify-center text-stone-200 hover:bg-[#3E5C46] hover:text-white transition-all shadow-sm hover:scale-105"
            >
              <Share2 className="w-4 h-4" />
            </a>
            <a
              href="https://maps.google.com/?q=Hem+437+Hung+Vuong+Nghia+Trung+Gia+Nghia+Dak+Nong"
              target="_blank"
              rel="noopener noreferrer"
              title={dict.common.openGoogleMaps}
              className="w-9 h-9 rounded-full bg-stone-800 border border-stone-700 flex items-center justify-center text-emerald-400 hover:bg-[#3E5C46] hover:text-white transition-all shadow-sm hover:scale-105"
            >
              <Navigation className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pt-6 border-t border-stone-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-500">
        <p>{dict.common.allRightsReserved}</p>
        <p className="text-emerald-400/80 font-medium">
          {dict.common.curatedByNature}
        </p>
      </div>
    </footer>
  );
}
