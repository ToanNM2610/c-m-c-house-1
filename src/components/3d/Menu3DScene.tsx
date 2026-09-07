"use client";

import React, { useRef, useMemo, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

// Hạt bụi hương cà phê vàng kim bay lơ lửng
function CoffeeAromaParticles({ count = 160 }) {
  const pointsRef = useRef<THREE.Points>(null);

  const [positions] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 22;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 16;
      pos[i * 3 + 2] = -Math.random() * 20 + 1;
    }
    return [pos];
  }, [count]);

  useFrame((_, delta) => {
    if (!pointsRef.current) return;
    pointsRef.current.rotation.y += delta * 0.03;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.09}
        color="#E6C280"
        transparent
        opacity={0.75}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

// Các khối hạt cà phê và tinh thể điêu khắc lơ lửng trong sương
function FloatingCoffeeElements() {
  return (
    <group>
      <Float speed={1.5} rotationIntensity={0.8} floatIntensity={1.2} position={[-4.5, 2.0, -5]}>
        <mesh>
          <sphereGeometry args={[0.7, 16, 16]} />
          <meshStandardMaterial color="#3D2012" roughness={0.4} metalness={0.2} />
        </mesh>
      </Float>

      <Float speed={1.8} rotationIntensity={0.7} floatIntensity={1.0} position={[4.8, -1.8, -7]}>
        <mesh>
          <torusGeometry args={[0.9, 0.25, 16, 32]} />
          <meshStandardMaterial color="#C5A880" wireframe />
        </mesh>
      </Float>

      <Float speed={1.3} rotationIntensity={0.5} floatIntensity={0.9} position={[-3.8, -3.0, -11]}>
        <mesh>
          <dodecahedronGeometry args={[0.8, 0]} />
          <meshStandardMaterial color="#C5A880" transparent opacity={0.35} metalness={0.7} />
        </mesh>
      </Float>

      <Float speed={1.6} rotationIntensity={0.6} floatIntensity={1.1} position={[4.0, 3.2, -14]}>
        <mesh>
          <octahedronGeometry args={[1.0, 0]} />
          <meshStandardMaterial color="#5C3317" roughness={0.3} metalness={0.5} />
        </mesh>
      </Float>
    </group>
  );
}

function MenuCamera() {
  useFrame((state, delta) => {
    const targetX = state.pointer.x * 1.6;
    const targetY = state.pointer.y * 1.0;
    state.camera.position.x = THREE.MathUtils.damp(state.camera.position.x, targetX, 3.0, delta);
    state.camera.position.y = THREE.MathUtils.damp(state.camera.position.y, targetY, 3.0, delta);
    state.camera.lookAt(0, 0, -8);
  });
  return null;
}

export default function Menu3DScene() {
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
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

  return (
    <div
      className="fixed inset-0 w-full h-full pointer-events-none z-0 touch-pan-y"
      style={{ pointerEvents: "none", touchAction: "pan-y" }}
    >
      <Canvas
        camera={{ position: [0, 0, 7], fov: 48 }}
        dpr={isMobile ? [1, 1.1] : [1, 1.8]}
        gl={{
          antialias: !isMobile,
          alpha: false,
          powerPreference: isMobile ? "default" : "high-performance",
        }}
        className="pointer-events-none w-full h-full"
        style={{ pointerEvents: "none", touchAction: "pan-y" }}
      >
        <color attach="background" args={["#1A0F0A"]} />
        <fog attach="fog" args={["#1A0F0A", 4, 25]} />

        <ambientLight intensity={0.5} color="#F4EFEA" />
        <directionalLight position={[6, 9, 5]} intensity={1.6} color="#C5A880" />
        <pointLight position={[-3, 2, -3]} color="#FFBA75" intensity={2.5} distance={15} />
        <pointLight position={[3, -2, -6]} color="#C5A880" intensity={2.0} distance={18} />

        <Suspense fallback={null}>
          {/* Giảm hơn 80% hạt hương cà phê trên mobile (30 hạt) để lướt menu mượt mà, giữ 160 hạt trên Desktop */}
          <CoffeeAromaParticles count={isMobile ? 30 : 160} />
          <FloatingCoffeeElements />
        </Suspense>

        <MenuCamera />
      </Canvas>
    </div>
  );
}
