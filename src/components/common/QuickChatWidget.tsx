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

  // Strictly enforce:
  // 1. Never rendered on admin.* or /admin
  // 2. Renders ONLY if SiteSettings.enableSupportWidget === true (or enableQuickChat === true)
  const isWidgetEnabled = s.enableSupportWidget !== false && s.enableQuickChat !== false;

  if (
    pathname?.startsWith('/admin') ||
    isClientAdmin ||
    !isWidgetEnabled
  ) {
    return null;
  }

  const hotlineNum = s.hotlineNumber || s.quickChatPhone || '0382851688';
  const showHotline = (s.enableHotline !== false) && Boolean(hotlineNum);

  const zaloUrl = s.zaloUrl || (hotlineNum ? `https://zalo.me/${hotlineNum}` : '');
  const showZalo = (s.enableZalo !== false) && Boolean(zaloUrl);

  const messengerUrl = s.messengerUrl || 'https://m.me/camcuhousedaknong';
  const showMessenger = (s.enableMessenger !== false) && Boolean(messengerUrl);

  const whatsappUrl = s.whatsappUrl || 'https://wa.me/84382851688';
  const showWhatsApp = (s.enableWhatsApp !== false) && Boolean(whatsappUrl);

  // If all channels are disabled or empty, do not render widget
  if (!showHotline && !showZalo && !showMessenger && !showWhatsApp) {
    return null;
  }

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

            <div className="space-y-2.5 text-sm font-sans font-medium">
              {/* Zalo */}
              {showZalo && (
                <a
                  href={zaloUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 hover:bg-blue-100 transition-colors border border-blue-200 dark:border-blue-900 font-semibold"
                >
                  <span>Zalo Chat ({hotlineNum})</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}

              {/* Messenger */}
              {showMessenger && (
                <a
                  href={messengerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-2.5 rounded-xl bg-sky-50 dark:bg-sky-950 text-sky-700 dark:text-sky-300 hover:bg-sky-100 transition-colors border border-sky-200 dark:border-sky-900 font-semibold"
                >
                  <span>Messenger (Facebook)</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}

              {/* WhatsApp (International) */}
              {showWhatsApp && (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 transition-colors border border-emerald-200 dark:border-emerald-900 font-semibold"
                >
                  <span>WhatsApp (+84 382 851 688)</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}

              {/* Direct Hotline */}
              {showHotline && (
                <a
                  href={`tel:${hotlineNum.startsWith('0') ? '+84' + hotlineNum.slice(1) : hotlineNum}`}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-forest-50 dark:bg-forest-800 text-accent-botanical hover:bg-forest-100 transition-colors border border-forest-200 dark:border-forest-700 font-semibold"
                >
                  <span className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5" />
                    <span>{isEn ? (hotlineNum.startsWith('0') ? '+84 ' + hotlineNum.slice(1) : hotlineNum) : hotlineNum}</span>
                  </span>
                  <span className="text-xs uppercase font-semibold">
                    {isEn ? 'Call Now' : 'Gọi ngay'}
                  </span>
                </a>
              )}
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
