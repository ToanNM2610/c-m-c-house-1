'use client';

import React, { useEffect, useCallback, useState } from 'react';
import { usePathname } from 'next/navigation';
import { X, ChevronLeft, ChevronRight, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '@/context/AppContext';
import { EDITORIAL_EASE } from '@/components/motion/EditorialMotion';

export default function GalleryLightboxModal() {
  const pathname = usePathname();
  const { activeLightboxPlate, closeLightbox, openLightbox, data, language } = useApp();
  const [imgError, setImgError] = useState(false);
  const isEn = language === 'en';

  const plates = data.spatialPlates;
  const currentIndex = activeLightboxPlate
    ? plates.findIndex((p) => p.id === activeLightboxPlate.id)
    : -1;

  // Reset img error on plate change
  useEffect(() => {
    setImgError(false);
  }, [activeLightboxPlate?.id]);

  const handleNext = useCallback(() => {
    if (currentIndex < 0 || plates.length === 0) return;
    const nextIdx = (currentIndex + 1) % plates.length;
    openLightbox(plates[nextIdx]);
  }, [currentIndex, plates, openLightbox]);

  const handlePrev = useCallback(() => {
    if (currentIndex < 0 || plates.length === 0) return;
    const prevIdx = (currentIndex - 1 + plates.length) % plates.length;
    openLightbox(plates[prevIdx]);
  }, [currentIndex, plates, openLightbox]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!activeLightboxPlate) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    },
    [activeLightboxPlate, closeLightbox, handleNext, handlePrev]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const [isAdminHost, setIsAdminHost] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isAdm =
        window.location.hostname.startsWith('admin.') ||
        window.location.hostname === 'admin.camcuhouse.online' ||
        window.location.host.startsWith('admin.');
      if (isAdm) {
        setIsAdminHost(true);
      }
    }
  }, []);

  // Strictly skip render on admin console or admin subdomain
  if (pathname?.startsWith('/admin') || isAdminHost) {
    return null;
  }

  const title = isEn && activeLightboxPlate?.titleEn ? activeLightboxPlate.titleEn : activeLightboxPlate?.titleVi;
  const chapterTitle = isEn && activeLightboxPlate?.chapterTitleEn ? activeLightboxPlate.chapterTitleEn : activeLightboxPlate?.chapterTitleVi;
  const location = isEn && activeLightboxPlate?.locationEn ? activeLightboxPlate.locationEn : activeLightboxPlate?.locationVi;
  const description = isEn && activeLightboxPlate?.descriptionEn ? activeLightboxPlate.descriptionEn : activeLightboxPlate?.descriptionVi;

  const hasPhoto = Boolean(
    activeLightboxPlate?.imageUrl &&
    activeLightboxPlate.imageUrl.trim() !== '' &&
    !imgError
  );

  return (
    <AnimatePresence>
      {activeLightboxPlate && (
        <motion.div
          key="lightbox-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: EDITORIAL_EASE }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4"
        >
          {/* Top Bar */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-white z-20">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs bg-white/20 px-2.5 py-1 rounded-md">
                {activeLightboxPlate.id}
              </span>
              <span className="text-xs text-white/70 font-mono hidden sm:inline">
                {chapterTitle}
              </span>
            </div>
            <button
              onClick={closeLightbox}
              className="p-2 text-white/70 hover:text-white rounded-full bg-white/10 hover:bg-white/20 transition-all cursor-pointer"
              aria-label={isEn ? 'Close' : 'Đóng'}
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={handlePrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 text-white/70 hover:text-white bg-black/40 hover:bg-black/70 rounded-full transition-all z-20 cursor-pointer"
            aria-label={isEn ? 'Previous' : 'Hình trước'}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 text-white/70 hover:text-white bg-black/40 hover:bg-black/70 rounded-full transition-all z-20 cursor-pointer"
            aria-label={isEn ? 'Next' : 'Hình kế tiếp'}
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Center Image Container with Card Zoom */}
          <motion.div
            key={`lightbox-card-${activeLightboxPlate.id}`}
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.35, ease: EDITORIAL_EASE }}
            className="relative max-w-4xl w-full max-h-[85vh] flex flex-col items-center justify-center p-2"
          >
            <div className="w-full max-h-[62vh] min-h-[280px] bg-gradient-to-br from-[#2E5A3C]/40 to-[#1A241E]/80 rounded-2xl overflow-hidden border border-white/15 flex items-center justify-center relative shadow-2xl text-center">
              {hasPhoto ? (
                <img
                  src={activeLightboxPlate.imageUrl}
                  alt={title}
                  onError={() => setImgError(true)}
                  className="max-h-[62vh] w-auto max-w-full object-contain mx-auto"
                />
              ) : (
                /* Aesthetic Botanical Graphic Placeholder with Frame ID */
                <div className="space-y-4 max-w-md p-6 sm:p-12">
                  <span className="font-mono text-4xl sm:text-5xl font-light text-forest-200/40 tracking-widest block">
                    {activeLightboxPlate.id}
                  </span>
                  <div className="w-12 h-0.5 bg-accent-botanical mx-auto opacity-70" />
                  <h3 className="font-serif text-2xl sm:text-3xl text-white font-bold leading-snug">
                    {title}
                  </h3>
                  <div className="flex items-center justify-center gap-1.5 text-xs text-forest-300 font-mono">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{location}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Narrative Caption */}
            <div className="mt-4 max-w-2xl text-center space-y-1.5">
              <h4 className="text-base text-white font-serif font-bold">
                {title}
              </h4>
              <p className="text-sm text-forest-100 font-serif italic leading-relaxed">
                &ldquo;{description}&rdquo;
              </p>
              <div className="text-[11px] font-mono text-white/50 pt-1">
                {isEn
                  ? `Frame ${currentIndex + 1} / ${plates.length} • ${location} • Cẩm Cù House Dak Nong`
                  : `Khung hình ${currentIndex + 1} / ${plates.length} • ${location} • Cẩm Cù House Đăk Nông`}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
