'use client';

import React from 'react';
import MenuSection from '@/components/home/MenuSection';
import FooterSection from '@/components/home/FooterSection';

export default function ThucDonPage() {
  return (
    <main className="min-h-screen pt-[72px] bg-paper text-ink-primary">
      <div className="py-6 sm:py-8">
        <MenuSection />
      </div>
      <FooterSection />
    </main>
  );
}

