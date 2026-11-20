import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// GET /api/gmail/config - retrieve SMTP config with masked app password
export async function GET(request: NextRequest) {
  try {
    const session = await getSessionUser(request);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let config = await prisma.gmailConfig.findUnique({
      where: { id: 'default' },
    });

    if (!config) {
      config = await prisma.gmailConfig.create({
        data: {
          id: 'default',
          isEnabled: true,
          senderName: 'Cẩm Cù House — Thông Báo Website',
          senderEmail: '',
          appPassword: '',
          autoReplyEnabled: false,
          autoReplySubject: 'Cẩm Cù House đã nhận được lời nhắn của bạn',
          autoReplyBody: 'Cảm ơn bạn đã liên hệ Cẩm Cù House. Chúng tôi đã ghi nhận lời nhắn và sẽ phản hồi sớm nhất.',
        },
      });
    }

    const hasAppPassword = !!(config.appPassword && config.appPassword.trim().length > 0);

    return NextResponse.json({
      success: true,
      data: {
        id: config.id,
        isEnabled: config.isEnabled,
        senderName: config.senderName,
        senderEmail: config.senderEmail,
        hasAppPassword,
        maskedPassword: hasAppPassword ? '••••••••••••••••' : '',
        autoReplyEnabled: config.autoReplyEnabled,
        autoReplySubject: config.autoReplySubject,
        autoReplyBody: config.autoReplyBody,
        updatedAt: config.updatedAt,
      },
    });
  } catch (error) {
    console.error('GET /api/gmail/config error:', error);
    return NextResponse.json({ error: 'Không thể tải cấu hình Gmail' }, { status: 500 });
  }
}

// PATCH /api/gmail/config - update SMTP config
export async function PATCH(request: NextRequest) {
  try {
    const session = await getSessionUser(request);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Chỉ Super Admin mới có quyền sửa đổi cấu hình Gmail SMTP' }, { status: 403 });
    }

    const body = await request.json();
    const {
      isEnabled,
      senderName,
      senderEmail,
      appPassword,
      autoReplyEnabled,
      autoReplySubject,
      autoReplyBody,
    } = body;

    const updateData: any = {};
    if (typeof isEnabled === 'boolean') updateData.isEnabled = isEnabled;
    if (typeof senderName === 'string') updateData.senderName = senderName.trim();
    if (typeof senderEmail === 'string') updateData.senderEmail = senderEmail.trim();
    if (typeof autoReplyEnabled === 'boolean') updateData.autoReplyEnabled = autoReplyEnabled;
    if (typeof autoReplySubject === 'string') updateData.autoReplySubject = autoReplySubject.trim();
    if (typeof autoReplyBody === 'string') updateData.autoReplyBody = autoReplyBody.trim();

    // Only update appPassword if user entered a real new password (ignore masked bullets or empty string)
    if (typeof appPassword === 'string' && appPassword.trim().length > 0 && !appPassword.includes('•')) {
      updateData.appPassword = appPassword.trim().replace(/\s+/g, ''); // Remove spaces from 16-char code
    }

    const updated = await prisma.gmailConfig.upsert({
      where: { id: 'default' },
      update: updateData,
      create: {
        id: 'default',
        isEnabled: updateData.isEnabled ?? true,
        senderName: updateData.senderName ?? 'Cẩm Cù House — Thông Báo Website',
        senderEmail: updateData.senderEmail ?? '',
        appPassword: updateData.appPassword ?? '',
        autoReplyEnabled: updateData.autoReplyEnabled ?? false,
        autoReplySubject: updateData.autoReplySubject ?? 'Cẩm Cù House đã nhận được lời nhắn của bạn',
        autoReplyBody: updateData.autoReplyBody ?? 'Cảm ơn bạn đã liên hệ Cẩm Cù House. Chúng tôi đã ghi nhận lời nhắn và sẽ phản hồi sớm nhất.',
      },
    });

    // Record system log
    await prisma.systemLog.create({
      data: {
        level: 'INFO',
        category: 'CMS',
        action: 'UPDATE_GMAIL_CONFIG',
        details: `Cập nhật cấu hình Gmail SMTP (${updated.senderEmail || 'chưa set email'}, isEnabled: ${updated.isEnabled})`,
        adminUsername: session.username,
      },
    });

    const hasAppPassword = !!(updated.appPassword && updated.appPassword.trim().length > 0);

    return NextResponse.json({
      success: true,
      data: {
        id: updated.id,
        isEnabled: updated.isEnabled,
        senderName: updated.senderName,
        senderEmail: updated.senderEmail,
        hasAppPassword,
        maskedPassword: hasAppPassword ? '••••••••••••••••' : '',
        autoReplyEnabled: updated.autoReplyEnabled,
        autoReplySubject: updated.autoReplySubject,
        autoReplyBody: updated.autoReplyBody,
        updatedAt: updated.updatedAt,
      },
    });
  } catch (error) {
    console.error('PATCH /api/gmail/config error:', error);
    return NextResponse.json({ error: 'Không thể cập nhật cấu hình Gmail' }, { status: 500 });
  }
}

