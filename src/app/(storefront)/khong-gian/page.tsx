'use client';

import React, { useState, useMemo, useEffect } from 'react';
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
import { useApp } from '@/context/AppContext';
import { SpatialPlate } from '@/types';
import FooterSection from '@/components/home/FooterSection';

function PlateCard({
  plate,
  onOpen,
  isEn,
}: {
  plate: SpatialPlate;
  onOpen: () => void;
  isEn: boolean;
}) {
  const figNum = plate.id.replace(/[^0-9]/g, '').padStart(2, '0');
  const defaultUrl = plate.imageUrl || `/uploads/gallery/fig-${figNum || '01'}.jpg`;
  const [imgSrc, setImgSrc] = useState(defaultUrl);

  useEffect(() => {
    if (plate.imageUrl) {
      setImgSrc(plate.imageUrl);
    } else {
      setImgSrc(`/uploads/gallery/fig-${figNum || '01'}.jpg`);
    }
  }, [plate.imageUrl, figNum]);

  const handleImageError = () => {
    const fallbackPath = figNum
      ? `/uploads/gallery/fig-${figNum}.jpg`
      : '/uploads/gallery/fig-01.jpg';

    if (imgSrc !== fallbackPath) {
      setImgSrc(fallbackPath);
    } else if (imgSrc !== '/uploads/gallery/fig-01.jpg') {
      setImgSrc('/uploads/gallery/fig-01.jpg');
    }
  };

  const title = isEn && plate.titleEn ? plate.titleEn : plate.titleVi;
  const chapter = isEn && plate.chapterTitleEn ? plate.chapterTitleEn : plate.chapterTitleVi;
  const location = isEn && plate.locationEn ? plate.locationEn : plate.locationVi;
  const description = isEn && plate.descriptionEn ? plate.descriptionEn : plate.descriptionVi;

  return (
    <div
      onClick={onOpen}
      className="group relative bg-white dark:bg-forest-900 rounded-2xl border border-forest-200 dark:border-forest-700 overflow-hidden shadow-subtle hover:shadow-elevated transition-shadow duration-200 cursor-pointer flex flex-col justify-between h-full"
    >
      {/* 16:10 Solid Image Container - Direct always-visible rendering with zero clip-path */}
      <div className="relative w-full aspect-[16/10] overflow-hidden bg-forest-100 dark:bg-forest-800 border-b border-forest-200 dark:border-forest-700">
        <img
          src={imgSrc}
          alt={title}
          loading="lazy"
          decoding="async"
          onError={handleImageError}
          className="w-full h-full object-cover block opacity-100 group-hover:scale-105 transition-transform duration-300 ease-out"
        />

        {/* Figure Tag - Solid Opaque */}
        <div className="absolute top-3 left-3 bg-white dark:bg-forest-900 px-2.5 py-1 rounded-md text-[11px] font-mono font-bold text-accent-botanical border border-forest-200 dark:border-forest-700 shadow-sm z-10">
          {plate.id}
        </div>

        {/* Expand Icon - Solid Opaque */}
        <div className="absolute top-3 right-3 p-1.5 bg-white dark:bg-forest-900 rounded-full text-ink-muted opacity-0 group-hover:opacity-100 transition-opacity shadow-sm z-10">
          <Maximize2 className="w-4 h-4 text-accent-botanical" />
        </div>

        {/* Location badge - Solid Opaque */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-center gap-1.5 text-[11px] font-mono text-ink-primary bg-white dark:bg-forest-900 py-1.5 px-2.5 rounded-lg border border-forest-200 dark:border-forest-700 shadow-sm z-10">
          <MapPin className="w-3.5 h-3.5 text-accent-botanical flex-shrink-0" />
          <span className="truncate">{location}</span>
        </div>
      </div>

      {/* Editorial Card Body - Solid Opaque */}
      <div className="p-5 space-y-2 bg-white dark:bg-forest-900">
        <div className="text-[10px] font-mono uppercase tracking-wider text-accent-botanical font-semibold">
          {chapter}
        </div>
        <h3 className="font-serif text-base font-bold text-ink-primary line-clamp-1">
          {title}
        </h3>
        <p className="text-xs text-ink-muted leading-relaxed line-clamp-3">
          {description}
        </p>
        <span className="text-[11px] font-mono text-accent-botanical font-medium block pt-1 group-hover:underline">
          {isEn ? 'Enlarge Plate →' : 'Phóng to chi tiết →'}
        </span>
      </div>
    </div>
  );
}

export default function KhongGianPage() {
  const { data, content, openLightbox, language } = useApp();
  const c = content || data.content;
  const isEn = language === 'en';

  const [selectedChapter, setSelectedChapter] = useState<number | 'all'>('all');

  const totalCount = data.spatialPlates.length || 31;
  const maxFig = `FIG. ${String(totalCount).padStart(2, '0')}`;
  const ch4Range = `FIG. 24 – ${String(totalCount).padStart(2, '0')}`;

  const spaceEyebrow = isEn && c?.spaceEyebrowEn ? c.spaceEyebrowEn : (c?.spaceEyebrow || (isEn ? `SPATIAL GALLERY • FIG. 01 TO ${maxFig}` : `BỘ SƯU TẬP KHÔNG GIAN • FIG. 01 ĐẾN ${maxFig}`));
  const spaceTitle = isEn && c?.spaceTitleEn ? c.spaceTitleEn : (c?.spaceTitle || (isEn ? `${totalCount} Streamside Spatial Plates` : `${totalCount} Bản Khắc Không Gian Bên Bờ Suối Mát`));
  const spaceSubtitle = isEn && c?.spaceSubtitleEn ? c.spaceSubtitleEn : (c?.spaceSubtitle || (isEn ? '“Where each rustic frame captures the quiet poetry of flowing water and wax plant canopies”' : '“Nơi mỗi góc quán mộc mạc ghi lại vẻ đẹp tĩnh lặng của làn nước suối và vòm lá Cẩm Cù”'));
  const spaceIntro = isEn && c?.spaceIntroEn ? c.spaceIntroEn : (c?.spaceIntro || (isEn ? `Explore all ${totalCount} curated visual plates of Cẩm Cù House organized across 4 chapters. Click any frame to inspect details, botanical coordinates, and high-resolution imagery in full-screen lightbox.` : `Khám phá trọn vẹn ${totalCount} bản khắc thị giác của Cẩm Cù House qua 4 chương không gian. Nhấn vào bất kỳ tấm hình nào để xem chi tiết tọa độ, câu chuyện thực vật và chế độ phóng to toàn màn hình.`));

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
      {/* Editorial Magazine Hero - Solid Opaque */}
      <section className="relative overflow-hidden py-14 sm:py-20 border-b border-forest-200 dark:border-forest-700 bg-paper">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="max-w-3xl space-y-4">
            <div className="text-xs font-mono uppercase tracking-widest text-accent-botanical font-semibold flex items-center gap-2">
              <span className="w-8 h-px bg-accent-botanical" />
              <span>{spaceEyebrow}</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-ink-primary leading-tight">
              {spaceTitle}
            </h1>

            <p className="font-serif text-lg sm:text-xl text-accent-earth italic">
              {spaceSubtitle}
            </p>

            <p className="text-sm sm:text-base text-ink-muted leading-relaxed">
              {spaceIntro}
            </p>

            {c?.spaceHeroBanner && (
              <div className="pt-4">
                <div className="w-full aspect-[21/9] sm:aspect-[24/9] rounded-3xl overflow-hidden border border-forest-200 dark:border-forest-700 shadow-elevated bg-forest-100 dark:bg-forest-900">
                  <img
                    src={c.spaceHeroBanner}
                    alt={spaceTitle}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}
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

            {/* Solid Chapter Filter Tabs */}
            <div className="flex flex-wrap items-center gap-1.5 bg-white dark:bg-forest-900 p-1.5 rounded-2xl border border-forest-200 dark:border-forest-700 shadow-subtle">
              <button
                onClick={() => setSelectedChapter('all')}
                className={`px-3.5 py-2 rounded-xl text-xs font-mono font-medium transition-colors ${
                  selectedChapter === 'all'
                    ? 'bg-accent-botanical text-white font-semibold'
                    : 'text-ink-muted hover:text-ink-primary'
                }`}
              >
                {isEn ? `All (${totalCount} Plates)` : `Tất cả (${totalCount} Plates)`}
              </button>
              {chapters.map((ch) => {
                const isChActive = selectedChapter === ch.id;
                return (
                  <button
                    key={ch.id}
                    onClick={() => setSelectedChapter(ch.id)}
                    className={`px-3 py-2 rounded-xl text-xs font-mono font-medium transition-colors ${
                      isChActive
                        ? 'bg-accent-botanical text-white font-semibold'
                        : 'text-ink-muted hover:text-ink-primary'
                    }`}
                  >
                    {isEn ? `Chapter ${ch.id}` : `Chương ${ch.id}`} ({ch.range})
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Chapter Overview Banner - Solid Opaque */}
          {selectedChapter !== 'all' && (
            <div className="p-4 sm:p-5 bg-forest-50 dark:bg-forest-950 rounded-2xl border border-forest-200 dark:border-forest-700 text-xs text-ink-muted flex flex-col sm:flex-row sm:items-center justify-between gap-3">
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

        {/* Clean Responsive Solid Grid - Direct rendering, no scroll velocity hooks or delays */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredPlates.map((plate) => (
            <PlateCard
              key={plate.id}
              plate={plate}
              onOpen={() => openLightbox(plate)}
              isEn={isEn}
            />
          ))}
        </div>

        {/* Bottom CTAs - Solid Opaque */}
        <div className="mt-16 text-center flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/gioi-thieu"
            prefetch={true}
            className="px-6 py-3.5 bg-white dark:bg-forest-900 text-ink-primary rounded-xl text-xs font-mono font-bold hover:bg-forest-50 dark:hover:bg-forest-800 border border-forest-200 dark:border-forest-700 transition-colors shadow-subtle flex items-center gap-2"
          >
            <BookOpen className="w-4 h-4 text-accent-botanical" />
            <span>{isEn ? 'Read Sanctuary Story & Origins' : 'Tìm hiểu Câu chuyện Cội Nguồn'}</span>
          </Link>
          <Link
            href="/thuc-don"
            prefetch={true}
            className="px-6 py-3.5 bg-accent-botanical text-white rounded-xl text-xs font-mono font-bold hover:bg-forest-800 transition-colors shadow-subtle flex items-center gap-2"
          >
            <UtensilsCrossed className="w-4 h-4" />
            <span>{isEn ? 'Explore Botanical Menu (~67 Items)' : 'Khám phá Thực đơn (~67 món)'}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/lien-he"
            prefetch={true}
            className="px-6 py-3.5 bg-white dark:bg-forest-900 text-ink-primary rounded-xl text-xs font-mono font-bold hover:bg-forest-50 dark:hover:bg-forest-800 border border-forest-200 dark:border-forest-700 transition-colors shadow-subtle flex items-center gap-2"
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
