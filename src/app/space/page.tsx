"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LightboxModal, { LightboxPhoto } from "@/components/LightboxModal";
import MaskRevealImage from "@/components/motion/MaskRevealImage";
import StaggerText, { StaggerParagraph } from "@/components/motion/StaggerText";
import { SPACE_ITEMS, SPACE_CATEGORIES, SpaceItem } from "@/data/space";
import { useLanguage } from "@/context/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  getSharedData,
  KEYS,
  SharedGalleryItem,
} from "@/lib/syncStore";
import {
  Droplets,
  Trees,
  Play,
  Pause,
  PhoneCall,
  Navigation,
  CheckCircle2,
  Maximize2,
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
      case "hero":
      case "khong-gian":
        return ["stream", "checkin", "wooden-terrace"];
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
          : "Khoảnh khắc mộc mạc bên dòng suối Đắk Nông được cập nhật mới nhất từ ban quản lý."),
      image: g.url,
      category: mapAdminCategoryToSpace(g.category),
      tag: getCategorySubtitle(g.category),
      aspect: "aspect-[4/3]",
    }));

  // Combine dynamic items with default space items, deduplicating by URL
  const allItems: SpaceItem[] = (() => {
    const seen = new Set<string>();
    const list: SpaceItem[] = [];

    dynamicItems.forEach((item) => {
      if (!seen.has(item.image)) {
        seen.add(item.image);
        list.push(item);
      }
    });

    SPACE_ITEMS.forEach((item) => {
      if (!seen.has(item.image)) {
        seen.add(item.image);
        list.push(item);
      }
    });

    return list;
  })();

  const filteredItems = allItems.filter((item) => {
    if (activeFilter === "all") return true;
    return (
      item.category.includes(activeFilter) ||
      (activeFilter === "stream" && item.category.includes("bo-suoi")) ||
      (activeFilter === "wooden-terrace" && item.category.includes("hien-go")) ||
      (activeFilter === "checkin" && item.category.includes("check-in")) ||
      (activeFilter === "workspace" && item.category.includes("chill-work"))
    );
  });

  // Prepare photos for Lightbox Modal
  const lightboxPhotos: LightboxPhoto[] = filteredItems.map((item) => ({
    url: item.image,
    title: item.title,
    caption: item.description,
    subtitle: item.subtitle,
    category: item.tag,
  }));

  const handleOpenLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <div className="bg-[var(--bg)] min-h-screen text-[var(--text)] transition-colors duration-300">
      <main className="pt-24 sm:pt-28">
        {/* Top Narrative Intro */}
        <section className="relative w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pt-6 sm:pt-10 pb-8">
          <div className="animate-fade-up-1 flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
            <div className="max-w-[900px]">
              <div className="badge-unified mb-3">
                <Droplets className="w-3.5 h-3.5 text-[var(--accent-green)]" />
                <span>{dict.space.badge}, Gia Nghĩa</span>
              </div>
              <StaggerText
                as="h1"
                lines={
                  isEn
                    ? ["Eco Sanctuary, Serenity by the Rock Stream"]
                    : ["Không Gian Sinh Thái, Bên Bờ Suối Đá"]
                }
                stagger={0.1}
                className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[var(--text)] font-bold tracking-tight leading-tight max-w-[900px] text-balance"
              />
              <div className="mt-3 max-w-2xl">
                <StaggerParagraph
                  text={
                    isEn
                      ? "Every corner at Cẩm Cù House preserves pristine rustic tranquility. Listen to the gentle stream murmur and discover peaceful serenity in the heart of the Dak Nong highlands."
                      : "Mỗi mét vuông tại Cẩm Cù House được gìn giữ trọn vẹn nét mộc mạc nguyên sơ. Lắng nghe tiếng nước róc rách và thong thả tìm lại an yên giữa đại ngàn Đắk Nông."
                  }
                  className="text-base sm:text-lg text-[var(--text-muted)] leading-relaxed font-medium"
                  delay={0.15}
                />
              </div>
            </div>

            {/* Quick Atmosphere Metrics */}
            <div className="flex items-center gap-4 bg-[var(--surface)] backdrop-blur-sm border border-[var(--border)] px-5 py-3 rounded-2xl shadow-sm self-start lg:self-end">
              <div className="flex flex-col">
                <span className="text-[11px] text-[var(--text-muted)] uppercase tracking-wider font-semibold">
                  {isEn ? "Valley Temp" : "Nhiệt Độ Thung Lũng"}
                </span>
                <span className="font-serif text-xl font-bold text-[var(--text)]">
                  22°C - 26°C
                </span>
              </div>
              <div className="w-px h-8 bg-[var(--border)]" />
              <div className="flex flex-col">
                <span className="text-[11px] text-[var(--text-muted)] uppercase tracking-wider font-semibold">
                  {isEn ? "Natural Stream" : "Bờ Suối Tự Nhiên"}
                </span>
                <span className="font-serif text-xl font-bold text-[var(--accent-clay)]">
                  {isEn ? "Basalt Pebbles" : "Đá Bazan Cổ"}
                </span>
              </div>
            </div>
          </div>

          {/* Filter Tabs - Sticky top-16 sm:top-20 */}
          <div className="sticky top-16 sm:top-20 z-30 w-full bg-[var(--bg)]/95 backdrop-blur-md py-3 border-y border-[var(--border)] shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth w-full sm:w-auto py-1">
                {SPACE_CATEGORIES.map((cat) => {
                  const label = dict.space.categories[cat.id] || cat.name;
                  const isActive = activeFilter === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => handleFilterChange(cat.id)}
                      type="button"
                      className={`btn-press-sm min-h-[44px] px-5 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-200 shrink-0 ${
                        isActive
                          ? "bg-[#CC7755] text-white shadow-sm font-bold"
                          : "bg-[var(--surface)] text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-2)] border border-[var(--border)]"
                      }`}
                    >
                      <span>
                        {cat.id === "all" ? `${label} (${allItems.length})` : label}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="hidden lg:flex items-center gap-2 text-xs text-[var(--text-muted)] font-medium shrink-0">
                <span>
                  {filteredItems.length} {isEn ? "scenic stream spots" : "góc ảnh bờ suối"}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Gallery Grid Section: Card ảnh stagger khi lọc tab (FLIP), tự căn giữa hàng cuối */}
        <section className="animate-fade-up-3 w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-16 min-h-[480px]">
          {isFiltering ? (
            <div className="flex flex-wrap justify-center gap-6 w-full">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] xl:w-[calc(25%-18px)] rounded-[20px] aspect-[4/3] bg-[var(--surface-2)] animate-pulse border border-[var(--border)] p-4 flex flex-col justify-end"
                >
                  <div className="h-3 w-20 bg-white/10 rounded-full mb-2" />
                  <div className="h-4 w-36 bg-white/10 rounded-full" />
                </div>
              ))}
            </div>
          ) : (
            <motion.div layout className="flex flex-wrap justify-center gap-6 w-full">
            <AnimatePresence mode="popLayout">
              {filteredItems.map((item, idx) => (
                <motion.div
                  layout
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.92, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.92 }}
                  transition={{
                    duration: 0.35,
                    delay: Math.min((idx % 8) * 0.04, 0.2),
                    layout: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const },
                  }}
                  whileHover={{ y: -4, scale: 1.02 }}
                  onClick={() => handleOpenLightbox(idx)}
                  className="group relative cursor-pointer rounded-[20px] overflow-hidden aspect-[4/3] bg-[var(--surface)] shadow-sm hover:shadow-2xl border border-[var(--border)] hover:border-[var(--border-hover)] transition-all duration-300 transform-gpu w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] xl:w-[calc(25%-18px)] shrink-0"
                >
                  <MaskRevealImage
                    src={item.image}
                    alt={item.title}
                    aspectRatio="aspect-[4/3]"
                    delay={0.05 * (idx % 6)}
                  />
                  <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-t from-stone-950/95 via-stone-950/70 to-transparent flex flex-col justify-end p-4 text-white transition-opacity duration-300">
                    <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--accent-green)] mb-0.5 transform transition-transform duration-300 group-hover:-translate-y-1">
                      {item.subtitle}
                    </span>
                    <h3 className="font-serif text-[15px] sm:text-[16px] font-bold text-white line-clamp-2 group-hover:text-[var(--accent-clay)] transition-colors transform group-hover:-translate-y-0.5 duration-300 leading-snug drop-shadow-sm">
                      {item.title}
                    </h3>
                    <p className="text-[13px] text-white/90 line-clamp-2 mt-0.5 transition-transform duration-300 group-hover:-translate-y-0.5 font-medium drop-shadow-sm">
                      {item.description}
                    </p>
                  </div>

                  <div className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/50 text-white/80 group-hover:text-white group-hover:bg-[#CC7755] flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 shadow-md">
                    <Maximize2 className="w-4 h-4" />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
          )}
        </section>

        {/* Stream Ambience Floating Audio Bar */}
        <section className="container-unified pb-10">
          <div className="card-unified flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[var(--surface-2)] text-[var(--accent-green)] flex items-center justify-center shrink-0">
                <Droplets className="w-6 h-6 animate-pulse" />
              </div>
              <div className="flex flex-col">
                <span className="font-serif font-bold text-lg text-[var(--text)]">
                  {isEn ? "Highland Stream Natural Audio" : "Thanh Âm Suối Nguồn Cao Nguyên"}
                </span>
                <span className="text-[15px] font-medium text-[var(--text-muted)]">
                  {isEn
                    ? "Recorded live on location beside the basalt rock stream at Cam Cu House, Dak Nong"
                    : "Thu âm trực tiếp bên bờ suối đá Cẩm Cù House, Đắk Nông"}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsPlayingAudio(!isPlayingAudio)}
              className={`btn-primary min-h-[44px] px-7 py-3 rounded-full font-semibold text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2 shadow-md ${
                isPlayingAudio
                  ? "bg-[#CC7755] text-[#1B120E]"
                  : "bg-[#CC7755] text-[#1B120E] hover:bg-[#D98A68]"
              }`}
            >
              {isPlayingAudio ? (
                <>
                  <Pause className="w-4 h-4" />
                  <span>{dict.space.muteAudio}</span>
                  <span className="flex items-center gap-0.5 ml-1">
                    <span className="w-1 h-3 bg-[#1B120E] rounded-full animate-pulse" />
                    <span className="w-1 h-4 bg-[#1B120E] rounded-full animate-pulse delay-75" />
                    <span className="w-1 h-2 bg-[#1B120E] rounded-full animate-pulse delay-150" />
                  </span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>{dict.space.playAudio}</span>
                </>
              )}
            </button>
          </div>
        </section>

        {/* Eco Charter Section (Bảo Tồn Dòng Nước Suối: khối nền --surface-2, 3 cam kết dạng icon + chữ ngang hàng, 2 nút cuối) */}
        <section className="section-unified">
          <div className="container-unified">
            <div className="card-accent relative overflow-hidden">
              <div className="relative z-10 max-w-4xl">
                <div className="badge-unified inline-flex items-center gap-2 mb-4">
                  <Trees className="w-3.5 h-3.5 text-[var(--accent-green)]" />
                  <span>{isEn ? "Eco Commitment from Cẩm Cù House" : "Lời Hứa Xanh Từ Cẩm Cù House"}</span>
                </div>
                <h3 className="font-serif text-[clamp(24px,3.2vw,32px)] text-[var(--text)] font-bold tracking-tight mb-4 leading-tight">
                  {isEn
                    ? "Preserving Natural Basalt Streams & Plastic-Free Living"
                    : "Bảo Tồn Dòng Nước Suối Bazan Tự Nhiên & Giảm Thiểu Nhựa"}
                </h3>
                <p className="text-[15px] sm:text-[16px] font-medium text-[var(--text-muted)] leading-relaxed max-w-[65ch]">
                  {isEn
                    ? "We treasure every pebble and blade of grass along our stream bank. Cẩm Cù House strictly avoids direct discharge into waterways, utilizes natural reed straws, reusable glassware, and regularly organizes stream cleanups."
                    : "Chúng tôi trân trọng từng viên sỏi, từng ngọn cỏ ven dòng suối. Cẩm Cù House cam kết 100% không xả thải trực tiếp vào dòng chảy, sử dụng ống hút sậy tự nhiên, cốc thủy tinh tái sử dụng và thường xuyên cùng du khách dọn sạch rác dọc hai bên bờ suối."}
                </p>

                {/* 3 cam kết dạng icon + chữ ngang hàng */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-[var(--border)]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[var(--surface)] flex items-center justify-center text-[var(--accent-green)] shrink-0 border border-[var(--border)]">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[15px] font-bold text-[var(--text)]">
                        {isEn ? "Single-Use Plastic Free" : "Không Nhựa 1 Lần"}
                      </p>
                      <p className="text-[14px] font-medium text-[var(--text-muted)]">
                        {isEn ? "100% natural materials" : "100% vật liệu tự nhiên"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[var(--surface)] flex items-center justify-center text-[var(--accent-green)] shrink-0 border border-[var(--border)]">
                      <Droplets className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[15px] font-bold text-[var(--text)]">
                        {isEn ? "Water Source Protection" : "Bảo Vệ Nguồn Nước"}
                      </p>
                      <p className="text-[14px] font-medium text-[var(--text-muted)]">
                        {isEn ? "Safe closed-loop filtration" : "Lọc thải khép kín an toàn"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[var(--surface)] flex items-center justify-center text-[#CC7755] shrink-0 border border-[var(--border)]">
                      <Trees className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[15px] font-bold text-[var(--text)]">
                        {isEn ? "Forest Ecosystem" : "Hệ Sinh Thái Rừng"}
                      </p>
                      <p className="text-[14px] font-medium text-[var(--text-muted)]">
                        {isEn ? "Preserving native flora" : "Gìn giữ thảm thực vật bản địa"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* 2 nút cuối */}
                <div className="mt-8 flex flex-wrap items-center gap-3.5">
                  <a
                    href="https://maps.google.com/?q=Hem+437+Hung+Vuong+Nghia+Trung+Gia+Nghia+Dak+Nong"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary min-h-[44px] px-6 text-sm font-bold shadow-md"
                  >
                    <span>{dict.common.getDirections}</span>
                    <Navigation className="w-4 h-4" />
                  </a>
                  <a
                    href="tel:0382851688"
                    className="btn-secondary min-h-[44px] px-6 text-sm font-semibold"
                  >
                    <PhoneCall className="w-4 h-4 text-[#CC7755]" />
                    <span>
                      {isEn ? "Call Hotline: 038 285 1688" : "Gọi Hotline: 038 285 1688"}
                    </span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Lightbox Modal Component */}
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
