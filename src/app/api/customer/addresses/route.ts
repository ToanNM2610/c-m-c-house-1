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

    const addresses = await prisma.customerAddress.findMany({
      where: { customerId: customer.id },
      orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
    });

    return apiSuccess(addresses);
  } catch (error) {
    console.error('[Get Customer Addresses API Error]:', error);
    return apiError('Lỗi tải danh sách sổ địa chỉ', 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const customer = await getCustomerSessionUser(req);
    if (!customer) {
      return apiError('Yêu cầu đăng nhập tài khoản khách hàng', 401);
    }

    const body = await req.json();
    const {
      label = 'Nhà riêng',
      recipientName,
      phone,
      addressLine,
      wardDistrict,
      provinceCity,
      note,
      isDefault = false,
    } = body;

    if (!recipientName || recipientName.trim().length < 2) {
      return apiError('Vui lòng nhập tên người nhận hàng (tối thiểu 2 ký tự)', 400);
    }

    const cleanPhone = (phone || '').replace(/\s+/g, '');
    const phoneRegex = /^(0|\+84)(3|5|7|8|9)[0-9]{8}$/;
    if (!cleanPhone || !phoneRegex.test(cleanPhone)) {
      return apiError('Số điện thoại nhận hàng không hợp lệ (10 số)', 400);
    }

    if (!addressLine || addressLine.trim().length < 3) {
      return apiError('Vui lòng nhập số nhà, tên đường chi tiết', 400);
    }

    // Check count of existing addresses
    const existingCount = await prisma.customerAddress.count({
      where: { customerId: customer.id },
    });

    const shouldBeDefault = isDefault || existingCount === 0;

    if (shouldBeDefault) {
      await prisma.customerAddress.updateMany({
        where: { customerId: customer.id },
        data: { isDefault: false },
      });
    }

    const newAddress = await prisma.customerAddress.create({
      data: {
        customerId: customer.id,
        label: label.trim(),
        recipientName: recipientName.trim(),
        phone: cleanPhone,
        addressLine: addressLine.trim(),
        wardDistrict: (wardDistrict || '').trim(),
        provinceCity: (provinceCity || 'Đắk Nông').trim(),
        note: note ? note.trim() : null,
        isDefault: shouldBeDefault,
      },
    });

    return apiSuccess(newAddress, 'Thêm địa chỉ giao hàng thành công!');
  } catch (error) {
    console.error('[Create Customer Address API Error]:', error);
    return apiError('Lỗi thêm địa chỉ giao hàng mới', 500);
  }
}

export async function PUT(req: NextRequest) {
  try {
    const customer = await getCustomerSessionUser(req);
    if (!customer) {
      return apiError('Yêu cầu đăng nhập tài khoản khách hàng', 401);
    }

    const body = await req.json();
    const {
      id,
      label,
      recipientName,
      phone,
      addressLine,
      wardDistrict,
      provinceCity,
      note,
      isDefault,
    } = body;

    if (!id) {
      return apiError('Mã địa chỉ không hợp lệ', 400);
    }

    const existing = await prisma.customerAddress.findFirst({
      where: { id, customerId: customer.id },
    });

    if (!existing) {
      return apiError('Không tìm thấy địa chỉ tương ứng', 404);
    }

    if (isDefault) {
      await prisma.customerAddress.updateMany({
        where: { customerId: customer.id },
        data: { isDefault: false },
      });
    }

    const updateData: any = {};
    if (label !== undefined) updateData.label = label.trim();
    if (recipientName !== undefined) updateData.recipientName = recipientName.trim();
    if (phone !== undefined) {
      const cleanPhone = phone.replace(/\s+/g, '');
      updateData.phone = cleanPhone;
    }
    if (addressLine !== undefined) updateData.addressLine = addressLine.trim();
    if (wardDistrict !== undefined) updateData.wardDistrict = wardDistrict.trim();
    if (provinceCity !== undefined) updateData.provinceCity = provinceCity.trim();
    if (note !== undefined) updateData.note = note ? note.trim() : null;
    if (isDefault !== undefined) updateData.isDefault = Boolean(isDefault);

    const updated = await prisma.customerAddress.update({
      where: { id },
      data: updateData,
    });

    return apiSuccess(updated, 'Cập nhật địa chỉ thành công!');
  } catch (error) {
    console.error('[Update Customer Address API Error]:', error);
    return apiError('Lỗi cập nhật địa chỉ giao hàng', 500);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const customer = await getCustomerSessionUser(req);
    if (!customer) {
      return apiError('Yêu cầu đăng nhập tài khoản khách hàng', 401);
    }

    const { searchParams } = new URL(req.url);
    let addressId = searchParams.get('id');

    if (!addressId) {
      const body = await req.json().catch(() => ({}));
      addressId = body.id;
    }

    if (!addressId) {
      return apiError('Vui lòng chỉ định mã địa chỉ cần xóa', 400);
    }

    const target = await prisma.customerAddress.findFirst({
      where: { id: addressId, customerId: customer.id },
    });

    if (!target) {
      return apiError('Địa chỉ không tồn tại hoặc không thuộc quyền sở hữu của bạn', 404);
    }

    await prisma.customerAddress.delete({
      where: { id: addressId },
    });

    // If deleted was default, make the latest one default
    if (target.isDefault) {
      const remaining = await prisma.customerAddress.findFirst({
        where: { customerId: customer.id },
        orderBy: { createdAt: 'desc' },
      });

      if (remaining) {
        await prisma.customerAddress.update({
          where: { id: remaining.id },
          data: { isDefault: true },
        });
      }
    }

    return apiSuccess(null, 'Đã xóa địa chỉ khỏi sổ địa chỉ thành công.');
  } catch (error) {
    console.error('[Delete Customer Address API Error]:', error);
    return apiError('Lỗi xóa địa chỉ giao hàng', 500);
  }
}

