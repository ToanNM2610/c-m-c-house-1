"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function ScrollIndicator() {
  const [sectionIndex, setSectionIndex] = useState(1);
  const totalSections = 7;
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const p = docHeight > 0 ? Math.min(Math.max(scrollY / docHeight, 0), 1) : 0;
      setProgress(p);

      // Tính toán section 1-7 dựa trên vị trí cuộn
      const idx = Math.min(totalSections, Math.max(1, Math.ceil(p * totalSections) || 1));
      setSectionIndex(idx);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <aside
      className="hidden xl:flex fixed right-6 top-1/2 -translate-y-1/2 z-40 flex-col items-center gap-3 select-none pointer-events-none bg-[var(--card)]/90 backdrop-blur-md border border-[var(--line)] py-4 px-2 rounded-full shadow-lg"
      aria-label="Chỉ báo vị trí cuộn"
    >
      {/* Số mục 02/07 */}
      <span className="font-mono text-[11px] font-bold text-[var(--ember)] tracking-widest tabular-nums rotate-90 my-2">
        0{sectionIndex}/0{totalSections}
      </span>

      {/* Vạch dọc mảnh 1px */}
      <div className="w-[1.5px] h-28 bg-[var(--line)] relative overflow-hidden rounded-full">
        <motion.div
          className="w-full bg-[var(--ember)] origin-top rounded-full"
          style={{ height: `${Math.max(progress * 100, 6)}%` }}
        />
      </div>

      <span className="font-mono text-[9px] uppercase tracking-widest text-[var(--ink-muted)] rotate-90 mt-2">
        SCROLL
      </span>
    </aside>
  );
}
