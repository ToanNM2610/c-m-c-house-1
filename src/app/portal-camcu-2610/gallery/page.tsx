"use client";

import { useState, useEffect, useRef } from "react";
import { Plus, Trash2, Image as ImageIcon, UploadCloud, Loader2 } from "lucide-react";
import { useGallery } from "@/hooks/useGallery";

export default function GalleryManagement() {
  const [isMounted, setIsMounted] = useState(false);
  const { images, isLoading, triggerUpdate } = useGallery();
  
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const processFiles = async (files: FileList | File[]) => {
    if (files.length === 0) return;
    setIsProcessing(true);

    try {
      const validFiles = Array.from(files).filter(file => file.type.startsWith('image/'));
      if (validFiles.length === 0) return;

      const formData = new FormData();
      for (const file of validFiles) {
        formData.append("files", file);
      }

      const response = await fetch("/api/gallery", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Lỗi tải ảnh lên máy chủ");
      }

      // Kích hoạt load lại dữ liệu ở hook
      triggerUpdate();
      
    } catch (error) {
      console.error("Lỗi xử lý ảnh:", error);
      alert("Có lỗi xảy ra khi tải ảnh lên. Vui lòng thử lại!");
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleDeleteImage = async (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (window.confirm("Bạn có chắc chắn muốn xóa ảnh này vĩnh viễn khỏi máy chủ không?")) {
      try {
        const response = await fetch("/api/gallery", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ id })
        });
        
        if (!response.ok) {
          throw new Error("Xóa ảnh thất bại");
        }
        
        // Kích hoạt load lại dữ liệu
        triggerUpdate();
        
      } catch (error) {
        console.error("Lỗi khi xóa ảnh:", error);
        alert("Xóa ảnh thất bại. Vui lòng thử lại.");
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      processFiles(e.target.files);
    }
  };

  if (!isMounted) return null;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Tiêu đề trang */}
      <div>
        <h2 className="text-3xl font-bold text-slate-800">Quản lý Thư viện Ảnh</h2>
        <p className="text-lg text-slate-500 mt-2">Dữ liệu được lưu vĩnh viễn trên máy chủ.</p>
      </div>

      {/* Khu vực Drag & Drop */}
      <div 
        className={`bg-white p-10 rounded-3xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center text-center cursor-pointer min-h-[250px] ${
          isDragging ? "border-stone-800 bg-stone-50 scale-[1.02]" : "border-slate-300 hover:border-stone-500 hover:bg-slate-50"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !isProcessing && fileInputRef.current?.click()}
      >
        <input 
          type="file" 
          multiple 
          accept="image/*" 
          className="hidden" 
          ref={fileInputRef}
          onChange={handleFileSelect}
        />
        
        {isProcessing ? (
          <div className="flex flex-col items-center text-stone-600">
            <Loader2 size={48} className="animate-spin mb-4" />
            <p className="text-lg font-medium">Đang tải ảnh lên máy chủ...</p>
            <p className="text-sm text-stone-500 mt-1">Vui lòng chờ trong giây lát</p>
          </div>
        ) : (
          <>
            <div className={`p-4 rounded-full mb-4 ${isDragging ? "bg-stone-200 text-stone-800" : "bg-slate-100 text-slate-500"}`}>
              <UploadCloud size={48} />
            </div>
            <h3 className="text-xl font-bold text-slate-700 mb-2">Kéo thả ảnh vào đây</h3>
            <p className="text-slate-500 mb-6">hoặc click để chọn nhiều file từ máy tính (Hỗ trợ JPG, PNG, WEBP)</p>
            <button type="button" className="px-6 py-2.5 bg-stone-800 text-white rounded-xl font-medium hover:bg-stone-900 transition-colors shadow-sm">
              Chọn File
            </button>
          </>
        )}
      </div>

      {/* Lưới danh sách ảnh hiện tại */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        <h3 className="text-xl font-bold text-slate-700 mb-6 flex items-center gap-2">
          <ImageIcon className="text-stone-500" size={24} /> Thư viện hiện tại ({images.length} ảnh)
        </h3>
        
        {isLoading ? (
          <div className="text-center py-16 text-slate-500 flex justify-center items-center gap-3">
             <Loader2 className="animate-spin" size={24} /> Đang tải dữ liệu...
          </div>
        ) : images.length === 0 ? (
          <div className="text-center py-16 bg-slate-50 rounded-xl border border-slate-200 text-slate-500">
            <ImageIcon size={48} className="mx-auto mb-4 text-slate-300" />
            <p className="text-lg font-medium">Chưa có ảnh nào được tải lên.</p>
            <p className="text-sm mt-1">Thư viện của Khách sẽ ẩn cho đến khi bạn thêm ảnh mới.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {images.map((img) => (
              <div key={img.id} className="group relative rounded-xl overflow-hidden bg-slate-100 border border-slate-200 aspect-[4/3] shadow-sm">
                <img 
                  src={img.url} 
                  alt={img.caption} 
                  className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                  loading="lazy"
                />
                
                {/* Nút xóa ảnh */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-start items-end p-2 pointer-events-none z-10">
                  <button 
                    type="button"
                    onClick={(e) => handleDeleteImage(e, img.id)}
                    className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors shadow-md pointer-events-auto cursor-pointer"
                    title="Xóa ảnh"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
    </div>
  );
}
