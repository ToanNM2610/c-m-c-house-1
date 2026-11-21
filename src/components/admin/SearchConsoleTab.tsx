"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  MousePointerClick,
  Eye,
  Percent,
  Hash,
  RefreshCw,
  Send,
  CheckCircle2,
  ArrowUpRight,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import { SearchConsoleReportData } from "@/lib/google-apis";

interface Props {
  onSwitchToIntegrations: () => void;
  onShowToast: (msg: string) => void;
}

export default function SearchConsoleTab({ onSwitchToIntegrations, onShowToast }: Props) {
  const [days, setDays] = useState<7 | 28 | 90>(7);
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<SearchConsoleReportData | null>(null);
  const [submittingSitemap, setSubmittingSitemap] = useState<boolean>(false);

  const fetchSearchConsole = async (selectedDays: number, refresh = false) => {
    try {
      setLoading(true);
      const url = `/api/admin/search-console?days=${selectedDays}${refresh ? "&refresh=1" : ""}`;
      const res = await fetch(url, { credentials: "include" });
      const json = await res.json();
      if (json.success && json.data) {
        setData(json.data);
      } else {
        onShowToast(json.error || "Không thể tải dữ liệu Search Console");
      }
    } catch {
      onShowToast("Lỗi kết nối khi tải Google Search Console");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSearchConsole(days);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [days]);

  const handleSubmitSitemap = async () => {
    try {
      setSubmittingSitemap(true);
      const res = await fetch("/api/admin/search-console/submit-sitemap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ sitemapUrl: "https://camcuhouse.online/sitemap.xml" }),
      });
      const json = await res.json();
      if (json.success) {
        onShowToast(json.message || "Đã gửi sitemap thành công lên Google!");
      } else {
        onShowToast(json.message || "Không thể gửi sitemap đến Google.");
      }
    } catch {
      onShowToast("Lỗi kết nối khi gửi sitemap");
    } finally {
      setSubmittingSitemap(false);
    }
  };

  // 1. If tracking/verification IDs ARE configured, but Service Account JSON is missing/empty:
  if (!loading && data && !data.connected && data.trackingActive && !data.hasServiceAccount) {
    const scUrl = data.dashboardUrl || "https://search.google.com/search-console?resource_id=https%3A%2F%2Fcamcuhouse.online%2F";
    const gaUrl = "https://analytics.google.com/analytics/web/#/p552993380/reports/intelligenthome";
    const property = data.property || "https://camcuhouse.online/";

    return (
      <div className="flex flex-col gap-6 w-full max-w-[1000px] mx-auto my-6">
        <div className="p-8 sm:p-12 rounded-2xl bg-gradient-to-br from-emerald-950/70 via-slate-900 to-slate-900 border border-emerald-500/30 shadow-2xl text-center flex flex-col items-center">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mb-5 text-emerald-400">
            <CheckCircle2 className="w-8 h-8 text-emerald-400" />
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-semibold mb-4">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>ĐÃ KẾT NỐI ĐO LƯỜNG (TRACKING ACTIVE)</span>
          </div>

          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white mb-3">
            Google Search Console Đang Hoạt Động
          </h2>

          <p className="text-slate-300 text-sm max-w-xl leading-relaxed mb-6">
            Thẻ xác minh quyền sở hữu trang web đã được tích hợp trực tiếp trong SSR &lt;head&gt;. Google Search Console đang tự động theo dõi thứ hạng tìm kiếm, lượt hiển thị và lập chỉ mục website Cẩm Cù House.
          </p>

          {/* Details Pill Box */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg mb-8 text-left">
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <span className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1">
                Tài sản (Property):
              </span>
              <span className="text-sm font-mono font-bold text-emerald-400 truncate block">
                {property}
              </span>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <span className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1">
                Trạng thái xác minh:
              </span>
              <span className="text-sm font-mono font-bold text-emerald-400 truncate block">
                Đã xác minh (HTML Tag)
              </span>
            </div>
          </div>

          {/* Direct Primary Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-md">
            <a
              href={scUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="min-h-[44px] w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-[15px] font-bold transition-all shadow-lg active:scale-95"
            >
              <span>Mở Google Search Console</span>
              <ExternalLink className="w-4 h-4" />
            </a>
            <a
              href={gaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="min-h-[44px] w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-emerald-500/30 text-[15px] font-semibold transition-all shadow-md active:scale-95"
            >
              <span>Mở Google Analytics 4</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          {/* Small Optional Note */}
          <div className="mt-8 pt-6 border-t border-slate-800 w-full max-w-lg text-center">
            <p className="text-xs text-slate-400 leading-relaxed mb-2">
              Muốn nhúng biểu đồ trực tiếp ngay tại đây? Thêm Google Service Account JSON trong mục Tích hợp &amp; Khóa.
            </p>
            <button
              type="button"
              onClick={onSwitchToIntegrations}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300 underline underline-offset-4 cursor-pointer"
            >
              <span>Mở tab Tích hợp &amp; Khóa để thêm Service Account</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 2. If Service Account JSON IS present, but auth or API query failed:
  if (!loading && data && !data.connected && data.hasServiceAccount) {
    const scUrl = data.dashboardUrl || "https://search.google.com/search-console?resource_id=https%3A%2F%2Fcamcuhouse.online%2F";

    return (
      <div className="admin-card flex flex-col items-center justify-center p-8 sm:p-14 text-center max-w-2xl mx-auto my-8">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mb-5 text-amber-500">
          <AlertCircle className="w-8 h-8 text-amber-500" />
        </div>
        <h1 className="admin-h1 font-serif text-[var(--text)] mb-3">
          Không Thể Tải Dữ Liệu Google Search Console
        </h1>
        <p className="admin-body text-[var(--text-muted)] leading-relaxed mb-4 max-w-md">
          Hệ thống phát hiện Service Account JSON nhưng Google API từ chối quyền truy cập hoặc tài khoản chưa được phân quyền Owner/Full trong Search Console property.
        </p>

        {/* Exact Google API error message */}
        <div className="w-full max-w-lg p-4 mb-6 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs font-mono text-left break-words">
          <span className="font-bold block text-red-400 mb-1">Chi tiết lỗi từ Google API:</span>
          {data.error}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full">
          <a
            href={scUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="min-h-[44px] inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-[15px] font-bold transition-all shadow-md active:scale-95"
          >
            <span>Mở Google Search Console</span>
            <ExternalLink className="w-4 h-4" />
          </a>
          <button
            type="button"
            onClick={onSwitchToIntegrations}
            className="min-h-[44px] inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[var(--btn-primary)] text-[var(--btn-primary-text)] text-[15px] font-bold transition-all shadow-sm hover:opacity-95 active:scale-95 cursor-pointer"
          >
            <span>Kiểm tra ở Tích hợp &amp; Khóa</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // 3. Fallback: Completely unconfigured
  if (!loading && data && !data.connected) {
    return (
      <div className="admin-card flex flex-col items-center justify-center p-8 sm:p-14 text-center max-w-2xl mx-auto my-8">
        <div className="w-16 h-16 rounded-2xl admin-icon-circle flex items-center justify-center mb-5">
          <Search className="w-8 h-8 text-[var(--accent)]" />
        </div>
        <h1 className="admin-h1 font-serif text-[var(--text)] mb-3">
          Chưa Cấu Hình Google Search Console
        </h1>
        <p className="admin-body text-[var(--text-muted)] leading-relaxed mb-6 max-w-md">
          {data.error ||
            "Để theo dõi từ khóa tìm kiếm, lượt nhấp tự nhiên từ Google và trạng thái lập chỉ mục sitemap, vui lòng cấu hình mã xác minh google-site-verification hoặc kết nối Service Account."}
        </p>
        <button
          type="button"
          onClick={onSwitchToIntegrations}
          className="min-h-[44px] inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--btn-primary)] text-[var(--btn-primary-text)] text-[15px] font-bold transition-all shadow-sm hover:opacity-95 active:scale-95 cursor-pointer"
        >
          <span>Cấu hình ở Tích hợp &amp; Khóa</span>
          <ArrowUpRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  // Calculate SVG line chart coordinates for clicks
  const dailyMetrics = data?.dailyMetrics || [];
  const maxClicks = Math.max(...dailyMetrics.map((d) => d.clicks), 5);
  const chartHeight = 160;
  const chartWidth = 700;

  const points = dailyMetrics.map((d, index) => {
    const x = dailyMetrics.length > 1 ? (index / (dailyMetrics.length - 1)) * chartWidth : chartWidth / 2;
    const y = chartHeight - (d.clicks / maxClicks) * (chartHeight - 30) - 15;
    return { x, y, ...d };
  });

  const svgPolyline = points.map((p) => `${p.x},${p.y}`).join(" ");

  return (
    <div className="flex flex-col gap-6 w-full max-w-[1200px] mx-auto">
      {/* Top Header & Range Filters */}
      <div className="admin-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1 min-w-0">
          <div className="flex items-center gap-2 text-[12px] font-bold text-[var(--accent)] uppercase tracking-wider">
            <Search className="w-4 h-4 shrink-0" />
            <span className="truncate">Google Search Console (GSC) API</span>
          </div>
          <h1 className="admin-h1 font-serif text-[var(--text)]">
            Hiệu Suất Tìm Kiếm Tự Nhiên
          </h1>
          <p className="admin-subtle">
            Property: <code className="px-1.5 py-0.5 rounded bg-[var(--surface-2)] border border-[var(--border)] font-mono text-[var(--accent)] font-bold">{data?.property || "sc-domain:camcuhouse.online"}</code>
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

          <a
            href={data?.dashboardUrl || "https://search.google.com/search-console?resource_id=https%3A%2F%2Fcamcuhouse.online%2F"}
            target="_blank"
            rel="noopener noreferrer"
            className="min-h-[44px] inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-600/15 hover:bg-emerald-600/25 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-semibold transition-all shrink-0"
            title="Mở Google Search Console trên trang chủ Google"
          >
            <span>Mở GSC</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <button
            type="button"
            onClick={handleSubmitSitemap}
            disabled={submittingSitemap}
            className="min-h-[44px] inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--surface-2)] hover:bg-[var(--border)] border border-[var(--border)] text-[var(--text)] text-[13px] font-semibold transition-all cursor-pointer"
          >
            <Send className={`w-3.5 h-3.5 text-[var(--accent)] ${submittingSitemap ? "animate-pulse" : ""}`} />
            <span>{submittingSitemap ? "Đang gửi..." : "Gửi sitemap.xml"}</span>
          </button>

          <button
            type="button"
            onClick={() => fetchSearchConsole(days, true)}
            disabled={loading}
            className="w-11 h-11 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] hover:bg-[var(--border)] text-[var(--text)] transition-colors cursor-pointer flex items-center justify-center shrink-0"
            title="Làm mới dữ liệu từ Google"
            aria-label="Làm mới dữ liệu từ Google"
          >
            <RefreshCw className={`w-4 h-4 text-[var(--accent)] ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* 4 Performance Metric Cards - Equal height, single accent icon circle, lining numbers */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {/* 1. Total Clicks */}
        <div className="admin-card p-5 h-full flex flex-col justify-between">
          <div className="flex items-start justify-between gap-3">
            <div className="flex flex-col min-w-0">
              <span className="admin-label truncate block">
                Tổng Lượt Nhấp
              </span>
              <div className="kpi-stat-value text-[var(--accent)] mt-1">
                {loading ? "..." : (data?.overview.totalClicks ?? 0).toLocaleString("vi-VN")}
              </div>
            </div>
            <div className="w-10 h-10 rounded-full admin-icon-circle flex items-center justify-center shrink-0">
              <MousePointerClick className="w-5 h-5 text-[var(--accent)]" />
            </div>
          </div>
          <div className="admin-subtle mt-4 pt-3 border-t border-[var(--border)]">
            Khách nhấp vào kết quả Google
          </div>
        </div>

        {/* 2. Total Impressions */}
        <div className="admin-card p-5 h-full flex flex-col justify-between">
          <div className="flex items-start justify-between gap-3">
            <div className="flex flex-col min-w-0">
              <span className="admin-label truncate block">
                Lượt Hiển Thị
              </span>
              <div className="kpi-stat-value text-[var(--text)] mt-1">
                {loading ? "..." : (data?.overview.totalImpressions ?? 0).toLocaleString("vi-VN")}
              </div>
            </div>
            <div className="w-10 h-10 rounded-full admin-icon-circle flex items-center justify-center shrink-0">
              <Eye className="w-5 h-5 text-[var(--accent)]" />
            </div>
          </div>
          <div className="admin-subtle mt-4 pt-3 border-t border-[var(--border)]">
            Số lần quán xuất hiện trên tìm kiếm
          </div>
        </div>

        {/* 3. Average CTR */}
        <div className="admin-card p-5 h-full flex flex-col justify-between">
          <div className="flex items-start justify-between gap-3">
            <div className="flex flex-col min-w-0">
              <span className="admin-label truncate block">
                CTR Trung Bình
              </span>
              <div className="kpi-stat-value text-[var(--clay)] mt-1">
                {loading ? "..." : `${data?.overview.averageCtr ?? 0}%`}
              </div>
            </div>
            <div className="w-10 h-10 rounded-full admin-icon-circle flex items-center justify-center shrink-0">
              <Percent className="w-5 h-5 text-[var(--accent)]" />
            </div>
          </div>
          <div className="admin-subtle mt-4 pt-3 border-t border-[var(--border)]">
            Tỷ lệ nhấp trên hiển thị
          </div>
        </div>

        {/* 4. Average Position */}
        <div className="admin-card p-5 h-full flex flex-col justify-between">
          <div className="flex items-start justify-between gap-3">
            <div className="flex flex-col min-w-0">
              <span className="admin-label truncate block">
                Vị Trí Trung Bình
              </span>
              <div className="kpi-stat-value text-[var(--text)] mt-1">
                {loading ? "..." : `#${data?.overview.averagePosition ?? 0}`}
              </div>
            </div>
            <div className="w-10 h-10 rounded-full admin-icon-circle flex items-center justify-center shrink-0">
              <Hash className="w-5 h-5 text-[var(--accent)]" />
            </div>
          </div>
          <div className="admin-subtle mt-4 pt-3 border-t border-[var(--border)]">
            Thứ hạng trên trang kết quả Google
          </div>
        </div>
      </div>

      {/* SVG Performance Chart */}
      <div className="admin-card p-6 flex flex-col gap-4">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h2 className="admin-h2 font-serif text-[var(--text)]">
              Lượt Nhấp Từ Google Tìm Kiếm
            </h2>
            <p className="admin-subtle mt-0.5">Biểu đồ thể hiện lượt click theo ngày</p>
          </div>
          <span className="flex items-center gap-2 text-[13px] font-semibold text-[var(--accent)]">
            <span className="w-3 h-3 rounded-full bg-[var(--accent)]" />
            <span>Lượt nhấp tự nhiên (Organic Clicks)</span>
          </span>
        </div>

        {points.length > 0 ? (
          <div className="w-full overflow-x-auto py-2">
            <div className="min-w-[600px] h-[190px] relative">
              <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-full overflow-visible">
                <line x1="0" y1="20" x2={chartWidth} y2="20" stroke="currentColor" strokeOpacity="0.12" />
                <line x1="0" y1="80" x2={chartWidth} y2="80" stroke="currentColor" strokeOpacity="0.12" />
                <line x1="0" y1="140" x2={chartWidth} y2="140" stroke="currentColor" strokeOpacity="0.12" />

                <polyline
                  fill="none"
                  stroke="var(--accent)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={svgPolyline}
                />

                {points.map((p, idx) => (
                  <g key={idx}>
                    <circle
                      cx={p.x}
                      cy={p.y}
                      r="4"
                      className="fill-[var(--surface)] stroke-[var(--accent)] stroke-2 hover:r-6 transition-all cursor-pointer"
                    >
                      <title>{`${p.date}: ${p.clicks} clicks`}</title>
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
            Chưa có đủ lượt nhấp theo ngày trong chu kỳ.
          </div>
        )}
      </div>

      {/* Top Search Queries Table */}
      <div className="admin-card p-6 flex flex-col gap-4">
        <div>
          <h2 className="admin-h2 font-serif text-[var(--text)]">
            Top Từ Khóa Tìm Kiếm (Top Queries)
          </h2>
          <p className="admin-subtle mt-0.5">Các cụm từ người dùng tìm kiếm để tìm thấy Cẩm Cù House</p>
        </div>

        {(data?.topQueries || []).length === 0 ? (
          <div className="admin-subtle py-6 text-center italic">
            Chưa có dữ liệu từ khóa trong khoảng thời gian này.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-[var(--border)]">
            <table className="w-full text-left text-[13px]">
              <thead className="bg-[var(--surface-2)] text-[var(--text-muted)] font-semibold border-b border-[var(--border)]">
                <tr>
                  <th className="py-3 px-4">Cụm từ tìm kiếm</th>
                  <th className="py-3 px-4 text-right">Lượt nhấp</th>
                  <th className="py-3 px-4 text-right">Lượt hiển thị</th>
                  <th className="py-3 px-4 text-right">CTR</th>
                  <th className="py-3 px-4 text-right">Vị trí trung bình</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)] text-[var(--text)]">
                {data?.topQueries.map((q, idx) => (
                  <tr key={idx} className="hover:bg-[var(--surface-2)] transition-colors">
                    <td className="py-3 px-4 font-semibold text-[var(--text)]">{q.query}</td>
                    <td className="py-3 px-4 text-right font-bold text-[var(--accent)] font-mono">{q.clicks}</td>
                    <td className="py-3 px-4 text-right font-mono text-[var(--text-muted)]">{q.impressions}</td>
                    <td className="py-3 px-4 text-right font-mono text-[var(--text-muted)]">{q.ctr}%</td>
                    <td className="py-3 px-4 text-right font-mono text-[var(--text-muted)]">#{q.position}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* URL Inspection for 5 Main Pages */}
      <div className="admin-card p-6 flex flex-col gap-4">
        <div>
          <h2 className="admin-h2 font-serif text-[var(--text)]">
            Trạng Thái Lập Chỉ Mục 5 Trang Chính (URL Inspection API)
          </h2>
          <p className="admin-subtle mt-0.5">Kiểm tra trực tiếp độ phủ và trạng thái xuất hiện trên Google</p>
        </div>

        <div className="divide-y divide-[var(--border)] text-[13px]">
          {(data?.urlInspections || []).map((item, idx) => (
            <div key={idx} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2.5 min-w-0">
                <CheckCircle2 className="w-4 h-4 text-[var(--success)] shrink-0" />
                <span className="font-mono text-[var(--text)] truncate">{item.url}</span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[rgba(127,209,155,0.15)] text-[var(--success)] font-semibold text-[12px] border border-[var(--border)]">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{item.coverageState}</span>
                </span>
                <span className="text-[11px] admin-subtle font-mono">Google Verified</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
