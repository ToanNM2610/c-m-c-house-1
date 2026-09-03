"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useGallery, GalleryImage } from "@/hooks/useGallery";
import { useLanguage } from "@/context/LanguageContext";
import BlurText from "@/components/ui/BlurText";

export default function GalleryPage() {
  const { t } = useLanguage();
  const [isMounted, setIsMounted] = useState(false);
  const { images } = useGallery();
  const [displayImages, setDisplayImages] = useState<GalleryImage[]>([]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Khởi tạo 7 ảnh hiển thị
  useEffect(() => {
    if (images.length === 0) return;
    setDisplayImages(images.slice(0, 7));
  }, [images]);

  return (
    <main className="relative min-h-screen bg-transparent text-[#F4EFEA] z-10 pt-32 pb-24 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <span className="text-[#C5A880] uppercase tracking-[0.25em] text-xs sm:text-sm mb-3 block font-sans">
            {t("space.subtitle")}
          </span>
          <BlurText 
            text={t("space.title")}
            as="h1"
            className="text-4xl md:text-5xl lg:text-6xl font-serif text-[#F4EFEA] mb-6"
          />
          <p className="text-base sm:text-lg text-[#F4EFEA]/75 font-light leading-relaxed">
            {t("space.desc")}
          </p>
          <div className="w-16 h-[1px] bg-[#C5A880]/40 mx-auto mt-8"></div>
        </div>

        {isMounted && (
          <motion.div 
            className="flex flex-col gap-6"
            initial="hidden"
            animate="show"
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: { staggerChildren: 0.06, delayChildren: 0.1 }
              }
            }}
          >
            {/* Hàng trên: 4 ảnh */}
            {displayImages.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                {displayImages.slice(0, 4).map((img, idx) => (
                  <motion.div 
                    key={`top-${img.id}-${idx}`}
                    variants={{
                      hidden: { opacity: 0, scale: 0.85 },
                      show: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }
                    }}
                    className="relative group overflow-hidden rounded-3xl shadow-xl bg-[#24140C] border border-[#C5A880]/25 hover:border-[#C5A880]/70 aspect-[4/3] transition-all duration-300"
                  >
                    <Image 
                      src={img.url} 
                      alt={img.caption || 'Cẩm Cù House'}
                      fill
                      sizes="(max-width: 768px) 50vw, 25vw"
                      quality={80}
                      priority={idx < 2}
                      loading={idx < 2 ? "eager" : "lazy"}
                      className="object-cover transition-transform duration-500 ease-out group-hover:scale-105 opacity-85 group-hover:opacity-100"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#120703]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-none flex items-end p-4">
                      <span className="text-xs text-[#F4EFEA] font-light truncate">{img.caption}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Hàng dưới: 3 ảnh */}
            {displayImages.length > 4 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto w-full">
                {displayImages.slice(4, 7).map((img, idx) => (
                  <motion.div 
                    key={`bottom-${img.id}-${idx}`}
                    variants={{
                      hidden: { opacity: 0, scale: 0.85 },
                      show: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }
                    }}
                    className="relative group overflow-hidden rounded-3xl shadow-xl bg-[#24140C] border border-[#C5A880]/25 hover:border-[#C5A880]/70 aspect-[4/3] md:aspect-video transition-all duration-300"
                  >
                    <Image 
                      src={img.url} 
                      alt={img.caption || 'Cẩm Cù House'}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      quality={80}
                      loading="lazy"
                      className="object-cover transition-transform duration-500 ease-out group-hover:scale-105 opacity-85 group-hover:opacity-100"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#120703]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-none flex items-end p-4">
                      <span className="text-xs text-[#F4EFEA] font-light truncate">{img.caption}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </div>
    </main>
  );
}
