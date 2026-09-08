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
        count={40}
        scale={16}
        size={2.2}
        speed={0.2}
        color="#FFE1B3"
        opacity={0.5}
      />
      <Sparkles
        count={20}
        scale={12}
        size={3.0}
        speed={0.12}
        color="#D4AF37"
        opacity={0.6}
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
          <CelestialCore mode="home" />
        </>
      );
    case "about":
      return (
        <>
          <ambientLight intensity={0.4} />
          <pointLight position={[5, 8, 5]} intensity={1.5} color="#FFE1B3" />
          <pointLight position={[-5, -6, -3]} intensity={0.8} color="#C5A880" />
          <CelestialCore mode="about" />
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
  // Khóa dpr={[1, 1]} trên Mobile / Máy yếu; dpr={[1, 1.5]} trên desktop
  const [dpr, setDpr] = useState(1);

  useEffect(() => {
    setIsMounted(true);
    if (!isMobile) {
      setDpr(1.2);
    }
  }, [isMobile]);

  if (!isMounted || sceneMode === "none") return null;

  return (
    <div
      className="fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden select-none"
      style={{
        transform: "translate3d(0, 0, 0)",
        willChange: "transform",
      }}
    >
      <Canvas
        className="w-full h-full pointer-events-none"
        camera={{ position: [0, 0, isMobile ? 7.0 : 6.2], fov: 50 }}
        dpr={isMobile ? 1 : dpr}
        gl={{
          powerPreference: "high-performance",
          alpha: true,
          antialias: !isMobile && dpr > 1,
          depth: true,
          stencil: false,
        }}
      >
        {!isMobile && (
          <PerformanceMonitor
            onIncline={() => setDpr(1.5)}
            onDecline={() => setDpr(1.0)}
          />
        )}
        <fog attach="fog" args={["#0A0908", 8, 45]} />

        <Suspense fallback={null}>
          <SceneContent />
          <Preload all />
        </Suspense>
      </Canvas>

      {/* Lớp gradient điện ảnh thuần (Không dùng filter blur) */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0A0908]/75 via-transparent to-[#0A0908]/90 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,#0A0908_95%)] opacity-80 pointer-events-none" />
    </div>
  );
}
