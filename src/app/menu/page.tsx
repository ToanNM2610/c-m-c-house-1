"use client";

import React, { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Coffee, Sparkles, ArrowUpRight } from "lucide-react";
import { useMenu } from "@/hooks/useMenu";
import { useLanguage } from "@/context/LanguageContext";
import HoverMediaReveal, { HoverMediaItem } from "@/components/ui/HoverMediaReveal";

const CoffeeSmokeShader = dynamic(() => import("@/components/3d/CoffeeSmokeShader"), {
  ssr: false,
});

// Bộ sưu tập ảnh đại diện chất lượng cao khi hover món
const CATEGORY_IMAGES: Record<string, string> = {
  "CÀ PHÊ": "/uploads/gallery/1788250253560-200373033.jpg",
  "TRÀ": "/uploads/gallery/1788250253562-580915883.jpg",
  "SINH TỐ": "/uploads/gallery/1788250253570-358232239.jpg",
  "NƯỚC ÉP": "/uploads/gallery/1788250253564-115851131.jpg",
  "SODA / SỮA CHUA": "/uploads/gallery/1788250253572-915114239.jpg",
  "NÔNG SẢN ĐẶC SẢN": "/uploads/gallery/1788250253554-875120458.jpg",
};

export default function MenuPage() {
  const { lang, formatPrice, currency, setCurrency } = useLanguage();
  const { menu, isLoading } = useMenu();

  const [activeCategory, setActiveCategory] = useState<string>("TẤT CẢ");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [hoveredMedia, setHoveredMedia] = useState<HoverMediaItem | null>(null);

  // Danh mục độc nhất
  const categories = useMemo(() => {
    const cats = Array.from(new Set(menu.map((m) => m.category)));
    return ["TẤT CẢ", ...cats];
  }, [menu]);

  // Lọc món theo category & search
  const filteredMenu = useMemo(() => {
    return menu.filter((item) => {
      const matchCat = activeCategory === "TẤT CẢ" || item.category === activeCategory;
      const matchSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.nameEn && item.nameEn.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCat && matchSearch;
    });
  }, [menu, activeCategory, searchQuery]);

  return (
    <div className="relative min-h-screen bg-[#0C0705] text-[#F4EFEA] font-sans overflow-x-hidden selection:bg-[#D4AF37] selection:text-[#0C0705] pt-28 pb-36">
      {/* 1. Làn khói WebGL Cà Phê Chuyển Động Chậm */}
      <CoffeeSmokeShader />

      {/* 2. Khung ảnh trôi theo con trỏ chuột khi hover món */}
      <HoverMediaReveal activeItem={hoveredMedia} />

      <div className="relative z-10 max-w-5xl mx-auto px-6 sm:px-12">
        {/* Header Trang Thực Đơn */}
        <header className="text-center py-12 md:py-16 space-y-4 border-b border-[#D4AF37]/20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#D4AF37]/30 bg-black/40 text-[10px] sm:text-xs font-mono uppercase tracking-[0.25em] text-[#D4AF37]">
            <Coffee size={13} />
            <span>ARTISANAL ROASTS & INFUSIONS</span>
          </div>

          <h1
            data-cursor-diff
            className="text-4xl sm:text-6xl md:text-7xl font-serif font-bold tracking-tight text-[#F4EFEA]"
          >
            THỰC ĐƠN <span className="italic font-light text-[#D4AF37]">MỘC</span>
          </h1>

          <p className="max-w-xl mx-auto text-xs sm:text-sm font-light text-[#F4EFEA]/75 leading-relaxed">
            {lang === "en"
              ? "Firewood-roasted highland beans, botanical Hoya blossom blends, and pure farm tonics."
              : "Hương cà phê mộc rang trên củi khô Tây Nguyên, trà thảo mộc hoa cẩm cù và thức uống từ quả chín vườn nhà."}
          </p>

          {/* Bộ chuyển đổi tiền tệ [VNĐ / USD] thanh lịch */}
          <div className="pt-4 flex items-center justify-center gap-3">
            <span className="text-[11px] font-mono text-[#D4AF37]/80 uppercase tracking-widest">Tiền tệ:</span>
            <div className="inline-flex items-center rounded-full border border-[#D4AF37]/30 bg-black/50 p-1">
              <button
                onClick={() => setCurrency("VND")}
                className={`px-3 py-1 rounded-full text-xs font-mono transition-colors ${
                  currency === "VND"
                    ? "bg-[#D4AF37] text-[#0C0705] font-bold"
                    : "text-[#F4EFEA]/70 hover:text-white"
                }`}
              >
                VNĐ
              </button>
              <button
                onClick={() => setCurrency("USD")}
                className={`px-3 py-1 rounded-full text-xs font-mono transition-colors ${
                  currency === "USD"
                    ? "bg-[#D4AF37] text-[#0C0705] font-bold"
                    : "text-[#F4EFEA]/70 hover:text-white"
                }`}
              >
                USD ($)
              </button>
            </div>
          </div>
        </header>

        {/* Thanh tìm kiếm & Tabs lọc danh mục */}
        <div className="py-8 space-y-6">
          {/* Ô tìm kiếm viền mảnh tối giản */}
          <div className="relative max-w-md mx-auto">
            <Search
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#D4AF37]"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={lang === "en" ? "Search drinks, coffee..." : "Tìm tên thức uống, cà phê..."}
              className="w-full pl-11 pr-4 py-3 rounded-full bg-black/40 border border-[#D4AF37]/30 text-[#F4EFEA] text-xs font-sans placeholder-[#F4EFEA]/35 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all"
            />
          </div>

          {/* Danh mục dạng Pills mượt mà */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-[11px] font-mono tracking-wider transition-all duration-300 ${
                  activeCategory === cat
                    ? "bg-[#D4AF37] text-[#0C0705] font-bold shadow-[0_0_20px_rgba(212,175,55,0.4)]"
                    : "bg-black/30 border border-[#D4AF37]/20 text-[#F4EFEA]/75 hover:border-[#D4AF37]/60 hover:text-[#F4EFEA]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Danh sách thức uống dạng List/Accordion tối giản */}
        <div className="divide-y divide-[#D4AF37]/15">
          {isLoading ? (
            <div className="py-20 text-center text-xs font-mono text-[#D4AF37] animate-pulse">
              Đang pha chế thực đơn...
            </div>
          ) : filteredMenu.length === 0 ? (
            <div className="py-20 text-center text-xs font-light text-[#F4EFEA]/50">
              Không tìm thấy thức uống phù hợp.
            </div>
          ) : (
            filteredMenu.map((item, idx) => {
              const displayName = lang === "en" && item.nameEn ? item.nameEn : item.name;
              const previewImg =
                CATEGORY_IMAGES[item.category] || "/uploads/gallery/1788250253560-200373033.jpg";

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: Math.min(idx * 0.03, 0.5) }}
                  onMouseEnter={() => setHoveredMedia({ image: previewImg, name: displayName })}
                  onMouseLeave={() => setHoveredMedia(null)}
                  className="group py-6 sm:py-8 flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 cursor-pointer transition-colors hover:bg-white/[0.02] px-2 sm:px-4 rounded-xl"
                >
                  <div className="space-y-1.5 flex-1 pr-4">
                    <div className="flex items-center gap-3">
                      <span className="text-[11px] font-mono text-[#D4AF37]/60">
                        {idx < 9 ? `0${idx + 1}` : idx + 1}
                      </span>
                      <h3 className="text-xl sm:text-2xl md:text-3xl font-serif font-bold text-[#F4EFEA] group-hover:text-[#FFE1B3] group-hover:translate-x-1.5 transition-all duration-300">
                        {displayName}
                      </h3>
                      {!item.inStock && (
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-mono bg-rose-950/60 border border-rose-600/40 text-rose-300">
                          Tạm hết
                        </span>
                      )}
                    </div>

                    <div className="text-[11px] font-mono uppercase tracking-widest text-[#D4AF37]/75">
                      {item.category}
                    </div>
                  </div>

                  {/* Giá tiền thanh mảnh nằm góc phải */}
                  <div className="flex items-center gap-3 shrink-0 self-end sm:self-baseline">
                    <span className="text-base sm:text-xl font-serif font-medium text-[#F4EFEA] group-hover:text-[#D4AF37] transition-colors">
                      {formatPrice(item.price)}
                    </span>
                    <ArrowUpRight
                      size={16}
                      className="text-[#D4AF37]/50 group-hover:text-[#D4AF37] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all opacity-0 group-hover:opacity-100"
                    />
                  </div>
                </motion.div>
              );
            })
          )}
        </div>

        {/* Footer ghi chú nguyên bản */}
        <div className="pt-16 pb-8 text-center text-xs font-mono text-[#D4AF37]/70 space-y-1">
          <p>Tất cả thức uống được pha chế thủ công bằng nguồn nước suối nguồn thanh khiết</p>
          <p className="text-[10px] text-[#F4EFEA]/40 font-serif italic">
            Cẩm Cù House • Mộc mạc và nguyên sơ
          </p>
        </div>
      </div>
    </div>
  );
}
