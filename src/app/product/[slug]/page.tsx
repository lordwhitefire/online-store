import { Header } from "@/components/store/Header"
import { Footer } from "@/components/store/Footer"
import { ProductCard } from "@/components/store/ProductCard"
import { getProducts, getProduct } from "@/lib/data"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Star, ShoppingCart } from "lucide-react"

export async function generateStaticParams() {
  return getProducts().map(p => ({ slug: p.slug }))
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").replace(/\n+/g, "\n").trim()
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = getProduct(slug)
  if (!product) notFound()
  const related = getProducts().filter(p => p.slug !== slug).slice(0, 4)

  const cleanDesc = stripHtml(product.fullDescription || "")
  const cleanShortDesc = stripHtml(product.shortDescription || "")
  const priceMatch = product.price?.match(/\$[\d,.]+/g)
  const minPrice = priceMatch ? priceMatch[0] : ""

  return (
    <div className="flex min-h-screen flex-col bg-[#141618]">
      <Header />
      <main className="flex-1">
        <div className="border-b border-[#33383D] bg-[#1A1C1F] py-6 text-center">
          <nav className="text-xs text-[#9B9C9E]"><Link href="/" className="hover:text-[#E21818]">Home</Link><span className="mx-1">/</span><Link href="/shop" className="hover:text-[#E21818]">Shop</Link><span className="mx-1">/</span><span className="text-white">{product.name}</span></nav>
        </div>
        <div className="mx-auto max-w-7xl px-4 py-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div className="bg-white p-4">
              <img src={product.mainImage?.replace("https://musicplace.themerex.net/wp-content/uploads", "/musicplace/images") || ""} alt={product.name} className="w-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.opacity = "0.3" }} />
            </div>
            <div>
              <h1 className="mb-2 text-2xl font-bold text-white" style={{ fontFamily: "var(--font-lato)" }}>{product.name}</h1>
              <div className="mb-4 flex items-center gap-2">
                {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-4 w-4 fill-[#E21818] text-[#E21818]" />)}
                <span className="text-xs text-[#9B9C9E]">(1 review)</span>
              </div>
              <p className="mb-4 text-2xl font-bold text-[#E21818]">{minPrice}</p>
              {cleanShortDesc && <p className="mb-4 text-sm text-[#9B9C9E]">{cleanShortDesc}</p>}
              <div className="mb-6 flex items-center gap-4">
                <input type="number" defaultValue={1} min={1} className="w-16 border border-[#33383D] bg-[#141618] px-2 py-2 text-sm text-white" />
                <button className="flex items-center gap-2 bg-[#E21818] px-6 py-3 text-sm font-bold uppercase text-white hover:bg-[#C51515]"><ShoppingCart className="h-4 w-4" /> Add to Cart</button>
              </div>
              <div className="border-t border-[#33383D] pt-4">
                <p className="mb-1 text-xs text-[#9B9C9E]">SKU: {product.sku}</p>
                <p className="mb-1 text-xs text-[#9B9C9E]">Categories: {product.categories?.join(", ")}</p>
                <p className="text-xs text-[#9B9C9E]">Tags: {product.tags?.join(", ")}</p>
              </div>
            </div>
          </div>
          {cleanDesc && (
            <div className="mt-8 bg-[#1A1C1F] p-6">
              <h2 className="mb-4 text-sm font-bold uppercase text-white">Description</h2>
              <div className="space-y-3">{cleanDesc.split("\n").filter(Boolean).map((p, i) => <p key={i} className="text-sm leading-relaxed text-[#9B9C9E]">{p}</p>)}</div>
            </div>
          )}
          <div className="mt-8">
            <h2 className="mb-4 text-sm font-bold uppercase text-white">Related Products</h2>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">{related.map(p => <ProductCard key={p.slug} product={p} />)}</div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
