"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { REAL_MENU_DATA } from "@/data/menu";
import { useLanguage } from "@/context/LanguageContext";
import { MaskHeading } from "@/components/motion/ScrollReveal";
import { cinematicTransition } from "@/components/motion/config";

export default function MenuPage() {
  const { t } = useLanguage();

  const coffeeItems = useMemo(() => REAL_MENU_DATA.filter((i) => i.category === "Cà Phê"), []);
  const teaItems = useMemo(() => REAL_MENU_DATA.filter((i) => i.category === "Trà"), []);

  return (
    <div className="w-full min-h-screen text-[#FDFBF7] relative z-10 pointer-events-none">
      
      {/* Editorial Header */}
      <section className="pt-40 pb-20 px-6 sm:px-12 text-center">
        <MaskHeading as="h1" duration={1} className="font-serif text-5xl sm:text-7xl lg:text-8xl tracking-widest uppercase text-shadow-md">
          {t("menu.heroTitle") || "Thực Đơn"}
        </MaskHeading>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...cinematicTransition, delay: 0.2 }}
          className="mt-6 text-[#C88A4B] text-xs sm:text-sm tracking-[0.3em] uppercase font-mono"
        >
          Nguyên bản & Tươi mới
        </motion.p>
      </section>

      {/* Split Menu Layout over 3D Scene */}
      <section className="px-6 sm:px-12 lg:px-24 pb-40 max-w-[1400px] mx-auto pointer-events-auto">
        
        {/* We use a grid that leaves the center column relatively open for the 3D coffee cup */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
          
          {/* Left Column: Cà Phê */}
          <div className="lg:col-span-4 flex flex-col gap-12">
            <div className="border-b border-[#FDFBF7]/20 pb-4 mb-4">
              <h2 className="font-serif text-3xl tracking-widest text-[#C88A4B] uppercase">Cà Phê</h2>
            </div>
            
            {coffeeItems.map((item, idx) => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ ...cinematicTransition, delay: idx * 0.05 }}
                className="group cursor-pointer"
              >
                <div className="flex justify-between items-baseline mb-2">
                  <h3 className="font-medium text-lg tracking-wide uppercase transition-colors group-hover:text-[#C88A4B]">
                    {item.name}
                  </h3>
                  <span className="font-mono text-sm opacity-80 group-hover:opacity-100 transition-opacity">
                    {item.priceFormatted}
                  </span>
                </div>
                <p className="text-xs font-light text-[#FDFBF7]/50 leading-relaxed max-w-[85%]">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Center Column: Empty for 3D Coffee Showcase */}
          <div className="hidden lg:block lg:col-span-4 pointer-events-none">
            {/* The 3D coffee cup from CoffeeScene will appear here */}
          </div>

          {/* Right Column: Trà */}
          <div className="lg:col-span-4 flex flex-col gap-12 lg:mt-32">
            <div className="border-b border-[#FDFBF7]/20 pb-4 mb-4 text-right">
              <h2 className="font-serif text-3xl tracking-widest text-[#C88A4B] uppercase">Trà</h2>
            </div>
            
            {teaItems.map((item, idx) => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ ...cinematicTransition, delay: idx * 0.05 }}
                className="group cursor-pointer text-right flex flex-col items-end"
              >
                <div className="flex justify-between items-baseline mb-2 w-full flex-row-reverse">
                  <h3 className="font-medium text-lg tracking-wide uppercase transition-colors group-hover:text-[#C88A4B]">
                    {item.name}
                  </h3>
                  <span className="font-mono text-sm opacity-80 group-hover:opacity-100 transition-opacity">
                    {item.priceFormatted}
                  </span>
                </div>
                <p className="text-xs font-light text-[#FDFBF7]/50 leading-relaxed max-w-[85%]">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* Decorative Gradient Overlay for Bottom */}
      <div className="w-full h-32 bg-gradient-to-t from-[#0a0908] to-transparent pointer-events-none"></div>
    </div>
  );
}
