import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// GET /api/gmail/recipients - list all Gmail recipients
export async function GET(request: NextRequest) {
  try {
    const session = await getSessionUser(request);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const recipients = await prisma.gmailRecipient.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, data: recipients });
  } catch (error) {
    console.error('GET /api/gmail/recipients error:', error);
    return NextResponse.json({ success: false, error: 'Không thể tải danh sách người nhận Gmail' }, { status: 500 });
  }
}

// POST /api/gmail/recipients - add a new Gmail recipient
export async function POST(request: NextRequest) {
  try {
    const session = await getSessionUser(request);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { email, label, receiveSubjects, isActive } = body;

    if (!email || !email.includes('@')) {
      return NextResponse.json({ success: false, error: 'Địa chỉ email không hợp lệ' }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Check if email already exists
    const existing = await prisma.gmailRecipient.findUnique({
      where: { email: cleanEmail },
    });

    if (existing) {
      return NextResponse.json({ success: false, error: 'Địa chỉ email này đã tồn tại trong danh sách nhận tin' }, { status: 400 });
    }

    const recipient = await prisma.gmailRecipient.create({
      data: {
        email: cleanEmail,
        label: label ? label.trim() : 'Nhân sự tiếp nhận',
        receiveSubjects: receiveSubjects ? receiveSubjects.trim() : 'ALL',
        isActive: typeof isActive === 'boolean' ? isActive : true,
      },
    });

    // Record system log
    await prisma.systemLog.create({
      data: {
        level: 'INFO',
        category: 'CMS',
        action: 'CREATE_GMAIL_RECIPIENT',
        details: `Thêm người nhận Gmail: ${cleanEmail} (${recipient.label})`,
        adminUsername: session.username,
      },
    });

    return NextResponse.json({ success: true, data: recipient });
  } catch (error: any) {
    console.error('POST /api/gmail/recipients error:', error);
    return NextResponse.json({ success: false, error: 'Không thể tạo người nhận Gmail' }, { status: 500 });
  }
}

// DELETE /api/gmail/recipients - delete a recipient by query param or body
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
      return NextResponse.json({ success: false, error: 'Thiếu mã người nhận email cần xóa (id)' }, { status: 400 });
    }

    const existing = await prisma.gmailRecipient.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json({ success: false, error: 'Không tìm thấy người nhận email cần xóa' }, { status: 404 });
    }

    await prisma.gmailRecipient.delete({
      where: { id },
    });

    // Record system log
    await prisma.systemLog.create({
      data: {
        level: 'WARN',
        category: 'CMS',
        action: 'DELETE_GMAIL_RECIPIENT',
        details: `Xóa người nhận Gmail: ${existing.email} (${existing.label})`,
        adminUsername: session.username,
      },
    });

    return NextResponse.json({ success: true, message: 'Đã xóa người nhận email thành công', data: { deletedId: id, email: existing.email } });
  } catch (error: any) {
    console.error('DELETE /api/gmail/recipients error:', error);
    return NextResponse.json({ success: false, error: error?.message || 'Không thể xóa người nhận email' }, { status: 500 });
  }
}

