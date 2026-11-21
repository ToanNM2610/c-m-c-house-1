import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { logAction } from '@/lib/logger';

export const dynamic = 'force-dynamic';

interface RouteParams {
  params: {
    id: string;
  };
}

// PATCH /api/comments/[id] - toggle isFeatured or update status
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getSessionUser(request);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Yêu cầu xác thực tài khoản quản trị' }, { status: 401 });
    }

    const { id } = params;
    if (!id) {
      return NextResponse.json({ success: false, error: 'Thiếu mã đánh giá (id)' }, { status: 400 });
    }

    const body = await request.json();
    const { isFeatured, status, rating, content, authorName, visitDate } = body;

    const updated = await prisma.guestComment.update({
      where: { id },
      data: {
        isFeatured: isFeatured !== undefined ? Boolean(isFeatured) : undefined,
        status: status !== undefined ? status : undefined,
        rating: rating !== undefined ? Number(rating) : undefined,
        content: content !== undefined ? String(content).trim() : undefined,
        authorName: authorName !== undefined ? String(authorName).trim() : undefined,
        visitDate: visitDate !== undefined ? String(visitDate) : undefined,
      },
    });

    revalidatePath('/', 'layout');
    revalidatePath('/khach-hang');

    await logAction({
      level: 'INFO',
      category: 'CMS',
      action: 'COMMENT_UPDATE',
      actor: session.username,
      details: `Updated comment ${id} status/featured`,
    });

    return NextResponse.json({ success: true, comment: updated });
  } catch (error: any) {
    console.error('PATCH /api/comments/[id] error:', error);
    return NextResponse.json({ success: false, error: 'Không thể cập nhật đánh giá' }, { status: 500 });
  }
}

// PUT /api/comments/[id] - alias for update
export async function PUT(request: NextRequest, { params }: RouteParams) {
  return PATCH(request, { params });
}

// DELETE /api/comments/[id] - delete single comment
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getSessionUser(request);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Yêu cầu xác thực tài khoản quản trị' }, { status: 401 });
    }

    const { id } = params;
    if (!id) {
      return NextResponse.json({ success: false, error: 'Thiếu mã đánh giá cần xóa' }, { status: 400 });
    }

    const existing = await prisma.guestComment.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ success: false, error: 'Không tìm thấy đánh giá cần xóa' }, { status: 404 });
    }

    await prisma.guestComment.delete({ where: { id } });

    revalidatePath('/', 'layout');
    revalidatePath('/khach-hang');

    await logAction({
      level: 'INFO',
      category: 'CMS',
      action: 'COMMENT_DELETE',
      actor: session.username,
      details: `Deleted comment ${id} from ${existing.authorName}`,
    });

    return NextResponse.json({ success: true, message: 'Đã xóa đánh giá thành công' });
  } catch (error: any) {
    console.error('DELETE /api/comments/[id] error:', error);
    return NextResponse.json({ success: false, error: error?.message || 'Lỗi khi xóa đánh giá' }, { status: 500 });
  }
}

