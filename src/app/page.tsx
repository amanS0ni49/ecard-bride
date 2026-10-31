"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { AnimatePresence, MotionConfig } from "framer-motion";
import Blessings from "@/components/Blessings";
import Doors from "@/components/Doors";
import Controls from "@/components/Controls";
import Couple from "@/components/Couple";
import Dock from "@/components/Dock";
import Family from "@/components/Family";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Invitation from "@/components/Invitation";
import Programme from "@/components/Programme";
import Rituals from "@/components/Rituals";
import Rsvp from "@/components/Rsvp";
import Venue from "@/components/Venue";
import { play as playMusic } from "@/lib/audio";

const SEEN_KEY = "guddu-avi:doors-opened";

/**
 * Whether this guest already opened the doors earlier in the session.
 * Read through useSyncExternalStore rather than an effect so the prerendered
 * markup (no doors) hydrates cleanly before the real value is applied.
 */
const seenStore = {
  subscribe: () => () => {},
  get: () => {
    try {
      return sessionStorage.getItem(SEEN_KEY) === "1";
    } catch {
      return false; // private mode — just show the doors
    }
  },
  getServer: () => true,
};

export default function Page() {
  const seenAtMount = useSyncExternalStore(
    seenStore.subscribe,
    seenStore.get,
    seenStore.getServer,
  );
  const [dismissed, setDismissed] = useState(false);
  const showDoors = !seenAtMount && !dismissed;

  useEffect(() => {
    // A reload should land on the hero, not wherever the guest left off.
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  }, []);

  const opened = () => {
    try {
      sessionStorage.setItem(SEEN_KEY, "1");
    } catch {
      /* ignore */
    }
    window.scrollTo({ top: 0, behavior: "auto" });
    setDismissed(true);
  };

  // Tapping the latch is a real user gesture, which is what lets the music
  // start; browsers would block it otherwise. Guests who skip the doors
  // (second visit in a session) use the toggle in the corner instead.
  const unlatched = () => {
    void playMusic();
  };

  const started = !showDoors;

  // `reducedMotion="user"` makes every Framer transform/layout animation on
  // the card honour the OS setting — the CSS media query in globals.css only
  // reaches CSS animations, and the GSAP timelines check it themselves.
  return (
    <MotionConfig reducedMotion="user">
      <AnimatePresence>
        {showDoors && <Doors key="doors" onOpen={unlatched} onDone={opened} />}
      </AnimatePresence>

      <Controls visible={started} />
      <Dock visible={started} />

      <main>
        <Hero started={started} />
        <Invitation />
        <Blessings />
        <Couple />
        <Rituals />
        <Programme />
        <Venue />
        <Family />
        <Rsvp />
      </main>

      <Footer />
    </MotionConfig>
  );
}
