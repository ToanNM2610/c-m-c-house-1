'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Phone, Sun, Moon, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { useApp } from '@/context/AppContext';
import { SPRING_PILL_TRANSITION } from '@/components/motion/EditorialMotion';
import GlobalSearchModal from '@/components/common/GlobalSearchModal';

export default function Navbar() {
  const pathname = usePathname();
  const { language, setLanguage, theme, toggleTheme } = useApp();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const [isAdminHost, setIsAdminHost] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isAdm =
        window.location.hostname.startsWith('admin.') ||
        window.location.hostname === 'admin.camcuhouse.online' ||
        window.location.host.startsWith('admin.');
      if (isAdm) {
        setIsAdminHost(true);
      }
    }
  }, []);

  // Do not render customer navbar inside admin console or on admin subdomain
  if (pathname?.startsWith('/admin') || isAdminHost) {
    return null;
  }

  const navLinks = language === 'en' ? [
    { label: 'Home', href: '/' },
    { label: 'About Us', href: '/gioi-thieu' },
    { label: 'Sanctuary', href: '/khong-gian' },
    { label: 'Menu', href: '/thuc-don' },
    { label: 'Reviews', href: '/khach-hang' },
    { label: 'News & FAQ', href: '/su-kien' },
    { label: 'Contact', href: '/lien-he' },
  ] : [
    { label: 'Trang chủ', href: '/' },
    { label: 'Giới thiệu', href: '/gioi-thieu' },
    { label: 'Không gian', href: '/khong-gian' },
    { label: 'Thực đơn', href: '/thuc-don' },
    { label: 'Khách hàng', href: '/khach-hang' },
    { label: 'Tin tức & FAQ', href: '/su-kien' },
    { label: 'Liên hệ', href: '/lien-he' },
  ];

  const isActiveLink = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname === href || pathname?.startsWith(href + '/');
  };

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-40 transition-colors duration-200 h-[72px] flex items-center bg-paper border-b border-forest-200 dark:border-forest-700 shadow-subtle"
      >
        <div className="w-full max-w-7xl mx-auto px-4 lg:px-8 h-[72px] flex items-center justify-between gap-6">
          {/* Zone 1: Brand Logo (Left, shrink-0 whitespace-nowrap) */}
          <Link href="/" prefetch={true} className="flex items-center gap-2 group shrink-0 whitespace-nowrap mr-4">
            <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-ink-primary whitespace-nowrap">
              CẨM CÙ <span className="font-normal italic text-accent-botanical">HOUSE</span>
            </span>
          </Link>

          {/* Zone 2: Navigation Links (Center, hidden xl:flex, whitespace-nowrap) */}
          <nav className="hidden xl:flex items-center gap-3.5 xl:gap-4 2xl:gap-5 text-[12px] xl:text-[13px] font-mono uppercase tracking-wider shrink-0 whitespace-nowrap">
            {navLinks.map((link) => {
              const active = isActiveLink(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  prefetch={true}
                  className={`py-1 transition-colors relative whitespace-nowrap shrink-0 ${
                    active
                      ? 'text-accent-botanical font-bold'
                      : 'text-ink-muted hover:text-ink-primary'
                  }`}
                >
                  <span className="whitespace-nowrap">{link.label}</span>
                  {active && (
                    <motion.span
                      layoutId="storefront-nav-indicator"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-accent-botanical rounded-full"
                      transition={SPRING_PILL_TRANSITION}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Zone 3: Utility Controls (Right, shrink-0 whitespace-nowrap) */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0 whitespace-nowrap">
            {/* Compact Global Search Button (Hidden on tiny mobile, visible sm+) */}
            <button
              onClick={() => setSearchOpen(true)}
              className="hidden sm:flex h-9 px-3 rounded-full bg-forest-100 dark:bg-forest-900 border border-forest-200 dark:border-forest-700 text-ink-primary hover:text-accent-botanical transition-all shadow-xs text-xs font-mono items-center gap-1.5 shrink-0 whitespace-nowrap"
              title="Tìm kiếm (Ctrl + K)"
              aria-label="Search"
            >
              <Search className="w-3.5 h-3.5 text-accent-botanical shrink-0" />
              <span className="hidden 2xl:inline text-[11px] text-ink-muted font-normal whitespace-nowrap">Ctrl K</span>
            </button>

            {/* Bilingual Switcher Pill (VI / EN) (Hidden on tiny mobile, visible sm+) */}
            <div className="relative hidden sm:flex h-9 items-center rounded-full bg-forest-100 dark:bg-forest-900 p-0.5 border border-forest-200 dark:border-forest-700 text-[11px] font-mono shadow-xs shrink-0 whitespace-nowrap">
              <button
                onClick={() => setLanguage('vi')}
                className={`relative z-10 px-2.5 py-1 rounded-full transition-colors whitespace-nowrap ${
                  language === 'vi'
                    ? 'text-white font-bold'
                    : 'text-ink-muted hover:text-ink-primary'
                }`}
                title="Tiếng Việt"
                aria-label="Tiếng Việt"
              >
                {language === 'vi' && (
                  <motion.span
                    layoutId="navbar-lang-pill"
                    className="absolute inset-0 rounded-full bg-accent-botanical shadow-xs -z-10"
                    transition={SPRING_PILL_TRANSITION}
                  />
                )}
                VI
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`relative z-10 px-2.5 py-1 rounded-full transition-colors whitespace-nowrap ${
                  language === 'en'
                    ? 'text-white font-bold'
                    : 'text-ink-muted hover:text-ink-primary'
                }`}
                title="English"
                aria-label="English"
              >
                {language === 'en' && (
                  <motion.span
                    layoutId="navbar-lang-pill"
                    className="absolute inset-0 rounded-full bg-accent-botanical shadow-xs -z-10"
                    transition={SPRING_PILL_TRANSITION}
                  />
                )}
                EN
              </button>
            </div>

            {/* Theme Switcher Button (Daylight Sun / Evening Moon - Always visible) */}
            <button
              onClick={toggleTheme}
              className="h-9 w-9 flex items-center justify-center rounded-full bg-forest-100 dark:bg-forest-900 border border-forest-200 dark:border-forest-700 text-ink-primary hover:text-accent-botanical transition-all shadow-xs relative shrink-0 whitespace-nowrap"
              title={theme === 'dark' ? (language === 'en' ? 'Switch to Light Mode' : 'Chuyển sang chế độ Sáng') : (language === 'en' ? 'Switch to Dark Mode' : 'Chuyển sang chế độ Tối')}
              aria-label="Toggle Theme"
            >
              <motion.div
                key={theme}
                initial={{ rotate: -30, opacity: 0.6, scale: 0.85 }}
                animate={{ rotate: 0, opacity: 1, scale: 1 }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              >
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4 text-amber-400" />
                ) : (
                  <Moon className="w-4 h-4 text-forest-700" />
                )}
              </motion.div>
            </button>

            {/* Compact Direct Hotline Button (Visible md+) */}
            <a
              href="tel:0382851688"
              className="hidden md:flex h-9 w-9 2xl:w-auto 2xl:px-3 items-center justify-center gap-1.5 rounded-full bg-forest-100 dark:bg-forest-900 border border-forest-200 dark:border-forest-700 text-accent-botanical hover:bg-forest-200 dark:hover:bg-forest-800 transition-colors shrink-0 whitespace-nowrap text-xs font-mono font-medium shadow-xs"
              title="Hotline: 0382 851 688"
              aria-label="Hotline: 0382 851 688"
            >
              <Phone className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden 2xl:inline whitespace-nowrap">0382 851 688</span>
            </a>

            {/* Mobile Hamburger Drawer Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="h-9 w-9 flex items-center justify-center rounded-xl border border-forest-200 dark:border-forest-700 xl:hidden text-ink-primary bg-paper shadow-xs shrink-0 whitespace-nowrap"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer (Below xl breakpoint) - 100% Solid Opaque */}
        {mobileMenuOpen && (
          <div className="xl:hidden fixed top-[72px] left-0 right-0 bg-paper border-b border-forest-200 dark:border-forest-700 px-6 py-6 space-y-4 shadow-elevated z-50 animate-fadeIn">
            {/* Mobile Quick Controls Bar: Search & Language */}
            <div className="flex items-center justify-between gap-3 pb-3 border-b border-forest-100 dark:border-forest-800">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setSearchOpen(true);
                }}
                className="flex-1 h-9 px-3.5 rounded-xl bg-forest-100 dark:bg-forest-900 border border-forest-200 dark:border-forest-700 text-ink-muted text-xs font-mono flex items-center gap-2"
              >
                <Search className="w-3.5 h-3.5 text-accent-botanical" />
                <span>{language === 'en' ? 'Search menu, events...' : 'Tìm kiếm món, tin tức...'}</span>
              </button>

              <div className="flex items-center rounded-xl bg-forest-100 dark:bg-forest-900 p-0.5 border border-forest-200 dark:border-forest-700 text-xs font-mono">
                <button
                  onClick={() => setLanguage('vi')}
                  className={`px-3 py-1 rounded-lg transition-colors font-bold ${
                    language === 'vi' ? 'bg-accent-botanical text-white' : 'text-ink-muted'
                  }`}
                >
                  VI
                </button>
                <button
                  onClick={() => setLanguage('en')}
                  className={`px-3 py-1 rounded-lg transition-colors font-bold ${
                    language === 'en' ? 'bg-accent-botanical text-white' : 'text-ink-muted'
                  }`}
                >
                  EN
                </button>
              </div>
            </div>

            {/* Mobile Nav Links */}
            <div className="flex flex-col space-y-3 pt-1">
              {navLinks.map((link) => {
                const active = isActiveLink(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    prefetch={true}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`text-sm font-serif font-bold py-2 border-b border-forest-100/60 dark:border-forest-800/60 flex items-center justify-between whitespace-nowrap ${
                      active ? 'text-accent-botanical' : 'text-ink-primary hover:text-accent-botanical'
                    }`}
                  >
                    <span>{link.label}</span>
                    {active && <span className="w-2 h-2 rounded-full bg-accent-botanical" />}
                  </Link>
                );
              })}
            </div>

            {/* Mobile Hotlines */}
            <div className="pt-2 flex flex-col gap-2">
              <a
                href="tel:0382851688"
                className="flex items-center justify-center gap-2 py-3 rounded-xl bg-forest-100 dark:bg-forest-800 text-accent-botanical text-xs font-mono font-bold whitespace-nowrap"
              >
                <Phone className="w-4 h-4" />
                <span>Hotline 1: 0382 851 688</span>
              </a>
              <a
                href="tel:0774659000"
                className="flex items-center justify-center gap-2 py-3 rounded-xl bg-forest-50 dark:bg-forest-900 text-accent-botanical text-xs font-mono font-bold border border-forest-200 dark:border-forest-700 whitespace-nowrap"
              >
                <Phone className="w-4 h-4" />
                <span>Hotline 2: 0774 659 000</span>
              </a>
            </div>
          </div>
        )}
      </header>

      {/* Global Ctrl+K Search Modal */}
      <GlobalSearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
      />
    </>
  );
}
