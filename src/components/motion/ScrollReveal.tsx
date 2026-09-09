"use client";

import React, { useRef } from "react";
import Image, { ImageProps } from "next/image";
import { motion, useScroll, useTransform, Variants } from "framer-motion";

const AWWWARDS_EASE = [0.22, 1, 0.36, 1] as const;

// ╔═══════════════════════════════════════════════════════════════════════════╗
// ║  A. TIÊU ĐỀ LỘ DIỆN AN TOÀN (SAFE HEADINGS REVEAL — NO OVERFLOW CLIPPING)  ║
// ║     Above-the-fold dùng animate trực tiếp; In-view dùng once: true        ║
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
  isAboveFold?: boolean;
}

export function MaskHeading({
  children,
  as = "h2",
  className = "",
  wrapperClassName = "",
  delay = 0,
  duration = 0.6,
  amount = 0.1,
  once = true,
  isAboveFold,
}: MaskHeadingProps) {
  const Tag = as;
  const isHeadOrAboveFold = isAboveFold ?? as === "h1";

  if (isHeadOrAboveFold) {
    return (
      <div className={`relative ${wrapperClassName}`}>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
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

  return (
    <div className={`relative ${wrapperClassName}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once, amount, margin: "100px 0px" }}
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
// ║     staggerChildren: 0.1s, y: 20px -> 0px, scale: 0.98 -> 1, hover -6px   ║
// ╚═══════════════════════════════════════════════════════════════════════════╝

const staggerContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const staggerItemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.98,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.55,
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
  amount = 0.1,
  once = true,
}: StaggerContainerProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount, margin: "100px 0px" }}
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
  speed?: number;
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

  const offset = (1 - speed) * 120;
  const y = useTransform(scrollYProgress, [0, 1], [-offset, offset]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.06, 1.02, 1.06]);

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
// ║  D. FADE-UP AN TOÀN CHO KHỐI NỘI DUNG                                      ║
// ╚═══════════════════════════════════════════════════════════════════════════╝

interface FadeUpProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  yOffset?: number;
  amount?: number;
  once?: boolean;
  isAboveFold?: boolean;
}

export function FadeUp({
  children,
  className = "",
  delay = 0,
  duration = 0.6,
  yOffset = 20,
  amount = 0.1,
  once = true,
  isAboveFold = false,
}: FadeUpProps) {
  if (isAboveFold) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
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

  return (
    <motion.div
      initial={{ opacity: 0, y: yOffset }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount, margin: "100px 0px" }}
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
