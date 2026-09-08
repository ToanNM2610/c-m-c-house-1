"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

// ==========================================
// 3D MASSIVE SUPERNOVA PARTICLES (GPU Optimized)
// ==========================================
function SupernovaParticles({ stage }: { stage: number }) {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 4500;
  
  const { positions, colors, randoms } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const rands = new Float32Array(count * 3);
    
    const colorPalettes = [
      new THREE.Color("#C88A4B"), // Amber
      new THREE.Color("#E5A96B"), // Gold
      new THREE.Color("#FFF5E1"), // Bright White
      new THREE.Color("#ffffff"), // Pure White
    ];

    for (let i = 0; i < count; i++) {
      // Vortex starting position (distributed in a spherical galaxy)
      const radius = Math.random() * 6 + 1;
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos(Math.random() * 2 - 1);
      
      pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = radius * Math.cos(phi);
      
      const c = colorPalettes[Math.floor(Math.random() * colorPalettes.length)];
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
      
      // Explosion velocity (outward from center multi-directional)
      const speed = 2 + Math.random() * 8;
      rands[i * 3] = Math.sin(phi) * Math.cos(theta) * speed;
      rands[i * 3 + 1] = Math.sin(phi) * Math.sin(theta) * speed;
      rands[i * 3 + 2] = Math.cos(phi) * speed;
    }
    return { positions: pos, colors: col, randoms: rands };
  }, [count]);

  useFrame((state, delta) => {
    if (!pointsRef.current) return;
    const d = Math.min(delta, 0.05);
    
    const posAttr = pointsRef.current.geometry.attributes.position;
    const arr = posAttr.array as Float32Array;
    
    // Global swirl rotation
    if (stage === 1) {
      pointsRef.current.rotation.y += d * 3.0;
      pointsRef.current.rotation.z += d * 1.5;
    } else {
      pointsRef.current.rotation.y += d * 0.5;
    }

    for (let i = 0; i < count; i++) {
      if (stage === 1) {
        // Stage 1 (0-1s): Vortex Swirl - Pull intensely towards center
        arr[i * 3] *= 0.94;
        arr[i * 3 + 1] *= 0.94;
        arr[i * 3 + 2] *= 0.94;
      } else if (stage >= 2) {
        // Stage 2 & 3: Supernova Explosion outward
        const speedMult = stage === 3 ? 3 : 1;
        arr[i * 3] += randoms[i * 3] * d * speedMult;
        arr[i * 3 + 1] += randoms[i * 3 + 1] * d * speedMult;
        arr[i * 3 + 2] += randoms[i * 3 + 2] * d * speedMult;
        
        if (stage === 3) {
          // Hyperspace warp effect (rush into camera z-axis)
          arr[i * 3 + 2] += d * 50; 
        }
      }
    }
    posAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.045}
        vertexColors
        transparent
        opacity={0.9}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}

// ==========================================
// CAMERA ANIMATION
// ==========================================
function IntroCamera({ stage }: { stage: number }) {
  useFrame((state, delta) => {
    const d = Math.min(delta, 0.05);
    if (stage === 2) {
      // Dolly zoom effect - push camera in rapidly
      state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, 2, d * 3);
    } else if (stage === 3) {
      // Warp speed - camera pierces through the explosion
      state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, -8, d * 5);
    }
  });
  return null;
}

// ==========================================
// MAIN COMPONENT
// ==========================================
export default function UltraIntro() {
  // Always start with showIntro = true on mount to run on every reload/F5
  const [showIntro, setShowIntro] = useState(true);
  const [stage, setStage] = useState(1);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Lock scroll on mount
    document.body.style.overflow = "hidden";
    
    // Stage 1: Extreme fast counter from 0 to 100
    let progressVal = 0;
    const interval = setInterval(() => {
      progressVal += Math.floor(Math.random() * 15) + 5;
      if (progressVal >= 100) {
        progressVal = 100;
        clearInterval(interval);
      }
      setProgress(progressVal);
    }, 50);

    // Timeline Sequence
    const timer1 = setTimeout(() => setStage(2), 1000); // Trigger Supernova
    const timer2 = setTimeout(() => setStage(3), 2200); // Trigger Hyperspace & Dissolve
    const timer3 = setTimeout(() => {
      setShowIntro(false);
      document.body.style.overflow = ""; // Unlock scroll
    }, 2800); // End intro

    return () => {
      clearInterval(interval);
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      document.body.style.overflow = "";
    };
  }, []);

  if (!showIntro) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="ultra-intro"
        initial={{ opacity: 1, scale: 1 }}
        animate={stage === 3 ? { opacity: 0, scale: 1.05 } : { opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }} 
        className="fixed inset-0 z-[99999] bg-[#050403] flex items-center justify-center overflow-hidden"
      >
        {/* 3D WebGL Background - Over 4000 particles */}
        <div className="absolute inset-0 z-0">
          <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
            <IntroCamera stage={stage} />
            <SupernovaParticles stage={stage} />
          </Canvas>
        </div>

        {/* HTML UI Overlay */}
        <div className="relative z-10 flex flex-col items-center justify-center w-full h-full pointer-events-none">
          
          {/* Stage 1: Vortex Pulse & Counter */}
          <AnimatePresence>
            {stage === 1 && (
              <motion.div
                key="stage1"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 2.5, filter: "blur(10px)" }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center gap-6"
              >
                <div className="w-4 h-4 rounded-full bg-[#C88A4B] animate-pulse shadow-[0_0_40px_10px_rgba(200,138,75,0.8)]" />
                <div className="flex flex-col items-center gap-2">
                  <div className="text-[#FDFBF7] font-mono text-5xl md:text-6xl font-light tracking-tighter drop-shadow-lg">
                    {progress.toString().padStart(2, "0")}%
                  </div>
                  <div className="text-[#C88A4B] font-mono text-[10px] md:text-xs tracking-[0.4em] uppercase font-bold drop-shadow-md">
                    Cẩm Cù House • Gia Nghĩa
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Stage 2 & 3: Supernova Brand Reveal */}
          <AnimatePresence>
            {stage >= 2 && (
              <motion.div
                key="stage2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.6 }}
                className="absolute inset-0 flex items-center justify-center mix-blend-screen"
              >
                <div className="overflow-hidden">
                  <motion.h1
                    initial={{ y: "100%", opacity: 0 }}
                    animate={{ y: "0%", opacity: 1 }}
                    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                    className="font-serif text-5xl md:text-7xl lg:text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-[#FFF5E1] via-[#E5A96B] to-[#C88A4B] tracking-tight drop-shadow-[0_0_30px_rgba(229,169,107,0.5)]"
                  >
                    CẨM CÙ HOUSE
                  </motion.h1>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
