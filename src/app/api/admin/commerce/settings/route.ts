import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { apiSuccess, apiError } from '@/lib/api-response';
import { requireAuth } from '@/lib/auth';
import { initialCommerceSettings } from '@/lib/seedData';
import { logAction } from '@/lib/logger';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const auth = await requireAuth(req, ['SUPER_ADMIN', 'EDITOR']);
  if ('errorResponse' in auth) return auth.errorResponse;

  try {
    let settings = await prisma.commerceSettings.findFirst();

    if (!settings) {
      settings = await prisma.commerceSettings.create({
        data: initialCommerceSettings,
      });
    }

    return apiSuccess(settings);
  } catch (error) {
    console.error('[Admin Commerce Settings GET Error]:', error);
    return apiError('Lỗi tải cài đặt thương mại điện tử', 500);
  }
}

export async function PATCH(req: NextRequest) {
  const auth = await requireAuth(req, 'SUPER_ADMIN');
  if ('errorResponse' in auth) return auth.errorResponse;

  try {
    const body = await req.json();

    let settings = await prisma.commerceSettings.findFirst();

    if (!settings) {
      settings = await prisma.commerceSettings.create({
        data: initialCommerceSettings,
      });
    }

    const allowedFields = [
      'commerceEnabled',
      'enableDelivery',
      'enablePickup',
      'enableDineInBbq',
      'enableCod',
      'enableVietQr',
      'enableEwallet',
      'enableCard',
      'bankId',
      'bankAccountNo',
      'bankAccountName',
      'vietQrTemplate',
      'webhookSecret',
      'defaultFreeShipThreshold',
      'orderNotificationEmail',
    ];

    const updateData: any = {};
    for (const key of allowedFields) {
      if (body[key] !== undefined) {
        if (typeof body[key] === 'boolean') {
          updateData[key] = Boolean(body[key]);
        } else if (typeof body[key] === 'number') {
          updateData[key] = Math.max(0, Math.round(Number(body[key])) || 0);
        } else if (typeof body[key] === 'string') {
          updateData[key] = body[key].trim();
        } else if (body[key] === null) {
          updateData[key] = null;
        }
      }
    }

    const updated = await prisma.commerceSettings.update({
      where: { id: settings.id },
      data: updateData,
    });

    await logAction({
      level: 'INFO',
      category: 'CMS',
      action: 'UPDATE_COMMERCE_SETTINGS',
      actor: auth.user.username,
      details: 'Cập nhật cấu hình thương mại điện tử (Thanh toán & Đặt món)',
    });

    return apiSuccess(updated, 'Cập nhật cài đặt thương mại điện tử thành công!');
  } catch (error) {
    console.error('[Admin Commerce Settings PATCH Error]:', error);
    return apiError('Lỗi cập nhật cài đặt thương mại điện tử', 500);
  }
}
