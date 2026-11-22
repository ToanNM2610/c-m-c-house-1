'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Ticket,
  Truck,
  CreditCard,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  Copy,
  RefreshCw,
  QrCode,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Loader2,
  ExternalLink,
  DollarSign,
  Calendar,
  Percent,
  User,
  Mail,
  Headphones,
  MessageCircle,
  Phone,
} from 'lucide-react';
import { broadcastCmsSync } from '@/lib/cms-sync';
import {
  VoucherRecord,
  ShippingZoneRecord,
  CommerceSettingsRecord,
  DiscountType,
} from '@/types';
import { POPULAR_BANKS, generateVietQrUrl } from '@/lib/vietqr';

export default function AdminVouchersShippingManager() {
  const [activeTab, setActiveTab] = useState<'vouchers' | 'shipping' | 'payments'>('vouchers');

  // ==========================================
  // TAB 1: VOUCHERS STATE
  // ==========================================
  const [vouchers, setVouchers] = useState<VoucherRecord[]>([]);
  const [loadingVouchers, setLoadingVouchers] = useState(false);
  const [isVoucherModalOpen, setIsVoucherModalOpen] = useState(false);
  const [editingVoucher, setEditingVoucher] = useState<VoucherRecord | null>(null);
  const [savingVoucher, setSavingVoucher] = useState(false);

  // ==========================================
  // TAB 2: SHIPPING ZONES STATE
  // ==========================================
  const [zones, setZones] = useState<ShippingZoneRecord[]>([]);
  const [loadingZones, setLoadingZones] = useState(false);
  const [isZoneModalOpen, setIsZoneModalOpen] = useState(false);
  const [editingZone, setEditingZone] = useState<ShippingZoneRecord | null>(null);
  const [savingZone, setSavingZone] = useState(false);

  // ==========================================
  // TAB 3: COMMERCE & PAYMENT SETTINGS STATE
  // ==========================================
  const [settings, setSettings] = useState<CommerceSettingsRecord>({
    id: 'default',
    commerceEnabled: true,
    enableDelivery: true,
    enablePickup: true,
    enableDineInBbq: true,
    enableVietQr: true,
    enableCod: true,
    enableEwallet: false,
    enableCard: false,
    bankId: 'MB',
    bankAccountNo: '0382851688',
    bankAccountName: 'CAM CU HOUSE',
    vietQrTemplate: 'compact2',
    webhookSecret: 'camcu_sec_' + Math.random().toString(36).substring(2, 10),
    defaultFreeShipThreshold: 150000,
    orderNotificationEmail: 'camcuhouse@gmail.com',
    enableCustomerPortal: true,
    enableNewsletter: true,
    enableQuickSupportWidget: true,
    enableSupportHotline: true,
    enableSupportZalo: true,
    enableSupportMessenger: true,
    enableSupportWhatsApp: true,
  });
  const [loadingSettings, setLoadingSettings] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);

  // Toast
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    showToast('success', `Đã sao chép ${label}!`);
  };

  // ==========================================
  // FETCH DATA
  // ==========================================
  const fetchVouchers = useCallback(async () => {
    setLoadingVouchers(true);
    try {
      const res = await fetch('/api/admin/commerce/vouchers', { credentials: 'include' });
      const json = await res.json().catch(() => ({}));
      if (res.ok && json.success && Array.isArray(json.data)) {
        setVouchers(json.data);
      } else if (res.ok && Array.isArray(json.vouchers)) {
        setVouchers(json.vouchers);
      } else {
        setVouchers(DEFAULT_VOUCHERS);
      }
    } catch {
      setVouchers(DEFAULT_VOUCHERS);
    } finally {
      setLoadingVouchers(false);
    }
  }, []);

  const fetchZones = useCallback(async () => {
    setLoadingZones(true);
    try {
      const res = await fetch('/api/admin/commerce/shipping-zones', { credentials: 'include' });
      const json = await res.json().catch(() => ({}));
      if (res.ok && json.success && Array.isArray(json.data)) {
        setZones(json.data);
      } else if (res.ok && Array.isArray(json.zones)) {
        setZones(json.zones);
      } else {
        setZones(DEFAULT_SHIPPING_ZONES);
      }
    } catch {
      setZones(DEFAULT_SHIPPING_ZONES);
    } finally {
      setLoadingZones(false);
    }
  }, []);

  const fetchSettings = useCallback(async () => {
    setLoadingSettings(true);
    try {
      const res = await fetch('/api/admin/commerce/settings', { credentials: 'include' });
      const json = await res.json().catch(() => ({}));
      if (res.ok && (json.data || json.settings)) {
        setSettings((prev) => ({ ...prev, ...(json.data || json.settings) }));
      }
    } catch {
      // Keep defaults
    } finally {
      setLoadingSettings(false);
    }
  }, []);

  useEffect(() => {
    fetchVouchers();
    fetchZones();
    fetchSettings();
  }, [fetchVouchers, fetchZones, fetchSettings]);

  // ==========================================
  // VOUCHER ACTIONS
  // ==========================================
  const openNewVoucherModal = () => {
    setEditingVoucher({
      id: '',
      code: '',
      nameVi: '',
      nameEn: '',
      discountType: 'PERCENT',
      discountValue: 10,
      maxDiscount: 30000,
      minOrderAmount: 100000,
      usageLimit: 100,
      usedCount: 0,
      startsAt: new Date().toISOString().split('T')[0],
      expiresAt: '',
      isActive: true,
    });
    setIsVoucherModalOpen(true);
  };

  const openEditVoucherModal = (v: VoucherRecord) => {
    setEditingVoucher({ ...v });
    setIsVoucherModalOpen(true);
  };

  const handleSaveVoucher = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingVoucher || !editingVoucher.code.trim()) {
      showToast('error', 'Vui lòng nhập mã Voucher');
      return;
    }

    setSavingVoucher(true);
    try {
      const isCreate = !editingVoucher.id;
      const method = isCreate ? 'POST' : 'PUT';
      const cleanCode = editingVoucher.code.trim().toUpperCase();
      const res = await fetch('/api/admin/commerce/vouchers', {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          ...editingVoucher,
          code: cleanCode,
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok && (json.success || !json.error)) {
        showToast('success', isCreate ? 'Tạo mã giảm giá thành công' : 'Đã cập nhật mã giảm giá');
        setIsVoucherModalOpen(false);
        fetchVouchers();
      } else {
        showToast('error', json.error || 'Lỗi lưu mã giảm giá');
      }
    } catch {
      showToast('error', 'Lỗi kết nối lưu mã');
    } finally {
      setSavingVoucher(false);
    }
  };

  const handleDeleteVoucher = async (voucherId: string) => {
    if (!window.confirm('Bạn có chắc muốn xóa mã giảm giá này không?')) return;
    try {
      const res = await fetch(`/api/admin/commerce/vouchers?id=${voucherId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok && (json.success || !json.error)) {
        showToast('success', 'Đã xóa mã giảm giá');
        setVouchers((prev) => prev.filter((v) => v.id !== voucherId));
      } else {
        showToast('error', json.error || 'Lỗi xóa voucher');
      }
    } catch {
      showToast('error', 'Lỗi kết nối');
    }
  };

  const handleToggleVoucherActive = async (v: VoucherRecord) => {
    try {
      const res = await fetch('/api/admin/commerce/vouchers', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ id: v.id, isActive: !v.isActive }),
      });
      if (res.ok) {
        showToast('success', `Đã ${!v.isActive ? 'bật' : 'tắt'} mã ${v.code}`);
        setVouchers((prev) =>
          prev.map((item) => (item.id === v.id ? { ...item, isActive: !item.isActive } : item))
        );
      }
    } catch {
      showToast('error', 'Lỗi đổi trạng thái');
    }
  };

  // ==========================================
  // SHIPPING ZONE ACTIONS
  // ==========================================
  const openNewZoneModal = () => {
    setEditingZone({
      id: '',
      nameVi: '',
      nameEn: '',
      fee: 15000,
      freeShipThreshold: 150000,
      estimatedTimeVi: '20 - 35 phút',
      estimatedTimeEn: '20 - 35 mins',
      sortOrder: (zones.length + 1) * 10,
      isActive: true,
    });
    setIsZoneModalOpen(true);
  };

  const openEditZoneModal = (z: ShippingZoneRecord) => {
    setEditingZone({ ...z });
    setIsZoneModalOpen(true);
  };

  const handleSaveZone = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingZone || !editingZone.nameVi.trim()) {
      showToast('error', 'Vui lòng nhập tên khu vực');
      return;
    }

    setSavingZone(true);
    try {
      const isCreate = !editingZone.id;
      const method = isCreate ? 'POST' : 'PUT';
      const res = await fetch('/api/admin/commerce/shipping-zones', {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(editingZone),
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok && (json.success || !json.error)) {
        showToast('success', isCreate ? 'Tạo khu vực giao hàng thành công' : 'Đã cập nhật khu vực');
        setIsZoneModalOpen(false);
        fetchZones();
      } else {
        showToast('error', json.error || 'Lỗi lưu khu vực giao hàng');
      }
    } catch {
      showToast('error', 'Lỗi kết nối lưu khu vực');
    } finally {
      setSavingZone(false);
    }
  };

  const handleDeleteZone = async (zoneId: string) => {
    if (!window.confirm('Bạn có chắc muốn xóa khu vực giao hàng này?')) return;
    try {
      const res = await fetch(`/api/admin/commerce/shipping-zones?id=${zoneId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok && (json.success || !json.error)) {
        showToast('success', 'Đã xóa khu vực');
        setZones((prev) => prev.filter((z) => z.id !== zoneId));
      } else {
        showToast('error', json.error || 'Lỗi xóa khu vực');
      }
    } catch {
      showToast('error', 'Lỗi kết nối');
    }
  };

  // ==========================================
  // SETTINGS & PAYMENT GATEWAY ACTIONS
  // ==========================================
  const handleSaveSettings = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSavingSettings(true);
    try {
      const res = await fetch('/api/admin/commerce/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(settings),
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok && (json.success || !json.error)) {
        showToast('success', 'Đã lưu cấu hình bán hàng & cổng thanh toán');
        broadcastCmsSync('commerce_settings');
      } else {
        showToast('error', json.error || 'Lỗi lưu cấu hình');
      }
    } catch {
      showToast('error', 'Lỗi kết nối lưu cấu hình');
    } finally {
      setSavingSettings(false);
    }
  };

  // Live VietQR preview URL generator
  const liveVietQrPreviewUrl = generateVietQrUrl({
    bankId: settings.bankId || 'MB',
    accountNo: settings.bankAccountNo || '0382851688',
    accountName: settings.bankAccountName || 'CAM CU HOUSE',
    amount: 50000,
    memo: 'CAMCU TEST',
    template: settings.vietQrTemplate || 'compact2',
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400">
            <Ticket className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">
              Mã giảm giá, Ship & Thanh toán
            </h1>
            <p className="text-xs text-slate-400">
              Quản lý khuyến mãi voucher, khu vực & phí vận chuyển, cổng VietQR và thiết lập bán hàng
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 bg-slate-800/80 p-1 rounded-xl border border-slate-700/80">
          <button
            type="button"
            onClick={() => setActiveTab('vouchers')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'vouchers'
                ? 'bg-emerald-600 text-white shadow'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Mã giảm giá ({vouchers.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('shipping')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'shipping'
                ? 'bg-emerald-600 text-white shadow'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Phí vận chuyển ({zones.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('payments')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'payments'
                ? 'bg-emerald-600 text-white shadow'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Cổng thanh toán & VietQR
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* TAB 1: VOUCHERS CRUD */}
      {/* ========================================================= */}
      {activeTab === 'vouchers' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-slate-900/90 border border-slate-800 p-4 rounded-2xl">
            <div>
              <h2 className="text-sm font-bold text-white">Chương trình Mã Khuyến Mãi (Vouchers)</h2>
              <p className="text-xs text-slate-400">
                Tạo mã giảm theo %, giảm tiền trực tiếp hoặc miễn phí giao hàng cho đơn online
              </p>
            </div>
            <button
              type="button"
              onClick={openNewVoucherModal}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Tạo Mã Khuyến Mãi</span>
            </button>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-800/60 text-slate-400 font-semibold uppercase tracking-wider">
                    <th className="py-3 px-4">Mã Voucher & Tên</th>
                    <th className="py-3 px-4 text-center">Loại giảm</th>
                    <th className="py-3 px-4 text-right">Mức giảm</th>
                    <th className="py-3 px-4 text-right">Đơn tối thiểu</th>
                    <th className="py-3 px-4 text-center">Lượt dùng</th>
                    <th className="py-3 px-4 text-center">Trạng thái</th>
                    <th className="py-3 px-4 text-center">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {vouchers.map((v) => (
                    <tr key={v.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-emerald-400 text-sm bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                            {v.code}
                          </span>
                          <span className="font-semibold text-white">{v.nameVi}</span>
                        </div>
                        {v.expiresAt && (
                          <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-slate-500" />
                            <span>
                              Hết hạn: {new Date(v.expiresAt).toLocaleDateString('vi-VN')}
                            </span>
                          </div>
                        )}
                      </td>

                      <td className="py-3 px-4 text-center">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold border ${
                            v.discountType === 'PERCENT'
                              ? 'bg-purple-500/15 text-purple-300 border-purple-500/30'
                              : v.discountType === 'FIXED'
                              ? 'bg-sky-500/15 text-sky-300 border-sky-500/30'
                              : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                          }`}
                        >
                          {v.discountType === 'PERCENT'
                            ? 'Giảm %'
                            : v.discountType === 'FIXED'
                            ? 'Giảm tiền'
                            : 'Freeship'}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right font-mono font-bold text-white">
                        {v.discountType === 'PERCENT'
                          ? `${v.discountValue}% (tối đa ${v.maxDiscount?.toLocaleString('vi-VN')}đ)`
                          : v.discountType === 'FIXED'
                          ? `-${v.discountValue.toLocaleString('vi-VN')}đ`
                          : 'Miễn phí ship'}
                      </td>

                      <td className="py-3 px-4 text-right font-mono text-slate-300">
                        {v.minOrderAmount.toLocaleString('vi-VN')}đ
                      </td>

                      <td className="py-3 px-4 text-center font-mono text-xs">
                        <span className="text-emerald-400 font-bold">{v.usedCount}</span>
                        <span className="text-slate-500"> / {v.usageLimit ?? '∞'}</span>
                      </td>

                      <td className="py-3 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleVoucherActive(v)}
                          className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border transition-all ${
                            v.isActive
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                              : 'bg-slate-800 text-slate-500 border-slate-700'
                          }`}
                        >
                          {v.isActive ? 'Đang bật' : 'Tạm tắt'}
                        </button>
                      </td>

                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => openEditVoucherModal(v)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteVoucher(v.id)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-500/20 text-slate-300 hover:text-rose-400"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: SHIPPING ZONES CRUD */}
      {/* ========================================================= */}
      {activeTab === 'shipping' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-slate-900/90 border border-slate-800 p-4 rounded-2xl">
            <div>
              <h2 className="text-sm font-bold text-white">Khu Vực & Phí Vận Chuyển (Shipping Zones)</h2>
              <p className="text-xs text-slate-400">
                Cấu hình khoảng cách, phí ship và ngưỡng miễn phí vận chuyển tại TP. Gia Nghĩa
              </p>
            </div>
            <button
              type="button"
              onClick={openNewZoneModal}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm Khu Vực Ship</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {zones.map((z) => (
              <div
                key={z.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between space-y-3 hover:border-slate-700 transition-colors"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-bold text-white text-sm">{z.nameVi}</h3>
                      {z.nameEn && (
                        <div className="text-[11px] text-slate-400">({z.nameEn})</div>
                      )}
                    </div>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${
                        z.isActive
                          ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                          : 'bg-slate-800 text-slate-500 border-slate-700'
                      }`}
                    >
                      {z.isActive ? 'Bật' : 'Tắt'}
                    </span>
                  </div>

                  <div className="mt-3 space-y-1.5 text-xs">
                    <div className="flex justify-between py-1 border-b border-slate-800/80">
                      <span className="text-slate-400">Phí giao hàng:</span>
                      <span className="font-mono font-bold text-white">
                        {z.fee === 0 ? 'Miễn phí' : `${z.fee.toLocaleString('vi-VN')}đ`}
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-800/80">
                      <span className="text-slate-400">Freeship từ:</span>
                      <span className="font-mono text-emerald-400 font-semibold">
                        {z.freeShipThreshold
                          ? `${z.freeShipThreshold.toLocaleString('vi-VN')}đ`
                          : 'Không áp dụng'}
                      </span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-400">Thời gian dự kiến:</span>
                      <span className="text-slate-300">{z.estimatedTimeVi || '20 - 35 phút'}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-1.5 border-t border-slate-800 pt-3">
                  <button
                    type="button"
                    onClick={() => openEditZoneModal(z)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteZone(z.id)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-500/20 text-slate-300 hover:text-rose-400"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 3: PAYMENT GATEWAYS & VIETQR */}
      {/* ========================================================= */}
      {activeTab === 'payments' && (
        <form onSubmit={handleSaveSettings} className="space-y-6">
          {/* Master Switches */}
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-emerald-400" />
                  <span>Hệ thống Bán Hàng & Hình thức phục vụ</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Bật/tắt tổng thể giỏ hàng và các loại hình dịch vụ cho khách đặt món online
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {/* Customer Portal Toggle */}
                <label className="flex items-center gap-2 cursor-pointer bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700 hover:border-slate-600 transition-colors">
                  <input
                    type="checkbox"
                    checked={settings.enableCustomerPortal !== false}
                    onChange={(e) =>
                      setSettings({ ...settings, enableCustomerPortal: e.target.checked })
                    }
                    className="rounded border-slate-600 text-emerald-600 focus:ring-0"
                  />
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-sky-400" />
                    <span>{settings.enableCustomerPortal !== false ? 'Tài khoản khách: BẬT' : 'Tài khoản khách: TẮT'}</span>
                  </span>
                </label>

                {/* Master toggle */}
                <label className="flex items-center gap-2 cursor-pointer bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700 hover:border-slate-600 transition-colors">
                  <input
                    type="checkbox"
                    checked={settings.commerceEnabled}
                    onChange={(e) =>
                      setSettings({ ...settings, commerceEnabled: e.target.checked })
                    }
                    className="rounded border-slate-600 text-emerald-600 focus:ring-0"
                  />
                  <span className="text-xs font-bold text-white">
                    {settings.commerceEnabled ? 'Hệ thống Bán hàng: BẬT' : 'Hệ thống Bán hàng: TẮT'}
                  </span>
                </label>
              </div>
            </div>

            {/* Service types */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <label className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-800 bg-slate-800/40 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.enableDelivery}
                  onChange={(e) =>
                    setSettings({ ...settings, enableDelivery: e.target.checked })
                  }
                  className="rounded border-slate-600 text-emerald-600 focus:ring-0"
                />
                <div>
                  <div className="text-xs font-bold text-white">Giao hàng tận nơi</div>
                  <div className="text-[11px] text-slate-400">Shipper giao tận nhà</div>
                </div>
              </label>

              <label className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-800 bg-slate-800/40 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.enablePickup}
                  onChange={(e) =>
                    setSettings({ ...settings, enablePickup: e.target.checked })
                  }
                  className="rounded border-slate-600 text-emerald-600 focus:ring-0"
                />
                <div>
                  <div className="text-xs font-bold text-white">Đến quán mang về</div>
                  <div className="text-[11px] text-slate-400">Khách ghé lấy tự túc</div>
                </div>
              </label>

              <label className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-800 bg-slate-800/40 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.enableDineInBbq}
                  onChange={(e) =>
                    setSettings({ ...settings, enableDineInBbq: e.target.checked })
                  }
                  className="rounded border-slate-600 text-emerald-600 focus:ring-0"
                />
                <div>
                  <div className="text-xs font-bold text-white">Tại quán & BBQ Suối</div>
                  <div className="text-[11px] text-slate-400">Thưởng thức tại quán</div>
                </div>
              </label>
            </div>
          </div>

          {/* Payment Methods Switches */}
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
            <h3 className="text-sm font-bold text-white">Phương Thức Thanh Toán Khả Dụng</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <label className="flex items-center gap-2 p-3 rounded-xl border border-slate-800 bg-slate-800/40 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.enableVietQr}
                  onChange={(e) =>
                    setSettings({ ...settings, enableVietQr: e.target.checked })
                  }
                  className="rounded border-slate-600 text-emerald-600 focus:ring-0"
                />
                <span className="text-xs font-bold text-emerald-400">VietQR 24/7 (Khuyên dùng)</span>
              </label>

              <label className="flex items-center gap-2 p-3 rounded-xl border border-slate-800 bg-slate-800/40 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.enableCod}
                  onChange={(e) =>
                    setSettings({ ...settings, enableCod: e.target.checked })
                  }
                  className="rounded border-slate-600 text-emerald-600 focus:ring-0"
                />
                <span className="text-xs font-bold text-white">Tiền mặt COD</span>
              </label>

              <label className="flex items-center gap-2 p-3 rounded-xl border border-slate-800 bg-slate-800/40 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.enableEwallet}
                  onChange={(e) =>
                    setSettings({ ...settings, enableEwallet: e.target.checked })
                  }
                  className="rounded border-slate-600 text-emerald-600 focus:ring-0"
                />
                <span className="text-xs font-bold text-white">Ví MoMo / ZaloPay</span>
              </label>

              <label className="flex items-center gap-2 p-3 rounded-xl border border-slate-800 bg-slate-800/40 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.enableCard}
                  onChange={(e) =>
                    setSettings({ ...settings, enableCard: e.target.checked })
                  }
                  className="rounded border-slate-600 text-emerald-600 focus:ring-0"
                />
                <span className="text-xs font-bold text-white">Thẻ ATM / Visa / Master</span>
              </label>
            </div>
          </div>

          {/* VietQR Bank Configuration & Live Preview */}
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-5">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <QrCode className="w-5 h-5 text-emerald-400" />
                <span>Cấu hình Ngân hàng thụ hưởng VietQR</span>
              </h3>
              <p className="text-xs text-slate-400">
                Mã QR động sẽ tự động chèn đúng số tiền và mã đơn hàng để khách chuyển khoản chính xác tuyệt đối
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
              {/* Bank Inputs */}
              <div className="lg:col-span-2 space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Ngân hàng thụ hưởng *
                  </label>
                  <select
                    value={settings.bankId}
                    onChange={(e) => setSettings({ ...settings, bankId: e.target.value })}
                    className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    {POPULAR_BANKS.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.id} - {b.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">
                      Số tài khoản ngân hàng *
                    </label>
                    <input
                      type="text"
                      required
                      value={settings.bankAccountNo}
                      onChange={(e) =>
                        setSettings({ ...settings, bankAccountNo: e.target.value })
                      }
                      placeholder="VD: 0382851688"
                      className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">
                      Tên chủ tài khoản (Viết hoa không dấu) *
                    </label>
                    <input
                      type="text"
                      required
                      value={settings.bankAccountName}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          bankAccountName: e.target.value.toUpperCase(),
                        })
                      }
                      placeholder="VD: NGUYEN VAN A / CAM CU HOUSE"
                      className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs font-mono uppercase text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">
                      Mẫu VietQR
                    </label>
                    <select
                      value={settings.vietQrTemplate}
                      onChange={(e) =>
                        setSettings({ ...settings, vietQrTemplate: e.target.value })
                      }
                      className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                    >
                      <option value="compact2">Compact 2 (Gọn đẹp kèm logo)</option>
                      <option value="compact">Compact (Tiêu chuẩn)</option>
                      <option value="qr_only">QR Only (Chỉ mã QR)</option>
                      <option value="print">Print (Bản in)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">
                      Email nhận thông báo đơn hàng mới
                    </label>
                    <input
                      type="email"
                      value={settings.orderNotificationEmail || ''}
                      onChange={(e) =>
                        setSettings({ ...settings, orderNotificationEmail: e.target.value })
                      }
                      placeholder="camcuhouse@gmail.com"
                      className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>

              {/* LIVE VIETQR PREVIEW CARD */}
              <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-4 text-center space-y-2.5">
                <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center justify-center gap-1.5">
                  <QrCode className="w-4 h-4" />
                  <span>Xem trước VietQR Live</span>
                </div>
                <div className="bg-white p-2.5 rounded-xl shadow-md inline-block max-w-[200px] mx-auto">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={liveVietQrPreviewUrl}
                    alt="VietQR Live Preview"
                    className="w-full h-auto object-contain rounded"
                  />
                </div>
                <div className="text-[11px] text-slate-400 space-y-0.5">
                  <div className="font-mono text-white font-semibold">
                    {settings.bankAccountNo} • {settings.bankId}
                  </div>
                  <div className="uppercase font-mono text-slate-300">
                    {settings.bankAccountName}
                  </div>
                  <div className="text-emerald-400/90 text-[10px]">
                    Quét thử bằng App ngân hàng bất kỳ
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Webhook Secret & Auto-verification (SePay / Casso / PayOS) */}
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-3.5">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-sky-400" />
                <span>Webhook Đối Soát Chuyển Khoản Tự Động</span>
              </h3>
              <p className="text-xs text-slate-400">
                Tích hợp SePay, Casso hoặc PayOS để hệ thống tự động gạch nợ và đổi trạng thái đơn sang &quot;Đã thanh toán&quot; ngay khi tiền vào tài khoản
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Webhook URL (Dán vào SePay/Casso webhook setting):
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value="https://camcuhouse.online/api/commerce/payments/webhook"
                    className="flex-1 p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs font-mono text-slate-300 select-all"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      copyToClipboard(
                        'https://camcuhouse.online/api/commerce/payments/webhook',
                        'Webhook URL'
                      )
                    }
                    className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium border border-slate-700 flex items-center gap-1.5"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Sao chép</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Webhook Secret Key (Khóa bí mật):
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={settings.webhookSecret || ''}
                    onChange={(e) =>
                      setSettings({ ...settings, webhookSecret: e.target.value })
                    }
                    className="flex-1 p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs font-mono text-slate-300"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      copyToClipboard(settings.webhookSecret || '', 'Secret Key')
                    }
                    className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium border border-slate-700 flex items-center gap-1.5"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Sao chép</span>
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setSettings({
                        ...settings,
                        webhookSecret: 'camcu_sec_' + Math.random().toString(36).substring(2, 12),
                      })
                    }
                    className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium border border-slate-700 flex items-center gap-1.5"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Tạo mới</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Support Channels & Floating Widget */}
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Headphones className="w-5 h-5 text-emerald-400" />
                  <span>Nút Nổi Hỗ Trợ Nhanh Bên Suối & Kênh Liên Hệ</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Bật/tắt nút nổi góc màn hình và từng kênh liên hệ (Hotline, Zalo, Messenger, WhatsApp) trên storefront
                </p>
              </div>

              {/* Master Widget Toggle */}
              <label className="flex items-center gap-2 cursor-pointer bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700 hover:border-slate-600 transition-colors">
                <input
                  type="checkbox"
                  checked={settings.enableQuickSupportWidget !== false}
                  onChange={(e) =>
                    setSettings({ ...settings, enableQuickSupportWidget: e.target.checked })
                  }
                  className="rounded border-slate-600 text-emerald-600 focus:ring-0"
                />
                <span className="text-xs font-bold text-white">
                  {settings.enableQuickSupportWidget !== false ? 'Nút Nổi Hỗ Trợ: BẬT' : 'Nút Nổi Hỗ Trợ: TẮT'}
                </span>
              </label>
            </div>

            {/* Individual Channel Toggles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Hotline */}
              <label className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-800 bg-slate-800/40 cursor-pointer hover:bg-slate-800/60 transition-colors">
                <input
                  type="checkbox"
                  checked={settings.enableSupportHotline !== false}
                  onChange={(e) =>
                    setSettings({ ...settings, enableSupportHotline: e.target.checked })
                  }
                  className="rounded border-slate-600 text-emerald-600 focus:ring-0"
                />
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-accent-botanical" />
                    <span>Hotline (0382851688)</span>
                  </div>
                  <div className="text-[11px] text-slate-400">Gọi điện thoại trực tiếp</div>
                </div>
              </label>

              {/* Zalo */}
              <label className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-800 bg-slate-800/40 cursor-pointer hover:bg-slate-800/60 transition-colors">
                <input
                  type="checkbox"
                  checked={settings.enableSupportZalo !== false}
                  onChange={(e) =>
                    setSettings({ ...settings, enableSupportZalo: e.target.checked })
                  }
                  className="rounded border-slate-600 text-emerald-600 focus:ring-0"
                />
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <MessageCircle className="w-3.5 h-3.5 text-blue-400" />
                    <span>Zalo Chat</span>
                  </div>
                  <div className="text-[11px] text-slate-400">Chat qua Zalo Official/Cá nhân</div>
                </div>
              </label>

              {/* Messenger */}
              <label className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-800 bg-slate-800/40 cursor-pointer hover:bg-slate-800/60 transition-colors">
                <input
                  type="checkbox"
                  checked={settings.enableSupportMessenger !== false}
                  onChange={(e) =>
                    setSettings({ ...settings, enableSupportMessenger: e.target.checked })
                  }
                  className="rounded border-slate-600 text-emerald-600 focus:ring-0"
                />
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <MessageCircle className="w-3.5 h-3.5 text-sky-400" />
                    <span>Facebook Messenger</span>
                  </div>
                  <div className="text-[11px] text-slate-400">Chat qua Facebook Fanpage</div>
                </div>
              </label>

              {/* WhatsApp */}
              <label className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-800 bg-slate-800/40 cursor-pointer hover:bg-slate-800/60 transition-colors">
                <input
                  type="checkbox"
                  checked={settings.enableSupportWhatsApp !== false}
                  onChange={(e) =>
                    setSettings({ ...settings, enableSupportWhatsApp: e.target.checked })
                  }
                  className="rounded border-slate-600 text-emerald-600 focus:ring-0"
                />
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                    <span>WhatsApp</span>
                  </div>
                  <div className="text-[11px] text-slate-400">Nhắn tin khách quốc tế</div>
                </div>
              </label>
            </div>
          </div>

          {/* Newsletter Subscription Toggle */}
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Mail className="w-5 h-5 text-amber-400" />
                  <span>Bản Tin Chân Trang (Newsletter)</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Hiển thị khung &quot;Đăng ký nhận bản tin Cẩm Cù House&quot; ở khu vực Footer trên toàn bộ trang web
                </p>
              </div>

              <label className="flex items-center gap-2 cursor-pointer bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700 hover:border-slate-600 transition-colors">
                <input
                  type="checkbox"
                  checked={settings.enableNewsletter !== false}
                  onChange={(e) =>
                    setSettings({ ...settings, enableNewsletter: e.target.checked })
                  }
                  className="rounded border-slate-600 text-emerald-600 focus:ring-0"
                />
                <span className="text-xs font-bold text-white">
                  {settings.enableNewsletter !== false ? 'Bản Tin Footer: BẬT' : 'Bản Tin Footer: TẮT'}
                </span>
              </label>
            </div>
          </div>

          {/* Submit button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={savingSettings}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg transition-all"
            >
              {savingSettings && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>Lưu Cấu Hình Thanh Toán & Bán Hàng</span>
            </button>
          </div>
        </form>
      )}

      {/* ========================================================= */}
      {/* MODAL: CREATE / EDIT VOUCHER */}
      {/* ========================================================= */}
      {isVoucherModalOpen && editingVoucher && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={() => setIsVoucherModalOpen(false)}
        >
          <div
            className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 text-white shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-base text-white">
                {editingVoucher.id ? 'Chỉnh sửa Mã Giảm Giá' : 'Tạo Mã Giảm Giá Mới'}
              </h3>
              <button
                onClick={() => setIsVoucherModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveVoucher} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Mã code (VIẾT HOA) *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingVoucher.code}
                    onChange={(e) =>
                      setEditingVoucher({
                        ...editingVoucher,
                        code: e.target.value.toUpperCase(),
                      })
                    }
                    placeholder="VD: CAMCU10, FREESHIP"
                    className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs font-mono font-bold text-emerald-400 uppercase focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Tên chương trình *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingVoucher.nameVi}
                    onChange={(e) =>
                      setEditingVoucher({ ...editingVoucher, nameVi: e.target.value })
                    }
                    placeholder="VD: Tri ân khách quen 10%"
                    className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Loại giảm giá
                  </label>
                  <select
                    value={editingVoucher.discountType}
                    onChange={(e) =>
                      setEditingVoucher({
                        ...editingVoucher,
                        discountType: e.target.value as DiscountType,
                      })
                    }
                    className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="PERCENT">Giảm theo %</option>
                    <option value="FIXED">Giảm tiền trực tiếp (VNĐ)</option>
                    <option value="FREE_SHIP">Miễn phí giao hàng</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Giá trị giảm ({editingVoucher.discountType === 'PERCENT' ? '%' : 'VNĐ'})
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={editingVoucher.discountValue}
                    onChange={(e) =>
                      setEditingVoucher({
                        ...editingVoucher,
                        discountValue: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {editingVoucher.discountType === 'PERCENT' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Giảm tối đa (VNĐ)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={editingVoucher.maxDiscount || ''}
                    onChange={(e) =>
                      setEditingVoucher({
                        ...editingVoucher,
                        maxDiscount: parseFloat(e.target.value) || undefined,
                      })
                    }
                    placeholder="VD: 30000"
                    className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Đơn hàng tối thiểu (VNĐ)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={editingVoucher.minOrderAmount}
                    onChange={(e) =>
                      setEditingVoucher({
                        ...editingVoucher,
                        minOrderAmount: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Giới hạn lượt dùng (để trống: vô hạn)
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={editingVoucher.usageLimit || ''}
                    onChange={(e) =>
                      setEditingVoucher({
                        ...editingVoucher,
                        usageLimit: parseInt(e.target.value, 10) || undefined,
                      })
                    }
                    placeholder="100"
                    className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Ngày hết hạn (tùy chọn)
                  </label>
                  <input
                    type="date"
                    value={editingVoucher.expiresAt ? String(editingVoucher.expiresAt).split('T')[0] : ''}
                    onChange={(e) =>
                      setEditingVoucher({
                        ...editingVoucher,
                        expiresAt: e.target.value ? new Date(e.target.value).toISOString() : null,
                      })
                    }
                    className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="flex items-center gap-2 pt-6">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-300">
                    <input
                      type="checkbox"
                      checked={editingVoucher.isActive}
                      onChange={(e) =>
                        setEditingVoucher({
                          ...editingVoucher,
                          isActive: e.target.checked,
                        })
                      }
                      className="rounded border-slate-700 text-emerald-600 focus:ring-0"
                    />
                    <span>Kích hoạt mã ngay</span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsVoucherModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={savingVoucher}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow"
                >
                  {savingVoucher && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{editingVoucher.id ? 'Lưu thay đổi' : 'Tạo mã voucher'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: CREATE / EDIT SHIPPING ZONE */}
      {/* ========================================================= */}
      {isZoneModalOpen && editingZone && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={() => setIsZoneModalOpen(false)}
        >
          <div
            className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 text-white shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-base text-white">
                {editingZone.id ? 'Chỉnh sửa Khu Vực Vận Chuyển' : 'Thêm Khu Vực Vận Chuyển'}
              </h3>
              <button
                onClick={() => setIsZoneModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveZone} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Tên khu vực (VI) *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingZone.nameVi}
                    onChange={(e) =>
                      setEditingZone({ ...editingZone, nameVi: e.target.value })
                    }
                    placeholder="VD: Nội ô TP. Gia Nghĩa (< 5km)"
                    className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Tên khu vực (EN)
                  </label>
                  <input
                    type="text"
                    value={editingZone.nameEn || ''}
                    onChange={(e) =>
                      setEditingZone({ ...editingZone, nameEn: e.target.value })
                    }
                    placeholder="VD: Gia Nghia Center (< 5km)"
                    className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Phí vận chuyển (VNĐ) *
                  </label>
                  <input
                    type="number"
                    min={0}
                    required
                    value={editingZone.fee}
                    onChange={(e) =>
                      setEditingZone({
                        ...editingZone,
                        fee: parseFloat(e.target.value) || 0,
                      })
                    }
                    placeholder="15000"
                    className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Freeship từ đơn (VNĐ)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={editingZone.freeShipThreshold || ''}
                    onChange={(e) =>
                      setEditingZone({
                        ...editingZone,
                        freeShipThreshold: parseFloat(e.target.value) || undefined,
                      })
                    }
                    placeholder="150000"
                    className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Thời gian giao ước tính (VI)
                  </label>
                  <input
                    type="text"
                    value={editingZone.estimatedTimeVi || ''}
                    onChange={(e) =>
                      setEditingZone({ ...editingZone, estimatedTimeVi: e.target.value })
                    }
                    placeholder="20 - 35 phút"
                    className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="flex items-center gap-2 pt-6">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-300">
                    <input
                      type="checkbox"
                      checked={editingZone.isActive}
                      onChange={(e) =>
                        setEditingZone({ ...editingZone, isActive: e.target.checked })
                      }
                      className="rounded border-slate-700 text-emerald-600 focus:ring-0"
                    />
                    <span>Kích hoạt khu vực</span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsZoneModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={savingZone}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow"
                >
                  {savingZone && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{editingZone.id ? 'Lưu thay đổi' : 'Thêm khu vực'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div
          role="status"
          className={`fixed bottom-5 right-5 z-[70] px-4 py-2.5 rounded-xl text-xs font-semibold shadow-2xl flex items-center gap-2 border ${
            toast.type === 'success'
              ? 'bg-emerald-950 border-emerald-500/40 text-emerald-300'
              : 'bg-rose-950 border-rose-500/40 text-rose-300'
          }`}
        >
          {toast.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-400" />
          )}
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
}

// Default initial vouchers
const DEFAULT_VOUCHERS: VoucherRecord[] = [
  {
    id: 'v-camcu10',
    code: 'CAMCU10',
    nameVi: 'Chào bạn mới Cẩm Cù 10%',
    nameEn: 'Welcome 10% Off',
    discountType: 'PERCENT',
    discountValue: 10,
    maxDiscount: 30000,
    minOrderAmount: 80000,
    usageLimit: 500,
    usedCount: 24,
    isActive: true,
  },
  {
    id: 'v-freeship',
    code: 'FREESHIP',
    nameVi: 'Miễn phí vận chuyển Gia Nghĩa',
    nameEn: 'Free Delivery Gia Nghia',
    discountType: 'FREE_SHIP',
    discountValue: 15000,
    minOrderAmount: 150000,
    usageLimit: 200,
    usedCount: 18,
    isActive: true,
  },
];

// Default initial shipping zones
const DEFAULT_SHIPPING_ZONES: ShippingZoneRecord[] = [
  {
    id: 'zone-1',
    nameVi: 'Nội thành Gia Nghĩa (< 5km)',
    nameEn: 'Gia Nghia City (< 5km)',
    fee: 15000,
    freeShipThreshold: 150000,
    estimatedTimeVi: '20 - 30 phút',
    estimatedTimeEn: '20 - 30 mins',
    sortOrder: 10,
    isActive: true,
  },
  {
    id: 'zone-2',
    nameVi: 'Ven đô Gia Nghĩa (5 - 12km)',
    nameEn: 'Suburban Gia Nghia (5 - 12km)',
    fee: 25000,
    freeShipThreshold: 250000,
    estimatedTimeVi: '35 - 50 phút',
    estimatedTimeEn: '35 - 50 mins',
    sortOrder: 20,
    isActive: true,
  },
  {
    id: 'zone-3',
    nameVi: 'Ngoại thành / Liên huyện Đắk Nông',
    nameEn: 'Dak Nong Districts',
    fee: 40000,
    freeShipThreshold: 500000,
    estimatedTimeVi: 'Giao trong ngày',
    estimatedTimeEn: 'Same-day delivery',
    sortOrder: 30,
    isActive: true,
  },
];
