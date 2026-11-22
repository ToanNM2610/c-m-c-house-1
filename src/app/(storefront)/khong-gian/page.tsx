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
  Phone,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { SpatialPlate } from '@/types';
import FooterSection from '@/components/home/FooterSection';
import { MagneticButton } from '@/components/motion/VividMotion';

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
      <div className="relative w-full aspect-[16/10] overflow-hidden bg-forest-100 dark:bg-forest-800 border-b border-forest-200 dark:border-forest-700">
        <img
          src={imgSrc}
          alt={title}
          loading="lazy"
          decoding="async"
          onError={handleImageError}
          className="w-full h-full object-cover block opacity-100 group-hover:scale-105 transition-transform duration-300 ease-out"
        />

        <div className="absolute top-3 left-3 bg-white dark:bg-forest-900 px-2.5 py-1 rounded-md text-xs font-sans font-bold text-accent-botanical border border-forest-200 dark:border-forest-700 shadow-sm z-10">
          {plate.id}
        </div>

        <div className="absolute top-3 right-3 p-1.5 bg-white dark:bg-forest-900 rounded-full text-ink-muted opacity-0 group-hover:opacity-100 transition-opacity shadow-sm z-10">
          <Maximize2 className="w-4 h-4 text-accent-botanical" />
        </div>

        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-center gap-1.5 text-xs font-sans text-ink-primary bg-white dark:bg-forest-900 py-1.5 px-2.5 rounded-lg border border-forest-200 dark:border-forest-700 shadow-sm z-10">
          <MapPin className="w-3.5 h-3.5 text-accent-botanical flex-shrink-0" />
          <span className="truncate">{location}</span>
        </div>
      </div>

      <div className="p-5 space-y-2 bg-white dark:bg-forest-900">
        <div className="text-xs font-sans uppercase tracking-wider text-accent-botanical font-semibold">
          {chapter}
        </div>
        <h3 className="font-serif text-base font-bold text-ink-primary line-clamp-1">
          {title}
        </h3>
        <p className="text-xs text-ink-muted leading-relaxed line-clamp-3 font-sans">
          {description}
        </p>
        <span className="text-xs font-sans text-accent-botanical font-medium block pt-1 group-hover:underline">
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
          title: 'Chapter IV: Twilight & Peaceful Evenings',
          range: ch4Range,
          desc: 'Valley golden sunsets, serene streamside gatherings, and lantern reflections',
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
          title: 'Chương IV: Chiều Buông & Đêm Bình Yên',
          range: ch4Range,
          desc: 'Hoàng hôn thung lũng, nhịp suối róc rách thanh bình và ánh đèn vàng ấm áp',
        },
      ];

  const filteredPlates = useMemo(() => {
    if (selectedChapter === 'all') return data.spatialPlates;
    return data.spatialPlates.filter((p) => p.chapter === selectedChapter);
  }, [data.spatialPlates, selectedChapter]);

  const defaultSpaceZones = [
    {
      id: 'zone-stream',
      nameVi: 'Khu Bờ Suối Mát Lạnh',
      nameEn: 'Streamside Sanctuary',
      descVi: 'Bàn ghế mộc đặt sát bờ suối róc rách, rợp bóng vòm cây rừng và hoa lan Cẩm Cù.',
      descEn: 'Rustic tables right by the flowing mountain brook under lush rainforest canopies.',
      highlightVi: 'Mát rượi quanh năm • View suối tự nhiên',
      highlightEn: 'Year-round cool breeze • Natural waterfall views',
      imageUrl: '/uploads/gallery/fig-01.jpg',
    },
    {
      id: 'zone-woodhouse',
      nameVi: 'Nhà Gỗ Mộc Mạc & Hiên Sưởi',
      nameEn: 'Rustic Wooden Lodge & Hearth',
      descVi: 'Không gian ấm cúng với kiến trúc gỗ tái chế, lò sưởi củi và ánh đèn vàng lắng đọng.',
      descEn: 'Warm timber architecture with wood-fired hearth and cozy golden ambient lighting.',
      highlightVi: 'Ấm cúng • Thích hợp họp mặt & đọc sách',
      highlightEn: 'Cozy retreat • Ideal for reading & group chats',
      imageUrl: '/uploads/gallery/fig-10.jpg',
    },
    {
      id: 'zone-bbq',
      nameVi: 'Sân Vườn BBQ Bên Bờ Suối',
      nameEn: 'Streamside BBQ Garden Terrace',
      descVi: 'Khu tiệc ngoài trời thoáng đãng dành cho các buổi tiệc nướng BBQ cuối tuần.',
      descEn: 'Open-air outdoor garden designed for relaxing weekend BBQ gatherings.',
      highlightVi: 'Rộng rãi • Nhận tiệc đặt trước',
      highlightEn: 'Spacious • Advance reservations available',
      imageUrl: '/uploads/gallery/fig-24.jpg',
    },
    {
      id: 'zone-tea',
      nameVi: 'Góc Thưởng Trà Tĩnh Lặng',
      nameEn: 'Quiet Tea & Mindfulness Corner',
      descVi: 'Góc nhỏ tĩnh lặng dưới giàn lan Cẩm Cù để nhâm nhi tách trà thảo mộc ấm lành.',
      descEn: 'Serene nook under wax flower trellises to savor fragrant botanical herbal teas.',
      highlightVi: 'Yên tĩnh • Hương hoa thoang thoảng',
      highlightEn: 'Tranquil ambiance • Subtle floral aroma',
      imageUrl: '/uploads/gallery/fig-15.jpg',
    },
  ];

  const zones = c?.spaceZones || defaultSpaceZones;

  // Universal Section Order & Visibility Resolution
  const defaultSpaceOrder = ['header', 'zones', 'gallery', 'cta'];
  const spaceOrder = (c?.spaceSectionOrder && Array.isArray(c.spaceSectionOrder) && c.spaceSectionOrder.length > 0)
    ? c.spaceSectionOrder
    : defaultSpaceOrder;

  const isSectionVisible = (id: string) => {
    if (c?.sectionVisibility && c.sectionVisibility['space-' + id] === false) return false;
    if (id === 'cta' && c?.showSpaceCta === false) return false;
    return true;
  };

  /* ========================================================= */
  /* SECTION RENDERERS                                         */
  /* ========================================================= */

  // 1. Header
  const renderHeader = () => (
    <section key="header" className="relative overflow-hidden py-14 sm:py-20 border-b border-forest-200 dark:border-forest-700 bg-paper">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="max-w-3xl space-y-4">
          <div className="text-xs font-sans uppercase tracking-widest text-accent-botanical font-semibold flex items-center gap-2">
            <span className="w-8 h-px bg-accent-botanical" />
            <span>{spaceEyebrow}</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-ink-primary leading-tight">
            {spaceTitle}
          </h1>

          <p className="font-serif text-lg sm:text-xl text-accent-earth italic">
            {spaceSubtitle}
          </p>

          <p className="text-sm sm:text-base text-ink-muted leading-relaxed font-sans">
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
  );

  // 2. Experience Zones
  const renderZones = () => (
    <section key="zones" className="py-16 sm:py-20 px-4 sm:px-8 max-w-7xl mx-auto border-b border-forest-200/60 dark:border-forest-700/50 bg-forest-50/30 dark:bg-forest-950/20">
      <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
        <div className="text-xs font-sans uppercase tracking-widest text-accent-botanical font-semibold flex items-center justify-center gap-2">
          <Sparkles className="w-4 h-4 text-accent-botanical" />
          <span>{isEn ? '4 BOTANICAL EXPERIENCE ZONES' : '4 PHÂN KHU TRẢI NGHIỆM ĐẶC TRƯNG'}</span>
        </div>
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-ink-primary">
          {isEn ? 'Discover Your Favorite Corner' : 'Lựa Chọn Góc Quán Yêu Thích Của Bạn'}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {zones.map((zone: any, idx: number) => {
          const name = isEn && zone.nameEn ? zone.nameEn : zone.nameVi;
          const desc = isEn && zone.descEn ? zone.descEn : zone.descVi;
          const highlight = isEn && zone.highlightEn ? zone.highlightEn : zone.highlightVi;

          return (
            <div key={zone.id || idx} className="bg-white dark:bg-forest-900 rounded-2xl border border-forest-200 dark:border-forest-700 overflow-hidden shadow-subtle flex flex-col justify-between">
              <div className="relative aspect-[16/10] overflow-hidden bg-forest-100 dark:bg-forest-800">
                <img
                  src={zone.imageUrl || `/uploads/gallery/fig-${String(idx * 7 + 1).padStart(2, '0')}.jpg`}
                  alt={name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-5 space-y-2">
                <span className="text-[11px] font-sans text-accent-botanical font-semibold block">
                  {highlight}
                </span>
                <h3 className="font-serif text-lg font-bold text-ink-primary">
                  {name}
                </h3>
                <p className="text-xs text-ink-muted leading-relaxed font-sans">
                  {desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );

  // 3. Main Spatial Gallery
  const renderGallery = () => (
    <section key="gallery" className="py-14 sm:py-20 px-4 sm:px-8 max-w-7xl mx-auto">
      {/* Chapter Filter Controls */}
      <div className="space-y-6 mb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1">
            <div className="text-xs font-sans uppercase tracking-widest text-accent-botanical font-semibold flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isEn ? 'FILTER BY CHAPTER' : 'PHÂN LOẠI THEO CHƯƠNG'}</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-ink-primary">
              {isEn ? 'Curated Visual Journey' : 'Hành Trình Khám Phá Thị Giác'}
            </h2>
          </div>

          {/* Chapter Filter Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 bg-white dark:bg-forest-900 p-1.5 rounded-2xl border border-forest-200 dark:border-forest-700 shadow-subtle">
            <button
              onClick={() => setSelectedChapter('all')}
              className={`px-3.5 py-2 rounded-xl text-xs font-sans font-medium transition-colors ${
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
                  className={`px-3 py-2 rounded-xl text-xs font-sans font-medium transition-colors ${
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

        {/* Active Chapter Overview Banner */}
        {selectedChapter !== 'all' && (
          <div className="p-4 sm:p-5 bg-forest-50 dark:bg-forest-950 rounded-2xl border border-forest-200 dark:border-forest-700 text-xs text-ink-muted flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <span className="font-sans font-bold text-accent-botanical uppercase">
                {chapters.find((c) => c.id === selectedChapter)?.title}
              </span>
              <p className="font-serif italic text-ink-primary">
                {chapters.find((c) => c.id === selectedChapter)?.desc}
              </p>
            </div>
            <span className="font-sans text-ink-muted text-xs self-start sm:self-auto bg-white dark:bg-forest-900 px-3 py-1 rounded-lg border border-forest-200 dark:border-forest-700">
              {chapters.find((c) => c.id === selectedChapter)?.range}
            </span>
          </div>
        )}
      </div>

      {/* Grid of Plates */}
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

      {/* Quick Navigation CTAs */}
      <div className="mt-16 text-center flex flex-wrap items-center justify-center gap-4">
        <Link
          href="/gioi-thieu"
          prefetch={true}
          className="px-6 py-3.5 bg-white dark:bg-forest-900 text-ink-primary rounded-xl text-xs font-sans font-bold hover:bg-forest-50 dark:hover:bg-forest-800 border border-forest-200 dark:border-forest-700 transition-colors shadow-subtle flex items-center gap-2"
        >
          <BookOpen className="w-4 h-4 text-accent-botanical" />
          <span>{isEn ? 'Read Sanctuary Story & Origins' : 'Tìm hiểu Câu chuyện Cội Nguồn'}</span>
        </Link>
        <Link
          href="/thuc-don"
          prefetch={true}
          className="px-6 py-3.5 bg-accent-botanical text-white rounded-xl text-xs font-sans font-bold hover:bg-forest-800 transition-colors shadow-subtle flex items-center gap-2"
        >
          <UtensilsCrossed className="w-4 h-4" />
          <span>{isEn ? 'Explore Botanical Menu (~67 Items)' : 'Khám phá Thực đơn (~67 món)'}</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
        <Link
          href="/lien-he"
          prefetch={true}
          className="px-6 py-3.5 bg-white dark:bg-forest-900 text-ink-primary rounded-xl text-xs font-sans font-bold hover:bg-forest-50 dark:hover:bg-forest-800 border border-forest-200 dark:border-forest-700 transition-colors shadow-subtle flex items-center gap-2"
        >
          <Compass className="w-4 h-4 text-accent-botanical" />
          <span>{isEn ? 'Get Directions on Google Maps' : 'Chỉ đường Google Maps đến quán'}</span>
        </Link>
      </div>
    </section>
  );

  // 4. Booking Banner CTA
  const renderCta = () => (
    <section key="cta" className="py-16 sm:py-20 px-4 sm:px-8 max-w-7xl mx-auto border-t border-forest-200/60 dark:border-forest-700/50">
      <div className="p-8 sm:p-12 rounded-3xl bg-forest-900 text-white shadow-elevated flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-3 max-w-2xl">
          <span className="text-xs font-sans uppercase tracking-widest text-emerald-300 font-semibold inline-block">
            {isEn ? 'GROUP VISITS & SANCTUARY INQUIRY' : 'LIÊN HỆ ĐOÀN ĐÔNG & GHÉ THĂM'}
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white">
            {isEn ? (c?.spaceCtaTitleEn || 'Planning a Group Visit or Streamside Photoshoot?') : (c?.spaceCtaTitle || 'Bạn Muốn Ghé Thăm Theo Đoàn Hoặc Chụp Ảnh Bên Suối?')}
          </h2>
          <p className="text-sm text-forest-200/90 leading-relaxed font-sans">
            {isEn ? (c?.spaceCtaDescEn || 'Our natural open sanctuary is ready to welcome you. Contact our hotline for the best preparation.') : (c?.spaceCtaDesc || 'Không gian mở tự nhiên sẵn sàng chào đón bạn. Hãy liên hệ Hotline để quán chuẩn bị chu đáo nhất.')}
          </p>
        </div>

        <a href="tel:0382851688" className="shrink-0">
          <MagneticButton className="px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl text-sm font-sans font-bold shadow-float flex items-center gap-2.5">
            <Phone className="w-4 h-4" />
            <span>{isEn ? (c?.spaceCtaBtnTextEn || 'Call Hotline 038 285 1688') : (c?.spaceCtaBtnText || 'Liên Hệ Hotline 038 285 1688')}</span>
          </MagneticButton>
        </a>
      </div>
    </section>
  );

  return (
    <main className="min-h-screen pt-[72px] bg-paper text-ink-primary">
      {spaceOrder.map((sectionId) => {
        if (!isSectionVisible(sectionId)) return null;
        switch (sectionId) {
          case 'header':
            return renderHeader();
          case 'zones':
            return renderZones();
          case 'gallery':
            return renderGallery();
          case 'cta':
            return renderCta();
          default:
            return null;
        }
      })}

      <FooterSection />
    </main>
  );
}
