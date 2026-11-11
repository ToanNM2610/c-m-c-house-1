"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import { useStoreStatus } from "@/lib/openingHours";

interface OpenStatusBadgeProps {
  className?: string;
  showDetails?: boolean;
}

export default function OpenStatusBadge({ className = "", showDetails = true }: OpenStatusBadgeProps) {
  const { locale } = useLanguage();
  const isVi = locale !== "en";
  const storeStatus = useStoreStatus();
  const { isOpen, closingTime } = storeStatus;

  return (
    <div
      className={`inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border text-[13px] font-mono transition-colors ${
        isOpen
          ? "bg-[#1E4D32]/10 border-[#1E4D32]/30 text-[#1E4D32] dark:bg-[#7FD19E]/10 dark:border-[#7FD19E]/30 dark:text-[#7FD19E]"
          : "bg-[#8A3C19]/10 border-[#8A3C19]/30 text-[#8A3C19] dark:bg-[#F0B27A]/10 dark:border-[#F0B27A]/30 dark:text-[#F0B27A]"
      } ${className}`}
      role="status"
      aria-live="polite"
    >
      <span className="relative flex h-2.5 w-2.5">
        {isOpen && (
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
        )}
        <span
          className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
            isOpen ? "bg-emerald-500" : "bg-amber-600"
          }`}
        />
      </span>

      <span className="font-medium whitespace-nowrap">
        {isOpen ? (
          isVi ? (
            <>
              Đang mở cửa đón gió bên suối
              {showDetails && ` • Đóng cửa lúc ${closingTime}`}
            </>
          ) : (
            <>
              Open now by the stream
              {showDetails && ` • Closes at ${closingTime}`}
            </>
          )
        ) : isVi ? (
          <>
            Đã đóng cửa • Mở cửa lại lúc 07:00 sáng
          </>
        ) : (
          <>
            Closed • Reopens at 07:00 AM
          </>
        )}
      </span>
    </div>
  );
}

