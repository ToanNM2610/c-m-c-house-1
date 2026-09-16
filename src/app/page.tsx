"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

export default function HomePage() {
  return (
    <div className="w-full text-[#FDFBF7] relative z-10 bg-[#0C0D0B]">
      
      {/* =========================================
          SECTION 1: HERO ĐIỆN ẢNH
      ========================================= */}
      <section className="relative w-full min-h-screen flex flex-col items-center justify-center px-6 pt-20">
        {/* Background gradient hint */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#c88a4b]/5 via-[#0a0705]/80 to-[#0a0705] z-0 pointer-events-none"></div>

        <div className="flex flex-col items-center text-center relative z-10">
          <span className="font-sans text-xs tracking-[0.25em] uppercase text-[#C88A4B] font-medium block mb-8">
            TỌA ĐỘ 11.99° N, 107.69° E • GIA NGHĨA, ĐẮK NÔNG
          </span>
          <h1 className="font-serif text-5xl md:text-7xl font-semibold uppercase mb-6 text-[#F5EFEB] drop-shadow-lg">
            CẨM CÙ HOUSE
          </h1>
          <p className="font-sans text-lg sm:text-xl font-light text-[#FDFBF7]/80 leading-relaxed max-w-lg mb-16">
            Coffee & Food • Chốn dừng chân mộc mạc bên bờ suối đá.
          </p>

          <div className="flex flex-col sm:flex-row gap-6">
            <Link
              href="/space"
              className="inline-flex items-center justify-center px-10 py-4 bg-[#C88A4B] text-[#0a0705] font-sans font-medium rounded-full shadow-lg hover:shadow-[#C88A4B]/20 hover:-translate-y-1 transition-all duration-300"
            >
              Khám Phá Không Gian
            </Link>
            <Link
              href="/menu"
              className="inline-flex items-center justify-center px-10 py-4 bg-transparent border border-[#F5EFEB]/30 text-[#F5EFEB] font-sans font-medium rounded-full hover:bg-[#FDFBF7]/10 hover:border-[#FDFBF7]/50 backdrop-blur-sm transition-all duration-300"
            >
              Xem Thực Đơn
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================
          SECTION 2: CHUYỆN BÊN BỜ SUỐI
      ========================================= */}
      <section className="relative py-32 px-6 sm:px-12 lg:px-24 bg-[#0a0705]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-20 items-center">
          <div className="md:col-span-5 relative w-full aspect-[4/5] rounded-2xl overflow-hidden border border-[#C88A4B]/15">
            <Image
              src="/uploads/gallery/1788250253551-943009233.jpg"
              alt="Bờ suối đá"
              fill
              loading="lazy"
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover hover:scale-105 transition-transform duration-1000"
            />
          </div>
          <div className="md:col-span-7 flex flex-col justify-center">
            <h2 className="font-serif text-3xl sm:text-5xl font-medium text-[#F5EFEB] mb-8 leading-tight">
              LẮNG NGHE TIẾNG SUỐI NGUỒN
            </h2>
            <p className="font-sans font-light text-[#FDFBF7]/70 text-lg leading-relaxed mb-6">
              Không gian đón gió mát lành, hoa lá đại ngàn che bóng mát, nơi bạn tạm gác lại những xô bồ thường nhật để tìm về sự tĩnh lặng. Làn nước trong xanh nhẹ trôi tại Gia Nghĩa mang đến trải nghiệm thiên nhiên nguyên sơ, mộc mạc nhất.
            </p>
            <p className="font-sans font-light text-[#FDFBF7]/70 text-lg leading-relaxed">
              Hãy để tiếng nước chảy róc rách và hương cà phê nguyên bản dẫn lối tâm hồn.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================
          SECTION 3: 3 TRẢI NGHIỆM ĐẶC TRƯNG
      ========================================= */}
      <section className="relative py-32 px-6 sm:px-12 lg:px-24 bg-[#0a0705]/95 border-t border-[#FDFBF7]/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <span className="font-sans text-xs tracking-[0.25em] uppercase text-[#C88A4B] font-medium block mb-4">
              TRẢI NGHIỆM ĐẮK NÔNG
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-medium text-[#F5EFEB]">
              GÓC NHỎ AN YÊN
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Bờ Suối Tự Nhiên", desc: "Bàn gỗ sát mép nước mát rượi", img: "/uploads/gallery/1788250253551-943009233.jpg" },
              { title: "Hiên Gỗ & Hoa Cẩm Cù", desc: "Không gian mở thoáng đãng ngập sắc hoa", img: "/uploads/gallery/1788250253554-875120458.jpg" },
              { title: "Cà Phê Mộc Rang Củi", desc: "Hương vị Robusta Tây Nguyên nguyên bản", img: "/uploads/gallery/1788250253557-29323827.jpg" },
            ].map((exp, idx) => (
              <div key={idx} className="group flex flex-col gap-6">
                <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden border border-[#FDFBF7]/10">
                  <Image
                    src={exp.img}
                    alt={exp.title}
                    fill
                    loading="lazy"
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div>
                  <h3 className="font-serif text-2xl text-[#C88A4B] mb-2">{exp.title}</h3>
                  <p className="font-sans font-light text-[#FDFBF7]/70 leading-relaxed">
                    {exp.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================
          SECTION 4: THỨC UỐNG NỔI BẬT
      ========================================= */}
      <section className="relative py-32 px-6 sm:px-12 lg:px-24 bg-[#0a0705] border-t border-[#FDFBF7]/5">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="font-serif text-3xl sm:text-5xl font-medium text-[#F5EFEB] mb-16">
            HƯƠNG VỊ ĐẶC TRƯNG
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-left mb-16">
            {[
              { name: "Cà phê muối", price: "28.000đ" },
              { name: "Trà đào cam sả", price: "27.000đ" },
              { name: "Bánh mì ốp la xúc xích", price: "25.000đ" },
              { name: "Bò kho bánh mì", price: "45.000đ" },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-[#1A1D17]/50 border border-[#FDFBF7]/10 rounded-2xl p-6 hover:-translate-y-1.5 transition-transform duration-300"
              >
                <h3 className="font-serif text-xl font-medium text-[#F5EFEB] mb-4">{item.name}</h3>
                <div className="font-sans font-medium text-[#C88A4B] tracking-wide">
                  {item.price}
                </div>
              </div>
            ))}
          </div>

          <div>
            <Link
              href="/menu"
              className="inline-flex items-center justify-center px-8 py-3 bg-transparent border border-[#FDFBF7]/20 text-[#FDFBF7]/80 font-sans text-sm font-medium rounded-full hover:bg-[#FDFBF7]/10 hover:border-[#FDFBF7]/40 hover:text-[#F5EFEB] transition-all duration-300"
            >
              Xem Toàn Bộ Thực Đơn (40+ Món) →
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================
          SECTION 5: TIỆN ÍCH CHU ĐÁO
      ========================================= */}
      <section className="relative py-24 px-6 sm:px-12 bg-[#0a0705]/95 border-t border-[#FDFBF7]/5">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 divide-x divide-[#FDFBF7]/10">
            {[
              "Bãi đỗ xe ô tô & xe máy rộng rãi, an toàn.",
              "Wifi tốc độ cao phủ sóng toàn bộ quán.",
              "Ổ cắm điện tại từng bàn thuận tiện làm việc.",
              "Không gian sinh thái ngoài trời thoáng đãng.",
            ].map((amenity, idx) => (
              <div key={idx} className="px-4 text-center flex items-center justify-center">
                <p className="font-sans font-medium text-[#FDFBF7]/70 text-sm sm:text-base leading-relaxed">
                  {amenity}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================
          SECTION 6: CẢM NHẬN KHÁCH HÀNG
      ========================================= */}
      <section className="relative py-32 px-6 sm:px-12 bg-[#1A1D17]/40">
        <div className="max-w-4xl mx-auto text-center">
          <blockquote className="font-serif text-2xl sm:text-4xl italic font-light leading-relaxed text-[#F5EFEB] mb-8">
            "Không gian thật yên tĩnh, chỉ có tiếng suối chảy róc rách. Một nơi tuyệt vời để gác lại những ồn ào và thưởng thức vị cà phê đậm đà."
          </blockquote>
          <p className="font-sans text-xs tracking-[0.25em] uppercase text-[#C88A4B] font-medium">
            — Khách hàng thân thiết
          </p>
        </div>
      </section>

      {/* =========================================
          SECTION 7: THÔNG TIN LIÊN HỆ & BẢN ĐỒ
      ========================================= */}
      <section className="relative py-32 px-6 sm:px-12 text-center bg-[#0a0705]">
        <div className="max-w-4xl mx-auto space-y-12">
          <span className="font-sans text-xs tracking-[0.25em] uppercase text-[#C88A4B] font-medium block mb-4">
            VISIT US
          </span>
          <h2 className="font-serif text-4xl sm:text-6xl text-[#F5EFEB] font-medium mb-12 leading-tight">
            TỪ GIA NGHĨA,<br />
            CHÚNG TÔI CHỜ BẠN.
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-left max-w-2xl mx-auto mb-16 border-t border-[#FDFBF7]/10 pt-12">
            <div>
              <h3 className="font-sans text-xs tracking-[0.2em] uppercase text-[#C88A4B] mb-3">Địa Chỉ</h3>
              <p className="font-sans font-light text-[#FDFBF7]/80 leading-relaxed">
                Hẻm 437 Hùng Vương<br />
                Phường Nghĩa Trung<br />
                TP. Gia Nghĩa, Đắk Nông
              </p>
            </div>
            <div>
              <h3 className="font-sans text-xs tracking-[0.2em] uppercase text-[#C88A4B] mb-3">Giờ Mở Cửa & Hotline</h3>
              <p className="font-sans font-light text-[#FDFBF7]/80 leading-relaxed mb-2">
                Thứ 2 - Thứ 5 (07:00 - 22:00)<br />
                Thứ 6 - CN (07:00 - 23:00)
              </p>
              <a href="tel:0382851688" className="font-sans font-medium text-[#FDFBF7]/90 hover:text-[#C88A4B] transition-colors block">038 285 1688</a>
              <a href="tel:0774659000" className="font-sans font-medium text-[#FDFBF7]/90 hover:text-[#C88A4B] transition-colors block">077 465 9000</a>
            </div>
          </div>

          <Link
            href="/contact"
            className="inline-flex items-center justify-center px-10 py-4 bg-[#F5EFEB] text-[#0a0705] font-sans font-medium rounded-full hover:bg-[#C88A4B] transition-colors duration-300 shadow-md"
          >
            Xem Bản Đồ & Chỉ Đường
          </Link>
        </div>
      </section>

    </div>
  );
}
