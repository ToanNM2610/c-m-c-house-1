"use client";

import React, { useState, useMemo } from "react";
import { useLanguage } from "@/context/LanguageContext";
import {
  EDITORIAL_MENU_DATA,
  EditorialMenuCategory,
  EditorialMenuItem,
  CAM_CU_HOUSE_INFO,
} from "@/data/camCuHouseData";
import {
  Search,
  X,
  PhoneCall,
  Navigation,
  Check,
  ClipboardList,
  Sparkles,
  Coffee,
  Leaf,
  Droplets,
  UtensilsCrossed,
} from "lucide-react";

interface EditorialMenuSectionProps {
  onSelectPreOrderItems?: (items: string[]) => void;
  selectedPreOrderItems?: string[];
}

export default function EditorialMenuSection({
  onSelectPreOrderItems,
  selectedPreOrderItems = [],
}: EditorialMenuSectionProps) {
  const { locale } = useLanguage();
  const isVi = locale !== "en";

  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [activeFilterNeed, setActiveFilterNeed] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [localSelectedItems, setLocalSelectedItems] = useState<string[]>(selectedPreOrderItems);

  // Quick filter presets based on user needs
  const NEED_FILTERS = [
    { id: "all", labelVi: "Tất cả 7 nhóm", labelEn: "All 7 Groups" },
    { id: "coffee", labelVi: "Cà phê tỉnh táo", labelEn: "Rich Coffee", icon: Coffee },
    { id: "tea", labelVi: "Thảo mộc ấm lành", labelEn: "Herbal Teas", icon: Leaf },
    { id: "refresh", labelVi: "Giải nhiệt mát lành", labelEn: "Cool Sips", icon: Droplets },
    { id: "food", labelVi: "Đồ ăn no & Ăn vặt", labelEn: "Bites & Snacks", icon: UtensilsCrossed },
  ];

  const handleToggleItem = (code: string, name: string) => {
    const itemLabel = `[${code}] ${name}`;
    let updated: string[];
    if (localSelectedItems.includes(itemLabel)) {
      updated = localSelectedItems.filter((i) => i !== itemLabel);
    } else {
      updated = [...localSelectedItems, itemLabel];
    }
    setLocalSelectedItems(updated);
    onSelectPreOrderItems?.(updated);
  };

  const filteredCategories = useMemo(() => {
    const normalizedQuery = searchQuery
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

    return EDITORIAL_MENU_DATA.map((cat: EditorialMenuCategory) => {
      // Filter by category tab
      if (activeCategory !== "all" && cat.id !== activeCategory) {
        return null;
      }

      // Filter by Need
      if (activeFilterNeed === "coffee" && cat.id !== "ca-phe") return null;
      if (activeFilterNeed === "tea" && cat.id !== "tra") return null;
      if (
        activeFilterNeed === "refresh" &&
        !["sinh-to", "nuoc-ep", "soda-sua-chua", "other"].includes(cat.id)
      ) {
        return null;
      }
      if (activeFilterNeed === "food" && cat.id !== "food") return null;

      // Filter by search query
      if (!normalizedQuery) {
        return cat;
      }

      const matchedItems = cat.items.filter((item: EditorialMenuItem) => {
        const itemText = `${item.code} ${item.name} ${item.note || ""} ${item.variants?.join(" ") || ""}`
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "");
        return itemText.includes(normalizedQuery);
      });

      if (matchedItems.length === 0) return null;

      return {
        ...cat,
        items: matchedItems,
      };
    }).filter((cat): cat is EditorialMenuCategory => cat !== null);
  }, [activeCategory, activeFilterNeed, searchQuery]);

  const totalFilteredCount = useMemo(() => {
    return filteredCategories.reduce((acc, cat) => acc + cat.items.length, 0);
  }, [filteredCategories]);

  return (
    <section
      id="menu-section"
      className="editorial-menu-section relative"
      aria-labelledby="editorial-menu-heading"
    >
      {/* 1. Masthead */}
      <header className="editorial-masthead">
        <div>
          <span className="label-uppercase-12">
            {CAM_CU_HOUSE_INFO.name} · {CAM_CU_HOUSE_INFO.coordinates.display}
          </span>
          <h2 id="editorial-menu-heading" className="editorial-masthead-title">
            {isVi ? "Thực Đơn Chuyên Khảo Thực Vật Học" : "Editorial Botanical Monograph Menu"}
          </h2>
        </div>

        <p className="editorial-masthead-meta">
          {isVi
            ? "Thực đơn thuần chữ (Text-Only) tuyển chọn 7 nhóm thức uống & món ăn mộc mạc bên bờ suối Gia Nghĩa."
            : "Pure typography text-only menu featuring 7 curated groups of wholesome highland sips and bites."}
        </p>
      </header>

      {/* 2. Controls & Search */}
      <div className="flex flex-col gap-6 mb-10">
        {/* Instant Search Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)] pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isVi ? "Tìm món không dấu (vd: ca phe muoi, bo kho)..." : "Search menu without accents..."}
              className="w-full pl-10 pr-10 py-3 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-full text-[14px] text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] focus:outline-none focus:border-[var(--text-primary)] transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] p-1"
                aria-label={isVi ? "Xóa tìm kiếm" : "Clear search"}
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Need filters */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            {NEED_FILTERS.map((nf) => {
              const isSelected = activeFilterNeed === nf.id;
              const Icon = nf.icon;
              return (
                <button
                  key={nf.id}
                  type="button"
                  onClick={() => {
                    setActiveFilterNeed(nf.id);
                    if (nf.id !== "all") setActiveCategory("all");
                  }}
                  className={`px-3.5 py-1.5 rounded-full font-mono text-xs uppercase tracking-wider border whitespace-nowrap inline-flex items-center gap-1.5 transition-colors ${
                    isSelected
                      ? "bg-[var(--accent-botanical)] text-white border-[var(--accent-botanical)] font-bold shadow-sm"
                      : "bg-[var(--bg-surface)] text-[var(--text-secondary)] border-[var(--border-subtle)] hover:border-[var(--text-primary)]"
                  }`}
                >
                  {Icon && <Icon className="w-3.5 h-3.5" />}
                  <span>{isVi ? nf.labelVi : nf.labelEn}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Sticky 7 Category Tabs */}
        <nav
          className="editorial-category-nav"
          aria-label={isVi ? "7 nhóm thực đơn" : "7 Menu Categories"}
        >
          <button
            type="button"
            className={`editorial-cat-chip ${activeCategory === "all" ? "is-active" : ""}`}
            onClick={() => {
              setActiveCategory("all");
              setActiveFilterNeed("all");
            }}
            aria-pressed={activeCategory === "all"}
          >
            {isVi ? "Tất Cả 7 Nhóm" : "All 7 Categories"}
          </button>

          {EDITORIAL_MENU_DATA.map((cat: EditorialMenuCategory) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                className={`editorial-cat-chip ${isActive ? "is-active" : ""}`}
                onClick={() => {
                  setActiveCategory(cat.id);
                  setActiveFilterNeed("all");
                }}
                aria-pressed={isActive}
              >
                [{cat.order}] {isVi ? cat.titleVi : cat.titleEn} ({cat.items.length})
              </button>
            );
          })}
        </nav>
      </div>

      {/* 3. Pre-order Selection Floating Indicator */}
      {localSelectedItems.length > 0 && (
        <div className="mb-8 p-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--accent-botanical)]/40 flex flex-wrap items-center justify-between gap-4 shadow-sm animate-fadeIn">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[var(--accent-botanical)] text-white flex items-center justify-center font-mono font-bold text-xs">
              {localSelectedItems.length}
            </div>
            <div className="flex flex-col">
              <span className="font-mono text-xs font-bold text-[var(--text-primary)]">
                {isVi ? "MÓN ĐÃ CHỌN ĐẶT TRƯỚC / MANG VỀ" : "PRE-SELECTED TAKEAWAY ITEMS"}
              </span>
              <span className="text-[13px] text-[var(--text-secondary)]">
                {localSelectedItems.join(", ")}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setLocalSelectedItems([]);
                onSelectPreOrderItems?.([]);
              }}
              className="px-3 py-1.5 text-xs font-mono text-[var(--text-secondary)] hover:text-red-600 transition-colors"
            >
              {isVi ? "Xóa chọn" : "Clear"}
            </button>
            <a
              href="#reservation-section"
              className="btn-cta-primary px-4 py-1.5 text-xs rounded-full inline-flex items-center gap-1.5"
            >
              <ClipboardList className="w-3.5 h-3.5" />
              <span>{isVi ? "Gửi vào phiếu đặt bàn" : "Attach to Reservation"}</span>
            </a>
          </div>
        </div>
      )}

      {/* 4. Menu Chapters (2 columns on Desktop 1440px / 1 column on Mobile 390px) */}
      <div className="editorial-chapters-wrapper flex flex-col gap-12">
        {filteredCategories.length > 0 ? (
          filteredCategories.map((chapter: EditorialMenuCategory) => (
            <article
              key={chapter.id}
              id={`cat-${chapter.id}`}
              className="editorial-chapter"
              data-category={chapter.id}
            >
              <div className="editorial-chapter-header">
                <div>
                  <h3 className="editorial-chapter-title">
                    {chapter.order}. {isVi ? chapter.titleVi : chapter.titleEn}
                  </h3>
                  <p className="text-[14px] text-[var(--text-secondary)] mt-1 font-serif italic">
                    {chapter.subtitle}
                  </p>
                </div>
                <span className="label-uppercase-12">
                  {chapter.items.length} {isVi ? "MÓN" : "ITEMS"}
                </span>
              </div>

              {/* LƯỚI 2 CỘT CHUẨN TẠP CHÍ - 100% TEXT ONLY (0 ẢNH) */}
              <ul className="editorial-grid">
                {chapter.items.map((item: EditorialMenuItem) => {
                  const itemKey = `[${item.code}] ${item.name}`;
                  const isChecked = localSelectedItems.includes(itemKey);

                  return (
                    <li
                      key={item.code}
                      className={`editorial-menu-item group ${isChecked ? "bg-[var(--accent-botanical)]/5 rounded-lg p-2" : ""}`}
                      data-item-id={item.code}
                    >
                      {/* Topline: Code + Name + Dot leader + Price */}
                      <div className="editorial-item-topline">
                        <span className="editorial-item-index font-mono">{item.code}</span>
                        <h4 className="editorial-item-name">{item.name}</h4>
                        <span className="editorial-dot-leader" aria-hidden="true" />
                        <span className="editorial-item-price">
                          {item.price ? `${item.price.toLocaleString("vi-VN")}đ` : "25.000đ"}
                        </span>
                      </div>

                      {/* Description & Notes */}
                      {item.note && (
                        <p className="editorial-item-desc">{item.note}</p>
                      )}

                      {/* Badges, Variants & Pre-order Checkbox */}
                      <div className="editorial-item-tags items-center justify-between mt-2">
                        <div className="flex flex-wrap items-center gap-1.5">
                          {item.badge && (
                            <span
                              className={`editorial-tag-12 ${
                                item.badge === "Signature"
                                  ? "bg-[var(--accent-warm)] text-white border-transparent"
                                  : item.badge === "Best-seller"
                                  ? "bg-amber-600 text-white border-transparent"
                                  : item.badge === "Green & Clean"
                                  ? "bg-[var(--accent-botanical)] text-white border-transparent"
                                  : "bg-[var(--bg-surface)] text-[var(--text-primary)]"
                              }`}
                            >
                              {item.badge}
                            </span>
                          )}

                          {item.variants?.map((v: string) => (
                            <span
                              key={v}
                              className="editorial-tag-12 bg-transparent text-[var(--text-secondary)] border-[var(--border-subtle)]"
                            >
                              {v}
                            </span>
                          ))}
                        </div>

                        {/* Quick pre-order selection checkbox */}
                        <button
                          type="button"
                          onClick={() => handleToggleItem(item.code, item.name)}
                          className={`text-xs font-mono px-2 py-0.5 rounded border inline-flex items-center gap-1 transition-colors ${
                            isChecked
                              ? "bg-[var(--accent-botanical)] text-white border-[var(--accent-botanical)] font-bold"
                              : "text-[var(--text-secondary)] border-[var(--border-subtle)] hover:border-[var(--text-primary)] hover:text-[var(--text-primary)]"
                          }`}
                          aria-label={`Chọn món ${item.name} đặt trước`}
                        >
                          <Check className={`w-3 h-3 ${isChecked ? "opacity-100" : "opacity-0"}`} />
                          <span>{isChecked ? (isVi ? "Đã chọn" : "Selected") : (isVi ? "+ Đặt trước" : "+ Pre-order")}</span>
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </article>
          ))
        ) : (
          <div className="p-12 text-center border border-[var(--border-subtle)] rounded-xl bg-[var(--bg-surface)] flex flex-col items-center gap-3">
            <p className="text-[15px] text-[var(--text-secondary)]">
              {isVi
                ? `Không tìm thấy món phù hợp với từ khóa “${searchQuery}”`
                : `No menu items found matching “${searchQuery}”`}
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setActiveCategory("all");
                setActiveFilterNeed("all");
              }}
              className="text-[14px] font-bold text-[var(--accent-warm)] hover:underline"
            >
              {isVi ? "Xóa bộ lọc để xem toàn bộ 67 món" : "Clear filters to view all 67 items"}
            </button>
          </div>
        )}
      </div>

      {/* 5. Chân trang thực đơn - Zero Manual Ops CTA */}
      <footer className="editorial-menu-footer">
        <p className="editorial-footer-text">
          <strong>{CAM_CU_HOUSE_INFO.name}</strong> — {CAM_CU_HOUSE_INFO.address.fullAddress}
        </p>

        <div className="primary-cta-group">
          <a className="btn-cta-primary" href={CAM_CU_HOUSE_INFO.contacts.primaryTel}>
            <PhoneCall className="w-4 h-4 mr-2 inline" />
            <span>
              {isVi
                ? `Gọi Hotline: ${CAM_CU_HOUSE_INFO.contacts.formattedPhones[0]}`
                : `Call Hotline: ${CAM_CU_HOUSE_INFO.contacts.formattedPhones[0]}`}
            </span>
          </a>

          <a
            className="btn-cta-secondary"
            href={CAM_CU_HOUSE_INFO.socials.googleMaps}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Navigation className="w-4 h-4 mr-2 inline" />
            <span>{isVi ? "Chỉ đường (Google Maps)" : "Directions (Google Maps)"}</span>
          </a>
        </div>
      </footer>
    </section>
  );
}
