"use client";

import React, { useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { usePathname } from "next/navigation";

export default function CameraRig() {
  const { camera } = useThree();
  const pathname = usePathname() || "";
  
  const mouse = useRef({ x: 0, y: 0 });
  const scrollProgress = useRef(0);
  
  // Track target position and rotation to lerp towards
  const targetPosition = useRef(new THREE.Vector3(0, 1.5, 8));
  const targetLookAt = useRef(new THREE.Vector3(0, 0, 0));
  const currentLookAt = useRef(new THREE.Vector3(0, 0, 0));

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    const onScroll = () => {
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      scrollProgress.current = Math.min(window.scrollY / maxScroll, 1);
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    
    // Trigger initial calculation
    onScroll();
    
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useFrame((_, delta) => {
    // Clamp delta to avoid huge jumps if tab was inactive
    const d = Math.min(delta, 0.05);
    
    const lenis = typeof window !== "undefined" ? (window as any).__lenis : null;
    const sp = lenis && typeof lenis.progress === "number" ? lenis.progress : scrollProgress.current;
    
    const mx = mouse.current.x;
    const my = mouse.current.y;

    // Cinematic base targets based on route
    if (pathname === "/") {
      // Home page: camera starts far, moves closer based on scroll
      // Hero phase 1-5 will be handled by scroll progress
      // Phase 1: sp=0 -> far away, maybe looking slightly down
      // Phase 2: sp>0.1 -> closer to the shop environment
      
      const zPos = 8 - sp * 4; // Move from 8 to 4
      const yPos = 1.5 + sp * 0.5; // Slightly rise
      const xPos = Math.sin(sp * Math.PI) * 1.5; // Gentle sway
      
      targetPosition.current.set(xPos, yPos, zPos);
      targetLookAt.current.set(0, 0, 0);
      
    } else if (pathname === "/about") {
      targetPosition.current.set(2, 1.2, 5);
      targetLookAt.current.set(-1, 0, 0);
    } else if (pathname === "/space") {
      targetPosition.current.set(0, 1.5, 6);
      targetLookAt.current.set(0, 0.5, -2);
    } else if (pathname === "/menu") {
      // Focus on the coffee cup placeholder
      targetPosition.current.set(0, 1.2, 3);
      targetLookAt.current.set(0, 0.4, 0);
    } else if (pathname === "/contact") {
      targetPosition.current.set(-2, 1, 4);
      targetLookAt.current.set(1, 0, 0);
    }

    // Apply Mouse Parallax (subtle sway)
    // Only apply if not on mobile (can check via window innerWidth, but keeping it subtle is fine for all)
    const parallaxX = mx * 0.3;
    const parallaxY = my * 0.3;
    
    targetPosition.current.x += parallaxX;
    targetPosition.current.y += parallaxY;

    // Smooth Lerp
    camera.position.lerp(targetPosition.current, d * 2.5);
    currentLookAt.current.lerp(targetLookAt.current, d * 3.0);
    camera.lookAt(currentLookAt.current);
  });

  return null;
}
