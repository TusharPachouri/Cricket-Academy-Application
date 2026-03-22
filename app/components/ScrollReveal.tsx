"use client";
import { motion, useInView } from "framer-motion";
import { useRef, ReactNode } from "react";

type Direction = "up" | "down" | "left" | "right" | "scale";

interface Props {
  children: ReactNode;
  delay?: number;
  direction?: Direction;
  once?: boolean;
  className?: string;
}

export default function ScrollReveal({
  children,
  delay = 0,
  direction = "up",
  once = true,
  className,
}: Props) {
  const ref = useRef(null);
  const inView = useInView(ref, { once, amount: 0.12 });

  const initial = {
    opacity: 0,
    filter: "blur(10px)",
    y: direction === "up" ? 48 : direction === "down" ? -48 : 0,
    x: direction === "left" ? 48 : direction === "right" ? -48 : 0,
    scale: direction === "scale" ? 0.88 : 1,
  };

  const animate = {
    opacity: 1,
    filter: "blur(0px)",
    y: 0,
    x: 0,
    scale: 1,
    transition: {
      duration: 0.75,
      delay,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  };

  return (
    <motion.div
      ref={ref}
      initial={initial}
      animate={inView ? animate : initial}
      className={className}
    >
      {children}
    </motion.div>
  );
}
