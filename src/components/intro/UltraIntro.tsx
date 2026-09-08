"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

// ============================================================================
// 1. COSMIC GALAXY CANVAS (DẢI NGÂN HÀ 2,200 NGÔI SAO & VÙNG SÂU VŨ TRỤ)
// ============================================================================
function CosmicGalaxy() {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 2200;

  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);

    const palette = [
      new THREE.Color("#C88A4B"), // Amber vàng ấm
      new THREE.Color("#FFB84D"), // Golden amber
      new THREE.Color("#9B72CF"), // Cosmic violet huyền bí
      new THREE.Color("#FFF4D0"), // White gold tinh khiết
      new THREE.Color("#ffffff"), // Pure starlight
    ];

    for (let i = 0; i < count; i++) {
      // Đa tầng Z sâu thẳm từ -50 đến +20
      const radius = 2 + Math.pow(Math.random(), 0.7) * 32;
      const angle = Math.random() * Math.PI * 2;
      
      pos[i * 3] = Math.cos(angle) * radius;
      pos[i * 3 + 1] = Math.sin(angle) * radius * 0.75;
      pos[i * 3 + 2] = -50 + Math.random() * 70; // -50 đến +20

      const c = palette[Math.floor(Math.random() * palette.length)];
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }
    return { positions: pos, colors: col };
  }, [count]);

  useFrame((_, delta) => {
    if (!pointsRef.current) return;
    const d = Math.min(delta, 0.05);
    // Toàn bộ nền dải ngân hà tự quay chậm quanh trục Z
    pointsRef.current.rotation.z += d * 0.05;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
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

// ============================================================================
// 2. TWIN ENERGY ORBS & PARTICLE TRAILS (0.0s - 1.6s)
// ============================================================================
interface TwinOrbsProps {
  timeRef: React.MutableRefObject<number>;
}

function TwinEnergyOrbs({ timeRef }: TwinOrbsProps) {
  const orbARef = useRef<THREE.Group>(null);
  const orbBRef = useRef<THREE.Group>(null);
  const trailsRef = useRef<THREE.Points>(null);

  // Trail buffer: 160 hạt cho Orb A + 160 hạt cho Orb B
  const trailCount = 320;
  const halfTrail = 160;

  const { trailPositions, trailColors } = useMemo(() => {
    const pos = new Float32Array(trailCount * 3);
    const col = new Float32Array(trailCount * 3);

    const colorA = new THREE.Color("#FFB84D"); // Amber
    const colorB = new THREE.Color("#FFF4D0"); // White-gold

    for (let i = 0; i < trailCount; i++) {
      const isOrbA = i < halfTrail;
      const baseColor = isOrbA ? colorA : colorB;
      const factor = isOrbA ? 1 - i / halfTrail : 1 - (i - halfTrail) / halfTrail;

      col[i * 3] = baseColor.r * factor;
      col[i * 3 + 1] = baseColor.g * factor;
      col[i * 3 + 2] = baseColor.b * factor;
    }

    return { trailPositions: pos, trailColors: col };
  }, [trailCount, halfTrail]);

  useFrame(() => {
    const t = timeRef.current;
    
    // Khi nổ (t >= 1.6s), ẩn ngay 2 quả cầu
    if (t >= 1.6) {
      if (orbARef.current) orbARef.current.visible = false;
      if (orbBRef.current) orbBRef.current.visible = false;
      if (trailsRef.current) trailsRef.current.visible = false;
      return;
    }

    // Tiến trình chuyển động (0 -> 1.0 trong 1.6 giây)
    const p = Math.min(t / 1.6, 1.0);
    
    // Bán kính xoắn ốc co dần từ 3.5 về 0 theo hàm mũ
    const radius = 3.5 * Math.pow(1 - p, 1.4);
    // Tốc độ quay tăng dần cực đại
    const angle = Math.pow(p, 2.3) * 32.0;

    // Tọa độ Orb A
    const ax = radius * Math.cos(angle);
    const ay = radius * Math.sin(angle) * 0.65;
    const az = Math.sin(angle * 1.5) * 0.35;

    // Tọa độ Orb B (đối xứng 180 độ)
    const bx = -radius * Math.cos(angle);
    const by = -radius * Math.sin(angle) * 0.65;
    const bz = -Math.sin(angle * 1.5) * 0.35;

    if (orbARef.current) {
      orbARef.current.position.set(ax, ay, az);
      // Kích thước co nhẹ khi tăng gia tốc
      const scale = 1.0 + Math.sin(t * 15) * 0.15;
      orbARef.current.scale.setScalar(scale);
    }

    if (orbBRef.current) {
      orbBRef.current.position.set(bx, by, bz);
      const scale = 1.0 + Math.cos(t * 15) * 0.15;
      orbBRef.current.scale.setScalar(scale);
    }

    // Cập nhật mảng hạt đuôi (Particle Trail Ring Buffer)
    if (trailsRef.current) {
      const posAttr = trailsRef.current.geometry.attributes.position;
      const arr = posAttr.array as Float32Array;

      // Shift trail của Orb A
      for (let i = halfTrail - 1; i > 0; i--) {
        arr[i * 3] = arr[(i - 1) * 3];
        arr[i * 3 + 1] = arr[(i - 1) * 3 + 1];
        arr[i * 3 + 2] = arr[(i - 1) * 3 + 2];
      }
      arr[0] = ax;
      arr[1] = ay;
      arr[2] = az;

      // Shift trail của Orb B
      for (let i = trailCount - 1; i > halfTrail; i--) {
        arr[i * 3] = arr[(i - 1) * 3];
        arr[i * 3 + 1] = arr[(i - 1) * 3 + 1];
        arr[i * 3 + 2] = arr[(i - 1) * 3 + 2];
      }
      arr[halfTrail * 3] = bx;
      arr[halfTrail * 3 + 1] = by;
      arr[halfTrail * 3 + 2] = bz;

      posAttr.needsUpdate = true;
    }
  });

  return (
    <>
      {/* QUẢ CẦU A: Hổ phách vàng ấm rực rỡ */}
      <group ref={orbARef} position={[3.5, 0, 0]}>
        {/* Lõi phát quang */}
        <mesh>
          <sphereGeometry args={[0.18, 32, 32]} />
          <meshBasicMaterial color="#FFB84D" />
        </mesh>
        {/* Quầng hào quang bên ngoài */}
        <mesh>
          <sphereGeometry args={[0.32, 24, 24]} />
          <meshBasicMaterial
            color="#FF9E1B"
            transparent
            opacity={0.35}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
        <pointLight color="#FFB84D" intensity={4} distance={6} />
      </group>

      {/* QUẢ CẦU B: Vàng kim loại sáng chói */}
      <group ref={orbBRef} position={[-3.5, 0, 0]}>
        {/* Lõi phát quang */}
        <mesh>
          <sphereGeometry args={[0.18, 32, 32]} />
          <meshBasicMaterial color="#FFF4D0" />
        </mesh>
        {/* Quầng hào quang bên ngoài */}
        <mesh>
          <sphereGeometry args={[0.32, 24, 24]} />
          <meshBasicMaterial
            color="#FFE599"
            transparent
            opacity={0.35}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
        <pointLight color="#FFF4D0" intensity={4} distance={6} />
      </group>

      {/* VỆT ĐUÔI HẠT SÁNG (PARTICLE TRAIL) */}
      <points ref={trailsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[trailPositions, 3]} />
          <bufferAttribute attach="attributes-color" args={[trailColors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.07}
          vertexColors
          transparent
          opacity={0.7}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          sizeAttenuation
        />
      </points>
    </>
  );
}

// ============================================================================
// 3. ELECTRON SHOCKWAVE BURST (3,600 HẠT LƯỢNG TỬ PHÂN TÁN 360 ĐỘ) (1.6s+)
// ============================================================================
interface ElectronBurstProps {
  timeRef: React.MutableRefObject<number>;
}

function ElectronShockwaveBurst({ timeRef }: ElectronBurstProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 3600;

  const { positions, velocities, colors } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);

    const palette = [
      new THREE.Color("#FFFFFF"), // Tia trắng chói lõi
      new THREE.Color("#FFF4D0"), // Vàng kim loại
      new THREE.Color("#FFB84D"), // Hổ phách rực rỡ
      new THREE.Color("#E5A96B"), // Vàng hoàng gia
      new THREE.Color("#C88A4B"), // Amber Cẩm Cù
    ];

    for (let i = 0; i < count; i++) {
      // Vị trí khởi điểm tập trung tại tâm va chạm (0, 0, 0)
      pos[i * 3] = (Math.random() - 0.5) * 0.08;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 0.08;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 0.08;

      // Phân tán hình cầu lượng tử đa hướng (Spherical divergence)
      const phi = Math.acos(2 * Math.random() - 1);
      const theta = Math.random() * Math.PI * 2;
      
      // Vận tốc phân kỳ cực lớn (từ tia nhanh xé gió đến cụm bụi electron mờ)
      const speed = 4.0 + Math.pow(Math.random(), 1.6) * 18.0;

      vel[i * 3] = Math.sin(phi) * Math.cos(theta) * speed;
      vel[i * 3 + 1] = Math.sin(phi) * Math.sin(theta) * speed;
      vel[i * 3 + 2] = Math.cos(phi) * speed;

      const c = palette[Math.floor(Math.random() * palette.length)];
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }

    return { positions: pos, velocities: vel, colors: col };
  }, [count]);

  useFrame((_, delta) => {
    if (!pointsRef.current) return;
    const t = timeRef.current;

    // Chỉ kích hoạt và hiển thị khi t >= 1.6s
    if (t < 1.6) {
      pointsRef.current.visible = false;
      return;
    }

    pointsRef.current.visible = true;
    const d = Math.min(delta, 0.04);
    const posAttr = pointsRef.current.geometry.attributes.position;
    const arr = posAttr.array as Float32Array;

    // Thời gian trôi kể từ vụ nổ
    const dtExplosion = t - 1.6;

    // Giảm tốc nhẹ và phân tán rộng
    const drag = Math.max(0.92, 1.0 - dtExplosion * 0.06);

    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      velocities[idx] *= drag;
      velocities[idx + 1] *= drag;
      velocities[idx + 2] *= drag;

      arr[idx] += velocities[idx] * d;
      arr[idx + 1] += velocities[idx + 1] * d;
      arr[idx + 2] += velocities[idx + 2] * d;
    }

    // Tự xoay cụm electron khi đang giãn nở
    pointsRef.current.rotation.z += d * 0.25;
    posAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef} visible={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.065}
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

// ============================================================================
// 4. CAMERA RIG & DOLLY-IN TRANSITION (2.4s - 3.0s)
// ============================================================================
function CameraDirector({ timeRef }: { timeRef: React.MutableRefObject<number> }) {
  useFrame((state, delta) => {
    const d = Math.min(delta, 0.05);
    const t = timeRef.current;

    if (t < 1.6) {
      // Giai đoạn 2 quả cầu xoay: Camera ổn định tại z = 7.5 với chuyển động thở nhẹ
      state.camera.position.z = 7.5 + Math.sin(t * 3) * 0.1;
      state.camera.position.x = Math.sin(t * 2) * 0.05;
      state.camera.position.y = Math.cos(t * 2) * 0.05;
    } else if (t >= 1.6 && t < 2.4) {
      // Vụ nổ: Camera rung lắc lượng tử (Micro-camera shake)
      const shakeIntensity = Math.max(0, 0.2 - (t - 1.6) * 0.25);
      state.camera.position.x = (Math.random() - 0.5) * shakeIntensity;
      state.camera.position.y = (Math.random() - 0.5) * shakeIntensity;
      state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, 6.0, d * 2);
    } else if (t >= 2.4) {
      // Warp to homepage: Camera lao vút về phía trước xuyên qua màn bụi electron
      state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, -8.0, d * 4.5);
      if (state.camera instanceof THREE.PerspectiveCamera) {
        state.camera.fov = THREE.MathUtils.lerp(state.camera.fov, 75, d * 3.5);
        state.camera.updateProjectionMatrix();
      }
    }
  });

  return null;
}

// ============================================================================
// 5. MASTER CONTROLLER & CHOREOGRAPHY
// ============================================================================
function SceneManager({ timeRef }: { timeRef: React.MutableRefObject<number> }) {
  useFrame((_, delta) => {
    timeRef.current += Math.min(delta, 0.05);
  });

  return (
    <>
      <CameraDirector timeRef={timeRef} />
      <CosmicGalaxy />
      <TwinEnergyOrbs timeRef={timeRef} />
      <ElectronShockwaveBurst timeRef={timeRef} />
    </>
  );
}

// ============================================================================
// MAIN EXPORT COMPONENT: UltraIntro
// ============================================================================
export default function UltraIntro() {
  const [showIntro, setShowIntro] = useState(true);
  const [stage, setStage] = useState<"orbit" | "flash" | "burst" | "warp">("orbit");
  const [counter, setCounter] = useState(1);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const timeRef = useRef<number>(0);

  // Xử lý nút Bỏ qua / Skip
  const handleSkip = useCallback(() => {
    document.body.style.overflow = "auto";
    setShowIntro(false);
  }, []);

  useEffect(() => {
    // Khóa cuộn trang tuyệt đối khi đang chạy intro
    document.body.style.overflow = "hidden";
    timeRef.current = 0;

    // Bộ đếm nhảy từ 1% đến 100% đồng bộ với 1.6 giây xoay của 2 quả cầu
    const startTime = performance.now();
    const duration = 1600; // 1.6s

    const updateCounter = () => {
      const elapsed = performance.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Gia tốc đếm tăng dần đến 100%
      const val = Math.max(1, Math.min(100, Math.floor(progress * 100)));
      setCounter(val);

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      }
    };
    const animFrame = requestAnimationFrame(updateCounter);

    // Kịch bản dòng thời gian điện ảnh chính xác (Timeline Sequences)
    // 1. Chạm 1.6s: BÙM! 2 quả cầu va chạm, chớp sáng trắng/vàng flash
    const tFlash = setTimeout(() => {
      setStage("flash");
    }, 1600);

    // 2. Chạm 1.75s: Tia phân tán mở ra, hiện tên thương hiệu "CẨM CÙ HOUSE"
    const tBurst = setTimeout(() => {
      setStage("burst");
    }, 1750);

    // 3. Chạm 2.4s: Camera Dolly-in xuyên qua màn bụi, toàn bộ intro mờ dần
    const tWarp = setTimeout(() => {
      setStage("warp");
      setIsFadingOut(true);
    }, 2400);

    // 4. Chạm 3.0s: Hoàn tất, mở cuộn và unmount hoàn toàn
    const tEnd = setTimeout(() => {
      document.body.style.overflow = "auto";
      setShowIntro(false);
    }, 3050);

    return () => {
      cancelAnimationFrame(animFrame);
      clearTimeout(tFlash);
      clearTimeout(tBurst);
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
        transition={{ duration: 0.65, ease: [0.76, 0, 0.24, 1] }}
        className="fixed inset-0 z-[99999] bg-[#030202] flex items-center justify-center overflow-hidden select-none"
      >
        {/* NỀN TINH VÂN KHÓI MỜ VŨ TRỤ (COSMIC NEBULA BACKDROP) */}
        <div 
          className="absolute inset-0 pointer-events-none z-0"
          style={{
            background: "radial-gradient(ellipse at center, #180e07 0%, #08050e 50%, #030202 100%)",
          }}
        />

        {/* CỤM MÀU KHÓI TINH VÂN HỔ PHÁCH VÀ TÍM VŨ TRỤ */}
        <div className="absolute -top-[20%] -left-[10%] w-[60vw] h-[60vw] rounded-full bg-[#C88A4B]/10 blur-[130px] pointer-events-none" />
        <div className="absolute -bottom-[20%] -right-[10%] w-[60vw] h-[60vw] rounded-full bg-[#6B46C1]/12 blur-[140px] pointer-events-none" />

        {/* 3D WEBGL GALAXY & TWIN ORBS CANVAS */}
        <div className="absolute inset-0 z-10">
          <Canvas
            camera={{ position: [0, 0, 7.5], fov: 50 }}
            gl={{ antialias: true, powerPreference: "high-performance", alpha: true }}
            dpr={[1, 2]}
          >
            <SceneManager timeRef={timeRef} />
          </Canvas>
        </div>

        {/* CHỚP SÁNG TRẮNG CHÓI LÒA (FLASH BANG TRẮNG/VÀNG) TẠI 1.6S (0.15s) */}
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

        {/* LỚP UI OVERLAY & BỘ ĐẾM NĂNG LƯỢNG */}
        <div className="relative z-20 flex flex-col items-center justify-center w-full h-full pointer-events-none px-4">
          
          {/* BỘ ĐẾM 1% -> 100% NGAY TÂM GIỮA 2 QUẢ CẦU ĐANG XOAY (0.0s - 1.6s) */}
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
                {/* Hạt nhân tâm năng lượng */}
                <div className="w-3 h-3 rounded-full bg-[#FFF4D0] shadow-[0_0_25px_8px_rgba(255,184,77,0.9)] animate-pulse" />

                <div className="text-center">
                  <div className="font-mono text-5xl md:text-7xl lg:text-8xl font-light tracking-tighter text-[#FFF4D0] drop-shadow-[0_0_35px_rgba(255,184,77,0.8)]">
                    {counter}
                    <span className="text-2xl md:text-3xl font-mono text-[#FFB84D] ml-1 font-normal opacity-90">%</span>
                  </div>

                  <div className="mt-1 flex items-center justify-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FFB84D] animate-ping" />
                    <span className="text-[#FFB84D] font-mono text-[10px] md:text-xs tracking-[0.35em] uppercase font-semibold">
                      ENERGY CONVERGENCE
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* CHỮ "CẨM CÙ HOUSE" XÉ TOẠC MÀN KHÓI HẠT HIỆN RA (1.75s - 3.0s) */}
          <AnimatePresence>
            {(stage === "burst" || stage === "warp") && (
              <motion.div
                key="brand-reveal"
                initial={{ opacity: 0, scale: 0.85, filter: "blur(14px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -40, filter: "blur(8px)" }}
                transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col items-center justify-center text-center max-w-4xl"
              >
                <div className="overflow-hidden mb-2">
                  <motion.h1
                    initial={{ y: "100%" }}
                    animate={{ y: "0%" }}
                    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                    className="font-serif text-5xl md:text-7xl lg:text-9xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-[#FFFFFF] via-[#FFF4D0] to-[#FFB84D] drop-shadow-[0_0_45px_rgba(255,184,77,0.65)]"
                  >
                    CẨM CÙ HOUSE
                  </motion.h1>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="flex items-center justify-center gap-3 text-xs md:text-sm tracking-[0.4em] uppercase font-mono text-[#E5A96B]"
                >
                  <span>COFFEE & FOOD</span>
                  <span className="w-1 h-1 rounded-full bg-[#FFB84D]" />
                  <span>GIA NGHĨA</span>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* NÚT BỎ QUA / SKIP TINH TẾ Ở GÓC PHẢI DƯỚI */}
        <div className="fixed bottom-6 right-6 z-50 pointer-events-auto">
          <button
            onClick={handleSkip}
            type="button"
            className="group flex items-center gap-2 px-4 py-2 rounded-full bg-[#08050e]/60 hover:bg-[#180e07]/80 backdrop-blur-md border border-[#FFB84D]/30 hover:border-[#FFB84D]/80 text-[#FFF4D0]/70 hover:text-[#FFF4D0] transition-all duration-300 shadow-[0_0_20px_rgba(0,0,0,0.5)] cursor-pointer"
          >
            <span className="font-mono text-[10px] md:text-xs tracking-[0.2em] uppercase font-medium">
              Bỏ qua / Skip
            </span>
            <svg
              className="w-3.5 h-3.5 text-[#FFB84D] transition-transform duration-300 group-hover:translate-x-0.5"
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
