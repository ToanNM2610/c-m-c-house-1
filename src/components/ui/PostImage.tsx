"use client";

import { useState } from "react";
import Image from "next/image";

export default function PostImage({ 
  src, 
  alt, 
  className = "" 
}: { 
  src?: string; 
  alt: string; 
  className?: string; 
}) {
  const [error, setError] = useState(false);
  
  const isValidSrc = src && src.trim() !== "";
  
  if (!isValidSrc || error) {
    return (
      <div className={`w-full h-full flex items-center justify-center bg-[#1E1008] text-[#C5A880]/40 font-serif text-lg ${className}`}>
        {alt.slice(0, 1).toUpperCase()}
      </div>
    );
  }

  return (
    <Image 
      src={src} 
      alt={alt} 
      fill
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      loading="lazy"
      quality={80}
      className={className}
      onError={() => setError(true)}
    />
  );
}
