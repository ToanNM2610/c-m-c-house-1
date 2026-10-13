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
        className={`w-9 h-9 sm:w-10 sm:h-10 min-w-[36px] min-h-[36px] rounded-full flex items-center justify-center bg-[var(--card)] border border-[var(--line)] text-[var(--ink-muted)] opacity-60 ${className}`}
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
      className={`btn-press relative inline-flex items-center justify-center gap-2 w-9 h-9 sm:w-10 sm:h-10 min-w-[36px] min-h-[36px] rounded-full transition-all duration-300 bg-[var(--card)] hover:bg-[var(--paper-2)] text-[var(--ink)] border border-[var(--line)] shadow-xs ${className}`}
      aria-label={isDark ? "Chuyển sang giao diện Sáng (mặc định)" : "Chuyển sang giao diện Đêm bên suối"}
      title={isDark ? "Đêm bên suối (Bấm để chuyển sang Sáng)" : "Giao diện Sáng (Bấm để chuyển sang Đêm bên suối)"}
    >
      <div className="relative w-4 h-4 flex items-center justify-center">
        {isDark ? (
          <Sun className="w-4 h-4 text-[var(--flower)] transition-transform duration-300" />
        ) : (
          <Moon className="w-4 h-4 text-[var(--ink)] transition-transform duration-300" />
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
