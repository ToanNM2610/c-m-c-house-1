import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { apiSuccess, apiError } from '@/lib/api-response';
import { getCustomerSessionUser } from '@/lib/customerAuth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const customer = await getCustomerSessionUser(req);
    if (!customer) {
      return apiError('Yêu cầu đăng nhập tài khoản khách hàng', 401);
    }

    const wishlistEntries = await prisma.customerWishlist.findMany({
      where: { customerId: customer.id },
      orderBy: { createdAt: 'desc' },
    });

    const itemIds = wishlistEntries.map((w) => w.menuItemId);
    const menuItems = await prisma.menuItem.findMany({
      where: { id: { in: itemIds } },
    });

    const itemsMap = new Map(menuItems.map((m) => [m.id, m]));

    const populatedList = wishlistEntries
      .map((entry) => {
        const item = itemsMap.get(entry.menuItemId);
        if (!item) return null;
        return {
          id: entry.id,
          menuItemId: entry.menuItemId,
          createdAt: entry.createdAt,
          item: {
            id: item.id,
            name: item.name,
            vietnameseTitle: item.vietnameseTitle,
            nameEn: item.nameEn,
            price: item.price,
            priceDisplay: item.priceDisplay,
            photoUrl: item.photoUrl,
            inStock: item.inStock,
            highlight: item.highlight,
            categoryId: item.categoryId,
          },
        };
      })
      .filter(Boolean);

    return apiSuccess(populatedList);
  } catch (error) {
    console.error('[Customer Wishlist GET API Error]:', error);
    return apiError('Lỗi tải danh sách món yêu thích', 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const customer = await getCustomerSessionUser(req);
    if (!customer) {
      return apiError('Yêu cầu đăng nhập tài khoản khách hàng', 401);
    }

    const body = await req.json();
    const { menuItemId } = body;

    if (!menuItemId || typeof menuItemId !== 'string') {
      return apiError('Mã món không hợp lệ', 400);
    }

    // Check item exists
    const item = await prisma.menuItem.findUnique({
      where: { id: menuItemId },
    });

    if (!item) {
      return apiError('Món không tồn tại trong thực đơn', 404);
    }

    const entry = await prisma.customerWishlist.upsert({
      where: {
        customerId_menuItemId: {
          customerId: customer.id,
          menuItemId,
        },
      },
      create: {
        customerId: customer.id,
        menuItemId,
      },
      update: {},
    });

    return apiSuccess(entry, `Đã thêm món "${item.vietnameseTitle || item.name}" vào danh sách yêu thích`);
  } catch (error) {
    console.error('[Customer Wishlist POST API Error]:', error);
    return apiError('Lỗi thêm món vào danh sách yêu thích', 500);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const customer = await getCustomerSessionUser(req);
    if (!customer) {
      return apiError('Yêu cầu đăng nhập tài khoản khách hàng', 401);
    }

    const { searchParams } = new URL(req.url);
    let menuItemId = searchParams.get('menuItemId');

    if (!menuItemId) {
      const body = await req.json().catch(() => ({}));
      menuItemId = body.menuItemId;
    }

    if (!menuItemId) {
      return apiError('Vui lòng chỉ định mã món cần xóa', 400);
    }

    await prisma.customerWishlist.deleteMany({
      where: {
        customerId: customer.id,
        menuItemId,
      },
    });

    return apiSuccess(null, 'Đã bỏ món khỏi danh sách yêu thích.');
  } catch (error) {
    console.error('[Customer Wishlist DELETE API Error]:', error);
    return apiError('Lỗi xóa món khỏi danh sách yêu thích', 500);
  }
}
