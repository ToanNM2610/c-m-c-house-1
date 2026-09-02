"use client";

import { motion } from "framer-motion";
import { Coffee, Sprout, HeartHandshake } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import BlurText from "@/components/ui/BlurText";

export default function AboutPage() {
  const { t } = useLanguage();
  return (
    <main className="relative min-h-screen font-sans bg-transparent text-[#F4EFEA] z-10 pt-32 pb-32">
      <section className="relative z-10 max-w-5xl mx-auto px-6 sm:px-8">
        
        {/* Header */}
        <div className="text-center mb-24">
          <span className="text-[#C5A880] uppercase tracking-[0.25em] text-xs sm:text-sm mb-3 block font-sans">
            {t("about.subtitle")}
          </span>
          <BlurText 
            text={t("about.title")}
            as="h1"
            className="text-4xl md:text-6xl lg:text-7xl font-serif text-[#F4EFEA] mb-8"
          />
          <div className="w-16 h-[1px] bg-[#C5A880]/40 mx-auto"></div>
        </div>

        {/* 3 Sections */}
        <motion.div 
          className="space-y-32"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: { staggerChildren: 0.2 }
            }
          }}
        >
          
          {/* Section 1: Hành trình tạo dựng */}
          <motion.div 
            variants={{
              hidden: { opacity: 0, y: 30 },
              show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
            }}
            className="flex flex-col md:flex-row gap-12 items-center"
          >
            <div className="md:w-1/3 flex justify-center text-[#C5A880]/30">
              <Sprout size={160} strokeWidth={0.6} className="text-[#C5A880]/40" />
            </div>
            <div className="md:w-2/3">
              <span className="text-[#C5A880] font-sans text-xs tracking-widest uppercase block mb-2 font-semibold">Chặng 01</span>
              <h3 className="text-3xl font-serif text-[#F4EFEA] mb-6">{t("about.s1Title")}</h3>
              <p className="text-base sm:text-lg text-[#F4EFEA]/75 leading-relaxed font-light mb-4">
                {t("about.s1p1")}
              </p>
              <p className="text-base sm:text-lg text-[#F4EFEA]/75 leading-relaxed font-light">
                {t("about.s1p2")}
              </p>
            </div>
          </motion.div>

          {/* Section 2: Triết lý xanh */}
          <motion.div 
            variants={{
              hidden: { opacity: 0, y: 30 },
              show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
            }}
            className="flex flex-col md:flex-row-reverse gap-12 items-center"
          >
            <div className="md:w-1/3 flex justify-center">
              <Coffee size={160} strokeWidth={0.6} className="text-[#C5A880]/40" />
            </div>
            <div className="md:w-2/3">
              <span className="text-[#C5A880] font-sans text-xs tracking-widest uppercase block mb-2 font-semibold">Chặng 02</span>
              <h3 className="text-3xl font-serif text-[#F4EFEA] mb-6">{t("about.s2Title")}</h3>
              <p className="text-base sm:text-lg text-[#F4EFEA]/75 leading-relaxed font-light mb-4">
                {t("about.s2p1")}
              </p>
              <p className="text-base sm:text-lg text-[#F4EFEA]/75 leading-relaxed font-light">
                {t("about.s2p2")}
              </p>
            </div>
          </motion.div>

          {/* Section 3: Văn hóa phục vụ */}
          <motion.div 
            variants={{
              hidden: { opacity: 0, y: 30 },
              show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
            }}
            className="flex flex-col md:flex-row gap-12 items-center"
          >
            <div className="md:w-1/3 flex justify-center">
              <HeartHandshake size={160} strokeWidth={0.6} className="text-[#C5A880]/40" />
            </div>
            <div className="md:w-2/3">
              <span className="text-[#C5A880] font-sans text-xs tracking-widest uppercase block mb-2 font-semibold">Chặng 03</span>
              <h3 className="text-3xl font-serif text-[#F4EFEA] mb-6">{t("about.s3Title")}</h3>
              <p className="text-base sm:text-lg text-[#F4EFEA]/75 leading-relaxed font-light mb-4">
                {t("about.s3p1")}
              </p>
              <p className="text-base sm:text-lg text-[#F4EFEA]/75 leading-relaxed font-light">
                {t("about.s3p2")}
              </p>
            </div>
          </motion.div>

        </motion.div>
      </section>
    </main>
  );
}
