'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, Mail, User, Phone, Eye, EyeOff, Loader2, Sparkles, LogIn, UserPlus } from 'lucide-react';
import { useCustomerAuth } from '@/context/CustomerAuthContext';
import { useApp } from '@/context/AppContext';

export default function CustomerAuthModal() {
  const { isAuthModalOpen, closeAuthModal, authModalMode, openAuthModal, login, register } = useCustomerAuth();
  const { language } = useApp();
  const isEn = language === 'en';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    if (authModalMode === 'login') {
      const res = await login({ email: email.trim(), password });
      if (!res.success) {
        setErrorMessage(res.error || (isEn ? 'Invalid credentials' : 'Đăng nhập không thành công'));
      }
    } else {
      if (!fullName.trim()) {
        setErrorMessage(isEn ? 'Full name is required' : 'Vui lòng nhập họ và tên');
        setLoading(false);
        return;
      }
      const res = await register({
        email: email.trim(),
        password,
        fullName: fullName.trim(),
        phone: phone.trim() || undefined,
      });
      if (!res.success) {
        setErrorMessage(res.error || (isEn ? 'Registration failed' : 'Đăng ký không thành công'));
      }
    }
    setLoading(false);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-md bg-paper dark:bg-forest-950 rounded-3xl border border-forest-200 dark:border-forest-800 shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="p-5 sm:p-6 pb-4 border-b border-forest-200 dark:border-forest-800 bg-white/70 dark:bg-forest-900/70 backdrop-blur-md flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-accent-botanical" />
              <span className="font-serif text-base font-bold text-ink-primary">
                {isEn ? 'Sanctuary Customer Portal' : 'Tài Khoản Khách Quý'}
              </span>
            </div>
            <button
              onClick={closeAuthModal}
              aria-label="Đóng"
              className="p-1.5 rounded-xl text-ink-muted hover:text-ink-primary hover:bg-forest-100 dark:hover:bg-forest-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tab Switcher */}
          <div className="flex border-b border-forest-200 dark:border-forest-800 bg-forest-50/50 dark:bg-forest-900/50 p-1.5 m-5 mb-0 rounded-2xl">
            <button
              type="button"
              onClick={() => {
                setErrorMessage('');
                openAuthModal('login');
              }}
              className={`flex-1 py-2.5 rounded-xl font-mono text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                authModalMode === 'login'
                  ? 'bg-white dark:bg-forest-800 text-accent-botanical shadow-sm'
                  : 'text-ink-muted hover:text-ink-primary'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>{isEn ? 'Sign In' : 'Đăng Nhập'}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setErrorMessage('');
                openAuthModal('register');
              }}
              className={`flex-1 py-2.5 rounded-xl font-mono text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                authModalMode === 'register'
                  ? 'bg-white dark:bg-forest-800 text-accent-botanical shadow-sm'
                  : 'text-ink-muted hover:text-ink-primary'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>{isEn ? 'Register' : 'Đăng Ký'}</span>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
            {errorMessage && (
              <div className="p-3 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-xs font-mono text-red-600 dark:text-red-400">
                {errorMessage}
              </div>
            )}

            {authModalMode === 'register' && (
              <>
                <div className="space-y-1.5">
                  <label className="block text-xs font-mono font-medium text-ink-muted">
                    {isEn ? 'Full Name' : 'Họ và tên'} *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-ink-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder={isEn ? 'Nguyen Van A' : 'Nguyễn Văn A'}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-forest-900 border border-forest-200 dark:border-forest-800 text-xs font-mono text-ink-primary focus:outline-none focus:border-accent-botanical"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-mono font-medium text-ink-muted">
                    {isEn ? 'Phone Number' : 'Số điện thoại'} (tùy chọn)
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-ink-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="038 285 1688"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-forest-900 border border-forest-200 dark:border-forest-800 text-xs font-mono text-ink-primary focus:outline-none focus:border-accent-botanical"
                    />
                  </div>
                </div>
              </>
            )}

            <div className="space-y-1.5">
              <label className="block text-xs font-mono font-medium text-ink-muted">
                Email *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-ink-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="khachquy@camcuhouse.online"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-forest-900 border border-forest-200 dark:border-forest-800 text-xs font-mono text-ink-primary focus:outline-none focus:border-accent-botanical"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-mono font-medium text-ink-muted">
                {isEn ? 'Password' : 'Mật khẩu'} *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-ink-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-white dark:bg-forest-900 border border-forest-200 dark:border-forest-800 text-xs font-mono text-ink-primary focus:outline-none focus:border-accent-botanical"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink-primary p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 py-3 px-5 rounded-2xl bg-accent-botanical hover:bg-forest-800 text-white font-mono text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-accent-botanical/20 transition-all active:scale-[0.99] disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{isEn ? 'Processing...' : 'Đang xử lý...'}</span>
                </>
              ) : (
                <span>
                  {authModalMode === 'login'
                    ? (isEn ? 'Sign In to Account' : 'Đăng Nhập Tài Khoản')
                    : (isEn ? 'Complete Registration' : 'Hoàn Tất Đăng Ký')}
                </span>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

