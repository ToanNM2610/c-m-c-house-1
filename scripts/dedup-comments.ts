import { prisma } from '../src/lib/prisma';

async function main() {
  console.log('🧹 Starting GuestComment deduplication...');

  const allComments = await prisma.guestComment.findMany({
    orderBy: { createdAt: 'asc' },
  });

  const seen = new Set<string>();
  const duplicates: string[] = [];

  for (const c of allComments) {
    // Generate unique signature based on authorName and content
    const sig = `${c.authorName.trim().toLowerCase()}|${c.content.trim().toLowerCase()}`;
    if (seen.has(sig)) {
      duplicates.push(c.id);
    } else {
      seen.add(sig);
    }
  }

  if (duplicates.length > 0) {
    console.log(`Found ${duplicates.length} duplicate review(s) to remove:`, duplicates);
    await prisma.guestComment.deleteMany({
      where: { id: { in: duplicates } },
    });
    console.log('✓ Duplicate reviews deleted successfully.');
  } else {
    console.log('✓ No duplicate reviews found.');
  }

  // Ensure default StoreSettings has reviewDisplayMode and reviewAutoIntervalSec set
  const settings = await prisma.storeSettings.findUnique({
    where: { id: 'default' },
  });

  if (settings) {
    await prisma.storeSettings.update({
      where: { id: 'default' },
      data: {
        reviewDisplayMode: (settings as any).reviewDisplayMode || 'AUTO_RANDOM',
        reviewAutoIntervalSec: (settings as any).reviewAutoIntervalSec || 6,
      },
    });
    console.log('✓ StoreSettings updated with reviewDisplayMode: AUTO_RANDOM, reviewAutoIntervalSec: 6');
  }

  // Count remaining unique approved comments
  const remainingApproved = await prisma.guestComment.findMany({
    where: { status: 'APPROVED' },
    orderBy: { createdAt: 'desc' },
  });

  console.log(`✓ Total remaining approved comments: ${remainingApproved.length}`);
  for (const c of remainingApproved) {
    console.log(`  - [${c.id}] ${c.authorName} (${c.rating}★, isFeatured: ${c.isFeatured}): "${c.content.slice(0, 40)}..."`);
  }
}

main()
  .catch((e) => {
    console.error('Deduplication failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

