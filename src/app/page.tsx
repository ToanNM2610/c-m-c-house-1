"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { cinematicTransition, slowCinematicTransition } from "@/components/motion/config";
import { useScene } from "@/context/SceneContext";

const SUBHEADING_STYLE = "font-sans text-xs tracking-[0.25em] uppercase text-[#C88A4B] font-medium block";

export default function HomePage() {
  const { t } = useLanguage();
  const { scrollY } = useScroll();
  const { introState, setIntroState, setScrollProgress } = useScene();

  useEffect(() => {
    if (introState === "darkness") {
      const t1 = setTimeout(() => setIntroState("light"), 1500);
      const t2 = setTimeout(() => setIntroState("reveal"), 4000);
      const t3 = setTimeout(() => setIntroState("enter"), 6500);
      const t4 = setTimeout(() => setIntroState("done"), 8000);
      
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
        clearTimeout(t4);
      };
    }
  }, [introState, setIntroState]);

  useEffect(() => {
    const handleScroll = () => {
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      setScrollProgress(Math.min(window.scrollY / maxScroll, 1));
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [setScrollProgress]);

  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);
  const heroY = useTransform(scrollY, [0, 400], [0, -50]);
  
  const isLocked = introState !== "enter" && introState !== "done";
  const isReady = introState === "enter" || introState === "done";

  return (
    <div className={`w-full text-[#FDFBF7] relative z-10 ${isLocked ? 'h-screen overflow-hidden' : ''}`}>
      
      {/* ── STAGE 01-03: THE BLACK OVERLAY ── */}
      <AnimatePresence>
        {(introState === "darkness" || introState === "light") && (
          <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2, ease: "easeInOut" }}
            className="fixed inset-0 bg-[#0a0705] z-50 pointer-events-none flex items-center justify-center"
          >
            {introState === "light" && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 2, ease: "easeOut" }}
                className="w-1 h-1 bg-[#ffb870] rounded-full shadow-[0_0_20px_4px_#ffb870]"
              ></motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* =========================================
          SECTION 1: HERO SECTION
      ========================================= */}
      <section className="relative w-full h-screen flex flex-col items-center justify-center px-6 pointer-events-none">
        {/* Background gradient hint */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#c88a4b]/5 via-[#0a0705]/80 to-[#0a0705] z-0"></div>

        <motion.div 
          style={{ opacity: heroOpacity, y: heroY }}
          className="flex flex-col items-center text-center pointer-events-auto relative z-10"
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: isReady ? 1 : 0, y: isReady ? 0 : 30 }}
            transition={slowCinematicTransition}
            className="flex flex-col items-center"
          >
            <span className={SUBHEADING_STYLE + " mb-8"}>
              TỌA ĐỘ 11.99° N, 107.69° E • GIA NGHĨA, ĐẮK NÔNG
            </span>
            <h1 className="font-serif text-5xl sm:text-7xl lg:text-9xl font-semibold tracking-wide uppercase mb-6 text-[#F5EFEB] drop-shadow-lg">
              CẨM CÙ HOUSE
            </h1>
            <p className="font-sans text-lg sm:text-xl font-light text-[#FDFBF7]/80 leading-relaxed max-w-lg">
              Chốn dừng chân mộc mạc bên bờ suối đá.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isReady ? 1 : 0 }}
            transition={{ ...cinematicTransition, delay: 0.5 }}
            className="mt-16 flex flex-col sm:flex-row gap-6"
          >
            <Link
              href="/space"
              data-cursor="explore"
              className="inline-flex items-center justify-center px-10 py-4 bg-[#C88A4B] text-[#0a0705] font-sans font-medium rounded-full shadow-lg hover:shadow-[#C88A4B]/20 hover:-translate-y-1 transition-all duration-300"
            >
              Khám Phá Không Gian
            </Link>
            <Link
              href="/menu"
              data-cursor="explore"
              className="inline-flex items-center justify-center px-10 py-4 bg-transparent border border-[#F5EFEB]/30 text-[#F5EFEB] font-sans font-medium rounded-full hover:bg-[#FDFBF7]/10 hover:border-[#FDFBF7]/50 backdrop-blur-sm transition-all duration-300"
            >
              Xem Thực Đơn
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* =========================================
          SECTION 2: CHUYỆN BÊN BỜ SUỐI (VIBE & NATURE)
      ========================================= */}
      <section className="relative py-32 px-6 sm:px-12 lg:px-24 bg-[#0a0705] pointer-events-auto">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={cinematicTransition}
            className="md:col-span-5 relative w-full aspect-[4/5] rounded-2xl overflow-hidden border border-[#C88A4B]/15"
          >
            <Image
              src="/uploads/gallery/1788250253551-943009233.jpg"
              alt="Bờ suối đá"
              fill
              loading="lazy"
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover hover:scale-105 transition-transform duration-1000"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={cinematicTransition}
            className="md:col-span-7 flex flex-col justify-center"
          >
            <span className={SUBHEADING_STYLE + " mb-4"}>Vibe & Nature</span>
            <h2 className="font-serif text-3xl sm:text-5xl font-medium text-[#F5EFEB] mb-8 leading-tight">
              LẮNG NGHE TIẾNG SUỐI NGUỒN
            </h2>
            <p className="font-sans font-light text-[#FDFBF7]/70 text-lg leading-relaxed mb-6">
              Không gian đón gió mát lành, hoa lá đại ngàn che bóng mát, nơi bạn tạm gác lại những xô bồ thường nhật để tìm về sự tĩnh lặng.
            </p>
            <p className="font-sans font-light text-[#FDFBF7]/70 text-lg leading-relaxed">
              Hãy để tiếng nước chảy róc rách và hương cà phê nguyên bản dẫn lối tâm hồn.
            </p>
          </motion.div>
        </div>
      </section>

      {/* =========================================
          SECTION 3: 3 TRẢI NGHIỆM ĐẶC TRƯNG
      ========================================= */}
      <section className="relative py-32 px-6 sm:px-12 lg:px-24 bg-[#0a0705]/95 pointer-events-auto border-t border-[#FDFBF7]/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <motion.span 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={cinematicTransition}
              className={SUBHEADING_STYLE + " mb-4"}
            >
              TRẢI NGHIỆM ĐẮK NÔNG
            </motion.span>
            <motion.h2 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ ...cinematicTransition, delay: 0.1 }}
              className="font-serif text-3xl sm:text-5xl font-medium text-[#F5EFEB]"
            >
              GÓC NHỎ AN YÊN
            </motion.h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Bờ Suối Đá Tự Nhiên", desc: "Bàn gỗ ven suối, làn nước trong mát vỗ về", img: "/uploads/gallery/1788250253551-943009233.jpg" },
              { title: "Hiên Gỗ Mộc Rợp Hoa", desc: "Không gian mở ngập tràn sắc hoa và ánh nắng", img: "/uploads/gallery/1788250253554-875120458.jpg" },
              { title: "Cà Phê Mộc Nguyên Bản", desc: "Hương vị rang xay mộc ấm nồng đặc trưng", img: "/uploads/gallery/1788250253557-29323827.jpg" },
            ].map((exp, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ ...cinematicTransition, delay: idx * 0.15 }}
                className="group flex flex-col gap-6"
              >
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
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================
          SECTION 4: THỨC UỐNG NỔI BẬT (SIGNATURE SIPS)
      ========================================= */}
      <section className="relative py-32 px-6 sm:px-12 lg:px-24 bg-[#0a0705] pointer-events-auto border-t border-[#FDFBF7]/5">
        <div className="max-w-5xl mx-auto text-center">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={cinematicTransition}
            className={SUBHEADING_STYLE + " mb-4"}
          >
            SIGNATURE SIPS
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ ...cinematicTransition, delay: 0.1 }}
            className="font-serif text-3xl sm:text-5xl font-medium text-[#F5EFEB] mb-16"
          >
            HƯƠNG VỊ MỘC MẠC ĐẶC TRƯNG
          </motion.h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-left mb-16">
            {[
              { name: "Cà phê Sài Gòn", price: "25.000 VNĐ", desc: "Đậm vị, nguyên bản" },
              { name: "Cà phê Muối", price: "28.000 VNĐ", desc: "Mặn mà, béo ngậy" },
              { name: "Trà Đào Cam Sả", price: "30.000 VNĐ", desc: "Thanh mát, sảng khoái" },
              { name: "Sữa Chua Hạt Đác", price: "30.000 VNĐ", desc: "Dẻo bùi, chua ngọt thanh" },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ ...cinematicTransition, delay: idx * 0.1 }}
                className="bg-[#1A1D17]/50 border border-[#FDFBF7]/10 rounded-2xl p-6 hover:-translate-y-1.5 transition-transform duration-300"
              >
                <h3 className="font-serif text-xl font-medium text-[#F5EFEB] mb-1">{item.name}</h3>
                <p className="font-sans text-sm font-light text-[#FDFBF7]/60 mb-4">{item.desc}</p>
                <div className="font-sans font-medium text-[#C88A4B] tracking-wide">
                  {item.price}
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ ...cinematicTransition, delay: 0.4 }}
          >
            <Link
              href="/menu"
              className="inline-flex items-center justify-center px-8 py-3 bg-transparent border border-[#FDFBF7]/20 text-[#FDFBF7]/80 font-sans text-sm font-medium rounded-full hover:bg-[#FDFBF7]/10 hover:border-[#FDFBF7]/40 hover:text-[#F5EFEB] transition-all duration-300"
            >
              Xem Toàn Bộ Thực Đơn (40+ Món) →
            </Link>
          </motion.div>
        </div>
      </section>

      {/* =========================================
          SECTION 5: TIỆN ÍCH CHU ĐÁO (AMENITIES)
      ========================================= */}
      <section className="relative py-24 px-6 sm:px-12 bg-[#0a0705]/95 pointer-events-auto border-t border-[#FDFBF7]/5">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 divide-x divide-[#FDFBF7]/10">
            {[
              "Bãi Đậu Xe Ô Tô & Xe Máy An Toàn",
              "Wifi Tốc Độ Cao",
              "Ổ Điện Từng Bàn Tiện Lợi",
              "Không Gian Mở Đón Gió Tự Nhiên",
            ].map((amenity, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ ...cinematicTransition, delay: idx * 0.1 }}
                className="px-4 text-center flex items-center justify-center"
              >
                <p className="font-sans font-medium text-[#FDFBF7]/70 text-sm sm:text-base leading-relaxed">
                  {amenity}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================
          SECTION 6: CẢM NHẬN KHÁCH HÀNG (GUEST WORDS)
      ========================================= */}
      <section className="relative py-32 px-6 sm:px-12 bg-[#1A1D17]/40 pointer-events-auto">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={slowCinematicTransition}
          >
            <span className={SUBHEADING_STYLE + " mb-8"}>Khách Hàng Nói Gì</span>
            <blockquote className="font-serif text-2xl sm:text-4xl italic font-light leading-relaxed text-[#F5EFEB] mb-8">
              "Thật tuyệt khi tìm được một chốn bình yên, thư thái bên tiếng suối chảy róc rách. Cà phê thơm mộc, mọi thứ đều trọn vẹn để thả lỏng."
            </blockquote>
            <p className="font-sans font-medium tracking-widest text-xs uppercase text-[#C88A4B]">
              — Trải nghiệm một ngày thảnh thơi
            </p>
          </motion.div>
        </div>
      </section>

      {/* =========================================
          SECTION 7: TỪ GIA NGHĨA, CHÚNG TÔI CHỜ BẠN (LOCATION & HOURS)
      ========================================= */}
      <section className="relative py-32 px-6 sm:px-12 text-center pointer-events-auto bg-[#0a0705]">
        <div className="max-w-4xl mx-auto space-y-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={cinematicTransition}
          >
            <span className={SUBHEADING_STYLE + " mb-4"}>VISIT US</span>
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
                  TP. Gia Nghĩa, Tỉnh Đắk Nông
                </p>
              </div>
              <div>
                <h3 className="font-sans text-xs tracking-[0.2em] uppercase text-[#C88A4B] mb-3">Giờ Mở Cửa & Hotline</h3>
                <p className="font-sans font-light text-[#FDFBF7]/80 leading-relaxed mb-2">
                  T2 – T5: 07:00 – 22:00<br />
                  T6 – CN: 07:00 – 23:00
                </p>
                <a href="tel:0382851688" className="font-sans font-medium text-[#FDFBF7]/90 hover:text-[#C88A4B] transition-colors block">038 285 1688</a>
                <a href="tel:0774659000" className="font-sans font-medium text-[#FDFBF7]/90 hover:text-[#C88A4B] transition-colors block">077 465 9000</a>
              </div>
            </div>

            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-10 py-4 bg-[#F5EFEB] text-[#0a0705] font-sans font-medium rounded-full hover:bg-[#C88A4B] transition-colors duration-300 shadow-md"
            >
              Xem Google Maps Chỉ Đường
            </Link>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
