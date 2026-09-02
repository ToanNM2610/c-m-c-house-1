"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Icosahedron } from "@react-three/drei";
import * as THREE from "three";

export default function PremiumBean({ isLowPerf = false }: { isLowPerf?: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);

  const timeRef = useRef(0);

  useFrame((state) => {
    if (!meshRef.current) return;
    
    // Lưu trữ thời gian trôi qua để xoay lơ lửng tự động
    timeRef.current += 0.005;

    // Tính toán góc nghiêng dựa trên chuột
    const targetX = (state.pointer.x * Math.PI) / 4;
    const targetY = (state.pointer.y * Math.PI) / 4;

    // Kết hợp xoay tự động và phản hồi chuột
    meshRef.current.rotation.y += (timeRef.current + targetX - meshRef.current.rotation.y) * 0.05;
    meshRef.current.rotation.x += (timeRef.current * 0.4 + targetY - meshRef.current.rotation.x) * 0.05;
    
    meshRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.2;
  });

  return (
    <group position={[0, 0, 0]}>
      <Icosahedron args={[1, 15]} ref={meshRef}>
        <meshPhysicalMaterial
          transmission={isLowPerf ? 0 : 1}
          thickness={isLowPerf ? 0 : 1.5}
          roughness={0.1}
          metalness={0.8}
          clearcoat={isLowPerf ? 0 : 1}
          clearcoatRoughness={0.1}
          color="#1A0F0A"
          emissive="#C5A880"
          emissiveIntensity={isLowPerf ? 0.4 : 0.2}
        />
      </Icosahedron>
    </group>
  );
}
