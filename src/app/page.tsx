"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { MaskHeading } from "@/components/motion/ScrollReveal";
import { cinematicTransition, slowCinematicTransition } from "@/components/motion/config";

// --- Data ---
const EXP_KEYS = [
  {
    subtitleKey: "home.exp1Subtitle",
    titleKey: "home.exp1Title",
    descKey: "home.exp1Desc",
    image: "/uploads/gallery/1788250253551-943009233.jpg",
  },
  {
    subtitleKey: "home.exp2Subtitle",
    titleKey: "home.exp2Title",
    descKey: "home.exp2Desc",
    image: "/uploads/gallery/1788250253554-875120458.jpg",
  },
  {
    subtitleKey: "home.exp3Subtitle",
    titleKey: "home.exp3Title",
    descKey: "home.exp3Desc",
    image: "/uploads/gallery/1788250253557-29323827.jpg",
  },
];

export default function HomePage() {
  const { t } = useLanguage();
  const { scrollY, scrollYProgress } = useScroll();
  const [phase, setPhase] = useState(1);

  // Cinematic Intro Phases
  useEffect(() => {
    // Phase 1: Dark screen (Initial render)
    // Phase 2: WebGL Scene fades in (Handled by GlobalCanvas opacity)
    
    // Phase 4 & 5: Brand and CTA appear after delay
    const t1 = setTimeout(() => setPhase(4), 1500); // Brand appears
    const t2 = setTimeout(() => setPhase(5), 2500); // CTA appears

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  // Fade out hero when scrolling down
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);
  const heroY = useTransform(scrollY, [0, 400], [0, -50]);

  return (
    <div className="w-full text-[#FDFBF7] overflow-x-hidden relative z-10 pointer-events-none">
      
      {/* ── 1. HERO CINEMATIC (Overlay on WebGL) ── */}
      <section className="relative w-full h-screen flex flex-col items-center justify-center px-6">
        <motion.div 
          style={{ opacity: heroOpacity, y: heroY }}
          className="flex flex-col items-center text-center pointer-events-auto"
        >
          {/* Phase 4: Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: phase >= 4 ? 1 : 0, y: phase >= 4 ? 0 : 20 }}
            transition={slowCinematicTransition}
            className="flex flex-col items-center"
          >
            <h1 className="font-serif text-5xl sm:text-7xl lg:text-8xl font-medium tracking-widest uppercase mb-4 text-shadow-sm">
              CẨM CÙ HOUSE
            </h1>
            <div className="h-[1px] w-12 bg-[#C88A4B] mb-6 opacity-60"></div>
            <p className="text-sm sm:text-base font-light tracking-[0.3em] text-[#FDFBF7]/80 uppercase">
              Coffee • Nature • Slow Living
            </p>
          </motion.div>

          {/* Phase 5: CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: phase >= 5 ? 1 : 0 }}
            transition={{ ...cinematicTransition, delay: 0.2 }}
            className="mt-16"
          >
            <Link
              href="#explore"
              className="group relative inline-flex items-center gap-3 px-8 py-4 bg-transparent text-[#FDFBF7] text-xs uppercase tracking-widest border border-[#FDFBF7]/20 hover:border-[#C88A4B] transition-colors duration-500 overflow-hidden"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
              }}
            >
              <span className="relative z-10">ENTER EXPERIENCE</span>
              <motion.div 
                className="absolute inset-0 bg-[#C88A4B]/10 -z-0"
                initial={{ scaleX: 0, originX: 0 }}
                whileHover={{ scaleX: 1 }}
                transition={cinematicTransition}
              />
            </Link>
          </motion.div>
        </motion.div>
        
        {/* Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: phase >= 5 ? 0.6 : 0 }}
          transition={{ duration: 1, delay: 1 }}
          style={{ opacity: heroOpacity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-auto cursor-pointer"
        >
          <span className="text-[10px] tracking-widest uppercase font-mono text-[#FDFBF7]/50">Scroll</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-[#FDFBF7]/50 to-transparent"></div>
        </motion.div>
      </section>

      <div id="explore" className="relative bg-gradient-to-b from-transparent via-[#0C0D0B]/80 to-[#0C0D0B] pt-32 pb-24">
        
        {/* ── 2. INTRODUCTION ── */}
        <section className="py-24 px-6 max-w-5xl mx-auto text-center pointer-events-auto">
          <MaskHeading as="h2" duration={1} className="font-serif text-4xl sm:text-6xl lg:text-7xl leading-tight mb-8">
            <span className="block opacity-80">MỘT NƠI</span>
            <span className="block italic text-[#C88A4B]">ĐỂ CHẬM LẠI.</span>
          </MaskHeading>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={cinematicTransition}
            className="text-lg sm:text-xl font-light text-[#FDFBF7]/70 max-w-2xl mx-auto leading-relaxed"
          >
            {t("home.subtitle") || "Thưởng thức cà phê nguyên bản giữa không gian kiến trúc mộc mạc, nơi thiên nhiên và con người hòa làm một."}
          </motion.p>
        </section>

        {/* ── 3. EXPERIENCES (Asymmetric Layout) ── */}
        <section className="py-32 px-6 sm:px-12 max-w-7xl mx-auto pointer-events-auto">
          <div className="flex flex-col gap-32">
            {EXP_KEYS.map((exp, idx) => {
              const isEven = idx % 2 !== 0;
              return (
                <div key={idx} className={`flex flex-col ${isEven ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-12 md:gap-24 group`}>
                  
                  {/* Image Block */}
                  <motion.div 
                    initial={{ opacity: 0, clipPath: 'inset(10% 10% 10% 10%)' }}
                    whileInView={{ opacity: 1, clipPath: 'inset(0% 0% 0% 0%)' }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ ...slowCinematicTransition, delay: 0.1 }}
                    className="w-full md:w-1/2 relative overflow-hidden"
                  >
                    <div className="aspect-[4/5] relative w-full h-full">
                      <img 
                        src={exp.image} 
                        alt={t(exp.titleKey)} 
                        className="object-cover w-full h-full transition-transform duration-1000 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/10 transition-colors duration-500 group-hover:bg-transparent"></div>
                    </div>
                  </motion.div>

                  {/* Text Block */}
                  <div className="w-full md:w-1/2 flex flex-col justify-center">
                    <motion.div 
                      initial={{ opacity: 0, x: isEven ? 30 : -30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: "-100px" }}
                      transition={slowCinematicTransition}
                      className="space-y-6"
                    >
                      <div className="flex items-center gap-4 text-[#C88A4B]">
                        <span className="font-mono text-xs tracking-widest">0{idx + 1}</span>
                        <div className="h-[1px] w-12 bg-[#C88A4B]/50"></div>
                        <span className="text-xs uppercase tracking-widest">{t(exp.subtitleKey)}</span>
                      </div>
                      
                      <h3 className="font-serif text-3xl sm:text-5xl lg:text-6xl leading-tight">
                        {t(exp.titleKey)}
                      </h3>
                      
                      <p className="text-[#FDFBF7]/60 font-light leading-relaxed max-w-md text-sm sm:text-base">
                        {t(exp.descKey)}
                      </p>

                      <div className="pt-8">
                        <Link href="/space" className="inline-flex items-center gap-3 text-xs uppercase tracking-widest hover:text-[#C88A4B] transition-colors group/link">
                          Khám phá
                          <ArrowRight size={14} className="transition-transform group-hover/link:translate-x-2" />
                        </Link>
                      </div>
                    </motion.div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── 4. COFFEE SHOWCASE CALL TO ACTION ── */}
        <section className="py-40 px-6 text-center pointer-events-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={slowCinematicTransition}
            className="max-w-3xl mx-auto flex flex-col items-center"
          >
            <h2 className="font-serif text-5xl sm:text-7xl mb-8">
              Sự Nguyên Bản.
            </h2>
            <Link
              href="/menu"
              className="px-8 py-4 border border-[#C88A4B] text-[#C88A4B] text-xs uppercase tracking-widest hover:bg-[#C88A4B] hover:text-[#0C0D0B] transition-all duration-500"
            >
              Xem Thực Đơn
            </Link>
          </motion.div>
        </section>
      </div>
    </div>
  );
}
