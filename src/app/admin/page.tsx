"use client";

import { useState, useEffect } from "react";
import {
  FileText,
  Image as ImageIcon,
  Heart,
  BookOpen,
  Sparkles,
  Feather,
  Plus,
  Trash2,
  ExternalLink,
  RefreshCw,
  MessageSquareHeart,
  Compass,
  Smile,
  Eye,
  Calendar,
  Loader2,
  Send,
  Coffee
} from "lucide-react";
import Link from "next/link";

interface GuestbookEntry {
  id: string;
  name: string;
  from: string;
  message: string;
  isFavorite: boolean;
  createdAt: string;
}

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

export default function AdminPeacefulDashboard() {
  const [guestbook, setGuestbook] = useState<GuestbookEntry[]>([]);
  const [posts, setPosts] = useState<PostItem[]>([]);
  const [gallery, setGallery] = useState<GalleryImg[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Form viết lưu bút mới
  const [isWritingNote, setIsWritingNote] = useState(false);
  const [authorName, setAuthorName] = useState("");
  const [authorFrom, setAuthorFrom] = useState("");
  const [noteMessage, setNoteMessage] = useState("");
  const [isSubmittingNote, setIsSubmittingNote] = useState(false);

  useEffect(() => {
    fetchPeacefulData();
  }, []);

  const fetchPeacefulData = async () => {
    setIsLoading(true);
    try {
      const [gbRes, postsRes, galleryRes] = await Promise.all([
        fetch("/api/guestbook").then((r) => r.json()).catch(() => ({ entries: [] })),
        fetch("/api/posts").then((r) => r.json()).catch(() => ({ posts: [] })),
        fetch("/api/gallery").then((r) => r.json()).catch(() => ({ images: [] })),
      ]);

      setGuestbook(gbRes.entries || []);
      setPosts(postsRes.posts || []);
      setGallery(galleryRes.images || []);
    } catch (error) {
      console.error("Lỗi tải dữ liệu sổ nhật ký:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle yêu thích / ghim lưu bút
  const handleToggleFavorite = async (id: string, current: boolean) => {
    try {
      const res = await fetch("/api/guestbook", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isFavorite: !current }),
      });
      if (res.ok) {
        setGuestbook((prev) =>
          prev.map((item) => (item.id === id ? { ...item, isFavorite: !current } : item))
        );
      }
    } catch (error) {
      console.error("Lỗi cập nhật lưu bút:", error);
    }
  };

  // Xóa lời nhắn
  const handleDeleteNote = async (id: string) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa dòng lưu bút này?")) return;
    try {
      const res = await fetch("/api/guestbook", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        setGuestbook((prev) => prev.filter((item) => item.id !== id));
      }
    } catch (error) {
      console.error("Lỗi xóa lưu bút:", error);
    }
  };

  // Ghi thêm dòng lưu bút mới
  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName || !noteMessage) return;
    setIsSubmittingNote(true);
    try {
      const res = await fetch("/api/guestbook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: authorName,
          from: authorFrom || "Lữ khách phương xa",
          message: noteMessage,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setGuestbook((prev) => [data.item, ...prev]);
        setAuthorName("");
        setAuthorFrom("");
        setNoteMessage("");
        setIsWritingNote(false);
      }
    } catch (error) {
      console.error("Lỗi thêm lưu bút:", error);
    } finally {
      setIsSubmittingNote(false);
    }
  };

  return (
    <div className="max-w-full space-y-6 pb-12 animate-in fade-in duration-300 font-sans">
      
      {/* 1. Header Trang Quản trị Phi Thương Mại */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#c3c4c7] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-[23px] font-semibold text-[#1d2327]">
              Sổ Nhật Ký Quản Trị • Cẩm Cù House
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-[#f0f0f1] text-[#2271b1] border border-[#c3c4c7]">
              Chốn Bình Yên
            </span>
          </div>
          <p className="text-xs text-[#50575e] mt-1">
            Không gian lưu giữ tản văn, khoảnh khắc thiên nhiên và sổ lưu bút của những tâm hồn đồng điệu ghé thăm.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={fetchPeacefulData}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs bg-white border border-[#8c8f94] hover:bg-[#f6f7f7] text-[#1d2327] rounded-sm shadow-sm transition-colors cursor-pointer"
          >
            <RefreshCw size={13} className={isLoading ? "animate-spin" : ""} />
            <span>Làm mới</span>
          </button>
          <Link
            href="/admin/posts"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs bg-[#2271b1] hover:bg-[#135e96] text-white rounded-sm shadow-sm transition-colors font-medium"
          >
            <Feather size={13} />
            <span>Viết tản văn mới</span>
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


      {/* 2. Bốn Thẻ Thống Kê Bình Yên (Phi Thương Mại) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Tản văn & Chuyện nhà */}
        <div className="bg-white border border-[#c3c4c7] rounded-sm p-4 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#50575e] mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Tản văn & Chuyện nhà</span>
            <BookOpen size={18} className="text-[#2271b1]" />
          </div>
          <div>
            <div className="text-3xl font-light text-[#1d2327]">{posts.length}</div>
            <div className="text-xs text-[#50575e] mt-1">
              bài viết về rừng, suối & hoa cẩm cù
            </div>
          </div>
          <div className="text-[11px] text-[#2271b1] mt-3 pt-2 border-t border-[#f0f0f1]">
            <Link href="/admin/posts" className="hover:underline">Xem tất cả tản văn &rarr;</Link>
          </div>
        </div>

        {/* Thư viện Khoảnh khắc */}
        <div className="bg-white border border-[#c3c4c7] rounded-sm p-4 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#50575e] mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Khoảnh khắc Thiên nhiên</span>
            <ImageIcon size={18} className="text-[#2271b1]" />
          </div>
          <div>
            <div className="text-3xl font-light text-[#1d2327]">{gallery.length}</div>
            <div className="text-xs text-[#50575e] mt-1">
              góc ảnh suối đá, giàn hoa & nắng mai
            </div>
          </div>
          <div className="text-[11px] text-[#2271b1] mt-3 pt-2 border-t border-[#f0f0f1]">
            <Link href="/admin/gallery" className="hover:underline">Mở thư viện ảnh &rarr;</Link>
          </div>
        </div>

        {/* Sổ lưu bút lữ khách */}
        <div className="bg-white border border-[#c3c4c7] rounded-sm p-4 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#50575e] mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Sổ lưu bút lữ khách</span>
            <MessageSquareHeart size={18} className="text-rose-500" />
          </div>
          <div>
            <div className="text-3xl font-light text-[#1d2327]">{guestbook.length}</div>
            <div className="text-xs text-rose-600 font-medium mt-1">
              {guestbook.filter((g) => g.isFavorite).length} dòng chia sẻ được ghim
            </div>
          </div>
          <div className="text-[11px] text-[#50575e] mt-3 pt-2 border-t border-[#f0f0f1]">
            Cảm xúc mộc mạc từ lữ khách
          </div>
        </div>

        {/* Tâm hồn ghé thăm */}
        <div className="bg-white border border-[#c3c4c7] rounded-sm p-4 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#50575e] mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Tâm hồn ghé thăm</span>
            <Sparkles size={18} className="text-amber-500" />
          </div>
          <div>
            <div className="text-3xl font-light text-[#1d2327]">1,280</div>
            <div className="text-xs text-[#50575e] mt-1">
              lữ khách tìm về tĩnh tại tuần này
            </div>
          </div>
          <div className="text-[11px] text-[#50575e] mt-3 pt-2 border-t border-[#f0f0f1]">
            Lan tỏa nét đẹp thiên nhiên Đắk Nông
          </div>
        </div>

      </div>


      {/* 3. KHU VỰC TRỌNG TÂM 1: SỔ LƯU BÚT & LỜI NHẮN LỮ KHÁCH */}
      <div className="bg-white border border-[#c3c4c7] rounded-sm p-4 sm:p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-[16px] font-semibold text-[#1d2327] flex items-center gap-2">
              <MessageSquareHeart size={18} className="text-rose-500" />
              <span>Sổ Lưu Bút & Lời Nhắn Lữ Khách</span>
            </h2>
            <p className="text-xs text-[#50575e]">
              Nơi lưu giữ những dòng chia sẻ, cảm nhận chân phương từ những người bạn yêu quý không gian Cẩm Cù House.
            </p>
          </div>

          <button
            onClick={() => setIsWritingNote(!isWritingNote)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs bg-[#2271b1] hover:bg-[#135e96] text-white rounded-sm transition-colors cursor-pointer"
          >
            <Feather size={13} />
            <span>Ghi thêm lưu bút</span>
          </button>
        </div>

        {/* Form ghi lưu bút mới */}
        {isWritingNote && (
          <form onSubmit={handleAddNote} className="mb-5 p-4 bg-[#fcfcfc] border border-[#2271b1] rounded-sm">
            <h3 className="text-xs font-semibold text-[#1d2327] uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Feather size={13} className="text-[#2271b1]" />
              <span>Ghi chép dòng cảm xúc của lữ khách</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
              <div>
                <label className="block text-[11px] font-medium text-[#50575e] mb-1">Tên người gửi</label>
                <input
                  type="text"
                  required
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="VD: An Nhiên, Minh Khang..."
                  className="w-full px-2.5 py-1.5 text-xs border border-[#8c8f94] rounded-sm focus:border-[#2271b1] outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-[#50575e] mb-1">Nơi chốn / Quê quán</label>
                <input
                  type="text"
                  value={authorFrom}
                  onChange={(e) => setAuthorFrom(e.target.value)}
                  placeholder="VD: Sài Gòn, Đà Lạt, Gia Nghĩa..."
                  className="w-full px-2.5 py-1.5 text-xs border border-[#8c8f94] rounded-sm focus:border-[#2271b1] outline-none"
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="block text-[11px] font-medium text-[#50575e] mb-1">Lời nhắn / Cảm nhận</label>
              <textarea
                required
                rows={3}
                value={noteMessage}
                onChange={(e) => setNoteMessage(e.target.value)}
                placeholder="Viết những dòng cảm nhận về tiếng suối, giàn hoa hay ly cà phê rang mộc..."
                className="w-full px-2.5 py-1.5 text-xs border border-[#8c8f94] rounded-sm focus:border-[#2271b1] outline-none"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                type="submit"
                disabled={isSubmittingNote}
                className="px-4 py-1.5 text-xs bg-[#2271b1] text-white rounded-sm hover:bg-[#135e96] font-medium cursor-pointer flex items-center gap-1.5"
              >
                <Send size={12} />
                <span>{isSubmittingNote ? "Đang lưu..." : "Lưu vào sổ"}</span>
              </button>
              <button
                type="button"
                onClick={() => setIsWritingNote(false)}
                className="px-3 py-1.5 text-xs border border-[#8c8f94] text-[#50575e] rounded-sm hover:bg-white cursor-pointer"
              >
                Đóng lại
              </button>
            </div>
          </form>
        )}

        {/* Danh sách các dòng lưu bút dạng thẻ mộc */}
        {isLoading ? (
          <div className="py-10 text-center text-[#50575e]">
            <Loader2 size={20} className="animate-spin inline mr-2 text-[#2271b1]" />
            Đang mở trang sổ lưu bút...
          </div>
        ) : guestbook.length === 0 ? (
          <div className="py-8 text-center text-[#50575e] bg-[#fcfcfc] border border-dashed border-[#c3c4c7] rounded-sm">
            Chưa có dòng lưu bút nào. Hãy bấm &quot;Ghi thêm lưu bút&quot; để lưu lại cảm xúc đầu tiên.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {guestbook.map((note) => (
              <div
                key={note.id}
                className={`p-4 rounded-sm border transition-all flex flex-col justify-between ${
                  note.isFavorite
                    ? "bg-[#fffdf7] border-amber-300 shadow-sm"
                    : "bg-white border-[#c3c4c7] hover:border-[#8c8f94]"
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <span className="font-semibold text-xs text-[#1d2327] block">
                        {note.name}
                      </span>
                      <span className="text-[11px] text-[#50575e]">
                        {note.from}
                      </span>
                    </div>

                    <button
                      onClick={() => handleToggleFavorite(note.id, note.isFavorite)}
                      className={`p-1 rounded cursor-pointer transition-colors ${
                        note.isFavorite ? "text-amber-500 hover:text-amber-600" : "text-[#a7aaad] hover:text-amber-500"
                      }`}
                      title={note.isFavorite ? "Bỏ ghim khỏi hiên nhà" : "Ghim lên hiên nhà"}
                    >
                      <Heart size={15} fill={note.isFavorite ? "currentColor" : "none"} />
                    </button>
                  </div>

                  <p className="text-xs text-[#3c434a] font-serif italic leading-relaxed pt-1 border-t border-[#f0f0f1]">
                    &ldquo;{note.message}&rdquo;
                  </p>
                </div>

                <div className="flex items-center justify-between mt-3 pt-2 border-t border-[#f0f0f1] text-[10px] text-[#a7aaad]">
                  <span>{new Date(note.createdAt).toLocaleDateString("vi-VN")}</span>
                  <button
                    onClick={() => handleDeleteNote(note.id)}
                    className="text-[#b32d2e] hover:underline cursor-pointer flex items-center gap-0.5"
                  >
                    <Trash2 size={11} />
                    <span>Xóa</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>


      {/* 4. KHU VỰC TRỌNG TÂM 2: BÀI VIẾT & TẢN VĂN MỚI NHẤT */}
      <div className="bg-white border border-[#c3c4c7] rounded-sm p-4 sm:p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h2 className="text-[16px] font-semibold text-[#1d2327] flex items-center gap-2">
              <BookOpen size={17} className="text-[#2271b1]" />
              <span>Bài Viết & Tản Văn Cẩm Cù House</span>
            </h2>
            <p className="text-xs text-[#50575e]">
              Những mẩu chuyện về cây lá, bờ suối đá, giàn hoa và đời sống mộc mạc nơi cao nguyên.
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

        {/* Danh sách tản văn */}
        <div className="border border-[#c3c4c7] rounded-sm overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse min-w-[650px]">
            <thead>
              <tr className="bg-[#fcfcfc] border-b border-[#c3c4c7] text-[#1d2327]">
                <th className="px-3 py-2.5 font-semibold">Tên tản văn</th>
                <th className="px-3 py-2.5 font-semibold">Chuyên mục</th>
                <th className="px-3 py-2.5 font-semibold">Ngày đăng</th>
                <th className="px-3 py-2.5 font-semibold text-right w-28">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0f0f1]">
              {posts.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-6 text-center text-[#50575e]">
                    Chưa có bài viết nào. Hãy bấm &quot;Viết tản văn mới&quot; để bắt đầu chia sẻ.
                  </td>
                </tr>
              ) : (
                posts.slice(0, 5).map((post) => (
                  <tr key={post.id} className="hover:bg-[#f9f9f9] transition-colors">
                    <td className="px-3 py-2.5">
                      <Link
                        href="/admin/posts"
                        className="font-medium text-[#2271b1] hover:underline block text-xs"
                      >
                        {post.title}
                      </Link>
                      {post.summary && (
                        <p className="text-[11px] text-[#50575e] truncate max-w-[380px] mt-0.5">
                          {post.summary}
                        </p>
                      )}
                    </td>
                    <td className="px-3 py-2.5 text-[#50575e]">
                      <span className="px-2 py-0.5 rounded bg-[#f0f0f1] text-[11px]">
                        {post.category || "Chuyện Nhà"}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-[#50575e] font-mono">
                      {post.date || "—"}
                    </td>
                    <td className="px-3 py-2.5 text-right">
                      <Link
                        href="/admin/posts"
                        className="text-[#2271b1] hover:underline font-medium"
                      >
                        Chỉnh sửa
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>


      {/* 5. KHU VỰC TRỌNG TÂM 3: BỘ SƯU TẬP KHOẢNH KHẮC THIÊN NHIÊN */}
      <div className="bg-white border border-[#c3c4c7] rounded-sm p-4 sm:p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h2 className="text-[16px] font-semibold text-[#1d2327] flex items-center gap-2">
              <ImageIcon size={17} className="text-[#2271b1]" />
              <span>Bộ Sưu Tập Góc Quán & Hoa Cẩm Cù</span>
            </h2>
            <p className="text-xs text-[#50575e]">
              Kho hình ảnh thiên nhiên, bờ suối và không gian mộc mạc tại Đắk Nông.
            </p>
          </div>

          <Link
            href="/admin/gallery"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs bg-[#2271b1] hover:bg-[#135e96] text-white rounded-sm transition-colors cursor-pointer"
          >
            <Plus size={13} />
            <span>Tải thêm ảnh mới</span>
          </Link>
        </div>

        {/* Lưới ảnh thu nhỏ */}
        {gallery.length === 0 ? (
          <div className="py-6 text-center text-[#50575e] bg-[#fcfcfc] border border-dashed border-[#c3c4c7] rounded-sm text-xs">
            Chưa có hình ảnh nào trong kho lưu trữ.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2 sm:gap-3">
            {gallery.slice(0, 6).map((img, idx) => (
              <div
                key={img.id || idx}
                className="group relative aspect-square rounded-sm overflow-hidden border border-[#c3c4c7] bg-black/10 shadow-sm"
              >
                <img
                  src={img.url}
                  alt="Góc quán Cẩm Cù"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        )}

        <div className="mt-3 pt-2 text-right">
          <Link href="/admin/gallery" className="text-xs text-[#2271b1] hover:underline">
            Xem toàn bộ {gallery.length} hình ảnh trong thư viện &rarr;
          </Link>
        </div>
      </div>

    </div>
  );
}
