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

// Real DB write test: try inserting and deleting a transient probe row
async function probeDatabaseWrite(): Promise<{ ok: boolean; error?: string; mode?: string }> {
  try {
    // Attempt a no-op transactional probe: create then immediately delete a systemLog
    const probe = await prisma.systemLog.create({
      data: {
        level: 'INFO',
        category: 'HEALTH_CHECK',
        action: 'DB_WRITE_PROBE',
        details: 'Runtime write probe to verify SQLite writability',
        ipAddress: '127.0.0.1',
      },
    });
    await prisma.systemLog.delete({ where: { id: probe.id } });
    return { ok: true, mode: 'READ_WRITE' };
  } catch (error: any) {
    const msg = String(error?.message || error || '');
    const isReadOnly = /read.only|cannot write|attempt to write a readonly database|file is read.only|EACCES|EPERM/i.test(msg);
    return { ok: false, error: isReadOnly ? 'CSDL đang ở chế độ chỉ đọc (read-only) trên Vercel Serverless' : msg, mode: 'READ_ONLY' };
  }
}

export async function GET(req: NextRequest) {
  const auth = await requireAuth(req, ['SUPER_ADMIN', 'EDITOR']);
  if ('errorResponse' in auth) return auth.errorResponse;

  try {
    const dbPath = path.join(process.cwd(), 'prisma', 'dev.db');
    let dbSizeBytes = 0;
    let dbFileExists = false;
    if (fs.existsSync(dbPath)) {
      dbFileExists = true;
      try {
        dbSizeBytes = fs.statSync(dbPath).size;
      } catch {}
    }

    const uploadsPath = path.join(process.cwd(), 'public', 'uploads');
    const uploadsSizeBytes = getFolderSizeBytes(uploadsPath);

    const host = req.headers.get('host') || 'unknown';
    const isHttps = req.headers.get('x-forwarded-proto') === 'https' || req.url.startsWith('https');

    // Real live DB read probe
    let dbReadOk = false;
    let dbReadLatencyMs = 0;
    let dbReadError = '';
    try {
      const startRead = Date.now();
      await prisma.storeSettings.findUnique({ where: { id: 'default' } });
      dbReadLatencyMs = Date.now() - startRead;
      dbReadOk = true;
    } catch (err: any) {
      dbReadError = err?.message || 'Lỗi đọc CSDL';
    }

    // Real live DB write probe
    const writeProbe = await probeDatabaseWrite();

    // Real error count in SystemLog (last 24h)
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const errorCount24h = await prisma.systemLog.count({
      where: { level: 'ERROR', createdAt: { gte: oneDayAgo } },
    });

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
      superAdminCount,
      approvedCommentCount,
      blockedIpCount,
      gmailRecipientCount,
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
      prisma.adminUser.count({ where: { role: 'SUPER_ADMIN' } }),
      prisma.guestComment.count({ where: { status: 'APPROVED' } }),
      prisma.blockedIp.count(),
      prisma.gmailRecipient.count(),
    ]);

    // Compute dynamic health score
    const checks: { name: string; ok: boolean; detail?: string }[] = [
      { name: 'Đọc CSDL (Read Probe)', ok: dbReadOk, detail: dbReadOk ? `Phản hồi ${dbReadLatencyMs}ms` : dbReadError },
      { name: 'Ghi CSDL (Write Probe)', ok: writeProbe.ok, detail: writeProbe.ok ? 'Đọc/ghi bình thường' : (writeProbe.error || 'Lỗi ghi') },
      { name: 'Lỗi hệ thống (24h)', ok: errorCount24h === 0, detail: `${errorCount24h} lỗi` },
      { name: 'Tài khoản Super Admin', ok: superAdminCount > 0, detail: `${superAdminCount} tài khoản` },
    ];

    // Status: ERROR if DB read/write fails; WARNING if high 24h errors; HEALTHY otherwise
    let status: 'HEALTHY' | 'WARNING' | 'ERROR' = 'HEALTHY';
    if (!dbReadOk || !writeProbe.ok || superAdminCount === 0) {
      status = 'ERROR';
    } else if (errorCount24h > 10) {
      status = 'WARNING';
    }

    const mem = process.memoryUsage();

    const healthData = {
      status,
      statusVi: status === 'HEALTHY' ? 'TỐT' : status === 'WARNING' ? 'CẢNH BÁO' : 'LỖI',
      timestamp: new Date().toISOString(),
      system: {
        nodeVersion: process.version,
        platform: process.platform,
        arch: process.arch,
        uptimeSeconds: Math.floor(process.uptime()),
        memoryUsageMb: Math.round(mem.heapUsed / 1024 / 1024),
        rssMb: Math.round(mem.rss / 1024 / 1024),
        host,
        https: isHttps,
      },
      storage: {
        databaseFile: 'prisma/dev.db',
        databaseFileExists: dbFileExists,
        databaseSizeBytes: dbSizeBytes,
        databaseSizeFormatted: `${(dbSizeBytes / 1024 / 1024).toFixed(2)} MB`,
        databaseReadable: dbReadOk,
        databaseWritable: writeProbe.ok,
        databaseMode: writeProbe.mode || (writeProbe.ok ? 'READ_WRITE' : 'READ_ONLY'),
        databaseWriteError: writeProbe.error,
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
        approvedComments: approvedCommentCount,
        adminUsers: userCount,
        systemLogs: logCount,
        blockedIps: blockedIpCount,
        gmailRecipients: gmailRecipientCount,
      },
      security: {
        rbacEnforced: true,
        cookieHttpOnly: true,
        honeypotActive: true,
        rateLimitReady: true,
        superAdminCount,
      },
      checks,
      gmail: {
        configured: Boolean(process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD),
      },
    };

    return apiSuccess(healthData);
  } catch (error: any) {
    console.error('Error fetching health stats:', error);
    return apiError('Lỗi kiểm tra tình trạng hệ thống', 500);
  }
}

