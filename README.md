# Guddu & Avi — Bride's Side Wedding E-Card

An animated single-page wedding invitation for the **bride's side** — the Roda
family, Jaipur — built from their printed card. Every name, date, time, venue
and phone number on the site comes from that invitation, translated to English.

This is a **standalone project**. The groom's side (the Rai / Mathur family,
Jodhpur) is a separate card in a separate repo with a separate deployment, and
the two share no code. They are different invitations from different families;
keeping them apart is the point.

## Stack

| | |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack, Cache Components) |
| Styling | Tailwind CSS v4 (`@theme` tokens in `src/app/globals.css`) |
| Animation | Framer Motion (reveals, parallax, countdown, split text) |
| Scroll animation | GSAP + ScrollTrigger (pinned horizontal gallery) |
| Icons | lucide-react |
| Deploy | Vercel |

## Running it

```bash
npm install
```

```bash
npm run dev
```

```bash
npm run build && npm start
```

It runs on port 3000 by default. If the groom's card is already running there:

```bash
npm run dev -- -p 3001
```

## What's on the page

1. **The doors** — a pair of carved jharokha doors under a mehrab arch. Tapping
   the brass latch runs a GSAP timeline: the latch lifts and spins away, light
   builds behind the seam, the leaves swing open — and **the family is standing
   in the doorway with folded hands**. A caption fades in, the card holds for a
   beat, then the photograph dissolves as the frame pulls through. Shown once
   per browser session via `sessionStorage`. The tap is also what starts the
   music, since browsers only allow audio from a real user gesture.
2. **Hero** — a mehrab that draws itself in, both names set huge and revealed
   letter by letter, a live countdown, suspended gold dust on canvas, and
   pointer parallax on the arch and the bloom. The names pull apart as you
   scroll away.
3. **The Invitation** — the full formal wording and the Vishnu shloka, on an
   ivory leaf that tilts up into place as you scroll.
4. **The Bride & The Groom** — Vadhu Paksh and Var Paksh side by side as
   circular medallions. They sit in a rose-gold duotone until you hover, when
   the colour comes back.
5. **The Rituals** — the eight ceremonies as a gallery that scrolls *sideways*
   while the section stays pinned (GSAP ScrollTrigger). Each card has its date
   pill, times and an "Add to Calendar" `.ics` download. On a phone the same
   track becomes an ordinary snap-scrolling carousel — pinning fights the
   browser's own scroll there and feels broken.
6. **The Programme** — the Vaivahik Karyakram day by day, with the date parked
   on the left and swapping as you scroll through the four days.
7. **The Venue** — Bhakhar Paradise, with Google Maps directions, and both
   households' addresses and phone numbers.
8. **With Love, From All of Us** — opens with the family portrait under a
   *Padharo Sa*, then Uttarakanshi, Swagatkarta, Darshanabhilashi, Janwai
   Paksh and Nanihal Paksh, plus the **Baal Manuhar** children's invitation,
   which is the best thing on the printed card.
9. **RSVP** — a form that composes a WhatsApp message to the bride-side number.
   No backend, no database; the guest presses send themselves.
10. **Footer** — the Preshak block from the back of the envelope.

Plus a scroll-progress rule, a share button (Web Share API with clipboard
fallback), a music toggle, and a navigation rail of dots — vertical down the
right edge on a desktop, a glass pill along the bottom on a phone.

## Things you'll probably want to change

### `src/lib/data.ts` is the single source of truth

Names, lineage, the shlokas, every ritual with its time and calendar block, the
venue, both households, the family lists, the Baal Manuhar names and the
Preshak block. Edit there and the whole page follows.

Two assumptions are marked in that file:

- Paanigrahan Sanskar is printed as *shubh lagnanusar*, so its calendar block
  assumes **9:00 PM IST**. Fix `calStart` / `calEnd` once the muhurat is set.
- The card's "at the residence" note is applied to the 10 and 11 November
  functions; everything from 19 November is at Bhakhar Paradise.

### The welcome photograph

`public/bride/welcome.jpg` is the family photo shown behind the doors. Three
things make it sit *in* the card rather than on top of it:

- The doorway is pinned to the photo's own **2:3 ratio** (`aspect-2/3` with a
  clamped height), so it crops by nothing. Sizing it from the viewport instead
  — `h-[72vh] w-[min(84vw,440px)]` — turns the opening into a wide letterbox on
  a short or landscape screen and crops the family to a strip of torsos.
- It is masked to the same mehrab as the doorframe, and the arch already in the
  photograph lands almost exactly on it.
- A radial vignette, a wine wash and a bottom gradient sink the rectangular
  edges into the dark so the picture never shows a seam. The faces are left
  untouched.

To swap it, overwrite that file with another **portrait 2:3** image — subjects
centred, a little headroom — and nothing in the code needs to change.

### The two portraits, and why the groom is on the left

`public/art/bride.jpg` and `public/art/groom.jpg` are square medallions that
carry their own gold ring, dashed outer ring and lotus motifs.

- **They are framed as circles, not arches.** Cropping a square medallion into
  a 4:5 arch cut that ring off top and bottom. As a circle it survives intact
  and becomes the frame.
- **The groom is on the left on purpose.** In the artwork the bride is turned
  to her right (she looks toward the left edge of her frame) and the groom the
  other way, so bride-left/groom-right had the two of them looking away from
  each other, out of the page. Swapped, they face each other across the
  divider. If you replace the artwork with differently-facing portraits, swap
  the two `<Portrait>` lines in `src/components/Couple.tsx` back.

### The family portrait

`public/bride/family.jpg` opens the family section. The frame is built from
the photograph's own aspect ratio (`familyPhoto.ratio` in `src/lib/data.ts`),
so it is never cropped; it is masked to the same mehrab used elsewhere, and
its edges are feathered into the wine ground. Unlike the couple medallions it
is left in full colour — it is already gold, cream and rose, so it belongs as
it is. Swap the file and update `ratio` to match.

### Ritual images

`public/festivities/*.png` are illustrated scenes, mapped to rituals in
`src/lib/data.ts`. Swap the files or repoint `image` / `imageAlt` there.

### The music, and swapping in a real song

`public/audio/wedding-theme.wav` is an **original royalty-free instrumental
written for this project** — a soothing North-Indian wedding cue: a tanpura
drone under a santoor pluck, a harmonium pad and a slow bansuri line, in a
Khamaj-ish mode at 70 BPM. Regenerate or edit it with:

```bash
python3 scripts/generate-music.py
```

It is a 27.4-second seamless loop (the render overruns the loop and folds the
tail back over the head, so there is no click at the wrap).

**To use an actual song instead** — put the file in `public/audio/` and change
one line at the top of `src/lib/audio.ts`:

```ts
const SRC = "/audio/your-song.mp3";
```

That is the whole change. An `.mp3` will be far smaller than the bundled
`.wav`, and nothing else needs touching.

One caution, so the decision is yours and informed: commercial film and folk
recordings are copyrighted in both the recording *and* the underlying tune.
For a private invitation link shared with family this is rarely an issue in
practice. If the page is public or indexed, prefer a licensed track, a
royalty-free one, or the instrumental above.

### The share preview

`public/og.jpg` is currently the groom-side preview image. Replace it with
something from this card — a 1200×630 crop of the welcome photograph works
well.

## Two things worth knowing if you edit it

- **The `--font-bride-*` tokens and the next/font variables must meet on the
  same element.** Both are on `<html>` here. A custom property is substituted
  in the scope it is *declared* in, so if the tokens sit on `:root` while
  `--font-italiana` sits on some wrapper div further down, every heading
  resolves to nothing and silently falls back.
- **Split headings use `foil`, not `text-rosefoil`.** `text-rosefoil` clips a
  background to the element's own glyphs, and a split heading has no text of
  its own — only transformed, overflow-clipped letter spans, so the clip has
  nothing to catch and the words come out invisible. `foil` puts the gradient
  on each letter instead.

## Deploying to Vercel

This deploys as its own project, separate from the groom's card, so it gets its
own link.

```bash
npx vercel --prod
```

Or push to its own GitHub repo and import it at
[vercel.com/new](https://vercel.com/new); the defaults are correct for Next.js.

Set one environment variable so WhatsApp and social previews use absolute URLs:

```
NEXT_PUBLIC_SITE_URL=https://your-bride-domain.vercel.app
```

## Accessibility & performance notes

- Every animation respects `prefers-reduced-motion`: the GSAP timelines check
  it directly, the page is wrapped in `<MotionConfig reducedMotion="user">` for
  Framer, the marquee stops, and the gold dust never starts.
- The countdown renders a fixed-height placeholder before it hydrates, so the
  hero doesn't shift on load.
- The welcome photograph is `loading="eager" fetchPriority="high"` so it is
  decoded before the latch is ever tapped. (`priority` is deprecated in
  Next 16.)
- `overflow-x` is clipped on `<html>`, never on `<body>` — putting it on the
  body makes the body a scroll container and silently desyncs `window.scrollY`
  from the real scroller, breaking every scroll-driven animation on the page.
