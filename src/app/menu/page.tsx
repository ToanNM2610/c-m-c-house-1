"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Coffee, ArrowUpRight, ChevronDown } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import HoverMediaReveal, { HoverMediaItem } from "@/components/ui/HoverMediaReveal";

interface MenuItem {
  id: string;
  category: "Cà phê" | "Trà mộc" | "Sinh tố / Nước ép";
  nameVi: string;
  nameEn: string;
  priceVnd: number;
  priceUsd: number;
  descVi: string;
  descEn: string;
  image: string;
  tagVi?: string;
}

const MENU_ITEMS: MenuItem[] = [
  // Cà phê
  {
    id: "cf-1",
    category: "Cà phê",
    nameVi: "Cà Phê Rang Củi",
    nameEn: "Wood-Fired Roast Coffee",
    priceVnd: 35000,
    priceUsd: 1.4,
    descVi:
      "100% Robusta Đắk Nông tuyển chọn, rang mộc thủ công trên than củi gỗ cà phê già. Lớp crema dày sánh quyện hương khói ấm áp sâu lắng.",
    descEn:
      "Highland Robusta cherries roasted slowly over dry coffee wood embers. Velvety crema with rich smoky aromatics.",
    image: "/uploads/gallery/1788250253560-200373033.jpg",
    tagVi: "MÓN ĐẶC TRƯNG",
  },
  {
    id: "cf-2",
    category: "Cà phê",
    nameVi: "Cà Phê Muối",
    nameEn: "Salted Cream Coffee",
    priceVnd: 38000,
    priceUsd: 1.5,
    descVi:
      "Lớp kem muối béo nhẹ mằn mặn tự nhiên đánh bông tươi mỗi sớm, hòa cùng dòng cà phê rang mộc đậm đà nguyên bản.",
    descEn:
      "Silky salted cream foam layered smoothly above bold, artisanal wood-roasted black coffee.",
    image: "/uploads/gallery/1788250253554-875120458.jpg",
    tagVi: "YÊU THÍCH",
  },
  {
    id: "cf-3",
    category: "Cà phê",
    nameVi: "Cà Phê Sữa Mộc",
    nameEn: "Traditional Milk Coffee",
    priceVnd: 35000,
    priceUsd: 1.4,
    descVi:
      "Cà phê phin truyền thống hòa quyện cùng sữa đặc dịu ngọt, mang đậm phong vị mộc mạc và hoài niệm.",
    descEn:
      "Slow-dripped highland coffee combined with creamy condensed milk for a harmonious rustic balance.",
    image: "/uploads/gallery/1788250253560-200373033.jpg",
  },
  {
    id: "cf-4",
    category: "Cà phê",
    nameVi: "Cold Brew Suối Nguồn",
    nameEn: "Spring Water Cold Brew",
    priceVnd: 45000,
    priceUsd: 1.8,
    descVi:
      "Cà phê ủ lạnh 24 giờ cùng nước suối nguồn thanh sạch Đắk Nông, chiết xuất nốt hương cam rừng và mật mía thanh nhã.",
    descEn:
      "Slow cold-steeped for 24 hours with pristine mountain spring water, revealing wild citrus notes.",
    image: "/uploads/gallery/1788250253564-115851131.jpg",
    tagVi: "Ủ LẠNH 24H",
  },

  // Trà mộc
  {
    id: "tra-1",
    category: "Trà mộc",
    nameVi: "Trà Thảo Mộc Cẩm Cù",
    nameEn: "Botanical Hoya Blossom Tea",
    priceVnd: 42000,
    priceUsd: 1.7,
    descVi:
      "Sự kết hợp giữa hoa cẩm cù bản địa sấy lạnh, cỏ ngọt tự nhiên và hoa cúc rừng Tây Nguyên. Vị thanh khiết xoa dịu tâm trí.",
    descEn:
      "Freeze-dried indigenous Hoya blooms blended with wild chamomile and organic stevia leaves.",
    image: "/uploads/gallery/1788250253562-580915883.jpg",
    tagVi: "ĐẶC SẢN HIÊN NHÀ",
  },
  {
    id: "tra-2",
    category: "Trà mộc",
    nameVi: "Trà Gừng Mật Ong Rừng",
    nameEn: "Wild Honey & Highland Ginger",
    priceVnd: 35000,
    priceUsd: 1.4,
    descVi:
      "Gừng sẻ cay nồng đập dập hòa cùng mật ong rừng Gia Nghĩa nguyên chất, mang lại hơi ấm sưởi lòng ngày se lạnh.",
    descEn:
      "Crushed aromatic ginger root steeped with raw wild forest honey, soothing and invigorating.",
    image: "/uploads/gallery/1788250253557-29323827.jpg",
  },
  {
    id: "tra-3",
    category: "Trà mộc",
    nameVi: "Trà Hoa Lài Cổ Thụ",
    nameEn: "Ancient Jasmine Blossom Tea",
    priceVnd: 35000,
    priceUsd: 1.4,
    descVi:
      "Búp trà xanh cổ thụ ướp hoa lài tươi tự nhiên theo phương pháp thủ công, đượm hương đồng cỏ tinh khôi.",
    descEn:
      "Ancient wild green tea scented naturally with freshly plucked highland jasmine blossoms.",
    image: "/uploads/gallery/1788250253562-580915883.jpg",
  },

  // Sinh tố / Nước ép
  {
    id: "st-1",
    category: "Sinh tố / Nước ép",
    nameVi: "Sinh Tố Bơ Sáp Đắk Nông",
    nameEn: "Highland Butter Avocado Smoothie",
    priceVnd: 45000,
    priceUsd: 1.8,
    descVi:
      "Bơ sáp dẻo quánh đặc sản đất đỏ bazan Đắk Nông xay nhuyễn cùng sữa hạt, béo ngậy tự nhiên và giàu dưỡng chất.",
    descEn:
      "Silky rich avocado from fertile volcanic soil blended smoothly with organic plant milk.",
    image: "/uploads/gallery/1788250253570-358232239.jpg",
    tagVi: "ĐẶC SẢN ĐẮK NÔNG",
  },
  {
    id: "st-2",
    category: "Sinh tố / Nước ép",
    nameVi: "Nước Ép Chanh Dây Đồi",
    nameEn: "Highland Passion Fruit Juice",
    priceVnd: 35000,
    priceUsd: 1.4,
    descVi:
      "Chanh dây tươi hái từ triền đồi Gia Nghĩa, vị chua ngọt tươi mát đánh thức mọi giác quan sau chặng đường dài.",
    descEn:
      "Freshly harvested hillside passion fruit with vibrant sweet-tart notes to awaken the senses.",
    image: "/uploads/gallery/1788250253564-115851131.jpg",
  },
  {
    id: "st-3",
    category: "Sinh tố / Nước ép",
    nameVi: "Nước Ép Cóc Ổi Hồng",
    nameEn: "Pink Guava & Ambarella Cooler",
    priceVnd: 38000,
    priceUsd: 1.5,
    descVi:
      "Ổi hồng thơm ngát kết hợp cùng cóc non ép chậm nguyên chất, không thêm đường hóa học, thanh nhiệt sảng khoái.",
    descEn:
      "Slow cold-pressed pink guava and young ambarella, naturally sweet and packed with vitamins.",
    image: "/uploads/gallery/1788250253572-915114239.jpg",
  },
];

type CategoryFilter = "Tất cả" | "Cà phê" | "Trà mộc" | "Sinh tố / Nước ép";
const CATEGORIES: CategoryFilter[] = ["Tất cả", "Cà phê", "Trà mộc", "Sinh tố / Nước ép"];

export default function MenuPage() {
  const { lang, currency, setCurrency } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>("Tất cả");
  const [hoveredMedia, setHoveredMedia] = useState<HoverMediaItem | null>(null);
  const [expandedItemId, setExpandedItemId] = useState<string | null>(null);

  const filteredItems = useMemo(() => {
    if (activeCategory === "Tất cả") return MENU_ITEMS;
    return MENU_ITEMS.filter((item) => item.category === activeCategory);
  }, [activeCategory]);

  const formatPriceValue = (vnd: number, usd: number) => {
    if (currency === "USD") {
      return `$${usd.toFixed(2)}`;
    }
    return `${vnd.toLocaleString("vi-VN")}đ`;
  };

  return (
    <div className="relative min-h-screen bg-transparent text-[#F4EFEA] font-sans overflow-x-hidden selection:bg-[#D4AF37] selection:text-[#0A0908] pt-32 pb-36">
      
      {/* PC Micro-interaction: Ảnh nhỏ trượt nhẹ theo chuột */}
      <HoverMediaReveal activeItem={hoveredMedia} />

      <div className="relative z-10 max-w-4xl mx-auto px-6 sm:px-12">
        
        {/* ========================================================= */}
        {/* PHẦN 1: THANH PHÂN LOẠI & BỘ ĐỔI TIỀN TỆ                  */}
        {/* ========================================================= */}
        <header className="text-center py-10 md:py-16 space-y-5 border-b border-[#D4AF37]/20">
          <div className="inline-flex items-center gap-2 text-[10px] sm:text-xs font-mono uppercase tracking-[0.3em] text-[#D4AF37]">
            <Coffee size={13} />
            <span>ARTISANAL ROASTS • MỘC MẠC & THANH LỊCH</span>
          </div>

          <h1
            data-cursor-diff
            className="text-4xl sm:text-6xl md:text-7xl font-serif font-light tracking-tight text-[#F4EFEA]"
          >
            THỰC ĐƠN <span className="italic font-light text-[#D4AF37]">MỘC</span>
          </h1>

          <p className="max-w-md mx-auto text-xs sm:text-sm font-light text-[#F4EFEA]/75 leading-relaxed">
            {lang === "en"
              ? "Wood-roasted highland beans, pure spring water, and wild botanical infusions. Nothing artificial."
              : "Hạt cà phê rang củi Đắk Nông, nước suối nguồn thanh sạch và thảo mộc tự nhiên. Không hương liệu nhân tạo."}
          </p>

          {/* Cụm nút bấm chọn nhanh [Tất cả | Cà phê | Trà mộc | Sinh tố / Nước ép] */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-[11px] font-mono tracking-wider transition-all duration-300 border ${
                  activeCategory === cat
                    ? "bg-[#D4AF37] text-[#0A0908] border-[#D4AF37] font-semibold shadow-md"
                    : "bg-[#120805]/80 text-[#F4EFEA]/70 border-[#D4AF37]/25 hover:border-[#D4AF37]/60 hover:text-[#F4EFEA]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Nút chuyển đổi tiền tệ thanh mảnh [VNĐ | USD] */}
          <div className="pt-2 flex items-center justify-center gap-2 text-xs font-mono">
            <span className="text-[#F4EFEA]/40 uppercase tracking-widest text-[10px]">Đơn vị:</span>
            <button
              onClick={() => setCurrency("VND")}
              className={`px-2.5 py-0.5 transition-colors cursor-pointer ${
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
              className={`px-2.5 py-0.5 transition-colors cursor-pointer ${
                currency === "USD"
                  ? "text-[#D4AF37] font-semibold border-b border-[#D4AF37]"
                  : "text-[#F4EFEA]/40 hover:text-[#F4EFEA]"
              }`}
            >
              USD ($)
            </button>
          </div>
        </header>

        {/* ========================================================= */}
        {/* PHẦN 2: DANH SÁCH MÓN (Editorial List)                    */}
        {/* ========================================================= */}
        <div className="divide-y divide-white/5 py-8">
          {filteredItems.map((item, idx) => {
            const displayName = lang === "en" ? item.nameEn : item.nameVi;
            const displayDesc = lang === "en" ? item.descEn : item.descVi;
            const isExpanded = expandedItemId === item.id;

            return (
              <div key={item.id}>
                {/* Dòng món tối giản */}
                <div
                  onMouseEnter={() =>
                    setHoveredMedia({ image: item.image, name: displayName })
                  }
                  onMouseLeave={() => setHoveredMedia(null)}
                  onClick={() => setExpandedItemId(isExpanded ? null : item.id)}
                  className="group py-6 sm:py-7 flex items-baseline justify-between gap-6 cursor-pointer hover:bg-white/[0.015] px-2 sm:px-4 transition-colors duration-200"
                >
                  {/* Tên món to bên trái */}
                  <div className="flex items-baseline gap-3 sm:gap-4 min-w-0">
                    <span className="text-[10px] font-mono text-[#D4AF37]/50 w-5 shrink-0">
                      {idx < 9 ? `0${idx + 1}` : idx + 1}
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-xl sm:text-2xl md:text-3xl font-serif font-light text-[#F4EFEA] group-hover:text-[#D4AF37] group-hover:translate-x-1.5 transition-all duration-300">
                          {displayName}
                        </h3>
                        {item.tagVi && (
                          <span className="hidden sm:inline-block text-[9px] font-mono text-[#D4AF37] border border-[#D4AF37]/30 px-2 py-0.5 rounded-full shrink-0">
                            {item.tagVi}
                          </span>
                        )}
                      </div>
                      {/* Mô tả hiển thị tinh tế trên desktop */}
                      <p className="hidden md:block text-xs font-light text-[#F4EFEA]/60 pt-1.5 line-clamp-1 max-w-lg">
                        {displayDesc}
                      </p>
                    </div>
                  </div>

                  {/* Giá tiền nhỏ bên phải */}
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-sm sm:text-base font-mono text-[#D4AF37] group-hover:text-[#FFE1B3] transition-colors">
                      {formatPriceValue(item.priceVnd, item.priceUsd)}
                    </span>
                    <ArrowUpRight
                      size={14}
                      className="text-[#D4AF37] opacity-0 group-hover:opacity-100 transition-opacity hidden md:block"
                    />
                    <ChevronDown
                      size={14}
                      className={`text-[#D4AF37]/70 md:hidden transition-transform duration-200 ${
                        isExpanded ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                </div>

                {/* Mobile Tap-to-expand: Hiện mô tả và ảnh khi chạm */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeOut" }}
                      className="md:hidden overflow-hidden px-4 pb-6"
                    >
                      <div className="pt-2 pb-4 space-y-3 border-t border-white/5">
                        <p className="text-xs font-light text-[#F4EFEA]/80 leading-relaxed">
                          {displayDesc}
                        </p>
                        <div className="w-full aspect-[16/9] relative rounded-xl overflow-hidden border border-[#D4AF37]/20 bg-black/50">
                          <img
                            src={item.image}
                            alt={displayName}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Chú thích cuối trang */}
        <div className="pt-16 text-center text-[11px] font-mono text-[#F4EFEA]/45 space-y-1 border-t border-white/5">
          <p>Tất cả thức uống được pha chế thủ công tại hiên nhà</p>
          <p className="text-[10px] text-[#D4AF37]/65 font-serif italic">
            Cẩm Cù House • Thung lũng Gia Nghĩa, Đắk Nông
          </p>
        </div>

      </div>
    </div>
  );
}
