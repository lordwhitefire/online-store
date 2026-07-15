import type { Metadata } from "next"
import { Hind, Lato } from "next/font/google"
import "./globals.css"
import { ClerkProvider } from "@clerk/nextjs"
import { ToastContainer } from "@/components/store/Toast"

const hind = Hind({ subsets: ["latin"], variable: "--font-hind", weight: ["300", "400", "600", "700"] })
const lato = Lato({ subsets: ["latin"], variable: "--font-lato", weight: ["300", "400", "700"] })

export const metadata: Metadata = {
  title: { default: "Music Place — Professional Music Equipment & Instruments", template: "%s | Music Place" },
  description: "Your premier destination for professional music instruments, recording equipment, DJ gear, and audio accessories. Free shipping on orders over $100.",
  keywords: ["music store", "instruments", "guitars", "drums", "keyboards", "recording equipment", "DJ gear", "headphones", "microphones", "turntables"],
  authors: [{ name: "Music Place" }],
  creator: "Music Place",
  publisher: "Music Place",
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
  openGraph: { type: "website", locale: "en_US", url: "https://musicplace.themerex.net", siteName: "Music Place", title: "Music Place — Professional Music Equipment & Instruments", description: "Your premier destination for professional music instruments, recording equipment, DJ gear, and audio accessories.", images: [{ url: "/musicplace/hero-original.jpg", width: 1440, height: 822, alt: "Music Place Store" }] },
  twitter: { card: "summary_large_image", title: "Music Place — Professional Music Equipment & Instruments", description: "Your premier destination for professional music instruments, recording equipment, DJ gear, and audio accessories.", images: ["/musicplace/hero-original.jpg"] },
  alternates: { canonical: "https://musicplace.themerex.net" },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${hind.variable} ${lato.variable}`}>
        <body className="font-sans antialiased">
          <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:left-0 focus:top-0 focus:z-[100] focus:bg-[#E21818] focus:px-4 focus:py-2 focus:text-white">Skip to main content</a>
          {children}
          <ToastContainer />
        </body>
      </html>
    </ClerkProvider>
  )
}
