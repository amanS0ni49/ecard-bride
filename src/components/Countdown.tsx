"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { WEDDING_ISO } from "@/lib/data";

type Parts = { days: number; hours: number; minutes: number; seconds: number };

function diff(): Parts | null {
  const ms = new Date(WEDDING_ISO).getTime() - Date.now();
  if (ms <= 0) return null;
  return {
    days: Math.floor(ms / 86_400_000),
    hours: Math.floor(ms / 3_600_000) % 24,
    minutes: Math.floor(ms / 60_000) % 60,
    seconds: Math.floor(ms / 1_000) % 60,
  };
}

/** One digit column, so only the digits that actually change roll over. */
function Digit({ char }: { char: string }) {
  return (
    <span className="relative inline-block h-[1.08em] w-[0.62em] overflow-hidden align-bottom">
      <AnimatePresence initial={false} mode="popLayout">
        <motion.span
          key={char}
          className="absolute inset-0 flex items-center justify-center tabular-nums"
          initial={{ y: "-100%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          exit={{ y: "100%", opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          {char}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

function Unit({ value, label, last }: { value: number; label: string; last?: boolean }) {
  const text = String(value).padStart(2, "0");
  return (
    <div className="flex items-stretch">
      <div className="flex min-w-[3.4rem] flex-col items-center sm:min-w-[5rem]">
        <span className="font-bride-display text-3xl leading-none text-champagne sm:text-5xl md:text-6xl">
          {Array.from(text).map((c, i) => (
            <Digit key={i} char={c} />
          ))}
        </span>
        <span className="font-bride-label mt-3 text-[0.46rem] text-rosegold/80 sm:text-[0.55rem]">
          {label}
        </span>
      </div>
      {!last && (
        <span className="mx-2 w-px self-stretch bg-gradient-to-b from-transparent via-champagne/25 to-transparent sm:mx-4" />
      )}
    </div>
  );
}

export default function Countdown() {
  // Starts null so the server markup and the first client paint agree.
  const [parts, setParts] = useState<Parts | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const tick = () => {
      setParts(diff());
      setReady(true);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  // Reserves the exact rendered height so the hero never jumps on hydration.
  if (!ready) return <div className="h-[72px] sm:h-[104px] md:h-[118px]" aria-hidden />;

  if (!parts) {
    return (
      <p className="font-bride-script text-3xl text-champagne sm:text-4xl">
        Today is the day — we will see you there
      </p>
    );
  }

  return (
    <motion.div
      className="flex items-start justify-center"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, delay: 0.3 }}
      aria-label={`${parts.days} days until the wedding`}
    >
      <Unit value={parts.days} label="Days" />
      <Unit value={parts.hours} label="Hours" />
      <Unit value={parts.minutes} label="Minutes" />
      <Unit value={parts.seconds} label="Seconds" last />
    </motion.div>
  );
}
