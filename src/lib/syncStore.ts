/**
 * Cross-subdomain Cookie & LocalStorage Shared Store
 * Synchronizes state between https://admin.camcuhouse.online and https://camcuhouse.online
 */

export interface SharedAnnouncement {
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

export interface SharedGalleryItem {
  id: string;
  title: string;
  url: string;
  category: "suoi" | "nuoc" | "mon-an" | "khong-gian" | string;
}

export const KEYS = {
  ANNOUNCEMENTS: "camcu_announcements",
  DISABLED_MENU_IDS: "camcu_disabled_menu_ids",
  GALLERY: "camcu_gallery",
  SETTINGS: "camcu_settings",
  AUTH: "camcu_admin_auth",
};

/**
 * Get shared data from Cookie (priority) with LocalStorage fallback
 */
export function getSharedData<T>(key: string, defaultValue: T): T {
  if (typeof window === "undefined") return defaultValue;

  // 1. Try reading from Document Cookie
  try {
    const cookies = document.cookie.split(";");
    for (let c of cookies) {
      const [k, ...v] = c.trim().split("=");
      if (k === key) {
        const raw = decodeURIComponent(v.join("="));
        if (raw !== "" && raw !== "undefined") {
          const parsed = JSON.parse(raw);
          return parsed as T;
        }
      }
    }
  } catch (err) {
    // Continue to LocalStorage fallback
  }

  // 2. Try reading from LocalStorage
  try {
    const local = localStorage.getItem(key);
    if (local !== null && local !== "" && local !== "undefined") {
      const parsed = JSON.parse(local);
      return parsed as T;
    }
  } catch (err) {
    // Ignore error
  }

  return defaultValue;
}

/**
 * Save data to Cookie with root domain (.camcuhouse.online) and LocalStorage
 */
export function setSharedData<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;

  try {
    const serialized = JSON.stringify(value);

    // Save to LocalStorage
    try {
      localStorage.setItem(key, serialized);
    } catch (e) {
      console.warn("LocalStorage setItem failed:", e);
    }

    // Determine domain for Cookie
    const hostname = window.location.hostname;
    const isProd = hostname.includes("camcuhouse.online");
    const domainPart = isProd ? "; domain=.camcuhouse.online" : "";
    const maxAge = 31536000; // 1 year

    // Save to Shared Cookie
    document.cookie = `${key}=${encodeURIComponent(
      serialized
    )}; path=/; max-age=${maxAge}${domainPart}; SameSite=Lax`;

    // Notify listeners in same window
    window.dispatchEvent(
      new CustomEvent("camcu_sync_update", { detail: { key, value } })
    );
  } catch (err) {
    console.error(`Failed to set shared data for ${key}:`, err);
  }
}

/**
 * Remove shared data from both Cookie and LocalStorage
 */
export function removeSharedData(key: string): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.removeItem(key);

    const hostname = window.location.hostname;
    const isProd = hostname.includes("camcuhouse.online");
    const domainPart = isProd ? "; domain=.camcuhouse.online" : "";

    document.cookie = `${key}=; path=/; max-age=0${domainPart}; SameSite=Lax`;

    window.dispatchEvent(
      new CustomEvent("camcu_sync_update", { detail: { key, value: null } })
    );
  } catch (err) {
    console.error(`Failed to remove shared data for ${key}:`, err);
  }
}
