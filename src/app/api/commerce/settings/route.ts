import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { apiSuccess, apiError } from '@/lib/api-response';
import { initialCommerceSettings } from '@/lib/seedData';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    let settings = await prisma.commerceSettings.findFirst();

    if (!settings) {
      settings = await prisma.commerceSettings.create({
        data: initialCommerceSettings,
      });
    }

    // Exclude internal security webhookSecret from public view
    const { webhookSecret, ...publicSettings } = settings;

    return apiSuccess(publicSettings);
  } catch (error) {
    console.error('[Commerce Settings Public API Error]:', error);
    return apiError('Không thể tải cài đặt thương mại', 500);
  }
}
