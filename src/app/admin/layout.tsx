"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Home, 
  LayoutDashboard, 
  Coffee, 
  Image as ImageIcon, 
  FileText, 
  Menu as MenuIcon,
  ChevronLeft,
  ChevronRight,
  User,
  MessageSquare,
  Brush,
  Wrench,
  Settings,
  Users,
  ShoppingCart,
  Zap,
  BarChart2,
  Plug,
  MessageCircle,
  HelpCircle,
  Settings2,
  PaintBucket,
  Code
} from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // WP Admin Sidebar Items Simulation
  const navItems = [
    { name: "Bảng tin", href: "/admin", icon: <LayoutDashboard size={18} /> },
    { 
      name: "Bài viết", 
      href: "/admin/posts", 
      icon: <FileText size={18} />,
      isActive: pathname.startsWith("/admin/posts"),
      subMenu: [
        { name: "Tất cả bài viết", href: "/admin/posts" },
        { name: "Viết bài mới", href: "#" },
        { name: "Chuyên mục", href: "#" },
        { name: "Thẻ", href: "#" }
      ]
    },
    { name: "Quản lý Thực đơn", href: "/admin/menu", icon: <Coffee size={18} /> },
    { name: "Thư viện ảnh", href: "/admin/gallery", icon: <ImageIcon size={18} /> },
    { name: "Tài khoản", href: "/admin/users", icon: <Users size={18} /> },
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
              <Link href="/admin/posts" className="px-3 py-2 text-[#c3c4c7] hover:text-[#72aee6] hover:bg-[#2c3338] text-[13px] flex items-center gap-2"><FileText size={14}/> Bài viết</Link>
              <Link href="/admin/menu" className="px-3 py-2 text-[#c3c4c7] hover:text-[#72aee6] hover:bg-[#2c3338] text-[13px] flex items-center gap-2"><Coffee size={14}/> Món ăn</Link>
              <Link href="/admin/gallery" className="px-3 py-2 text-[#c3c4c7] hover:text-[#72aee6] hover:bg-[#2c3338] text-[13px] flex items-center gap-2"><ImageIcon size={14}/> Hình ảnh</Link>
              <Link href="/admin/users" className="px-3 py-2 text-[#c3c4c7] hover:text-[#72aee6] hover:bg-[#2c3338] text-[13px] flex items-center gap-2"><Users size={14}/> Người dùng</Link>
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
              <Link href="/" className="px-3 py-2 text-[#c3c4c7] hover:text-[#72aee6] hover:bg-[#2c3338] text-[13px]">Đăng xuất</Link>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 pt-[32px]">
        {/* WP SideBar (Desktop) */}
        <aside 
          className={`bg-[#1d2327] text-[#c3c4c7] fixed top-[32px] bottom-0 left-0 z-40 hidden md:flex flex-col transition-all duration-300 ease-in-out ${
            isSidebarCollapsed ? "w-[36px]" : "w-[160px]"
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

                    {/* Sub Menu (WP style) */}
                    {item.subMenu && isItemActive && !isSidebarCollapsed && (
                      <ul className="bg-[#1d2327] py-1">
                        {item.subMenu.map(sub => (
                          <li key={sub.name}>
                            <Link href={sub.href} className={`block px-3 py-1.5 text-[13px] pl-10 ${sub.name === "Tất cả bài viết" ? "text-white font-medium" : "text-[#c3c4c7] hover:text-[#72aee6]"}`}>
                              {sub.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
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
          <span className="text-[#c3c4c7] font-medium ml-2">Menu quản trị</span>
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-1 text-[#c3c4c7] hover:text-white"
          >
            <MenuIcon size={24} />
          </button>
        </div>

        {/* Main Content Area */}
        <main 
          className={`flex-1 flex flex-col min-h-[calc(100vh-32px)] transition-all duration-300 md:pt-0 pt-10 ${
            isSidebarCollapsed ? "md:ml-[36px]" : "md:ml-[160px]"
          }`}
        >


          <div className="flex-1 p-3 sm:p-5 mt-6 relative z-10">
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
