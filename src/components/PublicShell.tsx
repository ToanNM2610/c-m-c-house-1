"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState, ReactNode } from "react";
import Navbar from "@/components/Navbar";
import MobileBottomBar from "@/components/MobileBottomBar";
import CamcuIntro from "@/components/CamcuIntro";
import SmoothScroll from "@/components/motion/SmoothScroll";
import ScrollProgressBar from "@/components/ui/ScrollProgressBar";
import CustomCursor from "@/components/ui/CustomCursor";
import ScrollIndicator from "@/components/ui/ScrollIndicator";
import CookieConsent from "@/components/ui/CookieConsent";

export default function PublicShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const isAdm =
      Boolean(pathname?.startsWith("/admin")) ||
      (typeof window !== "undefined" && window.location.hostname.startsWith("admin."));
    setIsAdmin(isAdm);
  }, [pathname]);

  // Nếu đang ở trang quản trị Admin -> Tách biệt hoàn toàn, không render header/intro/footer công khai
  if (isAdmin || pathname?.startsWith("/admin")) {
    return <main className="min-h-screen w-full bg-[var(--bg)] text-[var(--text)]">{children}</main>;
  }

  return (
    <>
      <ScrollProgressBar />
      <CustomCursor />
      <ScrollIndicator />
      <CamcuIntro />
      <Navbar />
      <SmoothScroll>
        {children}
      </SmoothScroll>
      <MobileBottomBar />
      <CookieConsent />
    </>
  );
}
