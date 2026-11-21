'use client';

import React, { useState, useEffect } from 'react';
import {
  Cpu,
  Database,
  Shield,
  Download,
  Upload,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Layers,
  HardDrive,
  FileText,
  Clock,
  Sparkles,
  Server,
  Zap,
} from 'lucide-react';
import { SystemLog } from '@/types';

export default function AdminOpsManager() {
  const [tab, setTab] = useState<'health' | 'backup' | 'logs'>('health');
  const [healthData, setHealthData] = useState<any>(null);
  const [logs, setLogs] = useState<any[]>([]);
  const [selectedLogLevel, setSelectedLogLevel] = useState<string>('ALL');
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Backup & Restore states
  const [exportingBackup, setExportingBackup] = useState(false);
  const [restoringBackup, setRestoringBackup] = useState(false);
  const [selectedFileForRestore, setSelectedFileForRestore] = useState<any>(null);

  // Cache purge state
  const [purgingCache, setPurgingCache] = useState(false);

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchHealthAndLogs = async () => {
    try {
      setLoading(true);
      const [hRes, lRes] = await Promise.all([
        fetch('/api/ops/health', { credentials: 'include' }),
        fetch(`/api/ops/logs${selectedLogLevel !== 'ALL' ? `?level=${selectedLogLevel}` : ''}`, {
          credentials: 'include',
        }),
      ]);
      const hJson = await hRes.json();
      const lJson = await lRes.json();

      if (hJson.success) setHealthData(hJson.data);
      if (lJson.success) setLogs(lJson.data || []);
    } catch {
      showToast('error', 'Lỗi khi tải thông tin kỹ thuật & vận hành');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealthAndLogs();
  }, [selectedLogLevel]);

  const handleExportBackup = async () => {
    setExportingBackup(true);
    try {
      const res = await fetch('/api/ops/backup');
      const json = await res.json();
      if (res.ok && json.success) {
        const { filename, backupPayload } = json.data;
        const blob = new Blob([JSON.stringify(backupPayload, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        showToast('success', `Đã xuất và tải về bản sao lưu "${filename}"`);
        fetchHealthAndLogs();
      } else {
        showToast('error', json.error || 'Lỗi xuất bản sao lưu');
      }
    } catch {
      showToast('error', 'Lỗi kết nối khi xuất sao lưu');
    } finally {
      setExportingBackup(false);
    }
  };

  const handleSelectFileForRestore = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (!parsed.data) {
          showToast('error', 'File JSON không đúng cấu trúc sao lưu của Cẩm Cù House');
          return;
        }
        setSelectedFileForRestore({
          name: file.name,
          payload: parsed,
        });
      } catch {
        showToast('error', 'Không thể đọc nội dung file JSON');
      }
    };
    reader.readAsText(file);
  };

  const handleConfirmRestore = async () => {
    if (!selectedFileForRestore) return;
    const confirmPrompt = window.prompt(
      'CẢNH BÁO: Khôi phục cơ sở dữ liệu sẽ ghi đè dữ liệu hiện tại bằng dữ liệu trong file sao lưu.\nNhập chữ "KHOIPHUC" để xác nhận tiếp tục:'
    );
    if (confirmPrompt !== 'KHOIPHUC') {
      showToast('error', 'Đã huỷ thao tác khôi phục do không đúng mã xác nhận');
      return;
    }

    setRestoringBackup(true);
    try {
      const res = await fetch('/api/ops/restore', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ backupPayload: selectedFileForRestore.payload }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        showToast('success', 'Đã khôi phục cơ sở dữ liệu thành công!');
        setSelectedFileForRestore(null);
        fetchHealthAndLogs();
      } else {
        showToast('error', json.error || 'Lỗi khôi phục');
      }
    } catch {
      showToast('error', 'Lỗi kết nối khi khôi phục');
    } finally {
      setRestoringBackup(false);
    }
  };

  const handlePurgeCache = async () => {
    setPurgingCache(true);
    try {
      const res = await fetch('/api/ops/revalidate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: '/' }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        showToast('success', 'Đã làm mới toàn bộ bộ nhớ đệm (Cache) thành công');
        fetchHealthAndLogs();
      } else {
        showToast('error', json.error || 'Lỗi xoá cache');
      }
    } catch {
      showToast('error', 'Lỗi kết nối');
    } finally {
      setPurgingCache(false);
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
            <Cpu className="w-4 h-4" />
            <span>MODULE 5: KỸ THUẬT, BẢO MẬT & VẬN HÀNH</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-slate-900">
            Trung Tâm Vận Hành, Sao Lưu DB & Nhật Ký Hệ Thống
          </h2>
          <p className="text-xs text-slate-500 font-mono mt-1">
            Sao lưu 1-Click JSON DB, làm mới bộ nhớ đệm ISR, kiểm tra tài nguyên đĩa cứng và giám sát nhật ký.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setTab('health')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                tab === 'health' ? 'bg-white shadow text-emerald-800 font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Tình trạng hệ thống
            </button>
            <button
              onClick={() => setTab('backup')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                tab === 'backup' ? 'bg-white shadow text-emerald-800 font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Sao lưu & Khôi phục
            </button>
            <button
              onClick={() => setTab('logs')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                tab === 'logs' ? 'bg-white shadow text-emerald-800 font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Nhật ký ({logs.length})
            </button>
          </div>

          <button
            onClick={fetchHealthAndLogs}
            className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-colors"
            title="Làm mới"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* HEALTH TAB */}
      {tab === 'health' && loading && !healthData && (
        <div className="p-12 text-center text-slate-400 font-mono text-xs flex flex-col items-center justify-center gap-2 bg-white rounded-2xl border border-slate-200">
          <RefreshCw className="w-6 h-6 animate-spin text-emerald-600" />
          <span>Đang kiểm tra tình trạng hệ thống thời gian thực...</span>
        </div>
      )}

      {tab === 'health' && healthData && (
        <div className="space-y-6">
          {/* Main Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Database Card with Writable Status */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                <span>DUNG LƯỢNG DATABASE</span>
                <Database className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-2xl font-serif font-bold text-slate-900">
                {healthData.storage.databaseSizeFormatted}
              </div>
              <div className="flex items-center gap-1.5 text-[11px] font-mono">
                <span
                  className={`w-2 h-2 rounded-full ${
                    healthData.storage.databaseWritable ? 'bg-emerald-500' : 'bg-red-500'
                  }`}
                />
                <span
                  className={
                    healthData.storage.databaseWritable
                      ? 'text-emerald-700 font-semibold'
                      : 'text-red-700 font-semibold'
                  }
                >
                  {healthData.storage.databaseWritable
                    ? 'Sẵn sàng ghi (Read-Write)'
                    : 'Chỉ đọc (Read-Only) / Khóa ghi'}
                </span>
              </div>
            </div>

            {/* Uploads Card */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                <span>THƯ MỤC UPLOADS</span>
                <HardDrive className="w-4 h-4 text-sky-600" />
              </div>
              <div className="text-2xl font-serif font-bold text-slate-900">
                {healthData.storage.uploadsSizeFormatted}
              </div>
              <div className="text-[11px] font-mono text-slate-500">
                Ảnh món ăn, sự kiện, bản khắc
              </div>
            </div>

            {/* RAM Heap Card */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                <span>BỘ NHỚ RAM HEAP</span>
                <Server className="w-4 h-4 text-amber-600" />
              </div>
              <div className="text-2xl font-serif font-bold text-slate-900">
                {healthData.system.memoryUsageMb} MB
              </div>
              <div className="text-[11px] font-mono text-slate-500">
                Node {healthData.system.nodeVersion} ({healthData.system.platform})
              </div>
            </div>

            {/* Live System Status Badge (No Hardcoded 100%) */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                <span>TRẠNG THÁI HỆ THỐNG</span>
                <Shield
                  className={`w-4 h-4 ${
                    healthData.status === 'HEALTHY'
                      ? 'text-emerald-600'
                      : healthData.status === 'WARNING'
                      ? 'text-amber-600'
                      : 'text-red-600'
                  }`}
                />
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`px-3 py-1 rounded-xl text-base font-bold font-mono border ${
                    healthData.status === 'HEALTHY'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                      : healthData.status === 'WARNING'
                      ? 'bg-amber-50 text-amber-700 border-amber-300'
                      : 'bg-red-50 text-red-700 border-red-300'
                  }`}
                >
                  {healthData.statusVi ||
                    (healthData.status === 'HEALTHY'
                      ? 'TỐT'
                      : healthData.status === 'WARNING'
                      ? 'CẢNH BÁO'
                      : 'LỖI')}
                </span>
              </div>
              <div className="text-[11px] font-mono text-slate-500">
                {healthData.checks?.filter((c: any) => !c.ok).length > 0
                  ? `${healthData.checks.filter((c: any) => !c.ok).length} chỉ số cần lưu ý`
                  : 'Tất cả chỉ số vận hành an toàn'}
              </div>
            </div>
          </div>

          {/* Real Live Health Checks from /api/ops/health */}
          {healthData.checks && healthData.checks.length > 0 && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-serif font-bold text-base text-slate-900 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Chỉ Số Sức Khỏe & Kết Nối Thực Tế (Live Health Checks)</span>
                </h3>
                <span className="text-xs font-mono text-slate-400">
                  Cập nhật: {new Date(healthData.timestamp).toLocaleTimeString('vi-VN')}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {healthData.checks.map((check: any, idx: number) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-xl border flex flex-col justify-between space-y-1 ${
                      check.ok
                        ? 'bg-emerald-50/50 border-emerald-200 text-emerald-900'
                        : 'bg-red-50/50 border-red-200 text-red-900'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-mono font-bold">
                      <span>{check.name}</span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] ${
                          check.ok
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {check.ok ? 'ĐẠT' : 'CẢNH BÁO'}
                      </span>
                    </div>
                    <p className="text-[11px] font-mono opacity-80">{check.detail || '—'}</p>
                  </div>
                ))}
              </div>

              {healthData.storage?.databaseWriteError && (
                <div className="p-3 bg-red-50 border border-red-300 rounded-xl text-xs font-mono text-red-800 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
                  <div>
                    <span className="font-bold">Lỗi ghi cơ sở dữ liệu:</span>{' '}
                    {healthData.storage.databaseWriteError}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Quick Actions & Cache Purge */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 mb-1">
                TỐC ĐỘ & BỘ NHỚ ĐỆM (CACHE PURGE)
              </div>
              <h3 className="font-serif font-bold text-lg text-slate-900">
                Làm Mới Bộ Nhớ Đệm Next.js (Revalidate Layout)
              </h3>
              <p className="text-xs text-slate-500 font-mono mt-1">
                Kích hoạt revalidatePath(&apos;/&apos;, &apos;layout&apos;) để đồng bộ ngay lập tức mọi thay đổi thực đơn, hình ảnh và cài đặt ra trang ngoài.
              </p>
            </div>
            <button
              onClick={handlePurgeCache}
              disabled={purgingCache}
              className="inline-flex items-center gap-2 px-5 py-3 bg-emerald-600 text-white rounded-xl text-xs font-mono font-bold hover:bg-emerald-700 transition-all shadow-sm shrink-0"
            >
              {purgingCache ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
              <span>Làm Mới Cache Ngay</span>
            </button>
          </div>

          {/* Entity Summary Grid */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-serif font-bold text-base text-slate-900">
              Tổng Hợp Bản Ghi Dữ Liệu Trong SQLite
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 text-xs font-mono">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="text-slate-400 text-[10px]">Món ăn</div>
                <div className="text-lg font-bold text-slate-900">{healthData.counts.menuItems}</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="text-slate-400 text-[10px]">Danh mục</div>
                <div className="text-lg font-bold text-slate-900">{healthData.counts.categories}</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="text-slate-400 text-[10px]">Bản khắc ảnh</div>
                <div className="text-lg font-bold text-slate-900">{healthData.counts.spatialFigures}</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="text-slate-400 text-[10px]">Sự kiện</div>
                <div className="text-lg font-bold text-slate-900">{healthData.counts.events}</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="text-slate-400 text-[10px]">Đội ngũ</div>
                <div className="text-lg font-bold text-slate-900">{healthData.counts.teamMembers}</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="text-slate-400 text-[10px]">Câu chuyện</div>
                <div className="text-lg font-bold text-slate-900">{healthData.counts.stories}</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="text-slate-400 text-[10px]">Hỏi đáp FAQ</div>
                <div className="text-lg font-bold text-slate-900">{healthData.counts.faqs}</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="text-slate-400 text-[10px]">Trang tĩnh</div>
                <div className="text-lg font-bold text-slate-900">{healthData.counts.staticPages}</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="text-slate-400 text-[10px]">SEO Pages</div>
                <div className="text-lg font-bold text-slate-900">{healthData.counts.seoRecords}</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="text-slate-400 text-[10px]">Điều hướng 301</div>
                <div className="text-lg font-bold text-slate-900">{healthData.counts.redirectRules}</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="text-slate-400 text-[10px]">Thư liên hệ</div>
                <div className="text-lg font-bold text-slate-900">{healthData.counts.contacts}</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="text-slate-400 text-[10px]">Đánh giá khách</div>
                <div className="text-lg font-bold text-slate-900">{healthData.counts.comments}</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="text-slate-400 text-[10px]">Tài khoản Admin</div>
                <div className="text-lg font-bold text-slate-900">{healthData.counts.adminUsers}</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="text-slate-400 text-[10px]">Nhật ký Log</div>
                <div className="text-lg font-bold text-slate-900">{healthData.counts.systemLogs}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* BACKUP TAB */}
      {tab === 'backup' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Export card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="p-3 w-fit bg-emerald-50 text-emerald-700 rounded-xl">
              <Download className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-slate-900">Sao Lưu 1-Click Toàn Bộ Hệ Thống (JSON)</h3>
              <p className="text-xs text-slate-500 font-mono mt-1">
                Xuất snapshot dữ liệu của 16 bảng (Thực đơn, Bản khắc, Bài viết, Đội ngũ, FAQ, Trang tĩnh, SEO, Cài đặt, v.v.) thành 1 file JSON duy nhất để lưu trữ an toàn.
              </p>
            </div>
            <button
              onClick={handleExportBackup}
              disabled={exportingBackup}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-mono font-bold hover:bg-emerald-700 transition-all shadow-sm"
            >
              {exportingBackup ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              <span>Tải Bản Sao Lưu Về Máy (.json)</span>
            </button>
          </div>

          {/* Restore card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="p-3 w-fit bg-sky-50 text-sky-700 rounded-xl">
              <Upload className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-slate-900">Phục Hồi Dữ Liệu Từ File JSON</h3>
              <p className="text-xs text-slate-500 font-mono mt-1">
                Khôi phục lại toàn bộ dữ liệu từ bản sao lưu JSON hợp lệ trước đó. Giao dịch nguyên tử đảm bảo tính toàn vẹn tuyệt đối.
              </p>
            </div>

            <div className="space-y-3">
              <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-mono font-medium transition-colors">
                <Upload className="w-4 h-4" />
                <span>{selectedFileForRestore ? `Đã chọn: ${selectedFileForRestore.name}` : 'Chọn File Sao Lưu JSON'}</span>
                <input type="file" accept=".json" onChange={handleSelectFileForRestore} className="hidden" />
              </label>

              {selectedFileForRestore && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs font-mono space-y-2">
                  <div className="font-bold text-amber-900">Thông tin file sao lưu:</div>
                  <div className="text-slate-600">Ứng dụng: {selectedFileForRestore.payload.app || 'N/A'}</div>
                  <div className="text-slate-600">Ngày xuất: {selectedFileForRestore.payload.exportedAt || 'N/A'}</div>
                  <button
                    onClick={handleConfirmRestore}
                    disabled={restoringBackup}
                    className="w-full py-2 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 flex items-center justify-center gap-2 shadow-sm"
                  >
                    {restoringBackup ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                    <span>Xác Nhận Khôi Phục Cơ Sở Dữ Liệu</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* LOGS TAB */}
      {tab === 'logs' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100">
            <div>
              <h3 className="font-serif font-bold text-lg text-slate-900">Nhật Ký Thao Tác Hệ Thống (SystemLog)</h3>
              <p className="text-xs text-slate-500 font-mono">Ghi nhận mọi thao tác đăng nhập, sao lưu, khôi phục và chỉnh sửa dữ liệu.</p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-slate-400">Lọc theo mức độ:</span>
              <select
                value={selectedLogLevel}
                onChange={(e) => setSelectedLogLevel(e.target.value)}
                className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"
              >
                <option value="ALL">Tất cả mức độ</option>
                <option value="INFO">INFO (Thông tin)</option>
                <option value="WARN">WARN (Cảnh báo)</option>
                <option value="ERROR">ERROR (Lỗi)</option>
                <option value="SECURITY">SECURITY (Bảo mật)</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Thời gian</th>
                  <th className="py-3 px-4">Mức độ</th>
                  <th className="py-3 px-4">Hành động</th>
                  <th className="py-3 px-4">Người thực hiện</th>
                  <th className="py-3 px-4">Chi tiết thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {logs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-400 font-mono text-xs">
                      {loading
                        ? 'Đang tải dữ liệu nhật ký hệ thống...'
                        : 'Chưa có nhật ký nào được ghi nhận trong cơ sở dữ liệu.'}
                    </td>
                  </tr>
                ) : (
                  logs.map((l) => (
                    <tr key={l.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 text-slate-500 whitespace-nowrap">
                        {new Date(l.createdAt).toLocaleString('vi-VN')}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            l.level === 'SECURITY'
                              ? 'bg-purple-50 text-purple-700 border border-purple-200'
                              : l.level === 'ERROR'
                              ? 'bg-red-50 text-red-700 border border-red-200'
                              : l.level === 'WARN'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          }`}
                        >
                          {l.level}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-800">{l.action}</td>
                      <td className="py-3 px-4 text-slate-600">@{l.actor || 'system'}</td>
                      <td className="py-3 px-4 text-slate-600 max-w-md line-clamp-2">{l.details || '—'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

