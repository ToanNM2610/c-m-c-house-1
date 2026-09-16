"use client";

import React from "react";
import { motion } from "framer-motion";
import { cinematicTransition } from "@/components/motion/config";

export default function ContactPage() {
  return (
    <div className="w-full min-h-screen text-[#FDFBF7] relative z-10 flex flex-col items-center pt-24 px-6 pointer-events-none">
      
      {/* ── HEADER ── */}
      <section className="text-center max-w-4xl mx-auto w-full pointer-events-auto mt-12 mb-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={cinematicTransition}
        >
          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl tracking-tight leading-tight uppercase">
            TỪ GIA NGHĨA,<br />
            <span className="text-[#C88A4B] italic">CHÚNG TÔI CHỜ ĐÓN BẠN.</span>
          </h1>
        </motion.div>
      </section>

      {/* ── INFO BLOCKS ── */}
      <section className="max-w-6xl mx-auto w-full grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left mt-8 border-t border-[#FDFBF7]/10 pt-16 pointer-events-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...cinematicTransition, delay: 0.1 }}
          className="flex flex-col gap-4"
        >
          <h3 className="font-mono text-sm tracking-[0.2em] text-[#C88A4B] uppercase">Địa Chỉ</h3>
          <p className="font-light text-lg leading-relaxed opacity-80">
            Hẻm 437 Hùng Vương<br />
            Phường Nghĩa Trung<br />
            TP. Gia Nghĩa, Tỉnh Đắk Nông
          </p>
          <p className="font-light text-sm text-[#FDFBF7]/50 mt-4">
            * Lối vào rộng rãi, bãi đậu xe ô tô và xe máy thoải mái ngay trong khuôn viên quán.
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
            <a href="tel:0382851688" className="opacity-80 hover:opacity-100 hover:text-[#C88A4B] transition-colors pointer-events-auto">Hotline: 038 285 1688</a>
            <a href="tel:0774659000" className="opacity-80 hover:opacity-100 hover:text-[#C88A4B] transition-colors pointer-events-auto">Hotline 2: 077 465 9000</a>
            <a href="mailto:thuynhut7788@gmail.com" className="opacity-80 hover:opacity-100 hover:text-[#C88A4B] transition-colors pointer-events-auto text-sm">Email: thuynhut7788@gmail.com</a>
          </div>
          <div className="flex items-center gap-4 mt-4 justify-center md:justify-start">
            <a href="#" className="font-mono text-xs tracking-widest uppercase hover:text-[#C88A4B] transition-colors pointer-events-auto">Facebook</a>
            <a href="#" className="font-mono text-xs tracking-widest uppercase hover:text-[#C88A4B] transition-colors pointer-events-auto">TikTok</a>
            <a href="#" className="font-mono text-xs tracking-widest uppercase hover:text-[#C88A4B] transition-colors pointer-events-auto">YouTube</a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...cinematicTransition, delay: 0.3 }}
          className="flex flex-col gap-4"
        >
          <h3 className="font-mono text-sm tracking-[0.2em] text-[#C88A4B] uppercase">Giờ Hoạt Động</h3>
          <div className="font-light text-lg leading-relaxed flex flex-col gap-2 opacity-80">
            <p>Thứ 2 – Thứ 5: 07:00 – 22:00</p>
            <p>Thứ 6 – Chủ Nhật: 07:00 – 23:00</p>
          </div>
        </motion.div>
      </section>

      {/* ── GOOGLE MAPS ── */}
      <section className="w-full max-w-6xl mx-auto mt-20 mb-32 pointer-events-auto h-[60vh] sm:h-[70vh] bg-[#1A1D17] border border-[#FDFBF7]/10 p-2">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15610.198906646543!2d107.6833633!3d11.9902636!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3173e46c72e2cfc7%3A0xb5a0c3bbd44b5cb3!2sGia%20Ngh%C3%AEa%2C%20Dak%20Nong%2C%20Vietnam!5e0!3m2!1sen!2s!4v1700000000000!5m2!1sen!2s"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen={false}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-700 object-cover"
        ></iframe>
      </section>

    </div>
  );
}
