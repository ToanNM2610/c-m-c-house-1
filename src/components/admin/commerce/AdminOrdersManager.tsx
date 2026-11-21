'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  ShoppingBag,
  Search,
  Filter,
  RefreshCw,
  Clock,
  CheckCircle2,
  XCircle,
  Truck,
  RotateCcw,
  Eye,
  Printer,
  Mail,
  AlertCircle,
  ChevronRight,
  DollarSign,
  FileText,
  MapPin,
  Phone,
  User,
  CreditCard,
  QrCode,
  Calendar,
  X,
  Send,
  Loader2,
  ExternalLink,
} from 'lucide-react';
import {
  OrderRecord,
  OrderStatus,
  PaymentStatus,
  FulfillmentType,
  PaymentMethod,
} from '@/types';

// Human-friendly labels & color maps
export const ORDER_STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; bg: string; text: string; border: string; icon: React.ComponentType<{ className?: string }> }
> = {
  PENDING: {
    label: 'Chờ xác nhận',
    bg: 'bg-amber-500/15',
    text: 'text-amber-400',
    border: 'border-amber-500/30',
    icon: Clock,
  },
  CONFIRMED: {
    label: 'Đã xác nhận',
    bg: 'bg-sky-500/15',
    text: 'text-sky-400',
    border: 'border-sky-500/30',
    icon: CheckCircle2,
  },
  PREPARING: {
    label: 'Đang pha chế/chuẩn bị',
    bg: 'bg-purple-500/15',
    text: 'text-purple-400',
    border: 'border-purple-500/30',
    icon: RefreshCw,
  },
  SHIPPING: {
    label: 'Đang giao hàng',
    bg: 'bg-blue-500/15',
    text: 'text-blue-400',
    border: 'border-blue-500/30',
    icon: Truck,
  },
  COMPLETED: {
    label: 'Hoàn tất',
    bg: 'bg-emerald-500/15',
    text: 'text-emerald-400',
    border: 'border-emerald-500/30',
    icon: CheckCircle2,
  },
  CANCELLED: {
    label: 'Đã hủy',
    bg: 'bg-rose-500/15',
    text: 'text-rose-400',
    border: 'border-rose-500/30',
    icon: XCircle,
  },
};

export const PAYMENT_STATUS_CONFIG: Record<
  PaymentStatus,
  { label: string; bg: string; text: string; border: string }
> = {
  UNPAID: { label: 'Chưa thanh toán', bg: 'bg-slate-700/60', text: 'text-slate-300', border: 'border-slate-600' },
  PENDING_VERIFY: { label: 'Chờ đối soát', bg: 'bg-amber-500/20', text: 'text-amber-300', border: 'border-amber-500/40' },
  PAID: { label: 'Đã thanh toán', bg: 'bg-emerald-500/20', text: 'text-emerald-300', border: 'border-emerald-500/40' },
  REFUNDED: { label: 'Đã hoàn tiền', bg: 'bg-purple-500/20', text: 'text-purple-300', border: 'border-purple-500/40' },
  FAILED: { label: 'Thất bại', bg: 'bg-rose-500/20', text: 'text-rose-300', border: 'border-rose-500/40' },
};

export const FULFILLMENT_CONFIG: Record<
  FulfillmentType,
  { label: string; badge: string }
> = {
  DELIVERY: { label: 'Giao hàng tận nơi', badge: 'bg-sky-500/15 text-sky-300 border-sky-500/30' },
  PICKUP: { label: 'Đến quán mang về', badge: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' },
  DINE_IN_BBQ: { label: 'Dùng tại quán / BBQ Suối', badge: 'bg-amber-500/15 text-amber-300 border-amber-500/30' },
};

export const PAYMENT_METHOD_NAMES: Record<PaymentMethod, string> = {
  VIETQR: 'VietQR (Chuyển khoản)',
  COD: 'Tiền mặt khi nhận (COD)',
  VNPAY: 'VNPAY-QR',
  MOMO: 'Ví MoMo',
  CARD: 'Thẻ thanh toán',
};

export default function AdminOrdersManager() {
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<OrderRecord | null>(null);
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Filters state
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'ALL'>('ALL');
  const [paymentFilter, setPaymentFilter] = useState<PaymentStatus | 'ALL'>('ALL');
  const [fulfillmentFilter, setFulfillmentFilter] = useState<FulfillmentType | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [datePreset, setDatePreset] = useState<'ALL' | 'TODAY' | '7DAYS' | '30DAYS'>('ALL');

  // Drawer edit state
  const [drawerAdminNote, setDrawerAdminNote] = useState('');
  const [drawerCancelReason, setDrawerCancelReason] = useState('');
  const [isResendingEmail, setIsResendingEmail] = useState(false);

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== 'ALL') params.set('orderStatus', statusFilter);
      if (paymentFilter !== 'ALL') params.set('paymentStatus', paymentFilter);
      if (fulfillmentFilter !== 'ALL') params.set('fulfillmentType', fulfillmentFilter);
      if (searchQuery.trim()) params.set('search', searchQuery.trim());
      if (datePreset !== 'ALL') params.set('datePreset', datePreset);

      const res = await fetch(`/api/admin/commerce/orders?${params.toString()}`, {
        credentials: 'include',
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok && json.success && Array.isArray(json.data)) {
        setOrders(json.data);
      } else if (res.ok && Array.isArray(json.orders)) {
        setOrders(json.orders);
      } else {
        // Fallback demo or empty
        setOrders([]);
      }
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, paymentFilter, fulfillmentFilter, searchQuery, datePreset]);

  useEffect(() => {
    fetchOrders();
    const timer = setInterval(fetchOrders, 30000); // Poll every 30s
    return () => clearInterval(timer);
  }, [fetchOrders]);

  // Quick order status update
  const handleUpdateStatus = async (orderId: string, newStatus: OrderStatus) => {
    setUpdatingId(orderId);
    try {
      const res = await fetch('/api/admin/commerce/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          id: orderId,
          orderStatus: newStatus,
          cancelReason: newStatus === 'CANCELLED' ? drawerCancelReason || 'Hủy bởi Quản trị viên' : undefined,
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok && (json.success || !json.error)) {
        showToast('success', `Đã chuyển đơn hàng sang trạng thái: ${ORDER_STATUS_CONFIG[newStatus].label}`);
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, orderStatus: newStatus } : o))
        );
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder((prev) => (prev ? { ...prev, orderStatus: newStatus } : null));
        }
      } else {
        showToast('error', json.error || 'Cập nhật trạng thái thất bại');
      }
    } catch {
      showToast('error', 'Lỗi kết nối khi cập nhật trạng thái');
    } finally {
      setUpdatingId(null);
    }
  };

  // Manual payment verification (Xác nhận đã nhận tiền)
  const handleConfirmPayment = async (orderId: string) => {
    setUpdatingId(orderId);
    try {
      const res = await fetch('/api/admin/commerce/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          id: orderId,
          paymentStatus: 'PAID',
          paidAt: new Date().toISOString(),
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok && (json.success || !json.error)) {
        showToast('success', 'Đã xác nhận thanh toán thành công!');
        setOrders((prev) =>
          prev.map((o) =>
            o.id === orderId ? { ...o, paymentStatus: 'PAID', paidAt: new Date().toISOString() } : o
          )
        );
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder((prev) =>
            prev ? { ...prev, paymentStatus: 'PAID', paidAt: new Date().toISOString() } : null
          );
        }
      } else {
        showToast('error', json.error || 'Không thể xác nhận thanh toán');
      }
    } catch {
      showToast('error', 'Lỗi kết nối xác nhận thanh toán');
    } finally {
      setUpdatingId(null);
    }
  };

  // Save admin note
  const handleSaveAdminNote = async () => {
    if (!selectedOrder) return;
    setUpdatingId(selectedOrder.id);
    try {
      const res = await fetch('/api/admin/commerce/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          id: selectedOrder.id,
          adminNote: drawerAdminNote,
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok && (json.success || !json.error)) {
        showToast('success', 'Đã lưu ghi chú nội bộ');
        setSelectedOrder((prev) => (prev ? { ...prev, adminNote: drawerAdminNote } : null));
        setOrders((prev) =>
          prev.map((o) => (o.id === selectedOrder.id ? { ...o, adminNote: drawerAdminNote } : o))
        );
      } else {
        showToast('error', json.error || 'Lỗi lưu ghi chú');
      }
    } catch {
      showToast('error', 'Lỗi kết nối lưu ghi chú');
    } finally {
      setUpdatingId(null);
    }
  };

  // Resend email
  const handleResendEmail = async () => {
    if (!selectedOrder) return;
    setIsResendingEmail(true);
    try {
      const res = await fetch(`/api/admin/commerce/orders/${selectedOrder.id}/resend-email`, {
        method: 'POST',
        credentials: 'include',
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok && (json.success || !json.error)) {
        showToast('success', `Đã gửi lại email hóa đơn tới: ${selectedOrder.customerEmail || selectedOrder.customerPhone}`);
      } else {
        showToast('error', json.error || 'Không thể gửi lại email');
      }
    } catch {
      showToast('error', 'Lỗi kết nối khi gửi lại email');
    } finally {
      setIsResendingEmail(false);
    }
  };

  const openOrderDetail = (order: OrderRecord) => {
    setSelectedOrder(order);
    setDrawerAdminNote(order.adminNote || '');
    setDrawerCancelReason(order.cancelReason || '');
    setIsDetailDrawerOpen(true);
  };

  // Filtered orders in client memory if API doesn't filter all
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      if (statusFilter !== 'ALL' && o.orderStatus !== statusFilter) return false;
      if (paymentFilter !== 'ALL' && o.paymentStatus !== paymentFilter) return false;
      if (fulfillmentFilter !== 'ALL' && o.fulfillmentType !== fulfillmentFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchCode = o.orderCode?.toLowerCase().includes(q);
        const matchName = o.customerName?.toLowerCase().includes(q);
        const matchPhone = o.customerPhone?.toLowerCase().includes(q);
        if (!matchCode && !matchName && !matchPhone) return false;
      }
      return true;
    });
  }, [orders, statusFilter, paymentFilter, fulfillmentFilter, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Header & Quick stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-sm">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">Quản lý Đơn hàng</h1>
              <p className="text-xs text-slate-400">
                Theo dõi, xử lý và in hóa đơn K80 cho khách đặt món & BBQ Suối Cẩm Cù
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchOrders}
            disabled={loading}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium border border-slate-700 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-emerald-400' : ''}`} />
            <span>Làm mới</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm mã đơn, tên khách, SĐT..."
              className="w-full pl-9 pr-3 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Status filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full px-3 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="ALL">Tất cả trạng thái đơn</option>
              <option value="PENDING">Chờ xác nhận (Mới)</option>
              <option value="CONFIRMED">Đã xác nhận</option>
              <option value="PREPARING">Đang pha chế/chuẩn bị</option>
              <option value="SHIPPING">Đang giao hàng</option>
              <option value="COMPLETED">Đã hoàn tất</option>
              <option value="CANCELLED">Đã hủy</option>
            </select>
          </div>

          {/* Payment filter */}
          <div>
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value as any)}
              className="w-full px-3 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="ALL">Tất cả thanh toán</option>
              <option value="UNPAID">Chưa thanh toán</option>
              <option value="PENDING_VERIFY">Chờ đối soát (VietQR)</option>
              <option value="PAID">Đã thanh toán (Thành công)</option>
              <option value="REFUNDED">Đã hoàn tiền</option>
              <option value="FAILED">Thất bại</option>
            </select>
          </div>

          {/* Fulfillment filter */}
          <div>
            <select
              value={fulfillmentFilter}
              onChange={(e) => setFulfillmentFilter(e.target.value as any)}
              className="w-full px-3 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="ALL">Tất cả hình thức nhận</option>
              <option value="DELIVERY">Giao hàng tận nơi</option>
              <option value="PICKUP">Đến quán mang về</option>
              <option value="DINE_IN_BBQ">Dùng tại quán / BBQ</option>
            </select>
          </div>
        </div>

        {/* Status quick tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-1 pb-0.5 text-xs">
          <button
            onClick={() => setStatusFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
              statusFilter === 'ALL'
                ? 'bg-emerald-600 text-white font-semibold'
                : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            Tất cả ({orders.length})
          </button>
          <button
            onClick={() => setStatusFilter('PENDING')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap flex items-center gap-1 transition-colors ${
              statusFilter === 'PENDING'
                ? 'bg-amber-600 text-white font-semibold'
                : 'bg-slate-800 text-amber-400 hover:text-white'
            }`}
          >
            <span>Chờ duyệt</span>
            <span className="px-1.5 py-0.2 bg-amber-500/30 rounded-full text-[10px] font-bold">
              {orders.filter((o) => o.orderStatus === 'PENDING').length}
            </span>
          </button>
          <button
            onClick={() => setStatusFilter('CONFIRMED')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
              statusFilter === 'CONFIRMED'
                ? 'bg-sky-600 text-white font-semibold'
                : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            Đã xác nhận ({orders.filter((o) => o.orderStatus === 'CONFIRMED').length})
          </button>
          <button
            onClick={() => setStatusFilter('PREPARING')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
              statusFilter === 'PREPARING'
                ? 'bg-purple-600 text-white font-semibold'
                : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            Đang làm ({orders.filter((o) => o.orderStatus === 'PREPARING').length})
          </button>
          <button
            onClick={() => setStatusFilter('SHIPPING')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
              statusFilter === 'SHIPPING'
                ? 'bg-blue-600 text-white font-semibold'
                : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            Đang ship ({orders.filter((o) => o.orderStatus === 'SHIPPING').length})
          </button>
          <button
            onClick={() => setStatusFilter('COMPLETED')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
              statusFilter === 'COMPLETED'
                ? 'bg-emerald-600 text-white font-semibold'
                : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            Hoàn tất ({orders.filter((o) => o.orderStatus === 'COMPLETED').length})
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-800/60 text-slate-400 font-semibold uppercase tracking-wider">
                <th className="py-3 px-4">Mã đơn & Thời gian</th>
                <th className="py-3 px-4">Khách hàng</th>
                <th className="py-3 px-4">Hình thức & Địa chỉ</th>
                <th className="py-3 px-4 text-right">Tổng tiền</th>
                <th className="py-3 px-4 text-center">Thanh toán</th>
                <th className="py-3 px-4 text-center">Trạng thái đơn</th>
                <th className="py-3 px-4 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {loading && orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-emerald-400 mb-2" />
                    <span>Đang tải danh sách đơn hàng...</span>
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <ShoppingBag className="w-8 h-8 mx-auto text-slate-600 mb-2" />
                    <p className="font-medium text-slate-300">Không tìm thấy đơn hàng nào</p>
                    <p className="text-slate-500 text-[11px] mt-0.5">
                      Thử thay đổi bộ lọc hoặc đợi khách đặt đơn mới
                    </p>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const statusConf = ORDER_STATUS_CONFIG[order.orderStatus] || ORDER_STATUS_CONFIG.PENDING;
                  const payConf = PAYMENT_STATUS_CONFIG[order.paymentStatus] || PAYMENT_STATUS_CONFIG.UNPAID;
                  const fulfillConf = FULFILLMENT_CONFIG[order.fulfillmentType] || FULFILLMENT_CONFIG.DELIVERY;
                  const isUpdating = updatingId === order.id;

                  return (
                    <tr
                      key={order.id}
                      className="hover:bg-slate-800/40 transition-colors group cursor-pointer"
                      onClick={() => openOrderDetail(order)}
                    >
                      {/* Order Code & Time */}
                      <td className="py-3 px-4">
                        <div className="font-mono font-bold text-emerald-400 text-sm">
                          #{order.orderCode}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-500" />
                          <span>
                            {new Date(order.createdAt).toLocaleDateString('vi-VN', {
                              hour: '2-digit',
                              minute: '2-digit',
                              day: '2-digit',
                              month: '2-digit',
                            })}
                          </span>
                        </div>
                      </td>

                      {/* Customer */}
                      <td className="py-3 px-4">
                        <div className="font-semibold text-white truncate max-w-[150px]">
                          {order.customerName}
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono mt-0.5 flex items-center gap-1">
                          <Phone className="w-3 h-3 text-slate-500" />
                          <span>{order.customerPhone}</span>
                        </div>
                      </td>

                      {/* Fulfillment */}
                      <td className="py-3 px-4 max-w-[200px]">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-semibold border ${fulfillConf.badge}`}
                        >
                          {fulfillConf.label}
                        </span>
                        {order.shippingAddress && (
                          <div className="text-[11px] text-slate-400 truncate mt-1 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
                            <span className="truncate">{order.shippingAddress}</span>
                          </div>
                        )}
                      </td>

                      {/* Total */}
                      <td className="py-3 px-4 text-right">
                        <div className="font-bold text-white font-mono text-sm">
                          {order.totalAmount.toLocaleString('vi-VN')}đ
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {order.items?.length || 0} món
                        </div>
                      </td>

                      {/* Payment */}
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-medium border ${payConf.bg} ${payConf.text} ${payConf.border}`}
                        >
                          {payConf.label}
                        </span>
                        <div className="text-[10px] text-slate-400 mt-1 font-mono">
                          {order.paymentMethod}
                        </div>
                      </td>

                      {/* Order Status */}
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${statusConf.bg} ${statusConf.text} ${statusConf.border}`}
                        >
                          <statusConf.icon className="w-3 h-3" />
                          <span>{statusConf.label}</span>
                        </span>
                      </td>

                      {/* Actions */}
                      <td
                        className="py-3 px-4 text-center"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => openOrderDetail(order)}
                            title="Xem chi tiết đơn"
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Quick manual payment confirm if UNPAID / PENDING_VERIFY */}
                          {(order.paymentStatus === 'UNPAID' || order.paymentStatus === 'PENDING_VERIFY') && (
                            <button
                              type="button"
                              onClick={() => handleConfirmPayment(order.id)}
                              disabled={isUpdating}
                              title="Xác nhận đã nhận tiền (VietQR / Chuyển khoản)"
                              className="p-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30 transition-colors"
                            >
                              <DollarSign className="w-4 h-4" />
                            </button>
                          )}

                          {/* Quick Print button */}
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedOrder(order);
                              setIsPrintModalOpen(true);
                            }}
                            title="In hóa đơn K80"
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                          >
                            <Printer className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================= */}
      {/* ORDER DETAIL DRAWER / MODAL */}
      {/* ========================================================= */}
      {isDetailDrawerOpen && selectedOrder && (
        <div
          className="fixed inset-0 z-50 bg-black/75 flex justify-end animate-in fade-in duration-200"
          onClick={() => setIsDetailDrawerOpen(false)}
        >
          <div
            className="w-full max-w-2xl bg-slate-900 border-l border-slate-800 h-full overflow-y-auto flex flex-col justify-between p-6 text-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-bold font-mono text-emerald-400">
                        #{selectedOrder.orderCode}
                      </h2>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                          ORDER_STATUS_CONFIG[selectedOrder.orderStatus]?.bg
                        } ${ORDER_STATUS_CONFIG[selectedOrder.orderStatus]?.text} ${
                          ORDER_STATUS_CONFIG[selectedOrder.orderStatus]?.border
                        }`}
                      >
                        {ORDER_STATUS_CONFIG[selectedOrder.orderStatus]?.label}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">
                      Tạo lúc:{' '}
                      {new Date(selectedOrder.createdAt).toLocaleString('vi-VN')}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsPrintModalOpen(true)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-semibold rounded-xl text-slate-200 border border-slate-700 transition-colors"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>In Bill K80</span>
                  </button>
                  <button
                    onClick={() => setIsDetailDrawerOpen(false)}
                    className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Status Update Quick Bar */}
              <div className="my-5 p-3.5 bg-slate-800/70 border border-slate-700/80 rounded-xl space-y-2">
                <div className="text-xs font-semibold text-slate-300">
                  Cập nhật tiến độ đơn hàng:
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
                  {(['PENDING', 'CONFIRMED', 'PREPARING', 'SHIPPING', 'COMPLETED', 'CANCELLED'] as OrderStatus[]).map(
                    (st) => {
                      const isActive = selectedOrder.orderStatus === st;
                      const conf = ORDER_STATUS_CONFIG[st];
                      return (
                        <button
                          key={st}
                          type="button"
                          onClick={() => handleUpdateStatus(selectedOrder.id, st)}
                          disabled={updatingId === selectedOrder.id}
                          className={`py-1.5 px-2 rounded-lg text-[11px] font-semibold text-center transition-all ${
                            isActive
                              ? `${conf.bg} ${conf.text} border ${conf.border} shadow-sm font-bold`
                              : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
                          }`}
                        >
                          {conf.label}
                        </button>
                      );
                    }
                  )}
                </div>
              </div>

              {/* Customer & Fulfillment Info Card */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
                <div className="p-3.5 bg-slate-800/40 border border-slate-800 rounded-xl space-y-1.5">
                  <div className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Thông tin Khách hàng</span>
                  </div>
                  <div className="text-sm font-bold text-white">
                    {selectedOrder.customerName}
                  </div>
                  <div className="text-xs text-slate-300 flex items-center gap-1 font-mono">
                    <Phone className="w-3 h-3 text-slate-500" />
                    <a
                      href={`tel:${selectedOrder.customerPhone}`}
                      className="hover:text-emerald-400 underline"
                    >
                      {selectedOrder.customerPhone}
                    </a>
                  </div>
                  {selectedOrder.customerEmail && (
                    <div className="text-xs text-slate-400 truncate">
                      {selectedOrder.customerEmail}
                    </div>
                  )}
                </div>

                <div className="p-3.5 bg-slate-800/40 border border-slate-800 rounded-xl space-y-1.5">
                  <div className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-sky-400" />
                    <span>Hình thức phục vụ</span>
                  </div>
                  <div className="text-xs font-bold text-sky-300">
                    {FULFILLMENT_CONFIG[selectedOrder.fulfillmentType]?.label || selectedOrder.fulfillmentType}
                  </div>
                  {selectedOrder.shippingAddress && (
                    <div className="text-xs text-slate-300 flex items-start gap-1">
                      <MapPin className="w-3 h-3 text-slate-500 shrink-0 mt-0.5" />
                      <span>{selectedOrder.shippingAddress}</span>
                    </div>
                  )}
                  {selectedOrder.customerNote && (
                    <div className="text-xs text-amber-300/90 bg-amber-500/10 p-2 rounded-lg border border-amber-500/20 mt-1">
                      <span className="font-semibold">Khách dặn:</span> {selectedOrder.customerNote}
                    </div>
                  )}
                </div>
              </div>

              {/* Items Breakdown */}
              <div className="mb-5">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Danh sách món đã gọi ({selectedOrder.items?.length || 0})
                </div>
                <div className="border border-slate-800 rounded-xl divide-y divide-slate-800/80 bg-slate-800/30 overflow-hidden">
                  {selectedOrder.items && selectedOrder.items.length > 0 ? (
                    selectedOrder.items.map((item, idx) => (
                      <div key={idx} className="p-3 flex items-start justify-between gap-3 text-xs">
                        <div className="space-y-1 flex-1">
                          <div className="font-semibold text-white">
                            {item.itemNameVi}
                            {item.itemNameEn && (
                              <span className="text-slate-400 font-normal ml-1">({item.itemNameEn})</span>
                            )}
                          </div>
                          {/* Selected options */}
                          {item.selectedOptions && Array.isArray(item.selectedOptions) && item.selectedOptions.length > 0 && (
                            <div className="text-[11px] text-emerald-400/90 space-y-0.5">
                              {item.selectedOptions.map((opt: any, oIdx: number) => (
                                <div key={oIdx} className="flex items-center gap-1">
                                  <span className="text-slate-500">•</span>
                                  <span>{opt.groupNameVi || opt.group}:</span>
                                  <span className="font-medium">{opt.labelVi || opt.label}</span>
                                  {opt.priceDelta > 0 && (
                                    <span className="text-slate-400">
                                      (+{opt.priceDelta.toLocaleString('vi-VN')}đ)
                                    </span>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                          {item.itemNote && (
                            <div className="text-[11px] text-amber-300 italic">
                              Ghi chú: {item.itemNote}
                            </div>
                          )}
                          <div className="text-[11px] text-slate-400">
                            {item.unitPrice.toLocaleString('vi-VN')}đ × {item.quantity}
                          </div>
                        </div>

                        <div className="text-right font-mono font-bold text-white text-xs">
                          {item.lineTotal.toLocaleString('vi-VN')}đ
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-slate-500 text-xs">
                      Không có món chi tiết
                    </div>
                  )}
                </div>
              </div>

              {/* Financials & Voucher */}
              <div className="p-4 bg-slate-800/50 border border-slate-800 rounded-xl space-y-2 text-xs mb-5">
                <div className="flex justify-between text-slate-400">
                  <span>Tạm tính (Subtotal):</span>
                  <span className="font-mono text-white">
                    {selectedOrder.subtotal?.toLocaleString('vi-VN')}đ
                  </span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Phí giao hàng:</span>
                  <span className="font-mono text-white">
                    +{selectedOrder.shippingFee?.toLocaleString('vi-VN')}đ
                  </span>
                </div>
                {selectedOrder.discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>
                      Giảm giá voucher {selectedOrder.voucherCode ? `(${selectedOrder.voucherCode})` : ''}:
                    </span>
                    <span className="font-mono font-bold">
                      -{selectedOrder.discountAmount.toLocaleString('vi-VN')}đ
                    </span>
                  </div>
                )}
                <div className="border-t border-slate-700/80 pt-2 flex justify-between text-sm font-bold text-white">
                  <span>Tổng tiền thanh toán:</span>
                  <span className="font-mono text-emerald-400 text-base">
                    {selectedOrder.totalAmount?.toLocaleString('vi-VN')}đ
                  </span>
                </div>
              </div>

              {/* Payment Section & Manual Confirm */}
              <div className="p-4 bg-slate-800/30 border border-slate-800 rounded-xl space-y-3 mb-5">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Phương thức & Trạng thái thanh toán</span>
                  </div>
                  <span
                    className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${
                      PAYMENT_STATUS_CONFIG[selectedOrder.paymentStatus]?.bg
                    } ${PAYMENT_STATUS_CONFIG[selectedOrder.paymentStatus]?.text} ${
                      PAYMENT_STATUS_CONFIG[selectedOrder.paymentStatus]?.border
                    }`}
                  >
                    {PAYMENT_STATUS_CONFIG[selectedOrder.paymentStatus]?.label}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-slate-400">
                  <div>
                    Hình thức:{' '}
                    <span className="text-white font-medium">
                      {PAYMENT_METHOD_NAMES[selectedOrder.paymentMethod] || selectedOrder.paymentMethod}
                    </span>
                  </div>
                  <div>
                    Mã đối soát:{' '}
                    <span className="font-mono text-white">
                      {selectedOrder.paymentRef || 'Chưa có'}
                    </span>
                  </div>
                  {selectedOrder.paidAt && (
                    <div className="col-span-2 text-emerald-400">
                      Đã thanh toán lúc: {new Date(selectedOrder.paidAt).toLocaleString('vi-VN')}
                    </div>
                  )}
                </div>

                {/* Manual "Xác nhận đã nhận tiền" button */}
                {selectedOrder.paymentStatus !== 'PAID' && (
                  <button
                    type="button"
                    onClick={() => handleConfirmPayment(selectedOrder.id)}
                    disabled={updatingId === selectedOrder.id}
                    className="w-full py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-sm"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Xác nhận đã nhận đủ tiền (VietQR / Chuyển khoản)</span>
                  </button>
                )}
              </div>

              {/* Admin Note & Cancel Reason */}
              <div className="space-y-3 mb-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Ghi chú nội bộ Admin (chỉ quán xem):
                  </label>
                  <textarea
                    rows={2}
                    value={drawerAdminNote}
                    onChange={(e) => setDrawerAdminNote(e.target.value)}
                    placeholder="Ghi chú nhân viên pha chế, tài xế, dặn dò..."
                    className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={handleSaveAdminNote}
                    disabled={updatingId === selectedOrder.id}
                    className="mt-1 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium border border-slate-700 transition-colors"
                  >
                    Lưu ghi chú
                  </button>
                </div>

                {selectedOrder.orderStatus === 'CANCELLED' && (
                  <div>
                    <label className="block text-xs font-semibold text-rose-400 mb-1">
                      Lý do hủy đơn:
                    </label>
                    <input
                      type="text"
                      value={drawerCancelReason}
                      onChange={(e) => setDrawerCancelReason(e.target.value)}
                      placeholder="Khách đổi ý, hết món, sai địa chỉ..."
                      className="w-full p-2.5 bg-slate-800 border border-rose-500/30 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Drawer Footer Actions */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleResendEmail}
                disabled={isResendingEmail}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium border border-slate-700 transition-colors"
              >
                <Mail className={`w-3.5 h-3.5 ${isResendingEmail ? 'animate-spin' : ''}`} />
                <span>{isResendingEmail ? 'Đang gửi...' : 'Gửi lại email hóa đơn'}</span>
              </button>

              <button
                type="button"
                onClick={() => setIsPrintModalOpen(true)}
                className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-colors shadow-sm"
              >
                <Printer className="w-4 h-4" />
                <span>In Bill K80 ngay</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 80mm THERMAL RECEIPT PRINT MODAL & PREVIEW */}
      {/* ========================================================= */}
      {isPrintModalOpen && selectedOrder && (
        <div
          className="fixed inset-0 z-[60] bg-black/80 flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={() => setIsPrintModalOpen(false)}
        >
          <div
            className="bg-white text-slate-900 rounded-2xl max-w-sm w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Modal Controls */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4 print:hidden">
              <span className="text-xs font-mono font-bold uppercase text-slate-500">
                Xem trước Bill 80mm
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow"
                >
                  In ngay (Ctrl+P)
                </button>
                <button
                  type="button"
                  onClick={() => setIsPrintModalOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* THERMAL RECEIPT CONTAINER (80mm width) */}
            <div
              id="k80-receipt"
              className="text-[12px] font-mono leading-tight space-y-3 bg-white p-2"
            >
              {/* Header */}
              <div className="text-center space-y-1 border-b border-dashed border-slate-400 pb-3">
                <div className="text-base font-extrabold uppercase tracking-wide">
                  CẨM CÙ HOUSE
                </div>
                <div className="text-[11px] text-slate-600">
                  Cà Phê & Điểm Hẹn Bên Rừng Suối
                </div>
                <div className="text-[10px] text-slate-600">
                  Hẻm 437 Hùng Vương, P. Nghĩa Trung, TP. Gia Nghĩa, Đắk Nông
                </div>
                <div className="text-[11px] font-bold">
                  Hotline / Zalo: 038 285 1688
                </div>
              </div>

              {/* Order Meta */}
              <div className="border-b border-dashed border-slate-400 pb-2 space-y-0.5 text-[11px]">
                <div className="flex justify-between">
                  <span>MÃ ĐƠN:</span>
                  <span className="font-extrabold">#{selectedOrder.orderCode}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Ngày giờ:</span>
                  <span>{new Date(selectedOrder.createdAt).toLocaleString('vi-VN')}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Khách hàng:</span>
                  <span className="font-semibold text-slate-900">{selectedOrder.customerName}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Điện thoại:</span>
                  <span className="font-bold">{selectedOrder.customerPhone}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Hình thức:</span>
                  <span className="font-semibold">
                    {FULFILLMENT_CONFIG[selectedOrder.fulfillmentType]?.label || selectedOrder.fulfillmentType}
                  </span>
                </div>
                {selectedOrder.shippingAddress && (
                  <div className="text-[10px] text-slate-700 pt-0.5">
                    Đ/C: {selectedOrder.shippingAddress}
                  </div>
                )}
              </div>

              {/* Items Table */}
              <div className="border-b border-dashed border-slate-400 pb-2">
                <div className="flex justify-between font-bold border-b border-slate-300 pb-1 text-[11px]">
                  <span>Món</span>
                  <span className="text-right">T.Tiền</span>
                </div>
                <div className="divide-y divide-slate-100 py-1 space-y-1">
                  {selectedOrder.items?.map((item, idx) => (
                    <div key={idx} className="pt-1">
                      <div className="flex justify-between font-semibold">
                        <span>
                          {item.quantity}x {item.itemNameVi}
                        </span>
                        <span>{item.lineTotal.toLocaleString('vi-VN')}đ</span>
                      </div>
                      {item.selectedOptions && Array.isArray(item.selectedOptions) && (
                        <div className="text-[10px] text-slate-600 pl-2">
                          {item.selectedOptions.map((o: any, oI: number) => (
                            <span key={oI}>
                              +{o.labelVi || o.label}{' '}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Bill Totals */}
              <div className="space-y-1 text-[11px] border-b border-dashed border-slate-400 pb-2">
                <div className="flex justify-between">
                  <span>Tạm tính:</span>
                  <span>{selectedOrder.subtotal?.toLocaleString('vi-VN')}đ</span>
                </div>
                <div className="flex justify-between">
                  <span>Phí vận chuyển:</span>
                  <span>+{selectedOrder.shippingFee?.toLocaleString('vi-VN')}đ</span>
                </div>
                {selectedOrder.discountAmount > 0 && (
                  <div className="flex justify-between font-semibold">
                    <span>Giảm voucher:</span>
                    <span>-{selectedOrder.discountAmount.toLocaleString('vi-VN')}đ</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-extrabold border-t border-slate-400 pt-1">
                  <span>TỔNG CỘNG:</span>
                  <span>{selectedOrder.totalAmount?.toLocaleString('vi-VN')}đ</span>
                </div>
              </div>

              {/* Payment Status */}
              <div className="text-center text-[11px] space-y-0.5 border-b border-dashed border-slate-400 pb-2">
                <div className="font-bold">
                  Thanh toán: {PAYMENT_METHOD_NAMES[selectedOrder.paymentMethod] || selectedOrder.paymentMethod}
                </div>
                <div className="text-[10px] uppercase font-bold text-slate-700">
                  Trạng thái:{' '}
                  {selectedOrder.paymentStatus === 'PAID'
                    ? 'ĐÃ THANH TOÁN ĐỦ'
                    : 'CHƯA THANH TOÁN (THU COD)'}
                </div>
              </div>

              {/* Footer notes */}
              <div className="text-center space-y-1 pt-1 text-[10px] text-slate-600">
                <div>Cảm ơn Quý khách & Hẹn gặp lại!</div>
                <div className="italic">camcuhouse.online</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Global Toast */}
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

      {/* Print styles for clean 80mm receipt */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          #k80-receipt,
          #k80-receipt * {
            visibility: visible !important;
          }
          #k80-receipt {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 76mm !important;
            padding: 2mm !important;
            margin: 0 !important;
            color: #000 !important;
            background: #fff !important;
            font-family: monospace !important;
          }
        }
      `}</style>
    </div>
  );
}
