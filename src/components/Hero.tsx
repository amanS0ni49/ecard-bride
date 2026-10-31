"use client";

import { useEffect, useRef } from "react";
import {
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { ArrowDown } from "lucide-react";
import { couple, meta } from "@/lib/data";
import Countdown from "./Countdown";
import Dust from "./Dust";
import Marquee from "./Marquee";
import { SplitText } from "./Ornaments";

const EASE = [0.16, 1, 0.3, 1] as const;

const fade = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 1, delay: 0.35 + i * 0.14, ease: EASE },
  }),
};

export default function Hero({ started }: { started: boolean }) {
  const ref = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const smooth = useSpring(scrollYProgress, { stiffness: 80, damping: 24, mass: 0.4 });

  // The two names pull apart as the guest scrolls away from the hero —
  // the arch opens up behind them and everything dims.
  const brideX = useTransform(smooth, [0, 1], ["0%", "-26%"]);
  const groomX = useTransform(smooth, [0, 1], ["0%", "26%"]);
  const centreFade = useTransform(smooth, [0, 0.55], [1, 0]);
  const archScale = useTransform(smooth, [0, 1], [1, 1.5]);
  const archFade = useTransform(smooth, [0, 0.8], [1, 0]);
  const lift = useTransform(smooth, [0, 1], [0, -90]);

  // Pointer parallax — the arch and the bloom lag behind the cursor slightly.
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 60, damping: 20 });
  const sy = useSpring(py, { stiffness: 60, damping: 20 });
  const archX = useTransform(sx, [-1, 1], [18, -18]);
  const archY = useTransform(sy, [-1, 1], [12, -12]);
  const bloomX = useTransform(sx, [-1, 1], [-40, 40]);
  const bloomY = useTransform(sy, [-1, 1], [-28, 28]);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)");
    if (!fine.matches) return;
    const onMove = (e: PointerEvent) => {
      px.set((e.clientX / window.innerWidth) * 2 - 1);
      py.set((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, [px, py]);

  const animate = started ? "show" : "hidden";

  return (
    <section
      ref={ref}
      id="home"
      className="relative flex min-h-dvh flex-col overflow-hidden bg-wine-950"
    >
      <div className="jaali pointer-events-none absolute inset-0 opacity-50" aria-hidden />

      {/* warm bloom behind the names, nudged by the pointer */}
      <motion.div
        style={{ x: bloomX, y: bloomY, opacity: archFade }}
        className="pointer-events-none absolute inset-0"
        aria-hidden
      >
        <div
          className="animate-drift absolute top-1/2 left-1/2 size-[130vmax] -translate-x-1/2 -translate-y-1/2"
          style={{
            background:
              "radial-gradient(circle, rgba(118,33,76,0.55) 0%, rgba(63,15,43,0.35) 32%, transparent 62%)",
          }}
        />
      </motion.div>

      <Dust />

      {/* the mehrab, drawn in behind everything */}
      <motion.div
        style={{ x: archX, y: archY, scale: archScale, opacity: archFade }}
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
        aria-hidden
      >
        <ArchOutline active={started} />
      </motion.div>

      <motion.div
        style={{ y: lift }}
        className="relative z-20 mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-center px-5 pt-20 pb-8 text-center"
      >
        <motion.p
          variants={fade}
          custom={0}
          initial="hidden"
          animate={animate}
          className="font-bride-label text-[0.5rem] text-rosegold sm:text-[0.6rem]"
          style={{ opacity: centreFade }}
        >
          {meta.invocation}
        </motion.p>

        <motion.p
          variants={fade}
          custom={1}
          initial="hidden"
          animate={animate}
          className="font-bride-script mt-5 text-2xl text-blush-200/90 sm:text-3xl"
          style={{ opacity: centreFade }}
        >
          Together with our families, we invite you to the wedding of
        </motion.p>

        {/* the names — each pulls to its own side on scroll */}
        <div className="mt-6 w-full sm:mt-8">
          <motion.div style={{ x: brideX }}>
            <SplitText
              as="h1"
              active={started}
              delay={0.6}
              stagger={0.05}
              text={couple.bride.short}
              foil
              className="font-bride-display block text-[3.6rem] leading-[0.95] sm:text-[6rem] md:text-[7.5rem]"
            />
            <motion.p
              variants={fade}
              custom={3}
              initial="hidden"
              animate={animate}
              className="font-bride-serif mt-1 text-xs tracking-[0.42em] text-blush-300/70 uppercase sm:text-sm"
            >
              {couple.bride.formal}
            </motion.p>
          </motion.div>

          <motion.p
            variants={fade}
            custom={4}
            initial="hidden"
            animate={animate}
            style={{ opacity: centreFade }}
            className="font-bride-script my-1 text-4xl text-rosegold sm:my-2 sm:text-5xl"
          >
            &amp;
          </motion.p>

          <motion.div style={{ x: groomX }}>
            <SplitText
              as="h1"
              active={started}
              delay={0.95}
              stagger={0.05}
              text={couple.groom.short}
              foil
              className="font-bride-display block text-[3.6rem] leading-[0.95] sm:text-[6rem] md:text-[7.5rem]"
            />
            <motion.p
              variants={fade}
              custom={5}
              initial="hidden"
              animate={animate}
              className="font-bride-serif mt-1 text-xs tracking-[0.42em] text-blush-300/70 uppercase sm:text-sm"
            >
              {couple.groom.formal}
            </motion.p>
          </motion.div>
        </div>

        {/* the date, set as a single ruled line */}
        <motion.div
          variants={fade}
          custom={6}
          initial="hidden"
          animate={animate}
          style={{ opacity: centreFade }}
          className="mt-9 flex items-center gap-4 sm:gap-6"
        >
          <span className="h-px w-8 bg-champagne/40 sm:w-16" />
          <span className="font-bride-label text-[0.58rem] text-champagne sm:text-[0.72rem]">
            Friday · 20 · 11 · 2026
          </span>
          <span className="h-px w-8 bg-champagne/40 sm:w-16" />
        </motion.div>

        <motion.div
          variants={fade}
          custom={7}
          initial="hidden"
          animate={animate}
          style={{ opacity: centreFade }}
          className="mt-10 w-full"
        >
          <Countdown />
        </motion.div>
      </motion.div>

      {/* the running band that closes the hero */}
      <div className="relative z-20 shrink-0 border-y border-champagne/15 bg-wine-900/60 py-3 backdrop-blur-sm">
        <Marquee
          items={[
            "Bhakhar Paradise · Jaipur",
            "Mangal Parinayotsav",
            "20 November 2026",
            "The Roda Family Welcomes You",
          ]}
        />
      </div>

      <motion.a
        href="#invitation"
        initial={{ opacity: 0 }}
        animate={started ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.9, delay: 1.8 }}
        style={{ opacity: centreFade }}
        className="group absolute bottom-[4.5rem] left-1/2 z-30 flex size-10 -translate-x-1/2 items-center justify-center rounded-full border border-champagne/35 bg-wine-900/70 text-champagne backdrop-blur-sm transition-colors hover:border-champagne hover:bg-champagne hover:text-wine-950"
        aria-label="Scroll to the invitation"
      >
        <ArrowDown className="size-4 animate-bounce" strokeWidth={1.4} />
      </motion.a>
    </section>
  );
}

/** The large hero mehrab — drawn once the doors are open, not before. */
function ArchOutline({ active }: { active: boolean }) {
  const draw = (delay: number, duration: number) => ({
    hidden: { pathLength: 0, opacity: 0 },
    show: {
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { duration, ease: EASE, delay },
        opacity: { duration: 0.5, delay },
      },
    },
  });

  return (
    <motion.svg
      viewBox="0 0 520 760"
      fill="none"
      preserveAspectRatio="xMidYMid meet"
      className="h-[86vh] max-h-[860px] w-auto"
      initial="hidden"
      animate={active ? "show" : "hidden"}
    >
      <motion.path
        d="M30 756V320C30 170 133 40 260 40s230 130 230 280v436"
        stroke="var(--color-champagne)"
        strokeOpacity="0.3"
        strokeWidth="1.5"
        variants={draw(0.2, 2.6)}
      />
      <motion.path
        d="M66 756V330c0-126 87-242 194-242s194 116 194 242v426"
        stroke="var(--color-rosegold)"
        strokeOpacity="0.22"
        strokeWidth="1"
        strokeDasharray="4 9"
        variants={draw(0.55, 2.6)}
      />
      <motion.path
        d="M104 756V340c0-104 70-200 156-200s156 96 156 200v416"
        stroke="var(--color-champagne)"
        strokeOpacity="0.12"
        strokeWidth="0.8"
        variants={draw(0.9, 2.6)}
      />
      {/* A kalash finial — a diamond on a stem. This was a vertical stroke
          crossed by a horizontal one, which on a Hindu wedding invitation
          read unmistakably as a Christian cross. */}
      <motion.path
        d="M260 4l9 11-9 11-9-11z M260 26v14"
        stroke="var(--color-champagne)"
        strokeOpacity="0.4"
        strokeWidth="1.4"
        variants={draw(2.4, 0.8)}
      />
    </motion.svg>
  );
}
