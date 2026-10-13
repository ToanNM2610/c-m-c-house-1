"use client";

import React from "react";
import Image from "next/image";

interface StampPhotoProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  title?: string;
  coordinates?: string;
  rotate?: "left" | "right" | "none";
  className?: string;
  priority?: boolean;
}

/**
 * Tem ảnh (Section 5)
 * Khung kem, viền răng cưa mảnh, nhãn tọa độ + tên ảnh dưới ảnh, xoay ±2°
 */
export default function StampPhoto({
  src,
  alt,
  width = 320,
  height = 240,
  title,
  coordinates = "11.99° N · 107.69° E",
  rotate = "left",
  className = "",
  priority = false,
}: StampPhotoProps) {
  const rotateClass =
    rotate === "left"
      ? "stamp-rotate-left"
      : rotate === "right"
      ? "stamp-rotate-right"
      : "";

  return (
    <div
      className={`frame-stamp group select-none ${rotateClass} ${className}`}
    >
      <div className="relative overflow-hidden rounded-[4px] aspect-[4/3] w-full bg-[var(--paper-2)]">
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 768px) 100vw, 400px"
          priority={priority}
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      <div className="pt-2.5 pb-0.5 px-1 flex items-center justify-between gap-2 border-t border-[var(--line)]/50 mt-2">
        {title && (
          <span className="font-serif text-[13px] font-semibold text-[var(--ink)] truncate">
            {title}
          </span>
        )}
        <span className="font-mono text-[10px] text-[var(--ink-muted)] shrink-0 uppercase tracking-wider ml-auto">
          {coordinates}
        </span>
      </div>
    </div>
  );
}
