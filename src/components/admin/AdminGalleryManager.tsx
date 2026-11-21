'use client';

import React, { useState, useRef } from 'react';
import {
  Camera,
  Upload,
  RefreshCw,
  Edit2,
  Save,
  X,
  Trash2,
  CheckCircle,
  AlertCircle,
  Layers,
  Sparkles,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { broadcastCmsSync } from '@/lib/cms-sync';
import { SpatialPlate } from '@/types';

export default function AdminGalleryManager() {
  const { data, refreshData } = useApp();
  const [selectedChapter, setSelectedChapter] = useState<number | 'all'>('all');
  const [editingPlateId, setEditingPlateId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [clearedMediaIds, setClearedMediaIds] = useState<Set<string>>(new Set());

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  // Edit fields
  const [titleVi, setTitleVi] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [locationVi, setLocationVi] = useState('');
  const [locationEn, setLocationEn] = useState('');
  const [descriptionVi, setDescriptionVi] = useState('');
  const [descriptionEn, setDescriptionEn] = useState('');
  const [chapter, setChapter] = useState(1);
  const [imageUrl, setImageUrl] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Per-card uploading state (map of plateId -> boolean)
  const [uploadingPlates, setUploadingPlates] = useState<Record<string, boolean>>({});
  // Per-card dragover state
  const [dragOverPlates, setDragOverPlates] = useState<Record<string, boolean>>({});
  // Card image error state (map of plateId -> boolean)
  const [brokenImages, setBrokenImages] = useState<Record<string, boolean>>({});

  // Bulk upload state
  const bulkInputRef = useRef<HTMLInputElement>(null);
  const [bulkUploading, setBulkUploading] = useState(false);
  const [bulkProgress, setBulkProgress] = useState<{ current: number; total: number; percent: number } | null>(null);
  const [bulkSuccessMsg, setBulkSuccessMsg] = useState<string | null>(null);

  // Hidden file input references for individual cards
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const startEdit = (plate: SpatialPlate) => {
    setEditingPlateId(plate.id);
    setTitleVi(plate.titleVi);
    setTitleEn(plate.titleEn || '');
    setLocationVi(plate.locationVi);
    setLocationEn(plate.locationEn || '');
    setDescriptionVi(plate.descriptionVi);
    setDescriptionEn(plate.descriptionEn || '');
    setChapter(plate.chapter);
    setImageUrl(plate.imageUrl || '');
  };

  const handleSavePlate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPlateId) return;
    setIsSaving(true);
    try {
      const res = await fetch('/api/spatial-plates', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingPlateId,
          titleVi: titleVi.trim(),
          titleEn: titleEn.trim() || undefined,
          locationVi: locationVi.trim(),
          locationEn: locationEn.trim() || undefined,
          descriptionVi: descriptionVi.trim(),
          descriptionEn: descriptionEn.trim() || undefined,
          chapter,
          imageUrl: imageUrl.trim(),
        }),
      });
      if (res.ok) {
        await refreshData();
        broadcastCmsSync('gallery');
        // Clear broken image status for this plate if any
        setBrokenImages((prev) => ({ ...prev, [editingPlateId]: false }));
        setEditingPlateId(null);
      } else {
        alert('Lỗi lưu thông tin ảnh');
      }
    } catch (err) {
      console.error(err);
      alert('Không thể kết nối đến máy chủ');
    } finally {
      setIsSaving(false);
    }
  };

  // Upload single file for a plate
  const uploadAndBindFile = async (plateId: string, file: File) => {
    // Basic validation
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
    if (!allowedTypes.includes(file.type)) {
      alert('Vui lòng chọn ảnh định dạng JPG, PNG, WebP hoặc AVIF.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      alert('Dung lượng ảnh vượt quá 10MB.');
      return;
    }

    setUploadingPlates((prev) => ({ ...prev, [plateId]: true }));
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'gallery');

      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const uploadJson = await uploadRes.json();
      if (!uploadRes.ok || !uploadJson.data?.url) {
        throw new Error(uploadJson.error || 'Lỗi tải ảnh lên máy chủ');
      }

      const uploadedUrl = uploadJson.data.url;

      // Bind to SQLite via /api/spatial-plates
      const patchRes = await fetch('/api/spatial-plates', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: plateId,
          imageUrl: uploadedUrl,
        }),
      });

      if (!patchRes.ok) {
        throw new Error('Lỗi cập nhật liên kết ảnh vào cơ sở dữ liệu');
      }

      // Clear broken image state
      setBrokenImages((prev) => ({ ...prev, [plateId]: false }));
      setClearedMediaIds((prev) => {
        const next = new Set(prev);
        next.delete(plateId);
        return next;
      });
      showToast('success', `Đã cập nhật ảnh cho ${plateId}`);
      await refreshData();
      broadcastCmsSync('gallery');
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Không thể tải ảnh lên');
    } finally {
      setUploadingPlates((prev) => ({ ...prev, [plateId]: false }));
    }
  };

  const handleCardFileSelect = (plateId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadAndBindFile(plateId, file);
    }
    // Reset file input so re-selecting same file triggers onChange
    e.target.value = '';
  };

  const handleCardDrop = (plateId: string, e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOverPlates((prev) => ({ ...prev, [plateId]: false }));
    const file = e.dataTransfer.files?.[0];
    if (file) {
      uploadAndBindFile(plateId, file);
    }
  };

  const handleDeleteImage = async (plate: SpatialPlate) => {
    if (!confirm(`Bạn có chắc muốn gỡ bỏ ảnh của "${plate.id}: ${plate.titleVi}"? Khung hình sẽ trở về trạng thái đồ họa ban đầu.`)) {
      return;
    }

    setUploadingPlates((prev) => ({ ...prev, [plate.id]: true }));
    try {
      const res = await fetch(`/api/spatial-plates?id=${encodeURIComponent(plate.id)}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          id: plate.id,
          imageUrl: '',
        }),
      });

      const json = await res.json().catch(() => ({}));
      if (res.ok && (json.success || !json.error)) {
        // Immediately remove image from local React state (no stale UI)
        setClearedMediaIds((prev) => new Set(prev).add(plate.id));
        setBrokenImages((prev) => ({ ...prev, [plate.id]: false }));
        showToast('success', `Đã xóa ảnh thực tế của khung hình ${plate.id}`);
        await refreshData();
        broadcastCmsSync('gallery');
      } else {
        const errorMsg = json.error || json.message || 'Lỗi gỡ bỏ ảnh khung hình';
        showToast('error', errorMsg);
      }
    } catch (err) {
      console.error(err);
      showToast('error', 'Không thể kết nối đến máy chủ để xóa ảnh');
    } finally {
      setUploadingPlates((prev) => ({ ...prev, [plate.id]: false }));
    }
  };

  // Bulk Multi-Photo Upload Handler
  const handleBulkUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Filter valid image files
    const validFiles = files.filter((f) =>
      ['image/jpeg', 'image/png', 'image/webp', 'image/avif'].includes(f.type)
    );

    if (validFiles.length === 0) {
      alert('Không tìm thấy tệp ảnh hợp lệ (JPG, PNG, WebP, AVIF).');
      return;
    }

    const totalToUpload = Math.min(validFiles.length, data.spatialPlates.length || 31);
    const sortedPlates = [...data.spatialPlates].sort((a, b) => a.id.localeCompare(b.id));

    setBulkUploading(true);
    setBulkSuccessMsg(null);
    setBulkProgress({ current: 0, total: totalToUpload, percent: 0 });

    let successCount = 0;

    for (let i = 0; i < totalToUpload; i++) {
      const file = validFiles[i];
      const targetPlate = sortedPlates[i];
      if (!targetPlate) break;

      setBulkProgress({
        current: i + 1,
        total: totalToUpload,
        percent: Math.round(((i + 1) / totalToUpload) * 100),
      });

      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', 'gallery');

        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        const uploadJson = await uploadRes.json();

        if (uploadRes.ok && uploadJson.data?.url) {
          await fetch('/api/spatial-plates', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              id: targetPlate.id,
              imageUrl: uploadJson.data.url,
            }),
          });
          successCount++;
        }
      } catch (err) {
        console.error(`Error uploading file ${i + 1}:`, err);
      }
    }

    await refreshData();
    broadcastCmsSync('gallery');
    setBrokenImages({});
    setBulkUploading(false);
    setBulkProgress(null);
    setBulkSuccessMsg(`Đã tải lên và gán thành công ${successCount}/${totalToUpload} ảnh vào thư viện!`);
    setTimeout(() => setBulkSuccessMsg(null), 6000);

    // Reset bulk input
    if (bulkInputRef.current) bulkInputRef.current.value = '';
  };

  const filteredPlates = selectedChapter === 'all'
    ? data.spatialPlates
    : data.spatialPlates.filter((p) => p.chapter === selectedChapter);

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-16 right-6 z-50 p-4 rounded-xl shadow-lg border flex items-center gap-3 transition-all animate-fadeIn ${
            toast.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-red-50 border-red-200 text-red-800'
          }`}
        >
          {toast.type === 'success' ? (
            <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          )}
          <span className="text-xs font-mono font-medium">{toast.message}</span>
        </div>
      )}

      {/* Top Banner & Bulk Action Bar */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-600 font-bold uppercase tracking-wider mb-1">
            <Camera className="w-4 h-4" />
            <span>CMS THƯ VIỆN KHÔNG GIAN • FIG. 01 – FIG. {String(data.spatialPlates.length || 31).padStart(2, '0')}</span>
          </div>
          <h2 className="text-xl font-bold text-slate-800">
            Quản Lý {data.spatialPlates.length || 31} Khung Hình & Ảnh Thực Tế
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Tải ảnh trực tiếp từ máy tính (kéo thả hoặc nhấn để chọn), xem trước hình thu nhỏ 16:10 và cập nhật tự động lên trang /khong-gian.
          </p>
        </div>

        {/* Action Controls: Chapter Filter & Bulk Upload */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Chapter filter selector */}
          <div className="flex items-center gap-1 bg-slate-50 p-1.5 rounded-xl border border-slate-200">
            <button
              onClick={() => setSelectedChapter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                selectedChapter === 'all'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Tất cả ({data.spatialPlates.length || 31})
            </button>
            {[1, 2, 3, 4].map((ch) => (
              <button
                key={ch}
                onClick={() => setSelectedChapter(ch)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                  selectedChapter === ch
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Chương {ch}
              </button>
            ))}
          </div>

          {/* Bulk Multi-Photo Upload Button */}
          <div>
            <input
              ref={bulkInputRef}
              type="file"
              multiple
              accept="image/jpeg,image/png,image/webp,image/avif"
              onChange={handleBulkUpload}
              className="hidden"
            />
            <button
              onClick={() => bulkInputRef.current?.click()}
              disabled={bulkUploading}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shadow-sm disabled:opacity-50"
            >
              {bulkUploading ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Layers className="w-3.5 h-3.5" />
              )}
              <span>Tải hàng loạt ảnh từ máy</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bulk Progress Bar if Active */}
      {bulkUploading && bulkProgress && (
        <div className="bg-white p-4 rounded-2xl border-2 border-emerald-500 shadow-md animate-fadeIn space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="font-bold text-emerald-800 flex items-center gap-2">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-600" />
              Đang tải ảnh hàng loạt lên máy chủ ({bulkProgress.current}/{bulkProgress.total} ảnh)...
            </span>
            <span className="font-bold text-emerald-600">{bulkProgress.percent}%</span>
          </div>
          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-600 transition-all duration-300 rounded-full"
              style={{ width: `${bulkProgress.percent}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-500 font-mono">
            Các ảnh đang được lưu trữ an toàn vào thư mục public/uploads/gallery và tự động gán vào các khung hình từ FIG. 01 trở đi.
          </p>
        </div>
      )}

      {/* Bulk Success Notification */}
      {bulkSuccessMsg && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 px-4 py-3 rounded-2xl text-xs font-mono flex items-center gap-2 animate-fadeIn">
          <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{bulkSuccessMsg}</span>
        </div>
      )}

      {/* Plate Edit Drawer Form if open */}
      {editingPlateId && (
        <form onSubmit={handleSavePlate} className="p-6 bg-white rounded-2xl border-2 border-emerald-500 shadow-lg space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Chỉnh sửa thông tin chi tiết:</span>
              <span className="font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                {editingPlateId}
              </span>
            </h3>
            <button type="button" onClick={() => setEditingPlateId(null)} className="text-slate-400 hover:text-slate-600">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Tiêu đề khung hình (VI):</label>
              <input
                type="text"
                required
                value={titleVi}
                onChange={(e) => setTitleVi(e.target.value)}
                className="w-full px-3 py-2 text-xs border rounded-xl focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Vị trí chụp / Phân khu (VI):</label>
              <input
                type="text"
                required
                value={locationVi}
                onChange={(e) => setLocationVi(e.target.value)}
                className="w-full px-3 py-2 text-xs border rounded-xl focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Gán vào Chương:</label>
              <select
                value={chapter}
                onChange={(e) => setChapter(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs border rounded-xl focus:outline-none"
              >
                <option value={1}>Chương I: Lối Nhỏ Vào Vườn</option>
                <option value={2}>Chương II: Bên Bờ Suối Mát</option>
                <option value={3}>Chương III: Hương Vị Xanh Sạch</option>
                <option value={4}>Chương IV: Chiều Buông & Đêm Cuối Tuần</option>
              </select>
            </div>
          </div>

          {/* English title & location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-emerald-50/40 p-3 rounded-xl border border-emerald-100">
            <div>
              <label className="block text-xs font-semibold text-emerald-900 mb-1">Frame Title (English):</label>
              <input
                type="text"
                value={titleEn}
                onChange={(e) => setTitleEn(e.target.value)}
                placeholder="English plate title..."
                className="w-full px-3 py-2 text-xs border rounded-xl focus:outline-none focus:border-emerald-500 bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-emerald-900 mb-1">Location / Zone (English):</label>
              <input
                type="text"
                value={locationEn}
                onChange={(e) => setLocationEn(e.target.value)}
                placeholder="English zone/location..."
                className="w-full px-3 py-2 text-xs border rounded-xl focus:outline-none focus:border-emerald-500 bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Lời bình / Mô tả góc chụp (VI):</label>
            <textarea
              rows={2}
              required
              value={descriptionVi}
              onChange={(e) => setDescriptionVi(e.target.value)}
              className="w-full px-3 py-2 text-xs border rounded-xl focus:outline-none focus:border-emerald-500 leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-emerald-900 mb-1">Description / Commentary (English):</label>
            <textarea
              rows={2}
              value={descriptionEn}
              onChange={(e) => setDescriptionEn(e.target.value)}
              placeholder="English plate commentary..."
              className="w-full px-3 py-2 text-xs border rounded-xl focus:outline-none focus:border-emerald-500 leading-relaxed bg-emerald-50/30"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Đường dẫn ảnh (URL hoặc đường dẫn nội bộ):</label>
            <input
              type="text"
              placeholder="/uploads/gallery/... hoặc https://..."
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full px-3 py-2 text-xs font-mono border rounded-xl focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setEditingPlateId(null)}
              className="px-4 py-2 text-xs text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5"
            >
              {isSaving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              <span>Lưu Thay Đổi</span>
            </button>
          </div>
        </form>
      )}

      {/* Grid of 30 Plates with 16:10 Live Previews */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPlates.map((plate) => {
          const isUploading = uploadingPlates[plate.id];
          const isDragOver = dragOverPlates[plate.id];
          const hasImage = Boolean(
            plate.imageUrl &&
            plate.imageUrl.trim() !== '' &&
            !brokenImages[plate.id] &&
            !clearedMediaIds.has(plate.id)
          );

          return (
            <div
              key={plate.id}
              className={`p-5 bg-white rounded-2xl border transition-all duration-200 flex flex-col justify-between ${
                isDragOver
                  ? 'border-emerald-500 ring-2 ring-emerald-400 bg-emerald-50/20 shadow-md'
                  : 'border-slate-200 hover:border-slate-300 shadow-subtle'
              }`}
            >
              <div>
                {/* Header Tag */}
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                    {plate.id}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 uppercase">
                    Chương {plate.chapter}
                  </span>
                </div>

                {/* 16:10 Interactive Image Preview & Dropzone */}
                <div
                  onClick={() => fileInputRefs.current[plate.id]?.click()}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragOverPlates((prev) => ({ ...prev, [plate.id]: true }));
                  }}
                  onDragLeave={() => {
                    setDragOverPlates((prev) => ({ ...prev, [plate.id]: false }));
                  }}
                  onDrop={(e) => handleCardDrop(plate.id, e)}
                  className={`relative aspect-[16/10] rounded-xl overflow-hidden cursor-pointer group mb-3 border transition-all flex items-center justify-center ${
                    hasImage
                      ? 'border-slate-200 bg-slate-900'
                      : 'border-2 border-dashed border-slate-300 hover:border-emerald-500 bg-slate-50 hover:bg-emerald-50/30'
                  }`}
                  title="Nhấn hoặc kéo ảnh vào đây để tải lên"
                >
                  {/* Hidden per-card file input */}
                  <input
                    ref={(el) => {
                      fileInputRefs.current[plate.id] = el;
                    }}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/avif"
                    onChange={(e) => handleCardFileSelect(plate.id, e)}
                    className="hidden"
                  />

                  {/* Rendering Actual Image or Graceful Botanical Placeholder */}
                  {hasImage ? (
                    <>
                      <img
                        src={plate.imageUrl}
                        alt={plate.titleVi}
                        onError={() => setBrokenImages((prev) => ({ ...prev, [plate.id]: true }))}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-3 text-center text-white">
                        <Upload className="w-5 h-5 mb-1 text-emerald-300" />
                        <span className="text-xs font-medium">Nhấn để thay ảnh mới</span>
                        <span className="text-[10px] text-white/70 font-mono">hoặc kéo thả ảnh vào</span>
                      </div>
                    </>
                  ) : (
                    /* Botanical Fallback Placeholder */
                    <div className="p-4 text-center flex flex-col items-center justify-center space-y-1.5">
                      <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Camera className="w-5 h-5" />
                      </div>
                      <p className="text-xs font-semibold text-slate-700 group-hover:text-emerald-700 transition-colors">
                        Chưa có ảnh thật
                      </p>
                      <p className="text-[10px] text-slate-400 font-mono">
                        Nhấn hoặc kéo ảnh vào đây
                      </p>
                    </div>
                  )}

                  {/* Loading Spinner Overlay if uploading this card */}
                  {isUploading && (
                    <div className="absolute inset-0 bg-black/85 flex flex-col items-center justify-center text-white z-10">
                      <RefreshCw className="w-6 h-6 animate-spin text-emerald-400 mb-1.5" />
                      <span className="text-xs font-mono font-medium">Đang lưu ảnh...</span>
                    </div>
                  )}
                </div>

                {/* Plate Details */}
                <h4 className="font-bold text-slate-900 text-sm mb-1 leading-snug">{plate.titleVi}</h4>
                <p className="text-xs text-emerald-800 font-mono mb-2 flex items-center gap-1">
                  <span>📍</span>
                  <span className="truncate">{plate.locationVi}</span>
                </p>
                <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 mb-3">
                  {plate.descriptionVi}
                </p>

                {/* Display Current URL */}
                {plate.imageUrl && (
                  <div className="text-[11px] font-mono text-slate-600 bg-slate-100 p-2 rounded-lg mb-3 truncate flex items-center justify-between gap-1.5">
                    <span className="truncate text-emerald-700">{plate.imageUrl}</span>
                  </div>
                )}
              </div>

              {/* Action Bar */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => startEdit(plate)}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium flex items-center gap-1 transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Sửa chữ</span>
                  </button>

                  <button
                    onClick={() => fileInputRefs.current[plate.id]?.click()}
                    disabled={isUploading}
                    className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg text-xs font-medium flex items-center gap-1 transition-colors"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Tải ảnh</span>
                  </button>
                </div>

                {/* Delete / Reset Image Button */}
                {plate.imageUrl && (
                  <button
                    onClick={() => handleDeleteImage(plate)}
                    disabled={isUploading}
                    className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg text-xs transition-colors"
                    title="Xóa ảnh (trở về hình mặc định)"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
