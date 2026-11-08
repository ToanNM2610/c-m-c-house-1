"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { Sun, Moon, Sparkles } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export default function ThemeToggle({ className = "", showLabel = false }: ThemeToggleProps) {
  const { themeMode, isDark, toggleTheme } = useTheme();
  const { locale } = useLanguage();
  const isEn = locale === "en";
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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

  const getModeLabel = () => {
    if (themeMode === "auto") {
      return isEn ? "Auto (Gia Nghia)" : "Tự động (Gia Nghĩa)";
    }
    if (themeMode === "light") {
      return isEn ? "Light mode" : "Chế độ Sáng";
    }
    return isEn ? "Dark mode" : "Chế độ Tối";
  };

  const getButtonTitle = () => {
    if (themeMode === "auto") {
      return isEn
        ? "Auto by Gia Nghia time · Click to switch to Light"
        : "Tự động theo giờ Gia Nghĩa · Bấm để đổi sang Sáng";
    }
    if (themeMode === "light") {
      return isEn
        ? "Manual Light mode · Click to switch to Dark"
        : "Chế độ Sáng thủ công · Bấm để đổi sang Tối";
    }
    return isEn
      ? "Manual Dark mode · Click to switch to Auto"
      : "Chế độ Tối thủ công · Bấm để đổi sang Tự động";
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`btn-press relative inline-flex items-center justify-center gap-2 w-9 h-9 sm:w-10 sm:h-10 min-w-[36px] min-h-[36px] rounded-full transition-all duration-300 shadow-xs border ${
        isDark
          ? "bg-[#141C17] hover:bg-[#1D2821] text-[#F0D58F] border-[rgba(242,237,228,0.22)]"
          : "bg-[#FFFFFF] hover:bg-[#F3EDE2] text-[#2C241E] border-[rgba(62,39,35,0.18)]"
      } ${className}`}
      aria-label={getModeLabel()}
      title={getButtonTitle()}
    >
      <div className="relative w-4 h-4 flex items-center justify-center">
        {themeMode === "auto" ? (
          <Sparkles className="w-4 h-4 text-[var(--ember,#8D361D)] transition-transform duration-300 hover:scale-110" />
        ) : isDark ? (
          <Sun className="w-4 h-4 text-[#F0D58F] transition-transform duration-300 hover:rotate-45" />
        ) : (
          <Moon className="w-4 h-4 text-[#2C241E] transition-transform duration-300 hover:-rotate-12" />
        )}
      </div>

      {showLabel && (
        <span className="text-xs font-semibold pr-1">
          {getModeLabel()}
        </span>
      )}
    </button>
  );
}
