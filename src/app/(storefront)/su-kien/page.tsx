'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Music,
  Clock,
  Phone,
  ArrowRight,
  Compass,
  Utensils,
  Sparkles,
  Calendar,
  HelpCircle,
  ChevronDown,
  Share2,
  Check,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '@/context/AppContext';
import { FaqItem } from '@/types';
import FooterSection from '@/components/home/FooterSection';
import { EditorialStaggerContainer } from '@/components/motion/EditorialMotion';
import { ScrollLayoutCard3D } from '@/components/motion/ScrollMotion120';
import { InteractiveTiltCard } from '@/components/motion/VividMotion';

export default function SuKienPage() {
  const { data, content, language } = useApp();
  const c = content || data.content;
  const isEn = language === 'en';
  const activeEvents = (data.events || []).filter((e) => e.active);
  const shouldShowEvents = (c?.showNewsEvents !== false) && (data.settings.showEventsSection !== false) && activeEvents.length > 0;
  const shouldShowFaq = c?.showNewsFaq !== false;
  const faqs: FaqItem[] = data.faqs || [];

  const newsEyebrow = isEn && c?.newsEyebrowEn ? c.newsEyebrowEn : (c?.newsEyebrow || (isEn ? 'LATEST PROGRAMS, BLOG & FAQS' : 'CHƯƠNG TRÌNH, TIN TỨC & GIẢI ĐÁP THẮC MẮC'));
  const newsTitle = isEn && c?.newsTitleEn ? c.newsTitleEn : (c?.newsTitle || (isEn ? 'Happenings & News' : 'Nhịp Sống & Sự Kiện'));
  const newsSubtitle = isEn && c?.newsSubtitleEn ? c.newsSubtitleEn : (c?.newsSubtitle || (isEn ? 'Beside Natural Mountain Stream' : 'Bên Bờ Suối Tự Nhiên'));
  const newsIntro = isEn && c?.newsIntroEn ? c.newsIntroEn : (c?.newsIntro || (isEn ? 'Direct live updates from sanctuary management — Weekend acoustic live nights by the stream, seasonal agricultural harvests, and comprehensive guest answers.' : 'Cập nhật trực tiếp từ hệ thống quản lý quán — Đêm nhạc Acoustic cuối tuần bên suối, các chương trình nông sản thảo mộc theo mùa và giải đáp chi tiết mọi thắc mắc.'));

  const [activeFaqCategory, setActiveFaqCategory] = useState<string>('all');
  const [openFaqId, setOpenFaqId] = useState<string | null>('faq-1');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const faqCategories = isEn ? [
    { id: 'all', label: 'All FAQs' },
    { id: 'Đường đi & Đỗ xe', label: 'Directions & Parking' },
    { id: 'Thực đơn xanh sạch', label: 'Botanical Menu' },
    { id: 'Giờ mở cửa', label: 'Operating Hours' },
    { id: 'Họp nhóm & Mang về', label: 'Gatherings & Takeaway' },
  ] : [
    { id: 'all', label: 'Tất cả' },
    { id: 'Đường đi & Đỗ xe', label: 'Đường đi & Đỗ xe' },
    { id: 'Thực đơn xanh sạch', label: 'Thực đơn xanh sạch' },
    { id: 'Giờ mở cửa', label: 'Giờ mở cửa' },
    { id: 'Họp nhóm & Mang về', label: 'Họp nhóm & Mang về' },
  ];

  const filteredFaqs = (activeFaqCategory === 'all'
    ? faqs
    : faqs.filter((f) => f.category === activeFaqCategory || (activeFaqCategory === 'Giờ mở cửa' && f.category === 'Giờ mở cửa & Acoustic'))
  ).filter((f) => !f.question?.includes('Đêm nhạc Acoustic') && !f.questionEn?.includes('Acoustic Live sessions'));

  const toggleFaq = (id: string) => {
    setOpenFaqId(openFaqId === id ? null : id);
  };

  const handleShare = (id: string, title: string) => {
    if (typeof window !== 'undefined') {
      const url = `${window.location.origin}/su-kien#${id}`;
      navigator.clipboard.writeText(url);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  return (
    <main className="min-h-screen pt-[72px] bg-paper text-ink-primary">
      {/* Page Header */}
      <section className="py-12 sm:py-16 px-4 sm:px-8 max-w-7xl mx-auto border-b border-forest-200/60 dark:border-forest-700/50">
        <div className="space-y-3 max-w-3xl">
          <div className="text-xs font-mono uppercase tracking-widest text-accent-botanical font-semibold flex items-center gap-2">
            <span className="w-8 h-px bg-accent-botanical" />
            <span>{newsEyebrow}</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-ink-primary leading-tight">
            {newsTitle} <br />
            <span className="italic font-normal text-accent-botanical">
              {newsSubtitle}
            </span>
          </h1>
          <p className="text-sm sm:text-base text-ink-muted leading-relaxed">
            {newsIntro}
          </p>
        </div>
      </section>

      {/* SECTION 1: EVENTS GRID (Auto-hidden if toggle is OFF or 0 active events) */}
      {shouldShowEvents && (
        <section className="py-14 sm:py-20 px-4 sm:px-8 max-w-7xl mx-auto border-b border-forest-200/60 dark:border-forest-700/50">
          <div className="space-y-3 mb-12">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="text-xs font-mono uppercase tracking-widest text-accent-botanical font-semibold flex items-center gap-2 mb-1">
                  <Music className="w-4 h-4 text-accent-botanical" />
                  <span>
                    {isEn
                      ? `SCHEDULE & HAPPENINGS (${activeEvents.length} PROGRAMS)`
                      : `LỊCH BIỂU DIỄN & HOẠT ĐỘNG (${activeEvents.length} CHƯƠNG TRÌNH)`}
                  </span>
                </div>
                <h2 className="font-serif text-3xl font-bold text-ink-primary">
                  {isEn ? 'Ongoing Programs & Activities' : 'Các Hoạt Động Đang Diễn Ra'}
                </h2>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono text-ink-muted bg-white dark:bg-forest-900 p-2 rounded-xl border border-forest-200 dark:border-forest-700 shadow-subtle">
                <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span>{isEn ? 'Real-time sync from CMS' : 'Đồng bộ thời gian thực từ CMS'}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {activeEvents.map((event) => {
              const title = isEn && event.titleEn ? event.titleEn : event.title;
              const subtitle = isEn && event.subtitleEn ? event.subtitleEn : event.subtitle;
              const badge = isEn && event.badgeEn ? event.badgeEn : (event.badge || 'Event');
              const schedule = isEn && event.dateOrScheduleEn ? event.dateOrScheduleEn : event.dateOrSchedule;
              const description = isEn && event.descriptionEn ? event.descriptionEn : event.description;

              return (
                <ScrollLayoutCard3D key={event.id} delay={0.06} className="h-full">
                  <InteractiveTiltCard maxTilt={3.5} spotlight={true} className="h-full">
                    <article id={event.id} className="h-full bg-white dark:bg-forest-900 rounded-3xl border border-forest-200 dark:border-forest-700 shadow-subtle hover:shadow-elevated hover:border-accent-botanical/60 transition-all duration-300 flex flex-col justify-between overflow-hidden group">
                      <div>
                        {/* Event Cover Photo if Present */}
                        {event.imageUrl ? (
                          <div className="h-52 w-full bg-forest-100 dark:bg-forest-800 relative overflow-hidden border-b border-forest-100 dark:border-forest-800">
                            <img
                              src={event.imageUrl}
                              alt={title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <span className="absolute top-3 right-3 bg-black/85 text-white text-[11px] font-mono px-3 py-1 rounded-full border border-white/20">
                              {badge}
                            </span>
                          </div>
                        ) : (
                          <div className="h-32 bg-forest-100 dark:bg-forest-900 p-6 flex items-center justify-between border-b border-forest-200 dark:border-forest-800">
                            <span className="text-[11px] font-mono uppercase font-bold text-accent-botanical bg-white dark:bg-forest-800 px-3 py-1 rounded-full border border-forest-200 dark:border-forest-700 shadow-xs">
                              {badge}
                            </span>
                            <Music className="w-6 h-6 text-accent-botanical/40" />
                          </div>
                        )}

                        <div className="p-6 sm:p-7 space-y-4">
                          <div className="flex items-center gap-2 text-xs font-mono text-ink-muted">
                            <Clock className="w-3.5 h-3.5 text-accent-botanical flex-shrink-0" />
                            <span className="font-semibold text-accent-earth">{schedule}</span>
                          </div>

                          <h3 className="font-serif text-2xl font-bold text-ink-primary leading-snug group-hover:text-accent-botanical transition-colors">
                            {title}
                          </h3>

                          {subtitle && (
                            <p className="text-xs font-mono text-accent-botanical font-semibold">
                              {subtitle}
                            </p>
                          )}

                          <p className="text-xs sm:text-sm text-ink-muted leading-relaxed whitespace-pre-line">
                            {description}
                          </p>
                        </div>
                      </div>

                      <div className="p-6 sm:p-7 pt-0">
                        <div className="pt-5 border-t border-forest-100 dark:border-forest-800 flex items-center justify-between gap-3">
                          <a
                            href="tel:0382851688"
                            className="flex-1 py-2.5 bg-forest-50 dark:bg-forest-800/80 hover:bg-accent-botanical hover:text-white text-accent-botanical rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 shadow-xs font-mono"
                          >
                            <Phone className="w-3.5 h-3.5" />
                            <span>{isEn ? 'Inquire: 0382 851 688' : 'Hotline: 0382 851 688'}</span>
                          </a>

                          {/* Social Share Button */}
                          <button
                            onClick={() => handleShare(event.id, title)}
                            title="Copy link to event"
                            className="p-2.5 rounded-xl border border-forest-200 dark:border-forest-700 hover:bg-forest-100 dark:hover:bg-forest-800 text-ink-muted transition-colors flex items-center gap-1"
                          >
                            {copiedId === event.id ? (
                              <Check className="w-4 h-4 text-emerald-600" />
                            ) : (
                              <Share2 className="w-4 h-4 text-accent-botanical" />
                            )}
                          </button>
                        </div>
                      </div>
                    </article>
                  </InteractiveTiltCard>
                </ScrollLayoutCard3D>
              );
            })}
          </div>
        </section>
      )}

      {/* SECTION 2: INTERACTIVE FAQ ACCORDION */}
      {shouldShowFaq && (
        <section className="py-16 sm:py-24 px-4 sm:px-8 max-w-5xl mx-auto border-b border-forest-200/60 dark:border-forest-700/50">
        <div className="space-y-4 mb-10 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest-100 dark:bg-forest-800 text-accent-botanical text-xs font-mono font-bold">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>{isEn ? 'FREQUENTLY ASKED QUESTIONS' : 'HỎI ĐÁP THỰC KHÁCH'}</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-ink-primary">
            {isEn ? 'Everything You Need to Know' : 'Những Thắc Mắc Thường Gặp'}
          </h2>
          <p className="text-xs sm:text-sm text-ink-muted leading-relaxed">
            {isEn
              ? 'Quick answers on road access, spacious parking, botanical drinks, Saturday acoustic live, and group gatherings.'
              : 'Giải đáp nhanh về đường dốc vào quán, bãi đậu xe ô tô, hạt cà phê rang mộc, đêm nhạc thứ Bảy và đặt mang về.'}
          </p>

          {/* FAQ Category Filter Buttons */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
            {faqCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveFaqCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-mono transition-colors ${
                  activeFaqCategory === cat.id
                    ? 'bg-accent-botanical text-white font-bold'
                    : 'bg-white dark:bg-forest-900 text-ink-muted hover:text-ink-primary border border-forest-200 dark:border-forest-700'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Accordion List */}
        <div className="space-y-3">
          {filteredFaqs.map((faq) => {
            const isOpen = openFaqId === faq.id;
            const question = isEn && faq.questionEn ? faq.questionEn : faq.question;
            const answer = isEn && faq.answerEn ? faq.answerEn : faq.answer;

            return (
              <div
                key={faq.id}
                className="bg-white dark:bg-forest-900 rounded-2xl border border-forest-200 dark:border-forest-700 shadow-subtle overflow-hidden transition-colors"
              >
                <button
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 group"
                >
                  <span className="font-serif font-bold text-base sm:text-lg text-ink-primary group-hover:text-accent-botanical transition-colors">
                    {question}
                  </span>
                  <div className={`p-1.5 rounded-full bg-forest-50 dark:bg-forest-800 text-accent-botanical transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.24 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 sm:px-6 pb-6 pt-1 text-xs sm:text-sm text-ink-muted leading-relaxed border-t border-forest-100/60 dark:border-forest-800/60">
                        {answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>
      )}

      {/* Bottom Editorial Callout Section */}
      <section className="py-14 sm:py-18 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="bg-white dark:bg-forest-900 rounded-3xl border border-forest-200 dark:border-forest-700 shadow-subtle p-8 sm:p-12 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl">
            <span className="text-xs font-mono uppercase tracking-widest text-accent-botanical font-bold flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span>{isEn ? 'COMPLETE SANCTUARY EXPERIENCE' : 'TRẢI NGHIỆM TRỌN VẸN CÙNG CẨM CÙ HOUSE'}</span>
            </span>
            <h3 className="font-serif text-3xl font-bold text-ink-primary">
              {isEn ? 'Enjoy Crafted Drinks & Visit the Sanctuary' : 'Thưởng Thức Đồ Uống & Ghé Thăm Quán'}
            </h3>
            <p className="text-xs sm:text-sm text-ink-muted leading-relaxed">
              {isEn
                ? 'Join us for a relaxing afternoon beside the waterfall rocks, savor wood-roasted coffee, and immerse yourself in mountain greenery.'
                : 'Dành một buổi chiều thảnh thơi bên ghềnh đá suối mát, thưởng thức tách cà phê muối rang mộc và lắng nghe tiếng suối reo giữa lòng Gia Nghĩa.'}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/thuc-don"
              className="px-6 py-3.5 bg-accent-botanical text-white font-medium text-xs font-mono rounded-xl hover:bg-forest-800 transition-all shadow-md flex items-center justify-center gap-2 group active:scale-95"
            >
              <span>{isEn ? 'Explore Menu (~67 Items)' : 'Xem Thực Đơn (~67 Món)'}</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>

            <Link
              href="/lien-he"
              className="px-6 py-3.5 bg-forest-100 dark:bg-forest-800/80 text-accent-botanical font-medium text-xs font-mono rounded-xl hover:bg-forest-200 dark:hover:bg-forest-700 transition-all shadow-subtle flex items-center justify-center gap-2 active:scale-95 border border-forest-200 dark:border-forest-700"
            >
              <Compass className="w-4 h-4" />
              <span>{isEn ? 'Directions & Contact' : 'Chỉ Đường & Liên Hệ'}</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <FooterSection />
    </main>
  );
}
