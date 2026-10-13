"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import Footer from "@/components/Footer";
import RotatingSeal from "@/components/ui/RotatingSeal";
import StarHoya from "@/components/ui/StarHoya";
import ContourLines from "@/components/ui/ContourLines";
import { useLanguage } from "@/context/LanguageContext";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import {
  Flower2,
  Droplets,
  Coffee,
  Trees,
  Heart,
  PhoneCall,
  Navigation,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

function ScrollWord({
  word,
  range,
  progress,
}: {
  word: string;
  range: [number, number];
  progress: MotionValue<number>;
}) {
  // Bắt đầu từ opacity 0.42 để đảm bảo độ tương phản tối thiểu >= 3:1 trên nền than (charcoal #1C1612)
  const opacity = useTransform(progress, range, [0.42, 1]);
  return (
    <motion.span
      style={{ opacity }}
      className="inline-block transition-opacity font-serif font-bold text-2xl sm:text-3xl lg:text-4xl text-[#F4ECDD] mr-2.5 mb-2.5 leading-relaxed"
    >
      {word}
    </motion.span>
  );
}

function GoldenFlowerWordScrubSection({ isEn }: { isEn: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.85", "end 0.25"],
  });

  const quote = isEn
    ? "Under the Central Highlands forest canopy, each yellow blossom and Hoya cluster blooms quietly, listening to the stream, weaving serenity for all who return."
    : "Dưới bóng rừng Tây Nguyên, từng khóm hoa chuông vàng rực rỡ và hoa Cẩm Cù kiên định nở son sắt bên bờ suối, dệt nên khoảng trời an yên cho mỗi bước chân dừng lại.";

  const words = quote.split(" ");

  return (
    <section
      ref={containerRef}
      className="w-full bg-[#1C1612] text-[#F4ECDD] py-20 lg:py-28 relative overflow-hidden border-y border-[rgba(244,236,221,0.14)]"
    >
      <ContourLines opacity={0.08} className="text-[#F4ECDD]" />

      <div className="container-unified relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Trái: Chữ 40px sáng dần từng từ */}
          <div className="lg:col-span-7 flex flex-col gap-5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#2A201A] text-[var(--flower)] font-mono text-[11px] font-semibold uppercase tracking-widest w-fit border border-[rgba(244,236,221,0.14)]">
              <Flower2 className="w-3.5 h-3.5 text-[var(--flower)]" />
              <span>{isEn ? "WORD-BY-WORD REVEAL" : "SẮC HOA & NHỊP THỞ NÚI RỪNG"}</span>
            </div>

            <div className="flex flex-wrap mt-2">
              {words.map((word, i) => {
                const start = i / words.length;
                const end = Math.min((i + 1) / words.length, 1);
                return (
                  <ScrollWord
                    key={i}
                    word={word}
                    range={[start, end]}
                    progress={scrollYProgress}
                  />
                );
              })}
            </div>

            <p className="font-mono text-xs text-[#C7BBA8] uppercase tracking-wider mt-2">
              {isEn
                ? "• Cuộn trang để màu chữ lan dần theo nhịp thở núi rừng"
                : "• Cuộn trang để màu chữ lan dần theo nhịp thở núi rừng"}
            </p>
          </div>

          {/* Phải: Ảnh vòm hoa chuông vàng */}
          <div className="lg:col-span-5 relative">
            <div className="frame-arch aspect-[4/5] border-2 border-[rgba(244,236,221,0.16)] shadow-2xl relative overflow-hidden bg-[#2A201A]">
              <Image
                src="/uploads/gallery/1788250253557-29323827.jpg"
                alt="Vườn hoa chuông vàng Cẩm Cù House"
                fill
                sizes="(max-width: 768px) 100vw, 420px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1C1612]/85 via-transparent to-transparent flex flex-col justify-end p-6">
                <span className="font-mono text-xs text-[var(--flower)] uppercase tracking-wider">
                  ĐỘ CAO 800M+
                </span>
                <p className="font-serif text-lg font-bold text-[#F4ECDD] mt-1">
                  Vườn Hoa Chuông Vàng Ven Triền Suối
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function AboutPage() {
  const { locale, dict } = useLanguage();
  const isEn = locale === "en";

  return (
    <div className="bg-[var(--paper)] min-h-screen text-[var(--ink)] selection:bg-[var(--basalt)] selection:text-white transition-colors overflow-x-hidden">
      <main className="overflow-x-hidden">
        {/* =========================================================================
            8.2.1 MỞ ĐẦU (NỀN GIẤY, ĐƯỜNG ĐỒNG MỨC, H1 CĂN TRÁI, 3 BADGE MONO GẠCH DƯỚI)
           ========================================================================= */}
        <section className="relative pt-32 sm:pt-40 pb-16 lg:pb-24 border-b border-[var(--line)] overflow-hidden">
          <ContourLines opacity={0.07} className="text-[var(--ink)]" />

          <div className="container-unified relative z-10">
            <div className="max-w-4xl text-left flex flex-col gap-4">
              {/* Nhãn mono */}
              <span className="font-mono text-[12px] uppercase tracking-widest text-[var(--basalt)] font-semibold">
                {isEn ? "HIGHLAND SENTIMENT" : "TÂM TÌNH TỪ CAO NGUYÊN"}
              </span>

              {/* H1 Căn lề trái */}
              <h1 className="font-serif text-[clamp(36px,5.5vw,72px)] font-bold text-[var(--ink)] tracking-tight leading-[1.08] text-balance">
                Câu Chuyện Cẩm Cù / <em className="italic text-[var(--basalt)]">Chốn Bình Yên</em> Giữa Đất Ngàn
              </h1>

              {/* Mô tả */}
              <p className="text-[17px] sm:text-[18px] text-[var(--ink-muted)] leading-[1.7] max-w-[62ch] mt-2">
                {dict.about.description}
              </p>

              {/* 3 Badge dạng chữ mono có gạch dưới (Section 8.2.1) */}
              <div className="flex flex-wrap items-center gap-6 mt-6 pt-4 border-t border-[var(--line)]">
                <span className="font-mono text-[12px] uppercase tracking-wider text-[var(--ink)] font-semibold pb-1 border-b-2 border-[var(--basalt)]">
                  HOA CẨM CÙ BỀN BỈ
                </span>
                <span className="font-mono text-[12px] uppercase tracking-wider text-[var(--ink)] font-semibold pb-1 border-b-2 border-[var(--stream)]">
                  SUỐI ĐÁ NGUYÊN BẢN
                </span>
                <span className="font-mono text-[12px] uppercase tracking-wider text-[var(--ink)] font-semibold pb-1 border-b-2 border-[var(--flower)]">
                  ROBUSTA RANG CỦI MỘC
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            8.2.2 CHƯƠNG 01: LOÀI HOA BỀN BỈ (LẺ: ẢNH VÒM TRÁI DÍNH, CHỮ PHẢI CUỘN)
           ========================================================================= */}
        <section className="container-unified section-unified border-b border-[var(--line)]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
            {/* Ảnh vòm dính bên trái (Chương lẻ) */}
            <div className="lg:col-span-5 lg:sticky lg:top-28">
              <div className="relative w-full aspect-[4/5] frame-arch border-2 border-[var(--line)] shadow-xl overflow-hidden bg-[var(--paper-2)]">
                <Image
                  src="/uploads/gallery/1788250253557-29323827.jpg"
                  alt="Hoa Cẩm Cù và không gian mộc mạc"
                  fill
                  sizes="(max-width: 768px) 100vw, 440px"
                  className="object-cover"
                />
              </div>

              {/* Điểm nhấn vẽ nét hoa Hoya sao */}
              <div className="mt-4 flex items-center gap-3 text-[var(--basalt)]">
                <StarHoya size={32} strokeWidth={1.6} />
                <span className="font-mono text-xs uppercase tracking-widest text-[var(--ink-muted)]">
                  HOYA CARNOSA · BIỂU TƯỢNG SỨC SỐNG
                </span>
              </div>
            </div>

            {/* Chữ cuộn bên phải */}
            <div className="lg:col-span-7 flex flex-col gap-6 relative">
              {/* Số lớn "01" Fraunces 160px mờ */}
              <span className="font-serif text-[120px] sm:text-[160px] font-bold text-[var(--line)] leading-none select-none pointer-events-none -mb-16">
                01
              </span>

              <div className="flex items-center gap-3">
                <span className="font-mono text-xs font-bold text-[var(--stream)] uppercase tracking-widest">
                  CHƯƠNG 01
                </span>
                <span className="w-8 h-[1px] bg-[var(--line)]" />
                <span className="font-mono text-xs text-[var(--ink-muted)] uppercase tracking-wider">
                  SỰ KỲ DIỆU CỦA TỰ NHIÊN
                </span>
              </div>

              <h2 className="font-serif text-[clamp(28px,3.8vw,44px)] font-bold text-[var(--ink)] leading-[1.15]">
                {isEn
                  ? "Resilient Blossoms & A Destiny Beside the Rock Stream"
                  : "Loài Hoa Bền Bỉ & Mối Duyên Lành Bên Dòng Suối"}
              </h2>

              <div className="space-y-4 text-[16px] sm:text-[17px] text-[var(--ink-muted)] leading-[1.7]">
                <p>
                  {isEn ? (
                    <>
                      The name <strong className="font-semibold text-[var(--stream)]">&ldquo;Cẩm Cù&rdquo; (Hoya carnosa)</strong> originates from a modest native climbing vine thriving under the canopy of the Central Highlands forest. Rather than boasting loud colors, the Hoya flower patiently collects morning dew to blossom into spherical porcelain-like star clusters.
                    </>
                  ) : (
                    <>
                      Tên gọi <strong className="font-semibold text-[var(--stream)]">&ldquo;Cẩm Cù&rdquo; (Hoya carnosa)</strong> bắt nguồn từ một loài hoa dây leo mộc mạc nép mình dưới bóng rừng Tây Nguyên. Không ồn ào khoe sắc, hoa Cẩm Cù kiên định chắt chiu sương sớm qua từng năm tháng để nở thành từng chùm hình cầu lung linh tựa cánh sứ ngũ giác. Trong phong thủy và tâm thức người bản địa, chùm hoa hình tròn trọn vẹn là biểu tượng của sự gắn kết son sắt, ấm cúng và sự an yên thanh thản sâu trong tâm hồn.
                    </>
                  )}
                </p>
                <p>
                  {isEn
                    ? "Discovering this natural pebble stream in Gia Nghia felt like a destined promise. Instead of clearing or paving the terrain with harsh concrete, we embraced nature gently: moss-covered basalt boulders, shade-bearing forest trees, and the clear stream waters running through pebble crevices were all preserved intact."
                    : "Cơ duyên tìm thấy khu đất nép bên khe suối tự nhiên tại Gia Nghĩa như một lời hẹn ước định mệnh. Thay vì san phẳng mặt bằng hay bê tông hóa thô bạo, chúng tôi chọn cách nương tựa vào mẹ thiên nhiên: từng phiến đá bazan phủ rêu xanh cổ kính, từng tán lộc vừng rợp bóng hay dòng nước róc rách luồn qua khe đá đều được bảo bọc nguyên vẹn."}
                </p>

                {/* Câu trích in nghiêng Fraunces 28px có vạch dọc bazan (Section 8.2.2) */}
                <div className="pt-4 border-l-4 border-[var(--basalt)] pl-5 my-6">
                  <p className="font-serif italic text-[22px] sm:text-[28px] text-[var(--ink)] leading-snug">
                    {isEn
                      ? "“To build is not to conquer, but to weave a sheltered terrace beneath the highland trees.”"
                      : "“Xây dựng không phải là chiếm đoạt, mà là thêu dệt một mái hiên che mưa nắng giữa rừng cây.”"}
                  </p>
                  <span className="block font-mono text-[13px] text-[var(--basalt)] mt-2 uppercase tracking-wider not-italic">
                    — Ngọc, Cẩm Cù House
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            8.2.3 CHƯƠNG 02: CÀ PHÊ RANG CỦI MỘC (CHẴN: CHỮ TRÁI CUỘN, ẢNH VÒM PHẢI DÍNH)
           ========================================================================= */}
        <section className="container-unified section-unified border-b border-[var(--line)]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
            {/* Chữ cuộn bên trái */}
            <div className="lg:col-span-7 flex flex-col gap-6 relative order-2 lg:order-1">
              {/* Số lớn "02" Fraunces 160px mờ */}
              <span className="font-serif text-[120px] sm:text-[160px] font-bold text-[var(--line)] leading-none select-none pointer-events-none -mb-16">
                02
              </span>

              <div className="flex items-center gap-3">
                <span className="font-mono text-xs font-bold text-[var(--basalt)] uppercase tracking-widest">
                  CHƯƠNG 02
                </span>
                <span className="w-8 h-[1px] bg-[var(--line)]" />
                <span className="font-mono text-xs text-[var(--ink-muted)] uppercase tracking-wider">
                  HỒN CỐT NÔNG SẢN CAO NGUYÊN
                </span>
              </div>

              <h2 className="font-serif text-[clamp(28px,3.8vw,44px)] font-bold text-[var(--ink)] leading-[1.15]">
                {isEn
                  ? "Firewood-Roasted Robusta & Pure Local Mountain Produce"
                  : "Cà Phê Robusta Rang Củi Mộc & Nông Sản Bản Địa"}
              </h2>

              <div className="space-y-4 text-[16px] sm:text-[17px] text-[var(--ink-muted)] leading-[1.7]">
                <p>
                  {isEn
                    ? "Dak Nong is globally renowned as the capital of specialty Robusta. At Cẩm Cù House, we say no to chemical additives, butter coatings, or artificial flavorings. Each coffee cherry is harvested at peak 100% ripeness, honey-processed, and hand-roasted over seasoned coffee wood."
                    : "Đắk Nông vốn là thủ phủ của những hạt Robusta phẩm chất cao nhất. Tại Cẩm Cù House, chúng tôi nói không với phụ gia, hương liệu bắp cau hay hóa chất. Từng quả cà phê chín mọng 100% được lên men tự nhiên và rang củi thủ công bằng than củi cà phê già."}
                </p>
                <p>
                  {isEn
                    ? "Besides artisanal coffee, our menu features local highland wellness sips like wild honey-soaked male papaya flower tea, 034 avocado smoothies, and hearty breakfasts that fuel adventurous travelers exploring the mountain passes."
                    : "Bên cạnh cà phê, ấm trà hoa đu đủ đực ngâm mật ong rừng, ly sinh tố bơ sáp 034 béo ngậy hay tô bò kho bánh mì nóng hổi ban mai đều mang theo hơi thở trong lành của núi rừng cao nguyên."}
                </p>

                {/* Câu trích in nghiêng Fraunces 28px có vạch dọc bazan */}
                <div className="pt-4 border-l-4 border-[var(--basalt)] pl-5 my-6">
                  <p className="font-serif italic text-[22px] sm:text-[28px] text-[var(--ink)] leading-snug">
                    “Vị cà phê nguyên bản không cần ồn ào; chỉ một ngụm thơm nồng củi khói cũng đủ giữ chân người qua đường.”
                  </p>
                  <span className="block font-mono text-[13px] text-[var(--basalt)] mt-2 uppercase tracking-wider not-italic">
                    — Nghệ nhân rang củi Cẩm Cù
                  </span>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Link
                  href="/menu"
                  className="btn-primary min-h-[48px] px-7 text-[15px] font-semibold"
                >
                  <span>{dict.common.viewMenu}</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            </div>

            {/* Ảnh vòm dính bên phải (Chương chẵn) */}
            <div className="lg:col-span-5 lg:sticky lg:top-28 order-1 lg:order-2">
              <div className="relative w-full aspect-[4/5] frame-arch border-2 border-[var(--line)] shadow-xl overflow-hidden bg-[var(--paper-2)]">
                <Image
                  src="/uploads/gallery/1788250253554-875120458.jpg"
                  alt="Hiên gỗ ven suối và ly cà phê rang củi"
                  fill
                  sizes="(max-width: 768px) 100vw, 440px"
                  className="object-cover"
                />
              </div>

              <div className="mt-4 flex items-center gap-3 text-[var(--basalt)]">
                <Coffee className="w-6 h-6" />
                <span className="font-mono text-xs uppercase tracking-widest text-[var(--ink-muted)]">
                  ROBUSTA RANG CỦI · 100% MỘC
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            8.2.4 CHƯƠNG 03: KHỞI SINH KHÔNG GIAN SINH THÁI (LẺ: ẢNH VÒM TRÁI DÍNH)
           ========================================================================= */}
        <section className="container-unified section-unified border-b border-[var(--line)]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
            {/* Ảnh vòm dính bên trái */}
            <div className="lg:col-span-5 lg:sticky lg:top-28">
              <div className="relative w-full aspect-[4/5] frame-arch border-2 border-[var(--line)] shadow-xl overflow-hidden bg-[var(--paper-2)]">
                <Image
                  src="/uploads/gallery/1788250253562-580915883.jpg"
                  alt="Dòng suối đá tự nhiên Cẩm Cù House"
                  fill
                  sizes="(max-width: 768px) 100vw, 440px"
                  className="object-cover"
                />
              </div>

              <div className="mt-4 flex items-center gap-3 text-[var(--stream)]">
                <ShieldCheck className="w-6 h-6" />
                <span className="font-mono text-xs uppercase tracking-widest text-[var(--ink-muted)]">
                  BẢO TỒN NGUYÊN VẸN ĐÁ BAZAN CỔ
                </span>
              </div>
            </div>

            {/* Chữ cuộn bên phải */}
            <div className="lg:col-span-7 flex flex-col gap-6 relative">
              {/* Số lớn "03" Fraunces 160px mờ */}
              <span className="font-serif text-[120px] sm:text-[160px] font-bold text-[var(--line)] leading-none select-none pointer-events-none -mb-16">
                03
              </span>

              <div className="flex items-center gap-3">
                <span className="font-mono text-xs font-bold text-[var(--stream)] uppercase tracking-widest">
                  CHƯƠNG 03
                </span>
                <span className="w-8 h-[1px] bg-[var(--line)]" />
                <span className="font-mono text-xs text-[var(--ink-muted)] uppercase tracking-wider">
                  BẢO TỒN DÒNG NƯỚC SUỐI
                </span>
              </div>

              <h2 className="font-serif text-[clamp(28px,3.8vw,44px)] font-bold text-[var(--ink)] leading-[1.15]">
                {isEn
                  ? "Eco Architecture & Living with the Natural Stream"
                  : "Khởi Sinh Không Gian Sinh Thái Bên Khe Suối Đá"}
              </h2>

              <div className="space-y-4 text-[16px] sm:text-[17px] text-[var(--ink-muted)] leading-[1.7]">
                <p>
                  Từng mét vuông tại Cẩm Cù House đều tuân thủ nguyên tắc tôn trọng địa hình cao nguyên. Chúng tôi không đắp đập ngăn suối, không dùng chất tẩy rửa xả thẳng ra nguồn nước, và tận dụng triệt để vật liệu mộc như gỗ thông, tre nứa, đá bazan nhặt từ lòng suối cạn.
                </p>
                <p>
                  Đến với Cẩm Cù House, bạn không chỉ thưởng thức ly cà phê, mà là hòa mình vào bản giao hưởng của tiếng nước chảy, tiếng gió xào xạc qua kẽ lá, và hít hà luồng không khí trong lành ở độ cao hơn 800m.
                </p>

                {/* Câu trích in nghiêng Fraunces 28px có vạch dọc bazan */}
                <div className="pt-4 border-l-4 border-[var(--basalt)] pl-5 my-6">
                  <p className="font-serif italic text-[22px] sm:text-[28px] text-[var(--ink)] leading-snug">
                    “Dòng suối mát lạnh nuôi dưỡng tâm hồn; hãy để thiên nhiên chữa lành những mỏi mệt sau chuỗi ngày bận rộn.”
                  </p>
                  <span className="block font-mono text-[13px] text-[var(--basalt)] mt-2 uppercase tracking-wider not-italic">
                    — Lời ngỏ Cẩm Cù House
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            8.2.5 ĐOẠN CHỮ LỚN: "DƯỚI BÓNG RỪNG TÂY NGUYÊN..." (WORD SCRUB 40PX)
           ========================================================================= */}
        <GoldenFlowerWordScrubSection isEn={isEn} />

        {/* =========================================================================
            8.2.6 LỜI HẸN ƯỚC (CHỮ DISPLAY, HAI NÚT, TEM TRÒN XOAY)
           ========================================================================= */}
        <section className="container-unified section-unified">
          <div className="card-accent rounded-[32px] p-8 sm:p-14 lg:p-16 text-center flex flex-col items-center relative overflow-hidden border border-[var(--line)] shadow-xl bg-[var(--paper-2)]">
            <ContourLines opacity={0.06} className="text-[var(--ink)]" />

            <div className="relative z-10 flex flex-col items-center max-w-2xl">
              {/* Tem tròn xoay */}
              <div className="mb-6">
                <RotatingSeal size={120} className="text-[var(--ink)]" />
              </div>

              <span className="font-mono text-xs uppercase tracking-widest text-[var(--basalt)] font-bold mb-3">
                {isEn ? "HIGHLAND PROMISE" : "LỜI HẸN ƯỚC BÊN SUỐI"}
              </span>

              <h2 className="font-serif text-[clamp(28px,4.5vw,48px)] font-bold text-[var(--ink)] leading-tight mb-4 text-balance">
                {isEn
                  ? "Cẩm Cù House Awaits Your Arrival Beside the Stream"
                  : "Cẩm Cù House Chờ Đón Bạn Bên Bờ Suối Mát"}
              </h2>

              <p className="text-[16px] sm:text-[17px] text-[var(--ink-muted)] mb-8 leading-relaxed max-w-xl">
                {dict.common.addressFull}. {isEn ? "Mon – Thu: 07:00 – 18:00 | Fri – Sun: 07:00 – 22:00" : "Thứ 2 – 5: 07:00 – 18:00 | Thứ 6 – CN: 07:00 – 22:00"}.
              </p>

              {/* Hai nút */}
              <div className="flex flex-wrap items-center justify-center gap-4">
                <a
                  href="tel:0382851688"
                  className="btn-primary min-h-[48px] px-8 text-[15px] font-semibold"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>Gọi Hotline: 038 285 1688</span>
                </a>
                <a
                  href="https://maps.google.com/?q=Hem+437+Hung+Vuong+Nghia+Trung+Gia+Nghia+Dak+Nong"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary min-h-[48px] px-8 text-[15px] font-semibold"
                >
                  <Navigation className="w-4 h-4 text-[var(--stream)]" />
                  <span>{dict.common.openGoogleMaps}</span>
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}