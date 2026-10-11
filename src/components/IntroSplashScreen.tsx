'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import './intro.css';

const SHOW_ONCE = true; // Chạy 1 lần mỗi phiên (truy cập ?intro=1 để chạy lại)

const TITLE_CHARS = Array.from('CẨM CÙ HOUSE');

export default function IntroSplashScreen() {
  const [isRendered, setIsRendered] = useState(true);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const fxRef = useRef<{ stop: () => void } | null>(null);
  const exitingRef = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const introEl = containerRef.current;
    if (!introEl) return;

    const root = document.documentElement;
    const canvas = introEl.querySelector('#fx') as HTMLCanvasElement | null;
    const skipBtn = introEl.querySelector('#skip') as HTMLButtonElement | null;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const seen = () => {
      try {
        return sessionStorage.getItem('cc_intro') === '1';
      } catch (e) {
        return false;
      }
    };

    const mark = () => {
      try {
        sessionStorage.setItem('cc_intro', '1');
      } catch (e) {}
    };

    const hasForceParam = /[?&](intro|replay)=/i.test(window.location.search);
    if (hasForceParam) {
      try {
        sessionStorage.removeItem('cc_intro');
      } catch (e) {}
    }

    // Bảo vệ timeout 800ms để không bao giờ bị treo promise nếu window load event đã qua
    const ready = () =>
      Promise.race([
        Promise.all([
          document.fonts ? document.fonts.ready : Promise.resolve(),
          document.readyState === 'complete'
            ? Promise.resolve()
            : new Promise((r) => window.addEventListener('load', r, { once: true })),
        ]),
        new Promise((r) => setTimeout(r, 800)),
      ]);

    function fireflies(cv: HTMLCanvasElement) {
      const c = cv.getContext('2d');
      if (!c) return { stop() {} };
      let w = 0,
        h = 0,
        d = 1,
        p: Array<{ x: number; y: number; r: number; v: number; a: number; s: number }> = [],
        id: number,
        on = true;

      const rs = () => {
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

      rs();
      window.addEventListener('resize', rs);

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
        id = requestAnimationFrame(loop);
      })(0);

      return {
        stop() {
          on = false;
          cancelAnimationFrame(id);
          window.removeEventListener('resize', rs);
        },
      };
    }

    function finish() {
      if (introEl) introEl.style.display = 'none';
      root.classList.remove('intro-lock');
      document.body.classList.add('intro-go');
      fxRef.current?.stop();
      mark();
      document.dispatchEvent(new CustomEvent('camcu:intro-done'));
      setIsRendered(false);
    }

    // GSAP context để quản lý toàn bộ scope và cleanup
    const ctx = gsap.context(() => {
      const bar = introEl.querySelector('.bar') as HTMLElement | null;
      const pct = introEl.querySelector('#pct') as HTMLElement | null;
      const mk = introEl.querySelector('.mark') as HTMLElement | null;
      const chars = gsap.utils.toArray('.c') as HTMLElement[];
      const petals = gsap.utils.toArray('.pt') as SVGElement[];
      const rings = gsap.utils.toArray('.ring') as HTMLElement[];

      function exit(fast = false) {
        if (exitingRef.current) return;
        exitingRef.current = true;

        const R = Math.hypot(window.innerWidth, window.innerHeight) / 2 + 80;
        const m = { r: -70 };

        const exitTl = gsap.timeline({ onComplete: finish });

        exitTl
          .to(['.stage', '.meter', '#skip'], {
            opacity: 0,
            scale: fast ? 1 : 1.05,
            duration: fast ? 0.2 : 0.45,
            ease: 'power2.in',
          })
          .to(bar, { opacity: 0, duration: 0.3 }, 0)
          .to(
            m,
            {
              r: R,
              duration: fast ? 0.6 : 1.15,
              ease: 'power3.inOut',
              onUpdate() {
                if (introEl) {
                  const mask = `radial-gradient(circle at 50% 50%, transparent ${m.r}px, #000 ${m.r + 70}px)`;
                  introEl.style.webkitMaskImage = mask;
                  introEl.style.maskImage = mask;
                }
              },
            },
            fast ? 0.05 : 0.3
          )
          .add(() => document.body.classList.add('intro-go'), fast ? 0.15 : 0.6);
      }

      function play() {
        if (!introEl) return;
        exitingRef.current = false;
        fxRef.current?.stop();

        document.body.classList.remove('intro-go');
        root.classList.add('intro-lock');

        introEl.style.display = '';
        introEl.style.webkitMaskImage = 'none';
        introEl.style.maskImage = 'none';

        if (canvas) {
          fxRef.current = fireflies(canvas);
        }

        if (mk) {
          mk.style.setProperty('--L', Math.max(80, mk.getBoundingClientRect().top - 18) + 'px');
        }

        const prog = { v: 0 };

        if (pct) pct.textContent = '0';
        if (bar) {
          bar.style.opacity = '1';
          bar.style.transform = 'scaleX(0)';
        }

        gsap.set(['.stage', '#skip'], { opacity: 1, scale: 1 });
        gsap.set(chars, { yPercent: 115 });
        gsap.set('.stream', { scaleY: 0, opacity: 1 });
        gsap.set('.drop', { opacity: 0, y: 0, scale: 0.3 });
        gsap.set(petals, { scale: 0, rotation: -25, svgOrigin: '0 0' });
        gsap.set('.cor', { scale: 0, svgOrigin: '0 0' });
        gsap.set(rings, { opacity: 0 });
        gsap.set('.glow', { opacity: 0 });
        gsap.set('.meter', { opacity: 0 });
        gsap.set('.tag', { opacity: 0, y: 12 });
        gsap.set('.loc', { opacity: 0 });
        gsap.set('.word', { letterSpacing: '.42em' });

        gsap
          .timeline({
            defaults: { ease: 'power2.out' },
            onComplete: () => {
              ready().then(() => exit(false));
            },
          })
          .to('.meter', { opacity: 1, duration: 0.5 }, 0.15)
          .to(
            prog,
            {
              v: 100,
              duration: 2.45,
              ease: 'power1.inOut',
              onUpdate() {
                if (pct) pct.textContent = String(Math.round(prog.v));
                if (bar) bar.style.transform = `scaleX(${prog.v / 100})`;
              },
            },
            0.15
          )
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

      const onSkipClick = () => exit(true);
      skipBtn?.addEventListener('click', onSkipClick);

      const onKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape' && introEl.style.display !== 'none') {
          exit(true);
        }
      };
      window.addEventListener('keydown', onKeyDown);

      if (reduce || (SHOW_ONCE && seen() && !hasForceParam)) {
        finish();
      } else {
        play();
      }

      return () => {
        skipBtn?.removeEventListener('click', onSkipClick);
        window.removeEventListener('keydown', onKeyDown);
      };
    }, containerRef);

    return () => {
      ctx.revert();
      fxRef.current?.stop();
      root.classList.remove('intro-lock');
    };
  }, []);

  if (!isRendered) return null;

  return (
    <div id="intro" ref={containerRef} role="dialog" aria-label="Đang tải Cẩm Cù House">
      <canvas id="fx" />
      <div className="glow" />
      <div className="vig" />
      <div className="grain" />
      <button id="skip" type="button" aria-label="Bỏ qua phần giới thiệu">
        Bỏ qua <span aria-hidden="true">→</span>
      </button>
      <div className="stage">
        <div className="mark">
          <i className="stream" />
          <i className="drop" />
          <i className="ring" />
          <i className="ring" />
          <i className="ring" />
          <svg className="flower" viewBox="-60 -60 120 120" aria-hidden="true">
            <g fill="rgba(243,235,216,.1)" stroke="#f3ebd8" strokeWidth="1.3" strokeLinejoin="round">
              <g transform="rotate(0)">
                <path className="pt" d="M0 0C-12-16-10-38 0-54 10-38 12-16 0 0Z" />
              </g>
              <g transform="rotate(72)">
                <path className="pt" d="M0 0C-12-16-10-38 0-54 10-38 12-16 0 0Z" />
              </g>
              <g transform="rotate(144)">
                <path className="pt" d="M0 0C-12-16-10-38 0-54 10-38 12-16 0 0Z" />
              </g>
              <g transform="rotate(216)">
                <path className="pt" d="M0 0C-12-16-10-38 0-54 10-38 12-16 0 0Z" />
              </g>
              <g transform="rotate(288)">
                <path className="pt" d="M0 0C-12-16-10-38 0-54 10-38 12-16 0 0Z" />
              </g>
            </g>
            <g className="cor" fill="#cc7755">
              <circle r="6" />
              <circle cx="0" cy="-13" r="2.6" />
              <circle cx="12.4" cy="-4" r="2.6" />
              <circle cx="7.6" cy="10.5" r="2.6" />
              <circle cx="-7.6" cy="10.5" r="2.6" />
              <circle cx="-12.4" cy="-4" r="2.6" />
            </g>
          </svg>
        </div>
        <h1 className="word" aria-label="Cẩm Cù House">
          {TITLE_CHARS.map((ch, idx) =>
            ch === ' ' ? (
              <span key={idx} className="sp" />
            ) : (
              <span key={idx} className="m">
                <span className="c">{ch}</span>
              </span>
            )
          )}
        </h1>
        <p className="tag">Chốn dừng chân mộc mạc bên suối đá</p>
        <p className="loc">Gia Nghĩa • Đắk Nông</p>
      </div>
      <div className="meter" aria-hidden="true">
        <span id="pct">0</span>
        <small>%</small>
      </div>
      <i className="bar" />
    </div>
  );
}
