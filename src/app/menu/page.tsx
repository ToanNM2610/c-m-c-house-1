"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Coffee, Sparkles, CheckCircle2, Leaf, HeartHandshake } from "lucide-react";
import { REAL_MENU_DATA, MenuItem } from "@/data/menu";

type MenuCategoryTab =
  | "Tất Cả"
  | "Cà Phê"
  | "Trà"
  | "Sinh Tố"
  | "Nước Ép"
  | "Soda & Sữa Chua"
  | "Khác"
  | "Món Ăn";

const CATEGORY_TABS: MenuCategoryTab[] = [
  "Tất Cả",
  "Cà Phê",
  "Trà",
  "Sinh Tố",
  "Nước Ép",
  "Soda & Sữa Chua",
  "Khác",
  "Món Ăn",
];

export default function MenuPage() {
  const [activeCategory, setActiveCategory] = useState<MenuCategoryTab>("Tất Cả");

  const filteredItems = REAL_MENU_DATA.filter((item) => {
    if (activeCategory === "Tất Cả") return true;
    return item.category === activeCategory;
  });

  return (
    <div className="w-full bg-[#FDFBF7] text-[#222222]">
      {/* ========================================================= */}
      {/* 1. BANNER: THỰC ĐƠN QUÁN                                  */}
      {/* ========================================================= */}
      <section className="relative py-24 sm:py-32 px-6 sm:px-12 flex items-center justify-center text-center overflow-hidden border-b border-[#EAE6DF]">
        <div className="absolute inset-0 z-0">
          <Image
            src="/uploads/gallery/1788250253560-200373033.jpg"
            alt="Thực đơn quán Cẩm Cù House"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#FDFBF7]/92 via-[#FDFBF7]/85 to-[#FDFBF7]" />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto space-y-4">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#2D4A3E]/10 border border-[#2D4A3E]/20 text-xs font-semibold text-[#2D4A3E]">
            <Coffee size={14} className="text-[#C88A4B]" />
            <span>NGUYÊN LIỆU MỘC &amp; TỰ NHIÊN</span>
          </span>

          <h1 className="font-serif text-4xl sm:text-6xl font-bold text-[#2D4A3E] tracking-tight">
            Thực Đơn Quán
          </h1>

          <p className="text-base sm:text-lg font-light text-[#222222]/80 leading-relaxed">
            Hơn 40 món đồ uống và món ăn ngon miệng được pha chế tỉ mỉ, mộc mạc và
            ấm áp bên bờ suối Gia Nghĩa.
          </p>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 2. CATEGORY TABS                                          */}
      {/* ========================================================= */}
      <section className="py-6 px-6 sm:px-12 max-w-7xl mx-auto flex justify-center sticky top-20 z-30 bg-[#FDFBF7]/90 backdrop-blur-md">
        <div className="flex flex-wrap items-center justify-center gap-2 p-1.5 rounded-full bg-[#EAE6DF]/70 border border-[#EAE6DF] max-w-full overflow-x-auto">
          {CATEGORY_TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveCategory(tab)}
              className={`px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer whitespace-nowrap ${
                activeCategory === tab
                  ? "bg-[#2D4A3E] text-white shadow-xs font-semibold"
                  : "text-[#222222]/70 hover:text-[#2D4A3E]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </section>

      {/* ========================================================= */}
      {/* 3. MENU GRID CARD (HIỂN THỊ ĐẦY ĐỦ SRC/DATA/MENU.TS)      */}
      {/* ========================================================= */}
      <section className="pb-24 px-6 sm:px-12 max-w-7xl mx-auto">
        <div className="mb-6 text-xs text-[#222222]/60 font-mono">
          Hiển thị {filteredItems.length} món trong danh mục{" "}
          <strong className="text-[#2D4A3E]">{activeCategory}</strong>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="card-warm overflow-hidden flex flex-col p-4 bg-white group hover:border-[#C88A4B]/40 transition-all duration-300"
            >
              {/* Ảnh vuông sắc nét */}
              <div className="relative aspect-square w-full rounded-xl overflow-hidden mb-3 bg-[#FDFBF7]">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                />

                {/* Gắn nhãn badge "Best-seller" hoặc "Signature" */}
                {item.tag && (
                  <span
                    className={`absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wide uppercase shadow-sm ${
                      item.tag === "Signature"
                        ? "bg-[#C88A4B] text-white"
                        : "bg-[#2D4A3E] text-white"
                    }`}
                  >
                    {item.tag}
                  </span>
                )}
              </div>

              {/* Thông tin món */}
              <div className="space-y-1.5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    {/* Tên món: Playfair Display */}
                    <h3 className="font-serif text-lg font-bold text-[#2D4A3E] group-hover:text-[#C88A4B] transition-colors leading-snug">
                      {item.name}
                    </h3>
                    {/* Giá tiền: màu #C88A4B */}
                    <span className="font-sans text-sm font-bold text-[#C88A4B] shrink-0 pt-0.5">
                      {item.priceFormatted}
                    </span>
                  </div>

                  {item.desc && (
                    <p className="text-xs font-light text-[#222222]/75 leading-relaxed mt-1.5 line-clamp-2">
                      {item.desc}
                    </p>
                  )}
                </div>

                <div className="pt-2.5 border-t border-[#EAE6DF]/60 flex items-center justify-between text-[11px] text-[#2D4A3E]/70 font-medium">
                  <span className="inline-flex items-center gap-1">
                    <CheckCircle2 size={12} className="text-[#C88A4B]" />
                    <span>{item.category}</span>
                  </span>
                  <span className="text-[10px] text-[#222222]/50">
                    Phục vụ tại bàn
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================= */}
      {/* 4. GHI CHÚ CHÂN TRANG                                     */}
      {/* ========================================================= */}
      <section className="pb-20 px-6 sm:px-12 max-w-7xl mx-auto">
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-[#EAE6DF] shadow-sm flex flex-col md:flex-row items-center gap-8 justify-between">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#C88A4B] font-semibold">
              <Leaf size={14} />
              <span>GHI CHÚ THỰC ĐƠN • SPECIAL NOTES</span>
            </div>

            <h3 className="font-serif text-2xl font-bold text-[#2D4A3E]">
              Tùy Chỉnh Theo Khẩu Vị Của Bạn
            </h3>

            <ul className="space-y-2 text-xs sm:text-sm font-light text-[#222222]/80 leading-relaxed list-disc list-inside">
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
                rang củi không phụ gia; trà và nước ép từ trái cây tươi trong ngày.
              </li>
            </ul>
          </div>

          <div className="shrink-0 p-6 rounded-2xl bg-[#FDFBF7] border border-[#EAE6DF] text-center space-y-2 max-w-xs">
            <HeartHandshake size={28} className="text-[#2D4A3E] mx-auto" />
            <p className="font-serif font-bold text-sm text-[#2D4A3E]">
              Phục vụ tận tâm
            </p>
            <p className="text-[11px] text-[#222222]/70">
              Hãy dặn nhân viên khi gọi món để chúng tôi pha chế đúng khẩu vị của bạn nhé!
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
