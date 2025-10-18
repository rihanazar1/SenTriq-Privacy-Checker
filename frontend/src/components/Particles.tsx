import React, { useEffect, useRef } from "react";
import { Renderer, Camera, Geometry, Program, Mesh } from "ogl";

interface ParticlesProps {
  particleCount?: number;
  particleSpread?: number;
  speed?: number;
  moveParticlesOnHover?: boolean;
  particleHoverFactor?: number;
  cameraDistance?: number;
  disableRotation?: boolean;
  particleSize?: number; // 👈 control particle size
  particleColor?: string; // 👈 control color (hex format)
  className?: string;
}

const vertex = /* glsl */ `
  attribute vec3 position;
  attribute vec4 random;

  uniform mat4 modelMatrix;
  uniform mat4 viewMatrix;
  uniform mat4 projectionMatrix;
  uniform float uTime;
  uniform float uSpread;
  uniform float uBaseSize;

  varying vec4 vRandom;

  void main() {
    vRandom = random;
    vec3 pos = position * uSpread;

    // Light random motion
    float t = uTime;
    pos.x += sin(t * random.x + random.w * 6.28) * 0.2;
    pos.y += cos(t * random.y + random.z * 6.28) * 0.2;
    pos.z += sin(t * random.z + random.y * 6.28) * 0.2;

    vec4 mvPos = viewMatrix * vec4(pos, 1.0);

    // ✅ Fixed size independent of distance
    gl_PointSize = uBaseSize;

    gl_Position = projectionMatrix * mvPos;
  }
`;

const fragment = /* glsl */ `
  precision highp float;

  uniform float uTime;
  uniform vec3 uColor;

  varying vec4 vRandom;

  void main() {
    vec2 uv = gl_PointCoord.xy;
    float dist = length(uv - vec2(0.5));

    // soft circular glow
    float glow = smoothstep(0.5, 0.0, dist);

    // twinkling flicker
    float flicker = 0.6 + 0.4 * sin(uTime * 2.0 + vRandom.x * 10.0);

    vec3 color = uColor * flicker;

    gl_FragColor = vec4(color, glow);
  }
`;

const hexToRgb = (hex: string): [number, number, number] => {
  hex = hex.replace(/^#/, "");
  const bigint = parseInt(hex, 16);
  return [
    ((bigint >> 16) & 255) / 255,
    ((bigint >> 8) & 255) / 255,
    (bigint & 255) / 255,
  ];
};

const Particles: React.FC<ParticlesProps> = ({
  particleCount = 300,
  particleSpread = 10,
  speed = 0.2,
  moveParticlesOnHover = false,
  particleHoverFactor = 1,
  cameraDistance = 20,
  disableRotation = false,
  particleSize = 60, // default visible size
  particleColor = "#aaffaa", // light green default
  className,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const renderer = new Renderer({ depth: false, alpha: true });
    const gl = renderer.gl;
    container.appendChild(gl.canvas);
    gl.clearColor(0, 0, 0, 0);

    // Enable additive blending (for glow)
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE);

    const camera = new Camera(gl, { fov: 15 });
    camera.position.set(0, 0, cameraDistance);

    const resize = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      renderer.setSize(width, height);
      camera.perspective({ aspect: gl.canvas.width / gl.canvas.height });
    };
    window.addEventListener("resize", resize);
    resize();

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouseRef.current = { x, y };
    };
    if (moveParticlesOnHover) container.addEventListener("mousemove", handleMouseMove);

    const count = particleCount;
    const positions = new Float32Array(count * 3);
    const randoms = new Float32Array(count * 4);

    for (let i = 0; i < count; i++) {
      positions.set(
        [(Math.random() - 0.5) * 2, (Math.random() - 0.5) * 2, (Math.random() - 0.5) * 2],
        i * 3
      );
      randoms.set(
        [Math.random(), Math.random(), Math.random(), Math.random()],
        i * 4
      );
    }

    const geometry = new Geometry(gl, {
      position: { size: 3, data: positions },
      random: { size: 4, data: randoms },
    });

    const [r, g, b] = hexToRgb(particleColor);

    const program = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        uTime: { value: 0 },
        uSpread: { value: particleSpread },
        uBaseSize: { value: particleSize },
        uColor: { value: [r, g, b] },
      },
      transparent: true,
      depthTest: false,
      depthWrite: false,
    });

    const particles = new Mesh(gl, { mode: gl.POINTS, geometry, program });

    let animationFrameId: number;
    let lastTime = performance.now();
    let elapsed = 0;

    const update = (t: number) => {
      animationFrameId = requestAnimationFrame(update);
      const delta = t - lastTime;
      lastTime = t;
      elapsed += delta * speed;
      program.uniforms.uTime.value = elapsed * 0.001;

      if (moveParticlesOnHover) {
        particles.position.x = -mouseRef.current.x * particleHoverFactor;
        particles.position.y = -mouseRef.current.y * particleHoverFactor;
      }

      if (!disableRotation) {
        particles.rotation.x += 0.001;
        particles.rotation.y += 0.001;
      }

      renderer.render({ scene: particles, camera });
    };

    animationFrameId = requestAnimationFrame(update);

    return () => {
      window.removeEventListener("resize", resize);
      if (moveParticlesOnHover) container.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
      if (container.contains(gl.canvas)) container.removeChild(gl.canvas);
    };
  }, [
    particleCount,
    particleSpread,
    speed,
    moveParticlesOnHover,
    particleHoverFactor,
    cameraDistance,
    disableRotation,
    particleSize,
    particleColor,
  ]);

  return <div ref={containerRef} className={`relative w-full h-full ${className}`} />;
};

export default Particles;
