"use client";

import React from "react";
import Link from "next/link";
import SafeImage from "@/components/ui/SafeImage";
import Footer from "@/components/Footer";
import CustomerReviewsSection from "@/components/home/CustomerReviewsSection";
import StarHoya from "@/components/ui/StarHoya";
import { useLanguage } from "@/context/LanguageContext";
import { CAM_CU_HOUSE_INFO } from "@/data/camCuHouseData";
import {
  Compass,
  ArrowRight,
  Navigation,
  PhoneCall,
  CheckCircle2,
  TreePine,
  Coffee,
  HeartHandshake,
  Sparkles,
  MapPin
} from "lucide-react";

export default function StoryPage() {
  const { locale } = useLanguage();
  const isVi = locale !== "en";

  return (
    <div className="bg-[var(--bg-primary)] text-[var(--text-primary)] min-h-screen font-sans selection:bg-[#E86C3A] selection:text-white transition-colors">
      <main className="w-full">
        {/* MASTHEAD HEADER */}
        <section className="relative w-full py-10 sm:py-16 px-4 sm:px-8 border-b border-[var(--border-subtle)] bg-[#0E100F] text-[#F3F1EC]">
          <div className="w-full max-w-[1280px] mx-auto flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs uppercase tracking-widest text-[#E86C3A] font-bold">
                [02] CÂU CHUYỆN · EDITORIAL LONG-FORM
              </span>
              <span className="text-white/40 font-mono text-xs">·</span>
              <span className="text-white/60 font-mono text-xs">
                Gia Nghĩa, Đắk Nông · 11.99° N, 107.69° E
              </span>
            </div>

            <h1 className="font-display font-black text-[clamp(32px,5.5vw,68px)] uppercase tracking-tight text-[#F3F1EC] leading-[1.25] sm:leading-snug mb-2">
              {isVi
                ? "HÀNH TRÌNH BÊN DÒNG SUỐI HẺM 437 HÙNG VƯƠNG"
                : "THE ECO-SANCTUARY JOURNEY BY LANE 437 STREAM"}
            </h1>

            <p className="font-serif italic text-[20px] sm:text-[24px] text-[#E86C3A] max-w-3xl leading-relaxed">
              {isVi
                ? "Nơi thiên nhiên nguyên sơ ôm trọn từng tách cà phê đậm vị, nơi bước chân người tìm về sự trong lành giữa lòng Gia Nghĩa."
                : "Where untamed nature cradles rich artisanal coffee, and weary souls rediscover serenity."}
            </p>

            <div className="flex flex-wrap items-center gap-6 pt-4 text-xs font-mono text-white/60 border-t border-white/10">
              <span>ĐỊA CHỈ: HẺM 437 HÙNG VƯƠNG, NGHĨA TRUNG, GIA NGHĨA</span>
              <span>ĐỘ CAO: 800M+ CAO NGUYÊN</span>
              <span className="text-[#E86C3A] font-bold">TÍN NHIỆM: 100% ĐỀ XUẤT (8/8 ĐÁNH GIÁ)</span>
            </div>
          </div>
        </section>

        {/* HERO IMAGE BANNER */}
        <div className="w-full h-[360px] sm:h-[460px] relative overflow-hidden bg-black">
          <SafeImage
            src="/uploads/gallery/1788250253554-875120458.jpg"
            alt="Không gian Cẩm Cù House bên dòng suối mát"
            fill
            className="object-cover opacity-85"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)] via-transparent to-black/40" />
          <div className="absolute bottom-6 left-4 sm:left-12 max-w-lg p-4 rounded-xl bg-black/75 backdrop-blur-md border border-white/20 text-[#F3F1EC]">
            <span className="font-mono text-[11px] text-[#E86C3A] uppercase tracking-wider block font-bold">
              FIG. STORY-01 · KHÔNG GIAN BÊN SUỐI
            </span>
            <p className="text-[13px] text-white/90 mt-1 leading-relaxed">
              Ban công gỗ đón gió chiều róc rách bên bờ suối tự nhiên Cẩm Cù House.
            </p>
          </div>
        </div>

        {/* LONG-FORM ARTICLE BODY */}
        <section className="w-full max-w-[960px] mx-auto px-5 sm:px-8 py-20 flex flex-col gap-12">
          {/* Chapter I: Khởi nguồn */}
          <article className="flex flex-col gap-6">
            <div className="flex items-center gap-2 font-mono text-xs text-[#E86C3A] font-bold uppercase tracking-widest">
              <span>[PHẦN I]</span>
              <span>·</span>
              <span>CON HẺM NHỎ VÀ DÒNG CHẢY BÌNH YÊN</span>
            </div>
            <h2 className="font-display font-extrabold text-[28px] sm:text-[36px] tracking-tight text-[var(--text-primary)]">
              {isVi
                ? "Giữa phố thị ồn ã, có một chốn dừng chân nép mình bên suối đá"
                : "Tucked inside an alley, an oasis awaits by the basalt stream"}
            </h2>
            <div className="prose prose-lg dark:prose-invert text-[var(--text-secondary)] leading-relaxed space-y-5 text-[16px] sm:text-[17px]">
              <p>
                Rẽ vào con <strong>Hẻm 437 đường Hùng Vương (Phường Nghĩa Trung, TP. Gia Nghĩa)</strong>, tiếng còi xe và nhịp sống tất bật dần nhường chỗ cho tiếng nước reo róc rách luồn qua những tảng đá bazan rêu phong. Cẩm Cù House ra đời không phải như một quán cà phê công nghiệp hào nhoáng, mà là một khoảng trời sinh thái mộc mạc được gìn giữ bằng tất cả tình yêu với thiên nhiên đại ngàn Đắk Nông.
              </p>
              <p>
                Tại đây, địa hình dốc tự nhiên được trân trọng giữ nguyên. Những phiến đá suối tự nhiên, những tán cây cổ thụ sum xuê và khóm hoa Cẩm Cù son sắt nở hoa quanh năm tạo nên một bức tranh xanh mát trong lành. Khách đến quán có thể chọn cho mình một chiếc bàn gỗ bên bờ suối, chạm chân vào làn sương sớm cao nguyên, và hít thở bầu không khí thuần khiết ở độ cao hơn 800m.
              </p>
            </div>
          </article>

          {/* Quote Block */}
          <blockquote className="my-6 p-8 rounded-2xl bg-[#0E100F] text-[#F3F1EC] border-l-4 border-[#E86C3A] relative">
            <StarHoya className="absolute top-6 right-6 text-[#E86C3A]/30 w-10 h-10" />
            <p className="font-serif italic text-[20px] sm:text-[23px] text-[#F3F1EC] leading-relaxed">
              &ldquo;Chúng tôi tin rằng tách cà phê ngon nhất là tách cà phê được thưởng thức trong sự an yên của tâm hồn, giữa tiếng thì thầm của dòng suối và bóng mát của rừng cây bản địa.&rdquo;
            </p>
            <cite className="font-mono text-xs text-[#E86C3A] mt-4 block uppercase tracking-wider not-italic">
              — CẨM CÙ HOUSE · TRIẾT LÝ SINH THÁI BẢN ĐỊA
            </cite>
          </blockquote>

          {/* Chapter II: Cà phê xanh sạch & Giá bình dân */}
          <article className="flex flex-col gap-6">
            <div className="flex items-center gap-2 font-mono text-xs text-[#E86C3A] font-bold uppercase tracking-widest">
              <span>[PHẦN II]</span>
              <span>·</span>
              <span>CÀ PHÊ NGUYÊN BẢN & MỨC GIÁ BÌNH DÂN</span>
            </div>
            <h2 className="font-display font-extrabold text-[28px] sm:text-[36px] tracking-tight text-[var(--text-primary)]">
              {isVi
                ? "Hạt Robusta rang củi mộc và thực đơn 67 món lành tính"
                : "Artisanal wood-fired Robusta & wholesome refreshments"}
            </h2>
            <div className="prose prose-lg dark:prose-invert text-[var(--text-secondary)] leading-relaxed space-y-5 text-[16px] sm:text-[17px]">
              <p>
                Cà phê tại Cẩm Cù House được tuyển lựa kỹ càng từ những vùng trồng cà phê bazan màu mỡ của Đắk Nông, rang củi thủ công giữ trọn tầng hương mộc nồng nàn. Bên cạnh cà phê muối béo dịu, cà phê dừa đá xay độc đáo, quán còn phục vụ thực đơn đồ uống phong phú gồm trà hoa thảo mộc ngâm mật ong rừng, sinh tố bơ sáp trứ danh, nước ép tươi nguyên chất và điểm tâm ấm bụng.
              </p>
              <p>
                Với định hướng thân thiện và gần gũi, Cẩm Cù House giữ mức giá bình dân <strong>$ (chỉ từ 20.000đ – 45.000đ)</strong>, để bất kỳ người lữ khách phương xa hay người dân bản địa nào cũng có thể ghé lại, tìm một chốn an trú tĩnh tại mà không chút đắn đo.
              </p>
            </div>
          </article>

          {/* CHỨNG THỰC 100% ĐỀ XUẤT */}
          <div className="p-8 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex flex-col gap-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div className="flex flex-col">
                <span className="font-mono text-xs uppercase text-[#E86C3A] font-bold tracking-wider">
                  CHỨNG THỰC TÍN NHIỆM
                </span>
                <h3 className="font-display font-black text-[24px] sm:text-[28px] text-[var(--text-primary)]">
                  100% Đề Xuất (8 Lượt Đánh Giá Thực Tế)
                </h3>
              </div>
            </div>
            <p className="text-[15px] text-[var(--text-secondary)] leading-relaxed">
              Mọi du khách từng ghé thăm Cẩm Cù House đều chia sẻ sự ngạc nhiên trước vẻ đẹp nguyên sơ, làn gió mát lạnh bên bờ suối và thái độ phục vụ ân cần, chân chất của vùng cao nguyên.
            </p>
          </div>
        </section>

        {/* CUSTOMER REVIEWS */}
        <section className="w-full bg-[var(--bg-surface)] py-16 border-y border-[var(--border-subtle)]">
          <CustomerReviewsSection lang={isVi ? "VN" : "EN"} />
        </section>

        {/* NAVIGATION TIẾP THEO SANG TRANG KHÁC */}
        <section className="w-full max-w-[1280px] mx-auto px-5 sm:px-8 py-20 flex flex-col gap-8">
          <div className="text-center flex flex-col items-center gap-2">
            <span className="font-mono text-xs text-[#E86C3A] uppercase font-bold tracking-wider">
              [HÀNH TRÌNH TIẾP NỐI]
            </span>
            <h3 className="font-display font-black text-[28px] sm:text-[34px] uppercase text-[var(--text-primary)]">
              Khám Phá Các Chuyên Trang Tiếp Theo
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              href="/khong-gian-suoi"
              className="group p-6 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:border-[#E86C3A] transition-all flex flex-col justify-between gap-4"
            >
              <span className="font-mono text-xs text-[#E86C3A] font-bold">[03] KHÔNG GIAN SUỐI</span>
              <p className="font-display font-extrabold text-[18px] text-[var(--text-primary)] group-hover:text-[#E86C3A] transition-colors">
                Triển lãm trực tuyến 30 bức ảnh không gian qua 4 chương cảm xúc →
              </p>
            </Link>

            <Link
              href="/thuc-don"
              className="group p-6 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:border-[#E86C3A] transition-all flex flex-col justify-between gap-4"
            >
              <span className="font-mono text-xs text-[#E86C3A] font-bold">[04] THỰC ĐƠN</span>
              <p className="font-display font-extrabold text-[18px] text-[var(--text-primary)] group-hover:text-[#E86C3A] transition-colors">
                Thực đơn Editorial Text-Only 67 món 7 nhóm thanh lịch →
              </p>
            </Link>

            <Link
              href="/chi-duong-lien-he"
              className="group p-6 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:border-[#E86C3A] transition-all flex flex-col justify-between gap-4"
            >
              <span className="font-mono text-xs text-[#E86C3A] font-bold">[05] CHỈ ĐƯỜNG & LIÊN HỆ</span>
              <p className="font-display font-extrabold text-[18px] text-[var(--text-primary)] group-hover:text-[#E86C3A] transition-colors">
                Bản đồ đường đi Hẻm 437 Hùng Vương & Form đặt trước →
              </p>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

