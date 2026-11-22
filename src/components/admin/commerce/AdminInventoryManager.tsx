'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  PackageCheck,
  Search,
  Filter,
  Check,
  X,
  AlertTriangle,
  Layers,
  Plus,
  Trash2,
  Edit2,
  Save,
  RotateCcw,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  ChevronDown,
  Loader2,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { MenuItem, CategoryId, ProductOptionGroup, ProductOption } from '@/types';
import { broadcastCmsSync } from '@/lib/cms-sync';

const CATEGORY_TABS: { id: CategoryId | 'all'; label: string }[] = [
  { id: 'all', label: 'Tất cả 67 món' },
  { id: 'coffee', label: 'Cà phê' },
  { id: 'tea', label: 'Trà thảo mộc' },
  { id: 'smoothie', label: 'Sinh tố' },
  { id: 'juice', label: 'Nước ép' },
  { id: 'soda-yogurt', label: 'Soda & Yaourt' },
  { id: 'other', label: 'Thức uống khác' },
  { id: 'food', label: 'Món ăn & BBQ' },
];

export default function AdminInventoryManager() {
  const { data, refreshData } = useApp();
  const [activeTab, setActiveTab] = useState<'inventory' | 'option-groups'>('inventory');

  // Menu items state
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [updatingItemId, setUpdatingItemId] = useState<string | null>(null);

  // Option Groups state
  const [optionGroups, setOptionGroups] = useState<ProductOptionGroup[]>([]);
  const [loadingOptionGroups, setLoadingOptionGroups] = useState(false);
  const [editingGroup, setEditingGroup] = useState<ProductOptionGroup | null>(null);
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [savingGroup, setSavingGroup] = useState(false);

  // Assign option group modal state
  const [assigningItem, setAssigningItem] = useState<MenuItem | null>(null);
  const [selectedGroupIds, setSelectedGroupIds] = useState<string[]>([]);
  const [isSavingAssign, setIsSavingAssign] = useState(false);

  // Toast
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  };

  // Synchronize menu items from AppContext / API
  useEffect(() => {
    if (data && data.menu) {
      setMenuItems(data.menu);
    }
  }, [data]);

  // Fetch Option Groups
  const fetchOptionGroups = useCallback(async () => {
    setLoadingOptionGroups(true);
    try {
      const res = await fetch('/api/admin/commerce/option-groups', {
        credentials: 'include',
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok && json.success && Array.isArray(json.data)) {
        setOptionGroups(json.data);
      } else if (res.ok && Array.isArray(json.optionGroups)) {
        setOptionGroups(json.optionGroups);
      } else {
        // Fallback default templates
        setOptionGroups(DEFAULT_OPTION_GROUPS);
      }
    } catch {
      setOptionGroups(DEFAULT_OPTION_GROUPS);
    } finally {
      setLoadingOptionGroups(false);
    }
  }, []);

  useEffect(() => {
    fetchOptionGroups();
  }, [fetchOptionGroups]);

  // Patch menu item stock / ordering settings
  const updateMenuItemField = async (
    item: MenuItem,
    patch: Partial<{
      inStock: boolean;
      allowOrdering: boolean;
      trackInventory: boolean;
      stockQuantity: number;
      optionGroups: any;
    }>
  ) => {
    setUpdatingItemId(item.id);
    try {
      const res = await fetch(`/api/admin/commerce/inventory`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          id: item.id,
          ...patch,
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok && (json.success || !json.error)) {
        showToast('success', `Đã cập nhật kho món: ${item.vietnameseTitle}`);
        setMenuItems((prev) =>
          prev.map((m) => (m.id === item.id ? { ...m, ...patch } : m))
        );
        refreshData();
        broadcastCmsSync('menu');
      } else {
        // Optimistic UI rollback if error
        showToast('error', json.error || 'Cập nhật kho hàng thất bại');
      }
    } catch {
      showToast('error', 'Lỗi kết nối khi cập nhật kho hàng');
    } finally {
      setUpdatingItemId(null);
    }
  };

  // Filtered menu items
  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      if (selectedCategory !== 'all' && item.categoryId !== selectedCategory) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchVi = item.vietnameseTitle?.toLowerCase().includes(q);
        const matchEn = item.nameEn?.toLowerCase().includes(q) || item.name?.toLowerCase().includes(q);
        if (!matchVi && !matchEn) return false;
      }
      return true;
    });
  }, [menuItems, selectedCategory, searchQuery]);

  // Open Assign Option Groups modal for a specific menu item
  const openAssignModal = (item: MenuItem) => {
    setAssigningItem(item);
    const existingGroupIds: string[] = Array.isArray(item.optionGroups)
      ? item.optionGroups.map((g: any) => g.id || g)
      : [];
    setSelectedGroupIds(existingGroupIds);
  };

  // Save Assigned Option Groups
  const handleSaveAssignedGroups = async () => {
    if (!assigningItem) return;
    setIsSavingAssign(true);
    try {
      const selectedFullGroups = optionGroups.filter((g) => selectedGroupIds.includes(g.id));
      await updateMenuItemField(assigningItem, {
        optionGroups: selectedFullGroups,
      });
      setAssigningItem(null);
    } finally {
      setIsSavingAssign(false);
    }
  };

  // Option Groups CRUD Handlers
  const openNewGroupModal = () => {
    setEditingGroup({
      id: '',
      nameVi: '',
      nameEn: '',
      type: 'SINGLE',
      required: false,
      options: [
        { labelVi: '', labelEn: '', priceDelta: 0 },
      ],
      isActive: true,
    });
    setIsGroupModalOpen(true);
  };

  const openEditGroupModal = (group: ProductOptionGroup) => {
    setEditingGroup(JSON.parse(JSON.stringify(group)));
    setIsGroupModalOpen(true);
  };

  const handleSaveGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGroup || !editingGroup.nameVi.trim()) {
      showToast('error', 'Vui lòng nhập tên nhóm tùy chọn');
      return;
    }
    const cleanOptions = editingGroup.options.filter((o) => o.labelVi.trim());
    if (cleanOptions.length === 0) {
      showToast('error', 'Vui lòng thêm ít nhất 1 lựa chọn con');
      return;
    }

    setSavingGroup(true);
    try {
      const isCreate = !editingGroup.id;
      const method = isCreate ? 'POST' : 'PUT';
      const res = await fetch('/api/admin/commerce/option-groups', {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          ...editingGroup,
          options: cleanOptions,
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok && (json.success || !json.error)) {
        showToast('success', isCreate ? 'Tạo nhóm tùy chọn mới thành công' : 'Đã cập nhật nhóm tùy chọn');
        setIsGroupModalOpen(false);
        fetchOptionGroups();
      } else {
        showToast('error', json.error || 'Lỗi lưu nhóm tùy chọn');
      }
    } catch {
      showToast('error', 'Lỗi kết nối khi lưu nhóm tùy chọn');
    } finally {
      setSavingGroup(false);
    }
  };

  const handleDeleteGroup = async (groupId: string) => {
    if (!window.confirm('Bạn có chắc muốn xóa nhóm tùy chọn này không?')) return;
    try {
      const res = await fetch(`/api/admin/commerce/option-groups?id=${groupId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok && (json.success || !json.error)) {
        showToast('success', 'Đã xóa nhóm tùy chọn');
        setOptionGroups((prev) => prev.filter((g) => g.id !== groupId));
      } else {
        showToast('error', json.error || 'Lỗi xóa nhóm');
      }
    } catch {
      showToast('error', 'Lỗi kết nối xóa nhóm');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400">
            <PackageCheck className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">Kho hàng & Biến thể món</h1>
            <p className="text-xs text-slate-400">
              Quản lý bật/tắt đặt món, tồn kho 67 món và cấu hình nhóm tùy chọn (Size, Đường, Đá, Topping)
            </p>
          </div>
        </div>

        {/* Top Tab Switcher */}
        <div className="flex items-center gap-1.5 bg-slate-800/80 p-1 rounded-xl border border-slate-700/80">
          <button
            type="button"
            onClick={() => setActiveTab('inventory')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'inventory'
                ? 'bg-emerald-600 text-white shadow'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Quản lý tồn kho ({menuItems.length} món)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('option-groups')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'option-groups'
                ? 'bg-emerald-600 text-white shadow'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Mẫu Nhóm tùy chọn ({optionGroups.length})
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* TAB 1: MENU ITEM INVENTORY TABLE (67 ITEMS) */}
      {/* ========================================================= */}
      {activeTab === 'inventory' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl space-y-3">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              {/* Search box */}
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm món trong 67 món Cẩm Cù..."
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

              {/* Low stock counter alert */}
              <div className="flex items-center gap-2 text-xs">
                <span className="text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20 flex items-center gap-1.5 font-medium">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>
                    Sắp hết hàng:{' '}
                    <strong>
                      {menuItems.filter((m) => m.trackInventory && (m.stockQuantity ?? 0) <= 5).length}
                    </strong>
                  </span>
                </span>
              </div>
            </div>

            {/* Category tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pt-1 pb-0.5 text-xs">
              {CATEGORY_TABS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSelectedCategory(tab.id)}
                  className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                    selectedCategory === tab.id
                      ? 'bg-emerald-600 text-white font-semibold'
                      : 'bg-slate-800 text-slate-300 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-800/60 text-slate-400 font-semibold uppercase tracking-wider">
                    <th className="py-3 px-4">Tên Món & Danh Mục</th>
                    <th className="py-3 px-3 text-center">Còn món (In Stock)</th>
                    <th className="py-3 px-3 text-center">Bật bán Online</th>
                    <th className="py-3 px-3 text-center">Quản lý kho</th>
                    <th className="py-3 px-4 text-center">Số lượng tồn</th>
                    <th className="py-3 px-4">Tùy chọn gắn kèm (Options)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {filteredItems.map((item) => {
                    const isLowStock =
                      Boolean(item.trackInventory) &&
                      item.stockQuantity !== undefined &&
                      item.stockQuantity <= 5;
                    const isOutOfStock =
                      Boolean(item.trackInventory) &&
                      item.stockQuantity !== undefined &&
                      item.stockQuantity <= 0;
                    const isUpdating = updatingItemId === item.id;
                    const assignedGroups: ProductOptionGroup[] = Array.isArray(item.optionGroups)
                      ? item.optionGroups
                      : [];

                    return (
                      <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                        {/* Name & Cat */}
                        <td className="py-3 px-4">
                          <div className="font-semibold text-white text-sm">
                            {item.vietnameseTitle}
                          </div>
                          <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-2">
                            <span className="font-mono text-emerald-400 font-medium">
                              {item.price.toLocaleString('vi-VN')}đ
                            </span>
                            <span className="text-slate-600">•</span>
                            <span className="text-slate-400 uppercase text-[10px] tracking-wider">
                              {item.categoryId}
                            </span>
                          </div>
                        </td>

                        {/* 1-click inStock toggle */}
                        <td className="py-3 px-3 text-center">
                          <button
                            type="button"
                            onClick={() => updateMenuItemField(item, { inStock: !item.inStock })}
                            disabled={isUpdating}
                            title={item.inStock ? 'Món đang còn (bấm để báo hết)' : 'Món đã hết (bấm để mở lại)'}
                            className={`p-1.5 rounded-xl border transition-all ${
                              item.inStock
                                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30'
                                : 'bg-slate-800 text-slate-500 border-slate-700 hover:text-slate-300'
                            }`}
                          >
                            {item.inStock ? (
                              <Check className="w-4 h-4 text-emerald-400" />
                            ) : (
                              <X className="w-4 h-4 text-slate-500" />
                            )}
                          </button>
                        </td>

                        {/* 1-click allowOrdering toggle */}
                        <td className="py-3 px-3 text-center">
                          <button
                            type="button"
                            onClick={() =>
                              updateMenuItemField(item, {
                                allowOrdering: item.allowOrdering === false ? true : false,
                              })
                            }
                            disabled={isUpdating}
                            title={
                              item.allowOrdering !== false
                                ? 'Đang mở nhận đơn đặt (bấm để tạm ngưng)'
                                : 'Tạm ngưng nhận đơn đặt (bấm để mở lại)'
                            }
                            className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-all ${
                              item.allowOrdering !== false
                                ? 'bg-sky-500/20 text-sky-300 border-sky-500/30 hover:bg-sky-500/30'
                                : 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30'
                            }`}
                          >
                            {item.allowOrdering !== false ? 'Mở đặt' : 'Tắt đặt'}
                          </button>
                        </td>

                        {/* 1-click trackInventory toggle */}
                        <td className="py-3 px-3 text-center">
                          <button
                            type="button"
                            onClick={() =>
                              updateMenuItemField(item, {
                                trackInventory: !item.trackInventory,
                                stockQuantity: item.trackInventory ? undefined : (item.stockQuantity ?? 20),
                              })
                            }
                            disabled={isUpdating}
                            className={`px-2 py-0.5 rounded-lg text-[10px] font-mono border transition-all ${
                              item.trackInventory
                                ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                                : 'bg-slate-800 text-slate-400 border-slate-700'
                            }`}
                          >
                            {item.trackInventory ? 'Đang đếm kho' : 'Không giới hạn'}
                          </button>
                        </td>

                        {/* stockQuantity editor with low-stock warning */}
                        <td className="py-3 px-4 text-center">
                          {item.trackInventory ? (
                            <div className="inline-flex items-center gap-1.5">
                              <input
                                type="number"
                                min={0}
                                defaultValue={item.stockQuantity ?? 0}
                                onBlur={(e) => {
                                  const val = parseInt(e.target.value, 10);
                                  if (!isNaN(val) && val !== item.stockQuantity) {
                                    updateMenuItemField(item, { stockQuantity: Math.max(0, val) });
                                  }
                                }}
                                className="w-16 px-2 py-1 bg-slate-800 border border-slate-700 rounded-lg text-center font-mono font-bold text-white text-xs focus:border-emerald-500 focus:outline-none"
                              />
                              {isOutOfStock ? (
                                <span className="px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-bold">
                                  Hết
                                </span>
                              ) : isLowStock ? (
                                <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold animate-pulse">
                                  ≤5
                                </span>
                              ) : null}
                            </div>
                          ) : (
                            <span className="text-slate-500 font-mono text-[11px]">∞</span >
                          )}
                        </td>

                        {/* Assigned Option Groups */}
                        <td className="py-3 px-4">
                          <div className="flex flex-wrap items-center gap-1.5">
                            {assignedGroups.map((g, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700 text-slate-300 text-[10px] font-medium"
                              >
                                {g.nameVi || (g as any).name}
                              </span>
                            ))}
                            <button
                              type="button"
                              onClick={() => openAssignModal(item)}
                              className="px-2 py-0.5 rounded-md bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-semibold transition-colors"
                            >
                              + Gán tùy chọn
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: REUSABLE PRODUCT OPTION GROUPS TEMPLATES CRUD */}
      {/* ========================================================= */}
      {activeTab === 'option-groups' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-slate-900/90 border border-slate-800 p-4 rounded-2xl">
            <div>
              <h2 className="text-sm font-bold text-white">Danh sách Mẫu Nhóm Tùy Chọn</h2>
              <p className="text-xs text-slate-400">
                Tạo sẵn các nhóm tùy chọn (Size Ly, Độ ngọt, Đá riêng, Topping) để gán linh hoạt cho 67 món
              </p>
            </div>
            <button
              type="button"
              onClick={openNewGroupModal}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Tạo Nhóm Tùy Chọn Mới</span>
            </button>
          </div>

          {/* Grid of Option Groups */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {optionGroups.map((group) => (
              <div
                key={group.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between space-y-3 hover:border-slate-700 transition-colors"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-bold text-white text-sm">{group.nameVi}</h3>
                      {group.nameEn && (
                        <span className="text-[11px] text-slate-400">({group.nameEn})</span>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                          group.type === 'SINGLE'
                            ? 'bg-sky-500/15 text-sky-300 border-sky-500/30'
                            : 'bg-purple-500/15 text-purple-300 border-purple-500/30'
                        }`}
                      >
                        {group.type === 'SINGLE' ? 'Chọn 1 (Radio)' : 'Chọn nhiều (Check)'}
                      </span>
                      {group.required && (
                        <span className="text-[10px] bg-rose-500/15 text-rose-300 border border-rose-500/30 px-1.5 py-0.5 rounded">
                          Bắt buộc
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Options List */}
                  <div className="mt-3 space-y-1.5 border-t border-slate-800 pt-2.5">
                    {group.options.map((opt, oIdx) => (
                      <div
                        key={oIdx}
                        className="flex items-center justify-between text-xs py-1 px-2 rounded-lg bg-slate-800/50"
                      >
                        <span className="text-slate-300">{opt.labelVi}</span>
                        <span className="font-mono text-emerald-400 font-semibold">
                          {opt.priceDelta > 0
                            ? `+${opt.priceDelta.toLocaleString('vi-VN')}đ`
                            : '+0đ'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card footer actions */}
                <div className="flex items-center justify-between border-t border-slate-800 pt-3">
                  <span
                    className={`text-[11px] font-medium ${
                      group.isActive ? 'text-emerald-400' : 'text-slate-500'
                    }`}
                  >
                    {group.isActive ? 'Đang hoạt động' : 'Tạm tắt'}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => openEditGroupModal(group)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                      title="Chỉnh sửa"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteGroup(group.id)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-500/20 text-slate-300 hover:text-rose-400 transition-colors"
                      title="Xóa nhóm"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: ASSIGN OPTION GROUPS TO MENU ITEM */}
      {/* ========================================================= */}
      {assigningItem && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={() => setAssigningItem(null)}
        >
          <div
            className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 text-white shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-base text-white">Gán Nhóm Tùy Chọn Cho Món</h3>
                <p className="text-xs text-emerald-400 mt-0.5 font-medium">
                  {assigningItem.vietnameseTitle} ({assigningItem.price.toLocaleString('vi-VN')}đ)
                </p>
              </div>
              <button
                onClick={() => setAssigningItem(null)}
                className="p-1 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {optionGroups.length === 0 ? (
                <div className="text-center py-6 text-slate-400 text-xs">
                  Chưa có nhóm tùy chọn nào. Hãy tạo nhóm ở Tab 2 trước!
                </div>
              ) : (
                optionGroups.map((g) => {
                  const isChecked = selectedGroupIds.includes(g.id);
                  return (
                    <label
                      key={g.id}
                      className={`flex items-start justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                        isChecked
                          ? 'bg-emerald-500/10 border-emerald-500/40 text-white'
                          : 'bg-slate-800/40 border-slate-800 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedGroupIds((prev) => [...prev, g.id]);
                            } else {
                              setSelectedGroupIds((prev) => prev.filter((id) => id !== g.id));
                            }
                          }}
                          className="mt-0.5 rounded border-slate-700 text-emerald-600 focus:ring-0"
                        />
                        <div>
                          <div className="text-xs font-bold">{g.nameVi}</div>
                          <div className="text-[11px] text-slate-400">
                            {g.options.map((o) => o.labelVi).join(', ')}
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] uppercase font-mono text-slate-400">
                        {g.type}
                      </span>
                    </label>
                  );
                })
              )}
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setAssigningItem(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleSaveAssignedGroups}
                disabled={isSavingAssign}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow"
              >
                {isSavingAssign && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>Lưu gán tùy chọn</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: CREATE / EDIT PRODUCT OPTION GROUP */}
      {/* ========================================================= */}
      {isGroupModalOpen && editingGroup && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={() => setIsGroupModalOpen(false)}
        >
          <div
            className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 text-white shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-base text-white">
                {editingGroup.id ? 'Chỉnh sửa Nhóm Tùy Chọn' : 'Tạo Nhóm Tùy Chọn Mới'}
              </h3>
              <button
                onClick={() => setIsGroupModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveGroup} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Tên nhóm (Tiếng Việt) *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingGroup.nameVi}
                    onChange={(e) =>
                      setEditingGroup({ ...editingGroup, nameVi: e.target.value })
                    }
                    placeholder="VD: Chọn Size Ly, Lượng đường..."
                    className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Tên nhóm (Tiếng Anh)
                  </label>
                  <input
                    type="text"
                    value={editingGroup.nameEn || ''}
                    onChange={(e) =>
                      setEditingGroup({ ...editingGroup, nameEn: e.target.value })
                    }
                    placeholder="VD: Cup Size, Sweetness..."
                    className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Kiểu lựa chọn
                  </label>
                  <select
                    value={editingGroup.type}
                    onChange={(e) =>
                      setEditingGroup({ ...editingGroup, type: e.target.value as any })
                    }
                    className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="SINGLE">Chọn 1 duy nhất (Radio - Size, Đường, Đá)</option>
                    <option value="MULTIPLE">Chọn nhiều món (Checkbox - Topping)</option>
                  </select>
                </div>
                <div className="flex items-center gap-4 pt-6">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-300">
                    <input
                      type="checkbox"
                      checked={editingGroup.required}
                      onChange={(e) =>
                        setEditingGroup({ ...editingGroup, required: e.target.checked })
                      }
                      className="rounded border-slate-700 text-emerald-600 focus:ring-0"
                    />
                    <span>Bắt buộc chọn khi đặt</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-300">
                    <input
                      type="checkbox"
                      checked={editingGroup.isActive}
                      onChange={(e) =>
                        setEditingGroup({ ...editingGroup, isActive: e.target.checked })
                      }
                      className="rounded border-slate-700 text-emerald-600 focus:ring-0"
                    />
                    <span>Hoạt động</span>
                  </label>
                </div>
              </div>

              {/* Sub-options list */}
              <div className="border border-slate-800 rounded-xl p-3 space-y-2 bg-slate-800/30">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
                  <span>Danh sách tùy chọn con ({editingGroup.options.length})</span>
                  <button
                    type="button"
                    onClick={() =>
                      setEditingGroup({
                        ...editingGroup,
                        options: [
                          ...editingGroup.options,
                          { labelVi: '', labelEn: '', priceDelta: 0 },
                        ],
                      })
                    }
                    className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Thêm lựa chọn</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {editingGroup.options.map((opt, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs">
                      <input
                        type="text"
                        placeholder="Tên lựa chọn (VI)"
                        value={opt.labelVi}
                        onChange={(e) => {
                          const nextOpts = [...editingGroup.options];
                          nextOpts[idx].labelVi = e.target.value;
                          setEditingGroup({ ...editingGroup, options: nextOpts });
                        }}
                        className="flex-1 p-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-xs focus:border-emerald-500 focus:outline-none"
                      />
                      <input
                        type="number"
                        placeholder="+Giá (VNĐ)"
                        value={opt.priceDelta}
                        onChange={(e) => {
                          const nextOpts = [...editingGroup.options];
                          nextOpts[idx].priceDelta = parseInt(e.target.value, 10) || 0;
                          setEditingGroup({ ...editingGroup, options: nextOpts });
                        }}
                        className="w-24 p-2 bg-slate-800 border border-slate-700 rounded-lg text-white font-mono text-xs focus:border-emerald-500 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (editingGroup.options.length <= 1) return;
                          const nextOpts = editingGroup.options.filter((_, i) => i !== idx);
                          setEditingGroup({ ...editingGroup, options: nextOpts });
                        }}
                        className="p-2 text-slate-500 hover:text-rose-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsGroupModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
                >
                  Đóng
                </button>
                <button
                  type="submit"
                  disabled={savingGroup}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow"
                >
                  {savingGroup && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{editingGroup.id ? 'Lưu thay đổi' : 'Tạo nhóm tùy chọn'}</span>
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

// Default option group templates
const DEFAULT_OPTION_GROUPS: ProductOptionGroup[] = [
  {
    id: 'grp-size',
    nameVi: 'Chọn Size Ly',
    nameEn: 'Cup Size',
    type: 'SINGLE',
    required: true,
    isActive: true,
    options: [
      { labelVi: 'Size Vừa (M)', labelEn: 'Medium (M)', priceDelta: 0 },
      { labelVi: 'Size Lớn (L)', labelEn: 'Large (L)', priceDelta: 8000 },
    ],
  },
  {
    id: 'grp-sugar',
    nameVi: 'Lượng Đường',
    nameEn: 'Sweetness',
    type: 'SINGLE',
    required: false,
    isActive: true,
    options: [
      { labelVi: '100% Đường tiêu chuẩn', priceDelta: 0 },
      { labelVi: '70% Đường', priceDelta: 0 },
      { labelVi: '50% Đường ít', priceDelta: 0 },
      { labelVi: 'Không đường', priceDelta: 0 },
    ],
  },
  {
    id: 'grp-ice',
    nameVi: 'Lượng Đá',
    nameEn: 'Ice Level',
    type: 'SINGLE',
    required: false,
    isActive: true,
    options: [
      { labelVi: '100% Đá tiêu chuẩn', priceDelta: 0 },
      { labelVi: '50% Ít đá', priceDelta: 0 },
      { labelVi: 'Đá riêng', priceDelta: 0 },
      { labelVi: 'Uống nóng', priceDelta: 0 },
    ],
  },
  {
    id: 'grp-toppings',
    nameVi: 'Topping Thêm',
    nameEn: 'Extra Toppings',
    type: 'MULTIPLE',
    required: false,
    isActive: true,
    options: [
      { labelVi: 'Thạch đác rim dẻo giòn', priceDelta: 10000 },
      { labelVi: 'Trân châu hoàng kim', priceDelta: 8000 },
      { labelVi: 'Kem phô mai béo ngậy (Cheese Foam)', priceDelta: 12000 },
      { labelVi: 'Hạt sen bùi Gia Nghĩa', priceDelta: 10000 },
    ],
  },
];
