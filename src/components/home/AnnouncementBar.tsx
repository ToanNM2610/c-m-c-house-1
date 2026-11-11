"use client";

import React from "react";
import { useAnnouncements } from "@/lib/cmsStore";
import { Radio, Sparkles, Bell } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function AnnouncementBar() {
  const announcements = useAnnouncements();
  const { locale } = useLanguage();
  const isVi = locale !== "en";

  if (!announcements || announcements.length === 0) return null;

  // Prefer pinned/highlighted announcement or the most recent one
  const activeNotice = announcements.find((a) => a.isPinned || a.isHighlighted) || announcements[0];
  if (!activeNotice) return null;

  const categoryLabel =
    activeNotice.type === "event" || activeNotice.category === "event"
      ? isVi ? "SỰ KIỆN QUÁN" : "SANCTUARY EVENT"
      : activeNotice.type === "special" || activeNotice.category === "special"
      ? isVi ? "MÓN ĐẶC SẢN" : "SEASONAL SPECIAL"
      : isVi ? "BẢNG TIN QUÁN" : "ANNOUNCEMENT";

  return (
    <div className="w-full bg-[#18261E] border-b border-[#2A4433] text-[#F3F1EC] py-2.5 px-4 transition-all animate-fadeIn">
      <div className="max-w-[1400px] mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E86C3A] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#E86C3A]" />
          </span>

          <span className="px-2 py-0.5 rounded-full bg-[#E86C3A]/20 text-[#E86C3A] font-bold text-[10px] uppercase tracking-wider shrink-0 border border-[#E86C3A]/40">
            {categoryLabel}
          </span>

          <span className="font-bold text-[#F3F1EC] truncate">
            {activeNotice.title}
          </span>

          {activeNotice.content && (
            <span className="hidden md:inline text-white/70 truncate border-l border-white/20 pl-2">
              {activeNotice.content}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 text-white/50 text-[11px] shrink-0 self-end sm:self-auto">
          <span>{activeNotice.date || activeNotice.createdAt || (isVi ? "Hôm nay" : "Today")}</span>
        </div>
      </div>
    </div>
  );
}
