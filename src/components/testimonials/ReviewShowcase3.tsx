'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, CheckCircle2, Calendar, Quote } from 'lucide-react';
import { GuestComment, CafeSettings } from '@/types';
import { useApp } from '@/context/AppContext';
import { InteractiveTiltCard } from '@/components/motion/VividMotion';

interface ReviewShowcase3Props {
  comments: GuestComment[];
  settings?: Partial<CafeSettings>;
}

// Utility: Fisher-Yates shuffle
function shuffleArray<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export default function ReviewShowcase3({ comments, settings }: ReviewShowcase3Props) {
  const { language } = useApp();
  const isEn = language === 'en';

  // Approved comments only
  const approved = useMemo(() => {
    return comments.filter((c) => c.status === 'APPROVED' || !c.status);
  }, [comments]);

  // Mode and interval strictly controlled by Admin settings
  const isManualMode = settings?.reviewDisplayMode === 'MANUAL';
  const intervalSec = Math.min(30, Math.max(3, settings?.reviewAutoIntervalSec || 6));

  const [currentIds, setCurrentIds] = useState<string[]>([]);
  const [isHovered, setIsHovered] = useState(false);

  // Pick initial trio based on Admin settings
  const pickInitialTrio = useCallback(() => {
    if (approved.length === 0) return [];
    if (approved.length <= 3) return approved.map((c) => c.id);

    // MANUAL mode: Strictly prefer Admin-pinned reviews (isFeatured: true)
    if (isManualMode) {
      const featured = approved.filter((c) => c.isFeatured);
      const nonFeatured = approved.filter((c) => !c.isFeatured);
      const combined = [...featured, ...nonFeatured];
      return combined.slice(0, 3).map((c) => c.id);
    }

    // AUTO_RANDOM mode: Random 3 distinct reviews
    const shuffled = shuffleArray(approved);
    return shuffled.slice(0, 3).map((c) => c.id);
  }, [approved, isManualMode]);

  // Initialize or re-sync when settings or comments change
  useEffect(() => {
    if (approved.length > 0) {
      setCurrentIds(pickInitialTrio());
    }
  }, [approved, pickInitialTrio]);

  // Draw 3 fresh random reviews (only in AUTO_RANDOM mode)
  const drawNextRandom = useCallback(() => {
    if (approved.length <= 3 || isManualMode) return;

    let nextIds: string[] = [];
    let attempts = 0;
    const currentSet = new Set(currentIds);

    do {
      const shuffled = shuffleArray(approved);
      nextIds = shuffled.slice(0, 3).map((c) => c.id);
      attempts++;
    } while (
      attempts < 10 &&
      nextIds.length === 3 &&
      nextIds.every((id) => currentSet.has(id)) &&
      approved.length > 3
    );

    setCurrentIds(nextIds);
  }, [approved, currentIds, isManualMode]);

  // Silent automatic rotation timer (AUTO_RANDOM mode only, quietly paused on hover)
  useEffect(() => {
    if (isManualMode || isHovered || approved.length <= 3) {
      return;
    }

    const interval = setInterval(() => {
      drawNextRandom();
    }, intervalSec * 1000);

    return () => clearInterval(interval);
  }, [isManualMode, isHovered, intervalSec, approved.length, drawNextRandom]);

  // Resolve active 3 comment objects
  const activeReviews = useMemo(() => {
    if (approved.length === 0) return [];
    if (approved.length <= 3) return approved;

    if (isManualMode) {
      const featured = approved.filter((c) => c.isFeatured);
      const nonFeatured = approved.filter((c) => !c.isFeatured);
      return [...featured, ...nonFeatured].slice(0, 3);
    }

    const map = new Map(approved.map((c) => [c.id, c]));
    const list = currentIds.map((id) => map.get(id)).filter(Boolean) as GuestComment[];
    return list.length === 3 ? list : approved.slice(0, 3);
  }, [approved, currentIds, isManualMode]);

  if (approved.length === 0) {
    return (
      <div className="py-12 text-center text-xs font-mono text-ink-muted">
        {isEn ? 'No verified reviews yet.' : 'Chưa có đánh giá thực khách.'}
      </div>
    );
  }

  const transitionKey = activeReviews.map((r) => r.id).join('-');

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={transitionKey}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch"
        >
          {activeReviews.map((rev, idx) => (
            <motion.div
              key={rev.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              className="h-full flex"
            >
              <InteractiveTiltCard maxTilt={2.5} spotlight={true} className="w-full h-full flex">
                <div className="w-full h-full p-7 rounded-3xl border border-forest-200 dark:border-forest-700 bg-white dark:bg-forest-900 shadow-subtle hover:shadow-elevated transition-all flex flex-col justify-between relative group overflow-hidden">
                  {/* Decorative Quote Mark strictly at BOTTOM-RIGHT so it never overlaps top date */}
                  <Quote className="absolute right-4 bottom-4 w-16 h-16 text-forest-100 dark:text-forest-800 pointer-events-none -rotate-12 transition-transform group-hover:scale-110 opacity-30 select-none z-0" />

                  <div className="space-y-4 relative z-10">
                    {/* Top Meta: Stars on Left, Clean Date Badge on Right */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center text-amber-500 gap-0.5">
                        {[...Array(rev.rating || 5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                        ))}
                      </div>

                      <div className="flex items-center gap-1.5">
                        {rev.isFeatured && (
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200 border border-amber-300 dark:border-amber-700">
                            ★ {isEn ? 'Featured' : 'Nổi bật'}
                          </span>
                        )}
                        <span className="text-[11px] font-mono text-ink-muted flex items-center gap-1 bg-forest-50 dark:bg-forest-800 px-2 py-0.5 rounded-md border border-forest-100 dark:border-forest-700">
                          <Calendar className="w-3 h-3 text-accent-botanical" />
                          <span>{rev.visitDate || (isEn ? 'Recent visit' : 'Gần đây')}</span>
                        </span>
                      </div>
                    </div>

                    {/* Review Quote Body */}
                    <p className="font-serif italic text-sm sm:text-base text-ink-primary leading-relaxed my-2 line-clamp-4">
                      &ldquo;{rev.content}&rdquo;
                    </p>
                  </div>

                  {/* Bottom Author Card */}
                  <div className="pt-4 border-t border-forest-100 dark:border-forest-800/80 flex items-center justify-between relative z-10 mt-4">
                    <div>
                      <span className="font-serif font-bold text-base text-ink-primary block leading-snug">
                        {rev.authorName}
                      </span>
                      <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-0.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{isEn ? 'Verified Guest' : 'Thực khách xác thực'}</span>
                      </span>
                    </div>

                    <span className="text-[10px] font-mono text-ink-muted uppercase tracking-wider">
                      Cẩm Cù House
                    </span>
                  </div>
                </div>
              </InteractiveTiltCard>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
