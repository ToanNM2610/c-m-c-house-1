"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { usePathname } from "next/navigation";
import { useRef, useMemo } from "react";
import * as THREE from "three";
import { easing } from "maath";
import { Float } from "@react-three/drei";

// Mảng bụi sương và đốm sáng vàng kim lơ lửng mộc mạc
function Particles({ count = 150 }) {
  const mesh = useRef<THREE.InstancedMesh>(null);

  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const time = Math.random() * 100;
      const factor = 20 + Math.random() * 100;
      const speed = 0.01 + Math.random() / 200;
      const x = (Math.random() - 0.5) * 50;
      const y = (Math.random() - 0.5) * 50;
      const z = (Math.random() - 0.5) * 50;
      temp.push({ time, factor, speed, x, y, z });
    }
    return temp;
  }, [count]);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame(() => {
    particles.forEach((particle, i) => {
      let { time, factor, speed, x, y, z } = particle;
      time = particle.time += speed / 2;
      const s = Math.cos(time);
      dummy.position.set(
        x + Math.cos((time / 10) * factor) + (Math.sin(time * 1) * factor) / 10,
        y + Math.sin((time / 10) * factor) + (Math.cos(time * 2) * factor) / 10,
        z + Math.cos((time / 10) * factor) + (Math.sin(time * 3) * factor) / 10
      );
      dummy.scale.set(s, s, s);
      dummy.rotation.set(s * 3, s * 3, s * 3);
      dummy.updateMatrix();
      mesh.current?.setMatrixAt(i, dummy.matrix);
    });
    if (mesh.current) {
      mesh.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <>
      <pointLight distance={40} intensity={4} color="#C5A880" />
      <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
        <dodecahedronGeometry args={[0.035, 0]} />
        <meshStandardMaterial color="#C5A880" roughness={0.3} metalness={0.5} />
      </instancedMesh>
    </>
  );
}

// Khối trang trí Rustic
function RusticShapes() {
  return (
    <>
      <Float speed={1} rotationIntensity={0.8} floatIntensity={1.5} position={[-8, -2, -10]}>
        <mesh>
          <torusGeometry args={[3, 1, 12, 48]} />
          <meshStandardMaterial color="#4A5D4E" opacity={0.2} transparent />
        </mesh>
      </Float>
      <Float speed={1.5} rotationIntensity={0.8} floatIntensity={1} position={[10, 4, -15]}>
        <mesh>
          <octahedronGeometry args={[4]} />
          <meshStandardMaterial color="#C5A880" opacity={0.15} transparent wireframe />
        </mesh>
      </Float>
    </>
  );
}

function CameraController() {
  const pathname = usePathname();

  useFrame((state, delta) => {
    let targetPosition = new THREE.Vector3(0, 0, 15);
    let targetLookAt = new THREE.Vector3(0, 0, 0);

    // Xác định góc nhìn theo route
    if (pathname === "/") {
      targetPosition.set(0, 0, 15);
    } else if (pathname === "/about") {
      targetPosition.set(-10, 5, 20);
      targetLookAt.set(5, -2, -5);
    } else if (pathname === "/space") {
      targetPosition.set(15, -5, 10);
      targetLookAt.set(-5, 5, 0);
    } else if (pathname === "/menu") {
      targetPosition.set(0, -15, 25);
      targetLookAt.set(0, 10, 0);
    } else if (pathname?.startsWith("/posts")) {
      targetPosition.set(-5, 10, 18);
      targetLookAt.set(2, -5, 2);
    } else if (pathname === "/contact") {
      targetPosition.set(8, 8, 12);
      targetLookAt.set(-4, -4, 0);
    }

    easing.damp3(state.camera.position, targetPosition, 0.35, delta);
    
    const currentLookAt = new THREE.Vector3();
    state.camera.getWorldDirection(currentLookAt);
    const desiredDirection = new THREE.Vector3().subVectors(targetLookAt, state.camera.position).normalize();
    easing.damp3(currentLookAt, desiredDirection, 0.35, delta);
    
    const lookTarget = new THREE.Vector3().copy(state.camera.position).add(currentLookAt);
    state.camera.lookAt(lookTarget);
  });

  return null;
}

export default function BackgroundCanvas() {
  const pathname = usePathname();

  // Tắt ở trang Admin
  if (pathname && pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-0 pointer-events-none" style={{ backgroundColor: "#1A0F0A" }}>
      <Canvas
        camera={{ position: [0, 0, 15], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ alpha: false, antialias: true, powerPreference: "high-performance" }}
      >
        <color attach="background" args={["#1A0F0A"]} />
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 10]} intensity={0.8} color="#F4EFEA" />
        
        <Particles count={150} />
        <RusticShapes />
        
        <CameraController />
      </Canvas>
    </div>
  );
}
