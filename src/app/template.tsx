import React from 'react';

export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="relative z-10 w-full min-h-screen">{children}</div>;
}
