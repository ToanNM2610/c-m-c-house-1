"use client";

import { useState, useEffect, useMemo } from "react";
import { Plus, Edit2, Trash2, X, Loader2, Save, Upload, Link as LinkIcon, ExternalLink, MessageCircle } from "lucide-react";
import Link from "next/link";

interface Post {
  id: string;
  title: string;
  coverImage: string;
  date: string;
  summary: string;
  content: string;
  category: string;
  status: string;
  author: string;
  seoKeyword?: string;
  seoTitle?: string;
  seoDescription?: string;
}

export default function AdminPostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Table vs Edit View
  const [currentView, setCurrentView] = useState<"table" | "edit">("table");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);

  // Table State
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkAction, setBulkAction] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Notices State
  const [showRankMathNotice, setShowRankMathNotice] = useState(true);
  const [showWelcomeNotice, setShowWelcomeNotice] = useState(true);

  // Form State
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("Chuyện Nhà");
  const [status, setStatus] = useState("publish");
  const [coverImage, setCoverImage] = useState("");
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [imageMode, setImageMode] = useState<"url" | "upload">("url");
  const [seoKeyword, setSeoKeyword] = useState("");
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await fetch("/api/posts");
      const data = await res.json();
      if (data.posts) {
        setPosts(data.posts);
      }
    } catch (error) {
      console.error("Lỗi tải bài viết:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const categories = useMemo(() => {
    const cats = new Set(posts.map(p => p.category));
    return Array.from(cats);
  }, [posts]);

  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      const matchStatus = statusFilter === "all" || post.status === statusFilter;
      const matchCat = categoryFilter === "all" || post.category === categoryFilter;
      const matchSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase());
      return matchStatus && matchCat && matchSearch;
    });
  }, [posts, statusFilter, categoryFilter, searchQuery]);

  const counts = useMemo(() => {
    return {
      all: posts.length,
      publish: posts.filter(p => p.status === "publish").length,
      draft: posts.filter(p => p.status === "draft").length,
    };
  }, [posts]);

  // Actions
  const toggleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(filteredPosts.map(p => p.id));
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
      if (!window.confirm(`Bạn có chắc chắn muốn xóa ${selectedIds.length} mục đã chọn?`)) return;
      
      try {
        const res = await fetch("/api/posts", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ids: selectedIds }),
        });
        if (res.ok) {
          setSelectedIds([]);
          await fetchPosts();
        }
      } catch (error) {
        console.error("Lỗi xóa bài viết:", error);
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa bài viết này không?")) return;
    try {
      const res = await fetch("/api/posts", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        await fetchPosts();
      }
    } catch (error) {
      console.error("Lỗi xóa bài viết:", error);
    }
  };

  const openEditor = (post?: Post) => {
    if (post) {
      setEditingPost(post);
      setTitle(post.title);
      setDate(post.date);
      setSummary(post.summary);
      setContent(post.content);
      setCategory(post.category);
      setStatus(post.status);
      setCoverImage(post.coverImage);
      setCoverImageFile(null);
      setImageMode("url");
      setSeoKeyword(post.seoKeyword || "");
      setSeoTitle(post.seoTitle || "");
      setSeoDescription(post.seoDescription || "");
    } else {
      setEditingPost(null);
      setTitle("");
      setDate(new Date().toISOString().split("T")[0]);
      setSummary("");
      setContent("");
      setCategory("Chuyện Nhà");
      setStatus("publish");
      setCoverImage("");
      setCoverImageFile(null);
      setImageMode("url");
      setSeoKeyword("");
      setSeoTitle("");
      setSeoDescription("");
    }
    setCurrentView("edit");
  };

  const closeEditor = () => {
    setCurrentView("table");
    setEditingPost(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("date", date);
      formData.append("summary", summary);
      formData.append("content", content);
      formData.append("category", category);
      formData.append("status", status);
      formData.append("seoKeyword", seoKeyword);
      formData.append("seoTitle", seoTitle);
      formData.append("seoDescription", seoDescription);

      if (imageMode === "upload" && coverImageFile) {
        formData.append("coverImage", coverImageFile);
      } else if (imageMode === "url" && coverImage) {
        formData.append("coverImage", coverImage);
      }

      let res;
      if (editingPost) {
        formData.append("id", editingPost.id);
        res = await fetch("/api/posts", { method: "PUT", body: formData });
      } else {
        res = await fetch("/api/posts", { method: "POST", body: formData });
      }

      if (res.ok) {
        await fetchPosts();
        closeEditor();
      } else {
        alert("Có lỗi xảy ra khi lưu bài viết.");
      }
    } catch (error) {
      console.error("Lỗi lưu bài viết:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (currentView === "edit") {
    return (
      <div className="max-w-[1200px] mx-auto animate-in fade-in duration-300">
        <div className="flex items-center gap-3 mb-4">
          <h1 className="text-[23px] font-normal text-[#1d2327]">
            {editingPost ? "Chỉnh sửa bài viết" : "Thêm bài viết mới"}
          </h1>
          <button 
            onClick={closeEditor}
            className="text-[13px] border border-[#2271b1] text-[#2271b1] px-3 py-1 rounded hover:bg-[#f0f0f1] transition-colors"
          >
            Quay lại
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-5">
          {/* Main Column */}
          <div className="flex-1 space-y-4">
            <div>
              <input 
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="Thêm tiêu đề"
                className="w-full text-[20px] px-3 py-2 border border-[#8c8f94] rounded-sm focus:border-[#2271b1] focus:ring-1 focus:ring-[#2271b1] outline-none shadow-[inset_0_1px_2px_rgba(0,0,0,0.07)]"
              />
            </div>
            
            <div className="bg-white border border-[#c3c4c7] rounded-sm">
              <div className="bg-[#f0f0f1] border-b border-[#c3c4c7] px-3 py-2 text-[13px] font-semibold text-[#1d2327]">
                Tóm tắt ngắn (Trích dẫn)
              </div>
              <div className="p-3">
                <textarea 
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  rows={2}
                  className="w-full text-[14px] p-2 border border-[#8c8f94] rounded-sm focus:border-[#2271b1] focus:ring-1 focus:ring-[#2271b1] outline-none resize-y"
                ></textarea>
              </div>
            </div>

            <div className="bg-white border border-[#c3c4c7] rounded-sm">
              <div className="bg-[#f0f0f1] border-b border-[#c3c4c7] px-3 py-2 flex gap-2">
                <button type="button" className="text-[13px] border border-[#8c8f94] px-2 py-1 bg-[#f6f7f7] hover:bg-white rounded-sm text-[#3c434a]">Thêm Media</button>
              </div>
              <div>
                <textarea 
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                  rows={15}
                  className="w-full text-[14px] p-4 focus:outline-none resize-y font-mono bg-[#f0f0f1]/30"
                ></textarea>
              </div>
            </div>

            {/* Rank Math SEO Box */}
            <div className="bg-white border border-[#c3c4c7] rounded-sm mt-4">
              <div className="bg-[#f0f0f1] border-b border-[#c3c4c7] px-3 py-3 flex items-center justify-between">
                <div className="font-semibold text-[#1d2327] text-[14px]">Rank Math SEO</div>
                <div className="flex items-center gap-2">
                  <span className="text-[12px] text-[#3c434a]">Điểm SEO:</span>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-bold text-white ${seoTitle.length > 40 && seoDescription.length > 100 && seoKeyword ? "bg-green-600" : (seoTitle.length > 20 || seoDescription.length > 50 ? "bg-orange-500" : "bg-red-500")}`}>
                    {seoTitle.length > 40 && seoDescription.length > 100 && seoKeyword ? "85" : (seoTitle.length > 20 || seoDescription.length > 50 ? "55" : "15")}
                  </div>
                </div>
              </div>
              
              <div className="p-4 space-y-4">
                {/* Focus Keyword */}
                <div>
                  <label className="block text-[13px] font-semibold text-[#1d2327] mb-1">Từ khóa chính (Focus Keyword)</label>
                  <input 
                    type="text" 
                    value={seoKeyword}
                    onChange={(e) => setSeoKeyword(e.target.value)}
                    placeholder="VD: cà phê đắk nông"
                    className="w-full text-[13px] px-3 py-2 border border-[#8c8f94] rounded-sm focus:border-[#2271b1] focus:ring-1 focus:ring-[#2271b1] outline-none"
                  />
                  <p className="text-[12px] text-[#8c8f94] mt-1">Từ khóa quan trọng nhất mà bạn muốn bài viết này lên top Google.</p>
                </div>

                {/* Google Search Preview */}
                <div className="border border-[#c3c4c7] rounded-sm p-4 bg-[#fcfcfc]">
                  <div className="text-[13px] font-semibold text-[#1d2327] mb-2 flex items-center gap-2">
                    <ExternalLink size={14} /> Xem trước trên Google (Search Preview)
                  </div>
                  <div className="bg-white p-3 border border-[#e2e4e7] rounded-md shadow-sm">
                    <div className="text-[12px] text-[#202124] flex items-center gap-2 mb-1">
                      <div className="w-6 h-6 bg-[#f0f0f1] rounded-full flex items-center justify-center text-[10px]">C</div>
                      <span className="truncate">camcuhouse.vercel.app &rsaquo; posts &rsaquo; ...</span>
                    </div>
                    <div className="text-[20px] text-[#1a0dab] font-normal hover:underline cursor-pointer leading-tight truncate">
                      {seoTitle || title || "Tiêu đề bài viết sẽ hiển thị ở đây"}
                    </div>
                    <div className="text-[14px] text-[#4d5156] mt-1 line-clamp-2 leading-snug">
                      {new Date(date || Date.now()).toLocaleDateString("vi-VN", { month: "short", day: "numeric", year: "numeric" })} — {seoDescription || summary || "Phần mô tả ngắn gọn giúp người dùng Google hiểu rõ nội dung bài viết trước khi nhấp vào xem..."}
                    </div>
                  </div>
                </div>

                {/* SEO Title */}
                <div>
                  <div className="flex justify-between mb-1">
                    <label className="block text-[13px] font-semibold text-[#1d2327]">Tiêu đề SEO (Title)</label>
                    <span className={`text-[12px] ${seoTitle.length >= 50 && seoTitle.length <= 60 ? "text-green-600" : (seoTitle.length > 60 ? "text-red-500" : "text-orange-500")}`}>
                      {seoTitle.length}/60
                    </span>
                  </div>
                  <input 
                    type="text" 
                    value={seoTitle}
                    onChange={(e) => setSeoTitle(e.target.value)}
                    placeholder="Nhập tiêu đề SEO chuẩn (50-60 ký tự)"
                    className="w-full text-[13px] px-3 py-2 border border-[#8c8f94] rounded-sm focus:border-[#2271b1] focus:ring-1 focus:ring-[#2271b1] outline-none"
                  />
                  <div className="w-full h-1 bg-[#f0f0f1] mt-1 rounded-full overflow-hidden">
                    <div className={`h-full transition-all ${seoTitle.length >= 50 && seoTitle.length <= 60 ? "bg-green-500" : (seoTitle.length > 60 ? "bg-red-500" : "bg-orange-500")}`} style={{ width: `${Math.min(100, (seoTitle.length / 60) * 100)}%` }}></div>
                  </div>
                </div>

                {/* SEO Description */}
                <div>
                  <div className="flex justify-between mb-1">
                    <label className="block text-[13px] font-semibold text-[#1d2327]">Mô tả SEO (Meta Description)</label>
                    <span className={`text-[12px] ${seoDescription.length >= 120 && seoDescription.length <= 160 ? "text-green-600" : (seoDescription.length > 160 ? "text-red-500" : "text-orange-500")}`}>
                      {seoDescription.length}/160
                    </span>
                  </div>
                  <textarea 
                    value={seoDescription}
                    onChange={(e) => setSeoDescription(e.target.value)}
                    rows={3}
                    placeholder="Nhập mô tả SEO hấp dẫn (120-160 ký tự)"
                    className="w-full text-[13px] p-2 border border-[#8c8f94] rounded-sm focus:border-[#2271b1] focus:ring-1 focus:ring-[#2271b1] outline-none resize-y"
                  ></textarea>
                  <div className="w-full h-1 bg-[#f0f0f1] mt-1 rounded-full overflow-hidden">
                    <div className={`h-full transition-all ${seoDescription.length >= 120 && seoDescription.length <= 160 ? "bg-green-500" : (seoDescription.length > 160 ? "bg-red-500" : "bg-orange-500")}`} style={{ width: `${Math.min(100, (seoDescription.length / 160) * 100)}%` }}></div>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="w-full lg:w-[280px] space-y-5">
            {/* Publish Box */}
            <div className="bg-white border border-[#c3c4c7] rounded-sm">
              <div className="px-3 py-2 border-b border-[#c3c4c7] font-semibold text-[14px] text-[#1d2327]">Đăng</div>
              <div className="p-3 space-y-3 text-[13px] text-[#3c434a]">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Trạng thái:</span>
                  <select 
                    value={status} 
                    onChange={(e) => setStatus(e.target.value)}
                    className="border border-[#8c8f94] rounded-sm px-1 py-0.5"
                  >
                    <option value="publish">Đã xuất bản</option>
                    <option value="draft">Bản nháp</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Đăng ngày:</span>
                  <input 
                    type="date" 
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="border border-[#8c8f94] rounded-sm px-1 py-0.5 w-[130px]"
                  />
                </div>
              </div>
              <div className="bg-[#f6f7f7] p-3 border-t border-[#c3c4c7] flex justify-between items-center">
                <button type="button" onClick={closeEditor} className="text-[13px] text-[#b32d2e] hover:underline">Vào thùng rác</button>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="bg-[#2271b1] text-white text-[13px] px-3 py-1.5 rounded-sm hover:bg-[#135e96] transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? "Đang lưu..." : "Cập nhật"}
                </button>
              </div>
            </div>

            {/* Categories Box */}
            <div className="bg-white border border-[#c3c4c7] rounded-sm">
              <div className="px-3 py-2 border-b border-[#c3c4c7] font-semibold text-[14px] text-[#1d2327]">Chuyên mục</div>
              <div className="p-3 text-[13px]">
                <div className="space-y-2 max-h-[150px] overflow-y-auto mb-3 p-1 border border-[#c3c4c7] rounded-sm bg-[#fcfcfc]">
                  {["Chuyện Nhà", "Không Gian", "Cà Phê", "Chưa phân loại"].map(cat => (
                    <label key={cat} className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="radio" 
                        name="category"
                        value={cat}
                        checked={category === cat}
                        onChange={(e) => setCategory(e.target.value)}
                        className="text-[#2271b1] focus:ring-[#2271b1]"
                      />
                      {cat}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Featured Image Box */}
            <div className="bg-white border border-[#c3c4c7] rounded-sm">
              <div className="px-3 py-2 border-b border-[#c3c4c7] font-semibold text-[14px] text-[#1d2327]">Ảnh đại diện</div>
              <div className="p-3 text-[13px] space-y-3">
                <div className="flex gap-2">
                  <label className="cursor-pointer"><input type="radio" checked={imageMode === 'url'} onChange={() => setImageMode('url')} /> URL</label>
                  <label className="cursor-pointer"><input type="radio" checked={imageMode === 'upload'} onChange={() => setImageMode('upload')} /> Tải lên</label>
                </div>
                
                {imageMode === "url" ? (
                  <input 
                    type="url" 
                    value={coverImage || ""}
                    onChange={(e) => setCoverImage(e.target.value)}
                    placeholder="https://..."
                    className="w-full border border-[#8c8f94] rounded-sm px-2 py-1"
                  />
                ) : (
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setCoverImageFile(e.target.files[0]);
                      }
                    }}
                    className="w-full text-xs"
                  />
                )}
                
                {(coverImage || coverImageFile) && (
                  <div className="mt-2 text-center text-[#2271b1] hover:underline cursor-pointer">
                    Ảnh đã được đặt
                  </div>
                )}
              </div>
            </div>

          </div>
        </form>
      </div>
    );
  }

  // Table View
  return (
    <div className="max-w-full animate-in fade-in duration-300 -mt-2">
      
      {/* Admin Notices */}
      <div className="mb-4">
        {showWelcomeNotice && (
          <div className="bg-white border-l-4 border-l-[#46b450] border border-[#c3c4c7] p-3 rounded-sm shadow-sm flex items-center justify-between mb-4">
            <p className="text-[13px] text-[#3c434a]">Chào mừng đến với hệ thống quản trị của <strong>Cẩm Cù House</strong>. Chúng tôi đã thiết lập sẵn các công cụ SEO cần thiết.</p>
            <button onClick={() => setShowWelcomeNotice(false)} className="text-[#a7aaad] hover:text-[#d63638]"><X size={16}/></button>
          </div>
        )}
        
        <div className="bg-white border-l-4 border-l-[#72aee6] border border-[#c3c4c7] p-3 rounded-sm shadow-sm flex items-center justify-between mb-4">
          <p className="text-[13px] text-[#3c434a]">
            <strong>Nâng cao điểm hiệu suất của trang web của bạn</strong> bằng cách cấu hình cache.
          </p>
          <div className="flex gap-2">
             <button className="bg-[#2271b1] text-white px-3 py-1 text-[13px] rounded-sm shadow-sm hover:bg-[#135e96]">Hãy thử nó</button>
             <button className="bg-[#f6f7f7] border border-[#8c8f94] text-[#3c434a] px-3 py-1 text-[13px] rounded-sm shadow-sm hover:bg-white">Tìm hiểu thêm</button>
          </div>
        </div>
        
        {showRankMathNotice && (
          <div className="bg-white border-l-4 border-l-[#ffb900] border border-[#c3c4c7] p-3 rounded-sm shadow-sm flex items-center justify-between mb-4">
            <p className="text-[13px] text-[#3c434a]">
              <strong>Rank Math</strong> đã phát hiện nội dung mới cần được index. Hãy chắc chắn rằng bạn đã tối ưu hóa từ khóa chính.
            </p>
            <button onClick={() => setShowRankMathNotice(false)} className="text-[#a7aaad] hover:text-[#d63638]"><X size={16}/></button>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 mb-2">
        <h1 className="text-[23px] font-normal text-[#1d2327]">Bài viết</h1>
        <button 
          onClick={() => openEditor()}
          className="text-[13px] border border-[#2271b1] text-[#2271b1] px-3 py-1 rounded hover:bg-[#f0f0f1] transition-colors"
        >
          Thêm Bài Viết
        </button>
      </div>

      {/* Sub header links */}
      <div className="text-[13px] mb-4 text-[#3c434a]">
        <button onClick={() => setStatusFilter('all')} className={statusFilter === 'all' ? "text-[#1d2327] font-semibold" : "text-[#2271b1] hover:text-[#0a4b78]"}>
          Tất cả <span className="text-[#a7aaad]">({counts.all})</span>
        </button>
        <span className="text-[#a7aaad] mx-1">|</span>
        <button onClick={() => setStatusFilter('publish')} className={statusFilter === 'publish' ? "text-[#1d2327] font-semibold" : "text-[#2271b1] hover:text-[#0a4b78]"}>
          Đã xuất bản <span className="text-[#a7aaad]">({counts.publish})</span>
        </button>
        <span className="text-[#a7aaad] mx-1">|</span>
        <button onClick={() => setStatusFilter('draft')} className={statusFilter === 'draft' ? "text-[#1d2327] font-semibold" : "text-[#2271b1] hover:text-[#0a4b78]"}>
          Bản nháp <span className="text-[#a7aaad]">({counts.draft})</span>
        </button>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2 gap-2 text-[13px]">
        {/* Bulk Actions & Filters */}
        <div className="flex flex-wrap items-center gap-1.5">
          <select 
            value={bulkAction} 
            onChange={(e) => setBulkAction(e.target.value)}
            className="border border-[#8c8f94] rounded-sm px-2 py-1 bg-white text-[#3c434a] focus:border-[#2271b1] outline-none h-[30px]"
          >
            <option value="">Hành động hàng loạt</option>
            <option value="delete">Bỏ vào thùng rác</option>
          </select>
          <button onClick={handleBulkAction} className="border border-[#2271b1] text-[#2271b1] px-3 py-1 rounded-sm bg-[#f6f7f7] hover:bg-[#f0f0f1] h-[30px]">Áp dụng</button>

          <select className="border border-[#8c8f94] rounded-sm px-2 py-1 bg-white text-[#3c434a] focus:border-[#2271b1] outline-none h-[30px] ml-1">
            <option value="all">Tất cả các ngày</option>
            <option value="today">Tháng này</option>
          </select>

          <select 
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="border border-[#8c8f94] rounded-sm px-2 py-1 bg-white text-[#3c434a] focus:border-[#2271b1] outline-none h-[30px]"
          >
            <option value="all">Tất cả chuyên mục</option>
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>

          <select className="border border-[#8c8f94] rounded-sm px-2 py-1 bg-white text-[#3c434a] focus:border-[#2271b1] outline-none h-[30px]">
            <option value="all">Tất cả SEO Score</option>
            <option value="good">Tốt</option>
            <option value="bad">Cần cải thiện</option>
          </select>
          <button className="border border-[#8c8f94] text-[#3c434a] px-3 py-1 rounded-sm bg-[#f6f7f7] hover:bg-[#f0f0f1] h-[30px]">Lọc</button>
        </div>

        {/* Search */}
        <div className="flex items-center gap-1 w-full md:w-auto">
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border border-[#8c8f94] rounded-sm px-2 py-1 bg-white focus:border-[#2271b1] outline-none w-full md:w-[180px] h-[30px]"
          />
          <button className="border border-[#8c8f94] text-[#3c434a] px-3 py-1 rounded-sm bg-[#f6f7f7] hover:bg-[#f0f0f1] h-[30px] whitespace-nowrap">Tìm các bài viết</button>
        </div>
      </div>

      {/* WP Data Table */}
      <div className="bg-white border border-[#c3c4c7] rounded-sm shadow-sm overflow-x-auto">
        <table className="w-full text-left text-[13px] border-collapse min-w-[800px]">
          <thead>
            <tr className="border-b border-[#c3c4c7] bg-[#fcfcfc] text-[#1d2327]">
              <th className="w-10 px-3 py-2 text-center">
                <input 
                  type="checkbox" 
                  checked={selectedIds.length > 0 && selectedIds.length === filteredPosts.length}
                  onChange={toggleSelectAll}
                  className="border-[#8c8f94] rounded-sm"
                />
              </th>
              <th className="px-3 py-2 font-semibold">Tiêu đề</th>
              <th className="px-3 py-2 font-semibold w-24">Tác giả</th>
              <th className="px-3 py-2 font-semibold w-32">Chuyên mục</th>
              <th className="px-3 py-2 font-semibold w-32">Thẻ</th>
              <th className="px-3 py-2 font-semibold w-12 text-center" title="Bình luận"><MessageCircle size={16} className="inline"/></th>
              <th className="px-3 py-2 font-semibold w-36 text-center">Thời gian</th>
              <th className="px-3 py-2 font-semibold w-32 text-center">Chi tiết SEO</th>
            </tr>
          </thead>
          
          <tbody className="divide-y divide-[#c3c4c7]">
            {isLoading ? (
              <tr><td colSpan={8} className="py-10 text-center"><Loader2 className="animate-spin inline text-[#2271b1]" size={24} /></td></tr>
            ) : filteredPosts.length === 0 ? (
              <tr><td colSpan={8} className="py-6 text-center text-[#3c434a]">Không tìm thấy bài viết nào.</td></tr>
            ) : (
              filteredPosts.map((post, index) => {
                const seoScore = (post.seoTitle?.length || 0) > 40 && (post.seoDescription?.length || 0) > 100 && post.seoKeyword ? "good" : ((post.seoTitle?.length || 0) > 20 ? "ok" : "bad");

                return (
                  <tr key={post.id} className={`group ${index % 2 !== 0 ? 'bg-[#f9f9f9]' : 'bg-white'} hover:bg-[#fcfcfc] transition-colors`}>
                    <td className="px-3 py-3 text-center align-top">
                      <input 
                        type="checkbox" 
                        checked={selectedIds.includes(post.id)}
                        onChange={() => toggleSelect(post.id)}
                        className="border-[#8c8f94] rounded-sm mt-1"
                      />
                    </td>
                    <td className="px-3 py-3 align-top">
                      <div className="font-semibold text-[#2271b1] text-[14px] hover:text-[#0a4b78] cursor-pointer mb-1" onClick={() => openEditor(post)}>
                        {post.title}
                        {post.status === 'draft' && <span className="text-[#3c434a] font-normal ml-2">— Bản nháp</span>}
                      </div>
                      <div className="text-[12px] opacity-0 group-hover:opacity-100 transition-opacity flex gap-2 text-[#a7aaad]">
                        <span className="text-[#2271b1] cursor-pointer hover:underline" onClick={() => openEditor(post)}>Chỉnh sửa</span>
                        <span>|</span>
                        <span className="text-[#2271b1] cursor-pointer hover:underline">Sửa nhanh</span>
                        <span>|</span>
                        <span className="text-[#b32d2e] cursor-pointer hover:underline" onClick={() => handleDelete(post.id)}>Xóa</span>
                        <span>|</span>
                        <Link href={`/posts/${post.id}`} target="_blank" className="text-[#2271b1] cursor-pointer hover:underline">Xem</Link>
                      </div>
                    </td>
                    <td className="px-3 py-3 align-top text-[#2271b1] hover:underline cursor-pointer">{post.author}</td>
                    <td className="px-3 py-3 align-top text-[#2271b1] hover:underline cursor-pointer">{post.category}</td>
                    <td className="px-3 py-3 align-top text-[#3c434a]">Cà phê, View suối</td>
                    <td className="px-3 py-3 align-top text-center text-[#2271b1] font-semibold"><div className="bg-[#f0f0f1] rounded-full inline-block px-2 text-[11px] group-hover:bg-[#2271b1] group-hover:text-white transition-colors">0</div></td>
                    <td className="px-3 py-3 align-top text-[#3c434a] text-center">
                      <span className="font-medium">{post.status === 'publish' ? "Đã xuất bản" : "Chỉnh sửa lần cuối"}</span><br/>
                      {new Date(post.date).toLocaleDateString('vi-VN', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '/')}
                    </td>
                    <td className="px-3 py-3 align-top text-center">
                      <div className="flex flex-col items-center justify-center gap-1">
                        {seoScore === "good" ? (
                          <div className="w-14 h-5 rounded bg-[#46b450] text-white font-bold text-[11px] flex items-center justify-center">85/100</div>
                        ) : seoScore === "ok" ? (
                          <div className="w-14 h-5 rounded bg-[#ffb900] text-white font-bold text-[11px] flex items-center justify-center">55/100</div>
                        ) : (
                          <div className="w-14 h-5 rounded bg-[#d63638] text-white font-bold text-[11px] flex items-center justify-center">N/A</div>
                        )}
                        <span className="text-[10px] text-[#2271b1] font-semibold border border-[#2271b1] rounded-sm px-1 leading-none py-0.5">BlogPosting</span>
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
          
          <tfoot>
            <tr className="border-t border-[#c3c4c7] bg-[#fcfcfc] text-[#1d2327]">
              <th className="w-10 px-3 py-2 text-center">
                <input 
                  type="checkbox" 
                  checked={selectedIds.length > 0 && selectedIds.length === filteredPosts.length}
                  onChange={toggleSelectAll}
                  className="border-[#8c8f94] rounded-sm"
                />
              </th>
              <th className="px-3 py-2 font-semibold">Tiêu đề</th>
              <th className="px-3 py-2 font-semibold">Tác giả</th>
              <th className="px-3 py-2 font-semibold">Chuyên mục</th>
              <th className="px-3 py-2 font-semibold">Thẻ</th>
              <th className="px-3 py-2 font-semibold text-center" title="Bình luận"><MessageCircle size={16} className="inline"/></th>
              <th className="px-3 py-2 font-semibold text-center">Thời gian</th>
              <th className="px-3 py-2 font-semibold text-center">Chi tiết SEO</th>
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="flex justify-between items-center mt-3 text-[13px] text-[#3c434a]">
        <div className="flex gap-1.5">
          <select 
            value={bulkAction} 
            onChange={(e) => setBulkAction(e.target.value)}
            className="border border-[#8c8f94] rounded-sm px-2 py-1 bg-white focus:border-[#2271b1] outline-none h-[30px]"
          >
            <option value="">Hành động hàng loạt</option>
            <option value="delete">Bỏ vào thùng rác</option>
          </select>
          <button onClick={handleBulkAction} className="border border-[#2271b1] text-[#2271b1] px-3 py-1 rounded-sm bg-[#f6f7f7] hover:bg-[#f0f0f1] h-[30px]">Áp dụng</button>
        </div>
        <div>
          {filteredPosts.length} mục
        </div>
      </div>
      
      {/* WP Footer */}
      <div className="mt-8 pt-4 flex justify-between items-center text-[12px] text-[#646970]">
        <p className="italic">Cảm ơn bạn đã khởi tạo với WordPress.</p>
        <p>Phiên bản 7.1</p>
      </div>
    </div>
  );
}
