"use client";

import Link from "next/link";
import { motion } from "framer-motion";
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
  Trees,
  Car,
  Wifi,
  Zap,
  Coffee,
  PhoneCall,
  MapPin,
  Quote,
  CheckCircle2,
  Flower2,
  Waves
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="bg-[#F9F8F3] min-h-screen text-[#1B281D]">
      <Navbar />

      <main className="pt-20">
        {/* HERO SECTION WITH TRANQUIL STREAM PHOTO & SOFT OVERLAY */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
          <div className="relative rounded-3xl overflow-hidden min-h-[580px] sm:min-h-[640px] flex items-center shadow-xl border border-stone-200/60">
            {/* Background Stream Image */}
            <img
              src="/images/deck-landscape.png"
              alt="Cảnh sắc suối mộc Cẩm Cù House Gia Nghĩa"
              className="absolute inset-0 w-full h-full object-cover object-center"
            />
            {/* Soft Dark & Nature Gradient Overlay for High Contrast Text */}
            <div className="absolute inset-0 bg-gradient-to-r from-stone-950/85 via-stone-950/65 to-stone-900/40 backdrop-blur-[1px]" />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent" />

            {/* Foreground Content */}
            <div className="relative z-10 p-6 sm:p-12 lg:p-16 max-w-3xl flex flex-col gap-6">
              {/* Coordinate Eyebrow Badge */}
              <div className="inline-flex items-center gap-2 self-start px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-md text-emerald-200 text-xs font-semibold shadow-sm border border-white/20">
                <Compass className="w-4 h-4 text-emerald-300" />
                <span>TỌA ĐỘ 11.99° N, 107.69° E • GIA NGHĨA, ĐẮK NÔNG</span>
              </div>

              {/* Main Headline */}
              <div>
                <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-white font-bold tracking-tight leading-tight">
                  CẨM CÙ HOUSE
                </h1>
                <p className="font-serif text-xl sm:text-2xl lg:text-3xl text-emerald-100/90 italic font-normal mt-2">
                  Chốn Dừng Chân Mộc Mạc Bên Bờ Suối Đá
                </p>
              </div>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-stone-200 leading-relaxed max-w-2xl">
                Thưởng thức tách cà phê Robusta rang củi nguyên bản, lắng nghe dòng suối róc rách giữa thung lũng xanh thanh bình miền cao nguyên Đắk Nông.
              </p>

              {/* Trust Badges Strip */}
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md text-white text-xs font-medium border border-white/20">
                  <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                  100% Đề Xuất Hài Lòng
                </span>
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md text-white text-xs font-medium border border-white/20">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-300" />
                  Mức giá bình dân ($)
                </span>
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md text-white text-xs font-medium border border-white/20">
                  <Leaf className="w-3.5 h-3.5 text-emerald-300" />
                  Nguyên liệu xanh sạch
                </span>
              </div>

              {/* Balanced CTA Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  href="/space"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-[#3E5C46] text-white text-sm font-semibold hover:bg-[#2D4233] transition-all duration-300 shadow-[0_8px_20px_rgba(62,92,70,0.3)] hover:-translate-y-0.5"
                >
                  <span>Khám Phá Không Gian</span>
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/menu"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-white/95 backdrop-blur-sm text-stone-900 text-sm font-semibold hover:bg-white transition-all duration-300 shadow-md hover:-translate-y-0.5 border border-white/80"
                >
                  <UtensilsCrossed className="w-4 h-4 text-[#3E5C46]" />
                  <span>Xem Menu 50+ Món</span>
                </Link>
                <a
                  href="tel:0382851688"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-stone-800/80 backdrop-blur-sm text-white text-sm font-semibold hover:bg-stone-800 border border-white/20 shadow-md transition-all duration-300 hover:-translate-y-0.5"
                >
                  <PhoneCall className="w-4 h-4 text-emerald-300" />
                  <span>038 285 1688</span>
                </a>
              </div>

              {/* Real-time Atmospheric Meter Badge */}
              <div className="mt-2 inline-flex flex-wrap items-center gap-3 px-4 py-2.5 rounded-full bg-black/40 backdrop-blur-md border border-white/20 max-w-fit shadow-sm text-stone-200 text-xs">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                  </span>
                  <span className="text-stone-300 font-medium">Hiện tại bên suối:</span>
                </div>
                <div className="flex items-center gap-3 font-semibold text-white">
                  <span className="flex items-center gap-1">
                    <Thermometer className="w-3.5 h-3.5 text-emerald-300" /> 23°C
                  </span>
                  <span className="flex items-center gap-1">
                    <Wind className="w-3.5 h-3.5 text-emerald-300" /> Gió mát nhẹ
                  </span>
                  <span className="flex items-center gap-1">
                    <Droplets className="w-3.5 h-3.5 text-emerald-300" /> Nước trong veo
                  </span>
                </div>
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
                  src="/images/coffee-drink.png"
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
                  src="/images/fruit-tea.png"
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
                  src="/space/space-8.jpg"
                  alt="Sinh tố bơ sầu riêng 034"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-amber-700 text-white text-xs font-bold shadow-sm">
                  Đặc Sản Mùa
                </span>
              </div>
              <div>
                <div className="flex items-baseline justify-between mb-2">
                  <h3 className="font-serif text-lg font-bold text-[#1B281D]">
                    Sinh tố bơ sầu riêng
                  </h3>
                  <span className="text-base font-bold text-[#614633]">33.000đ</span>
                </div>
                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed mb-4">
                  Bơ sáp 034 dẻo quánh kết hợp cơm sầu riêng chín cây thơm nức mũi từ nương rẫy suối.
                </p>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-xs text-stone-500">
                <span>Trái cây tươi rói</span>
                <span className="text-[#3E5C46] font-medium">Có sẵn hôm nay</span>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 3: CURATED SPACE GALLERY PREVIEW */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#3E5C46]/10 text-[#3E5C46] text-xs font-semibold mb-3">
                <Trees className="w-3.5 h-3.5" />
                <span>Không Gian Sinh Thái</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#3E5C46] font-bold tracking-tight">
                Góc Bình Yên Bên Suối Reo
              </h2>
            </div>
            <Link
              href="/space"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#3E5C46] hover:text-[#2D4233] transition-colors"
            >
              <span>Xem 30+ góc ảnh không gian</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="relative rounded-2xl overflow-hidden aspect-[4/3] group shadow-sm">
              <img
                src="/space/space-3.jpg"
                alt="Hiên gỗ ngắm dòng suối tại Cẩm Cù House"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-transparent to-transparent flex items-end p-5">
                <span className="text-white text-sm font-medium font-serif">Hiên gỗ ngắm suối tự nhiên</span>
              </div>
            </div>

            <div className="relative rounded-2xl overflow-hidden aspect-[4/3] group shadow-sm">
              <img
                src="/space/space-4.jpg"
                alt="Bàn ghế mộc dưới tán cây"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-transparent to-transparent flex items-end p-5">
                <span className="text-white text-sm font-medium font-serif">Bàn đá rợp bóng mát cây rừng</span>
              </div>
            </div>

            <div className="relative rounded-2xl overflow-hidden aspect-[4/3] group shadow-sm">
              <img
                src="/space/space-6.jpg"
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
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-[#2D4233] text-white font-semibold text-sm hover:bg-[#1f2e23] border border-white/20 transition-all shadow-md hover:-translate-y-0.5"
              >
                <MapPin className="w-5 h-5 text-emerald-300" />
                <span>Xem Bản Đồ Chỉ Đường</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
