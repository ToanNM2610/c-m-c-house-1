"use client";

import React, { useRef, useMemo, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Sparkles } from "@react-three/drei";
import * as THREE from "three";

// GLSL 3D Simplex Noise Shader Code
const noiseGLSL = `
// Simplex 3D noise generator
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
varying float vNoise;

void main() {
  vNormal = normalize(normalMatrix * normal);

  // Hiệu ứng gợn sóng nhiễu hạt hữu cơ
  vec3 noiseCoord = position * 1.25 + vec3(uTime * 0.18, uTime * 0.12, uTime * 0.08);
  float noise = snoise(noiseCoord);

  // Tương tác gợn sóng phản ứng theo con trỏ chuột
  float distToMouse = distance(position.xy * 0.5, uMouse);
  float mouseRipple = sin(distToMouse * 6.0 - uTime * 2.5) * exp(-distToMouse * 1.8) * 0.18;

  float displacement = (noise * uDistortion) + mouseRipple;
  vec3 newPosition = position + normal * displacement;

  vPosition = (modelViewMatrix * vec4(newPosition, 1.0)).xyz;
  vNoise = noise;

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
varying float vNoise;

void main() {
  vec3 viewDir = normalize(-vPosition);
  float fresnel = pow(1.0 - max(dot(viewDir, vNormal), 0.0), 2.2);

  // Ánh kim vàng Champagne #D4AF37 chuyển tiếp quang học
  vec3 color = mix(uColorCore, uColorGlow, fresnel);
  color += uColorGlow * pow(fresnel, 3.0) * 1.6;

  // Độ trong suốt mờ dần khi cuộn về cuối trang
  float fade = 1.0 - smoothstep(0.65, 0.98, uScrollProgress);
  float alpha = clamp((fresnel * 0.8 + 0.2) * uOpacity * fade, 0.0, 1.0);

  gl_FragColor = vec4(color, alpha);
}
`;

export interface CelestialCoreProps {
  scrollProgressRef: React.RefObject<number>;
  isMobile: boolean;
}

export default function CelestialCore({ scrollProgressRef, isMobile }: CelestialCoreProps) {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);

  // Vector lưu vị trí chuột mượt mà
  const mouseTarget = useRef(new THREE.Vector2(0, 0));
  const mouseCurrent = useRef(new THREE.Vector2(0, 0));
  const currentScale = useRef(isMobile ? 1.0 : 1.3);

  const { size } = useThree();

  // Tạo ShaderMaterial với Uniforms
  const shaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: celestialVertexShader,
      fragmentShader: celestialFragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2(0, 0) },
        uDistortion: { value: 0.28 },
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
  }, []);

  // Lắng nghe di chuột toàn trang để parallax phản xạ
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      mouseTarget.current.set(x, y);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();
    const scroll = scrollProgressRef.current || 0;

    // Cập nhật Uniforms
    if (shaderMaterial) {
      shaderMaterial.uniforms.uTime.value = time;
      shaderMaterial.uniforms.uScrollProgress.value = scroll;

      // Lerp vị trí chuột mượt mà
      mouseCurrent.current.lerp(mouseTarget.current, 0.05);
      shaderMaterial.uniforms.uMouse.value.copy(mouseCurrent.current);
    }

    if (groupRef.current) {
      // Tự xoay 3 trục nhẹ nhàng (breathe & float)
      groupRef.current.rotation.y = time * 0.12 + mouseCurrent.current.x * 0.35;
      groupRef.current.rotation.x = Math.sin(time * 0.08) * 0.15 + mouseCurrent.current.y * 0.25;
      groupRef.current.rotation.z = Math.cos(time * 0.06) * 0.1;

      // Trôi nổi hữu cơ (Organic Floating Motion)
      groupRef.current.position.y = Math.sin(time * 0.7) * 0.12;

      // Phóng to theo tiến độ cuộn trang (từ 1.2x đến 5.2x)
      const targetScale = (isMobile ? 1.0 : 1.3) + scroll * (isMobile ? 3.2 : 4.6);
      currentScale.current = THREE.MathUtils.lerp(currentScale.current, targetScale, 0.08);
      groupRef.current.scale.setScalar(currentScale.current);

      // Camera dolly nhẹ theo chiều sâu Z
      groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, scroll * 1.8, 0.06);
    }

    // Xoay các vòng quỹ đạo hoàng kim
    if (ring1Ref.current) {
      ring1Ref.current.rotation.x = time * 0.25;
      ring1Ref.current.rotation.y = time * 0.18;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.y = -time * 0.22;
      ring2Ref.current.rotation.z = time * 0.15;
    }
  });

  const sphereRadius = isMobile ? 1.4 : 1.8;

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* 1. Khối Lõi Tinh Thể Hữu Cơ (Organic Celestial Wireframe) */}
      <mesh ref={meshRef} material={shaderMaterial}>
        <icosahedronGeometry args={[sphereRadius, isMobile ? 3 : 4]} />
      </mesh>

      {/* 2. Lớp Lõi Pha Lê Bên Trong (Inner Refractive Crystal Core) */}
      <mesh scale={0.78}>
        <icosahedronGeometry args={[sphereRadius, 2]} />
        <meshPhysicalMaterial
          color="#1A0F0A"
          emissive="#2A1408"
          emissiveIntensity={0.3}
          roughness={0.15}
          metalness={0.2}
          transmission={0.92}
          thickness={1.5}
          ior={1.45}
          transparent
          opacity={0.4}
          wireframe={false}
        />
      </mesh>

      {/* 3. Vòng Quỹ Đạo Hồi Chuyển Hoàng Kim 1 */}
      <mesh ref={ring1Ref} scale={1.25}>
        <torusGeometry args={[sphereRadius * 1.18, 0.012, 16, 100]} />
        <meshBasicMaterial
          color="#D4AF37"
          wireframe
          transparent
          opacity={0.65}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* 4. Vòng Quỹ Đạo Hồi Chuyển Hoàng Kim 2 */}
      <mesh ref={ring2Ref} scale={1.38} rotation={[Math.PI / 3, 0, 0]}>
        <torusGeometry args={[sphereRadius * 1.25, 0.009, 16, 100]} />
        <meshBasicMaterial
          color="#FFE1B3"
          wireframe
          transparent
          opacity={0.5}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* 5. Bụi Sao Vàng Lơ Lửng (Celestial Golden Stardust) */}
      <Sparkles
        count={isMobile ? 45 : 90}
        scale={sphereRadius * 4.2}
        size={isMobile ? 2.0 : 3.0}
        speed={0.35}
        color="#FFE1B3"
        opacity={0.75}
      />
    </group>
  );
}
