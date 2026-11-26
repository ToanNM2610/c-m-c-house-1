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

  const hotline1 = s.hotlineNumber || s.quickChatPhone || '0382851688';
  const hotline2 = '0774659000';
  const zaloUrl = s.zaloUrl || (hotline1 ? `https://zalo.me/${hotline1}` : 'https://zalo.me/0382851688');
  const messengerUrl = s.messengerUrl || '';
  const whatsappUrl = s.whatsappUrl || '';
  const mapsUrl = s.links?.googleMaps || 'https://maps.app.goo.gl/G6aP51qJ6aDabp676';

  const isWidgetEnabled =
    (s.enableSupportWidget !== false) &&
    (s.enableQuickChat !== false);

  if (pathname?.startsWith('/admin') || isClientAdmin || !isWidgetEnabled) {
    return null;
  }

  const showHotline = (s.enableHotline !== false) && Boolean(hotline1);
  const showZalo = (s.enableZalo !== false) && Boolean(zaloUrl);
  // Strictly gated behind explicit === true (defaults false in Stage 1 Showcase Mode)
  const showMessenger = s.enableMessenger === true && Boolean(messengerUrl);
  const showWhatsApp = s.enableWhatsApp === true && Boolean(whatsappUrl);

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
            className="mb-3 w-72 bg-white dark:bg-forest-900 rounded-3xl border border-forest-200 dark:border-forest-700 shadow-2xl p-4 space-y-3"
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
                ? 'Connect directly with our sanctuary baristas for directions, drink inquiries, or visit assistance.'
                : 'Kết nối nhanh với quán để được hỗ trợ thông tin, hướng dẫn đường đi hoặc liên hệ trực tiếp.'}
            </p>

            <div className="space-y-2 text-xs font-sans font-medium">
              {/* Hotline 1 */}
              {showHotline && (
                <a
                  href={`tel:${hotline1}`}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-forest-50 dark:bg-forest-800 text-accent-botanical dark:text-emerald-300 hover:bg-forest-100 transition-colors border border-forest-200 dark:border-forest-700 font-semibold"
                >
                  <span className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5" />
                    <span>Hotline ({hotline1 === '0382851688' ? '038 285 1688' : hotline1})</span>
                  </span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}

              {/* Hotline 2 */}
              <a
                href={`tel:${hotline2}`}
                className="flex items-center justify-between p-2.5 rounded-xl bg-forest-50/80 dark:bg-forest-800/80 text-accent-botanical dark:text-emerald-300 hover:bg-forest-100 transition-colors border border-forest-200 dark:border-forest-700 font-semibold"
              >
                <span className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5" />
                  <span>Hotline (077 465 9000)</span>
                </span>
                <ExternalLink className="w-3 h-3" />
              </a>

              {/* Zalo */}
              {showZalo && (
                <a
                  href={zaloUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 hover:bg-blue-100 transition-colors border border-blue-200 dark:border-blue-900 font-semibold"
                >
                  <span className="flex items-center gap-2">
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Zalo Chat (038 285 1688)</span>
                  </span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}

              {/* Facebook Messenger (Only rendered when Admin explicitly enables enableMessenger) */}
              {showMessenger && (
                <a
                  href={messengerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-2.5 rounded-xl bg-sky-50 dark:bg-sky-950 text-sky-700 dark:text-sky-300 hover:bg-sky-100 transition-colors border border-sky-200 dark:border-sky-900 font-semibold"
                >
                  <span className="flex items-center gap-2">
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Facebook Messenger</span>
                  </span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}

              {/* WhatsApp (Only rendered when Admin explicitly enables enableWhatsApp) */}
              {showWhatsApp && (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 transition-colors border border-emerald-200 dark:border-emerald-900 font-semibold"
                >
                  <span className="flex items-center gap-2">
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp (+84 382 851 688)</span>
                  </span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}

              {/* Google Maps Chỉ Đường */}
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-800 dark:text-amber-200 hover:bg-amber-100 transition-colors border border-amber-200 dark:border-amber-900 font-semibold"
              >
                <span className="flex items-center gap-2">
                  <ExternalLink className="w-3.5 h-3.5 text-accent-botanical" />
                  <span>{isEn ? 'Google Maps Directions' : 'Chỉ Đường Google Maps'}</span>
                </span>
                <ExternalLink className="w-3 h-3" />
              </a>
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

