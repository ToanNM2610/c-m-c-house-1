"use client";

import React, { useRef, useEffect } from "react";

export default function CoffeeSmokeShader() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", { alpha: true });
    if (!gl) return;

    const vsSource = `
      attribute vec2 aPosition;
      void main() {
        gl_Position = vec4(aPosition, 0.0, 1.0);
      }
    `;

    // Shader làn khói cà phê FBM (Fractal Brownian Motion) chuyển động chậm
    const fsSource = `
      precision mediump float;
      uniform vec2 uResolution;
      uniform float uTime;

      // 2D Hash & Noise
      float hash(vec2 p) {
        p = 50.0 * fract(p * 0.3183099 + vec2(0.71, 0.113));
        return -1.0 + 2.0 * fract(p.x * p.y * (p.x + p.y));
      }

      float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(mix(hash(i + vec2(0.0,0.0)), hash(i + vec2(1.0,0.0)), u.x),
                   mix(hash(i + vec2(0.0,1.0)), hash(i + vec2(1.0,1.0)), u.x), u.y);
      }

      float fbm(vec2 p) {
        float v = 0.0;
        float a = 0.5;
        vec2 shift = vec2(100.0);
        mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
        for (int i = 0; i < 4; ++i) {
          v += a * noise(p);
          p = rot * p * 2.0 + shift;
          a *= 0.5;
        }
        return v;
      }

      void main() {
        vec2 uv = gl_FragCoord.xy / uResolution.xy;
        uv.y = 1.0 - uv.y;

        // Tốc độ khói bốc lên cực chậm
        float slowTime = uTime * 0.06;
        vec2 smokeCoord = vec2(uv.x * 2.5, uv.y * 2.0 - slowTime);

        // Biến dạng FBM kép tạo làn hơi nước cà phê
        vec2 q = vec2(fbm(smokeCoord), fbm(smokeCoord + vec2(5.2, 1.3)));
        vec2 r = vec2(fbm(smokeCoord + 4.0 * q + vec2(1.7, 9.2)), fbm(smokeCoord + 4.0 * q + vec2(8.3, 2.8)));
        float smoke = fbm(smokeCoord + 4.0 * r);

        // Ánh vàng cà phê & khói ấm
        vec3 smokeColor = mix(vec3(0.12, 0.07, 0.04), vec3(0.83, 0.69, 0.50), clamp(smoke * 0.8, 0.0, 1.0));
        float alpha = smoothstep(0.1, 0.75, smoke) * 0.18;

        gl_FragColor = vec4(smokeColor, alpha);
      }
    `;

    const createShader = (type: number, src: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, src);
      gl.compileShader(shader);
      return shader;
    };

    const vs = createShader(gl.VERTEX_SHADER, vsSource);
    const fs = createShader(gl.FRAGMENT_SHADER, fsSource);
    if (!vs || !fs) return;

    const prog = gl.createProgram();
    if (!prog) return;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const quad = new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, quad, gl.STATIC_DRAW);

    const posLoc = gl.getAttribLocation(prog, "aPosition");
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    const resLoc = gl.getUniformLocation(prog, "uResolution");
    const timeLoc = gl.getUniformLocation(prog, "uTime");

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(resLoc, canvas.width, canvas.height);
    };

    resize();
    window.addEventListener("resize", resize);

    let animId: number;
    const render = (time: number) => {
      gl.uniform1f(timeLoc, time * 0.001);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      gl.deleteProgram(prog);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteBuffer(buf);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0 opacity-80"
    />
  );
}
