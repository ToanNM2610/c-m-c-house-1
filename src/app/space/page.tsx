"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LightboxModal, { LightboxPhoto } from "@/components/LightboxModal";
import { SPACE_ITEMS, SPACE_CATEGORIES, SpaceItem } from "@/data/space";
import {
  getSharedData,
  KEYS,
  SharedGalleryItem,
} from "@/lib/syncStore";
import {
  Droplets,
  Trees,
  Volume2,
  VolumeX,
  Play,
  Pause,
  PhoneCall,
  Navigation,
  CheckCircle2,
  Sparkles,
  Maximize2,
  MapPin,
  Clock
} from "lucide-react";

export default function SpacePage() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [galleryPhotos, setGalleryPhotos] = useState<SharedGalleryItem[]>([]);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

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
        return "Bờ Suối Tự Nhiên";
      case "wooden-terrace":
      case "hien-go":
        return "Hiên Gỗ & Chòi Mộc";
      case "checkin":
      case "check-in":
        return "Góc Check-in & Cảnh Quan";
      case "workspace":
      case "chill-work":
        return "Bàn Ghế Làm Việc / Đọc Sách";
      default:
        return "Không Gian Quán";
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
      title: g.title || "Góc Không Gian Cẩm Cù House",
      subtitle: getCategorySubtitle(g.category),
      description:
        (g as { caption?: string }).caption ||
        "Khoảnh khắc mộc mạc bên dòng suối Đắk Nông được cập nhật mới nhất từ ban quản lý.",
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
    <div className="bg-[#F9F8F3] dark:bg-[#121A15] min-h-screen text-[#1B281D] dark:text-[#F5F4EE] transition-colors duration-300">
      <Navbar />

      <main className="pt-24 sm:pt-28">
        {/* Top Narrative Intro */}
        <section className="relative w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pt-6 sm:pt-10 pb-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-stone-100 dark:bg-[#1E2B22] text-[#3E5C46] dark:text-[#88B795] text-xs tracking-wider uppercase mb-3 shadow-sm border border-stone-200/70 dark:border-stone-700/60">
                <Droplets className="w-3.5 h-3.5 text-[#396663] dark:text-[#88B795]" />
                <span>Space &amp; Stream Sanctuary • Gia Nghĩa</span>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#3E5C46] dark:text-[#F5F4EE] font-bold tracking-tight leading-tight">
                Không Gian Sinh Thái <span className="text-[#614633] dark:text-[#E8A87C] italic font-normal">•</span> Sự Tĩnh Lặng Bên Bờ Suối Đá
              </h1>
              <p className="mt-3 text-base sm:text-lg text-stone-700 dark:text-stone-300 max-w-2xl leading-relaxed">
                Mỗi mét vuông tại Cẩm Cù House được gìn giữ trọn vẹn nét mộc mạc nguyên sơ. Lắng nghe tiếng nước róc rách và thong thả tìm lại an yên giữa đại ngàn Đắk Nông.
              </p>
            </div>

            {/* Quick Atmosphere Metrics */}
            <div className="flex items-center gap-4 bg-white/90 dark:bg-[#1E2B22] backdrop-blur-sm border border-stone-200/70 dark:border-stone-700/60 px-5 py-3 rounded-2xl shadow-sm self-start lg:self-end">
              <div className="flex flex-col">
                <span className="text-[11px] text-stone-500 dark:text-stone-400 uppercase tracking-wider font-semibold">
                  Nhiệt Độ Thung Lũng
                </span>
                <span className="font-serif text-xl font-bold text-[#3E5C46] dark:text-[#88B795]">
                  22°C - 26°C
                </span>
              </div>
              <div className="w-px h-8 bg-stone-200 dark:bg-stone-700" />
              <div className="flex flex-col">
                <span className="text-[11px] text-stone-500 dark:text-stone-400 uppercase tracking-wider font-semibold">
                  Bờ Suối Tự Nhiên
                </span>
                <span className="font-serif text-xl font-bold text-[#396663] dark:text-[#E8A87C]">
                  Đá Bazan Cổ
                </span>
              </div>
            </div>
          </div>

          {/* Filter Tabs - Responsive with Horizontal Scrollbar Hidden on Mobile/Tablet */}
          <div className="w-full flex items-center justify-between gap-4 pb-4 border-b border-stone-200/70 dark:border-stone-800">
            <div className="flex items-center gap-2 p-1.5 bg-stone-100 dark:bg-[#1E2B22] rounded-2xl sm:rounded-full border border-stone-200/70 dark:border-stone-700/60 overflow-x-auto no-scrollbar w-full sm:w-auto">
              {SPACE_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveFilter(cat.id)}
                  type="button"
                  className={`min-h-[44px] px-5 py-2.5 rounded-xl sm:rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-300 shrink-0 ${
                    activeFilter === cat.id
                      ? "bg-[#3E5C46] dark:bg-[#2D4233] text-white shadow-sm font-bold"
                      : "text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white hover:bg-stone-200/60 dark:hover:bg-white/10"
                  }`}
                >
                  {cat.id === "all" ? `Tất Cả Không Gian (${allItems.length})` : cat.name}
                </button>
              ))}
            </div>

            <div className="hidden lg:flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400 font-medium shrink-0">
              <span className="w-2 h-2 rounded-full bg-[#396663] dark:bg-[#88B795] animate-pulse" />
              <span>Bấm vào bất kỳ ảnh nào để phóng to xem Lightbox</span>
            </div>
          </div>
        </section>

        {/* Responsive Multi-Device Gallery Grid (Desktop 3-4 cols, Tablet 2 cols, Mobile 1-2 cols) */}
        <section className="w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-20">
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 items-start"
          >
            <AnimatePresence>
              {filteredItems.map((item, index) => (
                <motion.article
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  key={item.id}
                  onClick={() => handleOpenLightbox(index)}
                  className="group relative cursor-pointer flex flex-col bg-white dark:bg-[#1E2B22] rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-stone-200/70 dark:border-stone-700/60 transition-all duration-300 hover:-translate-y-1"
                >
                  {/* Photo Frame (Standardized 4:3 Aspect Ratio) */}
                  <div className="relative w-full aspect-[4/3] overflow-hidden bg-stone-100 dark:bg-stone-800">
                    <img
                      src={item.image}
                      alt={item.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950/85 via-stone-950/30 to-transparent opacity-90 group-hover:opacity-95 transition-opacity" />

                    {/* Tag badge */}
                    <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 dark:bg-black/70 backdrop-blur-md text-[#3E5C46] dark:text-emerald-300 text-[11px] font-bold shadow-sm border border-white/60 dark:border-white/10">
                      <Sparkles className="w-3 h-3 text-[#614633] dark:text-amber-400" />
                      <span>{item.tag}</span>
                    </div>

                    {/* Expand indicator icon */}
                    <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 text-white/80 group-hover:text-white group-hover:bg-[#3E5C46] flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 shadow-md">
                      <Maximize2 className="w-3.5 h-3.5" />
                    </div>

                    {/* Content overlay */}
                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300 block mb-0.5">
                        {item.subtitle}
                      </span>
                      <h3 className="font-serif text-base sm:text-lg font-bold leading-snug line-clamp-1 group-hover:text-emerald-200 transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-[11px] text-stone-200/90 mt-1 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
          </motion.div>
        </section>

        {/* Sensory Audio Guide */}
        <section className="w-full bg-stone-100/70 dark:bg-[#18241D] border-y border-stone-200 dark:border-stone-800 py-14 sm:py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden transition-colors">
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-10">
            <div className="max-w-xl">
              <span className="text-xs uppercase tracking-widest text-[#396663] dark:text-[#88B795] font-bold">
                Cảm Nhận Giác Quan
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#3E5C46] dark:text-[#F5F4EE] font-bold mt-1">
                Dành Cho Tâm Hồn Cần Chốn Chữa Lành
              </h2>
              <p className="text-base text-stone-700 dark:text-stone-300 mt-3 leading-relaxed">
                Không ồn ào còi xe, không ánh đèn nhân tạo chói lóa. Ở Cẩm Cù House, thanh âm chủ đạo là tiếng suối reo trên đá bazan, tiếng chim hót trên ngọn sầu riêng cổ và tiếng xào xạc của gió luồn qua rặng tre ngà.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                <div className="bg-white/90 dark:bg-[#1E2B22] backdrop-blur-sm shadow-sm rounded-2xl p-5 border border-stone-200/60 dark:border-stone-700/60 flex items-start gap-3">
                  <Droplets className="w-6 h-6 text-[#396663] dark:text-[#88B795] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-[#1B281D] dark:text-white">Tiếng Nước Tự Nhiên</h4>
                    <p className="text-xs text-stone-600 dark:text-stone-400 mt-1">Âm thanh trắng làm dịu sóng não căng thẳng.</p>
                  </div>
                </div>
                <div className="bg-white/90 dark:bg-[#1E2B22] backdrop-blur-sm shadow-sm rounded-2xl p-5 border border-stone-200/60 dark:border-stone-700/60 flex items-start gap-3">
                  <Trees className="w-6 h-6 text-[#614633] dark:text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-[#1B281D] dark:text-white">Hương Rừng &amp; Hoa Cù</h4>
                    <p className="text-xs text-stone-600 dark:text-stone-400 mt-1">Mùi thơm thảo mộc tự nhiên ngát lành trong gió.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Audio Stream Player Simulator Card */}
            <div className="w-full lg:w-96 bg-white/90 dark:bg-[#1E2B22] backdrop-blur-sm shadow-xl rounded-2xl p-6 border border-stone-200/60 dark:border-stone-700/60 flex flex-col items-center text-center relative">
              <div className="w-20 h-20 rounded-full bg-[#396663]/15 dark:bg-[#88B795]/15 text-[#396663] dark:text-[#88B795] flex items-center justify-center mb-4 shadow-sm relative">
                {isPlayingAudio ? (
                  <Volume2 className="w-9 h-9 text-[#396663] dark:text-[#88B795] animate-pulse" />
                ) : (
                  <VolumeX className="w-9 h-9 text-[#396663] dark:text-[#88B795]" />
                )}
                {isPlayingAudio && (
                  <span className="absolute inset-0 rounded-full border-2 border-[#396663] dark:border-[#88B795] animate-ping opacity-30" />
                )}
              </div>
              <span className="text-xs text-stone-500 dark:text-stone-400 uppercase tracking-wider font-semibold">
                Thanh Âm Thực Địa
              </span>
              <h3 className="font-serif text-xl font-bold text-[#3E5C46] dark:text-[#F5F4EE] mt-1">
                Tiếng Suối Đá Gia Nghĩa
              </h3>
              <p className="text-xs text-stone-600 dark:text-stone-300 mt-2 mb-6">
                {isPlayingAudio
                  ? "Đang phát mô phỏng: Tiếng suối róc rách qua ghềnh đá bazan tự nhiên..."
                  : "Bấm để nghe đoạn âm thanh thực tế bên bờ suối Cẩm Cù House lúc ban mai."}
              </p>
              <button
                type="button"
                onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                className={`w-full min-h-[44px] py-3.5 px-6 rounded-full font-semibold text-xs transition-all flex items-center justify-center gap-2 shadow-md ${
                  isPlayingAudio
                    ? "bg-[#396663] text-white"
                    : "bg-[#3E5C46] text-white hover:bg-[#2D4233]"
                }`}
              >
                {isPlayingAudio ? (
                  <>
                    <Pause className="w-4 h-4" />
                    <span>Tạm Dừng Thanh Âm Suối</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current" />
                    <span>Nghe Tiếng Suối Chảy</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </section>

        {/* Eco Charter Section */}
        <section className="w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-16">
          <div className="bg-white/90 dark:bg-[#1E2B22] backdrop-blur-sm shadow-sm rounded-2xl p-6 sm:p-10 border border-stone-200/60 dark:border-stone-700/60 relative overflow-hidden">
            <div className="relative z-10 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#3E5C46]/10 dark:bg-[#88B795]/15 text-[#3E5C46] dark:text-[#88B795] text-xs font-bold mb-3">
                <Trees className="w-4 h-4 text-[#3E5C46] dark:text-[#88B795]" />
                <span>Lời Hứa Xanh Từ Cẩm Cù House</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#3E5C46] dark:text-[#F5F4EE] font-bold tracking-tight">
                Bảo Tồn Dòng Nước Suối Bazan Tự Nhiên &amp; Giảm Thiểu Nhựa
              </h2>
              <p className="mt-3 text-base text-stone-700 dark:text-stone-300 leading-relaxed">
                Chúng tôi trân trọng từng viên sỏi, từng ngọn cỏ ven dòng suối. Cẩm Cù House cam kết 100% không xả thải trực tiếp vào dòng chảy, sử dụng ống hút sậy tự nhiên, cốc thủy tinh tái sử dụng và thường xuyên cùng du khách dọn sạch rác dọc hai bên bờ suối.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 p-4 rounded-2xl bg-stone-50 dark:bg-[#16231A] border border-stone-200 dark:border-stone-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#396663]/15 flex items-center justify-center text-[#396663] dark:text-[#88B795] shrink-0">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#1B281D] dark:text-white">Không Nhựa 1 Lần</p>
                    <p className="text-[11px] text-stone-600 dark:text-stone-400">100% vật liệu tự nhiên</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#3E5C46]/15 flex items-center justify-center text-[#3E5C46] dark:text-emerald-400 shrink-0">
                    <Droplets className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#1B281D] dark:text-white">Bảo Vệ Nguồn Nước</p>
                    <p className="text-[11px] text-stone-600 dark:text-stone-400">Lọc thải khép kín an toàn</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-600/15 flex items-center justify-center text-amber-800 dark:text-amber-300 shrink-0">
                    <Trees className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#1B281D] dark:text-white">Hệ Sinh Thái Rừng</p>
                    <p className="text-[11px] text-stone-600 dark:text-stone-400">Gìn giữ thảm thực vật bản địa</p>
                  </div>
                </div>
              </div>

              {/* Action Callouts */}
              <div className="mt-8 flex flex-wrap items-center gap-3.5">
                <a
                  href="https://maps.google.com/?q=Hem+437+Hung+Vuong+Nghia+Trung+Gia+Nghia+Dak+Nong"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 min-h-[44px] px-6 py-3.5 rounded-full bg-[#3E5C46] text-white text-xs sm:text-sm font-semibold hover:bg-[#2D4233] transition-colors shadow-sm"
                >
                  <span>Chỉ Đường Tới Quán</span>
                  <Navigation className="w-4 h-4" />
                </a>
                <a
                  href="tel:0382851688"
                  className="inline-flex items-center justify-center gap-2 min-h-[44px] px-6 py-3.5 rounded-full bg-stone-100 dark:bg-[#1E2B22] text-[#3E5C46] dark:text-[#88B795] hover:bg-stone-200 dark:hover:bg-[#28392E] transition-colors text-xs sm:text-sm font-semibold border border-stone-200 dark:border-stone-700/60"
                >
                  <PhoneCall className="w-4 h-4 text-[#3E5C46] dark:text-[#88B795]" />
                  <span>Gọi Hotline: 038 285 1688</span>
                </a>
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
