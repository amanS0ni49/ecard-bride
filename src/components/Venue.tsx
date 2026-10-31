"use client";

import { motion } from "framer-motion";
import { Navigation, Phone } from "lucide-react";
import { households, venue } from "@/lib/data";
import { mapsUrl } from "@/lib/calendar";
import { Arch, CornerFiligree, Reveal, RoseRule, SectionHeading, SplitText } from "./Ornaments";

/** Where everything happens, and who to call about it. */
export default function Venue() {
  return (
    <section id="venue" className="relative overflow-hidden bg-wine-950 px-5 py-24 sm:py-32">
      <div className="jaali pointer-events-none absolute inset-0 opacity-25" aria-hidden />
      <div
        className="pointer-events-none absolute top-1/2 left-1/2 size-[80vmax] -translate-x-1/2 -translate-y-1/2 opacity-60"
        style={{
          background:
            "radial-gradient(circle, rgba(86,23,57,0.6) 0%, transparent 58%)",
        }}
        aria-hidden
      />

      <div className="relative mx-auto max-w-5xl">
        <SectionHeading kicker="Karyakram Sthal" title="The Venue" />

        <div className="relative mx-auto max-w-xl">
          <Arch className="absolute inset-x-0 -top-6 mx-auto h-[115%] w-[88%] opacity-40" />

          <div className="relative px-6 py-14 text-center sm:px-12">
            <SplitText
              as="p"
              text={venue.name}
              stagger={0.035}
              foil
              className="font-bride-display block text-4xl leading-tight sm:text-6xl"
            />

            <RoseRule className="mt-6" width={70} />

            <Reveal i={1} className="mt-6 space-y-1">
              {venue.address.map((line) => (
                <p key={line} className="text-sm font-light text-blush-200/70">
                  {line}
                </p>
              ))}
              <p className="font-bride-serif pt-2 text-lg tracking-[0.3em] text-champagne uppercase">
                {venue.city}
              </p>
            </Reveal>

            <Reveal i={2} className="mt-9">
              <motion.a
                href={mapsUrl(venue.mapQuery)}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.97 }}
                className="font-bride-label inline-flex items-center gap-3 border border-champagne/40 px-7 py-4 text-[0.46rem] text-champagne transition-colors hover:border-champagne hover:bg-champagne hover:text-wine-950"
              >
                <Navigation className="size-3.5" strokeWidth={1.5} />
                Get directions
              </motion.a>
            </Reveal>
          </div>
        </div>

        {/* the two households, as printed at the foot of the card */}
        <div className="mt-20 grid gap-6 sm:grid-cols-2">
          {households.map((h, i) => (
            <Reveal key={h.id} i={i}>
              <div className="glass-panel relative h-full px-7 py-9 text-center">
                <CornerFiligree corner="tl" className="size-8 opacity-50" />
                <CornerFiligree corner="br" className="size-8 opacity-50" />

                <p className="font-bride-label text-[0.44rem] text-rosegold">{h.side}</p>
                <p className="font-bride-serif mt-1 text-[0.6rem] tracking-[0.25em] text-champagne/50 uppercase">
                  {h.sideEnglish}
                </p>

                <p className="font-bride-display mt-5 text-2xl text-champagne sm:text-[1.7rem]">
                  {h.name}
                </p>

                <div className="mt-4 space-y-1">
                  {h.lines.map((line) => (
                    <p key={line} className="text-[0.8rem] font-light text-blush-200/65">
                      {line}
                    </p>
                  ))}
                </div>

                <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
                  {h.phones.map((p) => (
                    <a
                      key={p.tel}
                      href={`tel:${p.tel}`}
                      className="inline-flex items-center gap-2 text-[0.82rem] font-light text-champagne/85 transition-colors hover:text-rosegold"
                    >
                      <Phone className="size-3" strokeWidth={1.6} />
                      {p.display}
                    </a>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
