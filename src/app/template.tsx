'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || '/';

  useEffect(() => {
    // Scroll to top instantly on route change (both native + Lenis)
    window.scrollTo({ top: 0, behavior: 'instant' });
    if ((window as any).__lenis) {
      (window as any).__lenis.scrollTo(0, { immediate: true });
    }
  }, [pathname]);

  // Template only handles scroll reset. 
  // All animations are handled by PageTransitionProvider to avoid double-fade.
  return <>{children}</>;
}
