import React from 'react';
import type { Metadata } from 'next';
import { getPageSeoMetadata } from '@/lib/seo';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  return getPageSeoMetadata('/gioi-thieu', {
    title: 'Giới Thiệu — Cẩm Cù House | Hành Trình & Đội Ngũ',
    description: 'Tìm hiểu về câu chuyện khởi sinh bên bờ suối, văn hóa sinh thái và đội ngũ Cẩm Cù House.',
  });
}

export default function GioiThieuLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
