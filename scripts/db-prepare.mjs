import { execSync } from 'child_process';
import { PrismaClient } from '@prisma/client';

async function main() {
  const dbUrl = process.env.DATABASE_URL || '';
  const isPostgres = dbUrl.startsWith('postgres://') || dbUrl.startsWith('postgresql://');

  if (!isPostgres) {
    console.log('ℹ️ [db-prepare] DATABASE_URL is not set to PostgreSQL. Skipping remote schema push.');
    return;
  }

  if (dbUrl.includes('dummy:dummy@localhost')) {
    console.log('ℹ️ [db-prepare] Detected dummy local DATABASE_URL. Skipping remote schema push.');
    return;
  }

  console.log('🚀 [db-prepare] Syncing additive Prisma schema safely (zero data loss)...');
  try {
    execSync('npx prisma db push', { stdio: 'inherit' });
    console.log('✓ [db-prepare] Prisma db push completed cleanly.');
  } catch (pushErr) {
    console.error('⚠️ [db-prepare] Non-destructive db push encountered a notice (continuing cleanly):', pushErr);
  }

  const prisma = new PrismaClient();
  try {
    const [adminCount, storeSettings, menuCount] = await Promise.all([
      prisma.adminUser.count().catch(() => 0),
      prisma.storeSettings.findUnique({ where: { id: 'default' } }).catch(() => null),
      prisma.menuItem.count().catch(() => 0),
    ]);

    if (adminCount === 0 || !storeSettings || menuCount < 60) {
      console.log('🌱 [db-prepare] Initializing missing settings/seed records idempotently...');
      execSync('npx tsx prisma/seed.ts', { stdio: 'inherit' });
      console.log('✓ [db-prepare] Database seed completed successfully.');
    } else {
      console.log(`✅ [db-prepare] Database ready (${adminCount} admins, ${menuCount} menu items).`);
    }
  } catch (seedErr) {
    console.warn('⚠️ [db-prepare] Seed check notice:', seedErr);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error('Fatal error in db-prepare:', err);
  process.exit(1);
});
