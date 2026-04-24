import type { Metadata } from "next";
import { Space_Mono, Bebas_Neue } from "next/font/google";
import "./globals.css";

const spaceMono = Space_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const bebasNeue = Bebas_Neue({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Kunal Madaan — Full Stack Developer",
  description:
    "Interactive 3D portfolio — architecting scalable web solutions at the intersection of logic and creative engineering.",
  openGraph: {
    title: "Kunal Madaan — Full Stack Developer",
    description: "Scroll through space to explore my work.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceMono.variable} ${bebasNeue.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-black text-white overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}