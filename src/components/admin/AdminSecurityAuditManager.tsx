'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { ShieldCheck, KeyRound, Laptop, FileClock, Trash2, RefreshCw } from 'lucide-react';

export default function AdminSecurityAuditManager({ isSuperAdmin }: { isSuperAdmin: boolean }) {
  const [totpEnabled, setTotpEnabled] = useState(false);
  const [setupData, setSetupData] = useState<{ secret: string; otpauthUri: string } | null>(null);
  const [totpCode, setTotpCode] = useState('');
  const [recoveryCodes, setRecoveryCodes] = useState<string[]>([]);
  const [sessions, setSessions] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [moduleFilter, setModuleFilter] = useState('ALL');
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (m: string) => {
    setToast(m);
    setTimeout(() => setToast(null), 4000);
  };

  const fetchAll = useCallback(async () => {
    const [tRes, sRes, aRes] = await Promise.all([
      fetch('/api/admin/2fa', { credentials: 'include' }),
      fetch('/api/admin/sessions', { credentials: 'include' }),
      isSuperAdmin
        ? fetch(`/api/admin/audit-logs?module=${moduleFilter}`, { credentials: 'include' })
        : Promise.resolve(null),
    ]);
    const tJson = await tRes.json().catch(() => ({}));
    const sJson = await sRes.json().catch(() => ({}));
    if (tJson.success) setTotpEnabled(Boolean(tJson.data.totpEnabled));
    if (sJson.success) setSessions(sJson.data || []);
    if (aRes) {
      const aJson = await aRes.json().catch(() => ({}));
      if (aJson.success) setAuditLogs(aJson.data || []);
    }
  }, [isSuperAdmin, moduleFilter]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const start2faSetup = async () => {
    const res = await fetch('/api/admin/2fa', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ action: 'setup' }),
    });
    const json = await res.json();
    if (res.ok && json.success) {
      setSetupData(json.data);
    }
  };

  const enable2fa = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!setupData) return;
    const res = await fetch('/api/admin/2fa', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ action: 'enable', secret: setupData.secret, code: totpCode }),
    });
    const json = await res.json();
    if (res.ok && json.success) {
      setTotpEnabled(true);
      setRecoveryCodes(json.data.recoveryCodes || []);
      setSetupData(null);
      setTotpCode('');
      showToast('Đã bật bảo mật 2 lớp (2FA TOTP)');
      fetchAll();
    } else {
      showToast(json.error || 'Mã xác thực 6 số không đúng');
    }
  };

  const disable2fa = async () => {
    if (!window.confirm('Bạn có chắc muốn tắt xác thực 2 lớp (2FA)?')) return;
    const res = await fetch('/api/admin/2fa', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ action: 'disable' }),
    });
    if (res.ok) {
      setTotpEnabled(false);
      showToast('Đã tắt 2FA');
      fetchAll();
    }
  };

  const revokeSession = async (id: string) => {
    const res = await fetch(`/api/admin/sessions?id=${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    if (res.ok) {
      showToast('Đã thu hồi phiên thiết bị');
      fetchAll();
    }
  };

  return (
    <div className="space-y-6">
      {toast && (
        <div className="fixed top-5 right-5 z-50 px-4 py-3 rounded-xl bg-slate-900 text-white text-xs font-mono shadow-xl">
          {toast}
        </div>
      )}

      {/* 2FA TOTP Section */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-700 font-bold uppercase mb-1">
              <KeyRound className="w-4 h-4" />
              <span>BẢO MẬT TÀI KHOẢN • XÁC THỰC 2 LỚP (2FA TOTP)</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              Trạng thái 2FA: {totpEnabled ? 'ĐANG BẬT (An toàn)' : 'CHƯA BẬT'}
            </h3>
          </div>
          {totpEnabled ? (
            <button
              onClick={disable2fa}
              className="px-4 py-2 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 text-xs font-mono font-bold"
            >
              Tắt 2FA
            </button>
          ) : (
            <button
              onClick={start2faSetup}
              className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-mono font-bold"
            >
              Thiết lập 2FA Authenticator
            </button>
          )}
        </div>

        {setupData && (
          <form onSubmit={enable2fa} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
            <p className="font-semibold text-slate-800">
              Nhập khóa bí mật sau vào Google Authenticator / Authy rồi nhập mã 6 số để kích hoạt:
            </p>
            <div className="p-2.5 rounded-lg bg-white border font-mono font-bold text-emerald-800 select-all">
              {setupData.secret}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                required
                value={totpCode}
                onChange={(e) => setTotpCode(e.target.value)}
                placeholder="Nhập mã 6 số..."
                className="px-3 py-2 border rounded-xl font-mono"
              />
              <button type="submit" className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold">
                Xác nhận kích hoạt 2FA
              </button>
            </div>
          </form>
        )}

        {recoveryCodes.length > 0 && (
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs space-y-2">
            <div className="font-bold text-amber-900">Mã khôi phục dự phòng (lưu lại ở nơi an toàn):</div>
            <div className="flex flex-wrap gap-2 font-mono font-bold">
              {recoveryCodes.map((c) => (
                <span key={c} className="px-2 py-1 bg-white border rounded">
                  {c}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Active Sessions */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
            <Laptop className="w-4 h-4 text-emerald-700" />
            <span>Quản Lý Phiên Đăng Nhập Thiết Bị ({sessions.length})</span>
          </div>
          <button onClick={fetchAll} className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200">
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="divide-y border rounded-xl">
          {sessions.length === 0 ? (
            <div className="p-4 text-xs text-slate-500">Chưa có phiên đăng nhập được lưu.</div>
          ) : (
            sessions.map((s) => (
              <div key={s.id} className="p-3 flex items-center justify-between gap-3 text-xs">
                <div className="min-w-0">
                  <div className="font-semibold text-slate-900 flex items-center gap-2">
                    <span>{s.fullName || s.username}</span>
                    <span className="font-mono text-[11px] text-slate-500">({s.role})</span>
                    {s.isCurrent && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold">
                        Thiết bị hiện tại
                      </span>
                    )}
                  </div>
                  <div className="font-mono text-[11px] text-slate-500 truncate">
                    IP: {s.ipAddress || 'n/a'} · {s.userAgent || 'Browser'}
                  </div>
                </div>
                {!s.isCurrent && (
                  <button
                    onClick={() => revokeSession(s.id)}
                    className="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 font-mono font-bold inline-flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Thu hồi
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Audit Log */}
      {isSuperAdmin && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
              <FileClock className="w-4 h-4 text-emerald-700" />
              <span>Nhật Ký Kiểm Toán Hệ Thống (Audit Log)</span>
            </div>
            <select
              value={moduleFilter}
              onChange={(e) => setModuleFilter(e.target.value)}
              className="px-3 py-1.5 border rounded-xl text-xs font-mono"
            >
              <option value="ALL">Tất cả phân hệ</option>
              <option value="AUTH">AUTH (Đăng nhập / 2FA)</option>
              <option value="PIM">PIM (Sản phẩm)</option>
              <option value="INVENTORY">INVENTORY (Kho)</option>
              <option value="OMS">OMS (Đơn hàng)</option>
              <option value="CRM">CRM (Khách hàng / Voucher)</option>
              <option value="SYSTEM">SYSTEM (Chế độ Kép / Cài đặt)</option>
            </select>
          </div>

          <div className="divide-y border rounded-xl max-h-96 overflow-y-auto">
            {auditLogs.length === 0 ? (
              <div className="p-4 text-xs text-slate-500">Chưa có bản ghi kiểm toán nào.</div>
            ) : (
              auditLogs.map((log) => (
                <div key={log.id} className="p-3 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div>
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-white font-mono text-[10px] mr-2">
                      {log.module}
                    </span>
                    <span className="font-mono font-bold text-slate-900">{log.action}</span>
                    {log.details && <span className="ml-2 text-slate-500">{log.details}</span>}
                  </div>
                  <div className="font-mono text-[11px] text-slate-500">
                    @{log.username || 'system'} · {new Date(log.createdAt).toLocaleString('vi-VN')}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
