'use client';

import { useEffect, useRef, useState } from 'react';
import './camcu-intro.css';

const SHOW_ONCE = true;
const STORAGE_KEY = 'cc_intro';

export default function CamcuIntro() {
  const [isVisible, setIsVisible] = useState(true);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const fxRef = useRef<{ stop: () => void } | null>(null);
  const exitingRef = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const el = containerRef.current;
    if (!el) return;
    const dom = el;

    const root = document.documentElement;
    const canvas = dom.querySelector('#particles-fx') as HTMLCanvasElement | null;
    const skipBtn = dom.querySelector('#skip-btn') as HTMLButtonElement | null;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Kiểm tra tham số URL ?intro=1 hoặc ?replay=1 để ép chạy lại
    const params = new URLSearchParams(window.location.search);
    const hasForceParam = params.has('intro') || params.has('replay');

    if (hasForceParam) {
      try {
        sessionStorage.removeItem(STORAGE_KEY);
      } catch (_) {}
    }

    const seen = (): boolean => {
      try {
        return sessionStorage.getItem(STORAGE_KEY) === '1';
      } catch (_) {
        return false;
      }
    };

    const markSeen = () => {
      try {
        sessionStorage.setItem(STORAGE_KEY, '1');
      } catch (_) {}
    };

    // Đã xem hoặc prefers-reduced-motion -> bỏ qua intro ngay lập tức
    if ((SHOW_ONCE && seen() && !hasForceParam) || reduce) {
      dom.style.display = 'none';
      root.classList.remove('intro-lock');
      document.body.classList.add('intro-go');
      markSeen();
      document.dispatchEvent(new CustomEvent('camcu:intro-done'));
      setIsVisible(false);
      return;
    }

    // ── 1. ĐOM ĐÓM & BỤI SƯƠNG ĐA TẦNG (Canvas Particle System) ────────────────
    function startParticles(cv: HTMLCanvasElement) {
      const ctx = cv.getContext('2d');
      if (!ctx) return { stop() {} };
      let w = 0,
        h = 0,
        dpr = 1;

      interface Particle {
        x: number;
        y: number;
        r: number;
        vx: number;
        vy: number;
        seed: number;
        isAmber: boolean;
        isBokeh: boolean;
      }

      let particles: Particle[] = [];
      let frameId: number;
      let running = true;

      const resize = () => {
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        w = cv.width = window.innerWidth * dpr;
        h = cv.height = window.innerHeight * dpr;
        const count = Math.min(65, Math.round(window.innerWidth / 22));
        particles = Array.from({ length: count }, (_, i) => ({
          x: Math.random() * w,
          y: Math.random() * h,
          r: (i % 7 === 0 ? 3.5 + Math.random() * 4.5 : 1.2 + Math.random() * 2.2) * dpr,
          vx: (Math.random() - 0.5) * 0.4 * dpr,
          vy: -(0.15 + Math.random() * 0.35) * dpr,
          seed: Math.random() * 6.28,
          isAmber: Math.random() > 0.4,
          isBokeh: i % 7 === 0,
        }));
      };

      resize();
      window.addEventListener('resize', resize);

      (function loop(time: number) {
        if (!running) return;
        ctx.clearRect(0, 0, w, h);
        ctx.globalCompositeOperation = 'lighter';

        for (const p of particles) {
          p.y += p.vy;
          p.x += Math.sin((time / 1800) + p.seed) * 0.3 * dpr;

          if (p.y < -30) p.y = h + 30;
          if (p.x < -30) p.x = w + 30;
          if (p.x > w + 30) p.x = -30;

          const pulse = p.isBokeh
            ? 0.15 + 0.1 * Math.sin((time / 1400) + p.seed)
            : 0.3 + 0.7 * Math.abs(Math.sin((time / 900) + p.seed));

          const gradR = p.isBokeh ? p.r * 3 : p.r * 6;
          const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, gradR);
          const rgb = p.isAmber ? '245, 185, 120' : '170, 225, 190';

          g.addColorStop(0, `rgba(${rgb}, ${pulse * (p.isBokeh ? 0.35 : 0.75)})`);
          g.addColorStop(0.5, `rgba(${rgb}, ${pulse * (p.isBokeh ? 0.12 : 0.2)})`);
          g.addColorStop(1, `rgba(${rgb}, 0)`);

          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(p.x, p.y, gradR, 0, 6.283);
          ctx.fill();
        }

        frameId = requestAnimationFrame(loop);
      })(0);

      return {
        stop() {
          running = false;
          cancelAnimationFrame(frameId);
          window.removeEventListener('resize', resize);
        },
      };
    }

    // ── 2. FINISH (Dọn dẹp và phát sự kiện) ────────────────────────────────────
    function finish() {
      markSeen();
      fxRef.current?.stop();
      dom.style.display = 'none';
      root.classList.remove('intro-lock');
      document.body.classList.add('intro-go');
      document.dispatchEvent(new CustomEvent('camcu:intro-done'));
      setIsVisible(false);
    }

    // ── 3. KHỞI CHẠY GSAP ĐIỆN ẢNH VÀ CAMERA ZOOM-THROUGH ────────────────────
    let cleanupGsap = () => {};

    async function initCinematicIntro() {
      exitingRef.current = false;
      dom.style.display = '';
      root.classList.add('intro-lock');
      document.body.classList.remove('intro-go');

      if (canvas) {
        fxRef.current = startParticles(canvas);
      }

      // Import động GSAP từ npm
      const gsapModule = await import('gsap');
      const gsap = gsapModule.default || gsapModule;

      const cameraWorld = dom.querySelector('.camera-world') as HTMLElement | null;
      const sunContainer = dom.querySelector('.sun-container') as HTMLElement | null;
      const brandLayer = dom.querySelector('.brand-layer') as HTMLElement | null;
      const brandTitle = dom.querySelector('.brand-title') as HTMLElement | null;
      const brandTagline = dom.querySelector('.brand-tagline') as HTMLElement | null;
      const mountainsBack = dom.querySelector('.mountains-back') as HTMLElement | null;
      const hillsMid = dom.querySelector('.hills-mid') as HTMLElement | null;
      const hillsFore = dom.querySelector('.hills-fore') as HTMLElement | null;
      const streamRiver = dom.querySelector('.stream-river') as HTMLElement | null;
      const flareOptical = dom.querySelector('.flare-optical') as HTMLElement | null;
      const zoomFlash = dom.querySelector('.zoom-flash') as HTMLElement | null;
      const progressLine = dom.querySelector('.progress-line') as HTMLElement | null;
      const pctNumber = dom.querySelector('#pct-number') as HTMLElement | null;
      const meterWrap = dom.querySelector('.meter-wrap') as HTMLElement | null;

      // Trạng thái chuẩn bị ban đầu
      gsap.set(cameraWorld, { scale: 1, z: 0, opacity: 1, filter: 'blur(0px)' });
      gsap.set(sunContainer, { y: 120, opacity: 0.2, scale: 0.85 });
      gsap.set(brandTitle, { y: 80, opacity: 0, letterSpacing: '0.35em' });
      gsap.set(brandTagline, { y: 30, opacity: 0 });
      gsap.set(mountainsBack, { y: 20, opacity: 0.6 });
      gsap.set(hillsMid, { y: 30, opacity: 0.8 });
      gsap.set(hillsFore, { y: 40, opacity: 0.9 });
      gsap.set(streamRiver, { strokeDashoffset: 1000, opacity: 0.4 });
      gsap.set(flareOptical, { scaleX: 0, opacity: 0 });
      gsap.set(zoomFlash, { opacity: 0 });
      gsap.set(progressLine, { scaleX: 0 });
      gsap.set(meterWrap, { opacity: 0, y: 10 });
      if (pctNumber) pctNumber.textContent = '0';

      const progressState = { val: 0 };

      // Hàm kích hoạt chuyển cảnh Camera Zoom-Through xuyên qua các lớp
      function triggerCameraZoomThrough(fast = false) {
        if (exitingRef.current) return;
        exitingRef.current = true;

        const exitTl = gsap.timeline({ onComplete: finish });

        exitTl
          // Ẩn thanh công cụ UI
          .to(['.skip-action', '.meter-wrap', '.progress-line'], {
            opacity: 0,
            duration: fast ? 0.15 : 0.35,
            ease: 'power2.in',
          })
          // Chớp sáng quang học Anamorphic
          .fromTo(
            flareOptical,
            { scaleX: 0, opacity: 0 },
            {
              scaleX: 1,
              opacity: 0.95,
              duration: fast ? 0.18 : 0.35,
              ease: 'power2.out',
            },
            0
          )
          .to(flareOptical, { opacity: 0, scaleX: 1.4, duration: fast ? 0.2 : 0.4 }, fast ? 0.15 : 0.3)
          // Tách tiền cảnh hai bên dạt ra như cánh cổng mở
          .to(hillsFore, {
            scale: fast ? 1.4 : 1.8,
            y: 80,
            opacity: 0,
            duration: fast ? 0.45 : 0.9,
            ease: 'power3.in',
          }, 0)
          // Camera lao xuyên qua thung lũng (Zoom-Through vào Hero)
          .to(
            cameraWorld,
            {
              scale: fast ? 2.8 : 4.2,
              z: 1400,
              opacity: 0,
              duration: fast ? 0.55 : 1.05,
              ease: 'power3.inOut',
            },
            0
          )
          // Luồng sáng trắng dịu phủ nhẹ lúc chuyển tiếp
          .to(zoomFlash, {
            opacity: fast ? 0.75 : 0.9,
            duration: fast ? 0.25 : 0.5,
            yoyo: true,
            repeat: 1,
            ease: 'power2.inOut',
          }, fast ? 0.1 : 0.25)
          // Kích hoạt hero trang chủ xuất hiện ngay trước khi intro kết thúc
          .add(() => document.body.classList.add('intro-go'), fast ? 0.2 : 0.55);
      }

      // Timeline diễn hoạt chính của cảnh điện ảnh
      const mainTimeline = gsap.timeline({
        onComplete: () => {
          // Chờ fonts & DOM sẵn sàng với timeout an toàn
          const whenReady = Promise.race([
            Promise.all([
              document.fonts ? document.fonts.ready : Promise.resolve(),
              document.readyState === 'complete'
                ? Promise.resolve()
                : new Promise<void>((res) => window.addEventListener('load', () => res(), { once: true })),
            ]),
            new Promise<void>((res) => setTimeout(res, 800)),
          ]);

          whenReady.then(() => triggerCameraZoomThrough(false));
        },
      });

      mainTimeline
        // 1. Hiện bộ đếm % & thanh tiến trình
        .to(meterWrap, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, 0.1)
        .to(
          progressState,
          {
            val: 100,
            duration: 2.5,
            ease: 'power1.inOut',
            onUpdate() {
              if (pctNumber) pctNumber.textContent = String(Math.round(progressState.val));
              if (progressLine) progressLine.style.transform = `scaleX(${progressState.val / 100})`;
            },
          },
          0.1
        )
        // 2. Mặt trời từ từ nhô lên từ sau dãy đồi xa
        .to(
          sunContainer,
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 1.8,
            ease: 'power2.out',
          },
          0.2
        )
        // 3. Các lớp đồi núi trôi nhẹ vào vị trí (Parallax Float-in)
        .to(mountainsBack, { y: 0, opacity: 0.9, duration: 1.5, ease: 'power2.out' }, 0.25)
        .to(hillsMid, { y: 0, opacity: 1, duration: 1.4, ease: 'power2.out' }, 0.35)
        .to(hillsFore, { y: 0, opacity: 1, duration: 1.3, ease: 'power2.out' }, 0.45)
        // 4. Dòng suối uốn lượn phát quang chảy về phía trước
        .to(streamRiver, { opacity: 1, duration: 1.2, ease: 'power2.out' }, 0.5)
        // 5. Chữ CẨM CÙ nhô lên giữa hai lớp đồi núi với ánh vàng kim rực rỡ
        .to(
          brandTitle,
          {
            y: 0,
            opacity: 1,
            letterSpacing: '0.22em',
            duration: 1.4,
            ease: 'power3.out',
          },
          0.65
        )
        .to(
          brandTagline,
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            ease: 'power2.out',
          },
          0.95
        );

      // Sự kiện Bỏ qua & Phím Esc
      const handleSkip = () => triggerCameraZoomThrough(true);
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape' && dom.style.display !== 'none') {
          triggerCameraZoomThrough(true);
        }
      };

      skipBtn?.addEventListener('click', handleSkip);
      window.addEventListener('keydown', handleKeyDown);

      cleanupGsap = () => {
        skipBtn?.removeEventListener('click', handleSkip);
        window.removeEventListener('keydown', handleKeyDown);
        mainTimeline.kill();
        gsap.killTweensOf('*');
      };
    }

    initCinematicIntro();

    return () => {
      cleanupGsap();
      fxRef.current?.stop();
      root.classList.remove('intro-lock');
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div id="camcu-intro-pro" ref={containerRef} role="dialog" aria-label="Đang mở Cẩm Cù House">
      {/* Khung Letterbox Điện Ảnh 2.39:1 */}
      <div className="cinematic-bar-top" aria-hidden="true" />
      <div className="cinematic-bar-bottom" aria-hidden="true" />

      {/* Tia lóe sáng quang học & chớp sáng zoom */}
      <div className="flare-optical" aria-hidden="true" />
      <div className="zoom-flash" aria-hidden="true" />

      {/* Nút Bỏ qua */}
      <button id="skip-btn" className="skip-action" type="button" aria-label="Bỏ qua phần giới thiệu">
        Bỏ qua <span aria-hidden="true">→</span>
      </button>

      {/* Thế giới 3D Camera Parallax */}
      <div className="camera-world">
        {/* Layer 0: Bầu trời rạng đông cao nguyên */}
        <div className="sky-layer" aria-hidden="true" />

        {/* Layer 1: Mặt trời mọc và vầng hào quang */}
        <div className="sun-container" aria-hidden="true">
          <div className="sun-corona" />
          <div className="sun-disc" />
        </div>

        {/* Dải sương mù nhẹ */}
        <div className="fog-mist" aria-hidden="true" />

        {/* Layer 2: Dãy núi mù sương phía xa (Background Mountain Ridge) */}
        <svg className="mountains-back" viewBox="0 0 1440 380" fill="none" preserveAspectRatio="none" aria-hidden="true">
          <path
            d="M0 240 Q180 160 360 210 T720 170 T1080 220 Q1260 170 1440 230 L1440 380 L0 380 Z"
            fill="#183626"
            fillOpacity="0.88"
          />
          <path
            d="M0 270 Q240 200 480 240 T960 210 T1440 260 L1440 380 L0 380 Z"
            fill="#122a1d"
            fillOpacity="0.95"
          />
        </svg>

        {/* Layer 3: Chữ CẨM CÙ nổi lên giữa 2 lớp núi */}
        <div className="brand-layer">
          <h1 className="brand-title">CẨM CÙ</h1>
          <p className="brand-tagline">Chốn Dừng Chân Bên Suối Đá • Gia Nghĩa</p>
        </div>

        {/* Layer 4: Lớp đồi trung cảnh phủ thông xanh (Midground Rolling Hills) */}
        <svg className="hills-mid" viewBox="0 0 1440 450" fill="none" preserveAspectRatio="none" aria-hidden="true">
          <path
            d="M0 220 Q280 130 560 210 T1120 180 Q1280 150 1440 210 L1440 450 L0 450 Z"
            fill="#0f2619"
          />
          <path
            d="M0 280 Q320 200 680 260 T1440 240 L1440 450 L0 450 Z"
            fill="#0a1d13"
          />
        </svg>

        {/* Layer 5: Dòng suối uốn lượn phát quang giữa thung lũng (Winding Stream) */}
        <svg className="stream-river" viewBox="0 0 1440 500" fill="none" preserveAspectRatio="none" aria-hidden="true">
          <defs>
            <linearGradient id="streamGrad" x1="50%" y1="0%" x2="50%" y2="100%">
              <stop offset="0%" stopColor="#7ad3b2" stopOpacity="0.4" />
              <stop offset="40%" stopColor="#a8e6cf" stopOpacity="0.8" />
              <stop offset="70%" stopColor="#d5f5e8" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="1" />
            </linearGradient>
            <filter id="streamGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="8" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          <path
            d="M710 180 Q740 260 670 330 T760 440 Q790 470 780 500 L660 500 Q670 470 640 430 T600 320 Q640 250 690 180 Z"
            fill="url(#streamGrad)"
            filter="url(#streamGlow)"
          />
        </svg>

        {/* Layer 6: Tiền cảnh vách đá & thảm cây hai bên (Foreground Framing Rocks) */}
        <svg className="hills-fore" viewBox="0 0 1440 400" fill="none" preserveAspectRatio="none" aria-hidden="true">
          <path
            d="M0 160 Q180 220 320 310 Q400 360 480 400 L0 400 Z"
            fill="#06120b"
          />
          <path
            d="M1440 180 Q1260 230 1120 320 Q1040 370 960 400 L1440 400 Z"
            fill="#06120b"
          />
        </svg>

        {/* Layer 7: Đom đóm & bụi sương bay lơ lửng */}
        <canvas id="particles-fx" />
      </div>

      {/* Bộ đếm % & Tọa độ đáy màn hình */}
      <div className="meter-wrap" aria-hidden="true">
        <span id="pct-number">0</span>
        <small>%</small>
        <span className="meter-coords">11.99° N • 107.69° E • 800m+</span>
      </div>

      {/* Thanh tiến độ dưới chân màn hình */}
      <i className="progress-line" />
    </div>
  );
}
