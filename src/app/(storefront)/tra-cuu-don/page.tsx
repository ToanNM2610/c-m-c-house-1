'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Search,
  ArrowLeft,
  Package,
  Clock,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowRight,
  Phone,
  QrCode,
  MapPin,
  Calendar,
  Store,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { OrderRecord } from '@/types';

export default function GuestOrderLookupPage() {
  const { language } = useApp();
  const isEn = language === 'en';

  const [orderCode, setOrderCode] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [foundOrder, setFoundOrder] = useState<OrderRecord | null>(null);

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = orderCode.trim().replace(/^#/, '');
    const cleanPhone = phone.trim();

    if (!cleanCode) {
      setError(isEn ? 'Please enter your order code' : 'Vui lòng nhập mã đơn hàng');
      return;
    }

    setLoading(true);
    setError('');
    setFoundOrder(null);

    try {
      const url = cleanPhone
        ? `/api/commerce/orders/${encodeURIComponent(cleanCode)}?phone=${encodeURIComponent(cleanPhone)}`
        : `/api/commerce/orders/${encodeURIComponent(cleanCode)}`;

      const res = await fetch(url);
      const data = await res.json();

      if (res.ok && (data.order || data.id || data.orderCode)) {
        setFoundOrder(data.order || data);
      } else {
        setError(
          data.error ||
            (isEn
              ? 'No matching order found. Please verify your order code and phone number.'
              : 'Không tìm thấy đơn hàng phù hợp. Vui lòng kiểm tra lại mã đơn và số điện thoại.')
        );
      }
    } catch {
      setError(
        isEn
          ? 'Network error. Please try again later.'
          : 'Lỗi kết nối khi tra cứu đơn hàng. Vui lòng thử lại.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen pt-24 pb-20 bg-paper text-ink-primary">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        {/* Navigation */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-ink-muted hover:text-accent-botanical transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{isEn ? 'Home' : 'Trang chủ'}</span>
          </Link>
        </div>

        {/* Header */}
        <div className="text-center space-y-2 mb-8">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-accent-botanical/10 dark:bg-accent-botanical/20 flex items-center justify-center text-accent-botanical">
            <Search className="w-6 h-6" />
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-ink-primary">
            {isEn ? 'Track Guest Order' : 'Tra Cứu Đơn Hàng Nhanh'}
          </h1>
          <p className="text-xs text-ink-muted max-w-sm mx-auto">
            {isEn
              ? 'Enter your order code and contact phone number to view live preparation and delivery status.'
              : 'Nhập mã đơn hàng và số điện thoại để kiểm tra tiến trình chuẩn bị món và giao hàng thời gian thực.'}
          </p>
        </div>

        {/* Lookup Card Form */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-forest-900 border border-forest-100 dark:border-forest-800 shadow-subtle mb-8">
          <form onSubmit={handleLookup} className="space-y-4">
            <div className="space-y-1">
              <label className="block text-xs font-mono font-medium text-ink-muted">
                {isEn ? 'Order Code' : 'Mã đơn hàng'} *
              </label>
              <div className="relative">
                <Package className="w-4 h-4 text-ink-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={orderCode}
                  onChange={(e) => setOrderCode(e.target.value.toUpperCase())}
                  placeholder="Ví dụ: CC261122ABCD"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-paper dark:bg-forest-800 border border-forest-200 dark:border-forest-700 text-xs font-mono uppercase text-ink-primary focus:outline-none focus:border-accent-botanical"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-mono font-medium text-ink-muted">
                {isEn ? 'Phone Number' : 'Số điện thoại đặt món'} (tùy chọn)
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-ink-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="038 285 1688"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-paper dark:bg-forest-800 border border-forest-200 dark:border-forest-700 text-xs font-mono text-ink-primary focus:outline-none focus:border-accent-botanical"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !orderCode.trim()}
              className="w-full py-3.5 px-6 rounded-2xl bg-accent-botanical hover:bg-forest-800 text-white font-mono text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{isEn ? 'Searching...' : 'Đang tra cứu...'}</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>{isEn ? 'Search Order' : 'Tra Cứu Tiến Trình Đơn'}</span>
                </>
              )}
            </button>
          </form>

          {error && (
            <div className="mt-4 p-3.5 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-xs font-mono text-red-600 dark:text-red-400 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Found Order Card */}
        {foundOrder && (
          <div className="p-6 rounded-3xl bg-white dark:bg-forest-900 border border-forest-100 dark:border-forest-800 shadow-subtle space-y-5 animate-fadeIn">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-forest-100 dark:border-forest-800">
              <div>
                <span className="font-mono text-base font-bold text-accent-botanical">
                  #{foundOrder.orderCode}
                </span>
                <span className="text-xs font-mono text-ink-muted ml-3">
                  {new Date(foundOrder.createdAt).toLocaleDateString('vi-VN')}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                  {foundOrder.orderStatus}
                </span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  {foundOrder.paymentStatus}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
              <div>
                <span className="text-ink-muted block text-[10px]">{isEn ? 'Customer' : 'Khách hàng'}</span>
                <span className="font-bold text-ink-primary">
                  {foundOrder.customerName} ({foundOrder.customerPhone})
                </span>
              </div>
              <div>
                <span className="text-ink-muted block text-[10px]">{isEn ? 'Fulfillment' : 'Hình thức'}</span>
                <span className="font-bold text-ink-primary">{foundOrder.fulfillmentType}</span>
              </div>
            </div>

            {/* Items */}
            <div className="space-y-1.5 pt-2 border-t border-forest-100 dark:border-forest-800 text-xs font-mono">
              {foundOrder.items.map((i) => (
                <div key={i.id} className="flex justify-between text-ink-muted">
                  <span>
                    {i.quantity}x {i.itemNameVi}
                  </span>
                  <span className="text-ink-primary font-bold">
                    {(i.unitPrice * i.quantity).toLocaleString('vi-VN')}đ
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-forest-100 dark:border-forest-800 flex items-center justify-between">
              <div>
                <span className="text-xs font-mono text-ink-muted">{isEn ? 'Total: ' : 'Tổng tiền: '}</span>
                <span className="font-mono text-base font-bold text-accent-botanical">
                  {foundOrder.totalAmount.toLocaleString('vi-VN')}đ
                </span>
              </div>
              <Link
                href={`/don-hang/${foundOrder.orderCode}`}
                className="px-5 py-2 rounded-xl bg-accent-botanical hover:bg-forest-800 text-white font-mono text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <span>{isEn ? 'View Live Tracking & Bill' : 'Xem Biên Nhận & Thanh Toán QR'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

