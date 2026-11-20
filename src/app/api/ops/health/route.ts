import { NextRequest } from 'next/server';
import fs from 'fs';
import path from 'path';
import { prisma } from '@/lib/prisma';
import { apiSuccess, apiError } from '@/lib/api-response';
import { requireAuth } from '@/lib/auth';

export const dynamic = 'force-dynamic';

function getFolderSizeBytes(folderPath: string): number {
  if (!fs.existsSync(folderPath)) return 0;
  let total = 0;
  const items = fs.readdirSync(folderPath, { withFileTypes: true });
  for (const item of items) {
    const fullPath = path.join(folderPath, item.name);
    if (item.isDirectory()) {
      total += getFolderSizeBytes(fullPath);
    } else if (item.isFile()) {
      try {
        total += fs.statSync(fullPath).size;
      } catch {
        // ignore
      }
    }
  }
  return total;
}

export async function GET(req: NextRequest) {
  const auth = await requireAuth(req, 'SUPER_ADMIN');
  if ('errorResponse' in auth) return auth.errorResponse;

  try {
    const dbPath = path.join(process.cwd(), 'prisma', 'dev.db');
    let dbSizeBytes = 0;
    if (fs.existsSync(dbPath)) {
      try {
        dbSizeBytes = fs.statSync(dbPath).size;
      } catch {}
    }

    const uploadsPath = path.join(process.cwd(), 'public', 'uploads');
    const uploadsSizeBytes = getFolderSizeBytes(uploadsPath);

    const [
      menuItemCount,
      categoryCount,
      figureCount,
      teamCount,
      storyCount,
      eventCount,
      faqCount,
      pageCount,
      seoCount,
      redirectCount,
      contactCount,
      commentCount,
      userCount,
      logCount,
    ] = await Promise.all([
      prisma.menuItem.count(),
      prisma.menuCategory.count(),
      prisma.spatialFigure.count(),
      prisma.teamMember.count(),
      prisma.highlightStory.count(),
      prisma.eventPost.count(),
      prisma.faqItem.count(),
      prisma.staticPage.count(),
      prisma.pageSeo.count(),
      prisma.redirectRule.count(),
      prisma.contactSubmission.count(),
      prisma.guestComment.count(),
      prisma.adminUser.count(),
      prisma.systemLog.count(),
    ]);

    const healthData = {
      status: 'HEALTHY',
      timestamp: new Date().toISOString(),
      system: {
        nodeVersion: process.version,
        platform: process.platform,
        arch: process.arch,
        uptimeSeconds: Math.floor(process.uptime()),
        memoryUsageMb: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
      },
      storage: {
        databaseFile: 'prisma/dev.db',
        databaseSizeBytes: dbSizeBytes,
        databaseSizeFormatted: `${(dbSizeBytes / 1024 / 1024).toFixed(2)} MB`,
        uploadsSizeBytes: uploadsSizeBytes,
        uploadsSizeFormatted: `${(uploadsSizeBytes / 1024 / 1024).toFixed(2)} MB`,
      },
      counts: {
        menuItems: menuItemCount,
        categories: categoryCount,
        spatialFigures: figureCount,
        teamMembers: teamCount,
        stories: storyCount,
        events: eventCount,
        faqs: faqCount,
        staticPages: pageCount,
        seoRecords: seoCount,
        redirectRules: redirectCount,
        contacts: contactCount,
        comments: commentCount,
        adminUsers: userCount,
        systemLogs: logCount,
      },
      security: {
        rbacEnforced: true,
        cookieHttpOnly: true,
        honeypotActive: true,
        rateLimitReady: true,
        superAdminCount: await prisma.adminUser.count({ where: { role: 'SUPER_ADMIN' } }),
      },
    };

    return apiSuccess(healthData);
  } catch (error) {
    console.error('Error fetching health stats:', error);
    return apiError('Lỗi kiểm tra tình trạng hệ thống', 500);
  }
}

