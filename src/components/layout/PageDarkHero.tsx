"use client";

import React from "react";

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

      {/* 8. Chữ ghost "CẨM CÙ HOUSE" độ mờ .16 */}
      <div
        aria-hidden="true"
        className="hero-ghost-text absolute bottom-4 left-1/2 -translate-x-1/2 w-full max-w-[1200px] flex justify-center pointer-events-none select-none"
      >
        <svg viewBox="0 0 1200 120" className="w-full h-auto max-h-[160px] overflow-visible" fill="currentColor">
          <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fontWeight="800">CẨM{"\u00A0"}CÙ HOUSE</text>
        </svg>
      </div>

      {/* Nội dung chính với token chữ kem #F2EDE4 cố định */}
      <div className="relative z-10 mx-auto w-full max-w-[1360px] px-5 lg:px-14">
        <div className="flex flex-wrap gap-2.5">
          {badges.map((badge) => (
            <span
              key={badge}
              className="text-mono-label chamfer-14 border border-[var(--line-on-dark)] bg-[#0A0E0C]/65 px-3.5 py-1.5 text-[var(--ink-on-dark)] backdrop-blur-md"
            >
              {badge}
            </span>
          ))}
        </div>

        {/* 1. H1 luôn hiển thị đầy đủ, không cắt dấu, không bao giờ trống */}
        <h1 className="text-h1 mt-5 text-[var(--ink-on-dark)]">
          <span>{h1Main}</span>{" "}
          {h1Accent && (
            <span className="text-accent-ember" style={{ color: "#FF6A2B" }}>
              {h1Accent}
            </span>
          )}
        </h1>

        {subtitle && (
          <p
            className="mt-4 max-w-[62ch] text-[18px] leading-relaxed"
            style={{ color: "var(--ink-muted-on-dark)" }}
          >
            {subtitle}
          </p>
        )}

        {children && <div className="mt-8">{children}</div>}
      </div>
    </section>
  );
}
