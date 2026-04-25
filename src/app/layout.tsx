import type { Metadata, Viewport } from "next";
import { Bebas_Neue, Space_Mono, DM_Sans } from "next/font/google";
import "./globals.css";

// Display font  (hero text, titles)
const bebasNeue = Bebas_Neue({
  variable: "--font-display",
  subsets:  ["latin"],
  weight:   "400",
  display:  "swap",
});

// Monospace  (HUD labels, tags, code-like elements)
const spaceMono = Space_Mono({
  variable: "--font-mono",
  subsets:  ["latin"],
  weight:   ["400", "700"],
  display:  "swap",
});

// Body (readable prose in data panels)
const dmSans = DM_Sans({
  variable: "--font-sans",
  subsets:  ["latin"],
  weight:   ["300", "400", "500"],
  display:  "swap",
});

export const metadata: Metadata = {
  title:       "Kunal Madaan — Full Stack Developer",
  description: "An interactive space journey through the work of Kunal Madaan — full stack developer specialising in React, Next.js, Three.js and Node.js.",
  openGraph: {
    title:       "Kunal Madaan — Full Stack Developer",
    description: "Scroll through space to explore my work.",
    type:        "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${bebasNeue.variable} ${spaceMono.variable} ${dmSans.variable}`}
    >
      <body className="bg-black text-white antialiased min-h-full">
        {children}
      </body>
    </html>
  );
}
