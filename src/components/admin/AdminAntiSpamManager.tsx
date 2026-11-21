'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Shield,
  ShieldAlert,
  ShieldCheck,
  ShieldOff,
  AlertTriangle,
  Lock,
  Unlock,
  Ban,
  RefreshCw,
  Save,
  Plus,
  Trash2,
  Clock,
  Flame,
  Mail,
  Globe,
  Activity,
  CheckCircle2,
  AlertCircle,
  Filter,
  Cpu,
  Zap,
  Info,
  Sliders,
  Check,
  X,
  Loader2,
  Search,
} from 'lucide-react';
import { AntiSpamConfigData, BlockedIpItem } from '@/types';

interface AdminAntiSpamManagerProps {
  onNotify?: (type: 'success' | 'error', message: string) => void;
}

export default function AdminAntiSpamManager({ onNotify }: AdminAntiSpamManagerProps) {
  // State for config
  const [config, setConfig] = useState<AntiSpamConfigData>({
    isEnabled: true,
    emergencyLockdown: false,
    requireHumanChallenge: true,
    cooldownSeconds: 60,
    maxPerTenMinutes: 3,
    maxPerDay: 8,
    globalMaxPerFiveMinutes: 25,
    maxGmailPerHour: 15,
    maxLinksAllowed: 1,
    minFillSeconds: 3,
    blockedKeywords: 'casino, bet, sex, crypto, vay tiền, giải ngân, tặng tiền, telegram, xoso, đánh bạc',
    totalBlockedCount: 0,
    currentlyBannedIps: 0,
    gmailSentLastHour: 0,
  });

  // State for blocked IPs
  const [blockedIps, setBlockedIps] = useState<BlockedIpItem[]>([]);
  const [searchIpQuery, setSearchIpQuery] = useState('');

  // Manual block form state
  const [manualIp, setManualIp] = useState('');
  const [manualReason, setManualReason] = useState('Chặn thủ công bởi Quản Trị Viên');
  const [manualDurationMinutes, setManualDurationMinutes] = useState<number>(1440); // 24h default
  const [isSubmittingBlock, setIsSubmittingBlock] = useState(false);
  const [showManualBlockModal, setShowManualBlockModal] = useState(false);

  // Loading & Action states
  const [loading, setLoading] = useState(true);
  const [savingConfig, setSavingConfig] = useState(false);
  const [togglingLockdown, setTogglingLockdown] = useState(false);
  const [unbanningId, setUnbanningId] = useState<string | null>(null);

  // Local toast fallback
  const [localToast, setLocalToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const notify = useCallback((type: 'success' | 'error', message: string) => {
    if (onNotify) {
      onNotify(type, message);
    } else {
      setLocalToast({ type, message });
      setTimeout(() => setLocalToast(null), 4000);
    }
  }, [onNotify]);

  // Fetch all anti-spam data
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [configRes, ipsRes] = await Promise.all([
        fetch('/api/security/antispam', { credentials: 'include' }),
        fetch('/api/security/blocked-ips', { credentials: 'include' }),
      ]);

      if (configRes.ok) {
        const configJson = await configRes.json();
        const data = configJson.data || configJson;
        if (data && typeof data === 'object') {
          setConfig((prev) => ({
            ...prev,
            ...data,
            // Fallback numeric parsing
            cooldownSeconds: Number(data.cooldownSeconds ?? prev.cooldownSeconds),
            maxPerTenMinutes: Number(data.maxPerTenMinutes ?? prev.maxPerTenMinutes),
            maxPerDay: Number(data.maxPerDay ?? prev.maxPerDay),
            globalMaxPerFiveMinutes: Number(data.globalMaxPerFiveMinutes ?? prev.globalMaxPerFiveMinutes),
            maxGmailPerHour: Number(data.maxGmailPerHour ?? prev.maxGmailPerHour),
            maxLinksAllowed: Number(data.maxLinksAllowed ?? prev.maxLinksAllowed),
            minFillSeconds: Number(data.minFillSeconds ?? prev.minFillSeconds),
            blockedKeywords: data.blockedKeywords ?? prev.blockedKeywords,
            totalBlockedCount: Number(data.totalBlockedCount ?? prev.totalBlockedCount),
            currentlyBannedIps: Number(data.currentlyBannedIps ?? prev.currentlyBannedIps),
            gmailSentLastHour: Number(data.gmailSentLastHour ?? prev.gmailSentLastHour),
          }));
        }
      }

      if (ipsRes.ok) {
        const ipsJson = await ipsRes.json();
        const list = Array.isArray(ipsJson.data) ? ipsJson.data : Array.isArray(ipsJson) ? ipsJson : [];
        setBlockedIps(list);
      }
    } catch (err) {
      console.error('Error fetching anti-spam data:', err);
      notify('error', 'Không thể kết nối đến hệ thống giám sát an ninh');
    } finally {
      setLoading(false);
    }
  }, [notify]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Save Shield Parameters
  const handleSaveConfig = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSavingConfig(true);
    try {
      const payload = {
        isEnabled: config.isEnabled,
        emergencyLockdown: config.emergencyLockdown,
        requireHumanChallenge: config.requireHumanChallenge,
        cooldownSeconds: Number(config.cooldownSeconds) || 60,
        maxPerTenMinutes: Number(config.maxPerTenMinutes) || 3,
        maxPerDay: Number(config.maxPerDay) || 8,
        globalMaxPerFiveMinutes: Number(config.globalMaxPerFiveMinutes) || 25,
        maxGmailPerHour: Number(config.maxGmailPerHour) || 15,
        maxLinksAllowed: Number(config.maxLinksAllowed) >= 0 ? Number(config.maxLinksAllowed) : 1,
        minFillSeconds: Number(config.minFillSeconds) >= 0 ? Number(config.minFillSeconds) : 3,
        blockedKeywords: config.blockedKeywords || '',
      };

      const res = await fetch('/api/security/antispam', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (res.ok && (json.success || !json.error)) {
        notify('success', 'Đã lưu cấu hình Khiên Chống Spam thành công!');
        fetchData();
      } else {
        notify('error', json.error || json.message || 'Lỗi khi lưu cấu hình Khiên');
      }
    } catch {
      notify('error', 'Lỗi kết nối máy chủ khi lưu cấu hình');
    } finally {
      setSavingConfig(false);
    }
  };

  // Immediate Emergency Lockdown Toggle
  const handleToggleEmergencyLockdown = async () => {
    const nextState = !config.emergencyLockdown;
    const confirmMessage = nextState
      ? 'CẢNH BÁO: Bật Khóa Khẩn Cấp sẽ tạm ngừng nhận MỌI form liên hệ và bình luận mới từ bên ngoài để bảo vệ hệ thống khỏi tấn công DDoS/Flooding. Bạn có chắc chắn muốn kích hoạt?'
      : 'Bạn muốn tắt Chế độ Khóa Khẩn Cấp và khôi phục hoạt động nhận phản hồi bình thường?';

    if (!window.confirm(confirmMessage)) return;

    setTogglingLockdown(true);
    try {
      const res = await fetch('/api/security/antispam', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ emergencyLockdown: nextState }),
      });

      const json = await res.json();
      if (res.ok && (json.success || !json.error)) {
        setConfig((prev) => ({ ...prev, emergencyLockdown: nextState }));
        notify(
          'success',
          nextState
            ? 'ĐÃ KÍCH HOẠT CHẾ ĐỘ KHÓA KHẨN CẤP! Hệ thống đang ở trạng thái phòng thủ tối cao.'
            : 'Đã tắt Khóa Khẩn Cấp. Các form đã mở nhận phản hồi bình thường.'
        );
        fetchData();
      } else {
        notify('error', json.error || 'Không thể thay đổi trạng thái Khóa Khẩn Cấp');
      }
    } catch {
      notify('error', 'Lỗi kết nối máy chủ');
    } finally {
      setTogglingLockdown(false);
    }
  };

  // Quick Manual IP Block
  const handleManualBlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualIp.trim()) {
      notify('error', 'Vui lòng nhập địa chỉ IP cần khóa');
      return;
    }

    setIsSubmittingBlock(true);
    try {
      const res = await fetch('/api/security/blocked-ips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          ip: manualIp.trim(),
          reason: manualReason.trim() || 'Khóa thủ công',
          durationMinutes: Number(manualDurationMinutes),
        }),
      });

      const json = await res.json();
      if (res.ok && (json.success || !json.error)) {
        notify('success', `Đã khóa địa chỉ IP ${manualIp} thành công!`);
        setManualIp('');
        setManualReason('Chặn thủ công bởi Quản Trị Viên');
        setShowManualBlockModal(false);
        fetchData();
      } else {
        notify('error', json.error || json.message || 'Lỗi khi khóa IP');
      }
    } catch {
      notify('error', 'Lỗi mạng khi thực hiện khóa IP');
    } finally {
      setIsSubmittingBlock(false);
    }
  };

  // Unban IP
  const handleUnbanIp = async (id: string, ip: string) => {
    if (!window.confirm(`Bạn có chắc muốn gỡ khóa (Unban) cho IP ${ip}?`)) return;

    setUnbanningId(id);
    try {
      const res = await fetch(`/api/security/blocked-ips?id=${encodeURIComponent(id)}&ip=${encodeURIComponent(ip)}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ id, ip }),
      });

      const json = await res.json().catch(() => ({}));
      if (res.ok && (json.success || !json.error)) {
        // Immediately remove item from local React state (no stale UI)
        setBlockedIps((prev) => prev.filter((item) => item.id !== id && item.ip !== ip));
        notify('success', `Đã gỡ khóa thành công cho IP ${ip}`);
        fetchData();
      } else {
        notify('error', json.error || json.message || 'Không thể gỡ khóa IP. Vui lòng kiểm tra quyền quản trị.');
      }
    } catch {
      notify('error', 'Lỗi kết nối máy chủ khi gỡ khóa IP');
    } finally {
      setUnbanningId(null);
    }
  };

  // Filter blocked IPs by query
  const filteredBlockedIps = blockedIps.filter((item) => {
    if (!searchIpQuery.trim()) return true;
    const q = searchIpQuery.toLowerCase();
    return (
      (item.ip && item.ip.toLowerCase().includes(q)) ||
      (item.ipMasked && item.ipMasked.toLowerCase().includes(q)) ||
      (item.reason && item.reason.toLowerCase().includes(q))
    );
  });

  // Calculate Gmail Outbound Rate Percentage
  const maxGmail = config.maxGmailPerHour || 15;
  const currentGmail = config.gmailSentLastHour || 0;
  const gmailRatePercent = Math.min(100, Math.round((currentGmail / maxGmail) * 100));

  return (
    <div className="space-y-6">
      {/* Fallback Toast Notification */}
      {localToast && (
        <div
          className={`fixed top-16 right-6 z-50 p-4 rounded-xl shadow-lg border flex items-center gap-3 transition-all ${
            localToast.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-red-50 border-red-200 text-red-800'
          }`}
        >
          {localToast.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          )}
          <span className="text-xs font-mono">{localToast.message}</span>
        </div>
      )}

      {/* Emergency Lockdown Active Alert Banner */}
      {config.emergencyLockdown && (
        <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white p-4 sm:p-5 rounded-2xl shadow-lg border border-red-500/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-pulse">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/20 rounded-xl">
              <ShieldAlert className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="font-mono text-xs uppercase tracking-wider font-extrabold text-red-100 flex items-center gap-2">
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-white animate-ping" />
                <span>CHẾ ĐỘ KHÓA KHẨN CẤP ĐANG BẬT (EMERGENCY LOCKDOWN ACTIVE)</span>
              </div>
              <p className="text-xs sm:text-sm font-sans mt-0.5 text-white/95 leading-relaxed">
                Hệ thống đang tạm ngừng nhận tất cả form lời nhắn (/lien-he) và đánh giá (/khach-hang) để bảo toàn cơ sở dữ liệu và ngăn chặn tấn công spam bot tràn ngập.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleToggleEmergencyLockdown}
            disabled={togglingLockdown}
            className="px-4 py-2 bg-white text-red-700 font-mono text-xs font-bold rounded-xl shadow hover:bg-red-50 transition-all shrink-0 flex items-center gap-1.5"
          >
            {togglingLockdown ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Unlock className="w-3.5 h-3.5" />}
            <span>Tắt Khóa Khẩn Cấp</span>
          </button>
        </div>
      )}

      {/* SECTION 1: LIVE THREAT & PROTECTION OVERVIEW CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Blocked Count */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold text-slate-500 uppercase tracking-wider">
              Lượt chặn Spam & Bot
            </span>
            <div className="p-2 bg-rose-50 text-rose-600 rounded-xl">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-mono font-bold text-slate-900">
              {(config.totalBlockedCount ?? 0).toLocaleString('vi-VN')}
            </div>
            <p className="text-[11px] font-mono text-slate-400 mt-1 flex items-center gap-1">
              <Zap className="w-3 h-3 text-amber-500" />
              <span>Chặn qua 7 tầng bảo vệ</span>
            </p>
          </div>
        </div>

        {/* Card 2: Currently Banned IPs */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold text-slate-500 uppercase tracking-wider">
              IP Đang Bị Cấm
            </span>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
              <Ban className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-mono font-bold text-slate-900">
              {blockedIps.length || (config.currentlyBannedIps ?? 0)}
            </div>
            <p className="text-[11px] font-mono text-slate-400 mt-1 flex items-center gap-1">
              <Clock className="w-3 h-3 text-slate-400" />
              <span>Khóa lũy tiến tự động & thủ công</span>
            </p>
          </div>
        </div>

        {/* Card 3: Gmail Outbound Rate */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold text-slate-500 uppercase tracking-wider">
              Tốc độ Gmail (1 Giờ)
            </span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <Mail className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-mono font-bold text-slate-900">{currentGmail}</span>
              <span className="text-xs font-mono text-slate-400 font-bold">/ {maxGmail} thư/giờ</span>
            </div>
            {/* Progress bar */}
            <div className="mt-2 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  gmailRatePercent > 80
                    ? 'bg-rose-500'
                    : gmailRatePercent > 50
                    ? 'bg-amber-500'
                    : 'bg-emerald-500'
                }`}
                style={{ width: `${gmailRatePercent}%` }}
              />
            </div>
            <p className="text-[10px] font-mono text-slate-400 mt-1.5">
              Cầu dao chống cạn quota Gmail SMTP
            </p>
          </div>
        </div>

        {/* Card 4: Shield Status & Emergency Switch */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold text-slate-500 uppercase tracking-wider">
              Trạng thái Khiên
            </span>
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border ${
                config.emergencyLockdown
                  ? 'bg-red-50 text-red-700 border-red-200'
                  : config.isEnabled
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-slate-100 text-slate-500 border-slate-200'
              }`}
            >
              {config.emergencyLockdown ? (
                <>
                  <Lock className="w-3 h-3 text-red-600" /> KHÓA KHẨN CẤP
                </>
              ) : config.isEnabled ? (
                <>
                  <ShieldCheck className="w-3 h-3 text-emerald-600" /> ĐANG BẢO VỆ
                </>
              ) : (
                <>
                  <ShieldOff className="w-3 h-3 text-slate-400" /> TẠM TẮT
                </>
              )}
            </span>
          </div>

          <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
            <div>
              <div className="text-xs font-mono font-bold text-slate-800">Khóa Khẩn Cấp</div>
              <div className="text-[10px] text-slate-400 font-mono">Tạm ngừng nhận form</div>
            </div>
            <button
              type="button"
              onClick={handleToggleEmergencyLockdown}
              disabled={togglingLockdown}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                config.emergencyLockdown ? 'bg-red-600' : 'bg-slate-300 hover:bg-slate-400'
              }`}
              title="Chế độ Khóa Khẩn Cấp (Tạm ngưng nhận Form khi bị tấn công)"
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  config.emergencyLockdown ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 2: CONFIGURABLE SHIELD PARAMETERS FORM */}
      <form onSubmit={handleSaveConfig} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-xl">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base text-slate-900">
                Thông Số Kỹ Thuật Khiên Chống Spam & Tấn Công (Anti-Spam Engine)
              </h3>
              <p className="text-xs text-slate-500 font-mono mt-0.5">
                Cấu hình bộ lọc 7 tầng: Rate-limiting, bẫy Honeypot, Phép tính xác thực, Băm nội dung trùng lặp và Cầu dao SMTP.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={fetchData}
              className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-colors"
              title="Làm mới thông số"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              type="submit"
              disabled={savingConfig}
              className="px-5 py-2 bg-emerald-700 text-white rounded-xl text-xs font-mono font-bold hover:bg-emerald-800 flex items-center gap-1.5 transition-all shadow-sm disabled:opacity-50"
            >
              {savingConfig ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              <span>Lưu cấu hình Khiên</span>
            </button>
          </div>
        </div>

        {/* Master Toggles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
          <label className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-slate-100/70 cursor-pointer flex items-start gap-3 transition-colors">
            <input
              type="checkbox"
              checked={config.isEnabled}
              onChange={(e) => setConfig((prev) => ({ ...prev, isEnabled: e.target.checked }))}
              className="mt-1 rounded text-emerald-600 focus:ring-emerald-500"
            />
            <div>
              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Bật Khiên Chống Spam (isEnabled)</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                Kích hoạt toàn diện bộ lọc 7 tầng tại /api/contact và /api/comments. Nếu tắt, mọi yêu cầu sẽ bỏ qua kiểm tra tốc độ (không khuyến nghị).
              </p>
            </div>
          </label>

          <label className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-slate-100/70 cursor-pointer flex items-start gap-3 transition-colors">
            <input
              type="checkbox"
              checked={config.requireHumanChallenge}
              onChange={(e) => setConfig((prev) => ({ ...prev, requireHumanChallenge: e.target.checked }))}
              className="mt-1 rounded text-emerald-600 focus:ring-emerald-500"
            />
            <div>
              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-blue-600" />
                <span>Bắt buộc xác minh phép tính người thật (requireHumanChallenge)</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                Buộc khách hàng phải giải phép tính cộng số học ngẫu nhiên ký HMAC phía máy chủ trước khi nhấn Gửi. Ngăn chặn 100% bot không giải toán.
              </p>
            </div>
          </label>
        </div>

        {/* Numeric Inputs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
          {/* Cooldown Seconds */}
          <div className="space-y-1.5">
            <label className="block text-slate-700 font-bold">
              Cooldown 1 IP (giây)
            </label>
            <div className="relative">
              <input
                type="number"
                min={5}
                max={600}
                value={config.cooldownSeconds}
                onChange={(e) => setConfig((prev) => ({ ...prev, cooldownSeconds: Number(e.target.value) }))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
              />
              <span className="absolute right-3 top-2 text-[11px] text-slate-400">giây</span>
            </div>
            <p className="text-[10px] text-slate-400">Khoảng nghỉ tối thiểu giữa 2 lần gửi từ cùng 1 IP (mặc định: 60s)</p>
          </div>

          {/* Max Per 10 Min */}
          <div className="space-y-1.5">
            <label className="block text-slate-700 font-bold">
              Tối đa / 10 phút / IP
            </label>
            <div className="relative">
              <input
                type="number"
                min={1}
                max={50}
                value={config.maxPerTenMinutes}
                onChange={(e) => setConfig((prev) => ({ ...prev, maxPerTenMinutes: Number(e.target.value) }))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
              />
              <span className="absolute right-3 top-2 text-[11px] text-slate-400">lần</span>
            </div>
            <p className="text-[10px] text-slate-400">Giới hạn trong cửa sổ trượt 10 phút (mặc định: 3 lần)</p>
          </div>

          {/* Max Per Day */}
          <div className="space-y-1.5">
            <label className="block text-slate-700 font-bold">
              Tối đa / 24 giờ / IP
            </label>
            <div className="relative">
              <input
                type="number"
                min={1}
                max={100}
                value={config.maxPerDay}
                onChange={(e) => setConfig((prev) => ({ ...prev, maxPerDay: Number(e.target.value) }))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
              />
              <span className="absolute right-3 top-2 text-[11px] text-slate-400">lần/ngày</span>
            </div>
            <p className="text-[10px] text-slate-400">Hạn ngạch gửi tối đa trong ngày của 1 IP (mặc định: 8 lần)</p>
          </div>

          {/* Global Circuit Breaker 5 Min */}
          <div className="space-y-1.5">
            <label className="block text-slate-700 font-bold">
              Cắt cầu dao toàn web / 5 phút
            </label>
            <div className="relative">
              <input
                type="number"
                min={5}
                max={500}
                value={config.globalMaxPerFiveMinutes}
                onChange={(e) => setConfig((prev) => ({ ...prev, globalMaxPerFiveMinutes: Number(e.target.value) }))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
              />
              <span className="absolute right-3 top-2 text-[11px] text-slate-400">lần</span>
            </div>
            <p className="text-[10px] text-slate-400">Nếu toàn server vượt quá số này trong 5 phút &rarr; Tự ngắt (mặc định: 25)</p>
          </div>

          {/* Max Gmail Per Hour */}
          <div className="space-y-1.5">
            <label className="block text-slate-700 font-bold">
              Giới hạn Gmail gửi / 1 giờ
            </label>
            <div className="relative">
              <input
                type="number"
                min={1}
                max={100}
                value={config.maxGmailPerHour}
                onChange={(e) => setConfig((prev) => ({ ...prev, maxGmailPerHour: Number(e.target.value) }))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
              />
              <span className="absolute right-3 top-2 text-[11px] text-slate-400">email/h</span>
            </div>
            <p className="text-[10px] text-slate-400">Ngăn ngừa cạn quota 500 mail/ngày của Gmail SMTP (mặc định: 15)</p>
          </div>

          {/* Max Links Allowed */}
          <div className="space-y-1.5">
            <label className="block text-slate-700 font-bold">
              Số liên kết URL tối đa
            </label>
            <div className="relative">
              <input
                type="number"
                min={0}
                max={10}
                value={config.maxLinksAllowed}
                onChange={(e) => setConfig((prev) => ({ ...prev, maxLinksAllowed: Number(e.target.value) }))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
              />
              <span className="absolute right-3 top-2 text-[11px] text-slate-400">links</span>
            </div>
            <p className="text-[10px] text-slate-400">Chặn tin nhắn chèn link quảng cáo spam (mặc định: 1 link)</p>
          </div>

          {/* Min Fill Seconds */}
          <div className="space-y-1.5">
            <label className="block text-slate-700 font-bold">
              Thời gian điền form tối thiểu
            </label>
            <div className="relative">
              <input
                type="number"
                min={1}
                max={30}
                value={config.minFillSeconds}
                onChange={(e) => setConfig((prev) => ({ ...prev, minFillSeconds: Number(e.target.value) }))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
              />
              <span className="absolute right-3 top-2 text-[11px] text-slate-400">giây</span>
            </div>
            <p className="text-[10px] text-slate-400">Bot gửi tức thì dưới X giây sẽ bị drop tự động (mặc định: 3s)</p>
          </div>
        </div>

        {/* Blocked Keywords */}
        <div className="space-y-2 text-xs font-mono">
          <label className="block text-slate-700 font-bold flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-emerald-600" />
              <span>Danh Sách Từ Khóa Bị Chặn (Blocked Keywords)</span>
            </span>
            <span className="text-[11px] text-slate-400 font-normal">Cách nhau bằng dấu phẩy</span>
          </label>
          <textarea
            rows={3}
            value={config.blockedKeywords}
            onChange={(e) => setConfig((prev) => ({ ...prev, blockedKeywords: e.target.value }))}
            placeholder="casino, bet, sex, crypto, vay tiền, giải ngân, tặng tiền, telegram, xoso, đánh bạc..."
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500/20 leading-relaxed font-sans text-xs"
          />
          <p className="text-[11px] text-slate-400">
            Tin nhắn hoặc đánh giá chứa bất kỳ từ khóa nào trong danh sách trên sẽ bị từ chối ngay lập tức và tăng điểm phạt IP.
          </p>
        </div>

        {/* Form Footer Save Button */}
        <div className="pt-2 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            disabled={savingConfig}
            className="px-6 py-2.5 bg-emerald-700 text-white rounded-xl text-xs font-mono font-bold hover:bg-emerald-800 flex items-center gap-2 transition-all shadow-sm disabled:opacity-50"
          >
            {savingConfig ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Lưu cấu hình Khiên</span>
          </button>
        </div>
      </form>

      {/* SECTION 3: IP BLOCKLIST MANAGER TABLE & ACTIONS */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Ban className="w-5 h-5 text-rose-600" />
              <h3 className="font-serif font-bold text-base text-slate-900">
                Danh Sách Địa Chỉ IP Bị Khóa & Danh Sách Đen (IP Blocklist)
              </h3>
            </div>
            <p className="text-xs text-slate-500 font-mono mt-0.5">
              Quản lý danh sách IP bị cấm do vi phạm lũy tiến (Rate Limit Strikes) hoặc do Quản trị viên khóa thủ công.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            {/* Search Box */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchIpQuery}
                onChange={(e) => setSearchIpQuery(e.target.value)}
                placeholder="Tìm kiếm IP, lý do..."
                className="pl-8 pr-3 py-1.5 text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl w-48 sm:w-60 focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            <button
              type="button"
              onClick={() => setShowManualBlockModal(true)}
              className="px-3.5 py-1.5 bg-rose-600 text-white rounded-xl text-xs font-mono font-bold hover:bg-rose-700 flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Khóa IP Thủ Công</span>
            </button>
          </div>
        </div>

        {/* Table of Blocked IPs */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-mono uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Địa chỉ IP</th>
                <th className="py-3 px-4">Lý do khóa</th>
                <th className="py-3 px-4 text-center">Số vi phạm (Strikes)</th>
                <th className="py-3 px-4">Thời hạn cấm</th>
                <th className="py-3 px-4">Thời điểm khóa</th>
                <th className="py-3 px-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {filteredBlockedIps.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-slate-400">
                    {searchIpQuery ? 'Không tìm thấy IP nào khớp với bộ lọc' : 'Hiện không có địa chỉ IP nào trong danh sách đen.'}
                  </td>
                </tr>
              ) : (
                filteredBlockedIps.map((item) => {
                  const isPermanent = !item.blockedUntil;
                  const blockedUntilDate = item.blockedUntil ? new Date(item.blockedUntil) : null;
                  const isExpired = blockedUntilDate ? blockedUntilDate.getTime() < Date.now() : false;

                  return (
                    <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        <div className="flex items-center gap-2">
                          <Globe className="w-3.5 h-3.5 text-slate-400" />
                          <span>{item.ipMasked || item.ip}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-sans text-slate-700 max-w-xs">
                        <span className="line-clamp-1">{item.reason || 'Vi phạm spam'}</span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            item.strikes >= 5
                              ? 'bg-rose-100 text-rose-800'
                              : item.strikes >= 3
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {item.strikes} lần
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        {isPermanent ? (
                          <span className="inline-flex items-center gap-1 text-rose-600 font-bold text-[11px]">
                            <Ban className="w-3 h-3" /> Vĩnh viễn
                          </span>
                        ) : isExpired ? (
                          <span className="text-slate-400 text-[11px] italic">Đã hết hạn</span>
                        ) : (
                          <div className="text-[11px] text-amber-700">
                            <div>Đến: {blockedUntilDate?.toLocaleTimeString('vi-VN')}</div>
                            <div className="text-[10px] text-slate-400">
                              {blockedUntilDate?.toLocaleDateString('vi-VN')}
                            </div>
                          </div>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-[11px] text-slate-500 whitespace-nowrap">
                        {new Date(item.createdAt).toLocaleString('vi-VN', {
                          hour: '2-digit',
                          minute: '2-digit',
                          day: '2-digit',
                          month: '2-digit',
                        })}
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => handleUnbanIp(item.id, item.ip)}
                          disabled={unbanningId === item.id}
                          className="px-2.5 py-1 text-xs font-mono bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg transition-colors inline-flex items-center gap-1 font-bold disabled:opacity-50"
                          title="Gỡ khóa (Unban) IP này"
                        >
                          {unbanningId === item.id ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <Unlock className="w-3 h-3" />
                          )}
                          <span>Gỡ khóa</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: MANUAL IP BLOCK FORM */}
      {showManualBlockModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <form
            onSubmit={handleManualBlock}
            className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden border border-slate-200 text-xs font-mono"
          >
            <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Ban className="w-4 h-4 text-rose-500" />
                <h3 className="font-serif font-bold text-base">Khóa Địa Chỉ IP Thủ Công</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowManualBlockModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-slate-700 mb-1 font-bold">Địa chỉ IP cần khóa *</label>
                <input
                  type="text"
                  required
                  value={manualIp}
                  onChange={(e) => setManualIp(e.target.value)}
                  placeholder="Ví dụ: 14.232.128.45 hoặc 2001:db8::1"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-1 font-bold">Lý do khóa</label>
                <input
                  type="text"
                  value={manualReason}
                  onChange={(e) => setManualReason(e.target.value)}
                  placeholder="Ví dụ: Spam flood, Dò quét hệ thống..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white font-sans text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-1 font-bold">Thời hạn khóa</label>
                <select
                  value={manualDurationMinutes}
                  onChange={(e) => setManualDurationMinutes(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs"
                >
                  <option value={15}>15 phút</option>
                  <option value={60}>1 giờ</option>
                  <option value={360}>6 giờ</option>
                  <option value={1440}>24 giờ (1 ngày - Mặc định)</option>
                  <option value={10080}>7 ngày</option>
                  <option value={43200}>30 ngày</option>
                  <option value={0}>Vĩnh viễn (Không thời hạn)</option>
                </select>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowManualBlockModal(false)}
                className="px-4 py-2 text-slate-600 hover:bg-slate-200 rounded-xl font-bold"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={isSubmittingBlock}
                className="px-5 py-2 bg-rose-600 text-white rounded-xl font-bold hover:bg-rose-700 flex items-center gap-1.5 shadow"
              >
                {isSubmittingBlock ? <Loader2 className="w-4 h-4 animate-spin" /> : <Ban className="w-4 h-4" />}
                <span>Xác nhận Khóa IP</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
