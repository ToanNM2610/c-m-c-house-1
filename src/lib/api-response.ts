import { NextResponse } from 'next/server';

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  meta?: Record<string, unknown>;
}

export function apiSuccess<T>(data: T, meta?: Record<string, unknown> | string, status = 200) {
  const metaObj = typeof meta === 'string' ? { message: meta } : meta;
  return NextResponse.json(
    {
      success: true,
      data,
      ...(metaObj ? { meta: metaObj } : {}),
    },
    { status }
  );
}

export function apiError(message: string, status = 400, meta?: Record<string, unknown>) {
  return NextResponse.json(
    {
      success: false,
      error: message,
      ...(meta ? { meta } : {}),
    },
    { status }
  );
}

