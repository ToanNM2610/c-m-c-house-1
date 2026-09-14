"use client";

import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Sparkles, Float } from "@react-three/drei";

export default function CoffeeCupPlaceholder(props: React.ComponentProps<"group">) {
  const groupRef = useRef<THREE.Group>(null);
  
  // Steam particles
  const steamCount = 15;

  return (
    <group ref={groupRef} {...props} dispose={null}>
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
        {/* Cup Body */}
        <mesh castShadow receiveShadow position={[0, 0.4, 0]}>
          <cylinderGeometry args={[0.5, 0.35, 0.8, 32]} />
          <meshStandardMaterial 
            color="#f5f5f0" 
            roughness={0.2} 
            metalness={0.1}
          />
        </mesh>

        {/* Cup Handle */}
        <mesh castShadow receiveShadow position={[0.55, 0.4, 0]} rotation={[0, 0, -0.2]}>
          <torusGeometry args={[0.2, 0.06, 16, 32]} />
          <meshStandardMaterial 
            color="#f5f5f0" 
            roughness={0.2} 
            metalness={0.1}
          />
        </mesh>

        {/* Coffee Liquid */}
        <mesh position={[0, 0.75, 0]}>
          <cylinderGeometry args={[0.47, 0.47, 0.05, 32]} />
          <meshStandardMaterial 
            color="#3b2818" 
            roughness={0.4} 
            metalness={0.8}
          />
        </mesh>

        {/* Cup Plate/Saucer */}
        <mesh castShadow receiveShadow position={[0, 0.05, 0]}>
          <cylinderGeometry args={[0.8, 0.6, 0.1, 32]} />
          <meshStandardMaterial 
            color="#f5f5f0" 
            roughness={0.3} 
            metalness={0.1}
          />
        </mesh>

        {/* Steam Particles */}
        <group position={[0, 0.8, 0]}>
          <Sparkles 
            count={steamCount} 
            scale={0.8} 
            size={3} 
            speed={0.4} 
            opacity={0.3} 
            color="#ffffff" 
            noise={1}
          />
        </group>
      </Float>
    </group>
  );
}
