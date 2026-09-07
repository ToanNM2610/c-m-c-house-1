"use client";

import { useState, useEffect, useMemo } from "react";
import { Loader2, X } from "lucide-react";

interface User {
  id: string;
  username: string;
  fullName: string;
  email: string;
  role: string;
  avatar: string;
  postCount: number;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Views
  const [currentView, setCurrentView] = useState<"table" | "add">("table");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Table State
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkAction, setBulkAction] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Notices
  const [showNotice, setShowNotice] = useState(true);

  // Form State
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Nhân viên");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/users");
      const data = await res.json();
      if (data.users) {
        setUsers(data.users);
      }
    } catch (error) {
      console.error("Lỗi tải người dùng:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchRole = roleFilter === "all" || user.role === roleFilter;
      const matchSearch = user.username.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          user.email.toLowerCase().includes(searchQuery.toLowerCase());
      return matchRole && matchSearch;
    });
  }, [users, roleFilter, searchQuery]);

  const counts = useMemo(() => {
    return {
      all: users.length,
      admin: users.filter(u => u.role === "Quản trị viên").length,
      editor: users.filter(u => u.role === "Biên tập viên").length,
      staff: users.filter(u => u.role === "Nhân viên").length,
    };
  }, [users]);

  // Actions
  const toggleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(filteredUsers.map(u => u.id));
    } else {
      setSelectedIds([]);
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleBulkAction = async () => {
    if (bulkAction === "delete" && selectedIds.length > 0) {
      if (!window.confirm(`Bạn có chắc chắn muốn xóa ${selectedIds.length} tài khoản?`)) return;
      try {
        const res = await fetch("/api/users", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ids: selectedIds }),
        });
        if (res.ok) {
          setSelectedIds([]);
          await fetchUsers();
        }
      } catch (error) {
        console.error("Lỗi xóa:", error);
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Xóa tài khoản này?")) return;
    try {
      const res = await fetch("/api/users", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        await fetchUsers();
      }
    } catch (error) {
      console.error("Lỗi xóa:", error);
    }
  };

  const openAddForm = () => {
    setUsername("");
    setFullName("");
    setEmail("");
    setPassword("");
    setRole("Thành viên đăng ký");
    setCurrentView("add");
  };

  const closeForm = () => {
    setCurrentView("table");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, fullName, email, password, role }),
      });
      if (res.ok) {
        await fetchUsers();
        closeForm();
      } else {
        alert("Có lỗi khi thêm tài khoản.");
      }
    } catch (error) {
      console.error("Lỗi submit:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (currentView === "add") {
    return (
      <div className="max-w-[800px] animate-in fade-in duration-300">
        <div className="flex items-center gap-3 mb-6">
          <h1 className="text-[23px] font-normal text-[#1d2327]">Thêm thành viên mới</h1>
          <button 
            onClick={closeForm}
            className="text-[13px] border border-[#2271b1] text-[#2271b1] px-3 py-1 rounded hover:bg-[#f0f0f1] transition-colors"
          >
            Quay lại
          </button>
        </div>
        
        <p className="text-[13px] text-[#3c434a] mb-4">Tạo một thành viên mới và thêm họ vào trang web này.</p>

        <form onSubmit={handleSubmit} className="bg-white border border-[#c3c4c7] p-4 sm:p-6 rounded-sm">
          <div className="space-y-4 max-w-[400px]">
            <div>
              <label className="block text-[13px] font-semibold text-[#1d2327] mb-1">Tên người dùng (bắt buộc)</label>
              <input type="text" required value={username} onChange={e => setUsername(e.target.value)} className="w-full text-[14px] px-3 py-1.5 border border-[#8c8f94] rounded-sm focus:border-[#2271b1] outline-none" />
            </div>
            <div>
              <label className="block text-[13px] font-semibold text-[#1d2327] mb-1">Email (bắt buộc)</label>
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full text-[14px] px-3 py-1.5 border border-[#8c8f94] rounded-sm focus:border-[#2271b1] outline-none" />
            </div>
            <div>
              <label className="block text-[13px] font-semibold text-[#1d2327] mb-1">Họ tên</label>
              <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} className="w-full text-[14px] px-3 py-1.5 border border-[#8c8f94] rounded-sm focus:border-[#2271b1] outline-none" />
            </div>
            <div>
              <label className="block text-[13px] font-semibold text-[#1d2327] mb-1">Mật khẩu</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full text-[14px] px-3 py-1.5 border border-[#8c8f94] rounded-sm focus:border-[#2271b1] outline-none" />
            </div>
            <div>
              <label className="block text-[13px] font-semibold text-[#1d2327] mb-1">Vai trò</label>
              <select value={role} onChange={e => setRole(e.target.value)} className="w-full text-[14px] px-3 py-1.5 border border-[#8c8f94] rounded-sm focus:border-[#2271b1] outline-none bg-white">
                <option value="Nhân viên">Nhân viên</option>
                <option value="Biên tập viên">Biên tập viên</option>
                <option value="Quản trị viên">Quản trị viên</option>
              </select>
            </div>
            <div className="pt-4">
              <button type="submit" disabled={isSubmitting} className="bg-[#2271b1] text-white px-4 py-1.5 text-[13px] rounded-sm hover:bg-[#135e96] disabled:opacity-50">
                {isSubmitting ? "Đang thêm..." : "Thêm người dùng mới"}
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  }

  // Table View
  return (
    <div className="max-w-full animate-in fade-in duration-300 -mt-2">
      
      {showNotice && (
        <div className="bg-white border-l-4 border-l-[#46b450] border border-[#c3c4c7] p-3 rounded-sm shadow-sm flex items-center justify-between mb-4">
          <p className="text-[13px] text-[#3c434a]">Đây là danh sách tất cả người dùng trên website của bạn.</p>
          <button onClick={() => setShowNotice(false)} className="text-[#a7aaad] hover:text-[#d63638]"><X size={16}/></button>
        </div>
      )}

      <div className="flex items-center gap-2 mb-2">
        <h1 className="text-[23px] font-normal text-[#1d2327]">Thành viên</h1>
        <button 
          onClick={openAddForm}
          className="text-[13px] border border-[#2271b1] text-[#2271b1] px-3 py-1 rounded hover:bg-[#f0f0f1] transition-colors"
        >
          Thêm mới
        </button>
      </div>

      <div className="text-[13px] mb-4 text-[#3c434a]">
        <button onClick={() => setRoleFilter('all')} className={roleFilter === 'all' ? "text-[#1d2327] font-semibold" : "text-[#2271b1] hover:text-[#0a4b78]"}>
          Tất cả <span className="text-[#a7aaad]">({counts.all})</span>
        </button>
        <span className="text-[#a7aaad] mx-1">|</span>
        <button onClick={() => setRoleFilter('Quản trị viên')} className={roleFilter === 'Quản trị viên' ? "text-[#1d2327] font-semibold" : "text-[#2271b1] hover:text-[#0a4b78]"}>
          Quản trị viên <span className="text-[#a7aaad]">({counts.admin})</span>
        </button>
        <span className="text-[#a7aaad] mx-1">|</span>
        <button onClick={() => setRoleFilter('Biên tập viên')} className={roleFilter === 'Biên tập viên' ? "text-[#1d2327] font-semibold" : "text-[#2271b1] hover:text-[#0a4b78]"}>
          Biên tập viên <span className="text-[#a7aaad]">({counts.editor})</span>
        </button>
        <span className="text-[#a7aaad] mx-1">|</span>
        <button onClick={() => setRoleFilter('Nhân viên')} className={roleFilter === 'Nhân viên' ? "text-[#1d2327] font-semibold" : "text-[#2271b1] hover:text-[#0a4b78]"}>
          Nhân viên <span className="text-[#a7aaad]">({counts.staff})</span>
        </button>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2 gap-2 text-[13px]">
        <div className="flex flex-wrap items-center gap-1.5">
          <select value={bulkAction} onChange={(e) => setBulkAction(e.target.value)} className="border border-[#8c8f94] rounded-sm px-2 py-1 bg-white text-[#3c434a] focus:border-[#2271b1] outline-none h-[30px]">
            <option value="">Hành động hàng loạt</option>
            <option value="delete">Xóa</option>
          </select>
          <button onClick={handleBulkAction} className="border border-[#2271b1] text-[#2271b1] px-3 py-1 rounded-sm bg-[#f6f7f7] hover:bg-[#f0f0f1] h-[30px]">Áp dụng</button>
        </div>

        <div className="flex items-center gap-1 w-full md:w-auto">
          <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="border border-[#8c8f94] rounded-sm px-2 py-1 bg-white focus:border-[#2271b1] outline-none w-full md:w-[180px] h-[30px]" />
          <button className="border border-[#8c8f94] text-[#3c434a] px-3 py-1 rounded-sm bg-[#f6f7f7] hover:bg-[#f0f0f1] h-[30px] whitespace-nowrap">Tìm người dùng</button>
        </div>
      </div>

      <div className="bg-white border border-[#c3c4c7] rounded-sm shadow-sm overflow-x-auto">
        <table className="w-full text-left text-[13px] border-collapse min-w-[700px]">
          <thead>
            <tr className="border-b border-[#c3c4c7] bg-[#fcfcfc] text-[#1d2327]">
              <th className="w-10 px-3 py-2 text-center">
                <input type="checkbox" checked={selectedIds.length > 0 && selectedIds.length === filteredUsers.length} onChange={toggleSelectAll} className="border-[#8c8f94] rounded-sm" />
              </th>
              <th className="px-3 py-2 font-semibold">Tên người dùng</th>
              <th className="px-3 py-2 font-semibold">Tên</th>
              <th className="px-3 py-2 font-semibold">Email</th>
              <th className="px-3 py-2 font-semibold">Vai trò</th>
              <th className="px-3 py-2 font-semibold text-center w-24">Đóng góp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#c3c4c7]">
            {isLoading ? (
              <tr><td colSpan={6} className="py-10 text-center"><Loader2 className="animate-spin inline text-[#2271b1]" size={24} /></td></tr>
            ) : filteredUsers.length === 0 ? (
              <tr><td colSpan={6} className="py-6 text-center text-[#3c434a]">Không tìm thấy người dùng nào.</td></tr>
            ) : (
              filteredUsers.map((user, index) => (
                <tr key={user.id} className={`group ${index % 2 !== 0 ? 'bg-[#f9f9f9]' : 'bg-white'} hover:bg-[#fcfcfc] transition-colors`}>
                  <td className="px-3 py-3 text-center align-top">
                    <input type="checkbox" checked={selectedIds.includes(user.id)} onChange={() => toggleSelect(user.id)} className="border-[#8c8f94] rounded-sm mt-2" />
                  </td>
                  <td className="px-3 py-3 align-top flex gap-3">
                    <img src={user.avatar} alt="Avatar" className="w-8 h-8 rounded-sm object-cover bg-[#f0f0f1] shrink-0" />
                    <div>
                      <div className="font-semibold text-[#2271b1] text-[13px] hover:text-[#0a4b78] cursor-pointer mb-0.5">{user.username}</div>
                      <div className="text-[12px] opacity-0 group-hover:opacity-100 transition-opacity flex gap-2 text-[#a7aaad]">
                        <span className="text-[#2271b1] cursor-pointer hover:underline">Chỉnh sửa</span>
                        {user.username !== 'admin' && (
                          <>
                            <span>|</span>
                            <span className="text-[#b32d2e] cursor-pointer hover:underline" onClick={() => handleDelete(user.id)}>Xóa</span>
                          </>
                        )}
                        <span>|</span>
                        <span className="text-[#2271b1] cursor-pointer hover:underline">Xem</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3 align-top text-[#3c434a]">{user.fullName}</td>
                  <td className="px-3 py-3 align-top text-[#2271b1] hover:underline cursor-pointer">{user.email}</td>
                  <td className="px-3 py-3 align-top text-[#3c434a]">{user.role}</td>
                  <td className="px-3 py-3 align-top text-center text-[#2271b1] hover:underline cursor-pointer font-medium">{user.postCount}</td>
                </tr>
              ))
            )}
          </tbody>
          <tfoot>
            <tr className="border-t border-[#c3c4c7] bg-[#fcfcfc] text-[#1d2327]">
              <th className="w-10 px-3 py-2 text-center">
                <input type="checkbox" checked={selectedIds.length > 0 && selectedIds.length === filteredUsers.length} onChange={toggleSelectAll} className="border-[#8c8f94] rounded-sm" />
              </th>
              <th className="px-3 py-2 font-semibold">Tên người dùng</th>
              <th className="px-3 py-2 font-semibold">Tên</th>
              <th className="px-3 py-2 font-semibold">Email</th>
              <th className="px-3 py-2 font-semibold">Vai trò</th>
              <th className="px-3 py-2 font-semibold text-center">Đóng góp</th>
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="flex justify-between items-center mt-3 text-[13px] text-[#3c434a]">
        <div className="flex gap-1.5">
          <select value={bulkAction} onChange={(e) => setBulkAction(e.target.value)} className="border border-[#8c8f94] rounded-sm px-2 py-1 bg-white focus:border-[#2271b1] outline-none h-[30px]">
            <option value="">Hành động hàng loạt</option>
            <option value="delete">Xóa</option>
          </select>
          <button onClick={handleBulkAction} className="border border-[#2271b1] text-[#2271b1] px-3 py-1 rounded-sm bg-[#f6f7f7] hover:bg-[#f0f0f1] h-[30px]">Áp dụng</button>
        </div>
        <div>{filteredUsers.length} mục</div>
      </div>
    </div>
  );
}
