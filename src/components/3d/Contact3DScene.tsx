"use client";

import React, { useRef, useMemo, useState, useEffect, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Html, Float, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { Clock, Sun, Moon, Sparkles, Compass, RotateCw } from "lucide-react";

// Tọa độ Đắk Nông (Gia Nghĩa), Việt Nam:
// Lat: 11.98° N, Lon: 107.70° E
const DAK_NONG_COORDS = {
  lat: 11.98,
  lon: 107.70,
};

// Vị trí cố định của nguồn sáng Mặt Trời (DirectionalLight)
const SUN_POSITION: [number, number, number] = [6, 2.5, 4.5];
const SUN_ANGLE_XZ = Math.atan2(SUN_POSITION[2], SUN_POSITION[0]);

/**
 * Công thức quy đổi tọa độ cầu (Vĩ độ lat, Kinh độ lon) sang tọa độ Cartesian 3D (x, y, z):
 * phi = (90 - lat) * (Math.PI / 180)
 * theta = (lon + 180) * (Math.PI / 180)
 * x = -(radius * Math.sin(phi) * Math.cos(theta))
 * z = (radius * Math.sin(phi) * Math.sin(theta))
 * y = (radius * Math.cos(phi))
 */
export function latLonToVector3(
  lat: number,
  lon: number,
  radius: number
): [number, number, number] {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);

  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);

  return [x, y, z];
}

/**
 * Tính toán góc quay quanh trục Y (rotation.y) của Trái Đất dựa trên giờ UTC hiện tại.
 * Đảm bảo kinh tuyến đang là buổi trưa (solar noon) sẽ quay trực tiếp về phía nguồn sáng Mặt Trời,
 * trong khi bán cầu ban đêm sẽ chìm vào vùng tối.
 */
function getRealtimeEarthRotationY(): number {
  const now = new Date();
  const utcHours =
    now.getUTCHours() +
    now.getUTCMinutes() / 60 +
    now.getUTCSeconds() / 3600 +
    now.getUTCMilliseconds() / 3600000;

  // Kinh tuyến hạ nhật (subsolar longitude) tính theo radian
  // Tại 12:00 UTC, kinh tuyến 0° đối diện trực tiếp mặt trời
  const subsolarLonRad = (12 - utcHours) * (Math.PI / 12);

  // Góc quay Y sao cho subsolarLonRad hướng tới góc của SUN_POSITION
  return -SUN_ANGLE_XZ - subsolarLonRad;
}

/**
 * Điểm ghim định vị phát sáng (Pulsing glowing beacon) chính xác tại tọa độ Đắk Nông
 */
function DakNongBeacon({ radius }: { radius: number }) {
  const beaconRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const lightRef = useRef<THREE.PointLight>(null);

  const pos = useMemo(
    () => latLonToVector3(DAK_NONG_COORDS.lat, DAK_NONG_COORDS.lon, radius),
    [radius]
  );
  const normal = useMemo(() => new THREE.Vector3(...pos).normalize(), [pos]);

  // Cột tia sáng đứng (Vertical Light Beam) vươn ra khỏi bề mặt quả địa cầu
  const beamLine = useMemo(() => {
    const geom = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(normal.x * 0.65, normal.y * 0.65, normal.z * 0.65),
    ]);
    const mat = new THREE.LineBasicMaterial({
      color: "#FFE5B4",
      transparent: true,
      opacity: 0.9,
      linewidth: 2,
    });
    return new THREE.Line(geom, mat);
  }, [normal]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (ringRef.current) {
      const scale = 1 + (Math.sin(t * 3.5) + 1) * 0.55;
      ringRef.current.scale.set(scale, scale, scale);
      const mat = ringRef.current.material as THREE.MeshBasicMaterial;
      if (mat) {
        mat.opacity = 0.85 - (Math.sin(t * 3.5) + 1) * 0.38;
      }
    }
    if (lightRef.current) {
      lightRef.current.intensity = 1.8 + Math.sin(t * 4) * 0.9;
    }
  });

  return (
    <group ref={beaconRef} position={pos}>
      {/* Point light tỏa ánh sáng vàng kim tại vị trí Đắk Nông */}
      <pointLight ref={lightRef} color="#FFE5B4" distance={3.2} intensity={2.2} />

      {/* Core glowing dot màu vàng hoàng kim */}
      <mesh>
        <sphereGeometry args={[0.055, 16, 16]} />
        <meshBasicMaterial color="#FFF1D6" />
      </mesh>

      {/* Outer pulsing wave ring */}
      <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.075, 0.13, 32]} />
        <meshBasicMaterial
          color="#C5A880"
          transparent
          opacity={0.8}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Golden Vertical Light Beam */}
      <primitive object={beamLine} />

      {/* 3D Pin Billboard Info Tag */}
      <Html
        position={[normal.x * 0.72, normal.y * 0.72, normal.z * 0.72]}
        center
        sprite
        distanceFactor={6}
        zIndexRange={[100, 0]}
      >
        <div className="pointer-events-none select-none p-1.5 rounded-lg bg-[#1A0F0A]/95 backdrop-blur-md border-[0.5px] border-[#C5A880]/40 shadow-[0_0_12px_rgba(197,168,128,0.3)] whitespace-nowrap text-center max-w-fit scale-[0.6] origin-center">
          <div className="flex items-center justify-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C5A880] animate-ping" />
            <span className="font-serif text-[9px] font-semibold tracking-wider text-[#F4EFEA]">
              CẨM CÙ HOUSE
            </span>
          </div>
          <div className="text-[8px] font-mono text-[#C5A880] mt-0.5 tracking-tight opacity-85">
            11.98° N, 107.70° E
          </div>
          <div className="text-[7.5px] font-sans text-[#F4EFEA] uppercase tracking-widest mt-0.5 opacity-70">
            Gia Nghĩa • Đắk Nông, VN
          </div>
        </div>
      </Html>
    </group>
  );
}

/**
 * Khối cầu Trái Đất chi tiết cao (Photo-Realistic Earth)
 * Sử dụng bộ map texture 2K Three.js: Day map, Specular map (độ bóng biển), Normal map (địa hình)
 */
function RealisticEarthSphere({ radius = 2.4 }: { radius?: number }) {
  const [dayMap, normalMap, specularMap] = useTexture([
    "/textures/earth_atmos_2048.jpg",
    "/textures/earth_normal_2048.jpg",
    "/textures/earth_specular_2048.jpg",
  ]);

  useMemo(() => {
    dayMap.colorSpace = THREE.SRGBColorSpace;
    dayMap.anisotropy = 8;
  }, [dayMap]);

  return (
    <mesh castShadow receiveShadow>
      <sphereGeometry args={[radius, 64, 64]} />
      {/* MeshPhongMaterial mang lại độ phản quang chân thực cho biển đại dương từ specularMap */}
      <meshPhongMaterial
        map={dayMap}
        normalMap={normalMap}
        normalScale={new THREE.Vector2(0.85, 0.85)}
        specularMap={specularMap}
        specular={new THREE.Color("#68829E")}
        shininess={22}
      />
    </mesh>
  );
}

/**
 * Khối cầu lớp mây (Clouds Layer) bọc ngoài quả đất (bán kính 1.014)
 * Xoay độc lập chậm nhẹ để mô phỏng gió khí quyển tầng cao
 */
function CloudsLayer({ radius = 2.4 }: { radius?: number }) {
  const cloudsRef = useRef<THREE.Mesh>(null);
  const cloudsMap = useTexture("/textures/earth_clouds_2048.png");

  useMemo(() => {
    cloudsMap.colorSpace = THREE.SRGBColorSpace;
  }, [cloudsMap]);

  useFrame((_, delta) => {
    if (cloudsRef.current) {
      // Tự động xoay chậm nhẹ để mô phỏng gió khí quyển
      cloudsRef.current.rotation.y += delta * 0.015;
    }
  });

  return (
    <mesh ref={cloudsRef}>
      <sphereGeometry args={[radius * 1.014, 64, 64]} />
      <meshStandardMaterial
        map={cloudsMap}
        transparent
        opacity={0.42}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

/**
 * Lớp viền hào quang khí quyển (Atmosphere rim light) màu xanh lam nhạt quanh mép quả cầu
 */
function AtmosphereRimLight({ radius = 2.4 }: { radius?: number }) {
  return (
    <mesh>
      <sphereGeometry args={[radius * 1.026, 64, 64]} />
      <meshBasicMaterial
        color="#5FA8D3"
        transparent
        opacity={0.18}
        side={THREE.BackSide}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

/**
 * Toàn bộ tổ hợp Globe 3D Trái Đất (Vỏ địa cầu + Lớp mây + Khí quyển + Điểm ghim Đắk Nông)
 */
function GlobeMesh({ isAutoSpin }: { isAutoSpin: boolean }) {
  const globeGroupRef = useRef<THREE.Group>(null);
  const radius = 2.4;

  // Khởi tạo góc quay ban đầu chuẩn xác theo giờ UTC
  const initialRotationY = useMemo(() => getRealtimeEarthRotationY(), []);

  useFrame((_, delta) => {
    if (globeGroupRef.current) {
      if (isAutoSpin) {
        // Chế độ tự động xoay nhẹ để người dùng chiêm ngưỡng toàn bộ quả cầu
        globeGroupRef.current.rotation.y += delta * 0.06;
      } else {
        // Chế độ đồng bộ thời gian thực chuẩn UTC:
        // Cập nhật góc quay theo chu kỳ 24h thực tế
        const targetRotationY = getRealtimeEarthRotationY();
        // Lerp mượt mà tới vị trí chuẩn xác
        globeGroupRef.current.rotation.y = THREE.MathUtils.lerp(
          globeGroupRef.current.rotation.y,
          targetRotationY,
          0.05
        );
      }
    }
  });

  return (
    <Float speed={1.1} rotationIntensity={0.06} floatIntensity={0.15}>
      {/* Góc nghiêng trục tự nhiên của Trái Đất (~23.4° trên trục Z, nhẹ trên trục X) */}
      <group rotation={[0.12, 0, 0.38]}>
        <group ref={globeGroupRef} rotation={[0, initialRotationY, 0]}>
          {/* Quả cầu Trái Đất photo-realistic với 3 map texture */}
          <Suspense fallback={<GlobeFallbackSphere radius={radius} />}>
            <RealisticEarthSphere radius={radius} />
          </Suspense>

          {/* Khối cầu lớp mây bọc bên ngoài */}
          <Suspense fallback={null}>
            <CloudsLayer radius={radius} />
          </Suspense>

          {/* Lớp viền hào quang khí quyển xanh lam quanh mép quả cầu */}
          <AtmosphereRimLight radius={radius} />

          {/* Điểm ghim phát sáng tại tọa độ Đắk Nông */}
          <DakNongBeacon radius={radius} />
        </group>
      </group>
    </Float>
  );
}

/**
 * Fallback hiển thị trong quá trình tải texture
 */
function GlobeFallbackSphere({ radius = 2.4 }: { radius?: number }) {
  return (
    <group>
      <mesh>
        <sphereGeometry args={[radius, 32, 32]} />
        <meshStandardMaterial color="#16222F" roughness={0.7} />
      </mesh>
      <mesh>
        <sphereGeometry args={[radius * 1.006, 16, 16]} />
        <meshBasicMaterial color="#C5A880" wireframe transparent opacity={0.15} />
      </mesh>
    </group>
  );
}

/**
 * Bụi vàng vũ trụ bao quanh quả địa cầu
 */
function StarFieldParticles({ count = 200 }: { count?: number }) {
  const particles = useMemo(() => {
    const coords = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      coords[i * 3] = (Math.random() - 0.5) * 18;
      coords[i * 3 + 1] = (Math.random() - 0.5) * 18;
      coords[i * 3 + 2] = (Math.random() - 0.5) * 18;
    }
    return coords;
  }, [count]);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[particles, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#C5A880"
        size={0.032}
        transparent
        opacity={0.4}
        sizeAttenuation
      />
    </points>
  );
}

/**
 * Format thời gian Việt Nam (GMT+7): HH:mm:ss - DD/MM/YYYY
 */
function formatVietnamTime(date: Date) {
  const timeStr = date.toLocaleTimeString("vi-VN", {
    timeZone: "Asia/Ho_Chi_Minh",
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const dateStr = date.toLocaleDateString("en-GB", {
    timeZone: "Asia/Ho_Chi_Minh",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const hourInVn = parseInt(
    date.toLocaleTimeString("en-US", {
      timeZone: "Asia/Ho_Chi_Minh",
      hour: "numeric",
      hour12: false,
    }),
    10
  );

  const isDaytime = hourInVn >= 6 && hourInVn < 18;

  return {
    fullClock: `${timeStr} - ${dateStr}`,
    timeStr,
    dateStr,
    isDaytime,
  };
}

export default function Contact3DScene() {
  // Live Digital Clock GMT+7 State
  const [digitalTime, setDigitalTime] = useState<string>("");
  const [isDaytimeVN, setIsDaytimeVN] = useState<boolean>(true);
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [isAutoSpin, setIsAutoSpin] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
    const updateTime = () => {
      const formatted = formatVietnamTime(new Date());
      setDigitalTime(formatted.fullClock);
      setIsDaytimeVN(formatted.isDaytime);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-full min-h-[440px] lg:min-h-[580px] relative rounded-2xl overflow-hidden bg-[#100906] border border-[#C5A880]/30 shadow-2xl flex flex-col justify-between select-none">
      {/* TOP BAR: Live Digital Clock GMT+7 & Solar Status */}
      <div className="absolute top-3.5 left-3.5 right-3.5 z-20 flex flex-wrap items-center justify-between gap-2.5 pointer-events-none">
        {/* Live Clock Pill */}
        <div className="pointer-events-auto flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl bg-[#1A0F0A]/90 backdrop-blur-md border border-[#C5A880]/40 shadow-lg">
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[10px] font-sans uppercase font-bold tracking-widest text-[#C5A880]">
              LIVE GMT+7
            </span>
          </div>

          <div className="h-3 w-[1px] bg-[#C5A880]/30" />

          <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#F4EFEA] tracking-wider">
            <Clock size={13} className="text-[#C5A880]" />
            <span>{isMounted ? digitalTime : "--:--:-- - --/--/----"}</span>
          </div>
        </div>

        {/* Day / Night Status & Mode Toggle */}
        <div className="pointer-events-auto flex items-center gap-2">
          {/* Day / Night Indicator */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1A0F0A]/85 backdrop-blur-md border border-[#C5A880]/30 text-xs font-sans">
            {isDaytimeVN ? (
              <>
                <Sun size={13} className="text-amber-400 animate-spin-slow" />
                <span className="text-[#F4EFEA]/90 font-medium text-[11px]">
                  Đắk Nông: <strong className="text-amber-300">Ban ngày</strong>
                </span>
              </>
            ) : (
              <>
                <Moon size={13} className="text-sky-300" />
                <span className="text-[#F4EFEA]/90 font-medium text-[11px]">
                  Đắk Nông: <strong className="text-sky-200">Ban đêm</strong>
                </span>
              </>
            )}
          </div>

          {/* Realtime vs Auto-spin Toggle */}
          <button
            onClick={() => setIsAutoSpin(!isAutoSpin)}
            title={
              isAutoSpin
                ? "Chuyển về Đồng bộ giờ thực UTC"
                : "Chuyển sang Tự động xoay 360°"
            }
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-sans font-medium tracking-wider transition-all duration-300 cursor-pointer backdrop-blur-md border ${
              isAutoSpin
                ? "bg-[#C5A880] text-[#1A0F0A] border-[#C5A880] font-semibold shadow-md"
                : "bg-[#1A0F0A]/85 text-[#C5A880] border-[#C5A880]/35 hover:border-[#C5A880]"
            }`}
          >
            {isAutoSpin ? (
              <>
                <RotateCw size={12} className="animate-spin" />
                <span>Tự xoay</span>
              </>
            ) : (
              <>
                <Compass size={12} />
                <span>Giờ thực UTC</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 3D Canvas bọc trong Suspense */}
      <Suspense
        fallback={
          <div className="w-full h-full min-h-[440px] flex items-center justify-center bg-[#100906]">
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 border-2 border-[#C5A880]/30 border-t-[#C5A880] rounded-full animate-spin" />
              <p className="text-xs font-serif text-[#C5A880] tracking-widest">
                Đang khởi tạo Trái Đất 3D Chân Thực...
              </p>
            </div>
          </div>
        }
      >
        <Canvas
          camera={{ position: [0, 0, 6.5], fov: 45 }}
          gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
          style={{ width: "100%", height: "100%", position: "absolute", inset: 0 }}
        >
          {/* Ánh sáng Mặt Trời (DirectionalLight) tạo hiệu ứng ngày/đêm chân thực theo giờ UTC */}
          <ambientLight intensity={0.2} color="#152438" />
          <directionalLight
            position={SUN_POSITION}
            intensity={2.7}
            color="#FFFDF5"
            castShadow
          />
          {/* Ánh sáng phản xạ nhẹ từ các cụm sao vũ trụ ở vùng tối */}
          <pointLight position={[-8, -3, -6]} intensity={0.45} color="#2A4365" />

          {/* Quả cầu Trái Đất 3D */}
          <GlobeMesh isAutoSpin={isAutoSpin} />

          {/* Bụi vàng vũ trụ */}
          <StarFieldParticles count={200} />

          {/* OrbitControls: Thu phóng kiểu Google Earth & kéo chuột xoay 360° với damping siêu mượt */}
          <OrbitControls
            enableZoom={true}
            minDistance={3.2}
            maxDistance={12}
            enablePan={false}
            enableRotate={true}
            rotateSpeed={0.55}
            minPolarAngle={Math.PI * 0.15}
            maxPolarAngle={Math.PI * 0.85}
            enableDamping={true}
            dampingFactor={0.05}
          />
        </Canvas>
      </Suspense>

      {/* BOTTOM BAR: Thông tin tọa độ & Hướng dẫn tương tác */}
      <div className="absolute bottom-3.5 left-3.5 right-3.5 z-20 pointer-events-none flex flex-wrap items-center justify-between gap-2 px-4 py-2 rounded-xl bg-[#1A0F0A]/90 backdrop-blur-md border border-[#C5A880]/30 shadow-lg">
        <div className="flex items-center gap-2 text-xs font-mono text-[#C5A880]">
          <span className="w-2 h-2 rounded-full bg-[#C5A880] animate-pulse"></span>
          <span className="font-semibold tracking-wide">
            ĐẮK NÔNG: {DAK_NONG_COORDS.lat}°N, {DAK_NONG_COORDS.lon}°E
          </span>
          <span className="hidden sm:inline text-[#F4EFEA]/40">•</span>
          <span className="hidden sm:inline font-sans text-[11px] text-[#F4EFEA]/70">
            Cẩm Cù House Gia Nghĩa
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] font-sans text-[#F4EFEA]/70 tracking-wider">
          <Sparkles size={12} className="text-[#C5A880]" />
          <span>✦ Lăn chuột để Thu/Phóng • Kéo để Xoay 360°</span>
        </div>
      </div>
    </div>
  );
}
