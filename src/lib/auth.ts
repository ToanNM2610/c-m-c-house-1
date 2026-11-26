import crypto from 'crypto';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from './prisma';
import { apiError } from './api-response';
import { AdminRole, AdminUserSafe } from '@/types';
import { AdminModuleKey, hasModuleAccess } from './rbac';

export interface SessionPayload {
  userId: string;
  username: string;
  fullName: string;
  role: AdminRole;
  sessionId?: string;
  exp: number;
}

const SESSION_COOKIE_NAME = 'camcu_admin_session';
const SESSION_SECRET = process.env.ADMIN_SESSION_SECRET || 'camcu_house_gmt7_admin_secret_key_2026_botanical';
const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const derivedKey = crypto.scryptSync(password, salt, 64);
  return `${salt}:${derivedKey.toString('hex')}`;
}

export function verifyPassword(password: string, storedHash: string): boolean {
  try {
    const [salt, keyHex] = storedHash.split(':');
    if (!salt || !keyHex) return false;

    const keyBuffer = Buffer.from(keyHex, 'hex');
    const derivedKey = crypto.scryptSync(password, salt, 64);

    if (keyBuffer.length !== derivedKey.length) return false;
    return crypto.timingSafeEqual(keyBuffer, derivedKey);
  } catch {
    return false;
  }
}

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

export function hashSessionToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

export function createSessionToken(
  user: { id: string; username: string; fullName: string; role: string },
  sessionId?: string
): string {
  const payload: SessionPayload = {
    userId: user.id,
    username: user.username,
    fullName: user.fullName,
    role: (user.role as AdminRole) || 'EDITOR',
    sessionId,
    exp: Date.now() + SESSION_DURATION_MS,
  };

  const payloadString = JSON.stringify(payload);
  const encodedPayload = base64UrlEncode(payloadString);

  const signature = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(encodedPayload)
    .digest('hex');

  return `${encodedPayload}.${signature}`;
}

export async function createPersistedAdminSession(
  user: { id: string; username: string; fullName: string; role: string },
  req?: NextRequest
): Promise<{ token: string; sessionId: string }> {
  const sessionId = crypto.randomBytes(16).toString('hex');
  const token = createSessionToken(user, sessionId);
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);

  const ipAddress =
    req?.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req?.headers.get('x-real-ip') ||
    null;
  const userAgent = req?.headers.get('user-agent')?.slice(0, 240) || null;

  try {
    await prisma.adminSession.create({
      data: {
        id: sessionId,
        sessionToken: hashSessionToken(token),
        userId: user.id,
        expiresAt,
        ipAddress,
        userAgent,
      },
    });
    await prisma.adminUser.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    }).catch(() => {});
  } catch (err) {
    console.warn('Could not persist AdminSession row:', err);
  }

  return { token, sessionId };
}

export function verifySessionToken(token: string): SessionPayload | null {
  try {
    const [encodedPayload, signature] = token.split('.');
    if (!encodedPayload || !signature) return null;

    const expectedSignature = crypto
      .createHmac('sha256', SESSION_SECRET)
      .update(encodedPayload)
      .digest('hex');

    const sigBuffer = Buffer.from(signature, 'hex');
    const expectedBuffer = Buffer.from(expectedSignature, 'hex');

    if (sigBuffer.length !== expectedBuffer.length) return null;
    if (!crypto.timingSafeEqual(sigBuffer, expectedBuffer)) return null;

    const payload: SessionPayload = JSON.parse(base64UrlDecode(encodedPayload));
    if (payload.exp < Date.now()) return null;

    return payload;
  } catch {
    return null;
  }
}

export function getSessionCookieOptions(isProduction = process.env.NODE_ENV === 'production') {
  return {
    name: SESSION_COOKIE_NAME,
    httpOnly: true,
    sameSite: 'lax' as const,
    path: '/',
    maxAge: 7 * 24 * 60 * 60,
    secure: isProduction && process.env.COOKIE_SECURE === 'true',
  };
}

export async function getSessionUser(req?: NextRequest): Promise<AdminUserSafe | null> {
  try {
    let token: string | undefined;

    if (req) {
      token = req.cookies.get(SESSION_COOKIE_NAME)?.value;
    } else {
      const cookieStore = cookies();
      token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    }

    if (!token) return null;

    const payload = verifySessionToken(token);
    if (!payload || !payload.userId) return null;

    // If token was minted with a persistent AdminSession ID, verify it was not revoked
    if (payload.sessionId) {
      try {
        const dbSession = await prisma.adminSession.findUnique({
          where: { id: payload.sessionId },
          select: { id: true, expiresAt: true },
        });
        if (!dbSession || dbSession.expiresAt.getTime() < Date.now()) {
          return null;
        }
      } catch {
        // Fail open only if AdminSession table doesn't exist yet on legacy DB
      }
    }

    const user = await prisma.adminUser.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        username: true,
        fullName: true,
        role: true,
        isActive: true,
        totpEnabled: true,
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user || !user.isActive) return null;

    return {
      id: user.id,
      username: user.username,
      fullName: user.fullName,
      role: (user.role as AdminRole) || 'EDITOR',
      isActive: user.isActive,
      totpEnabled: user.totpEnabled ?? false,
      lastLoginAt: user.lastLoginAt,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  } catch (error) {
    console.error('Error getting session user:', error);
    return null;
  }
}

export async function requireAuth(
  req?: NextRequest,
  allowedRoles?: AdminRole | AdminRole[]
): Promise<{ user: AdminUserSafe } | { errorResponse: NextResponse }> {
  const user = await getSessionUser(req);
  if (!user) {
    return {
      errorResponse: apiError('Yêu cầu đăng nhập tài khoản quản trị', 401),
    };
  }

  if (allowedRoles) {
    const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
    if (user.role !== 'SUPER_ADMIN' && !roles.includes(user.role)) {
      return {
        errorResponse: apiError('Bạn không có quyền thực hiện thao tác này', 403),
      };
    }
  }

  return { user };
}

export async function requireModuleAuth(
  req: NextRequest | undefined,
  moduleKey: AdminModuleKey
): Promise<{ user: AdminUserSafe } | { errorResponse: NextResponse }> {
  const user = await getSessionUser(req);
  if (!user) {
    return {
      errorResponse: apiError('Yêu cầu đăng nhập tài khoản quản trị', 401),
    };
  }

  if (!hasModuleAccess(user.role, moduleKey)) {
    return {
      errorResponse: apiError(`Vai trò "${user.role}" không được cấp quyền truy cập phân hệ ${moduleKey}`, 403),
    };
  }

  return { user };
}
