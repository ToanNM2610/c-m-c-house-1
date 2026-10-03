"use client";

import { ReactNode } from "react";

export default function Template({ children }: { children: ReactNode }) {
  return (
    <div className="animate-page-enter min-h-screen w-full">
      {children}
    </div>
  );
}
