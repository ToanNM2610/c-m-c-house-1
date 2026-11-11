"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import OpenStatusBadge from "@/components/OpenStatusBadge";
import { CAM_CU_HOUSE_INFO } from "@/data/camCuHouseData";
import {
  Compass,
  ArrowRight,
  Navigation,
  PhoneCall,
  CheckCircle2,
  Sparkles,
  MapPin,
} from "lucide-react";

export default function EditorialHero() {
  const { locale } = useLanguage();
  const isVi = locale !== "en";

  return (
    <section className="relative w-full pt-32 sm:pt-40 pb-20 px-5 sm:px-10 border-b border-[var(--border-subtle)] bg-[var(--bg-primary)] text-[var(--text-primary)] overflow-hidden transition-colors">
      {/* Background ambient texture */}
      <div
        className="pointer-events-none absolute -top-40 right-0 w-[550px] h-[550px] rounded-full bg-[var(--accent-botanical)] opacity-10 blur-3xl"
        aria-hidden="true"
      />

      <div className="w-full max-w-[1360px] mx-auto relative z-10 flex flex-col gap-10">
        {/* Top Masthead metadata bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[var(--border-subtle)]">
          <div className="flex items-center gap-3">
            <span className="label-uppercase-12 font-mono text-[var(--accent-botanical)]">
              [EST. 2024]
            </span>
            <span className="text-[var(--text-secondary)] font-mono text-xs">
              {CAM_CU_HOUSE_INFO.coordinates.display} · Đắk Nông
            </span>
          </div>

          <OpenStatusBadge />
        </div>

        {/* Editorial Magazine Cover Hero */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-end">
          <div className="lg:col-span-8 flex flex-col gap-5">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 font-mono text-[13px] uppercase tracking-widest text-[var(--accent-warm)] font-bold"
            >
              <Compass className="w-4 h-4 text-[var(--accent-warm)]" />
              <span>
                {isVi
                  ? "CÀ PHÊ SINH THÁI BÊN BỜ SUỐI ĐẮK NÔNG"
                  : "HIGHLAND STREAM ECO SANCTUARY & ARTISAN COFFEE"}
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-display font-black text-[clamp(42px,6.8vw,88px)] tracking-tight leading-[1.08] text-[var(--text-primary)]"
            >
              CẨM CÙ HOUSE
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-[18px] sm:text-[21px] text-[var(--text-secondary)] max-w-2xl font-serif italic leading-relaxed"
            >
              {isVi
                ? "Bên dòng suối nhỏ • Hẻm 437 Hùng Vương, Gia Nghĩa"
                : "Beside the Boulder Stream • Alley 437 Hung Vuong, Gia Nghia"}
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="text-[15px] sm:text-[16px] text-[var(--text-secondary)] max-w-2xl leading-relaxed"
            >
              {CAM_CU_HOUSE_INFO.tagline}.{" "}
              {isVi
                ? "Hòa mình cùng thanh âm suối chảy róc rách, bóng râm cổ thụ và tách cà phê Robusta rang củi mộc nguyên bản."
                : "Embrace the soothing melody of natural flowing water, centuries-old tree shade, and pure artisanal firewood-roasted Robusta coffee."}
            </motion.p>

            {/* DUAL CTA BUTTONS */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap items-center gap-4 pt-4"
            >
              <a
                href="#menu-section"
                className="btn-cta-primary px-6 py-3.5 text-[15px] rounded-full inline-flex items-center gap-2"
              >
                <span>{isVi ? "Khám phá Thực đơn (67 Món)" : "Explore Menu (67 Items)"}</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href={CAM_CU_HOUSE_INFO.socials.googleMaps}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-cta-secondary px-6 py-3.5 text-[15px] rounded-full inline-flex items-center gap-2"
              >
                <Navigation className="w-4 h-4" />
                <span>{isVi ? "Chỉ đường Google Maps" : "Directions on Google Maps"}</span>
              </a>

              <a
                href={CAM_CU_HOUSE_INFO.contacts.primaryTel}
                className="px-5 py-3.5 text-[14px] font-mono text-[var(--text-primary)] hover:text-[var(--accent-warm)] transition-colors inline-flex items-center gap-2"
              >
                <PhoneCall className="w-4 h-4 text-[var(--accent-warm)]" />
                <span>Hotline: {CAM_CU_HOUSE_INFO.contacts.formattedPhones[0]}</span>
              </a>
            </motion.div>
          </div>

          {/* Social Proof & Local Specs Card */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <div className="p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex flex-col gap-5 shadow-sm">
              {/* 100% Social Proof */}
              <div className="flex items-start gap-3.5 pb-4 border-b border-[var(--border-subtle)]">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div className="flex flex-col">
                  <span className="font-mono text-xs uppercase text-[var(--accent-warm)] font-bold tracking-wider">
                    {isVi ? "TÍN NHIỆM THỰC TẾ" : "AUTHENTIC SOCIAL PROOF"}
                  </span>
                  <p className="font-display font-black text-[22px] text-[var(--text-primary)] leading-tight mt-0.5">
                    100% Đề Xuất
                  </p>
                  <span className="text-[13px] text-[var(--text-secondary)]">
                    {isVi
                      ? "Dựa trên 8/8 lượt đánh giá hài lòng từ khách trải nghiệm"
                      : "Based on 8/8 verified authentic customer recommendations"}
                  </span>
                </div>
              </div>

              {/* Local Key Coordinates */}
              <div className="flex flex-col gap-2.5 text-[14px]">
                <div className="flex items-start gap-2 text-[var(--text-secondary)]">
                  <MapPin className="w-4 h-4 text-[var(--accent-botanical)] shrink-0 mt-0.5" />
                  <span>{CAM_CU_HOUSE_INFO.address.fullAddress}</span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[var(--border-subtle)] font-mono text-xs text-[var(--text-secondary)]">
                  <span>{isVi ? "Thứ 2 – Thứ 5" : "Mon – Thu"}</span>
                  <span className="font-bold text-[var(--text-primary)]">07:00 – 18:00</span>
                </div>

                <div className="flex items-center justify-between font-mono text-xs text-[var(--text-secondary)]">
                  <span>{isVi ? "Thứ 6 – Chủ Nhật" : "Fri – Sun"}</span>
                  <span className="font-bold text-[var(--accent-warm)]">07:00 – 22:00</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
