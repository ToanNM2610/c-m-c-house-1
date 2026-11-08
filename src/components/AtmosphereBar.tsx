"use client";

import React, { useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import {
  GiaNghiaWeatherInfo,
  fetchGiaNghiaWeather,
  getGiaNghiaTime,
  getAtmospherePhase,
  getAtmospherePhaseName,
  getStoreOpenStatus,
  STORE_CONSTANTS,
} from "@/lib/atmosphereEngine";
import { PhoneCall, Navigation, CloudSun, Sparkles, Sun, Moon } from "lucide-react";

export default function AtmosphereBar() {
  const { locale } = useLanguage();
  const isEn = locale === "en";
  const { themeMode, theme, isDark, atmospherePhase, toggleTheme, setThemeMode } = useTheme();

  const [weather, setWeather] = useState<GiaNghiaWeatherInfo>({
    connected: false,
    temperatureLabel: isEn ? "Disconnected" : "Chưa kết nối",
    temperatureVal: null,
    isRainy: false,
    conditionVi: "Chưa kết nối",
    conditionEn: "Disconnected",
  });

  const [timeInfo, setTimeInfo] = useState(() => getGiaNghiaTime());
  const [storeStatus, setStoreStatus] = useState(() =>
    getStoreOpenStatus(timeInfo.dayOfWeek, timeInfo.totalMinutes)
  );

  useEffect(() => {
    // 1. Fetch real weather once on mount and every 10 mins
    let isCancelled = false;
    const controller = new AbortController();

    async function loadWeather() {
      try {
        const w = await fetchGiaNghiaWeather(controller.signal);
        if (!isCancelled) {
          setWeather(w);
        }
      } catch {
        if (!isCancelled) {
          setWeather({
            connected: false,
            temperatureLabel: isEn ? "Disconnected" : "Chưa kết nối",
            temperatureVal: null,
            isRainy: false,
            conditionVi: "Chưa kết nối",
            conditionEn: "Disconnected",
          });
        }
      }
    }

    loadWeather();
    const weatherInterval = setInterval(loadWeather, 600000); // 10 minutes

    // 2. Update time & open status every 30s
    const timeInterval = setInterval(() => {
      const now = getGiaNghiaTime();
      setTimeInfo(now);
      setStoreStatus(getStoreOpenStatus(now.dayOfWeek, now.totalMinutes));
    }, 30000);

    return () => {
      isCancelled = true;
      controller.abort();
      clearInterval(weatherInterval);
      clearInterval(timeInterval);
    };
  }, [isEn]);

  const phaseName = getAtmospherePhaseName(atmospherePhase, isEn ? "en" : "vi");

  // Construct status string
  const openLabel = storeStatus.isOpen
    ? isEn
      ? `OPEN NOW · CLOSES AT ${storeStatus.closingTime}`
      : `ĐANG MỞ CỬA · ĐÓNG LÚC ${storeStatus.closingTime}`
    : isEn
    ? `CLOSED · OPENS AT 07:00`
    : `ĐÃ ĐÓNG CỬA · MỞ LÚC 07:00`;

  const weatherDisplay = weather.connected
    ? `${weather.temperatureLabel} · ${isEn ? weather.conditionEn : weather.conditionVi}`
    : isEn
    ? "Weather: Disconnected"
    : "Thời tiết: Chưa kết nối";

  return (
    <div className="atmosphere-status-bar w-full transition-colors text-[var(--text-primary)]">
      <div className="atmosphere-container">
        {/* Nhịp thở thời gian & Trạng thái mở cửa */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs font-mono">
          <div className="flex items-center gap-1.5">
            <span
              className={`w-2 h-2 rounded-full shrink-0 ${
                storeStatus.isOpen ? "bg-[#10B981] animate-pulse" : "bg-[#EF4444]"
              }`}
              aria-hidden="true"
            />
            <span className="font-bold uppercase tracking-wider">{openLabel}</span>
          </div>

          <span className="text-[var(--border-subtle)]" aria-hidden="true">
            |
          </span>

          {/* Pha khí quyển */}
          <span className="label-uppercase-12 px-2 py-0.5 rounded-sm bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--accent-warm)]">
            [{phaseName}]
          </span>

          <span className="text-[var(--border-subtle)] hidden sm:inline" aria-hidden="true">
            |
          </span>

          {/* Thời tiết thực tế */}
          <div className="hidden sm:flex items-center gap-1.5 text-[var(--text-secondary)]">
            <CloudSun className="w-3.5 h-3.5 text-[var(--accent-warm)]" aria-hidden="true" />
            <span>{weatherDisplay}</span>
          </div>

          <span className="text-[var(--border-subtle)] hidden md:inline" aria-hidden="true">
            |
          </span>

          {/* Tọa độ Gia Nghĩa */}
          <span className="hidden md:inline text-[var(--text-secondary)]">
            {STORE_CONSTANTS.coordinates.display}
          </span>
        </div>

        {/* Chuyển đổi nhịp thở (Tự động theo giờ Gia Nghĩa / Thủ công) & 2 CTA Zero Manual Ops */}
        <div className="flex items-center gap-3">
          {/* Nút chuyển chế độ Tự động theo giờ Gia Nghĩa */}
          <button
            type="button"
            onClick={toggleTheme}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono border border-[var(--border-subtle)] bg-[var(--bg-elevated)] hover:bg-[var(--bg-surface)] text-[var(--text-primary)] transition-colors"
            title={
              themeMode === "auto"
                ? isEn
                  ? "Auto by Gia Nghia time (Active) · Click for Manual"
                  : "Tự động theo giờ Gia Nghĩa (Đang bật) · Bấm chuyển Thủ công"
                : isEn
                ? "Manual theme · Click to return to Auto Gia Nghia"
                : "Chế độ Thủ công · Bấm quay về Tự động Gia Nghĩa"
            }
          >
            {themeMode === "auto" ? (
              <>
                <Sparkles className="w-3.5 h-3.5 text-[var(--accent-warm)]" aria-hidden="true" />
                <span className="label-uppercase-12 font-bold text-[var(--accent-warm)]">
                  {isEn ? "AUTO GIA NGHIA" : "TỰ ĐỘNG GIA NGHĨA"}
                </span>
              </>
            ) : isDark ? (
              <>
                <Moon className="w-3.5 h-3.5 text-[var(--accent-warm)]" aria-hidden="true" />
                <span className="label-uppercase-12">{isEn ? "MANUAL DARK" : "TỐI THỦ CÔNG"}</span>
              </>
            ) : (
              <>
                <Sun className="w-3.5 h-3.5 text-[var(--accent-warm)]" aria-hidden="true" />
                <span className="label-uppercase-12">{isEn ? "MANUAL LIGHT" : "SÁNG THỦ CÔNG"}</span>
              </>
            )}
          </button>

          {/* Nhóm CTA chính: Gọi Hotline & Chỉ Đường (Zero Manual Ops) */}
          <div className="primary-cta-group">
            <a
              href={STORE_CONSTANTS.hotlines.primaryTel}
              className="btn-cta-primary text-xs"
              title="Gọi Hotline Cẩm Cù House"
            >
              <PhoneCall className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <span>{isEn ? "CALL HOTLINE" : "GỌI HOTLINE"}</span>
            </a>

            <a
              href={STORE_CONSTANTS.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-cta-secondary text-xs"
              title="Chỉ đường Google Maps đến Cẩm Cù House"
            >
              <Navigation className="w-3.5 h-3.5 shrink-0 text-[var(--accent-warm)]" aria-hidden="true" />
              <span>{isEn ? "DIRECTIONS" : "CHỈ ĐƯỜNG"}</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
