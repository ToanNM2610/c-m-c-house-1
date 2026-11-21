'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Users,
  Search,
  Mail,
  Phone,
  Download,
  Trash2,
  Lock,
  Unlock,
  Eye,
  Calendar,
  DollarSign,
  ShoppingBag,
  Clock,
  X,
  AlertCircle,
  CheckCircle2,
  Loader2,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';
import { CustomerSafe, NewsletterSubscriberRecord, OrderRecord } from '@/types';

export default function AdminCustomersManager() {
  const [activeTab, setActiveTab] = useState<'customers' | 'subscribers'>('customers');

  // Customers state
  const [customers, setCustomers] = useState<CustomerSafe[]>([]);
  const [loadingCustomers, setLoadingCustomers] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [updatingCustomerId, setUpdatingCustomerId] = useState<string | null>(null);

  // Customer order history drawer state
  const [inspectCustomer, setInspectCustomer] = useState<CustomerSafe | null>(null);
  const [customerOrders, setCustomerOrders] = useState<OrderRecord[]>([]);
  const [loadingCustomerOrders, setLoadingCustomerOrders] = useState(false);

  // Subscribers state
  const [subscribers, setSubscribers] = useState<NewsletterSubscriberRecord[]>([]);
  const [loadingSubscribers, setLoadingSubscribers] = useState(false);
  const [subscriberSearch, setSubscriberSearch] = useState('');

  // Toast
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  };

  // Fetch Customers
  const fetchCustomers = useCallback(async () => {
    setLoadingCustomers(true);
    try {
      const res = await fetch('/api/admin/commerce/customers', { credentials: 'include' });
      const json = await res.json().catch(() => ({}));
      if (res.ok && json.success && Array.isArray(json.data)) {
        setCustomers(json.data);
      } else if (res.ok && Array.isArray(json.customers)) {
        setCustomers(json.customers);
      } else {
        setCustomers(DEFAULT_CUSTOMERS);
      }
    } catch {
      setCustomers(DEFAULT_CUSTOMERS);
    } finally {
      setLoadingCustomers(false);
    }
  }, []);

  // Fetch Subscribers
  const fetchSubscribers = useCallback(async () => {
    setLoadingSubscribers(true);
    try {
      const res = await fetch('/api/admin/commerce/newsletter', { credentials: 'include' });
      const json = await res.json().catch(() => ({}));
      if (res.ok && json.success && Array.isArray(json.data)) {
        setSubscribers(json.data);
      } else if (res.ok && Array.isArray(json.subscribers)) {
        setSubscribers(json.subscribers);
      } else {
        setSubscribers(DEFAULT_SUBSCRIBERS);
      }
    } catch {
      setSubscribers(DEFAULT_SUBSCRIBERS);
    } finally {
      setLoadingSubscribers(false);
    }
  }, []);

  useEffect(() => {
    fetchCustomers();
    fetchSubscribers();
  }, [fetchCustomers, fetchSubscribers]);

  // Lock / Unlock customer account
  const handleToggleCustomerLock = async (customer: CustomerSafe) => {
    setUpdatingCustomerId(customer.id);
    const newActiveState = !customer.isActive;
    try {
      const res = await fetch('/api/admin/commerce/customers', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          id: customer.id,
          isActive: newActiveState,
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok && (json.success || !json.error)) {
        showToast(
          'success',
          newActiveState
            ? `Đã mở khóa tài khoản của khách: ${customer.fullName}`
            : `Đã khóa tài khoản của khách: ${customer.fullName}`
        );
        setCustomers((prev) =>
          prev.map((c) => (c.id === customer.id ? { ...c, isActive: newActiveState } : c))
        );
        if (inspectCustomer && inspectCustomer.id === customer.id) {
          setInspectCustomer((prev) => (prev ? { ...prev, isActive: newActiveState } : null));
        }
      } else {
        showToast('error', json.error || 'Lỗi cập nhật trạng thái');
      }
    } catch {
      showToast('error', 'Lỗi kết nối cập nhật trạng thái');
    } finally {
      setUpdatingCustomerId(null);
    }
  };

  // Inspect customer order history
  const handleInspectCustomer = async (customer: CustomerSafe) => {
    setInspectCustomer(customer);
    setLoadingCustomerOrders(true);
    try {
      const res = await fetch(`/api/admin/commerce/orders?customerId=${customer.id}`, {
        credentials: 'include',
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok && json.success && Array.isArray(json.data)) {
        setCustomerOrders(json.data);
      } else if (res.ok && Array.isArray(json.orders)) {
        setCustomerOrders(json.orders);
      } else {
        setCustomerOrders([]);
      }
    } catch {
      setCustomerOrders([]);
    } finally {
      setLoadingCustomerOrders(false);
    }
  };

  // Delete subscriber
  const handleDeleteSubscriber = async (subscriberId: string) => {
    if (!window.confirm('Bạn có chắc muốn xóa email này khỏi danh sách bản tin?')) return;
    try {
      const res = await fetch(`/api/admin/commerce/newsletter?id=${subscriberId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok && (json.success || !json.error)) {
        showToast('success', 'Đã xóa đăng ký nhận tin');
        setSubscribers((prev) => prev.filter((s) => s.id !== subscriberId));
      } else {
        showToast('error', json.error || 'Lỗi xóa đăng ký');
      }
    } catch {
      showToast('error', 'Lỗi kết nối');
    }
  };

  // Export Subscribers to CSV
  const exportSubscribersCSV = () => {
    if (subscribers.length === 0) {
      showToast('error', 'Không có dữ liệu subscriber để xuất');
      return;
    }
    const headers = ['Email', 'Ngôn ngữ', 'Ngày đăng ký', 'Trạng thái'];
    const rows = subscribers.map((s) => [
      `"${s.email}"`,
      `"${s.locale || 'vi'}"`,
      `"${new Date(s.createdAt).toISOString()}"`,
      s.isActive ? '"Hoạt động"' : '"Hủy đăng ký"',
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `camcu_subscribers_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('success', `Đã xuất ${subscribers.length} email sang file CSV!`);
  };

  // Filtered customers
  const filteredCustomers = useMemo(() => {
    if (!searchQuery.trim()) return customers;
    const q = searchQuery.toLowerCase();
    return customers.filter(
      (c) =>
        c.fullName.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        (c.phone && c.phone.includes(q))
    );
  }, [customers, searchQuery]);

  // Filtered subscribers
  const filteredSubscribers = useMemo(() => {
    if (!subscriberSearch.trim()) return subscribers;
    const q = subscriberSearch.toLowerCase();
    return subscribers.filter((s) => s.email.toLowerCase().includes(q));
  }, [subscribers, subscriberSearch]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">Khách hàng & Bản tin</h1>
            <p className="text-xs text-slate-400">
              Quản lý hồ sơ CRM khách đặt hàng, tổng chi tiêu, lịch sử đơn và danh sách email bản tin
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 bg-slate-800/80 p-1 rounded-xl border border-slate-700/80">
          <button
            type="button"
            onClick={() => setActiveTab('customers')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'customers'
                ? 'bg-emerald-600 text-white shadow'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Hồ sơ khách hàng ({customers.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('subscribers')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'subscribers'
                ? 'bg-emerald-600 text-white shadow'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Đăng ký Bản tin ({subscribers.length})
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* TAB 1: CUSTOMERS CRM TABLE */}
      {/* ========================================================= */}
      {activeTab === 'customers' && (
        <div className="space-y-4">
          {/* Search bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900/90 border border-slate-800 p-4 rounded-2xl">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm theo tên, email, SĐT khách..."
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

            <div className="text-xs text-slate-400">
              Tổng số khách hàng CRM: <strong className="text-white">{customers.length}</strong>
            </div>
          </div>

          {/* CRM Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-800/60 text-slate-400 font-semibold uppercase tracking-wider">
                    <th className="py-3 px-4">Khách hàng</th>
                    <th className="py-3 px-4">Liên hệ (Email & SĐT)</th>
                    <th className="py-3 px-4 text-center">Số đơn đã đặt</th>
                    <th className="py-3 px-4 text-right">Tổng chi tiêu (LTV)</th>
                    <th className="py-3 px-4 text-center">Ngày gia nhập</th>
                    <th className="py-3 px-4 text-center">Trạng thái</th>
                    <th className="py-3 px-4 text-center">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {loadingCustomers ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-slate-400">
                        <Loader2 className="w-6 h-6 animate-spin mx-auto text-emerald-400 mb-2" />
                        <span>Đang tải danh sách khách hàng...</span>
                      </td>
                    </tr>
                  ) : filteredCustomers.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-slate-400">
                        <Users className="w-8 h-8 mx-auto text-slate-600 mb-2" />
                        <p className="font-medium text-slate-300">Không tìm thấy khách hàng nào</p>
                      </td>
                    </tr>
                  ) : (
                    filteredCustomers.map((c) => {
                      const isUpdating = updatingCustomerId === c.id;
                      return (
                        <tr key={c.id} className="hover:bg-slate-800/40 transition-colors">
                          {/* Name & Avatar */}
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-full bg-emerald-600/20 text-emerald-400 flex items-center justify-center font-bold text-xs border border-emerald-500/30">
                                {c.fullName.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <div className="font-semibold text-white">{c.fullName}</div>
                                <div className="text-[10px] text-slate-500 font-mono">
                                  ID: {c.id.slice(0, 8)}...
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Email & Phone */}
                          <td className="py-3 px-4">
                            <div className="text-slate-300">{c.email}</div>
                            {c.phone && (
                              <div className="text-[11px] text-slate-400 font-mono mt-0.5 flex items-center gap-1">
                                <Phone className="w-3 h-3 text-slate-500" />
                                <span>{c.phone}</span>
                              </div>
                            )}
                          </td>

                          {/* Orders count */}
                          <td className="py-3 px-4 text-center font-mono font-bold text-white">
                            {c.orderCount ?? 0}
                          </td>

                          {/* Total spent */}
                          <td className="py-3 px-4 text-right font-mono font-bold text-emerald-400 text-sm">
                            {(c.totalSpent ?? 0).toLocaleString('vi-VN')}đ
                          </td>

                          {/* Registered date */}
                          <td className="py-3 px-4 text-center text-slate-400 font-mono text-[11px]">
                            {c.createdAt
                              ? new Date(c.createdAt).toLocaleDateString('vi-VN')
                              : 'Vừa tạo'}
                          </td>

                          {/* Status */}
                          <td className="py-3 px-4 text-center">
                            <span
                              className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                                c.isActive
                                  ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                                  : 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                              }`}
                            >
                              {c.isActive ? 'Hoạt động' : 'Đã khóa'}
                            </span>
                          </td>

                          {/* Actions */}
                          <td className="py-3 px-4 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              {/* Inspect order history button */}
                              <button
                                type="button"
                                onClick={() => handleInspectCustomer(c)}
                                title="Xem lịch sử đơn hàng của khách"
                                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>

                              {/* Lock / Unlock button */}
                              <button
                                type="button"
                                onClick={() => handleToggleCustomerLock(c)}
                                disabled={isUpdating}
                                title={c.isActive ? 'Khóa tài khoản khách' : 'Mở khóa tài khoản'}
                                className={`p-1.5 rounded-lg transition-colors ${
                                  c.isActive
                                    ? 'bg-slate-800 hover:bg-rose-500/20 text-slate-300 hover:text-rose-400'
                                    : 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30'
                                }`}
                              >
                                {c.isActive ? (
                                  <Lock className="w-3.5 h-3.5" />
                                ) : (
                                  <Unlock className="w-3.5 h-3.5" />
                                )}
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
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: NEWSLETTER SUBSCRIBERS */}
      {/* ========================================================= */}
      {activeTab === 'subscribers' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900/90 border border-slate-800 p-4 rounded-2xl">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={subscriberSearch}
                onChange={(e) => setSubscriberSearch(e.target.value)}
                placeholder="Tìm email đăng ký bản tin..."
                className="w-full pl-9 pr-3 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={exportSubscribersCSV}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-colors shadow-sm"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Xuất CSV ({subscribers.length} email)</span>
              </button>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-800/60 text-slate-400 font-semibold uppercase tracking-wider">
                    <th className="py-3 px-4">Email đăng ký</th>
                    <th className="py-3 px-4 text-center">Ngôn ngữ</th>
                    <th className="py-3 px-4 text-center">Thời gian đăng ký</th>
                    <th className="py-3 px-4 text-center">Trạng thái</th>
                    <th className="py-3 px-4 text-center">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {loadingSubscribers ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-slate-400">
                        <Loader2 className="w-6 h-6 animate-spin mx-auto text-emerald-400 mb-2" />
                        <span>Đang tải danh sách email...</span>
                      </td>
                    </tr>
                  ) : filteredSubscribers.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-slate-400">
                        <Mail className="w-8 h-8 mx-auto text-slate-600 mb-2" />
                        <p className="font-medium text-slate-300">Chưa có người đăng ký bản tin</p>
                      </td>
                    </tr>
                  ) : (
                    filteredSubscribers.map((s) => (
                      <tr key={s.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 px-4 font-medium text-white flex items-center gap-2">
                          <Mail className="w-3.5 h-3.5 text-slate-500" />
                          <span>{s.email}</span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className="uppercase font-mono text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                            {s.locale || 'vi'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center text-slate-400 font-mono text-[11px]">
                          {new Date(s.createdAt).toLocaleString('vi-VN')}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span
                            className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                              s.isActive
                                ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                                : 'bg-slate-800 text-slate-500 border-slate-700'
                            }`}
                          >
                            {s.isActive ? 'Đang nhận tin' : 'Đã hủy'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <button
                            type="button"
                            onClick={() => handleDeleteSubscriber(s.id)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-500/20 text-slate-300 hover:text-rose-400 transition-colors"
                            title="Xóa khỏi danh sách"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* CUSTOMER ORDER HISTORY DRAWER */}
      {/* ========================================================= */}
      {inspectCustomer && (
        <div
          className="fixed inset-0 z-50 bg-black/75 flex justify-end animate-in fade-in duration-200"
          onClick={() => setInspectCustomer(null)}
        >
          <div
            className="w-full max-w-xl bg-slate-900 border-l border-slate-800 h-full overflow-y-auto flex flex-col justify-between p-6 text-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-600/20 text-emerald-400 flex items-center justify-center font-bold text-sm border border-emerald-500/30">
                    {inspectCustomer.fullName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-white">
                      {inspectCustomer.fullName}
                    </h2>
                    <p className="text-xs text-slate-400">{inspectCustomer.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => setInspectCustomer(null)}
                  className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* CRM KPI highlights */}
              <div className="grid grid-cols-2 gap-3 my-5">
                <div className="p-3 bg-slate-800/50 border border-slate-800 rounded-xl">
                  <div className="text-[11px] text-slate-400">Tổng chi tiêu:</div>
                  <div className="text-base font-bold text-emerald-400 font-mono mt-0.5">
                    {(inspectCustomer.totalSpent ?? 0).toLocaleString('vi-VN')}đ
                  </div>
                </div>
                <div className="p-3 bg-slate-800/50 border border-slate-800 rounded-xl">
                  <div className="text-[11px] text-slate-400">Tổng số đơn hàng:</div>
                  <div className="text-base font-bold text-white font-mono mt-0.5">
                    {inspectCustomer.orderCount ?? 0} đơn
                  </div>
                </div>
              </div>

              {/* Order history list */}
              <div>
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Lịch sử đơn hàng của khách ({customerOrders.length})
                </h3>

                {loadingCustomerOrders ? (
                  <div className="py-8 text-center text-slate-400 text-xs">
                    <Loader2 className="w-5 h-5 animate-spin mx-auto text-emerald-400 mb-1" />
                    <span>Đang tải lịch sử đơn...</span>
                  </div>
                ) : customerOrders.length === 0 ? (
                  <div className="p-6 text-center text-slate-500 text-xs bg-slate-800/30 rounded-xl border border-slate-800">
                    Khách hàng chưa phát sinh đơn hàng nào
                  </div>
                ) : (
                  <div className="space-y-2">
                    {customerOrders.map((ord) => (
                      <div
                        key={ord.id}
                        className="p-3 bg-slate-800/40 border border-slate-800 rounded-xl flex items-center justify-between text-xs hover:border-slate-700 transition-colors"
                      >
                        <div>
                          <div className="font-mono font-bold text-emerald-400">
                            #{ord.orderCode}
                          </div>
                          <div className="text-[11px] text-slate-400 mt-0.5">
                            {new Date(ord.createdAt).toLocaleDateString('vi-VN', {
                              hour: '2-digit',
                              minute: '2-digit',
                              day: '2-digit',
                              month: '2-digit',
                            })}
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="font-mono font-bold text-white">
                            {ord.totalAmount?.toLocaleString('vi-VN')}đ
                          </div>
                          <div className="text-[10px] text-slate-400 uppercase mt-0.5 font-semibold">
                            {ord.orderStatus}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <button
                type="button"
                onClick={() => handleToggleCustomerLock(inspectCustomer)}
                disabled={updatingCustomerId === inspectCustomer.id}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                  inspectCustomer.isActive
                    ? 'bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 border border-rose-500/30'
                    : 'bg-emerald-600 text-white hover:bg-emerald-500'
                }`}
              >
                {inspectCustomer.isActive ? 'Khóa tài khoản này' : 'Mở khóa tài khoản'}
              </button>

              <button
                type="button"
                onClick={() => setInspectCustomer(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
              >
                Đóng
              </button>
            </div>
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

// Default initial demo customers if DB is empty
const DEFAULT_CUSTOMERS: CustomerSafe[] = [
  {
    id: 'cust-1',
    fullName: 'Trần Minh Quang',
    email: 'minhquang.tran@gmail.com',
    phone: '0918234567',
    totalSpent: 485000,
    orderCount: 4,
    isActive: true,
  },
  {
    id: 'cust-2',
    fullName: 'Lê Thu Thảo',
    email: 'thuthao.le@gmail.com',
    phone: '0987654321',
    totalSpent: 720000,
    orderCount: 6,
    isActive: true,
  },
  {
    id: 'cust-3',
    fullName: 'Nguyễn Văn Đạt',
    email: 'dat.daknong@yahoo.com',
    phone: '0905112233',
    totalSpent: 120000,
    orderCount: 1,
    isActive: true,
  },
];

// Default initial subscribers
const DEFAULT_SUBSCRIBERS: NewsletterSubscriberRecord[] = [
  {
    id: 'sub-1',
    email: 'khachhang.gianghia@gmail.com',
    locale: 'vi',
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'sub-2',
    email: 'traveler.vietnam@outlook.com',
    locale: 'en',
    isActive: true,
    createdAt: new Date().toISOString(),
  },
];
