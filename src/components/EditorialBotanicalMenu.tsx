"use client";

import React, { useState, useMemo } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { STORE_CONSTANTS } from "@/lib/atmosphereEngine";
import {
  EditorialMenuItem,
  EditorialCategory,
  getEditorialMenuState,
} from "@/lib/editorialMenuData";
import { MENU_ITEMS, MenuItem } from "@/data/menu";
import { PhoneCall, Navigation, Search, X } from "lucide-react";

interface EditorialBotanicalMenuProps {
  initialItems?: MenuItem[];
}

export default function EditorialBotanicalMenu({
  initialItems = MENU_ITEMS,
}: EditorialBotanicalMenuProps) {
  const { locale } = useLanguage();
  const isVi = locale !== "en";

  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const menuState = useMemo(() => {
    return getEditorialMenuState(initialItems);
  }, [initialItems]);

  // Bộ lọc danh mục và từ khóa tìm kiếm (không dấu)
  const filteredCategories = useMemo(() => {
    if (!menuState.connected) return [];

    const normalizedQuery = searchQuery
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

    return menuState.categories
      .map((cat: EditorialCategory) => {
        // Kiểm tra lọc danh mục
        if (activeCategory !== "all" && cat.categoryKey !== activeCategory && cat.id !== activeCategory) {
          return null;
        }

        // Lọc theo từ khóa tìm kiếm
        if (!normalizedQuery) {
          return cat;
        }

        const matchedItems = cat.items.filter((item: EditorialMenuItem) => {
          const itemText = `${item.nameVi} ${item.nameEn} ${item.descriptionVi} ${item.tagsVi.join(" ")}`
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
      })
      .filter((cat): cat is EditorialCategory => cat !== null);
  }, [menuState, activeCategory, searchQuery]);

  const totalFilteredCount = useMemo(() => {
    return filteredCategories.reduce((acc, cat) => acc + cat.items.length, 0);
  }, [filteredCategories]);

  // Trạng thái chưa kết nối thật
  if (!menuState.connected) {
    return (
      <section className="editorial-menu-section" aria-labelledby="editorial-menu-heading">
        <header className="editorial-masthead">
          <div>
            <span className="label-uppercase-12">
              {STORE_CONSTANTS.name} · {STORE_CONSTANTS.coordinates.display}
            </span>
            <h2 id="editorial-menu-heading" className="editorial-masthead-title">
              {isVi ? "Thực Đơn Cẩm Cù House" : "Cẩm Cù House Menu"}
            </h2>
          </div>
          <p className="editorial-masthead-meta">{isVi ? "Chưa kết nối" : "Disconnected"}</p>
        </header>
      </section>
    );
  }

  return (
    <section
      id="menu-section"
      className="editorial-menu-section"
      aria-labelledby="editorial-menu-heading"
    >
      {/* 1. ĐẦU TRANG TẠP CHÍ THỰC VẬT HỌC (EDITORIAL MASTHEAD) */}
      <header className="editorial-masthead">
        <div>
          <span className="label-uppercase-12">
            {STORE_CONSTANTS.name} · {STORE_CONSTANTS.coordinates.display}
          </span>
          <h2 id="editorial-menu-heading" className="editorial-masthead-title">
            {isVi ? "Thực Đơn Cẩm Cù House" : "Cẩm Cù House Menu"}
          </h2>
        </div>
        <p className="editorial-masthead-meta">
          {isVi
            ? `${STORE_CONSTANTS.address} · Thứ 2–5 07:00–18:00, Thứ 6–CN 07:00–22:00`
            : `${STORE_CONSTANTS.address} · Mon–Thu 07:00–18:00, Fri–Sun 07:00–22:00`}
        </p>
      </header>

      {/* 2. THANH TÌM KIẾM VÀ MỤC LỤC DANH MỤC (BOTANICAL CHAPTER INDEX) */}
      <div className="flex flex-col gap-4 mb-8">
        {/* Tìm kiếm tối giản */}
        <div className="relative max-w-md w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)] pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isVi ? "Tìm kiếm món mộc (không dấu)..." : "Search rustic menu..."}
            className="w-full pl-10 pr-10 py-2.5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-full text-[14px] text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] focus:outline-none focus:border-[var(--text-primary)] transition-colors"
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

        {/* Thanh chip chọn danh mục */}
        <nav
          className="editorial-category-nav"
          aria-label={isVi ? "Danh mục thực đơn" : "Menu categories"}
        >
          <button
            type="button"
            className={`editorial-cat-chip ${activeCategory === "all" ? "is-active" : ""}`}
            onClick={() => setActiveCategory("all")}
            aria-pressed={activeCategory === "all"}
          >
            {isVi ? `Tất cả (${menuState.totalCount})` : `All (${menuState.totalCount})`}
          </button>
          {menuState.categories.map((cat: EditorialCategory) => {
            const isActive = activeCategory === cat.categoryKey || activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                className={`editorial-cat-chip ${isActive ? "is-active" : ""}`}
                onClick={() => setActiveCategory(cat.categoryKey)}
                aria-pressed={isActive}
              >
                {isVi ? cat.titleVi : cat.titleEn} ({cat.items.length})
              </button>
            );
          })}
        </nav>
      </div>

      {/* 3. KHỐI NỘI DUNG TỪNG CHƯƠNG (BOTANICAL CHAPTERS) */}
      <div className="editorial-chapters-wrapper">
        {filteredCategories.length > 0 ? (
          filteredCategories.map((chapter: EditorialCategory, chapterIdx: number) => {
            const chapterTitle = isVi ? chapter.titleVi : chapter.titleEn;
            const chapterNumber = String(chapterIdx + 1).padStart(2, "0");

            return (
              <article
                key={chapter.id}
                id={`cat-${chapter.id}`}
                className="editorial-chapter"
                data-category={chapter.id}
              >
                <div className="editorial-chapter-header">
                  <h3 className="editorial-chapter-title">
                    {chapterNumber}. {chapterTitle}
                  </h3>
                  <span className="label-uppercase-12">
                    {chapter.items.length} {isVi ? "MÓN" : "ITEMS"}
                  </span>
                </div>

                {/* Lưới 2 cột Desktop 1440px / 1 cột Mobile 390px (0 ảnh) */}
                <ul className="editorial-grid">
                  {chapter.items.map((item: EditorialMenuItem) => {
                    const name = isVi ? item.nameVi : item.nameEn;
                    const desc = isVi ? item.descriptionVi : item.descriptionEn;
                    const tags = isVi ? item.tagsVi : item.tagsEn;

                    return (
                      <li
                        key={item.id}
                        className={`editorial-menu-item ${
                          !item.inStock ? "is-out-of-stock" : ""
                        }`}
                        data-item-id={item.id}
                      >
                        {/* Hàng trên: Thứ tự + Tên món + Dấu chấm dẫn (Dot leader) + Giá */}
                        <div className="editorial-item-topline">
                          <span className="editorial-item-index">{item.orderNumber}</span>
                          <h4 className="editorial-item-name">{name}</h4>
                          <span className="editorial-dot-leader" aria-hidden="true" />
                          <span className="editorial-item-price">{item.priceDisplay}</span>
                        </div>

                        {/* Mô tả hương vị (15px >= 14px) */}
                        {desc && <p className="editorial-item-desc">{desc}</p>}

                        {/* Nhãn đặc tính (Duy nhất 12px viết hoa) */}
                        {tags.length > 0 && (
                          <div className="editorial-item-tags">
                            {tags.map((tag: string, tagIdx: number) => (
                              <span key={tagIdx} className="editorial-tag-12">
                                {tag}
                              </span>
                            ))}
                            {!item.inStock && (
                              <span className="editorial-tag-12 text-red-600 border-red-300">
                                {isVi ? "TẠM HẾT" : "SOLD OUT"}
                              </span>
                            )}
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </article>
            );
          })
        ) : (
          <div className="p-12 text-center border border-[var(--border-subtle)] rounded-xl bg-[var(--bg-surface)] flex flex-col items-center gap-3">
            <p className="text-[15px] text-[var(--text-secondary)]">
              {isVi
                ? `Không tìm thấy món phù hợp với từ khóa “${searchQuery}”`
                : `No items found matching “${searchQuery}”`}
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setActiveCategory("all");
              }}
              className="text-[14px] font-bold text-[var(--accent-warm)] hover:underline"
            >
              {isVi ? "Xóa bộ lọc để xem toàn bộ 67 món" : "Clear filters to view all 67 items"}
            </button>
          </div>
        )}
      </div>

      {/* 4. CHÂN TRANG THỰC ĐƠN - ZERO MANUAL OPS (CHỈ GỌI HOTLINE & CHỈ ĐƯỜNG) */}
      <footer className="editorial-menu-footer">
        <p className="editorial-footer-text">
          <strong>{STORE_CONSTANTS.name}</strong> — {STORE_CONSTANTS.address}
        </p>
        <div className="primary-cta-group">
          <a className="btn-cta-primary" href={STORE_CONSTANTS.hotlines.primaryTel}>
            <PhoneCall className="w-4 h-4 mr-2 inline" />
            <span>
              {isVi
                ? `Gọi Hotline: ${STORE_CONSTANTS.hotlines.primary}`
                : `Call Hotline: ${STORE_CONSTANTS.hotlines.primary}`}
            </span>
          </a>
          <a
            className="btn-cta-secondary"
            href={STORE_CONSTANTS.mapsUrl}
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
