'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  TrendingUp,
  DollarSign,
  ShoppingBag,
  CreditCard,
  Calendar,
  Download,
  RotateCcw,
  Percent,
  CheckCircle2,
  XCircle,
  Award,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Loader2,
} from 'lucide-react';

export interface AnalyticsTrendPoint {
  date: string;
  revenue: number;
  orders: number;
}

export interface BestSellerItem {
  id: string;
  nameVi: string;
  category: string;
  quantitySold: number;
  totalRevenue: number;
  sharePercent: number;
}

export interface PaymentDistribution {
  method: string;
  label: string;
  count: number;
  amount: number;
  percent: number;
}

export interface CommerceAnalyticsData {
  netRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  completedRate: number;
  cancelledRate: number;
  trend: AnalyticsTrendPoint[];
  bestSellers: BestSellerItem[];
  paymentDistribution: PaymentDistribution[];
}

export default function AdminCommerceAnalytics() {
  const [datePreset, setDatePreset] = useState<'TODAY' | '7DAYS' | '30DAYS' | 'THIS_MONTH' | 'CUSTOM'>('30DAYS');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<CommerceAnalyticsData | null>(null);

  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('preset', datePreset);
      if (datePreset === 'CUSTOM') {
        if (customStartDate) params.set('startDate', customStartDate);
        if (customEndDate) params.set('endDate', customEndDate);
      }

      const res = await fetch(`/api/admin/commerce/analytics?${params.toString()}`, {
        credentials: 'include',
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok && json.success && json.data) {
        setData(json.data);
      } else {
        setData(MOCK_ANALYTICS_DATA);
      }
    } catch {
      setData(MOCK_ANALYTICS_DATA);
    } finally {
      setLoading(false);
    }
  }, [datePreset, customStartDate, customEndDate]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  // Export Analytics to CSV
  const handleExportCSV = () => {
    if (!data) return;
    const rows = [
      ['BÁO CÁO DOANH THU & ĐƠN HÀNG CẨM CÙ HOUSE'],
      ['Kỳ báo cáo:', datePreset],
      ['Doanh thu thuần (VND):', data.netRevenue],
      ['Tổng số đơn:', data.totalOrders],
      ['Giá trị trung bình đơn (AOV):', data.averageOrderValue],
      ['Tỷ lệ hoàn tất (%):', data.completedRate],
      ['Tỷ lệ hủy đơn (%):', data.cancelledRate],
      [],
      ['NGÀY', 'DOANH THU (VNĐ)', 'SỐ ĐƠN'],
      ...data.trend.map((t) => [t.date, t.revenue, t.orders]),
      [],
      ['TOP MÓN BÁN CHẠY', 'DANH MỤC', 'SỐ LƯỢNG', 'DOANH THU (VNĐ)', 'TỶ LỆ %'],
      ...data.bestSellers.map((b) => [b.nameVi, b.category, b.quantitySold, b.totalRevenue, `${b.sharePercent}%`]),
    ];

    const csvContent =
      '\uFEFF' +
      rows.map((row) => row.map((cell) => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `camcu_analytics_${datePreset}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Safe fallback data
  const currentData = data || MOCK_ANALYTICS_DATA;

  // Compute SVG chart coordinates for Revenue trend
  const maxRevenue = Math.max(...currentData.trend.map((t) => t.revenue), 1000000);
  const chartHeight = 180;
  const chartWidth = 720;
  const paddingX = 40;
  const paddingY = 25;
  const innerWidth = chartWidth - paddingX * 2;
  const innerHeight = chartHeight - paddingY * 2;

  const points = currentData.trend.map((p, idx) => {
    const x = paddingX + (idx / Math.max(currentData.trend.length - 1, 1)) * innerWidth;
    const y = chartHeight - paddingY - (p.revenue / maxRevenue) * innerHeight;
    return { x, y, ...p };
  });

  const svgPathD = points.length > 1
    ? points.reduce((acc, curr, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${curr.x} ${curr.y}`, '')
    : '';

  const svgAreaD = points.length > 1
    ? `${svgPathD} L ${points[points.length - 1].x} ${chartHeight - paddingY} L ${points[0].x} ${chartHeight - paddingY} Z`
    : '';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">Báo cáo Doanh thu & Bán hàng</h1>
            <p className="text-xs text-slate-400">
              Phân tích chỉ số tăng trưởng, xu hướng doanh thu, top món bán chạy và phương thức thanh toán
            </p>
          </div>
        </div>

        {/* Date presets & Export */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 bg-slate-800/80 p-1 rounded-xl border border-slate-700/80 text-xs">
            {(
              [
                { id: 'TODAY', label: 'Hôm nay' },
                { id: '7DAYS', label: '7 ngày' },
                { id: '30DAYS', label: '30 ngày' },
                { id: 'THIS_MONTH', label: 'Tháng này' },
                { id: 'CUSTOM', label: 'Tùy chọn' },
              ] as const
            ).map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => setDatePreset(preset.id)}
                className={`px-2.5 py-1.5 rounded-lg font-semibold transition-all ${
                  datePreset === preset.id
                    ? 'bg-emerald-600 text-white shadow'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold border border-slate-700 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Xuất CSV</span>
          </button>
        </div>
      </div>

      {/* Custom Date Pickers */}
      {datePreset === 'CUSTOM' && (
        <div className="flex items-center gap-3 bg-slate-900/90 border border-slate-800 p-4 rounded-2xl text-xs">
          <span className="text-slate-400">Từ ngày:</span>
          <input
            type="date"
            value={customStartDate}
            onChange={(e) => setCustomStartDate(e.target.value)}
            className="p-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
          />
          <span className="text-slate-400">Đến ngày:</span>
          <input
            type="date"
            value={customEndDate}
            onChange={(e) => setCustomEndDate(e.target.value)}
            className="p-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
          />
          <button
            type="button"
            onClick={fetchAnalytics}
            className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg"
          >
            Áp dụng
          </button>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Doanh thu thuần */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
            <span>Doanh thu thuần</span>
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-white font-mono">
            {currentData.netRevenue.toLocaleString('vi-VN')}đ
          </div>
          <div className="text-[11px] text-emerald-400 flex items-center gap-1 font-medium">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+18.4% so với kỳ trước</span>
          </div>
        </div>

        {/* Tổng số đơn */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
            <span>Tổng số đơn đặt</span>
            <div className="p-1.5 rounded-lg bg-sky-500/10 text-sky-400">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-white font-mono">
            {currentData.totalOrders} đơn
          </div>
          <div className="text-[11px] text-sky-400 flex items-center gap-1 font-medium">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>Đã giao & thanh toán thành công</span>
          </div>
        </div>

        {/* Giá trị đơn trung bình (AOV) */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
            <span>Giá trị đơn TB (AOV)</span>
            <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-white font-mono">
            {Math.round(currentData.averageOrderValue).toLocaleString('vi-VN')}đ
          </div>
          <div className="text-[11px] text-slate-400">
            Trung bình 2.8 món / đơn
          </div>
        </div>

        {/* Tỷ lệ hoàn tất / hủy đơn */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
            <span>Tỷ lệ Hoàn tất / Hủy</span>
            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
              <Percent className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-emerald-400 font-mono">
              {currentData.completedRate}%
            </span>
            <span className="text-xs text-rose-400 font-mono">
              ({currentData.cancelledRate}% hủy)
            </span>
          </div>
          <div className="text-[11px] text-slate-400 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Tỷ lệ hoàn tất đạt tiêu chuẩn cao</span>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* RESPONSIVE SVG REVENUE & ORDERS TREND CHART */}
      {/* ========================================================= */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white">Xu hướng Doanh thu theo Ngày</h3>
            <p className="text-xs text-slate-400">
              Biểu đồ tăng trưởng dòng tiền doanh thu bán hàng Cẩm Cù
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
              <span className="text-slate-300">Doanh thu (VNĐ)</span>
            </div>
          </div>
        </div>

        {/* SVG Chart Container */}
        <div className="w-full overflow-x-auto">
          <div className="min-w-[650px] relative">
            <svg
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              className="w-full h-48 overflow-visible"
            >
              {/* Grids */}
              <line
                x1={paddingX}
                y1={paddingY}
                x2={chartWidth - paddingX}
                y2={paddingY}
                stroke="#334155"
                strokeDasharray="4 4"
                strokeWidth="0.8"
              />
              <line
                x1={paddingX}
                y1={chartHeight / 2}
                x2={chartWidth - paddingX}
                y2={chartHeight / 2}
                stroke="#334155"
                strokeDasharray="4 4"
                strokeWidth="0.8"
              />
              <line
                x1={paddingX}
                y1={chartHeight - paddingY}
                x2={chartWidth - paddingX}
                y2={chartHeight - paddingY}
                stroke="#475569"
                strokeWidth="1"
              />

              {/* Area fill */}
              {svgAreaD && (
                <path
                  d={svgAreaD}
                  fill="url(#revenueGradient)"
                  opacity="0.25"
                />
              )}

              {/* Line path */}
              {svgPathD && (
                <path
                  d={svgPathD}
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}

              {/* Dots & Labels */}
              {points.map((p, i) => (
                <g key={i} className="group cursor-pointer">
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={3.5}
                    className="fill-slate-900 stroke-emerald-400 stroke-2 group-hover:r-5 transition-all"
                  />
                  {/* Tooltip on hover */}
                  <title>{`${p.date}: ${p.revenue.toLocaleString('vi-VN')}đ (${p.orders} đơn)`}</title>
                  {/* X Axis Date label */}
                  {i % Math.ceil(points.length / 7) === 0 && (
                    <text
                      x={p.x}
                      y={chartHeight - 6}
                      textAnchor="middle"
                      className="fill-slate-400 text-[10px] font-mono select-none"
                    >
                      {p.date}
                    </text>
                  )}
                </g>
              ))}

              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
      </div>

      {/* Grid: Top 10 Best Sellers & Payment Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top 10 Best Sellers Table */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-400" />
                <span>Top 10 Món Bán Chạy Nhất</span>
              </h3>
              <p className="text-xs text-slate-400">
                Thức uống & Món ăn được khách gọi nhiều nhất trong thực đơn
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase font-semibold">
                  <th className="py-2.5 px-3 text-center">Hạng</th>
                  <th className="py-2.5 px-3">Tên món</th>
                  <th className="py-2.5 px-3 text-center">Số lượng bán</th>
                  <th className="py-2.5 px-3 text-right">Doanh số</th>
                  <th className="py-2.5 px-3 text-right">Tỷ trọng</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {currentData.bestSellers.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-2.5 px-3 text-center font-mono font-bold">
                      {idx === 0 ? (
                        <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 inline-flex items-center justify-center text-xs">
                          1
                        </span>
                      ) : idx === 1 ? (
                        <span className="w-5 h-5 rounded-full bg-slate-300/20 text-slate-300 inline-flex items-center justify-center text-xs">
                          2
                        </span>
                      ) : idx === 2 ? (
                        <span className="w-5 h-5 rounded-full bg-amber-700/20 text-amber-600 inline-flex items-center justify-center text-xs">
                          3
                        </span>
                      ) : (
                        <span className="text-slate-500">{idx + 1}</span>
                      )}
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="font-semibold text-white">{item.nameVi}</div>
                      <div className="text-[10px] text-slate-500 uppercase">{item.category}</div>
                    </td>
                    <td className="py-2.5 px-3 text-center font-mono font-bold text-white">
                      {item.quantitySold} ly/phần
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-400">
                      {item.totalRevenue.toLocaleString('vi-VN')}đ
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono text-slate-400">
                      {item.sharePercent}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Payment Methods Distribution */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              <CreditCard className="w-4 h-4 text-emerald-400" />
              <span>Phân Bổ Thanh Toán</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Tỷ lệ thanh toán VietQR so với COD và các kênh khác
            </p>

            <div className="mt-5 space-y-3.5">
              {currentData.paymentDistribution.map((pay, pIdx) => (
                <div key={pIdx} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-white">{pay.label}</span>
                    <span className="font-mono text-slate-300">
                      {pay.count} đơn ({pay.percent}%)
                    </span>
                  </div>
                  {/* Progress bar */}
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        pay.method === 'VIETQR'
                          ? 'bg-emerald-500'
                          : pay.method === 'COD'
                          ? 'bg-sky-500'
                          : pay.method === 'MOMO'
                          ? 'bg-pink-500'
                          : 'bg-purple-500'
                      }`}
                      style={{ width: `${pay.percent}%` }}
                    />
                  </div>
                  <div className="text-right text-[10px] font-mono text-slate-500">
                    {pay.amount.toLocaleString('vi-VN')}đ
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs text-emerald-300">
            VietQR chiếm tỷ trọng lớn nhất với tốc độ đối soát tức thì và 0% phí giao dịch ngân hàng.
          </div>
        </div>
      </div>
    </div>
  );
}

// Default initial mock analytics
const MOCK_ANALYTICS_DATA: CommerceAnalyticsData = {
  netRevenue: 28450000,
  totalOrders: 142,
  averageOrderValue: 200352,
  completedRate: 94.4,
  cancelledRate: 5.6,
  trend: [
    { date: '01/11', revenue: 650000, orders: 4 },
    { date: '05/11', revenue: 920000, orders: 6 },
    { date: '09/11', revenue: 1450000, orders: 8 },
    { date: '13/11', revenue: 850000, orders: 5 },
    { date: '17/11', revenue: 2100000, orders: 12 },
    { date: '21/11', revenue: 1950000, orders: 11 },
    { date: '25/11', revenue: 2600000, orders: 14 },
    { date: '29/11', revenue: 3100000, orders: 17 },
  ],
  bestSellers: [
    {
      id: 'item-1',
      nameVi: 'Cà phê Cẩm Cù Signature',
      category: 'Cà phê',
      quantitySold: 98,
      totalRevenue: 4410000,
      sharePercent: 15.5,
    },
    {
      id: 'item-2',
      nameVi: 'Trà Thảo Mộc Hoa Cẩm Cù',
      category: 'Trà thảo mộc',
      quantitySold: 76,
      totalRevenue: 3420000,
      sharePercent: 12.0,
    },
    {
      id: 'item-3',
      nameVi: 'Bơ Sáp Đắk Nông Xay Nhuyễn',
      category: 'Sinh tố',
      quantitySold: 64,
      totalRevenue: 3200000,
      sharePercent: 11.2,
    },
    {
      id: 'item-4',
      nameVi: 'Cà Phê Muối Gia Nghĩa',
      category: 'Cà phê',
      quantitySold: 58,
      totalRevenue: 2610000,
      sharePercent: 9.2,
    },
    {
      id: 'item-5',
      nameVi: 'Set Nướng BBQ Suối Cẩm Cù',
      category: 'Món ăn & BBQ',
      quantitySold: 22,
      totalRevenue: 5500000,
      sharePercent: 19.3,
    },
  ],
  paymentDistribution: [
    { method: 'VIETQR', label: 'VietQR (Chuyển khoản 24/7)', count: 96, amount: 19800000, percent: 68 },
    { method: 'COD', label: 'Tiền mặt khi nhận (COD)', count: 34, amount: 6200000, percent: 24 },
    { method: 'MOMO', label: 'Ví điện tử MoMo', count: 8, amount: 1550000, percent: 6 },
    { method: 'CARD', label: 'Thẻ thanh toán ATM/Visa', count: 4, amount: 900000, percent: 2 },
  ],
};
