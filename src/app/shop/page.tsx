import { Header } from "@/components/store/Header"
import { Footer } from "@/components/store/Footer"
import { ProductCard } from "@/components/store/ProductCard"
import { getProducts } from "@/lib/data"
import { Search, Grid3x3, List, Star } from "lucide-react"
import Link from "next/link"

export default function ShopPage() {
  const products = getProducts()

  // New Arrivals widget products
  const newArrivals = [
    { slug: "digital-conversion-turntable", name: "Digital Conversion Turntable", img: "/musicplace/images/home/20-600x800.jpg", price: "$119.00" },
    { slug: "crosley-cr8005a-cb-cruiser-portable-turn", name: "Crosley CR8005A-CB Cruiser Portable Turntable", img: "/musicplace/images/home/18-600x800.jpg", price: "$350.75" },
  ]

  // Featured Products widget products
  const featuredProducts = [
    { slug: "tama-s-l-p-big-black-steel-snare-drum", name: "Tama S.L.P. Big Black Steel Snare Drum", img: "/musicplace/images/home/1-1.jpg", price: "$249.99" },
    { slug: "crosley-cruiser-portable-3-speed-turntab", name: "Crosley Cruiser Portable 3-Speed Turntable", img: "/musicplace/images/home/7-4.jpg", price: "$349.99" },
  ]

  // Tags from product data
  const tags = ["ACOUSTIC KITS", "COMPANY", "CONCEPT", "CREATIVE", "DRUMS", "ELECTRIC GUITARS", "EVENT", "LIFESTYLE", "MUSIC", "POPULAR", "SALE"]

  return (
    <div className="flex min-h-screen flex-col bg-[#141618]">
      <Header />
      <main className="flex-1">
        {/* Page Title Bar */}
        <div className="border-b border-[#33383D] bg-[#1A1C1F] py-6 text-center">
          <h1 className="text-3xl font-bold uppercase text-white" style={{ fontFamily: "var(--font-lato)" }}>Shop</h1>
        </div>

        {/* Main Content — responsive: sidebar right on desktop, below on mobile/tablet */}
        <div className="mx-auto max-w-7xl px-4 py-8">
          <div className="flex flex-col gap-6 lg:flex-row">
            {/* LEFT: Product Grid */}
            <div className="flex-1 lg:w-[70%]">
              {/* Toolbar */}
              <div className="mb-4 flex items-center justify-between border border-[#33383D] bg-[#1A1C1F] px-4 py-2">
                <div className="flex items-center gap-2">
                  <button className="text-[#9B9C9E] hover:text-white" aria-label="Grid view"><Grid3x3 className="h-4 w-4" /></button>
                  <button className="text-[#9B9C9E] hover:text-white" aria-label="List view"><List className="h-4 w-4" /></button>
                </div>
                <p className="text-xs text-[#9B9C9E]">Showing all {products.length} results</p>
                <select className="border border-[#33383D] bg-[#141618] px-3 py-1 text-xs text-[#9B9C9E] focus:outline-none">
                  <option>Default sorting</option>
                  <option>Sort by popularity</option>
                  <option>Sort by latest</option>
                  <option>Sort by price: low to high</option>
                  <option>Sort by price: high to low</option>
                </select>
              </div>

              {/* Product Grid — 3 per row desktop, 2 tablet, 2 mobile */}
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                {products.map(p => <ProductCard key={p.slug} product={p} />)}
              </div>

              {/* Pagination */}
              <div className="mt-8 flex items-center justify-center gap-2">
                <button className="border border-[#33383D] px-3 py-2 text-xs text-[#9B9C9E] hover:border-[#E21818] hover:text-white">←</button>
                <button className="bg-[#E21818] px-3 py-2 text-xs font-bold text-white">1</button>
                <button className="border border-[#33383D] px-3 py-2 text-xs text-[#9B9C9E] hover:border-[#E21818] hover:text-white">2</button>
                <button className="border border-[#33383D] px-3 py-2 text-xs text-[#9B9C9E] hover:border-[#E21818] hover:text-white">→</button>
              </div>
            </div>

            {/* RIGHT: Sidebar — shows on right for desktop, below for mobile/tablet */}
            <aside className="lg:w-[28%]">
              {/* 1. Cart Widget */}
              <div className="mb-4 bg-[#1A1C1F] p-4">
                <h3 className="mb-3 border-b border-[#33383D] pb-2 text-sm font-bold uppercase text-white">Cart</h3>
                <p className="text-xs text-[#9B9C9E]">No products in the cart.</p>
              </div>

              {/* 2. Filter by Price */}
              <div className="mb-4 bg-[#1A1C1F] p-4">
                <h3 className="mb-3 border-b border-[#33383D] pb-2 text-sm font-bold uppercase text-white">Filter by price</h3>
                <div className="mb-3">
                  <div className="relative h-1 rounded-full bg-[#33383D]">
                    <div className="absolute h-1 rounded-full bg-[#E21818]" style={{ left: "10%", right: "20%" }}></div>
                    <div className="absolute h-3 w-3 rounded-full bg-[#E21818] -top-1" style={{ left: "10%" }}></div>
                    <div className="absolute h-3 w-3 rounded-full bg-[#E21818] -top-1" style={{ right: "20%" }}></div>
                  </div>
                </div>
                <p className="mb-3 text-xs text-[#9B9C9E]">Price: $47 – $1,330</p>
                <button className="w-full bg-[#E21818] py-2 text-xs font-bold uppercase text-white hover:bg-[#C51515]">Filter</button>
              </div>

              {/* 3. Search for Products */}
              <div className="mb-4 bg-[#1A1C1F] p-4">
                <h3 className="mb-3 border-b border-[#33383D] pb-2 text-sm font-bold uppercase text-white">Search for products</h3>
                <div className="flex">
                  <input type="text" placeholder="Search products…" className="flex-1 border border-[#33383D] bg-[#141618] px-3 py-2 text-xs text-white placeholder:text-[#9B9C9E] focus:outline-none" />
                  <button className="bg-[#E21818] px-3 py-2 text-white hover:bg-[#C51515]" aria-label="Search"><Search className="h-4 w-4" /></button>
                </div>
              </div>

              {/* 4. New Arrivals */}
              <div className="mb-4 bg-[#1A1C1F] p-4">
                <h3 className="mb-3 border-b border-[#33383D] pb-2 text-sm font-bold uppercase text-white">New Arrivals</h3>
                <ul className="space-y-3">
                  {newArrivals.map(p => (
                    <li key={p.slug}>
                      <Link href={`/product/${p.slug}`} className="flex items-center gap-3 group">
                        <img src={p.img} alt="" className="h-14 w-14 object-cover" />
                        <div>
                          <p className="line-clamp-2 text-xs text-[#9B9C9E] group-hover:text-[#E21818]">{p.name}</p>
                          <p className="text-xs font-bold text-[#E21818]">{p.price}</p>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 5. Featured Products */}
              <div className="mb-4 bg-[#1A1C1F] p-4">
                <h3 className="mb-3 border-b border-[#33383D] pb-2 text-sm font-bold uppercase text-white">Featured Products</h3>
                <ul className="space-y-3">
                  {featuredProducts.map(p => (
                    <li key={p.slug}>
                      <Link href={`/product/${p.slug}`} className="flex items-center gap-3 group">
                        <img src={p.img} alt="" className="h-14 w-14 object-cover" />
                        <div>
                          <p className="line-clamp-2 text-xs text-[#9B9C9E] group-hover:text-[#E21818]">{p.name}</p>
                          <div className="flex items-center gap-1">
                            <p className="text-xs font-bold text-[#E21818]">{p.price}</p>
                            <div className="ml-1 flex">
                              {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-2.5 w-2.5 fill-[#E21818] text-[#E21818]" />)}
                            </div>
                          </div>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 6. Tags */}
              <div className="bg-[#1A1C1F] p-4">
                <h3 className="mb-3 border-b border-[#33383D] pb-2 text-sm font-bold uppercase text-white">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {tags.map(tag => (
                    <span key={tag} className="border border-[#33383D] px-2 py-1 text-[10px] uppercase text-[#9B9C9E] hover:border-[#E21818] hover:text-[#E21818] cursor-pointer">{tag}</span>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
