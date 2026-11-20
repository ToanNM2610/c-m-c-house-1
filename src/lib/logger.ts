import { prisma } from './prisma';

export async function logAction({
  level = 'INFO',
  category = 'SYSTEM',
  action,
  actor = 'system',
  details,
  ipAddress,
}: {
  level?: 'INFO' | 'WARN' | 'ERROR' | 'SECURITY';
  category?: 'AUTH' | 'CMS' | 'SEO' | 'SECURITY' | 'SYSTEM';
  action: string;
  actor?: string;
  details?: string;
  ipAddress?: string;
}) {
  try {
    return await prisma.systemLog.create({
      data: {
        level,
        category,
        action,
        adminUsername: actor || null,
        details: details || null,
        ipAddress: ipAddress || null,
      },
    });
  } catch (err) {
    console.error('Failed to write SystemLog:', err);
    return null;
  }
}
