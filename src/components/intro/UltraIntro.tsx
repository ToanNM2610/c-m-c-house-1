"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

// ╔═══════════════════════════════════════════════════════════════════════════╗
// ║  CONSTANTS & TIMELINE SPECIFICATIONS                                      ║
// ╚═══════════════════════════════════════════════════════════════════════════╝

const STAR_COUNT = 2500;
const PARTICLE_COUNT = 4000;

// Coffee cup particle distribution: 800 + 2000 + 500 + 700 = 4000
const SAUCER    = 800;   // Đĩa lót sứ: y ∈ [-0.75, -0.65], r ∈ [0.4, 1.8]
const CUP_BODY  = 2000;  // Thân tách: y ∈ [-0.65, 0.75], r: 0.85 → 1.25
const HANDLE    = 500;   // Quai tách: x ∈ [1.25, 1.9], y ∈ [-0.3, 0.5]
const STEAM     = 700;   // Khói bốc: y > 0.8, sin wave undulation
const STEAM_START = SAUCER + CUP_BODY + HANDLE; // index 3300

// Timeline markers (seconds)
const T1 = 1.5;   // Giai đoạn 1: Hai cầu hội tụ & Bộ đếm 1% -> 100%
const T2 = 1.8;   // Giai đoạn 2: BÙM - Sóng xung kích 4000 hạt nổ tung
const T3 = 3.3;   // Giai đoạn 3: Magnetic Vortex & Morphing thành Tách Cà Phê 3D
const T4 = 4.0;   // Giai đoạn 4: Camera lao xuyên qua miệng tách vào Trang Chủ

// ╔═══════════════════════════════════════════════════════════════════════════╗
// ║  1. COSMIC GALAXY — 2,500 STARS ROTATING IN DEEP UNIVERSE                 ║
// ╚═══════════════════════════════════════════════════════════════════════════╝

function CosmicGalaxy() {
  const pointsRef = useRef<THREE.Points>(null);

  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(STAR_COUNT * 3);
    const col = new Float32Array(STAR_COUNT * 3);
    const palette = [
      new THREE.Color("#C88A4B"),
      new THREE.Color("#FFE0A3"),
      new THREE.Color("#E5A96B"),
      new THREE.Color("#8A64D0"),
      new THREE.Color("#FFFFFF"),
    ];

    for (let i = 0; i < STAR_COUNT; i++) {
      const radius = 2.0 + Math.pow(Math.random(), 0.65) * 34.0;
      const angle = Math.random() * Math.PI * 2;
      pos[i * 3]     = Math.cos(angle) * radius;
      pos[i * 3 + 1] = Math.sin(angle) * radius * 0.72;
      pos[i * 3 + 2] = -50 + Math.random() * 70;

      const c = palette[Math.floor(Math.random() * palette.length)];
      col[i * 3]     = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
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
        size={0.065}
        vertexColors
        transparent
        opacity={0.85}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}

// ╔═══════════════════════════════════════════════════════════════════════════╗
// ║  2. TWIN ENERGY ORBS — SPIRAL CONVERGENCE (0.0s – 1.5s)                   ║
// ║     Orb A: Hổ phách (#C88A4B) & Orb B: Crema (#FFE0A3)                    ║
// ╚═══════════════════════════════════════════════════════════════════════════╝

interface TimeRefProp {
  timeRef: React.MutableRefObject<number>;
}

function TwinEnergyOrbs({ timeRef }: TimeRefProp) {
  const orbARef   = useRef<THREE.Group>(null);
  const orbBRef   = useRef<THREE.Group>(null);
  const trailsRef = useRef<THREE.Points>(null);

  const trailCount = 360;
  const halfTrail  = 180;

  const { trailPositions, trailColors } = useMemo(() => {
    const pos = new Float32Array(trailCount * 3);
    const col = new Float32Array(trailCount * 3);
    const cA = new THREE.Color("#C88A4B"); // Hổ phách
    const cB = new THREE.Color("#FFE0A3"); // Crema

    for (let i = 0; i < trailCount; i++) {
      const isA = i < halfTrail;
      const factor = isA ? 1 - i / halfTrail : 1 - (i - halfTrail) / halfTrail;
      const base = isA ? cA : cB;
      col[i * 3]     = base.r * factor;
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
    const radius = 3.6 * Math.pow(1 - p, 1.35);
    const angle  = Math.pow(p, 2.2) * 34.0;

    const ax =  radius * Math.cos(angle);
    const ay =  radius * Math.sin(angle) * 0.65;
    const az =  Math.sin(angle * 1.5) * 0.35;

    const bx = -radius * Math.cos(angle);
    const by = -radius * Math.sin(angle) * 0.65;
    const bz = -Math.sin(angle * 1.5) * 0.35;

    if (orbARef.current) {
      orbARef.current.position.set(ax, ay, az);
      orbARef.current.scale.setScalar(1.0 + Math.sin(t * 16) * 0.15);
    }
    if (orbBRef.current) {
      orbBRef.current.position.set(bx, by, bz);
      orbBRef.current.scale.setScalar(1.0 + Math.cos(t * 16) * 0.15);
    }

    // Dynamic ring-buffer trails
    if (trailsRef.current) {
      const arr = trailsRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = halfTrail - 1; i > 0; i--) {
        arr[i * 3]     = arr[(i - 1) * 3];
        arr[i * 3 + 1] = arr[(i - 1) * 3 + 1];
        arr[i * 3 + 2] = arr[(i - 1) * 3 + 2];
      }
      arr[0] = ax; arr[1] = ay; arr[2] = az;

      for (let i = trailCount - 1; i > halfTrail; i--) {
        arr[i * 3]     = arr[(i - 1) * 3];
        arr[i * 3 + 1] = arr[(i - 1) * 3 + 1];
        arr[i * 3 + 2] = arr[(i - 1) * 3 + 2];
      }
      arr[halfTrail * 3]     = bx;
      arr[halfTrail * 3 + 1] = by;
      arr[halfTrail * 3 + 2] = bz;

      trailsRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <>
      {/* Orb A — Quả cầu Hổ phách (#C88A4B) */}
      <group ref={orbARef} position={[3.6, 0, 0]}>
        <mesh>
          <sphereGeometry args={[0.18, 32, 32]} />
          <meshBasicMaterial color="#C88A4B" />
        </mesh>
        <mesh>
          <sphereGeometry args={[0.34, 24, 24]} />
          <meshBasicMaterial
            color="#E5A96B"
            transparent
            opacity={0.4}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
        <pointLight color="#C88A4B" intensity={5} distance={7} />
      </group>

      {/* Orb B — Quả cầu Vàng bọt Crema (#FFE0A3) */}
      <group ref={orbBRef} position={[-3.6, 0, 0]}>
        <mesh>
          <sphereGeometry args={[0.18, 32, 32]} />
          <meshBasicMaterial color="#FFE0A3" />
        </mesh>
        <mesh>
          <sphereGeometry args={[0.34, 24, 24]} />
          <meshBasicMaterial
            color="#FFF4D0"
            transparent
            opacity={0.4}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
        <pointLight color="#FFE0A3" intensity={5} distance={7} />
      </group>

      {/* Particle trails */}
      <points ref={trailsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[trailPositions, 3]} />
          <bufferAttribute attach="attributes-color"    args={[trailColors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.075}
          vertexColors
          transparent
          opacity={0.75}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          sizeAttenuation
        />
      </points>
    </>
  );
}

// ╔═══════════════════════════════════════════════════════════════════════════╗
// ║  3. 4,000 PARTICLE SYSTEM & COFFEE CUP MORPHING                           ║
// ║     Explosion (1.5s) → Magnetic Vortex & Cup (1.8s–3.3s) → Warp (3.3s+)  ║
// ╚═══════════════════════════════════════════════════════════════════════════╝

function CoffeeCupParticleSystem({ timeRef }: TimeRefProp) {
  const pointsRef = useRef<THREE.Points>(null);

  const data = useMemo(() => {
    const positions   = new Float32Array(PARTICLE_COUNT * 3);
    const velocities  = new Float32Array(PARTICLE_COUNT * 3);
    const targets     = new Float32Array(PARTICLE_COUNT * 3);
    const colors      = new Float32Array(PARTICLE_COUNT * 3);
    const swirlPhases = new Float32Array(PARTICLE_COUNT);

    const cupPalette = [
      new THREE.Color("#FFFFFF"),
      new THREE.Color("#FFE0A3"), // Crema gold
      new THREE.Color("#FFD17A"),
      new THREE.Color("#C88A4B"), // Amber
      new THREE.Color("#E5A96B"),
      new THREE.Color("#B36B22"),
    ];

    const steamPalette = [
      new THREE.Color("#FFFFFF"),
      new THREE.Color("#FFF8EB"),
      new THREE.Color("#FFE0A3"),
      new THREE.Color("#FFD899"),
    ];

    // ── Initial positions (center cluster) + explosion velocities + colors ──
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 0.08;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 0.08;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 0.08;

      const phi   = Math.acos(2 * Math.random() - 1);
      const theta = Math.random() * Math.PI * 2;
      const speed = 5.5 + Math.pow(Math.random(), 1.4) * 19.0;
      velocities[i * 3]     = Math.sin(phi) * Math.cos(theta) * speed;
      velocities[i * 3 + 1] = Math.sin(phi) * Math.sin(theta) * speed;
      velocities[i * 3 + 2] = Math.cos(phi) * speed;

      const isSteam = i >= STEAM_START;
      const pal = isSteam ? steamPalette : cupPalette;
      const c = pal[Math.floor(Math.random() * pal.length)];
      colors[i * 3]     = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;

      swirlPhases[i] = Math.random() * Math.PI * 2;
    }

    // ── TARGET POSITIONS: DỰNG HÌNH TÁCH CÀ PHÊ 3D HOÀN CHỈNH ──
    let idx = 0;

    // 1. ĐĨA LÓT SỨ (Saucer - 800 hạt):
    // Phân bổ hình đĩa tròn dẹt ở đáy y ∈ [-0.75, -0.65], bán kính r ∈ [0.4, 1.8]
    for (let i = 0; i < SAUCER && idx < PARTICLE_COUNT; i++, idx++) {
      const angle = Math.random() * Math.PI * 2;
      // Dùng phân bổ bán kính có trọng số để hạt phủ đều mặt đĩa và gờ đĩa
      const r = 0.4 + Math.sqrt(Math.random()) * 1.4; // [0.4, 1.8]
      const y = -0.75 + Math.random() * 0.10;         // [-0.75, -0.65]
      targets[idx * 3]     = r * Math.cos(angle);
      targets[idx * 3 + 1] = y;
      targets[idx * 3 + 2] = r * Math.sin(angle);
    }

    // 2. THÂN TÁCH (Cup Body - 2,000 hạt):
    // Phân bổ hình nón cụt/trụ thuôn: y ∈ [-0.65, 0.75], bán kính tăng dần r_bottom = 0.85 lên miệng r_top = 1.25
    for (let i = 0; i < CUP_BODY && idx < PARTICLE_COUNT; i++, idx++) {
      const y = -0.65 + Math.random() * 1.40;         // y ∈ [-0.65, 0.75]
      const tNorm = (y + 0.65) / 1.40;                // 0 ở đáy -> 1 ở miệng tách
      const rBase = 0.85 + tNorm * (1.25 - 0.85);     // 0.85 -> 1.25
      const angle = Math.random() * Math.PI * 2;
      const rr = rBase + (Math.random() - 0.5) * 0.05; // Độ dày thành tách
      targets[idx * 3]     = rr * Math.cos(angle);
      targets[idx * 3 + 1] = y;
      targets[idx * 3 + 2] = rr * Math.sin(angle);
    }

    // 3. QUAI TÁCH (Handle - 500 hạt):
    // Uốn cung tròn 3D bên mạn phải: x ∈ [1.25, 1.9], y ∈ [-0.3, 0.5]
    for (let i = 0; i < HANDLE && idx < PARTICLE_COUNT; i++, idx++) {
      const t = -Math.PI / 2 + Math.random() * Math.PI; // Cung bán nguyệt -π/2 -> π/2
      const arcRadiusX = 0.65;
      const arcRadiusY = 0.40;
      const centerX = 1.25;
      const centerY = 0.10;
      const hx = centerX + arcRadiusX * Math.cos(t) + (Math.random() - 0.5) * 0.04;
      const hy = centerY + arcRadiusY * Math.sin(t) + (Math.random() - 0.5) * 0.04;
      const hz = (Math.random() - 0.5) * 0.08; // Độ dày khối quai 3D
      targets[idx * 3]     = hx;
      targets[idx * 3 + 1] = hy;
      targets[idx * 3 + 2] = hz;
    }

    // 4. LÀN KHÓI HƯƠNG THƠM (Rising Steam - 700 hạt):
    // Nằm phía trên miệng ly (y > 0.8), tạo cụm khói lan tỏa
    for (let i = 0; i < STEAM && idx < PARTICLE_COUNT; i++, idx++) {
      const angle = Math.random() * Math.PI * 2;
      const sy = 0.85 + Math.random() * 1.55; // y ∈ [0.85, 2.4]
      const spread = 0.15 + (sy - 0.85) * 0.30;
      const sr = Math.random() * spread;
      targets[idx * 3]     = sr * Math.cos(angle);
      targets[idx * 3 + 1] = sy;
      targets[idx * 3 + 2] = sr * Math.sin(angle);
    }

    return { positions, velocities, targets, colors, swirlPhases };
  }, []);

  useFrame((_, delta) => {
    if (!pointsRef.current) return;
    const t = timeRef.current;
    const d = Math.min(delta, 0.04);

    // Giai đoạn 1: Ẩn hạt khi hai quả cầu đang xoay hội tụ
    if (t < T1) {
      pointsRef.current.visible = false;
      return;
    }
    pointsRef.current.visible = true;

    const posAttr = pointsRef.current.geometry.attributes.position;
    const arr     = posAttr.array as Float32Array;

    if (t < T2) {
      // ═══ GIAI ĐOẠN 2 (1.5s - 1.8s): VA CHẠM NỔ BÙM (SUPERNOVA SHOCKWAVE) ═══
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const ix = i * 3;
        arr[ix]     += data.velocities[ix]     * d;
        arr[ix + 1] += data.velocities[ix + 1] * d;
        arr[ix + 2] += data.velocities[ix + 2] * d;
        data.velocities[ix]     *= 0.93;
        data.velocities[ix + 1] *= 0.93;
        data.velocities[ix + 2] *= 0.93;
      }
      pointsRef.current.rotation.z += d * 0.6;

    } else if (t < T3) {
      // ═══ GIAI ĐOẠN 3 (1.8s - 3.3s): TỪ TRƯỜNG ĐẢO CHIỀU & HÓA HÌNH TÁCH CÀ PHÊ ═══
      const mp       = Math.min((t - T2) / (T3 - T2), 1.0);
      const smoothed = mp * mp * (3 - 2 * mp);             // Smoothstep
      const lerpSpd  = 2.0 + smoothed * 7.5;               // Gia tốc hút Attractor
      const swirlAng = (1 - smoothed) * Math.PI * 5.5;     // Xoáy lốc Magnetic Vortex
      const expDecay = Math.max(0, 1 - mp * 4.0);          // Triệt tiêu xung lực nổ

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const ix = i * 3;

        // Triệt tiêu vận tốc nổ dư thừa
        if (expDecay > 0) {
          arr[ix]     += data.velocities[ix]     * d * expDecay;
          arr[ix + 1] += data.velocities[ix + 1] * d * expDecay;
          arr[ix + 2] += data.velocities[ix + 2] * d * expDecay;
          data.velocities[ix]     *= 0.86;
          data.velocities[ix + 1] *= 0.86;
          data.velocities[ix + 2] *= 0.86;
        }

        // Tọa độ mục tiêu xoay theo lốc xoáy từ trường
        const totalSwirl = swirlAng + data.swirlPhases[i];
        const cosS = Math.cos(totalSwirl);
        const sinS = Math.sin(totalSwirl);
        const tx   = data.targets[ix];
        const ty   = data.targets[ix + 1];
        const tz   = data.targets[ix + 2];
        const swirlX = tx * cosS - tz * sinS;
        const swirlZ = tx * sinS + tz * cosS;

        // Lực từ trường đảo chiều hút các hạt vào tọa độ tách cà phê
        arr[ix]     += (swirlX - arr[ix])     * lerpSpd * d;
        arr[ix + 1] += (ty     - arr[ix + 1]) * lerpSpd * d;
        arr[ix + 2] += (swirlZ - arr[ix + 2]) * lerpSpd * d;

        // Làn khói hương thơm: Cuộn sóng theo Math.sin(time * 2 + index)
        if (i >= STEAM_START && mp > 0.35) {
          const sf = (mp - 0.35) / 0.65;
          arr[ix]     += Math.sin(t * 2.0 + i)        * 0.035 * sf;
          arr[ix + 1] += Math.sin(t * 1.6 + i * 0.4)  * 0.055 * sf;
          arr[ix + 2] += Math.cos(t * 2.2 + i * 0.6)  * 0.035 * sf;
        }
      }

      // Chiếc tách tự xoay nhẹ quanh trục Y
      pointsRef.current.rotation.y += d * (0.8 - smoothed * 0.3);
      pointsRef.current.rotation.z = THREE.MathUtils.lerp(
        pointsRef.current.rotation.z,
        0,
        d * 3.5
      );

    } else {
      // ═══ GIAI ĐOẠN 4 (3.3s - 4.0s): TÁCH ĐÃ HÌNH THÀNH HOÀN CHỈNH ═══
      // Chiếc tách lơ lửng, tự xoay nhẹ quanh trục Y (rotation.y += delta * 0.5)
      pointsRef.current.rotation.y += d * 0.5;

      // 700 hạt khói bốc lượn nhẹ nhàng lên cao theo hàm sin
      for (let i = STEAM_START; i < PARTICLE_COUNT; i++) {
        const ix = i * 3;
        arr[ix]     += Math.sin(t * 2.0 + i)       * d * 0.12;
        arr[ix + 1] += d * 0.18; // Bốc lượn nhẹ nhàng lên cao
        arr[ix + 2] += Math.cos(t * 2.0 + i * 0.5) * d * 0.12;
      }
    }

    posAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef} visible={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[data.positions, 3]} />
        <bufferAttribute attach="attributes-color"    args={[data.colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.055}
        vertexColors
        transparent
        opacity={0.95}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}

// ╔═══════════════════════════════════════════════════════════════════════════╗
// ║  4. CAMERA DIRECTOR — Dolly Zoom & Fly-Through vào Trang Chủ              ║
// ╚═══════════════════════════════════════════════════════════════════════════╝

function CameraDirector({ timeRef }: TimeRefProp) {
  useFrame((state, delta) => {
    const d = Math.min(delta, 0.05);
    const t = timeRef.current;

    if (t < T1) {
      // Giai đoạn 1: Ổn định và thở nhẹ theo nhịp
      state.camera.position.z = 7.5 + Math.sin(t * 3.0) * 0.08;
      state.camera.position.x = Math.sin(t * 2.0) * 0.04;
      state.camera.position.y = Math.cos(t * 2.0) * 0.04;

    } else if (t < T2) {
      // Giai đoạn 2: Rung chấn vi mô khi va chạm nổ BÙM
      const shake = Math.max(0, 0.22 - (t - T1) * 0.5);
      state.camera.position.x = (Math.random() - 0.5) * shake;
      state.camera.position.y = (Math.random() - 0.5) * shake;
      state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, 6.4, d * 2.5);

    } else if (t < T3) {
      // Giai đoạn 3: Camera kéo gần lại chiêm ngưỡng chiếc tách cà phê 3D đang thành hình
      state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, 0, d * 4.0);
      state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, 0.15, d * 2.2);
      state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, 5.0, d * 2.0);

    } else {
      // Giai đoạn 4: Camera 3D lao vút về phía trước (Dolly Zoom) bay xuyên qua miệng tách cà phê
      state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, -8.5, d * 5.0);
      if (state.camera instanceof THREE.PerspectiveCamera) {
        state.camera.fov = THREE.MathUtils.lerp(state.camera.fov, 78, d * 3.8);
        state.camera.updateProjectionMatrix();
      }
    }
  });
  return null;
}

// ╔═══════════════════════════════════════════════════════════════════════════╗
// ║  5. SCENE MANAGER — Master clock & scene composition                      ║
// ╚═══════════════════════════════════════════════════════════════════════════╝

function SceneManager({ timeRef }: TimeRefProp) {
  useFrame((_, delta) => {
    timeRef.current += Math.min(delta, 0.05);
  });

  return (
    <>
      <CameraDirector timeRef={timeRef} />
      <CosmicGalaxy />
      <TwinEnergyOrbs timeRef={timeRef} />
      <CoffeeCupParticleSystem timeRef={timeRef} />
    </>
  );
}

// ╔═══════════════════════════════════════════════════════════════════════════╗
// ║  MAIN EXPORT: UltraIntro                                                  ║
// ║  Orchestration: Galaxy → Orbs Spiral → Explosion → Cup 3D → Homepage     ║
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
    // Khóa cuộn trang khi mở intro
    document.body.style.overflow = "hidden";
    timeRef.current = 0;

    // ── Bộ đếm số trung tâm: Nhảy mượt từ 01% đến 99% trong 1.5s, chạm 100% khi nổ ──
    const startTime = performance.now();
    const duration  = 1500;
    const updateCounter = () => {
      const elapsed  = performance.now() - startTime;
      const progress = Math.min(elapsed / duration, 1.0);
      const val      = Math.max(1, Math.min(100, Math.floor(progress * 100)));
      setCounter(val);
      if (progress < 1.0) {
        requestAnimationFrame(updateCounter);
      }
    };
    const animFrame = requestAnimationFrame(updateCounter);

    // ── Kịch bản timeline chuyển động (Master Chrono) ──
    // Giai đoạn 2: 1.5s - Chạm 100% & Lóe sáng chớp mắt (Chromatic Flash)
    const tFlash  = setTimeout(() => setStage("flash"), 1500);

    // Giai đoạn 3: 1.8s - Từ trường đảo chiều & hóa hình tách cà phê
    const tMorph  = setTimeout(() => setStage("morph"), 1800);

    // 2.6s - Dòng chữ thương hiệu bừng sáng ánh kim
    const tReveal = setTimeout(() => setStage("reveal"), 2600);

    // Giai đoạn 4: 3.3s - Camera lao xuyên & mở màn vào Trang Chủ
    const tWarp   = setTimeout(() => {
      setStage("warp");
      setIsFadingOut(true);
    }, 3300);

    // 4.0s - Hoàn tất sequence, unmount và mở khóa cuộn trang
    const tEnd = setTimeout(() => {
      document.body.style.overflow = "auto";
      setShowIntro(false);
    }, 4000);

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
        {/* ═══ NỀN KHÔNG GIAN GALAXY & NEBULA SÂU THẲM ═══ */}
        <div
          className="absolute inset-0 pointer-events-none z-0"
          style={{
            background: "radial-gradient(ellipse at center, #180e07 0%, #08050e 50%, #030202 100%)",
          }}
        />
        <div className="absolute -top-[20%] -left-[10%] w-[60vw] h-[60vw] rounded-full bg-[#C88A4B]/10 blur-[130px] pointer-events-none" />
        <div className="absolute -bottom-[20%] -right-[10%] w-[60vw] h-[60vw] rounded-full bg-[#6B46C1]/12 blur-[140px] pointer-events-none" />

        {/* ═══ 3D WEBGL CANVAS (PARTICLE MORPHING & PHYSICS) ═══ */}
        <div className="absolute inset-0 z-10">
          <Canvas
            camera={{ position: [0, 0, 7.5], fov: 50 }}
            gl={{ antialias: true, powerPreference: "high-performance", alpha: true }}
            dpr={[1, 2]}
          >
            <SceneManager timeRef={timeRef} />
          </Canvas>
        </div>

        {/* ═══ GIAI ĐOẠN 2: LÓE SÁNG CHỚP MẮT (CHROMATIC FLASH 1.5s -> 1.8s) ═══ */}
        <AnimatePresence>
          {stage === "flash" && (
            <motion.div
              key="flash-bang"
              initial={{ opacity: 1 }}
              animate={{ opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="absolute inset-0 z-30 pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle at center, #FFFFFF 20%, #FFE0A3 45%, rgba(200,138,75,0.85) 75%, transparent 100%)",
              }}
            />
          )}
        </AnimatePresence>

        {/* ═══ HTML OVERLAY & BRANDING ═══ */}
        <div className="relative z-20 flex flex-col items-center justify-center w-full h-full pointer-events-none px-4">

          {/* GIAI ĐOẠN 1: BỘ ĐẾM SỐ 01% -> 99% / 100% TẠI TÂM */}
          <AnimatePresence>
            {stage === "orbit" && (
              <motion.div
                key="central-counter"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 2.2, filter: "blur(14px)" }}
                transition={{ duration: 0.2 }}
                className="flex flex-col items-center justify-center gap-3"
              >
                <div className="w-3 h-3 rounded-full bg-[#FFE0A3] shadow-[0_0_25px_8px_rgba(200,138,75,0.9)] animate-pulse" />
                <div className="text-center">
                  <div className="font-mono text-5xl md:text-7xl lg:text-8xl font-light tracking-tighter text-[#FFE0A3] drop-shadow-[0_0_35px_rgba(200,138,75,0.8)]">
                    {counter < 10 ? `0${counter}` : counter}
                    <span className="text-2xl md:text-3xl font-mono text-[#C88A4B] ml-1 font-normal opacity-90">%</span>
                  </div>
                  <div className="mt-1 flex items-center justify-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C88A4B] animate-ping" />
                    <span className="text-[#C88A4B] font-mono text-[10px] md:text-xs tracking-[0.35em] uppercase font-semibold">
                      ENERGY CONVERGENCE
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* GIAI ĐOẠN 3 & 4: DÒNG CHỮ THƯƠNG HIỆU BỪNG SÁNG ÁNH KIM DƯỚI TÁCH CÀ PHÊ */}
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
                    className="font-serif text-4xl md:text-6xl lg:text-8xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-[#FFFFFF] via-[#FFE0A3] to-[#C88A4B] drop-shadow-[0_0_45px_rgba(200,138,75,0.7)]"
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
                  <span className="w-1 h-1 rounded-full bg-[#C88A4B]" />
                  <span>GIA NGHĨA</span>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ═══ NÚT BỎ QUA / SKIP ═══ */}
        <div className="fixed bottom-6 right-6 z-50 pointer-events-auto">
          <button
            onClick={handleSkip}
            type="button"
            className="group flex items-center gap-2 px-4 py-2 rounded-full bg-[#08050e]/60 hover:bg-[#180e07]/80 backdrop-blur-md border border-[#C88A4B]/35 hover:border-[#C88A4B]/80 text-[#FFE0A3]/75 hover:text-[#FFE0A3] transition-all duration-300 shadow-[0_0_20px_rgba(0,0,0,0.5)] cursor-pointer"
          >
            <span className="font-mono text-[10px] md:text-xs tracking-[0.2em] uppercase font-medium">
              Bỏ qua / Skip
            </span>
            <svg
              className="w-3.5 h-3.5 text-[#C88A4B] transition-transform duration-300 group-hover:translate-x-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
