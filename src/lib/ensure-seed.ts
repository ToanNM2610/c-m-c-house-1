import { prisma } from './prisma';
import { seedDatabase } from '../../prisma/seed';

let seedPromise: Promise<void> | null = null;

export async function ensureDatabaseSeeded(): Promise<void> {
  try {
    const [menuCount, settingsExists] = await Promise.all([
      prisma.menuItem.count().catch(() => 0),
      prisma.siteSettings.findUnique({ where: { id: 'default' } }).catch(() => null),
    ]);

    if (menuCount >= 60 && settingsExists) return;

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
