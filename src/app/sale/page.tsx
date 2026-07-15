"use client"
import { Header } from "@/components/store/Header"
import { Footer } from "@/components/store/Footer"
import { ProductCard } from "@/components/store/ProductCard"
import { Search, Grid3x3, List, Star } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function SalePage() {
  const [products, setProducts] = useState<any[]>([])
  const [content, setContent] = useState<any>({})

  useState(() => {
    fetch("/api/products").then(r => r.json()).then(d => setProducts(d.slice(0, 8)))
    fetch("/api/admin/pages", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "get", pageName: "sale-content" }) }).then(r => r.json()).then(setContent).catch(() => setContent({ title: "Sale", resultsText: "Showing all {count} results", sorting: ["Default sorting"], priceRange: "$349 – $951" }))
  })

  const newArrivals = [
    { slug: "digital-conversion-turntable", name: "Digital Conversion Turntable", img: "/musicplace/images/home/20-600x800.jpg", price: "$119.00" },
    { slug: "crosley-cr8005a-cb-cruiser-portable-turn", name: "Crosley CR8005A-CB Cruiser Portable Turntable", img: "/musicplace/images/home/18-600x800.jpg", price: "$350.75" },
  ]
  const featuredProducts = [
    { slug: "tama-s-l-p-big-black-steel-snare-drum", name: "Tama S.L.P. Big Black Steel Snare Drum", img: "/musicplace/images/home/1-1.jpg", price: "$249.99" },
    { slug: "crosley-cruiser-portable-3-speed-turntab", name: "Crosley Cruiser Portable 3-Speed Turntable", img: "/musicplace/images/home/7-4.jpg", price: "$349.99" },
  ]
  const tags = content.tags || ["ACOUSTIC KITS", "COMPANY", "CONCEPT", "CREATIVE", "DRUMS", "ELECTRIC GUITARS", "EVENT", "LIFESTYLE", "MUSIC", "POPULAR", "SALE"]
  const sb = content.sidebar || { cartTitle: "Cart", cartEmpty: "No products in the cart.", priceTitle: "Filter by price", priceButton: "Filter", searchTitle: "Search for products", searchPlaceholder: "Search products…", arrivalsTitle: "New Arrivals", featuredTitle: "Featured Products", tagsTitle: "Tags" }

  return (
    <div className="flex min-h-screen flex-col bg-[#141618]">
      <Header />
      <main className="flex-1">
        <div className="border-b border-[#33383D] bg-[#1A1C1F] py-6 text-center"><h1 className="text-3xl font-bold uppercase text-[#E21818]" style={{ fontFamily: "var(--font-lato)" }}>{content.title || "Sale"}</h1></div>
        <div className="mx-auto max-w-7xl px-4 py-8">
          <div className="flex flex-col gap-6 lg:flex-row">
            <div className="flex-1 lg:w-[70%]">
              <div className="mb-4 flex items-center justify-between border border-[#33383D] bg-[#1A1C1F] px-4 py-2"><div className="flex items-center gap-2"><button className="text-[#9B9C9E] hover:text-white" aria-label="Grid view"><Grid3x3 className="h-4 w-4" /></button><button className="text-[#9B9C9E] hover:text-white" aria-label="List view"><List className="h-4 w-4" /></button></div><p className="text-xs text-[#9B9C9E]">{(content.resultsText || "Showing all {count} results").replace("{count}", String(products.length))}</p><select className="border border-[#33383D] bg-[#141618] px-3 py-1 text-xs text-[#9B9C9E] focus:outline-none">{(content.sorting || ["Default sorting"]).map((s: string) => <option key={s}>{s}</option>)}</select></div>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3">{products.map(p => <ProductCard key={p.slug} product={p} />)}</div>
            </div>
            <aside className="lg:w-[28%]"><div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-1">
              <div className="bg-[#1A1C1F] p-4"><h3 className="mb-3 border-b border-[#33383D] pb-2 text-sm font-bold uppercase text-white">{sb.cartTitle}</h3><p className="text-xs text-[#9B9C9E]">{sb.cartEmpty}</p></div>
              <div className="bg-[#1A1C1F] p-4"><h3 className="mb-3 border-b border-[#33383D] pb-2 text-sm font-bold uppercase text-white">{sb.priceTitle}</h3><div className="mb-3"><div className="relative h-1 rounded-full bg-[#33383D]"><div className="absolute h-1 rounded-full bg-[#E21818]" style={{ left: "10%", right: "20%" }}></div><div className="absolute h-3 w-3 rounded-full bg-[#E21818] -top-1" style={{ left: "10%" }}></div><div className="absolute h-3 w-3 rounded-full bg-[#E21818] -top-1" style={{ right: "20%" }}></div></div></div><p className="mb-3 text-xs text-[#9B9C9E]">{content.priceRange || "$349 – $951"}</p><button className="w-full bg-[#E21818] py-2 text-xs font-bold uppercase text-white hover:bg-[#C51515]">{sb.priceButton}</button></div>
              <div className="bg-[#1A1C1F] p-4"><h3 className="mb-3 border-b border-[#33383D] pb-2 text-sm font-bold uppercase text-white">{sb.searchTitle}</h3><div className="flex"><input type="text" placeholder={sb.searchPlaceholder} className="flex-1 border border-[#33383D] bg-[#141618] px-3 py-2 text-xs text-white placeholder:text-[#9B9C9E] focus:outline-none" /><button className="bg-[#E21818] px-3 py-2 text-white hover:bg-[#C51515]" aria-label="Search"><Search className="h-4 w-4" /></button></div></div>
              <div className="bg-[#1A1C1F] p-4"><h3 className="mb-3 border-b border-[#33383D] pb-2 text-sm font-bold uppercase text-white">{sb.arrivalsTitle}</h3><ul className="space-y-3">{newArrivals.map(p => <li key={p.slug}><Link href={`/product/${p.slug}`} className="flex items-center gap-3 group"><img src={p.img} alt="" className="h-14 w-14 object-cover" /><div><p className="line-clamp-2 text-xs text-[#9B9C9E] group-hover:text-[#E21818]">{p.name}</p><p className="text-xs font-bold text-[#E21818]">{p.price}</p></div></Link></li>)}</ul></div>
              <div className="bg-[#1A1C1F] p-4"><h3 className="mb-3 border-b border-[#33383D] pb-2 text-sm font-bold uppercase text-white">{sb.featuredTitle}</h3><ul className="space-y-3">{featuredProducts.map(p => <li key={p.slug}><Link href={`/product/${p.slug}`} className="flex items-center gap-3 group"><img src={p.img} alt="" className="h-14 w-14 object-cover" /><div><p className="line-clamp-2 text-xs text-[#9B9C9E] group-hover:text-[#E21818]">{p.name}</p><div className="flex items-center gap-1"><p className="text-xs font-bold text-[#E21818]">{p.price}</p><div className="ml-1 flex">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-2.5 w-2.5 fill-[#E21818] text-[#E21818]" />)}</div></div></div></Link></li>)}</ul></div>
              <div className="bg-[#1A1C1F] p-4"><h3 className="mb-3 border-b border-[#33383D] pb-2 text-sm font-bold uppercase text-white">{sb.tagsTitle}</h3><div className="flex flex-wrap gap-2">{tags.map((tag: string) => <span key={tag} className="border border-[#33383D] px-2 py-1 text-[10px] uppercase text-[#9B9C9E] hover:border-[#E21818] hover:text-[#E21818] cursor-pointer">{tag}</span>)}</div></div>
            </div></aside>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
