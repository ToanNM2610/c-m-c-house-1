'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  ShoppingBag,
  Plus,
  RefreshCw,
  Search,
  Printer,
  CheckCircle2,
  Truck,
  QrCode,
  X,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { generateVietQrUrl } from '@/lib/vietqr';

const ORDER_STATUSES = [
  { id: 'ALL', label: 'Tất cả' },
  { id: 'PENDING', label: 'Chờ xác nhận' },
  { id: 'CONFIRMED', label: 'Đã xác nhận' },
  { id: 'PACKING', label: 'Đang đóng gói' },
  { id: 'SHIPPING', label: 'Đang giao' },
  { id: 'COMPLETED', label: 'Hoàn tất' },
  { id: 'RETURNED', label: 'Đổi trả' },
  { id: 'CANCELLED', label: 'Đã hủy' },
];

export default function AdminOrdersManager() {
  const { data } = useApp();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [showDraftModal, setShowDraftModal] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  // Draft Order State
  const [draftSource, setDraftSource] = useState<'ZALO' | 'HOTLINE' | 'WEB'>('ZALO');
  const [draftName, setDraftName] = useState('');
  const [draftPhone, setDraftPhone] = useState('');
  const [draftAddress, setDraftAddress] = useState('');
  const [draftPayment, setDraftPayment] = useState<'VIETQR' | 'COD'>('VIETQR');
  const [draftItemId, setDraftItemId] = useState(data.menu[0]?.id || '');
  const [draftQty, setDraftQty] = useState('1');
  const [creating, setCreating] = useState(false);

  const showToast = (type: 'success' | 'error', msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter !== 'ALL') params.set('status', statusFilter);
      if (search.trim()) params.set('q', search.trim());
      const res = await fetch(`/api/admin/commerce/orders?${params.toString()}`, {
        credentials: 'include',
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setOrders(json.data || []);
      }
    } catch {
      showToast('error', 'Không thể tải danh sách đơn hàng');
    } finally {
      setLoading(false);
    }
  }, [statusFilter, search]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleUpdateOrder = async (id: string, payload: Record<string, unknown>) => {
    try {
      const res = await fetch('/api/admin/commerce/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ id, ...payload }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        showToast('success', json.message || 'Đã cập nhật đơn');
        setSelectedOrder(json.data);
        fetchOrders();
      } else {
        showToast('error', json.error || 'Lỗi cập nhật đơn');
      }
    } catch {
      showToast('error', 'Lỗi kết nối máy chủ');
    }
  };

  const handleCreateDraft = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      const res = await fetch('/api/admin/commerce/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          source: draftSource,
          customerName: draftName,
          customerPhone: draftPhone,
          shippingAddress: draftAddress,
          paymentMethod: draftPayment,
          items: [{ menuItemId: draftItemId, quantity: Number(draftQty) || 1 }],
        }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        showToast('success', json.message || 'Đã tạo đơn thủ công');
        setShowDraftModal(false);
        setDraftName('');
        setDraftPhone('');
        setDraftAddress('');
        fetchOrders();
      } else {
        showToast('error', json.error || 'Lỗi tạo đơn');
      }
    } catch {
      showToast('error', 'Lỗi kết nối máy chủ');
    } finally {
      setCreating(false);
    }
  };

  const handlePrintInvoice = (order: any) => {
    const win = window.open('', '_blank', 'width=720,height=800');
    if (!win) return;
    const rows = (order.items || [])
      .map(
        (i: any) =>
          `<tr><td style="padding:6px;border-bottom:1px solid #ddd">${i.itemNameVi}</td><td style="padding:6px;border-bottom:1px solid #ddd;text-align:center">${i.quantity}</td><td style="padding:6px;border-bottom:1px solid #ddd;text-align:right">${Number(
            i.lineTotal
          ).toLocaleString('vi-VN')}đ</td></tr>`
      )
      .join('');
    win.document.write(`
      <html><head><title>Hóa đơn ${order.orderCode}</title></head>
      <body style="font-family:sans-serif;padding:24px;color:#1C1917">
        <h2 style="margin:0">CẨM CÙ HOUSE — PHIẾU ĐƠN HÀNG</h2>
        <p style="font-size:12px;color:#555">Hẻm 437 Hùng Vương, Đông Gia Nghĩa · Hotline: 0382 851 688</p>
        <hr/>
        <p><b>Mã đơn:</b> ${order.orderCode} (${order.source})</p>
        <p><b>Khách hàng:</b> ${order.customerName} — ${order.customerPhone}</p>
        <p><b>Địa chỉ:</b> ${order.shippingAddress || 'Nhận tại quán'}</p>
        <table style="width:100%;border-collapse:collapse;margin-top:12px">
          <thead><tr><th align="left">Món</th><th>SL</th><th align="right">Thành tiền</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
        <h3 style="text-align:right;margin-top:16px">Tổng thanh toán: ${Number(order.totalAmount).toLocaleString('vi-VN')}đ</h3>
        <script>window.print();</script>
      </body></html>
    `);
    win.document.close();
  };

  const cs = data.commerceSettings;

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
            <ShoppingBag className="w-4 h-4" />
            <span>PHÂN HỆ 3 • QUẢN LÝ ĐƠN HÀNG, THANH TOÁN & VẬN CHUYỂN (OMS)</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            Vòng Đời Đơn Hàng, Tạo Đơn Zalo/Hotline & Đối Soát VietQR
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowDraftModal(true)}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-mono font-bold inline-flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Tạo đơn Zalo / Hotline</span>
          </button>
          <button
            onClick={fetchOrders}
            className="px-3.5 py-2 rounded-xl bg-slate-900 text-white text-xs font-mono font-bold inline-flex items-center gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Làm mới</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3 items-start md:items-center justify-between">
        <div className="flex flex-wrap gap-1.5">
          {ORDER_STATUSES.map((st) => (
            <button
              key={st.id}
              onClick={() => setStatusFilter(st.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold border ${
                statusFilter === st.id
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm mã đơn, tên, SĐT..."
            className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-x-auto">
        {orders.length === 0 ? (
          <div className="p-10 text-center text-xs text-slate-500">
            Chưa có đơn hàng nào khớp bộ lọc. Dữ liệu hiển thị 100% thực tế từ PostgreSQL.
          </div>
        ) : (
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 font-mono uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">Mã đơn / Nguồn</th>
                <th className="px-4 py-3">Khách hàng</th>
                <th className="px-4 py-3 text-right">Tổng tiền</th>
                <th className="px-4 py-3">Thanh toán</th>
                <th className="px-4 py-3">Trạng thái</th>
                <th className="px-4 py-3 text-right">Xử lý</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.map((o) => (
                <tr key={o.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-mono">
                    <div className="font-bold text-slate-900">{o.orderCode}</div>
                    <span className="text-[11px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                      {o.source}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-semibold text-slate-900">{o.customerName}</div>
                    <div className="font-mono text-slate-500">{o.customerPhone}</div>
                  </td>
                  <td className="px-4 py-3 text-right font-mono font-bold text-emerald-700">
                    {Number(o.totalAmount).toLocaleString('vi-VN')}đ
                  </td>
                  <td className="px-4 py-3 font-mono">
                    <div>{o.paymentMethod}</div>
                    <span
                      className={`text-[11px] font-bold ${
                        o.paymentStatus === 'PAID' ? 'text-emerald-700' : 'text-amber-700'
                      }`}
                    >
                      {o.paymentStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-800 font-mono font-bold text-[11px]">
                      {o.orderStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right space-x-1.5">
                    <button
                      onClick={() => setSelectedOrder(o)}
                      className="px-2.5 py-1 rounded-lg bg-slate-900 text-white font-mono font-bold"
                    >
                      Chi tiết
                    </button>
                    <button
                      onClick={() => handlePrintInvoice(o)}
                      className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100"
                      title="In phiếu"
                    >
                      <Printer className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Đơn hàng {selectedOrder.orderCode}</h3>
                <p className="text-xs text-slate-500">
                  {selectedOrder.customerName} · {selectedOrder.customerPhone} · {selectedOrder.shippingAddress || 'Nhận tại quán'}
                </p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="p-1 text-slate-400 hover:text-slate-800">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-1.5 text-xs border rounded-xl p-3 bg-slate-50">
              {(selectedOrder.items || []).map((it: any) => (
                <div key={it.id} className="flex justify-between">
                  <span>
                    {it.quantity} × {it.itemNameVi}
                  </span>
                  <span className="font-mono font-bold">{Number(it.lineTotal).toLocaleString('vi-VN')}đ</span>
                </div>
              ))}
              <div className="border-t pt-2 flex justify-between font-bold text-sm text-emerald-700">
                <span>Tổng thanh toán</span>
                <span className="font-mono">{Number(selectedOrder.totalAmount).toLocaleString('vi-VN')}đ</span>
              </div>
            </div>

            {/* Status Transitions */}
            <div className="space-y-2">
              <div className="text-xs font-mono font-bold text-slate-600 uppercase">Chuyển trạng thái đơn</div>
              <div className="flex flex-wrap gap-1.5">
                {['CONFIRMED', 'PACKING', 'SHIPPING', 'COMPLETED', 'RETURNED', 'CANCELLED'].map((st) => (
                  <button
                    key={st}
                    onClick={() => handleUpdateOrder(selectedOrder.id, { orderStatus: st })}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold border ${
                      selectedOrder.orderStatus === st
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Payment Reconciliation & VietQR */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t pt-4">
              <div className="space-y-2 text-xs">
                <div className="font-mono font-bold text-slate-600 uppercase flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Đối soát thanh toán ({selectedOrder.paymentMethod})</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleUpdateOrder(selectedOrder.id, { paymentStatus: 'PAID' })}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-mono font-bold"
                  >
                    Xác nhận ĐÃ THU TIỀN
                  </button>
                  <button
                    onClick={() => handleUpdateOrder(selectedOrder.id, { paymentStatus: 'REFUNDED' })}
                    className="px-3 py-1.5 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 font-mono font-bold"
                  >
                    Hoàn tiền
                  </button>
                </div>
                <div className="pt-2 flex items-center gap-2">
                  <Truck className="w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    defaultValue={selectedOrder.shipments?.[0]?.trackingCode || ''}
                    placeholder="Mã vận đơn (GHN/GHTK)..."
                    onBlur={(e) => {
                      if (e.target.value.trim()) {
                        handleUpdateOrder(selectedOrder.id, { trackingCode: e.target.value.trim() });
                      }
                    }}
                    className="flex-1 px-2.5 py-1.5 border border-slate-200 rounded-lg font-mono text-xs"
                  />
                </div>
              </div>

              <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center gap-1 text-[11px] font-mono text-slate-500 mb-2">
                  <QrCode className="w-3.5 h-3.5" />
                  <span>Mã VietQR đơn {selectedOrder.orderCode}</span>
                </div>
                <img
                  src={generateVietQrUrl({
                    bankId: cs?.bankId || 'MB',
                    accountNo: cs?.bankAccountNo || '0382851688',
                    accountName: cs?.bankAccountName || 'CAM CU HOUSE',
                    amount: selectedOrder.totalAmount,
                    memo: selectedOrder.orderCode,
                  })}
                  alt="VietQR"
                  className="w-32 h-32 object-contain rounded"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Draft Order Modal */}
      {showDraftModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <form onSubmit={handleCreateDraft} className="bg-white w-full max-w-md rounded-2xl p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900">Tạo Đơn Thủ Công (Zalo / Hotline)</h3>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-mono text-slate-600 mb-1">Nguồn đơn</label>
                <select
                  value={draftSource}
                  onChange={(e) => setDraftSource(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                >
                  <option value="ZALO">Zalo</option>
                  <option value="HOTLINE">Hotline</option>
                  <option value="WEB">Web</option>
                </select>
              </div>
              <div>
                <label className="block font-mono text-slate-600 mb-1">Thanh toán</label>
                <select
                  value={draftPayment}
                  onChange={(e) => setDraftPayment(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                >
                  <option value="VIETQR">Chuyển khoản VietQR</option>
                  <option value="COD">COD / Tiền mặt</option>
                </select>
              </div>
            </div>
            <input
              type="text"
              required
              value={draftName}
              onChange={(e) => setDraftName(e.target.value)}
              placeholder="Tên khách hàng"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
            />
            <input
              type="text"
              required
              value={draftPhone}
              onChange={(e) => setDraftPhone(e.target.value)}
              placeholder="Số điện thoại"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-mono"
            />
            <input
              type="text"
              value={draftAddress}
              onChange={(e) => setDraftAddress(e.target.value)}
              placeholder="Địa chỉ giao (để trống nếu nhận tại quán)"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
            />
            <div className="grid grid-cols-3 gap-2 text-xs">
              <select
                value={draftItemId}
                onChange={(e) => setDraftItemId(e.target.value)}
                className="col-span-2 px-3 py-2 border border-slate-200 rounded-xl"
              >
                {data.menu.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.vietnameseTitle} ({m.price.toLocaleString('vi-VN')}đ)
                  </option>
                ))}
              </select>
              <input
                type="number"
                min={1}
                value={draftQty}
                onChange={(e) => setDraftQty(e.target.value)}
                className="px-3 py-2 border border-slate-200 rounded-xl font-mono"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setShowDraftModal(false)} className="px-4 py-2 rounded-xl border text-xs">
                Hủy
              </button>
              <button
                type="submit"
                disabled={creating}
                className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold"
              >
                {creating ? 'Đang tạo...' : 'Lưu đơn hàng'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
