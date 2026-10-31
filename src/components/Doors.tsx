"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";

/**
 * The curtain-raiser for the bride's card: a pair of carved jharokha doors
 * under a mehrab arch. Tapping the brass latch unlocks it — the latch lifts
 * and spins away, the leaves swing open on their hinges, and the family is
 * standing in the doorway with folded hands to greet the guest. The frame
 * then pulls back through the opening and hands over to the hero.
 *
 * (The groom's card opens an envelope; this one opens a door. On purpose.)
 */

/** The mehrab the doorway, the photograph and its frame all share. */
const ARCH = "50% 50% 8px 8px / 36% 36% 8px 8px";

const leafClass = "absolute top-0 bottom-0 w-1/2 will-change-transform";

const leafStyle = (side: "left" | "right"): React.CSSProperties => {
  const isLeft = side === "left";
  return {
    left: isLeft ? 0 : "50%",
    transformOrigin: isLeft ? "left center" : "right center",
    transformStyle: "preserve-3d",
    backfaceVisibility: "hidden",
    borderRadius: isLeft ? "50% 0 0 8px / 36% 0 0 8px" : "0 50% 8px 0 / 0 36% 8px 0",
    background: "linear-gradient(135deg,#3f0f2b 0%,#250719 42%,#310b22 70%,#16040f 100%)",
    boxShadow: isLeft
      ? "inset -2px 0 0 rgba(240,212,156,0.22), 0 40px 90px -50px #000"
      : "inset 2px 0 0 rgba(240,212,156,0.22), 0 40px 90px -50px #000",
  };
};

/** The carved face of one leaf: jaali screen, inlaid border and brass studs. */
function LeafFace({ side }: { side: "left" | "right" }) {
  const isLeft = side === "left";
  const radius = isLeft ? "60% 0 0 4px / 40% 0 0 4px" : "0 60% 4px 0 / 0 40% 4px 0";

  return (
    <>
      <span
        className="jaali absolute inset-[9%] opacity-70"
        style={{ borderRadius: radius }}
        aria-hidden
      />
      <span
        className="absolute inset-[6%] border border-champagne/25"
        style={{ borderRadius: radius }}
        aria-hidden
      />
      <span
        className="absolute inset-y-[14%] flex flex-col justify-between"
        style={isLeft ? { right: "4%" } : { left: "4%" }}
        aria-hidden
      >
        {Array.from({ length: 7 }).map((_, s) => (
          <span
            key={s}
            className="size-1.5 rounded-full bg-champagne/45 shadow-[0_0_6px_rgba(240,212,156,0.5)]"
          />
        ))}
      </span>
    </>
  );
}

export default function Doors({
  onOpen,
  onDone,
}: {
  /** Fired synchronously on the tap, while the user gesture is still live. */
  onOpen: () => void;
  onDone: () => void;
}) {
  const root = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const left = useRef<HTMLDivElement>(null);
  const right = useRef<HTMLDivElement>(null);
  const latch = useRef<HTMLButtonElement>(null);
  const flood = useRef<HTMLDivElement>(null);
  const hint = useRef<HTMLDivElement>(null);
  const welcome = useRef<HTMLDivElement>(null);
  const greeting = useRef<HTMLParagraphElement>(null);
  const [opening, setOpening] = useState(false);

  // Hold the page still until the doors are out of the way.
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // `fromTo`, never `from`. A bare `gsap.from()` reads the element's
      // current state as the end value — and under React's double-invoked
      // effects the first tween has already applied its start state by the
      // time the second one measures, so the latch ends up animating from
      // scale 0 to scale 0 and is never visible or clickable again. With the
      // latch stuck invisible there is no way to open the card at all, so
      // the end values are stated explicitly and cannot be poisoned.
      gsap.fromTo(
        stage.current,
        { scale: 1.12, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1.4, ease: "power3.out" },
      );
      gsap.fromTo(
        latch.current,
        { scale: 0, rotate: -120 },
        { scale: 1, rotate: 0, duration: 1, delay: 0.5, ease: "back.out(2.2)" },
      );
      gsap.fromTo(
        hint.current,
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.9, delay: 0.95 },
      );
      gsap.to(latch.current, {
        y: -5,
        duration: 2.2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 1.5,
      });
    }, root);
    return () => ctx.revert();
  }, []);

  const open = () => {
    if (opening) return;
    setOpening(true);
    onOpen();

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      onDone();
      return;
    }

    const tl = gsap.timeline({ onComplete: onDone });

    tl.killTweensOf(latch.current);
    tl.to(hint.current, { opacity: 0, y: 12, duration: 0.3 })
      // the latch lifts clear of the doors, then spins away
      .to(latch.current, { y: -18, scale: 1.18, duration: 0.3, ease: "back.out(3)" }, "<")
      .to(latch.current, {
        y: 190,
        rotate: 300,
        scale: 0.4,
        opacity: 0,
        duration: 0.75,
        ease: "power2.in",
      })
      // light builds behind the seam just before it parts
      .to(flood.current, { opacity: 1, duration: 0.9, ease: "power2.out" }, "-=0.55")
      // the family settles into the doorway while the leaves are still moving,
      // so they are already there to be found rather than arriving afterwards
      .fromTo(
        welcome.current,
        { opacity: 0, scale: 1.14 },
        { opacity: 1, scale: 1, duration: 2.5, ease: "power2.out" },
        "<",
      )
      // both leaves swing open on their hinges
      .to(left.current, { rotateY: -108, duration: 1.4, ease: "power3.inOut" }, "-=0.7")
      .to(right.current, { rotateY: 108, duration: 1.4, ease: "power3.inOut" }, "<")
      .to(greeting.current, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }, "-=0.5")
      // a beat to actually take them in — without it the welcome is gone
      // before the guest has registered that anyone is standing there
      .to(stage.current, { scale: 1.9, duration: 1.2, ease: "power2.in" }, "+=0.7")
      // dissolve the photograph rather than flying the camera into their faces
      .to(welcome.current, { opacity: 0, duration: 0.85, ease: "power2.in" }, "-=1")
      .to(greeting.current, { opacity: 0, duration: 0.5 }, "<")
      .to(root.current, { opacity: 0, duration: 0.7, ease: "power2.inOut" }, "-=0.55");
  };

  return (
    <div
      ref={root}
      className="fixed inset-0 z-90 flex items-center justify-center overflow-hidden bg-wine-950"
      role="dialog"
      aria-label="Open the wedding invitation"
    >
      {/* the light waiting on the other side */}
      <div
        ref={flood}
        className="pointer-events-none absolute inset-0 opacity-0"
        style={{
          background:
            "radial-gradient(ellipse 48% 60% at 50% 50%, rgba(247,227,189,0.95), rgba(226,164,146,0.35) 40%, transparent 72%)",
        }}
        aria-hidden
      />

      {/* The doorway is pinned to the photograph's own 2:3 ratio rather than
          sized from the viewport alone. Left as `h-[72vh] w-[min(84vw,440px)]`
          it turns into a wide letterbox on a short or landscape screen, and
          the family gets cropped down to a strip of torsos. */}
      <div
        ref={stage}
        className="relative aspect-2/3 h-[min(72vh,640px)] w-auto max-w-[84vw]"
        style={{ perspective: 1600 }}
      >
        {/* The doorway, and the family waiting in it.
            The photograph is 2:3 and the doorway is ~0.69:1, so masking it to
            the mehrab crops barely twenty pixels — the arch already in the
            picture lands almost exactly on the arch of the frame. */}
        <div
          className="absolute inset-0 overflow-hidden bg-wine-900"
          style={{ borderRadius: ARCH }}
          aria-hidden
        >
          <div ref={welcome} className="absolute inset-0 opacity-0 will-change-transform">
            {/* Must already be decoded by the time the latch is tapped, or
                the doors open onto an empty frame. `priority` is deprecated
                in Next 16 — eager + high fetch priority is the replacement
                that does not also claim to be the LCP element. */}
            <Image
              src="/bride/welcome.jpg"
              alt=""
              fill
              loading="eager"
              fetchPriority="high"
              sizes="(max-width: 480px) 84vw, 440px"
              className="object-cover object-[50%_42%]"
            />

            {/* Grade it into the card: the photograph is cream and blush, the
                card is wine and champagne. The edges sink into the dark so no
                rectangle ever shows, and the faces stay untouched. */}
            <span
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse 68% 58% at 50% 40%, transparent 0%, rgba(22,4,15,0.5) 100%)",
              }}
            />
            <span className="absolute inset-0 bg-gradient-to-t from-wine-950 via-transparent to-wine-950/35" />
            <span className="absolute inset-0 bg-wine-800/20 mix-blend-multiply" />
          </div>

          {/* the doorframe, drawn over whatever is behind it */}
          <span
            className="absolute inset-0 border border-champagne/25"
            style={{ borderRadius: ARCH }}
          />
        </div>

        <div ref={left} className={leafClass} style={leafStyle("left")}>
          <LeafFace side="left" />
        </div>
        <div ref={right} className={leafClass} style={leafStyle("right")}>
          <LeafFace side="right" />
        </div>

        {/* the latch sits over the seam, half on each leaf */}
        <button
          ref={latch}
          type="button"
          onClick={open}
          aria-label="Tap the latch to open the invitation"
          className="absolute top-1/2 left-1/2 z-10 flex size-20 -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-champagne sm:size-24"
          style={{
            background:
              "radial-gradient(circle at 34% 28%, #f7e3bd, #d8b06a 48%, #a97f38 78%, #6f5020)",
            boxShadow: "0 18px 40px -16px rgba(0,0,0,0.9), 0 0 0 1px rgba(240,212,156,0.35)",
          }}
        >
          <span className="absolute inset-0 animate-pulse-ring rounded-full border border-champagne/60" />
          <svg viewBox="0 0 48 48" className="size-9 sm:size-11" fill="none" aria-hidden>
            <path
              d="M24 6c6 7 6 12 0 18-6-6-6-11 0-18Z"
              fill="#3f0f2b"
              fillOpacity="0.8"
            />
            <circle cx="24" cy="29" r="7" stroke="#3f0f2b" strokeOpacity="0.8" strokeWidth="2" />
            <path d="M24 36v6M18 42h12" stroke="#3f0f2b" strokeOpacity="0.8" strokeWidth="2" />
          </svg>
        </button>
      </div>

      <div
        ref={hint}
        className="pointer-events-none absolute inset-x-0 bottom-10 z-20 text-center"
      >
        <p className="font-bride-label text-[0.55rem] text-champagne/80 sm:text-[0.62rem]">
          Tap the latch
        </p>
        <p className="font-bride-script mt-2 text-3xl text-rosegold sm:text-4xl">
          our door is open to you
        </p>
      </div>

      {/* Takes the hint's place once the leaves are open, so the photograph
          reads as a greeting rather than as decoration. */}
      <p
        ref={greeting}
        className="font-bride-label pointer-events-none absolute inset-x-0 bottom-12 z-20 translate-y-3 text-center text-[0.5rem] text-champagne/90 opacity-0 sm:text-[0.58rem]"
      >
        The Roda Family welcomes you
      </p>
    </div>
  );
}
