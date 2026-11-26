'use client';

import React from 'react';
import Link from 'next/link';
import { PhoneCall, ArrowLeft, UtensilsCrossed, ShieldCheck } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import FooterSection from '@/components/home/FooterSection';

export default function CheckoutOrShowcasePage() {
  const { data, language } = useApp();
  const isEn = language === 'en';
  const commerceEnabled = Boolean(data.commerceSettings?.commerceEnabled ?? data.settings?.commerceEnabled ?? false);

  return (
    <main className="min-h-screen pt-[72px] bg-paper text-ink-primary">
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-moss-soft border border-forest-200 flex items-center justify-center">
          <ShieldCheck className="w-7 h-7 text-accent-botanical" />
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold">
          {commerceEnabled
            ? isEn
              ? 'Order Checkout'
              : 'Đặt Món & Thanh Toán'
            : isEn
            ? 'Streamside Showcase Mode'
            : 'Cẩm Cù House — Chế Độ Giới Thiệu'}
        </h1>
        <p className="text-[15px] text-ink-muted leading-relaxed">
          {isEn
            ? 'Online ordering is currently paused. Please view our 67-item botanical menu or call our hotline directly for fresh preparation and streamside BBQ bookings.'
            : 'Hiện website đang vận hành ở chế độ Giới thiệu (Giai đoạn 1). Quý khách vui lòng xem Thực đơn 67 món hoặc gọi trực tiếp Hotline để được quán phục vụ chu đáo nhất.'}
        </p>
        <div className="flex flex-wrap justify-center gap-3 pt-2">
          <Link
            href={isEn ? '/en/menu' : '/thuc-don'}
            className="px-5 py-3 rounded-xl bg-accent-botanical text-white text-sm font-semibold inline-flex items-center gap-2"
          >
            <UtensilsCrossed className="w-4 h-4" />
            <span>{isEn ? 'Explore 67 Menu Items' : 'Xem Thực Đơn 67 Món'}</span>
          </Link>
          <a
            href="tel:0382851688"
            className="px-5 py-3 rounded-xl bg-moss-soft border border-forest-200 text-ink-primary text-sm font-semibold inline-flex items-center gap-2"
          >
            <PhoneCall className="w-4 h-4 text-accent-earth" />
            <span>Hotline: 0382 851 688</span>
          </a>
        </div>
        <div className="pt-4">
          <Link
            href={isEn ? '/en' : '/'}
            className="inline-flex items-center gap-1.5 text-xs font-mono text-accent-botanical hover:underline"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{isEn ? 'Back to Home' : 'Quay về Trang chủ'}</span>
          </Link>
        </div>
      </div>
      <FooterSection />
    </main>
  );
}
