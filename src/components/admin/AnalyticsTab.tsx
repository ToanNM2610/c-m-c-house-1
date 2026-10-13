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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [days]);

  // If not connected, show clean Empty State with icon + text and >=44px button
  if (!loading && data && !data.connected) {
    return (
      <div className="admin-card flex flex-col items-center justify-center p-8 sm:p-14 text-center max-w-2xl mx-auto my-8">
        <div className="w-16 h-16 rounded-2xl admin-icon-circle flex items-center justify-center mb-5">
          <AlertCircle className="w-8 h-8 text-[var(--accent)]" />
        </div>
        <h1 className="admin-h1 font-serif text-[var(--text)] mb-3">
          Chưa Kết Nối Google Analytics 4
        </h1>
        <p className="admin-body text-[var(--text-muted)] leading-relaxed mb-6 max-w-md">
          {data.error ||
            "Để hiển thị lưu lượng truy cập thực tế, biểu đồ người dùng và các sự kiện bấm Gọi / Chỉ đường, vui lòng cấu hình GA4 Property ID và Service Account."}
        </p>
        <button
          type="button"
          onClick={onSwitchToIntegrations}
          className="min-h-[44px] inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--btn-primary)] text-[var(--btn-primary-text)] text-[15px] font-bold transition-all shadow-sm hover:opacity-95 active:scale-95 cursor-pointer"
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
    <div className="flex flex-col gap-6 w-full max-w-[1200px] mx-auto">
      {/* Top Header & Range Filters */}
      <div className="admin-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1 min-w-0">
          <div className="flex items-center gap-2 text-[12px] font-bold text-[var(--accent)] uppercase tracking-wider">
            <TrendingUp className="w-4 h-4 shrink-0" />
            <span className="truncate">Dữ Liệu Trực Quan Google Analytics 4 (GA4)</span>
          </div>
          <h1 className="admin-h1 font-serif text-[var(--text)]">
            Báo Cáo Lưu Lượng &amp; Tương Tác
          </h1>
          <p className="admin-subtle">
            Dữ liệu được cập nhật từ Google Analytics Data API (Tự động lưu bộ nhớ đệm 10 phút).
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap self-start md:self-auto shrink-0">
          {/* Days selector with >=44px touch targets */}
          <div className="inline-flex p-1 bg-[var(--surface-2)] border border-[var(--border)] rounded-xl text-[13px] font-semibold">
            {([7, 28, 90] as const).map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setDays(d)}
                className={`min-h-[44px] min-w-[44px] px-3.5 py-2 rounded-lg transition-all cursor-pointer flex items-center justify-center ${
                  days === d
                    ? "bg-[var(--btn-primary)] text-[var(--btn-primary-text)] font-bold shadow-sm"
                    : "text-[var(--text-muted)] hover:text-[var(--text)]"
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
            className="w-11 h-11 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] hover:bg-[var(--border)] text-[var(--text)] transition-colors cursor-pointer flex items-center justify-center shrink-0"
            title="Làm mới dữ liệu từ Google"
            aria-label="Làm mới dữ liệu từ Google"
          >
            <RefreshCw className={`w-4 h-4 text-[var(--accent)] ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* 4 Main Overview Cards - Equal height, single accent icon circle, lining numbers */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {/* 1. Active Users */}
        <div className="admin-card p-5 h-full flex flex-col justify-between">
          <div className="flex items-start justify-between gap-3">
            <div className="flex flex-col min-w-0">
              <span className="admin-label truncate block">
                Người dùng ({days} ngày)
              </span>
              <div className="kpi-stat-value text-[var(--text)] mt-1">
                {loading ? "..." : (data?.overview.totalUsers ?? 0).toLocaleString("vi-VN")}
              </div>
            </div>
            <div className="w-10 h-10 rounded-full admin-icon-circle flex items-center justify-center shrink-0">
              <Users className="w-5 h-5 text-[var(--accent)]" />
            </div>
          </div>
          <div className="admin-subtle mt-4 pt-3 border-t border-[var(--border)]">
            Truy cập website thực tế
          </div>
        </div>

        {/* 2. Total Sessions */}
        <div className="admin-card p-5 h-full flex flex-col justify-between">
          <div className="flex items-start justify-between gap-3">
            <div className="flex flex-col min-w-0">
              <span className="admin-label truncate block">
                Phiên truy cập
              </span>
              <div className="kpi-stat-value text-[var(--text)] mt-1">
                {loading ? "..." : (data?.overview.totalSessions ?? 0).toLocaleString("vi-VN")}
              </div>
            </div>
            <div className="w-10 h-10 rounded-full admin-icon-circle flex items-center justify-center shrink-0">
              <TrendingUp className="w-5 h-5 text-[var(--accent)]" />
            </div>
          </div>
          <div className="admin-subtle mt-4 pt-3 border-t border-[var(--border)]">
            Lượt ghé thăm mở rộng
          </div>
        </div>

        {/* 3. Screen Page Views */}
        <div className="admin-card p-5 h-full flex flex-col justify-between">
          <div className="flex items-start justify-between gap-3">
            <div className="flex flex-col min-w-0">
              <span className="admin-label truncate block">
                Lượt xem trang
              </span>
              <div className="kpi-stat-value text-[var(--text)] mt-1">
                {loading ? "..." : (data?.overview.screenPageViews ?? 0).toLocaleString("vi-VN")}
              </div>
            </div>
            <div className="w-10 h-10 rounded-full admin-icon-circle flex items-center justify-center shrink-0">
              <Eye className="w-5 h-5 text-[var(--accent)]" />
            </div>
          </div>
          <div className="admin-subtle mt-4 pt-3 border-t border-[var(--border)]">
            Tổng lượt hiển thị các trang
          </div>
        </div>

        {/* 4. Realtime Users */}
        <div className="admin-card p-5 h-full flex flex-col justify-between">
          <div className="flex items-start justify-between gap-3">
            <div className="flex flex-col min-w-0">
              <span className="admin-label truncate block flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[var(--success)] animate-pulse inline-block" />
                <span>Trực tiếp (30p)</span>
              </span>
              <div className="kpi-stat-value text-[var(--success)] mt-1">
                {loading ? "..." : (data?.overview.realtimeUsers ?? 0)}
              </div>
            </div>
            <div className="w-10 h-10 rounded-full admin-icon-circle flex items-center justify-center shrink-0">
              <Radio className="w-5 h-5 text-[var(--accent)]" />
            </div>
          </div>
          <div className="admin-subtle mt-4 pt-3 border-t border-[var(--border)]">
            Khách đang online ngay lúc này
          </div>
        </div>
      </div>

      {/* SVG Interactive Line Chart for Daily Trend */}
      <div className="admin-card p-6 flex flex-col gap-4">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h2 className="admin-h2 font-serif text-[var(--text)]">
              Xu Hướng Người Dùng Theo Ngày
            </h2>
            <p className="admin-subtle mt-0.5">Biểu đồ đường trực quan theo chu kỳ {days} ngày qua</p>
          </div>
          <div className="flex items-center gap-2 text-[13px] font-semibold text-[var(--accent)]">
            <span className="w-3 h-3 rounded-full bg-[var(--accent)]" />
            <span>Người dùng (Active Users)</span>
          </div>
        </div>

        {points.length > 0 ? (
          <div className="w-full overflow-x-auto py-2">
            <div className="min-w-[600px] h-[190px] relative">
              <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-full overflow-visible">
                {/* Background grid horizontal lines */}
                <line x1="0" y1="20" x2={chartWidth} y2="20" stroke="currentColor" strokeOpacity="0.12" />
                <line x1="0" y1="80" x2={chartWidth} y2="80" stroke="currentColor" strokeOpacity="0.12" />
                <line x1="0" y1="140" x2={chartWidth} y2="140" stroke="currentColor" strokeOpacity="0.12" />

                {/* Polyline Path */}
                <polyline
                  fill="none"
                  stroke="var(--accent)"
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
                      className="fill-[var(--surface)] stroke-[var(--accent)] stroke-2 hover:r-6 transition-all cursor-pointer"
                    >
                      <title>{`${p.date}: ${p.users} người dùng`}</title>
                    </circle>
                    <text
                      x={p.x}
                      y={chartHeight + 16}
                      textAnchor="middle"
                      className="text-[11px] fill-[var(--text-subtle)] font-mono"
                    >
                      {p.date}
                    </text>
                  </g>
                ))}
              </svg>
            </div>
          </div>
        ) : (
          <div className="py-12 text-center admin-subtle italic">
            Chưa có đủ điểm dữ liệu theo ngày trong chu kỳ đã chọn.
          </div>
        )}
      </div>

      {/* Business Action Events (Call, Zalo, Directions, Menu) - All single accent icon circle */}
      <div className="admin-card p-6 flex flex-col gap-4">
        <div>
          <h2 className="admin-h2 font-serif text-[var(--text)]">
            Hành Động Khách Hàng Chuyển Đổi (Cẩm Cù Actions)
          </h2>
          <p className="admin-subtle mt-0.5">
            Ghi nhận tự động từ website qua GA4 &amp; Beacon
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* click_call */}
          <div className="p-4 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl admin-icon-circle flex items-center justify-center shrink-0">
                <Phone className="w-5 h-5 text-[var(--accent)]" />
              </div>
              <div className="min-w-0">
                <span className="text-[13px] font-bold text-[var(--text)] block truncate">Bấm Gọi Hotline</span>
                <div className="admin-subtle font-mono text-[11px]">click_call</div>
              </div>
            </div>
            <span className="kpi-stat-value text-2xl text-[var(--accent)] ml-2 shrink-0">
              {data?.events.click_call ?? 0}
            </span>
          </div>

          {/* click_zalo */}
          <div className="p-4 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl admin-icon-circle flex items-center justify-center shrink-0">
                <ExternalLink className="w-5 h-5 text-[var(--accent)]" />
              </div>
              <div className="min-w-0">
                <span className="text-[13px] font-bold text-[var(--text)] block truncate">Nhắn Tin Zalo</span>
                <div className="admin-subtle font-mono text-[11px]">click_zalo</div>
              </div>
            </div>
            <span className="kpi-stat-value text-2xl text-[var(--text)] ml-2 shrink-0">
              {data?.events.click_zalo ?? 0}
            </span>
          </div>

          {/* click_directions */}
          <div className="p-4 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl admin-icon-circle flex items-center justify-center shrink-0">
                <Compass className="w-5 h-5 text-[var(--accent)]" />
              </div>
              <div className="min-w-0">
                <span className="text-[13px] font-bold text-[var(--text)] block truncate">Xem Chỉ Đường</span>
                <div className="admin-subtle font-mono text-[11px]">click_directions</div>
              </div>
            </div>
            <span className="kpi-stat-value text-2xl text-[var(--clay)] ml-2 shrink-0">
              {data?.events.click_directions ?? 0}
            </span>
          </div>

          {/* view_menu */}
          <div className="p-4 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl admin-icon-circle flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5 text-[var(--accent)]" />
              </div>
              <div className="min-w-0">
                <span className="text-[13px] font-bold text-[var(--text)] block truncate">Xem Thực Đơn</span>
                <div className="admin-subtle font-mono text-[11px]">view_menu</div>
              </div>
            </div>
            <span className="kpi-stat-value text-2xl text-[var(--text)] ml-2 shrink-0">
              {data?.events.view_menu ?? 0}
            </span>
          </div>
        </div>
      </div>

      {/* Traffic Sources & Top Pages */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Nguồn truy cập */}
        <div className="admin-card p-6 flex flex-col gap-4">
          <div>
            <h2 className="admin-h2 font-serif text-[var(--text)]">
              Nguồn Truy Cập (Traffic Sources)
            </h2>
            <p className="admin-subtle mt-0.5">Phân luồng từ Google, trực tiếp, mạng xã hội</p>
          </div>

          {(data?.trafficSources || []).length === 0 ? (
            <div className="admin-subtle py-6 text-center italic">Chưa có dữ liệu nguồn</div>
          ) : (
            <div className="flex flex-col divide-y divide-[var(--border)] text-[13px]">
              {data?.trafficSources.map((s, idx) => (
                <div key={idx} className="py-2.5 flex items-center justify-between">
                  <span className="font-mono text-[var(--text)]">{s.source}</span>
                  <div className="flex items-center gap-3">
                    <span className="admin-subtle">{s.sessions} phiên</span>
                    <span className="font-bold text-[var(--accent)]">{s.users} khách</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Trang xem nhiều */}
        <div className="admin-card p-6 flex flex-col gap-4">
          <div>
            <h2 className="admin-h2 font-serif text-[var(--text)]">
              Trang Được Xem Nhiều Nhất
            </h2>
            <p className="admin-subtle mt-0.5">Các trang có lượt tương tác hàng đầu</p>
          </div>

          {(data?.topPages || []).length === 0 ? (
            <div className="admin-subtle py-6 text-center italic">Chưa có dữ liệu trang</div>
          ) : (
            <div className="flex flex-col divide-y divide-[var(--border)] text-[13px]">
              {data?.topPages.map((p, idx) => (
                <div key={idx} className="py-2.5 flex items-center justify-between">
                  <span className="font-mono text-[var(--text)] truncate max-w-[220px]">
                    {p.page}
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="admin-subtle">{p.users} khách</span>
                    <span className="font-bold text-[var(--clay)]">{p.views} lượt xem</span>
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
        <div className="admin-card p-6 flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-[var(--accent)]" />
            <h2 className="admin-h2 font-serif text-[var(--text)]">
              Thiết Bị Người Dùng
            </h2>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {(data?.deviceCategories || [
              { device: "mobile", users: 0 },
              { device: "desktop", users: 0 },
              { device: "tablet", users: 0 },
            ]).map((d, i) => (
              <div key={i} className="p-3 bg-[var(--surface-2)] border border-[var(--border)] rounded-xl text-center">
                <div className="admin-label capitalize">{d.device}</div>
                <div className="kpi-stat-value text-xl text-[var(--text)] mt-1">
                  {d.users}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Thành phố / Khu vực */}
        <div className="admin-card p-6 flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-[var(--accent)]" />
            <h2 className="admin-h2 font-serif text-[var(--text)]">
              Vị Trí Địa Lý (Thành Phố)
            </h2>
          </div>

          {(data?.geoCities || []).length === 0 ? (
            <div className="admin-subtle py-4 text-center italic">Chưa có dữ liệu địa phương</div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {data?.geoCities.map((c, i) => (
                <div
                  key={i}
                  className="px-3 py-1.5 rounded-lg bg-[var(--surface-2)] text-[13px] border border-[var(--border)] flex items-center gap-1.5"
                >
                  <span className="font-semibold text-[var(--text)]">{c.city}</span>
                  <span className="admin-subtle text-[12px]">({c.users} khách)</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
