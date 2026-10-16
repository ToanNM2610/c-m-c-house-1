"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Sparkles,
  LayoutDashboard,
  UtensilsCrossed,
  ImageIcon,
  Settings,
  LogOut,
  Radio,
  Plus,
  Users,
  TrendingUp,
  Trees,
  CheckCircle2,
  Coffee,
  Star,
  Clock,
  Bell,
  HelpCircle,
  Eye,
  Trash2,
  Edit2,
  ExternalLink,
  Search,
  Lock,
  Check,
  Phone,
  MapPin,
  Save,
  AlertCircle,
  RefreshCw,
  X,
  UploadCloud,
  Camera,
  Upload,
  Download,
  Key,
  Shield,
  QrCode,
  Activity,
  FileText,
  Copy,
  Globe,
  Database,
} from "lucide-react";
import { MENU_ITEMS, MENU_CATEGORIES } from "@/data/menu";
import { getLocalEventStats } from "@/lib/analytics";
import { OverrideMode, StatusOverrideData } from "@/lib/status";
import rawBackupData from "@/data/backup/camcu_raw_backup.json";
import {
  getSharedData,
  setSharedData,
  KEYS,
  SharedAnnouncement,
} from "@/lib/syncStore";
import {
  CAMCU_AUTH_KEY,
  CAMCU_MENU_OVERRIDES_KEY,
  CAMCU_ANNOUNCEMENTS_KEY,
  CAMCU_SETTINGS_KEY,
  CAMCU_GALLERY_KEY,
  getStoredData,
  setStoredData,
  getSharedCookie,
  removeSharedCookie,
  compressImageFile,
} from "@/utils/storage";

import defaultGalleryData from "@/data/gallery.json";
import ThemeToggle from "@/components/ThemeToggle";
import LightboxModal from "@/components/LightboxModal";
import {
  useStoreStatus,
  setStoreOverride,
  StoreOverrideMode,
} from "@/lib/openingHours";
import IntegrationsTab from "@/components/admin/IntegrationsTab";
import AnalyticsTab from "@/components/admin/AnalyticsTab";
import SearchConsoleTab from "@/components/admin/SearchConsoleTab";
import AdminPasswordLogin from "@/components/admin/AdminPasswordLogin";
import SeoTab from "@/components/admin/SeoTab";
import BackupTab from "@/components/admin/BackupTab";
import { useLanguage } from "@/context/LanguageContext";

export type AdminTab =
  | "overview"
  | "analytics"
  | "searchConsole"
  | "integrations"
  | "menu"
  | "gallery"
  | "settings"
  | "content"
  | "seo"
  | "backup"
  | "security";

type AnnouncementItem = SharedAnnouncement;

interface GalleryItem {
  id: string;
  title: string;
  url: string;
  category: string;
  caption?: string;
}

interface StoreSettingsData {
  isOpen: boolean;
  statusText: string;
  hoursWeekday: string;
  hoursWeekend: string;
  hotline1: string;
  hotline2: string;
  address: string;
  topBanner: string;
  topBannerEnabled?: boolean;
}

function createUniqueId(prefix = ""): string {
  return `${prefix}${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
}

export default function AdminPage({ initialTab = "overview" }: { initialTab?: AdminTab }) {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [needsFirstLogin, setNeedsFirstLogin] = useState<boolean>(false);

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<AdminTab>(initialTab);

  // Global bilingual synchronization hook
  const { locale, setLocale } = useLanguage();

  // Overview Real Metrics State
  const [overviewGa4, setOverviewGa4] = useState<{
    connected: boolean;
    users: number;
    calls: number;
    directions: number;
  } | null>(null);
  const [overviewGsc, setOverviewGsc] = useState<{
    connected: boolean;
    clicks: number;
  } | null>(null);

  // Store opening hours & override state (Single source of truth)
  const storeStatus = useStoreStatus();
  const [storeOverride, setStoreOverrideState] = useState<StoreOverrideMode>("auto");

  // Bảng Giờ hoạt động 7 ngày (Mục D13)
  const [schedule7Days, setSchedule7Days] = useState([
    { dayId: "mon", dayName: "Thứ Hai", openTime: "07:00", closeTime: "18:00", isClosed: false },
    { dayId: "tue", dayName: "Thứ Ba", openTime: "07:00", closeTime: "18:00", isClosed: false },
    { dayId: "wed", dayName: "Thứ Tư", openTime: "07:00", closeTime: "18:00", isClosed: false },
    { dayId: "thu", dayName: "Thứ Năm", openTime: "07:00", closeTime: "18:00", isClosed: false },
    { dayId: "fri", dayName: "Thứ Sáu", openTime: "07:00", closeTime: "22:00", isClosed: false },
    { dayId: "sat", dayName: "Thứ Bảy", openTime: "07:00", closeTime: "22:00", isClosed: false },
    { dayId: "sun", dayName: "Chủ Nhật", openTime: "07:00", closeTime: "22:00", isClosed: false },
  ]);

  const updateDaySchedule = (index: number, field: string, value: any) => {
    setSchedule7Days((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  // Quản lý ngày nghỉ lễ bằng lịch (Mục D13)
  const [holidays, setHolidays] = useState<{ id: string; date: string; name: string }[]>([
    { id: "h1", date: "2026-04-26", name: "Giỗ Tổ Hùng Vương (10/3 Âm lịch)" },
    { id: "h2", date: "2026-04-30", name: "Kỷ niệm Giải phóng miền Nam (30/4)" },
    { id: "h3", date: "2026-05-01", name: "Quốc tế Lao động (1/5)" },
  ]);
  const [newHolidayDate, setNewHolidayDate] = useState("");
  const [newHolidayName, setNewHolidayName] = useState("");
  const [unlockStoreInfo, setUnlockStoreInfo] = useState(false);

  const handleAddHoliday = () => {
    if (!newHolidayDate || !newHolidayName.trim()) return;
    setHolidays((prev) => [
      ...prev,
      { id: Date.now().toString(), date: newHolidayDate, name: newHolidayName.trim() },
    ]);
    setNewHolidayDate("");
    setNewHolidayName("");
  };

  const handleRemoveHoliday = (id: string | number) => {
    setHolidays((prev) => prev.filter((h, i) => h.id !== id && i !== id));
  };
  const [overrideDuration, setOverrideDuration] = useState<"1h" | "2h" | "4h" | "today" | "indefinite">("indefinite");
  const [lastToggledItem, setLastToggledItem] = useState<{ id: string; name: string; prevStatus: boolean } | null>(null);
  const [adminLightboxOpen, setAdminLightboxOpen] = useState<boolean>(false);
  const [adminLightboxIndex, setAdminLightboxIndex] = useState<number>(0);

  // 2FA Security State
  const [totpEnabled, setTotpEnabled] = useState<boolean>(false);
  const [isTotpModalOpen, setIsTotpModalOpen] = useState<boolean>(false);
  const [totpSetupData, setTotpSetupData] = useState<{ secret: string; uri: string; recoveryCodes: string[] } | null>(null);
  const [totpVerificationCode, setTotpVerificationCode] = useState<string>("");
  const [totpModalMsg, setTotpModalMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [recoveryCodesCopied, setRecoveryCodesCopied] = useState<boolean>(false);

  // 7-day Analytics Engagement Stats
  const [analyticsStats, setAnalyticsStats] = useState({
    click_call: 0,
    click_zalo: 0,
    click_directions: 0,
    view_menu: 0,
  });

  // CSV input ref
  const csvInputRef = useRef<HTMLInputElement | null>(null);

  // Content Blocks Page Selection & State
  const [selectedContentPage, setSelectedContentPage] = useState<
    "home" | "about" | "space" | "menu" | "contact" | "common" | "nav"
  >("home");
  const [contentData, setContentData] = useState<{ vi: Record<string, any>; en: Record<string, any> }>(() => {
    const raw = ((rawBackupData as any).content_blocks || { vi: {}, en: {} });
    try {
      const cached = getSharedData<{ vi: Record<string, any>; en: Record<string, any> } | null>(KEYS.CONTENT_BLOCKS, null);
      if (cached && (cached.vi || cached.en)) {
        return {
          vi: { ...(raw.vi || {}), ...(cached.vi || {}) },
          en: { ...(raw.en || {}), ...(cached.en || {}) },
        };
      }
    } catch (_) {}
    return raw;
  });
  const [editingContentKey, setEditingContentKey] = useState<string | null>(null);
  const [editViVal, setEditViVal] = useState<string>("");
  const [editEnVal, setEditEnVal] = useState<string>("");

  const handleSaveContentKey = async (section: string, key: string) => {
    try {
      const updated = {
        vi: {
          ...contentData.vi,
          [section]: {
            ...(contentData.vi[section] || {}),
            [key]: editViVal,
          },
        },
        en: {
          ...contentData.en,
          [section]: {
            ...(contentData.en[section] || {}),
            [key]: editEnVal,
          },
        },
      };
      setContentData(updated);

      // Save compact overrides delta for cross-domain cookie & 1ms broadcast
      const currentOverrides = getSharedData<any>(KEYS.CONTENT_OVERRIDES, {}) || {};
      const updatedOverrides = {
        ...currentOverrides,
        [section]: {
          ...(currentOverrides[section] || {}),
          vi: {
            ...((currentOverrides[section] || {}).vi || {}),
            [key]: editViVal,
          },
          en: {
            ...((currentOverrides[section] || {}).en || {}),
            [key]: editEnVal,
          },
        },
      };
      setSharedData(KEYS.CONTENT_OVERRIDES, updatedOverrides);
      setSharedData(KEYS.CONTENT_BLOCKS, updated);
      setEditingContentKey(null);
      showToast(`Đã lưu và đồng bộ tức thì [${key}]!`);

      await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section,
          key,
          value_vi: editViVal,
          value_en: editEnVal,
        }),
      });
    } catch {
      showToast("Lỗi khi lưu nội dung");
    }
  };

  // Store data state
  const [menuOverrides, setMenuOverrides] = useState<Record<string, { inStock: boolean; price?: number }>>({});
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>(() => {
    return getSharedData<AnnouncementItem[]>(KEYS.ANNOUNCEMENTS, []);
  });
  const [gallery, setGallery] = useState<GalleryItem[]>(() => {
    const shared = getSharedData<GalleryItem[]>(KEYS.GALLERY, []);
    if (shared && shared.length > 0) {
      return shared;
    }
    return defaultGalleryData as GalleryItem[];
  });
  const [settings, setSettings] = useState<StoreSettingsData>({
    isOpen: true,
    statusText: "Quán đang mở cửa đón khách",
    hoursWeekday: "07:00 - 18:00",
    hoursWeekend: "07:00 - 22:00",
    hotline1: "038 285 1688",
    hotline2: "077 465 9000",
    address: "Hẻm 437 Hùng Vương, Phường Nghĩa Trung, TP. Gia Nghĩa, Tỉnh Đắk Nông",
    topBanner: "🌿 Chào mừng đến với Cẩm Cù House • Giờ mở cửa: T2 - T5 (07:00 - 18:00) | T6 - CN (07:00 - 22:00)",
    topBannerEnabled: true,
  });

  // Real operational counters (No fake metrics)
  const totalMenuItems = MENU_ITEMS.length;
  const outOfStockCount = Object.values(menuOverrides).filter((o) => o.inStock === false).length;
  const inStockCount = totalMenuItems - outOfStockCount;
  const totalGalleryPhotos = gallery.length;

  // UI state
  const [noticeModalOpen, setNoticeModalOpen] = useState(false);
  const [newNotice, setNewNotice] = useState({
    title: "",
    content: "",
    type: "event" as "event" | "notice" | "special",
    isHighlighted: false,
  });

  // Menu tab state
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [menuSearch, setMenuSearch] = useState("");
  const [editingPriceId, setEditingPriceId] = useState<string | null>(null);
  const [editingPriceValue, setEditingPriceValue] = useState<string>("");

  // Gallery tab state (Direct Batch File Upload & URL)
  interface PendingPhoto {
    id: string;
    name: string;
    dataUrl: string;
    sizeKb: number;
    title: string;
  }

  const [galleryUploadMode, setGalleryUploadMode] = useState<"file" | "url">("file");
  const [newPhoto, setNewPhoto] = useState({
    title: "",
    url: "",
  });
  const [pendingPhotos, setPendingPhotos] = useState<PendingPhoto[]>([]);
  const [batchCategory, setBatchCategory] = useState<string>("stream");
  const [isProcessingBatch, setIsProcessingBatch] = useState<boolean>(false);
  const [batchProgress, setBatchProgress] = useState<string>("");
  const [isDraggingFile, setIsDraggingFile] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Settings PIN change state
  const [oldPin, setOldPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [pinChangeMsg, setPinChangeMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Toast / notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Check login & Hydrate state on mount from LocalStorage & Cookies
  useEffect(() => {
    // 1. Auth check: Invalidate legacy 2610 session tokens
    const authVal = getStoredData<string>(CAMCU_AUTH_KEY, "") || getSharedCookie(CAMCU_AUTH_KEY);
    if (authVal === "authenticated_session_2610") {
      localStorage.removeItem(CAMCU_AUTH_KEY);
      removeSharedCookie(CAMCU_AUTH_KEY);
    }

    // Verify session with server API
    fetch("/api/admin/auth")
      .then((r) => r.json())
      .then((d) => {
        if (d.success) {
          setNeedsFirstLogin(Boolean(d.needsFirstLogin));
          if (d.isAuthenticated) {
            setIsAuthenticated(true);
          }
          if (typeof d.totpEnabled === "boolean") {
            setTotpEnabled(d.totpEnabled);
          }
        }
      })
      .catch(() => {});

    // Hydrate 7-day Google Analytics 4 Real Metrics
    fetch("/api/admin/analytics?days=7")
      .then((r) => r.json())
      .then((d) => {
        if (d.success && d.data) {
          setOverviewGa4({
            connected: Boolean(d.data.connected),
            users: d.data.overview?.totalUsers || 0,
            calls: d.data.events?.click_call || 0,
            directions: d.data.events?.click_directions || 0,
          });
        }
      })
      .catch(() => {});

    // Hydrate 7-day Google Search Console Real Metrics
    fetch("/api/admin/search-console?days=7")
      .then((r) => r.json())
      .then((d) => {
        if (d.success && d.data) {
          setOverviewGsc({
            connected: Boolean(d.data.connected),
            clicks: d.data.overview?.totalClicks || 0,
          });
        }
      })
      .catch(() => {});

    // 2. Hydrate from Shared Storage first (survives F5 and syncs across subdomains)
    const storedOverrides = getStoredData<Record<string, { inStock: boolean; price?: number }>>(
      CAMCU_MENU_OVERRIDES_KEY,
      {}
    );
    if (Object.keys(storedOverrides).length > 0) {
      setMenuOverrides(storedOverrides);
    }

    const sharedAnnouncements = getSharedData<AnnouncementItem[]>(KEYS.ANNOUNCEMENTS, []);
    setAnnouncements(sharedAnnouncements);

    const sharedGallery = getSharedData<GalleryItem[]>(KEYS.GALLERY, []);
    const standardList = defaultGalleryData as GalleryItem[];
    if (!sharedGallery || sharedGallery.length === 0) {
      setGallery(standardList);
      setSharedData(KEYS.GALLERY, standardList);
      setStoredData(CAMCU_GALLERY_KEY, standardList, false);
    } else {
      let isChanged = false;
      const reconciled = sharedGallery.map((item) => {
        const match = standardList.find(
          (std) => std.id === item.id || std.url === item.url || (item.title && item.title.startsWith("1 ("))
        );
        if (match && (item.title.startsWith("1 (") || !item.caption || (item.category === "stream" && match.category !== "stream"))) {
          isChanged = true;
          return {
            ...item,
            title: match.title,
            caption: match.caption,
            category: match.category,
          };
        }
        return item;
      });

      standardList.forEach((std) => {
        if (!reconciled.some((r) => r.url === std.url || r.id === std.id)) {
          reconciled.push(std);
          isChanged = true;
        }
      });

      setGallery(reconciled);
      if (isChanged) {
        setSharedData(KEYS.GALLERY, reconciled);
        setStoredData(CAMCU_GALLERY_KEY, reconciled, false);
      }
    }

    const storedSettings = getStoredData<StoreSettingsData | null>(CAMCU_SETTINGS_KEY, null);
    if (storedSettings) {
      setSettings((prev) => ({ ...prev, ...storedSettings }));
    }

    // 3. Sync from API in background
    fetch("/api/admin/menu")
      .then((res) => res.json())
      .then((data) => {
        if (data.overrides) {
          setMenuOverrides((prev) => {
            const merged = { ...data.overrides, ...prev };
            setStoredData(CAMCU_MENU_OVERRIDES_KEY, merged, true);
            return merged;
          });
        }
      })
      .catch((err) => console.warn(err));

    fetch("/api/admin/gallery")
      .then((res) => res.json())
      .then((data) => {
        if (data.photos && data.photos.length > 0) {
          setGallery((prev) => {
            if (prev.length === 0) {
              setStoredData(CAMCU_GALLERY_KEY, data.photos, false);
              setSharedData(KEYS.GALLERY, data.photos);
              return data.photos;
            }
            return prev;
          });
        }
      })
      .catch((err) => console.warn(err));

    fetch("/api/admin/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.settings) {
          setSettings((prev) => {
            const merged = { ...data.settings, ...prev };
            setStoredData(CAMCU_SETTINGS_KEY, merged, true);
            return merged;
          });
        }
      })
      .catch((err) => console.warn(err));

    // Hydrate 7-day Analytics
    const localStats = getLocalEventStats(7);
    setAnalyticsStats(localStats);

    fetch("/api/analytics")
      .then((r) => r.json())
      .then((d) => {
        if (d && d.stats) {
          setAnalyticsStats((prev) => ({
            click_call: Math.max(prev.click_call, d.stats.click_call || 0),
            click_zalo: Math.max(prev.click_zalo, d.stats.click_zalo || 0),
            click_directions: Math.max(prev.click_directions, d.stats.click_directions || 0),
            view_menu: Math.max(prev.view_menu, d.stats.view_menu || 0),
          }));
        }
      })
      .catch(() => {});

    // Check 2FA configuration
    fetch("/api/admin/auth", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "status" }),
    })
      .then((r) => r.json())
      .then((d) => {
        if (d && typeof d.totpEnabled === "boolean") {
          setTotpEnabled(d.totpEnabled);
        }
      })
      .catch(() => {});

    // Hydrate Content Blocks from API
    fetch("/api/admin/content")
      .then((r) => r.json())
      .then((d) => {
        if (d && d.content) {
          setContentData(d.content);
        }
      })
      .catch(() => {});
  }, []);

  // Logout handler
  const handleLogout = async () => {
    try {
      await fetch("/api/admin/auth", { method: "DELETE" });
    } catch (e) {
      console.error(e);
    }
    localStorage.removeItem(CAMCU_AUTH_KEY);
    removeSharedCookie(CAMCU_AUTH_KEY);
    setIsAuthenticated(false);
    showToast("Đã đăng xuất phiên làm việc an toàn");
  };

  // Store status override with duration
  const handleStoreOverrideChange = (
    mode: StoreOverrideMode,
    duration: "1h" | "2h" | "4h" | "today" | "indefinite" = overrideDuration
  ) => {
    setStoreOverrideState(mode);
    setStoreOverride(mode);

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
    const detailData: StatusOverrideData = { mode: detailMode, until };
    setStoredData("camcu_status_override_detail", detailData, true);

    const label = mode === "auto" ? "Tự động theo lịch" : mode === "force_open" ? "🟢 Mở cửa" : "🔴 Tạm đóng cửa";
    const durationLabel = until
      ? ` (hết hạn lúc ${new Date(until).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })})`
      : "";
    showToast(`Đã lưu trạng thái: ${label}${durationLabel}`);
  };

  // CSV Export & Import for Menu Items
  const handleExportMenuCsv = () => {
    const headers = ["id", "category", "categoryName", "name", "price", "tag", "inStock", "description"];
    const rows = MENU_ITEMS.map((item) => {
      const inStock = menuOverrides[item.id]?.inStock ?? true;
      const price = menuOverrides[item.id]?.price ?? item.price;
      return [
        item.id,
        item.category,
        `"${item.categoryName.replace(/"/g, '""')}"`,
        `"${item.name.replace(/"/g, '""')}"`,
        price,
        item.tag || "",
        inStock ? "1" : "0",
        `"${(item.description || "").replace(/"/g, '""')}"`,
      ];
    });

    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map((r) => r.join(","))].join("\r\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `thuc-don-cam-cu-house-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Đã xuất danh sách 67 món ra file CSV thành công!");
  };

  const handleImportMenuCsv = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = (event.target?.result as string) || "";
        const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
        if (lines.length <= 1) {
          showToast("File CSV không có dữ liệu món");
          return;
        }

        const newOverrides: Record<string, { inStock: boolean; price?: number }> = { ...menuOverrides };
        let updatedCount = 0;

        for (let i = 1; i < lines.length; i++) {
          const parts = lines[i].split(",");
          if (parts.length >= 5) {
            const id = parts[0].trim().replace(/^"|"$/g, "");
            const price = parseInt(parts[4].trim(), 10);
            const inStock = parts[6] ? parts[6].trim() === "1" || parts[6].trim().toLowerCase() === "còn hàng" : true;

            const existingItem = MENU_ITEMS.find((m) => m.id === id);
            if (existingItem) {
              newOverrides[id] = {
                inStock,
                price: !isNaN(price) && price > 0 ? price : existingItem.price,
              };
              updatedCount++;
            }
          }
        }

        setMenuOverrides(newOverrides);
        setStoredData(CAMCU_MENU_OVERRIDES_KEY, newOverrides, true);

        const disabledIds = Object.entries(newOverrides)
          .filter(([, v]) => v.inStock === false)
          .map(([k]) => k);
        setSharedData(KEYS.DISABLED_MENU_IDS, disabledIds);

        showToast(`Đã nhập thành công ${updatedCount} món từ file CSV!`);
      } catch (err) {
        showToast("Lỗi khi đọc file CSV");
      }
    };
    reader.readAsText(file, "UTF-8");
    e.target.value = "";
  };

  // 2FA TOTP Management Handlers
  const handleStartTotpSetup = async () => {
    setTotpModalMsg(null);
    setTotpVerificationCode("");
    try {
      const res = await fetch("/api/admin/auth", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "setup" }),
      });
      const data = await res.json();
      if (data.success) {
        setTotpSetupData(data);
        setIsTotpModalOpen(true);
      }
    } catch {
      showToast("Lỗi khi tạo mã bảo mật 2FA");
    }
  };

  const handleVerifyAndEnableTotp = async () => {
    if (!totpSetupData || !totpVerificationCode.trim()) {
      setTotpModalMsg({ type: "error", text: "Vui lòng nhập mã 6 số từ ứng dụng Authenticator" });
      return;
    }
    try {
      const res = await fetch("/api/admin/auth", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "verify_enable",
          secret: totpSetupData.secret,
          code: totpVerificationCode.trim(),
          recoveryCodes: totpSetupData.recoveryCodes,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setTotpEnabled(true);
        setTotpModalMsg({ type: "success", text: "Đã kích hoạt 2FA thành công! Hãy lưu 5 mã khôi phục bên dưới." });
        showToast("Đã kích hoạt bảo mật 2 lớp 2FA!");
      } else {
        setTotpModalMsg({ type: "error", text: data.error || "Mã xác thực không đúng" });
      }
    } catch {
      setTotpModalMsg({ type: "error", text: "Lỗi kết nối khi kích hoạt 2FA" });
    }
  };

  const handleDisableTotp = async () => {
    if (!confirm("Bạn có chắc chắn muốn tắt bảo mật 2 lớp 2FA không?")) return;
    try {
      const res = await fetch("/api/admin/auth", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "disable" }),
      });
      const data = await res.json();
      if (data.success) {
        setTotpEnabled(false);
        setIsTotpModalOpen(false);
        showToast("Đã tắt xác thực 2 lớp 2FA");
      }
    } catch {
      showToast("Lỗi khi tắt 2FA");
    }
  };



  // Toggle item in stock with Undo support
  const handleToggleStock = async (id: string, currentStatus: boolean, isUndo = false) => {
    const newStatus = !currentStatus;
    const item = MENU_ITEMS.find((m) => m.id === id);
    const itemName = item?.name || "Món";

    const updated = {
      ...menuOverrides,
      [id]: {
        ...menuOverrides[id],
        inStock: newStatus,
      },
    };
    setMenuOverrides(updated);
    setStoredData(CAMCU_MENU_OVERRIDES_KEY, updated, true);

    // Sync camcu_disabled_menu_ids (array of out-of-stock item IDs)
    const currentDisabled = getSharedData<string[]>(KEYS.DISABLED_MENU_IDS, []);
    let updatedDisabled: string[];
    if (!newStatus) {
      updatedDisabled = Array.from(new Set([...currentDisabled, id]));
    } else {
      updatedDisabled = currentDisabled.filter((itemId) => itemId !== id);
    }
    setSharedData(KEYS.DISABLED_MENU_IDS, updatedDisabled);

    if (!isUndo) {
      setLastToggledItem({ id, name: itemName, prevStatus: currentStatus });
      showToast(`Đã ${newStatus ? "bật còn hàng" : "báo tạm hết"} cho "${itemName}"`);
    } else {
      setLastToggledItem(null);
      showToast(`Đã hoàn tác trạng thái cho "${itemName}"`);
    }

    try {
      await fetch("/api/admin/menu", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, inStock: newStatus }),
      });
    } catch (err) {
      console.error("Lỗi cập nhật trạng thái món:", err);
    }
  };

  // Update item price
  const handleSavePrice = async (id: string) => {
    const numPrice = parseInt(editingPriceValue.replace(/[^0-9]/g, ""), 10);
    if (isNaN(numPrice) || numPrice <= 0) {
      showToast("Vui lòng nhập giá hợp lệ");
      return;
    }

    const updated = {
      ...menuOverrides,
      [id]: {
        ...menuOverrides[id],
        inStock: menuOverrides[id]?.inStock ?? true,
        price: numPrice,
      },
    };
    setMenuOverrides(updated);
    setStoredData(CAMCU_MENU_OVERRIDES_KEY, updated, true);
    setEditingPriceId(null);
    showToast(`Đã cập nhật giá mới: ${numPrice.toLocaleString("vi-VN")}đ`);

    try {
      await fetch("/api/admin/menu", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, price: numPrice }),
      });
    } catch (err) {
      console.error(err);
    }
  };

  // Create Announcement
  const handleCreateAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNotice.title.trim() || !newNotice.content.trim()) {
      alert("Vui lòng nhập đầy đủ tiêu đề và nội dung");
      return;
    }

    const uniqueId = createUniqueId("notice_");
    const newNoticeItem: AnnouncementItem = {
      id: uniqueId,
      title: newNotice.title.trim(),
      content: newNotice.content.trim(),
      category: newNotice.type,
      type: newNotice.type,
      isPinned: newNotice.isHighlighted,
      isHighlighted: newNotice.isHighlighted,
      createdAt: new Date().toLocaleDateString("vi-VN"),
      date: "Hôm nay",
    };

    setAnnouncements((prev) => {
      const updated = [newNoticeItem, ...prev];
      setSharedData(KEYS.ANNOUNCEMENTS, updated);
      setStoredData(CAMCU_ANNOUNCEMENTS_KEY, updated, true);
      return updated;
    });

    setNoticeModalOpen(false);
    setNewNotice({ title: "", content: "", type: "event", isHighlighted: false });
    showToast("Đã đăng bản tin mới thành công");

    try {
      fetch("/api/admin/announcements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newNoticeItem),
      }).catch((err) => console.warn(err));
    } catch (err) {
      console.error(err);
    }
  };

  // Delete Announcement - Immediate removal & Cookie sync
  const handleDeleteAnnouncement = (id: string) => {
    setAnnouncements((prev) => {
      const updated = prev.filter((a) => a.id !== id);
      setSharedData(KEYS.ANNOUNCEMENTS, updated);
      setStoredData(CAMCU_ANNOUNCEMENTS_KEY, updated, true);
      return updated;
    });
    showToast("Đã xóa bản tin thành công");

    try {
      fetch(`/api/admin/announcements?id=${id}`, { method: "DELETE" }).catch((err) =>
        console.warn(err)
      );
    } catch (err) {
      console.error(err);
    }
  };

  // Batch file upload & drag-drop handler with Canvas compression
  const handleFilesSelect = async (files: FileList | File[]) => {
    const fileArray = Array.from(files).filter((f) => f.type.startsWith("image/"));
    if (fileArray.length === 0) {
      alert("Vui lòng chọn các file hình ảnh hợp lệ (.jpg, .jpeg, .png, .webp)");
      return;
    }

    setIsProcessingBatch(true);
    setBatchProgress(`Đang tối ưu & nén 0/${fileArray.length} ảnh...`);

    const newPendingList: PendingPhoto[] = [];
    let count = 0;

    for (const file of fileArray) {
      try {
        count++;
        setBatchProgress(`Đang nén & tối ưu ${count}/${fileArray.length}: ${file.name}...`);

        // Compress using Canvas (max 1280px, quality 0.78)
        const compressedDataUrl = await compressImageFile(file, 1280, 1280, 0.78);
        const compressedSizeKb = Math.round((compressedDataUrl.length * 0.75) / 1024);

        const titleWithoutExt = file.name
          .replace(/\.[^/.]+$/, "")
          .replace(/[-_]/g, " ")
          .trim();

        newPendingList.push({
          id: createUniqueId("pending_"),
          name: file.name,
          dataUrl: compressedDataUrl,
          sizeKb: compressedSizeKb,
          title: titleWithoutExt,
        });
      } catch (err) {
        console.error("Lỗi nén ảnh:", file.name, err);
      }
    }

    setPendingPhotos((prev) => [...prev, ...newPendingList]);
    setIsProcessingBatch(false);
    setBatchProgress("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    showToast(`Đã nạp ${newPendingList.length} ảnh xem trước thành công!`);
  };

  const handleRemovePendingPhoto = (id: string) => {
    setPendingPhotos((prev) => prev.filter((p) => p.id !== id));
  };

  const handleUpdatePendingTitle = (id: string, newTitle: string) => {
    setPendingPhotos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, title: newTitle } : p))
    );
  };

  const handleClearAllPending = () => {
    setPendingPhotos([]);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingFile(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingFile(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingFile(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFilesSelect(e.dataTransfer.files);
    }
  };

  // Add Photos (Batch or Single URL)
  const handleSaveGalleryPhotos = async (e: React.FormEvent) => {
    e.preventDefault();

    if (galleryUploadMode === "url") {
      if (!newPhoto.title.trim() || !newPhoto.url.trim()) {
        alert("Vui lòng nhập tiêu đề và liên kết hình ảnh");
        return;
      }
      const newPhotoItem: GalleryItem = {
        id: createUniqueId("photo_"),
        title: newPhoto.title.trim(),
        url: newPhoto.url.trim(),
        category: batchCategory as any,
      };

      const updatedGallery = [newPhotoItem, ...gallery];
      setGallery(updatedGallery);
      setSharedData(KEYS.GALLERY, updatedGallery);
      setStoredData(CAMCU_GALLERY_KEY, updatedGallery, false);
      setNewPhoto({ title: "", url: "" });
      showToast("Đã lưu ảnh mới vào thư viện!");

      try {
        fetch("/api/admin/gallery", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newPhotoItem),
        }).catch(() => {});
      } catch {}
      return;
    }

    // Batch File Upload Mode
    if (pendingPhotos.length === 0) {
      alert("Vui lòng chọn ít nhất 1 ảnh để lưu vào thư viện");
      return;
    }

    const newGalleryItems: GalleryItem[] = pendingPhotos.map((p, idx) => ({
      id: `photo_${Date.now()}_${idx}_${Math.random().toString(36).substring(2, 6)}`,
      title: p.title.trim() || `Ảnh không gian ${idx + 1}`,
      url: p.dataUrl,
      category: batchCategory as any,
    }));

    const updatedGallery = [...newGalleryItems, ...gallery];
    setGallery(updatedGallery);
    setSharedData(KEYS.GALLERY, updatedGallery);
    setStoredData(CAMCU_GALLERY_KEY, updatedGallery, false);

    const savedCount = newGalleryItems.length;
    setPendingPhotos([]);
    showToast(`Đã lưu thành công ${savedCount} ảnh vào thư viện quán!`);

    // Background sync to server API
    for (const item of newGalleryItems) {
      fetch("/api/admin/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
      }).catch(() => {});
    }
  };

  // Delete Photo
  const handleDeletePhoto = async (id: string) => {
    const updatedGallery = gallery.filter((g) => g.id !== id);
    setGallery(updatedGallery);
    setSharedData(KEYS.GALLERY, updatedGallery);
    setStoredData(CAMCU_GALLERY_KEY, updatedGallery, false);
    showToast("Đã xóa ảnh khỏi thư viện");

    try {
      fetch(`/api/admin/gallery?id=${id}`, { method: "DELETE" }).catch(() => {});
    } catch {}
  };

  // Update Photo Title, Category, Caption
  const handleUpdatePhoto = async (id: string, updates: Partial<GalleryItem>) => {
    const updatedGallery = gallery.map((item) =>
      item.id === id ? { ...item, ...updates } : item
    );
    setGallery(updatedGallery);
    setSharedData(KEYS.GALLERY, updatedGallery);
    setStoredData(CAMCU_GALLERY_KEY, updatedGallery, false);

    try {
      fetch("/api/admin/gallery", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...updates }),
      }).catch(() => {});
    } catch {}
  };

  // Lightbox Modal Handler
  const handleOpenAdminLightbox = (index: number) => {
    setAdminLightboxIndex(index);
    setAdminLightboxOpen(true);
  };

  // Reset to default 31 standard photos
  const handleResetToDefaultPhotos = () => {
    if (window.confirm("Bạn có chắc chắn muốn đồng bộ và khôi phục 31 ảnh quán về danh mục và tên chuẩn không?")) {
      const resetList = defaultGalleryData as GalleryItem[];
      setGallery(resetList);
      setSharedData(KEYS.GALLERY, resetList);
      setStoredData(CAMCU_GALLERY_KEY, resetList, false);
      showToast("Đã đồng bộ 31 ảnh về taxonomy và tên gọi chuẩn thành công!");
    }
  };

  // Category Label Mapper
  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case "stream":
      case "suoi":
      case "bo-suoi":
        return "Bờ Suối Tự Nhiên";
      case "wooden-terrace":
      case "hien-go":
        return "Hiên Gỗ & Chòi Mộc";
      case "checkin":
      case "check-in":
        return "Góc Check-in & Cảnh Quan";
      case "workspace":
      case "chill-work":
        return "Bàn Ghế Làm Việc / Đọc Sách";
      case "coffee":
      case "nuoc":
        return "Cà Phê & Đồ Uống";
      case "food":
      case "mon-an":
        return "Món Ăn Vặt & Đặc Sản";
      case "hero":
      case "khong-gian":
        return "Banner Nổi Bật Trang Chủ";
      default:
        return cat;
    }
  };

  // Save Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setStoredData(CAMCU_SETTINGS_KEY, settings, true);
    showToast("Cập nhật thông tin cửa hàng thành công");

    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (data.success) {
        showToast("Cập nhật thông tin cửa hàng thành công");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Change Admin Password
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPinChangeMsg(null);

    if (newPin !== confirmPin) {
      setPinChangeMsg({ type: "error", text: "Mật khẩu mới và xác nhận không trùng khớp" });
      return;
    }
    if (newPin.length < 12) {
      setPinChangeMsg({ type: "error", text: "Mật khẩu mới phải có tối thiểu 12 ký tự an toàn" });
      return;
    }

    try {
      const res = await fetch("/api/admin/auth", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "change_password", oldPassword: oldPin, newPassword: newPin }),
      });
      const data = await res.json();
      if (data.success) {
        setPinChangeMsg({ type: "success", text: "Đổi mật khẩu quản trị viên thành công!" });
        setOldPin("");
        setNewPin("");
        setConfirmPin("");
      } else {
        setPinChangeMsg({ type: "error", text: data.error || "Mật khẩu hiện tại không chính xác" });
      }
    } catch {
      setPinChangeMsg({ type: "error", text: "Lỗi kết nối khi đổi mật khẩu" });
    }
  };

  // Filtered menu items
  const filteredMenuItems = MENU_ITEMS.filter((item) => {
    const matchesCat = selectedCategory === "all" || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(menuSearch.toLowerCase());
    return matchesCat && matchesSearch;
  });

  // ==========================================
  // RENDER 1: LUXURY PIN LOCK SCREEN IF NOT AUTHENTICATED
  // ==========================================
  if (!isAuthenticated) {
    return (
      <AdminPasswordLogin
        needsFirstLogin={needsFirstLogin}
        onLoginSuccess={(require2FAPrompt) => {
          setIsAuthenticated(true);
          setNeedsFirstLogin(false);
          if (require2FAPrompt) {
            setActiveTab("security");
            setIsTotpModalOpen(true);
            showToast("Vui lòng kích hoạt 2FA TOTP để hoàn tất bảo vệ tài khoản!");
          }
        }}
      />
    );
  }

  // ==========================================
  // RENDER 2: FULL ADMIN DASHBOARD WITH ACTIVATED SIDEBAR
  // ==========================================
  return (
    <div
      data-admin-page="true"
      className="admin-shell bg-[#F9F8F3] dark:bg-[#121A15] min-h-screen text-[#1B281D] dark:text-[#F5F4EE] flex font-sans selection:bg-[#3E5C46] selection:text-white transition-colors duration-200"
    >
      {/* Toast Alert Notification with Undo support */}
      {toastMessage && (
        <div className="fixed bottom-20 md:bottom-8 right-4 md:right-8 z-[999] bg-[#16261D] text-[#F3EBD8] px-5 py-3.5 rounded-2xl shadow-2xl border border-[rgba(243,235,216,0.2)] flex items-center gap-3 text-xs sm:text-sm font-semibold animate-fade-in max-w-[90vw]">
          <CheckCircle2 className="w-5 h-5 text-[#9DC183] shrink-0" />
          <span className="truncate max-w-[260px] sm:max-w-md">{toastMessage}</span>
          {lastToggledItem && (
            <button
              type="button"
              onClick={() => handleToggleStock(lastToggledItem.id, !lastToggledItem.prevStatus, true)}
              className="ml-auto shrink-0 px-3 py-1.5 bg-[#CC7755] hover:bg-[#b8643f] text-white rounded-lg text-xs font-bold transition-all shadow-sm active:scale-95 cursor-pointer"
            >
              Hoàn tác
            </button>
          )}
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="p-1 text-[#F3EBD8]/60 hover:text-[#F3EBD8] transition-colors ml-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Sidebar - ALWAYS DARK IN BOTH MODES (Background #14241C, Text #F5EEDC, Active #1F3A2A with left border sage #9DC183) */}
      <aside className="hidden md:flex fixed left-0 top-0 h-full w-64 bg-[#14241C] text-[#F5EEDC] z-50 flex-col justify-between py-6 px-4 border-r border-[rgba(245,238,220,0.14)] shadow-sm transition-colors duration-200">
        <div className="flex flex-col gap-6">
          {/* Brand */}
          <div className="flex items-center gap-3 px-2">
            <div className="w-9 h-9 rounded-full bg-[#1F3A2A] border border-[#9DC183]/40 text-[#9DC183] flex items-center justify-center shrink-0 shadow-sm">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-lg font-bold text-[#F5EEDC] leading-tight">
                Cẩm Cù Admin
              </span>
              <span className="text-[11px] text-[#A7A18F] font-medium">Management Console</span>
            </div>
          </div>

          <div className="text-[12px] font-bold uppercase tracking-wider text-[#A7A18F] px-2">
            Hệ Thống Quản Trị
          </div>

          {/* Navigation Links - Always dark, clear active pill with sage left border */}
          <nav className="flex flex-col gap-1.5">
            <button
              type="button"
              onClick={() => setActiveTab("overview")}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-[13px] font-semibold transition-all ${
                activeTab === "overview"
                  ? "bg-[#1F3A2A] text-[#F5EEDC] border-l-4 border-[#9DC183] font-bold"
                  : "text-[#C9C2AE] hover:bg-white/5 hover:text-[#F5EEDC]"
              }`}
            >
              <LayoutDashboard className="w-4 h-4 shrink-0 text-[#9DC183]" />
              <span>Tổng quan</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("analytics")}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-[13px] font-semibold transition-all ${
                activeTab === "analytics"
                  ? "bg-[#1F3A2A] text-[#F5EEDC] border-l-4 border-[#9DC183] font-bold"
                  : "text-[#C9C2AE] hover:bg-white/5 hover:text-[#F5EEDC]"
              }`}
            >
              <TrendingUp className="w-4 h-4 shrink-0 text-[#9DC183]" />
              <span>Google Analytics</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("searchConsole")}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-[13px] font-semibold transition-all ${
                activeTab === "searchConsole"
                  ? "bg-[#1F3A2A] text-[#F5EEDC] border-l-4 border-[#9DC183] font-bold"
                  : "text-[#C9C2AE] hover:bg-white/5 hover:text-[#F5EEDC]"
              }`}
            >
              <Search className="w-4 h-4 shrink-0 text-[#9DC183]" />
              <span>Search Console</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("integrations")}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-[13px] font-semibold transition-all ${
                activeTab === "integrations"
                  ? "bg-[#1F3A2A] text-[#F5EEDC] border-l-4 border-[#9DC183] font-bold"
                  : "text-[#C9C2AE] hover:bg-white/5 hover:text-[#F5EEDC]"
              }`}
            >
              <Key className="w-4 h-4 shrink-0 text-[#9DC183]" />
              <span>Tích Hợp &amp; Khóa</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("menu")}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-[13px] font-semibold transition-all ${
                activeTab === "menu"
                  ? "bg-[#1F3A2A] text-[#F5EEDC] border-l-4 border-[#9DC183] font-bold"
                  : "text-[#C9C2AE] hover:bg-white/5 hover:text-[#F5EEDC]"
              }`}
            >
              <UtensilsCrossed className="w-4 h-4 shrink-0 text-[#9DC183]" />
              <span>Quản Lý Thực Đơn (67 món)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("gallery")}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-[13px] font-semibold transition-all ${
                activeTab === "gallery"
                  ? "bg-[#1F3A2A] text-[#F5EEDC] border-l-4 border-[#9DC183] font-bold"
                  : "text-[#C9C2AE] hover:bg-white/5 hover:text-[#F5EEDC]"
              }`}
            >
              <ImageIcon className="w-4 h-4 shrink-0 text-[#9DC183]" />
              <span>Thư Viện Ảnh (30+ ảnh)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("settings")}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-[13px] font-semibold transition-all ${
                activeTab === "settings"
                  ? "bg-[#1F3A2A] text-[#F5EEDC] border-l-4 border-[#9DC183] font-bold"
                  : "text-[#C9C2AE] hover:bg-white/5 hover:text-[#F5EEDC]"
              }`}
            >
              <Settings className="w-4 h-4 shrink-0 text-[#9DC183]" />
              <span>Cài Đặt Cửa Hàng</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("content")}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-[13px] font-semibold transition-all ${
                activeTab === "content"
                  ? "bg-[#1F3A2A] text-[#F5EEDC] border-l-4 border-[#9DC183] font-bold"
                  : "text-[#C9C2AE] hover:bg-white/5 hover:text-[#F5EEDC]"
              }`}
            >
              <FileText className="w-4 h-4 shrink-0 text-[#9DC183]" />
              <span>Nội Dung Trang (5 trang)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("seo")}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-[13px] font-semibold transition-all ${
                activeTab === "seo"
                  ? "bg-[#1F3A2A] text-[#F5EEDC] border-l-4 border-[#9DC183] font-bold"
                  : "text-[#C9C2AE] hover:bg-white/5 hover:text-[#F5EEDC]"
              }`}
            >
              <Globe className="w-4 h-4 shrink-0 text-[#9DC183]" />
              <span>SEO &amp; Mạng Xã Hội</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("backup")}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-[13px] font-semibold transition-all ${
                activeTab === "backup"
                  ? "bg-[#1F3A2A] text-[#F5EEDC] border-l-4 border-[#9DC183] font-bold"
                  : "text-[#C9C2AE] hover:bg-white/5 hover:text-[#F5EEDC]"
              }`}
            >
              <Database className="w-4 h-4 shrink-0 text-[#9DC183]" />
              <span>Sao Lưu &amp; Hệ Thống</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("security")}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-[13px] font-semibold transition-all ${
                activeTab === "security"
                  ? "bg-[#1F3A2A] text-[#F5EEDC] border-l-4 border-[#9DC183] font-bold"
                  : "text-[#C9C2AE] hover:bg-white/5 hover:text-[#F5EEDC]"
              }`}
            >
              <Shield className="w-4 h-4 shrink-0 text-[#9DC183]" />
              <span>Tài Khoản &amp; 2FA</span>
            </button>
          </nav>
        </div>

        {/* User Card with Logout Action */}
        <div className="p-3 bg-[#16231C] text-[#F5EEDC] rounded-2xl border border-[rgba(245,238,220,0.14)] shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#1F3A2A] border border-[#9DC183]/40 text-[#9DC183] flex items-center justify-center font-bold text-xs shrink-0">
              CC
            </div>
            <div className="flex flex-col">
              <span className="text-[13px] font-bold text-[#F5EEDC]">Quản lý viên</span>
              <span className="text-[12px] text-[#A7A18F]">Gia Nghĩa Hub</span>
            </div>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            title="Đăng xuất khỏi hệ thống"
            className="p-2 rounded-xl text-[#A7A18F] hover:text-[#F28B82] hover:bg-red-950/30 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* Main Content Body */}
      <div className="pl-0 md:pl-64 pb-20 md:pb-8 w-full min-h-screen flex flex-col bg-[var(--bg)] text-[var(--text)] transition-colors duration-300">
        {/* Top Header */}
        <header className="h-16 bg-[var(--bg)]/95 backdrop-blur-xl border-b border-[var(--border)] sticky top-0 z-40 flex items-center justify-between px-6 sm:px-8">
          <div className="flex items-center gap-3">
            {/* Store Status Override Control */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-stone-700 dark:text-stone-300 hidden md:inline">
                Hệ thống Hoạt Động:
              </span>
              <div className="relative inline-flex items-center">
                <select
                  value={storeOverride}
                  onChange={(e) => handleStoreOverrideChange(e.target.value as StoreOverrideMode)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                    storeStatus.badgeType === "open"
                      ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200 border-emerald-300 dark:border-emerald-800"
                      : storeStatus.badgeType === "closing_soon"
                      ? "bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-200 border-amber-300 dark:border-amber-800"
                      : "bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-200 border-rose-300 dark:border-rose-800"
                  }`}
                >
                  <option value="auto">⏱ Tự động theo lịch ({storeStatus.shortBadge})</option>
                  <option value="force_open">🟢 Bắt buộc mở (Force Open)</option>
                  <option value="force_closed">🔴 Tạm đóng cửa / Nghỉ lễ (Force Closed)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <div className="hidden lg:flex items-center gap-1.5 text-xs text-stone-600 dark:text-stone-400">
              <Clock className="w-3.5 h-3.5 text-[#396663] dark:text-[#88B795]" />
              <span>Đắk Nông (GMT+7: {storeStatus.currentTimeVN}) • {storeStatus.scheduleText}</span>
            </div>

            <div className="flex items-center gap-2">
              {/* VN / EN Switcher rõ ràng hai chiều: Anh ra Anh, Việt ra Việt */}
              <div
                className="inline-flex items-center rounded-full p-0.5 border border-stone-300 dark:border-stone-700/60 bg-stone-100 dark:bg-[#1E2B22] text-[11px] font-mono font-bold shadow-2xs"
                role="group"
                aria-label="Chọn ngôn ngữ / Select language"
              >
                <button
                  type="button"
                  onClick={() => setLocale("vi")}
                  className={`px-2.5 py-1 rounded-full transition-all cursor-pointer ${
                    locale === "vi"
                      ? "bg-[#3E5C46] text-white shadow-xs font-black"
                      : "text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white"
                  }`}
                  title="Tiếng Việt"
                >
                  VN
                </button>
                <span className="text-[10px] opacity-25 px-0.5">·</span>
                <button
                  type="button"
                  onClick={() => setLocale("en")}
                  className={`px-2.5 py-1 rounded-full transition-all cursor-pointer ${
                    locale === "en"
                      ? "bg-[#3E5C46] text-white shadow-xs font-black"
                      : "text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white"
                  }`}
                  title="English"
                >
                  EN
                </button>
              </div>

              {/* Theme Toggle Button */}
              <ThemeToggle />

              {/* Nút Xem Website mở trong tab mới */}
              <a
                href="https://camcuhouse.online"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#3E5C46] text-white text-xs font-semibold hover:bg-[#2D4233] transition-all shadow-sm"
              >
                <span>Xem Website</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </header>

        {/* Dashboard Main Workspace (Max width 1200px, 24px gap between cards) */}
        <main className="p-6 sm:p-8 flex flex-col gap-6 max-w-[1200px] mx-auto w-full">
          {/* ========================================================= */}
          {/* TAB 1: OVERVIEW (TỔNG QUAN) */}
          {/* ========================================================= */}
          {activeTab === "overview" && (
            <>
              {/* Welcome Banner */}
              <div className="admin-card p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-2 text-[12px] font-bold text-[var(--accent)] uppercase tracking-wider">
                    <Sparkles className="w-4 h-4 shrink-0" />
                    <span>Bảng Điều Khiển Vận Hành</span>
                  </div>
                  <h1 className="admin-h1 font-serif text-[26px] leading-[1.2] font-bold text-[var(--text)]">
                    Xin chào <span className="underline decoration-[#9DC183]/60">Quản lý Cẩm Cù House</span>
                  </h1>
                  <p className="admin-subtle flex items-center gap-2 flex-wrap">
                    <span>Hôm nay:</span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-[var(--accent)]/15 text-[var(--accent)] font-bold text-[12px]">
                      {settings.isOpen ? "Quán đang mở cửa đón khách" : "Quán đang tạm nghỉ"}
                    </span>
                    <span>•</span>
                    <span>Khu sinh thái Suối Reo, Nghĩa Trung, Gia Nghĩa</span>
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setNoticeModalOpen(true)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[var(--surface-2)] hover:opacity-90 text-[var(--text)] text-[13px] font-semibold transition-all border border-[var(--border)] cursor-pointer"
                  >
                    <Radio className="w-4 h-4 text-[var(--accent)]" />
                    <span>+ Tạo Tin Mới</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("menu")}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[var(--btn-primary)] text-white text-[13px] font-semibold hover:opacity-90 transition-all shadow-md cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Quản Lý Menu Món</span>
                  </button>
                </div>
              </div>

              {/* 4 KPI Cards (Equal height, 1-line label, same row values & icons, >= 44px outline button) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                {/* 1. Người dùng 7 ngày (GA4) */}
                <div className="admin-card p-5 h-full flex flex-col justify-between">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex flex-col min-w-0">
                      <span className="admin-label truncate block">
                        Người dùng 7 ngày
                      </span>
                      <div className="mt-1">
                        {overviewGa4?.connected ? (
                          <div className="flex items-baseline gap-2">
                            <span className="kpi-stat-value text-[32px] font-bold text-[var(--accent)] font-sans">
                              {overviewGa4.users.toLocaleString("vi-VN")}
                            </span>
                            <span className="admin-subtle">khách</span>
                          </div>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-[15px] font-bold text-[var(--warn)]">
                            <AlertCircle className="w-4 h-4 shrink-0" />
                            <span>Chưa kết nối</span>
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="w-10 h-10 rounded-full admin-icon-circle flex items-center justify-center shrink-0">
                      <Users className="w-5 h-5 text-[var(--accent)]" />
                    </div>
                  </div>
                  <div className="mt-4 pt-3 flex items-center justify-between text-[13px] border-t border-[var(--border)]">
                    <span className="admin-subtle truncate">
                      {overviewGa4?.connected ? "Google Analytics 4" : "Cần cấu hình GA4"}
                    </span>
                    <button
                      type="button"
                      onClick={() => setActiveTab(overviewGa4?.connected ? "analytics" : "integrations")}
                      className={
                        overviewGa4?.connected
                          ? "min-h-[44px] px-2 flex items-center text-[13px] font-bold text-[var(--accent)] hover:underline cursor-pointer"
                          : "min-h-[44px] px-3.5 rounded-xl border border-[var(--accent)] text-[var(--accent)] text-[13px] font-bold hover:bg-[var(--accent)]/10 transition-colors flex items-center cursor-pointer"
                      }
                    >
                      {overviewGa4?.connected ? "Xem chi tiết →" : "Kết nối ngay →"}
                    </button>
                  </div>
                </div>

                {/* 2. Nhấp từ Google 7 ngày (GSC) */}
                <div className="admin-card p-5 h-full flex flex-col justify-between">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex flex-col min-w-0">
                      <span className="admin-label truncate block">
                        Nhấp từ Google 7 ngày
                      </span>
                      <div className="mt-1">
                        {overviewGsc?.connected ? (
                          <div className="flex items-baseline gap-2">
                            <span className="kpi-stat-value text-[32px] font-bold text-[var(--accent)] font-sans">
                              {overviewGsc.clicks.toLocaleString("vi-VN")}
                            </span>
                            <span className="admin-subtle">lượt nhấp</span>
                          </div>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-[15px] font-bold text-[var(--warn)]">
                            <AlertCircle className="w-4 h-4 shrink-0" />
                            <span>Chưa kết nối</span>
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="w-10 h-10 rounded-full admin-icon-circle flex items-center justify-center shrink-0">
                      <Search className="w-5 h-5 text-[var(--accent)]" />
                    </div>
                  </div>
                  <div className="mt-4 pt-3 flex items-center justify-between text-[13px] border-t border-[var(--border)]">
                    <span className="admin-subtle truncate">
                      {overviewGsc?.connected ? "Search Console API" : "Cần cấu hình GSC"}
                    </span>
                    <button
                      type="button"
                      onClick={() => setActiveTab(overviewGsc?.connected ? "searchConsole" : "integrations")}
                      className={
                        overviewGsc?.connected
                          ? "min-h-[44px] px-2 flex items-center text-[13px] font-bold text-[var(--accent)] hover:underline cursor-pointer"
                          : "min-h-[44px] px-3.5 rounded-xl border border-[var(--accent)] text-[var(--accent)] text-[13px] font-bold hover:bg-[var(--accent)]/10 transition-colors flex items-center cursor-pointer"
                      }
                    >
                      {overviewGsc?.connected ? "Xem chi tiết →" : "Kết nối ngay →"}
                    </button>
                  </div>
                </div>

                {/* 3. Bấm gọi hotline */}
                <div className="admin-card p-5 h-full flex flex-col justify-between">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex flex-col min-w-0">
                      <span className="admin-label truncate block">
                        Bấm gọi hotline
                      </span>
                      <div className="mt-1">
                        <div className="flex items-baseline gap-2">
                          <span className="kpi-stat-value text-[32px] font-bold text-[var(--accent)] font-sans">
                            {((overviewGa4?.calls || 0) + (analyticsStats.click_call || 0)).toLocaleString("vi-VN")}
                          </span>
                          <span className="admin-subtle">lượt bấm</span>
                        </div>
                      </div>
                    </div>
                    <div className="w-10 h-10 rounded-full admin-icon-circle flex items-center justify-center shrink-0">
                      <Phone className="w-5 h-5 text-[var(--accent)]" />
                    </div>
                  </div>
                  <div className="mt-4 pt-3 flex items-center justify-between text-[13px] border-t border-[var(--border)]">
                    <span className="admin-subtle">Hotline 038 285 1688</span>
                    <span className="inline-flex items-center gap-1 font-bold text-[var(--accent)] text-[13px]">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                      <span>Tự động đo lường</span>
                    </span>
                  </div>
                </div>

                {/* 4. Bấm chỉ đường */}
                <div className="admin-card p-5 h-full flex flex-col justify-between">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex flex-col min-w-0">
                      <span className="admin-label truncate block">
                        Bấm chỉ đường
                      </span>
                      <div className="mt-1">
                        <div className="flex items-baseline gap-2">
                          <span className="kpi-stat-value text-[32px] font-bold text-[var(--accent)] font-sans">
                            {((overviewGa4?.directions || 0) + (analyticsStats.click_directions || 0)).toLocaleString("vi-VN")}
                          </span>
                          <span className="admin-subtle">lượt bấm</span>
                        </div>
                      </div>
                    </div>
                    <div className="w-10 h-10 rounded-full admin-icon-circle flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5 text-[var(--accent)]" />
                    </div>
                  </div>
                  <div className="mt-4 pt-3 flex items-center justify-between text-[13px] border-t border-[var(--border)]">
                    <span className="admin-subtle">Đường bờ suối</span>
                    <span className="inline-flex items-center gap-1 font-bold text-[var(--accent)] text-[13px]">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                      <span>Google Maps</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* 7-Day Analytics Engagement Panel (Customer Actions & Conversions) */}
              <div className="admin-card p-6 sm:p-7 flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[var(--border)]">
                  <div className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-[var(--accent)] shrink-0" />
                    <h2 className="admin-h2 font-serif text-[22px] font-bold text-[var(--text)]">
                      Tương Tác Khách Hàng (7 Ngày Qua)
                    </h2>
                  </div>
                  <span className="admin-subtle text-[13px]">
                    Số liệu thực tế từ lượt bấm hành động của khách ghé thăm website
                  </span>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Call */}
                  <div className="p-4 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] flex items-center justify-between">
                    <div>
                      <span className="admin-label block">Gọi Hotline</span>
                      <span className="kpi-stat-value text-[24px] font-bold text-[var(--text)] mt-1 block">
                        {analyticsStats.click_call} <span className="admin-subtle text-[13px] font-normal">lượt</span>
                      </span>
                    </div>
                    <div className="w-9 h-9 rounded-full admin-icon-circle flex items-center justify-center shrink-0">
                      <Phone className="w-4 h-4 text-[var(--accent)]" />
                    </div>
                  </div>

                  {/* Zalo */}
                  <div className="p-4 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] flex items-center justify-between">
                    <div>
                      <span className="admin-label block">Nhắn Zalo</span>
                      <span className="kpi-stat-value text-[24px] font-bold text-[var(--text)] mt-1 block">
                        {analyticsStats.click_zalo} <span className="admin-subtle text-[13px] font-normal">lượt</span>
                      </span>
                    </div>
                    <div className="w-9 h-9 rounded-full admin-icon-circle flex items-center justify-center shrink-0">
                      <Radio className="w-4 h-4 text-[var(--accent)]" />
                    </div>
                  </div>

                  {/* Directions */}
                  <div className="p-4 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] flex items-center justify-between">
                    <div>
                      <span className="admin-label block">Chỉ Đường Maps</span>
                      <span className="kpi-stat-value text-[24px] font-bold text-[var(--text)] mt-1 block">
                        {analyticsStats.click_directions} <span className="admin-subtle text-[13px] font-normal">lượt</span>
                      </span>
                    </div>
                    <div className="w-9 h-9 rounded-full admin-icon-circle flex items-center justify-center shrink-0">
                      <MapPin className="w-4 h-4 text-[var(--accent)]" />
                    </div>
                  </div>

                  {/* Menu Views */}
                  <div className="p-4 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] flex items-center justify-between">
                    <div>
                      <span className="admin-label block">Xem Thực Đơn</span>
                      <span className="kpi-stat-value text-[24px] font-bold text-[var(--text)] mt-1 block">
                        {analyticsStats.view_menu} <span className="admin-subtle text-[13px] font-normal">lượt</span>
                      </span>
                    </div>
                    <div className="w-9 h-9 rounded-full admin-icon-circle flex items-center justify-center shrink-0">
                      <Eye className="w-4 h-4 text-[var(--accent)]" />
                    </div>
                  </div>
                </div>

                {/* Quick Status Control with Duration */}
                <div className="pt-3 border-t border-[var(--border)] flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[var(--accent)] shrink-0" />
                    <span className="text-[13px] font-semibold text-[var(--text)]">
                      Thời lượng áp dụng khi đóng/mở đột xuất:
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {(["1h", "2h", "4h", "today", "indefinite"] as const).map((dur) => (
                      <button
                        key={dur}
                        type="button"
                        onClick={() => {
                          setOverrideDuration(dur);
                          if (storeOverride !== "auto") {
                            handleStoreOverrideChange(storeOverride, dur);
                          }
                        }}
                        className={`min-h-[44px] px-3.5 py-1.5 rounded-full text-[13px] font-semibold transition-all cursor-pointer flex items-center justify-center ${
                          overrideDuration === dur
                            ? "bg-[var(--btn-primary)] text-[var(--btn-primary-text)] shadow-sm font-bold"
                            : "bg-[var(--surface-2)] text-[var(--text-muted)] hover:text-[var(--text)] border border-[var(--border)]"
                        }`}
                      >
                        {dur === "1h"
                          ? "Trong 1 giờ"
                          : dur === "2h"
                          ? "Trong 2 giờ"
                          : dur === "4h"
                          ? "Trong 4 giờ"
                          : dur === "today"
                          ? "Hết hôm nay"
                          : "Vô thời hạn"}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* 2-Column Overview Section: Bảng Tin + Quick Dish Status */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Left 7 Cols: Bảng tin mới nhất */}
                <div className="lg:col-span-7 flex flex-col gap-6">
                  <div className="admin-card p-6 sm:p-8 flex flex-col gap-4">
                    <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
                      <div className="flex items-center gap-2">
                        <Radio className="w-5 h-5 text-[var(--accent)] shrink-0" />
                        <h2 className="admin-h2 font-serif text-[22px] font-bold text-[var(--text)]">
                          Bảng Tin &amp; Thông Báo Quán
                        </h2>
                      </div>
                      <button
                        type="button"
                        onClick={() => setNoticeModalOpen(true)}
                        className="text-[13px] font-semibold text-[var(--accent)] hover:underline min-h-[44px] px-2 flex items-center cursor-pointer"
                      >
                        + Thêm tin
                      </button>
                    </div>

                    <div className="flex flex-col divide-y divide-[var(--border)]">
                      {announcements.length === 0 ? (
                        <div className="py-8 text-center admin-subtle text-[13px] flex flex-col items-center justify-center gap-2">
                          <Radio className="w-8 h-8 text-[var(--text-subtle)]" />
                          <p>Chưa có bảng tin hoặc thông báo nào.</p>
                          <button
                            type="button"
                            onClick={() => setNoticeModalOpen(true)}
                            className="text-[var(--accent)] font-semibold underline hover:opacity-80 cursor-pointer min-h-[44px] flex items-center"
                          >
                            Bấm vào đây để tạo tin mới
                          </button>
                        </div>
                      ) : (
                        announcements.map((a) => (
                          <div key={a.id} className="py-4 flex items-start justify-between gap-4 group">
                            <div className="flex flex-col gap-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span
                                  className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                                    a.type === "event" || a.category === "event"
                                      ? "bg-purple-950/40 text-purple-300 border border-purple-800"
                                      : a.type === "special" || a.category === "special"
                                      ? "bg-amber-950/40 text-amber-300 border border-amber-800"
                                      : "bg-[rgba(157,193,131,0.15)] text-[var(--accent)] border border-[var(--border)]"
                                  }`}
                                >
                                  {a.type === "event" || a.category === "event"
                                    ? "Sự kiện"
                                    : a.type === "special" || a.category === "special"
                                    ? "Đặc sản"
                                    : "Thông báo"}
                                </span>
                                <span className="admin-subtle text-[12px]">{a.date || a.createdAt}</span>
                                {(a.isHighlighted || a.isPinned) && (
                                  <span className="text-[11px] text-[var(--danger)] font-bold bg-[rgba(242,139,130,0.15)] px-1.5 py-0.5 rounded border border-[var(--danger)]">
                                    Ghim
                                  </span>
                                )}
                              </div>
                              <h3 className="font-serif text-base font-bold text-[var(--text)]">{a.title}</h3>
                              <p className="admin-subtle text-[13px] leading-relaxed">{a.content}</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleDeleteAnnouncement(a.id)}
                              title="Xóa tin này"
                              aria-label="Xóa tin này"
                              className="p-2.5 text-[var(--text-subtle)] hover:text-[var(--danger)] rounded-lg transition-colors cursor-pointer shrink-0 min-h-[44px] min-w-[44px] flex items-center justify-center"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>

                {/* Right 5 Cols: Trạng Thái Món Nhanh (Top 5 Quick Toggles) */}
                <div className="lg:col-span-5 flex flex-col gap-6">
                  <div className="admin-card p-6 sm:p-8 flex flex-col gap-4">
                    <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
                      <div className="flex items-center gap-2">
                        <UtensilsCrossed className="w-5 h-5 text-[var(--accent)] shrink-0" />
                        <h2 className="admin-h2 font-serif text-[22px] font-bold text-[var(--text)]">
                          Trạng Thái Món Nhanh
                        </h2>
                      </div>
                      <button
                        type="button"
                        onClick={() => setActiveTab("menu")}
                        className="text-[13px] font-semibold text-[var(--accent)] hover:underline min-h-[44px] px-2 flex items-center cursor-pointer"
                      >
                        Xem tất cả ({totalMenuItems} món)
                      </button>
                    </div>

                    <div className="flex flex-col divide-y divide-[var(--border)]">
                      {MENU_ITEMS.slice(0, 6).map((item) => {
                        const inStock = menuOverrides[item.id]?.inStock ?? true;
                        const price = menuOverrides[item.id]?.price ?? item.price;

                        return (
                          <div key={item.id} className="py-3 flex items-center justify-between gap-3">
                            <div className="flex flex-col min-w-0">
                              <span className="text-[14px] font-bold text-[var(--text)] truncate">{item.name}</span>
                              <span className="text-[13px] text-[var(--clay)] font-bold font-numeric">
                                {price.toLocaleString("vi-VN")}đ
                              </span>
                            </div>

                            {/* Stock Toggle Switch (Elegant iOS style with status badge & undo) */}
                            <div className="flex items-center gap-2.5 shrink-0">
                              <span
                                className={`text-[12px] font-bold px-2.5 py-0.5 rounded-full border transition-all ${
                                  inStock
                                    ? "bg-[rgba(127,209,155,0.15)] text-[var(--success)] border-[var(--border)]"
                                    : "bg-[rgba(240,195,107,0.15)] text-[var(--warn)] border-[var(--border)]"
                                }`}
                              >
                                {inStock ? "Còn món" : "Tạm hết"}
                              </span>
                              <button
                                type="button"
                                role="switch"
                                aria-checked={inStock}
                                onClick={() => handleToggleStock(item.id, inStock)}
                                className="min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer group focus:outline-none"
                                aria-label={inStock ? `Đang còn ${item.name}, bấm để báo hết` : `Đang hết ${item.name}, bấm để bật còn`}
                              >
                                <div
                                  className={`w-12 h-6 rounded-full p-0.5 transition-colors duration-200 ease-in-out relative flex items-center shadow-inner ${
                                    inStock
                                      ? "bg-[var(--accent)]"
                                      : "bg-stone-300 dark:bg-stone-700"
                                  }`}
                                >
                                  <div
                                    className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-200 ease-in-out flex items-center justify-center ${
                                      inStock ? "translate-x-6" : "translate-x-0"
                                    }`}
                                  >
                                    <div
                                      className={`w-1.5 h-1.5 rounded-full transition-colors ${
                                        inStock ? "bg-[var(--accent)]" : "bg-stone-400"
                                      }`}
                                    />
                                  </div>
                                </div>
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ========================================================= */}
          {/* TAB: GOOGLE ANALYTICS */}
          {/* ========================================================= */}
          {activeTab === "analytics" && (
            <AnalyticsTab
              onSwitchToIntegrations={() => setActiveTab("integrations")}
              onShowToast={showToast}
            />
          )}

          {/* ========================================================= */}
          {/* TAB: GOOGLE SEARCH CONSOLE */}
          {/* ========================================================= */}
          {activeTab === "searchConsole" && (
            <SearchConsoleTab
              onSwitchToIntegrations={() => setActiveTab("integrations")}
              onShowToast={showToast}
            />
          )}

          {/* ========================================================= */}
          {/* TAB: TÍCH HỢP & KHÓA */}
          {/* ========================================================= */}
          {activeTab === "integrations" && (
            <IntegrationsTab onShowToast={showToast} />
          )}

          {/* ========================================================= */}
          {/* TAB 2: MENU MANAGEMENT (QUẢN LÝ THỰC ĐƠN TOÀN BỘ 50+ MÓN) */}
          {/* ========================================================= */}
          {activeTab === "menu" && (
            <div className="flex flex-col gap-6">
              {/* Header */}
              <div className="admin-card p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="admin-h1 font-serif text-[26px] font-bold text-[var(--text)]">
                    Quản Lý Thực Đơn Cẩm Cù House
                  </h1>
                  <p className="admin-subtle mt-1 text-[13px]">
                    Bật/Tắt trạng thái còn hàng hoặc cập nhật giá bán. Dữ liệu sẽ tự động đồng bộ sang trang khách hàng.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2.5">
                  <input
                    ref={csvInputRef}
                    type="file"
                    accept=".csv"
                    className="hidden"
                    onChange={handleImportMenuCsv}
                  />
                  <button
                    type="button"
                    onClick={handleExportMenuCsv}
                    className="min-h-[44px] inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[var(--surface-2)] hover:bg-[var(--border)] text-[var(--text)] text-[13px] font-semibold border border-[var(--border)] transition-all cursor-pointer shadow-sm"
                    title="Xuất danh sách 67 món ra file CSV"
                  >
                    <Download className="w-3.5 h-3.5 text-[var(--accent)]" />
                    <span>Xuất CSV</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => csvInputRef.current?.click()}
                    className="min-h-[44px] inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[var(--surface-2)] hover:bg-[var(--border)] text-[var(--text)] text-[13px] font-semibold border border-[var(--border)] transition-all cursor-pointer shadow-sm"
                    title="Nhập cập nhật món từ file CSV"
                  >
                    <Upload className="w-3.5 h-3.5 text-[var(--clay)]" />
                    <span>Nhập CSV</span>
                  </button>
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-subtle)]" />
                    <input
                      type="text"
                      placeholder="Tìm kiếm món..."
                      value={menuSearch}
                      onChange={(e) => setMenuSearch(e.target.value)}
                      className="min-h-[44px] pl-9 pr-4 py-2 bg-[var(--surface-2)] text-[var(--text)] rounded-xl text-[13px] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                    />
                  </div>
                </div>
              </div>

              {/* Category Filter Pills */}
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
                {MENU_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`min-h-[44px] px-4 py-2 rounded-xl text-[13px] font-semibold shrink-0 transition-all cursor-pointer ${
                      selectedCategory === cat.id
                        ? "bg-[var(--btn-primary)] text-[var(--btn-primary-text)] font-bold shadow-sm"
                        : "bg-[var(--surface)] text-[var(--text-muted)] border border-[var(--border)] hover:text-[var(--text)]"
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>

              {/* Menu Items Table */}
              <div className="admin-card overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-[13px] text-[var(--text)]">
                    <thead className="bg-[var(--surface-2)] border-b border-[var(--border)] uppercase tracking-wider text-[12px] text-[var(--text-muted)] font-bold">
                      <tr>
                        <th className="py-3.5 px-6">Tên Món</th>
                        <th className="py-3.5 px-4">Nhóm Món</th>
                        <th className="py-3.5 px-4">Giá Hiện Tại</th>
                        <th className="py-3.5 px-4 text-center">Trạng Thái Kho</th>
                        <th className="py-3.5 px-6 text-right">Thao Tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border)]">
                      {filteredMenuItems.map((item) => {
                        const inStock = menuOverrides[item.id]?.inStock ?? true;
                        const currentPrice = menuOverrides[item.id]?.price ?? item.price;
                        const isEditingPrice = editingPriceId === item.id;

                        return (
                          <tr
                            key={item.id}
                            className={`hover:bg-[var(--surface-2)] transition-colors ${
                              !inStock ? "opacity-60" : ""
                            }`}
                          >
                            <td className="py-3.5 px-6 font-semibold text-[var(--text)]">
                              <div className="flex items-center gap-2">
                                <span>{item.name}</span>
                                {item.tag && (
                                  <span className="px-2 py-0.5 rounded-full bg-[rgba(157,193,131,0.15)] text-[var(--accent)] text-[11px] font-bold border border-[var(--border)]">
                                    {item.tag}
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="py-3.5 px-4 admin-subtle">{item.categoryName}</td>
                            <td className="py-3.5 px-4 font-numeric font-bold text-[var(--clay)]">
                              {isEditingPrice ? (
                                <div className="flex items-center gap-1.5">
                                  <input
                                    type="text"
                                    value={editingPriceValue}
                                    onChange={(e) => setEditingPriceValue(e.target.value)}
                                    className="w-24 px-2 py-1.5 bg-[var(--surface-2)] rounded-lg border border-[var(--border)] text-[13px] text-[var(--text)]"
                                    autoFocus
                                  />
                                  <button
                                    type="button"
                                    onClick={() => handleSavePrice(item.id)}
                                    className="w-8 h-8 rounded-lg bg-[var(--btn-primary)] text-white flex items-center justify-center cursor-pointer"
                                    title="Lưu"
                                  >
                                    <Check className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setEditingPriceId(null)}
                                    className="w-8 h-8 rounded-lg bg-[var(--surface-2)] text-[var(--text-muted)] border border-[var(--border)] flex items-center justify-center cursor-pointer"
                                    title="Hủy"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              ) : (
                                <div className="flex items-center gap-2">
                                  <span>{currentPrice.toLocaleString("vi-VN")}đ</span>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setEditingPriceId(item.id);
                                      setEditingPriceValue(currentPrice.toString());
                                    }}
                                    className="w-7 h-7 flex items-center justify-center text-[var(--text-subtle)] hover:text-[var(--accent)] cursor-pointer"
                                    title="Đổi giá"
                                  >
                                    <Edit2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              )}
                            </td>
                            <td className="py-3.5 px-4 text-center">
                              <span
                                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-bold border border-[var(--border)] ${
                                  inStock
                                    ? "bg-[rgba(127,209,155,0.15)] text-[var(--success)]"
                                    : "bg-[rgba(240,195,107,0.15)] text-[var(--warn)]"
                                }`}
                              >
                                {inStock ? (
                                  <>
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                    <span>Còn hàng</span>
                                  </>
                                ) : (
                                  <>
                                    <AlertCircle className="w-3.5 h-3.5" />
                                    <span>Tạm hết</span>
                                  </>
                                )}
                              </span>
                            </td>
                            <td className="py-3.5 px-6 text-right">
                              <button
                                type="button"
                                onClick={() => handleToggleStock(item.id, inStock)}
                                className={`min-h-[44px] px-4 py-2 rounded-xl text-[13px] font-semibold transition-all inline-flex items-center justify-center gap-1.5 cursor-pointer ${
                                  inStock
                                    ? "bg-[var(--surface-2)] hover:bg-[var(--border)] text-[var(--text)] border border-[var(--border)]"
                                    : "bg-[var(--btn-primary)] text-[var(--btn-primary-text)] font-bold shadow-sm"
                                }`}
                              >
                                {inStock ? "Báo Tạm Hết" : "Bật Còn Hàng"}
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 3: GALLERY MANAGEMENT (THƯ VIỆN ẢNH) */}
          {/* ========================================================= */}
          {activeTab === "gallery" && (
            <div className="flex flex-col gap-6">
              <div className="p-6 bg-white/90 dark:bg-[#1E2B22] backdrop-blur-sm rounded-2xl border border-stone-200 dark:border-stone-700/60 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="admin-h1 font-serif text-[26px] font-bold text-[#3E5C46] dark:text-[#9DC183]">
                    Thư Viện Ảnh Cẩm Cù House
                  </h1>
                  <p className="text-xs text-stone-600 mt-1">
                    Quản lý các URL hình ảnh không gian suối đá và đồ uống hiển thị trên toàn hệ thống.
                  </p>
                </div>
              </div>

              {/* Form Add Photos (Multi / Batch Upload) */}
              <form
                onSubmit={handleSaveGalleryPhotos}
                className="p-6 bg-white/90 dark:bg-[#1E2B22] backdrop-blur-sm rounded-2xl border border-stone-200 dark:border-stone-700/60 shadow-sm flex flex-col gap-5"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-stone-200 gap-3">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-[#3E5C46]/10 text-[#3E5C46]">
                      <Camera className="w-4 h-4" />
                    </span>
                    <div>
                      <h3 className="font-serif text-base font-bold text-[#3E5C46]">
                        + Tải Lên &amp; Đăng Ảnh Thư Viện
                      </h3>
                      <p className="text-[11px] text-stone-500">
                        Hỗ trợ nạp hàng loạt nhiều ảnh cùng lúc, tự động tối ưu hóa hiển thị.
                      </p>
                    </div>
                  </div>

                  {/* Mode switcher tabs */}
                  <div className="inline-flex items-center bg-stone-100 p-1 rounded-xl text-xs font-semibold text-stone-600 border border-stone-200">
                    <button
                      type="button"
                      onClick={() => setGalleryUploadMode("file")}
                      className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                        galleryUploadMode === "file"
                          ? "bg-white dark:bg-[#1E2B22] text-[#3E5C46] dark:text-[#88B795] shadow-sm font-bold"
                          : "hover:text-stone-900"
                      }`}
                    >
                      <UploadCloud className="w-3.5 h-3.5" />
                      <span>Tải nhiều ảnh từ máy (Batch)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setGalleryUploadMode("url")}
                      className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                        galleryUploadMode === "url"
                          ? "bg-white dark:bg-[#1E2B22] text-[#3E5C46] dark:text-[#88B795] shadow-sm font-bold"
                          : "hover:text-stone-900"
                      }`}
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Dán link trực tuyến</span>
                    </button>
                  </div>
                </div>

                {/* Direct Batch File Upload Mode */}
                {galleryUploadMode === "file" && (
                  <div className="flex flex-col gap-4">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files.length > 0) {
                          handleFilesSelect(e.target.files);
                        }
                      }}
                    />

                    {/* Batch Processing Loading State */}
                    {isProcessingBatch && (
                      <div className="rounded-2xl border-2 border-dashed border-[#3E5C46]/50 bg-[#3E5C46]/5 p-8 flex flex-col items-center justify-center text-center gap-3">
                        <RefreshCw className="w-8 h-8 text-[#3E5C46] animate-spin" />
                        <span className="text-sm font-bold text-stone-800">
                          {batchProgress || "Đang nén và tối ưu hóa hình ảnh..."}
                        </span>
                        <span className="text-xs text-stone-500">
                          Tự động giảm kích thước canvas tối đa 1280px để lưu trữ nhẹ nhàng.
                        </span>
                      </div>
                    )}

                    {/* Drag & Drop Area when no images selected yet */}
                    {!isProcessingBatch && pendingPhotos.length === 0 && (
                      <div
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                        className={`cursor-pointer rounded-2xl border-2 border-dashed p-8 sm:p-10 text-center transition-all flex flex-col items-center justify-center gap-3 ${
                          isDraggingFile
                            ? "border-[#3E5C46] bg-[#3E5C46]/10 scale-[0.99]"
                            : "border-stone-300 bg-stone-50/60 hover:bg-stone-100/80 hover:border-[#3E5C46]"
                        }`}
                      >
                        <div className="w-14 h-14 rounded-2xl bg-white dark:bg-[#1E2B22] shadow-sm border border-stone-200 dark:border-stone-700/60 flex items-center justify-center text-[#3E5C46] dark:text-[#88B795]">
                          <UploadCloud className="w-7 h-7" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-stone-800">
                            Kéo thả nhiều ảnh vào đây hoặc bấm để chọn từ máy / điện thoại
                          </p>
                          <p className="text-xs text-stone-500 mt-1">
                            Hỗ trợ chọn cùng lúc 5, 10, 20 ảnh (.jpg, .jpeg, .png, .webp).
                          </p>
                        </div>
                        <button
                          type="button"
                          className="px-5 py-2.5 rounded-full bg-white dark:bg-[#1E2B22] text-[#3E5C46] dark:text-[#88B795] text-xs font-bold border border-stone-300 dark:border-stone-700/60 shadow-sm hover:bg-stone-50 dark:hover:bg-white/10 transition-all"
                        >
                          Chọn nhiều ảnh từ thiết bị
                        </button>
                      </div>
                    )}

                    {/* Preview Grid when photos are selected */}
                    {!isProcessingBatch && pendingPhotos.length > 0 && (
                      <div className="flex flex-col gap-3">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                          <div className="flex items-center gap-2">
                            <span className="px-2.5 py-1 rounded-full bg-emerald-600 text-white text-xs font-bold shadow-sm">
                              ✓ Đã chọn {pendingPhotos.length} ảnh
                            </span>
                            <span className="text-xs text-emerald-900 font-medium">
                              Tổng dung lượng nén:{" "}
                              {pendingPhotos.reduce((acc, p) => acc + p.sizeKb, 0).toLocaleString("vi-VN")}{" "}
                              KB
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => fileInputRef.current?.click()}
                              className="px-3 py-1 rounded-lg bg-white dark:bg-[#1E2B22] text-[#3E5C46] dark:text-[#88B795] border border-stone-300 dark:border-stone-700/60 text-xs font-semibold hover:bg-stone-50 dark:hover:bg-white/10 shadow-sm"
                            >
                              + Chọn thêm ảnh
                            </button>
                            <button
                              type="button"
                              onClick={handleClearAllPending}
                              className="px-3 py-1 rounded-lg bg-red-50 text-red-600 border border-red-200 text-xs font-semibold hover:bg-red-100"
                            >
                              Xóa danh sách
                            </button>
                          </div>
                        </div>

                        {/* Thumbnails Grid with Individual X button & Title Editor */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5 max-h-[420px] overflow-y-auto p-1">
                          {pendingPhotos.map((photo) => (
                            <div
                              key={photo.id}
                              className="group relative bg-white dark:bg-[#1E2B22] rounded-xl border border-stone-200 dark:border-stone-700/60 p-2 shadow-sm flex flex-col gap-1.5 hover:shadow-md transition-shadow"
                            >
                              <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-stone-100">
                                <img
                                  src={photo.dataUrl}
                                  alt={photo.title}
                                  className="w-full h-full object-cover"
                                />
                                <button
                                  type="button"
                                  onClick={() => handleRemovePendingPhoto(photo.id)}
                                  className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/70 hover:bg-red-600 text-white flex items-center justify-center transition-colors shadow"
                                  title="Gỡ ảnh này"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                                <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-sm text-[9px] text-white font-mono">
                                  {photo.sizeKb} KB
                                </span>
                              </div>
                              <input
                                type="text"
                                value={photo.title}
                                onChange={(e) => handleUpdatePendingTitle(photo.id, e.target.value)}
                                placeholder="Tên ảnh..."
                                className="w-full px-2 py-1 bg-stone-50 rounded text-[11px] font-medium border border-stone-200 focus:outline-none focus:ring-1 focus:ring-[#3E5C46]"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Online URL Mode */}
                {galleryUploadMode === "url" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-stone-700 block mb-1">
                        URL Hình ảnh (Unsplash / Link trực tuyến)
                      </label>
                      <input
                        type="url"
                        placeholder="https://images.unsplash.com/photo-..."
                        value={newPhoto.url}
                        onChange={(e) => setNewPhoto({ ...newPhoto, url: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-stone-100 dark:bg-[#16231A] dark:text-stone-100 rounded-xl text-xs border border-stone-200 dark:border-stone-700/60 focus:outline-none focus:ring-2 focus:ring-[#3E5C46]"
                        required={galleryUploadMode === "url"}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-stone-700 block mb-1">
                        Tiêu đề hình ảnh
                      </label>
                      <input
                        type="text"
                        placeholder="VD: Cảnh suối ban mai trong veo..."
                        value={newPhoto.title}
                        onChange={(e) => setNewPhoto({ ...newPhoto, title: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-stone-100 dark:bg-[#16231A] dark:text-stone-100 rounded-xl text-xs border border-stone-200 dark:border-stone-700/60 focus:outline-none focus:ring-2 focus:ring-[#3E5C46]"
                        required={galleryUploadMode === "url"}
                      />
                    </div>
                  </div>
                )}

                {/* Category Selection Dropdown (Standardized for /space, /menu, /) */}
                <div className="pt-2 border-t border-stone-200">
                  <div className="max-w-md">
                    <label className="text-xs font-bold text-stone-800 block mb-1.5 flex items-center gap-1.5">
                      <span>Chuyên mục phân loại ảnh</span>
                      <span className="text-[10px] text-stone-400 font-normal">
                        (Hiển thị đúng vào bộ lọc của trang tương ứng)
                      </span>
                    </label>
                    <select
                      value={batchCategory}
                      onChange={(e) => setBatchCategory(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-stone-100 rounded-xl text-xs font-semibold text-stone-800 border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#3E5C46]"
                    >
                      <optgroup label="🌿 Nhóm Không Gian Suối (Trang /space)">
                        <option value="stream">Bờ Suối Tự Nhiên (stream)</option>
                        <option value="wooden-terrace">Hiên Gỗ &amp; Chòi Mộc (wooden-terrace)</option>
                        <option value="checkin">Góc Check-in &amp; Cảnh Quan (checkin)</option>
                        <option value="workspace">Bàn Ghế Làm Việc / Đọc Sách (workspace)</option>
                      </optgroup>
                      <optgroup label="☕ Nhóm Thực Đơn (Trang /menu)">
                        <option value="coffee">Cà Phê &amp; Đồ Uống (coffee)</option>
                        <option value="food">Món Ăn Vặt &amp; Đặc Sản (food)</option>
                      </optgroup>
                      <optgroup label="🏕️ Nhóm Trang Chủ">
                        <option value="hero">Banner Nổi Bật Trang Chủ (hero)</option>
                      </optgroup>
                    </select>
                  </div>
                </div>

                {/* Action Footer */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-3 border-t border-stone-200 gap-3">
                  <span className="text-xs text-stone-500">
                    {galleryUploadMode === "file"
                      ? pendingPhotos.length > 0
                        ? `✓ Đã sẵn sàng lưu ${pendingPhotos.length} ảnh vào thư viện.`
                        : "Chọn hoặc kéo thả ảnh để nạp vào danh sách xem trước."
                      : "Dán link và điền tiêu đề để lưu ảnh trực tuyến."}
                  </span>
                  <button
                    type="submit"
                    disabled={isProcessingBatch || (galleryUploadMode === "file" && pendingPhotos.length === 0)}
                    className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-[#3E5C46] text-white text-xs font-bold hover:bg-[#2D4233] transition-all shadow-md disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    <span>
                      {galleryUploadMode === "file" && pendingPhotos.length > 0
                        ? `Lưu Tất Cả (${pendingPhotos.length}) Ảnh Vào Thư Viện`
                        : "Lưu Ảnh Vào Thư Viện"}
                    </span>
                  </button>
                </div>
              </form>

              {/* Gallery Grid with Category Badges & In-Card Editor */}
              <div className="flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="font-serif text-lg font-bold text-[#3E5C46]">
                      Tất Cả Ảnh Đang Có Trong Thư Viện ({gallery.length})
                    </h3>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Chỉnh sửa trực tiếp tên, chuyên mục và lời tựa cho từng bức ảnh. Thay đổi lưu tức thì.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleResetToDefaultPhotos}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold border border-stone-300 transition-colors shadow-sm self-start sm:self-auto"
                    title="Khôi phục lại 31 ảnh quán với tên và chuyên mục chuẩn"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Đồng bộ 31 ảnh chuẩn</span>
                  </button>
                </div>

                {gallery.length === 0 ? (
                  <div className="p-12 text-center bg-white dark:bg-[#1E2B22] rounded-2xl border border-stone-200 dark:border-stone-700/60 text-stone-400 text-xs">
                    Chưa có hình ảnh nào trong thư viện.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {gallery.map((photo, idx) => (
                      <div
                        key={photo.id}
                        className="group bg-white dark:bg-[#1E2B22] rounded-2xl overflow-hidden border border-stone-200 dark:border-stone-700/60 shadow-sm flex flex-col hover:shadow-md transition-all"
                      >
                        <div
                          onClick={() => handleOpenAdminLightbox(idx)}
                          className="relative aspect-[16/10] overflow-hidden bg-stone-100 dark:bg-stone-800 cursor-pointer"
                        >
                          <img
                            src={photo.url}
                            alt={photo.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeletePhoto(photo.id);
                            }}
                            className="btn-press absolute top-2 right-2 p-1.5 rounded-full bg-black/60 text-white hover:bg-red-600 hover:scale-110 active:scale-95 transition-all duration-200 shadow-sm z-10"
                            title="Xóa ảnh này khỏi thư viện"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <span className="absolute bottom-2 left-2 px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-sm text-white text-[10px] font-semibold">
                            {getCategoryLabel(photo.category)}
                          </span>
                        </div>

                        <div className="p-4 flex flex-col gap-3 bg-white dark:bg-[#1E2B22]">
                          <div>
                            <label className="text-[10px] font-bold text-stone-600 dark:text-stone-400 uppercase tracking-wider block mb-1">
                              Tiêu đề ảnh
                            </label>
                            <input
                              type="text"
                              value={photo.title}
                              onChange={(e) => handleUpdatePhoto(photo.id, { title: e.target.value })}
                              className="w-full px-3 py-1.5 bg-stone-50 dark:bg-[#16231A] text-[#1B281D] dark:text-[#F5F4EE] rounded-lg text-xs font-semibold border border-stone-200 dark:border-stone-700/60 focus:outline-none focus:ring-1 focus:ring-[#3E5C46]"
                              placeholder="Tiêu đề ảnh..."
                            />
                          </div>

                          <div>
                            <label className="text-[10px] font-bold text-stone-600 dark:text-stone-400 uppercase tracking-wider block mb-1">
                              Chuyên mục phân loại
                            </label>
                            <select
                              value={photo.category}
                              onChange={(e) => handleUpdatePhoto(photo.id, { category: e.target.value })}
                              className="w-full px-3 py-1.5 bg-stone-50 dark:bg-[#16231A] text-stone-800 dark:text-stone-200 rounded-lg text-xs font-medium border border-stone-200 dark:border-stone-700/60 focus:outline-none focus:ring-1 focus:ring-[#3E5C46]"
                            >
                              <optgroup label="🌿 Nhóm Không Gian Suối (Trang /space)">
                                <option value="stream">Bờ Suối Tự Nhiên (stream)</option>
                                <option value="wooden-terrace">Hiên Gỗ &amp; Chòi Mộc (wooden-terrace)</option>
                                <option value="checkin">Góc Check-in &amp; Cảnh Quan (checkin)</option>
                                <option value="workspace">Bàn Ghế Làm Việc / Đọc Sách (workspace)</option>
                              </optgroup>
                              <optgroup label="☕ Nhóm Thực Đơn (Trang /menu)">
                                <option value="coffee">Cà Phê &amp; Đồ Uống (coffee)</option>
                                <option value="food">Món Ăn Vặt &amp; Đặc Sản (food)</option>
                              </optgroup>
                              <optgroup label="🏕️ Nhóm Trang Chủ">
                                <option value="hero">Banner Nổi Bật Trang Chủ (hero)</option>
                              </optgroup>
                            </select>
                          </div>

                          <div>
                            <label className="text-[10px] font-bold text-stone-600 dark:text-stone-400 uppercase tracking-wider block mb-1">
                              Lời tựa / Chú thích (Caption)
                            </label>
                            <textarea
                              rows={2}
                              value={photo.caption || ""}
                              onChange={(e) => handleUpdatePhoto(photo.id, { caption: e.target.value })}
                              className="w-full px-3 py-1.5 bg-stone-50 dark:bg-[#16231A] text-stone-700 dark:text-stone-300 rounded-lg text-[11px] border border-stone-200 dark:border-stone-700/60 focus:outline-none focus:ring-1 focus:ring-[#3E5C46] resize-none"
                              placeholder="Lời tựa nên thơ cho ảnh..."
                            />
                          </div>

                          <div className="pt-2 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-[10px] text-stone-400">
                            <span className="truncate max-w-[180px]" title={photo.url}>
                              {photo.url.startsWith("data:") ? "Ảnh nén Base64" : photo.url}
                            </span>
                            <span className="text-emerald-700 dark:text-emerald-400 font-medium">✓ Đã lưu</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 4: STORE SETTINGS (CÀI ĐẶT CỬA HÀNG & MÃ PIN) */}
          {/* ========================================================= */}
          {activeTab === "settings" && (
            <div className="flex flex-col gap-8">
              {/* Tiêu đề trang 32px & Nhãn mono 12px (Mục D13) */}
              <div className="flex flex-col gap-1 border-b border-stone-200 dark:border-stone-700/60 pb-4">
                <span className="font-mono text-[12px] uppercase tracking-[0.06em] text-[var(--accent)] font-semibold">
                  [HỆ THỐNG CÀI ĐẶT & VẬN HÀNH QUÁN]
                </span>
                <h1 className="admin-h1 font-serif text-[26px] font-bold text-[#1B281D] dark:text-[#F4EEE2] leading-tight">
                  Cài Đặt Cửa Hàng & Lịch Hoạt Động
                </h1>
                <p className="text-xs text-stone-500">
                  Quản lý giờ mở cửa 7 ngày, lịch nghỉ lễ, thông tin thương hiệu và mật khẩu quản trị.
                </p>
              </div>

              {/* Store Operational Info Form */}
              <form
                onSubmit={handleSaveSettings}
                className="p-6 sm:p-8 bg-white/90 dark:bg-[#1E2B22] backdrop-blur-sm rounded-2xl border border-stone-200 dark:border-stone-700/60 shadow-sm flex flex-col gap-6"
              >
                <div className="pb-3 border-b border-stone-200 flex items-center justify-between">
                  <div>
                    <h2 className="admin-h2 font-serif text-[20px] font-bold text-[#3E5C46] dark:text-[#9DC183]">
                      Giờ Mở Cửa & Trạng Thái Hoạt Động
                    </h2>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Cập nhật giờ mở cửa 7 ngày, lịch nghỉ lễ và công tắc trạng thái tức thì.
                    </p>
                  </div>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#3E5C46] text-white text-xs font-bold hover:bg-[#2D4233] transition-all shadow-md cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>Lưu Cài Đặt</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Công tắc trạng thái quán 1 chạm (Mục D10 & D13) */}
                  <div className="md:col-span-2 p-5 bg-stone-50 dark:bg-[#16231A] rounded-2xl border border-stone-200 dark:border-stone-700/60 flex flex-col gap-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <span className="font-mono text-[12px] uppercase tracking-[0.06em] font-bold text-[#1B281D] dark:text-[#F4EEE2]">
                          CÔNG TẮC TRẠNG THÁI QUÁN (1 NGUỒN DUY NHẤT)
                        </span>
                        <p className="text-[11px] text-stone-500 mt-0.5">
                          Đồng bộ toàn bộ website khách hàng: thanh đầu trang, thẻ giờ mở cửa và chip Hero.
                        </p>
                      </div>
                      <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-[#3E5C46] dark:text-[#9DC183] self-start sm:self-auto">
                        Hiện tại: {storeStatus.shortBadge}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => handleStoreOverrideChange("auto")}
                        className={`min-h-[44px] p-3 rounded-xl border text-left transition-all flex flex-col gap-1 cursor-pointer ${
                          storeOverride === "auto"
                            ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-400 text-emerald-900 dark:text-emerald-200 font-bold ring-2 ring-emerald-500/20"
                            : "bg-white dark:bg-[#1E2B22] border-stone-200 dark:border-stone-700/60 text-stone-600 dark:text-stone-300 hover:bg-stone-100"
                        }`}
                      >
                        <span className="text-xs font-bold">⏱ Tự động theo lịch</span>
                        <span className="text-[10px] text-stone-500 font-normal">T2–T5: 18h | T6–CN: 22h</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleStoreOverrideChange("force_open")}
                        className={`min-h-[44px] p-3 rounded-xl border text-left transition-all flex flex-col gap-1 cursor-pointer ${
                          storeOverride === "force_open"
                            ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-400 text-emerald-900 dark:text-emerald-200 font-bold ring-2 ring-emerald-500/20"
                            : "bg-white dark:bg-[#1E2B22] border-stone-200 dark:border-stone-700/60 text-stone-600 dark:text-stone-300 hover:bg-stone-100"
                        }`}
                      >
                        <span className="text-xs font-bold">🟢 Mở cửa đón khách</span>
                        <span className="text-[10px] text-stone-500 font-normal">Đón khách ngoài giờ</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleStoreOverrideChange("force_closed")}
                        className={`min-h-[44px] p-3 rounded-xl border text-left transition-all flex flex-col gap-1 cursor-pointer ${
                          storeOverride === "force_closed"
                            ? "bg-rose-50 dark:bg-rose-950/40 border-rose-400 text-rose-900 dark:text-rose-200 font-bold ring-2 ring-rose-500/20"
                            : "bg-white dark:bg-[#1E2B22] border-stone-200 dark:border-stone-700/60 text-stone-600 dark:text-stone-300 hover:bg-stone-100"
                        }`}
                      >
                        <span className="text-xs font-bold">🔴 Nghỉ đột xuất / Đóng cửa</span>
                        <span className="text-[10px] text-stone-500 font-normal">Nghỉ lễ, thời tiết xấu</span>
                      </button>
                    </div>
                  </div>

                  {/* BẢNG 7 NGÀY HOẠT ĐỘNG (Mục D13) */}
                  <div className="md:col-span-2 p-5 bg-stone-50 dark:bg-[#16231A] rounded-2xl border border-stone-200 dark:border-stone-700/60 flex flex-col gap-4">
                    <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-700/60 pb-3">
                      <div>
                        <h3 className="admin-card-title font-serif text-[16px] font-bold text-[#1B281D] dark:text-[#F4EEE2]">
                          Lịch Hoạt Động 7 Ngày Trong Tuần (Mở, Đóng, Nghỉ)
                        </h3>
                        <p className="text-xs text-stone-500 mt-0.5">
                          Tùy chỉnh giờ mở cửa, đóng cửa và ngày nghỉ định kỳ cho từng thứ trong tuần.
                        </p>
                      </div>
                      <span className="font-mono text-[12px] tracking-[0.06em] text-[var(--accent)] font-semibold uppercase">
                        BẢNG 7 NGÀY
                      </span>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-stone-200 dark:border-stone-700/60 text-stone-500 font-mono uppercase tracking-[0.06em] text-[11px]">
                            <th className="py-2.5 px-3">Thứ Trong Tuần</th>
                            <th className="py-2.5 px-3">Giờ Mở Cửa</th>
                            <th className="py-2.5 px-3">Giờ Đóng Cửa</th>
                            <th className="py-2.5 px-3 text-center">Trạng Thái Ngày</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-200/60 dark:divide-stone-700/40">
                          {schedule7Days.map((day, idx) => (
                            <tr key={day.dayId} className="hover:bg-stone-100/50 dark:hover:bg-stone-800/30 transition-colors">
                              <td className="py-3 px-3 font-semibold text-stone-800 dark:text-stone-200">
                                {day.dayName}
                              </td>
                              <td className="py-3 px-3">
                                <input
                                  type="time"
                                  disabled={day.isClosed}
                                  value={day.openTime}
                                  onChange={(e) => updateDaySchedule(idx, "openTime", e.target.value)}
                                  className="px-2.5 py-1.5 bg-white dark:bg-[#1E2B22] rounded-lg border border-stone-200 dark:border-stone-700/60 text-xs disabled:opacity-40"
                                />
                              </td>
                              <td className="py-3 px-3">
                                <input
                                  type="time"
                                  disabled={day.isClosed}
                                  value={day.closeTime}
                                  onChange={(e) => updateDaySchedule(idx, "closeTime", e.target.value)}
                                  className="px-2.5 py-1.5 bg-white dark:bg-[#1E2B22] rounded-lg border border-stone-200 dark:border-stone-700/60 text-xs disabled:opacity-40"
                                />
                              </td>
                              <td className="py-3 px-3 text-center">
                                <button
                                  type="button"
                                  onClick={() => updateDaySchedule(idx, "isClosed", !day.isClosed)}
                                  className={`px-3 py-1.5 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                                    day.isClosed
                                      ? "bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-300"
                                      : "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300"
                                  }`}
                                >
                                  {day.isClosed ? "● Nghỉ ngày này" : "✓ Mở cửa đón khách"}
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* QUẢN LÝ NGÀY NGHỈ LỄ CHỌN BẰNG LỊCH (Mục D13) */}
                  <div className="md:col-span-2 p-5 bg-stone-50 dark:bg-[#16231A] rounded-2xl border border-stone-200 dark:border-stone-700/60 flex flex-col gap-4">
                    <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-700/60 pb-3">
                      <div>
                        <h3 className="admin-card-title font-serif text-[16px] font-bold text-[#1B281D] dark:text-[#F4EEE2]">
                          Lịch Nghỉ Lễ & Ngày Đóng Cửa Đột Xuất (Chọn Bằng Lịch)
                        </h3>
                        <p className="text-xs text-stone-500 mt-0.5">
                          Chọn ngày cụ thể trên lịch để hệ thống tự động thông báo và đóng cửa website vào ngày này.
                        </p>
                      </div>
                      <span className="font-mono text-[12px] tracking-[0.06em] text-[var(--accent)] font-semibold uppercase">
                        LỊCH NGHỈ LỄ
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
                      <div className="sm:col-span-4 flex flex-col gap-1">
                        <label className="text-[11px] font-mono uppercase tracking-[0.06em] text-stone-600 dark:text-stone-400 font-semibold">
                          Chọn ngày nghỉ trên lịch
                        </label>
                        <input
                          type="date"
                          value={newHolidayDate}
                          onChange={(e) => setNewHolidayDate(e.target.value)}
                          className="px-3.5 py-2.5 bg-white dark:bg-[#1E2B22] rounded-xl text-xs border border-stone-200 dark:border-stone-700/60 text-stone-800 dark:text-stone-200 cursor-pointer"
                        />
                      </div>
                      <div className="sm:col-span-6 flex flex-col gap-1">
                        <label className="text-[11px] font-mono uppercase tracking-[0.06em] text-stone-600 dark:text-stone-400 font-semibold">
                          Tên dịp nghỉ lễ / Lý do đóng cửa
                        </label>
                        <input
                          type="text"
                          value={newHolidayName}
                          onChange={(e) => setNewHolidayName(e.target.value)}
                          placeholder="VD: Nghỉ lễ Giỗ Tổ Hùng Vương, Nghỉ bảo trì suối đá..."
                          className="px-3.5 py-2.5 bg-white dark:bg-[#1E2B22] rounded-xl text-xs border border-stone-200 dark:border-stone-700/60 text-stone-800 dark:text-stone-200"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <button
                          type="button"
                          onClick={handleAddHoliday}
                          className="w-full py-2.5 px-4 bg-[#3E5C46] text-white rounded-xl text-xs font-bold hover:bg-[#2D4233] transition-all cursor-pointer shadow-sm"
                        >
                          + Thêm Lịch
                        </button>
                      </div>
                    </div>

                    {holidays.length > 0 ? (
                      <div className="flex flex-wrap gap-2.5 pt-2">
                        {holidays.map((h, i) => (
                          <div
                            key={h.id || i}
                            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700/60 text-amber-900 dark:text-amber-200 text-xs font-semibold"
                          >
                            <span>📅 {h.date}:</span>
                            <span>{h.name}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveHoliday(h.id || i)}
                              className="ml-1 text-rose-600 hover:text-rose-800 dark:text-rose-400 cursor-pointer font-bold"
                              aria-label={`Xóa ngày nghỉ ${h.name}`}
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-stone-400 italic">Chưa có ngày nghỉ lễ nào được lên lịch.</p>
                    )}
                  </div>

                  {/* THÔNG TIN QUÁN (KHÓA ĐỂ TRÁNH SỬA NHẦM) - Mục D11 */}
                  <div className="md:col-span-2 p-5 bg-stone-50 dark:bg-[#16231A] rounded-2xl border border-stone-200 dark:border-stone-700/60 flex flex-col gap-4">
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-200 dark:border-stone-700/60 pb-3">
                      <div>
                        <h3 className="admin-card-title font-serif text-[16px] font-bold text-[#1B281D] dark:text-[#F4EEE2]">
                          Thông tin quán (khóa để tránh sửa nhầm)
                        </h3>
                        <p className="text-xs text-stone-500 mt-0.5">
                          Tên thương hiệu, địa chỉ, tọa độ và hotline được bảo vệ để đảm bảo tính nhất quán toàn hệ thống.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setUnlockStoreInfo(!unlockStoreInfo)}
                        className="px-4 py-2 rounded-xl border border-[var(--accent)] text-[var(--accent)] text-xs font-bold hover:bg-[var(--accent)] hover:text-white transition-all cursor-pointer"
                      >
                        {unlockStoreInfo ? "🔒 Khóa Lại" : "🔓 Mở Khóa Chỉnh Sửa"}
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[11px] font-mono uppercase tracking-[0.06em] text-stone-600 dark:text-stone-400 font-semibold block mb-1">
                          Tên Thương Hiệu
                        </label>
                        <input
                          type="text"
                          disabled={!unlockStoreInfo}
                          defaultValue="Cẩm Cù House"
                          className="w-full px-3.5 py-2.5 bg-white dark:bg-[#1E2B22] rounded-xl text-xs border border-stone-200 dark:border-stone-700/60 disabled:opacity-60 disabled:cursor-not-allowed"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-mono uppercase tracking-[0.06em] text-stone-600 dark:text-stone-400 font-semibold block mb-1">
                          Khẩu Hiệu Quán
                        </label>
                        <input
                          type="text"
                          disabled={!unlockStoreInfo}
                          defaultValue="Chốn Dừng Chân Mộc Mạc Bên Bờ Suối Đá"
                          className="w-full px-3.5 py-2.5 bg-white dark:bg-[#1E2B22] rounded-xl text-xs border border-stone-200 dark:border-stone-700/60 disabled:opacity-60 disabled:cursor-not-allowed"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="text-[11px] font-mono uppercase tracking-[0.06em] text-stone-600 dark:text-stone-400 font-semibold block mb-1">
                          Địa Chỉ Đầy Đủ
                        </label>
                        <input
                          type="text"
                          disabled={!unlockStoreInfo}
                          value={settings.address}
                          onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-white dark:bg-[#1E2B22] rounded-xl text-xs border border-stone-200 dark:border-stone-700/60 disabled:opacity-60 disabled:cursor-not-allowed"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-mono uppercase tracking-[0.06em] text-stone-600 dark:text-stone-400 font-semibold block mb-1">
                          Tọa Độ & Độ Cao
                        </label>
                        <input
                          type="text"
                          disabled={!unlockStoreInfo}
                          defaultValue="11.99° N · 107.69° E · Độ cao 800m+"
                          className="w-full px-3.5 py-2.5 bg-white dark:bg-[#1E2B22] rounded-xl text-xs border border-stone-200 dark:border-stone-700/60 disabled:opacity-60 disabled:cursor-not-allowed"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-mono uppercase tracking-[0.06em] text-stone-600 dark:text-stone-400 font-semibold block mb-1">
                          Hotline / Zalo
                        </label>
                        <input
                          type="text"
                          disabled={!unlockStoreInfo}
                          value={settings.hotline1}
                          onChange={(e) => setSettings({ ...settings, hotline1: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-white dark:bg-[#1E2B22] rounded-xl text-xs border border-stone-200 dark:border-stone-700/60 disabled:opacity-60 disabled:cursor-not-allowed"
                        />
                      </div>
                    </div>
                  </div>

                  {/* THẺ XANH RỪNG: TIÊU ĐỀ VÀ MÔ TẢ CHỮ KEM TƯƠNG PHẢN >= 4.5:1 (Mục D12) */}
                  <div className="md:col-span-2 p-6 rounded-2xl bg-[#1F3A2A] border border-[#3E5C46]/80 text-[#F4EEE2] shadow-lg flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#E8C77A] animate-pulse" />
                      <span className="font-mono text-[12px] uppercase tracking-[0.06em] text-[#E8C77A] font-bold">
                        ĐỒNG BỘ DỮ LIỆU TỰ ĐỘNG
                      </span>
                    </div>
                    <h3 className="admin-card-title font-serif text-[18px] font-bold text-[#F4EEE2] leading-snug">
                      Một Nguồn Dữ Liệu Duy Nhất Toàn Hệ Thống
                    </h3>
                    <p className="text-[15px] text-[rgba(244,238,226,0.88)] leading-relaxed max-w-3xl">
                      Mọi thay đổi về Giờ mở cửa, Lịch nghỉ lễ, Trạng thái quán và Thông báo đầu trang tại đây sẽ tự động đồng bộ tức thì lên Thanh trên cùng, Thẻ kính mờ ở Hero, Bảng 7 ngày trang Liên Hệ, Chân trang website và dữ liệu có cấu trúc Schema.org SEO của Google.
                    </p>
                  </div>
                </div>
              </form>

              {/* Admin Password Change Form */}
              <form
                onSubmit={handleChangePassword}
                className="p-6 sm:p-8 bg-white/90 dark:bg-[#1E2B22] backdrop-blur-sm rounded-2xl border border-stone-200 dark:border-stone-700/60 shadow-sm flex flex-col gap-6"
              >
                <div className="pb-3 border-b border-stone-200 dark:border-stone-700/60">
                  <h2 className="admin-h2 font-serif text-[20px] font-bold text-[#3E5C46] dark:text-[#9DC183]">
                    Đổi Mật Khẩu Quản Trị Viên
                  </h2>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Thay đổi mật khẩu đăng nhập quản trị hệ thống (yêu cầu tối thiểu 12 ký tự an toàn).
                  </p>
                </div>

                {pinChangeMsg && (
                  <div
                    className={`p-3 rounded-xl text-xs font-semibold ${
                      pinChangeMsg.type === "success"
                        ? "bg-emerald-50 text-[#3E5C46] border border-emerald-200"
                        : "bg-red-50 text-red-600 border border-red-200"
                    }`}
                  >
                    {pinChangeMsg.text}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">
                      Mật khẩu hiện tại
                    </label>
                    <input
                      type="password"
                      value={oldPin}
                      onChange={(e) => setOldPin(e.target.value)}
                      placeholder="Nhập mật khẩu hiện tại"
                      className="w-full px-3.5 py-2.5 bg-stone-100 dark:bg-[#16231A] dark:text-stone-100 rounded-xl text-xs border border-stone-200 dark:border-stone-700/60 focus:outline-none focus:ring-2 focus:ring-[#3E5C46]"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">
                      Mật khẩu mới (≥ 12 ký tự)
                    </label>
                    <input
                      type="password"
                      value={newPin}
                      onChange={(e) => setNewPin(e.target.value)}
                      placeholder="Tối thiểu 12 ký tự"
                      className="w-full px-3.5 py-2.5 bg-stone-100 dark:bg-[#16231A] dark:text-stone-100 rounded-xl text-xs border border-stone-200 dark:border-stone-700/60 focus:outline-none focus:ring-2 focus:ring-[#3E5C46]"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">
                      Xác nhận mật khẩu mới
                    </label>
                    <input
                      type="password"
                      value={confirmPin}
                      onChange={(e) => setConfirmPin(e.target.value)}
                      placeholder="Nhập lại mật khẩu mới"
                      className="w-full px-3.5 py-2.5 bg-stone-100 dark:bg-[#16231A] dark:text-stone-100 rounded-xl text-xs border border-stone-200 dark:border-stone-700/60 focus:outline-none focus:ring-2 focus:ring-[#3E5C46]"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="self-end px-6 py-2.5 rounded-full bg-[#2D4233] text-white text-xs font-bold hover:bg-[#1f2e23] transition-all shadow-md cursor-pointer"
                >
                  Xác Nhận Đổi Mật Khẩu
                </button>
              </form>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 5: CONTENT BLOCKS (CHỈNH SỬA NỘI DUNG 5 TRANG CÔNG KHAI) */}
          {/* ========================================================= */}
          {activeTab === "content" && (
            <div className="flex flex-col gap-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-white/90 dark:bg-[#1E2B22] backdrop-blur-sm rounded-2xl border border-stone-200 dark:border-stone-700/60 shadow-sm">
                <div>
                  <h1 className="admin-h1 font-serif text-[26px] font-bold text-[#3E5C46] dark:text-[#9DC183]">
                    Nội Dung 5 Trang Công Khai
                  </h1>
                  <p className="text-xs text-stone-600 dark:text-stone-300 mt-1">
                    Chỉnh sửa văn bản, câu chuyện và cam kết chất lượng của quán (Việt &amp; Anh). Lưu tức thì.
                  </p>
                </div>
              </div>

              {/* Page Section Pills */}
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
                {[
                  { id: "home", label: "Trang Chủ (/)" },
                  { id: "about", label: "Câu Chuyện (/about)" },
                  { id: "space", label: "Không Gian Suối (/space)" },
                  { id: "menu", label: "Thực Đơn (/menu)" },
                  { id: "contact", label: "Chỉ Đường & Liên Hệ (/contact)" },
                  { id: "common", label: "Chung & Chân Trang" },
                  { id: "nav", label: "Thanh Điều Hướng" },
                ].map((pg) => (
                  <button
                    key={pg.id}
                    type="button"
                    onClick={() => {
                      setSelectedContentPage(pg.id as any);
                      setEditingContentKey(null);
                    }}
                    className={`px-4 py-2 rounded-full text-xs font-semibold shrink-0 transition-all cursor-pointer ${
                      selectedContentPage === pg.id
                        ? "bg-[#3E5C46] text-white shadow-sm font-bold"
                        : "bg-white dark:bg-[#1E2B22] text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-700/60 hover:bg-stone-100"
                    }`}
                  >
                    {pg.label}
                  </button>
                ))}
              </div>

              {/* Content Keys List / Editor */}
              <div className="flex flex-col gap-4">
                {Object.keys(contentData.vi[selectedContentPage] || {}).length === 0 ? (
                  <div className="p-8 text-center bg-white dark:bg-[#1E2B22] rounded-2xl border border-stone-200 dark:border-stone-700/60 text-stone-400 text-xs">
                    Chưa có khối văn bản nào cho mục này.
                  </div>
                ) : (
                  Object.keys(contentData.vi[selectedContentPage] || {}).map((key) => {
                    const viVal = contentData.vi[selectedContentPage]?.[key] ?? "";
                    const enVal = contentData.en[selectedContentPage]?.[key] ?? "";
                    const isEditing = editingContentKey === key;

                    const displayVi = typeof viVal === "object" ? JSON.stringify(viVal, null, 2) : String(viVal);
                    const displayEn = typeof enVal === "object" ? JSON.stringify(enVal, null, 2) : String(enVal);

                    return (
                      <div
                        key={key}
                        className="p-5 bg-white/90 dark:bg-[#1E2B22] backdrop-blur-sm rounded-2xl border border-stone-200 dark:border-stone-700/60 shadow-sm flex flex-col gap-3"
                      >
                        <div className="flex items-center justify-between pb-2 border-b border-stone-100 dark:border-stone-800">
                          <span className="font-mono text-xs font-bold text-[#3E5C46] dark:text-[#9DC183] bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-md border border-emerald-200 dark:border-emerald-800">
                            {key}
                          </span>
                          {!isEditing ? (
                            <button
                              type="button"
                              onClick={() => {
                                setEditingContentKey(key);
                                setEditViVal(displayVi);
                                setEditEnVal(displayEn);
                              }}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-700 dark:text-stone-300 text-xs font-semibold transition-all cursor-pointer"
                            >
                              <Edit2 className="w-3 h-3 text-[#3E5C46]" />
                              <span>Sửa</span>
                            </button>
                          ) : (
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => handleSaveContentKey(selectedContentPage, key)}
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#3E5C46] text-white text-xs font-bold hover:bg-[#2D4233] shadow-sm cursor-pointer"
                              >
                                <Save className="w-3 h-3" />
                                <span>Lưu</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => setEditingContentKey(null)}
                                className="px-3 py-1.5 rounded-lg bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-300 text-xs font-semibold cursor-pointer"
                              >
                                Hủy
                              </button>
                            </div>
                          )}
                        </div>

                        {isEditing ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1">
                              <label className="text-[11px] font-bold text-stone-600 dark:text-stone-400">
                                Tiếng Việt (VI)
                              </label>
                              <textarea
                                rows={displayVi.length > 80 ? 4 : 2}
                                value={editViVal}
                                onChange={(e) => setEditViVal(e.target.value)}
                                className="w-full px-3 py-2 bg-stone-50 dark:bg-[#16231A] text-stone-800 dark:text-stone-100 rounded-xl text-xs border border-stone-200 dark:border-stone-700 focus:outline-none focus:ring-2 focus:ring-[#3E5C46] resize-y"
                              />
                            </div>
                            <div className="flex flex-col gap-1">
                              <label className="text-[11px] font-bold text-stone-600 dark:text-stone-400">
                                English (EN)
                              </label>
                              <textarea
                                rows={displayEn.length > 80 ? 4 : 2}
                                value={editEnVal}
                                onChange={(e) => setEditEnVal(e.target.value)}
                                className="w-full px-3 py-2 bg-stone-50 dark:bg-[#16231A] text-stone-800 dark:text-stone-100 rounded-xl text-xs border border-stone-200 dark:border-stone-700 focus:outline-none focus:ring-2 focus:ring-[#3E5C46] resize-y"
                              />
                            </div>
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                            <div className="p-3 bg-stone-50/80 dark:bg-[#16231A]/80 rounded-xl border border-stone-100 dark:border-stone-800">
                              <span className="text-[10px] text-stone-400 uppercase font-bold block mb-1">
                                Tiếng Việt:
                              </span>
                              <p className="text-stone-800 dark:text-stone-200 leading-relaxed font-sans">
                                {displayVi}
                              </p>
                            </div>
                            <div className="p-3 bg-stone-50/80 dark:bg-[#16231A]/80 rounded-xl border border-stone-100 dark:border-stone-800">
                              <span className="text-[10px] text-stone-400 uppercase font-bold block mb-1">
                                English:
                              </span>
                              <p className="text-stone-700 dark:text-stone-300 leading-relaxed font-sans italic">
                                {displayEn || "(Chưa có bản dịch tiếng Anh)"}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 6: SECURITY & 2FA (TÀI KHOẢN & BẢO MẬT) */}
          {/* ========================================================= */}
          {activeTab === "security" && (
            <div className="flex flex-col gap-8">
              {/* Header */}
              <div className="p-6 sm:p-8 bg-white/90 dark:bg-[#1E2B22] backdrop-blur-sm rounded-2xl border border-stone-200 dark:border-stone-700/60 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="admin-h1 font-serif text-[26px] font-bold text-[#3E5C46] dark:text-[#9DC183]">
                    Tài Khoản &amp; Bảo Mật Quán
                  </h1>
                  <p className="text-xs text-stone-600 dark:text-stone-300 mt-1">
                    Bảo mật một tài khoản chủ quán duy nhất. Xác thực 2 lớp TOTP và đổi mã PIN truy cập.
                  </p>
                </div>
              </div>

              {/* 2FA TOTP Card */}
              <div className="p-6 sm:p-8 bg-white/90 dark:bg-[#1E2B22] backdrop-blur-sm rounded-2xl border border-stone-200 dark:border-stone-700/60 shadow-sm flex flex-col gap-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200 dark:border-stone-700/60">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-[#3E5C46] dark:text-[#9DC183] flex items-center justify-center shrink-0">
                      <Shield className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="admin-h2 font-serif text-[20px] font-bold text-[#3E5C46] dark:text-[#9DC183]">
                        Xác Thực 2 Lớp (TOTP 2FA)
                      </h2>
                      <p className="text-xs text-stone-500 mt-0.5">
                        Tương thích Google Authenticator, Microsoft Authenticator, 1Password, Authy.
                      </p>
                    </div>
                  </div>

                  <span
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold inline-flex items-center gap-1.5 self-start sm:self-auto ${
                      totpEnabled
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300"
                        : "bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-400 border border-stone-300"
                    }`}
                  >
                    {totpEnabled ? "🟢 Đang Kích Hoạt" : "⚪ Chưa Bật"}
                  </span>
                </div>

                <div className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed flex flex-col gap-2">
                  <p>
                    Khi kích hoạt 2FA, hệ thống sẽ yêu cầu nhập mã 6 số thay đổi mỗi 30 giây từ ứng dụng Authenticator mỗi lần đăng nhập.
                  </p>
                  <p className="text-stone-500 dark:text-stone-400">
                    Hệ thống sẽ <strong>tạm khóa 15 phút</strong> nếu nhập sai quá 5 lần liên tiếp để bảo vệ trước các tấn công dò mã.
                  </p>
                </div>

                <div className="pt-2 flex flex-wrap items-center gap-3">
                  {!totpEnabled ? (
                    <button
                      type="button"
                      onClick={handleStartTotpSetup}
                      className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#3E5C46] text-white text-xs font-bold hover:bg-[#2D4233] transition-all shadow-md cursor-pointer"
                    >
                      <QrCode className="w-4 h-4" />
                      <span>Kích Hoạt Bảo Mật 2 Lớp (TOTP)</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleDisableTotp}
                      className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 transition-all shadow-md cursor-pointer"
                    >
                      <Lock className="w-4 h-4" />
                      <span>Tắt Xác Thực 2 Lớp</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Admin Password Change Form */}
              <form
                onSubmit={handleChangePassword}
                className="p-6 sm:p-8 bg-white/90 dark:bg-[#1E2B22] backdrop-blur-sm rounded-2xl border border-stone-200 dark:border-stone-700/60 shadow-sm flex flex-col gap-6"
              >
                <div className="pb-3 border-b border-stone-200 dark:border-stone-700/60 flex items-center justify-between">
                  <div>
                    <h2 className="admin-h2 font-serif text-[20px] font-bold text-[#3E5C46] dark:text-[#9DC183]">
                      Đổi Mật Khẩu Quản Trị Viên
                    </h2>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Thay đổi mật khẩu đăng nhập khu vực quản trị hệ thống (yêu cầu tối thiểu 12 ký tự an toàn).
                    </p>
                  </div>
                </div>

                {pinChangeMsg && (
                  <div
                    className={`p-3 rounded-xl text-xs font-semibold ${
                      pinChangeMsg.type === "success"
                        ? "bg-emerald-50 text-[#3E5C46] border border-emerald-200"
                        : "bg-red-50 text-red-600 border border-red-200"
                    }`}
                  >
                    {pinChangeMsg.text}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">
                      Mật khẩu hiện tại
                    </label>
                    <input
                      type="password"
                      value={oldPin}
                      onChange={(e) => setOldPin(e.target.value)}
                      placeholder="Nhập mật khẩu hiện tại"
                      className="w-full px-3.5 py-2.5 bg-stone-100 dark:bg-[#16231A] dark:text-stone-100 rounded-xl text-xs border border-stone-200 dark:border-stone-700/60 focus:outline-none focus:ring-2 focus:ring-[#3E5C46]"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">
                      Mật khẩu mới (≥ 12 ký tự)
                    </label>
                    <input
                      type="password"
                      value={newPin}
                      onChange={(e) => setNewPin(e.target.value)}
                      placeholder="Tối thiểu 12 ký tự"
                      className="w-full px-3.5 py-2.5 bg-stone-100 dark:bg-[#16231A] dark:text-stone-100 rounded-xl text-xs border border-stone-200 dark:border-stone-700/60 focus:outline-none focus:ring-2 focus:ring-[#3E5C46]"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">
                      Xác nhận mật khẩu mới
                    </label>
                    <input
                      type="password"
                      value={confirmPin}
                      onChange={(e) => setConfirmPin(e.target.value)}
                      placeholder="Nhập lại mật khẩu mới"
                      className="w-full px-3.5 py-2.5 bg-stone-100 dark:bg-[#16231A] dark:text-stone-100 rounded-xl text-xs border border-stone-200 dark:border-stone-700/60 focus:outline-none focus:ring-2 focus:ring-[#3E5C46]"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="self-end px-6 py-2.5 rounded-full bg-[#2D4233] text-white text-xs font-bold hover:bg-[#1f2e23] transition-all shadow-md cursor-pointer"
                >
                  Xác Nhận Đổi Mật Khẩu
                </button>
              </form>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 6: SEO, SERP PREVIEW & SOCIAL OPENGRAPH */}
          {/* ========================================================= */}
          {activeTab === "seo" && <SeoTab onShowToast={showToast} />}

          {/* ========================================================= */}
          {/* TAB 7: BACKUP, RESTORE & SYSTEM DIAGNOSTICS */}
          {/* ========================================================= */}
          {activeTab === "backup" && (
            <BackupTab
              onShowToast={showToast}
              onRefreshData={() => window.location.reload()}
            />
          )}
        </main>
      </div>

      {/* ========================================================= */}
      {/* MODAL: THIẾT LẬP VÀ KÍCH HOẠT 2FA TOTP */}
      {/* ========================================================= */}
      {isTotpModalOpen && totpSetupData && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1E2B22] rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-stone-200 dark:border-stone-700/60 flex flex-col gap-5 animate-scale-up text-[#1B281D] dark:text-[#F5F4EE] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-700/60">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-[#3E5C46] dark:text-[#9DC183]" />
                <h3 className="font-serif text-lg sm:text-xl font-bold text-[#3E5C46] dark:text-[#F5F4EE]">
                  Kích Hoạt Bảo Mật 2 Lớp (TOTP)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsTotpModalOpen(false)}
                className="p-1 rounded-full text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {totpModalMsg && (
              <div
                className={`p-3 rounded-xl text-xs font-semibold ${
                  totpModalMsg.type === "success"
                    ? "bg-emerald-50 text-[#3E5C46] border border-emerald-200"
                    : "bg-red-50 text-red-600 border border-red-200"
                }`}
              >
                {totpModalMsg.text}
              </div>
            )}

            {/* Bước 1: Khóa bí mật */}
            <div className="flex flex-col gap-2 p-4 bg-stone-50 dark:bg-[#16231A] rounded-2xl border border-stone-200 dark:border-stone-700/60">
              <span className="text-xs font-bold text-stone-700 dark:text-stone-300">
                1. Sao chép Khóa Bí Mật vào Google Authenticator
              </span>
              <p className="text-[11px] text-stone-500">
                Mở ứng dụng Authenticator → Chọn Thêm tài khoản → Nhập khóa thiết lập (Setup key):
              </p>
              <div className="flex items-center gap-2 mt-1">
                <code className="flex-1 px-3 py-2 bg-white dark:bg-[#1E2B22] rounded-xl font-mono text-xs font-bold text-[#3E5C46] dark:text-[#9DC183] border border-stone-200 dark:border-stone-700 tracking-wider break-all">
                  {totpSetupData.secret}
                </code>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(totpSetupData.secret);
                    showToast("Đã sao chép khóa bí mật 2FA!");
                  }}
                  className="px-3 py-2 rounded-xl bg-stone-200 dark:bg-stone-800 hover:bg-stone-300 text-stone-700 dark:text-stone-200 text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-1 shrink-0"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Chép</span>
                </button>
              </div>
            </div>

            {/* Bước 2: Nhập 6 số xác thực */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-stone-700 dark:text-stone-300">
                2. Nhập mã 6 chữ số từ ứng dụng Authenticator để kích hoạt
              </label>
              <input
                type="text"
                maxLength={6}
                placeholder="000000"
                value={totpVerificationCode}
                onChange={(e) => setTotpVerificationCode(e.target.value)}
                className="w-full py-3 px-4 text-center font-mono text-2xl tracking-widest bg-stone-100 dark:bg-[#16231A] rounded-2xl border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-[#3E5C46]"
              />
            </div>

            {/* Bước 3: Mã khôi phục dự phòng */}
            <div className="flex flex-col gap-2 p-4 bg-amber-50 dark:bg-amber-950/30 rounded-2xl border border-amber-200 dark:border-amber-800/60">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-900 dark:text-amber-200">
                  3. Mã khôi phục dự phòng (Lưu lại đề phòng mất điện thoại)
                </span>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(totpSetupData.recoveryCodes.join("\n"));
                    setRecoveryCodesCopied(true);
                    showToast("Đã sao chép 5 mã khôi phục!");
                  }}
                  className="text-[11px] font-bold text-amber-800 dark:text-amber-300 underline cursor-pointer"
                >
                  {recoveryCodesCopied ? "✓ Đã sao chép" : "Sao chép 5 mã"}
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-1">
                {totpSetupData.recoveryCodes.map((code, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded bg-white dark:bg-[#1E2B22] font-mono text-xs font-semibold text-center border border-amber-200/80 dark:border-amber-800/60 text-stone-700 dark:text-stone-300"
                  >
                    {code}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-200 dark:border-stone-700/60">
              <button
                type="button"
                onClick={() => setIsTotpModalOpen(false)}
                className="px-5 py-2.5 rounded-full text-xs font-semibold text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer"
              >
                Đóng
              </button>
              <button
                type="button"
                onClick={handleVerifyAndEnableTotp}
                className="px-6 py-2.5 rounded-full bg-[#3E5C46] text-white text-xs font-bold hover:bg-[#2D4233] shadow-md cursor-pointer"
              >
                Xác Nhận Kích Hoạt 2FA
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: TẠO THÔNG BÁO / BẢNG TIN MỚI */}
      {/* ========================================================= */}
      {noticeModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1E2B22] rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-stone-200 dark:border-stone-700/60 flex flex-col gap-4 animate-scale-up text-[#1B281D] dark:text-[#F5F4EE]">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <h3 className="font-serif text-xl font-bold text-[#3E5C46]">
                + Tạo Bản Tin Quán Mới
              </h3>
              <button
                type="button"
                onClick={() => setNoticeModalOpen(false)}
                className="p-1 rounded-full text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAnnouncement} className="flex flex-col gap-4">
              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  Tiêu đề bản tin
                </label>
                <input
                  type="text"
                  placeholder="VD: Đêm nhạc Acoustic bên suối..."
                  value={newNotice.title}
                  onChange={(e) => setNewNotice({ ...newNotice, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-stone-100 dark:bg-[#16231A] dark:text-stone-100 rounded-xl text-xs border border-stone-200 dark:border-stone-700/60 focus:outline-none focus:ring-2 focus:ring-[#3E5C46]"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  Nội dung chi tiết
                </label>
                <textarea
                  rows={3}
                  placeholder="Nội dung thông báo tới khách hàng..."
                  value={newNotice.content}
                  onChange={(e) => setNewNotice({ ...newNotice, content: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-stone-100 dark:bg-[#16231A] dark:text-stone-100 rounded-xl text-xs border border-stone-200 dark:border-stone-700/60 focus:outline-none focus:ring-2 focus:ring-[#3E5C46]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">
                    Phân loại tin
                  </label>
                  <select
                    value={newNotice.type}
                    onChange={(e) => setNewNotice({ ...newNotice, type: e.target.value as any })}
                    className="w-full px-3 py-2 bg-stone-100 dark:bg-[#16231A] dark:text-stone-100 rounded-xl text-xs border border-stone-200 dark:border-stone-700/60"
                  >
                    <option value="event">Sự kiện đêm suối</option>
                    <option value="special">Món ngon đặc sản</option>
                    <option value="notice">Thông báo chung</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="highlightCheck"
                    checked={newNotice.isHighlighted}
                    onChange={(e) => setNewNotice({ ...newNotice, isHighlighted: e.target.checked })}
                    className="rounded text-[#3E5C46] focus:ring-[#3E5C46]"
                  />
                  <label htmlFor="highlightCheck" className="text-xs font-semibold text-stone-700">
                    Ghim lên đầu trang
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setNoticeModalOpen(false)}
                  className="px-5 py-2.5 rounded-full text-xs font-semibold text-stone-600 hover:bg-stone-100"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-[#3E5C46] text-white text-xs font-bold hover:bg-[#2D4233] shadow-sm"
                >
                  Đăng Bản Tin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lightbox Modal for Admin Gallery Preview */}
      <LightboxModal
        isOpen={adminLightboxOpen}
        photos={gallery.map((p) => ({
          url: p.url,
          title: p.title,
          caption: p.caption,
          subtitle: getCategoryLabel(p.category),
        }))}
        initialIndex={adminLightboxIndex}
        onClose={() => setAdminLightboxOpen(false)}
      />

      {/* Mobile Bottom Navigation Bar (Always dark, touch targets >= 44px) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#14241C] text-[#F5EEDC] border-t border-[rgba(245,238,220,0.14)] z-50 flex items-center overflow-x-auto no-scrollbar px-2 gap-1 shadow-lg">
        <button
          type="button"
          onClick={() => setActiveTab("overview")}
          className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] shrink-0 rounded-xl text-[10px] font-bold transition-all ${
            activeTab === "overview"
              ? "text-[#9DC183] bg-[#1F3A2A] font-bold"
              : "text-[#C9C2AE] hover:text-[#F5EEDC]"
          }`}
        >
          <LayoutDashboard className="w-4 h-4 mb-0.5 text-[#9DC183]" />
          <span>Tổng quan</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("analytics")}
          className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] shrink-0 rounded-xl text-[10px] font-bold transition-all ${
            activeTab === "analytics"
              ? "text-[#9DC183] bg-[#1F3A2A] font-bold"
              : "text-[#C9C2AE] hover:text-[#F5EEDC]"
          }`}
        >
          <TrendingUp className="w-4 h-4 mb-0.5 text-[#9DC183]" />
          <span>GA4</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("searchConsole")}
          className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] shrink-0 rounded-xl text-[10px] font-bold transition-all ${
            activeTab === "searchConsole"
              ? "text-[#9DC183] bg-[#1F3A2A] font-bold"
              : "text-[#C9C2AE] hover:text-[#F5EEDC]"
          }`}
        >
          <Search className="w-4 h-4 mb-0.5 text-[#9DC183]" />
          <span>GSC</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("integrations")}
          className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] shrink-0 rounded-xl text-[10px] font-bold transition-all ${
            activeTab === "integrations"
              ? "text-[#9DC183] bg-[#1F3A2A] font-bold"
              : "text-[#C9C2AE] hover:text-[#F5EEDC]"
          }`}
        >
          <Key className="w-4 h-4 mb-0.5 text-[#9DC183]" />
          <span>Tích hợp</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("menu")}
          className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] shrink-0 rounded-xl text-[10px] font-bold transition-all ${
            activeTab === "menu"
              ? "text-[#9DC183] bg-[#1F3A2A] font-bold"
              : "text-[#C9C2AE] hover:text-[#F5EEDC]"
          }`}
        >
          <UtensilsCrossed className="w-4 h-4 mb-0.5 text-[#9DC183]" />
          <span>Thực đơn</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("gallery")}
          className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] shrink-0 rounded-xl text-[10px] font-bold transition-all ${
            activeTab === "gallery"
              ? "text-[#9DC183] bg-[#1F3A2A] font-bold"
              : "text-[#C9C2AE] hover:text-[#F5EEDC]"
          }`}
        >
          <ImageIcon className="w-4 h-4 mb-0.5 text-[#9DC183]" />
          <span>Thư viện</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("settings")}
          className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] shrink-0 rounded-xl text-[10px] font-bold transition-all ${
            activeTab === "settings"
              ? "text-[#9DC183] bg-[#1F3A2A] font-bold"
              : "text-[#C9C2AE] hover:text-[#F5EEDC]"
          }`}
        >
          <Settings className="w-4 h-4 mb-0.5 text-[#9DC183]" />
          <span>Cài đặt</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("content")}
          className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] shrink-0 rounded-xl text-[10px] font-bold transition-all ${
            activeTab === "content"
              ? "text-[#9DC183] bg-[#1F3A2A] font-bold"
              : "text-[#C9C2AE] hover:text-[#F5EEDC]"
          }`}
        >
          <FileText className="w-4 h-4 mb-0.5 text-[#9DC183]" />
          <span>Nội dung</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("security")}
          className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] shrink-0 rounded-xl text-[10px] font-bold transition-all ${
            activeTab === "security"
              ? "text-[#9DC183] bg-[#1F3A2A] font-bold"
              : "text-[#C9C2AE] hover:text-[#F5EEDC]"
          }`}
        >
          <Shield className="w-4 h-4 mb-0.5 text-[#9DC183]" />
          <span>Bảo mật</span>
        </button>
      </nav>
    </div>
  );
}
