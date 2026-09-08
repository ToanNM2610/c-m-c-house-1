"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Home, 
  LayoutDashboard, 
  Coffee, 
  Image as ImageIcon, 
  Menu as MenuIcon,
  ChevronLeft,
  ChevronRight,
  User,
  Users,
  Lock,
  KeyRound,
  Eye,
  EyeOff,
  LogOut
} from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [pinInput, setPinInput] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    try {
      const isAuth =
        sessionStorage.getItem("camcu_admin_auth") === "true" ||
        localStorage.getItem("camcu_admin_auth") === "true";
      setIsAuthenticated(isAuth);
    } catch {
      setIsAuthenticated(false);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pinInput.trim()) return;
    
    setIsLoading(true);
    setAuthError("");

    try {
      const res = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin: pinInput.trim() }),
      });
      const data = await res.json();
      
      if (res.ok && data.success) {
        sessionStorage.setItem("camcu_admin_auth", "true");
        setIsAuthenticated(true);
      } else {
        setAuthError(data.error || "Mã PIN không chính xác. Vui lòng thử lại!");
      }
    } catch (err) {
      setAuthError("Lỗi kết nối máy chủ. Vui lòng thử lại!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      sessionStorage.removeItem("camcu_admin_auth");
      localStorage.removeItem("camcu_admin_auth");
    } catch {}
    setIsAuthenticated(false);
    setPinInput("");
  };

  // Màn hình chờ kiểm tra phiên
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-[#1d2327] flex items-center justify-center text-white">
        <div className="w-8 h-8 border-2 border-[#72aee6] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // MÀN HÌNH KHÓA BẢO VỆ ADMIN (ADMIN PROTECTION GATE)
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#120805] via-[#1A0F0A] to-[#2B1408] text-[#F3E8DB] flex items-center justify-center p-4 select-none font-sans">
        <div className="w-full max-w-md bg-[#1A0F0A]/95 border border-[#C5A880]/30 rounded-3xl p-8 sm:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative overflow-hidden">
          
          {/* Ánh kim trang trí */}
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#C5A880]/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-[#FFE1B3]/10 rounded-full blur-3xl pointer-events-none" />

          {/* Logo & Header */}
          <div className="text-center mb-8 relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-[#C5A880]/15 border border-[#C5A880]/40 flex items-center justify-center mx-auto mb-4 text-[#C5A880] shadow-inner">
              <Lock size={26} />
            </div>
            
            <span className="text-[10px] uppercase font-mono tracking-[0.25em] text-[#C5A880] block mb-1">
              CẨM CÙ HOUSE • GIA NGHĨA
            </span>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#F3E8DB] tracking-wide">
              Cổng Quản Trị Hệ Thống
            </h1>
            <p className="text-xs text-[#F3E8DB]/70 mt-2 font-light">
              Nhập mã PIN hoặc mật khẩu quản trị viên để mở khóa bảng điều khiển.
            </p>
          </div>

          {/* Form nhập PIN */}
          <form onSubmit={handleLogin} className="space-y-4 relative z-10">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#C5A880] mb-2">
                Mã PIN Quản Trị
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={pinInput}
                  onChange={(e) => {
                    setPinInput(e.target.value);
                    if (authError) setAuthError("");
                  }}
                  className="w-full px-4 py-3 rounded-xl bg-black/50 border border-[#C5A880]/30 text-[#F3E8DB] placeholder-[#F3E8DB]/35 text-sm focus:outline-none focus:border-[#C5A880] focus:ring-1 focus:ring-[#C5A880] transition-all font-mono tracking-widest"
                  placeholder="Nhập mã xác thực quản trị..."
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#F3E8DB]/50 hover:text-[#C5A880] transition-colors cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {authError && (
                <p className="text-xs text-rose-400 mt-2 font-light flex items-center gap-1">
                  <span>⚠</span> {authError}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#C5A880] to-[#DFBE93] hover:from-[#DFBE93] hover:to-[#FFE1B3] text-[#1A0F0A] font-semibold text-xs sm:text-sm uppercase tracking-wider transition-all duration-300 shadow-[0_0_20px_rgba(197,168,128,0.4)] hover:shadow-[0_0_30px_rgba(197,168,128,0.6)] cursor-pointer flex items-center justify-center gap-2 mt-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-[#1A0F0A] border-t-transparent rounded-full animate-spin" />
              ) : (
                <KeyRound size={16} />
              )}
              <span>{isLoading ? "Đang xác thực..." : "Mở Khóa Bảng Điều Khiển"}</span>
            </button>
          </form>

          {/* Gợi ý & Điều hướng */}
          <div className="mt-6 pt-6 border-t border-[#C5A880]/15 flex flex-col items-center gap-3 text-center relative z-10">
            <Link
              href="/"
              className="text-xs text-[#C5A880] hover:text-[#FFE1B3] transition-colors inline-flex items-center gap-1 mt-1"
            >
              <span>← Quay về Trang chủ Cẩm Cù House</span>
            </Link>
          </div>

        </div>
      </div>
    );
  }

  interface AdminNavItem {
    name: string;
    href: string;
    icon: React.ReactNode;
    isActive?: boolean;
  }

  // Admin Sidebar Items
  const navItems: AdminNavItem[] = [
    { name: "Không gian tổng quan", href: "/portal-camcu-2610", icon: <LayoutDashboard size={18} /> },
    { name: "Thư viện ảnh", href: "/portal-camcu-2610/gallery", icon: <ImageIcon size={18} /> },
    { name: "Thực đơn mộc", href: "/portal-camcu-2610/menu", icon: <Coffee size={18} /> },
    { name: "Người đồng hành", href: "/portal-camcu-2610/users", icon: <Users size={18} /> },
  ];

  return (
    <div className="relative min-h-screen bg-[#f0f0f1] text-[#3c434a] font-sans flex flex-col z-10">
      {/* WP TopBar */}
      <header className="h-[32px] bg-[#1d2327] text-[#c3c4c7] flex items-center justify-between px-3 fixed top-0 left-0 right-0 z-50 text-[13px]">
        <div className="flex items-center h-full">
          <Link href="/" className="flex items-center gap-2 hover:text-[#72aee6] h-full px-4 transition-colors font-semibold" title="Xem trang web">
            <Home size={16} />
            <span className="hidden sm:inline">Cẩm Cù House</span>
          </Link>

          <div className="relative group h-full">
            <button className="flex items-center gap-1 hover:text-[#72aee6] h-full px-3 transition-colors">
              <span className="text-lg leading-none -mt-1">+</span> Thêm mới
            </button>
            <div className="absolute top-full left-0 bg-[#1d2327] border-t border-[#3c434a] min-w-[160px] hidden group-hover:flex flex-col shadow-lg z-50">
              <Link href="/portal-camcu-2610/gallery" className="px-3 py-2 text-[#c3c4c7] hover:text-[#72aee6] hover:bg-[#2c3338] text-[13px] flex items-center gap-2"><ImageIcon size={14}/> Tải ảnh mới</Link>
              <Link href="/portal-camcu-2610/menu" className="px-3 py-2 text-[#c3c4c7] hover:text-[#72aee6] hover:bg-[#2c3338] text-[13px] flex items-center gap-2"><Coffee size={14}/> Thêm món mộc</Link>
            </div>
          </div>
        </div>

        <div className="flex items-center h-full">
          <div className="relative group h-full">
            <button className="flex items-center gap-2 hover:text-[#72aee6] h-full px-3 transition-colors">
              <span>Xin chào, admin</span>
              <div className="w-5 h-5 rounded-full bg-slate-600 flex items-center justify-center text-white overflow-hidden">
                <User size={14} />
              </div>
            </button>
            <div className="absolute top-full right-0 bg-[#1d2327] border-t border-[#3c434a] min-w-[160px] hidden group-hover:flex flex-col shadow-lg z-50">
              <button 
                onClick={handleLogout}
                className="w-full text-left px-3 py-2 text-[#c3c4c7] hover:text-rose-300 hover:bg-[#2c3338] text-[13px] flex items-center gap-2 cursor-pointer"
              >
                <LogOut size={13} />
                <span>Khóa / Đăng xuất</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 pt-[32px]">
        {/* WP SideBar (Desktop) */}
        <aside 
          className={`bg-[#1d2327] text-[#c3c4c7] fixed top-[32px] bottom-0 left-0 z-40 hidden md:flex flex-col transition-all duration-300 ease-in-out ${
            isSidebarCollapsed ? "w-[36px]" : "w-[170px]"
          }`}
        >
          <nav className="flex-1 py-2 overflow-y-auto overflow-x-hidden custom-scrollbar">
            <ul className="space-y-[1px]">
              {navItems.map((item) => {
                const isItemActive = item.isActive !== undefined ? item.isActive : pathname === item.href;
                return (
                  <li key={item.name} className="relative group">
                    <Link 
                      href={item.href}
                      className={`flex items-center h-[34px] transition-colors ${
                        isItemActive 
                          ? "bg-[#2271b1] text-white font-medium" 
                          : "hover:bg-[#1d2327] hover:text-[#72aee6]"
                      }`}
                    >
                      <div className={`w-[36px] flex items-center justify-center shrink-0 ${!isItemActive && 'text-[#a7aaad] group-hover:text-[#72aee6]'}`}>
                        {item.icon}
                      </div>
                      <span className={`text-[13px] whitespace-nowrap transition-opacity duration-200 flex-1 flex items-center justify-between pr-2 ${isSidebarCollapsed ? "opacity-0 invisible absolute" : "opacity-100"}`}>
                        {item.name}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="h-[34px] border-t border-[#2c3338]">
            <button 
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="w-full h-full flex items-center text-[#a7aaad] hover:text-[#72aee6] transition-colors"
            >
              <div className="w-[36px] flex items-center justify-center shrink-0">
                {isSidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
              </div>
              <span className={`text-[13px] whitespace-nowrap ${isSidebarCollapsed ? "hidden" : "block"}`}>
                Thu gọn menu
              </span>
            </button>
          </div>
        </aside>

        {/* Mobile Header & Overlay */}
        <div className="md:hidden fixed top-[32px] left-0 w-full bg-[#1d2327] border-b border-[#2c3338] z-30 flex items-center justify-between p-2">
          <span className="text-[#c3c4c7] font-medium ml-2 text-xs">Cẩm Cù Quản Trị</span>
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-1 text-[#c3c4c7] hover:text-white"
          >
            <MenuIcon size={22} />
          </button>
        </div>

        {/* Mobile Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-50 bg-black/60 pt-[32px]">
            <div className="w-[200px] h-full bg-[#1d2327] p-3 text-[#c3c4c7]">
              <div className="flex justify-between items-center mb-4 border-b border-[#3c434a] pb-2">
                <span className="font-semibold text-white text-xs">Menu Quản trị</span>
                <button onClick={() => setIsMobileMenuOpen(false)} className="text-white">✕</button>
              </div>
              <ul className="space-y-1">
                {navItems.map(item => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-2 py-2 px-2 rounded hover:bg-[#2271b1] hover:text-white text-xs"
                    >
                      {item.icon}
                      <span>{item.name}</span>
                    </Link>
                  </li>
                ))}
                <li className="pt-4 border-t border-[#3c434a]">
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      handleLogout();
                    }}
                    className="flex items-center gap-2 text-rose-400 py-2 px-2 text-xs"
                  >
                    <LogOut size={14} />
                    <span>Khóa / Đăng xuất</span>
                  </button>
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <main 
          className={`flex-1 flex flex-col min-h-[calc(100vh-32px)] transition-all duration-300 md:pt-0 pt-8 ${
            isSidebarCollapsed ? "md:ml-[36px]" : "md:ml-[170px]"
          }`}
        >
          <div className="flex-1 p-3 sm:p-5 mt-4 relative z-10">
            {children}
          </div>
        </main>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #3c434a;
        }
        .custom-scrollbar:hover::-webkit-scrollbar-thumb {
          background: #72aee6;
        }
      `}} />
    </div>
  );
}
