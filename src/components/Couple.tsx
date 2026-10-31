"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { couple } from "@/lib/data";
import { Reveal, RoseRule, SectionHeading, SplitText } from "./Ornaments";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Vadhu Paksh and Var Paksh, side by side.
 *
 * Two things about the layout are deliberate:
 *
 * 1. THE GROOM IS ON THE LEFT. In the supplied artwork the bride is turned to
 *    her right (she looks towards the left edge of her frame) and the groom is
 *    turned the other way. Bride-left/groom-right therefore has the two of
 *    them looking away from each other, out of the page. Swapping them points
 *    both inwards, so they face each other across the divider.
 *
 * 2. THE PORTRAITS ARE CIRCLES, NOT ARCHES. The artwork is a square medallion
 *    that already carries its own gold ring, dashed outer ring and lotus
 *    motifs. Cropping it into a 4:5 arch cut that ring off at the top and
 *    bottom; framed as a circle it survives intact and becomes the frame.
 *
 * They sit in a rose-gold duotone until hovered (or tapped), which keeps the
 * powder-blue ground of the artwork from fighting the wine of the card.
 */
export default function Couple() {
  return (
    <section id="couple" className="relative overflow-hidden bg-wine-950 px-5 py-24 sm:py-32">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-champagne/30 to-transparent"
        aria-hidden
      />

      <div className="mx-auto max-w-6xl">
        <SectionHeading
          kicker="Two families, one celebration"
          title="The Bride & The Groom"
          sub="Hover over either portrait to bring the colour back."
        />

        <div className="relative grid gap-20 md:grid-cols-2 md:gap-10">
          {/* the thread between the two halves */}
          <motion.span
            className="absolute top-0 bottom-0 left-1/2 hidden w-px origin-top bg-gradient-to-b from-transparent via-champagne/25 to-transparent md:block"
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 1.4, ease: EASE }}
            aria-hidden
          />

          <Portrait person={couple.groom} from="left" />
          <Portrait person={couple.bride} from="right" delay={0.12} />
        </div>
      </div>
    </section>
  );
}

function Portrait({
  person,
  from,
  delay = 0,
}: {
  person: (typeof couple)["bride"] | (typeof couple)["groom"];
  from: "left" | "right";
  delay?: number;
}) {
  const offset = from === "left" ? -48 : 48;

  return (
    <article className="group flex flex-col items-center text-center">
      <motion.div
        className="relative w-full max-w-[290px]"
        initial={{ opacity: 0, x: offset, scale: 0.94 }}
        whileInView={{ opacity: 1, x: 0, scale: 1 }}
        /* A low `amount` so the reveal starts as the portrait appears rather
           than a third of the way up the screen. */
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.9, delay, ease: EASE }}
      >
        {/* the rings, echoing the ones drawn into the artwork */}
        <span
          className="absolute -inset-3 rounded-full border border-champagne/25 transition-colors duration-700 group-hover:border-champagne/60"
          aria-hidden
        />
        <span
          className="absolute -inset-6 rounded-full border border-dashed border-rosegold/20"
          aria-hidden
        />

        {/* A plain div, NOT a motion component.
            This used to reveal itself by animating `clip-path` from a closed
            shape. Framer applies that initial value but will not interpolate
            `inset()` / `circle()`, so the animation never ran and the
            portraits stayed permanently invisible — the rings around them
            still drew, which made it look like the images had failed to load.
            The entrance now lives entirely on the wrapper above, animating
            opacity and transform only, so the photograph cannot end up hidden
            behind a property that never moves. */}
        <div className="relative aspect-square overflow-hidden rounded-full">
          <Image
            src={person.portrait}
            alt={`Illustrated portrait of ${person.primary} (${person.secondary})`}
            width={760}
            height={760}
            /* Eager: the picture must already be decoded when the circle
               opens, and lazily-loaded images inside a clipped box can sit
               unrequested for far too long. */
            loading="eager"
            sizes="(max-width: 768px) 70vw, 290px"
            className="size-full object-cover grayscale-[0.9] sepia-[0.3] transition-all duration-[900ms] ease-out group-hover:scale-[1.04] group-hover:grayscale-0 group-hover:sepia-0"
          />

          {/* rose-gold duotone, lifted on hover */}
          <span
            className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-br from-wine-800/80 via-rosegold/40 to-champagne/30 mix-blend-color transition-opacity duration-[900ms] group-hover:opacity-0"
            aria-hidden
          />
        </div>

        {/* the side label, sitting on the outer ring */}
        <span className="font-bride-label absolute -top-9 left-1/2 -translate-x-1/2 bg-wine-950 px-4 text-[0.44rem] text-rosegold">
          {person.side}
        </span>
      </motion.div>

      <SplitText
        as="p"
        text={person.primary}
        stagger={0.04}
        foil
        className="font-bride-display mt-12 text-4xl leading-none sm:text-5xl"
      />

      <Reveal i={1} className="mt-2">
        <p className="font-bride-script text-2xl text-blush-200/85 sm:text-3xl">
          {person.secondary}
        </p>
      </Reveal>

      <RoseRule className="mt-5" width={48} />

      <Reveal i={2} className="mt-5 space-y-1.5">
        {person.lineage.map((line) => (
          <p
            key={line}
            className="mx-auto max-w-xs text-[0.78rem] leading-relaxed font-light text-blush-200/60 sm:text-[0.84rem]"
          >
            {line}
          </p>
        ))}
        <p className="font-bride-label pt-3 text-[0.42rem] text-champagne/60">
          {person.sideEnglish} · {person.city}
        </p>
      </Reveal>
    </article>
  );
}
