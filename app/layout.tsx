import type { Metadata, Viewport } from "next"
import { Fraunces, Rokkitt } from "next/font/google"
import './globals.css'
import './styles/contour-system.css'

const rokkitt = Rokkitt({
  subsets: ["latin"],
  variable: "--font-rokkitt",
  weight: ["300", "400", "500", "600", "700"],
})

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "700", "900"],
  style: ["normal", "italic"],
})

export const metadata: Metadata = {
  title: "Solo SHE Things - Safe Travels for Solo Female Travelers",
  description:
    "A community dedicated to empowering solo female travelers. Discover destinations, safety tips, and inspiring stories from fearless women around the world.",
  keywords: ["solo travel", "female travelers", "travel blog", "women travel", "travel community"],
}

/** Enables `env(safe-area-inset-*)` for notched devices when used with `shell-inline` / layout padding. */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-background">
      <body
        className={`${rokkitt.variable} ${fraunces.variable} font-sans antialiased min-h-dvh overflow-x-clip`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  )
}
