
import { Header } from "@/components/store/Header"
import { Footer } from "@/components/store/Footer"
import Link from "next/link"
import { getGalleryContent } from "@/lib/data-helper"

export default function GalleryPage() {
  const c = getGalleryContent()
  return (
    <div className="flex min-h-screen flex-col bg-[#141618]">
      <Header />
      <main className="flex-1">
        <div className="border-b border-[#33383D] bg-[#1A1C1F] py-8 text-center">
          <h1 className="text-3xl font-bold uppercase text-white" style={{ fontFamily: "var(--font-lato)" }}>{c.title}</h1>
          <nav className="mt-2 text-xs text-[#9B9C9E]"><Link href="/" className="hover:text-[#E21818]">Home</Link><span className="mx-1">/</span><span className="text-white">{c.title}</span></nav>
        </div>
        <div className="mx-auto max-w-7xl px-4 py-8">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {c.images?.map((img: any, i: number) => (
              <div key={i} className="group relative overflow-hidden bg-[#1A1C1F]">
                <div className="aspect-square overflow-hidden"><img src={img.src} alt={img.title} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110" /></div>
                <div className="absolute inset-0 flex items-end bg-gradient-to-t from-[#141618]/80 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100"><p className="p-3 text-xs font-bold text-white">{img.title}</p></div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
