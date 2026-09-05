"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGallery, GalleryImage } from "@/hooks/useGallery";
import { useLanguage } from "@/context/LanguageContext";
import BlurText from "@/components/ui/BlurText";

const Space3DScene = dynamic(() => import("@/components/3d/Space3DScene"), {
  ssr: false,
  loading: () => null,
});

// Bộ ảnh chất lượng cao mặc định cho không gian Cẩm Cù House
const DEFAULT_GALLERY: GalleryImage[] = [
  { id: "g-1", url: "/uploads/gallery/1788269970861-16527830.jpg", caption: "Không gian vườn sinh thái Cẩm Cù" },
  { id: "g-2", url: "/uploads/gallery/1788250253551-943009233.jpg", caption: "Bờ suối đá thanh bình" },
  { id: "g-3", url: "/uploads/gallery/1788250253554-875120458.jpg", caption: "Hiên nhà đón nắng sớm" },
  { id: "g-4", url: "/uploads/gallery/1788250253557-29323827.jpg", caption: "Góc cà phê mộc mạc" },
  { id: "g-5", url: "/uploads/gallery/1788250253560-200373033.jpg", caption: "Bàn gỗ bên tán cây râm mát" },
  { id: "g-6", url: "/uploads/gallery/1788250253562-580915883.jpg", caption: "Dòng suối chảy qua lòng thung lũng" },
  { id: "g-7", url: "/uploads/gallery/1788250253564-115851131.jpg", caption: "Hoàng hôn buông xuống Cẩm Cù House" },
  { id: "g-8", url: "/uploads/gallery/1788250253566-618481408.jpg", caption: "Góc tĩnh lặng giữa thiên nhiên" },
  { id: "g-9", url: "/uploads/gallery/1788250253568-69250175.jpg", caption: "Lối mòn đá cuội qua đồi chè" },
  { id: "g-10", url: "/uploads/gallery/1788250253570-358232239.jpg", caption: "Ánh ban mai soi bóng nước" },
  { id: "g-11", url: "/uploads/gallery/1788250253572-915114239.jpg", caption: "Bàn trà chiều bên sườn đồi" },
  { id: "g-12", url: "/uploads/gallery/1788250253574-977351820.jpg", caption: "Nét mộc trầm mặc của gỗ xưa" },
  { id: "g-13", url: "/uploads/gallery/1788250253576-148814823.jpg", caption: "Sương sớm giăng lối về Cẩm Cù" },
  { id: "g-14", url: "/uploads/gallery/1788250253578-396525469.jpg", caption: "Đêm trăng thanh khiết thung lũng" },
];

export default function GalleryPage() {
  const { t } = useLanguage();
  const [isMounted, setIsMounted] = useState(false);
  const { images } = useGallery();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Lắng nghe phím ESC để đóng Modal phóng to nhanh
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedImage(null);
      }
    };

    if (selectedImage) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [selectedImage]);

  // Nguồn ảnh tổng hợp: dùng ảnh từ API hoặc bộ ảnh mặc định
  const pool = images.length >= 8 ? images : DEFAULT_GALLERY;

  // Chia ảnh thành 2 hàng xen kẽ
  const row1Items = pool.filter((_, idx) => idx % 2 === 0);
  const row2Items = pool.filter((_, idx) => idx % 2 !== 0);

  // Nhân đôi mỗi hàng để tạo chu kỳ marquee lặp vô tận (Infinite loop)
  const fullRow1 = [...row1Items, ...row1Items];
  const fullRow2 = [...row2Items, ...row2Items];

  return (
    <main className="relative min-h-screen bg-[#1A0F0A] text-[#F4EFEA] z-10 pt-32 pb-32 font-sans overflow-x-hidden">
      {/* 3D WebGL Background: Hạt đom đóm & gió rừng chìm dưới nền */}
      <Space3DScene />

      {/* Header & Tiêu đề trang */}
      <div className="text-center mb-10 sm:mb-14 max-w-3xl mx-auto px-4 relative z-20">
        <span className="text-[#C5A880] uppercase tracking-[0.25em] text-xs sm:text-sm mb-3 block font-sans">
          {t("space.subtitle") || "KHÔNG GIAN NGHỈ DƯỠNG & CÀ PHÊ"}
        </span>
        <BlurText 
          text="Khoảnh Khắc Cẩm Cù"
          as="h1"
          className="text-4xl md:text-5xl lg:text-6xl font-serif text-[#F4EFEA] mb-4 tracking-tight"
        />
        <p className="text-sm sm:text-base text-[#F4EFEA]/75 font-light leading-relaxed max-w-xl mx-auto">
          {t("space.desc") || "Những lát cắt an yên bên hiên nhà gỗ, dòng suối đá và hương cà phê mộc mạc giữa thung lũng."}
        </p>
        <div className="w-20 h-[1px] bg-gradient-to-r from-transparent via-[#C5A880]/60 to-transparent mx-auto mt-6"></div>
      </div>

      {/* DẢI ẢNH LƯỢN SÓNG 2 HÀNG (WAVE MARQUEE CAROUSEL) */}
      {isMounted && (
        <div className="relative z-20 flex flex-col gap-6 sm:gap-8 w-full overflow-hidden">
          
          {/* Lớp bóng mờ dần ở 2 mép màn hình (Vignette Fade) */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-32 bg-gradient-to-r from-[#1A0F0A] via-[#1A0F0A]/70 to-transparent z-30" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-32 bg-gradient-to-l from-[#1A0F0A] via-[#1A0F0A]/70 to-transparent z-30" />

          {/* HÀNG 1: Trôi sang trái (Marquee Left) */}
          <div className="w-full overflow-hidden py-5 select-none">
            <motion.div
              animate={{ x: ["0%", "-50%"] }}
              transition={{
                repeat: Infinity,
                repeatType: "loop",
                duration: 38,
                ease: "linear",
              }}
              className="flex gap-6 sm:gap-8 w-max items-center"
            >
              {fullRow1.map((img, idx) => (
                <motion.div
                  key={`r1-${img.id || idx}-${idx}`}
                  animate={{ y: [0, -16, 0, 16, 0] }}
                  transition={{
                    repeat: Infinity,
                    duration: 4,
                    ease: "easeInOut",
                    delay: (idx % row1Items.length) * 0.3,
                  }}
                  onClick={() => setSelectedImage(img.url)}
                  className="w-[280px] h-[380px] md:w-[320px] md:h-[420px] rounded-2xl overflow-hidden flex-shrink-0 cursor-pointer border border-[#C5A880]/20 hover:border-[#C5A880] transition-all duration-300 shadow-2xl relative group bg-[#24140C]"
                >
                  <img
                    src={img.url}
                    alt={img.caption || "Khoảnh Khắc Cẩm Cù"}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                    loading="lazy"
                  />

                  {/* Lớp phủ sang trọng khi hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#100906]/95 via-[#100906]/35 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5 z-10">
                    {img.caption && (
                      <p className="text-sm font-serif text-[#F4EFEA] tracking-wider mb-2 line-clamp-2">
                        {img.caption}
                      </p>
                    )}
                    <div className="flex items-center gap-1.5 text-[11px] font-sans font-medium uppercase tracking-widest text-[#C5A880]">
                      <span>Xem phóng to</span>
                      <span className="text-xs">↗</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* HÀNG 2: Trôi sang phải (Marquee Right) */}
          <div className="w-full overflow-hidden py-5 select-none">
            <motion.div
              animate={{ x: ["-50%", "0%"] }}
              transition={{
                repeat: Infinity,
                repeatType: "loop",
                duration: 42,
                ease: "linear",
              }}
              className="flex gap-6 sm:gap-8 w-max items-center"
            >
              {fullRow2.map((img, idx) => (
                <motion.div
                  key={`r2-${img.id || idx}-${idx}`}
                  animate={{ y: [0, -16, 0, 16, 0] }}
                  transition={{
                    repeat: Infinity,
                    duration: 4,
                    ease: "easeInOut",
                    delay: (idx % row2Items.length) * 0.3,
                  }}
                  onClick={() => setSelectedImage(img.url)}
                  className="w-[280px] h-[380px] md:w-[320px] md:h-[420px] rounded-2xl overflow-hidden flex-shrink-0 cursor-pointer border border-[#C5A880]/20 hover:border-[#C5A880] transition-all duration-300 shadow-2xl relative group bg-[#24140C]"
                >
                  <img
                    src={img.url}
                    alt={img.caption || "Khoảnh Khắc Cẩm Cù"}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                    loading="lazy"
                  />

                  {/* Lớp phủ sang trọng khi hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#100906]/95 via-[#100906]/35 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5 z-10">
                    {img.caption && (
                      <p className="text-sm font-serif text-[#F4EFEA] tracking-wider mb-2 line-clamp-2">
                        {img.caption}
                      </p>
                    )}
                    <div className="flex items-center gap-1.5 text-[11px] font-sans font-medium uppercase tracking-widest text-[#C5A880]">
                      <span>Xem phóng to</span>
                      <span className="text-xs">↗</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

        </div>
      )}

      {/* MODAL XEM ẢNH TOÀN MÀN HÌNH (FULLSCREEN LIGHTBOX & EXIT) */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[99999] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 sm:p-8 select-none"
            onClick={() => setSelectedImage(null)}
          >
            {/* Nút thoát góc trên bên phải (Exit button ✕) */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage(null);
              }}
              className="fixed top-6 right-6 w-12 h-12 rounded-full border border-[#C5A880]/40 flex items-center justify-center text-xl text-[#C5A880] hover:bg-[#C5A880] hover:text-[#1A0F0A] transition-all cursor-pointer shadow-2xl z-[100000]"
              aria-label="Đóng ảnh"
            >
              ✕
            </button>

            {/* Khung ảnh to bung ra từ tâm */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", damping: 26, stiffness: 300 }}
              className="relative max-w-5xl max-h-[88vh] w-auto h-auto overflow-hidden rounded-2xl border border-[#C5A880]/40 shadow-2xl bg-[#1A0F0A]/95 p-2 sm:p-3"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedImage}
                alt="Khoảnh Khắc Cẩm Cù House"
                className="w-auto h-auto max-h-[82vh] max-w-full object-contain mx-auto rounded-xl select-none"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
