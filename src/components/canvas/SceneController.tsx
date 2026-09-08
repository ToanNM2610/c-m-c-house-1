"use client";

import React, { useRef, useMemo, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { usePathname } from "next/navigation";
import * as THREE from "three";

// ==========================================
// 1. ORGANIC FACETED WIREFRAME (HOME & ABOUT)
// ==========================================
function OrganicWireframe({ pathname }: { pathname: string }) {
  const meshRef = useRef<THREE.Group>(null);
  const innerRef = useRef<THREE.Mesh>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const scrollOffset = useRef(0);

  // Lắng nghe chuột và scroll
  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    const onScroll = () => {
      scrollOffset.current = Math.min(window.scrollY / 800, 2);
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // Geometry đa diện mộc sắc sảo
  const { lineGeo, pointGeo } = useMemo(() => {
    const ico = new THREE.IcosahedronGeometry(1.6, 1);
    const wireGeo = new THREE.WireframeGeometry(ico);
    return { lineGeo: wireGeo, pointGeo: ico };
  }, []);

  useFrame((_, delta) => {
    if (!meshRef.current) return;

    // Tốc độ xoay tự nhiên
    meshRef.current.rotation.y += delta * 0.2;
    meshRef.current.rotation.x += delta * 0.1;

    if (innerRef.current) {
      innerRef.current.rotation.y -= delta * 0.3;
      innerRef.current.rotation.z += delta * 0.15;
    }

    // Biến đổi vị trí và kích thước dựa theo URL route
    let targetPos = new THREE.Vector3(0, 0, 0);
    let targetScale = 1.0;
    let targetOpacity = 1.0;

    if (pathname === "/") {
      // Trang chủ: ở trung tâm, phóng to nhẹ theo scroll, phản hồi chuột nhẹ
      targetPos.set(
        mouse.current.x * 0.4,
        mouse.current.y * 0.3 - scrollOffset.current * 0.5,
        scrollOffset.current * 0.6
      );
      targetScale = 1.1 + scrollOffset.current * 0.25;
      targetOpacity = 0.95;
    } else if (pathname === "/about") {
      // Trang giới thiệu: dạt sang góc phải, thu nhỏ tinh tế
      targetPos.set(1.7, -0.2, -0.5);
      targetScale = 0.65;
      targetOpacity = 0.85;
    } else if (pathname === "/space") {
      // Không gian: đặt phía sau thấp
      targetPos.set(-1.6, 0.4, -1.0);
      targetScale = 0.55;
      targetOpacity = 0.6;
    } else if (pathname === "/menu") {
      // Menu: góc mờ dịu mắt
      targetPos.set(1.9, 0.8, -1.5);
      targetScale = 0.5;
      targetOpacity = 0.4;
    } else {
      // Trang khác / Contact: ẩn hoàn toàn nhường chỗ cho Dot Globe
      targetOpacity = 0.0;
      targetScale = 0.001;
    }

    // Nội suy mượt mà 60-120fps (lerp)
    meshRef.current.position.lerp(targetPos, delta * 3.5);
    meshRef.current.scale.lerp(
      new THREE.Vector3(targetScale, targetScale, targetScale),
      delta * 3.5
    );
  });

  return (
    <group ref={meshRef}>
      {/* Khung đường line vàng ánh kim */}
      <lineSegments geometry={lineGeo}>
        <lineBasicMaterial color="#C88A4B" transparent opacity={0.65} linewidth={1} />
      </lineSegments>

      {/* Các điểm đỉnh phát quang */}
      <points geometry={pointGeo}>
        <pointsMaterial color="#FDFBF7" size={0.06} transparent opacity={0.8} />
      </points>

      {/* Lõi bên trong mờ ảo */}
      <mesh ref={innerRef}>
        <icosahedronGeometry args={[0.9, 0]} />
        <meshBasicMaterial color="#2D4A3E" wireframe transparent opacity={0.4} />
      </mesh>
    </group>
  );
}

// ==========================================
// 2. INTERACTIVE DOT GLOBE (CHO TRANG /contact)
// ==========================================
function InteractiveDotGlobe({ active }: { active: boolean }) {
  const globeRef = useRef<THREE.Group>(null);
  const beaconRef = useRef<THREE.Mesh>(null);
  const pulseRef = useRef<THREE.Mesh>(null);

  // Tạo các điểm trên quả địa cầu (Fibonacci Sphere Lattice)
  const { pointsGeo, dakNongCoords } = useMemo(() => {
    const count = 950;
    const radius = 1.8;
    const positions = new Float32Array(count * 3);

    const phi = Math.PI * (Math.sqrt(5) - 1); // Golden ratio angle

    for (let i = 0; i < count; i++) {
      const y = 1 - (i / (count - 1)) * 2; // Y từ 1 đến -1
      const r = Math.sqrt(1 - y * y); // Bán kính tại y
      const theta = phi * i;

      const x = Math.cos(theta) * r;
      const z = Math.sin(theta) * r;

      positions[i * 3] = x * radius;
      positions[i * 3 + 1] = y * radius;
      positions[i * 3 + 2] = z * radius;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    // Tọa độ Gia Nghĩa, Đắk Nông: 11.99° N, 107.69° E
    const lat = 11.99 * (Math.PI / 180);
    const lon = 107.69 * (Math.PI / 180);

    const gx = radius * Math.cos(lat) * Math.sin(lon);
    const gy = radius * Math.sin(lat);
    const gz = radius * Math.cos(lat) * Math.cos(lon);

    return {
      pointsGeo: geo,
      dakNongCoords: new THREE.Vector3(gx, gy, gz),
    };
  }, []);

  useFrame((_, delta) => {
    if (!globeRef.current) return;

    // Xoay nhẹ nhàng
    globeRef.current.rotation.y += delta * 0.15;
    globeRef.current.rotation.x = Math.sin(Date.now() * 0.0005) * 0.1 + 0.15;

    // Hiệu ứng nhịp đập (pulse) cho điểm Gia Nghĩa
    if (pulseRef.current) {
      const scale = 1 + Math.sin(Date.now() * 0.004) * 0.4;
      pulseRef.current.scale.set(scale, scale, scale);
    }

    // Nội suy vị trí & scale dựa theo trạng thái active
    const targetScale = active ? 1.0 : 0.001;
    const targetPos = active ? new THREE.Vector3(1.2, -0.1, 0) : new THREE.Vector3(2.5, 0, -2);

    globeRef.current.position.lerp(targetPos, delta * 3);
    globeRef.current.scale.lerp(
      new THREE.Vector3(targetScale, targetScale, targetScale),
      delta * 3
    );
  });

  return (
    <group ref={globeRef}>
      {/* Lưới điểm địa cầu */}
      <points geometry={pointsGeo}>
        <pointsMaterial
          color="#C88A4B"
          size={0.035}
          transparent
          opacity={0.7}
          sizeAttenuation
        />
      </points>

      {/* Vòng kinh tuyến mờ */}
      <mesh>
        <sphereGeometry args={[1.78, 16, 16]} />
        <meshBasicMaterial color="#2D4A3E" wireframe transparent opacity={0.12} />
      </mesh>

      {/* TỌA ĐỘ ĐẶC BIỆT: GIA NGHĨA, ĐẮK NÔNG */}
      <group position={dakNongCoords}>
        {/* Đốm sáng tâm */}
        <mesh ref={beaconRef}>
          <sphereGeometry args={[0.07, 16, 16]} />
          <meshBasicMaterial color="#FFDD80" />
        </mesh>

        {/* Vòng hào quang phát sáng nhấp nháy */}
        <mesh ref={pulseRef}>
          <ringGeometry args={[0.08, 0.16, 24]} />
          <meshBasicMaterial color="#C88A4B" transparent opacity={0.8} side={THREE.DoubleSide} />
        </mesh>

        {/* Tia sáng nhỏ định vị */}
        <pointLight color="#FFDD80" intensity={1.5} distance={1.2} />
      </group>
    </group>
  );
}

// ==========================================
// 3. QUẢN LÝ SCENE TỔNG THỂ (SCENE CONTROLLER)
// ==========================================
export default function SceneController() {
  const pathname = usePathname() || "/";
  const { camera } = useThree();

  // Đảm bảo camera có góc nhìn hoàn hảo
  useEffect(() => {
    camera.position.set(0, 0, 5);
    camera.lookAt(0, 0, 0);
  }, [camera]);

  const isContact = pathname === "/contact";

  return (
    <>
      <ambientLight intensity={0.8} />
      <directionalLight position={[5, 8, 5]} intensity={1.2} color="#FDFBF7" />
      <pointLight position={[-4, -3, 2]} intensity={0.6} color="#C88A4B" />

      {/* Khối đa diện hữu cơ cho Home, About, Space, Menu */}
      <OrganicWireframe pathname={pathname} />

      {/* Quả địa cầu 3D tương tác định vị Gia Nghĩa cho Contact */}
      <InteractiveDotGlobe active={isContact} />
    </>
  );
}
