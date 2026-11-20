import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';
import { runAntiSpamGuard, commitSubmission } from '@/lib/antiSpam';

export const dynamic = 'force-dynamic';

// GET /api/comments - returns approved comments for public, or all comments for admin
export async function GET(request: NextRequest) {
  try {
    const session = await getSessionUser(request);
    const isAdmin = Boolean(session);

    const comments = await prisma.guestComment.findMany({
      where: isAdmin ? undefined : { status: 'APPROVED' },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, data: comments });
  } catch (error) {
    console.error('GET /api/comments error:', error);
    return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 });
  }
}

// POST /api/comments - public submission with 7-layer anti-spam protection
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 1. Anti-Spam & Anti-Crash 7-Layer Verification
    const antiSpamResult = await runAntiSpamGuard(request, body, {
      nameField: 'authorName',
      contentField: 'content',
    });

    if (!antiSpamResult.passed) {
      if (antiSpamResult.isHoneypotBot) {
        // Silently accept bots to avoid probing
        return NextResponse.json({
          success: true,
          message: 'Cảm nhận của bạn đã được gửi thành công và đang chờ ban quản trị kiểm duyệt.',
        });
      }
      return antiSpamResult.response;
    }

    const clientIp = antiSpamResult.ip;
    const { authorName, rating, content, visitDate } = body;

    if (!authorName || !content || content.trim().length < 5) {
      return NextResponse.json(
        { error: 'Vui lòng nhập tên và nội dung cảm nhận (tối thiểu 5 ký tự).' },
        { status: 400 }
      );
    }

    const newComment = await prisma.guestComment.create({
      data: {
        authorName: authorName.trim(),
        rating: Math.min(5, Math.max(1, Number(rating) || 5)),
        content: content.trim(),
        visitDate: visitDate || 'Ghé thăm gần đây',
        status: 'PENDING',
        isFeatured: false,
        ipAddress: clientIp,
      },
    });

    // Record submission for rate limiting
    commitSubmission(clientIp);

    return NextResponse.json({
      success: true,
      message: 'Cảm nhận của bạn đã được gửi thành công và đang chờ ban quản trị kiểm duyệt.',
      comment: newComment,
    });
  } catch (error) {
    console.error('POST /api/comments error:', error);
    return NextResponse.json({ error: 'Failed to submit comment' }, { status: 500 });
  }
}

// PUT /api/comments - admin moderation (update status, toggle isFeatured)
export async function PUT(request: NextRequest) {
  try {
    const session = await getSessionUser(request);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, status, isFeatured } = body;

    if (!id) {
      return NextResponse.json({ error: 'Comment ID is required' }, { status: 400 });
    }

    const updated = await prisma.guestComment.update({
      where: { id },
      data: {
        status: status !== undefined ? status : undefined,
        isFeatured: isFeatured !== undefined ? Boolean(isFeatured) : undefined,
      },
    });

    return NextResponse.json({ success: true, comment: updated });
  } catch (error) {
    console.error('PUT /api/comments error:', error);
    return NextResponse.json({ error: 'Failed to update comment' }, { status: 500 });
  }
}

// DELETE /api/comments - admin deletion
export async function DELETE(request: NextRequest) {
  try {
    const session = await getSessionUser(request);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Comment ID is required' }, { status: 400 });
    }

    await prisma.guestComment.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/comments error:', error);
    return NextResponse.json({ error: 'Failed to delete comment' }, { status: 500 });
  }
}
