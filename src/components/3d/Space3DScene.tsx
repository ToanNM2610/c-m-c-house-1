"use client";

import React, { useRef, useMemo, useEffect, useState, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

// Hệ thống hạt lá cây / đom đóm rừng phản hồi gia tốc cuộn chuột (Wind-responsive)
function WindResponsiveParticles({ count = 280, scrollVelocity }: { count?: number; scrollVelocity: number }) {
  const pointsRef = useRef<THREE.Points>(null);

  const [positions, baseSpeeds] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const spd = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 28;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = -Math.random() * 25 + 2;

      spd[i * 3] = (Math.random() - 0.5) * 0.006;
      spd[i * 3 + 1] = -(Math.random() * 0.008 + 0.003); // rơi nhẹ xuống như lá rừng
      spd[i * 3 + 2] = (Math.random() - 0.5) * 0.006;
    }
    return [pos, spd];
  }, [count]);

  const windFactor = useRef(0);

  useFrame((_, delta) => {
    if (!pointsRef.current) return;
    const geo = pointsRef.current.geometry;
    const posAttr = geo.attributes.position;
    const arr = posAttr.array as Float32Array;

    // Damping lực gió từ gia tốc cuộn chuột
    windFactor.current = THREE.MathUtils.damp(windFactor.current, scrollVelocity * 0.02, 4.0, delta);

    for (let i = 0; i < count; i++) {
      // Hạt bị kéo dạt theo gió cuộn chuột (hướng X và Y)
      arr[i * 3] += baseSpeeds[i * 3] + windFactor.current * 0.4;
      arr[i * 3 + 1] += baseSpeeds[i * 3 + 1] - Math.abs(windFactor.current) * 0.8;
      arr[i * 3 + 2] += baseSpeeds[i * 3 + 2];

      // Tái lập chu kỳ khi hạt rơi ra khỏi khung nhìn
      if (arr[i * 3 + 1] < -10) arr[i * 3 + 1] = 10;
      if (arr[i * 3 + 1] > 10) arr[i * 3 + 1] = -10;
      if (arr[i * 3] > 14) arr[i * 3] = -14;
      if (arr[i * 3] < -14) arr[i * 3] = 14;
    }
    posAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.11}
        color="#E5C287"
        transparent
        opacity={0.8}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}



export default function Space3DScene() {
  const [scrollVelocity, setScrollVelocity] = useState(0);

  useEffect(() => {
    let lastScroll = window.scrollY;
    let lastTime = performance.now();

    const handleScroll = () => {
      const now = performance.now();
      const currentScroll = window.scrollY;
      const dt = Math.max(1, now - lastTime);
      const vel = (currentScroll - lastScroll) / dt;
      setScrollVelocity(Math.min(15, Math.max(-15, vel * 10)));
      lastScroll = currentScroll;
      lastTime = now;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none z-0">
      <Canvas
        camera={{ position: [0, 0, 7], fov: 48 }}
        dpr={[1, 1.8]}
        gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
      >
        <color attach="background" args={["#1A0F0A"]} />
        <fog attach="fog" args={["#1A0F0A", 5, 26]} />

        <ambientLight intensity={0.5} color="#F4EFEA" />
        <directionalLight position={[7, 10, 5]} intensity={1.8} color="#C5A880" />
        <pointLight position={[-4, 2, -4]} color="#FFBA75" intensity={2.5} distance={16} />
        <pointLight position={[4, -2, -7]} color="#C5A880" intensity={2.2} distance={18} />

        <Suspense fallback={null}>
          <WindResponsiveParticles count={280} scrollVelocity={scrollVelocity} />
        </Suspense>
      </Canvas>
    </div>
  );
}
