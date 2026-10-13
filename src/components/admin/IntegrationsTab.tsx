"use client";

import React, { useState, useEffect } from "react";
import {
  Key,
  Shield,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Trash2,
  Save,
  HelpCircle,
  Lock,
  History,
  Activity,
  X,
} from "lucide-react";

export interface IntegrationItem {
  key: string;
  name: string;
  value: string;
  isSecret: boolean;
  status: "connected" | "error" | "unconfigured";
  statusMessage?: string;
  updatedAt: string;
  hasValue?: boolean;
}

export interface AuditLogItem {
  id: string;
  user: string;
  action: "update" | "delete" | "test";
  keyName: string;
  ip: string;
  timestamp: string;
}

interface Props {
  onShowToast: (msg: string) => void;
}

export default function IntegrationsTab({ onShowToast }: Props) {
  const [integrations, setIntegrations] = useState<IntegrationItem[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [testingKey, setTestingKey] = useState<string | null>(null);

  // Editing state
  const [editValues, setEditValues] = useState<Record<string, string>>({});
  const [showJsonGuide, setShowJsonGuide] = useState(true);

  // Auth Confirm Modal State
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<{
    type: "save" | "delete";
    key: string;
    value?: string;
    name?: string;
  } | null>(null);
  const [authCredential, setAuthCredential] = useState("");
  const [authError, setAuthError] = useState("");
  const [isSubmittingAuth, setIsSubmittingAuth] = useState(false);

  const fetchIntegrations = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/integrations");
      const data = await res.json();
      if (data.success) {
        setIntegrations(data.integrations || []);
        setAuditLogs(data.auditLogs || []);
      }
    } catch {
      onShowToast("Không thể tải danh sách tích hợp");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIntegrations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleInputChange = (key: string, val: string) => {
    setEditValues((prev) => ({ ...prev, [key]: val }));
  };

  const handleTestConnection = async (key: string) => {
    setTestingKey(key);
    try {
      const res = await fetch("/api/admin/integrations/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key }),
      });
      const data = await res.json();
      if (data.success) {
        onShowToast(`Thành công: ${data.message}`);
      } else {
        onShowToast(`Lỗi: ${data.message || data.error}`);
      }
      fetchIntegrations();
    } catch {
      onShowToast("Lỗi kết nối máy chủ khi kiểm tra");
    } finally {
      setTestingKey(null);
    }
  };

  const openSaveModal = (item: IntegrationItem) => {
    const val = editValues[item.key] !== undefined ? editValues[item.key] : "";
    if (item.isSecret && !val && !item.hasValue) {
      onShowToast("Vui lòng nhập giá trị khóa mới để lưu");
      return;
    }
    setPendingAction({
      type: "save",
      key: item.key,
      value: val,
      name: item.name,
    });
    setAuthCredential("");
    setAuthError("");
    setAuthModalOpen(true);
  };

  const openDeleteModal = (item: IntegrationItem) => {
    setPendingAction({
      type: "delete",
      key: item.key,
      name: item.name,
    });
    setAuthCredential("");
    setAuthError("");
    setAuthModalOpen(true);
  };

  const handleConfirmAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pendingAction || !authCredential.trim()) {
      setAuthError("Vui lòng nhập mật khẩu hoặc mã 2FA TOTP");
      return;
    }

    setIsSubmittingAuth(true);
    setAuthError("");

    try {
      if (pendingAction.type === "save") {
        const res = await fetch("/api/admin/integrations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            key: pendingAction.key,
            value: pendingAction.value || "",
            name: pendingAction.name,
            authCredential: authCredential.trim(),
          }),
        });
        const data = await res.json();
        if (data.success) {
          onShowToast(data.message || "Đã lưu khóa thành công!");
          setAuthModalOpen(false);
          // Clear edit cache
          setEditValues((prev) => {
            const next = { ...prev };
            delete next[pendingAction.key];
            return next;
          });
          fetchIntegrations();
        } else {
          setAuthError(data.error || "Không thể lưu khóa.");
        }
      } else if (pendingAction.type === "delete") {
        const res = await fetch("/api/admin/integrations", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            key: pendingAction.key,
            authCredential: authCredential.trim(),
          }),
        });
        const data = await res.json();
        if (data.success) {
          onShowToast(data.message || "Đã xóa khóa thành công!");
          setAuthModalOpen(false);
          fetchIntegrations();
        } else {
          setAuthError(data.error || "Không thể xóa khóa.");
        }
      }
    } catch {
      setAuthError("Lỗi kết nối khi gửi yêu cầu xác thực");
    } finally {
      setIsSubmittingAuth(false);
    }
  };

  const formatDate = (iso: string) => {
    if (!iso) return "Chưa cập nhật";
    try {
      const d = new Date(iso);
      return `${d.toLocaleDateString("vi-VN")} ${d.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}`;
    } catch {
      return iso;
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Header */}
      <div className="admin-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-[12px] font-bold text-[var(--accent)] uppercase tracking-wider">
            <Key className="w-4 h-4 shrink-0" />
            <span>Trung Tâm Tích Hợp &amp; Khóa Bảo Mật</span>
          </div>
          <h1 className="admin-h1 font-serif text-[32px] leading-[1.2] font-bold text-[var(--text)]">
            Quản Lý Khóa &amp; Dịch Vụ Ngoài
          </h1>
          <p className="admin-subtle text-[13px]">
            Mọi thay đổi có hiệu lực ngay lập tức trên website công khai mà không cần sửa code hay triển khai lại (Zero-redeploy).
          </p>
        </div>

        <button
          type="button"
          onClick={fetchIntegrations}
          disabled={loading}
          className="inline-flex items-center gap-2 min-h-[44px] px-4 py-2 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] hover:opacity-90 text-[var(--text)] text-[13px] font-semibold transition-all self-start md:self-auto cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>Làm mới trạng thái</span>
        </button>
      </div>

      {/* 3-Step Setup Guide Box */}
      <div className="admin-card p-6 flex flex-col gap-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-[var(--accent)] font-bold text-[15px]">
            <Shield className="w-5 h-5 shrink-0" />
            <span>Hướng Dẫn 3 Bước Kích Hoạt Tích Hợp Google Analytics &amp; Search Console</span>
          </div>
          <button
            type="button"
            onClick={() => setShowJsonGuide(!showJsonGuide)}
            className="text-[13px] text-[var(--accent)] font-semibold underline hover:opacity-80 cursor-pointer shrink-0"
          >
            {showJsonGuide ? "Thu gọn" : "Xem chi tiết"}
          </button>
        </div>

        {showJsonGuide && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] flex flex-col gap-2">
              <div className="w-8 h-8 rounded-full admin-icon-circle flex items-center justify-center font-bold text-[13px] shrink-0">
                1
              </div>
              <h3 className="font-bold text-[var(--text)] text-[15px]">
                Bật API trên Google Cloud
              </h3>
              <p className="admin-subtle text-[13px] leading-relaxed">
                Vào <strong>Google Cloud Console</strong>, kích hoạt 2 thư viện API:
                <br />• <em>Google Analytics Data API</em>
                <br />• <em>Google Search Console API</em>
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] flex flex-col gap-2">
              <div className="w-8 h-8 rounded-full admin-icon-circle flex items-center justify-center font-bold text-[13px] shrink-0">
                2
              </div>
              <h3 className="font-bold text-[var(--text)] text-[15px]">
                Tạo Service Account &amp; Tải JSON
              </h3>
              <p className="admin-subtle text-[13px] leading-relaxed">
                Tạo Service Account trong mục IAM, tạo Khóa mới dạng <strong>JSON</strong>.
                Sao chép toàn bộ nội dung file JSON dán vào ô <em>Google Service Account JSON</em> bên dưới.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] flex flex-col gap-2">
              <div className="w-8 h-8 rounded-full admin-icon-circle flex items-center justify-center font-bold text-[13px] shrink-0">
                3
              </div>
              <h3 className="font-bold text-[var(--text)] text-[15px]">
                Cấp Quyền Truy Cập Email
              </h3>
              <p className="admin-subtle text-[13px] leading-relaxed">
                Lấy email của Service Account (dạng <code>...@iam.gserviceaccount.com</code>):
                <br />• Thêm vào GA4 quyền <strong>Viewer</strong>
                <br />• Thêm vào Search Console quyền <strong>Full user</strong>
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Keys Table Card */}
      <div className="admin-card overflow-hidden flex flex-col">
        <div className="p-5 border-b border-[var(--border)] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2 font-bold text-[var(--text)] text-[15px] sm:text-[18px]">
            <Key className="w-4 h-4 text-[var(--accent)] shrink-0" />
            <span>Danh Sách Khóa Tích Hợp Hệ Thống</span>
          </div>
          <span className="admin-subtle text-[13px]">
            Mã hóa chuẩn AES-256-GCM với biến môi trường độc quyền Vercel
          </span>
        </div>

        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center gap-3 text-[var(--text-subtle)]">
            <RefreshCw className="w-6 h-6 animate-spin text-[var(--accent)]" />
            <span className="text-[13px] font-semibold">Đang tải danh sách tích hợp...</span>
          </div>
        ) : (
          <div className="divide-y divide-[var(--border)]">
            {integrations.map((item) => {
              const currentInput =
                editValues[item.key] !== undefined
                  ? editValues[item.key]
                  : item.isSecret
                  ? ""
                  : item.value;

              const isTesting = testingKey === item.key;

              return (
                <div
                  key={item.key}
                  className="p-5 sm:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-5 hover:bg-[var(--surface-2)]/50 transition-colors"
                >
                  {/* Left: Info & Status */}
                  <div className="flex flex-col gap-1.5 lg:w-1/3">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[var(--text)] text-[15px]">
                        {item.name}
                      </span>
                      {item.isSecret && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[var(--clay)]/15 text-[var(--clay)] text-[12px] font-bold border border-[var(--clay)]/30">
                          <Lock className="w-3 h-3 shrink-0" />
                          <span>Bảo Mật (AES-256)</span>
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      {item.status === "connected" ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[var(--success)]/15 text-[var(--success)] text-[12px] font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                          <span>Đã kết nối</span>
                        </span>
                      ) : item.status === "error" ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[var(--danger)]/15 text-[var(--danger)] text-[12px] font-bold">
                          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                          <span>Lỗi kết nối</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[var(--surface-2)] text-[var(--text-subtle)] text-[12px] font-bold border border-[var(--border)]">
                          <HelpCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>Chưa cấu hình</span>
                        </span>
                      )}

                      {item.statusMessage && (
                        <span className="admin-subtle text-[13px] truncate max-w-[280px]">
                          {item.statusMessage}
                        </span>
                      )}
                    </div>

                    <div className="admin-subtle text-[13px] mt-0.5">
                      Cập nhật: {formatDate(item.updatedAt)}
                    </div>
                  </div>

                  {/* Center: Input field */}
                  <div className="flex-1 max-w-xl flex flex-col gap-1">
                    {item.key === "google_service_account_json" ? (
                      <textarea
                        rows={3}
                        placeholder={
                          item.hasValue
                            ? "Đã lưu JSON hợp lệ (Nhập mới tại đây để thay thế)..."
                            : 'Dán nội dung file JSON vào đây: {"type": "service_account", ...}'
                        }
                        value={currentInput}
                        onChange={(e) => handleInputChange(item.key, e.target.value)}
                        className="w-full text-[13px] font-mono p-3 bg-[var(--surface-2)] border border-[var(--border)] rounded-xl focus:ring-2 focus:ring-[var(--accent)] focus:outline-none text-[var(--text)]"
                      />
                    ) : (
                      <div className="relative">
                        <input
                          type="text"
                          placeholder={
                            item.isSecret && item.hasValue
                              ? item.value || "•••••••• (Đã lưu bí mật)"
                              : `Nhập giá trị ${item.name}...`
                          }
                          value={currentInput}
                          onChange={(e) => handleInputChange(item.key, e.target.value)}
                          className="w-full text-[13px] font-mono px-3.5 py-2.5 min-h-[44px] bg-[var(--surface-2)] border border-[var(--border)] rounded-xl focus:ring-2 focus:ring-[var(--accent)] focus:outline-none text-[var(--text)]"
                        />
                        {item.isSecret && item.hasValue && !currentInput && (
                          <div className="absolute right-3 top-3 text-[12px] text-[var(--text-subtle)] font-sans pointer-events-none">
                            (Đã che an toàn)
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Right: Actions (touch target >= 44px) */}
                  <div className="flex items-center gap-2 shrink-0 self-end lg:self-auto">
                    <button
                      type="button"
                      onClick={() => handleTestConnection(item.key)}
                      disabled={isTesting}
                      title="Kiểm tra kết nối với dịch vụ ngoài"
                      className="inline-flex items-center gap-1.5 min-h-[44px] px-3.5 py-2 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] hover:opacity-90 text-[var(--text)] text-[13px] font-semibold transition-all cursor-pointer"
                    >
                      <Activity className={`w-3.5 h-3.5 ${isTesting ? "animate-spin text-[var(--warn)]" : "text-[var(--accent)]"}`} />
                      <span>{isTesting ? "Đang test..." : "Kiểm tra"}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => openSaveModal(item)}
                      className="inline-flex items-center gap-1.5 min-h-[44px] px-4 py-2 rounded-xl bg-[var(--btn-primary)] hover:opacity-90 text-[var(--btn-primary-text)] text-[13px] font-bold transition-all shadow-sm cursor-pointer"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Lưu</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => openDeleteModal(item)}
                      title="Xóa/Làm trống khóa này"
                      className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl text-[var(--text-subtle)] hover:text-[var(--danger)] hover:bg-rose-500/10 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Audit Log Table */}
      <div className="bg-white dark:bg-[#1E2B22] border border-stone-200/80 dark:border-stone-700/60 rounded-2xl shadow-sm p-5 sm:p-6 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-stone-800 dark:text-stone-100 text-sm sm:text-base">
            <History className="w-4 h-4 text-[#3E5C46] dark:text-[#9DC183]" />
            <span>Nhật Ký Thao Tác Bảo Mật (Audit Log)</span>
          </div>
          <span className="text-xs text-stone-500">
            Ghi nhận an toàn: Tuyệt đối không lưu giá trị khóa nhạy cảm
          </span>
        </div>

        {auditLogs.length === 0 ? (
          <div className="text-xs text-stone-400 py-4 text-center italic">
            Chưa có ghi nhận thao tác nào trong phiên này.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 dark:bg-stone-900/60 text-stone-500 font-semibold border-b border-stone-200 dark:border-stone-800">
                <tr>
                  <th className="py-2.5 px-3">Thời gian</th>
                  <th className="py-2.5 px-3">Người thực hiện</th>
                  <th className="py-2.5 px-3">Hành động</th>
                  <th className="py-2.5 px-3">Khóa cấu hình</th>
                  <th className="py-2.5 px-3">Địa chỉ IP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-stone-800/60 text-stone-700 dark:text-stone-300">
                {auditLogs.slice(0, 10).map((log) => (
                  <tr key={log.id} className="hover:bg-stone-50/50 dark:hover:bg-stone-800/30">
                    <td className="py-2.5 px-3 font-mono">{formatDate(log.timestamp)}</td>
                    <td className="py-2.5 px-3 font-semibold">{log.user}</td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          log.action === "update"
                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                            : log.action === "delete"
                            ? "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                            : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                        }`}
                      >
                        {log.action === "update"
                          ? "Cập nhật"
                          : log.action === "delete"
                          ? "Xóa"
                          : "Kiểm tra"}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-mono">{log.keyName}</td>
                    <td className="py-2.5 px-3 text-stone-400">{log.ip}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Confirmation & Auth Re-verification Modal */}
      {authModalOpen && pendingAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-white dark:bg-[#1E2B22] border border-stone-200 dark:border-stone-700 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col gap-5">
            <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3">
              <div className="flex items-center gap-2 text-stone-900 dark:text-stone-100 font-bold text-base">
                <Shield className="w-5 h-5 text-[#3E5C46] dark:text-[#9DC183]" />
                <span>Xác Thực Bảo Mật Quản Trị</span>
              </div>
              <button
                type="button"
                onClick={() => setAuthModalOpen(false)}
                className="p-1 rounded-full text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
              Bạn đang yêu cầu{" "}
              <strong>{pendingAction.type === "save" ? "lưu/cập nhật" : "xóa"}</strong> khóa{" "}
              <code className="px-1.5 py-0.5 bg-stone-100 dark:bg-stone-800 rounded font-mono text-[#3E5C46] dark:text-[#9DC183]">
                {pendingAction.name || pendingAction.key}
              </code>
              . Vui lòng nhập lại <strong>Mật khẩu quản trị</strong> hoặc <strong>Mã 2FA (TOTP)</strong> để xác thực.
            </p>

            <form onSubmit={handleConfirmAuth} className="flex flex-col gap-4">
              <input
                type="password"
                autoFocus
                placeholder="Nhập mật khẩu quản trị hoặc mã TOTP 6 số"
                value={authCredential}
                onChange={(e) => setAuthCredential(e.target.value)}
                className="w-full py-3 px-4 text-sm bg-stone-50 dark:bg-stone-900 rounded-xl border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-[#3E5C46]"
              />

              {authError && (
                <div className="text-xs text-rose-600 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 px-3 py-2 rounded-xl font-medium">
                  {authError}
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setAuthModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingAuth || !authCredential.trim()}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-[#3E5C46] hover:bg-[#2D4233] disabled:opacity-50 transition-all shadow-md cursor-pointer flex items-center gap-2"
                >
                  {isSubmittingAuth ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Đang xác thực...</span>
                    </>
                  ) : (
                    <span>Xác Nhận Thực Hiện</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
