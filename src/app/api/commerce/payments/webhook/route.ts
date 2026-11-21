import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { apiSuccess, apiError } from '@/lib/api-response';
import { logAction } from '@/lib/logger';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    // 1. Verify Secret Key if configured
    const settings = await prisma.commerceSettings.findFirst();
    const configuredSecret = settings?.webhookSecret;

    if (configuredSecret) {
      const authHeader = req.headers.get('authorization') || '';
      const token = authHeader.replace(/^Bearer\s+/i, '').trim();
      const urlToken = req.nextUrl.searchParams.get('token');
      const secureHeader = req.headers.get('x-api-key') || req.headers.get('secure-token');

      const clientSecret = token || urlToken || secureHeader;
      if (clientSecret !== configuredSecret) {
        return apiError('Webhook secret token không hợp lệ', 401);
      }
    }

    const body = await req.json().catch(() => ({}));

    // Normalize Transactions from SePay, Casso, PayOS, or direct format
    interface ParsedTransaction {
      refId: string;
      amount: number;
      description: string;
    }

    const transactions: ParsedTransaction[] = [];

    // SePay Webhook format
    if (body.transferAmount !== undefined || body.content !== undefined) {
      transactions.push({
        refId: String(body.referenceCode || body.id || 'SEPAY_' + Date.now()),
        amount: Number(body.transferAmount) || 0,
        description: String(body.content || ''),
      });
    }
    // Casso Webhook format
    else if (Array.isArray(body.data)) {
      for (const item of body.data) {
        transactions.push({
          refId: String(item.tid || item.id || 'CASSO_' + Date.now()),
          amount: Number(item.amount) || 0,
          description: String(item.description || ''),
        });
      }
    }
    // PayOS Webhook format
    else if (body.data && body.data.orderCode !== undefined) {
      transactions.push({
        refId: String(body.data.reference || body.data.orderCode),
        amount: Number(body.data.amount) || 0,
        description: String(body.data.description || `CCH-${body.data.orderCode}`),
      });
    }
    // Generic fallback format
    else if (body.orderCode) {
      transactions.push({
        refId: String(body.transactionId || body.reference || 'TX_' + Date.now()),
        amount: Number(body.amount) || 0,
        description: String(body.orderCode + ' ' + (body.memo || '')),
      });
    }

    if (transactions.length === 0) {
      return apiSuccess({ processed: 0 }, 'Không tìm thấy giao dịch hợp lệ trong payload');
    }

    const matchedOrders: string[] = [];

    for (const tx of transactions) {
      // Regex search for order code pattern CCH-XXXXXX-XXXX or CCHXXXXXX
      const orderMatch = tx.description.match(/CCH[-_]?[0-9]{6}[-_]?[0-9]{4}/i) ||
                         tx.description.match(/CCH[-_]?[A-Z0-9-]+/i);

      let targetOrder = null;

      if (orderMatch) {
        const rawCode = orderMatch[0].toUpperCase();
        // Normalize code with hyphens if missing
        targetOrder = await prisma.order.findFirst({
          where: {
            OR: [
              { orderCode: rawCode },
              { orderCode: rawCode.replace(/_/g, '-') },
            ],
          },
        });
      }

      // If no regex match, attempt exact match against any unpaid or pending order codes
      if (!targetOrder) {
        const pendingOrders = await prisma.order.findMany({
          where: {
            paymentStatus: { in: ['UNPAID', 'PENDING_VERIFY'] },
          },
          take: 20,
        });

        for (const order of pendingOrders) {
          const cleanOrderCode = order.orderCode.replace(/[^A-Z0-9]/gi, '').toUpperCase();
          const cleanDesc = tx.description.replace(/[^A-Z0-9]/gi, '').toUpperCase();

          if (cleanDesc.includes(cleanOrderCode)) {
            targetOrder = order;
            break;
          }
        }
      }

      if (targetOrder) {
        // Verify amount
        if (tx.amount >= targetOrder.totalAmount) {
          await prisma.order.update({
            where: { id: targetOrder.id },
            data: {
              paymentStatus: 'PAID',
              paidAt: new Date(),
              paymentRef: tx.refId,
              orderStatus: targetOrder.orderStatus === 'PENDING' ? 'CONFIRMED' : targetOrder.orderStatus,
            },
          });

          await logAction({
            level: 'INFO',
            category: 'SYSTEM',
            action: 'PAYMENT_WEBHOOK_MATCHED',
            details: `Thanh toán thành công qua Webhook ngân hàng cho đơn hàng #${targetOrder.orderCode} - Số tiền: ${tx.amount.toLocaleString('vi-VN')} đ (Ref: ${tx.refId})`,
          });

          matchedOrders.push(targetOrder.orderCode);
        } else {
          console.warn(`[Webhook Payment] Order #${targetOrder.orderCode} underpaid: expected ${targetOrder.totalAmount}, received ${tx.amount}`);
        }
      }
    }

    return apiSuccess({
      processedCount: transactions.length,
      matchedOrders,
    }, 'Đã xử lý thông báo biến động số dư ngân hàng');
  } catch (error) {
    console.error('[Payment Webhook Error]:', error);
    return apiError('Lỗi xử lý webhook thanh toán', 500);
  }
}
