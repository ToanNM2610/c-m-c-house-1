import crypto from 'crypto';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';
import { prisma } from './prisma';

export interface CustomerSessionPayload {
  customerId: string;
  email: string;
  fullName: string;
  exp: number;
}

const CUSTOMER_SESSION_COOKIE_NAME = 'camcuhouse_customer_session';
const CUSTOMER_SESSION_SECRET = process.env.CUSTOMER_SESSION_SECRET || 'camcu_customer_portal_secret_2026_isolated_gmt7';
const SESSION_DURATION_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

export function hashCustomerPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const derivedKey = crypto.scryptSync(password, salt, 64);
  return `${salt}:${derivedKey.toString('hex')}`;
}

export function verifyCustomerPassword(password: string, storedHash: string): boolean {
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

export function createCustomerSessionToken(customer: { id: string; email: string; fullName: string }): string {
  const payload: CustomerSessionPayload = {
    customerId: customer.id,
    email: customer.email,
    fullName: customer.fullName,
    exp: Date.now() + SESSION_DURATION_MS,
  };

  const payloadString = JSON.stringify(payload);
  const encodedPayload = base64UrlEncode(payloadString);

  const signature = crypto
    .createHmac('sha256', CUSTOMER_SESSION_SECRET)
    .update(encodedPayload)
    .digest('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

  return `${encodedPayload}.${signature}`;
}

export function verifyCustomerSessionToken(token: string): CustomerSessionPayload | null {
  try {
    const [encodedPayload, signature] = token.split('.');
    if (!encodedPayload || !signature) return null;

    const expectedSignature = crypto
      .createHmac('sha256', CUSTOMER_SESSION_SECRET)
      .update(encodedPayload)
      .digest('base64')
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');

    const signatureBuffer = Buffer.from(signature);
    const expectedBuffer = Buffer.from(expectedSignature);

    if (signatureBuffer.length !== expectedBuffer.length) return null;
    if (!crypto.timingSafeEqual(signatureBuffer, expectedBuffer)) return null;

    const payload: CustomerSessionPayload = JSON.parse(base64UrlDecode(encodedPayload));
    if (payload.exp < Date.now()) return null;

    return payload;
  } catch {
    return null;
  }
}

export function getCustomerSessionCookieOptions() {
  const isProd = process.env.NODE_ENV === 'production';
  return {
    name: CUSTOMER_SESSION_COOKIE_NAME,
    httpOnly: true,
    sameSite: 'lax' as const,
    path: '/',
    maxAge: 30 * 24 * 60 * 60, // 30 days
    secure: isProd,
  };
}

export async function getCustomerSessionUser(req?: NextRequest) {
  let token: string | undefined;

  if (req) {
    token = req.cookies.get(CUSTOMER_SESSION_COOKIE_NAME)?.value;
  } else {
    try {
      const cookieStore = cookies();
      token = cookieStore.get(CUSTOMER_SESSION_COOKIE_NAME)?.value;
    } catch {
      return null;
    }
  }

  if (!token) return null;

  const payload = verifyCustomerSessionToken(token);
  if (!payload) return null;

  try {
    const customer = await prisma.customer.findUnique({
      where: { id: payload.customerId },
      select: {
        id: true,
        email: true,
        fullName: true,
        phone: true,
        avatarUrl: true,
        isActive: true,
        totalSpent: true,
        orderCount: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!customer || !customer.isActive) return null;
    return customer;
  } catch {
    return null;
  }
}

