import { prisma } from './prisma';
import { seedDatabase } from '../../prisma/seed';

let seedPromise: Promise<void> | null = null;

export async function ensureDatabaseSeeded(): Promise<void> {
  try {
    const [menuCount, siteSettingsExists, storeSettingsExists, commerceSettingsExists] = await Promise.all([
      prisma.menuItem.count().catch(() => 0),
      prisma.siteSettings.findUnique({ where: { id: 'default' } }).catch(() => null),
      prisma.storeSettings.findUnique({ where: { id: 'default' } }).catch(() => null),
      prisma.commerceSettings.findUnique({ where: { id: 'commerce-settings' } }).catch(() => null),
    ]);

    if (menuCount >= 60 && siteSettingsExists && storeSettingsExists && commerceSettingsExists) return;

    if (seedPromise) return seedPromise;

    seedPromise = (async () => {
      console.log('Database empty or incomplete. Running idempotent seed...');
      try {
        await seedDatabase();
      } catch (err) {
        console.error('Error auto-seeding database:', err);
      } finally {
        seedPromise = null;
      }
    })();

    return seedPromise;
  } catch (error) {
    console.warn('ensureDatabaseSeeded warning:', error);
  }
}
