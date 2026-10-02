"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  UtensilsCrossed,
  Image as ImageIcon,
  Settings,
  LogOut,
  Users,
  Trees,
  Coffee,
  Star,
  Plus,
  RefreshCw,
  Bell,
  HelpCircle,
  Sparkles,
  TrendingUp,
  Clock,
  Radio,
  Edit2,
  Calendar,
  Eye,
  CheckCircle2
} from "lucide-react";

interface DishStatus {
  id: string;
  name: string;
  price: string;
  tag: string;
  image: string;
  inStock: boolean;
}

const INITIAL_DISHES: DishStatus[] = [
  {
    id: "d1",
    name: "Cà phê muối Đắk Nông",
    price: "28.000đ",
    tag: "Bán chạy",
    image: "/images/coffee-drink.png",
    inStock: true,
  },
  {
    id: "d2",
    name: "Trà hoa đu đủ mật ong",
    price: "28.000đ",
    tag: "Thảo mộc",
    image: "/images/fruit-tea.png",
    inStock: true,
  },
  {
    id: "d3",
    name: "Sinh tố bơ sầu riêng",
    price: "33.000đ",
    tag: "Đặc sản bơ 034",
    image: "/space/space-8.jpg",
    inStock: true,
  },
  {
    id: "d4",
    name: "Bò kho + bánh mì",
    price: "45.000đ",
    tag: "Món chính",
    image: "/space/space-1.jpg",
    inStock: true,
  },
  {
    id: "d5",
    name: "Bánh tráng phơi sương sa tế",
    price: "12.000đ",
    tag: "Ăn vặt",
    image: "/space/space-6.jpg",
    inStock: false,
  },
];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<"overview" | "menu" | "gallery" | "settings">("overview");
  const [dishes, setDishes] = useState<DishStatus[]>(INITIAL_DISHES);
  const [noticeModalOpen, setNoticeModalOpen] = useState(false);

  const toggleStock = (id: string) => {
    setDishes((prev: DishStatus[]) =>
      prev.map((d: DishStatus) => (d.id === id ? { ...d, inStock: !d.inStock } : d))
    );
  };

  return (
    <div className="bg-[#F9F8F3] min-h-screen text-[#1B281D] flex">
      {/* Sidebar */}
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
              <span className="text-[11px] text-stone-500">Management Console</span>
            </div>
          </div>

          <div className="text-[11px] font-bold uppercase tracking-wider text-stone-400 px-2">
            Hệ Thống Quản Trị
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1.5">
            <button
              type="button"
              onClick={() => setActiveTab("overview")}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === "overview"
                  ? "bg-[#3E5C46] text-white shadow-sm"
                  : "text-stone-600 hover:bg-stone-200 hover:text-stone-900"
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
                  ? "bg-[#3E5C46] text-white shadow-sm"
                  : "text-stone-600 hover:bg-stone-200 hover:text-stone-900"
              }`}
            >
              <UtensilsCrossed className="w-4 h-4" />
              <span>Quản lý Thực Đơn</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("gallery")}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === "gallery"
                  ? "bg-[#3E5C46] text-white shadow-sm"
                  : "text-stone-600 hover:bg-stone-200 hover:text-stone-900"
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
                  ? "bg-[#3E5C46] text-white shadow-sm"
                  : "text-stone-600 hover:bg-stone-200 hover:text-stone-900"
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Cài Đặt Cửa Hàng</span>
            </button>
          </nav>
        </div>

        {/* User Card & Logout */}
        <div className="p-3 bg-white border border-stone-200 rounded-xl flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#3E5C46] text-white flex items-center justify-center font-bold text-xs shrink-0">
              AD
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-[#1B281D]">Quản lý viên</span>
              <span className="text-[10px] text-stone-500">Gia Nghĩa Hub</span>
            </div>
          </div>
          <Link
            href="/"
            title="Về trang khách"
            className="p-1.5 rounded-lg text-stone-400 hover:text-[#3E5C46] hover:bg-stone-100 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="pl-64 w-full">
        {/* Top Header */}
        <header className="h-16 bg-[#F9F8F3]/90 backdrop-blur-xl border-b border-stone-200 sticky top-0 z-40 flex items-center justify-between px-6 sm:px-8">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/70 border border-emerald-200 text-[#3E5C46] text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-[#396663] animate-pulse" />
              <span>Hệ thống Hoạt Động (Cửa hàng: Đang mở)</span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-stone-600">
              <Clock className="w-3.5 h-3.5 text-[#396663]" />
              <span>Đắk Nông (GMT+7) • T2-T5: 07h-18h | T6-CN: 07h-22h</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-600 hover:text-stone-900 hover:bg-stone-200 transition-colors"
                title="Thông báo"
              >
                <Bell className="w-4 h-4" />
              </button>
              <button
                type="button"
                className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-600 hover:text-stone-900 hover:bg-stone-200 transition-colors"
                title="Trợ giúp"
              >
                <HelpCircle className="w-4 h-4" />
              </button>
              <Link
                href="/"
                className="px-3.5 py-1.5 rounded-full bg-[#3E5C46] text-white text-xs font-semibold hover:bg-[#2D4233] transition-colors"
              >
                Xem Website
              </Link>
            </div>
          </div>
        </header>

        {/* Dashboard Body */}
        <main className="p-6 sm:p-8 flex flex-col gap-8 max-w-7xl mx-auto">
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
                  Quán đang mở cửa đón khách
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
                <span>+ Bảng Tin Quán</span>
              </button>
              <Link
                href="/menu"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#3E5C46] text-white text-xs font-semibold hover:bg-[#2D4233] transition-all shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>Xem Toàn Bộ Menu</span>
              </Link>
            </div>
          </div>

          {/* 4 KPI Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
            {/* Card 1 */}
            <div className="p-5 rounded-2xl bg-white/90 backdrop-blur-sm border border-stone-200/60 shadow-sm flex flex-col justify-between">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[11px] text-stone-500 uppercase tracking-wider font-semibold">
                    Khách ghé hôm nay
                  </span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="font-serif text-3xl font-bold text-[#3E5C46]">~85</span>
                    <span className="text-xs text-stone-400">lượt khách</span>
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

            {/* Card 2 */}
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

            {/* Card 3 */}
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
                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-[#614633]">
                  <Coffee className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4 pt-3 flex items-center justify-between text-xs text-stone-600 border-t border-stone-200/60">
                <span className="inline-flex items-center gap-1 text-[#614633] font-semibold">
                  Đã phục vụ 64 ly
                </span>
                <span className="text-[11px] text-stone-400">Top 1 đồ uống</span>
              </div>
            </div>

            {/* Card 4 */}
            <div className="p-5 rounded-2xl bg-white/90 backdrop-blur-sm border border-stone-200/60 shadow-sm flex flex-col justify-between">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[11px] text-stone-500 uppercase tracking-wider font-semibold">
                    Đánh giá trải nghiệm
                  </span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="font-serif text-3xl font-bold text-[#3E5C46]">5.0</span>
                    <div className="flex text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center text-[#3E5C46]">
                  <Sparkles className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4 pt-3 flex items-center justify-between text-xs text-stone-600 border-t border-stone-200/60">
                <span className="inline-flex items-center gap-1 text-[#3E5C46] font-semibold">
                  100% Đề xuất hài lòng
                </span>
                <span className="text-[11px] text-stone-400">42 nhận xét</span>
              </div>
            </div>
          </div>

          {/* Main Work Split: Left Announcements, Right Quick Menu Inventory */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
            {/* Left: Announcements & Board */}
            <div className="xl:col-span-8 flex flex-col gap-6">
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-stone-200/60 shadow-sm flex flex-col gap-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-200">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="font-serif text-xl font-bold text-[#3E5C46]">
                        Bảng Tin &amp; Thông Báo Quán Mới Nhất
                      </h2>
                      <span className="w-2 h-2 rounded-full bg-[#396663]" />
                    </div>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Quản lý bảng tin chào mừng, sự kiện cuối tuần và đặc sản trong ngày
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setNoticeModalOpen(true)}
                    className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#3E5C46] text-white text-xs font-semibold shadow-sm hover:bg-[#2D4233] transition-colors w-fit"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tạo Tin Mới</span>
                  </button>
                </div>

                {/* Announcement Cards */}
                <div className="flex flex-col gap-4">
                  {/* Notice 1 */}
                  <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 flex flex-col gap-2 hover:bg-stone-100/70 transition-colors">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-[#3E5C46] text-white text-[10px] font-bold">
                          Đang phát
                        </span>
                        <span className="text-xs font-bold text-[#1B281D]">
                          Giờ mở cửa đón khách &amp; Cà phê bên suối
                        </span>
                      </div>
                      <span className="text-[11px] text-stone-400">
                        T2-T5: 07h-18h | T6-CN: 07h-22h
                      </span>
                    </div>
                    <p className="text-xs text-stone-600 leading-relaxed">
                      Quán mở cửa đón khách tự do tham quan bờ suối Reo. Khách ghé có thể chọn chỗ ngồi trực tiếp sát bờ suối hoặc chòi ngắm cảnh mà không cần đặt chỗ trước.
                    </p>
                    <div className="flex items-center justify-between pt-1 text-[11px] text-stone-500">
                      <span className="text-[#396663] font-semibold flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5" /> Hiển thị trên Trang Chủ &amp; Footer
                      </span>
                      <div className="flex items-center gap-2">
                        <button type="button" className="hover:text-[#3E5C46] font-semibold">Chỉnh sửa</button>
                        <span>•</span>
                        <button type="button" className="hover:text-red-600">Tạm ẩn</button>
                      </div>
                    </div>
                  </div>

                  {/* Notice 2 */}
                  <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 flex flex-col gap-2 hover:bg-stone-100/70 transition-colors">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                          Món hôm nay
                        </span>
                        <span className="text-xs font-bold text-[#1B281D]">
                          Mẻ cà phê muối Đắk Nông nguyên bản mới ủ
                        </span>
                      </div>
                      <span className="text-[11px] text-stone-400">Hôm nay</span>
                    </div>
                    <p className="text-xs text-stone-600 leading-relaxed">
                      Hạt cà phê Robusta chín mọng hái từ rẫy suối Reo, phối cùng lớp kem muối béo thanh độc quyền Cẩm Cù House. Phục vụ kèm đá suối trong veo.
                    </p>
                    <div className="flex items-center justify-between pt-1 text-[11px] text-stone-500">
                      <span className="text-[#614633] font-semibold flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-current" /> Gợi ý nổi bật nhất
                      </span>
                      <div className="flex items-center gap-2">
                        <button type="button" className="hover:text-[#3E5C46] font-semibold">Chỉnh sửa</button>
                        <span>•</span>
                        <button type="button" className="hover:text-red-600">Tạm ẩn</button>
                      </div>
                    </div>
                  </div>

                  {/* Notice 3 */}
                  <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 flex flex-col gap-2 hover:bg-stone-100/70 transition-colors">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-[#3E5C46] text-[10px] font-bold">
                          Đêm cuối tuần
                        </span>
                        <span className="text-xs font-bold text-[#1B281D]">
                          Đêm nhạc mộc acoustic &amp; Lửa trại bên dòng suối
                        </span>
                      </div>
                      <span className="text-[11px] text-stone-400">Thứ 7 • 18:30 - 22:00</span>
                    </div>
                    <p className="text-xs text-stone-600 leading-relaxed">
                      Không gian thắp đèn bão mộc mạc quanh chòi suối lớn, trà nóng hoa đu đủ và bắp khoai nướng bên lửa hồng cho du khách ghé ngắm trăng Đắk Nông.
                    </p>
                    <div className="flex items-center justify-between pt-1 text-[11px] text-stone-500">
                      <span className="text-[#396663] font-semibold flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" /> Sắp diễn ra
                      </span>
                      <div className="flex items-center gap-2">
                        <button type="button" className="hover:text-[#3E5C46] font-semibold">Chỉnh sửa</button>
                        <span>•</span>
                        <button type="button" className="hover:text-red-600">Tạm ẩn</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Hotline Sync Banner */}
              <div className="relative overflow-hidden rounded-2xl bg-[#3E5C46] text-white p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md">
                <div className="flex flex-col gap-1 max-w-lg z-10">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-200">
                    Kênh kết nối khách hàng Gia Nghĩa
                  </span>
                  <h3 className="font-serif text-xl font-bold">
                    Đồng bộ Menu điện tử &amp; Hotline Tiếp Nhận
                  </h3>
                  <p className="text-xs text-white/80 leading-relaxed">
                    Hotline đón tiếp chính thức 038 285 1688 và 077 465 9000 luôn sẵn sàng hỗ trợ khách tìm đường và chuẩn bị món nhanh chóng.
                  </p>
                </div>
                <a
                  href="tel:0382851688"
                  className="shrink-0 px-6 py-3 rounded-full bg-white text-[#3E5C46] text-xs font-bold hover:bg-stone-100 shadow-sm transition-all z-10"
                >
                  Kiểm tra Hotline
                </a>
              </div>
            </div>

            {/* Right: Quick Menu Inventory Control */}
            <div className="xl:col-span-4 flex flex-col gap-6">
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-stone-200/60 shadow-sm flex flex-col gap-5">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="font-serif text-xl font-bold text-[#3E5C46]">
                      Trạng Thái Món Nhanh
                    </h2>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Bật / Tắt trạng thái còn hàng để hiển thị cho khách
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setDishes(INITIAL_DISHES)}
                    className="p-2 rounded-full bg-stone-100 text-stone-600 hover:text-stone-900 transition-colors"
                    title="Làm mới trạng thái"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>

                {/* Dish Switch List */}
                <div className="flex flex-col divide-y divide-stone-100">
                  {dishes.map((dish: DishStatus) => (
                    <div
                      key={dish.id}
                      className={`py-3 flex items-center justify-between gap-3 ${
                        !dish.inStock ? "opacity-60" : ""
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={dish.image}
                          alt={dish.name}
                          className="w-12 h-12 rounded-xl object-cover shrink-0 border border-stone-200"
                        />
                        <div className="flex flex-col min-w-0">
                          <span className="text-xs font-bold text-[#1B281D] truncate">
                            {dish.name}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-serif font-bold text-[#614633]">
                              {dish.price}
                            </span>
                            <span className="text-[10px] text-stone-400">
                              • {dish.inStock ? dish.tag : "Tạm hết"}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          className="p-1 text-stone-400 hover:text-[#3E5C46] transition-colors"
                          title="Sửa giá"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        {/* Switch */}
                        <button
                          type="button"
                          onClick={() => toggleStock(dish.id)}
                          className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                            dish.inStock ? "bg-[#3E5C46]" : "bg-stone-300"
                          }`}
                        >
                          <div
                            className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                              dish.inStock ? "translate-x-5" : "translate-x-0"
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-3 bg-stone-50 rounded-xl flex items-center justify-between text-xs border border-stone-200">
                  <span className="text-stone-600">Đồng bộ tức thì với menu khách hàng</span>
                  <Link href="/menu" className="font-bold text-[#3E5C46] hover:underline">
                    Xem Menu
                  </Link>
                </div>
              </div>

              {/* Station Status Card */}
              <div className="p-6 rounded-2xl bg-white/90 backdrop-blur-sm border border-stone-200/60 shadow-sm flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-[#1B281D]">Khu Vực Bàn Nổi Bật</span>
                  <span className="text-xs text-[#396663] font-bold">10 / 10 bàn sẵn sàng</span>
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {[...Array(10)].map((_, i) => (
                    <div
                      key={i}
                      className="flex flex-col items-center p-2 rounded-xl bg-stone-50 border border-stone-200 text-[#3E5C46] text-center"
                    >
                      <span className="text-[10px] font-bold">Bàn {i + 1}</span>
                      <span className="w-2 h-2 rounded-full bg-[#396663] mt-1" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Quick Notice Modal Simulator */}
      <AnimatePresence>
        {noticeModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl p-6 sm:p-8 max-w-lg w-full border border-stone-200 shadow-2xl flex flex-col gap-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                <h3 className="font-serif text-xl font-bold text-[#3E5C46]">
                  Tạo Bảng Tin Quán Mới
                </h3>
                <button
                  type="button"
                  onClick={() => setNoticeModalOpen(false)}
                  className="text-xs font-bold text-stone-400 hover:text-[#1B281D]"
                >
                  Đóng
                </button>
              </div>

              <div className="flex flex-col gap-3 text-xs">
                <label className="flex flex-col gap-1 font-semibold text-[#1B281D]">
                  Tiêu đề thông báo
                  <input
                    type="text"
                    defaultValue="Mẻ cà phê muối mới rang sáng nay"
                    className="p-3 rounded-xl border border-stone-200 bg-stone-50 text-sm focus:outline-none focus:border-[#3E5C46]"
                  />
                </label>
                <label className="flex flex-col gap-1 font-semibold text-[#1B281D]">
                  Nội dung chi tiết
                  <textarea
                    rows={3}
                    defaultValue="Hạt cà phê Robusta tuyển chọn tươi mới bên bờ suối..."
                    className="p-3 rounded-xl border border-stone-200 bg-stone-50 text-sm focus:outline-none focus:border-[#3E5C46]"
                  />
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setNoticeModalOpen(false)}
                  className="px-5 py-2.5 rounded-full text-xs font-semibold text-stone-600 hover:bg-stone-100"
                >
                  Hủy
                </button>
                <button
                  type="button"
                  onClick={() => {
                    alert("Thông báo đã được đăng tải và đồng bộ lên hệ thống!");
                    setNoticeModalOpen(false);
                  }}
                  className="px-6 py-2.5 rounded-full bg-[#3E5C46] text-white text-xs font-bold hover:bg-[#2D4233] transition-colors"
                >
                  Đăng Bảng Tin
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
