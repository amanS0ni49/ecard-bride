"use client";

import { useEffect, useRef } from "react";

type Mote = {
  x: number;
  y: number;
  r: number;
  vx: number;
  vy: number;
  a: number;
  /** phase for the slow twinkle */
  p: number;
  hue: 0 | 1;
};

const COLOURS = ["240,212,156", "226,164,146"] as const;

/**
 * Suspended gold dust — the bride card's ambient layer.
 *
 * Deliberately not the groom card's falling petals: these motes hang in the
 * air, drift sideways, and twinkle. Density scales with the viewport so a
 * phone isn't pushing the same particle count as a desktop.
 */
export default function Dust({ className = "" }: { className?: string }) {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const el = canvas.current;
    if (!el) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduce.matches) return;

    const ctx = el.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let motes: Mote[] = [];
    let raf = 0;
    let running = true;

    const seed = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = el.clientWidth;
      h = el.clientHeight;
      el.width = Math.round(w * dpr);
      el.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.round(Math.min(110, Math.max(36, (w * h) / 16000)));
      motes = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: 0.5 + Math.random() * 1.7,
        vx: (Math.random() - 0.5) * 0.18,
        vy: -0.05 - Math.random() * 0.22,
        a: 0.2 + Math.random() * 0.5,
        p: Math.random() * Math.PI * 2,
        hue: Math.random() > 0.72 ? 1 : 0,
      }));
    };

    const frame = (t: number) => {
      if (!running) return;
      ctx.clearRect(0, 0, w, h);

      for (const m of motes) {
        m.x += m.vx;
        m.y += m.vy;
        // a touch of lateral sway so the drift never looks like a straight line
        m.x += Math.sin(t / 2600 + m.p) * 0.12;

        if (m.y < -8) {
          m.y = h + 8;
          m.x = Math.random() * w;
        }
        if (m.x < -8) m.x = w + 8;
        if (m.x > w + 8) m.x = -8;

        const twinkle = 0.55 + 0.45 * Math.sin(t / 900 + m.p);
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${COLOURS[m.hue]},${(m.a * twinkle).toFixed(3)})`;
        ctx.fill();

        // the brightest few get a soft bloom
        if (m.r > 1.6) {
          ctx.beginPath();
          ctx.arc(m.x, m.y, m.r * 3.4, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${COLOURS[m.hue]},${(m.a * twinkle * 0.07).toFixed(3)})`;
          ctx.fill();
        }
      }

      raf = requestAnimationFrame(frame);
    };

    seed();
    raf = requestAnimationFrame(frame);

    const onResize = () => seed();
    window.addEventListener("resize", onResize);

    // Stop burning frames while the card is in a background tab.
    const onVisibility = () => {
      running = document.visibilityState === "visible";
      if (running) raf = requestAnimationFrame(frame);
      else cancelAnimationFrame(raf);
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvas}
      className={`pointer-events-none absolute inset-0 size-full ${className}`}
      aria-hidden
    />
  );
}
