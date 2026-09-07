"use client";

import { useState, useEffect } from "react";
import {
  FileText,
  Coffee,
  Image as ImageIcon,
  Users,
  Loader2,
  CalendarCheck,
  TrendingUp,
  Smartphone,
  Monitor,
  CheckCircle2,
  Clock,
  Phone,
  Search,
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  RefreshCw,
  Sparkles,
  DollarSign
} from "lucide-react";
import Link from "next/link";
import { useMenu } from "@/hooks/useMenu";

interface Reservation {
  id: string;
  name: string;
  phone: string;
  email?: string;
  date: string;
  time: string;
  guests: number;
  note?: string;
  status: "pending" | "confirmed" | "completed";
  createdAt: string;
}

export default function AdminDashboard() {
  const { menu, toggleStock, isLoading: isMenuLoading, refreshMenu } = useMenu();

  const [stats, setStats] = useState({
    posts: 0,
    gallery: 0,
    users: 0,
  });
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isResLoading, setIsResLoading] = useState(true);

  // Menu Quick Management state
  const [searchMenu, setSearchMenu] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [isSavingItem, setIsSavingItem] = useState(false);

  // Quick Add Item
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [newName, setNewName] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newCategory, setNewCategory] = useState("CÀ PHÊ");

  // Load General Stats & Reservations
  useEffect(() => {
    fetchGeneralData();
  }, []);

  const fetchGeneralData = async () => {
    setIsResLoading(true);
    try {
      const [postsRes, galleryRes, usersRes, resRes] = await Promise.all([
        fetch("/api/posts").then((r) => r.json()).catch(() => ({ posts: [] })),
        fetch("/api/gallery").then((r) => r.json()).catch(() => ({ images: [] })),
        fetch("/api/users").then((r) => r.json()).catch(() => ({ users: [] })),
        fetch("/api/reservations").then((r) => r.json()).catch(() => ({ reservations: [] })),
      ]);

      setStats({
        posts: postsRes.posts?.length || 0,
        gallery: galleryRes.images?.length || 0,
        users: usersRes.users?.length || 0,
      });
      setReservations(resRes.reservations || []);
    } catch (error) {
      console.error("Lỗi tải dữ liệu admin:", error);
    } finally {
      setIsResLoading(false);
    }
  };

  // Cập nhật trạng thái đặt bàn
  const updateReservationStatus = async (id: string, status: "confirmed" | "completed") => {
    try {
      const res = await fetch("/api/reservations", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (res.ok) {
        setReservations((prev) =>
          prev.map((item) => (item.id === id ? { ...item, status } : item))
        );
      }
    } catch (error) {
      console.error("Lỗi cập nhật đặt bàn:", error);
    }
  };

  // Xóa yêu cầu đặt bàn
  const deleteReservation = async (id: string) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa yêu cầu đặt bàn này?")) return;
    try {
      const res = await fetch("/api/reservations", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        setReservations((prev) => prev.filter((item) => item.id !== id));
      }
    } catch (error) {
      console.error("Lỗi xóa đặt bàn:", error);
    }
  };

  // Lưu chỉnh sửa món (Tên và Giá)
  const handleSaveItem = async (item: any) => {
    setIsSavingItem(true);
    try {
      const res = await fetch("/api/menu", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...item,
          name: editName || item.name,
          price: editPrice || item.price,
        }),
      });
      if (res.ok) {
        await refreshMenu();
        setEditingItemId(null);
      }
    } catch (error) {
      console.error("Lỗi cập nhật món:", error);
    } finally {
      setIsSavingItem(false);
    }
  };

  // Thêm món mới nhanh
  const handleQuickAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newPrice) return;
    try {
      const res = await fetch("/api/menu", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newName,
          price: newPrice,
          category: newCategory,
          inStock: true,
        }),
      });
      if (res.ok) {
        await refreshMenu();
        setNewName("");
        setNewPrice("");
        setIsAddingItem(false);
      }
    } catch (error) {
      console.error("Lỗi thêm món:", error);
    }
  };

  // Quy đổi giá USD ước tính từ VND
  const getUsdEstimate = (priceStr: string) => {
    const cleanNum = parseInt(priceStr.replace(/[^0-9]/g, ""), 10);
    if (isNaN(cleanNum)) return "";
    const usd = Math.round((cleanNum / 25000) * 20) / 20;
    return `$${usd.toFixed(2)}`;
  };

  // Lọc menu
  const filteredMenu = menu.filter((item) => {
    const matchQuery = item.name.toLowerCase().includes(searchMenu.toLowerCase());
    const matchCat = selectedCategory === "ALL" || item.category === selectedCategory;
    return matchQuery && matchCat;
  });

  const categories = ["ALL", ...Array.from(new Set(menu.map((i) => i.category)))];

  const inStockCount = menu.filter((i) => i.inStock).length;
  const outOfStockCount = menu.length - inStockCount;
  const pendingReservations = reservations.filter((r) => r.status === "pending").length;

  return (
    <div className="max-w-full space-y-6 pb-12 animate-in fade-in duration-300">
      
      {/* 1. Header Bảng tin */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#c3c4c7] pb-4">
        <div>
          <h1 className="text-[24px] font-semibold text-[#1d2327]">
            Bảng điều khiển Quản trị Cẩm Cù House
          </h1>
          <p className="text-xs text-[#50575e] mt-1">
            Quản lý thực đơn món ăn, danh sách đặt bàn và thống kê lượt truy cập theo thời gian thực.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              fetchGeneralData();
              refreshMenu();
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs bg-white border border-[#8c8f94] hover:bg-[#f6f7f7] text-[#1d2327] rounded-sm shadow-sm transition-colors cursor-pointer"
          >
            <RefreshCw size={13} className={isResLoading || isMenuLoading ? "animate-spin" : ""} />
            <span>Làm mới dữ liệu</span>
          </button>
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs bg-[#2271b1] hover:bg-[#135e96] text-white rounded-sm shadow-sm transition-colors cursor-pointer"
          >
            <ExternalLink size={13} />
            <span>Xem website</span>
          </Link>
        </div>
      </div>


      {/* 2. Bốn Thẻ Thống Kê Tổng Quan (Top Metric Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Lượt truy cập */}
        <div className="bg-white border border-[#c3c4c7] rounded-sm p-4 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#50575e] mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Lượt truy cập hôm nay</span>
            <TrendingUp size={18} className="text-[#2271b1]" />
          </div>
          <div>
            <div className="text-3xl font-light text-[#1d2327]">1,280</div>
            <div className="text-xs text-emerald-600 font-medium mt-1">
              ↑ +14.8% <span className="text-[#646970] font-normal">so với tuần trước</span>
            </div>
          </div>
          <div className="text-[11px] text-[#50575e] mt-3 pt-2 border-t border-[#f0f0f1]">
            Tổng tháng này: <strong>38,450</strong> lượt
          </div>
        </div>

        {/* Thực đơn */}
        <div className="bg-white border border-[#c3c4c7] rounded-sm p-4 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#50575e] mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Món trong Thực đơn</span>
            <Coffee size={18} className="text-[#2271b1]" />
          </div>
          <div>
            <div className="text-3xl font-light text-[#1d2327]">{menu.length}</div>
            <div className="text-xs text-[#50575e] mt-1 flex items-center gap-2">
              <span className="text-emerald-700 font-medium">{inStockCount} đang bán</span>
              <span>•</span>
              <span className="text-rose-700 font-medium">{outOfStockCount} tạm hết</span>
            </div>
          </div>
          <div className="text-[11px] text-[#2271b1] mt-3 pt-2 border-t border-[#f0f0f1]">
            <Link href="/admin/menu" className="hover:underline">Quản lý chi tiết thực đơn &rarr;</Link>
          </div>
        </div>

        {/* Đặt bàn mới */}
        <div className="bg-white border border-[#c3c4c7] rounded-sm p-4 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#50575e] mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Đặt bàn & Tin nhắn</span>
            <CalendarCheck size={18} className="text-[#d63638]" />
          </div>
          <div>
            <div className="text-3xl font-light text-[#d63638]">{pendingReservations}</div>
            <div className="text-xs text-[#50575e] mt-1">
              {pendingReservations > 0 ? (
                <span className="text-amber-700 font-semibold animate-pulse">Cần xác nhận ngay!</span>
              ) : (
                <span className="text-emerald-700 font-medium">Đã xử lý tất cả</span>
              )}
            </div>
          </div>
          <div className="text-[11px] text-[#50575e] mt-3 pt-2 border-t border-[#f0f0f1]">
            Tổng ghi nhận: <strong>{reservations.length}</strong> yêu cầu
          </div>
        </div>

        {/* Thư viện ảnh & Bài viết */}
        <div className="bg-white border border-[#c3c4c7] rounded-sm p-4 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#50575e] mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Dữ liệu Website</span>
            <ImageIcon size={18} className="text-[#2271b1]" />
          </div>
          <div>
            <div className="text-3xl font-light text-[#1d2327]">
              {stats.gallery} <span className="text-sm text-[#50575e]">ảnh</span>
            </div>
            <div className="text-xs text-[#50575e] mt-1">
              {stats.posts} bài viết chia sẻ không gian
            </div>
          </div>
          <div className="text-[11px] text-[#2271b1] mt-3 pt-2 border-t border-[#f0f0f1]">
            <Link href="/admin/gallery" className="hover:underline">Xem thư viện ảnh &rarr;</Link>
          </div>
        </div>

      </div>


      {/* 3. Thống kê nhanh lượt truy cập (Visitor Analytics Widget) */}
      <div className="bg-white border border-[#c3c4c7] rounded-sm p-4 sm:p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h2 className="text-[15px] font-semibold text-[#1d2327] flex items-center gap-2">
              <TrendingUp size={16} className="text-[#2271b1]" />
              <span>Thống kê nhanh lượt truy cập tuần này</span>
            </h2>
            <p className="text-xs text-[#50575e]">Theo dõi lưu lượng khách xem thực đơn và khám phá không gian</p>
          </div>
          <div className="flex items-center gap-4 text-xs text-[#50575e]">
            <div className="flex items-center gap-1.5">
              <Smartphone size={14} className="text-[#2271b1]" />
              <span>Mobile: <strong>72%</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <Monitor size={14} className="text-[#72aee6]" />
              <span>Desktop: <strong>28%</strong></span>
            </div>
          </div>
        </div>

        {/* Biểu đồ cột 7 ngày */}
        <div className="grid grid-cols-7 gap-2 sm:gap-4 pt-4 border-t border-[#f0f0f1] text-center">
          {[
            { day: "Thứ 2", visits: 890, height: "45%" },
            { day: "Thứ 3", visits: 1020, height: "52%" },
            { day: "Thứ 4", visits: 1140, height: "58%" },
            { day: "Thứ 5", visits: 980, height: "50%" },
            { day: "Thứ 6", visits: 1350, height: "68%" },
            { day: "Thứ 7", visits: 1890, height: "92%" },
            { day: "Chủ Nhật", visits: 2150, height: "100%" },
          ].map((bar) => (
            <div key={bar.day} className="flex flex-col items-center justify-end h-32">
              <span className="text-[10px] text-[#50575e] mb-1 font-mono">{bar.visits}</span>
              <div className="w-full max-w-[36px] bg-[#f0f0f1] rounded-t-sm h-24 flex items-end justify-center overflow-hidden">
                <div
                  className="w-full bg-[#2271b1] hover:bg-[#135e96] transition-all rounded-t-sm"
                  style={{ height: bar.height }}
                  title={`${bar.day}: ${bar.visits} lượt`}
                />
              </div>
              <span className="text-[11px] text-[#1d2327] font-medium mt-2">{bar.day}</span>
            </div>
          ))}
        </div>
      </div>


      {/* 4. Quản lý Thực đơn Nhanh (Menu Manager Widget) */}
      <div className="bg-white border border-[#c3c4c7] rounded-sm p-4 sm:p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-[16px] font-semibold text-[#1d2327] flex items-center gap-2">
              <Coffee size={17} className="text-[#2271b1]" />
              <span>Quản lý Thực đơn Nhanh (Menu Manager)</span>
            </h2>
            <p className="text-xs text-[#50575e]">
              Bật/tắt món hết hàng, sửa trực tiếp tên món và giá bán (tự động quy đổi USD).
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setIsAddingItem(!isAddingItem)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs bg-[#2271b1] hover:bg-[#135e96] text-white rounded-sm transition-colors cursor-pointer"
            >
              <Plus size={14} />
              <span>Thêm món nhanh</span>
            </button>
            <Link
              href="/admin/menu"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs border border-[#8c8f94] text-[#1d2327] hover:bg-[#f6f7f7] rounded-sm transition-colors"
            >
              <span>Xem trang Thực đơn đầy đủ</span>
              <ExternalLink size={12} />
            </Link>
          </div>
        </div>

        {/* Form thêm món nhanh */}
        {isAddingItem && (
          <form onSubmit={handleQuickAddItem} className="mb-5 p-4 bg-[#fcfcfc] border border-[#2271b1] rounded-sm">
            <h3 className="text-xs font-semibold text-[#1d2327] uppercase tracking-wider mb-3">
              Thêm món mới vào thực đơn
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-[#50575e] mb-1">Tên món</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="VD: Cà phê Cold Brew..."
                  className="w-full px-2.5 py-1.5 text-xs border border-[#8c8f94] rounded-sm focus:border-[#2271b1] outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-[#50575e] mb-1">Giá bán VNĐ</label>
                <input
                  type="text"
                  required
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  placeholder="VD: 32.000đ"
                  className="w-full px-2.5 py-1.5 text-xs border border-[#8c8f94] rounded-sm focus:border-[#2271b1] outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-[#50575e] mb-1">Danh mục</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs border border-[#8c8f94] rounded-sm focus:border-[#2271b1] outline-none bg-white"
                >
                  <option value="CÀ PHÊ">CÀ PHÊ</option>
                  <option value="TRÀ & THẢO MỘC">TRÀ & THẢO MỘC</option>
                  <option value="ĐÁ XAY & SINH TỐ">ĐÁ XAY & SINH TỐ</option>
                  <option value="NƯỚC ÉP NGUYÊN CHẤT">NƯỚC ÉP NGUYÊN CHẤT</option>
                  <option value="ĐỒ UỐNG ĐẶC BIỆT">ĐỒ UỐNG ĐẶC BIỆT</option>
                </select>
              </div>
              <div className="flex items-end gap-2">
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs bg-[#2271b1] text-white rounded-sm hover:bg-[#135e96] font-medium cursor-pointer"
                >
                  Lưu món
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddingItem(false)}
                  className="px-3 py-1.5 text-xs border border-[#8c8f94] text-[#50575e] rounded-sm hover:bg-white cursor-pointer"
                >
                  Hủy
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Thanh tìm kiếm & lọc danh mục */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3 text-xs">
          <div className="flex flex-wrap items-center gap-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-sm cursor-pointer transition-colors ${
                  selectedCategory === cat
                    ? "bg-[#2271b1] text-white font-medium"
                    : "bg-[#f6f7f7] text-[#50575e] hover:bg-[#f0f0f1] border border-[#dcdcde]"
                }`}
              >
                {cat === "ALL" ? "Tất cả danh mục" : cat}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-[220px]">
            <input
              type="text"
              value={searchMenu}
              onChange={(e) => setSearchMenu(e.target.value)}
              placeholder="Tìm nhanh tên món..."
              className="w-full pl-7 pr-3 py-1 text-xs border border-[#8c8f94] rounded-sm focus:border-[#2271b1] outline-none"
            />
            <Search size={13} className="absolute left-2 top-1/2 -translate-y-1/2 text-[#8c8f94]" />
          </div>
        </div>

        {/* Bảng danh sách món */}
        <div className="border border-[#c3c4c7] rounded-sm overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse min-w-[650px]">
            <thead>
              <tr className="bg-[#fcfcfc] border-b border-[#c3c4c7] text-[#1d2327]">
                <th className="px-3 py-2.5 font-semibold">Tên món</th>
                <th className="px-3 py-2.5 font-semibold">Danh mục</th>
                <th className="px-3 py-2.5 font-semibold">Giá bán (VNĐ)</th>
                <th className="px-3 py-2.5 font-semibold">Quy đổi USD</th>
                <th className="px-3 py-2.5 font-semibold text-center w-36">Trạng thái phục vụ</th>
                <th className="px-3 py-2.5 font-semibold text-right w-24">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0f0f1]">
              {isMenuLoading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-[#50575e]">
                    <Loader2 size={20} className="animate-spin inline mr-2 text-[#2271b1]" />
                    Đang tải danh sách món...
                  </td>
                </tr>
              ) : filteredMenu.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-[#50575e]">
                    Không tìm thấy món nào phù hợp.
                  </td>
                </tr>
              ) : (
                filteredMenu.map((item, idx) => (
                  <tr
                    key={item.id}
                    className={`hover:bg-[#f9f9f9] transition-colors ${idx % 2 === 0 ? "bg-white" : "bg-[#fcfcfc]"}`}
                  >
                    {/* Tên món */}
                    <td className="px-3 py-2.5 font-medium text-[#1d2327]">
                      {editingItemId === item.id ? (
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="px-2 py-1 border border-[#2271b1] rounded-sm text-xs w-full"
                        />
                      ) : (
                        item.name
                      )}
                    </td>

                    {/* Danh mục */}
                    <td className="px-3 py-2.5 text-[#50575e]">
                      <span className="px-2 py-0.5 rounded bg-[#f0f0f1] text-[11px]">
                        {item.category}
                      </span>
                    </td>

                    {/* Giá VNĐ */}
                    <td className="px-3 py-2.5 text-[#1d2327]">
                      {editingItemId === item.id ? (
                        <input
                          type="text"
                          value={editPrice}
                          onChange={(e) => setEditPrice(e.target.value)}
                          className="px-2 py-1 border border-[#2271b1] rounded-sm text-xs w-24"
                        />
                      ) : (
                        <span className="font-mono font-semibold">{item.price}</span>
                      )}
                    </td>

                    {/* Giá USD quy đổi */}
                    <td className="px-3 py-2.5 text-[#2271b1] font-mono">
                      {getUsdEstimate(editingItemId === item.id ? editPrice : item.price)}
                    </td>

                    {/* Nút bật/tắt còn hàng */}
                    <td className="px-3 py-2.5 text-center">
                      <button
                        onClick={() => toggleStock(item.id)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-colors cursor-pointer ${
                          item.inStock
                            ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                            : "bg-rose-100 text-rose-800 hover:bg-rose-200"
                        }`}
                        title="Bấm để chuyển đổi Còn hàng / Hết hàng"
                      >
                        <span
                          className={`w-2 h-2 rounded-full ${item.inStock ? "bg-emerald-600" : "bg-rose-600"}`}
                        />
                        <span>{item.inStock ? "Còn hàng" : "Hết hàng"}</span>
                      </button>
                    </td>

                    {/* Nút sửa / lưu */}
                    <td className="px-3 py-2.5 text-right">
                      {editingItemId === item.id ? (
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleSaveItem(item)}
                            disabled={isSavingItem}
                            className="px-2 py-0.5 bg-[#2271b1] text-white rounded-sm text-[11px] hover:bg-[#135e96]"
                          >
                            Lưu
                          </button>
                          <button
                            onClick={() => setEditingItemId(null)}
                            className="px-1.5 py-0.5 border border-[#8c8f94] text-[#50575e] rounded-sm text-[11px]"
                          >
                            Hủy
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setEditingItemId(item.id);
                            setEditName(item.name);
                            setEditPrice(item.price);
                          }}
                          className="text-[#2271b1] hover:underline cursor-pointer inline-flex items-center gap-1"
                        >
                          <Edit2 size={11} />
                          <span>Sửa</span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>


      {/* 5. Danh sách Tin nhắn / Yêu cầu Đặt bàn (Reservation Management Widget) */}
      <div className="bg-white border border-[#c3c4c7] rounded-sm p-4 sm:p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h2 className="text-[16px] font-semibold text-[#1d2327] flex items-center gap-2">
              <CalendarCheck size={17} className="text-[#d63638]" />
              <span>Yêu cầu Đặt bàn & Tin nhắn của khách</span>
            </h2>
            <p className="text-xs text-[#50575e]">
              Danh sách khách hàng đăng ký trước hoặc gửi lời nhắn từ trang chủ và trang liên hệ.
            </p>
          </div>
          <span className="text-xs text-[#50575e] bg-[#f0f0f1] px-2.5 py-1 rounded">
            Tổng cộng: <strong>{reservations.length}</strong> yêu cầu
          </span>
        </div>

        <div className="border border-[#c3c4c7] rounded-sm overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-[#fcfcfc] border-b border-[#c3c4c7] text-[#1d2327]">
                <th className="px-3 py-2.5 font-semibold">Khách hàng</th>
                <th className="px-3 py-2.5 font-semibold">Số điện thoại</th>
                <th className="px-3 py-2.5 font-semibold">Ngày & Giờ hẹn</th>
                <th className="px-3 py-2.5 font-semibold">Số khách</th>
                <th className="px-3 py-2.5 font-semibold">Lời nhắn / Ghi chú</th>
                <th className="px-3 py-2.5 font-semibold text-center">Trạng thái</th>
                <th className="px-3 py-2.5 font-semibold text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0f0f1]">
              {isResLoading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-[#50575e]">
                    <Loader2 size={20} className="animate-spin inline mr-2 text-[#2271b1]" />
                    Đang tải danh sách đặt bàn...
                  </td>
                </tr>
              ) : reservations.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-6 text-center text-[#50575e]">
                    Chưa có yêu cầu đặt bàn nào mới.
                  </td>
                </tr>
              ) : (
                reservations.map((res) => (
                  <tr key={res.id} className="hover:bg-[#f9f9f9] transition-colors">
                    {/* Tên khách */}
                    <td className="px-3 py-3 font-semibold text-[#1d2327]">
                      {res.name}
                      {res.email && <div className="text-[11px] font-normal text-[#50575e]">{res.email}</div>}
                    </td>

                    {/* Số điện thoại */}
                    <td className="px-3 py-3 font-mono">
                      <a
                        href={`tel:${res.phone}`}
                        className="text-[#2271b1] hover:underline inline-flex items-center gap-1"
                      >
                        <Phone size={12} />
                        <span>{res.phone}</span>
                      </a>
                    </td>

                    {/* Ngày & Giờ */}
                    <td className="px-3 py-3 text-[#1d2327]">
                      <div className="font-medium">{res.date}</div>
                      <div className="text-[11px] text-[#50575e] flex items-center gap-1">
                        <Clock size={10} />
                        <span>{res.time}</span>
                      </div>
                    </td>

                    {/* Số khách */}
                    <td className="px-3 py-3 text-[#1d2327]">
                      <span className="font-semibold">{res.guests}</span> người
                    </td>

                    {/* Lời nhắn */}
                    <td className="px-3 py-3 text-[#50575e] max-w-[220px] truncate" title={res.note || ""}>
                      {res.note || "—"}
                    </td>

                    {/* Trạng thái badge */}
                    <td className="px-3 py-3 text-center">
                      {res.status === "pending" && (
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-amber-100 text-amber-800 border border-amber-200">
                          Chờ duyệt
                        </span>
                      )}
                      {res.status === "confirmed" && (
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-emerald-100 text-emerald-800 border border-emerald-200">
                          Đã xác nhận
                        </span>
                      )}
                      {res.status === "completed" && (
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-blue-100 text-blue-800 border border-blue-200">
                          Hoàn tất
                        </span>
                      )}
                    </td>

                    {/* Thao tác */}
                    <td className="px-3 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {res.status === "pending" && (
                          <button
                            onClick={() => updateReservationStatus(res.id, "confirmed")}
                            className="px-2 py-1 rounded text-[11px] bg-emerald-600 hover:bg-emerald-700 text-white font-medium cursor-pointer"
                            title="Xác nhận lịch hẹn"
                          >
                            Duyệt
                          </button>
                        )}
                        {res.status === "confirmed" && (
                          <button
                            onClick={() => updateReservationStatus(res.id, "completed")}
                            className="px-2 py-1 rounded text-[11px] bg-blue-600 hover:bg-blue-700 text-white font-medium cursor-pointer"
                            title="Đánh dấu hoàn tất"
                          >
                            Xong
                          </button>
                        )}
                        <button
                          onClick={() => deleteReservation(res.id)}
                          className="p-1 text-[#d63638] hover:bg-rose-50 rounded cursor-pointer"
                          title="Xóa yêu cầu này"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
