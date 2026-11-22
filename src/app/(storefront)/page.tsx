'use client';

import React from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  Compass,
  MapPin,
  Waves,
  Sprout,
  Heart,
  Droplets,
  Coffee,
  Clock,
  Phone,
  Music,
  Star,
  CheckCircle2,
  Camera,
} from 'lucide-react';
import OpenStatusBadge from '@/components/common/OpenStatusBadge';
import FooterSection from '@/components/home/FooterSection';
import ReviewShowcase3 from '@/components/testimonials/ReviewShowcase3';
import { useApp } from '@/context/AppContext';
import { MenuItem, GuestComment } from '@/types';
import { motion } from 'framer-motion';
import {
  EditorialDivider,
  EditorialReveal,
  EditorialStaggerContainer,
  EditorialStaggerItem,
  EDITORIAL_EASE,
} from '@/components/motion/EditorialMotion';
import {
  ScrollLayoutCard3D,
  EditorialDivider120,
} from '@/components/motion/ScrollMotion120';
import {
  StreamMarquee120,
  InteractiveTiltCard,
  MagneticButton,
} from '@/components/motion/VividMotion';

function BestSellerCard({ item, isEn }: { item: MenuItem; isEn: boolean }) {
  const name = isEn && item.nameEn ? item.nameEn : item.vietnameseTitle;
  const highlight = isEn && item.highlightEn ? item.highlightEn : item.highlight;
  const note = isEn && item.editorialNoteEn ? item.editorialNoteEn : item.editorialNote;
  const desc = isEn && item.descriptionEn ? item.descriptionEn : item.description;

  const categoryLabel = item.categoryId === 'coffee'
    ? (isEn ? 'Wood-roasted coffee' : 'Cà phê rang mộc')
    : item.categoryId === 'tea'
    ? (isEn ? 'Refreshing botanicals' : 'Thảo mộc thanh mát')
    : item.categoryId === 'smoothie'
    ? (isEn ? 'Fresh highland fruit' : 'Trái cây tươi')
    : item.categoryId === 'food'
    ? (isEn ? 'Hearty warm dishes' : 'Đồ ăn no đậm đà')
    : (isEn ? 'House Specialty' : 'Đặc sản Cẩm Cù');

  return (
    <InteractiveTiltCard maxTilt={3.5} spotlight={true} className="h-full">
      <div className="p-5 rounded-2xl bg-white dark:bg-forest-900 border border-forest-200 dark:border-forest-700 hover:border-accent-botanical/50 shadow-subtle transition-all duration-200 flex flex-col justify-between group h-full">
        <div>
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-serif text-lg font-bold text-ink-primary group-hover:text-accent-botanical transition-colors">
                  {name}
                </h3>
                {highlight && (
                  <span className="text-[10px] font-sans text-amber-800 dark:text-amber-200 bg-amber-100 dark:bg-amber-950/60 px-2 py-0.5 rounded font-semibold flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5" />
                    {highlight}
                  </span>
                )}
              </div>
              {note && (
                <p className="text-xs font-serif italic text-accent-earth mt-0.5">
                  {note}
                </p>
              )}
            </div>
            <div className="font-sans text-base font-bold text-accent-botanical whitespace-nowrap">
              {item.priceDisplay || `${item.price.toLocaleString('vi-VN')}đ`}
            </div>
          </div>

          <p className="text-xs text-ink-muted leading-relaxed line-clamp-2 mb-4 font-sans">
            {desc}
          </p>
        </div>

        <div className="pt-3 border-t border-forest-100 dark:border-forest-800 flex items-center justify-between">
          <span className="text-xs font-sans text-forest-400">
            {categoryLabel}
          </span>
          <Link
            href="/thuc-don"
            className="text-xs font-sans text-accent-botanical hover:underline font-semibold flex items-center gap-1"
          >
            <span>{isEn ? 'View Details' : 'Xem chi tiết'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </InteractiveTiltCard>
  );
}

export default function HomePage() {
  const { data, content, language } = useApp();
  const c = content || data.content;
  const s = data.settings;
  const isEn = language === 'en';

  // Approved reviews & dynamic recommendation metrics
  const [comments, setComments] = React.useState<GuestComment[]>([]);
  React.useEffect(() => {
    let isMounted = true;
    async function loadComments() {
      try {
        const res = await fetch('/api/comments');
        if (res.ok) {
          const json = await res.json();
          const list: GuestComment[] = Array.isArray(json) ? json : json.data || [];
          if (isMounted) setComments(list);
        }
      } catch {}
    }
    loadComments();
    return () => {
      isMounted = false;
    };
  }, []);

  const approvedComments = React.useMemo(() => {
    return (comments || []).filter((cm) => cm.status === 'APPROVED');
  }, [comments]);
  const approvedCount = approvedComments.length;
  const recommendedCount = approvedComments.filter((cm) => (cm.rating ?? 5) >= 4).length;
  const recommendedPercent = approvedCount > 0 ? Math.round((recommendedCount / approvedCount) * 100) : 0;

  // Active events toggle & count check
  const activeEvents = React.useMemo(() => {
    return (data.events || []).filter((e) => e.active);
  }, [data.events]);
  const shouldShowEvents = (c?.showFeaturedEvents !== false) && (s.showEventsSection !== false) && activeEvents.length > 0;

  // Published highlight stories toggle & count check
  const publishedStories = React.useMemo(() => {
    return (data.stories || []).filter((st) => st.published);
  }, [data.stories]);
  const shouldShowHighlights = (s.showHighlightsSection !== false) && publishedStories.length > 0;

  // Highlights / Signatures
  const highlightedItems = React.useMemo(() => {
    return data.menu.filter((m) => Boolean(m.highlight)).slice(0, 6);
  }, [data.menu]);

  // Gallery Plates for Featured Space Section
  const featuredPlates = React.useMemo(() => {
    return (data.spatialPlates || []).slice(0, 6);
  }, [data.spatialPlates]);

  // Dynamic icon helper for philosophy cards
  const renderPhilosophyIcon = (iconName: string) => {
    switch (iconName?.toLowerCase()) {
      case 'waves':
        return <Waves className="w-6 h-6 text-accent-botanical" />;
      case 'sprout':
        return <Sprout className="w-6 h-6 text-accent-botanical" />;
      case 'droplets':
        return <Droplets className="w-6 h-6 text-accent-botanical" />;
      case 'coffee':
        return <Coffee className="w-6 h-6 text-accent-botanical" />;
      default:
        return <Heart className="w-6 h-6 text-accent-botanical" />;
    }
  };

  const heroEyebrow = isEn && c?.heroEyebrowEn ? c.heroEyebrowEn : (c?.heroEyebrow || 'BOTANICAL ECO-COFFEE & STREAMSIDE SANCTUARY');
  const heroTitle = isEn && c?.heroTitleEn ? c.heroTitleEn : (c?.heroTitle || 'CẨM CÙ');
  const heroSubtitle = isEn && c?.heroSubtitleEn ? c.heroSubtitleEn : (c?.heroSubtitle || 'HOUSE');
  const heroTagline = isEn && c?.heroTaglineEn ? c.heroTaglineEn : (c?.heroTagline || s.tagline);
  const heroAddress = isEn && s.addressEn ? s.addressEn : s.address;
  const heroDescription = isEn && c?.heroDescriptionEn ? c.heroDescriptionEn : (c?.heroDescription || 'Tận hưởng không gian suối mát rượi quanh năm...');

  const philosophyEyebrow = isEn && c?.philosophyEyebrowEn ? c.philosophyEyebrowEn : (c?.philosophyEyebrow || 'VỀ KHÔNG GIAN BÊN SUỐI');
  const philosophyTitle = isEn && c?.philosophyTitleEn ? c.philosophyTitleEn : (c?.philosophyTitle || 'Bình Yên Bên Bờ Suối Tự Nhiên');
  const philosophyLead = isEn && c?.philosophyLeadEn ? c.philosophyLeadEn : (c?.philosophyLead || 'Nơi bạn tạm gác lại những ồn ào phố thị...');
  const philosophyStory = isEn && c?.philosophyStoryEn ? c.philosophyStoryEn : (c?.philosophyStory || 'Được bao bọc bởi những rặng hoa Cẩm Cù...');

  const philosophyCards = (isEn && c?.philosophyCardsEn && c.philosophyCardsEn.length > 0)
    ? c.philosophyCardsEn
    : (c?.philosophyCards || []);

  // Universal Section Order & Visibility Resolution
  const defaultHomeOrder = ['hero', 'philosophy', 'featuredMenu', 'featuredSpace', 'featuredReviews', 'featuredEvents', 'ctaBanner'];
  const homeOrder = (c?.homeSectionOrder && Array.isArray(c.homeSectionOrder) && c.homeSectionOrder.length > 0)
    ? c.homeSectionOrder
    : defaultHomeOrder;

  const isSectionVisible = (id: string) => {
    if (c?.sectionVisibility && c.sectionVisibility['home-' + id] === false) return false;
    if (id === 'hero' && c?.showHeroSection === false) return false;
    if (id === 'philosophy' && c?.showPhilosophySection === false) return false;
    if (id === 'featuredMenu' && c?.showFeaturedMenu === false) return false;
    if (id === 'featuredSpace' && c?.showFeaturedSpace === false) return false;
    if (id === 'featuredReviews' && c?.showFeaturedReviews === false) return false;
    if (id === 'featuredEvents' && (!shouldShowEvents || c?.showFeaturedEvents === false)) return false;
    if (id === 'ctaBanner' && c?.showHomeCtaBanner === false) return false;
    return true;
  };

  /* ========================================================= */
  /* SECTION RENDERERS                                         */
  /* ========================================================= */

  // 1. Hero Section
  const renderHero = () => (
    <React.Fragment key="hero">
      <section className="relative overflow-hidden py-8 sm:py-12 lg:py-16 border-b border-forest-200/50 dark:border-forest-700/40">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-8">
          {/* Top Status & Recommendation Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-forest-200/60 dark:border-forest-700/40 mb-8 lg:mb-12">
            <OpenStatusBadge />
            <div className="flex items-center gap-2.5 text-xs font-sans text-ink-muted">
              {approvedCount > 0 && (
                <>
                  <span className="bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 px-3 py-1 rounded-full font-semibold flex items-center gap-1.5 shadow-subtle">
                    <Sparkles className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
                    {isEn
                      ? `${recommendedPercent}% Recommended (${recommendedCount}/${approvedCount} Reviews)`
                      : `${recommendedPercent}% Đề xuất (${recommendedCount}/${approvedCount} Đánh giá)`}
                  </span>
                  <span className="hidden sm:inline text-forest-300 dark:text-forest-700">•</span>
                </>
              )}
              <span className="hidden sm:inline">
                {isEn ? (s.socialProofEn || 'Affordable ($) • Gia Nghia City') : (s.socialProof || 'Giá bình dân ($) • TP. Gia Nghĩa')}
              </span>
            </div>
          </div>

          {/* 2-Column Botanical Magazine Cover Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column: Monumental Editorial Typography */}
            <div className={`${c?.showHero3DBean !== false ? 'lg:col-span-7' : 'lg:col-span-12'} space-y-5`}>
              <div className="text-xs font-sans tracking-widest uppercase text-accent-botanical font-semibold flex items-center gap-2">
                <span className="w-7 h-px bg-accent-botanical" />
                <span>{heroEyebrow}</span>
              </div>

              <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold text-ink-primary tracking-tight leading-[0.94]">
                {heroTitle} <br />
                <span className="italic font-normal font-serif text-accent-botanical">
                  {heroSubtitle}
                </span>
              </h1>

              <div className="space-y-2">
                <p className="font-serif text-xl sm:text-2xl text-accent-earth italic leading-relaxed">
                  &ldquo;{heroTagline}&rdquo;
                </p>
                <div className="flex items-center gap-2 text-xs font-sans text-ink-muted pt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-accent-botanical flex-shrink-0" />
                  <span>{heroAddress}</span>
                </div>
              </div>

              <p className="text-sm sm:text-base text-ink-primary/80 max-w-xl leading-relaxed">
                {heroDescription}
              </p>

              {/* Direct Action Navigation CTAs */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link href="/thuc-don">
                  <MagneticButton className="px-6 py-3.5 bg-accent-botanical text-white font-medium text-sm rounded-xl hover:bg-forest-800 transition-all shadow-md flex items-center gap-2 group active:scale-[0.98]">
                    <span>{isEn ? 'Explore Menu (~67 Items)' : 'Khám phá Thực đơn (~67 món)'}</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </MagneticButton>
                </Link>

                <a
                  href={s.links.googleMaps}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MagneticButton
                    sheen={false}
                    className="px-5 py-3.5 bg-white dark:bg-forest-900 border border-forest-300 dark:border-forest-700 text-ink-primary font-medium text-sm rounded-xl hover:bg-forest-50 dark:hover:bg-forest-800 transition-all shadow-subtle flex items-center gap-2 active:scale-[0.98]"
                  >
                    <Compass className="w-4 h-4 text-accent-earth" />
                    <span>{isEn ? 'Google Maps Directions' : 'Chỉ đường Google Maps'}</span>
                  </MagneticButton>
                </a>
              </div>
            </div>

            {/* Right Column: Editorial Photo Card */}
            {c?.showHero3DBean !== false && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.15, ease: EDITORIAL_EASE }}
                className="lg:col-span-5 flex flex-col items-center justify-center w-full"
              >
                <div className="w-full aspect-[4/3] rounded-3xl overflow-hidden border border-forest-200 dark:border-forest-700 shadow-elevated bg-forest-100 dark:bg-forest-900">
                  <img
                    src={c?.heroCoverImage || '/uploads/gallery/fig-01.jpg'}
                    alt={isEn ? 'Cẩm Cù House streamside sanctuary' : 'Không gian bên suối Cẩm Cù House'}
                    className="w-full h-full object-cover"
                    loading="eager"
                  />
                </div>
                <p className="mt-3 text-xs font-sans uppercase tracking-wider text-ink-muted">
                  {isEn ? 'Fig. 01 — Streamside Sanctuary, Gia Nghia' : 'Hình 01 — Không gian bên suối, Gia Nghĩa'}
                </p>
              </motion.div>
            )}
          </div>

          {/* Bottom Quick Feature Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 mt-10 border-t border-forest-200 dark:border-forest-700 text-xs font-sans text-ink-muted">
            <div className="p-3 bg-white dark:bg-forest-900 rounded-xl border border-forest-200 dark:border-forest-700">
              <span className="block text-ink-primary font-bold text-base font-serif">
                {isEn ? '18 Stream Tables' : '18 Bàn View Suối'}
              </span>
              <span>{isEn ? '4 Botanical zones' : '4 Phân khu sinh thái'}</span>
            </div>
            <div className="p-3 bg-white dark:bg-forest-900 rounded-xl border border-forest-200 dark:border-forest-700">
              <span className="block text-ink-primary font-bold text-base font-serif">
                {isEn ? '~67 Craft Drinks' : '~67 Món Đồ Uống'}
              </span>
              <span>{isEn ? 'Basalt Coffee & Teas' : 'Cà phê bazan & Thảo mộc'}</span>
            </div>
            <div className="p-3 bg-white dark:bg-forest-900 rounded-xl border border-forest-200 dark:border-forest-700">
              <span className="block text-ink-primary font-bold text-base font-serif">
                {isEn ? 'Natural Stream' : 'Suối Tự Nhiên'}
              </span>
              <span>{isEn ? 'Dong Gia Nghia, Lam Dong' : 'Đông Gia Nghĩa, Lâm Đồng'}</span>
            </div>
            <div className="p-3 bg-white dark:bg-forest-900 rounded-xl border border-forest-200 dark:border-forest-700">
              <span className="block text-ink-primary font-bold text-base font-serif">
                {isEn ? 'Streamside Serenity' : 'Không Khí Trong Lành'}
              </span>
              <span>{isEn ? 'Relaxing weekend by stream' : 'Thư thái lắng nghe tiếng suối'}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Marquee Ticker */}
      <StreamMarquee120
        items={
          isEn
            ? [
                'Ecological Streamside Café',
                '18 Stream View Tables',
                'Wood-Roasted Basalt Coffee',
                'Fresh Botanical Herbal Teas',
                'Dong Gia Nghia • Lam Dong',
                'Streamside Serenity & Relaxation',
              ]
            : [
                'Cà Phê Sinh Thái Bên Bờ Suối',
                '18 Bàn View Suối Mát Rượi',
                'Cà Phê Muối Đăk Nông Đậm Đà',
                'Thảo Mộc Xanh Sạch Tự Nhiên',
                'Đông Gia Nghĩa • Lâm Đồng',
                'Không Gian Xanh Mát Bên Suối',
              ]
        }
      />
    </React.Fragment>
  );

  // 2. Philosophy Section
  const renderPhilosophy = () => (
    <section key="philosophy" className="py-16 sm:py-24 bg-forest-50/50 dark:bg-forest-950/20 border-b border-forest-200/50 dark:border-forest-700/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="max-w-3xl mx-auto text-center space-y-3 mb-12">
          <div className="text-xs font-sans uppercase tracking-widest text-accent-botanical font-semibold flex items-center justify-center gap-2">
            <span className="w-6 h-px bg-accent-botanical" />
            <span>{philosophyEyebrow}</span>
            <span className="w-6 h-px bg-accent-botanical" />
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-ink-primary">
            {philosophyTitle}
          </h2>
          <p className="text-base text-accent-earth font-serif italic">
            {philosophyLead}
          </p>
          <p className="text-xs sm:text-sm text-ink-muted leading-relaxed max-w-2xl mx-auto">
            {philosophyStory}
          </p>
        </div>

        {/* 3 Philosophy Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-10">
          {philosophyCards.map((card, idx) => {
            const cardTitle = isEn && card.titleEn ? card.titleEn : card.title;
            const cardDesc = isEn && card.descEn ? card.descEn : card.desc;

            return (
              <ScrollLayoutCard3D key={idx} delay={idx * 0.08} className="h-full">
                <InteractiveTiltCard maxTilt={3.5} spotlight={true} className="h-full">
                  <div className="h-full p-6 rounded-2xl bg-white dark:bg-forest-900 border border-forest-200 dark:border-forest-700 shadow-subtle hover:shadow-elevated hover:border-accent-botanical/50 transition-all duration-300 flex flex-col justify-between">
                    <div className="space-y-4">
                      <div className="w-12 h-12 rounded-xl bg-forest-100 dark:bg-forest-800 flex items-center justify-center">
                        {renderPhilosophyIcon(card.iconName)}
                      </div>
                      <h3 className="font-serif text-xl font-bold text-ink-primary">
                        {cardTitle}
                      </h3>
                      <p className="text-xs sm:text-sm text-ink-muted leading-relaxed font-sans">
                        {cardDesc}
                      </p>
                    </div>
                  </div>
                </InteractiveTiltCard>
              </ScrollLayoutCard3D>
            );
          })}
        </div>

        <div className="text-center">
          <Link
            href="/gioi-thieu"
            className="inline-flex items-center gap-2 text-xs font-sans uppercase tracking-wider text-accent-botanical font-bold hover:text-forest-800 transition-colors py-2 px-4 rounded-xl hover:bg-forest-100 dark:hover:bg-forest-900"
          >
            <span>{isEn ? 'Explore all 30 spatial plates & brand story' : 'Khám phá 30 góc không gian & câu chuyện đầy đủ'}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );

  // 3. Featured Menu Section
  const renderFeaturedMenu = () => (
    <section key="featuredMenu" className="py-16 sm:py-24 border-b border-forest-200/50 dark:border-forest-700/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div className="space-y-2">
            <div className="text-xs font-sans uppercase tracking-widest text-accent-botanical font-semibold flex items-center gap-2">
              <span className="w-6 h-px bg-accent-botanical" />
              <span>{isEn ? (c?.menuEyebrowEn || 'SIGNATURE PICKS • WOOD-ROASTED & HERBAL') : (c?.menuEyebrow || 'SIGNATURE PICKS • RANG MỘC & THẢO MỘC')}</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-ink-primary">
              {isEn ? (c?.menuTitleEn || 'Authentic Dak Nong Flavors') : (c?.menuTitle || 'Hương Vị Đặc Trưng Đăk Nông')}
            </h2>
            <p className="text-xs sm:text-sm text-ink-muted font-sans">
              {isEn ? (c?.menuSubtitleEn || 'Top favorite handcrafted drinks recommended by guests at Cẩm Cù House.') : (c?.menuSubtitle || 'Những món đồ uống được thực khách yêu thích và đề xuất nhiều nhất tại Cẩm Cù House.')}
            </p>
          </div>

          <Link
            href="/thuc-don"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-forest-100 dark:bg-forest-900 text-accent-botanical text-xs font-sans font-medium hover:bg-forest-200 dark:hover:bg-forest-800 transition-colors self-start md:self-auto"
          >
            <span>{isEn ? 'View all 67 items' : 'Xem toàn bộ 67 món'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Grid of Highlighted Items */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {highlightedItems.map((item, idx) => (
            <ScrollLayoutCard3D key={item.id} delay={(idx % 3) * 0.06}>
              <BestSellerCard item={item} isEn={isEn} />
            </ScrollLayoutCard3D>
          ))}
        </div>
      </div>
    </section>
  );

  // 4. Featured Space Section
  const renderFeaturedSpace = () => (
    <section key="featuredSpace" className="py-16 sm:py-24 bg-forest-50/40 dark:bg-forest-950/20 border-b border-forest-200/50 dark:border-forest-700/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div className="space-y-2">
            <div className="text-xs font-sans uppercase tracking-widest text-accent-botanical font-semibold flex items-center gap-2">
              <Camera className="w-3.5 h-3.5 text-accent-botanical" />
              <span>{isEn ? '30 SPATIAL PLATES • STREAMSIDE SANCTUARY' : '30 BẢN KHẮC KHÔNG GIAN • BỜ SUỐI & VƯỜN LAN'}</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-ink-primary">
              {isEn ? (c?.spaceTitleEn || 'Photographic Sanctuary Plates') : (c?.spaceTitle || 'Không Gian Suối Mát & Hoa Cẩm Cù')}
            </h2>
            <p className="text-xs sm:text-sm text-ink-muted font-sans">
              {isEn ? (c?.spaceSubtitleEn || 'Visual documentation of our 4 streamside zones.') : (c?.spaceSubtitle || 'Trải nghiệm không gian suối mát rượi, bàn ghế gỗ mộc và giàn hoa lan Cẩm Cù tinh khôi.')}
            </p>
          </div>

          <Link
            href="/khong-gian"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-forest-100 dark:bg-forest-900 text-accent-botanical text-xs font-sans font-medium hover:bg-forest-200 dark:hover:bg-forest-800 transition-colors self-start md:self-auto"
          >
            <span>{isEn ? 'View all 30 plates' : 'Xem toàn bộ 30 bản khắc'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 6 Featured Spatial Plates */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredPlates.map((plate, idx) => {
            const figNum = plate.id.replace(/[^0-9]/g, '').padStart(2, '0');
            const imgSrc = plate.imageUrl || `/uploads/gallery/fig-${figNum || '01'}.jpg`;
            const title = isEn && plate.titleEn ? plate.titleEn : plate.titleVi;
            const location = isEn && plate.locationEn ? plate.locationEn : plate.locationVi;

            return (
              <ScrollLayoutCard3D key={plate.id} delay={(idx % 3) * 0.06}>
                <Link href="/khong-gian" className="group block h-full">
                  <div className="h-full bg-white dark:bg-forest-900 rounded-2xl border border-forest-200 dark:border-forest-700 overflow-hidden shadow-subtle hover:shadow-elevated transition-shadow duration-200 flex flex-col justify-between">
                    <div className="relative aspect-[16/10] overflow-hidden bg-forest-100 dark:bg-forest-800">
                      <img
                        src={imgSrc}
                        alt={title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      <div className="absolute top-3 left-3 bg-white/90 dark:bg-forest-900/90 backdrop-blur-sm px-2.5 py-1 rounded text-xs font-sans font-bold text-accent-botanical">
                        {plate.id}
                      </div>
                    </div>
                    <div className="p-4 space-y-1">
                      <div className="text-xs font-sans text-accent-earth flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-accent-botanical" />
                        <span>{location}</span>
                      </div>
                      <h3 className="font-serif text-base font-bold text-ink-primary group-hover:text-accent-botanical transition-colors">
                        {title}
                      </h3>
                    </div>
                  </div>
                </Link>
              </ScrollLayoutCard3D>
            );
          })}
        </div>
      </div>
    </section>
  );

  // 5. Featured Reviews Section
  const renderFeaturedReviews = () => (
    <section key="featuredReviews" className="py-16 sm:py-20 border-b border-forest-200/50 dark:border-forest-700/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div className="space-y-2">
            <div className="text-xs font-sans uppercase tracking-widest text-accent-botanical font-semibold flex items-center gap-2">
              <Heart className="w-3.5 h-3.5" />
              <span>
                {approvedCount > 0
                  ? (isEn
                      ? `VERIFIED GUEST REVIEWS • ${recommendedPercent}% RECOMMENDED`
                      : `CẢM NHẬN THỰC KHÁCH • ${recommendedPercent}% ĐỀ XUẤT`)
                  : (isEn ? (c?.reviewsEyebrowEn || 'VERIFIED GUEST REVIEWS') : (c?.reviewsEyebrow || 'CẢM NHẬN THỰC KHÁCH'))}
              </span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-ink-primary">
              {isEn ? (c?.reviewsTitleEn || 'Voices From Beside The Stream') : (c?.reviewsTitle || 'Những Lời Chia Sẻ Ấm Áp Bên Suối')}
            </h2>
            <p className="text-xs sm:text-sm text-ink-muted font-sans">
              {isEn ? (c?.reviewsSubtitleEn || 'Verified guest reviews from travelers and locals visiting Cẩm Cù House.') : (c?.reviewsSubtitle || 'Đánh giá chân thực từ thực khách địa phương và du khách gần xa khi ghé thăm quán.')}
            </p>
          </div>

          <Link
            href="/khach-hang"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-forest-100 dark:bg-forest-900 text-accent-botanical text-xs font-sans font-medium hover:bg-forest-200 dark:hover:bg-forest-800 transition-colors self-start md:self-auto"
          >
            <span>{isEn ? 'View all reviews & stories' : 'Xem toàn bộ cảm nhận & dấu ấn'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <ReviewShowcase3 comments={comments} settings={s} />
      </div>
    </section>
  );

  // 6. Featured Events & Happenings Section
  const renderFeaturedEvents = () => (
    <section key="featuredEvents" className="py-16 sm:py-20 bg-forest-50/30 dark:bg-forest-950/20 border-b border-forest-200/50 dark:border-forest-700/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <div className="text-xs font-sans uppercase tracking-widest text-accent-botanical font-semibold flex items-center justify-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-accent-botanical" />
            <span>{isEn ? (c?.newsEyebrowEn || 'STREAMSIDE HAPPENINGS & LIFE') : (c?.newsEyebrow || 'SỰ KIỆN & NHỊP SỐNG BÊN SUỐI')}</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-ink-primary">
            {isEn ? (c?.newsTitleEn || 'Happenings & Seasonal Programs') : (c?.newsTitle || 'Hoạt Động & Sự Kiện Theo Mùa')}
          </h2>
          <p className="text-xs sm:text-sm text-ink-muted font-sans">
            {isEn ? (c?.newsSubtitleEn || 'Stay updated with peaceful happenings and warm gatherings by the stream.') : (c?.newsSubtitle || 'Cập nhật lịch hoạt động và những chương trình ấm cúng tại quán.')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {activeEvents.map((ev, idx) => {
            const evTitle = isEn && ev.titleEn ? ev.titleEn : ev.title;
            const evSubtitle = isEn && ev.subtitleEn ? ev.subtitleEn : ev.subtitle;
            const evBadge = isEn && ev.badgeEn ? ev.badgeEn : (ev.badge || 'Event');
            const evSchedule = isEn && ev.dateOrScheduleEn ? ev.dateOrScheduleEn : ev.dateOrSchedule;
            const evDesc = isEn && ev.descriptionEn ? ev.descriptionEn : ev.description;

            return (
              <ScrollLayoutCard3D key={ev.id} delay={(idx % 3) * 0.08} className="h-full">
                <div className="h-full rounded-2xl bg-white dark:bg-forest-900 border border-forest-200 dark:border-forest-700 shadow-subtle flex flex-col justify-between overflow-hidden">
                  {ev.imageUrl && (
                    <div className="h-44 w-full bg-forest-100 dark:bg-forest-800 relative overflow-hidden">
                      <img
                        src={ev.imageUrl}
                        alt={evTitle}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <div className="p-6 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-sans uppercase font-bold text-accent-botanical bg-forest-100 dark:bg-forest-800 px-2.5 py-1 rounded-full">
                        {evBadge}
                      </span>
                      <span className="text-xs font-sans text-ink-muted flex items-center gap-1">
                        <Clock className="w-3 h-3 text-accent-botanical" />
                        {evSchedule}
                      </span>
                    </div>

                    <h3 className="font-serif text-xl font-bold text-ink-primary">
                      {evTitle}
                    </h3>

                    {evSubtitle && (
                      <p className="text-xs font-sans text-accent-earth font-semibold">
                        {evSubtitle}
                      </p>
                    )}

                    <p className="text-xs text-ink-muted leading-relaxed font-sans">
                      {evDesc}
                    </p>
                  </div>

                  <div className="p-6 pt-0">
                    <div className="pt-4 border-t border-forest-100 dark:border-forest-800 flex items-center justify-between text-xs">
                      <span className="font-sans text-forest-400">
                        {isEn ? 'Cẩm Cù House • Beside Stream' : 'Cẩm Cù House • Bên bờ suối'}
                      </span>
                      <a
                        href="tel:0382851688"
                        className="text-accent-botanical font-medium hover:underline flex items-center gap-1 font-sans"
                      >
                        <Phone className="w-3 h-3" />
                        <span>0382 851 688</span>
                      </a>
                    </div>
                  </div>
                </div>
              </ScrollLayoutCard3D>
            );
          })}
        </div>

        {/* Action Link to /su-kien */}
        <div className="mt-10 text-center">
          <Link
            href="/su-kien"
            className="inline-flex items-center gap-2 px-6 py-3.5 bg-white dark:bg-forest-900 border border-forest-300 dark:border-forest-700 text-ink-primary hover:border-accent-botanical hover:text-accent-botanical rounded-xl text-xs font-sans font-semibold transition-all shadow-subtle active:scale-95"
          >
            <Sparkles className="w-4 h-4 text-accent-botanical" />
            <span>{isEn ? 'View all events & happenings by the stream' : 'Xem tất cả sự kiện & hoạt động bên suối'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );

  // 7. CTA Banner Section
  const renderCtaBanner = () => (
    <section key="ctaBanner" className="py-16 sm:py-20 bg-forest-900 text-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <span className="text-xs font-sans uppercase tracking-widest text-emerald-300 font-semibold inline-block">
            {isEn ? 'STREAM SANCTUARY VISIT' : 'CHÀO ĐÓN BẠN GHÉ THĂM'}
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
            {isEn ? (c?.homeCtaBannerTitleEn || 'Visit Cẩm Cù House This Weekend') : (c?.homeCtaBannerTitle || 'Ghé Thăm Cẩm Cù House Cuối Tuần Này')}
          </h2>
          <p className="text-sm sm:text-base text-forest-200/90 leading-relaxed max-w-xl mx-auto font-sans">
            {isEn ? (c?.homeCtaBannerDescEn || 'Savor wood-roasted basalt coffee, listen to bubbling streams, and immerse in pristine cool nature.') : (c?.homeCtaBannerDesc || 'Thưởng thức cà phê mộc bazan, lắng nghe tiếng suối reo và tận hưởng không khí trong lành nguyên bản.')}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <a href="tel:0382851688">
              <MagneticButton className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-sans font-medium text-sm rounded-xl shadow-lg flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>{isEn ? 'Hotline: 038 285 1688' : 'Hotline: 038 285 1688'}</span>
              </MagneticButton>
            </a>

            <a href={s.links.googleMaps} target="_blank" rel="noopener noreferrer">
              <MagneticButton sheen={false} className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-sans font-medium text-sm rounded-xl flex items-center gap-2">
                <Compass className="w-4 h-4 text-emerald-300" />
                <span>{isEn ? (c?.homeCtaBannerBtnTextEn || 'Get Directions (Google Maps)') : (c?.homeCtaBannerBtnText || 'Xem Chỉ Đường (Google Maps)')}</span>
              </MagneticButton>
            </a>
          </div>
        </div>
      </div>
    </section>
  );

  return (
    <main className="min-h-screen pt-[72px] bg-paper text-ink-primary">
      {homeOrder.map((sectionId) => {
        if (!isSectionVisible(sectionId)) return null;
        switch (sectionId) {
          case 'hero':
            return renderHero();
          case 'philosophy':
            return renderPhilosophy();
          case 'featuredMenu':
            return renderFeaturedMenu();
          case 'featuredSpace':
            return renderFeaturedSpace();
          case 'featuredReviews':
            return renderFeaturedReviews();
          case 'featuredEvents':
            return renderFeaturedEvents();
          case 'ctaBanner':
            return renderCtaBanner();
          default:
            return null;
        }
      })}

      <FooterSection />
    </main>
  );
}
