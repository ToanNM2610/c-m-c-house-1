'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Users, Download, Search, RefreshCw, Award, Wallet } from 'lucide-react';

export default function AdminCustomersManager() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [canExportPhone, setCanExportPhone] = useState(false);
  const [segment, setSegment] = useState('ALL');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<any | null>(null);
  const [editSegment, setEditSegment] = useState('NEW');
  const [editDebt, setEditDebt] = useState('0');
  const [editLoyaltyDelta, setEditLoyaltyDelta] = useState('0');
  const [editNote, setEditNote] = useState('');
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (m: string) => {
    setToast(m);
    setTimeout(() => setToast(null), 3500);
  };

  const fetchCustomers = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (segment !== 'ALL') params.set('segment', segment);
      if (search.trim()) params.set('q', search.trim());
      const res = await fetch(`/api/admin/commerce/customers?${params.toString()}`, {
        credentials: 'include',
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setCustomers(json.data.customers || []);
        setCanExportPhone(Boolean(json.data.canExportPhone));
      }
    } finally {
      setLoading(false);
    }
  }, [segment, search]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const handleSaveCrm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    const res = await fetch('/api/admin/commerce/customers', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        id: editing.id,
        segment: editSegment,
        debtBalance: Number(editDebt) || 0,
        loyaltyDelta: Number(editLoyaltyDelta) || 0,
        crmNote: editNote,
      }),
    });
    const json = await res.json();
    if (res.ok && json.success) {
      showToast('Đã cập nhật hồ sơ CRM 360°');
      setEditing(null);
      fetchCustomers();
    } else {
      showToast(json.error || 'Lỗi cập nhật CRM');
    }
  };

  return (
    <div className="space-y-6">
      {toast && (
        <div className="fixed top-5 right-5 z-50 px-4 py-3 rounded-xl bg-slate-900 text-white text-xs font-mono shadow-xl">
          {toast}
        </div>
      )}

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-700 font-bold uppercase tracking-wider mb-1">
            <Users className="w-4 h-4" />
            <span>PHÂN HỆ 4 • CRM KHÁCH HÀNG 360°, CÔNG NỢ B2B & TÍCH ĐIỂM LOYALTY</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            Hồ Sơ Khách Hàng & Phân Nhóm Tự Động
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {canExportPhone
              ? 'Tài khoản có quyền xuất danh sách SĐT CSV'
              : 'Đã ẩn nút xuất SĐT khách hàng theo phân quyền Sale/CSKH'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {canExportPhone && (
            <a
              href="/api/admin/commerce/customers?format=csv"
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-mono font-bold inline-flex items-center gap-1.5"
            >
              <Download className="w-4 h-4" />
              <span>Xuất CSV</span>
            </a>
          )}
          <button
            onClick={fetchCustomers}
            className="px-3.5 py-2 rounded-xl bg-slate-900 text-white text-xs font-mono font-bold inline-flex items-center gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Làm mới</span>
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5">
          {['ALL', 'NEW', 'VIP', 'WHOLESALE', 'BLACKLIST'].map((seg) => (
            <button
              key={seg}
              onClick={() => setSegment(seg)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold border ${
                segment === seg
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-white text-slate-600 border-slate-200'
              }`}
            >
              {seg === 'ALL' ? 'Tất cả' : seg}
            </button>
          ))}
        </div>

        <div className="relative w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm tên, SĐT, email..."
            className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-x-auto">
        {customers.length === 0 ? (
          <div className="p-10 text-center text-xs text-slate-500">
            Chưa có khách hàng nào trong CRM. Khách đặt đơn hoặc được tạo đơn Zalo/Hotline sẽ tự động gom vào đây.
          </div>
        ) : (
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 font-mono uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">Khách hàng</th>
                <th className="px-4 py-3">Phân nhóm</th>
                <th className="px-4 py-3 text-right">Số đơn</th>
                <th className="px-4 py-3 text-right">Tổng chi tiêu</th>
                <th className="px-4 py-3 text-right">Công nợ B2B</th>
                <th className="px-4 py-3 text-right">Điểm Loyalty</th>
                <th className="px-4 py-3 text-right">Chăm sóc</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {customers.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <div className="font-semibold text-slate-900">{c.fullName}</div>
                    <div className="font-mono text-slate-500">{c.phoneMasked || c.email || '-'}</div>
                  </td>
                  <td className="px-4 py-3 font-mono font-bold">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[11px] ${
                        c.segment === 'VIP'
                          ? 'bg-amber-100 text-amber-800'
                          : c.segment === 'WHOLESALE'
                          ? 'bg-sky-100 text-sky-800'
                          : c.segment === 'BLACKLIST'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {c.segment}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-mono">{c.orderCount}</td>
                  <td className="px-4 py-3 text-right font-mono font-bold text-emerald-700">
                    {Number(c.totalSpent).toLocaleString('vi-VN')}đ
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-rose-700">
                    {Number(c.debtBalance || 0).toLocaleString('vi-VN')}đ
                  </td>
                  <td className="px-4 py-3 text-right font-mono font-bold text-amber-700">
                    {c.loyaltyPoints || 0} điểm
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => {
                        setEditing(c);
                        setEditSegment(c.segment || 'NEW');
                        setEditDebt(String(c.debtBalance || 0));
                        setEditLoyaltyDelta('0');
                        setEditNote(c.crmNote || '');
                      }}
                      className="px-3 py-1 rounded-lg bg-slate-900 text-white font-mono font-bold"
                    >
                      Hồ sơ 360°
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <form onSubmit={handleSaveCrm} className="bg-white w-full max-w-md rounded-2xl p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900">Hồ sơ CRM 360°: {editing.fullName}</h3>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-mono text-slate-600 mb-1">Phân nhóm</label>
                <select
                  value={editSegment}
                  onChange={(e) => setEditSegment(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl"
                >
                  <option value="NEW">NEW (Mới)</option>
                  <option value="VIP">VIP</option>
                  <option value="WHOLESALE">WHOLESALE (Khách sỉ B2B)</option>
                  <option value="BLACKLIST">BLACKLIST (Hạn chế)</option>
                </select>
              </div>
              <div>
                <label className="block font-mono text-slate-600 mb-1 flex items-center gap-1">
                  <Wallet className="w-3.5 h-3.5" /> Công nợ (VNĐ)
                </label>
                <input
                  type="number"
                  value={editDebt}
                  onChange={(e) => setEditDebt(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl font-mono"
                />
              </div>
            </div>
            <div className="text-xs">
              <label className="block font-mono text-slate-600 mb-1 flex items-center gap-1">
                <Award className="w-3.5 h-3.5" /> Cộng/Trừ điểm Loyalty (hiện có: {editing.loyaltyPoints || 0})
              </label>
              <input
                type="number"
                value={editLoyaltyDelta}
                onChange={(e) => setEditLoyaltyDelta(e.target.value)}
                className="w-full px-3 py-2 border rounded-xl font-mono"
              />
            </div>
            <div className="text-xs">
              <label className="block font-mono text-slate-600 mb-1">Ghi chú CSKH</label>
              <textarea
                rows={3}
                value={editNote}
                onChange={(e) => setEditNote(e.target.value)}
                className="w-full px-3 py-2 border rounded-xl"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setEditing(null)} className="px-4 py-2 rounded-xl border text-xs">
                Đóng
              </button>
              <button type="submit" className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold">
                Lưu CRM
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
