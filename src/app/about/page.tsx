"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Compass, ArrowRight, Users } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.6, delay: i * 0.12 } }),
};
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };

const VALUE_EMOJIS = ["☕", "🌿", "❤️"];

export default function AboutPage() {
  const { t } = useLanguage();

  return (
    <div className="w-full text-[#FDFBF7]">
      {/* ── 1. BANNER ── */}
      <section className="relative py-28 sm:py-36 px-6 sm:px-12 flex items-center justify-center text-center overflow-hidden border-b border-[#222520]">
        <motion.div initial="hidden" animate="visible" variants={stagger} className="relative z-10 max-w-4xl mx-auto space-y-6">
          <motion.span variants={fadeUp} custom={0}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1A1D17] border border-[#222520] text-xs font-mono text-[#C88A4B]"
          >
            <Compass size={14} />
            <span>{t("about.heroTag")}</span>
          </motion.span>

          <motion.h1 variants={fadeUp} custom={1}
            className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold text-[#FDFBF7] tracking-tight leading-tight"
          >
            {t("about.heroTitle1")} <br />
            <span className="text-[#C88A4B] italic">{t("about.heroTitle2")}</span>
          </motion.h1>

          <motion.p variants={fadeUp} custom={2}
            className="text-base sm:text-lg font-light text-[#FDFBF7]/80 max-w-2xl mx-auto leading-relaxed"
          >
            {t("about.heroDesc")}
          </motion.p>
        </motion.div>
      </section>

      {/* ── 2. Z-SHAPE CHAPTERS ── */}
      <section className="py-24 sm:py-32 px-6 sm:px-12 max-w-7xl mx-auto space-y-28 sm:space-y-36 relative z-10">

        {/* Chapter 1 */}
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={stagger}
          className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center"
        >
          <motion.div variants={fadeUp} custom={0} className="lg:col-span-6 relative aspect-[4/3] rounded-3xl overflow-hidden border border-[#222520] shadow-xl bg-[#1A1D17]">
            <Image src="/uploads/gallery/1788250253551-943009233.jpg" alt={t("about.ch1Title")} fill sizes="50vw"
              className="object-cover hover:scale-[1.04] transition-transform duration-700 ease-out"
            />
          </motion.div>
          <motion.div variants={fadeUp} custom={1} className="lg:col-span-6 space-y-4">
            <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#C88A4B] font-semibold">{t("about.ch1Tag")}</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#FDFBF7]">{t("about.ch1Title")}</h2>
            <p className="text-sm sm:text-base font-light text-[#FDFBF7]/75 leading-relaxed">{t("about.ch1p1")}</p>
            <p className="text-sm sm:text-base font-light text-[#FDFBF7]/75 leading-relaxed">{t("about.ch1p2")}</p>
          </motion.div>
        </motion.div>

        {/* Chapter 2 */}
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={stagger}
          className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center"
        >
          <motion.div variants={fadeUp} custom={0} className="lg:col-span-6 space-y-4 order-2 lg:order-1">
            <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#C88A4B] font-semibold">{t("about.ch2Tag")}</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#FDFBF7]">{t("about.ch2Title")}</h2>
            <p className="text-sm sm:text-base font-light text-[#FDFBF7]/75 leading-relaxed">{t("about.ch2p1")}</p>
            <p className="text-sm sm:text-base font-light text-[#FDFBF7]/75 leading-relaxed">{t("about.ch2p2")}</p>
          </motion.div>
          <motion.div variants={fadeUp} custom={1} className="lg:col-span-6 relative aspect-[4/3] rounded-3xl overflow-hidden border border-[#222520] shadow-xl order-1 lg:order-2 bg-[#1A1D17]">
            <Image src="/uploads/gallery/1788250253557-29323827.jpg" alt={t("about.ch2Title")} fill sizes="50vw"
              className="object-cover hover:scale-[1.04] transition-transform duration-700 ease-out"
            />
          </motion.div>
        </motion.div>

        {/* Chapter 3 */}
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={stagger}
          className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center"
        >
          <motion.div variants={fadeUp} custom={0} className="lg:col-span-6 relative aspect-[4/3] rounded-3xl overflow-hidden border border-[#222520] shadow-xl bg-[#1A1D17]">
            <Image src="/uploads/gallery/1788250253560-200373033.jpg" alt={t("about.ch3Title")} fill sizes="50vw"
              className="object-cover hover:scale-[1.04] transition-transform duration-700 ease-out"
            />
          </motion.div>
          <motion.div variants={fadeUp} custom={1} className="lg:col-span-6 space-y-4">
            <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#C88A4B] font-semibold">{t("about.ch3Tag")}</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#FDFBF7]">{t("about.ch3Title")}</h2>
            <p className="text-sm sm:text-base font-light text-[#FDFBF7]/75 leading-relaxed">{t("about.ch3p1")}</p>
            <p className="text-sm sm:text-base font-light text-[#FDFBF7]/75 leading-relaxed">{t("about.ch3p2")}</p>
          </motion.div>
        </motion.div>
      </section>

      {/* ── 3. CORE VALUES ── */}
      <section className="py-24 px-6 sm:px-12 border-t border-b border-[#222520] relative z-10">
        <div className="max-w-7xl mx-auto space-y-12">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={stagger}
            className="text-center max-w-2xl mx-auto space-y-3"
          >
            <motion.span variants={fadeUp} custom={0} className="text-xs font-mono uppercase tracking-[0.25em] text-[#C88A4B] font-semibold block">
              {t("about.valuesTag")}
            </motion.span>
            <motion.h2 variants={fadeUp} custom={1} className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#FDFBF7]">
              {t("about.valuesTitle")}
            </motion.h2>
            <motion.p variants={fadeUp} custom={2} className="text-sm font-light text-[#FDFBF7]/70">
              {t("about.valuesDesc")}
            </motion.p>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={stagger}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {([1, 2, 3] as const).map((n, idx) => (
              <motion.div key={n} variants={fadeUp} custom={idx}
                className="card-dark p-8 rounded-3xl flex flex-col justify-between space-y-6 hover:border-[#C88A4B] transition-colors"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-xl bg-[#1A1D17] border border-[#222520] flex items-center justify-center text-xl">
                      {VALUE_EMOJIS[idx]}
                    </div>
                    <span className="text-xs font-mono font-bold text-[#C88A4B]">{t(`about.val${n}Step`)}</span>
                  </div>
                  <h3 className="font-serif text-xl font-bold text-[#FDFBF7]">{VALUE_EMOJIS[idx]} {t(`about.val${n}Title`)}</h3>
                  <p className="text-xs sm:text-sm font-light text-[#FDFBF7]/70 leading-relaxed">{t(`about.val${n}Desc`)}</p>
                </div>
                <div className="pt-4 border-t border-[#222520] text-xs font-mono text-[#C88A4B]">{t("about.valCommit")}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── 4. TEAM ── */}
      <section className="py-24 px-6 sm:px-12 max-w-7xl mx-auto relative z-10">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={stagger}
          className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center card-dark p-8 sm:p-14 rounded-3xl border border-[#222520]"
        >
          <motion.div variants={fadeUp} custom={0} className="lg:col-span-6 relative aspect-[4/3] rounded-2xl overflow-hidden border border-[#222520] bg-[#1A1D17]">
            <Image src="/uploads/gallery/1788250253554-875120458.jpg" alt={t("about.teamTitle")} fill sizes="50vw" className="object-cover" />
          </motion.div>

          <motion.div variants={fadeUp} custom={1} className="lg:col-span-6 space-y-5">
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#C88A4B] font-semibold">
              <Users size={14} /><span>{t("about.teamTag")}</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#FDFBF7]">{t("about.teamTitle")}</h2>
            <p className="text-sm sm:text-base font-light text-[#FDFBF7]/75 leading-relaxed">{t("about.teamDesc")}</p>
            <blockquote className="p-4 rounded-xl bg-[#1A1D17] border-l-4 border-[#C88A4B] italic text-xs sm:text-sm font-serif text-[#FDFBF7]">
              &ldquo;{t("about.teamQuote")}&rdquo;
            </blockquote>
            <div className="pt-2">
              <Link href="/contact"
                className="inline-flex items-center gap-2 px-7 py-3 rounded-full border border-[#C88A4B] text-[#C88A4B] hover:bg-[#C88A4B] hover:text-[#0C0D0B] text-xs sm:text-sm font-semibold uppercase tracking-wider transition-colors"
              >
                <span>{t("about.teamCta")}</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
}
