"use client";

import React, { useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function PulsingCore() {
  const meshRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  const mouseTarget = useRef(new THREE.Vector2(0, 0));
  const mouseCurrent = useRef(new THREE.Vector2(0, 0));

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      mouseTarget.current.set(x, y);
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    mouseCurrent.current.lerp(mouseTarget.current, 0.05);

    if (meshRef.current) {
      // Xoay và ngả về hướng chuột
      meshRef.current.rotation.y = time * 0.2 + mouseCurrent.current.x * 0.5;
      meshRef.current.rotation.x = time * 0.15 - mouseCurrent.current.y * 0.5;

      // Nhịp thở đàn hồi (Breathing Pulse)
      const pulse = 1.0 + Math.sin(time * 1.8) * 0.06;
      meshRef.current.scale.set(pulse, pulse, pulse);
    }

    if (ringRef.current) {
      ringRef.current.rotation.z = time * 0.15;
      ringRef.current.rotation.x = Math.PI / 3 + mouseCurrent.current.y * 0.2;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Khối cầu năng lượng trung tâm */}
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[1.6, 4]} />
        <meshPhysicalMaterial
          color="#120805"
          emissive="#D4AF37"
          emissiveIntensity={0.65}
          roughness={0.12}
          metalness={0.2}
          transmission={0.88}
          thickness={1.4}
          ior={1.4}
          transparent
          opacity={0.85}
          wireframe
        />
      </mesh>

      {/* Lõi phát quang bên trong */}
      <mesh scale={0.7}>
        <sphereGeometry args={[1.4, 32, 32]} />
        <meshBasicMaterial
          color="#FFE1B3"
          transparent
          opacity={0.35}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Vòng hào quang hoàng kim */}
      <mesh ref={ringRef}>
        <torusGeometry args={[2.1, 0.015, 16, 100]} />
        <meshBasicMaterial
          color="#D4AF37"
          wireframe
          transparent
          opacity={0.7}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

export default function GlowingOrb3D() {
  return (
    <div className="w-full h-full pointer-events-none select-none">
      <Canvas
        camera={{ position: [0, 0, 5.2], fov: 48 }}
        dpr={[1, 2]}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={0.4} />
        <pointLight position={[5, 5, 5]} intensity={1.5} color="#FFE1B3" />
        <PulsingCore />
      </Canvas>
    </div>
  );
}
