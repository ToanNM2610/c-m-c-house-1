"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

interface TextRevealProps {
  lines: React.ReactNode[];
  className?: string;
  lineClassName?: string;
}

export default function TextReveal({ lines, className = "", lineClassName = "" }: TextRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [isShown, setIsShown] = useState(false);

  useEffect(() => {
    if (isInView) {
      // Small delay to ensure DOM is ready
      const timer = setTimeout(() => setIsShown(true), 50);
      return () => clearTimeout(timer);
    }
  }, [isInView]);

  return (
    <div ref={ref} className={`t-stagger ${isShown ? "is-shown" : ""} ${className}`}>
      {lines.map((line, i) => (
        <span key={i} className={`t-stagger-line t-stagger-line--${i + 1} ${lineClassName}`}>
          {line}
        </span>
      ))}
    </div>
  );
}
