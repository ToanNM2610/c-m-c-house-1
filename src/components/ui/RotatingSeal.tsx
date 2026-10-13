"use client";

import React from "react";
import StarHoya from "./StarHoya";

interface RotatingSealProps {
  size?: number;
  className?: string;
  variant?: "basalt" | "charcoal" | "stream" | "paper";
  text?: string;
}

/**
 * Tem tròn xoay (Section 2, 7, 8):
 * "CẨM CÙ HOUSE • GIA NGHĨA • ĐẮK NÔNG •"
 * Điểm nhấn thủ công độc đáo tại Hero, Chân trang, Lời hẹn ước
 */
export default function RotatingSeal({
  size = 120,
  className = "",
  variant = "basalt",
  text = "CẨM CÙ HOUSE • GIA NGHĨA • ĐẮK NÔNG • ",
}: RotatingSealProps) {
  const pathId = `seal-path-${size}-${variant}`;

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 group select-none ${className}`}
      style={{ width: size, height: size }}
      aria-label="Cẩm Cù House - Gia Nghĩa - Đắk Nông"
    >
      {/* Vòng chữ xoay tròn */}
      <svg
        viewBox="0 0 200 200"
        className="w-full h-full animate-spin-slow transition-transform duration-500 ease-out group-hover:scale-105"
        style={{ transformOrigin: "center center" }}
      >
        <defs>
          <path
            id={pathId}
            d="M 100, 100 m -75, 0 a 75,75 0 1,1 150,0 a 75,75 0 1,1 -150,0"
          />
        </defs>
        {/* Viền tròn đôi răng cưa/mảnh */}
        <circle
          cx="100"
          cy="100"
          r="94"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeDasharray="4 2"
          opacity="0.4"
        />
        <circle
          cx="100"
          cy="100"
          r="56"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          opacity="0.3"
        />

        <text
          fill="currentColor"
          className="font-mono text-[13.5px] font-bold tracking-[0.24em] uppercase"
        >
          <textPath xlinkHref={`#${pathId}`} href={`#${pathId}`} startOffset="0%">
            {text}
          </textPath>
        </text>
      </svg>

      {/* Hoa Hoya hoặc biểu tượng ở tâm tem */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-8 h-8 rounded-full bg-[var(--paper-2)]/60 flex items-center justify-center text-[var(--basalt)] shadow-xs">
          <StarHoya size={18} strokeWidth={1.8} />
        </div>
      </div>
    </div>
  );
}
