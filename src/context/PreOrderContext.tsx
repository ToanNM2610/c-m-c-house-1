"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface PreOrderItem {
  code: string;
  name: string;
  price?: number;
  quantity: number;
  note?: string;
  variant?: string;
}

interface PreOrderContextType {
  items: PreOrderItem[];
  addItem: (item: { code: string; name: string; price?: number; variant?: string }) => void;
  removeItem: (code: string, variant?: string) => void;
  updateQuantity: (code: string, quantity: number, variant?: string) => void;
  clearTray: () => void;
  totalItems: number;
  totalEstimatedAmount: number;
}

const PreOrderContext = createContext<PreOrderContextType | undefined>(undefined);

const STORAGE_KEY = "camcu_preorder_tray_v1";

export function PreOrderProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<PreOrderItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Khôi phục từ localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setItems(JSON.parse(saved));
      }
    } catch {
      // Ignore localStorage errors
    } finally {
      setHydrated(true);
    }
  }, []);

  // Lưu vào localStorage khi items thay đổi
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Ignore quota errors
    }
  }, [items, hydrated]);

  const addItem = (item: { code: string; name: string; price?: number; variant?: string }) => {
    setItems((prev) => {
      const existingIndex = prev.findIndex(
        (i) => i.code === item.code && (i.variant || "") === (item.variant || "")
      );
      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: next[existingIndex].quantity + 1,
        };
        return next;
      }
      return [
        ...prev,
        {
          code: item.code,
          name: item.name,
          price: item.price || 0,
          quantity: 1,
          variant: item.variant,
        },
      ];
    });
  };

  const removeItem = (code: string, variant?: string) => {
    setItems((prev) =>
      prev.filter(
        (i) => !(i.code === code && (i.variant || "") === (variant || ""))
      )
    );
  };

  const updateQuantity = (code: string, quantity: number, variant?: string) => {
    if (quantity <= 0) {
      removeItem(code, variant);
      return;
    }
    setItems((prev) =>
      prev.map((i) => {
        if (i.code === code && (i.variant || "") === (variant || "")) {
          return { ...i, quantity };
        }
        return i;
      })
    );
  };

  const clearTray = () => {
    setItems([]);
  };

  const totalItems = items.reduce((acc, curr) => acc + curr.quantity, 0);
  const totalEstimatedAmount = items.reduce(
    (acc, curr) => acc + (curr.price || 0) * curr.quantity,
    0
  );

  return (
    <PreOrderContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearTray,
        totalItems,
        totalEstimatedAmount,
      }}
    >
      {children}
    </PreOrderContext.Provider>
  );
}

export function usePreOrder() {
  const context = useContext(PreOrderContext);
  if (!context) {
    throw new Error("usePreOrder must be used within a PreOrderProvider");
  }
  return context;
}

