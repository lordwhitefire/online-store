import { Header } from "@/components/store/Header"
import { Footer } from "@/components/store/Footer"
import { ProductCard } from "@/components/store/ProductCard"
import { getProducts } from "@/lib/data"
import { Search, Grid3x3, List } from "lucide-react"

export default function ShopPage() {
  const products = getProducts()
  return (
    <div className="flex min-h-screen flex-col bg-[#141618]">
      <Header />
      <main className="flex-1">
        {/* Page Title Bar */}
        <div className="border-b border-[#33383D] bg-[#1A1C1F] py-6 text-center">
          <h1 className="text-3xl font-bold uppercase text-white" style={{ fontFamily: "var(--font-lato)" }}>Shop</h1>
        </div>

        {/* Main Content — two column: products (70%) + sidebar (30%) */}
        <div className="mx-auto max-w-7xl px-4 py-8">
          <div className="flex flex-col gap-6 lg:flex-row">
            {/* LEFT: Product Grid */}
            <div className="flex-1 lg:w-[70%]">
              {/* Toolbar: grid/list toggle + result count + sorting */}
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

              {/* Product Grid — 3 per row on desktop */}
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

            {/* RIGHT: Sidebar */}
            <aside className="lg:w-[28%]">
              {/* Cart Widget */}
              <div className="mb-6 bg-[#1A1C1F] p-4">
                <h3 className="mb-3 border-b border-[#33383D] pb-2 text-sm font-bold uppercase text-white">Cart</h3>
                <p className="text-xs text-[#9B9C9E]">No products in the cart.</p>
              </div>

              {/* Filter by Price */}
              <div className="mb-6 bg-[#1A1C1F] p-4">
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

              {/* Product Categories Widget */}
              <div className="mb-6 bg-[#1A1C1F] p-4">
                <h3 className="mb-3 border-b border-[#33383D] pb-2 text-sm font-bold uppercase text-white">Product Categories</h3>
                <ul className="space-y-2 text-xs">
                  {["Accessories", "Audio Interfaces", "Audio Workstations", "Bags and Cases", "Band & Orchestra", "Controllers", "DJ & Karaoke", "Headphones", "Instruments", "MIDI Controllers", "MIDI Interfaces", "Mixers", "Mouthpieces", "Recording", "Software"].map(cat => (
                    <li key={cat}><a href={`/category/${cat.toLowerCase().replace(/\s+/g, "-").replace("&", "and")}`} className="text-[#9B9C9E] hover:text-[#E21818]">{cat}</a></li>
                  ))}
                </ul>
              </div>

              {/* Search Widget */}
              <div className="bg-[#1A1C1F] p-4">
                <h3 className="mb-3 border-b border-[#33383D] pb-2 text-sm font-bold uppercase text-white">Search</h3>
                <div className="flex">
                  <input type="text" placeholder="Search products…" className="flex-1 border border-[#33383D] bg-[#141618] px-3 py-2 text-xs text-white placeholder:text-[#9B9C9E] focus:outline-none" />
                  <button className="bg-[#E21818] px-3 py-2 text-white hover:bg-[#C51515]" aria-label="Search"><Search className="h-4 w-4" /></button>
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
