import { NextRequest } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { apiSuccess, apiError } from '@/lib/api-response';
import { requireAuth } from '@/lib/auth';
import { logAction } from '@/lib/logger';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const list = await prisma.faqItem.findMany({
      orderBy: { orderIndex: 'asc' },
    });
    return apiSuccess(list);
  } catch (error) {
    console.error('Error fetching FAQs:', error);
    return apiError('Lỗi tải danh sách FAQ', 500);
  }
}

export async function POST(req: NextRequest) {
  const auth = await requireAuth(req, ['SUPER_ADMIN', 'EDITOR']);
  if ('errorResponse' in auth) return auth.errorResponse;

  try {
    const body = await req.json();
    const { question, questionEn, answer, answerEn, category = 'Không gian', categoryEn, orderIndex = 0, published = true } = body;

    if (!question || !answer) {
      return apiError('Câu hỏi và Câu trả lời không được để trống', 400);
    }

    const created = await prisma.faqItem.create({
      data: {
        question,
        questionEn: questionEn || null,
        answer,
        answerEn: answerEn || null,
        category,
        categoryEn: categoryEn || null,
        orderIndex: Number(orderIndex),
        published: Boolean(published),
      },
    });

    await logAction({
      level: 'INFO',
      action: 'FAQ_CREATE',
      actor: auth.user.username,
      details: `Created FAQ: ${question.slice(0, 50)}...`,
    });

    revalidatePath('/', 'layout');
    return apiSuccess(created, 'Thêm câu hỏi FAQ thành công');
  } catch (error) {
    console.error('Error creating FAQ:', error);
    return apiError('Lỗi thêm câu hỏi FAQ', 500);
  }
}

export async function PUT(req: NextRequest) {
  const auth = await requireAuth(req, ['SUPER_ADMIN', 'EDITOR']);
  if ('errorResponse' in auth) return auth.errorResponse;

  try {
    const body = await req.json();
    const { id, question, questionEn, answer, answerEn, category, categoryEn, orderIndex, published } = body;

    if (!id) return apiError('Thiếu ID câu hỏi', 400);

    const updated = await prisma.faqItem.update({
      where: { id },
      data: {
        question,
        questionEn: questionEn !== undefined ? (questionEn || null) : undefined,
        answer,
        answerEn: answerEn !== undefined ? (answerEn || null) : undefined,
        category,
        categoryEn: categoryEn !== undefined ? (categoryEn || null) : undefined,
        orderIndex: orderIndex !== undefined ? Number(orderIndex) : undefined,
        published: typeof published === 'boolean' ? published : undefined,
      },
    });

    await logAction({
      level: 'INFO',
      action: 'FAQ_UPDATE',
      actor: auth.user.username,
      details: `Updated FAQ ID: ${id}`,
    });

    revalidatePath('/', 'layout');
    return apiSuccess(updated, 'Cập nhật câu hỏi FAQ thành công');
  } catch (error) {
    console.error('Error updating FAQ:', error);
    return apiError('Lỗi cập nhật câu hỏi FAQ', 500);
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

    if (!id) return apiError('Thiếu ID câu hỏi cần xóa', 400);

    const existing = await prisma.faqItem.findUnique({ where: { id } });
    if (!existing) {
      return apiError('Không tìm thấy câu hỏi FAQ cần xóa', 404);
    }

    const deleted = await prisma.faqItem.delete({
      where: { id },
    });

    await logAction({
      level: 'INFO',
      action: 'FAQ_DELETE',
      actor: auth.user.username,
      details: `Deleted FAQ: ${deleted.question.slice(0, 50)}...`,
    });

    revalidatePath('/', 'layout');
    return apiSuccess(deleted, 'Xóa câu hỏi FAQ thành công');
  } catch (error: any) {
    console.error('Error deleting FAQ:', error);
    return apiError(error?.message || 'Lỗi khi xóa câu hỏi FAQ', 500);
  }
}

