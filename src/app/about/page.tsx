"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import SafeImage from "@/components/ui/SafeImage";
import Footer from "@/components/Footer";
import StarHoya from "@/components/ui/StarHoya";
import { useLanguage } from "@/context/LanguageContext";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import {
  PhoneCall,
  Navigation,
  ArrowRight,
  Compass
} from "lucide-react";

function WordScrubSpan({
  word,
  range,
  progress,
}: {
  word: string;
  range: [number, number];
  progress: MotionValue<number>;
}) {
  // Chữ chưa sáng >= 3:1 (kem .40), chữ đã sáng kem đặc #F4EEE2 (Mục C7 & C8)
  const opacity = useTransform(progress, range, [0.4, 1]);

  return (
    <motion.span
      style={{ opacity }}
      className="inline-block mr-[0.3em] font-display font-extrabold text-[clamp(28px,4.5vw,56px)] uppercase tracking-tight leading-[1.12] text-[#F4EEE2]"
    >
      {word}
    </motion.span>
  );
}

function CinematicQuoteSection({ isEn }: { isEn: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.85", "end 0.3"],
  });

  const quote = isEn
    ? "Under the Central Highlands forest canopy, each golden bloom and wild Hoya cluster flourishes by the rocky stream, crafting an enduring haven of peace for every traveler."
    : "Dưới bóng rừng Tây Nguyên, từng khóm hoa chuông vàng rực rỡ và hoa Cẩm Cù kiên định nở son sắt bên bờ suối đá, dệt nên khoảng trời an yên cho mỗi bước chân dừng lại.";

  const words = quote.split(" ");

  return (
    <section
      ref={containerRef}
      className="relative w-full py-32 sm:py-44 bg-[#0A0E0C] text-[#F4EEE2] overflow-hidden border-y border-[var(--line-on-dark)]"
    >
      {/* Nền ảnh phủ tối gradient .35–.55 (Mục C7) */}
      <div className="absolute inset-0 pointer-events-none select-none z-0">
        <SafeImage
          src="/uploads/gallery/1788250253557-29323827.jpg"
          alt={isEn ? "Under the forest canopy" : "Dưới bóng rừng Tây Nguyên"}
          fill
          className="object-cover opacity-25 filter brightness-75 contrast-125"
        />
        <div className="absolute inset-0 bg-black/45" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0E0C]/55 via-black/35 to-[#0A0E0C]/55" />
      </div>

      <div className="w-full max-w-[1360px] mx-auto px-5 sm:px-10 relative z-10">
        <div className="max-w-4xl flex flex-col gap-8">
          <div className="inline-flex items-center gap-2 font-mono text-[12px] uppercase tracking-widest text-[var(--ember)]">
            <span>{isEn ? "[HIGHLAND MANIFESTO]" : "[TUYÊN NGÔN ĐẠI NGÀN]"}</span>
            <span>·</span>
            <span>{isEn ? "ALTITUDE 800M+" : "ĐỘ CAO 800M+"}</span>
          </div>

          <div className="flex flex-wrap">
            {words.map((word, i) => {
              const start = i / words.length;
              const end = Math.min((i + 1) / words.length, 1);
              return (
                <WordScrubSpan
                  key={i}
                  word={word}
                  range={[start, end]}
                  progress={scrollYProgress}
                />
              );
            })}
          </div>

          <p className="font-mono text-xs text-[rgba(244,238,226,0.85)] uppercase tracking-wider">
            {isEn
              ? "• SCROLL TO REVEAL EACH WORD WITH THE MOUNTAIN'S BREATH"
              : "• CUỘN ĐỂ TỪNG TỪ BỪNG SÁNG THEO NHỊP THỞ NÚI RỪNG"}
          </p>
        </div>
      </div>
    </section>
  );
}

export default function AboutPage() {
  const { locale, dict } = useLanguage();
  const isEn = locale === "en";

  return (
    <div className="bg-[var(--bg)] min-h-screen text-[var(--ink)] selection:bg-[var(--ember)] selection:text-[#0A0E0C] transition-colors overflow-x-hidden">
      <main className="overflow-x-hidden">
        {/* =========================================================================
            1. MỞ ĐẦU TỐI (SECTION 8.2.1)
           ========================================================================= */}
        <section className="hero-dark-surface relative pt-36 sm:pt-44 pb-20 border-b border-[var(--line)] bg-[#0A0E0C] text-[#F2EDE4] overflow-hidden">
          {/* Chữ ghost CẨM CÙ HOUSE độ mờ .16 */}
          <div
            aria-hidden="true"
            className="hero-ghost-text absolute bottom-4 left-1/2 -translate-x-1/2 w-full max-w-[1200px] flex justify-center pointer-events-none select-none"
          >
            <svg viewBox="0 0 1200 120" className="w-full h-auto max-h-[160px] overflow-visible" fill="currentColor">
              <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fontWeight="800">CẨM{"\u00A0"}CÙ HOUSE</text>
            </svg>
          </div>

          <div className="w-full max-w-[1360px] mx-auto px-5 sm:px-10 relative z-10">
            <div className="flex flex-col gap-6 max-w-4xl">
              {/* Nhãn mono */}
              <div className="inline-flex items-center gap-2 font-mono text-[12px] uppercase tracking-widest text-[var(--ember)]">
                <Compass className="w-3.5 h-3.5 text-[var(--ember)]" />
                <span>[TÂM TÌNH CAO NGUYÊN · 11.99° N · 107.69° E]</span>
              </div>

              {/* H1 CÂU CHUYỆN CẨM CÙ tràn ngang + Chốn Bình Yên Giữa Đất Ngàn */}
              <div className="flex flex-col gap-3 sm:gap-4">
                <h1 className="font-display font-black text-[clamp(40px,8vw,100px)] uppercase tracking-tight text-[var(--ink-on-dark)] leading-[1.18] pt-1">
                  CÂU CHUYỆN CẨM CÙ
                </h1>
                <p className="font-serif italic text-[clamp(24px,3.5vw,42px)] text-[var(--ember)]">
                  Chốn Bình Yên Giữa Đất Ngàn
                </p>
              </div>

              {/* Mô tả */}
              <p className="text-[17px] sm:text-[18px] text-[var(--ink-muted)] leading-[1.7] max-w-[62ch]">
                {dict.about.description}
              </p>

              {/* 3 Badge Mono */}
              <div className="flex flex-wrap items-center gap-4 pt-6 border-t border-[var(--line-on-dark)] font-mono text-[12.5px] uppercase tracking-wider text-[var(--ink-on-dark)]">
                <span className="px-3.5 py-1.5 bg-[#0A0E0C]/65 border border-[var(--line-on-dark)] text-[var(--ink-on-dark)]">
                  [01 HOA CẨM CÙ BỀN BỈ]
                </span>
                <span className="px-3.5 py-1.5 bg-[#0A0E0C]/65 border border-[var(--line-on-dark)] text-[var(--ink-on-dark)]">
                  [02 SUỐI ĐÁ NGUYÊN BẢN]
                </span>
                <span className="px-3.5 py-1.5 bg-[#0A0E0C]/65 border border-[var(--line-on-dark)] text-[var(--ink-on-dark)]">
                  [03 ROBUSTA RANG CỦI]
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            2. CHƯƠNG 01: HOA CẨM CÙ & NGUỒN CỘI (ẢNH TRÁI, CHỮ PHẢI)
           ========================================================================= */}
        <section className="w-full py-28 sm:py-36 border-b border-[var(--line)] relative bg-[var(--bg)] transition-colors">
          <div className="w-full max-w-[1360px] mx-auto px-5 sm:px-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
              {/* Trái: Ảnh dính cắt chéo */}
              <div className="lg:col-span-6 lg:sticky lg:top-28">
                <div className="relative aspect-[4/3] sm:aspect-[16/11] overflow-hidden clip-chamfer-14 border border-[var(--line)] shadow-2xl">
                  <SafeImage
                    src="/uploads/gallery/1788250253557-29323827.jpg"
                    alt="Khóm hoa Cẩm Cù và hoa chuông vàng"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute bottom-4 left-4 font-mono text-[11px] text-white/90 bg-black/60 px-3 py-1 backdrop-blur-sm">
                    [CHƯƠNG 01] VƯỜN HOA VEN SUỐI
                  </div>
                </div>
              </div>

              {/* Phải: Số outline Display + Chữ cuộn */}
              <div className="lg:col-span-6 flex flex-col gap-6">
                <span
                  className="font-display font-black text-[96px] sm:text-[120px] leading-none select-none"
                  style={{
                    WebkitTextStroke: "1.5px var(--ember)",
                    color: "transparent",
                  }}
                >
                  01
                </span>

                <span className="font-mono text-[12px] uppercase tracking-widest text-[var(--ember)] font-bold">
                  SỨC SỐNG BỀN BỈ CỦA HOA CẨM CÙ
                </span>

                <h2 className="font-display font-black text-[32px] sm:text-[44px] uppercase tracking-tight text-[var(--ink)] leading-tight">
                  {dict.home.pillar1Title || (isEn ? "Resilient Hoya Blooms" : "Sức Sống Bền Bỉ Của Hoa Cẩm Cù")}
                </h2>

                {/* Câu trích italic 32px vạch ember */}
                <blockquote className="border-l-2 border-[var(--ember)] pl-6 text-[clamp(20px,2.5vw,30px)] font-serif italic text-[var(--ink)] leading-snug">
                  &ldquo;Loài hoa của sự kiên cường và tình cảm son sắt, vươn mình rực rỡ từ những vách đá cằn cỗi.&rdquo;
                </blockquote>

                <p className="text-[16px] sm:text-[17px] text-[var(--ink-muted)] leading-relaxed">
                  {dict.about.hoyaFlower || dict.home.pillar1Desc}
                </p>

                <p className="text-[16px] sm:text-[17px] text-[var(--ink-muted)] leading-relaxed">
                  Cẩm Cù House được đặt tên theo loài hoa leo bền bỉ ấy. Dù trải qua bao mùa nắng gió cao nguyên, từng chùm hoa hình ngôi sao năm cánh vẫn nhẫn nại bung tỏa hương thơm dịu ngọt, chở che cho những tâm hồn mỏi mệt tìm về.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            3. CHƯƠNG 02: DÒNG SUỐI ĐÁ & NĂNG LƯỢNG MÁT LÀNH (CHỮ TRÁI, ẢNH PHẢI)
           ========================================================================= */}
        <section className="w-full py-28 sm:py-36 border-b border-[var(--line)] relative bg-[var(--bg-2)] transition-colors">
          <div className="w-full max-w-[1360px] mx-auto px-5 sm:px-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
              {/* Trái: Số outline Display + Chữ cuộn */}
              <div className="lg:col-span-6 flex flex-col gap-6 order-2 lg:order-1">
                <span
                  className="font-display font-black text-[96px] sm:text-[120px] leading-none select-none"
                  style={{
                    WebkitTextStroke: "1.5px var(--ember)",
                    color: "transparent",
                  }}
                >
                  02
                </span>

                <span className="font-mono text-[12px] uppercase tracking-widest text-[var(--ember)] font-bold">
                  DÒNG NƯỚC MÁT LÀNH NGUYÊN SƠ
                </span>

                <h2 className="font-display font-black text-[32px] sm:text-[44px] uppercase tracking-tight text-[var(--ink)] leading-tight">
                  {dict.home.pillar2Title || (isEn ? "Pristine Stream Water" : "Dòng Nước Mát Lành Nguyên Sơ")}
                </h2>

                <blockquote className="border-l-2 border-[var(--ember)] pl-6 text-[clamp(20px,2.5vw,30px)] font-serif italic text-[var(--ink)] leading-snug">
                  &ldquo;Nước suối reo từ khe đá bazan, mang trọn hơi thở đại ngàn xoa dịu mọi âu lo.&rdquo;
                </blockquote>

                <p className="text-[16px] sm:text-[17px] text-[var(--ink-muted)] leading-relaxed">
                  {dict.about.pureStream || dict.home.pillar2Desc}
                </p>

                <p className="text-[16px] sm:text-[17px] text-[var(--ink-muted)] leading-relaxed">
                  Chúng tôi gìn giữ nguyên vẹn lòng suối tự nhiên với những tảng đá mộc phủ rêu. Ngồi trên sàn gỗ, thả lỏng đôi chân chạm vào dòng nước trong vắt, bạn sẽ cảm nhận rõ rệt nhịp đập của đất mẹ Tây Nguyên.
                </p>
              </div>

              {/* Phải: Ảnh dính cắt chéo */}
              <div className="lg:col-span-6 lg:sticky lg:top-28 order-1 lg:order-2">
                <div className="relative aspect-[4/3] sm:aspect-[16/11] overflow-hidden clip-chamfer-14 border border-[var(--line)] shadow-2xl">
                  <SafeImage
                    src="/uploads/gallery/1788250253562-580915883.jpg"
                    alt="Dòng suối đá tự nhiên Cẩm Cù House"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute bottom-4 left-4 font-mono text-[11px] text-white/90 bg-black/60 px-3 py-1 backdrop-blur-sm">
                    [CHƯƠNG 02] BỜ SUỐI ĐÁ TỰ NHIÊN
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            4. CHƯƠNG 03: HƯƠNG CÀ PHÊ RANG CỦI & NGHỈ DƯỠNG (ẢNH TRÁI, CHỮ PHẢI)
           ========================================================================= */}
        <section className="w-full py-28 sm:py-36 border-b border-[var(--line)] relative bg-[var(--bg)] transition-colors">
          <div className="w-full max-w-[1360px] mx-auto px-5 sm:px-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
              {/* Trái: Ảnh dính cắt chéo */}
              <div className="lg:col-span-6 lg:sticky lg:top-28">
                <div className="relative aspect-[4/3] sm:aspect-[16/11] overflow-hidden clip-chamfer-14 border border-[var(--line)] shadow-2xl">
                  <SafeImage
                    src="/uploads/gallery/1788250253551-943009233.jpg"
                    alt="Cà phê rang củi bên hiên suối"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute bottom-4 left-4 font-mono text-[11px] text-white/90 bg-black/60 px-3 py-1 backdrop-blur-sm">
                    [CHƯƠNG 03] KHÓI CỦI & CÀ PHÊ MỘC
                  </div>
                </div>
              </div>

              {/* Phải: Số outline Display + Chữ cuộn */}
              <div className="lg:col-span-6 flex flex-col gap-6">
                <span
                  className="font-display font-black text-[96px] sm:text-[120px] leading-none select-none"
                  style={{
                    WebkitTextStroke: "1.5px var(--ember)",
                    color: "transparent",
                  }}
                >
                  03
                </span>

                <span className="font-mono text-[12px] uppercase tracking-widest text-[var(--ember)] font-bold">
                  HƯƠNG VỊ RANG CỦI NỒNG NÀN
                </span>

                <h2 className="font-display font-black text-[32px] sm:text-[44px] uppercase tracking-tight text-[var(--ink)] leading-tight">
                  {dict.home.pillar3Title || (isEn ? "Wood-Fired Roasted Coffee" : "Hương Vị Rang Củi Nồng Nàn")}
                </h2>

                <blockquote className="border-l-2 border-[var(--ember)] pl-6 text-[clamp(20px,2.5vw,30px)] font-serif italic text-[var(--ink)] leading-snug">
                  &ldquo;Từng giọt cà phê mộc sánh đậm hòa vào làn khói củi sớm, đượm sâu vị đất trời.&rdquo;
                </blockquote>

                <p className="text-[16px] sm:text-[17px] text-[var(--ink-muted)] leading-relaxed">
                  {dict.home.pillar3Desc}
                </p>

                <p className="text-[16px] sm:text-[17px] text-[var(--ink-muted)] leading-relaxed">
                  Không hương liệu công nghiệp, không phụ gia. Từng hạt Robusta Đắk Nông được chế biến cẩn trọng, giữ trọn hậu vị ngọt thanh và hương thơm đặc trưng của ngọn lửa rừng.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            5. CẢNH CHỮ LỚN: DƯỚI BÓNG RỪNG TÂY NGUYÊN (SECTION 8.2.3)
           ========================================================================= */}
        <CinematicQuoteSection isEn={isEn} />

        {/* =========================================================================
            6. LỜI HẸN ƯỚC: NỀN --PINE (SECTION 8.2.4)
           ========================================================================= */}
        <section className="w-full py-28 sm:py-36 bg-[var(--pine)] text-[#F2EDE4] relative overflow-hidden text-center">
          <div className="w-full max-w-[1000px] mx-auto px-5 sm:px-10 relative z-10 flex flex-col items-center gap-6">
            <div className="w-12 h-12 rounded-sm border border-white/20 bg-black/20 flex items-center justify-center text-[var(--ember-on-dark)] mb-2">
              <StarHoya size={24} strokeWidth={2} />
            </div>

            <span className="font-mono text-[12.5px] uppercase tracking-widest font-bold" style={{ color: "var(--mist-on-dark)" }}>
              [LỜI HẸN ƯỚC TỪ CẨM CÙ HOUSE]
            </span>

            <h2 className="font-display font-black text-[clamp(32px,6vw,72px)] uppercase tracking-tight leading-tight" style={{ color: "#F2EDE4" }}>
              HẸN BẠN MỘT NGÀY THẢNH THƠI BÊN SUỐI
            </h2>

            <p className="text-[16px] sm:text-[18px] max-w-xl leading-relaxed" style={{ color: "rgba(242, 237, 228, 0.85)" }}>
              Cẩm Cù House luôn sẵn sàng đón chào bạn cùng gia đình ghé chơi, thưởng thức tách cà phê rang củi và hít thở bầu không khí tinh khôi nơi đại ngàn.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <a
                href="tel:0382851688"
                className="inline-flex items-center gap-2.5 px-8 py-4 bg-[var(--ember-on-dark)] text-[#0A0E0C] font-sans font-bold text-[15px] uppercase tracking-wider clip-chamfer-14 hover:opacity-90 active:scale-95 transition-all shadow-xl"
              >
                <PhoneCall className="w-4 h-4 text-[#0A0E0C]" />
                <span style={{ color: "#0A0E0C" }}>GỌI HOTLINE 038 285 1688</span>
              </a>

              <Link
                href="/space"
                className="inline-flex items-center gap-2.5 px-8 py-4 bg-transparent border border-[var(--line-on-dark)] text-[var(--ink-on-dark)] font-sans font-bold text-[15px] uppercase tracking-wider clip-chamfer-14 hover:bg-white hover:text-[var(--pine)] transition-all"
              >
                <span>XEM KHÔNG GIAN SUỐI</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}