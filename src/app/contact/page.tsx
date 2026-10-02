"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  MapPin,
  Clock,
  PhoneCall,
  Mail,
  Navigation,
  Car,
  Share2,
  Trees,
  CheckCircle2,
  Compass,
  Headphones
} from "lucide-react";

export default function ContactPage() {
  return (
    <div className="bg-[#F9F8F3] min-h-screen text-[#1B281D]">
      <Navbar />

      <main className="pt-20">
        {/* Top Ambient Banner */}
        <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-14 pb-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-3xl flex flex-col gap-2">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-stone-100 w-fit text-[#3E5C46] text-xs font-semibold border border-stone-200">
                <Trees className="w-3.5 h-3.5 text-[#396663]" />
                <span>Khu Ẩm Thực &amp; Cà Phê Sinh Thái Bên Suối • Gia Nghĩa</span>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#3E5C46] tracking-tight">
                Từ Gia Nghĩa, Cẩm Cù House Chờ Đón Bạn
              </h1>
              <p className="text-base sm:text-lg text-stone-700 max-w-2xl leading-relaxed mt-1">
                Một chốn bình yên giấu mình bên dòng suối mát rượi, rất dễ tìm với đường ô tô rộng thoáng vào tận hiên quán. Mở Google Maps hoặc gọi hotline để được đón tiếp chu đáo nhất!
              </p>
            </div>

            {/* Quick Coordinate Badge */}
            <div className="hidden lg:flex items-center gap-3 bg-white/90 backdrop-blur-sm p-4 rounded-2xl border border-stone-200 shadow-sm">
              <div className="w-10 h-10 rounded-full bg-[#396663]/15 flex items-center justify-center text-[#396663]">
                <Compass className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] text-stone-500 uppercase tracking-wider font-semibold">
                  Tọa độ cao nguyên
                </span>
                <span className="text-sm text-[#3E5C46] font-bold">
                  11.99° N, 107.69° E
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* 2-Column Balanced Core Section */}
        <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Detailed Information */}
            <div className="lg:col-span-6 flex flex-col gap-6">
              {/* Address Card */}
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-stone-200/60 shadow-sm flex flex-col gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#3E5C46]/10 text-[#3E5C46] flex items-center justify-center shrink-0">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#396663]">
                      Địa Chỉ Tìm Đến
                    </span>
                    <p className="font-serif text-xl sm:text-2xl font-bold text-[#1B281D] leading-snug mt-1">
                      Hẻm 437 Hùng Vương, Phường Nghĩa Trung, Thành phố Gia Nghĩa, Tỉnh Đắk Nông
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 text-stone-700 flex items-start gap-3">
                  <Car className="w-5 h-5 text-[#3E5C46] shrink-0 mt-0.5" />
                  <p className="text-xs sm:text-sm leading-relaxed">
                    <strong className="text-[#1B281D] font-semibold">Lối vào thuận tiện:</strong> Đường bê tông rộng rãi, xe ô tô 4 – 16 chỗ vào quay đầu tận sân hiên quán an toàn và thoải mái.
                  </p>
                </div>
              </div>

              {/* Hours Card */}
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-stone-200/60 shadow-sm flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#396663]/10 text-[#396663] flex items-center justify-center shrink-0">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#396663]">
                      Thời Gian Đón Khách
                    </span>
                    <span className="text-xs text-stone-500">
                      Phục vụ điểm tâm, bữa chính &amp; specialty coffee
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 flex flex-col gap-1">
                    <span className="text-xs text-[#614633] uppercase font-bold">Thứ 2 – Thứ 5</span>
                    <span className="font-serif text-xl text-[#3E5C46] font-bold">07:00 – 18:00</span>
                    <span className="text-[11px] text-stone-500">Không gian tĩnh dưỡng ban ngày</span>
                  </div>
                  <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200/60 flex flex-col gap-1">
                    <span className="text-xs text-[#396663] font-bold uppercase">Thứ 6 – Chủ Nhật</span>
                    <span className="font-serif text-xl text-[#396663] font-bold">07:00 – 22:00</span>
                    <span className="text-[11px] text-stone-500">Trà thơm, lửa trại &amp; nhạc bên suối</span>
                  </div>
                </div>
              </div>

              {/* Hotline Reception & Mail */}
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-stone-200/60 shadow-sm flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#614633]/10 text-[#614633] flex items-center justify-center shrink-0">
                    <Headphones className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#614633]">
                      Hotline Đón Tiếp &amp; Hỗ Trợ
                    </span>
                    <p className="text-xs text-stone-500">Trực máy hỗ trợ chu đáo mọi khung giờ</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <a
                    href="tel:0382851688"
                    className="p-4 rounded-xl bg-stone-50 hover:bg-stone-100 border border-stone-200 transition-colors flex items-center justify-between group"
                  >
                    <div className="flex flex-col">
                      <span className="text-xs text-stone-500">Hotline 1 (Zalo)</span>
                      <span className="text-base font-bold text-[#3E5C46]">038 285 1688</span>
                    </div>
                    <PhoneCall className="w-4 h-4 text-[#3E5C46] group-hover:scale-110 transition-transform" />
                  </a>

                  <a
                    href="tel:0774659000"
                    className="p-4 rounded-xl bg-stone-50 hover:bg-stone-100 border border-stone-200 transition-colors flex items-center justify-between group"
                  >
                    <div className="flex flex-col">
                      <span className="text-xs text-stone-500">Hotline 2</span>
                      <span className="text-base font-bold text-[#3E5C46]">077 465 9000</span>
                    </div>
                    <PhoneCall className="w-4 h-4 text-[#3E5C46] group-hover:scale-110 transition-transform" />
                  </a>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-stone-200 text-xs text-stone-600">
                  <span>Quốc tế: <strong className="text-[#1B281D]">+84 38 285 1688</strong></span>
                  <a
                    href="mailto:thuynhu8788@gmail.com"
                    className="text-[#614633] font-semibold hover:underline flex items-center gap-1.5"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>thuynhu8788@gmail.com</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Right Column: Direction CTA & Social Channels */}
            <div className="lg:col-span-6 flex flex-col gap-6">
              {/* Google Maps Primary CTA Card */}
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border-2 border-[#3E5C46]/30 shadow-sm flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#3E5C46] text-white flex items-center justify-center shrink-0 shadow-sm">
                    <Navigation className="w-6 h-6" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#396663]">
                      Dẫn Đường Trực Tuyến
                    </span>
                    <h2 className="font-serif text-2xl font-bold text-[#3E5C46]">
                      Chỉ Đường &amp; Định Vị Tới Quán
                    </h2>
                  </div>
                </div>

                <p className="text-base text-stone-700 leading-relaxed">
                  Quán tọa lạc tại Hẻm 437 Hùng Vương, Phường Nghĩa Trung, TP. Gia Nghĩa. Tuyến đường bê tông sạch sẽ, bằng phẳng, ô tô vào tận bãi đỗ xe trong khuôn viên quán.
                </p>

                <div className="pt-2">
                  <a
                    href="https://maps.google.com/?q=Hem+437+Hung+Vuong+Nghia+Trung+Gia+Nghia+Dak+Nong"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-4 px-6 rounded-full bg-[#3E5C46] text-white text-sm font-bold hover:bg-[#2D4233] transition-all shadow-[0_6px_20px_rgba(62,92,70,0.25)] flex items-center justify-center gap-2 active:scale-[0.99]"
                  >
                    <Navigation className="w-4 h-4" />
                    <span>Mở Chỉ Đường Trên Google Maps</span>
                  </a>
                </div>
              </div>

              {/* Social Channels Card */}
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-stone-200/60 shadow-sm flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#396663]/10 text-[#396663] flex items-center justify-center shrink-0">
                    <Share2 className="w-6 h-6" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#396663]">
                      Cộng Đồng &amp; Khoảnh Khắc
                    </span>
                    <h3 className="font-serif text-xl font-bold text-[#3E5C46]">
                      Kết Nối Mạng Xã Hội
                    </h3>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-stone-600">
                  Cùng ngắm nhìn suối biếc, hoa cẩm cù và nhịp sống bình dị miền đất đỏ qua các kênh chính thức của Cẩm Cù House:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  <a
                    href="https://www.facebook.com/share/1DVLMySW8H/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-4 rounded-xl bg-stone-50 border border-stone-200 hover:bg-[#3E5C46] hover:text-white transition-all flex flex-col items-center justify-center gap-1.5 text-center group"
                  >
                    <Share2 className="w-6 h-6 text-[#396663] group-hover:text-white transition-colors" />
                    <span className="text-xs font-bold">Facebook</span>
                    <span className="text-[11px] text-stone-500 group-hover:text-white/80 transition-colors">
                      Cẩm Cù House
                    </span>
                  </a>

                  <a
                    href="https://www.tiktok.com/@camcuhousedaknong"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-4 rounded-xl bg-stone-50 border border-stone-200 hover:bg-[#3E5C46] hover:text-white transition-all flex flex-col items-center justify-center gap-1.5 text-center group"
                  >
                    <span className="font-bold text-lg leading-none">TT</span>
                    <span className="text-xs font-bold">TikTok</span>
                    <span className="text-[11px] text-stone-500 group-hover:text-white/80 transition-colors truncate max-w-full">
                      @camcuhouse...
                    </span>
                  </a>

                  <a
                    href="https://youtube.com/@Cam_Cu_House"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-4 rounded-xl bg-stone-50 border border-stone-200 hover:bg-[#3E5C46] hover:text-white transition-all flex flex-col items-center justify-center gap-1.5 text-center group"
                  >
                    <svg className="w-6 h-6 text-red-600 group-hover:text-white transition-colors" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                    <span className="text-xs font-bold">YouTube</span>
                    <span className="text-[11px] text-stone-500 group-hover:text-white/80 transition-colors">
                      @Cam_Cu_House
                    </span>
                  </a>
                </div>
              </div>

              {/* Sanctuary Etiquette Card */}
              <div className="p-6 rounded-2xl bg-stone-100/90 border border-stone-200 flex items-start gap-4 shadow-sm">
                <Trees className="w-6 h-6 text-[#614633] shrink-0 mt-0.5" />
                <div className="flex flex-col gap-1.5 text-xs text-stone-700 leading-relaxed">
                  <span className="font-serif text-base font-bold text-[#3E5C46]">
                    Quy ước nhỏ cùng đại ngàn
                  </span>
                  <ul className="space-y-1.5 mt-1">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#3E5C46] shrink-0" />
                      <span>Xin không xả rác hay túi nilon xuống dòng suối tự nhiên.</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#3E5C46] shrink-0" />
                      <span>Giữ âm lượng vừa phải để giữ trọn thanh âm của chim rừng và tiếng nước chảy.</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#3E5C46] shrink-0" />
                      <span>Đường vào rộng, có bãi đậu xe ô tô 4-16 chỗ miễn phí trong khuôn viên quán.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Visual Route Preview Section */}
        <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-stone-200/60 shadow-sm flex flex-col gap-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-stone-200">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#396663]">
                  Chỉ Dẫn Không Gian &amp; Tọa Độ
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#3E5C46] mt-1">
                  Bản Đồ Định Vị &amp; Lối Vào Rợp Mát Cẩm Cù House
                </h2>
                <p className="text-xs sm:text-sm text-stone-600 mt-1">
                  Tọa lạc tại Phường Nghĩa Trung, chỉ cách trung tâm thành phố Gia Nghĩa vài phút chạy xe.
                </p>
              </div>

              <a
                href="https://maps.google.com/?q=Hem+437+Hung+Vuong+Nghia+Trung+Gia+Nghia+Dak+Nong"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#3E5C46] text-white text-xs font-semibold hover:bg-[#2D4233] transition-all shadow-sm shrink-0"
              >
                <Navigation className="w-4 h-4" />
                <span>Mở chỉ đường Google Maps</span>
              </a>
            </div>

            {/* Bento-style imagery */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative rounded-2xl overflow-hidden aspect-[16/10] group border border-stone-200">
                <img
                  src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80"
                  alt="Lối rợp bóng mát vào Cẩm Cù House"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent flex items-end p-4">
                  <div className="text-white flex flex-col">
                    <span className="text-xs font-bold text-emerald-200">Khung Cảnh 01</span>
                    <span className="font-serif text-base sm:text-lg font-bold">
                      Lối Rợp Bóng Cây Vào Hiên Quán
                    </span>
                  </div>
                </div>
              </div>

              <div className="relative rounded-2xl overflow-hidden aspect-[16/10] group border border-stone-200">
                <img
                  src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1000&q=80"
                  alt="Bàn gỗ bên bờ suối đá mát lành"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent flex items-end p-4">
                  <div className="text-white flex flex-col">
                    <span className="text-xs font-bold text-emerald-200">Khung Cảnh 02</span>
                    <span className="font-serif text-base sm:text-lg font-bold">
                      Bàn Gỗ Bên Suối Đá Mát Lành
                    </span>
                  </div>
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
