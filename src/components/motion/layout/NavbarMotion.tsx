"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { EASINGS } from "../tokens";

export interface NavbarMotionProps {
  children: React.ReactNode;
  threshold?: number;
  className?: string;
}

/**
 * NavbarMotion (Effect 13):
 * Automatically hides on scroll down and reveals with glass effect on scroll up.
 */
export default function NavbarMotion({
  children,
  threshold = 60,
  className = "",
}: NavbarMotionProps) {
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const updateScroll = () => {
      const currentScrollY = window.scrollY;
      setScrolled(currentScrollY > 20);

      if (currentScrollY > lastScrollY && currentScrollY > threshold) {
        setHidden(true); // scrolling down
      } else {
        setHidden(false); // scrolling up
      }
      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", updateScroll, { passive: true });
    return () => window.removeEventListener("scroll", updateScroll);
  }, [threshold]);

  return (
    <motion.header
      variants={{
        visible: { y: "0%" },
        hidden: { y: "-100%" },
      }}
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.35, ease: EASINGS.cinematic }}
      style={{ willChange: "transform" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
        scrolled ? "bg-[#0C0D0B]/85 backdrop-blur-md shadow-lg border-b border-white/5" : "bg-transparent"
      } ${className}`}
    >
      {children}
    </motion.header>
  );
}
