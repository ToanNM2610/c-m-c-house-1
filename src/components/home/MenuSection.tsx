'use client';

import React, { useState, useMemo } from 'react';
import { Search, Sparkles, Coffee, Leaf, Citrus, Sun, Flame, Utensils, Phone, Clock, Heart, Plus, ShoppingBag, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '@/context/AppContext';
import { useCart } from '@/context/CartContext';
import { useCustomerAuth } from '@/context/CustomerAuthContext';
import { CategoryId, MenuItem } from '@/types';
import { SPRING_PILL_TRANSITION, EDITORIAL_EASE } from '@/components/motion/EditorialMotion';
import { InteractiveTiltCard, MagneticButton } from '@/components/motion/VividMotion';

function MenuItemCard({
  item,
  isEn,
  usdRate = 25000,
  showPrices = true,
  showAddToCart = true,
}: {
  item: MenuItem;
  isEn: boolean;
  usdRate?: number;
  showPrices?: boolean;
  showAddToCart?: boolean;
}) {
  const { openCustomization } = useCart();
  const { isWishlisted, toggleWishlist } = useCustomerAuth();

  const isOutOfStock = !item.inStock || (item.stockQuantity !== undefined && item.stockQuantity !== null && item.stockQuantity <= 0);
  const isOrderingPaused = item.allowOrdering === false;
  const isSoldOut = isOutOfStock || isOrderingPaused;
  const isOrderable = !isSoldOut;
  const wishlisted = isWishlisted(item.id);
  const name = isEn && item.nameEn ? item.nameEn : item.vietnameseTitle;
  const highlight = isEn && item.highlightEn ? item.highlightEn : item.highlight;
  const note = isEn && item.editorialNoteEn ? item.editorialNoteEn : item.editorialNote;
  const desc = isEn && item.descriptionEn ? item.descriptionEn : item.description;
  const variants = isEn && item.variantsEn && item.variantsEn.length > 0 ? item.variantsEn : item.variants;
  const usdPrice = (item.price / (usdRate || 25000)).toFixed(2);

  return (
    <InteractiveTiltCard maxTilt={2.8} spotlight={true} className="h-full">
      <div
        className={`p-5 sm:p-6 rounded-2xl bg-white dark:bg-forest-900 border transition-all duration-200 flex flex-col justify-between h-full ${
          isOrderable
            ? 'border-forest-100 dark:border-forest-700/60 hover:border-accent-botanical/50 shadow-subtle'
            : 'border-red-100 dark:border-red-900/40 bg-red-50/20 dark:bg-red-950/20 opacity-75'
        }`}
      >
        <div>
          {/* Title & Price Header */}
          <div className="flex items-start justify-between gap-4 mb-2">
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-serif text-lg sm:text-xl font-bold text-ink-primary tracking-tight">
                  {name}
                </h3>
                {highlight && (
                  <span className="text-[10px] font-sans text-amber-800 dark:text-amber-200 bg-amber-100 dark:bg-amber-950/60 px-2.5 py-0.5 rounded-full font-semibold flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5" />
                    {highlight}
                  </span>
                )}
                {isOutOfStock && (
                  <span className="text-[10px] font-sans text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-950/60 px-2 py-0.5 rounded-full font-bold">
                    {isEn ? 'Sold Out' : 'Tạm hết món'}
                  </span>
                )}
                {!isOutOfStock && isOrderingPaused && (
                  <span className="text-[10px] font-sans text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/60 px-2 py-0.5 rounded-full font-bold">
                    {isEn ? 'Paused' : 'Tạm ngưng nhận đơn'}
                  </span>
                )}
              </div>
              {note && (
                <p className="text-xs font-serif italic text-accent-earth mt-1">
                  {note}
                </p>
              )}
            </div>

            {/* Price & Wishlist */}
            <div className="flex flex-col items-end shrink-0 whitespace-nowrap">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleWishlist(item.id);
                  }}
                  className={`p-1.5 rounded-full border transition-colors ${
                    wishlisted
                      ? 'border-red-200 bg-red-50 text-red-500 dark:bg-red-950/40 dark:border-red-900'
                      : 'border-forest-200 dark:border-forest-700 text-ink-muted hover:text-red-500 hover:border-red-200'
                  }`}
                  aria-label={wishlisted ? 'Bỏ yêu thích' : 'Yêu thích'}
                >
                  <Heart className={`w-3.5 h-3.5 ${wishlisted ? 'fill-red-500 text-red-500' : ''}`} />
                </button>
                {showPrices && (
                  <span className="font-sans text-base font-bold text-accent-botanical">
                    {item.priceDisplay || `${item.price.toLocaleString('vi-VN')}đ`}
                  </span>
                )}
              </div>
              {showPrices && isEn && (
                <span className="block text-[11px] font-normal text-ink-muted font-sans">
                  ~ ${usdPrice} USD
                </span>
              )}
            </div>
          </div>

          {/* Description */}
          <p className="text-xs text-ink-muted leading-relaxed mb-3 font-sans">
            {desc}
          </p>

          {/* Available Variant Labels */}
          {variants && variants.length > 0 && (
            <div className="pt-2 border-t border-forest-100/70 dark:border-forest-800 flex flex-wrap items-center gap-1.5">
              <span className="text-xs font-sans text-forest-600 dark:text-forest-400 mr-1">
                {isEn ? 'Options:' : 'Tùy chọn:'}
              </span>
              {variants.map((v) => (
                <span
                  key={v.id}
                  className="px-2 py-0.5 rounded-md bg-forest-50 dark:bg-forest-800/80 text-forest-700 dark:text-forest-200 text-xs font-sans border border-forest-200/60 dark:border-forest-700"
                >
                  {v.name} {showPrices && `• ${v.price.toLocaleString('vi-VN')}đ`}
                  {showPrices && isEn && ` (~$${(v.price / (usdRate || 25000)).toFixed(2)})`}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Action Button */}
        {showAddToCart && (
          <div className="mt-4 pt-3 border-t border-forest-100 dark:border-forest-800">
            {isOrderable ? (
              <button
                type="button"
                onClick={() => openCustomization(item)}
                className="w-full py-2.5 px-3 rounded-xl bg-accent-botanical/10 dark:bg-accent-botanical/20 hover:bg-accent-botanical hover:text-white text-accent-botanical font-sans text-sm font-semibold transition-all flex items-center justify-center gap-1.5 active:scale-[0.98]"
              >
                <Plus className="w-4 h-4" />
                <span>{isEn ? 'Add to Cart / Customize' : 'Thêm vào giỏ / Tùy chọn'}</span>
              </button>
            ) : (
              <div className="w-full py-2.5 px-3 rounded-xl bg-forest-100/60 dark:bg-forest-800/40 text-ink-muted font-sans text-sm text-center font-medium">
                {isOutOfStock
                  ? (isEn ? 'Temporarily Sold Out' : 'Tạm hết món')
                  : (isEn ? 'Ordering Paused' : 'Tạm ngưng nhận đơn')}
              </div>
            )}
          </div>
        )}
      </div>
    </InteractiveTiltCard>
  );
}

export default function MenuSection() {
  const { data, content, language } = useApp();
  const c = content || data.content;
  const isEn = language === 'en';

  const menuEyebrow = isEn && c?.menuEyebrowEn ? c.menuEyebrowEn : (c?.menuEyebrow || 'EDITORIAL TEXT-ONLY MENU • 100% CẨM CÙ HOUSE');
  const menuTitle = isEn && c?.menuTitleEn ? c.menuTitleEn : (c?.menuTitle || (isEn ? 'Botanical Eco-Menu' : 'Thực Đơn Sinh Thái'));
  const menuSubtitle = isEn && c?.menuSubtitleEn ? c.menuSubtitleEn : c?.menuSubtitle;
  const menuIntro = isEn && c?.menuIntroEn ? c.menuIntroEn : (c?.menuIntro || (isEn ? 'Carefully crafted from rich Dak Nong agricultural harvests, traditionally wood-roasted and hand-brewed in small artisan batches.' : 'Được tinh tuyển từ nguồn nông sản Đăk Nông trù phú, rang củi mộc và pha chế thủ công tỉ mỉ từng mẻ nhỏ.'));
  const menuNotice = isEn && c?.menuNoticeEn ? c.menuNoticeEn : (c?.menuNotice || (isEn ? 'Call our baristas directly 15–20 minutes in advance so we can prepare your fresh drinks and hot food with supreme care.' : 'Quý khách có thể gọi điện thoại trực tiếp trước 15–20 phút để quán chuẩn bị chu đáo thức uống và đồ ăn mang về luôn tươi mới.'));

  const showPrices = c?.menuShowPrices !== false;
  const commerceEnabled = data.commerceSettings?.commerceEnabled !== false;
  const showAddToCart = commerceEnabled && (c?.menuShowAddToCart !== false);
  const dietaryNote = isEn && c?.menuDietaryNoteEn ? c?.menuDietaryNoteEn : (c?.menuDietaryNote || '100% Cà phê rang mộc tự nhiên • Nông sản địa phương Gia Nghĩa • Thảo mộc hái tươi mỗi sáng');
  const currencyNote = isEn && c?.menuCurrencyNoteEn ? c?.menuCurrencyNoteEn : (c?.menuCurrencyNote || 'Đơn vị tính: VNĐ (Đã bao gồm VAT). Hỗ trợ thanh toán tiền mặt & chuyển khoản VietQR.');

  const [activeCategory, setActiveCategory] = useState<CategoryId | 'all'>('coffee');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMood, setSelectedMood] = useState<'all' | 'alert' | 'warm' | 'refresh' | 'food'>('all');

  const categories = [
    { id: 'coffee', label: isEn ? 'Coffee' : 'Cà phê', icon: Coffee },
    { id: 'tea', label: isEn ? 'Herbal Tea' : 'Trà & Thảo mộc', icon: Leaf },
    { id: 'smoothie', label: isEn ? 'Smoothie' : 'Sinh tố', icon: Citrus },
    { id: 'juice', label: isEn ? 'Fresh Juice' : 'Nước ép', icon: Sun },
    { id: 'soda-yogurt', label: isEn ? 'Soda & Yogurt' : 'Soda / Sữa chua', icon: Sparkles },
    { id: 'other', label: isEn ? 'Other Drinks' : 'Thức uống khác', icon: Flame },
    { id: 'food', label: isEn ? 'Food & Snacks' : 'Đồ ăn no & Ăn vặt', icon: Utensils },
  ];

  const moodFilters = [
    { id: 'all', label: isEn ? 'All Moods' : 'Tất cả nhu cầu' },
    { id: 'alert', label: isEn ? '☕ Alert & Focus' : '☕ Cà phê tỉnh táo' },
    { id: 'warm', label: isEn ? '🌿 Warm & Soothing' : '🌿 Thảo mộc ấm bụng' },
    { id: 'refresh', label: isEn ? '❄️ Cool & Refreshing' : '❄️ Giải nhiệt tươi mát' },
    { id: 'food', label: isEn ? '🍲 Meals & Snacks' : '🍲 Đồ ăn no & Ăn vặt' },
  ];

  const filteredItems = useMemo(() => {
    return data.menu.filter((item) => {
      if (activeCategory !== 'all' && item.categoryId !== activeCategory) {
        return false;
      }
      if (selectedMood !== 'all' && (!item.moodTags || !item.moodTags.includes(selectedMood))) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchTitle = item.vietnameseTitle.toLowerCase().includes(q);
        const matchName = item.name.toLowerCase().includes(q);
        const matchNameEn = item.nameEn?.toLowerCase().includes(q);
        const matchDesc = item.description.toLowerCase().includes(q);
        const matchDescEn = item.descriptionEn?.toLowerCase().includes(q);
        const matchIngredients = item.ingredients?.some((ing) => ing.toLowerCase().includes(q));
        if (!matchTitle && !matchName && !matchNameEn && !matchDesc && !matchDescEn && !matchIngredients) return false;
      }
      return true;
    });
  }, [data.menu, activeCategory, selectedMood, searchQuery]);

  // Universal Section Order & Visibility Resolution
  const defaultMenuOrder = ['header', 'filterAndSearch', 'dietaryNote', 'bbqBanner'];
  const menuOrder = (c?.menuSectionOrder && Array.isArray(c.menuSectionOrder) && c.menuSectionOrder.length > 0)
    ? c.menuSectionOrder
    : defaultMenuOrder;

  const isSectionVisible = (id: string) => {
    if (c?.sectionVisibility && c.sectionVisibility['menu-' + id] === false) return false;
    if (id === 'bbqBanner' && c?.showMenuBbqBanner === false) return false;
    return true;
  };

  /* ========================================================= */
  /* SECTION RENDERERS                                         */
  /* ========================================================= */

  // 1. Header
  const renderHeader = () => (
    <div key="header" className="text-center max-w-2xl mx-auto mb-10 space-y-3">
      <div className="text-xs font-sans uppercase tracking-widest text-accent-botanical font-semibold flex items-center justify-center gap-2">
        <span className="w-6 h-px bg-accent-botanical" />
        <span>{menuEyebrow}</span>
        <span className="w-6 h-px bg-accent-botanical" />
      </div>
      <h2 className="font-serif text-4xl sm:text-5xl font-bold text-ink-primary">
        {menuTitle}
      </h2>
      {menuSubtitle && (
        <p className="font-serif text-base italic text-accent-earth">
          {menuSubtitle}
        </p>
      )}
      <p className="text-sm text-ink-muted leading-relaxed font-sans">
        {menuIntro}
      </p>
    </div>
  );

  // 2. Filter & Search & Menu Grid
  const renderFilterAndSearch = () => (
    <React.Fragment key="filterAndSearch">
      {/* Sticky Category Tabs Bar */}
      <div className="sticky top-20 z-30 bg-paper py-3 -mx-4 px-4 sm:-mx-8 sm:px-8 border-y border-forest-200 dark:border-forest-700 mb-6">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const count = data.menu.filter((m) => m.categoryId === cat.id).length;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveCategory(cat.id as CategoryId);
                  setSelectedMood('all');
                }}
                className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${
                  isActive
                    ? 'text-white shadow-sm font-semibold'
                    : 'bg-white dark:bg-forest-900 text-ink-muted hover:text-ink-primary border border-forest-200 dark:border-forest-700 hover:border-forest-300'
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="menu-cat-pill"
                    className="absolute inset-0 rounded-xl bg-accent-botanical shadow-sm -z-10"
                    transition={SPRING_PILL_TRANSITION}
                  />
                )}
                <Icon className="w-3.5 h-3.5 relative z-10" />
                <span className="relative z-10 font-sans">{cat.label}</span>
                <span className={`relative z-10 text-xs font-sans font-medium ${isActive ? 'text-white/90' : 'text-ink-muted'}`}>
                  ({count})
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Search & Mood Quick Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-ink-muted absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder={isEn ? 'Search item name, ingredients (avocado, kale, salt...)...' : 'Tìm theo tên món, nguyên liệu (bơ sáp, cải kale, muối...)'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-forest-900 rounded-xl border border-forest-200 dark:border-forest-700 text-xs text-ink-primary focus:outline-none focus:border-accent-botanical shadow-subtle font-sans"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-2.5 text-xs text-ink-muted hover:text-ink-primary font-sans"
            >
              {isEn ? 'Clear' : 'Xóa'}
            </button>
          )}
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {moodFilters.map((mood) => {
            const isMoodActive = selectedMood === mood.id;
            return (
              <button
                key={mood.id}
                onClick={() => setSelectedMood(mood.id as any)}
                className={`relative px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors font-sans ${
                  isMoodActive
                    ? 'text-white dark:text-white font-semibold'
                    : 'bg-white dark:bg-forest-900 text-ink-muted hover:text-ink-primary border border-forest-200 dark:border-forest-700'
                }`}
              >
                {isMoodActive && (
                  <motion.span
                    layoutId="menu-mood-pill"
                    className="absolute inset-0 rounded-lg bg-ink-primary dark:bg-accent-botanical shadow-xs -z-10"
                    transition={SPRING_PILL_TRANSITION}
                  />
                )}
                <span className="relative z-10">{mood.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Menu Item Grid */}
      <motion.div layout className="grid grid-cols-1 lg:grid-cols-2 gap-x-10 gap-y-6">
        <AnimatePresence mode="popLayout">
          {filteredItems.map((item) => (
            <motion.div
              layout
              key={item.id}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.28, ease: EDITORIAL_EASE }}
            >
              <MenuItemCard
                item={item}
                isEn={isEn}
                usdRate={data.settings.usdExchangeRate}
                showPrices={showPrices}
                showAddToCart={showAddToCart}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12 text-ink-muted">
          <p className="text-sm font-serif italic">
            {isEn
              ? `No items found matching keyword "${searchQuery}".`
              : `Không tìm thấy món phù hợp với từ khóa "${searchQuery}".`}
          </p>
        </div>
      )}
    </React.Fragment>
  );

  // 3. Dietary Note
  const renderDietaryNote = () => (
    <div key="dietaryNote" className="mt-10 p-5 rounded-2xl bg-forest-50/60 dark:bg-forest-950/30 border border-forest-200/60 dark:border-forest-700/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-sans text-ink-muted">
      <div className="flex items-center gap-2">
        <Info className="w-4 h-4 text-accent-botanical shrink-0" />
        <span>{dietaryNote}</span>
      </div>
      <span className="text-forest-400 font-medium whitespace-nowrap">
        {currencyNote}
      </span>
    </div>
  );

  // 4. BBQ Banner & Takeaway Notice
  const renderBbqBanner = () => (
    <div key="bbqBanner" className="mt-14 p-6 sm:p-8 rounded-3xl bg-forest-50/80 dark:bg-forest-950/40 border border-forest-200/80 dark:border-forest-700/60 shadow-subtle">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5 max-w-xl">
          <div className="text-xs font-sans uppercase tracking-widest text-accent-botanical font-semibold flex items-center gap-2">
            <Clock className="w-3.5 h-3.5" />
            <span>{isEn ? 'CALL AHEAD FOR TAKEAWAY & BBQ' : 'GỌI MÓN MANG VỀ & ĐẶT TIỆC BBQ'}</span>
          </div>
          <h3 className="font-serif text-2xl font-bold text-ink-primary">
            {isEn ? (c?.menuBbqBannerTitleEn || 'Enjoy Streamside BBQ & Coffee') : (c?.menuBbqBannerTitle || 'Thưởng Thức Tiệc BBQ & Cà Phê Suối')}
          </h3>
          <p className="text-xs sm:text-sm text-ink-muted leading-relaxed font-sans">
            {isEn ? (c?.menuBbqBannerDescEn || 'Pre-order your streamside BBQ set or takeaway items 1 day in advance.') : (c?.menuBbqBannerDesc || menuNotice)}
          </p>
        </div>

        <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
          <a
            href="tel:0382851688"
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-accent-botanical hover:bg-forest-800 text-white text-sm font-sans font-semibold transition-all shadow-sm active:scale-95 whitespace-nowrap"
          >
            <Phone className="w-4 h-4" />
            <span>{isEn ? (c?.menuBbqBannerBtnTextEn || 'Call Hotline 038 285 1688') : (c?.menuBbqBannerBtnText || 'Gọi Hotline 038 285 1688')}</span>
          </a>
          <a
            href="tel:0774659000"
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-white dark:bg-forest-900 hover:bg-forest-100 dark:hover:bg-forest-800 text-ink-primary text-sm font-sans font-semibold border border-forest-200 dark:border-forest-700 transition-all shadow-subtle active:scale-95 whitespace-nowrap"
          >
            <Phone className="w-4 h-4 text-accent-botanical" />
            <span>{isEn ? '+84 774 659 000' : '0774 659 000'}</span>
          </a>
        </div>
      </div>
    </div>
  );

  return (
    <section id="menu-section" className="py-8 sm:py-12 px-4 sm:px-8 max-w-7xl mx-auto z-10 relative">
      {menuOrder.map((sectionId) => {
        if (!isSectionVisible(sectionId)) return null;
        switch (sectionId) {
          case 'header':
            return renderHeader();
          case 'filterAndSearch':
            return renderFilterAndSearch();
          case 'dietaryNote':
            return renderDietaryNote();
          case 'bbqBanner':
            return renderBbqBanner();
          default:
            return null;
        }
      })}
    </section>
  );
}
