
import { Header } from "@/components/store/Header"
import { Footer } from "@/components/store/Footer"
import Link from "next/link"
import { Facebook, Twitter, Instagram, Quote } from "lucide-react"
import { getStaffContent } from "@/lib/data-helper"

export default function StaffPage() {
  const c = getStaffContent()
  return (
    <div className="flex min-h-screen flex-col bg-[#141618]">
      <Header />
      <main className="flex-1">
        <div className="border-b border-[#33383D] bg-[#1A1C1F] py-8 text-center"><h1 className="text-3xl font-bold uppercase text-white" style={{ fontFamily: "var(--font-lato)" }}>{c.title}</h1><nav className="mt-2 text-xs text-[#9B9C9E]"><Link href="/" className="hover:text-[#E21818]">Home</Link><span className="mx-1">/</span><span className="text-white">{c.title}</span></nav></div>
        <div className="py-12"><div className="mx-auto max-w-7xl px-4"><div className="mb-8 flex items-center justify-center gap-4"><span className="h-px w-12 bg-[#33383D]" /><h2 className="text-2xl font-bold uppercase text-white" style={{ fontFamily: "var(--font-lato)" }}>{c.section1Title}</h2><span className="h-px w-12 bg-[#33383D]" /></div>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2"><div className="overflow-hidden rounded-lg"><img src={c.aboutImage} alt="Our Store" className="h-full w-full object-cover" /></div><div className="flex flex-col justify-center">{c.aboutText?.map((t: string, i: number) => <p key={i} className="mb-4 text-sm leading-relaxed text-[#9B9C9E]">{t}</p>)}</div></div>
        </div></div>
        <div className="bg-[#1A1C1F] py-12"><div className="mx-auto max-w-7xl px-4"><div className="mb-8 flex items-center justify-center gap-4"><span className="h-px w-12 bg-[#33383D]" /><h2 className="text-2xl font-bold uppercase text-white" style={{ fontFamily: "var(--font-lato)" }}>{c.section2Title}</h2><span className="h-px w-12 bg-[#33383D]" /></div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">{c.staff?.map((s: any, i: number) => (
            <div key={i} className="bg-[#141618] p-6"><img src={s.img} alt={s.name} className="mb-4 h-40 w-full object-cover" /><h3 className="text-lg font-bold uppercase text-white">{s.name}</h3><p className="mb-2 text-xs text-[#E21818]">{s.role}</p><p className="mb-3 text-xs leading-relaxed text-[#9B9C9E]">{s.bio}</p><div className="flex gap-2"><Facebook className="h-4 w-4 text-[#9B9C9E] hover:text-[#E21818] cursor-pointer" /><Twitter className="h-4 w-4 text-[#9B9C9E] hover:text-[#E21818] cursor-pointer" /><Instagram className="h-4 w-4 text-[#9B9C9E] hover:text-[#E21818] cursor-pointer" /></div></div>
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
