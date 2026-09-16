"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { cinematicTransition, slowCinematicTransition } from "@/components/motion/config";
import { useScene } from "@/context/SceneContext";
import Image from "next/image";

const FEATURED_MENU = [
  { name: "Cà phê sài gòn", price: "25.000 VNĐ" },
  { name: "Cà phê muối", price: "28.000 VNĐ" },
  { name: "Trà đào cam sả", price: "30.000 VNĐ" },
  { name: "Sữa chua hạt đác", price: "30.000 VNĐ" },
];

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

  return (
    <div className={`w-full text-[#FDFBF7] relative z-10 ${isLocked ? 'h-screen overflow-hidden' : ''}`}>
      
      {/* ── STAGE 01-03: THE BLACK OVERLAY ── */}
      <AnimatePresence>
        {(introState === "darkness" || introState === "light") && (
          <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2, ease: "easeInOut" }}
            className="fixed inset-0 bg-[#0a0908] z-50 pointer-events-none flex items-center justify-center"
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

      {/* ── HERO ── */}
      <section className="relative w-full h-screen flex flex-col items-center justify-center px-6 pointer-events-none">
        <motion.div 
          style={{ opacity: heroOpacity, y: heroY }}
          className="flex flex-col items-center text-center pointer-events-auto"
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: (introState === "enter" || introState === "done") ? 1 : 0, y: (introState === "enter" || introState === "done") ? 0 : 30 }}
            transition={slowCinematicTransition}
            className="flex flex-col items-center"
          >
            <h1 className="font-serif text-5xl sm:text-7xl lg:text-9xl font-medium tracking-widest uppercase mb-4 text-shadow-md">
              CẨM CÙ
            </h1>
            <div className="h-[1px] w-12 bg-[#C88A4B] mb-8 opacity-60"></div>
            <p className="text-sm sm:text-base font-light tracking-[0.4em] text-[#FDFBF7]/80 uppercase font-mono">
              Coffee • Nature • Slow Living
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: (introState === "enter" || introState === "done") ? 1 : 0 }}
            transition={{ ...cinematicTransition, delay: 0.5 }}
            className="mt-20 flex flex-col sm:flex-row gap-6"
          >
            <Link
              href="/space"
              data-cursor="explore"
              className="group relative inline-flex items-center gap-3 px-10 py-5 bg-transparent text-[#FDFBF7] text-xs uppercase tracking-[0.2em] border border-[#FDFBF7]/20 hover:border-[#C88A4B] transition-colors duration-500 overflow-hidden"
            >
              <span className="relative z-10">Khám Phá Không Gian</span>
              <motion.div 
                className="absolute inset-0 bg-[#C88A4B]/10 -z-0"
                initial={{ scaleX: 0, originX: 0 }}
                whileHover={{ scaleX: 1 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              />
            </Link>
            <Link
              href="/menu"
              data-cursor="explore"
              className="group relative inline-flex items-center gap-3 px-10 py-5 bg-[#FDFBF7] text-[#0C0D0B] text-xs uppercase tracking-[0.2em] border border-[#FDFBF7] hover:bg-[#C88A4B] hover:border-[#C88A4B] hover:text-[#0C0D0B] transition-colors duration-500"
            >
              <span className="relative z-10">Xem Thực Đơn</span>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* ── INTRO SECTION ── */}
      <section className="relative min-h-[120vh] flex flex-col items-center justify-center px-6 text-center pointer-events-none">
        <div className="pointer-events-auto max-w-4xl mx-auto">
          <motion.p
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={slowCinematicTransition}
            className="font-serif text-3xl sm:text-5xl lg:text-7xl leading-tight mb-8"
          >
            MỘT NƠI ĐỂ<br />
            <span className="text-[#C88A4B] italic">CHẬM LẠI.</span>
          </motion.p>
        </div>
      </section>

      {/* ── 3 NATURE VALUES ── */}
      <section className="relative py-32 px-6 lg:px-24 bg-[#0C0D0B]/80 pointer-events-auto">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ ...cinematicTransition, delay: 0.1 }}
            className="flex flex-col text-center items-center"
          >
            <span className="font-mono text-xs tracking-widest text-[#C88A4B] uppercase mb-6 block">01</span>
            <h2 className="font-serif text-2xl sm:text-3xl mb-4 text-[#FDFBF7]">Suối Nguồn Tự Nhiên</h2>
            <p className="font-light text-sm text-[#FDFBF7]/60 leading-relaxed">
              Tiếng nước chảy róc rách, sỏi đá rêu phong. Không khí dịu mát quanh năm, mang lại cảm giác bình yên và tĩnh tại.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ ...cinematicTransition, delay: 0.2 }}
            className="flex flex-col text-center items-center"
          >
            <span className="font-mono text-xs tracking-widest text-[#C88A4B] uppercase mb-6 block">02</span>
            <h2 className="font-serif text-2xl sm:text-3xl mb-4 text-[#FDFBF7]">Hiên Gỗ Rợp Cây Xanh</h2>
            <p className="font-light text-sm text-[#FDFBF7]/60 leading-relaxed">
              Bóng mát đại ngàn với những tán cây rộng lớn. Góc ngồi thư thái, mộc mạc và gần gũi với thiên nhiên nguyên sơ.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ ...cinematicTransition, delay: 0.3 }}
            className="flex flex-col text-center items-center"
          >
            <span className="font-mono text-xs tracking-widest text-[#C88A4B] uppercase mb-6 block">03</span>
            <h2 className="font-serif text-2xl sm:text-3xl mb-4 text-[#FDFBF7]">Cà Phê & Đồ Uống Mộc</h2>
            <p className="font-light text-sm text-[#FDFBF7]/60 leading-relaxed">
              Hương vị rang xay mộc mạc, đậm chất Tây Nguyên. Thưởng thức trọn vẹn sự tinh túy của từng hạt cà phê địa phương.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── FEATURED MENU ── */}
      <section className="relative py-40 px-6 lg:px-24 bg-gradient-to-t from-[#0C0D0B] to-transparent pointer-events-auto">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={cinematicTransition}
            className="font-serif text-4xl sm:text-5xl tracking-widest text-[#C88A4B] uppercase mb-16"
          >
            Thực Đơn Nổi Bật
          </motion.h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-left max-w-2xl mx-auto">
            {FEATURED_MENU.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ ...cinematicTransition, delay: idx * 0.1 }}
                className="flex justify-between items-baseline border-b border-[#FDFBF7]/10 pb-4"
              >
                <h3 className="font-medium text-lg tracking-wide uppercase text-[#FDFBF7]">{item.name}</h3>
                <span className="font-mono text-sm opacity-80 text-[#FDFBF7]/80">{item.price}</span>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ ...cinematicTransition, delay: 0.5 }}
            className="mt-16"
          >
            <Link
              href="/menu"
              className="inline-block px-10 py-4 bg-transparent text-[#FDFBF7] text-xs uppercase tracking-[0.2em] border border-[#FDFBF7]/30 hover:border-[#C88A4B] hover:text-[#C88A4B] transition-colors duration-300"
            >
              Xem Toàn Bộ Thực Đơn
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── LOCATION / CTA ── */}
      <section className="relative min-h-[80vh] flex flex-col items-center justify-center text-center px-6 pointer-events-auto bg-[#0C0D0B]">
        <div className="max-w-4xl mx-auto space-y-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={cinematicTransition}
          >
            <p className="font-mono text-sm tracking-[0.3em] uppercase text-[#FDFBF7]/60 mb-6">
              Từ Gia Nghĩa,
            </p>
            <h2 className="font-serif text-4xl sm:text-6xl text-[#FDFBF7] mb-12">
              Chúng tôi chờ đón bạn.
            </h2>
            <Link
              href="/contact"
              data-cursor="explore"
              className="inline-block px-12 py-4 bg-[#FDFBF7] text-[#0C0D0B] font-mono text-xs uppercase tracking-widest font-semibold hover:bg-[#C88A4B] hover:text-[#FDFBF7] transition-colors duration-500"
            >
              Xem Bản Đồ & Chỉ Đường
            </Link>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
