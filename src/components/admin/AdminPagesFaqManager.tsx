'use client';

import React, { useState, useEffect } from 'react';
import {
  FileText,
  HelpCircle,
  Plus,
  Trash2,
  Edit2,
  Save,
  X,
  RefreshCw,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { StaticPage, FaqItem } from '@/types';
import { useApp } from '@/context/AppContext';
import { broadcastCmsSync } from '@/lib/cms-sync';

export default function AdminPagesFaqManager() {
  const { refreshData } = useApp();
  const [tab, setTab] = useState<'pages' | 'faq'>('pages');
  const [pages, setPages] = useState<StaticPage[]>([]);
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Page Form State
  const [editingPage, setEditingPage] = useState<Partial<StaticPage> | null>(null);
  const [isPageModalOpen, setIsPageModalOpen] = useState(false);
  const [pageSubmitting, setPageSubmitting] = useState(false);

  // FAQ Form State
  const [editingFaq, setEditingFaq] = useState<Partial<FaqItem> | null>(null);
  const [isFaqModalOpen, setIsFaqModalOpen] = useState(false);
  const [faqSubmitting, setFaqSubmitting] = useState(false);

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const [pagesRes, faqsRes] = await Promise.all([
        fetch('/api/pages'),
        fetch('/api/faq'),
      ]);
      const pagesJson = await pagesRes.json();
      const faqsJson = await faqsRes.json();

      if (pagesJson.success) setPages(pagesJson.data || []);
      if (faqsJson.success) setFaqs(faqsJson.data || []);
    } catch {
      showToast('error', 'Lỗi khi tải trang tĩnh & FAQ');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSavePage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPage?.slug || !editingPage?.title || !editingPage?.content) {
      showToast('error', 'Vui lòng điền đủ Đường dẫn (Slug), Tiêu đề và Nội dung bài viết');
      return;
    }

    setPageSubmitting(true);
    try {
      const isNew = !editingPage.id;
      const method = isNew ? 'POST' : 'PUT';
      const res = await fetch('/api/pages', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingPage),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        showToast('success', isNew ? 'Thêm trang tĩnh thành công' : 'Cập nhật trang tĩnh thành công');
        setIsPageModalOpen(false);
        setEditingPage(null);
        fetchData();
        refreshData();
        broadcastCmsSync('pages-faq');
      } else {
        showToast('error', json.error || 'Lỗi lưu trang');
      }
    } catch {
      showToast('error', 'Lỗi kết nối khi lưu trang');
    } finally {
      setPageSubmitting(false);
    }
  };

  const handleDeletePage = async (id: string, slug: string) => {
    if (!confirm(`Bạn có chắc muốn xoá trang "${slug}"?`)) return;
    try {
      const res = await fetch(`/api/pages?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok && json.success) {
        // Immediately remove item from local React state (no stale UI)
        setPages((prev) => prev.filter((p) => p.id !== id));
        showToast('success', `Đã xoá trang tĩnh "${slug}" thành công`);
        fetchData();
        refreshData();
        broadcastCmsSync('pages-faq');
      } else {
        showToast('error', json.error || 'Lỗi xoá trang tĩnh');
      }
    } catch {
      showToast('error', 'Lỗi kết nối máy chủ khi xoá trang tĩnh');
    }
  };

  const handleSaveFaq = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFaq?.question || !editingFaq?.answer) {
      showToast('error', 'Vui lòng điền đủ Câu hỏi và Câu trả lời');
      return;
    }

    setFaqSubmitting(true);
    try {
      const isNew = !editingFaq.id;
      const method = isNew ? 'POST' : 'PUT';
      const res = await fetch('/api/faq', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingFaq),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        showToast('success', isNew ? 'Thêm câu hỏi FAQ thành công' : 'Cập nhật FAQ thành công');
        setIsFaqModalOpen(false);
        setEditingFaq(null);
        fetchData();
        refreshData();
        broadcastCmsSync('pages-faq');
      } else {
        showToast('error', json.error || 'Lỗi lưu FAQ');
      }
    } catch {
      showToast('error', 'Lỗi kết nối khi lưu FAQ');
    } finally {
      setFaqSubmitting(false);
    }
  };

  const handleDeleteFaq = async (id: string, question: string) => {
    if (!confirm(`Bạn có chắc muốn xoá câu hỏi "${question.slice(0, 30)}..."?`)) return;
    try {
      const res = await fetch(`/api/faq?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok && json.success) {
        // Immediately remove item from local React state (no stale UI)
        setFaqs((prev) => prev.filter((f) => f.id !== id));
        showToast('success', 'Đã xoá câu hỏi FAQ thành công');
        fetchData();
        refreshData();
        broadcastCmsSync('pages-faq');
      } else {
        showToast('error', json.error || 'Lỗi xoá câu hỏi FAQ');
      }
    } catch {
      showToast('error', 'Lỗi kết nối máy chủ khi xoá FAQ');
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

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="text-[11px] font-mono uppercase tracking-wider text-emerald-700 font-bold mb-1 flex items-center gap-2">
            <FileText className="w-4 h-4" />
            <span>MODULE 1: QUẢN LÝ NỘI DUNG CMS</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-slate-900">
            Trang Pháp Lý Doanh Nghiệp & Hỏi Đáp FAQ
          </h2>
          <p className="text-xs text-slate-500 font-mono mt-1">
            Quản lý các trang tĩnh (/p/[slug]) và bộ câu hỏi thường gặp tại trang Sự kiện & Tin tức (/su-kien).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setTab('pages')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                tab === 'pages' ? 'bg-white shadow text-emerald-800 font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Trang tĩnh ({pages.length})
            </button>
            <button
              onClick={() => setTab('faq')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                tab === 'faq' ? 'bg-white shadow text-emerald-800 font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Hỏi đáp FAQ ({faqs.length})
            </button>
          </div>

          <button
            onClick={fetchData}
            className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-colors"
            title="Làm mới"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          {tab === 'pages' ? (
            <button
              onClick={() => {
                setEditingPage({
                  slug: '',
                  title: '',
                  titleEn: '',
                  content: '',
                  contentEn: '',
                  metaTitle: '',
                  metaDescription: '',
                  published: true,
                });
                setIsPageModalOpen(true);
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-mono font-semibold hover:bg-emerald-700 transition-all shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm Trang Mới</span>
            </button>
          ) : (
            <button
              onClick={() => {
                setEditingFaq({
                  question: '',
                  questionEn: '',
                  answer: '',
                  answerEn: '',
                  category: 'Không gian',
                  categoryEn: 'Space',
                  orderIndex: faqs.length,
                  published: true,
                });
                setIsFaqModalOpen(true);
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-mono font-semibold hover:bg-emerald-700 transition-all shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm Câu Hỏi FAQ</span>
            </button>
          )}
        </div>
      </div>

      {/* Pages Tab */}
      {tab === 'pages' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-mono uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Đường dẫn (Slug)</th>
                  <th className="py-3 px-4">Tiêu đề trang</th>
                  <th className="py-3 px-4">Độ dài nội dung</th>
                  <th className="py-3 px-4">Trạng thái</th>
                  <th className="py-3 px-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {pages.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-semibold text-emerald-700">
                      <a href={`/p/${p.slug}`} target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center gap-1">
                        <span>/p/{p.slug}</span>
                        <ExternalLink className="w-3 h-3 text-slate-400" />
                      </a>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900">{p.title}</div>
                      {p.titleEn && <div className="text-[10px] text-slate-400 font-mono">{p.titleEn}</div>}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500">{p.content.length} ký tự</td>
                    <td className="py-3.5 px-4">
                      {p.published ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700 font-mono text-[11px]">
                          <span className="w-2 h-2 rounded-full bg-emerald-500" />
                          <span>Xuất bản</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-slate-400 font-mono text-[11px]">
                          <span className="w-2 h-2 rounded-full bg-slate-300" />
                          <span>Bản nháp</span>
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            setEditingPage(p);
                            setIsPageModalOpen(true);
                          }}
                          className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
                          title="Sửa"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeletePage(p.id, p.slug)}
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

      {/* FAQ Tab */}
      {tab === 'faq' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-mono uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Thứ tự</th>
                  <th className="py-3 px-4">Phân loại</th>
                  <th className="py-3 px-4">Câu hỏi</th>
                  <th className="py-3 px-4">Câu trả lời</th>
                  <th className="py-3 px-4">Trạng thái</th>
                  <th className="py-3 px-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {faqs.map((f, idx) => (
                  <tr key={f.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-500">{f.orderIndex ?? idx}</td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-emerald-700 font-semibold">{f.category}</td>
                    <td className="py-3.5 px-4 max-w-xs font-medium text-slate-900">{f.question}</td>
                    <td className="py-3.5 px-4 max-w-sm text-slate-600 line-clamp-2">{f.answer}</td>
                    <td className="py-3.5 px-4">
                      {f.published ? (
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
                            setEditingFaq(f);
                            setIsFaqModalOpen(true);
                          }}
                          className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
                          title="Sửa"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteFaq(f.id, f.question)}
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

      {/* Page Modal */}
      {isPageModalOpen && editingPage && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200">
            <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="font-serif font-bold text-lg">
                {editingPage.id ? 'Chỉnh Sửa Trang Tĩnh' : 'Thêm Trang Tĩnh Mới'}
              </h3>
              <button onClick={() => setIsPageModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePage} className="p-6 overflow-y-auto space-y-4 text-xs font-mono flex-1">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-500 mb-1 font-medium">Đường dẫn (Slug) *</label>
                  <div className="flex items-center">
                    <span className="px-3 py-2 bg-slate-100 border border-r-0 border-slate-200 rounded-l-xl text-slate-500">/p/</span>
                    <input
                      type="text"
                      value={editingPage.slug || ''}
                      onChange={(e) => setEditingPage({ ...editingPage, slug: e.target.value })}
                      placeholder="chinh-sach-bao-mat"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-r-xl"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-slate-500 mb-1 font-medium">Tiêu đề trang (VI) *</label>
                  <input
                    type="text"
                    value={editingPage.title || ''}
                    onChange={(e) => setEditingPage({ ...editingPage, title: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-500 mb-1 font-medium">Nội dung bài viết (VI) * (Hỗ trợ Markdown: ## Mục lớn, - gạch đầu dòng)</label>
                <textarea
                  rows={8}
                  value={editingPage.content || ''}
                  onChange={(e) => setEditingPage({ ...editingPage, content: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-sans"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-500 mb-1 font-medium">Meta Title (SEO)</label>
                  <input
                    type="text"
                    value={editingPage.metaTitle || ''}
                    onChange={(e) => setEditingPage({ ...editingPage, metaTitle: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 mb-1 font-medium">Meta Description (SEO)</label>
                  <input
                    type="text"
                    value={editingPage.metaDescription || ''}
                    onChange={(e) => setEditingPage({ ...editingPage, metaDescription: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingPage.published ?? true}
                    onChange={(e) => setEditingPage({ ...editingPage, published: e.target.checked })}
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>Xuất bản công khai trang này</span>
                </label>
              </div>

              <div className="pt-4 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsPageModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-100"
                >
                  Huỷ
                </button>
                <button
                  type="submit"
                  disabled={pageSubmitting}
                  className="px-5 py-2 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 flex items-center gap-1.5"
                >
                  {pageSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>Lưu Trang</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FAQ Modal */}
      {isFaqModalOpen && editingFaq && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200">
            <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="font-serif font-bold text-lg">
                {editingFaq.id ? 'Chỉnh Sửa Câu Hỏi FAQ' : 'Thêm Câu Hỏi FAQ Mới'}
              </h3>
              <button onClick={() => setIsFaqModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveFaq} className="p-6 overflow-y-auto space-y-4 text-xs font-mono flex-1">
              <div>
                <label className="block text-slate-500 mb-1 font-medium">Phân loại danh mục *</label>
                <input
                  type="text"
                  value={editingFaq.category || ''}
                  onChange={(e) => setEditingFaq({ ...editingFaq, category: e.target.value })}
                  placeholder="Ví dụ: Không gian, Đồ uống, Di chuyển..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-500 mb-1 font-medium">Câu hỏi (VI) *</label>
                <input
                  type="text"
                  value={editingFaq.question || ''}
                  onChange={(e) => setEditingFaq({ ...editingFaq, question: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-500 mb-1 font-medium">Câu trả lời (VI) *</label>
                <textarea
                  rows={4}
                  value={editingFaq.answer || ''}
                  onChange={(e) => setEditingFaq({ ...editingFaq, answer: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  required
                />
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingFaq.published ?? true}
                    onChange={(e) => setEditingFaq({ ...editingFaq, published: e.target.checked })}
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>Hiển thị câu hỏi này trong danh sách FAQ</span>
                </label>
              </div>

              <div className="pt-4 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsFaqModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-100"
                >
                  Huỷ
                </button>
                <button
                  type="submit"
                  disabled={faqSubmitting}
                  className="px-5 py-2 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 flex items-center gap-1.5"
                >
                  {faqSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>Lưu Câu Hỏi</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

