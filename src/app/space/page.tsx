"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Footer from "@/components/Footer";
import LightboxModal from "@/components/LightboxModal";
import ContourLines from "@/components/ui/ContourLines";
import { SPACE_ITEMS, SPACE_CATEGORIES, SpaceItem } from "@/data/space";
import { useLanguage } from "@/context/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  getSharedData,
  KEYS,
  SharedGalleryItem,
} from "@/lib/syncStore";
import {
  Play,
  Pause,
  PhoneCall,
  Navigation,
  CheckCircle2,
  Maximize2,
  Thermometer,
  ShieldCheck,
  Droplets,
  Trees,
} from "lucide-react";

export default function SpacePage() {
  const { locale, dict } = useLanguage();
  const isEn = locale === "en";

  const [activeFilter, setActiveFilter] = useState("all");
  const [isFiltering, setIsFiltering] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [galleryPhotos, setGalleryPhotos] = useState<SharedGalleryItem[]>([]);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Audio wave canvas visualizer
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let phase = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const width = canvas.width;
      const height = canvas.height;
      const bars = 24;
      const barWidth = 3;
      const spacing = (width - bars * barWidth) / (bars - 1);

      for (let i = 0; i < bars; i++) {
        let barHeight = 4;
        if (isPlayingAudio) {
          barHeight = Math.max(4, Math.sin(phase + i * 0.4) * (height / 2.5) + (height / 2.5));
        }
        const x = i * (barWidth + spacing);
        const y = (height - barHeight) / 2;

        ctx.fillStyle = isPlayingAudio ? "#E0764F" : "rgba(244,236,221,0.3)";
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barHeight, 2);
        ctx.fill();
      }

      if (isPlayingAudio) {
        phase += 0.15;
      }
      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlayingAudio]);

  // Audio playback state remembered in localStorage
  useEffect(() => {
    try {
      const savedAudioState = localStorage.getItem("camcu_stream_audio");
      if (savedAudioState === "true") {
        setIsPlayingAudio(true);
      }
    } catch {}
  }, []);

  const toggleAudio = () => {
    const nextState = !isPlayingAudio;
    setIsPlayingAudio(nextState);
    try {
      localStorage.setItem("camcu_stream_audio", String(nextState));
    } catch {}
  };

  const handleFilterChange = (catId: string) => {
    if (catId === activeFilter) return;
    setIsFiltering(true);
    setActiveFilter(catId);
    setTimeout(() => {
      setIsFiltering(false);
    }, 180);
  };

  useEffect(() => {
    // 1. Hydrate shared gallery from storage & cookie
    const stored = getSharedData<SharedGalleryItem[]>(KEYS.GALLERY, []);
    setGalleryPhotos(stored);

    // 2. Real-time synchronization listener across tabs & windows
    const handleSync = (e: Event) => {
      const custom = e as CustomEvent;
      if (custom.detail?.key === KEYS.GALLERY) {
        setGalleryPhotos(custom.detail.value || []);
      }
    };
    const handleStorage = (e: StorageEvent) => {
      if (e.key === KEYS.GALLERY) {
        const next = getSharedData<SharedGalleryItem[]>(KEYS.GALLERY, []);
        setGalleryPhotos(next);
      }
    };

    window.addEventListener("camcu_sync_update", handleSync);
    window.addEventListener("storage", handleStorage);

    // 3. Background server fetch
    fetch("/api/admin/gallery")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && Array.isArray(data.photos) && data.photos.length > 0) {
          const current = getSharedData<SharedGalleryItem[] | null>(KEYS.GALLERY, null);
          if (current === null || current.length === 0) {
            setGalleryPhotos(data.photos);
          }
        }
      })
      .catch(() => {});

    return () => {
      window.removeEventListener("camcu_sync_update", handleSync);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  // Map admin category to space category list
  const mapAdminCategoryToSpace = (cat: string): string[] => {
    switch (cat) {
      case "stream":
      case "suoi":
      case "bo-suoi":
        return ["stream", "bo-suoi"];
      case "wooden-terrace":
      case "hien-go":
        return ["wooden-terrace", "hien-go"];
      case "checkin":
      case "check-in":
        return ["checkin", "check-in"];
      case "workspace":
      case "chill-work":
        return ["workspace", "chill-work"];
      default:
        return [cat];
    }
  };

  const getCategorySubtitle = (cat: string): string => {
    switch (cat) {
      case "stream":
      case "suoi":
      case "bo-suoi":
        return isEn ? "Natural Stream" : "Bờ Suối Tự Nhiên";
      case "wooden-terrace":
      case "hien-go":
        return isEn ? "Wooden Terrace & Pavilions" : "Hiên Gỗ & Chòi Mộc";
      case "checkin":
      case "check-in":
        return isEn ? "Scenic Check-in Spot" : "Góc Check-in & Cảnh Quan";
      case "workspace":
      case "chill-work":
        return isEn ? "Co-working / Reading Nook" : "Bàn Ghế Làm Việc / Đọc Sách";
      default:
        return isEn ? "Sanctuary Corner" : "Không Gian Quán";
    }
  };

  const dynamicItems: SpaceItem[] = galleryPhotos
    .filter((g) => {
      return [
        "stream",
        "suoi",
        "bo-suoi",
        "wooden-terrace",
        "hien-go",
        "checkin",
        "check-in",
        "workspace",
        "chill-work",
        "khong-gian",
        "hero",
      ].includes(g.category);
    })
    .map((g, idx) => ({
      id: g.id || `dyn_${idx}`,
      title: g.title || (isEn ? "Cam Cu House Stream Corner" : "Góc Không Gian Cẩm Cù House"),
      subtitle: getCategorySubtitle(g.category),
      description:
        (g as { caption?: string }).caption ||
        (isEn
          ? "A serene rustic moment by the Dak Nong rock stream."
          : "Khoảnh khắc mộc mạc bên dòng suối Đắk Nông."),
      image: g.url,
      category: mapAdminCategoryToSpace(g.category),
      tag: getCategorySubtitle(g.category),
    }));

  const allDisplayItems =
    dynamicItems.length > 0
      ? [
          ...dynamicItems,
          ...SPACE_ITEMS.filter((item) => !dynamicItems.some((d) => d.image === item.image)),
        ]
      : SPACE_ITEMS;

  const filteredItems =
    activeFilter === "all"
      ? allDisplayItems
      : allDisplayItems.filter((item) => item.category.includes(activeFilter));

  const lightboxPhotos = filteredItems.map((item) => ({
    url: item.image,
    title: item.title,
    caption: item.description,
    category: item.tag,
    subtitle: item.subtitle,
  }));

  const handleOpenLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <div className="bg-[var(--paper)] text-[var(--ink)] min-h-screen selection:bg-[var(--basalt)] selection:text-white transition-colors overflow-x-hidden">
      <main className="overflow-x-hidden">
        {/* =========================================================================
            8.3.1 ĐẦU TRANG (H1 MỘT KHỐI + THẺ THÔNG TIN CHỈ SỐ: 22°C–26°C, ĐÁ BAZAN CỔ)
           ========================================================================= */}
        <section className="relative pt-32 sm:pt-40 pb-12 sm:pb-16 border-b border-[var(--line)] overflow-hidden">
          <ContourLines opacity={0.07} className="text-[var(--ink)]" />

          <div className="container-unified relative z-10">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
              {/* Trái: H1 một khối không ngắt giữa cụm */}
              <div className="max-w-3xl flex flex-col gap-3">
                <span className="font-mono text-xs uppercase tracking-widest text-[var(--stream)] font-bold">
                  {isEn ? "NATURAL ECO SANCTUARY" : "KHÔNG GIAN NGUYÊN BẢN"}
                </span>
                <h1 className="font-serif text-[clamp(34px,5.5vw,68px)] font-bold text-[var(--ink)] tracking-tight leading-[1.08] text-balance">
                  Không Gian Sinh Thái, Bên Bờ Suối Đá
                </h1>
                <p className="text-[16px] sm:text-[18px] text-[var(--ink-muted)] leading-[1.7] max-w-[60ch] mt-1">
                  {dict.space.subtitle}
                </p>
              </div>

              {/* Phải: Thẻ thông tin chỉ số (Section 8.3.1) */}
              <div className="card-accent rounded-[24px] p-5 sm:p-6 flex items-center gap-5 sm:gap-6 border border-[var(--line)] shadow-xs shrink-0 bg-[var(--paper-2)]">
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5 text-[var(--stream)] font-bold font-mono text-xs uppercase tracking-wider mb-1">
                    <Thermometer className="w-3.5 h-3.5" />
                    <span>NHIỆT ĐỘ SUỐI</span>
                  </div>
                  <span className="font-serif text-2xl sm:text-3xl font-bold text-[var(--ink)] leading-none">
                    22°C–26°C
                  </span>
                </div>

                <div className="w-[1px] h-10 bg-[var(--line)]" />

                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5 text-[var(--basalt)] font-bold font-mono text-xs uppercase tracking-wider mb-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>ĐỊA CHẤT</span>
                  </div>
                  <span className="font-serif text-2xl sm:text-3xl font-bold text-[var(--ink)] leading-none">
                    Đá Bazan Cổ
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            8.3.2 THANH LỌC DÍNH (5 CHIP MONO, ĐANG CHỌN: NỀN INK CHỮ PAPER)
           ========================================================================= */}
        <div className="sticky top-16 z-30 w-full bg-[var(--paper)]/95 backdrop-blur-md border-b border-[var(--line)] py-3 transition-colors shadow-xs">
          <div className="container-unified overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-2 sm:gap-3 min-w-max">
              {SPACE_CATEGORIES.map((cat) => {
                const isSelected = activeFilter === cat.id;
                const label =
                  cat.id === "all"
                    ? isEn
                      ? `All (${allDisplayItems.length})`
                      : `Tất Cả (${allDisplayItems.length})`
                    : cat.name;

                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => handleFilterChange(cat.id)}
                    className={`btn-press-sm px-4 py-2 rounded-full font-mono text-[12px] uppercase tracking-wider transition-all duration-200 select-none ${
                      isSelected
                        ? "bg-[var(--ink)] text-[var(--paper)] font-bold shadow-xs scale-102"
                        : "bg-[var(--card)] text-[var(--ink-muted)] hover:text-[var(--ink)] hover:bg-[var(--paper-2)] border border-[var(--line)] font-medium"
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* =========================================================================
            8.3.3 LƯỚI ẢNH BENTO 12 CỘT (HOVER PHÓNG 1.04, GRADIENT ĐÁY ẢNH, FLIP .45S)
           ========================================================================= */}
        <section className="container-unified section-unified min-h-[500px]">
          {isFiltering ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5 w-full">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="lg:col-span-4 rounded-[28px] aspect-[4/3] bg-[var(--paper-2)] animate-pulse border border-[var(--line)]"
                />
              ))}
            </div>
          ) : (
            <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5 w-full items-start">
              <AnimatePresence mode="popLayout">
                {filteredItems.map((item, idx) => {
                  // Bento 12-column pattern: alternate 1x1, 2x1, 1x2, 2x2
                  let colSpan = "lg:col-span-4";
                  let aspect = "aspect-[4/3]";

                  if (idx % 7 === 0) {
                    colSpan = "lg:col-span-8";
                    aspect = "aspect-[16/10]";
                  } else if (idx % 7 === 1) {
                    colSpan = "lg:col-span-4";
                    aspect = "aspect-[4/5]";
                  } else if (idx % 7 === 2) {
                    colSpan = "lg:col-span-4";
                    aspect = "aspect-[4/5]";
                  } else if (idx % 7 === 3) {
                    colSpan = "lg:col-span-4";
                    aspect = "aspect-[4/5]";
                  } else if (idx % 7 === 4) {
                    colSpan = "lg:col-span-4";
                    aspect = "aspect-[4/5]";
                  } else if (idx % 7 === 5) {
                    colSpan = "lg:col-span-6";
                    aspect = "aspect-[16/10]";
                  } else {
                    colSpan = "lg:col-span-6";
                    aspect = "aspect-[16/10]";
                  }

                  return (
                    <motion.div
                      layout
                      key={item.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{
                        duration: 0.45, // FLIP .45s per spec
                        layout: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
                      }}
                      onClick={() => handleOpenLightbox(idx)}
                      className={`group relative cursor-pointer ${colSpan} rounded-[28px] overflow-hidden ${aspect} bg-[var(--paper-2)] border border-[var(--line)] shadow-sm hover:shadow-2xl transition-all duration-500 transform-gpu select-none`}
                    >
                      {/* Ảnh phóng 1.04 khi hover */}
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover transition-transform duration-600 ease-out group-hover:scale-[1.04]"
                      />

                      {/* Lớp gradient tối đáy ảnh */}
                      <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#1C1612]/92 via-[#1C1612]/35 to-transparent flex flex-col justify-end p-5 sm:p-6 text-[#F4ECDD] transition-all">
                        {/* Nhãn danh mục hiện rõ khi hover */}
                        <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-[var(--flower)] mb-1 opacity-90 group-hover:opacity-100 transition-opacity">
                          {item.subtitle}
                        </span>

                        {/* Tên ảnh tối đa 2 dòng */}
                        <h3 className="font-serif text-[17px] sm:text-[20px] font-bold text-[#F4ECDD] leading-snug line-clamp-2 group-hover:text-[var(--flower)] transition-colors">
                          {item.title}
                        </h3>

                        <p className="font-mono text-[11px] text-[#C7BBA8] line-clamp-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          {item.description}
                        </p>
                      </div>

                      {/* Nút phóng to ở góc */}
                      <div className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-black/40 backdrop-blur-md text-white/90 group-hover:bg-[var(--basalt)] group-hover:text-white flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 shadow-md">
                        <Maximize2 className="w-3.5 h-3.5" />
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>
          )}
        </section>

        {/* =========================================================================
            8.3.5 THANH ÂM SUỐI (THANH NỔI DƯỚI MÀN HÌNH, NÚT BAZAN, SÓNG CANVAS)
           ========================================================================= */}
        <section className="container-unified pb-16">
          <div className="rounded-[28px] p-6 sm:p-8 bg-[#1C1612] text-[#F4ECDD] border border-[rgba(244,236,221,0.14)] shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
            <ContourLines opacity={0.08} className="text-[#F4ECDD]" />

            <div className="flex items-center gap-4 relative z-10">
              {/* Nút phát tròn bazan */}
              <button
                type="button"
                onClick={toggleAudio}
                className="w-14 h-14 rounded-full bg-[var(--basalt)] text-white hover:opacity-95 flex items-center justify-center transition-transform hover:scale-105 active:scale-95 shadow-lg shrink-0"
                aria-label={isPlayingAudio ? "Tắt thanh âm suối" : "Bật thanh âm suối"}
              >
                {isPlayingAudio ? (
                  <Pause className="w-5 h-5 fill-current" />
                ) : (
                  <Play className="w-5 h-5 fill-current ml-0.5" />
                )}
              </button>

              <div className="flex flex-col">
                <span className="font-serif text-lg sm:text-xl font-bold text-[#F4ECDD]">
                  {isEn ? "Highland Rock Stream Ambience" : "Thanh Âm Suối Đá · Cao Nguyên"}
                </span>
                <span className="font-mono text-xs text-[#C7BBA8] mt-0.5">
                  {isPlayingAudio
                    ? isEn ? "Playing: Live natural stream echo" : "Đang phát: Tiếng suối reo tự nhiên"
                    : isEn ? "Click to play soothing stream audio" : "Bấm để nghe tiếng suối róc rách thư thái"}
                </span>
              </div>
            </div>

            {/* Sóng âm vẽ bằng Canvas */}
            <div className="relative z-10 flex items-center gap-4">
              <canvas
                ref={canvasRef}
                width={160}
                height={36}
                className="w-[160px] h-[36px]"
              />
              <span className="font-mono text-[11px] text-[var(--flower)] uppercase tracking-wider hidden sm:inline">
                {isPlayingAudio ? "24 BARS LIVE" : "MẶC ĐỊNH TẮT"}
              </span>
            </div>
          </div>
        </section>

        {/* =========================================================================
            8.3.6 BẢO TỒN DÒNG NƯỚC SUỐI (KHỐI NỀN --STREAM TỐI, 3 CAM KẾT, 2 NÚT)
           ========================================================================= */}
        <section className="container-unified section-unified">
          <div className="rounded-[32px] p-8 sm:p-12 lg:p-16 bg-[var(--stream)] text-white border border-[rgba(255,255,255,0.15)] shadow-2xl relative overflow-hidden">
            <div className="relative z-10 max-w-4xl">
              <span className="font-mono text-xs uppercase tracking-widest text-emerald-200 font-bold mb-3 block">
                {isEn ? "ECO PRESERVATION COMMITMENT" : "CAM KẾT BẢO TỒN NGUỒN NƯỚC"}
              </span>

              <h2 className="font-serif text-[clamp(26px,3.8vw,44px)] font-bold text-white tracking-tight leading-tight mb-4 text-balance">
                Bảo Tồn Dòng Nước Suối &amp; Giảm Thiểu Nhựa Một Lần
              </h2>

              <p className="text-[16px] sm:text-[17px] text-emerald-100/90 leading-relaxed max-w-3xl mb-8">
                Chúng tôi trân trọng từng viên sỏi và mạch nước ngầm cao nguyên. Cẩm Cù House cam kết 100% không xả thải hóa chất, sử dụng ống hút thiên nhiên và cùng du khách gìn giữ bờ suối sạch sẽ, an lành.
              </p>

              {/* 3 Cam kết dạng cột có icon nét mảnh */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-white/20 mb-10">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center shrink-0 border border-white/20">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-serif text-[17px] font-bold text-white">
                      Không Nhựa 1 Lần
                    </h4>
                    <p className="font-mono text-xs text-emerald-200 mt-1">
                      100% ống hút sậy &amp; ly sứ
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center shrink-0 border border-white/20">
                    <Droplets className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-serif text-[17px] font-bold text-white">
                      Bảo Vệ Mạch Nước
                    </h4>
                    <p className="font-mono text-xs text-emerald-200 mt-1">
                      Không ngăn đập phá vỡ dòng
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center shrink-0 border border-white/20">
                    <Trees className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-serif text-[17px] font-bold text-white">
                      Đá Bazan Nguyên Vẹn
                    </h4>
                    <p className="font-mono text-xs text-emerald-200 mt-1">
                      Giữ trọn thảm rêu cổ kính
                    </p>
                  </div>
                </div>
              </div>

              {/* 2 Nút */}
              <div className="flex flex-wrap items-center gap-4">
                <a
                  href="tel:0382851688"
                  className="btn-primary min-h-[48px] px-8 text-[15px] font-semibold !bg-[var(--basalt)]"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>Gọi Hotline: 038 285 1688</span>
                </a>

                <a
                  href="https://maps.google.com/?q=Hem+437+Hung+Vuong+Nghia+Trung+Gia+Nghia+Dak+Nong"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary min-h-[48px] px-8 text-[15px] font-semibold !border-white/40 !text-white hover:!bg-white hover:!text-[#1C1612]"
                >
                  <Navigation className="w-4 h-4" />
                  <span>Chỉ đường tới bờ suối</span>
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Lightbox Modal */}
      <LightboxModal
        isOpen={lightboxOpen}
        photos={lightboxPhotos}
        initialIndex={lightboxIndex}
        onClose={() => setLightboxOpen(false)}
      />

      <Footer />
    </div>
  );
}
