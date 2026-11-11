"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import { SPATIAL_CHAPTERS, SpatialChapter, SpatialPhotoItem, CAM_CU_HOUSE_INFO } from "@/data/camCuHouseData";
import { PhoneCall, Navigation, Maximize2, Compass } from "lucide-react";
import LightboxModal from "@/components/LightboxModal";

export default function SpatialScrollytellingSection() {
  const { locale } = useLanguage();
  const isVi = locale !== "en";

  const [activeChapter, setActiveChapter] = useState<number>(1);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);

  // Flatten all 30 photos for the lightbox
  const allPhotos = SPATIAL_CHAPTERS.flatMap((ch) => ch.photos);
  const lightboxPhotos = allPhotos.map((p) => ({
    url: p.image,
    title: p.title,
    caption: p.description,
    subtitle: p.subtitle,
    category: p.figureCode,
  }));

  // IntersectionObserver for Scrollytelling cards
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const cards = container.querySelectorAll<HTMLElement>(".spatial-card");
    if (!cards.length) return;

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion || typeof IntersectionObserver === "undefined") {
      cards.forEach((card) => card.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
    );

    cards.forEach((card) => observer.observe(card));

    return () => observer.disconnect();
  }, []);

  const handleOpenPhoto = (globalIndex: number) => {
    setLightboxIndex(globalIndex);
    setLightboxOpen(true);
  };

  const scrollToChapter = (chapterNum: number) => {
    setActiveChapter(chapterNum);
    const el = document.getElementById(`chapter-${chapterNum}`);
    if (el) {
      const topOffset = el.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: topOffset, behavior: "smooth" });
    }
  };

  return (
    <section
      id="space-section"
      ref={containerRef}
      className="spatial-section relative"
      aria-labelledby="spatial-scrollytelling-heading"
    >
      {/* 1. Header & Chapter Switcher */}
      <header className="spatial-header">
        <div>
          <div className="inline-flex items-center gap-2 font-mono text-[12px] uppercase tracking-widest text-[var(--accent-botanical)] font-bold">
            <Compass className="w-3.5 h-3.5 text-[var(--accent-botanical)]" />
            <span>
              {isVi
                ? "[SPATIAL SCROLLYTELLING] · 30 GÓC ẢNH KHÔNG GIAN BÊN SUỐI"
                : "[SPATIAL SCROLLYTELLING] · 30 REAL STREAMSIDE PERSPECTIVES"}
            </span>
          </div>

          <h2 id="spatial-scrollytelling-heading" className="spatial-title">
            {isVi ? "Hành Trình 30 Góc Không Gian Bên Suối" : "Spatial Scrollytelling Journey"}
          </h2>
        </div>

        <p className="spatial-subtitle">
          {CAM_CU_HOUSE_INFO.address.fullAddress} ·{" "}
          {isVi
            ? "Từng nếp nhà gỗ, tảng đá bazan rêu phong và làn gió mát lành cao nguyên."
            : "Every timber deck, mossy basalt rock, and refreshing highland breeze."}
        </p>
      </header>

      {/* Chapter navigation sticky chips */}
      <nav
        className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-6 mb-12 border-b border-[var(--border-subtle)]"
        aria-label={isVi ? "Các chương không gian" : "Spatial Chapters"}
      >
        {SPATIAL_CHAPTERS.map((ch) => (
          <button
            key={ch.chapter}
            type="button"
            onClick={() => scrollToChapter(ch.chapter)}
            className={`px-4 py-2 rounded-full font-mono text-xs uppercase tracking-wider border whitespace-nowrap transition-all ${
              activeChapter === ch.chapter
                ? "bg-[var(--text-primary)] text-[var(--bg-primary)] border-[var(--text-primary)] font-bold shadow-sm"
                : "bg-[var(--bg-surface)] text-[var(--text-secondary)] border-[var(--border-subtle)] hover:border-[var(--text-primary)]"
            }`}
          >
            {ch.romanNum}: {isVi ? ch.titleVi : ch.titleEn} ({ch.rangeLabel})
          </button>
        ))}
      </nav>

      {/* 2. Chapters Content */}
      <div className="spatial-stages-wrapper flex flex-col gap-16">
        {SPATIAL_CHAPTERS.map((ch: SpatialChapter) => {
          let globalOffset = 0;
          if (ch.chapter === 2) globalOffset = 7;
          else if (ch.chapter === 3) globalOffset = 16;
          else if (ch.chapter === 4) globalOffset = 23;

          return (
            <div
              key={ch.chapter}
              id={`chapter-${ch.chapter}`}
              className="spatial-stage"
              data-stage={String(ch.chapter).padStart(2, "0")}
            >
              {/* Sticky Stage Rail on Desktop */}
              <aside className="spatial-stage-rail">
                <span className="label-uppercase-12 text-[var(--accent-warm)]">
                  {ch.romanNum}
                </span>
                <p className="spatial-stage-index">{ch.rangeLabel}</p>
                <h3 className="font-display font-bold text-[20px] text-[var(--text-primary)] mb-1">
                  {isVi ? ch.titleVi : ch.titleEn}
                </h3>
                <p className="spatial-stage-coords text-xs">
                  {CAM_CU_HOUSE_INFO.coordinates.display}
                </p>
              </aside>

              {/* Asymmetric 12-column grid */}
              <div className="spatial-stage-grid">
                {ch.photos.map((photo: SpatialPhotoItem, slotIdx: number) => {
                  const globalIdx = globalOffset + slotIdx;
                  const isEager = ch.chapter === 1 && slotIdx < 2;

                  return (
                    <figure
                      key={photo.id}
                      className="spatial-card cursor-pointer group"
                      data-slot={slotIdx % 6}
                      data-photo-order={photo.orderNumber}
                      onClick={() => handleOpenPhoto(globalIdx)}
                    >
                      <Image
                        src={photo.image}
                        alt={photo.title}
                        fill
                        priority={isEager}
                        sizes="(max-width: 960px) 100vw, (max-width: 1440px) 60vw, 800px"
                        className="spatial-img object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                      />

                      {/* LỚP PHỦ TỐI BẮT BUỘC TRÊN 100% ẢNH CÓ CHỮ (Tương phản >= 9.5:1) */}
                      <figcaption className="spatial-dark-overlay">
                        <span className="label-uppercase-12 spatial-card-num">
                          {photo.figureCode} · {CAM_CU_HOUSE_INFO.name} [{photo.orderNumber}/30]
                        </span>
                        <h4 className="spatial-card-title">{photo.title}</h4>
                        {photo.description && (
                          <p className="spatial-card-caption">{photo.description}</p>
                        )}
                      </figcaption>

                      {/* Maximize Icon */}
                      <div className="absolute top-3.5 right-3.5 z-10 w-8 h-8 rounded-full bg-black/40 border border-white/20 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Maximize2 className="w-3.5 h-3.5" />
                      </div>
                    </figure>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Chân trang hành trình - Chuyển đổi Zero Manual Ops */}
      <footer className="spatial-journey-cta">
        <p className="spatial-cta-copy">
          <strong>{CAM_CU_HOUSE_INFO.name}</strong> — {CAM_CU_HOUSE_INFO.address.fullAddress} (
          {isVi
            ? "Thứ 2–5 07:00–18:00, Thứ 6–CN 07:00–22:00"
            : "Mon–Thu 07:00–18:00, Fri–Sun 07:00–22:00"}
          )
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

      {/* Lightbox Modal */}
      <LightboxModal
        isOpen={lightboxOpen}
        photos={lightboxPhotos}
        initialIndex={lightboxIndex}
        onClose={() => setLightboxOpen(false)}
      />
    </section>
  );
}
