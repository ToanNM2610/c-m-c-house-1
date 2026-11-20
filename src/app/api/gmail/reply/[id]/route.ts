import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';
import { sendAdminReplyEmail } from '@/lib/mailer';

export const dynamic = 'force-dynamic';

// POST /api/gmail/reply/[id] - send reply email directly to customer
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSessionUser(request);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const body = await request.json();
    const { replySubject, replyBody } = body;

    if (!replyBody || replyBody.trim().length < 5) {
      return NextResponse.json(
        { error: 'Nội dung phản hồi phải có ít nhất 5 ký tự' },
        { status: 400 }
      );
    }

    const submission = await prisma.contactSubmission.findUnique({
      where: { id },
    });

    if (!submission) {
      return NextResponse.json({ error: 'Không tìm thấy thư liên hệ' }, { status: 404 });
    }

    if (!submission.email) {
      return NextResponse.json(
        { error: 'Khách hàng này không để lại địa chỉ email để phản hồi' },
        { status: 400 }
      );
    }

    const result = await sendAdminReplyEmail({
      to: submission.email,
      customerName: submission.fullName,
      replySubject: replySubject || `Phản hồi từ Cẩm Cù House: ${submission.subject || 'Liên hệ'}`,
      replyBody: replyBody.trim(),
      originalMessage: submission.message,
    });

    if (!result.success) {
      return NextResponse.json({ error: result.message }, { status: 400 });
    }

    // Update submission repliedAt timestamp and status to RESOLVED
    const updated = await prisma.contactSubmission.update({
      where: { id },
      data: {
        repliedAt: new Date(),
        status: submission.status === 'NEW' ? 'RESOLVED' : submission.status,
      },
    });

    // Record system log
    await prisma.systemLog.create({
      data: {
        level: 'INFO',
        category: 'CMS',
        action: 'REPLY_CUSTOMER_EMAIL',
        details: `Phản hồi email cho ${submission.fullName} (${submission.email})`,
        adminUsername: session.username,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Đã gửi email phản hồi thành công tới ${submission.email}`,
      submission: updated,
    });
  } catch (error: any) {
    console.error('POST /api/gmail/reply/[id] error:', error);
    return NextResponse.json(
      { error: error?.message || 'Lỗi khi gửi email phản hồi' },
      { status: 500 }
    );
  }
}

