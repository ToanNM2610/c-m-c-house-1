"use client";

import React, { useState, useEffect, Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sparkles, Preload, PerformanceMonitor } from "@react-three/drei";
import * as THREE from "three";
import { useCanvas } from "@/context/CanvasContext";
import CelestialCore from "@/components/3d/CelestialCore";
import Globe3DContent from "@/components/3d/Globe3DContent";

function AmbientFloatingParticles() {
  const pointsRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.015;
      pointsRef.current.rotation.x += delta * 0.008;
    }
  });

  return (
    <group ref={pointsRef}>
      <Sparkles
        count={50}
        scale={16}
        size={2.2}
        speed={0.2}
        color="#FFE1B3"
        opacity={0.55}
      />
      <Sparkles
        count={25}
        scale={12}
        size={3.2}
        speed={0.12}
        color="#D4AF37"
        opacity={0.7}
      />
    </group>
  );
}

function SceneContent() {
  const { sceneMode } = useCanvas();

  switch (sceneMode) {
    case "celestial":
      return (
        <>
          <ambientLight intensity={0.4} />
          <pointLight position={[5, 8, 5]} intensity={1.5} color="#FFE1B3" />
          <pointLight position={[-5, -6, -3]} intensity={0.8} color="#C5A880" />
          <CelestialCore />
        </>
      );
    case "globe":
      return <Globe3DContent />;
    case "ambient":
      return (
        <>
          <ambientLight intensity={0.4} />
          <pointLight position={[5, 10, 5]} intensity={0.6} color="#FFE1B3" />
          <AmbientFloatingParticles />
        </>
      );
    case "none":
    default:
      return null;
  }
}

export default function Global3DCanvas() {
  const { sceneMode, isMobile } = useCanvas();
  const [isMounted, setIsMounted] = useState(false);
  const [dpr, setDpr] = useState(1);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted || sceneMode === "none") return null;

  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none z-[-1] overflow-hidden select-none">
      <Canvas
        className="w-full h-full pointer-events-none"
        camera={{ position: [0, 0, isMobile ? 7.0 : 6.2], fov: 50 }}
        dpr={dpr}
        gl={{
          powerPreference: "high-performance",
          alpha: true,
          antialias: dpr > 1, // Disable antialias on low performance
        }}
      >
        <PerformanceMonitor onIncline={() => setDpr(1.5)} onDecline={() => setDpr(1)} />
        <fog attach="fog" args={["#0A0908", 8, 45]} />

        <Suspense fallback={null}>
          <SceneContent />
          <Preload all />
        </Suspense>
      </Canvas>

      {/* Lớp gradient điện ảnh và sương mù hữu cơ */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0A0908]/75 via-transparent to-[#0A0908]/90 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,#0A0908_95%)] opacity-80 pointer-events-none" />
    </div>
  );
}
