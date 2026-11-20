'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  MapPin,
  Maximize2,
  ArrowRight,
  Compass,
  UtensilsCrossed,
  BookOpen,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '@/context/AppContext';
import { SpatialPlate } from '@/types';
import FooterSection from '@/components/home/FooterSection';
import { SPRING_PILL_TRANSITION, EDITORIAL_EASE } from '@/components/motion/EditorialMotion';
import { ScrollLayoutCard3D, VelocityScrollGrid, CurtainPhotoReveal } from '@/components/motion/ScrollMotion120';
import { InteractiveTiltCard, MagneticButton } from '@/components/motion/VividMotion';

function PlateCard({
  plate,
  onOpen,
  isEn,
}: {
  plate: SpatialPlate;
  onOpen: () => void;
  isEn: boolean;
}) {
  const [imgError, setImgError] = useState(false);
  const showImage = Boolean(plate.imageUrl && plate.imageUrl.trim() !== '' && !imgError);

  const title = isEn && plate.titleEn ? plate.titleEn : plate.titleVi;
  const chapter = isEn && plate.chapterTitleEn ? plate.chapterTitleEn : plate.chapterTitleVi;
  const location = isEn && plate.locationEn ? plate.locationEn : plate.locationVi;
  const description = isEn && plate.descriptionEn ? plate.descriptionEn : plate.descriptionVi;

  return (
    <InteractiveTiltCard maxTilt={3.5} spotlight={true} className="h-full">
      <ScrollLayoutCard3D
        onClick={onOpen}
        className="group relative bg-white dark:bg-forest-900/60 rounded-2xl border border-forest-200/90 dark:border-forest-700/60 overflow-hidden shadow-subtle hover:shadow-elevated transition-all duration-300 cursor-pointer flex flex-col justify-between h-full"
      >
        {/* Visual Card Canvas */}
        <div className="h-56 sm:h-64 bg-gradient-to-br from-[#2E5A3C]/15 to-[#8C5A3C]/15 dark:from-[#2E5A3C]/30 dark:to-[#1A241E]/50 relative overflow-hidden flex flex-col items-center justify-center border-b border-forest-100 dark:border-forest-800">
          {showImage ? (
            <CurtainPhotoReveal className="w-full h-full">
              <img
                src={plate.imageUrl}
                alt={title}
                onError={() => setImgError(true)}
                className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-600 ease-out"
              />
            </CurtainPhotoReveal>
          ) : (
            <div className="p-6 text-center space-y-2 max-w-xs transform group-hover:scale-[1.03] transition-transform duration-600 ease-out">
              <span className="font-mono text-3xl font-light text-forest-300 dark:text-forest-600 block">
                {plate.id}
              </span>
              <h4 className="font-serif text-lg sm:text-xl font-bold text-ink-primary line-clamp-2 leading-snug">
                {title}
              </h4>
            </div>
          )}

        {/* Figure Tag */}
        <div className="absolute top-3 left-3 bg-white/95 dark:bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-md text-[11px] font-mono font-bold text-accent-botanical border border-forest-200 dark:border-forest-700 shadow-sm z-10">
          {plate.id}
        </div>

        {/* Expand Icon */}
        <div className="absolute top-3 right-3 p-1.5 bg-white/90 dark:bg-black/60 rounded-full text-ink-muted opacity-0 group-hover:opacity-100 transition-opacity shadow-sm z-10">
          <Maximize2 className="w-4 h-4 text-accent-botanical" />
        </div>

        {/* Location badge */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-center gap-1.5 text-[11px] font-mono text-ink-muted bg-white/85 dark:bg-black/70 backdrop-blur-sm py-1.5 rounded-lg shadow-sm z-10">
          <MapPin className="w-3.5 h-3.5 text-accent-botanical flex-shrink-0" />
          <span className="truncate">{location}</span>
        </div>
      </div>

      {/* Editorial Card Body */}
      <div className="p-5 space-y-2">
        <div className="text-[10px] font-mono uppercase tracking-wider text-accent-botanical font-semibold">
          {chapter}
        </div>
        <p className="text-xs text-ink-muted leading-relaxed line-clamp-3">
          {description}
        </p>
        <span className="text-[11px] font-mono text-accent-botanical font-medium block pt-1 group-hover:underline">
          {isEn ? 'Enlarge Plate →' : 'Phóng to chi tiết →'}
        </span>
      </div>
    </ScrollLayoutCard3D>
  </InteractiveTiltCard>
  );
}

export default function KhongGianPage() {
  const { data, openLightbox, language } = useApp();
  const isEn = language === 'en';

  const [selectedChapter, setSelectedChapter] = useState<number | 'all'>('all');

  const totalCount = data.spatialPlates.length || 31;
  const maxFig = `FIG. ${String(totalCount).padStart(2, '0')}`;
  const ch4Range = `FIG. 24 – ${String(totalCount).padStart(2, '0')}`;

  const chapters = isEn
    ? [
        {
          id: 1,
          title: 'Chapter I: The Wax Flower Path',
          range: 'FIG. 01 – 07',
          desc: 'Tree-shaded entryway, blooming porcelain wax flowers, and rustic wooden gate',
        },
        {
          id: 2,
          title: 'Chapter II: Beside the Cool Stream',
          range: 'FIG. 08 – 16',
          desc: 'Streamside dining dipping into water, natural river stones, and misty morning breeze',
        },
        {
          id: 3,
          title: 'Chapter III: Wholesome Pure Flavors',
          range: 'FIG. 17 – 23',
          desc: 'Salt cream Robusta, honeyed male papaya blossom tea, and fresh fruit smoothies',
        },
        {
          id: 4,
          title: 'Chapter IV: Twilight & Weekend Nights',
          range: ch4Range,
          desc: 'Valley golden sunsets, intimate acoustic live sessions, and lantern reflections',
        },
      ]
    : [
        {
          id: 1,
          title: 'Chương I: Lối Nhỏ Vào Vườn',
          range: 'FIG. 01 – 07',
          desc: 'Lối vào xanh rợp bóng cây, hoa cẩm cù bung nở và cổng gỗ mộc mạc',
        },
        {
          id: 2,
          title: 'Chương II: Bên Bờ Suối Mát',
          range: 'FIG. 08 – 16',
          desc: 'Bàn ngắm suối sát mép nước, ghềnh đá cuội tự nhiên và hơi sương mát lành',
        },
        {
          id: 3,
          title: 'Chương III: Hương Vị Xanh Sạch',
          range: 'FIG. 17 – 23',
          desc: 'Tách cà phê muối đậm đà bazan, trà thảo mộc hoa đu đủ đực và ly sinh tố tươi',
        },
        {
          id: 4,
          title: 'Chương IV: Chiều Buông & Đêm Cuối Tuần',
          range: ch4Range,
          desc: 'Hoàng hôn thung lũng, đêm nhạc acoustic mộc và ánh đèn vàng soi bóng suối',
        },
      ];

  const filteredPlates = useMemo(() => {
    if (selectedChapter === 'all') return data.spatialPlates;
    return data.spatialPlates.filter((p) => p.chapter === selectedChapter);
  }, [data.spatialPlates, selectedChapter]);

  return (
    <main className="min-h-screen pt-[72px] bg-paper text-ink-primary">
      {/* Editorial Magazine Hero */}
      <section className="relative overflow-hidden py-14 sm:py-20 border-b border-forest-200/60 dark:border-forest-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="max-w-3xl space-y-4">
            <div className="text-xs font-mono uppercase tracking-widest text-accent-botanical font-semibold flex items-center gap-2">
              <span className="w-8 h-px bg-accent-botanical" />
              <span>{isEn ? `SPATIAL GALLERY • FIG. 01 TO ${maxFig}` : `BỘ SƯU TẬP KHÔNG GIAN • FIG. 01 ĐẾN ${maxFig}`}</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-ink-primary leading-tight">
              {isEn ? (
                <>
                  {totalCount} Streamside <br />
                  <span className="italic font-normal text-accent-botanical">Spatial Plates</span>
                </>
              ) : (
                <>
                  {totalCount} Bản Khắc Không Gian <br />
                  <span className="italic font-normal text-accent-botanical">Bên Bờ Suối Mát</span>
                </>
              )}
            </h1>

            <p className="font-serif text-lg sm:text-xl text-accent-earth italic">
              {isEn
                ? '“Where each rustic frame captures the quiet poetry of flowing water and wax plant canopies”'
                : '“Nơi mỗi góc quán mộc mạc ghi lại vẻ đẹp tĩnh lặng của làn nước suối và vòm lá Cẩm Cù”'}
            </p>

            <p className="text-sm sm:text-base text-ink-muted leading-relaxed">
              {isEn
                ? `Explore all ${totalCount} curated visual plates of Cẩm Cù House organized across 4 chapters. Click any frame to inspect details, botanical coordinates, and high-resolution imagery in full-screen lightbox.`
                : `Khám phá trọn vẹn ${totalCount} bản khắc thị giác của Cẩm Cù House qua 4 chương không gian. Nhấn vào bất kỳ tấm hình nào để xem chi tiết tọa độ, câu chuyện thực vật và chế độ phóng to toàn màn hình.`}
            </p>
          </div>
        </div>
      </section>

      {/* Main Spatial Gallery Section */}
      <section className="py-14 sm:py-20 px-4 sm:px-8 max-w-7xl mx-auto">
        {/* Chapter Filter Controls */}
        <div className="space-y-6 mb-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-1">
              <div className="text-xs font-mono uppercase tracking-widest text-accent-botanical font-semibold flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isEn ? 'FILTER BY CHAPTER' : 'PHÂN LOẠI THEO CHƯƠNG'}</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-ink-primary">
                {isEn ? 'Curated Visual Journey' : 'Hành Trình Khám Phá Thị Giác'}
              </h2>
            </div>

            {/* Interactive Chapter Filter Tabs with Gliding Pill */}
            <div className="flex flex-wrap items-center gap-1.5 bg-white dark:bg-forest-900/60 p-1.5 rounded-2xl border border-forest-200 dark:border-forest-700 shadow-subtle">
              <button
                onClick={() => setSelectedChapter('all')}
                className={`relative px-3.5 py-2 rounded-xl text-xs font-mono font-medium transition-colors ${
                  selectedChapter === 'all'
                    ? 'text-white font-semibold'
                    : 'text-ink-muted hover:text-ink-primary'
                }`}
              >
                {selectedChapter === 'all' && (
                  <motion.span
                    layoutId="khong-gian-chapter-pill"
                    className="absolute inset-0 rounded-xl bg-accent-botanical shadow-sm -z-10"
                    transition={SPRING_PILL_TRANSITION}
                  />
                )}
                <span className="relative z-10">{isEn ? `All (${totalCount} Plates)` : `Tất cả (${totalCount} Plates)`}</span>
              </button>
              {chapters.map((ch) => {
                const isChActive = selectedChapter === ch.id;
                return (
                  <button
                    key={ch.id}
                    onClick={() => setSelectedChapter(ch.id)}
                    className={`relative px-3 py-2 rounded-xl text-xs font-mono font-medium transition-colors ${
                      isChActive
                        ? 'text-white font-semibold'
                        : 'text-ink-muted hover:text-ink-primary'
                    }`}
                  >
                    {isChActive && (
                      <motion.span
                        layoutId="khong-gian-chapter-pill"
                        className="absolute inset-0 rounded-xl bg-accent-botanical shadow-sm -z-10"
                        transition={SPRING_PILL_TRANSITION}
                      />
                    )}
                    <span className="relative z-10">
                      {isEn ? `Chapter ${ch.id}` : `Chương ${ch.id}`} ({ch.range})
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Chapter Overview Banner */}
          {selectedChapter !== 'all' && (
            <div className="p-4 sm:p-5 bg-forest-50/80 dark:bg-forest-950/40 rounded-2xl border border-forest-200 dark:border-forest-700 text-xs text-ink-muted flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fadeIn">
              <div className="space-y-0.5">
                <span className="font-mono font-bold text-accent-botanical uppercase">
                  {chapters.find((c) => c.id === selectedChapter)?.title}
                </span>
                <p className="font-serif italic text-ink-primary">
                  {chapters.find((c) => c.id === selectedChapter)?.desc}
                </p>
              </div>
              <span className="font-mono text-ink-muted text-[11px] self-start sm:self-auto bg-white dark:bg-forest-900 px-3 py-1 rounded-lg border border-forest-200 dark:border-forest-700">
                {chapters.find((c) => c.id === selectedChapter)?.range}
              </span>
            </div>
          )}
        </div>

        {/* Clean Responsive Grid with layout reflow and 120fps velocity skew */}
        <VelocityScrollGrid>
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <AnimatePresence mode="popLayout">
              {filteredPlates.map((plate) => (
                <motion.div
                  layout
                  key={plate.id}
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.32, ease: EDITORIAL_EASE }}
                >
                  <PlateCard
                    plate={plate}
                    onOpen={() => openLightbox(plate)}
                    isEn={isEn}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </VelocityScrollGrid>

        {/* Bottom CTAs */}
        <div className="mt-16 text-center flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/gioi-thieu"
            className="px-6 py-3.5 bg-white dark:bg-forest-900 text-ink-primary rounded-xl text-xs font-mono font-bold hover:bg-forest-50 border border-forest-200 dark:border-forest-700 transition-colors shadow-subtle flex items-center gap-2"
          >
            <BookOpen className="w-4 h-4 text-accent-botanical" />
            <span>{isEn ? 'Read Sanctuary Story & Origins' : 'Tìm hiểu Câu chuyện Cội Nguồn'}</span>
          </Link>
          <Link href="/thuc-don">
            <MagneticButton className="px-6 py-3.5 bg-accent-botanical text-white rounded-xl text-xs font-mono font-bold hover:bg-forest-800 transition-colors shadow-subtle flex items-center gap-2">
              <UtensilsCrossed className="w-4 h-4" />
              <span>{isEn ? 'Explore Botanical Menu (~67 Items)' : 'Khám phá Thực đơn (~67 món)'}</span>
              <ArrowRight className="w-4 h-4" />
            </MagneticButton>
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
