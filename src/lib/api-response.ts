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
  return NextResponse.json(
    {
      success: false,
      error: message,
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
