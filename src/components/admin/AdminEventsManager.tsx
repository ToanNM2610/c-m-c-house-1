'use client';

import React, { useState, useRef } from 'react';
import {
  Music,
  Plus,
  Edit2,
  Trash2,
  Check,
  RefreshCw,
  X,
  Clock,
  Upload,
  Camera,
  Image as ImageIcon,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { CafeEvent } from '@/types';

export default function AdminEventsManager() {
  const { data, refreshData } = useApp();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form fields
  const [title, setTitle] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [subtitleEn, setSubtitleEn] = useState('');
  const [dateOrSchedule, setDateOrSchedule] = useState('');
  const [dateOrScheduleEn, setDateOrScheduleEn] = useState('');
  const [description, setDescription] = useState('');
  const [descriptionEn, setDescriptionEn] = useState('');
  const [badge, setBadge] = useState('Đêm nhạc Acoustic');
  const [badgeEn, setBadgeEn] = useState('Acoustic Live Music');
  const [imageUrl, setImageUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const startEdit = (ev: CafeEvent) => {
    setEditingId(ev.id);
    setTitle(ev.title);
    setTitleEn(ev.titleEn || '');
    setSubtitle(ev.subtitle || '');
    setSubtitleEn(ev.subtitleEn || '');
    setDateOrSchedule(ev.dateOrSchedule || '');
    setDateOrScheduleEn(ev.dateOrScheduleEn || '');
    setDescription(ev.description);
    setDescriptionEn(ev.descriptionEn || '');
    setBadge(ev.badge || 'Sự kiện');
    setBadgeEn(ev.badgeEn || 'Event');
    setImageUrl(ev.imageUrl || '');
    setIsAdding(true);
  };

  const resetForm = () => {
    setEditingId(null);
    setTitle('');
    setTitleEn('');
    setSubtitle('');
    setSubtitleEn('');
    setDateOrSchedule('');
    setDateOrScheduleEn('');
    setDescription('');
    setDescriptionEn('');
    setBadge('Đêm nhạc Acoustic');
    setBadgeEn('Acoustic Live Music');
    setImageUrl('');
    setIsAdding(false);
  };

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!['image/jpeg', 'image/png', 'image/webp', 'image/avif'].includes(file.type)) {
      alert('Vui lòng chọn tệp ảnh hợp lệ (JPG, PNG, WebP, AVIF).');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert('Dung lượng ảnh vượt quá 10MB.');
      return;
    }

    setIsUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'events');

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const json = await res.json();
      if (res.ok && json.data?.url) {
        setImageUrl(json.data.url);
      } else {
        alert(json.error || 'Lỗi tải ảnh sự kiện lên');
      }
    } catch (err) {
      console.error(err);
      alert('Không thể kết nối máy chủ để tải ảnh');
    } finally {
      setIsUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleToggleActive = async (ev: CafeEvent) => {
    try {
      const res = await fetch('/api/events', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: ev.id, active: !ev.active }),
      });
      if (res.ok) {
        await refreshData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string, evTitle: string) => {
    if (!confirm(`Bạn có chắc muốn xóa sự kiện "${evTitle}"?`)) return;
    try {
      const res = await fetch(`/api/events?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        await refreshData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !dateOrSchedule.trim()) return;
    setIsSubmitting(true);

    try {
      if (editingId) {
        const res = await fetch('/api/events', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: editingId,
            title: title.trim(),
            titleEn: titleEn.trim(),
            subtitle: subtitle.trim(),
            subtitleEn: subtitleEn.trim(),
            dateOrSchedule: dateOrSchedule.trim(),
            dateOrScheduleEn: dateOrScheduleEn.trim(),
            description: description.trim(),
            descriptionEn: descriptionEn.trim(),
            badge: badge.trim(),
            badgeEn: badgeEn.trim(),
            imageUrl: imageUrl.trim(),
          }),
        });
        if (res.ok) {
          resetForm();
          await refreshData();
        } else {
          alert('Lỗi cập nhật sự kiện');
        }
      } else {
        const res = await fetch('/api/events', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: title.trim(),
            titleEn: titleEn.trim(),
            subtitle: subtitle.trim(),
            subtitleEn: subtitleEn.trim(),
            dateOrSchedule: dateOrSchedule.trim(),
            dateOrScheduleEn: dateOrScheduleEn.trim(),
            description: description.trim(),
            descriptionEn: descriptionEn.trim(),
            badge: badge.trim(),
            badgeEn: badgeEn.trim(),
            imageUrl: imageUrl.trim(),
          }),
        });
        if (res.ok) {
          resetForm();
          await refreshData();
        } else {
          alert('Lỗi tạo sự kiện mới');
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-600 font-bold uppercase tracking-wider mb-1">
            <Music className="w-4 h-4" />
            <span>CMS TIN TỨC & SỰ KIỆN • NHỊP SỐNG BÊN SUỐI</span>
          </div>
          <h2 className="text-xl font-bold text-slate-800">
            Quản Lý Đêm Nhạc Acoustic & Hoạt Động Quán
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Cập nhật lịch biểu diễn, tải ảnh bìa sự kiện và thông báo trực tiếp đến khách hàng tại trang chủ và trang liên hệ.
          </p>
        </div>

        <button
          onClick={() => {
            resetForm();
            setIsAdding(!isAdding);
          }}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm Sự Kiện Mới</span>
        </button>
      </div>

      {/* Add / Edit Form */}
      {isAdding && (
        <form onSubmit={handleSubmit} className="p-6 bg-white rounded-2xl border-2 border-emerald-500 shadow-md space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-800 text-sm">
              {editingId ? 'Chỉnh Sửa Sự Kiện' : 'Thêm Sự Kiện / Đêm Nhạc Mới'}
            </h3>
            <button type="button" onClick={resetForm} className="text-slate-400 hover:text-slate-600">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Tiêu đề sự kiện (VI):</label>
              <input
                type="text"
                required
                placeholder="Ví dụ: Đêm Nhạc Acoustic 'Thì Thầm Dòng Suối'"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 text-xs border rounded-xl focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Thời gian / Lịch tổ chức (VI):</label>
              <input
                type="text"
                required
                placeholder="Ví dụ: Thứ Bảy 19:30 – 21:30"
                value={dateOrSchedule}
                onChange={(e) => setDateOrSchedule(e.target.value)}
                className="w-full px-3 py-2 text-xs border rounded-xl focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Badge huy hiệu (VI):</label>
              <input
                type="text"
                placeholder="Ví dụ: Đêm nhạc Acoustic"
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                className="w-full px-3 py-2 text-xs border rounded-xl focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Phụ đề ngắn (VI):</label>
            <input
              type="text"
              placeholder="Ví dụ: Guitar Mộc & Violin Dưới Đèn Lồng Ven Suối"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              className="w-full px-3 py-2 text-xs border rounded-xl focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Nội dung chi tiết sự kiện (VI):</label>
            <textarea
              rows={3}
              required
              placeholder="Miêu tả ca sĩ biểu diễn, không khí hoặc ưu đãi..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 text-xs border rounded-xl focus:outline-none focus:border-emerald-500 leading-relaxed"
            />
          </div>

          {/* English Event Content */}
          <div className="p-4 bg-emerald-50/40 rounded-xl border border-emerald-100 space-y-4">
            <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wider">
              Nội dung tiếng Anh (English Translation)
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-emerald-900 mb-1">Event Title (EN):</label>
                <input
                  type="text"
                  placeholder="e.g. Acoustic Night 'Whispering Stream'"
                  value={titleEn}
                  onChange={(e) => setTitleEn(e.target.value)}
                  className="w-full px-3 py-2 text-xs border rounded-xl focus:outline-none focus:border-emerald-500 bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-emerald-900 mb-1">Schedule / Date (EN):</label>
                <input
                  type="text"
                  placeholder="e.g. Saturday 19:30 – 21:30"
                  value={dateOrScheduleEn}
                  onChange={(e) => setDateOrScheduleEn(e.target.value)}
                  className="w-full px-3 py-2 text-xs border rounded-xl focus:outline-none focus:border-emerald-500 bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-emerald-900 mb-1">Badge Tag (EN):</label>
                <input
                  type="text"
                  placeholder="e.g. Acoustic Live Music"
                  value={badgeEn}
                  onChange={(e) => setBadgeEn(e.target.value)}
                  className="w-full px-3 py-2 text-xs border rounded-xl focus:outline-none focus:border-emerald-500 bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-emerald-900 mb-1">Subtitle (EN):</label>
              <input
                type="text"
                placeholder="e.g. Acoustic Guitar & Violin by Streamside Lanterns"
                value={subtitleEn}
                onChange={(e) => setSubtitleEn(e.target.value)}
                className="w-full px-3 py-2 text-xs border rounded-xl focus:outline-none focus:border-emerald-500 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-emerald-900 mb-1">Detailed Description (EN):</label>
              <textarea
                rows={3}
                placeholder="English event details..."
                value={descriptionEn}
                onChange={(e) => setDescriptionEn(e.target.value)}
                className="w-full px-3 py-2 text-xs border rounded-xl focus:outline-none focus:border-emerald-500 leading-relaxed bg-white"
              />
            </div>
          </div>

          {/* Direct PC Image Upload Section for Event */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
            <label className="block text-xs font-semibold text-slate-700">
              Ảnh bìa sự kiện (Tải trực tiếp từ máy tính):
            </label>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              {/* Image Preview Box */}
              <div className="w-32 h-20 rounded-xl overflow-hidden bg-slate-200 border border-slate-300 relative flex-shrink-0 flex items-center justify-center">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt="Xem trước ảnh sự kiện"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center p-2 text-slate-400">
                    <ImageIcon className="w-6 h-6 mx-auto mb-0.5 opacity-60" />
                    <span className="text-[10px] font-mono block">Chưa có ảnh</span>
                  </div>
                )}
                {isUploadingImage && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <RefreshCw className="w-4 h-4 animate-spin text-white" />
                  </div>
                )}
              </div>

              {/* Upload & Path Controls */}
              <div className="flex-1 space-y-2 w-full">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/avif"
                  onChange={handleImageFileChange}
                  className="hidden"
                />

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploadingImage}
                    className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>{imageUrl ? 'Thay ảnh khác từ máy' : 'Chọn ảnh từ máy tính'}</span>
                  </button>

                  {imageUrl && (
                    <button
                      type="button"
                      onClick={() => setImageUrl('')}
                      className="px-2.5 py-1.5 text-xs text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      Xóa ảnh bìa
                    </button>
                  )}
                </div>

                <input
                  type="text"
                  placeholder="/uploads/events/... hoặc https://..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full px-3 py-1.5 text-[11px] font-mono border rounded-lg focus:outline-none focus:border-emerald-500 bg-white"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 text-xs text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting || isUploadingImage}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5"
            >
              {isSubmitting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
              <span>{editingId ? 'Cập Nhật Sự Kiện' : 'Tạo Sự Kiện'}</span>
            </button>
          </div>
        </form>
      )}

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(data.events || []).map((ev) => (
          <div
            key={ev.id}
            className={`rounded-2xl border transition-all overflow-hidden flex flex-col justify-between ${
              ev.active ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-50 border-slate-200 opacity-60'
            }`}
          >
            {/* Event Cover Photo if Present */}
            {ev.imageUrl && (
              <div className="h-44 w-full bg-slate-100 overflow-hidden relative">
                <img
                  src={ev.imageUrl}
                  alt={ev.title}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-2.5 right-2.5 bg-black/60 backdrop-blur-xs text-white text-[10px] font-mono px-2 py-0.5 rounded">
                  {ev.badge}
                </span>
              </div>
            )}

            <div className="p-6 space-y-3">
              <div className="flex items-center justify-between">
                {!ev.imageUrl && (
                  <span className="text-[10px] font-mono uppercase font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full">
                    {ev.badge || 'Sự kiện'}
                  </span>
                )}
                <span className="text-xs font-mono text-slate-500 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-emerald-600" />
                  {ev.dateOrSchedule || 'Lịch định kỳ'}
                </span>
              </div>

              <h4 className="font-serif text-xl font-bold text-slate-900 leading-snug">
                {ev.title}
              </h4>

              {ev.subtitle && (
                <p className="text-xs font-mono text-amber-800 font-semibold">
                  {ev.subtitle}
                </p>
              )}

              <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                {ev.description}
              </p>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
              <button
                onClick={() => handleToggleActive(ev)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                  ev.active
                    ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                    : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                }`}
              >
                {ev.active ? 'Đang hiển thị' : 'Đang ẩn'}
              </button>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => startEdit(ev)}
                  className="p-1.5 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-200"
                  title="Sửa"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(ev.id, ev.title)}
                  className="p-1.5 text-red-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                  title="Xóa"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
