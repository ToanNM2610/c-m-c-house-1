'use client';

import React, { useState } from 'react';
import { ShieldCheck, User, Lock, Eye, EyeOff, Sparkles, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';
import { AdminUserSafe } from '@/types';

interface AdminLoginProps {
  onLoginSuccess: (user: AdminUserSafe) => void;
}

export default function AdminLogin({ onLoginSuccess }: AdminLoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password) {
      setError('Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: username.trim(),
          password,
        }),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        setError(json.error || 'Sai tên đăng nhập hoặc mật khẩu');
        return;
      }

      onLoginSuccess(json.data);
    } catch {
      setError('Lỗi kết nối máy chủ xác thực. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  const handleAutofillDefault = () => {
    setUsername('admin');
    setPassword('admin123');
    setError('');
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-800">
        {/* Header Banner */}
        <div className="p-8 bg-gradient-to-br from-emerald-800 to-slate-900 text-white text-center space-y-2">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-white/20 flex items-center justify-center border border-white/20">
            <ShieldCheck className="w-8 h-8 text-emerald-400" />
          </div>
          <h2 className="font-serif text-2xl font-bold tracking-tight">
            CẨM CÙ HOUSE
          </h2>
          <p className="text-xs text-emerald-200/90 font-mono tracking-wide">
            HỆ THỐNG QUẢN TRỊ CMS & PHÂN QUYỀN NHÂN VIÊN
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          {error && (
            <div className="p-3.5 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs font-mono flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          {/* Username input */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-slate-500 mb-2 font-medium">
              Tên đăng nhập (Username):
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setError('');
                }}
                placeholder="Nhập tên đăng nhập (vd: admin)"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-emerald-600 focus:bg-white transition-all"
                autoFocus
                required
              />
            </div>
          </div>

          {/* Password input with eye toggle */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-slate-500 mb-2 font-medium">
              Mật khẩu (Password):
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                placeholder="Nhập mật khẩu"
                className="w-full pl-10 pr-11 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-emerald-600 focus:bg-white transition-all"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 transition-colors"
                title={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4 text-slate-400" />}
              </button>
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-emerald-600 text-white font-medium rounded-xl hover:bg-emerald-700 transition-all text-sm flex items-center justify-center gap-2 shadow-md active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Đang xác thực...</span>
              </>
            ) : (
              <>
                <span>Đăng nhập Bảng Điều Khiển</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          {/* 1-Click Default Admin Autofill Button */}
          <div className="pt-2 text-center border-t border-slate-100">
            <div className="text-[11px] font-mono text-slate-400 mb-2">
              Tài khoản mặc định: <span className="font-semibold text-slate-700">admin</span> / <span className="font-semibold text-slate-700">admin123</span>
            </div>
            <button
              type="button"
              onClick={handleAutofillDefault}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-50 text-emerald-800 rounded-lg text-xs font-mono hover:bg-emerald-100 transition-colors border border-emerald-200"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Điền nhanh tài khoản mặc định</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
