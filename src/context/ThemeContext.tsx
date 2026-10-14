"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { setSharedCookie, getSharedCookie } from "@/utils/storage";

export type Theme = "light" | "dark";

export interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "dark",
  isDark: true,
  toggleTheme: () => {},
  setTheme: () => {},
});

export const THEME_STORAGE_KEY = "camcu_theme";

export const applyTheme = (newTheme: Theme) => {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  if (newTheme === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
};

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Read theme from cookie, localStorage, or default to dark (Section 3)
    const cookieTheme = getSharedCookie(THEME_STORAGE_KEY) as Theme | null;
    const localTheme = (typeof window !== "undefined" ? localStorage.getItem(THEME_STORAGE_KEY) : null) as Theme | null;
    
    let activeTheme: Theme = "dark";
    if (cookieTheme === "light" || cookieTheme === "dark") {
      activeTheme = cookieTheme;
    } else if (localTheme === "light" || localTheme === "dark") {
      activeTheme = localTheme;
    }

    setThemeState(activeTheme);
    applyTheme(activeTheme);

    // Listen to theme change across tabs
    const handleStorage = (e: StorageEvent) => {
      if (e.key === THEME_STORAGE_KEY && (e.newValue === "light" || e.newValue === "dark")) {
        setThemeState(e.newValue);
        applyTheme(e.newValue);
      }
    };
    const handleCustom = (e: Event) => {
      const custom = e as CustomEvent;
      if (custom.detail?.theme) {
        setThemeState(custom.detail.theme);
        applyTheme(custom.detail.theme);
      }
    };

    window.addEventListener("storage", handleStorage);
    window.addEventListener("camcu_theme_change", handleCustom);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("camcu_theme_change", handleCustom);
    };
  }, []);


  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    applyTheme(newTheme);

    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(THEME_STORAGE_KEY, newTheme);
      } catch {}
      setSharedCookie(THEME_STORAGE_KEY, newTheme, 365);
      window.dispatchEvent(
        new CustomEvent("camcu_theme_change", { detail: { theme: newTheme } })
      );
    }
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        isDark: theme === "dark",
        toggleTheme,
        setTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
