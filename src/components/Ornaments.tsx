"use client";

import type { ReactNode } from "react";
import { motion, type Variants } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Per-character reveal: every letter sits in its own overflow-hidden box and
 * slides up out of it. Used for the big display lines so the names assemble
 * themselves rather than simply fading in.
 */
export function SplitText({
  text,
  className = "",
  delay = 0,
  stagger = 0.035,
  once = true,
  active,
  foil = false,
  as: Tag = "span",
}: {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
  once?: boolean;
  /** Give each letter its own foil gradient — see `text-foil-letter`. */
  foil?: boolean;
  /**
   * Leave undefined and the line reveals when it scrolls into view. Pass a
   * boolean to drive it yourself — the hero does this so its names wait for
   * the doors to open rather than animating behind them.
   */
  active?: boolean;
  as?: "span" | "h1" | "h2" | "p";
}) {
  const MotionTag = motion[Tag];
  const words = text.split(" ");
  const controlled = active !== undefined;
  let index = 0;

  return (
    <MotionTag
      className={className}
      initial="hidden"
      {...(controlled
        ? { animate: active ? "show" : "hidden" }
        : { whileInView: "show", viewport: { once, amount: 0.5 } })}
      aria-label={text}
      transition={{ staggerChildren: stagger, delayChildren: delay }}
    >
      {words.map((word, w) => (
        <span key={`${word}-${w}`} className="inline-block whitespace-nowrap">
          {Array.from(word).map((char) => {
            const i = index++;
            return (
              <span key={i} className="letter-mask" aria-hidden>
                <motion.span
                  className={`inline-block ${foil ? "text-foil-letter" : ""}`}
                  variants={{
                    hidden: { y: "105%", opacity: 0, filter: "blur(6px)" },
                    show: {
                      y: "0%",
                      opacity: 1,
                      filter: "blur(0px)",
                      transition: { duration: 0.85, ease: EASE },
                    },
                  }}
                >
                  {char}
                </motion.span>
              </span>
            );
          })}
          {w < words.length - 1 && <span className="inline-block">&nbsp;</span>}
        </span>
      ))}
    </MotionTag>
  );
}

/** Fade-and-rise, the bride card's default entrance for ordinary blocks. */
export const riseIn: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, delay: i * 0.09, ease: EASE },
  }),
};

export function Reveal({
  children,
  i = 0,
  className = "",
  amount = 0.4,
}: {
  children: ReactNode;
  i?: number;
  className?: string;
  amount?: number;
}) {
  return (
    <motion.div
      className={className}
      variants={riseIn}
      custom={i}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount }}
    >
      {children}
    </motion.div>
  );
}

/**
 * A mehrab — the pointed Rajasthani arch. The outline draws itself in as the
 * section enters, which is the bride card's recurring visual signature.
 */
export function Arch({
  className = "",
  stroke = "var(--color-champagne)",
  duration = 2.4,
  delay = 0,
}: {
  className?: string;
  stroke?: string;
  duration?: number;
  delay?: number;
}) {
  const draw = {
    hidden: { pathLength: 0, opacity: 0 },
    show: {
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { duration, ease: EASE, delay },
        opacity: { duration: 0.4, delay },
      },
    },
  };

  return (
    <motion.svg
      viewBox="0 0 300 460"
      fill="none"
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.3 }}
      aria-hidden
    >
      <motion.path
        d="M6 454V176C6 94 70 6 150 6s144 88 144 170v278"
        stroke={stroke}
        strokeOpacity="0.55"
        strokeWidth="1.4"
        variants={draw}
      />
      <motion.path
        d="M22 454V180c0-74 58-154 128-154s128 80 128 154v274"
        stroke={stroke}
        strokeOpacity="0.28"
        strokeWidth="0.9"
        strokeDasharray="3 6"
        variants={draw}
      />
      <motion.path
        d="M150 6v34M136 40h28"
        stroke={stroke}
        strokeOpacity="0.5"
        strokeWidth="1.2"
        variants={draw}
      />
    </motion.svg>
  );
}

/** A hairline rule with a rose-gold lotus bud at its middle. */
export function RoseRule({ className = "", width = 180 }: { className?: string; width?: number }) {
  return (
    <motion.div
      className={`flex items-center justify-center gap-4 ${className}`}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.8 }}
      aria-hidden
    >
      <motion.span
        className="rule-rose h-px"
        variants={{ hidden: { width: 0 }, show: { width, transition: { duration: 1.1, ease: EASE } } }}
      />
      <motion.svg
        viewBox="0 0 24 24"
        className="size-3 shrink-0"
        variants={{
          hidden: { scale: 0, rotate: -40 },
          show: { scale: 1, rotate: 0, transition: { duration: 0.6, delay: 0.5, ease: EASE } },
        }}
      >
        <path
          d="M12 2c3 4 3 7 0 10-3-3-3-6 0-10zM4 12c4-2 7-1 8 2-4 1-6 0-8-2zM20 12c-4-2-7-1-8 2 4 1 6 0 8-2z"
          fill="var(--color-rosegold)"
          fillOpacity="0.85"
        />
      </motion.svg>
      <motion.span
        className="rule-rose h-px"
        variants={{ hidden: { width: 0 }, show: { width, transition: { duration: 1.1, ease: EASE } } }}
      />
    </motion.div>
  );
}

/** Every section on the bride card opens with this. */
export function SectionHeading({
  kicker,
  title,
  sub,
  align = "center",
  light = false,
}: {
  kicker?: string;
  title: string;
  sub?: ReactNode;
  align?: "center" | "left";
  light?: boolean;
}) {
  const alignment = align === "center" ? "items-center text-center" : "items-start text-left";

  return (
    <div className={`mb-12 flex flex-col ${alignment} sm:mb-16`}>
      {kicker && (
        <motion.p
          className={`font-bride-label text-[0.58rem] ${light ? "text-wine-700" : "text-rosegold"}`}
          initial={{ opacity: 0, letterSpacing: "0.7em" }}
          whileInView={{ opacity: 1, letterSpacing: "0.34em" }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 1.1, ease: EASE }}
        >
          {kicker}
        </motion.p>
      )}

      <SplitText
        as="h2"
        text={title}
        delay={0.12}
        foil={!light}
        className={`font-bride-display mt-4 text-4xl leading-[1.05] sm:text-5xl md:text-6xl ${
          light ? "text-wine-900" : ""
        }`}
      />

      <RoseRule className="mt-6" width={align === "center" ? 120 : 70} />

      {sub && (
        <motion.p
          className={`mt-6 max-w-xl text-[0.95rem] leading-relaxed font-light ${
            light ? "text-wine-800/80" : "text-blush-200/75"
          }`}
          variants={riseIn}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.6 }}
          custom={2}
        >
          {sub}
        </motion.p>
      )}
    </div>
  );
}

/** Small corner filigree used at the four corners of framed blocks. */
export function CornerFiligree({
  corner,
  className = "",
}: {
  corner: "tl" | "tr" | "bl" | "br";
  className?: string;
}) {
  const flip = {
    tl: "",
    tr: "scale-x-[-1]",
    bl: "scale-y-[-1]",
    br: "scale-[-1]",
  }[corner];

  const pos = {
    tl: "top-0 left-0",
    tr: "top-0 right-0",
    bl: "bottom-0 left-0",
    br: "right-0 bottom-0",
  }[corner];

  return (
    <svg
      viewBox="0 0 64 64"
      className={`pointer-events-none absolute size-10 sm:size-14 ${pos} ${flip} ${className}`}
      fill="none"
      aria-hidden
    >
      <path
        d="M2 30V12C2 6 6 2 12 2h18"
        stroke="var(--color-champagne)"
        strokeOpacity="0.55"
        strokeWidth="1.2"
      />
      <path
        d="M10 30V16c0-4 2-6 6-6h14"
        stroke="var(--color-rosegold)"
        strokeOpacity="0.4"
        strokeWidth="0.9"
      />
      <circle cx="12" cy="12" r="2.2" fill="var(--color-rosegold)" fillOpacity="0.75" />
    </svg>
  );
}
