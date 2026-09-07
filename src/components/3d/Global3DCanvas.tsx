"use client";

import React, { useState, useEffect, Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sparkles, Preload } from "@react-three/drei";
import { usePathname } from "next/navigation";
import * as THREE from "three";

function AmbientFloatingParticles() {
  const pointsRef = useRef<THREE.Points>(null);

  useFrame((state, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.02;
      pointsRef.current.rotation.x += delta * 0.01;
    }
  });

  return (
    <group ref={pointsRef}>
      <Sparkles
        count={85}
        scale={18}
        size={2.5}
        speed={0.25}
        color="#FFE1B3"
        opacity={0.6}
      />
      <Sparkles
        count={35}
        scale={12}
        size={4.0}
        speed={0.15}
        color="#D4AF37"
        opacity={0.8}
      />
    </group>
  );
}

export default function Global3DCanvas() {
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const isAdmin = pathname?.startsWith("/admin") || pathname?.startsWith("/wp-admin");
  if (isAdmin || !isMounted) return null;

  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden select-none">
      <Canvas
        className="w-full h-full pointer-events-none"
        camera={{ position: [0, 0, 8], fov: 50 }}
        dpr={[1, 2]}
        gl={{
          powerPreference: "high-performance",
          alpha: true,
          antialias: true,
        }}
      >
        <fog attach="fog" args={["#0C0705", 8, 45]} />
        <ambientLight intensity={0.4} />
        <pointLight position={[5, 10, 5]} intensity={0.6} color="#FFE1B3" />

        <Suspense fallback={null}>
          <AmbientFloatingParticles />
          <Preload all />
        </Suspense>
      </Canvas>

      {/* Lớp màng mờ điện ảnh tối sâu */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0C0705]/80 via-transparent to-[#0C0705]/95 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,#0C0705_95%)] opacity-75 pointer-events-none" />
    </div>
  );
}
