"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { MapPin, Phone, Mail, Clock, Compass, ArrowUpRight } from "lucide-react";

const GOOGLE_MAPS_URL =
  "https://maps.google.com/?cid=10605553198031545365&q=C%E1%BA%A9m+C%C3%B9+House";

export default function Footer() {
  const pathname = usePathname() || "";
  const { lang } = useLanguage();

  if (pathname.startsWith("/admin") || pathname.startsWith("/wp-admin")) {
    return null;
  }

  return (
    <footer className="w-full bg-[#2D4A3E] text-[#FDFBF7] pt-16 pb-12 px-6 sm:px-12 font-sans border-t border-[#3A5D4F]">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 sm:gap-12">
        {/* CỘT 1: THƯƠNG HIỆU */}
        <div className="space-y-4">
          <Link href="/" className="inline-block">
            <span className="font-serif text-3xl font-bold text-[#FDFBF7] tracking-tight hover:text-[#C88A4B] transition-colors">
              Cẩm Cù House
            </span>
            <span className="block text-xs font-sans uppercase tracking-[0.2em] text-[#C88A4B] mt-0.5">
              coffee &amp; Food
            </span>
          </Link>

          <p className="text-xs sm:text-sm font-light text-[#FDFBF7]/80 leading-relaxed">
            {lang === "en"
              ? "Immerse yourself in nature beside the crystal pebble stream of Gia Nghia. An eco-friendly botanical retreat with wood-roasted coffee."
              : "Hòa mình vào thiên nhiên bên bờ suối đá Gia Nghĩa. Không gian sinh thái mộc mạc gìn giữ vị cà phê rang củi nguyên bản."}
          </p>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1F342B] text-[11px] font-mono text-[#C88A4B]">
            <Compass size={13} />
            <span>11.99° N, 107.69° E • Gia Nghĩa</span>
          </div>
        </div>

        {/* CỘT 2: ĐIỀU HƯỚNG NHANH */}
        <div className="space-y-4">
          <h4 className="font-serif text-lg font-semibold text-[#FDFBF7] tracking-wide border-b border-[#3A5D4F] pb-2">
            {lang === "en" ? "Navigation" : "Khám Phá"}
          </h4>
          <ul className="space-y-2.5 text-xs sm:text-sm font-light text-[#FDFBF7]/85">
            <li>
              <Link href="/" className="hover:text-[#C88A4B] transition-colors flex items-center gap-1.5">
                <span>{lang === "en" ? "Home" : "Trang chủ"}</span>
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-[#C88A4B] transition-colors flex items-center gap-1.5">
                <span>{lang === "en" ? "Our Story" : "Giới thiệu & Câu chuyện"}</span>
              </Link>
            </li>
            <li>
              <Link href="/space" className="hover:text-[#C88A4B] transition-colors flex items-center gap-1.5">
                <span>{lang === "en" ? "Botanical Space" : "Không gian & Trải nghiệm"}</span>
              </Link>
            </li>
            <li>
              <Link href="/menu" className="hover:text-[#C88A4B] transition-colors flex items-center gap-1.5">
                <span>{lang === "en" ? "Menu & Food" : "Thực đơn tươi mộc"}</span>
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-[#C88A4B] transition-colors flex items-center gap-1.5">
                <span>{lang === "en" ? "Contact & Booking" : "Liên hệ & Đặt bàn"}</span>
              </Link>
            </li>
          </ul>
        </div>

        {/* CỘT 3: THỜI GIAN & LIÊN HỆ */}
        <div className="space-y-4">
          <h4 className="font-serif text-lg font-semibold text-[#FDFBF7] tracking-wide border-b border-[#3A5D4F] pb-2">
            {lang === "en" ? "Contact & Hours" : "Thông Tin & Giờ Mở Cửa"}
          </h4>
          <div className="space-y-3 text-xs sm:text-sm font-light text-[#FDFBF7]/85">
            <div className="flex items-start gap-2.5">
              <Clock size={15} className="text-[#C88A4B] shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-[#FDFBF7]">Giờ mở cửa đón khách:</p>
                <p className="text-xs text-[#FDFBF7]/75">T2 - T5: 07:00 - 18:00</p>
                <p className="text-xs text-[#FDFBF7]/75">T6 - CN: 07:00 - 22:00</p>
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
          <h4 className="font-serif text-lg font-semibold text-[#FDFBF7] tracking-wide border-b border-[#3A5D4F] pb-2">
            {lang === "en" ? "Location" : "Địa Chỉ Quán"}
          </h4>
          <div className="flex items-start gap-2.5 text-xs sm:text-sm font-light text-[#FDFBF7]/85">
            <MapPin size={16} className="text-[#C88A4B] shrink-0 mt-0.5" />
            <p>Hẻm 437 Hùng Vương, P. Nghĩa Trung, TP Gia Nghĩa, Đắk Nông</p>
          </div>

          {/* Nút mở Google Maps chỉ đường */}
          <div className="pt-2">
            <a
              href={GOOGLE_MAPS_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1F342B] hover:bg-[#C88A4B] hover:text-white transition-all text-xs font-medium text-[#FDFBF7] border border-[#3A5D4F]"
            >
              <span>Xem trên Google Maps</span>
              <ArrowUpRight size={14} />
            </a>
          </div>
        </div>
      </div>

      {/* DÒNG BẢN QUYỀN */}
      <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-[#3A5D4F]/60 flex flex-col sm:flex-row items-center justify-between text-xs text-[#FDFBF7]/60 gap-3">
        <p>© 2026 Cẩm Cù House. Tất cả các quyền được bảo lưu.</p>
        <p className="text-[11px] font-mono text-[#C88A4B]/80">
          WARM BOTANICAL &amp; MODERN RUSTIC SANCTUARY
        </p>
      </div>
    </footer>
  );
}
