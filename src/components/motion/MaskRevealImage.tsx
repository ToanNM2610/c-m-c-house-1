"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Sparkles } from "lucide-react";

interface MaskRevealImageProps {
  src: string;
  alt: string;
  className?: string;
  aspectRatio?: string;
  delay?: number;
  onClick?: () => void;
}

export default function MaskRevealImage({
  src,
  alt,
  className = "",
  aspectRatio = "aspect-[16/10]",
  delay = 0.05,
  onClick,
}: MaskRevealImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  return (
    <div
      onClick={onClick}
      className={`relative overflow-hidden group bg-[var(--surface-2)] ${aspectRatio} ${className} ${
        onClick ? "cursor-pointer" : ""
      }`}
    >
      {/* 1. Skeleton Placeholder: Nền --surface-2 với hiệu ứng pulse nhẹ khi đang tải ảnh */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 z-0 bg-[var(--surface-2)] animate-pulse flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-[var(--accent-green)]/40 animate-spin" />
        </div>
      )}

      {/* 2. Ảnh với blur-up: Mờ dần sang rõ nét mượt mà, không giật màn đen */}
      <motion.img
        src={hasError ? "/images/og-home.jpg" : src}
        alt={alt}
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
        onError={() => {
          setHasError(true);
          setIsLoaded(true);
        }}
        initial={shouldReduceMotion ? { opacity: 0 } : { scale: 1.08, opacity: 0 }}
        whileInView={shouldReduceMotion ? { opacity: 1 } : { scale: 1, opacity: 1 }}
        viewport={{ once: true, margin: "-20px" }}
        transition={{
          duration: shouldReduceMotion ? 0.2 : 0.8,
          ease: [0.2, 0.7, 0.2, 1] as const,
          delay: shouldReduceMotion ? 0 : Math.min(delay, 0.2),
        }}
        className={`w-full h-full object-cover transition-all duration-700 ease-out transform-gpu ${
          shouldReduceMotion ? "" : "group-hover:scale-105"
        } ${isLoaded ? "blur-0 opacity-100" : "blur-sm opacity-60"}`}
      />
    </div>
  );
}
