"use client";

import { useState } from "react";
import EditorialHero from "@/components/home/EditorialHero";
import SpatialScrollytellingSection from "@/components/home/SpatialScrollytellingSection";
import EditorialMenuSection from "@/components/home/EditorialMenuSection";
import CustomerReviewsSection from "@/components/home/CustomerReviewsSection";
import ContactSection from "@/components/home/ContactSection";
import Footer from "@/components/Footer";
import ReservationModal from "@/components/home/ReservationModal";

export default function HomePage() {
  const [preOrderItems, setPreOrderItems] = useState<string[]>([]);
  const [reservationModalOpen, setReservationModalOpen] = useState(false);

  return (
    <div className="bg-[var(--bg-primary)] min-h-screen text-[var(--text-primary)] transition-colors overflow-x-hidden">
      <main className="overflow-x-hidden">
        {/* 1. HERO SECTION: BÌA TẠP CHÍ THỰC VẬT HỌC & TRẠNG THÁI MỞ CỬA REAL-TIME */}
        <EditorialHero />

        {/* 2. SPATIAL SCROLLYTELLING: HÀNH TRÌNH 30 BỨC ẢNH KHÔNG GIAN BÊN SUỐI QUA 4 CHƯƠNG */}
        <SpatialScrollytellingSection />

        {/* 3. EDITORIAL BOTANICAL MENU: THỰC ĐƠN THUẦN CHỮ 7 NHÓM (~67 MÓN/BIẾN THỂ) */}
        <EditorialMenuSection
          selectedPreOrderItems={preOrderItems}
          onSelectPreOrderItems={setPreOrderItems}
        />

        {/* 4. SOCIAL PROOF: 100% ĐỀ XUẤT TỪ 8 LƯỢT ĐÁNH GIÁ THỰC TẾ */}
        <CustomerReviewsSection />

        {/* 5. LOCATION & CONNECT: ĐỊA CHỈ, TỌA ĐỘ, SỐ HOTLINE KÉP, GOOGLE MAPS & ĐA KÊNH */}
        <ContactSection />
      </main>

      <Footer />

      {/* Global Reservation & Pre-order Assistant Modal */}
      <ReservationModal
        isOpen={reservationModalOpen}
        onClose={() => setReservationModalOpen(false)}
        preOrderItems={preOrderItems}
      />
    </div>
  );
}
