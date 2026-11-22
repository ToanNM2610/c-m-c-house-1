'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, Coffee, Calendar, HelpCircle, FileText, Camera, ArrowRight, Loader2, Plus, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '@/context/AppContext';
import { useCart } from '@/context/CartContext';

interface SearchResultPayload {
  menu: Array<{
    id: string;
    name: string;
    nameEn?: string;
    vietnameseTitle: string;
    description: string;
    priceDisplay?: string;
    highlight?: string;
  }>;
  events: Array<{
    id: string;
    title: string;
    titleEn?: string;
    subtitle: string;
    badge: string;
  }>;
  faqs: Array<{
    id: string;
    question: string;
    questionEn?: string;
    answer: string;
    answerEn?: string;
    category: string;
  }>;
  pages: Array<{
    id: string;
    slug: string;
    title: string;
    titleEn?: string;
  }>;
  plates: Array<{
    id: string;
    titleVi: string;
    titleEn?: string;
    chapterTitleVi: string;
    locationVi: string;
  }>;
}

export default function GlobalSearchModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const { language, data } = useApp();
  const { openCustomization } = useCart();
  const isEn = language === 'en';
  const commerceEnabled = data.commerceSettings?.commerceEnabled !== false;

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResultPayload | null>(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 80);
    } else {
      setQuery('');
      setResults(null);
    }
  }, [isOpen]);

  // Global Ctrl + K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Debounced search fetch
  useEffect(() => {
    if (!query || query.trim().length < 2) {
      setResults(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    const timeout = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query.trim())}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data);
        }
      } catch (err) {
        console.error('Search query failed:', err);
      } finally {
        setLoading(false);
      }
    }, 220);

    return () => clearTimeout(timeout);
  }, [query]);

  const handleSelect = (url: string) => {
    onClose();
    router.push(url);
  };

  const hasAnyResults =
    results &&
    (results.menu.length > 0 ||
      results.events.length > 0 ||
      results.faqs.length > 0 ||
      results.pages.length > 0 ||
      results.plates.length > 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/80">
          {/* Overlay dismissal */}
          <div className="fixed inset-0" onClick={onClose} />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -12 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-2xl bg-paper dark:bg-forest-900 rounded-3xl border border-forest-200 dark:border-forest-700 shadow-2xl overflow-hidden flex flex-col max-h-[82vh] z-10"
          >
            {/* Header Search Input */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-forest-200 dark:border-forest-700 bg-white dark:bg-forest-950">
              <Search className="w-5 h-5 text-accent-botanical flex-shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={
                  isEn
                    ? 'Search coffee, smoothies, herbal teas, events, FAQs, policies...'
                    : 'Tìm kiếm cà phê muối, trà thảo mộc, bơ sáp, sự kiện, FAQ...'
                }
                className="w-full bg-transparent text-sm sm:text-base text-ink-primary placeholder:text-ink-muted/60 focus:outline-none"
              />
              {loading && <Loader2 className="w-4 h-4 text-accent-botanical animate-spin" />}
              {query && !loading && (
                <button
                  onClick={() => setQuery('')}
                  className="p-1 text-ink-muted hover:text-ink-primary rounded-md"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <div className="hidden sm:flex items-center gap-1 text-[10px] font-mono text-ink-muted bg-forest-100 dark:bg-forest-800 px-2 py-0.5 rounded border border-forest-200 dark:border-forest-700">
                <span>ESC</span>
              </div>
            </div>

            {/* Results Body */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
              {!query && (
                <div className="py-8 text-center space-y-3">
                  <p className="font-serif text-lg text-ink-primary">
                    {isEn ? 'Global Search Across Cẩm Cù House' : 'Tìm Kiếm Toàn Diện Hệ Thống Cẩm Cù House'}
                  </p>
                  <p className="text-xs text-ink-muted max-w-sm mx-auto">
                    {isEn
                      ? 'Type any drink name, avocado smoothie, acoustic weekend schedule, directions, or policies.'
                      : 'Nhập tên món đồ uống, nông sản bơ sáp, lịch acoustic cuối tuần, hướng dẫn đường đi hoặc chính sách.'}
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs font-mono">
                    <span
                      onClick={() => setQuery('Cà phê muối')}
                      className="px-2.5 py-1 rounded-lg bg-forest-100 dark:bg-forest-800 text-accent-botanical cursor-pointer hover:bg-forest-200"
                    >
                      # Cà phê muối
                    </span>
                    <span
                      onClick={() => setQuery('Bơ sáp')}
                      className="px-2.5 py-1 rounded-lg bg-forest-100 dark:bg-forest-800 text-accent-botanical cursor-pointer hover:bg-forest-200"
                    >
                      # Bơ sáp Đăk Nông
                    </span>
                    <span
                      onClick={() => setQuery('Acoustic')}
                      className="px-2.5 py-1 rounded-lg bg-forest-100 dark:bg-forest-800 text-accent-botanical cursor-pointer hover:bg-forest-200"
                    >
                      # Acoustic cuối tuần
                    </span>
                    <span
                      onClick={() => setQuery('Đậu xe')}
                      className="px-2.5 py-1 rounded-lg bg-forest-100 dark:bg-forest-800 text-accent-botanical cursor-pointer hover:bg-forest-200"
                    >
                      # Đậu xe ô tô
                    </span>
                  </div>
                </div>
              )}

              {query && query.length >= 2 && !loading && !hasAnyResults && (
                <div className="py-12 text-center text-ink-muted space-y-2">
                  <p className="font-serif text-base text-ink-primary italic">
                    {isEn
                      ? `No results found for "${query}".`
                      : `Không tìm thấy kết quả phù hợp với "${query}".`}
                  </p>
                  <p className="text-xs">
                    {isEn
                      ? 'Try searching with shorter keywords like "muoi", "bo", "tra", or "suoi".'
                      : 'Hãy thử tìm với các từ khóa ngắn hơn như "muối", "bơ", "trà", hoặc "suối".'}
                  </p>
                </div>
              )}

              {results && hasAnyResults && (
                <div className="space-y-6">
                  {/* 1. Menu Items */}
                  {results.menu.length > 0 && (
                    <div className="space-y-2.5">
                      <div className="text-[11px] font-mono uppercase tracking-wider text-accent-botanical font-bold flex items-center gap-2">
                        <Coffee className="w-3.5 h-3.5" />
                        <span>{isEn ? `Menu Items (${results.menu.length})` : `Thực Đơn Đồ Uống (${results.menu.length})`}</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {results.menu.map((m) => (
                          <div
                            key={m.id}
                            onClick={() => handleSelect('/thuc-don')}
                            className="p-3 bg-white dark:bg-forest-800/80 rounded-xl border border-forest-100 dark:border-forest-700 hover:border-accent-botanical hover:shadow-subtle cursor-pointer transition-all flex items-center justify-between"
                          >
                            <div className="pr-2">
                              <p className="font-serif font-bold text-sm text-ink-primary">
                                {isEn && m.nameEn ? m.nameEn : m.vietnameseTitle}
                              </p>
                              <p className="text-[11px] text-ink-muted line-clamp-1">{m.description}</p>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <span className="font-mono text-xs font-bold text-accent-botanical whitespace-nowrap">
                                {m.priceDisplay}
                              </span>
                              {commerceEnabled && (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onClose();
                                    openCustomization({
                                      id: m.id,
                                      name: m.name,
                                      nameEn: m.nameEn,
                                      vietnameseTitle: m.vietnameseTitle,
                                      description: m.description,
                                      price: parseInt((m.priceDisplay || '35000').replace(/\D/g, ''), 10) || 35000,
                                      categoryId: 'coffee',
                                      inStock: true,
                                    } as any);
                                  }}
                                  className="p-1.5 rounded-lg bg-accent-botanical/10 hover:bg-accent-botanical text-accent-botanical hover:text-white transition-colors"
                                  title={isEn ? 'Add to cart' : 'Thêm vào giỏ'}
                                  aria-label="Thêm vào giỏ"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 2. Events & Acoustic */}
                  {results.events.length > 0 && (
                    <div className="space-y-2.5">
                      <div className="text-[11px] font-mono uppercase tracking-wider text-accent-botanical font-bold flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{isEn ? `Events & News (${results.events.length})` : `Tin Tức & Sự Kiện (${results.events.length})`}</span>
                      </div>
                      <div className="space-y-2">
                        {results.events.map((e) => (
                          <div
                            key={e.id}
                            onClick={() => handleSelect('/su-kien')}
                            className="p-3 bg-white dark:bg-forest-800/80 rounded-xl border border-forest-100 dark:border-forest-700 hover:border-accent-botanical hover:shadow-subtle cursor-pointer transition-all flex items-center justify-between"
                          >
                            <div>
                              <p className="font-serif font-bold text-sm text-ink-primary">
                                {isEn && e.titleEn ? e.titleEn : e.title}
                              </p>
                              <p className="text-xs text-ink-muted">{e.subtitle}</p>
                            </div>
                            <ArrowRight className="w-4 h-4 text-accent-botanical" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 3. FAQs */}
                  {results.faqs.length > 0 && (
                    <div className="space-y-2.5">
                      <div className="text-[11px] font-mono uppercase tracking-wider text-accent-botanical font-bold flex items-center gap-2">
                        <HelpCircle className="w-3.5 h-3.5" />
                        <span>{isEn ? `Guest FAQs (${results.faqs.length})` : `Câu Hỏi Thường Gặp (${results.faqs.length})`}</span>
                      </div>
                      <div className="space-y-2">
                        {results.faqs.map((f) => (
                          <div
                            key={f.id}
                            onClick={() => handleSelect('/su-kien')}
                            className="p-3 bg-white dark:bg-forest-800/80 rounded-xl border border-forest-100 dark:border-forest-700 hover:border-accent-botanical hover:shadow-subtle cursor-pointer transition-all space-y-1"
                          >
                            <p className="font-serif font-bold text-sm text-ink-primary">
                              {isEn && f.questionEn ? f.questionEn : f.question}
                            </p>
                            <p className="text-xs text-ink-muted line-clamp-2">{isEn && f.answerEn ? f.answerEn : f.answer}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 4. Spatial Plates */}
                  {results.plates.length > 0 && (
                    <div className="space-y-2.5">
                      <div className="text-[11px] font-mono uppercase tracking-wider text-accent-botanical font-bold flex items-center gap-2">
                        <Camera className="w-3.5 h-3.5" />
                        <span>{isEn ? `Spatial Plates (${results.plates.length})` : `Góc Không Gian 30 Plates (${results.plates.length})`}</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {results.plates.map((p) => (
                          <div
                            key={p.id}
                            onClick={() => handleSelect('/gioi-thieu')}
                            className="p-3 bg-white dark:bg-forest-800/80 rounded-xl border border-forest-100 dark:border-forest-700 hover:border-accent-botanical hover:shadow-subtle cursor-pointer transition-all flex items-center justify-between"
                          >
                            <div>
                              <span className="text-[10px] font-mono font-bold text-accent-botanical block">
                                {p.id} • {p.locationVi}
                              </span>
                              <p className="font-serif font-bold text-sm text-ink-primary">
                                {isEn && p.titleEn ? p.titleEn : p.titleVi}
                              </p>
                            </div>
                            <ArrowRight className="w-4 h-4 text-accent-botanical" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 5. Static Legal Pages */}
                  {results.pages.length > 0 && (
                    <div className="space-y-2.5">
                      <div className="text-[11px] font-mono uppercase tracking-wider text-accent-botanical font-bold flex items-center gap-2">
                        <FileText className="w-3.5 h-3.5" />
                        <span>{isEn ? `Policies & Legal Pages (${results.pages.length})` : `Trang Thông Tin & Chính Sách (${results.pages.length})`}</span>
                      </div>
                      <div className="space-y-2">
                        {results.pages.map((pg) => (
                          <div
                            key={pg.id}
                            onClick={() => handleSelect(`/p/${pg.slug}`)}
                            className="p-3 bg-white dark:bg-forest-800/80 rounded-xl border border-forest-100 dark:border-forest-700 hover:border-accent-botanical hover:shadow-subtle cursor-pointer transition-all flex items-center justify-between"
                          >
                            <p className="font-serif font-bold text-sm text-ink-primary">
                              {isEn && pg.titleEn ? pg.titleEn : pg.title}
                            </p>
                            <ArrowRight className="w-4 h-4 text-accent-botanical" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-5 py-3 border-t border-forest-200/80 dark:border-forest-700/80 bg-forest-50/60 dark:bg-forest-950/40 text-[11px] font-mono text-ink-muted flex items-center justify-between">
              <span>Cẩm Cù House Enterprise Search</span>
              <span>Hẻm 437 Hùng Vương, Đông Gia Nghĩa, Lâm Đồng</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
