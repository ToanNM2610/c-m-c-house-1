"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLanguage } from "@/context/LanguageContext";
import {
  MapPin,
  Clock,
  PhoneCall,
  Mail,
  Navigation,
  Car,
  Share2,
  Trees,
  Compass,
  Headphones
} from "lucide-react";

export default function ContactPage() {
  const { locale, dict } = useLanguage();
  const isEn = locale === "en";

  return (
    <div className="bg-[#F9F8F3] dark:bg-[#121A15] min-h-screen text-[#1B281D] dark:text-[#F5F4EE] font-sans selection:bg-[#3E5C46] selection:text-white transition-colors duration-200">
      <Navbar />

      <main className="pt-20">
        {/* Top Ambient Banner */}
        <section className="animate-fade-up-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-14 pb-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-3xl flex flex-col gap-2">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-stone-100 dark:bg-[#1E2B22] w-fit text-[#3E5C46] dark:text-[#88B795] text-xs font-semibold border border-stone-200 dark:border-stone-700/60">
                <Trees className="w-3.5 h-3.5 text-[#396663] dark:text-teal-400" />
                <span>{dict.contact.badge}</span>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#3E5C46] dark:text-[#F5F4EE] tracking-tight">
                {dict.contact.title}
              </h1>
              <p className="text-base sm:text-lg text-stone-700 dark:text-stone-300 max-w-2xl leading-relaxed mt-1">
                {dict.contact.subtitle}
              </p>
            </div>

            {/* Quick Coordinate Badge */}
            <div className="hidden lg:flex items-center gap-3 bg-white/90 dark:bg-[#1E2B22] backdrop-blur-sm p-4 rounded-2xl border border-stone-200 dark:border-stone-700/60 shadow-sm">
              <div className="w-10 h-10 rounded-full bg-[#396663]/15 dark:bg-teal-900/30 flex items-center justify-center text-[#396663] dark:text-teal-400">
                <Compass className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] text-stone-500 dark:text-stone-400 uppercase tracking-wider font-semibold">
                  {dict.contact.coordinatesTitle}
                </span>
                <span className="text-sm text-[#3E5C46] dark:text-[#88B795] font-bold">
                  11.99° N, 107.69° E
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* 2-Column Balanced Core Section */}
        <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Detailed Information (Stagger 2: 120ms) */}
            <div className="animate-fade-up-2 lg:col-span-6 flex flex-col gap-6">
              {/* Address Card */}
              <div className="bg-white/90 dark:bg-[#1E2B22] backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-stone-200/60 dark:border-stone-700/60 shadow-sm flex flex-col gap-4 transition-colors duration-200">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#3E5C46]/10 dark:bg-[#88B795]/15 text-[#3E5C46] dark:text-[#88B795] flex items-center justify-center shrink-0">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#396663] dark:text-teal-400">
                      {dict.contact.addressTitle}
                    </span>
                    <p className="font-serif text-xl sm:text-2xl font-bold text-[#1B281D] dark:text-[#F5F4EE] leading-snug mt-1">
                      {dict.common.addressFull}
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-stone-50 dark:bg-[#16231A] border border-stone-200 dark:border-stone-700/60 text-stone-700 dark:text-stone-300 flex items-start gap-3">
                  <Car className="w-5 h-5 text-[#3E5C46] dark:text-[#88B795] shrink-0 mt-0.5" />
                  <p className="text-xs sm:text-sm leading-relaxed">
                    <strong className="text-[#1B281D] dark:text-[#F5F4EE] font-semibold">
                      {isEn ? "Easy Vehicle Access:" : "Lối vào thuận tiện:"}
                    </strong>{" "}
                    {dict.common.carParkingNote}
                  </p>
                </div>
              </div>

              {/* Hours Card */}
              <div className="bg-white/90 dark:bg-[#1E2B22] backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-stone-200/60 dark:border-stone-700/60 shadow-sm flex flex-col gap-4 transition-colors duration-200">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#396663]/10 dark:bg-teal-900/30 text-[#396663] dark:text-teal-400 flex items-center justify-center shrink-0">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#396663] dark:text-teal-400">
                      {dict.contact.openingHoursTitle}
                    </span>
                    <span className="text-xs text-stone-500 dark:text-stone-400">
                      {isEn
                        ? "Breakfast, mountain lunch & specialty coffee"
                        : "Phục vụ điểm tâm, bữa chính & specialty coffee"}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-stone-50 dark:bg-[#16231A] border border-stone-200 dark:border-stone-700/60 flex flex-col gap-1">
                    <span className="text-xs text-[#614633] dark:text-[#D1A684] uppercase font-bold">
                      {isEn ? "Mon – Thu" : "Thứ 2 – Thứ 5"}
                    </span>
                    <span className="font-serif text-xl text-[#3E5C46] dark:text-[#88B795] font-bold">07:00 – 18:00</span>
                    <span className="text-[11px] text-stone-500 dark:text-stone-400">
                      {isEn ? "Daytime tranquil sanctuary" : "Không gian tĩnh dưỡng ban ngày"}
                    </span>
                  </div>
                  <div className="p-4 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/60 flex flex-col gap-1">
                    <span className="text-xs text-[#396663] dark:text-emerald-300 font-bold uppercase">
                      {isEn ? "Fri – Sun" : "Thứ 6 – Chủ Nhật"}
                    </span>
                    <span className="font-serif text-xl text-[#396663] dark:text-emerald-300 font-bold">07:00 – 22:00</span>
                    <span className="text-[11px] text-stone-500 dark:text-stone-400">
                      {isEn ? "Evening tea & riverside music" : "Trà thơm, lửa trại & nhạc bên suối"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Hotline Reception & Mail */}
              <div className="bg-white/90 dark:bg-[#1E2B22] backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-stone-200/60 dark:border-stone-700/60 shadow-sm flex flex-col gap-4 transition-colors duration-200">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#614633]/10 dark:bg-amber-900/30 text-[#614633] dark:text-amber-400 flex items-center justify-center shrink-0">
                    <Headphones className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#614633] dark:text-amber-400">
                      {dict.contact.hotlineTitle}
                    </span>
                    <p className="text-xs text-stone-500 dark:text-stone-400">
                      {isEn ? "Dedicated support on every channel" : "Trực máy hỗ trợ chu đáo mọi khung giờ"}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <a
                    href="tel:0382851688"
                    className="btn-press p-4 rounded-xl bg-stone-50 dark:bg-[#16231A] hover:bg-stone-100 dark:hover:bg-white/5 border border-stone-200 dark:border-stone-700/60 transition-colors flex items-center justify-between group shadow-sm"
                  >
                    <div className="flex flex-col">
                      <span className="text-xs text-stone-500 dark:text-stone-400">Hotline 1 (Zalo)</span>
                      <span className="text-base font-bold text-[#3E5C46] dark:text-[#88B795]">038 285 1688</span>
                    </div>
                    <PhoneCall className="w-4 h-4 text-[#3E5C46] dark:text-[#88B795] group-hover:scale-110 transition-transform" />
                  </a>

                  <a
                    href="tel:0774659000"
                    className="btn-press p-4 rounded-xl bg-stone-50 dark:bg-[#16231A] hover:bg-stone-100 dark:hover:bg-white/5 border border-stone-200 dark:border-stone-700/60 transition-colors flex items-center justify-between group shadow-sm"
                  >
                    <div className="flex flex-col">
                      <span className="text-xs text-stone-500 dark:text-stone-400">Hotline 2</span>
                      <span className="text-base font-bold text-[#3E5C46] dark:text-[#88B795]">077 465 9000</span>
                    </div>
                    <PhoneCall className="w-4 h-4 text-[#3E5C46] dark:text-[#88B795] group-hover:scale-110 transition-transform" />
                  </a>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-stone-200 dark:border-stone-700/60 text-xs text-stone-600 dark:text-stone-300">
                  <span>{isEn ? "International:" : "Quốc tế:"} <strong className="text-[#1B281D] dark:text-[#F5F4EE]">+84 38 285 1688</strong></span>
                  <a
                    href="mailto:thuynhu8788@gmail.com"
                    className="text-[#614633] dark:text-[#D1A684] font-semibold hover:underline flex items-center gap-1.5"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>thuynhu8788@gmail.com</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Right Column: Direction CTA & Social Channels (Stagger 3: 200ms) */}
            <div className="animate-fade-up-3 lg:col-span-6 flex flex-col gap-6">
              {/* Google Maps Primary CTA Card */}
              <div className="bg-white/90 dark:bg-[#1E2B22] backdrop-blur-sm rounded-2xl p-6 sm:p-8 border-2 border-[#3E5C46]/30 dark:border-[#88B795]/30 shadow-sm flex flex-col gap-4 transition-colors duration-200">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#3E5C46] text-white flex items-center justify-center shrink-0 shadow-sm">
                    <Navigation className="w-6 h-6 text-emerald-200" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#396663] dark:text-teal-400">
                      {isEn ? "Online Navigation" : "Dẫn Đường Trực Tuyến"}
                    </span>
                    <h2 className="font-serif text-2xl font-bold text-[#3E5C46] dark:text-[#F5F4EE]">
                      {isEn ? "Directions & Map to Sanctuary" : "Chỉ Đường & Định Vị Tới Quán"}
                    </h2>
                  </div>
                </div>

                <p className="text-base text-stone-700 dark:text-stone-300 leading-relaxed">
                  {isEn
                    ? "Located at Alley 437 Hung Vuong, Nghia Trung Ward, Gia Nghia City. Wide concrete paved road, safe for all vehicles directly to our spacious yard."
                    : "Quán tọa lạc tại Hẻm 437 Hùng Vương, Phường Nghĩa Trung, TP. Gia Nghĩa. Tuyến đường bê tông sạch sẽ, bằng phẳng, ô tô vào tận bãi đỗ xe trong khuôn viên quán."}
                </p>

                <div className="pt-2">
                  <a
                    href="https://maps.google.com/?q=Hem+437+Hung+Vuong+Nghia+Trung+Gia+Nghia+Dak+Nong"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-press w-full py-4 px-6 rounded-full bg-[#3E5C46] text-white text-sm font-bold hover:bg-[#2D4233] transition-all shadow-[0_6px_20px_rgba(62,92,70,0.25)] flex items-center justify-center gap-2"
                  >
                    <Navigation className="w-4 h-4" />
                    <span>{dict.common.openGoogleMaps}</span>
                  </a>
                </div>
              </div>

              {/* Social Channels Deck */}
              <div className="bg-white/90 dark:bg-[#1E2B22] backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-stone-200/60 dark:border-stone-700/60 shadow-sm flex flex-col gap-4 transition-colors duration-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#396663]/10 dark:bg-teal-900/30 text-[#396663] dark:text-teal-400 flex items-center justify-center shrink-0">
                    <Share2 className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#396663] dark:text-teal-400">
                      {isEn ? "Community Channels" : "Kênh Truyền Thông Quán"}
                    </span>
                    <h3 className="font-serif text-lg font-bold text-[#1B281D] dark:text-[#F5F4EE]">
                      {isEn ? "Connect & Follow Cam Cu House" : "Kết Nối Cùng Cẩm Cù House"}
                    </h3>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <a
                    href="https://www.facebook.com/share/1DVLMySW8H/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-press p-3.5 rounded-xl bg-stone-50 dark:bg-[#16231A] hover:bg-stone-100 dark:hover:bg-white/5 border border-stone-200 dark:border-stone-700/60 transition-colors flex items-center gap-3 shadow-sm"
                  >
                    <Share2 className="w-4 h-4 text-[#3E5C46] dark:text-[#88B795]" />
                    <span className="text-xs font-semibold text-stone-800 dark:text-stone-200">Facebook</span>
                  </a>

                  <a
                    href="https://www.tiktok.com/@camcuhousedaknong"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-press p-3.5 rounded-xl bg-stone-50 dark:bg-[#16231A] hover:bg-stone-100 dark:hover:bg-white/5 border border-stone-200 dark:border-stone-700/60 transition-colors flex items-center gap-3 shadow-sm"
                  >
                    <span className="font-bold text-xs text-[#3E5C46] dark:text-[#88B795]">TT</span>
                    <span className="text-xs font-semibold text-stone-800 dark:text-stone-200">TikTok</span>
                  </a>

                  <a
                    href="https://youtube.com/@Cam_Cu_House"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-press p-3.5 rounded-xl bg-stone-50 dark:bg-[#16231A] hover:bg-stone-100 dark:hover:bg-white/5 border border-stone-200 dark:border-stone-700/60 transition-colors flex items-center gap-3 shadow-sm"
                  >
                    <span className="text-red-500 font-bold text-xs">YT</span>
                    <span className="text-xs font-semibold text-stone-800 dark:text-stone-200">YouTube</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
