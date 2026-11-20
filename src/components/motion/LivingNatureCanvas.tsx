'use client';

import React, { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useApp } from '@/context/AppContext';

interface Mote {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  vx: number;
  vy: number;
  radius: number;
  baseRadius: number;
  color: string;
  glowColor: string;
  alpha: number;
  baseAlpha: number;
  pulsePhase: number;
  pulseSpeed: number;
  sinAmplitude: number;
  sinFrequency: number;
  timeOffset: number;
}

export default function LivingNatureCanvas() {
  const pathname = usePathname();
  const { theme, motionIntensity, enableAnimations } = useApp();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Storefront only guardrail
  const isStorefront = !pathname?.startsWith('/admin') && !pathname?.startsWith('/api');

  useEffect(() => {
    if (!isStorefront || !enableAnimations || motionIntensity === 'OFF') {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let lastTime = performance.now();
    let width = 0;
    let height = 0;
    let dpr = 1;

    // Mouse coordinates (fine pointer only)
    const mouse = { x: -1000, y: -1000, active: false };
    const hasFinePointer = typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches;

    const isDark = theme === 'dark';
    const isSubtle = motionIntensity === 'SUBTLE';

    // Particle Palette
    const lightPalette = [
      { color: '212, 175, 55', glow: '250, 204, 21', alpha: 0.22 },   // Warm gold sunlight
      { color: '76, 154, 103', glow: '110, 231, 183', alpha: 0.18 },  // Botanical sage green
      { color: '235, 210, 160', glow: '254, 240, 138', alpha: 0.25 }, // Canopy pollen
      { color: '143, 175, 140', glow: '167, 243, 208', alpha: 0.16 }, // Streamside dew
    ];

    const darkPalette = [
      { color: '245, 158, 11', glow: '251, 191, 36', alpha: 0.55 },   // Evening amber firefly
      { color: '234, 179, 8', glow: '253, 224, 71', alpha: 0.50 },    // Golden firefly
      { color: '16, 185, 129', glow: '52, 211, 153', alpha: 0.45 },   // Bioluminescent emerald
      { color: '251, 146, 60', glow: '253, 186, 116', alpha: 0.42 },  // Warm forest spark
    ];

    const currentPalette = isDark ? darkPalette : lightPalette;

    let motes: Mote[] = [];

    const handleResize = () => {
      if (!canvas) return;
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 3);

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.scale(dpr, dpr);

      // Determine particle count based on screen size & intensity
      const isMobile = width < 768;
      let targetCount = 24;
      if (isSubtle) {
        targetCount = isMobile ? 5 : 10;
      } else {
        targetCount = isMobile ? 12 : 26;
      }

      motes = [];
      for (let i = 0; i < targetCount; i++) {
        const pal = currentPalette[i % currentPalette.length];
        const r = isDark ? 2.5 + Math.random() * 3.5 : 3.0 + Math.random() * 5.5;
        const x = Math.random() * width;
        const y = Math.random() * height;

        motes.push({
          x,
          y,
          baseX: x,
          baseY: y,
          vx: (Math.random() - 0.5) * (isSubtle ? 0.18 : 0.35),
          vy: -(0.2 + Math.random() * (isSubtle ? 0.35 : 0.65)),
          radius: r,
          baseRadius: r,
          color: pal.color,
          glowColor: pal.glow,
          alpha: pal.alpha * (isSubtle ? 0.6 : 1),
          baseAlpha: pal.alpha * (isSubtle ? 0.6 : 1),
          pulsePhase: Math.random() * Math.PI * 2,
          pulseSpeed: 0.015 + Math.random() * 0.025,
          sinAmplitude: 15 + Math.random() * 25,
          sinFrequency: 0.001 + Math.random() * 0.002,
          timeOffset: Math.random() * 1000,
        });
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize, { passive: true });

    // Pointer tracking
    const handleMouseMove = (e: MouseEvent) => {
      if (!hasFinePointer) return;
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    };

    const handleMouseLeave = () => {
      mouse.active = false;
      mouse.x = -1000;
      mouse.y = -1000;
    };

    if (hasFinePointer && !isSubtle) {
      window.addEventListener('mousemove', handleMouseMove, { passive: true });
      document.addEventListener('mouseleave', handleMouseLeave);
    }

    // Delta-time RAF render loop
    const render = (currentTime: number) => {
      // 0% CPU consumption on hidden tab
      if (document.visibilityState === 'hidden') {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      const dt = Math.min((currentTime - lastTime) / 1000, 0.1);
      lastTime = currentTime;

      ctx.clearRect(0, 0, width, height);

      const repulsionRadius = 110;
      const repulsionRadiusSq = repulsionRadius * repulsionRadius;

      for (let i = 0; i < motes.length; i++) {
        const m = motes[i];

        // Natural organic drift & oscillation
        m.pulsePhase += m.pulseSpeed;
        const breathing = Math.sin(m.pulsePhase);
        const dynamicAlpha = Math.max(0.04, m.baseAlpha + breathing * (isDark ? 0.25 : 0.08));
        const dynamicRadius = Math.max(1, m.baseRadius + breathing * (isDark ? 1.4 : 0.8));

        // Upward and gentle sideways oscillation
        m.y += m.vy * (dt * 60);
        m.x += (m.vx + Math.sin((currentTime + m.timeOffset) * m.sinFrequency) * 0.4) * (dt * 60);

        // Gentle cursor repulsion (fine pointer only in VIVID mode)
        if (hasFinePointer && !isSubtle && mouse.active) {
          const dx = m.x - mouse.x;
          const dy = m.y - mouse.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < repulsionRadiusSq && distSq > 1) {
            const dist = Math.sqrt(distSq);
            const force = (1 - dist / repulsionRadius) * 2.2;
            m.x += (dx / dist) * force;
            m.y += (dy / dist) * force;
          }
        }

        // Wrap around boundaries
        if (m.y < -30) {
          m.y = height + 20;
          m.x = Math.random() * width;
        } else if (m.y > height + 30) {
          m.y = -20;
        }

        if (m.x < -30) {
          m.x = width + 20;
        } else if (m.x > width + 30) {
          m.x = -20;
        }

        // Draw particle with soft atmospheric glow
        const glowRadius = isDark ? dynamicRadius * 4.2 : dynamicRadius * 2.8;
        const gradient = ctx.createRadialGradient(
          m.x,
          m.y,
          0,
          m.x,
          m.y,
          glowRadius
        );

        gradient.addColorStop(0, `rgba(${m.glowColor}, ${dynamicAlpha * 0.95})`);
        gradient.addColorStop(0.35, `rgba(${m.color}, ${dynamicAlpha * 0.5})`);
        gradient.addColorStop(1, `rgba(${m.color}, 0)`);

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(m.x, m.y, glowRadius, 0, Math.PI * 2);
        ctx.fill();

        // Crisp central core
        ctx.fillStyle = `rgba(${m.color}, ${Math.min(1, dynamicAlpha * 1.6)})`;
        ctx.beginPath();
        ctx.arc(m.x, m.y, isDark ? dynamicRadius * 0.6 : dynamicRadius * 0.45, 0, Math.PI * 2);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      if (hasFinePointer && !isSubtle) {
        window.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, [isStorefront, theme, motionIntensity, enableAnimations]);

  if (!isStorefront || !enableAnimations || motionIntensity === 'OFF') {
    return null;
  }

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-[1] transition-opacity duration-700 ease-out"
      style={{ opacity: 0.88 }}
    />
  );
}

