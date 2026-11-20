'use client';

import React, { useState, useMemo } from 'react';
import { Search, Sparkles, Coffee, Leaf, Citrus, Sun, Flame, Utensils, Phone, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '@/context/AppContext';
import { CategoryId, MenuItem } from '@/types';
import { SPRING_PILL_TRANSITION, EDITORIAL_EASE } from '@/components/motion/EditorialMotion';
import { InteractiveTiltCard } from '@/components/motion/VividMotion';

function MenuItemCard({ item, isEn }: { item: MenuItem; isEn: boolean }) {
  const inStock = item.inStock;
  const name = isEn && item.nameEn ? item.nameEn : item.vietnameseTitle;
  const highlight = isEn && item.highlightEn ? item.highlightEn : item.highlight;
  const note = isEn && item.editorialNoteEn ? item.editorialNoteEn : item.editorialNote;
  const desc = isEn && item.descriptionEn ? item.descriptionEn : item.description;
  const variants = isEn && item.variantsEn && item.variantsEn.length > 0 ? item.variantsEn : item.variants;

  return (
    <InteractiveTiltCard maxTilt={2.8} spotlight={true} className="h-full">
      <div
        className={`p-5 sm:p-6 rounded-2xl bg-white/80 dark:bg-forest-900/60 backdrop-blur-sm border transition-all duration-200 flex flex-col justify-between h-full ${
          inStock
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
                  <span className="text-[10px] font-mono text-amber-800 dark:text-amber-200 bg-amber-100 dark:bg-amber-950/60 px-2.5 py-0.5 rounded-full font-semibold flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5" />
                    {highlight}
                  </span>
                )}
                {!inStock && (
                  <span className="text-[10px] font-mono text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-950/60 px-2 py-0.5 rounded-full font-bold">
                    {isEn ? 'Sold Out' : 'Tạm hết'}
                  </span>
                )}
              </div>
              {note && (
                <p className="text-xs font-serif italic text-accent-earth mt-1">
                  {note}
                </p>
              )}
            </div>

            {/* Price */}
            <div className="font-mono text-base font-bold text-accent-botanical whitespace-nowrap">
              {item.priceDisplay || `${item.price.toLocaleString('vi-VN')}đ`}
            </div>
          </div>

          {/* Description */}
          <p className="text-xs text-ink-muted leading-relaxed mb-3">
            {desc}
          </p>

          {/* Available Variant Labels as clean read-only tags */}
          {variants && variants.length > 0 && (
            <div className="pt-2 border-t border-forest-100/70 dark:border-forest-800 flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] font-mono text-forest-400 mr-1">
                {isEn ? 'Options:' : 'Tùy chọn:'}
              </span>
              {variants.map((v) => (
                <span
                  key={v.id}
                  className="px-2 py-0.5 rounded-md bg-forest-50 dark:bg-forest-800/80 text-forest-700 dark:text-forest-200 text-[11px] font-mono border border-forest-200/60 dark:border-forest-700"
                >
                  {v.name} • {v.price.toLocaleString('vi-VN')}đ
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </InteractiveTiltCard>
  );
}

export default function MenuSection() {
  const { data, language } = useApp();
  const isEn = language === 'en';

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
      // Category match
      if (activeCategory !== 'all' && item.categoryId !== activeCategory) {
        return false;
      }
      // Mood match
      if (selectedMood !== 'all' && (!item.moodTags || !item.moodTags.includes(selectedMood))) {
        return false;
      }
      // Search query
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

  return (
    <section id="menu-section" className="py-8 sm:py-12 px-4 sm:px-8 max-w-7xl mx-auto z-10 relative">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
        <div className="text-xs font-mono uppercase tracking-widest text-accent-botanical font-semibold flex items-center justify-center gap-2">
          <span className="w-6 h-px bg-accent-botanical" />
          <span>EDITORIAL TEXT-ONLY MENU • 100% CẨM CÙ HOUSE</span>
          <span className="w-6 h-px bg-accent-botanical" />
        </div>
        <h2 className="font-serif text-4xl sm:text-5xl font-bold text-ink-primary">
          {isEn ? 'Botanical Eco-Menu' : 'Thực Đơn Sinh Thái'}
        </h2>
        <p className="text-sm text-ink-muted leading-relaxed">
          {isEn
            ? 'Carefully crafted from rich Dak Nong agricultural harvests, traditionally wood-roasted and hand-brewed in small artisan batches.'
            : 'Được tinh tuyển từ nguồn nông sản Đăk Nông trù phú, rang củi mộc và pha chế thủ công tỉ mỉ từng mẻ nhỏ.'}
        </p>
      </div>

      {/* Sticky Category Tabs Bar */}
      <div className="sticky top-20 z-30 bg-paper/95 backdrop-blur-md py-3 -mx-4 px-4 sm:-mx-8 sm:px-8 border-y border-forest-200/80 dark:border-forest-700/60 mb-6">
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
                    : 'bg-white dark:bg-forest-900/60 text-ink-muted hover:text-ink-primary border border-forest-100 dark:border-forest-700 hover:border-forest-300'
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
                <span className="relative z-10">{cat.label}</span>
                <span className={`relative z-10 text-[10px] font-mono ${isActive ? 'text-white/80' : 'text-ink-muted/70'}`}>
                  ({count})
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Search & Mood Quick Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-ink-muted absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder={isEn ? 'Search item name, ingredients (avocado, kale, salt...)...' : 'Tìm theo tên món, nguyên liệu (bơ sáp, cải kale, muối...)'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-forest-900/80 rounded-xl border border-forest-200 dark:border-forest-700 text-xs text-ink-primary focus:outline-none focus:border-accent-botanical shadow-subtle"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-2.5 text-xs text-ink-muted hover:text-ink-primary"
            >
              {isEn ? 'Clear' : 'Xóa'}
            </button>
          )}
        </div>

        {/* Mood/Need Selector */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {moodFilters.map((mood) => {
            const isMoodActive = selectedMood === mood.id;
            return (
              <button
                key={mood.id}
                onClick={() => setSelectedMood(mood.id as any)}
                className={`relative px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  isMoodActive
                    ? 'text-white dark:text-white font-semibold'
                    : 'bg-white/60 dark:bg-forest-900/40 text-ink-muted hover:text-ink-primary border border-forest-100 dark:border-forest-800'
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

      {/* Menu Item Grid: Smooth Reflow (layout + AnimatePresence popLayout) */}
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
              <MenuItemCard item={item} isEn={isEn} />
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

      {/* Subtle Editorial Callout Box for Takeaway Phone Orders */}
      <div className="mt-14 p-6 sm:p-8 rounded-3xl bg-forest-50/80 dark:bg-forest-950/40 border border-forest-200/80 dark:border-forest-700/60 shadow-subtle">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5 max-w-xl">
            <div className="text-xs font-mono uppercase tracking-widest text-accent-botanical font-semibold flex items-center gap-2">
              <Clock className="w-3.5 h-3.5" />
              <span>{isEn ? 'CALL AHEAD FOR TAKEAWAY' : 'GỌI MÓN MANG VỀ (TAKEAWAY)'}</span>
            </div>
            <h3 className="font-serif text-2xl font-bold text-ink-primary">
              {isEn ? 'Enjoy Cẩm Cù Flavors at Home or Office' : 'Thưởng Thức Hương Vị Cẩm Cù Tại Nhà Hoặc Cơ Quan'}
            </h3>
            <p className="text-xs sm:text-sm text-ink-muted leading-relaxed">
              {isEn
                ? 'Call our baristas directly 15–20 minutes in advance so we can prepare your fresh drinks and hot food with supreme care.'
                : 'Quý khách có thể gọi điện thoại trực tiếp trước 15–20 phút để quán chuẩn bị chu đáo thức uống và đồ ăn mang về luôn tươi mới.'}
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
            <a
              href="tel:0382851688"
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-accent-botanical hover:bg-forest-800 text-white text-xs font-mono font-medium transition-all shadow-sm active:scale-95 whitespace-nowrap"
            >
              <Phone className="w-4 h-4" />
              <span>0382 851 688</span>
            </a>
            <a
              href="tel:0774659000"
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-white dark:bg-forest-900 hover:bg-forest-100 dark:hover:bg-forest-800 text-ink-primary text-xs font-mono font-medium border border-forest-200 dark:border-forest-700 transition-all shadow-subtle active:scale-95 whitespace-nowrap"
            >
              <Phone className="w-4 h-4 text-accent-botanical" />
              <span>0774 659 000</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
