"use client";
import { useRef, useEffect, Suspense, useMemo, useCallback } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, Environment, ContactShadows } from "@react-three/drei";
import * as THREE from "three";

interface BallProps {
  scrollY: React.RefObject<number>;
  mousePos: React.RefObject<{ x: number; y: number }>;
  isDragging: React.RefObject<boolean>;
  dragDelta: React.RefObject<{ x: number; y: number }>;
}

function Ball({ scrollY, mousePos, isDragging, dragDelta }: BallProps) {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF("/cricket_ball_sports_white..glb");
  const { viewport } = useThree();

  const bounceRef = useRef({ active: false, t: 0 });
  const dragRotRef = useRef({ x: 0, y: 0 });
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

  let targetDiameter: number;
  if (viewport.width < 3)      targetDiameter = viewport.width * 0.85;
  else if (viewport.width < 5) targetDiameter = viewport.width * 0.78;
  else if (viewport.width < 8) targetDiameter = viewport.width * 0.65;
  else                          targetDiameter = 5.2;
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
      // Spin momentum with friction
      dragRotRef.current.x += spinRef.current.x;
      dragRotRef.current.y += spinRef.current.y;
      spinRef.current.x *= 0.95;
      spinRef.current.y *= 0.95;
      if (Math.abs(spinRef.current.x) < 0.0001) spinRef.current.x = 0;
      if (Math.abs(spinRef.current.y) < 0.0001) spinRef.current.y = 0;

      // Idle auto-rotation when no spin
      if (spinRef.current.x === 0 && spinRef.current.y === 0) {
        dragRotRef.current.y += 0.005;
      }
    }

    // Mouse-follow parallax tilt
    const mx = mousePos.current?.x ?? 0;
    const my = mousePos.current?.y ?? 0;
    const tiltX = my * 0.15;
    const tiltY = mx * 0.15;

    // Scroll-based tilt
    const progress = scrollY.current ?? 0;
    const scrollTilt = progress * Math.PI * 0.4;

    // Combine rotations with smooth lerp
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

    // Bounce on click
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
      groupRef.current.position.y = Math.sin(Date.now() * 0.0008) * 0.08;
    }
  });

  return (
    <group
      ref={groupRef}
      scale={scale}
      onClick={(e) => {
        e.stopPropagation();
        bounceRef.current.active = true;
        bounceRef.current.t = 0;
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
  if (viewport.width < 3)      { shadowY = -1.4; shadowScale = viewport.width * 1.0; }
  else if (viewport.width < 5) { shadowY = -1.6; shadowScale = viewport.width * 0.95; }
  else if (viewport.width < 8) { shadowY = -2.0; shadowScale = viewport.width * 0.75; }
  else                          { shadowY = -2.2; shadowScale = 5.5; }
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

export default function CricketBall3D() {
  const scrollRef = useRef(0);
  const mousePosRef = useRef({ x: 0, y: 0 });
  const isDraggingRef = useRef(false);
  const dragDeltaRef = useRef({ x: 0, y: 0 });
  const lastPointerRef = useRef({ x: 0, y: 0 });

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

  // Mouse-follow for parallax tilt
  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      mousePosRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mousePosRef.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("mousemove", onMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMouseMove);
  }, []);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    isDraggingRef.current = true;
    lastPointerRef.current = { x: e.clientX, y: e.clientY };
    dragDeltaRef.current = { x: 0, y: 0 };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    document.body.style.cursor = "grabbing";
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    dragDeltaRef.current.x += e.clientX - lastPointerRef.current.x;
    dragDeltaRef.current.y += e.clientY - lastPointerRef.current.y;
    lastPointerRef.current = { x: e.clientX, y: e.clientY };
  }, []);

  const onPointerUp = useCallback(() => {
    isDraggingRef.current = false;
    document.body.style.cursor = "none";
  }, []);

  return (
    <div
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
          />
          <SceneResponsiveShadow />
        </Canvas>
      </Suspense>
    </div>
  );
}

useGLTF.preload("/cricket_ball_sports_white..glb");
