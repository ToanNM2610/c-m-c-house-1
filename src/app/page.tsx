"use client";

import EditorialHero from "@/components/home/EditorialHero";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <div className="bg-[var(--bg-primary)] min-h-screen text-[var(--text-primary)] transition-colors overflow-x-hidden flex flex-col justify-between">
      <main className="w-full flex-1">
        {/* DUY NHẤT TRANG [01] TRANG CHỦ: HERO MAGAZINE COVER + STATUS BADGE + 3 TIỆN ÍCH + CÁC THẺ DẪN SANG [02]-[05] */}
        <EditorialHero />
      </main>

      <Footer />
    </div>
  );
}
