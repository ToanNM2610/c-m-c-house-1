"use client";

import React, { useState, useEffect } from "react";
import { Clock, Sun, Moon, Sparkles, Compass, RotateCw, Globe } from "lucide-react";
import { useCanvas } from "@/context/CanvasContext";

// Tọa độ Đắk Nông (Gia Nghĩa), Việt Nam:
// Lat: 11.98° N, Lon: 107.70° E
const DAK_NONG_COORDS = {
  lat: 11.98,
  lon: 107.70,
};

function formatVietnamTime(date: Date) {
  const timeStr = date.toLocaleTimeString("vi-VN", {
    timeZone: "Asia/Ho_Chi_Minh",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  const dateStr = date.toLocaleDateString("vi-VN", {
    timeZone: "Asia/Ho_Chi_Minh",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const hoursVN = Number(
    new Intl.DateTimeFormat("en-US", {
      timeZone: "Asia/Ho_Chi_Minh",
      hour: "numeric",
      hour12: false,
    }).format(date)
  );

  const isDaytime = hoursVN >= 6 && hoursVN < 18;

  return {
    fullClock: `${timeStr} - ${dateStr}`,
    isDaytime,
  };
}

export default function Contact3DScene() {
  const { isAutoSpin, setIsAutoSpin } = useCanvas();
  const [digitalTime, setDigitalTime] = useState<string>("");
  const [isDaytimeVN, setIsDaytimeVN] = useState<boolean>(true);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
    const updateTime = () => {
      const formatted = formatVietnamTime(new Date());
      setDigitalTime(formatted.fullClock);
      setIsDaytimeVN(formatted.isDaytime);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="w-full h-full min-h-[460px] lg:min-h-[560px] relative rounded-3xl overflow-hidden bg-black/40 border border-[#C5A880]/30 shadow-2xl flex flex-col justify-between p-6 select-none pointer-events-auto">
      {/* TOP BAR: Live Digital Clock GMT+7 & Solar Status */}
      <div className="flex flex-wrap items-center justify-between gap-3 z-10">
        {/* Live Clock Pill */}
        <div className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-[#1A0F0A]/95 border border-[#C5A880]/40 shadow-lg">
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[10px] font-mono uppercase font-bold tracking-widest text-[#C5A880]">
              LIVE GMT+7
            </span>
          </div>

          <div className="h-3.5 w-[1px] bg-[#C5A880]/30" />

          <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#F4EFEA] tracking-wider">
            <Clock size={13} className="text-[#C5A880]" />
            <span>{isMounted ? digitalTime : "--:--:-- - --/--/----"}</span>
          </div>
        </div>

        {/* Day / Night Status & Mode Toggle */}
        <div className="flex items-center gap-2.5">
          {/* Day / Night Indicator */}
          <div className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#1A0F0A]/90 border border-[#C5A880]/30 text-xs font-sans">
            {isDaytimeVN ? (
              <>
                <Sun size={13} className="text-amber-400 animate-spin-slow" />
                <span className="text-[#F4EFEA]/90 font-medium text-[11px]">
                  Đắk Nông: <strong className="text-amber-300">Ban ngày</strong>
                </span>
              </>
            ) : (
              <>
                <Moon size={13} className="text-sky-300" />
                <span className="text-[#F4EFEA]/90 font-medium text-[11px]">
                  Đắk Nông: <strong className="text-sky-200">Ban đêm</strong>
                </span>
              </>
            )}
          </div>

          {/* Realtime vs Auto-spin Toggle */}
          <button
            type="button"
            onClick={() => setIsAutoSpin(!isAutoSpin)}
            title={
              isAutoSpin
                ? "Chuyển về Đồng bộ giờ thực UTC"
                : "Chuyển sang Tự động xoay 360°"
            }
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[11px] font-sans font-medium tracking-wider transition-all duration-300 cursor-pointer border ${
              isAutoSpin
                ? "bg-[#C5A880] text-[#1A0F0A] border-[#C5A880] font-semibold shadow-md"
                : "bg-[#1A0F0A]/90 text-[#C5A880] border-[#C5A880]/35 hover:border-[#C5A880]"
            }`}
          >
            {isAutoSpin ? (
              <>
                <RotateCw size={12} className="animate-spin" />
                <span>Tự xoay</span>
              </>
            ) : (
              <>
                <Compass size={12} />
                <span>Giờ thực UTC</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* CENTER HUD: Focus Ring Indicator */}
      <div className="my-auto flex flex-col items-center justify-center pointer-events-none text-center py-12">
        <div className="w-20 h-20 rounded-full border border-dashed border-[#C5A880]/30 flex items-center justify-center animate-spin-slow">
          <Globe size={24} className="text-[#C5A880]/60" />
        </div>
        <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#C5A880]/80 mt-4">
          GLOBAL 3D SANCTUARY
        </span>
        <span className="text-xs font-serif italic text-[#F4EFEA]/60 mt-1">
          Bản đồ Trái Đất 3D đồng bộ ánh sáng Mặt Trời theo thời gian thực
        </span>
      </div>

      {/* BOTTOM BAR: Thông tin tọa độ & Hướng dẫn */}
      <div className="z-10 flex flex-wrap items-center justify-between gap-3 px-4 py-3 rounded-2xl bg-[#1A0F0A]/95 border border-[#C5A880]/30 shadow-lg">
        <div className="flex items-center gap-2 text-xs font-mono text-[#C5A880]">
          <span className="w-2 h-2 rounded-full bg-[#C5A880] animate-pulse"></span>
          <span className="font-semibold tracking-wide">
            ĐẮK NÔNG: {DAK_NONG_COORDS.lat}°N, {DAK_NONG_COORDS.lon}°E
          </span>
          <span className="hidden sm:inline text-[#F4EFEA]/40">•</span>
          <span className="hidden sm:inline font-sans text-[11px] text-[#F4EFEA]/70">
            Cẩm Cù House Gia Nghĩa
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] font-sans text-[#F4EFEA]/70 tracking-wider">
          <Sparkles size={12} className="text-[#C5A880]" />
          <span>✦ Đèn hải đăng định vị phát sáng liên tục</span>
        </div>
      </div>
    </div>
  );
}
