"use client";

import React from "react";
import { motion } from "framer-motion";

interface PageDarkHeroProps {
  badges: string[];
  h1Main: string;
  h1Accent?: string;
  subtitle?: string;
  backgroundImage: string;
  videoSrc?: string;
  children?: React.ReactNode;
}

export default function PageDarkHero({
  badges,
  h1Main,
  h1Accent,
  subtitle,
  backgroundImage,
  videoSrc,
  children,
}: PageDarkHeroProps) {
  return (
    <section className="hero-dark-surface relative flex min-h-[68vh] flex-col justify-end overflow-hidden pb-14 pt-36 lg:min-h-[76vh]">
      {/* 8. Video / Ảnh nền rõ nét + lớp phủ tối .50 đảm bảo tương phản >= 4.5:1 (Mục 1, 3, 8) */}
      {videoSrc ? (
        <video
          autoPlay
          muted
          loop
          playsInline
          poster={backgroundImage}
          className="absolute inset-0 h-full w-full object-cover opacity-75"
        >
          <source src={videoSrc} type="video/mp4" />
        </video>
      ) : (
        <img
          src={backgroundImage}
          alt={h1Main}
          fetchPriority="high"
          className="absolute inset-0 h-full w-full object-cover opacity-75"
        />
      )}

      {/* Lớp phủ tối .50 - .65 đảm bảo tương phản chữ #F2EDE4 luôn >= 4.5:1 */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-[#0A0E0C] via-[#0A0E0C]/55 to-[#0A0E0C]/60"
      />

      {/* Nội dung chính với hiệu ứng chữ mềm mại điện ảnh */}
      <div className="relative z-10 mx-auto w-full max-w-[1360px] px-5 lg:px-14">
        {/* Badges xuất hiện mượt mà */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="flex flex-wrap gap-2.5"
        >
          {badges.map((badge) => (
            <span
              key={badge}
              className="text-mono-label chamfer-14 border border-[var(--line-on-dark)] bg-[#0A0E0C]/65 px-3.5 py-1.5 text-[var(--ink-on-dark)] backdrop-blur-md"
            >
              {badge}
            </span>
          ))}
        </motion.div>

        {/* 1. H1 hiệu ứng reveal điện ảnh, tách dòng rõ ràng, không đè chữ, không mất chữ */}
        <motion.h1
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="font-display font-black text-[clamp(32px,5.2vw,74px)] uppercase tracking-tight text-[var(--ink-on-dark)] leading-[1.18] pt-1 mt-5"
        >
          <span className="block">{h1Main}</span>
          {h1Accent && (
            <span
              className="block font-bold text-[clamp(28px,4.5vw,58px)] mt-2 text-accent-ember"
              style={{ color: "#FF6A2B" }}
            >
              {h1Accent}
            </span>
          )}
        </motion.h1>

        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.22, ease: "easeOut" }}
            className="mt-4 max-w-[62ch] text-[17px] sm:text-[18px] leading-relaxed"
            style={{ color: "var(--ink-muted-on-dark)" }}
          >
            {subtitle}
          </motion.p>
        )}

        {children && (
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.32, ease: "easeOut" }}
            className="mt-8"
          >
            {children}
          </motion.div>
        )}
      </div>
    </section>
  );
}
