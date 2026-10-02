"use client";

import React from "react";
import Link from "next/link";
import { Phone, MapPin, Clock, Coffee, Sparkles, Car, Utensils, ArrowRight } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#F9F8F3] text-stone-800 font-sans selection:bg-[#3E5C46] selection:text-white">
      {/* 1. TOP ANNOUNCEMENT BANNER */}
      <div className="bg-[#2D4233] text-[#F9F8F3] text-xs sm:text-sm py-2 px-4 text-center font-medium">
        🌿 Chào mừng đến với Cẩm Cù House • Giờ mở cửa: T2 - T5 (07:00 - 18:00) | T6 - CN (07:00 - 22:00)
      </div>

      {/* 2. HEADER & NAVIGATION */}
      <header className="sticky top-0 z-50 bg-[#F9F8F3]/90 backdrop-blur-md border-b border-stone-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link href="/" className="flex flex-col">
            <span className="font-serif text-2xl font-bold tracking-tight text-[#2D4233]">
              CẨM CÙ HOUSE
            </span>
            <span className="text-xs text-[#7D5E4A] font-medium tracking-wider uppercase">
              coffee & Food • Gia Nghĩa
            </span>
          </Link>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-1 bg-stone-200/50 p-1.5 rounded-full border border-stone-300/40 text-sm font-medium text-stone-700">
            <Link href="/" className="px-4 py-2 rounded-full bg-white shadow-sm text-[#2D4233]">
              Trang Chủ
            </Link>
            <Link href="/about" className="px-4 py-2 rounded-full hover:text-[#2D4233] transition-colors">
              Giới Thiệu
            </Link>
            <Link href="/space" className="px-4 py-2 rounded-full hover:text-[#2D4233] transition-colors">
              Không Gian Suối
            </Link>
            <Link href="/menu" className="px-4 py-2 rounded-full hover:text-[#2D4233] transition-colors">
              Thực Đơn (50 món)
            </Link>
            <Link href="/contact" className="px-4 py-2 rounded-full hover:text-[#2D4233] transition-colors">
              Chỉ Đường & Liên Hệ
            </Link>
          </nav>

          {/* Hotline CTA (NO BOOKING) */}
          <div className="flex items-center gap-3">
            <a
              href="tel:0382851688"
              className="inline-flex items-center gap-2 bg-[#3E5C46] hover:bg-[#2D4233] text-white text-sm font-semibold px-5 py-2.5 rounded-full shadow-sm transition-all transform active:scale-95"
            >
              <Phone className="w-4 h-4" />
              <span>038 285 1688</span>
            </a>
          </div>
        </div>
      </header>

      {/* 3. HERO SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16 text-center">
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-stone-200/70 text-xs font-semibold uppercase tracking-widest text-[#3E5C46] mb-6">
          <Sparkles className="w-3.5 h-3.5 text-[#7D5E4A]" />
          Tọa độ 11.99° N, 107.69° E • Gia Nghĩa, Đắk Nông
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-[#2D4233] tracking-tight leading-tight max-w-4xl mx-auto mb-6">
          CẨM CÙ HOUSE <br />
          <span className="italic font-normal text-[#7D5E4A] text-3xl sm:text-4xl md:text-5xl">
            Chốn Dừng Chân Mộc Mạc Bên Bờ Suối Đá
          </span>
        </h1>

        {/* Hero Description */}
        <p className="text-stone-600 text-base sm:text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
          Thưởng thức tách cà phê Robusta rang củi nguyên bản, lắng nghe dòng suối róc rách giữa thung lũng xanh thanh bình miền cao nguyên Đắk Nông.
        </p>

        {/* Trust Badges */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs sm:text-sm font-medium text-stone-700 mb-10">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white shadow-sm border border-stone-200/80">
            ⭐ 100% Đề Xuất Hài Lòng
          </span>
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white shadow-sm border border-stone-200/80">
            💵 Giá Bình Dân (20k - 45k)
          </span>
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white shadow-sm border border-stone-200/80">
            🍃 Nguyên Liệu Xanh Sạch
          </span>
        </div>

        {/* Main CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-14">
          <Link
            href="/space"
            className="inline-flex items-center gap-2 bg-[#3E5C46] hover:bg-[#2D4233] text-white font-medium px-7 py-3.5 rounded-full shadow-md transition-all"
          >
            Khám Phá Góc Suối
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/menu"
            className="inline-flex items-center gap-2 bg-white hover:bg-stone-100 text-[#2D4233] font-medium px-7 py-3.5 rounded-full border border-stone-300 shadow-sm transition-all"
          >
            <Utensils className="w-4 h-4" />
            Xem Thực Đơn 50+ Món
          </Link>
          <a
            href="https://maps.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium px-6 py-3.5 rounded-full transition-all"
          >
            <MapPin className="w-4 h-4 text-[#7D5E4A]" />
            Chỉ Đường Tới Quán
          </a>
        </div>

        {/* Hero Image Container (ĐÃ KHỐNG CHẾ KÍCH THƯỚC CHUẨN, KHÔNG BỊ TRÀN) */}
        <div className="relative max-w-5xl mx-auto h-72 sm:h-96 md:h-[480px] rounded-3xl overflow-hidden shadow-2xl border-4 border-white/90">
          <img
            src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80"
            alt="Cẩm Cù House Bên Bờ Suối"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-6 sm:p-10">
            <div className="text-left text-white">
              <span className="text-xs uppercase font-semibold tracking-wider text-white/80">Không Gian Sinh Thái</span>
              <p className="text-lg sm:text-2xl font-serif font-bold">Thung lũng suối xanh & hiên gỗ lợp lá mộc</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. TIỆN ÍCH QUÁN */}
      <section className="bg-white/70 py-16 border-y border-stone-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#2D4233] mb-3">
              Trải Nghiệm Thư Thái Tại Cẩm Cù
            </h2>
            <p className="text-stone-600 text-sm sm:text-base">
              Không ồn ào khói bụi, chỉ có bóng mát cây rừng và tiếng nước chảy rì rào
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-[#F9F8F3] border border-stone-200/80">
              <div className="w-12 h-12 rounded-xl bg-[#3E5C46]/10 text-[#3E5C46] flex items-center justify-center mb-4">
                <Coffee className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-lg text-[#2D4233] mb-2">Robusta Rang Củi</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Hạt cà phê Đắk Nông nguyên bản rang củi thủ công mộc mạc, đậm vị nồng nàn.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#F9F8F3] border border-stone-200/80">
              <div className="w-12 h-12 rounded-xl bg-[#3E5C46]/10 text-[#3E5C46] flex items-center justify-center mb-4">
                <Car className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-lg text-[#2D4233] mb-2">Bãi Xe 4-16 Chỗ</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Đường bê tông rộng rãi, ô tô vào tận cửa và có bãi quay đầu cực kỳ thuận tiện.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#F9F8F3] border border-stone-200/80">
              <div className="w-12 h-12 rounded-xl bg-[#3E5C46]/10 text-[#3E5C46] flex items-center justify-center mb-4">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-lg text-[#2D4233] mb-2">Bàn Sát Mép Suối</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Kê bàn ngay cạnh bờ suối đá mát rượi, lý tưởng để nghỉ ngơi ngâm chân chữa lành.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#F9F8F3] border border-stone-200/80">
              <div className="w-12 h-12 rounded-xl bg-[#3E5C46]/10 text-[#3E5C46] flex items-center justify-center mb-4">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-lg text-[#2D4233] mb-2">Mở Cửa Cả Tuần</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Phục vụ từ 07:00 sáng mỗi ngày, cuối tuần mở tới 22:00 cho đêm nhạc acoustic.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FOOTER */}
      <footer className="bg-[#2D4233] text-stone-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-serif text-2xl font-bold text-white mb-2">CẨM CÙ HOUSE</h3>
            <p className="text-xs text-stone-400 mb-4">Chốn bình yên bên bờ suối đá • TP. Gia Nghĩa, Đắk Nông</p>
            <p className="text-xs text-stone-400">© 2024 Cẩm Cù House coffee & Food. All rights reserved.</p>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-3">Thông Tin Liên Hệ</h4>
            <ul className="text-xs space-y-2 text-stone-300">
              <li>📍 Hẻm 437 Hùng Vương, P. Nghĩa Trung, Gia Nghĩa, Đắk Nông</li>
              <li>📞 Hotline: 038 285 1688 | 077 465 9000</li>
              <li>✉️ Email: thuynhu8788@gmail.com</li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-3">Mạng Xã Hội</h4>
            <div className="flex gap-4 text-xs">
              <a href="https://www.facebook.com/share/1DVLMySW8H/" target="_blank" rel="noopener noreferrer" className="hover:text-white underline">
                Facebook
              </a>
              <a href="https://www.tiktok.com/@camcuhousedaknong" target="_blank" rel="noopener noreferrer" className="hover:text-white underline">
                TikTok
              </a>
              <a href="https://youtube.com/@Cam_Cu_House" target="_blank" rel="noopener noreferrer" className="hover:text-white underline">
                YouTube
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}