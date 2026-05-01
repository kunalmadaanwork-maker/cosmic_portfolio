// src/app/layout.tsx
import type { Metadata, Viewport } from "next";
import { Bebas_Neue, Space_Mono, DM_Sans } from "next/font/google";
import "./globals.css";

// 1. Initialize the fonts (This is what your editor says is missing)
const bebasNeue = Bebas_Neue({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const spaceMono = Space_Mono({
  variable: "--font-mono",
  subsets:["latin"],
  weight: ["400", "700"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  display: "swap",
});

// 2. Metadata
export const metadata: Metadata = {
  title: "Kunal Madaan — Full Stack Developer",
  description:
    "An interactive space journey through the work of Kunal Madaan — full stack developer specialising in React, Next.js, Three.js and Node.js.",
};

export const viewport: Viewport = {
  themeColor: "#000000",
};

// 3. Root Layout (With Hydration Fixes)
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${bebasNeue.variable} ${spaceMono.variable} ${dmSans.variable}`}
      suppressHydrationWarning // <-- Hydration fix
    >
      <body
        suppressHydrationWarning // <-- Hydration fix
        style={{
          margin: 0,
          padding: 0,
          backgroundColor: "#000000",
          color: "#ffffff",
          overflowX: "hidden",
          WebkitFontSmoothing: "antialiased",
          MozOsxFontSmoothing: "grayscale",
        }}
      >
        {children}
      </body>
    </html>
  );
}