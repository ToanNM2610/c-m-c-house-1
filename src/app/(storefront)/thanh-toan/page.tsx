'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShoppingBag,
  ArrowLeft,
  Truck,
  Store,
  UtensilsCrossed,
  Tag,
  CreditCard,
  QrCode,
  Banknote,
  Wallet,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ChevronRight,
  ShieldCheck,
  MapPin,
  User,
  Phone,
  Mail,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useCustomerAuth } from '@/context/CustomerAuthContext';
import { useApp } from '@/context/AppContext';
import { FulfillmentType, PaymentMethod, ShippingZoneRecord } from '@/types';

export default function CheckoutPage() {
  const router = useRouter();
  const { language, data } = useApp();
  const isEn = language === 'en';
  const { items, subtotal, clearCart, freeShipThreshold } = useCart();
  const { customer, addresses } = useCustomerAuth();
  const commerceEnabled = data.commerceSettings?.commerceEnabled !== false;

  // Step 1: Fulfillment & Customer Info
  const [fulfillmentType, setFulfillmentType] = useState<FulfillmentType>('DELIVERY');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [addressLine, setAddressLine] = useState('');
  const [wardDistrict, setWardDistrict] = useState('');
  const [selectedZoneId, setSelectedZoneId] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [customerNote, setCustomerNote] = useState('');

  // Shipping zones list
  const [shippingZones, setShippingZones] = useState<ShippingZoneRecord[]>([]);

  // Step 2: Voucher
  const [voucherCodeInput, setVoucherCodeInput] = useState('');
  const [appliedVoucher, setAppliedVoucher] = useState<{
    code: string;
    discountAmount: number;
    nameVi?: string;
    isFreeShip?: boolean;
  } | null>(null);
  const [voucherError, setVoucherError] = useState('');
  const [validatingVoucher, setValidatingVoucher] = useState(false);

  // Step 3: Payment Method
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('VIETQR');

  // Submit & Loading state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Prefill customer data if logged in
  useEffect(() => {
    if (customer) {
      setCustomerName((prev) => prev || customer.fullName || '');
      setCustomerPhone((prev) => prev || customer.phone || '');
      setCustomerEmail((prev) => prev || customer.email || '');

      // Check default address
      const defaultAddr = addresses.find((a) => a.isDefault) || addresses[0];
      if (defaultAddr) {
        setAddressLine((prev) => prev || defaultAddr.addressLine);
        setWardDistrict((prev) => prev || defaultAddr.wardDistrict);
      }
    }
  }, [customer, addresses]);

  // Load Shipping Zones
  useEffect(() => {
    fetch('/api/commerce/shipping-zones')
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        const list = Array.isArray(data) ? data : data?.data || [];
        setShippingZones(list);
        if (list.length > 0) {
          setSelectedZoneId((prev) => prev || list[0].id);
        }
      })
      .catch(() => {
        // Fallback default zone
        const fallback: ShippingZoneRecord = {
          id: 'default-zone',
          nameVi: 'Đông Gia Nghĩa (Bán kính 5km)',
          nameEn: 'Dong Gia Nghia (Radius 5km)',
          fee: 15000,
          freeShipThreshold: 150000,
          sortOrder: 1,
          isActive: true,
        };
        setShippingZones([fallback]);
        setSelectedZoneId((prev) => prev || fallback.id);
      });
  }, []);

  const selectedZone = shippingZones.find((z) => z.id === selectedZoneId) || shippingZones[0];

  // Calculate Shipping Fee
  let shippingFee = 0;
  if (fulfillmentType === 'DELIVERY') {
    const zoneThreshold = selectedZone?.freeShipThreshold || freeShipThreshold || 150000;
    const isFreeByThreshold = subtotal >= zoneThreshold;
    const isFreeByVoucher = appliedVoucher?.isFreeShip;

    if (isFreeByThreshold || isFreeByVoucher) {
      shippingFee = 0;
    } else {
      shippingFee = selectedZone?.fee || 15000;
    }
  }

  // Calculate Total
  const discountAmount = appliedVoucher?.discountAmount || 0;
  const totalAmount = Math.max(0, subtotal + shippingFee - discountAmount);

  // Validate Voucher
  const handleApplyVoucher = async () => {
    const code = voucherCodeInput.trim().toUpperCase();
    if (!code) return;
    setVoucherError('');
    setValidatingVoucher(true);

    try {
      const res = await fetch('/api/commerce/vouchers/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, subtotal }),
      });
      const data = await res.json();
      if (res.ok && data.valid) {
        setAppliedVoucher({
          code: data.code,
          discountAmount: data.discountAmount || 0,
          nameVi: data.nameVi,
          isFreeShip: data.discountType === 'FREE_SHIP',
        });
        setVoucherCodeInput('');
      } else {
        setVoucherError(data.error || (isEn ? 'Invalid or expired voucher code' : 'Mã giảm giá không hợp lệ hoặc đã hết hạn'));
      }
    } catch {
      setVoucherError(isEn ? 'Failed to validate voucher' : 'Không thể kiểm tra mã giảm giá lúc này');
    } finally {
      setValidatingVoucher(false);
    }
  };

  const handleRemoveVoucher = () => {
    setAppliedVoucher(null);
    setVoucherError('');
  };

  // Submit Order
  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!commerceEnabled) {
      setErrorMessage(isEn ? 'Online ordering is currently paused' : 'Hệ thống đặt món trực tuyến đang tạm ngưng');
      return;
    }

  if (items.length === 0) {
      setErrorMessage(isEn ? 'Your cart is empty' : 'Giỏ hàng đang trống');
      return;
    }

    if (!customerName.trim()) {
      setErrorMessage(isEn ? 'Please provide recipient name' : 'Vui lòng nhập họ tên người nhận');
      return;
    }

    if (!customerPhone.trim()) {
      setErrorMessage(isEn ? 'Please provide phone number' : 'Vui lòng nhập số điện thoại');
      return;
    }

    if (fulfillmentType === 'DELIVERY' && (!addressLine.trim() || !wardDistrict.trim())) {
      setErrorMessage(isEn ? 'Please provide complete delivery address' : 'Vui lòng nhập đầy đủ địa chỉ giao hàng');
      return;
    }

    setIsSubmitting(true);

    const fullShippingAddress =
      fulfillmentType === 'DELIVERY'
        ? `${addressLine.trim()}, ${wardDistrict.trim()}`
        : undefined;

    const payload = {
      fulfillmentType,
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      customerEmail: customerEmail.trim() || undefined,
      shippingAddress: fullShippingAddress,
      shippingZoneId: fulfillmentType === 'DELIVERY' ? selectedZoneId : undefined,
      scheduledTime: scheduledTime.trim() || undefined,
      customerNote: customerNote.trim() || undefined,
      voucherCode: appliedVoucher?.code || undefined,
      paymentMethod,
      items: items.map((i) => ({
        menuItemId: i.menuItemId,
        quantity: i.quantity,
        selectedOptions: i.selectedOptions,
        itemNote: i.itemNote,
      })),
    };

    try {
      const res = await fetch('/api/commerce/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.success && data.orderCode) {
        clearCart();
        router.push(`/don-hang/${data.orderCode}`);
      } else {
        setErrorMessage(data.error || (isEn ? 'Order creation failed' : 'Đặt hàng không thành công. Vui lòng thử lại.'));
      }
    } catch {
      setErrorMessage(isEn ? 'Network error during checkout' : 'Lỗi kết nối khi gửi đơn hàng. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!commerceEnabled) {
    return (
      <main className="min-h-screen pt-28 pb-16 bg-paper text-ink-primary">
        <div className="max-w-2xl mx-auto px-4 text-center py-16 space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-amber-100 dark:bg-amber-950/40 flex items-center justify-center text-amber-600 dark:text-amber-400">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-ink-primary">
            {isEn ? 'Online Ordering is Currently Paused' : 'Đặt Món Trực Tuyến Tạm Ngưng'}
          </h1>
          <p className="text-xs text-ink-muted max-w-md mx-auto leading-relaxed">
            {isEn
              ? 'Our online ordering system is temporarily unavailable. Please contact our sanctuary directly via Hotline 038 285 1688 for assistance.'
              : 'Hệ thống đặt món trực tuyến đang tạm thời ngưng nhận đơn mới. Quý khách vui lòng liên hệ trực tiếp Hotline 038 285 1688 để được hỗ trợ chu đáo nhất.'}
          </p>
          <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
            <Link
              href={isEn ? '/en/menu' : '/thuc-don'}
              className="px-6 py-2.5 rounded-full bg-accent-botanical text-white text-xs font-semibold hover:bg-forest-800 transition-all shadow-sm"
            >
              {isEn ? 'View Menu' : 'Xem Thực Đơn'}
            </Link>
            <a
              href="tel:0382851688"
              className="px-6 py-2.5 rounded-full bg-forest-100 dark:bg-forest-800 text-ink-primary text-xs font-semibold hover:bg-forest-200 transition-all border border-forest-200 dark:border-forest-700"
            >
              Hotline: 038 285 1688
            </a>
          </div>
        </div>
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className="min-h-screen pt-28 pb-16 bg-paper text-ink-primary">
        <div className="max-w-2xl mx-auto px-4 text-center py-16 space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-forest-100 dark:bg-forest-800 flex items-center justify-center text-forest-400">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-ink-primary">
            {isEn ? 'Your Cart is Empty' : 'Giỏ Hàng Của Bạn Đang Trống'}
          </h1>
          <p className="text-xs text-ink-muted max-w-sm mx-auto">
            {isEn
              ? 'Please select your drinks or food items before proceeding to checkout.'
              : 'Vui lòng chọn món đồ uống hoặc đồ ăn từ thực đơn trước khi tiến hành thanh toán.'}
          </p>
          <div className="pt-2">
            <Link
              href="/thuc-don"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-accent-botanical text-white font-mono text-xs font-bold shadow-md hover:bg-forest-800 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{isEn ? 'Return to Menu' : 'Quay Lại Thực Đơn'}</span>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-24 pb-20 bg-paper text-ink-primary">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Back Link & Header */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/thuc-don"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-ink-muted hover:text-accent-botanical transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{isEn ? 'Back to Menu' : 'Tiếp tục chọn món'}</span>
          </Link>
          <div className="flex items-center gap-2 text-xs font-mono text-accent-botanical">
            <ShieldCheck className="w-4 h-4" />
            <span>{isEn ? '100% Secure Checkout' : 'Thanh toán bảo mật'}</span>
          </div>
        </div>

        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-ink-primary mb-8 tracking-tight">
          {isEn ? 'Complete Your Order' : 'Thanh Toán Đơn Hàng'}
        </h1>

        {errorMessage && (
          <div className="mb-6 p-4 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-xs font-mono text-red-600 dark:text-red-400 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: 3 Steps Form (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Step 1: Fulfillment Mode */}
            <div className="p-6 rounded-3xl bg-white dark:bg-forest-900 border border-forest-100 dark:border-forest-800 shadow-subtle space-y-5">
              <div className="flex items-center gap-2.5 pb-3 border-b border-forest-100 dark:border-forest-800">
                <span className="w-6 h-6 rounded-full bg-accent-botanical text-white font-mono text-xs font-bold flex items-center justify-center">
                  1
                </span>
                <h2 className="font-serif text-base sm:text-lg font-bold text-ink-primary">
                  {isEn ? 'Fulfillment Method & Contact' : 'Hình Thức Nhận Hàng & Thông Tin'}
                </h2>
              </div>

              {/* 3 Fulfillment Modes */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <button
                  type="button"
                  onClick={() => setFulfillmentType('DELIVERY')}
                  className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                    fulfillmentType === 'DELIVERY'
                      ? 'bg-accent-botanical/10 dark:bg-accent-botanical/20 border-accent-botanical text-accent-botanical shadow-sm'
                      : 'bg-paper dark:bg-forest-800 border-forest-200 dark:border-forest-700 text-ink-primary'
                  }`}
                >
                  <Truck className="w-5 h-5 mb-2" />
                  <span className="font-serif font-bold text-sm block">
                    {isEn ? 'Delivery' : 'Giao tận nơi'}
                  </span>
                  <span className="text-[11px] font-mono text-ink-muted mt-0.5">
                    {isEn ? 'Within 30–45 mins' : 'Ship tận nhà / cơ quan'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setFulfillmentType('PICKUP')}
                  className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                    fulfillmentType === 'PICKUP'
                      ? 'bg-accent-botanical/10 dark:bg-accent-botanical/20 border-accent-botanical text-accent-botanical shadow-sm'
                      : 'bg-paper dark:bg-forest-800 border-forest-200 dark:border-forest-700 text-ink-primary'
                  }`}
                >
                  <Store className="w-5 h-5 mb-2" />
                  <span className="font-serif font-bold text-sm block">
                    {isEn ? 'Pickup' : 'Tự đến lấy'}
                  </span>
                  <span className="text-[11px] font-mono text-ink-muted mt-0.5">
                    {isEn ? 'Alley 437 Hung Vuong' : 'Tại quán (Hẻm 437)'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setFulfillmentType('DINE_IN_BBQ')}
                  className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                    fulfillmentType === 'DINE_IN_BBQ'
                      ? 'bg-accent-botanical/10 dark:bg-accent-botanical/20 border-accent-botanical text-accent-botanical shadow-sm'
                      : 'bg-paper dark:bg-forest-800 border-forest-200 dark:border-forest-700 text-ink-primary'
                  }`}
                >
                  <UtensilsCrossed className="w-5 h-5 mb-2" />
                  <span className="font-serif font-bold text-sm block">
                    {isEn ? 'Dine-in / BBQ' : 'Tại quán / BBQ'}
                  </span>
                  <span className="text-[11px] font-mono text-ink-muted mt-0.5">
                    {isEn ? 'Streamside tables' : 'Bàn sát bờ suối'}
                  </span>
                </button>
              </div>

              {/* Contact Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                <div className="space-y-1">
                  <label className="block text-xs font-mono font-medium text-ink-muted">
                    {isEn ? 'Recipient Name' : 'Họ và tên người nhận'} *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-ink-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder={isEn ? 'Nguyen Van A' : 'Nguyễn Văn A'}
                      className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-paper dark:bg-forest-800 border border-forest-200 dark:border-forest-700 text-xs font-mono text-ink-primary focus:outline-none focus:border-accent-botanical"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-mono font-medium text-ink-muted">
                    {isEn ? 'Phone Number' : 'Số điện thoại nhận hàng'} *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-ink-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="038 285 1688"
                      className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-paper dark:bg-forest-800 border border-forest-200 dark:border-forest-700 text-xs font-mono text-ink-primary focus:outline-none focus:border-accent-botanical"
                    />
                  </div>
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="block text-xs font-mono font-medium text-ink-muted">
                    {isEn ? 'Email (for instant receipt confirmation)' : 'Email (để nhận hóa đơn & mã đơn hàng)'}
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-ink-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      placeholder="khachquy@gmail.com"
                      className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-paper dark:bg-forest-800 border border-forest-200 dark:border-forest-700 text-xs font-mono text-ink-primary focus:outline-none focus:border-accent-botanical"
                    />
                  </div>
                </div>
              </div>

              {/* Delivery specific fields */}
              {fulfillmentType === 'DELIVERY' && (
                <div className="space-y-3.5 pt-3 border-t border-forest-100 dark:border-forest-800">
                  <div className="space-y-1">
                    <label className="block text-xs font-mono font-medium text-ink-muted">
                      {isEn ? 'Shipping Zone' : 'Khu vực giao hàng'} *
                    </label>
                    <select
                      value={selectedZoneId}
                      onChange={(e) => setSelectedZoneId(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-paper dark:bg-forest-800 border border-forest-200 dark:border-forest-700 text-xs font-mono text-ink-primary focus:outline-none focus:border-accent-botanical"
                    >
                      {shippingZones.map((z) => (
                        <option key={z.id} value={z.id}>
                          {isEn && z.nameEn ? z.nameEn : z.nameVi} — {z.fee.toLocaleString('vi-VN')}đ {z.estimatedTimeVi ? `(${z.estimatedTimeVi})` : ''}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div className="space-y-1">
                      <label className="block text-xs font-mono font-medium text-ink-muted">
                        {isEn ? 'Address (House No., Street)' : 'Số nhà, tên đường'} *
                      </label>
                      <input
                        type="text"
                        required
                        value={addressLine}
                        onChange={(e) => setAddressLine(e.target.value)}
                        placeholder="Số 437 Hùng Vương"
                        className="w-full p-2.5 rounded-xl bg-paper dark:bg-forest-800 border border-forest-200 dark:border-forest-700 text-xs font-mono text-ink-primary focus:outline-none focus:border-accent-botanical"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-xs font-mono font-medium text-ink-muted">
                        {isEn ? 'Ward / District' : 'Phường / Xã, Huyện'} *
                      </label>
                      <input
                        type="text"
                        required
                        value={wardDistrict}
                        onChange={(e) => setWardDistrict(e.target.value)}
                        placeholder="Phường Nghĩa Trung, Đông Gia Nghĩa"
                        className="w-full p-2.5 rounded-xl bg-paper dark:bg-forest-800 border border-forest-200 dark:border-forest-700 text-xs font-mono text-ink-primary focus:outline-none focus:border-accent-botanical"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Pickup / Dine-in scheduled time */}
              {fulfillmentType !== 'DELIVERY' && (
                <div className="space-y-1 pt-2">
                  <label className="block text-xs font-mono font-medium text-ink-muted">
                    {fulfillmentType === 'PICKUP'
                      ? (isEn ? 'Estimated Pickup Time' : 'Thời gian dự kiến đến lấy món')
                      : (isEn ? 'Estimated Arrival Time & Table (if seated)' : 'Thời gian đến quán & Số bàn (nếu có)')}
                  </label>
                  <input
                    type="text"
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                    placeholder={
                      fulfillmentType === 'PICKUP'
                        ? 'Ví dụ: 15 phút nữa, hoặc 10:30 sáng'
                        : 'Ví dụ: Bàn số 5 sát suối, hoặc tiệc BBQ tối nay lúc 18h'
                    }
                    className="w-full p-2.5 rounded-xl bg-paper dark:bg-forest-800 border border-forest-200 dark:border-forest-700 text-xs font-mono text-ink-primary focus:outline-none focus:border-accent-botanical"
                  />
                </div>
              )}

              {/* General Note */}
              <div className="space-y-1 pt-1">
                <label className="block text-xs font-mono font-medium text-ink-muted">
                  {isEn ? 'Order Note' : 'Ghi chú thêm cho đơn hàng'}
                </label>
                <textarea
                  rows={2}
                  value={customerNote}
                  onChange={(e) => setCustomerNote(e.target.value)}
                  placeholder={
                    isEn
                      ? 'Special requests, gate codes, delivery remarks...'
                      : 'Ghi chú cho shipper hoặc quán (ví dụ: gọi trước khi đến, không bấm chuông...)'
                  }
                  className="w-full p-2.5 rounded-xl bg-paper dark:bg-forest-800 border border-forest-200 dark:border-forest-700 text-xs font-mono text-ink-primary focus:outline-none focus:border-accent-botanical resize-none"
                />
              </div>
            </div>

            {/* Step 2: Voucher Application */}
            <div className="p-6 rounded-3xl bg-white dark:bg-forest-900 border border-forest-100 dark:border-forest-800 shadow-subtle space-y-4">
              <div className="flex items-center gap-2.5 pb-3 border-b border-forest-100 dark:border-forest-800">
                <span className="w-6 h-6 rounded-full bg-accent-botanical text-white font-mono text-xs font-bold flex items-center justify-center">
                  2
                </span>
                <h2 className="font-serif text-base sm:text-lg font-bold text-ink-primary">
                  {isEn ? 'Voucher & Discounts' : 'Mã Giảm Giá & Ưu Đãi'}
                </h2>
              </div>

              {appliedVoucher ? (
                <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <div>
                      <span className="font-mono text-xs font-bold text-emerald-700 dark:text-emerald-300">
                        {appliedVoucher.code}
                      </span>
                      <span className="text-[11px] font-mono text-ink-muted ml-2">
                        (-{appliedVoucher.discountAmount.toLocaleString('vi-VN')}đ)
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveVoucher}
                    className="text-xs font-mono text-red-500 hover:underline"
                  >
                    {isEn ? 'Remove' : 'Gỡ bỏ'}
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="w-4 h-4 text-ink-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={voucherCodeInput}
                        onChange={(e) => setVoucherCodeInput(e.target.value.toUpperCase())}
                        placeholder={isEn ? 'Enter voucher code (e.g. CAMCU20)' : 'Nhập mã giảm giá (ví dụ: CAMCU20)'}
                        className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-paper dark:bg-forest-800 border border-forest-200 dark:border-forest-700 text-xs font-mono uppercase text-ink-primary focus:outline-none focus:border-accent-botanical"
                      />
                    </div>
                    <button
                      type="button"
                      disabled={validatingVoucher || !voucherCodeInput.trim()}
                      onClick={handleApplyVoucher}
                      className="px-5 py-2.5 rounded-xl bg-accent-botanical hover:bg-forest-800 text-white font-mono text-xs font-bold transition-all disabled:opacity-50 shrink-0"
                    >
                      {validatingVoucher ? <Loader2 className="w-4 h-4 animate-spin" /> : (isEn ? 'Apply' : 'Áp Dụng')}
                    </button>
                  </div>
                  {voucherError && (
                    <p className="text-[11px] font-mono text-red-500">{voucherError}</p>
                  )}
                </div>
              )}
            </div>

            {/* Step 3: Payment Method */}
            <div className="p-6 rounded-3xl bg-white dark:bg-forest-900 border border-forest-100 dark:border-forest-800 shadow-subtle space-y-4">
              <div className="flex items-center gap-2.5 pb-3 border-b border-forest-100 dark:border-forest-800">
                <span className="w-6 h-6 rounded-full bg-accent-botanical text-white font-mono text-xs font-bold flex items-center justify-center">
                  3
                </span>
                <h2 className="font-serif text-base sm:text-lg font-bold text-ink-primary">
                  {isEn ? 'Payment Method' : 'Phương Thức Thanh Toán'}
                </h2>
              </div>

              <div className="space-y-2.5">
                {/* VietQR */}
                <label
                  className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                    paymentMethod === 'VIETQR'
                      ? 'bg-accent-botanical/10 dark:bg-accent-botanical/20 border-accent-botanical text-accent-botanical shadow-sm'
                      : 'bg-paper dark:bg-forest-800 border-forest-200 dark:border-forest-700 text-ink-primary'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="VIETQR"
                      checked={paymentMethod === 'VIETQR'}
                      onChange={() => setPaymentMethod('VIETQR')}
                      className="text-accent-botanical focus:ring-0"
                    />
                    <div>
                      <span className="font-serif font-bold text-sm block flex items-center gap-2">
                        <QrCode className="w-4 h-4" />
                        <span>VietQR (Chuyển khoản QR ngân hàng 24/7)</span>
                      </span>
                      <span className="text-[11px] font-mono text-ink-muted">
                        {isEn ? 'Instant QR transfer via 40+ Vietnam Banks' : 'Quét mã QR tự động xác nhận qua ngân hàng'}
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-full">
                    {isEn ? 'Recommended' : 'Khuyên dùng'}
                  </span>
                </label>

                {/* COD */}
                <label
                  className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                    paymentMethod === 'COD'
                      ? 'bg-accent-botanical/10 dark:bg-accent-botanical/20 border-accent-botanical text-accent-botanical shadow-sm'
                      : 'bg-paper dark:bg-forest-800 border-forest-200 dark:border-forest-700 text-ink-primary'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="COD"
                      checked={paymentMethod === 'COD'}
                      onChange={() => setPaymentMethod('COD')}
                      className="text-accent-botanical focus:ring-0"
                    />
                    <div>
                      <span className="font-serif font-bold text-sm block flex items-center gap-2">
                        <Banknote className="w-4 h-4" />
                        <span>{isEn ? 'Cash on Delivery (COD)' : 'Thanh toán tiền mặt khi nhận món'}</span>
                      </span>
                      <span className="text-[11px] font-mono text-ink-muted">
                        {isEn ? 'Pay cash to driver or barista upon arrival' : 'Thanh toán tiền mặt cho shipper hoặc quầy bar'}
                      </span>
                    </div>
                  </div>
                </label>

                {/* VNPay */}
                <label
                  className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                    paymentMethod === 'VNPAY'
                      ? 'bg-accent-botanical/10 dark:bg-accent-botanical/20 border-accent-botanical text-accent-botanical shadow-sm'
                      : 'bg-paper dark:bg-forest-800 border-forest-200 dark:border-forest-700 text-ink-primary'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="VNPAY"
                      checked={paymentMethod === 'VNPAY'}
                      onChange={() => setPaymentMethod('VNPAY')}
                      className="text-accent-botanical focus:ring-0"
                    />
                    <div>
                      <span className="font-serif font-bold text-sm block flex items-center gap-2">
                        <CreditCard className="w-4 h-4" />
                        <span>Cổng VNPAY / Thẻ ATM Nội Địa</span>
                      </span>
                      <span className="text-[11px] font-mono text-ink-muted">
                        {isEn ? 'Online payment gateway' : 'Thanh toán qua cổng VNPAY'}
                      </span>
                    </div>
                  </div>
                </label>

                {/* MoMo */}
                <label
                  className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                    paymentMethod === 'MOMO'
                      ? 'bg-accent-botanical/10 dark:bg-accent-botanical/20 border-accent-botanical text-accent-botanical shadow-sm'
                      : 'bg-paper dark:bg-forest-800 border-forest-200 dark:border-forest-700 text-ink-primary'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="MOMO"
                      checked={paymentMethod === 'MOMO'}
                      onChange={() => setPaymentMethod('MOMO')}
                      className="text-accent-botanical focus:ring-0"
                    />
                    <div>
                      <span className="font-serif font-bold text-sm block flex items-center gap-2">
                        <Wallet className="w-4 h-4" />
                        <span>Ví Điện Tử MoMo</span>
                      </span>
                      <span className="text-[11px] font-mono text-ink-muted">
                        {isEn ? 'MoMo E-Wallet' : 'Quét mã MoMo'}
                      </span>
                    </div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary & Submit (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 rounded-3xl bg-white dark:bg-forest-900 border border-forest-100 dark:border-forest-800 shadow-subtle space-y-5 sticky top-24">
              <h2 className="font-serif text-lg font-bold text-ink-primary pb-3 border-b border-forest-100 dark:border-forest-800">
                {isEn ? 'Order Summary' : 'Tóm Tắt Đơn Hàng'}
              </h2>

              {/* Items List */}
              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div key={item.id} className="flex items-start justify-between gap-3 text-xs">
                    <div>
                      <p className="font-serif font-bold text-ink-primary">
                        {item.quantity}x {isEn && item.nameEn ? item.nameEn : item.nameVi}
                      </p>
                      {item.selectedOptions && item.selectedOptions.length > 0 && (
                        <p className="text-[11px] font-mono text-ink-muted">
                          {item.selectedOptions.map((o) => o.labelVi).join(', ')}
                        </p>
                      )}
                      {item.itemNote && (
                        <p className="text-[10px] font-mono italic text-ink-muted">
                          📝 {item.itemNote}
                        </p>
                      )}
                    </div>
                    <span className="font-mono font-bold text-ink-primary shrink-0">
                      {(item.unitPrice * item.quantity).toLocaleString('vi-VN')}đ
                    </span>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="pt-4 border-t border-forest-100 dark:border-forest-800 space-y-2 text-xs font-mono">
                <div className="flex items-center justify-between text-ink-muted">
                  <span>{isEn ? 'Subtotal' : 'Tạm tính'}</span>
                  <span>{subtotal.toLocaleString('vi-VN')}đ</span>
                </div>
                <div className="flex items-center justify-between text-ink-muted">
                  <span>{isEn ? 'Shipping Fee' : 'Phí vận chuyển'}</span>
                  <span>
                    {shippingFee === 0
                      ? (isEn ? 'Free' : 'Miễn phí')
                      : `${shippingFee.toLocaleString('vi-VN')}đ`}
                  </span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400 font-bold">
                    <span>{isEn ? 'Discount' : 'Giảm giá voucher'}</span>
                    <span>-{discountAmount.toLocaleString('vi-VN')}đ</span>
                  </div>
                )}
                <div className="pt-2 border-t border-forest-100 dark:border-forest-800 flex items-center justify-between text-sm sm:text-base font-bold text-ink-primary">
                  <span>{isEn ? 'Total Amount' : 'Tổng Thanh Toán'}</span>
                  <span className="text-accent-botanical text-lg sm:text-xl">
                    {totalAmount.toLocaleString('vi-VN')}đ
                  </span>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 px-6 rounded-2xl bg-accent-botanical hover:bg-forest-800 text-white font-mono text-sm font-bold flex items-center justify-center gap-2 shadow-xl shadow-accent-botanical/25 transition-all active:scale-[0.99] disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>{isEn ? 'Processing Order...' : 'Đang xử lý đặt hàng...'}</span>
                  </>
                ) : (
                  <>
                    <span>{isEn ? 'Place Order Now' : 'Xác Nhận Đặt Hàng'}</span>
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <p className="text-[11px] text-ink-muted text-center font-mono">
                {isEn
                  ? 'By placing your order, you agree to our policies & terms.'
                  : 'Bằng việc đặt hàng, quý khách đồng ý với các chính sách & nội quy của Cẩm Cù House.'}
              </p>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}
