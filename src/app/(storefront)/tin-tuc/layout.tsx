import React from 'react';
import type { Metadata } from 'next';
import { getPageSeoMetadata } from '@/lib/seo';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  return getPageSeoMetadata('/su-kien', {
    title: 'Tin Tức & Sự Kiện — Cẩm Cù House',
    description: 'Lịch hoạt động đêm nhạc bên suối, sự kiện văn hóa và thông báo mới nhất từ Cẩm Cù House.',
  });
}

export default function TinTucLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

