"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { X, ChevronLeft, ChevronRight, Sparkles, Image as ImageIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export interface LightboxPhoto {
  url: string;
  title: string;
  caption?: string;
  category?: string;
  subtitle?: string;
}

interface LightboxModalProps {
  isOpen: boolean;
  photos: LightboxPhoto[];
  initialIndex?: number;
  onClose: () => void;
}

export default function LightboxModal({
  isOpen,
  photos,
  initialIndex = 0,
  onClose,
}: LightboxModalProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex, isOpen]);

  // Lock body scroll when Lightbox is open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  const handlePrev = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : photos.length - 1));
  }, [photos.length]);

  const handleNext = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev < photos.length - 1 ? prev + 1 : 0));
  }, [photos.length]);

  // Keyboard navigation: Escape, ArrowLeft, ArrowRight
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowLeft") {
        handlePrev();
      } else if (e.key === "ArrowRight") {
        handleNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleNext, handlePrev, onClose]);

  if (!isOpen || photos.length === 0) return null;

  const currentPhoto = photos[currentIndex] || photos[0];

  // Touch Swipe Gesture
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrev();
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        onClick={onClose}
        className="fixed inset-0 z-[100] flex flex-col items-center justify-between bg-[#0E0B09]/96 backdrop-blur-xl p-3 sm:p-6 select-none"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Top Controls Bar */}
        <div
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-6xl flex items-center justify-between text-[#F4ECDD] py-2 z-10"
        >
          {/* Index Counter Pill: Số "03 / 30" mono (Section 8.3.4) */}
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1C1612] border border-[rgba(244,236,221,0.18)] font-mono text-xs font-semibold text-[var(--flower)]">
            <ImageIcon className="w-3.5 h-3.5 text-[var(--flower)]" />
            <span>
              {String(currentIndex + 1).padStart(2, "0")} / {String(photos.length).padStart(2, "0")}
            </span>
          </div>

          {/* Close Button (Touch target >= 44px) */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng cửa sổ xem ảnh"
            className="btn-press w-11 h-11 min-w-[44px] min-h-[44px] rounded-full bg-white/10 hover:bg-white/20 active:bg-white/30 text-white flex items-center justify-center transition-all border border-white/15 shadow-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Center Image Container with Prev/Next Navigation */}
        <div
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-5xl flex-1 flex items-center justify-center my-2 sm:my-4"
        >
          {/* Prev Button (Touch target >= 44px) */}
          {photos.length > 1 && (
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Ảnh trước đó"
              className="btn-press absolute left-1 sm:left-4 z-20 w-11 h-11 sm:w-12 sm:h-12 min-w-[44px] min-h-[44px] rounded-full bg-black/50 hover:bg-black/80 text-white border border-white/20 flex items-center justify-center transition-all shadow-xl"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}

          {/* Main Photo with smooth animation */}
          <div className="relative max-h-[70vh] sm:max-h-[75vh] w-full flex items-center justify-center overflow-hidden rounded-2xl">
            <motion.img
              key={currentPhoto.url}
              src={currentPhoto.url}
              alt={currentPhoto.title}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="max-h-[68vh] sm:max-h-[72vh] w-auto max-w-full object-contain rounded-xl shadow-2xl drop-shadow-[0_15px_35px_rgba(0,0,0,0.6)] transform-gpu"
            />
          </div>

          {/* Next Button (Touch target >= 44px) */}
          {photos.length > 1 && (
            <button
              type="button"
              onClick={handleNext}
              aria-label="Ảnh tiếp theo"
              className="btn-press absolute right-1 sm:right-4 z-20 w-11 h-11 sm:w-12 sm:h-12 min-w-[44px] min-h-[44px] rounded-full bg-black/50 hover:bg-black/80 text-white border border-white/20 flex items-center justify-center transition-all shadow-xl"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}
        </div>

        {/* Bottom Narrative / Caption Glass Card (Section 8.3.4) */}
        <div
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-3xl bg-[#1C1612]/95 border border-[rgba(244,236,221,0.18)] rounded-[20px] p-4 sm:p-5 text-center text-[#F4ECDD] shadow-2xl z-10 mb-2"
        >
          <div className="flex items-center justify-center gap-2 mb-1.5 flex-wrap">
            {currentPhoto.subtitle && (
              <span className="px-2.5 py-0.5 rounded-full bg-[#2A201A] text-[var(--stream)] font-mono text-[11px] font-semibold uppercase tracking-wider border border-[rgba(244,236,221,0.12)]">
                {currentPhoto.subtitle}
              </span>
            )}
            <h3 className="font-serif text-base sm:text-xl font-bold tracking-tight text-[#F4ECDD]">
              {currentPhoto.title}
            </h3>
          </div>

          {currentPhoto.caption && (
            <p className="font-mono text-xs sm:text-[13px] text-[#C7BBA8] leading-relaxed max-w-2xl mx-auto">
              {currentPhoto.caption}
            </p>
          )}

          <div className="mt-2 text-[11px] font-mono text-[rgba(244,236,221,0.4)] hidden sm:block">
            <span>Dùng phím mũi tên ← → hoặc vuốt màn hình để chuyển ảnh · Phím Esc để đóng</span>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
