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
    <div className={`relative overflow-hidden w-full h-full bg-[#18261D] transform-gpu ${className}`}>
      {/* Background LQIP Tone - Dark Forest Emerald */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1C2C21] via-[#16231A] to-[#101712]" />

      {/* Ảnh chạy Ken Burns Animation mượt mà */}
      <img
        src={src}
        alt={alt}
        width={1200}
        height={675}
        loading="eager"
        decoding="async"
        onLoad={() => setIsLoaded(true)}
        className={`w-full h-full object-cover animate-ken-burns transform-gpu transition-opacity duration-500 will-change-transform ${
          isLoaded ? "opacity-100" : "opacity-90"
        }`}
      />

      {/* Lớp phủ điện ảnh */}
      {overlayGradient && (
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/85 via-stone-950/20 to-transparent pointer-events-none" />
      )}
    </div>
  );
}
