"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { usePathname } from "next/navigation";

interface GoogleAnalyticsProps {
  gaId: string;
}

export default function GoogleAnalytics({ gaId }: GoogleAnalyticsProps) {
  const pathname = usePathname();
  const [hasConsent, setHasConsent] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Không chèn ở /admin
    if (window.location.pathname.startsWith("/admin")) {
      return;
    }

    // Kiểm tra đồng ý cookie
    const checkConsent = () => {
      const consent = localStorage.getItem("camcu_cookie_consent");
      if (consent === "granted") {
        setHasConsent(true);
      }
    };

    checkConsent();

    // Lắng nghe sự kiện người dùng bấm Đồng ý cookie tức thì
    const handleConsentUpdate = () => checkConsent();
    window.addEventListener("camcu_cookie_consent_updated", handleConsentUpdate);
    return () => {
      window.removeEventListener("camcu_cookie_consent_updated", handleConsentUpdate);
    };
  }, []);

  // Gửi page_view mỗi khi chuyển route (sau khi đã có sự đồng ý)
  useEffect(() => {
    if (!hasConsent || !gaId || typeof window === "undefined") return;

    if (window.location.pathname.startsWith("/admin")) return;

    if (typeof (window as any).gtag === "function") {
      (window as any).gtag("event", "page_view", {
        page_path: pathname,
        page_location: window.location.href,
        page_title: document.title,
      });
    }
  }, [pathname, hasConsent, gaId]);

  // Nếu chưa có consent hoặc đang ở trang Admin hoặc không có GA ID: không tải gtag
  if (!hasConsent || !gaId) {
    return null;
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}', {
            page_path: window.location.pathname,
            send_page_view: true
          });
        `}
      </Script>
    </>
  );
}
