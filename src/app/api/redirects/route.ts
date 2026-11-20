import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { apiSuccess, apiError } from '@/lib/api-response';
import { requireAuth } from '@/lib/auth';
import { logAction } from '@/lib/logger';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const rules = await prisma.redirectRule.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return apiSuccess(rules);
  } catch (error) {
    console.error('Error fetching redirects:', error);
    return apiError('Lỗi tải danh sách điều hướng', 500);
  }
}

export async function POST(req: NextRequest) {
  const auth = await requireAuth(req, ['SUPER_ADMIN', 'SEO_MANAGER']);
  if ('errorResponse' in auth) return auth.errorResponse;

  try {
    const body = await req.json();
    const { sourcePath, targetPath, statusCode = 301, isActive = true } = body;

    if (!sourcePath || !targetPath) {
      return apiError('Đường dẫn nguồn và đích không được để trống', 400);
    }

    const cleanSource = sourcePath.startsWith('/') ? sourcePath : `/${sourcePath}`;
    const cleanTarget = targetPath.startsWith('/') ? targetPath : `/${targetPath}`;

    const existing = await prisma.redirectRule.findUnique({
      where: { sourcePath: cleanSource },
    });

    if (existing) {
      return apiError(`Đã tồn tại quy tắc điều hướng cho nguồn '${cleanSource}'`, 409);
    }

    const created = await prisma.redirectRule.create({
      data: {
        sourcePath: cleanSource,
        targetPath: cleanTarget,
        statusCode: Number(statusCode) === 302 ? 302 : 301,
        isActive: Boolean(isActive),
      },
    });

    await logAction({
      level: 'INFO',
      action: 'REDIRECT_CREATE',
      actor: auth.user.username,
      details: `Created redirect rule: ${cleanSource} -> ${cleanTarget} (${statusCode})`,
    });

    return apiSuccess(created, 'Thêm quy tắc điều hướng thành công');
  } catch (error) {
    console.error('Error creating redirect:', error);
    return apiError('Lỗi tạo quy tắc điều hướng', 500);
  }
}

export async function PUT(req: NextRequest) {
  const auth = await requireAuth(req, ['SUPER_ADMIN', 'SEO_MANAGER']);
  if ('errorResponse' in auth) return auth.errorResponse;

  try {
    const body = await req.json();
    const { id, sourcePath, targetPath, statusCode, isActive } = body;

    if (!id) return apiError('Thiếu ID quy tắc điều hướng', 400);

    const updated = await prisma.redirectRule.update({
      where: { id },
      data: {
        sourcePath: sourcePath ? (sourcePath.startsWith('/') ? sourcePath : `/${sourcePath}`) : undefined,
        targetPath: targetPath ? (targetPath.startsWith('/') ? targetPath : `/${targetPath}`) : undefined,
        statusCode: statusCode ? Number(statusCode) : undefined,
        isActive: typeof isActive === 'boolean' ? isActive : undefined,
      },
    });

    await logAction({
      level: 'INFO',
      action: 'REDIRECT_UPDATE',
      actor: auth.user.username,
      details: `Updated redirect rule ID: ${id}`,
    });

    return apiSuccess(updated, 'Cập nhật quy tắc điều hướng thành công');
  } catch (error) {
    console.error('Error updating redirect:', error);
    return apiError('Lỗi cập nhật quy tắc điều hướng', 500);
  }
}

export async function DELETE(req: NextRequest) {
  const auth = await requireAuth(req, ['SUPER_ADMIN', 'SEO_MANAGER']);
  if ('errorResponse' in auth) return auth.errorResponse;

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) return apiError('Thiếu ID quy tắc cần xoá', 400);

    const deleted = await prisma.redirectRule.delete({
      where: { id },
    });

    await logAction({
      level: 'INFO',
      action: 'REDIRECT_DELETE',
      actor: auth.user.username,
      details: `Deleted redirect rule: ${deleted.sourcePath}`,
    });

    return apiSuccess(deleted, 'Xoá quy tắc điều hướng thành công');
  } catch (error) {
    console.error('Error deleting redirect:', error);
    return apiError('Lỗi xoá quy tắc điều hướng', 500);
  }
}

