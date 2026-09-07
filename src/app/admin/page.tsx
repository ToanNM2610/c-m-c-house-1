"use client";

import { useState, useEffect } from "react";
import {
  FileText,
  Image as ImageIcon,
  BookOpen,
  Feather,
  Plus,
  ExternalLink,
  RefreshCw,
  Loader2,
  Eye,
  Calendar,
  Sparkles
} from "lucide-react";
import Link from "next/link";

interface PostItem {
  id: string;
  title: string;
  date: string;
  summary: string;
  category: string;
  coverImage?: string;
}

interface GalleryImg {
  id: string;
  url: string;
  caption?: string;
}

export default function AdminContentDashboard() {
  const [posts, setPosts] = useState<PostItem[]>([]);
  const [gallery, setGallery] = useState<GalleryImg[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchContentData();
  }, []);

  const fetchContentData = async () => {
    setIsLoading(true);
    try {
      const [postsRes, galleryRes] = await Promise.all([
        fetch("/api/posts").then((r) => r.json()).catch(() => ({ posts: [] })),
        fetch("/api/gallery").then((r) => r.json()).catch(() => ({ images: [] })),
      ]);

      setPosts(postsRes.posts || []);
      setGallery(galleryRes.images || []);
    } catch (error) {
      console.error("Lỗi tải dữ liệu nội dung:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-full space-y-6 pb-12 animate-in fade-in duration-300 font-sans">
      
      {/* 1. Header Trang Quản Trị Tối Giản */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#c3c4c7] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-[23px] font-semibold text-[#1d2327]">
              Quản Trị Không Gian • Cẩm Cù House
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-[#f0f0f1] text-[#2271b1] border border-[#c3c4c7]">
              Chốn Bình Yên
            </span>
          </div>
          <p className="text-xs text-[#50575e] mt-1">
            Chốn lưu giữ những mẩu chuyện mộc mạc về rừng, bờ suối đá và khoảnh khắc bình yên Đắk Nông.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={fetchContentData}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs bg-white border border-[#8c8f94] hover:bg-[#f6f7f7] text-[#1d2327] rounded-sm shadow-sm transition-colors cursor-pointer"
          >
            <RefreshCw size={13} className={isLoading ? "animate-spin" : ""} />
            <span>Làm mới</span>
          </button>
          <Link
            href="/admin/posts"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs bg-[#2271b1] hover:bg-[#135e96] text-white rounded-sm shadow-sm transition-colors font-medium cursor-pointer"
          >
            <Feather size={13} />
            <span>Viết tản văn mới</span>
          </Link>
          <Link
            href="/admin/gallery"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs bg-white border border-[#8c8f94] hover:bg-[#f6f7f7] text-[#1d2327] rounded-sm shadow-sm transition-colors font-medium cursor-pointer"
          >
            <ImageIcon size={13} />
            <span>Tải thêm ảnh</span>
          </Link>
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs border border-[#8c8f94] text-[#1d2327] hover:bg-[#f6f7f7] rounded-sm transition-colors"
          >
            <ExternalLink size={12} />
            <span>Xem website</span>
          </Link>
        </div>
      </div>


      {/* 2. KHU VỰC 1: DANH SÁCH TẢN VĂN & CHUYỆN NHÀ (BÀI VIẾT) */}
      <div className="bg-white border border-[#c3c4c7] rounded-sm p-4 sm:p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-[16px] font-semibold text-[#1d2327] flex items-center gap-2">
              <BookOpen size={17} className="text-[#2271b1]" />
              <span>Tản Văn & Chuyện Nhà</span>
            </h2>
            <p className="text-xs text-[#50575e]">
              Những mẩu chuyện về cây lá, bờ suối đá, giàn hoa cẩm cù và đời sống mộc mạc nơi cao nguyên.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/admin/posts"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs bg-[#2271b1] hover:bg-[#135e96] text-white rounded-sm transition-colors cursor-pointer"
            >
              <Plus size={13} />
              <span>Viết tản văn mới</span>
            </Link>
            <Link
              href="/posts"
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs border border-[#8c8f94] text-[#1d2327] hover:bg-[#f6f7f7] rounded-sm transition-colors"
            >
              <span>Xem trang Chuyện nhà</span>
              <ExternalLink size={12} />
            </Link>
          </div>
        </div>

        {/* Bảng danh sách tản văn */}
        <div className="border border-[#c3c4c7] rounded-sm overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse min-w-[650px]">
            <thead>
              <tr className="bg-[#fcfcfc] border-b border-[#c3c4c7] text-[#1d2327]">
                <th className="px-3.5 py-2.5 font-semibold">Tên tản văn</th>
                <th className="px-3.5 py-2.5 font-semibold">Chuyên mục</th>
                <th className="px-3.5 py-2.5 font-semibold">Ngày đăng</th>
                <th className="px-3.5 py-2.5 font-semibold text-right w-36">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0f0f1]">
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-[#50575e]">
                    <Loader2 size={20} className="animate-spin inline mr-2 text-[#2271b1]" />
                    Đang tải danh sách bài viết...
                  </td>
                </tr>
              ) : posts.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-[#50575e]">
                    Chưa có bài viết nào. Hãy bấm &quot;Viết tản văn mới&quot; để bắt đầu chia sẻ câu chuyện đầu tiên.
                  </td>
                </tr>
              ) : (
                posts.map((post) => (
                  <tr key={post.id} className="hover:bg-[#f9f9f9] transition-colors">
                    <td className="px-3.5 py-3">
                      <Link
                        href="/admin/posts"
                        className="font-medium text-[#2271b1] hover:underline block text-[13px]"
                      >
                        {post.title}
                      </Link>
                      {post.summary && (
                        <p className="text-[11px] text-[#50575e] line-clamp-1 max-w-[460px] mt-0.5">
                          {post.summary}
                        </p>
                      )}
                    </td>
                    <td className="px-3.5 py-3 text-[#50575e]">
                      <span className="px-2 py-0.5 rounded bg-[#f0f0f1] text-[11px]">
                        {post.category || "Chuyện Nhà"}
                      </span>
                    </td>
                    <td className="px-3.5 py-3 text-[#50575e] font-mono">
                      {post.date || "—"}
                    </td>
                    <td className="px-3.5 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href="/admin/posts"
                          className="text-[#2271b1] hover:underline font-medium"
                        >
                          Chỉnh sửa
                        </Link>
                        <span className="text-[#c3c4c7]">|</span>
                        <Link
                          href={`/posts/${post.id}`}
                          target="_blank"
                          className="text-[#50575e] hover:text-[#1d2327] hover:underline inline-flex items-center gap-0.5"
                        >
                          <span>Xem</span>
                          <ExternalLink size={10} />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-3 pt-2 text-right">
          <Link href="/admin/posts" className="text-xs text-[#2271b1] hover:underline">
            Quản lý toàn bộ bài viết trong hệ thống &rarr;
          </Link>
        </div>
      </div>


      {/* 3. KHU VỰC 2: THƯ VIỆN HÌNH ẢNH KHÔNG GIAN */}
      <div className="bg-white border border-[#c3c4c7] rounded-sm p-4 sm:p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-[16px] font-semibold text-[#1d2327] flex items-center gap-2">
              <ImageIcon size={17} className="text-[#2271b1]" />
              <span>Thư Viện Hình Ảnh Không Gian</span>
            </h2>
            <p className="text-xs text-[#50575e]">
              Bộ sưu tập góc hoa cẩm cù, bờ suối đá và thiên nhiên mộc mạc tại Đắk Nông.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/admin/gallery"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs bg-[#2271b1] hover:bg-[#135e96] text-white rounded-sm transition-colors cursor-pointer"
            >
              <Plus size={13} />
              <span>Tải thêm ảnh mới</span>
            </Link>
            <Link
              href="/space"
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs border border-[#8c8f94] text-[#1d2327] hover:bg-[#f6f7f7] rounded-sm transition-colors"
            >
              <span>Xem trang Không gian</span>
              <ExternalLink size={12} />
            </Link>
          </div>
        </div>

        {/* Lưới xem trước hình ảnh không gian */}
        {isLoading ? (
          <div className="py-10 text-center text-[#50575e]">
            <Loader2 size={20} className="animate-spin inline mr-2 text-[#2271b1]" />
            Đang tải hình ảnh không gian...
          </div>
        ) : gallery.length === 0 ? (
          <div className="py-8 text-center text-[#50575e] bg-[#fcfcfc] border border-dashed border-[#c3c4c7] rounded-sm text-xs">
            Chưa có hình ảnh nào trong kho lưu trữ. Hãy bấm &quot;Tải thêm ảnh mới&quot; để bổ sung góc ảnh đẹp.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {gallery.slice(0, 12).map((img, idx) => (
              <div
                key={img.id || idx}
                className="group relative aspect-square rounded-sm overflow-hidden border border-[#c3c4c7] bg-black/10 shadow-sm"
              >
                <img
                  src={img.url}
                  alt={img.caption || "Góc quán Cẩm Cù"}
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-300"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Link
                    href="/admin/gallery"
                    className="p-1.5 rounded-full bg-white/90 text-[#1d2327] hover:bg-white shadow"
                    title="Quản lý ảnh"
                  >
                    <Eye size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-4 pt-2 border-t border-[#f0f0f1] flex items-center justify-between text-xs">
          <span className="text-[#50575e]">
            Hiển thị các góc ảnh mới nhất của Cẩm Cù House
          </span>
          <Link href="/admin/gallery" className="text-[#2271b1] hover:underline font-medium">
            Quản lý toàn bộ kho ảnh trong thư viện &rarr;
          </Link>
        </div>
      </div>

    </div>
  );
}
