'use client';

import React from 'react';
import Link from 'next/link';
import { MapPin, Phone, Mail, Compass, ExternalLink, ShieldCheck } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function FooterSection() {
  const { data, language } = useApp();
  const s = data.settings;
  const isEn = language === 'en';

  const tagline = isEn && s.taglineEn ? s.taglineEn : s.tagline;
  const socialProof = isEn && s.socialProofEn ? s.socialProofEn : s.socialProof;
  const address = isEn && s.addressEn ? s.addressEn : s.address;

  return (
    <footer id="contact-section" className="bg-[#1A241E] text-[#EBF0EC] pt-16 sm:pt-20 pb-12 relative z-10 border-t border-forest-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 pb-14 border-b border-white/10">
          {/* Brand Info (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <Link href="/" className="inline-block">
              <span className="font-serif text-3xl font-bold tracking-tight text-white">
                CẨM CÙ <span className="font-normal italic text-accent-botanical">HOUSE</span>
              </span>
            </Link>
            <p className="text-xs text-forest-200/80 leading-relaxed font-serif italic max-w-sm">
              &ldquo;{tagline}&rdquo;
            </p>
            <div className="inline-flex items-center gap-1.5 p-3 bg-white/5 rounded-xl border border-white/10 text-xs font-mono text-emerald-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>{socialProof}</span>
            </div>

            {/* Social ecosystem */}
            <div className="flex items-center gap-2.5 pt-2">
              <a
                href={s.links.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-mono transition-colors"
              >
                Facebook
              </a>
              <a
                href={s.links.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-mono transition-colors"
              >
                TikTok
              </a>
              <a
                href={s.links.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-mono transition-colors"
              >
                YouTube
              </a>
            </div>
          </div>

          {/* 7 Quick Navigation Corporate Pages (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-semibold">
              {isEn ? 'CORPORATE PAGES' : 'TRANG DOANH NGHIỆP'}
            </h4>
            <ul className="space-y-2.5 text-xs font-mono">
              <li>
                <Link href="/" className="text-forest-200/80 hover:text-white transition-colors">
                  {isEn ? 'Home' : 'Trang chủ'}
                </Link>
              </li>
              <li>
                <Link href="/gioi-thieu" className="text-forest-200/80 hover:text-white transition-colors">
                  {isEn ? 'About Us' : 'Giới thiệu Cẩm Cù'}
                </Link>
              </li>
              <li>
                <Link href="/khong-gian" className="text-forest-200/80 hover:text-white transition-colors">
                  {isEn ? 'Sanctuary (30 Plates)' : 'Không gian (30 Plates)'}
                </Link>
              </li>
              <li>
                <Link href="/thuc-don" className="text-forest-200/80 hover:text-white transition-colors">
                  {isEn ? 'Menu (~67 Items)' : 'Thực đơn (~67 món)'}
                </Link>
              </li>
              <li>
                <Link href="/khach-hang" className="text-forest-200/80 hover:text-white transition-colors">
                  {isEn ? 'Reviews & Stories' : 'Dấu ấn & Đánh giá'}
                </Link>
              </li>
              <li>
                <Link href="/su-kien" className="text-forest-200/80 hover:text-white transition-colors">
                  {isEn ? 'News & FAQ' : 'Tin tức & FAQ'}
                </Link>
              </li>
              <li>
                <Link href="/lien-he" className="text-forest-200/80 hover:text-white transition-colors">
                  {isEn ? 'Contact & Map' : 'Liên hệ & Chỉ đường'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Hotlines (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-semibold">
              {isEn ? 'DIRECT CONTACT' : 'LIÊN HỆ TRỰC TIẾP'}
            </h4>
            <div className="space-y-3 text-xs leading-relaxed">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>{address}</span>
              </div>

              <div className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div className="flex flex-wrap gap-2">
                  <a
                    href="tel:0382851688"
                    className="font-mono text-emerald-300 hover:text-white underline font-semibold"
                  >
                    0382 851 688
                  </a>
                  <span>—</span>
                  <a
                    href="tel:0774659000"
                    className="font-mono text-emerald-300 hover:text-white underline font-semibold"
                  >
                    0774 659 000
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <a href={`mailto:${s.email}`} className="text-forest-200 hover:text-white underline">
                  {s.email}
                </a>
              </div>

              <div className="pt-1">
                <a
                  href={s.links.googleMaps}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-700/50 hover:bg-emerald-700 text-white rounded-xl text-xs font-medium transition-all border border-emerald-500/30"
                >
                  <Compass className="w-3.5 h-3.5" />
                  <span>{isEn ? 'Google Maps Directions' : 'Google Maps chỉ đường'}</span>
                  <ExternalLink className="w-3 h-3 opacity-70" />
                </a>
              </div>
            </div>
          </div>

          {/* Operating Hours (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-semibold">
              {isEn ? 'OPERATING HOURS (GMT+7)' : 'GIỜ ĐÓN KHÁCH (GMT+7)'}
            </h4>
            <div className="space-y-2.5 text-xs font-mono">
              <div className="p-2.5 bg-white/5 rounded-xl border border-white/10 space-y-1">
                <span className="text-forest-300 block">
                  {isEn ? 'Monday – Thursday:' : 'Thứ Hai – Thứ Năm:'}
                </span>
                <span className="text-white font-bold">{s.hours.monThu}</span>
              </div>
              <div className="p-2.5 bg-white/5 rounded-xl border border-white/10 space-y-1">
                <span className="text-forest-300 block">
                  {isEn ? 'Friday – Sunday:' : 'Thứ Sáu – Chủ Nhật:'}
                </span>
                <span className="text-emerald-300 font-bold">{s.hours.friSun}</span>
                <span className="text-[10px] text-forest-300 block">
                  {isEn ? '(Late stream view & Acoustic)' : '(Mở muộn ngắm suối đêm & Acoustic)'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Legal Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-mono text-forest-300/70">
          <div>
            © {new Date().getFullYear()} Cẩm Cù House. {isEn ? 'All rights reserved.' : 'Tất cả quyền được bảo lưu.'}
          </div>

          {/* Legal Policy Links */}
          <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
            <Link
              href="/p/chinh-sach-bao-mat"
              className="hover:text-emerald-400 underline transition-colors"
            >
              {isEn ? 'Privacy Policy' : 'Chính sách bảo mật'}
            </Link>
            <span>•</span>
            <Link
              href="/p/dieu-khoan-su-dung"
              className="hover:text-emerald-400 underline transition-colors"
            >
              {isEn ? 'Terms of Service' : 'Điều khoản sử dụng'}
            </Link>
            <span>•</span>
            <Link
              href="/p/noi-quy-khong-gian"
              className="hover:text-emerald-400 underline transition-colors"
            >
              {isEn ? 'Sanctuary Rules' : 'Nội quy không gian'}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
