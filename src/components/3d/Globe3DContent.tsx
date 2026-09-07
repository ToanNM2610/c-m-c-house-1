"use client";

import React, { useRef, useMemo, useEffect, Suspense } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { useCanvas } from "@/context/CanvasContext";

// Tọa độ Đắk Nông (Gia Nghĩa), Việt Nam:
// Lat: 11.98° N, Lon: 107.70° E
const DAK_NONG_COORDS = {
  lat: 11.98,
  lon: 107.70,
};

// Vị trí cố định của nguồn sáng Mặt Trời (DirectionalLight)
const SUN_POSITION: [number, number, number] = [6, 2.5, 4.5];
const SUN_ANGLE_XZ = Math.atan2(SUN_POSITION[2], SUN_POSITION[0]);

export function latLonToVector3(
  lat: number,
  lon: number,
  radius: number
): [number, number, number] {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);

  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);

  return [x, y, z];
}

function getRealtimeEarthRotationY(): number {
  const now = new Date();
  const utcHours =
    now.getUTCHours() +
    now.getUTCMinutes() / 60 +
    now.getUTCSeconds() / 3600 +
    now.getUTCMilliseconds() / 3600000;

  const subsolarLonRad = (12 - utcHours) * (Math.PI / 12);
  return -SUN_ANGLE_XZ - subsolarLonRad;
}

function DakNongBeacon({ radius }: { radius: number }) {
  const ringRef = useRef<THREE.Mesh>(null);
  const lightRef = useRef<THREE.PointLight>(null);

  const pos = useMemo(
    () => latLonToVector3(DAK_NONG_COORDS.lat, DAK_NONG_COORDS.lon, radius),
    [radius]
  );
  const normal = useMemo(() => new THREE.Vector3(...pos).normalize(), [pos]);

  const { beamLine, beamGeom, beamMat } = useMemo(() => {
    const geom = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(normal.x * 0.65, normal.y * 0.65, normal.z * 0.65),
    ]);
    const mat = new THREE.LineBasicMaterial({
      color: "#FFE5B4",
      transparent: true,
      opacity: 0.9,
    });
    const line = new THREE.Line(geom, mat);
    return { beamLine: line, beamGeom: geom, beamMat: mat };
  }, [normal]);

  useEffect(() => {
    return () => {
      beamGeom.dispose();
      beamMat.dispose();
    };
  }, [beamGeom, beamMat]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (ringRef.current) {
      const scale = 1 + (Math.sin(t * 3.5) + 1) * 0.55;
      ringRef.current.scale.set(scale, scale, scale);
      const mat = ringRef.current.material as THREE.MeshBasicMaterial;
      if (mat) {
        mat.opacity = 0.85 - (Math.sin(t * 3.5) + 1) * 0.38;
      }
    }
    if (lightRef.current) {
      lightRef.current.intensity = 1.8 + Math.sin(t * 4) * 0.9;
    }
  });

  return (
    <group position={pos}>
      <pointLight ref={lightRef} color="#FFE5B4" distance={3.2} intensity={2.2} />

      <mesh>
        <sphereGeometry args={[0.055, 12, 12]} />
        <meshBasicMaterial color="#FFF1D6" />
      </mesh>

      <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.075, 0.13, 24]} />
        <meshBasicMaterial
          color="#C5A880"
          transparent
          opacity={0.8}
          side={THREE.DoubleSide}
        />
      </mesh>

      <primitive object={beamLine} />
    </group>
  );
}

function RealisticEarthSphere({ radius = 2.4 }: { radius?: number }) {
  const [dayMap, normalMap, specularMap] = useTexture([
    "/textures/earth_atmos_2048.jpg",
    "/textures/earth_normal_2048.jpg",
    "/textures/earth_specular_2048.jpg",
  ]);

  useMemo(() => {
    dayMap.colorSpace = THREE.SRGBColorSpace;
    dayMap.anisotropy = 4;
  }, [dayMap]);

  return (
    <mesh castShadow receiveShadow>
      <sphereGeometry args={[radius, 48, 48]} />
      <meshPhongMaterial
        map={dayMap}
        normalMap={normalMap}
        normalScale={new THREE.Vector2(0.85, 0.85)}
        specularMap={specularMap}
        specular={new THREE.Color("#68829E")}
        shininess={22}
      />
    </mesh>
  );
}

function CloudsLayer({ radius = 2.4 }: { radius?: number }) {
  const cloudsRef = useRef<THREE.Mesh>(null);
  const cloudsMap = useTexture("/textures/earth_clouds_2048.png");

  useMemo(() => {
    cloudsMap.colorSpace = THREE.SRGBColorSpace;
  }, [cloudsMap]);

  useFrame((_, delta) => {
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += delta * 0.015;
    }
  });

  return (
    <mesh ref={cloudsRef}>
      <sphereGeometry args={[radius * 1.014, 48, 48]} />
      <meshStandardMaterial
        map={cloudsMap}
        transparent
        opacity={0.42}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

function AtmosphereRimLight({ radius = 2.4 }: { radius?: number }) {
  return (
    <mesh>
      <sphereGeometry args={[radius * 1.026, 36, 36]} />
      <meshBasicMaterial
        color="#5FA8D3"
        transparent
        opacity={0.18}
        side={THREE.BackSide}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

function GlobeFallbackSphere({ radius = 2.4 }: { radius?: number }) {
  return (
    <group>
      <mesh>
        <sphereGeometry args={[radius, 24, 24]} />
        <meshStandardMaterial color="#16222F" roughness={0.7} />
      </mesh>
      <mesh>
        <sphereGeometry args={[radius * 1.006, 16, 16]} />
        <meshBasicMaterial color="#C5A880" wireframe transparent opacity={0.15} />
      </mesh>
    </group>
  );
}

function StarFieldParticles({ count = 80 }: { count?: number }) {
  const { geometry, material } = useMemo(() => {
    const coords = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      coords[i * 3] = (Math.random() - 0.5) * 18;
      coords[i * 3 + 1] = (Math.random() - 0.5) * 18;
      coords[i * 3 + 2] = (Math.random() - 0.5) * 18;
    }
    const geom = new THREE.BufferGeometry();
    geom.setAttribute("position", new THREE.BufferAttribute(coords, 3));
    const mat = new THREE.PointsMaterial({
      color: "#C5A880",
      size: 0.035,
      transparent: true,
      opacity: 0.45,
      sizeAttenuation: true,
    });
    return { geometry: geom, material: mat };
  }, [count]);

  useEffect(() => {
    return () => {
      geometry.dispose();
      material.dispose();
    };
  }, [geometry, material]);

  return <primitive object={new THREE.Points(geometry, material)} />;
}

export default function Globe3DContent() {
  const { isAutoSpin, isMobile } = useCanvas();
  const globeGroupRef = useRef<THREE.Group>(null);
  const radius = isMobile ? 1.8 : 2.2;

  const initialRotationY = useMemo(() => getRealtimeEarthRotationY(), []);

  useFrame((_, delta) => {
    if (globeGroupRef.current) {
      if (isAutoSpin) {
        globeGroupRef.current.rotation.y += delta * 0.06;
      } else {
        const targetRotationY = getRealtimeEarthRotationY();
        globeGroupRef.current.rotation.y = THREE.MathUtils.lerp(
          globeGroupRef.current.rotation.y,
          targetRotationY,
          0.05
        );
      }
    }
  });

  // Định vị quả cầu trên màn hình:
  // Desktop: lệch phải để khớp với cột 2 trang Contact
  // Mobile: ở giữa, hơi lệch xuống
  const positionX = isMobile ? 0 : 2.2;
  const positionY = isMobile ? -0.4 : 0;

  return (
    <group position={[positionX, positionY, 0]}>
      <ambientLight intensity={0.25} color="#152438" />
      <directionalLight
        position={SUN_POSITION}
        intensity={2.6}
        color="#FFFDF5"
      />
      <pointLight position={[-8, -3, -6]} intensity={0.45} color="#2A4365" />

      <Float speed={1.1} rotationIntensity={0.06} floatIntensity={0.15}>
        <group rotation={[0.12, 0, 0.38]}>
          <group ref={globeGroupRef} rotation={[0, initialRotationY, 0]}>
            <Suspense fallback={<GlobeFallbackSphere radius={radius} />}>
              <RealisticEarthSphere radius={radius} />
            </Suspense>

            <Suspense fallback={null}>
              <CloudsLayer radius={radius} />
            </Suspense>

            <AtmosphereRimLight radius={radius} />
            <DakNongBeacon radius={radius} />
          </group>
        </group>
      </Float>

      <StarFieldParticles count={isMobile ? 35 : 75} />
    </group>
  );
}
