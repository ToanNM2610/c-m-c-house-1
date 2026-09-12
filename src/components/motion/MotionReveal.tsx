'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface MotionRevealProps {
  children: ReactNode;
  delay?: number;
  direction?: 'up' | 'down' | 'none';
  className?: string;
}

export function MotionReveal({
  children,
  delay = 0,
  direction = 'up',
  className = '',
}: MotionRevealProps) {
  const yOffset = direction === 'up' ? 24 : direction === 'down' ? -24 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: yOffset }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15, margin: "0px 0px -40px 0px" }}
      transition={{
        duration: 0.65,
        delay,
        ease: [0.25, 1, 0.5, 1],
      }}
      style={{
        transform: 'translate3d(0,0,0)',
        willChange: 'opacity, transform',
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default MotionReveal;
