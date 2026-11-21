import { execSync } from 'child_process';
import { PrismaClient } from '@prisma/client';

async function main() {
  const dbUrl = process.env.DATABASE_URL || '';
  const isPostgres = dbUrl.startsWith('postgres://') || dbUrl.startsWith('postgresql://');

  if (!isPostgres) {
    console.log('ℹ️ [db-prepare] DATABASE_URL is not set to PostgreSQL. Skipping remote schema push.');
    return;
  }

  // If local dummy database url, skip remote schema push
  if (dbUrl.includes('dummy:dummy@localhost')) {
    console.log('ℹ️ [db-prepare] Detected dummy local DATABASE_URL. Skipping remote schema push.');
    return;
  }

  console.log('🚀 [db-prepare] Detected PostgreSQL DATABASE_URL. Syncing Prisma schema...');
  try {
    execSync('npx prisma db push --accept-data-loss', { stdio: 'inherit' });
    console.log('✓ [db-prepare] Prisma db push completed successfully.');
  } catch (pushErr) {
    console.error('❌ [db-prepare] Failed to push schema to PostgreSQL:', pushErr);
    throw pushErr;
  }

  const prisma = new PrismaClient();
  try {
    const adminCount = await prisma.adminUser.count();
    console.log(`📊 [db-prepare] Current AdminUser count: ${adminCount}`);

    if (adminCount === 0) {
      console.log('🌱 [db-prepare] Database is empty (0 admins). Running idempotent seed...');
      execSync('npx tsx prisma/seed.ts', { stdio: 'inherit' });
      console.log('✓ [db-prepare] Database idempotent seed completed successfully.');
    } else {
      console.log('✅ [db-prepare] Database already initialized with AdminUser. Skipping initial seed.');
    }
  } catch (seedErr) {
    console.error('❌ [db-prepare] Error checking/seeding database:', seedErr);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error('Fatal error in db-prepare:', err);
  process.exit(1);
});
