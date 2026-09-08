"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import translationsData from "@/data/translations.json";

export type Language = "vi" | "en";
export type Currency = "VND" | "USD";

// Exchange rate: 25,000 VND = 1 USD
const USD_RATE = 25000;

interface MenuItemTranslation {
  name: string;
  desc: string;
}

interface LanguageContextType {
  lang: Language;
  currency: Currency;
  setLang: (lang: Language) => void;
  setCurrency: (currency: Currency) => void;
  /** Format a VND price number/string to locale-appropriate display */
  formatPrice: (price: string | number) => string;
  /** Translate a dot-path key, e.g. t("nav.home") */
  t: (key: string) => string;
  /** Get translated menu item name + desc by item ID */
  tMenuItem: (id: string) => MenuItemTranslation;
  /** Category tabs: map VN category name → localised display */
  tCat: (viCategory: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// VND → rounded USD specialty-coffee style ($X.XX rounded to nearest $0.05)
function vndToUsd(vnd: number): string {
  const raw = vnd / USD_RATE;
  const rounded = Math.round(raw * 20) / 20; // nearest $0.05
  return `$${rounded.toFixed(2)}`;
}

// Category map: VN → EN tab label in UI
const CAT_MAP_VI_TO_EN: Record<string, string> = {
  "Cà Phê": "COFFEE",
  "Trà": "TEA",
  "Sinh Tố": "SMOOTHIES",
  "Nước Ép": "FRESH JUICES",
  "Soda & Sữa Chua": "SODA & YOGURT",
  "Khác": "OTHERS",
  "Món Ăn": "FOOD",
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>("vi");
  const [currency, setCurrencyState] = useState<Currency>("VND");

  // Restore saved locale from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("camcu-lang") as Language;
      if (saved === "vi" || saved === "en") {
        setLangState(saved);
        setCurrencyState(saved === "en" ? "USD" : "VND");
      }
    } catch {
      // Ignore in incognito / SSR
    }
  }, []);

  /** Switch language & currency atomically, persist to localStorage */
  const setLang = useCallback((newLang: Language) => {
    const newCurrency: Currency = newLang === "en" ? "USD" : "VND";
    setLangState(newLang);
    setCurrencyState(newCurrency);
    try {
      localStorage.setItem("camcu-lang", newLang);
      localStorage.setItem("camcu-currency", newCurrency);
    } catch {
      // Ignore
    }
  }, []);

  const setCurrency = useCallback((newCurrency: Currency) => {
    setCurrencyState(newCurrency);
    try {
      localStorage.setItem("camcu-currency", newCurrency);
    } catch {}
  }, []);

  /**
   * Format a price value (number or "xx.000 VNĐ" string) to locale currency:
   * - vi/VND → "20.000đ"  (Vietnamese dot-thousands format)
   * - en/USD → "$0.80"    (converted at 25,000 VND = $1.00, rounded to $0.05)
   */
  const formatPrice = useCallback(
    (price: string | number): string => {
      if (price === undefined || price === null || price === "") return "";

      // Extract numeric value (strip any non-digit chars)
      const numeric =
        typeof price === "number"
          ? price
          : parseInt(String(price).replace(/[^0-9]/g, ""), 10);

      if (isNaN(numeric)) return String(price);

      if (lang === "en" || currency === "USD") {
        return vndToUsd(numeric);
      }

      // Vietnamese format: 20,000 → "20.000đ"
      return numeric.toLocaleString("vi-VN") + "đ";
    },
    [lang, currency]
  );

  /**
   * Translate a dot-notation key from translations.json.
   * Falls back to "vi" if key not found in current lang, then returns the raw key.
   */
  const t = useCallback(
    (key: string): string => {
      const keys = key.split(".");
      const traverse = (obj: unknown): string | undefined => {
        let cur: unknown = obj;
        for (const k of keys) {
          if (cur === null || typeof cur !== "object") return undefined;
          cur = (cur as Record<string, unknown>)[k];
        }
        return typeof cur === "string" ? cur : undefined;
      };

      const localeObj = (translationsData as Record<string, unknown>)[lang];
      const result = traverse(localeObj);
      if (result !== undefined) return result;

      // Fallback to Vietnamese
      const fallback = traverse(
        (translationsData as Record<string, unknown>)["vi"]
      );
      return fallback ?? key;
    },
    [lang]
  );

  /**
   * Get translated menu item name + desc by item id (e.g. "cf-3").
   * Falls back to Vietnamese if English not found.
   */
  const tMenuItem = useCallback(
    (id: string): MenuItemTranslation => {
      const localeItems = (
        (translationsData as Record<string, unknown>)[lang] as Record<
          string,
          unknown
        >
      )?.["menuItems"] as Record<string, MenuItemTranslation> | undefined;

      if (localeItems?.[id]) return localeItems[id];

      // Fallback to vi
      const viItems = (
        (translationsData as Record<string, unknown>)["vi"] as Record<
          string,
          unknown
        >
      )?.["menuItems"] as Record<string, MenuItemTranslation> | undefined;

      return viItems?.[id] ?? { name: id, desc: "" };
    },
    [lang]
  );

  /**
   * Given a Vietnamese category name (as stored in menu.ts), return the
   * localised display string for the current language.
   */
  const tCat = useCallback(
    (viCategory: string): string => {
      if (lang === "vi") return viCategory;
      return CAT_MAP_VI_TO_EN[viCategory] ?? viCategory;
    },
    [lang]
  );

  return (
    <LanguageContext.Provider
      value={{ lang, currency, setLang, setCurrency, formatPrice, t, tMenuItem, tCat }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within a LanguageProvider");
  return ctx;
}
