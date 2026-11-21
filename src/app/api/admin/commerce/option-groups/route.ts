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
    const groups = await prisma.productOptionGroup.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return apiSuccess(groups);
  } catch (error) {
    console.error('[Admin Option Groups GET Error]:', error);
    return apiError('Lỗi tải danh sách nhóm tùy chọn món', 500);
  }
}

export async function POST(req: NextRequest) {
  const auth = await requireAuth(req, ['SUPER_ADMIN', 'EDITOR']);
  if ('errorResponse' in auth) return auth.errorResponse;

  try {
    const body = await req.json();
    const {
      nameVi,
      nameEn,
      type = 'SINGLE',
      required = false,
      options = [],
      isActive = true,
    } = body;

    if (!nameVi || typeof nameVi !== 'string' || nameVi.trim().length < 2) {
      return apiError('Vui lòng nhập tên nhóm tùy chọn (tối thiểu 2 ký tự)', 400);
    }

    if (!Array.isArray(options) || options.length === 0) {
      return apiError('Vui lòng tạo ít nhất 1 lựa chọn trong nhóm', 400);
    }

    const cleanOptions = options.map((opt: any) => ({
      labelVi: String(opt.labelVi || '').trim(),
      labelEn: opt.labelEn ? String(opt.labelEn).trim() : undefined,
      priceDelta: Math.max(0, parseInt(opt.priceDelta, 10) || 0),
    })).filter((opt) => opt.labelVi.length > 0);

    const created = await prisma.productOptionGroup.create({
      data: {
        nameVi: nameVi.trim(),
        nameEn: nameEn ? nameEn.trim() : null,
        type: type === 'MULTIPLE' ? 'MULTIPLE' : 'SINGLE',
        required: Boolean(required),
        options: cleanOptions,
        isActive: Boolean(isActive),
      },
    });

    await logAction({
      level: 'INFO',
      category: 'CMS',
      action: 'CREATE_OPTION_GROUP',
      actor: auth.user.username,
      details: `Tạo nhóm tùy chọn món mới: "${created.nameVi}" (${created.type})`,
    });

    return apiSuccess(created, 'Tạo nhóm tùy chọn thành công!');
  } catch (error) {
    console.error('[Admin Option Groups POST Error]:', error);
    return apiError('Lỗi tạo nhóm tùy chọn', 500);
  }
}

export async function PUT(req: NextRequest) {
  const auth = await requireAuth(req, ['SUPER_ADMIN', 'EDITOR']);
  if ('errorResponse' in auth) return auth.errorResponse;

  try {
    const body = await req.json();
    const {
      id,
      nameVi,
      nameEn,
      type,
      required,
      options,
      isActive,
    } = body;

    if (!id) {
      return apiError('Mã ID nhóm tùy chọn không hợp lệ', 400);
    }

    const existing = await prisma.productOptionGroup.findUnique({
      where: { id },
    });

    if (!existing) {
      return apiError('Không tìm thấy nhóm tùy chọn tương ứng', 404);
    }

    const updateData: any = {};
    if (nameVi !== undefined) updateData.nameVi = String(nameVi).trim();
    if (nameEn !== undefined) updateData.nameEn = nameEn ? String(nameEn).trim() : null;
    if (type !== undefined) updateData.type = type === 'MULTIPLE' ? 'MULTIPLE' : 'SINGLE';
    if (required !== undefined) updateData.required = Boolean(required);
    if (isActive !== undefined) updateData.isActive = Boolean(isActive);

    if (Array.isArray(options)) {
      updateData.options = options.map((opt: any) => ({
        labelVi: String(opt.labelVi || '').trim(),
        labelEn: opt.labelEn ? String(opt.labelEn).trim() : undefined,
        priceDelta: Math.max(0, parseInt(opt.priceDelta, 10) || 0),
      })).filter((opt) => opt.labelVi.length > 0);
    }

    const updated = await prisma.productOptionGroup.update({
      where: { id },
      data: updateData,
    });

    await logAction({
      level: 'INFO',
      category: 'CMS',
      action: 'UPDATE_OPTION_GROUP',
      actor: auth.user.username,
      details: `Cập nhật nhóm tùy chọn món: "${updated.nameVi}"`,
    });

    return apiSuccess(updated, 'Cập nhật nhóm tùy chọn thành công!');
  } catch (error) {
    console.error('[Admin Option Groups PUT Error]:', error);
    return apiError('Lỗi cập nhật nhóm tùy chọn', 500);
  }
}

export async function DELETE(req: NextRequest) {
  const auth = await requireAuth(req, ['SUPER_ADMIN', 'EDITOR']);
  if ('errorResponse' in auth) return auth.errorResponse;

  try {
    const { searchParams } = new URL(req.url);
    let id = searchParams.get('id');

    if (!id) {
      const body = await req.json().catch(() => ({}));
      id = body.id;
    }

    if (!id) {
      return apiError('Vui lòng chỉ định ID nhóm tùy chọn cần xóa', 400);
    }

    const existing = await prisma.productOptionGroup.findUnique({
      where: { id },
    });

    if (!existing) {
      return apiError('Không tìm thấy nhóm tùy chọn cần xóa', 404);
    }

    await prisma.productOptionGroup.delete({
      where: { id },
    });

    await logAction({
      level: 'WARN',
      category: 'CMS',
      action: 'DELETE_OPTION_GROUP',
      actor: auth.user.username,
      details: `Xóa nhóm tùy chọn món: "${existing.nameVi}" (#${existing.id})`,
    });

    return apiSuccess(null, 'Đã xóa nhóm tùy chọn thành công.');
  } catch (error) {
    console.error('[Admin Option Groups DELETE Error]:', error);
    return apiError('Lỗi xóa nhóm tùy chọn', 500);
  }
}
