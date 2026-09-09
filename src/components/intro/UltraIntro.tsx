"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

// ╔═══════════════════════════════════════════════════════════════════════════╗
// ║  CONSTANTS & TIMELINE                                                     ║
// ╚═══════════════════════════════════════════════════════════════════════════╝

const STAR_COUNT = 2200;
const PARTICLE_COUNT = 3600;

// Coffee cup particle distribution
const CUP_BODY  = 1800;  // Tapered cylinder wall
const SAUCER    = 800;   // Flat disc below cup
const HANDLE    = 400;   // D-shaped arc on +x side
const STEAM     = 600;   // Rising wisps above rim
const STEAM_START = CUP_BODY + SAUCER + HANDLE; // index 3000

// Timeline markers (seconds)
const T1 = 1.5;   // End spiral → Start explosion
const T2 = 2.0;   // End explosion → Start vortex morph
const T3 = 3.4;   // End morph → Start warp/fade
const T4 = 4.1;   // Unmount intro

// ╔═══════════════════════════════════════════════════════════════════════════╗
// ║  1. COSMIC GALAXY — 2,200 STARS ROTATING IN DEEP SPACE                   ║
// ╚═══════════════════════════════════════════════════════════════════════════╝

function CosmicGalaxy() {
  const pointsRef = useRef<THREE.Points>(null);

  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(STAR_COUNT * 3);
    const col = new Float32Array(STAR_COUNT * 3);
    const palette = [
      new THREE.Color("#C88A4B"),
      new THREE.Color("#FFB84D"),
      new THREE.Color("#9B72CF"),
      new THREE.Color("#FFF4D0"),
      new THREE.Color("#ffffff"),
    ];
    for (let i = 0; i < STAR_COUNT; i++) {
      const radius = 2 + Math.pow(Math.random(), 0.7) * 32;
      const angle = Math.random() * Math.PI * 2;
      pos[i * 3]     = Math.cos(angle) * radius;
      pos[i * 3 + 1] = Math.sin(angle) * radius * 0.75;
      pos[i * 3 + 2] = -50 + Math.random() * 70;
      const c = palette[Math.floor(Math.random() * palette.length)];
      col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b;
    }
    return { positions: pos, colors: col };
  }, []);

  useFrame((_, delta) => {
    if (!pointsRef.current) return;
    pointsRef.current.rotation.z += Math.min(delta, 0.05) * 0.05;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color"    args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.06} vertexColors transparent opacity={0.85}
        blending={THREE.AdditiveBlending} depthWrite={false} sizeAttenuation
      />
    </points>
  );
}

// ╔═══════════════════════════════════════════════════════════════════════════╗
// ║  2. TWIN ENERGY ORBS — SPIRAL INWARD (0s – 1.5s)                         ║
// ╚═══════════════════════════════════════════════════════════════════════════╝

interface TimeRefProp { timeRef: React.MutableRefObject<number> }

function TwinEnergyOrbs({ timeRef }: TimeRefProp) {
  const orbARef   = useRef<THREE.Group>(null);
  const orbBRef   = useRef<THREE.Group>(null);
  const trailsRef = useRef<THREE.Points>(null);

  const trailCount = 320;
  const halfTrail  = 160;

  const { trailPositions, trailColors } = useMemo(() => {
    const pos = new Float32Array(trailCount * 3);
    const col = new Float32Array(trailCount * 3);
    const cA = new THREE.Color("#FFB84D");
    const cB = new THREE.Color("#FFF4D0");
    for (let i = 0; i < trailCount; i++) {
      const isA = i < halfTrail;
      const factor = isA ? 1 - i / halfTrail : 1 - (i - halfTrail) / halfTrail;
      const base = isA ? cA : cB;
      col[i * 3] = base.r * factor;
      col[i * 3 + 1] = base.g * factor;
      col[i * 3 + 2] = base.b * factor;
    }
    return { trailPositions: pos, trailColors: col };
  }, []);

  useFrame(() => {
    const t = timeRef.current;
    if (t >= T1) {
      if (orbARef.current)   orbARef.current.visible   = false;
      if (orbBRef.current)   orbBRef.current.visible   = false;
      if (trailsRef.current) trailsRef.current.visible = false;
      return;
    }

    const p      = Math.min(t / T1, 1.0);
    const radius = 3.5 * Math.pow(1 - p, 1.4);
    const angle  = Math.pow(p, 2.3) * 32.0;
    const ax =  radius * Math.cos(angle);
    const ay =  radius * Math.sin(angle) * 0.65;
    const az =  Math.sin(angle * 1.5) * 0.35;
    const bx = -radius * Math.cos(angle);
    const by = -radius * Math.sin(angle) * 0.65;
    const bz = -Math.sin(angle * 1.5) * 0.35;

    if (orbARef.current) {
      orbARef.current.position.set(ax, ay, az);
      orbARef.current.scale.setScalar(1.0 + Math.sin(t * 15) * 0.15);
    }
    if (orbBRef.current) {
      orbBRef.current.position.set(bx, by, bz);
      orbBRef.current.scale.setScalar(1.0 + Math.cos(t * 15) * 0.15);
    }

    // Ring-buffer particle trails
    if (trailsRef.current) {
      const arr = (trailsRef.current.geometry.attributes.position.array) as Float32Array;
      for (let i = halfTrail - 1; i > 0; i--) {
        arr[i*3]=arr[(i-1)*3]; arr[i*3+1]=arr[(i-1)*3+1]; arr[i*3+2]=arr[(i-1)*3+2];
      }
      arr[0]=ax; arr[1]=ay; arr[2]=az;
      for (let i = trailCount - 1; i > halfTrail; i--) {
        arr[i*3]=arr[(i-1)*3]; arr[i*3+1]=arr[(i-1)*3+1]; arr[i*3+2]=arr[(i-1)*3+2];
      }
      arr[halfTrail*3]=bx; arr[halfTrail*3+1]=by; arr[halfTrail*3+2]=bz;
      trailsRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <>
      {/* Orb A — Warm amber */}
      <group ref={orbARef} position={[3.5,0,0]}>
        <mesh><sphereGeometry args={[0.18,32,32]}/><meshBasicMaterial color="#FFB84D"/></mesh>
        <mesh><sphereGeometry args={[0.32,24,24]}/><meshBasicMaterial color="#FF9E1B" transparent opacity={0.35} blending={THREE.AdditiveBlending} depthWrite={false}/></mesh>
        <pointLight color="#FFB84D" intensity={4} distance={6}/>
      </group>
      {/* Orb B — White gold */}
      <group ref={orbBRef} position={[-3.5,0,0]}>
        <mesh><sphereGeometry args={[0.18,32,32]}/><meshBasicMaterial color="#FFF4D0"/></mesh>
        <mesh><sphereGeometry args={[0.32,24,24]}/><meshBasicMaterial color="#FFE599" transparent opacity={0.35} blending={THREE.AdditiveBlending} depthWrite={false}/></mesh>
        <pointLight color="#FFF4D0" intensity={4} distance={6}/>
      </group>
      {/* Particle trails */}
      <points ref={trailsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[trailPositions, 3]}/>
          <bufferAttribute attach="attributes-color"    args={[trailColors, 3]}/>
        </bufferGeometry>
        <pointsMaterial size={0.07} vertexColors transparent opacity={0.7} blending={THREE.AdditiveBlending} depthWrite={false} sizeAttenuation/>
      </points>
    </>
  );
}

// ╔═══════════════════════════════════════════════════════════════════════════╗
// ║  3. COFFEE CUP PARTICLE SYSTEM                                            ║
// ║     Explosion (1.5s) → Vortex Swirl (2.0s) → Morph to Cup (3.4s)         ║
// ╚═══════════════════════════════════════════════════════════════════════════╝

function CoffeeCupParticleSystem({ timeRef }: TimeRefProp) {
  const pointsRef = useRef<THREE.Points>(null);

  const data = useMemo(() => {
    const positions    = new Float32Array(PARTICLE_COUNT * 3);
    const velocities   = new Float32Array(PARTICLE_COUNT * 3);
    const targets      = new Float32Array(PARTICLE_COUNT * 3);
    const colors       = new Float32Array(PARTICLE_COUNT * 3);
    const swirlPhases  = new Float32Array(PARTICLE_COUNT);

    const palette = [
      new THREE.Color("#FFFFFF"),
      new THREE.Color("#FFF5E1"),
      new THREE.Color("#FFB84D"),
      new THREE.Color("#E5A96B"),
      new THREE.Color("#C88A4B"),
    ];

    // ── Initial positions (center cluster) + explosion velocities + colors ──
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      positions[i*3]   = (Math.random()-0.5)*0.08;
      positions[i*3+1] = (Math.random()-0.5)*0.08;
      positions[i*3+2] = (Math.random()-0.5)*0.08;

      const phi   = Math.acos(2*Math.random()-1);
      const theta = Math.random()*Math.PI*2;
      const speed = 5.0 + Math.pow(Math.random(),1.5)*18.0;
      velocities[i*3]   = Math.sin(phi)*Math.cos(theta)*speed;
      velocities[i*3+1] = Math.sin(phi)*Math.sin(theta)*speed;
      velocities[i*3+2] = Math.cos(phi)*speed;

      const c = palette[Math.floor(Math.random()*palette.length)];
      colors[i*3]=c.r; colors[i*3+1]=c.g; colors[i*3+2]=c.b;

      swirlPhases[i] = Math.random()*Math.PI*2;
    }

    // ── TARGET POSITIONS: Build the 3D Coffee Cup ──
    let idx = 0;

    // Cup Body — tapered cylinder wall (r₁=0.8 bottom, r₂=1.1 rim, h ∈ [-0.6, 0.8])
    for (let i = 0; i < CUP_BODY && idx < PARTICLE_COUNT; i++, idx++) {
      const h     = -0.6 + Math.random()*1.4;
      const tNorm = (h + 0.6) / 1.4;            // 0 (bottom) → 1 (rim)
      const r     = 0.8 + tNorm * 0.3;           // radius widens toward rim
      const angle = Math.random()*Math.PI*2;
      const rr    = r + (Math.random()-0.5)*0.04; // slight wall thickness
      targets[idx*3]   = rr * Math.cos(angle);
      targets[idx*3+1] = h;
      targets[idx*3+2] = rr * Math.sin(angle);
    }

    // Saucer — flat disc (y = -0.7, r ∈ [0.4, 1.6])
    for (let i = 0; i < SAUCER && idx < PARTICLE_COUNT; i++, idx++) {
      const angle = Math.random()*Math.PI*2;
      const r     = 0.4 + Math.random()*1.2;
      targets[idx*3]   = r * Math.cos(angle);
      targets[idx*3+1] = -0.7 + (Math.random()-0.5)*0.05;
      targets[idx*3+2] = r * Math.sin(angle);
    }

    // Handle — D-shaped arc (semi-circle on +x side)
    for (let i = 0; i < HANDLE && idx < PARTICLE_COUNT; i++, idx++) {
      const t  = -Math.PI/2 + Math.random()*Math.PI;  // -π/2 → π/2
      const hr = 0.35 + (Math.random()-0.5)*0.04;
      targets[idx*3]   = 1.1  + hr * Math.cos(t);          // x: cup wall → outward
      targets[idx*3+1] = 0.15 + hr * 1.25 * Math.sin(t);   // y: centered on cup
      targets[idx*3+2] = (Math.random()-0.5)*0.05;          // z: thin handle
    }

    // Steam — rising wisps above rim (y > 0.8)
    for (let i = 0; i < STEAM && idx < PARTICLE_COUNT; i++, idx++) {
      const sh    = 0.9 + Math.random()*1.2;
      const angle = Math.random()*Math.PI*2;
      const r     = Math.random()*0.45;
      targets[idx*3]   = r * Math.cos(angle);
      targets[idx*3+1] = sh;
      targets[idx*3+2] = r * Math.sin(angle);
    }

    return { positions, velocities, targets, colors, swirlPhases };
  }, []);

  useFrame((_, delta) => {
    if (!pointsRef.current) return;
    const t = timeRef.current;
    const d = Math.min(delta, 0.04);

    // Phase 1: Hidden while orbs spiral
    if (t < T1) { pointsRef.current.visible = false; return; }
    pointsRef.current.visible = true;

    const posAttr = pointsRef.current.geometry.attributes.position;
    const arr     = posAttr.array as Float32Array;

    if (t < T2) {
      // ═══ PHASE 2: EXPLOSION — particles fly outward with drag ═══
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const ix = i*3;
        arr[ix]   += data.velocities[ix]   * d;
        arr[ix+1] += data.velocities[ix+1] * d;
        arr[ix+2] += data.velocities[ix+2] * d;
        data.velocities[ix]   *= 0.94;
        data.velocities[ix+1] *= 0.94;
        data.velocities[ix+2] *= 0.94;
      }
      pointsRef.current.rotation.z += d * 0.5;

    } else if (t < T3) {
      // ═══ PHASE 3: VORTEX MORPH → COFFEE CUP ═══
      const mp       = Math.min((t - T2) / (T3 - T2), 1.0);
      const smoothed = mp * mp * (3 - 2 * mp);           // smoothstep
      const lerpSpd  = 1.5 + smoothed * 6.5;             // accelerating convergence
      const swirlAng = (1 - smoothed) * Math.PI * 5;     // decreasing vortex rotation
      const expDecay = Math.max(0, 1 - mp * 4);          // explosion residue dies in first ¼

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const ix = i * 3;

        // Residual explosion momentum (decays rapidly)
        if (expDecay > 0) {
          arr[ix]   += data.velocities[ix]   * d * expDecay;
          arr[ix+1] += data.velocities[ix+1] * d * expDecay;
          arr[ix+2] += data.velocities[ix+2] * d * expDecay;
          data.velocities[ix]   *= 0.88;
          data.velocities[ix+1] *= 0.88;
          data.velocities[ix+2] *= 0.88;
        }

        // Swirled target (vortex effect: each particle spirals uniquely)
        const totalSwirl = swirlAng + data.swirlPhases[i];
        const cosS = Math.cos(totalSwirl);
        const sinS = Math.sin(totalSwirl);
        const tx   = data.targets[ix];
        const ty   = data.targets[ix+1];
        const tz   = data.targets[ix+2];
        const swirlX = tx * cosS - tz * sinS;
        const swirlZ = tx * sinS + tz * cosS;

        // Magnetic pull toward swirled target
        arr[ix]   += (swirlX - arr[ix])   * lerpSpd * d;
        arr[ix+1] += (ty     - arr[ix+1]) * lerpSpd * d;
        arr[ix+2] += (swirlZ - arr[ix+2]) * lerpSpd * d;

        // Steam wobble — activates once particles are halfway converged
        if (i >= STEAM_START && mp > 0.4) {
          const sf = (mp - 0.4) / 0.6;
          arr[ix]   += Math.sin(t * 2   + i * 0.5)  * 0.03 * sf;
          arr[ix+1] += Math.sin(t * 1.5 + i * 0.3)  * 0.06 * sf;
          arr[ix+2] += Math.cos(t * 2.3 + i * 0.4)  * 0.03 * sf;
        }
      }

      // Cup rotation — fast at start, settling as it forms
      pointsRef.current.rotation.y += d * (1.0 - smoothed * 0.4);
      // Flatten initial explosion Z-rotation
      pointsRef.current.rotation.z = THREE.MathUtils.lerp(
        pointsRef.current.rotation.z, 0, d * 3
      );

    } else {
      // ═══ PHASE 4: CUP FORMED — gentle rotation + drifting steam ═══
      pointsRef.current.rotation.y += d * 0.5;

      // Only animate steam particles (indices 3000+)
      for (let i = STEAM_START; i < PARTICLE_COUNT; i++) {
        const ix = i * 3;
        arr[ix]   += Math.sin(t * 2   + i * 0.5) * d * 0.1;
        arr[ix+1] += d * 0.15;                                  // drift upward
        arr[ix+2] += Math.cos(t * 2.3 + i * 0.4) * d * 0.1;
      }
    }

    posAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef} visible={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[data.positions, 3]}/>
        <bufferAttribute attach="attributes-color"    args={[data.colors, 3]}/>
      </bufferGeometry>
      <pointsMaterial
        size={0.055} vertexColors transparent opacity={0.95}
        blending={THREE.AdditiveBlending} depthWrite={false} sizeAttenuation
      />
    </points>
  );
}

// ╔═══════════════════════════════════════════════════════════════════════════╗
// ║  4. CAMERA DIRECTOR — Dolly, shake, warp                                  ║
// ╚═══════════════════════════════════════════════════════════════════════════╝

function CameraDirector({ timeRef }: TimeRefProp) {
  useFrame((state, delta) => {
    const d = Math.min(delta, 0.05);
    const t = timeRef.current;

    if (t < T1) {
      // Phase 1: Stable with gentle breathing
      state.camera.position.z = 7.5 + Math.sin(t * 3) * 0.1;
      state.camera.position.x = Math.sin(t * 2) * 0.05;
      state.camera.position.y = Math.cos(t * 2) * 0.05;

    } else if (t < T2) {
      // Phase 2: Micro-shake during explosion
      const shake = Math.max(0, 0.2 - (t - T1) * 0.4);
      state.camera.position.x = (Math.random()-0.5) * shake;
      state.camera.position.y = (Math.random()-0.5) * shake;
      state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, 6.5, d * 2);

    } else if (t < T3) {
      // Phase 3: Pull closer to see the cup forming
      state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, 0, d * 4);
      state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, 0.15, d * 2);
      state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, 5.0, d * 1.8);

    } else {
      // Phase 4: Warp — fly through the cup into the homepage
      state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, -8.0, d * 4.5);
      if (state.camera instanceof THREE.PerspectiveCamera) {
        state.camera.fov = THREE.MathUtils.lerp(state.camera.fov, 75, d * 3.5);
        state.camera.updateProjectionMatrix();
      }
    }
  });
  return null;
}

// ╔═══════════════════════════════════════════════════════════════════════════╗
// ║  5. SCENE MANAGER — Master clock + scene assembly                         ║
// ╚═══════════════════════════════════════════════════════════════════════════╝

function SceneManager({ timeRef }: TimeRefProp) {
  useFrame((_, delta) => { timeRef.current += Math.min(delta, 0.05); });
  return (
    <>
      <CameraDirector timeRef={timeRef}/>
      <CosmicGalaxy/>
      <TwinEnergyOrbs timeRef={timeRef}/>
      <CoffeeCupParticleSystem timeRef={timeRef}/>
    </>
  );
}

// ╔═══════════════════════════════════════════════════════════════════════════╗
// ║  MAIN EXPORT: UltraIntro                                                  ║
// ║  HTML overlay + WebGL Canvas + timeline orchestration                      ║
// ╚═══════════════════════════════════════════════════════════════════════════╝

type IntroStage = "orbit" | "flash" | "morph" | "reveal" | "warp";

export default function UltraIntro() {
  const [showIntro, setShowIntro] = useState(true);
  const [stage, setStage]         = useState<IntroStage>("orbit");
  const [counter, setCounter]     = useState(1);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const timeRef = useRef<number>(0);

  const handleSkip = useCallback(() => {
    document.body.style.overflow = "auto";
    setShowIntro(false);
  }, []);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    timeRef.current = 0;

    // ── Counter animation: 1% → 100% in 1.5s ──
    const startTime = performance.now();
    const duration  = 1500;
    const updateCounter = () => {
      const elapsed  = performance.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      setCounter(Math.max(1, Math.min(100, Math.floor(progress * 100))));
      if (progress < 1) requestAnimationFrame(updateCounter);
    };
    const animFrame = requestAnimationFrame(updateCounter);

    // ── Timeline choreography ──
    const tFlash  = setTimeout(() => setStage("flash"),  1500);  // 1.5s: Flash bang
    const tMorph  = setTimeout(() => setStage("morph"),  1750);  // 1.75s: Morphing begins
    const tReveal = setTimeout(() => setStage("reveal"), 2700);  // 2.7s: Cup ~50% formed → text
    const tWarp   = setTimeout(() => {
      setStage("warp");
      setIsFadingOut(true);
    }, 3400);                                                     // 3.4s: Warp to homepage
    const tEnd = setTimeout(() => {
      document.body.style.overflow = "auto";
      setShowIntro(false);
    }, 4100);                                                     // 4.1s: Done

    return () => {
      cancelAnimationFrame(animFrame);
      clearTimeout(tFlash);
      clearTimeout(tMorph);
      clearTimeout(tReveal);
      clearTimeout(tWarp);
      clearTimeout(tEnd);
      document.body.style.overflow = "auto";
    };
  }, []);

  if (!showIntro) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="ultra-intro-container"
        initial={{ opacity: 1 }}
        animate={isFadingOut ? { opacity: 0, scale: 1.05 } : { opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
        className="fixed inset-0 z-[99999] bg-[#030202] flex items-center justify-center overflow-hidden select-none"
      >
        {/* ═══ NEBULA BACKDROP ═══ */}
        <div
          className="absolute inset-0 pointer-events-none z-0"
          style={{ background: "radial-gradient(ellipse at center, #180e07 0%, #08050e 50%, #030202 100%)" }}
        />
        <div className="absolute -top-[20%] -left-[10%] w-[60vw] h-[60vw] rounded-full bg-[#C88A4B]/10 blur-[130px] pointer-events-none"/>
        <div className="absolute -bottom-[20%] -right-[10%] w-[60vw] h-[60vw] rounded-full bg-[#6B46C1]/12 blur-[140px] pointer-events-none"/>

        {/* ═══ 3D WEBGL CANVAS ═══ */}
        <div className="absolute inset-0 z-10">
          <Canvas
            camera={{ position: [0, 0, 7.5], fov: 50 }}
            gl={{ antialias: true, powerPreference: "high-performance", alpha: true }}
            dpr={[1, 2]}
          >
            <SceneManager timeRef={timeRef}/>
          </Canvas>
        </div>

        {/* ═══ FLASH BANG (1.5s → 1.75s) ═══ */}
        <AnimatePresence>
          {stage === "flash" && (
            <motion.div
              key="flash-bang"
              initial={{ opacity: 1 }}
              animate={{ opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="absolute inset-0 z-30 pointer-events-none"
              style={{
                background: "radial-gradient(circle at center, #FFFFFF 15%, #FFF4D0 40%, rgba(255,184,77,0.8) 70%, transparent 100%)",
              }}
            />
          )}
        </AnimatePresence>

        {/* ═══ HTML OVERLAY ═══ */}
        <div className="relative z-20 flex flex-col items-center justify-center w-full h-full pointer-events-none px-4">

          {/* COUNTER — visible during orbit stage (0s – 1.5s) */}
          <AnimatePresence>
            {stage === "orbit" && (
              <motion.div
                key="central-counter"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 2.2, filter: "blur(12px)" }}
                transition={{ duration: 0.2 }}
                className="flex flex-col items-center justify-center gap-3"
              >
                <div className="w-3 h-3 rounded-full bg-[#FFF4D0] shadow-[0_0_25px_8px_rgba(255,184,77,0.9)] animate-pulse"/>
                <div className="text-center">
                  <div className="font-mono text-5xl md:text-7xl lg:text-8xl font-light tracking-tighter text-[#FFF4D0] drop-shadow-[0_0_35px_rgba(255,184,77,0.8)]">
                    {counter}
                    <span className="text-2xl md:text-3xl font-mono text-[#FFB84D] ml-1 font-normal opacity-90">%</span>
                  </div>
                  <div className="mt-1 flex items-center justify-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FFB84D] animate-ping"/>
                    <span className="text-[#FFB84D] font-mono text-[10px] md:text-xs tracking-[0.35em] uppercase font-semibold">
                      ENERGY CONVERGENCE
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* BRAND REVEAL — below the forming cup (2.7s → end) */}
          <AnimatePresence>
            {(stage === "reveal" || stage === "warp") && (
              <motion.div
                key="brand-reveal"
                initial={{ opacity: 0, y: 30, filter: "blur(14px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -30, filter: "blur(8px)" }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="absolute bottom-[18%] left-0 right-0 flex flex-col items-center text-center px-4"
              >
                <div className="overflow-hidden mb-2">
                  <motion.h1
                    initial={{ y: "100%" }}
                    animate={{ y: "0%" }}
                    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                    className="font-serif text-4xl md:text-6xl lg:text-8xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-[#FFFFFF] via-[#FFF4D0] to-[#FFB84D] drop-shadow-[0_0_45px_rgba(255,184,77,0.65)]"
                  >
                    CẨM CÙ HOUSE
                  </motion.h1>
                </div>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="flex items-center justify-center gap-3 text-xs md:text-sm tracking-[0.4em] uppercase font-mono text-[#E5A96B]"
                >
                  <span>COFFEE & FOOD</span>
                  <span className="w-1 h-1 rounded-full bg-[#FFB84D]"/>
                  <span>GIA NGHĨA</span>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ═══ SKIP BUTTON ═══ */}
        <div className="fixed bottom-6 right-6 z-50 pointer-events-auto">
          <button
            onClick={handleSkip}
            type="button"
            className="group flex items-center gap-2 px-4 py-2 rounded-full bg-[#08050e]/60 hover:bg-[#180e07]/80 backdrop-blur-md border border-[#FFB84D]/30 hover:border-[#FFB84D]/80 text-[#FFF4D0]/70 hover:text-[#FFF4D0] transition-all duration-300 shadow-[0_0_20px_rgba(0,0,0,0.5)] cursor-pointer"
          >
            <span className="font-mono text-[10px] md:text-xs tracking-[0.2em] uppercase font-medium">
              Bỏ qua / Skip
            </span>
            <svg className="w-3.5 h-3.5 text-[#FFB84D] transition-transform duration-300 group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7"/>
            </svg>
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
