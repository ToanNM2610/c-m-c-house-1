"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

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
  const [language, setLanguage] = useState<Language>("vi");

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
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
