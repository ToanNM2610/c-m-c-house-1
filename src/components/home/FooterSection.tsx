'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MapPin, Phone, Mail, Compass, ExternalLink, ShieldCheck } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function FooterSection() {
  const pathname = usePathname();
  const { data, language, content } = useApp();

  const [approvedCount, setApprovedCount] = React.useState<number | null>(null);
  const [recommendedCount, setRecommendedCount] = React.useState<number>(0);
  const [recommendedPercent, setRecommendedPercent] = React.useState<number>(100);

  React.useEffect(() => {
    let isMounted = true;
    async function fetchStats() {
      try {
        const res = await fetch('/api/comments');
        if (res.ok) {
          const json = await res.json();
          const list: any[] = Array.isArray(json) ? json : json.data || [];
          const approved = list.filter((c) => c.status === 'APPROVED');
          if (isMounted) {
            setApprovedCount(approved.length);
            if (approved.length > 0) {
              const rec = approved.filter((c) => (c.rating ?? 5) >= 4).length;
              setRecommendedCount(rec);
              setRecommendedPercent(Math.round((rec / approved.length) * 100));
            }
          }
        }
      } catch {
        if (isMounted) setApprovedCount(0);
      }
    }
    fetchStats();
    return () => {
      isMounted = false;
    };
  }, []);

  const [isAdminHost, setIsAdminHost] = React.useState(false);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const isAdm =
        window.location.hostname.startsWith('admin.') ||
        window.location.hostname === 'admin.camcuhouse.online' ||
        window.location.host.startsWith('admin.');
      if (isAdm) {
        setIsAdminHost(true);
      }
    }
  }, []);

  if (pathname?.startsWith('/admin') || isAdminHost) {
    return null;
  }
  const s = data.settings;
  const isEn = language === 'en';

  const tagline = isEn && s.taglineEn ? s.taglineEn : s.tagline;
  const address = isEn && s.addressEn ? s.addressEn : s.address;

  return (
    <footer id="contact-section" className="bg-[#1A241E] text-[#EBF0EC] pt-16 sm:pt-20 pb-12 relative z-10 border-t border-forest-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 pb-14 border-b border-white/10">
          {/* Brand Info (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <Link href={isEn ? '/en' : '/'} className="inline-block">
              <span className="font-serif text-3xl font-bold tracking-tight text-white">
                CẨM CÙ <span className="font-normal italic text-accent-botanical">HOUSE</span>
              </span>
            </Link>
            <p className="text-xs text-forest-200/80 leading-relaxed font-serif italic max-w-sm">
              &ldquo;{tagline}&rdquo;
            </p>
            {/* Real verified social proof badge: cleanly hidden if approved review count === 0 */}
            {approvedCount !== null && approvedCount > 0 && (
              <div className="inline-flex items-center gap-1.5 p-3 bg-white/5 rounded-xl border border-white/10 text-xs font-mono text-emerald-400">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>
                  {isEn
                    ? `${recommendedPercent}% Recommended (${recommendedCount}/${approvedCount} Verified Reviews)`
                    : `${recommendedPercent}% Đề xuất (${recommendedCount}/${approvedCount} Đánh giá thực khách)`}
                </span>
              </div>
            )}

            {/* Social ecosystem */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              {s.links?.facebook && (
                <a
                  href={s.links.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-mono transition-colors"
                >
                  Facebook
                </a>
              )}
              {s.links?.tiktok && (
                <a
                  href={s.links.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-mono transition-colors"
                >
                  TikTok
                </a>
              )}
              {s.links?.youtube && (
                <a
                  href={s.links.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-mono transition-colors"
                >
                  YouTube
                </a>
              )}
              {s.enableWhatsApp === true && s.whatsappUrl && (
                <a
                  href={s.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-mono transition-colors"
                >
                  WhatsApp
                </a>
              )}
              {s.instagramUrl && (
                <a
                  href={s.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-mono transition-colors"
                >
                  Instagram
                </a>
              )}
            </div>
          </div>

          {/* 7 Quick Navigation Corporate Pages (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs font-sans uppercase tracking-wider text-emerald-400 font-semibold">
              {isEn ? 'CORPORATE PAGES' : 'TRANG DOANH NGHIỆP'}
            </h4>
            <ul className="space-y-2.5 text-xs font-sans">
              <li>
                <Link href={isEn ? '/en' : '/'} className="text-forest-200/80 hover:text-white transition-colors">
                  {isEn ? 'Home' : 'Trang chủ'}
                </Link>
              </li>
              {content?.showPageAbout !== false && (
                <li>
                  <Link href={isEn ? '/en/about' : '/gioi-thieu'} className="text-forest-200/80 hover:text-white transition-colors">
                    {isEn ? 'About Us' : 'Giới thiệu Cẩm Cù'}
                  </Link>
                </li>
              )}
              {content?.showPageSpace !== false && (
                <li>
                  <Link href={isEn ? '/en/space' : '/khong-gian'} className="text-forest-200/80 hover:text-white transition-colors">
                    {isEn ? 'Sanctuary (30 Plates)' : 'Không gian (30 Plates)'}
                  </Link>
                </li>
              )}
              {content?.showPageMenu !== false && (
                <li>
                  <Link href={isEn ? '/en/menu' : '/thuc-don'} className="text-forest-200/80 hover:text-white transition-colors">
                    {isEn ? 'Menu (~67 Items)' : 'Thực đơn (~67 món)'}
                  </Link>
                </li>
              )}
              {content?.showPageReviews !== false && (
                <li>
                  <Link href={isEn ? '/en/reviews' : '/khach-hang'} className="text-forest-200/80 hover:text-white transition-colors">
                    {isEn ? 'Reviews & Stories' : 'Dấu ấn & Đánh giá'}
                  </Link>
                </li>
              )}
              {content?.showPageNews !== false && (
                <li>
                  <Link href={isEn ? '/en/news' : '/su-kien'} className="text-forest-200/80 hover:text-white transition-colors">
                    {isEn ? 'News & FAQ' : 'Tin tức & FAQ'}
                  </Link>
                </li>
              )}
              {content?.showPageContact !== false && (
                <li>
                  <Link href={isEn ? '/en/contact' : '/lien-he'} className="text-forest-200/80 hover:text-white transition-colors">
                    {isEn ? 'Contact & Map' : 'Liên hệ & Chỉ đường'}
                  </Link>
                </li>
              )}
            </ul>
          </div>

          {/* Contact & Hotlines (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs font-sans uppercase tracking-wider text-emerald-400 font-semibold">
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
                  {s.hotlines && s.hotlines.length > 0 ? (
                    s.hotlines.map((h: any, idx: number) => {
                      const displayNum = typeof h === 'string' ? h : (h?.number || h?.rawNumber || '');
                      const rawNum = typeof h === 'string'
                        ? h.replace(/\s+/g, '')
                        : (h?.rawNumber || h?.number?.replace(/\s+/g, '') || '');
                      if (!displayNum) return null;
                      return (
                        <React.Fragment key={rawNum || idx}>
                          {idx > 0 && <span>—</span>}
                          <a
                            href={`tel:${rawNum}`}
                            className="font-mono text-emerald-300 hover:text-white underline font-semibold"
                          >
                            {isEn && (displayNum.startsWith('038') || displayNum.startsWith('077'))
                              ? displayNum.replace(/^0/, '+84 ')
                              : displayNum}
                          </a>
                        </React.Fragment>
                      );
                    })
                  ) : (
                    <>
                      <a
                        href="tel:0382851688"
                        className="font-mono text-emerald-300 hover:text-white underline font-semibold"
                      >
                        {isEn ? '+84 382 851 688' : '0382 851 688'}
                      </a>
                      <span>—</span>
                      <a
                        href="tel:0774659000"
                        className="font-mono text-emerald-300 hover:text-white underline font-semibold"
                      >
                        {isEn ? '+84 774 659 000' : '0774 659 000'}
                      </a>
                    </>
                  )}
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
            <h4 className="text-xs font-sans uppercase tracking-wider text-emerald-400 font-semibold">
              {isEn ? 'OPERATING HOURS (GMT+7)' : 'GIỜ ĐÓN KHÁCH (GMT+7)'}
            </h4>
            <div className="space-y-2.5 text-xs font-sans">
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
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs font-mono">
            <Link
              href="/phap-ly/chinh-sach-bao-mat"
              className="hover:text-emerald-400 underline transition-colors"
            >
              {isEn ? 'Privacy Policy' : 'Chính sách bảo mật'}
            </Link>
            <span>•</span>
            <Link
              href="/phap-ly/chinh-sach-doi-tra"
              className="hover:text-emerald-400 underline transition-colors"
            >
              {isEn ? 'Return Policy' : 'Chính sách đổi trả'}
            </Link>
            <span>•</span>
            <Link
              href="/phap-ly/chinh-sach-bao-hanh"
              className="hover:text-emerald-400 underline transition-colors"
            >
              {isEn ? 'Quality Warranty' : 'Chính sách bảo hành'}
            </Link>
            <span>•</span>
            <Link
              href="/phap-ly/dieu-khoan-su-dung"
              className="hover:text-emerald-400 underline transition-colors"
            >
              {isEn ? 'Terms & Rules' : 'Điều khoản sử dụng'}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
