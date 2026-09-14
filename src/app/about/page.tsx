"use client";

import React from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { MaskHeading } from "@/components/motion/ScrollReveal";
import { cinematicTransition, slowCinematicTransition } from "@/components/motion/config";

const CHAPTERS = [
  {
    num: "01",
    title: "ORIGIN",
    desc: "Cẩm Cù House bắt đầu từ một ý niệm đơn giản: Tạo ra một nơi trú ẩn giữa những đồi núi Đắk Nông, nơi cà phê không chỉ là thức uống mà là một trải nghiệm nguyên sơ."
  },
  {
    num: "02",
    title: "THE SPACE",
    desc: "Không gian được tạo nên từ những vật liệu bản địa: Gỗ mộc, đá nguyên khối và ánh sáng tự nhiên. Mọi chi tiết kiến trúc đều nhường chỗ cho vẻ đẹp của thiên nhiên."
  },
  {
    num: "03",
    title: "THE COFFEE",
    desc: "Chúng tôi chọn cách rang mộc, chậm rãi và tôn trọng đặc tính nguyên bản của từng hạt cà phê Robusta và Arabica được trồng ngay tại vùng đất mù sương này."
  },
  {
    num: "04",
    title: "THE PEOPLE",
    desc: "Những con người ở Cẩm Cù mang trong mình sự chất phác của núi rừng, phục vụ bằng sự tận tâm và xem mỗi vị khách như một người bạn đường."
  },
];

export default function AboutPage() {
  const { t } = useLanguage();

  return (
    <div className="w-full text-[#FDFBF7] relative z-10 pointer-events-none">
      
      {/* ── 1. HERO ── */}
      <section className="relative h-[80vh] flex items-center justify-center text-center px-6 pointer-events-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={slowCinematicTransition}
        >
          <span className="text-xs font-mono uppercase tracking-[0.4em] text-[#C88A4B] mb-8 block">
            Câu chuyện của chúng tôi
          </span>
          <h1 className="font-serif text-6xl sm:text-8xl lg:text-[10rem] font-medium tracking-tight leading-none text-shadow-sm">
            CẨM CÙ
          </h1>
        </motion.div>
      </section>

      {/* ── 2. STORY CHAPTERS ── */}
      <section className="max-w-4xl mx-auto px-6 sm:px-12 py-32 space-y-40 pointer-events-auto">
        {CHAPTERS.map((chapter, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={cinematicTransition}
            className={`flex flex-col ${idx % 2 !== 0 ? 'items-end text-right' : 'items-start text-left'}`}
          >
            <div className="flex items-center gap-6 mb-8 text-[#C88A4B]">
              {idx % 2 !== 0 && <div className="h-[1px] w-24 bg-[#C88A4B]/30"></div>}
              <span className="font-mono text-xl tracking-widest">{chapter.num} — {chapter.title}</span>
              {idx % 2 === 0 && <div className="h-[1px] w-24 bg-[#C88A4B]/30"></div>}
            </div>
            
            <p className="text-lg sm:text-2xl font-light text-[#FDFBF7]/80 leading-relaxed max-w-2xl">
              {chapter.desc}
            </p>
          </motion.div>
        ))}
      </section>

      {/* ── 3. PHILOSOPHY ── */}
      <section className="min-h-screen flex items-center justify-center py-40 px-6 text-center pointer-events-auto bg-gradient-to-t from-[#0C0D0B] to-transparent">
        <div className="max-w-5xl mx-auto">
          <MaskHeading as="h2" duration={1.2} className="font-serif text-5xl sm:text-7xl lg:text-9xl tracking-tight mb-12 uppercase text-[#C88A4B]">
            KHÔNG CẦN VỘI.
          </MaskHeading>
          
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ ...slowCinematicTransition, delay: 0.5 }}
            className="text-xl sm:text-3xl font-light text-[#FDFBF7]/60 tracking-wide"
          >
            Ở đây, cà phê chỉ là một phần của câu chuyện.
          </motion.p>
        </div>
      </section>

    </div>
  );
}
