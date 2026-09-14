"use client";

import React, { useRef, useMemo, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Sparkles } from "@react-three/drei";
import { useScene } from "@/context/SceneContext";
import { MathUtils } from "three";

export default function Atmosphere() {
  const { introState } = useScene();
  const fogRef = useRef<THREE.Fog>(null);
  
  // Responsive particle count
  const [particleCount, setParticleCount] = useState(300);

  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    setParticleCount(isMobile ? 100 : 300);
  }, []);

  const targetFog = useMemo(() => {
    switch(introState) {
      case "darkness":
      case "light":
        return { color: new THREE.Color("#0a0908"), near: 0, far: 2 };
      case "reveal":
        return { color: new THREE.Color("#110c0a"), near: 2, far: 12 };
      case "enter":
      case "done":
      default:
        return { color: new THREE.Color("#1c1613"), near: 5, far: 20 };
    }
  }, [introState]);

  useFrame((_, delta) => {
    const d = Math.min(delta, 0.05);
    if (fogRef.current) {
      fogRef.current.color.lerp(targetFog.color, d * 1.5);
      fogRef.current.near = MathUtils.lerp(fogRef.current.near, targetFog.near, d * 1.5);
      fogRef.current.far = MathUtils.lerp(fogRef.current.far, targetFog.far, d * 1.5);
    }
  });
  
  return (
    <>
      {/* @ts-ignore - fiber types for fog can be finicky with ref */}
      <fog ref={fogRef} attach="fog" args={["#0a0908", 0, 2]} />
      
      {/* Floating Dust Particles to create atmospheric depth */}
      {introState !== "darkness" && (
        <Sparkles 
          count={particleCount}
          scale={12} 
          size={introState === "light" ? 3 : 1.5} 
          speed={0.2} 
          opacity={0.15} 
          color="#ffe2c4"
          noise={1.5}
        />
      )}
    </>
  );
}
