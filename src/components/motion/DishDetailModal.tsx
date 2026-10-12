"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, PhoneCall, Leaf, Coffee } from "lucide-react";
import { MenuItem } from "@/data/menu";

interface DishDetailModalProps {
  dish: MenuItem | null;
  dishImage?: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function DishDetailModal({
  dish,
  dishImage,
  isOpen,
  onClose,
}: DishDetailModalProps) {
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgError(false);
  }, [dish?.id]);

  // Đóng khi bấm phím Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen || !dish) return null;

  const imgSrc = dishImage || dish.image;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Nền làm mờ Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/70 backdrop-blur-md"
        />

        {/* Modal Shared Element Container */}
        <motion.div
          layoutId={`dish-card-${dish.id}`}
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{
            type: "spring",
            damping: 28,
            stiffness: 300,
          }}
          className="relative w-full max-w-2xl bg-[#FDFBF7] dark:bg-[#16231A] rounded-3xl overflow-hidden shadow-2xl border border-stone-200/80 dark:border-stone-700/80 z-10 my-auto"
        >
          {/* Nút đóng góc trên */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 z-30 w-9 h-9 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-md flex items-center justify-center transition-all cursor-pointer active:scale-95"
            aria-label="Đóng"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Shared Element: Ảnh món phóng to thành Hero trang chi tiết */}
          <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden bg-[#16231A]">
            {!imgSrc || imgError ? (
              <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#1B281D] to-[#121A15] text-[#88B795] p-6">
                {dish.category === "coffee" ? (
                  <Coffee className="w-16 h-16 sm:w-20 sm:h-20 text-[#88B795]/80 stroke-[1.5]" />
                ) : (
                  <Leaf className="w-16 h-16 sm:w-20 sm:h-20 text-[#88B795]/80 stroke-[1.5]" />
                )}
                <span className="text-xs uppercase tracking-widest text-[#88B795]/70 mt-3 font-semibold">
                  Cẩm Cù House
                </span>
              </div>
            ) : (
              <motion.img
                layoutId={`dish-img-${dish.id}`}
                src={imgSrc}
                alt=""
                aria-hidden="true"
                onError={() => setImgError(true)}
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[#16231A] via-transparent to-transparent opacity-80" />

            {/* Tag đặc biệt nổi trên ảnh */}
            <div className="absolute bottom-4 left-4 sm:left-6 flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-[#3E5C46] text-white text-xs font-bold shadow-md flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                {dish.tag || dish.categoryName}
              </span>
              {dish.inStock === false && (
                <span className="px-3 py-1 rounded-full bg-rose-600 text-white text-xs font-bold shadow-md">
                  Tạm hết hôm nay
                </span>
              )}
            </div>
          </div>

          {/* Nội dung chi tiết món */}
          <div className="p-6 sm:p-8 flex flex-col gap-5 text-stone-800 dark:text-stone-100">
            {/* Tiêu đề và giá */}
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-stone-200/80 dark:border-stone-700/60 pb-4">
              <div>
                <span className="text-[11px] uppercase tracking-widest text-[#7D5E4A] dark:text-[#D1A684] font-bold block mb-1">
                  {dish.categoryName} • Bản Sắc Bản Địa
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#2D4233] dark:text-[#FDFBF7]">
                  {dish.name}
                </h3>
              </div>
              <div className="font-serif text-2xl sm:text-3xl font-bold text-[#3E5C46] dark:text-[#88B795] shrink-0">
                {dish.price.toLocaleString("vi-VN")}đ
              </div>
            </div>

            {/* Mô tả hương vị chi tiết */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                Hương vị & Trải nghiệm
              </span>
              <p className="text-sm sm:text-base text-stone-700 dark:text-stone-300 leading-relaxed">
                {dish.description ||
                  "Món đồ uống đặc sản được pha chế mộc mạc từ nông sản tươi lành cao nguyên Gia Nghĩa, giữ trọn hương vị thiên nhiên bên dòng suối mát."}
              </p>
            </div>

            {/* Điểm nhấn & gợi ý thưởng thức */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="p-3.5 rounded-2xl bg-stone-100/80 dark:bg-stone-800/40 border border-stone-200/60 dark:border-stone-700/40 flex items-start gap-2.5">
                <Coffee className="w-4 h-4 text-[#3E5C46] dark:text-[#88B795] shrink-0 mt-0.5" />
                <div className="text-xs">
                  <span className="font-bold block text-stone-800 dark:text-stone-200">
                    Nguyên liệu thuần khiết
                  </span>
                  <span className="text-stone-600 dark:text-stone-400">
                    Nông sản Đắk Nông mộc bản địa, chế biến tươi mới trong ngày.
                  </span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-stone-100/80 dark:bg-stone-800/40 border border-stone-200/60 dark:border-stone-700/40 flex items-start gap-2.5">
                <Leaf className="w-4 h-4 text-[#3E5C46] dark:text-[#88B795] shrink-0 mt-0.5" />
                <div className="text-xs">
                  <span className="font-bold block text-stone-800 dark:text-stone-200">
                    Không gian thưởng thức
                  </span>
                  <span className="text-stone-600 dark:text-stone-400">
                    Rất hợp ngắm suối đá hiên gỗ hoặc chill gió chiều.
                  </span>
                </div>
              </div>
            </div>

            {/* Nút hành động */}
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
              <a
                href="tel:0382851688"
                className="w-full sm:flex-1 py-3.5 px-6 rounded-full bg-[#2D4233] hover:bg-[#1E2B22] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all"
              >
                <PhoneCall className="w-4 h-4 animate-bounce" />
                <span>Gọi Phục Vụ / Gọi Món: 038 285 1688</span>
              </a>
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto py-3.5 px-6 rounded-full bg-stone-200/80 dark:bg-stone-800 text-stone-800 dark:text-stone-200 font-semibold text-sm hover:bg-stone-300 dark:hover:bg-stone-700 transition-colors"
              >
                Đóng lại
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
