"use client";

import React, { useRef, useMemo, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { usePathname } from "next/navigation";
import * as THREE from "three";

// ==========================================
// ORGANIC FACETED WIREFRAME
// Xuất hiện trên tất cả trang, thay đổi vị trí/scale theo route
// ==========================================
function OrganicWireframe({ pathname }: { pathname: string }) {
  const meshRef = useRef<THREE.Group>(null);
  const innerRef = useRef<THREE.Mesh>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const scrollProgress = useRef(0);

  // Reusable target vectors to avoid GC pressure
  const targetPos = useRef(new THREE.Vector3(0, 0, 0));
  const targetScaleVec = useRef(new THREE.Vector3(1, 1, 1));

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    // Sync with Lenis scroll or native scroll
    const onScroll = () => {
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      scrollProgress.current = Math.min(window.scrollY / maxScroll, 1);
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // Pre-compute geometry once (reused across lifecycle)
  const { lineGeo, pointGeo } = useMemo(() => {
    const ico = new THREE.IcosahedronGeometry(1.6, 1);
    const wireGeo = new THREE.WireframeGeometry(ico);
    return { lineGeo: wireGeo, pointGeo: ico };
  }, []);

  useFrame((_, delta) => {
    if (!meshRef.current) return;

    // Clamped delta to prevent large jumps on tab switch
    const d = Math.min(delta, 0.05);

    // Natural organic rotation
    meshRef.current.rotation.y += d * 0.18;
    meshRef.current.rotation.x += d * 0.08;

    if (innerRef.current) {
      innerRef.current.rotation.y -= d * 0.25;
      innerRef.current.rotation.z += d * 0.12;
    }

    // Route-based position/scale targets
    let tX = 0, tY = 0, tZ = 0;
    let tScale = 1.0;
    const sp = scrollProgress.current;
    const mx = mouse.current.x;
    const my = mouse.current.y;

    if (pathname === "/") {
      // Home: center, responds to mouse + scroll
      tX = mx * 0.4;
      tY = my * 0.3 - sp * 1.2;
      tZ = sp * 0.8;
      tScale = 1.1 + sp * 0.3;
    } else if (pathname === "/about") {
      // About: drift to right, smaller
      tX = 1.8 + mx * 0.15;
      tY = -0.3 + my * 0.1;
      tZ = -0.5;
      tScale = 0.65;
    } else if (pathname === "/space") {
      // Space: pushed far back, very subtle
      tX = -3.0 + mx * 0.1;
      tY = 1.0 + my * 0.1;
      tZ = -8.0;
      tScale = 0.4;
    } else if (pathname === "/menu") {
      // Menu: top-right corner, dim
      tX = 2.0 + mx * 0.08;
      tY = 0.9 + my * 0.05;
      tZ = -8.0;
      tScale = 0.45;
    } else if (pathname === "/contact") {
      // Contact: far left, complements the globe
      tX = -2.2;
      tY = -0.5;
      tZ = -1.5;
      tScale = 0.35;
    } else {
      tScale = 0.001;
    }

    // Smooth interpolation (lerp factor based on clamped delta)
    const lerpSpeed = d * 3.0;
    targetPos.current.set(tX, tY, tZ);
    targetScaleVec.current.set(tScale, tScale, tScale);

    meshRef.current.position.lerp(targetPos.current, lerpSpeed);
    meshRef.current.scale.lerp(targetScaleVec.current, lerpSpeed);
  });

  return (
    <group ref={meshRef}>
      {/* Golden wireframe edges */}
      <lineSegments geometry={lineGeo}>
        <lineBasicMaterial color="#C88A4B" transparent opacity={0.6} linewidth={1} />
      </lineSegments>

      {/* Vertex dots */}
      <points geometry={pointGeo}>
        <pointsMaterial color="#FDFBF7" size={0.055} transparent opacity={0.75} sizeAttenuation />
      </points>

      {/* Inner core mesh */}
      <mesh ref={innerRef}>
        <icosahedronGeometry args={[0.9, 0]} />
        <meshBasicMaterial color="#2D4A3E" wireframe transparent opacity={0.35} />
      </mesh>
    </group>
  );
}

// ==========================================
// INTERACTIVE DOT GLOBE (Contact page focus)
// ==========================================
function InteractiveDotGlobe({ active }: { active: boolean }) {
  const globeRef = useRef<THREE.Group>(null);
  const pulseRef = useRef<THREE.Mesh>(null);

  // Pre-compute globe points and Gia Nghĩa coordinates
  const { pointsGeo, dakNongCoords } = useMemo(() => {
    const count = 800; // Reduced from 950 for better perf
    const radius = 1.8;
    const positions = new Float32Array(count * 3);
    const phi = Math.PI * (Math.sqrt(5) - 1);

    for (let i = 0; i < count; i++) {
      const y = 1 - (i / (count - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const theta = phi * i;
      positions[i * 3] = Math.cos(theta) * r * radius;
      positions[i * 3 + 1] = y * radius;
      positions[i * 3 + 2] = Math.sin(theta) * r * radius;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    // Gia Nghĩa, Đắk Nông: 11.99° N, 107.69° E
    const lat = 11.99 * (Math.PI / 180);
    const lon = 107.69 * (Math.PI / 180);
    const gx = radius * Math.cos(lat) * Math.sin(lon);
    const gy = radius * Math.sin(lat);
    const gz = radius * Math.cos(lat) * Math.cos(lon);

    return {
      pointsGeo: geo,
      dakNongCoords: new THREE.Vector3(gx, gy, gz),
    };
  }, []);

  // Reusable vectors
  const targetPosRef = useRef(new THREE.Vector3(2.5, 0, -2));
  const targetScaleRef = useRef(new THREE.Vector3(0.001, 0.001, 0.001));

  useFrame((state, delta) => {
    if (!globeRef.current) return;
    const d = Math.min(delta, 0.05);

    // Gentle rotation
    globeRef.current.rotation.y += d * 0.12;
    globeRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.1 + 0.15;

    // Pulse effect for Gia Nghĩa marker
    if (pulseRef.current) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 4) * 0.4;
      pulseRef.current.scale.set(scale, scale, scale);
    }

    // Animate in/out based on active state
    const tScale = active ? 1.0 : 0.001;
    targetPosRef.current.set(
      active ? 1.2 : 2.5,
      active ? -0.1 : 0,
      active ? 0 : -2
    );
    targetScaleRef.current.set(tScale, tScale, tScale);

    globeRef.current.position.lerp(targetPosRef.current, d * 2.5);
    globeRef.current.scale.lerp(targetScaleRef.current, d * 2.5);
  });

  return (
    <group ref={globeRef}>
      {/* Globe dot lattice */}
      <points geometry={pointsGeo}>
        <pointsMaterial
          color="#C88A4B"
          size={0.032}
          transparent
          opacity={0.65}
          sizeAttenuation
        />
      </points>

      {/* Meridian wireframe */}
      <mesh>
        <sphereGeometry args={[1.78, 14, 14]} />
        <meshBasicMaterial color="#2D4A3E" wireframe transparent opacity={0.1} />
      </mesh>

      {/* Gia Nghĩa beacon */}
      <group position={dakNongCoords}>
        <mesh>
          <sphereGeometry args={[0.06, 12, 12]} />
          <meshBasicMaterial color="#FFDD80" />
        </mesh>
        <mesh ref={pulseRef}>
          <ringGeometry args={[0.07, 0.14, 20]} />
          <meshBasicMaterial color="#C88A4B" transparent opacity={0.75} side={THREE.DoubleSide} />
        </mesh>
        <pointLight color="#FFDD80" intensity={1.2} distance={1.0} />
      </group>
    </group>
  );
}

// ==========================================
// FLOATING PARTICLES (organic gold dust)
// ==========================================
function FloatingParticles() {
  const particlesRef = useRef<THREE.Points>(null);

  const { particlesGeo, basePositions, phases, speeds } = useMemo(() => {
    const count = 180;
    const positions = new Float32Array(count * 3);
    const basePos = new Float32Array(count * 3);
    const phaseArr = new Float32Array(count);
    const speedArr = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 16;
      const y = (Math.random() - 0.5) * 12;
      const z = (Math.random() - 0.5) * 10;
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
      basePos[i * 3] = x;
      basePos[i * 3 + 1] = y;
      basePos[i * 3 + 2] = z;
      phaseArr[i] = Math.random() * Math.PI * 2;
      speedArr[i] = 0.3 + Math.random() * 0.6;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return { particlesGeo: geo, basePositions: basePos, phases: phaseArr, speeds: speedArr };
  }, []);

  useFrame((state) => {
    if (!particlesRef.current) return;
    const time = state.clock.elapsedTime;

    // Slow overall ambient rotation
    particlesRef.current.rotation.y = time * 0.012;

    // Bounds for particle visibility (world-space half-extents)
    const BOUND_X = 9, BOUND_Y = 7, BOUND_Z = 6;

    // Organic sine-wave drift from base positions (no accumulation)
    const pos = particlesRef.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < 180; i++) {
      const phase = phases[i];
      const speed = speeds[i];
      let px = basePositions[i * 3]     + Math.sin(time * speed * 0.4 + phase) * 0.3;
      let py = basePositions[i * 3 + 1] + Math.sin(time * speed * 0.6 + phase) * 0.4;
      let pz = basePositions[i * 3 + 2] + Math.cos(time * speed * 0.3 + phase) * 0.2;

      // Clamp to bounds — if a base drifted beyond (shouldn't happen, but safety net)
      if (Math.abs(px) > BOUND_X || Math.abs(py) > BOUND_Y || Math.abs(pz) > BOUND_Z) {
        const nx = (Math.random() - 0.5) * BOUND_X * 2;
        const ny = (Math.random() - 0.5) * BOUND_Y * 2;
        const nz = (Math.random() - 0.5) * BOUND_Z * 2;
        basePositions[i * 3] = nx;
        basePositions[i * 3 + 1] = ny;
        basePositions[i * 3 + 2] = nz;
        px = nx; py = ny; pz = nz;
      }

      pos[i * 3]     = px;
      pos[i * 3 + 1] = py;
      pos[i * 3 + 2] = pz;
    }
    particlesRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={particlesRef} geometry={particlesGeo}>
      <pointsMaterial
        color="#C88A4B"
        size={0.028}
        transparent
        opacity={0.45}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

// ==========================================
// CAMERA RIG (smooth dolly transitions)
// ==========================================
function CameraRig({ pathname }: { pathname: string }) {
  const scrollProgress = useRef(0);
  const targetPos = useRef(new THREE.Vector3(0, 0, 5));
  const targetLook = useRef(new THREE.Vector3(0, 0, 0));
  const currentLookAt = useRef(new THREE.Vector3(0, 0, 0));

  useEffect(() => {
    const onScroll = () => {
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      scrollProgress.current = Math.min(window.scrollY / maxScroll, 1);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useFrame((state, delta) => {
    const d = Math.min(delta, 0.05);
    const sp = scrollProgress.current;
    const lerpFactor = d * 2.0;

    if (pathname === "/") {
      targetPos.current.set(0, -sp * 1.2, 5 + sp * 0.8);
      targetLook.current.set(0, sp * 0.4, 0);
    } else if (pathname === "/space" || pathname === "/menu") {
      targetPos.current.set(-1.2, 0.15, 5.5);
      targetLook.current.set(0.8, 0, 0);
    } else if (pathname === "/about") {
      targetPos.current.set(0.6, 0.1, 5.2);
      targetLook.current.set(-0.4, 0, 0);
    } else if (pathname === "/contact") {
      targetPos.current.set(1.2, 0, 5);
      targetLook.current.set(-0.8, 0, 0);
    } else {
      targetPos.current.set(0, 0, 5);
      targetLook.current.set(0, 0, 0);
    }

    state.camera.position.lerp(targetPos.current, lerpFactor);
    currentLookAt.current.lerp(targetLook.current, lerpFactor);
    state.camera.lookAt(currentLookAt.current);
  });

  return null;
}

// ==========================================
// SCENE CONTROLLER (orchestrates everything)
// ==========================================
export default function SceneController() {
  const pathname = usePathname() || "/";
  const { camera } = useThree();

  // Initial camera setup avoids jumping on first frame
  useEffect(() => {
    camera.position.set(0, 0, 5);
  }, [camera]);

  const isContact = pathname === "/contact";

  return (
    <>
      {/* Lighting setup - warm and atmospheric */}
      <ambientLight intensity={0.7} />
      <directionalLight position={[5, 8, 5]} intensity={1.0} color="#FDFBF7" />
      <pointLight position={[-4, -3, 2]} intensity={0.5} color="#C88A4B" />

      {/* Organic wireframe - always present, route-synced */}
      <OrganicWireframe pathname={pathname} />

      {/* Dot globe - activates on /contact */}
      <InteractiveDotGlobe active={isContact} />

      {/* Camera logic */}
      <CameraRig pathname={pathname} />

      {/* Ambient floating particles */}
      <FloatingParticles />
    </>
  );
}
