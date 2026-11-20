'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { createCoffeeBeanGeometry, SingleRoastedBeanMesh } from './RoastedCoffeeBean';

// Realistic 3D Procedural Coffee Bean
export function ProceduralCoffeeBean({
  scale = 1,
  position = [0, 0, 0],
}: {
  scale?: number;
  position?: [number, number, number];
}) {
  const beanRef = useRef<THREE.Group>(null);
  const geo = useMemo(() => createCoffeeBeanGeometry(), []);
  const mat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        vertexColors: true,
        roughness: 0.56,
        metalness: 0.03,
      }),
    []
  );

  useFrame((state, delta) => {
    if (beanRef.current) {
      beanRef.current.rotation.y += delta * 0.4;
      beanRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.15;
    }
  });

  return (
    <group ref={beanRef} position={position}>
      <SingleRoastedBeanMesh
        geometry={geo}
        material={mat}
        scale={scale}
      />
    </group>
  );
}

// Procedural Cẩm Cù Leaf (Wax Plant leaf with glossy succulent look)
export function ProceduralHoyaLeaf({
  scale = 1,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
}: {
  scale?: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
}) {
  const leafRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (leafRef.current) {
      leafRef.current.position.y += Math.sin(state.clock.elapsedTime * 1.5 + position[0]) * 0.001;
    }
  });

  return (
    <group ref={leafRef} position={position} rotation={rotation} scale={scale}>
      <mesh scale={[0.6, 1.2, 0.15]} rotation={[-0.2, 0, 0]}>
        <sphereGeometry args={[0.7, 32, 16]} />
        <meshStandardMaterial
          color="#2E5A3C"
          roughness={0.25}
          metalness={0.15}
        />
      </mesh>
      {/* Central vein */}
      <mesh position={[0, 0, 0.09]} scale={[0.03, 1.4, 0.04]} rotation={[-0.2, 0, 0]}>
        <cylinderGeometry args={[1, 1, 1, 12]} />
        <meshStandardMaterial color="#447C56" roughness={0.3} />
      </mesh>
    </group>
  );
}

// Procedural Salted Cream Coffee Glass (Cà phê Muối Cẩm Cù)
export function ProceduralSaltedCoffeeGlass({
  scale = 1,
  position = [0, 0, 0],
}: {
  scale?: number;
  position?: [number, number, number];
}) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.3;
    }
  });

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {/* Outer Glass Cylinder */}
      <mesh position={[0, 1.2, 0]}>
        <cylinderGeometry args={[0.72, 0.6, 2.4, 32, 1, true]} />
        <meshPhysicalMaterial
          color="#ffffff"
          transmission={0.92}
          opacity={1}
          transparent={true}
          roughness={0.05}
          ior={1.5}
          thickness={0.2}
          specularIntensity={1}
        />
      </mesh>
      {/* Glass Bottom Base */}
      <mesh position={[0, 0.08, 0]}>
        <cylinderGeometry args={[0.62, 0.6, 0.16, 32]} />
        <meshPhysicalMaterial
          color="#ffffff"
          transmission={0.88}
          transparent={true}
          roughness={0.08}
          ior={1.5}
        />
      </mesh>

      {/* Condensed Milk Base Layer */}
      <mesh position={[0, 0.3, 0]}>
        <cylinderGeometry args={[0.62, 0.61, 0.35, 32]} />
        <meshStandardMaterial color="#FFF2CC" roughness={0.3} />
      </mesh>

      {/* Robusta Coffee Dark Middle Layer */}
      <mesh position={[0, 1.0, 0]}>
        <cylinderGeometry args={[0.66, 0.62, 1.05, 32]} />
        <meshStandardMaterial color="#3D1F10" roughness={0.25} />
      </mesh>

      {/* Salted Cream Foam Top Layer */}
      <mesh position={[0, 1.75, 0]}>
        <cylinderGeometry args={[0.7, 0.66, 0.55, 32]} />
        <meshStandardMaterial color="#FCF8F2" roughness={0.6} />
      </mesh>

      {/* Fluffy Foam Crest */}
      <mesh position={[0, 2.05, 0]} scale={[0.68, 0.12, 0.68]}>
        <sphereGeometry args={[1, 32, 16]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.8} />
      </mesh>

      {/* Pink Himalayan Salt & Cocoa Powder flakes */}
      {[-0.2, 0, 0.22].map((x, i) => (
        <mesh key={i} position={[x, 2.14, i % 2 === 0 ? 0.15 : -0.15]} scale={0.04}>
          <dodecahedronGeometry args={[1, 0]} />
          <meshStandardMaterial color={i === 1 ? '#D98282' : '#5A3825'} roughness={0.5} />
        </mesh>
      ))}

      {/* Glass Straw */}
      <mesh position={[0.25, 1.6, 0.15]} rotation={[0.1, 0, -0.2]}>
        <cylinderGeometry args={[0.045, 0.045, 2.6, 16]} />
        <meshPhysicalMaterial
          color="#A8D5BA"
          transmission={0.85}
          transparent={true}
          roughness={0.1}
          ior={1.5}
        />
      </mesh>
    </group>
  );
}
