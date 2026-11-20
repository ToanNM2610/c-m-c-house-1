import crypto from 'crypto';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from './prisma';
import { apiError } from './api-response';
import { AdminRole, AdminUserSafe } from '@/types';

export interface SessionPayload {
  userId: string;
  username: string;
  fullName: string;
  role: AdminRole;
  exp: number;
}

const SESSION_COOKIE_NAME = 'camcu_admin_session';
const SESSION_SECRET = process.env.ADMIN_SESSION_SECRET || 'camcu_house_gmt7_admin_secret_key_2026_botanical';
const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

/**
 * Hash password using Node.js native crypto.scryptSync with 16-byte random salt.
 * Result format: "<salt_hex>:<hash_hex>"
 */
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const derivedKey = crypto.scryptSync(password, salt, 64);
  return `${salt}:${derivedKey.toString('hex')}`;
}

/**
 * Verify password against stored "<salt_hex>:<hash_hex>" using crypto.timingSafeEqual.
 */
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

/**
 * Create a signed HMAC-SHA256 session token.
 */
export function createSessionToken(user: { id: string; username: string; fullName: string; role: string }): string {
  const payload: SessionPayload = {
    userId: user.id,
    username: user.username,
    fullName: user.fullName,
    role: (user.role as AdminRole) || 'EDITOR',
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

/**
 * Verify and decode an HMAC-SHA256 session token.
 */
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

/**
 * Cookie options helper
 */
export function getSessionCookieOptions(isProduction = process.env.NODE_ENV === 'production') {
  return {
    name: SESSION_COOKIE_NAME,
    httpOnly: true,
    sameSite: 'lax' as const,
    path: '/',
    maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
    // Only enforce secure on true HTTPS deployments (do not break http://localhost:3000)
    secure: isProduction && process.env.COOKIE_SECURE === 'true',
  };
}

/**
 * Get current authenticated user from request or headers cookie.
 */
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

    const user = await prisma.adminUser.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        username: true,
        fullName: true,
        role: true,
        isActive: true,
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
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  } catch (error) {
    console.error('Error getting session user:', error);
    return null;
  }
}

/**
 * Authentication guard for API route handlers with role checking.
 */
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
    if (!roles.includes(user.role)) {
      return {
        errorResponse: apiError('Bạn không có quyền thực hiện thao tác này', 403),
      };
    }
  }

  return { user };
}

