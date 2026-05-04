import type { Metadata } from "next"
import { Rokkitt, Geist } from "next/font/google"
import "./globals.css"
import { cn } from "@/lib/utils";
import { TooltipProvider } from "@/components/ui/tooltip";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

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
    <html lang="en" className={cn("bg-background", "font-sans", geist.variable)}>
      <body className={`${rokkitt.variable} font-sans antialiased`} suppressHydrationWarning>
        <TooltipProvider>{children}</TooltipProvider>
      </body>
    </html>
  )
}
