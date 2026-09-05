"use client";

import { useEffect } from "react";

export default function SecurityShield({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Hàm gửi cảnh báo qua API với cooldown 10 phút
    const sendSecurityAlert = () => {
      const COOLDOWN_TIME = 10 * 60 * 1000; // 10 minutes in ms
      const lastAlertTime = localStorage.getItem("lastSecurityAlertTime");
      const now = Date.now();

      if (!lastAlertTime || now - parseInt(lastAlertTime, 10) > COOLDOWN_TIME) {
        localStorage.setItem("lastSecurityAlertTime", now.toString());
        fetch("/api/security-alert", { method: "POST" }).catch((err) => {
          // Silent error to prevent console spam
        });
      }
    };

    // 1. In ra lời cảnh báo nghệ thuật
    const logWarning = () => {
      console.clear();
      console.log(
        "%c⚠️ CẨM CÙ HOUSE - KHU VỰC HẠN CHẾ",
        "color: #C5A880; font-size: 24px; font-weight: bold; background: #1A0F0A; padding: 10px 20px; border-radius: 8px; border: 2px solid #C5A880;"
      );
      console.log(
        "%cVui lòng không can thiệp vào mã nguồn 3D của chúng tôi.",
        "color: #F3E8DB; font-size: 16px; background: #1A0F0A; padding: 10px 20px; border-radius: 8px;"
      );
    };

    // Hàm xử lý chung khi phát hiện vi phạm
    const handleViolation = () => {
      logWarning();
      sendSecurityAlert();
    };

    // Gọi lần đầu
    if (typeof window !== "undefined") {
      logWarning();
    }

    // 2. Chặn các phím tắt DevTools
    const handleKeyDown = (e: KeyboardEvent) => {
      // F12
      if (e.key === "F12" || e.keyCode === 123) {
        e.preventDefault();
        handleViolation();
      }
      // Ctrl+Shift+I / J / C
      if (
        e.ctrlKey &&
        e.shiftKey &&
        (e.key === "I" || e.key === "i" || e.key === "J" || e.key === "j" || e.key === "C" || e.key === "c")
      ) {
        e.preventDefault();
        handleViolation();
      }
      // Ctrl+U (View Source)
      if (e.ctrlKey && (e.key === "U" || e.key === "u")) {
        e.preventDefault();
        handleViolation();
      }
    };

    // 3. Chặn chuột phải (Context Menu)
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      handleViolation();
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("contextmenu", handleContextMenu);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("contextmenu", handleContextMenu);
    };
  }, []);

  return <>{children}</>;
}
