"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Coffee, Flame, Mountain, Sparkles } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useGallery } from "@/hooks/useGallery";
import { useLanguage } from "@/context/LanguageContext";
import BlurText from "@/components/ui/BlurText";

export default function HomePage() {
  const [isMounted, setIsMounted] = useState(false);
  const { t } = useLanguage();

  // Slideshow Background
  const { images } = useGallery();
  const [currentIndex, setCurrentIndex] = useState(0);
  const heroImages = images.length >= 3 ? images.slice(0, 3) : images;

  const highlights = [
    { 
      nameKey: "home.highlights.h1Name", 
      descKey: "home.highlights.h1Desc", 
      price: "30.000đ", 
      img: "https://placehold.co/400x500/292524/a8a29e?text=Ca+phe+kem+trung" 
    },
    { 
      nameKey: "home.highlights.h2Name", 
      descKey: "home.highlights.h2Desc", 
      price: "28.000đ", 
      img: "https://placehold.co/400x500/292524/a8a29e?text=Ca+phe+muoi" 
    },
    { 
      nameKey: "home.highlights.h3Name", 
      descKey: "home.highlights.h3Desc", 
      price: "30.000đ", 
      img: "https://placehold.co/400x500/292524/a8a29e?text=Tra+dao+cam+sa" 
    },
    { 
      nameKey: "home.highlights.h4Name", 
      descKey: "home.highlights.h4Desc", 
      price: "33.000đ", 
      img: "https://placehold.co/400x500/292524/a8a29e?text=Bo+sau+rieng" 
    },
  ];

  const journeySteps = [
    {
      num: "01",
      icon: Mountain,
      titleKey: "home.journeyStep1Title",
      descKey: "home.journeyStep1Desc",
    },
    {
      num: "02",
      icon: Flame,
      titleKey: "home.journeyStep2Title",
      descKey: "home.journeyStep2Desc",
    },
    {
      num: "03",
      icon: Coffee,
      titleKey: "home.journeyStep3Title",
      descKey: "home.journeyStep3Desc",
    },
  ];

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (heroImages.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroImages.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  return (
    <main className="min-h-screen font-sans bg-transparent overflow-x-hidden">
      
      {/* ========================================================= */}
      {/* 1. TỐI ƯU HERO SECTION (DOM THUẦN, KHÔNG 3D CANVAS)        */}
      {/* ========================================================= */}
      <section id="hero" className="relative min-h-screen w-full flex flex-col items-center justify-center text-center overflow-hidden bg-transparent">
        
        {/* ẢNH NỀN HERO & LỚP PHỦ TỐI TỐI ƯU */}
        <div className="absolute inset-0 z-0 bg-[#1A0F0A] pointer-events-none">
          {heroImages.map((img, idx) => {
            const isActive = idx === currentIndex;
            return (
              <div 
                key={img.id}
                className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
                  isActive ? "opacity-100" : "opacity-0"
                }`}
              >
                <Image
                  src={img.url}
                  alt={img.caption || `Cẩm Cù House Hero ${idx + 1}`}
                  fill
                  priority={idx === 0}
                  quality={85}
                  sizes="100vw"
                  className={`object-cover transition-transform duration-[8000ms] ease-out ${
                    isActive ? "scale-105" : "scale-100"
                  }`}
                />
              </div>
            );
          })}
          {/* Lớp chuyển sắc tối nhẹ như yêu cầu để chữ sắc nét */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#1A0F0A]/70 via-[#1A0F0A]/40 to-[#1A0F0A] pointer-events-none" />
        </div>

        {/* NỘI DUNG CHÍNH CỦA HERO */}
        <div className="relative z-10 w-full min-h-screen flex flex-col items-center justify-center pt-28 pb-16 px-4">
          <div className="relative max-w-5xl mx-auto flex flex-col items-center">
          
            {/* Tagline Badge */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-[#C5A880]/40 bg-[#25150E]/80 text-[#C5A880] text-xs font-sans tracking-widest uppercase mb-6 shadow-md backdrop-blur-sm"
            >
              <Sparkles size={14} className="text-[#C5A880]" />
              <span>{t("home.heroTag")}</span>
            </motion.div>

            {/* Main Title */}
            <BlurText 
              text={t("home.title")}
              as="h1"
              delay={0.05}
              className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-serif text-[#F4EFEA] tracking-tight mb-2 drop-shadow-lg"
            />

            {/* Subtitle Tagline */}
            <motion.p 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15, ease: [0.25, 1, 0.5, 1] }}
              className="text-base sm:text-lg md:text-xl text-[#C5A880] font-light tracking-[0.25em] uppercase mb-4"
            >
              Artisan Coffee & Botanical Sanctuary
            </motion.p>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.25, ease: [0.25, 1, 0.5, 1] }}
              className="text-sm sm:text-base md:text-lg text-[#F4EFEA]/80 font-light tracking-wide max-w-2xl mx-auto mb-8 leading-relaxed"
            >
              {t("home.subtitle")}
            </motion.p>

            {/* Action Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3, ease: [0.25, 1, 0.5, 1] }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto"
            >
              <Link 
                href="/menu" 
                className="inline-flex items-center justify-center gap-2.5 bg-[#F4EFEA] hover:bg-[#C5A880] text-[#1A0F0A] hover:text-white px-8 py-4 rounded-2xl font-medium tracking-wide transition-all duration-300 shadow-lg hover:-translate-y-0.5 w-full sm:w-auto text-sm"
              >
                <Coffee size={18} /> {t("home.viewMenu")}
              </Link>
              <Link 
                href="/space" 
                className="inline-flex items-center justify-center gap-2.5 border border-[#C5A880]/60 hover:border-[#C5A880] hover:bg-[#C5A880]/20 text-[#F4EFEA] px-8 py-4 rounded-2xl font-medium tracking-wide transition-all duration-300 shadow-md hover:-translate-y-0.5 w-full sm:w-auto text-sm"
              >
                {t("home.visitUs")} <ArrowRight size={18} />
              </Link>
            </motion.div>
          </div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[#C5A880]/60 pointer-events-none"
          >
            <span className="text-[10px] uppercase tracking-widest font-sans">Cuộn Xuống</span>
            <div className="w-4 h-7 rounded-full border border-[#C5A880]/40 flex items-start justify-center p-1">
              <div className="w-1 h-1.5 rounded-full bg-[#C5A880] animate-bounce" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 2. SANCTUARY SHOWCASE SECTION                             */}
      {/* ========================================================= */}
      <section className="relative z-20 py-24 sm:py-32 px-4 sm:px-8 max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
          className="text-center mb-12 sm:mb-16"
        >
          <span className="text-[#C5A880] uppercase tracking-[0.25em] text-xs sm:text-sm mb-3 block font-sans">
            {t("home.sanctuarySubtitle")}
          </span>
          <BlurText 
            text={t("home.sanctuaryTitle")}
            as="h2"
            className="text-3xl sm:text-5xl md:text-6xl font-serif text-[#F4EFEA] mb-6"
          />
          <p className="text-sm sm:text-base text-[#F4EFEA]/70 max-w-2xl mx-auto font-light leading-relaxed">
            {t("home.sanctuaryDesc")}
          </p>
          <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-[#C5A880]/60 to-transparent mx-auto mt-8"></div>
        </motion.div>

        {/* Sanctuary Image Frame */}
        <motion.div 
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
          className="group relative w-full aspect-[16/9] md:aspect-[21/9] min-h-[340px] md:min-h-[480px] rounded-3xl overflow-hidden border border-[#C5A880]/30 shadow-2xl bg-[#1A0F0A]"
        >
          <Image
            src="/uploads/gallery/1788250253551-943009233.jpg"
            alt="Cẩm Cù House Sanctuary"
            fill
            quality={85}
            sizes="(max-width: 1024px) 100vw, 1200px"
            loading="lazy"
            className="object-cover filter brightness-90 contrast-[1.05] group-hover:scale-105 transition-transform duration-700 ease-out"
          />

          {/* Vignette Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#1A0F0A]/90 via-[#1A0F0A]/20 to-transparent pointer-events-none" />

          {/* Floating Card Inside Frame */}
          <div className="absolute bottom-6 left-6 right-6 sm:left-10 sm:right-auto sm:max-w-md p-6 rounded-2xl bg-[#1A0F0A]/95 border border-[#C5A880]/30 shadow-2xl">
            <span className="text-[10px] uppercase font-sans tracking-widest text-[#C5A880] block mb-1">
              Gia Nghia, Dak Nong
            </span>
            <h3 className="text-xl font-serif text-[#F4EFEA] mb-2">
              Chốn Bình Yên Bên Dòng Suối
            </h3>
            <p className="text-xs text-[#F4EFEA]/70 font-light mb-4 line-clamp-2">
              {t("space.desc")}
            </p>
            <Link 
              href="/space" 
              className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-medium text-[#C5A880] hover:text-[#F4EFEA] transition-colors"
            >
              {t("home.sanctuaryBtn")} <ArrowRight size={14} />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ========================================================= */}
      {/* 3. ARTISAN COFFEE JOURNEY                                 */}
      {/* ========================================================= */}
      <section className="relative z-20 bg-transparent py-28 px-4 sm:px-8 border-t border-[#C5A880]/15">
        <div className="max-w-7xl mx-auto">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
            className="text-center mb-20"
          >
            <span className="text-[#C5A880] uppercase tracking-[0.25em] text-xs sm:text-sm mb-3 block font-sans">
              {t("home.journeySubtitle")}
            </span>
            <BlurText 
              text={t("home.journeyTitle")}
              as="h2"
              className="text-3xl sm:text-5xl font-serif text-[#F4EFEA]"
            />
            <div className="w-16 h-[1px] bg-[#C5A880]/40 mx-auto mt-6"></div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {journeySteps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: idx * 0.1, ease: [0.25, 1, 0.5, 1] }}
                  className="interactive-card relative rounded-2xl p-8 bg-[#1A0F0A]/30 backdrop-blur-md border border-[#C5A880]/20 hover:border-[#C5A880]/80 transition-all duration-300 shadow-2xl hover:-translate-y-1 group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between items-center mb-8">
                      <span className="text-3xl font-serif font-bold text-[#C5A880]/40 group-hover:text-[#C5A880] transition-colors">
                        {step.num}
                      </span>
                      <div className="w-12 h-12 rounded-2xl bg-[#2E190E] border border-[#C5A880]/30 flex items-center justify-center text-[#C5A880] group-hover:scale-105 group-hover:bg-[#C5A880] group-hover:text-[#1A0F0A] transition-all duration-300">
                        <Icon size={22} strokeWidth={1.5} />
                      </div>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-serif text-[#F4EFEA] mb-4 group-hover:text-[#C5A880] transition-colors">
                      {t(step.titleKey)}
                    </h3>

                    <p className="text-sm text-[#F4EFEA]/70 font-light leading-relaxed mb-6">
                      {t(step.descKey)}
                    </p>
                  </div>

                  <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#C5A880]/20 to-transparent group-hover:via-[#C5A880]/60 transition-all duration-300"></div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 4. SIGNATURE DELICACIES (HIGHLIGHTS)                      */}
      {/* ========================================================= */}
      <section className="relative z-20 bg-transparent py-32 px-4 sm:px-8 border-t border-[#C5A880]/15">
        <div className="max-w-7xl mx-auto">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
            className="text-center mb-16"
          >
            <span className="text-[#C5A880] uppercase tracking-[0.25em] text-xs sm:text-sm mb-3 block font-sans">
              {t("home.featuredSubtitle")}
            </span>
            <BlurText 
              text={t("home.featuredTitle")}
              as="h2"
              className="text-3xl sm:text-5xl font-serif text-[#F4EFEA]"
            />
            <div className="w-16 h-[1px] bg-[#C5A880]/40 mx-auto mt-6"></div>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {highlights.map((item, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: idx * 0.08, ease: [0.25, 1, 0.5, 1] }}
                className="group relative rounded-2xl overflow-hidden bg-[#1A0F0A]/30 backdrop-blur-md border border-[#C5A880]/20 hover:border-[#C5A880]/70 transition-all duration-300 shadow-2xl hover:-translate-y-1"
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-[#180D07]">
                  <Image 
                    src={item.img} 
                    alt={t(item.nameKey)}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    loading="lazy"
                    quality={75}
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out opacity-85 group-hover:opacity-100" 
                  />
                </div>
                <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-[#120703] via-[#120703]/90 to-transparent">
                  <h3 className="text-lg sm:text-xl font-serif text-[#F4EFEA] mb-1.5 group-hover:text-[#C5A880] transition-colors">
                    {t(item.nameKey)}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#F4EFEA]/70 font-light line-clamp-2 mb-3">
                    {t(item.descKey)}
                  </p>
                  <p className="text-[#C5A880] font-sans font-semibold tracking-wide text-sm">
                    {item.price}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="text-center mt-16">
            <Link 
              href="/menu" 
              className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full border border-[#C5A880]/40 hover:border-[#C5A880] bg-[#2A170F] hover:bg-[#C5A880] text-[#F4EFEA] hover:text-[#1A0F0A] transition-all duration-300 uppercase tracking-widest text-xs font-semibold shadow-sm"
            >
              {t("home.viewFullMenu")} <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}
