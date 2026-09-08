"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Star,
  Sparkles,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.12 },
  }),
};
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };

/* ── Featured signatures (ids match menu.ts for tMenuItem lookup) ── */
const FEATURED_IDS = [
  { id: "cf-3", price: 28000, image: "/uploads/gallery/1788250253554-875120458.jpg" },
  { id: "tr-5", price: 30000, image: "/uploads/gallery/1788250253564-115851131.jpg" },
  { id: "cf-5", price: 30000, image: "/uploads/gallery/1788250253560-200373033.jpg" },
  { id: "tr-10", price: 28000, image: "/uploads/gallery/1788250253562-580915883.jpg" },
];

/* ── Experience keys ── */
const EXP_KEYS = [
  { subtitleKey: "home.exp1Subtitle", titleKey: "home.exp1Title", descKey: "home.exp1Desc", image: "/images/spaces/1 (1).jpg" },
  { subtitleKey: "home.exp2Subtitle", titleKey: "home.exp2Title", descKey: "home.exp2Desc", image: "/images/spaces/1 (2).jpg" },
  { subtitleKey: "home.exp3Subtitle", titleKey: "home.exp3Title", descKey: "home.exp3Desc", image: "/images/spaces/1 (3).jpg" },
];

/* ── Review keys ── */
const REVIEW_KEYS = ["r1", "r2", "r3"] as const;

export default function HomePage() {
  const { t, formatPrice, tMenuItem } = useLanguage();
  const [currentReview, setCurrentReview] = useState(0);

  const nextReview = () => setCurrentReview((p) => (p + 1) % REVIEW_KEYS.length);
  const prevReview = () => setCurrentReview((p) => (p - 1 + REVIEW_KEYS.length) % REVIEW_KEYS.length);
  const rk = REVIEW_KEYS[currentReview];

  return (
    <div className="w-full text-[#FDFBF7]">
      {/* ── 1. HERO ── */}
      <section className="relative min-h-[90vh] sm:min-h-screen flex items-center justify-center px-6 sm:px-12 py-20 overflow-hidden">
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#0C0D0B]/30 via-transparent to-[#0C0D0B]/85 pointer-events-none" />
        <motion.div initial="hidden" animate="visible" variants={stagger}
          className="relative z-10 max-w-5xl mx-auto w-full text-center space-y-8"
        >
          <motion.div variants={fadeUp} custom={0}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1A1D17]/80 border border-[#222520] text-xs font-mono font-medium text-[#C88A4B]"
          >
            <Sparkles size={14} />
            <span>{t("home.heroTag")}</span>
          </motion.div>

          <motion.h1 variants={fadeUp} custom={1}
            className="font-serif text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tight text-[#FDFBF7] leading-[1.06]"
          >
            {t("home.title")}
          </motion.h1>

          <motion.p variants={fadeUp} custom={2}
            className="text-base sm:text-xl font-light text-[#FDFBF7]/80 max-w-2xl mx-auto leading-relaxed"
          >
            {t("home.subtitle")}
          </motion.p>

          <motion.div variants={fadeUp} custom={3} className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <Link href="/menu"
              className="px-8 py-3.5 rounded-full border border-[#C88A4B] text-[#C88A4B] hover:bg-[#C88A4B] hover:text-[#0C0D0B] text-xs sm:text-sm font-semibold tracking-wider uppercase transition-all duration-300 shadow-md active:scale-[0.98]"
            >
              {t("home.ctaMenu")}
            </Link>
            <Link href="/space"
              className="px-8 py-3.5 rounded-full border border-[#FDFBF7]/40 text-[#FDFBF7] hover:border-[#2D4A3E] hover:bg-[#2D4A3E] text-xs sm:text-sm font-semibold tracking-wider uppercase transition-all duration-300 active:scale-[0.98]"
            >
              {t("home.ctaSpace")}
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* ── 2. EXPERIENCES ── */}
      <section className="py-24 px-6 sm:px-12 max-w-7xl mx-auto relative z-10">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={stagger}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12"
        >
          <div className="space-y-2">
            <motion.span variants={fadeUp} custom={0} className="text-xs font-mono uppercase tracking-[0.25em] text-[#C88A4B] font-semibold block">
              {t("home.experienceTag")}
            </motion.span>
            <motion.h2 variants={fadeUp} custom={1} className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#FDFBF7]">
              {t("home.experienceTitle")}
            </motion.h2>
          </div>
          <motion.div variants={fadeUp} custom={2}>
            <Link href="/space" className="inline-flex items-center gap-2 text-xs sm:text-sm text-[#C88A4B] hover:underline">
              <span>{t("home.experienceLink")}</span>
              <ArrowRight size={14} />
            </Link>
          </motion.div>
        </motion.div>

        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={stagger}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {EXP_KEYS.map((exp, idx) => (
            <motion.div key={idx} variants={fadeUp} custom={idx} className="card-dark overflow-hidden flex flex-col group">
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#1A1D17]">
                <Image src={exp.image} alt={t(exp.titleKey)} fill sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
              </div>
              <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-mono tracking-widest text-[#C88A4B] uppercase block">{t(exp.subtitleKey)}</span>
                  <h3 className="font-serif text-xl font-bold text-[#FDFBF7] group-hover:text-[#C88A4B] transition-colors mt-1">{t(exp.titleKey)}</h3>
                  <p className="text-xs font-light text-[#FDFBF7]/70 leading-relaxed mt-2">{t(exp.descKey)}</p>
                </div>
                <div className="pt-4 border-t border-[#222520] flex items-center justify-between text-xs text-[#C88A4B]">
                  <span>{t("home.exploreMore")}</span>
                  <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── 3. FEATURED SIGNATURES ── */}
      <section className="py-24 px-6 sm:px-12 max-w-7xl mx-auto relative z-10 border-t border-[#222520]">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={stagger}
          className="text-center max-w-2xl mx-auto space-y-3 mb-14"
        >
          <motion.span variants={fadeUp} custom={0} className="text-xs font-mono uppercase tracking-[0.25em] text-[#C88A4B] font-semibold block">
            {t("home.signatureTag")}
          </motion.span>
          <motion.h2 variants={fadeUp} custom={1} className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#FDFBF7]">
            {t("home.signatureTitle")}
          </motion.h2>
          <motion.p variants={fadeUp} custom={2} className="text-xs sm:text-sm font-light text-[#FDFBF7]/70">
            {t("home.signatureDesc")}
          </motion.p>
        </motion.div>

        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={stagger}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {FEATURED_IDS.map(({ id, price, image }, idx) => {
            const item = tMenuItem(id);
            return (
              <motion.div key={id} variants={fadeUp} custom={idx} className="card-dark p-4 flex flex-col group overflow-hidden">
                <div className="relative aspect-square w-full rounded-xl overflow-hidden mb-3 bg-[#1A1D17]">
                  <Image src={image} alt={item.name} fill sizes="25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                </div>
                <div className="space-y-1.5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-baseline justify-between gap-1">
                      <h3 className="font-serif text-lg font-bold text-[#FDFBF7] group-hover:text-[#C88A4B] transition-colors">{item.name}</h3>
                      <span className="font-mono text-sm font-bold text-[#C88A4B] shrink-0">{formatPrice(price)}</span>
                    </div>
                    <p className="text-xs font-light text-[#FDFBF7]/70 leading-relaxed mt-1 line-clamp-2">{item.desc}</p>
                  </div>
                  <div className="pt-3 border-t border-[#222520] text-right">
                    <Link href="/menu" className="text-[11px] font-medium text-[#C88A4B] hover:underline inline-flex items-center gap-1">
                      <span>{t("home.viewMenuShort")}</span>
                      <ArrowRight size={11} />
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }} className="mt-12 text-center"
        >
          <Link href="/menu"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-full border border-[#C88A4B] text-[#C88A4B] hover:bg-[#C88A4B] hover:text-[#0C0D0B] text-xs sm:text-sm font-semibold uppercase tracking-wider transition-all"
          >
            <span>{t("home.viewMenuFull")}</span>
            <ArrowRight size={14} />
          </Link>
        </motion.div>
      </section>

      {/* ── 4. REVIEWS ── */}
      <section className="py-24 px-6 sm:px-12 max-w-4xl mx-auto relative z-10 border-t border-[#222520]">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={stagger}
          className="space-y-8 text-center"
        >
          <motion.span variants={fadeUp} custom={0} className="text-xs font-mono uppercase tracking-[0.25em] text-[#C88A4B] font-semibold block">
            {t("home.reviewTag")}
          </motion.span>
          <motion.h2 variants={fadeUp} custom={1} className="font-serif text-3xl sm:text-4xl font-bold text-[#FDFBF7]">
            {t("home.reviewTitle")}
          </motion.h2>

          <motion.div variants={fadeUp} custom={2} className="card-dark p-8 sm:p-12 relative">
            <div className="flex items-center justify-center gap-1 text-[#C88A4B] mb-4">
              {[...Array(5)].map((_, i) => <Star key={i} size={18} className="fill-[#C88A4B]" />)}
            </div>
            <p className="font-serif italic text-base sm:text-xl text-[#FDFBF7]/90 leading-relaxed max-w-2xl mx-auto">
              &ldquo;{t(`reviews.${rk}Comment`)}&rdquo;
            </p>
            <div className="mt-6 pt-4 border-t border-[#222520]">
              <p className="font-serif font-bold text-base text-[#FDFBF7]">{t(`reviews.${rk}Name`)}</p>
              <p className="text-xs text-[#C88A4B]">{t(`reviews.${rk}Role`)}</p>
            </div>
            <div className="flex items-center justify-center gap-3 mt-6">
              <button onClick={prevReview} aria-label="Previous"
                className="w-9 h-9 rounded-full border border-[#222520] flex items-center justify-center text-[#FDFBF7] hover:border-[#C88A4B] hover:text-[#C88A4B] transition-colors cursor-pointer"
              >
                <ChevronLeft size={16} />
              </button>
              <div className="flex gap-1.5">
                {REVIEW_KEYS.map((_, i) => (
                  <span key={i} onClick={() => setCurrentReview(i)}
                    className={`w-2 h-2 rounded-full cursor-pointer transition-all ${currentReview === i ? "w-6 bg-[#C88A4B]" : "bg-[#222520]"}`}
                  />
                ))}
              </div>
              <button onClick={nextReview} aria-label="Next"
                className="w-9 h-9 rounded-full border border-[#222520] flex items-center justify-center text-[#FDFBF7] hover:border-[#C88A4B] hover:text-[#C88A4B] transition-colors cursor-pointer"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
}
