"use client";

import React, { useRef, useState, useEffect } from "react";
import * as THREE from "three";
import { Sparkles, Float } from "@react-three/drei";
import { usePathname } from "next/navigation";

export default function CoffeeCupPlaceholder(props: React.ComponentProps<"group">) {
  const groupRef = useRef<THREE.Group>(null);
  const pathname = usePathname() || "";
  const [scale, setScale] = useState(0.8);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Only show on home and menu
    if (pathname !== "/" && pathname !== "/menu") {
      setIsVisible(false);
      return;
    }
    setIsVisible(true);

    const handleResize = () => {
      // 30-45% viewport visual area -> make it smaller
      // Mobile -> even smaller
      if (window.innerWidth < 768) {
        setScale(0.5);
      } else {
        setScale(0.8);
      }
    };
    
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [pathname]);

  if (!isVisible) return null;

  return (
    <group ref={groupRef} {...props} scale={scale} dispose={null}>
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
            count={10} 
            scale={0.8} 
            size={3} 
            speed={0.4} 
            opacity={0.2} 
            color="#ffffff" 
            noise={1}
          />
        </group>
      </Float>
    </group>
  );
}
