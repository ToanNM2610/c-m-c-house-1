"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Coffee, CheckCircle2, Leaf, HeartHandshake } from "lucide-react";
import { REAL_MENU_DATA } from "@/data/menu";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.06 },
  }),
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05 } },
};

type MenuCategoryTab =
  | "TẤT CẢ"
  | "CÀ PHÊ"
  | "TRÀ"
  | "SINH TỐ"
  | "NƯỚC ÉP"
  | "SODA & SỮA CHUA"
  | "KHÁC"
  | "MÓN ĂN";

const CATEGORY_TABS: MenuCategoryTab[] = [
  "TẤT CẢ",
  "CÀ PHÊ",
  "TRÀ",
  "SINH TỐ",
  "NƯỚC ÉP",
  "SODA & SỮA CHUA",
  "KHÁC",
  "MÓN ĂN",
];

export default function MenuPage() {
  const [activeCategory, setActiveCategory] = useState<MenuCategoryTab>("TẤT CẢ");

  const filteredItems = REAL_MENU_DATA.filter((item) => {
    if (activeCategory === "TẤT CẢ") return true;
    return item.category.toUpperCase() === activeCategory;
  });

  return (
    <div className="w-full text-[#FDFBF7]">
      {/* ============================================================ */}
      {/* 1. BANNER                                                    */}
      {/* ============================================================ */}
      <section className="relative py-28 sm:py-36 px-6 sm:px-12 flex items-center justify-center text-center overflow-hidden border-b border-[#222520]">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="relative z-10 max-w-3xl mx-auto space-y-4"
        >
          <motion.span variants={fadeUp} custom={0} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1A1D17] border border-[#222520] text-xs font-mono text-[#C88A4B]">
            <Coffee size={14} />
            <span>NGUYÊN LIỆU MỘC &amp; TƯƠI LÀNH</span>
          </motion.span>

          <motion.h1 variants={fadeUp} custom={1} className="font-serif text-4xl sm:text-6xl font-bold text-[#FDFBF7] tracking-tight">
            Thực Đơn Quán
          </motion.h1>

          <motion.p variants={fadeUp} custom={2} className="text-base sm:text-lg font-light text-[#FDFBF7]/80 leading-relaxed">
            Hơn 40 món đồ uống và món ăn ngon miệng được pha chế tỉ mỉ, mộc mạc và
            ấm áp bên bờ suối Gia Nghĩa.
          </motion.p>
        </motion.div>
      </section>

      {/* ============================================================ */}
      {/* 2. STICKY CATEGORY TABS (NO BLUR)                            */}
      {/* ============================================================ */}
      <section className="py-6 px-6 sm:px-12 max-w-7xl mx-auto flex justify-center sticky top-20 z-30 bg-[#0C0D0B]/95 border-b border-[#222520]/50">
        <div className="flex flex-wrap items-center justify-center gap-2 p-1.5 rounded-full bg-[#1A1D17] border border-[#222520] max-w-full overflow-x-auto">
          {CATEGORY_TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveCategory(tab)}
              className={`px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer whitespace-nowrap ${
                activeCategory === tab
                  ? "bg-[#C88A4B] text-[#0C0D0B] font-bold shadow-xs"
                  : "text-[#FDFBF7]/70 hover:text-[#FDFBF7]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </section>

      {/* ============================================================ */}
      {/* 3. MENU GRID - FULL REAL DATA                                */}
      {/* ============================================================ */}
      <section className="pb-24 pt-8 px-6 sm:px-12 max-w-7xl mx-auto relative z-10">
        <div className="mb-6 text-xs text-[#FDFBF7]/60 font-mono">
          Hiển thị {filteredItems.length} món trong danh mục{" "}
          <strong className="text-[#C88A4B]">{activeCategory}</strong>
        </div>

        <motion.div
          key={activeCategory}
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {filteredItems.map((item, idx) => (
            <motion.div
              key={item.id}
              variants={fadeUp}
              custom={idx}
              className="card-dark overflow-hidden flex flex-col p-4 group hover:border-[#C88A4B] transition-all duration-300"
            >
              {/* Square image */}
              <div className="relative aspect-square w-full rounded-2xl overflow-hidden mb-3.5 bg-[#1A1D17]">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                />
                {item.tag && (
                  <span
                    className={`absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wide uppercase shadow-sm ${
                      item.tag === "Signature"
                        ? "bg-[#C88A4B] text-[#0C0D0B] font-bold"
                        : "bg-[#2D4A3E] text-[#FDFBF7]"
                    }`}
                  >
                    {item.tag}
                  </span>
                )}
              </div>

              {/* Item info */}
              <div className="space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-serif text-lg font-bold text-[#FDFBF7] group-hover:text-[#C88A4B] transition-colors leading-snug">
                      {item.name}
                    </h3>
                    <span className="font-mono text-sm font-bold text-[#C88A4B] shrink-0 pt-0.5">
                      {item.priceFormatted}
                    </span>
                  </div>
                  {item.desc && (
                    <p className="text-xs font-light text-[#FDFBF7]/70 leading-relaxed mt-1.5 line-clamp-2">
                      {item.desc}
                    </p>
                  )}
                </div>
                <div className="pt-2.5 border-t border-[#222520] flex items-center justify-between text-[11px] text-[#C88A4B] font-medium">
                  <span className="inline-flex items-center gap-1">
                    <CheckCircle2 size={12} className="text-[#C88A4B]" />
                    <span>{item.category}</span>
                  </span>
                  <span className="text-[10px] text-[#FDFBF7]/50 font-mono">
                    Phục vụ tại bàn
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ============================================================ */}
      {/* 4. SPECIAL NOTES FOOTER                                      */}
      {/* ============================================================ */}
      <section className="pb-20 px-6 sm:px-12 max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="card-dark rounded-3xl p-8 sm:p-10 border border-[#222520] flex flex-col md:flex-row items-center gap-8 justify-between"
        >
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#C88A4B] font-semibold">
              <Leaf size={14} />
              <span>GHI CHÚ THỰC ĐƠN • SPECIAL NOTES</span>
            </div>

            <h3 className="font-serif text-2xl font-bold text-[#FDFBF7]">
              Tùy Chỉnh Theo Khẩu Vị Của Bạn
            </h3>

            <ul className="space-y-2 text-xs sm:text-sm font-light text-[#FDFBF7]/75 leading-relaxed list-disc list-inside">
              <li>
                <strong>Tùy chọn độ ngọt &amp; lượng đá:</strong> Quý khách hoàn
                toàn có thể dặn barista giảm ngọt, không đá hoặc dùng nước ấm
                theo mong muốn.
              </li>
              <li>
                <strong>Sữa hạt thay thế theo yêu cầu:</strong> Sẵn sàng thay đổi
                sang sữa thực vật hoặc sữa tươi thanh trùng không đường.
              </li>
              <li>
                <strong>Nguyên liệu mộc:</strong> Cà phê 100% Robusta Đắk Nông
                rang củi không phụ gia; trà và nước ép từ hoa quả tươi trong ngày.
              </li>
            </ul>
          </div>

          <div className="shrink-0 p-6 rounded-2xl bg-[#1A1D17] border border-[#222520] text-center space-y-2 max-w-xs">
            <HeartHandshake size={28} className="text-[#C88A4B] mx-auto" />
            <p className="font-serif font-bold text-sm text-[#FDFBF7]">
              Phục vụ tận tâm
            </p>
            <p className="text-[11px] text-[#FDFBF7]/60">
              Hãy dặn nhân viên khi gọi món để chúng tôi chuẩn bị đúng khẩu vị của bạn nhé!
            </p>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
