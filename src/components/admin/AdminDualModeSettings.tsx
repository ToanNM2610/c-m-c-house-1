'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { ToggleRight, QrCode, MessageCircle, Save, RefreshCw, Check } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { POPULAR_BANKS } from '@/lib/vietqr';

export default function AdminDualModeSettings() {
  const { refreshData } = useApp();
  const [form, setForm] = useState<any>({
    commerceEnabled: false,
    enableCustomerPortal: false,
    enableDelivery: true,
    enablePickup: true,
    enableDineInBbq: true,
    enableCod: true,
    enableVietQr: true,
    bankId: 'MB',
    bankAccountNo: '0382851688',
    bankAccountName: 'CAM CU HOUSE',
    vatPercent: 0,
    defaultFreeShipThreshold: 300000,
    enableQuickSupportWidget: true,
    enableSupportHotline: true,
    enableSupportZalo: true,
    enableSupportMessenger: false,
    enableSupportWhatsApp: false,
    webhookSecret: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/commerce/settings', { credentials: 'include' });
      const json = await res.json();
      if (res.ok && json.success) {
        setForm((prev: any) => ({ ...prev, ...json.data }));
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch('/api/admin/commerce/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          ...form,
          vatPercent: Number(form.vatPercent) || 0,
          defaultFreeShipThreshold: Number(form.defaultFreeShipThreshold) || 0,
        }),
      });
      if (res.ok) {
        setSaved(true);
        await refreshData();
        setTimeout(() => setSaved(false), 3000);
      }
    } finally {
      setSaving(false);
    }
  };

  const Toggle = ({ field, label, desc }: { field: string; label: string; desc?: string }) => (
    <label className="flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-slate-50/70 cursor-pointer">
      <div>
        <div className="text-sm font-semibold text-slate-900">{label}</div>
        {desc && <div className="text-xs text-slate-500 mt-0.5">{desc}</div>}
      </div>
      <input
        type="checkbox"
        checked={Boolean(form[field])}
        onChange={(e) => setForm((p: any) => ({ ...p, [field]: e.target.checked }))}
        className="w-5 h-5 accent-emerald-600"
      />
    </label>
  );

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-700 font-bold uppercase tracking-wider mb-1">
            <ToggleRight className="w-4 h-4" />
            <span>PHÂN HỆ 7 • CÔNG TẮC CHẾ ĐỘ KÉP (GIỚI THIỆU ↔ BÁN HÀNG) & VIETQR</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            Điều Khiển Bật/Tắt Bán Hàng, Tài Khoản Khách & Kênh Hỗ Trợ Nổi
          </h2>
        </div>

        <button
          type="submit"
          disabled={saving || loading}
          className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-mono font-bold inline-flex items-center gap-2"
        >
          {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          <span>{saved ? 'Đã lưu & Đồng bộ' : 'Lưu Thay Đổi'}</span>
        </button>
      </div>

      {/* Master Dual-Mode Switches */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <h3 className="text-sm font-bold text-slate-900">1. Công tắc Tổng Chế độ Kép (Showcase ↔ E-Commerce)</h3>
        <Toggle
          field="commerceEnabled"
          label="Bật bán hàng online (commerceEnabled)"
          desc="Khi TẮT (Giai đoạn 1): ẩn sạch Giỏ hàng, + Thêm vào giỏ, Thanh toán trên camcuhouse.online."
        />
        <Toggle
          field="enableCustomerPortal"
          label="Hiển thị nút Tài khoản khách hàng (enableCustomerPortal)"
          desc="Khi TẮT: header camcuhouse.online vận hành gọn nhẹ thuần giới thiệu thương hiệu."
        />
      </div>

      {/* Floating Quick Support Channels */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <MessageCircle className="w-4 h-4 text-emerald-700" />
          <span>2. Kênh Hỗ Trợ Nhanh Nổi (Bong bóng góc phải)</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Toggle field="enableQuickSupportWidget" label="Bật Bong bóng Hỗ trợ nhanh (Tổng)" />
          <Toggle field="enableSupportHotline" label="Hiện Hotline (038 285 1688 & 077 465 9000)" />
          <Toggle field="enableSupportZalo" label="Hiện Zalo Chat" />
          <Toggle field="enableSupportMessenger" label="Hiện Facebook Messenger" />
          <Toggle field="enableSupportWhatsApp" label="Hiện WhatsApp" />
        </div>
      </div>

      {/* VietQR & Tax Config */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <QrCode className="w-4 h-4 text-emerald-700" />
          <span>3. Cấu hình VietQR, Thanh toán & Thuế VAT</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block font-mono text-slate-600 mb-1">Ngân hàng VietQR</label>
            <select
              value={form.bankId}
              onChange={(e) => setForm((p: any) => ({ ...p, bankId: e.target.value }))}
              className="w-full px-3 py-2 border rounded-xl"
            >
              {POPULAR_BANKS.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-mono text-slate-600 mb-1">Số tài khoản</label>
            <input
              type="text"
              value={form.bankAccountNo}
              onChange={(e) => setForm((p: any) => ({ ...p, bankAccountNo: e.target.value }))}
              className="w-full px-3 py-2 border rounded-xl font-mono"
            />
          </div>
          <div>
            <label className="block font-mono text-slate-600 mb-1">Tên chủ tài khoản (Không dấu)</label>
            <input
              type="text"
              value={form.bankAccountName}
              onChange={(e) => setForm((p: any) => ({ ...p, bankAccountName: e.target.value }))}
              className="w-full px-3 py-2 border rounded-xl font-mono uppercase"
            />
          </div>
          <div>
            <label className="block font-mono text-slate-600 mb-1">Thuế VAT (%)</label>
            <input
              type="number"
              min={0}
              max={20}
              value={form.vatPercent}
              onChange={(e) => setForm((p: any) => ({ ...p, vatPercent: e.target.value }))}
              className="w-full px-3 py-2 border rounded-xl font-mono"
            />
          </div>
          <div>
            <label className="block font-mono text-slate-600 mb-1">Ngưỡng Freeship mặc định (VNĐ)</label>
            <input
              type="number"
              value={form.defaultFreeShipThreshold}
              onChange={(e) => setForm((p: any) => ({ ...p, defaultFreeShipThreshold: e.target.value }))}
              className="w-full px-3 py-2 border rounded-xl font-mono"
            />
          </div>
          <div>
            <label className="block font-mono text-slate-600 mb-1">Webhook Secret (Che kín)</label>
            <input
              type="password"
              value={form.webhookSecret}
              onChange={(e) => setForm((p: any) => ({ ...p, webhookSecret: e.target.value }))}
              placeholder="Nhập để cập nhật khóa..."
              className="w-full px-3 py-2 border rounded-xl font-mono"
            />
          </div>
        </div>
      </div>
    </form>
  );
}
