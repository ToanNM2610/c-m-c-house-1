import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from './prisma';
import { AntiSpamConfig, BlockedIp } from '@prisma/client';

// ==========================================
// CONSTANTS & SECRETS
// ==========================================
const HMAC_SECRET = process.env.SECURITY_HMAC_SECRET || process.env.ADMIN_SESSION_SECRET || 'camcu_house_security_antispam_hmac_secret_2026_botanical';
const CONFIG_CACHE_TTL_MS = 60 * 1000; // 60 seconds

// Default fallback configuration matching Prisma schema defaults
export const DEFAULT_ANTISPAM_CONFIG: Omit<AntiSpamConfig, 'updatedAt'> = {
  id: 'default',
  emergencyLockdown: false,
  maxRequestSizeKb: 8,
  cooldownSeconds: 60,
  maxPerTenMinutes: 3,
  maxPerDay: 8,
  globalMaxPerFiveMinutes: 25,
  escalatingBanEnabled: true,
  mathChallengeRequired: true,
  mathChallengeTtlMinutes: 15,
  mathChallengeMinFillSeconds: 3,
  nameMinLength: 2,
  nameMaxLength: 80,
  contentMinLength: 10,
  contentMaxLength: 1200,
  maxLinksAllowed: 1,
  blockedKeywords: 'casino,bet88,kubet,viagra,sex,porn,vay tien,danh bac,lo de,keo nha cai,telegram,crypto,forex',
  maxGmailPerHour: 15,
};

// ==========================================
// BOUNDED LRU IN-MEMORY STORE (Max 5,000 keys)
// ==========================================
export class BoundedLRUMap<K, V> {
  private map = new Map<K, V>();
  private readonly maxSize: number;

  constructor(maxSize = 5000) {
    this.maxSize = maxSize;
  }

  get(key: K): V | undefined {
    const val = this.map.get(key);
    if (val !== undefined) {
      // Re-insert to refresh LRU order
      this.map.delete(key);
      this.map.set(key, val);
    }
    return val;
  }

  set(key: K, value: V): void {
    if (this.map.has(key)) {
      this.map.delete(key);
    } else if (this.map.size >= this.maxSize) {
      // Evict oldest entry (first item in Map iterator)
      const oldestKey = this.map.keys().next().value;
      if (oldestKey !== undefined) {
        this.map.delete(oldestKey);
      }
    }
    this.map.set(key, value);
  }

  has(key: K): boolean {
    return this.map.has(key);
  }

  delete(key: K): boolean {
    return this.map.delete(key);
  }

  clear(): void {
    this.map.clear();
  }

  get size(): number {
    return this.map.size;
  }
}

// In-memory sliding window store for rate limiting (Layer 2)
interface RateLimitRecord {
  timestamps: number[];
  lastSubmissionTime: number;
}
export const rateLimitStore = new BoundedLRUMap<string, RateLimitRecord>(5000);

// Global sliding window timestamps for circuit breaker (Layer 2)
export const globalSubmissionTimestamps: number[] = [];

// 60s in-memory ban cache (Layer 3)
interface BanCacheEntry {
  isBlocked: boolean;
  blockedUntil: number | null;
  isPermanent: boolean;
  reason?: string;
  cachedAt: number;
}
export const banCache = new BoundedLRUMap<string, BanCacheEntry>(5000);

// Used challenge nonce store to prevent replay attacks (Layer 4)
export const usedNonces = new BoundedLRUMap<string, number>(10000);

// 24h content deduplication SHA-256 hash cache (Layer 6)
export const contentHashCache = new BoundedLRUMap<string, number>(5000);

// In-memory AntiSpamConfig cache
let cachedConfig: AntiSpamConfig | null = null;
let configCachedAt = 0;

export function invalidateConfigCache(): void {
  cachedConfig = null;
  configCachedAt = 0;
}

// ==========================================
// CONFIGURATION RETRIEVAL & AUTO-SEED
// ==========================================
export async function getAntiSpamConfig(): Promise<AntiSpamConfig> {
  const now = Date.now();
  if (cachedConfig && now - configCachedAt < CONFIG_CACHE_TTL_MS) {
    return cachedConfig;
  }

  try {
    let config = await prisma.antiSpamConfig.findUnique({
      where: { id: 'default' },
    });

    if (!config) {
      config = await prisma.antiSpamConfig.create({
        data: {
          ...DEFAULT_ANTISPAM_CONFIG,
        },
      });
    }

    cachedConfig = config;
    configCachedAt = now;
    return config;
  } catch (error) {
    console.error('[antiSpam] Error loading AntiSpamConfig from DB:', error);
    // Return default fallback in case of transient DB issue
    return {
      ...DEFAULT_ANTISPAM_CONFIG,
      updatedAt: new Date(),
    };
  }
}

// ==========================================
// CLIENT IP EXTRACTION & NORMALIZATION
// ==========================================
export function getClientIp(request: Request | NextRequest): string {
  const headers = request.headers;
  const forwardedFor = headers.get('x-forwarded-for');
  let ip = '';

  if (forwardedFor) {
    ip = forwardedFor.split(',')[0].trim();
  } else {
    ip =
      headers.get('x-real-ip') ||
      headers.get('cf-connecting-ip') ||
      headers.get('x-client-ip') ||
      '127.0.0.1';
  }

  // Normalize IPv6 mapped IPv4 address
  if (ip.startsWith('::ffff:')) {
    ip = ip.replace('::ffff:', '');
  }

  return ip || '127.0.0.1';
}

// ==========================================
// BASE64URL HELPERS
// ==========================================
function base64UrlEncode(str: string): string {
  return Buffer.from(str, 'utf8')
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function base64UrlDecode(str: string): string {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  return Buffer.from(base64, 'base64').toString('utf8');
}

// ==========================================
// LAYER 4: MATH CHALLENGE GENERATION & VERIFICATION
// ==========================================
export interface ChallengePayload {
  nonce: string;
  ts: number;
  answer: number;
}

export function generateMathChallenge(): { question: string; token: string } {
  // Generate 2 natural numbers between 1 and 20
  const a = Math.floor(Math.random() * 15) + 3; // 3 to 17
  const b = Math.floor(Math.random() * 10) + 1; // 1 to 10
  const isAddition = Math.random() > 0.35; // 65% addition, 35% subtraction

  let question = '';
  let answer = 0;

  if (isAddition) {
    question = `${a} + ${b} = ?`;
    answer = a + b;
  } else {
    // Ensure positive result for subtraction
    const max = Math.max(a, b);
    const min = Math.min(a, b);
    question = `${max} - ${min} = ?`;
    answer = max - min;
  }

  const nonce = crypto.randomBytes(16).toString('hex');
  const ts = Date.now();

  const payload: ChallengePayload = { nonce, ts, answer };
  const payloadString = JSON.stringify(payload);
  const encodedPayload = base64UrlEncode(payloadString);

  const signature = crypto
    .createHmac('sha256', HMAC_SECRET)
    .update(encodedPayload)
    .digest('hex');

  const token = `${encodedPayload}.${signature}`;

  return { question, token };
}

export function verifyMathChallenge(
  token: string | undefined | null,
  userAnswer: number | string | undefined | null,
  config: AntiSpamConfig
): { valid: boolean; reason?: string } {
  if (!token || typeof token !== 'string') {
    return { valid: false, reason: 'Thiếu mã xác thực câu hỏi bảo mật (token)' };
  }

  const [encodedPayload, signature] = token.split('.');
  if (!encodedPayload || !signature) {
    return { valid: false, reason: 'Mã xác thực bảo mật không hợp lệ' };
  }

  // Validate HMAC signature
  const expectedSignature = crypto
    .createHmac('sha256', HMAC_SECRET)
    .update(encodedPayload)
    .digest('hex');

  const sigBuffer = Buffer.from(signature, 'hex');
  const expectedBuffer = Buffer.from(expectedSignature, 'hex');

  if (sigBuffer.length !== expectedBuffer.length || !crypto.timingSafeEqual(sigBuffer, expectedBuffer)) {
    return { valid: false, reason: 'Chữ ký mã xác thực không hợp lệ hoặc đã bị thay đổi' };
  }

  let payload: ChallengePayload;
  try {
    payload = JSON.parse(base64UrlDecode(encodedPayload));
  } catch {
    return { valid: false, reason: 'Dữ liệu mã xác thực bị hỏng' };
  }

  const { nonce, ts, answer } = payload;
  const now = Date.now();

  // Check single-use nonce
  if (usedNonces.has(nonce)) {
    return { valid: false, reason: 'Mã xác thực đã qua sử dụng. Vui lòng tải lại câu hỏi mới.' };
  }
  // Mark nonce as used immediately
  usedNonces.set(nonce, now);

  // Check elapsed time (Fill time guard)
  const elapsedSeconds = (now - ts) / 1000;
  if (elapsedSeconds < config.mathChallengeMinFillSeconds) {
    return {
      valid: false,
      reason: `Thao tác quá nhanh (${elapsedSeconds.toFixed(1)}s < ${config.mathChallengeMinFillSeconds}s). Vui lòng thử lại bình tĩnh.`,
    };
  }

  const ttlSeconds = config.mathChallengeTtlMinutes * 60;
  if (elapsedSeconds > ttlSeconds) {
    return {
      valid: false,
      reason: `Mã xác thực đã hết hạn (${Math.round(elapsedSeconds / 60)} phút > ${config.mathChallengeTtlMinutes} phút). Vui lòng tải lại câu hỏi.`,
    };
  }

  // Check numerical answer
  const parsedUserAnswer = parseInt(String(userAnswer).trim(), 10);
  if (isNaN(parsedUserAnswer) || parsedUserAnswer !== answer) {
    return {
      valid: false,
      reason: 'Câu trả lời phép tính xác thực không chính xác. Vui lòng thử lại.',
    };
  }

  return { valid: true };
}

// ==========================================
// LAYER 3: AUTOMATIC ESCALATING IP BANS
// ==========================================
export async function isIpBanned(ip: string): Promise<{ isBlocked: boolean; reason?: string }> {
  const now = Date.now();

  // 1. Check in-memory 60s cache
  const cached = banCache.get(ip);
  if (cached && now - cached.cachedAt < 60 * 1000) {
    if (cached.isPermanent) {
      return { isBlocked: true, reason: cached.reason || 'IP của bạn đã bị cấm vĩnh viễn.' };
    }
    if (cached.blockedUntil && cached.blockedUntil > now) {
      const waitMin = Math.ceil((cached.blockedUntil - now) / 60000);
      return {
        isBlocked: true,
        reason: `IP của bạn đang bị tạm khóa an ninh (còn khoảng ${waitMin} phút).`,
      };
    }
    // Expired in cache
    return { isBlocked: false };
  }

  // 2. Query database BlockedIp
  try {
    const record = await prisma.blockedIp.findUnique({
      where: { ipAddress: ip },
    });

    if (!record) {
      banCache.set(ip, {
        isBlocked: false,
        blockedUntil: null,
        isPermanent: false,
        cachedAt: now,
      });
      return { isBlocked: false };
    }

    if (record.isPermanent) {
      banCache.set(ip, {
        isBlocked: true,
        blockedUntil: null,
        isPermanent: true,
        reason: record.reason || 'IP bị cấm vĩnh viễn do nghi vấn tấn công.',
        cachedAt: now,
      });
      return { isBlocked: true, reason: record.reason || 'IP của bạn đã bị cấm vĩnh viễn.' };
    }

    if (record.blockedUntil && record.blockedUntil.getTime() > now) {
      banCache.set(ip, {
        isBlocked: true,
        blockedUntil: record.blockedUntil.getTime(),
        isPermanent: false,
        reason: record.reason || 'IP đang bị khóa tạm thời.',
        cachedAt: now,
      });
      const waitMin = Math.ceil((record.blockedUntil.getTime() - now) / 60000);
      return {
        isBlocked: true,
        reason: `IP của bạn đang bị tạm khóa an ninh (còn khoảng ${waitMin} phút).`,
      };
    }

    // Past ban time -> unblocked
    banCache.set(ip, {
      isBlocked: false,
      blockedUntil: null,
      isPermanent: false,
      cachedAt: now,
    });
    return { isBlocked: false };
  } catch (error) {
    console.error('[antiSpam] Error checking blocked IP in database:', error);
    return { isBlocked: false };
  }
}

/**
 * Record a strike against an IP with automatic escalating ban logic:
 * Strike 1-2: 429 warning recorded
 * Strike 3: 15-minute temporary ban
 * Strike 4: 1-hour temporary ban
 * Strike 5+: 24-hour temporary ban
 */
export async function recordIpStrike(
  ip: string,
  violationReason: string
): Promise<{ strikeCount: number; isBanned: boolean; blockedUntil?: Date }> {
  try {
    const now = new Date();
    const existing = await prisma.blockedIp.findUnique({
      where: { ipAddress: ip },
    });

    const newStrikeCount = (existing?.strikeCount || 0) + 1;
    let blockedUntil: Date | null = null;
    let isBanned = false;

    if (newStrikeCount >= 5) {
      // Strike 5+: 24 hours
      blockedUntil = new Date(now.getTime() + 24 * 60 * 60 * 1000);
      isBanned = true;
    } else if (newStrikeCount === 4) {
      // Strike 4: 1 hour
      blockedUntil = new Date(now.getTime() + 60 * 60 * 1000);
      isBanned = true;
    } else if (newStrikeCount === 3) {
      // Strike 3: 15 minutes
      blockedUntil = new Date(now.getTime() + 15 * 60 * 1000);
      isBanned = true;
    }

    const updated = await prisma.blockedIp.upsert({
      where: { ipAddress: ip },
      update: {
        strikeCount: newStrikeCount,
        reason: violationReason,
        blockedUntil: blockedUntil ?? existing?.blockedUntil ?? null,
      },
      create: {
        ipAddress: ip,
        strikeCount: newStrikeCount,
        reason: violationReason,
        blockedUntil,
        isPermanent: false,
      },
    });

    // Update in-memory ban cache immediately
    banCache.set(ip, {
      isBlocked: isBanned,
      blockedUntil: blockedUntil ? blockedUntil.getTime() : null,
      isPermanent: false,
      reason: violationReason,
      cachedAt: Date.now(),
    });

    // Log to SystemLog under SECURITY category
    await prisma.systemLog.create({
      data: {
        level: isBanned ? 'WARN' : 'INFO',
        category: 'SECURITY',
        action: isBanned ? 'IP_AUTOMATIC_BAN' : 'IP_STRIKE_RECORDED',
        details: `IP: ${ip} | Strike: ${newStrikeCount} | Lý do: ${violationReason}${
          blockedUntil ? ` | Khóa đến: ${blockedUntil.toISOString()}` : ''
        }`,
        ipAddress: ip,
      },
    });

    return {
      strikeCount: newStrikeCount,
      isBanned,
      blockedUntil: blockedUntil || undefined,
    };
  } catch (error) {
    console.error('[antiSpam] Error recording IP strike:', error);
    return { strikeCount: 1, isBanned: false };
  }
}

// ==========================================
// LAYER 5: MULTI-FIELD HONEYPOT TRAPS
// ==========================================
export function checkHoneypots(body: Record<string, any>): boolean {
  if (!body || typeof body !== 'object') return false;

  const traps = ['websiteUrl', 'companyFax', 'honeypot'];
  for (const field of traps) {
    const val = body[field];
    if (val !== undefined && val !== null && val !== '') {
      return true; // Bot caught!
    }
  }
  return false;
}

// ==========================================
// LAYER 6: CONTENT QUALITY & KEYWORDS FILTER
// ==========================================
export function normalizeContent(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Strip accents for matching
    .replace(/[^\w\s]/gi, '')       // Strip punctuation
    .replace(/\s+/g, ' ')          // Collapse whitespace
    .trim();
}

export function validateContentQuality(
  content: string,
  name: string,
  config: AntiSpamConfig
): { valid: boolean; error?: string } {
  const trimmedName = (name || '').trim();
  const trimmedContent = (content || '').trim();

  // 1. Length checks
  if (trimmedName.length < config.nameMinLength || trimmedName.length > config.nameMaxLength) {
    return {
      valid: false,
      error: `Họ tên phải có độ dài từ ${config.nameMinLength} đến ${config.nameMaxLength} ký tự.`,
    };
  }

  if (trimmedContent.length < config.contentMinLength || trimmedContent.length > config.contentMaxLength) {
    return {
      valid: false,
      error: `Nội dung phải có độ dài từ ${config.contentMinLength} đến ${config.contentMaxLength} ký tự.`,
    };
  }

  // 2. Max links allowed check
  const linkRegex = /(https?:\/\/|www\.)[^\s]+|[a-zA-Z0-9-]+\.(com|net|org|xyz|vn|top|info|biz|ru|cn|cc|vip)\b/gi;
  const linksFound = trimmedContent.match(linkRegex) || [];
  if (linksFound.length > config.maxLinksAllowed) {
    return {
      valid: false,
      error: `Nội dung chứa quá nhiều liên kết web (tối đa cho phép: ${config.maxLinksAllowed}).`,
    };
  }

  // 3. Repetitive character check (7+ consecutive identical characters)
  if (/(.)\1{6,}/.test(trimmedContent) || /(.)\1{6,}/.test(trimmedName)) {
    return {
      valid: false,
      error: 'Nội dung chứa ký tự lặp lại bất thường.',
    };
  }

  // Repetitive identical words (4+ consecutive identical words)
  if (/\b(\w+)\s+\1\s+\1\s+\1\b/i.test(trimmedContent)) {
    return {
      valid: false,
      error: 'Nội dung chứa từ ngữ lặp lại bất thường.',
    };
  }

  // 4. Blocked keywords filter
  if (config.blockedKeywords) {
    const rawKeywords = config.blockedKeywords.split(',').map((k) => k.trim().toLowerCase()).filter(Boolean);
    const normalizedCombined = `${normalizeContent(trimmedName)} ${normalizeContent(trimmedContent)}`;

    for (const keyword of rawKeywords) {
      const normalizedKeyword = normalizeContent(keyword);
      if (normalizedKeyword && normalizedCombined.includes(normalizedKeyword)) {
        return {
          valid: false,
          error: `Nội dung chứa từ khóa không phù hợp hoặc bị hạn chế ("${keyword}").`,
        };
      }
    }
  }

  // 5. Content deduplication via SHA-256 (24h cache)
  const contentHash = crypto
    .createHash('sha256')
    .update(normalizeContent(trimmedContent))
    .digest('hex');

  const now = Date.now();
  const lastSeen = contentHashCache.get(contentHash);
  if (lastSeen && now - lastSeen < 24 * 60 * 60 * 1000) {
    return {
      valid: false,
      error: 'Nội dung tương tự đã được gửi gần đây. Vui lòng không gửi nội dung trùng lặp trong vòng 24 giờ.',
    };
  }

  // Store normalized hash for 24h
  contentHashCache.set(contentHash, now);

  return { valid: true };
}

// ==========================================
// LAYER 2: SLIDING WINDOW RATE LIMITER & CIRCUIT BREAKER
// ==========================================
export function checkRateLimits(
  ip: string,
  config: AntiSpamConfig
): { allowed: boolean; retryAfter?: number; error?: string } {
  const now = Date.now();

  // 1. Global circuit breaker: max submissions across whole system in last 5 minutes
  const fiveMinAgo = now - 5 * 60 * 1000;
  // Clean timestamps older than 5 minutes
  while (globalSubmissionTimestamps.length > 0 && globalSubmissionTimestamps[0] < fiveMinAgo) {
    globalSubmissionTimestamps.shift();
  }

  if (globalSubmissionTimestamps.length >= config.globalMaxPerFiveMinutes) {
    return {
      allowed: false,
      retryAfter: 300,
      error: 'Hệ thống đang tiếp nhận lượng gửi quá lớn từ cộng đồng. Vui lòng thử lại sau 5 phút.',
    };
  }

  // 2. Per-IP Sliding Window Rate Limiting
  let record = rateLimitStore.get(ip);
  if (!record) {
    record = { timestamps: [], lastSubmissionTime: 0 };
    rateLimitStore.set(ip, record);
  }

  // Check cooldownSeconds between consecutive submissions
  if (record.lastSubmissionTime > 0) {
    const elapsedSinceLast = now - record.lastSubmissionTime;
    const cooldownMs = config.cooldownSeconds * 1000;
    if (elapsedSinceLast < cooldownMs) {
      const waitSeconds = Math.ceil((cooldownMs - elapsedSinceLast) / 1000);
      return {
        allowed: false,
        retryAfter: waitSeconds,
        error: `Vui lòng đợi ${waitSeconds} giây trước khi gửi biểu mẫu tiếp theo.`,
      };
    }
  }

  // Clean IP timestamps older than 24 hours
  const oneDayAgo = now - 24 * 60 * 60 * 1000;
  record.timestamps = record.timestamps.filter((t) => t >= oneDayAgo);

  // Check maxPerTenMinutes (last 10 minutes)
  const tenMinAgo = now - 10 * 60 * 1000;
  const submissionsLastTenMin = record.timestamps.filter((t) => t >= tenMinAgo).length;
  if (submissionsLastTenMin >= config.maxPerTenMinutes) {
    return {
      allowed: false,
      retryAfter: 600,
      error: `Bạn đã đạt giới hạn gửi trong 10 phút (tối đa ${config.maxPerTenMinutes} lượt). Vui lòng thử lại sau.`,
    };
  }

  // Check maxPerDay (last 24 hours)
  if (record.timestamps.length >= config.maxPerDay) {
    return {
      allowed: false,
      retryAfter: 86400,
      error: `Bạn đã đạt số lượt gửi tối đa trong ngày (${config.maxPerDay} lượt). Vui lòng quay lại vào ngày mai.`,
    };
  }

  return { allowed: true };
}

/**
 * Commits a successful rate-limited request timestamp
 */
export function commitSubmission(ip: string): void {
  const now = Date.now();
  globalSubmissionTimestamps.push(now);

  let record = rateLimitStore.get(ip);
  if (!record) {
    record = { timestamps: [], lastSubmissionTime: now };
    rateLimitStore.set(ip, record);
  }
  record.timestamps.push(now);
  record.lastSubmissionTime = now;
}

// ==========================================
// MASTER GUARD: VALIDATE ANTI-SPAM (7-LAYER PIPELINE)
// ==========================================
export interface AntiSpamValidationOptions {
  nameField?: string;
  contentField?: string;
  skipChallenge?: boolean;
}

export type AntiSpamResult =
  | { passed: true; ip: string; isHoneypotBot?: false }
  | { passed: false; isHoneypotBot: true } // Honeypot trapped: drop payload silently
  | { passed: false; isHoneypotBot?: false; response: NextResponse };

export async function runAntiSpamGuard(
  request: NextRequest,
  rawBody: any,
  options: AntiSpamValidationOptions = {}
): Promise<AntiSpamResult> {
  const ip = getClientIp(request);
  const config = await getAntiSpamConfig();

  // ----------------------------------------------------
  // LAYER 1: Request size guard & Emergency lockdown
  // ----------------------------------------------------
  if (config.emergencyLockdown) {
    return {
      passed: false,
      response: NextResponse.json(
        {
          success: false,
          error: 'Hệ thống đang trong chế độ bảo trì an ninh tạm thời. Vui lòng quay lại sau.',
        },
        { status: 503 }
      ),
    };
  }

  const contentLengthHeader = request.headers.get('content-length');
  const maxSizeBytes = config.maxRequestSizeKb * 1024;
  if (contentLengthHeader) {
    const size = parseInt(contentLengthHeader, 10);
    if (!isNaN(size) && size > maxSizeBytes) {
      return {
        passed: false,
        response: NextResponse.json(
          {
            success: false,
            error: `Dung lượng yêu cầu vượt quá giới hạn an toàn (${config.maxRequestSizeKb}KB).`,
          },
          { status: 413 }
        ),
      };
    }
  }

  // ----------------------------------------------------
  // LAYER 3: IP Ban check (with 60s in-memory cache)
  // ----------------------------------------------------
  const banStatus = await isIpBanned(ip);
  if (banStatus.isBlocked) {
    return {
      passed: false,
      response: NextResponse.json(
        {
          success: false,
          error: banStatus.reason || 'Địa chỉ IP của bạn đã bị khóa an ninh.',
        },
        { status: 403 }
      ),
    };
  }

  // ----------------------------------------------------
  // LAYER 2: Rate limit sliding window & circuit breaker
  // ----------------------------------------------------
  const rateLimit = checkRateLimits(ip, config);
  if (!rateLimit.allowed) {
    // Record strike for rate limit spam abuse
    await recordIpStrike(ip, `Vượt giới hạn gửi yêu cầu liên tục (${rateLimit.error})`);

    const headers: Record<string, string> = {};
    if (rateLimit.retryAfter) {
      headers['Retry-After'] = String(rateLimit.retryAfter);
    }

    return {
      passed: false,
      response: NextResponse.json(
        {
          success: false,
          error: rateLimit.error,
        },
        { status: 429, headers }
      ),
    };
  }

  // ----------------------------------------------------
  // LAYER 5: Multi-field honeypot traps (websiteUrl, companyFax)
  // ----------------------------------------------------
  if (rawBody && typeof rawBody === 'object' && checkHoneypots(rawBody)) {
    // Bot caught in honeypot trap! Record strike and return silent success
    await recordIpStrike(ip, 'Dính bẫy Honeypot ẩn (websiteUrl / companyFax)');
    return {
      passed: false,
      isHoneypotBot: true,
    };
  }

  // ----------------------------------------------------
  // LAYER 4: Server-signed HMAC-SHA256 math challenge verification
  // ----------------------------------------------------
  if (config.mathChallengeRequired && !options.skipChallenge) {
    const challengeToken = rawBody?.challengeToken;
    const challengeAnswer = rawBody?.challengeAnswer;

    const challengeResult = verifyMathChallenge(challengeToken, challengeAnswer, config);
    if (!challengeResult.valid) {
      await recordIpStrike(ip, `Thất bại xác thực phép tính: ${challengeResult.reason}`);
      return {
        passed: false,
        response: NextResponse.json(
          {
            success: false,
            error: challengeResult.reason,
            code: 'CHALLENGE_FAILED',
          },
          { status: 400 }
        ),
      };
    }
  }

  // ----------------------------------------------------
  // LAYER 6: Content deduplication, length checks, repetitive chars, blocked keywords
  // ----------------------------------------------------
  const nameField = options.nameField || 'fullName';
  const contentField = options.contentField || 'message';

  const nameValue = rawBody?.[nameField] || rawBody?.authorName || '';
  const contentValue = rawBody?.[contentField] || rawBody?.content || '';

  const contentValidation = validateContentQuality(contentValue, nameValue, config);
  if (!contentValidation.valid) {
    await recordIpStrike(ip, `Vi phạm kiểm duyệt nội dung: ${contentValidation.error}`);
    return {
      passed: false,
      response: NextResponse.json(
        {
          success: false,
          error: contentValidation.error,
        },
        { status: 400 }
      ),
    };
  }

  // All checks passed!
  return {
    passed: true,
    ip,
  };
}
