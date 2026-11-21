import { NextResponse } from 'next/server';

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  meta?: Record<string, unknown>;
}

export function apiSuccess<T>(data: T, meta?: Record<string, unknown> | string, status = 200, headers?: HeadersInit) {
  const metaObj = typeof meta === 'string' ? { message: meta } : meta;
  const message = typeof meta === 'string' ? meta : (meta?.message as string | undefined);
  return NextResponse.json(
    {
      success: true,
      ...(message ? { message } : {}),
      data,
      ...(metaObj ? { meta: metaObj } : {}),
    },
    {
      status,
      headers: {
        'Cache-Control': 'no-store, max-age=0',
        ...(headers || {}),
      },
    }
  );
}

export function apiError(message: string, status = 400, meta?: Record<string, unknown>, headers?: HeadersInit) {
  let safeMessage = message;
  const isInternalLeak =
    typeof message === 'string' &&
    (/prisma/i.test(message) ||
      /invocation/i.test(message) ||
      /constraint/i.test(message) ||
      /foreign key/i.test(message) ||
      /connect ECONN/i.test(message) ||
      /\.ts:\d+/i.test(message) ||
      /SELECT\s+/i.test(message) ||
      /INSERT\s+/i.test(message) ||
      /UPDATE\s+/i.test(message) ||
      /DELETE\s+FROM/i.test(message));

  if (isInternalLeak) {
    console.error('[API Security] Sanitized internal database/Prisma error:', message);
    safeMessage = 'Đã xảy ra lỗi khi xử lý dữ liệu hệ thống. Vui lòng thử lại sau.';
  }

  return NextResponse.json(
    {
      success: false,
      error: safeMessage,
      ...(meta ? { meta } : {}),
    },
    {
      status,
      headers: {
        'Cache-Control': 'no-store, max-age=0',
        ...(headers || {}),
      },
    }
  );
}
