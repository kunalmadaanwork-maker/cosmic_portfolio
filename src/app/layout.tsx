import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "Kunal Madaan | The Kingdom of Science",
  description: "A Cinematic Journey through the Portfolio of a Full Stack Architect",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="bg-black">
      <body className={`${inter.variable} ${jetbrains.variable} font-sans antialiased bg-black`}>
        {children}
      </body>
    </html>
  );
}