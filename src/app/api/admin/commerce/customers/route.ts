import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { apiSuccess, apiError } from '@/lib/api-response';
import { requireModuleAuth } from '@/lib/auth';
import { canExportCustomerPhone } from '@/lib/rbac';
import { recordAuditLog } from '@/lib/audit';

export const dynamic = 'force-dynamic';

function maskPhone(phone: string | null | undefined): string {
  if (!phone) return '';
  if (phone.length <= 6) return '***';
  return `${phone.slice(0, 3)}****${phone.slice(-3)}`;
}

export async function GET(req: NextRequest) {
  const auth = await requireModuleAuth(req, 'customers');
  if ('errorResponse' in auth) return auth.errorResponse;

  try {
    const { searchParams } = new URL(req.url);
    const segment = searchParams.get('segment');
    const q = searchParams.get('q')?.trim();
    const format = searchParams.get('format');
    const canExport = canExportCustomerPhone(auth.user.role);

    if (format === 'csv' && !canExport) {
      return apiError('Vai trò Sale/CSKH không được phép xuất danh sách SĐT khách hàng', 403);
    }

    const where: Record<string, unknown> = {};
    if (segment && segment !== 'ALL') where.segment = segment;
    if (q) {
      where.OR = [
        { fullName: { contains: q, mode: 'insensitive' } },
        { phone: { contains: q, mode: 'insensitive' } },
        { email: { contains: q, mode: 'insensitive' } },
      ];
    }

    const customers = await prisma.customer.findMany({
      where,
      include: {
        addresses: true,
        orders: {
          take: 5,
          orderBy: { createdAt: 'desc' },
          select: { id: true, orderCode: true, totalAmount: true, orderStatus: true, createdAt: true },
        },
        loyaltyLogs: {
          take: 5,
          orderBy: { createdAt: 'desc' },
        },
      },
      orderBy: [{ totalSpent: 'desc' }, { createdAt: 'desc' }],
    });

    if (format === 'csv') {
      const header = ['ID', 'HoTen', 'SDT', 'Email', 'PhanNhom', 'SoDon', 'TongChiTieuVND', 'CongNoVND', 'DiemTichLuy'];
      const rows = customers.map((c) => [
        c.id,
        `"${(c.fullName || '').replace(/"/g, '""')}"`,
        c.phone || '',
        c.email || '',
        c.segment,
        c.orderCount,
        c.totalSpent,
        c.debtBalance,
        c.loyaltyPoints,
      ]);
      const csv = '\uFEFF' + [header.join(','), ...rows.map((r) => r.join(','))].join('\n');
      return new NextResponse(csv, {
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="camcu-customers-${new Date().toISOString().slice(0, 10)}.csv"`,
        },
      });
    }

    return apiSuccess({
      customers: customers.map((c) => ({
        ...c,
        phoneMasked: canExport ? c.phone : maskPhone(c.phone),
      })),
      canExportPhone: canExport,
    });
  } catch (error) {
    console.error('Error fetching customers:', error);
    return apiError('Không thể tải hồ sơ khách hàng CRM', 500);
  }
}

export async function PATCH(req: NextRequest) {
  const auth = await requireModuleAuth(req, 'customers');
  if ('errorResponse' in auth) return auth.errorResponse;

  try {
    const body = await req.json();
    const { id, segment, debtBalance, crmNote, loyaltyDelta, loyaltyReason, isActive } = body;
    if (!id) return apiError('Thiếu mã khách hàng (id)', 400);

    const updated = await prisma.$transaction(async (tx) => {
      const existing = await tx.customer.findUnique({ where: { id } });
      if (!existing) throw new Error('Không tìm thấy hồ sơ khách hàng');

      const updates: Record<string, unknown> = {};
      if (segment && ['NEW', 'VIP', 'WHOLESALE', 'BLACKLIST'].includes(segment)) {
        updates.segment = segment;
      }
      if (typeof debtBalance === 'number') {
        updates.debtBalance = Math.max(0, Math.round(debtBalance));
      }
      if (crmNote !== undefined) updates.crmNote = crmNote || null;
      if (typeof isActive === 'boolean') updates.isActive = isActive;

      if (typeof loyaltyDelta === 'number' && loyaltyDelta !== 0) {
        const delta = Math.round(loyaltyDelta);
        updates.loyaltyPoints = Math.max(0, (existing.loyaltyPoints || 0) + delta);
        await tx.loyaltyTransaction.create({
          data: {
            customerId: id,
            points: delta,
            type: 'ADJUST',
            reason: loyaltyReason || 'Điều chỉnh thủ công từ Admin CRM',
            actor: auth.user.username,
          },
        });
      }

      return tx.customer.update({
        where: { id },
        data: updates,
        include: { loyaltyLogs: { take: 5, orderBy: { createdAt: 'desc' } } },
      });
    });

    await recordAuditLog({
      action: 'CUSTOMER_CRM_UPDATE',
      module: 'CRM',
      recordId: id,
      details: `segment=${segment || '-'} debt=${debtBalance ?? '-'} loyalty=${loyaltyDelta ?? '-'}`,
      user: auth.user,
      req,
    });

    return apiSuccess(updated, { message: 'Đã cập nhật hồ sơ khách hàng' });
  } catch (error: any) {
    console.error('Error updating CRM customer:', error);
    return apiError(error?.message || 'Lỗi cập nhật CRM khách hàng', 400);
  }
}
