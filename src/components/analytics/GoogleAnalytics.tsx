'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

interface GoogleAnalyticsProps {
  gaId?: string;
  gtmId?: string;
}

export default function GoogleAnalytics({ gaId, gtmId }: GoogleAnalyticsProps) {
  const pathname = usePathname();
  const [hasConsent, setHasConsent] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Không kích hoạt ở /admin hoặc admin subdomain
    if (
      window.location.pathname.startsWith('/admin') ||
      window.location.hostname.startsWith('admin.')
    ) {
      return;
    }

    const checkConsent = () => {
      const consent = localStorage.getItem('camcu_cookie_consent');
      if (consent === 'granted') {
        setHasConsent(true);
      }
    };

    checkConsent();

    const handleConsentUpdate = () => checkConsent();
    window.addEventListener('camcu_cookie_consent_updated', handleConsentUpdate);
    return () => {
      window.removeEventListener('camcu_cookie_consent_updated', handleConsentUpdate);
    };
  }, []);

  // Gửi config / page_view khi route chuyển đổi
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.location.pathname.startsWith('/admin') || window.location.hostname.startsWith('admin.')) return;

    const targetId = gaId || gtmId;
    if (typeof (window as any).gtag === 'function') {
      if (targetId && targetId !== 'GTM-M78P32L4') {
        (window as any).gtag('config', targetId, {
          page_path: pathname,
          page_location: window.location.href,
          page_title: document.title,
          send_page_view: true,
        });
      } else {
        (window as any).gtag('event', 'page_view', {
          page_path: pathname,
          page_location: window.location.href,
          page_title: document.title,
        });
      }
    }
  }, [pathname, hasConsent, gaId, gtmId]);

  // Không tạo thêm thẻ <Script src="https://www.googletagmanager.com/...">
  // Thẻ chính đã được chèn SSR an toàn tại <head> của storefront trong src/app/layout.tsx
  return null;
}
