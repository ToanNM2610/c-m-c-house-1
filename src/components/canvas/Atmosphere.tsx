"use client";

import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Sparkles } from "@react-three/drei";

export default function Atmosphere() {
  // Fog configuration to create depth of field / atmospheric scattering
  // Using a warm, slightly dusty color
  
  return (
    <>
      <fog attach="fog" args={["#1c1613", 5, 20]} />
      
      {/* Floating Dust Particles to create atmospheric depth */}
      <Sparkles 
        count={300}
        scale={12} 
        size={1.5} 
        speed={0.2} 
        opacity={0.15} 
        color="#ffe2c4"
        noise={1.5}
      />
    </>
  );
}
