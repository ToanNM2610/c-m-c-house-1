'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Users,
  UserPlus,
  ShieldCheck,
  Shield,
  KeyRound,
  Pencil,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  X,
  Search,
  RefreshCw,
  Loader2,
  UserCheck,
} from 'lucide-react';
import { AdminUserSafe, AdminRole } from '@/types';

interface AdminUsersManagerProps {
  currentUser: AdminUserSafe;
  onCurrentUserUpdate?: (updatedUser: AdminUserSafe) => void;
}

export default function AdminUsersManager({ currentUser, onCurrentUserUpdate }: AdminUsersManagerProps) {
  const [users, setUsers] = useState<AdminUserSafe[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AdminUserSafe | null>(null);

  // Edit Account Form state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUserSafe | null>(null);
  const [editFullName, setEditFullName] = useState('');
  const [editUsername, setEditUsername] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [editConfirmPassword, setEditConfirmPassword] = useState('');
  const [showEditPassword, setShowEditPassword] = useState(false);
  const [editSubmitting, setEditSubmitting] = useState(false);

  // Add Form state
  const [newFullName, setNewFullName] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState<AdminRole>('EDITOR');
  const [addSubmitting, setAddSubmitting] = useState(false);

  // Password Reset Form state
  const [resetPassword, setResetPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetSubmitting, setResetSubmitting] = useState(false);

  // Action loading state (e.g. locking/unlocking user id)
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const showToast = useCallback((type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  }, []);

  const fetchUsers = useCallback(async () => {
    try {
      setRefreshing(true);
      const res = await fetch('/api/users', { credentials: 'include' });
      const json = await res.json();
      if (res.ok && json.success) {
        setUsers(json.data);
      } else {
        showToast('error', json.error || 'Không thể tải danh sách tài khoản');
      }
    } catch {
      showToast('error', 'Lỗi kết nối khi tải danh sách người dùng');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFullName.trim() || !newUsername.trim() || !newPassword) {
      showToast('error', 'Vui lòng điền đầy đủ các thông tin bắt buộc');
      return;
    }

    if (newPassword.length < 6) {
      showToast('error', 'Mật khẩu phải có tối thiểu 6 ký tự');
      return;
    }

    setAddSubmitting(true);
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          fullName: newFullName.trim(),
          username: newUsername.trim(),
          password: newPassword,
          role: newRole,
        }),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        showToast('success', `Đã tạo tài khoản "${newUsername}" thành công`);
        setIsAddModalOpen(false);
        setNewFullName('');
        setNewUsername('');
        setNewPassword('');
        setNewRole('EDITOR');
        fetchUsers();
      } else {
        showToast('error', json.error || 'Không thể tạo tài khoản');
      }
    } catch {
      showToast('error', 'Lỗi hệ thống khi tạo tài khoản');
    } finally {
      setAddSubmitting(false);
    }
  };

  const handleOpenEdit = (user: AdminUserSafe) => {
    setEditingUser(user);
    setEditFullName(user.fullName);
    setEditUsername(user.username);
    setEditPassword('');
    setEditConfirmPassword('');
    setShowEditPassword(false);
    setIsEditModalOpen(true);
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    const trimmedName = editFullName.trim();
    if (!trimmedName || trimmedName.length < 2) {
      showToast('error', 'Họ và tên hiển thị phải có tối thiểu 2 ký tự');
      return;
    }

    const trimmedUsername = editUsername.trim().toLowerCase();
    const usernameRegex = /^[a-z0-9._-]{3,32}$/;
    if (!usernameRegex.test(trimmedUsername)) {
      showToast('error', 'Tên đăng nhập không hợp lệ (từ 3–32 ký tự, chỉ gồm chữ thường, số, dấu chấm, gạch dưới hoặc gạch ngang)');
      return;
    }

    if (editPassword) {
      if (editPassword.length < 8) {
        showToast('error', 'Mật khẩu mới phải có tối thiểu 8 ký tự');
        return;
      }
      if (editPassword !== editConfirmPassword) {
        showToast('error', 'Xác nhận mật khẩu mới không khớp');
        return;
      }
    }

    setEditSubmitting(true);
    try {
      const payload: Record<string, string> = {
        fullName: trimmedName,
        username: trimmedUsername,
      };
      if (editPassword) {
        payload.password = editPassword;
      }

      const res = await fetch(`/api/users/${editingUser.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        showToast('success', `Đã cập nhật thông tin tài khoản "${json.data.username}" thành công`);
        setUsers((prev) => prev.map((u) => (u.id === json.data.id ? json.data : u)));
        if (json.data.id === currentUser.id) {
          onCurrentUserUpdate?.(json.data);
        }
        setIsEditModalOpen(false);
        setEditingUser(null);
        setEditPassword('');
        setEditConfirmPassword('');
      } else {
        showToast('error', json.error || 'Không thể cập nhật tài khoản');
      }
    } catch {
      showToast('error', 'Lỗi hệ thống khi cập nhật thông tin tài khoản');
    } finally {
      setEditSubmitting(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    if (resetPassword.length < 6) {
      showToast('error', 'Mật khẩu mới phải có tối thiểu 6 ký tự');
      return;
    }

    if (resetPassword !== confirmPassword) {
      showToast('error', 'Xác nhận mật khẩu không khớp');
      return;
    }

    setResetSubmitting(true);
    try {
      const res = await fetch(`/api/users/${selectedUser.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          password: resetPassword,
        }),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        showToast('success', `Đã cập nhật mật khẩu cho tài khoản "${selectedUser.username}"`);
        setIsPasswordModalOpen(false);
        setSelectedUser(null);
        setResetPassword('');
        setConfirmPassword('');
      } else {
        showToast('error', json.error || 'Không thể đổi mật khẩu');
      }
    } catch {
      showToast('error', 'Lỗi hệ thống khi đổi mật khẩu');
    } finally {
      setResetSubmitting(false);
    }
  };

  const handleToggleActive = async (targetUser: AdminUserSafe) => {
    if (targetUser.id === currentUser.id) {
      showToast('error', 'Không thể tự khóa tài khoản của chính mình');
      return;
    }

    const superAdminActiveCount = users.filter((u) => u.role === 'SUPER_ADMIN' && u.isActive).length;
    if (targetUser.role === 'SUPER_ADMIN' && targetUser.isActive && superAdminActiveCount <= 1) {
      showToast('error', 'Không thể khóa tài khoản Super Admin duy nhất đang hoạt động');
      return;
    }

    setActionLoadingId(targetUser.id);
    try {
      const res = await fetch(`/api/users/${targetUser.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          isActive: !targetUser.isActive,
        }),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        showToast(
          'success',
          targetUser.isActive
            ? `Đã khóa tài khoản "${targetUser.username}"`
            : `Đã kích hoạt lại tài khoản "${targetUser.username}"`
        );
        fetchUsers();
      } else {
        showToast('error', json.error || 'Không thể thay đổi trạng thái tài khoản');
      }
    } catch {
      showToast('error', 'Lỗi hệ thống khi đổi trạng thái');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDeleteUser = async (targetUser: AdminUserSafe) => {
    if (targetUser.id === currentUser.id) {
      showToast('error', 'Không thể tự xóa tài khoản của chính bạn');
      return;
    }

    const superAdminCount = users.filter((u) => u.role === 'SUPER_ADMIN').length;
    if (targetUser.role === 'SUPER_ADMIN' && superAdminCount <= 1) {
      showToast('error', 'Không thể xóa tài khoản Quản Trị Cấp Cao (Super Admin) duy nhất trong hệ thống');
      return;
    }

    const confirmed = window.confirm(
      `Bạn có chắc chắn muốn xóa tài khoản "${targetUser.fullName} (@${targetUser.username})"? Thao tác này không thể hoàn tác.`
    );
    if (!confirmed) return;

    setActionLoadingId(targetUser.id);
    try {
      const res = await fetch(`/api/users/${encodeURIComponent(targetUser.id)}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      const json = await res.json().catch(() => ({}));
      if (res.ok && json.success) {
        // Immediately remove item from local React state (no stale UI)
        setUsers((prev) => prev.filter((u) => u.id !== targetUser.id));
        showToast('success', `Đã xóa tài khoản "${targetUser.username}" thành công`);
        fetchUsers();
      } else {
        showToast('error', json.error || 'Không thể xóa tài khoản. Vui lòng kiểm tra quyền Super Admin.');
      }
    } catch {
      showToast('error', 'Lỗi hệ thống khi xóa tài khoản');
    } finally {
      setActionLoadingId(null);
    }
  };

  // Filter users by search
  const filteredUsers = users.filter((u) => {
    const q = searchQuery.toLowerCase().trim();
    return u.fullName.toLowerCase().includes(q) || u.username.toLowerCase().includes(q);
  });

  const superAdminCount = users.filter((u) => u.role === 'SUPER_ADMIN').length;
  const editorCount = users.filter((u) => u.role === 'EDITOR').length;
  const seoManagerCount = users.filter((u) => u.role === 'SEO_MANAGER').length;
  const activeCount = users.filter((u) => u.isActive).length;

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-16 right-6 z-50 p-4 rounded-xl shadow-lg border flex items-center gap-3 transition-all ${
            toast.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-red-50 border-red-200 text-red-800'
          }`}
        >
          {toast.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
          )}
          <span className="text-xs font-mono font-medium">{toast.message}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="text-[11px] font-mono uppercase tracking-wider text-emerald-700 font-bold mb-1 flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span>QUẢN LÝ TÀI KHOẢN & PHÂN QUYỀN NHÂN VIÊN</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-slate-900">
            Danh Sách Nhân Viên & Quản Trị Viên
          </h2>
          <p className="text-xs text-slate-500 font-mono mt-1">
            Hệ thống phân quyền truy cập CMS, quản lý trạng thái tài khoản và mật khẩu bảo mật.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchUsers}
            disabled={refreshing}
            className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-colors"
            title="Tải lại danh sách"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          </button>

          {currentUser.role === 'SUPER_ADMIN' && (
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-mono font-semibold hover:bg-emerald-700 transition-all shadow-sm active:scale-[0.99]"
            >
              <UserPlus className="w-4 h-4" />
              <span>Thêm Tài Khoản Mới</span>
            </button>
          )}
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-1">
          <div className="text-[11px] font-mono text-slate-400 uppercase font-medium">Tổng Tài Khoản</div>
          <div className="text-2xl font-serif font-bold text-slate-900">{users.length}</div>
          <div className="text-[10px] text-slate-500 font-mono">Đã tạo trên hệ thống</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-1">
          <div className="text-[11px] font-mono text-emerald-600 uppercase font-medium flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Super Admin</span>
          </div>
          <div className="text-2xl font-serif font-bold text-emerald-700">{superAdminCount}</div>
          <div className="text-[10px] text-slate-500 font-mono">Toàn quyền hệ thống</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-1">
          <div className="text-[11px] font-mono text-sky-600 uppercase font-medium flex items-center gap-1">
            <Shield className="w-3.5 h-3.5" />
            <span>Biên Tập Viên</span>
          </div>
          <div className="text-2xl font-serif font-bold text-sky-700">{editorCount}</div>
          <div className="text-[10px] text-slate-500 font-mono">Quản lý nội dung CMS</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-1">
          <div className="text-[11px] font-mono text-amber-600 uppercase font-medium flex items-center gap-1">
            <Search className="w-3.5 h-3.5" />
            <span>SEO Manager</span>
          </div>
          <div className="text-2xl font-serif font-bold text-amber-700">{seoManagerCount}</div>
          <div className="text-[10px] text-slate-500 font-mono">Quản lý SEO & Redirects</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-1">
          <div className="text-[11px] font-mono text-teal-600 uppercase font-medium flex items-center gap-1">
            <UserCheck className="w-3.5 h-3.5" />
            <span>Đang Hoạt Động</span>
          </div>
          <div className="text-2xl font-serif font-bold text-teal-700">{activeCount}</div>
          <div className="text-[10px] text-slate-500 font-mono">{users.length - activeCount} tài khoản bị khóa</div>
        </div>
      </div>

      {/* Search Filter */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
        <Search className="w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Tìm kiếm theo họ tên hoặc tên đăng nhập..."
          className="w-full text-xs font-mono bg-transparent outline-none text-slate-700 placeholder-slate-400"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="text-xs font-mono text-slate-400 hover:text-slate-600"
          >
            Xóa
          </button>
        )}
      </div>

      {/* Accounts List / Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-600 mx-auto" />
            <p className="text-xs font-mono text-slate-500">Đang tải danh sách tài khoản...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <Users className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="text-sm font-medium text-slate-600">Không tìm thấy tài khoản nào phù hợp</p>
            <p className="text-xs font-mono text-slate-400">Thử tìm kiếm với từ khóa khác hoặc tạo tài khoản mới.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-mono uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3.5 px-4 sm:px-6">Thành Viên</th>
                  <th className="py-3.5 px-4">Vai Trò</th>
                  <th className="py-3.5 px-4">Trạng Thái</th>
                  <th className="py-3.5 px-4 hidden md:table-cell">Ngày Tạo</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map((u) => {
                  const isCurrent = u.id === currentUser.id;
                  const isLastSuperAdmin =
                    u.role === 'SUPER_ADMIN' && superAdminCount <= 1;

                  return (
                    <tr key={u.id} className="hover:bg-slate-50/70 transition-colors">
                      {/* Member column */}
                      <td className="py-4 px-4 sm:px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold font-serif text-slate-700">
                            {u.fullName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                              <span>{u.fullName}</span>
                              {isCurrent && (
                                <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-mono font-medium">
                                  Bạn
                                </span>
                              )}
                            </div>
                            <div className="text-slate-400 font-mono text-[11px]">
                              @{u.username}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Role column */}
                      <td className="py-4 px-4">
                        {u.role === 'SUPER_ADMIN' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full font-mono text-[11px] font-semibold">
                            <ShieldCheck className="w-3 h-3 text-emerald-600" />
                            <span>Super Admin</span>
                          </span>
                        ) : u.role === 'SEO_MANAGER' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-full font-mono text-[11px] font-medium">
                            <Search className="w-3 h-3 text-amber-600" />
                            <span>SEO Manager</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-sky-50 text-sky-700 border border-sky-200 rounded-full font-mono text-[11px] font-medium">
                            <Shield className="w-3 h-3 text-sky-600" />
                            <span>Biên tập viên</span>
                          </span>
                        )}
                      </td>

                      {/* Status column */}
                      <td className="py-4 px-4">
                        {u.isActive ? (
                          <span className="inline-flex items-center gap-1.5 text-emerald-700 font-mono text-[11px] font-medium">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span>Đang hoạt động</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-red-600 font-mono text-[11px] font-medium">
                            <span className="w-2 h-2 rounded-full bg-red-400" />
                            <span>Đã khóa</span>
                          </span>
                        )}
                      </td>

                      {/* Created date column */}
                      <td className="py-4 px-4 hidden md:table-cell text-slate-400 font-mono text-[11px]">
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString('vi-VN') : '—'}
                      </td>

                      {/* Actions column */}
                      <td className="py-4 px-4 sm:px-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Edit Account button (FullName, Username, Password) - enabled for all including self */}
                          <button
                            onClick={() => handleOpenEdit(u)}
                            className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
                            title="Chỉnh sửa thông tin tài khoản (Họ tên, Username, Mật khẩu)"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>

                          {/* Change Password button */}
                          <button
                            onClick={() => {
                              setSelectedUser(u);
                              setIsPasswordModalOpen(true);
                            }}
                            className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
                            title="Đổi mật khẩu nhanh"
                          >
                            <KeyRound className="w-4 h-4" />
                          </button>

                          {/* Lock / Unlock Toggle button (Super Admin only, not self) */}
                          {currentUser.role === 'SUPER_ADMIN' && (
                            <button
                              onClick={() => handleToggleActive(u)}
                              disabled={isCurrent || isLastSuperAdmin || actionLoadingId === u.id}
                              className={`p-1.5 rounded-lg transition-colors ${
                                u.isActive
                                  ? 'text-slate-500 hover:text-amber-600 hover:bg-amber-50'
                                  : 'text-amber-600 hover:text-emerald-600 hover:bg-emerald-50'
                              } disabled:opacity-40 disabled:cursor-not-allowed`}
                              title={
                                isCurrent
                                  ? 'Không thể tự khóa tài khoản của chính mình'
                                  : isLastSuperAdmin
                                  ? 'Không thể khóa Super Admin duy nhất'
                                  : u.isActive
                                  ? 'Khóa tài khoản'
                                  : 'Mở khóa tài khoản'
                              }
                            >
                              {actionLoadingId === u.id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : u.isActive ? (
                                <Lock className="w-4 h-4" />
                              ) : (
                                <Unlock className="w-4 h-4 text-emerald-600" />
                              )}
                            </button>
                          )}

                          {/* Delete button (Super Admin only, not self, not last super admin) */}
                          {currentUser.role === 'SUPER_ADMIN' && (
                            <button
                              onClick={() => handleDeleteUser(u)}
                              disabled={isCurrent || isLastSuperAdmin || actionLoadingId === u.id}
                              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                              title={
                                isCurrent
                                  ? 'Không thể xóa tài khoản của bạn'
                                  : isLastSuperAdmin
                                  ? 'Không thể xóa Super Admin duy nhất'
                                  : 'Xóa tài khoản vĩnh viễn'
                              }
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal: Thêm Thành Viên Mới */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden border border-slate-200">
            <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-emerald-400" />
                <h3 className="font-serif font-bold text-lg">Thêm Tài Khoản Nhân Viên Mới</h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-500 mb-1.5 font-medium">
                  Họ và tên nhân viên:
                </label>
                <input
                  type="text"
                  value={newFullName}
                  onChange={(e) => setNewFullName(e.target.value)}
                  placeholder="Ví dụ: Nguyễn Văn A"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-emerald-600 focus:bg-white transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-500 mb-1.5 font-medium">
                  Tên đăng nhập (Username):
                </label>
                <input
                  type="text"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value.toLowerCase())}
                  placeholder="Ví dụ: nhanvien1"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:outline-none focus:border-emerald-600 focus:bg-white transition-all"
                  required
                />
                <span className="text-[10px] text-slate-400 font-mono mt-1 block">
                  Chữ cái thường không dấu, số, dấu gạch nối hoặc chấm.
                </span>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-500 mb-1.5 font-medium">
                  Mật khẩu khởi tạo:
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Tối thiểu 6 ký tự"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:outline-none focus:border-emerald-600 focus:bg-white transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-500 mb-1.5 font-medium">
                  Phân quyền vai trò:
                </label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as AdminRole)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:outline-none focus:border-emerald-600 focus:bg-white transition-all"
                >
                  <option value="EDITOR">Nhân viên biên tập (EDITOR) — Quản lý CMS thực đơn, ảnh & sự kiện</option>
                  <option value="SEO_MANAGER">Chuyên viên SEO (SEO_MANAGER) — Quản lý SEO từng trang & Điều hướng 301/302</option>
                  <option value="SUPER_ADMIN">Quản trị viên toàn quyền (SUPER_ADMIN) — Toàn quyền tất cả 5 modules</option>
                </select>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-mono text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={addSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-mono font-semibold hover:bg-emerald-700 transition-all flex items-center gap-1.5 disabled:opacity-60"
                >
                  {addSubmitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Đang lưu...</span>
                    </>
                  ) : (
                    <span>Tạo Tài Khoản</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Đổi Mật Khẩu */}
      {isPasswordModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden border border-slate-200">
            <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-emerald-400" />
                <h3 className="font-serif font-bold text-lg">Đổi Mật Khẩu Tài Khoản</h3>
              </div>
              <button
                onClick={() => {
                  setIsPasswordModalOpen(false);
                  setSelectedUser(null);
                }}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleResetPassword} className="p-6 space-y-4">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono space-y-1">
                <div className="text-slate-500">Tài khoản: <span className="font-semibold text-slate-900">{selectedUser.fullName}</span></div>
                <div className="text-slate-500">Username: <span className="font-semibold text-slate-900">@{selectedUser.username}</span></div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-500 mb-1.5 font-medium">
                  Mật khẩu mới:
                </label>
                <input
                  type="password"
                  value={resetPassword}
                  onChange={(e) => setResetPassword(e.target.value)}
                  placeholder="Tối thiểu 6 ký tự"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:outline-none focus:border-emerald-600 focus:bg-white transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-500 mb-1.5 font-medium">
                  Xác nhận lại mật khẩu mới:
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Nhập lại mật khẩu mới"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:outline-none focus:border-emerald-600 focus:bg-white transition-all"
                  required
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsPasswordModalOpen(false);
                    setSelectedUser(null);
                  }}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-mono text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={resetSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-mono font-semibold hover:bg-emerald-700 transition-all flex items-center gap-1.5 disabled:opacity-60"
                >
                  {resetSubmitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Đang lưu...</span>
                    </>
                  ) : (
                    <span>Lưu Mật Khẩu Mới</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Chỉnh Sửa Tài Khoản (FullName, Username, Password) */}
      {isEditModalOpen && editingUser && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden border border-slate-200">
            <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Pencil className="w-5 h-5 text-emerald-400" />
                <h3 className="font-serif font-bold text-lg">Chỉnh Sửa Tài Khoản</h3>
              </div>
              <button
                onClick={() => {
                  setIsEditModalOpen(false);
                  setEditingUser(null);
                }}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateUser} className="p-6 space-y-4">
              {/* User badge */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono flex items-center justify-between">
                <div>
                  <span className="text-slate-400">Tài khoản: </span>
                  <span className="text-slate-800 font-semibold">{editingUser.fullName}</span>
                </div>
                {editingUser.id === currentUser.id && (
                  <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded text-[10px] font-bold">
                    Tài khoản của bạn
                  </span>
                )}
              </div>

              {/* Full name field */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-500 mb-1.5 font-medium">
                  Họ và tên hiển thị:
                </label>
                <input
                  type="text"
                  value={editFullName}
                  onChange={(e) => setEditFullName(e.target.value)}
                  placeholder="Nhập họ và tên hiển thị"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:outline-none focus:border-emerald-600 focus:bg-white transition-all text-slate-900 font-medium"
                  required
                />
              </div>

              {/* Username field */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-500 mb-1.5 font-medium">
                  Tên đăng nhập (Username):
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-xs font-mono text-slate-400">@</span>
                  <input
                    type="text"
                    value={editUsername}
                    onChange={(e) => setEditUsername(e.target.value.toLowerCase())}
                    placeholder="vd: admin"
                    className="w-full pl-8 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:outline-none focus:border-emerald-600 focus:bg-white transition-all text-slate-900 font-medium"
                    required
                  />
                </div>
                <p className="text-[11px] font-mono text-slate-400 mt-1">
                  3–32 ký tự, chỉ gồm chữ thường, số, dấu chấm (.), gạch dưới (_) hoặc gạch ngang (-).
                </p>
              </div>

              {/* New Password field (Optional) */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-mono uppercase tracking-wider text-slate-500 font-medium">
                    Mật khẩu mới:
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowEditPassword(!showEditPassword)}
                    className="text-[11px] font-mono text-emerald-700 hover:text-emerald-800 flex items-center gap-1 font-medium"
                  >
                    {showEditPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    <span>{showEditPassword ? 'Ẩn' : 'Hiện'}</span>
                  </button>
                </div>
                <input
                  type={showEditPassword ? 'text' : 'password'}
                  value={editPassword}
                  onChange={(e) => setEditPassword(e.target.value)}
                  placeholder="Để trống nếu không đổi mật khẩu"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:outline-none focus:border-emerald-600 focus:bg-white transition-all text-slate-900"
                />
                <p className="text-[11px] font-mono text-slate-400 mt-1">
                  Để trống để giữ nguyên mật khẩu hiện tại. Tối thiểu 8 ký tự nếu nhập mới.
                </p>
              </div>

              {/* Confirm Password field (only shown if new password is typed) */}
              {editPassword.length > 0 && (
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-slate-500 mb-1.5 font-medium">
                    Xác nhận mật khẩu mới:
                  </label>
                  <input
                    type={showEditPassword ? 'text' : 'password'}
                    value={editConfirmPassword}
                    onChange={(e) => setEditConfirmPassword(e.target.value)}
                    placeholder="Nhập lại chính xác mật khẩu mới"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:outline-none focus:border-emerald-600 focus:bg-white transition-all text-slate-900"
                    required
                  />
                  {editConfirmPassword.length > 0 && editPassword !== editConfirmPassword && (
                    <p className="text-[11px] font-mono text-red-500 mt-1 font-medium">
                      Mật khẩu xác nhận chưa khớp.
                    </p>
                  )}
                </div>
              )}

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setEditingUser(null);
                  }}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-mono text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={editSubmitting || (editPassword.length > 0 && editPassword !== editConfirmPassword)}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-mono font-semibold hover:bg-emerald-700 transition-all flex items-center gap-1.5 disabled:opacity-50 shadow-sm"
                >
                  {editSubmitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Đang lưu...</span>
                    </>
                  ) : (
                    <span>Lưu Thay Đổi</span>
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
