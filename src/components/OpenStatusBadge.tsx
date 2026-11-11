"use client";

import React, { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { CAM_CU_HOUSE_INFO } from "@/data/camCuHouseData";

interface OpenStatusBadgeProps {
  className?: string;
  showDetails?: boolean;
}

export function getVietnamStoreStatus(now = new Date()) {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Ho_Chi_Minh",
    hour12: false,
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

  const parts = formatter.formatToParts(now);
  const map = Object.fromEntries(parts.map((p) => [p.type, p.value]));
  const hour = parseInt(map.hour, 10) % 24;
  const minute = parseInt(map.minute, 10);
  const totalMinutes = hour * 60 + minute;

  const dayMap: Record<string, number> = { Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6, Sun: 0 };
  const dayOfWeek = dayMap[map.weekday] ?? now.getDay();

  // Thứ 6 (5), Thứ 7 (6), Chủ Nhật (0): 07:00 (420) – 22:00 (1320)
  // Thứ 2 – Thứ 5 (1, 2, 3, 4): 07:00 (420) – 18:00 (1080)
  const isWeekendSchedule = dayOfWeek === 5 || dayOfWeek === 6 || dayOfWeek === 0;
  const openMinutes = 7 * 60; // 07:00
  const closeMinutes = isWeekendSchedule ? 22 * 60 : 18 * 60;
  const closingTimeStr = isWeekendSchedule ? "22:00" : "18:00";

  const isOpen = totalMinutes >= openMinutes && totalMinutes < closeMinutes;

  return {
    isOpen,
    hour,
    minute,
    totalMinutes,
    dayOfWeek,
    isWeekendSchedule,
    closingTimeStr,
    formattedTime: `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`,
  };
}

export default function OpenStatusBadge({ className = "", showDetails = true }: OpenStatusBadgeProps) {
  const { locale } = useLanguage();
  const isVi = locale !== "en";

  const [status, setStatus] = useState(() => getVietnamStoreStatus());

  useEffect(() => {
    // Cập nhật trạng thái mỗi phút
    const timer = setInterval(() => {
      setStatus(getVietnamStoreStatus());
    }, 30000);

    return () => clearInterval(timer);
  }, []);

  const { isOpen, closingTimeStr } = status;

  return (
    <div
      className={`inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border text-[13px] font-mono transition-colors ${
        isOpen
          ? "bg-[#1E4D32]/10 border-[#1E4D32]/30 text-[#1E4D32] dark:bg-[#7FD19E]/10 dark:border-[#7FD19E]/30 dark:text-[#7FD19E]"
          : "bg-[#8A3C19]/10 border-[#8A3C19]/30 text-[#8A3C19] dark:bg-[#F0B27A]/10 dark:border-[#F0B27A]/30 dark:text-[#F0B27A]"
      } ${className}`}
      role="status"
      aria-live="polite"
    >
      <span className="relative flex h-2.5 w-2.5">
        {isOpen && (
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
        )}
        <span
          className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
            isOpen ? "bg-emerald-500" : "bg-amber-600"
          }`}
        />
      </span>

      <span className="font-medium whitespace-nowrap">
        {isOpen ? (
          isVi ? (
            <>
              Đang mở cửa đón gió bên suối
              {showDetails && ` • Đóng cửa lúc ${closingTimeStr}`}
            </>
          ) : (
            <>
              Open now by the stream
              {showDetails && ` • Closes at ${closingTimeStr}`}
            </>
          )
        ) : isVi ? (
          <>
            Hẹn gặp bạn lúc 07:00 sáng mai
            {showDetails && " • Có nhận đặt chỗ trước"}
          </>
        ) : (
          <>
            See you tomorrow at 07:00 AM
            {showDetails && " • Reservations welcome"}
          </>
        )}
      </span>
    </div>
  );
}

