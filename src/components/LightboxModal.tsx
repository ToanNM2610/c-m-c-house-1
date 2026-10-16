"use client";

import React, { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { X, ChevronLeft, ChevronRight, Image as ImageIcon } from "lucide-react";
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
  // Lọc chỉ giữ các ảnh có đường dẫn hợp lệ, không để ảnh hỏng chiếm 1 vị trí (Mục B6)
  const validPhotos = useMemo(() => {
    return photos.filter((p) => Boolean(p && p.url && p.url.trim() !== ""));
  }, [photos]);

  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [photoError, setPhotoError] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  useEffect(() => {
    if (initialIndex >= 0 && initialIndex < validPhotos.length) {
      setCurrentIndex(initialIndex);
    } else {
      setCurrentIndex(0);
    }
    setPhotoError(false);
  }, [initialIndex, isOpen, validPhotos.length]);

  useEffect(() => {
    setPhotoError(false);
  }, [currentIndex]);

  // Khóa cuộn trang và đánh dấu lightbox-open để tắt custom cursor (Mục A3 & B6)
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("lightbox-open");
      document.body.setAttribute("data-lightbox-active", "true");
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";

      return () => {
        document.body.classList.remove("lightbox-open");
        document.body.removeAttribute("data-lightbox-active");
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  const handlePrev = useCallback(
    (e?: React.MouseEvent) => {
      e?.stopPropagation();
      setCurrentIndex((prev) =>
        prev > 0 ? prev - 1 : validPhotos.length - 1
      );
    },
    [validPhotos.length]
  );

  const handleNext = useCallback(
    (e?: React.MouseEvent) => {
      e?.stopPropagation();
      setCurrentIndex((prev) =>
        prev < validPhotos.length - 1 ? prev + 1 : 0
      );
    },
    [validPhotos.length]
  );

  // Điều hướng bằng phím Escape, ArrowLeft, ArrowRight
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

  if (!isOpen || validPhotos.length === 0) return null;

  const currentPhoto = validPhotos[currentIndex] || validPhotos[0];

  // Cử chỉ vuốt tay trên mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    if (distance > 50) {
      handleNext();
    } else if (distance < -50) {
      handlePrev();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <AnimatePresence>
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label="Cửa sổ xem ảnh lớn"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        onClick={onClose}
        className="fixed inset-0 z-[100] flex flex-col items-center justify-between bg-[#0B0F0D]/92 backdrop-blur-xl p-3 sm:p-6 select-none"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Thanh điều khiển trên cùng */}
        <div
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-6xl flex items-center justify-between text-[#F4EEE2] py-2 z-10"
        >
          {/* Bộ đếm đúng tổng số ảnh đang xem (Mục B6) */}
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/60 border border-[#F4EEE2]/20 font-mono text-[13px] font-semibold text-[#F4EEE2]">
            <ImageIcon className="w-4 h-4 text-[var(--clay)]" />
            <span>
              {String(currentIndex + 1).padStart(2, "0")} /{" "}
              {String(validPhotos.length).padStart(2, "0")}
            </span>
          </div>

          {/* Nút đóng (Touch target >= 44px) */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng cửa sổ xem ảnh"
            className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-full bg-white/10 hover:bg-white/20 active:bg-white/30 text-white flex items-center justify-center transition-all border border-white/20 shadow-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Khung ảnh chính với nút Trước / Sau */}
        <div
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-5xl flex-1 flex items-center justify-center my-2 sm:my-4"
        >
          {validPhotos.length > 1 && (
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Ảnh trước đó"
              className="absolute left-1 sm:left-4 z-20 w-11 h-11 sm:w-12 sm:h-12 min-w-[44px] min-h-[44px] rounded-full bg-black/60 hover:bg-black/85 text-white border border-white/20 flex items-center justify-center transition-all shadow-xl cursor-pointer"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}

          <div className="relative max-h-[70vh] sm:max-h-[75vh] w-full flex items-center justify-center overflow-hidden rounded-2xl">
            {photoError ? (
              <div
                className="w-[320px] sm:w-[480px] h-[260px] sm:h-[340px] bg-[var(--surface-2)] rounded-2xl flex flex-col items-center justify-center text-[var(--ink-muted)] p-6 select-none"
                aria-hidden="true"
              >
                <ImageIcon className="w-12 h-12 opacity-40 mb-2 text-[var(--sage)]" />
                <span className="font-mono text-[12px] opacity-60 uppercase tracking-wider">
                  Cẩm Cù House
                </span>
              </div>
            ) : (
              <motion.img
                key={currentPhoto.url}
                src={currentPhoto.url}
                alt={currentPhoto.title}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                onError={() => setPhotoError(true)}
                className="max-h-[68vh] sm:max-h-[72vh] w-auto max-w-full object-contain rounded-xl shadow-2xl drop-shadow-[0_20px_40px_rgba(0,0,0,0.8)]"
              />
            )}
          </div>

          {validPhotos.length > 1 && (
            <button
              type="button"
              onClick={handleNext}
              aria-label="Ảnh tiếp theo"
              className="absolute right-1 sm:right-4 z-20 w-11 h-11 sm:w-12 sm:h-12 min-w-[44px] min-h-[44px] rounded-full bg-black/60 hover:bg-black/85 text-white border border-white/20 flex items-center justify-center transition-all shadow-xl cursor-pointer"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}
        </div>

        {/* Chú thích chữ kem 16px+ trên gradient đen (Mục B6) */}
        <div
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-3xl rounded-[20px] p-5 sm:p-6 text-center text-[#F4EEE2] shadow-2xl z-10 mb-2 border border-[#F4EEE2]/15 bg-gradient-to-t from-black/95 via-black/85 to-black/60 backdrop-blur-md"
        >
          <div className="flex items-center justify-center gap-2 mb-2 flex-wrap">
            {currentPhoto.subtitle && (
              <span className="px-3 py-1 rounded-full bg-[#1F2C23] text-[#A9C8AB] font-mono text-[12px] font-semibold uppercase tracking-wider border border-[#A9C8AB]/20">
                {currentPhoto.subtitle}
              </span>
            )}
            <h3 className="font-serif text-[18px] sm:text-[22px] font-bold tracking-tight text-[#F4EEE2]">
              {currentPhoto.title}
            </h3>
          </div>

          {currentPhoto.caption && (
            <p className="font-sans text-[16px] text-[rgba(244,238,226,0.88)] leading-relaxed max-w-2xl mx-auto">
              {currentPhoto.caption}
            </p>
          )}

          <div className="mt-3 text-[12px] font-mono text-[rgba(244,238,226,0.5)] hidden sm:block">
            <span>Dùng phím mũi tên ← → hoặc vuốt màn hình để chuyển ảnh · Phím Esc để đóng</span>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
