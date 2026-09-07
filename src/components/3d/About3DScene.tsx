"use client";

import React, { useRef, useEffect, useState, useMemo, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Image as DreiImage } from "@react-three/drei";
import * as THREE from "three";

// Hệ thống hạt bụi sương và đốm sáng dọc đường hầm Z
function TunnelParticles({ count = 200 }) {
  const pointsRef = useRef<THREE.Points>(null);

  const [positions] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 16;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 14;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 40 - 5; // trải dài dọc trục Z từ 15 đến -25
    }
    return [pos];
  }, [count]);

  useFrame((_, delta) => {
    if (!pointsRef.current) return;
    pointsRef.current.rotation.z += delta * 0.04;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        color="#FFD494"
        transparent
        opacity={0.7}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

// 3 Cột mốc không gian 3D của Cẩm Cù House lơ lửng dọc trục Z
function Milestones3D() {
  return (
    <group>
      {/* Cột mốc 1: Chặng 01 - Khởi nguồn sinh thái (Z = 3) */}
      <Float speed={1.8} rotationIntensity={0.2} floatIntensity={0.8} position={[-2.8, 1.2, 3]}>
        <group>
          <mesh position={[0, 0, -0.02]}>
            <planeGeometry args={[2.5, 1.8]} />
            <meshBasicMaterial color="#C5A880" transparent opacity={0.3} />
          </mesh>
          <DreiImage
            url="/uploads/1788246225383-749190969.jpg"
            scale={[2.4, 1.7]}
            transparent
            opacity={0.88}
            radius={0.08}
          />
        </group>
      </Float>

      {/* Cột mốc 2: Chặng 02 - Triết lý cà phê mộc (Z = -6) */}
      <Float speed={1.5} rotationIntensity={0.25} floatIntensity={0.9} position={[3.2, -0.8, -6]}>
        <group>
          <mesh position={[0, 0, -0.02]}>
            <planeGeometry args={[3.0, 2.0]} />
            <meshBasicMaterial color="#C5A880" transparent opacity={0.3} />
          </mesh>
          <DreiImage
            url="/uploads/1788246225385-616703408.jpg"
            scale={[2.9, 1.9]}
            transparent
            opacity={0.88}
            radius={0.08}
          />
        </group>
      </Float>

      {/* Cột mốc 3: Chặng 03 - Ngôi nhà bình yên bên suối (Z = -15) */}
      <Float speed={1.4} rotationIntensity={0.2} floatIntensity={1.0} position={[-3.0, -1.5, -15]}>
        <group>
          <mesh position={[0, 0, -0.02]}>
            <planeGeometry args={[3.6, 2.4]} />
            <meshBasicMaterial color="#C5A880" transparent opacity={0.3} />
          </mesh>
          <DreiImage
            url="/uploads/gallery/1788250253551-943009233.jpg"
            scale={[3.5, 2.3]}
            transparent
            opacity={0.88}
            radius={0.08}
          />
        </group>
      </Float>

      {/* Các khối điêu khắc tinh thể lơ lửng dọc hành trình */}
      <Float speed={1.2} position={[2.5, 2.2, 0]}>
        <mesh>
          <dodecahedronGeometry args={[0.5, 0]} />
          <meshStandardMaterial color="#C5A880" wireframe />
        </mesh>
      </Float>

      <Float speed={1.6} position={[-2.2, -2.5, -10]}>
        <mesh>
          <octahedronGeometry args={[0.7, 0]} />
          <meshStandardMaterial color="#4A5D4E" transparent opacity={0.5} roughness={0.2} metalness={0.6} />
        </mesh>
      </Float>

      <Float speed={1.3} position={[2.8, 1.8, -19]}>
        <mesh>
          <torusGeometry args={[1.2, 0.2, 16, 32]} />
          <meshStandardMaterial color="#C5A880" transparent opacity={0.4} metalness={0.8} />
        </mesh>
      </Float>
    </group>
  );
}

// Camera Z-Drive điều khiển camera lao về phía trước khi cuộn chuột
function ZDriveCamera({ scrollProgress }: { scrollProgress: number }) {
  useFrame((state, delta) => {
    // Camera lao từ Z = 9 xuống Z = -18 theo tiến độ cuộn trang
    const targetZ = THREE.MathUtils.lerp(9, -18, scrollProgress);
    
    // Kết hợp mouse parallax nhẹ
    const mouseX = state.pointer.x * 1.5;
    const mouseY = state.pointer.y * 1.0;

    state.camera.position.x = THREE.MathUtils.damp(state.camera.position.x, mouseX, 3.0, delta);
    state.camera.position.y = THREE.MathUtils.damp(state.camera.position.y, mouseY, 3.0, delta);
    state.camera.position.z = THREE.MathUtils.damp(state.camera.position.z, targetZ, 4.0, delta);

    state.camera.lookAt(0, 0, state.camera.position.z - 8);
  });

  return null;
}

export default function About3DScene() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(
        Boolean(
          window.innerWidth < 768 ||
            window.matchMedia("(pointer: coarse)").matches ||
            "ontouchstart" in window ||
            (navigator.maxTouchPoints && navigator.maxTouchPoints > 0)
        )
      );
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (maxScroll > 0) {
        setScrollProgress(Math.min(1, Math.max(0, scrollY / maxScroll)));
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none z-0">
      <Canvas
        camera={{ position: [0, 0, 9], fov: 50 }}
        dpr={isMobile ? [1, 1.1] : [1, 1.8]}
        gl={{
          antialias: !isMobile,
          alpha: false,
          powerPreference: isMobile ? "default" : "high-performance",
        }}
      >
        <color attach="background" args={["#1A0F0A"]} />
        <fog attach="fog" args={["#1A0F0A", 4, 25]} />

        {/* Ánh sáng vàng trầm ấm */}
        <ambientLight intensity={0.5} color="#F4EFEA" />
        <directionalLight position={[6, 8, 4]} intensity={1.6} color="#C5A880" />
        <pointLight position={[-3, 2, 2]} color="#FFBA75" intensity={2.5} distance={15} />
        <pointLight position={[3, -1, -8]} color="#C5A880" intensity={2.2} distance={18} />
        <pointLight position={[0, 2, -16]} color="#D97706" intensity={3.0} distance={20} />

        <Suspense fallback={null}>
          {/* Giảm 80% số hạt trên mobile (40 hạt) để bảo vệ hiệu năng máy cận cao cấp trở xuống, giữ 200 hạt trên Desktop */}
          <TunnelParticles count={isMobile ? 40 : 200} />
          <Milestones3D />
        </Suspense>

        <ZDriveCamera scrollProgress={scrollProgress} />
      </Canvas>
    </div>
  );
}
