'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, Check, Sparkles, ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useApp } from '@/context/AppContext';
import { ProductOptionGroup, SelectedOptionSnapshot } from '@/types';

// Standard option presets for items that don't have explicit optionGroups
const DRINK_DEFAULT_OPTION_GROUPS: ProductOptionGroup[] = [
  {
    id: 'size',
    nameVi: 'Kích cỡ (Size)',
    nameEn: 'Cup Size',
    type: 'SINGLE',
    required: true,
    isActive: true,
    options: [
      { labelVi: 'Size M (Vừa)', labelEn: 'Medium (M)', priceDelta: 0 },
      { labelVi: 'Size L (Lớn)', labelEn: 'Large (L)', priceDelta: 5000 },
    ],
  },
  {
    id: 'sugar',
    nameVi: 'Mức đường',
    nameEn: 'Sugar Level',
    type: 'SINGLE',
    required: true,
    isActive: true,
    options: [
      { labelVi: '100% Bình thường', labelEn: '100% Normal', priceDelta: 0 },
      { labelVi: '70% Ít ngọt', labelEn: '70% Less Sugar', priceDelta: 0 },
      { labelVi: '50% Nửa đường', labelEn: '50% Half Sugar', priceDelta: 0 },
      { labelVi: '30% Rất ít ngọt', labelEn: '30% Low Sugar', priceDelta: 0 },
      { labelVi: '0% Không đường', labelEn: '0% No Sugar', priceDelta: 0 },
    ],
  },
  {
    id: 'ice',
    nameVi: 'Mức đá',
    nameEn: 'Ice Level',
    type: 'SINGLE',
    required: true,
    isActive: true,
    options: [
      { labelVi: 'Đá bình thường', labelEn: 'Regular Ice', priceDelta: 0 },
      { labelVi: 'Ít đá', labelEn: 'Less Ice', priceDelta: 0 },
      { labelVi: 'Không đá', labelEn: 'No Ice', priceDelta: 0 },
      { labelVi: 'Uống nóng (nếu có)', labelEn: 'Hot (if available)', priceDelta: 0 },
    ],
  },
  {
    id: 'toppings',
    nameVi: 'Topping thêm',
    nameEn: 'Extra Toppings',
    type: 'MULTIPLE',
    required: false,
    isActive: true,
    options: [
      { labelVi: 'Thạch nha đam', labelEn: 'Aloe Vera Jelly', priceDelta: 8000 },
      { labelVi: 'Hạt đác rim dẻo', labelEn: 'Candied Palm Seeds', priceDelta: 10000 },
      { labelVi: 'Kem cheese béo ngậy', labelEn: 'Cheese Cream Foam', priceDelta: 10000 },
      { labelVi: 'Trân châu trắng giòn', labelEn: 'Crispy White Pearls', priceDelta: 8000 },
    ],
  },
];

const FOOD_DEFAULT_OPTION_GROUPS: ProductOptionGroup[] = [
  {
    id: 'food_portion',
    nameVi: 'Khẩu phần',
    nameEn: 'Portion Size',
    type: 'SINGLE',
    required: true,
    isActive: true,
    options: [
      { labelVi: 'Phần tiêu chuẩn', labelEn: 'Standard Portion', priceDelta: 0 },
      { labelVi: 'Phần lớn đặc biệt', labelEn: 'Large Portion', priceDelta: 15000 },
    ],
  },
  {
    id: 'food_spicy',
    nameVi: 'Độ cay',
    nameEn: 'Spiciness',
    type: 'SINGLE',
    required: true,
    isActive: true,
    options: [
      { labelVi: 'Không cay', labelEn: 'Not Spicy', priceDelta: 0 },
      { labelVi: 'Cay vừa', labelEn: 'Medium Spicy', priceDelta: 0 },
      { labelVi: 'Cay nhiều', labelEn: 'Very Spicy', priceDelta: 0 },
    ],
  },
  {
    id: 'food_sides',
    nameVi: 'Món ăn kèm thêm',
    nameEn: 'Extra Sides',
    type: 'MULTIPLE',
    required: false,
    isActive: true,
    options: [
      { labelVi: 'Trứng ốp la lòng đào', labelEn: 'Fried Egg', priceDelta: 10000 },
      { labelVi: 'Bánh mì nóng giòn', labelEn: 'Extra Bread', priceDelta: 5000 },
      { labelVi: 'Rau dưa tươi thêm', labelEn: 'Extra Fresh Greens', priceDelta: 5000 },
    ],
  },
];

export default function ItemCustomizationModal() {
  const { customizingItem, closeCustomization, addItem } = useCart();
  const { language } = useApp();
  const isEn = language === 'en';

  const [quantity, setQuantity] = useState(1);
  const [selectedSingles, setSelectedSingles] = useState<{ [groupId: string]: number }>({});
  const [selectedMultiples, setSelectedMultiples] = useState<{ [groupId: string]: number[] }>({});
  const [itemNote, setItemNote] = useState('');

  // Determine applicable option groups
  const groups: ProductOptionGroup[] = useMemo(() => {
    if (!customizingItem) return [];
    if (customizingItem.optionGroups && Array.isArray(customizingItem.optionGroups) && customizingItem.optionGroups.length > 0) {
      return customizingItem.optionGroups;
    }
    if (customizingItem.categoryId === 'food') {
      return FOOD_DEFAULT_OPTION_GROUPS;
    }
    return DRINK_DEFAULT_OPTION_GROUPS;
  }, [customizingItem]);

  // Reset selections when customizingItem changes
  useEffect(() => {
    if (customizingItem) {
      setQuantity(1);
      setItemNote('');
      const initSingles: { [groupId: string]: number } = {};
      const initMultiples: { [groupId: string]: number[] } = {};

      groups.forEach((g) => {
        if (g.type === 'SINGLE') {
          initSingles[g.id] = 0; // Default first option
        } else {
          initMultiples[g.id] = [];
        }
      });

      setSelectedSingles(initSingles);
      setSelectedMultiples(initMultiples);
    }
  }, [customizingItem, groups]);

  if (!customizingItem) return null;

  const basePrice = customizingItem.price || 0;

  // Calculate live price delta
  let optionsDelta = 0;
  const snapshotOptions: SelectedOptionSnapshot[] = [];

  groups.forEach((g) => {
    if (g.type === 'SINGLE') {
      const selectedIdx = selectedSingles[g.id] ?? 0;
      const opt = g.options[selectedIdx];
      if (opt) {
        optionsDelta += opt.priceDelta || 0;
        snapshotOptions.push({
          groupNameVi: g.nameVi,
          groupNameEn: g.nameEn,
          labelVi: opt.labelVi,
          labelEn: opt.labelEn,
          priceDelta: opt.priceDelta || 0,
        });
      }
    } else {
      const selectedIndices = selectedMultiples[g.id] || [];
      selectedIndices.forEach((idx) => {
        const opt = g.options[idx];
        if (opt) {
          optionsDelta += opt.priceDelta || 0;
          snapshotOptions.push({
            groupNameVi: g.nameVi,
            groupNameEn: g.nameEn,
            labelVi: opt.labelVi,
            labelEn: opt.labelEn,
            priceDelta: opt.priceDelta || 0,
          });
        }
      });
    }
  });

  const unitPrice = basePrice + optionsDelta;
  const lineTotal = unitPrice * quantity;

  const handleSelectSingle = (groupId: string, optionIdx: number) => {
    setSelectedSingles((prev) => ({ ...prev, [groupId]: optionIdx }));
  };

  const handleToggleMultiple = (groupId: string, optionIdx: number) => {
    setSelectedMultiples((prev) => {
      const current = prev[groupId] || [];
      if (current.includes(optionIdx)) {
        return { ...prev, [groupId]: current.filter((i) => i !== optionIdx) };
      } else {
        return { ...prev, [groupId]: [...current, optionIdx] };
      }
    });
  };

  const handleAddToCart = () => {
    addItem({
      menuItemId: customizingItem.id,
      nameVi: customizingItem.vietnameseTitle || customizingItem.name,
      nameEn: customizingItem.nameEn,
      unitPrice,
      basePrice,
      quantity,
      selectedOptions: snapshotOptions,
      itemNote: itemNote.trim(),
      productType: customizingItem.productType || 'DRINK_FOOD',
    });
    closeCustomization();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-lg bg-paper dark:bg-forest-950 rounded-3xl border border-forest-200 dark:border-forest-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="p-5 sm:p-6 border-b border-forest-200 dark:border-forest-800 bg-white/70 dark:bg-forest-900/70 backdrop-blur-md flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-accent-botanical uppercase tracking-widest font-semibold px-2 py-0.5 rounded-full bg-forest-100 dark:bg-forest-800">
                  {isEn ? 'Customize' : 'Tùy chọn'}
                </span>
                {customizingItem.highlight && (
                  <span className="text-[10px] font-mono text-amber-700 bg-amber-100 dark:bg-amber-950/60 px-2 py-0.5 rounded-full font-semibold flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5" />
                    {customizingItem.highlight}
                  </span>
                )}
              </div>
              <h3 className="font-serif text-xl font-bold text-ink-primary mt-1">
                {isEn && customizingItem.nameEn ? customizingItem.nameEn : customizingItem.vietnameseTitle}
              </h3>
              <p className="font-mono text-sm font-bold text-accent-botanical mt-0.5">
                {basePrice.toLocaleString('vi-VN')}đ
              </p>
            </div>
            <button
              onClick={closeCustomization}
              aria-label="Đóng"
              className="p-2 rounded-xl text-ink-muted hover:text-ink-primary hover:bg-forest-100 dark:hover:bg-forest-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Options Content */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
            {groups.map((group) => {
              const isSingle = group.type === 'SINGLE';
              return (
                <div key={group.id} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-serif text-sm font-bold text-ink-primary">
                      {isEn && group.nameEn ? group.nameEn : group.nameVi}
                    </h4>
                    <span className="text-[11px] font-mono text-ink-muted">
                      {isSingle
                        ? (isEn ? 'Select 1' : 'Chọn 1')
                        : (isEn ? 'Optional' : 'Tùy chọn nhiều')}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    {group.options.map((opt, idx) => {
                      const isSelected = isSingle
                        ? (selectedSingles[group.id] ?? 0) === idx
                        : (selectedMultiples[group.id] || []).includes(idx);

                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() =>
                            isSingle
                              ? handleSelectSingle(group.id, idx)
                              : handleToggleMultiple(group.id, idx)
                          }
                          className={`p-3 rounded-2xl text-left border transition-all flex flex-col justify-between ${
                            isSelected
                              ? 'bg-accent-botanical/10 dark:bg-accent-botanical/20 border-accent-botanical text-accent-botanical shadow-sm'
                              : 'bg-white dark:bg-forest-900 border-forest-100 dark:border-forest-800 text-ink-primary hover:border-forest-300'
                          }`}
                        >
                          <div className="flex items-center justify-between w-full">
                            <span className="text-xs font-medium leading-snug">
                              {isEn && opt.labelEn ? opt.labelEn : opt.labelVi}
                            </span>
                            {isSelected && <Check className="w-4 h-4 text-accent-botanical shrink-0 ml-1" />}
                          </div>
                          {opt.priceDelta > 0 && (
                            <span className="font-mono text-[11px] font-semibold text-accent-botanical mt-1.5">
                              +{opt.priceDelta.toLocaleString('vi-VN')}đ
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            {/* Note for Barista */}
            <div className="space-y-2">
              <label className="block font-serif text-sm font-bold text-ink-primary">
                {isEn ? 'Notes for Barista' : 'Ghi chú cho quán'}
              </label>
              <textarea
                value={itemNote}
                onChange={(e) => setItemNote(e.target.value)}
                placeholder={
                  isEn
                    ? 'e.g. less sweet, ice on the side, hot water...'
                    : 'Ví dụ: ít đá riêng, ít ngọt, không lấy hành lá...'
                }
                rows={2}
                className="w-full p-3 rounded-2xl bg-white dark:bg-forest-900 border border-forest-200 dark:border-forest-800 text-sm font-sans text-ink-primary focus:outline-none focus:border-accent-botanical resize-none placeholder:text-ink-muted/60"
              />
            </div>
          </div>

          {/* Footer & Add to Cart Action */}
          <div className="p-5 sm:p-6 border-t border-forest-200 dark:border-forest-800 bg-white/90 dark:bg-forest-900/90 backdrop-blur-md flex items-center gap-4">
            {/* Qty Selector */}
            <div className="flex items-center border border-forest-200 dark:border-forest-700 rounded-2xl bg-forest-50/70 dark:bg-forest-800/70 overflow-hidden shrink-0">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="p-3 text-ink-muted hover:text-ink-primary hover:bg-forest-200/50 dark:hover:bg-forest-700 transition-colors"
                aria-label="Giảm"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="px-3.5 font-mono-num text-sm font-bold text-ink-primary min-w-[2rem] text-center">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                className="p-3 text-ink-muted hover:text-ink-primary hover:bg-forest-200/50 dark:hover:bg-forest-700 transition-colors"
                aria-label="Tăng"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* CTA Button */}
            <button
              type="button"
              onClick={handleAddToCart}
              className="flex-1 py-3.5 px-5 rounded-2xl bg-accent-botanical hover:bg-forest-800 text-white font-sans text-sm font-bold flex items-center justify-between shadow-lg shadow-accent-botanical/25 transition-all active:scale-[0.99]"
            >
              <span className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4" />
                <span>{isEn ? 'Add to Cart' : 'Thêm Vào Giỏ'}</span>
              </span>
              <span className="font-mono-num">{lineTotal.toLocaleString('vi-VN')}đ</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

