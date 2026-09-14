"use client";

import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useScene } from "@/context/SceneContext";
import { MathUtils } from "three";

export default function Lighting() {
  const { introState } = useScene();
  const dirLightRef = useRef<THREE.DirectionalLight>(null);
  const ambientRef = useRef<THREE.AmbientLight>(null);
  const pointLightRef = useRef<THREE.PointLight>(null);
  const fillLightRef = useRef<THREE.DirectionalLight>(null);
  
  const time = useRef(0);

  // Target intensities
  const targetIntensities = useMemo(() => {
    switch(introState) {
      case "darkness":
        return { ambient: 0.1, dir: 0, point: 0, fill: 0 };
      case "light":
        return { ambient: 0.2, dir: 0, point: 1.0, fill: 0 };
      case "reveal":
        return { ambient: 0.5, dir: 0.8, point: 1.2, fill: 0.4 };
      case "enter":
      case "done":
      default:
        return { ambient: 1.2, dir: 1.8, point: 1.5, fill: 0.8 };
    }
  }, [introState]);

  useFrame((_, delta) => {
    // Clamp delta to avoid huge jumps
    const d = Math.min(delta, 0.05);
    time.current += d;

    // Subtle shifting of sunlight
    if (dirLightRef.current) {
      const slowOscillation = Math.sin(time.current * 0.1) * 0.5;
      dirLightRef.current.position.x = 5 + slowOscillation;
    }

    // Smooth lerp intensities
    if (ambientRef.current) ambientRef.current.intensity = MathUtils.lerp(ambientRef.current.intensity, targetIntensities.ambient, d * 1.5);
    if (dirLightRef.current) dirLightRef.current.intensity = MathUtils.lerp(dirLightRef.current.intensity, targetIntensities.dir, d * 1.5);
    if (pointLightRef.current) pointLightRef.current.intensity = MathUtils.lerp(pointLightRef.current.intensity, targetIntensities.point, d * 2.0);
    if (fillLightRef.current) fillLightRef.current.intensity = MathUtils.lerp(fillLightRef.current.intensity, targetIntensities.fill, d * 1.5);
  });

  return (
    <>
      <ambientLight ref={ambientRef} intensity={0.1} color="#ffe8d6" />
      
      <directionalLight
        ref={dirLightRef}
        castShadow
        position={[5, 8, 4]}
        intensity={0}
        color="#fff1e0"
        shadow-mapSize={[1024, 1024]}
        shadow-camera-near={0.5}
        shadow-camera-far={25}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
        shadow-bias={-0.0005}
      />
      
      <directionalLight
        ref={fillLightRef}
        position={[-5, 4, -4]}
        intensity={0}
        color="#d1e0eb"
      />
      
      <pointLight ref={pointLightRef} position={[0, 2, 0]} intensity={0} color="#ffb870" distance={10} decay={2} />
    </>
  );
}
