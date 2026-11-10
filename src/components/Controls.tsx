"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { Check, Music2, Share2, VolumeX } from "lucide-react";
import { subscribe, toggle } from "@/lib/audio";

/**
 * Scroll progress rule plus the share and music controls.
 * Shares the one <audio> element in lib/audio, same as the groom's card.
 */
export default function Controls({ visible }: { visible: boolean }) {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.3 });

  const [playing, setPlaying] = useState(false);
  const [copied, setCopied] = useState(false);

  // Mirrors the shared player — the door tap may already have started it.
  useEffect(() => subscribe(setPlaying), []);

  const share = async () => {
    const data = {
      title: "Guddu & Avi — Wedding Invitation",
      text: "You are invited to the wedding of Guddu (Janhavi) & Avi (Bhavesh), 20 November 2026, Jaipur.",
      url: window.location.href,
    };
    if (navigator.share) {
      try {
        await navigator.share(data);
        return;
      } catch {
        /* guest dismissed the sheet — fall through to copying */
      }
    }
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      /* clipboard unavailable; nothing useful left to do */
    }
  };

  const btn =
    "flex size-10 cursor-pointer items-center justify-center rounded-full border border-champagne/30 bg-wine-900/70 text-champagne backdrop-blur-md transition-colors hover:border-champagne hover:bg-champagne hover:text-wine-950";

  return (
    <>
      <motion.div
        className="fixed inset-x-0 top-0 z-70 h-[2px] origin-left bg-gradient-to-r from-rosegold via-champagne to-rosegold"
        style={{ scaleX: progress }}
        aria-hidden
      />

      <motion.div
        className="fixed top-5 left-5 z-60 flex gap-2.5"
        initial={{ opacity: 0, x: -24 }}
        animate={visible ? { opacity: 1, x: 0 } : { opacity: 0, x: -24 }}
        transition={{ duration: 0.6, delay: visible ? 0.7 : 0 }}
      >
        <button type="button" onClick={share} className={btn} aria-label="Share this invitation">
          {copied ? (
            <Check className="size-4" strokeWidth={1.7} />
          ) : (
            <Share2 className="size-4" strokeWidth={1.6} />
          )}
        </button>

        <button
          type="button"
          onClick={() => toggle()}
          className={btn}
          aria-label={playing ? "Pause music" : "Play music"}
          aria-pressed={playing}
        >
          {playing ? (
            <Music2 className="size-4 animate-pulse" strokeWidth={1.6} />
          ) : (
            <VolumeX className="size-4" strokeWidth={1.6} />
          )}
        </button>
      </motion.div>
    </>
  );
}
