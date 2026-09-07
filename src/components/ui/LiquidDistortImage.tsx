"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

interface LiquidDistortImageProps {
  src: string;
  alt: string;
  className?: string;
  aspect?: string;
}

export default function LiquidDistortImage({
  src,
  alt,
  className = "",
  aspect = "aspect-square",
}: LiquidDistortImageProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobileOrTouch =
        window.innerWidth < 768 ||
        window.matchMedia("(pointer: coarse)").matches ||
        "ontouchstart" in window ||
        (navigator.maxTouchPoints && navigator.maxTouchPoints > 0);
      setIsMobile(Boolean(mobileOrTouch));
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const filterId = `liquid-filter-${alt.replace(/[^a-zA-Z0-9_-]/g, "-")}`;

  return (
    <div
      onMouseEnter={() => !isMobile && setIsHovered(true)}
      onMouseLeave={() => !isMobile && setIsHovered(false)}
      className={`relative overflow-hidden rounded-2xl group cursor-pointer ${aspect} ${className}`}
    >
      {/* SVG Liquid Distortion Filter ẩn trong DOM - Chỉ render trên Desktop để bảo vệ GPU mobile */}
      {!isMobile && (
        <svg className="absolute w-0 h-0 pointer-events-none" aria-hidden="true">
          <defs>
            <filter id={filterId}>
              <feTurbulence
                type="fractalNoise"
                baseFrequency={isHovered ? "0.04 0.06" : "0.001 0.001"}
                numOctaves="3"
                result="turbulence"
              >
                {isHovered && (
                  <animate
                    attributeName="baseFrequency"
                    dur="4s"
                    values="0.04 0.06; 0.06 0.08; 0.04 0.06"
                    repeatCount="indefinite"
                  />
                )}
              </feTurbulence>
              <feDisplacementMap
                in="SourceGraphic"
                in2="turbulence"
                scale={isHovered ? 16 : 0}
                xChannelSelector="R"
                yChannelSelector="G"
              />
            </filter>
          </defs>
        </svg>
      )}

      {/* Ảnh món ăn: Trên Mobile dùng CSS transition nhẹ mượt mà, trên Desktop dùng hiệu ứng mặt nước */}
      <div
        className="w-full h-full relative transition-transform duration-700 ease-out group-hover:scale-105"
        style={{
          filter: !isMobile && isHovered ? `url(#${filterId})` : "none",
          transition: !isMobile ? "filter 0.4s ease, transform 0.6s ease" : "transform 0.5s ease",
          willChange: isMobile ? "transform" : "auto",
        }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover"
        />
      </div>

      {/* Lớp bóng đổ vignette nhẹ */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#1A0F0A]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </div>
  );
}
