import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "../components/nav/header";

// Load Inter font with Latin subset
// Inter is a highly legible, modern sans-serif optimized for UI
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "SoloSheThings - Safe Travels for Solo Female Travelers",
  description: "A community platform empowering solo female travelers with safe spots, travel stories, and community support.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={inter.className}>
        <Header />
        {children}
      </body>
    </html>
  );
}

