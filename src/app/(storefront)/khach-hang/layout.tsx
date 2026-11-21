import React from 'react';
import type { Metadata } from 'next';
import { getPageSeoMetadata } from '@/lib/seo';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  return getPageSeoMetadata('/khach-hang', {
    title: 'Khách Hàng & Đánh Giá — Cẩm Cù House',
    description: 'Những dòng cảm nhận và dấu ấn chân thật từ khách ghé thăm Cẩm Cù House bên bờ suối.',
  });
}

export default function KhachHangLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
