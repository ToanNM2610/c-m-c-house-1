"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
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
  Sparkles
} from "lucide-react";

export default function SpacePage() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [galleryPhotos, setGalleryPhotos] = useState<SharedGalleryItem[]>([]);

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
      colSpan: idx % 3 === 0 ? "lg:col-span-6" : "lg:col-span-3",
      aspect: idx % 3 === 0 ? "aspect-[4/3] md:aspect-[16/10]" : "aspect-[3/4]",
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

  return (
    <div className="bg-[#F9F8F3] min-h-screen text-[#1B281D]">
      <Navbar />

      <main className="pt-20">
        {/* Top Narrative Intro */}
        <section className="relative w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pt-8 sm:pt-14 pb-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-stone-100 text-[#3E5C46] text-xs tracking-wider uppercase mb-3 shadow-sm border border-stone-200/70">
                <Droplets className="w-3.5 h-3.5 text-[#396663]" />
                <span>Space &amp; Stream Sanctuary • Gia Nghĩa</span>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#3E5C46] font-bold tracking-tight leading-tight">
                Không Gian Sinh Thái <span className="text-[#614633] italic font-normal">•</span> Sự Tĩnh Lặng Bên Bờ Suối Đá
              </h1>
              <p className="mt-3 text-base sm:text-lg text-stone-700 max-w-2xl leading-relaxed">
                Mỗi mét vuông tại Cẩm Cù House được gìn giữ trọn vẹn nét mộc mạc nguyên sơ. Lắng nghe tiếng nước róc rách và thong thả tìm lại an yên giữa đại ngàn Đắk Nông.
              </p>
            </div>

            {/* Quick Atmosphere Metrics */}
            <div className="flex items-center gap-4 bg-white/90 backdrop-blur-sm border border-stone-200/70 px-5 py-3 rounded-2xl shadow-sm self-start lg:self-end">
              <div className="flex flex-col">
                <span className="text-[11px] text-stone-500 uppercase tracking-wider font-semibold">
                  Nhiệt Độ Thung Lũng
                </span>
                <span className="font-serif text-xl font-bold text-[#3E5C46]">
                  22°C - 26°C
                </span>
              </div>
              <div className="w-px h-8 bg-stone-200" />
              <div className="flex flex-col">
                <span className="text-[11px] text-stone-500 uppercase tracking-wider font-semibold">
                  Độ Che Phủ Tự Nhiên
                </span>
                <span className="font-serif text-xl font-bold text-[#396663]">
                  85% Tán Cây
                </span>
              </div>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="w-full flex items-center justify-between gap-4 flex-wrap pb-4 border-b border-stone-200/70">
            <div className="inline-flex flex-wrap items-center gap-2 p-1 bg-stone-100 rounded-full border border-stone-200/70">
              {SPACE_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveFilter(cat.id)}
                  type="button"
                  className={`px-4 py-2 rounded-full text-xs font-semibold transition-all duration-300 ${
                    activeFilter === cat.id
                      ? "bg-[#3E5C46] text-white shadow-sm"
                      : "text-stone-600 hover:text-stone-900 hover:bg-stone-200/60"
                  }`}
                >
                  {cat.id === "all" ? `Tất Cả Không Gian (${allItems.length})` : cat.name}
                </button>
              ))}
            </div>

            <div className="hidden md:flex items-center gap-2 text-xs text-stone-500 font-medium">
              <span className="w-2 h-2 rounded-full bg-[#396663] animate-pulse" />
              <span>Chạm vào ảnh để khám phá chi tiết góc ngồi</span>
            </div>
          </div>
        </section>

        {/* Editorial Masonry Gallery Grid */}
        <section className="w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-20">
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 items-start">
            <AnimatePresence>
              {filteredItems.map((item) => (
                <motion.article
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                  key={item.id}
                  className={`gallery-item ${item.colSpan || "lg:col-span-4"} flex flex-col group relative bg-white/90 backdrop-blur-sm rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-stone-200/60 transition-all duration-500`}
                >
                  <div className={`relative w-full ${item.aspect || "aspect-[3/4]"} overflow-hidden`}>
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950/85 via-stone-950/30 to-transparent" />

                    {/* Tag badge */}
                    <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-[#3E5C46] text-xs font-bold shadow-sm border border-white/60">
                      <Sparkles className="w-3.5 h-3.5 text-[#614633]" />
                      <span>{item.tag}</span>
                    </div>

                    {/* Content overlay */}
                    <div className="absolute bottom-5 left-5 right-5 text-white">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-200 mb-1 block">
                        {item.subtitle}
                      </span>
                      <h3 className="font-serif text-lg sm:text-xl font-bold leading-snug">
                        {item.title}
                      </h3>
                      <p className="text-xs text-white/80 mt-1 line-clamp-2">
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
        <section className="w-full bg-stone-100/70 border-y border-stone-200 py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-10">
            <div className="max-w-xl">
              <span className="text-xs uppercase tracking-widest text-[#396663] font-bold">
                Cảm Nhận Giác Quan
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#3E5C46] font-bold mt-1">
                Dành Cho Tâm Hồn Cần Chốn Chữa Lành
              </h2>
              <p className="text-base text-stone-700 mt-3 leading-relaxed">
                Không ồn ào còi xe, không ánh đèn nhân tạo chói lóa. Ở Cẩm Cù House, thanh âm chủ đạo là tiếng suối reo trên đá bazan, tiếng chim hót trên ngọn sầu riêng cổ và tiếng xào xạc của gió luồn qua rặng tre ngà.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                <div className="bg-white/90 backdrop-blur-sm shadow-sm rounded-2xl p-6 border border-stone-200/60 flex items-start gap-3">
                  <Droplets className="w-6 h-6 text-[#396663] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-[#1B281D]">Tiếng Nước Tự Nhiên</h4>
                    <p className="text-xs text-stone-600 mt-1">Âm thanh trắng làm dịu sóng não căng thẳng.</p>
                  </div>
                </div>
                <div className="bg-white/90 backdrop-blur-sm shadow-sm rounded-2xl p-6 border border-stone-200/60 flex items-start gap-3">
                  <Trees className="w-6 h-6 text-[#614633] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-[#1B281D]">Hương Rừng &amp; Hoa Cù</h4>
                    <p className="text-xs text-stone-600 mt-1">Mùi thơm thảo mộc tự nhiên ngát lành trong gió.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Audio Stream Player Simulator Card */}
            <div className="w-full lg:w-96 bg-white/90 backdrop-blur-sm shadow-xl rounded-2xl p-6 border border-stone-200/60 flex flex-col items-center text-center relative">
              <div className="w-20 h-20 rounded-full bg-[#396663]/15 text-[#396663] flex items-center justify-center mb-4 shadow-sm relative">
                {isPlayingAudio ? (
                  <Volume2 className="w-9 h-9 text-[#396663] animate-pulse" />
                ) : (
                  <VolumeX className="w-9 h-9 text-[#396663]" />
                )}
                {isPlayingAudio && (
                  <span className="absolute inset-0 rounded-full border-2 border-[#396663] animate-ping opacity-30" />
                )}
              </div>
              <span className="text-xs text-stone-500 uppercase tracking-wider font-semibold">
                Thanh Âm Thực Địa
              </span>
              <h3 className="font-serif text-xl font-bold text-[#3E5C46] mt-1">
                Tiếng Suối Đá Gia Nghĩa
              </h3>
              <p className="text-xs text-stone-600 mt-2 mb-6">
                {isPlayingAudio
                  ? "Đang phát mô phỏng: Tiếng suối róc rách qua ghềnh đá bazan tự nhiên..."
                  : "Bấm để nghe đoạn âm thanh thực tế bên bờ suối Cẩm Cù House lúc ban mai."}
              </p>
              <button
                type="button"
                onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                className={`w-full py-3.5 px-6 rounded-full font-semibold text-xs transition-all flex items-center justify-center gap-2 shadow-md ${
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
          <div className="bg-white/90 backdrop-blur-sm shadow-sm rounded-2xl p-6 sm:p-10 border border-stone-200/60 relative overflow-hidden">
            <div className="relative z-10 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#3E5C46]/10 text-[#3E5C46] text-xs font-bold mb-3">
                <Trees className="w-4 h-4 text-[#3E5C46]" />
                <span>Lời Hứa Xanh Từ Cẩm Cù House</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#3E5C46] font-bold tracking-tight">
                Bảo Tồn Dòng Nước Suối Bazan Tự Nhiên &amp; Giảm Thiểu Nhựa
              </h2>
              <p className="mt-3 text-base text-stone-700 leading-relaxed">
                Chúng tôi trân trọng từng viên sỏi, từng ngọn cỏ ven dòng suối. Cẩm Cù House cam kết 100% không xả thải trực tiếp vào dòng chảy, sử dụng ống hút sậy tự nhiên, cốc thủy tinh tái sử dụng và thường xuyên cùng du khách dọn sạch rác dọc hai bên bờ suối.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 p-4 rounded-2xl bg-stone-50 border border-stone-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#396663]/15 flex items-center justify-center text-[#396663] shrink-0">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#1B281D]">Không Nhựa 1 Lần</p>
                    <p className="text-[11px] text-stone-600">100% vật liệu tự nhiên</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#3E5C46]/15 flex items-center justify-center text-[#3E5C46] shrink-0">
                    <Droplets className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#1B281D]">Bảo Vệ Nguồn Nước</p>
                    <p className="text-[11px] text-stone-600">Lọc thải khép kín an toàn</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-600/15 flex items-center justify-center text-amber-800 shrink-0">
                    <Trees className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#1B281D]">Hệ Sinh Thái Rừng</p>
                    <p className="text-[11px] text-stone-600">Gìn giữ thảm thực vật bản địa</p>
                  </div>
                </div>
              </div>

              {/* Action Callouts */}
              <div className="mt-8 flex flex-wrap items-center gap-3.5">
                <a
                  href="https://maps.google.com/?q=Hem+437+Hung+Vuong+Nghia+Trung+Gia+Nghia+Dak+Nong"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[#3E5C46] text-white text-xs sm:text-sm font-semibold hover:bg-[#2D4233] transition-colors shadow-sm"
                >
                  <span>Chỉ Đường Tới Quán</span>
                  <Navigation className="w-4 h-4" />
                </a>
                <a
                  href="tel:0382851688"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-stone-100 text-[#3E5C46] hover:bg-stone-200 transition-colors text-xs sm:text-sm font-semibold border border-stone-200"
                >
                  <PhoneCall className="w-4 h-4 text-[#3E5C46]" />
                  <span>Gọi Hotline: 038 285 1688</span>
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
