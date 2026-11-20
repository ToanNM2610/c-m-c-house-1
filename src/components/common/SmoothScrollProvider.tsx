'use client';

import React from 'react';

// SmoothScrollProvider: Native browser scrolling enabled without Lenis scroll hijacking
export default function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
