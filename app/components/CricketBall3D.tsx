"use client";
import { useRef, useEffect, Suspense, useMemo, useState, useCallback } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, Environment, ContactShadows } from "@react-three/drei";
import * as THREE from "three";

interface BallProps {
  scrollY: React.RefObject<number>;
  mousePos: React.RefObject<{ x: number; y: number }>;
  isDragging: React.RefObject<boolean>;
  dragDelta: React.RefObject<{ x: number; y: number }>;
  isDark: boolean;
}

function Ball({ scrollY, mousePos, isDragging, dragDelta, isDark }: BallProps) {
  const groupRef = useRef<THREE.Group>(null);
  const modelPath = isDark ? "/cricket_ball_sports..glb" : "/cricket_ball_sports_white..glb";
  const { scene } = useGLTF(modelPath);
  const { viewport } = useThree();

  // Bounce state — drives a spring animation in useFrame
  const bounceRef = useRef({ active: false, t: 0 });
  // Accumulated drag rotation
  const dragRotRef = useRef({ x: 0, y: 0 });
  // Spin momentum after drag release
  const spinRef = useRef({ x: 0, y: 0 });

  const { clonedScene, maxDim } = useMemo(() => {
    const s = scene.clone();
    s.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        if (mesh.material && (mesh.material as THREE.MeshStandardMaterial).isMeshStandardMaterial) {
          const mat = mesh.material as THREE.MeshStandardMaterial;
          mat.envMapIntensity = 0.9;
          mat.roughness = Math.min(mat.roughness, 0.4);
        }
      }
    });
    const box = new THREE.Box3().setFromObject(s);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    const mDim = Math.max(size.x, size.y, size.z);
    s.position.set(-center.x, -center.y, -center.z);
    return { clonedScene: s, maxDim: mDim };
  }, [scene]);

  // 5-tier responsive scaling (extra breakpoint for big monitors)
  let targetDiameter: number;
  if (viewport.width < 3)        targetDiameter = viewport.width * 1.50;
  else if (viewport.width < 5)   targetDiameter = viewport.width * 1.40;
  else if (viewport.width < 8)   targetDiameter = viewport.width * 0.65;
  else if (viewport.width < 12)  targetDiameter = 5.2;  // Laptop screen
  else                            targetDiameter = 9.0;  // Ultra big monitor
  const scale = maxDim > 0 ? targetDiameter / maxDim : 1;

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    // Drag-to-spin interaction
    if (isDragging.current) {
      dragRotRef.current.y += dragDelta.current.x * 0.008;
      dragRotRef.current.x += dragDelta.current.y * 0.008;
      spinRef.current.x = dragDelta.current.y * 0.008;
      spinRef.current.y = dragDelta.current.x * 0.008;
      dragDelta.current.x = 0;
      dragDelta.current.y = 0;
    } else {
      // Apply spin momentum with friction
      dragRotRef.current.x += spinRef.current.x;
      dragRotRef.current.y += spinRef.current.y;
      spinRef.current.x *= 0.95;
      spinRef.current.y *= 0.95;
      if (Math.abs(spinRef.current.x) < 0.0001) spinRef.current.x = 0;
      if (Math.abs(spinRef.current.y) < 0.0001) spinRef.current.y = 0;

      // Idle auto-rotation when no spin momentum
      if (spinRef.current.x === 0 && spinRef.current.y === 0) {
        dragRotRef.current.y += 0.005;
      }
    }

    // Mouse-follow tilt (subtle parallax effect)
    const mx = mousePos.current?.x ?? 0;
    const my = mousePos.current?.y ?? 0;
    const tiltX = my * 0.15;
    const tiltY = mx * 0.15;

    // Scroll-based X tilt
    const progress = scrollY.current ?? 0;
    const scrollTilt = progress * Math.PI * 0.4;

    // Combine rotations
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      dragRotRef.current.x + tiltX + scrollTilt,
      0.08
    );
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      dragRotRef.current.y + tiltY,
      0.08
    );

    // Bounce animation on click
    if (bounceRef.current.active) {
      bounceRef.current.t += delta * 3.5;
      const t = bounceRef.current.t;
      const bounceY = Math.sin(t * Math.PI) * 1.2;
      groupRef.current.position.y = bounceY;
      if (t >= 1) {
        bounceRef.current.active = false;
        bounceRef.current.t = 0;
        groupRef.current.position.y = 0;
      }
    } else {
      // Idle float
      groupRef.current.position.y = Math.sin(Date.now() * 0.0008) * 0.08;
    }
  });

  return (
    <group
      ref={groupRef}
      scale={scale}
      onClick={(e) => {
        e.stopPropagation();
        if (!isDragging.current) {
          bounceRef.current.active = true;
          bounceRef.current.t = 0;
        }
      }}
      onPointerOver={() => { document.body.style.cursor = "grab"; }}
      onPointerOut={() => { document.body.style.cursor = "none"; }}
    >
      <primitive object={clonedScene} />
    </group>
  );
}

function SceneResponsiveShadow() {
  const { viewport } = useThree();
  let shadowY: number;
  let shadowScale: number;
  if (viewport.width < 3)        { shadowY = -1.7; shadowScale = viewport.width * 1.7; }
  else if (viewport.width < 5)   { shadowY = -2.0; shadowScale = viewport.width * 1.6; }
  else if (viewport.width < 8)   { shadowY = -2.0; shadowScale = viewport.width * 0.75; }
  else if (viewport.width < 12)  { shadowY = -2.2; shadowScale = 5.5; }
  else                            { shadowY = -3.8; shadowScale = 10.0; }
  return (
    <ContactShadows
      position={[0, shadowY, 0]}
      opacity={0.45}
      scale={shadowScale}
      blur={2.2}
      far={5.0}
      color="#1a0a00"
    />
  );
}

function Loader() {
  return (
    <div className="ball-loader">
      <div className="ball-loader-spinner" />
    </div>
  );
}

export default function CricketBall3D({ isDark = false }: { isDark?: boolean }) {
  const scrollRef = useRef(0);
  const mousePosRef = useRef({ x: 0, y: 0 });
  const isDraggingRef = useRef(false);
  const dragDeltaRef = useRef({ x: 0, y: 0 });
  const lastPointerRef = useRef({ x: 0, y: 0 });
  const hasDraggedRef = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => {
      const hero = document.querySelector(".hero-section");
      if (!hero) return;
      const rect = hero.getBoundingClientRect();
      scrollRef.current = Math.max(0, Math.min(-rect.top / rect.height, 1));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Mouse-follow for parallax tilt (normalized -1 to 1)
  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      mousePosRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mousePosRef.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("mousemove", onMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMouseMove);
  }, []);

  // Drag-to-spin handlers
  const onPointerDown = useCallback((e: React.PointerEvent) => {
    isDraggingRef.current = true;
    hasDraggedRef.current = false;
    lastPointerRef.current = { x: e.clientX, y: e.clientY };
    dragDeltaRef.current = { x: 0, y: 0 };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    document.body.style.cursor = "grabbing";
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    const dx = e.clientX - lastPointerRef.current.x;
    const dy = e.clientY - lastPointerRef.current.y;
    if (Math.abs(dx) > 2 || Math.abs(dy) > 2) hasDraggedRef.current = true;
    dragDeltaRef.current.x += dx;
    dragDeltaRef.current.y += dy;
    lastPointerRef.current = { x: e.clientX, y: e.clientY };
  }, []);

  const onPointerUp = useCallback(() => {
    isDraggingRef.current = false;
    document.body.style.cursor = "none";
  }, []);

  return (
    <div
      ref={containerRef}
      className="ball-3d-container"
      style={{ cursor: "grab", touchAction: "none" }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
    >
      <Suspense fallback={<Loader />}>
        <Canvas
          camera={{ position: [0, 0, 7.5], fov: 45 }}
          gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
          dpr={[1, 2]}
          style={{ background: "transparent" }}
        >
          <ambientLight intensity={0.6} />
          <directionalLight position={[4, 6, 4]} intensity={1.6} castShadow />
          <directionalLight position={[-3, 2, -2]} intensity={0.5} color="#ffd090" />
          <pointLight position={[0, -2, 3]} intensity={0.35} color="#C9A84C" />
          <Environment preset="studio" />
          <Ball
            scrollY={scrollRef}
            mousePos={mousePosRef}
            isDragging={isDraggingRef}
            dragDelta={dragDeltaRef}
            isDark={isDark}
          />
          <SceneResponsiveShadow />
        </Canvas>
      </Suspense>
    </div>
  );
}

useGLTF.preload("/cricket_ball_sports_white..glb");
useGLTF.preload("/cricket_ball_sports..glb");
