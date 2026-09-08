"use client";

import React from "react";
import Image from "next/image";
import {
  MapPin,
  Phone,
  Clock,
  MessageCircle,
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
    <div className="w-full bg-[#FDFBF7] text-[#222222]">
      {/* ========================================================= */}
      {/* 1. HEADER: GHÉ CHƠI CÙNG CHÚNG TÔI                        */}
      {/* ========================================================= */}
      <section className="py-20 sm:py-28 px-6 sm:px-12 text-center border-b border-[#EAE6DF] bg-[#F7F4EE]">
        <div className="max-w-3xl mx-auto space-y-4">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#2D4A3E]/10 border border-[#2D4A3E]/20 text-xs font-semibold text-[#2D4A3E]">
            <Compass size={14} className="text-[#C88A4B]" />
            <span>ĐÓN TIẾP NỒNG HẬU</span>
          </span>

          <h1 className="font-serif text-4xl sm:text-6xl font-bold text-[#2D4A3E] tracking-tight">
            Ghé Chơi Cùng Chúng Tôi
          </h1>

          <p className="text-base sm:text-lg font-light text-[#222222]/80 leading-relaxed">
            Chỉ cần một cuộc gọi hay một tin nhắn, góc hiên gỗ ấm áp bên suối đá
            luôn sẵn sàng chào đón bạn.
          </p>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 2. KHỐI THÔNG TIN TRỰC QUAN 4 CỘT                         */}
      {/* ========================================================= */}
      <section className="py-16 sm:py-20 px-6 sm:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* CỘT 1: ĐỊA CHỈ */}
          <div className="bg-white p-7 rounded-3xl border border-[#EAE6DF] shadow-sm hover:border-[#C88A4B] transition-colors flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#2D4A3E]/10 flex items-center justify-center text-2xl">
                <span>📍</span>
              </div>
              <h3 className="font-serif font-bold text-lg text-[#2D4A3E]">
                Địa Chỉ Quán
              </h3>
              <p className="text-xs sm:text-sm font-light text-[#222222]/80 leading-relaxed">
                Hẻm 437 Hùng Vương, P. Nghĩa Trung, TP Gia Nghĩa, Đắk Nông.
              </p>
            </div>
            <a
              href={GOOGLE_MAPS_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-[#C88A4B] hover:text-[#B3763A] pt-2 border-t border-[#EAE6DF]"
            >
              <span>Xem vị trí quán</span>
              <ArrowUpRight size={14} />
            </a>
          </div>

          {/* CỘT 2: HOTLINE (CHẠM LÀ GỌI NGAY) */}
          <div className="bg-white p-7 rounded-3xl border border-[#EAE6DF] shadow-sm hover:border-[#C88A4B] transition-colors flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#2D4A3E]/10 flex items-center justify-center text-2xl">
                <span>📞</span>
              </div>
              <h3 className="font-serif font-bold text-lg text-[#2D4A3E]">
                Hotline (Bấm Gọi Ngay)
              </h3>
              <div className="space-y-2 pt-1">
                <a
                  href="tel:0382851688"
                  className="flex items-center justify-between p-2.5 rounded-xl bg-[#FDFBF7] border border-[#EAE6DF] hover:border-[#2D4A3E] transition-all group"
                >
                  <span className="text-xs sm:text-sm font-bold text-[#2D4A3E] group-hover:text-[#C88A4B]">
                    038 285 1688
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#2D4A3E] text-white font-medium">
                    Gọi máy 1
                  </span>
                </a>

                <a
                  href="tel:0774659000"
                  className="flex items-center justify-between p-2.5 rounded-xl bg-[#FDFBF7] border border-[#EAE6DF] hover:border-[#2D4A3E] transition-all group"
                >
                  <span className="text-xs sm:text-sm font-bold text-[#2D4A3E] group-hover:text-[#C88A4B]">
                    077 465 9000
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#C88A4B] text-white font-medium">
                    Gọi máy 2
                  </span>
                </a>
              </div>
            </div>
            <p className="text-[11px] text-[#2D4A3E]/70 border-t border-[#EAE6DF] pt-2 font-medium">
              Chạm vào số để liên hệ tức thì
            </p>
          </div>

          {/* CỘT 3: GIỜ MỞ CỬA */}
          <div className="bg-white p-7 rounded-3xl border border-[#EAE6DF] shadow-sm hover:border-[#C88A4B] transition-colors flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#2D4A3E]/10 flex items-center justify-center text-2xl">
                <span>⏰</span>
              </div>
              <h3 className="font-serif font-bold text-lg text-[#2D4A3E]">
                Giờ Mở Cửa
              </h3>
              <div className="space-y-2 text-xs sm:text-sm font-light text-[#222222]/80 leading-relaxed">
                <div className="p-2 rounded-xl bg-[#FDFBF7] border border-[#EAE6DF]">
                  <p className="font-medium text-[#2D4A3E]">Thứ 2 - Thứ 5:</p>
                  <p className="text-[#C88A4B] font-semibold">07:00 - 18:00</p>
                </div>
                <div className="p-2 rounded-xl bg-[#FDFBF7] border border-[#EAE6DF]">
                  <p className="font-medium text-[#2D4A3E]">Thứ 6 - Chủ Nhật:</p>
                  <p className="text-[#C88A4B] font-semibold">07:00 - 22:00</p>
                </div>
              </div>
            </div>
            <p className="text-[11px] text-[#C88A4B] border-t border-[#EAE6DF] pt-2 font-medium">
              Mở cửa tất cả các ngày trong tuần
            </p>
          </div>

          {/* CỘT 4: KÊNH KẾT NỐI (EMAIL, FACEBOOK, ZALO) */}
          <div className="bg-white p-7 rounded-3xl border border-[#EAE6DF] shadow-sm hover:border-[#C88A4B] transition-colors flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#2D4A3E]/10 flex items-center justify-center text-2xl">
                <span>💬</span>
              </div>
              <h3 className="font-serif font-bold text-lg text-[#2D4A3E]">
                Kênh Kết Nối
              </h3>
              
              <div className="space-y-2 pt-1">
                <a
                  href="mailto:thuynhu8788@gmail.com"
                  className="block p-2 rounded-xl bg-[#FDFBF7] border border-[#EAE6DF] text-xs text-[#222222]/80 hover:text-[#2D4A3E] break-all truncate"
                >
                  <span className="font-medium text-[#2D4A3E] block text-[11px]">Email:</span>
                  thuynhu8788@gmail.com
                </a>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noreferrer"
                    className="py-2 px-3 rounded-xl bg-[#1877F2]/10 hover:bg-[#1877F2]/20 text-[#1877F2] text-xs font-semibold text-center transition-colors"
                  >
                    Facebook
                  </a>
                  <a
                    href="https://zalo.me/0382851688"
                    target="_blank"
                    rel="noreferrer"
                    className="py-2 px-3 rounded-xl bg-[#0068FF]/10 hover:bg-[#0068FF]/20 text-[#0068FF] text-xs font-semibold text-center transition-colors"
                  >
                    Zalo
                  </a>
                </div>
              </div>
            </div>

            <p className="text-[11px] text-[#2D4A3E]/70 border-t border-[#EAE6DF] pt-2 font-medium">
              Nhắn tin phản hồi nhanh chóng
            </p>
          </div>

        </div>
      </section>

      {/* ========================================================= */}
      {/* 3. BẢN ĐỒ GOOGLE MAPS TƯƠNG TÁC TRÀN VIỀN                 */}
      {/* ========================================================= */}
      <section className="w-full border-t border-b border-[#EAE6DF] bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <span className="text-xs font-mono uppercase tracking-widest text-[#C88A4B] font-semibold">
              ĐỊnh VỊ TRỰC TUYẾN
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#2D4A3E]">
              Bản Đồ Đến Cẩm Cù House
            </h2>
            <p className="text-xs sm:text-sm font-light text-[#222222]/75">
              Ghim tọa độ chính xác: Hẻm 437 Hùng Vương, Phường Nghĩa Trung, TP Gia Nghĩa.
            </p>
          </div>

          {/* NÚT BẤM LỚN NỔI BẬT: CHỈ ĐƯỜNG TRÊN GOOGLE MAPS */}
          <a
            href={GOOGLE_MAPS_URL}
            target="_blank"
            rel="noreferrer"
            className="px-8 py-4 rounded-full bg-[#2D4A3E] hover:bg-[#1F342B] text-white text-sm sm:text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-3 shrink-0 active:scale-98"
          >
            <Navigation size={18} className="text-[#C88A4B]" />
            <span>Chỉ đường trên Google Maps</span>
            <ArrowUpRight size={16} />
          </a>
        </div>

        {/* Iframe bản đồ tương tác tràn viền */}
        <div className="w-full h-[420px] sm:h-[500px] relative bg-[#EAE6DF]">
          <iframe
            title="Vị trí Cẩm Cù House trên Google Maps"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15582.493822184136!2d107.68536894999999!3d11.99026775!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3173fe8e0e7a25b1%3A0x9330a10df768f565!2zQ-G6q20gQ8O5IEhvdXNl!5e0!3m2!1svi!2svn!4v1700000000000!5m2!1svi!2svn"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen={false}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full h-full"
          ></iframe>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 4. KHU VỰC ẢNH LỐI VÀO QUÁN VÀ BÃI ĐỖ XE                  */}
      {/* ========================================================= */}
      <section className="py-20 sm:py-24 px-6 sm:px-12 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
          <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#C88A4B] font-semibold">
            AN TÂM KHI GHÉ
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#2D4A3E]">
            Lối Vào &amp; Bãi Đậu Xe Thuận Tiện
          </h2>
          <p className="text-xs sm:text-sm font-light text-[#222222]/75">
            Đường đi êm ái, bãi đậu xe rộng rãi cho cả xe máy và ô tô mọi kích cỡ.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {ENTRANCE_PARKING_PHOTOS.map((spot, idx) => (
            <div
              key={idx}
              className="card-warm overflow-hidden bg-white p-5 rounded-3xl border border-[#EAE6DF] space-y-4 flex flex-col justify-between"
            >
              <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-[#FDFBF7]">
                <Image
                  src={spot.image}
                  alt={spot.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover hover:scale-104 transition-transform duration-500 ease-out"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#2D4A3E]">
                  {idx === 0 ? <ShieldCheck size={16} className="text-[#C88A4B]" /> : <Car size={16} className="text-[#C88A4B]" />}
                  <span>{idx === 0 ? "LỐI VÀO RỘNG RÃI" : "BÃI XE AN TOÀN"}</span>
                </div>
                <h3 className="font-serif text-xl font-bold text-[#2D4A3E]">
                  {spot.title}
                </h3>
                <p className="text-xs sm:text-sm font-light text-[#222222]/75 leading-relaxed">
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
