"use client";

import { useState, useRef, useEffect } from "react";
import { useTransitionContext, TransitionMode } from "@/context/TransitionContext";
import { Layers, Check, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const TRANSITION_OPTIONS: { id: TransitionMode; title: string; desc: string; badge: string }[] = [
  {
    id: "stagger-panels",
    title: "Stagger 3 Panels",
    desc: "3 lớp màu nối tiếp (#3E2723 → #4A5D23 → #CC7755) quét qua màn hình",
    badge: "Điểm nhấn thương hiệu (Khuyên dùng)",
  },
  {
    id: "curtain-wipe",
    title: "Màn che Nâu & Logo",
    desc: "Tấm nâu #3E2723 trượt lên hiện logo Cẩm Cù House rồi mở trang mới",
    badge: "Mượt, mộc mạc",
  },
  {
    id: "slide-directional",
    title: "Slide Ngang Next / Prev",
    desc: "Tới trang sau trượt sang trái, quay lại trượt ngược chiều sang phải",
    badge: "Chuyển động có chiều",
  },
  {
    id: "depth-push",
    title: "Trang cũ lùi sâu 3D",
    desc: "Trang cũ lùi sâu scale 0.9 + mờ nhẹ, trang mới trượt đè lên",
    badge: "Hiệu ứng điện ảnh",
  },
  {
    id: "cross-fade",
    title: "Cross-Fade Nền Kem",
    desc: "Mờ dần trang cũ, trang mới hiện lên êm dịu trên nền #FDFBF7",
    badge: "Nhẹ nhàng, thư thái",
  },
];

export default function TransitionModeSelector() {
  const { mode, setMode } = useTransitionContext();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const activeOption = TRANSITION_OPTIONS.find((opt) => opt.id === mode) || TRANSITION_OPTIONS[0];

  return (
    <div ref={containerRef} className="fixed bottom-5 right-5 z-[9990] flex flex-col items-end">
      {/* Menu xổ lên chọn phong cách chuyển trang */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="mb-3 w-80 sm:w-96 rounded-2xl bg-white/95 dark:bg-[#16231A]/95 backdrop-blur-xl border border-stone-200 dark:border-stone-700/80 shadow-2xl p-3 flex flex-col gap-1.5 text-stone-800 dark:text-stone-200"
          >
            <div className="flex items-center justify-between px-3 py-2 border-b border-stone-200/80 dark:border-stone-800 text-xs font-bold uppercase tracking-wider text-[#3E5C46] dark:text-[#88B795]">
              <span className="flex items-center gap-1.5">
                <Layers className="w-4 h-4" />
                Kiểu Chuyển Trang (Transitions)
              </span>
              <span className="text-[10px] text-stone-400 font-normal">Cẩm Cù House</span>
            </div>

            <div className="flex flex-col gap-1 max-h-72 overflow-y-auto no-scrollbar py-1">
              {TRANSITION_OPTIONS.map((opt) => {
                const isSelected = mode === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      setMode(opt.id);
                      setIsOpen(false);
                    }}
                    className={`text-left p-2.5 rounded-xl transition-all flex items-start justify-between gap-2.5 cursor-pointer ${
                      isSelected
                        ? "bg-[#3E5C46]/10 dark:bg-[#88B795]/15 border border-[#3E5C46]/30 dark:border-[#88B795]/30 font-semibold"
                        : "hover:bg-stone-100 dark:hover:bg-white/5"
                    }`}
                  >
                    <div className="flex flex-col gap-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-stone-900 dark:text-white">
                          {opt.title}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-stone-200/80 dark:bg-stone-800 text-stone-600 dark:text-stone-300">
                          {opt.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-500 dark:text-stone-400 line-clamp-1">
                        {opt.desc}
                      </p>
                    </div>
                    {isSelected && (
                      <Check className="w-4 h-4 text-[#3E5C46] dark:text-[#88B795] shrink-0 mt-0.5" />
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Nút Toggle Floating góc phải dưới */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="group flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-white/90 dark:bg-[#1E2B22]/90 backdrop-blur-md border border-stone-200/80 dark:border-stone-700/80 shadow-lg hover:shadow-xl text-stone-800 dark:text-stone-200 text-xs font-semibold hover:border-[#3E5C46] dark:hover:border-[#88B795] transition-all cursor-pointer active:scale-95"
        title="Tùy chọn phong cách chuyển trang Cẩm Cù House"
      >
        <div className="w-5 h-5 rounded-full bg-[#3E5C46] dark:bg-[#88B795] text-white dark:text-[#121A15] flex items-center justify-center">
          <Layers className="w-3 h-3" />
        </div>
        <span className="hidden sm:inline font-serif font-bold text-[#3E5C46] dark:text-[#88B795]">
          {activeOption.title}
        </span>
        <ChevronUp className={`w-3.5 h-3.5 text-stone-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>
    </div>
  );
}
