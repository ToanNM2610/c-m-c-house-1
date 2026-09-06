"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { Coffee, Sprout, HeartHandshake, Compass } from "lucide-react";
import BlurText from "@/components/ui/BlurText";
import { useLanguage } from "@/context/LanguageContext";

const About3DScene = dynamic(() => import("@/components/3d/About3DScene"), {
  ssr: false,
  loading: () => null,
});

export default function AboutPage() {
  const { lang, t } = useLanguage();

  const TIMELINE_STAGES = [
    {
      step: t("about.stage1Step"),
      title: t("about.stage1Title"),
      icon: Sprout,
      p1: t("about.stage1p1"),
      p2: t("about.stage1p2"),
    },
    {
      step: t("about.stage2Step"),
      title: t("about.stage2Title"),
      icon: Coffee,
      p1: t("about.stage2p1"),
      p2: t("about.stage2p2"),
    },
    {
      step: t("about.stage3Step"),
      title: t("about.stage3Title"),
      icon: HeartHandshake,
      p1: t("about.stage3p1"),
      p2: t("about.stage3p2"),
    },
  ];

  return (
    <main className="relative min-h-screen font-sans bg-[#1A0F0A] text-[#F4EFEA] z-10 pt-32 pb-36 overflow-hidden">
      {/* 3D Z-Drive Parallax Tunnel Background */}
      <About3DScene />

      <section className="relative z-10 max-w-6xl mx-auto px-6 sm:px-8">
        {/* HEADER: VỀ CẨM CÙ HOUSE */}
        <div className="text-center mb-24 max-w-3xl mx-auto">
          <span className="text-[#C5A880] uppercase tracking-[0.25em] text-xs sm:text-sm mb-3 block font-sans font-medium">
            {t("about.tag")}
          </span>
          <BlurText 
            text={t("about.mainTitle")}
            as="h1"
            className="text-4xl md:text-6xl lg:text-7xl font-serif text-[#F4EFEA] mb-6 tracking-tight"
          />
          <p className="text-sm sm:text-base text-[#F4EFEA]/75 font-light leading-relaxed max-w-2xl mx-auto">
            {t("about.mainDesc")}
          </p>
          <div className="w-20 h-[1px] bg-gradient-to-r from-transparent via-[#C5A880]/60 to-transparent mx-auto mt-8"></div>
        </div>

        {/* TIMELINE THANH MẢNH SANG TRỌNG */}
        <div className="relative">
          {/* Trục chỉ vàng kim chạy dọc tâm Timeline */}
          <div className="absolute left-6 sm:left-1/2 top-4 bottom-4 w-[1px] bg-gradient-to-b from-transparent via-[#C5A880]/50 to-transparent sm:-translate-x-1/2 pointer-events-none" />

          <div className="space-y-16 sm:space-y-24">
            {TIMELINE_STAGES.map((stage, idx) => {
              const Icon = stage.icon;
              const isEven = idx % 2 === 0;

              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 35 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                  className={`relative flex flex-col sm:flex-row items-start sm:items-center gap-8 sm:gap-0 ${
                    isEven ? "sm:flex-row" : "sm:flex-row-reverse"
                  }`}
                >
                  {/* Cột Nội Dung Thẻ */}
                  <div
                    className={`w-full sm:w-1/2 pl-16 sm:pl-0 ${
                      isEven ? "sm:pr-14 sm:text-right" : "sm:pl-14 sm:text-left"
                    }`}
                  >
                    <div className="p-8 sm:p-10 rounded-2xl bg-[#1A0F0A]/90 backdrop-blur-md border border-[#C5A880]/30 shadow-2xl hover:border-[#C5A880]/60 transition-all duration-500 group">
                      <span className="inline-block text-[#C5A880] font-mono text-xs tracking-widest uppercase mb-2 px-2.5 py-1 rounded bg-[#C5A880]/15 font-semibold">
                        {stage.step}
                      </span>
                      <h3 className="text-2xl sm:text-3xl font-serif text-[#F4EFEA] mb-4 group-hover:text-[#C5A880] transition-colors duration-300">
                        {stage.title}
                      </h3>
                      <p className="text-sm sm:text-base text-[#F4EFEA]/80 font-light leading-relaxed mb-3">
                        {stage.p1}
                      </p>
                      <p className="text-sm sm:text-base text-[#F4EFEA]/70 font-light leading-relaxed">
                        {stage.p2}
                      </p>
                    </div>
                  </div>

                  {/* Node Tròn Biểu Tượng Căn Giữa Trục Timeline */}
                  <div className="absolute left-6 sm:left-1/2 -translate-x-1/2 flex items-center justify-center z-20">
                    <div className="w-12 h-12 rounded-full border-2 border-[#C5A880] bg-[#1A0F0A] flex items-center justify-center text-[#C5A880] shadow-[0_0_20px_rgba(197,168,128,0.4)] group-hover:scale-110 transition-transform">
                      <Icon size={20} strokeWidth={1.5} />
                    </div>
                  </div>

                  {/* Khoảng trống đối xứng bên kia (cho desktop) */}
                  <div className="hidden sm:block sm:w-1/2" />
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* FOOTER CALLOUT NHỎ BÊN DƯỚI */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-28 text-center"
        >
          <div className="inline-flex items-center gap-2 text-xs font-mono text-[#C5A880] border border-[#C5A880]/30 px-6 py-2.5 rounded-full bg-[#1A0F0A]/85 backdrop-blur-sm shadow-lg">
            <Compass size={14} />
            <span>
              {lang === "en" 
                ? "GIA NGHIA, DAK NONG • WHERE BOTANICAL LIFE MEETS ARTISAN COFFEE" 
                : "GIA NGHĨA, ĐẮK NÔNG • ĐIỂM CHẠM THIÊN NHIÊN VÀ CÀ PHÊ MỘC"}
            </span>
          </div>
        </motion.div>
      </section>
    </main>
  );
}
