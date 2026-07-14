import { Header } from "@/components/store/Header"
import { Footer } from "@/components/store/Footer"
import Link from "next/link"
import { Facebook, Twitter, Instagram, ArrowRight, Quote } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#141618]">
      <Header />
      <main className="flex-1">
        {/* Page Title Bar */}
        <div className="border-b border-[#33383D] bg-[#1A1C1F] py-8 text-center">
          <h1 className="text-3xl font-bold uppercase text-white" style={{ fontFamily: "var(--font-lato)" }}>About Us</h1>
          <nav className="mt-2 text-xs text-[#9B9C9E]">
            <Link href="/" className="hover:text-[#E21818]">Home</Link>
            <span className="mx-1">/</span>
            <span className="text-white">About Us</span>
          </nav>
        </div>

        {/* Section 1: What Makes Us Different? */}
        <div className="py-12">
          <div className="mx-auto max-w-7xl px-4">
            <div className="mb-8 flex items-center justify-center gap-4">
              <span className="h-px w-12 bg-[#33383D]" />
              <h2 className="text-2xl font-bold uppercase text-white" style={{ fontFamily: "var(--font-lato)" }}>What Makes us Different?</h2>
              <span className="h-px w-12 bg-[#33383D]" />
            </div>
            {/* Full-width image with overlay text — 50/50 split, image fades into solid black */}
            <div className="relative flex min-h-[400px] items-center overflow-hidden rounded-lg">
              <img src="/musicplace/images/home/3-2.jpg" alt="" className="absolute inset-0 h-full w-full object-cover" style={{ filter: "grayscale(100%)" }} />
              {/* Gradient: transparent 0-45%, fade to solid black at 55%, solid black 55-100% */}
              <div className="absolute inset-0" style={{ background: "linear-gradient(to right, transparent 0%, transparent 45%, rgba(20,22,24,0.5) 49%, #141618 55%, #141618 100%)" }} />
              <div className="relative z-10 ml-auto w-1/2 p-8 text-right">
                <div className="ml-auto max-w-sm">
                  <h3 className="mb-2 text-3xl font-bold text-white" style={{ fontFamily: "var(--font-lato)" }}>The Music Workshop</h3>
                  <p className="mb-3 text-sm font-bold uppercase tracking-wider text-[#E21818]">Established in 1993</p>
                  <p className="mb-6 text-sm leading-relaxed text-white/80">The Workshops Series was created to help people of all levels learn about the instruments and gear they can use to make the music they love.</p>
                  <button className="rounded bg-[#E21818] px-6 py-3 text-xs font-bold uppercase text-white hover:bg-[#C51515]">More Info</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Meet Our Experts */}
        <div className="bg-[#1A1C1F] py-12">
          <div className="mx-auto max-w-7xl px-4">
            <div className="mb-8 flex items-center justify-center gap-4">
              <span className="h-px w-12 bg-[#33383D]" />
              <h2 className="text-2xl font-bold uppercase text-white" style={{ fontFamily: "var(--font-lato)" }}>Meet Our Experts</h2>
              <span className="h-px w-12 bg-[#33383D]" />
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {/* Team Member 1 */}
              <div className="flex gap-4 bg-[#141618] p-6">
                <img src="/musicplace/images/our-staff/team-1-270x220.jpg" alt="" className="h-32 w-32 shrink-0 object-cover" />
                <div>
                  <h3 className="text-lg font-bold uppercase text-white">Douglas Adams</h3>
                  <p className="mb-2 text-xs text-[#E21818]">Manager</p>
                  <p className="mb-3 text-xs leading-relaxed text-[#9B9C9E]">Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.</p>
                  <div className="flex gap-2">
                    <Facebook className="h-4 w-4 text-[#9B9C9E] hover:text-[#E21818] cursor-pointer" />
                    <Twitter className="h-4 w-4 text-[#9B9C9E] hover:text-[#E21818] cursor-pointer" />
                    <Instagram className="h-4 w-4 text-[#9B9C9E] hover:text-[#E21818] cursor-pointer" />
                  </div>
                </div>
              </div>
              {/* Team Member 2 */}
              <div className="flex gap-4 bg-[#141618] p-6">
                <img src="/musicplace/images/our-staff/team-2-270x220.jpg" alt="" className="h-32 w-32 shrink-0 object-cover" />
                <div>
                  <h3 className="text-lg font-bold uppercase text-white">Eula Rose</h3>
                  <p className="mb-2 text-xs text-[#E21818]">Manager</p>
                  <p className="mb-3 text-xs leading-relaxed text-[#9B9C9E]">Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.</p>
                  <div className="flex gap-2">
                    <Facebook className="h-4 w-4 text-[#9B9C9E] hover:text-[#E21818] cursor-pointer" />
                    <Twitter className="h-4 w-4 text-[#9B9C9E] hover:text-[#E21818] cursor-pointer" />
                    <Instagram className="h-4 w-4 text-[#9B9C9E] hover:text-[#E21818] cursor-pointer" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: What People Say? */}
        <div className="py-12">
          <div className="mx-auto max-w-7xl px-4">
            <div className="mb-8 flex items-center justify-center gap-4">
              <span className="h-px w-12 bg-[#33383D]" />
              <h2 className="text-2xl font-bold uppercase text-white" style={{ fontFamily: "var(--font-lato)" }}>What People Say?</h2>
              <span className="h-px w-12 bg-[#33383D]" />
            </div>
            {/* Testimonial with generated background image */}
            <div className="relative flex min-h-[350px] items-center justify-center overflow-hidden rounded-lg">
              <img src="/musicplace/images/home/tile-cables.png" alt="" className="absolute inset-0 h-full w-full object-cover opacity-30" />
              <div className="absolute inset-0 bg-[#141618]/80" />
              <div className="relative z-10 mx-auto max-w-2xl px-8 text-center">
                <Quote className="mx-auto mb-4 h-10 w-10 text-[#E21818]" />
                <p className="mb-6 text-sm leading-relaxed text-white/90">I love this website. It has a great selection of innovative products. I will be a returning customer forever! Especially since the shipping is fast! Very impressed with prices and free shipping. Thank you!</p>
                <img src="/musicplace/images/home/testi-1-75x75.jpg" alt="" className="mx-auto mb-3 h-14 w-14 rounded-full object-cover" />
                <p className="text-sm font-bold uppercase text-white">Kelley Webb</p>
                <p className="text-xs text-[#9B9C9E]">Singer</p>
              </div>
            </div>
          </div>
        </div>

        {/* Brand Logos — using actual brand images from crawl (white logos on dark bg) */}
        <section className="border-y border-[#33383D] bg-[#1A1C1F] py-8">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-10 gap-y-4 px-4">
            {["1-1.png", "2-1.png", "3-1.png", "4-1.png", "5-1.png", "6-1.png"].map(logo => (
              <img
                key={logo}
                src={`/musicplace/images/about-us/${logo}`}
                alt="Brand"
                className="h-12 w-auto opacity-60 transition-opacity hover:opacity-100"
              />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
