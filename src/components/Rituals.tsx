"use client";

import Image from "next/image";
import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import { CalendarPlus, Clock, MapPin } from "lucide-react";
import { rituals, type RitualItem } from "@/lib/data";
import { downloadIcs } from "@/lib/calendar";
import { Reveal, SplitText } from "./Ornaments";

gsap.registerPlugin(ScrollTrigger);

/**
 * The run-up to the wedding, as a gallery that scrolls sideways while the
 * section stays pinned — the guest keeps scrolling down and the rituals
 * travel across the screen.
 *
 * Pinning is desktop-only on purpose: on a phone it fights the browser's own
 * scroll and feels broken, so there the same track becomes an ordinary
 * snap-scrolling carousel. Guests who ask for reduced motion always get the
 * carousel.
 */
export default function Rituals() {
  const section = useRef<HTMLElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLSpanElement>(null);
  const [active, setActive] = useState(0);

  useLayoutEffect(() => {
    const mm = gsap.matchMedia();

    mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
      const el = track.current;
      const box = viewport.current;
      if (!el || !box) return;

      const distance = () => Math.max(0, el.scrollWidth - box.clientWidth);

      const tween = gsap.to(el, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: section.current,
          start: "top top",
          end: () => `+=${distance() + window.innerHeight * 0.4}`,
          pin: true,
          scrub: 0.8,
          invalidateOnRefresh: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            if (bar.current) gsap.set(bar.current, { scaleX: self.progress });
            setActive(Math.min(rituals.length - 1, Math.round(self.progress * (rituals.length - 1))));
          },
        },
      });

      // The cards lean in slightly as they cross the middle of the screen.
      const cards = gsap.utils.toArray<HTMLElement>(".js-ritual-card");
      const leans = cards.map((card) =>
        gsap.fromTo(
          card,
          { rotateY: 9, scale: 0.94 },
          {
            rotateY: -9,
            scale: 1,
            ease: "none",
            scrollTrigger: {
              trigger: card,
              containerAnimation: tween,
              start: "left right",
              end: "right left",
              scrub: true,
            },
          },
        ),
      );

      return () => {
        tween.kill();
        leans.forEach((t) => t.kill());
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={section}
      id="rituals"
      className="relative overflow-hidden bg-gradient-to-b from-wine-950 via-wine-900 to-wine-950 py-20 md:flex md:h-dvh md:flex-col md:justify-center md:py-0"
    >
      <div className="jaali pointer-events-none absolute inset-0 opacity-20" aria-hidden />

      {/* The heading runs as one editorial row rather than a centred stack —
          the pinned section has a fixed height, so every pixel it gives back
          is a pixel the gallery can use on a short laptop screen. */}
      <div className="relative z-10 px-5 md:px-[8vw]">
        <div className="mb-10 flex flex-col gap-5 md:mb-8 md:flex-row md:items-end md:justify-between md:gap-12">
          <div>
            <motion.p
              className="font-bride-label text-[0.58rem] text-rosegold"
              initial={{ opacity: 0, letterSpacing: "0.7em" }}
              whileInView={{ opacity: 1, letterSpacing: "0.34em" }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            >
              Eight days of celebration
            </motion.p>
            <SplitText
              as="h2"
              text="The Rituals"
              delay={0.12}
              foil
              className="font-bride-display mt-3 text-4xl leading-[1.05] sm:text-5xl md:text-6xl"
            />
          </div>

          <Reveal i={1} className="md:max-w-sm md:pb-2">
            <p className="text-[0.92rem] leading-relaxed font-light text-blush-200/70">
              From the first turn of the chakki to the seventh round of the fire — every
              ceremony on the family&rsquo;s calendar.
            </p>
          </Reveal>
        </div>
      </div>

      {/* the gallery: GSAP drives this on desktop, the guest swipes it on a phone */}
      <div
        ref={viewport}
        className="relative z-10 overflow-x-auto overflow-y-hidden pb-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:overflow-visible md:pb-0"
        style={{ perspective: 1400 }}
      >
        <div
          ref={track}
          className="flex w-max snap-x snap-mandatory gap-5 px-5 will-change-transform sm:gap-7 md:snap-none md:px-[8vw]"
        >
          {rituals.map((ritual, i) => (
            <Card key={ritual.id} ritual={ritual} index={i} />
          ))}
        </div>
      </div>

      {/* progress rail — only meaningful while the section is pinned */}
      <div className="relative z-10 mx-auto mt-8 hidden w-[min(60vw,420px)] md:block">
        <span className="block h-px w-full bg-champagne/15">
          <span
            ref={bar}
            className="block h-px w-full origin-left scale-x-0 bg-gradient-to-r from-rosegold to-champagne"
          />
        </span>
        <p className="font-bride-label mt-4 text-center text-[0.46rem] text-champagne/60">
          {String(active + 1).padStart(2, "0")} / {String(rituals.length).padStart(2, "0")}
          <span className="mx-3 text-rosegold/60">·</span>
          keep scrolling
        </p>
      </div>

      <p className="font-bride-label relative z-10 mt-2 text-center text-[0.46rem] text-champagne/50 md:hidden">
        swipe to see them all
      </p>
    </section>
  );
}

function Card({ ritual, index }: { ritual: RitualItem; index: number }) {
  return (
    <article
      className="js-ritual-card group relative w-[78vw] max-w-[330px] shrink-0 snap-center sm:w-[60vw] md:w-[330px]"
      style={{ transformStyle: "preserve-3d" }}
    >
      <div className="glass-panel relative h-full overflow-hidden rounded-[2px]">
        {/* the big ghosted index */}
        <span
          className="font-bride-display pointer-events-none absolute -top-4 right-3 z-10 text-7xl leading-none text-champagne/10 select-none"
          aria-hidden
        >
          {String(index + 1).padStart(2, "0")}
        </span>

        <div className="relative aspect-[5/4] overflow-hidden md:aspect-[16/11]">
          <Image
            src={ritual.image}
            alt={ritual.imageAlt}
            width={700}
            height={560}
            sizes="(max-width: 768px) 78vw, 330px"
            className="size-full object-cover transition-transform duration-[1100ms] ease-out group-hover:scale-[1.07]"
          />
          <span
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-wine-950 via-wine-950/35 to-transparent"
            aria-hidden
          />

          <span className="font-bride-label absolute top-3 left-3 border border-champagne/35 bg-wine-950/70 px-3 py-1.5 text-[0.44rem] text-champagne backdrop-blur-sm">
            {ritual.dateShort}
          </span>
        </div>

        <div className="relative px-6 pt-5 pb-7">
          <p className="font-bride-label text-[0.42rem] text-rosegold/90">{ritual.english}</p>
          <h3 className="font-bride-display mt-2 text-2xl leading-tight text-champagne sm:text-[1.7rem]">
            {ritual.name}
          </h3>

          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[0.7rem] font-light text-blush-200/70">
            <span className="inline-flex items-center gap-1.5">
              <Clock className="size-3 text-rosegold" strokeWidth={1.6} />
              {ritual.time}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="size-3 text-rosegold" strokeWidth={1.6} />
              {ritual.day}
            </span>
          </div>

          <p className="mt-4 text-[0.8rem] leading-relaxed font-light text-blush-200/60">
            {ritual.blurb}
          </p>

          <button
            type="button"
            onClick={() => downloadIcs(ritual)}
            className="font-bride-label mt-6 inline-flex cursor-pointer items-center gap-2 border-b border-champagne/30 pb-1 text-[0.42rem] text-champagne transition-colors hover:border-champagne hover:text-rosegold"
          >
            <CalendarPlus className="size-3" strokeWidth={1.6} />
            Add to calendar
          </button>
        </div>
      </div>
    </article>
  );
}
