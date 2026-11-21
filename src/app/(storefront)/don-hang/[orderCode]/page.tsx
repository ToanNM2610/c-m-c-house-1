'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  CheckCircle2,
  Clock,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  QrCode,
  Copy,
  Printer,
  ArrowLeft,
  Loader2,
  Store,
  Sparkles,
  Phone,
  MapPin,
  Calendar,
  AlertCircle,
  Check,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { OrderRecord, OrderStatus, PaymentStatus } from '@/types';

// Order Status Steps config
const STATUS_STEPS: { key: OrderStatus; labelVi: string; labelEn: string; icon: any }[] = [
  { key: 'PENDING', labelVi: 'Chờ xác nhận', labelEn: 'Pending', icon: Clock },
  { key: 'CONFIRMED', labelVi: 'Đã xác nhận', labelEn: 'Confirmed', icon: CheckCircle2 },
  { key: 'PREPARING', labelVi: 'Đang pha chế', labelEn: 'Brewing', icon: Package },
  { key: 'SHIPPING', labelVi: 'Đang giao hàng', labelEn: 'Delivering', icon: Truck },
  { key: 'COMPLETED', labelVi: 'Hoàn tất', labelEn: 'Completed', icon: CheckCircle },
];

export default function OrderConfirmationPage() {
  const params = useParams();
  const orderCode = (params?.orderCode as string) || '';
  const { language } = useApp();
  const isEn = language === 'en';

  const [order, setOrder] = useState<OrderRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isVerifyingTransfer, setIsVerifyingTransfer] = useState(false);
  const [verifySuccess, setVerifySuccess] = useState(false);

  // Bank transfer config from settings or fallback
  const [bankInfo, setBankInfo] = useState({
    bankId: '970422', // MBBank
    bankName: 'MBBank (Quân Đội)',
    accountNo: '0382851688',
    accountName: 'VO CONG TOAN',
    vietQrTemplate: 'compact2',
  });

  // Fetch Order details
  const fetchOrder = useCallback(async () => {
    if (!orderCode) return;
    try {
      const res = await fetch(`/api/commerce/orders/${encodeURIComponent(orderCode)}`);
      if (res.ok) {
        const data = await res.json();
        const o = data.order || data;
        setOrder(o);
        if (data.bankInfo) {
          setBankInfo((prev) => ({ ...prev, ...data.bankInfo }));
        }
      }
    } catch {
      // Failed to load
    } finally {
      setLoading(false);
    }
  }, [orderCode]);

  useEffect(() => {
    fetchOrder();

    // 5s Live polling if order is unpaid or pending
    const interval = setInterval(() => {
      fetchOrder();
    }, 5000);

    return () => clearInterval(interval);
  }, [fetchOrder]);

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  // "Tôi đã chuyển khoản" trigger
  const handleVerifyTransfer = async () => {
    if (!orderCode) return;
    setIsVerifyingTransfer(true);
    try {
      const res = await fetch(`/api/commerce/orders/${encodeURIComponent(orderCode)}/verify-transfer`, {
        method: 'POST',
      });
      if (res.ok) {
        setVerifySuccess(true);
        fetchOrder();
      }
    } catch {}
    setIsVerifyingTransfer(false);
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  if (loading) {
    return (
      <main className="min-h-screen pt-28 pb-16 bg-paper text-ink-primary flex items-center justify-center">
        <div className="text-center space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-accent-botanical mx-auto" />
          <p className="font-mono text-xs text-ink-muted">
            {isEn ? 'Loading order details...' : 'Đang tải thông tin đơn hàng...'}
          </p>
        </div>
      </main>
    );
  }

  if (!order) {
    return (
      <main className="min-h-screen pt-28 pb-16 bg-paper text-ink-primary">
        <div className="max-w-xl mx-auto px-4 text-center py-16 space-y-4">
          <div className="w-14 h-14 mx-auto rounded-full bg-red-100 text-red-500 flex items-center justify-center">
            <XCircle className="w-7 h-7" />
          </div>
          <h1 className="font-serif text-2xl font-bold">
            {isEn ? 'Order Not Found' : 'Không Tìm Thấy Đơn Hàng'}
          </h1>
          <p className="text-xs text-ink-muted max-w-sm mx-auto">
            {isEn
              ? `Could not find any order matching code ${orderCode}.`
              : `Không tìm thấy đơn hàng nào với mã ${orderCode}. Vui lòng kiểm tra lại.`}
          </p>
          <div className="pt-2">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-accent-botanical text-white font-mono text-xs font-bold"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{isEn ? 'Return Home' : 'Về Trang Chủ'}</span>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // Stepper calculations
  const isCancelled = order.orderStatus === 'CANCELLED';
  const currentStepIdx = STATUS_STEPS.findIndex((s) => s.key === order.orderStatus);

  // VietQR Dynamic URL
  const qrUrl = `https://img.vietqr.io/image/${bankInfo.bankId}-${bankInfo.accountNo}-${bankInfo.vietQrTemplate || 'compact2'}.png?amount=${order.totalAmount}&addInfo=${encodeURIComponent(order.orderCode)}&accountName=${encodeURIComponent(bankInfo.accountName)}`;

  return (
    <main className="min-h-screen pt-24 pb-20 bg-paper text-ink-primary">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Top Navigation & Status Badge */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-ink-muted hover:text-accent-botanical transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{isEn ? 'Home' : 'Trang chủ'}</span>
          </Link>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrintReceipt}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-forest-200 dark:border-forest-700 bg-white dark:bg-forest-900 text-xs font-mono text-ink-primary hover:border-accent-botanical transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{isEn ? 'Print Bill (K80)' : 'In Hóa Đơn (Bill K80)'}</span>
            </button>
          </div>
        </div>

        {/* Confirmation Header */}
        <div className="text-center space-y-2 mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-mono text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isEn ? 'Order Received Successfully' : 'Đặt Hàng Thành Công'}</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-ink-primary">
            {isEn ? 'Thank you for your order!' : 'Cảm ơn quý khách đã gửi gắm yêu thương!'}
          </h1>
          <p className="font-mono text-xs text-ink-muted">
            {isEn ? 'Order Code' : 'Mã đơn hàng'}:{' '}
            <span className="font-bold text-accent-botanical text-sm sm:text-base">
              #{order.orderCode}
            </span>
          </p>
        </div>

        {/* Status Stepper */}
        <div className="p-6 rounded-3xl bg-white dark:bg-forest-900 border border-forest-100 dark:border-forest-800 shadow-subtle mb-8">
          {isCancelled ? (
            <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 flex items-center gap-3">
              <XCircle className="w-6 h-6 text-red-500 shrink-0" />
              <div>
                <h3 className="font-serif font-bold text-sm text-red-600 dark:text-red-400">
                  {isEn ? 'Order Cancelled' : 'Đơn hàng đã được hủy'}
                </h3>
                {order.cancelReason && (
                  <p className="text-xs font-mono text-ink-muted mt-0.5">
                    {order.cancelReason}
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs font-mono text-ink-muted">
                <span>{isEn ? 'Order Progress' : 'Tiến trình chuẩn bị đơn'}</span>
                <span className="font-bold text-accent-botanical">
                  {isEn
                    ? STATUS_STEPS[currentStepIdx]?.labelEn
                    : STATUS_STEPS[currentStepIdx]?.labelVi}
                </span>
              </div>

              {/* Progress Line & Nodes */}
              <div className="grid grid-cols-5 gap-1 sm:gap-2 relative">
                {STATUS_STEPS.map((step, idx) => {
                  const Icon = step.icon;
                  const isDone = currentStepIdx >= idx;
                  const isCurrent = currentStepIdx === idx;

                  return (
                    <div key={step.key} className="flex flex-col items-center text-center space-y-1.5">
                      <div
                        className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all ${
                          isDone
                            ? 'bg-accent-botanical text-white shadow-sm'
                            : 'bg-forest-100 dark:bg-forest-800 text-forest-400'
                        } ${isCurrent ? 'ring-4 ring-accent-botanical/20' : ''}`}
                      >
                        <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                      </div>
                      <span
                        className={`text-[10px] sm:text-xs font-mono leading-tight ${
                          isDone ? 'font-bold text-ink-primary' : 'text-ink-muted'
                        }`}
                      >
                        {isEn ? step.labelEn : step.labelVi}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* VietQR Payment Card (Only if VIETQR and UNPAID/PENDING_VERIFY) */}
          {order.paymentMethod === 'VIETQR' && (
            <div className="md:col-span-12">
              <div className="p-6 rounded-3xl bg-white dark:bg-forest-900 border border-forest-100 dark:border-forest-800 shadow-subtle">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  {/* Left: QR Code Preview */}
                  <div className="text-center space-y-2 shrink-0">
                    <div className="p-3 bg-white rounded-2xl border border-forest-200 dark:border-forest-700 shadow-md inline-block">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={qrUrl}
                        alt={`VietQR ${order.orderCode}`}
                        className="w-48 h-48 sm:w-56 sm:h-56 object-contain mx-auto"
                      />
                    </div>
                    <p className="text-[11px] font-mono text-ink-muted">
                      {isEn ? 'Scan with any banking app' : 'Mở app ngân hàng quét mã QR'}
                    </p>
                  </div>

                  {/* Right: Bank Details & Quick Copy */}
                  <div className="flex-1 space-y-4 w-full">
                    <div className="flex items-center justify-between pb-3 border-b border-forest-100 dark:border-forest-800">
                      <div>
                        <h3 className="font-serif font-bold text-base text-ink-primary">
                          {isEn ? 'Automatic VietQR Transfer' : 'Thông Tin Chuyển Khoản Ngân Hàng'}
                        </h3>
                        <p className="text-xs font-mono text-ink-muted">
                          {isEn ? 'System automatically verifies via bank webhook' : 'Hệ thống tự động ghi nhận tiền vào sau 1–3 giây'}
                        </p>
                      </div>
                      {order.paymentStatus === 'PAID' ? (
                        <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-mono text-xs font-bold flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{isEn ? 'PAID' : 'ĐÃ THANH TOÁN'}</span>
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 font-mono text-xs font-bold flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{isEn ? 'AWAITING PAYMENT' : 'CHỜ THANH TOÁN'}</span>
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                      {/* Bank Name */}
                      <div className="p-3 rounded-xl bg-paper dark:bg-forest-800 border border-forest-200 dark:border-forest-700">
                        <span className="text-ink-muted block text-[10px]">
                          {isEn ? 'Bank' : 'Ngân hàng thụ hưởng'}
                        </span>
                        <span className="font-bold text-ink-primary text-sm mt-0.5 block">
                          {bankInfo.bankName}
                        </span>
                      </div>

                      {/* Account Name */}
                      <div className="p-3 rounded-xl bg-paper dark:bg-forest-800 border border-forest-200 dark:border-forest-700">
                        <span className="text-ink-muted block text-[10px]">
                          {isEn ? 'Account Name' : 'Chủ tài khoản'}
                        </span>
                        <span className="font-bold text-ink-primary text-sm mt-0.5 block">
                          {bankInfo.accountName}
                        </span>
                      </div>

                      {/* Account Number with Copy */}
                      <div className="p-3 rounded-xl bg-paper dark:bg-forest-800 border border-forest-200 dark:border-forest-700 flex items-center justify-between">
                        <div>
                          <span className="text-ink-muted block text-[10px]">
                            {isEn ? 'Account Number' : 'Số tài khoản'}
                          </span>
                          <span className="font-bold text-accent-botanical text-sm mt-0.5 block">
                            {bankInfo.accountNo}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(bankInfo.accountNo, 'accountNo')}
                          className="p-1.5 rounded-lg bg-forest-100 dark:bg-forest-700 text-ink-muted hover:text-ink-primary text-xs"
                        >
                          {copiedField === 'accountNo' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>

                      {/* Total Amount with Copy */}
                      <div className="p-3 rounded-xl bg-paper dark:bg-forest-800 border border-forest-200 dark:border-forest-700 flex items-center justify-between">
                        <div>
                          <span className="text-ink-muted block text-[10px]">
                            {isEn ? 'Exact Amount' : 'Số tiền chính xác'}
                          </span>
                          <span className="font-bold text-accent-botanical text-sm mt-0.5 block">
                            {order.totalAmount.toLocaleString('vi-VN')}đ
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(order.totalAmount.toString(), 'amount')}
                          className="p-1.5 rounded-lg bg-forest-100 dark:bg-forest-700 text-ink-muted hover:text-ink-primary text-xs"
                        >
                          {copiedField === 'amount' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>

                      {/* Transfer Content with Copy */}
                      <div className="sm:col-span-2 p-3 rounded-xl bg-paper dark:bg-forest-800 border border-forest-200 dark:border-forest-700 flex items-center justify-between">
                        <div>
                          <span className="text-ink-muted block text-[10px]">
                            {isEn ? 'Transfer Content (Required)' : 'Nội dung chuyển khoản (Bắt buộc giữ nguyên)'}
                          </span>
                          <span className="font-bold text-accent-botanical text-sm mt-0.5 block">
                            {order.orderCode}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(order.orderCode, 'orderCode')}
                          className="p-1.5 rounded-lg bg-forest-100 dark:bg-forest-700 text-ink-muted hover:text-ink-primary text-xs"
                        >
                          {copiedField === 'orderCode' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* "Tôi đã chuyển khoản" button */}
                    {order.paymentStatus !== 'PAID' && (
                      <div className="pt-2 flex items-center gap-3">
                        <button
                          type="button"
                          disabled={isVerifyingTransfer || verifySuccess}
                          onClick={handleVerifyTransfer}
                          className="py-2.5 px-5 rounded-xl bg-accent-botanical hover:bg-forest-800 text-white font-mono text-xs font-bold flex items-center gap-2 transition-all disabled:opacity-50"
                        >
                          {isVerifyingTransfer ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <CheckCircle2 className="w-4 h-4" />
                          )}
                          <span>
                            {verifySuccess
                              ? (isEn ? 'Transfer Sent for Review' : 'Đã báo chuyển khoản — Quán đang kiểm tra')
                              : (isEn ? 'I Have Completed the Transfer' : 'Tôi đã chuyển khoản thành công')}
                          </span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Left: Customer & Fulfillment Details (5 cols) */}
          <div className="md:col-span-5 space-y-6">
            <div className="p-6 rounded-3xl bg-white dark:bg-forest-900 border border-forest-100 dark:border-forest-800 shadow-subtle space-y-4">
              <h3 className="font-serif font-bold text-base text-ink-primary pb-3 border-b border-forest-100 dark:border-forest-800">
                {isEn ? 'Delivery & Contact Details' : 'Thông Tin Nhận Món'}
              </h3>

              <div className="space-y-3 text-xs font-mono">
                <div className="flex items-start gap-2.5">
                  <Store className="w-4 h-4 text-accent-botanical shrink-0 mt-0.5" />
                  <div>
                    <span className="text-ink-muted block text-[10px]">
                      {isEn ? 'Fulfillment Type' : 'Hình thức'}
                    </span>
                    <span className="font-bold text-ink-primary">
                      {order.fulfillmentType === 'DELIVERY'
                        ? (isEn ? 'Home Delivery' : 'Giao tận nơi')
                        : order.fulfillmentType === 'PICKUP'
                        ? (isEn ? 'Store Pickup' : 'Tự đến lấy tại quán')
                        : (isEn ? 'Dine-in / BBQ' : 'Dùng tại quán / BBQ bờ suối')}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Phone className="w-4 h-4 text-accent-botanical shrink-0 mt-0.5" />
                  <div>
                    <span className="text-ink-muted block text-[10px]">
                      {isEn ? 'Recipient' : 'Người nhận'}
                    </span>
                    <span className="font-bold text-ink-primary">
                      {order.customerName} ({order.customerPhone})
                    </span>
                  </div>
                </div>

                {order.shippingAddress && (
                  <div className="flex items-start gap-2.5">
                    <MapPin className="w-4 h-4 text-accent-botanical shrink-0 mt-0.5" />
                    <div>
                      <span className="text-ink-muted block text-[10px]">
                        {isEn ? 'Address' : 'Địa chỉ giao hàng'}
                      </span>
                      <span className="font-bold text-ink-primary">
                        {order.shippingAddress}
                      </span>
                    </div>
                  </div>
                )}

                {order.scheduledTime && (
                  <div className="flex items-start gap-2.5">
                    <Calendar className="w-4 h-4 text-accent-botanical shrink-0 mt-0.5" />
                    <div>
                      <span className="text-ink-muted block text-[10px]">
                        {isEn ? 'Scheduled Time / Table' : 'Thời gian hẹn / Số bàn'}
                      </span>
                      <span className="font-bold text-ink-primary">
                        {order.scheduledTime}
                      </span>
                    </div>
                  </div>
                )}

                {order.customerNote && (
                  <div className="pt-2 border-t border-forest-100 dark:border-forest-800">
                    <span className="text-ink-muted block text-[10px]">
                      {isEn ? 'Order Note' : 'Ghi chú'}
                    </span>
                    <p className="italic text-ink-muted mt-0.5">
                      &ldquo;{order.customerNote}&rdquo;
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right: Itemized Receipt (7 cols) */}
          <div className="md:col-span-7 space-y-6">
            <div className="p-6 rounded-3xl bg-white dark:bg-forest-900 border border-forest-100 dark:border-forest-800 shadow-subtle space-y-4">
              <h3 className="font-serif font-bold text-base text-ink-primary pb-3 border-b border-forest-100 dark:border-forest-800">
                {isEn ? 'Receipt Items' : 'Chi Tiết Đơn Hàng'}
              </h3>

              {/* Items */}
              <div className="space-y-3">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-2xl bg-paper dark:bg-forest-850 border border-forest-100 dark:border-forest-800 flex items-start justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1">
                      <p className="font-serif font-bold text-ink-primary">
                        {item.quantity}x {isEn && item.itemNameEn ? item.itemNameEn : item.itemNameVi}
                      </p>
                      {item.selectedOptions && Array.isArray(item.selectedOptions) && item.selectedOptions.length > 0 && (
                        <p className="text-[11px] font-mono text-ink-muted">
                          {item.selectedOptions.map((o: any) => o.labelVi).join(', ')}
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
                  <span>{order.subtotal.toLocaleString('vi-VN')}đ</span>
                </div>
                <div className="flex items-center justify-between text-ink-muted">
                  <span>{isEn ? 'Shipping Fee' : 'Phí giao hàng'}</span>
                  <span>
                    {order.shippingFee === 0
                      ? (isEn ? 'Free' : 'Miễn phí')
                      : `${order.shippingFee.toLocaleString('vi-VN')}đ`}
                  </span>
                </div>
                {order.discountAmount > 0 && (
                  <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400 font-bold">
                    <span>{isEn ? 'Discount' : 'Giảm giá'}</span>
                    <span>-{order.discountAmount.toLocaleString('vi-VN')}đ</span>
                  </div>
                )}
                <div className="pt-2 border-t border-forest-100 dark:border-forest-800 flex items-center justify-between text-sm sm:text-base font-bold text-ink-primary">
                  <span>{isEn ? 'Total' : 'Tổng thanh toán'}</span>
                  <span className="text-accent-botanical text-lg font-bold">
                    {order.totalAmount.toLocaleString('vi-VN')}đ
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden Thermal Receipt Print Layout for @media print */}
      <div className="hidden print:block font-mono text-black p-4 max-w-[80mm] mx-auto text-xs">
        <div className="text-center pb-2 border-b border-black">
          <h2 className="font-bold text-sm">CẨM CÙ HOUSE</h2>
          <p className="text-[10px]">Hẻm 437 Hùng Vương, Đắk Nông</p>
          <p className="text-[10px]">Hotline: 038 285 1688</p>
          <h3 className="font-bold text-xs mt-2">HÓA ĐƠN BÁN HÀNG</h3>
          <p className="text-[10px]">Mã đơn: #{order.orderCode}</p>
        </div>

        <div className="py-2 border-b border-black text-[10px] space-y-0.5">
          <p>Khách: {order.customerName}</p>
          <p>SĐT: {order.customerPhone}</p>
          {order.shippingAddress && <p>Đ/c: {order.shippingAddress}</p>}
        </div>

        <div className="py-2 border-b border-black space-y-1">
          {order.items.map((i) => (
            <div key={i.id} className="flex justify-between text-[11px]">
              <span>
                {i.quantity}x {i.itemNameVi}
              </span>
              <span>{(i.unitPrice * i.quantity).toLocaleString('vi-VN')}đ</span>
            </div>
          ))}
        </div>

        <div className="py-2 space-y-1 text-right text-xs">
          <p>Tạm tính: {order.subtotal.toLocaleString('vi-VN')}đ</p>
          {order.shippingFee > 0 && <p>Ship: {order.shippingFee.toLocaleString('vi-VN')}đ</p>}
          {order.discountAmount > 0 && <p>Giảm: -{order.discountAmount.toLocaleString('vi-VN')}đ</p>}
          <p className="font-bold text-sm">TỔNG: {order.totalAmount.toLocaleString('vi-VN')}đ</p>
        </div>

        <div className="text-center pt-3 text-[10px]">
          <p>Cảm ơn quý khách & Hẹn gặp lại!</p>
        </div>
      </div>
    </main>
  );
}
