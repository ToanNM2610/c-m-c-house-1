"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { cinematicTransition, slowCinematicTransition } from "@/components/motion/config";
import { useScene } from "@/context/SceneContext";

export default function HomePage() {
  const { t } = useLanguage();
  const { scrollY } = useScroll();
  const { introState, setIntroState, setScrollProgress } = useScene();

  // Cinematic Intro Phases
  useEffect(() => {
    // Only run intro if we're in darkness
    if (introState === "darkness") {
      const t1 = setTimeout(() => setIntroState("light"), 1500); // Particle appears
      const t2 = setTimeout(() => setIntroState("reveal"), 4000); // Environment reveals
      const t3 = setTimeout(() => setIntroState("enter"), 6500); // Text appears, scroll enabled
      const t4 = setTimeout(() => setIntroState("done"), 8000); // Intro finished
      
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
        clearTimeout(t4);
      };
    }
  }, [introState, setIntroState]);

  // Sync scroll to context
  useEffect(() => {
    const handleScroll = () => {
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      setScrollProgress(Math.min(window.scrollY / maxScroll, 1));
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [setScrollProgress]);

  // Fade out hero when scrolling down
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);
  const heroY = useTransform(scrollY, [0, 400], [0, -50]);
  
  // Is scroll locked?
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
            className="mt-20"
          >
            <Link
              href="#explore"
              data-cursor="explore"
              className="group relative inline-flex items-center gap-3 px-10 py-5 bg-transparent text-[#FDFBF7] text-xs uppercase tracking-[0.2em] border border-[#FDFBF7]/20 hover:border-[#C88A4B] transition-colors duration-500 overflow-hidden"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
              }}
            >
              <span className="relative z-10">STEP INTO THE SLOW</span>
              <motion.div 
                className="absolute inset-0 bg-[#C88A4B]/10 -z-0"
                initial={{ scaleX: 0, originX: 0 }}
                whileHover={{ scaleX: 1 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              />
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* ── INTRO SECTION ── */}
      <section id="explore" className="relative min-h-[120vh] flex flex-col items-center justify-center px-6 text-center pointer-events-none">
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

      {/* ── SPACE / EXPERIENCE SECTION ── */}
      <section className="relative min-h-[200vh] pointer-events-none">
        <div className="sticky top-0 h-screen flex items-center justify-start px-6 lg:px-24">
          <div className="pointer-events-auto w-full md:w-1/2 flex flex-col gap-12 text-[#FDFBF7]">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, amount: 0.5 }}
              transition={cinematicTransition}
            >
              <span className="font-mono text-sm tracking-widest text-[#C88A4B] uppercase mb-4 block">01</span>
              <h2 className="font-serif text-4xl sm:text-6xl mb-6">Bờ Suối</h2>
              <p className="font-light text-lg text-[#FDFBF7]/60 max-w-md leading-relaxed">
                Nước chảy róc rách, sỏi đá rêu phong. Nơi thiên nhiên tự kể câu chuyện của mình, không khiên cưỡng, không vội vã.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── PHILOSOPHY SECTION ── */}
      <section className="relative min-h-screen flex items-center justify-center pointer-events-none bg-gradient-to-t from-[#0C0D0B] to-transparent">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={slowCinematicTransition}
          className="pointer-events-auto text-center"
        >
          <h2 className="font-serif text-6xl sm:text-8xl lg:text-[10vw] uppercase tracking-tighter text-[#C88A4B] mb-12 mix-blend-screen">
            Không Cần Vội
          </h2>
        </motion.div>
      </section>

      {/* ── LOCATION / CTA ── */}
      <section className="relative min-h-[80vh] flex flex-col items-center justify-center text-center px-6 pointer-events-none bg-[#0C0D0B]">
        <div className="pointer-events-auto max-w-2xl mx-auto space-y-12">
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
              Get Directions
            </Link>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
