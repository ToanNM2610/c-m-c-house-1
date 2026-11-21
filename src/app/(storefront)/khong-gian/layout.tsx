import React from 'react';
import type { Metadata } from 'next';
import { getPageSeoMetadata } from '@/lib/seo';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  return getPageSeoMetadata('/khong-gian', {
    title: 'Không Gian Suối — Cẩm Cù House | 30 Bản Khắc Không Gian',
    description: 'Chiêm ngưỡng 30 góc không gian bờ suối tự nhiên, chòi mộc và hiên đá yên bình tại Cẩm Cù House.',
  });
}

export default function KhongGianLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

