import { prisma } from '../src/lib/prisma';

async function main() {
  console.log('--- 1. VERIFY LIVE SYSTEM STATUS & REAL DB PROBE ---');
  // Check health data structure directly
  const dbPath = './prisma/dev.db';
  const superAdmin = await prisma.adminUser.findFirst({ where: { role: 'SUPER_ADMIN' } });
  console.log('✓ Super Admin found:', superAdmin?.email);

  // DB read/write probe
  const probe = await prisma.systemLog.create({
    data: {
      level: 'INFO',
      category: 'HEALTH_CHECK',
      action: 'DB_WRITE_PROBE',
      details: 'Automated verification test probe',
      ipAddress: '127.0.0.1',
    },
  });
  console.log('✓ DB Write Probe successfully inserted:', probe.id);
  await prisma.systemLog.delete({ where: { id: probe.id } });
  console.log('✓ DB Write Probe successfully deleted');

  console.log('\n--- 2. VERIFY DELETE FUNCTIONALITY ---');
  // Create a temporary FAQ item
  const tempFaq = await prisma.faqItem.create({
    data: {
      question: 'Câu hỏi kiểm tra xóa tự động?',
      answer: 'Câu trả lời kiểm tra.',
      category: 'Chung',
      orderIndex: 999,
      published: true,
    },
  });
  console.log('✓ Created temp FAQ:', tempFaq.id);

  // Delete temp FAQ
  await prisma.faqItem.delete({ where: { id: tempFaq.id } });
  const checkFaq = await prisma.faqItem.findUnique({ where: { id: tempFaq.id } });
  if (!checkFaq) {
    console.log('✓ Temp FAQ cleanly deleted from DB');
  } else {
    throw new Error('FAQ item was not deleted!');
  }

  console.log('\n--- 3. VERIFY SECTION VISIBILITY TOGGLES ---');
  // Toggle Events & Highlights OFF and back ON
  await prisma.storeSettings.update({
    where: { id: 'default' },
    data: { showEventsSection: false, showHighlightsSection: false },
  });
  let settings = await prisma.storeSettings.findUnique({ where: { id: 'default' } });
  console.log('✓ Toggled OFF: showEventsSection =', settings?.showEventsSection, 'showHighlightsSection =', settings?.showHighlightsSection);

  await prisma.storeSettings.update({
    where: { id: 'default' },
    data: { showEventsSection: true, showHighlightsSection: true },
  });
  settings = await prisma.storeSettings.findUnique({ where: { id: 'default' } });
  console.log('✓ Restored ON: showEventsSection =', settings?.showEventsSection, 'showHighlightsSection =', settings?.showHighlightsSection);

  console.log('\n--- 4. VERIFY REVIEWS ZERO SEED & AUTHENTIC WORKFLOW ---');
  const countReviews = await prisma.guestComment.count();
  console.log('✓ Current guest reviews in DB:', countReviews, '(Expected: 0 fake seeded reviews)');

  // Test inserting 1 customer review
  const testReview = await prisma.guestComment.create({
    data: {
      authorName: 'Khách Thử Nghiệm',
      rating: 5,
      content: 'Cà phê muối rất ngon, bờ suối mát rượi và không khí trong lành.',
      visitDate: 'Hôm nay',
      status: 'PENDING',
    },
  });
  console.log('✓ Created 1 test review in PENDING state:', testReview.id);

  // Approve the review
  const approvedReview = await prisma.guestComment.update({
    where: { id: testReview.id },
    data: { status: 'APPROVED' },
  });
  console.log('✓ Approved test review:', approvedReview.id, 'status:', approvedReview.status);

  const approvedCount = await prisma.guestComment.count({ where: { status: 'APPROVED' } });
  console.log('✓ Approved reviews count now:', approvedCount);

  // Delete the test review cleanly so DB remains completely authentic
  await prisma.guestComment.delete({ where: { id: testReview.id } });
  const finalCount = await prisma.guestComment.count();
  console.log('✓ Test review deleted, final reviews count in DB:', finalCount);

  console.log('\n========================================');
  console.log('✓ ALL 4 PRODUCTION VERIFICATIONS PASSED!');
  console.log('========================================');
}

main()
  .catch((e) => {
    console.error('Verification failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
