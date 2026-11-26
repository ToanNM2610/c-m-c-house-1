'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { BarChart3, Download, RefreshCw, TrendingUp, PackageX } from 'lucide-react';

export default function AdminCommerceAnalytics() {
  const [range, setRange] = useState<'today' | '7d' | '30d' | 'custom'>('30d');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchReport = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({ range });
      if (range === 'custom' && fromDate) {
        params.set('from', fromDate);
        if (toDate) params.set('to', toDate);
      }
      const res = await fetch(`/api/admin/commerce/analytics?${params.toString()}`, {
        credentials: 'include',
      });
      const json = await res.json();
      if (res.ok && json.success) setReport(json.data);
    } finally {
      setLoading(false);
    }
  }, [range, fromDate, toDate]);

  useEffect(() => {
    fetchReport();
  }, [fetchReport]);

  const exportUrl = (() => {
    const params = new URLSearchParams({ range, format: 'csv' });
    if (range === 'custom' && fromDate) {
      params.set('from', fromDate);
      if (toDate) params.set('to', toDate);
    }
    return `/api/admin/commerce/analytics?${params.toString()}`;
  })();

  const sum = report?.summary || {};

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-700 font-bold uppercase tracking-wider mb-1">
            <BarChart3 className="w-4 h-4" />
            <span>PHÂN HỆ 6 • BÁO CÁO & PHÂN TÍCH KINH DOANH THỰC TẾ</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            Doanh Thu Gộp / Thuần, Lợi Nhuận & Xuất File Excel / CSV
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Tổng hợp 100% từ các đơn hàng hoàn tất trong PostgreSQL — hiển thị số 0 khi chưa phát sinh đơn.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={exportUrl}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-mono font-bold inline-flex items-center gap-1.5"
          >
            <Download className="w-4 h-4" />
            <span>Xuất Excel (CSV)</span>
          </a>
          <button
            onClick={fetchReport}
            className="px-3.5 py-2 rounded-xl bg-slate-900 text-white text-xs font-mono font-bold inline-flex items-center gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Làm mới</span>
          </button>
        </div>
      </div>

      {/* Date Range Controls */}
      <div className="flex flex-wrap items-center gap-2">
        {[
          { id: 'today', label: 'Hôm nay' },
          { id: '7d', label: '7 ngày qua' },
          { id: '30d', label: '30 ngày qua' },
          { id: 'custom', label: 'Tùy chọn ngày' },
        ].map((r) => (
          <button
            key={r.id}
            onClick={() => setRange(r.id as any)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold border ${
              range === r.id ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200'
            }`}
          >
            {r.label}
          </button>
        ))}

        {range === 'custom' && (
          <div className="flex items-center gap-2 text-xs">
            <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="px-2.5 py-1.5 border rounded-xl" />
            <span>→</span>
            <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="px-2.5 py-1.5 border rounded-xl" />
          </div>
        )}
      </div>

      {/* Revenue Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-xs font-mono text-slate-500">DOANH THU GỘP</div>
          <div className="text-2xl font-mono font-bold text-slate-900 mt-1">
            {Number(sum.grossRevenue || 0).toLocaleString('vi-VN')}đ
          </div>
          <div className="text-xs text-slate-500 mt-1">Tổng {sum.completedOrders || 0} đơn hoàn tất</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-xs font-mono text-slate-500">DOANH THU THUẦN</div>
          <div className="text-2xl font-mono font-bold text-emerald-700 mt-1">
            {Number(sum.netRevenue || 0).toLocaleString('vi-VN')}đ
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Đã trừ KM {Number(sum.totalDiscounts || 0).toLocaleString('vi-VN')}đ
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-xs font-mono text-slate-500">LỢI NHUẬN GỘP (SAU COGS)</div>
          <div className="text-2xl font-mono font-bold text-sky-700 mt-1">
            {Number(sum.estimatedProfit || 0).toLocaleString('vi-VN')}đ
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Giá vốn: {Number(sum.totalCost || 0).toLocaleString('vi-VN')}đ
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-xs font-mono text-slate-500">TỶ LỆ HOÀN / HỦY ĐƠN</div>
          <div className="text-2xl font-mono font-bold text-rose-700 mt-1">
            {sum.cancelRatePercent || 0}%
          </div>
          <div className="text-xs text-slate-500 mt-1">
            {sum.cancelledOrReturnedOrders || 0} / {sum.totalOrders || 0} tổng đơn
          </div>
        </div>
      </div>

      {/* Channel Mix & Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
            <TrendingUp className="w-4 h-4 text-emerald-700" />
            <span>Top Sản Phẩm Bán Chạy & Hiệu Quả Kênh</span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-xs">
            {['WEB', 'ZALO', 'HOTLINE'].map((ch) => {
              const info = report?.channelStats?.[ch] || { orders: 0, revenue: 0 };
              return (
                <div key={ch} className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="font-mono font-bold text-slate-700">{ch}</div>
                  <div className="font-mono text-emerald-700 font-bold mt-1">
                    {Number(info.revenue).toLocaleString('vi-VN')}đ
                  </div>
                  <div className="text-[11px] text-slate-500">{info.orders} đơn</div>
                </div>
              );
            })}
          </div>

          <div className="divide-y border rounded-xl">
            {(!report?.topProducts || report.topProducts.length === 0) ? (
              <div className="p-4 text-xs text-slate-500">Chưa có dữ liệu món bán ra trong kỳ này.</div>
            ) : (
              report.topProducts.map((p: any, idx: number) => (
                <div key={p.id} className="p-3 flex items-center justify-between text-xs">
                  <span>
                    <b className="font-mono text-slate-500 mr-2">#{idx + 1}</b>
                    {p.name}
                  </span>
                  <span className="font-mono font-bold text-emerald-700">
                    {p.qty} ly/phần · {Number(p.revenue).toLocaleString('vi-VN')}đ
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
            <PackageX className="w-4 h-4 text-amber-700" />
            <span>Hàng Tồn Kho Chậm Luân Chuyển</span>
          </div>
          <div className="divide-y border rounded-xl">
            {(!report?.slowMovingItems || report.slowMovingItems.length === 0) ? (
              <div className="p-4 text-xs text-slate-500">
                Không có hàng tồn chậm (chỉ thống kê các mặt hàng đang bật Theo dõi tồn kho).
              </div>
            ) : (
              report.slowMovingItems.map((m: any) => (
                <div key={m.id} className="p-3 flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-800">{m.name}</span>
                  <span className="font-mono text-amber-700 font-bold">Tồn {m.stockQuantity} · 0 bán trong kỳ</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
