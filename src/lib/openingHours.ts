/**
 * Realtime Opening Hours & Store Status Utility (GMT+7 / Asia/Ho_Chi_Minh)
 * Handles automatic schedule calculation, approaching-closing warnings,
 * and Admin manual overrides (Auto / Force Open / Force Closed).
 */

import { useState, useEffect } from "react";
import { getStoredData, setStoredData, getSharedCookie, setSharedCookie } from "@/utils/storage";
import { getStatus, OverrideMode, StatusOverrideData } from "@/lib/status";

export const CAMCU_STORE_OVERRIDE_KEY = "camcu_store_override";

export type StoreOverrideMode = "auto" | "force_open" | "force_closed";

export interface StoreRealtimeStatus {
  status: "open" | "closing_soon" | "closed";
  badgeType: "open" | "closing_soon" | "closed";
  badgeText: string;
  shortBadge: string;
  closingTime: string;
  todayHoursText: string;
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
 * Powered by unified getStatus from src/lib/status.ts
 */
export function getStoreStatus(override?: StoreOverrideMode): StoreRealtimeStatus {
  const activeOverride = override !== undefined ? override : getStoreOverride();
  const vnDate = getVietnamTime();
  const hours = vnDate.getHours();
  const minutes = vnDate.getMinutes();
  const currentTimeVN = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;

  // Read override with expiration if stored
  let overrideData: StatusOverrideData | null = null;
  if (activeOverride === "force_open") {
    overrideData = { mode: "open" };
  } else if (activeOverride === "force_closed") {
    overrideData = { mode: "closed" };
  } else {
    // Check if there is a detailed override stored with 'until'
    if (typeof window !== "undefined") {
      const detailed = getStoredData<{ mode: OverrideMode; until?: string } | null>("camcu_status_override_detail", null);
      if (detailed && detailed.mode && detailed.mode !== "auto") {
        overrideData = detailed;
      }
    }
  }

  const result = getStatus(new Date(), { override: overrideData });
  const closingTime = result.closes_at || (vnDate.getDay() === 0 || vnDate.getDay() === 5 || vnDate.getDay() === 6 ? "22:00" : "18:00");
  const isOpen = result.state === "open" || result.state === "closing_soon";

  let badgeText = "🟢 Đang mở cửa đón khách • Đóng cửa lúc " + closingTime;
  let shortBadge = result.label_vi;

  if (result.state === "closing_soon") {
    const diff = result.minutes_remaining ?? 30;
    badgeText = `🟡 Sắp đến giờ đóng cửa (còn ${diff} phút) • Đóng lúc ${closingTime}`;
    shortBadge = `Sắp đóng (${diff}p)`;
  } else if (result.state === "closed") {
    badgeText = "🔴 Quán đã đóng cửa • Hẹn gặp bạn lúc 07:00 ngày mai";
    shortBadge = result.label_vi;
  }

  return {
    status: result.state,
    badgeType: result.state,
    badgeText,
    shortBadge,
    closingTime,
    todayHoursText: result.today_hours,
    scheduleText: result.schedule_vi,
    currentTimeVN,
    overrideMode: activeOverride,
    minutesRemaining: result.minutes_remaining,
    isOpen,
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
