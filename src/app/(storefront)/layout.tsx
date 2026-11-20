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
  const rawHost = headersList.get('x-forwarded-host') || headersList.get('host') || '';
  const host = rawHost.split(':')[0];
  const isAdminHeader = headersList.get('x-is-admin-host') === '1';

  if (host.startsWith('admin.') || host === 'admin.camcuhouse.online' || isAdminHeader) {
    return <>{children}</>;
  }

  return <StorefrontShell>{children}</StorefrontShell>;
}
