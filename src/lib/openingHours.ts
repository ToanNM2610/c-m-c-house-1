/**
 * Realtime Opening Hours & Store Status Utility (GMT+7 / Asia/Ho_Chi_Minh)
 * Handles automatic schedule calculation, approaching-closing warnings,
 * and Admin manual overrides (Auto / Force Open / Force Closed).
 */

import { useState, useEffect } from "react";
import { getStoredData, setStoredData, getSharedCookie, setSharedCookie } from "@/utils/storage";

export const CAMCU_STORE_OVERRIDE_KEY = "camcu_store_override";

export type StoreOverrideMode = "auto" | "force_open" | "force_closed";

export interface StoreRealtimeStatus {
  status: "open" | "closing_soon" | "closed";
  badgeType: "open" | "closing_soon" | "closed";
  badgeText: string;
  shortBadge: string;
  closingTime: string;
  scheduleText: string;
  currentTimeVN: string;
  overrideMode: StoreOverrideMode;
  minutesRemaining?: number;
  isOpen: boolean;
}

/**
 * Get current time in Vietnam Timezone (Asia/Ho_Chi_Minh - UTC+7)
 */
export function getVietnamTime(): Date {
  const now = new Date();
  const vnTimeStr = now.toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" });
  return new Date(vnTimeStr);
}

/**
 * Get current Admin store override mode
 */
export function getStoreOverride(): StoreOverrideMode {
  if (typeof window === "undefined") return "auto";
  const cookieVal = getSharedCookie(CAMCU_STORE_OVERRIDE_KEY);
  if (cookieVal === "force_open" || cookieVal === "force_closed" || cookieVal === "auto") {
    return cookieVal;
  }
  const localVal = getStoredData<StoreOverrideMode>(CAMCU_STORE_OVERRIDE_KEY, "auto");
  return localVal || "auto";
}

/**
 * Set Admin store override mode
 */
export function setStoreOverride(mode: StoreOverrideMode): void {
  if (typeof window === "undefined") return;
  setStoredData(CAMCU_STORE_OVERRIDE_KEY, mode, true);
  setSharedCookie(CAMCU_STORE_OVERRIDE_KEY, mode, 30);
  window.dispatchEvent(
    new CustomEvent("camcu_store_override_change", { detail: { mode } })
  );
}

/**
 * Core function to calculate real-time store status in GMT+7
 */
export function getStoreStatus(override?: StoreOverrideMode): StoreRealtimeStatus {
  const activeOverride = override !== undefined ? override : getStoreOverride();
  const vnDate = getVietnamTime();

  const dayOfWeek = vnDate.getDay(); // 0: Sunday, 1: Monday, ..., 6: Saturday
  const hours = vnDate.getHours();
  const minutes = vnDate.getMinutes();
  const totalMinutes = hours * 60 + minutes;

  // Format current VN time string HH:mm
  const currentTimeVN = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;

  // Schedule Rules:
  // Mon-Thu (1-4): 07:00 - 18:00 (420m to 1080m)
  // Fri-Sun (5, 6, 0): 07:00 - 22:00 (420m to 1320m)
  const isWeekendGroup = dayOfWeek === 0 || dayOfWeek === 5 || dayOfWeek === 6;
  const openMinutes = 7 * 60; // 07:00
  const closeMinutes = isWeekendGroup ? 22 * 60 : 18 * 60; // 22:00 or 18:00
  const closingTime = isWeekendGroup ? "22:00" : "18:00";
  const scheduleText = isWeekendGroup
    ? "Thứ 6 - CN: 07:00 - 22:00"
    : "Thứ 2 - T5: 07:00 - 18:00";

  // Check manual overrides first
  if (activeOverride === "force_open") {
    return {
      status: "open",
      badgeType: "open",
      badgeText: "🟢 Đang mở cửa đón khách • Mở cửa linh hoạt theo quản lý",
      shortBadge: "Đang mở cửa",
      closingTime: "22:00",
      scheduleText,
      currentTimeVN,
      overrideMode: "force_open",
      isOpen: true,
    };
  }

  if (activeOverride === "force_closed") {
    return {
      status: "closed",
      badgeType: "closed",
      badgeText: "🔴 Quán tạm đóng cửa • Tạm nghỉ đột xuất hoặc chuẩn bị đón khách",
      shortBadge: "Tạm nghỉ",
      closingTime: closingTime,
      scheduleText,
      currentTimeVN,
      overrideMode: "force_closed",
      isOpen: false,
    };
  }

  // Auto mode based on real GMT+7 time
  const isWithinHours = totalMinutes >= openMinutes && totalMinutes < closeMinutes;

  if (isWithinHours) {
    const diffMinutes = closeMinutes - totalMinutes;
    if (diffMinutes <= 30) {
      return {
        status: "closing_soon",
        badgeType: "closing_soon",
        badgeText: `🟡 Sắp đến giờ đóng cửa (còn ${diffMinutes} phút) • Đóng lúc ${closingTime}`,
        shortBadge: `Sắp đóng (${diffMinutes}p)`,
        closingTime,
        scheduleText,
        currentTimeVN,
        overrideMode: "auto",
        minutesRemaining: diffMinutes,
        isOpen: true,
      };
    }

    return {
      status: "open",
      badgeType: "open",
      badgeText: `🟢 Đang mở cửa đón khách • Đóng cửa lúc ${closingTime}`,
      shortBadge: "Đang mở cửa",
      closingTime,
      scheduleText,
      currentTimeVN,
      overrideMode: "auto",
      isOpen: true,
    };
  }

  // Outside opening hours
  const nextOpenDay = totalMinutes < openMinutes ? "hôm nay" : "sáng mai";
  return {
    status: "closed",
    badgeType: "closed",
    badgeText: `🔴 Quán đã đóng cửa • Hẹn gặp bạn lúc 07:00 ${nextOpenDay}`,
    shortBadge: "Đã đóng cửa",
    closingTime,
    scheduleText,
    currentTimeVN,
    overrideMode: "auto",
    isOpen: false,
  };
}

/**
 * React Hook for live status that updates every 30 seconds
 */
export function useStoreStatus(): StoreRealtimeStatus {
  const [status, setStatus] = useState<StoreRealtimeStatus>(() => getStoreStatus());

  useEffect(() => {
    // Initial sync
    setStatus(getStoreStatus());

    // Update every 30s
    const timer = setInterval(() => {
      setStatus(getStoreStatus());
    }, 30000);

    // Listen to override change events
    const handleOverrideChange = () => {
      setStatus(getStoreStatus());
    };

    window.addEventListener("camcu_store_override_change", handleOverrideChange);
    window.addEventListener("storage", handleOverrideChange);

    return () => {
      clearInterval(timer);
      window.removeEventListener("camcu_store_override_change", handleOverrideChange);
      window.removeEventListener("storage", handleOverrideChange);
    };
  }, []);

  return status;
}
