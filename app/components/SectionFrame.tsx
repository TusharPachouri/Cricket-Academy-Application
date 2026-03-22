"use client";
import { ReactNode } from "react";

function Cross({ color }: { color: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <line x1="10" y1="0" x2="10" y2="20" stroke={color} strokeWidth="1.2" />
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
    <div
      className="section-frame"
      style={{ position: "relative", "--sf-inset": inset } as React.CSSProperties}
    >
      {/* Left vertical rail */}
      <div style={{
        position: "absolute", top: 0, bottom: 0,
        left: "var(--sf-inset)",
        width: 1, background: lineColor,
        zIndex: z, pointerEvents: "none",
      }} />

      {/* Right vertical rail */}
      <div style={{
        position: "absolute", top: 0, bottom: 0,
        right: "var(--sf-inset)",
        width: 1, background: lineColor,
        zIndex: z, pointerEvents: "none",
      }} />

      {/* Top horizontal */}
      <div style={{
        position: "absolute", top: 0,
        left: "var(--sf-inset)", right: "var(--sf-inset)",
        height: 1, background: lineColor,
        zIndex: z, pointerEvents: "none",
      }} />

      {/* Bottom horizontal */}
      <div style={{
        position: "absolute", bottom: 0,
        left: "var(--sf-inset)", right: "var(--sf-inset)",
        height: 1, background: lineColor,
        zIndex: z, pointerEvents: "none",
      }} />

      {/* Top-left cross */}
      <div style={{ position: "absolute", top: -10, left: "calc(var(--sf-inset) - 10px)", zIndex: z, pointerEvents: "none" }}>
        <Cross color={crossColor} />
      </div>
      {/* Top-right cross */}
      <div style={{ position: "absolute", top: -10, right: "calc(var(--sf-inset) - 10px)", zIndex: z, pointerEvents: "none" }}>
        <Cross color={crossColor} />
      </div>
      {/* Bottom-left cross */}
      <div style={{ position: "absolute", bottom: -10, left: "calc(var(--sf-inset) - 10px)", zIndex: z, pointerEvents: "none" }}>
        <Cross color={crossColor} />
      </div>
      {/* Bottom-right cross */}
      <div style={{ position: "absolute", bottom: -10, right: "calc(var(--sf-inset) - 10px)", zIndex: z, pointerEvents: "none" }}>
        <Cross color={crossColor} />
      </div>

      {children}
    </div>
  );
}
