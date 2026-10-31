"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { couple, invitation, meta, shlokas } from "@/lib/data";
import { CornerFiligree, Reveal, RoseRule, SplitText } from "./Ornaments";

/**
 * The formal wording, set on an ivory leaf that tilts up into place as the
 * guest scrolls — the dark card opening to show the paper inside it.
 */
export default function Invitation() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 92%", "start 42%"],
  });
  const smooth = useSpring(scrollYProgress, { stiffness: 70, damping: 24, mass: 0.5 });

  const rotateX = useTransform(smooth, [0, 1], [26, 0]);
  const scale = useTransform(smooth, [0, 1], [0.9, 1]);
  const y = useTransform(smooth, [0, 1], [70, 0]);

  return (
    <section
      id="invitation"
      className="relative overflow-hidden bg-gradient-to-b from-wine-950 via-wine-900 to-wine-950 px-5 py-24 sm:py-32"
    >
      <div className="jaali pointer-events-none absolute inset-0 opacity-25" aria-hidden />

      <div ref={ref} className="relative mx-auto max-w-3xl" style={{ perspective: 1800 }}>
        <motion.article
          style={{ rotateX, scale, y, transformOrigin: "center top" }}
          className="relative overflow-hidden rounded-[2px] px-6 py-14 text-center shadow-[0_60px_120px_-60px_rgba(0,0,0,0.95)] sm:px-14 sm:py-20"
        >
          {/* the paper itself */}
          <span
            className="absolute inset-0 -z-10"
            style={{
              background:
                "linear-gradient(165deg,#fdf9f4 0%,#fbeaed 45%,#f4d6dc 100%)",
            }}
            aria-hidden
          />
          <span className="absolute inset-3 -z-10 border border-wine-800/15" aria-hidden />

          <CornerFiligree corner="tl" className="opacity-70" />
          <CornerFiligree corner="tr" className="opacity-70" />
          <CornerFiligree corner="bl" className="opacity-70" />
          <CornerFiligree corner="br" className="opacity-70" />

          <Reveal>
            <p className="font-bride-label text-[0.5rem] text-wine-600 sm:text-[0.58rem]">
              {meta.invocation}
            </p>
          </Reveal>

          <Reveal i={1} className="mt-7">
            <div className="font-bride-serif space-y-1 text-base text-wine-800 italic sm:text-lg">
              {shlokas.vishnu.lines.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
            <p className="mx-auto mt-4 max-w-md text-[0.78rem] leading-relaxed font-light text-wine-800/60">
              {shlokas.vishnu.english}
            </p>
          </Reveal>

          <RoseRule className="mt-9" width={90} />

          <Reveal i={2} className="mt-9">
            <p className="font-bride-serif text-sm text-wine-700 italic sm:text-base">
              {invitation.lead}
            </p>
            <p className="font-bride-display mt-3 text-2xl leading-tight text-wine-900 sm:text-3xl">
              {invitation.hosts}
            </p>
            <p className="mx-auto mt-4 max-w-md text-[0.84rem] leading-relaxed font-light text-wine-800/75 sm:text-sm">
              {invitation.hostsRelation}
            </p>
          </Reveal>

          <Name
            honorific={couple.bride.honorific}
            primary={couple.bride.primary}
            secondary={couple.bride.secondary}
            lineage={couple.bride.lineage}
            city={couple.bride.city}
          />

          <Reveal i={1} className="my-7">
            <div className="flex items-center justify-center gap-5">
              <span className="h-px w-14 bg-wine-700/25" />
              <span className="font-bride-script text-3xl text-wine-600 sm:text-4xl">
                {invitation.joiner}
              </span>
              <span className="h-px w-14 bg-wine-700/25" />
            </div>
          </Reveal>

          <Name
            honorific={couple.groom.honorific}
            primary={couple.groom.primary}
            secondary={couple.groom.secondary}
            lineage={couple.groom.lineage}
            city={couple.groom.city}
          />

          <Reveal i={2} className="mt-11">
            <span className="inline-flex flex-col items-center gap-1 border-y-2 border-wine-800/25 bg-wine-900 px-7 py-3">
              <span className="font-bride-display text-xl leading-none text-champagne sm:text-2xl">
                {meta.occasion}
              </span>
              <span className="font-bride-label text-[0.42rem] text-rosegold/90">
                {meta.occasionEnglish}
              </span>
            </span>
          </Reveal>

          <Reveal i={3} className="mt-9">
            <p className="mx-auto max-w-lg text-[0.86rem] leading-[1.9] font-light text-wine-800/80 sm:text-[0.95rem]">
              {invitation.closing}
            </p>
          </Reveal>
        </motion.article>
      </div>
    </section>
  );
}

function Name({
  honorific,
  primary,
  secondary,
  lineage,
  city,
}: {
  honorific: string;
  primary: string;
  secondary: string;
  lineage: readonly string[];
  city: string;
}) {
  return (
    <div className="mt-8">
      <Reveal>
        <p className="font-bride-label text-[0.46rem] text-wine-600/80">{honorific}</p>
      </Reveal>

      <SplitText
        as="p"
        text={`${primary} (${secondary})`}
        stagger={0.03}
        className="font-bride-display mt-2 text-[2.6rem] leading-[1] text-wine-900 sm:text-6xl"
      />

      <Reveal i={1} className="mt-4 space-y-1">
        {lineage.map((line) => (
          <p
            key={line}
            className="text-[0.76rem] leading-relaxed font-light text-wine-800/65 sm:text-[0.84rem]"
          >
            {line}
          </p>
        ))}
        <p className="font-bride-label pt-2 text-[0.44rem] text-wine-600/70">
          Resident of {city}
        </p>
      </Reveal>
    </div>
  );
}
