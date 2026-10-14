"use client";

import React, { useState } from "react";
import Image, { ImageProps } from "next/image";
import { Image as ImageIcon, Sparkles } from "lucide-react";

interface SafeImageProps extends Omit<ImageProps, "onError" | "onLoad"> {
  fallbackClassName?: string;
  showSkeleton?: boolean;
}

export default function SafeImage({
  src,
  alt,
  className = "",
  fallbackClassName = "",
  showSkeleton = true,
  ...rest
}: SafeImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Khi ảnh lỗi: hiện nền --surface-2 + icon, KHÔNG hiện biểu tượng ảnh hỏng hay chữ alt (Mục B5)
  if (hasError) {
    return (
      <div
        className={`w-full h-full min-h-[140px] bg-[var(--surface-2)] flex flex-col items-center justify-center text-[var(--ink-muted)] p-4 select-none ${fallbackClassName} ${className}`}
        aria-hidden="true"
      >
        <ImageIcon className="w-8 h-8 opacity-40 mb-1.5 text-[var(--sage)]" />
        <span className="font-mono text-[11px] opacity-50 uppercase tracking-wider">
          Cẩm Cù House
        </span>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Skeleton khi tải */}
      {!isLoaded && showSkeleton && (
        <div className="absolute inset-0 z-10 bg-[var(--surface-2)] animate-pulse flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-[var(--sage)]/40 animate-spin" />
        </div>
      )}

      <Image
        src={src}
        alt={alt}
        className={`${className} transition-opacity duration-300 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        {...rest}
      />
    </div>
  );
}
