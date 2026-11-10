import type { Metadata, Viewport } from "next";
import { Italiana, Jost, Marcellus, Pinyon_Script } from "next/font/google";
import "./globals.css";

/**
 * The bride's card runs a high-contrast Didone display, a geometric sans for
 * everything functional, and a fine copperplate script.
 *
 * The font variables go on <html>, which is also where the `--font-bride-*`
 * tokens in globals.css are declared — a custom property is substituted in
 * the scope it is declared in, so the two have to meet on the same element
 * or every heading silently falls back.
 */
const italiana = Italiana({
  variable: "--font-italiana",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

const marcellus = Marcellus({
  variable: "--font-marcellus",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

const pinyon = Pinyon_Script({
  variable: "--font-pinyon",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600"],
  display: "swap",
});

const title = "Guddu & Avi · Wedding Invitation · 20 November 2026";
const description =
  "Smt. Pinky & Late Shri Ashok Ji Roda request the honour of your presence at the marriage of their daughter Guddu (Janhavi) with Avi (Bhavesh) — Friday, 20th November 2026, Bhakhar Paradise, Jaipur.";

export const metadata: Metadata = {
  // Set NEXT_PUBLIC_SITE_URL on Vercel so share cards resolve absolute URLs.
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title,
  description,
  openGraph: {
    title,
    description,
    type: "website",
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "Guddu & Avi — Wedding Invitation" }],
  },
  twitter: { card: "summary_large_image", title, description, images: ["/og.jpg"] },
  icons: { icon: "/art/ganesha.png" },
};

export const viewport: Viewport = {
  themeColor: "#16040f",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${italiana.variable} ${marcellus.variable} ${pinyon.variable} ${jost.variable} antialiased`}
    >
      <body>{children}</body>
    </html>
  );
}
