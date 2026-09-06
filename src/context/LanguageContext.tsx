"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import translationsData from "@/data/translations.json";

export type Language = "vi" | "en";

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>("en");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    try {
      const savedLang = localStorage.getItem("camcu-lang") as Language;
      if (savedLang === "vi" || savedLang === "en") {
        setLangState(savedLang);
      }
    } catch (e) {
      // Ignore localStorage errors (e.g. incognito)
    }
    setIsMounted(true);
  }, []);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    try {
      localStorage.setItem("camcu-lang", newLang);
    } catch (e) {}
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
    <LanguageContext.Provider value={{ lang, setLang, t }}>
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
