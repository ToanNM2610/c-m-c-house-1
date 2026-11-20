import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// GET /api/gmail/recipients - list all Gmail recipients
export async function GET(request: NextRequest) {
  try {
    const session = await getSessionUser(request);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const recipients = await prisma.gmailRecipient.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, data: recipients });
  } catch (error) {
    console.error('GET /api/gmail/recipients error:', error);
    return NextResponse.json({ error: 'Không thể tải danh sách người nhận Gmail' }, { status: 500 });
  }
}

// POST /api/gmail/recipients - add a new Gmail recipient
export async function POST(request: NextRequest) {
  try {
    const session = await getSessionUser(request);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { email, label, receiveSubjects, isActive } = body;

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Địa chỉ email không hợp lệ' }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Check if email already exists
    const existing = await prisma.gmailRecipient.findUnique({
      where: { email: cleanEmail },
    });

    if (existing) {
      return NextResponse.json({ error: 'Địa chỉ email này đã tồn tại trong danh sách nhận tin' }, { status: 400 });
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
    return NextResponse.json({ error: error?.message || 'Không thể tạo người nhận Gmail' }, { status: 500 });
  }
}

