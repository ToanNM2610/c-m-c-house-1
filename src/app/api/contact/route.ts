import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';
import { sendContactNotification } from '@/lib/mailer';
import { runAntiSpamGuard, commitSubmission } from '@/lib/antiSpam';

export const dynamic = 'force-dynamic';

// GET /api/contact - admin retrieval
export async function GET(request: NextRequest) {
  try {
    const session = await getSessionUser(request);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const submissions = await prisma.contactSubmission.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, data: submissions });
  } catch (error) {
    console.error('GET /api/contact error:', error);
    return NextResponse.json({ error: 'Failed to fetch contact submissions' }, { status: 500 });
  }
}

// POST /api/contact - public submission with 7-layer anti-spam protection
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 1. Anti-Spam & Anti-Crash 7-Layer Verification
    const antiSpamResult = await runAntiSpamGuard(request, body, {
      nameField: 'fullName',
      contentField: 'message',
    });

    if (!antiSpamResult.passed) {
      if (antiSpamResult.isHoneypotBot) {
        // Silent success for honeypot bot trap
        return NextResponse.json({
          success: true,
          message: 'Tin nhắn của bạn đã được gửi thành công. Cẩm Cù House sẽ liên hệ sớm nhất!',
        });
      }
      return antiSpamResult.response;
    }

    const clientIp = antiSpamResult.ip;
    const { fullName, phone, email, subject, message } = body;

    if (!fullName || !phone || !message || message.trim().length < 5) {
      return NextResponse.json(
        { error: 'Vui lòng điền đầy đủ họ tên, số điện thoại và nội dung tin nhắn.' },
        { status: 400 }
      );
    }

    const submission = await prisma.contactSubmission.create({
      data: {
        fullName: fullName.trim(),
        phone: phone.trim(),
        email: email ? email.trim() : null,
        subject: subject || 'Tư vấn chung',
        message: message.trim(),
        status: 'NEW',
        emailStatus: 'NOT_CONFIGURED',
        ipAddress: clientIp,
      },
    });

    // Record submission for rate limiting
    commitSubmission(clientIp);

    // Attempt non-blocking / safe email dispatch
    try {
      const mailResult = await sendContactNotification(submission);
      if (mailResult) {
        const updatedWithEmail = await prisma.contactSubmission.update({
          where: { id: submission.id },
          data: {
            emailStatus: mailResult.status,
            emailSentTo: mailResult.sentTo || null,
            emailError: mailResult.error || null,
          },
        });
        return NextResponse.json({
          success: true,
          message: 'Tin nhắn của bạn đã được gửi thành công. Cẩm Cù House sẽ liên hệ sớm nhất!',
          submission: updatedWithEmail,
        });
      }
    } catch (mailErr: any) {
      console.warn('Non-blocking contact email dispatch error:', mailErr);
      await prisma.contactSubmission.update({
        where: { id: submission.id },
        data: {
          emailStatus: 'FAILED',
          emailError: mailErr?.message || 'Lỗi gửi email',
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Tin nhắn của bạn đã được gửi thành công. Cẩm Cù House sẽ liên hệ sớm nhất!',
      submission,
    });
  } catch (error) {
    console.error('POST /api/contact error:', error);
    return NextResponse.json({ error: 'Failed to submit contact message' }, { status: 500 });
  }
}

// PUT /api/contact - admin update status
export async function PUT(request: NextRequest) {
  try {
    const session = await getSessionUser(request);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ error: 'ID and status are required' }, { status: 400 });
    }

    const updated = await prisma.contactSubmission.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json({ success: true, submission: updated });
  } catch (error) {
    console.error('PUT /api/contact error:', error);
    return NextResponse.json({ error: 'Failed to update submission' }, { status: 500 });
  }
}

// DELETE /api/contact - admin delete
export async function DELETE(request: NextRequest) {
  try {
    const session = await getSessionUser(request);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Yêu cầu xác thực tài khoản quản trị' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    let id = searchParams.get('id');
    if (!id) {
      try {
        const body = await request.json();
        id = body?.id;
      } catch {}
    }

    if (!id) {
      return NextResponse.json({ success: false, error: 'Thiếu mã thư liên hệ cần xóa (id)' }, { status: 400 });
    }

    const existing = await prisma.contactSubmission.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ success: false, error: 'Không tìm thấy thư liên hệ cần xóa' }, { status: 404 });
    }

    await prisma.contactSubmission.delete({ where: { id } });

    return NextResponse.json({ success: true, message: 'Đã xóa thư liên hệ thành công' });
  } catch (error: any) {
    console.error('DELETE /api/contact error:', error);
    return NextResponse.json({ success: false, error: error?.message || 'Lỗi khi xóa thư liên hệ' }, { status: 500 });
  }
}
