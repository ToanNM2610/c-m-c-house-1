"use client";

import React, { useState } from "react";
import { Lock, Sparkles, Eye, EyeOff, ArrowRight } from "lucide-react";

interface Props {
  needsFirstLogin: boolean;
  onLoginSuccess: (require2FAPrompt?: boolean) => void;
}

export default function AdminPasswordLogin({ needsFirstLogin, onLoginSuccess }: Props) {
  // Login form state
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // 2FA TOTP state
  const [require2FA, setRequire2FA] = useState(false);
  const [totpCode, setTotpCode] = useState("");

  // First-time setup state
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Password strength check
  const isLengthValid = newPassword.length >= 12;
  const isMatch = newPassword.length > 0 && newPassword === confirmPassword;

  // Handle Standard Login
  const handleStandardLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setErrorMsg("Vui lòng nhập mật khẩu quản trị.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          password: password.trim(),
          totpCode: require2FA ? totpCode.trim() : undefined,
        }),
      });

      const data = await res.json();

      if (data.require2FA) {
        setRequire2FA(true);
        setErrorMsg("");
        return;
      }

      if (data.success) {
        onLoginSuccess(false);
      } else {
        setErrorMsg(data.error || "Mật khẩu không chính xác.");
      }
    } catch {
      setErrorMsg("Lỗi kết nối máy chủ. Vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle First-time Setup
  const handleInitialSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 12) {
      setErrorMsg("Mật khẩu phải có độ dài tối thiểu 12 ký tự.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMsg("Mật khẩu xác nhận không trùng khớp.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "setup_initial",
          newPassword: newPassword.trim(),
          confirmPassword: confirmPassword.trim(),
        }),
      });

      const data = await res.json();
      if (data.success) {
        onLoginSuccess(true); // require2FAPrompt = true
      } else {
        setErrorMsg(data.error || "Không thể khởi tạo mật khẩu.");
      }
    } catch {
      setErrorMsg("Lỗi kết nối khi thiết lập mật khẩu.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      data-admin-page="true"
      className="admin-shell min-h-screen bg-[var(--bg)] text-[var(--text)] flex items-center justify-center p-4 selection:bg-[var(--accent)] selection:text-black"
    >
      <div className="admin-card w-full max-w-md p-6 sm:p-8 shadow-2xl flex flex-col items-center">
        {/* Brand Icon */}
        <div className="w-14 h-14 rounded-2xl admin-icon-circle flex items-center justify-center mb-4 shadow-sm">
          <Sparkles className="w-7 h-7 text-[var(--accent)]" />
        </div>

        <div className="text-center mb-6">
          <span className="admin-label text-[var(--accent)] block">
            Cẩm Cù House • Quản Trị Hệ Thống
          </span>
          <h1 className="admin-h1 font-serif text-[var(--text)] mt-1">
            {needsFirstLogin
              ? "Khởi Tạo Mật Khẩu Quản Trị"
              : require2FA
              ? "Xác Thực 2 Lớp (2FA)"
              : "Đăng Nhập Quản Trị"}
          </h1>
          <p className="admin-subtle mt-1.5 max-w-xs leading-relaxed mx-auto">
            {needsFirstLogin
              ? "Hệ thống yêu cầu thiết lập mật khẩu mạnh (tối thiểu 12 ký tự) cho lần truy cập đầu tiên."
              : require2FA
              ? "Vui lòng mở ứng dụng Google Authenticator và nhập mã xác thực 6 số."
              : "Nhập mật khẩu an toàn để tiếp tục truy cập quản lý quán."}
          </p>
        </div>

        {/* Error Notification */}
        {errorMsg && (
          <div className="w-full mb-4 p-3 rounded-xl bg-[rgba(242,139,130,0.15)] border border-[var(--danger)] text-[var(--danger)] text-[13px] font-semibold">
            {errorMsg}
          </div>
        )}

        {/* Form 1: First-time Strong Password Setup */}
        {needsFirstLogin ? (
          <form onSubmit={handleInitialSetup} className="w-full flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-bold text-[var(--text)]">
                Mật Khẩu Mới (≥ 12 ký tự)
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Nhập tối thiểu 12 ký tự an toàn..."
                  className="w-full min-h-[44px] py-3 pl-4 pr-11 bg-[var(--surface-2)] border border-[var(--border)] rounded-xl text-[14px] text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="w-11 h-11 absolute right-0 top-0 flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text)]"
                  aria-label="Hiện/ẩn mật khẩu"
                >
                  {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-bold text-[var(--text)]">
                Xác Nhận Mật Khẩu
              </label>
              <input
                type={showNewPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Nhập lại mật khẩu..."
                className="w-full min-h-[44px] py-3 px-4 bg-[var(--surface-2)] border border-[var(--border)] rounded-xl text-[14px] text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
              />
            </div>

            {/* Password Checklist */}
            <div className="p-3 bg-[var(--surface-2)] rounded-xl border border-[var(--border)] flex flex-col gap-1.5 text-[13px]">
              <div className="flex items-center gap-2">
                <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[10px] font-bold ${isLengthValid ? "bg-[var(--success)] text-black" : "bg-[var(--border)] text-[var(--text-muted)]"}`}>
                  ✓
                </span>
                <span className={isLengthValid ? "text-[var(--success)] font-semibold" : "admin-subtle"}>
                  Tối thiểu 12 ký tự ({newPassword.length}/12)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[10px] font-bold ${isMatch ? "bg-[var(--success)] text-black" : "bg-[var(--border)] text-[var(--text-muted)]"}`}>
                  ✓
                </span>
                <span className={isMatch ? "text-[var(--success)] font-semibold" : "admin-subtle"}>
                  Mật khẩu xác nhận trùng khớp
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !isLengthValid || !isMatch}
              className="mt-2 w-full min-h-[44px] py-3 rounded-xl bg-[var(--btn-primary)] hover:opacity-95 disabled:opacity-50 text-[var(--btn-primary-text)] font-bold text-[15px] shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              <span>{isSubmitting ? "Đang thiết lập..." : "Lưu Mật Khẩu & Bật 2FA"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        ) : (
          /* Form 2: Standard Login */
          <form onSubmit={handleStandardLogin} className="w-full flex flex-col gap-4">
            {!require2FA ? (
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-bold text-[var(--text)]">
                  Mật Khẩu Quản Trị
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Nhập mật khẩu..."
                    className="w-full min-h-[44px] py-3 pl-4 pr-11 bg-[var(--surface-2)] border border-[var(--border)] rounded-xl text-[14px] text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="w-11 h-11 absolute right-0 top-0 flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text)]"
                    aria-label="Hiện/ẩn mật khẩu"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-bold text-[var(--text)]">
                  Mã Xác Thực TOTP (6 Số)
                </label>
                <input
                  type="text"
                  maxLength={9}
                  value={totpCode}
                  onChange={(e) => setTotpCode(e.target.value)}
                  placeholder="000000"
                  className="w-full min-h-[44px] py-3 px-4 bg-[var(--surface-2)] border border-[var(--border)] rounded-xl text-center font-mono text-xl tracking-widest text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] font-bold"
                  autoFocus
                />
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 w-full min-h-[44px] py-3 rounded-xl bg-[var(--btn-primary)] hover:opacity-95 disabled:opacity-50 text-[var(--btn-primary-text)] font-bold text-[15px] shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              <Lock className="w-4 h-4" />
              <span>
                {isSubmitting
                  ? "Đang xác thực..."
                  : require2FA
                  ? "Xác Nhận 2FA"
                  : "Đăng Nhập"}
              </span>
            </button>

            {require2FA && (
              <button
                type="button"
                onClick={() => {
                  setRequire2FA(false);
                  setTotpCode("");
                }}
                className="text-[13px] text-[var(--text-muted)] hover:text-[var(--text)] underline mt-1 text-center min-h-[44px] flex items-center justify-center"
              >
                ← Quay lại nhập mật khẩu
              </button>
            )}
          </form>
        )}

        <a
          href="https://camcuhouse.online"
          className="mt-6 text-[13px] text-[var(--text-muted)] hover:text-[var(--accent)] underline transition-colors"
        >
          ← Quay lại trang chủ Cẩm Cù House
        </a>
      </div>
    </div>
  );
}
