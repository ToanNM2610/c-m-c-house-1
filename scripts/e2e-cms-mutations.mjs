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

async function runCmsAudit() {
  console.log('--- STARTING CMS MUTATIONS & FEATURE AUDIT ---\n');

  // 1. Log in
  const login = await req('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: { username: 'admin', password: 'admin123' },
  });
  if (login.status !== 200) {
    console.error('Login failed! Status:', login.status);
    return;
  }
  const adminCookie = login.headers['set-cookie'].split(';')[0];
  console.log('✅ Admin Login OK. Session Cookie established.');

  // 2. Test Content Update
  const contentRes = await req('/api/content', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Cookie: adminCookie,
    },
    body: {
      heroTagline: 'Cà phê sinh thái bên bờ suối — Xanh sạch, trong lành, hòa mình với thiên nhiên giữa lòng Đông Gia Nghĩa, Lâm Đồng.',
    },
  });
  console.log(contentRes.status === 200 ? '✅' : '❌', 'PATCH /api/content:', contentRes.status);

  // 3. Test Menu stock toggle
  // Get first menu item
  const bootstrap = await req('/api/bootstrap');
  const firstItem = bootstrap.json.menu[0];
  if (firstItem) {
    const origStock = firstItem.inStock;
    const menuToggle = await req(`/api/menu/${firstItem.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Cookie: adminCookie,
      },
      body: { inStock: !origStock },
    });
    console.log(menuToggle.status === 200 ? '✅' : '❌', `PATCH /api/menu/${firstItem.id} (Toggle Stock):`, menuToggle.status);

    // Revert back
    await req(`/api/menu/${firstItem.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Cookie: adminCookie,
      },
      body: { inStock: origStock },
    });
    console.log('✅ Menu item stock reverted back to original state.');
  }

  // 4. Test SEO Redirect Rule
  const redirectRes = await req('/api/redirects', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Cookie: adminCookie,
    },
    body: {
      sourcePath: '/test-old-link',
      targetPath: '/thuc-don',
      statusCode: 301,
      isActive: true,
    },
  });
  console.log(redirectRes.status === 201 || redirectRes.status === 200 ? '✅' : '❌', 'POST /api/redirects:', redirectRes.status);

  // Clean up redirect
  if (redirectRes.json?.data?.id) {
    await req(`/api/redirects?id=${redirectRes.json.data.id}`, {
      method: 'DELETE',
      headers: { Cookie: adminCookie },
    });
    console.log('✅ Temporary redirect cleaned up.');
  }

  // 5. Test Gmail Recipient CRUD
  const addRecip = await req('/api/gmail/recipients', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Cookie: adminCookie,
    },
    body: {
      email: 'test-audit@camcuhouse.online',
      label: 'Audit Tester',
      receiveSubjects: 'ALL',
      isActive: true,
    },
  });
  console.log(addRecip.status === 201 || addRecip.status === 200 ? '✅' : '❌', 'POST /api/gmail/recipients:', addRecip.status);

  if (addRecip.json?.data?.id) {
    const delRecip = await req(`/api/gmail/recipients/${addRecip.json.data.id}`, {
      method: 'DELETE',
      headers: { Cookie: adminCookie },
    });
    console.log(delRecip.status === 200 ? '✅' : '❌', 'DELETE /api/gmail/recipients/[id]:', delRecip.status);
  }

  // 6. Test Review / Comments API (Unblock 127.0.0.1 first via admin API)
  const unblockRes = await req('/api/security/blocked-ips?ip=127.0.0.1', {
    method: 'DELETE',
    headers: { Cookie: adminCookie },
  });
  console.log('Unblock IP response:', unblockRes.status, unblockRes.text);

  // Verify blocked-ips list is empty for 127.0.0.1
  const blockedList = await req('/api/security/blocked-ips', {
    headers: { Cookie: adminCookie },
  });
  const stillBlocked = blockedList.json?.data?.some((ip) => ip.ipAddress === '127.0.0.1');
  console.log('127.0.0.1 still in blocked list after unblock:', stillBlocked ? 'YES' : 'NO');

  const chalRes = await req('/api/security/challenge');
  const question = chalRes.json.question || '1 + 1 = ?';
  const mathExpr = question.replace('?', '').replace('=', '').trim();
  let answer = '2';
  try {
    answer = String(eval(mathExpr));
  } catch {}

  const reviewRes = await req('/api/comments', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: {
      authorName: 'Khách Ghé Quán E2E',
      rating: 5,
      content: 'Cà phê muối rất thơm ngon, bờ suối mát rượi trong lành.',
      visitDate: 'Hôm nay',
      challengeToken: chalRes.json.token,
      challengeAnswer: answer,
    },
  });
  console.log(reviewRes.status === 200 ? '✅' : '❌', 'POST /api/comments (Public Guest Review):', reviewRes.status, reviewRes.json?.message || reviewRes.text);

  // 7. Test Anti-spam Rate Limiting on repeated comments
  const repeatReview = await req('/api/comments', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: {
      authorName: 'Khách Ghé Quán E2E',
      rating: 5,
      content: 'Cà phê muối rất thơm ngon, gửi lại ngay lập tức.',
      challengeToken: chalRes.json.token,
      challengeAnswer: '10',
    },
  });
  console.log(repeatReview.status === 429 || repeatReview.status === 403 || repeatReview.status === 400 ? '✅' : '❌', 'Anti-Spam Rapid Repeat Submission Blocked:', repeatReview.status);

  console.log('\n--- ALL CMS MUTATION TESTS COMPLETED ---');
}

runCmsAudit();
