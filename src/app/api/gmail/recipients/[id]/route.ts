import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// PATCH /api/gmail/recipients/[id] - update a recipient
export async function PATCH(
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
    const { email, label, receiveSubjects, isActive } = body;

    const existing = await prisma.gmailRecipient.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Không tìm thấy người nhận' }, { status: 404 });
    }

    const updateData: any = {};
    if (typeof label === 'string') updateData.label = label.trim();
    if (typeof receiveSubjects === 'string') updateData.receiveSubjects = receiveSubjects.trim();
    if (typeof isActive === 'boolean') updateData.isActive = isActive;

    if (email && email.trim().toLowerCase() !== existing.email) {
      const cleanEmail = email.trim().toLowerCase();
      const conflict = await prisma.gmailRecipient.findUnique({
        where: { email: cleanEmail },
      });
      if (conflict && conflict.id !== id) {
        return NextResponse.json({ error: 'Địa chỉ email này đã được sử dụng bởi người nhận khác' }, { status: 400 });
      }
      updateData.email = cleanEmail;
    }

    const updated = await prisma.gmailRecipient.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    console.error('PATCH /api/gmail/recipients/[id] error:', error);
    return NextResponse.json({ error: error?.message || 'Không thể cập nhật người nhận' }, { status: 500 });
  }
}

// DELETE /api/gmail/recipients/[id] - delete a recipient
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSessionUser(request);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;

    const existing = await prisma.gmailRecipient.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Không tìm thấy người nhận' }, { status: 404 });
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

    return NextResponse.json({ success: true, message: 'Đã xóa người nhận thành công' });
  } catch (error: any) {
    console.error('DELETE /api/gmail/recipients/[id] error:', error);
    return NextResponse.json({ error: error?.message || 'Không thể xóa người nhận' }, { status: 500 });
  }
}

