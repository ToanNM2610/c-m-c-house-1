"use client";

import React, { useRef, useEffect, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { usePathname } from "next/navigation";
import { useScene } from "@/context/SceneContext";

export default function CameraRig() {
  const { camera } = useThree();
  const pathname = usePathname() || "";
  const { introState, scrollProgress } = useScene();
  
  const mouse = useRef({ x: 0, y: 0 });
  const localScroll = useRef(0);
  
  // Track target position and rotation to lerp towards
  const targetPosition = useRef(new THREE.Vector3(0, 1.5, 8));
  const targetLookAt = useRef(new THREE.Vector3(0, 0, 0));
  const currentLookAt = useRef(new THREE.Vector3(0, 0, 0));

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMouseMove);
  }, []);

  useFrame((_, delta) => {
    const d = Math.min(delta, 0.05);
    
    // We use context scrollProgress, but allow fallback
    const lenis = typeof window !== "undefined" ? (window as any).__lenis : null;
    const sp = lenis && typeof lenis.progress === "number" ? lenis.progress : scrollProgress;
    
    // Only smooth out scroll slightly if needed, but Context is already updating it.
    localScroll.current = THREE.MathUtils.lerp(localScroll.current, sp, d * 5.0);
    const scroll = localScroll.current;

    const mx = mouse.current.x;
    const my = mouse.current.y;

    // --- Cinematic Camera Choreography ---
    
    if (pathname === "/") {
      if (introState === "darkness") {
        targetPosition.current.set(0, 1.5, 12);
        targetLookAt.current.set(0, 1.5, 0);
      } else if (introState === "light") {
        targetPosition.current.set(0, 1.5, 10);
        targetLookAt.current.set(0, 0.5, 0);
      } else if (introState === "reveal") {
        targetPosition.current.set(0, 1.5, 8);
        targetLookAt.current.set(0, 0.5, 0);
      } else {
        // "enter" or "done" => Scroll driven
        // Phase 1: sp=0 -> far away, maybe looking slightly down
        // Phase 2: sp>0.1 -> closer to the shop environment
        const zPos = 8 - scroll * 6; // Move from 8 to 2
        const yPos = 1.5 + scroll * 0.5; 
        const xPos = Math.sin(scroll * Math.PI) * 1.5; 
        
        targetPosition.current.set(xPos, yPos, zPos);
        targetLookAt.current.set(0, 0.5 - scroll * 0.5, 0);
      }
    } else if (pathname === "/about") {
      targetPosition.current.set(2, 1.2, 5);
      targetLookAt.current.set(-1, 0, 0);
    } else if (pathname === "/space") {
      targetPosition.current.set(0, 1.5, 6);
      targetLookAt.current.set(0, 0.5, -2);
    } else if (pathname === "/menu") {
      targetPosition.current.set(0, 1.2, 3);
      targetLookAt.current.set(0, 0.4, 0);
    } else {
      targetPosition.current.set(-2, 1, 4);
      targetLookAt.current.set(1, 0, 0);
    }

    // Apply Mouse Parallax (subtle sway)
    if (introState === "done" || introState === "enter") {
      const parallaxX = mx * 0.3;
      const parallaxY = my * 0.3;
      targetPosition.current.x += parallaxX;
      targetPosition.current.y += parallaxY;
    }

    // Smooth Lerp
    // Use slower lerp for intro transitions
    const lerpSpeed = (introState === "done" || introState === "enter") ? 2.5 : 1.0;
    
    camera.position.lerp(targetPosition.current, d * lerpSpeed);
    currentLookAt.current.lerp(targetLookAt.current, d * lerpSpeed * 1.2);
    camera.lookAt(currentLookAt.current);
  });

  return null;
}
