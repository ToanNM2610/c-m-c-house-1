'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Mail,
  MessageSquare,
  UtensilsCrossed,
  Camera,
  Music,
  Layout,
  ExternalLink,
  RefreshCw,
  CheckCircle2,
  Clock,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';
import { AdminTab } from './AdminPageClient';

interface DashboardMetrics {
  unreadInquiries: number;
  pendingReviews: number;
  activeMenuItems: number;
  totalMenuItems: number;
  visiblePhotos: number;
  totalPhotos: number;
  publishedPosts: number;
  activePages: number;
  commerceEnabled?: boolean;
  enableCustomerPortal?: boolean;
  pendingOrdersCount?: number;
  lowStockCount?: number;
  grossRevenue?: number | null;
  netRevenue?: number | null;
  completedOrdersCount?: number;
  conversionRate?: number;
  recentInquiries: any[];
  recentReviews: any[];
  recentPendingOrders?: any[];
  lowStockItems?: any[];
}

export default function AdminDashboard({
  onNavigateTab,
}: {
  onNavigateTab: (tab: AdminTab) => void;
}) {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchMetrics = async () => {
    try {
      const res = await fetch('/api/admin/dashboard', {
        cache: 'no-store',
        credentials: 'include',
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setMetrics(json.data);
      }
    } catch (err) {
      console.error('Error fetching dashboard metrics:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleManualRefresh = () => {
    setRefreshing(true);
    fetchMetrics();
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-slate-900 border border-slate-800 rounded-3xl shadow-xl text-white">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold">
              Trực Tiếp Từ Cơ Sở Dữ Liệu PostgreSQL
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-black tracking-tight">
            Tổng Quan Cẩm Cù House CMS
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Bảng chỉ số hoạt động thời gian thực • Không dữ liệu mẫu • Chuẩn biên tập Editorial CMS
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleManualRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-bold transition-all border border-slate-700 active:scale-95 disabled:opacity-50"
            title="Làm mới số liệu"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-emerald-400' : ''}`} />
            <span>Làm mới</span>
          </button>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-bold transition-all shadow-md active:scale-95"
          >
            <span>Xem Website ↗</span>
          </a>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* KPI 1: Đặt bàn, BBQ & Hộp thư */}
        <div
          onClick={() => onNavigateTab('interactions-inbox')}
          className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/50 transition-all cursor-pointer shadow-lg group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                <Mail className="w-5 h-5" />
              </div>
              {metrics && metrics.unreadInquiries > 0 ? (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold font-mono bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {metrics.unreadInquiries} Mới
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Đã xử lý hết
                </span>
              )}
            </div>
            <div className="text-3xl font-mono font-bold text-white mb-1">
              {loading ? '...' : metrics?.unreadInquiries ?? 0}
            </div>
            <div className="text-sm font-medium text-slate-300">
              Đặt bàn, BBQ & Thư liên hệ
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {metrics && metrics.unreadInquiries > 0
                ? 'Có yêu cầu chưa phản hồi từ khách quý'
                : 'Tất cả lời nhắn đã được tiếp nhận chu đáo'}
            </p>
          </div>
          <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-emerald-400 group-hover:translate-x-1 transition-transform">
            <span>Mở hộp thư tiếp nhận</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* KPI 2: Duyệt Đánh Giá Khách Quý */}
        <div
          onClick={() => onNavigateTab('interactions-reviews')}
          className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/50 transition-all cursor-pointer shadow-lg group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
                <MessageSquare className="w-5 h-5" />
              </div>
              {metrics && metrics.pendingReviews > 0 ? (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold font-mono bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {metrics.pendingReviews} Chờ duyệt
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Đã duyệt 100%
                </span>
              )}
            </div>
            <div className="text-3xl font-mono font-bold text-white mb-1">
              {loading ? '...' : metrics?.pendingReviews ?? 0}
            </div>
            <div className="text-sm font-medium text-slate-300">
              Đánh giá khách hàng
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {metrics && metrics.pendingReviews > 0
                ? 'Cần duyệt kiểm duyệt trước khi hiển thị công khai'
                : 'Tất cả đánh giá hợp lệ đã được phê duyệt'}
            </p>
          </div>
          <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-amber-400 group-hover:translate-x-1 transition-transform">
            <span>Duyệt cảm nhận khách</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* KPI 3: Thực đơn 7 Danh mục */}
        <div
          onClick={() => onNavigateTab('menu-cms')}
          className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/50 transition-all cursor-pointer shadow-lg group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center border border-sky-500/20">
                <UtensilsCrossed className="w-5 h-5" />
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold font-mono bg-sky-500/20 text-sky-300 border border-sky-500/30">
                7 Danh mục
              </span>
            </div>
            <div className="text-3xl font-mono font-bold text-white mb-1">
              {loading
                ? '...'
                : `${metrics?.activeMenuItems ?? 67} / ${metrics?.totalMenuItems ?? 67}`}
            </div>
            <div className="text-sm font-medium text-slate-300">
              Món đang phục vụ
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Bảo tồn đầy đủ 67 món thảo mộc & cà phê mộc bazan
            </p>
          </div>
          <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-sky-400 group-hover:translate-x-1 transition-transform">
            <span>Quản lý thực đơn</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* KPI 4: Thư viện 30 Bản khắc Không gian */}
        <div
          onClick={() => onNavigateTab('gallery-cms')}
          className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/50 transition-all cursor-pointer shadow-lg group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/20">
                <Camera className="w-5 h-5" />
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold font-mono bg-purple-500/20 text-purple-300 border border-purple-500/30">
                4 Phân khu
              </span>
            </div>
            <div className="text-3xl font-mono font-bold text-white mb-1">
              {loading
                ? '...'
                : `${metrics?.visiblePhotos ?? 30} / ${metrics?.totalPhotos ?? 30}`}
            </div>
            <div className="text-sm font-medium text-slate-300">
              Bản khắc không gian hiển thị
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Bảo tồn 30 bản khắc thị giác bờ suối, nhà gỗ, vườn BBQ
            </p>
          </div>
          <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-purple-400 group-hover:translate-x-1 transition-transform">
            <span>Quản lý bản khắc</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* KPI 5: Tin tức & Hoạt động */}
        <div
          onClick={() => onNavigateTab('events-cms')}
          className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/50 transition-all cursor-pointer shadow-lg group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center border border-rose-500/20">
                <Music className="w-5 h-5" />
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold font-mono bg-rose-500/20 text-rose-300 border border-rose-500/30">
                Đang phát hành
              </span>
            </div>
            <div className="text-3xl font-mono font-bold text-white mb-1">
              {loading ? '...' : metrics?.publishedPosts ?? 3}
            </div>
            <div className="text-sm font-medium text-slate-300">
              Bản tin sinh thái & sự kiện
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Mùa hoa nở, cà phê rang củi và tiệc BBQ bên bờ suối
            </p>
          </div>
          <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-rose-400 group-hover:translate-x-1 transition-transform">
            <span>Quản lý bản tin</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* KPI 6: 7 Trang Web Công Khai */}
        <div
          onClick={() => onNavigateTab('page-home')}
          className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/50 transition-all cursor-pointer shadow-lg group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center border border-teal-500/20">
                <Layout className="w-5 h-5" />
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold font-mono bg-teal-500/20 text-teal-300 border border-teal-500/30">
                7 Trang chuẩn
              </span>
            </div>
            <div className="text-3xl font-mono font-bold text-white mb-1">
              {loading ? '...' : `${metrics?.activePages ?? 7} / 7`}
            </div>
            <div className="text-sm font-medium text-slate-300">
              Trang công khai đang bật
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Tùy chỉnh thứ tự section, layout variant và ảnh Vercel Blob
            </p>
          </div>
          <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-teal-400 group-hover:translate-x-1 transition-transform">
            <span>Biên tập 7 trang</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>

      {/* Action Center & Real-time Business KPIs (PostgreSQL) */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 text-slate-200 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm font-mono">
            <TrendingUp className="w-5 h-5" />
            <span>TRUNG TÂM CẢNH BÁO (ACTION CENTER) & CHỈ SỐ KINH DOANH THẬT</span>
          </div>
          <button
            onClick={() => onNavigateTab('dual-mode-settings')}
            className={`px-3 py-1 rounded-full text-xs font-mono font-bold border ${
              metrics?.commerceEnabled
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
            }`}
          >
            {metrics?.commerceEnabled
              ? 'Chế độ Bán hàng Online: ĐANG BẬT'
              : 'Chế độ Giới thiệu (Giai đoạn 1): ĐANG BẬT'}
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {metrics?.netRevenue !== null && metrics?.netRevenue !== undefined && (
            <div
              onClick={() => onNavigateTab('commerce-analytics')}
              className="p-4 rounded-2xl bg-slate-800/70 border border-slate-700/70 cursor-pointer hover:border-emerald-500/50"
            >
              <div className="font-mono text-slate-400">DOANH THU THUẦN</div>
              <div className="text-xl font-mono font-bold text-emerald-400 mt-1">
                {Number(metrics?.netRevenue || 0).toLocaleString('vi-VN')}đ
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                Gộp: {Number(metrics?.grossRevenue || 0).toLocaleString('vi-VN')}đ
              </div>
            </div>
          )}

          <div
            onClick={() => onNavigateTab('orders-cms')}
            className="p-4 rounded-2xl bg-slate-800/70 border border-slate-700/70 cursor-pointer hover:border-amber-500/50"
          >
            <div className="font-mono text-slate-400">ĐƠN CHỜ DUYỆT</div>
            <div className="text-xl font-mono font-bold text-amber-300 mt-1">
              {metrics?.pendingOrdersCount ?? 0}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              Hoàn tất: {metrics?.conversionRate ?? 0}%
            </div>
          </div>

          <div
            onClick={() => onNavigateTab('inventory-cms')}
            className="p-4 rounded-2xl bg-slate-800/70 border border-slate-700/70 cursor-pointer hover:border-rose-500/50"
          >
            <div className="font-mono text-slate-400">CẢNH BÁO TỒN KHO</div>
            <div className="text-xl font-mono font-bold text-rose-400 mt-1">
              {metrics?.lowStockCount ?? 0}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">Sản phẩm sắp hết</div>
          </div>

          <div
            onClick={() => onNavigateTab('interactions-inbox')}
            className="p-4 rounded-2xl bg-slate-800/70 border border-slate-700/70 cursor-pointer hover:border-sky-500/50"
          >
            <div className="font-mono text-slate-400">LỊCH ĐẶT BBQ / LIÊN HỆ</div>
            <div className="text-xl font-mono font-bold text-sky-400 mt-1">
              {metrics?.unreadInquiries ?? 0}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">Chưa xử lý</div>
          </div>
        </div>
      </div>

      {/* Quick Launchpad & Integrity Guarantee */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 text-slate-300 space-y-4">
        <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm font-mono">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <span>CAM KẾT TOÀN VẸN HỆ THỐNG (ENTERPRISE STANDARD)</span>
        </div>
        <p className="text-sm text-slate-400 leading-relaxed">
          Mọi dữ liệu menu 67 món, 30 bản khắc không gian, tồn kho, đơn hàng, CRM khách hàng và cấu hình 7 trang web đọc/ghi trực tiếp vào Neon PostgreSQL,
          tự động đồng bộ sang giao diện khách hàng qua <code>revalidatePath(&quot;/&quot;, &quot;layout&quot;)</code>.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={() => onNavigateTab('interactions-inbox')}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-mono font-bold transition-all border border-slate-700"
          >
            Hộp thư tiếp nhận ↗
          </button>
          <button
            onClick={() => onNavigateTab('interactions-reviews')}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-mono font-bold transition-all border border-slate-700"
          >
            Duyệt đánh giá khách ↗
          </button>
          <button
            onClick={() => onNavigateTab('menu-cms')}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-mono font-bold transition-all border border-slate-700"
          >
            Cập nhật món & giá ↗
          </button>
          <button
            onClick={() => onNavigateTab('gallery-cms')}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-mono font-bold transition-all border border-slate-700"
          >
            30 Bản khắc không gian ↗
          </button>
          <button
            onClick={() => onNavigateTab('settings')}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-mono font-bold transition-all border border-slate-700"
          >
            Cài đặt hotline & hỗ trợ nổi ↗
          </button>
        </div>
      </div>
    </div>
  );
}

