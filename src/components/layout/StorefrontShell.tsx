'use client';

import React, { Suspense } from 'react';
import { usePathname } from 'next/navigation';
import Navbar from '@/components/common/Navbar';
import CinematicIntro8K from '@/components/motion/CinematicIntro8K';
import GalleryLightboxModal from '@/components/modals/GalleryLightboxModal';
import QuickChatWidget from '@/components/common/QuickChatWidget';

/**
 * StorefrontShell
 * Strictly isolates storefront interactive elements from the /admin management console.
 * When on any /admin route, it renders ONLY children with zero storefront overhead.
 */
export default function StorefrontShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      {/* 120Hz/120fps 8K Cinematic Intro Preloader Overlay (Storefront Home Only) */}
      <Suspense fallback={null}>
        <CinematicIntro8K />
      </Suspense>
      <Navbar />
      {children}
      {/* Global Interactive Modals & Quick Chat */}
      <GalleryLightboxModal />
      <QuickChatWidget />
    </>
  );
}
