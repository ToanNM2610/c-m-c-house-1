'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Exact spatial order of customer storefront routes:
 * 0: / (Trang chủ)
 * 1: /gioi-thieu (Giới thiệu)
 * 2: /khong-gian (Không gian & 30 Plates)
 * 3: /thuc-don (Thực đơn)
 * 4: /khach-hang (Dấu ấn & Khách hàng)
 * 5: /su-kien (Tin tức, Blog & FAQ)
 * 6: /lien-he (Liên hệ)
 */
export const STOREFRONT_ROUTE_ORDER: Record<string, number> = {
  '/': 0,
  '/gioi-thieu': 1,
  '/khong-gian': 2,
  '/thuc-don': 3,
  '/khach-hang': 4,
  '/su-kien': 5,
  '/lien-he': 6,
};

interface NavigationDirectionContextType {
  direction: number; // +1 = moving right, -1 = moving left, 0 = initial / neutral
  currentIndex: number;
  previousIndex: number;
}

const NavigationDirectionContext = createContext<NavigationDirectionContextType>({
  direction: 0,
  currentIndex: 0,
  previousIndex: 0,
});

export function NavigationDirectionProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const currentIndex = STOREFRONT_ROUTE_ORDER[pathname] ?? 0;

  // Track the current route index and previous index across navigation
  const [history, setHistory] = useState<{ current: number; previous: number }>({
    current: currentIndex,
    previous: currentIndex,
  });

  // Adjust state during render when route changes (synchronous direction calculation)
  if (history.current !== currentIndex) {
    setHistory({
      current: currentIndex,
      previous: history.current,
    });
  }

  let direction = 0;
  if (history.current > history.previous) {
    direction = 1; // Moving right
  } else if (history.current < history.previous) {
    direction = -1; // Moving left
  } else {
    direction = 0; // Same index or initial load
  }

  useEffect(() => {
    try {
      sessionStorage.setItem('camcu_route_idx', String(currentIndex));
    } catch {
      // sessionStorage unavailable
    }
  }, [currentIndex]);

  return (
    <NavigationDirectionContext.Provider
      value={{
        direction,
        currentIndex: history.current,
        previousIndex: history.previous,
      }}
    >
      {children}
    </NavigationDirectionContext.Provider>
  );
}

export function useNavigationDirection() {
  return useContext(NavigationDirectionContext);
}

