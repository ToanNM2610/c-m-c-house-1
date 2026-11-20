'use client';

import React, { useRef, Suspense } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { MenuItem } from '@/types';
import { ProceduralSaltedCoffeeGlass } from './CoffeeBeanLeafMesh';

class ModelErrorBoundary extends React.Component<
  { fallback: React.ReactNode; children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: any) {
    console.warn('Failed to load custom 3D model, falling back to procedural mesh:', error);
  }
  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

// Custom GLTF / GLB Loader component
function CustomGlbModel({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  const modelRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (modelRef.current) {
      modelRef.current.rotation.y += delta * 0.5;
    }
  });

  return (
    <group ref={modelRef} scale={1.5} position={[0, -0.5, 0]}>
      <primitive object={scene.clone()} />
    </group>
  );
}

// Procedural Ceramic Coffee Cup with Saucer
function ProceduralCoffeeCup() {
  const groupRef = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (groupRef.current) groupRef.current.rotation.y += delta * 0.4;
  });

  return (
    <group ref={groupRef} position={[0, -0.4, 0]}>
      {/* Saucer */}
      <mesh position={[0, -0.05, 0]}>
        <cylinderGeometry args={[1.3, 0.9, 0.1, 32]} />
        <meshStandardMaterial color="#FAF7F2" roughness={0.2} metalness={0.05} />
      </mesh>
      {/* Cup Body */}
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.85, 0.6, 1.0, 32, 1, false]} />
        <meshStandardMaterial color="#FAF7F2" roughness={0.15} metalness={0.05} />
      </mesh>
      {/* Cup Interior / Coffee Liquid */}
      <mesh position={[0, 0.78, 0]}>
        <cylinderGeometry args={[0.78, 0.78, 0.05, 32]} />
        <meshStandardMaterial color="#2E1B10" roughness={0.3} />
      </mesh>
      {/* Latte Art Heart Swirl */}
      <mesh position={[0, 0.81, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={[0.35, 0.35, 1]}>
        <circleGeometry args={[1, 32]} />
        <meshBasicMaterial color="#E8DAC5" />
      </mesh>
      {/* Handle */}
      <mesh position={[0.85, 0.5, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <torusGeometry args={[0.3, 0.08, 16, 32, Math.PI]} />
        <meshStandardMaterial color="#FAF7F2" roughness={0.2} />
      </mesh>
    </group>
  );
}

// Procedural Herbal Tea with Garnish
function ProceduralHerbalTea() {
  const groupRef = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (groupRef.current) groupRef.current.rotation.y += delta * 0.35;
  });

  return (
    <group ref={groupRef} position={[0, -0.5, 0]}>
      {/* Glass Cup */}
      <mesh position={[0, 0.8, 0]}>
        <cylinderGeometry args={[0.8, 0.65, 1.6, 32, 1, true]} />
        <meshPhysicalMaterial
          color="#ffffff"
          transmission={0.92}
          transparent
          roughness={0.05}
          ior={1.5}
          thickness={0.15}
        />
      </mesh>
      {/* Glass Base */}
      <mesh position={[0, 0.05, 0]}>
        <cylinderGeometry args={[0.66, 0.65, 0.1, 32]} />
        <meshPhysicalMaterial color="#ffffff" transmission={0.9} transparent roughness={0.1} />
      </mesh>
      {/* Golden Amber Herbal Liquid */}
      <mesh position={[0, 0.75, 0]}>
        <cylinderGeometry args={[0.74, 0.63, 1.35, 32]} />
        <meshPhysicalMaterial
          color="#E69526"
          transmission={0.82}
          transparent
          roughness={0.15}
          ior={1.35}
        />
      </mesh>
      {/* Floating Lemon Slice */}
      <mesh position={[0.2, 1.3, 0.1]} rotation={[0.4, 0.2, 0.6]} scale={[0.32, 0.04, 0.32]}>
        <cylinderGeometry args={[1, 1, 1, 24]} />
        <meshStandardMaterial color="#E3C829" roughness={0.4} />
      </mesh>
      {/* Cinnamon Stick */}
      <mesh position={[-0.2, 0.9, -0.1]} rotation={[0.2, 0, 0.25]} scale={[0.07, 1.8, 0.07]}>
        <cylinderGeometry args={[1, 1, 1, 16]} />
        <meshStandardMaterial color="#6B3E26" roughness={0.8} />
      </mesh>
      {/* Chrysanthemum Flower Petals */}
      <mesh position={[0, 1.35, -0.2]} scale={0.18}>
        <dodecahedronGeometry args={[1, 0]} />
        <meshStandardMaterial color="#FFF9D2" roughness={0.4} />
      </mesh>
    </group>
  );
}

// Procedural Smoothie Bowl / Glass (Sinh Tố Bơ / Mãng Cầu / Dâu)
function ProceduralSmoothieGlass() {
  const groupRef = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (groupRef.current) groupRef.current.rotation.y += delta * 0.4;
  });

  return (
    <group ref={groupRef} position={[0, -0.6, 0]}>
      {/* Hurricane Glass Stem */}
      <mesh position={[0, 0.15, 0]}>
        <cylinderGeometry args={[0.12, 0.5, 0.3, 24]} />
        <meshPhysicalMaterial color="#ffffff" transmission={0.9} transparent roughness={0.05} />
      </mesh>
      {/* Glass Foot */}
      <mesh position={[0, 0.02, 0]}>
        <cylinderGeometry args={[0.55, 0.55, 0.05, 32]} />
        <meshPhysicalMaterial color="#ffffff" transmission={0.9} transparent roughness={0.05} />
      </mesh>
      {/* Glass Curved Bowl */}
      <mesh position={[0, 1.1, 0]}>
        <sphereGeometry args={[0.82, 32, 24, 0, Math.PI * 2, 0, Math.PI * 0.75]} />
        <meshPhysicalMaterial color="#ffffff" transmission={0.92} transparent roughness={0.04} thickness={0.15} />
      </mesh>
      {/* Rich Avocado / Tropical Green Smoothie Core */}
      <mesh position={[0, 1.05, 0]}>
        <sphereGeometry args={[0.78, 32, 24, 0, Math.PI * 2, 0, Math.PI * 0.73]} />
        <meshStandardMaterial color="#8FB339" roughness={0.5} />
      </mesh>
      {/* Whipped Cream Crown */}
      <mesh position={[0, 1.6, 0]} scale={[0.55, 0.35, 0.55]}>
        <sphereGeometry args={[1, 32, 16]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.7} />
      </mesh>
      {/* Fresh Mint Sprig */}
      <mesh position={[0.2, 1.85, 0.1]} rotation={[0.3, 0.4, 0.2]} scale={[0.12, 0.25, 0.05]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#2E5A3C" roughness={0.3} />
      </mesh>
    </group>
  );
}

// Procedural Juice Glass (Nước ép Táo, Cam, Kale, etc.)
function ProceduralJuiceGlass() {
  const groupRef = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (groupRef.current) groupRef.current.rotation.y += delta * 0.4;
  });

  return (
    <group ref={groupRef} position={[0, -0.6, 0]}>
      {/* Highball Glass */}
      <mesh position={[0, 1.1, 0]}>
        <cylinderGeometry args={[0.6, 0.5, 2.2, 32, 1, true]} />
        <meshPhysicalMaterial color="#ffffff" transmission={0.94} transparent roughness={0.03} thickness={0.15} />
      </mesh>
      <mesh position={[0, 0.08, 0]}>
        <cylinderGeometry args={[0.52, 0.5, 0.16, 32]} />
        <meshPhysicalMaterial color="#ffffff" transmission={0.9} transparent roughness={0.05} />
      </mesh>
      {/* Vibrant Fresh Juice Liquid */}
      <mesh position={[0, 1.0, 0]}>
        <cylinderGeometry args={[0.55, 0.48, 1.9, 32]} />
        <meshPhysicalMaterial color="#F28E2B" transmission={0.8} transparent roughness={0.2} ior={1.34} />
      </mesh>
      {/* Ice Cubes floating inside */}
      <mesh position={[0.15, 1.6, 0.1]} rotation={[0.2, 0.5, 0.1]} scale={0.24}>
        <boxGeometry args={[1, 1, 1]} />
        <meshPhysicalMaterial color="#E8F4F8" transmission={0.92} transparent roughness={0.1} />
      </mesh>
      <mesh position={[-0.15, 1.3, -0.1]} rotation={[0.4, 0.1, 0.3]} scale={0.22}>
        <boxGeometry args={[1, 1, 1]} />
        <meshPhysicalMaterial color="#E8F4F8" transmission={0.92} transparent roughness={0.1} />
      </mesh>
      {/* Orange Slice Garnish on rim */}
      <mesh position={[0.55, 2.1, 0]} rotation={[0, 0, 0.4]} scale={[0.3, 0.3, 0.04]}>
        <cylinderGeometry args={[1, 1, 1, 24]} />
        <meshStandardMaterial color="#E65100" roughness={0.4} />
      </mesh>
    </group>
  );
}

// Procedural Soda / Yogurt Glass
function ProceduralSodaGlass() {
  const groupRef = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (groupRef.current) groupRef.current.rotation.y += delta * 0.4;
  });

  return (
    <group ref={groupRef} position={[0, -0.6, 0]}>
      {/* Glass */}
      <mesh position={[0, 1.1, 0]}>
        <cylinderGeometry args={[0.65, 0.5, 2.2, 32, 1, true]} />
        <meshPhysicalMaterial color="#ffffff" transmission={0.94} transparent roughness={0.05} />
      </mesh>
      <mesh position={[0, 0.08, 0]}>
        <cylinderGeometry args={[0.52, 0.5, 0.16, 32]} />
        <meshPhysicalMaterial color="#ffffff" transmission={0.9} transparent roughness={0.08} />
      </mesh>
      {/* Hibiscus Red / Berry Soda Liquid */}
      <mesh position={[0, 0.95, 0]}>
        <cylinderGeometry args={[0.61, 0.48, 1.85, 32]} />
        <meshPhysicalMaterial color="#B01E3C" transmission={0.82} transparent roughness={0.15} />
      </mesh>
      {/* Lime Wedge */}
      <mesh position={[0.2, 1.6, 0.1]} rotation={[0.3, 0.5, 0]} scale={[0.22, 0.05, 0.22]}>
        <cylinderGeometry args={[1, 1, 1, 20]} />
        <meshStandardMaterial color="#88C057" roughness={0.4} />
      </mesh>
      {/* Soda Bubbles */}
      {[0.1, -0.15, 0.2].map((y, i) => (
        <mesh key={i} position={[(i - 1) * 0.2, 0.8 + y, (i % 2 === 0 ? 0.15 : -0.1)]} scale={0.05}>
          <sphereGeometry args={[1, 16, 16]} />
          <meshPhysicalMaterial color="#FFFFFF" transmission={0.95} transparent roughness={0.05} />
        </mesh>
      ))}
    </group>
  );
}

// Procedural Matcha Latte Glass
function ProceduralMatchaGlass() {
  const groupRef = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (groupRef.current) groupRef.current.rotation.y += delta * 0.4;
  });

  return (
    <group ref={groupRef} position={[0, -0.6, 0]}>
      {/* Glass */}
      <mesh position={[0, 1.1, 0]}>
        <cylinderGeometry args={[0.65, 0.55, 2.2, 32, 1, true]} />
        <meshPhysicalMaterial color="#ffffff" transmission={0.93} transparent roughness={0.05} />
      </mesh>
      <mesh position={[0, 0.08, 0]}>
        <cylinderGeometry args={[0.56, 0.55, 0.16, 32]} />
        <meshPhysicalMaterial color="#ffffff" transmission={0.9} transparent roughness={0.05} />
      </mesh>
      {/* Milk bottom layer */}
      <mesh position={[0, 0.4, 0]}>
        <cylinderGeometry args={[0.58, 0.56, 0.6, 32]} />
        <meshStandardMaterial color="#FFF9E6" roughness={0.3} />
      </mesh>
      {/* Matcha green top layer */}
      <mesh position={[0, 1.25, 0]}>
        <cylinderGeometry args={[0.63, 0.58, 1.25, 32]} />
        <meshStandardMaterial color="#4A7C3B" roughness={0.4} />
      </mesh>
      {/* Frothy Green Foam */}
      <mesh position={[0, 1.95, 0]} scale={[0.62, 0.1, 0.62]}>
        <sphereGeometry args={[1, 32, 16]} />
        <meshStandardMaterial color="#6E9F5E" roughness={0.8} />
      </mesh>
    </group>
  );
}

// Procedural Food Plate (Bánh Mì Ốp La / Mỳ Spaghetti / Bò Kho)
function ProceduralFoodPlate() {
  const groupRef = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (groupRef.current) groupRef.current.rotation.y += delta * 0.35;
  });

  return (
    <group ref={groupRef} position={[0, -0.3, 0]}>
      {/* Ceramic Plate */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[1.5, 1.1, 0.16, 36]} />
        <meshStandardMaterial color="#F7F5EE" roughness={0.2} metalness={0.05} />
      </mesh>
      {/* Dish base / Warm savory stew */}
      <mesh position={[0, 0.15, 0]}>
        <cylinderGeometry args={[1.15, 1.0, 0.18, 32]} />
        <meshStandardMaterial color="#8A3319" roughness={0.5} />
      </mesh>
      {/* Crispy French Baguette Toast */}
      <mesh position={[-0.5, 0.32, 0.2]} rotation={[0.1, 0.4, 0.2]} scale={[0.25, 0.15, 0.65]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#C88E4B" roughness={0.7} />
      </mesh>
      {/* Sunny Side Egg yolk */}
      <mesh position={[0.25, 0.3, -0.2]} scale={[0.3, 0.1, 0.3]}>
        <sphereGeometry args={[1, 24, 16]} />
        <meshStandardMaterial color="#FFA000" roughness={0.3} />
      </mesh>
      {/* Egg white */}
      <mesh position={[0.25, 0.24, -0.2]} scale={[0.65, 0.05, 0.65]}>
        <cylinderGeometry args={[1, 1, 1, 24]} />
        <meshStandardMaterial color="#FFFDE7" roughness={0.3} />
      </mesh>
      {/* Herb garnish */}
      <mesh position={[0, 0.35, 0]} scale={[0.12, 0.05, 0.12]}>
        <dodecahedronGeometry args={[1, 0]} />
        <meshStandardMaterial color="#2E5A3C" roughness={0.5} />
      </mesh>
    </group>
  );
}

// Procedural Snack Basket (Khoai tây chiên, phô mai que, bánh tráng)
function ProceduralSnackBasket() {
  const groupRef = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (groupRef.current) groupRef.current.rotation.y += delta * 0.35;
  });

  return (
    <group ref={groupRef} position={[0, -0.3, 0]}>
      {/* Bamboo Basket Tray */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[1.4, 1.2, 0.35, 32, 1, false]} />
        <meshStandardMaterial color="#CBB282" roughness={0.8} />
      </mesh>
      {/* Paper Liner */}
      <mesh position={[0, 0.2, 0]}>
        <cylinderGeometry args={[1.32, 1.15, 0.06, 32]} />
        <meshStandardMaterial color="#FAF5E8" roughness={0.9} />
      </mesh>
      {/* Golden Crispy Fries / Snack sticks */}
      {[-0.4, -0.15, 0.15, 0.4].map((pos, idx) => (
        <mesh
          key={idx}
          position={[pos, 0.38 + (idx % 2) * 0.08, (idx % 2 === 0 ? 0.2 : -0.2)]}
          rotation={[0.2 * idx, 0.3, -0.15 * idx]}
          scale={[0.12, 0.12, 0.75]}
        >
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#E5A823" roughness={0.6} />
        </mesh>
      ))}
      {/* Dipping Sauce Cup */}
      <mesh position={[0, 0.35, -0.55]}>
        <cylinderGeometry args={[0.3, 0.22, 0.25, 24]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.2} />
      </mesh>
      {/* Red Chili Sauce */}
      <mesh position={[0, 0.46, -0.55]}>
        <cylinderGeometry args={[0.26, 0.26, 0.04, 24]} />
        <meshStandardMaterial color="#B71C1C" roughness={0.3} />
      </mesh>
    </group>
  );
}

// Master Procedural Model Dispatcher
export function ProceduralDrinkMesh({ item }: { item: MenuItem }) {
  const renderProcedural = () => {
    switch (item.modelType) {
      case 'coffee-cup':
        return <ProceduralCoffeeCup />;
      case 'iced-coffee':
        return <ProceduralSaltedCoffeeGlass />;
      case 'herbal-tea':
        return <ProceduralHerbalTea />;
      case 'smoothie-glass':
        return <ProceduralSmoothieGlass />;
      case 'juice-glass':
        return <ProceduralJuiceGlass />;
      case 'soda-glass':
        return <ProceduralSodaGlass />;
      case 'matcha-glass':
        return <ProceduralMatchaGlass />;
      case 'food-plate':
        return <ProceduralFoodPlate />;
      case 'snack-basket':
        return <ProceduralSnackBasket />;
      default:
        // Category fallback
        if (item.categoryId === 'coffee') {
          return item.name.toLowerCase().includes('muối') ||
            item.name.toLowerCase().includes('sữa') ||
            item.name.toLowerCase().includes('xỉu')
            ? <ProceduralSaltedCoffeeGlass />
            : <ProceduralCoffeeCup />;
        }
        if (item.categoryId === 'tea') return <ProceduralHerbalTea />;
        if (item.categoryId === 'smoothie') return <ProceduralSmoothieGlass />;
        if (item.categoryId === 'juice') return <ProceduralJuiceGlass />;
        if (item.categoryId === 'soda-yogurt') return <ProceduralSodaGlass />;
        if (item.categoryId === 'food') return <ProceduralFoodPlate />;
        return <ProceduralJuiceGlass />;
    }
  };

  // If custom uploaded .glb exists, load it with safe error boundary & suspense fallback
  if (item.customGlbUrl) {
    return (
      <ModelErrorBoundary fallback={renderProcedural()}>
        <Suspense fallback={renderProcedural()}>
          <CustomGlbModel url={item.customGlbUrl} />
        </Suspense>
      </ModelErrorBoundary>
    );
  }

  return renderProcedural();
}

