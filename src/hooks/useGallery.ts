"use client";

import { useState, useEffect } from "react";

export interface GalleryImage {
  id: string;
  url: string;
  caption: string;
}

const CHANNEL_NAME = "camcu_gallery_sync";

export function useGallery() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchImages = async () => {
    try {
      const res = await fetch("/api/gallery");
      const data = await res.json();
      if (data.images) {
        setImages(data.images);
      }
    } catch (error) {
      console.error("Lỗi fetch API gallery:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();

    // Đồng bộ trạng thái giữa các tab (nếu 1 tab Admin vừa upload/xóa)
    const channel = new BroadcastChannel(CHANNEL_NAME);
    channel.onmessage = (event) => {
      if (event.data === "gallery-updated") {
        fetchImages();
      }
    };

    // Lắng nghe event trên cùng 1 tab (Client)
    const handleLocalUpdate = () => {
      fetchImages();
    };
    window.addEventListener("gallery-storage-update", handleLocalUpdate);

    return () => {
      channel.close();
      window.removeEventListener("gallery-storage-update", handleLocalUpdate);
    };
  }, []);

  // Hàm tải ảnh (Sẽ được gọi trực tiếp trong component page.tsx)
  // Hook chỉ có nhiệm vụ trigger fetch lại ảnh mới.
  const triggerUpdate = () => {
    fetchImages();
    window.dispatchEvent(new Event("gallery-storage-update"));
    const channel = new BroadcastChannel(CHANNEL_NAME);
    channel.postMessage("gallery-updated");
    channel.close();
  };

  return { images, isLoading, triggerUpdate };
}
