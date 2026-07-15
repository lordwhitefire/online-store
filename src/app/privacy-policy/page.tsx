import { Header } from "@/components/store/Header"
import { Footer } from "@/components/store/Footer"
import Link from "next/link"
import { getPrivacyContent } from "@/lib/data-helper"

export default function PrivacyPolicyPage() {
  const c = getPrivacyContent()
  return (
    <div className="flex min-h-screen flex-col bg-[#141618]">
      <Header />
      <main className="flex-1">
        <div className="border-b border-[#33383D] bg-[#1A1C1F] py-8 text-center"><h1 className="text-3xl font-bold uppercase text-white" style={{ fontFamily: "var(--font-lato)" }}>{c.title}</h1><nav className="mt-2 text-xs text-[#9B9C9E]"><Link href="/" className="hover:text-[#E21818]">Home</Link><span className="mx-1">/</span><span className="text-white">{c.title}</span></nav></div>
        <div className="mx-auto max-w-4xl px-4 py-8">
          <p className="mb-6 text-xs text-[#9B9C9E]">Last updated: {c.lastUpdated}</p>
          <div className="space-y-6">{c.sections?.map((s: any) => (
            <div key={s.num} className="bg-[#1A1C1F] p-6"><h2 className="mb-2 flex items-center gap-2 text-sm font-bold uppercase text-white"><span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#E21818] text-xs text-white">{s.num}</span>{s.title}</h2><p className="text-sm leading-relaxed text-[#9B9C9E]">{s.content}</p></div>
          ))}</div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
