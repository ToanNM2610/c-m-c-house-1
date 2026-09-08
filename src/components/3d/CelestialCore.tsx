"use client";

import React, { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Sparkles } from "@react-three/drei";
import * as THREE from "three";
import { useCanvas } from "@/context/CanvasContext";

// GLSL 3D Simplex Noise Shader
const noiseGLSL = `
vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}

float snoise(vec3 v){
  const vec2 C = vec2(1.0/6.0, 1.0/3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

  vec3 i  = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);

  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);

  vec3 x1 = x0 - i1 + 1.0 * C.xxx;
  vec3 x2 = x0 - i2 + 2.0 * C.xxx;
  vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;

  i = mod(i, 289.0);
  vec4 p = permute(permute(permute(
             i.z + vec4(0.0, i1.z, i2.z, 1.0))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0))
           + i.x + vec4(0.0, i1.x, i2.x, 1.0));

  float n_ = 0.142857142857;
  vec3  ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z *ns.z);

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);

  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);

  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;

  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);

  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}
`;

const celestialVertexShader = `
${noiseGLSL}

uniform float uTime;
uniform vec2 uMouse;
uniform float uDistortion;
uniform float uScrollProgress;

varying vec3 vNormal;
varying vec3 vPosition;

void main() {
  vNormal = normalize(normalMatrix * normal);

  vec3 noiseCoord = position * 1.25 + vec3(uTime * 0.16, uTime * 0.10, uTime * 0.07);
  float noise = snoise(noiseCoord);

  float distToMouse = distance(position.xy * 0.5, uMouse);
  float mouseRipple = sin(distToMouse * 5.0 - uTime * 2.0) * exp(-distToMouse * 1.8) * 0.15;

  float displacement = (noise * uDistortion) + mouseRipple;
  vec3 newPosition = position + normal * displacement;

  vPosition = (modelViewMatrix * vec4(newPosition, 1.0)).xyz;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}
`;

const celestialFragmentShader = `
uniform vec3 uColorCore;
uniform vec3 uColorGlow;
uniform float uScrollProgress;
uniform float uOpacity;

varying vec3 vNormal;
varying vec3 vPosition;

void main() {
  vec3 viewDir = normalize(-vPosition);
  float fresnel = pow(1.0 - max(dot(viewDir, vNormal), 0.0), 2.2);

  vec3 color = mix(uColorCore, uColorGlow, fresnel);
  color += uColorGlow * pow(fresnel, 3.0) * 1.5;

  float fade = 1.0 - smoothstep(0.65, 0.98, uScrollProgress);
  float alpha = clamp((fresnel * 0.8 + 0.2) * uOpacity * fade, 0.0, 1.0);

  gl_FragColor = vec4(color, alpha);
}
`;

export interface CelestialCoreProps {
  mode?: "home" | "about";
  scrollProgressRef?: React.RefObject<number>;
  isMobile?: boolean;
}

export default function CelestialCore({
  mode = "home",
  scrollProgressRef: propScrollRef,
  isMobile: propIsMobile,
}: CelestialCoreProps) {
  const canvasCtx = useCanvas();
  const scrollProgressRef = propScrollRef ?? canvasCtx.scrollProgressRef;
  const isMobile = propIsMobile ?? canvasCtx.isMobile;

  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);

  const mouseTarget = useRef(new THREE.Vector2(0, 0));
  const mouseCurrent = useRef(new THREE.Vector2(0, 0));
  const currentScale = useRef(isMobile ? 1.0 : 1.3);
  const currentX = useRef(0);

  // Shader Material tinh giản, Additive Blending
  const shaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: celestialVertexShader,
      fragmentShader: celestialFragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2(0, 0) },
        uDistortion: { value: isMobile ? 0.18 : 0.26 },
        uScrollProgress: { value: 0 },
        uOpacity: { value: 0.95 },
        uColorCore: { value: new THREE.Color("#C5A880") },
        uColorGlow: { value: new THREE.Color("#FFE1B3") },
      },
      wireframe: true,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
  }, [isMobile]);

  useEffect(() => {
    return () => {
      shaderMaterial.dispose();
    };
  }, [shaderMaterial]);

  // Lắng nghe chuột để Parallax nhẹ (chỉ bật trên desktop)
  useEffect(() => {
    if (isMobile) return;
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      mouseTarget.current.set(x, y);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isMobile]);

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();
    const scroll = mode === "home" ? scrollProgressRef.current || 0 : 0;

    // Cập nhật Uniforms
    if (shaderMaterial) {
      shaderMaterial.uniforms.uTime.value = time;
      shaderMaterial.uniforms.uScrollProgress.value = scroll;
      if (!isMobile) {
        mouseCurrent.current.lerp(mouseTarget.current, 0.05);
        shaderMaterial.uniforms.uMouse.value.copy(mouseCurrent.current);
      }
    }

    if (groupRef.current) {
      // Xác định vị trí mục tiêu:
      // Home: ở giữa (x = 0)
      // About: chuyển khối 3D sang xoay nhẹ nhàng ở góc phải (x = 2.4 trên PC, 0 trên Mobile)
      const targetX = mode === "about" ? (isMobile ? 0 : 2.4) : 0;
      currentX.current = THREE.MathUtils.lerp(currentX.current, targetX, 0.04);
      groupRef.current.position.x = currentX.current;

      // Xoay 3 trục mộc mạc và mềm mại
      groupRef.current.rotation.y = time * 0.045 + mouseCurrent.current.x * 0.15;
      groupRef.current.rotation.x = Math.sin(time * 0.03) * 0.08 + mouseCurrent.current.y * 0.12;
      groupRef.current.rotation.z = Math.cos(time * 0.02) * 0.04;

      // Trôi nổi hữu cơ
      groupRef.current.position.y = Math.sin(time * 0.28) * 0.08;

      // Phóng to theo tiến độ cuộn trang (khi ở trang chủ)
      const baseScale = isMobile ? 1.0 : 1.3;
      const targetScale = mode === "home"
        ? baseScale + scroll * (isMobile ? 3.0 : 4.2)
        : baseScale;
      currentScale.current = THREE.MathUtils.lerp(currentScale.current, targetScale, 0.08);
      groupRef.current.scale.setScalar(currentScale.current);

      groupRef.current.position.z = THREE.MathUtils.lerp(
        groupRef.current.position.z,
        scroll * 1.5,
        0.06
      );
    }

    // Xoay các vòng quỹ đạo
    if (ring1Ref.current) {
      ring1Ref.current.rotation.x = time * 0.22;
      ring1Ref.current.rotation.y = time * 0.16;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.y = -time * 0.2;
      ring2Ref.current.rotation.z = time * 0.14;
    }
  });

  const sphereRadius = isMobile ? 1.3 : 1.7;
  // Giảm 70% số đỉnh trên mobile (detail 1 thay vì 4)
  const sphereDetail = isMobile ? 1 : 3;

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* 1. Khối Lõi Tinh Thể Khung Dây Hữu Cơ */}
      <mesh ref={meshRef} material={shaderMaterial}>
        <icosahedronGeometry args={[sphereRadius, sphereDetail]} />
      </mesh>

      {/* 2. Lõi trong: Sử dụng vật liệu nhẹ không tốn render target trên mobile */}
      <mesh scale={0.8}>
        <icosahedronGeometry args={[sphereRadius, isMobile ? 1 : 2]} />
        {isMobile ? (
          <meshBasicMaterial
            color="#1A0F0A"
            transparent
            opacity={0.3}
            wireframe
          />
        ) : (
          <meshStandardMaterial
            color="#1A0F0A"
            emissive="#2A1408"
            emissiveIntensity={0.2}
            roughness={0.4}
            metalness={0.5}
            transparent
            opacity={0.4}
          />
        )}
      </mesh>

      {/* 3. Vòng Quỹ Đạo Hoàng Kim 1 */}
      <mesh ref={ring1Ref} scale={1.22}>
        <torusGeometry args={[sphereRadius * 1.15, 0.01, isMobile ? 8 : 16, isMobile ? 32 : 80]} />
        <meshBasicMaterial
          color="#D4AF37"
          wireframe
          transparent
          opacity={0.6}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* 4. Vòng Quỹ Đạo Hoàng Kim 2 */}
      <mesh ref={ring2Ref} scale={1.35} rotation={[Math.PI / 3, 0, 0]}>
        <torusGeometry args={[sphereRadius * 1.22, 0.008, isMobile ? 8 : 16, isMobile ? 32 : 80]} />
        <meshBasicMaterial
          color="#FFE1B3"
          wireframe
          transparent
          opacity={0.45}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* 5. Bụi Sao Vàng Lơ Lửng (Giảm số lượng trên mobile) */}
      <Sparkles
        count={isMobile ? 25 : 60}
        scale={sphereRadius * 3.8}
        size={isMobile ? 1.8 : 2.6}
        speed={0.3}
        color="#FFE1B3"
        opacity={0.65}
      />
    </group>
  );
}
