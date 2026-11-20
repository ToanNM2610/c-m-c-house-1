'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { DatabaseSchema, SpatialPlate, SiteContent } from '@/types';
import { initialDbData } from '@/lib/seedData';

export type Language = 'vi' | 'en';
export type Theme = 'light' | 'dark';

interface AppContextType {
  data: DatabaseSchema;
  content: SiteContent;
  isLoading: boolean;
  refreshData: () => Promise<void>;

  // Bilingual Engine
  language: Language;
  setLanguage: (lang: Language) => void;

  // Daylight / Evening Theme Engine
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;

  // Motion & Page Transitions
  enableAnimations: boolean;
  motionIntensity: 'OFF' | 'SUBTLE' | 'VIVID';

  // Gallery Lightbox
  activeLightboxPlate: SpatialPlate | null;
  openLightbox: (plate: SpatialPlate) => void;
  closeLightbox: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<DatabaseSchema>(initialDbData);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Language & Theme State
  const [language, setLanguageState] = useState<Language>('vi');
  const [theme, setThemeState] = useState<Theme>('light');

  // Lightbox modal state
  const [activeLightboxPlate, setActiveLightboxPlate] = useState<SpatialPlate | null>(null);

  // Initialize Language & Theme from localStorage / DB settings
  useEffect(() => {
    try {
      const savedLang = localStorage.getItem('camcu_language') as Language | null;
      if (savedLang === 'vi' || savedLang === 'en') {
        setLanguageState(savedLang);
      } else if (data.settings.defaultLanguage) {
        setLanguageState(data.settings.defaultLanguage);
      }

      const savedTheme = localStorage.getItem('camcu_theme') as Theme | null;
      if (savedTheme === 'light' || savedTheme === 'dark') {
        setThemeState(savedTheme);
      } else if (data.settings.defaultTheme === 'dark') {
        setThemeState('dark');
      } else if (data.settings.defaultTheme === 'auto') {
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        setThemeState(prefersDark ? 'dark' : 'light');
      } else {
        setThemeState('light');
      }
    } catch {
      // LocalStorage not available or SSR
    }
  }, [data.settings.defaultLanguage, data.settings.defaultTheme]);

  // Apply Theme & Font attributes & dynamic custom properties to DOM
  useEffect(() => {
    try {
      const root = document.documentElement;
      root.setAttribute('data-theme', theme);
      root.setAttribute('data-font', data.settings.fontPreset || 'sans-be-vietnam');
      root.lang = language;

      if (theme === 'light') {
        const bg = data.settings.lightBgHex || '#F6F3EC';
        const accent = data.settings.lightAccentHex || '#2E5A3C';
        root.style.setProperty('--bg-paper', bg);
        root.style.setProperty('--accent-botanical', accent);
      } else {
        const bg = data.settings.darkBgHex || '#111915';
        const accent = data.settings.darkAccentHex || '#4C9A67';
        root.style.setProperty('--bg-paper', bg);
        root.style.setProperty('--accent-botanical', accent);
      }
    } catch {
      // SSR
    }
  }, [
    theme,
    language,
    data.settings.fontPreset,
    data.settings.lightBgHex,
    data.settings.lightAccentHex,
    data.settings.darkBgHex,
    data.settings.darkAccentHex,
  ]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('camcu_language', lang);
      document.documentElement.lang = lang;
    } catch {
      // ignore
    }
  };

  const setTheme = (t: Theme) => {
    setThemeState(t);
    try {
      localStorage.setItem('camcu_theme', t);
      document.documentElement.setAttribute('data-theme', t);
    } catch {
      // ignore
    }
  };

  const toggleTheme = () => {
    const nextTheme: Theme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
  };

  // Fetch / Sync Data
  const fetchData = useCallback(async () => {
    try {
      const res = await fetch('/api/bootstrap', { cache: 'no-store' });
      if (res.ok) {
        const freshData: DatabaseSchema = await res.json();
        setData(freshData);
      }
    } catch (err) {
      console.error('Error polling /api/bootstrap:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Real-time zero-delay BroadcastChannel sync + background polling fallback
  useEffect(() => {
    fetchData();

    let channel: BroadcastChannel | null = null;
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        channel = new BroadcastChannel('camcu_cms_sync');
        channel.onmessage = (event) => {
          if (event.data?.type === 'CMS_UPDATED' || event.data === 'sync') {
            fetchData();
          }
        };
      } catch (err) {
        console.warn('BroadcastChannel sync init:', err);
      }
    }

    const interval = setInterval(() => {
      fetchData();
    }, 5000);

    return () => {
      if (channel) {
        channel.close();
      }
      clearInterval(interval);
    };
  }, [fetchData]);

  const openLightbox = (plate: SpatialPlate) => setActiveLightboxPlate(plate);
  const closeLightbox = () => setActiveLightboxPlate(null);

  const motionIntensity = ((data.settings.motionIntensity as 'OFF' | 'SUBTLE' | 'VIVID') || 'VIVID');
  const enableAnimations = data.settings.enableAnimations !== false && motionIntensity !== 'OFF';

  return (
    <AppContext.Provider
      value={{
        data,
        content: data.content,
        isLoading,
        refreshData: fetchData,
        language,
        setLanguage,
        theme,
        setTheme,
        toggleTheme,
        enableAnimations,
        motionIntensity,
        activeLightboxPlate,
        openLightbox,
        closeLightbox,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
