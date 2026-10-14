"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Footer from "@/components/Footer";
import LightboxModal from "@/components/LightboxModal";
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
  Compass,
  LayoutGrid,
  Film,
  ChevronLeft,
  ChevronRight,
  X,
  Droplets,
  Trees
} from "lucide-react";

export default function SpacePage() {
  const { locale, dict } = useLanguage();
  const isEn = locale === "en";

  const [viewMode, setViewMode] = useState<"grid" | "film">("grid");
  const [activeFilter, setActiveFilter] = useState("all");
  const [isFiltering, setIsFiltering] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [galleryPhotos, setGalleryPhotos] = useState<SharedGalleryItem[]>([]);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Film mode index
  const [filmIndex, setFilmIndex] = useState(0);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Audio wave visualizer canvas
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

        ctx.fillStyle = isPlayingAudio ? "#FF6A2B" : "rgba(242,237,228,0.25)";
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

  useEffect(() => {
    try {
      const savedAudioState = localStorage.getItem("camcu_stream_audio");
      if (savedAudioState === "true") {
        setIsPlayingAudio(true);
      }
    } catch {}
  }, []);

  const toggleAudio = () => {
    const next = !isPlayingAudio;
    setIsPlayingAudio(next);
    try {
      localStorage.setItem("camcu_stream_audio", String(next));
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
    const stored = getSharedData<SharedGalleryItem[]>(KEYS.GALLERY, []);
    setGalleryPhotos(stored);

    const handleSync = (e: Event) => {
      const custom = e as CustomEvent;
      if (custom.detail?.key === KEYS.GALLERY) {
        setGalleryPhotos(custom.detail.value || []);
      }
    };
    window.addEventListener("camcu_sync_update", handleSync);
    return () => window.removeEventListener("camcu_sync_update", handleSync);
  }, []);

  // Map items to display
  const allItems: SpaceItem[] = SPACE_ITEMS.map((item) => {
    const custom = galleryPhotos.find((p) => p.id === item.id);
    if (custom) {
      return {
        ...item,
        title: custom.title || item.title,
        image: custom.url || item.image,
      };
    }
    return item;
  });

  const filteredItems = activeFilter === "all"
    ? allItems
    : allItems.filter((i) => Array.isArray(i.category) && i.category.includes(activeFilter));

  const lightboxPhotos = filteredItems.map((item) => ({
    url: item.image,
    title: item.title,
    caption: item.description,
    subtitle: item.subtitle,
    category: Array.isArray(item.category) ? item.category.join(", ") : String(item.category),
  }));

  const handleOpenLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  // Keyboard navigation for Film mode
  useEffect(() => {
    if (viewMode !== "film") return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setViewMode("grid");
      } else if (e.key === "ArrowRight") {
        setFilmIndex((prev) => (prev + 1) % filteredItems.length);
      } else if (e.key === "ArrowLeft") {
        setFilmIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [viewMode, filteredItems.length]);

  return (
    <div className="bg-[var(--bg)] min-h-screen text-[var(--ink)] selection:bg-[var(--ember)] selection:text-[#0A0E0C] transition-colors overflow-x-hidden">
      <main className="overflow-x-hidden">
        {/* =========================================================================
            1. ĐẦU TRANG: H1 KHÔNG GIAN SINH THÁI + CHỈ SỐ (SECTION 8.3.1)
           ========================================================================= */}
        <section className="relative pt-36 sm:pt-44 pb-14 border-b border-[var(--line)] bg-[#0A0E0C] text-[#F2EDE4]">
          <div className="w-full max-w-[1360px] mx-auto px-5 sm:px-10">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
              <div className="max-w-4xl flex flex-col gap-4">
                <div className="inline-flex items-center gap-2 font-mono text-[12px] uppercase tracking-widest text-[var(--ember)]">
                  <Compass className="w-3.5 h-3.5 text-[var(--ember)]" />
                  <span>[03] KHÔNG GIAN SINH THÁI ĐẮK NÔNG · 30 GÓC ẢNH THỰC TẾ</span>
                </div>

                {/* H1 Một khối, không ngắt giữa cụm */}
                <h1 className="font-display font-black text-[clamp(36px,6vw,84px)] uppercase tracking-tight text-[var(--ink)] leading-none text-balance">
                  KHÔNG GIAN SINH THÁI, BÊN BỜ SUỐI ĐÁ
                </h1>

                <p className="text-[16px] sm:text-[18px] text-[var(--ink-muted)] max-w-2xl leading-relaxed">
                  {dict.space.subtitle}
                </p>
              </div>

              {/* Khối chỉ số bên phải: 22°C–26°C · Đá Bazan Cổ (Section 8.3.1) */}
              <div className="flex items-center gap-6 shrink-0 bg-[var(--card)] border border-[var(--line)] clip-chamfer-14 p-5 shadow-xl">
                <div className="flex flex-col">
                  <span className="font-mono text-[11px] uppercase tracking-wider text-[var(--mist)] font-bold">
                    NHIỆT ĐỘ KHÍ HẬU
                  </span>
                  <span className="font-display font-black text-[28px] text-[var(--ember)] leading-none mt-1">
                    22°C – 26°C
                  </span>
                  <span className="font-mono text-[11px] text-[var(--ink-muted)] mt-0.5">
                    Mát mẻ quanh năm
                  </span>
                </div>

                <div className="w-[1px] h-12 bg-[var(--line)]" />

                <div className="flex flex-col">
                  <span className="font-mono text-[11px] uppercase tracking-wider text-[var(--mist)] font-bold">
                    ĐỊA CHẤT TỰ NHIÊN
                  </span>
                  <span className="font-display font-black text-[28px] text-[var(--ink)] leading-none mt-1">
                    ĐÁ BAZAN CỔ
                  </span>
                  <span className="font-mono text-[11px] text-[var(--ink-muted)] mt-0.5">
                    Hàng triệu năm tuổi
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            2. THANH ĐIỀU KHIỂN DÍNH: [LƯỚI] [PHIM] + 5 CHIP LỌC (SECTION 8.3.2)
           ========================================================================= */}
        <section className="sticky top-16 sm:top-20 z-30 w-full bg-[var(--bg)]/95 backdrop-blur-md border-b border-[var(--line)] py-3 px-5 sm:px-10">
          <div className="w-full max-w-[1360px] mx-auto flex flex-wrap items-center justify-between gap-4">
            {/* Chuyển chế độ [LƯỚI] [PHIM] */}
            <div className="flex items-center gap-1 bg-[var(--bg-2)] p-1 border border-[var(--line)] clip-chamfer-14">
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={`flex items-center gap-2 px-3 py-1.5 font-mono text-[12px] font-bold uppercase transition-colors ${
                  viewMode === "grid"
                    ? "bg-[var(--ember)] text-[#0A0E0C]"
                    : "text-[var(--ink-muted)] hover:text-[var(--ink)]"
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>[LƯỚI]</span>
              </button>

              <button
                type="button"
                onClick={() => setViewMode("film")}
                className={`flex items-center gap-2 px-3 py-1.5 font-mono text-[12px] font-bold uppercase transition-colors ${
                  viewMode === "film"
                    ? "bg-[var(--ember)] text-[#0A0E0C]"
                    : "text-[var(--ink-muted)] hover:text-[var(--ink)]"
                }`}
              >
                <Film className="w-3.5 h-3.5" />
                <span>[PHIM]</span>
              </button>
            </div>

            {/* 5 Chip lọc mono */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
              {SPACE_CATEGORIES.map((cat) => {
                const isSelected = activeFilter === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => handleFilterChange(cat.id)}
                    className={`font-mono text-[12px] uppercase tracking-wider px-3.5 py-1.5 rounded-sm border whitespace-nowrap transition-all ${
                      isSelected
                        ? "bg-[var(--ink)] text-[var(--bg)] border-[var(--ink)] font-bold shadow-sm"
                        : "bg-[var(--card)] text-[var(--ink-muted)] border-[var(--line)] hover:border-[var(--ember)] hover:text-[var(--ink)]"
                    }`}
                  >
                    [{isEn && dict.space.categories?.[cat.id] ? dict.space.categories[cat.id] : cat.name}]
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* =========================================================================
            3. NỘI DUNG: CHẾ ĐỘ LƯỚI BENTO HOẶC CHẾ ĐỘ PHIM
           ========================================================================= */}
        {viewMode === "film" ? (
          /* CHẾ ĐỘ PHIM: Trình chiếu toàn màn hình tràn viền (Section 8.3.4) */
          <section className="relative w-full h-[85vh] bg-[#0A0E0C] text-[#F2EDE4] flex items-center justify-center overflow-hidden">
            {filteredItems.length > 0 && (
              <div className="relative w-full h-full">
                <Image
                  src={filteredItems[filmIndex]?.image}
                  alt={filteredItems[filmIndex]?.title}
                  fill
                  priority
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0E0C]/90 via-transparent to-[#0A0E0C]/60" />

                {/* Info Bar ở đáy */}
                <div className="absolute bottom-10 left-6 sm:left-12 right-6 sm:right-12 flex flex-col sm:flex-row sm:items-end justify-between gap-4 z-20">
                  <div className="flex flex-col gap-1 max-w-xl">
                    <span className="font-mono text-[12px] text-[var(--ember)] uppercase tracking-widest font-bold">
                      [{String(filmIndex + 1).padStart(2, "0")}/{String(filteredItems.length).padStart(2, "0")}] · {filteredItems[filmIndex]?.subtitle}
                    </span>
                    <h2 className="font-display font-black text-[28px] sm:text-[40px] uppercase tracking-tight text-white leading-tight">
                      {filteredItems[filmIndex]?.title}
                    </h2>
                    <p className="text-[14px] sm:text-[15px] text-white/80 leading-relaxed">
                      {filteredItems[filmIndex]?.description}
                    </p>
                  </div>

                  {/* Navigation controls */}
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setFilmIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length)}
                      className="p-3 bg-black/60 border border-white/20 hover:border-[var(--ember)] text-white clip-chamfer-14 backdrop-blur-md"
                      aria-label="Ảnh trước"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setFilmIndex((prev) => (prev + 1) % filteredItems.length)}
                      className="p-3 bg-black/60 border border-white/20 hover:border-[var(--ember)] text-white clip-chamfer-14 backdrop-blur-md"
                      aria-label="Ảnh tiếp theo"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setViewMode("grid")}
                      className="p-3 bg-[var(--ember)] text-[#0A0E0C] font-mono text-xs font-bold uppercase clip-chamfer-14"
                      aria-label="Quay lại dạng lưới (Esc)"
                    >
                      THOÁT (ESC)
                    </button>
                  </div>
                </div>
              </div>
            )}
          </section>
        ) : (
          /* CHẾ ĐỘ LƯỚI: Bento 12 Cột với FLIP Filter .45s (Section 8.3.3) */
          <section className="w-full max-w-[1360px] mx-auto px-5 sm:px-10 py-16">
            <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 items-start">
              <AnimatePresence mode="popLayout">
                {filteredItems.map((item, idx) => {
                  let colSpan = "lg:col-span-4";
                  let aspect = "aspect-[4/3]";

                  if (idx % 7 === 0) {
                    colSpan = "lg:col-span-8";
                    aspect = "aspect-[16/10]";
                  } else if (idx % 7 === 5 || idx % 7 === 6) {
                    colSpan = "lg:col-span-6";
                    aspect = "aspect-[16/10]";
                  }

                  return (
                    <motion.figure
                      layout
                      key={item.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.45 }}
                      onClick={() => handleOpenLightbox(idx)}
                      className={`group relative cursor-pointer overflow-hidden clip-chamfer-14 border border-[var(--line)] bg-[var(--card)] ${colSpan} ${aspect} select-none`}
                    >
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                      />

                      {/* Phủ ember 15% khi hover */}
                      <div className="absolute inset-0 bg-[var(--ember)]/0 group-hover:bg-[var(--ember)]/15 transition-colors duration-300" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0E0C]/90 via-[#0A0E0C]/25 to-transparent flex flex-col justify-end p-5 sm:p-6 text-[#F2EDE4]" />

                      {/* Thông tin đáy ảnh */}
                      <div className="absolute bottom-5 left-5 right-5 z-10 flex flex-col text-white">
                        <span className="font-mono text-[11px] text-[var(--ember)] uppercase tracking-wider font-bold mb-1">
                          [{String(idx + 1).padStart(2, "0")}/30] · {item.subtitle}
                        </span>
                        <h3 className="font-bold text-[18px] sm:text-[20px] leading-snug line-clamp-2">
                          {item.title}
                        </h3>
                        <p className="font-mono text-[11px] text-white/70 line-clamp-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {item.description}
                        </p>
                      </div>

                      {/* Nút Maximize */}
                      <div className="absolute top-4 right-4 z-20 w-8 h-8 bg-black/40 border border-white/20 text-white rounded-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Maximize2 className="w-3.5 h-3.5" />
                      </div>
                    </motion.figure>
                  );
                })}
              </AnimatePresence>
            </motion.div>
          </section>
        )}

        {/* =========================================================================
            4. THANH ÂM SUỐI: NÚT EMBER + SÓNG CANVAS (SECTION 8.3.5)
           ========================================================================= */}
        <section className="w-full max-w-[1360px] mx-auto px-5 sm:px-10 pb-20">
          <div className="p-6 sm:p-8 bg-[var(--card)] border border-[var(--line)] clip-chamfer-14 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
            <div className="flex items-center gap-5">
              <button
                type="button"
                onClick={toggleAudio}
                className="w-14 h-14 bg-[var(--ember)] text-[#0A0E0C] hover:opacity-90 flex items-center justify-center clip-chamfer-14 transition-transform active:scale-95 shadow-lg shrink-0"
                aria-label={isPlayingAudio ? "Tắt thanh âm suối" : "Bật thanh âm suối"}
              >
                {isPlayingAudio ? (
                  <Pause className="w-5 h-5 fill-current" />
                ) : (
                  <Play className="w-5 h-5 fill-current ml-0.5" />
                )}
              </button>

              <div className="flex flex-col">
                <span className="font-display font-extrabold text-[20px] uppercase text-[var(--ink)]">
                  {isEn ? "Highland Rock Stream Ambience" : "Thanh Âm Suối Đá · Cao Nguyên"}
                </span>
                <span className="font-mono text-xs text-[var(--ink-muted)] mt-0.5">
                  {isPlayingAudio
                    ? isEn ? "Playing: Live natural stream babble" : "Đang phát: Tiếng suối reo tự nhiên"
                    : isEn ? "Click to play soothing stream audio" : "Bấm để nghe tiếng suối róc rách thư thái"}
                </span>
              </div>
            </div>

            {/* Sóng âm canvas */}
            <div className="flex items-center gap-4">
              <canvas
                ref={canvasRef}
                width={160}
                height={36}
                className="w-[160px] h-[36px]"
              />
              <span className="font-mono text-[11px] text-[var(--ember)] font-bold uppercase tracking-wider hidden sm:inline">
                {isPlayingAudio ? "24 BARS LIVE" : "MẶC ĐỊNH TẮT"}
              </span>
            </div>
          </div>
        </section>

        {/* =========================================================================
            5. BẢO TỒN DÒNG NƯỚC SUỐI: KHỐI --PINE (SECTION 8.3.6)
           ========================================================================= */}
        <section className="w-full max-w-[1360px] mx-auto px-5 sm:px-10 pb-28">
          <div className="p-8 sm:p-14 bg-[var(--pine)] text-[#F2EDE4] border border-[var(--line)] clip-chamfer-14 shadow-2xl">
            <span className="font-mono text-[12px] uppercase tracking-widest text-[var(--mist)] font-bold mb-3 block">
              [CAM KẾT BẢO TỒN NGUỒN NƯỚC SUỐI ĐẮK NÔNG]
            </span>

            <h2 className="font-display font-black text-[clamp(28px,4.5vw,52px)] uppercase tracking-tight text-white leading-tight mb-4 text-balance">
              Gìn Giữ Mạch Nước Trong Lành &amp; Không Nhựa Một Lần
            </h2>

            <p className="text-[16px] text-white/80 leading-relaxed max-w-3xl mb-8">
              Chúng tôi trân trọng từng viên sỏi và mạch nước ngầm cao nguyên. Cẩm Cù House cam kết 100% không xả thải hóa chất, sử dụng ống hút thiên nhiên và cùng du khách gìn giữ bờ suối sạch sẽ, an lành.
            </p>

            {/* 3 Cam kết dạng cột kẻ lưới */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-white/20 mb-10">
              <div className="flex flex-col gap-2">
                <span className="font-mono text-[11px] text-[var(--ember)] font-bold">[CAM KẾT 01]</span>
                <h4 className="font-bold text-[18px] text-white">Không Nhựa Một Lần</h4>
                <p className="font-mono text-xs text-white/70">100% ống hút sậy &amp; ly sứ mộc</p>
              </div>

              <div className="flex flex-col gap-2">
                <span className="font-mono text-[11px] text-[var(--ember)] font-bold">[CAM KẾT 02]</span>
                <h4 className="font-bold text-[18px] text-white">Bảo Vệ Mạch Nước</h4>
                <p className="font-mono text-xs text-white/70">Không ngăn đập phá vỡ dòng chảy tự nhiên</p>
              </div>

              <div className="flex flex-col gap-2">
                <span className="font-mono text-[11px] text-[var(--ember)] font-bold">[CAM KẾT 03]</span>
                <h4 className="font-bold text-[18px] text-white">Đá Bazan Nguyên Vẹn</h4>
                <p className="font-mono text-xs text-white/70">Giữ trọn vẹn thảm rêu xanh cổ kính</p>
              </div>
            </div>

            {/* 2 Nút */}
            <div className="flex flex-wrap items-center gap-4">
              <a
                href="tel:0382851688"
                className="px-8 py-4 bg-[var(--ember)] text-[#0A0E0C] font-mono text-[13px] font-bold uppercase tracking-wider clip-chamfer-14 hover:opacity-90 transition-opacity"
              >
                GỌI HOTLINE: 038 285 1688
              </a>

              <a
                href="https://maps.google.com/?q=Hem+437+Hung+Vuong+Nghia+Trung+Gia+Nghia+Dak+Nong"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 bg-transparent border border-white text-white font-mono text-[13px] font-bold uppercase tracking-wider clip-chamfer-14 hover:bg-white hover:text-[var(--pine)] transition-all"
              >
                CHỈ ĐƯỜNG TỚI BỜ SUỐI
              </a>
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
