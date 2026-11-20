'use client';

import React, { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { useApp } from '@/context/AppContext';

// Procedural realistic 3D Roasted Coffee Bean geometry
// Shaped as an authentic oval coffee bean: rounded convex top dome, flatter bottom face,
// sculpted S-curved central crease (furrow: xOffset = 0.08 * Math.sin(y * 3.2)),
// surface micro-displacement, and dual-tone vertex colors (medium-dark roast brown + golden-tan chaff).
export function createCoffeeBeanGeometry(): THREE.BufferGeometry {
  const geo = new THREE.SphereGeometry(1, 64, 64);
  const posAttr = geo.attributes.position;
  const count = posAttr.count;

  const colors = new Float32Array(count * 3);
  const colorChaff = new THREE.Color('#C69C6D'); // golden-tan silver-skin/chaff
  const colorDarkRoast = new THREE.Color('#3D2312'); // medium-dark roast brown
  const colorWarmRoast = new THREE.Color('#5A3821'); // warm medium-dark roast brown
  const colorCreaseEdge = new THREE.Color('#221208'); // caramelized crease border
  const tempColor = new THREE.Color();

  for (let i = 0; i < count; i++) {
    let x = posAttr.getX(i);
    let y = posAttr.getY(i);
    let z = posAttr.getZ(i);

    // 1. Pole tapering at top and bottom tips
    const poleTaper = 1 - 0.12 * Math.pow(Math.abs(y), 2.2);
    x *= poleTaper;
    z *= poleTaper;

    // 2. Authentic oval coffee bean proportions: scale [0.72, 1.0, 0.52]
    x *= 0.72;
    z *= 0.52;

    // 3. Flatter bottom face (z >= 0) vs rounded convex top dome (z < 0)
    const isCreaseSide = z >= -0.05;
    if (z >= 0) {
      z *= 0.68; // flatter bottom face
    } else {
      z *= 1.08; // rounded convex top dome
    }

    // 4. Sculpted S-curved central crease (furrow): xOffset = 0.08 * Math.sin(y * 3.2)
    const xOffset = 0.08 * Math.sin(y * 3.2);
    const distToCrease = Math.abs(x - xOffset);

    let creaseIntensity = 0;
    if (isCreaseSide) {
      const creaseWidth = 0.14;
      if (distToCrease < creaseWidth * 2.2) {
        // Gaussian furrow carve inward along flat face
        const factor = Math.exp(-Math.pow(distToCrease / creaseWidth, 2));
        const poleFalloff = Math.max(0, 1 - Math.pow(Math.abs(y), 3.0));
        const depth = 0.25 * poleFalloff;
        z -= factor * depth;
        creaseIntensity = factor;
      }
    }

    // 5. Subtle organic surface micro-displacement (tactile grain)
    const grain =
      Math.sin(x * 34 + y * 22) * 0.007 +
      Math.sin(z * 38 + x * 26) * 0.005 +
      Math.cos(y * 48 + z * 32) * 0.004;

    x += grain * 0.55;
    y += grain * 0.4;
    z += grain * 0.75;

    posAttr.setXYZ(i, x, y, z);

    // 6. PBR Dual-Tone Crease Colors:
    // Outer roasted hull: #5A3821 blended with #3D2312
    // Inner central groove: signature golden-tan silver-skin/chaff #C69C6D
    const hullBlend = THREE.MathUtils.clamp(
      0.5 + 0.3 * Math.sin(y * 4.5) + 0.2 * Math.cos(x * 7 + z * 5),
      0,
      1
    );
    tempColor.copy(colorWarmRoast).lerp(colorDarkRoast, hullBlend);

    if (creaseIntensity > 0.38) {
      // Golden-tan silver-skin/chaff in the groove
      const chaffBlend = THREE.MathUtils.clamp((creaseIntensity - 0.38) / 0.52, 0, 1);
      tempColor.lerp(colorChaff, chaffBlend * 0.95);
    } else if (creaseIntensity > 0.15) {
      // Caramelized dark roasted ridge before chaff
      const edgeBlend = (creaseIntensity - 0.15) / 0.23;
      tempColor.lerp(colorCreaseEdge, edgeBlend * 0.85);
    }

    colors[i * 3] = tempColor.r;
    colors[i * 3 + 1] = tempColor.g;
    colors[i * 3 + 2] = tempColor.b;
  }

  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  geo.computeVertexNormals();
  return geo;
}

// Single roasted bean mesh with PBR material
export function SingleRoastedBeanMesh({
  geometry,
  material,
  scale = 1,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
}: {
  geometry: THREE.BufferGeometry;
  material: THREE.Material;
  scale?: number | [number, number, number];
  position?: [number, number, number];
  rotation?: [number, number, number];
}) {
  return (
    <mesh
      geometry={geometry}
      material={material}
      position={position}
      rotation={rotation}
      scale={scale}
      castShadow
      receiveShadow
    />
  );
}

// Floating Cluster Scene (1 hero center bean + 2 smaller orbiting beans)
function BeanClusterScene() {
  const beanGeometry = useMemo(() => createCoffeeBeanGeometry(), []);
  const beanMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        vertexColors: true,
        roughness: 0.56,
        metalness: 0.03,
      }),
    []
  );

  const heroRef = useRef<THREE.Group>(null);
  const orbit1Ref = useRef<THREE.Group>(null);
  const orbit2Ref = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    // Smooth cursor-synced rotation damping + gentle auto-rotation
    if (heroRef.current) {
      const targetRotX = -state.pointer.y * 0.35 + Math.sin(state.clock.elapsedTime * 0.6) * 0.12;
      const targetRotY = state.pointer.x * 0.45;
      
      heroRef.current.rotation.x = THREE.MathUtils.damp(heroRef.current.rotation.x, targetRotX, 4.5, delta);
      heroRef.current.rotation.y += delta * 0.45;
      heroRef.current.rotation.z = THREE.MathUtils.damp(heroRef.current.rotation.z, targetRotY * 0.25, 4.0, delta);
    }
    // Gentle orbiting animations with subtle responsiveness
    if (orbit1Ref.current) {
      orbit1Ref.current.rotation.y -= delta * 0.35;
      orbit1Ref.current.rotation.z += delta * 0.15;
    }
    if (orbit2Ref.current) {
      orbit2Ref.current.rotation.y += delta * 0.3;
      orbit2Ref.current.rotation.x -= delta * 0.2;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* 1. Hero Center Roasted Coffee Bean */}
      <group ref={heroRef}>
        <Float speed={2.4} rotationIntensity={0.4} floatIntensity={0.6}>
          <SingleRoastedBeanMesh
            geometry={beanGeometry}
            material={beanMaterial}
            scale={1.42}
            position={[0, 0, 0]}
            rotation={[0.2, 0.4, -0.1]}
          />
        </Float>
      </group>

      {/* 2. Smaller Orbiting Bean (bottom-left / foreground) */}
      <group ref={orbit1Ref} position={[-1.45, -0.65, 0.45]}>
        <Float speed={2.0} rotationIntensity={0.6} floatIntensity={0.8}>
          <SingleRoastedBeanMesh
            geometry={beanGeometry}
            material={beanMaterial}
            scale={0.68}
            position={[0, 0, 0]}
            rotation={[-0.5, 0.8, 0.4]}
          />
        </Float>
      </group>

      {/* 3. Smaller Orbiting Bean (top-right / background) */}
      <group ref={orbit2Ref} position={[1.35, 0.72, -0.35]}>
        <Float speed={1.8} rotationIntensity={0.5} floatIntensity={0.7}>
          <SingleRoastedBeanMesh
            geometry={beanGeometry}
            material={beanMaterial}
            scale={0.58}
            position={[0, 0, 0]}
            rotation={[0.7, -0.6, -0.5]}
          />
        </Float>
      </group>
    </group>
  );
}

// Bounded Interactive 3D Coffee Bean Stage
export default function RoastedCoffeeBeanStage() {
  const { language, theme } = useApp();
  const isDark = theme === 'dark';

  return (
    <div className={`w-full h-[360px] lg:h-[440px] relative rounded-3xl overflow-hidden border shadow-elevated group transition-all duration-300 ${
      isDark
        ? 'bg-gradient-to-b from-[#2B1B10]/40 via-[#15201A] to-[#101713] border-forest-700/50'
        : 'bg-gradient-to-b from-[#2E1F14]/15 via-paper to-forest-100/40 border-forest-200/70'
    }`}>
      {/* 3D Canvas with Warm Studio Lighting */}
      <Canvas
        frameloop="always"
        camera={{ position: [0, 0.2, 4.4], fov: 42 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        dpr={[1, 2]}
      >
        <Suspense fallback={null}>
          {/* Ambient Lighting */}
          <ambientLight intensity={isDark ? 0.45 : 0.7} color={isDark ? '#F5DDC2' : '#FFFFFF'} />
          
          {/* Main Key Sunlight / Warm Studio Light */}
          <directionalLight
            position={[4, 6, 5]}
            intensity={isDark ? 1.8 : 2.2}
            color={isDark ? '#FFD4A3' : '#FFF4E0'}
            castShadow
          />
          
          {/* Rim Lighting (Enhanced warm lantern effect in Dark Mode) */}
          <pointLight
            position={[-4, 2.5, -3]}
            intensity={isDark ? 2.5 : 1.5}
            color={isDark ? '#FF9E4A' : '#D9A066'}
          />
          <directionalLight
            position={[-3, -2, -3]}
            intensity={isDark ? 1.2 : 0.8}
            color={isDark ? '#E06D53' : '#D9A066'}
          />
          {isDark && (
            <pointLight position={[3, -2.5, 2]} intensity={2.0} color="#FFB054" />
          )}

          {/* Environment Preset */}
          <Environment preset={isDark ? 'night' : 'apartment'} />

          {/* Bean Cluster Scene */}
          <BeanClusterScene />

          {/* Interactive Controls (Strictly bounded, zoom disabled) */}
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={Math.PI / 1.3}
            rotateSpeed={0.8}
          />
        </Suspense>
      </Canvas>

      {/* Floating Badge & Interactive Prompt */}
      <div className="absolute top-4 left-4 z-10 pointer-events-none">
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full backdrop-blur-md border text-[11px] font-mono font-semibold shadow-subtle ${
          isDark
            ? 'bg-black/60 border-forest-600/40 text-accent-botanical'
            : 'bg-white/80 border-forest-200 text-accent-botanical'
        }`}>
          <span className="w-2 h-2 rounded-full bg-accent-earth animate-pulse" />
          {language === 'en' ? '3D Dak Nong Basalt Robusta Bean' : 'Hạt Robusta Bazan Đăk Nông 3D'}
        </span>
      </div>

      <div className="absolute bottom-4 right-4 z-10 pointer-events-none">
        <span className={`px-2.5 py-1 rounded-lg backdrop-blur-md border text-[10px] font-mono shadow-subtle ${
          isDark
            ? 'bg-black/60 border-forest-700/50 text-neutral-300'
            : 'bg-white/70 border-forest-200 text-ink-muted'
        }`}>
          {language === 'en' ? 'Drag to rotate 360°' : 'Kéo chuột để xoay 360°'}
        </span>
      </div>
    </div>
  );
}

