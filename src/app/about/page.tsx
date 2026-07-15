
import { Header } from "@/components/store/Header"
import { Footer } from "@/components/store/Footer"
import Link from "next/link"
import { Facebook, Twitter, Instagram, Quote } from "lucide-react"
import { getAboutContent } from "@/lib/data-helper"

export default function AboutPage() {
  const c = getAboutContent()
  return (
    <div className="flex min-h-screen flex-col bg-[#141618]">
      <Header />
      <main className="flex-1">
        <div className="border-b border-[#33383D] bg-[#1A1C1F] py-8 text-center">
          <h1 className="text-3xl font-bold uppercase text-white" style={{ fontFamily: "var(--font-lato)" }}>{c.title}</h1>
          <nav className="mt-2 text-xs text-[#9B9C9E]"><Link href="/" className="hover:text-[#E21818]">Home</Link><span className="mx-1">/</span><span className="text-white">{c.title}</span></nav>
        </div>
        <div className="py-12"><div className="mx-auto max-w-7xl px-4">
          <div className="mb-8 flex items-center justify-center gap-4"><span className="h-px w-12 bg-[#33383D]" /><h2 className="text-2xl font-bold uppercase text-white" style={{ fontFamily: "var(--font-lato)" }}>{c.section1Title}</h2><span className="h-px w-12 bg-[#33383D]" /></div>
          <div className="relative flex min-h-[400px] items-center overflow-hidden rounded-lg">
            <img src={c.section1Image} alt="" className="absolute inset-0 h-full w-full object-cover" style={{ filter: "grayscale(100%)" }} />
            <div className="absolute inset-0" style={{ background: "linear-gradient(to right, transparent 0%, transparent 45%, rgba(20,22,24,0.5) 49%, #141618 55%, #141618 100%)" }} />
            <div className="relative z-10 ml-auto w-1/2 p-8 text-right"><div className="ml-auto max-w-sm">
              <h3 className="mb-2 text-3xl font-bold text-white" style={{ fontFamily: "var(--font-lato)" }}>{c.section1Heading}</h3>
              <p className="mb-3 text-sm font-bold uppercase tracking-wider text-[#E21818]">{c.section1Subtitle}</p>
              <p className="mb-6 text-sm leading-relaxed text-white/80">{c.section1Description}</p>
              <button className="rounded bg-[#E21818] px-6 py-3 text-xs font-bold uppercase text-white hover:bg-[#C51515]">{c.section1Button}</button>
            </div></div>
          </div>
        </div></div>
        <div className="bg-[#1A1C1F] py-12"><div className="mx-auto max-w-7xl px-4">
          <div className="mb-8 flex items-center justify-center gap-4"><span className="h-px w-12 bg-[#33383D]" /><h2 className="text-2xl font-bold uppercase text-white" style={{ fontFamily: "var(--font-lato)" }}>{c.section2Title}</h2><span className="h-px w-12 bg-[#33383D]" /></div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {c.experts?.map((e: any, i: number) => (
              <div key={i} className="flex gap-4 bg-[#141618] p-6">
                <img src={e.img} alt={e.name} className="h-32 w-32 shrink-0 object-cover" />
                <div><h3 className="text-lg font-bold uppercase text-white">{e.name}</h3><p className="mb-2 text-xs text-[#E21818]">{e.role}</p><p className="mb-3 text-xs leading-relaxed text-[#9B9C9E]">{e.bio}</p><div className="flex gap-2"><Facebook className="h-4 w-4 text-[#9B9C9E] hover:text-[#E21818] cursor-pointer" /><Twitter className="h-4 w-4 text-[#9B9C9E] hover:text-[#E21818] cursor-pointer" /><Instagram className="h-4 w-4 text-[#9B9C9E] hover:text-[#E21818] cursor-pointer" /></div></div>
              </div>
            ))}
          </div>
        </div></div>
        <div className="py-12"><div className="mx-auto max-w-7xl px-4">
          <div className="mb-8 flex items-center justify-center gap-4"><span className="h-px w-12 bg-[#33383D]" /><h2 className="text-2xl font-bold uppercase text-white" style={{ fontFamily: "var(--font-lato)" }}>{c.section3Title}</h2><span className="h-px w-12 bg-[#33383D]" /></div>
          <div className="relative flex min-h-[350px] items-center justify-center overflow-hidden rounded-lg">
            <img src="/musicplace/images/home/tile-cables.png" alt="" className="absolute inset-0 h-full w-full object-cover opacity-30" /><div className="absolute inset-0 bg-[#141618]/80" />
            <div className="relative z-10 mx-auto max-w-2xl px-8 text-center">
              <Quote className="mx-auto mb-4 h-10 w-10 text-[#E21818]" />
              <p className="mb-6 text-sm leading-relaxed text-white/90">{c.testimonial?.quote}</p>
              <img src={c.testimonial?.image} alt={c.testimonial?.author} className="mx-auto mb-3 h-14 w-14 rounded-full object-cover" />
              <p className="text-sm font-bold uppercase text-white">{c.testimonial?.author}</p><p className="text-xs text-[#9B9C9E]">{c.testimonial?.role}</p>
            </div>
          </div>
        </div></div>
        <section className="border-y border-[#33383D] bg-[#1A1C1F] py-8"><div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-10 gap-y-4 px-4">{c.brands?.map((b: string) => <img key={b} src={`/musicplace/images/about-us/${b}`} alt="Brand" className="h-12 w-auto opacity-60 hover:opacity-100" />)}</div></section>
      </main>
      <Footer />
    </div>
  )
}
