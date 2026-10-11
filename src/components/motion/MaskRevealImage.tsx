"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface MaskRevealImageProps {
  src: string;
  alt: string;
  className?: string;
  aspectRatio?: string;
  curtainColor?: string;
  delay?: number;
  onClick?: () => void;
}

export default function MaskRevealImage({
  src,
  alt,
  className = "",
  aspectRatio = "aspect-[16/10]",
  curtainColor = "bg-[#3E2723] dark:bg-[#1E2B22]",
  delay = 0.1,
  onClick,
}: MaskRevealImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div
      onClick={onClick}
      className={`relative overflow-hidden group ${aspectRatio} ${className} ${
        onClick ? "cursor-pointer" : ""
      }`}
    >
      {/* Màn che Mask Reveal: Kéo từ trái sang phải (transformOrigin: right) */}
      <motion.div
        initial={{ scaleX: 1 }}
        whileInView={{ scaleX: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{
          duration: 0.85,
          ease: [0.77, 0, 0.175, 1] as const, // Cinematic curtain ease
          delay,
        }}
        style={{ transformOrigin: "right" }}
        className={`absolute inset-0 z-20 pointer-events-none ${curtainColor}`}
      />

      {/* Ảnh bên trong với hiệu ứng scale nhẹ và lazy-load mờ sang nét */}
      <motion.img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
        initial={{ scale: 1.15 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{
          duration: 1.1,
          ease: [0.215, 0.61, 0.355, 1] as const,
          delay,
        }}
        className={`w-full h-full object-cover transition-all duration-700 ease-out transform-gpu group-hover:scale-105 ${
          isLoaded ? "blur-0 opacity-100" : "blur-md opacity-75"
        }`}
      />
    </div>
  );
}
