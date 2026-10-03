"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { translations, Locale, TranslationDictionary } from "@/lib/translations";
import { getSharedCookie, setSharedCookie } from "@/utils/storage";

export type Language = "vi" | "en" | "VN" | "EN" | string;

export interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  language: Locale;
  lang: "VN" | "EN";
  setLanguage: (lang: Language) => void;
  setLang: (lang: Language) => void;
  t: (keyOrVnText: string, fallbackEn?: string) => string;
  dict: TranslationDictionary;
}

const defaultDict = translations.vi;

const LanguageContext = createContext<LanguageContextType>({
  locale: "vi",
  setLocale: () => {},
  language: "vi",
  lang: "VN",
  setLanguage: () => {},
  setLang: () => {},
  t: (keyOrVnText: string, fallbackEn?: string) => fallbackEn || keyOrVnText,
  dict: defaultDict,
});

export const CAMCU_LOCALE_KEY = "camcu_locale";

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("vi");
  const [mounted, setMounted] = useState(false);

  // Hydrate initial locale from cookie or localStorage
  useEffect(() => {
    try {
      // 1. Try Shared Cookie
      const cookieLocale = getSharedCookie(CAMCU_LOCALE_KEY) || getSharedCookie("camcu_lang");
      if (cookieLocale === "en" || cookieLocale === "vi") {
        setLocaleState(cookieLocale as Locale);
      } else {
        // 2. Try localStorage
        const local = localStorage.getItem(CAMCU_LOCALE_KEY) || localStorage.getItem("camcu_lang");
        if (local === "en" || local === "vi") {
          setLocaleState(local as Locale);
        }
      }
    } catch (_) {}
    setMounted(true);
  }, []);

  const setLocale = useCallback((newLocale: Locale) => {
    const normalized: Locale = newLocale === "en" ? "en" : "vi";
    setLocaleState(normalized);

    try {
      localStorage.setItem(CAMCU_LOCALE_KEY, normalized);
      localStorage.setItem("camcu_lang", normalized);
      setSharedCookie(CAMCU_LOCALE_KEY, normalized, 365);
      setSharedCookie("camcu_lang", normalized, 365);
      // Update HTML lang attribute for accessibility & SEO
      document.documentElement.lang = normalized;
    } catch (_) {}
  }, []);

  const setLanguage = useCallback((l: Language) => {
    const normalized = l.toLowerCase();
    setLocale(normalized === "en" ? "en" : "vi");
  }, [setLocale]);

  // Dual translation resolver: supports dictionary path ('home.heroTitleLine1') AND direct dual text ('Trang Chủ', 'Home')
  const t = useCallback(
    (keyOrVnText: string, fallbackEn?: string): string => {
      // 1. If fallbackEn is supplied and locale is 'en', return fallbackEn immediately
      if (locale === "en" && fallbackEn !== undefined) {
        return fallbackEn;
      }
      if (locale === "vi" && fallbackEn !== undefined) {
        return keyOrVnText;
      }

      // 2. Resolve dot-notation path like "common.brandName"
      const keys = keyOrVnText.split(".");
      let current: any = translations[locale];
      for (const k of keys) {
        if (current && typeof current === "object" && k in current) {
          current = current[k];
        } else {
          current = null;
          break;
        }
      }

      if (typeof current === "string") {
        return current;
      }

      // 3. Fallback
      return keyOrVnText;
    },
    [locale]
  );

  const value: LanguageContextType = {
    locale,
    setLocale,
    language: locale,
    lang: locale === "en" ? "EN" : "VN",
    setLanguage,
    setLang: setLanguage,
    t,
    dict: translations[locale] || defaultDict,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
