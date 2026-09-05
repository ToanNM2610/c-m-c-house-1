"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";

export default function Footer() {
  const pathname = usePathname();
  const { t } = useLanguage();

  // Hide on Admin and Full-Page 3D Home
  if (pathname === "/" || (pathname && pathname.startsWith("/admin"))) {
    return null;
  }

  return (
    <footer className="relative z-10 bg-[#120805] text-[#F4EFEA]/70 py-16 px-6 border-t border-[#C5A880]/15 font-sans">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Brand */}
        <div className="space-y-4">
          <Link href="/" className="text-2xl font-serif text-[#F4EFEA] font-bold tracking-wider inline-block mb-2 hover:text-[#C5A880] transition-colors">
            Cẩm Cù House
          </Link>
          <p className="font-light text-sm leading-relaxed max-w-sm text-[#F4EFEA]/75">
            {t("footer.slogan")}
          </p>
        </div>

        {/* Links */}
        <div className="space-y-4">
          <h4 className="text-[#F4EFEA] font-medium tracking-[0.2em] uppercase text-xs mb-6 font-sans">
            {t("footer.quickLinks")}
          </h4>
          <ul className="space-y-3 font-light text-sm">
            <li><Link href="/about" className="hover:text-[#C5A880] transition-colors">{t("nav.about")}</Link></li>
            <li><Link href="/menu" className="hover:text-[#C5A880] transition-colors">{t("nav.menu")}</Link></li>
            <li><Link href="/space" className="hover:text-[#C5A880] transition-colors">{t("nav.space")}</Link></li>
            <li><Link href="/contact" className="hover:text-[#C5A880] transition-colors">{t("nav.contact")}</Link></li>
          </ul>
        </div>

        {/* Social */}
        <div className="space-y-4">
          <h4 className="text-[#F4EFEA] font-medium tracking-[0.2em] uppercase text-xs mb-6 font-sans">
            {t("footer.connect")}
          </h4>
          <div className="flex gap-4">
            {/* Facebook SVG */}
            <a 
              href="https://www.facebook.com/share/1DVLMySW8H" 
              target="_blank" 
              rel="noreferrer" 
              aria-label="Facebook"
              data-cursor="explore"
              className="w-10 h-10 rounded-full bg-[#1E110A] border border-[#C5A880]/25 flex items-center justify-center text-[#F4EFEA]/80 hover:text-[#1A0F0A] hover:bg-[#C5A880] hover:border-[#C5A880] transition-all duration-300 shadow-sm"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/>
              </svg>
            </a>
            {/* YouTube SVG */}
            <a 
              href="https://youtube.com/@Cam_Cu_House" 
              target="_blank" 
              rel="noreferrer" 
              aria-label="YouTube"
              data-cursor="explore"
              className="w-10 h-10 rounded-full bg-[#1E110A] border border-[#C5A880]/25 flex items-center justify-center text-[#F4EFEA]/80 hover:text-[#1A0F0A] hover:bg-[#C5A880] hover:border-[#C5A880] transition-all duration-300 shadow-sm"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                <path d="M21.582 6.186a2.67 2.67 0 0 0-1.884-1.888C17.962 3.8 12 3.8 12 3.8s-5.962 0-7.698.498a2.67 2.67 0 0 0-1.884 1.888C1.92 7.922 1.92 12 1.92 12s0 4.078.498 5.814a2.67 2.67 0 0 0 1.884 1.888C6.038 20.2 12 20.2 12 20.2s5.962 0 7.698-.498a2.67 2.67 0 0 0 1.884-1.888C22.08 16.078 22.08 12 22.08 12s0-4.078-.498-5.814zM9.9 15.3v-6.6l5.7 3.3-5.7 3.3z"/>
              </svg>
            </a>
            {/* TikTok SVG */}
            <a 
              href="https://www.tiktok.com/@camcuhousedaknong" 
              target="_blank" 
              rel="noreferrer" 
              aria-label="TikTok"
              data-cursor="explore"
              className="w-10 h-10 rounded-full bg-[#1E110A] border border-[#C5A880]/25 flex items-center justify-center text-[#F4EFEA]/80 hover:text-[#1A0F0A] hover:bg-[#C5A880] hover:border-[#C5A880] transition-all duration-300 shadow-sm"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.12-3.44-3.17-3.64-5.46-.22-2.39.81-4.78 2.63-6.2 1.53-1.22 3.51-1.72 5.43-1.49v4.06c-1.16-.1-2.31.25-3.18 1.01-.76.63-1.23 1.59-1.25 2.58-.02 1.35.8 2.67 2.03 3.23 1.11.53 2.45.54 3.56.05 1.1-.48 1.89-1.44 2.11-2.61.12-.66.11-1.33.11-2.01V.02z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-[#C5A880]/15 text-center text-xs text-[#F4EFEA]/50 font-light">
        <p>&copy; {new Date().getFullYear()} {t("footer.rights")}</p>
      </div>
    </footer>
  );
}
