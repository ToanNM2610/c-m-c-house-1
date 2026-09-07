"use client";

import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, Coffee, ArrowUpRight } from "lucide-react";
import { useMenu } from "@/hooks/useMenu";
import { useLanguage } from "@/context/LanguageContext";
import HoverMediaReveal, { HoverMediaItem } from "@/components/ui/HoverMediaReveal";

// Bộ ảnh chụp chất lượng cao cho từng danh mục thức uống
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
    <div className="relative min-h-screen bg-[#0A0908] text-[#F4EFEA] font-sans overflow-x-hidden selection:bg-[#D4AF37] selection:text-[#0A0908] pt-32 pb-36">
      
      {/* Micro-interaction: Khung ảnh trôi theo con trỏ chuột khi rê chuột vào tên món */}
      <HoverMediaReveal activeItem={hoveredMedia} />

      <div className="relative z-10 max-w-4xl mx-auto px-6 sm:px-12">
        {/* Header Tối Giản & Tĩnh Lặng */}
        <header className="text-center py-12 md:py-20 space-y-4 border-b border-white/10">
          <div className="inline-flex items-center gap-2 text-[10px] sm:text-xs font-mono uppercase tracking-[0.3em] text-[#D4AF37]">
            <Coffee size={13} />
            <span>ARTISANAL ROASTS • TĨNH LẶNG & THÔ MỘC</span>
          </div>

          <h1
            data-cursor-diff
            className="text-4xl sm:text-6xl md:text-7xl font-serif font-light tracking-tight text-[#F4EFEA]"
          >
            THỰC ĐƠN <span className="italic font-light text-[#D4AF37]">MỘC</span>
          </h1>

          <p className="max-w-md mx-auto text-xs sm:text-sm font-light text-[#F4EFEA]/70 leading-relaxed">
            {lang === "en"
              ? "Firewood-roasted highland beans, pure spring water, and wild botanical infusions. Nothing artificial."
              : "Hạt cà phê rang củi Đắk Nông, nước suối nguồn thanh sạch và thảo mộc tự nhiên. Không hương liệu nhân tạo."}
          </p>

          {/* Bộ chuyển đổi tiền tệ [VNĐ / USD] tối giản */}
          <div className="pt-4 flex items-center justify-center gap-2 text-xs font-mono">
            <span className="text-[#F4EFEA]/40 uppercase tracking-widest text-[10px]">Đơn vị:</span>
            <button
              onClick={() => setCurrency("VND")}
              className={`px-3 py-1 transition-colors ${
                currency === "VND"
                  ? "text-[#D4AF37] font-semibold border-b border-[#D4AF37]"
                  : "text-[#F4EFEA]/40 hover:text-[#F4EFEA]"
              }`}
            >
              VNĐ
            </button>
            <span className="text-[#F4EFEA]/20">/</span>
            <button
              onClick={() => setCurrency("USD")}
              className={`px-3 py-1 transition-colors ${
                currency === "USD"
                  ? "text-[#D4AF37] font-semibold border-b border-[#D4AF37]"
                  : "text-[#F4EFEA]/40 hover:text-[#F4EFEA]"
              }`}
            >
              USD ($)
            </button>
          </div>
        </header>

        {/* Thanh tìm kiếm & Tabs lọc tối giản */}
        <div className="py-10 space-y-6">
          {/* Ô tìm kiếm dạng gạch dưới thanh mảnh */}
          <div className="relative max-w-sm mx-auto">
            <Search
              size={15}
              className="absolute left-0 top-1/2 -translate-y-1/2 text-[#D4AF37]"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={lang === "en" ? "Search drinks, coffee..." : "Tìm tên thức uống..."}
              className="w-full pl-7 pr-4 py-2 bg-transparent border-b border-white/15 text-[#F4EFEA] text-xs font-sans placeholder-[#F4EFEA]/30 focus:outline-none focus:border-[#D4AF37] transition-colors"
            />
          </div>

          {/* Danh mục dạng Text Tabs phẳng */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 pt-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`text-[11px] font-mono tracking-widest uppercase transition-colors duration-300 pb-1 ${
                  activeCategory === cat
                    ? "text-[#D4AF37] border-b-2 border-[#D4AF37] font-semibold"
                    : "text-[#F4EFEA]/50 hover:text-[#F4EFEA]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Danh sách thức uống Text-Focused Tinh Tế Tuyệt Đối */}
        <div className="divide-y divide-white/5">
          {isLoading ? (
            <div className="py-24 text-center text-xs font-mono text-[#D4AF37] animate-pulse">
              Đang chuẩn bị thức uống mộc...
            </div>
          ) : filteredMenu.length === 0 ? (
            <div className="py-24 text-center text-xs font-light text-[#F4EFEA]/40">
              Không có thức uống phù hợp.
            </div>
          ) : (
            filteredMenu.map((item, idx) => {
              const displayName = lang === "en" && item.nameEn ? item.nameEn : item.name;
              const previewImg =
                CATEGORY_IMAGES[item.category] || "/uploads/gallery/1788250253560-200373033.jpg";

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: Math.min(idx * 0.02, 0.4) }}
                  onMouseEnter={() => setHoveredMedia({ image: previewImg, name: displayName })}
                  onMouseLeave={() => setHoveredMedia(null)}
                  className="group py-6 sm:py-7 flex items-baseline justify-between gap-6 cursor-pointer hover:bg-white/[0.015] px-2 sm:px-4 transition-colors duration-300"
                >
                  <div className="flex items-baseline gap-4">
                    <span className="text-[10px] font-mono text-[#F4EFEA]/30 w-6">
                      {idx < 9 ? `0${idx + 1}` : idx + 1}
                    </span>
                    <h3 className="text-xl sm:text-2xl md:text-3xl font-serif font-light text-[#F4EFEA] group-hover:text-[#D4AF37] group-hover:translate-x-2 transition-all duration-300">
                      {displayName}
                    </h3>
                    {!item.inStock && (
                      <span className="text-[9px] font-mono text-rose-400/70 border border-rose-800/40 px-2 py-0.5 rounded-full">
                        Hết
                      </span>
                    )}
                  </div>

                  {/* Giá tiền thanh mảnh nằm góc phải */}
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-sm sm:text-base font-mono text-[#D4AF37] group-hover:text-[#FFE1B3] transition-colors">
                      {formatPrice(item.price)}
                    </span>
                    <ArrowUpRight
                      size={14}
                      className="text-[#D4AF37] opacity-0 group-hover:opacity-100 transition-opacity"
                    />
                  </div>
                </motion.div>
              );
            })
          )}
        </div>

        {/* Footer ghi chú mộc mạc */}
        <div className="pt-20 pb-8 text-center text-[11px] font-mono text-[#F4EFEA]/40 space-y-1">
          <p>Tất cả thức uống được pha chế thủ công tại hiên nhà</p>
          <p className="text-[10px] text-[#D4AF37]/60 font-serif italic">
            Cẩm Cù House • Gia Nghĩa, Đắk Nông
          </p>
        </div>
      </div>
    </div>
  );
}
