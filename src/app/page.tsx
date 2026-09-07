"use client";

import React, { useRef, useEffect, useState, Suspense, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sparkles } from "@react-three/drei";
import { motion, useScroll, useMotionValueEvent, useTransform, AnimatePresence } from "framer-motion";
import * as THREE from "three";
import Link from "next/link";
import {
  Coffee,
  ArrowRight,
  MapPin,
  Compass,
  Sparkles as SparkleIcon,
  Phone,
  Clock,
  Eye,
  X,
  ExternalLink,
  ChevronRight,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

/**
 * Hook phát hiện màn hình di động (< 768px)
 */
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return isMobile;
}

/**
 * =======================================================================
 * KHỐI MEGAMINX 3D WIREFRAME HOÀNG KIM (PERSISTENT 3D BACKGROUND)
 * =======================================================================
 * - Khung viền 30 cạnh chính của khối Dodecahedron bằng LineSegments ánh vàng #E5C07B.
 * - 180 đường rãnh chia mảnh ghép Megaminx (ngũ giác tâm + rãnh góc/cạnh) bằng LineSegments #D4AF37.
 * - Lớp pha lê bên trong với độ truyền dẫn quang học transmission 0.96 và opacity siêu mờ (0.05) tạo chiều sâu 3D.
 * - 2 vòng quỹ đạo hồi chuyển hoàng kim tự xoay quanh trục.
 * - Phóng to mượt mà liên tục từ 1x (Hero) đến 7.5x (Chân trang) theo toàn bộ chiều dài trang.
 * - Liên tục xoay nhẹ nhàng trên cả 3 trục (X, Y, Z).
 */
function MegaminxDodecahedron({
  scrollProgressRef,
  isMobile,
}: {
  scrollProgressRef: React.RefObject<number>;
  isMobile: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);

  const currentScaleRef = useRef(1);
  const currentZRef = useRef(0);
  const currentOpacityRef = useRef(1);
  const [megaminxOpacity, setMegaminxOpacity] = useState(1);

  // Kích thước khối theo kích thước màn hình
  const R = isMobile ? 1.15 : 1.35;
  const baseScale = isMobile ? 0.92 : 1.18;

  // Tính toán hình học khối Megaminx 12 mặt ngũ giác
  const { coreGeo, outerEdgesGeo, grooveGeo } = useMemo(() => {
    const dodec = new THREE.DodecahedronGeometry(R, 0);
    const outerEdges = new THREE.EdgesGeometry(dodec, 15);
    const pos = dodec.attributes.position;

    // Phân nhóm 36 tam giác thành 12 mặt ngũ giác đều
    const faces: { normal: THREE.Vector3; vertices: THREE.Vector3[] }[] = [];
    for (let i = 0; i < pos.count; i += 3) {
      const a = new THREE.Vector3().fromBufferAttribute(pos, i);
      const b = new THREE.Vector3().fromBufferAttribute(pos, i + 1);
      const c = new THREE.Vector3().fromBufferAttribute(pos, i + 2);
      const normal = new THREE.Vector3().crossVectors(b.clone().sub(a), c.clone().sub(a)).normalize();
      let found = faces.find((f) => f.normal.dot(normal) > 0.99);
      if (!found) {
        found = { normal, vertices: [] };
        faces.push(found);
      }
      found.vertices.push(a, b, c);
    }

    const lerp2 = (a: [number, number], b: [number, number], t: number): [number, number] => [
      a[0] + (b[0] - a[0]) * t,
      a[1] + (b[1] - a[1]) * t,
    ];

    const grooveLines: number[] = [];

    faces.forEach((f) => {
      // Lọc 5 đỉnh duy nhất của mặt ngũ giác
      const unique: THREE.Vector3[] = [];
      f.vertices.forEach((v) => {
        if (!unique.some((u) => u.distanceTo(v) < 0.001)) unique.push(v);
      });

      const center = new THREE.Vector3();
      unique.forEach((v) => center.add(v));
      center.divideScalar(unique.length);

      // Hệ trục tọa độ cục bộ (u, v) trên mặt ngũ giác
      const u = unique[0].clone().sub(center).normalize();
      const v = new THREE.Vector3().crossVectors(f.normal, u).normalize();

      // Sắp xếp 5 đỉnh theo chiều kim đồng hồ
      unique.sort((p1, p2) => {
        const d1 = p1.clone().sub(center);
        const d2 = p2.clone().sub(center);
        const a1 = Math.atan2(d1.dot(v), d1.dot(u));
        const a2 = Math.atan2(d2.dot(v), d2.dot(u));
        return a1 - a2;
      });

      const radius = center.distanceTo(unique[0]);

      // Tọa độ 2D của 5 đỉnh ngoài
      const P: [number, number][] = unique.map((pt) => {
        const d = pt.clone().sub(center);
        return [d.dot(u), d.dot(v)];
      });

      // Bán kính tâm ngũ giác (Center Piece)
      const rC = 0.38 * radius;
      const C: [number, number][] = [];
      for (let k = 0; k < 5; k++) {
        const a = (k * 2 * Math.PI) / 5 + Math.atan2(P[0][1], P[0][0]);
        C.push([rC * Math.cos(a), rC * Math.sin(a)]);
      }

      // Tỷ lệ rãnh cắt cạnh
      const edgeT = 0.34;

      const to3D = (pt2: [number, number]) => {
        return center
          .clone()
          .add(u.clone().multiplyScalar(pt2[0]))
          .add(v.clone().multiplyScalar(pt2[1]))
          .add(f.normal.clone().multiplyScalar(0.003));
      };

      // 1. Viền ngũ giác tâm
      for (let k = 0; k < 5; k++) {
        const p1 = to3D(C[k]);
        const p2 = to3D(C[(k + 1) % 5]);
        grooveLines.push(p1.x, p1.y, p1.z, p2.x, p2.y, p2.z);
      }

      // 2. Các rãnh cắt chia góc và cạnh tỏa từ tâm ngũ giác ra viền ngoài
      for (let k = 0; k < 5; k++) {
        const leftCut = lerp2(P[k], P[(k + 4) % 5], edgeT);
        const rightCut = lerp2(P[k], P[(k + 1) % 5], edgeT);
        const pCenter = to3D(C[k]);
        const pLeft = to3D(leftCut);
        const pRight = to3D(rightCut);

        grooveLines.push(pCenter.x, pCenter.y, pCenter.z, pLeft.x, pLeft.y, pLeft.z);
        grooveLines.push(pCenter.x, pCenter.y, pCenter.z, pRight.x, pRight.y, pRight.z);
      }
    });

    const groove = new THREE.BufferGeometry();
    groove.setAttribute("position", new THREE.Float32BufferAttribute(grooveLines, 3));

    return {
      coreGeo: dodec,
      outerEdgesGeo: outerEdges,
      grooveGeo: groove,
    };
  }, [R]);

  useFrame((state, delta) => {
    const rawOffset = scrollProgressRef.current ?? 0;
    // p chạy mượt mà từ 0 ở đỉnh trang đến 1 ở chân trang (Full Page Scroll Progress)
    const p = Math.min(Math.max(rawOffset, 0), 1);

    // Zoom từ 1x lên 7.5x suốt toàn bộ trang
    const targetScale = baseScale * (1.0 + Math.pow(p, 0.92) * 6.5);
    const targetZ = p * 0.8;
    const targetOpacity = 1.0;

    currentScaleRef.current = THREE.MathUtils.damp(currentScaleRef.current, targetScale, 4.0, delta);
    currentZRef.current = THREE.MathUtils.damp(currentZRef.current, targetZ, 4.0, delta);
    currentOpacityRef.current = THREE.MathUtils.damp(currentOpacityRef.current, targetOpacity, 4.0, delta);

    const op = currentOpacityRef.current;
    setMegaminxOpacity(op);

    if (groupRef.current) {
      groupRef.current.visible = op > 0.005;
      groupRef.current.scale.setScalar(currentScaleRef.current);

      // Dao động lơ lửng tự nhiên
      const floatY = Math.sin(state.clock.elapsedTime * 1.5) * 0.08;
      const mouseParallaxX = state.pointer.x * (isMobile ? 0.08 : 0.18);
      const mouseParallaxY = -state.pointer.y * (isMobile ? 0.05 : 0.12);

      groupRef.current.position.set(mouseParallaxX, floatY + mouseParallaxY, currentZRef.current);

      // Xoay nhẹ nhàng liên tục trên cả 3 trục khi lướt qua từng phân đoạn nội dung
      groupRef.current.rotation.y += delta * 0.22;
      groupRef.current.rotation.x += delta * 0.14;
      groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.12 + p * 2.2;
    }

    if (ring1Ref.current) {
      ring1Ref.current.rotation.z += delta * 0.42;
      ring1Ref.current.rotation.x += delta * 0.15;
    }

    if (ring2Ref.current) {
      ring2Ref.current.rotation.y -= delta * 0.35;
      ring2Ref.current.rotation.z += delta * 0.22;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* 1. Lớp pha lê Dodecahedron trong suốt cực cao (Glass Depth Effect: 0.05 opacity) */}
      <mesh geometry={coreGeo}>
        <meshPhysicalMaterial
          color="#C5A880"
          roughness={0.08}
          metalness={0.1}
          transmission={0.96}
          ior={1.4}
          transparent
          opacity={megaminxOpacity * 0.05}
          depthWrite={false}
        />
      </mesh>

      {/* 2. Đường viền khung 30 cạnh chính của khối Dodecahedron (Gold Wireframe Edges) */}
      <lineSegments geometry={outerEdgesGeo}>
        <lineBasicMaterial
          color="#E5C07B"
          transparent
          opacity={megaminxOpacity * 0.95}
          depthWrite={false}
        />
      </lineSegments>

      {/* 3. Các đường rãnh chia mảnh ghép Megaminx (180 đoạn rãnh: ngũ giác tâm + các góc/cạnh) */}
      <lineSegments geometry={grooveGeo}>
        <lineBasicMaterial
          color="#D4AF37"
          transparent
          opacity={megaminxOpacity * 0.82}
          depthWrite={false}
        />
      </lineSegments>

      {/* 4. Nguồn sáng tỏa từ tâm khối Megaminx */}
      <pointLight color="#FFE5B4" intensity={megaminxOpacity * 2.8} distance={8} />
      <pointLight color="#D4AF37" intensity={megaminxOpacity * 1.5} distance={5} />

      {/* 5. Vòng quỹ đạo hoàng kim lơ lửng xung quanh */}
      <mesh ref={ring1Ref} rotation={[Math.PI / 3, 0, 0]}>
        <torusGeometry args={[isMobile ? 1.55 : 1.82, 0.012, 16, 64]} />
        <meshStandardMaterial
          color="#D4AF37"
          emissive="#D4AF37"
          emissiveIntensity={0.5}
          metalness={0.9}
          roughness={0.1}
          transparent
          opacity={megaminxOpacity * 0.45}
        />
      </mesh>

      <mesh ref={ring2Ref} rotation={[-Math.PI / 4, Math.PI / 3, 0]}>
        <torusGeometry args={[isMobile ? 1.72 : 2.02, 0.009, 16, 64]} />
        <meshStandardMaterial
          color="#FFE1B3"
          emissive="#FFE1B3"
          emissiveIntensity={0.4}
          metalness={0.9}
          roughness={0.1}
          transparent
          opacity={megaminxOpacity * 0.35}
        />
      </mesh>

      {/* 6. Hạt bụi sáng quanh khối Megaminx */}
      <Sparkles
        count={isMobile ? 25 : 60}
        scale={[3.5, 3.5, 3.5]}
        size={isMobile ? 2.5 : 1.8}
        color="#FFE1B3"
        speed={0.4}
        opacity={megaminxOpacity * 0.7}
      />
    </group>
  );
}

/**
 * ĐIỀU PHỐI CAMERA QUANH KHỐI 3D MEGAMINX
 */
function FlightCameraRig({
  scrollProgressRef,
  isMobile,
}: {
  scrollProgressRef: React.RefObject<number>;
  isMobile: boolean;
}) {
  useFrame((state, delta) => {
    const rawOffset = scrollProgressRef.current ?? 0;
    const offset = Math.min(Math.max(rawOffset, 0), 1);

    // Mouse Parallax 3D
    const mouseX = state.pointer.x;
    const mouseY = state.pointer.y;
    const parallaxFactor = isMobile ? 0.4 : 1.0;
    const parallaxX = mouseX * 0.35 * parallaxFactor;
    const parallaxY = mouseY * 0.22 * parallaxFactor;
    const parallaxRotY = -mouseX * 0.05 * parallaxFactor;
    const parallaxRotX = mouseY * 0.03 * parallaxFactor;

    // Lùi camera thêm trên Mobile để góc nhìn thoáng đãng
    const zOffset = isMobile ? 2.2 : 0;

    // Camera giữ vị trí ổn định phía trước khối Megaminx, kết hợp zoom nhẹ nhàng theo scroll
    const targetX = isMobile ? 0 : -0.25 * Math.sin(offset * Math.PI);
    const targetY = isMobile ? 0 : 0.12 * Math.sin(offset * Math.PI);
    const targetZ = 5.0 - offset * 1.5 + zOffset;

    // Damping mượt mà chuyển động camera
    state.camera.position.x = THREE.MathUtils.damp(state.camera.position.x, targetX + parallaxX, 4, delta);
    state.camera.position.y = THREE.MathUtils.damp(state.camera.position.y, targetY + parallaxY, 4, delta);
    state.camera.position.z = THREE.MathUtils.damp(state.camera.position.z, targetZ, 4, delta);

    state.camera.rotation.y = THREE.MathUtils.damp(state.camera.rotation.y, parallaxRotY, 4, delta);
    state.camera.rotation.x = THREE.MathUtils.damp(state.camera.rotation.x, parallaxRotX, 4, delta);
  });

  return null;
}

/**
 * Ánh sáng & Bụi nắng điện ảnh (Cinematic Ambience)
 */
function CinematicAmbience({ isMobile }: { isMobile: boolean }) {
  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight position={[5, 8, 5]} intensity={1.15} color="#FCE7D0" />

      {/* Tia nắng xiên qua tán cây */}
      <spotLight
        position={[-6, 8, 3]}
        angle={0.42}
        penumbra={1}
        intensity={2.8}
        color="#FFE5B4"
      />
      <pointLight position={[0, 2, 2]} intensity={1.5} color="#C5A880" distance={16} />

      {/* Bụi nắng vàng thích ứng */}
      <Sparkles
        count={isMobile ? 50 : 260}
        scale={[22, 24, 45]}
        size={isMobile ? 2.2 : 1.6}
        color="#FFE1B3"
        speed={0.2}
        opacity={0.6}
      />
      <Sparkles
        count={isMobile ? 25 : 120}
        scale={[15, 16, 35]}
        size={isMobile ? 2.8 : 2.0}
        color="#C5A880"
        speed={0.3}
        opacity={0.45}
      />
    </>
  );
}

/**
 * Toàn bộ Thế giới 3D WebGL Nền
 */
function Unified3DWorld({
  scrollProgressRef,
  isMobile,
}: {
  scrollProgressRef: React.RefObject<number>;
  isMobile: boolean;
}) {
  return (
    <>
      <FlightCameraRig scrollProgressRef={scrollProgressRef} isMobile={isMobile} />
      <CinematicAmbience isMobile={isMobile} />
      <MegaminxDodecahedron scrollProgressRef={scrollProgressRef} isMobile={isMobile} />
    </>
  );
}

/**
 * =======================================================================
 * DỮ LIỆU ĐẶC SẢN QUÁN & BỘ SƯU TẬP ẢNH
 * =======================================================================
 */
interface SignatureDish {
  name: string;
  nameEn: string;
  price: string;
  desc: string;
  descEn: string;
  image: string;
  tag: string;
  tagEn: string;
}

const SIGNATURE_DISHES: SignatureDish[] = [
  {
    name: "Cà phê kem trứng",
    nameEn: "Specialty Egg Cream Coffee",
    price: "30.000đ",
    desc: "Lớp kem trứng đánh bông béo ngậy sánh mịn phủ lên cốt cà phê Robusta Đắk Nông rang củi đậm đà.",
    descEn: "Rich whipped egg custard poured over intense firewood-roasted Dak Nong Robusta.",
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=800&auto=format&fit=crop",
    tag: "Chữ ký nhà Cẩm Cù",
    tagEn: "Cam Cu Signature",
  },
  {
    name: "Cà phê muối",
    nameEn: "Salted Cream Coffee",
    price: "28.000đ",
    desc: "Vị muối biển dịu nhẹ hòa quyện cùng cốt dừa và sữa đặc, tôn vinh hậu vị sâu của cà phê mộc.",
    descEn: "Subtle sea salt cream blended with condensed milk, enhancing the coffee's deep finish.",
    image: "https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=800&auto=format&fit=crop",
    tag: "Được yêu thích nhất",
    tagEn: "Most Loved",
  },
  {
    name: "Trà đào cam sả",
    nameEn: "Peach Orange Lemongrass Tea",
    price: "30.000đ",
    desc: "Hương sả thảo mộc vườn nhà kết hợp vị cam mọng nước và miếng đào giòn ngọt thanh mát.",
    descEn: "Garden-grown fresh lemongrass with juicy sun-ripened orange and crispy sweet peach.",
    image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?q=80&w=800&auto=format&fit=crop",
    tag: "Thanh mát giải nhiệt",
    tagEn: "Refreshing Tonic",
  },
  {
    name: "Sinh tố Bơ sầu riêng",
    nameEn: "Avocado Durian Smoothie",
    price: "33.000đ",
    desc: "Sự kết hợp hoàng gia giữa bơ sáp Đắk Nông béo dẻo và cơm sầu riêng Ri6 thơm nồng nàn.",
    descEn: "Royal blend of Dak Nong butter avocado and aromatic Ri6 durian pulp.",
    image: "https://images.unsplash.com/photo-1553530666-ba11a7da3888?q=80&w=800&auto=format&fit=crop",
    tag: "Đặc sản cao nguyên",
    tagEn: "Highland Specialty",
  },
];

interface GalleryItem {
  id: string;
  url: string;
  captionVi: string;
  captionEn: string;
  spanClass?: string;
}

const SANCTUARY_GALLERY: GalleryItem[] = [
  {
    id: "g1",
    url: "/uploads/gallery/1788269970861-16527830.jpg",
    captionVi: "Không gian vườn sinh thái Cẩm Cù",
    captionEn: "Botanical Garden Sanctuary",
    spanClass: "md:col-span-2 md:row-span-2 min-h-[340px] md:min-h-[460px]",
  },
  {
    id: "g2",
    url: "/uploads/gallery/1788250253554-875120458.jpg",
    captionVi: "Hiên nhà đón nắng mai",
    captionEn: "Morning Sunlit Veranda",
    spanClass: "min-h-[220px]",
  },
  {
    id: "g3",
    url: "/uploads/gallery/1788250253557-29323827.jpg",
    captionVi: "Góc cà phê mộc mạc bên suối",
    captionEn: "Rustic Riverside Nook",
    spanClass: "min-h-[220px]",
  },
  {
    id: "g4",
    url: "/uploads/gallery/1788250253560-200373033.jpg",
    captionVi: "Bàn gỗ bên tán cây râm mát",
    captionEn: "Timber Tables Beneath Foliage",
    spanClass: "min-h-[220px]",
  },
  {
    id: "g5",
    url: "/uploads/gallery/1788250253562-580915883.jpg",
    captionVi: "Dòng suối cuội thanh bình",
    captionEn: "Pebble Stream Currents",
    spanClass: "min-h-[220px]",
  },
  {
    id: "g6",
    url: "/uploads/gallery/1788250253564-115851131.jpg",
    captionVi: "Hoàng hôn buông xuống thung lũng",
    captionEn: "Valley Twilight Horizon",
    spanClass: "md:col-span-2 min-h-[260px]",
  },
];

/**
 * =======================================================================
 * TRANG CHỦ CHÍNH (PREMIUM BOTANICAL 3D SANCTUARY)
 * =======================================================================
 */
export default function HomePage() {
  const { lang, t, formatPrice } = useLanguage();
  const [isMounted, setIsMounted] = useState(false);
  const isMobile = useIsMobile();
  const scrollProgressRef = useRef<number>(0);
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryItem | null>(null);

  const { scrollYProgress } = useScroll();

  // Nền ảnh không gian mờ dần điện ảnh khi cuộn từ 0 -> 0.35
  const heroBgOpacity = useTransform(scrollYProgress, [0, 0.35], [1, 0.15]);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    scrollProgressRef.current = Math.min(Math.max(latest, 0), 1);
  });

  useEffect(() => {
    setIsMounted(true);
    if (typeof window !== "undefined") {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (maxScroll > 0) {
        scrollProgressRef.current = Math.min(Math.max(window.scrollY / maxScroll, 0), 1);
      }
    }
  }, []);

  // Lắng nghe phím Escape để đóng Modal ảnh phóng to
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedPhoto(null);
    };
    if (selectedPhoto) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [selectedPhoto]);

  return (
    <div className="relative w-full max-w-[100vw] bg-[#1A0F0A] text-[#F3E8DB] select-none font-sans overflow-x-hidden">
      {/* ========================================================= */}
      {/* 1. NỀN ẢNH NỘI THẤT CẨM CÙ HOUSE (LAYER -Z-10)            */}
      {/* ========================================================= */}
      <motion.div
        className="fixed inset-0 w-full h-full pointer-events-none -z-10 overflow-hidden"
        style={{
          opacity: heroBgOpacity,
        }}
      >
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center"
          style={{
            backgroundImage: `url('/images/hero-interior.jpg')`,
          }}
        />
        {/* Lớp phủ điện ảnh làm nổi bật khối Megaminx 3D */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#1A0F0A]/90 via-[#1A0F0A]/50 to-[#1A0F0A]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,#1A0F0A_95%)] opacity-85" />
      </motion.div>

      {/* ========================================================= */}
      {/* 2. 3D CANVAS CỐ ĐỊNH TOÀN MÀN HÌNH (LAYER Z-0)            */}
      {/* ========================================================= */}
      <div className="fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden">
        {isMounted && (
          <Canvas
            className="w-full h-full pointer-events-none"
            camera={{ position: [0, 0, isMobile ? 8 : 5], fov: 60 }}
            dpr={isMobile ? [1, 1.1] : [1, 1.5]}
            gl={{
              powerPreference: isMobile ? "default" : "high-performance",
              antialias: false,
              alpha: true,
            }}
          >
            <fog attach="fog" args={["#1A0F0A", 15, 60]} />

            <Suspense fallback={null}>
              <Unified3DWorld scrollProgressRef={scrollProgressRef} isMobile={isMobile} />
            </Suspense>
          </Canvas>
        )}
      </div>

      {/* ========================================================= */}
      {/* 3. LỚP NỘI DUNG VĂN BẢN VÀ CÁC SECTION GLASSMORPHISM (Z-10)*/}
      {/* ========================================================= */}
      <div className="relative z-10 w-full overflow-x-hidden">
        
        {/* --------------------------------------------------------- */}
        {/* HERO SECTION (Đỉnh trang - 100vh)                         */}
        {/* --------------------------------------------------------- */}
        <section className="min-h-screen w-full flex flex-col justify-between items-center py-20 px-4 md:px-8 relative text-center pointer-events-none">
          {/* Badge thương hiệu đỉnh Hero */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="pointer-events-auto pt-2 sm:pt-4"
          >
            <span className="inline-flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs uppercase tracking-[0.22em] text-[#C5A880] px-4 sm:px-6 py-2 rounded-full font-mono bg-black/30 backdrop-blur-md border border-[#C5A880]/30 shadow-xl">
              <SparkleIcon size={12} className="text-[#C5A880] animate-pulse" />
              <span>ARTISAN COFFEE & BOTANICAL SANCTUARY</span>
              <SparkleIcon size={12} className="text-[#C5A880] animate-pulse" />
            </span>
          </motion.div>

          {/* Vùng không gian chính: Tiêu đề cực lớn & 2 Nút CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.15, ease: "easeOut" }}
            className="flex flex-col items-center my-auto py-8 max-w-4xl mx-auto"
          >
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-serif font-bold tracking-[0.14em] sm:tracking-[0.2em] uppercase text-[#F3E8DB] drop-shadow-[0_4px_35px_rgba(0,0,0,0.95)]">
              <span className="bg-gradient-to-r from-[#FFE1B3] via-[#F4EFEA] to-[#C5A880] bg-clip-text text-transparent">
                CẨM CÙ HOUSE
              </span>
            </h1>

            <p className="max-w-2xl mx-auto mt-4 sm:mt-6 text-xs sm:text-base md:text-lg font-serif italic text-[#F3E8DB]/90 leading-relaxed drop-shadow-md px-4">
              {t("home.subtitle")}
            </p>

            {/* Cụm 2 nút CTA ở giữa */}
            <div className="flex flex-wrap items-center justify-center gap-3.5 sm:gap-5 mt-7 sm:mt-9 pointer-events-auto">
              <Link
                href="/menu"
                className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl bg-gradient-to-r from-[#C5A880] to-[#DFBE93] hover:from-[#DFBE93] hover:to-[#FFE1B3] text-[#1A0F0A] font-semibold text-xs sm:text-sm uppercase tracking-wider transition-all duration-300 shadow-[0_0_25px_rgba(197,168,128,0.45)] hover:shadow-[0_0_35px_rgba(197,168,128,0.7)] hover:scale-105 active:scale-95 cursor-pointer font-sans"
              >
                <Coffee size={16} />
                <span>{lang === "en" ? "Explore Menu" : "Xem Thực Đơn"}</span>
              </Link>
              <Link
                href="/space"
                className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl border border-[#C5A880]/50 hover:border-[#C5A880] text-[#F3E8DB] hover:text-[#FFE1B3] font-medium text-xs sm:text-sm uppercase tracking-wider transition-all duration-300 bg-black/25 hover:bg-black/45 backdrop-blur-md cursor-pointer font-sans shadow-lg hover:scale-105 active:scale-95"
              >
                <span>{lang === "en" ? "Our Sanctuary" : "Khám Phá Không Gian"}</span>
                <ArrowRight size={15} />
              </Link>
            </div>
          </motion.div>

          {/* Scroll Indicator sát cạnh dưới */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="flex flex-col items-center gap-2 text-[#C5A880]/85 pointer-events-auto pb-4"
          >
            <span className="text-[9px] sm:text-[11px] font-mono uppercase tracking-[0.2em] drop-shadow">
              {lang === "en" ? "Scroll to explore 3D space" : "Cuộn để khám phá không gian 3D"}
            </span>
            <div className="w-5 h-8 rounded-full border border-[#C5A880]/60 flex items-start justify-center p-1 bg-black/30 backdrop-blur-sm shadow-md">
              <div className="w-1.5 h-2 rounded-full bg-[#C5A880] animate-bounce" />
            </div>
          </motion.div>
        </section>


        {/* --------------------------------------------------------- */}
        {/* SECTION 1: CHỐN BÌNH YÊN (Về chúng tôi)                    */}
        {/* --------------------------------------------------------- */}
        <section className="w-full max-w-7xl mx-auto py-24 md:py-32 px-4 sm:px-6 md:px-8 relative pointer-events-none">
          {/* Header Tiêu Đề */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto mb-14 sm:mb-20 pointer-events-auto"
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#C5A880]/30 bg-black/35 backdrop-blur-md text-[#C5A880] text-[10px] sm:text-xs font-mono uppercase tracking-[0.25em] mb-3 sm:mb-4">
              {t("home.sec2Tag")}
            </span>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-serif text-[#F3E8DB] tracking-wide leading-tight">
              {t("home.sec2Title")}{" "}
              <span className="italic font-light text-[#C5A880]">{t("home.sec2TitleHighlight")}</span>
            </h2>
          </motion.div>

          {/* Bố cục 2 cột trên Desktop, 1 cột trên Mobile */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center w-full">
            
            {/* Cột Trái: Câu chuyện & Thẻ Thông Tin Viền Mỏng */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.8 }}
              className="pointer-events-auto flex flex-col gap-5"
            >
              <div className="p-6 sm:p-8 rounded-2xl md:rounded-3xl bg-black/30 backdrop-blur-md border border-[#C5A880]/25 shadow-2xl">
                <p className="text-xs sm:text-base font-light text-[#F3E8DB]/90 leading-relaxed mb-4">
                  {t("home.sec2Desc1")}
                </p>
                <p className="text-xs sm:text-base font-light text-[#F3E8DB]/75 leading-relaxed">
                  {t("home.sec2Desc2")}
                </p>
              </div>

              {/* 3 Thẻ bài đặc điểm viền vàng mỏng */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <div className="p-4 rounded-xl bg-black/25 backdrop-blur-md border border-[#C5A880]/20 hover:border-[#C5A880]/50 transition-colors">
                  <div className="w-2 h-2 rounded-full bg-[#C5A880] mb-2" />
                  <h3 className="font-serif text-xs sm:text-sm text-[#F3E8DB] font-medium mb-1">
                    {lang === "en" ? "100% Wood Roast" : "Rang Củi Mộc"}
                  </h3>
                  <p className="text-[11px] text-[#F3E8DB]/65 leading-normal">
                    {lang === "en" ? "Pure volcanic soil Robusta" : "Robusta Đắk Nông nguyên bản"}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-black/25 backdrop-blur-md border border-[#C5A880]/20 hover:border-[#C5A880]/50 transition-colors">
                  <div className="w-2 h-2 rounded-full bg-[#FFE1B3] mb-2" />
                  <h3 className="font-serif text-xs sm:text-sm text-[#F3E8DB] font-medium mb-1">
                    {lang === "en" ? "Crystal Stream" : "Suối Đá Tự Nhiên"}
                  </h3>
                  <p className="text-[11px] text-[#F3E8DB]/65 leading-normal">
                    {lang === "en" ? "Flowing pebble brook" : "Bờ suối uốn lượn rợp bóng"}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-black/25 backdrop-blur-md border border-[#C5A880]/20 hover:border-[#C5A880]/50 transition-colors">
                  <div className="w-2 h-2 rounded-full bg-[#C5A880] mb-2" />
                  <h3 className="font-serif text-xs sm:text-sm text-[#F3E8DB] font-medium mb-1">
                    {lang === "en" ? "Serene Sanctuary" : "Chốn Chữa Lành"}
                  </h3>
                  <p className="text-[11px] text-[#F3E8DB]/65 leading-normal">
                    {lang === "en" ? "Quiet retreat in nature" : "Tĩnh lặng trọn vẹn sớm mai"}
                  </p>
                </div>
              </div>

              {/* Tọa độ & Nút Khám Phá */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  href="/space"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider text-[#C5A880] hover:text-[#1A0F0A] hover:bg-[#C5A880] font-semibold transition-all duration-300 border border-[#C5A880]/40 bg-black/30 backdrop-blur-md shadow-md"
                >
                  <span>{t("home.sec2Btn")}</span>
                  <ArrowRight size={13} />
                </Link>
                <div className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-[11px] font-mono text-[#C5A880]/85 border border-[#C5A880]/20 bg-black/25 backdrop-blur-md">
                  <Compass size={13} />
                  <span>11°58&apos;33&quot;N 107°42&apos;11&quot;E</span>
                </div>
              </div>
            </motion.div>

            {/* Cột Phải: Thẻ Ảnh Không Gian Quán Nghệ Thuật */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.8 }}
              className="pointer-events-auto relative group"
            >
              <div className="overflow-hidden rounded-2xl md:rounded-3xl border border-[#C5A880]/30 shadow-2xl bg-black/30 backdrop-blur-md p-2">
                <div className="overflow-hidden rounded-xl md:rounded-2xl relative aspect-[4/3]">
                  <img
                    src="/uploads/gallery/1788250253551-943009233.jpg"
                    alt="Bờ suối Cẩm Cù House"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1A0F0A]/90 via-transparent to-black/20" />
                  
                  {/* Floating Badges */}
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs">
                    <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-[#C5A880]/30 text-[#F3E8DB] font-serif">
                      {lang === "en" ? "Gia Nghia • Stream-side" : "Bên bờ suối đá thanh bình"}
                    </span>
                    <span className="font-mono text-[10px] text-[#C5A880] px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-[#C5A880]/20">
                      GIA NGHĨA • ĐẮK NÔNG
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

          </div>
        </section>


        {/* --------------------------------------------------------- */}
        {/* SECTION 2: THỰC ĐƠN TUYỂN CHỌN (Menu Highlights)           */}
        {/* --------------------------------------------------------- */}
        <section className="w-full max-w-7xl mx-auto py-24 md:py-32 px-4 sm:px-6 md:px-8 relative pointer-events-none">
          {/* Header Tiêu Đề */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto mb-14 sm:mb-20 pointer-events-auto"
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#C5A880]/30 bg-black/35 backdrop-blur-md text-[#C5A880] text-[10px] sm:text-xs font-mono uppercase tracking-[0.25em] mb-3 sm:mb-4">
              {lang === "en" ? "✦ HIGHLAND BOTANICAL BREWS ✦" : "✦ TINH HOA NÔNG SẢN TÂY NGUYÊN ✦"}
            </span>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-serif text-[#F3E8DB] tracking-wide leading-tight">
              {t("home.sec4Title")}
            </h2>
            <p className="mt-3 text-xs sm:text-sm text-[#F3E8DB]/75 font-light max-w-xl mx-auto">
              {lang === "en"
                ? "Handcrafted brews born from volcanic mineral soils and pure firewood roasting."
                : "Mỗi ly thức uống là sự kết tinh giữa hạt cà phê mộc rang củi Đắk Nông và thảo mộc thơm mát."}
            </p>
          </motion.div>

          {/* Lưới 4 Thẻ Món Ăn/Thức Uống Đặc Sắc (CSS Grid) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 w-full pointer-events-auto">
            {SIGNATURE_DISHES.map((dish, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="group flex flex-col justify-between rounded-2xl overflow-hidden bg-black/25 hover:bg-black/45 backdrop-blur-md border border-[#C5A880]/20 hover:border-[#C5A880]/60 transition-all duration-500 shadow-xl hover:shadow-[0_12px_35px_rgba(0,0,0,0.6)]"
              >
                <div>
                  {/* Ảnh Thức Uống với Zoom effect */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-black/40">
                    <img
                      src={dish.image}
                      alt={dish.name}
                      className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1A0F0A] via-transparent to-transparent opacity-80" />

                    {/* Tag Badge */}
                    <span className="absolute top-3 left-3 text-[9px] uppercase tracking-widest font-mono bg-black/70 backdrop-blur-md border border-[#C5A880]/40 text-[#FFE1B3] px-2.5 py-1 rounded-full shadow">
                      {lang === "en" ? dish.tagEn : dish.tag}
                    </span>
                  </div>

                  {/* Chi tiết Tên & Mô tả */}
                  <div className="p-5">
                    <div className="flex justify-between items-baseline mb-2 gap-2">
                      <h3 className="font-serif text-base sm:text-lg text-[#F3E8DB] group-hover:text-[#FFE1B3] transition-colors">
                        {lang === "en" ? dish.nameEn : dish.name}
                      </h3>
                      {/* Giá tiền tự động VND/USD theo Currency Context */}
                      <span className="font-mono text-xs sm:text-sm font-bold text-[#C5A880] px-2.5 py-0.5 rounded-lg bg-[#C5A880]/15 flex-shrink-0">
                        {formatPrice(dish.price)}
                      </span>
                    </div>
                    <p className="text-[11px] sm:text-xs text-[#F3E8DB]/75 font-light leading-relaxed">
                      {lang === "en" ? dish.descEn : dish.desc}
                    </p>
                  </div>
                </div>

                <div className="px-5 pb-5 pt-2">
                  <Link
                    href="/menu"
                    className="w-full inline-flex items-center justify-center gap-1.5 py-2 rounded-xl text-[11px] font-mono uppercase tracking-wider text-[#C5A880] hover:text-[#1A0F0A] hover:bg-[#C5A880] border border-[#C5A880]/30 transition-all duration-300"
                  >
                    <span>{lang === "en" ? "Order / View" : "Xem Chi Tiết"}</span>
                    <ChevronRight size={12} />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Nút Xem Toàn Bộ Thực Đơn */}
          <div className="text-center mt-12 sm:mt-16 pointer-events-auto">
            <Link
              href="/menu"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full text-xs uppercase tracking-widest text-[#FFE1B3] hover:text-[#1A0F0A] bg-black/40 hover:bg-[#C5A880] border border-[#C5A880]/40 transition-all duration-300 backdrop-blur-md shadow-lg"
            >
              <Coffee size={14} />
              <span>{t("home.sec4FullMenu")}</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </section>


        {/* --------------------------------------------------------- */}
        {/* SECTION 3: KHOẢNH KHẮC (Gallery / Masonry Showcase)        */}
        {/* --------------------------------------------------------- */}
        <section className="w-full max-w-7xl mx-auto py-24 md:py-32 px-4 sm:px-6 md:px-8 relative pointer-events-none">
          {/* Header Tiêu Đề */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto mb-14 sm:mb-20 pointer-events-auto"
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#C5A880]/30 bg-black/35 backdrop-blur-md text-[#C5A880] text-[10px] sm:text-xs font-mono uppercase tracking-[0.25em] mb-3 sm:mb-4">
              {t("home.sec3Badge")}
            </span>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-serif text-[#F3E8DB] tracking-wide leading-tight">
              {t("home.sec3Title")}{" "}
              <span className="italic font-light text-[#C5A880]">{t("home.sec3TitleHighlight")}</span>
            </h2>
            <p className="mt-3 text-xs sm:text-sm text-[#F3E8DB]/75 font-light max-w-xl mx-auto">
              {t("home.sec3Desc")}
            </p>
          </motion.div>

          {/* Lưới ảnh bất đối xứng (Masonry / Dynamic Grid) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 w-full pointer-events-auto">
            {SANCTUARY_GALLERY.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: idx * 0.08 }}
                onClick={() => setSelectedPhoto(item)}
                className={`group relative overflow-hidden rounded-2xl border border-[#C5A880]/25 hover:border-[#C5A880]/70 cursor-pointer shadow-xl transition-all duration-500 bg-black/30 backdrop-blur-sm ${item.spanClass || ""}`}
              >
                <img
                  src={item.url}
                  alt={lang === "en" ? item.captionEn : item.captionVi}
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                  loading="lazy"
                />
                
                {/* Lớp phủ mờ dần khi hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A0F0A]/95 via-[#1A0F0A]/30 to-transparent opacity-60 group-hover:opacity-85 transition-opacity duration-300" />

                {/* Chú thích & Nút phóng to */}
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 flex items-end justify-between">
                  <div>
                    <span className="text-[9px] uppercase tracking-widest font-mono text-[#C5A880] block mb-1">
                      CẨM CÙ SANCTUARY
                    </span>
                    <h3 className="font-serif text-sm sm:text-base text-[#F3E8DB] group-hover:text-[#FFE1B3] transition-colors">
                      {lang === "en" ? item.captionEn : item.captionVi}
                    </h3>
                  </div>

                  <div className="w-8 h-8 rounded-full bg-black/60 border border-[#C5A880]/40 flex items-center justify-center text-[#FFE1B3] group-hover:scale-110 group-hover:bg-[#C5A880] group-hover:text-[#1A0F0A] transition-all duration-300 shadow-md">
                    <Eye size={14} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Nút Xem Toàn Bộ Không Gian */}
          <div className="text-center mt-12 sm:mt-16 pointer-events-auto">
            <Link
              href="/space"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full text-xs uppercase tracking-widest text-[#FFE1B3] hover:text-[#1A0F0A] bg-black/40 hover:bg-[#C5A880] border border-[#C5A880]/40 transition-all duration-300 backdrop-blur-md shadow-lg"
            >
              <span>{lang === "en" ? "Explore Full Gallery" : "Khám Phá Toàn Bộ Góc Ảnh"}</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </section>


        {/* --------------------------------------------------------- */}
        {/* FOOTER (Chân trang tích hợp sang trọng & tối giản)         */}
        {/* --------------------------------------------------------- */}
        <footer className="w-full max-w-7xl mx-auto pt-16 pb-12 px-4 sm:px-6 md:px-8 relative pointer-events-none">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8 }}
            className="p-8 sm:p-12 rounded-3xl bg-black/35 backdrop-blur-md border border-[#C5A880]/20 shadow-2xl pointer-events-auto"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-14 pb-10 border-b border-[#C5A880]/15">
              
              {/* Cột 1: Thương Hiệu & Triết Lý */}
              <div className="space-y-4">
                <Link href="/" className="inline-block">
                  <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#F3E8DB] tracking-wider uppercase">
                    Cẩm Cù House
                  </h3>
                  <span className="text-[9px] font-mono tracking-[0.25em] text-[#C5A880] block mt-1">
                    ARTISAN COFFEE & BOTANICAL SANCTUARY
                  </span>
                </Link>

                <p className="text-xs sm:text-sm font-light text-[#F3E8DB]/75 leading-relaxed max-w-sm">
                  {lang === "en"
                    ? "A serene highland sanctuary cradled by gentle pebble streams and pure firewood-roasted coffee in Gia Nghia, Dak Nong."
                    : "Chốn dừng chân mộc mạc bên bờ suối đá và hương cà phê nguyên bản giữa lòng Gia Nghĩa, Đắk Nông."}
                </p>

                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 border border-[#C5A880]/25 text-[10px] font-mono text-[#C5A880]/90">
                  <Compass size={11} />
                  <span>11°58&apos;33&quot;N 107°42&apos;11&quot;E • ĐẮK NÔNG</span>
                </div>
              </div>

              {/* Cột 2: Thông Tin Ghé Thăm */}
              <div className="space-y-4">
                <h4 className="text-[#FFE1B3] font-serif text-sm uppercase tracking-widest font-semibold">
                  {lang === "en" ? "Visit Sanctuary" : "Thông Tin Ghé Thăm"}
                </h4>

                <div className="space-y-3 text-xs font-light text-[#F3E8DB]/85">
                  <div className="flex items-start gap-2.5">
                    <MapPin size={15} className="text-[#C5A880] flex-shrink-0 mt-0.5" />
                    <span>Hẻm 437 Hùng Vương, P. Nghĩa Trung, TP. Gia Nghĩa, Đắk Nông</span>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <Clock size={15} className="text-[#C5A880] flex-shrink-0" />
                    <span>07:00 - 22:00 ({lang === "en" ? "Every Day" : "Mỗi ngày"})</span>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <Phone size={15} className="text-[#C5A880] flex-shrink-0" />
                    <a href="tel:0382851688" className="hover:text-[#C5A880] transition-colors font-mono">
                      038 285 1688
                    </a>
                  </div>
                </div>
              </div>

              {/* Cột 3: Khám Phá & Mạng Xã Hội */}
              <div className="space-y-4">
                <h4 className="text-[#FFE1B3] font-serif text-sm uppercase tracking-widest font-semibold">
                  {lang === "en" ? "Explore & Connect" : "Khám Phá & Kết Nối"}
                </h4>

                <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs font-light text-[#F3E8DB]/75">
                  <Link href="/menu" className="hover:text-[#C5A880] transition-colors">{t("nav.menu")}</Link>
                  <Link href="/space" className="hover:text-[#C5A880] transition-colors">{t("nav.space")}</Link>
                  <Link href="/about" className="hover:text-[#C5A880] transition-colors">{t("nav.about")}</Link>
                  <Link href="/contact" className="hover:text-[#C5A880] transition-colors">{t("nav.contact")}</Link>
                </div>

                {/* Các nút mạng xã hội */}
                <div className="flex items-center gap-3 pt-2">
                  {/* Facebook */}
                  <a
                    href="https://www.facebook.com/share/1DVLMySW8H"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Facebook"
                    className="w-9 h-9 rounded-full bg-black/50 border border-[#C5A880]/30 flex items-center justify-center text-[#F3E8DB] hover:text-[#1A0F0A] hover:bg-[#C5A880] transition-all duration-300 shadow"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                      <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/>
                    </svg>
                  </a>

                  {/* YouTube */}
                  <a
                    href="https://youtube.com/@Cam_Cu_House"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="YouTube"
                    className="w-9 h-9 rounded-full bg-black/50 border border-[#C5A880]/30 flex items-center justify-center text-[#F3E8DB] hover:text-[#1A0F0A] hover:bg-[#C5A880] transition-all duration-300 shadow"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                      <path d="M21.582 6.186a2.67 2.67 0 0 0-1.884-1.888C17.962 3.8 12 3.8 12 3.8s-5.962 0-7.698.498a2.67 2.67 0 0 0-1.884 1.888C1.92 7.922 1.92 12 1.92 12s0 4.078.498 5.814a2.67 2.67 0 0 0 1.884 1.888C6.038 20.2 12 20.2 12 20.2s5.962 0 7.698-.498a2.67 2.67 0 0 0 1.884-1.888C22.08 16.078 22.08 12 22.08 12s0-4.078-.498-5.814zM9.9 15.3v-6.6l5.7 3.3-5.7 3.3z"/>
                    </svg>
                  </a>

                  {/* TikTok */}
                  <a
                    href="https://www.tiktok.com/@camcuhousedaknong"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="TikTok"
                    className="w-9 h-9 rounded-full bg-black/50 border border-[#C5A880]/30 flex items-center justify-center text-[#F3E8DB] hover:text-[#1A0F0A] hover:bg-[#C5A880] transition-all duration-300 shadow"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.12-3.44-3.17-3.64-5.46-.22-2.39.81-4.78 2.63-6.2 1.53-1.22 3.51-1.72 5.43-1.49v4.06c-1.16-.1-2.31.25-3.18 1.01-.76.63-1.23 1.59-1.25 2.58-.02 1.35.8 2.67 2.03 3.23 1.11.53 2.45.54 3.56.05 1.1-.48 1.89-1.44 2.11-2.61.12-.66.11-1.33.11-2.01V.02z"/>
                    </svg>
                  </a>

                  {/* Google Maps */}
                  <a
                    href="https://maps.google.com/?q=C%E1%BA%A9m+C%C3%B9+House+Gia+Ngh%C4%A9a+%C4%90%E1%BA%AFk+N%C3%B4ng"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Google Maps"
                    className="w-9 h-9 rounded-full bg-black/50 border border-[#C5A880]/30 flex items-center justify-center text-[#F3E8DB] hover:text-[#1A0F0A] hover:bg-[#C5A880] transition-all duration-300 shadow"
                  >
                    <ExternalLink size={15} />
                  </a>
                </div>
              </div>

            </div>

            {/* Dòng Bản Quyền Dưới Cùng */}
            <div className="pt-6 flex flex-wrap items-center justify-between gap-3 text-[10px] font-mono text-[#F3E8DB]/45">
              <span>© {new Date().getFullYear()} CẨM CÙ HOUSE. ALL RIGHTS RESERVED.</span>
              <span>PREMIUM BOTANICAL 3D SANCTUARY • GIA NGHĨA, ĐẮK NÔNG</span>
            </div>
          </motion.div>
        </footer>

      </div>

      {/* ========================================================= */}
      {/* 4. MODAL PHÓNG TO ẢNH GALLERY (LIGHTBOX MODAL)             */}
      {/* ========================================================= */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedPhoto(null)}
            className="fixed inset-0 z-[99999] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 sm:p-8 cursor-pointer"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl w-full max-h-[90vh] flex flex-col items-center cursor-default bg-black/50 border border-[#C5A880]/30 rounded-2xl overflow-hidden p-2 shadow-2xl"
            >
              <button
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/70 border border-[#C5A880]/40 text-[#FFE1B3] hover:bg-[#C5A880] hover:text-[#1A0F0A] flex items-center justify-center transition-all duration-200 cursor-pointer shadow-lg"
                aria-label="Đóng ảnh"
              >
                <X size={18} />
              </button>

              <div className="w-full max-h-[75vh] overflow-hidden rounded-xl">
                <img
                  src={selectedPhoto.url}
                  alt={lang === "en" ? selectedPhoto.captionEn : selectedPhoto.captionVi}
                  className="w-full h-full object-contain mx-auto"
                />
              </div>

              <div className="w-full p-4 text-center">
                <h3 className="font-serif text-lg sm:text-xl text-[#FFE1B3]">
                  {lang === "en" ? selectedPhoto.captionEn : selectedPhoto.captionVi}
                </h3>
                <span className="font-mono text-[10px] uppercase tracking-widest text-[#C5A880]">
                  CẨM CÙ HOUSE • GIA NGHĨA, ĐẮK NÔNG
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
