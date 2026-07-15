import { Header } from "@/components/store/Header"
import { Footer } from "@/components/store/Footer"
import Link from "next/link"
import { Check, Mail, Phone, Clock } from "lucide-react"
import { getServicePlusContent } from "@/lib/data-helper"

const iconMap: Record<string, any> = { mail: Mail, phone: Phone, clock: Clock }

export default function ServicePlusPage() {
  const c = getServicePlusContent()
  return (
    <div className="flex min-h-screen flex-col bg-[#141618]">
      <Header />
      <main className="flex-1">
        <div className="border-b border-[#33383D] bg-[#1A1C1F] py-8 text-center"><h1 className="text-3xl font-bold uppercase text-white" style={{ fontFamily: "var(--font-lato)" }}>{c.title}</h1><nav className="mt-2 text-xs text-[#9B9C9E]"><Link href="/" className="hover:text-[#E21818]">Home</Link><span className="mx-1">/</span><span className="text-white">{c.title}</span></nav></div>
        <div className="py-12"><div className="mx-auto max-w-4xl px-4"><div className="mb-8 flex items-center justify-center gap-4"><span className="h-px w-12 bg-[#33383D]" /><h2 className="text-2xl font-bold uppercase text-white" style={{ fontFamily: "var(--font-lato)" }}>{c.introTitle}</h2><span className="h-px w-12 bg-[#33383D]" /></div>
          <div className="bg-[#1A1C1F] p-8">{c.introText?.map((t: string, i: number) => <p key={i} className="mb-4 text-sm leading-relaxed text-[#9B9C9E]">{t}</p>)}</div>
        </div></div>
        <div className="bg-[#1A1C1F] py-12"><div className="mx-auto max-w-7xl px-4"><div className="mb-8 flex items-center justify-center gap-4"><span className="h-px w-12 bg-[#33383D]" /><h2 className="text-2xl font-bold uppercase text-white" style={{ fontFamily: "var(--font-lato)" }}>{c.packagesTitle}</h2><span className="h-px w-12 bg-[#33383D]" /></div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">{c.packages?.map((p: any, i: number) => (
            <div key={i} className={`p-6 ${p.featured ? "bg-[#E21818]/10 border-2 border-[#E21818]" : "bg-[#141618] border border-[#33383D]"}`}>{p.featured && <p className="mb-2 text-center text-[10px] font-bold uppercase text-[#E21818]">Recommended</p>}<h3 className="text-center text-lg font-bold uppercase text-white">{p.name}</h3><p className="mb-4 text-center text-3xl font-bold text-white">{p.price}</p><ul className="mb-4 space-y-2">{p.features?.map((f: string, j: number) => <li key={j} className="flex items-start gap-2 text-xs text-[#9B9C9E]"><Check className="mt-0.5 h-3 w-3 shrink-0 text-[#E21818]" /> {f}</li>)}</ul><button className={`w-full py-2 text-xs font-bold uppercase text-white ${p.featured ? "bg-[#E21818] hover:bg-[#C51515]" : "bg-[#33383D] hover:bg-[#444]"}`}>Get Started</button></div>
          ))}</div>
        </div></div>
        <div className="py-12"><div className="mx-auto max-w-4xl px-4"><div className="bg-[#1A1C1F] p-8 text-center"><h2 className="mb-4 text-xl font-bold uppercase text-white">{c.contactTitle}</h2><p className="mb-6 text-sm text-[#9B9C9E]">{c.contactText}</p><div className="flex flex-wrap items-center justify-center gap-6 text-xs text-[#9B9C9E]">{c.contactInfo?.map((ci: any, i: number) => { const Icon = iconMap[ci.icon] || Mail; return <span key={i} className="flex items-center gap-2"><Icon className="h-4 w-4 text-[#E21818]" /> {ci.text}</span> })}</div></div></div></div>
      </main>
      <Footer />
    </div>
  )
}
