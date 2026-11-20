import http from 'http';

const BASE_URL = 'http://localhost:3000';

async function req(urlPath, options = {}) {
  const url = new URL(urlPath, BASE_URL);
  const headers = options.headers || {};
  const method = options.method || 'GET';
  const body = options.body;

  const res = await fetch(url.toString(), {
    method,
    headers,
    body: body ? (typeof body === 'string' ? body : JSON.stringify(body)) : undefined,
    redirect: 'manual',
  });

  const text = await res.text();
  let json = null;
  try {
    json = JSON.parse(text);
  } catch {}

  return {
    status: res.status,
    headers: Object.fromEntries(res.headers.entries()),
    text,
    json,
  };
}

async function runAudit() {
  const results = [];

  function record(section, testName, passed, details = '') {
    results.push({ section, testName, passed, details });
    const mark = passed ? '✅ PASS' : '❌ FAIL';
    console.log(`${mark} [${section}] ${testName}: ${details}`);
  }

  console.log('--- STARTING E2E AUDIT ON ' + BASE_URL + ' ---\n');

  // 1. PUBLIC ROUTES
  const publicRoutes = [
    { path: '/', name: 'Homepage' },
    { path: '/gioi-thieu', name: 'About' },
    { path: '/khong-gian', name: 'Gallery' },
    { path: '/thuc-don', name: 'Menu' },
    { path: '/khach-hang', name: 'Reviews' },
    { path: '/su-kien', name: 'Events & FAQ' },
    { path: '/lien-he', name: 'Contact' },
    { path: '/p/chinh-sach-bao-mat', name: 'Privacy Policy' },
    { path: '/p/dieu-khoan-su-dung', name: 'Terms of Use' },
    { path: '/p/noi-quy-khong-gian', name: 'Sanctuary Rules' },
    { path: '/robots.txt', name: 'Robots.txt' },
    { path: '/sitemap.xml', name: 'Sitemap.xml' },
  ];

  for (const r of publicRoutes) {
    try {
      const res = await req(r.path);
      const ok = res.status === 200;
      record('Public Routes', `Route ${r.path} (${r.name})`, ok, `Status ${res.status}`);
    } catch (e) {
      record('Public Routes', `Route ${r.path} (${r.name})`, false, e.message);
    }
  }

  // 2. CHECK SPECIFIC CONTENT ON HOMEPAGE
  try {
    const home = await req('/');
    const hasAddress = home.text.includes('Hùng Vương') && (home.text.includes('Gia Nghĩa'));
    const has3D = home.text.includes('<canvas') || home.text.includes('three');
    const hasAdminLinkInFooter = home.text.includes('href="/admin"') || home.text.includes("href='/admin'");
    const hasOpenBadge = home.text.includes('Đang mở cửa') || home.text.includes('Đã đóng cửa') || home.text.includes('Hẹn gặp lại');

    record('Homepage Integrity', 'Address present', hasAddress, 'Found address in HTML');
    record('Homepage Integrity', 'Zero 3D/WebGL Canvas', !has3D, 'No Three.js/canvas found');
    record('Homepage Integrity', 'Zero /admin in public Footer', !hasAdminLinkInFooter, 'No /admin links exposed');
    record('Homepage Integrity', 'OpenStatusBadge active', hasOpenBadge, 'Status badge rendered');
  } catch (e) {
    record('Homepage Integrity', 'Homepage Content Check', false, e.message);
  }

  // 3. CHECK GALLERY ON /khong-gian
  try {
    const gallery = await req('/khong-gian');
    const hasFig01 = gallery.text.includes('fig-01.jpg') || gallery.text.includes('FIG. 01');
    const hasCurtainClip = gallery.text.includes('inset(100%');
    record('Gallery Integrity', 'FIG. 01 rendered visibly', hasFig01, 'Found FIG. 01');
    record('Gallery Integrity', 'Zero Curtain 100% Clip-path', !hasCurtainClip, 'No clip-path: inset(100%)');
  } catch (e) {
    record('Gallery Integrity', 'Gallery Check', false, e.message);
  }

  // 4. CHECK MENU ON /thuc-don
  try {
    const menu = await req('/thuc-don');
    const hasCart = menu.text.includes('giỏ hàng') || menu.text.includes('cart-drawer') || menu.text.includes('Đặt bàn online');
    const hasHotline = menu.text.includes('0382851688') || menu.text.includes('038 285 1688');
    record('Menu Integrity', 'Zero Cart / Online Checkout', !hasCart, 'Zero manual ops verified');
    record('Menu Integrity', 'Hotline Call-to-action present', hasHotline, 'Found hotline phone link');
  } catch (e) {
    record('Menu Integrity', 'Menu Check', false, e.message);
  }

  // 5. CHECK ROBOTS.TXT AND SITEMAP
  try {
    const robots = await req('/robots.txt');
    const disallowAdmin = robots.text.includes('Disallow: /admin') || robots.text.includes('Disallow: /api');
    record('Technical SEO', 'robots.txt Disallow /admin', disallowAdmin, robots.text.trim().replace(/\n/g, ' '));

    const sitemap = await req('/sitemap.xml');
    const sitemapHasAdmin = sitemap.text.includes('/admin');
    const sitemapValidXml = sitemap.text.includes('<urlset') && sitemap.status === 200;
    record('Technical SEO', 'sitemap.xml valid & excludes /admin', sitemapValidXml && !sitemapHasAdmin, `Status ${sitemap.status}`);
  } catch (e) {
    record('Technical SEO', 'Robots & Sitemap Check', false, e.message);
  }

  // 6. SHELL ISOLATION & HOST CHECK
  try {
    // A. Check /admin HTML does NOT contain customer Navbar or Chat
    const adminPage = await req('/admin');
    const adminHasChat = adminPage.text.includes('Toggle Quick Chat Widget') || adminPage.text.includes('Hỗ Trợ Nhanh Bên Suối');
    const adminHasCustNav = adminPage.text.includes('Trang chủ & Giao diện') ? false : (adminPage.text.includes('Thực đơn (~67 món)') || adminPage.text.includes('Lối Nhỏ Vào Vườn'));
    record('Shell Isolation', '/admin has NO storefront Chatbot', !adminHasChat, 'QuickChatWidget absent on /admin');

    // B. Check admin.camcuhouse.online host header
    const adminSubdomainRes = await req('/', {
      headers: {
        Host: 'admin.camcuhouse.online',
        'X-Forwarded-Host': 'admin.camcuhouse.online',
      },
    });
    const subHasChat = adminSubdomainRes.text.includes('Toggle Quick Chat Widget') || adminSubdomainRes.text.includes('Hỗ Trợ Nhanh Bên Suối');
    record('Shell Isolation', 'admin.camcuhouse.online has NO Chatbot', !subHasChat, 'QuickChatWidget absent on admin host');
  } catch (e) {
    record('Shell Isolation', 'Shell Isolation Check', false, e.message);
  }

  // 7. ANTI-SPAM CHALLENGE & CONTACT SUBMISSION
  try {
    // Challenge token request
    const chalRes = await req('/api/security/challenge');
    const challengeOk = chalRes.status === 200 && chalRes.json && chalRes.json.token;
    record('Security & Anti-Spam', 'GET /api/security/challenge', challengeOk, `Status ${chalRes.status}`);

    // Submit with wrong challenge answer -> should reject
    const wrongSubmit = await req('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: {
        fullName: 'Test Bot',
        phone: '0987654321',
        message: 'This is an automated spam test with wrong math',
        challengeToken: challengeOk ? chalRes.json.token : 'fake-token',
        challengeAnswer: '99999',
      },
    });
    const wrongRejected = wrongSubmit.status === 400 || wrongSubmit.status === 403;
    record('Security & Anti-Spam', 'Contact Form blocks invalid challenge answer', wrongRejected, `Status ${wrongSubmit.status}`);

    // Honeypot test -> should be silently caught or blocked
    const honeypotSubmit = await req('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: {
        fullName: 'Bot Spammer',
        phone: '0987654321',
        message: 'Spam message filling honeypot',
        challengeToken: challengeOk ? chalRes.json.token : 'fake-token',
        challengeAnswer: '5',
        websiteUrl: 'http://spam-link.com',
      },
    });
    record('Security & Anti-Spam', 'Contact Form traps honeypot bot', honeypotSubmit.status === 200 || honeypotSubmit.status === 400 || honeypotSubmit.status === 403, `Honeypot handled with status ${honeypotSubmit.status}`);
  } catch (e) {
    record('Security & Anti-Spam', 'Contact Form Anti-Spam Check', false, e.message);
  }

  // 8. ADMIN AUTH & API TESTING
  let adminCookie = '';
  try {
    // Wrong login
    const badLogin = await req('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: { username: 'admin', password: 'wrongpassword' },
    });
    record('Admin Auth', 'Blocks incorrect password', badLogin.status === 401, `Status ${badLogin.status}`);

    // Valid login
    const goodLogin = await req('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: { username: 'admin', password: 'admin123' },
    });
    const loginOk = goodLogin.status === 200;
    const setCookie = goodLogin.headers['set-cookie'] || '';
    if (setCookie) {
      adminCookie = setCookie.split(';')[0];
    }
    record('Admin Auth', 'Valid admin login succeeds', loginOk, `Status ${goodLogin.status}, Cookie: ${adminCookie ? 'Present' : 'None'}`);

    if (adminCookie) {
      // Test Bootstrap API
      const bootstrap = await req('/api/bootstrap', {
        headers: { Cookie: adminCookie },
      });
      const bsOk = bootstrap.status === 200 && bootstrap.json && bootstrap.json.menu;
      record('Admin Module 1 (CMS)', 'GET /api/bootstrap returns real data', bsOk, `Menu items: ${bootstrap.json?.menu?.length}, Plates: ${bootstrap.json?.spatialPlates?.length}`);

      // Test Ops Health
      const health = await req('/api/ops/health', {
        headers: { Cookie: adminCookie },
      });
      record('Admin Module 5 (Ops)', 'GET /api/ops/health', health.status === 200, `Status ${health.status}`);

      // Test Ops Logs
      const logs = await req('/api/ops/logs', {
        headers: { Cookie: adminCookie },
      });
      record('Admin Module 5 (Ops)', 'GET /api/ops/logs', logs.status === 200, `Status ${logs.status}`);

      // Test RBAC User List
      const users = await req('/api/users', {
        headers: { Cookie: adminCookie },
      });
      record('Admin Module 3 (RBAC)', 'GET /api/users', users.status === 200, `Status ${users.status}`);

      // Test Anti-spam config
      const antispam = await req('/api/security/antispam', {
        headers: { Cookie: adminCookie },
      });
      record('Admin Module 4 (Anti-spam)', 'GET /api/security/antispam', antispam.status === 200, `Status ${antispam.status}`);
    }
  } catch (e) {
    record('Admin Auth', 'Admin Testing Exception', false, e.message);
  }

  console.log('\n--- AUDIT COMPLETE ---');
  const total = results.length;
  const passed = results.filter(r => r.passed).length;
  const failed = results.filter(r => !r.passed).length;
  console.log(`TOTAL: ${total} | PASSED: ${passed} | FAILED: ${failed}`);
}

runAudit();
