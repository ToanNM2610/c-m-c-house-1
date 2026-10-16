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
        className={`w-9 h-9 sm:w-10 sm:h-10 min-w-[36px] min-h-[36px] rounded-full flex items-center justify-center border transition-colors opacity-70 bg-transparent border-[var(--line)] text-[var(--ink)] ${className}`}
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
      className={`btn-press relative inline-flex items-center justify-center gap-2 w-9 h-9 sm:w-10 sm:h-10 min-w-[36px] min-h-[36px] rounded-full transition-all duration-300 shadow-xs border ${
        isDark
          ? "bg-[#141C17] hover:bg-[#1D2821] text-[#F0D58F] border-[rgba(242,237,228,0.22)]"
          : "bg-[#FFFFFF] hover:bg-[#F3EDE2] text-[#2C241E] border-[rgba(62,39,35,0.18)]"
      } ${className}`}
      aria-label={isDark ? "Chuyển sang giao diện Sáng (Ban ngày)" : "Chuyển sang giao diện Tối (Đêm bên suối)"}
      title={isDark ? "Đêm bên suối · Bấm để chuyển sang Sáng" : "Ban ngày · Bấm để chuyển sang Tối"}
    >
      <div className="relative w-4 h-4 flex items-center justify-center">
        {isDark ? (
          <Sun className="w-4 h-4 text-[#F0D58F] transition-transform duration-300 hover:rotate-45" />
        ) : (
          <Moon className="w-4 h-4 text-[#2C241E] transition-transform duration-300 hover:-rotate-12" />
        )}
      </div>

      {showLabel && (
        <span className="text-xs font-semibold pr-1">
          {isDark ? "Đêm bên suối" : "Ban ngày"}
        </span>
      )}
    </button>
  );
}
