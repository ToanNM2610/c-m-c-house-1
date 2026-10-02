"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Compass,
  Star,
  DollarSign,
  Leaf,
  ArrowUpRight,
  ArrowRight,
  UtensilsCrossed,
  Thermometer,
  Wind,
  Droplets,
  Car,
  Coffee,
  PhoneCall,
  MapPin,
  CheckCircle2,
  Flower2,
  Waves,
  Sparkles,
  Clock,
  Bell
} from "lucide-react";

import {
  getSharedData,
  KEYS,
  SharedAnnouncement,
} from "@/lib/syncStore";
import {
  CAMCU_SETTINGS_KEY,
  getStoredData,
} from "@/utils/storage";

export default function HomePage() {
  const [settings, setSettings] = useState({
    isOpen: true,
    statusText: "Quán đang mở cửa đón khách",
    hoursWeekday: "07:00 - 18:00",
    hoursWeekend: "07:00 - 22:00",
    hotline1: "038 285 1688",
    topBanner: "🌿 Chào mừng đến với Cẩm Cù House • Giờ mở cửa: T2 - T5 (07:00 - 18:00) | T6 - CN (07:00 - 22:00)",
  });
  const [announcements, setAnnouncements] = useState<SharedAnnouncement[]>([]);

  useEffect(() => {
    // 1. Immediately hydrate from Shared Storage & Cookie (survives F5)
    const storedSettings = getStoredData<typeof settings | null>(CAMCU_SETTINGS_KEY, null);
    if (storedSettings) {
      setSettings((prev) => ({ ...prev, ...storedSettings }));
    }

    const storedAnnouncements = getSharedData<SharedAnnouncement[]>(KEYS.ANNOUNCEMENTS, []);
    setAnnouncements(storedAnnouncements);

    // Real-time synchronization listener across tabs & windows
    const handleSync = (e: Event) => {
      const custom = e as CustomEvent;
      if (custom.detail?.key === KEYS.ANNOUNCEMENTS) {
        setAnnouncements(custom.detail.value || []);
      }
    };
    const handleStorage = (e: StorageEvent) => {
      if (e.key === KEYS.ANNOUNCEMENTS) {
        const next = getSharedData<SharedAnnouncement[]>(KEYS.ANNOUNCEMENTS, []);
        setAnnouncements(next);
      }
    };

    window.addEventListener("camcu_sync_update", handleSync);
    window.addEventListener("storage", handleStorage);

    // 2. Fetch server updates (fallback if no local cookie is present)
    async function loadData() {
      try {
        const [settingsRes, annRes] = await Promise.all([
          fetch("/api/admin/settings").catch(() => null),
          fetch("/api/admin/announcements").catch(() => null),
        ]);

        if (settingsRes && settingsRes.ok) {
          const sData = await settingsRes.json();
          if (sData.settings) {
            setSettings((prev) => ({ ...prev, ...sData.settings }));
          }
        }

        if (annRes && annRes.ok) {
          const aData = await annRes.json();
          if (aData.announcements && Array.isArray(aData.announcements)) {
            // Only update if client has no shared cookie record
            const clientCookie = getSharedData<SharedAnnouncement[] | null>(KEYS.ANNOUNCEMENTS, null);
            if (clientCookie === null) {
              setAnnouncements(aData.announcements);
            }
          }
        }
      } catch (e) {
        // Fallback gracefully
      }
    }
    loadData();

    return () => {
      window.removeEventListener("camcu_sync_update", handleSync);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  const pinnedNews =
    announcements.find((a) => a.isPinned || a.isHighlighted) || announcements[0] || null;

  return (
    <div className="bg-[#F9F8F3] min-h-screen text-[#1B281D] font-sans selection:bg-[#3E5C46] selection:text-white">
      <Navbar />

      <main className="pt-24 sm:pt-28">
        {/* Dynamic Announcement Banner from Shared Cookie Store: Render only if pinnedNews exists */}
        {pinnedNews && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-2">
            <div className="bg-[#2D4233] text-white p-4 sm:p-5 rounded-2xl shadow-md border border-[#3E5C46]/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start sm:items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-white/10 text-amber-300 flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5 animate-pulse" />
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-800 text-emerald-200 text-[10px] font-bold uppercase tracking-wider">
                      {pinnedNews.category === "event" || pinnedNews.type === "event"
                        ? "Sự Kiện"
                        : pinnedNews.category === "special" || pinnedNews.type === "special"
                        ? "Món Đặc Sản"
                        : "Bảng Tin Quán"}
                    </span>
                    <span className="text-sm sm:text-base font-bold text-white">
                      {pinnedNews.title}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-stone-200 mt-1 line-clamp-2 sm:line-clamp-1">
                    {pinnedNews.content}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                <Link
                  href="/menu"
                  className="px-4 py-2 rounded-full bg-[#F9F8F3] text-[#2D4233] text-xs font-bold hover:bg-white transition-all shadow-sm"
                >
                  Xem Thực Đơn
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* RESTRUCTURED HERO SECTION - WARM CREAM BEIGE WITH NATURE ACCENTS */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10 pb-16 text-center">
          {/* Eyebrow Coordinate Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-stone-200/80 text-xs font-semibold uppercase tracking-widest text-[#3E5C46] mb-6 shadow-sm border border-stone-300/60">
            <Compass className="w-3.5 h-3.5 text-[#396663]" />
            <span>Tọa độ 11.99° N, 107.69° E • Gia Nghĩa, Đắk Nông</span>
          </div>

          {/* Hero Headlines */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-[#2D4233] tracking-tight leading-tight max-w-4xl mx-auto mb-4">
            CẨM CÙ HOUSE <br />
            <span className="italic font-normal text-[#7D5E4A] text-2xl sm:text-4xl lg:text-5xl block mt-2">
              Chốn Dừng Chân Mộc Mạc Bên Bờ Suối Đá
            </span>
          </h1>

          {/* Subtitle Description */}
          <p className="text-stone-600 text-base sm:text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
            Thưởng thức tách cà phê Robusta rang củi nguyên bản, lắng nghe dòng suối róc rách giữa thung lũng xanh thanh bình miền cao nguyên Đắk Nông.
          </p>

          {/* Trust Badges */}
          <div className="flex flex-wrap items-center justify-center gap-3 text-xs sm:text-sm font-medium text-stone-700 mb-8">
            <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white shadow-sm border border-stone-200/80">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              100% Đề Xuất Hài Lòng
            </span>
            <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white shadow-sm border border-stone-200/80">
              <DollarSign className="w-4 h-4 text-[#3E5C46]" />
              Mức Giá Bình Dân (20k - 45k)
            </span>
            <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white shadow-sm border border-stone-200/80">
              <Leaf className="w-4 h-4 text-[#396663]" />
              Nguyên Liệu Xanh Sạch
            </span>
          </div>

          {/* Balanced CTA Buttons (No Booking/Reservation) */}
          <div className="flex flex-wrap items-center justify-center gap-3.5 mb-10">
            <Link
              href="/space"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-[#3E5C46] text-white text-sm font-semibold hover:bg-[#2D4233] transition-all shadow-[0_6px_20px_rgba(62,92,70,0.25)] hover:-translate-y-0.5"
            >
              <span>Khám Phá Góc Suối</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
            <Link
              href="/menu"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-white text-[#2D4233] text-sm font-semibold hover:bg-stone-50 border border-stone-300/80 transition-all shadow-sm hover:-translate-y-0.5"
            >
              <UtensilsCrossed className="w-4 h-4 text-[#3E5C46]" />
              <span>Xem Thực Đơn 50+ Món</span>
            </Link>
            <a
              href="tel:0382851688"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[#F4EFEA] hover:bg-[#EAE2D9] text-[#2D4233] text-sm font-semibold transition-all shadow-sm border border-stone-300/60 hover:-translate-y-0.5"
            >
              <PhoneCall className="w-4 h-4 text-[#3E5C46]" />
              <span>Hotline: 038 285 1688</span>
            </a>
            <a
              href="https://maps.google.com/?q=Hem+437+Hung+Vuong+Nghia+Trung+Gia+Nghia+Dak+Nong"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 text-sm font-semibold transition-all border border-stone-300/60"
            >
              <MapPin className="w-4 h-4 text-[#7D5E4A]" />
              <span>Chỉ Đường Tới Quán</span>
            </a>
          </div>

          {/* Real-time Atmospheric Meter Badge & Store Status */}
          <div className="inline-flex flex-wrap items-center justify-center gap-3 px-5 py-2.5 rounded-full bg-white/90 backdrop-blur-sm border border-stone-200/80 shadow-sm text-stone-600 text-xs mb-10">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span
                  className={`animate-ping absolute inline-flex h-full w-full rounded-full ${
                    settings.isOpen ? "bg-emerald-400" : "bg-rose-400"
                  } opacity-75`}
                />
                <span
                  className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                    settings.isOpen ? "bg-emerald-500" : "bg-rose-500"
                  }`}
                />
              </span>
              <span className="font-semibold text-stone-800">
                Hệ thống Hoạt Động: Cửa hàng {settings.isOpen ? "Đang mở" : "Tạm nghỉ"}
              </span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-3 font-semibold text-[#2D4233]">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#3E5C46]" /> T2-T5: {settings.hoursWeekday} | T6-CN: {settings.hoursWeekend}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Thermometer className="w-3.5 h-3.5 text-[#3E5C46]" /> 23°C
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Wind className="w-3.5 h-3.5 text-[#3E5C46]" /> Gió mát nhẹ
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Droplets className="w-3.5 h-3.5 text-[#396663]" /> Nước trong veo
              </span>
            </div>
          </div>

          {/* Hero Stream Photo Frame (Khung ảnh bờ suối lớn bo góc rounded-3xl) */}
          <div className="relative max-w-5xl mx-auto h-72 sm:h-96 md:h-[500px] rounded-3xl overflow-hidden shadow-2xl border-4 border-white/90">
            <img
              src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80"
              alt="Cảnh sắc suối mộc Cẩm Cù House Gia Nghĩa Đắk Nông"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-transparent to-transparent flex items-end p-6 sm:p-10">
              <div className="text-left text-white">
                <span className="text-xs uppercase font-semibold tracking-wider text-emerald-200">
                  Không Gian Sinh Thái Suối Reo
                </span>
                <p className="text-lg sm:text-2xl font-serif font-bold mt-1">
                  Thung lũng suối xanh mát &amp; hiên gỗ lợp lá mộc yên bình
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 1: 4 PILLARS - VÌ SAO CHỌN CẨM CÙ HOUSE */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#3E5C46]/10 text-[#3E5C46] text-xs font-semibold mb-3">
                <Flower2 className="w-3.5 h-3.5" />
                <span>Nét Đẹp Bản Địa</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#3E5C46] font-bold tracking-tight">
                Chuyện Cẩm Cù House • Góc Bình Yên Bên Dòng Suối
              </h2>
            </div>
            <p className="text-sm sm:text-base text-stone-700 max-w-md">
              Không ồn ào khói bụi, nơi đây chỉ có tiếng nước reo bên bờ đá và hương thơm nồng nàn của cà phê rang củi Đắk Nông.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1 */}
            <div className="bg-white/90 backdrop-blur-sm shadow-sm rounded-2xl p-6 border border-stone-200/60 hover:shadow-md transition-shadow flex flex-col justify-between">
              <div className="w-12 h-12 rounded-2xl bg-[#3E5C46]/10 text-[#3E5C46] flex items-center justify-center mb-4">
                <Coffee className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-[#1B281D] mb-2">
                Robusta Rang Củi
              </h3>
              <p className="text-sm text-stone-700 leading-relaxed mb-4">
                Tuyển chọn từng hạt cà phê chín mọng từ nương rẫy, rang thủ công bằng củi lửa mộc mạc lưu giữ hậu vị đậm đà.
              </p>
              <span className="text-xs font-semibold text-[#3E5C46]">Hương vị truyền thống</span>
            </div>

            {/* Card 2 */}
            <div className="bg-white/90 backdrop-blur-sm shadow-sm rounded-2xl p-6 border border-stone-200/60 hover:shadow-md transition-shadow flex flex-col justify-between">
              <div className="w-12 h-12 rounded-2xl bg-[#396663]/10 text-[#396663] flex items-center justify-center mb-4">
                <Waves className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-[#1B281D] mb-2">
                Dòng Suối Mát Lành
              </h3>
              <p className="text-sm text-stone-700 leading-relaxed mb-4">
                Dòng nước tự nhiên chảy qua bờ đá rêu phong, tạo nên khúc nhạc êm ả xua tan mọi mỏi mệt trong nhịp sống thường nhật.
              </p>
              <span className="text-xs font-semibold text-[#396663]">Thiên nhiên 100%</span>
            </div>

            {/* Card 3 */}
            <div className="bg-white/90 backdrop-blur-sm shadow-sm rounded-2xl p-6 border border-stone-200/60 hover:shadow-md transition-shadow flex flex-col justify-between">
              <div className="w-12 h-12 rounded-2xl bg-amber-600/10 text-amber-700 flex items-center justify-center mb-4">
                <Flower2 className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-[#1B281D] mb-2">
                Hoa Cẩm Cù Nở Rộ
              </h3>
              <p className="text-sm text-stone-700 leading-relaxed mb-4">
                Loài hoa Hoya hình ngôi sao biểu trưng cho sức sống dẻo dai của đất trời cao nguyên, phủ kín lối đi quanh hiên nhà.
              </p>
              <span className="text-xs font-semibold text-amber-700">Biểu tượng quán</span>
            </div>

            {/* Card 4 */}
            <div className="bg-white/90 backdrop-blur-sm shadow-sm rounded-2xl p-6 border border-stone-200/60 hover:shadow-md transition-shadow flex flex-col justify-between">
              <div className="w-12 h-12 rounded-2xl bg-[#3E5C46]/10 text-[#3E5C46] flex items-center justify-center mb-4">
                <Car className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-[#1B281D] mb-2">
                Đường Vào Rộng Rãi
              </h3>
              <p className="text-sm text-stone-700 leading-relaxed mb-4">
                Đường bê tông ô tô 4 – 16 chỗ vào thẳng sân quán, bãi đỗ rộng rãi, an toàn và hoàn toàn miễn phí cho du khách.
              </p>
              <span className="text-xs font-semibold text-[#3E5C46]">Thuận tiện di chuyển</span>
            </div>
          </div>
        </section>

        {/* SECTION 2: HIGHLIGHT MENU PREVIEW */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#3E5C46]/10 text-[#3E5C46] text-xs font-semibold mb-3">
                <UtensilsCrossed className="w-3.5 h-3.5" />
                <span>Hơn 50 Món Nước &amp; Điểm Tâm</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#3E5C46] font-bold tracking-tight">
                Món Ngon Đặc Sản Bản Địa
              </h2>
            </div>
            <Link
              href="/menu"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#3E5C46] hover:text-[#2D4233] transition-colors"
            >
              <span>Xem toàn bộ menu 50+ món</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Dish 1 */}
            <div className="bg-white/90 backdrop-blur-sm shadow-sm rounded-2xl p-6 border border-stone-200/60 hover:shadow-md transition-all flex flex-col justify-between group">
              <div className="relative rounded-xl overflow-hidden aspect-[4/3] mb-4 bg-stone-100">
                <img
                  src="https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80"
                  alt="Cà phê muối Đắk Nông"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-[#3E5C46] text-white text-xs font-bold shadow-sm">
                  Best Seller
                </span>
              </div>
              <div>
                <div className="flex items-baseline justify-between mb-2">
                  <h3 className="font-serif text-lg font-bold text-[#1B281D]">
                    Cà phê muối Đắk Nông
                  </h3>
                  <span className="text-base font-bold text-[#614633]">28.000đ</span>
                </div>
                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed mb-4">
                  Cốt Robusta đậm đặc hòa quyện lớp kem muối béo nhẹ độc quyền của Cẩm Cù House.
                </p>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-xs text-stone-500">
                <span>Vị đậm đà béo ngậy</span>
                <span className="text-[#3E5C46] font-medium">Có sẵn hôm nay</span>
              </div>
            </div>

            {/* Dish 2 */}
            <div className="bg-white/90 backdrop-blur-sm shadow-sm rounded-2xl p-6 border border-stone-200/60 hover:shadow-md transition-all flex flex-col justify-between group">
              <div className="relative rounded-xl overflow-hidden aspect-[4/3] mb-4 bg-stone-100">
                <img
                  src="https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=800&q=80"
                  alt="Trà hoa đu đủ mật ong rừng"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-[#396663] text-white text-xs font-bold shadow-sm">
                  Thanh Mát
                </span>
              </div>
              <div>
                <div className="flex items-baseline justify-between mb-2">
                  <h3 className="font-serif text-lg font-bold text-[#1B281D]">
                    Trà hoa đu đủ mật ong rừng
                  </h3>
                  <span className="text-base font-bold text-[#614633]">28.000đ</span>
                </div>
                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed mb-4">
                  Hoa đu đủ đực phơi khô nấu nước suối nguồn thanh ngọt cùng mật ong rừng Gia Nghĩa.
                </p>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-xs text-stone-500">
                <span>Bồi bổ sức khỏe</span>
                <span className="text-[#3E5C46] font-medium">Có sẵn hôm nay</span>
              </div>
            </div>

            {/* Dish 3 */}
            <div className="bg-white/90 backdrop-blur-sm shadow-sm rounded-2xl p-6 border border-stone-200/60 hover:shadow-md transition-all flex flex-col justify-between group">
              <div className="relative rounded-xl overflow-hidden aspect-[4/3] mb-4 bg-stone-100">
                <img
                  src="https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&w=800&q=80"
                  alt="Sinh tố bơ sầu riêng 034"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-[#7D5E4A] text-white text-xs font-bold shadow-sm">
                  Đặc Sản VIP
                </span>
              </div>
              <div>
                <div className="flex items-baseline justify-between mb-2">
                  <h3 className="font-serif text-lg font-bold text-[#1B281D]">
                    Sinh tố bơ sầu riêng 034
                  </h3>
                  <span className="text-base font-bold text-[#614633]">33.000đ</span>
                </div>
                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed mb-4">
                  Bơ sáp dẻo quánh đặc sản Đắk Nông xay cùng sầu riêng Ri6 thơm béo ngậy.
                </p>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-xs text-stone-500">
                <span>Dẻo mịn ngọt thơm</span>
                <span className="text-[#3E5C46] font-medium">Có sẵn hôm nay</span>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 3: SPACE PREVIEW */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#3E5C46]/10 text-[#3E5C46] text-xs font-semibold mb-3">
                <Waves className="w-3.5 h-3.5" />
                <span>Không Gian Mở Bên Bờ Suối</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#3E5C46] font-bold tracking-tight">
                Góc Check-in &amp; Thư Thái Tự Nhiên
              </h2>
            </div>
            <Link
              href="/space"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#3E5C46] hover:text-[#2D4233] transition-colors"
            >
              <span>Xem 15+ góc ảnh không gian</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="relative rounded-2xl overflow-hidden aspect-[4/3] group shadow-sm">
              <img
                src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80"
                alt="Hiên gỗ ngắm dòng suối tại Cẩm Cù House"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-transparent to-transparent flex items-end p-5">
                <span className="text-white text-sm font-medium font-serif">Hiên gỗ ngắm suối tự nhiên</span>
              </div>
            </div>

            <div className="relative rounded-2xl overflow-hidden aspect-[4/3] group shadow-sm">
              <img
                src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80"
                alt="Bàn ghế mộc dưới tán cây"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-transparent to-transparent flex items-end p-5">
                <span className="text-white text-sm font-medium font-serif">Bàn đá rợp bóng mát cây rừng</span>
              </div>
            </div>

            <div className="relative rounded-2xl overflow-hidden aspect-[4/3] group shadow-sm">
              <img
                src="https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80"
                alt="Lối đi hoa cẩm cù rực rỡ"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-transparent to-transparent flex items-end p-5">
                <span className="text-white text-sm font-medium font-serif">Lối nhỏ hoa Cẩm Cù nở rực rỡ</span>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 4: TESTIMONIALS */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#3E5C46]/10 text-[#3E5C46] text-xs font-semibold mb-3">
              <Star className="w-3.5 h-3.5 fill-[#3E5C46]" />
              <span>Đánh Giá Từ Khách Hàng</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#3E5C46] font-bold tracking-tight">
              Cảm Nhận Từ Lữ Khách Ghé Chơi
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/90 backdrop-blur-sm shadow-sm rounded-2xl p-6 border border-stone-200/60 flex flex-col justify-between">
              <div className="flex items-center gap-1 text-amber-500 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-stone-700 text-sm leading-relaxed mb-6 italic">
                &ldquo;Không gian bờ suối quá đẹp và thư thái. Cà phê muối ở đây cực kỳ thơm béo, ngồi nhâm nhi nghe tiếng nước chảy cả buổi không biết chán.&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#3E5C46]/15 flex items-center justify-center font-bold text-[#3E5C46]">
                  H
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#1B281D]">Hoàng Nam</h4>
                  <p className="text-xs text-stone-500">Khách du lịch TP.HCM</p>
                </div>
              </div>
            </div>

            <div className="bg-white/90 backdrop-blur-sm shadow-sm rounded-2xl p-6 border border-stone-200/60 flex flex-col justify-between">
              <div className="flex items-center gap-1 text-amber-500 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-stone-700 text-sm leading-relaxed mb-6 italic">
                &ldquo;Đường vào rất dễ đi, xe ô tô 7 chỗ chạy vào tận sân thoải mái. Quán mộc mạc, nhiều góc chụp ảnh với hoa cẩm cù rất xinh xắn.&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#396663]/15 flex items-center justify-center font-bold text-[#396663]">
                  T
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#1B281D]">Thanh Thảo</h4>
                  <p className="text-xs text-stone-500">Khách địa phương Gia Nghĩa</p>
                </div>
              </div>
            </div>

            <div className="bg-white/90 backdrop-blur-sm shadow-sm rounded-2xl p-6 border border-stone-200/60 flex flex-col justify-between">
              <div className="flex items-center gap-1 text-amber-500 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-stone-700 text-sm leading-relaxed mb-6 italic">
                &ldquo;Trà hoa đu đủ rất đặc biệt, uống mát lành tốt cho sức khỏe. Đồ ăn sáng như bò kho bánh mì cũng rất ngon và giá cả hợp lý.&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-600/15 flex items-center justify-center font-bold text-amber-700">
                  M
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#1B281D]">Minh Trí</h4>
                  <p className="text-xs text-stone-500">Ghé thăm cuối tuần</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 5: INVITATION & DIRECTIONS CTA */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="bg-[#3E5C46] rounded-3xl p-8 sm:p-12 lg:p-16 text-white shadow-xl flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="max-w-2xl">
              <span className="text-emerald-200 text-xs uppercase tracking-wider font-semibold">
                Chào Đón Bạn Ghé Thăm
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold mt-2 mb-4 leading-tight">
                Ghé Cẩm Cù House Thưởng Thức Cà Phê Bên Bờ Suối
              </h2>
              <p className="text-stone-200 text-sm sm:text-base leading-relaxed mb-6">
                Địa chỉ: Hẻm 437 Hùng Vương, Phường Nghĩa Trung, Thành phố Gia Nghĩa, Tỉnh Đắk Nông. Quán mở cửa từ 07:00 đến 22:00 tất cả các ngày trong tuần.
              </p>
              <div className="flex flex-wrap items-center gap-4 text-xs text-emerald-100">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                  Đường ô tô vào tận nơi
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                  Chỗ đỗ xe rộng rãi miễn phí
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                  Wifi cáp quang tốc độ cao
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 shrink-0 w-full lg:w-auto">
              <a
                href="tel:0382851688"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-white text-[#3E5C46] font-bold text-sm hover:bg-stone-100 transition-all shadow-lg hover:-translate-y-0.5"
              >
                <PhoneCall className="w-5 h-5 text-[#3E5C46]" />
                <span>Gọi Hotline: 038 285 1688</span>
              </a>
              <a
                href="https://maps.google.com/?q=Hem+437+Hung+Vuong+Nghia+Trung+Gia+Nghia+Dak+Nong"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-[#2D4233] text-white font-semibold text-sm hover:bg-[#1f2e23] border border-white/20 transition-all shadow-md hover:-translate-y-0.5"
              >
                <MapPin className="w-5 h-5 text-emerald-300" />
                <span>Xem Bản Đồ Chỉ Đường</span>
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
