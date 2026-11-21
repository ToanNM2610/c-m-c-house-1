'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { MessageCircle, Phone, X, ExternalLink, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '@/context/AppContext';

export default function QuickChatWidget() {
  const pathname = usePathname();
  const { data, language } = useApp();
  const s = data.settings;
  const isEn = language === 'en';

  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent SSR render leak on admin subdomain / admin console
  if (!mounted) {
    return null;
  }

  const isClientAdmin =
    typeof window !== 'undefined' &&
    (window.location.hostname.startsWith('admin.') ||
      window.location.hostname === 'admin.camcuhouse.online' ||
      window.location.host.startsWith('admin.') ||
      window.location.pathname.startsWith('/admin'));

  // Strictly enforce BOTH checks:
  // 1. pathname?.startsWith('/admin')
  // 2. window.location.hostname.startsWith('admin.')
  // 3. Or CMS disabled
  if (
    pathname?.startsWith('/admin') ||
    isClientAdmin ||
    s.enableQuickChat === false
  ) {
    return null;
  }

  const phone = s.quickChatPhone || '0382851688';
  const zalo = s.zaloUrl || `https://zalo.me/${phone}`;
  const messenger = s.messengerUrl || 'https://m.me/camcuhousedaknong';

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
      {/* Expanded Quick Contact Menu - 100% Solid Non-Transparent Surface */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.88, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.88, y: 16 }}
            transition={{ duration: 0.22 }}
            className="mb-3 w-64 bg-white dark:bg-forest-900 rounded-3xl border border-forest-200 dark:border-forest-700 shadow-2xl p-4 space-y-3"
          >
            <div className="flex items-center justify-between pb-2 border-b border-forest-100 dark:border-forest-800">
              <span className="font-serif font-bold text-sm text-ink-primary flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-accent-botanical" />
                <span>{isEn ? 'Direct Sanctuary Support' : 'Hỗ Trợ Nhanh Bên Suối'}</span>
              </span>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 text-ink-muted hover:text-ink-primary rounded-full hover:bg-forest-50 dark:hover:bg-forest-800"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <p className="text-[11px] text-ink-muted leading-relaxed">
              {isEn
                ? 'Chat directly with our team or call hotlines for directions and takeaway orders.'
                : 'Nhắn tin trực tiếp cùng quán hoặc gọi hotline để được chỉ đường và đặt mang về.'}
            </p>

            <div className="space-y-2 text-xs font-mono">
              {/* Zalo */}
              <a
                href={zalo}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 hover:bg-blue-100 transition-colors border border-blue-200 dark:border-blue-900"
              >
                <span className="font-bold">Zalo Chat ({phone})</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              {/* Messenger */}
              <a
                href={messenger}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-2.5 rounded-xl bg-sky-50 dark:bg-sky-950 text-sky-700 dark:text-sky-300 hover:bg-sky-100 transition-colors border border-sky-200 dark:border-sky-900"
              >
                <span className="font-bold">Messenger (Facebook)</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              {/* Direct Hotline */}
              <a
                href={`tel:${phone}`}
                className="flex items-center justify-between p-2.5 rounded-xl bg-forest-50 dark:bg-forest-800 text-accent-botanical hover:bg-forest-100 transition-colors border border-forest-200 dark:border-forest-700 font-bold"
              >
                <span className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5" />
                  <span>0382 851 688</span>
                </span>
                <span className="text-[10px] uppercase font-semibold">Gọi ngay</span>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle Quick Chat Widget"
        className="w-14 h-14 rounded-full bg-accent-botanical hover:bg-forest-800 text-white shadow-xl flex items-center justify-center transition-transform hover:scale-105 active:scale-95 group relative"
      >
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-white animate-pulse" />
        {isOpen ? (
          <X className="w-6 h-6 transition-transform group-hover:rotate-90 duration-200" />
        ) : (
          <MessageCircle className="w-6 h-6" />
        )}
      </button>
    </div>
  );
}
