"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

// ==========================================
// 3D SUPERNOVA PARTICLES
// ==========================================
function SupernovaParticles({ stage }: { stage: number }) {
  const pointsRef = useRef<THREE.Points>(null);
  
  const { positions, randoms } = useMemo(() => {
    const count = 400;
    const pos = new Float32Array(count * 3);
    const rands = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // Start them tightly packed at center
      pos[i * 3] = (Math.random() - 0.5) * 0.1;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 0.1;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 0.1;
      
      // Random directions for explosion
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos(Math.random() * 2 - 1);
      const speed = 0.5 + Math.random() * 1.5;
      rands[i * 3] = Math.sin(phi) * Math.cos(theta) * speed;
      rands[i * 3 + 1] = Math.sin(phi) * Math.sin(theta) * speed;
      rands[i * 3 + 2] = Math.cos(phi) * speed;
    }
    return { positions: pos, randoms: rands };
  }, []);

  useFrame((state, delta) => {
    if (!pointsRef.current) return;
    const d = Math.min(delta, 0.05);
    
    // Stage 1 (0-1.2s): Gentle pulsing rotation
    // Stage 2 (1.2s-2.5s): Explosion
    // Stage 3 (2.5s+): Warp speed toward camera (z-axis acceleration)

    if (stage >= 2) {
      const posAttr = pointsRef.current.geometry.attributes.position;
      const arr = posAttr.array as Float32Array;
      
      for (let i = 0; i < 400; i++) {
        // Explode outward
        arr[i * 3] += randoms[i * 3] * d * 4;
        arr[i * 3 + 1] += randoms[i * 3 + 1] * d * 4;
        arr[i * 3 + 2] += randoms[i * 3 + 2] * d * 4;
        
        if (stage === 3) {
          // Warp speed toward camera
          arr[i * 3 + 2] += d * 20; 
        }
      }
      posAttr.needsUpdate = true;
    }
    
    pointsRef.current.rotation.y += d * 0.2;
    pointsRef.current.rotation.z += d * 0.1;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#C88A4B"
        transparent
        opacity={0.8}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

// Camera Animation
function IntroCamera({ stage }: { stage: number }) {
  useFrame((state, delta) => {
    const d = Math.min(delta, 0.05);
    if (stage === 2) {
      // Dolly zoom effect - move camera closer
      state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, 2, d * 2);
    } else if (stage === 3) {
      // Warp speed - camera rushes in
      state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, -5, d * 4);
    }
  });
  return null;
}

// ==========================================
// MAIN COMPONENT
// ==========================================
export default function UltraIntro() {
  const [showIntro, setShowIntro] = useState(false);
  const [stage, setStage] = useState(1);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const hasViewed = sessionStorage.getItem("intro_viewed");
    if (!hasViewed) {
      setShowIntro(true);
      sessionStorage.setItem("intro_viewed", "true");
      document.body.style.overflow = "hidden"; // Lock scroll
    }
  }, []);

  useEffect(() => {
    if (!showIntro) return;

    // Stage 1: Counter from 0 to 100
    let progressVal = 0;
    const interval = setInterval(() => {
      progressVal += Math.floor(Math.random() * 10) + 5;
      if (progressVal >= 100) {
        progressVal = 100;
        clearInterval(interval);
      }
      setProgress(progressVal);
    }, 80);

    // Timeline Sequence
    const timer1 = setTimeout(() => setStage(2), 1200); // Trigger Explosion
    const timer2 = setTimeout(() => setStage(3), 2500); // Trigger Warp & Slide up
    const timer3 = setTimeout(() => {
      setShowIntro(false);
      document.body.style.overflow = ""; // Unlock scroll
    }, 3200); // End intro

    return () => {
      clearInterval(interval);
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      document.body.style.overflow = "";
    };
  }, [showIntro]);

  const handleSkip = () => {
    setShowIntro(false);
    document.body.style.overflow = "";
  };

  if (!showIntro) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="ultra-intro"
        initial={{ y: "0%" }}
        animate={{ y: stage === 3 ? "-100%" : "0%" }}
        transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }} // Cinematic slide up
        className="fixed inset-0 z-[99999] bg-[#0a0908] flex items-center justify-center overflow-hidden"
      >
        {/* 3D WebGL Background */}
        <div className="absolute inset-0 z-0">
          <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
            <IntroCamera stage={stage} />
            <SupernovaParticles stage={stage} />
          </Canvas>
        </div>

        {/* HTML UI Overlay */}
        <div className="relative z-10 flex flex-col items-center justify-center w-full h-full pointer-events-none">
          
          {/* Stage 1: Pulsing Dot & Counter */}
          <AnimatePresence>
            {stage === 1 && (
              <motion.div
                key="stage1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 2 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col items-center gap-6"
              >
                <div className="w-3 h-3 rounded-full bg-[#C88A4B] animate-ping shadow-[0_0_20px_#C88A4B]" />
                <div className="flex flex-col items-center gap-2">
                  <div className="text-[#FDFBF7] font-mono text-4xl font-light tracking-tighter">
                    {progress.toString().padStart(2, "0")}%
                  </div>
                  <div className="text-[#C88A4B] font-mono text-[10px] tracking-[0.3em] uppercase">
                    Cẩm Cù House • Gia Nghĩa
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Stage 2 & 3: Mask Split Text Reveal */}
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
                    initial={{ y: "100%" }}
                    animate={{ y: "0%" }}
                    transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
                    className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-[#FDFBF7] to-[#C88A4B] tracking-tight"
                  >
                    CẨM CÙ HOUSE
                  </motion.h1>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Skip Button */}
        <button
          onClick={handleSkip}
          className="absolute bottom-8 right-8 z-20 text-[#FDFBF7]/40 hover:text-[#FDFBF7] font-mono text-[10px] tracking-[0.2em] uppercase transition-colors pointer-events-auto"
        >
          Bỏ qua / Skip
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
