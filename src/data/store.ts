/**
 * Persistent Store for Cẩm Cù House Admin & Client Real-time Sync
 * Fallback mechanism: In-memory (Global across serverless invocations) + LocalStorage + API Sync
 */

export interface MenuItemOverride {
  inStock: boolean;
  price?: number;
}

export interface AnnouncementItem {
  id: string;
  title: string;
  content: string;
  date: string;
  type: "event" | "notice" | "special";
  isHighlighted?: boolean;
}

export interface StoreSettings {
  isOpen: boolean;
  statusText: string;
  hoursWeekday: string;
  hoursWeekend: string;
  hotline1: string;
  hotline2: string;
  address: string;
  topBanner: string;
  adminPin: string;
}

import defaultGalleryData from "./gallery.json";

export interface GalleryPhoto {
  id: string;
  title: string;
  url: string;
  category: string;
  caption?: string;
}

// Global Singleton Store for Node.js / Next.js Serverless runtime
interface GlobalStoreContainer {
  menuOverrides: Record<string, MenuItemOverride>;
  announcements: AnnouncementItem[];
  settings: StoreSettings;
  gallery: GalleryPhoto[];
}

const DEFAULT_SETTINGS: StoreSettings = {
  isOpen: true,
  statusText: "Quán đang mở cửa đón khách",
  hoursWeekday: "07:00 - 18:00",
  hoursWeekend: "07:00 - 22:00",
  hotline1: "038 285 1688",
  hotline2: "077 465 9000",
  address: "Hẻm 437 Hùng Vương, Phường Nghĩa Trung, TP. Gia Nghĩa, Tỉnh Đắk Nông",
  topBanner: "🌿 Chào mừng đến với Cẩm Cù House • Giờ mở cửa: T2 - T5 (07:00 - 18:00) | T6 - CN (07:00 - 22:00)",
  adminPin: "2610",
};

const DEFAULT_ANNOUNCEMENTS: AnnouncementItem[] = [];

const DEFAULT_GALLERY: GalleryPhoto[] = defaultGalleryData as GalleryPhoto[];

declare global {
  // eslint-disable-next-line no-var
  var __CAMCU_STORE__: GlobalStoreContainer | undefined;
}

function getGlobalStore(): GlobalStoreContainer {
  if (!globalThis.__CAMCU_STORE__) {
    globalThis.__CAMCU_STORE__ = {
      menuOverrides: {},
      announcements: [...DEFAULT_ANNOUNCEMENTS],
      settings: { ...DEFAULT_SETTINGS },
      gallery: [...DEFAULT_GALLERY],
    };
  }
  return globalThis.__CAMCU_STORE__;
}

// 1. Menu Overrides Operations
export function getMenuOverrides(): Record<string, MenuItemOverride> {
  return getGlobalStore().menuOverrides;
}

export function updateMenuItemOverride(id: string, override: Partial<MenuItemOverride>): MenuItemOverride {
  const store = getGlobalStore();
  const current = store.menuOverrides[id] || { inStock: true };
  const updated: MenuItemOverride = {
    ...current,
    ...override,
  };
  store.menuOverrides[id] = updated;
  return updated;
}

export function batchUpdateMenuOverrides(overrides: Record<string, Partial<MenuItemOverride>>) {
  const store = getGlobalStore();
  Object.entries(overrides).forEach(([id, ov]) => {
    const current = store.menuOverrides[id] || { inStock: true };
    store.menuOverrides[id] = { ...current, ...ov };
  });
  return store.menuOverrides;
}

// 2. Announcements Operations
export function getAnnouncements(): AnnouncementItem[] {
  return getGlobalStore().announcements;
}

export function addAnnouncement(item: Omit<AnnouncementItem, "id" | "date"> & { date?: string }): AnnouncementItem {
  const store = getGlobalStore();
  const newItem: AnnouncementItem = {
    ...item,
    id: `a_${Date.now()}`,
    date: item.date || "Vừa xong",
  };
  store.announcements = [newItem, ...store.announcements];
  return newItem;
}

export function deleteAnnouncement(id: string): boolean {
  const store = getGlobalStore();
  const initialLength = store.announcements.length;
  store.announcements = store.announcements.filter((a) => a.id !== id);
  return store.announcements.length < initialLength;
}

// 3. Store Settings Operations
export function getStoreSettings(): StoreSettings {
  return getGlobalStore().settings;
}

export function updateStoreSettings(updates: Partial<StoreSettings>): StoreSettings {
  const store = getGlobalStore();
  store.settings = {
    ...store.settings,
    ...updates,
  };
  return store.settings;
}

export function verifyAdminPin(pin: string): boolean {
  const store = getGlobalStore();
  return pin.trim() === store.settings.adminPin.trim();
}

export function changeAdminPin(oldPin: string, newPin: string): boolean {
  const store = getGlobalStore();
  if (oldPin.trim() !== store.settings.adminPin.trim()) {
    return false;
  }
  if (!newPin || newPin.trim().length < 4) {
    return false;
  }
  store.settings.adminPin = newPin.trim();
  return true;
}

// 4. Gallery Operations
export function getGalleryPhotos(): GalleryPhoto[] {
  return getGlobalStore().gallery;
}

export function addGalleryPhoto(photo: Omit<GalleryPhoto, "id">): GalleryPhoto {
  const store = getGlobalStore();
  const newPhoto: GalleryPhoto = {
    ...photo,
    id: `g_${Date.now()}`,
  };
  store.gallery = [newPhoto, ...store.gallery];
  return newPhoto;
}

export function updateGalleryPhoto(id: string, updates: Partial<GalleryPhoto>): GalleryPhoto | null {
  const store = getGlobalStore();
  const idx = store.gallery.findIndex((g) => g.id === id);
  if (idx === -1) return null;
  store.gallery[idx] = { ...store.gallery[idx], ...updates };
  return store.gallery[idx];
}

export function deleteGalleryPhoto(id: string): boolean {
  const store = getGlobalStore();
  const initialLen = store.gallery.length;
  store.gallery = store.gallery.filter((g) => g.id !== id);
  return store.gallery.length < initialLen;
}
