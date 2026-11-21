import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';
import { sendContactNotification } from '@/lib/mailer';

export const dynamic = 'force-dynamic';

// POST /api/gmail/retry/[id] - retry sending contact notification
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSessionUser(request);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;

    const submission = await prisma.contactSubmission.findUnique({
      where: { id },
    });

    if (!submission) {
      return NextResponse.json({ success: false, error: 'Không tìm thấy thư liên hệ' }, { status: 404 });
    }

    const result = await sendContactNotification(submission);

    const updated = await prisma.contactSubmission.update({
      where: { id },
      data: {
        emailStatus: result.status,
        emailSentTo: result.sentTo || submission.emailSentTo,
        emailError: result.error || null,
      },
    });

    if (result.status === 'SENT') {
      return NextResponse.json({
        success: true,
        message: `Đã gửi lại email thành công tới: ${result.sentTo}`,
        submission: updated,
      });
    } else {
      return NextResponse.json({
        success: false,
        error: result.error || 'Gửi lại email không thành công',
        message: result.error || 'Gửi lại email không thành công',
        submission: updated,
      }, { status: 400 });
    }
  } catch (error: any) {
    console.error('POST /api/gmail/retry/[id] error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Lỗi khi gửi lại email' },
      { status: 500 }
    );
  }
}

