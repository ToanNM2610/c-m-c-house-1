import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { apiSuccess, apiError } from '@/lib/api-response';
import { requireAuth } from '@/lib/auth';
import { logAction } from '@/lib/logger';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const auth = await requireAuth(req, 'SUPER_ADMIN');
  if ('errorResponse' in auth) return auth.errorResponse;

  try {
    const [
      settings,
      content,
      menuCategories,
      menuItems,
      spatialFigures,
      teamMembers,
      highlightStories,
      eventPosts,
      faqItems,
      staticPages,
      mediaAssets,
      pageSeos,
      redirectRules,
      contactSubmissions,
      guestComments,
      adminUsers,
      gmailConfig,
      gmailRecipients,
      blockedIps,
      antiSpamConfig,
    ] = await Promise.all([
      prisma.storeSettings.findFirst(),
      prisma.siteContent.findFirst(),
      prisma.menuCategory.findMany({ include: { items: true } }),
      prisma.menuItem.findMany(),
      prisma.spatialFigure.findMany(),
      prisma.teamMember.findMany(),
      prisma.highlightStory.findMany(),
      prisma.eventPost.findMany(),
      prisma.faqItem.findMany(),
      prisma.staticPage.findMany(),
      prisma.mediaAsset.findMany(),
      prisma.pageSeo.findMany(),
      prisma.redirectRule.findMany(),
      prisma.contactSubmission.findMany(),
      prisma.guestComment.findMany(),
      prisma.adminUser.findMany({
        select: {
          id: true,
          username: true,
          fullName: true,
          role: true,
          isActive: true,
          createdAt: true,
        },
      }),
      prisma.gmailConfig.findFirst(),
      prisma.gmailRecipient.findMany(),
      prisma.blockedIp.findMany(),
      prisma.antiSpamConfig.findFirst(),
    ]);

    const backupPayload = {
      app: 'Cam Cu House - Enterprise CMS',
      version: '2.0.0',
      exportedAt: new Date().toISOString(),
      exportedBy: auth.user.username,
      data: {
        settings,
        content,
        menuCategories,
        menuItems,
        spatialFigures,
        teamMembers,
        highlightStories,
        eventPosts,
        faqItems,
        staticPages,
        mediaAssets,
        pageSeos,
        redirectRules,
        contactSubmissions,
        guestComments,
        adminUsers,
        gmailConfig,
        gmailRecipients,
        blockedIps,
        antiSpamConfig,
      },
    };

    const jsonString = JSON.stringify(backupPayload, null, 2);
    const sizeBytes = Buffer.byteLength(jsonString, 'utf8');
    const filename = `camcu-backup-${new Date().toISOString().replace(/[:.]/g, '-')}.json`;

    // Record in BackupRecord
    await prisma.backupRecord.create({
      data: {
        filename,
        fileSize: sizeBytes,
        recordCounts: JSON.stringify({
          categories: menuCategories.length,
          menuItems: menuItems.length,
          figures: spatialFigures.length,
          team: teamMembers.length,
          stories: highlightStories.length,
          events: eventPosts.length,
          faqs: faqItems.length,
          pages: staticPages.length,
          seo: pageSeos.length,
          redirects: redirectRules.length,
          contacts: contactSubmissions.length,
          comments: guestComments.length,
        }),
        createdById: auth.user.id,
      },
    });

    await logAction({
      level: 'INFO',
      action: 'BACKUP_EXPORT',
      actor: auth.user.username,
      details: `Generated database backup: ${filename} (${sizeBytes} bytes)`,
    });

    return apiSuccess({
      filename,
      sizeBytes,
      backupPayload,
    }, 'Tạo bản sao lưu JSON thành công');
  } catch (error) {
    console.error('Error generating backup:', error);
    return apiError('Lỗi tạo bản sao lưu cơ sở dữ liệu', 500);
  }
}
