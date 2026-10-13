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
  AlertCircle,
  ExternalLink,
  ArrowUpRight,
  Globe,
  Smartphone,
  Check,
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
      const res = await fetch(url);
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
  }, [days]);

  const handleSubmitSitemap = async () => {
    try {
      setSubmittingSitemap(true);
      const res = await fetch("/api/admin/search-console/submit-sitemap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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

  // If not connected, show clean Empty State as requested
  if (!loading && data && !data.connected) {
    return (
      <div className="flex flex-col items-center justify-center p-8 sm:p-14 bg-white dark:bg-[#1E2B22] border border-stone-200/80 dark:border-stone-700/60 rounded-3xl shadow-sm text-center max-w-2xl mx-auto my-8">
        <div className="w-16 h-16 rounded-3xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-5 shadow-sm border border-blue-200 dark:border-blue-800">
          <Search className="w-8 h-8" />
        </div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 dark:text-stone-100 mb-3">
          Chưa Kết Nối Google Search Console
        </h1>
        <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed mb-6 max-w-md">
          {data.error ||
            "Để theo dõi từ khóa tìm kiếm, lượt nhấp tự nhiên từ Google và trạng thái lập chỉ mục sitemap, vui lòng kết nối Service Account và cấu hình Property."}
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
    <div className="flex flex-col gap-8 w-full">
      {/* Top Header & Range Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-white dark:bg-[#1E2B22] border border-stone-200/80 dark:border-stone-700/60 rounded-2xl shadow-sm">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-xs font-bold text-[#3E5C46] dark:text-[#9DC183] uppercase tracking-wider">
            <Search className="w-4 h-4" />
            <span>Google Search Console (GSC) API</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 dark:text-stone-100">
            Hiệu Suất Tìm Kiếm Tự Nhiên
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300">
            Property: <code className="px-1.5 py-0.5 rounded bg-stone-100 dark:bg-stone-800 font-mono text-[#3E5C46] dark:text-[#9DC183]">{data?.property || "sc-domain:camcuhouse.online"}</code>
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
            onClick={handleSubmitSitemap}
            disabled={submittingSitemap}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/40 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 text-xs font-semibold transition-all cursor-pointer border border-blue-200 dark:border-blue-800"
          >
            <Send className={`w-3.5 h-3.5 ${submittingSitemap ? "animate-pulse" : ""}`} />
            <span>{submittingSitemap ? "Đang gửi..." : "Gửi sitemap.xml"}</span>
          </button>

          <button
            type="button"
            onClick={() => fetchSearchConsole(days, true)}
            disabled={loading}
            className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-600 dark:text-stone-300 transition-colors cursor-pointer"
            title="Làm mới dữ liệu từ Google"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-[#3E5C46]" : ""}`} />
          </button>
        </div>
      </div>

      {/* 4 Performance Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {/* 1. Total Clicks */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#1E2B22] border border-stone-200/80 dark:border-stone-700/60 shadow-sm flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[12px] text-stone-500 uppercase tracking-wider font-semibold">
                Tổng Lượt Nhấp
              </span>
              <div className="font-serif text-3xl font-bold text-[#3E5C46] dark:text-[#9DC183] mt-1">
                {loading ? "..." : (data?.overview.totalClicks ?? 0).toLocaleString("vi-VN")}
              </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-[#3E5C46] flex items-center justify-center">
              <MousePointerClick className="w-5 h-5" />
            </div>
          </div>
          <div className="text-[12px] text-stone-500 mt-3 pt-2 border-t border-stone-100 dark:border-stone-800">
            Khách nhấp vào kết quả Google
          </div>
        </div>

        {/* 2. Total Impressions */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#1E2B22] border border-stone-200/80 dark:border-stone-700/60 shadow-sm flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[12px] text-stone-500 uppercase tracking-wider font-semibold">
                Lượt Hiển Thị
              </span>
              <div className="font-serif text-3xl font-bold text-stone-800 dark:text-stone-100 mt-1">
                {loading ? "..." : (data?.overview.totalImpressions ?? 0).toLocaleString("vi-VN")}
              </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 flex items-center justify-center">
              <Eye className="w-5 h-5" />
            </div>
          </div>
          <div className="text-[12px] text-stone-500 mt-3 pt-2 border-t border-stone-100 dark:border-stone-800">
            Số lần quán xuất hiện trên tìm kiếm
          </div>
        </div>

        {/* 3. Average CTR */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#1E2B22] border border-stone-200/80 dark:border-stone-700/60 shadow-sm flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[12px] text-stone-500 uppercase tracking-wider font-semibold">
                CTR Trung Bình
              </span>
              <div className="font-serif text-3xl font-bold text-[#CC7755] dark:text-[#E0B872] mt-1">
                {loading ? "..." : `${data?.overview.averageCtr ?? 0}%`}
              </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-amber-50 dark:bg-amber-950/40 text-[#CC7755] flex items-center justify-center">
              <Percent className="w-5 h-5" />
            </div>
          </div>
          <div className="text-[12px] text-stone-500 mt-3 pt-2 border-t border-stone-100 dark:border-stone-800">
            Tỷ lệ nhấp trên hiển thị
          </div>
        </div>

        {/* 4. Average Position */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#1E2B22] border border-stone-200/80 dark:border-stone-700/60 shadow-sm flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[12px] text-stone-500 uppercase tracking-wider font-semibold">
                Vị Trí Trung Bình
              </span>
              <div className="font-serif text-3xl font-bold text-blue-600 dark:text-blue-400 mt-1">
                {loading ? "..." : (data?.overview.averagePosition ?? 0)}
              </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-600 flex items-center justify-center">
              <Hash className="w-5 h-5" />
            </div>
          </div>
          <div className="text-[12px] text-stone-500 mt-3 pt-2 border-t border-stone-100 dark:border-stone-800">
            Thứ hạng trên trang kết quả Google
          </div>
        </div>
      </div>

      {/* SVG Performance Chart */}
      <div className="p-6 bg-white dark:bg-[#1E2B22] border border-stone-200/80 dark:border-stone-700/60 rounded-2xl shadow-sm flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100">
              Lượt Nhấp Từ Google Tìm Kiếm
            </h2>
            <p className="text-xs text-stone-500">Biểu đồ thể hiện lượt click theo ngày</p>
          </div>
          <span className="flex items-center gap-1.5 text-xs font-semibold text-[#3E5C46] dark:text-[#9DC183]">
            <span className="w-3 h-3 rounded-full bg-[#3E5C46]" />
            <span>Lượt nhấp tự nhiên (Organic Clicks)</span>
          </span>
        </div>

        {points.length > 0 ? (
          <div className="w-full overflow-x-auto py-2">
            <div className="min-w-[600px] h-[190px] relative">
              <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-full overflow-visible">
                <line x1="0" y1="20" x2={chartWidth} y2="20" stroke="currentColor" strokeOpacity="0.08" />
                <line x1="0" y1="80" x2={chartWidth} y2="80" stroke="currentColor" strokeOpacity="0.08" />
                <line x1="0" y1="140" x2={chartWidth} y2="140" stroke="currentColor" strokeOpacity="0.08" />

                <polyline
                  fill="none"
                  stroke="#3E5C46"
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
                      className="fill-white dark:fill-[#1E2B22] stroke-[#3E5C46] stroke-2 hover:r-6 transition-all cursor-pointer"
                    >
                      <title>{`${p.date}: ${p.clicks} clicks`}</title>
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
            Chưa có đủ lượt nhấp theo ngày trong chu kỳ.
          </div>
        )}
      </div>

      {/* Top Search Queries Table */}
      <div className="p-6 bg-white dark:bg-[#1E2B22] border border-stone-200/80 dark:border-stone-700/60 rounded-2xl shadow-sm flex flex-col gap-4">
        <div>
          <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100">
            Top Từ Khóa Tìm Kiếm (Top Queries)
          </h2>
          <p className="text-xs text-stone-500">Các cụm từ người dùng tìm kiếm để tìm thấy Cẩm Cù House</p>
        </div>

        {(data?.topQueries || []).length === 0 ? (
          <div className="text-xs text-stone-400 py-6 text-center italic">
            Chưa có dữ liệu từ khóa trong khoảng thời gian này.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 dark:bg-stone-900/60 text-stone-500 font-semibold border-b border-stone-200 dark:border-stone-800">
                <tr>
                  <th className="py-2.5 px-3">Cụm từ tìm kiếm</th>
                  <th className="py-2.5 px-3 text-right">Lượt nhấp</th>
                  <th className="py-2.5 px-3 text-right">Lượt hiển thị</th>
                  <th className="py-2.5 px-3 text-right">CTR</th>
                  <th className="py-2.5 px-3 text-right">Vị trí trung bình</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-stone-800 text-stone-700 dark:text-stone-300">
                {data?.topQueries.map((q, idx) => (
                  <tr key={idx} className="hover:bg-stone-50/50 dark:hover:bg-stone-800/30">
                    <td className="py-2.5 px-3 font-semibold text-stone-900 dark:text-stone-100">{q.query}</td>
                    <td className="py-2.5 px-3 text-right font-bold text-[#3E5C46] dark:text-[#9DC183]">{q.clicks}</td>
                    <td className="py-2.5 px-3 text-right font-mono">{q.impressions}</td>
                    <td className="py-2.5 px-3 text-right font-mono">{q.ctr}%</td>
                    <td className="py-2.5 px-3 text-right font-mono">#{q.position}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* URL Inspection for 5 Main Pages */}
      <div className="p-6 bg-white dark:bg-[#1E2B22] border border-stone-200/80 dark:border-stone-700/60 rounded-2xl shadow-sm flex flex-col gap-4">
        <div>
          <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100">
            Trạng Thái Lập Chỉ Mục 5 Trang Chính (URL Inspection API)
          </h2>
          <p className="text-xs text-stone-500">Kiểm tra trực tiếp độ phủ và trạng thái xuất hiện trên Google</p>
        </div>

        <div className="divide-y divide-stone-100 dark:divide-stone-800 text-xs">
          {(data?.urlInspections || []).map((item, idx) => (
            <div key={idx} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-mono text-stone-800 dark:text-stone-200">{item.url}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-semibold text-[11px]">
                  {item.coverageState}
                </span>
                <span className="text-[10px] text-stone-400 font-mono">Google Verified</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
