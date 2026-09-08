"use client";

import React from "react";
import Image from "next/image";
import {
  MapPin,
  Phone,
  Clock,
  Mail,
  ArrowUpRight,
  Navigation,
  Compass,
  Car,
  ShieldCheck,
} from "lucide-react";

const GOOGLE_MAPS_URL =
  "https://maps.google.com/?cid=10605553198031545365&q=C%E1%BA%A9m+C%C3%B9+House";

const ENTRANCE_PARKING_PHOTOS = [
  {
    title: "Lối Vào Quán Rợp Bóng Mát",
    desc: "Đường hẻm rộng rãi, rải đá mộc mạc dẫn thẳng vào không gian suối đá Cẩm Cù.",
    image: "/uploads/gallery/1788250253566-618481408.jpg",
  },
  {
    title: "Bãi Đậu Xe Ô Tô & Xe Máy Thoải Mái",
    desc: "Khu đất bằng phẳng, an ninh, có người hỗ trợ hướng dẫn và thuận tiện quay đầu xe.",
    image: "/uploads/gallery/1788250253554-875120458.jpg",
  },
];

export default function ContactPage() {
  return (
    <div className="w-full text-[#FDFBF7]">
      {/* ========================================================= */}
      {/* 1. HEADER: TỪ GIA NGHĨA, TÔI CHỜ ĐÓN BẠN                  */}
      {/* ========================================================= */}
      <section className="relative py-28 sm:py-36 px-6 sm:px-12 text-center border-b border-[#222520]">
        <div className="max-w-4xl mx-auto space-y-6">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1A1D17] border border-[#222520] text-xs font-mono text-[#C88A4B]">
            <Compass size={14} />
            <span>TỌA ĐỘ 11.99° N, 107.69° E • GIA NGHĨA</span>
          </span>

          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold text-[#FDFBF7] tracking-tight leading-tight">
            TỪ GIA NGHĨA, <br />
            <span className="text-[#C88A4B] italic">TÔI CHỜ ĐÓN BẠN.</span>
          </h1>

          <p className="text-base sm:text-lg font-light text-[#FDFBF7]/80 max-w-2xl mx-auto leading-relaxed">
            Dù bạn đến từ bất kỳ đâu, Cẩm Cù House luôn dành sẵn một góc hiên nhà
            mộc mạc, tiếng suối reo và tách cà phê ấm chờ bạn ghé thăm.
          </p>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 2. KHỐI THÔNG TIN TRỰC QUAN 4 CỘT (CHẠM LÀ GỌI / KẾT NỐI) */}
      {/* ========================================================= */}
      <section className="py-20 px-6 sm:px-12 max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* CỘT 1: ĐỊA CHỈ */}
          <div className="card-dark p-7 rounded-3xl flex flex-col justify-between space-y-4 hover:border-[#C88A4B] transition-colors">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#1A1D17] border border-[#222520] flex items-center justify-center text-2xl">
                <span>📍</span>
              </div>
              <h3 className="font-serif font-bold text-lg text-[#FDFBF7]">
                Địa Chỉ Quán
              </h3>
              <p className="text-xs sm:text-sm font-light text-[#FDFBF7]/75 leading-relaxed">
                Hẻm 437 Hùng Vương, P. Nghĩa Trung, TP Gia Nghĩa, Đắk Nông.
              </p>
            </div>
            <a
              href={GOOGLE_MAPS_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-[#C88A4B] hover:underline pt-2 border-t border-[#222520]"
            >
              <span>Xem vị trí quán</span>
              <ArrowUpRight size={14} />
            </a>
          </div>

          {/* CỘT 2: HOTLINE (CHẠM LÀ GỌI NGAY) */}
          <div className="card-dark p-7 rounded-3xl flex flex-col justify-between space-y-4 hover:border-[#C88A4B] transition-colors">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#1A1D17] border border-[#222520] flex items-center justify-center text-2xl">
                <span>📞</span>
              </div>
              <h3 className="font-serif font-bold text-lg text-[#FDFBF7]">
                Hotline (Bấm Gọi Ngay)
              </h3>
              <div className="space-y-2 pt-1">
                <a
                  href="tel:0382851688"
                  className="flex items-center justify-between p-2.5 rounded-xl bg-[#1A1D17] border border-[#222520] hover:border-[#C88A4B] transition-all group"
                >
                  <span className="text-xs sm:text-sm font-bold text-[#FDFBF7] group-hover:text-[#C88A4B]">
                    038 285 1688
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#2D4A3E] text-[#FDFBF7] font-medium">
                    Gọi máy 1
                  </span>
                </a>

                <a
                  href="tel:0774659000"
                  className="flex items-center justify-between p-2.5 rounded-xl bg-[#1A1D17] border border-[#222520] hover:border-[#C88A4B] transition-all group"
                >
                  <span className="text-xs sm:text-sm font-bold text-[#FDFBF7] group-hover:text-[#C88A4B]">
                    077 465 9000
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#C88A4B] text-[#0C0D0B] font-bold">
                    Gọi máy 2
                  </span>
                </a>
              </div>
            </div>
            <p className="text-[11px] text-[#C88A4B] border-t border-[#222520] pt-2 font-mono">
              Chạm số để liên hệ tức thì
            </p>
          </div>

          {/* CỘT 3: GIỜ MỞ CỬA */}
          <div className="card-dark p-7 rounded-3xl flex flex-col justify-between space-y-4 hover:border-[#C88A4B] transition-colors">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#1A1D17] border border-[#222520] flex items-center justify-center text-2xl">
                <span>⏰</span>
              </div>
              <h3 className="font-serif font-bold text-lg text-[#FDFBF7]">
                Giờ Mở Cửa
              </h3>
              <div className="space-y-2 text-xs sm:text-sm font-light text-[#FDFBF7]/80 leading-relaxed">
                <div className="p-2 rounded-xl bg-[#1A1D17] border border-[#222520]">
                  <p className="font-medium text-[#FDFBF7]">Thứ 2 - Thứ 5:</p>
                  <p className="text-[#C88A4B] font-mono font-semibold">07:00 - 18:00</p>
                </div>
                <div className="p-2 rounded-xl bg-[#1A1D17] border border-[#222520]">
                  <p className="font-medium text-[#FDFBF7]">Thứ 6 - Chủ Nhật:</p>
                  <p className="text-[#C88A4B] font-mono font-semibold">07:00 - 22:00</p>
                </div>
              </div>
            </div>
            <p className="text-[11px] text-[#C88A4B] border-t border-[#222520] pt-2 font-mono">
              Mở cửa đón khách quanh năm
            </p>
          </div>

          {/* CỘT 4: KÊNH KẾT NỐI */}
          <div className="card-dark p-7 rounded-3xl flex flex-col justify-between space-y-4 hover:border-[#C88A4B] transition-colors">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#1A1D17] border border-[#222520] flex items-center justify-center text-2xl">
                <span>💬</span>
              </div>
              <h3 className="font-serif font-bold text-lg text-[#FDFBF7]">
                Kênh Kết Nối
              </h3>
              
              <div className="space-y-2 pt-1">
                <a
                  href="mailto:thuynhu8788@gmail.com"
                  className="block p-2 rounded-xl bg-[#1A1D17] border border-[#222520] text-xs text-[#FDFBF7]/80 hover:text-[#C88A4B] truncate"
                >
                  <span className="text-[#C88A4B] block text-[10px] font-mono">EMAIL:</span>
                  thuynhu8788@gmail.com
                </a>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noreferrer"
                    className="py-2 px-3 rounded-xl bg-[#1877F2]/20 hover:bg-[#1877F2]/30 text-[#1877F2] text-xs font-semibold text-center transition-colors"
                  >
                    Facebook
                  </a>
                  <a
                    href="https://zalo.me/0382851688"
                    target="_blank"
                    rel="noreferrer"
                    className="py-2 px-3 rounded-xl bg-[#0068FF]/20 hover:bg-[#0068FF]/30 text-[#0068FF] text-xs font-semibold text-center transition-colors"
                  >
                    Zalo
                  </a>
                </div>
              </div>
            </div>

            <p className="text-[11px] text-[#C88A4B] border-t border-[#222520] pt-2 font-mono">
              Nhắn tin phản hồi nhanh chóng
            </p>
          </div>

        </div>
      </section>

      {/* ========================================================= */}
      {/* 3. BẢN ĐỒ GOOGLE MAPS TƯƠNG TÁC CÓ NÚT CHỈ ĐƯỜNG TRỰC TIẾP */}
      {/* ========================================================= */}
      <section className="w-full border-t border-b border-[#222520] relative z-10 bg-[#0C0D0B]/90">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <span className="text-xs font-mono uppercase tracking-widest text-[#C88A4B] font-semibold">
              ĐỊNH VỊ TRỰC TUYẾN
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#FDFBF7]">
              Bản Đồ Đến Cẩm Cù House
            </h2>
            <p className="text-xs sm:text-sm font-light text-[#FDFBF7]/70">
              Ghim tọa độ chính xác: Hẻm 437 Hùng Vương, Phường Nghĩa Trung, TP Gia Nghĩa.
            </p>
          </div>

          {/* NÚT BẤM LỚN NỔI BẬT: CHỈ ĐƯỜNG TRỰC TIẾP */}
          <a
            href={GOOGLE_MAPS_URL}
            target="_blank"
            rel="noreferrer"
            className="px-8 py-4 rounded-full bg-[#C88A4B] hover:bg-[#b87c40] text-[#0C0D0B] text-sm sm:text-base font-bold shadow-lg transition-all duration-200 flex items-center gap-3 shrink-0 active:scale-98"
          >
            <Navigation size={18} />
            <span>Chỉ đường trực tiếp trên Google Maps</span>
            <ArrowUpRight size={16} />
          </a>
        </div>

        {/* Iframe bản đồ tương tác tràn viền */}
        <div className="w-full h-[420px] sm:h-[500px] relative bg-[#1A1D17]">
          <iframe
            title="Vị trí Cẩm Cù House trên Google Maps"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15582.493822184136!2d107.68536894999999!3d11.99026775!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3173fe8e0e7a25b1%3A0x9330a10df768f565!2zQ-G6q20gQ8O5IEhvdXNl!5e0!3m2!1svi!2svn!4v1700000000000!5m2!1svi!2svn"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen={false}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full h-full grayscale-[30%] hover:grayscale-0 transition-all duration-500"
          ></iframe>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 4. KHU VỰC ẢNH LỐI VÀO QUÁN VÀ BÃI ĐỖ XE                  */}
      {/* ========================================================= */}
      <section className="py-24 px-6 sm:px-12 max-w-7xl mx-auto relative z-10">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
          <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#C88A4B] font-semibold">
            AN TÂM KHI GHÉ
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#FDFBF7]">
            Lối Vào &amp; Bãi Đậu Xe Thuận Tiện
          </h2>
          <p className="text-xs sm:text-sm font-light text-[#FDFBF7]/70">
            Đường đi êm ái, bãi đậu xe rộng rãi cho cả xe máy và ô tô mọi kích cỡ.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {ENTRANCE_PARKING_PHOTOS.map((spot, idx) => (
            <div
              key={idx}
              className="card-dark overflow-hidden p-5 rounded-3xl space-y-4 flex flex-col justify-between"
            >
              <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-[#1A1D17]">
                <Image
                  src={spot.image}
                  alt={spot.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover hover:scale-104 transition-transform duration-500 ease-out"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#C88A4B]">
                  {idx === 0 ? <ShieldCheck size={16} /> : <Car size={16} />}
                  <span>{idx === 0 ? "LỐI VÀO RỘNG RÃI" : "BÃI XE AN TOÀN"}</span>
                </div>
                <h3 className="font-serif text-xl font-bold text-[#FDFBF7]">
                  {spot.title}
                </h3>
                <p className="text-xs sm:text-sm font-light text-[#FDFBF7]/70 leading-relaxed">
                  {spot.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
