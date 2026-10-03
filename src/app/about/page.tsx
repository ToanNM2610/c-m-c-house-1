"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLanguage } from "@/context/LanguageContext";
import {
  Flower2,
  Droplets,
  Coffee,
  Trees,
  Leaf,
  Flame,
  Heart,
  ArrowRight,
  PhoneCall,
  Navigation,
} from "lucide-react";

export default function AboutPage() {
  const { locale, dict } = useLanguage();
  const isEn = locale === "en";

  return (
    <div className="bg-[#F9F8F3] dark:bg-[#121A15] min-h-screen text-[#1B281D] dark:text-[#F5F4EE] font-sans selection:bg-[#3E5C46] selection:text-white transition-colors duration-200">
      <Navbar />

      <main className="pt-20">
        {/* Top Narrative Intro */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14 pb-12 w-full text-center">
          <div className="max-w-4xl mx-auto flex flex-col items-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-stone-200/80 dark:bg-[#1E2B22] border border-stone-300/60 dark:border-stone-700/60 shadow-sm mb-6">
              <span className="w-2 h-2 rounded-full bg-[#3E5C46] dark:bg-emerald-400 animate-pulse" />
              <span className="text-xs text-[#3E5C46] dark:text-[#88B795] uppercase tracking-widest font-bold">
                {dict.about.badge}
              </span>
              <span className="text-stone-400 dark:text-stone-600">•</span>
              <span className="text-xs text-stone-600 dark:text-stone-300 font-semibold">Gia Nghĩa • Đắk Nông</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-[#3E5C46] dark:text-[#F5F4EE] font-bold tracking-tight max-w-3xl mb-4 leading-tight">
              {dict.about.title} <br className="hidden sm:inline" />
              <span className="italic font-normal text-[#7D5E4A] dark:text-[#D1A684] text-2xl sm:text-4xl lg:text-5xl block mt-2">
                {dict.about.subtitle}
              </span>
            </h1>

            <p className="text-base sm:text-lg text-stone-700 dark:text-stone-300 max-w-2xl leading-relaxed mt-2">
              {dict.about.description}
            </p>

            {/* Coordinates & Badges */}
            <div className="flex flex-wrap items-center justify-center gap-3 mt-8 text-xs font-semibold text-[#7D5E4A] dark:text-stone-200">
              <span className="flex items-center gap-1.5 px-4 py-2 bg-white dark:bg-[#1E2B22] border border-stone-200/80 dark:border-stone-700/60 rounded-full shadow-sm">
                <Flower2 className="w-4 h-4 text-[#3E5C46] dark:text-[#88B795]" />
                {dict.about.hoyaFlower}
              </span>
              <span className="flex items-center gap-1.5 px-4 py-2 bg-white dark:bg-[#1E2B22] border border-stone-200/80 dark:border-stone-700/60 rounded-full shadow-sm">
                <Droplets className="w-4 h-4 text-[#396663] dark:text-teal-400" />
                {dict.about.pureStream}
              </span>
              <span className="flex items-center gap-1.5 px-4 py-2 bg-white dark:bg-[#1E2B22] border border-stone-200/80 dark:border-stone-700/60 rounded-full shadow-sm">
                <Coffee className="w-4 h-4 text-[#7D5E4A] dark:text-amber-400" />
                {isEn ? "Firewood-Roasted Robusta" : "Robusta rang củi mộc"}
              </span>
            </div>
          </div>
        </section>

        {/* SECTION 1: Hành Trình Khởi Sinh */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Text Column */}
            <div className="lg:col-span-7 flex flex-col gap-5">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-[#3E5C46] dark:text-[#88B795] uppercase tracking-wider">
                  {isEn ? "Origins" : "Khối 01"}
                </span>
                <span className="w-8 h-[2px] bg-[#3E5C46]/30 dark:bg-[#88B795]/30" />
                <span className="text-xs text-stone-500 dark:text-stone-400">
                  {isEn ? "The Magic of Nature" : "Sự Kỳ Diệu Của Tự Nhiên"}
                </span>
              </div>

              <h2 className="font-serif text-3xl sm:text-4xl text-[#3E5C46] dark:text-[#F5F4EE] font-bold leading-tight">
                {isEn
                  ? "Resilient Blossoms & A Destiny Beside the Rock Stream"
                  : "Loài Hoa Bền Bỉ & Mối Duyên Lành Bên Dòng Suối"}
              </h2>

              <div className="space-y-4 text-base text-stone-700 dark:text-stone-300 leading-relaxed">
                <p>
                  {isEn ? (
                    <>
                      The name <strong className="font-semibold text-[#3E5C46] dark:text-[#88B795]">&ldquo;Cam Cu&rdquo; (Hoya carnosa)</strong> originates from a modest native climbing vine thriving under the canopy of the Central Highlands forest. Rather than boasting loud colors, the Hoya flower patiently collects morning dew to blossom into spherical porcelain-like star clusters. In highland folk beliefs, these spherical clusters symbolize steadfast connection, heartfelt warmth, and profound peace of mind.
                    </>
                  ) : (
                    <>
                      Tên gọi <strong className="font-semibold text-[#3E5C46] dark:text-[#88B795]">&ldquo;Cẩm Cù&rdquo; (Hoya carnosa)</strong> bắt nguồn từ một loài hoa dây leo mộc mạc nép mình dưới bóng rừng Tây Nguyên. Không ồn ào khoe sắc, hoa Cẩm Cù kiên định chắt chiu sương sớm qua từng năm tháng để nở thành từng chùm hình cầu lung linh tựa cánh sứ ngũ giác. Trong phong thủy và tâm thức người bản địa, chùm hoa hình tròn trọn vẹn là biểu tượng của sự gắn kết son sắt, ấm cúng và sự an yên thanh thản sâu trong tâm hồn.
                    </>
                  )}
                </p>
                <p>
                  {isEn
                    ? "Discovering this natural pebble stream in Gia Nghia felt like a destined promise. Instead of clearing or paving the terrain with harsh concrete, we embraced nature gently: moss-covered basalt boulders, shade-bearing forest trees, and the clear stream waters running through pebble crevices were all preserved intact."
                    : "Cơ duyên tìm thấy khu đất nép bên khe suối tự nhiên tại Gia Nghĩa như một lời hẹn ước định mệnh. Thay vì san phẳng mặt bằng hay bê tông hóa thô bạo, chúng tôi chọn cách nương tựa vào mẹ thiên nhiên: từng phiến đá bazan phủ rêu xanh cổ kính, từng tán lộc vừng rợp bóng hay dòng nước róc rách luồn qua khe đá đều được bảo bọc nguyên vẹn."}
                </p>
                <p className="italic text-[#7D5E4A] dark:text-[#D1A684] font-serif text-lg pt-2 border-l-2 border-[#7D5E4A]/40 pl-4">
                  {isEn
                    ? "&ldquo;To build is not to conquer, but to weave a sheltered terrace beneath the highland trees.&rdquo;"
                    : "&ldquo;Xây dựng không phải là chiếm đoạt, mà là thêu dệt một mái hiên che mưa nắng giữa rừng cây.&rdquo;"}
                </p>
              </div>

              {/* Story Fact Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-white dark:bg-[#1E2B22] border border-stone-200/80 dark:border-stone-700/60 shadow-sm flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#3E5C46]/10 text-[#3E5C46] dark:text-[#88B795] flex items-center justify-center shrink-0">
                    <Trees className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-[#1B281D] dark:text-white">
                      {isEn ? "Pristine Basalt Terrain" : "Địa hình bazan nguyên vẹn"}
                    </h3>
                    <p className="text-xs text-stone-600 dark:text-stone-400 mt-0.5">
                      {isEn ? "100% natural landscape preserved" : "Không can thiệp san lấp phá vỡ dòng chảy"}
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white dark:bg-[#1E2B22] border border-stone-200/80 dark:border-stone-700/60 shadow-sm flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#396663]/10 text-[#396663] dark:text-teal-400 flex items-center justify-center shrink-0">
                    <Heart className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-[#1B281D] dark:text-white">
                      {isEn ? "Living Eco Architecture" : "Kiến trúc xanh cộng sinh"}
                    </h3>
                    <p className="text-xs text-stone-600 dark:text-stone-400 mt-0.5">
                      {isEn ? "Local wood, bamboo, and thatched roofing" : "Gỗ tái sinh, tre nứa và mái tranh mộc mạc"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Visual Column */}
            <div className="lg:col-span-5 relative">
              <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white dark:border-stone-700/60 aspect-[4/5] relative">
                <img
                  src="/uploads/gallery/1788250253557-29323827.jpg"
                  alt="Không gian mộc mạc Cẩm Cù House"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent flex flex-col justify-end p-6 text-white">
                  <span className="text-xs text-emerald-300 font-semibold uppercase tracking-wider">
                    {isEn ? "The Story of Cam Cu" : "Chuyện Cẩm Cù"}
                  </span>
                  <p className="font-serif text-lg font-bold mt-1">
                    {isEn
                      ? "Gentle Morning Sunlight by the Flowing Stream"
                      : "Nắng Sớm Bên Dòng Suối Reo"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: Triết Lý Cà Phê Mộc & Ẩm Thực Lành */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 w-full border-t border-stone-200/70 dark:border-stone-800">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Visual Column */}
            <div className="lg:col-span-5 order-2 lg:order-1">
              <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white dark:border-stone-700/60 aspect-[4/5] relative">
                <img
                  src="/uploads/gallery/1788250253554-875120458.jpg"
                  alt="Hiên gỗ ven suối Cẩm Cù House"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent flex flex-col justify-end p-6 text-white">
                  <span className="text-xs text-emerald-300 font-semibold uppercase tracking-wider">
                    {isEn ? "Artisanal Craft" : "Rang Củi Thủ Công"}
                  </span>
                  <p className="font-serif text-lg font-bold mt-1">
                    {isEn
                      ? "Authentic Dak Nong Robusta Specialty"
                      : "Hạt Robusta Đắk Nông Thuần Khiết"}
                  </p>
                </div>
              </div>
            </div>

            {/* Text Column */}
            <div className="lg:col-span-7 order-1 lg:order-2 flex flex-col gap-5">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-[#7D5E4A] dark:text-[#E8A87C] uppercase tracking-wider">
                  {isEn ? "Coffee Craft" : "Khối 02"}
                </span>
                <span className="w-8 h-[2px] bg-[#7D5E4A]/30 dark:bg-[#E8A87C]/30" />
                <span className="text-xs text-stone-500 dark:text-stone-400">
                  {isEn ? "Local Highland Heritage" : "Hồn Cốt Nông Sản Cao Nguyên"}
                </span>
              </div>

              <h2 className="font-serif text-3xl sm:text-4xl text-[#3E5C46] dark:text-[#F5F4EE] font-bold leading-tight">
                {isEn
                  ? "Firewood-Roasted Robusta & Pure Local Mountain Produce"
                  : "Cà Phê Robusta Rang Củi Mộc & Nông Sản Bản Địa"}
              </h2>

              <div className="space-y-4 text-base text-stone-700 dark:text-stone-300 leading-relaxed">
                <p>
                  {isEn
                    ? "Dak Nong is globally renowned as the capital of specialty Robusta. At Cam Cu House, we say no to chemical additives, butter coatings, or artificial flavorings. Each coffee cherry is harvested at peak 100% ripeness, honey-processed, and hand-roasted over seasoned coffee wood."
                    : "Đắk Nông vốn là thủ phủ của những hạt Robusta phẩm chất cao nhất. Tại Cẩm Cù House, chúng tôi nói không với phụ gia, hương liệu bắp cau hay hóa chất. Từng quả cà phê chín mọng 100% được lên men tự nhiên và rang củi thủ công bằng than củi cà phê già."}
                </p>
                <p>
                  {isEn
                    ? "Besides artisanal coffee, our menu features local highland wellness sips like wild honey-soaked male papaya flower tea, 034 avocado smoothies, and hearty breakfasts that fuel adventurous travelers exploring the mountain passes."
                    : "Bên cạnh cà phê, ấm trà hoa đu đủ đực ngâm mật ong rừng, ly sinh tố bơ sáp 034 béo ngậy hay tô bò kho bánh mì nóng hổi ban mai đều mang theo hơi thở trong lành của núi rừng cao nguyên."}
                </p>
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <Link
                  href="/menu"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#3E5C46] text-white text-xs sm:text-sm font-semibold hover:bg-[#2D4233] transition-colors shadow-sm"
                >
                  <span>{dict.common.viewMenu}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/space"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white dark:bg-[#1E2B22] text-[#3E5C46] dark:text-[#88B795] text-xs sm:text-sm font-semibold border border-stone-200 dark:border-stone-700/60 hover:bg-stone-50 dark:hover:bg-white/10 transition-colors"
                >
                  <span>{dict.common.exploreStream}</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 3: Lời Mời Ghé Thăm */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 w-full">
          <div className="bg-[#3E5C46] dark:bg-[#18261D] rounded-3xl p-8 sm:p-12 text-white text-center flex flex-col items-center">
            <span className="text-emerald-200 text-xs font-semibold uppercase tracking-wider mb-2">
              {isEn ? "Highland Hospitality" : "Lời Hẹn Ước"}
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold max-w-2xl mb-4">
              {isEn
                ? "Cam Cu House Awaits Your Arrival Beside the Stream"
                : "Cẩm Cù House Chờ Đón Bạn Bên Bờ Suối Mát"}
            </h2>
            <p className="text-stone-200 text-sm sm:text-base max-w-xl mb-8 leading-relaxed">
              {dict.common.addressFull}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <a
                href="tel:0382851688"
                className="btn-press inline-flex items-center gap-2 px-7 py-3 rounded-full bg-white text-[#3E5C46] font-bold text-sm hover:bg-stone-100 transition-all shadow-md"
              >
                <PhoneCall className="w-4 h-4" />
                <span>{isEn ? "Call Hotline: 038 285 1688" : "Gọi Hotline: 038 285 1688"}</span>
              </a>
              <a
                href="https://maps.google.com/?q=Hem+437+Hung+Vuong+Nghia+Trung+Gia+Nghia+Dak+Nong"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-press inline-flex items-center gap-2 px-7 py-3 rounded-full bg-[#2D4233] text-white font-semibold text-sm hover:bg-[#1f2e23] border border-white/20 transition-all shadow-md"
              >
                <Navigation className="w-4 h-4 text-emerald-300" />
                <span>{dict.common.openGoogleMaps}</span>
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}