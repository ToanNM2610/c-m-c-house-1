"use client";

import React from "react";
import { motion } from "framer-motion";
import { cinematicTransition } from "@/components/motion/config";

export default function ContactPage() {
  return (
    <div className="w-full min-h-screen text-[#FDFBF7] relative z-10 flex flex-col items-center justify-center pt-24 px-6 pointer-events-none">
      
      {/* ── HEADER ── */}
      <section className="text-center max-w-4xl mx-auto w-full pointer-events-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={cinematicTransition}
          className="mb-16"
        >
          <h1 className="font-serif text-5xl sm:text-7xl lg:text-8xl tracking-tight leading-tight uppercase">
            TỪ GIA NGHĨA,<br />
            <span className="text-[#C88A4B] italic">TÔI CHỜ ĐÓN BẠN.</span>
          </h1>
        </motion.div>

        {/* ── INFO BLOCK ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left mt-20 border-t border-[#FDFBF7]/10 pt-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...cinematicTransition, delay: 0.1 }}
            className="flex flex-col gap-4"
          >
            <h3 className="font-mono text-sm tracking-[0.2em] text-[#C88A4B] uppercase">Địa Chỉ</h3>
            <p className="font-light text-lg leading-relaxed opacity-80 hover:opacity-100 transition-opacity cursor-pointer">
              Hẻm 437 Hùng Vương<br />
              Phường Nghĩa Trung<br />
              TP Gia Nghĩa, Đắk Nông
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...cinematicTransition, delay: 0.2 }}
            className="flex flex-col gap-4"
          >
            <h3 className="font-mono text-sm tracking-[0.2em] text-[#C88A4B] uppercase">Liên Hệ</h3>
            <div className="font-light text-lg leading-relaxed flex flex-col gap-2">
              <a href="tel:0382851688" className="opacity-80 hover:opacity-100 transition-opacity pointer-events-auto" data-cursor="explore">0382851688</a>
              <a href="tel:0774659000" className="opacity-80 hover:opacity-100 transition-opacity pointer-events-auto" data-cursor="explore">0774659000</a>
              <a href="mailto:thuynhu8788@gmail.com" className="opacity-80 hover:opacity-100 transition-opacity pointer-events-auto" data-cursor="explore">thuynhu8788@gmail.com</a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...cinematicTransition, delay: 0.3 }}
            className="flex flex-col gap-4"
          >
            <h3 className="font-mono text-sm tracking-[0.2em] text-[#C88A4B] uppercase">Giờ Mở Cửa</h3>
            <div className="font-light text-lg leading-relaxed flex flex-col gap-2 opacity-80">
              <p>T2 – T5: 07:00 – 18:00</p>
              <p>T6 – CN: 07:00 – 22:00</p>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
