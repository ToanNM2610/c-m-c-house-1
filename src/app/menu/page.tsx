"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { REAL_MENU_DATA } from "@/data/menu";
import { useLanguage } from "@/context/LanguageContext";
import { MaskHeading } from "@/components/motion/ScrollReveal";
import { cinematicTransition } from "@/components/motion/config";

export default function MenuPage() {
  const { t } = useLanguage();

  const getItems = (cat: string) => REAL_MENU_DATA.filter(i => i.category === cat);

  const leftCategories = ["Cà Phê", "Trà", "Sinh Tố", "Nước Ép"];
  const rightCategories = ["Soda / Sữa Chua", "Other", "Food"];

  const renderCategory = (cat: string, alignRight: boolean = false) => {
    const items = getItems(cat);
    if (items.length === 0) return null;

    return (
      <div key={cat} className={`flex flex-col gap-8 mb-20 ${alignRight ? "lg:text-right lg:items-end" : ""}`}>
        <div className={`border-b border-[#FDFBF7]/20 pb-4 mb-4 w-full ${alignRight ? "text-right" : ""}`}>
          <h2 className="font-serif text-3xl tracking-widest text-[#C88A4B] uppercase">{cat}</h2>
        </div>
        
        <div className="flex flex-col gap-8 w-full">
          {items.map((item, idx) => (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, x: alignRight ? 20 : -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ ...cinematicTransition, delay: (idx % 5) * 0.05 }}
              className={`group cursor-pointer flex flex-col ${alignRight ? "lg:items-end" : ""}`}
            >
              <div className={`flex justify-between items-baseline mb-2 w-full ${alignRight ? "lg:flex-row-reverse" : ""}`}>
                <h3 className="font-medium text-lg tracking-wide uppercase transition-colors group-hover:text-[#C88A4B]">
                  {item.name}
                </h3>
                <span className="font-mono text-sm opacity-80 group-hover:opacity-100 transition-opacity whitespace-nowrap ml-4">
                  {item.priceFormatted}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full min-h-screen text-[#FDFBF7] relative z-20">
      
      {/* Editorial Header */}
      <section className="pt-40 pb-20 px-6 sm:px-12 text-center pointer-events-auto relative z-20">
        <MaskHeading as="h1" duration={1} className="font-serif text-5xl sm:text-7xl lg:text-8xl tracking-widest uppercase text-shadow-md">
          Thực Đơn
        </MaskHeading>
      </section>

      {/* Split Menu Layout over 3D Scene */}
      <section className="px-6 sm:px-12 lg:px-24 pb-40 max-w-[1400px] mx-auto pointer-events-auto relative z-20">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 relative z-20 bg-[#0C0D0B]/40 lg:bg-transparent rounded-3xl p-6 lg:p-0 backdrop-blur-sm lg:backdrop-blur-none">
          
          {/* Left Column */}
          <div className="lg:col-span-4 flex flex-col pt-8">
            {leftCategories.map(cat => renderCategory(cat, false))}
          </div>

          {/* Center Column: Reserved for 3D Coffee Showcase */}
          <div className="hidden lg:block lg:col-span-4 pointer-events-none">
            {/* The 3D coffee cup from CoffeeScene will appear here in the background */}
          </div>

          {/* Right Column */}
          <div className="lg:col-span-4 flex flex-col pt-8 lg:mt-32">
            {rightCategories.map(cat => renderCategory(cat, true))}
          </div>

        </div>
      </section>

    </div>
  );
}
