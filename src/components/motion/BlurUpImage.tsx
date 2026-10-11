"use client";

import { useState } from "react";

interface BlurUpImageProps {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  onClick?: () => void;
}

export default function BlurUpImage({
  src,
  alt,
  className = "",
  imgClassName = "",
  onClick,
}: BlurUpImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div
      onClick={onClick}
      className={`relative overflow-hidden ${className} ${onClick ? "cursor-pointer" : ""}`}
    >
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
        className={`w-full h-full object-cover transition-all duration-700 ease-out transform-gpu ${
          isLoaded
            ? "blur-0 scale-100 opacity-100"
            : "blur-xl scale-105 opacity-60"
        } ${imgClassName}`}
      />
    </div>
  );
}
