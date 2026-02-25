import type { Metadata } from "next"
import { Rokkitt } from "next/font/google"
import "./globals.css"

const rokkitt = Rokkitt({
  subsets: ["latin"],
  variable: "--font-rokkitt",
  weight: ["300", "400", "500", "600", "700"],
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
      <body className={`${rokkitt.variable} font-sans antialiased`} suppressHydrationWarning>{children}</body>
    </html>
  )
}
