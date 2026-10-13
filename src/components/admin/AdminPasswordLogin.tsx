"use client";

import React, { useState } from "react";
import { Lock, Shield, Eye, EyeOff, Sparkles, CheckCircle2, ArrowRight } from "lucide-react";

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
  const hasMixedCase = /[a-z]/.test(newPassword) && /[A-Z]/.test(newPassword);
  const hasNumber = /[0-9]/.test(newPassword);
  const hasSpecial = /[^A-Za-z0-9]/.test(newPassword);
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
    <div className="min-h-screen bg-[#121A15] text-[#FDFBF7] flex items-center justify-center p-4 selection:bg-[#3E5C46] selection:text-white">
      <div className="w-full max-w-md bg-[#1B281D] border border-[rgba(253,251,247,0.12)] rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col items-center">
        {/* Brand Icon */}
        <div className="w-14 h-14 rounded-2xl bg-[#3E5C46] text-white flex items-center justify-center mb-4 shadow-lg ring-4 ring-[#3E5C46]/20">
          <Sparkles className="w-7 h-7" />
        </div>

        <div className="text-center mb-6">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#9DC183]">
            Cẩm Cù House • Quản Trị Hệ Thống
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold mt-1 text-white">
            {needsFirstLogin
              ? "Khởi Tạo Mật Khẩu Quản Trị"
              : require2FA
              ? "Xác Thực 2 Lớp (2FA)"
              : "Đăng Nhập Quản Trị"}
          </h1>
          <p className="text-xs text-stone-300 mt-1 max-w-xs leading-relaxed">
            {needsFirstLogin
              ? "Hệ thống yêu cầu thiết lập mật khẩu mạnh (tối thiểu 12 ký tự) cho lần truy cập đầu tiên."
              : require2FA
              ? "Vui lòng mở ứng dụng Google Authenticator và nhập mã xác thực 6 số."
              : "Nhập mật khẩu an toàn để tiếp tục truy cập quản lý quán."}
          </p>
        </div>

        {/* Error Notification */}
        {errorMsg && (
          <div className="w-full mb-4 p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-200 text-xs font-semibold animate-shake">
            {errorMsg}
          </div>
        )}

        {/* Form 1: First-time Strong Password Setup */}
        {needsFirstLogin ? (
          <form onSubmit={handleInitialSetup} className="w-full flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-stone-300">
                Mật Khẩu Mới (≥ 12 ký tự)
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Nhập tối thiểu 12 ký tự an toàn..."
                  className="w-full py-3 pl-4 pr-11 bg-[#121A15] border border-stone-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#3E5C46]"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-3 text-stone-400 hover:text-stone-200"
                >
                  {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-stone-300">
                Xác Nhận Mật Khẩu
              </label>
              <input
                type={showNewPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Nhập lại mật khẩu..."
                className="w-full py-3 px-4 bg-[#121A15] border border-stone-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#3E5C46]"
              />
            </div>

            {/* Password Checklist */}
            <div className="p-3 bg-[#121A15] rounded-xl border border-stone-800 flex flex-col gap-1.5 text-[11px]">
              <div className="flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full flex items-center justify-center ${isLengthValid ? "bg-emerald-500 text-black" : "bg-stone-700 text-stone-400"}`}>
                  ✓
                </span>
                <span className={isLengthValid ? "text-emerald-400 font-semibold" : "text-stone-400"}>
                  Tối thiểu 12 ký tự ({newPassword.length}/12)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full flex items-center justify-center ${isMatch ? "bg-emerald-500 text-black" : "bg-stone-700 text-stone-400"}`}>
                  ✓
                </span>
                <span className={isMatch ? "text-emerald-400 font-semibold" : "text-stone-400"}>
                  Mật khẩu xác nhận trùng khớp
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !isLengthValid || !isMatch}
              className="mt-2 w-full py-3.5 rounded-xl bg-[#3E5C46] hover:bg-[#2D4233] disabled:opacity-50 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
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
                <label className="text-xs font-bold text-stone-300">
                  Mật Khẩu Quản Trị
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Nhập mật khẩu..."
                    className="w-full py-3 pl-4 pr-11 bg-[#121A15] border border-stone-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#3E5C46]"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-stone-400 hover:text-stone-200"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-stone-300">
                  Mã Xác Thực TOTP (6 Số)
                </label>
                <input
                  type="text"
                  maxLength={9}
                  value={totpCode}
                  onChange={(e) => setTotpCode(e.target.value)}
                  placeholder="000000"
                  className="w-full py-3 px-4 bg-[#121A15] border border-stone-700 rounded-xl text-center font-mono text-xl tracking-widest text-white focus:outline-none focus:ring-2 focus:ring-[#3E5C46]"
                  autoFocus
                />
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 w-full py-3.5 rounded-xl bg-[#3E5C46] hover:bg-[#2D4233] disabled:opacity-50 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
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
                className="text-xs text-stone-400 hover:text-stone-200 underline mt-1 text-center"
              >
                ← Quay lại nhập mật khẩu
              </button>
            )}
          </form>
        )}

        <a
          href="https://camcuhouse.online"
          className="mt-6 text-xs text-stone-400 hover:text-[#9DC183] underline transition-colors"
        >
          ← Quay lại trang chủ Cẩm Cù House
        </a>
      </div>
    </div>
  );
}
