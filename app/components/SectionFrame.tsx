"use client";
import { ReactNode } from "react";

function Cross({ color }: { color: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      {/* Vertical arm */}
      <line x1="10" y1="0" x2="10" y2="20" stroke={color} strokeWidth="1.2" />
      {/* Horizontal arm */}
      <line x1="0" y1="10" x2="20" y2="10" stroke={color} strokeWidth="1.2" />
    </svg>
  );
}

interface Props {
  children: ReactNode;
  inset?: string;
}

export default function SectionFrame({ children, inset = "5%" }: Props) {
  const lineColor = "rgba(201,168,76,0.32)";
  const crossColor = "rgba(201,168,76,0.72)";
  const z = 50;

  return (
    <div style={{ position: "relative" }}>

      {/* Left vertical rail */}
      <div style={{
        position: "absolute", top: 0, bottom: 0, left: inset,
        width: 1, background: lineColor,
        zIndex: z, pointerEvents: "none",
      }} />

      {/* Right vertical rail */}
      <div style={{
        position: "absolute", top: 0, bottom: 0, right: inset,
        width: 1, background: lineColor,
        zIndex: z, pointerEvents: "none",
      }} />

      {/* Top horizontal */}
      <div style={{
        position: "absolute", top: 0, left: inset, right: inset,
        height: 1, background: lineColor,
        zIndex: z, pointerEvents: "none",
      }} />

      {/* Bottom horizontal */}
      <div style={{
        position: "absolute", bottom: 0, left: inset, right: inset,
        height: 1, background: lineColor,
        zIndex: z, pointerEvents: "none",
      }} />

      {/* Corners — centered on the intersection point */}
      <div style={{ position: "absolute", top: -10, left: `calc(${inset} - 10px)`, zIndex: z, pointerEvents: "none" }}>
        <Cross color={crossColor} />
      </div>
      <div style={{ position: "absolute", top: -10, right: `calc(${inset} - 10px)`, zIndex: z, pointerEvents: "none" }}>
        <Cross color={crossColor} />
      </div>
      <div style={{ position: "absolute", bottom: -10, left: `calc(${inset} - 10px)`, zIndex: z, pointerEvents: "none" }}>
        <Cross color={crossColor} />
      </div>
      <div style={{ position: "absolute", bottom: -10, right: `calc(${inset} - 10px)`, zIndex: z, pointerEvents: "none" }}>
        <Cross color={crossColor} />
      </div>

      {children}
    </div>
  );
}
