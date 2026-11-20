import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { apiSuccess, apiError } from '@/lib/api-response';
import { requireAuth } from '@/lib/auth';
import { logAction } from '@/lib/logger';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const auth = await requireAuth(req, 'SUPER_ADMIN');
  if ('errorResponse' in auth) return auth.errorResponse;

  try {
    const body = await req.json();
    const { backupPayload } = body;

    if (!backupPayload || !backupPayload.data) {
      return apiError('Dữ liệu khôi phục không hợp lệ hoặc thiếu payload', 400);
    }

    const { data } = backupPayload;

    // Use Prisma interactive transaction for atomic restore
    await prisma.$transaction(async (tx) => {
      // 1. Settings
      if (data.settings) {
        const { id, ...settingsData } = data.settings;
        const existing = await tx.storeSettings.findFirst();
        if (existing) {
          await tx.storeSettings.update({
            where: { id: existing.id },
            data: settingsData,
          });
        }
      }

      // 2. Content
      if (data.content) {
        const { id, ...contentData } = data.content;
        const existing = await tx.siteContent.findFirst();
        if (existing) {
          await tx.siteContent.update({
            where: { id: existing.id },
            data: contentData,
          });
        }
      }

      // 3. Menu Categories & Items
      if (Array.isArray(data.menuCategories)) {
        for (const cat of data.menuCategories) {
          const { items, ...catData } = cat;
          await tx.menuCategory.upsert({
            where: { id: cat.id },
            update: catData,
            create: catData,
          });
        }
      }

      if (Array.isArray(data.menuItems)) {
        for (const item of data.menuItems) {
          await tx.menuItem.upsert({
            where: { id: item.id },
            update: item,
            create: item,
          });
        }
      }

      // 4. Spatial Figures
      if (Array.isArray(data.spatialFigures)) {
        for (const fig of data.spatialFigures) {
          await tx.spatialFigure.upsert({
            where: { id: fig.id },
            update: fig,
            create: fig,
          });
        }
      }

      // 5. Team Members
      if (Array.isArray(data.teamMembers)) {
        for (const member of data.teamMembers) {
          await tx.teamMember.upsert({
            where: { id: member.id },
            update: member,
            create: member,
          });
        }
      }

      // 6. Highlight Stories
      if (Array.isArray(data.highlightStories)) {
        for (const story of data.highlightStories) {
          await tx.highlightStory.upsert({
            where: { id: story.id },
            update: story,
            create: story,
          });
        }
      }

      // 7. Event Posts
      if (Array.isArray(data.eventPosts)) {
        for (const post of data.eventPosts) {
          await tx.eventPost.upsert({
            where: { id: post.id },
            update: post,
            create: post,
          });
        }
      }

      // 8. FAQ Items
      if (Array.isArray(data.faqItems)) {
        for (const faq of data.faqItems) {
          await tx.faqItem.upsert({
            where: { id: faq.id },
            update: faq,
            create: faq,
          });
        }
      }

      // 9. Static Pages
      if (Array.isArray(data.staticPages)) {
        for (const page of data.staticPages) {
          await tx.staticPage.upsert({
            where: { id: page.id },
            update: page,
            create: page,
          });
        }
      }

      // 10. Page SEO
      if (Array.isArray(data.pageSeos)) {
        for (const seo of data.pageSeos) {
          await tx.pageSeo.upsert({
            where: { route: seo.route },
            update: seo,
            create: seo,
          });
        }
      }

      // 11. Redirect Rules
      if (Array.isArray(data.redirectRules)) {
        for (const rule of data.redirectRules) {
          await tx.redirectRule.upsert({
            where: { sourcePath: rule.sourcePath },
            update: rule,
            create: rule,
          });
        }
      }
    });

    // Invalidate caches
    try {
      revalidatePath('/', 'layout');
    } catch (e) {
      console.warn('Revalidation notice:', e);
    }

    await logAction({
      level: 'SECURITY',
      action: 'BACKUP_RESTORE',
      actor: auth.user.username,
      details: `Database successfully restored from JSON backup by ${auth.user.username}`,
    });

    return apiSuccess(null, 'Khôi phục cơ sở dữ liệu thành công');
  } catch (error) {
    console.error('Error restoring backup:', error);
    return apiError('Lỗi khôi phục cơ sở dữ liệu: ' + (error instanceof Error ? error.message : String(error)), 500);
  }
}

