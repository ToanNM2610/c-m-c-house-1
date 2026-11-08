"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import { setSharedCookie, getSharedCookie } from "@/utils/storage";
import {
  AtmospherePhase,
  getGiaNghiaTime,
  getAtmospherePhase,
} from "@/lib/atmosphereEngine";

export type Theme = "light" | "dark";
export type ThemeMode = "auto" | "light" | "dark";

export interface ThemeContextType {
  theme: Theme;
  themeMode: ThemeMode;
  atmospherePhase: AtmospherePhase;
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  setThemeMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "dark",
  themeMode: "auto",
  atmospherePhase: "night",
  isDark: true,
  toggleTheme: () => {},
  setTheme: () => {},
  setThemeMode: () => {},
});

export const THEME_STORAGE_KEY = "camcu_theme";
export const THEME_MODE_STORAGE_KEY = "camcu_theme_mode";

export const applyTheme = (newTheme: Theme, phase?: AtmospherePhase) => {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.setAttribute("data-theme", newTheme);
  if (phase) {
    root.setAttribute("data-phase", phase);
  }
  if (newTheme === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
};

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeMode, setThemeModeState] = useState<ThemeMode>("auto");
  const [theme, setThemeState] = useState<Theme>("dark");
  const [atmospherePhase, setAtmospherePhase] = useState<AtmospherePhase>("night");
  const [mounted, setMounted] = useState(false);

  const calculateAtmosphere = useCallback(() => {
    const timeInfo = getGiaNghiaTime();
    const phase = getAtmospherePhase(timeInfo.totalMinutes);
    return { timeInfo, phase };
  }, []);

  const updateResolvedTheme = useCallback(
    (mode: ThemeMode, manualTheme?: Theme) => {
      const { phase } = calculateAtmosphere();
      setAtmospherePhase(phase);

      let resolvedTheme: Theme = "dark";
      if (mode === "auto") {
        resolvedTheme = phase === "night" ? "dark" : "light";
      } else {
        resolvedTheme = manualTheme || (mode === "light" ? "light" : "dark");
      }

      setThemeState(resolvedTheme);
      applyTheme(resolvedTheme, phase);
      return resolvedTheme;
    },
    [calculateAtmosphere]
  );

  useEffect(() => {
    setMounted(true);

    // Read stored mode & theme
    const storedMode = (getSharedCookie(THEME_MODE_STORAGE_KEY) ||
      (typeof window !== "undefined" ? localStorage.getItem(THEME_MODE_STORAGE_KEY) : null)) as ThemeMode | null;

    const cookieTheme = getSharedCookie(THEME_STORAGE_KEY) as Theme | null;
    const localTheme = (typeof window !== "undefined" ? localStorage.getItem(THEME_STORAGE_KEY) : null) as Theme | null;

    const activeMode: ThemeMode = storedMode === "light" || storedMode === "dark" || storedMode === "auto" ? storedMode : "auto";
    const manualTheme: Theme | undefined =
      cookieTheme === "light" || cookieTheme === "dark"
        ? cookieTheme
        : localTheme === "light" || localTheme === "dark"
        ? localTheme
        : undefined;

    setThemeModeState(activeMode);
    updateResolvedTheme(activeMode, manualTheme);

    // Interval to refresh atmosphere phase every 60s
    const timer = setInterval(() => {
      setThemeModeState((currMode) => {
        if (currMode === "auto") {
          updateResolvedTheme("auto");
        } else {
          const { phase } = calculateAtmosphere();
          setAtmospherePhase(phase);
          document.documentElement.setAttribute("data-phase", phase);
        }
        return currMode;
      });
    }, 60000);

    // Cross-tab synchronization
    const handleStorage = (e: StorageEvent) => {
      if (e.key === THEME_MODE_STORAGE_KEY && (e.newValue === "auto" || e.newValue === "light" || e.newValue === "dark")) {
        setThemeModeState(e.newValue);
        updateResolvedTheme(e.newValue);
      } else if (e.key === THEME_STORAGE_KEY && (e.newValue === "light" || e.newValue === "dark")) {
        setThemeState(e.newValue);
        applyTheme(e.newValue);
      }
    };

    const handleCustom = (e: Event) => {
      const custom = e as CustomEvent;
      if (custom.detail?.themeMode) {
        setThemeModeState(custom.detail.themeMode);
        updateResolvedTheme(custom.detail.themeMode);
      } else if (custom.detail?.theme) {
        setThemeState(custom.detail.theme);
        applyTheme(custom.detail.theme);
      }
    };

    window.addEventListener("storage", handleStorage);
    window.addEventListener("camcu_theme_change", handleCustom);

    return () => {
      clearInterval(timer);
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("camcu_theme_change", handleCustom);
    };
  }, [calculateAtmosphere, updateResolvedTheme]);

  const setThemeMode = (mode: ThemeMode) => {
    setThemeModeState(mode);
    const resolvedTheme = updateResolvedTheme(mode);

    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(THEME_MODE_STORAGE_KEY, mode);
        localStorage.setItem(THEME_STORAGE_KEY, resolvedTheme);
      } catch {}
      setSharedCookie(THEME_MODE_STORAGE_KEY, mode, 365);
      setSharedCookie(THEME_STORAGE_KEY, resolvedTheme, 365);
      window.dispatchEvent(
        new CustomEvent("camcu_theme_change", { detail: { themeMode: mode, theme: resolvedTheme } })
      );
    }
  };

  const setTheme = (newTheme: Theme) => {
    setThemeModeState(newTheme);
    setThemeState(newTheme);
    const { phase } = calculateAtmosphere();
    applyTheme(newTheme, phase);

    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(THEME_MODE_STORAGE_KEY, newTheme);
        localStorage.setItem(THEME_STORAGE_KEY, newTheme);
      } catch {}
      setSharedCookie(THEME_MODE_STORAGE_KEY, newTheme, 365);
      setSharedCookie(THEME_STORAGE_KEY, newTheme, 365);
      window.dispatchEvent(
        new CustomEvent("camcu_theme_change", { detail: { themeMode: newTheme, theme: newTheme } })
      );
    }
  };

  const toggleTheme = () => {
    // Cycle: auto -> light -> dark -> auto
    if (themeMode === "auto") {
      setTheme("light");
    } else if (themeMode === "light") {
      setTheme("dark");
    } else {
      setThemeMode("auto");
    }
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        themeMode,
        atmospherePhase,
        isDark: theme === "dark",
        toggleTheme,
        setTheme,
        setThemeMode,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
