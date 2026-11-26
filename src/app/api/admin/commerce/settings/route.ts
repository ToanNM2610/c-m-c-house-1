import { NextRequest } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { apiSuccess, apiError } from '@/lib/api-response';
import { requireAuth } from '@/lib/auth';
import { recordAuditLog } from '@/lib/audit';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const auth = await requireAuth(req, ['SUPER_ADMIN', 'ACCOUNTANT', 'SALES_CSKH']);
  if ('errorResponse' in auth) return auth.errorResponse;

  try {
    let cs = await prisma.commerceSettings.findUnique({ where: { id: 'commerce-settings' } }).catch(() => null);
    if (!cs) {
      cs = await prisma.commerceSettings.create({
        data: {
          id: 'commerce-settings',
          commerceEnabled: false,
          enableCustomerPortal: false,
          enableNewsletter: false,
          enableQuickSupportWidget: true,
          enableSupportHotline: true,
          enableSupportZalo: true,
          enableSupportMessenger: false,
          enableSupportWhatsApp: false,
        },
      });
    }

    return apiSuccess({
      ...cs,
      webhookSecret: cs.webhookSecret ? '********' : '',
    });
  } catch (error) {
    console.error('Error loading commerce settings:', error);
    return apiError('Không thể tải cấu hình Chế độ Kép & Thanh toán', 500);
  }
}

export async function PATCH(req: NextRequest) {
  const auth = await requireAuth(req, ['SUPER_ADMIN']);
  if ('errorResponse' in auth) return auth.errorResponse;

  try {
    const body = await req.json();

    const updateData: Record<string, unknown> = {};
    const boolFields = [
      'commerceEnabled',
      'enableDelivery',
      'enablePickup',
      'enableDineInBbq',
      'enableCod',
      'enableVietQr',
      'enableEwallet',
      'enableCard',
      'enableCustomerPortal',
      'enableNewsletter',
      'enableQuickSupportWidget',
      'enableSupportHotline',
      'enableSupportZalo',
      'enableSupportMessenger',
      'enableSupportWhatsApp',
    ];
    for (const f of boolFields) {
      if (typeof body[f] === 'boolean') updateData[f] = body[f];
    }

    if (body.bankId !== undefined) updateData.bankId = String(body.bankId).trim().toUpperCase();
    if (body.bankAccountNo !== undefined) updateData.bankAccountNo = String(body.bankAccountNo).trim();
    if (body.bankAccountName !== undefined) updateData.bankAccountName = String(body.bankAccountName).trim().toUpperCase();
    if (body.vietQrTemplate !== undefined) updateData.vietQrTemplate = body.vietQrTemplate;
    if (typeof body.vatPercent === 'number') updateData.vatPercent = Math.min(20, Math.max(0, Math.round(body.vatPercent)));
    if (typeof body.defaultFreeShipThreshold === 'number') {
      updateData.defaultFreeShipThreshold = Math.max(0, Math.round(body.defaultFreeShipThreshold));
    }
    if (body.orderNotificationEmail !== undefined) updateData.orderNotificationEmail = body.orderNotificationEmail || null;
    if (body.webhookSecret && body.webhookSecret !== '********') updateData.webhookSecret = body.webhookSecret;

    const updated = await prisma.commerceSettings.upsert({
      where: { id: 'commerce-settings' },
      update: updateData,
      create: {
        id: 'commerce-settings',
        ...updateData,
      },
    });

    // Keep SiteSettings dual-mode flags in sync cleanly
    await prisma.siteSettings
      .update({
        where: { id: 'default' },
        data: {
          commerceEnabled: updated.commerceEnabled,
          enableCustomerPortal: updated.enableCustomerPortal,
          enableNewsletter: updated.enableNewsletter,
          enableSupportWidget: updated.enableQuickSupportWidget,
          enableHotline: updated.enableSupportHotline,
          enableZalo: updated.enableSupportZalo,
          enableMessenger: updated.enableSupportMessenger,
          enableWhatsApp: updated.enableSupportWhatsApp,
        },
      })
      .catch(() => {});

    await recordAuditLog({
      action: 'DUAL_MODE_SETTINGS_UPDATE',
      module: 'SYSTEM',
      recordId: 'commerce-settings',
      details: `commerceEnabled=${updated.commerceEnabled} customerPortal=${updated.enableCustomerPortal} messenger=${updated.enableSupportMessenger} whatsapp=${updated.enableSupportWhatsApp}`,
      user: auth.user,
      req,
    });

    revalidatePath('/', 'layout');
    return apiSuccess(
      { ...updated, webhookSecret: updated.webhookSecret ? '********' : '' },
      { message: 'Đã lưu cấu hình Chế độ Kép & đồng bộ trang chủ' }
    );
  } catch (error: any) {
    console.error('Error saving commerce settings:', error);
    return apiError(error?.message || 'Lỗi lưu cấu hình Chế độ Kép', 500);
  }
}
