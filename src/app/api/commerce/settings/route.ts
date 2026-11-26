import { apiSuccess } from '@/lib/api-response';
import { getCommerceModeFlags } from '@/lib/commerce-guard';

export const dynamic = 'force-dynamic';

export async function GET() {
  const { commerceEnabled, enableCustomerPortal, settings } = await getCommerceModeFlags();
  return apiSuccess({
    commerceEnabled,
    enableCustomerPortal,
    enableDelivery: commerceEnabled ? settings?.enableDelivery ?? true : false,
    enablePickup: commerceEnabled ? settings?.enablePickup ?? true : false,
    enableDineInBbq: commerceEnabled ? settings?.enableDineInBbq ?? true : false,
    enableCod: commerceEnabled ? settings?.enableCod ?? true : false,
    enableVietQr: commerceEnabled ? settings?.enableVietQr ?? true : false,
    vatPercent: settings?.vatPercent ?? 0,
    defaultFreeShipThreshold: settings?.defaultFreeShipThreshold ?? 300000,
  });
}
