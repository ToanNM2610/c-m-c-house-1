import React from 'react';
import type { Metadata } from 'next';
import { getPageSeoMetadata } from '@/lib/seo';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  return getPageSeoMetadata('/thuc-don', {
    title: 'Thực Đơn 7 Danh Mục — Cẩm Cù House',
    description: 'Khám phá thực đơn đồ uống thảo mộc, cà phê rang mộc và đồ ăn đậm đà bản sắc núi rừng tại Cẩm Cù House.',
  });
}

export default function ThucDonLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

