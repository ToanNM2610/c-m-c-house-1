'use client';

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Users,
  Plus,
  Trash2,
  Edit2,
  Save,
  X,
  Eye,
  EyeOff,
  Upload,
  RefreshCw,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { HighlightStory, TeamMember } from '@/types';
import { useApp } from '@/context/AppContext';
import { broadcastCmsSync } from '@/lib/cms-sync';

export default function AdminStoriesTeamManager() {
  const { refreshData } = useApp();
  const [tab, setTab] = useState<'stories' | 'team'>('stories');
  const [stories, setStories] = useState<HighlightStory[]>([]);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Story Form State
  const [editingStory, setEditingStory] = useState<Partial<HighlightStory> | null>(null);
  const [isStoryModalOpen, setIsStoryModalOpen] = useState(false);
  const [storySubmitting, setStorySubmitting] = useState(false);

  // Team Form State
  const [editingMember, setEditingMember] = useState<Partial<TeamMember> | null>(null);
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [teamSubmitting, setTeamSubmitting] = useState(false);

  // Image upload state
  const [uploadingImage, setUploadingImage] = useState(false);

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const [storiesRes, teamRes] = await Promise.all([
        fetch('/api/stories'),
        fetch('/api/team'),
      ]);
      const storiesJson = await storiesRes.json();
      const teamJson = await teamRes.json();

      if (storiesJson.success) setStories(storiesJson.data || []);
      if (teamJson.success) setTeam(teamJson.data || []);
    } catch {
      showToast('error', 'Lỗi khi tải dữ liệu bài viết & đội ngũ');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, target: 'story' | 'team') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', target === 'team' ? 'brand' : 'events');

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const json = await res.json();
      if (res.ok && json.success) {
        if (target === 'story' && editingStory) {
          setEditingStory({ ...editingStory, imageUrl: json.url });
        } else if (target === 'team' && editingMember) {
          setEditingMember({ ...editingMember, avatarUrl: json.url });
        }
        showToast('success', 'Tải ảnh lên thành công');
      } else {
        showToast('error', json.error || 'Lỗi tải ảnh');
      }
    } catch {
      showToast('error', 'Lỗi kết nối khi tải ảnh');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSaveStory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStory?.title || !editingStory?.summary || !editingStory?.content) {
      showToast('error', 'Vui lòng điền đủ Tiêu đề, Tóm tắt và Nội dung chi tiết');
      return;
    }

    setStorySubmitting(true);
    try {
      const isNew = !editingStory.id;
      const method = isNew ? 'POST' : 'PUT';
      const res = await fetch('/api/stories', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingStory),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        showToast('success', isNew ? 'Thêm câu chuyện thành công' : 'Cập nhật câu chuyện thành công');
        setIsStoryModalOpen(false);
        setEditingStory(null);
        fetchData();
        refreshData();
        broadcastCmsSync('stories-team');
      } else {
        showToast('error', json.error || 'Lỗi lưu câu chuyện');
      }
    } catch {
      showToast('error', 'Lỗi kết nối khi lưu câu chuyện');
    } finally {
      setStorySubmitting(false);
    }
  };

  const handleDeleteStory = async (id: string, title: string) => {
    if (!confirm(`Bạn có chắc muốn xoá câu chuyện "${title}"?`)) return;
    try {
      const res = await fetch(`/api/stories?id=${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (res.ok && json.success) {
        showToast('success', 'Đã xoá câu chuyện');
        fetchData();
        refreshData();
        broadcastCmsSync('stories-team');
      } else {
        showToast('error', json.error || 'Lỗi xoá câu chuyện');
      }
    } catch {
      showToast('error', 'Lỗi kết nối');
    }
  };

  const handleSaveMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMember?.name || !editingMember?.role || !editingMember?.bio) {
      showToast('error', 'Vui lòng điền đủ Họ tên, Vai trò và Giới thiệu');
      return;
    }

    setTeamSubmitting(true);
    try {
      const isNew = !editingMember.id;
      const method = isNew ? 'POST' : 'PUT';
      const res = await fetch('/api/team', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingMember),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        showToast('success', isNew ? 'Thêm thành viên thành công' : 'Cập nhật thành viên thành công');
        setIsTeamModalOpen(false);
        setEditingMember(null);
        fetchData();
        refreshData();
        broadcastCmsSync('stories-team');
      } else {
        showToast('error', json.error || 'Lỗi lưu thành viên');
      }
    } catch {
      showToast('error', 'Lỗi kết nối khi lưu');
    } finally {
      setTeamSubmitting(false);
    }
  };

  const handleDeleteMember = async (id: string, name: string) => {
    if (!confirm(`Bạn có chắc muốn xoá thành viên "${name}"?`)) return;
    try {
      const res = await fetch(`/api/team?id=${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (res.ok && json.success) {
        showToast('success', 'Đã xoá thành viên');
        fetchData();
        refreshData();
        broadcastCmsSync('stories-team');
      } else {
        showToast('error', json.error || 'Lỗi xoá');
      }
    } catch {
      showToast('error', 'Lỗi kết nối');
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {toast && (
        <div
          className={`fixed top-16 right-6 z-50 p-4 rounded-xl shadow-lg border flex items-center gap-3 ${
            toast.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-red-50 border-red-200 text-red-800'
          }`}
        >
          {toast.type === 'success' ? <CheckCircle2 className="w-5 h-5 text-emerald-600" /> : <AlertCircle className="w-5 h-5 text-red-600" />}
          <span className="text-xs font-mono">{toast.message}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="text-[11px] font-mono uppercase tracking-wider text-emerald-700 font-bold mb-1 flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            <span>MODULE 1: QUẢN LÝ NỘI DUNG CMS</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-slate-900">
            Câu Chuyện Nổi Bật & Đội Ngũ Nhân Sự
          </h2>
          <p className="text-xs text-slate-500 font-mono mt-1">
            Hiển thị trực tiếp tại trang Giới thiệu (/gioi-thieu) và Khách hàng (/khach-hang).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setTab('stories')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                tab === 'stories' ? 'bg-white shadow text-emerald-800 font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Câu chuyện ({stories.length})
            </button>
            <button
              onClick={() => setTab('team')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                tab === 'team' ? 'bg-white shadow text-emerald-800 font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Đội ngũ ({team.length})
            </button>
          </div>

          <button
            onClick={fetchData}
            className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-colors"
            title="Làm mới"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          {tab === 'stories' ? (
            <button
              onClick={() => {
                setEditingStory({
                  title: '',
                  titleEn: '',
                  category: 'Không gian',
                  categoryEn: 'Space',
                  date: '2024 - Nay',
                  dateEn: '2024 - Present',
                  summary: '',
                  summaryEn: '',
                  content: '',
                  contentEn: '',
                  imageUrl: '',
                  badge: 'Cột mốc',
                  badgeEn: 'Milestone',
                  orderIndex: stories.length,
                  published: true,
                });
                setIsStoryModalOpen(true);
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-mono font-semibold hover:bg-emerald-700 transition-all shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm Câu Chuyện</span>
            </button>
          ) : (
            <button
              onClick={() => {
                setEditingMember({
                  name: '',
                  nameEn: '',
                  role: '',
                  roleEn: '',
                  bio: '',
                  bioEn: '',
                  avatarUrl: '',
                  orderIndex: team.length,
                  active: true,
                });
                setIsTeamModalOpen(true);
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-mono font-semibold hover:bg-emerald-700 transition-all shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm Thành Viên</span>
            </button>
          )}
        </div>
      </div>

      {/* Stories Tab */}
      {tab === 'stories' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-mono uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Thứ tự</th>
                  <th className="py-3 px-4">Tiêu đề & Phân loại</th>
                  <th className="py-3 px-4">Tóm tắt</th>
                  <th className="py-3 px-4">Thời gian / Badge</th>
                  <th className="py-3 px-4">Trạng thái</th>
                  <th className="py-3 px-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {stories.map((s, idx) => (
                  <tr key={s.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-500">{s.orderIndex ?? idx}</td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900">{s.title}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{s.category} {s.titleEn ? `| ${s.titleEn}` : ''}</div>
                    </td>
                    <td className="py-3.5 px-4 max-w-xs text-slate-600 line-clamp-2">{s.summary}</td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-600">
                      <div>{s.date}</div>
                      {s.badge && <span className="inline-block mt-0.5 px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded text-[10px]">{s.badge}</span>}
                    </td>
                    <td className="py-3.5 px-4">
                      {s.published ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700 font-mono text-[11px]">
                          <span className="w-2 h-2 rounded-full bg-emerald-500" />
                          <span>Xuất bản</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-slate-400 font-mono text-[11px]">
                          <span className="w-2 h-2 rounded-full bg-slate-300" />
                          <span>Ẩn</span>
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            setEditingStory(s);
                            setIsStoryModalOpen(true);
                          }}
                          className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
                          title="Sửa"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteStory(s.id, s.title)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Xoá"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Team Tab */}
      {tab === 'team' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-mono uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Thứ tự</th>
                  <th className="py-3 px-4">Ảnh & Họ tên</th>
                  <th className="py-3 px-4">Vai trò / Chức danh</th>
                  <th className="py-3 px-4">Giới thiệu ngắn</th>
                  <th className="py-3 px-4">Trạng thái</th>
                  <th className="py-3 px-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {team.map((m, idx) => (
                  <tr key={m.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-500">{m.orderIndex ?? idx}</td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        {m.avatarUrl ? (
                          <img src={m.avatarUrl} alt={m.name} className="w-10 h-10 rounded-full object-cover border border-slate-200" />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm">
                            {m.name.charAt(0)}
                          </div>
                        )}
                        <div>
                          <div className="font-semibold text-slate-900">{m.name}</div>
                          {m.nameEn && <div className="text-[10px] text-slate-400 font-mono">{m.nameEn}</div>}
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-mono text-emerald-700 font-medium">{m.role}</div>
                      {m.roleEn && <div className="text-[10px] text-slate-400 font-mono">{m.roleEn}</div>}
                    </td>
                    <td className="py-3.5 px-4 max-w-md text-slate-600 line-clamp-2">{m.bio}</td>
                    <td className="py-3.5 px-4">
                      {m.active ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700 font-mono text-[11px]">
                          <span className="w-2 h-2 rounded-full bg-emerald-500" />
                          <span>Hiển thị</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-slate-400 font-mono text-[11px]">
                          <span className="w-2 h-2 rounded-full bg-slate-300" />
                          <span>Ẩn</span>
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            setEditingMember(m);
                            setIsTeamModalOpen(true);
                          }}
                          className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
                          title="Sửa"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteMember(m.id, m.name)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Xoá"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Story Modal */}
      {isStoryModalOpen && editingStory && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200">
            <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="font-serif font-bold text-lg">
                {editingStory.id ? 'Chỉnh Sửa Câu Chuyện Cột Mốc' : 'Thêm Câu Chuyện Cột Mốc Mới'}
              </h3>
              <button onClick={() => setIsStoryModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStory} className="p-6 overflow-y-auto space-y-4 text-xs font-mono flex-1">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-500 mb-1 font-medium">Tiêu đề (VI) *</label>
                  <input
                    type="text"
                    value={editingStory.title || ''}
                    onChange={(e) => setEditingStory({ ...editingStory, title: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-500 mb-1 font-medium">Tiêu đề (EN)</label>
                  <input
                    type="text"
                    value={editingStory.titleEn || ''}
                    onChange={(e) => setEditingStory({ ...editingStory, titleEn: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-slate-500 mb-1 font-medium">Phân loại (VI)</label>
                  <input
                    type="text"
                    value={editingStory.category || ''}
                    onChange={(e) => setEditingStory({ ...editingStory, category: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 mb-1 font-medium">Thời gian (VI)</label>
                  <input
                    type="text"
                    value={editingStory.date || ''}
                    onChange={(e) => setEditingStory({ ...editingStory, date: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 mb-1 font-medium">Badge nhãn</label>
                  <input
                    type="text"
                    value={editingStory.badge || ''}
                    onChange={(e) => setEditingStory({ ...editingStory, badge: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-500 mb-1 font-medium">Tóm tắt ngắn (VI) *</label>
                <textarea
                  rows={2}
                  value={editingStory.summary || ''}
                  onChange={(e) => setEditingStory({ ...editingStory, summary: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-500 mb-1 font-medium">Nội dung chi tiết (VI) *</label>
                <textarea
                  rows={4}
                  value={editingStory.content || ''}
                  onChange={(e) => setEditingStory({ ...editingStory, content: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-500 mb-1 font-medium">Ảnh minh hoạ</label>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={editingStory.imageUrl || ''}
                    onChange={(e) => setEditingStory({ ...editingStory, imageUrl: e.target.value })}
                    placeholder="/uploads/events/... hoặc URL ảnh"
                    className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                  <label className="cursor-pointer px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs flex items-center gap-1.5 transition-colors">
                    <Upload className="w-4 h-4 text-slate-600" />
                    <span>{uploadingImage ? 'Đang tải...' : 'Tải từ PC'}</span>
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, 'story')} />
                  </label>
                </div>
              </div>

              <div className="flex items-center gap-4 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingStory.published ?? true}
                    onChange={(e) => setEditingStory({ ...editingStory, published: e.target.checked })}
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>Xuất bản trên trang web</span>
                </label>
              </div>

              <div className="pt-4 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsStoryModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-100"
                >
                  Huỷ
                </button>
                <button
                  type="submit"
                  disabled={storySubmitting}
                  className="px-5 py-2 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 flex items-center gap-1.5"
                >
                  {storySubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>Lưu Câu Chuyện</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Team Modal */}
      {isTeamModalOpen && editingMember && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200">
            <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="font-serif font-bold text-lg">
                {editingMember.id ? 'Chỉnh Sửa Thành Viên Đội Ngũ' : 'Thêm Thành Viên Đội Ngũ Mới'}
              </h3>
              <button onClick={() => setIsTeamModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMember} className="p-6 overflow-y-auto space-y-4 text-xs font-mono flex-1">
              <div>
                <label className="block text-slate-500 mb-1 font-medium">Họ và tên *</label>
                <input
                  type="text"
                  value={editingMember.name || ''}
                  onChange={(e) => setEditingMember({ ...editingMember, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-500 mb-1 font-medium">Vai trò / Chức vụ (VI) *</label>
                <input
                  type="text"
                  value={editingMember.role || ''}
                  onChange={(e) => setEditingMember({ ...editingMember, role: e.target.value })}
                  placeholder="Ví dụ: Giám đốc sáng lập & Vận hành"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-500 mb-1 font-medium">Giới thiệu ngắn (VI) *</label>
                <textarea
                  rows={3}
                  value={editingMember.bio || ''}
                  onChange={(e) => setEditingMember({ ...editingMember, bio: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-500 mb-1 font-medium">Ảnh đại diện</label>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={editingMember.avatarUrl || ''}
                    onChange={(e) => setEditingMember({ ...editingMember, avatarUrl: e.target.value })}
                    placeholder="/uploads/brand/... hoặc URL ảnh"
                    className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                  <label className="cursor-pointer px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs flex items-center gap-1.5 transition-colors">
                    <Upload className="w-4 h-4 text-slate-600" />
                    <span>{uploadingImage ? 'Đang tải...' : 'Tải từ PC'}</span>
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, 'team')} />
                  </label>
                </div>
              </div>

              <div className="flex items-center gap-4 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingMember.active ?? true}
                    onChange={(e) => setEditingMember({ ...editingMember, active: e.target.checked })}
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>Đang hoạt động / Hiển thị công khai</span>
                </label>
              </div>

              <div className="pt-4 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsTeamModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-100"
                >
                  Huỷ
                </button>
                <button
                  type="submit"
                  disabled={teamSubmitting}
                  className="px-5 py-2 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 flex items-center gap-1.5"
                >
                  {teamSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>Lưu Thành Viên</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

