import React from 'react';
import { headers } from 'next/headers';
import StorefrontShell from '@/components/layout/StorefrontShell';

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Server-side check: if accessed via admin subdomain or host starts with admin., never mount storefront shell
  const headersList = headers();
  const host = headersList.get('host') || '';
  if (host.startsWith('admin.')) {
    return <>{children}</>;
  }

  return <StorefrontShell>{children}</StorefrontShell>;
}
