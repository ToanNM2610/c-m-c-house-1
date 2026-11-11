"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Footer from "@/components/Footer";
import { EDITORIAL_MENU_DATA, EditorialMenuItem, EditorialMenuCategory, CAM_CU_HOUSE_INFO } from "@/data/camCuHouseData";
import { useLanguage } from "@/context/LanguageContext";
import { usePreOrder } from "@/context/PreOrderContext";
import {
  Search,
  Plus,
  Check,
  ShoppingBag,
  ArrowRight,
  PhoneCall,
  Sparkles,
  UtensilsCrossed,
  Filter,
  Trash2
} from "lucide-react";

export default function MenuPage() {
  const { locale } = useLanguage();
  const isVi = locale !== "en";
  const { items: preOrderItems, addItem, removeItem, updateQuantity, clearTray, totalItems, totalEstimatedAmount } = usePreOrder();

  const [activeCategoryId, setActiveCategoryId] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const [showTrayDrawer, setShowTrayDrawer] = useState(false);

  // Chọn biến thể món (ví dụ Đen/Sữa hoặc Sa tế/Ớt siêu cay)
  const handleSelectVariant = (itemCode: string, variant: string) => {
    setSelectedVariants((prev) => ({
      ...prev,
      [itemCode]: variant,
    }));
  };

  const formatPrice = (price?: number) => {
    if (!price) return "Theo thời giá";
    return new Intl.NumberFormat("vi-VN").format(price) + " đ";
  };

  // Lọc món theo search & category
  const filteredCategories = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return EDITORIAL_MENU_DATA.map((cat) => {
      // Nếu chọn category cụ thể và không khớp -> bỏ qua
      if (activeCategoryId !== "all" && cat.id !== activeCategoryId) {
        return null;
      }

      const matchedItems = cat.items.filter((item) => {
        if (!q) return true;
        const matchName = item.name.toLowerCase().includes(q);
        const matchCode = item.code.toLowerCase().includes(q);
        const matchNote = item.note?.toLowerCase().includes(q);
        const matchVariants = item.variants?.some((v) => v.toLowerCase().includes(q));
        return matchName || matchCode || matchNote || matchVariants;
      });

      if (matchedItems.length === 0) return null;

      return {
        ...cat,
        items: matchedItems,
      };
    }).filter(Boolean) as EditorialMenuCategory[];
  }, [activeCategoryId, searchQuery]);

  const totalItemsCount = useMemo(() => {
    return EDITORIAL_MENU_DATA.reduce((acc, cat) => acc + cat.items.length, 0);
  }, []);

  return (
    <div className="bg-[var(--bg-primary)] text-[var(--text-primary)] min-h-screen font-sans selection:bg-[#E86C3A] selection:text-white transition-colors pb-24">
      <main className="w-full">
        {/* MASTHEAD HEADER */}
        <section className="relative w-full pt-32 sm:pt-40 pb-16 px-4 sm:px-8 border-b border-[var(--border-subtle)] bg-[#0E100F] text-[#F3F1EC]">
          <div className="w-full max-w-[1400px] mx-auto flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs uppercase tracking-widest text-[#E86C3A] font-bold">
                [04] THỰC ĐƠN · EDITORIAL TEXT-ONLY MONOGRAPH
              </span>
              <span className="text-white/40 font-mono text-xs">·</span>
              <span className="text-white/60 font-mono text-xs">
                7 NHÓM DANH MỤC · {totalItemsCount} MÓN NGUYÊN BẢN (KHÔNG DÙNG ẢNH)
              </span>
            </div>

            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
              <div>
                <h1 className="font-display font-black text-[clamp(36px,6vw,72px)] uppercase tracking-tight text-[#F3F1EC] leading-[1.08]">
                  {isVi ? "CHUYÊN KHẢO THỰC ĐƠN THỰC VẬT HỌC" : "BOTANICAL EDITORIAL MONOGRAPH"}
                </h1>
                <p className="font-serif italic text-[20px] sm:text-[24px] text-[#E86C3A] mt-2 max-w-3xl leading-relaxed">
                  {isVi
                    ? "Thiết kế chữ thuần khiết (Text-Only) theo phong cách tạp chí cổ điển. Tươi mát, xanh sạch và minh bạch giá."
                    : "Pure typographic menu crafted like an authentic botanical journal. Clean, transparent, zero photos."}
                </p>
              </div>

              {/* Nút mở Khay Đặt Trước / Mang Về */}
              {totalItems > 0 && (
                <div className="shrink-0 p-4 rounded-xl bg-[#18221D] border border-[#E86C3A]/50 flex flex-col gap-3">
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-mono text-xs text-[#E86C3A] font-bold">
                      KHAY ĐẶT TRƯỚC: {totalItems} MÓN
                    </span>
                    <span className="font-mono font-bold text-sm text-white">
                      {new Intl.NumberFormat("vi-VN").format(totalEstimatedAmount)} đ
                    </span>
                  </div>
                  <Link
                    href="/chi-duong-lien-he#dat-ban-form"
                    className="px-5 py-2.5 bg-[#E86C3A] text-white font-bold text-xs uppercase tracking-wider rounded-lg flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                  >
                    <span>Chuyển sang [05] Chỉ Đường & Đặt Bàn</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              )}
            </div>

            {/* THANH TÌM KIẾM TỨC THÌ & BỘ LỌC 7 DANH MỤC */}
            <div className="pt-6 border-t border-white/10 flex flex-col gap-5">
              {/* Ô Search */}
              <div className="relative w-full max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={isVi ? "Tìm kiếm món (vd: cà phê muối, sầu riêng, bánh tráng...)" : "Search menu items..."}
                  className="w-full pl-11 pr-4 py-3 bg-[#161B18] border border-white/15 rounded-full text-sm text-[#F3F1EC] placeholder:text-white/40 focus:outline-none focus:border-[#E86C3A] transition-colors"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-mono text-white/60 hover:text-white"
                  >
                    XÓA
                  </button>
                )}
              </div>

              {/* 7 Tabs chuyển đổi danh mục */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveCategoryId("all")}
                  className={`px-4 py-2 rounded-full font-mono text-xs uppercase tracking-wider font-bold transition-all ${
                    activeCategoryId === "all"
                      ? "bg-[#E86C3A] text-white shadow-md"
                      : "bg-white/10 text-white/80 hover:bg-white/20"
                  }`}
                >
                  TẤT CẢ (7 NHÓM)
                </button>

                {EDITORIAL_MENU_DATA.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setActiveCategoryId(cat.id)}
                    className={`px-4 py-2 rounded-full font-mono text-xs uppercase tracking-wider font-bold transition-all ${
                      activeCategoryId === cat.id
                        ? "bg-[#E86C3A] text-white shadow-md"
                        : "bg-white/10 text-white/80 hover:bg-white/20"
                    }`}
                  >
                    [{cat.order}] {cat.titleVi} ({cat.items.length})
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* DANH SÁCH MÓN THEO 7 NHÓM - TEXT-ONLY VỚI ĐƯỜNG DẪN CHẤM DOT-LEADER */}
        <section className="w-full max-w-[1400px] mx-auto px-4 sm:px-8 py-16 flex flex-col gap-20">
          {filteredCategories.length === 0 ? (
            <div className="p-16 text-center rounded-2xl border border-dashed border-[var(--border-subtle)] flex flex-col items-center gap-4">
              <UtensilsCrossed className="w-12 h-12 text-[#E86C3A]/50" />
              <p className="text-lg font-medium text-[var(--text-secondary)]">
                Không tìm thấy món phù hợp với từ khóa &ldquo;{searchQuery}&rdquo;.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setActiveCategoryId("all");
                }}
                className="px-5 py-2 rounded-full bg-[#E86C3A] text-white font-mono text-xs uppercase font-bold"
              >
                Đặt lại bộ lọc
              </button>
            </div>
          ) : (
            filteredCategories.map((category) => (
              <div key={category.id} className="flex flex-col gap-8">
                {/* Header nhóm */}
                <div className="pb-4 border-b-2 border-[var(--border-subtle)] flex flex-wrap items-end justify-between gap-4">
                  <div>
                    <span className="font-mono text-xs text-[#E86C3A] uppercase font-bold tracking-widest block">
                      NHÓM [{category.order}] · {category.titleEn}
                    </span>
                    <h2 className="font-display font-black text-[28px] sm:text-[34px] uppercase tracking-tight text-[var(--text-primary)] mt-1">
                      {category.titleVi}
                    </h2>
                    <p className="text-[14px] text-[var(--text-secondary)] font-serif italic mt-0.5">
                      {category.subtitle}
                    </p>
                  </div>
                  <span className="font-mono text-xs text-[var(--text-secondary)]">
                    {category.items.length} MÓN
                  </span>
                </div>

                {/* Bố cục 2 cột trên Desktop (1440px), 1 cột trên Mobile (390px) */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-8">
                  {category.items.map((item) => {
                    const activeVariant = selectedVariants[item.code] || (item.variants ? item.variants[0] : undefined);
                    const isInTray = preOrderItems.some(
                      (p) => p.code === item.code && (p.variant || "") === (activeVariant || "")
                    );

                    return (
                      <div
                        key={item.code}
                        className="p-5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:border-[#E86C3A]/40 transition-colors flex flex-col justify-between gap-3"
                      >
                        <div>
                          {/* Mã món, Huy hiệu và Nút thêm món */}
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-[12px] font-bold text-[#E86C3A]">
                                [{item.code}]
                              </span>
                              {item.badge && (
                                <span className="label-uppercase-12 font-mono text-[10px] px-2 py-0.5 rounded-full bg-[#E86C3A]/10 text-[#E86C3A] font-bold">
                                  {item.badge}
                                </span>
                              )}
                            </div>

                            {/* Nút thêm vào khay đặt trước */}
                            <button
                              type="button"
                              onClick={() =>
                                addItem({
                                  code: item.code,
                                  name: item.name,
                                  price: item.price,
                                  variant: activeVariant,
                                })
                              }
                              className={`px-3 py-1.5 rounded-full font-mono text-xs font-bold inline-flex items-center gap-1.5 transition-all ${
                                isInTray
                                  ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
                                  : "bg-[#E86C3A] text-white hover:opacity-90 shadow-xs"
                              }`}
                              title="Thêm vào Khay Đặt Trước / Mang Về"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              <span>{isInTray ? "Thêm tiếp" : "Chọn món"}</span>
                            </button>
                          </div>

                          {/* Hàng tên món và Giá với Đường dẫn chấm Dot-Leader */}
                          <div className="flex items-baseline justify-between gap-2 mt-2">
                            <span className="font-sans font-bold text-[16px] sm:text-[18px] text-[var(--text-primary)]">
                              {item.name}
                            </span>
                            <span className="dot-leader flex-1 mx-2" aria-hidden="true" />
                            <span className="font-mono font-bold text-[15px] sm:text-[16px] text-[#E86C3A] shrink-0">
                              {formatPrice(item.price)}
                            </span>
                          </div>

                          {/* Ghi chú mô tả món */}
                          {item.note && (
                            <p className="text-[13.5px] text-[var(--text-secondary)] mt-1 leading-relaxed">
                              {item.note}
                            </p>
                          )}
                        </div>

                        {/* Biến thể món (nếu có, ví dụ Đen/Sữa hoặc Bánh tráng Sa tế/Ớt siêu cay) */}
                        {item.variants && item.variants.length > 0 && (
                          <div className="pt-2 border-t border-[var(--border-subtle)] flex items-center gap-2">
                            <span className="font-mono text-[11px] text-[var(--text-secondary)] uppercase">
                              Tùy chọn:
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {item.variants.map((v) => (
                                <button
                                  key={v}
                                  type="button"
                                  onClick={() => handleSelectVariant(item.code, v)}
                                  className={`px-2.5 py-0.5 rounded-md font-mono text-[11px] font-bold transition-all ${
                                    activeVariant === v
                                      ? "bg-[#E86C3A] text-white"
                                      : "bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:border-[#E86C3A]"
                                  }`}
                                >
                                  {v}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </section>

        {/* KHAY ĐẶT TRƯỚC / MANG VỀ CỐ ĐỊNH Ở ĐÁY KHI CÓ MÓN */}
        {totalItems > 0 && (
          <div className="fixed bottom-0 inset-x-0 z-40 bg-[#0E100F] border-t border-[#E86C3A]/40 text-[#F3F1EC] p-4 shadow-2xl backdrop-blur-md">
            <div className="w-full max-w-[1400px] mx-auto flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-[#E86C3A] text-white flex items-center justify-center font-bold">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-mono text-xs uppercase text-[#E86C3A] font-bold block">
                    KHAY ĐẶT TRƯỚC / MANG VỀ
                  </span>
                  <span className="font-display font-extrabold text-[17px] text-[#F3F1EC]">
                    {totalItems} món đã chọn · Ước tính {new Intl.NumberFormat("vi-VN").format(totalEstimatedAmount)} đ
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={clearTray}
                  className="px-4 py-2.5 rounded-full border border-white/20 text-white/70 hover:text-white font-mono text-xs font-bold uppercase transition-colors"
                >
                  Xóa tất cả
                </button>

                <Link
                  href="/chi-duong-lien-he#dat-ban-form"
                  className="px-6 py-2.5 bg-[#E86C3A] text-white font-bold text-xs uppercase tracking-wider rounded-full flex items-center gap-2 hover:opacity-90 transition-opacity shadow-lg"
                >
                  <span>Chuyển sang [05] Chỉ Đường & Đặt Chỗ</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
