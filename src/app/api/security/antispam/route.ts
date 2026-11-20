import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { getAntiSpamConfig, invalidateConfigCache } from '@/lib/antiSpam';
import { getMailRateLastHour } from '@/lib/mailer';

export const dynamic = 'force-dynamic';

// GET /api/security/antispam - retrieve anti-spam configuration
export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAuth(request, 'SUPER_ADMIN');
    if ('errorResponse' in authResult) {
      return authResult.errorResponse;
    }

    const config = await getAntiSpamConfig();
    const now = new Date();
    let currentlyBannedIps = 0;
    let totalBlockedLogs = 0;

    try {
      if ((prisma as any)?.blockedIp?.count) {
        currentlyBannedIps = await (prisma as any).blockedIp.count({
          where: {
            OR: [
              { isPermanent: true },
              { blockedUntil: { gt: now } },
            ],
          },
        });
      }
    } catch (e) {
      console.warn('Could not count blockedIp:', e);
    }

    try {
      if ((prisma as any)?.systemLog?.count) {
        totalBlockedLogs = await (prisma as any).systemLog.count({
          where: { category: 'SECURITY' },
        });
      }
    } catch (e) {
      console.warn('Could not count systemLog:', e);
    }

    const gmailSentLastHour = getMailRateLastHour();

    return NextResponse.json({
      success: true,
      data: {
        ...config,
        isEnabled: !config.emergencyLockdown,
        requireHumanChallenge: config.mathChallengeRequired,
        totalBlockedCount: totalBlockedLogs,
        currentlyBannedIps,
        gmailSentLastHour,
      },
    });
  } catch (error) {
    console.error('GET /api/security/antispam error:', error);
    return NextResponse.json(
      { success: false, error: 'Lỗi khi tải cấu hình chống spam', details: String(error) },
      { status: 500 }
    );
  }
}

// PATCH /api/security/antispam - update anti-spam configuration
export async function PATCH(request: NextRequest) {
  try {
    const authResult = await requireAuth(request, 'SUPER_ADMIN');
    if ('errorResponse' in authResult) {
      return authResult.errorResponse;
    }

    const body = await request.json();

    const allowedFields = [
      'emergencyLockdown',
      'maxRequestSizeKb',
      'cooldownSeconds',
      'maxPerTenMinutes',
      'maxPerDay',
      'globalMaxPerFiveMinutes',
      'escalatingBanEnabled',
      'mathChallengeRequired',
      'mathChallengeTtlMinutes',
      'mathChallengeMinFillSeconds',
      'nameMinLength',
      'nameMaxLength',
      'contentMinLength',
      'contentMaxLength',
      'maxLinksAllowed',
      'blockedKeywords',
      'maxGmailPerHour',
    ];

    const updateData: Record<string, any> = {};
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        if (typeof body[field] === 'boolean') {
          updateData[field] = body[field];
        } else if (typeof body[field] === 'number') {
          updateData[field] = Math.max(0, body[field]);
        } else if (typeof body[field] === 'string') {
          updateData[field] = body[field].trim();
        }
      }
    }

    // Map UI alias properties
    if (body.requireHumanChallenge !== undefined) {
      updateData.mathChallengeRequired = Boolean(body.requireHumanChallenge);
    }
    if (body.minFillSeconds !== undefined) {
      updateData.mathChallengeMinFillSeconds = Math.max(0, Number(body.minFillSeconds));
    }
    if (body.isEnabled !== undefined && body.emergencyLockdown === undefined) {
      updateData.emergencyLockdown = !body.isEnabled;
    }

    const updatedConfig = await prisma.antiSpamConfig.upsert({
      where: { id: 'default' },
      update: updateData,
      create: {
        id: 'default',
        ...updateData,
      },
    });

    // Invalidate in-memory cache
    invalidateConfigCache();

    // Log administrative action
    await prisma.systemLog.create({
      data: {
        level: 'INFO',
        category: 'SECURITY',
        action: 'ANTISPAM_CONFIG_UPDATED',
        details: `Cập nhật cấu hình bảo mật bởi @${authResult.user.username}: ${Object.keys(updateData).join(', ')}`,
        adminUsername: authResult.user.username,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Cập nhật cấu hình bảo mật thành công',
      data: updatedConfig,
    });
  } catch (error) {
    console.error('PATCH /api/security/antispam error:', error);
    return NextResponse.json(
      { success: false, error: 'Lỗi khi cập nhật cấu hình bảo mật' },
      { status: 500 }
    );
  }
}

