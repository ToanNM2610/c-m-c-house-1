"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import translationsData from "@/data/translations.json";

export type Language = "vi" | "en";
export type Currency = "VND" | "USD";

interface LanguageContextType {
  lang: Language;
  currency: Currency;
  setLang: (lang: Language) => void;
  setCurrency: (currency: Currency) => void;
  formatPrice: (price: string | number) => string;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  // Mặc định ban đầu là Tiếng Việt ('vi' / VND)
  const [lang, setLangState] = useState<Language>("vi");
  const [currency, setCurrencyState] = useState<Currency>("VND");
  const [, setIsMounted] = useState(false);

  useEffect(() => {
    try {
      const savedLang = localStorage.getItem("camcu-lang") as Language;
      if (savedLang === "vi" || savedLang === "en") {
        setLangState(savedLang);
        setCurrencyState(savedLang === "en" ? "USD" : "VND");
      }
    } catch (e) {
      // Ignore localStorage errors (e.g. incognito)
    }
    setIsMounted(true);
  }, []);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    // Chuyển đổi tiền tệ đồng bộ: 'en' -> USD, 'vi' -> VND
    const newCurrency: Currency = newLang === "en" ? "USD" : "VND";
    setCurrencyState(newCurrency);
    try {
      localStorage.setItem("camcu-lang", newLang);
      localStorage.setItem("camcu-currency", newCurrency);
    } catch (e) {}
  };

  const setCurrency = (newCurrency: Currency) => {
    setCurrencyState(newCurrency);
    try {
      localStorage.setItem("camcu-currency", newCurrency);
    } catch (e) {}
  };

  /**
   * Chuyển đổi định dạng giá linh hoạt theo tiền tệ và ngôn ngữ:
   * - Tiếng Việt: Giữ nguyên VNĐ (ví dụ: "28.000đ")
   * - Tiếng Anh: Quy đổi sang USD theo tỷ giá 25.000đ ≈ 1$ (ví dụ: "$1.10", "$1.20", "$2.50")
   */
  const formatPrice = (price: string | number): string => {
    if (price === undefined || price === null || price === "") return "";

    const rawStr = String(price);
    const cleanStr = rawStr.replace(/[^0-9]/g, "");
    if (!cleanStr) return rawStr;

    const numericVnd = parseInt(cleanStr, 10);
    if (isNaN(numericVnd)) return rawStr;

    if (currency === "USD" || lang === "en") {
      // Tỷ giá quy đổi: 25.000 VND ≈ $1.00 USD
      // Làm tròn 5 cent chuẩn phong cách Specialty Coffee Menu ($1.10, $1.20, $1.40, v.v.)
      const usd = Math.round((numericVnd / 25000) * 20) / 20;
      return `$${usd.toFixed(2)}`;
    }

    // Định dạng VNĐ
    if (rawStr.includes("đ") || rawStr.includes("₫")) {
      return rawStr;
    }
    return `${numericVnd.toLocaleString("vi-VN")}đ`;
  };

  const translateWithLang = (key: string, currentLang: Language): string => {
    const keys = key.split(".");
    let current: any = (translationsData as any)[currentLang];

    for (const k of keys) {
      if (current === undefined || current === null) {
        // Fallback to 'vi'
        let fallback: any = (translationsData as any)["vi"];
        for (const fbKey of keys) {
          if (fallback === undefined || fallback === null) return key;
          fallback = fallback[fbKey];
        }
        return fallback || key;
      }
      current = current[k];
    }

    return current !== undefined && current !== null ? current : key;
  };

  const t = (key: string): string => {
    return translateWithLang(key, lang);
  };

  return (
    <LanguageContext.Provider value={{ lang, currency, setLang, setCurrency, formatPrice, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
