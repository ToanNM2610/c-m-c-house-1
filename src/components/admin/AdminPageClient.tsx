'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Layout,
  UtensilsCrossed,
  Camera,
  Music,
  FileText,
  Sparkles,
  Users,
  MessageSquare,
  Search,
  Settings,
  Cpu,
  BarChart3,
  ExternalLink,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Layers,
  Globe,
  Mail,
  ShieldCheck,
  Loader2,
  Key,
  LayoutDashboard,
} from 'lucide-react';
import AdminLogin from '@/components/admin/AdminLogin';
import AdminDashboard from '@/components/admin/AdminDashboard';
import AdminErrorBoundary from '@/components/admin/AdminErrorBoundary';
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
  | 'dashboard'
  // 1. Giao diện 7 Trang Web
  | 'page-home'
  | 'page-about'
  | 'page-space'
  | 'page-menu'
  | 'page-reviews'
  | 'page-news'
  | 'page-contact'
  | 'home-cms' // legacy alias
  // 2. Quản lý Nội dung Quán
  | 'menu-cms'
  | 'gallery-cms'
  | 'events-cms'
  | 'stories-team'
  | 'pages-faq'
  // 3. Khách hàng & Hộp thư
  | 'interactions-inbox'
  | 'interactions-reviews'
  | 'interactions-chat'
  | 'interactions' // legacy alias
  // 4. SEO Google & Đo lường
  | 'seo-url'
  | 'analytics'
  | 'searchConsole'
  | 'integrations'
  // 5. Hệ thống & Cài đặt
  | 'users'
  | 'settings'
  | 'ops';

export interface ChildNavItem {
  id: AdminTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  allowedRoles: ('SUPER_ADMIN' | 'EDITOR' | 'SEO_MANAGER')[];
}

export interface ParentNavGroup {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  allowedRoles: ('SUPER_ADMIN' | 'EDITOR' | 'SEO_MANAGER')[];
  children: ChildNavItem[];
}

// 5 Standard Hierarchical Parent Groups Definition
const parentGroups: ParentNavGroup[] = [
  {
    id: 'group-pages',
    label: 'Giao diện 7 Trang Web',
    icon: Layout,
    allowedRoles: ['SUPER_ADMIN', 'EDITOR'],
    children: [
      { id: 'page-home', label: '1. Trang chủ', icon: Layout, allowedRoles: ['SUPER_ADMIN', 'EDITOR'] },
      { id: 'page-about', label: '2. Giới thiệu', icon: Sparkles, allowedRoles: ['SUPER_ADMIN', 'EDITOR'] },
      { id: 'page-space', label: '3. Không gian', icon: Camera, allowedRoles: ['SUPER_ADMIN', 'EDITOR'] },
      { id: 'page-menu', label: '4. Thực đơn', icon: UtensilsCrossed, allowedRoles: ['SUPER_ADMIN', 'EDITOR'] },
      { id: 'page-reviews', label: '5. Khách hàng', icon: MessageSquare, allowedRoles: ['SUPER_ADMIN', 'EDITOR'] },
      { id: 'page-news', label: '6. Tin tức & FAQ', icon: FileText, allowedRoles: ['SUPER_ADMIN', 'EDITOR'] },
      { id: 'page-contact', label: '7. Liên hệ & Đặt chỗ', icon: Globe, allowedRoles: ['SUPER_ADMIN', 'EDITOR'] },
    ],
  },
  {
    id: 'group-cms-data',
    label: 'Quản lý Nội dung Quán',
    icon: Layers,
    allowedRoles: ['SUPER_ADMIN', 'EDITOR'],
    children: [
      { id: 'menu-cms', label: 'Thực đơn 7 Danh mục', icon: UtensilsCrossed, allowedRoles: ['SUPER_ADMIN', 'EDITOR'] },
      { id: 'gallery-cms', label: 'Không gian 30 Bản khắc', icon: Camera, allowedRoles: ['SUPER_ADMIN', 'EDITOR'] },
      { id: 'events-cms', label: 'Tin tức & Bài viết', icon: Music, allowedRoles: ['SUPER_ADMIN', 'EDITOR'] },
      { id: 'stories-team', label: 'Cột mốc & Đội ngũ', icon: Sparkles, allowedRoles: ['SUPER_ADMIN', 'EDITOR'] },
      { id: 'pages-faq', label: 'Trang pháp lý & FAQ', icon: FileText, allowedRoles: ['SUPER_ADMIN', 'EDITOR'] },
    ],
  },
  {
    id: 'group-interactions',
    label: 'Khách hàng & Hộp thư',
    icon: MessageSquare,
    allowedRoles: ['SUPER_ADMIN', 'EDITOR'],
    children: [
      { id: 'interactions-inbox', label: 'Đặt bàn, BBQ & Liên hệ', icon: Mail, allowedRoles: ['SUPER_ADMIN', 'EDITOR'] },
      { id: 'interactions-reviews', label: 'Duyệt đánh giá', icon: ShieldCheck, allowedRoles: ['SUPER_ADMIN', 'EDITOR'] },
      { id: 'interactions-chat', label: 'Kênh Chat & Pixel', icon: MessageSquare, allowedRoles: ['SUPER_ADMIN', 'EDITOR'] },
    ],
  },
  {
    id: 'group-seo',
    label: 'SEO Google & Đo lường',
    icon: Globe,
    allowedRoles: ['SUPER_ADMIN', 'SEO_MANAGER'],
    children: [
      { id: 'seo-url', label: 'SEO Google & Điều hướng 301/302', icon: Search, allowedRoles: ['SUPER_ADMIN', 'SEO_MANAGER'] },
      { id: 'analytics', label: 'Google Analytics 4', icon: BarChart3, allowedRoles: ['SUPER_ADMIN', 'SEO_MANAGER'] },
      { id: 'searchConsole', label: 'Google Search Console', icon: Globe, allowedRoles: ['SUPER_ADMIN', 'SEO_MANAGER'] },
      { id: 'integrations', label: 'Tích hợp & Khóa API', icon: Key, allowedRoles: ['SUPER_ADMIN'] },
    ],
  },
  {
    id: 'group-system',
    label: 'Hệ thống & Cài đặt',
    icon: ShieldCheck,
    allowedRoles: ['SUPER_ADMIN', 'EDITOR', 'SEO_MANAGER'],
    children: [
      { id: 'settings', label: 'Cài đặt Quán & Chân trang', icon: Settings, allowedRoles: ['SUPER_ADMIN', 'EDITOR', 'SEO_MANAGER'] },
      { id: 'users', label: 'Quản trị viên & Phân quyền', icon: Users, allowedRoles: ['SUPER_ADMIN'] },
      { id: 'ops', label: 'Sao lưu DB, Cache & Logs', icon: Cpu, allowedRoles: ['SUPER_ADMIN'] },
    ],
  },
];

// Fallback cast for AdminCMSHome with activeSubPage prop
const CMSHome = AdminCMSHome as React.ComponentType<{ activeSubPage?: string }>;

export default function AdminPageClient({ initialTab = 'dashboard' }: { initialTab?: AdminTab }) {
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [currentUser, setCurrentUser] = useState<AdminUserSafe | null>(null);
  const [activeTab, setActiveTab] = useState<AdminTab>(initialTab === 'home-cms' ? 'page-home' : initialTab);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [vnTime, setVnTime] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [unreadInquiries, setUnreadInquiries] = useState(0);
  const mainContentRef = useRef<HTMLElement | null>(null);

  // Accordion state for 5 collapsible parent groups
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    'group-pages': true,
    'group-cms-data': true,
    'group-interactions': true,
    'group-seo': true,
    'group-system': true,
  });

  // Fetch live unread inquiries count
  useEffect(() => {
    let mounted = true;
    const fetchCounts = async () => {
      try {
        const res = await fetch('/api/admin/dashboard', { credentials: 'include' });
        const json = await res.json().catch(() => ({}));
        if (!mounted) return;
        if (res.ok && json.success && json.kpis?.reservations?.unread !== undefined) {
          setUnreadInquiries(json.kpis.reservations.unread);
        }
      } catch {
        // ignore
      }
    };
    fetchCounts();
    const interval = setInterval(fetchCounts, 30000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  const showToast = (message: string) => {
    setToastMessage(message);
    window.setTimeout(() => setToastMessage(null), 3500);
  };

  // Helper to find the parent group ID containing a tab
  const findParentGroupId = (tab: AdminTab): string | null => {
    const effectiveTab = tab === 'home-cms' ? 'page-home' : tab === 'interactions' ? 'interactions-inbox' : tab;
    const parent = parentGroups.find((g) => g.children.some((c) => c.id === effectiveTab));
    return parent ? parent.id : null;
  };

  // Restore open groups from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('camcu_admin_sidebar_open');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          setOpenGroups((prev) => ({
            ...prev,
            ...parsed,
          }));
        }
      }
    } catch {
      // ignore JSON parse errors
    }
  }, []);

  // When activeTab changes, auto-expand its parent group and remember state
  useEffect(() => {
    const parentId = findParentGroupId(activeTab);
    if (parentId) {
      setOpenGroups((prev) => {
        if (prev[parentId]) return prev;
        const next = { ...prev, [parentId]: true };
        try {
          localStorage.setItem('camcu_admin_sidebar_open', JSON.stringify(next));
        } catch {
          // ignore storage error
        }
        return next;
      });
    }
  }, [activeTab]);

  // Toggle open/close state of an accordion parent group
  const toggleGroup = (groupId: string) => {
    setOpenGroups((prev) => {
      const next = { ...prev, [groupId]: !prev[groupId] };
      try {
        localStorage.setItem('camcu_admin_sidebar_open', JSON.stringify(next));
      } catch {
        // ignore storage error
      }
      return next;
    });
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
          if (user.role === 'SEO_MANAGER' && initialTab === 'dashboard') {
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
        <p className="text-xs font-mono text-emerald-200 uppercase">Đang kiểm tra phiên làm việc...</p>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <AdminLogin
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          if (user.role === 'SEO_MANAGER') {
            setActiveTab('seo-url');
          }
        }}
      />
    );
  }

  // Filter groups and children by current user role (RBAC)
  const visibleGroups = parentGroups
    .map((group) => {
      const visibleChildren = group.children.filter((child) =>
        child.allowedRoles.includes(currentUser.role)
      );
      return {
        ...group,
        children: visibleChildren,
      };
    })
    .filter((group) => group.allowedRoles.includes(currentUser.role) && group.children.length > 0);

  // Render navigation tree list (shared between Desktop Aside and Mobile Drawer)
  const renderNavTree = (onItemClick?: () => void) => {
    return (
      <div className="space-y-3">
        {/* Top-level Overview Dashboard */}
        {currentUser.role !== 'SEO_MANAGER' && (
          <button
            type="button"
            onClick={() => {
              setActiveTab('dashboard');
              if (onItemClick) onItemClick();
            }}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 ${
              activeTab === 'dashboard'
                ? 'bg-emerald-600 text-white shadow-sm font-bold'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <LayoutDashboard className={`w-4 h-4 shrink-0 ${activeTab === 'dashboard' ? 'text-white' : 'text-emerald-400'}`} />
              <span className="truncate">Tổng quan</span>
            </div>
            {unreadInquiries > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500 text-slate-950">
                {unreadInquiries}
              </span>
            )}
          </button>
        )}

        {visibleGroups.map((group) => {
          const GroupIcon = group.icon;
          const isOpen = !!openGroups[group.id];
          const isGroupActive = group.children.some(
            (c) =>
              c.id === activeTab ||
              (c.id === 'page-home' && activeTab === 'home-cms') ||
              (c.id === 'interactions-inbox' && activeTab === 'interactions')
          );

          return (
            <div key={group.id} className="space-y-1">
              {/* Collapsible Parent Group Header */}
              <button
                type="button"
                onClick={() => toggleGroup(group.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 ${
                  isGroupActive
                    ? 'bg-slate-800/90 text-emerald-400 border border-slate-700/60 shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <GroupIcon className={`w-4 h-4 shrink-0 ${isGroupActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                  <span className="truncate">{group.label}</span>
                  {group.id === 'group-interactions' && unreadInquiries > 0 && (
                    <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold bg-amber-500 text-slate-950 animate-pulse">
                      {unreadInquiries}
                    </span>
                  )}
                </div>
                <ChevronDown
                  className={`w-4 h-4 shrink-0 text-slate-400 transition-transform duration-200 ${
                    isOpen ? 'rotate-0' : '-rotate-90'
                  }`}
                />
              </button>

              {/* Indented Child Items with Vertical Tree Connector */}
              {isOpen && (
                <div className="mt-1 ml-4 pl-3 border-l border-slate-700/70 space-y-1">
                  {group.children.map((child) => {
                    const ChildIcon = child.icon;
                    const isChildActive =
                      activeTab === child.id ||
                      (child.id === 'page-home' && activeTab === 'home-cms') ||
                      (child.id === 'interactions-inbox' && activeTab === 'interactions');

                    return (
                      <button
                        key={child.id}
                        type="button"
                        onClick={() => {
                          setActiveTab(child.id);
                          if (onItemClick) onItemClick();
                        }}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-75 text-left ${
                          isChildActive
                            ? 'bg-emerald-600 text-white font-semibold shadow-sm'
                            : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                        }`}
                      >
                        <ChildIcon
                          className={`w-3.5 h-3.5 shrink-0 ${isChildActive ? 'text-white' : 'text-slate-500'}`}
                        />
                        <span className="truncate">{child.label}</span>
                        {child.id === 'interactions-inbox' && unreadInquiries > 0 && (
                          <span className="ml-auto px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold bg-amber-500 text-slate-950 animate-pulse">
                            {unreadInquiries}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="h-screen overflow-hidden bg-slate-100 flex flex-col">
      {/* Top Header Operational Bar - Pinned (shrink-0 z-40) */}
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
            <span className="text-xs font-mono uppercase bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded font-bold hidden sm:inline">
              STANDARD EDITORIAL CMS
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Real Live Time in VN (GMT+7) */}
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 bg-slate-800/80 rounded-lg text-xs font-mono text-emerald-400 border border-slate-700/50">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
            <span>VN {vnTime || '07:00:00'}</span>
          </div>

          <a
            href="https://camcuhouse.online"
            target="_blank"
            rel="noopener noreferrer"
            title="Mở website chính thức"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-lg transition-colors text-xs font-mono"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Xem trang thật ↗</span>
          </a>

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
        <aside className="w-72 bg-slate-900 text-slate-300 hidden lg:flex shrink-0 h-full flex-col justify-between border-r border-slate-800 overflow-hidden">
          {/* Scrollable Tree Navigation Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 [scrollbar-width:thin] [scrollbar-color:#334155_transparent] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-700/60 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-slate-600">
            {renderNavTree()}
          </div>

          {/* Pinned Staff Session Status Card (NEVER clipped) */}
          <div className="shrink-0 p-4 border-t border-slate-800 bg-slate-900/95">
            <div className="p-3 bg-slate-800/60 rounded-xl text-xs font-mono text-slate-400 space-y-1.5 border border-slate-700/50">
              <div className="text-emerald-400 font-semibold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                <span>Phiên làm việc Staff</span>
              </div>
              <div className="text-white text-sm font-sans truncate">
                {currentUser.fullName}
              </div>
              <div className="text-slate-400 text-xs">
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
          </div>
        </aside>

        {/* Mobile Navigation Drawer */}
        {mobileDrawerOpen && (
          <div
            className="lg:hidden fixed inset-0 z-50 bg-black/80 flex"
            onClick={() => setMobileDrawerOpen(false)}
          >
            <div
              className="w-80 max-w-[85vw] bg-slate-900 text-slate-300 flex flex-col justify-between h-full overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between border-b border-slate-800 p-4 shrink-0">
                <span className="font-serif text-lg font-bold text-white">CẨM CÙ HOUSE</span>
                <button
                  onClick={() => setMobileDrawerOpen(false)}
                  className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
                  aria-label="Đóng menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable Tree Navigation Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 [scrollbar-width:thin] [scrollbar-color:#334155_transparent] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-700/60">
                {renderNavTree(() => setMobileDrawerOpen(false))}
              </div>

              {/* Drawer Pinned Bottom */}
              <div className="p-4 border-t border-slate-800 bg-slate-900/95 space-y-2 shrink-0">
                <div className="p-2.5 bg-slate-800/60 rounded-xl text-xs font-mono text-slate-400 border border-slate-700/50 mb-2">
                  <div className="text-white font-medium truncate">{currentUser.fullName}</div>
                  <div className="text-emerald-400 text-xs">
                    {currentUser.role === 'SUPER_ADMIN'
                      ? 'Super Admin'
                      : currentUser.role === 'SEO_MANAGER'
                      ? 'SEO Manager'
                      : 'Biên tập viên'}
                  </div>
                </div>
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

        {/* Workspace Canvas (Independent Scrolling with Auto-Reset on Tab Switch) */}
        <main
          ref={mainContentRef}
          className="flex-1 h-full overflow-y-auto overflow-x-hidden p-4 sm:p-8 [scrollbar-width:thin] [scrollbar-color:#94a3b8_transparent] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-300 hover:[&::-webkit-scrollbar-thumb]:bg-slate-400 [&::-webkit-scrollbar-thumb]:rounded-full"
        >
          <div className="max-w-6xl mx-auto pb-16">
            {/* Top-level Overview Dashboard */}
            {activeTab === 'dashboard' && (
              <AdminErrorBoundary moduleName="Tổng quan Hệ thống">
                <AdminDashboard onNavigateTab={(tab: AdminTab) => setActiveTab(tab)} />
              </AdminErrorBoundary>
            )}

            {/* 1. Giao diện 7 Trang Web */}
            {(activeTab === 'home-cms' ||
              activeTab === 'page-home' ||
              activeTab === 'page-about' ||
              activeTab === 'page-space' ||
              activeTab === 'page-menu' ||
              activeTab === 'page-reviews' ||
              activeTab === 'page-news' ||
              activeTab === 'page-contact') && (
              <AdminErrorBoundary moduleName="Giao diện 7 Trang Web">
                <CMSHome activeSubPage={activeTab === 'home-cms' ? 'page-home' : activeTab} />
              </AdminErrorBoundary>
            )}

            {/* 2. Quản lý Nội dung Quán */}
            {activeTab === 'menu-cms' && (
              <AdminErrorBoundary moduleName="Quản lý Thực đơn">
                <AdminMenuManager />
              </AdminErrorBoundary>
            )}
            {activeTab === 'gallery-cms' && (
              <AdminErrorBoundary moduleName="Quản lý Không gian 30 Bản khắc">
                <AdminGalleryManager />
              </AdminErrorBoundary>
            )}
            {activeTab === 'events-cms' && (
              <AdminErrorBoundary moduleName="Tin tức & Bài viết">
                <AdminEventsManager />
              </AdminErrorBoundary>
            )}
            {activeTab === 'stories-team' && (
              <AdminErrorBoundary moduleName="Cột mốc & Đội ngũ">
                <AdminStoriesTeamManager />
              </AdminErrorBoundary>
            )}
            {activeTab === 'pages-faq' && (
              <AdminErrorBoundary moduleName="Trang pháp lý & FAQ">
                <AdminPagesFaqManager />
              </AdminErrorBoundary>
            )}

            {/* 3. Khách hàng & Hộp thư */}
            {(activeTab === 'interactions' ||
              activeTab === 'interactions-inbox' ||
              activeTab === 'interactions-reviews' ||
              activeTab === 'interactions-chat') && (
              <AdminErrorBoundary moduleName="Khách hàng & Hộp thư">
                <AdminInteractionsManager
                  initialTab={
                    activeTab === 'interactions-reviews'
                      ? 'reviews'
                      : activeTab === 'interactions-chat'
                      ? 'chat'
                      : 'inbox'
                  }
                  initialView={
                    activeTab === 'interactions-reviews'
                      ? 'reviews'
                      : activeTab === 'interactions-chat'
                      ? 'chat'
                      : 'inbox'
                  }
                />
              </AdminErrorBoundary>
            )}

            {/* 4. SEO Google & Đo lường */}
            {activeTab === 'seo-url' && (
              <AdminErrorBoundary moduleName="SEO Google & 301/302">
                <AdminSeoManager />
              </AdminErrorBoundary>
            )}
            {activeTab === 'analytics' && (
              <AdminErrorBoundary moduleName="Google Analytics 4">
                <AnalyticsTab
                  onSwitchToIntegrations={() => setActiveTab('integrations')}
                  onShowToast={showToast}
                />
              </AdminErrorBoundary>
            )}
            {activeTab === 'searchConsole' && (
              <AdminErrorBoundary moduleName="Google Search Console">
                <SearchConsoleTab
                  onSwitchToIntegrations={() => setActiveTab('integrations')}
                  onShowToast={showToast}
                />
              </AdminErrorBoundary>
            )}
            {activeTab === 'integrations' && (
              <AdminErrorBoundary moduleName="Tích hợp & Khóa API">
                <IntegrationsTab onShowToast={showToast} />
              </AdminErrorBoundary>
            )}

            {/* 5. Hệ thống & Cài đặt */}
            {activeTab === 'settings' && (
              <AdminErrorBoundary moduleName="Cài đặt Quán & Chân trang">
                <AdminSettingsManager />
              </AdminErrorBoundary>
            )}
            {activeTab === 'users' && (
              <AdminErrorBoundary moduleName="Quản trị viên & Phân quyền">
                <AdminUsersManager
                  currentUser={currentUser}
                  onCurrentUserUpdate={(updatedUser) => setCurrentUser(updatedUser)}
                />
              </AdminErrorBoundary>
            )}
            {activeTab === 'ops' && (
              <AdminErrorBoundary moduleName="Sao lưu DB & Nhật ký">
                <AdminOpsManager />
              </AdminErrorBoundary>
            )}
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
