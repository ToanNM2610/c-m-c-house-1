"use client";

import React, { useState } from "react";
import Link from "next/link";
import SafeImage from "@/components/ui/SafeImage";
import Footer from "@/components/Footer";
import LightboxModal from "@/components/LightboxModal";
import { SPATIAL_CHAPTERS, SpatialPhotoItem, CAM_CU_HOUSE_INFO } from "@/data/camCuHouseData";
import { useLanguage } from "@/context/LanguageContext";
import { CMS_KEYS } from "@/lib/cmsStore";
import { getStoredData } from "@/utils/storage";
import {
  Compass,
  ArrowRight,
  Maximize2,
  Navigation,
  PhoneCall,
  Clock,
  Sparkles,
  Layers
} from "lucide-react";

export default function StreamSanctuaryPage() {
  const { locale } = useLanguage();
  const isVi = locale !== "en";

  const [customGallery, setCustomGallery] = useState<any[]>(() => {
    return getStoredData<any[]>(CMS_KEYS.GALLERY, []);
  });

  React.useEffect(() => {
    const handleUpdate = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (!detail || detail.key === CMS_KEYS.GALLERY) {
        setCustomGallery(getStoredData<any[]>(CMS_KEYS.GALLERY, []));
      }
    };
    window.addEventListener("camcu_sync_update", handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener("camcu_sync_update", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  // Danh sách phẳng tất cả ảnh (30 ảnh gốc + ảnh quản trị đồng bộ)
  const allPhotos: SpatialPhotoItem[] = React.useMemo(() => {
    const base = SPATIAL_CHAPTERS.flatMap((ch) => ch.photos);
    if (!customGallery || customGallery.length === 0) return base;

    // Map overrides or additions from admin gallery
    const overrideMap = new Map(customGallery.map((g) => [g.id || g.title, g]));
    return base.map((p) => {
      const matched = overrideMap.get(p.id) || overrideMap.get(p.title);
      if (matched) {
        return {
          ...p,
          title: matched.title || p.title,
          image: matched.url || p.image,
          description: matched.caption || p.description,
        };
      }
      return p;
    });
  }, [customGallery]);

  // Bộ lọc theo chương: 0 = Tất cả, 1 = Chương I, 2 = Chương II, 3 = Chương III, 4 = Chương IV
  const [activeChapter, setActiveChapter] = useState<number>(0);

  // Lightbox Modal state
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  const displayedChapters =
    activeChapter === 0
      ? SPATIAL_CHAPTERS
      : SPATIAL_CHAPTERS.filter((ch) => ch.chapter === activeChapter);

  const handleOpenLightbox = (photoId: string) => {
    const idx = allPhotos.findIndex((p) => p.id === photoId);
    if (idx > -1) {
      setCurrentPhotoIndex(idx);
      setLightboxOpen(true);
    }
  };

  // Mảng dữ liệu cho LightboxModal
  const lightboxPhotos = allPhotos.map((p) => ({
    url: p.image,
    title: `${p.figureCode} · ${p.title}`,
    caption: `${p.subtitle} — ${p.description}`,
  }));

  return (
    <div className="bg-[var(--bg-primary)] text-[var(--text-primary)] min-h-screen font-sans selection:bg-[#E86C3A] selection:text-white transition-colors">
      <main className="w-full">
        {/* MASTHEAD BANNER */}
        <section className="relative w-full py-10 sm:py-16 px-4 sm:px-8 border-b border-[var(--border-subtle)] bg-[#0E100F] text-[#F3F1EC]">
          <div className="w-full max-w-[1400px] mx-auto flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs uppercase tracking-widest text-[#E86C3A] font-bold">
                [03] KHÔNG GIAN SUỐI · SPATIAL EXHIBITION
              </span>
              <span className="text-white/40 font-mono text-xs">·</span>
              <span className="text-white/60 font-mono text-xs">
                30 KHUNG ẢNH NGUYÊN BẢN (FIG. 01 — FIG. 30)
              </span>
            </div>

            <h1 className="font-display font-black text-[clamp(32px,5.5vw,68px)] uppercase tracking-tight text-[#F3F1EC] leading-[1.25] sm:leading-snug mb-2">
              {isVi
                ? "TRIỂN LÃM KHÔNG GIAN SINH THÁI BÊN BỜ SUỐI"
                : "CREEKSIDE SPATIAL ARCHITECTURE EXHIBITION"}
            </h1>

            <p className="font-serif italic text-[20px] sm:text-[24px] text-[#E86C3A] max-w-3xl leading-relaxed">
              {isVi
                ? "Hành trình 30 bức ảnh phân bổ qua 4 chương cảm xúc, từ lối nhỏ hẻm 437 đến ánh đèn đêm cuối tuần mở đến 22:00."
                : "An online visual journey across 4 chapters, from the entrance pathway to illuminated weekend nights until 22:00."}
            </p>

            {/* BỘ LỌC ĐÓNG/MỞ THEO TỪNG CHƯƠNG */}
            <div className="pt-6 border-t border-white/10 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveChapter(0)}
                className={`px-4 py-2 rounded-full font-mono text-xs uppercase tracking-wider font-bold transition-all ${
                  activeChapter === 0
                    ? "bg-[#E86C3A] text-white shadow-md"
                    : "bg-white/10 text-white/80 hover:bg-white/20"
                }`}
              >
                TẤT CẢ (30 ẢNH)
              </button>

              {SPATIAL_CHAPTERS.map((ch) => (
                <button
                  key={ch.chapter}
                  type="button"
                  onClick={() => setActiveChapter(ch.chapter)}
                  className={`px-4 py-2 rounded-full font-mono text-xs uppercase tracking-wider font-bold transition-all ${
                    activeChapter === ch.chapter
                      ? "bg-[#E86C3A] text-white shadow-md"
                      : "bg-white/10 text-white/80 hover:bg-white/20"
                  }`}
                >
                  {ch.romanNum}: {ch.titleVi} ({ch.photos.length} ẢNH)
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* CÁC CHƯƠNG TRIỂN LÃM */}
        <section className="w-full max-w-[1400px] mx-auto px-4 sm:px-8 py-16 flex flex-col gap-24">
          {displayedChapters.map((chapter) => (
            <div key={chapter.chapter} className="flex flex-col gap-8">
              {/* Tiêu đề chương */}
              <div className="pb-4 border-b border-[var(--border-subtle)] flex flex-wrap items-end justify-between gap-4">
                <div>
                  <span className="font-mono text-xs text-[#E86C3A] uppercase font-bold tracking-widest block">
                    {chapter.romanNum} · {chapter.rangeLabel}
                  </span>
                  <h2 className="font-display font-black text-[28px] sm:text-[38px] uppercase tracking-tight text-[var(--text-primary)] mt-1">
                    {chapter.titleVi}
                  </h2>
                </div>
                <span className="font-mono text-xs text-[var(--text-secondary)]">
                  {chapter.photos.length} TÁC PHẨM
                </span>
              </div>

              {/* Lưới ảnh bất đối xứng Awwwards - Chú thích nằm BÊN DƯỚI khung ảnh */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 items-start">
                {chapter.photos.map((item, idx) => {
                  let colSpan = "lg:col-span-4";
                  let aspect = "aspect-[4/3]";

                  if (idx % 5 === 0) {
                    colSpan = "lg:col-span-8";
                    aspect = "aspect-[16/10]";
                  } else if (idx % 5 === 3 || idx % 5 === 4) {
                    colSpan = "lg:col-span-6";
                    aspect = "aspect-[16/10]";
                  }

                  return (
                    <figure
                      key={item.id}
                      onClick={() => handleOpenLightbox(item.id)}
                      className={`group flex flex-col gap-3.5 cursor-pointer select-none ${colSpan} transition-transform duration-300 hover:-translate-y-1`}
                    >
                      {/* Khung ảnh độc lập */}
                      <div className={`relative overflow-hidden rounded-xl border border-[var(--border-subtle)] bg-black w-full ${aspect}`}>
                        <SafeImage
                          src={item.image}
                          alt={item.title}
                          fill
                          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                        />
                        {/* Nút Maximize góc trên */}
                        <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Maximize2 className="w-3.5 h-3.5 text-white" />
                        </div>
                      </div>

                      {/* Chú thích nằm BÊN DƯỚI khung ảnh, rõ ràng không đè lên hình */}
                      <figcaption className="flex flex-col gap-1 px-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-mono text-[12px] font-bold text-[#E86C3A] tracking-wider uppercase">
                            [{item.figureCode} · {item.orderNumber}/30]
                          </span>
                          <span className="font-mono text-[11px] text-[var(--text-secondary)]">
                            {item.subtitle}
                          </span>
                        </div>

                        <h3 className="font-sans font-bold text-[16px] sm:text-[17px] text-[var(--text-primary)] leading-snug group-hover:text-[#E86C3A] transition-colors">
                          {item.title}
                        </h3>

                        <p className="text-[13.5px] text-[var(--text-secondary)] leading-relaxed">
                          {item.description}
                        </p>
                      </figcaption>
                    </figure>
                  );
                })}
              </div>
            </div>
          ))}
        </section>

        {/* FOOTER CTA & PORTAL */}
        <section className="w-full bg-[var(--bg-surface)] py-20 border-t border-[var(--border-subtle)]">
          <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-8 flex flex-col items-center text-center gap-6">
            <span className="font-mono text-xs text-[#E86C3A] uppercase font-bold tracking-wider">
              [HÀNH TRÌNH TIẾP NỐI]
            </span>
            <h2 className="font-display font-black text-[32px] sm:text-[44px] uppercase tracking-tight text-[var(--text-primary)]">
              {isVi ? "Thưởng Thức Hương Vị Đậm Đà Bên Bờ Suối" : "Taste Pure Highland Flavors"}
            </h2>
            <p className="text-[16px] text-[var(--text-secondary)] max-w-xl">
              Sau khi dạo bước qua 30 góc không gian suối mát, kính mời quý khách khám phá thực đơn 67 món thanh lành hoặc đặt chỗ trước để có vị trí đẹp nhất.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Link
                href="/thuc-don"
                className="btn-cta-primary px-8 py-4 rounded-full font-bold text-[15px] inline-flex items-center gap-2"
              >
                <span>{isVi ? "Khám Phá Thực Đơn [04]" : "Explore Menu [04]"}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/chi-duong-lien-he"
                className="btn-cta-secondary px-8 py-4 rounded-full font-semibold text-[15px] inline-flex items-center gap-2"
              >
                <Navigation className="w-4 h-4" />
                <span>{isVi ? "Chỉ Đường & Đặt Bàn [05]" : "Directions & Contact [05]"}</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Lightbox Modal */}
      <LightboxModal
        isOpen={lightboxOpen}
        photos={lightboxPhotos}
        initialIndex={currentPhotoIndex}
        onClose={() => setLightboxOpen(false)}
      />

      <Footer />
    </div>
  );
}

