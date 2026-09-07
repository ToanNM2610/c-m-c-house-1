"use client";

import { usePathname } from "next/navigation";

export default function ThemeEffects() {
  const pathname = usePathname();

  // Tắt hoàn toàn hiệu ứng ở trang admin
  if (pathname && (pathname.startsWith("/admin") || pathname.startsWith("/wp-admin"))) {
    return null;
  }

  return (
    <>
      <div className="ambient-bg">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <div className="orb orb-3"></div>
      </div>
      <div className="grain-overlay shadow-[inset_0_0_100px_rgba(0,0,0,0.5)]"></div>
      <div className="cinematic-vignette"></div>
    </>
  );
}
