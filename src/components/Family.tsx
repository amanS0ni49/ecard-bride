"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { baalManuhar, families, familyPhoto } from "@/lib/data";
import { CornerFiligree, Reveal, RoseRule, SectionHeading } from "./Ornaments";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Everyone the printed card names — Uttarakanshi through Nanihal Paksh —
 * and then the children's own invitation, which is the best thing on the
 * whole card and deserves its own stage.
 */
export default function Family() {
  return (
    <section
      id="family"
      className="relative overflow-hidden bg-gradient-to-b from-wine-950 via-wine-900 to-wine-950 px-5 py-24 sm:py-32"
    >
      <div className="jaali pointer-events-none absolute inset-0 opacity-20" aria-hidden />

      <div className="relative mx-auto max-w-5xl">
        <SectionHeading
          kicker="The Roda Parivar"
          title="With Love, From All of Us"
          sub="Every name below is waiting to welcome you."
        />

        <FamilyPortrait />

        <div className="grid gap-x-10 gap-y-14 sm:grid-cols-2">
          {families.map((group, i) => (
            <motion.div
              key={group.id}
              className={group.id === "darshanabhilashi" ? "sm:col-span-2" : ""}
              initial={{ opacity: 0, y: 34 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.9, delay: (i % 2) * 0.12, ease: EASE }}
            >
              <div className="flex items-center gap-4">
                <h3 className="font-bride-display text-2xl text-champagne sm:text-[1.7rem]">
                  {group.title}
                </h3>
                <span className="h-px flex-1 bg-gradient-to-r from-champagne/30 to-transparent" />
              </div>
              <p className="font-bride-label mt-2 text-[0.42rem] text-rosegold/80">
                {group.english}
              </p>

              <ul
                className={`mt-6 ${
                  group.id === "darshanabhilashi"
                    ? "flex flex-wrap gap-x-7 gap-y-3"
                    : "space-y-2.5"
                }`}
              >
                {group.members.map((name, j) => (
                  <motion.li
                    key={`${name}-${j}`}
                    className="font-bride-serif text-[0.95rem] text-blush-200/80 sm:text-base"
                    initial={{ opacity: 0, x: -12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.6 }}
                    transition={{ duration: 0.6, delay: 0.1 + j * 0.05, ease: EASE }}
                  >
                    {name}
                  </motion.li>
                ))}
              </ul>

              {"note" in group && group.note && (
                <p className="mt-4 text-[0.76rem] font-light text-blush-200/45">{group.note}</p>
              )}
            </motion.div>
          ))}
        </div>

        <BaalManuhar />
      </div>
    </section>
  );
}

/**
 * The family themselves, opening the section that lists them all by name.
 *
 * Fitting it to the card rather than dropping it on top:
 *  - the frame takes the photograph's OWN aspect ratio, so nothing is cropped;
 *  - it is masked to the same mehrab used everywhere else on the card, which
 *    is also why the bokeh at the top of the shot is the part that gets cut;
 *  - the edges are feathered into the wine ground with a vignette and a
 *    bottom gradient, so no rectangle ever shows against the dark;
 *  - it is left in full colour. The portraits in the couple section are
 *    duotoned because their artwork is powder blue and fights the palette;
 *    this photograph is already gold, cream and rose and belongs as it is.
 *
 * Entrance is opacity and scale only — never clip-path, which Framer applies
 * but will not interpolate, leaving the picture permanently invisible.
 */
function FamilyPortrait() {
  return (
    <motion.figure
      className="relative mx-auto mb-20 w-full max-w-[460px] sm:mb-24"
      initial={{ opacity: 0, y: 36, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 1, ease: EASE }}
    >
      {/* the frame, offset outside the picture */}
      <span
        className="pointer-events-none absolute -inset-3 border border-champagne/25 sm:-inset-4"
        style={{ borderRadius: "50% 50% 6px 6px / 30% 30% 6px 6px" }}
        aria-hidden
      />

      <div
        className="group relative overflow-hidden"
        style={{
          aspectRatio: familyPhoto.ratio,
          borderRadius: "50% 50% 4px 4px / 30% 30% 4px 4px",
        }}
      >
        <Image
          src={familyPhoto.src}
          alt={familyPhoto.alt}
          fill
          sizes="(max-width: 640px) 88vw, 460px"
          className="object-cover object-center transition-transform duration-[1400ms] ease-out group-hover:scale-[1.04]"
        />

        {/* feather the edges into the wine so the rectangle never shows */}
        <span
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 72% 62% at 50% 45%, transparent 0%, rgba(22,4,15,0.45) 100%)",
          }}
          aria-hidden
        />
        <span
          className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-wine-950/85 to-transparent"
          aria-hidden
        />

        <CornerFiligree corner="bl" className="size-8 opacity-50" />
        <CornerFiligree corner="br" className="size-8 opacity-50" />
      </div>

      <figcaption className="mt-7 text-center">
        <p className="font-bride-script text-4xl text-rosegold sm:text-5xl">
          {familyPhoto.caption}
        </p>
        <p className="font-bride-label mt-3 text-[0.44rem] text-champagne/70">
          {familyPhoto.captionEnglish}
        </p>
        <RoseRule className="mt-5" width={50} />
      </figcaption>
    </motion.figure>
  );
}

/** The children's invitation, printed at the very bottom of the card. */
function BaalManuhar() {
  return (
    <Reveal className="mt-24">
      <div className="glass-panel relative overflow-hidden px-6 py-14 text-center sm:px-12">
        <div
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{
            background:
              "radial-gradient(ellipse 60% 70% at 50% 0%, rgba(226,164,146,0.16), transparent 70%)",
          }}
          aria-hidden
        />

        <p className="font-bride-label relative text-[0.46rem] text-rosegold">
          {baalManuhar.title}
        </p>
        <p className="font-bride-serif relative mt-2 text-[0.62rem] tracking-[0.25em] text-champagne/50 uppercase">
          {baalManuhar.english}
        </p>

        <motion.p
          className="font-bride-script text-rosefoil relative mt-7 text-4xl leading-tight sm:text-6xl"
          initial={{ opacity: 0, scale: 0.92, rotate: -2 }}
          whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 1, ease: EASE }}
        >
          {baalManuhar.plea}
        </motion.p>

        <RoseRule className="relative mt-8" width={60} />

        <ul className="relative mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
          {baalManuhar.names.map((name, i) => (
            <motion.li
              key={`${name}-${i}`}
              className="font-bride-serif cursor-default text-base text-blush-200/80 transition-colors hover:text-champagne sm:text-lg"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{
                type: "spring",
                stiffness: 240,
                damping: 14,
                delay: 0.15 + i * 0.08,
              }}
              whileHover={{ y: -6, scale: 1.08 }}
            >
              {name}
            </motion.li>
          ))}
        </ul>
      </div>
    </Reveal>
  );
}
