"use client";

import React from "react";

interface StarHoyaProps {
  className?: string;
  size?: number;
  strokeWidth?: number;
  color?: string;
  animated?: boolean;
}

/**
 * Hoa Hoya hình sao nét mảnh (Section 2 & 5)
 * Đặc trưng của hoa Cẩm Cù (Hoya): Cụm hoa hình ngôi sao 5 cánh tinh tế
 */
export default function StarHoya({
  className = "w-6 h-6",
  size = 24,
  strokeWidth = 1.5,
  color = "currentColor",
  animated = false,
}: StarHoyaProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Cánh hoa sao lớn ngoài (Outer 5-point star petals) */}
      <path
        d="M24 3L29.3 16.2L43.4 17.5L32.7 27.2L35.8 41.1L24 34.2L12.2 41.1L15.3 27.2L4.6 17.5L18.7 16.2L24 3Z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={animated ? "animate-hoya-stroke" : ""}
      />
      {/* Vành tràng sao trong đặc trưng của hoa Hoya (Inner Corona Star) */}
      <path
        d="M24 14L26.5 20.3L33.3 20.9L28.1 25.5L29.6 32.2L24 28.8L18.4 32.2L19.9 25.5L14.7 20.9L21.5 20.3L24 14Z"
        stroke={color}
        strokeWidth={strokeWidth * 0.9}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="currentColor"
        fillOpacity="0.12"
      />
      {/* Nhụy tâm tròn (Center eye) */}
      <circle cx="24" cy="24" r="2.5" fill={color} />
      {/* Đường gân cánh hoa tỏa ra (Subtle petal veins) */}
      <line x1="24" y1="14" x2="24" y2="4" stroke={color} strokeWidth={strokeWidth * 0.75} strokeOpacity="0.4" />
      <line x1="33.3" y1="20.9" x2="43.4" y2="17.5" stroke={color} strokeWidth={strokeWidth * 0.75} strokeOpacity="0.4" />
      <line x1="29.6" y1="32.2" x2="35.8" y2="41.1" stroke={color} strokeWidth={strokeWidth * 0.75} strokeOpacity="0.4" />
      <line x1="18.4" y1="32.2" x2="12.2" y2="41.1" stroke={color} strokeWidth={strokeWidth * 0.75} strokeOpacity="0.4" />
      <line x1="14.7" y1="20.9" x2="4.6" y2="17.5" stroke={color} strokeWidth={strokeWidth * 0.75} strokeOpacity="0.4" />
    </svg>
  );
}
