import type { Metadata } from "next"
import { Playfair_Display, DM_Sans } from "next/font/google"
import "./globals.css"

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "600", "700"],
  style: ["normal", "italic"],
})

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["400", "500", "700"],
})

export const metadata: Metadata = {
  title: "Solo SHE Things - Safe Travels for Solo Female Travelers",
  description:
    "A community dedicated to empowering solo female travelers. Discover destinations, safety tips, and inspiring stories from fearless women around the world.",
  keywords: ["solo travel", "female travelers", "travel blog", "women travel", "travel community"],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${playfairDisplay.variable} ${dmSans.variable} font-sans antialiased`}>{children}</body>
    </html>
  )
}
