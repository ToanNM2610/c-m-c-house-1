"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
  useMemo,
} from "react";
import { translations, Locale, TranslationDictionary } from "@/lib/translations";
import { getSharedCookie, setSharedCookie } from "@/utils/storage";
import { getSharedData, setSharedData, KEYS } from "@/lib/syncStore";

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

  // Dynamic Content Blocks synced in real-time (1ms) from syncStore / Admin
  const [contentOverrides, setContentOverrides] = useState<{ vi: any; en: any }>(() => {
    return getSharedData(KEYS.CONTENT_BLOCKS, { vi: {}, en: {} });
  });

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

    // Hydrate Content Blocks / Overrides from syncStore or API
    try {
      const savedOverrides = getSharedData<any>(KEYS.CONTENT_OVERRIDES, null);
      const savedBlocks = getSharedData<any>(KEYS.CONTENT_BLOCKS, null);
      if (savedOverrides && Object.keys(savedOverrides).length > 0) {
        setContentOverrides(savedOverrides);
      } else if (savedBlocks && (savedBlocks.vi || savedBlocks.en)) {
        setContentOverrides(savedBlocks);
      } else {
        fetch("/api/admin/content")
          .then((r) => r.json())
          .then((d) => {
            if (d && d.content) {
              setContentOverrides(d.content);
              setSharedData(KEYS.CONTENT_BLOCKS, d.content);
            }
          })
          .catch(() => {});
      }
    } catch (_) {}

    // 1ms Real-time Instant Sync Listener across tabs & window
    const handleSync = (e: Event) => {
      const custom = e as CustomEvent;
      if (
        custom.detail?.key === KEYS.CONTENT_BLOCKS ||
        custom.detail?.key === KEYS.CONTENT_OVERRIDES
      ) {
        if (custom.detail.value) {
          setContentOverrides(custom.detail.value);
        }
      }
    };
    window.addEventListener("camcu_sync_update", handleSync);

    setMounted(true);
    return () => window.removeEventListener("camcu_sync_update", handleSync);
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

  // Deeply merge content overrides with base dictionary in real-time (Song ngữ chuẩn xác: viết ra viết, anh ra anh)
  const mergedDict = useMemo<TranslationDictionary>(() => {
    const base = translations[locale] || defaultDict;
    if (!contentOverrides || typeof contentOverrides !== "object") return base;

    const result: any = { ...base };

    // Format 1: { vi: { section: {...} }, en: { section: {...} } }
    if (contentOverrides[locale] && typeof contentOverrides[locale] === "object") {
      const overridesForLocale = contentOverrides[locale];
      for (const section of Object.keys(overridesForLocale)) {
        if (result[section] && typeof result[section] === "object") {
          result[section] = {
            ...result[section],
            ...overridesForLocale[section],
          };
        } else {
          result[section] = overridesForLocale[section];
        }
      }
    } else {
      // Format 2: { section: { vi: {...}, en: {...} } }
      for (const [section, sectionData] of Object.entries(contentOverrides)) {
        const langData = (sectionData as any)?.[locale];
        if (langData && typeof langData === "object") {
          result[section] = {
            ...(result[section] || {}),
            ...langData,
          };
        }
      }
    }

    return result as TranslationDictionary;
  }, [locale, contentOverrides]);

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
      let current: any = mergedDict;
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
    [locale, mergedDict]
  );

  const value: LanguageContextType = {
    locale,
    setLocale,
    language: locale,
    lang: locale === "en" ? "EN" : "VN",
    setLanguage,
    setLang: setLanguage,
    t,
    dict: mergedDict,
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
