"use client";

import React, { useRef } from "react";
import Image, { ImageProps } from "next/image";
import { motion, useScroll, useTransform, Variants } from "framer-motion";

const AWWWARDS_EASE = [0.22, 1, 0.36, 1] as const;

// ╔═══════════════════════════════════════════════════════════════════════════╗
// ║  A. MẶT NẠ CHỮ CHO TIÊU ĐỀ (HEADINGS KINETIC MASK REVEAL)                 ║
// ║     Container overflow-hidden, translateY: 100% -> 0%, viewport 2 chiều   ║
// ╚═══════════════════════════════════════════════════════════════════════════╝

interface MaskHeadingProps {
  children: React.ReactNode;
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span" | "div";
  className?: string;
  wrapperClassName?: string;
  delay?: number;
  duration?: number;
  amount?: number;
  once?: boolean;
}

export function MaskHeading({
  children,
  as = "h2",
  className = "",
  wrapperClassName = "",
  delay = 0,
  duration = 0.8,
  amount = 0.25,
  once = false,
}: MaskHeadingProps) {
  const Tag = as;

  return (
    <div className={`overflow-hidden pb-1 ${wrapperClassName}`}>
      <motion.div
        initial={{ y: "100%", opacity: 0 }}
        whileInView={{ y: "0%", opacity: 1 }}
        viewport={{ once, amount }}
        transition={{
          duration,
          delay,
          ease: AWWWARDS_EASE,
        }}
        style={{ willChange: "transform, opacity" }}
      >
        <Tag className={className}>{children}</Tag>
      </motion.div>
    </div>
  );
}

// ╔═══════════════════════════════════════════════════════════════════════════╗
// ║  B. HIỆU ỨNG SO LE CHO THẺ BÀI & DANH SÁCH (STAGGERED CARDS)              ║
// ║     staggerChildren: 0.12s, y: 35px -> 0px, scale: 0.96 -> 1, hover -6px  ║
// ╚═══════════════════════════════════════════════════════════════════════════╝

const staggerContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const staggerItemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 35,
    scale: 0.96,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.65,
      ease: AWWWARDS_EASE,
    },
  },
};

interface StaggerContainerProps {
  children: React.ReactNode;
  className?: string;
  amount?: number;
  once?: boolean;
}

export function StaggerContainer({
  children,
  className = "",
  amount = 0.15,
  once = false,
}: StaggerContainerProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
      variants={staggerContainerVariants}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface StaggerItemProps {
  children: React.ReactNode;
  className?: string;
  enableHoverLift?: boolean;
}

export function StaggerItem({
  children,
  className = "",
  enableHoverLift = true,
}: StaggerItemProps) {
  return (
    <motion.div
      variants={staggerItemVariants}
      whileHover={
        enableHoverLift
          ? {
              y: -6,
              transition: { duration: 0.25, ease: "easeOut" },
            }
          : undefined
      }
      className={`transition-colors duration-300 hover:border-[#C88A4B]/40 will-change-transform ${className}`}
    >
      {children}
    </motion.div>
  );
}

// ╔═══════════════════════════════════════════════════════════════════════════╗
// ║  C. THỊ SAI ẢNH NHẸ (SUBTLE PARALLAX IMAGE — 0.85x SPEED)                 ║
// ║     useScroll + useTransform tạo ảo giác không gian 3D có chiều sâu      ║
// ╚═══════════════════════════════════════════════════════════════════════════╝

interface ParallaxImageProps extends Omit<ImageProps, "className"> {
  containerClassName?: string;
  imageClassName?: string;
  speed?: number; // 0.85x speed means slight drag
}

export function ParallaxImage({
  containerClassName = "",
  imageClassName = "",
  speed = 0.85,
  alt,
  ...imageProps
}: ParallaxImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Calculate subtle parallax translateY range based on speed factor
  // Lower speed = moves slower than scroll = drifts slightly backwards
  const offset = (1 - speed) * 160; // ~24px range
  const y = useTransform(scrollYProgress, [0, 1], [-offset, offset]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.08, 1.04, 1.08]);

  return (
    <div
      ref={containerRef}
      className={`overflow-hidden relative ${containerClassName}`}
    >
      <motion.div
        style={{ y, scale }}
        className="w-full h-full relative will-change-transform"
      >
        <Image
          alt={alt}
          className={`object-cover transition-transform duration-700 ${imageClassName}`}
          {...imageProps}
        />
      </motion.div>
    </div>
  );
}

// ╔═══════════════════════════════════════════════════════════════════════════╗
// ║  D. FADE-UP CHUẨN ĐIỆN ẢNH CHO KHỐI NỘI DUNG                              ║
// ╚═══════════════════════════════════════════════════════════════════════════╝

interface FadeUpProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  yOffset?: number;
  amount?: number;
  once?: boolean;
}

export function FadeUp({
  children,
  className = "",
  delay = 0,
  duration = 0.6,
  yOffset = 24,
  amount = 0.2,
  once = false,
}: FadeUpProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: yOffset }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount }}
      transition={{
        duration,
        delay,
        ease: AWWWARDS_EASE,
      }}
      className={className}
      style={{ willChange: "transform, opacity" }}
    >
      {children}
    </motion.div>
  );
}
