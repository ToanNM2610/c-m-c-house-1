import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { apiSuccess, apiError } from '@/lib/api-response';
import { requireAuth } from '@/lib/auth';
import { logAction } from '@/lib/logger';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const auth = await requireAuth(req, ['SUPER_ADMIN', 'EDITOR']);
  if ('errorResponse' in auth) return auth.errorResponse;

  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search')?.trim();
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') === 'asc' ? 'asc' : 'desc';
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.max(1, Math.min(100, parseInt(searchParams.get('limit') || '20', 10)));
    const skip = (page - 1) * limit;

    const where: any = {};

    if (search) {
      where.OR = [
        { fullName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
      ];
    }

    const orderBy: any = {};
    if (sortBy === 'totalSpent') orderBy.totalSpent = sortOrder;
    else if (sortBy === 'orderCount') orderBy.orderCount = sortOrder;
    else orderBy.createdAt = sortOrder;

    const [total, customers] = await Promise.all([
      prisma.customer.count({ where }),
      prisma.customer.findMany({
        where,
        select: {
          id: true,
          email: true,
          fullName: true,
          phone: true,
          avatarUrl: true,
          isActive: true,
          totalSpent: true,
          orderCount: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: {
              addresses: true,
              orders: true,
              wishlists: true,
            },
          },
        },
        orderBy,
        skip,
        take: limit,
      }),
    ]);

    return apiSuccess({
      customers,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('[Admin Customers GET Error]:', error);
    return apiError('Lỗi tải danh sách khách hàng', 500);
  }
}

export async function PATCH(req: NextRequest) {
  const auth = await requireAuth(req, ['SUPER_ADMIN', 'EDITOR']);
  if ('errorResponse' in auth) return auth.errorResponse;

  try {
    const body = await req.json();
    const { id, isActive } = body;

    if (!id) {
      return apiError('Vui lòng chỉ định ID khách hàng', 400);
    }

    const existing = await prisma.customer.findUnique({
      where: { id },
    });

    if (!existing) {
      return apiError('Không tìm thấy tài khoản khách hàng', 404);
    }

    const updated = await prisma.customer.update({
      where: { id },
      data: {
        isActive: Boolean(isActive),
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        phone: true,
        isActive: true,
        totalSpent: true,
        orderCount: true,
      },
    });

    await logAction({
      level: 'INFO',
      category: 'CMS',
      action: 'UPDATE_CUSTOMER_STATUS',
      actor: auth.user.username,
      details: `${updated.isActive ? 'Mở khóa' : 'Khóa'} tài khoản khách hàng: ${updated.fullName} (${updated.email})`,
    });

    return apiSuccess(
      updated,
      `Đã ${updated.isActive ? 'kích hoạt' : 'tạm ngưng'} tài khoản khách hàng ${updated.fullName}`
    );
  } catch (error) {
    console.error('[Admin Customers PATCH Error]:', error);
    return apiError('Lỗi cập nhật trạng thái khách hàng', 500);
  }
}

