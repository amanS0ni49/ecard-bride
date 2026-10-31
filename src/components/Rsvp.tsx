"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Minus, Plus, Send } from "lucide-react";
import { households, rituals } from "@/lib/data";
import { Reveal, SectionHeading } from "./Ornaments";

const EASE = [0.16, 1, 0.3, 1] as const;

/** Underlined fields rather than boxes — the whole form reads as one letter. */
const field =
  "w-full border-b border-champagne/25 bg-transparent pb-3 text-lg font-light text-blush-100 placeholder:text-blush-200/30 outline-none transition-colors focus:border-champagne";

export default function Rsvp() {
  const [name, setName] = useState("");
  const [coming, setComing] = useState(true);
  const [guests, setGuests] = useState(2);
  const [picked, setPicked] = useState<string[]>(["sagai-sangeet", "paanigrahan"]);
  const [note, setNote] = useState("");
  const [sent, setSent] = useState(false);

  const toggle = (id: string) =>
    setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));

  // No backend anywhere — the form hands a ready-written note to WhatsApp and
  // the guest presses send themselves.
  const message = useMemo(() => {
    const chosen = rituals.filter((r) => picked.includes(r.id)).map((r) => r.name);
    const lines = [
      "Namaste! RSVP for Guddu & Avi's wedding.",
      "",
      `Name: ${name.trim() || "—"}`,
      coming
        ? `Attending: Yes (${guests} ${guests === 1 ? "guest" : "guests"})`
        : "Attending: Sadly unable to make it",
    ];
    if (coming && chosen.length) lines.push(`Joining for: ${chosen.join(", ")}`);
    if (note.trim()) lines.push("", `Message: ${note.trim()}`);
    return lines.join("\n");
  }, [name, coming, guests, picked, note]);

  const waHref = `https://wa.me/${households[0].phones[0].tel.replace("+", "")}?text=${encodeURIComponent(message)}`;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    window.open(waHref, "_blank", "noopener,noreferrer");
    setSent(true);
  };

  return (
    <section id="rsvp" className="relative overflow-hidden bg-wine-950 px-5 py-24 sm:py-32">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-champagne/30 to-transparent"
        aria-hidden
      />

      <div className="relative mx-auto max-w-2xl">
        <SectionHeading
          kicker="Kindly let us know"
          title="Will You Be There?"
          sub="This opens WhatsApp with your reply already written — you just press send."
        />

        <div className="glass-panel px-6 py-10 sm:px-12 sm:py-14">
          <AnimatePresence mode="wait">
            {sent ? (
              <motion.div
                key="done"
                className="flex flex-col items-center py-10 text-center"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: EASE }}
              >
                <motion.span
                  className="flex size-16 items-center justify-center rounded-full border border-champagne/40 text-champagne"
                  initial={{ scale: 0, rotate: -40 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 240, damping: 15, delay: 0.1 }}
                >
                  <Check className="size-7" strokeWidth={1.5} />
                </motion.span>
                <p className="font-bride-script text-rosefoil mt-7 text-5xl">Thank you</p>
                <p className="mt-4 max-w-sm text-sm leading-relaxed font-light text-blush-200/70">
                  Your reply is waiting in WhatsApp — just hit send. We cannot wait to have
                  you with us.
                </p>
                <button
                  type="button"
                  onClick={() => setSent(false)}
                  className="font-bride-label mt-9 cursor-pointer border-b border-champagne/30 pb-1 text-[0.44rem] text-champagne transition-colors hover:border-champagne hover:text-rosegold"
                >
                  Send another reply
                </button>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={submit}
                className="space-y-11"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
              >
                <Reveal>
                  <label htmlFor="rsvp-name" className="font-bride-label block text-[0.44rem] text-rosegold">
                    Your name
                  </label>
                  <input
                    id="rsvp-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Who is replying?"
                    required
                    className={`${field} mt-4`}
                  />
                </Reveal>

                <Reveal i={1}>
                  <p className="font-bride-label text-[0.44rem] text-rosegold">
                    Will you join us?
                  </p>
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    {[
                      { value: true, label: "Yes, with joy" },
                      { value: false, label: "Sorry, can't" },
                    ].map((opt) => (
                      <button
                        key={String(opt.value)}
                        type="button"
                        onClick={() => setComing(opt.value)}
                        aria-pressed={coming === opt.value}
                        className={`font-bride-label relative cursor-pointer border px-4 py-4 text-[0.44rem] transition-colors ${
                          coming === opt.value
                            ? "border-champagne text-champagne"
                            : "border-champagne/20 text-blush-200/50 hover:border-champagne/45"
                        }`}
                      >
                        {coming === opt.value && (
                          <motion.span
                            layoutId="rsvp-choice"
                            className="absolute inset-0 -z-10 bg-champagne/10"
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                          />
                        )}
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </Reveal>

                <AnimatePresence initial={false}>
                  {coming && (
                    <motion.div
                      key="details"
                      className="space-y-11 overflow-hidden"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.5, ease: EASE }}
                    >
                      <div>
                        <p className="font-bride-label text-[0.44rem] text-rosegold">
                          How many of you?
                        </p>
                        <div className="mt-4 flex items-center gap-6">
                          <Stepper
                            label="One fewer guest"
                            onClick={() => setGuests((g) => Math.max(1, g - 1))}
                          >
                            <Minus className="size-3.5" strokeWidth={1.8} />
                          </Stepper>
                          <span className="font-bride-display min-w-10 text-center text-4xl text-champagne tabular-nums">
                            {guests}
                          </span>
                          <Stepper
                            label="One more guest"
                            onClick={() => setGuests((g) => Math.min(30, g + 1))}
                          >
                            <Plus className="size-3.5" strokeWidth={1.8} />
                          </Stepper>
                        </div>
                      </div>

                      <div>
                        <p className="font-bride-label text-[0.44rem] text-rosegold">
                          Which ceremonies?
                        </p>
                        <div className="mt-4 flex flex-wrap gap-2.5">
                          {rituals.map((r) => {
                            const on = picked.includes(r.id);
                            return (
                              <button
                                key={r.id}
                                type="button"
                                onClick={() => toggle(r.id)}
                                aria-pressed={on}
                                className={`cursor-pointer rounded-full border px-4 py-2 text-[0.78rem] font-light transition-colors ${
                                  on
                                    ? "border-champagne bg-champagne/12 text-champagne"
                                    : "border-champagne/20 text-blush-200/50 hover:border-champagne/45"
                                }`}
                              >
                                {r.name}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div>
                  <label htmlFor="rsvp-note" className="font-bride-label block text-[0.44rem] text-rosegold">
                    A word for the couple
                  </label>
                  <textarea
                    id="rsvp-note"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    rows={2}
                    placeholder="Optional, but always welcome"
                    className={`${field} mt-4 resize-none`}
                  />
                </div>

                <motion.button
                  type="submit"
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.98 }}
                  className="font-bride-label group flex w-full cursor-pointer items-center justify-center gap-3 border border-champagne/45 py-5 text-[0.46rem] text-champagne transition-colors hover:bg-champagne hover:text-wine-950 disabled:opacity-40"
                  disabled={!name.trim()}
                >
                  <Send className="size-3.5 transition-transform group-hover:translate-x-1" strokeWidth={1.5} />
                  Send via WhatsApp
                </motion.button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

function Stepper({
  children,
  label,
  onClick,
}: {
  children: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="flex size-10 cursor-pointer items-center justify-center rounded-full border border-champagne/30 text-champagne transition-colors hover:border-champagne hover:bg-champagne hover:text-wine-950"
    >
      {children}
    </button>
  );
}
