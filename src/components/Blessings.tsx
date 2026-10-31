"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { blessings } from "@/lib/data";
import Dust from "./Dust";
import { Arch, CornerFiligree, Reveal, RoseRule, SectionHeading } from "./Ornaments";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * The swargiya elders — Janhavi's nani-nana and dadi-dada — blessing the
 * couple from above. Printed cards place this invocation right after the
 * invitation wording and before the couple is introduced; it sits in the
 * same spot here.
 *
 * The artwork wears the card's own mehrab — the arched frame the family
 * portrait uses — with the `Arch` ornament drawing itself behind it and
 * concentric border rings like the ones around the couple's portraits. A
 * vignette melts the edges into the wine so it never reads as a pasted
 * rectangle, and the section's gold dust drifts UP, towards them. No hard
 * crop: the frame keeps the artwork's own aspect from `blessings.ratio`.
 *
 * Entrance is opacity and transform only — see the note in Couple.tsx
 * about animating clip-path with Framer.
 */
export default function Blessings() {
  return (
    <section
      id="blessings"
      className="relative overflow-hidden bg-wine-950 px-5 py-24 sm:py-32"
    >
      {/* hairline where this section meets the invitation's paper */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-champagne/30 to-transparent"
        aria-hidden
      />

      {/* the light they stand in, spilling down onto the card */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-3/4"
        style={{
          background:
            "radial-gradient(ellipse 52% 62% at 50% 0%, rgba(240,212,156,0.10), transparent 70%)",
        }}
        aria-hidden
      />

      {/* the motes rise — in this section, upwards is the point */}
      <Dust />

      <div className="relative mx-auto max-w-3xl">
        <SectionHeading
          kicker={blessings.kicker}
          title={blessings.title}
          sub={blessings.sub}
        />

        <motion.figure
          className="relative mx-auto w-full max-w-[460px]"
          initial={{ opacity: 0, y: 40, scale: 0.96 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 1.1, ease: EASE }}
        >
          <div className="group relative" style={{ aspectRatio: blessings.ratio }}>
            {/* the mehrab drawing itself behind the photograph */}
            <Arch
              className="pointer-events-none absolute -top-8 left-1/2 h-[112%] w-auto -translate-x-1/2 opacity-30"
              delay={0.4}
            />

            {/* concentric arch borders, echoing the rings around the couple */}
            <span
              className="pointer-events-none absolute -inset-3 border border-champagne/25 sm:-inset-4"
              style={{ borderRadius: "50% 50% 8px 8px / 26% 26% 8px 8px" }}
              aria-hidden
            />
            <span
              className="pointer-events-none absolute -inset-6 border border-dashed border-rosegold/20 sm:-inset-7"
              style={{ borderRadius: "50% 50% 10px 10px / 28% 28% 10px 10px" }}
              aria-hidden
            />

            {/* the light they stand in, haloed where a frame's shadow would be */}
            <span
              className="pointer-events-none absolute -inset-8"
              style={{
                background:
                  "radial-gradient(ellipse 55% 50% at 50% 40%, rgba(240,212,156,0.14), transparent 70%)",
              }}
              aria-hidden
            />

            <div
              className="relative size-full overflow-hidden"
              style={{ borderRadius: "50% 50% 6px 6px / 28% 28% 6px 6px" }}
            >
              <Image
                src={blessings.src}
                alt={blessings.alt}
                fill
                sizes="(max-width: 768px) 92vw, 460px"
                className="object-cover object-center transition-transform duration-[1600ms] ease-out group-hover:scale-[1.04]"
              />

              {/* melt the edges into the wine so no rectangle ever shows */}
              <span
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "radial-gradient(ellipse 74% 64% at 50% 44%, transparent 52%, rgba(22,4,15,0.5) 100%)",
                }}
                aria-hidden
              />
              <span
                className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-wine-950/80 to-transparent"
                aria-hidden
              />

              <CornerFiligree corner="bl" className="size-8 opacity-50" />
              <CornerFiligree corner="br" className="size-8 opacity-50" />
            </div>
          </div>

          <figcaption className="mt-9 text-center">
            <p className="font-bride-script text-4xl text-rosegold sm:text-5xl">
              {blessings.caption}
            </p>

            <RoseRule className="mt-6" width={60} />

            <div className="mx-auto mt-8 grid max-w-md gap-x-8 gap-y-7 sm:grid-cols-2">
              {blessings.names.map((elder, i) => (
                <Reveal key={elder.label} i={i + 1}>
                  <p className="font-bride-label text-[0.42rem] text-rosegold/85">
                    {elder.label}
                  </p>
                  <p className="font-bride-serif mt-2.5 text-[0.84rem] leading-relaxed font-light text-blush-200/75">
                    {elder.line}
                  </p>
                </Reveal>
              ))}
            </div>

            <p className="font-bride-label mt-8 text-[0.44rem] text-champagne/70">
              {blessings.captionEnglish}
            </p>
          </figcaption>
        </motion.figure>

        <Reveal className="mx-auto mt-10 max-w-md text-center">
          <p className="text-[0.82rem] leading-relaxed font-light text-blush-200/55 italic sm:text-[0.9rem]">
            They may not sit beside us at the mandap, but nothing on this day
            begins without them.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
