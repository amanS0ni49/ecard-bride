import type { RitualItem } from "./data";

const escape = (s: string) => s.replace(/([,;\\])/g, "\\$1").replace(/\n/g, "\\n");

/** Minimal RFC 5545 file so guests can drop any ritual straight into their calendar. */
export function buildIcs(ritual: RitualItem): string {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Guddu & Avi//Bride Side Invitation//EN",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:${ritual.id}-guddu-avi-2026@wedding`,
    `DTSTAMP:${ritual.calStart}`,
    `DTSTART:${ritual.calStart}`,
    `DTEND:${ritual.calEnd}`,
    `SUMMARY:${escape(`${ritual.name} — Guddu & Avi`)}`,
    `DESCRIPTION:${escape(ritual.blurb)}`,
    `LOCATION:${escape(ritual.venue)}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  return lines.join("\r\n");
}

export function downloadIcs(ritual: RitualItem) {
  const blob = new Blob([buildIcs(ritual)], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `guddu-avi-${ritual.id}.ics`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export const mapsUrl = (query: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
