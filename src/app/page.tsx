"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  ArrowRight,
  Star,
  Sparkles,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { StaggerContainer, StaggerItem, MaskHeading } from "@/components/motion/ScrollReveal";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay: i * 0.1,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  }),
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

/* ── Featured signatures (ids match menu.ts for tMenuItem lookup) ── */
const FEATURED_IDS = [
  { id: "cf-3", price: 28000, image: "/uploads/gallery/1788250253554-875120458.jpg" },
  { id: "tr-5", price: 30000, image: "/uploads/gallery/1788250253564-115851131.jpg" },
  { id: "cf-5", price: 30000, image: "/uploads/gallery/1788250253560-200373033.jpg" },
  { id: "tr-10", price: 28000, image: "/uploads/gallery/1788250253562-580915883.jpg" },
];

/* ── Experience keys (3 thẻ Trải nghiệm Đắk Nông) ── */
const EXP_KEYS = [
  {
    subtitleKey: "home.exp1Subtitle",
    titleKey: "home.exp1Title",
    descKey: "home.exp1Desc",
    image: "/uploads/gallery/1788250253551-943009233.jpg",
  },
  {
    subtitleKey: "home.exp2Subtitle",
    titleKey: "home.exp2Title",
    descKey: "home.exp2Desc",
    image: "/uploads/gallery/1788250253554-875120458.jpg",
  },
  {
    subtitleKey: "home.exp3Subtitle",
    titleKey: "home.exp3Title",
    descKey: "home.exp3Desc",
    image: "/uploads/gallery/1788250253557-29323827.jpg",
  },
];

/* ── Review keys ── */
const REVIEW_KEYS = ["r1", "r2", "r3"] as const;

export default function HomePage() {
  const { t, formatPrice, tMenuItem } = useLanguage();
  const [currentReview, setCurrentReview] = useState(0);

  // ═══ 1. THỊ SAI ĐA TẦNG TOÀN TRANG (MULTI-PLANE PARALLAX) ═══
  const { scrollY } = useScroll();

  // Hero Parallax: Nền trôi chậm (0.3x), chữ tốc độ chuẩn (1.0x), tiền cảnh nhanh hơn (1.25x)
  const heroBgParallax = useTransform(scrollY, [0, 900], [0, 260]);
  const heroScale      = useTransform(scrollY, [0, 800], [1, 0.92]);
  const heroOpacity    = useTransform(scrollY, [0, 500], [1, 0]);
  const heroFgParallax = useTransform(scrollY, [0, 900], [0, -65]);

  // Section 2: Experiences container scroll trigger
  const expSectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: expScrollProgress } = useScroll({
    target: expSectionRef,
    offset: ["start end", "end start"],
  });

  // Thị sai nền vs tiền cảnh Experiences
  const expBgParallax = useTransform(expScrollProgress, [0, 1], [-80, 80]);
  const expFgParallax = useTransform(expScrollProgress, [0, 1], [35, -35]);

  // ═══ 3. XÒE THẺ 3D KHI CUỘN TỚI (SCROLL CARD FAN-OUT) ═══
  // Thẻ 1 nghiêng -2deg, Thẻ 2 đứng thẳng, Thẻ 3 nghiêng 2deg, sau đó duỗi phẳng cân bằng khi cuộn tiếp
  const card1Rotate = useTransform(expScrollProgress, [0.1, 0.38, 0.65], [0, -2, 0]);
  const card1X      = useTransform(expScrollProgress, [0.1, 0.38, 0.65], [0, -8, 0]);
  const card1Y      = useTransform(expScrollProgress, [0.1, 0.38, 0.65], [12, 2, 0]);

  const card2Rotate = useTransform(expScrollProgress, [0.1, 0.38, 0.65], [0, 0, 0]);
  const card2Y      = useTransform(expScrollProgress, [0.1, 0.38, 0.65], [16, -6, 0]);

  const card3Rotate = useTransform(expScrollProgress, [0.1, 0.38, 0.65], [0, 2, 0]);
  const card3X      = useTransform(expScrollProgress, [0.1, 0.38, 0.65], [0, 8, 0]);
  const card3Y      = useTransform(expScrollProgress, [0.1, 0.38, 0.65], [12, 2, 0]);

  // Section 3: Signatures container scroll trigger
  const sigSectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: sigScrollProgress } = useScroll({
    target: sigSectionRef,
    offset: ["start end", "end start"],
  });
  const sigBgParallax = useTransform(sigScrollProgress, [0, 1], [-90, 90]);
  const sigFgParallax = useTransform(sigScrollProgress, [0, 1], [25, -25]);

  const nextReview = () => setCurrentReview((p) => (p + 1) % REVIEW_KEYS.length);
  const prevReview = () => setCurrentReview((p) => (p - 1 + REVIEW_KEYS.length) % REVIEW_KEYS.length);
  const rk = REVIEW_KEYS[currentReview];

  return (
    <div className="w-full text-[#FDFBF7] overflow-x-hidden">
      {/* ── 1. HERO (MULTI-PLANE PARALLAX + KINETIC MASK REVEAL) ── */}
      <section className="relative min-h-[90vh] sm:min-h-screen flex items-center justify-center px-6 sm:px-12 py-20 overflow-hidden">
        {/* Lớp nền trôi chậm (0.3x) */}
        <motion.div
          style={{ y: heroBgParallax }}
          className="absolute inset-0 z-0 pointer-events-none"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-[#0C0D0B]/30 via-transparent to-[#0C0D0B]/85" />
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] max-w-[600px] max-h-[600px] rounded-full bg-[#C88A4B]/10 blur-[140px]" />
        </motion.div>

        {/* Nội dung tiêu chuẩn (1.0x) */}
        <motion.div
          style={{ scale: heroScale, opacity: heroOpacity }}
          className="relative z-10 max-w-5xl mx-auto w-full text-center space-y-8"
        >
          {/* Badge tiền cảnh nổi bật (1.25x) */}
          <motion.div style={{ y: heroFgParallax }}>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.05 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1A1D17]/80 border border-[#222520] text-xs font-mono font-medium text-[#C88A4B]"
            >
              <Sparkles size={14} />
              <span>{t("home.heroTag")}</span>
            </motion.div>
          </motion.div>

          {/* Hero Main Heading: Always visible & prominent with 0.1s crisp delay */}
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            style={{ transform: "translate3d(0,0,0)", willChange: "transform, opacity" }}
            className="font-serif text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tight text-[#FDFBF7] leading-[1.08] relative z-10"
          >
            {t("home.title")}
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            style={{ transform: "translate3d(0,0,0)", willChange: "transform, opacity" }}
            className="text-base sm:text-xl font-light text-[#FDFBF7]/85 max-w-2xl mx-auto leading-relaxed relative z-10"
          >
            {t("home.subtitle")}
          </motion.p>

          {/* CTA Buttons tiền cảnh (1.25x) */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            style={{ transform: "translate3d(0,0,0)" }}
            className="pt-4 flex flex-wrap items-center justify-center gap-4"
          >
            <Link
              href="/menu"
              className="relative px-8 py-3.5 rounded-full border border-[#C88A4B] text-[#C88A4B] hover:bg-[#C88A4B] hover:text-[#0C0D0B] text-xs sm:text-sm font-semibold tracking-wider uppercase transition-all duration-300 shadow-md active:scale-[0.98] group"
            >
              <span className="absolute inset-0 rounded-full border border-[#C88A4B] animate-ping opacity-20 pointer-events-none" />
              {t("home.ctaMenu")}
            </Link>
            <Link
              href="/space"
              className="px-8 py-3.5 rounded-full border border-[#FDFBF7]/40 text-[#FDFBF7] hover:border-[#2D4A3E] hover:bg-[#2D4A3E] text-xs sm:text-sm font-semibold tracking-wider uppercase transition-all duration-300 active:scale-[0.98]"
            >
              {t("home.ctaSpace")}
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* ── 2. EXPERIENCES (SCROLL CARD FAN-OUT & MULTI-PLANE PARALLAX) ── */}
      <section
        ref={expSectionRef}
        className="py-24 px-6 sm:px-12 max-w-7xl mx-auto relative z-10"
      >
        {/* Lớp nền thị sai trôi chậm (0.3x) */}
        <motion.div
          style={{ y: expBgParallax }}
          className="absolute -top-10 left-1/4 w-[45vw] h-[45vw] rounded-full bg-[#2D4A3E]/15 blur-[120px] pointer-events-none z-0"
        />

        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-14 relative z-10">
          <div className="space-y-2">
            <motion.span
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1, margin: "100px 0px" }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="text-xs font-mono uppercase tracking-[0.25em] text-[#C88A4B] font-semibold block"
            >
              {t("home.experienceTag")}
            </motion.span>
            <MaskHeading as="h2" className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#FDFBF7]">
              {t("home.experienceTitle")}
            </MaskHeading>
          </div>

          {/* Tiền cảnh trôi nhanh hơn (1.25x) */}
          <motion.div
            style={{ y: expFgParallax }}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1, margin: "100px 0px" }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Link
              href="/space"
              className="inline-flex items-center gap-2 text-xs sm:text-sm text-[#C88A4B] hover:underline"
            >
              <span>{t("home.experienceLink")}</span>
              <ArrowRight size={14} />
            </Link>
          </motion.div>
        </div>

        {/* 3 THẺ TRẢI NGHIỆM ĐẮK NÔNG (STAGGERED REVEAL & HOVER LIFT & GLOW) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
          {EXP_KEYS.map((exp, idx) => {
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15, margin: "0px 0px -40px 0px" }}
                transition={{
                  duration: 0.65,
                  delay: idx * 0.12, // Stagger 0s - 0.12s - 0.24s
                  ease: [0.25, 1, 0.5, 1],
                }}
                whileHover={{
                  y: -6,
                  transition: { duration: 0.25, ease: "easeOut" },
                }}
                style={{ transform: "translate3d(0,0,0)", willChange: "transform, opacity" }}
                className="card-dark overflow-hidden flex flex-col group p-2 border border-white/5 hover:border-[#C88A4B]/40 hover:shadow-[0_0_25px_rgba(200,138,75,0.25)] transition-all duration-500 cursor-pointer rounded-3xl"
              >
                <div className="relative w-full h-52 sm:h-60 overflow-hidden rounded-2xl bg-[#1A1D17]">
                  <Image
                    src={exp.image}
                    alt={t(exp.titleKey)}
                    fill
                    priority={idx === 0}
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-black/20 pointer-events-none" />
                </div>
                <div className="p-4 sm:p-6 space-y-3 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-mono tracking-widest text-[#C88A4B] uppercase block">
                      {t(exp.subtitleKey)}
                    </span>
                    <div className="overflow-hidden">
                      <h3 className="font-serif text-xl font-bold text-[#FDFBF7] group-hover:text-[#C88A4B] transition-colors mt-1">
                        {t(exp.titleKey)}
                      </h3>
                    </div>
                    <p className="text-xs font-light text-[#FDFBF7]/70 leading-relaxed mt-2">
                      {t(exp.descKey)}
                    </p>
                  </div>
                  <div className="pt-4 border-t border-[#222520] flex items-center justify-between text-xs text-[#C88A4B]">
                    <span>{t("home.exploreMore")}</span>
                    <ArrowRight
                      size={13}
                      className="group-hover:translate-x-1.5 transition-transform"
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ── 3. FEATURED SIGNATURES (MULTI-PLANE PARALLAX & KINETIC REVEAL) ── */}
      <section
        ref={sigSectionRef}
        className="py-24 px-6 sm:px-12 max-w-7xl mx-auto relative z-10 border-t border-[#222520]"
      >
        {/* Lớp nền trôi chậm (0.3x) */}
        <motion.div
          style={{ y: sigBgParallax }}
          className="absolute top-1/4 -right-10 w-[50vw] h-[50vw] rounded-full bg-[#C88A4B]/10 blur-[130px] pointer-events-none z-0"
        />

        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-14 relative z-10">
          <motion.span
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1, margin: "100px 0px" }}
            transition={{ duration: 0.5 }}
            className="text-xs font-mono uppercase tracking-[0.25em] text-[#C88A4B] font-semibold block"
          >
            {t("home.signatureTag")}
          </motion.span>
          <MaskHeading as="h2" className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#FDFBF7]">
            {t("home.signatureTitle")}
          </MaskHeading>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1, margin: "100px 0px" }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="text-xs sm:text-sm font-light text-[#FDFBF7]/70"
          >
            {t("home.signatureDesc")}
          </motion.p>
        </div>

        {/* Thẻ món đặc trưng: StaggerContainer & StaggerItem */}
        <StaggerContainer
          amount={0.1}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10"
        >
          {FEATURED_IDS.map(({ id, price, image }) => {
            const item = tMenuItem(id);
            return (
              <StaggerItem
                key={id}
                className="card-dark p-4 flex flex-col group overflow-hidden border border-white/5 hover:border-[#C88A4B]/40 hover:shadow-[0_0_20px_rgba(200,138,75,0.15)] transition-all duration-500 rounded-2xl"
              >
                <div className="relative aspect-square w-full rounded-xl overflow-hidden mb-3 bg-[#1A1D17]">
                  <Image
                    src={image}
                    alt={item.name}
                    fill
                    sizes="25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                </div>
                <div className="space-y-1.5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-baseline justify-between gap-1">
                      <h3 className="font-serif text-lg font-bold text-[#FDFBF7] group-hover:text-[#C88A4B] transition-colors">
                        {item.name}
                      </h3>
                      <span className="font-mono text-sm font-bold text-[#C88A4B] shrink-0">
                        {formatPrice(price)}
                      </span>
                    </div>
                    <p className="text-xs font-light text-[#FDFBF7]/70 leading-relaxed mt-1 line-clamp-2">
                      {item.desc}
                    </p>
                  </div>
                  <div className="pt-3 border-t border-[#222520] text-right">
                    <Link
                      href="/menu"
                      className="text-[11px] font-medium text-[#C88A4B] hover:underline inline-flex items-center gap-1"
                    >
                      <span>{t("home.viewMenuShort")}</span>
                      <ArrowRight size={11} />
                    </Link>
                  </div>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerContainer>

        {/* CTA Button tiền cảnh trôi nhanh (1.25x) */}
        <motion.div
          style={{ y: sigFgParallax }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="mt-14 text-center relative z-10"
        >
          <Link
            href="/menu"
            className="relative inline-flex items-center gap-2 px-8 py-3 rounded-full border border-[#C88A4B] text-[#C88A4B] hover:bg-[#C88A4B] hover:text-[#0C0D0B] text-xs sm:text-sm font-semibold uppercase tracking-wider transition-all group"
          >
            <span className="absolute inset-0 rounded-full border border-[#C88A4B] animate-ping opacity-20 pointer-events-none" />
            <span>{t("home.viewMenuFull")}</span>
            <ArrowRight size={14} />
          </Link>
        </motion.div>
      </section>

      {/* ── 4. REVIEWS ── */}
      <section className="py-24 px-6 sm:px-12 max-w-4xl mx-auto relative z-10 border-t border-[#222520]">
        <div className="space-y-8 text-center">
          <div className="space-y-2">
            <motion.span
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1, margin: "100px 0px" }}
              transition={{ duration: 0.5 }}
              className="text-xs font-mono uppercase tracking-[0.25em] text-[#C88A4B] font-semibold block"
            >
              {t("home.reviewTag")}
            </motion.span>
            <MaskHeading as="h2" className="font-serif text-3xl sm:text-4xl font-bold text-[#FDFBF7]">
              {t("home.reviewTitle")}
            </MaskHeading>
          </div>

          <motion.div
            variants={fadeUp}
            custom={2}
            className="card-dark p-8 sm:p-12 relative shadow-lg"
          >
            <div className="flex items-center justify-center gap-1 text-[#C88A4B] mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={18} className="fill-[#C88A4B]" />
              ))}
            </div>
            <p className="font-serif italic text-base sm:text-xl text-[#FDFBF7]/90 leading-relaxed max-w-2xl mx-auto">
              &ldquo;{t(`reviews.${rk}Comment`)}&rdquo;
            </p>
            <div className="mt-6 pt-4 border-t border-[#222520]">
              <p className="font-serif font-bold text-base text-[#FDFBF7]">
                {t(`reviews.${rk}Name`)}
              </p>
              <p className="text-xs text-[#C88A4B]">{t(`reviews.${rk}Role`)}</p>
            </div>
            <div className="flex items-center justify-center gap-3 mt-6">
              <button
                onClick={prevReview}
                aria-label="Previous"
                className="w-9 h-9 rounded-full border border-[#222520] flex items-center justify-center text-[#FDFBF7] hover:border-[#C88A4B] hover:text-[#C88A4B] transition-colors cursor-pointer"
              >
                <ChevronLeft size={16} />
              </button>
              <div className="flex gap-1.5">
                {REVIEW_KEYS.map((_, i) => (
                  <span
                    key={i}
                    onClick={() => setCurrentReview(i)}
                    className={`w-2 h-2 rounded-full cursor-pointer transition-all ${
                      currentReview === i ? "w-6 bg-[#C88A4B]" : "bg-[#222520]"
                    }`}
                  />
                ))}
              </div>
              <button
                onClick={nextReview}
                aria-label="Next"
                className="w-9 h-9 rounded-full border border-[#222520] flex items-center justify-center text-[#FDFBF7] hover:border-[#C88A4B] hover:text-[#C88A4B] transition-colors cursor-pointer"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
