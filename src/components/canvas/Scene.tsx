"use client";

import { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { View, Preload, PerspectiveCamera, Environment, Sparkles, Clouds, Cloud, PerformanceMonitor } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette, Noise } from "@react-three/postprocessing";
import * as THREE from "three";
import FloatingDust from "@/components/canvas/FloatingDust";
import PremiumBean from "@/components/canvas/PremiumBean";

export default function Scene({ ...props }) {
  const [mounted, setMounted] = useState(false);
  const [dpr, setDpr] = useState(1.5);
  const [isLowPerf, setIsLowPerf] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
      }}
    >
      <Canvas
        dpr={dpr}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        eventPrefix="client"
        {...props}
      >
        {/* Theo dõi hiệu năng thiết bị */}
        <PerformanceMonitor 
          onIncline={() => { setDpr(1.5); setIsLowPerf(false); }} 
          onDecline={() => { setDpr(1); setIsLowPerf(true); }} 
        />

        {/* Camera toàn cục */}
        <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={50} />

        {/* Hiệu ứng môi trường ánh sáng chuẩn Cinematic */}
        <Environment preset="studio" />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} color="#C5A880" castShadow />

        {/* Màu sương mù môi trường (Fog) */}
        <fog attach="fog" args={['#1A0F0A', 5, 20]} />

        {/* Vật thể trung tâm */}
        <PremiumBean isLowPerf={isLowPerf} />

        {/* Hạt bụi nắng lơ lửng bằng Sparkles (Giảm số lượng trên thiết bị yếu) */}
        <Sparkles count={isLowPerf ? 500 : 1500} scale={15} size={3} speed={0.3} opacity={0.4} color="#E8D8C0" />

        {/* Sương mù và khói cà phê bằng Clouds (Giảm segments trên thiết bị yếu) */}
        <Clouds material={THREE.MeshBasicMaterial}>
          <Cloud segments={isLowPerf ? 10 : 30} bounds={[15, 2, 2]} volume={15} color="#C5A880" opacity={0.08} position={[0, -2, -5]} speed={0.2} />
          <Cloud segments={isLowPerf ? 10 : 30} bounds={[15, 2, 2]} volume={15} color="#F4EFEA" opacity={0.05} position={[0, 3, -8]} speed={0.25} />
        </Clouds>

        {/* Hệ thống sương mù & hạt bụi vàng kim chuyển động slow-motion */}
        <FloatingDust />

        {/* Cổng kết nối View.Port cho từng component con */}
        <View.Port />
        <Preload all />

        {/* Hậu kỳ điện ảnh */}
        <EffectComposer disableNormalPass>
          <Bloom luminanceThreshold={0.5} luminanceSmoothing={0.9} height={300} intensity={isLowPerf ? 1.0 : 1.5} />
          <Vignette eskil={false} offset={0.1} darkness={1.1} />
          {!isLowPerf && <Noise opacity={0.02} />}
        </EffectComposer>
      </Canvas>
    </div>
  );
}
