import type { Metadata, Viewport } from "next"
import { Anton, Covered_By_Your_Grace, Fraunces, Plus_Jakarta_Sans, Rokkitt } from "next/font/google"
import { LenisProvider } from "@/components/providers/lenis-provider"
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

/** Navbar logo — "SOLO" and "THINGS" */
const anton = Anton({
  subsets: ["latin"],
  variable: "--font-anton",
  weight: "400",
})

/** Navbar logo — "SHE" */
const coveredByYourGrace = Covered_By_Your_Grace({
  subsets: ["latin"],
  variable: "--font-covered-grace",
  weight: "400",
})

/** Navbar UI + hero heading */
const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  weight: ["400", "500", "600", "700", "800"],
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
        className={`${rokkitt.variable} ${fraunces.variable} ${anton.variable} ${coveredByYourGrace.variable} ${plusJakartaSans.variable} font-sans antialiased min-h-dvh overflow-x-clip`}
        suppressHydrationWarning
      >
        <LenisProvider>{children}</LenisProvider>
      </body>
    </html>
  )
}
