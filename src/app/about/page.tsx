"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Sprout,
  Coffee,
  Heart,
  Users,
  Compass,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const CORE_VALUES = [
  {
    icon: Sprout,
    step: "01",
    title: "Thân Thiện Môi Trường",
    desc: "Gìn giữ dòng suối ngàn năm và thảm cây rừng nguyên bản. Tuyệt đối không can thiệp cơ giới nặng nề làm biến đổi địa hình tự nhiên.",
  },
  {
    icon: Coffee,
    step: "02",
    title: "Nguyên Liệu Xanh Sạch",
    desc: "Cà phê mộc chất lượng cao thu hoạch chín mọng từ nông hộ bazan Đắk Nông, rang củi thủ công và không sử dụng bất kỳ hóa chất phụ gia nào.",
  },
  {
    icon: Heart,
    step: "03",
    title: "Dịch Vụ Tận Tâm",
    desc: "Đón tiếp chân thành, ấm áp như người nhà trở về. Mỗi vị khách ghé thăm đều là một người bạn tâm giao cùng chia sẻ tình yêu thiên nhiên.",
  },
];

export default function AboutPage() {
  const { lang } = useLanguage();

  return (
    <div className="w-full bg-[#FDFBF7] text-[#222222]">
      
      {/* ========================================================= */}
      {/* 1. BANNER: CÂU CHUYỆN CỦA CHÚNG TÔI                       */}
      {/* ========================================================= */}
      <section className="relative py-24 sm:py-32 px-6 sm:px-12 flex items-center justify-center text-center overflow-hidden border-b border-[#EAE6DF]">
        <div className="absolute inset-0 z-0">
          <Image
            src="/uploads/gallery/1788250253554-875120458.jpg"
            alt="Cẩm Cù House mộc mạc bên bờ suối"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#FDFBF7]/90 via-[#FDFBF7]/85 to-[#FDFBF7]" />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto space-y-4">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#2D4A3E]/10 border border-[#2D4A3E]/20 text-xs font-semibold text-[#2D4A3E]">
            <Compass size={14} className="text-[#C88A4B]" />
            <span>HÀNH TRÌNH KHỞI NGUYÊN</span>
          </span>

          <h1 className="font-serif text-4xl sm:text-6xl font-bold text-[#2D4A3E] tracking-tight">
            Câu Chuyện Của Chúng Tôi
          </h1>

          <p className="text-base sm:text-lg font-light text-[#222222]/80 leading-relaxed">
            Từ một góc suối đá hoang sơ tại thung lũng Gia Nghĩa, chúng tôi kiến
            tạo nên chốn dừng chân bình dị nơi hương hoa cẩm cù hòa cùng vị cà
            phê mộc nguyên bản.
          </p>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 2. HÀNH TRÌNH & SỨ MỆNH (BỐ CỤC XEN KẼ Z-SHAPE)          */}
      {/* ========================================================= */}
      <section className="py-20 sm:py-28 px-6 sm:px-12 max-w-7xl mx-auto space-y-24 sm:space-y-32">
        
        {/* HÀNG 1: Khởi nguồn từ bờ suối đá */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          <div className="lg:col-span-6 relative aspect-[4/3] rounded-3xl overflow-hidden border border-[#EAE6DF] shadow-md">
            <Image
              src="/uploads/gallery/1788250253551-943009233.jpg"
              alt="Khởi nguồn từ bờ suối đá Cẩm Cù"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover hover:scale-104 transition-transform duration-700 ease-out"
            />
          </div>
          <div className="lg:col-span-6 space-y-4">
            <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#C88A4B] font-semibold">
              CHƯƠNG 01 • KHỞI NGUỒN
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#2D4A3E]">
              Khởi Nguồn Từ Bờ Suối Đá
            </h2>
            <p className="text-sm sm:text-base font-light text-[#222222]/80 leading-relaxed">
              Cẩm Cù House bắt đầu từ một buổi sáng tĩnh lặng bên con suối róc
              rách chảy qua những tảng đá cuội rêu phong tại Hẻm 437 Hùng Vương.
              Nhận thấy vẻ đẹp nguyên sơ hiếm có giữa nhịp sống hối hả, chúng tôi
              quyết định dựng một mái hiên gỗ mộc mạc làm nơi dừng chân.
            </p>
            <p className="text-sm sm:text-base font-light text-[#222222]/80 leading-relaxed">
              Mỗi mét vuông không gian đều nương tựa vào dáng dấp của tự nhiên,
              không đắp bờ bê tông nhân tạo, giữ cho dòng nước suối luôn lưu
              chuyển tự do và trong vắt quanh năm.
            </p>
          </div>
        </div>

        {/* HÀNG 2: Gìn giữ hệ sinh thái bản địa */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          <div className="lg:col-span-6 space-y-4 order-2 lg:order-1">
            <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#C88A4B] font-semibold">
              CHƯƠNG 02 • THÁNH ĐƯỜNG THỰC VẬT
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#2D4A3E]">
              Gìn Giữ Hệ Sinh Thái Bản Địa
            </h2>
            <p className="text-sm sm:text-base font-light text-[#222222]/80 leading-relaxed">
              Hoa Cẩm Cù (Hoya) - loài hoa ngọc bích hình ngôi sao sáp bản địa
              nở rộ mỗi mùa nắng sớm đã trở thành linh hồn của chốn này. Quanh
              hiên nhà, hàng trăm loài thực vật Tây Nguyên cùng cỏ dại được chăm
              sóc tự nhiên, tạo nên một vành đai xanh tươi mát và thanh lọc bầu
              không khí.
            </p>
            <p className="text-sm sm:text-base font-light text-[#222222]/80 leading-relaxed">
              Khách đến đây được ngồi dưới tán lá râm mát, lắng nghe tiếng chim hót
              và tận hưởng sự kết nối dịu dàng với cỏ cây hoa lá.
            </p>
          </div>
          <div className="lg:col-span-6 relative aspect-[4/3] rounded-3xl overflow-hidden border border-[#EAE6DF] shadow-md order-1 lg:order-2">
            <Image
              src="/uploads/gallery/1788250253557-29323827.jpg"
              alt="Hệ sinh thái hoa Cẩm Cù bản địa"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover hover:scale-104 transition-transform duration-700 ease-out"
            />
          </div>
        </div>

        {/* HÀNG 3: Văn hóa cà phê xanh sạch */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          <div className="lg:col-span-6 relative aspect-[4/3] rounded-3xl overflow-hidden border border-[#EAE6DF] shadow-md">
            <Image
              src="/uploads/gallery/1788250253560-200373033.jpg"
              alt="Cà phê mộc rang củi thủ công"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover hover:scale-104 transition-transform duration-700 ease-out"
            />
          </div>
          <div className="lg:col-span-6 space-y-4">
            <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#C88A4B] font-semibold">
              CHƯƠNG 03 • HƯƠNG VỊ MỘC
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#2D4A3E]">
              Văn Hóa Cà Phê Rang Củi Xanh Sạch
            </h2>
            <p className="text-sm sm:text-base font-light text-[#222222]/80 leading-relaxed">
              Chúng tôi trân trọng hạt Robusta được nuôi dưỡng bởi lớp đất đỏ bazan
              màu mỡ Đắk Nông. Không rang công nghiệp số lượng lớn, Cẩm Cù House
              chọn rang từng mẻ nhỏ trên ngọn lửa than củi từ những cành cà phê già
              đã hết chu kỳ sinh trưởng.
            </p>
            <p className="text-sm sm:text-base font-light text-[#222222]/80 leading-relaxed">
              Không bơ, không hương liệu tổng hợp, từng giọt cà phê chắt chiu vị
              đậm đà, hậu vị ngọt thanh tao và thơm nồng khói gỗ tự nhiên.
            </p>
          </div>
        </div>

      </section>

      {/* ========================================================= */}
      {/* 3. GIÁ TRỊ CỐT LÕI (3 CỘT THẺ NỀN TRẮNG VIỀN #EAE6DF)     */}
      {/* ========================================================= */}
      <section className="py-20 bg-[#F7F4EE] px-6 sm:px-12 border-t border-b border-[#EAE6DF]">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#C88A4B] font-semibold">
              NGUYÊN TẮC HOẠT ĐỘNG
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2D4A3E]">
              Giá Trị Cốt Lõi
            </h2>
            <p className="text-sm font-light text-[#222222]/75">
              Ba trụ cột định hình mọi trải nghiệm của khách hàng tại Cẩm Cù House.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {CORE_VALUES.map((val, idx) => {
              const IconComp = val.icon;
              return (
                <div
                  key={idx}
                  className="bg-white p-8 rounded-2xl border border-[#EAE6DF] shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-6"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-xl bg-[#2D4A3E]/10 border border-[#2D4A3E]/20 flex items-center justify-center text-[#2D4A3E]">
                        <IconComp size={22} />
                      </div>
                      <span className="text-xs font-mono font-bold text-[#C88A4B]">
                        {val.step}
                      </span>
                    </div>

                    <h3 className="font-serif text-xl font-bold text-[#2D4A3E]">
                      {val.title}
                    </h3>

                    <p className="text-xs sm:text-sm font-light text-[#222222]/80 leading-relaxed">
                      {val.desc}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#EAE6DF] text-xs font-medium text-[#C88A4B]">
                    Cam kết trọn vẹn từ trái tim
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 4. ĐỘI NGŨ / CON NGƯỜI & LỜI TRI ÂN                       */}
      {/* ========================================================= */}
      <section className="py-20 sm:py-28 px-6 sm:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center bg-white p-8 sm:p-14 rounded-3xl border border-[#EAE6DF] shadow-md">
          {/* Ảnh đội ngũ */}
          <div className="lg:col-span-6 relative aspect-[4/3] rounded-2xl overflow-hidden border border-[#EAE6DF]">
            <Image
              src="/uploads/gallery/1788250253554-875120458.jpg"
              alt="Đội ngũ pha chế và phục vụ Cẩm Cù House"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>

          {/* Lời tri ân */}
          <div className="lg:col-span-6 space-y-5">
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#C88A4B] font-semibold">
              <Users size={14} />
              <span>CON NGƯỜI CẨM CÙ</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#2D4A3E]">
              Gặp Gỡ Đội Ngũ Tận Tâm
            </h2>

            <p className="text-sm sm:text-base font-light text-[#222222]/85 leading-relaxed">
              Phía sau mỗi ly cà phê ấm nóng và chiếc bàn sạch sẽ dưới tán râm là
              sự tận tụy của những con người chất phác đất Tây Nguyên. Chúng tôi
              học cách lắng nghe nhịp thở của tự nhiên, pha chế bằng tất cả tình
              yêu thương và luôn sẵn lòng đón chào bạn với nụ cười thân quen nhất.
            </p>

            <blockquote className="p-4 rounded-xl bg-[#FDFBF7] border-l-4 border-[#C88A4B] italic text-xs sm:text-sm font-serif text-[#2D4A3E]">
              &ldquo;Cảm ơn bạn đã ghé thăm và trở thành một phần tươi đẹp trong
              hành trình gìn giữ màu xanh bờ suối của Cẩm Cù House.&rdquo;
            </blockquote>

            <div className="pt-2">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#2D4A3E] hover:bg-[#1F342B] text-white text-xs sm:text-sm font-medium transition-colors shadow-sm"
              >
                <span>Ghé chơi cùng chúng tôi</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
