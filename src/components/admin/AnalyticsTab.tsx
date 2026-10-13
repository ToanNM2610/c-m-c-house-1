"use client";

import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  Users,
  Eye,
  Radio,
  Phone,
  Compass,
  FileText,
  Smartphone,
  Globe,
  RefreshCw,
  AlertCircle,
  ExternalLink,
  Clock,
  ArrowUpRight,
} from "lucide-react";
import { Ga4ReportData } from "@/lib/google-apis";

interface Props {
  onSwitchToIntegrations: () => void;
  onShowToast: (msg: string) => void;
}

export default function AnalyticsTab({ onSwitchToIntegrations, onShowToast }: Props) {
  const [days, setDays] = useState<7 | 28 | 90>(7);
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<Ga4ReportData | null>(null);

  const fetchAnalytics = async (selectedDays: number, refresh = false) => {
    try {
      setLoading(true);
      const url = `/api/admin/analytics?days=${selectedDays}${refresh ? "&refresh=1" : ""}`;
      const res = await fetch(url);
      const json = await res.json();
      if (json.success && json.data) {
        setData(json.data);
      } else {
        onShowToast(json.error || "Không thể tải dữ liệu Google Analytics");
      }
    } catch {
      onShowToast("Lỗi kết nối máy chủ khi tải Google Analytics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics(days);
  }, [days]);

  // If not connected, show clean Empty State as requested
  if (!loading && data && !data.connected) {
    return (
      <div className="flex flex-col items-center justify-center p-8 sm:p-14 bg-white dark:bg-[#1E2B22] border border-stone-200/80 dark:border-stone-700/60 rounded-3xl shadow-sm text-center max-w-2xl mx-auto my-8">
        <div className="w-16 h-16 rounded-3xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-5 shadow-sm border border-amber-200 dark:border-amber-800">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 dark:text-stone-100 mb-3">
          Chưa Kết Nối Google Analytics 4
        </h1>
        <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed mb-6 max-w-md">
          {data.error ||
            "Để hiển thị lưu lượng truy cập thực tế, biểu đồ người dùng và các sự kiện bấm Gọi / Chỉ đường, vui lòng cấu hình GA4 Property ID và Service Account."}
        </p>
        <button
          type="button"
          onClick={onSwitchToIntegrations}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#3E5C46] hover:bg-[#2D4233] text-white text-sm font-bold transition-all shadow-md active:scale-95 cursor-pointer"
        >
          <span>Kết nối ở Tích hợp &amp; Khóa</span>
          <ArrowUpRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  // Calculate SVG line chart coordinates
  const dailyMetrics = data?.dailyMetrics || [];
  const maxUsers = Math.max(...dailyMetrics.map((d) => d.users), 10);
  const chartHeight = 160;
  const chartWidth = 700;

  const points = dailyMetrics.map((d, index) => {
    const x = dailyMetrics.length > 1 ? (index / (dailyMetrics.length - 1)) * chartWidth : chartWidth / 2;
    const y = chartHeight - (d.users / maxUsers) * (chartHeight - 30) - 15;
    return { x, y, ...d };
  });

  const svgPolyline = points.map((p) => `${p.x},${p.y}`).join(" ");

  return (
    <div className="flex flex-col gap-8 w-full">
      {/* Top Header & Range Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-white dark:bg-[#1E2B22] border border-stone-200/80 dark:border-stone-700/60 rounded-2xl shadow-sm">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-xs font-bold text-[#3E5C46] dark:text-[#9DC183] uppercase tracking-wider">
            <TrendingUp className="w-4 h-4" />
            <span>Dữ Liệu Trực Quan Google Analytics 4 (GA4)</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 dark:text-stone-100">
            Báo Cáo Lưu Lượng &amp; Tương Tác
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300">
            Dữ liệu được cập nhật từ Google Analytics Data API (Tự động lưu bộ nhớ đệm 10 phút).
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap self-start md:self-auto">
          {/* Days selector */}
          <div className="inline-flex p-1 bg-stone-100 dark:bg-stone-800 rounded-xl text-xs font-semibold">
            {([7, 28, 90] as const).map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setDays(d)}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  days === d
                    ? "bg-[#3E5C46] text-white shadow-sm font-bold"
                    : "text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white"
                }`}
              >
                {d} ngày
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => fetchAnalytics(days, true)}
            disabled={loading}
            className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-600 dark:text-stone-300 transition-colors cursor-pointer"
            title="Làm mới dữ liệu từ Google"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-[#3E5C46]" : ""}`} />
          </button>
        </div>
      </div>

      {/* 4 Main Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {/* 1. Active Users */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#1E2B22] border border-stone-200/80 dark:border-stone-700/60 shadow-sm flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[12px] text-stone-500 uppercase tracking-wider font-semibold">
                Người Dùng ({days} ngày)
              </span>
              <div className="font-serif text-3xl font-bold text-[#3E5C46] dark:text-[#9DC183] mt-1">
                {loading ? "..." : (data?.overview.totalUsers ?? 0).toLocaleString("vi-VN")}
              </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-[#3E5C46] dark:text-[#9DC183] flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="text-[12px] text-stone-500 mt-3 pt-2 border-t border-stone-100 dark:border-stone-800">
            Truy cập website thực tế
          </div>
        </div>

        {/* 2. Total Sessions */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#1E2B22] border border-stone-200/80 dark:border-stone-700/60 shadow-sm flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[12px] text-stone-500 uppercase tracking-wider font-semibold">
                Phiên Truy Cập
              </span>
              <div className="font-serif text-3xl font-bold text-stone-800 dark:text-stone-100 mt-1">
                {loading ? "..." : (data?.overview.totalSessions ?? 0).toLocaleString("vi-VN")}
              </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="text-[12px] text-stone-500 mt-3 pt-2 border-t border-stone-100 dark:border-stone-800">
            Lượt ghé thăm mở rộng
          </div>
        </div>

        {/* 3. Screen Page Views */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#1E2B22] border border-stone-200/80 dark:border-stone-700/60 shadow-sm flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[12px] text-stone-500 uppercase tracking-wider font-semibold">
                Lượt Xem Trang
              </span>
              <div className="font-serif text-3xl font-bold text-[#CC7755] dark:text-[#E0B872] mt-1">
                {loading ? "..." : (data?.overview.screenPageViews ?? 0).toLocaleString("vi-VN")}
              </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-amber-50 dark:bg-amber-950/40 text-[#CC7755] flex items-center justify-center">
              <Eye className="w-5 h-5" />
            </div>
          </div>
          <div className="text-[12px] text-stone-500 mt-3 pt-2 border-t border-stone-100 dark:border-stone-800">
            Tổng lượt hiển thị các trang
          </div>
        </div>

        {/* 4. Realtime Users */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#1E2B22] border border-stone-200/80 dark:border-stone-700/60 shadow-sm flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[12px] text-stone-500 uppercase tracking-wider font-semibold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Thời Gian Thực (30p)</span>
              </span>
              <div className="font-serif text-3xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                {loading ? "..." : (data?.overview.realtimeUsers ?? 0)}
              </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Radio className="w-5 h-5" />
            </div>
          </div>
          <div className="text-[12px] text-stone-500 mt-3 pt-2 border-t border-stone-100 dark:border-stone-800">
            Khách đang online ngay lúc này
          </div>
        </div>
      </div>

      {/* SVG Interactive Line Chart for Daily Trend */}
      <div className="p-6 bg-white dark:bg-[#1E2B22] border border-stone-200/80 dark:border-stone-700/60 rounded-2xl shadow-sm flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100">
              Xu Hướng Người Dùng Theo Ngày
            </h2>
            <p className="text-xs text-stone-500">Biểu đồ đường trực quan theo chu kỳ {days} ngày qua</p>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold">
            <span className="flex items-center gap-1.5 text-[#3E5C46] dark:text-[#9DC183]">
              <span className="w-3 h-3 rounded-full bg-[#3E5C46]" />
              <span>Người dùng (Active Users)</span>
            </span>
          </div>
        </div>

        {points.length > 0 ? (
          <div className="w-full overflow-x-auto py-2">
            <div className="min-w-[600px] h-[190px] relative">
              <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-full overflow-visible">
                {/* Background grid horizontal lines */}
                <line x1="0" y1="20" x2={chartWidth} y2="20" stroke="currentColor" strokeOpacity="0.08" />
                <line x1="0" y1="80" x2={chartWidth} y2="80" stroke="currentColor" strokeOpacity="0.08" />
                <line x1="0" y1="140" x2={chartWidth} y2="140" stroke="currentColor" strokeOpacity="0.08" />

                {/* Polyline Path */}
                <polyline
                  fill="none"
                  stroke="#3E5C46"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={svgPolyline}
                />

                {/* Data Points */}
                {points.map((p, idx) => (
                  <g key={idx}>
                    <circle
                      cx={p.x}
                      cy={p.y}
                      r="4"
                      className="fill-white dark:fill-[#1E2B22] stroke-[#3E5C46] stroke-2 hover:r-6 transition-all cursor-pointer"
                    >
                      <title>{`${p.date}: ${p.users} người dùng`}</title>
                    </circle>
                    <text
                      x={p.x}
                      y={chartHeight + 16}
                      textAnchor="middle"
                      className="text-[10px] fill-stone-400 font-mono"
                    >
                      {p.date}
                    </text>
                  </g>
                ))}
              </svg>
            </div>
          </div>
        ) : (
          <div className="py-12 text-center text-xs text-stone-400 italic">
            Chưa có đủ điểm dữ liệu theo ngày trong chu kỳ đã chọn.
          </div>
        )}
      </div>

      {/* Business Action Events (Call, Zalo, Directions, Menu) */}
      <div className="p-6 bg-white dark:bg-[#1E2B22] border border-stone-200/80 dark:border-stone-700/60 rounded-2xl shadow-sm flex flex-col gap-4">
        <div>
          <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100">
            Hành Động Khách Hàng Chuyển Đổi (Cẩm Cù Actions)
          </h2>
          <p className="text-xs text-stone-500">
            Ghi nhận tự động từ website qua GA4 &amp; Beacon
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* click_call */}
          <div className="p-4 rounded-xl bg-stone-50 dark:bg-stone-900/50 border border-stone-200/60 dark:border-stone-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-stone-800 dark:text-stone-100">Bấm Gọi Hotline</span>
                <div className="text-[11px] text-stone-400">click_call</div>
              </div>
            </div>
            <span className="font-serif text-2xl font-bold text-[#3E5C46] dark:text-[#9DC183]">
              {data?.events.click_call ?? 0}
            </span>
          </div>

          {/* click_zalo */}
          <div className="p-4 rounded-xl bg-stone-50 dark:bg-stone-900/50 border border-stone-200/60 dark:border-stone-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sky-100 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 flex items-center justify-center shrink-0">
                <ExternalLink className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-stone-800 dark:text-stone-100">Nhắn Tin Zalo</span>
                <div className="text-[11px] text-stone-400">click_zalo</div>
              </div>
            </div>
            <span className="font-serif text-2xl font-bold text-sky-600 dark:text-sky-400">
              {data?.events.click_zalo ?? 0}
            </span>
          </div>

          {/* click_directions */}
          <div className="p-4 rounded-xl bg-stone-50 dark:bg-stone-900/50 border border-stone-200/60 dark:border-stone-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 flex items-center justify-center shrink-0">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-stone-800 dark:text-stone-100">Xem Chỉ Đường</span>
                <div className="text-[11px] text-stone-400">click_directions</div>
              </div>
            </div>
            <span className="font-serif text-2xl font-bold text-[#CC7755]">
              {data?.events.click_directions ?? 0}
            </span>
          </div>

          {/* view_menu */}
          <div className="p-4 rounded-xl bg-stone-50 dark:bg-stone-900/50 border border-stone-200/60 dark:border-stone-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-stone-800 dark:text-stone-100">Xem Thực Đơn</span>
                <div className="text-[11px] text-stone-400">view_menu</div>
              </div>
            </div>
            <span className="font-serif text-2xl font-bold text-purple-700 dark:text-purple-300">
              {data?.events.view_menu ?? 0}
            </span>
          </div>
        </div>
      </div>

      {/* Traffic Sources & Top Pages */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Nguồn truy cập */}
        <div className="p-6 bg-white dark:bg-[#1E2B22] border border-stone-200/80 dark:border-stone-700/60 rounded-2xl shadow-sm flex flex-col gap-4">
          <div>
            <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100">
              Nguồn Truy Cập (Traffic Sources)
            </h2>
            <p className="text-xs text-stone-500">Phân luồng từ Google, trực tiếp, mạng xã hội</p>
          </div>

          {(data?.trafficSources || []).length === 0 ? (
            <div className="text-xs text-stone-400 py-6 text-center italic">Chưa có dữ liệu nguồn</div>
          ) : (
            <div className="flex flex-col divide-y divide-stone-100 dark:divide-stone-800 text-xs">
              {data?.trafficSources.map((s, idx) => (
                <div key={idx} className="py-2.5 flex items-center justify-between">
                  <span className="font-mono text-stone-700 dark:text-stone-300">{s.source}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-stone-500">{s.sessions} phiên</span>
                    <span className="font-bold text-[#3E5C46] dark:text-[#9DC183]">{s.users} khách</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Trang xem nhiều */}
        <div className="p-6 bg-white dark:bg-[#1E2B22] border border-stone-200/80 dark:border-stone-700/60 rounded-2xl shadow-sm flex flex-col gap-4">
          <div>
            <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100">
              Trang Được Xem Nhiều Nhất
            </h2>
            <p className="text-xs text-stone-500">Các trang có lượt tương tác hàng đầu</p>
          </div>

          {(data?.topPages || []).length === 0 ? (
            <div className="text-xs text-stone-400 py-6 text-center italic">Chưa có dữ liệu trang</div>
          ) : (
            <div className="flex flex-col divide-y divide-stone-100 dark:divide-stone-800 text-xs">
              {data?.topPages.map((p, idx) => (
                <div key={idx} className="py-2.5 flex items-center justify-between">
                  <span className="font-mono text-stone-700 dark:text-stone-300 truncate max-w-[220px]">
                    {p.page}
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="text-stone-500">{p.users} khách</span>
                    <span className="font-bold text-[#CC7755]">{p.views} lượt xem</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Devices & Geo Locations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Thiết bị */}
        <div className="p-6 bg-white dark:bg-[#1E2B22] border border-stone-200/80 dark:border-stone-700/60 rounded-2xl shadow-sm flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-[#3E5C46]" />
            <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100">
              Thiết Bị Người Dùng
            </h2>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {(data?.deviceCategories || [
              { device: "mobile", users: 0 },
              { device: "desktop", users: 0 },
              { device: "tablet", users: 0 },
            ]).map((d, i) => (
              <div key={i} className="p-3 bg-stone-50 dark:bg-stone-900 rounded-xl text-center">
                <div className="text-xs font-semibold capitalize text-stone-500">{d.device}</div>
                <div className="font-serif text-xl font-bold text-stone-800 dark:text-stone-100 mt-1">
                  {d.users}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Thành phố / Khu vực */}
        <div className="p-6 bg-white dark:bg-[#1E2B22] border border-stone-200/80 dark:border-stone-700/60 rounded-2xl shadow-sm flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-[#3E5C46]" />
            <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100">
              Vị Trí Địa Lý (Thành Phố)
            </h2>
          </div>

          {(data?.geoCities || []).length === 0 ? (
            <div className="text-xs text-stone-400 py-4 text-center italic">Chưa có dữ liệu địa phương</div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {data?.geoCities.map((c, i) => (
                <div
                  key={i}
                  className="px-3 py-1.5 rounded-lg bg-stone-50 dark:bg-stone-900 text-xs border border-stone-200/60 dark:border-stone-800 flex items-center gap-1.5"
                >
                  <span className="font-semibold text-stone-700 dark:text-stone-300">{c.city}</span>
                  <span className="text-[10px] text-stone-400">({c.users} khách)</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
