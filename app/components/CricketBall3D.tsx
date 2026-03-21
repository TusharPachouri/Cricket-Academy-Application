"use client";
import { useRef, useEffect, Suspense, useMemo, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, Environment, ContactShadows } from "@react-three/drei";
import * as THREE from "three";

function Ball({ scrollY }: { scrollY: React.RefObject<number> }) {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF("/cricket_ball_sports_white..glb");
  const { viewport } = useThree();

  // Bounce state — drives a spring animation in useFrame
  const bounceRef = useRef({ active: false, t: 0 });

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

  // 4-tier responsive scaling
  let targetDiameter: number;
  if (viewport.width < 3)      targetDiameter = viewport.width * 0.85;
  else if (viewport.width < 5) targetDiameter = viewport.width * 0.78;
  else if (viewport.width < 8) targetDiameter = viewport.width * 0.65;
  else                          targetDiameter = 5.2;
  const scale = maxDim > 0 ? targetDiameter / maxDim : 1;

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    // Continuous slow Y-axis rotation
    groupRef.current.rotation.y += 0.005;

    // Scroll-based X tilt
    const progress = scrollY.current ?? 0;
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      progress * Math.PI * 0.4,
      0.04
    );

    // Bounce animation on click
    if (bounceRef.current.active) {
      bounceRef.current.t += delta * 3.5;
      const t = bounceRef.current.t;
      // One full bounce: go up then come back down with easing
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
        bounceRef.current.active = true;
        bounceRef.current.t = 0;
      }}
      onPointerOver={() => { document.body.style.cursor = "pointer"; }}
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

  return (
    <div className="ball-3d-container" style={{ cursor: "pointer" }}>
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
          <Ball scrollY={scrollRef} />
          <SceneResponsiveShadow />
        </Canvas>
      </Suspense>
    </div>
  );
}

useGLTF.preload("/cricket_ball_sports_white..glb");
