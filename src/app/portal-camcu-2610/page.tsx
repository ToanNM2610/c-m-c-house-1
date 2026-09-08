"use client";

import { useState, useEffect } from "react";
import {
  Image as ImageIcon,
  Plus,
  ExternalLink,
  RefreshCw,
  Loader2,
  Eye,
  Coffee
} from "lucide-react";
import Link from "next/link";
import { useMenu } from "@/hooks/useMenu";

interface GalleryImg {
  id: string;
  url: string;
  caption?: string;
}

export default function AdminCleanSanctuaryDashboard() {
  const [gallery, setGallery] = useState<GalleryImg[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { menu, toggleStock, isLoading: isMenuLoading } = useMenu();

  useEffect(() => {
    fetchGalleryData();
  }, []);

  const fetchGalleryData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/gallery").then((r) => r.json()).catch(() => ({ images: [] }));
      setGallery(res.images || []);
    } catch (error) {
      console.error("Lỗi tải hình ảnh:", error);
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
            Chốn lưu giữ khoảnh khắc thiên nhiên, bờ suối đá và hình ảnh bình yên Đắk Nông.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={fetchGalleryData}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs bg-white border border-[#8c8f94] hover:bg-[#f6f7f7] text-[#1d2327] rounded-sm shadow-sm transition-colors cursor-pointer"
          >
            <RefreshCw size={13} className={isLoading ? "animate-spin" : ""} />
            <span>Làm mới</span>
          </button>
          <Link
            href="/portal-camcu-2610/gallery"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs bg-[#2271b1] hover:bg-[#135e96] text-white rounded-sm shadow-sm transition-colors font-medium cursor-pointer"
          >
            <Plus size={13} />
            <span>Tải thêm ảnh mới</span>
          </Link>
          <Link
            href="/space"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs border border-[#8c8f94] text-[#1d2327] hover:bg-[#f6f7f7] rounded-sm transition-colors"
          >
            <ExternalLink size={12} />
            <span>Xem trang Không gian</span>
          </Link>
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs border border-[#8c8f94] text-[#1d2327] hover:bg-[#f6f7f7] rounded-sm transition-colors"
          >
            <ExternalLink size={12} />
            <span>Xem trang chủ</span>
          </Link>
        </div>
      </div>


      {/* 2. KHU VỰC CHÍNH: THƯ VIỆN HÌNH ẢNH KHÔNG GIAN */}
      <div className="bg-white border border-[#c3c4c7] rounded-sm p-4 sm:p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-[16px] font-semibold text-[#1d2327] flex items-center gap-2">
              <ImageIcon size={17} className="text-[#2271b1]" />
              <span>Thư Viện Hình Ảnh Không Gian (Sanctuary Gallery)</span>
            </h2>
            <p className="text-xs text-[#50575e]">
              Bộ sưu tập góc hoa cẩm cù, bờ suối đá và vẻ đẹp mộc mạc tại Gia Nghĩa, Đắk Nông.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/portal-camcu-2610/gallery"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs bg-[#2271b1] hover:bg-[#135e96] text-white rounded-sm transition-colors cursor-pointer"
            >
              <Plus size={13} />
              <span>Tải ảnh lên thư viện</span>
            </Link>
            <Link
              href="/space"
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs border border-[#8c8f94] text-[#1d2327] hover:bg-[#f6f7f7] rounded-sm transition-colors"
            >
              <span>Xem trực tiếp</span>
              <ExternalLink size={12} />
            </Link>
          </div>
        </div>

        {/* Lưới hình ảnh thực tế */}
        {isLoading ? (
          <div className="py-12 text-center text-[#50575e]">
            <Loader2 size={22} className="animate-spin inline mr-2 text-[#2271b1]" />
            Đang tải hình ảnh không gian...
          </div>
        ) : gallery.length === 0 ? (
          <div className="py-10 text-center text-[#50575e] bg-[#fcfcfc] border border-dashed border-[#c3c4c7] rounded-sm text-xs">
            Chưa có hình ảnh nào trong kho lưu trữ. Hãy bấm &quot;Tải thêm ảnh mới&quot; để bổ sung góc ảnh đẹp.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {gallery.map((img, idx) => (
              <div
                key={img.id || idx}
                className="group relative aspect-square rounded-sm overflow-hidden border border-[#c3c4c7] bg-black/10 shadow-sm"
              >
                <img
                  src={img.url}
                  alt={img.caption || "Góc quán Cẩm Cù House"}
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-300"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-2 text-center">
                  <Link
                    href="/portal-camcu-2610/gallery"
                    className="p-2 rounded-full bg-white/95 text-[#1d2327] hover:bg-white shadow mb-1"
                    title="Quản lý thư viện ảnh"
                  >
                    <Eye size={14} />
                  </Link>
                  {img.caption && (
                    <span className="text-[10px] text-white line-clamp-1">
                      {img.caption}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-4 pt-3 border-t border-[#f0f0f1] flex items-center justify-between text-xs">
          <span className="text-[#50575e]">
            Kho lưu trữ hình ảnh góc quán Cẩm Cù House
          </span>
          <Link href="/portal-camcu-2610/gallery" className="text-[#2271b1] hover:underline font-medium">
            Quản lý và sắp xếp toàn bộ ảnh trong thư viện &rarr;
          </Link>
        </div>
      </div>


      {/* 3. KHU VỰC PHỤ: DANH MỤC THỰC ĐƠN MỘC MẠC */}
      <div className="bg-white border border-[#c3c4c7] rounded-sm p-4 sm:p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-[16px] font-semibold text-[#1d2327] flex items-center gap-2">
              <Coffee size={17} className="text-[#2271b1]" />
              <span>Thực Đơn Mộc Mạc (Góc Thức Uống)</span>
            </h2>
            <p className="text-xs text-[#50575e]">
              Danh mục cà phê rang củi Đắk Nông và trà thảo mộc phục vụ tại hiên quán.
            </p>
          </div>

          <Link
            href="/portal-camcu-2610/menu"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs border border-[#8c8f94] text-[#1d2327] hover:bg-[#f6f7f7] rounded-sm transition-colors"
          >
            <span>Quản lý chi tiết thực đơn</span>
            <ExternalLink size={12} />
          </Link>
        </div>

        {/* Lưới các món mộc */}
        <div className="border border-[#c3c4c7] rounded-sm overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse min-w-[550px]">
            <thead>
              <tr className="bg-[#fcfcfc] border-b border-[#c3c4c7] text-[#1d2327]">
                <th className="px-3 py-2 font-semibold">Tên thức uống</th>
                <th className="px-3 py-2 font-semibold">Danh mục</th>
                <th className="px-3 py-2 font-semibold">Giá mộc</th>
                <th className="px-3 py-2 font-semibold text-center w-36">Tình trạng phục vụ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0f0f1]">
              {isMenuLoading ? (
                <tr>
                  <td colSpan={4} className="py-6 text-center text-[#50575e]">
                    Đang tải danh mục món...
                  </td>
                </tr>
              ) : (
                menu.slice(0, 6).map((item, idx) => (
                  <tr
                    key={item.id}
                    className={`hover:bg-[#f9f9f9] transition-colors ${idx % 2 === 0 ? "bg-white" : "bg-[#fcfcfc]"}`}
                  >
                    <td className="px-3 py-2 font-medium text-[#1d2327]">{item.name}</td>
                    <td className="px-3 py-2 text-[#50575e]">
                      <span className="px-2 py-0.5 rounded bg-[#f0f0f1] text-[11px]">
                        {item.category}
                      </span>
                    </td>
                    <td className="px-3 py-2 font-mono text-[#1d2327]">{item.price}</td>
                    <td className="px-3 py-2 text-center">
                      <button
                        onClick={() => toggleStock(item.id)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold transition-colors cursor-pointer ${
                          item.inStock
                            ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                            : "bg-rose-100 text-rose-800 hover:bg-rose-200"
                        }`}
                        title="Bấm để chuyển đổi Còn hàng / Hết hàng"
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${item.inStock ? "bg-emerald-600" : "bg-rose-600"}`}
                        />
                        <span>{item.inStock ? "Còn hàng" : "Hết hàng"}</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

