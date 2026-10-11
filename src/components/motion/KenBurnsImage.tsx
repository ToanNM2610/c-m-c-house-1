"use client";

import { useState } from "react";

interface KenBurnsImageProps {
  src: string;
  alt: string;
  className?: string;
  overlayGradient?: boolean;
}

export default function KenBurnsImage({
  src,
  alt,
  className = "",
  overlayGradient = true,
}: KenBurnsImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className={`relative overflow-hidden w-full h-full transform-gpu ${className}`}>
      {/* Ảnh chạy Ken Burns Animation mượt mà 60-120 FPS */}
      <img
        src={src}
        alt={alt}
        onLoad={() => setIsLoaded(true)}
        className={`w-full h-full object-cover animate-ken-burns transform-gpu transition-all duration-700 ${
          isLoaded ? "blur-0 opacity-100" : "blur-lg opacity-60"
        }`}
      />

      {/* Lớp phủ điện ảnh nếu cần */}
      {overlayGradient && (
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/25 to-transparent pointer-events-none" />
      )}
    </div>
  );
}
