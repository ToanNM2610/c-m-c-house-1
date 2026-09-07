"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function BodyCursorController() {
  const pathname = usePathname() || "";
  const isAdmin = pathname.startsWith("/admin") || pathname.startsWith("/wp-admin");

  useEffect(() => {
    if (isAdmin) {
      // Khu vực Admin: Trả lại con trỏ chuột mặc định của hệ điều hành
      document.body.classList.remove("cursor-none");
      document.documentElement.classList.remove("cursor-none");
      document.body.style.cursor = "auto";
    } else {
      // Khu vực Front-end: Ẩn con trỏ mặc định trên máy tính (nếu có chuột) để dùng Custom Cursor
      document.body.style.cursor = "";
      const isMobileOrTouch =
        window.innerWidth < 768 ||
        window.matchMedia("(pointer: coarse)").matches ||
        "ontouchstart" in window ||
        (navigator.maxTouchPoints && navigator.maxTouchPoints > 0);

      if (!isMobileOrTouch) {
        document.body.classList.add("cursor-none");
      } else {
        document.body.classList.remove("cursor-none");
      }
    }

    return () => {
      document.body.classList.remove("cursor-none");
      document.body.style.cursor = "";
    };
  }, [pathname, isAdmin]);

  return null;
}
