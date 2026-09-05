"use client";

import { useRef } from "react";
import Image, { ImageProps } from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";

interface ParallaxImageProps extends Omit<ImageProps, "className"> {
  containerClassName?: string;
  imageClassName?: string;
  parallaxOffset?: number; // % dịch chuyển, mặc định 12
  cursorText?: string;
}

export default function ParallaxImage({
  containerClassName = "",
  imageClassName = "",
  parallaxOffset = 12,
  cursorText,
  alt,
  src,
  ...rest
}: ParallaxImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(
    scrollYProgress,
    [0, 1],
    [`-${parallaxOffset}%`, `${parallaxOffset}%`]
  );

  return (
    <div
      ref={containerRef}
      data-cursor-text={cursorText}
      className={`relative overflow-hidden ${containerClassName}`}
    >
      <motion.div
        style={{ y, willChange: "transform" }}
        className="relative w-full h-[124%] -top-[12%] left-0 right-0"
      >
        <Image
          src={src}
          alt={alt || "Cẩm Cù House"}
          fill
          className={`object-cover ${imageClassName}`}
          {...rest}
        />
      </motion.div>
    </div>
  );
}
