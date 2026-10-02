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

interface AnnouncementItem {
  id: string;
  title: string;
  content: string;
  date: string;
  type: "event" | "notice" | "special";
  isHighlighted?: boolean;
}

interface GalleryItem {
  id: string;
  title: string;
  url: string;
  category: "suoi" | "nuoc" | "mon-an" | "khong-gian";
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

  // Store data state
  const [menuOverrides, setMenuOverrides] = useState<Record<string, { inStock: boolean; price?: number }>>({});
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
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

  // Gallery tab state (Direct File Upload & URL)
  const [galleryUploadMode, setGalleryUploadMode] = useState<"file" | "url">("file");
  const [newPhoto, setNewPhoto] = useState({
    title: "",
    url: "",
    category: "suoi" as "suoi" | "nuoc" | "mon-an" | "khong-gian",
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFileName, setImageFileName] = useState<string | null>(null);
  const [imageFileSize, setImageFileSize] = useState<string | null>(null);
  const [isProcessingImage, setIsProcessingImage] = useState<boolean>(false);
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

    // 2. Hydrate from Storage first (immediate, no flicker, survives F5)
    const storedOverrides = getStoredData<Record<string, { inStock: boolean; price?: number }>>(
      CAMCU_MENU_OVERRIDES_KEY,
      {}
    );
    if (Object.keys(storedOverrides).length > 0) {
      setMenuOverrides(storedOverrides);
    }

    const storedAnnouncements = getStoredData<AnnouncementItem[]>(CAMCU_ANNOUNCEMENTS_KEY, []);
    if (storedAnnouncements.length > 0) {
      setAnnouncements(storedAnnouncements);
    }

    const storedGallery = getStoredData<GalleryItem[]>(CAMCU_GALLERY_KEY, []);
    if (storedGallery.length > 0) {
      setGallery(storedGallery);
    }

    const storedSettings = getStoredData<StoreSettingsData | null>(CAMCU_SETTINGS_KEY, null);
    if (storedSettings) {
      setSettings((prev) => ({ ...prev, ...storedSettings }));
    }

    // 3. Sync from API in background (and merge if server has updates)
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

    fetch("/api/admin/announcements")
      .then((res) => res.json())
      .then((data) => {
        if (data.announcements && data.announcements.length > 0) {
          setAnnouncements((prev) => {
            if (prev.length === 0) {
              setStoredData(CAMCU_ANNOUNCEMENTS_KEY, data.announcements, true);
              return data.announcements;
            }
            return prev;
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
  const handleCreateNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNotice.title || !newNotice.content) {
      alert("Vui lòng nhập đầy đủ tiêu đề và nội dung");
      return;
    }

    const newNoticeItem: AnnouncementItem = {
      id: `notice_${Date.now()}`,
      title: newNotice.title,
      content: newNotice.content,
      date: "Hôm nay",
      type: newNotice.type,
      isHighlighted: newNotice.isHighlighted,
    };

    const updated = [newNoticeItem, ...announcements];
    setAnnouncements(updated);
    setStoredData(CAMCU_ANNOUNCEMENTS_KEY, updated, true);
    setNoticeModalOpen(false);
    setNewNotice({ title: "", content: "", type: "event", isHighlighted: false });
    showToast("Đã tạo bảng tin mới thành công");

    try {
      await fetch("/api/admin/announcements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newNotice),
      });
    } catch (err) {
      console.error(err);
    }
  };

  // Delete Announcement
  const handleDeleteNotice = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa bản tin này?")) return;
    const updated = announcements.filter((a) => a.id !== id);
    setAnnouncements(updated);
    setStoredData(CAMCU_ANNOUNCEMENTS_KEY, updated, true);
    showToast("Đã xóa bản tin");

    try {
      await fetch(`/api/admin/announcements?id=${id}`, { method: "DELETE" });
    } catch (err) {
      console.error(err);
    }
  };

  // File upload & drag-drop handler
  const handleFileSelect = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Vui lòng chọn file hình ảnh (.jpg, .jpeg, .png, .webp)");
      return;
    }

    setIsProcessingImage(true);
    try {
      const originalSizeKb = Math.round(file.size / 1024);
      setImageFileName(file.name);

      // Auto-fill title if empty
      if (!newPhoto.title) {
        const titleWithoutExt = file.name.replace(/\.[^/.]+$/, "");
        setNewPhoto((prev) => ({ ...prev, title: titleWithoutExt }));
      }

      // Compress and convert to Base64 Data URL
      const compressedDataUrl = await compressImageFile(file, 1200, 1200, 0.82);
      setImagePreview(compressedDataUrl);
      setNewPhoto((prev) => ({ ...prev, url: compressedDataUrl }));

      const compressedSizeKb = Math.round((compressedDataUrl.length * 0.75) / 1024);
      setImageFileSize(`${compressedSizeKb} KB (Gốc: ${originalSizeKb} KB)`);
    } catch (err) {
      console.error("Lỗi xử lý ảnh:", err);
      alert("Không thể đọc file ảnh này. Vui lòng thử lại.");
    } finally {
      setIsProcessingImage(false);
    }
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
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  // Add Photo
  const handleAddPhoto = async (e: React.FormEvent) => {
    e.preventDefault();
    const photoUrl = galleryUploadMode === "file" ? (imagePreview || newPhoto.url) : newPhoto.url;
    if (!newPhoto.title || !photoUrl) {
      alert("Vui lòng nhập tiêu đề và chọn ảnh hoặc dán link");
      return;
    }

    const newPhotoItem: GalleryItem = {
      id: `photo_${Date.now()}`,
      title: newPhoto.title,
      url: photoUrl,
      category: newPhoto.category,
    };

    const updatedGallery = [newPhotoItem, ...gallery];
    setGallery(updatedGallery);
    setStoredData(CAMCU_GALLERY_KEY, updatedGallery, false);

    // Reset form
    setNewPhoto({ title: "", url: "", category: "suoi" });
    setImagePreview(null);
    setImageFileName(null);
    setImageFileSize(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    showToast("Đã lưu ảnh mới vào thư viện!");

    // Also sync to server in background
    try {
      await fetch("/api/admin/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPhotoItem),
      });
    } catch (err) {
      console.warn("Background API sync for gallery photo:", err);
    }
  };

  // Delete Photo
  const handleDeletePhoto = async (id: string) => {
    if (!confirm("Bạn có muốn xóa ảnh này khỏi thư viện?")) return;
    const updatedGallery = gallery.filter((g) => g.id !== id);
    setGallery(updatedGallery);
    setStoredData(CAMCU_GALLERY_KEY, updatedGallery, false);
    showToast("Đã xóa ảnh khỏi thư viện");

    try {
      await fetch(`/api/admin/gallery?id=${id}`, { method: "DELETE" });
    } catch (err) {
      console.warn("Background API delete for gallery photo:", err);
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
      <div className="min-h-screen bg-[#F9F8F3] flex flex-col items-center justify-center p-4 selection:bg-[#3E5C46] selection:text-white">
        <div className="w-full max-w-sm bg-white/95 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-stone-200/80 text-center flex flex-col items-center">
          {/* Logo / Brand */}
          <div className="w-14 h-14 rounded-2xl bg-[#3E5C46] text-white flex items-center justify-center mb-4 shadow-lg">
            <Lock className="w-7 h-7" />
          </div>

          <h1 className="font-serif text-2xl font-bold text-[#2D4233] tracking-tight">
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
    <div className="bg-[#F9F8F3] min-h-screen text-[#1B281D] flex font-sans selection:bg-[#3E5C46] selection:text-white">
      {/* Toast Alert Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-[999] bg-[#2D4233] text-white px-5 py-3 rounded-2xl shadow-2xl border border-emerald-500/30 flex items-center gap-3 text-sm font-semibold animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Sidebar - FIXED & FULLY INTERACTIVE */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-stone-100 z-50 flex flex-col justify-between py-6 px-4 border-r border-stone-200 shadow-sm">
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
                  : "text-stone-600 hover:bg-stone-200/80 hover:text-stone-900"
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
                  : "text-stone-600 hover:bg-stone-200/80 hover:text-stone-900"
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
                  : "text-stone-600 hover:bg-stone-200/80 hover:text-stone-900"
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
                  : "text-stone-600 hover:bg-stone-200/80 hover:text-stone-900"
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Cài Đặt Cửa Hàng</span>
            </button>
          </nav>
        </div>

        {/* User Card with Logout Action */}
        <div className="p-3 bg-white rounded-2xl border border-stone-200/80 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#3E5C46] text-white flex items-center justify-center font-bold text-xs shrink-0">
              CC
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-stone-800">Quản lý viên</span>
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
      <div className="pl-64 w-full min-h-screen flex flex-col">
        {/* Top Header */}
        <header className="h-16 bg-[#F9F8F3]/90 backdrop-blur-xl border-b border-stone-200 sticky top-0 z-40 flex items-center justify-between px-6 sm:px-8">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/70 border border-emerald-200 text-[#3E5C46] text-xs font-semibold">
              <span
                className={`w-2 h-2 rounded-full ${
                  settings.isOpen ? "bg-[#396663] animate-pulse" : "bg-red-500"
                }`}
              />
              <span>
                Hệ thống Hoạt Động (Cửa hàng: {settings.isOpen ? "Đang mở cửa" : "Tạm nghỉ"})
              </span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-stone-600">
              <Clock className="w-3.5 h-3.5 text-[#396663]" />
              <span>Đắk Nông (GMT+7) • T2-T5: {settings.hoursWeekday} | T6-CN: {settings.hoursWeekend}</span>
            </div>

            <div className="flex items-center gap-2">
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
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 p-6 sm:p-8 bg-white/90 backdrop-blur-sm border border-stone-200/60 rounded-2xl shadow-sm">
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#396663] uppercase tracking-wider">
                    <Sparkles className="w-4 h-4" />
                    <span>Bảng Điều Khiển Vận Hành</span>
                  </div>
                  <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#3E5C46]">
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
                <div className="p-5 rounded-2xl bg-white/90 backdrop-blur-sm border border-stone-200/60 shadow-sm flex flex-col justify-between">
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

                <div className="p-5 rounded-2xl bg-white/90 backdrop-blur-sm border border-stone-200/60 shadow-sm flex flex-col justify-between">
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

                <div className="p-5 rounded-2xl bg-white/90 backdrop-blur-sm border border-stone-200/60 shadow-sm flex flex-col justify-between">
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

                <div className="p-5 rounded-2xl bg-white/90 backdrop-blur-sm border border-stone-200/60 shadow-sm flex flex-col justify-between">
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
                  <div className="bg-white/90 backdrop-blur-sm p-6 sm:p-8 rounded-2xl border border-stone-200/60 shadow-sm flex flex-col gap-4">
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
                      {announcements.map((a) => (
                        <div key={a.id} className="py-4 flex items-start justify-between gap-4 group">
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                  a.type === "event"
                                    ? "bg-purple-100 text-purple-700"
                                    : a.type === "special"
                                    ? "bg-amber-100 text-amber-800"
                                    : "bg-emerald-100 text-[#3E5C46]"
                                }`}
                              >
                                {a.type === "event" ? "Sự kiện" : a.type === "special" ? "Đặc sản" : "Thông báo"}
                              </span>
                              <span className="text-xs text-stone-400">{a.date}</span>
                              {a.isHighlighted && (
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
                            onClick={() => handleDeleteNotice(a.id)}
                            title="Xóa tin này"
                            className="p-2 text-stone-300 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right 5 Cols: Trạng Thái Món Nhanh (Top 5 Quick Toggles) */}
                <div className="lg:col-span-5 flex flex-col gap-6">
                  <div className="bg-white/90 backdrop-blur-sm p-6 sm:p-8 rounded-2xl border border-stone-200/60 shadow-sm flex flex-col gap-4">
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
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-white/90 backdrop-blur-sm rounded-2xl border border-stone-200 shadow-sm">
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
                        : "bg-white text-stone-600 border border-stone-200 hover:bg-stone-100"
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>

              {/* Menu Items Table */}
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-stone-200 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-stone-700">
                    <thead className="bg-stone-50 border-b border-stone-200 uppercase tracking-wider text-[11px] text-stone-500 font-bold">
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
              <div className="p-6 bg-white/90 backdrop-blur-sm rounded-2xl border border-stone-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="font-serif text-2xl font-bold text-[#3E5C46]">
                    Thư Viện Ảnh Cẩm Cù House
                  </h1>
                  <p className="text-xs text-stone-600 mt-1">
                    Quản lý các URL hình ảnh không gian suối đá và đồ uống hiển thị trên toàn hệ thống.
                  </p>
                </div>
              </div>

              {/* Form Add Photo */}
              <form
                onSubmit={handleAddPhoto}
                className="p-6 bg-white/90 backdrop-blur-sm rounded-2xl border border-stone-200 shadow-sm flex flex-col gap-5"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-stone-200 gap-3">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-[#3E5C46]/10 text-[#3E5C46]">
                      <Camera className="w-4 h-4" />
                    </span>
                    <h3 className="font-serif text-base font-bold text-[#3E5C46]">
                      + Thêm Ảnh Mới Vào Thư Viện
                    </h3>
                  </div>

                  {/* Mode switcher tabs */}
                  <div className="inline-flex items-center bg-stone-100 p-1 rounded-xl text-xs font-semibold text-stone-600 border border-stone-200">
                    <button
                      type="button"
                      onClick={() => setGalleryUploadMode("file")}
                      className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                        galleryUploadMode === "file"
                          ? "bg-white text-[#3E5C46] shadow-sm font-bold"
                          : "hover:text-stone-900"
                      }`}
                    >
                      <UploadCloud className="w-3.5 h-3.5" />
                      <span>Tải ảnh từ máy / điện thoại</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setGalleryUploadMode("url")}
                      className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                        galleryUploadMode === "url"
                          ? "bg-white text-[#3E5C46] shadow-sm font-bold"
                          : "hover:text-stone-900"
                      }`}
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Dán liên kết URL</span>
                    </button>
                  </div>
                </div>

                {/* Direct File Upload Mode */}
                {galleryUploadMode === "file" && (
                  <div className="flex flex-col gap-3">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          handleFileSelect(e.target.files[0]);
                        }
                      }}
                    />

                    {!imagePreview ? (
                      <div
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                        className={`cursor-pointer rounded-2xl border-2 border-dashed p-8 text-center transition-all flex flex-col items-center justify-center gap-3 ${
                          isDraggingFile
                            ? "border-[#3E5C46] bg-[#3E5C46]/5 scale-[0.99]"
                            : "border-stone-300 bg-stone-50/60 hover:bg-stone-100/80 hover:border-[#3E5C46]"
                        }`}
                      >
                        <div className="w-14 h-14 rounded-2xl bg-white shadow-sm border border-stone-200 flex items-center justify-center text-[#3E5C46]">
                          {isProcessingImage ? (
                            <RefreshCw className="w-6 h-6 animate-spin text-[#3E5C46]" />
                          ) : (
                            <UploadCloud className="w-7 h-7" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-stone-800">
                            {isProcessingImage
                              ? "Đang tối ưu & nén hình ảnh..."
                              : "Kéo thả ảnh vào đây hoặc bấm để chọn từ máy / điện thoại"}
                          </p>
                          <p className="text-xs text-stone-500 mt-1">
                            Hỗ trợ JPG, PNG, WEBP. Ảnh tự động tối ưu hóa hiển thị nhanh sắc nét.
                          </p>
                        </div>
                        <button
                          type="button"
                          disabled={isProcessingImage}
                          className="px-4 py-2 rounded-full bg-white text-[#3E5C46] text-xs font-bold border border-stone-300 shadow-sm hover:bg-stone-50"
                        >
                          Chọn ảnh từ thiết bị
                        </button>
                      </div>
                    ) : (
                      /* Live Image Preview Card */
                      <div className="flex flex-col sm:flex-row items-center gap-5 p-4 rounded-2xl bg-stone-50 border border-stone-200">
                        <div className="relative w-40 h-28 rounded-xl overflow-hidden shadow-sm border border-stone-200 shrink-0 bg-stone-100">
                          <img
                            src={imagePreview}
                            alt="Xem trước ảnh"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-[#3E5C46] text-[10px] font-bold">
                              ✓ Đã nạp ảnh thành công
                            </span>
                            {imageFileSize && (
                              <span className="text-[10px] text-stone-500 font-mono">
                                Dung lượng: {imageFileSize}
                              </span>
                            )}
                          </div>
                          <p className="text-xs font-bold text-stone-800 truncate">
                            {imageFileName || "Ảnh từ thiết bị"}
                          </p>
                          <div className="flex items-center gap-2 pt-1">
                            <button
                              type="button"
                              onClick={() => fileInputRef.current?.click()}
                              className="px-3 py-1 rounded-full bg-white text-[#3E5C46] border border-stone-300 text-xs font-semibold hover:bg-stone-100"
                            >
                              Đổi ảnh khác
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setImagePreview(null);
                                setImageFileName(null);
                                setImageFileSize(null);
                                setNewPhoto((prev) => ({ ...prev, url: "" }));
                                if (fileInputRef.current) fileInputRef.current.value = "";
                              }}
                              className="px-3 py-1 rounded-full bg-red-50 text-red-600 border border-red-200 text-xs font-semibold hover:bg-red-100"
                            >
                              Hủy bỏ
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Online URL Mode */}
                {galleryUploadMode === "url" && (
                  <div>
                    <label className="text-xs font-semibold text-stone-600 block mb-1">
                      URL Hình ảnh (Unsplash / Link trực tuyến)
                    </label>
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/photo-..."
                      value={newPhoto.url}
                      onChange={(e) => setNewPhoto({ ...newPhoto, url: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-stone-100 rounded-xl text-xs border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#3E5C46]"
                      required={galleryUploadMode === "url"}
                    />
                  </div>
                )}

                {/* Metadata Fields: Title & Category */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  <div>
                    <label className="text-xs font-semibold text-stone-600 block mb-1">
                      Tiêu đề ảnh
                    </label>
                    <input
                      type="text"
                      placeholder="VD: Góc suối ban mai trong veo..."
                      value={newPhoto.title}
                      onChange={(e) => setNewPhoto({ ...newPhoto, title: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-stone-100 rounded-xl text-xs border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#3E5C46]"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-stone-600 block mb-1">
                      Chuyên mục
                    </label>
                    <select
                      value={newPhoto.category}
                      onChange={(e) => setNewPhoto({ ...newPhoto, category: e.target.value as any })}
                      className="w-full px-3.5 py-2.5 bg-stone-100 rounded-xl text-xs border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#3E5C46]"
                    >
                      <option value="suoi">Bờ Suối Đá</option>
                      <option value="khong-gian">Không Gian Quán</option>
                      <option value="nuoc">Đồ Uống Cà Phê</option>
                      <option value="mon-an">Món Ăn</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs text-stone-500">
                    {galleryUploadMode === "file" && imagePreview
                      ? "✓ Sẵn sàng lưu vào thư viện và bộ nhớ máy"
                      : "Điền tiêu đề và chọn ảnh để lưu"}
                  </span>
                  <button
                    type="submit"
                    disabled={isProcessingImage}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#3E5C46] text-white text-xs font-bold hover:bg-[#2D4233] transition-all shadow-md disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    <span>Lưu Ảnh Vào Thư Viện</span>
                  </button>
                </div>
              </form>

              {/* Gallery Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {gallery.map((photo) => (
                  <div
                    key={photo.id}
                    className="group bg-white rounded-2xl overflow-hidden border border-stone-200 shadow-sm flex flex-col hover:shadow-md transition-shadow"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden bg-stone-100">
                      <img
                        src={photo.url}
                        alt={photo.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <button
                        type="button"
                        onClick={() => handleDeletePhoto(photo.id)}
                        className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 text-white hover:bg-red-600 transition-colors shadow-sm"
                        title="Xóa ảnh này khỏi thư viện"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <span className="absolute bottom-2 left-2 px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-sm text-white text-[10px] font-semibold">
                        {photo.category === "suoi"
                          ? "Bờ Suối"
                          : photo.category === "khong-gian"
                          ? "Không Gian"
                          : photo.category === "nuoc"
                          ? "Đồ Uống"
                          : "Món Ăn"}
                      </span>
                    </div>
                    <div className="p-4 flex flex-col gap-1">
                      <span className="text-xs font-bold text-[#1B281D] truncate">{photo.title}</span>
                      <span className="text-[10px] text-stone-400 truncate">
                        {photo.url.startsWith("data:") ? "Ảnh tải từ thiết bị (Base64)" : photo.url}
                      </span>
                    </div>
                  </div>
                ))}
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
                className="p-6 sm:p-8 bg-white/90 backdrop-blur-sm rounded-2xl border border-stone-200 shadow-sm flex flex-col gap-6"
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
                      className="px-3.5 py-2.5 bg-stone-100 rounded-xl text-xs border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#3E5C46]"
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
                      className="px-3.5 py-2.5 bg-stone-100 rounded-xl text-xs border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#3E5C46]"
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
                      className="px-3.5 py-2.5 bg-stone-100 rounded-xl text-xs border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#3E5C46]"
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
                      className="px-3.5 py-2.5 bg-stone-100 rounded-xl text-xs border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#3E5C46]"
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
                      className="px-3.5 py-2.5 bg-stone-100 rounded-xl text-xs border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#3E5C46]"
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
                      className="px-3.5 py-2.5 bg-stone-100 rounded-xl text-xs border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#3E5C46]"
                    />
                  </div>
                </div>
              </form>

              {/* PIN Code Change Form */}
              <form
                onSubmit={handleChangePin}
                className="p-6 sm:p-8 bg-white/90 backdrop-blur-sm rounded-2xl border border-stone-200 shadow-sm flex flex-col gap-6"
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
                      className="w-full px-3.5 py-2.5 bg-stone-100 rounded-xl text-xs border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#3E5C46]"
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
                      className="w-full px-3.5 py-2.5 bg-stone-100 rounded-xl text-xs border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#3E5C46]"
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
                      className="w-full px-3.5 py-2.5 bg-stone-100 rounded-xl text-xs border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#3E5C46]"
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
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-stone-200 flex flex-col gap-4 animate-scale-up">
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

            <form onSubmit={handleCreateNotice} className="flex flex-col gap-4">
              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  Tiêu đề bản tin
                </label>
                <input
                  type="text"
                  placeholder="VD: Đêm nhạc Acoustic bên suối..."
                  value={newNotice.title}
                  onChange={(e) => setNewNotice({ ...newNotice, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-stone-100 rounded-xl text-xs border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#3E5C46]"
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
                  className="w-full px-3.5 py-2.5 bg-stone-100 rounded-xl text-xs border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#3E5C46]"
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
                    className="w-full px-3 py-2 bg-stone-100 rounded-xl text-xs border border-stone-200"
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
    </div>
  );
}
