"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { navSections } from "@/lib/data";

/**
 * Navigation as a rail of dots rather than a bar of links — vertical down the
 * right edge on a desktop (labels slide out on hover), and a slim glass pill
 * along the bottom on a phone.
 */
export default function Dock({ visible }: { visible: boolean }) {
  const [active, setActive] = useState(navSections[0].id);

  useEffect(() => {
    const sections = navSections
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => el !== null);
    if (!sections.length) return;

    // Whichever section owns the middle band of the viewport wins.
    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (hit) setActive(hit.target.id);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.25, 0.5, 1] },
    );

    sections.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <>
      {/* desktop: vertical rail */}
      <motion.nav
        aria-label="Sections"
        className="fixed top-1/2 right-6 z-60 hidden -translate-y-1/2 md:block"
        initial={{ opacity: 0, x: 24 }}
        animate={visible ? { opacity: 1, x: 0 } : { opacity: 0, x: 24 }}
        transition={{ duration: 0.7, delay: visible ? 0.8 : 0 }}
      >
        <ul className="flex flex-col items-end gap-5">
          {navSections.map((s) => {
            const on = active === s.id;
            return (
              <li key={s.id}>
                <a href={`#${s.id}`} className="group flex items-center justify-end gap-3">
                  <span
                    className={`font-bride-label text-[0.44rem] whitespace-nowrap transition-all duration-500 ${
                      on
                        ? "text-champagne opacity-100"
                        : "text-blush-200/60 opacity-0 group-hover:opacity-100"
                    }`}
                  >
                    {s.label}
                  </span>
                  <span className="relative flex size-2.5 items-center justify-center">
                    <span
                      className={`block rounded-full transition-all duration-500 ${
                        on
                          ? "size-2.5 bg-champagne"
                          : "size-1.5 bg-blush-200/35 group-hover:bg-rosegold"
                      }`}
                    />
                    {on && (
                      <motion.span
                        layoutId="bride-dot-ring"
                        className="absolute inset-[-6px] rounded-full border border-champagne/45"
                        transition={{ type: "spring", stiffness: 280, damping: 26 }}
                      />
                    )}
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
      </motion.nav>

      {/* phone: bottom pill */}
      <motion.nav
        aria-label="Sections"
        className="fixed bottom-5 left-1/2 z-60 -translate-x-1/2 md:hidden"
        initial={{ opacity: 0, y: 24 }}
        animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
        transition={{ duration: 0.7, delay: visible ? 0.8 : 0 }}
      >
        <ul className="glass-panel flex items-center gap-1 rounded-full px-3 py-2.5">
          {navSections.map((s) => {
            const on = active === s.id;
            return (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  aria-label={s.label}
                  aria-current={on ? "true" : undefined}
                  className="relative flex size-8 items-center justify-center"
                >
                  <span
                    className={`block rounded-full transition-all duration-500 ${
                      on ? "size-2 bg-champagne" : "size-1.5 bg-blush-200/35"
                    }`}
                  />
                  {on && (
                    <motion.span
                      layoutId="bride-dot-pill"
                      className="absolute inset-0 rounded-full bg-champagne/12"
                      transition={{ type: "spring", stiffness: 300, damping: 28 }}
                    />
                  )}
                </a>
              </li>
            );
          })}
        </ul>
      </motion.nav>
    </>
  );
}
