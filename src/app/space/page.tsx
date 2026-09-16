"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import { useGallery } from "@/hooks/useGallery";
import { MaskHeading } from "@/components/motion/ScrollReveal";
import { cinematicTransition, slowCinematicTransition } from "@/components/motion/config";
import { SpacePhoto, SpaceCategory } from "@/data/spaces";

const CATEGORIES = ["Tất cả", "Bờ Suối Đá", "Hiên Gỗ & Chòi", "Vườn Hoa Cẩm Cù", "Góc Tĩnh Lặng"];

export default function SpacePage() {
  const { t } = useLanguage();
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState("Tất cả");
  const { images, isLoading } = useGallery();

  const dynamicPhotos = useMemo<SpacePhoto[]>(() => {
    return images.map((img, i) => {
      // Dummy mapping for demo since real tags are not in images array
      const cat = CATEGORIES[1 + (i % 4)]; 
      return {
        id: `img-${i}`,
        category: cat,
        titleVi: img.caption || cat,
        titleEn: "Space",
        src: img.url,
        aspectRatio: "wide" as const,
      };
    }) as unknown as SpacePhoto[];
  }, [images]);

  const fallbackPhotos = [
    { id: '1', category: 'Bờ Suối Đá', titleVi: 'Bờ Suối', titleEn: 'Stream', src: '/uploads/gallery/1788250253551-943009233.jpg', aspectRatio: "wide" as const },
    { id: '2', category: 'Hiên Gỗ & Chòi', titleVi: 'Hiên Gỗ', titleEn: 'Wooden Veranda', src: '/uploads/gallery/1788250253554-875120458.jpg', aspectRatio: "wide" as const },
    { id: '3', category: 'Góc Tĩnh Lặng', titleVi: 'Góc Tĩnh Lặng', titleEn: 'Peaceful Nook', src: '/uploads/gallery/1788250253557-29323827.jpg', aspectRatio: "wide" as const },
    { id: '4', category: 'Vườn Hoa Cẩm Cù', titleVi: 'Lối Nhỏ', titleEn: 'Small Path', src: '/uploads/gallery/1788250253560-200373033.jpg', aspectRatio: "wide" as const },
    { id: '5', category: 'Bờ Suối Đá', titleVi: 'Sương Mai', titleEn: 'Morning Dew', src: '/uploads/gallery/1788250253562-580915883.jpg', aspectRatio: "wide" as const },
  ];

  const allPhotos = dynamicPhotos.length > 0 ? dynamicPhotos : fallbackPhotos;
  const displayPhotos = activeCategory === "Tất cả" ? allPhotos : allPhotos.filter(p => p.category === activeCategory);

  return (
    <div className="w-full min-h-screen text-[#FDFBF7] relative z-10 pointer-events-none">
      
      <section className="pt-40 pb-12 px-6 text-center">
        <MaskHeading as="h1" duration={1} className="font-serif text-5xl sm:text-7xl lg:text-8xl tracking-widest uppercase text-shadow-md">
          KHÔNG GIAN
        </MaskHeading>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...cinematicTransition, delay: 0.2 }}
          className="mt-6 text-[#FDFBF7]/60 text-sm tracking-widest uppercase font-mono max-w-lg mx-auto"
        >
          Sự tĩnh lặng giữa đại ngàn
        </motion.p>
      </section>

      {/* Utilities Section */}
      <section className="px-6 pb-12 text-center pointer-events-auto">
        <div className="flex flex-wrap justify-center gap-6 md:gap-12 text-[#FDFBF7]/70 font-mono text-xs uppercase tracking-widest">
          <span>Wi-Fi Tốc Độ Cao</span>
          <span className="hidden sm:inline">•</span>
          <span>Ổ Cắm Từng Bàn</span>
          <span className="hidden sm:inline">•</span>
          <span>Bãi Đỗ Xe Ô Tô / Xe Máy</span>
        </div>
      </section>

      {/* Filter Categories */}
      <section className="px-6 pb-12 pointer-events-auto text-center">
        <div className="flex flex-wrap justify-center gap-4">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 font-mono text-xs uppercase tracking-widest border transition-colors ${
                activeCategory === cat ? "border-[#C88A4B] text-[#C88A4B]" : "border-[#FDFBF7]/20 text-[#FDFBF7]/60 hover:border-[#FDFBF7]/60 hover:text-[#FDFBF7]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Masonry Asymmetric Layout */}
      <section className="px-6 sm:px-12 pb-40 max-w-[1600px] mx-auto pointer-events-auto">
        <AnimatePresence mode="wait">
          <motion.div 
            key={activeCategory}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6"
          >
            {displayPhotos.map((photo, i) => (
              <motion.div
                key={photo.id}
                data-cursor="view"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ ...cinematicTransition, delay: (i % 3) * 0.1 }}
                className="relative overflow-hidden break-inside-avoid group cursor-pointer"
                onClick={() => setSelectedPhotoIndex(i)}
              >
                <div className="w-full relative bg-[#1A1D17]">
                  <Image
                    src={photo.src}
                    alt={photo.titleVi}
                    loading="lazy"
                    width={800}
                    height={600}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="w-full h-auto object-cover transition-transform duration-1000 group-hover:scale-[1.03]"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-500"></div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </section>

      {/* Fullscreen Image Viewer Overlay */}
      <AnimatePresence>
        {selectedPhotoIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={snappyTransition}
            className="fixed inset-0 z-50 bg-[#0C0D0B]/95 flex items-center justify-center p-4 sm:p-12 pointer-events-auto"
          >
            <button
              onClick={() => setSelectedPhotoIndex(null)}
              className="absolute top-8 right-8 z-50 p-2 text-[#FDFBF7]/50 hover:text-[#FDFBF7] transition-colors"
            >
              <X size={32} strokeWidth={1} />
            </button>
            <div className="relative w-full max-w-6xl h-full max-h-[80vh] flex flex-col items-center justify-center">
              <Image
                src={displayPhotos[selectedPhotoIndex].src}
                alt="Enlarged space"
                fill
                className="object-contain"
              />
              <p className="mt-4 font-mono text-xs uppercase tracking-widest text-[#FDFBF7]/50">
                {displayPhotos[selectedPhotoIndex].titleVi}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

const snappyTransition = {
  duration: 0.4,
  ease: [0.22, 1, 0.36, 1] as const,
};
