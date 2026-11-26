import { prisma } from './prisma';
import { apiError } from './api-response';

export async function getCommerceModeFlags() {
  try {
    const [cs, ss] = await Promise.all([
      prisma.commerceSettings.findUnique({ where: { id: 'commerce-settings' } }).catch(() => null),
      prisma.siteSettings.findUnique({ where: { id: 'default' } }).catch(() => null),
    ]);

    const commerceEnabled = Boolean(cs?.commerceEnabled ?? ss?.commerceEnabled ?? false);
    const enableCustomerPortal = Boolean(cs?.enableCustomerPortal ?? ss?.enableCustomerPortal ?? false);

    return {
      commerceEnabled,
      enableCustomerPortal,
      settings: cs,
    };
  } catch {
    return {
      commerceEnabled: false,
      enableCustomerPortal: false,
      settings: null,
    };
  }
}

export async function requireCommerceEnabled() {
  const { commerceEnabled } = await getCommerceModeFlags();
  if (!commerceEnabled) {
    return apiError(
      'Tính năng bán hàng trực tuyến đang TẮT (Website đang ở Chế độ Giới thiệu Giai đoạn 1). Vui lòng liên hệ Hotline 0382 851 688.',
      403
    );
  }
  return null;
}

export async function requireCustomerPortalEnabled() {
  const { commerceEnabled, enableCustomerPortal } = await getCommerceModeFlags();
  if (!commerceEnabled || !enableCustomerPortal) {
    return apiError(
      'Cổng tài khoản khách hàng hiện đang TẮT (Chế độ Giới thiệu).',
      403
    );
  }
  return null;
}
