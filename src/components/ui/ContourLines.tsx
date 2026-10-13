"use client";

import React from "react";

interface ContourLinesProps {
  className?: string;
  opacity?: number;
}

/**
 * Đường đồng mức cao nguyên (Section 2 & 5)
 * Họa tiết địa hình tượng trưng cho độ cao 800m+ và tọa độ Đắk Nông
 */
export default function ContourLines({
  className = "",
  opacity = 0.08,
}: ContourLinesProps) {
  return (
    <div
      className={`absolute inset-0 pointer-events-none overflow-hidden select-none ${className}`}
      style={{ opacity }}
      aria-hidden="true"
    >
      <svg
        className="w-full h-full"
        viewBox="0 0 1440 900"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* Lớp đường đồng mức 800m, 820m, 840m, 860m, 880m */}
        <path
          d="M-100 150 C 200 80, 500 240, 800 160 C 1100 80, 1300 220, 1600 140"
          stroke="currentColor"
          strokeWidth="1.2"
        />
        <path
          d="M-100 280 C 250 200, 550 360, 850 290 C 1150 220, 1380 340, 1600 270"
          stroke="currentColor"
          strokeWidth="1.2"
        />
        <path
          d="M-100 420 C 300 360, 600 500, 950 430 C 1220 370, 1420 480, 1600 410"
          stroke="currentColor"
          strokeWidth="1.2"
        />
        <path
          d="M-100 560 C 280 520, 580 640, 920 580 C 1250 510, 1450 630, 1600 570"
          stroke="currentColor"
          strokeWidth="1.2"
        />
        <path
          d="M-100 700 C 320 660, 620 780, 960 720 C 1280 670, 1480 770, 1600 730"
          stroke="currentColor"
          strokeWidth="1.2"
        />
        <path
          d="M-100 840 C 350 810, 680 920, 1020 870 C 1320 820, 1500 910, 1600 880"
          stroke="currentColor"
          strokeWidth="1.2"
        />

        {/* Các vòng đồng mức đỉnh đồi khép kín */}
        <ellipse
          cx="1150"
          cy="260"
          rx="180"
          ry="90"
          transform="rotate(-12 1150 260)"
          stroke="currentColor"
          strokeWidth="1"
          strokeDasharray="6 3"
        />
        <ellipse
          cx="1150"
          cy="260"
          rx="110"
          ry="55"
          transform="rotate(-12 1150 260)"
          stroke="currentColor"
          strokeWidth="1.2"
        />
        <ellipse
          cx="1150"
          cy="260"
          rx="45"
          ry="22"
          transform="rotate(-12 1150 260)"
          stroke="currentColor"
          strokeWidth="1.2"
        />

        <ellipse
          cx="280"
          cy="650"
          rx="210"
          ry="110"
          transform="rotate(18 280 650)"
          stroke="currentColor"
          strokeWidth="1"
          strokeDasharray="6 3"
        />
        <ellipse
          cx="280"
          cy="650"
          rx="130"
          ry="70"
          transform="rotate(18 280 650)"
          stroke="currentColor"
          strokeWidth="1.2"
        />

        {/* Nhãn độ cao nhỏ định hướng */}
        <text x="750" y="285" fill="currentColor" className="font-mono text-[9px] tracking-widest uppercase opacity-60">
          800M+ ELEVATION
        </text>
        <text x="320" y="495" fill="currentColor" className="font-mono text-[9px] tracking-widest uppercase opacity-60">
          11.99° N · 107.69° E
        </text>
      </svg>
    </div>
  );
}
