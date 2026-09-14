"use client";

import React, { useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

export default function CoffeeShopPlaceholder(props: React.ComponentProps<"group">) {
  const groupRef = useRef<THREE.Group>(null);

  // Very basic procedural environment
  return (
    <group ref={groupRef} {...props} dispose={null}>
      {/* Wooden Floor */}
      <mesh receiveShadow position={[0, -0.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#3d2a1b" roughness={0.9} metalness={0.1} />
      </mesh>

      {/* Main Table */}
      <mesh castShadow receiveShadow position={[0, 0, 0]}>
        <boxGeometry args={[3, 0.1, 2]} />
        <meshStandardMaterial color="#4f3824" roughness={0.7} metalness={0.1} />
      </mesh>
      
      {/* Table Legs */}
      <mesh castShadow receiveShadow position={[-1.3, -0.25, -0.8]}>
        <boxGeometry args={[0.1, 0.5, 0.1]} />
        <meshStandardMaterial color="#2d2015" />
      </mesh>
      <mesh castShadow receiveShadow position={[1.3, -0.25, -0.8]}>
        <boxGeometry args={[0.1, 0.5, 0.1]} />
        <meshStandardMaterial color="#2d2015" />
      </mesh>
      <mesh castShadow receiveShadow position={[-1.3, -0.25, 0.8]}>
        <boxGeometry args={[0.1, 0.5, 0.1]} />
        <meshStandardMaterial color="#2d2015" />
      </mesh>
      <mesh castShadow receiveShadow position={[1.3, -0.25, 0.8]}>
        <boxGeometry args={[0.1, 0.5, 0.1]} />
        <meshStandardMaterial color="#2d2015" />
      </mesh>

      {/* Background Wall / Architecture */}
      <mesh receiveShadow position={[0, 2, -5]}>
        <boxGeometry args={[15, 6, 0.5]} />
        <meshStandardMaterial color="#2c2724" roughness={0.9} />
      </mesh>
      
      {/* Wooden Beams/Pillars */}
      <mesh castShadow receiveShadow position={[-3, 2, -4.5]}>
        <boxGeometry args={[0.3, 6, 0.3]} />
        <meshStandardMaterial color="#4a3b30" roughness={0.8} />
      </mesh>
      <mesh castShadow receiveShadow position={[3, 2, -4.5]}>
        <boxGeometry args={[0.3, 6, 0.3]} />
        <meshStandardMaterial color="#4a3b30" roughness={0.8} />
      </mesh>

      {/* Abstract Greenery/Plants */}
      <mesh castShadow position={[-2.5, 0.5, -2]}>
        <sphereGeometry args={[0.8, 16, 16]} />
        <meshStandardMaterial color="#2d4a2d" roughness={0.8} />
      </mesh>
      <mesh castShadow position={[-2, 1.2, -2.5]}>
        <sphereGeometry args={[0.6, 16, 16]} />
        <meshStandardMaterial color="#2d4a2d" roughness={0.8} />
      </mesh>
      <mesh castShadow position={[2.8, 0.4, -2.2]}>
        <sphereGeometry args={[0.7, 16, 16]} />
        <meshStandardMaterial color="#355235" roughness={0.8} />
      </mesh>
    </group>
  );
}
