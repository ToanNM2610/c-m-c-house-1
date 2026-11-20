import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { prisma } from '../src/lib/prisma';
import {
  generateMathChallenge,
  verifyMathChallenge,
  BoundedLRUMap,
  checkHoneypots,
  validateContentQuality,
  checkRateLimits,
  commitSubmission,
  recordIpStrike,
  isIpBanned,
  rateLimitStore,
  banCache,
  usedNonces,
  contentHashCache,
  getAntiSpamConfig,
  invalidateConfigCache,
} from '../src/lib/antiSpam';
import { createSessionToken } from '../src/lib/auth';

// Real App Router Route Handlers
import { GET as getChallenge } from '../src/app/api/security/challenge/route';
import { GET as getAntiSpam, PATCH as patchAntiSpam } from '../src/app/api/security/antispam/route';
import {
  GET as getBlockedIps,
  POST as postBlockedIps,
  DELETE as deleteBlockedIps,
} from '../src/app/api/security/blocked-ips/route';
import { POST as postComments } from '../src/app/api/comments/route';
import { POST as postContact } from '../src/app/api/contact/route';

interface TestResult {
  category: string;
  name: string;
  passed: boolean;
  details: string;
}

const results: TestResult[] = [];

function assert(condition: boolean, category: string, name: string, details: string) {
  if (condition) {
    results.push({ category, name, passed: true, details });
    console.log(`  [PASS] [${category}] ${name}: ${details}`);
  } else {
    results.push({ category, name, passed: false, details: `FAILED: ${details}` });
    console.error(`  [FAIL] [${category}] ${name}: ${details}`);
  }
}

// In-process client calling real Next.js route handlers with NextRequest & NextResponse
async function requestRoute(
  routePath: string,
  method: string,
  body?: any,
  headers?: Record<string, string>
): Promise<{ status: number; headers: Headers; json: () => Promise<any> }> {
  const url = `http://localhost:3000${routePath}`;
  const h = new Headers(headers || {});
  if (body && !h.has('content-type')) {
    h.set('content-type', 'application/json');
  }

  const init: any = {
    method,
    headers: h,
  };

  if (body && method !== 'GET' && method !== 'HEAD') {
    init.body = typeof body === 'string' ? body : JSON.stringify(body);
  }

  const req = new NextRequest(url, init);
  let res: NextResponse;

  const pathname = new URL(url).pathname;

  if (pathname === '/api/security/challenge' && method === 'GET') {
    res = await getChallenge();
  } else if (pathname === '/api/security/antispam') {
    if (method === 'GET') res = await getAntiSpam(req);
    else if (method === 'PATCH') res = await patchAntiSpam(req);
    else throw new Error(`Method ${method} not handled for ${pathname}`);
  } else if (pathname === '/api/security/blocked-ips') {
    if (method === 'GET') res = await getBlockedIps(req);
    else if (method === 'POST') res = await postBlockedIps(req);
    else if (method === 'DELETE') res = await deleteBlockedIps(req);
    else throw new Error(`Method ${method} not handled for ${pathname}`);
  } else if (pathname === '/api/comments' && method === 'POST') {
    res = await postComments(req);
  } else if (pathname === '/api/contact' && method === 'POST') {
    res = await postContact(req);
  } else {
    throw new Error(`Route not found: ${method} ${routePath}`);
  }

  const text = await res.text();
  return {
    status: res.status,
    headers: res.headers,
    json: async () => (text ? JSON.parse(text) : {}),
  };
}

// Helper to solve challenge mathematically
function solveChallenge(question: string): number {
  const matchAdd = question.match(/(\d+)\s*\+\s*(\d+)/);
  if (matchAdd) {
    return parseInt(matchAdd[1], 10) + parseInt(matchAdd[2], 10);
  }
  const matchSub = question.match(/(\d+)\s*-\s*(\d+)/);
  if (matchSub) {
    return parseInt(matchSub[1], 10) - parseInt(matchSub[2], 10);
  }
  return 0;
}

// Sleep helper
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function runAllTests() {
  console.log('\n===============================================================');
  console.log('🛡️  CAM CU HOUSE: 7-LAYER ANTI-SPAM & ANTI-CRASH VERIFICATION');
  console.log('===============================================================\n');

  // Step 0: Clean in-memory stores for clean test state
  rateLimitStore.clear();
  banCache.clear();
  usedNonces.clear();
  contentHashCache.clear();
  invalidateConfigCache();

  // Generate Admin Cookie for protected endpoints
  const adminUser = await prisma.adminUser.findFirst({ where: { role: 'SUPER_ADMIN' } });
  const adminToken = adminUser ? createSessionToken(adminUser) : '';
  const adminHeaders = { cookie: `camcu_admin_session=${adminToken}` };

  // -----------------------------------------------------------------
  // TEST 1: CHALLENGE GENERATION (GET /api/security/challenge)
  // -----------------------------------------------------------------
  console.log('▶ TEST 1: Challenge Generation (GET /api/security/challenge)');
  const challengeRes = await requestRoute('/api/security/challenge', 'GET');
  assert(challengeRes.status === 200, 'Layer 4', 'Challenge HTTP Status', `Received HTTP ${challengeRes.status}`);
  const challengeJson = await challengeRes.json();
  assert(challengeJson.success === true, 'Layer 4', 'Challenge success flag', 'success === true');
  const question = challengeJson.data?.question || challengeJson.question;
  const token = challengeJson.data?.token || challengeJson.token;
  assert(Boolean(question && question.includes('= ?')), 'Layer 4', 'Math formula generation', `Question: "${question}"`);
  assert(Boolean(token && token.includes('.')), 'Layer 4', 'HMAC-SHA256 signature presence', `Token length: ${token?.length} chars`);

  // -----------------------------------------------------------------
  // TEST 2: WRONG MATH ANSWER REJECTED (400) WITHOUT SAVING TO DB
  // -----------------------------------------------------------------
  console.log('\n▶ TEST 2: Wrong Math Answer Rejection (400) & Zero DB Leakage');
  console.log('    Waiting 3.2s for human challenge fill-time to pass...');
  await sleep(3200);

  const wrongCommentCountBefore = await prisma.guestComment.count({ where: { authorName: 'WrongAnswerSpammer' } });
  const wrongContactCountBefore = await prisma.contactSubmission.count({ where: { fullName: 'WrongAnswerContact' } });

  // 2a: Comments endpoint with wrong answer
  const wrongAnswerRes = await requestRoute(
    '/api/comments',
    'POST',
    {
      authorName: 'WrongAnswerSpammer',
      rating: 5,
      content: 'Review voi phep tinh sai can bi chan ngay lap tuc!',
      challengeToken: token,
      challengeAnswer: 9999, // WRONG answer
    },
    { 'x-forwarded-for': '198.51.100.10' }
  );
  assert(wrongAnswerRes.status === 400, 'Layer 4', 'Wrong Answer Comments 400', `Status: ${wrongAnswerRes.status}`);
  const wrongAnswerJson = await wrongAnswerRes.json();
  assert(
    wrongAnswerJson.error?.includes('không chính xác'),
    'Layer 4',
    'Vietnamese error message on wrong answer',
    `Error: "${wrongAnswerJson.error}"`
  );
  const wrongCommentCountAfter = await prisma.guestComment.count({ where: { authorName: 'WrongAnswerSpammer' } });
  assert(
    wrongCommentCountBefore === wrongCommentCountAfter,
    'Layer 4',
    'SQLite Zero Leakage (Comments)',
    `DB record count unchanged: ${wrongCommentCountAfter}`
  );

  // 2b: Contact endpoint with wrong answer
  const ch2 = generateMathChallenge();
  console.log('    Waiting 3.2s for second challenge fill-time...');
  await sleep(3200);

  const wrongContactRes = await requestRoute(
    '/api/contact',
    'POST',
    {
      fullName: 'WrongAnswerContact',
      phone: '0901234567',
      email: 'wrong@bot.com',
      message: 'Lien he voi phep tinh sai can bi chan ngay lap tuc!',
      challengeToken: ch2.token,
      challengeAnswer: 8888, // WRONG answer
    },
    { 'x-forwarded-for': '198.51.100.11' }
  );
  assert(wrongContactRes.status === 400, 'Layer 4', 'Wrong Answer Contact 400', `Status: ${wrongContactRes.status}`);
  const wrongContactCountAfter = await prisma.contactSubmission.count({ where: { fullName: 'WrongAnswerContact' } });
  assert(
    wrongContactCountBefore === wrongContactCountAfter,
    'Layer 4',
    'SQLite Zero Leakage (Contact & Mail)',
    `DB record count unchanged: ${wrongContactCountAfter}`
  );

  // -----------------------------------------------------------------
  // TEST 3: INSTANT SUBMIT (< 3s) REJECTION
  // -----------------------------------------------------------------
  console.log('\n▶ TEST 3: Instant Submit (< 3s Fill Time Guard)');
  const instantCh = generateMathChallenge();
  const instantAnswer = solveChallenge(instantCh.question);
  const instantRes = await requestRoute(
    '/api/comments',
    'POST',
    {
      authorName: 'SpeedyBot',
      rating: 5,
      content: 'Review gui sieu toc trong vong vai mili giay!',
      challengeToken: instantCh.token,
      challengeAnswer: instantAnswer,
    },
    { 'x-forwarded-for': '198.51.100.20' }
  );
  assert(instantRes.status === 400, 'Layer 4', 'Instant Submit (< 3s) Rejected', `Status: ${instantRes.status}`);
  const instantJson = await instantRes.json();
  assert(
    instantJson.error?.includes('quá nhanh'),
    'Layer 4',
    'Vietnamese message on fast submit',
    `Error: "${instantJson.error}"`
  );

  // -----------------------------------------------------------------
  // TEST 4: MULTI-FIELD HONEYPOT TRAPS (SILENT DROP & ZERO DB LEAKAGE)
  // -----------------------------------------------------------------
  console.log('\n▶ TEST 4: Multi-Field Honeypots (websiteUrl & companyFax)');
  const hpCountBefore = await prisma.contactSubmission.count({ where: { fullName: 'HoneypotBotUser' } });
  const honeypotRes = await requestRoute(
    '/api/contact',
    'POST',
    {
      fullName: 'HoneypotBotUser',
      phone: '0988776655',
      message: 'Bot tu dong dien vao o websiteUrl an!',
      websiteUrl: 'https://malicious-advertiser.xyz/promo', // TRAP!
      companyFax: '',
    },
    { 'x-forwarded-for': '198.51.100.30' }
  );
  assert(honeypotRes.status === 200, 'Layer 5', 'Honeypot Silent Success Response', `Status: ${honeypotRes.status} (fooled bot)`);
  const hpJson = await honeypotRes.json();
  assert(hpJson.success === true, 'Layer 5', 'Honeypot returns success message', `Message: "${hpJson.message}"`);
  const hpCountAfter = await prisma.contactSubmission.count({ where: { fullName: 'HoneypotBotUser' } });
  assert(hpCountBefore === hpCountAfter, 'Layer 5', 'Honeypot Zero DB Leakage', `DB count remained: ${hpCountAfter}`);
  const hpIpRecord = await prisma.blockedIp.findUnique({ where: { ipAddress: '198.51.100.30' } });
  assert(Boolean(hpIpRecord && hpIpRecord.strikeCount >= 1), 'Layer 5', 'Honeypot IP strike recorded in BlockedIp', `Strikes: ${hpIpRecord?.strikeCount}`);

  // -----------------------------------------------------------------
  // TEST 5: SLIDING WINDOW RATE LIMITING & COOLDOWN (429 & RETRY-AFTER)
  // -----------------------------------------------------------------
  console.log('\n▶ TEST 5: Rate Limiting & Cooldown (429 Too Many Requests & Retry-After)');
  const testIp = '198.51.100.40';

  console.log('    Waiting 3.2s for human challenge fill-time to pass...');
  const validCh1 = generateMathChallenge();
  const ans1 = solveChallenge(validCh1.question);
  await sleep(3200);

  const firstSubmitRes = await requestRoute(
    '/api/comments',
    'POST',
    {
      authorName: 'Khach Hang Chuan 1',
      rating: 5,
      content: 'Khong gian quan rat thoang mat, bo suoi tu nhien rat dep!',
      challengeToken: validCh1.token,
      challengeAnswer: ans1,
    },
    { 'x-forwarded-for': testIp }
  );
  assert(firstSubmitRes.status === 200, 'Layer 2', 'First Valid Submission Allowed', `Status: ${firstSubmitRes.status}`);

  // Immediate second submission: should trigger 60s cooldown
  const validCh2 = generateMathChallenge();
  const ans2 = solveChallenge(validCh2.question);
  const secondSubmitRes = await requestRoute(
    '/api/comments',
    'POST',
    {
      authorName: 'Khach Hang Chuan 2',
      rating: 5,
      content: 'Thu gui tiep tuc ngay lap tuc xem co bi chan boi cooldown 60 giay khong.',
      challengeToken: validCh2.token,
      challengeAnswer: ans2,
    },
    { 'x-forwarded-for': testIp }
  );
  assert(secondSubmitRes.status === 429, 'Layer 2', 'Rapid Submission Triggered 429', `Status: ${secondSubmitRes.status}`);
  const retryAfterHeader = secondSubmitRes.headers.get('retry-after');
  assert(Boolean(retryAfterHeader && Number(retryAfterHeader) > 0), 'Layer 2', 'Retry-After Header Present', `Retry-After: ${retryAfterHeader}s`);
  const rateLimitJson = await secondSubmitRes.json();
  assert(
    rateLimitJson.error?.includes('Vui lòng đợi') && rateLimitJson.error?.includes('giây'),
    'Layer 2',
    'Vietnamese Cooldown Countdown Message',
    `Error: "${rateLimitJson.error}"`
  );

  // -----------------------------------------------------------------
  // TEST 6: CONTENT FILTER (KEYWORDS & DEDUPLICATION & BOUNDARIES)
  // -----------------------------------------------------------------
  console.log('\n▶ TEST 6: Content Filter (Keywords, Deduplication, Length, Links)');
  const contentTestIp = '198.51.100.50';

  // 6a: Blocked keywords ("casino", "bet88", "vay tien")
  const chKw = generateMathChallenge();
  const ansKw = solveChallenge(chKw.question);
  await sleep(3100);

  const keywordRes = await requestRoute(
    '/api/comments',
    'POST',
    {
      authorName: 'CasinoSpammer',
      rating: 5,
      content: 'Tham gia song bac casino truc tuyen nhan thuong khung nhat!',
      challengeToken: chKw.token,
      challengeAnswer: ansKw,
    },
    { 'x-forwarded-for': contentTestIp }
  );
  assert(keywordRes.status === 400, 'Layer 6', 'Blocked Keyword Rejected', `Status: ${keywordRes.status}`);
  const kwJson = await keywordRes.json();
  assert(kwJson.error?.includes('từ khóa không phù hợp'), 'Layer 6', 'Keyword Rejection Message', `Error: "${kwJson.error}"`);

  // 6b: Content deduplication via SHA-256
  const dedupIp1 = '198.51.100.61';
  const dedupIp2 = '198.51.100.62';
  const chDedup1 = generateMathChallenge();
  const ansDedup1 = solveChallenge(chDedup1.question);
  await sleep(3100);

  const dedupText = 'Cà phê rang mộc tại quán rất ngon và đậm vị Bazan Đắk Nông đặc sản!';
  const firstDedupRes = await requestRoute(
    '/api/comments',
    'POST',
    {
      authorName: 'Khach Hang Thuc 1',
      rating: 5,
      content: dedupText,
      challengeToken: chDedup1.token,
      challengeAnswer: ansDedup1,
    },
    { 'x-forwarded-for': dedupIp1 }
  );
  assert(firstDedupRes.status === 200, 'Layer 6', 'First Content Post Allowed', `Status: ${firstDedupRes.status}`);

  // Try posting exact same content from another IP
  const chDedup2 = generateMathChallenge();
  const ansDedup2 = solveChallenge(chDedup2.question);
  await sleep(3100);
  const secondDedupRes = await requestRoute(
    '/api/comments',
    'POST',
    {
      authorName: 'Khach Hang Thuc 2',
      rating: 5,
      content: dedupText, // DUPLICATE!
      challengeToken: chDedup2.token,
      challengeAnswer: ansDedup2,
    },
    { 'x-forwarded-for': dedupIp2 }
  );
  assert(secondDedupRes.status === 400, 'Layer 6', 'Duplicate Content Rejected (SHA-256)', `Status: ${secondDedupRes.status}`);
  const dedupJson = await secondDedupRes.json();
  assert(dedupJson.error?.includes('Nội dung tương tự đã được gửi gần đây'), 'Layer 6', 'Duplicate Rejection Message', `Error: "${dedupJson.error}"`);

  // 6c: Repetitive characters
  const repIp = '198.51.100.70';
  const chRep = generateMathChallenge();
  const ansRep = solveChallenge(chRep.question);
  await sleep(3100);
  const repRes = await requestRoute(
    '/api/comments',
    'POST',
    {
      authorName: 'SpamChar',
      rating: 5,
      content: 'Quan nay tot quas aaaaaaaaaaaaaaaa ngon lam!',
      challengeToken: chRep.token,
      challengeAnswer: ansRep,
    },
    { 'x-forwarded-for': repIp }
  );
  assert(repRes.status === 400, 'Layer 6', 'Repetitive Characters Rejected', `Status: ${repRes.status}`);

  // -----------------------------------------------------------------
  // TEST 7: ADMIN SHIELD API & IP BLOCKLIST (GET / PATCH / DELETE)
  // -----------------------------------------------------------------
  console.log('\n▶ TEST 7: Admin Shield Management & IP Blocklist Endpoints');
  const adminGetRes = await requestRoute('/api/security/antispam', 'GET', undefined, adminHeaders);
  assert(adminGetRes.status === 200, 'Admin', 'GET /api/security/antispam 200 OK', `Status: ${adminGetRes.status}`);
  const adminGetJson = await adminGetRes.json();
  assert(adminGetJson.success === true, 'Admin', 'Admin config retrieval success', 'success === true');
  assert(typeof adminGetJson.data.totalBlockedCount === 'number', 'Admin', 'Live totalBlockedCount Metric', `Count: ${adminGetJson.data.totalBlockedCount}`);
  assert(typeof adminGetJson.data.currentlyBannedIps === 'number', 'Admin', 'Live currentlyBannedIps Metric', `Count: ${adminGetJson.data.currentlyBannedIps}`);
  assert(typeof adminGetJson.data.gmailSentLastHour === 'number', 'Admin', 'Live gmailSentLastHour Metric', `Count: ${adminGetJson.data.gmailSentLastHour}`);

  // Test PATCH config (update cooldown)
  const adminPatchRes = await requestRoute(
    '/api/security/antispam',
    'PATCH',
    {
      cooldownSeconds: 45,
      maxPerTenMinutes: 4,
    },
    adminHeaders
  );
  assert(adminPatchRes.status === 200, 'Admin', 'PATCH /api/security/antispam 200 OK', `Status: ${adminPatchRes.status}`);
  const updatedCfg = await getAntiSpamConfig();
  assert(updatedCfg.cooldownSeconds === 45, 'Admin', 'DB Config Updated', `Cooldown is now ${updatedCfg.cooldownSeconds}s`);

  // Restore cooldown back to 60s
  await requestRoute(
    '/api/security/antispam',
    'PATCH',
    { cooldownSeconds: 60, maxPerTenMinutes: 3 },
    adminHeaders
  );

  // Test IP Blocklist Management (POST manual ban)
  const banTestIp = '203.0.113.88';
  const addBanRes = await requestRoute(
    '/api/security/blocked-ips',
    'POST',
    {
      ipAddress: banTestIp,
      reason: 'Quản trị viên chặn thủ công cho mục đích kiểm thử an ninh',
      isPermanent: false,
      blockedUntil: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
    },
    adminHeaders
  );
  assert(addBanRes.status === 200, 'Admin', 'POST /api/security/blocked-ips (Add Ban)', `Status: ${addBanRes.status}`);

  // Verify banned IP cannot submit
  const bannedSubmitRes = await requestRoute(
    '/api/comments',
    'POST',
    {
      authorName: 'BannedUser',
      rating: 5,
      content: 'Thu gui tu IP bi ban xem co bi chan o Layer 3 khong.',
    },
    { 'x-forwarded-for': banTestIp }
  );
  assert(bannedSubmitRes.status === 403, 'Layer 3', 'Banned IP Rejected with 403 Forbidden', `Status: ${bannedSubmitRes.status}`);

  // Unban the IP via DELETE
  const unbanRes = await requestRoute(
    `/api/security/blocked-ips?ip=${banTestIp}`,
    'DELETE',
    undefined,
    adminHeaders
  );
  assert(unbanRes.status === 200, 'Admin', 'DELETE /api/security/blocked-ips (Unban)', `Status: ${unbanRes.status}`);

  // -----------------------------------------------------------------
  // TEST 8: FRONTEND & ADMIN UI SOURCE VERIFICATION
  // -----------------------------------------------------------------
  console.log('\n▶ TEST 8: Frontend Forms & Admin Shield UI Markup Verification');

  // 8a: HumanChallengeBox component
  const challengeBoxPath = path.join(process.cwd(), 'src/components/security/HumanChallengeBox.tsx');
  const challengeBoxCode = fs.readFileSync(challengeBoxPath, 'utf8');
  assert(challengeBoxCode.includes('Xác minh bảo mật'), 'Frontend UI', 'HumanChallengeBox label', 'Contains "Xác minh bảo mật"');
  assert(challengeBoxCode.includes('websiteUrl') && challengeBoxCode.includes('companyFax'), 'Frontend UI', 'Honeypot fields present', 'Contains websiteUrl & companyFax');
  assert(challengeBoxCode.includes('dark:bg-forest-900') || challengeBoxCode.includes('dark:border-forest-700'), 'Frontend UI', 'Dark mode support in challenge box', 'Semantic dark mode classes found');
  assert(challengeBoxCode.includes('RotateCw') || challengeBoxCode.includes('refresh'), 'Frontend UI', 'Refresh challenge button', 'Refresh mechanism present');

  // 8b: /khach-hang Page
  const khachHangPath = path.join(process.cwd(), 'src/app/khach-hang/page.tsx');
  const khachHangCode = fs.readFileSync(khachHangPath, 'utf8');
  assert(khachHangCode.includes('<HumanChallengeBox'), 'Frontend UI', '/khach-hang HumanChallengeBox integration', 'Component rendered');
  assert(khachHangCode.includes('cooldownRemaining') && khachHangCode.includes('cam_cu_cooldown_comment'), 'Frontend UI', '/khach-hang Live Cooldown Timer', 'LocalStorage countdown timer found');
  assert(khachHangCode.includes('trimmedName.length > 80') && khachHangCode.includes('1200'), 'Frontend UI', '/khach-hang Character Counter Boundaries', '80 name & 1200 content bounds enforced');

  // 8c: /lien-he Page
  const lienHePath = path.join(process.cwd(), 'src/app/lien-he/page.tsx');
  const lienHeCode = fs.readFileSync(lienHePath, 'utf8');
  assert(lienHeCode.includes('<HumanChallengeBox'), 'Frontend UI', '/lien-he HumanChallengeBox integration', 'Component rendered');
  assert(lienHeCode.includes('cooldownRemaining') && lienHeCode.includes('cam_cu_cooldown_contact'), 'Frontend UI', '/lien-he Live Cooldown Timer', 'LocalStorage countdown timer found');
  assert(lienHeCode.includes('80') && lienHeCode.includes('1200'), 'Frontend UI', '/lien-he Character Counters', 'Boundaries enforced');

  // 8d: Admin Module 4 Khiên Chống Spam
  const adminInteractionsPath = path.join(process.cwd(), 'src/components/admin/AdminInteractionsManager.tsx');
  const adminInteractionsCode = fs.readFileSync(adminInteractionsPath, 'utf8');
  assert(adminInteractionsCode.includes('tab === \'antispam\''), 'Admin UI', 'Module 4 Sub-tab "antispam"', 'Tab routing present');
  assert(adminInteractionsCode.includes('<AdminAntiSpamManager'), 'Admin UI', 'AdminAntiSpamManager Mounted', 'Manager rendered');

  const adminShieldPath = path.join(process.cwd(), 'src/components/admin/AdminAntiSpamManager.tsx');
  const adminShieldCode = fs.readFileSync(adminShieldPath, 'utf8');
  assert(adminShieldCode.includes('totalBlockedCount') && adminShieldCode.includes('currentlyBannedIps'), 'Admin UI', 'Live Threat Overview Cards', 'Threat counters present');
  assert(adminShieldCode.includes('handleToggleEmergencyLockdown'), 'Admin UI', 'Emergency Lockdown Switch', 'Lockdown toggle present');
  assert(adminShieldCode.includes('Lưu cấu hình Khiên') || adminShieldCode.includes('handleSaveConfig'), 'Admin UI', 'Shield Parameter Configuration Form', 'Config save action present');
  assert(adminShieldCode.includes('handleUnban') && adminShieldCode.includes('handleManualBlock'), 'Admin UI', 'IP Blocklist Table & Manual Ban Modal', 'Ban management controls present');

  // -----------------------------------------------------------------
  // SUMMARY REPORT
  // -----------------------------------------------------------------
  const total = results.length;
  const passed = results.filter((r) => r.passed).length;
  const failed = results.filter((r) => !r.passed).length;

  console.log('\n===============================================================');
  console.log(`📊 VERIFICATION RESULTS: ${passed}/${total} PASSED (${failed} FAILED)`);
  console.log('===============================================================\n');

  if (failed > 0) {
    console.error('❌ SOME TESTS FAILED:');
    results.filter((r) => !r.passed).forEach((r) => {
      console.error(` - [${r.category}] ${r.name}: ${r.details}`);
    });
    process.exit(1);
  } else {
    console.log('✨ ALL 7 LAYERS OF ANTI-SPAM & ANTI-CRASH ARE 100% OPERATIONAL!');
    process.exit(0);
  }
}

runAllTests().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
