"use client";

import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Icosahedron, Dodecahedron, Sparkles } from "@react-three/drei";
import * as THREE from "three";

export default function PremiumBean({
  isLowPerf = false,
  scrollProgressRef,
  isMobile = false,
}: {
  isLowPerf?: boolean;
  scrollProgressRef?: React.RefObject<number>;
  isMobile?: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const crystalRef = useRef<THREE.Mesh>(null);
  const wireframeRef = useRef<THREE.Mesh>(null);
  const innerCoreRef = useRef<THREE.Mesh>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);

  const currentScaleRef = useRef(1);
  const currentZRef = useRef(0);
  const currentOpacityRef = useRef(1);
  const [opacity, setOpacity] = useState(1);

  const baseScale = isMobile ? 0.95 : 1.25;

  useFrame((state, delta) => {
    const rawOffset = scrollProgressRef?.current ?? 0;
    const offset = Math.min(Math.max(rawOffset, 0), 1);

    // Tiến độ cuộn Hero Section (0.0 -> 0.18)
    const p = Math.min(Math.max(offset / 0.18, 0), 1);

    // Hiệu ứng phóng to và tiến lại gần khi lướt xuống, thu nhỏ lại khi lướt lên
    const targetScale = baseScale * (1.0 + Math.pow(p, 1.2) * 2.8);
    const targetZ = p * 1.8;

    let targetOpacity = 1.0;
    if (p > 0.7) {
      targetOpacity = Math.max(1.0 - (p - 0.7) / 0.3, 0);
    }

    currentScaleRef.current = THREE.MathUtils.damp(currentScaleRef.current, targetScale, 4.5, delta);
    currentZRef.current = THREE.MathUtils.damp(currentZRef.current, targetZ, 4.5, delta);
    currentOpacityRef.current = THREE.MathUtils.damp(currentOpacityRef.current, targetOpacity, 4.5, delta);

    const op = currentOpacityRef.current;
    setOpacity(op);

    if (groupRef.current) {
      groupRef.current.visible = op > 0.005;
      groupRef.current.scale.setScalar(currentScaleRef.current);

      const floatY = Math.sin(state.clock.elapsedTime * 1.6) * 0.08;
      const mouseParallaxX = state.pointer.x * (isMobile ? 0.08 : 0.18);
      const mouseParallaxY = -state.pointer.y * (isMobile ? 0.05 : 0.12);

      groupRef.current.position.set(mouseParallaxX, floatY + mouseParallaxY, currentZRef.current);
    }

    if (crystalRef.current) {
      crystalRef.current.rotation.y += delta * 0.35;
      crystalRef.current.rotation.x += delta * 0.22;
    }

    if (wireframeRef.current) {
      wireframeRef.current.rotation.y += delta * 0.35;
      wireframeRef.current.rotation.x += delta * 0.22;
    }

    if (innerCoreRef.current) {
      innerCoreRef.current.rotation.y -= delta * 0.55;
      innerCoreRef.current.rotation.z += delta * 0.3;
    }

    if (ring1Ref.current) {
      ring1Ref.current.rotation.z += delta * 0.45;
      ring1Ref.current.rotation.x += delta * 0.15;
    }

    if (ring2Ref.current) {
      ring2Ref.current.rotation.y -= delta * 0.35;
      ring2Ref.current.rotation.z += delta * 0.25;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* 1. Quả cầu pha lê đa diện vật lý khúc xạ */}
      <Icosahedron ref={crystalRef} args={[1, isMobile || isLowPerf ? 3 : 4]}>
        <meshPhysicalMaterial
          transmission={isMobile || isLowPerf ? 0.6 : 0.92}
          thickness={isMobile || isLowPerf ? 1.0 : 2.0}
          roughness={0.06}
          metalness={0.2}
          clearcoat={isMobile || isLowPerf ? 0.5 : 1.0}
          clearcoatRoughness={0.08}
          ior={1.54}
          color="#FFF8F0"
          emissive="#C5A880"
          emissiveIntensity={0.3}
          transparent
          opacity={opacity * 0.95}
        />
      </Icosahedron>

      {/* 2. Lưới hình học đa diện vàng kim */}
      <Icosahedron ref={wireframeRef} args={[1.018, 1]}>
        <meshStandardMaterial
          color="#FFE1B3"
          emissive="#C5A880"
          emissiveIntensity={0.65}
          metalness={0.85}
          roughness={0.15}
          wireframe
          transparent
          opacity={opacity * 0.45}
        />
      </Icosahedron>

      {/* 3. Lõi tinh thể hổ phách phát sáng nội bộ */}
      <Dodecahedron ref={innerCoreRef} args={[0.46, 0]}>
        <meshStandardMaterial
          color="#F59E0B"
          emissive="#D97706"
          emissiveIntensity={1.8}
          metalness={0.6}
          roughness={0.25}
          transparent
          opacity={opacity * 0.9}
        />
      </Dodecahedron>

      {/* 4. Nguồn sáng tỏa từ tâm quả cầu */}
      <pointLight color="#FFE5B4" intensity={opacity * 3.2} distance={8} />
      <pointLight color="#F59E0B" intensity={opacity * 1.5} distance={4} />

      {/* 5. Vòng quỹ đạo hoàng kim lơ lửng */}
      <mesh ref={ring1Ref} rotation={[Math.PI / 4, 0, 0]}>
        <torusGeometry args={[1.42, 0.014, 16, 64]} />
        <meshStandardMaterial
          color="#C5A880"
          emissive="#C5A880"
          emissiveIntensity={0.7}
          metalness={0.9}
          roughness={0.1}
          transparent
          opacity={opacity * 0.6}
        />
      </mesh>

      <mesh ref={ring2Ref} rotation={[-Math.PI / 3, Math.PI / 4, 0]}>
        <torusGeometry args={[1.56, 0.01, 16, 64]} />
        <meshStandardMaterial
          color="#FFE1B3"
          emissive="#FFE1B3"
          emissiveIntensity={0.5}
          metalness={0.9}
          roughness={0.1}
          transparent
          opacity={opacity * 0.45}
        />
      </mesh>

      {/* 6. Hạt bụi sáng quanh quả cầu */}
      <Sparkles
        count={isMobile || isLowPerf ? 25 : 65}
        scale={[3.2, 3.2, 3.2]}
        size={isMobile ? 2.5 : 1.8}
        color="#FFE1B3"
        speed={0.4}
        opacity={opacity * 0.7}
      />
    </group>
  );
}
