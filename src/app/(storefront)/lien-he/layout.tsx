import React from 'react';
import type { Metadata } from 'next';
import { getPageSeoMetadata } from '@/lib/seo';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  return getPageSeoMetadata('/lien-he', {
    title: 'Liên Hệ & Chỉ Đường — Cẩm Cù House',
    description: 'Địa chỉ Hẻm 437 Hùng Vương, hotline và hướng dẫn chỉ đường Google Maps đến Cẩm Cù House.',
  });
}

export default function LienHeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

