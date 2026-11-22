'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight, Sparkles, Truck } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useApp } from '@/context/AppContext';

export default function CartDrawer() {
  const router = useRouter();
  const { language } = useApp();
  const isEn = language === 'en';
  const {
    items,
    isCartOpen,
    closeCart,
    removeItem,
    updateQuantity,
    subtotal,
    totalCount,
    freeShipThreshold,
  } = useCart();

  const isFreeShipEligible = subtotal >= freeShipThreshold && subtotal > 0;
  const freeShipRemaining = Math.max(0, freeShipThreshold - subtotal);
  const freeShipPercent = Math.min(100, Math.round((subtotal / (freeShipThreshold || 150000)) * 100));

  const handleCheckout = () => {
    closeCart();
    router.push('/thanh-toan');
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeCart}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Slide-over Drawer */}
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="w-screen max-w-md bg-paper dark:bg-forest-950 border-l border-forest-200 dark:border-forest-800 shadow-2xl flex flex-col justify-between"
            >
              {/* Drawer Header */}
              <div className="p-5 sm:p-6 border-b border-forest-200 dark:border-forest-800 bg-white/70 dark:bg-forest-900/70 backdrop-blur-md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-accent-botanical/10 dark:bg-accent-botanical/20 flex items-center justify-center text-accent-botanical">
                      <ShoppingBag className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="font-serif text-lg font-bold text-ink-primary">
                        {isEn ? 'Your Cart' : 'Giỏ Hàng Của Bạn'}
                      </h2>
                      <p className="text-xs font-mono text-ink-muted">
                        {totalCount} {isEn ? 'items in cart' : 'món đang chọn'}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={closeCart}
                    aria-label="Đóng giỏ hàng"
                    className="p-2 rounded-xl text-ink-muted hover:text-ink-primary hover:bg-forest-100 dark:hover:bg-forest-800 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Free Shipping Progress Bar */}
                <div className="mt-4 p-3 rounded-2xl bg-forest-50/80 dark:bg-forest-900 border border-forest-200/80 dark:border-forest-750">
                  <div className="flex items-center justify-between text-xs mb-1.5 font-sans">
                    <span className="flex items-center gap-1.5 text-forest-800 dark:text-forest-200 font-medium">
                      <Truck className="w-3.5 h-3.5 text-accent-botanical" />
                      {isFreeShipEligible
                        ? (isEn ? '🎉 Free shipping unlocked!' : '🎉 Bạn đã được Freeship!')
                        : (isEn
                            ? `Add ${freeShipRemaining.toLocaleString('vi-VN')}đ for Free Ship`
                            : `Thêm ${freeShipRemaining.toLocaleString('vi-VN')}đ để Freeship`)}
                    </span>
                    <span className="text-ink-muted font-bold font-mono-num">{freeShipPercent}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-forest-200/60 dark:bg-forest-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-accent-botanical transition-all duration-300 rounded-full"
                      style={{ width: `${freeShipPercent}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Items List */}
              <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
                {items.length === 0 ? (
                  <div className="py-16 text-center space-y-4">
                    <div className="w-16 h-16 mx-auto rounded-full bg-forest-100 dark:bg-forest-800 flex items-center justify-center text-forest-400">
                      <ShoppingBag className="w-8 h-8" />
                    </div>
                    <div className="space-y-1">
                      <p className="font-serif text-base font-bold text-ink-primary">
                        {isEn ? 'Your cart is empty' : 'Giỏ hàng đang trống'}
                      </p>
                      <p className="text-xs text-ink-muted max-w-xs mx-auto">
                        {isEn
                          ? 'Select your favorite coffee and herbal drinks from our botanical menu.'
                          : 'Hãy chọn những món cà phê mộc và thức uống thảo mộc yêu thích từ thực đơn.'}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        closeCart();
                        router.push('/thuc-don');
                      }}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-accent-botanical text-white text-xs font-mono font-medium hover:bg-forest-800 transition-colors shadow-sm"
                    >
                      <span>{isEn ? 'Explore Menu' : 'Xem Thực Đơn'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  items.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 rounded-2xl bg-white dark:bg-forest-900 border border-forest-100 dark:border-forest-800 shadow-sm space-y-2.5 transition-all hover:border-forest-300 dark:hover:border-forest-700"
                    >
                      {/* Name & Delete */}
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="font-serif text-sm font-bold text-ink-primary">
                            {isEn && item.nameEn ? item.nameEn : item.nameVi}
                          </h4>
                          <span className="font-mono text-xs text-accent-botanical font-semibold">
                            {item.unitPrice.toLocaleString('vi-VN')}đ
                          </span>
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          aria-label="Xóa món"
                          className="p-1.5 text-ink-muted hover:text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Selected Options Snapshot */}
                      {item.selectedOptions && item.selectedOptions.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {item.selectedOptions.map((opt, idx) => (
                            <span
                              key={idx}
                              className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-forest-50 dark:bg-forest-800 text-forest-700 dark:text-forest-300 border border-forest-200/50 dark:border-forest-700"
                            >
                              {opt.labelVi}
                              {opt.priceDelta > 0 && ` (+${opt.priceDelta.toLocaleString('vi-VN')}đ)`}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Item Note */}
                      {item.itemNote && (
                        <p className="text-[11px] font-mono italic text-ink-muted bg-forest-50/50 dark:bg-forest-850 px-2.5 py-1 rounded-lg">
                          📝 {item.itemNote}
                        </p>
                      )}

                      {/* Quantity & Line Total */}
                      <div className="flex items-center justify-between pt-2 border-t border-forest-100 dark:border-forest-800">
                        {/* Qty Controls */}
                        <div className="flex items-center border border-forest-200 dark:border-forest-700 rounded-xl bg-forest-50/50 dark:bg-forest-800/50 overflow-hidden">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="p-1.5 text-ink-muted hover:text-ink-primary hover:bg-forest-200/50 dark:hover:bg-forest-700 transition-colors"
                            aria-label="Giảm số lượng"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-3 font-mono text-xs font-bold text-ink-primary">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="p-1.5 text-ink-muted hover:text-ink-primary hover:bg-forest-200/50 dark:hover:bg-forest-700 transition-colors"
                            aria-label="Tăng số lượng"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Line Total */}
                        <span className="font-mono text-sm font-bold text-ink-primary">
                          {(item.unitPrice * item.quantity).toLocaleString('vi-VN')}đ
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Drawer Footer & Checkout CTA */}
              {items.length > 0 && (
                <div className="p-5 sm:p-6 border-t border-forest-200 dark:border-forest-800 bg-white/90 dark:bg-forest-900/90 backdrop-blur-md space-y-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-sans text-ink-muted">
                      <span>{isEn ? 'Subtotal' : 'Tạm tính'}</span>
                      <span className="font-bold text-sm text-ink-primary font-mono-num">
                        {subtotal.toLocaleString('vi-VN')}đ
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs font-sans text-ink-muted">
                      <span>{isEn ? 'Shipping Fee' : 'Phí vận chuyển'}</span>
                      <span className="italic">
                        {isFreeShipEligible
                          ? (isEn ? 'Free (Eligible)' : 'Miễn phí (Đủ ĐK)')
                          : (isEn ? 'Calculated at checkout' : 'Tính ở bước thanh toán')}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <button
                      onClick={handleCheckout}
                      className="w-full py-3.5 px-6 rounded-2xl bg-accent-botanical hover:bg-forest-800 text-white font-sans text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-accent-botanical/20 transition-all active:scale-[0.99]"
                    >
                      <span>{isEn ? 'Proceed to Checkout' : 'Tiến Hành Đặt Hàng'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        closeCart();
                        router.push('/thuc-don');
                      }}
                      className="w-full py-2.5 px-4 rounded-xl text-center text-xs font-sans text-ink-muted hover:text-ink-primary hover:bg-forest-100 dark:hover:bg-forest-800 transition-colors"
                    >
                      {isEn ? 'Continue Shopping' : 'Tiếp tục chọn món khác'}
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}

