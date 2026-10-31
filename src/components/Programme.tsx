"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { programme, ritualById } from "@/lib/data";
import { Arch, Reveal, SectionHeading } from "./Ornaments";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * The Vaivahik Karyakram, day by day.
 *
 * The date parks itself on the left and swaps as the guest scrolls through
 * the days — so the big "19 November" is always the one you are reading
 * about. On a phone the heading simply rides above each day instead.
 */
export default function Programme() {
  const [active, setActive] = useState(0);
  const day = programme[active];

  return (
    <section
      id="programme"
      className="relative overflow-hidden bg-blush-50 px-5 py-24 text-wine-900 sm:py-32"
    >
      <Arch
        className="pointer-events-none absolute -top-20 left-1/2 h-[520px] w-auto -translate-x-1/2 opacity-[0.08]"
        stroke="var(--color-wine-700)"
      />

      <div className="relative mx-auto max-w-6xl">
        <SectionHeading
          light
          kicker="Vaivahik Karyakram"
          title="The Programme"
          sub="Four days, eight ceremonies. Everything exactly as it is printed on the card."
        />

        <div className="grid gap-10 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.3fr)] md:gap-16">
          {/* the date that follows you down the page */}
          <div className="hidden md:block">
            <div className="sticky top-[22vh]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={day.id}
                  initial={{ opacity: 0, y: 26 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.55, ease: EASE }}
                >
                  <p className="font-bride-label text-[0.5rem] text-wine-600">{day.day}</p>
                  <p className="font-bride-display mt-3 flex items-start gap-3 text-[6.5rem] leading-[0.82] text-wine-900">
                    {day.dayNum}
                    <span className="font-bride-serif mt-3 flex flex-col text-base leading-tight tracking-[0.2em] text-wine-700 uppercase">
                      <span>{day.month}</span>
                      <span className="my-1.5 h-px w-full bg-wine-700/30" />
                      <span>2026</span>
                    </span>
                  </p>
                  <p className="font-bride-script mt-5 text-4xl text-wine-600">{day.label}</p>
                  <p className="font-bride-label mt-4 text-[0.46rem] text-wine-700/70">
                    {day.note}
                  </p>
                </motion.div>
              </AnimatePresence>

              {/* which of the four days you are on */}
              <div className="mt-10 flex items-center gap-2.5">
                {programme.map((p, i) => (
                  <span
                    key={p.id}
                    className={`h-px transition-all duration-500 ${
                      i === active ? "w-10 bg-wine-800" : "w-4 bg-wine-800/25"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* the days themselves */}
          <div className="space-y-20 md:space-y-32">
            {programme.map((p, i) => (
              <motion.div
                key={p.id}
                onViewportEnter={() => setActive(i)}
                viewport={{ margin: "-45% 0px -45% 0px", amount: 0.1 }}
              >
                {/* phone-only day heading */}
                <div className="mb-7 md:hidden">
                  <p className="font-bride-label text-[0.48rem] text-wine-600">{p.day}</p>
                  <p className="font-bride-display mt-1 text-5xl leading-none text-wine-900">
                    {p.dayNum} <span className="text-2xl">{p.month} 2026</span>
                  </p>
                  <p className="font-bride-script mt-2 text-3xl text-wine-600">{p.label}</p>
                </div>

                <ol className="space-y-px">
                  {p.items.map((id, j) => {
                    const ritual = ritualById(id);
                    if (!ritual) return null;
                    return (
                      <Reveal key={id} i={j}>
                        <li className="group relative flex items-baseline justify-between gap-5 border-b border-wine-800/12 py-6 transition-colors hover:border-wine-800/35">
                          {/* the hairline that sweeps in on hover */}
                          <span
                            className="absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-wine-800 transition-transform duration-700 ease-out group-hover:scale-x-100"
                            aria-hidden
                          />

                          <div className="min-w-0">
                            <h3 className="font-bride-display text-2xl leading-tight text-wine-900 transition-transform duration-500 group-hover:translate-x-1.5 sm:text-3xl">
                              {ritual.name}
                            </h3>
                            <p className="font-bride-label mt-2 text-[0.44rem] text-wine-600/80">
                              {ritual.english}
                            </p>
                          </div>

                          <span className="font-bride-serif shrink-0 text-sm tracking-wide text-wine-700 sm:text-base">
                            {ritual.time}
                          </span>
                        </li>
                      </Reveal>
                    );
                  })}
                </ol>

                <Reveal i={2}>
                  <p className="font-bride-label mt-5 text-[0.44rem] text-wine-600/60">
                    {p.note}
                  </p>
                </Reveal>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
