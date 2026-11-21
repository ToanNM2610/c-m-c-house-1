import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { apiSuccess, apiError } from '@/lib/api-response';
import { generateVietQrUrl } from '@/lib/vietqr';

export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  { params }: { params: { orderCode: string } }
) {
  try {
    const { orderCode } = params;

    if (!orderCode) {
      return apiError('Mã đơn hàng không hợp lệ', 400);
    }

    const order = await prisma.order.findUnique({
      where: { orderCode },
      include: {
        items: true,
        customer: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    if (!order) {
      return apiError('Không tìm thấy đơn hàng với mã này', 404);
    }

    // Attach VietQR payment data if payment method is VIETQR and status is not PAID
    let vietQrUrl: string | null = null;
    let bankInfo: any = null;

    if (order.paymentMethod === 'VIETQR' && order.paymentStatus !== 'PAID') {
      const settings = await prisma.commerceSettings.findFirst();
      const bankId = settings?.bankId || 'MB';
      const accountNo = settings?.bankAccountNo || '0382851688';
      const accountName = settings?.bankAccountName || 'CAM CU HOUSE';
      const template = settings?.vietQrTemplate || 'compact2';

      vietQrUrl = generateVietQrUrl({
        bankId,
        accountNo,
        accountName,
        amount: order.totalAmount,
        memo: order.orderCode,
        template,
      });

      bankInfo = {
        bankId,
        accountNo,
        accountName,
        memo: order.orderCode,
        amount: order.totalAmount,
      };
    }

    return apiSuccess({
      ...order,
      vietQrUrl,
      bankInfo,
    });
  } catch (error) {
    console.error('[Get Order Detail API Error]:', error);
    return apiError('Lỗi truy xuất thông tin đơn hàng', 500);
  }
}

