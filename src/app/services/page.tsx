
import { Header } from "@/components/store/Header"
import { Footer } from "@/components/store/Footer"
import Link from "next/link"
import { Music, Truck, Wrench, Headphones, Award, Clock, Quote, Check } from "lucide-react"
import { getServicesContent } from "@/lib/data-helper"

const iconMap: Record<string, any> = { music: Music, wrench: Wrench, truck: Truck, headphones: Headphones, award: Award, clock: Clock }

export default function ServicesPage() {
  const c = getServicesContent()
  return (
    <div className="flex min-h-screen flex-col bg-[#141618]">
      <Header />
      <main className="flex-1">
        <div className="border-b border-[#33383D] bg-[#1A1C1F] py-8 text-center"><h1 className="text-3xl font-bold uppercase text-white" style={{ fontFamily: "var(--font-lato)" }}>{c.title}</h1><nav className="mt-2 text-xs text-[#9B9C9E]"><Link href="/" className="hover:text-[#E21818]">Home</Link><span className="mx-1">/</span><span className="text-white">{c.title}</span></nav></div>
        <div className="py-12"><div className="mx-auto max-w-7xl px-4"><div className="mb-8 flex items-center justify-center gap-4"><span className="h-px w-12 bg-[#33383D]" /><h2 className="text-2xl font-bold uppercase text-white" style={{ fontFamily: "var(--font-lato)" }}>{c.section1Title}</h2><span className="h-px w-12 bg-[#33383D]" /></div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">{c.services?.map((s: any, i: number) => { const Icon = iconMap[s.icon] || Music; return (
            <div key={i} className="bg-[#1A1C1F] p-6 text-center"><div className="mb-3 flex justify-center"><div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#E21818]/10"><Icon className="h-7 w-7 text-[#E21818]" /></div></div><h3 className="mb-2 text-sm font-bold uppercase text-white">{s.title}</h3><p className="text-xs leading-relaxed text-[#9B9C9E]">{s.desc}</p></div>
          )})}</div>
        </div></div>
        <div className="bg-[#1A1C1F] py-12"><div className="mx-auto max-w-7xl px-4"><div className="mb-8 flex items-center justify-center gap-4"><span className="h-px w-12 bg-[#33383D]" /><h2 className="text-2xl font-bold uppercase text-white" style={{ fontFamily: "var(--font-lato)" }}>{c.section2Title}</h2><span className="h-px w-12 bg-[#33383D]" /></div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">{c.pricing?.map((p: any, i: number) => (
            <div key={i} className={`p-6 ${p.featured ? "bg-[#E21818]/10 border-2 border-[#E21818]" : "bg-[#141618] border border-[#33383D]"}`}>{p.featured && <p className="mb-2 text-center text-[10px] font-bold uppercase text-[#E21818]">Most Popular</p>}<h3 className="text-center text-lg font-bold uppercase text-white">{p.name}</h3><p className="mb-4 text-center text-3xl font-bold text-white">{p.price}<span className="text-sm font-normal text-[#9B9C9E]">{p.period}</span></p><ul className="space-y-2">{p.features?.map((f: string, j: number) => <li key={j} className="flex items-start gap-2 text-xs text-[#9B9C9E]"><Check className="mt-0.5 h-3 w-3 shrink-0 text-[#E21818]" /> {f}</li>)}</ul><button className={`mt-4 w-full py-2 text-xs font-bold uppercase text-white ${p.featured ? "bg-[#E21818] hover:bg-[#C51515]" : "bg-[#33383D] hover:bg-[#444]"}`}>Sign Up</button></div>
          ))}</div>
        </div></div>
        <div className="py-12"><div className="mx-auto max-w-7xl px-4"><div className="mb-8 flex items-center justify-center gap-4"><span className="h-px w-12 bg-[#33383D]" /><h2 className="text-2xl font-bold uppercase text-white" style={{ fontFamily: "var(--font-lato)" }}>{c.section3Title}</h2><span className="h-px w-12 bg-[#33383D]" /></div>
          <div className="relative flex min-h-[300px] items-center justify-center overflow-hidden rounded-lg"><img src="/musicplace/images/home/promo-studio.png" alt="" className="absolute inset-0 h-full w-full object-cover opacity-30" /><div className="absolute inset-0 bg-[#141618]/80" /><div className="relative z-10 mx-auto max-w-2xl px-8 text-center"><Quote className="mx-auto mb-4 h-10 w-10 text-[#E21818]" /><p className="mb-6 text-sm leading-relaxed text-white/90">{c.testimonial?.quote}</p><img src={c.testimonial?.image} alt={c.testimonial?.author} className="mx-auto mb-3 h-14 w-14 rounded-full object-cover" /><p className="text-sm font-bold uppercase text-white">{c.testimonial?.author}</p><p className="text-xs text-[#9B9C9E]">{c.testimonial?.role}</p></div></div>
        </div></div>
      </main>
      <Footer />
    </div>
  )
}
