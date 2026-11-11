/**
 * Realtime Opening Hours & Store Status Utility (GMT+7 / Asia/Ho_Chi_Minh)
 * Handles automatic schedule calculation, approaching-closing warnings,
 * and Admin manual overrides (Auto / Force Open / Force Closed).
 */

import { useState, useEffect } from "react";
import { getStoredData, setStoredData, getSharedCookie, setSharedCookie } from "@/utils/storage";
import { getStatus, OverrideMode, StatusOverrideData } from "@/lib/status";

export const CAMCU_STORE_OVERRIDE_KEY = "camcu_store_override";
export const CAMCU_STORE_OVERRIDE_DETAIL_KEY = "camcu_status_override_detail";

export type StoreOverrideMode = "auto" | "force_open" | "force_closed";

export interface StoreRealtimeStatus {
  status: "open" | "closing_soon" | "closed";
  badgeType: "open" | "closing_soon" | "closed";
  badgeText: string;
  badgeTextEn: string;
  shortBadge: string;
  shortBadgeEn: string;
  closingTime: string;
  todayHoursText: string;
  scheduleText: string;
  scheduleTextEn: string;
  currentTimeVN: string;
  overrideMode: StoreOverrideMode;
  overrideUntil?: string | null;
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
export function getStoreOverride(): { mode: StoreOverrideMode; until?: string | null } {
  if (typeof window === "undefined") return { mode: "auto", until: null };

  const detailed = getStoredData<{ mode: OverrideMode; until?: string | null } | null>(
    CAMCU_STORE_OVERRIDE_DETAIL_KEY,
    null
  );

  // Check expiration if 'until' exists
  if (detailed && detailed.until) {
    const untilMs = new Date(detailed.until).getTime();
    if (!isNaN(untilMs) && Date.now() >= untilMs) {
      // Expired: revert to auto
      setStoredData(CAMCU_STORE_OVERRIDE_KEY, "auto", true);
      setSharedCookie(CAMCU_STORE_OVERRIDE_KEY, "auto", 30);
      setStoredData(CAMCU_STORE_OVERRIDE_DETAIL_KEY, { mode: "auto", until: null }, true);
      return { mode: "auto", until: null };
    }
  }

  if (detailed && detailed.mode && detailed.mode !== "auto") {
    const mapped: StoreOverrideMode = detailed.mode === "open" ? "force_open" : "force_closed";
    return { mode: mapped, until: detailed.until || null };
  }

  const cookieVal = getSharedCookie(CAMCU_STORE_OVERRIDE_KEY);
  if (cookieVal === "force_open" || cookieVal === "force_closed" || cookieVal === "auto") {
    return { mode: cookieVal, until: null };
  }
  const localVal = getStoredData<StoreOverrideMode>(CAMCU_STORE_OVERRIDE_KEY, "auto");
  return { mode: localVal || "auto", until: null };
}

/**
 * Set Admin store override mode with optional duration
 */
export function setStoreOverride(
  mode: StoreOverrideMode,
  duration: "1h" | "2h" | "4h" | "today" | "indefinite" = "indefinite"
): void {
  if (typeof window === "undefined") return;

  let until: string | null = null;
  if (mode !== "auto") {
    const now = new Date();
    if (duration === "1h") {
      until = new Date(now.getTime() + 60 * 60 * 1000).toISOString();
    } else if (duration === "2h") {
      until = new Date(now.getTime() + 2 * 60 * 60 * 1000).toISOString();
    } else if (duration === "4h") {
      until = new Date(now.getTime() + 4 * 60 * 60 * 1000).toISOString();
    } else if (duration === "today") {
      const endOfDay = new Date(now);
      endOfDay.setHours(23, 59, 59, 999);
      until = endOfDay.toISOString();
    }
  }

  const detailMode: OverrideMode = mode === "force_open" ? "open" : mode === "force_closed" ? "closed" : "auto";
  const detailData = { mode: detailMode, until };

  setStoredData(CAMCU_STORE_OVERRIDE_KEY, mode, true);
  setSharedCookie(CAMCU_STORE_OVERRIDE_KEY, mode, 30);
  setStoredData(CAMCU_STORE_OVERRIDE_DETAIL_KEY, detailData, true);

  // Broadcast to current window and cross-tabs
  window.dispatchEvent(
    new CustomEvent("camcu_store_override_change", { detail: { mode, until } })
  );

  try {
    if ("BroadcastChannel" in window) {
      const bc = new BroadcastChannel("camcu_sync_bus");
      bc.postMessage({ key: CAMCU_STORE_OVERRIDE_KEY, value: mode, detail: detailData });
      bc.close();
    }
  } catch (_) {}
}

/**
 * Core function to calculate real-time store status in GMT+7
 * Powered by unified getStatus from src/lib/status.ts
 */
export function getStoreStatus(override?: StoreOverrideMode): StoreRealtimeStatus {
  const currentOverrideObj = getStoreOverride();
  const activeOverride = override !== undefined ? override : currentOverrideObj.mode;
  const activeUntil = currentOverrideObj.until;

  const vnDate = getVietnamTime();
  const hours = vnDate.getHours();
  const minutes = vnDate.getMinutes();
  const currentTimeVN = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;

  // Read override with expiration if stored
  let overrideData: StatusOverrideData | null = null;
  if (activeOverride === "force_open") {
    overrideData = { mode: "open", until: activeUntil };
  } else if (activeOverride === "force_closed") {
    overrideData = { mode: "closed", until: activeUntil };
  }

  const result = getStatus(new Date(), { override: overrideData });
  const closingTime = result.closes_at || (vnDate.getDay() === 0 || vnDate.getDay() === 5 || vnDate.getDay() === 6 ? "22:00" : "18:00");
  const isOpen = result.state === "open" || result.state === "closing_soon";

  let badgeText = `🟢 Đang mở cửa đón khách • Đóng cửa lúc ${closingTime}`;
  let badgeTextEn = `🟢 Open now • Closes at ${closingTime}`;
  let shortBadge = "Đang mở cửa";
  let shortBadgeEn = "Open now";

  if (result.state === "closing_soon") {
    const diff = result.minutes_remaining ?? 30;
    badgeText = `🟡 Sắp đến giờ đóng cửa (còn ${diff} phút) • Đóng lúc ${closingTime}`;
    badgeTextEn = `🟡 Closing soon (${diff}m left) • Closes at ${closingTime}`;
    shortBadge = `Sắp đóng (${diff}p)`;
    shortBadgeEn = `Closing (${diff}m)`;
  } else if (result.state === "closed") {
    badgeText = "🔴 Đã đóng cửa • Mở cửa lại lúc 07:00 sáng";
    badgeTextEn = "🔴 Closed • Reopens at 07:00 AM";
    shortBadge = "Đã đóng cửa";
    shortBadgeEn = "Closed";
  }

  return {
    status: result.state,
    badgeType: result.state,
    badgeText,
    badgeTextEn,
    shortBadge,
    shortBadgeEn,
    closingTime,
    todayHoursText: result.today_hours,
    scheduleText: result.schedule_vi,
    scheduleTextEn: result.schedule_en,
    currentTimeVN,
    overrideMode: activeOverride,
    overrideUntil: activeUntil,
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
    setStatus(getStoreStatus());

    const timer = setInterval(() => {
      setStatus(getStoreStatus());
    }, 30000);

    const handleOverrideChange = () => {
      setStatus(getStoreStatus());
    };

    window.addEventListener("camcu_store_override_change", handleOverrideChange);
    window.addEventListener("storage", handleOverrideChange);

    let bc: BroadcastChannel | null = null;
    try {
      if ("BroadcastChannel" in window) {
        bc = new BroadcastChannel("camcu_sync_bus");
        bc.onmessage = (event) => {
          if (event.data?.key === CAMCU_STORE_OVERRIDE_KEY || event.data?.key === "camcu_sync_status") {
            setStatus(getStoreStatus());
          }
        };
      }
    } catch (_) {}

    return () => {
      clearInterval(timer);
      window.removeEventListener("camcu_store_override_change", handleOverrideChange);
      window.removeEventListener("storage", handleOverrideChange);
      if (bc) bc.close();
    };
  }, []);

  return status;
}
