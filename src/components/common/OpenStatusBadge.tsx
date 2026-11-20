'use client';

import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { useApp } from '@/context/AppContext';

interface StatusState {
  isOpen: boolean;
  closingTime: string;
}

export default function OpenStatusBadge() {
  const { language } = useApp();
  const [mounted, setMounted] = useState(false);
  const [status, setStatus] = useState<StatusState>({
    isOpen: true,
    closingTime: '18:00',
  });

  useEffect(() => {
    setMounted(true);
    const computeStatus = () => {
      const now = new Date();
      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Asia/Ho_Chi_Minh',
        weekday: 'short',
        hour: 'numeric',
        minute: 'numeric',
        hour12: false,
      });
      const parts = formatter.formatToParts(now);
      const weekdayPart = parts.find((p) => p.type === 'weekday')?.value || '';
      const hourPart = Number(parts.find((p) => p.type === 'hour')?.value || 0);
      const minutePart = Number(parts.find((p) => p.type === 'minute')?.value || 0);

      const isWeekend = weekdayPart === 'Fri' || weekdayPart === 'Sat' || weekdayPart === 'Sun';
      const currentMinutes = hourPart * 60 + minutePart;

      const openMinutes = 7 * 60; // 07:00
      const closeMinutes = isWeekend ? 22 * 60 : 18 * 60; // 22:00 or 18:00
      const closeTimeStr = isWeekend ? '22:00' : '18:00';

      const isOpen = currentMinutes >= openMinutes && currentMinutes < closeMinutes;

      setStatus({
        isOpen,
        closingTime: closeTimeStr,
      });
    };

    computeStatus();
    const timer = setInterval(computeStatus, 15000); // Check every 15 seconds
    return () => clearInterval(timer);
  }, []);

  if (!mounted) {
    return (
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono tracking-wide border shadow-subtle bg-emerald-50/90 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-700/60 text-emerald-900 dark:text-emerald-200">
        <Clock className="w-3.5 h-3.5 opacity-70" />
        <span className="font-medium">
          {language === 'en' ? 'Checking operating hours...' : 'Đang kiểm tra giờ mở cửa...'}
        </span>
      </div>
    );
  }

  const message = status.isOpen
    ? language === 'en'
      ? `Open for fresh streamside breezes • Closes at ${status.closingTime}`
      : `Đang mở cửa đón gió bên suối • Đóng cửa lúc ${status.closingTime}`
    : language === 'en'
      ? 'See you tomorrow morning at 07:00 by the stream'
      : 'Hẹn gặp lại bạn lúc 07:00 sáng mai bên bờ suối';

  return (
    <div
      className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono tracking-wide border shadow-subtle transition-colors ${
        status.isOpen
          ? 'bg-emerald-50 dark:bg-emerald-950 border-emerald-300 dark:border-emerald-700 text-emerald-900 dark:text-emerald-200'
          : 'bg-amber-50 dark:bg-amber-950 border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-200'
      }`}
    >
      <span className="relative flex h-2 w-2">
        <span
          className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
            status.isOpen ? 'bg-emerald-500' : 'bg-amber-500'
          }`}
        />
        <span
          className={`relative inline-flex rounded-full h-2 w-2 ${
            status.isOpen ? 'bg-emerald-600' : 'bg-amber-600'
          }`}
        />
      </span>
      <Clock className="w-3.5 h-3.5 opacity-70" />
      <span className="font-medium">{message}</span>
    </div>
  );
}
