"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { 
  MapPin, 
  Clock, 
  PhoneCall, 
  Mail, 
  ArrowUp,
  Share2
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import StarHoya from "@/components/ui/StarHoya";

export default function Footer() {
  const { locale, dict } = useLanguage();
  const isEn = locale === "en";

  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="w-full bg-[#0A0E0C] text-[var(--ink-on-dark,#F2EDE4)] pt-20 pb-10 border-t border-[var(--line-on-dark,rgba(242,237,228,0.14))] relative overflow-hidden">
      <div className="w-full max-w-[1360px] mx-auto px-5 sm:px-10 relative z-10">
        {/* Trên cùng: Tọa độ & Slogan điện ảnh */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 pb-12 border-b border-[var(--line-on-dark,rgba(242,237,228,0.14))]">
          <div className="flex flex-col gap-3.5 sm:gap-4 max-w-2xl">
            <span className="font-mono text-[12px] uppercase tracking-widest text-[var(--ember-on-dark,#FF6A2B)] flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--ember-on-dark,#FF6A2B)]" />
              11.99° N · 107.69° E · ĐỘ CAO 800M+
            </span>
            <h2 className="font-display font-extrabold text-[24px] sm:text-[34px] md:text-[40px] uppercase tracking-tight text-[var(--ink-on-dark,#F2EDE4)] leading-[1.3] pt-1">
              CHỐN DỪNG CHÂN <span className="font-serif italic font-normal text-[var(--ember-on-dark,#FF6A2B)] lowercase">mộc mạc</span> BÊN BỜ SUỐI ĐÁ
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-sm border border-[var(--line-on-dark,rgba(242,237,228,0.18))] bg-[#131B17] flex items-center justify-center text-[var(--ember-on-dark,#FF6A2B)]">
              <StarHoya size={24} strokeWidth={2} />
            </div>
          </div>
        </div>

        {/* 4 Cột kẻ ô (Grid với dấu '+' tại các giao điểm) */}
        <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 py-14 border-b border-[var(--line-on-dark,rgba(242,237,228,0.14))]">
          {/* Cột 1: Thương hiệu + Tọa độ */}
          <div className="flex flex-col gap-4 relative">
            <span className="font-mono text-[11px] text-[var(--ember-on-dark,#FF6A2B)] uppercase tracking-wider font-bold">
              [01] THƯƠNG HIỆU
            </span>
            <span className="font-display font-black text-[24px] uppercase tracking-tight text-[var(--ink-on-dark,#F2EDE4)]">
              CẨM CÙ HOUSE
            </span>
            <p className="text-[14px] leading-relaxed" style={{ color: "var(--ink-muted-on-dark)" }}>
              {isEn
                ? "An eco-friendly coffee & dining sanctuary nestled beside a cool natural stream in the Dak Nong highlands."
                : "Khu ẩm thực & cà phê sinh thái bên dòng suối mát lành miền cao nguyên Đắk Nông. Chốn dừng chân mộc mạc."}
            </p>
            <div className="font-mono text-[11px] text-[var(--mist-on-dark,#A9C4B6)] uppercase tracking-wider mt-2">
              GIA NGHĨA · ĐẮK NÔNG · 800M+
            </div>
          </div>

          {/* Cột 2: Điều hướng */}
          <div className="flex flex-col gap-4 relative">
            <span className="font-mono text-[11px] text-[var(--ember-on-dark,#FF6A2B)] uppercase tracking-wider font-bold">
              [02] ĐIỀU HƯỚNG
            </span>
            <nav className="flex flex-col gap-2.5 font-mono uppercase tracking-wider">
              <Link href="/" className="nav-footer-link text-[var(--ink-on-dark,#F2EDE4)] hover:text-[var(--ember-on-dark,#FF6A2B)] hover:translate-x-1 transition-all w-fit">
                → {dict.nav.home}
              </Link>
              <Link href="/about" className="nav-footer-link text-[var(--ink-on-dark,#F2EDE4)] hover:text-[var(--ember-on-dark,#FF6A2B)] hover:translate-x-1 transition-all w-fit">
                → {dict.nav.about}
              </Link>
              <Link href="/space" className="nav-footer-link text-[var(--ink-on-dark,#F2EDE4)] hover:text-[var(--ember-on-dark,#FF6A2B)] hover:translate-x-1 transition-all w-fit">
                → {dict.nav.space}
              </Link>
              <Link href="/menu" className="nav-footer-link text-[var(--ink-on-dark,#F2EDE4)] hover:text-[var(--ember-on-dark,#FF6A2B)] hover:translate-x-1 transition-all w-fit">
                → {dict.nav.menu}
              </Link>
              <Link href="/contact" className="nav-footer-link text-[var(--ink-on-dark,#F2EDE4)] hover:text-[var(--ember-on-dark,#FF6A2B)] hover:translate-x-1 transition-all w-fit">
                → {dict.nav.contact}
              </Link>
            </nav>
          </div>

          {/* Cột 3: Giờ & Hotline */}
          <div className="flex flex-col gap-4 relative">
            <span className="font-mono text-[11px] text-[var(--ember-on-dark,#FF6A2B)] uppercase tracking-wider font-bold">
              [03] GIỜ & HOTLINE
            </span>
            <div className="flex flex-col gap-2 text-[14px]">
              <div>
                <span className="text-[var(--ink-muted-on-dark,rgba(242,237,228,0.82))] text-[12px] uppercase font-mono block">Thứ 2 – 5:</span>
                <span className="font-mono font-bold text-[15px] text-[var(--ink-on-dark,#F2EDE4)]">07:00 – 18:00</span>
              </div>
              <div>
                <span className="text-[var(--ember-on-dark,#FF6A2B)] text-[12px] uppercase font-mono block">Thứ 6 – CN:</span>
                <span className="font-mono font-bold text-[15px] text-[var(--ember-on-dark,#FF6A2B)]">07:00 – 22:00</span>
              </div>
            </div>

            <div className="pt-2 border-t border-[var(--line-on-dark,rgba(242,237,228,0.18))] flex flex-col gap-1">
              <a href="tel:0382851688" className="font-mono text-[14px] font-bold text-[var(--ember-on-dark,#FF6A2B)] hover:underline flex items-center gap-2">
                <PhoneCall className="w-3.5 h-3.5" />
                <span>038 285 1688 (Zalo)</span>
              </a>
              <a href="tel:0774659000" className="font-mono text-[14px] font-bold text-[var(--ink-on-dark,#F2EDE4)] hover:text-[var(--ember-on-dark,#FF6A2B)] flex items-center gap-2">
                <PhoneCall className="w-3.5 h-3.5" />
                <span>077 465 9000</span>
              </a>
            </div>
          </div>

          {/* Cột 4: Địa chỉ & Kết nối */}
          <div className="flex flex-col gap-4 relative">
            <span className="font-mono text-[11px] text-[var(--ember-on-dark,#FF6A2B)] uppercase tracking-wider font-bold">
              [04] ĐỊA CHỈ & KẾT NỐI
            </span>
            <p className="text-[13.5px] leading-relaxed" style={{ color: "var(--ink-muted-on-dark)" }}>
              Hẻm 437 Hùng Vương, Phường Nghĩa Trung, Thành phố Gia Nghĩa, Tỉnh Đắk Nông
            </p>

            <a href="mailto:thuynhu8788@gmail.com" className="font-mono text-[12px] text-[var(--ink-on-dark,#F2EDE4)] hover:text-[var(--ember-on-dark,#FF6A2B)] hover:underline flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-[var(--ember-on-dark,#FF6A2B)]" />
              <span>thuynhu8788@gmail.com</span>
            </a>

            {/* Mạng xã hội */}
            <div className="flex items-center gap-2 pt-2">
              <a
                href="https://www.facebook.com/share/1DVLMySW8H/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-sm border border-[var(--line-on-dark,rgba(242,237,228,0.18))] bg-[#131B17] text-[var(--ink-on-dark,#F2EDE4)] hover:border-[var(--ember-on-dark,#FF6A2B)] hover:text-[var(--ember-on-dark,#FF6A2B)] flex items-center justify-center text-[12px] font-mono transition-colors"
                aria-label="Facebook"
              >
                FB
              </a>
              <a
                href="https://www.tiktok.com/@camcuhousedaknong"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-sm border border-[var(--line-on-dark,rgba(242,237,228,0.18))] bg-[#131B17] text-[var(--ink-on-dark,#F2EDE4)] hover:border-[var(--ember-on-dark,#FF6A2B)] hover:text-[var(--ember-on-dark,#FF6A2B)] flex items-center justify-center text-[12px] font-mono transition-colors"
                aria-label="TikTok"
              >
                TT
              </a>
              <a
                href="https://youtube.com/@Cam_Cu_House"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-sm border border-[var(--line-on-dark,rgba(242,237,228,0.18))] bg-[#131B17] text-[var(--ink-on-dark,#F2EDE4)] hover:border-[var(--ember-on-dark,#FF6A2B)] hover:text-[var(--ember-on-dark,#FF6A2B)] flex items-center justify-center text-[12px] font-mono transition-colors"
                aria-label="YouTube"
              >
                YT
              </a>
            </div>
          </div>
        </div>

        {/* Chữ "CẨM CÙ HOUSE" khổng lồ tràn ngang viền ember, tô đặc khi hover (Section 2 & 7.6) */}
        <div aria-hidden="true" className="w-full py-6 sm:py-10 text-center select-none group cursor-default" style={{ overflow: "visible" }}>
          <svg
            className="w-full h-auto max-h-[200px] sm:max-h-[250px]"
            viewBox="0 -52 1200 185"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ overflow: "visible" }}
          >
            <text
              x="50%"
              y="80"
              dominantBaseline="middle"
              textAnchor="middle"
              className="font-display font-black text-[96px] sm:text-[116px] uppercase tracking-wider fill-transparent stroke-[var(--ember-on-dark,#FF6A2B)] stroke-[2.2px] group-hover:fill-[var(--ember-on-dark,#FF6A2B)] transition-colors duration-500"
            >
              CẨM CÙ HOUSE
            </text>
          </svg>
        </div>

        {/* Hàng cuối: Bản quyền · Lên đầu trang ↑ · Dòng thiết kế */}
        <div className="pt-6 border-t border-[var(--line-on-dark,rgba(242,237,228,0.14))] flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[12.5px] text-[var(--ink-on-dark,#F2EDE4)] font-medium">
          <span>
            © {new Date().getFullYear()} CẨM CÙ HOUSE. TẤT CẢ QUYỀN ĐƯỢC BẢO LƯU.
          </span>

          <button
            type="button"
            onClick={scrollToTop}
            className="inline-flex items-center gap-1.5 font-mono text-[12.5px] font-bold uppercase tracking-wider text-[var(--ink-on-dark,#F2EDE4)] hover:text-[var(--ember-on-dark,#FF6A2B)]"
          >
            <span>LÊN ĐẦU TRANG</span>
            <ArrowUp className="w-3.5 h-3.5 text-[var(--ember-on-dark,#FF6A2B)]" />
          </button>

          <span>
            THIẾT KẾ ĐẠI NGÀN ĐIỆN ẢNH
          </span>
        </div>
      </div>
    </footer>
  );
}
