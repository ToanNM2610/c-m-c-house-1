'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Package,
  RefreshCw,
  ArrowUpCircle,
  ArrowDownCircle,
  AlertTriangle,
  Search,
  History,
  SlidersHorizontal,
  CheckCircle2,
} from 'lucide-react';

export default function AdminInventoryManager() {
  const [items, setItems] = useState<any[]>([]);
  const [movements, setMovements] = useState<any[]>([]);
  const [canViewCost, setCanViewCost] = useState(false);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterLowOnly, setFilterLowOnly] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  // Stock action modal
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [actionType, setActionType] = useState<'IN' | 'OUT' | 'ADJUST'>('IN');
  const [qty, setQty] = useState('10');
  const [note, setNote] = useState('');
  const [sku, setSku] = useState('');
  const [threshold, setThreshold] = useState('5');
  const [costPrice, setCostPrice] = useState('0');
  const [submitting, setSubmitting] = useState(false);

  const showToast = (type: 'success' | 'error', msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchInventory = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/commerce/inventory', { credentials: 'include' });
      const json = await res.json();
      if (res.ok && json.success) {
        setItems(json.data.items || []);
        setMovements(json.data.movements || []);
        setCanViewCost(Boolean(json.data.canViewCostPrice));
      } else {
        showToast('error', json.error || 'Không thể tải dữ liệu kho');
      }
    } catch {
      showToast('error', 'Lỗi kết nối kho hàng');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  const openActionModal = (item: any, type: 'IN' | 'OUT' | 'ADJUST') => {
    setSelectedItem(item);
    setActionType(type);
    setQty(type === 'ADJUST' ? String(item.stockQuantity || 0) : '10');
    setNote('');
    setSku(item.sku || '');
    setThreshold(String(item.lowStockThreshold ?? 5));
    setCostPrice(String(item.costPriceVnd ?? 0));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/admin/commerce/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          menuItemId: selectedItem.id,
          type: actionType,
          quantity: Number(qty),
          note: note.trim(),
          sku: sku.trim() || null,
          lowStockThreshold: Number(threshold) || 5,
          costPriceVnd: canViewCost ? Number(costPrice) || 0 : undefined,
        }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        showToast('success', json.message || 'Đã cập nhật kho');
        setSelectedItem(null);
        fetchInventory();
      } else {
        showToast('error', json.error || 'Lỗi cập nhật kho');
      }
    } catch {
      showToast('error', 'Lỗi kết nối máy chủ');
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = items.filter((i) => {
    if (filterLowOnly && !i.isLowStock) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        (i.displayName || '').toLowerCase().includes(q) ||
        (i.sku || '').toLowerCase().includes(q) ||
        (i.categoryId || '').toLowerCase().includes(q)
      );
    }
    return true;
  });

  const lowCount = items.filter((i) => i.isLowStock).length;

  return (
    <div className="space-y-6">
      {toast && (
        <div
          className={`fixed top-5 right-5 z-50 px-4 py-3 rounded-xl text-xs font-mono font-bold shadow-xl ${
            toast.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
          }`}
        >
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-700 font-bold uppercase tracking-wider mb-1">
            <Package className="w-4 h-4" />
            <span>PHÂN HỆ 2 • QUẢN LÝ KHO HÀNG & BIẾN ĐỘNG TỒN (INVENTORY)</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            Tồn Kho Thực Tế, Giữ Chỗ & Nhập / Xuất Kho
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Cập nhật nguyên tử qua $transaction • {canViewCost ? 'Hiển thị giá vốn COGS' : 'Đã ẩn giá vốn COGS theo phân quyền Kho'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterLowOnly(!filterLowOnly)}
            className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold border transition-all flex items-center gap-1.5 ${
              filterLowOnly
                ? 'bg-amber-600 text-white border-amber-600'
                : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Sắp hết ({lowCount})</span>
          </button>
          <button
            onClick={fetchInventory}
            className="px-3.5 py-2 rounded-xl bg-slate-900 text-white text-xs font-mono font-bold hover:bg-slate-800 flex items-center gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Làm mới</span>
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Tìm theo tên món, SKU, danh mục..."
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-emerald-600"
        />
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 font-mono uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3">SKU / Món</th>
              <th className="px-4 py-3">Danh mục</th>
              <th className="px-4 py-3 text-right">Giá bán</th>
              {canViewCost && <th className="px-4 py-3 text-right">Giá vốn</th>}
              <th className="px-4 py-3 text-center">Theo dõi kho</th>
              <th className="px-4 py-3 text-right">Tồn thực</th>
              <th className="px-4 py-3 text-right">Đang giữ</th>
              <th className="px-4 py-3 text-right">Khả dụng</th>
              <th className="px-4 py-3 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50/70">
                <td className="px-4 py-3">
                  <div className="font-semibold text-slate-900">{item.displayName}</div>
                  <div className="text-[11px] font-mono text-slate-400">
                    {item.sku || item.id}
                  </div>
                </td>
                <td className="px-4 py-3 font-mono text-slate-600">{item.categoryId}</td>
                <td className="px-4 py-3 text-right font-mono font-bold text-emerald-700">
                  {Number(item.priceVnd || item.price || 0).toLocaleString('vi-VN')}đ
                </td>
                {canViewCost && (
                  <td className="px-4 py-3 text-right font-mono text-slate-600">
                    {Number(item.costPriceVnd || 0).toLocaleString('vi-VN')}đ
                  </td>
                )}
                <td className="px-4 py-3 text-center">
                  {item.trackInventory ? (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-mono text-[11px] font-bold">
                      Bật
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 font-mono text-[11px]">
                      Không giới hạn
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-right font-mono font-bold">
                  <span className={item.isLowStock ? 'text-red-600' : 'text-slate-900'}>
                    {item.stockQuantity}
                  </span>
                </td>
                <td className="px-4 py-3 text-right font-mono text-amber-700">
                  {item.stockReserved}
                </td>
                <td className="px-4 py-3 text-right font-mono font-bold text-slate-800">
                  {item.availableToSell}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="inline-flex items-center gap-1">
                    <button
                      onClick={() => openActionModal(item, 'IN')}
                      className="px-2 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-mono font-bold inline-flex items-center gap-1"
                      title="Nhập kho"
                    >
                      <ArrowUpCircle className="w-3.5 h-3.5" />
                      Nhập
                    </button>
                    <button
                      onClick={() => openActionModal(item, 'OUT')}
                      className="px-2 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-mono font-bold inline-flex items-center gap-1"
                      title="Xuất kho"
                    >
                      <ArrowDownCircle className="w-3.5 h-3.5" />
                      Xuất
                    </button>
                    <button
                      onClick={() => openActionModal(item, 'ADJUST')}
                      className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono font-bold inline-flex items-center gap-1"
                      title="Kiểm kê / SKU"
                    >
                      <SlidersHorizontal className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Recent Stock Movements */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
          <History className="w-4 h-4 text-emerald-700" />
          <span>Lịch sử biến động kho gần nhất</span>
        </div>
        {movements.length === 0 ? (
          <p className="text-xs text-slate-500">Chưa có phiếu nhập/xuất kho nào được ghi nhận.</p>
        ) : (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {movements.map((mv) => (
              <div
                key={mv.id}
                className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs"
              >
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded font-mono font-bold bg-slate-800 text-white text-[11px]">
                    {mv.type}
                  </span>
                  <span className="font-semibold text-slate-900">
                    {mv.menuItem?.vietnameseTitle || mv.menuItem?.nameVi || mv.menuItemId}
                  </span>
                  <span className="font-mono text-slate-500">({mv.beforeQty} → {mv.afterQty})</span>
                </div>
                <div className="flex items-center gap-3 font-mono text-[11px] text-slate-500">
                  <span>{mv.note || '-'}</span>
                  <span>bởi {mv.actorUsername || 'system'}</span>
                  <span>{new Date(mv.createdAt).toLocaleString('vi-VN')}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Action Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <form
            onSubmit={handleSubmit}
            className="bg-white w-full max-w-md rounded-2xl p-6 space-y-4 shadow-2xl border border-slate-200"
          >
            <h3 className="text-base font-bold text-slate-900">
              {actionType === 'IN' ? 'Nhập kho' : actionType === 'OUT' ? 'Xuất kho' : 'Kiểm kê & Cấu hình kho'}:{' '}
              <span className="text-emerald-700">{selectedItem.displayName}</span>
            </h3>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-mono text-slate-600 mb-1">
                  {actionType === 'ADJUST' ? 'Tồn kho mới' : 'Số lượng'}
                </label>
                <input
                  type="number"
                  value={qty}
                  onChange={(e) => setQty(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono"
                  required
                />
              </div>
              <div>
                <label className="block font-mono text-slate-600 mb-1">Ngưỡng cảnh báo sắp hết</label>
                <input
                  type="number"
                  value={threshold}
                  onChange={(e) => setThreshold(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-mono text-slate-600 mb-1">Mã SKU</label>
                <input
                  type="text"
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono"
                  placeholder="VD: CCH-CF03"
                />
              </div>
              {canViewCost && (
                <div>
                  <label className="block font-mono text-slate-600 mb-1">Giá vốn COGS (VNĐ)</label>
                  <input
                    type="number"
                    value={costPrice}
                    onChange={(e) => setCostPrice(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono"
                  />
                </div>
              )}
            </div>

            <div className="text-xs">
              <label className="block font-mono text-slate-600 mb-1">Ghi chú phiếu kho</label>
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="VD: Nhập lô hạt Robusta mới rang"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold inline-flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{submitting ? 'Đang lưu...' : 'Xác nhận lưu kho'}</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
