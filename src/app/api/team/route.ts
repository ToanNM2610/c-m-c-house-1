import { NextRequest } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { apiSuccess, apiError } from '@/lib/api-response';
import { requireAuth } from '@/lib/auth';
import { logAction } from '@/lib/logger';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const list = await prisma.teamMember.findMany({
      orderBy: { orderIndex: 'asc' },
    });
    return apiSuccess(list);
  } catch (error) {
    console.error('Error fetching team members:', error);
    return apiError('Lỗi tải danh sách thành viên', 500);
  }
}

export async function POST(req: NextRequest) {
  const auth = await requireAuth(req, ['SUPER_ADMIN', 'EDITOR']);
  if ('errorResponse' in auth) return auth.errorResponse;

  try {
    const body = await req.json();
    const { name, nameEn, role, roleEn, bio, bioEn, avatarUrl, orderIndex = 0, active = true } = body;

    if (!name || !role || !bio) {
      return apiError('Họ tên, Vai trò và Giới thiệu ngắn không được để trống', 400);
    }

    const created = await prisma.teamMember.create({
      data: {
        name,
        nameEn: nameEn || null,
        role,
        roleEn: roleEn || null,
        bio,
        bioEn: bioEn || null,
        avatarUrl: avatarUrl || null,
        orderIndex: Number(orderIndex),
        active: Boolean(active),
      },
    });

    await logAction({
      level: 'INFO',
      action: 'TEAM_CREATE',
      actor: auth.user.username,
      details: `Added team member: ${name}`,
    });

    revalidatePath('/', 'layout');
    return apiSuccess(created, 'Thêm thành viên thành công');
  } catch (error) {
    console.error('Error creating team member:', error);
    return apiError('Lỗi thêm thành viên', 500);
  }
}

export async function PUT(req: NextRequest) {
  const auth = await requireAuth(req, ['SUPER_ADMIN', 'EDITOR']);
  if ('errorResponse' in auth) return auth.errorResponse;

  try {
    const body = await req.json();
    const { id, name, nameEn, role, roleEn, bio, bioEn, avatarUrl, orderIndex, active } = body;

    if (!id) return apiError('Thiếu ID thành viên', 400);

    const updated = await prisma.teamMember.update({
      where: { id },
      data: {
        name,
        nameEn: nameEn !== undefined ? (nameEn || null) : undefined,
        role,
        roleEn: roleEn !== undefined ? (roleEn || null) : undefined,
        bio,
        bioEn: bioEn !== undefined ? (bioEn || null) : undefined,
        avatarUrl: avatarUrl !== undefined ? (avatarUrl || null) : undefined,
        orderIndex: orderIndex !== undefined ? Number(orderIndex) : undefined,
        active: typeof active === 'boolean' ? active : undefined,
      },
    });

    await logAction({
      level: 'INFO',
      action: 'TEAM_UPDATE',
      actor: auth.user.username,
      details: `Updated team member: ${updated.name}`,
    });

    revalidatePath('/', 'layout');
    return apiSuccess(updated, 'Cập nhật thành viên thành công');
  } catch (error) {
    console.error('Error updating team member:', error);
    return apiError('Lỗi cập nhật thành viên', 500);
  }
}

export async function DELETE(req: NextRequest) {
  const auth = await requireAuth(req, ['SUPER_ADMIN', 'EDITOR']);
  if ('errorResponse' in auth) return auth.errorResponse;

  try {
    const { searchParams } = new URL(req.url);
    let id = searchParams.get('id');
    if (!id) {
      try {
        const body = await req.json();
        id = body?.id;
      } catch {}
    }

    if (!id) return apiError('Thiếu ID thành viên cần xóa', 400);

    const existing = await prisma.teamMember.findUnique({ where: { id } });
    if (!existing) {
      return apiError('Không tìm thấy thành viên cần xóa', 404);
    }

    const deleted = await prisma.teamMember.delete({
      where: { id },
    });

    await logAction({
      level: 'INFO',
      action: 'TEAM_DELETE',
      actor: auth.user.username,
      details: `Deleted team member: ${deleted.name}`,
    });

    revalidatePath('/', 'layout');
    return apiSuccess(deleted, 'Xóa thành viên thành công');
  } catch (error: any) {
    console.error('Error deleting team member:', error);
    return apiError(error?.message || 'Lỗi khi xóa thành viên', 500);
  }
}

