'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { CustomerSafe, CustomerAddressItem } from '@/types';

interface CustomerAuthContextType {
  customer: CustomerSafe | null;
  isLoading: boolean;
  login: (credentials: { email: string; password: string }) => Promise<{ success: boolean; error?: string }>;
  register: (data: { email: string; password: string; fullName: string; phone?: string }) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  addresses: CustomerAddressItem[];
  refreshAddresses: () => Promise<void>;
  addAddress: (data: Omit<CustomerAddressItem, 'id' | 'customerId' | 'createdAt' | 'updatedAt'>) => Promise<boolean>;
  updateAddress: (id: string, data: Partial<CustomerAddressItem>) => Promise<boolean>;
  deleteAddress: (id: string) => Promise<boolean>;
  setDefaultAddress: (id: string) => Promise<boolean>;
  wishlistIds: string[];
  toggleWishlist: (menuItemId: string) => Promise<void>;
  isWishlisted: (menuItemId: string) => boolean;
  refreshCustomer: () => Promise<void>;
  isAuthModalOpen: boolean;
  authModalMode: 'login' | 'register';
  openAuthModal: (mode?: 'login' | 'register') => void;
  closeAuthModal: () => void;
}

const WISHLIST_LOCAL_KEY = 'camcu_guest_wishlist_v1';

const CustomerAuthContext = createContext<CustomerAuthContextType | null>(null);

export function CustomerAuthProvider({ children }: { children: React.ReactNode }) {
  const [customer, setCustomer] = useState<CustomerSafe | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [addresses, setAddresses] = useState<CustomerAddressItem[]>([]);
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);

  // Auth modal state
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');

  const openAuthModal = useCallback((mode: 'login' | 'register' = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    setIsAuthModalOpen(false);
  }, []);

  // Fetch current session profile
  const refreshCustomer = useCallback(async () => {
    try {
      const res = await fetch('/api/customer/auth/me');
      if (res.ok) {
        const data = await res.json();
        setCustomer(data.customer || null);
        if (data.wishlistIds && Array.isArray(data.wishlistIds)) {
          setWishlistIds(data.wishlistIds);
        }
      } else {
        setCustomer(null);
      }
    } catch {
      setCustomer(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch address book
  const refreshAddresses = useCallback(async () => {
    if (!customer) {
      setAddresses([]);
      return;
    }
    try {
      const res = await fetch('/api/customer/addresses');
      if (res.ok) {
        const data = await res.json();
        setAddresses(data.addresses || []);
      }
    } catch {
      // Failed to load addresses
    }
  }, [customer]);

  // Initial load
  useEffect(() => {
    // Load local guest wishlist
    try {
      const stored = localStorage.getItem(WISHLIST_LOCAL_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setWishlistIds(parsed);
        }
      }
    } catch {}

    refreshCustomer();
  }, [refreshCustomer]);

  // Load addresses when customer is logged in
  useEffect(() => {
    if (customer) {
      refreshAddresses();
    } else {
      setAddresses([]);
    }
  }, [customer, refreshAddresses]);

  const login = useCallback(
    async (credentials: { email: string; password: string }): Promise<{ success: boolean; error?: string }> => {
      try {
        const res = await fetch('/api/customer/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(credentials),
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setCustomer(data.customer);
          setIsAuthModalOpen(false);
          refreshCustomer();
          return { success: true };
        }
        return { success: false, error: data.error || 'Email hoặc mật khẩu không chính xác' };
      } catch {
        return { success: false, error: 'Không thể kết nối đến máy chủ. Vui lòng thử lại.' };
      }
    },
    [refreshCustomer]
  );

  const register = useCallback(
    async (formData: {
      email: string;
      password: string;
      fullName: string;
      phone?: string;
    }): Promise<{ success: boolean; error?: string }> => {
      try {
        const res = await fetch('/api/customer/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setCustomer(data.customer);
          setIsAuthModalOpen(false);
          refreshCustomer();
          return { success: true };
        }
        return { success: false, error: data.error || 'Đăng ký không thành công' };
      } catch {
        return { success: false, error: 'Không thể kết nối đến máy chủ. Vui lòng thử lại.' };
      }
    },
    [refreshCustomer]
  );

  const logout = useCallback(async () => {
    try {
      await fetch('/api/customer/auth/logout', { method: 'POST' });
    } catch {}
    setCustomer(null);
    setAddresses([]);
  }, []);

  const addAddress = useCallback(
    async (data: Omit<CustomerAddressItem, 'id' | 'customerId' | 'createdAt' | 'updatedAt'>): Promise<boolean> => {
      try {
        const res = await fetch('/api/customer/addresses', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        if (res.ok) {
          await refreshAddresses();
          return true;
        }
      } catch {}
      return false;
    },
    [refreshAddresses]
  );

  const updateAddress = useCallback(
    async (id: string, data: Partial<CustomerAddressItem>): Promise<boolean> => {
      try {
        const res = await fetch(`/api/customer/addresses?id=${encodeURIComponent(id)}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        if (res.ok) {
          await refreshAddresses();
          return true;
        }
      } catch {}
      return false;
    },
    [refreshAddresses]
  );

  const deleteAddress = useCallback(
    async (id: string): Promise<boolean> => {
      try {
        const res = await fetch(`/api/customer/addresses?id=${encodeURIComponent(id)}`, {
          method: 'DELETE',
        });
        if (res.ok) {
          await refreshAddresses();
          return true;
        }
      } catch {}
      return false;
    },
    [refreshAddresses]
  );

  const setDefaultAddress = useCallback(
    async (id: string): Promise<boolean> => {
      return updateAddress(id, { isDefault: true });
    },
    [updateAddress]
  );

  const toggleWishlist = useCallback(
    async (menuItemId: string) => {
      const isAlready = wishlistIds.includes(menuItemId);
      const nextList = isAlready
        ? wishlistIds.filter((id) => id !== menuItemId)
        : [...wishlistIds, menuItemId];

      setWishlistIds(nextList);

      // Save to local storage for guests
      try {
        localStorage.setItem(WISHLIST_LOCAL_KEY, JSON.stringify(nextList));
      } catch {}

      // If customer is logged in, sync with server
      if (customer) {
        try {
          if (isAlready) {
            await fetch(`/api/customer/wishlist?menuItemId=${encodeURIComponent(menuItemId)}`, {
              method: 'DELETE',
            });
          } else {
            await fetch('/api/customer/wishlist', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ menuItemId }),
            });
          }
        } catch {
          // Silent fallback
        }
      }
    },
    [wishlistIds, customer]
  );

  const isWishlisted = useCallback(
    (menuItemId: string) => {
      return wishlistIds.includes(menuItemId);
    },
    [wishlistIds]
  );

  return (
    <CustomerAuthContext.Provider
      value={{
        customer,
        isLoading,
        login,
        register,
        logout,
        addresses,
        refreshAddresses,
        addAddress,
        updateAddress,
        deleteAddress,
        setDefaultAddress,
        wishlistIds,
        toggleWishlist,
        isWishlisted,
        refreshCustomer,
        isAuthModalOpen,
        authModalMode,
        openAuthModal,
        closeAuthModal,
      }}
    >
      {children}
    </CustomerAuthContext.Provider>
  );
}

export function useCustomerAuth() {
  const context = useContext(CustomerAuthContext);
  if (!context) {
    throw new Error('useCustomerAuth must be used within a CustomerAuthProvider');
  }
  return context;
}

