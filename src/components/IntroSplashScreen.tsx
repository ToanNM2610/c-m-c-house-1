'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import './intro.css';

const SHOW_ONCE = true; // true = chỉ chạy 1 lần mỗi session; dùng ?intro=1 để ép chạy lại
const STORAGE_KEY = 'cc_intro_v2'; // v2 để tránh trùng với key cũ (camcu_intro_seen_v1)

const TITLE_CHARS = Array.from('CẨM CÙ HOUSE');

export default function IntroSplashScreen() {
  // isVisible = true: giữ DOM mounted; false: unmount sau khi exit xong
  const [isVisible, setIsVisible] = useState(true);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const fxRef = useRef<{ stop: () => void } | null>(null);
  const exitingRef = useRef(false);

  useEffect(() => {
    // Chỉ chạy trên client
    if (typeof window === 'undefined') return;

    const introEl = containerRef.current;
    if (!introEl) return;
    // Alias không-null để dùng trong các inner function
    const el = introEl;

    const root = document.documentElement;
    const canvas = el.querySelector('#fx') as HTMLCanvasElement | null;
    const skipBtn = el.querySelector('#skip') as HTMLButtonElement | null;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Kiểm tra ?intro=1 hoặc ?replay=1 để ép chạy lại
    const hasForceParam =
      new URLSearchParams(window.location.search).has('intro') ||
      new URLSearchParams(window.location.search).has('replay');

    if (hasForceParam) {
      try { sessionStorage.removeItem(STORAGE_KEY); } catch (_) {}
    }

    const seen = (): boolean => {
      try { return sessionStorage.getItem(STORAGE_KEY) === '1'; } catch (_) { return false; }
    };

    const mark = () => {
      try { sessionStorage.setItem(STORAGE_KEY, '1'); } catch (_) {}
    };

    // Nếu đã xem (và không force) → ẩn ngay, không animate
    if (SHOW_ONCE && seen() && !hasForceParam) {
      el.style.display = 'none';
      root.classList.remove('intro-lock');
      document.body.classList.add('intro-go');
      setIsVisible(false);
      return;
    }

    // Nếu prefers-reduced-motion → bỏ qua nhưng vẫn đánh dấu đã xem
    if (reduce) {
      el.style.display = 'none';
      root.classList.remove('intro-lock');
      document.body.classList.add('intro-go');
      mark();
      document.dispatchEvent(new CustomEvent('camcu:intro-done'));
      setIsVisible(false);
      return;
    }

    // ── FIREFLIES (đom đóm canvas) ──────────────────────────────────────────
    function fireflies(cv: HTMLCanvasElement) {
      const c = cv.getContext('2d');
      if (!c) return { stop() {} };
      let w = 0, h = 0, d = 1;
      type Fly = { x: number; y: number; r: number; v: number; a: number; s: number };
      let p: Fly[] = [];
      let frameId: number;
      let on = true;

      const resize = () => {
        d = Math.min(window.devicePixelRatio || 1, 2);
        w = cv.width = window.innerWidth * d;
        h = cv.height = window.innerHeight * d;
        p = Array.from({ length: Math.min(48, Math.round(window.innerWidth / 26)) }, () => ({
          x: Math.random() * w,
          y: Math.random() * h,
          r: (0.7 + Math.random() * 1.6) * d,
          v: (0.08 + Math.random() * 0.22) * d,
          a: Math.random() * 6.28,
          s: 0.4 + Math.random() * 1.2,
        }));
      };

      resize();
      window.addEventListener('resize', resize);

      (function loop(t: number) {
        if (!on) return;
        c.clearRect(0, 0, w, h);
        c.globalCompositeOperation = 'lighter';
        for (const q of p) {
          q.y -= q.v;
          q.x += Math.sin((t / 1800) * q.s + q.a) * 0.25 * d;
          if (q.y < -10) q.y = h + 10;
          const k = 0.35 + 0.65 * Math.abs(Math.sin((t / 900) * q.s + q.a));
          const g = c.createRadialGradient(q.x, q.y, 0, q.x, q.y, q.r * 7);
          g.addColorStop(0, `rgba(226,240,170,${0.5 * k})`);
          g.addColorStop(1, 'rgba(226,240,170,0)');
          c.fillStyle = g;
          c.beginPath();
          c.arc(q.x, q.y, q.r * 7, 0, 6.283);
          c.fill();
        }
        frameId = requestAnimationFrame(loop);
      })(0);

      return {
        stop() {
          on = false;
          cancelAnimationFrame(frameId);
          window.removeEventListener('resize', resize);
        },
      };
    }

    // ── FINISH (dọn dẹp sau exit) ────────────────────────────────────────────
    function finish() {
      mark();
      fxRef.current?.stop();
      el.style.display = 'none';
      root.classList.remove('intro-lock');
      document.body.classList.add('intro-go');
      document.dispatchEvent(new CustomEvent('camcu:intro-done'));
      setIsVisible(false);
    }

    // ── EXIT animation (radial mask mở dần) ──────────────────────────────────
    function exit(fast = false) {
      if (exitingRef.current) return;
      exitingRef.current = true;

      const R = Math.hypot(window.innerWidth, window.innerHeight) / 2 + 80;
      const m = { r: -70 };

      const tl = gsap.timeline({ onComplete: finish });

      tl.to(['.stage', '.meter', '#skip'], {
        opacity: 0,
        scale: fast ? 1 : 1.05,
        duration: fast ? 0.18 : 0.4,
        ease: 'power2.in',
      })
        .to(el.querySelector('.bar'), { opacity: 0, duration: 0.25 }, 0)
        .to(m, {
          r: R,
          duration: fast ? 0.55 : 1.1,
          ease: 'power3.inOut',
          onUpdate() {
            const mask = `radial-gradient(circle at 50% 50%, transparent ${m.r}px, #000 ${m.r + 70}px)`;
            el.style.webkitMaskImage = mask;
            el.style.maskImage = mask;
          },
        }, fast ? 0.05 : 0.28)
        .add(() => document.body.classList.add('intro-go'), fast ? 0.12 : 0.55);
    }

    // ── PLAY (chạy timeline chính) ────────────────────────────────────────────
    function play() {
      exitingRef.current = false;

      // Đảm bảo intro hiển thị toàn màn hình
      el.style.display = '';
      el.style.webkitMaskImage = 'none';
      el.style.maskImage = 'none';
      root.classList.add('intro-lock');
      document.body.classList.remove('intro-go');

      // Khởi động đom đóm
      if (canvas) fxRef.current = fireflies(canvas);

      // Đặt chiều cao dòng suối theo vị trí thực trên màn hình
      const mk = el.querySelector('.mark') as HTMLElement | null;
      if (mk) {
        const top = mk.getBoundingClientRect().top;
        mk.style.setProperty('--L', Math.max(80, top - 18) + 'px');
      }

      // Lấy tất cả phần tử cần animate
      const bar    = el.querySelector('.bar') as HTMLElement | null;
      const pct    = el.querySelector('#pct') as HTMLElement | null;
      const chars  = Array.from(el.querySelectorAll('.c'))   as HTMLElement[];
      const petals = Array.from(el.querySelectorAll('.pt'))  as SVGElement[];
      const rings  = Array.from(el.querySelectorAll('.ring')) as HTMLElement[];

      // Reset trạng thái ban đầu
      if (pct) pct.textContent = '0';
      if (bar) { bar.style.opacity = '1'; bar.style.transform = 'scaleX(0)'; }

      const prog = { v: 0 };

      gsap.set(['.stage', '#skip'], { opacity: 1, scale: 1 });
      gsap.set(chars,  { yPercent: 115 });
      gsap.set('.stream', { scaleY: 0, opacity: 1 });
      gsap.set('.drop',   { opacity: 0, y: 0, scale: 0.3 });
      gsap.set(petals,  { scale: 0, rotation: -25, svgOrigin: '0 0' });
      gsap.set('.cor',  { scale: 0, svgOrigin: '0 0' });
      gsap.set(rings,   { opacity: 0 });
      gsap.set('.glow', { opacity: 0 });
      gsap.set('.meter', { opacity: 0 });
      gsap.set('.tag', { opacity: 0, y: 12 });
      gsap.set('.loc', { opacity: 0 });
      gsap.set('.word', { letterSpacing: '.42em' });

      // Chờ fonts + load, với timeout an toàn 800ms
      const ready = () =>
        Promise.race([
          Promise.all([
            document.fonts ? document.fonts.ready : Promise.resolve(),
            document.readyState === 'complete'
              ? Promise.resolve()
              : new Promise<void>((r) => window.addEventListener('load', () => r(), { once: true })),
          ]),
          new Promise<void>((r) => setTimeout(r, 800)),
        ]);

      gsap.timeline({
        defaults: { ease: 'power2.out' },
        onComplete: () => { ready().then(() => exit(false)); },
      })
        .to('.meter', { opacity: 1, duration: 0.5 }, 0.15)
        .to(prog, {
          v: 100,
          duration: 2.45,
          ease: 'power1.inOut',
          onUpdate() {
            if (pct) pct.textContent = String(Math.round(prog.v));
            if (bar) bar.style.transform = `scaleX(${prog.v / 100})`;
          },
        }, 0.15)
        .to('.stream', { scaleY: 1, duration: 0.5, ease: 'power2.in' }, 0.2)
        .to('.drop', { opacity: 1, scale: 1, duration: 0.12 }, 0.7)
        .to('.drop', { y: 68, duration: 0.35, ease: 'power2.in' }, 0.8)
        .add('hit', 1.15)
        .set('.drop', { opacity: 0 }, 'hit')
        .to('.stream', { opacity: 0, duration: 0.4 }, 'hit')
        .fromTo(rings, { scale: 0.2, opacity: 0.9 }, { scale: 8, opacity: 0, duration: 1.5, stagger: 0.2 }, 'hit')
        .to('.glow', { opacity: 1, duration: 1.2 }, 'hit')
        .to(petals, { scale: 1, rotation: 0, duration: 1, ease: 'back.out(1.6)', stagger: 0.08 }, 'hit+=.05')
        .to('.cor', { scale: 1, duration: 0.7, ease: 'back.out(2.2)' }, 'hit+=.45')
        .to(chars, { yPercent: 0, duration: 0.85, ease: 'power4.out', stagger: 0.045 }, 'hit+=.35')
        .to('.word', { letterSpacing: '.16em', duration: 1.5, ease: 'power3.out' }, 'hit+=.35')
        .to('.tag', { opacity: 1, y: 0, duration: 0.7 }, 'hit+=.8')
        .to('.loc', { opacity: 1, duration: 0.7 }, 'hit+=1');
    }

    // Gắn sự kiện Skip + Escape
    const onSkip = () => exit(true);
    const onKey  = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && el.style.display !== 'none') exit(true);
    };
    skipBtn?.addEventListener('click', onSkip);
    window.addEventListener('keydown', onKey);

    // BẮT ĐẦU!
    play();

    return () => {
      skipBtn?.removeEventListener('click', onSkip);
      window.removeEventListener('keydown', onKey);
      gsap.killTweensOf('*');
      fxRef.current?.stop();
      root.classList.remove('intro-lock');
    };
  }, []);

  // Sau khi finish() chạy, unmount DOM khỏi cây React
  if (!isVisible) return null;

  return (
    <div id="intro" ref={containerRef} role="dialog" aria-label="Đang tải Cẩm Cù House">
      <canvas id="fx" />
      <div className="glow" />
      <div className="vig" />
      <div className="grain" />

      {/* Nút Bỏ qua */}
      <button id="skip" type="button" aria-label="Bỏ qua phần giới thiệu">
        Bỏ qua <span aria-hidden="true">→</span>
      </button>

      {/* Nội dung trung tâm */}
      <div className="stage">
        <div className="mark">
          {/* Dòng suối từ trên đổ xuống */}
          <i className="stream" />
          {/* Giọt nước rơi */}
          <i className="drop" />
          {/* Vòng sóng gợn × 3 */}
          <i className="ring" />
          <i className="ring" />
          <i className="ring" />
          {/* Hoa Cẩm Cù (Hoya) 5 cánh */}
          <svg className="flower" viewBox="-60 -60 120 120" aria-hidden="true">
            <g fill="rgba(243,235,216,.1)" stroke="#f3ebd8" strokeWidth="1.3" strokeLinejoin="round">
              {[0, 72, 144, 216, 288].map((deg) => (
                <g key={deg} transform={`rotate(${deg})`}>
                  <path className="pt" d="M0 0C-12-16-10-38 0-54 10-38 12-16 0 0Z" />
                </g>
              ))}
            </g>
            {/* Nhụy hoa màu cam đất */}
            <g className="cor" fill="#cc7755">
              <circle r="6" />
              <circle cx="0"    cy="-13"  r="2.6" />
              <circle cx="12.4" cy="-4"   r="2.6" />
              <circle cx="7.6"  cy="10.5" r="2.6" />
              <circle cx="-7.6" cy="10.5" r="2.6" />
              <circle cx="-12.4" cy="-4"  r="2.6" />
            </g>
          </svg>
        </div>

        {/* Tên thương hiệu — từng ký tự trượt lên */}
        <h1 className="word" aria-label="Cẩm Cù House">
          {TITLE_CHARS.map((ch, i) =>
            ch === ' ' ? (
              <span key={i} className="sp" />
            ) : (
              <span key={i} className="m">
                <span className="c">{ch}</span>
              </span>
            )
          )}
        </h1>

        <p className="tag">Chốn dừng chân mộc mạc bên suối đá</p>
        <p className="loc">Gia Nghĩa • Đắk Nông</p>
      </div>

      {/* Bộ đếm phần trăm */}
      <div className="meter" aria-hidden="true">
        <span id="pct">0</span>
        <small>%</small>
      </div>

      {/* Thanh tiến trình dưới cùng */}
      <i className="bar" />
    </div>
  );
}
