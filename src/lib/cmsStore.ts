/**
 * Unified CMS Store & Real-time Cross-tab Synchronization Engine
 * Bridges Admin Management Console and 5 Public Website Pages (Cam Cu House)
 */

"use client";

import { useState, useEffect, useCallback } from "react";
import { trackEvent, TrackEventType, getLocalEventStats, AnalyticsCounts } from "@/lib/analytics";
import { getStoredData, setStoredData, getSharedCookie, setSharedCookie } from "@/utils/storage";

export const CMS_KEYS = {
  ANNOUNCEMENTS: "camcu_announcements",
  MENU_OVERRIDES: "camcu_menu_overrides",
  GALLERY: "camcu_gallery",
  SETTINGS: "camcu_settings",
  CONTENT_BLOCKS: "camcu_content_blocks",
  CONTENT_OVERRIDES: "camcu_content_overrides",
  RESERVATIONS: "camcu_reservations",
  STORE_OVERRIDE: "camcu_store_override",
  STORE_OVERRIDE_DETAIL: "camcu_status_override_detail",
} as const;

export interface AnnouncementItem {
  id: string;
  title: string;
  category: "event" | "special" | "notice" | string;
  type?: "event" | "special" | "notice" | string;
  content: string;
  isPinned?: boolean;
  isHighlighted?: boolean;
  createdAt?: string;
  date?: string;
}

export interface MenuItemOverride {
  inStock: boolean;
  price?: number;
  tag?: string;
  name?: string;
}

export interface ReservationItem {
  id: string;
  customerName: string;
  customerPhone: string;
  guestCount: number;
  visitDate: string;
  visitTime: string;
  serviceType: "outdoor" | "takeaway";
  specialNote?: string;
  preOrderItems?: Array<{
    code: string;
    name: string;
    variant?: string;
    quantity: number;
    price: number;
  }>;
  totalEstimatedAmount?: number;
  createdAt: string;
  status: "pending" | "confirmed" | "cancelled";
}

export interface StoreSettings {
  name: string;
  address: string;
  hotline1: string;
  hotline2: string;
  email: string;
  hoursWeekday: string;
  hoursWeekend: string;
  mapsUrl: string;
  facebookUrl: string;
  tiktokUrl: string;
  youtubeUrl: string;
  topBanner?: string;
  topBannerEnabled?: boolean;
}

export const DEFAULT_STORE_SETTINGS: StoreSettings = {
  name: "Cẩm Cù House",
  address: "Hẻm 437 Hùng Vương, Phường Nghĩa Trung, TP. Gia Nghĩa, Đăk Nông",
  hotline1: "0382 851 688",
  hotline2: "0774 659 000",
  email: "thuynhu8788@gmail.com",
  hoursWeekday: "07:00 – 18:00 (Thứ Hai – Thứ Năm)",
  hoursWeekend: "07:00 – 22:00 (Thứ Sáu – Chủ Nhật)",
  mapsUrl: "https://maps.app.goo.gl/G6aP51qJ6aDabp676",
  facebookUrl: "https://www.facebook.com/share/1DVLMySW8H/",
  tiktokUrl: "https://www.tiktok.com/@camcuhouse",
  youtubeUrl: "https://www.youtube.com/@camcuhouse",
  topBanner: "",
  topBannerEnabled: false,
};

// 1. Broadcast Helper for Instant Tab-to-Tab Synchronization
export function broadcastSync(key: string, value: unknown): void {
  if (typeof window === "undefined") return;

  // Local window custom event
  window.dispatchEvent(
    new CustomEvent("camcu_sync_update", { detail: { key, value } })
  );

  // Cross-tab BroadcastChannel
  try {
    if ("BroadcastChannel" in window) {
      const bc = new BroadcastChannel("camcu_sync_bus");
      bc.postMessage({ key, value });
      bc.close();
    }
  } catch (_) {}
}

// 2. Track Customer Action Helper (Hotline, Zalo, Directions, Menu)
export function trackCustomerAction(actionType: TrackEventType): void {
  trackEvent(actionType);
  broadcastSync("camcu_analytics_tracked", { event: actionType, ts: Date.now() });
}

// 3. Customer Reservation Submissions
export function saveReservation(reservationData: Omit<ReservationItem, "id" | "createdAt" | "status">): ReservationItem {
  const id = `res_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const item: ReservationItem = {
    ...reservationData,
    id,
    createdAt: new Date().toISOString(),
    status: "pending",
  };

  if (typeof window !== "undefined") {
    const existing = getStoredData<ReservationItem[]>(CMS_KEYS.RESERVATIONS, []);
    const updated = [item, ...existing].slice(0, 50); // Keep last 50
    setStoredData(CMS_KEYS.RESERVATIONS, updated, true);
    broadcastSync(CMS_KEYS.RESERVATIONS, updated);
  }

  return item;
}

export function updateReservationStatus(id: string, status: "pending" | "confirmed" | "cancelled"): void {
  if (typeof window === "undefined") return;
  const existing = getStoredData<ReservationItem[]>(CMS_KEYS.RESERVATIONS, []);
  const updated = existing.map((r) => (r.id === id ? { ...r, status } : r));
  setStoredData(CMS_KEYS.RESERVATIONS, updated, true);
  broadcastSync(CMS_KEYS.RESERVATIONS, updated);
}

export function getReservations(): ReservationItem[] {
  if (typeof window === "undefined") return [];
  return getStoredData<ReservationItem[]>(CMS_KEYS.RESERVATIONS, []);
}

// 4. React Hooks for Real-Time Responsive UI Across All Pages

/**
 * Live Announcements Hook
 */
export function useAnnouncements(): AnnouncementItem[] {
  const [items, setItems] = useState<AnnouncementItem[]>(() => {
    if (typeof window === "undefined") return [];
    return getStoredData<AnnouncementItem[]>(CMS_KEYS.ANNOUNCEMENTS, []);
  });

  useEffect(() => {
    const handleUpdate = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (!detail || detail.key === CMS_KEYS.ANNOUNCEMENTS) {
        setItems(getStoredData<AnnouncementItem[]>(CMS_KEYS.ANNOUNCEMENTS, []));
      }
    };

    window.addEventListener("camcu_sync_update", handleUpdate);
    window.addEventListener("storage", handleUpdate);

    let bc: BroadcastChannel | null = null;
    try {
      if ("BroadcastChannel" in window) {
        bc = new BroadcastChannel("camcu_sync_bus");
        bc.onmessage = (event) => {
          if (event.data?.key === CMS_KEYS.ANNOUNCEMENTS) {
            setItems(getStoredData<AnnouncementItem[]>(CMS_KEYS.ANNOUNCEMENTS, []));
          }
        };
      }
    } catch (_) {}

    return () => {
      window.removeEventListener("camcu_sync_update", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
      if (bc) bc.close();
    };
  }, []);

  return items;
}

/**
 * Live Menu Overrides Hook (Stock & Price changes)
 */
export function useMenuOverrides(): Record<string, MenuItemOverride> {
  const [overrides, setOverrides] = useState<Record<string, MenuItemOverride>>(() => {
    if (typeof window === "undefined") return {};
    return getStoredData<Record<string, MenuItemOverride>>(CMS_KEYS.MENU_OVERRIDES, {});
  });

  useEffect(() => {
    const handleUpdate = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (!detail || detail.key === CMS_KEYS.MENU_OVERRIDES) {
        setOverrides(getStoredData<Record<string, MenuItemOverride>>(CMS_KEYS.MENU_OVERRIDES, {}));
      }
    };

    window.addEventListener("camcu_sync_update", handleUpdate);
    window.addEventListener("storage", handleUpdate);

    let bc: BroadcastChannel | null = null;
    try {
      if ("BroadcastChannel" in window) {
        bc = new BroadcastChannel("camcu_sync_bus");
        bc.onmessage = (event) => {
          if (event.data?.key === CMS_KEYS.MENU_OVERRIDES) {
            setOverrides(getStoredData<Record<string, MenuItemOverride>>(CMS_KEYS.MENU_OVERRIDES, {}));
          }
        };
      }
    } catch (_) {}

    return () => {
      window.removeEventListener("camcu_sync_update", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
      if (bc) bc.close();
    };
  }, []);

  return overrides;
}

/**
 * Live Store Settings Hook
 */
export function useStoreSettings(): StoreSettings {
  const [settings, setSettings] = useState<StoreSettings>(() => {
    if (typeof window === "undefined") return DEFAULT_STORE_SETTINGS;
    const stored = getStoredData<Partial<StoreSettings>>(CMS_KEYS.SETTINGS, {});
    return { ...DEFAULT_STORE_SETTINGS, ...stored };
  });

  useEffect(() => {
    const handleUpdate = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (!detail || detail.key === CMS_KEYS.SETTINGS) {
        const stored = getStoredData<Partial<StoreSettings>>(CMS_KEYS.SETTINGS, {});
        setSettings({ ...DEFAULT_STORE_SETTINGS, ...stored });
      }
    };

    window.addEventListener("camcu_sync_update", handleUpdate);
    window.addEventListener("storage", handleUpdate);

    let bc: BroadcastChannel | null = null;
    try {
      if ("BroadcastChannel" in window) {
        bc = new BroadcastChannel("camcu_sync_bus");
        bc.onmessage = (event) => {
          if (event.data?.key === CMS_KEYS.SETTINGS) {
            const stored = getStoredData<Partial<StoreSettings>>(CMS_KEYS.SETTINGS, {});
            setSettings({ ...DEFAULT_STORE_SETTINGS, ...stored });
          }
        };
      }
    } catch (_) {}

    return () => {
      window.removeEventListener("camcu_sync_update", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
      if (bc) bc.close();
    };
  }, []);

  return settings;
}

/**
 * Live Reservations Hook for Admin
 */
export function useReservations(): ReservationItem[] {
  const [reservations, setReservations] = useState<ReservationItem[]>(() => getReservations());

  useEffect(() => {
    const handleUpdate = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (!detail || detail.key === CMS_KEYS.RESERVATIONS) {
        setReservations(getReservations());
      }
    };

    window.addEventListener("camcu_sync_update", handleUpdate);
    window.addEventListener("storage", handleUpdate);

    let bc: BroadcastChannel | null = null;
    try {
      if ("BroadcastChannel" in window) {
        bc = new BroadcastChannel("camcu_sync_bus");
        bc.onmessage = (event) => {
          if (event.data?.key === CMS_KEYS.RESERVATIONS) {
            setReservations(getReservations());
          }
        };
      }
    } catch (_) {}

    return () => {
      window.removeEventListener("camcu_sync_update", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
      if (bc) bc.close();
    };
  }, []);

  return reservations;
}

/**
 * Live Customer Actions Hook for 7-day Admin metrics
 */
export function useCustomerAnalytics(periodDays = 7): AnalyticsCounts {
  const [stats, setStats] = useState<AnalyticsCounts>(() => getLocalEventStats(periodDays));

  useEffect(() => {
    const refresh = () => setStats(getLocalEventStats(periodDays));

    window.addEventListener("camcu_analytics_tracked", refresh);
    window.addEventListener("camcu_sync_update", (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail?.key === "camcu_analytics_tracked") refresh();
    });
    window.addEventListener("storage", refresh);

    let bc: BroadcastChannel | null = null;
    try {
      if ("BroadcastChannel" in window) {
        bc = new BroadcastChannel("camcu_sync_bus");
        bc.onmessage = (event) => {
          if (event.data?.key === "camcu_analytics_tracked") refresh();
        };
      }
    } catch (_) {}

    return () => {
      window.removeEventListener("camcu_analytics_tracked", refresh);
      window.removeEventListener("storage", refresh);
      if (bc) bc.close();
    };
  }, [periodDays]);

  return stats;
}
