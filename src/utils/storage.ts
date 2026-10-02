/**
 * Cross-subdomain Persistent Storage Utility for Cẩm Cù House
 * Supports: LocalStorage, Shared Cookies (.camcuhouse.online), and Client Image Compression
 */

export const CAMCU_AUTH_KEY = "camcu_admin_auth";
export const CAMCU_MENU_OVERRIDES_KEY = "camcu_menu_overrides";
export const CAMCU_ANNOUNCEMENTS_KEY = "camcu_announcements";
export const CAMCU_SETTINGS_KEY = "camcu_settings";
export const CAMCU_GALLERY_KEY = "camcu_gallery";

export interface MenuItemOverride {
  inStock: boolean;
  price?: number;
}

export interface StoredAnnouncement {
  id: string;
  title: string;
  content: string;
  date: string;
  type: "event" | "notice" | "special";
  isHighlighted?: boolean;
}

export interface StoredStoreSettings {
  isOpen: boolean;
  statusText: string;
  hoursWeekday: string;
  hoursWeekend: string;
  hotline1: string;
  hotline2: string;
  address: string;
  topBanner: string;
}

export interface StoredGalleryPhoto {
  id: string;
  title: string;
  url: string;
  category: "suoi" | "nuoc" | "mon-an" | "khong-gian";
}

/**
 * Set a cookie that is shared across all subdomains (*.camcuhouse.online)
 */
export function setSharedCookie(name: string, value: string, days: number = 365): void {
  if (typeof window === "undefined") return;
  const maxAge = days * 24 * 60 * 60;
  const hostname = window.location.hostname;
  const isProd = hostname.includes("camcuhouse.online");
  const domainPart = isProd ? "; domain=.camcuhouse.online" : "";
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}${domainPart}; SameSite=Lax`;
}

/**
 * Get a cookie value by name
 */
export function getSharedCookie(name: string): string | null {
  if (typeof window === "undefined" || !document.cookie) return null;
  const cookies = document.cookie.split(";");
  for (let c of cookies) {
    const [k, ...v] = c.trim().split("=");
    if (k === name) {
      try {
        return decodeURIComponent(v.join("="));
      } catch {
        return v.join("=");
      }
    }
  }
  return null;
}

/**
 * Clear a cookie across domain
 */
export function removeSharedCookie(name: string): void {
  if (typeof window === "undefined") return;
  const hostname = window.location.hostname;
  const isProd = hostname.includes("camcuhouse.online");
  const domainPart = isProd ? "; domain=.camcuhouse.online" : "";
  document.cookie = `${name}=; path=/; max-age=0${domainPart}; SameSite=Lax`;
}

/**
 * Retrieve data with priority: LocalStorage -> Shared Cookie -> Default Fallback
 */
export function getStoredData<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;

  // 1. Try LocalStorage
  try {
    const local = localStorage.getItem(key);
    if (local) {
      const parsed = JSON.parse(local);
      if (parsed !== null && parsed !== undefined) return parsed;
    }
  } catch (err) {
    // Ignore JSON or access errors
  }

  // 2. Try Shared Cookie
  try {
    const cookie = getSharedCookie(key);
    if (cookie) {
      const parsed = JSON.parse(cookie);
      if (parsed !== null && parsed !== undefined) return parsed;
    }
  } catch (err) {
    // Ignore cookie errors
  }

  return fallback;
}

/**
 * Persist data to both LocalStorage and Shared Cookie (if size allows)
 */
export function setStoredData<T>(key: string, data: T, syncCookie: boolean = true): void {
  if (typeof window === "undefined") return;
  try {
    const serialized = JSON.stringify(data);
    localStorage.setItem(key, serialized);

    // Only set cookie if within safe cookie size limit (3.5KB)
    if (syncCookie && serialized.length < 3500) {
      setSharedCookie(key, serialized);
    }
  } catch (err) {
    console.warn(`Failed to persist data for ${key}:`, err);
  }
}

/**
 * Compress and optimize image file from device camera / upload to web-friendly Base64 Data URL
 */
export async function compressImageFile(
  file: File,
  maxWidth: number = 1200,
  maxHeight: number = 1200,
  quality: number = 0.82
): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/")) {
      reject(new Error("Tập tin tải lên không phải là định dạng hình ảnh hợp lệ"));
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Lỗi khi đọc tập tin từ thiết bị"));
    reader.onload = () => {
      const result = reader.result as string;
      const img = new Image();
      img.onerror = () => reject(new Error("Lỗi nạp hình ảnh"));
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Calculate proportional scale
        if (width > maxWidth || height > maxHeight) {
          if (width / height > maxWidth / maxHeight) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          resolve(result);
          return;
        }

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, 0, 0, width, height);

        try {
          const optimizedDataUrl = canvas.toDataURL("image/jpeg", quality);
          resolve(optimizedDataUrl);
        } catch {
          resolve(result);
        }
      };
      img.src = result;
    };
    reader.readAsDataURL(file);
  });
}
