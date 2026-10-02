"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

export type Language = "vi" | "en" | "VN" | "EN" | string;

export interface LanguageContextType {
  language: Language;
  lang: Language;
  setLanguage: (lang: Language) => void;
  setLang: (lang: Language) => void;
  t: (vnText: string, enText?: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  language: "vi",
  lang: "vi",
  setLanguage: () => {},
  setLang: () => {},
  t: (vnText: string) => vnText,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("vi");
  const [mounted, setMounted] = useState(false);

  // Restore saved language from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("camcu_lang");
      if (saved === "en" || saved === "vi") {
        setLanguageState(saved);
      }
    } catch (_) {}
    setMounted(true);
  }, []);

  const setLanguage = (lang: Language) => {
    const normalized = lang.toLowerCase() as Language;
    setLanguageState(normalized);
    try {
      localStorage.setItem("camcu_lang", normalized as string);
    } catch (_) {}
  };

  const t = (vnText: string, enText?: string) => {
    if (language.toLowerCase() === "en" && enText) return enText;
    return vnText;
  };

  const value: LanguageContextType = {
    language,
    lang: language,
    setLanguage,
    setLang: setLanguage,
    t,
  };

  return (
    <LanguageContext.Provider value={value}>
      {mounted ? children : children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
