'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  User,
  ShoppingBag,
  MapPin,
  Heart,
  LogOut,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  Clock,
  RotateCcw,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  ArrowRight,
  Loader2,
  Sparkles,
  Phone,
  Mail,
  Home,
  ShieldCheck,
} from 'lucide-react';
import { useCustomerAuth } from '@/context/CustomerAuthContext';
import { useCart } from '@/context/CartContext';
import { useApp } from '@/context/AppContext';
import { CustomerAddressItem, OrderRecord, MenuItem } from '@/types';

export default function CustomerPortalPage() {
  const router = useRouter();
  const { language, data } = useApp();
  const isEn = language === 'en';
  const {
    customer,
    isLoading: isAuthLoading,
    logout,
    addresses,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
    wishlistIds,
    toggleWishlist,
    openAuthModal,
  } = useCustomerAuth();
  const { addItem, openCustomization } = useCart();

  const [activeTab, setActiveTab] = useState<'orders' | 'addresses' | 'wishlist'>('orders');

  // Tab 1: Orders
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [cancellingOrderId, setCancellingOrderId] = useState<string | null>(null);

  // Tab 2: Address Modal
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [addressForm, setAddressForm] = useState({
    label: 'Nhà riêng',
    recipientName: '',
    phone: '',
    addressLine: '',
    wardDistrict: '',
    provinceCity: 'Đắk Nông',
    isDefault: false,
  });

  // Fetch customer orders
  useEffect(() => {
    if (customer) {
      setLoadingOrders(true);
      fetch('/api/customer/orders')
        .then((res) => (res.ok ? res.json() : []))
        .then((data) => {
          const list = Array.isArray(data) ? data : data?.orders || [];
          setOrders(list);
        })
        .catch(() => {})
        .finally(() => setLoadingOrders(false));
    }
  }, [customer]);

  // Cancel order
  const handleCancelOrder = async (orderId: string) => {
    if (!confirm(isEn ? 'Are you sure you want to cancel this order?' : 'Quý khách có chắc chắn muốn hủy đơn hàng này?')) return;
    setCancellingOrderId(orderId);
    try {
      const res = await fetch(`/api/customer/orders?id=${encodeURIComponent(orderId)}&action=cancel`, {
        method: 'POST',
      });
      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, orderStatus: 'CANCELLED' } : o))
        );
      }
    } catch {}
    setCancellingOrderId(null);
  };

  // 1-click Reorder
  const handleReorder = (order: OrderRecord) => {
    order.items.forEach((item) => {
      addItem({
        menuItemId: item.menuItemId || '',
        nameVi: item.itemNameVi,
        nameEn: item.itemNameEn || undefined,
        unitPrice: item.unitPrice,
        basePrice: item.unitPrice,
        quantity: item.quantity,
        selectedOptions: item.selectedOptions || [],
        itemNote: item.itemNote || '',
      });
    });
  };

  // Address CRUD helpers
  const handleOpenNewAddress = () => {
    setEditingAddressId(null);
    setAddressForm({
      label: 'Nhà riêng',
      recipientName: customer?.fullName || '',
      phone: customer?.phone || '',
      addressLine: '',
      wardDistrict: '',
      provinceCity: 'Đắk Nông',
      isDefault: addresses.length === 0,
    });
    setIsAddressModalOpen(true);
  };

  const handleEditAddress = (addr: CustomerAddressItem) => {
    setEditingAddressId(addr.id);
    setAddressForm({
      label: addr.label,
      recipientName: addr.recipientName,
      phone: addr.phone,
      addressLine: addr.addressLine,
      wardDistrict: addr.wardDistrict,
      provinceCity: addr.provinceCity,
      isDefault: addr.isDefault,
    });
    setIsAddressModalOpen(true);
  };

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingAddressId) {
      await updateAddress(editingAddressId, addressForm);
    } else {
      await addAddress(addressForm);
    }
    setIsAddressModalOpen(false);
  };

  // Wishlist menu items from global menu data
  const wishlistedItems = (data?.menu || []).filter((item) => wishlistIds.includes(item.id));

  if (isAuthLoading) {
    return (
      <main className="min-h-screen pt-28 pb-16 bg-paper text-ink-primary flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-accent-botanical" />
      </main>
    );
  }

  // Guest State: prompt login
  if (!customer) {
    return (
      <main className="min-h-screen pt-24 pb-20 bg-paper text-ink-primary">
        <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-6">
          <div className="w-16 h-16 mx-auto rounded-full bg-forest-100 dark:bg-forest-800 flex items-center justify-center text-accent-botanical">
            <User className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-ink-primary">
              {isEn ? 'Customer Sanctuary Portal' : 'Tài Khoản Khách Quý'}
            </h1>
            <p className="text-xs text-ink-muted max-w-sm mx-auto">
              {isEn
                ? 'Sign in to track orders, manage delivery addresses, and save favorite drinks.'
                : 'Đăng nhập để theo dõi trạng thái đơn hàng, quản lý sổ địa chỉ và lưu danh sách thức uống yêu thích.'}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => openAuthModal('login')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-accent-botanical hover:bg-forest-800 text-white font-mono text-xs font-bold shadow-md transition-all"
            >
              {isEn ? 'Sign In / Register' : 'Đăng Nhập / Đăng Ký'}
            </button>
            <Link
              href="/tra-cuu-don"
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-forest-100 dark:bg-forest-800 text-accent-botanical font-mono text-xs font-bold hover:bg-forest-200 transition-colors"
            >
              {isEn ? 'Lookup Guest Order' : 'Tra cứu đơn khách vãng lai'}
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-24 pb-20 bg-paper text-ink-primary">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Profile Card */}
        <div className="p-6 rounded-3xl bg-white dark:bg-forest-900 border border-forest-100 dark:border-forest-800 shadow-subtle mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-accent-botanical/10 dark:bg-accent-botanical/20 flex items-center justify-center text-accent-botanical font-serif font-bold text-xl">
              {customer.fullName ? customer.fullName.charAt(0).toUpperCase() : 'C'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-xl sm:text-2xl font-bold text-ink-primary">
                  {customer.fullName}
                </h1>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                  {isEn ? 'Sanctuary Member' : 'Khách quý thân thiết'}
                </span>
              </div>
              <p className="text-xs font-mono text-ink-muted mt-0.5">
                {customer.email} {customer.phone ? `• ${customer.phone}` : ''}
              </p>
            </div>
          </div>

          <button
            onClick={() => logout()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-forest-200 dark:border-forest-700 text-xs font-mono text-ink-muted hover:text-red-500 hover:border-red-200 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>{isEn ? 'Sign Out' : 'Đăng xuất'}</span>
          </button>
        </div>

        {/* 3 Tabs Header */}
        <div className="flex border-b border-forest-200 dark:border-forest-800 mb-8 space-x-6">
          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-3 font-serif text-sm sm:text-base font-bold transition-all relative ${
              activeTab === 'orders'
                ? 'text-accent-botanical'
                : 'text-ink-muted hover:text-ink-primary'
            }`}
          >
            <span className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4" />
              <span>{isEn ? 'My Orders' : 'Đơn Hàng Của Tôi'}</span>
              {orders.length > 0 && (
                <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-forest-100 dark:bg-forest-800">
                  {orders.length}
                </span>
              )}
            </span>
            {activeTab === 'orders' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent-botanical rounded-full" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('addresses')}
            className={`pb-3 font-serif text-sm sm:text-base font-bold transition-all relative ${
              activeTab === 'addresses'
                ? 'text-accent-botanical'
                : 'text-ink-muted hover:text-ink-primary'
            }`}
          >
            <span className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>{isEn ? 'Address Book' : 'Sổ Địa Chỉ'}</span>
              {addresses.length > 0 && (
                <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-forest-100 dark:bg-forest-800">
                  {addresses.length}
                </span>
              )}
            </span>
            {activeTab === 'addresses' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent-botanical rounded-full" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('wishlist')}
            className={`pb-3 font-serif text-sm sm:text-base font-bold transition-all relative ${
              activeTab === 'wishlist'
                ? 'text-accent-botanical'
                : 'text-ink-muted hover:text-ink-primary'
            }`}
          >
            <span className="flex items-center gap-2">
              <Heart className="w-4 h-4" />
              <span>{isEn ? 'Favorites' : 'Món Yêu Thích'}</span>
              {wishlistIds.length > 0 && (
                <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-forest-100 dark:bg-forest-800">
                  {wishlistIds.length}
                </span>
              )}
            </span>
            {activeTab === 'wishlist' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent-botanical rounded-full" />
            )}
          </button>
        </div>

        {/* Tab 1: Orders */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {loadingOrders ? (
              <div className="py-12 text-center">
                <Loader2 className="w-6 h-6 animate-spin text-accent-botanical mx-auto" />
              </div>
            ) : orders.length === 0 ? (
              <div className="py-16 text-center space-y-4 rounded-3xl bg-white dark:bg-forest-900 border border-forest-100 dark:border-forest-800">
                <ShoppingBag className="w-12 h-12 text-forest-300 mx-auto" />
                <p className="font-serif text-base font-bold text-ink-primary">
                  {isEn ? 'No orders placed yet' : 'Quý khách chưa có đơn hàng nào'}
                </p>
                <Link
                  href="/thuc-don"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-accent-botanical text-white font-mono text-xs font-bold"
                >
                  <span>{isEn ? 'Explore Menu' : 'Khám Phá Thực Đơn'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ) : (
              orders.map((order) => (
                <div
                  key={order.id}
                  className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-forest-900 border border-forest-100 dark:border-forest-800 shadow-subtle space-y-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-forest-100 dark:border-forest-800">
                    <div>
                      <span className="font-mono text-sm font-bold text-accent-botanical">
                        #{order.orderCode}
                      </span>
                      <span className="text-xs font-mono text-ink-muted ml-3">
                        {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full ${
                          order.orderStatus === 'COMPLETED'
                            ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                            : order.orderStatus === 'CANCELLED'
                            ? 'bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300'
                            : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                        }`}
                      >
                        {order.orderStatus}
                      </span>
                      <span
                        className={`text-[11px] font-mono px-2 py-0.5 rounded-full ${
                          order.paymentStatus === 'PAID'
                            ? 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        {order.paymentStatus}
                      </span>
                    </div>
                  </div>

                  {/* Items Summary */}
                  <div className="space-y-1.5 text-xs font-mono">
                    {order.items.map((i) => (
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

                  {/* Actions & Total */}
                  <div className="pt-3 border-t border-forest-100 dark:border-forest-800 flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <span className="text-xs font-mono text-ink-muted">
                        {isEn ? 'Total: ' : 'Tổng tiền: '}
                      </span>
                      <span className="font-mono text-sm sm:text-base font-bold text-accent-botanical">
                        {order.totalAmount.toLocaleString('vi-VN')}đ
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {order.orderStatus === 'PENDING' && (
                        <button
                          type="button"
                          disabled={cancellingOrderId === order.id}
                          onClick={() => handleCancelOrder(order.id)}
                          className="px-3 py-1.5 rounded-xl border border-red-200 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 text-xs font-mono transition-colors"
                        >
                          {cancellingOrderId === order.id ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <span>{isEn ? 'Cancel Order' : 'Hủy đơn'}</span>
                          )}
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => handleReorder(order)}
                        className="px-3 py-1.5 rounded-xl bg-forest-100 dark:bg-forest-800 hover:bg-forest-200 text-ink-primary text-xs font-mono font-medium flex items-center gap-1.5 transition-colors"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>{isEn ? '1-Click Reorder' : 'Đặt lại món này'}</span>
                      </button>

                      <Link
                        href={`/don-hang/${order.orderCode}`}
                        className="px-4 py-1.5 rounded-xl bg-accent-botanical hover:bg-forest-800 text-white text-xs font-mono font-bold flex items-center gap-1.5 transition-colors"
                      >
                        <span>{isEn ? 'Receipt / Track' : 'Xem biên nhận'}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 2: Addresses */}
        {activeTab === 'addresses' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-base font-bold text-ink-primary">
                {isEn ? 'Saved Delivery Addresses' : 'Danh Sách Địa Chỉ Nhận Hàng'}
              </h2>
              <button
                type="button"
                onClick={handleOpenNewAddress}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-accent-botanical hover:bg-forest-800 text-white font-mono text-xs font-bold shadow-sm transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{isEn ? 'Add Address' : 'Thêm địa chỉ mới'}</span>
              </button>
            </div>

            {addresses.length === 0 ? (
              <div className="py-16 text-center space-y-4 rounded-3xl bg-white dark:bg-forest-900 border border-forest-100 dark:border-forest-800">
                <MapPin className="w-12 h-12 text-forest-300 mx-auto" />
                <p className="font-serif text-base font-bold text-ink-primary">
                  {isEn ? 'No saved addresses yet' : 'Chưa có địa chỉ nào được lưu'}
                </p>
                <button
                  onClick={handleOpenNewAddress}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-accent-botanical text-white font-mono text-xs font-bold"
                >
                  <Plus className="w-4 h-4" />
                  <span>{isEn ? 'Add Address' : 'Thêm địa chỉ'}</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {addresses.map((addr) => (
                  <div
                    key={addr.id}
                    className="p-5 rounded-3xl bg-white dark:bg-forest-900 border border-forest-100 dark:border-forest-800 shadow-subtle space-y-3 relative"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-serif font-bold text-sm text-ink-primary">
                          {addr.label}
                        </span>
                        {addr.isDefault && (
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-accent-botanical text-white">
                            {isEn ? 'Default' : 'Mặc định'}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleEditAddress(addr)}
                          className="p-1.5 text-ink-muted hover:text-accent-botanical rounded-lg hover:bg-forest-50 dark:hover:bg-forest-800"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteAddress(addr.id)}
                          className="p-1.5 text-ink-muted hover:text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="text-xs font-mono space-y-1 text-ink-muted">
                      <p className="text-ink-primary font-bold">
                        {addr.recipientName} • {addr.phone}
                      </p>
                      <p>{addr.addressLine}</p>
                      <p>
                        {addr.wardDistrict}, {addr.provinceCity}
                      </p>
                    </div>

                    {!addr.isDefault && (
                      <button
                        onClick={() => setDefaultAddress(addr.id)}
                        className="text-[11px] font-mono text-accent-botanical hover:underline pt-1 block"
                      >
                        {isEn ? 'Set as default address' : 'Đặt làm địa chỉ mặc định'}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Wishlist */}
        {activeTab === 'wishlist' && (
          <div className="space-y-4">
            <h2 className="font-serif text-base font-bold text-ink-primary">
              {isEn ? 'Your Favorite Botanical Drinks' : 'Món Yêu Thích Đã Lưu'}
            </h2>

            {wishlistedItems.length === 0 ? (
              <div className="py-16 text-center space-y-4 rounded-3xl bg-white dark:bg-forest-900 border border-forest-100 dark:border-forest-800">
                <Heart className="w-12 h-12 text-forest-300 mx-auto" />
                <p className="font-serif text-base font-bold text-ink-primary">
                  {isEn ? 'No favorite items saved yet' : 'Chưa có món nào trong danh sách yêu thích'}
                </p>
                <Link
                  href="/thuc-don"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-accent-botanical text-white font-mono text-xs font-bold"
                >
                  <span>{isEn ? 'Explore Menu' : 'Xem Thực Đơn'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {wishlistedItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-5 rounded-3xl bg-white dark:bg-forest-900 border border-forest-100 dark:border-forest-800 shadow-subtle flex flex-col justify-between h-full space-y-3"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-serif font-bold text-sm text-ink-primary">
                          {isEn && item.nameEn ? item.nameEn : item.vietnameseTitle}
                        </h3>
                        <button
                          type="button"
                          onClick={() => toggleWishlist(item.id)}
                          className="p-1 text-red-500"
                        >
                          <Heart className="w-4 h-4 fill-red-500" />
                        </button>
                      </div>
                      <p className="font-mono text-xs font-bold text-accent-botanical mt-1">
                        {item.priceDisplay || `${item.price.toLocaleString('vi-VN')}đ`}
                      </p>
                      <p className="text-[11px] text-ink-muted line-clamp-2 mt-2 leading-relaxed">
                        {isEn && item.descriptionEn ? item.descriptionEn : item.description}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => openCustomization(item)}
                      className="w-full py-2 px-3 rounded-xl bg-accent-botanical hover:bg-forest-800 text-white font-mono text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{isEn ? 'Add to Cart' : 'Thêm vào giỏ'}</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Address Edit / Add Modal */}
      {isAddressModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-paper dark:bg-forest-950 rounded-3xl border border-forest-200 dark:border-forest-800 p-6 shadow-2xl space-y-4">
            <h3 className="font-serif text-lg font-bold text-ink-primary">
              {editingAddressId ? (isEn ? 'Edit Address' : 'Chỉnh Sửa Địa Chỉ') : (isEn ? 'Add New Address' : 'Thêm Địa Chỉ Mới')}
            </h3>

            <form onSubmit={handleSaveAddress} className="space-y-3 text-xs font-mono">
              <div>
                <label className="block text-ink-muted mb-1">{isEn ? 'Label' : 'Nhãn'}</label>
                <input
                  type="text"
                  required
                  value={addressForm.label}
                  onChange={(e) => setAddressForm({ ...addressForm, label: e.target.value })}
                  placeholder="Nhà riêng, Cơ quan..."
                  className="w-full p-2.5 rounded-xl bg-white dark:bg-forest-900 border border-forest-200 dark:border-forest-700 text-ink-primary"
                />
              </div>

              <div>
                <label className="block text-ink-muted mb-1">{isEn ? 'Recipient Name' : 'Họ tên'}</label>
                <input
                  type="text"
                  required
                  value={addressForm.recipientName}
                  onChange={(e) => setAddressForm({ ...addressForm, recipientName: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-white dark:bg-forest-900 border border-forest-200 dark:border-forest-700 text-ink-primary"
                />
              </div>

              <div>
                <label className="block text-ink-muted mb-1">{isEn ? 'Phone' : 'Số điện thoại'}</label>
                <input
                  type="tel"
                  required
                  value={addressForm.phone}
                  onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-white dark:bg-forest-900 border border-forest-200 dark:border-forest-700 text-ink-primary"
                />
              </div>

              <div>
                <label className="block text-ink-muted mb-1">{isEn ? 'Street Address' : 'Địa chỉ cụ thể'}</label>
                <input
                  type="text"
                  required
                  value={addressForm.addressLine}
                  onChange={(e) => setAddressForm({ ...addressForm, addressLine: e.target.value })}
                  placeholder="Số 437 Hùng Vương"
                  className="w-full p-2.5 rounded-xl bg-white dark:bg-forest-900 border border-forest-200 dark:border-forest-700 text-ink-primary"
                />
              </div>

              <div>
                <label className="block text-ink-muted mb-1">{isEn ? 'Ward / District' : 'Phường / Xã, Thành phố'}</label>
                <input
                  type="text"
                  required
                  value={addressForm.wardDistrict}
                  onChange={(e) => setAddressForm({ ...addressForm, wardDistrict: e.target.value })}
                  placeholder="Phường Nghĩa Trung, Đông Gia Nghĩa"
                  className="w-full p-2.5 rounded-xl bg-white dark:bg-forest-900 border border-forest-200 dark:border-forest-700 text-ink-primary"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="isDefault"
                  checked={addressForm.isDefault}
                  onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })}
                  className="text-accent-botanical rounded"
                />
                <label htmlFor="isDefault" className="text-ink-muted cursor-pointer">
                  {isEn ? 'Set as default address' : 'Đặt làm địa chỉ mặc định'}
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddressModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-ink-muted hover:text-ink-primary"
                >
                  {isEn ? 'Cancel' : 'Hủy'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-accent-botanical hover:bg-forest-800 text-white font-bold"
                >
                  {isEn ? 'Save' : 'Lưu'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}

