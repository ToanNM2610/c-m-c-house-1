"use client";

import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as random from "maath/random/dist/maath-random.esm";
import * as THREE from "three";

export default function ParticleBackground(props: any) {
  const ref = useRef<THREE.Points>(null!);
  
  // Tạo quỹ đạo hạt ngẫu nhiên dạng cầu (Float32Array có độ dài chia hết cho 3)
  const [sphere] = useState(() => random.inSphere(new Float32Array(5000 * 3), { radius: 1.5 }) as Float32Array);

  useFrame((state, delta) => {
    if (!ref.current) return;
    
    // Chuyển động xoay nhẹ nhàng liên tục
    ref.current.rotation.x -= delta / 10;
    ref.current.rotation.y -= delta / 15;
    
    // Hiệu ứng Parallax tương tác với chuột (tính toán dựa trên tọa độ pointer của state)
    const mouseX = (state.pointer.x * Math.PI) / 10;
    const mouseY = (state.pointer.y * Math.PI) / 10;
    
    // Sử dụng lerp để chuyển động mượt mà về phía chuột
    ref.current.rotation.x += (mouseY - ref.current.rotation.x) * 0.05;
    ref.current.rotation.y += (mouseX - ref.current.rotation.y) * 0.05;
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={false} {...props}>
        <PointMaterial
          transparent
          color="#d2b48c"
          size={0.005}
          sizeAttenuation={true}
          depthWrite={false}
        />
      </Points>
    </group>
  );
}
