"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";

// Hàm tạo tọa độ ngẫu nhiên trong hình cầu
function generateSpherePositions(count: number, radius: number): Float32Array {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const u = Math.random();
    const v = Math.random();
    const theta = u * 2.0 * Math.PI;
    const phi = Math.acos(2.0 * v - 1.0);
    const r = Math.cbrt(Math.random()) * radius;
    const sinPhi = Math.sin(phi);
    
    positions[i * 3] = r * sinPhi * Math.cos(theta);
    positions[i * 3 + 1] = r * sinPhi * Math.sin(theta);
    positions[i * 3 + 2] = r * Math.cos(phi);
  }
  return positions;
}

export default function FloatingDust() {
  const goldRef = useRef<THREE.Points>(null);
  const creamRef = useRef<THREE.Points>(null);

  // Mảng 3000 hạt bụi lơ lửng
  const goldPositions = useMemo(() => generateSpherePositions(3000, 4.0), []);

  // Mảng hạt sương (tùy chọn)
  const creamPositions = useMemo(() => generateSpherePositions(1500, 5.0), []);

  useFrame((_, delta) => {
    if (goldRef.current) {
      goldRef.current.rotation.x -= delta * 0.035;
      goldRef.current.rotation.y -= delta * 0.05;
    }
    if (creamRef.current) {
      creamRef.current.rotation.x += delta * 0.025;
      creamRef.current.rotation.y += delta * 0.04;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      {/* Lớp hạt bụi trắng (Debug visibility) */}
      <Points ref={goldRef} positions={goldPositions} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#FFFFFF"
          size={0.15}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={1}
        />
      </Points>

      {/* Lớp hạt sương màu kem ấm cúng (#F4EFEA) */}
      <Points ref={creamRef} positions={creamPositions} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#F4EFEA"
          size={0.028}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.75}
        />
      </Points>
    </group>
  );
}
