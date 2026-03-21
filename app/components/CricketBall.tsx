"use client";
import { useEffect, useRef } from "react";

export default function CricketBall() {
  const svgRef = useRef<SVGSVGElement>(null);
  const seamGroupRef = useRef<SVGGElement>(null);
  const isDragging = useRef(false);
  const lastX = useRef(0);
  const lastY = useRef(0);
  const rotX = useRef(0);
  const rotY = useRef(0);
  const velX = useRef(0);
  const velY = useRef(0);
  const rafRef = useRef<number>(0);
  const autoRotateRef = useRef(true);

  useEffect(() => {
    const svg = svgRef.current;
    const seamGroup = seamGroupRef.current;
    if (!svg || !seamGroup) return;

    let autoAngle = 0;

    const tick = () => {
      if (autoRotateRef.current && !isDragging.current) {
        autoAngle += 0.3;
        rotY.current = autoAngle;
      } else if (!isDragging.current) {
        velX.current *= 0.96;
        velY.current *= 0.96;
        rotX.current += velX.current;
        rotY.current += velY.current;
        autoAngle = rotY.current;
        if (Math.abs(velX.current) < 0.01 && Math.abs(velY.current) < 0.01) {
          autoRotateRef.current = true;
        }
      }

      const angleY = (rotY.current * Math.PI) / 180;
      const cosY = Math.cos(angleY);
      const sinY = Math.sin(angleY);
      const offsetX = sinY * 40;
      const scaleX = Math.abs(cosY);

      seamGroup.style.transform = `translateX(${offsetX}px) scaleX(${0.3 + scaleX * 0.7})`;

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    const onMouseDown = (e: MouseEvent) => {
      isDragging.current = true;
      autoRotateRef.current = false;
      lastX.current = e.clientX;
      lastY.current = e.clientY;
      velX.current = 0;
      velY.current = 0;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      const dx = e.clientX - lastX.current;
      const dy = e.clientY - lastY.current;
      velY.current = dx * 0.4;
      velX.current = dy * 0.4;
      rotY.current += dx * 0.4;
      rotX.current += dy * 0.4;
      lastX.current = e.clientX;
      lastY.current = e.clientY;
    };

    const onMouseUp = () => {
      isDragging.current = false;
    };

    svg.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    const onTouchStart = (e: TouchEvent) => {
      isDragging.current = true;
      autoRotateRef.current = false;
      lastX.current = e.touches[0].clientX;
      lastY.current = e.touches[0].clientY;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!isDragging.current) return;
      const dx = e.touches[0].clientX - lastX.current;
      const dy = e.touches[0].clientY - lastY.current;
      velY.current = dx * 0.4;
      velX.current = dy * 0.4;
      rotY.current += dx * 0.4;
      rotX.current += dy * 0.4;
      lastX.current = e.touches[0].clientX;
      lastY.current = e.touches[0].clientY;
    };
    const onTouchEnd = () => { isDragging.current = false; };

    svg.addEventListener("touchstart", onTouchStart);
    svg.addEventListener("touchmove", onTouchMove);
    svg.addEventListener("touchend", onTouchEnd);

    return () => {
      cancelAnimationFrame(rafRef.current);
      svg.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      svg.removeEventListener("touchstart", onTouchStart);
      svg.removeEventListener("touchmove", onTouchMove);
      svg.removeEventListener("touchend", onTouchEnd);
    };
  }, []);

  // Generate stitch marks along the seam
  const stitches = Array.from({ length: 26 }).map((_, i) => {
    const t = i / 25;
    const x = 16 + t * 268;
    const y = 150 + Math.sin(t * Math.PI * 2) * 38;
    const angle = i % 2 === 0 ? 40 : -40;
    const rad = (angle * Math.PI) / 180;
    const len = 7;
    return { x, y, rad, len, key: i };
  });

  return (
    <div className="ball-wrapper">
      {/* Ambient glow */}
      <div
        className="ball-glow animate-pulse-glow"
        style={{
          position: "absolute",
          inset: "-20%",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(170,255,0,0.25) 0%, transparent 65%)",
          opacity: 0.4,
          transition: "opacity 0.3s ease",
          pointerEvents: "none",
        }}
      />

      {/* Orbit rings */}
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", perspective: "600px", pointerEvents: "none" }}>
        <div className="orbit-ring-1" style={{ width: "110%", height: "110%", position: "absolute" }}>
          <svg width="100%" height="100%" viewBox="0 0 340 340" fill="none">
            <ellipse cx="170" cy="170" rx="165" ry="28" stroke="#AAFF00" strokeWidth="1.5" strokeDasharray="6 4" opacity="0.6" />
          </svg>
        </div>
        <div className="orbit-ring-2" style={{ width: "100%", height: "100%", position: "absolute" }}>
          <svg width="100%" height="100%" viewBox="0 0 310 310" fill="none">
            <ellipse cx="155" cy="155" rx="150" ry="22" stroke="#555" strokeWidth="1" strokeDasharray="4 6" opacity="0.3" />
          </svg>
        </div>
      </div>

      {/* Drop shadow */}
      <div style={{
        position: "absolute",
        bottom: "2%",
        left: "50%",
        transform: "translateX(-50%)",
        width: "65%",
        height: "8%",
        background: "rgba(0,0,0,0.3)",
        borderRadius: "50%",
        filter: "blur(14px)",
        pointerEvents: "none",
      }} />

      {/* The Cricket Ball SVG */}
      <div className="animate-float" style={{ width: "87.5%", height: "87.5%" }}>
        <svg
          ref={svgRef}
          viewBox="0 0 300 300"
          width="100%"
          height="100%"
          style={{ cursor: "grab", display: "block" }}
        >
          <defs>
            <clipPath id="ballClip">
              <circle cx="150" cy="150" r="140" />
            </clipPath>

            {/* Main leather gradient — deep crimson red with warm highlight */}
            <radialGradient id="leatherMain" cx="38%" cy="32%" r="68%" fx="35%" fy="28%">
              <stop offset="0%" stopColor="#e8453a" />
              <stop offset="18%" stopColor="#d43225" />
              <stop offset="35%" stopColor="#c0200a" />
              <stop offset="55%" stopColor="#9a1208" />
              <stop offset="75%" stopColor="#6b0c04" />
              <stop offset="100%" stopColor="#3a0602" />
            </radialGradient>

            {/* Left hemisphere — slightly lighter (newer leather) */}
            <radialGradient id="leftLeather" cx="28%" cy="38%" r="65%">
              <stop offset="0%" stopColor="#d83820" stopOpacity="0.7" />
              <stop offset="60%" stopColor="#a01508" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#5a0a04" stopOpacity="0.1" />
            </radialGradient>

            {/* Right hemisphere — darker (worn leather) */}
            <radialGradient id="rightLeather" cx="72%" cy="62%" r="55%">
              <stop offset="0%" stopColor="#4a0804" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#1a0200" stopOpacity="0.2" />
            </radialGradient>

            {/* Specular highlight — top-left warm white */}
            <radialGradient id="specHighlight" cx="32%" cy="25%" r="30%">
              <stop offset="0%" stopColor="#fff6ee" stopOpacity="0.65" />
              <stop offset="40%" stopColor="#ffcaa8" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#ff8844" stopOpacity="0" />
            </radialGradient>

            {/* Secondary specular — soft edge highlight */}
            <radialGradient id="specSecondary" cx="70%" cy="72%" r="35%">
              <stop offset="0%" stopColor="#ff9966" stopOpacity="0.15" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>

            {/* Seam gold gradient */}
            <linearGradient id="seamGold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffe0a0" />
              <stop offset="30%" stopColor="#d4a040" />
              <stop offset="60%" stopColor="#b8862c" />
              <stop offset="100%" stopColor="#8a6418" />
            </linearGradient>

            {/* Seam shadow */}
            <linearGradient id="seamShadow" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3a0602" stopOpacity="0.4" />
              <stop offset="50%" stopColor="#3a0602" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#3a0602" stopOpacity="0.3" />
            </linearGradient>

            {/* Rim light gradient */}
            <radialGradient id="rimLight" cx="50%" cy="50%" r="50%">
              <stop offset="85%" stopColor="transparent" />
              <stop offset="100%" stopColor="rgba(255,160,80,0.2)" />
            </radialGradient>

            {/* Leather grain texture filter */}
            <filter id="leatherGrain" x="0%" y="0%" width="100%" height="100%">
              <feTurbulence type="fractalNoise" baseFrequency="1.2" numOctaves="6" seed="3" result="grain" />
              <feColorMatrix type="saturate" values="0" in="grain" result="grainBW" />
              <feBlend mode="overlay" in="SourceGraphic" in2="grainBW" result="textured" />
              <feComposite in="textured" in2="SourceGraphic" operator="atop" />
            </filter>

            {/* Subtle blur for seam depth */}
            <filter id="seamBlur">
              <feGaussianBlur stdDeviation="0.4" />
            </filter>

            {/* Inner shadow for depth */}
            <filter id="innerShadow" x="-10%" y="-10%" width="120%" height="120%">
              <feComponentTransfer in="SourceAlpha">
                <feFuncA type="table" tableValues="1 0" />
              </feComponentTransfer>
              <feGaussianBlur stdDeviation="8" />
              <feOffset dx="2" dy="4" result="offsetblur" />
              <feFlood floodColor="#1a0200" floodOpacity="0.5" result="color" />
              <feComposite in2="offsetblur" operator="in" />
              <feComposite in2="SourceAlpha" operator="in" />
              <feMerge>
                <feMergeNode in="SourceGraphic" />
                <feMergeNode />
              </feMerge>
            </filter>
          </defs>

          {/* ── BALL BODY ── */}
          <g filter="url(#leatherGrain)">
            {/* Base leather */}
            <circle cx="150" cy="150" r="140" fill="url(#leatherMain)" />

            {/* Hemisphere color variation */}
            <path
              d="M150,10 A140,140 0 0,0 150,290 Q128,275 115,220 Q100,170 115,150 Q100,130 115,80 Q128,25 150,10 Z"
              fill="url(#leftLeather)"
              clipPath="url(#ballClip)"
            />
            <path
              d="M150,10 A140,140 0 0,1 150,290 Q172,275 185,220 Q200,170 185,150 Q200,130 185,80 Q172,25 150,10 Z"
              fill="url(#rightLeather)"
              clipPath="url(#ballClip)"
            />
          </g>

          {/* ── SEAM SYSTEM ── */}
          <g ref={seamGroupRef} clipPath="url(#ballClip)" style={{ transformOrigin: "150px 150px" }}>
            {/* Seam shadow (slightly offset beneath the seam) */}
            <path
              d="M 10,153 C 55,108 100,198 150,153 C 200,108 245,198 290,153"
              fill="none"
              stroke="url(#seamShadow)"
              strokeWidth="8"
              strokeLinecap="round"
              opacity="0.5"
            />

            {/* Primary seam — raised S-curve */}
            <path
              d="M 10,150 C 55,105 100,195 150,150 C 200,105 245,195 290,150"
              fill="none"
              stroke="url(#seamGold)"
              strokeWidth="4.5"
              strokeLinecap="round"
            />

            {/* Seam highlight (thin bright line on top) */}
            <path
              d="M 10,149 C 55,104 100,194 150,149 C 200,104 245,194 290,149"
              fill="none"
              stroke="#ffe8b8"
              strokeWidth="1"
              strokeLinecap="round"
              opacity="0.6"
            />

            {/* Stitch marks */}
            {stitches.map((s) => (
              <g key={s.key}>
                <line
                  x1={s.x - Math.cos(s.rad) * s.len / 2}
                  y1={s.y - Math.sin(s.rad) * s.len / 2}
                  x2={s.x + Math.cos(s.rad) * s.len / 2}
                  y2={s.y + Math.sin(s.rad) * s.len / 2}
                  stroke="#c89830"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
                {/* Stitch shadow */}
                <line
                  x1={s.x - Math.cos(s.rad) * s.len / 2 + 0.5}
                  y1={s.y - Math.sin(s.rad) * s.len / 2 + 0.8}
                  x2={s.x + Math.cos(s.rad) * s.len / 2 + 0.5}
                  y2={s.y + Math.sin(s.rad) * s.len / 2 + 0.8}
                  stroke="#5a3808"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  opacity="0.35"
                />
              </g>
            ))}

            {/* Secondary seam — pole to pole */}
            <path
              d="M 150,10 C 108,55 195,100 150,150 C 108,200 195,245 150,290"
              fill="none"
              stroke="#9a7020"
              strokeWidth="2.5"
              strokeLinecap="round"
              opacity="0.5"
            />
          </g>

          {/* ── LIGHTING & HIGHLIGHTS ── */}
          {/* Primary specular highlight */}
          <ellipse cx="105" cy="90" rx="60" ry="48" fill="url(#specHighlight)" />

          {/* Secondary bounce light */}
          <ellipse cx="210" cy="215" rx="40" ry="30" fill="url(#specSecondary)" />

          {/* Inner shadow for 3D depth */}
          <circle cx="150" cy="150" r="140" fill="none" filter="url(#innerShadow)" opacity="0.6" />

          {/* Rim light — warm edge glow */}
          <circle cx="150" cy="150" r="138" fill="none" stroke="rgba(255,160,80,0.12)" strokeWidth="6" />

          {/* Subtle bottom ambient shadow inside ball */}
          <ellipse cx="150" cy="230" rx="100" ry="50" fill="rgba(26,2,0,0.15)" clipPath="url(#ballClip)" />
        </svg>
      </div>
    </div>
  );
}
