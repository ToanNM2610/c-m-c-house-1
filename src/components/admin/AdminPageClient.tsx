'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Layout,
  UtensilsCrossed,
  Camera,
  Music,
  Sparkles,
  FileText,
  Search,
  Users,
  MessageSquare,
  Cpu,
  Settings,
  ExternalLink,
  ShieldCheck,
  Shield,
  Menu,
  X,
  Clock,
  LogOut,
  Loader2,
} from 'lucide-react';
import AdminLogin from '@/components/admin/AdminLogin';
import AdminCMSHome from '@/components/admin/AdminCMSHome';
import AdminMenuManager from '@/components/admin/AdminMenuManager';
import AdminGalleryManager from '@/components/admin/AdminGalleryManager';
import AdminEventsManager from '@/components/admin/AdminEventsManager';
import AdminStoriesTeamManager from '@/components/admin/AdminStoriesTeamManager';
import AdminPagesFaqManager from '@/components/admin/AdminPagesFaqManager';
import AdminSeoManager from '@/components/admin/AdminSeoManager';
import AdminUsersManager from '@/components/admin/AdminUsersManager';
import AdminInteractionsManager from '@/components/admin/AdminInteractionsManager';
import AdminOpsManager from '@/components/admin/AdminOpsManager';
import AdminSettingsManager from '@/components/admin/AdminSettingsManager';
import AnalyticsTab from '@/components/admin/AnalyticsTab';
import IntegrationsTab from '@/components/admin/IntegrationsTab';
import SearchConsoleTab from '@/components/admin/SearchConsoleTab';
import { AdminUserSafe } from '@/types';

export type AdminTab =
  | 'analytics'
  | 'integrations'
  | 'searchConsole'
  | 'home-cms'
  | 'menu-cms'
  | 'gallery-cms'
  | 'events-cms'
  | 'stories-team'
  | 'pages-faq'
  | 'seo-url'
  | 'users'
  | 'interactions'
  | 'ops'
  | 'settings';

interface ModuleNavGroup {
  moduleLabel: string;
  items: {
    id: AdminTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    allowedRoles: ('SUPER_ADMIN' | 'EDITOR' | 'SEO_MANAGER')[];
  }[];
}

export default function AdminPageClient({ initialTab = 'home-cms' }: { initialTab?: AdminTab }) {
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [currentUser, setCurrentUser] = useState<AdminUserSafe | null>(null);
  const [activeTab, setActiveTab] = useState<AdminTab>(initialTab);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [vnTime, setVnTime] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const mainContentRef = React.useRef<HTMLElement | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    window.setTimeout(() => setToastMessage(null), 3500);
  };

  // Auto-scroll main content area back to top when switching modules/tabs
  useEffect(() => {
    if (mainContentRef.current) {
      mainContentRef.current.scrollTo({ top: 0, behavior: 'auto' });
    }
  }, [activeTab]);

  // Clock in Asia/Ho_Chi_Minh (GMT+7)
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const utc = now.getTime() + now.getTimezoneOffset() * 60000;
      const vn = new Date(utc + 3600000 * 7);
      setVnTime(
        vn.toLocaleTimeString('vi-VN', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Check existing session on load
  useEffect(() => {
    const verifySession = async () => {
      try {
        const res = await fetch('/api/auth/me', { credentials: 'include' });
        const json = await res.json();
        if (res.ok && json.success && json.data) {
          const user: AdminUserSafe = json.data;
          setCurrentUser(user);
          if (user.role === 'SEO_MANAGER' && initialTab === 'home-cms') {
            setActiveTab('seo-url');
          }
        } else {
          setCurrentUser(null);
        }
      } catch {
        setCurrentUser(null);
      } finally {
        setCheckingAuth(false);
      }
    };
    verifySession();
  }, [initialTab]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setCurrentUser(null);
    }
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 text-white">
        <Loader2 className="w-10 h-10 animate-spin text-emerald-400 mb-3" />
        <p className="text-xs font-mono text-emerald-200">Đang kiểm tra phiên làm việc...</p>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <AdminLogin
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          if (user.role === 'SEO_MANAGER' && initialTab === 'home-cms') {
            setActiveTab('seo-url');
          }
        }}
      />
    );
  }

  // 5 Enterprise Modules Definition
  const moduleGroups: ModuleNavGroup[] = [
    {
      moduleLabel: 'MODULE 1: QUẢN LÝ NỘI DUNG (CMS)',
      items: [
        { id: 'home-cms', label: 'Trang chủ & Giao diện', icon: Layout, allowedRoles: ['SUPER_ADMIN', 'EDITOR'] },
        { id: 'menu-cms', label: 'Thực đơn 7 Danh mục', icon: UtensilsCrossed, allowedRoles: ['SUPER_ADMIN', 'EDITOR'] },
        { id: 'gallery-cms', label: 'Thư viện 30 Bản khắc', icon: Camera, allowedRoles: ['SUPER_ADMIN', 'EDITOR'] },
        { id: 'events-cms', label: 'Tin tức & Sự kiện', icon: Music, allowedRoles: ['SUPER_ADMIN', 'EDITOR'] },
        { id: 'stories-team', label: 'Cột mốc & Đội ngũ', icon: Sparkles, allowedRoles: ['SUPER_ADMIN', 'EDITOR'] },
        { id: 'pages-faq', label: 'Trang pháp lý & FAQ', icon: FileText, allowedRoles: ['SUPER_ADMIN', 'EDITOR'] },
      ],
    },
    {
      moduleLabel: 'MODULE 2: QUẢN LÝ SEO & URL',
      items: [
        { id: 'seo-url', label: 'SEO Google & Điều hướng 301/302', icon: Search, allowedRoles: ['SUPER_ADMIN', 'SEO_MANAGER'] },
      ],
    },
    {
      moduleLabel: 'MODULE 3: NGƯỜI DÙNG & PHÂN QUYỀN',
      items: [
        { id: 'users', label: 'Tài khoản & Phân quyền RBAC', icon: Users, allowedRoles: ['SUPER_ADMIN'] },
      ],
    },
    {
      moduleLabel: 'MODULE 4: TƯƠNG TÁC & TÍCH HỢP',
      items: [
        { id: 'analytics', label: 'Google Analytics 4', icon: MessageSquare, allowedRoles: ['SUPER_ADMIN', 'SEO_MANAGER'] },
        { id: 'searchConsole', label: 'Google Search Console', icon: Search, allowedRoles: ['SUPER_ADMIN', 'SEO_MANAGER'] },
        { id: 'integrations', label: 'Tích hợp & Khóa', icon: Settings, allowedRoles: ['SUPER_ADMIN'] },
        { id: 'interactions', label: 'Hộp thư, Đánh giá & Tiếp thị', icon: MessageSquare, allowedRoles: ['SUPER_ADMIN', 'EDITOR'] },
      ],
    },
    {
      moduleLabel: 'MODULE 5: KỸ THUẬT & VẬN HÀNH',
      items: [
        { id: 'ops', label: 'Sao lưu DB, Cache & Logs', icon: Cpu, allowedRoles: ['SUPER_ADMIN'] },
      ],
    },
    {
      moduleLabel: 'CÀI ĐẶT TỔNG QUAN',
      items: [
        { id: 'settings', label: 'Cài đặt Quán & Chân trang', icon: Settings, allowedRoles: ['SUPER_ADMIN', 'EDITOR', 'SEO_MANAGER'] },
      ],
    },
  ];

  return (
    <div className="h-screen overflow-hidden bg-slate-100 flex flex-col">
      {/* Top Header Operational Bar */}
      <header className="bg-slate-900 text-white px-4 sm:px-6 py-3 border-b border-slate-800 flex items-center justify-between shrink-0 z-40">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 lg:hidden"
            aria-label="Menu"
          >
            {mobileDrawerOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="flex items-center gap-2">
            <span className="font-serif text-lg font-bold text-white tracking-tight">
              CẨM CÙ HOUSE
            </span>
            <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded font-bold hidden sm:inline">
              ENTERPRISE 5-MODULE CMS
            </span>
          </div>
        </div>

        {/* Status Indicators & Authenticated User Info */}
        <div className="flex items-center gap-3 sm:gap-4 text-xs font-mono">
          {/* Logged in User Profile Badge */}
          <div className="flex items-center gap-2 bg-slate-800/90 border border-slate-700/80 px-2.5 py-1 rounded-xl">
            <div className="w-6 h-6 rounded-full bg-emerald-600/30 text-emerald-400 flex items-center justify-center font-bold text-xs border border-emerald-500/40">
              {currentUser.fullName.charAt(0).toUpperCase()}
            </div>
            <div className="hidden lg:flex flex-col text-left">
              <span className="text-white text-xs font-semibold leading-tight">{currentUser.fullName}</span>
              <span className="text-[10px] text-slate-400 font-mono">@{currentUser.username}</span>
            </div>
            {currentUser.role === 'SUPER_ADMIN' ? (
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-md border border-emerald-500/30">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                <span>Super Admin</span>
              </span>
            ) : currentUser.role === 'SEO_MANAGER' ? (
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-md border border-amber-500/30">
                <Search className="w-3 h-3 text-amber-400" />
                <span>SEO Manager</span>
              </span>
            ) : (
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-sky-500/20 text-sky-300 px-2 py-0.5 rounded-md border border-sky-500/30">
                <Shield className="w-3 h-3 text-sky-400" />
                <span>Biên tập viên</span>
              </span>
            )}
          </div>

          {/* Clock */}
          <div className="hidden md:flex items-center gap-1.5 text-emerald-400 font-bold bg-slate-800/80 px-2.5 py-1 rounded-md">
            <Clock className="w-3.5 h-3.5" />
            <span>{vnTime} (GMT+7)</span>
          </div>

          {/* Link back to Customer Storefront */}
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-slate-300 hover:text-emerald-400 transition-colors px-2 py-1 rounded-lg bg-slate-800"
            title="Mở giao diện khách hàng ở tab mới"
          >
            <span className="hidden md:inline">Xem Web Khách</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          {/* Logout button */}
          <button
            onClick={handleLogout}
            title="Đăng xuất khỏi hệ thống"
            className="flex items-center gap-1.5 px-2.5 py-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg transition-colors text-xs font-mono font-medium"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Đăng xuất</span>
          </button>
        </div>
      </header>

      {/* Main Layout: Fixed Sidebar + Independent Scrolling Workspace */}
      <div className="flex-1 flex min-h-0 overflow-hidden">
        {/* Desktop Fixed Sidebar Navigation */}
        <aside className="w-72 bg-slate-900 text-slate-300 hidden lg:flex shrink-0 h-full flex-col justify-between p-4 border-r border-slate-800 overflow-y-auto [scrollbar-width:thin] [scrollbar-color:#334155_transparent] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-700/60 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-slate-600">
          <div className="space-y-4">
            {moduleGroups.map((group, gIdx) => {
              const visibleItems = group.items.filter((item) =>
                item.allowedRoles.includes(currentUser.role)
              );
              if (visibleItems.length === 0) return null;

              return (
                <div key={gIdx} className="space-y-1">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500 px-3 py-1 font-bold">
                    {group.moduleLabel}
                  </div>
                  {visibleItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-colors duration-75 ${
                          isActive
                            ? 'bg-emerald-600 text-white font-semibold shadow-sm'
                            : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon className="w-4 h-4 shrink-0" />
                          <span className="truncate">{item.label}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              );
            })}
          </div>

          {/* Footer status card */}
          <div className="p-3 bg-slate-800/60 rounded-xl text-[11px] font-mono text-slate-400 space-y-1.5 border border-slate-700/50 mt-4 shrink-0">
            <div className="text-emerald-400 font-semibold flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Phiên làm việc Staff</span>
            </div>
            <div className="text-white text-xs truncate">
              {currentUser.fullName}
            </div>
            <div className="text-slate-400 text-[10px]">
              Vai trò:{' '}
              <span className="text-emerald-300 font-bold">
                {currentUser.role === 'SUPER_ADMIN'
                  ? 'Super Admin'
                  : currentUser.role === 'SEO_MANAGER'
                  ? 'SEO Manager'
                  : 'Biên tập viên'}
              </span>
            </div>
          </div>
        </aside>

        {/* Mobile Navigation Drawer */}
        {mobileDrawerOpen && (
          <div
            className="lg:hidden fixed inset-0 z-50 bg-black/80 flex"
            onClick={() => setMobileDrawerOpen(false)}
          >
            <div
              className="w-72 bg-slate-900 text-slate-300 p-6 flex flex-col justify-between h-full overflow-y-auto shadow-2xl [scrollbar-width:thin] [scrollbar-color:#334155_transparent] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-700/60"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <span className="font-serif text-lg font-bold text-white">CẨM CÙ HOUSE</span>
                  <button
                    onClick={() => setMobileDrawerOpen(false)}
                    className="text-slate-400 hover:text-white"
                    aria-label="Đóng menu"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  {moduleGroups.map((group, gIdx) => {
                    const visibleItems = group.items.filter((item) =>
                      item.allowedRoles.includes(currentUser.role)
                    );
                    if (visibleItems.length === 0) return null;

                    return (
                      <div key={gIdx} className="space-y-1">
                        <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500 px-3 py-1 font-bold">
                          {group.moduleLabel}
                        </div>
                        {visibleItems.map((item) => {
                          const Icon = item.icon;
                          const isActive = activeTab === item.id;
                          return (
                            <button
                              key={item.id}
                              onClick={() => {
                                setActiveTab(item.id);
                                setMobileDrawerOpen(false);
                              }}
                              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-colors duration-75 ${
                                isActive ? 'bg-emerald-600 text-white font-semibold' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                              }`}
                            >
                              <div className="flex items-center gap-2.5">
                                <Icon className="w-4 h-4 shrink-0" />
                                <span className="truncate">{item.label}</span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-2 pt-4 shrink-0">
                <button
                  onClick={handleLogout}
                  className="w-full py-2.5 text-center bg-red-600/20 text-red-400 rounded-xl text-xs font-mono block hover:bg-red-600/30 transition-colors"
                >
                  Đăng xuất
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Workspace Canvas (Independent Scrolling) */}
        <main
          ref={mainContentRef}
          className="flex-1 h-full overflow-y-auto overflow-x-hidden p-4 sm:p-8 [scrollbar-width:thin] [scrollbar-color:#94a3b8_transparent] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-300 hover:[&::-webkit-scrollbar-thumb]:bg-slate-400 [&::-webkit-scrollbar-thumb]:rounded-full"
        >
          <div className="max-w-6xl mx-auto pb-16">
            {activeTab === 'analytics' && (
              <AnalyticsTab
                onSwitchToIntegrations={() => setActiveTab('integrations')}
                onShowToast={showToast}
              />
            )}
            {activeTab === 'searchConsole' && (
              <SearchConsoleTab
                onSwitchToIntegrations={() => setActiveTab('integrations')}
                onShowToast={showToast}
              />
            )}
            {activeTab === 'integrations' && <IntegrationsTab onShowToast={showToast} />}

            {/* Module 1 */}
            {activeTab === 'home-cms' && <AdminCMSHome />}
            {activeTab === 'menu-cms' && <AdminMenuManager />}
            {activeTab === 'gallery-cms' && <AdminGalleryManager />}
            {activeTab === 'events-cms' && <AdminEventsManager />}
            {activeTab === 'stories-team' && <AdminStoriesTeamManager />}
            {activeTab === 'pages-faq' && <AdminPagesFaqManager />}

            {/* Module 2 */}
            {activeTab === 'seo-url' && <AdminSeoManager />}

            {/* Module 3 */}
            {activeTab === 'users' && (
              <AdminUsersManager
                currentUser={currentUser}
                onCurrentUserUpdate={(updatedUser) => setCurrentUser(updatedUser)}
              />
            )}

            {/* Module 4 */}
            {activeTab === 'interactions' && <AdminInteractionsManager />}

            {/* Module 5 */}
            {activeTab === 'ops' && <AdminOpsManager />}

            {/* General Settings */}
            {activeTab === 'settings' && <AdminSettingsManager />}
          </div>
        </main>
      </div>
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-5 right-5 z-[70] rounded-xl bg-slate-900 border border-slate-700/80 px-4 py-3 text-sm text-white shadow-2xl animate-in fade-in slide-in-from-bottom-2 duration-150"
        >
          {toastMessage}
        </div>
      )}
    </div>
  );
}
