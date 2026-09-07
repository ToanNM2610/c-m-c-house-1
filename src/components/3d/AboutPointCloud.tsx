"use client";

import React, { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function BotanicalFlowerPointCloud({ count = 3200 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null);
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

  // Tạo tọa độ đám hạt hình hoa Cẩm Cù 5 cánh (Hoya Wax Flower) & hạt cà phê mộc
  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);

    const goldColor = new THREE.Color("#D4AF37");
    const ivoryColor = new THREE.Color("#FFE1B3");
    const deepGoldColor = new THREE.Color("#C5A880");

    for (let i = 0; i < count; i++) {
      // Tọa độ cực phân bố theo 5 cánh hoa cẩm cù
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI * 0.7;
      
      // 5 cánh hoa sao đặc trưng của loài hoa Cẩm Cù
      const petalFactor = 1.0 + 0.42 * Math.cos(5 * theta);
      const r = Math.pow(Math.random(), 0.6) * 2.3 * petalFactor;

      const x = r * Math.cos(theta) * Math.cos(phi);
      const y = r * Math.sin(theta) * Math.cos(phi);
      const z = (Math.random() - 0.5) * 0.9 + Math.sin(r * 2.5) * 0.35;

      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;

      // Pha trộn sắc màu ánh kim
      const mixedColor = Math.random() > 0.6 ? ivoryColor : Math.random() > 0.3 ? goldColor : deepGoldColor;
      col[i * 3] = mixedColor.r;
      col[i * 3 + 1] = mixedColor.g;
      col[i * 3 + 2] = mixedColor.b;
    }

    return [pos, col];
  }, [count]);

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();
    if (pointsRef.current) {
      // Xoay chậm 3D
      pointsRef.current.rotation.y = time * 0.12 + mouseCurrent.current.x * 0.3;
      pointsRef.current.rotation.x = Math.sin(time * 0.08) * 0.15 + mouseCurrent.current.y * 0.2;
      pointsRef.current.rotation.z = time * 0.04;

      // Nhịp thở đàn hồi của cánh hoa
      const breath = 1.0 + Math.sin(time * 1.5) * 0.04;
      pointsRef.current.scale.set(breath, breath, breath);

      // Lerp chuột
      mouseCurrent.current.lerp(mouseTarget.current, 0.05);
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.038}
        vertexColors
        transparent
        opacity={0.85}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

export default function AboutPointCloud() {
  return (
    <div className="w-full h-full pointer-events-none select-none">
      <Canvas
        camera={{ position: [0, 0, 5.5], fov: 48 }}
        dpr={[1, 2]}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={0.5} />
        <BotanicalFlowerPointCloud count={3400} />
      </Canvas>
    </div>
  );
}
