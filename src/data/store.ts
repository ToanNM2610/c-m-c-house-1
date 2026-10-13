/**
 * Persistent Store for Cẩm Cù House Admin & Client Real-time Sync
 * Fallback mechanism: In-memory (Global across serverless invocations) + LocalStorage + API Sync
 */

import { hashPassword, verifyPassword, encryptSecret, decryptSecret } from "@/lib/crypto";
import defaultGalleryData from "./gallery.json";

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
  topBannerEnabled?: boolean;
  passwordHash?: string;
  isFirstLoginDone?: boolean;
  totpSecret?: string;
  totpEnabled?: boolean;
  recoveryCodes?: string[];
}

export interface GalleryPhoto {
  id: string;
  title: string;
  url: string;
  category: string;
  caption?: string;
}

export interface IntegrationSettingItem {
  key: string;
  name: string;
  value: string; // Plain text or AES-256-GCM encrypted
  isSecret: boolean;
  status: "connected" | "error" | "unconfigured";
  statusMessage?: string;
  updatedAt: string;
}

export interface IntegrationAuditLogItem {
  id: string;
  user: string;
  action: "update" | "delete" | "test";
  keyName: string;
  ip?: string;
  timestamp: string;
}

// Global Singleton Store for Node.js / Next.js Serverless runtime
interface GlobalStoreContainer {
  menuOverrides: Record<string, MenuItemOverride>;
  announcements: AnnouncementItem[];
  settings: StoreSettings;
  gallery: GalleryPhoto[];
  integrations: Record<string, IntegrationSettingItem>;
  integrationAuditLogs: IntegrationAuditLogItem[];
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
  topBannerEnabled: true,
  passwordHash: "",
  isFirstLoginDone: false,
};

const DEFAULT_ANNOUNCEMENTS: AnnouncementItem[] = [];

const DEFAULT_GALLERY: GalleryPhoto[] = defaultGalleryData as GalleryPhoto[];

function getInitialIntegrations(): Record<string, IntegrationSettingItem> {
  const now = new Date().toISOString();
  const placesKey = process.env.GOOGLE_PLACES_API_KEY || "";
  const placeId = process.env.GOOGLE_PLACE_ID || "ChIJ3yR_c91JnzERl0n0sTjZz2o";
  const gaId = process.env.GA4_MEASUREMENT_ID || process.env.NEXT_PUBLIC_GA_ID || "";
  const gaPropertyId = process.env.GA4_PROPERTY_ID || "";
  const scVerification = process.env.SEARCH_CONSOLE_VERIFICATION || "";
  const scProperty = process.env.SEARCH_CONSOLE_PROPERTY || "sc-domain:camcuhouse.online";
  const serviceAccount = process.env.GOOGLE_SERVICE_ACCOUNT_JSON || "";
  const mapsEmbed =
    process.env.GOOGLE_MAPS_EMBED_URL ||
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3893.267876802148!2d107.69!3d11.99!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTHCsDU5JzI0LjAiTiAxMDfCsDQxJzI0LjAiRQ!5e0!3m2!1svi!2svn!4v1700000000000!5m2!1svi!2svn";

  return {
    ga4_measurement_id: {
      key: "ga4_measurement_id",
      name: "GA4 Measurement ID (dạng G-XXXXXXXXXX)",
      value: gaId,
      isSecret: false,
      status: gaId ? "connected" : "unconfigured",
      statusMessage: gaId ? "Đã nạp từ cấu hình" : "Chưa cấu hình",
      updatedAt: now,
    },
    ga4_property_id: {
      key: "ga4_property_id",
      name: "GA4 Property ID (số)",
      value: gaPropertyId,
      isSecret: false,
      status: gaPropertyId ? "connected" : "unconfigured",
      statusMessage: gaPropertyId ? "Đã nạp từ cấu hình" : "Chưa cấu hình",
      updatedAt: now,
    },
    search_console_verification: {
      key: "search_console_verification",
      name: "Search Console Mã Xác Minh (google-site-verification)",
      value: scVerification,
      isSecret: false,
      status: scVerification ? "connected" : "unconfigured",
      statusMessage: scVerification ? "Đã xác minh" : "Chưa cấu hình",
      updatedAt: now,
    },
    search_console_property: {
      key: "search_console_property",
      name: "Search Console Property (vd: sc-domain:camcuhouse.online)",
      value: scProperty,
      isSecret: false,
      status: scProperty ? "connected" : "unconfigured",
      statusMessage: "Tên miền camcuhouse.online",
      updatedAt: now,
    },
    google_service_account_json: {
      key: "google_service_account_json",
      name: "Google Service Account JSON (Analytics & Search Console)",
      value: serviceAccount ? encryptSecret(serviceAccount) : "",
      isSecret: true,
      status: serviceAccount ? "connected" : "unconfigured",
      statusMessage: serviceAccount ? "Đã kết nối OAuth2 Service Account" : "Chưa cấu hình JSON",
      updatedAt: now,
    },
    google_places_api_key: {
      key: "google_places_api_key",
      name: "Google Places API Key (Đồng bộ đánh giá)",
      value: placesKey ? encryptSecret(placesKey) : "",
      isSecret: true,
      status: placesKey ? "connected" : "unconfigured",
      statusMessage: placesKey ? "Đã nạp khóa Places API" : "Chưa cấu hình API Key",
      updatedAt: now,
    },
    google_place_id: {
      key: "google_place_id",
      name: "Google Place ID (Gia Nghĩa, Đắk Nông)",
      value: placeId,
      isSecret: false,
      status: placeId ? "connected" : "unconfigured",
      statusMessage: placeId ? "Cẩm Cù House Gia Nghĩa" : "Chưa cấu hình",
      updatedAt: now,
    },
    google_maps_embed_url: {
      key: "google_maps_embed_url",
      name: "Link Google Maps / URL bản đồ nhúng",
      value: mapsEmbed,
      isSecret: false,
      status: mapsEmbed ? "connected" : "unconfigured",
      statusMessage: "Bản đồ vệ tinh & đường vào quán",
      updatedAt: now,
    },
  };
}

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
      integrations: getInitialIntegrations(),
      integrationAuditLogs: [],
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

// 4. Authentication: Strong Password & First-login Setup
export function isFirstLoginRequired(): boolean {
  const store = getGlobalStore();
  return !store.settings.passwordHash || !store.settings.isFirstLoginDone;
}

export function setupInitialPassword(password: string): { success: boolean; error?: string } {
  if (!password || password.trim().length < 12) {
    return { success: false, error: "Mật khẩu quản trị phải có độ dài tối thiểu 12 ký tự an toàn." };
  }
  const store = getGlobalStore();
  store.settings.passwordHash = hashPassword(password.trim());
  store.settings.isFirstLoginDone = true;
  return { success: true };
}

export function verifyAdminCredentials(password: string): boolean {
  const store = getGlobalStore();
  if (!store.settings.passwordHash) {
    return false;
  }
  return verifyPassword(password.trim(), store.settings.passwordHash);
}

export function changeAdminPassword(oldPassword: string, newPassword: string): { success: boolean; error?: string } {
  const store = getGlobalStore();
  if (store.settings.passwordHash && !verifyPassword(oldPassword.trim(), store.settings.passwordHash)) {
    return { success: false, error: "Mật khẩu hiện tại không chính xác." };
  }
  if (!newPassword || newPassword.trim().length < 12) {
    return { success: false, error: "Mật khẩu mới phải có tối thiểu 12 ký tự." };
  }
  store.settings.passwordHash = hashPassword(newPassword.trim());
  return { success: true };
}

// TOTP Operations
export function getTotpConfig() {
  const store = getGlobalStore();
  return {
    totpEnabled: Boolean(store.settings.totpEnabled),
    totpSecret: store.settings.totpSecret || "",
    hasRecoveryCodes: (store.settings.recoveryCodes || []).length > 0,
  };
}

export function enableTotp(secret: string, recoveryCodes: string[]): boolean {
  const store = getGlobalStore();
  store.settings.totpSecret = secret;
  store.settings.totpEnabled = true;
  store.settings.recoveryCodes = recoveryCodes;
  return true;
}

export function disableTotp(): boolean {
  const store = getGlobalStore();
  store.settings.totpEnabled = false;
  store.settings.totpSecret = "";
  store.settings.recoveryCodes = [];
  return true;
}

export function verifyRecoveryCode(code: string): boolean {
  const store = getGlobalStore();
  const codes = store.settings.recoveryCodes || [];
  const clean = code.trim().toUpperCase();
  const idx = codes.findIndex((c) => c.toUpperCase() === clean);
  if (idx !== -1) {
    // Consume one-time recovery code
    store.settings.recoveryCodes = codes.filter((_, i) => i !== idx);
    return true;
  }
  return false;
}

// 5. Gallery Operations
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

// 6. Integration Settings Operations
export function getAllIntegrations(): IntegrationSettingItem[] {
  const store = getGlobalStore();
  return Object.values(store.integrations);
}

export function getIntegration(key: string): IntegrationSettingItem | null {
  const store = getGlobalStore();
  return store.integrations[key] || null;
}

export function getDecryptedIntegrationValue(key: string): string {
  const store = getGlobalStore();
  const item = store.integrations[key];
  if (!item || !item.value) return "";
  if (item.isSecret) {
    return decryptSecret(item.value);
  }
  return item.value;
}

export function saveIntegration(
  key: string,
  value: string,
  name?: string,
  isSecret?: boolean,
  status: "connected" | "error" | "unconfigured" = "connected",
  statusMessage = ""
): IntegrationSettingItem {
  const store = getGlobalStore();
  const existing = store.integrations[key];
  const finalIsSecret = isSecret !== undefined ? isSecret : existing?.isSecret ?? false;
  const finalName = name || existing?.name || key;
  const storedValue = finalIsSecret ? encryptSecret(value) : value;

  const updated: IntegrationSettingItem = {
    key,
    name: finalName,
    value: storedValue,
    isSecret: finalIsSecret,
    status,
    statusMessage,
    updatedAt: new Date().toISOString(),
  };

  store.integrations[key] = updated;
  return updated;
}

export function deleteIntegration(key: string): boolean {
  const store = getGlobalStore();
  if (store.integrations[key]) {
    store.integrations[key] = {
      ...store.integrations[key],
      value: "",
      status: "unconfigured",
      statusMessage: "Chưa cấu hình",
      updatedAt: new Date().toISOString(),
    };
    return true;
  }
  return false;
}

// 7. Integration Audit Logging
export function logIntegrationAudit(user: string, action: "update" | "delete" | "test", keyName: string, ip = "") {
  const store = getGlobalStore();
  const log: IntegrationAuditLogItem = {
    id: `audit_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    user,
    action,
    keyName,
    ip,
    timestamp: new Date().toISOString(),
  };
  store.integrationAuditLogs = [log, ...store.integrationAuditLogs.slice(0, 99)]; // Keep latest 100
  return log;
}

export function getIntegrationAuditLogs(): IntegrationAuditLogItem[] {
  return getGlobalStore().integrationAuditLogs;
}
