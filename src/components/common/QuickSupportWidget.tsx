'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, MessageCircle, X, ExternalLink, Headphones, Sparkles } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function QuickSupportWidget() {
  const pathname = usePathname();
  const { data, language } = useApp();
  const s = data.settings;
  const isEn = language === 'en';

  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isClientAdmin =
    typeof window !== 'undefined' &&
    (window.location.hostname.startsWith('admin.') ||
      window.location.hostname === 'admin.camcuhouse.online' ||
      window.location.host.startsWith('admin.') ||
      window.location.pathname.startsWith('/admin'));

  const phone = s.quickChatPhone || '0382851688';
  const zalo = s.zaloUrl || `https://zalo.me/${phone}`;
  const messenger = s.messengerUrl || 'https://m.me/camcuhousedaknong';
  const whatsapp = s.whatsappUrl || `https://wa.me/84382851688`;

  const cs = data.commerceSettings;
  const isWidgetEnabled = (cs?.enableQuickSupportWidget !== false) && (s.enableQuickChat !== false);

  if (pathname?.startsWith('/admin') || isClientAdmin || !isWidgetEnabled) {
    return null;
  }

  const showHotline = cs?.enableSupportHotline !== false && Boolean(phone);
  const showZalo = cs?.enableSupportZalo !== false && Boolean(zalo);
  const showMessenger = cs?.enableSupportMessenger !== false && Boolean(messenger);
  const showWhatsApp = cs?.enableSupportWhatsApp !== false && Boolean(whatsapp);

  if (!showHotline && !showZalo && !showMessenger && !showWhatsApp) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
      {/* Expanded Speed-Dial Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 16 }}
            transition={{ duration: 0.2 }}
            className="mb-3 w-64 bg-white dark:bg-forest-900 rounded-3xl border border-forest-200 dark:border-forest-700 shadow-2xl p-4 space-y-3"
          >
            <div className="flex items-center justify-between pb-2 border-b border-forest-100 dark:border-forest-800">
              <span className="font-serif font-bold text-sm text-ink-primary flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-accent-botanical" />
                <span>{isEn ? 'Streamside Support' : 'Hỗ Trợ Nhanh Bên Suối'}</span>
              </span>
              <button
                onClick={() => setIsOpen(false)}
                aria-label="Đóng bảng hỗ trợ"
                className="p-1 text-ink-muted hover:text-ink-primary rounded-full hover:bg-forest-50 dark:hover:bg-forest-800"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <p className="text-[11px] text-ink-muted leading-relaxed font-sans">
              {isEn
                ? 'Directly reach our sanctuary baristas for order assistance, BBQ booking, or directions.'
                : 'Kết nối nhanh với quán để được hướng dẫn đặt món, đặt tiệc BBQ bờ suối hoặc chỉ đường.'}
            </p>

            <div className="space-y-2.5 text-sm font-sans font-medium">
              {/* Hotline */}
              {showHotline && (
                <a
                  href={`tel:${phone}`}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-forest-50 dark:bg-forest-800 text-accent-botanical dark:text-emerald-300 hover:bg-forest-100 transition-colors border border-forest-200 dark:border-forest-700"
                >
                  <span className="font-bold flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5" />
                    <span>Hotline ({phone})</span>
                  </span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}

              {/* Zalo */}
              {showZalo && (
                <a
                  href={zalo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 hover:bg-blue-100 transition-colors border border-blue-200 dark:border-blue-900"
                >
                  <span className="font-bold flex items-center gap-2">
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Zalo Chat ({phone})</span>
                  </span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}

              {/* Messenger */}
              {showMessenger && (
                <a
                  href={messenger}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-2.5 rounded-xl bg-sky-50 dark:bg-sky-950 text-sky-700 dark:text-sky-300 hover:bg-sky-100 transition-colors border border-sky-200 dark:border-sky-900"
                >
                  <span className="font-bold flex items-center gap-2">
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Facebook Messenger</span>
                  </span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}

              {/* WhatsApp */}
              {showWhatsApp && (
                <a
                  href={whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 transition-colors border border-emerald-200 dark:border-emerald-900"
                >
                  <span className="font-bold flex items-center gap-2">
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Trigger Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Mở kênh hỗ trợ"
        className="w-13 h-13 p-3.5 rounded-full bg-accent-botanical text-white shadow-xl flex items-center justify-center hover:bg-forest-800 transition-colors focus:outline-none focus:ring-4 focus:ring-accent-botanical/30"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Headphones className="w-6 h-6" />}
      </motion.button>
    </div>
  );
}

