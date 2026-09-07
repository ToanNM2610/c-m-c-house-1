"use client";

import React, { useRef, useEffect, useState, Suspense, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sparkles, Float, Image as DreiImage, TorusKnot, Icosahedron, Dodecahedron } from "@react-three/drei";
import { motion, useScroll, useMotionValueEvent, useTransform } from "framer-motion";
import * as THREE from "three";
import Link from "next/link";
import { Coffee, ArrowRight, MapPin, Compass, Sparkles as SparkleIcon, Phone, Clock } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

/**
 * Hook phát hiện thiết bị di động (màn hình < 768px)
 */
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return isMobile;
}

/**
 * Component Khung Ảnh 3D Mờ Viền Nghệ Thuật (Feathered & Cinematic Blend):
 * - Drei <Image /> với radius và zoom.
 * - Mặt nạ shader vignette làm mờ 4 cạnh viền (Alpha Falloff),
 *   tan biến dần vào nền sương mù nâu trầm #1A0F0A.
 */
function FeatheredImage({
  url,
  scale,
  position,
  rotation,
  opacity = 1,
  feather = 0.24,
  zoom = 1,
}: {
  url: string;
  scale: [number, number];
  position: [number, number, number];
  rotation?: [number, number, number];
  opacity?: number;
  feather?: number;
  zoom?: number;
}) {
  const [w, h] = scale;
  const vignetteMatRef = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(
    () => ({
      color: { value: new THREE.Color("#1A0F0A") },
      feather: { value: feather },
      opacity: { value: opacity },
    }),
    [feather]
  );

  useFrame(() => {
    if (vignetteMatRef.current) {
      vignetteMatRef.current.uniforms.opacity.value = opacity;
    }
  });

  return (
    <group position={position} rotation={rotation}>
      {/* 1. Lớp Ảnh Drei Image */}
      <DreiImage
        url={url}
        scale={[w, h]}
        transparent
        opacity={Math.max(opacity * 0.9, 0)}
        radius={0.14}
        zoom={zoom}
        toneMapped={false}
      />

      {/* 2. Mặt nạ Gradient làm mờ 4 mép ảnh vào nền #1A0F0A */}
      <mesh position={[0, 0, 0.015]}>
        <planeGeometry args={[w * 1.03, h * 1.03]} />
        <shaderMaterial
          ref={vignetteMatRef}
          transparent
          depthWrite={false}
          uniforms={uniforms}
          vertexShader={`
            varying vec2 vUv;
            void main() {
              vUv = uv;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `}
          fragmentShader={`
            uniform vec3 color;
            uniform float feather;
            uniform float opacity;
            varying vec2 vUv;
            void main() {
              float fx = smoothstep(0.0, feather, vUv.x) * smoothstep(1.0, 1.0 - feather, vUv.x);
              float fy = smoothstep(0.0, feather, vUv.y) * smoothstep(1.0, 1.0 - feather, vUv.y);
              float vignette = 1.0 - (fx * fy);
              gl_FragColor = vec4(color, vignette * opacity);
            }
          `}
        />
      </mesh>
    </group>
  );
}

/**
 * TẦNG 1: QUẢ CẦU PHA LÊ HÌNH HỌC (GEOMETRIC CRYSTAL POLYHEDRON BALL)
 * - Tọa lạc tại trung tâm Hero Section (position = [0, 0, 0]), lơ lửng phía trên không gian nội thất quán.
 * - Khối Icosahedron khúc xạ ánh sáng (Transmission & Clearcoat) kết hợp lưới hình học wireframe vàng kim.
 * - Lõi Dodecahedron hổ phách phát sáng nội bộ và các vòng quỹ đạo hoàng kim 3D.
 * - HIỆU ỨNG CUỘN TRANG (SCROLL SCALE EFFECT):
 *   + Khi lướt xuống: Quả cầu phóng to dần và tiến lại gần người xem (targetScale tăng mượt, Z tịnh tiến về camera).
 *   + Khi lướt lên: Quả cầu thu nhỏ lại về kích thước chuẩn.
 *   + Tự động mờ dần khi vượt qua Section 1 (offset > 0.16) để nhường chỗ cho Section 2.
 */
function CrystalPolyhedronBall({
  scrollProgressRef,
  isMobile,
}: {
  scrollProgressRef: React.RefObject<number>;
  isMobile: boolean;
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
  const [ballOpacity, setBallOpacity] = useState(1);

  const baseScale = isMobile ? 0.95 : 1.25;

  useFrame((state, delta) => {
    const rawOffset = scrollProgressRef.current ?? 0;
    const offset = Math.min(Math.max(rawOffset, 0), 1);

    // Tiến độ cuộn trong khoảng Hero Section (0.0 -> 0.18)
    const p = Math.min(Math.max(offset / 0.18, 0), 1);

    // HIỆU ỨNG LƯỚT VÀ PHÓNG TO:
    // Khi lướt xuống: Phóng to dần (tăng lũy tiến đến 3.8x) và tịnh tiến Z về phía camera (+1.8)
    // Khi lướt lên: Thu nhỏ lại về baseScale và Z về 0
    const targetScale = baseScale * (1.0 + Math.pow(p, 1.2) * 2.8);
    const targetZ = p * 1.8;

    // Mờ dần tự nhiên khi phóng to cực đại chuẩn bị chuyển sang Section 2
    let targetOpacity = 1.0;
    if (p > 0.7) {
      targetOpacity = Math.max(1.0 - (p - 0.7) / 0.3, 0);
    }

    // Damping mượt mà 60fps không giật lag
    currentScaleRef.current = THREE.MathUtils.damp(currentScaleRef.current, targetScale, 4.5, delta);
    currentZRef.current = THREE.MathUtils.damp(currentZRef.current, targetZ, 4.5, delta);
    currentOpacityRef.current = THREE.MathUtils.damp(currentOpacityRef.current, targetOpacity, 4.5, delta);

    const op = currentOpacityRef.current;
    setBallOpacity(op);

    if (groupRef.current) {
      groupRef.current.visible = op > 0.005;
      groupRef.current.scale.setScalar(currentScaleRef.current);

      // Dao động lơ lửng tự nhiên
      const floatY = Math.sin(state.clock.elapsedTime * 1.6) * 0.08;
      const mouseParallaxX = state.pointer.x * (isMobile ? 0.08 : 0.18);
      const mouseParallaxY = -state.pointer.y * (isMobile ? 0.05 : 0.12);

      groupRef.current.position.set(mouseParallaxX, floatY + mouseParallaxY, currentZRef.current);
    }

    // Xoay các khối hình học đa diện
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
      {/* 1. Quả cầu pha lê đa diện vật lý khúc xạ ánh sáng */}
      <Icosahedron ref={crystalRef} args={[1, isMobile ? 3 : 4]}>
        <meshPhysicalMaterial
          transmission={isMobile ? 0.6 : 0.92}
          thickness={isMobile ? 1.0 : 2.0}
          roughness={0.06}
          metalness={0.2}
          clearcoat={isMobile ? 0.5 : 1.0}
          clearcoatRoughness={0.08}
          ior={1.54}
          color="#FFF8F0"
          emissive="#C5A880"
          emissiveIntensity={0.3}
          transparent
          opacity={ballOpacity * 0.95}
        />
      </Icosahedron>

      {/* 2. Lưới hình học đa diện vàng hoàng kim */}
      <Icosahedron ref={wireframeRef} args={[1.018, 1]}>
        <meshStandardMaterial
          color="#FFE1B3"
          emissive="#C5A880"
          emissiveIntensity={0.65}
          metalness={0.85}
          roughness={0.15}
          wireframe
          transparent
          opacity={ballOpacity * 0.45}
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
          opacity={ballOpacity * 0.9}
        />
      </Dodecahedron>

      {/* 4. Nguồn sáng tỏa từ tâm quả cầu */}
      <pointLight color="#FFE5B4" intensity={ballOpacity * 3.2} distance={8} />
      <pointLight color="#F59E0B" intensity={ballOpacity * 1.5} distance={4} />

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
          opacity={ballOpacity * 0.6}
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
          opacity={ballOpacity * 0.45}
        />
      </mesh>

      {/* 6. Hạt bụi sáng quanh quả cầu */}
      <Sparkles
        count={isMobile ? 25 : 65}
        scale={[3.2, 3.2, 3.2]}
        size={isMobile ? 2.5 : 1.8}
        color="#FFE1B3"
        speed={0.4}
        opacity={ballOpacity * 0.7}
      />
    </group>
  );
}

/**
 * TẦNG 2: BỐ CỤC 1 (ẢNH 1 BÊN - CHỮ 1 BÊN) TẠI Z = -7.5
 * Trên Mobile: Ảnh căn giữa phía trên position=[0, 1.5, 0] để không bị cắt mép màn hình dọc.
 * Trên Desktop: Đặt lệch sang phải position=[2.8, 0.05, 0] khớp hoàn hảo cột HTML bên phải.
 */
function Section2Photo3D({
  scrollProgressRef,
  isMobile,
}: {
  scrollProgressRef: React.RefObject<number>;
  isMobile: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const [opacity, setOpacity] = useState(0);
  const currentOpacityRef = useRef(0);

  useFrame((state, delta) => {
    const rawOffset = scrollProgressRef.current ?? 0;
    const offset = Math.min(Math.max(rawOffset, 0), 1);

    // Xuất hiện trong khoảng scroll 0.16 -> 0.42 (đỉnh cao 0.24 -> 0.35)
    let targetOpacity = 0;
    if (offset >= 0.16 && offset < 0.24) {
      targetOpacity = (offset - 0.16) / 0.08;
    } else if (offset >= 0.24 && offset <= 0.35) {
      targetOpacity = 1;
    } else if (offset > 0.35 && offset <= 0.42) {
      targetOpacity = 1 - (offset - 0.35) / 0.07;
    }

    currentOpacityRef.current = THREE.MathUtils.damp(currentOpacityRef.current, targetOpacity, 4, delta);
    const op = currentOpacityRef.current;
    setOpacity(op);

    if (groupRef.current) {
      groupRef.current.visible = op > 0.005;

      // Mouse Parallax tinh tế
      const targetRotY = state.pointer.x * 0.1;
      const targetRotX = -state.pointer.y * 0.06;
      groupRef.current.rotation.y = THREE.MathUtils.damp(groupRef.current.rotation.y, targetRotY, 3, delta);
      groupRef.current.rotation.x = THREE.MathUtils.damp(groupRef.current.rotation.x, targetRotX, 3, delta);
    }
  });

  const photoPos: [number, number, number] = isMobile ? [0, 1.45, 0] : [2.8, 0.05, 0];
  const photoScale: [number, number] = isMobile ? [2.9, 1.63] : [3.6, 2.05];

  return (
    <group ref={groupRef} position={[0, 0, -7.5]}>
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.4}>
        <FeatheredImage
          url="/uploads/gallery/1788250253551-943009233.jpg"
          scale={photoScale}
          position={photoPos}
          rotation={[-0.02, isMobile ? 0 : -0.12, 0.01]}
          opacity={opacity}
          feather={0.22}
          zoom={1.03}
        />
      </Float>
    </group>
  );
}

/**
 * TẦNG 3: BỐ CỤC 2 (CHỮ Ở GIỮA - ẢNH LƠ LỬNG XUNG QUANH) TẠI Z = -15.5
 * 4 Khung ảnh 3D rải rác xung quanh tâm, bọc TỪNG ảnh trong <Float>.
 * Thu nhỏ bán kính trên Mobile để các ảnh không bị văng ra khỏi màn hình hẹp.
 */
function FloatingParallaxGallery3D({
  scrollProgressRef,
  isMobile,
}: {
  scrollProgressRef: React.RefObject<number>;
  isMobile: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const [opacity, setOpacity] = useState(0);
  const currentOpacityRef = useRef(0);

  useFrame((state, delta) => {
    const rawOffset = scrollProgressRef.current ?? 0;
    const offset = Math.min(Math.max(rawOffset, 0), 1);

    // Xuất hiện trong khoảng scroll 0.36 -> 0.62 (đỉnh cao 0.44 -> 0.54)
    let targetOpacity = 0;
    if (offset >= 0.36 && offset < 0.44) {
      targetOpacity = (offset - 0.36) / 0.08;
    } else if (offset >= 0.44 && offset <= 0.54) {
      targetOpacity = 1;
    } else if (offset > 0.54 && offset <= 0.62) {
      targetOpacity = 1 - (offset - 0.54) / 0.08;
    }

    currentOpacityRef.current = THREE.MathUtils.damp(currentOpacityRef.current, targetOpacity, 4, delta);
    const op = currentOpacityRef.current;
    setOpacity(op);

    if (groupRef.current) {
      groupRef.current.visible = op > 0.005;

      const targetRotY = state.pointer.x * 0.12;
      const targetRotX = -state.pointer.y * 0.08;
      groupRef.current.rotation.y = THREE.MathUtils.damp(groupRef.current.rotation.y, targetRotY, 3, delta);
      groupRef.current.rotation.x = THREE.MathUtils.damp(groupRef.current.rotation.x, targetRotX, 3, delta);
    }
  });

  const p1Pos: [number, number, number] = isMobile ? [-1.6, 2.2, -0.5] : [-3.8, 2.2, -0.5];
  const p2Pos: [number, number, number] = isMobile ? [1.6, -2.4, 0.5] : [3.5, -2.0, 0.5];
  const p3Pos: [number, number, number] = isMobile ? [-1.4, -2.7, -2.5] : [-2.4, -2.6, -2.5];
  const p4Pos: [number, number, number] = isMobile ? [1.5, 2.5, -2.0] : [2.8, 2.4, -2.0];

  const scaleMain: [number, number] = isMobile ? [2.1, 1.18] : [2.6, 1.46];
  const scaleSub: [number, number] = isMobile ? [2.0, 1.12] : [2.5, 1.4];

  return (
    <group ref={groupRef} position={[0, 0, -15.5]}>
      {/* Ảnh 1: Góc TRÊN - TRÁI */}
      <Float speed={2} rotationIntensity={0.5} floatIntensity={1.5}>
        <FeatheredImage
          url="/uploads/gallery/1788250253554-875120458.jpg"
          scale={scaleMain}
          position={p1Pos}
          rotation={[0.06, 0.2, -0.05]}
          opacity={opacity * 0.9}
          feather={0.24}
          zoom={1.02}
        />
      </Float>

      {/* Ảnh 2: Góc DƯỚI - PHẢI */}
      <Float speed={2.2} rotationIntensity={0.5} floatIntensity={1.5}>
        <FeatheredImage
          url="/uploads/gallery/1788250253576-148814823.jpg"
          scale={isMobile ? [2.2, 1.24] : [2.8, 1.575]}
          position={p2Pos}
          rotation={[-0.05, -0.22, 0.04]}
          opacity={opacity * 0.9}
          feather={0.24}
          zoom={1.03}
        />
      </Float>

      {/* Ảnh 3: Góc DƯỚI - TRÁI LÙI SÂU */}
      <Float speed={1.8} rotationIntensity={0.5} floatIntensity={1.5}>
        <FeatheredImage
          url="/uploads/gallery/1788250253564-115851131.jpg"
          scale={scaleSub}
          position={p3Pos}
          rotation={[0.04, 0.15, 0.02]}
          opacity={opacity * 0.65}
          feather={0.32}
          zoom={1.04}
        />
      </Float>

      {/* Ảnh 4: Góc TRÊN - PHẢI LÙI SÂU */}
      <Float speed={2.4} rotationIntensity={0.5} floatIntensity={1.5}>
        <FeatheredImage
          url="/uploads/gallery/1788250253566-618481408.jpg"
          scale={scaleSub}
          position={p4Pos}
          rotation={[-0.04, -0.15, -0.03]}
          opacity={opacity * 0.7}
          feather={0.3}
          zoom={1.04}
        />
      </Float>
    </group>
  );
}

/**
 * TẦNG 4: VÒNG XOÁY NGHỆ THUẬT ABSTRACT TORUS KNOT TẠI Z = -23.5
 */
function AbstractKnot3D({ scrollProgressRef }: { scrollProgressRef: React.RefObject<number> }) {
  const groupRef = useRef<THREE.Group>(null);
  const knotRef = useRef<THREE.Mesh>(null);
  const currentOpacityRef = useRef(0);
  const [opacity, setOpacity] = useState(0);

  useFrame((state, delta) => {
    const rawOffset = scrollProgressRef.current ?? 0;
    const offset = Math.min(Math.max(rawOffset, 0), 1);

    // Xuất hiện trong khoảng scroll 0.58 -> 0.82 (đỉnh cao 0.66 -> 0.76)
    let targetOpacity = 0;
    if (offset >= 0.58 && offset < 0.66) {
      targetOpacity = (offset - 0.58) / 0.08;
    } else if (offset >= 0.66 && offset <= 0.76) {
      targetOpacity = 1;
    } else if (offset > 0.76 && offset <= 0.82) {
      targetOpacity = 1 - (offset - 0.76) / 0.06;
    }

    currentOpacityRef.current = THREE.MathUtils.damp(currentOpacityRef.current, targetOpacity, 4, delta);
    const op = currentOpacityRef.current;
    setOpacity(op);

    if (groupRef.current) {
      groupRef.current.visible = op > 0.005;
      const targetY = 0.4 + (1 - op) * -1.0;
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY, 0.08);
    }

    if (knotRef.current) {
      knotRef.current.rotation.x += delta * 0.28;
      knotRef.current.rotation.y += delta * 0.42;
      knotRef.current.rotation.z = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.15;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0.4, -23.5]}>
      <Float speed={1.8} rotationIntensity={0.2} floatIntensity={0.35}>
        <TorusKnot ref={knotRef} args={[1.5, 0.4, 128, 32]}>
          <meshPhysicalMaterial
            color="#C5A880"
            emissive="#C5A880"
            emissiveIntensity={0.25}
            metalness={0.8}
            roughness={0.2}
            transmission={0.5}
            thickness={0.5}
            wireframe={true}
            transparent
            opacity={opacity * 0.9}
          />
        </TorusKnot>
      </Float>

      <pointLight color="#FFE5B4" intensity={2.8} distance={12} position={[0, 0, 0]} />
      <Sparkles count={55} scale={[5, 5, 5]} size={2.0} color="#C5A880" speed={0.35} />
    </group>
  );
}

/**
 * CƠN LỐC HẠT CÀ PHÊ 3D (INSTANCED MESH):
 * - Desktop: 150 hạt.
 * - Mobile: 40 hạt (tự động thích ứng, chống tràn VRAM).
 */
function FloatingCoffeeBeans({
  count = 150,
  scrollProgressRef,
}: {
  count?: number;
  scrollProgressRef: React.RefObject<number>;
}) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const matRef = useRef<THREE.MeshPhysicalMaterial>(null);
  const currentOpacityRef = useRef(0);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const particles = useMemo(() => {
    return Array.from({ length: count }, () => {
      const radius = 1.4 + Math.pow(Math.random(), 0.7) * 4.8;
      const angle = Math.random() * Math.PI * 2;
      const speed = (0.2 + Math.random() * 0.4) * (Math.random() > 0.5 ? 1 : -1);
      const y = (Math.random() - 0.5) * 8.0;
      const yOscSpeed = 0.5 + Math.random() * 1.5;
      const yOscAmp = 0.15 + Math.random() * 0.35;

      const rotX = Math.random() * Math.PI;
      const rotY = Math.random() * Math.PI;
      const rotZ = Math.random() * Math.PI;
      const rotSpeedX = (Math.random() - 0.5) * 1.2;
      const rotSpeedY = (Math.random() - 0.5) * 1.2;
      const rotSpeedZ = (Math.random() - 0.5) * 0.8;

      const scale = 0.65 + Math.random() * 0.55;

      return {
        radius,
        angle,
        speed,
        y,
        yOscSpeed,
        yOscAmp,
        rotX,
        rotY,
        rotZ,
        rotSpeedX,
        rotSpeedY,
        rotSpeedZ,
        scale,
      };
    });
  }, [count]);

  useFrame((state, delta) => {
    const rawOffset = scrollProgressRef.current ?? 0;
    const offset = Math.min(Math.max(rawOffset, 0), 1);

    // Hiển thị trong khoảng scroll Section 4: 0.58 -> 0.82
    let targetOpacity = 0;
    if (offset >= 0.56 && offset < 0.65) {
      targetOpacity = (offset - 0.56) / 0.09;
    } else if (offset >= 0.65 && offset <= 0.76) {
      targetOpacity = 1;
    } else if (offset > 0.76 && offset <= 0.83) {
      targetOpacity = 1 - (offset - 0.76) / 0.07;
    }

    currentOpacityRef.current = THREE.MathUtils.damp(currentOpacityRef.current, targetOpacity, 4, delta);
    const op = currentOpacityRef.current;

    if (matRef.current) {
      matRef.current.opacity = op;
    }

    if (meshRef.current) {
      meshRef.current.visible = op > 0.005;

      const t = state.clock.getElapsedTime();

      for (let i = 0; i < count; i++) {
        const p = particles[i];

        p.angle += p.speed * delta * 0.5;
        const currentX = Math.cos(p.angle) * p.radius;
        const currentZ = Math.sin(p.angle) * p.radius;
        const currentY = p.y + Math.sin(t * p.yOscSpeed + i) * p.yOscAmp;

        p.rotX += p.rotSpeedX * delta;
        p.rotY += p.rotSpeedY * delta;
        p.rotZ += p.rotSpeedZ * delta;

        dummy.position.set(currentX, currentY, currentZ);
        dummy.rotation.set(p.rotX, p.rotY, p.rotZ);

        // Scale theo tỷ lệ x: 0.6, y: 1.0, z: 0.5 chuẩn hạt cà phê
        dummy.scale.set(p.scale * 0.6, p.scale * 1.0, p.scale * 0.5);
        dummy.updateMatrix();

        meshRef.current.setMatrixAt(i, dummy.matrix);
      }

      meshRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <group position={[0, 0.4, -23.5]}>
      <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
        <sphereGeometry args={[0.38, 20, 16]} />
        <meshPhysicalMaterial
          ref={matRef}
          color="#4A2B18"
          roughness={0.7}
          metalness={0.1}
          clearcoat={0.4}
          clearcoatRoughness={0.3}
          transparent
          opacity={0}
        />
      </instancedMesh>
    </group>
  );
}

/**
 * TẦNG 5: VẦNG HÀO QUANG THIỀN ĐỊNH TẠI Z = -31.5
 */
function SanctuaryHalo3D({ scrollProgressRef }: { scrollProgressRef: React.RefObject<number> }) {
  const haloGroupRef = useRef<THREE.Group>(null);
  const ringOuterRef = useRef<THREE.Mesh>(null);
  const ringInnerRef = useRef<THREE.Mesh>(null);
  const currentOpacityRef = useRef(0);

  useFrame((_, delta) => {
    const rawOffset = scrollProgressRef.current ?? 0;
    const offset = Math.min(Math.max(rawOffset, 0), 1);

    const targetOpacity = Math.min(Math.max((offset - 0.78) / 0.15, 0), 1);
    currentOpacityRef.current = THREE.MathUtils.damp(currentOpacityRef.current, targetOpacity, 4, delta);
    const op = currentOpacityRef.current;

    if (haloGroupRef.current) {
      haloGroupRef.current.visible = op > 0.005;
      haloGroupRef.current.scale.setScalar(0.8 + op * 0.2);
    }

    if (ringOuterRef.current) ringOuterRef.current.rotation.z += delta * 0.18;
    if (ringInnerRef.current) ringInnerRef.current.rotation.z -= delta * 0.3;
  });

  return (
    <group ref={haloGroupRef} position={[0, 0.4, -31.5]}>
      <mesh ref={ringOuterRef}>
        <torusGeometry args={[3.2, 0.035, 16, 120]} />
        <meshStandardMaterial
          color="#C5A880"
          emissive="#C5A880"
          emissiveIntensity={1.5}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>

      <mesh ref={ringInnerRef} rotation={[0.1, 0.1, 0]}>
        <torusGeometry args={[2.8, 0.016, 16, 100]} />
        <meshStandardMaterial
          color="#FFE1B3"
          emissive="#FFE1B3"
          emissiveIntensity={1.9}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>

      <pointLight color="#FFE6C2" intensity={3.0} distance={15} />
    </group>
  );
}

/**
 * ĐIỀU PHỐI ĐƯỜNG BAY CAMERA QUA 5 PHÂN CẢNH DỌC TRỤC Z
 * Thích ứng viewport di động: Lùi camera xa hơn (zOffset +2.5) trên Mobile để không bị cắt mép.
 */
function FlightCameraRig({
  scrollProgressRef,
  isMobile,
}: {
  scrollProgressRef: React.RefObject<number>;
  isMobile: boolean;
}) {
  useFrame((state, delta) => {
    const rawOffset = scrollProgressRef.current ?? 0;
    const offset = Math.min(Math.max(rawOffset, 0), 1);

    // Mouse Parallax 3D (giảm biên độ trên Mobile)
    const mouseX = state.pointer.x;
    const mouseY = state.pointer.y;
    const parallaxFactor = isMobile ? 0.4 : 1.0;
    const parallaxX = mouseX * 0.35 * parallaxFactor;
    const parallaxY = mouseY * 0.22 * parallaxFactor;
    const parallaxRotY = -mouseX * 0.05 * parallaxFactor;
    const parallaxRotX = mouseY * 0.03 * parallaxFactor;

    // Lùi camera thêm 2.5 đơn vị trên Mobile để tăng FOV thị giác
    const zOffset = isMobile ? 2.5 : 0;

    let targetX = 0;
    let targetY = 0;
    let targetZ = 5.0 + zOffset;
    let targetRotY = 0;
    let targetRotZ = 0;

    if (offset < 0.20) {
      // Giai đoạn 1 (Hero)
      const p = offset / 0.20;
      targetX = 0;
      targetY = 0;
      targetZ = (5.0 - p * 4.5) + zOffset;
      targetRotY = 0;
    } else if (offset < 0.40) {
      // Giai đoạn 2 (Bố cục 1: Ảnh 1 bên - Chữ 1 bên)
      // Trên PC: lượn sang trái (targetX = -0.7). Trên Mobile: căn giữa (targetX = 0).
      const p = (offset - 0.20) / 0.20;
      targetX = isMobile ? 0 : -0.7 * Math.sin(p * Math.PI);
      targetY = isMobile ? 0 : 0.1 * Math.sin(p * Math.PI);
      targetZ = (0.5 - p * 8.0) + zOffset;
      targetRotY = isMobile ? 0 : -0.1 * Math.sin(p * Math.PI);
      targetRotZ = isMobile ? 0 : 0.015 * Math.sin(p * Math.PI);
    } else if (offset < 0.60) {
      // Giai đoạn 3 (Bố cục 2: Chữ ở giữa - Ảnh lơ lửng xung quanh)
      const p = (offset - 0.40) / 0.20;
      targetX = 0;
      targetY = 0;
      targetZ = (-7.5 - p * 8.0) + zOffset;
      targetRotY = 0;
      targetRotZ = 0;
    } else if (offset < 0.80) {
      // Giai đoạn 4 (Abstract Knot & Thực đơn)
      const p = (offset - 0.60) / 0.20;
      targetX = 0;
      targetY = 0.1 * Math.sin(p * Math.PI);
      targetZ = (-15.5 - p * 8.0) + zOffset;
      targetRotY = 0;
      targetRotZ = 0;
    } else {
      // Giai đoạn 5 (Lời chào & Vầng hào quang)
      const p = (offset - 0.80) / 0.20;
      targetX = 0;
      targetY = 0;
      targetZ = (-23.5 - p * 6.0) + zOffset;
      targetRotY = 0;
      targetRotZ = 0;
    }

    // Damping mượt mà chuyển động camera
    state.camera.position.x = THREE.MathUtils.damp(state.camera.position.x, targetX + parallaxX, 4, delta);
    state.camera.position.y = THREE.MathUtils.damp(state.camera.position.y, targetY + parallaxY, 4, delta);
    state.camera.position.z = THREE.MathUtils.damp(state.camera.position.z, targetZ, 4, delta);

    state.camera.rotation.y = THREE.MathUtils.damp(state.camera.rotation.y, targetRotY + parallaxRotY, 4, delta);
    state.camera.rotation.x = THREE.MathUtils.damp(state.camera.rotation.x, parallaxRotX, 4, delta);
    state.camera.rotation.z = THREE.MathUtils.damp(state.camera.rotation.z, targetRotZ, 4, delta);
  });

  return null;
}

/**
 * Ánh sáng & Bụi nắng điện ảnh (Cinematic Ambience):
 * Tự động giảm số lượng hạt Sparkles trên Mobile để bảo toàn hiệu năng.
 */
function CinematicAmbience({ isMobile }: { isMobile: boolean }) {
  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight position={[5, 8, 5]} intensity={1.15} color="#FCE7D0" />

      {/* Tia nắng xiên qua mái hiên */}
      <spotLight
        position={[-6, 8, 3]}
        angle={0.42}
        penumbra={1}
        intensity={2.8}
        color="#FFE5B4"
      />
      <pointLight position={[0, 2, 2]} intensity={1.5} color="#C5A880" distance={16} />

      {/* Bụi nắng vàng thích ứng: Giảm 80% trên Mobile để siêu mượt trên máy cận cao cấp trở xuống, Desktop 340 hạt */}
      <Sparkles
        count={isMobile ? 68 : 340}
        scale={[22, 24, 45]}
        size={isMobile ? 2.4 : 1.6}
        color="#FFE1B3"
        speed={0.2}
        opacity={0.65}
      />
      <Sparkles
        count={isMobile ? 30 : 150}
        scale={[15, 16, 35]}
        size={isMobile ? 3.0 : 2.2}
        color="#C5A880"
        speed={0.3}
        opacity={0.5}
      />
    </>
  );
}

/**
 * Toàn bộ Thế giới 3D WebGL
 */
function Unified3DWorld({
  scrollProgressRef,
  isMobile,
}: {
  scrollProgressRef: React.RefObject<number>;
  isMobile: boolean;
}) {
  return (
    <>
      <FlightCameraRig scrollProgressRef={scrollProgressRef} isMobile={isMobile} />
      <CinematicAmbience isMobile={isMobile} />
      <CrystalPolyhedronBall scrollProgressRef={scrollProgressRef} isMobile={isMobile} />
      <Section2Photo3D scrollProgressRef={scrollProgressRef} isMobile={isMobile} />
      <FloatingParallaxGallery3D scrollProgressRef={scrollProgressRef} isMobile={isMobile} />
      <AbstractKnot3D scrollProgressRef={scrollProgressRef} />
      <FloatingCoffeeBeans count={isMobile ? 30 : 150} scrollProgressRef={scrollProgressRef} />
      <SanctuaryHalo3D scrollProgressRef={scrollProgressRef} />
    </>
  );
}

export default function HomePage() {
  const { lang, t, formatPrice } = useLanguage();
  const [isMounted, setIsMounted] = useState(false);
  const isMobile = useIsMobile();
  const scrollProgressRef = useRef<number>(0);

  const { scrollYProgress } = useScroll();

  const heroBgOpacity = useTransform(scrollYProgress, [0, 0.20], [1, 0]);
  const heroBgScale = useTransform(scrollYProgress, [0, 0.20], [1.02, 1.10]);
  const heroContentOpacity = useTransform(scrollYProgress, [0, 0.14], [1, 0]);
  const heroContentY = useTransform(scrollYProgress, [0, 0.14], [0, -25]);
  const heroContentBottomY = useTransform(scrollYProgress, [0, 0.14], [0, 25]);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    scrollProgressRef.current = Math.min(Math.max(latest, 0), 1);
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className="relative w-full bg-[#1A0F0A] text-[#F3E8DB] select-none font-sans">
      {/* ========================================================= */}
      {/* 0. NỀN ẢNH NỘI THẤT QUÁN CẨM CÙ HOUSE CHO HERO SECTION    */}
      {/* ========================================================= */}
      <motion.div
        className="fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden"
        style={{
          opacity: heroBgOpacity,
          scale: heroBgScale,
        }}
      >
        {/* Ảnh nền không gian quán Cẩm Cù House */}
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center"
          style={{
            backgroundImage: `url('/images/hero-interior.jpg')`,
          }}
        />

        {/* Lớp phủ đa tầng điện ảnh: Gradient tối & Vignette làm nổi bật quả cầu 3D & text */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#1A0F0A]/90 via-[#1A0F0A]/55 to-[#1A0F0A]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A0F0A] via-transparent to-[#1A0F0A]/80" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,#1A0F0A_95%)] opacity-85" />
      </motion.div>

      {/* ========================================================= */}
      {/* 1. CANVAS 3D CỐ ĐỊNH TOÀN MÀN HÌNH DUY NHẤT                */}
      {/* DPR thích ứng: [1, 1.1] trên mobile chống giật lag        */}
      {/* ========================================================= */}
      <div className="fixed inset-0 w-full h-full pointer-events-none z-[1] overflow-hidden">
        {isMounted && (
          <Canvas
            className="w-full h-full pointer-events-none"
            camera={{ position: [0, 0, isMobile ? 8 : 5], fov: 60 }}
            dpr={isMobile ? [1, 1.1] : [1, 1.5]}
            gl={{
              powerPreference: isMobile ? "default" : "high-performance",
              antialias: false,
              alpha: true,
            }}
          >
            {/* Không dùng color attach background để nền trong suốt cho ảnh nội thất hiển thị */}
            <fog attach="fog" args={["#1A0F0A", 5, 25]} />

            <Suspense fallback={null}>
              <Unified3DWorld scrollProgressRef={scrollProgressRef} isMobile={isMobile} />
            </Suspense>
          </Canvas>
        )}
      </div>

      {/* ========================================================= */}
      {/* 2. LỚP VĂN BẢN VÀ ĐIỀU HƯỚNG BỐ CỤC ULTRA PREMIUM         */}
      {/* ========================================================= */}
      <div className="relative z-10 w-full">
        
        {/* SECTION 1: HERO (0.00 - 0.20) */}
        <section className="h-screen w-full flex flex-col justify-between items-center py-16 sm:py-20 px-4 sm:px-6 pointer-events-none">
          {/* Cụm Tiêu Đề Trên: Nổi bật trên nền nội thất */}
          <motion.div
            className="text-center pointer-events-auto pt-2 sm:pt-4 flex flex-col items-center"
            style={{ opacity: heroContentOpacity, y: heroContentY }}
          >
            <span className="glass-ultra-pill inline-flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs uppercase tracking-[0.2em] sm:tracking-[0.28em] text-[#C5A880] px-4 sm:px-6 py-2 sm:py-2.5 rounded-full font-sans bg-[#1A0F0A]/85 backdrop-blur-md md:bg-[#1A0F0A]/60 md:backdrop-blur-xl border border-[#C5A880]/30 shadow-xl mb-3 sm:mb-4">
              <SparkleIcon size={12} className="text-[#C5A880]" />
              <span>ARTISAN COFFEE & BOTANICAL SANCTUARY</span>
              <SparkleIcon size={12} className="text-[#C5A880]" />
            </span>

            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-bold tracking-[0.12em] sm:tracking-[0.2em] uppercase text-[#F3E8DB] drop-shadow-[0_4px_30px_rgba(0,0,0,0.95)] select-none">
              <span className="bg-gradient-to-r from-[#FFE1B3] via-[#F4EFEA] to-[#C5A880] bg-clip-text text-transparent">
                CẨM CÙ HOUSE
              </span>
            </h1>

            <p className="text-[10px] sm:text-xs font-mono tracking-[0.3em] uppercase text-[#C5A880]/90 mt-1 sm:mt-2 drop-shadow-md">
              ĐẮK NÔNG • SPECIALTY COFFEE
            </p>
          </motion.div>

          {/* Vùng không gian trung tâm: Quả cầu pha lê hình học 3D lơ lửng phía trên không gian nội thất */}
          <div className="w-full flex-1 pointer-events-none" />

          {/* Cụm Điều Hướng & Mô Tả Dưới */}
          <motion.div
            className="text-center max-w-xl mx-auto pointer-events-auto pb-4 sm:pb-6 flex flex-col items-center"
            style={{ opacity: heroContentOpacity, y: heroContentBottomY }}
          >
            <div className="glass-ultra-pill px-5 sm:px-8 py-3 sm:py-4 rounded-2xl sm:rounded-3xl mb-4 sm:mb-5 bg-[#1A0F0A]/85 backdrop-blur-md md:bg-[#1A0F0A]/60 md:backdrop-blur-xl border border-[#C5A880]/30 shadow-2xl">
              <p className="text-xs sm:text-base font-serif italic text-[#F3E8DB]/95 tracking-wide drop-shadow">
                {t("home.subtitle")}
              </p>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center justify-center gap-3 sm:gap-4 mb-4 sm:mb-5">
              <Link
                href="/menu"
                className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-[#C5A880] hover:bg-[#FFE1B3] text-[#1A0F0A] font-semibold text-xs sm:text-sm uppercase tracking-wider transition-all duration-300 shadow-[0_0_25px_rgba(197,168,128,0.45)] hover:scale-105 cursor-pointer font-sans"
              >
                <Coffee size={14} />
                <span>{lang === "en" ? "Explore Menu" : "Xem Thực Đơn"}</span>
              </Link>
              <Link
                href="/space"
                className="glass-ultra-pill inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl text-[#F3E8DB] hover:text-[#C5A880] font-medium text-xs sm:text-sm uppercase tracking-wider transition-all duration-300 cursor-pointer font-sans border border-[#C5A880]/40 bg-[#1A0F0A]/85 backdrop-blur-md md:bg-[#1A0F0A]/60 md:backdrop-blur-xl hover:border-[#C5A880]"
              >
                <span>{lang === "en" ? "Our Sanctuary" : "Khám Phá Không Gian"}</span>
                <ArrowRight size={13} />
              </Link>
            </div>

            {/* Scroll Indicator */}
            <div className="flex flex-col items-center gap-1.5 text-[#C5A880]/85">
              <span className="text-[9px] sm:text-[10px] uppercase tracking-widest font-mono drop-shadow">{t("home.scrollPrompt")}</span>
              <div className="w-5 h-8 rounded-full border border-[#C5A880]/50 flex items-start justify-center p-1.5 glass-ultra-pill bg-[#1A0F0A]/50 shadow-md">
                <div className="w-1.5 h-2 rounded-full bg-[#C5A880] animate-bounce" />
              </div>
            </div>
          </motion.div>
        </section>

        {/* SECTION 2: BỐ CỤC 1 (ẢNH 1 BÊN - CHỮ 1 BÊN) (0.20 - 0.40) */}
        <section className="h-screen w-full flex items-end md:items-center justify-center pb-8 md:pb-0 px-4 sm:px-12 lg:px-16 max-w-7xl mx-auto pointer-events-none">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-12 w-full items-center">
            
            {/* Cột trái: Khối chữ với Glassmorphism nhẹ sang trọng */}
            <div className="pointer-events-auto glass-ultra max-w-lg p-5 sm:p-8 bg-[#1A0F0A]/85 backdrop-blur-md md:bg-[#1A0F0A]/40 md:backdrop-blur-xl">
              <div className="flex items-center gap-2 mb-2 sm:mb-3">
                <span className="w-2 h-2 rounded-full bg-[#C5A880] animate-pulse" />
                <span className="text-[10px] sm:text-xs uppercase font-mono tracking-[0.25em] text-[#C5A880]">
                  {t("home.sec2Tag")}
                </span>
              </div>

              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-serif text-[#F3E8DB] mb-3 sm:mb-4 leading-tight">
                {t("home.sec2Title")} <br />
                <span className="italic text-[#C5A880] font-light">{t("home.sec2TitleHighlight")}</span>
              </h2>

              <p className="text-xs sm:text-sm font-light text-[#F3E8DB]/85 leading-relaxed mb-3 sm:mb-4">
                {t("home.sec2Desc1")}
              </p>
              <p className="text-xs sm:text-sm font-light text-[#F3E8DB]/70 leading-relaxed mb-5 sm:mb-8 hidden sm:block">
                {t("home.sec2Desc2")}
              </p>

              <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-3 sm:pt-4 border-t border-[#C5A880]/20">
                <Link
                  href="/space"
                  className="glass-ultra-pill inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-2xl text-[11px] sm:text-xs uppercase tracking-wider text-[#C5A880] hover:text-[#1A0F0A] hover:bg-[#C5A880] font-semibold cursor-pointer transition-all duration-300 bg-[#1A0F0A]/85 backdrop-blur-md md:bg-[#1A0F0A]/45 md:backdrop-blur-xl"
                >
                  <span>{t("home.sec2Btn")}</span>
                  <ArrowRight size={13} />
                </Link>

                <div className="glass-ultra-pill flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs font-mono text-[#C5A880]/90 px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-2xl bg-[#1A0F0A]/85 backdrop-blur-md md:bg-[#1A0F0A]/45 md:backdrop-blur-xl">
                  <Compass size={12} />
                  <span>11°58&apos;33&quot;N 107°42&apos;11&quot;E</span>
                </div>
              </div>
            </div>

            {/* Cột phải: Để trống hoàn toàn trên desktop để ảnh 3D Canvas phía sau khớp hoàn hảo */}
            <div className="hidden md:block w-full h-[400px] pointer-events-none" />

          </div>
        </section>

        {/* SECTION 3: BỐ CỤC 2 (CHỮ Ở GIỮA - ẢNH LƠ LỬNG XUNG QUANH) (0.40 - 0.60) */}
        <section className="h-screen w-full flex flex-col items-center justify-center text-center px-4 sm:px-6 pointer-events-none">
          <div className="pointer-events-auto max-w-3xl flex flex-col items-center justify-center">
            <span className="glass-ultra-pill inline-flex items-center gap-2 text-[10px] sm:text-xs uppercase tracking-[0.25em] sm:tracking-[0.3em] text-[#C5A880] px-4 sm:px-6 py-2 rounded-full mb-4 sm:mb-6 font-mono bg-[#1A0F0A]/85 backdrop-blur-md md:bg-[#1A0F0A]/45 md:backdrop-blur-xl">
              {t("home.sec3Badge")}
            </span>
            <h2 className="text-3xl sm:text-6xl lg:text-7xl font-serif text-[#F3E8DB] leading-tight mb-4 sm:mb-6">
              {t("home.sec3Title")} <br />
              <span className="italic font-light text-[#C5A880]">{t("home.sec3TitleHighlight")}</span>
            </h2>
            <div className="glass-ultra-pill px-5 sm:px-8 py-3 sm:py-4 rounded-2xl max-w-xl bg-[#1A0F0A]/85 backdrop-blur-md md:bg-[#1A0F0A]/45 md:backdrop-blur-xl">
              <p className="text-xs sm:text-sm font-light text-[#F3E8DB]/85 leading-relaxed">
                {t("home.sec3Desc")}
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 4: HẠT CÀ PHÊ MỘC & THỰC ĐƠN TUYỂN CHỌN (0.60 - 0.80) */}
        <section className="h-screen w-full flex flex-col justify-between py-12 sm:py-16 px-4 sm:px-12 max-w-7xl mx-auto pointer-events-none">
          <div className="text-center max-w-2xl mx-auto pointer-events-auto glass-ultra-pill px-5 sm:px-8 py-3 sm:py-4 rounded-2xl sm:rounded-3xl bg-[#1A0F0A]/85 backdrop-blur-md md:bg-[#1A0F0A]/45 md:backdrop-blur-xl">
            <span className="text-[10px] sm:text-xs uppercase font-sans tracking-[0.25em] text-[#C5A880] block mb-1 font-medium">
              {t("home.sec4Tag")}
            </span>
            <h2 className="text-xl sm:text-3xl font-serif text-[#F3E8DB]">
              {t("home.sec4Title")}
            </h2>
          </div>

          <div className="w-full flex flex-col items-center gap-3.5 sm:gap-4 pointer-events-auto pb-2 sm:pb-4">
            {/* 3 Thẻ thực đơn Glassmorphism Ultra Premium */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-5 w-full">
              <div className="glass-ultra flex flex-col justify-between cursor-pointer p-4 sm:p-6 bg-[#1A0F0A]/85 backdrop-blur-md md:bg-[#1A0F0A]/40 md:backdrop-blur-xl">
                <div>
                  <div className="flex justify-between items-center mb-1.5 sm:mb-2">
                    <h3 className="font-serif text-base sm:text-lg text-[#F3E8DB]">
                      {lang === "en" ? "Salted Cream Coffee" : "Cà phê muối"}
                    </h3>
                    <span className="text-[11px] sm:text-xs font-mono font-bold text-[#C5A880] px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-xl bg-[#C5A880]/15">
                      {formatPrice("28.000đ")}
                    </span>
                  </div>
                  <p className="text-[11px] sm:text-xs text-[#F3E8DB]/75 font-light leading-relaxed">
                    {lang === "en" ? "Delicate sea salt cream harmonized with rich, firewood-roasted Dak Nong Robusta." : "Vị mặn mòi nhẹ nhàng kết hợp lớp kem béo ngậy và Robusta Đắk Nông rang mộc đậm đà."}
                  </p>
                </div>
              </div>

              <div className="glass-ultra flex flex-col justify-between relative ring-1 ring-[#C5A880]/40 transform md:-translate-y-2 cursor-pointer p-4 sm:p-6 bg-[#1A0F0A]/85 backdrop-blur-md md:bg-[#1A0F0A]/40 md:backdrop-blur-xl">
                <span className="absolute -top-2.5 right-6 text-[8px] sm:text-[9px] uppercase tracking-widest font-mono bg-[#C5A880] text-[#1A0F0A] px-2.5 sm:px-3 py-0.5 rounded-full font-bold shadow-md">
                  {t("home.sec4Badge")}
                </span>
                <div>
                  <div className="flex justify-between items-center mb-1.5 sm:mb-2">
                    <h3 className="font-serif text-base sm:text-lg text-[#F3E8DB]">
                      {lang === "en" ? "Specialty Egg Cream Coffee" : "Cà phê kem trứng"}
                    </h3>
                    <span className="text-[11px] sm:text-xs font-mono font-bold text-[#C5A880] px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-xl bg-[#C5A880]/20">
                      {formatPrice("30.000đ")}
                    </span>
                  </div>
                  <p className="text-[11px] sm:text-xs text-[#F3E8DB]/75 font-light leading-relaxed">
                    {lang === "en" ? "Silky, velvety whipped egg custard atop intense dark roast, awakening the senses." : "Lớp bọt trứng đánh bông mịn sánh quyện thơm lừng, đánh thức mọi giác quan sớm mai."}
                  </p>
                </div>
              </div>

              <div className="glass-ultra flex flex-col justify-between cursor-pointer p-4 sm:p-6 bg-[#1A0F0A]/85 backdrop-blur-md md:bg-[#1A0F0A]/40 md:backdrop-blur-xl">
                <div>
                  <div className="flex justify-between items-center mb-1.5 sm:mb-2">
                    <h3 className="font-serif text-base sm:text-lg text-[#F3E8DB]">
                      {lang === "en" ? "Peach Orange Lemongrass Tea" : "Trà đào cam sả"}
                    </h3>
                    <span className="text-[11px] sm:text-xs font-mono font-bold text-[#C5A880] px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-xl bg-[#C5A880]/15">
                      {formatPrice("30.000đ")}
                    </span>
                  </div>
                  <p className="text-[11px] sm:text-xs text-[#F3E8DB]/75 font-light leading-relaxed">
                    {lang === "en" ? "Crisp botanical tea infused with fresh garden lemongrass and sweet, crunchy peach slices." : "Vị trà thanh thoát, hương sả vườn tự nhiên hòa cùng miếng đào giòn ngọt sảng khoái."}
                  </p>
                </div>
              </div>
            </div>

            <Link
              href="/menu"
              className="glass-ultra-pill inline-flex items-center gap-2 px-5 sm:px-6 py-2 sm:py-2.5 rounded-full text-[11px] sm:text-xs uppercase tracking-widest text-[#C5A880] hover:text-[#F3E8DB] font-medium cursor-pointer mt-1 sm:mt-2 bg-[#1A0F0A]/85 backdrop-blur-md md:bg-[#1A0F0A]/45 md:backdrop-blur-xl"
            >
              <span>{t("home.sec4FullMenu")}</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </section>

        {/* SECTION 5: LỜI CHÀO & ĐẶT BÀN (0.80 - 1.00) */}
        <section className="h-screen w-full flex flex-col justify-between py-10 sm:py-12 px-4 sm:px-12 max-w-6xl mx-auto pointer-events-none">
          <div className="flex-1 flex flex-col items-center justify-center text-center pointer-events-auto">
            <div className="glass-ultra max-w-2xl mx-auto p-6 sm:p-10 bg-[#1A0F0A]/85 backdrop-blur-md md:bg-[#1A0F0A]/40 md:backdrop-blur-xl">
              <span className="text-[10px] sm:text-xs uppercase font-sans tracking-[0.25em] sm:tracking-[0.28em] text-[#C5A880] block mb-2">
                {t("home.sec5Tag")}
              </span>
              <h2 className="text-3xl sm:text-5xl lg:text-6xl font-serif text-[#F3E8DB] mb-3 sm:mb-4">
                Cẩm Cù House
              </h2>
              <p className="text-xs sm:text-sm font-light text-[#F3E8DB]/85 max-w-lg mx-auto leading-relaxed mb-6 sm:mb-8">
                {t("home.sec5Desc")}
              </p>

              <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
                <Link
                  href="/menu"
                  className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl sm:rounded-2xl bg-[#C5A880] hover:bg-[#FFE1B3] text-[#1A0F0A] font-semibold text-xs sm:text-sm uppercase tracking-wider transition-all duration-300 shadow-[0_0_30px_rgba(197,168,128,0.5)] hover:scale-105 cursor-pointer font-sans"
                >
                  <Coffee size={15} />
                  <span>{t("home.sec5MenuBtn")}</span>
                </Link>
                <Link
                  href="/contact"
                  className="glass-ultra-pill inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl sm:rounded-2xl text-[#F3E8DB] font-medium text-xs sm:text-sm uppercase tracking-wider transition-all duration-300 cursor-pointer font-sans hover:border-[#C5A880] bg-[#1A0F0A]/85 backdrop-blur-md md:bg-[#1A0F0A]/45 md:backdrop-blur-xl"
                >
                  <MapPin size={15} className="text-[#C5A880]" />
                  <span>{t("home.sec5ContactBtn")}</span>
                </Link>
              </div>
            </div>
          </div>

          <div className="pointer-events-auto glass-ultra py-3 sm:py-4 px-4 sm:px-6 mt-3 sm:mt-4 bg-[#1A0F0A]/85 backdrop-blur-md md:bg-[#1A0F0A]/40 md:backdrop-blur-xl">
            <div className="flex flex-wrap items-center justify-between gap-3 sm:gap-4 text-[11px] sm:text-xs font-light text-[#F3E8DB]/80">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <MapPin size={13} className="text-[#C5A880]" />
                <span className="line-clamp-1 sm:line-clamp-none">Hẻm 437 Hùng Vương, P. Nghĩa Trung, Gia Nghĩa, Đắk Nông</span>
              </div>

              <div className="flex items-center gap-4 sm:gap-6">
                <div className="flex items-center gap-1.5">
                  <Clock size={12} className="text-[#C5A880]" />
                  <span>07:00 - 22:00</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Phone size={12} className="text-[#C5A880]" />
                  <span>038 285 1688</span>
                </div>
              </div>
            </div>

            <div className="mt-2.5 pt-2.5 border-t border-[#C5A880]/15 flex flex-wrap items-center justify-between gap-2 text-[9px] sm:text-[10px] text-[#F3E8DB]/45 font-mono">
              <span>© 2026 CẨM CÙ HOUSE. ALL RIGHTS RESERVED.</span>
              <span>SMOOTH PERFORMANCE • ADAPTIVE 3D WEBGL</span>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
