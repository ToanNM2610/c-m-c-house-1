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

export default function SpacePage() {
  const { t } = useLanguage();
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);
  const { images, isLoading } = useGallery();

  // Basic map for loaded images
  const dynamicPhotos = useMemo<SpacePhoto[]>(() => {
    return images.map((img, i) => ({
      id: `img-${i}`,
      category: "all" as SpaceCategory,
      titleVi: img.caption || "Không gian Cẩm Cù",
      titleEn: "Space",
      src: img.url,
      aspectRatio: "wide" as const,
    })) as unknown as SpacePhoto[];
  }, [images]);

  const displayPhotos = dynamicPhotos.length > 0 ? dynamicPhotos : [
    { id: '1', category: 'all' as SpaceCategory, titleVi: 'Bờ Suối', titleEn: 'Stream', src: '/uploads/gallery/1788250253551-943009233.jpg', aspectRatio: "wide" as const },
    { id: '2', category: 'all' as SpaceCategory, titleVi: 'Hiên Gỗ', titleEn: 'Wooden Veranda', src: '/uploads/gallery/1788250253554-875120458.jpg', aspectRatio: "wide" as const },
    { id: '3', category: 'all' as SpaceCategory, titleVi: 'Góc Tĩnh Lặng', titleEn: 'Peaceful Nook', src: '/uploads/gallery/1788250253557-29323827.jpg', aspectRatio: "wide" as const },
    { id: '4', category: 'all' as SpaceCategory, titleVi: 'Lối Nhỏ', titleEn: 'Small Path', src: '/uploads/gallery/1788250253560-200373033.jpg', aspectRatio: "wide" as const },
    { id: '5', category: 'all' as SpaceCategory, titleVi: 'Sương Mai', titleEn: 'Morning Dew', src: '/uploads/gallery/1788250253562-580915883.jpg', aspectRatio: "wide" as const },
  ];

  return (
    <div className="w-full min-h-screen text-[#FDFBF7] relative z-10 pointer-events-none">
      
      <section className="pt-40 pb-20 px-6 text-center">
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

      {/* Masonry Asymmetric Layout */}
      <section className="px-6 sm:px-12 pb-40 max-w-[1600px] mx-auto pointer-events-auto">
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
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
        </div>
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
