'use client';

import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { CartItem, MenuItem, SelectedOptionSnapshot, ProductType } from '@/types';

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'id'> & { id?: string }) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, deltaOrQuantity: number, isAbsolute?: boolean) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  subtotal: number;
  totalCount: number;
  freeShipThreshold: number;
  setFreeShipThreshold: (val: number) => void;
  // Customization modal trigger helper
  customizingItem: MenuItem | null;
  openCustomization: (item: MenuItem) => void;
  closeCustomization: () => void;
}

const CART_STORAGE_KEY = 'camcu_ecommerce_cart_v1';
const DEFAULT_FREESHIP_THRESHOLD = 150000; // 150,000 VND default

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [freeShipThreshold, setFreeShipThreshold] = useState<number>(DEFAULT_FREESHIP_THRESHOLD);
  const [customizingItem, setCustomizingItem] = useState<MenuItem | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setItems(parsed);
        }
      }
    } catch {
      // Local storage disabled or corrupted
    }
    setIsInitialized(true);

    // Fetch commerce settings for freeShipThreshold
    fetch('/api/commerce/settings')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.defaultFreeShipThreshold && typeof data.defaultFreeShipThreshold === 'number') {
          setFreeShipThreshold(data.defaultFreeShipThreshold);
        }
      })
      .catch(() => {
        // Fallback to default
      });
  }, []);

  // Sync to localStorage
  useEffect(() => {
    if (!isInitialized) return;
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Local storage quota or disabled
    }
  }, [items, isInitialized]);

  // Generate deterministic unique key for cart items with identical options & notes
  const generateCartItemId = (
    menuItemId: string,
    options?: SelectedOptionSnapshot[],
    itemNote?: string
  ): string => {
    const optsKey = (options || [])
      .map((o) => `${o.groupNameVi}:${o.labelVi}`)
      .sort()
      .join('|');
    const noteKey = (itemNote || '').trim().toLowerCase();
    return `${menuItemId}_${optsKey}_${noteKey}`;
  };

  const addItem = useCallback(
    (item: Omit<CartItem, 'id'> & { id?: string }) => {
      setItems((prev) => {
        const entryId = item.id || generateCartItemId(item.menuItemId, item.selectedOptions, item.itemNote);
        const existingIndex = prev.findIndex((i) => i.id === entryId);

        if (existingIndex > -1) {
          const updated = [...prev];
          updated[existingIndex] = {
            ...updated[existingIndex],
            quantity: updated[existingIndex].quantity + (item.quantity || 1),
          };
          return updated;
        } else {
          const newItem: CartItem = {
            id: entryId,
            menuItemId: item.menuItemId,
            nameVi: item.nameVi,
            nameEn: item.nameEn,
            unitPrice: item.unitPrice,
            basePrice: item.basePrice,
            quantity: item.quantity || 1,
            selectedOptions: item.selectedOptions || [],
            itemNote: item.itemNote || '',
            productType: item.productType || 'DRINK_FOOD',
          };
          return [...prev, newItem];
        }
      });
      setIsCartOpen(true);
    },
    []
  );

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const updateQuantity = useCallback(
    (id: string, deltaOrQuantity: number, isAbsolute: boolean = false) => {
      setItems((prev) => {
        return prev
          .map((item) => {
            if (item.id === id) {
              const newQty = isAbsolute ? deltaOrQuantity : item.quantity + deltaOrQuantity;
              return { ...item, quantity: newQty };
            }
            return item;
          })
          .filter((item) => item.quantity > 0);
      });
    },
    []
  );

  const clearCart = useCallback(() => {
    setItems([]);
    try {
      localStorage.removeItem(CART_STORAGE_KEY);
    } catch {}
  }, []);

  const openCart = useCallback(() => setIsCartOpen(true), []);
  const closeCart = useCallback(() => setIsCartOpen(false), []);
  const toggleCart = useCallback(() => setIsCartOpen((prev) => !prev), []);

  const openCustomization = useCallback((item: MenuItem) => {
    setCustomizingItem(item);
  }, []);

  const closeCustomization = useCallback(() => {
    setCustomizingItem(null);
  }, []);

  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  }, [items]);

  const totalCount = useMemo(() => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }, [items]);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        isCartOpen,
        openCart,
        closeCart,
        toggleCart,
        subtotal,
        totalCount,
        freeShipThreshold,
        setFreeShipThreshold,
        customizingItem,
        openCustomization,
        closeCustomization,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

