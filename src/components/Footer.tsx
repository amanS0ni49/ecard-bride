"use client";

import { Phone } from "lucide-react";
import { couple, meta, sender } from "@/lib/data";
import Marquee from "./Marquee";
import { Reveal, RoseRule, SplitText } from "./Ornaments";

/** The Preshak block from the back of the envelope, and a last goodbye. */
export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-wine-900">
      <div className="border-y border-champagne/15 bg-wine-950 py-3">
        <Marquee
          baseVelocity={-18}
          items={[
            "Guddu & Avi",
            "20 · 11 · 2026",
            "Bhakhar Paradise, Jaipur",
            meta.occasion,
          ]}
        />
      </div>

      <div className="jaali pointer-events-none absolute inset-0 opacity-20" aria-hidden />

      <div className="relative mx-auto max-w-3xl px-5 py-20 text-center sm:py-24">
        <SplitText
          as="p"
          text={`${couple.bride.short} & ${couple.groom.short}`}
          stagger={0.05}
          foil
          className="font-bride-display block text-5xl leading-none sm:text-7xl"
        />

        <Reveal i={1} className="mt-5">
          <p className="font-bride-script text-2xl text-blush-200/80 sm:text-3xl">
            with all our love, and every blessing
          </p>
        </Reveal>

        <RoseRule className="mt-10" width={80} />

        <Reveal i={2} className="mt-12">
          <p className="font-bride-label text-[0.44rem] text-rosegold">{sender.label}</p>
          <p className="font-bride-serif mt-4 text-base leading-relaxed text-champagne/90 sm:text-lg">
            {sender.names.join("  ·  ")}
          </p>
          <div className="mt-5 space-y-1">
            {sender.address.map((line) => (
              <p key={line} className="text-[0.82rem] font-light text-blush-200/55">
                {line}
              </p>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {sender.phones.map((p) => (
              <a
                key={p.tel}
                href={`tel:${p.tel}`}
                className="inline-flex items-center gap-2 text-[0.84rem] font-light text-champagne/85 transition-colors hover:text-rosegold"
              >
                <Phone className="size-3" strokeWidth={1.6} />
                {p.display}
              </a>
            ))}
          </div>
        </Reveal>

        <Reveal i={3} className="mt-14">
          <p className="font-bride-label text-[0.42rem] text-champagne/40">
            {meta.side}
          </p>
        </Reveal>
      </div>
    </footer>
  );
}
