"use client";

import { useRef } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  wrap,
} from "framer-motion";

/**
 * A running ribbon of text that reacts to the scroll: it drifts on its own,
 * speeds up and skews in whichever direction the guest is scrolling, and
 * settles back when they stop. Used as the band under the hero and again
 * above the footer.
 */
export default function Marquee({
  items,
  baseVelocity = 22,
  className = "",
}: {
  items: string[];
  /** px per second at rest; negative runs the other way. */
  baseVelocity?: number;
  className?: string;
}) {
  // A ribbon that never stops moving is exactly what reduced-motion is for;
  // there it simply sits still and reads as a plain band of text.
  const still = useReducedMotion();
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smooth = useSpring(scrollVelocity, { damping: 50, stiffness: 400 });
  const factor = useTransform(smooth, [-1800, 0, 1800], [-4, 0, 4], { clamp: false });
  const skew = useTransform(smooth, [-1800, 0, 1800], [-5, 0, 5], { clamp: true });

  // Four copies, so wrapping at -25% always leaves the strip fully covered.
  const x = useTransform(baseX, (v) => `${wrap(-25, 0, v)}%`);
  const direction = useRef(1);

  useAnimationFrame((_, delta) => {
    if (still) return;
    let move = (direction.current * baseVelocity * delta) / 1000;
    const f = factor.get();
    // Scrolling down pushes the ribbon one way, scrolling up the other.
    if (f < 0) direction.current = -1;
    else if (f > 0) direction.current = 1;
    move += move * Math.abs(f);
    baseX.set(baseX.get() + move / 12);
  });

  return (
    <div className={`relative overflow-hidden ${className}`} aria-hidden>
      <motion.div className="flex whitespace-nowrap" style={{ x, skewX: skew }}>
        {Array.from({ length: 4 }).map((_, copy) => (
          <span key={copy} className="flex shrink-0 items-center">
            {items.map((item, i) => (
              <span key={`${copy}-${i}`} className="flex items-center">
                <span className="font-bride-label px-6 text-[0.6rem] text-champagne/70 sm:px-9 sm:text-[0.7rem]">
                  {item}
                </span>
                <span className="size-1 rotate-45 bg-rosegold/60" />
              </span>
            ))}
          </span>
        ))}
      </motion.div>
    </div>
  );
}
