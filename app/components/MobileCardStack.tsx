"use client";
import { Children, ReactNode } from "react";
import { motion } from "framer-motion";

interface Props {
  children: ReactNode;
  topOffset?: number;
}

export default function MobileCardStack({ children, topOffset = 72 }: Props) {
  const items = Children.toArray(children);
  return (
    <div className="ms-wrap">
      {items.map((child, i) => (
        <motion.div
          key={i}
          className="ms-card"
          style={{ zIndex: i + 1, top: topOffset } as React.CSSProperties}
          initial={{ y: 80, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true, amount: 0.1 }}
        >
          {child}
        </motion.div>
      ))}
    </div>
  );
}
