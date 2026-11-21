import React from 'react';
import type { Metadata } from 'next';
import { getPageSeoMetadata } from '@/lib/seo';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  return getPageSeoMetadata('/studio', {
    title: 'Studio Khám Phá — Cẩm Cù House',
    description: 'Trải nghiệm trực quan không gian và các dịch vụ độc đáo tại Cẩm Cù House.',
  });
}

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
