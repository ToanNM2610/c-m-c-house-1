'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Navbar from '@/components/common/Navbar';
import CinematicIntro8K from '@/components/motion/CinematicIntro8K';
import GalleryLightboxModal from '@/components/modals/GalleryLightboxModal';
import QuickChatWidget from '@/components/common/QuickChatWidget';
import MobileBottomBar from '@/components/MobileBottomBar';

/**
 * StorefrontShell
 * Strictly isolates storefront interactive elements from the /admin management console
 * and admin.camcuhouse.online subdomain.
 */
export default function StorefrontShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isAdminHost, setIsAdminHost] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return (
        window.location.hostname.startsWith('admin.') ||
        window.location.hostname === 'admin.camcuhouse.online' ||
        window.location.host.startsWith('admin.') ||
        window.location.pathname.startsWith('/admin')
      );
    }
    return false;
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isAdm =
        window.location.hostname.startsWith('admin.') ||
        window.location.hostname === 'admin.camcuhouse.online' ||
        window.location.host.startsWith('admin.') ||
        window.location.pathname.startsWith('/admin') ||
        pathname?.startsWith('/admin');
      setIsAdminHost(Boolean(isAdm));
    }
  }, [pathname]);

  const isAdmin =
    pathname?.startsWith('/admin') ||
    isAdminHost ||
    (typeof window !== 'undefined' &&
      (window.location.hostname.startsWith('admin.') ||
        window.location.hostname === 'admin.camcuhouse.online' ||
        window.location.pathname.startsWith('/admin')));

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
      <MobileBottomBar />
    </>
  );
}
