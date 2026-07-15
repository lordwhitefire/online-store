"use client"
import { Header } from "@/components/store/Header"
import { Footer } from "@/components/store/Footer"
import { ProductCard } from "@/components/store/ProductCard"
import { Search, Grid3x3, List, Star } from "lucide-react"
import Link from "next/link"
import { useState, useEffect, useCallback } from "react"

export default function ShopPage() {
  const [products, setProducts] = useState<any[]>([])
  const [content, setContent] = useState<any>({})
  const [search, setSearch] = useState("")
  const [minPrice, setMinPrice] = useState(0)
  const [maxPrice, setMaxPrice] = useState(99999)
  const [sort, setSort] = useState("default")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/admin/pages", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "get", pageName: "shop-content" }) }).then(r => r.json()).then(setContent).catch(() => setContent({ title: "Shop", sidebar: {}, tags: [] }))
  }, [])

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (search) params.set("q", search)
    if (minPrice > 0) params.set("minPrice", String(minPrice))
    if (maxPrice < 99999) params.set("maxPrice", String(maxPrice))
    params.set("sort", sort)
    const res = await fetch(`/api/search?${params}`)
    const data = await res.json()
    setProducts(data.products || [])
    setLoading(false)
  }, [search, minPrice, maxPrice, sort])

  useEffect(() => { fetchProducts() }, [fetchProducts])

  const newArrivals = [
    { slug: "digital-conversion-turntable", name: "Digital Conversion Turntable", img: "/musicplace/images/home/20-600x800.jpg", price: "$119.00" },
    { slug: "crosley-cr8005a-cb-cruiser-portable-turn", name: "Crosley CR8005A-CB Cruiser Portable Turntable", img: "/musicplace/images/home/18-600x800.jpg", price: "$350.75" },
  ]
  const featuredProducts = [
    { slug: "tama-s-l-p-big-black-steel-snare-drum", name: "Tama S.L.P. Big Black Steel Snare Drum", img: "/musicplace/images/home/1-1.jpg", price: "$249.99" },
    { slug: "crosley-cruiser-portable-3-speed-turntab", name: "Crosley Cruiser Portable 3-Speed Turntable", img: "/musicplace/images/home/7-4.jpg", price: "$349.99" },
  ]
  const c = content.title ? content : { title: "Shop", resultsText: "Showing {count} results", sorting: ["Default sorting", "Sort by price: low to high", "Sort by price: high to low", "Sort by name"], sidebar: { cartTitle: "Cart", cartEmpty: "No products in the cart.", priceTitle: "Filter by price", priceRange: "$47 – $1,330", priceButton: "Filter", searchTitle: "Search for products", searchPlaceholder: "Search products…", arrivalsTitle: "New Arrivals", featuredTitle: "Featured Products", tagsTitle: "Tags" }, tags: ["ACOUSTIC KITS", "COMPANY", "CONCEPT", "CREATIVE", "DRUMS", "ELECTRIC GUITARS", "EVENT", "LIFESTYLE", "MUSIC", "POPULAR", "SALE"] }

  return (
    <div className="flex min-h-screen flex-col bg-[#141618]">
      <Header />
      <main className="flex-1" id="main-content">
        <div className="border-b border-[#33383D] bg-[#1A1C1F] py-6 text-center"><h1 className="text-3xl font-bold uppercase text-white" style={{ fontFamily: "var(--font-lato)" }}>{c.title}</h1></div>
        <div className="mx-auto max-w-7xl px-4 py-8">
          <div className="flex flex-col gap-6 lg:flex-row">
            <div className="flex-1 lg:w-[70%]">
              <div className="mb-4 flex items-center justify-between border border-[#33383D] bg-[#1A1C1F] px-4 py-2">
                <div className="flex items-center gap-2"><button className="text-[#9B9C9E] hover:text-white" aria-label="Grid view"><Grid3x3 className="h-4 w-4" /></button><button className="text-[#9B9C9E] hover:text-white" aria-label="List view"><List className="h-4 w-4" /></button></div>
                <p className="text-xs text-[#9B9C9E]">{(c.resultsText || "Showing {count} results").replace("{count}", String(products.length))}</p>
                <select value={sort} onChange={e => setSort(e.target.value === "Default sorting" ? "default" : e.target.value === "Sort by price: low to high" ? "price-asc" : e.target.value === "Sort by price: high to low" ? "price-desc" : "name")} className="border border-[#33383D] bg-[#141618] px-3 py-1 text-xs text-[#9B9C9E] focus:outline-none">
                  {(c.sorting || ["Default sorting"]).map((s: string) => <option key={s}>{s}</option>)}
                </select>
              </div>
              {loading ? <p className="py-8 text-center text-sm text-[#9B9C9E]">Loading products...</p> : products.length === 0 ? <p className="py-8 text-center text-sm text-[#9B9C9E]">No products found. Try adjusting your search or filters.</p> : (
                <div className="grid grid-cols-2 gap-3 md:grid-cols-3">{products.map(p => <ProductCard key={p.slug} product={p} />)}</div>
              )}
            </div>
            <aside className="lg:w-[28%]"><div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-1">
              <div className="bg-[#1A1C1F] p-4"><h3 className="mb-3 border-b border-[#33383D] pb-2 text-sm font-bold uppercase text-white">{c.sidebar.cartTitle}</h3><p className="text-xs text-[#9B9C9E]">{c.sidebar.cartEmpty}</p></div>
              <div className="bg-[#1A1C1F] p-4">
                <h3 className="mb-3 border-b border-[#33383D] pb-2 text-sm font-bold uppercase text-white">{c.sidebar.priceTitle}</h3>
                <div className="mb-3 space-y-2">
                  <div className="flex gap-2"><input type="number" placeholder="Min $" value={minPrice || ""} onChange={e => setMinPrice(parseFloat(e.target.value) || 0)} className="w-full border border-[#33383D] bg-[#141618] px-2 py-1 text-xs text-white" /><input type="number" placeholder="Max $" value={maxPrice === 99999 ? "" : maxPrice} onChange={e => setMaxPrice(parseFloat(e.target.value) || 99999)} className="w-full border border-[#33383D] bg-[#141618] px-2 py-1 text-xs text-white" /></div>
                </div>
                <button onClick={fetchProducts} className="w-full bg-[#E21818] py-2 text-xs font-bold uppercase text-white hover:bg-[#C51515]">{c.sidebar.priceButton}</button>
              </div>
              <div className="bg-[#1A1C1F] p-4"><h3 className="mb-3 border-b border-[#33383D] pb-2 text-sm font-bold uppercase text-white">{c.sidebar.searchTitle}</h3><div className="flex"><input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder={c.sidebar.searchPlaceholder} className="flex-1 border border-[#33383D] bg-[#141618] px-3 py-2 text-xs text-white placeholder:text-[#9B9C9E] focus:outline-none" /><button onClick={fetchProducts} className="bg-[#E21818] px-3 py-2 text-white hover:bg-[#C51515]" aria-label="Search"><Search className="h-4 w-4" /></button></div></div>
              <div className="bg-[#1A1C1F] p-4"><h3 className="mb-3 border-b border-[#33383D] pb-2 text-sm font-bold uppercase text-white">{c.sidebar.arrivalsTitle}</h3><ul className="space-y-3">{newArrivals.map(p => <li key={p.slug}><Link href={`/product/${p.slug}`} className="flex items-center gap-3 group"><img src={p.img} alt="" className="h-14 w-14 object-cover" /><div><p className="line-clamp-2 text-xs text-[#9B9C9E] group-hover:text-[#E21818]">{p.name}</p><p className="text-xs font-bold text-[#E21818]">{p.price}</p></div></Link></li>)}</ul></div>
              <div className="bg-[#1A1C1F] p-4"><h3 className="mb-3 border-b border-[#33383D] pb-2 text-sm font-bold uppercase text-white">{c.sidebar.featuredTitle}</h3><ul className="space-y-3">{featuredProducts.map(p => <li key={p.slug}><Link href={`/product/${p.slug}`} className="flex items-center gap-3 group"><img src={p.img} alt="" className="h-14 w-14 object-cover" /><div><p className="line-clamp-2 text-xs text-[#9B9C9E] group-hover:text-[#E21818]">{p.name}</p><div className="flex items-center gap-1"><p className="text-xs font-bold text-[#E21818]">{p.price}</p><div className="ml-1 flex">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-2.5 w-2.5 fill-[#E21818] text-[#E21818]" />)}</div></div></div></Link></li>)}</ul></div>
              <div className="bg-[#1A1C1F] p-4"><h3 className="mb-3 border-b border-[#33383D] pb-2 text-sm font-bold uppercase text-white">{c.sidebar.tagsTitle}</h3><div className="flex flex-wrap gap-2">{c.tags.map((tag: string) => <span key={tag} onClick={() => setSearch(tag.toLowerCase())} className="border border-[#33383D] px-2 py-1 text-[10px] uppercase text-[#9B9C9E] hover:border-[#E21818] hover:text-[#E21818] cursor-pointer">{tag}</span>)}</div></div>
            </div></aside>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
