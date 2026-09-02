"use client";

import { useState, useEffect } from "react";
import { FileText, Coffee, Image as ImageIcon, Users, Loader2 } from "lucide-react";
import Link from "next/link";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    posts: 0,
    menu: 0,
    gallery: 0,
    users: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [postsRes, menuRes, galleryRes, usersRes] = await Promise.all([
          fetch("/api/posts").then(r => r.json()),
          fetch("/api/menu").then(r => r.json()),
          fetch("/api/gallery").then(r => r.json()),
          fetch("/api/users").then(r => r.json()),
        ]);

        setStats({
          posts: postsRes.posts?.length || 0,
          menu: menuRes.menu?.length || 0,
          gallery: galleryRes.images?.length || 0,
          users: usersRes.users?.length || 0,
        });
      } catch (error) {
        console.error("Lỗi tải thống kê:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchStats();
  }, []);

  return (
    <div className="max-w-full animate-in fade-in duration-300 -mt-2">
      <div className="flex items-center gap-2 mb-6">
        <h1 className="text-[23px] font-normal text-[#1d2327]">Bảng tin</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Posts */}
        <div className="bg-white border border-[#c3c4c7] rounded-sm shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 flex items-center justify-between border-b border-[#c3c4c7] bg-[#fcfcfc]">
            <div className="flex items-center gap-2 text-[#1d2327]">
              <FileText size={20} className="text-[#2271b1]" />
              <h2 className="text-[14px] font-semibold">Bài viết</h2>
            </div>
          </div>
          <div className="p-4 flex-1 flex flex-col justify-center items-center">
            {isLoading ? <Loader2 className="animate-spin text-[#2271b1]" size={24} /> : (
              <div className="text-4xl font-light text-[#2271b1]">{stats.posts}</div>
            )}
            <div className="text-[13px] text-[#3c434a] mt-1">bài viết đã xuất bản</div>
          </div>
          <div className="bg-[#f6f7f7] px-4 py-2 border-t border-[#c3c4c7]">
            <Link href="/admin/posts" className="text-[13px] text-[#2271b1] hover:underline">Quản lý Bài viết &rarr;</Link>
          </div>
        </div>

        {/* Menu */}
        <div className="bg-white border border-[#c3c4c7] rounded-sm shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 flex items-center justify-between border-b border-[#c3c4c7] bg-[#fcfcfc]">
            <div className="flex items-center gap-2 text-[#1d2327]">
              <Coffee size={20} className="text-[#2271b1]" />
              <h2 className="text-[14px] font-semibold">Thực đơn</h2>
            </div>
          </div>
          <div className="p-4 flex-1 flex flex-col justify-center items-center">
            {isLoading ? <Loader2 className="animate-spin text-[#2271b1]" size={24} /> : (
              <div className="text-4xl font-light text-[#2271b1]">{stats.menu}</div>
            )}
            <div className="text-[13px] text-[#3c434a] mt-1">món đang phục vụ</div>
          </div>
          <div className="bg-[#f6f7f7] px-4 py-2 border-t border-[#c3c4c7]">
            <Link href="/admin/menu" className="text-[13px] text-[#2271b1] hover:underline">Quản lý Thực đơn &rarr;</Link>
          </div>
        </div>

        {/* Gallery */}
        <div className="bg-white border border-[#c3c4c7] rounded-sm shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 flex items-center justify-between border-b border-[#c3c4c7] bg-[#fcfcfc]">
            <div className="flex items-center gap-2 text-[#1d2327]">
              <ImageIcon size={20} className="text-[#2271b1]" />
              <h2 className="text-[14px] font-semibold">Hình ảnh</h2>
            </div>
          </div>
          <div className="p-4 flex-1 flex flex-col justify-center items-center">
            {isLoading ? <Loader2 className="animate-spin text-[#2271b1]" size={24} /> : (
              <div className="text-4xl font-light text-[#2271b1]">{stats.gallery}</div>
            )}
            <div className="text-[13px] text-[#3c434a] mt-1">ảnh không gian</div>
          </div>
          <div className="bg-[#f6f7f7] px-4 py-2 border-t border-[#c3c4c7]">
            <Link href="/admin/gallery" className="text-[13px] text-[#2271b1] hover:underline">Thư viện ảnh &rarr;</Link>
          </div>
        </div>

        {/* Users */}
        <div className="bg-white border border-[#c3c4c7] rounded-sm shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 flex items-center justify-between border-b border-[#c3c4c7] bg-[#fcfcfc]">
            <div className="flex items-center gap-2 text-[#1d2327]">
              <Users size={20} className="text-[#2271b1]" />
              <h2 className="text-[14px] font-semibold">Người dùng</h2>
            </div>
          </div>
          <div className="p-4 flex-1 flex flex-col justify-center items-center">
            {isLoading ? <Loader2 className="animate-spin text-[#2271b1]" size={24} /> : (
              <div className="text-4xl font-light text-[#2271b1]">{stats.users}</div>
            )}
            <div className="text-[13px] text-[#3c434a] mt-1">tài khoản hoạt động</div>
          </div>
          <div className="bg-[#f6f7f7] px-4 py-2 border-t border-[#c3c4c7]">
            <Link href="/admin/users" className="text-[13px] text-[#2271b1] hover:underline">Quản lý Tài khoản &rarr;</Link>
          </div>
        </div>

      </div>
    </div>
  );
}
