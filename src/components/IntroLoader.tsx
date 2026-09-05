"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

export default function IntroLoader() {
  const pathname = usePathname() || "";
  const isAdmin = pathname.startsWith("/admin") || pathname.startsWith("/wp-admin");
  const [show, setShow] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isHiding, setIsHiding] = useState(false);
  const { lang } = useLanguage();

  useEffect(() => {
    if (isAdmin) return;

    // Only run once per session
    const hasPlayed = sessionStorage.getItem("intro_played");
    if (hasPlayed) {
      return;
    }

    setShow(true);
    document.body.style.overflow = "hidden"; // Prevent scrolling during intro

    let currentProgress = 0;
    const duration = 1800; // 1.8s
    const interval = 20; // 20ms steps
    const step = (100 / (duration / interval));

    const timer = setInterval(() => {
      currentProgress += step;
      if (currentProgress >= 100) {
        currentProgress = 100;
        clearInterval(timer);
        setTimeout(() => {
          setIsHiding(true);
          sessionStorage.setItem("intro_played", "true");
          
          setTimeout(() => {
            setShow(false);
            document.body.style.overflow = ""; // Restore scrolling
          }, 1000); // wait for exit animation
        }, 200); // Short pause at 100%
      }
      setProgress(Math.floor(currentProgress));
    }, interval);

    return () => clearInterval(timer);
  }, []);

  if (isAdmin || !show) return null;

  return (
    <AnimatePresence>
      {!isHiding && (
        <motion.div
          key="preloader"
          initial={{ y: 0 }}
          exit={{ y: "-100%", transition: { duration: 0.9, ease: [0.76, 0, 0.24, 1] } }}
          className="fixed inset-0 z-[99999] bg-[#1A0F0A] flex flex-col items-center justify-center text-[#F4EFEA] pointer-events-none"
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            className="flex flex-col items-center"
          >
            <span className="text-[#C5A880] text-xs font-sans tracking-[0.3em] uppercase mb-4 text-center">
              {lang === "en" ? "Welcome to" : "Chào mừng đến với"}
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif tracking-wide text-[#F4EFEA] mb-12">
              Cẩm Cù House
            </h1>

            <div className="flex flex-col items-center">
              <span className="font-sans text-xs tracking-widest text-[#F4EFEA]/80">
                {progress.toString().padStart(2, "0")}%
              </span>
              <div className="h-[1px] bg-[#C5A880]/30 w-48 mt-4 overflow-hidden relative">
                <div 
                  className="absolute top-0 left-0 bottom-0 bg-[#C5A880] transition-all duration-75"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
