"use client";
import { ReactNode } from "react";

function Cross({ color }: { color: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <line x1="7" y1="0" x2="7" y2="14" stroke={color} strokeWidth="1" />
      <line x1="0" y1="7" x2="14" y2="7" stroke={color} strokeWidth="1" />
    </svg>
  );
}

interface Props {
  children: ReactNode;
  inset?: string;
}

/**
 * Single continuous rail — two vertical gold lines with crosshairs
 * only at the very top and bottom. No horizontal lines between sections.
 */
export default function SectionFrame({ children, inset = "5%" }: Props) {
  const lineColor = "rgba(201,168,76,0.28)";
  const crossColor = "rgba(201,168,76,0.65)";
  const z = 50;

  return (
    <div style={{ position: "relative" }}>

      {/* Left vertical rail — full height */}
      <div style={{
        position: "absolute", top: 0, bottom: 0, left: inset,
        width: 1,
        background: `linear-gradient(to bottom, transparent 0%, ${lineColor} 2%, ${lineColor} 98%, transparent 100%)`,
        zIndex: z, pointerEvents: "none",
      }} />

      {/* Right vertical rail — full height */}
      <div style={{
        position: "absolute", top: 0, bottom: 0, right: inset,
        width: 1,
        background: `linear-gradient(to bottom, transparent 0%, ${lineColor} 2%, ${lineColor} 98%, transparent 100%)`,
        zIndex: z, pointerEvents: "none",
      }} />

      {/* Top horizontal line */}
      <div style={{
        position: "absolute", top: 0, left: inset, right: inset,
        height: 1, background: lineColor,
        zIndex: z, pointerEvents: "none",
      }} />

      {/* Bottom horizontal line */}
      <div style={{
        position: "absolute", bottom: 0, left: inset, right: inset,
        height: 1, background: lineColor,
        zIndex: z, pointerEvents: "none",
      }} />

      {/* Top-left cross */}
      <div style={{ position: "absolute", top: -7, left: `calc(${inset} - 7px)`, zIndex: z, pointerEvents: "none" }}>
        <Cross color={crossColor} />
      </div>
      {/* Top-right cross */}
      <div style={{ position: "absolute", top: -7, right: `calc(${inset} - 7px)`, zIndex: z, pointerEvents: "none" }}>
        <Cross color={crossColor} />
      </div>
      {/* Bottom-left cross */}
      <div style={{ position: "absolute", bottom: -7, left: `calc(${inset} - 7px)`, zIndex: z, pointerEvents: "none" }}>
        <Cross color={crossColor} />
      </div>
      {/* Bottom-right cross */}
      <div style={{ position: "absolute", bottom: -7, right: `calc(${inset} - 7px)`, zIndex: z, pointerEvents: "none" }}>
        <Cross color={crossColor} />
      </div>

      {children}
    </div>
  );
}
