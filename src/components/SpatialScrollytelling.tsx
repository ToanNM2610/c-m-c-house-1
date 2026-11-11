"use client";

import React, { useEffect, useRef, useMemo } from "react";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import { STORE_CONSTANTS } from "@/lib/atmosphereEngine";
import {
  SpatialPhoto,
  SpatialStage,
  getSpatialGalleryState,
} from "@/lib/spatialGalleryData";
import { SPACE_ITEMS, SpaceItem } from "@/data/space";
import { PhoneCall, Navigation, Maximize2 } from "lucide-react";

interface SpatialScrollytellingProps {
  initialPhotos?: SpaceItem[];
  onOpenLightbox?: (index: number) => void;
}

export default function SpatialScrollytelling({
  initialPhotos = SPACE_ITEMS,
  onOpenLightbox,
}: SpatialScrollytellingProps) {
  const { locale } = useLanguage();
  const isVi = locale !== "en";
  const containerRef = useRef<HTMLDivElement>(null);

  const galleryState = useMemo(() => {
    return getSpatialGalleryState(initialPhotos);
  }, [initialPhotos]);

  // Thiết lập IntersectionObserver cho hiệu ứng cuộn trang Scrollytelling
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

    return () => {
      observer.disconnect();
    };
  }, [galleryState]);

  if (!galleryState.connected) {
    return (
      <section className="spatial-section" aria-labelledby="spatial-heading">
        <header className="spatial-header">
          <div>
            <span className="label-uppercase-12">
              {STORE_CONSTANTS.name} · {STORE_CONSTANTS.coordinates.display}
            </span>
            <h2 id="spatial-heading" className="spatial-title">
              {isVi ? "Không Gian Cẩm Cù House" : "Cẩm Cù House Space"}
            </h2>
          </div>
          <p className="spatial-subtitle">{isVi ? "Chưa kết nối" : "Disconnected"}</p>
        </header>
      </section>
    );
  }

  return (
    <section
      id="space-section"
      ref={containerRef}
      className="spatial-section"
      aria-labelledby="spatial-heading"
    >
      {/* 1. ĐẦU TRANG KHÔNG GIAN (SPATIAL HEADER) */}
      <header className="spatial-header">
        <div>
          <span className="label-uppercase-12">
            {STORE_CONSTANTS.name} · {STORE_CONSTANTS.coordinates.display}
          </span>
          <h2 id="spatial-heading" className="spatial-title">
            {isVi ? "Hành Trình 30 Góc Không Gian" : "30 Spatial Perspectives"}
          </h2>
        </div>
        <p className="spatial-subtitle">
          {STORE_CONSTANTS.address}
        </p>
      </header>

      {/* 2. NĂM CHẶNG HÀNH TRÌNH KHÔNG GIAN (5 CHẶNG X 6 ẢNH = 30 ẢNH) */}
      <div className="spatial-stages-wrapper">
        {galleryState.stages.map((stage: SpatialStage, stageIdx: number) => {
          return (
            <div
              key={stage.stageNumber}
              className="spatial-stage"
              data-stage={stage.stageNumber}
            >
              {/* Cột neo thông số chặng (Sticky Stage Rail trên Desktop) */}
              <aside className="spatial-stage-rail">
                <span className="label-uppercase-12">
                  {isVi ? "CHẶNG KHÔNG GIAN" : "SPATIAL STAGE"} {stage.stageNumber}
                </span>
                <p className="spatial-stage-index">{stage.rangeLabel}</p>
                <p className="spatial-stage-coords">{STORE_CONSTANTS.coordinates.display}</p>
              </aside>

              {/* Lưới 6 ảnh bất đối xứng */}
              <div className="spatial-stage-grid">
                {stage.photos.map((photo: SpatialPhoto, slotIdx: number) => {
                  const globalIdx = stageIdx * 6 + slotIdx;
                  const isEager = stageIdx === 0 && slotIdx < 2;

                  return (
                    <figure
                      key={photo.id}
                      className="spatial-card cursor-pointer group"
                      data-slot={slotIdx}
                      data-photo-order={photo.orderNumber}
                      onClick={() => onOpenLightbox?.(globalIdx)}
                    >
                      <Image
                        src={photo.src}
                        alt={isVi ? photo.altVi : photo.altEn}
                        fill
                        priority={isEager}
                        sizes="(max-width: 960px) 100vw, (max-width: 1440px) 60vw, 800px"
                        className="spatial-img object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                      />

                      {/* LỚP PHỦ TỐI BẮT BUỘC (WCAG AA TƯƠNG PHẢN >= 9.5:1) */}
                      <figcaption className="spatial-dark-overlay">
                        <span className="label-uppercase-12 spatial-card-num">
                          {STORE_CONSTANTS.name} · {photo.orderNumber} / {galleryState.totalCount}
                        </span>
                        <h3 className="spatial-card-title">
                          {isVi ? photo.titleVi : photo.titleEn}
                        </h3>
                        {photo.captionVi && (
                          <p className="spatial-card-caption">
                            {isVi ? photo.captionVi : photo.captionEn}
                          </p>
                        )}
                      </figcaption>

                      {/* Biểu tượng phóng to ảnh */}
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

      {/* 3. CHÂN TRANG HÀNH TRÌNH - ZERO MANUAL OPS */}
      <footer className="spatial-journey-cta">
        <p className="spatial-cta-copy">
          <strong>{STORE_CONSTANTS.name}</strong> — {STORE_CONSTANTS.address} (
          {isVi
            ? "Thứ 2–5 07:00–18:00, Thứ 6–CN 07:00–22:00"
            : "Mon–Thu 07:00–18:00, Fri–Sun 07:00–22:00"}
          )
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

