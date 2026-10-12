"use client";

import { useRef } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MaskRevealImage from "@/components/motion/MaskRevealImage";
import StaggerText, { StaggerParagraph } from "@/components/motion/StaggerText";
import { useLanguage } from "@/context/LanguageContext";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
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

function ScrollWord({
  word,
  range,
  progress,
}: {
  word: string;
  range: [number, number];
  progress: MotionValue<number>;
}) {
  // Bắt đầu từ 0.45 để đảm bảo độ tương phản tối thiểu >= 3:1 theo chuẩn WCAG
  const opacity = useTransform(progress, range, [0.45, 1]);
  return (
    <motion.span
      style={{ opacity }}
      className="inline-block transition-opacity font-serif font-bold text-2xl sm:text-3xl lg:text-4xl text-[#2D4233] dark:text-[#F5F4EE] mr-2 mb-2 leading-relaxed"
    >
      {word}
    </motion.span>
  );
}

function GoldenFlowerParallaxSection({ isEn }: { isEn: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.9", "end 0.2"],
  });

  const parallaxY = useTransform(scrollYProgress, [0, 1], [-35, 35]);

  const quote = isEn
    ? "Under the Central Highlands forest canopy, each yellow blossom and Hoya cluster blooms quietly, listening to the stream, weaving serenity for all who return."
    : "Dưới bóng rừng Tây Nguyên, từng khóm hoa chuông vàng rực rỡ và hoa Cẩm Cù kiên định nở son sắt bên bờ suối, dệt nên khoảng trời an yên cho mỗi bước chân dừng lại.";

  const words = quote.split(" ");

  return (
    <section
      ref={containerRef}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 w-full border-t border-stone-200/70 dark:border-stone-800"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        {/* Left Column: Chữ fill màu khi cuộn */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-100/80 dark:bg-amber-950/40 text-[#7D5E4A] dark:text-amber-300 text-xs font-bold uppercase tracking-wider w-fit border border-amber-200/60 dark:border-amber-800/40">
            <Flower2 className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>{isEn ? "Golden Blossom Scroll Reveal" : "Sắc Hoa & Dòng Suối Chảy"}</span>
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

          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 italic mt-2">
            {isEn
              ? "• Scroll to reveal the words and feel the mountain breath"
              : "• Cuộn trang để màu chữ lan dần theo nhịp thở núi rừng"}
          </p>
        </div>

        {/* Right Column: Ảnh hoa vàng Parallax */}
        <div className="lg:col-span-5 relative overflow-hidden rounded-3xl shadow-2xl border-4 border-white dark:border-stone-700/60 aspect-[4/5] bg-stone-100 dark:bg-stone-800">
          <motion.div
            style={{ y: parallaxY }}
            className="w-full h-[120%] -top-[10%] relative will-change-transform"
          >
            <img
              src="/uploads/gallery/1788250253557-29323827.jpg"
              alt="Băng Ghế Mộc Bên Vườn Hoa Vàng Cẩm Cù House"
              className="w-full h-full object-cover scale-105"
            />
          </motion.div>
          <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-t from-stone-950/85 via-stone-950/20 to-transparent flex flex-col justify-end p-6 text-white">
            <span className="text-xs text-amber-300 font-semibold uppercase tracking-wider">
              {isEn ? "Parallax View" : "Khung Cảnh Parallax"}
            </span>
            <p className="font-serif text-lg font-bold mt-1">
              {isEn
                ? "Golden Bell Blossoms by the Stream Hill"
                : "Vườn Hoa Chuông Vàng Ven Triền Suối"}
            </p>
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
    <div className="bg-[var(--bg)] min-h-screen text-[var(--text)] font-sans selection:bg-[var(--surface-2)] selection:text-[var(--text)] transition-colors duration-200">
      <main className="pt-20">
        {/* Top Narrative Intro */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-14 pb-12 w-full text-center">
          <div className="max-w-4xl mx-auto flex flex-col items-center">
            <div className="animate-fade-up-1 flex flex-col items-center">
              <div className="badge-unified mb-4">
                <span className="w-2 h-2 rounded-full bg-[var(--accent-green)] animate-pulse" />
                <span>{isEn ? "Sentiment from the Highlands" : "Tâm tình từ cao nguyên"}</span>
                <span className="text-[var(--text-muted)]">•</span>
                <span>Gia Nghĩa, Đắk Nông</span>
              </div>

              <StaggerText
                as="h1"
                lines={[dict.about.title, dict.about.subtitle]}
                stagger={0.1}
                className="font-serif text-[clamp(36px,5vw,64px)] text-[var(--text)] font-bold tracking-tight max-w-[900px] mb-4 leading-[1.15] text-balance"
                lineClassName="leading-tight"
              />

              <div className="max-w-2xl mt-2">
                <StaggerParagraph
                  text={dict.about.description}
                  className="text-[15px] sm:text-[17px] text-[var(--text-muted)] leading-[1.7] max-w-[65ch] font-medium"
                  delay={0.2}
                />
              </div>
            </div>

            {/* Coordinates & Badges */}
            <div className="animate-fade-up-2 flex flex-wrap items-center justify-center gap-2.5 mt-6 text-xs font-semibold">
              <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-[var(--surface)] border border-[var(--border)] rounded-full shadow-sm text-[var(--text)]">
                <Flower2 className="w-4 h-4 text-[var(--accent-green)]" />
                {dict.about.hoyaFlower}
              </span>
              <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-[var(--surface)] border border-[var(--border)] rounded-full shadow-sm text-[var(--text)]">
                <Droplets className="w-4 h-4 text-[var(--accent-green)]" />
                {dict.about.pureStream}
              </span>
              <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-[var(--surface)] border border-[var(--border)] rounded-full shadow-sm text-[var(--text)]">
                <Coffee className="w-4 h-4 text-[#CC7755]" />
                {isEn ? "Firewood-Roasted Robusta" : "Robusta rang củi mộc"}
              </span>
            </div>
          </div>
        </section>

        {/* SECTION 1: Hành Trình Khởi Sinh */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Text Column (Stagger 2: 120ms) */}
            <div className="lg:col-span-7 flex flex-col gap-5 animate-fade-up-2">
              <div className="flex items-center gap-3">
                <span className="text-[12px] font-bold text-[var(--accent-green)] uppercase tracking-[0.12em]">
                  {isEn ? "Origins" : "Khối 01"}
                </span>
                <span className="w-8 h-[1px] bg-[var(--border)]" />
                <span className="text-xs text-[var(--text-muted)]">
                  {isEn ? "The Magic of Nature" : "Sự Kỳ Diệu Của Tự Nhiên"}
                </span>
              </div>

              <h2 className="font-serif text-[clamp(28px,3.8vw,44px)] text-[var(--text)] font-bold leading-[1.2]">
                {isEn
                  ? "Resilient Blossoms & A Destiny Beside the Rock Stream"
                  : "Loài Hoa Bền Bỉ & Mối Duyên Lành Bên Dòng Suối"}
              </h2>

              <div className="space-y-4 text-[15px] sm:text-[17px] text-[var(--text-muted)] leading-[1.7] font-medium">
                <p>
                  {isEn ? (
                    <>
                      The name <strong className="font-semibold text-[var(--accent-green)]">&ldquo;Cam Cu&rdquo; (Hoya carnosa)</strong> originates from a modest native climbing vine thriving under the canopy of the Central Highlands forest. Rather than boasting loud colors, the Hoya flower patiently collects morning dew to blossom into spherical porcelain-like star clusters. In highland folk beliefs, these spherical clusters symbolize steadfast connection, heartfelt warmth, and profound peace of mind.
                    </>
                  ) : (
                    <>
                      Tên gọi <strong className="font-semibold text-[var(--accent-green)]">&ldquo;Cẩm Cù&rdquo; (Hoya carnosa)</strong> bắt nguồn từ một loài hoa dây leo mộc mạc nép mình dưới bóng rừng Tây Nguyên. Không ồn ào khoe sắc, hoa Cẩm Cù kiên định chắt chiu sương sớm qua từng năm tháng để nở thành từng chùm hình cầu lung linh tựa cánh sứ ngũ giác. Trong phong thủy và tâm thức người bản địa, chùm hoa hình tròn trọn vẹn là biểu tượng của sự gắn kết son sắt, ấm cúng và sự an yên thanh thản sâu trong tâm hồn.
                    </>
                  )}
                </p>
                <p>
                  {isEn
                    ? "Discovering this natural pebble stream in Gia Nghia felt like a destined promise. Instead of clearing or paving the terrain with harsh concrete, we embraced nature gently: moss-covered basalt boulders, shade-bearing forest trees, and the clear stream waters running through pebble crevices were all preserved intact."
                    : "Cơ duyên tìm thấy khu đất nép bên khe suối tự nhiên tại Gia Nghĩa như một lời hẹn ước định mệnh. Thay vì san phẳng mặt bằng hay bê tông hóa thô bạo, chúng tôi chọn cách nương tựa vào mẹ thiên nhiên: từng phiến đá bazan phủ rêu xanh cổ kính, từng tán lộc vừng rợp bóng hay dòng nước róc rách luồn qua khe đá đều được bảo bọc nguyên vẹn."}
                </p>
                <div className="pt-2 border-l-4 border-[var(--accent-clay)] pl-4">
                  <p className="italic text-[var(--text)] font-serif text-[20px] leading-relaxed">
                    {isEn
                      ? "“To build is not to conquer, but to weave a sheltered terrace beneath the highland trees.”"
                      : "“Xây dựng không phải là chiếm đoạt, mà là thêu dệt một mái hiên che mưa nắng giữa rừng cây.”"}
                  </p>
                  <span className="block text-[14px] font-medium text-[var(--text-muted)] mt-1 font-sans not-italic">
                    — Ngọc, Cẩm Cù House
                  </span>
                </div>
              </div>

              {/* Story Fact Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="card-unified !p-5 flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-[var(--surface-2)] text-[var(--accent-green)] flex items-center justify-center shrink-0">
                    <Trees className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[17px] text-[var(--text)]">
                      {isEn ? "Pristine Basalt Terrain" : "Địa hình bazan nguyên vẹn"}
                    </h3>
                    <p className="text-[14px] font-medium text-[var(--text-muted)] mt-0.5">
                      {isEn ? "100% natural landscape preserved" : "Không can thiệp san lấp phá vỡ dòng chảy"}
                    </p>
                  </div>
                </div>

                <div className="card-unified !p-5 flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-[var(--surface-2)] text-[var(--accent-green)] flex items-center justify-center shrink-0">
                    <Heart className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[17px] text-[var(--text)]">
                      {isEn ? "Living Eco Architecture" : "Kiến trúc xanh cộng sinh"}
                    </h3>
                    <p className="text-[14px] font-medium text-[var(--text-muted)] mt-0.5">
                      {isEn ? "Local wood, bamboo, and thatched roofing" : "Gỗ tái sinh, tre nứa và mái tranh mộc mạc"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Visual Column (Stagger 3: 200ms) - Mask Reveal Image */}
            <div className="lg:col-span-5 relative animate-fade-up-3">
              <div className="rounded-[24px] overflow-hidden shadow-2xl border border-[var(--border)] aspect-[4/5] relative">
                <MaskRevealImage
                  src="/uploads/gallery/1788250253557-29323827.jpg"
                  alt="Không gian mộc mạc Cẩm Cù House"
                  aspectRatio="aspect-[4/5]"
                />
                <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-t from-stone-950/85 via-transparent to-transparent flex flex-col justify-end p-6 text-white">
                  <span className="text-[12px] uppercase tracking-[0.12em] text-[var(--accent-green)] font-semibold">
                    {isEn ? "The Story of Cẩm Cù" : "Chuyện Cẩm Cù"}
                  </span>
                  <p className="font-serif text-lg font-bold mt-1 text-[#F3EBD8]">
                    {isEn
                      ? "Gentle Morning Sunlight by the Flowing Stream"
                      : "Nắng Sớm Bên Dòng Suối Reo"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 1.5: Sắc Hoa Chuông Vàng Parallax & Chữ Fill Màu Khi Cuộn */}
        <GoldenFlowerParallaxSection isEn={isEn} />

        {/* SECTION 2: Triết Lý Cà Phê Mộc & Ẩm Thực Lành */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 w-full border-t border-[var(--border)]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Visual Column - Mask Reveal Image */}
            <div className="lg:col-span-5 order-2 lg:order-1">
              <div className="rounded-[24px] overflow-hidden shadow-2xl border border-[var(--border)] aspect-[4/5] relative">
                <MaskRevealImage
                  src="/uploads/gallery/1788250253554-875120458.jpg"
                  alt="Hiên gỗ ven suối Cẩm Cù House"
                  aspectRatio="aspect-[4/5]"
                />
                <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-t from-stone-950/85 via-transparent to-transparent flex flex-col justify-end p-6 text-white">
                  <span className="text-[12px] uppercase tracking-[0.12em] text-[var(--accent-green)] font-semibold">
                    {isEn ? "Artisanal Craft" : "Rang Củi Thủ Công"}
                  </span>
                  <p className="font-serif text-lg font-bold mt-1 text-[#F3EBD8]">
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
                <span className="text-[12px] font-bold text-[#CC7755] uppercase tracking-[0.12em]">
                  {isEn ? "Coffee Craft" : "Khối 02"}
                </span>
                <span className="w-8 h-[1px] bg-[var(--border)]" />
                <span className="text-xs text-[var(--text-muted)]">
                  {isEn ? "Local Highland Heritage" : "Hồn Cốt Nông Sản Cao Nguyên"}
                </span>
              </div>

              <h2 className="font-serif text-[clamp(28px,3.8vw,44px)] text-[var(--text)] font-bold leading-[1.2]">
                {isEn
                  ? "Firewood-Roasted Robusta & Pure Local Mountain Produce"
                  : "Cà Phê Robusta Rang Củi Mộc & Nông Sản Bản Địa"}
              </h2>

              <div className="space-y-4 text-[15px] sm:text-[17px] text-[var(--text-muted)] leading-[1.7]">
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
              </div>

              {/* 2 nút: Xem Thực Đơn chính, Khám Phá Góc Suối phụ */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <Link
                  href="/menu"
                  className="btn-primary min-h-[44px] px-6 text-sm font-bold shadow-md"
                >
                  <span>{dict.common.viewMenu}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/space"
                  className="btn-secondary min-h-[44px] px-6 text-sm font-semibold"
                >
                  <span>{dict.common.exploreStream}</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 3: Lời Hẹn Ước (khối nền --surface-2 căn giữa, tiêu đề 36px + địa chỉ + 2 nút) */}
        <section className="section-unified">
          <div className="container-unified">
            <div className="card-accent text-center flex flex-col items-center">
              <span className="badge-unified mb-3">
                {isEn ? "Highland Hospitality" : "Lời Hẹn Ước"}
              </span>
              <h2 className="font-serif text-[clamp(26px,3.5vw,36px)] font-bold text-[var(--text)] max-w-2xl mb-4 leading-tight">
                {isEn
                  ? "Cẩm Cù House Awaits Your Arrival Beside the Stream"
                  : "Cẩm Cù House Chờ Đón Bạn Bên Bờ Suối Mát"}
              </h2>
              <p className="text-[15px] sm:text-[16px] font-medium text-[var(--text-muted)] max-w-xl mb-8 leading-relaxed">
                {dict.common.addressFull}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <a
                  href="tel:0382851688"
                  className="btn-primary min-h-[44px] px-7 text-sm font-bold shadow-md"
                >
                  <PhoneCall className="w-4 h-4 text-[#1B120E]" />
                  <span>{isEn ? "Call Hotline: 038 285 1688" : "Gọi Hotline: 038 285 1688"}</span>
                </a>
                <a
                  href="https://maps.google.com/?q=Hem+437+Hung+Vuong+Nghia+Trung+Gia+Nghia+Dak+Nong"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary min-h-[44px] px-7 text-sm font-semibold shadow-sm"
                >
                  <Navigation className="w-4 h-4 text-[var(--accent-green)]" />
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