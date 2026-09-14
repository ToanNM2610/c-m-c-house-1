"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function Lighting() {
  const dirLightRef = useRef<THREE.DirectionalLight>(null);
  const time = useRef(0);

  useFrame((_, delta) => {
    // Subtle shifting of sunlight to simulate passing time / clouds
    time.current += delta;
    if (dirLightRef.current) {
      const slowOscillation = Math.sin(time.current * 0.1) * 0.5;
      dirLightRef.current.position.x = 5 + slowOscillation;
    }
  });

  return (
    <>
      {/* Soft warm ambient light */}
      <ambientLight intensity={0.4} color="#ffd8b5" />
      
      {/* Main warm sunlight */}
      <directionalLight
        ref={dirLightRef}
        castShadow
        position={[5, 6, 4]}
        intensity={1.2}
        color="#ffead1"
        shadow-mapSize={[1024, 1024]}
        shadow-camera-near={0.5}
        shadow-camera-far={25}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
        shadow-bias={-0.0005}
      />
      
      {/* Fill light from the opposite side (cool tone for contrast) */}
      <directionalLight
        position={[-5, 3, -4]}
        intensity={0.3}
        color="#a9c2e3"
      />
      
      {/* Subtle point light near the center to highlight objects */}
      <pointLight position={[0, 1.5, 0]} intensity={0.5} color="#ffb870" distance={5} decay={2} />
    </>
  );
}
