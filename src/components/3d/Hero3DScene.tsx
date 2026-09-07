"use client";

import React, { useRef, useMemo, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Image as DreiImage } from "@react-three/drei";
import * as THREE from "three";

// Hệ thống đốm lửa / đom đóm vàng hoàng kim bay lơ lửng trong sương
function FireflySwarm({ count = 240 }) {
  const pointsRef = useRef<THREE.Points>(null);

  const [positions, speeds] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const spd = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 26;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 18;
      pos[i * 3 + 2] = -Math.random() * 26 + 3; // rải từ Z=3 đến Z=-23

      spd[i * 3] = (Math.random() - 0.5) * 0.007;
      spd[i * 3 + 1] = Math.random() * 0.008 + 0.002; // bay lên nhẹ như tàn tro ấm
      spd[i * 3 + 2] = (Math.random() - 0.5) * 0.007;
    }
    return [pos, spd];
  }, [count]);

  useFrame(() => {
    if (!pointsRef.current) return;
    const geo = pointsRef.current.geometry;
    const posAttr = geo.attributes.position;
    const arr = posAttr.array as Float32Array;

    for (let i = 0; i < count; i++) {
      arr[i * 3] += speeds[i * 3];
      arr[i * 3 + 1] += speeds[i * 3 + 1];
      arr[i * 3 + 2] += speeds[i * 3 + 2];

      // Giới hạn không gian lặp lại vô tận
      if (arr[i * 3 + 1] > 9) arr[i * 3 + 1] = -9;
      if (arr[i * 3] > 13) arr[i * 3] = -13;
      if (arr[i * 3] < -13) arr[i * 3] = 13;
    }
    posAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.09}
        color="#FFD494"
        transparent
        opacity={0.8}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

// Các mặt phẳng hình ảnh quán Cẩm Cù ở các độ sâu Z khác nhau (-5, -9, -14, -18, -23)
function FloatingGalleryPlanes() {
  const planes = [
    {
      url: "/uploads/1788246225383-749190969.jpg",
      position: [-3.8, 1.4, -5] as [number, number, number],
      scale: [2.8, 1.9] as [number, number],
      speed: 1.6,
      rot: 0.3,
    },
    {
      url: "/uploads/1788246225385-616703408.jpg",
      position: [4.0, -1.2, -8.5] as [number, number, number],
      scale: [3.4, 2.3] as [number, number],
      speed: 1.4,
      rot: 0.25,
    },
    {
      url: "/uploads/1788246225387-111852556.jpg",
      position: [-4.5, -2.4, -13.5] as [number, number, number],
      scale: [4.2, 2.8] as [number, number],
      speed: 1.8,
      rot: 0.35,
    },
    {
      url: "/uploads/1788246225414-208077574.jpg",
      position: [4.8, 2.6, -17.5] as [number, number, number],
      scale: [4.8, 3.2] as [number, number],
      speed: 1.2,
      rot: 0.2,
    },
    {
      url: "/uploads/gallery/1788250253551-943009233.jpg",
      position: [0, -0.2, -22] as [number, number, number],
      scale: [6.6, 4.2] as [number, number],
      speed: 1.0,
      rot: 0.15,
    },
  ];

  return (
    <group>
      {planes.map((p, idx) => (
        <Float
          key={idx}
          speed={p.speed}
          rotationIntensity={p.rot}
          floatIntensity={0.9}
        >
          <group position={p.position}>
            {/* Khung viền vàng phát sáng nhẹ */}
            <mesh position={[0, 0, -0.02]}>
              <planeGeometry args={[p.scale[0] + 0.08, p.scale[1] + 0.08]} />
              <meshBasicMaterial color="#C5A880" transparent opacity={0.35} />
            </mesh>
            {/* Ảnh quán Cẩm Cù bo góc trong WebGL */}
            <DreiImage
              url={p.url}
              scale={p.scale}
              transparent
              opacity={0.88}
              radius={0.06}
            />
          </group>
        </Float>
      ))}
    </group>
  );
}

// Các khối hình học lơ lửng tạo nét điêu khắc đương đại Awwwards
function FloatingGeometricCrystals() {
  return (
    <group>
      {/* Khối Octahedron xanh rêu rừng Đắk Nông */}
      <Float speed={1.8} rotationIntensity={0.9} floatIntensity={1.0} position={[2.4, 1.8, -4.5]}>
        <mesh>
          <octahedronGeometry args={[0.65, 0]} />
          <meshStandardMaterial color="#4A5D4E" transparent opacity={0.6} roughness={0.3} metalness={0.5} />
        </mesh>
      </Float>

      {/* Khối Icosahedron hổ phách sâu lắng */}
      <Float speed={1.4} rotationIntensity={0.7} floatIntensity={1.1} position={[3.6, -2.8, -12]}>
        <mesh>
          <icosahedronGeometry args={[0.9, 0]} />
          <meshStandardMaterial color="#964B00" transparent opacity={0.5} roughness={0.4} metalness={0.6} />
        </mesh>
      </Float>
    </group>
  );
}

// Điều khiển Camera 3D theo hướng di chuột (Mouse Parallax)
function MouseParallaxCamera() {
  useFrame((state, delta) => {
    // state.pointer chạy từ -1 đến 1
    const targetX = state.pointer.x * 2.2;
    const targetY = state.pointer.y * 1.4;

    // Damping mượt mà 60fps
    state.camera.position.x = THREE.MathUtils.damp(state.camera.position.x, targetX, 3.5, delta);
    state.camera.position.y = THREE.MathUtils.damp(state.camera.position.y, targetY, 3.5, delta);
    state.camera.lookAt(0, 0, -8);
  });

  return null;
}

export default function Hero3DScene() {
  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none select-none">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 50 }}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "high-performance",
        }}
      >
        {/* Nền nâu trầm #1A0F0A đồng bộ toàn site */}
        <color attach="background" args={["#1A0F0A"]} />

        {/* Lớp sương mù cinematic #1A0F0A hòa quyện chiều sâu */}
        <fog attach="fog" args={["#1A0F0A", 5, 27]} />

        {/* Hệ thống chiếu sáng hoàng hôn hoàng kim */}
        <ambientLight intensity={0.55} color="#F4EFEA" />
        <directionalLight position={[7, 11, 5]} intensity={1.8} color="#C5A880" />
        <pointLight position={[-4, 2.5, -3]} color="#FFBA75" intensity={2.8} distance={16} />
        <pointLight position={[4, -1.8, -6]} color="#C5A880" intensity={2.2} distance={18} />
        <pointLight position={[0, 4, -12]} color="#D97706" intensity={3.5} distance={24} />

        <Suspense fallback={null}>
          {/* Đom đóm phát sáng bay lơ lửng */}
          <FireflySwarm count={240} />

          {/* Các mặt phẳng ảnh quán Cẩm Cù ở các độ sâu Z */}
          <FloatingGalleryPlanes />

          {/* Các khối hình học điêu khắc */}
          <FloatingGeometricCrystals />
        </Suspense>

        {/* Camera Parallax tương tác theo chuột */}
        <MouseParallaxCamera />
      </Canvas>
    </div>
  );
}
