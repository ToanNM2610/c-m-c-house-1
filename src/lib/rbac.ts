import { AdminRole } from '@/types';

export type AdminModuleKey =
  | 'dashboard'
  | 'cms'
  | 'menu'
  | 'inventory'
  | 'orders'
  | 'customers'
  | 'vouchers'
  | 'interactions'
  | 'analytics'
  | 'seo'
  | 'users'
  | 'settings'
  | 'ops';

export const ADMIN_ROLE_LABELS: Record<AdminRole, string> = {
  SUPER_ADMIN: 'Chủ quán (Super Admin)',
  MARKETING_CONTENT: 'Marketing / Nội dung',
  SALES_CSKH: 'Sale / CSKH',
  WAREHOUSE_OPS: 'Kho / Pha chế / Vận hành',
  ACCOUNTANT: 'Kế toán tài chính',
  EDITOR: 'Biên tập viên (Legacy)',
  SEO_MANAGER: 'Quản lý SEO (Legacy)',
  STAFF: 'Nhân viên (Legacy)',
};

const ROLE_MODULES: Record<AdminRole, AdminModuleKey[]> = {
  SUPER_ADMIN: [
    'dashboard',
    'cms',
    'menu',
    'inventory',
    'orders',
    'customers',
    'vouchers',
    'interactions',
    'analytics',
    'seo',
    'users',
    'settings',
    'ops',
  ],
  MARKETING_CONTENT: ['dashboard', 'cms', 'menu', 'vouchers', 'interactions', 'seo'],
  SALES_CSKH: ['dashboard', 'orders', 'customers', 'interactions', 'menu'],
  WAREHOUSE_OPS: ['dashboard', 'menu', 'inventory', 'orders'],
  ACCOUNTANT: ['dashboard', 'orders', 'customers', 'analytics'],
  EDITOR: ['dashboard', 'cms', 'menu', 'interactions', 'vouchers', 'settings'],
  SEO_MANAGER: ['dashboard', 'seo', 'analytics', 'settings'],
  STAFF: ['dashboard', 'orders', 'customers', 'interactions', 'menu'],
};

export function hasModuleAccess(role: string | undefined, mod: AdminModuleKey): boolean {
  if (!role) return false;
  if (role === 'SUPER_ADMIN') return true;
  const list = ROLE_MODULES[role as AdminRole];
  if (!list) return false;
  return list.includes(mod);
}

/** Kho/Pha chế (WAREHOUSE_OPS) MUST NOT view product cost price (COGS) */
export function canViewCostPrice(role: string | undefined): boolean {
  return role !== 'WAREHOUSE_OPS' && role !== 'STAFF';
}

/** Sale/CSKH MUST NOT export raw customer phone CSV */
export function canExportCustomerPhone(role: string | undefined): boolean {
  return role === 'SUPER_ADMIN' || role === 'ACCOUNTANT';
}

/** Roles allowed to view full financial KPIs on Dashboard / Reports */
export function canViewFinanceMetrics(role: string | undefined): boolean {
  return role === 'SUPER_ADMIN' || role === 'ACCOUNTANT' || role === 'SALES_CSKH';
}

export function getDefaultTabForRole(role: string | undefined): string {
  switch (role) {
    case 'SEO_MANAGER':
      return 'seo-url';
    case 'WAREHOUSE_OPS':
      return 'inventory-cms';
    case 'MARKETING_CONTENT':
      return 'page-home';
    case 'ACCOUNTANT':
      return 'commerce-analytics';
    case 'SALES_CSKH':
      return 'orders-cms';
    default:
      return 'dashboard';
  }
}

export const ALL_ENTERPRISE_ROLES: AdminRole[] = [
  'SUPER_ADMIN',
  'MARKETING_CONTENT',
  'SALES_CSKH',
  'WAREHOUSE_OPS',
  'ACCOUNTANT',
];
