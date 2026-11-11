"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import OpenStatusBadge from "@/components/OpenStatusBadge";
import { CAM_CU_HOUSE_INFO } from "@/data/camCuHouseData";
import {
  Compass,
  ArrowRight,
  Navigation,
  PhoneCall,
  CheckCircle2,
  TreePine,
  Coffee,
  Coins,
  BookOpen,
  Image as ImageIcon,
  UtensilsCrossed,
  MapPin,
  ExternalLink
} from "lucide-react";

export default function EditorialHero() {
  const { locale } = useLanguage();
  const isVi = locale !== "en";

  const coreAmenities = [
    {
      icon: <TreePine className="w-5 h-5 text-[#4A5D23]" />,
      titleVi: "Chỗ ngồi ngoài trời bên suối",
      titleEn: "Creekside Outdoor Seating",
      descVi: "View bên bờ suối mát lành, không gian sinh thái xanh sạch tự nhiên.",
      descEn: "Refreshing natural creek view, pristine green ecological atmosphere.",
    },
    {
      icon: <Coffee className="w-5 h-5 text-[#E86C3A]" />,
      titleVi: "Cà phê & Nước ép xanh sạch",
      titleEn: "Green & Clean Beverages",
      descVi: "Robusta rang củi mộc đậm vị, nước ép và trà thảo mộc tươi ngon.",
      descEn: "Wood-fired artisanal Robusta coffee, cold-pressed juices & fresh herbal teas.",
    },
    {
      icon: <Coins className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />,
      titleVi: "Mức giá bình dân $ (100% Đề xuất)",
      titleEn: "Affordable Price $ (100% Recommended)",
      descVi: "Mức giá thân thiện từ 20k–45k, nhận 8/8 đánh giá hài lòng tuyệt đối.",
      descEn: "Honest pricing from 20k–45k, 100% positive ratings across 8/8 reviews.",
    },
  ];

  const quickPortals = [
    {
      num: "[02]",
      route: "/cau-chuyen",
      titleVi: "CÂU CHUYỆN",
      titleEn: "OUR STORY",
      subVi: "Hành trình khởi sinh quán cà phê sinh thái trong con hẻm 437",
      subEn: "The origins of our eco-sanctuary tucked in lane 437",
      icon: <BookOpen className="w-5 h-5 text-[#E86C3A]" />,
      bg: "bg-[#141B17]",
    },
    {
      num: "[03]",
      route: "/khong-gian-suoi",
      titleVi: "KHÔNG GIAN SUỐI",
      titleEn: "STREAM SANCTUARY",
      subVi: "30 bức ảnh triển lãm trực tuyến qua 4 chương cảm xúc",
      subEn: "Online gallery of 30 figures across 4 chapters",
      icon: <ImageIcon className="w-5 h-5 text-[#4A5D23]" />,
      bg: "bg-[#121A15]",
    },
    {
      num: "[04]",
      route: "/thuc-don",
      titleVi: "THỰC ĐƠN",
      titleEn: "EDITORIAL MENU",
      subVi: "Thực đơn 67 món 7 nhóm thanh lịch không dùng ảnh thumbnail",
      subEn: "Text-only botanical monograph with 67 items in 7 categories",
      icon: <UtensilsCrossed className="w-5 h-5 text-[#E86C3A]" />,
      bg: "bg-[#181D1A]",
    },
    {
      num: "[05]",
      route: "/chi-duong-lien-he",
      titleVi: "CHỈ ĐƯỜNG & LIÊN HỆ",
      titleEn: "DIRECTIONS & CONTACT",
      subVi: "Bản đồ Hẻm 437 Hùng Vương, form đặt bàn & gọi hotline kép",
      subEn: "Interactive map, pre-order reservation assistant & dual hotlines",
      icon: <MapPin className="w-5 h-5 text-emerald-400" />,
      bg: "bg-[#131916]",
    },
  ];

  return (
    <section className="relative w-full py-10 sm:py-16 px-4 sm:px-8 border-b border-[var(--border-subtle)] bg-[var(--bg-primary)] text-[var(--text-primary)] overflow-hidden transition-colors">
      <div className="w-full max-w-[1400px] mx-auto relative z-10 flex flex-col gap-10">
        {/* Top Masthead metadata bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[var(--border-subtle)]">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs uppercase tracking-widest text-[#E86C3A] font-bold">
              [EDITORIAL BOTANICAL MONOGRAPH]
            </span>
            <span className="text-[var(--text-secondary)] font-mono text-xs">
              {CAM_CU_HOUSE_INFO.coordinates.display} · Đắk Nông
            </span>
          </div>

          <OpenStatusBadge />
        </div>

        {/* Editorial Magazine Cover Hero */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          <div className="lg:col-span-8 flex flex-col gap-5">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 font-mono text-[13px] uppercase tracking-widest text-[#E86C3A] font-bold"
            >
              <Compass className="w-4 h-4 text-[#E86C3A]" />
              <span>
                {isVi
                  ? "CÀ PHÊ SINH THÁI BÊN BỜ SUỐI ĐẮK NÔNG"
                  : "HIGHLAND STREAM ECO SANCTUARY & ARTISAN COFFEE"}
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-display font-black text-[clamp(36px,6vw,76px)] tracking-tight leading-[1.25] sm:leading-snug mb-2 text-[var(--text-primary)] uppercase"
            >
              CẨM CÙ HOUSE
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-[19px] sm:text-[23px] text-[#E86C3A] font-serif italic leading-relaxed"
            >
              {isVi
                ? "Chốn dừng chân mộc mạc bên bờ suối tự nhiên giữa lòng Gia Nghĩa"
                : "A rustic eco-sanctuary beside the natural mountain creek in Gia Nghia"}
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="text-[15px] sm:text-[16px] text-[var(--text-secondary)] max-w-2xl leading-relaxed"
            >
              {CAM_CU_HOUSE_INFO.tagline}.{" "}
              {isVi
                ? "Hòa mình cùng thanh âm suối đá chảy róc rách, bóng râm cổ thụ và tách cà phê Robusta rang củi mộc nguyên bản bên triền đồi đất đỏ Tây Nguyên."
                : "Immerse yourself in gentle creek currents, ancient tree canopies, and firewood-roasted artisanal coffee in the Dak Nong red highlands."}
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap items-center gap-4 pt-3"
            >
              <Link
                href="/thuc-don"
                className="btn-cta-primary px-7 py-3.5 text-[15px] rounded-full inline-flex items-center gap-2 font-bold shadow-md"
              >
                <span>{isVi ? "Xem Thực Đơn 67 Món" : "Explore Menu (67 Items)"}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/chi-duong-lien-he"
                className="btn-cta-secondary px-6 py-3.5 text-[15px] rounded-full inline-flex items-center gap-2 font-semibold"
              >
                <Navigation className="w-4 h-4" />
                <span>{isVi ? "Chỉ Đường & Đặt Bàn" : "Directions & Reserve"}</span>
              </Link>

              <a
                href={CAM_CU_HOUSE_INFO.contacts.primaryTel}
                className="px-4 py-3.5 text-[14px] font-mono font-bold text-[var(--text-primary)] hover:text-[#E86C3A] transition-colors inline-flex items-center gap-2"
              >
                <PhoneCall className="w-4 h-4 text-[#E86C3A]" />
                <span>Hotline: 0382 851 688</span>
              </a>
            </motion.div>
          </div>

          {/* Social Proof & Hours Card */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <div className="p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex flex-col gap-5 shadow-sm">
              {/* 100% Social Proof */}
              <div className="flex items-start gap-3.5 pb-4 border-b border-[var(--border-subtle)]">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div className="flex flex-col">
                  <span className="font-mono text-xs uppercase text-[#E86C3A] font-bold tracking-wider">
                    {isVi ? "TÍN NHIỆM THỰC TẾ" : "AUTHENTIC SOCIAL PROOF"}
                  </span>
                  <p className="font-display font-black text-[22px] text-[var(--text-primary)] leading-tight mt-0.5">
                    100% Đề Xuất
                  </p>
                  <span className="text-[13px] text-[var(--text-secondary)]">
                    {isVi
                      ? "Dựa trên 8/8 lượt đánh giá hài lòng từ khách trải nghiệm"
                      : "Based on 8/8 verified authentic customer recommendations"}
                  </span>
                </div>
              </div>

              {/* Local Key Coordinates & Hours */}
              <div className="flex flex-col gap-2.5 text-[14px]">
                <div className="flex items-start gap-2 text-[var(--text-secondary)]">
                  <MapPin className="w-4 h-4 text-[#E86C3A] shrink-0 mt-0.5" />
                  <span>{CAM_CU_HOUSE_INFO.address.fullAddress}</span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[var(--border-subtle)] font-mono text-xs text-[var(--text-secondary)]">
                  <span>{isVi ? "Thứ 2 – Thứ 5" : "Mon – Thu"}</span>
                  <span className="font-bold text-[var(--text-primary)]">07:00 – 18:00</span>
                </div>

                <div className="flex items-center justify-between font-mono text-xs text-[var(--text-secondary)]">
                  <span>{isVi ? "Thứ 6 – Chủ Nhật" : "Fri – Sun"}</span>
                  <span className="font-bold text-[#E86C3A]">07:00 – 22:00</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3 TIỆN ÍCH CỐT LÕI (CORE AMENITIES) */}
        <div className="pt-8 border-t border-[var(--border-subtle)]">
          <div className="flex items-center gap-2 mb-6">
            <span className="font-mono text-xs uppercase text-[#E86C3A] font-bold tracking-wider">
              [CORE ATTRIBUTES]
            </span>
            <span className="text-[var(--text-secondary)] font-mono text-xs">
              {isVi ? "3 Tiện Ích Cốt Lõi Tại Cẩm Cù House" : "3 Core Signatures of Cẩm Cù House"}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {coreAmenities.map((amenity, i) => (
              <div
                key={i}
                className="p-6 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex flex-col gap-3 hover:border-[#E86C3A]/50 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-subtle)] flex items-center justify-center">
                  {amenity.icon}
                </div>
                <h3 className="font-sans font-bold text-[17px] text-[var(--text-primary)]">
                  {isVi ? amenity.titleVi : amenity.titleEn}
                </h3>
                <p className="text-[14px] text-[var(--text-secondary)] leading-relaxed">
                  {isVi ? amenity.descVi : amenity.descEn}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 4 THẺ ĐIỀU HƯỚNG NHANH ĐÓNG/MỞ SANG [02], [03], [04], [05] */}
        <div className="pt-8 border-t border-[var(--border-subtle)]">
          <div className="flex items-center justify-between gap-4 mb-6">
            <div>
              <span className="font-mono text-xs uppercase text-[#E86C3A] font-bold tracking-wider block">
                [MULTI-PAGE EXPLORER]
              </span>
              <h2 className="font-display font-extrabold text-[22px] sm:text-[26px] uppercase tracking-tight text-[var(--text-primary)]">
                {isVi ? "Khám Phá Các Chuyên Trang Độc Lập" : "Explore Independent Chapters"}
              </h2>
            </div>
            <span className="font-mono text-xs text-[var(--text-secondary)] hidden sm:block">
              {isVi ? "Đóng / Mở trang mượt mà" : "Smooth Page Transitions"}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {quickPortals.map((portal) => (
              <Link
                key={portal.route}
                href={portal.route}
                className={`group p-6 rounded-xl border border-white/10 ${portal.bg} text-[#F3F1EC] flex flex-col justify-between gap-6 hover:border-[#E86C3A] transition-all hover:-translate-y-1 shadow-md`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-[#E86C3A]">
                    {portal.num}
                  </span>
                  <div className="p-2 rounded-md bg-white/5 border border-white/10 group-hover:bg-[#E86C3A]/20 transition-colors">
                    {portal.icon}
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <h3 className="font-display font-black text-[18px] uppercase tracking-tight text-[#F3F1EC] group-hover:text-[#E86C3A] transition-colors">
                    {isVi ? portal.titleVi : portal.titleEn}
                  </h3>
                  <p className="text-[13px] text-white/70 line-clamp-2 leading-relaxed">
                    {isVi ? portal.subVi : portal.subEn}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 font-mono text-[12px] font-bold text-[#E86C3A] uppercase tracking-wider pt-2 border-t border-white/10">
                  <span>{isVi ? "Mở chuyên trang" : "Open page"}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
