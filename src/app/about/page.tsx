"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Sprout,
  Coffee,
  Heart,
  Users,
  Compass,
  ArrowRight,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const CORE_VALUES = [
  {
    icon: Coffee,
    step: "01",
    emoji: "☕",
    title: "Hạt Cà Phê Mộc",
    desc: "Rang mộc nguyên bản, chắt chiu từ hạt Robusta Đắk Nông chín đỏ, không pha tạp, không hương liệu hay chất bảo quản.",
  },
  {
    icon: Sprout,
    step: "02",
    emoji: "🌿",
    title: "Không Gian Xanh",
    desc: "Thuận theo tự nhiên, gìn giữ trọn vẹn bờ suối đá róc rách, thảm hoa cẩm cù bản địa và làn gió cao nguyên trong lành mát rượi.",
  },
  {
    icon: Heart,
    step: "03",
    emoji: "❤️",
    title: "Tận Tâm",
    desc: "Chân thành, hiếu khách như trở về nhà. Mỗi tách cà phê trao gửi bằng tất cả sự tỉ mỉ và ấm áp của người pha chế.",
  },
];

export default function AboutPage() {
  const { lang } = useLanguage();

  return (
    <div className="w-full text-[#FDFBF7]">
      {/* ========================================================= */}
      {/* 1. BANNER: TUYÊN NGÔN AWWWARDS                            */}
      {/* ========================================================= */}
      <section className="relative py-28 sm:py-36 px-6 sm:px-12 flex items-center justify-center text-center overflow-hidden border-b border-[#222520]">
        <div className="relative z-10 max-w-4xl mx-auto space-y-6">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1A1D17] border border-[#222520] text-xs font-mono text-[#C88A4B]">
            <Compass size={14} />
            <span>TRIẾT LÝ THƯƠNG HIỆU</span>
          </span>

          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold text-[#FDFBF7] tracking-tight leading-tight">
            TỪ BỎ ỒN ÀO. <br />
            <span className="text-[#C88A4B] italic">TÌM VỀ NGUYÊN BẢN.</span>
          </h1>

          <p className="text-base sm:text-lg font-light text-[#FDFBF7]/80 max-w-2xl mx-auto leading-relaxed">
            Từ một góc suối đá hoang sơ tại thung lũng Gia Nghĩa, chúng tôi dựng
            nên chốn dừng chân bình yên nơi hương hoa cẩm cù hòa cùng vị cà phê
            mộc thơm nồng khói gỗ.
          </p>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 2. BỐ CỤC XEN KẼ Z-SHAPE                                  */}
      {/* ========================================================= */}
      <section className="py-24 sm:py-32 px-6 sm:px-12 max-w-7xl mx-auto space-y-28 sm:space-y-36 relative z-10">
        
        {/* HÀNG 1: Khởi nguồn từ bờ suối đá */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          <div className="lg:col-span-6 relative aspect-[4/3] rounded-3xl overflow-hidden border border-[#222520] shadow-xl bg-[#1A1D17]">
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
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#FDFBF7]">
              Tôn Trọng Dòng Suối Nguyên Sơ
            </h2>
            <p className="text-sm sm:text-base font-light text-[#FDFBF7]/75 leading-relaxed">
              Cẩm Cù House bắt đầu từ một buổi sáng tĩnh lặng bên con suối róc
              rách chảy qua những tảng đá cuội rêu phong tại Hẻm 437 Hùng Vương.
              Nhận thấy vẻ đẹp mộc mạc hiếm có, chúng tôi quyết định dựng mái hiên
              gỗ mà không làm biến đổi bất kỳ phiến đá tự nhiên nào.
            </p>
            <p className="text-sm sm:text-base font-light text-[#FDFBF7]/75 leading-relaxed">
              Không can thiệp cơ giới nặng nề, dòng nước suối luôn lưu chuyển tự
              do và trong vắt bốn mùa, phản chiếu bầu trời cao nguyên khoáng đạt.
            </p>
          </div>
        </div>

        {/* HÀNG 2: Gìn giữ hệ sinh thái bản địa */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          <div className="lg:col-span-6 space-y-4 order-2 lg:order-1">
            <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#C88A4B] font-semibold">
              CHƯƠNG 02 • THÁNH ĐƯỜNG THỰC VẬT
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#FDFBF7]">
              Hệ Sinh Thái Hoa Cẩm Cù Bản Địa
            </h2>
            <p className="text-sm sm:text-base font-light text-[#FDFBF7]/75 leading-relaxed">
              Hoa Cẩm Cù (Hoya) - loài hoa ngọc bích hình ngôi sao sáp bản địa
              nở rộ mỗi mùa nắng sớm đã trở thành linh hồn của chốn này. Quanh
              hiên nhà, hàng trăm loài thực vật Tây Nguyên cùng cỏ dại được chăm
              sóc tự nhiên, thanh lọc bầu không khí trong lành.
            </p>
            <p className="text-sm sm:text-base font-light text-[#FDFBF7]/75 leading-relaxed">
              Ngồi dưới tán râm, ngắm hoa cẩm cù và lắng nghe tiếng chim ríu rít,
              bạn sẽ cảm nhận được sự dịu êm của đời sống mộc.
            </p>
          </div>
          <div className="lg:col-span-6 relative aspect-[4/3] rounded-3xl overflow-hidden border border-[#222520] shadow-xl order-1 lg:order-2 bg-[#1A1D17]">
            <Image
              src="/uploads/gallery/1788250253557-29323827.jpg"
              alt="Hệ sinh thái hoa Cẩm Cù bản địa"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover hover:scale-104 transition-transform duration-700 ease-out"
            />
          </div>
        </div>

        {/* HÀNG 3: Cà phê mộc sấy tự nhiên rang củi */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          <div className="lg:col-span-6 relative aspect-[4/3] rounded-3xl overflow-hidden border border-[#222520] shadow-xl bg-[#1A1D17]">
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
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#FDFBF7]">
              Cà Phê Mộc Sấy Tự Nhiên &amp; Rang Củi
            </h2>
            <p className="text-sm sm:text-base font-light text-[#FDFBF7]/75 leading-relaxed">
              Chúng tôi chọn những hạt Robusta chín mọng nuôi dưỡng bởi đất đỏ
              bazan màu mỡ Đắk Nông, phơi nắng tự nhiên trên giàn cao và rang trên
              ngọn lửa than củi gỗ cà phê già đã hết chu kỳ sinh trưởng.
            </p>
            <p className="text-sm sm:text-base font-light text-[#FDFBF7]/75 leading-relaxed">
              Không bơ, không hương liệu nhân tạo, từng giọt cà phê chắt chiu vị
              đậm đà, hậu vị ngọt thanh tao và thơm nồng mùi khói gỗ núi rừng.
            </p>
          </div>
        </div>

      </section>

      {/* ========================================================= */}
      {/* 3. GIÁ TRỊ CỐT LÕI (3 CỘT THẺ)                            */}
      {/* ========================================================= */}
      <section className="py-24 px-6 sm:px-12 border-t border-b border-[#222520] relative z-10">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#C88A4B] font-semibold">
              NGUYÊN TẮC HOẠT ĐỘNG
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#FDFBF7]">
              Giá Trị Cốt Lõi
            </h2>
            <p className="text-sm font-light text-[#FDFBF7]/70">
              Ba giá trị bền bỉ làm nên tinh thần của Cẩm Cù House.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {CORE_VALUES.map((val, idx) => (
              <div
                key={idx}
                className="card-dark p-8 rounded-3xl flex flex-col justify-between space-y-6 hover:border-[#C88A4B] transition-colors"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-xl bg-[#1A1D17] border border-[#222520] flex items-center justify-center text-xl">
                      <span>{val.emoji}</span>
                    </div>
                    <span className="text-xs font-mono font-bold text-[#C88A4B]">
                      {val.step}
                    </span>
                  </div>

                  <h3 className="font-serif text-xl font-bold text-[#FDFBF7] flex items-center gap-2">
                    <span>{val.emoji}</span>
                    <span>{val.title}</span>
                  </h3>

                  <p className="text-xs sm:text-sm font-light text-[#FDFBF7]/70 leading-relaxed">
                    {val.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#222520] text-xs font-mono text-[#C88A4B]">
                  Cam kết mộc mạc từ trái tim
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 4. ĐỘI NGŨ / CON NGƯỜI & LỜI TRI ÂN                       */}
      {/* ========================================================= */}
      <section className="py-24 px-6 sm:px-12 max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center card-dark p-8 sm:p-14 rounded-3xl border border-[#222520]">
          <div className="lg:col-span-6 relative aspect-[4/3] rounded-2xl overflow-hidden border border-[#222520] bg-[#1A1D17]">
            <Image
              src="/uploads/gallery/1788250253554-875120458.jpg"
              alt="Đội ngũ pha chế Cẩm Cù House"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>

          <div className="lg:col-span-6 space-y-5">
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#C88A4B] font-semibold">
              <Users size={14} />
              <span>CON NGƯỜI CẨM CÙ</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#FDFBF7]">
              Gặp Gỡ Đội Ngũ Tận Tâm
            </h2>

            <p className="text-sm sm:text-base font-light text-[#FDFBF7]/75 leading-relaxed">
              Phía sau mỗi ly cà phê ấm nóng và chiếc bàn sạch sẽ dưới tán râm là
              sự chân thành của những con người chất phác đất Tây Nguyên. Chúng tôi
              học cách lắng nghe nhịp thở của suối rừng và đón chào bạn như người
              thân trở về.
            </p>

            <blockquote className="p-4 rounded-xl bg-[#1A1D17] border-l-4 border-[#C88A4B] italic text-xs sm:text-sm font-serif text-[#FDFBF7]">
              &ldquo;Cảm ơn bạn đã ghé thăm và trở thành một phần tươi đẹp trong
              hành trình gìn giữ màu xanh bờ suối của Cẩm Cù House.&rdquo;
            </blockquote>

            <div className="pt-2">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-7 py-3 rounded-full border border-[#C88A4B] text-[#C88A4B] hover:bg-[#C88A4B] hover:text-[#0C0D0B] text-xs sm:text-sm font-semibold uppercase tracking-wider transition-colors"
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
