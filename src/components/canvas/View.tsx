"use client";

import { View as DreiView } from "@react-three/drei";
import React, { forwardRef, HTMLAttributes } from "react";

export interface ViewProps extends HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

export const View = forwardRef<HTMLDivElement, ViewProps>(({ children, className = "", ...props }, ref) => {
  return (
    <DreiView ref={ref as any} className={className} {...props}>
      {children}
    </DreiView>
  );
});

View.displayName = "View";

export default View;
