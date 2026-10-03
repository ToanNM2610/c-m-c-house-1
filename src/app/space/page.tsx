"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LightboxModal, { LightboxPhoto } from "@/components/LightboxModal";
import { SPACE_ITEMS, SPACE_CATEGORIES, SpaceItem } from "@/data/space";
import { useLanguage } from "@/context/LanguageContext";
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
    <div className="bg-[#F9F8F3] dark:bg-[#121A15] min-h-screen text-[#1B281D] dark:text-[#F5F4EE] transition-colors duration-300">
      <Navbar />

      <main className="pt-24 sm:pt-28">
        {/* Top Narrative Intro */}
        <section className="relative w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pt-6 sm:pt-10 pb-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-stone-100 dark:bg-[#1E2B22] text-[#3E5C46] dark:text-[#88B795] text-xs tracking-wider uppercase mb-3 shadow-sm border border-stone-200/70 dark:border-stone-700/60">
                <Droplets className="w-3.5 h-3.5 text-[#396663] dark:text-[#88B795]" />
                <span>{dict.space.badge} • Gia Nghĩa</span>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#3E5C46] dark:text-[#F5F4EE] font-bold tracking-tight leading-tight">
                {isEn ? (
                  <>
                    Eco Sanctuary <span className="text-[#614633] dark:text-[#E8A87C] italic font-normal">•</span> Serenity by the Rock Stream
                  </>
                ) : (
                  <>
                    Không Gian Sinh Thái <span className="text-[#614633] dark:text-[#E8A87C] italic font-normal">•</span> Sự Tĩnh Lặng Bên Bờ Suối Đá
                  </>
                )}
              </h1>
              <p className="mt-3 text-base sm:text-lg text-stone-700 dark:text-stone-300 max-w-2xl leading-relaxed">
                {isEn
                  ? "Every corner at Cam Cu House preserves pristine rustic tranquility. Listen to the gentle stream murmur and discover peaceful serenity in the heart of the Dak Nong highlands."
                  : "Mỗi mét vuông tại Cẩm Cù House được gìn giữ trọn vẹn nét mộc mạc nguyên sơ. Lắng nghe tiếng nước róc rách và thong thả tìm lại an yên giữa đại ngàn Đắk Nông."}
              </p>
            </div>

            {/* Quick Atmosphere Metrics */}
            <div className="flex items-center gap-4 bg-white/90 dark:bg-[#1E2B22] backdrop-blur-sm border border-stone-200/70 dark:border-stone-700/60 px-5 py-3 rounded-2xl shadow-sm self-start lg:self-end">
              <div className="flex flex-col">
                <span className="text-[11px] text-stone-500 dark:text-stone-400 uppercase tracking-wider font-semibold">
                  {isEn ? "Valley Temp" : "Nhiệt Độ Thung Lũng"}
                </span>
                <span className="font-serif text-xl font-bold text-[#3E5C46] dark:text-[#88B795]">
                  22°C - 26°C
                </span>
              </div>
              <div className="w-px h-8 bg-stone-200 dark:bg-stone-700" />
              <div className="flex flex-col">
                <span className="text-[11px] text-stone-500 dark:text-stone-400 uppercase tracking-wider font-semibold">
                  {isEn ? "Natural Stream" : "Bờ Suối Tự Nhiên"}
                </span>
                <span className="font-serif text-xl font-bold text-[#396663] dark:text-[#E8A87C]">
                  {isEn ? "Basalt Pebbles" : "Đá Bazan Cổ"}
                </span>
              </div>
            </div>
          </div>

          {/* Filter Tabs - Responsive with Horizontal Scrollbar Hidden on Mobile/Tablet */}
          <div className="w-full flex items-center justify-between gap-4 pb-4 border-b border-stone-200/70 dark:border-stone-800">
            <div className="flex items-center gap-2 p-1.5 bg-stone-100 dark:bg-[#1E2B22] rounded-2xl sm:rounded-full border border-stone-200/70 dark:border-stone-700/60 overflow-x-auto no-scrollbar w-full sm:w-auto">
              {SPACE_CATEGORIES.map((cat) => {
                const label = dict.space.categories[cat.id] || cat.name;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveFilter(cat.id)}
                    type="button"
                    className={`btn-press-sm min-h-[44px] px-5 py-2.5 rounded-xl sm:rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-300 shrink-0 ${
                      activeFilter === cat.id
                        ? "bg-[#3E5C46] dark:bg-[#2D4233] text-white shadow-sm font-bold"
                        : "text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white hover:bg-stone-200/60 dark:hover:bg-white/10"
                    }`}
                  >
                    {cat.id === "all" ? `${label} (${allItems.length})` : label}
                  </button>
                );
              })}
            </div>

            <div className="hidden lg:flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400 font-medium shrink-0">
              <span>
                {filteredItems.length} {isEn ? "scenic stream spots" : "góc ảnh bờ suối"}
              </span>
            </div>
          </div>
        </section>

        {/* Gallery Grid Section */}
        <section className="w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item, idx) => (
              <div
                key={`${activeFilter}_${item.id}`}
                onClick={() => handleOpenLightbox(idx)}
                className={`animate-fade-in stagger-${(idx % 8) + 1} group relative cursor-pointer rounded-2xl overflow-hidden aspect-[4/3] bg-stone-100 dark:bg-stone-800 shadow-sm hover:shadow-xl border border-stone-200/70 dark:border-stone-700/60 transition-all duration-300 hover:-translate-y-1 active:scale-[0.98] transform-gpu`}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out transform-gpu"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/85 via-stone-950/30 to-transparent flex flex-col justify-end p-4 text-white transition-opacity duration-300">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300 mb-0.5 transform transition-transform duration-300 group-hover:-translate-y-0.5">
                    {item.subtitle}
                  </span>
                  <h3 className="font-serif text-base font-bold text-white line-clamp-1 group-hover:text-emerald-200 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-stone-200/90 line-clamp-2 mt-0.5 transition-transform duration-300 group-hover:-translate-y-0.5">
                    {item.description}
                  </p>
                </div>

                <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 text-white/80 group-hover:text-white group-hover:bg-[#3E5C46] flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 shadow-md">
                  <Maximize2 className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Stream Ambience Floating Audio Bar */}
        <section className="w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-10">
          <div className="bg-stone-200/80 dark:bg-[#1E2B22] p-6 sm:p-8 rounded-2xl border border-stone-300/60 dark:border-stone-700/60 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#3E5C46] text-white flex items-center justify-center shrink-0">
                <Droplets className="w-6 h-6 animate-pulse" />
              </div>
              <div className="flex flex-col">
                <span className="font-serif font-bold text-lg text-[#2D4233] dark:text-[#F5F4EE]">
                  {isEn ? "Highland Stream Natural Audio" : "Thanh Âm Suối Nguồn Cao Nguyên"}
                </span>
                <span className="text-xs text-stone-600 dark:text-stone-300">
                  {isEn
                    ? "Recorded live on location beside the basalt rock stream at Cam Cu House"
                    : "Thu âm trực tiếp bên bờ suối đá Cẩm Cù House • Đắk Nông"}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsPlayingAudio(!isPlayingAudio)}
              className={`btn-press min-h-[44px] px-7 py-3 rounded-full font-semibold text-xs transition-all flex items-center justify-center gap-2 shadow-md ${
                isPlayingAudio
                  ? "bg-[#396663] text-white"
                  : "bg-[#3E5C46] text-white hover:bg-[#2D4233]"
              }`}
            >
              {isPlayingAudio ? (
                <>
                  <Pause className="w-4 h-4" />
                  <span>{dict.space.muteAudio}</span>
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

        {/* Eco Charter Section */}
        <section className="w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-12">
          <div className="bg-white/90 dark:bg-[#1E2B22] backdrop-blur-sm shadow-sm rounded-2xl p-6 sm:p-10 border border-stone-200/60 dark:border-stone-700/60 relative overflow-hidden">
            <div className="relative z-10 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#3E5C46]/10 dark:bg-[#88B795]/15 text-[#3E5C46] dark:text-[#88B795] text-xs font-bold mb-3">
                <Trees className="w-4 h-4 text-[#3E5C46] dark:text-[#88B795]" />
                <span>{isEn ? "Eco Commitment from Cam Cu House" : "Lời Hứa Xanh Từ Cẩm Cù House"}</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#3E5C46] dark:text-[#F5F4EE] font-bold tracking-tight">
                {isEn
                  ? "Preserving Natural Basalt Streams & Plastic-Free Living"
                  : "Bảo Tồn Dòng Nước Suối Bazan Tự Nhiên & Giảm Thiểu Nhựa"}
              </h2>
              <p className="mt-3 text-base text-stone-700 dark:text-stone-300 leading-relaxed">
                {isEn
                  ? "We treasure every pebble and blade of grass along our stream bank. Cam Cu House strictly avoids direct discharge into waterways, utilizes natural reed straws, reusable glassware, and regularly organizes stream cleanups."
                  : "Chúng tôi trân trọng từng viên sỏi, từng ngọn cỏ ven dòng suối. Cẩm Cù House cam kết 100% không xả thải trực tiếp vào dòng chảy, sử dụng ống hút sậy tự nhiên, cốc thủy tinh tái sử dụng và thường xuyên cùng du khách dọn sạch rác dọc hai bên bờ suối."}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 p-4 rounded-2xl bg-stone-50 dark:bg-[#16231A] border border-stone-200 dark:border-stone-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#396663]/15 flex items-center justify-center text-[#396663] dark:text-[#88B795] shrink-0">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#1B281D] dark:text-white">
                      {isEn ? "Single-Use Plastic Free" : "Không Nhựa 1 Lần"}
                    </p>
                    <p className="text-[11px] text-stone-600 dark:text-stone-400">
                      {isEn ? "100% natural materials" : "100% vật liệu tự nhiên"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#3E5C46]/15 flex items-center justify-center text-[#3E5C46] dark:text-emerald-400 shrink-0">
                    <Droplets className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#1B281D] dark:text-white">
                      {isEn ? "Water Source Protection" : "Bảo Vệ Nguồn Nước"}
                    </p>
                    <p className="text-[11px] text-stone-600 dark:text-stone-400">
                      {isEn ? "Safe closed-loop filtration" : "Lọc thải khép kín an toàn"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-600/15 flex items-center justify-center text-amber-800 dark:text-amber-300 shrink-0">
                    <Trees className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#1B281D] dark:text-white">
                      {isEn ? "Forest Ecosystem" : "Hệ Sinh Thái Rừng"}
                    </p>
                    <p className="text-[11px] text-stone-600 dark:text-stone-400">
                      {isEn ? "Preserving native flora" : "Gìn giữ thảm thực vật bản địa"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Callouts */}
              <div className="mt-8 flex flex-wrap items-center gap-3.5">
                <a
                  href="https://maps.google.com/?q=Hem+437+Hung+Vuong+Nghia+Trung+Gia+Nghia+Dak+Nong"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-press inline-flex items-center justify-center gap-2 min-h-[44px] px-6 py-3.5 rounded-full bg-[#3E5C46] text-white text-xs sm:text-sm font-semibold hover:bg-[#2D4233] transition-colors shadow-sm"
                >
                  <span>{dict.common.getDirections}</span>
                  <Navigation className="w-4 h-4" />
                </a>
                <a
                  href="tel:0382851688"
                  className="btn-press inline-flex items-center justify-center gap-2 min-h-[44px] px-6 py-3.5 rounded-full bg-stone-100 dark:bg-[#1E2B22] text-[#3E5C46] dark:text-[#88B795] hover:bg-stone-200 dark:hover:bg-[#28392E] transition-colors text-xs sm:text-sm font-semibold border border-stone-200 dark:border-stone-700/60"
                >
                  <PhoneCall className="w-4 h-4 text-[#3E5C46] dark:text-[#88B795]" />
                  <span>
                    {isEn ? "Call Hotline: 038 285 1688" : "Gọi Hotline: 038 285 1688"}
                  </span>
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
