'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Droplet,
  Sprout,
  Heart,
  MapPin,
  Maximize2,
  BookOpen,
  Sparkles,
  Users,
  Compass,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '@/context/AppContext';
import { SpatialPlate } from '@/types';
import FooterSection from '@/components/home/FooterSection';
import { SPRING_PILL_TRANSITION, EDITORIAL_EASE, EditorialDivider } from '@/components/motion/EditorialMotion';
import {
  ScrollLayoutCard3D,
  ScrollParallaxFrame,
  EditorialDivider120,
} from '@/components/motion/ScrollMotion120';

export default function GioiThieuPage() {
  const { data, content, language } = useApp();
  const c = content || data.content;
  const isEn = language === 'en';

  const [activeTab, setActiveTab] = useState<'all' | 'story' | 'team'>('all');

  const brandStoryTitle = isEn && c?.brandStoryTitleEn ? c.brandStoryTitleEn : (c?.brandStoryTitle || 'Nơi Dòng Suối Ôm Lấy Khu Vườn Cẩm Cù');
  const brandStorySubtitle = isEn && c?.brandStorySubtitleEn ? c.brandStorySubtitleEn : (c?.brandStorySubtitle || 'Câu Chuyện Về Đất Đỏ Bazan, Con Suối Nhỏ & Giọt Cà Phê Mộc');
  const brandStoryContent = isEn && c?.brandStoryContentEn ? c.brandStoryContentEn : (c?.brandStoryContent || 'Đăk Nông không chỉ có thác đổ hùng vĩ và bạt ngàn nương rẫy...');
  const brandStoryPhilosophy = isEn && c?.brandStoryPhilosophyEn ? c.brandStoryPhilosophyEn : (c?.brandStoryPhilosophy || 'Triết lý của chúng tôi rất giản dị: "Xanh - Lành - Thuần Khiết"...');

  const visionTitle = isEn && c?.visionTitleEn ? c.visionTitleEn : (c?.visionTitle || 'Tầm Nhìn & Sứ Mệnh Sinh Thái');
  const visionDesc = isEn && c?.visionDescEn ? c.visionDescEn : (c?.visionDesc || 'Trở thành điểm hẹn sinh thái biểu trưng của TP. Gia Nghĩa — nơi gìn giữ vẻ đẹp nguyên bản của dòng suối rừng và tôn vinh nông sản thảo mộc tự nhiên Đăk Nông.');

  const teamMembers = data.teamMembers || [];

  return (
    <main className="min-h-screen pt-[72px] bg-paper text-ink-primary">
      {/* Editorial Magazine Hero */}
      <section className="relative overflow-hidden py-14 sm:py-20 border-b border-forest-200/60 dark:border-forest-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="max-w-3xl space-y-4">
            <div className="text-xs font-mono uppercase tracking-widest text-accent-botanical font-semibold flex items-center gap-2">
              <span className="w-8 h-px bg-accent-botanical" />
              <span>{isEn ? 'THE SANCTUARY CHRONICLES • ABOUT US' : 'HÀNH TRÌNH KHỞI SINH • GIỚI THIỆU QUÁN'}</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-ink-primary leading-tight">
              {brandStoryTitle}
            </h1>

            <p className="font-serif text-lg sm:text-xl text-accent-earth italic">
              &ldquo;{brandStorySubtitle}&rdquo;
            </p>

            <p className="text-sm sm:text-base text-ink-muted leading-relaxed">
              {isEn
                ? 'Nestled down Alley 437 Hung Vuong in Dong Gia Nghia, Lam Dong, Cẩm Cù House is an ecological haven preserving natural stream waterfalls, native volcanic basalt coffee, and porcelain wax flowers.'
                : 'Ẩn mình dưới con dốc rợp bóng cây tại Hẻm 437 Hùng Vương, Đông Gia Nghĩa, Lâm Đồng, Cẩm Cù House là chốn dừng chân bình yên gìn giữ trọn vẹn vẻ đẹp hoang sơ của con suối rừng, giọt cà phê rang củi mộc bazan và những giàn hoa lan Cẩm Cù thanh khiết.'}
            </p>

            {/* Navigation Filter Tabs with Gliding Pill */}
            <div className="pt-4 flex flex-wrap items-center gap-2">
              <button
                onClick={() => setActiveTab('all')}
                className={`relative px-4 py-2 rounded-xl text-xs font-mono font-medium transition-colors ${
                  activeTab === 'all'
                    ? 'text-white font-semibold'
                    : 'bg-white dark:bg-forest-900/60 text-ink-muted hover:text-ink-primary border border-forest-200 dark:border-forest-700'
                }`}
              >
                {activeTab === 'all' && (
                  <motion.span
                    layoutId="gioithieu-tab-pill"
                    className="absolute inset-0 rounded-xl bg-accent-botanical shadow-sm -z-10"
                    transition={SPRING_PILL_TRANSITION}
                  />
                )}
                <span>{isEn ? 'Complete Overview' : 'Toàn bộ tổng quan'}</span>
              </button>

              <button
                onClick={() => setActiveTab('story')}
                className={`relative px-4 py-2 rounded-xl text-xs font-mono font-medium transition-colors ${
                  activeTab === 'story'
                    ? 'text-white font-semibold'
                    : 'bg-white dark:bg-forest-900/60 text-ink-muted hover:text-ink-primary border border-forest-200 dark:border-forest-700'
                }`}
              >
                {activeTab === 'story' && (
                  <motion.span
                    layoutId="gioithieu-tab-pill"
                    className="absolute inset-0 rounded-xl bg-accent-botanical shadow-sm -z-10"
                    transition={SPRING_PILL_TRANSITION}
                  />
                )}
                <span>{isEn ? 'Origin Story' : 'Câu chuyện khởi sinh'}</span>
              </button>

              <button
                onClick={() => setActiveTab('team')}
                className={`relative px-4 py-2 rounded-xl text-xs font-mono font-medium transition-colors ${
                  activeTab === 'team'
                    ? 'text-white font-semibold'
                    : 'bg-white dark:bg-forest-900/60 text-ink-muted hover:text-ink-primary border border-forest-200 dark:border-forest-700'
                }`}
              >
                {activeTab === 'team' && (
                  <motion.span
                    layoutId="gioithieu-tab-pill"
                    className="absolute inset-0 rounded-xl bg-accent-botanical shadow-sm -z-10"
                    transition={SPRING_PILL_TRANSITION}
                  />
                )}
                <span>{isEn ? 'Core Team' : 'Đội ngũ tâm huyết'}</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 1: CÂU CHUYỆN KHỞI SINH & TRIẾT LÝ */}
      {(activeTab === 'all' || activeTab === 'story') && (
        <section className="py-16 sm:py-24 px-4 sm:px-8 max-w-7xl mx-auto border-b border-forest-200/60 dark:border-forest-700/50">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            <div className="lg:col-span-5 space-y-6">
              <div className="text-xs font-mono uppercase tracking-widest text-accent-botanical font-semibold flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-accent-botanical" />
                <span>{isEn ? 'SANCTUARY ORIGINS' : 'KHỞI NGUỒN KHÔNG GIAN'}</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-ink-primary leading-tight">
                {isEn ? 'A Green Valley In The Heart Of Gia Nghia' : 'Một Thung Lũng Xanh Giữa Lòng Phố Núi'}
              </h2>
              <p className="text-sm text-ink-muted leading-relaxed whitespace-pre-line">
                {brandStoryContent}
              </p>
              <div className="p-5 bg-forest-100/70 dark:bg-forest-900/50 rounded-2xl border border-forest-200 dark:border-forest-700 text-xs font-mono text-ink-muted leading-relaxed">
                <span className="font-bold text-ink-primary block mb-1">
                  {isEn ? 'Cẩm Cù Philosophy:' : 'Triết lý Cẩm Cù:'}
                </span>
                {brandStoryPhilosophy}
              </div>
            </div>

            {/* Three Botanical Pillars */}
            <div className="lg:col-span-7 space-y-6">
              {c?.brandStoryImageUrl && (
                <div className="h-64 sm:h-72 w-full rounded-2xl overflow-hidden shadow-subtle border border-forest-200 dark:border-forest-700">
                  <img
                    src={c.brandStoryImageUrl}
                    alt={brandStoryTitle}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {/* Pillar 1 */}
                <ScrollLayoutCard3D delay={0.05} className="h-full">
                  <div className="p-6 bg-white dark:bg-forest-900/70 rounded-2xl border border-forest-200/80 dark:border-forest-700/60 shadow-subtle hover:border-accent-botanical/60 transition-all space-y-3 h-full">
                    <div className="w-10 h-10 rounded-xl bg-forest-100 dark:bg-forest-800 text-accent-botanical flex items-center justify-center">
                      <Droplet className="w-5 h-5" />
                    </div>
                    <h3 className="font-serif text-xl font-bold text-ink-primary">
                      {isEn ? 'Natural Mountain Stream' : 'Con Suối Tự Nhiên'}
                    </h3>
                    <p className="text-xs text-ink-muted leading-relaxed">
                      {isEn
                        ? 'Pure transparent freshwater cascading over basalt river boulders, delivering year-round coolness 3–4°C lower than city streets.'
                        : 'Mặt nước trong vắt len qua những ghềnh đá cuội tự nhiên, mang lại luồng gió mát lành quanh năm, nhiệt độ luôn thấp hơn phố xá 3–4°C.'}
                    </p>
                  </div>
                </ScrollLayoutCard3D>

                {/* Pillar 2 */}
                <ScrollLayoutCard3D delay={0.1} className="h-full">
                  <div className="p-6 bg-white dark:bg-forest-900/70 rounded-2xl border border-forest-200/80 dark:border-forest-700/60 shadow-subtle hover:border-accent-botanical/60 transition-all space-y-3 h-full">
                    <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-accent-earth flex items-center justify-center">
                      <Sprout className="w-5 h-5" />
                    </div>
                    <h3 className="font-serif text-xl font-bold text-ink-primary">
                      {isEn ? 'Dak Nong Basalt Coffee' : 'Cà Phê Bazan Đăk Nông'}
                    </h3>
                    <p className="text-xs text-ink-muted leading-relaxed">
                      {isEn
                        ? 'Native Robusta beans nourished by mineral-rich volcanic red soil, traditionally wood-roasted to preserve intense botanical depth.'
                        : 'Hạt Robusta bản địa sinh trưởng trên đất đỏ núi lửa bazan giàu khoáng chất, được rang củi mộc theo bí quyết truyền thống đậm đà và sâu lắng.'}
                    </p>
                  </div>
                </ScrollLayoutCard3D>

                {/* Pillar 3 */}
                <ScrollLayoutCard3D delay={0.15} className="h-full">
                  <div className="p-6 bg-white dark:bg-forest-900/70 rounded-2xl border border-forest-200/80 dark:border-forest-700/60 shadow-subtle hover:border-accent-botanical/60 transition-all space-y-3 h-full">
                    <div className="w-10 h-10 rounded-xl bg-forest-100 dark:bg-forest-800 text-accent-botanical flex items-center justify-center">
                      <Heart className="w-5 h-5" />
                    </div>
                    <h3 className="font-serif text-xl font-bold text-ink-primary">
                      {isEn ? 'Pure Botanical Tonics' : 'Thảo Mộc Xanh Sạch'}
                    </h3>
                    <p className="text-xs text-ink-muted leading-relaxed">
                      {isEn
                        ? 'Home garden remedies of male papaya blossoms with forest honey, fresh highland ginger, and cold-pressed kale to detoxify and revive.'
                        : 'Những bài thuốc dân gian từ hoa đu đủ đực chưng mật ong rừng, gừng tươi, cải Kale hữu cơ thanh lọc cơ thể và nuôi dưỡng sức khỏe an lành.'}
                    </p>
                  </div>
                </ScrollLayoutCard3D>
              </div>

              {/* Ecological Vision Box */}
              <div className="p-6 rounded-2xl bg-gradient-to-r from-forest-50 to-forest-100/60 dark:from-forest-950/60 dark:to-forest-900/40 border border-forest-200 dark:border-forest-700/60 space-y-2">
                <span className="font-mono text-xs uppercase tracking-wider text-accent-botanical font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  <span>{visionTitle}</span>
                </span>
                <p className="text-xs sm:text-sm text-ink-muted leading-relaxed">
                  {visionDesc}
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* SECTION 2: ĐỘI NGŨ TÂM HUYẾT (TEAM MEMBERS) */}
      {(activeTab === 'all' || activeTab === 'team') && teamMembers.length > 0 && (
        <section className="py-16 sm:py-20 px-4 sm:px-8 max-w-7xl mx-auto border-b border-forest-200/60 dark:border-forest-700/50">
          <div className="space-y-3 mb-12 max-w-2xl">
            <div className="text-xs font-mono uppercase tracking-widest text-accent-botanical font-semibold flex items-center gap-2">
              <Users className="w-4 h-4 text-accent-botanical" />
              <span>{isEn ? 'PEOPLE BEHIND THE SANCTUARY' : 'CON NGƯỜI CẨM CÙ HOUSE'}</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-ink-primary">
              {isEn ? 'Our Dedicated Team' : 'Đội Ngũ Tâm Huyết Bên Suối'}
            </h2>
            <p className="text-xs sm:text-sm text-ink-muted leading-relaxed">
              {isEn
                ? 'Those who nurture the porcelain wax vines every morning, hand-roast each coffee batch, and bring heartfelt hospitality to your table.'
                : 'Những con người ngày ngày chăm chút từng nhành hoa cẩm cù, tự tay rang củi từng mẻ hạt bazan và gửi gắm sự ân cần vào từng tách đồ uống.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamMembers.map((member, idx) => {
              const name = isEn && member.nameEn ? member.nameEn : member.name;
              const role = isEn && member.roleEn ? member.roleEn : member.role;
              const bio = isEn && member.bioEn ? member.bioEn : member.bio;

              return (
                <ScrollLayoutCard3D key={member.id} delay={idx * 0.08} className="h-full">
                  <div className="h-full p-6 sm:p-7 bg-white dark:bg-forest-900/60 rounded-3xl border border-forest-200/90 dark:border-forest-700/60 shadow-subtle hover:shadow-elevated transition-all flex flex-col justify-between space-y-4">
                    <div className="space-y-4">
                      {/* Avatar */}
                      <div className="w-20 h-20 rounded-2xl bg-forest-100 dark:bg-forest-800 border border-forest-200 dark:border-forest-700 overflow-hidden flex items-center justify-center">
                        {member.avatarUrl ? (
                          <img src={member.avatarUrl} alt={name} className="w-full h-full object-cover" />
                        ) : (
                          <Users className="w-8 h-8 text-accent-botanical" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-serif text-xl font-bold text-ink-primary">{name}</h3>
                        <p className="text-xs font-mono text-accent-botanical font-semibold mt-0.5">{role}</p>
                      </div>
                      <p className="text-xs text-ink-muted leading-relaxed">{bio}</p>
                    </div>

                    <div className="pt-3 border-t border-forest-100 dark:border-forest-800 flex items-center gap-1.5 text-[11px] font-mono text-forest-400">
                      <CheckCircle2 className="w-3.5 h-3.5 text-accent-botanical" />
                      <span>{isEn ? 'Sanctuary Artisan' : 'Nghệ nhân Cẩm Cù'}</span>
                    </div>
                  </div>
                </ScrollLayoutCard3D>
              );
            })}
          </div>
        </section>
      )}

      {/* SECTION 3: LIÊN KẾT ĐẾN BỘ SƯU TẬP 30 BẢN KHẮC KHÔNG GIAN BÊN SUỐI */}
      <section className="py-16 sm:py-24 px-4 sm:px-8 max-w-7xl mx-auto border-t border-forest-200/60 dark:border-forest-700/50">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-forest-50 via-white to-forest-100/60 dark:from-forest-950/80 dark:via-forest-900/60 dark:to-forest-950/90 border border-forest-200/90 dark:border-forest-700/70 shadow-elevated flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-2xl text-left">
            <div className="text-xs font-mono uppercase tracking-widest text-accent-botanical font-bold flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-accent-botanical" />
              <span>{isEn ? 'DEDICATED SPATIAL GALLERY' : 'BỘ SƯU TẬP KHÔNG GIAN RIÊNG BIỆT'}</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-ink-primary">
              {isEn ? 'Explore All Streamside Spatial Plates' : 'Khám Phá Toàn Bộ Góc Ảnh Không Gian Bên Bờ Suối'}
            </h2>
            <p className="text-sm text-ink-muted leading-relaxed">
              {isEn
                ? 'From shaded garden pathways and waterside tables to male papaya blossom teapots and acoustic starlight evenings. Organized across 4 curated chapters with high-resolution lightbox.'
                : 'Từ lối vào rợp bóng hoa cẩm cù, bàn ngắm suối sát mép nước, ấm trà hoa đu đủ đực đến hoàng hôn buông và đêm nhạc acoustic bên bờ suối. Toàn bộ các bản khắc thị giác đã được tổng hợp tại trang Không gian riêng.'}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <Link
              href="/khong-gian"
              className="px-8 py-4 bg-accent-botanical text-white rounded-2xl text-sm font-mono font-bold hover:bg-forest-800 transition-all shadow-float flex items-center gap-2.5 group"
            >
              <span>{isEn ? 'View Spatial Plates →' : 'Khám phá bộ ảnh không gian bên suối →'}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Bottom Navigation CTAs */}
        <div className="mt-14 text-center flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/thuc-don"
            className="px-6 py-3.5 bg-accent-botanical text-white rounded-xl text-xs font-mono font-bold hover:bg-forest-800 transition-colors shadow-subtle flex items-center gap-2"
          >
            <span>{isEn ? 'Explore Botanical Menu (~67 Items)' : 'Khám phá Thực đơn (~67 món)'}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/lien-he"
            className="px-6 py-3.5 bg-white dark:bg-forest-900 text-ink-primary rounded-xl text-xs font-mono font-bold hover:bg-forest-50 border border-forest-200 dark:border-forest-700 transition-colors shadow-subtle flex items-center gap-2"
          >
            <Compass className="w-4 h-4 text-accent-botanical" />
            <span>{isEn ? 'Get Directions on Google Maps' : 'Chỉ đường Google Maps đến quán'}</span>
          </Link>
        </div>
      </section>

      {/* Footer Section */}
      <FooterSection />
    </main>
  );
}

