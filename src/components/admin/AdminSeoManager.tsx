'use client';

import React, { useState, useEffect } from 'react';
import {
  Search,
  Globe,
  ArrowRightLeft,
  FileCode,
  ExternalLink,
  Save,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Loader2,
  RefreshCw,
  Eye,
  Shield,
} from 'lucide-react';
import { PageSeo, RedirectRule } from '@/types';

export default function AdminSeoManager() {
  const [tab, setTab] = useState<'seo' | 'redirects' | 'sitemap'>('seo');
  const [seoList, setSeoList] = useState<PageSeo[]>([]);
  const [redirects, setRedirects] = useState<RedirectRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Selected SEO Route state
  const [selectedRoute, setSelectedRoute] = useState<string>('/');
  const [seoForm, setSeoForm] = useState<Partial<PageSeo>>({});
  const [savingSeo, setSavingSeo] = useState(false);

  // New Redirect Form state
  const [isRedirectModalOpen, setIsRedirectModalOpen] = useState(false);
  const [newSource, setNewSource] = useState('');
  const [newTarget, setNewTarget] = useState('');
  const [newStatus, setNewStatus] = useState<number>(301);
  const [redirectSubmitting, setRedirectSubmitting] = useState(false);

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const [seoRes, redRes] = await Promise.all([
        fetch('/api/seo'),
        fetch('/api/redirects'),
      ]);
      const seoJson = await seoRes.json();
      const redJson = await redRes.json();

      if (seoJson.success) {
        setSeoList(seoJson.data || []);
        const found = seoJson.data?.find((s: PageSeo) => s.route === selectedRoute);
        if (found) setSeoForm(found);
      }
      if (redJson.success) setRedirects(redJson.data || []);
    } catch {
      showToast('error', 'Lỗi khi tải dữ liệu SEO');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSelectRoute = (route: string) => {
    setSelectedRoute(route);
    const found = seoList.find((s) => s.route === route);
    if (found) {
      setSeoForm(found);
    } else {
      setSeoForm({
        route,
        metaTitleVi: '',
        metaDescVi: '',
        h1Vi: '',
        noIndex: false,
      });
    }
  };

  const handleSaveSeo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!seoForm.metaTitleVi || !seoForm.metaDescVi) {
      showToast('error', 'Tiêu đề SEO và Mô tả SEO (VI) không được để trống');
      return;
    }

    setSavingSeo(true);
    try {
      const res = await fetch('/api/seo', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...seoForm, route: selectedRoute }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        showToast('success', `Đã lưu cấu hình SEO cho route ${selectedRoute}`);
        fetchData();
      } else {
        showToast('error', json.error || 'Lỗi lưu SEO');
      }
    } catch {
      showToast('error', 'Lỗi kết nối khi lưu');
    } finally {
      setSavingSeo(false);
    }
  };

  const handleCreateRedirect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSource || !newTarget) {
      showToast('error', 'Vui lòng nhập đường dẫn nguồn và đích');
      return;
    }

    setRedirectSubmitting(true);
    try {
      const res = await fetch('/api/redirects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sourcePath: newSource,
          targetPath: newTarget,
          statusCode: newStatus,
          isActive: true,
        }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        showToast('success', 'Thêm quy tắc điều hướng thành công');
        setIsRedirectModalOpen(false);
        setNewSource('');
        setNewTarget('');
        fetchData();
      } else {
        showToast('error', json.error || 'Lỗi thêm điều hướng');
      }
    } catch {
      showToast('error', 'Lỗi kết nối khi thêm');
    } finally {
      setRedirectSubmitting(false);
    }
  };

  const handleDeleteRedirect = async (id: string, source: string) => {
    if (!confirm(`Bạn có chắc muốn xoá quy tắc điều hướng cho "${source}"?`)) return;
    try {
      const res = await fetch(`/api/redirects?id=${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (res.ok && json.success) {
        showToast('success', 'Đã xoá quy tắc điều hướng');
        fetchData();
      } else {
        showToast('error', json.error || 'Lỗi xoá');
      }
    } catch {
      showToast('error', 'Lỗi kết nối');
    }
  };

  const titleLength = seoForm.metaTitleVi?.length || 0;
  const descLength = seoForm.metaDescVi?.length || 0;

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
            <Search className="w-4 h-4" />
            <span>MODULE 2: QUẢN LÝ SEO & ĐIỀU HƯỚNG URL</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-slate-900">
            Tối Ưu SEO Google & Điều Hướng 301/302
          </h2>
          <p className="text-xs text-slate-500 font-mono mt-1">
            Mô phỏng giao diện Google SERP trực quan, kiểm soát H1, Meta Tags và cấu hình điều hướng vĩnh viễn.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setTab('seo')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                tab === 'seo' ? 'bg-white shadow text-emerald-800 font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              SEO Trang ({seoList.length})
            </button>
            <button
              onClick={() => setTab('redirects')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                tab === 'redirects' ? 'bg-white shadow text-emerald-800 font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Điều hướng ({redirects.length})
            </button>
            <button
              onClick={() => setTab('sitemap')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                tab === 'sitemap' ? 'bg-white shadow text-emerald-800 font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Sitemap & Robots
            </button>
          </div>

          <button
            onClick={fetchData}
            className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-colors"
            title="Làm mới"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* SEO TAB */}
      {tab === 'seo' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Route selector sidebar */}
          <div className="lg:col-span-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 px-2 py-1">
              Chọn Route Để Cấu Hình
            </div>
            {[
              { route: '/', label: 'Trang chủ (0: /)' },
              { route: '/gioi-thieu', label: 'Giới thiệu (1: /gioi-thieu)' },
              { route: '/khong-gian', label: 'Không gian (2: /khong-gian)' },
              { route: '/thuc-don', label: 'Thực đơn (3: /thuc-don)' },
              { route: '/khach-hang', label: 'Dấu ấn & Đánh giá (4: /khach-hang)' },
              { route: '/su-kien', label: 'Tin tức & FAQ (5: /su-kien)' },
              { route: '/lien-he', label: 'Liên hệ & Chỉ đường (6: /lien-he)' },
            ].map((r) => {
              const active = selectedRoute === r.route;
              return (
                <button
                  key={r.route}
                  onClick={() => handleSelectRoute(r.route)}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-mono transition-all flex items-center justify-between ${
                    active
                      ? 'bg-emerald-600 text-white font-bold shadow-sm'
                      : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <span>{r.label}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-md ${active ? 'bg-emerald-700 text-emerald-100' : 'bg-slate-100 text-slate-500'}`}>
                    {r.route}
                  </span>
                </button>
              );
            })}
          </div>

          {/* SERP Preview & Edit Form */}
          <div className="lg:col-span-8 space-y-6">
            {/* Live Google SERP Preview Card */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                <Globe className="w-4 h-4 text-emerald-600" />
                <span>Mô Phỏng Trực Quan Kết Quả Tìm Kiếm Google SERP</span>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 max-w-xl font-sans">
                <div className="flex items-center gap-2 text-xs text-slate-600 mb-1">
                  <span className="w-4 h-4 rounded-full bg-emerald-700 flex items-center justify-center text-[8px] text-white font-serif">
                    C
                  </span>
                  <span className="truncate">https://camcuhouse.com{selectedRoute}</span>
                </div>
                <h3 className="text-blue-700 text-base font-medium hover:underline cursor-pointer line-clamp-1">
                  {seoForm.metaTitleVi || 'Cẩm Cù House | Không Gian Cà Phê & Cẩm Cù Ven Suối'}
                </h3>
                <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                  {seoForm.metaDescVi ||
                    'Quán cà phê cẩm cù ven suối tại Gia Lai. Trải nghiệm không gian mộc mạc bên bờ suối róc rách, thưởng thức cà phê rang mộc và đồ uống thảo mộc tự nhiên.'}
                </p>
              </div>
            </div>

            {/* SEO Form */}
            <form onSubmit={handleSaveSeo} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 text-xs font-mono">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="font-bold text-sm text-slate-900 font-serif">
                  Cấu Hình SEO Cho: <span className="text-emerald-700 font-mono">{selectedRoute}</span>
                </div>
                <button
                  type="submit"
                  disabled={savingSeo}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 flex items-center gap-1.5 transition-all shadow-sm"
                >
                  {savingSeo ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>Lưu Cấu Hình</span>
                </button>
              </div>

              {/* Meta Title */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-slate-600 font-medium">Meta Title (Tiêu đề Google VI) *</label>
                  <span className={`text-[10px] ${titleLength > 60 ? 'text-amber-600 font-bold' : 'text-slate-400'}`}>
                    {titleLength} / 60 ký tự khuyến nghị
                  </span>
                </div>
                <input
                  type="text"
                  value={seoForm.metaTitleVi || ''}
                  onChange={(e) => setSeoForm({ ...seoForm, metaTitleVi: e.target.value })}
                  placeholder="Ví dụ: Giới Thiệu Cẩm Cù House — Cội Nguồn & Triết Lý Không Gian"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  required
                />
              </div>

              {/* Meta Desc */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-slate-600 font-medium">Meta Description (Mô tả Google VI) *</label>
                  <span className={`text-[10px] ${descLength > 160 ? 'text-amber-600 font-bold' : 'text-slate-400'}`}>
                    {descLength} / 160 ký tự khuyến nghị
                  </span>
                </div>
                <textarea
                  rows={3}
                  value={seoForm.metaDescVi || ''}
                  onChange={(e) => setSeoForm({ ...seoForm, metaDescVi: e.target.value })}
                  placeholder="Mô tả tóm tắt trang web hiển thị trên công cụ tìm kiếm..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-sans"
                  required
                />
              </div>

              {/* H1 Tag */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-600 mb-1 font-medium">Thẻ Tiêu Đề H1 (VI)</label>
                  <input
                    type="text"
                    value={seoForm.h1Vi || ''}
                    onChange={(e) => setSeoForm({ ...seoForm, h1Vi: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1 font-medium">Canonical URL (Nếu có)</label>
                  <input
                    type="text"
                    value={seoForm.canonicalUrl || ''}
                    onChange={(e) => setSeoForm({ ...seoForm, canonicalUrl: e.target.value })}
                    placeholder="https://camcuhouse.com/..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              {/* OG Image */}
              <div>
                <label className="block text-slate-600 mb-1 font-medium">Open Graph Image (Ảnh chia sẻ mạng xã hội)</label>
                <input
                  type="text"
                  value={seoForm.ogImage || ''}
                  onChange={(e) => setSeoForm({ ...seoForm, ogImage: e.target.value })}
                  placeholder="/uploads/brand/og-share.jpg"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={seoForm.noIndex ?? false}
                    onChange={(e) => setSeoForm({ ...seoForm, noIndex: e.target.checked })}
                    className="rounded text-red-600 focus:ring-red-500"
                  />
                  <span className="text-red-700 font-semibold">Chặn Google lập chỉ mục (noIndex / noFollow)</span>
                </label>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* REDIRECTS TAB */}
      {tab === 'redirects' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 sm:p-6 flex items-center justify-between border-b border-slate-100">
            <div>
              <h3 className="font-serif font-bold text-lg text-slate-900">Danh Sách Quy Tắc Điều Hướng (301/302)</h3>
              <p className="text-xs text-slate-500 font-mono">Tự động chuyển tiếp link cũ sang trang mới mà không làm mất thứ hạng SEO.</p>
            </div>
            <button
              onClick={() => setIsRedirectModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-mono font-semibold hover:bg-emerald-700 transition-all shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm Quy Tắc</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Đường dẫn nguồn</th>
                  <th className="py-3 px-4">Đường dẫn đích</th>
                  <th className="py-3 px-4">Mã HTTP</th>
                  <th className="py-3 px-4">Lượt chuyển tiếp</th>
                  <th className="py-3 px-4">Trạng thái</th>
                  <th className="py-3 px-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {redirects.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-800">{r.sourcePath}</td>
                    <td className="py-3.5 px-4 text-emerald-700 font-semibold">{r.targetPath}</td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${r.statusCode === 301 ? 'bg-blue-50 text-blue-700' : 'bg-amber-50 text-amber-700'}`}>
                        {r.statusCode} {r.statusCode === 301 ? 'Permanent' : 'Temporary'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">{r.hitCount} lượt</td>
                    <td className="py-3.5 px-4">
                      {r.isActive ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700 text-[11px]">
                          <span className="w-2 h-2 rounded-full bg-emerald-500" />
                          <span>Đang áp dụng</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-slate-400 text-[11px]">
                          <span className="w-2 h-2 rounded-full bg-slate-300" />
                          <span>Vô hiệu</span>
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleDeleteRedirect(r.id, r.sourcePath)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Xoá"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SITEMAP & ROBOTS TAB */}
      {tab === 'sitemap' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl">
                <FileCode className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-lg text-slate-900">Sitemap XML Động</h3>
                <span className="text-xs font-mono text-emerald-700 font-semibold">/sitemap.xml</span>
              </div>
            </div>
            <p className="text-xs text-slate-600 font-mono leading-relaxed">
              Tự động thu thập 6 routes chính, các bài viết sự kiện và tất cả trang pháp lý động (/p/[slug]) với chuẩn XML của Google.
            </p>
            <a
              href="/sitemap.xml"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-mono hover:bg-slate-800 transition-colors"
            >
              <span>Xem Live Sitemap XML</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-sky-50 text-sky-700 rounded-xl">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-lg text-slate-900">Robots.txt Chuẩn SEO</h3>
                <span className="text-xs font-mono text-sky-700 font-semibold">/robots.txt</span>
              </div>
            </div>
            <p className="text-xs text-slate-600 font-mono leading-relaxed">
              Cho phép bot Google / Bing crawl các trang công khai, chặn crawl toàn bộ phân vùng bí mật /admin và trỏ trực tiếp đến sitemap.
            </p>
            <a
              href="/robots.txt"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-mono hover:bg-slate-800 transition-colors"
            >
              <span>Xem Live Robots.txt</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      )}

      {/* Redirect Modal */}
      {isRedirectModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden border border-slate-200">
            <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="font-serif font-bold text-lg">Thêm Quy Tắc Điều Hướng Mới</h3>
              <button onClick={() => setIsRedirectModalOpen(false)} className="text-slate-400 hover:text-white">
                <Trash2 className="w-5 h-5 hidden" />
                <span>✕</span>
              </button>
            </div>

            <form onSubmit={handleCreateRedirect} className="p-6 space-y-4 text-xs font-mono">
              <div>
                <label className="block text-slate-500 mb-1 font-medium">Đường dẫn nguồn (Source Path) *</label>
                <input
                  type="text"
                  value={newSource}
                  onChange={(e) => setNewSource(e.target.value)}
                  placeholder="/khong-gian"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-500 mb-1 font-medium">Đường dẫn đích (Target Path) *</label>
                <input
                  type="text"
                  value={newTarget}
                  onChange={(e) => setNewTarget(e.target.value)}
                  placeholder="/gioi-thieu"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-500 mb-1 font-medium">Mã chuyển tiếp (Status Code)</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                >
                  <option value={301}>301 — Permanent Redirect (Khuyến nghị cho SEO)</option>
                  <option value={302}>302 — Temporary Redirect (Tạm thời)</option>
                </select>
              </div>

              <div className="pt-4 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsRedirectModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-100"
                >
                  Huỷ
                </button>
                <button
                  type="submit"
                  disabled={redirectSubmitting}
                  className="px-5 py-2 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 flex items-center gap-1.5"
                >
                  {redirectSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>Thêm Quy Tắc</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

