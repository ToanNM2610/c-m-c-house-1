'use client';

import React, { useState, useMemo } from 'react';
import { Search, Check, X, RefreshCw, Plus, Edit2, Trash2, UtensilsCrossed, Globe } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { MenuItem, CategoryId } from '@/types';

export default function AdminMenuManager() {
  const { data, refreshData } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCat, setSelectedCat] = useState<CategoryId | 'all'>('all');
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [loadingItemId, setLoadingItemId] = useState<string | null>(null);

  // Edit item form state
  const [editPrice, setEditPrice] = useState<number>(0);
  const [editTitleVi, setEditTitleVi] = useState('');
  const [editNameEn, setEditNameEn] = useState('');
  const [editDescVi, setEditDescVi] = useState('');
  const [editDescEn, setEditDescEn] = useState('');
  const [editHighlightVi, setEditHighlightVi] = useState('');
  const [editHighlightEn, setEditHighlightEn] = useState('');
  const [editNoteVi, setEditNoteVi] = useState('');
  const [editNoteEn, setEditNoteEn] = useState('');

  // New item modal state
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [newItemCategory, setNewItemCategory] = useState<CategoryId>('coffee');
  const [newItemTitleVi, setNewItemTitleVi] = useState('');
  const [newItemNameEn, setNewItemNameEn] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('35000');
  const [newItemDescVi, setNewItemDescVi] = useState('');
  const [newItemDescEn, setNewItemDescEn] = useState('');
  const [newItemHighlight, setNewItemHighlight] = useState('');
  const [newItemHighlightEn, setNewItemHighlightEn] = useState('');
  const [isSubmittingItem, setIsSubmittingItem] = useState(false);

  // Toggle In Stock / Out of Stock
  const handleToggleStock = async (item: MenuItem) => {
    setLoadingItemId(item.id);
    try {
      const res = await fetch('/api/menu', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: item.id, inStock: !item.inStock }),
      });
      if (res.ok) {
        await refreshData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingItemId(null);
    }
  };

  const startEditItem = (item: MenuItem) => {
    setEditingItem(item);
    setEditPrice(item.price);
    setEditTitleVi(item.vietnameseTitle);
    setEditNameEn(item.nameEn || item.name || '');
    setEditDescVi(item.description);
    setEditDescEn(item.descriptionEn || '');
    setEditHighlightVi(item.highlight || '');
    setEditHighlightEn(item.highlightEn || '');
    setEditNoteVi(item.editorialNote || '');
    setEditNoteEn(item.editorialNoteEn || '');
  };

  // Save complete edit (VI & EN)
  const handleSaveItemEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    setLoadingItemId(editingItem.id);
    try {
      const res = await fetch(`/api/menu/${editingItem.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          price: editPrice,
          vietnameseTitle: editTitleVi.trim(),
          name: editTitleVi.trim(),
          nameEn: editNameEn.trim() || undefined,
          description: editDescVi.trim(),
          descriptionEn: editDescEn.trim() || undefined,
          highlight: editHighlightVi.trim() || undefined,
          highlightEn: editHighlightEn.trim() || undefined,
          editorialNote: editNoteVi.trim() || undefined,
          editorialNoteEn: editNoteEn.trim() || undefined,
        }),
      });
      if (res.ok) {
        await refreshData();
        setEditingItem(null);
      } else {
        alert('Lỗi cập nhật món');
      }
    } catch (err) {
      console.error(err);
      alert('Không thể kết nối máy chủ');
    } finally {
      setLoadingItemId(null);
    }
  };

  // Delete item
  const handleDeleteItem = async (itemId: string, itemTitle: string) => {
    if (!confirm(`Bạn có chắc muốn xóa món "${itemTitle}" khỏi thực đơn?`)) return;
    setLoadingItemId(itemId);
    try {
      const res = await fetch(`/api/menu/${itemId}`, { method: 'DELETE' });
      if (res.ok) {
        await refreshData();
      } else {
        alert('Không thể xóa món này');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingItemId(null);
    }
  };

  // Create new item
  const handleCreateItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemTitleVi.trim() || !newItemPrice) return;
    setIsSubmittingItem(true);
    try {
      const res = await fetch('/api/menu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          categoryId: newItemCategory,
          vietnameseTitle: newItemTitleVi.trim(),
          name: newItemTitleVi.trim(),
          nameEn: newItemNameEn.trim() || newItemTitleVi.trim(),
          price: Number(newItemPrice),
          description: newItemDescVi.trim() || 'Món mới tinh tuyển tại Cẩm Cù House.',
          descriptionEn: newItemDescEn.trim() || 'Fresh craft specialty at Cẩm Cù House.',
          highlight: newItemHighlight.trim() || undefined,
          highlightEn: newItemHighlightEn.trim() || undefined,
        }),
      });
      if (res.ok) {
        setNewItemTitleVi('');
        setNewItemNameEn('');
        setNewItemDescVi('');
        setNewItemDescEn('');
        setNewItemHighlight('');
        setNewItemHighlightEn('');
        setIsAddingItem(false);
        await refreshData();
      } else {
        alert('Lỗi tạo món mới');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmittingItem(false);
    }
  };

  const filteredItems = useMemo(() => {
    return data.menu.filter((item) => {
      if (selectedCat !== 'all' && item.categoryId !== selectedCat) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        return (
          item.vietnameseTitle.toLowerCase().includes(q) ||
          item.name.toLowerCase().includes(q) ||
          item.nameEn?.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.descriptionEn?.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [data.menu, selectedCat, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-600 font-bold uppercase tracking-wider mb-1">
            <UtensilsCrossed className="w-4 h-4" />
            <span>CMS THỰC ĐƠN • QUẢN LÝ SONG NGỮ VI / EN</span>
          </div>
          <h2 className="text-xl font-bold text-slate-800">
            Thực Đơn Sinh Thái 7 Danh Mục (~67 Món)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Cập nhật giá bán, bản dịch tiếng Anh, thông tin nổi bật và trạng thái kho hàng thời gian thực.
          </p>
        </div>

        <button
          onClick={() => setIsAddingItem(!isAddingItem)}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm Món Mới</span>
        </button>
      </div>

      {/* Menu Item Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Filter controls */}
        <div className="p-4 sm:p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800 text-base">
              Danh Sách Món
            </span>
            <span className="text-xs font-mono text-slate-400">
              ({filteredItems.length} món)
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Category selector */}
            <select
              value={selectedCat}
              onChange={(e) => setSelectedCat(e.target.value as any)}
              className="px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
            >
              <option value="all">Tất cả danh mục (7 nhóm)</option>
              <option value="coffee">Cà phê (Coffee)</option>
              <option value="tea">Trà & Thảo mộc (Herbal Tea)</option>
              <option value="smoothie">Sinh tố (Smoothie)</option>
              <option value="juice">Nước ép (Fresh Juice)</option>
              <option value="soda-yogurt">Soda & Sữa chua</option>
              <option value="other">Thức uống khác (Other)</option>
              <option value="food">Đồ ăn no & Ăn vặt (Food)</option>
            </select>

            {/* Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Tìm tên món (VI / EN)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Add Item Drawer/Form */}
        {isAddingItem && (
          <form onSubmit={handleCreateItem} className="p-5 bg-emerald-50/60 border-b border-emerald-100 space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-emerald-800 uppercase tracking-wide flex items-center gap-1.5">
                <Plus className="w-3.5 h-3.5" />
                <span>Nhập Thông Tin Món Mới (Bilingual VI / EN)</span>
              </span>
              <button type="button" onClick={() => setIsAddingItem(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">Nhóm danh mục:</label>
                <select
                  value={newItemCategory}
                  onChange={(e) => setNewItemCategory(e.target.value as CategoryId)}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none"
                >
                  <option value="coffee">Cà phê (Coffee)</option>
                  <option value="tea">Trà & Thảo mộc (Herbal Tea)</option>
                  <option value="smoothie">Sinh tố (Smoothie)</option>
                  <option value="juice">Nước ép (Fresh Juice)</option>
                  <option value="soda-yogurt">Soda & Sữa chua</option>
                  <option value="other">Thức uống khác</option>
                  <option value="food">Đồ ăn no & Ăn vặt</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">Tên món (Tiếng Việt):</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Cà Phê Muối Cẩm Cù"
                  value={newItemTitleVi}
                  onChange={(e) => setNewItemTitleVi(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">Item Name (English):</label>
                <input
                  type="text"
                  placeholder="e.g. Cẩm Cù Signature Salt Coffee"
                  value={newItemNameEn}
                  onChange={(e) => setNewItemNameEn(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">Giá bán (VND):</label>
                <input
                  type="number"
                  step="1000"
                  required
                  value={newItemPrice}
                  onChange={(e) => setNewItemPrice(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-mono bg-white border border-slate-200 rounded-xl focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">Badge Nổi Bật (VI):</label>
                <input
                  type="text"
                  placeholder="Ví dụ: Best-seller, Signature"
                  value={newItemHighlight}
                  onChange={(e) => setNewItemHighlight(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">Badge Highlight (EN):</label>
                <input
                  type="text"
                  placeholder="e.g. Best-seller, Signature"
                  value={newItemHighlightEn}
                  onChange={(e) => setNewItemHighlightEn(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">Mô tả món (Tiếng Việt):</label>
                <input
                  type="text"
                  placeholder="Mô tả phong vị, nguyên liệu..."
                  value={newItemDescVi}
                  onChange={(e) => setNewItemDescVi(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">Description (English):</label>
                <input
                  type="text"
                  placeholder="English flavor description..."
                  value={newItemDescEn}
                  onChange={(e) => setNewItemDescEn(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsAddingItem(false)}
                className="px-3.5 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={isSubmittingItem}
                className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1"
              >
                {isSubmittingItem ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                <span>Lưu Món Mới</span>
              </button>
            </div>
          </form>
        )}

        {/* Edit Modal Popup */}
        {editingItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <form
              onSubmit={handleSaveItemEdit}
              className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b pb-3">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase">
                  <Edit2 className="w-4 h-4 text-emerald-600" />
                  <span>Chỉnh Sửa Chi Tiết Song Ngữ: {editingItem.id}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Tên món (Tiếng Việt):</label>
                  <input
                    type="text"
                    required
                    value={editTitleVi}
                    onChange={(e) => setEditTitleVi(e.target.value)}
                    className="w-full px-3 py-2 text-xs border rounded-xl font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Name (English):</label>
                  <input
                    type="text"
                    value={editNameEn}
                    onChange={(e) => setEditNameEn(e.target.value)}
                    className="w-full px-3 py-2 text-xs border rounded-xl font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Giá bán (VND):</label>
                  <input
                    type="number"
                    step="1000"
                    required
                    value={editPrice}
                    onChange={(e) => setEditPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs border rounded-xl font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Badge (VI):</label>
                  <input
                    type="text"
                    placeholder="Best-seller, Signature..."
                    value={editHighlightVi}
                    onChange={(e) => setEditHighlightVi(e.target.value)}
                    className="w-full px-3 py-2 text-xs border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Badge (EN):</label>
                  <input
                    type="text"
                    placeholder="Best-seller, Signature..."
                    value={editHighlightEn}
                    onChange={(e) => setEditHighlightEn(e.target.value)}
                    className="w-full px-3 py-2 text-xs border rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Ghi chú nghệ thuật (Editorial Note - VI):</label>
                  <input
                    type="text"
                    value={editNoteVi}
                    onChange={(e) => setEditNoteVi(e.target.value)}
                    className="w-full px-3 py-2 text-xs border rounded-xl italic"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Editorial Note (EN):</label>
                  <input
                    type="text"
                    value={editNoteEn}
                    onChange={(e) => setEditNoteEn(e.target.value)}
                    className="w-full px-3 py-2 text-xs border rounded-xl italic"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Mô tả món (VI):</label>
                  <textarea
                    rows={3}
                    value={editDescVi}
                    onChange={(e) => setEditDescVi(e.target.value)}
                    className="w-full px-3 py-2 text-xs border rounded-xl leading-relaxed"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Description (EN):</label>
                  <textarea
                    rows={3}
                    value={editDescEn}
                    onChange={(e) => setEditDescEn(e.target.value)}
                    className="w-full px-3 py-2 text-xs border rounded-xl leading-relaxed"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2 text-xs text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold"
                >
                  Lưu Thay Đổi
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Table View */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-mono uppercase text-[11px] border-b border-slate-200">
              <tr>
                <th className="p-4">Món Ăn / Đồ Uống</th>
                <th className="p-4">Nhóm</th>
                <th className="p-4">Giá Niêm Yết (VND)</th>
                <th className="p-4 text-center">Trạng Thái Kho</th>
                <th className="p-4 text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredItems.map((item) => {
                const isLoading = loadingItemId === item.id;

                return (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Name & Highlight */}
                    <td className="p-4 font-medium text-slate-900">
                      <div className="font-bold flex items-center gap-2">
                        <span>{item.vietnameseTitle}</span>
                        {item.nameEn && (
                          <span className="text-[11px] font-normal text-slate-400 font-serif italic">
                            ({item.nameEn})
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500 italic line-clamp-1">
                        {item.description}
                      </div>
                      {item.highlight && (
                        <span className="inline-block mt-1 text-[10px] font-mono text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          {item.highlight} {item.highlightEn ? `• ${item.highlightEn}` : ''}
                        </span>
                      )}
                    </td>

                    {/* Category */}
                    <td className="p-4 font-mono text-slate-600 uppercase text-[11px]">
                      {item.categoryId}
                    </td>

                    {/* Price */}
                    <td className="p-4 font-mono">
                      <span className="font-bold text-slate-900">
                        {item.price.toLocaleString('vi-VN')}đ
                      </span>
                    </td>

                    {/* Stock Status Switch */}
                    <td className="p-4 text-center">
                      <button
                        onClick={() => handleToggleStock(item)}
                        disabled={isLoading}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-mono text-[11px] font-bold transition-all ${
                          item.inStock
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            : 'bg-red-100 text-red-800 hover:bg-red-200'
                        }`}
                      >
                        {isLoading ? (
                          <RefreshCw className="w-3 h-3 animate-spin" />
                        ) : item.inStock ? (
                          <>
                            <span className="w-2 h-2 rounded-full bg-emerald-600" />
                            <span>Còn món</span>
                          </>
                        ) : (
                          <>
                            <span className="w-2 h-2 rounded-full bg-red-600" />
                            <span>Tạm hết</span>
                          </>
                        )}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => startEditItem(item)}
                          className="px-2.5 py-1 text-xs text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg flex items-center gap-1 font-medium"
                          title="Sửa song ngữ & giá"
                        >
                          <Edit2 className="w-3 h-3" />
                          <span>Sửa VI/EN</span>
                        </button>
                        <button
                          onClick={() => handleDeleteItem(item.id, item.vietnameseTitle)}
                          className="text-red-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50"
                          title="Xóa món"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
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
  );
}
