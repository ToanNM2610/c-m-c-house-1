"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Coffee, CheckCircle2, Leaf, HeartHandshake } from "lucide-react";
import { REAL_MENU_DATA } from "@/data/menu";
import { useLanguage } from "@/context/LanguageContext";
import { MaskHeading, StaggerContainer, StaggerItem } from "@/components/motion/ScrollReveal";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.06 },
  }),
};

const cardFanOut = {
  hidden: { opacity: 0, y: 50, rotateZ: -3 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    rotateZ: 0,
    transition: { duration: 0.7, delay: i * 0.06 },
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

const CAT_KEYS_MAP: Record<string, string> = {
  "TẤT CẢ": "menu.catAll",
  "CÀ PHÊ": "menu.catCoffee",
  "TRÀ": "menu.catTea",
  "SINH TỐ": "menu.catSmoothie",
  "NƯỚC ÉP": "menu.catJuice",
  "SODA & SỮA CHUA": "menu.catSoda",
  "KHÁC": "menu.catOther",
  "MÓN ĂN": "menu.catFood",
};

export default function MenuPage() {
  const { t, tMenuItem, formatPrice, tCat } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<MenuCategoryTab>("TẤT CẢ");

  const filteredItems = REAL_MENU_DATA.filter((item) => {
    if (activeCategory === "TẤT CẢ") return true;
    return item.category.toUpperCase() === activeCategory;
  });

  return (
    <div className="w-full text-[#FDFBF7]">
      {/* 1. BANNER */}
      <section className="relative py-28 sm:py-36 px-6 sm:px-12 flex items-center justify-center text-center border-b border-[#222520]">
        <div className="relative z-10 max-w-3xl mx-auto space-y-4">
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1A1D17] border border-[#222520] text-xs font-mono text-[#C88A4B]"
          >
            <Coffee size={14} />
            <span>{t("menu.heroTag")}</span>
          </motion.span>

          <MaskHeading as="h1" isAboveFold className="font-serif text-4xl sm:text-6xl font-bold text-[#FDFBF7] tracking-tight">
            {t("menu.heroTitle")}
          </MaskHeading>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-base sm:text-lg font-light text-[#FDFBF7]/80 leading-relaxed"
          >
            {t("menu.heroDesc")}
          </motion.p>
        </div>
      </section>

      {/* 2. STICKY CATEGORY TABS */}
      <section className="py-6 px-6 sm:px-12 max-w-7xl mx-auto flex justify-center sticky top-20 z-30 bg-[#0C0D0B]/95 border-b border-[#222520]/50">
        <div className="flex flex-wrap items-center justify-center gap-2 p-1.5 rounded-full bg-[#1A1D17] border border-[#222520] max-w-full overflow-x-auto scrollbar-hide">
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
              {t(CAT_KEYS_MAP[tab])}
            </button>
          ))}
        </div>
      </section>

      {/* 3. MENU GRID (STAGGERED CARDS VỚI HOVER LIFT & GLOW) */}
      <section className="pb-24 pt-8 px-6 sm:px-12 max-w-7xl mx-auto relative z-10">
        <div className="mb-6 text-xs text-[#FDFBF7]/60 font-mono">
          {t("menu.showing")} {filteredItems.length} {t("menu.itemsIn")}{" "}
          <strong className="text-[#C88A4B]">{t(CAT_KEYS_MAP[activeCategory])}</strong>
        </div>

        <StaggerContainer
          key={activeCategory}
          amount={0.08}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {filteredItems.map((item) => {
            const trItem = tMenuItem(item.id);
            return (
              <StaggerItem
                key={item.id}
                className="card-dark overflow-hidden flex flex-col p-4 group border border-white/5 hover:border-[#C88A4B]/40 hover:shadow-[0_0_20px_rgba(200,138,75,0.15)] transition-all duration-500 rounded-2xl cursor-pointer"
              >
                <div className="relative aspect-square w-full rounded-2xl overflow-hidden mb-3.5 bg-[#1A1D17]">
                  <Image
                    src={item.image}
                    alt={trItem.name}
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
                      {item.tag === "Signature" ? t("menu.tagSignature") : t("menu.tagBestSeller")}
                    </span>
                  )}
                </div>

                <div className="space-y-2 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-serif text-lg font-bold text-[#FDFBF7] group-hover:text-[#C88A4B] transition-colors leading-snug">
                        {trItem.name}
                      </h3>
                      <span className="font-mono text-sm font-bold text-[#C88A4B] shrink-0 pt-0.5">
                        {formatPrice(item.price)}
                      </span>
                    </div>
                    {trItem.desc && (
                      <p className="text-xs font-light text-[#FDFBF7]/70 leading-relaxed mt-1.5 line-clamp-2">
                        {trItem.desc}
                      </p>
                    )}
                  </div>
                  <div className="pt-2.5 border-t border-[#222520] flex items-center justify-between text-[11px] text-[#C88A4B] font-medium">
                    <span className="inline-flex items-center gap-1">
                      <CheckCircle2 size={12} className="text-[#C88A4B]" />
                      <span>{tCat(item.category)}</span>
                    </span>
                    <span className="text-[10px] text-[#FDFBF7]/50 font-mono">
                      {t("menu.servedAtTable")}
                    </span>
                  </div>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </section>

      {/* 4. SPECIAL NOTES FOOTER */}
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
              <span>{t("menu.notesTag")}</span>
            </div>

            <h3 className="font-serif text-2xl font-bold text-[#FDFBF7]">
              {t("menu.notesTitle")}
            </h3>

            <ul className="space-y-2 text-xs sm:text-sm font-light text-[#FDFBF7]/75 leading-relaxed list-disc list-inside">
              <li>
                <strong>{t("menu.note1Bold")}</strong> {t("menu.note1")}
              </li>
              <li>
                <strong>{t("menu.note2Bold")}</strong> {t("menu.note2")}
              </li>
              <li>
                <strong>{t("menu.note3Bold")}</strong> {t("menu.note3")}
              </li>
            </ul>
          </div>

          <div className="shrink-0 p-6 rounded-2xl bg-[#1A1D17] border border-[#222520] text-center space-y-2 max-w-xs">
            <HeartHandshake size={28} className="text-[#C88A4B] mx-auto" />
            <p className="font-serif font-bold text-sm text-[#FDFBF7]">
              {t("menu.serveTitle")}
            </p>
            <p className="text-[11px] text-[#FDFBF7]/60">
              {t("menu.serveDesc")}
            </p>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
