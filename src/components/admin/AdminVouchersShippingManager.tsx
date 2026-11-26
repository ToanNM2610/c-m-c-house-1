'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Tag, Truck, Plus, Trash2 } from 'lucide-react';

export default function AdminVouchersShippingManager() {
  const [vouchers, setVouchers] = useState<any[]>([]);
  const [zones, setZones] = useState<any[]>([]);
  const [code, setCode] = useState('');
  const [nameVi, setNameVi] = useState('');
  const [discountType, setDiscountType] = useState<'PERCENT' | 'FIXED' | 'FREE_SHIP'>('PERCENT');
  const [discountValue, setDiscountValue] = useState('10');
  const [minOrder, setMinOrder] = useState('100000');

  const [zoneName, setZoneName] = useState('');
  const [zoneFee, setZoneFee] = useState('15000');
  const [zoneFree, setZoneFree] = useState('300000');

  const fetchAll = useCallback(async () => {
    const [vRes, zRes] = await Promise.all([
      fetch('/api/admin/commerce/vouchers', { credentials: 'include' }),
      fetch('/api/admin/commerce/shipping-zones', { credentials: 'include' }),
    ]);
    const vJson = await vRes.json().catch(() => ({}));
    const zJson = await zRes.json().catch(() => ({}));
    if (vJson.success) setVouchers(vJson.data || []);
    if (zJson.success) setZones(zJson.data || []);
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const handleAddVoucher = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/admin/commerce/vouchers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        code,
        nameVi,
        discountType,
        discountValue: Number(discountValue) || 0,
        minOrderAmount: Number(minOrder) || 0,
      }),
    });
    if (res.ok) {
      setCode('');
      setNameVi('');
      fetchAll();
    }
  };

  const handleAddZone = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/admin/commerce/shipping-zones', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        nameVi: zoneName,
        fee: Number(zoneFee) || 0,
        freeShipThreshold: Number(zoneFree) || null,
      }),
    });
    if (res.ok) {
      setZoneName('');
      fetchAll();
    }
  };

  return (
    <div className="space-y-8">
      {/* Vouchers */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
        <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
          <Tag className="w-4 h-4 text-emerald-700" />
          <span>Mã Giảm Giá & Chương Trình Khuyến Mãi (Vouchers)</span>
        </div>

        <form onSubmit={handleAddVoucher} className="grid grid-cols-1 sm:grid-cols-6 gap-2.5 text-xs">
          <input
            type="text"
            required
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Mã (VD: CAMCU10)"
            className="px-3 py-2 border rounded-xl font-mono uppercase"
          />
          <input
            type="text"
            required
            value={nameVi}
            onChange={(e) => setNameVi(e.target.value)}
            placeholder="Tên chiến dịch"
            className="sm:col-span-2 px-3 py-2 border rounded-xl"
          />
          <select
            value={discountType}
            onChange={(e) => setDiscountType(e.target.value as any)}
            className="px-3 py-2 border rounded-xl"
          >
            <option value="PERCENT">% Giảm</option>
            <option value="FIXED">VNĐ cố định</option>
            <option value="FREE_SHIP">Freeship</option>
          </select>
          <input
            type="number"
            value={discountValue}
            onChange={(e) => setDiscountValue(e.target.value)}
            placeholder="Giá trị"
            className="px-3 py-2 border rounded-xl font-mono"
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold inline-flex items-center justify-center gap-1"
          >
            <Plus className="w-4 h-4" /> Tạo mã
          </button>
        </form>

        <div className="divide-y border rounded-xl">
          {vouchers.length === 0 ? (
            <div className="p-4 text-xs text-slate-500">Chưa có mã khuyến mãi nào.</div>
          ) : (
            vouchers.map((v) => (
              <div key={v.id} className="p-3 flex items-center justify-between text-xs">
                <div>
                  <span className="font-mono font-bold text-emerald-700 mr-2">{v.code}</span>
                  <span className="text-slate-800">{v.nameVi}</span>
                  <span className="ml-2 font-mono text-slate-500">
                    ({v.discountType}: {v.discountValue} · Đã dùng: {v.usedCount})
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={async () => {
                      await fetch('/api/admin/commerce/vouchers', {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        credentials: 'include',
                        body: JSON.stringify({ id: v.id, isActive: !v.isActive }),
                      });
                      fetchAll();
                    }}
                    className={`px-2.5 py-1 rounded-lg font-mono font-bold ${
                      v.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {v.isActive ? 'Đang bật' : 'Đang tắt'}
                  </button>
                  <button
                    onClick={async () => {
                      await fetch(`/api/admin/commerce/vouchers?id=${v.id}`, {
                        method: 'DELETE',
                        credentials: 'include',
                      });
                      fetchAll();
                    }}
                    className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Shipping Zones */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
        <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
          <Truck className="w-4 h-4 text-emerald-700" />
          <span>Khu Vực & Biểu Phí Giao Hàng</span>
        </div>

        <form onSubmit={handleAddZone} className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 text-xs">
          <input
            type="text"
            required
            value={zoneName}
            onChange={(e) => setZoneName(e.target.value)}
            placeholder="Tên khu vực (VD: P. Nghĩa Trung)"
            className="px-3 py-2 border rounded-xl"
          />
          <input
            type="number"
            value={zoneFee}
            onChange={(e) => setZoneFee(e.target.value)}
            placeholder="Phí ship (VNĐ)"
            className="px-3 py-2 border rounded-xl font-mono"
          />
          <input
            type="number"
            value={zoneFree}
            onChange={(e) => setZoneFree(e.target.value)}
            placeholder="Freeship từ (VNĐ)"
            className="px-3 py-2 border rounded-xl font-mono"
          />
          <button type="submit" className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold">
            + Thêm khu vực
          </button>
        </form>

        <div className="divide-y border rounded-xl">
          {zones.length === 0 ? (
            <div className="p-4 text-xs text-slate-500">Chưa có khu vực giao hàng nào.</div>
          ) : (
            zones.map((z) => (
              <div key={z.id} className="p-3 flex items-center justify-between text-xs">
                <div>
                  <span className="font-semibold text-slate-900">{z.nameVi}</span>
                  <span className="ml-2 font-mono text-emerald-700">
                    Phí: {Number(z.fee).toLocaleString('vi-VN')}đ
                  </span>
                  {z.freeShipThreshold && (
                    <span className="ml-2 font-mono text-slate-500">
                      (Freeship từ {Number(z.freeShipThreshold).toLocaleString('vi-VN')}đ)
                    </span>
                  )}
                </div>
                <button
                  onClick={async () => {
                    await fetch(`/api/admin/commerce/shipping-zones?id=${z.id}`, {
                      method: 'DELETE',
                      credentials: 'include',
                    });
                    fetchAll();
                  }}
                  className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
