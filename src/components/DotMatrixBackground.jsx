import { useRef, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useTheme } from "../contexts/ThemeContext";

const DOT_COUNT = 1500;
const GRID_SIZE = 40;
const MOUSE_INFLUENCE_RADIUS = 5;
const ANIMATION_SPEED = 0.5;

function DotParticles({ mousePosition }) {
  const { theme } = useTheme();
  const pointsRef = useRef();
  const { viewport } = useThree();
  const timeRef = useRef(0);

  // Create dot positions in a grid pattern
  const { positions, originalPositions, sizes } = useMemo(() => {
    const positions = new Float32Array(DOT_COUNT * 3);
    const originalPositions = new Float32Array(DOT_COUNT * 3);
    const sizes = new Float32Array(DOT_COUNT);
    const spacing = GRID_SIZE;
    const cols = Math.ceil(Math.sqrt(DOT_COUNT));
    const rows = Math.ceil(DOT_COUNT / cols);
    const baseSize = theme === "dark" ? 0.15 : 0.12;

    for (let i = 0; i < DOT_COUNT; i++) {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const x = (col - cols / 2) * spacing;
      const y = (row - rows / 2) * spacing;
      const z = (Math.random() - 0.5) * 10;

      const i3 = i * 3;
      positions[i3] = x;
      positions[i3 + 1] = y;
      positions[i3 + 2] = z;

      originalPositions[i3] = x;
      originalPositions[i3 + 1] = y;
      originalPositions[i3 + 2] = z;

      sizes[i] = baseSize;
    }

    return { positions, originalPositions, sizes };
  }, [theme]);

  // Create geometry
  const geometry = useMemo(() => {
    const geom = new THREE.BufferGeometry();
    geom.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geom;
  }, [positions]);

  // Store original positions in ref for animation
  const originalPositionsRef = useRef(originalPositions);
  useEffect(() => {
    originalPositionsRef.current = originalPositions;
  }, [originalPositions]);

  // Create shader material for dynamic sizing
  const materialRef = useRef();
  const material = useMemo(() => {
    const mat = new THREE.ShaderMaterial({
      uniforms: {
        color: { value: new THREE.Color(theme === "dark" ? "#22d3ee" : "#0ea5e9") },
        pointSize: { value: theme === "dark" ? 2.0 : 1.5 },
        opacity: { value: theme === "dark" ? 0.6 : 0.5 },
        time: { value: 0 },
        mousePos: { value: new THREE.Vector2(0, 0) },
        viewport: { value: new THREE.Vector2(viewport.width, viewport.height) },
      },
      vertexShader: `
        uniform float pointSize;
        uniform vec2 mousePos;
        uniform vec2 viewport;
        varying float vDistance;
        varying float vOpacity;
        
        void main() {
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = pointSize * (300.0 / -mvPosition.z);
          vDistance = distance(position.xy, mousePos * viewport * 0.5);
          vOpacity = 1.0 - smoothstep(0.0, 75.0, vDistance);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform vec3 color;
        uniform float opacity;
        varying float vDistance;
        varying float vOpacity;
        
        void main() {
          float dist = distance(gl_PointCoord, vec2(0.5));
          if (dist > 0.5) discard;
          float alpha = (1.0 - dist * 2.0) * opacity;
          float mouseAlpha = vOpacity * 0.5 + 0.5;
          gl_FragColor = vec4(color, alpha * mouseAlpha);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    materialRef.current = mat;
    return mat;
  }, [theme, viewport.width, viewport.height]);

  // Update viewport uniform when it changes
  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.uniforms.viewport.value.set(viewport.width, viewport.height);
    }
  }, [viewport.width, viewport.height, material]);

  // Animate dots based on mouse position and time
  useFrame((state, delta) => {
    if (!pointsRef.current || !pointsRef.current.geometry || !materialRef.current) return;

    timeRef.current += delta * ANIMATION_SPEED;
    materialRef.current.uniforms.time.value = timeRef.current;
    materialRef.current.uniforms.mousePos.value.set(
      mousePosition.current.x,
      mousePosition.current.y
    );

    const positions = pointsRef.current.geometry.attributes.position.array;
    const originalPositions = originalPositionsRef.current;

    // Convert mouse position to world coordinates
    const mouseX = mousePosition.current.x * viewport.width * 0.5;
    const mouseY = -mousePosition.current.y * viewport.height * 0.5;

    const influenceRadius = MOUSE_INFLUENCE_RADIUS * 15;

    for (let i = 0; i < DOT_COUNT; i++) {
      const i3 = i * 3;
      const originalX = originalPositions[i3];
      const originalY = originalPositions[i3 + 1];
      const originalZ = originalPositions[i3 + 2];

      // Calculate distance from mouse
      const dx = originalX - mouseX;
      const dy = originalY - mouseY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Time-based wave animation
      const waveX = Math.sin(timeRef.current + originalX * 0.01) * 0.5;
      const waveY = Math.cos(timeRef.current + originalY * 0.01) * 0.5;

      // Mouse influence (circular masking effect)
      let mouseInfluence = 0;
      if (distance < influenceRadius) {
        const influence = 1 - distance / influenceRadius;
        mouseInfluence = influence * influence; // Smooth falloff
      }

      // Combine time-based animation with mouse influence
      const offsetX = waveX + dx * mouseInfluence * 0.3;
      const offsetY = waveY + dy * mouseInfluence * 0.3;
      const offsetZ = originalZ + Math.sin(timeRef.current * 0.5 + i * 0.01) * 2 * (1 - mouseInfluence * 0.5);

      positions[i3] = originalX + offsetX;
      positions[i3 + 1] = originalY + offsetY;
      positions[i3 + 2] = offsetZ;
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef} geometry={geometry} material={material} frustumCulled={false} />
  );
}

export function DotMatrixBackground() {
  const { theme } = useTheme();
  const mousePosition = useRef({ x: 0, y: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleMouseMove = (event) => {
      // Normalize mouse position to -1 to 1 range
      mousePosition.current = {
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: -(event.clientY / window.innerHeight) * 2 + 1,
      };
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 -z-10 w-full h-full overflow-hidden pointer-events-none">
      <div
        className="absolute inset-0 transition-colors duration-700"
        style={{
          background:
            theme === "dark"
              ? "linear-gradient(135deg, rgba(2, 6, 23, 0.96), rgba(17, 94, 89, 0.85))"
              : "linear-gradient(135deg, rgba(241, 245, 249, 0.96), rgba(219, 234, 254, 0.9))",
        }}
      />
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            theme === "dark"
              ? "linear-gradient(rgba(148, 163, 184, 0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(148, 163, 184, 0.08) 1px, transparent 1px)"
              : "linear-gradient(rgba(148, 163, 184, 0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(148, 163, 184, 0.12) 1px, transparent 1px)",
          backgroundSize: "160px 160px",
          mixBlendMode: theme === "dark" ? "screen" : "multiply",
        }}
      />
      <Canvas
        camera={{ position: [0, 0, 20], fov: 75 }}
        style={{ background: "transparent", width: "100%", height: "100%" }}
        gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
        dpr={Math.min(window.devicePixelRatio, 2)}
      >
        <ambientLight intensity={0.5} />
        <DotParticles mousePosition={mousePosition} />
      </Canvas>
    </div>
  );
}

