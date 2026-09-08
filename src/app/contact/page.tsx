"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Navigation,
  ArrowUpRight,
  Compass,
  Car,
  ShieldCheck,
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

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const GOOGLE_MAPS_URL =
  "https://maps.google.com/?cid=10605553198031545365&q=C%E1%BA%A9m+C%C3%B9+House";

export default function ContactPage() {
  const { t } = useLanguage();

  const ENTRANCE_PARKING_PHOTOS = [
    {
      tag: t("contact.entrance1Tag"),
      title: t("contact.entrance1Title"),
      desc: t("contact.entrance1Desc"),
      image: "/uploads/gallery/1788250253566-618481408.jpg",
    },
    {
      tag: t("contact.entrance2Tag"),
      title: t("contact.entrance2Title"),
      desc: t("contact.entrance2Desc"),
      image: "/uploads/gallery/1788250253554-875120458.jpg",
    },
  ];

  return (
    <div className="w-full text-[#FDFBF7]">
      {/* 1. HEADER BANNER */}
      <section className="relative py-28 sm:py-36 px-6 sm:px-12 text-center border-b border-[#222520]">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="max-w-4xl mx-auto space-y-6"
        >
          <motion.span variants={fadeUp} custom={0} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1A1D17] border border-[#222520] text-xs font-mono text-[#C88A4B]">
            <Compass size={14} />
            <span>{t("contact.heroTag")}</span>
          </motion.span>

          <motion.h1 variants={fadeUp} custom={1} className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold text-[#FDFBF7] tracking-tight leading-tight">
            {t("contact.heroTitle1")} <br />
            <span className="text-[#C88A4B] italic">{t("contact.heroTitle2")}</span>
          </motion.h1>

          <motion.p variants={fadeUp} custom={2} className="text-base sm:text-lg font-light text-[#FDFBF7]/80 max-w-2xl mx-auto leading-relaxed">
            {t("contact.heroDesc")}
          </motion.p>
        </motion.div>
      </section>

      {/* 2. CONTACT INFO 4-COLUMN CARDS */}
      <section className="py-20 px-6 sm:px-12 max-w-7xl mx-auto relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {/* ADDRESS */}
          <motion.div variants={fadeUp} custom={0} className="card-dark p-7 rounded-3xl flex flex-col justify-between space-y-4 hover:border-[#C88A4B] transition-colors">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#1A1D17] border border-[#222520] flex items-center justify-center text-2xl">
                <span>📍</span>
              </div>
              <h3 className="font-serif font-bold text-lg text-[#FDFBF7]">
                {t("contact.addressTitle")}
              </h3>
              <p className="text-xs sm:text-sm font-light text-[#FDFBF7]/75 leading-relaxed">
                {t("contact.addressDesc")}
              </p>
            </div>
            <a
              href={GOOGLE_MAPS_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-[#C88A4B] hover:underline pt-2 border-t border-[#222520]"
            >
              <span>{t("contact.addressLink")}</span>
              <ArrowUpRight size={14} />
            </a>
          </motion.div>

          {/* HOTLINE */}
          <motion.div variants={fadeUp} custom={1} className="card-dark p-7 rounded-3xl flex flex-col justify-between space-y-4 hover:border-[#C88A4B] transition-colors">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#1A1D17] border border-[#222520] flex items-center justify-center text-2xl">
                <span>📞</span>
              </div>
              <h3 className="font-serif font-bold text-lg text-[#FDFBF7]">
                {t("contact.hotlineTitle")}
              </h3>
              <div className="space-y-2 pt-1">
                <a
                  href="tel:0382851688"
                  className="flex items-center justify-between p-2.5 rounded-xl bg-[#1A1D17] border border-[#222520] hover:border-[#C88A4B] transition-all group"
                >
                  <span className="text-xs sm:text-sm font-bold text-[#FDFBF7] group-hover:text-[#C88A4B]">
                    038 285 1688
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#2D4A3E] text-[#FDFBF7] font-medium">
                    {t("contact.phone1Label")}
                  </span>
                </a>
                <a
                  href="tel:0774659000"
                  className="flex items-center justify-between p-2.5 rounded-xl bg-[#1A1D17] border border-[#222520] hover:border-[#C88A4B] transition-all group"
                >
                  <span className="text-xs sm:text-sm font-bold text-[#FDFBF7] group-hover:text-[#C88A4B]">
                    077 465 9000
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#C88A4B] text-[#0C0D0B] font-bold">
                    {t("contact.phone2Label")}
                  </span>
                </a>
              </div>
            </div>
            <p className="text-[11px] text-[#C88A4B] border-t border-[#222520] pt-2 font-mono">
              {t("contact.hotlineSub")}
            </p>
          </motion.div>

          {/* HOURS */}
          <motion.div variants={fadeUp} custom={2} className="card-dark p-7 rounded-3xl flex flex-col justify-between space-y-4 hover:border-[#C88A4B] transition-colors">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#1A1D17] border border-[#222520] flex items-center justify-center text-2xl">
                <span>⏰</span>
              </div>
              <h3 className="font-serif font-bold text-lg text-[#FDFBF7]">
                {t("contact.hoursTitle")}
              </h3>
              <div className="space-y-2 text-xs sm:text-sm font-light text-[#FDFBF7]/80 leading-relaxed">
                <div className="p-2 rounded-xl bg-[#1A1D17] border border-[#222520]">
                  <p className="font-medium text-[#FDFBF7]">{t("contact.hours1Day")}</p>
                  <p className="text-[#C88A4B] font-mono font-semibold">{t("contact.hours1Time")}</p>
                </div>
                <div className="p-2 rounded-xl bg-[#1A1D17] border border-[#222520]">
                  <p className="font-medium text-[#FDFBF7]">{t("contact.hours2Day")}</p>
                  <p className="text-[#C88A4B] font-mono font-semibold">{t("contact.hours2Time")}</p>
                </div>
              </div>
            </div>
            <p className="text-[11px] text-[#C88A4B] border-t border-[#222520] pt-2 font-mono">
              {t("contact.hoursSub")}
            </p>
          </motion.div>

          {/* CHANNELS */}
          <motion.div variants={fadeUp} custom={3} className="card-dark p-7 rounded-3xl flex flex-col justify-between space-y-4 hover:border-[#C88A4B] transition-colors">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#1A1D17] border border-[#222520] flex items-center justify-center text-2xl">
                <span>💬</span>
              </div>
              <h3 className="font-serif font-bold text-lg text-[#FDFBF7]">
                {t("contact.channelTitle")}
              </h3>
              <div className="space-y-2 pt-1">
                <a
                  href="mailto:thuynhu8788@gmail.com"
                  className="block p-2 rounded-xl bg-[#1A1D17] border border-[#222520] text-xs text-[#FDFBF7]/80 hover:text-[#C88A4B] truncate"
                >
                  <span className="text-[#C88A4B] block text-[10px] font-mono">{t("contact.emailLabel")}</span>
                  thuynhu8788@gmail.com
                </a>
                <div className="grid grid-cols-3 gap-2 pt-1">
                  <a
                    href="https://www.facebook.com/share/1DVLMySW8H/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2 px-2 rounded-xl bg-[#1877F2]/20 hover:bg-[#1877F2]/30 text-[#1877F2] text-[11px] font-semibold text-center transition-colors truncate"
                  >
                    Facebook
                  </a>
                  <a
                    href="https://www.tiktok.com/@camcuhousedaknong"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2 px-2 rounded-xl bg-[#000000]/50 border border-[#222520] hover:bg-[#C88A4B]/20 hover:text-[#C88A4B] hover:border-[#C88A4B]/50 text-[#FDFBF7] text-[11px] font-semibold text-center transition-colors truncate"
                  >
                    TikTok
                  </a>
                  <a
                    href="https://youtube.com/@Cam_Cu_House"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2 px-2 rounded-xl bg-[#FF0000]/20 hover:bg-[#FF0000]/30 text-[#FF0000] text-[11px] font-semibold text-center transition-colors truncate"
                  >
                    YouTube
                  </a>
                </div>
              </div>
            </div>
            <p className="text-[11px] text-[#C88A4B] border-t border-[#222520] pt-2 font-mono">
              {t("contact.channelSub")}
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* 3. GOOGLE MAPS */}
      <section className="w-full border-t border-b border-[#222520] relative z-10 bg-[#0C0D0B]/90">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-7xl mx-auto px-6 sm:px-12 py-10 flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div className="space-y-1 text-center md:text-left">
            <span className="text-xs font-mono uppercase tracking-widest text-[#C88A4B] font-semibold">
              {t("contact.mapTag")}
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#FDFBF7]">
              {t("contact.mapTitle")}
            </h2>
            <p className="text-xs sm:text-sm font-light text-[#FDFBF7]/70">
              {t("contact.mapDesc")}
            </p>
          </div>

          <a
            href={GOOGLE_MAPS_URL}
            target="_blank"
            rel="noreferrer"
            className="px-8 py-4 rounded-full bg-[#C88A4B] hover:bg-[#b87c40] text-[#0C0D0B] text-sm sm:text-base font-bold shadow-lg transition-all duration-200 flex items-center gap-3 shrink-0 active:scale-[0.98]"
          >
            <Navigation size={18} />
            <span>{t("contact.mapBtn")}</span>
            <ArrowUpRight size={16} />
          </a>
        </motion.div>

        <div className="w-full h-[450px] relative bg-[#1A1D17]">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3893.045618491873!2d107.6877977!3d11.9902641!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3173f55097f4f033%3A0x89e02c0b5c1c015b!2zQ-G6q20gQ8O5IEhvdXNl!5e0!3m2!1svi!2s!4v1710000000000!5m2!1svi!2s" 
            className="w-full h-full border-0 grayscale-[30%] hover:grayscale-0 transition-all duration-500" 
            allowFullScreen 
            loading="lazy" 
            referrerPolicy="strict-origin-when-cross-origin"
          />
        </div>
      </section>

      {/* 4. ENTRANCE & PARKING */}
      <section className="py-24 px-6 sm:px-12 max-w-7xl mx-auto relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer}
          className="text-center max-w-2xl mx-auto space-y-3 mb-12"
        >
          <motion.span variants={fadeUp} custom={0} className="text-xs font-mono uppercase tracking-[0.25em] text-[#C88A4B] font-semibold block">
            {t("contact.parkingTag")}
          </motion.span>
          <motion.h2 variants={fadeUp} custom={1} className="font-serif text-3xl sm:text-4xl font-bold text-[#FDFBF7]">
            {t("contact.parkingTitle")}
          </motion.h2>
          <motion.p variants={fadeUp} custom={2} className="text-xs sm:text-sm font-light text-[#FDFBF7]/70">
            {t("contact.parkingDesc")}
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {ENTRANCE_PARKING_PHOTOS.map((spot, idx) => (
            <motion.div
              key={idx}
              variants={fadeUp}
              custom={idx}
              className="card-dark overflow-hidden p-5 rounded-3xl space-y-4 flex flex-col justify-between"
            >
              <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-[#1A1D17]">
                <Image
                  src={spot.image}
                  alt={spot.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover hover:scale-[1.04] transition-transform duration-500 ease-out"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#C88A4B]">
                  {idx === 0 ? <ShieldCheck size={16} /> : <Car size={16} />}
                  <span>{spot.tag}</span>
                </div>
                <h3 className="font-serif text-xl font-bold text-[#FDFBF7]">
                  {spot.title}
                </h3>
                <p className="text-xs sm:text-sm font-light text-[#FDFBF7]/70 leading-relaxed">
                  {spot.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>
    </div>
  );
}
