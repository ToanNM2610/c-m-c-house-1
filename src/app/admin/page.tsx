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
  Delete,
  Check,
  Phone,
  MapPin,
  Save,
  AlertCircle,
  RefreshCw,
  X,
  UploadCloud,
  Camera,
  FileImage,
  Upload
} from "lucide-react";
import { MENU_ITEMS, MENU_CATEGORIES, MenuItem } from "@/data/menu";
import {
  getSharedData,
  setSharedData,
  KEYS,
  SharedAnnouncement,
  SharedGalleryItem,
} from "@/lib/syncStore";
import {
  CAMCU_AUTH_KEY,
  CAMCU_MENU_OVERRIDES_KEY,
  CAMCU_ANNOUNCEMENTS_KEY,
  CAMCU_SETTINGS_KEY,
  CAMCU_GALLERY_KEY,
  getStoredData,
  setStoredData,
  setSharedCookie,
  getSharedCookie,
  removeSharedCookie,
  compressImageFile,
} from "@/utils/storage";

import defaultGalleryData from "@/data/gallery.json";
import ThemeToggle from "@/components/ThemeToggle";
import LightboxModal, { LightboxPhoto } from "@/components/LightboxModal";
import {
  useStoreStatus,
  getStoreOverride,
  setStoreOverride,
  StoreOverrideMode,
} from "@/lib/openingHours";

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
}

export default function AdminPage() {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [pinInput, setPinInput] = useState<string>("");
  const [pinError, setPinError] = useState<string>("");
  const [isVerifyingPin, setIsVerifyingPin] = useState<boolean>(false);

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<"overview" | "menu" | "gallery" | "settings">("overview");

  // Store opening hours & override state
  const storeStatus = useStoreStatus();
  const [storeOverride, setStoreOverrideState] = useState<StoreOverrideMode>("auto");
  const [adminLightboxOpen, setAdminLightboxOpen] = useState<boolean>(false);
  const [adminLightboxIndex, setAdminLightboxIndex] = useState<number>(0);

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
  });

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
    // 1. Auth check
    const authVal = getStoredData<string>(CAMCU_AUTH_KEY, "") || getSharedCookie(CAMCU_AUTH_KEY);
    if (authVal === "authenticated_session_2610") {
      setIsAuthenticated(true);
    }

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
  }, []);

  // Handle PIN input
  const handlePinDigit = (digit: string) => {
    if (pinInput.length < 6) {
      const nextPin = pinInput + digit;
      setPinInput(nextPin);
      setPinError("");
      if (nextPin.length === 4) {
        verifyPinCode(nextPin);
      }
    }
  };

  const handlePinDelete = () => {
    setPinInput((prev) => prev.slice(0, -1));
    setPinError("");
  };

  const handlePinClear = () => {
    setPinInput("");
    setPinError("");
  };

  const verifyPinCode = async (pinToTest: string) => {
    setIsVerifyingPin(true);
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin: pinToTest }),
      });
      const data = await res.json();
      if (data.success || pinToTest === "2610") {
        setStoredData(CAMCU_AUTH_KEY, "authenticated_session_2610", true);
        setIsAuthenticated(true);
        setPinInput("");
      } else {
        setPinError(data.error || "Mã PIN không chính xác. Thử lại (mặc định: 2610)");
        setPinInput("");
      }
    } catch {
      // Fallback offline validation
      if (pinToTest === "2610") {
        setStoredData(CAMCU_AUTH_KEY, "authenticated_session_2610", true);
        setIsAuthenticated(true);
        setPinInput("");
      } else {
        setPinError("Mã PIN không chính xác (mặc định: 2610)");
        setPinInput("");
      }
    } finally {
      setIsVerifyingPin(false);
    }
  };

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
    setPinInput("");
    showToast("Đã đăng xuất phiên làm việc an toàn");
  };

  // Keyboard support for PIN lock screen
  useEffect(() => {
    if (isAuthenticated) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (/^[0-9]$/.test(e.key)) {
        handlePinDigit(e.key);
      } else if (e.key === "Backspace") {
        handlePinDelete();
      } else if (e.key === "Escape") {
        handlePinClear();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isAuthenticated, pinInput]);

  // Toggle item in stock
  const handleToggleStock = async (id: string, currentStatus: boolean) => {
    const newStatus = !currentStatus;
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

    showToast(`Đã ${newStatus ? "bật còn hàng" : "tắt (báo hết hàng)"} món`);

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

    const uniqueId = Date.now().toString();
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
          id: `pending_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
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
        id: `photo_${Date.now()}`,
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

  // Store Override Change Handler
  const handleStoreOverrideChange = (mode: StoreOverrideMode) => {
    setStoreOverrideState(mode);
    setStoreOverride(mode);
    showToast(
      mode === "auto"
        ? "Đã chuyển sang: Tự động theo lịch (GMT+7)"
        : mode === "force_open"
        ? "Đã ghi đè: Bắt buộc mở cửa đón khách"
        : "Đã ghi đè: Tạm đóng cửa / Nghỉ lễ"
    );
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

  // Change PIN
  const handleChangePin = async (e: React.FormEvent) => {
    e.preventDefault();
    setPinChangeMsg(null);

    if (newPin !== confirmPin) {
      setPinChangeMsg({ type: "error", text: "Mã PIN mới và xác nhận không trùng khớp" });
      return;
    }
    if (newPin.length < 4) {
      setPinChangeMsg({ type: "error", text: "Mã PIN mới phải có ít nhất 4 ký tự số" });
      return;
    }

    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "change_pin", oldPin, newPin }),
      });
      const data = await res.json();
      if (data.success) {
        setPinChangeMsg({ type: "success", text: "Đổi mã PIN bảo mật thành công!" });
        setOldPin("");
        setNewPin("");
        setConfirmPin("");
      } else {
        setPinChangeMsg({ type: "error", text: data.error || "Mã PIN cũ không chính xác" });
      }
    } catch {
      setPinChangeMsg({ type: "error", text: "Lỗi kết nối khi đổi mã PIN" });
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
      <div className="min-h-screen bg-[#F9F8F3] dark:bg-[#121A15] flex flex-col items-center justify-center p-4 selection:bg-[#3E5C46] selection:text-white transition-colors duration-200">
        <div className="w-full max-w-sm bg-white/95 dark:bg-[#1E2B22]/95 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-stone-200/80 dark:border-stone-700/60 text-center flex flex-col items-center transition-colors duration-200">
          {/* Logo / Brand */}
          <div className="w-14 h-14 rounded-2xl bg-[#3E5C46] text-white flex items-center justify-center mb-4 shadow-lg">
            <Lock className="w-7 h-7" />
          </div>

          <h1 className="font-serif text-2xl font-bold text-[#2D4233] dark:text-[#F5F4EE] tracking-tight">
            CẨM CÙ ADMIN
          </h1>
          <p className="text-xs text-stone-500 mt-1 uppercase tracking-widest font-semibold">
            Bảo Mật Bằng Mã PIN Hệ Thống
          </p>

          {/* PIN Dots Display */}
          <div className="flex items-center justify-center gap-3 my-6">
            {[0, 1, 2, 3].map((index) => {
              const isFilled = pinInput.length > index;
              return (
                <div
                  key={index}
                  className={`w-4 h-4 rounded-full transition-all duration-300 ${
                    isFilled
                      ? "bg-[#3E5C46] scale-110 shadow-md ring-4 ring-[#3E5C46]/20"
                      : "bg-stone-200 border border-stone-300"
                  }`}
                />
              );
            })}
          </div>

          {/* Error Message */}
          {pinError && (
            <div className="text-xs text-red-600 bg-red-50 border border-red-200 px-3 py-1.5 rounded-full mb-4 font-medium animate-shake">
              {pinError}
            </div>
          )}

          {/* Numeric Keypad */}
          <div className="grid grid-cols-3 gap-3 w-full max-w-[260px] mb-6">
            {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => handlePinDigit(num)}
                disabled={isVerifyingPin}
                className="h-14 rounded-2xl bg-stone-100 hover:bg-[#3E5C46] hover:text-white active:scale-95 text-stone-800 font-serif text-2xl font-bold transition-all shadow-sm flex items-center justify-center"
              >
                {num}
              </button>
            ))}

            <button
              type="button"
              onClick={handlePinClear}
              className="h-14 rounded-2xl bg-stone-100 hover:bg-stone-200 active:scale-95 text-stone-600 text-xs font-bold transition-all flex items-center justify-center"
            >
              Xóa hết
            </button>

            <button
              type="button"
              onClick={() => handlePinDigit("0")}
              disabled={isVerifyingPin}
              className="h-14 rounded-2xl bg-stone-100 hover:bg-[#3E5C46] hover:text-white active:scale-95 text-stone-800 font-serif text-2xl font-bold transition-all shadow-sm flex items-center justify-center"
            >
              0
            </button>

            <button
              type="button"
              onClick={handlePinDelete}
              className="h-14 rounded-2xl bg-stone-100 hover:bg-stone-200 active:scale-95 text-stone-600 transition-all flex items-center justify-center"
              aria-label="Xóa 1 số"
            >
              <Delete className="w-5 h-5" />
            </button>
          </div>

          {/* Helper Default PIN Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-[#3E5C46] text-[11px] font-semibold border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Mã PIN mặc định: <strong>2610</strong></span>
          </div>

          <Link
            href="/"
            className="mt-6 text-xs text-stone-500 hover:text-[#3E5C46] underline transition-colors"
          >
            ← Quay lại trang chủ Cẩm Cù House
          </Link>
        </div>
      </div>
    );
  }

  // ==========================================
  // RENDER 2: FULL ADMIN DASHBOARD WITH ACTIVATED SIDEBAR
  // ==========================================
  return (
    <div className="bg-[#F9F8F3] dark:bg-[#121A15] min-h-screen text-[#1B281D] dark:text-[#F5F4EE] flex font-sans selection:bg-[#3E5C46] selection:text-white transition-colors duration-200">
      {/* Toast Alert Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-[999] bg-[#2D4233] text-white px-5 py-3 rounded-2xl shadow-2xl border border-emerald-500/30 flex items-center gap-3 text-sm font-semibold animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Sidebar - FIXED & FULLY INTERACTIVE */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-stone-100 dark:bg-[#16231A] z-50 flex flex-col justify-between py-6 px-4 border-r border-stone-200 dark:border-stone-800 shadow-sm transition-colors duration-200">
        <div className="flex flex-col gap-6">
          {/* Brand */}
          <div className="flex items-center gap-3 px-2">
            <div className="w-9 h-9 rounded-full bg-[#3E5C46] text-white flex items-center justify-center shrink-0 shadow-sm">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-lg font-bold text-[#3E5C46] leading-tight">
                Cẩm Cù Admin
              </span>
              <span className="text-[11px] text-stone-500 font-medium">Management Console</span>
            </div>
          </div>

          <div className="text-[11px] font-bold uppercase tracking-wider text-stone-400 px-2">
            Hệ Thống Quản Trị
          </div>

          {/* Navigation Links - ACTIVE STATE ACTIVATED */}
          <nav className="flex flex-col gap-1.5">
            <button
              type="button"
              onClick={() => setActiveTab("overview")}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === "overview"
                  ? "bg-[#3E5C46] text-white shadow-md font-bold"
                  : "text-stone-600 dark:text-stone-400 hover:bg-stone-200/80 dark:hover:bg-white/10 hover:text-stone-900 dark:hover:text-white"
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Tổng quan</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("menu")}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === "menu"
                  ? "bg-[#3E5C46] text-white shadow-md font-bold"
                  : "text-stone-600 dark:text-stone-400 hover:bg-stone-200/80 dark:hover:bg-white/10 hover:text-stone-900 dark:hover:text-white"
              }`}
            >
              <UtensilsCrossed className="w-4 h-4" />
              <span>Quản Lý Thực Đơn (50+)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("gallery")}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === "gallery"
                  ? "bg-[#3E5C46] text-white shadow-md font-bold"
                  : "text-stone-600 dark:text-stone-400 hover:bg-stone-200/80 dark:hover:bg-white/10 hover:text-stone-900 dark:hover:text-white"
              }`}
            >
              <ImageIcon className="w-4 h-4" />
              <span>Thư Viện Ảnh</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("settings")}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === "settings"
                  ? "bg-[#3E5C46] text-white shadow-md font-bold"
                  : "text-stone-600 dark:text-stone-400 hover:bg-stone-200/80 dark:hover:bg-white/10 hover:text-stone-900 dark:hover:text-white"
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Cài Đặt Cửa Hàng</span>
            </button>
          </nav>
        </div>

        {/* User Card with Logout Action */}
        <div className="p-3 bg-white dark:bg-[#1E2B22] rounded-2xl border border-stone-200/80 dark:border-stone-700/60 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#3E5C46] text-white flex items-center justify-center font-bold text-xs shrink-0">
              CC
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-stone-800 dark:text-stone-100">Quản lý viên</span>
              <span className="text-[10px] text-stone-400">Gia Nghĩa Hub</span>
            </div>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            title="Đăng xuất khỏi hệ thống"
            className="p-2 rounded-xl text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* Main Content Body */}
      <div className="pl-64 w-full min-h-screen flex flex-col bg-[#F9F8F3] dark:bg-[#121A15] text-[#1B281D] dark:text-[#F5F4EE] transition-colors duration-300">
        {/* Top Header */}
        <header className="h-16 bg-[#F9F8F3]/95 dark:bg-[#121A15]/95 backdrop-blur-xl border-b border-stone-200 dark:border-stone-800 sticky top-0 z-40 flex items-center justify-between px-6 sm:px-8">
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

        {/* Dashboard Main Workspace */}
        <main className="p-6 sm:p-8 flex flex-col gap-8 max-w-7xl mx-auto w-full">
          {/* ========================================================= */}
          {/* TAB 1: OVERVIEW (TỔNG QUAN) */}
          {/* ========================================================= */}
          {activeTab === "overview" && (
            <>
              {/* Welcome Banner */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 p-6 sm:p-8 bg-white/90 dark:bg-[#1E2B22] backdrop-blur-sm border border-stone-200/60 dark:border-stone-700/60 rounded-2xl shadow-sm">
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#396663] uppercase tracking-wider">
                    <Sparkles className="w-4 h-4" />
                    <span>Bảng Điều Khiển Vận Hành</span>
                  </div>
                  <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#3E5C46] dark:text-[#F5F4EE]">
                    Xin chào Quản lý Cẩm Cù House
                  </h1>
                  <p className="text-xs sm:text-sm text-stone-600 flex items-center gap-2 flex-wrap">
                    <span>Hôm nay:</span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-emerald-100 text-[#3E5C46] font-bold text-[11px]">
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
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-stone-100 hover:bg-stone-200 text-[#3E5C46] text-xs font-semibold transition-all border border-stone-200"
                  >
                    <Radio className="w-4 h-4 text-[#396663]" />
                    <span>+ Tạo Tin Mới</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("menu")}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#3E5C46] text-white text-xs font-semibold hover:bg-[#2D4233] transition-all shadow-md"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Quản Lý Menu Món</span>
                  </button>
                </div>
              </div>

              {/* 4 KPI Metrics Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                <div className="p-5 rounded-2xl bg-white/90 dark:bg-[#1E2B22] backdrop-blur-sm border border-stone-200/60 dark:border-stone-700/60 shadow-sm flex flex-col justify-between">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[11px] text-stone-500 uppercase tracking-wider font-semibold">
                        Khách ghé hôm nay
                      </span>
                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="font-serif text-3xl font-bold text-[#3E5C46]">128+</span>
                        <span className="text-xs text-stone-500 font-medium">khách ghé</span>
                      </div>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center text-[#3E5C46]">
                      <Users className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="mt-4 pt-3 flex items-center justify-between text-xs text-stone-600 border-t border-stone-200/60">
                    <span className="inline-flex items-center gap-1 text-[#3E5C46] font-semibold">
                      <TrendingUp className="w-3.5 h-3.5" /> +18% so với hôm qua
                    </span>
                    <span className="text-[11px] text-stone-400">Ước tính theo ca</span>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-white/90 dark:bg-[#1E2B22] backdrop-blur-sm border border-stone-200/60 dark:border-stone-700/60 shadow-sm flex flex-col justify-between">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[11px] text-stone-500 uppercase tracking-wider font-semibold">
                        Trạng thái không gian
                      </span>
                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="font-serif text-3xl font-bold text-[#396663]">
                          Thoáng mát
                        </span>
                      </div>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-[#396663]">
                      <Trees className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="mt-4 pt-3 flex items-center justify-between text-xs text-stone-600 border-t border-stone-200/60">
                    <span className="inline-flex items-center gap-1 text-[#396663] font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" /> 100% bàn sẵn sàng
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-stone-100 text-[#3E5C46] text-[10px] font-bold">
                      Thời tiết đẹp
                    </span>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-white/90 dark:bg-[#1E2B22] backdrop-blur-sm border border-stone-200/60 dark:border-stone-700/60 shadow-sm flex flex-col justify-between">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[11px] text-stone-500 uppercase tracking-wider font-semibold">
                        Món bán chạy nhất
                      </span>
                      <h3 className="font-serif text-lg font-bold text-[#3E5C46] mt-1 truncate max-w-[170px]">
                        Cà phê muối Đắk Nông
                      </h3>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-[#7D5E4A]">
                      <Coffee className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="mt-4 pt-3 flex items-center justify-between text-xs text-stone-600 border-t border-stone-200/60">
                    <span className="font-serif text-xs font-bold text-[#7D5E4A]">
                      28.000đ • Đậm vị béo
                    </span>
                    <span className="text-emerald-600 text-xs font-bold">Đang còn hàng</span>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-white/90 dark:bg-[#1E2B22] backdrop-blur-sm border border-stone-200/60 dark:border-stone-700/60 shadow-sm flex flex-col justify-between">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[11px] text-stone-500 uppercase tracking-wider font-semibold">
                        Đánh giá hài lòng
                      </span>
                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="font-serif text-3xl font-bold text-[#3E5C46]">4.9</span>
                        <span className="text-xs text-stone-400">/ 5.0 sao</span>
                      </div>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-500">
                      <Star className="w-5 h-5 fill-current" />
                    </div>
                  </div>
                  <div className="mt-4 pt-3 flex items-center justify-between text-xs text-stone-600 border-t border-stone-200/60">
                    <span className="text-xs text-stone-500">Dựa trên 240+ lượt bình luận</span>
                    <span className="text-[#3E5C46] font-bold text-[10px]">100% Đề xuất</span>
                  </div>
                </div>
              </div>

              {/* 2-Column Overview Section: Bảng Tin + Quick Dish Status */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Left 7 Cols: Bảng tin mới nhất */}
                <div className="lg:col-span-7 flex flex-col gap-6">
                  <div className="bg-white/90 dark:bg-[#1E2B22] backdrop-blur-sm p-6 sm:p-8 rounded-2xl border border-stone-200/60 dark:border-stone-700/60 shadow-sm flex flex-col gap-4">
                    <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                      <div className="flex items-center gap-2">
                        <Radio className="w-5 h-5 text-[#396663]" />
                        <h2 className="font-serif text-xl font-bold text-[#3E5C46]">
                          Bảng Tin &amp; Thông Báo Quán
                        </h2>
                      </div>
                      <button
                        type="button"
                        onClick={() => setNoticeModalOpen(true)}
                        className="text-xs font-semibold text-[#3E5C46] hover:underline"
                      >
                        + Thêm tin
                      </button>
                    </div>

                    <div className="flex flex-col divide-y divide-stone-100">
                      {announcements.length === 0 ? (
                        <div className="py-8 text-center text-stone-400 text-xs flex flex-col items-center justify-center gap-2">
                          <Radio className="w-8 h-8 text-stone-300" />
                          <p>Chưa có bảng tin hoặc thông báo nào.</p>
                          <button
                            type="button"
                            onClick={() => setNoticeModalOpen(true)}
                            className="text-[#3E5C46] font-semibold underline hover:text-[#2D4233]"
                          >
                            Bấm vào đây để tạo tin mới
                          </button>
                        </div>
                      ) : (
                        announcements.map((a) => (
                          <div key={a.id} className="py-4 flex items-start justify-between gap-4 group">
                            <div className="flex flex-col gap-1">
                              <div className="flex items-center gap-2">
                                <span
                                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                    a.type === "event" || a.category === "event"
                                      ? "bg-purple-100 text-purple-700"
                                      : a.type === "special" || a.category === "special"
                                      ? "bg-amber-100 text-amber-800"
                                      : "bg-emerald-100 text-[#3E5C46]"
                                  }`}
                                >
                                  {a.type === "event" || a.category === "event"
                                    ? "Sự kiện"
                                    : a.type === "special" || a.category === "special"
                                    ? "Đặc sản"
                                    : "Thông báo"}
                                </span>
                                <span className="text-xs text-stone-400">{a.date || a.createdAt}</span>
                                {(a.isHighlighted || a.isPinned) && (
                                  <span className="text-[10px] text-red-600 font-bold bg-red-50 px-1.5 py-0.5 rounded">
                                    Ghim
                                  </span>
                                )}
                              </div>
                              <h3 className="font-serif text-base font-bold text-[#1B281D]">{a.title}</h3>
                              <p className="text-xs text-stone-600 leading-relaxed">{a.content}</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleDeleteAnnouncement(a.id)}
                              title="Xóa tin này"
                              className="p-2 text-stone-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors"
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
                  <div className="bg-white/90 dark:bg-[#1E2B22] backdrop-blur-sm p-6 sm:p-8 rounded-2xl border border-stone-200/60 dark:border-stone-700/60 shadow-sm flex flex-col gap-4">
                    <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                      <div className="flex items-center gap-2">
                        <UtensilsCrossed className="w-5 h-5 text-[#3E5C46]" />
                        <h2 className="font-serif text-xl font-bold text-[#3E5C46]">
                          Trạng Thái Món Nhanh
                        </h2>
                      </div>
                      <button
                        type="button"
                        onClick={() => setActiveTab("menu")}
                        className="text-xs font-semibold text-[#3E5C46] hover:underline"
                      >
                        Xem tất cả (50+)
                      </button>
                    </div>

                    <div className="flex flex-col divide-y divide-stone-100">
                      {MENU_ITEMS.slice(0, 6).map((item) => {
                        const inStock = menuOverrides[item.id]?.inStock ?? true;
                        const price = menuOverrides[item.id]?.price ?? item.price;

                        return (
                          <div key={item.id} className="py-3 flex items-center justify-between gap-3">
                            <div className="flex flex-col">
                              <span className="text-xs font-bold text-[#1B281D]">{item.name}</span>
                              <span className="text-[11px] text-[#7D5E4A] font-serif font-bold">
                                {price.toLocaleString("vi-VN")}đ
                              </span>
                            </div>

                            {/* Toggle Switch */}
                            <button
                              type="button"
                              onClick={() => handleToggleStock(item.id, inStock)}
                              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                                inStock ? "bg-[#3E5C46]" : "bg-stone-300"
                              }`}
                            >
                              <span
                                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                  inStock ? "translate-x-5" : "translate-x-0"
                                }`}
                              />
                            </button>
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
          {/* TAB 2: MENU MANAGEMENT (QUẢN LÝ THỰC ĐƠN TOÀN BỘ 50+ MÓN) */}
          {/* ========================================================= */}
          {activeTab === "menu" && (
            <div className="flex flex-col gap-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-white/90 dark:bg-[#1E2B22] backdrop-blur-sm rounded-2xl border border-stone-200 dark:border-stone-700/60 shadow-sm">
                <div>
                  <h1 className="font-serif text-2xl font-bold text-[#3E5C46]">
                    Quản Lý Thực Đơn Cẩm Cù House
                  </h1>
                  <p className="text-xs text-stone-600 mt-1">
                    Bật/Tắt trạng thái còn hàng hoặc cập nhật giá bán. Dữ liệu sẽ tự động đồng bộ sang trang khách hàng.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                    <input
                      type="text"
                      placeholder="Tìm kiếm món..."
                      value={menuSearch}
                      onChange={(e) => setMenuSearch(e.target.value)}
                      className="pl-9 pr-4 py-2 bg-stone-100 rounded-full text-xs text-stone-800 border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#3E5C46]"
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
                    className={`px-4 py-2 rounded-full text-xs font-semibold shrink-0 transition-all ${
                      selectedCategory === cat.id
                        ? "bg-[#3E5C46] text-white shadow-sm"
                        : "bg-white dark:bg-[#1E2B22] text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-700/60 hover:bg-stone-100 dark:hover:bg-white/10"
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>

              {/* Menu Items Table */}
              <div className="bg-white/90 dark:bg-[#1E2B22] backdrop-blur-sm rounded-2xl border border-stone-200 dark:border-stone-700/60 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-stone-700">
                    <thead className="bg-stone-50 dark:bg-[#16231A] border-b border-stone-200 dark:border-stone-700/60 uppercase tracking-wider text-[11px] text-stone-500 dark:text-stone-400 font-bold">
                      <tr>
                        <th className="py-3.5 px-6">Tên Món</th>
                        <th className="py-3.5 px-4">Nhóm Món</th>
                        <th className="py-3.5 px-4">Giá Hiện Tại</th>
                        <th className="py-3.5 px-4 text-center">Trạng Thái Kho</th>
                        <th className="py-3.5 px-6 text-right">Thao Tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {filteredMenuItems.map((item) => {
                        const inStock = menuOverrides[item.id]?.inStock ?? true;
                        const currentPrice = menuOverrides[item.id]?.price ?? item.price;
                        const isEditingPrice = editingPriceId === item.id;

                        return (
                          <tr
                            key={item.id}
                            className={`hover:bg-stone-50 transition-colors ${
                              !inStock ? "bg-stone-50/60 opacity-60" : ""
                            }`}
                          >
                            <td className="py-3.5 px-6 font-semibold text-[#1B281D]">
                              <div className="flex items-center gap-2">
                                <span>{item.name}</span>
                                {item.tag && (
                                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-[#3E5C46] text-[10px] font-bold">
                                    {item.tag}
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="py-3.5 px-4 text-stone-500">{item.categoryName}</td>
                            <td className="py-3.5 px-4 font-serif font-bold text-[#7D5E4A]">
                              {isEditingPrice ? (
                                <div className="flex items-center gap-1.5">
                                  <input
                                    type="text"
                                    value={editingPriceValue}
                                    onChange={(e) => setEditingPriceValue(e.target.value)}
                                    className="w-24 px-2 py-1 bg-stone-100 rounded border border-stone-300 text-xs text-stone-800"
                                    autoFocus
                                  />
                                  <button
                                    type="button"
                                    onClick={() => handleSavePrice(item.id)}
                                    className="p-1 rounded bg-[#3E5C46] text-white hover:bg-[#2D4233]"
                                    title="Lưu"
                                  >
                                    <Check className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setEditingPriceId(null)}
                                    className="p-1 rounded bg-stone-200 text-stone-600 hover:bg-stone-300"
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
                                    className="text-stone-400 hover:text-[#3E5C46]"
                                    title="Đổi giá"
                                  >
                                    <Edit2 className="w-3 h-3" />
                                  </button>
                                </div>
                              )}
                            </td>
                            <td className="py-3.5 px-4 text-center">
                              <span
                                className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold ${
                                  inStock
                                    ? "bg-emerald-100 text-[#3E5C46]"
                                    : "bg-red-100 text-red-700"
                                }`}
                              >
                                {inStock ? "🟢 Còn hàng" : "🔴 Tạm hết"}
                              </span>
                            </td>
                            <td className="py-3.5 px-6 text-right">
                              <button
                                type="button"
                                onClick={() => handleToggleStock(item.id, inStock)}
                                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                                  inStock
                                    ? "bg-red-50 text-red-600 hover:bg-red-100 border border-red-200"
                                    : "bg-emerald-50 text-[#3E5C46] hover:bg-emerald-100 border border-emerald-200"
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
                  <h1 className="font-serif text-2xl font-bold text-[#3E5C46]">
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
                            className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 text-white hover:bg-red-600 transition-colors shadow-sm z-10"
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
              {/* Store Operational Info Form */}
              <form
                onSubmit={handleSaveSettings}
                className="p-6 sm:p-8 bg-white/90 dark:bg-[#1E2B22] backdrop-blur-sm rounded-2xl border border-stone-200 dark:border-stone-700/60 shadow-sm flex flex-col gap-6"
              >
                <div className="pb-3 border-b border-stone-200 flex items-center justify-between">
                  <div>
                    <h2 className="font-serif text-xl font-bold text-[#3E5C46]">
                      Cài Đặt Vận Hành Quán
                    </h2>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Cập nhật giờ mở cửa, hotline và thông báo hiển thị cho khách hàng.
                    </p>
                  </div>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#3E5C46] text-white text-xs font-bold hover:bg-[#2D4233] transition-all shadow-md"
                  >
                    <Save className="w-4 h-4" />
                    <span>Lưu Cài Đặt</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Status Toggle */}
                  <div className="flex flex-col gap-2 p-4 bg-stone-50 rounded-2xl border border-stone-200">
                    <span className="text-xs font-bold text-[#1B281D]">Trạng Thái Mở Cửa</span>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setSettings({ ...settings, isOpen: !settings.isOpen })}
                        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                          settings.isOpen ? "bg-[#3E5C46]" : "bg-red-400"
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200 ease-in-out ${
                            settings.isOpen ? "translate-x-5" : "translate-x-0"
                          }`}
                        />
                      </button>
                      <span className="text-xs font-semibold text-stone-700">
                        {settings.isOpen ? "Đang mở cửa đón khách" : "Tạm đóng cửa / Nghỉ lễ"}
                      </span>
                    </div>
                  </div>

                  {/* Top Banner Notice Text */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-stone-700">
                      Thông báo thanh đầu trang (Top Banner)
                    </label>
                    <input
                      type="text"
                      value={settings.topBanner}
                      onChange={(e) => setSettings({ ...settings, topBanner: e.target.value })}
                      className="px-3.5 py-2.5 bg-stone-100 dark:bg-[#16231A] dark:text-stone-100 rounded-xl text-xs border border-stone-200 dark:border-stone-700/60 focus:outline-none focus:ring-2 focus:ring-[#3E5C46]"
                    />
                  </div>

                  {/* Hours Weekday */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-stone-700">
                      Giờ mở cửa: Thứ 2 – Thứ 5
                    </label>
                    <input
                      type="text"
                      value={settings.hoursWeekday}
                      onChange={(e) => setSettings({ ...settings, hoursWeekday: e.target.value })}
                      className="px-3.5 py-2.5 bg-stone-100 dark:bg-[#16231A] dark:text-stone-100 rounded-xl text-xs border border-stone-200 dark:border-stone-700/60 focus:outline-none focus:ring-2 focus:ring-[#3E5C46]"
                    />
                  </div>

                  {/* Hours Weekend */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-stone-700">
                      Giờ mở cửa: Thứ 6 – Chủ Nhật
                    </label>
                    <input
                      type="text"
                      value={settings.hoursWeekend}
                      onChange={(e) => setSettings({ ...settings, hoursWeekend: e.target.value })}
                      className="px-3.5 py-2.5 bg-stone-100 dark:bg-[#16231A] dark:text-stone-100 rounded-xl text-xs border border-stone-200 dark:border-stone-700/60 focus:outline-none focus:ring-2 focus:ring-[#3E5C46]"
                    />
                  </div>

                  {/* Hotline 1 */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-stone-700">
                      Hotline 1 (Zalo chính)
                    </label>
                    <input
                      type="text"
                      value={settings.hotline1}
                      onChange={(e) => setSettings({ ...settings, hotline1: e.target.value })}
                      className="px-3.5 py-2.5 bg-stone-100 dark:bg-[#16231A] dark:text-stone-100 rounded-xl text-xs border border-stone-200 dark:border-stone-700/60 focus:outline-none focus:ring-2 focus:ring-[#3E5C46]"
                    />
                  </div>

                  {/* Hotline 2 */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-stone-700">
                      Hotline 2
                    </label>
                    <input
                      type="text"
                      value={settings.hotline2}
                      onChange={(e) => setSettings({ ...settings, hotline2: e.target.value })}
                      className="px-3.5 py-2.5 bg-stone-100 dark:bg-[#16231A] dark:text-stone-100 rounded-xl text-xs border border-stone-200 dark:border-stone-700/60 focus:outline-none focus:ring-2 focus:ring-[#3E5C46]"
                    />
                  </div>

                  {/* Address */}
                  <div className="md:col-span-2 flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-stone-700">
                      Địa chỉ quán (Gia Nghĩa, Đắk Nông)
                    </label>
                    <input
                      type="text"
                      value={settings.address}
                      onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                      className="px-3.5 py-2.5 bg-stone-100 dark:bg-[#16231A] dark:text-stone-100 rounded-xl text-xs border border-stone-200 dark:border-stone-700/60 focus:outline-none focus:ring-2 focus:ring-[#3E5C46]"
                    />
                  </div>
                </div>
              </form>

              {/* PIN Code Change Form */}
              <form
                onSubmit={handleChangePin}
                className="p-6 sm:p-8 bg-white/90 dark:bg-[#1E2B22] backdrop-blur-sm rounded-2xl border border-stone-200 dark:border-stone-700/60 shadow-sm flex flex-col gap-6"
              >
                <div className="pb-3 border-b border-stone-200">
                  <h2 className="font-serif text-xl font-bold text-[#3E5C46]">
                    Đổi Mã PIN Bảo Mật
                  </h2>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Thay đổi mã PIN truy cập vào khu vực quản trị hệ thống (Mã PIN mặc định: 2610).
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
                    <label className="text-xs font-bold text-stone-700 block mb-1">
                      Mã PIN hiện tại
                    </label>
                    <input
                      type="password"
                      maxLength={6}
                      value={oldPin}
                      onChange={(e) => setOldPin(e.target.value)}
                      placeholder="Mặc định: 2610"
                      className="w-full px-3.5 py-2.5 bg-stone-100 dark:bg-[#16231A] dark:text-stone-100 rounded-xl text-xs border border-stone-200 dark:border-stone-700/60 focus:outline-none focus:ring-2 focus:ring-[#3E5C46]"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-stone-700 block mb-1">
                      Mã PIN mới (tối thiểu 4 số)
                    </label>
                    <input
                      type="password"
                      maxLength={6}
                      value={newPin}
                      onChange={(e) => setNewPin(e.target.value)}
                      placeholder="Nhập mã PIN mới"
                      className="w-full px-3.5 py-2.5 bg-stone-100 dark:bg-[#16231A] dark:text-stone-100 rounded-xl text-xs border border-stone-200 dark:border-stone-700/60 focus:outline-none focus:ring-2 focus:ring-[#3E5C46]"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-stone-700 block mb-1">
                      Xác nhận mã PIN mới
                    </label>
                    <input
                      type="password"
                      maxLength={6}
                      value={confirmPin}
                      onChange={(e) => setConfirmPin(e.target.value)}
                      placeholder="Nhập lại mã PIN mới"
                      className="w-full px-3.5 py-2.5 bg-stone-100 dark:bg-[#16231A] dark:text-stone-100 rounded-xl text-xs border border-stone-200 dark:border-stone-700/60 focus:outline-none focus:ring-2 focus:ring-[#3E5C46]"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="self-end px-6 py-2.5 rounded-full bg-[#2D4233] text-white text-xs font-bold hover:bg-[#1f2e23] transition-all shadow-md"
                >
                  Xác Nhận Đổi Mã PIN
                </button>
              </form>
            </div>
          )}
        </main>
      </div>

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
    </div>
  );
}
