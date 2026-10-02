"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { Sun, Moon } from "lucide-react";

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export default function ThemeToggle({ className = "", showLabel = false }: ThemeToggleProps) {
  const { theme, isDark, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Avoid hydration mismatch by rendering a stable placeholder until mounted
  if (!mounted) {
    return (
      <button
        type="button"
        className={`w-9 h-9 sm:w-10 sm:h-10 min-w-[40px] min-h-[40px] rounded-full flex items-center justify-center bg-stone-100 dark:bg-[#1E2B22] border border-stone-200 dark:border-stone-700/60 text-stone-500 opacity-60 ${className}`}
        aria-label="Chuyển đổi giao diện"
      >
        <Moon className="w-4 h-4" />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`relative inline-flex items-center justify-center gap-2 w-9 h-9 sm:w-10 sm:h-10 min-w-[40px] min-h-[40px] rounded-full transition-all duration-300 shadow-sm ${
        isDark
          ? "bg-[#1E2B22] hover:bg-[#25362B] text-amber-300 border border-stone-700/70 hover:shadow-emerald-950/40"
          : "bg-white hover:bg-stone-50 text-[#3E5C46] border border-stone-200/80 hover:shadow-stone-200"
      } ${className}`}
      aria-label={isDark ? "Chuyển sang giao diện Sáng mộc mạc" : "Chuyển sang giao diện Tối đêm ấm cúng"}
      title={isDark ? "Giao diện Tối (Bấm để chuyển sang Sáng)" : "Giao diện Sáng (Bấm để chuyển sang Tối)"}
    >
      <div className="relative w-4 h-4 flex items-center justify-center">
        {isDark ? (
          <Sun className="w-4 h-4 text-amber-300 animate-in spin-in-90 duration-300" />
        ) : (
          <Moon className="w-4 h-4 text-[#3E5C46] animate-in spin-in-90 duration-300" />
        )}
      </div>

      {showLabel && (
        <span className="text-xs font-semibold pr-1">
          {isDark ? "Chế độ Tối" : "Chế độ Sáng"}
        </span>
      )}
    </button>
  );
}
