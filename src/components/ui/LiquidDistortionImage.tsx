"use client";

import React, { useRef, useEffect, useState } from "react";

interface LiquidDistortionImageProps {
  src: string;
  alt: string;
  className?: string;
  aspectRatio?: string;
}

export default function LiquidDistortionImage({
  src,
  alt,
  className = "",
  aspectRatio = "aspect-[4/5]",
}: LiquidDistortionImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [hasWebGL, setHasWebGL] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", { alpha: true, antialias: true });
    if (!gl) {
      setHasWebGL(false);
      return;
    }

    // Vertex Shader
    const vsSource = `
      attribute vec2 aPosition;
      attribute vec2 aUv;
      varying vec2 vUv;
      void main() {
        vUv = aUv;
        gl_Position = vec4(aPosition, 0.0, 1.0);
      }
    `;

    // Fragment Shader với gợn sóng nước và biến dạng quang học
    const fsSource = `
      precision mediump float;
      uniform sampler2D uTexture;
      uniform vec2 uMouse;
      uniform float uHover;
      uniform float uTime;
      varying vec2 vUv;

      void main() {
        vec2 uv = vUv;
        vec2 diff = uv - uMouse;
        float dist = length(diff);

        // Hiệu ứng sóng nước lan tỏa khi di chuột
        float wave = sin(dist * 20.0 - uTime * 4.0) * exp(-dist * 3.5) * uHover * 0.045;
        
        // Nhấp nhô vi sóng tự nhiên
        float microWave = sin(uv.y * 30.0 + uTime * 2.0) * 0.004 * uHover;

        vec2 distortedUv = clamp(uv + normalize(diff + vec2(0.001)) * wave + vec2(microWave, 0.0), 0.0, 1.0);

        // Tán sắc quang học nhẹ (Chromatic Aberration) tại gợn sóng
        float r = texture2D(uTexture, clamp(distortedUv + wave * 0.2, 0.0, 1.0)).r;
        float g = texture2D(uTexture, distortedUv).g;
        float b = texture2D(uTexture, clamp(distortedUv - wave * 0.2, 0.0, 1.0)).b;

        gl_FragColor = vec4(r, g, b, 1.0);
      }
    `;

    const createShader = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vs = createShader(gl.VERTEX_SHADER, vsSource);
    const fs = createShader(gl.FRAGMENT_SHADER, fsSource);
    if (!vs || !fs) {
      setHasWebGL(false);
      return;
    }

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      setHasWebGL(false);
      return;
    }

    gl.useProgram(program);

    // Quad geometry
    const vertices = new Float32Array([
      -1, -1,  0, 1,
       1, -1,  1, 1,
      -1,  1,  0, 0,
      -1,  1,  0, 0,
       1, -1,  1, 1,
       1,  1,  1, 0,
    ]);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const aPosition = gl.getAttribLocation(program, "aPosition");
    const aUv = gl.getAttribLocation(program, "aUv");

    gl.enableVertexAttribArray(aPosition);
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 16, 0);

    gl.enableVertexAttribArray(aUv);
    gl.vertexAttribPointer(aUv, 2, gl.FLOAT, false, 16, 8);

    const uTextureLoc = gl.getUniformLocation(program, "uTexture");
    const uMouseLoc = gl.getUniformLocation(program, "uMouse");
    const uHoverLoc = gl.getUniformLocation(program, "uHover");
    const uTimeLoc = gl.getUniformLocation(program, "uTime");

    // Load Image Texture
    const texture = gl.createTexture();
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.src = src;

    let isTextureLoaded = false;
    image.onload = () => {
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
      isTextureLoaded = true;
    };

    let animId: number;
    let startTime = performance.now();
    let currentHover = 0;
    let targetHover = 0;
    let mouseX = 0.5;
    let mouseY = 0.5;
    let targetMouseX = 0.5;
    let targetMouseY = 0.5;

    const resize = () => {
      if (!canvas || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    resize();
    window.addEventListener("resize", resize);

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      targetMouseX = (e.clientX - rect.left) / rect.width;
      targetMouseY = (e.clientY - rect.top) / rect.height;
    };

    const handleMouseEnter = () => {
      targetHover = 1.0;
      setIsHovered(true);
    };

    const handleMouseLeave = () => {
      targetHover = 0.0;
      setIsHovered(false);
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("mousemove", handleMouseMove);
      container.addEventListener("mouseenter", handleMouseEnter);
      container.addEventListener("mouseleave", handleMouseLeave);
    }

    const render = (now: number) => {
      if (isTextureLoaded) {
        currentHover += (targetHover - currentHover) * 0.08;
        mouseX += (targetMouseX - mouseX) * 0.1;
        mouseY += (targetMouseY - mouseY) * 0.1;

        const time = (now - startTime) * 0.001;

        gl.uniform1f(uTimeLoc, time);
        gl.uniform1f(uHoverLoc, currentHover);
        gl.uniform2f(uMouseLoc, mouseX, mouseY);
        gl.uniform1i(uTextureLoc, 0);

        gl.drawArrays(gl.TRIANGLES, 0, 6);
      }
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      if (container) {
        container.removeEventListener("mousemove", handleMouseMove);
        container.removeEventListener("mouseenter", handleMouseEnter);
        container.removeEventListener("mouseleave", handleMouseLeave);
      }
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteTexture(texture);
      gl.deleteBuffer(buffer);
    };
  }, [src]);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden group cursor-pointer ${aspectRatio} ${className}`}
    >
      {hasWebGL ? (
        <canvas
          ref={canvasRef}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      ) : (
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
        />
      )}

      {/* Ánh sáng quét viền tinh tế */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0C0705]/80 via-transparent to-transparent opacity-80 group-hover:opacity-40 transition-opacity duration-500 pointer-events-none" />
      <div className="absolute inset-0 ring-1 ring-inset ring-[#D4AF37]/20 group-hover:ring-[#D4AF37]/50 transition-colors duration-500 pointer-events-none rounded-none" />
    </div>
  );
}
