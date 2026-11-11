"use client";

import React, { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { CAM_CU_HOUSE_INFO } from "@/data/camCuHouseData";
import {
  MapPin,
  PhoneCall,
  Mail,
  Clock,
  Compass,
  Navigation,
  CalendarDays,
  ExternalLink,
} from "lucide-react";
import ReservationModal from "./ReservationModal";

export default function ContactSection() {
  const { locale } = useLanguage();
  const isVi = locale !== "en";
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <section
      id="contact-section"
      className="w-full max-w-[1360px] mx-auto px-5 sm:px-10 py-20 border-t border-[var(--border-subtle)]"
      aria-labelledby="contact-heading"
    >
      <div className="flex flex-col gap-12">
        {/* Header */}
        <div className="flex flex-col gap-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 font-mono text-[12px] uppercase tracking-widest text-[var(--accent-botanical)] font-bold">
            <Compass className="w-3.5 h-3.5 text-[var(--accent-botanical)]" />
            <span>
              {isVi ? "KẾT NỐI & CHỈ ĐƯỜNG" : "LOCATION & CONNECT"}
            </span>
          </div>

          <h2 id="contact-heading" className="font-display font-black text-[clamp(28px,4.5vw,46px)] text-[var(--text-primary)] leading-tight">
            {isVi ? "Từ Gia Nghĩa, Cẩm Cù House Đón Bạn" : "From Gia Nghia, Cẩm Cù House Welcomes You"}
          </h2>

          <p className="text-[15px] sm:text-[16px] text-[var(--text-secondary)] leading-relaxed">
            {isVi
              ? "Chốn dừng chân thanh bình bên dòng suối mát rượi, ô tô vào tận sân quán. Mở Google Maps hoặc gọi hotline để được hỗ trợ đón tiếp tận tình nhất."
              : "A peaceful retreat hidden beside the crystal stream, easily accessible by car right to our courtyard. Open Google Maps or call our hotline for the warmest welcome."}
          </p>
        </div>

        {/* 3 Columns Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Col 1: Địa chỉ & Tọa độ */}
          <div className="p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex flex-col justify-between gap-6 shadow-sm">
            <div className="flex flex-col gap-3">
              <div className="w-10 h-10 rounded-full bg-[var(--accent-botanical)]/10 text-[var(--accent-botanical)] flex items-center justify-center">
                <MapPin className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-[20px] text-[var(--text-primary)]">
                {isVi ? "Địa Chỉ Quán" : "Address & Location"}
              </h3>
              <p className="text-[15px] text-[var(--text-secondary)] leading-relaxed">
                {CAM_CU_HOUSE_INFO.address.fullAddress}
              </p>
              <span className="font-mono text-xs text-[var(--accent-warm)]">
                Tọa độ: {CAM_CU_HOUSE_INFO.coordinates.display}
              </span>
            </div>

            <a
              href={CAM_CU_HOUSE_INFO.socials.googleMaps}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-cta-secondary w-full py-3 text-xs justify-center inline-flex items-center gap-2 rounded-xl"
            >
              <Navigation className="w-4 h-4" />
              <span>{isVi ? "Mở Google Maps" : "Open Google Maps"}</span>
              <ExternalLink className="w-3.5 h-3.5 ml-auto" />
            </a>
          </div>

          {/* Col 2: Hotline & Giờ mở cửa */}
          <div className="p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex flex-col justify-between gap-6 shadow-sm">
            <div className="flex flex-col gap-3">
              <div className="w-10 h-10 rounded-full bg-[var(--accent-warm)]/10 text-[var(--accent-warm)] flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-[20px] text-[var(--text-primary)]">
                {isVi ? "Hotline & Giờ Mở Cửa" : "Hotline & Hours"}
              </h3>

              <div className="flex flex-col gap-1.5 font-mono text-xs">
                <div className="flex items-center justify-between text-[var(--text-secondary)]">
                  <span>Thứ 2 – Thứ 5:</span>
                  <span className="font-bold text-[var(--text-primary)]">07:00 – 18:00</span>
                </div>
                <div className="flex items-center justify-between text-[var(--text-secondary)]">
                  <span>Thứ 6 – Chủ Nhật:</span>
                  <span className="font-bold text-[var(--accent-warm)]">07:00 – 22:00</span>
                </div>
              </div>

              <div className="pt-2 border-t border-[var(--border-subtle)] flex flex-col gap-1">
                <span className="text-xs text-[var(--text-secondary)]">Hotline hỗ trợ:</span>
                <span className="font-mono font-bold text-[16px] text-[var(--text-primary)]">
                  {CAM_CU_HOUSE_INFO.contacts.formattedPhones[0]} — {CAM_CU_HOUSE_INFO.contacts.formattedPhones[1]}
                </span>
                <span className="text-xs text-[var(--text-secondary)]">
                  Email: {CAM_CU_HOUSE_INFO.contacts.email}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={CAM_CU_HOUSE_INFO.contacts.primaryTel}
                className="btn-cta-primary flex-1 py-3 text-xs justify-center inline-flex items-center gap-1.5 rounded-xl"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Gọi 0382 851 688</span>
              </a>

              <a
                href={CAM_CU_HOUSE_INFO.contacts.secondaryTel}
                className="btn-cta-secondary flex-1 py-3 text-xs justify-center inline-flex items-center gap-1.5 rounded-xl"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Gọi 0774 659 000</span>
              </a>
            </div>
          </div>

          {/* Col 3: Đặt chỗ & Hệ sinh thái số */}
          <div className="p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex flex-col justify-between gap-6 shadow-sm">
            <div className="flex flex-col gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <CalendarDays className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-[20px] text-[var(--text-primary)]">
                {isVi ? "Đặt Chỗ & Mạng Xã Hội" : "Reservation & Socials"}
              </h3>
              <p className="text-[14px] text-[var(--text-secondary)] leading-relaxed">
                {isVi
                  ? "Đặt bàn bờ suối cho nhóm gia đình, du khách hoặc ghi chú món mang về nhanh chóng."
                  : "Reserve streamside seating for families or travelers, or prepare your takeaway notes."}
              </p>

              {/* Social Channels Links */}
              <div className="grid grid-cols-3 gap-2 pt-1 font-mono text-xs">
                <a
                  href={CAM_CU_HOUSE_INFO.socials.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg border border-[var(--border-subtle)] text-center hover:border-[var(--text-primary)] transition-colors"
                >
                  Facebook
                </a>
                <a
                  href={CAM_CU_HOUSE_INFO.socials.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg border border-[var(--border-subtle)] text-center hover:border-[var(--text-primary)] transition-colors"
                >
                  TikTok
                </a>
                <a
                  href={CAM_CU_HOUSE_INFO.socials.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg border border-[var(--border-subtle)] text-center hover:border-[var(--text-primary)] transition-colors"
                >
                  YouTube
                </a>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="btn-cta-primary w-full py-3 text-xs justify-center inline-flex items-center gap-2 rounded-xl"
            >
              <CalendarDays className="w-4 h-4" />
              <span>{isVi ? "Mở Trợ Lý Đặt Bàn" : "Open Reservation"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Reservation Modal */}
      <ReservationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </section>
  );
}

